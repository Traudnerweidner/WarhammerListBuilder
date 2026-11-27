import { mfm, mfmUnit, mfmSearch, unitLoadoutModule } from "./library.mjs";

const items = (list) => (list ?? []).map((item) => [item.id, item.count]);

export function rowLabel(row) {
  const hash = row.lastIndexOf("#");
  const suffix = hash > 0 ? row.slice(hash + 1) : "";
  return /^[1-9][0-9]*$/.test(suffix) ? `${row.slice(0, hash)} (${suffix})` : row;
}

function convertSlot(slot, choices) {
  const hasEmpty = choices.some((choice) => choice.length === 0);
  return {
    picks: slot.repeats || hasEmpty ? slot.picks : Math.min(slot.picks, choices.length),
    repeats: slot.repeats === true,
    choices: choices.map(items)
  };
}

export function convertLoadout(composition) {
  const rules = composition.loadout;
  const order = unitLoadoutModule.mfmGroupRowOrder(composition);
  const unitStock = mfm.copiesOf(rules.stock.filter((row) => row.model === undefined).flatMap((row) => row.items));
  const rows = order.map((name) => {
    const slots = rules.slots.filter((slot) => slot.model === name);
    const stock = mfm.modelStock(rules, name);
    const template = rules.templates.find((entry) => entry.model === name)?.items ?? [];
    return {
      name,
      label: rowLabel(name),
      plain: slots.length === 0,
      regular: slots.filter((slot) => !slot.alternate).map((slot) => convertSlot(slot, mfm.rowSlotChoices(rules, slot, stock))),
      alternate: slots.filter((slot) => slot.alternate).map((slot) => convertSlot(slot, slot.choices.filter((choice) => choice.length > 0))),
      template: items(template),
      bare: mfm.bareModels(rules, name),
      caps: [...mfm.checkboxCaps(rules, name, 1)],
      individual: rules.stock.some((row) => row.model === name && row.individual === true)
    };
  });
  return {
    order,
    layout: {
      rows,
      unitSlots: rules.slots.filter((slot) => slot.model === undefined).map((slot) => convertSlot(slot, mfm.slotChoices(slot, unitStock))),
      unitCaps: [...mfm.checkboxCaps(rules, undefined)],
      limits: rules.limits.map((limit) => ({
        row: limit.model ?? null,
        points: limit.breakpoints.map((point) => [point.models, point.choices, point.per_choice ?? null]),
        choices: limit.choices.map(items)
      })),
      uniform: rules.uniform.map((set) => ({
        row: set.model ?? null,
        choices: set.choices.map((choice) => ({ items: items(choice.items), substitute: choice.substitute === true }))
      }))
    }
  };
}

function indexCombinations(choices, picks, repeats) {
  const out = [];
  const hasEmpty = choices.some((choice) => choice.length === 0);
  const walk = (from, left, acc) => {
    if (left === 0) {
      out.push(acc);
      return;
    }
    for (let i = from; i < choices.length; i++) walk(repeats || choices[i].length === 0 ? i : i + 1, left - 1, [...acc, i]);
  };
  walk(0, repeats || hasEmpty ? picks : Math.min(picks, choices.length), []);
  return out;
}

function addTo(target, list, times = 1) {
  for (const [id, count] of list) target.set(id, (target.get(id) ?? 0) + count * times);
}

function fitsWithin(partial, target) {
  for (const [id, count] of partial) if (count > (target.get(id) ?? 0)) return false;
  return true;
}

function sameCopies(a, b) {
  const ids = new Set([...a.keys(), ...b.keys()]);
  for (const id of ids) if ((a.get(id) ?? 0) !== (b.get(id) ?? 0)) return false;
  return true;
}

export function findPicks(slots, target) {
  const result = [];
  const walk = (index, partial) => {
    if (index === slots.length) return sameCopies(partial, target);
    for (const combo of indexCombinations(slots[index].choices, slots[index].picks, slots[index].repeats)) {
      const next = new Map(partial);
      for (const choice of combo) addTo(next, slots[index].choices[choice]);
      if (!fitsWithin(next, target)) continue;
      result.push(combo);
      if (walk(index + 1, next)) return true;
      result.pop();
    }
    return false;
  };
  return walk(0, new Map()) ? result : null;
}

