import { dataset, lib, listBuildingKeywords, abilityRefs, mfm } from "./library.mjs";
import { capitalize, normalizeName, profileRow, baseText, weaponProfile, coreAbilityLabel } from "./format.mjs";
import { convertLoadout, buildSizes } from "./units.mjs";

const ds = dataset;
const weaponKeywordCatalog = new Map(ds.weaponKeywords.all.map((entry) => [entry.id, entry]));
const forceDispositionNames = new Map(ds.forceDispositions.all.map((entry) => [entry.id, entry.name]));

function lineageOf(factionId) {
  const lineage = [];
  let current = factionId;
  while (current) {
    if (lineage.includes(current)) throw new Error(`Faction parent cycle at ${current}`);
    lineage.push(current);
    current = ds.factions.get(current)?.raw.parent_faction_id ?? null;
  }
  return lineage;
}

export function unitPool(factionId) {
  const faction = ds.factions.get(factionId).raw;
  const lineage = lineageOf(factionId);
  const rank = new Map(lineage.map((id, index) => [id, index]));
  const chosen = new Map();
  for (const view of lineage.flatMap((id) => ds.units.byFaction(id))) {
    const existing = chosen.get(view.id);
    if (!existing || rank.get(view.factionId) < rank.get(existing.factionId)) chosen.set(view.id, view);
  }
  const armyKeywords = new Set(faction.keywords ?? []);
  const exclusive = new Set(ds.alliedRules.all
    .filter((rule) => rule.exclusive && rule.source_faction_id === factionId)
    .flatMap((rule) => rule.source_datasheet_ids ?? []));
  return [...chosen.values()]
    .filter((view) => (view.raw.faction_keywords ?? []).every((keyword) => armyKeywords.has(keyword)))
    .filter((view) => !(view.raw.excluded_faction_keywords ?? []).some((keyword) => armyKeywords.has(keyword)))
    .filter((view) => !(exclusive.has(view.id) && view.raw.faction_id === factionId))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function factionDetachments(factionId) {
  return ds.detachments.byFaction(factionId).slice().sort((a, b) => a.name.localeCompare(b.name));
}

function phasesOf(pairs) {
  const out = new Set();
  for (const [type, id] of pairs) {
    if (!id) continue;
    for (const phase of ds.phasesFor(type, id)) out.add(phase);
  }
  return [...out];
}

function abilityRecord(id) {
  return id ? ds.abilities.get(id)?.raw ?? null : null;
}

function itemNames(view, composition) {
  const names = {};
  for (const weapon of view.weapons) names[weapon.id] = weapon.name;
  const rules = composition.loadout;
  const ids = new Set();
  for (const entry of [...rules.stock, ...rules.templates]) for (const item of entry.items) ids.add(item.id);
  for (const slot of rules.slots) for (const choice of slot.choices) for (const item of choice) ids.add(item.id);
  for (const limit of rules.limits) for (const choice of limit.choices) for (const item of choice) ids.add(item.id);
  for (const id of ids) {
    if (names[id]) continue;
    const wargear = ds.wargear.getAny(id);
    names[id] = wargear ? capitalize(wargear.name) : capitalize(id.replace(/-/g, " "));
  }
  return names;
}

function attachData(unitId, poolIds, poolViews) {
  const records = ds.leaderAttachments.filter((entry) => entry.leader_id === unitId);
  if (!records.length) return null;
  const ids = [];
  const groups = [];
  const push = (id) => {
    if (poolIds.has(id) && !ids.includes(id)) ids.push(id);
  };
  for (const record of records) {
    for (const id of record.eligible_bodyguard_ids ?? []) push(id);
    const required = (record.eligible_bodyguard_keywords ?? []).map((keyword) => keyword.toLowerCase());
    if (required.length) {
      for (const view of poolViews) {
        const owned = new Set([...(view.raw.keywords ?? []), ...(view.raw.faction_keywords ?? [])].map((keyword) => keyword.toLowerCase()));
        if (required.every((keyword) => owned.has(keyword))) push(view.id);
      }
    }
    for (const group of record.conditional_groups ?? []) {
      groups.push({
        role: group.role ?? null,
        ids: (group.eligible_bodyguard_ids ?? []).slice(),
        requiredUnits: group.required_roster_unit_ids ?? null,
        excludedUnits: group.excluded_roster_unit_ids ?? null,
        requiredDetachment: group.required_detachment_id ?? null,
        excludedDetachment: group.excluded_detachment_id ?? null,
        sharedKeyword: group.required_shared_keyword ?? null
      });
    }
  }
  return { ids, groups };
}

function keywordData(raw, armyKeywords) {
  const owned = new Set([...(raw.keywords ?? []), ...(raw.faction_keywords ?? []), raw.name]);
  const factionKeywords = raw.faction_keywords ?? [];
  if (armyKeywords.size > 0 && factionKeywords.every((keyword) => armyKeywords.has(keyword))) {
    for (const keyword of armyKeywords) owned.add(keyword);
  }
  const detachmentKeywords = [];
  const choiceKeywords = [];
  for (const grant of raw.conditional_keywords ?? []) {
    if (grant.choice_group) {
      choiceKeywords.push([grant.keyword, grant.choice_group]);
      continue;
    }
    if (grant.required_faction_keyword && !armyKeywords.has(grant.required_faction_keyword)) continue;
    if (grant.required_detachment_id) detachmentKeywords.push([grant.keyword, grant.required_detachment_id]);
    else owned.add(grant.keyword);
  }
  return { owned: [...owned], detachmentKeywords, choiceKeywords };
}

function attachChanges(view) {
  const result = [];
  for (const ability of view.abilities) {
    const gated = listBuildingKeywords.attachmentKeywordChanges(ability.raw);
    if (!gated) continue;
    const predicate = gated.predicate === null ? null : {
      allOf: gated.predicate.all_of ?? null,
      anyOf: gated.predicate.any_of ?? null,
      noneOf: gated.predicate.none_of ?? null,
      notAllOf: gated.predicate.not_all_of ?? null
    };
    result.push({ predicate, changes: gated.changes.map((change) => [change.add, change.key]) });
  }
  return result;
}

function tierRow(tier) {
  return [tier.models, tier.models_max ?? null, tier.cost, tier.unit_count_min ?? null, tier.unit_count_max ?? null];
}

function convertUnit(view, faction, armyKeywords, poolIds, poolViews, overlay, ListRules, report) {
  const raw = view.raw;
  const composition = ds.unitCompositionOf(raw);
  if (!composition || !composition.loadout) throw new Error(`${raw.id}: no MFM loadout composition`);
  const converted = convertLoadout(composition);
  const items = itemNames(view, composition);
  const keywords = keywordData(raw, armyKeywords);
  const overlayUnit = overlay ? overlay.unit(raw.id) : null;
  const abilities = [];
  raw.ability_ids.forEach((reference, index) => {
    const ability = view.abilities[index];
    if (!ability || ability.id !== abilityRefs.abilityRefId(reference)) throw new Error(`${raw.id}: ability order mismatch`);
    const value = abilityRefs.abilityRefValue(reference);
    const kind = ability.raw.ability_type === "core" ? "core" : ability.raw.ability_type === "faction" ? "faction" : "unit";
    const text = overlay && kind === "unit" ? overlay.abilityText(raw.id, ability.name) : "";
    if (overlay && kind === "unit" && !text) report.missingTexts.push(`${raw.name}: ${ability.name}`);
    abilities.push({
      id: ability.id,
      name: ability.name,
      label: kind === "core" ? coreAbilityLabel(ability.id, ability.name, value) : ability.name,
      kind,
      wargear: abilityRefs.abilityRefWargear(reference) ?? null,
      phases: phasesOf([["ability", ability.id]]),
      text
    });
  });
  const probe = { unit: { id: raw.id, name: raw.name, items, loadout: converted.layout, sizes: [] } };
  const built = buildSizes(raw, composition, converted, ListRules, probe);
  for (const note of built.notes) report.notes.push(`${faction.id}/${raw.id}: ${note}`);
  if (!built.sizes.length) report.skipped.push(`${faction.id}/${raw.id}: no buildable squad size`);
  return {
    id: raw.id,
    name: raw.name,
    role: raw.role ?? null,
    attachmentRole: raw.attachment_role ?? null,
    hint: overlay?.hints[raw.id] ?? "",
    summary: overlayUnit?.summary ?? "",
    wargearRules: overlayUnit?.wargearRules ?? [],
    legends: raw.is_legend === true,
    keywords: (raw.keywords ?? []).slice(),
    factionKeywords: (raw.faction_keywords ?? []).slice(),
    owned: keywords.owned,
    detachmentKeywords: keywords.detachmentKeywords,
    choiceKeywords: keywords.choiceKeywords,
    characterBase: raw.role === "character" || raw.role === "epic-hero" || (raw.keywords ?? []).includes("Character"),
    points: lib.hostPointsTiers(raw, faction, []).map(tierRow),
    detachmentPoints: (raw.detachment_pricing ?? []).map((tier) => [tier.detachment_id, ...tierRow(tier)]),
    pointsProvisional: raw.points_provisional === true,
    wargearCosts: (raw.wargear_costs ?? []).map((entry) => [entry.item_id, entry.cost]),
    abilityIds: abilityRefs.unitAbilityIds(raw.ability_ids),
    profiles: raw.profiles.map(profileRow),
    base: baseText(raw.base_size_mm),
    weapons: view.weapons.map((weapon) => ({
      id: weapon.id,
      name: weapon.name,
      type: weapon.type,
      profiles: weapon.profiles.map((profile) => weaponProfile(profile, weaponKeywordCatalog))
    })),
    abilities,
    transport: raw.transport_capacity ? { capacity: raw.transport_capacity.capacity, excluded: raw.transport_capacity.exclusion_keywords ?? [] } : null,
    rows: composition.models.map((model) => ({
      name: model.name,
      min: model.min,
      max: model.max,
      leader: model.is_leader_model === true,
      supreme: model.is_supreme_commander === true,
      cannotWarlord: model.cannot_be_warlord === true,
      nonCharacterWarlord: model.can_be_non_character_warlord === true,
      noEnhancement: model.excluded_from_enhancements === true
    })),
    items,
    loadout: converted.layout,
    sizes: built.sizes,
    attachChanges: attachChanges(view),
    attach: attachData(raw.id, poolIds, poolViews)
  };
}

function textFor(overlayItem, field) {
  return overlayItem && typeof overlayItem[field] === "string" ? overlayItem[field] : "";
}

function convertDetachment(raw, overlay, report) {
  const overlayDetachment = overlay ? overlay.detachment(raw.id) : null;
  if (overlay && !overlayDetachment) report.missingTexts.push(`Detachment ${raw.name}`);
  const ruleIds = raw.detachment_rule_ids ?? (raw.detachment_rule_id ? [raw.detachment_rule_id] : []);
  const rules = ruleIds.map((id, index) => {
    const ability = abilityRecord(id);
    return {
      id,
      name: ability ? ability.name : id,
      text: index === 0 ? textFor(overlayDetachment, "rule") : "",
      phases: phasesOf([["ability", id], ["detachment-rule", id], ["detachment-rule", raw.id]])
    };
  });
  const enhancements = (raw.enhancement_ids ?? []).map((id) => {
    const item = ds.enhancements.get(id);
    if (!item) throw new Error(`${raw.id}: unknown enhancement ${id}`);
    const overlayItem = overlay ? overlay.enhancement(raw.id, item.name) : null;
    if (overlay && !overlayItem) report.missingTexts.push(`Enhancement ${item.name}`);
    return {
      id: item.id,
      name: item.name,
      cost: item.cost ?? 0,
      detachmentId: item.detachment_id,
      upgrade: item.upgrade_tag === true,
      maxTargets: item.max_targets ?? 1,
      counts: item.counts_toward_enhancement_limit !== false,
      nonCharacter: item.upgrade_tag === true || item.equipable_by_non_character === true,
      epicHero: item.equipable_by_epic_hero === true,
      notWarlord: item.bearer_cannot_be_warlord === true,
      requiredWargear: item.required_wargear_ids ?? [],
      requiredAbilities: item.required_ability_ids ?? [],
      keywordGroups: item.keyword_restriction_groups ?? (item.keyword_restrictions ? [item.keyword_restrictions] : []),
      datasheetGroups: (item.datasheet_restriction_groups ?? []).map((group) => [group.unit_id, group.keywords ?? []]),
      excluded: item.exclusion_keywords ?? [],
      bodyguards: item.attachment_bodyguard_ids ?? [],
      provisional: item.points_provisional === true,
      text: textFor(overlayItem, "effect"),
      restriction: textFor(overlayItem, "restriction"),
      note: textFor(overlayItem, "ruleNote"),
      phases: phasesOf([["ability", item.ability_id], ["enhancement", item.id]])
    };
  });
  const stratagems = (raw.stratagem_ids ?? []).map((id) => {
    const item = ds.stratagems.get(id);
    if (!item) throw new Error(`${raw.id}: unknown stratagem ${id}`);
    const overlayItem = overlay ? overlay.stratagem(raw.id, item.name) : null;
    if (overlay && !overlayItem) report.missingTexts.push(`Stratagem ${item.name}`);
    return {
      id: item.id,
      name: overlayItem ? overlayItem.name : item.name,
      cp: item.cp_cost,
      type: item.type ?? null,
      phases: (item.phases ?? []).slice(),
      turn: item.player_turn ?? "either",
      timing: item.timing ?? null,
      targetKeywords: item.target_restrictions?.required_keywords ?? [],
      text: textFor(overlayItem, "effect")
    };
  });
  return {
    id: raw.id,
    name: raw.name,
    dp: raw.detachment_points ?? 0,
    forceDispositions: (raw.force_dispositions ?? []).map((id) => forceDispositionNames.get(id) ?? capitalize(id.replace(/-/g, " "))),
    tags: (raw.tags ?? []).slice(),
    restrictions: raw.restrictions ? { required: raw.restrictions.required_keywords ?? [], excluded: raw.restrictions.excluded_keywords ?? [] } : null,
    grantedWarlords: raw.granted_warlord_datasheet_ids ?? [],
    mandatoryWarlords: raw.mandatory_warlord_datasheet_ids ?? [],
    excludedUnits: raw.excluded_datasheet_ids ?? [],
    unitMinimums: (raw.unit_minimums ?? []).map((entry) => [entry.keyword, entry.min]),
    keywordLimitOverrides: (raw.keyword_limit_overrides ?? []).map((entry) => ({ keywords: entry.keywords.slice(), max: entry.max })),
    rules,
    enhancements,
    stratagems
  };
}

export function alliance(keywords) {
  if (keywords.includes("Imperium")) return "Imperium";
  if (keywords.includes("Chaos")) return "Chaos";
  return "Xenos";
}

export function convertFaction(factionId, overlay, ListRules) {
  const faction = ds.factions.get(factionId).raw;
  const report = { notes: [], skipped: [], missingTexts: [] };
  const armyKeywords = new Set(faction.keywords ?? []);
  const poolViews = unitPool(factionId);
  const poolIds = new Set(poolViews.map((view) => view.id));
  const units = [];
  for (const view of poolViews) {
    const unit = convertUnit(view, faction, armyKeywords, poolIds, poolViews, overlay, ListRules, report);
    if (unit.sizes.length) units.push(unit);
  }
  const detachments = factionDetachments(factionId).map((raw) => convertDetachment(raw, overlay, report));
  const groupIds = new Set(units.flatMap((unit) => unit.choiceKeywords.map((entry) => entry[1])));
  const choiceGroups = ds.keywordChoiceGroups.all
    .filter((group) => groupIds.has(group.id))
    .map((group) => ({
      id: group.id,
      name: group.name,
      detachmentId: group.detachment_id ?? null,
      mandatory: group.mandatory === true,
      minUnits: group.min_units ?? null,
      maxUnits: group.max_units ?? null
    }));
  for (const id of groupIds) if (!choiceGroups.some((group) => group.id === id)) throw new Error(`${factionId}: unknown keyword choice group ${id}`);
  const armyRules = (faction.faction_rule_ids ?? []).map((id) => {
    const ability = abilityRecord(id);
    const name = ability ? ability.name : id;
    const matches = overlay?.armyRule && normalizeName(overlay.armyRule.name) === normalizeName(name);
    if (overlay && !matches) report.missingTexts.push(`Army rule ${name}`);
    return {
      id,
      name,
      text: matches ? overlay.armyRule.text : "",
      sections: matches ? overlay.armyRule.sections : [],
      phases: phasesOf([["ability", id]])
    };
  });
  const data = {
    id: faction.id,
    name: faction.name,
    parentId: faction.parent_faction_id ?? null,
    keywords: (faction.keywords ?? []).slice(),
    alliance: alliance(faction.keywords ?? []),
    armyRules,
    keywordLimits: (faction.keyword_limits ?? []).map((limit) => ({
      keywords: limit.keywords.slice(),
      max: limit.max,
      mode: limit.mode ?? "units",
      exempt: limit.exempt_faction_keywords ?? []
    })),
    choiceGroups,
    units,
    detachments
  };
  if (overlay) {
    data.legacy = {
      enhancements: overlay.legacyEnhancementIds((detachmentId, name) => {
        const detachment = detachments.find((entry) => entry.id === detachmentId);
        const found = detachment?.enhancements.find((item) => normalizeName(item.name) === normalizeName(name));
        return found ? found.id : null;
      })
    };
  }
  return { data, report };
}

export function datasetInfo() {
  const versions = ds.gameVersions.slice().sort((a, b) => a.effective_date.localeCompare(b.effective_date));
  const latest = versions[versions.length - 1];
  return { latest, mfm };
}
