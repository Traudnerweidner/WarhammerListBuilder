import { readFileSync } from "node:fs";
import { dataset as ds, lib, mfm, mfmSearch, rosterResolve } from "./lib/library.mjs";
import { unitPool } from "./lib/convert.mjs";
import { assignmentFor } from "./lib/units.mjs";
import { createRuntime, root } from "./lib/runtime.mjs";

const SEED = Number(process.env.VERIFY_SEED ?? 20261127);
const MUTATIONS = Number(process.env.VERIFY_MUTATIONS ?? 40);
const CANDIDATES = Number(process.env.VERIFY_CANDIDATES ?? 30);
const ROSTERS = Number(process.env.VERIFY_ROSTERS ?? 120);

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const random = mulberry32(SEED);
const pick = (list) => list[Math.floor(random() * list.length)];
const chance = (p) => random() < p;

const indexSource = readFileSync(root + "data/index.js", "utf8");
const files = [...indexSource.matchAll(/"file":"([^"]+)"/g)].map((match) => match[1]);
const runtime = createRuntime(["data/index.js", ...files]);
const R = runtime.ListRules;
const failures = [];
const stats = { units: 0, splits: 0, candidates: 0, mutations: 0, stricter: 0, prices: 0, rosters: 0, rosterCodes: {} };
const stricterExamples = [];
const fail = (message) => {
  failures.push(message);
  if (failures.length <= 40) console.error("FAIL " + message);
};

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function countsMap(counts) {
  return new Map(Object.entries(counts).filter(([, n]) => n > 0));
}

function randomPicks(slot) {
  for (let attempt = 0; attempt < 25; attempt++) {
    const picks = [];
    for (let i = 0; i < slot.picks; i++) picks.push(Math.floor(random() * slot.choices.length));
    if (R.validPicks(slot, picks)) return picks;
  }
  return null;
}

function randomModelPick(row, current, bareUsed) {
  const modes = [];
  if (!row.plain || row.template.length) modes.push("regular");
  if (row.alternate.length) modes.push("alternate");
  if (row.bare > bareUsed || current.mode === "bare") modes.push("bare");
  const mode = pick(modes);
  if (mode === "bare") return { mode, picks: [] };
  if (row.plain) return { mode: "regular", picks: [] };
  const slots = mode === "alternate" ? row.alternate : row.regular;
  const picks = [];
  for (const slot of slots) {
    const next = randomPicks(slot);
    if (!next) return plain(current);
    picks.push(next);
  }
  return { mode, picks };
}

function mutate(unit, loadout) {
  const next = plain(loadout);
  const changes = 1 + Math.floor(random() * 4);
  for (let c = 0; c < changes; c++) {
    const rows = next.rows.map((models, r) => [r, models]).filter(([, models]) => models.length);
    if (unit.loadout.unitSlots.length && chance(0.2)) {
      const s = Math.floor(random() * unit.loadout.unitSlots.length);
      const picks = randomPicks(unit.loadout.unitSlots[s]);
      if (picks) next.unit[s] = picks;
      continue;
    }
    if (!rows.length) continue;
    const [r, models] = pick(rows);
    const m = Math.floor(random() * models.length);
    next.rows[r][m] = randomModelPick(unit.loadout.rows[r], models[m], models.filter((model) => model.mode === "bare").length);
  }
  return next;
}

// ---------- 1. Loadouts ----------