export function bundlePick(row, target) {
  if (target.size === 0 || [...target.values()].every((n) => n === 0)) {
    if (row.plain && row.template.length === 0) return { mode: "regular", picks: [] };
    const regular = row.plain ? null : findPicks(row.regular, new Map());
    if (regular) return { mode: "regular", picks: regular };
    if (row.bare > 0) return { mode: "bare", picks: [] };
  }
  if (row.plain) {
    const template = new Map();
    addTo(template, row.template);
    return sameCopies(template, target) ? { mode: "regular", picks: [] } : null;
  }
  const regular = findPicks(row.regular, target);
  if (regular) return { mode: "regular", picks: regular };
  if (row.alternate.length) {
    const alternate = findPicks(row.alternate, target);
    if (alternate) return { mode: "alternate", picks: alternate };
  }
  return null;
}

function configurationFor(rules, rowsMap) {
  const base = mfmUnit.mfmBaseLoadout(rules, rowsMap);
  if (base && base.legal) {
    const found = mfmSearch.mfmAssignment(rules, rowsMap, base.counts);
    if (found) return { configuration: found, base: true };
  }
  let first = null;
  mfmSearch.forEachMfmConfiguration(rules, rowsMap, (configuration) => {
    first = configuration;
    return true;
  });
  return first ? { configuration: first, base: false } : null;
}

export function assignmentFor(layout, order, rowsMap, configuration) {
  const rows = [];
  for (let r = 0; r < order.length; r++) {
    const row = layout.rows[r];
    const models = rowsMap.get(order[r]) ?? 0;
    const picks = [];
    for (const group of configuration.groups.filter((entry) => entry.model === order[r])) {
      const target = new Map();
      addTo(target, items(group.items));
      const pick = bundlePick(row, target);
      if (!pick) throw new Error(`No pick reproduces bundle ${JSON.stringify(group.items)} on row ${order[r]}`);
      for (let i = 0; i < group.count; i++) picks.push(JSON.parse(JSON.stringify(pick)));
    }
    while (picks.length < models) {
      if (row.bare <= 0) throw new Error(`Row ${order[r]} has unassigned models but no bare allowance`);
      picks.push({ mode: "bare", picks: [] });
    }
    if (picks.length !== models) throw new Error(`Row ${order[r]} received ${picks.length} picks for ${models} models`);
    rows.push(picks);
  }
  const unitTarget = new Map();
  addTo(unitTarget, items(configuration.unit));
  const unitPicks = findPicks(layout.unitSlots, unitTarget);
  if (!unitPicks) throw new Error(`No unit picks reproduce ${JSON.stringify(configuration.unit)}`);
  return { rows, unit: unitPicks };
}

export function buildSizes(unit, composition, converted, ListRules, probe) {
  const sizes = [];
  const max = unit.max_model_count ?? Infinity;
  const notes = [];
  const counts = [];
  for (const tier of composition.tiers?.length ? composition.tiers : [{ models: composition.models }]) {
    counts.push(tier.models.reduce((sum, model) => sum + (model.min ?? 0), 0), tier.models.reduce((sum, model) => sum + (model.max ?? 0), 0));
  }
  const low = Math.min(unit.model_count.min, ...counts);
  const high = Math.max(unit.model_count.max, ...counts);
  for (let models = low; models <= high; models++) {
    if (models > max) continue;
    const splits = [];
    for (const rowsMap of mfmUnit.mfmRowSplits(composition, models)) {
      const found = configurationFor(composition.loadout, rowsMap);
      if (!found) continue;
      const loadout = assignmentFor(converted.layout, converted.order, rowsMap, found.configuration);
      const split = { rows: converted.order.map((row) => rowsMap.get(row) ?? 0), loadout };
      probe.unit.sizes = [{ models, splits: [split] }];
      const checked = ListRules.checkLoadout(probe.unit, models, 0, loadout);
      if (!checked.valid) throw new Error(`${unit.id}@${models}: generated default is invalid: ${checked.errors.join(" ")}`);
      const counts = new Map(Object.entries(checked.counts).filter(([, n]) => n > 0));
      const expected = new Map([...found.configuration.counts].filter(([, n]) => n > 0));
      if (!sameCopies(counts, expected)) throw new Error(`${unit.id}@${models}: default counts differ from the library configuration`);
      const violations = mfm.checkMfmLoadout(composition.loadout, rowsMap, counts);
      if (violations.length) throw new Error(`${unit.id}@${models}: library rejects default: ${violations[0].message}`);
      if (!found.base) notes.push(`${models} models: dataset default loadout is not legal; using the first legal loadout`);
      splits.push(split);
    }
    if (splits.length) sizes.push({ models, splits });
  }
  return { sizes, notes };
}