const seenUnits = new Set();
for (const info of runtime.run("FACTION_LIBRARY.index")) {
  R.useFaction(info.id);
  const faction = R.faction();
  const views = new Map(unitPool(info.id).map((view) => [view.id, view]));
  const factionRaw = ds.factions.get(info.id).raw;
  for (const unit of faction.units) {
    const view = views.get(unit.id);
    if (!view) {
      fail(`${info.id}/${unit.id}: unit missing from library pool`);
      continue;
    }
    for (const size of unit.sizes) {
      for (let ordinal = 1; ordinal <= 4; ordinal++) {
        const mine = R.tierCost(unit.points, size.models, ordinal);
        const theirs = lib.hostUnitPoints(view.raw, size.models, ordinal, factionRaw, []);
        stats.prices++;
        if ((mine ?? 0) !== theirs) fail(`${info.id}/${unit.id}@${size.models}#${ordinal}: points ${mine} vs library ${theirs}`);
        for (const row of unit.detachmentPoints) {
          const detMine = R.tierCost(R.pointsTable(unit, [row[0]]), size.models, ordinal);
          const detTheirs = lib.hostUnitPoints(view.raw, size.models, ordinal, factionRaw, [row[0]]);
          if ((detMine ?? 0) !== detTheirs) fail(`${info.id}/${unit.id}@${size.models}#${ordinal} ${row[0]}: points ${detMine} vs library ${detTheirs}`);
        }
      }
    }
    const key = `${view.raw.faction_id}/${unit.id}`;
    if (seenUnits.has(key)) continue;
    seenUnits.add(key);
    stats.units++;
    const composition = ds.unitCompositionOf(view.raw);
    const rules = composition.loadout;
    const order = unit.loadout.rows.map((row) => row.name);
    for (const size of unit.sizes) {
      size.splits.forEach((split, splitIndex) => {
        stats.splits++;
        const rowsMap = new Map(order.map((row, r) => [row, split.rows[r]]));
        const library = (counts) => mfm.checkMfmLoadout(rules, rowsMap, countsMap(counts)).length === 0;
        const checkedDefault = R.checkLoadout(unit, size.models, splitIndex, split.loadout);
        if (!checkedDefault.valid) fail(`${key}@${size.models}/${splitIndex}: default invalid`);
        const wargear = lib.wargearPoints(view.raw, countsMap(checkedDefault.counts));
        const mineCost = R.unitCost(unit, size.models, 1, checkedDefault.counts, []);
        if (mineCost.wargear !== wargear) fail(`${key}@${size.models}: wargear points ${mineCost.wargear} vs ${wargear}`);
        let found;
        try {
          found = mfmSearch.mfmConfigurations(rules, rowsMap, CANDIDATES).configurations;
        } catch (error) {
          found = [];
        }
        for (const configuration of found) {
          stats.candidates++;
          let assignment;
          try {
            assignment = assignmentFor(unit.loadout, order, rowsMap, configuration);
          } catch (error) {
            fail(`${key}@${size.models}: candidate cannot be expressed: ${error.message}`);
            continue;
          }
          const checked = R.checkLoadout(unit, size.models, splitIndex, assignment);
          if (!checked.valid) fail(`${key}@${size.models}: library candidate rejected: ${checked.errors.join(" ")}`);
        }
        for (let i = 0; i < MUTATIONS; i++) {
          const loadout = mutate(unit, split.loadout);
          const checked = R.checkLoadout(unit, size.models, splitIndex, loadout);
          if (!checked.structural) {
            fail(`${key}@${size.models}: mutation produced a structurally invalid loadout`);
            continue;
          }
          stats.mutations++;
          const legal = library(checked.counts);
          if (checked.valid && !legal) fail(`${key}@${size.models}: accepted a loadout the library rejects ${JSON.stringify(checked.counts)}`);
          if (!checked.valid && legal) {
            stats.stricter++;
            if (stricterExamples.length < 15) stricterExamples.push(`${key}@${size.models}: ${checked.errors.join(" ")}`);
          }
        }
      });
    }
  }
}

// ---------- 2. Rosters ----------

const LIBRARY_CODES = new Set([
  "enhancement-wrong-detachment", "enhancement-on-non-character", "enhancement-on-epic-hero", "enhancement-bearer-cannot-be-warlord",
  "enhancement-missing-wargear", "enhancement-on-excluded-model", "enhancement-keyword-mismatch", "enhancement-missing-ability",
  "enhancement-excluded-keyword", "enhancement-over-max-targets", "leader-attachment-illegal", "leader-must-attach",
  "points-over-limit", "detachment-points-over", "detachment-tag-conflict", "detachment-restriction-required",
  "detachment-restriction-excluded", "no-warlord", "warlord-not-mandated", "cannot-be-warlord", "warlord-not-character",
  "warlord-not-supreme-commander", "detachment-excluded-datasheet", "unit-limit-exceeded", "enhancement-limit-exceeded",
  "keyword-limit-exceeded", "unit-minimum-unmet"
]);
const FORBIDDEN = new Set(["unit-chapter-mismatch", "unit-excluded-from-faction", "ally-pool-not-offered"]);

function randomRoster(faction) {
  const battleSize = pick(["incursion", "strike-force"]);
  const state = R.fresh(faction.id);
  state.battleSize = battleSize;
  state.budget = R.battleSizes[battleSize].points;
  const detachments = faction.detachments.slice();
  const count = chance(0.7) ? 1 : 2;
  for (let i = 0; i < count && detachments.length; i++) state.detachments.push(detachments.splice(Math.floor(random() * detachments.length), 1)[0].id);
  const units = faction.units.filter((unit) => unit.sizes.length);
  const characters = units.filter((unit) => unit.characterBase);
  const total = 2 + Math.floor(random() * 8);
  for (let i = 0; i < total; i++) {
    const unit = chance(0.35) && characters.length ? pick(characters) : pick(units);
    const entry = R.newEntry(unit, `entry-${i + 1}`);
    const size = pick(unit.sizes);
    entry.models = size.models;
    entry.split = Math.floor(random() * size.splits.length);
    entry.loadout = plain(size.splits[entry.split].loadout);
    if (chance(0.3)) entry.loadout = mutate(unit, entry.loadout);
    const groups = {};
    for (const [keyword, group] of unit.choiceKeywords) (groups[group] ??= []).push(keyword);
    entry.keywords = Object.values(groups).filter(() => chance(0.4)).map((list) => pick(list));
    state.entries.push(plain(entry));
  }
  const pool = R.enhancements(state.detachments);
  const anyPool = R.enhancements(faction.detachments.map((detachment) => detachment.id));
  state.entries.forEach((entry) => {
    const unit = R.findUnit(entry.unitId);
    if (unit.characterBase && chance(0.45) && pool.length) entry.enhancementId = pick(pool).id;
    else if (chance(0.05) && anyPool.length) entry.enhancementId = pick(anyPool).id;
  });
  const counts = {};
  for (const entry of state.entries) counts[entry.unitId] = (counts[entry.unitId] ?? 0) + 1;
  state.entries.forEach((entry, index) => {
    if (!R.attachmentRole(state, index) || !chance(0.65)) return;
    const eligible = R.attachmentTargets(state, index);
    const candidates = (chance(0.75) && eligible.length ? eligible : state.entries.filter((other) => other.id !== entry.id).map((other) => other.id))
      .filter((id) => counts[state.entries.find((other) => other.id === id).unitId] === 1);
    if (candidates.length) entry.attachedTo = pick(candidates);
  });
  const warlords = R.warlordCandidates(state);
  state.warlordId = chance(0.85) && warlords.length ? pick(warlords) : chance(0.5) ? pick(state.entries).id : null;
  return state;
}

for (const info of runtime.run("FACTION_LIBRARY.index")) {
  R.useFaction(info.id);
  const faction = R.faction();
  for (let n = 0; n < ROSTERS; n++) {
    const state = randomRoster(faction);
    const summary = R.rosterSummary(state);
    const spec = {
      factionId: info.id,
      battleSize: state.battleSize,
      forceDisposition: "take-and-hold",
      detachmentIds: state.detachments.slice(),
      units: state.entries.map((entry, index) => {
        const target = state.entries.find((other) => other.id === entry.attachedTo);
        return {
          unitId: entry.unitId,
          modelCount: entry.models,
          isWarlord: state.warlordId === entry.id,
          keywordOverrides: entry.keywords.slice(),
          enhancementId: entry.enhancementId,
          leaderBodyguardId: target ? target.unitId : null,
          counts: countsMap(summary.loadouts[index].counts)
        };
      })
    };
    const theirs = rosterResolve.validateRosterCore(spec, ds);
    stats.rosters++;
    const theirCodes = new Set(theirs.army.filter((issue) => issue.severity === "error").map((issue) => issue.code));
    for (const code of theirCodes) if (FORBIDDEN.has(code)) fail(`${info.id}: library reports ${code}`);
    const myCodes = new Set(summary.codes);
    const incursionException = state.battleSize === "incursion" && state.detachments.length === 1 && summary.dp === 3;
    for (const code of LIBRARY_CODES) {
      if (code === "detachment-points-over" && incursionException) continue;
      const a = myCodes.has(code);
      const b = theirCodes.has(code);
      if (a !== b) {
        const detail = theirs.army.filter((issue) => issue.code === code).map((issue) => issue.message).join("; ") ||
          summary.errors.filter((message, index) => summary.codes[index] === code).join("; ");
        fail(`${info.id} roster ${n}: ${code} mine=${a} library=${b} :: ${detail}`);
      }
      if (b) stats.rosterCodes[code] = (stats.rosterCodes[code] ?? 0) + 1;
    }
    theirs.units.forEach((unitResult) => {
      const mine = summary.loadouts[unitResult.unitIndex];
      if (mine && mine.valid && unitResult.violations.length) fail(`${info.id} roster ${n}: loadout accepted but library rejects ${unitResult.unitId}`);
    });
  }
}

// ---------- 3. Audits ----------

const audits = [];
for (const info of runtime.run("FACTION_LIBRARY.index")) {
  R.useFaction(info.id);
  const faction = R.faction();
  const exact = new Set();
  const folded = new Map();
  for (const unit of faction.units) {
    for (const keyword of [...unit.owned, ...unit.detachmentKeywords.map((k) => k[0]), ...unit.choiceKeywords.map((k) => k[0])]) {
      exact.add(keyword);
      folded.set(R.keywordKey(keyword), keyword);
    }
  }
  const restricted = [];
  for (const detachment of faction.detachments) {
    for (const item of detachment.enhancements) {
      for (const group of item.keywordGroups) restricted.push(...group);
      for (const group of item.datasheetGroups) restricted.push(...group[1]);
      restricted.push(...item.excluded);
    }
    if (detachment.restrictions) restricted.push(...detachment.restrictions.required, ...detachment.restrictions.excluded);
    restricted.push(...detachment.unitMinimums.map((entry) => entry[0]));
  }
  for (const limit of faction.keywordLimits) restricted.push(...limit.keywords);
  for (const keyword of new Set(restricted)) {
    if (!exact.has(keyword) && folded.has(R.keywordKey(keyword))) audits.push(`${info.id}: keyword "${keyword}" only matches "${folded.get(R.keywordKey(keyword))}" case-insensitively`);
  }
  for (const unit of faction.units) {
    if (!unit.attach) continue;
    for (const id of unit.attach.ids) {
      const target = R.findUnit(id);
      if (target && target.attachmentRole) audits.push(`${info.id}: ${unit.id} may attach to ${id}, which has attachment role ${target.attachmentRole}`);
    }
  }
}

console.log(JSON.stringify(stats, null, 1));
if (stricterExamples.length) console.log("Assignment-level stricter examples:\n  " + stricterExamples.join("\n  "));
if (audits.length) console.log(`Audits (${audits.length}):\n  ` + [...new Set(audits)].slice(0, 60).join("\n  "));
if (failures.length) {
  console.error(`\n${failures.length} verification failure(s).`);
  process.exit(1);
}
console.log("\nAll verifications passed.");
