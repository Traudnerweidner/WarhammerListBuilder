var ListRules = (function () {
  var active = null;
  var battleSizes = {
    incursion: { name: 'Incursion', points: 1000, dp: 2, enhancements: 2, units: 2 },
    'strike-force': { name: 'Strike Force', points: 2000, dp: 3, enhancements: 4, units: 3 }
  };
  var MAX_ENTRIES = 300;
  var STATE_VERSION = 3;

  // ---------- Helpers ----------

  function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  function record(value) {
    return value !== null && typeof value === 'object' && !isArray(value);
  }

  function has(object, key) {
    return object !== null && typeof object === 'object' && Object.prototype.hasOwnProperty.call(object, key);
  }

  function integer(value, minimum) {
    return typeof value === 'number' && isFinite(value) && value >= minimum && Math.floor(value) === value;
  }

  function contains(items, value) {
    var i;
    for (i = 0; i < (items || []).length; i += 1) {
      if (items[i] === value) return true;
    }
    return false;
  }

  function byId(items, id) {
    var i;
    for (i = 0; i < (items || []).length; i += 1) {
      if (items[i].id === id) return items[i];
    }
    return null;
  }

  function copy(value) {
    var result;
    var key;
    var i;
    if (isArray(value)) {
      result = [];
      for (i = 0; i < value.length; i += 1) result.push(copy(value[i]));
      return result;
    }
    if (value && typeof value === 'object') {
      result = {};
      for (key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) result[key] = copy(value[key]);
      }
      return result;
    }
    return value;
  }

  function keywordKey(keyword) {
    return String(keyword).toUpperCase().replace(/\u2019/g, '\'');
  }

  function countOf(map, id) {
    return has(map, id) ? map[id] : 0;
  }

  function addItems(target, items, times) {
    var i;
    for (i = 0; i < items.length; i += 1) {
      target[items[i][0]] = countOf(target, items[i][0]) + items[i][1] * times;
    }
  }

  function addCounts(target, source) {
    var key;
    for (key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = countOf(target, key) + source[key];
    }
  }

  function containsItems(bundle, items) {
    var i;
    if (!items.length) return false;
    for (i = 0; i < items.length; i += 1) {
      if (countOf(bundle, items[i][0]) < items[i][1]) return false;
    }
    return true;
  }

  function entryId(value) {
    return typeof value === 'string' && /^entry-[1-9][0-9]*$/.test(value);
  }

  function entryIndex(entries, id) {
    var i;
    if (typeof id !== 'string' || !id) return -1;
    for (i = 0; i < entries.length; i += 1) {
      if (entries[i].id === id) return i;
    }
    return -1;
  }

  // ---------- Fraktionen ----------

  function library() {
    return typeof FACTION_LIBRARY !== 'undefined' && FACTION_LIBRARY ? FACTION_LIBRARY : null;
  }

  function factionData(id) {
    var lib = library();
    return lib && typeof id === 'string' && has(lib.factions, id) ? lib.factions[id] : null;
  }

  function factionIndex() {
    var lib = library();
    return lib && isArray(lib.index) ? lib.index : [];
  }

  function factionInfo(id) {
    return byId(factionIndex(), id);
  }

  function useFaction(id) {
    active = factionData(id);
    return active !== null;
  }

  function faction() {
    return active;
  }

  function findUnit(unitId) {
    return active ? byId(active.units, unitId) : null;
  }

  function findDetachment(detachmentId) {
    return active ? byId(active.detachments, detachmentId) : null;
  }

  function enhancement(id) {
    var item;
    var i;
    if (!active || typeof id !== 'string') return null;
    for (i = 0; i < active.detachments.length; i += 1) {
      item = byId(active.detachments[i].enhancements, id);
      if (item) return item;
    }
    return null;
  }

  function enhancements(detachmentIds) {
    var result = [];
    var i;
    var j;
    if (!active || !isArray(detachmentIds)) return result;
    for (i = 0; i < active.detachments.length; i += 1) {
      if (!contains(detachmentIds, active.detachments[i].id)) continue;
      for (j = 0; j < active.detachments[i].enhancements.length; j += 1) result.push(active.detachments[i].enhancements[j]);
    }
    return result;
  }

  function itemName(unit, id) {
    return unit && has(unit.items, id) ? unit.items[id] : id;
  }

  // ---------- Modellzahlen & Ausrüstung ----------

  function sizeOf(unit, models) {
    var i;
    if (!unit) return null;
    for (i = 0; i < unit.sizes.length; i += 1) {
      if (unit.sizes[i].models === models) return unit.sizes[i];
    }
    return null;
  }

  function splitOf(unit, models, split) {
    var size = sizeOf(unit, models);
    return size && integer(split, 0) && split < size.splits.length ? size.splits[split] : null;
  }

  function defaultSize(unit) {
    return unit && unit.sizes.length ? unit.sizes[0].models : null;
  }

  function defaultLoadout(unit, models, split) {
    var found = splitOf(unit, models, split);
    return found ? copy(found.loadout) : null;
  }

  function rowSlots(row, mode) {
    return mode === 'alternate' ? row.alternate : row.regular;
  }

  function validPicks(slot, picks) {
    var used = {};
    var index;
    var i;
    if (!isArray(picks) || picks.length !== slot.picks) return false;
    for (i = 0; i < picks.length; i += 1) {
      index = picks[i];
      if (!integer(index, 0) || index >= slot.choices.length) return false;
      if (!slot.repeats && slot.choices[index].length) {
        if (has(used, String(index))) return false;
        used[String(index)] = true;
      }
    }
    return true;
  }

  function pickedItems(slots, picks) {
    var bundle = {};
    var i;
    var j;
    if (!isArray(picks) || picks.length !== slots.length) return null;
    for (i = 0; i < slots.length; i += 1) {
      if (!validPicks(slots[i], picks[i])) return null;
      for (j = 0; j < picks[i].length; j += 1) addItems(bundle, slots[i].choices[picks[i][j]], 1);
    }
    return bundle;
  }

  function modelBundle(row, pick) {
    var bundle;
    if (!record(pick) || !isArray(pick.picks)) return null;
    if (pick.mode === 'bare') {
      return row.bare > 0 && pick.picks.length === 0 ? {} : null;
    }
    if (row.plain) {
      if (pick.mode !== 'regular' || pick.picks.length !== 0) return null;
      bundle = {};
      addItems(bundle, row.template, 1);
      return bundle;
    }
    if (pick.mode !== 'regular' && !(pick.mode === 'alternate' && row.alternate.length)) return null;
    return pickedItems(rowSlots(row, pick.mode), pick.picks);
  }

  function limitHolds(limit, unitModels, copies, baseline) {
    var cap = 0;
    var perChoice = null;
    var best = -1;
    var stockChoice = false;
    var choices = [];
    var ids = [];
    var seen = {};
    var over = [];
    var vectors = [];
    var target = [];
    var memo = {};
    var choice;
    var filtered;
    var nonStock;
    var all;
    var vector;
    var i;
    var j;
    var k;
    function isStock(id) {
      return countOf(baseline, id) > 0;
    }
    function fits(index, left, rest) {
      var done = true;
      var most;
      var use;
      var next;
      var negative;
      var key;
      var n;
      for (n = 0; n < rest.length; n += 1) {
        if (rest[n] > 0) done = false;
      }
      if (done) return true;
      if (index >= vectors.length || left === 0) return false;
      key = index + '|' + left + '|' + rest.join(',');
      if (has(memo, key)) return false;
      most = perChoice === null ? left : Math.min(left, perChoice);
      for (use = most; use >= 0; use -= 1) {
        next = [];
        negative = false;
        for (n = 0; n < rest.length; n += 1) {
          next.push(rest[n] - vectors[index][n] * use);
          if (next[n] < 0) negative = true;
        }
        if (negative) continue;
        if (fits(index + 1, left - use, next)) return true;
      }
      memo[key] = true;
      return false;
    }
    for (i = 0; i < limit.points.length; i += 1) {
      if (limit.points[i][0] <= unitModels && limit.points[i][0] >= best) {
        best = limit.points[i][0];
        cap = limit.points[i][1];
        perChoice = limit.points[i][2];
      }
    }
    for (i = 0; i < limit.choices.length; i += 1) {
      choice = limit.choices[i];
      all = choice.length > 0;
      for (j = 0; j < choice.length; j += 1) {
        if (!has(baseline, choice[j][0]) || baseline[choice[j][0]] !== choice[j][1]) all = false;
      }
      if (all) stockChoice = true;
      nonStock = false;
      for (j = 0; j < choice.length; j += 1) {
        if (!isStock(choice[j][0])) nonStock = true;
        if (!has(seen, choice[j][0])) {
          seen[choice[j][0]] = true;
          ids.push(choice[j][0]);
        }
      }
      if (nonStock) {
        filtered = [];
        for (j = 0; j < choice.length; j += 1) {
          if (!isStock(choice[j][0])) filtered.push(choice[j]);
        }
        choices.push(filtered);
      } else {
        choices.push(choice);
      }
    }
    for (i = 0; i < ids.length; i += 1) over.push(stockChoice ? 0 : countOf(baseline, ids[i]));
    for (i = 0; i < choices.length; i += 1) {
      vector = [];
      for (j = 0; j < ids.length; j += 1) {
        vector.push(0);
        for (k = 0; k < choices[i].length; k += 1) {
          if (choices[i][k][0] === ids[j]) vector[j] += choices[i][k][1];
        }
      }
      vectors.push(vector);
    }
    for (i = 0; i < ids.length; i += 1) target.push(Math.max(0, countOf(copies, ids[i]) - over[i]));
    return { ids: ids, holds: fits(0, cap, target) };
  }

  function itemList(unit, ids) {
    var names = [];
    var i;
    for (i = 0; i < ids.length; i += 1) names.push(itemName(unit, ids[i]));
    return names.join(', ');
  }

  function rowPosition(layout, name) {
    var r;
    for (r = 0; r < layout.rows.length; r += 1) {
      if (layout.rows[r].name === name) return r;
    }
    return -1;
  }

  function checkStructure(unit, found, loadout, result) {
    var layout = unit.loadout;
    var row;
    var picks;
    var bundle;
    var bare;
    var total;
    var bundles;
    var r;
    var m;
    var s;
    var i;
    if (!record(loadout) || !isArray(loadout.rows) || loadout.rows.length !== layout.rows.length ||
        !isArray(loadout.unit) || loadout.unit.length !== layout.unitSlots.length) {
      result.errors.push('Invalid wargear selection.');
      return false;
    }
    for (r = 0; r < layout.rows.length; r += 1) {
      row = layout.rows[r];
      picks = loadout.rows[r];
      total = {};
      bundles = [];
      bare = 0;
      if (!isArray(picks) || picks.length !== found.rows[r]) {
        result.errors.push('Invalid number of ' + row.label + ' models in the wargear selection.');
        return false;
      }
      for (m = 0; m < picks.length; m += 1) {
        bundle = modelBundle(row, picks[m]);
        if (!bundle) {
          result.errors.push('Invalid wargear choice for ' + row.label + ' model ' + (m + 1) + '.');
          return false;
        }
        if (picks[m].mode === 'bare') bare += 1;
        bundles.push(bundle);
        addCounts(total, bundle);
      }
      if (bare > row.bare) {
        result.errors.push(row.label + ': at most ' + row.bare + ' model(s) may carry no wargear.');
        return false;
      }
      result.rows.push({ models: picks.length, total: total, bundles: bundles });
      addCounts(result.counts, total);
    }
    for (s = 0; s < layout.unitSlots.length; s += 1) {
      if (!validPicks(layout.unitSlots[s], loadout.unit[s])) {
        result.errors.push('Invalid unit wargear choice.');
        return false;
      }
      for (i = 0; i < loadout.unit[s].length; i += 1) addItems(result.unitItems, layout.unitSlots[s].choices[loadout.unit[s][i]], 1);
    }
    addCounts(result.counts, result.unitItems);
    return true;
  }

  function checkLoadout(unit, models, split, loadout) {
    var result = { valid: false, structural: false, errors: [], counts: {}, unitItems: {}, rows: [], limits: [], uniform: [] };
    var found;
    var layout;
    var row;
    var baselineAll = {};
    var baseline;
    var limit;
    var checked;
    var cap;
    var mains;
    var chosen;
    var ok;
    var substitute;
    var position;
    var bundle;
    var r;
    var m;
    var i;
    var k;
    if (!unit) {
      result.errors.push('Unknown datasheet.');
      return result;
    }
    found = splitOf(unit, models, split);
    if (!found) {
      result.errors.push('No squad size or model split of ' + models + ' models exists for ' + unit.name + '.');
      return result;
    }
    layout = unit.loadout;
    if (!checkStructure(unit, found, loadout, result)) return result;
    result.structural = true;
    for (r = 0; r < layout.rows.length; r += 1) {
      if (result.rows[r].models) addItems(baselineAll, layout.rows[r].template, result.rows[r].models);
    }
    for (i = 0; i < layout.unitCaps.length; i += 1) {
      if (countOf(result.unitItems, layout.unitCaps[i][0]) > layout.unitCaps[i][1]) {
        result.errors.push('At most ' + layout.unitCaps[i][1] + ' x ' + itemName(unit, layout.unitCaps[i][0]) + ' for the unit.');
      }
    }
    for (r = 0; r < layout.rows.length; r += 1) {
      row = layout.rows[r];
      if (!result.rows[r].models) continue;
      for (i = 0; i < row.caps.length; i += 1) {
        cap = row.caps[i][1] * (row.individual ? result.rows[r].models : 1);
        if (countOf(result.rows[r].total, row.caps[i][0]) > cap) {
          result.errors.push(row.label + ': at most ' + cap + ' x ' + itemName(unit, row.caps[i][0]) + '.');
        }
      }
    }
    for (i = 0; i < layout.limits.length; i += 1) {
      limit = layout.limits[i];
      position = -1;
      if (limit.row === null) {
        checked = limitHolds(limit, models, result.counts, baselineAll);
      } else {
        position = rowPosition(layout, limit.row);
        if (position < 0 || !result.rows[position].models) continue;
        baseline = {};
        addItems(baseline, layout.rows[position].template, result.rows[position].models);
        checked = limitHolds(limit, models, result.rows[position].total, baseline);
      }
      result.limits.push({ index: i, row: position, ids: checked.ids, holds: checked.holds });
      if (!checked.holds) {
        result.errors.push((position < 0 ? 'Unit' : layout.rows[position].label) + ': wargear limit exceeded (' + itemList(unit, checked.ids) + ').');
      }
    }
    for (i = 0; i < layout.uniform.length; i += 1) {
      mains = [];
      for (k = 0; k < layout.uniform[i].choices.length; k += 1) {
        if (!layout.uniform[i].choices[k].substitute && layout.uniform[i].choices[k].items.length) mains.push(layout.uniform[i].choices[k].items);
      }
      chosen = -1;
      ok = true;
      for (r = 0; r < layout.rows.length && mains.length; r += 1) {
        if (layout.uniform[i].row !== null && layout.uniform[i].row !== layout.rows[r].name) continue;
        for (m = 0; m < result.rows[r].bundles.length; m += 1) {
          if (loadout.rows[r][m].mode === 'bare') continue;
          bundle = result.rows[r].bundles[m];
          substitute = false;
          for (k = 0; k < layout.uniform[i].choices.length; k += 1) {
            if (layout.uniform[i].choices[k].substitute && containsItems(bundle, layout.uniform[i].choices[k].items)) substitute = true;
          }
          if (substitute) continue;
          for (k = 0; k < mains.length; k += 1) {
            if (!containsItems(bundle, mains[k])) continue;
            if (chosen === -1) chosen = k;
            else if (chosen !== k) ok = false;
          }
        }
      }
      result.uniform.push({ index: i, holds: ok });
      if (!ok) {
        position = layout.uniform[i].row === null ? -1 : rowPosition(layout, layout.uniform[i].row);
        result.errors.push((position < 0 ? 'Unit' : layout.rows[position].label) + ': all models must take the same main weapon option.');
      }
    }
    result.valid = result.errors.length === 0;
    return result;
  }

  function loadoutCounts(unit, models, split, loadout) {
    var checked = checkLoadout(unit, models, split, loadout);
    return checked.structural ? checked.counts : null;
  }

  function resizeLoadout(unit, models, split, previous) {
    var target = defaultLoadout(unit, models, split);
    var r;
    var m;
    var s;
    if (!target) return null;
    if (!record(previous) || !isArray(previous.rows) || previous.rows.length !== target.rows.length) return target;
    for (r = 0; r < target.rows.length; r += 1) {
      if (!isArray(previous.rows[r])) continue;
      for (m = 0; m < target.rows[r].length && m < previous.rows[r].length; m += 1) {
        if (modelBundle(unit.loadout.rows[r], previous.rows[r][m])) target.rows[r][m] = copy(previous.rows[r][m]);
      }
    }
    if (isArray(previous.unit) && previous.unit.length === target.unit.length) {
      for (s = 0; s < target.unit.length; s += 1) {
        if (validPicks(unit.loadout.unitSlots[s], previous.unit[s])) target.unit[s] = copy(previous.unit[s]);
      }
    }
    return checkLoadout(unit, models, split, target).structural ? target : defaultLoadout(unit, models, split);
  }

  // ---------- Punkte ----------

  function coversOrdinal(tier, ordinal) {
    if (tier[3] === null) return true;
    if (ordinal < tier[3]) return false;
    return tier[4] === null || ordinal <= tier[4];
  }

  function tierCost(table, models, ordinal) {
    var tiers = [];
    var chosen;
    var swap;
    var i;
    var j;
    for (i = 0; i < table.length; i += 1) {
      if (coversOrdinal(table[i], ordinal)) tiers.push(table[i]);
    }
    if (!tiers.length) return null;
    for (i = 1; i < tiers.length; i += 1) {
      for (j = i; j > 0 && tiers[j][0] < tiers[j - 1][0]; j -= 1) {
        swap = tiers[j];
        tiers[j] = tiers[j - 1];
        tiers[j - 1] = swap;
      }
    }
    chosen = tiers[0];
    for (i = 0; i < tiers.length; i += 1) {
      if (models >= tiers[i][0]) chosen = tiers[i];
    }
    return chosen[2];
  }

  function pointsTable(unit, detachmentIds) {
    var selected = [];
    var row;
    var i;
    for (i = 0; i < unit.detachmentPoints.length; i += 1) {
      row = unit.detachmentPoints[i];
      if (contains(detachmentIds, row[0])) selected.push([row[1], row[2], row[3], row[4], row[5]]);
    }
    return selected.length ? selected : unit.points;
  }

  function wargearPoints(unit, counts) {
    var total = 0;
    var i;
    for (i = 0; i < unit.wargearCosts.length; i += 1) total += unit.wargearCosts[i][1] * countOf(counts, unit.wargearCosts[i][0]);
    return total;
  }

  function unitCost(unit, models, ordinal, counts, detachmentIds) {
    var base;
    var wargear;
    if (!unit || !integer(models, 1) || !integer(ordinal, 1)) return { points: null, base: null, wargear: null };
    base = tierCost(pointsTable(unit, isArray(detachmentIds) ? detachmentIds : []), models, ordinal);
    wargear = counts ? wargearPoints(unit, counts) : null;
    return { points: base === null || wargear === null ? null : base + wargear, base: base, wargear: wargear };
  }

  function priceEntries(state) {
    var entries = isArray(state.entries) ? state.entries : [];
    var detachmentIds = isArray(state.detachments) ? state.detachments : [];
    var result = [];
    var ordinals = {};
    var entry;
    var unit;
    var ordinal;
    var cost;
    var item;
    var i;
    for (i = 0; i < entries.length; i += 1) {
      entry = entries[i];
      ordinal = countOf(ordinals, entry.unitId) + 1;
      ordinals[entry.unitId] = ordinal;
      unit = findUnit(entry.unitId);
      cost = unitCost(unit, entry.models, ordinal, unit ? loadoutCounts(unit, entry.models, entry.split, entry.loadout) : null, detachmentIds);
      item = entry.enhancementId ? enhancement(entry.enhancementId) : null;
      cost.enhancement = entry.enhancementId ? (item ? item.cost : null) : 0;
      cost.points = cost.points === null || cost.enhancement === null ? null : cost.points + cost.enhancement;
      cost.ordinal = ordinal;
      cost.provisional = !!(unit && unit.pointsProvisional);
      result.push(cost);
    }
    return result;
  }

  // ---------- Keywords ----------

  function keywordSet(unit, entry, detachmentIds) {
    var set = {};
    var i;
    if (!unit) return set;
    for (i = 0; i < unit.owned.length; i += 1) set[unit.owned[i]] = true;
    for (i = 0; i < unit.detachmentKeywords.length; i += 1) {
      if (contains(detachmentIds, unit.detachmentKeywords[i][1])) set[unit.detachmentKeywords[i][0]] = true;
    }
    for (i = 0; entry && isArray(entry.keywords) && i < entry.keywords.length; i += 1) set[entry.keywords[i]] = true;
    return set;
  }

  function choiceGroup(id) {
    return active ? byId(active.choiceGroups, id) : null;
  }

  function keywordChoices(unit, detachmentIds) {
    var result = [];
    var groups = {};
    var group;
    var i;
    if (!unit) return result;
    for (i = 0; i < unit.choiceKeywords.length; i += 1) {
      group = choiceGroup(unit.choiceKeywords[i][1]);
      if (!group || (group.detachmentId !== null && !contains(detachmentIds, group.detachmentId))) continue;
      if (!has(groups, group.id)) {
        groups[group.id] = { group: group, keywords: [] };
        result.push(groups[group.id]);
      }
      groups[group.id].keywords.push(unit.choiceKeywords[i][0]);
    }
    return result;
  }

  function matchesPredicate(predicate, set) {
    var owned = {};
    var found;
    var key;
    var i;
    for (key in set) {
      if (Object.prototype.hasOwnProperty.call(set, key)) owned[keywordKey(key)] = true;
    }
    function hasKey(keyword) {
      return has(owned, keywordKey(keyword));
    }
    if (predicate.allOf) {
      for (i = 0; i < predicate.allOf.length; i += 1) if (!hasKey(predicate.allOf[i])) return false;
    }
    if (predicate.anyOf) {
      found = false;
      for (i = 0; i < predicate.anyOf.length; i += 1) if (hasKey(predicate.anyOf[i])) found = true;
      if (!found) return false;
    }
    if (predicate.noneOf) {
      for (i = 0; i < predicate.noneOf.length; i += 1) if (hasKey(predicate.noneOf[i])) return false;
    }
    if (predicate.notAllOf) {
      found = true;
      for (i = 0; i < predicate.notAllOf.length; i += 1) if (!hasKey(predicate.notAllOf[i])) found = false;
      if (found) return false;
    }
    return true;
  }

  function bearerKeywords(unit, set, bodyguardSet) {
    var granted = {};
    var removed = {};
    var changes;
    var i;
    var j;
    if (bodyguardSet) {
      for (i = 0; i < unit.attachChanges.length; i += 1) {
        if (unit.attachChanges[i].predicate !== null && !matchesPredicate(unit.attachChanges[i].predicate, bodyguardSet)) continue;
        changes = unit.attachChanges[i].changes;
        for (j = 0; j < changes.length; j += 1) {
          if (changes[j][0]) {
            granted[changes[j][1]] = true;
            delete removed[changes[j][1]];
          } else {
            removed[changes[j][1]] = true;
            delete granted[changes[j][1]];
          }
        }
      }
    }
    return function (keyword) {
      var key = keywordKey(keyword);
      return has(granted, key) || (has(set, keyword) && !has(removed, key));
    };
  }

  // ---------- Roster-Kontext ----------

  function context(state) {
    var entries = isArray(state.entries) ? state.entries : [];
    var detachmentIds = isArray(state.detachments) ? state.detachments : [];
    var units = [];
    var sets = [];
    var counts = [];
    var rosterIds = {};
    var detachments = [];
    var warlordIds = {};
    var detachment;
    var i;
    var j;
    for (i = 0; i < detachmentIds.length; i += 1) {
      detachment = findDetachment(detachmentIds[i]);
      if (!detachment || contains(detachments, detachment)) continue;
      detachments.push(detachment);
      for (j = 0; j < detachment.mandatoryWarlords.length; j += 1) warlordIds[detachment.mandatoryWarlords[j]] = true;
      for (j = 0; j < detachment.grantedWarlords.length; j += 1) warlordIds[detachment.grantedWarlords[j]] = true;
    }
    for (i = 0; i < entries.length; i += 1) {
      units.push(findUnit(entries[i].unitId));
      sets.push(keywordSet(units[i], entries[i], detachmentIds));
      counts.push(units[i] ? loadoutCounts(units[i], entries[i].models, entries[i].split, entries[i].loadout) : null);
      if (units[i]) rosterIds[units[i].id] = true;
    }
    return { state: state, entries: entries, detachmentIds: detachmentIds, detachments: detachments, units: units, sets: sets,
      counts: counts, rosterIds: rosterIds, warlordIds: warlordIds };
  }

  function groupApplies(group, rosterIds) {
    var i;
    for (i = 0; i < (group.requiredUnits || []).length; i += 1) if (!has(rosterIds, group.requiredUnits[i])) return false;
    for (i = 0; i < (group.excludedUnits || []).length; i += 1) if (has(rosterIds, group.excludedUnits[i])) return false;
    return true;
  }

  function conditionalRole(unit, rosterIds) {
    var support = false;
    var group;
    var i;
    if (!unit.attach) return null;
    for (i = 0; i < unit.attach.groups.length; i += 1) {
      group = unit.attach.groups[i];
      if (group.requiredUnits === null && group.excludedUnits === null) continue;
      if (!groupApplies(group, rosterIds)) continue;
      if (group.role === 'leader') return 'leader';
      support = true;
    }
    return support ? 'support' : null;
  }

  function attachmentRoleIn(ctx, index) {
    var unit = ctx.units[index];
    var entry = ctx.entries[index];
    var item = entry.enhancementId ? enhancement(entry.enhancementId) : null;
    var role;
    if (!unit) return null;
    role = conditionalRole(unit, ctx.rosterIds) || unit.attachmentRole;
    if (!role && item && item.bodyguards.length) role = 'leader';
    return role || null;
  }

  function eligibleBodyguards(unit, rosterIds) {
    var result = [];
    var group;
    var i;
    var j;
    if (!unit.attach) return result;
    for (i = 0; i < unit.attach.ids.length; i += 1) result.push(unit.attach.ids[i]);
    for (i = 0; i < unit.attach.groups.length; i += 1) {
      group = unit.attach.groups[i];
      if (!groupApplies(group, rosterIds)) continue;
      for (j = 0; j < group.ids.length; j += 1) if (!contains(result, group.ids[j])) result.push(group.ids[j]);
    }
    return result;
  }

  function gatesHold(unit, bodyguardId, ctx, leaderSet, bodyguardSet) {
    var gated = false;
    var group;
    var keyword;
    var i;
    if (!unit.attach) return true;
    if (contains(unit.attach.ids, bodyguardId)) return true;
    for (i = 0; i < unit.attach.groups.length; i += 1) {
      group = unit.attach.groups[i];
      if (!contains(group.ids, bodyguardId) || !groupApplies(group, ctx.rosterIds)) continue;
      keyword = group.sharedKeyword;
      if ((group.requiredDetachment === null || contains(ctx.detachmentIds, group.requiredDetachment)) &&
          (group.excludedDetachment === null || !contains(ctx.detachmentIds, group.excludedDetachment)) &&
          (keyword === null || (has(leaderSet, keyword) && has(bodyguardSet, keyword)))) return true;
      gated = true;
    }
    return !gated;
  }

  function attachmentIssue(ctx, index, targetIndex) {
    var unit = ctx.units[index];
    var entry = ctx.entries[index];
    var target = ctx.units[targetIndex];
    var item = entry.enhancementId ? enhancement(entry.enhancementId) : null;
    var granted;
    var eligible;
    if (!unit || !target) return 'Invalid bodyguard target for ' + entry.id + '.';
    granted = !!(item && contains(item.bodyguards, target.id));
    eligible = contains(eligibleBodyguards(unit, ctx.rosterIds), target.id);
    if (!(eligible || granted) || (!granted && !gatesHold(unit, target.id, ctx, ctx.sets[index], ctx.sets[targetIndex]))) {
      return unit.name + ' cannot attach to ' + target.name + ' (' + entry.id + ').';
    }
    return null;
  }

  function attachmentTargets(state, index) {
    var ctx = context(state);
    var result = [];
    var i;
    if (!ctx.units[index] || !attachmentRoleIn(ctx, index)) return result;
    for (i = 0; i < ctx.entries.length; i += 1) {
      if (i === index || !ctx.units[i]) continue;
      if (ctx.entries[i].attachedTo !== null && typeof ctx.entries[i].attachedTo !== 'undefined') continue;
      if (attachmentIssue(ctx, index, i) === null) result.push(ctx.entries[i].id);
    }
    return result;
  }

  function attachmentRole(state, index) {
    return attachmentRoleIn(context(state), index);
  }

  function bodyguardSetFor(ctx, index) {
    var target = entryIndex(ctx.entries, ctx.entries[index].attachedTo);
    return target >= 0 && target !== index && ctx.units[target] ? ctx.sets[target] : null;
  }

  function enhancementIssues(ctx, index, item) {
    var unit = ctx.units[index];
    var entry = ctx.entries[index];
    var set = ctx.sets[index];
    var issues = [];
    var hasKeyword;
    var excluded;
    var matched;
    var group;
    var i;
    var j;
    if (!unit) return [{ code: 'unknown-bearer', message: 'Unknown bearer.' }];
    function issue(code, message) {
      issues.push({ code: code, message: message });
    }
    if (!contains(ctx.detachmentIds, item.detachmentId)) issue('enhancement-wrong-detachment', item.name + ' is not from a selected detachment (' + entry.id + ').');
    if (!unit.characterBase && !contains(entry.keywords || [], 'Character') && !item.nonCharacter) {
      issue('enhancement-on-non-character', item.name + ' can only be taken by a CHARACTER (' + entry.id + ').');
    }
    if ((unit.role === 'epic-hero' || has(set, 'Epic Hero')) && !item.epicHero) issue('enhancement-on-epic-hero', item.name + ' cannot be given to an EPIC HERO (' + entry.id + ').');
    if (item.notWarlord && ctx.state.warlordId === entry.id) issue('enhancement-bearer-cannot-be-warlord', unit.name + ' carries ' + item.name + ' and cannot be the Warlord.');
    for (i = 0; i < item.requiredWargear.length; i += 1) {
      if (!ctx.counts[index] || countOf(ctx.counts[index], item.requiredWargear[i]) <= 0) {
        issue('enhancement-missing-wargear', unit.name + ' lacks the ' + itemName(unit, item.requiredWargear[i]) + ' that ' + item.name + ' requires (' + entry.id + ').');
      }
    }
    excluded = unit.rows.length > 0;
    for (i = 0; i < unit.rows.length; i += 1) if (!unit.rows[i].noEnhancement) excluded = false;
    if (excluded) issue('enhancement-on-excluded-model', item.name + ' cannot be given to ' + unit.name + ': no model in it can take Enhancements.');
    hasKeyword = bearerKeywords(unit, set, bodyguardSetFor(ctx, index));
    matched = !item.keywordGroups.length && !item.datasheetGroups.length;
    for (i = 0; i < item.keywordGroups.length && !matched; i += 1) {
      group = true;
      for (j = 0; j < item.keywordGroups[i].length; j += 1) if (!hasKeyword(item.keywordGroups[i][j])) group = false;
      if (group) matched = true;
    }
    for (i = 0; i < item.datasheetGroups.length && !matched; i += 1) {
      if (item.datasheetGroups[i][0] !== unit.id) continue;
      group = true;
      for (j = 0; j < item.datasheetGroups[i][1].length; j += 1) if (!hasKeyword(item.datasheetGroups[i][1][j])) group = false;
      if (group) matched = true;
    }
    if (!matched) issue('enhancement-keyword-mismatch', unit.name + ' lacks an eligible keyword group for ' + item.name + ' (' + entry.id + ').');
    for (i = 0; i < item.requiredAbilities.length; i += 1) {
      if (!contains(unit.abilityIds, item.requiredAbilities[i])) issue('enhancement-missing-ability', unit.name + ' lacks an ability that ' + item.name + ' requires (' + entry.id + ').');
    }
    for (i = 0; i < item.excluded.length; i += 1) {
      if (hasKeyword(item.excluded[i])) {
        issue('enhancement-excluded-keyword', unit.name + ' carries a keyword excluded by ' + item.name + ' (' + entry.id + ').');
        break;
      }
    }
    return issues;
  }

  function enhancementEligible(state, index, item) {
    var ctx = context(state);
    var issues;
    var i;
    if (!item || !ctx.units[index]) return false;
    issues = enhancementIssues(ctx, index, item);
    for (i = 0; i < issues.length; i += 1) {
      if (issues[i].code !== 'enhancement-bearer-cannot-be-warlord') return false;
    }
    return true;
  }

  function availableEnhancements(state, index) {
    var list = enhancements(isArray(state.detachments) ? state.detachments : []);
    var result = [];
    var i;
    for (i = 0; i < list.length; i += 1) {
      if (enhancementEligible(state, index, list[i])) result.push(list[i]);
    }
    return result;
  }

  function warlordBarred(ctx, index) {
    var unit = ctx.units[index];
    var all = unit.rows.length > 0;
    var i;
    for (i = 0; i < unit.rows.length; i += 1) if (!unit.rows[i].cannotWarlord) all = false;
    return all && !has(ctx.warlordIds, unit.id);
  }

  function warlordCharacter(ctx, index) {
    var unit = ctx.units[index];
    var i;
    if (unit.characterBase || has(ctx.sets[index], 'Character')) return true;
    for (i = 0; i < unit.rows.length; i += 1) if (unit.rows[i].nonCharacterWarlord) return true;
    return false;
  }

  function warlordCandidates(state) {
    var ctx = context(state);
    var result = [];
    var i;
    for (i = 0; i < ctx.entries.length; i += 1) {
      if (ctx.units[i] && !warlordBarred(ctx, i) && warlordCharacter(ctx, i)) result.push(ctx.entries[i].id);
    }
    return result;
  }

  function supremeCommander(ctx, index) {
    var unit = ctx.units[index];
    var i;
    for (i = 0; i < unit.rows.length; i += 1) {
      if (unit.rows[i].supreme && !unit.rows[i].cannotWarlord) return true;
    }
    return false;
  }

  // ---------- Detachments ----------

  function fail(result, code, message) {
    result.errors.push(message);
    result.codes.push(code);
  }

  function detachmentSummary(ids) {
    var result = { dp: 0, unknown: 0, errors: [], codes: [] };
    var seen = [];
    var tags = {};
    var detachment;
    var tag;
    var i;
    var j;
    if (!isArray(ids)) {
      fail(result, 'detachments-invalid', 'Detachment selections must be an array.');
      return result;
    }
    for (i = 0; i < ids.length; i += 1) {
      if (contains(seen, ids[i])) {
        fail(result, 'duplicate-detachment', 'Duplicate detachment: ' + ids[i] + '.');
        continue;
      }
      seen.push(ids[i]);
      detachment = findDetachment(ids[i]);
      if (!detachment) {
        result.unknown += 1;
        fail(result, 'unknown-detachment', 'Unknown detachment: ' + ids[i] + '.');
        continue;
      }
      result.dp += detachment.dp;
      for (j = 0; j < detachment.tags.length; j += 1) {
        tag = detachment.tags[j];
        if (has(tags, tag)) fail(result, 'detachment-tag-conflict', 'Detachments ' + tags[tag] + ' and ' + detachment.name + ' share the unique tag ' + tag + '.');
        else tags[tag] = detachment.name;
      }
    }
    return result;
  }

  function dpLimit(battleSize, ids, dp) {
    var size = has(battleSizes, battleSize) ? battleSizes[battleSize] : null;
    if (!size) return null;
    return battleSize === 'incursion' && isArray(ids) && ids.length === 1 && dp === 3 ? 3 : size.dp;
  }

  // ---------- Transport-Hinweis ----------

  function transportShortfall(ctx) {
    var transports = [];
    var groups = [];
    var assigned = {};
    var count = 0;
    var members;
    var i;
    var j;
    function fits(transport, group) {
      var capacity = ctx.units[transport].transport;
      var models = 0;
      var k;
      var m;
      for (k = 0; k < group.length; k += 1) {
        if (!has(ctx.sets[group[k]], 'Infantry')) return false;
        for (m = 0; m < capacity.excluded.length; m += 1) {
          if (has(ctx.sets[group[k]], capacity.excluded[m])) return false;
        }
        models += ctx.entries[group[k]].models;
      }
      return models <= capacity.capacity;
    }
    function assign(transport, seen) {
      var g;
      for (g = 0; g < groups.length; g += 1) {
        if (has(seen, String(g)) || !fits(transport, groups[g])) continue;
        seen[String(g)] = true;
        if (!has(assigned, String(g)) || assign(assigned[String(g)], seen)) {
          assigned[String(g)] = transport;
          return true;
        }
      }
      return false;
    }
    for (i = 0; i < ctx.entries.length; i += 1) {
      if (ctx.units[i] && ctx.units[i].role === 'dedicated-transport' && ctx.units[i].transport) transports.push(i);
    }
    if (!transports.length) return null;
    for (i = 0; i < ctx.entries.length; i += 1) {
      if (!ctx.units[i] || ctx.units[i].transport) continue;
      if (entryIndex(ctx.entries, ctx.entries[i].attachedTo) >= 0) continue;
      members = [i];
      for (j = 0; j < ctx.entries.length; j += 1) {
        if (j !== i && ctx.units[j] && ctx.entries[j].attachedTo === ctx.entries[i].id) members.push(j);
      }
      groups.push(members);
    }
    for (i = 0; i < transports.length; i += 1) {
      if (assign(transports[i], {})) count += 1;
    }
    return count < transports.length ? { transports: transports.length, missing: transports.length - count } : null;
  }

  // ---------- Listenprüfung ----------

  function sameKeywords(a, b) {
    var left = a.slice(0).sort();
    var right = b.slice(0).sort();
    var i;
    if (left.length !== right.length) return false;
    for (i = 0; i < left.length; i += 1) if (left[i] !== right[i]) return false;
    return true;
  }

  function exemptUnit(unit, exempt) {
    var i;
    for (i = 0; i < unit.factionKeywords.length; i += 1) if (contains(exempt, unit.factionKeywords[i])) return true;
    return false;
  }

  function unitNames(ids) {
    var names = [];
    var unit;
    var i;
    for (i = 0; i < ids.length; i += 1) {
      unit = findUnit(ids[i]);
      names.push(unit ? unit.name : ids[i]);
    }
    return names.join(', ');
  }

  function checkKeywordLimits(ctx, result) {
    var limit;
    var max;
    var overridden;
    var overrides;
    var count;
    var matched;
    var i;
    var j;
    var k;
    for (i = 0; i < active.keywordLimits.length; i += 1) {
      limit = active.keywordLimits[i];
      max = limit.max;
      overridden = false;
      for (j = 0; j < ctx.detachments.length; j += 1) {
        overrides = ctx.detachments[j].keywordLimitOverrides;
        for (k = 0; k < overrides.length; k += 1) {
          if (sameKeywords(overrides[k].keywords, limit.keywords)) {
            max = overridden ? Math.max(max, overrides[k].max) : overrides[k].max;
            overridden = true;
          }
        }
      }
      count = 0;
      if (limit.mode === 'alternatives') {
        for (k = 0; k < limit.keywords.length; k += 1) {
          matched = false;
          for (j = 0; j < ctx.entries.length; j += 1) {
            if (ctx.units[j] && !exemptUnit(ctx.units[j], limit.exempt) && has(ctx.sets[j], limit.keywords[k])) matched = true;
          }
          if (matched) count += 1;
        }
      } else {
        for (j = 0; j < ctx.entries.length; j += 1) {
          if (!ctx.units[j] || exemptUnit(ctx.units[j], limit.exempt)) continue;
          matched = true;
          for (k = 0; k < limit.keywords.length; k += 1) if (!has(ctx.sets[j], limit.keywords[k])) matched = false;
          if (matched) count += 1;
        }
      }
      if (count > max) fail(result, 'keyword-limit-exceeded', 'Army includes ' + count + ' of ' + limit.keywords.join(' + ') + ', over the limit of ' + max + '.');
    }
  }

  function checkDetachmentRules(ctx, result) {
    var detachment;
    var count;
    var i;
    var j;
    var k;
    for (i = 0; i < ctx.detachments.length; i += 1) {
      detachment = ctx.detachments[i];
      for (j = 0; j < ctx.entries.length; j += 1) {
        if (!ctx.units[j]) continue;
        if (detachment.restrictions) {
          for (k = 0; k < detachment.restrictions.required.length; k += 1) {
            if (!has(ctx.sets[j], detachment.restrictions.required[k])) {
              fail(result, 'detachment-restriction-required', ctx.units[j].name + ' lacks a keyword required by ' + detachment.name + ' (' + ctx.entries[j].id + ').');
              break;
            }
          }
          for (k = 0; k < detachment.restrictions.excluded.length; k += 1) {
            if (has(ctx.sets[j], detachment.restrictions.excluded[k])) {
              fail(result, 'detachment-restriction-excluded', ctx.units[j].name + ' carries a keyword excluded by ' + detachment.name + ' (' + ctx.entries[j].id + ').');
              break;
            }
          }
        }
        if (contains(detachment.excludedUnits, ctx.units[j].id)) {
          fail(result, 'detachment-excluded-datasheet', ctx.units[j].name + ' cannot be included with ' + detachment.name + ' (' + ctx.entries[j].id + ').');
        }
      }
      for (j = 0; j < detachment.unitMinimums.length; j += 1) {
        count = 0;
        for (k = 0; k < ctx.entries.length; k += 1) if (ctx.units[k] && has(ctx.sets[k], detachment.unitMinimums[j][0])) count += 1;
        if (count < detachment.unitMinimums[j][1]) {
          fail(result, 'unit-minimum-unmet', detachment.name + ' requires ' + detachment.unitMinimums[j][1] + '+ ' + detachment.unitMinimums[j][0] + ' units, found ' + count + '.');
        }
      }
    }
  }

  function checkKeywordChoices(ctx, result) {
    var groups = active.choiceGroups;
    var group;
    var choices;
    var chosen;
    var count;
    var i;
    var j;
    var k;
    for (i = 0; i < ctx.entries.length; i += 1) {
      if (!ctx.units[i]) continue;
      choices = keywordChoices(ctx.units[i], ctx.detachmentIds);
      for (j = 0; j < choices.length; j += 1) {
        chosen = false;
        for (k = 0; k < choices[j].keywords.length; k += 1) if (contains(ctx.entries[i].keywords || [], choices[j].keywords[k])) chosen = true;
        if (choices[j].group.mandatory && !chosen) result.warnings.push(ctx.entries[i].id + ': choose a keyword for ' + choices[j].group.name + '.');
      }
    }
    for (i = 0; i < groups.length; i += 1) {
      group = groups[i];
      if (group.detachmentId !== null && !contains(ctx.detachmentIds, group.detachmentId)) continue;
      if (group.minUnits === null && group.maxUnits === null) continue;
      count = 0;
      for (j = 0; j < ctx.entries.length; j += 1) {
        if (!ctx.units[j]) continue;
        for (k = 0; k < ctx.units[j].choiceKeywords.length; k += 1) {
          if (ctx.units[j].choiceKeywords[k][1] === group.id && contains(ctx.entries[j].keywords || [], ctx.units[j].choiceKeywords[k][0])) {
            count += 1;
            break;
          }
        }
      }
      if ((group.minUnits !== null && count > 0 && count < group.minUnits) || (group.maxUnits !== null && count > group.maxUnits)) {
        result.warnings.push(group.name + ': ' + count + ' unit(s) chose this keyword; expected ' +
          (group.minUnits !== null ? group.minUnits : 0) + (group.maxUnits !== null ? '-' + group.maxUnits : '+') + '.');
      }
    }
  }

  function checkWarlord(ctx, result) {
    var warlord = entryIndex(ctx.entries, ctx.state.warlordId);
    var supreme = [];
    var unit;
    var i;
    if (warlord < 0 || !ctx.units[warlord]) {
      fail(result, 'no-warlord', 'Select exactly one Warlord.');
      return;
    }
    unit = ctx.units[warlord];
    if (warlordBarred(ctx, warlord)) fail(result, 'cannot-be-warlord', unit.name + ' cannot be your Warlord.');
    if (!warlordCharacter(ctx, warlord)) fail(result, 'warlord-not-character', unit.name + ' is not a CHARACTER and cannot be your Warlord.');
    for (i = 0; i < ctx.detachments.length; i += 1) {
      if (ctx.detachments[i].mandatoryWarlords.length && !contains(ctx.detachments[i].mandatoryWarlords, unit.id)) {
        fail(result, 'warlord-not-mandated', ctx.detachments[i].name + ' requires the Warlord to be one of: ' + unitNames(ctx.detachments[i].mandatoryWarlords) + '.');
      }
    }
    for (i = 0; i < ctx.entries.length; i += 1) {
      if (ctx.units[i] && supremeCommander(ctx, i) && !warlordBarred(ctx, i) && !contains(supreme, ctx.units[i].id)) supreme.push(ctx.units[i].id);
    }
    if (supreme.length && !contains(supreme, unit.id)) fail(result, 'warlord-not-supreme-commander', 'The Warlord must be one of: ' + unitNames(supreme) + ' (Supreme Commander).');
  }

  function checkAttachments(ctx, roles, result) {
    var entries = ctx.entries;
    var entry;
    var target;
    var issue;
    var visited;
    var next;
    var leaders;
    var supports;
    var groupEnhancements;
    var i;
    var j;
    for (i = 0; i < entries.length; i += 1) {
      entry = entries[i];
      if (!ctx.units[i]) continue;
      if (entry.attachedTo === null || typeof entry.attachedTo === 'undefined') {
        if (roles[i] === 'support' && (ctx.units[i].characterBase || contains(entry.keywords || [], 'Character'))) {
          fail(result, 'leader-must-attach', 'Support character must attach to a unit: ' + entry.id + '.');
        }
      } else {
        target = entryIndex(entries, entry.attachedTo);
        if (!roles[i]) fail(result, 'attach-no-role', 'Unit has no Leader or Support attachment role: ' + entry.id + '.');
        if (target < 0) {
          fail(result, 'attach-missing-target', 'Missing attachment target for ' + entry.id + '.');
        } else if (target === i) {
          fail(result, 'attach-self', 'Unit cannot attach to itself: ' + entry.id + '.');
        } else {
          if (entries[target].attachedTo !== null && typeof entries[target].attachedTo !== 'undefined') {
            fail(result, 'attach-chain', 'Chained attachments are not allowed: ' + entry.id + '.');
          }
          if (roles[i]) {
            issue = attachmentIssue(ctx, i, target);
            if (issue) fail(result, 'leader-attachment-illegal', issue);
          }
          visited = [i];
          next = target;
          while (next >= 0 && !contains(visited, next)) {
            visited.push(next);
            next = entryIndex(entries, entries[next].attachedTo);
          }
          if (next >= 0) fail(result, 'attach-cycle', 'Attachment cycle is not allowed: ' + entry.id + '.');
        }
      }
      leaders = 0;
      supports = 0;
      groupEnhancements = entry.enhancementId ? 1 : 0;
      for (j = 0; j < entries.length; j += 1) {
        if (j === i || typeof entry.id !== 'string' || entries[j].attachedTo !== entry.id) continue;
        if (roles[j] === 'leader') leaders += 1;
        if (roles[j] === 'support') supports += 1;
        if (entries[j].enhancementId) groupEnhancements += 1;
      }
      if (leaders > 1) fail(result, 'bodyguard-leaders', 'Bodyguard permits only one Leader: ' + entry.id + '.');
      if (supports > 1) fail(result, 'bodyguard-supports', 'Bodyguard permits only one Support: ' + entry.id + '.');
      if (groupEnhancements > 1) fail(result, 'group-enhancements', 'Only one enhancement per unit including its attached group: ' + entry.id + '.');
    }
  }

  function rosterSummary(state) {
    var entries = isArray(state.entries) ? state.entries : [];
    var ids = isArray(state.detachments) ? state.detachments : [];
    var size = has(battleSizes, state.battleSize) ? battleSizes[state.battleSize] : null;
    var loaded = active !== null && active.id === state.factionId;
    var detachments = loaded ? detachmentSummary(ids) : { dp: 0, unknown: 0, errors: [], codes: [] };
    var ctx;
    var result = {
      prices: [],
      total: { known: 0, unknown: 0 },
      dp: detachments.dp,
      dpLimit: dpLimit(state.battleSize, ids, detachments.dp),
      enhancementCount: 0,
      loadouts: [],
      roles: [],
      errors: detachments.errors.slice(0),
      codes: detachments.codes.slice(0),
      warnings: []
    };
    var enhancementUses = {};
    var enhancementOrder = [];
    var copies = {};
    var copyOrder = [];
    var entry;
    var unit;
    var set;
    var item;
    var price;
    var checked;
    var limit;
    var issues;
    var shortfall;
    var i;
    var j;
    if (!loaded) {
      fail(result, 'faction-not-loaded', 'Faction data is not loaded: ' + state.factionId + '.');
      return result;
    }
    ctx = context(state);
    result.prices = priceEntries(state);
    if (!isArray(state.entries)) fail(result, 'entries-invalid', 'Entries must be an array.');
    if (!entries.length) fail(result, 'empty-army', 'Army must contain at least one unit.');
    if (!size) {
      if (state.battleSize !== null && typeof state.battleSize !== 'undefined') fail(result, 'unknown-battle-size', 'Unknown battle size.');
      result.warnings.push('Custom budget: standard battle-size limits are not checked; standard army validity is not established.');
    } else {
      if (state.budget !== size.points) fail(result, 'budget-mismatch', 'Budget must match ' + size.name + ': ' + size.points + ' points.');
      if (result.dp > result.dpLimit) fail(result, 'detachment-points-over', 'Detachment DP limit exceeded: ' + result.dp + '/' + result.dpLimit + '.');
    }
    if (!ids.length) result.warnings.push('No detachment selected.');
    for (i = 0; i < entries.length; i += 1) result.roles.push(attachmentRoleIn(ctx, i));
    for (i = 0; i < entries.length; i += 1) {
      entry = entries[i];
      unit = ctx.units[i];
      set = ctx.sets[i];
      price = result.prices[i];
      checked = null;
      if (typeof entry.id !== 'string' || !entry.id) fail(result, 'entry-id', 'Unit entry requires a stable ID at position ' + (i + 1) + '.');
      else if (entryIndex(entries, entry.id) !== i) fail(result, 'entry-id', 'Duplicate entry ID: ' + entry.id + '.');
      if (!unit) {
        fail(result, 'unknown-unit', 'Datasheet is not part of this faction: ' + entry.unitId + '.');
      } else {
        checked = checkLoadout(unit, entry.models, entry.split, entry.loadout);
        for (j = 0; j < checked.errors.length; j += 1) fail(result, 'loadout', entry.id + ': ' + checked.errors[j]);
        if (price.base === null && sizeOf(unit, entry.models)) fail(result, 'unknown-points', entry.id + ': no points value for ' + unit.name + ' at ' + entry.models + ' models (copy ' + price.ordinal + ').');
        if (price.provisional) result.warnings.push('Provisional points for ' + unit.name + ' (' + entry.id + ').');
        limit = size ? size.units : null;
        if (unit.role === 'epic-hero' || has(set, 'Epic Hero')) limit = 1;
        else if (limit !== null && (unit.role === 'battleline' || unit.role === 'dedicated-transport' || has(set, 'Battleline') || has(set, 'Dedicated Transport'))) limit *= 2;
        if (limit !== null) {
          if (!has(copies, unit.id)) {
            copies[unit.id] = { name: unit.name, count: 0, limit: limit };
            copyOrder.push(unit.id);
          }
          copies[unit.id].count += 1;
          copies[unit.id].limit = Math.max(copies[unit.id].limit, limit);
        }
      }
      result.loadouts.push(checked);
      if (price.points !== null) {
        result.total.known += price.points;
      } else {
        if (price.base !== null) result.total.known += price.base + (price.wargear || 0);
        if (typeof price.enhancement === 'number') result.total.known += price.enhancement;
        result.total.unknown += 1;
        result.warnings.push('Unknown points for ' + entry.id + '; total includes only known costs.');
      }
      if (entry.enhancementId !== null && typeof entry.enhancementId !== 'undefined') {
        item = enhancement(entry.enhancementId);
        if (!item) {
          fail(result, 'unknown-enhancement', 'Unknown enhancement for ' + entry.id + ': ' + entry.enhancementId + '.');
        } else {
          if (!has(enhancementUses, item.id)) {
            enhancementUses[item.id] = 0;
            enhancementOrder.push(item);
          }
          enhancementUses[item.id] += 1;
          if (unit) {
            issues = enhancementIssues(ctx, i, item);
            for (j = 0; j < issues.length; j += 1) fail(result, issues[j].code, issues[j].message);
          }
        }
      }
    }
    for (i = 0; i < enhancementOrder.length; i += 1) {
      item = enhancementOrder[i];
      if (enhancementUses[item.id] > item.maxTargets) {
        fail(result, 'enhancement-over-max-targets', 'Enhancement copy limit exceeded for ' + item.name + ': ' + enhancementUses[item.id] + '/' + item.maxTargets + '.');
      }
      if (item.counts) result.enhancementCount += 1;
    }
    if (size && result.enhancementCount > size.enhancements) {
      fail(result, 'enhancement-limit-exceeded', 'Army enhancement limit exceeded: ' + result.enhancementCount + '/' + size.enhancements + '.');
    }
    for (i = 0; i < copyOrder.length; i += 1) {
      if (copies[copyOrder[i]].count > copies[copyOrder[i]].limit) {
        fail(result, 'unit-limit-exceeded', 'Datasheet copy limit exceeded for ' + copies[copyOrder[i]].name + ': ' + copies[copyOrder[i]].count + '/' + copies[copyOrder[i]].limit + '.');
      }
    }
    checkKeywordLimits(ctx, result);
    checkDetachmentRules(ctx, result);
    checkKeywordChoices(ctx, result);
    checkWarlord(ctx, result);
    checkAttachments(ctx, result.roles, result);
    if (!integer(state.budget, 0)) fail(result, 'budget-invalid', 'Points budget must be a non-negative integer.');
    shortfall = transportShortfall(ctx);
    if (shortfall) {
      result.warnings.push('Dedicated Transport without an obvious passenger: ' + shortfall.missing + ' of ' + shortfall.transports +
        ' cannot be matched to an INFANTRY unit within its capacity. Each Dedicated Transport needs an embarked unit; check its transport rules.');
    }
    if ((integer(state.budget, 0) && result.total.known > state.budget) || (size && result.total.known > size.points)) {
      fail(result, 'points-over-limit', 'Points budget exceeded by known costs.');
    }
    return result;
  }

  // ---------- Speicherformat ----------

  function newEntry(unit, id) {
    var models = defaultSize(unit);
    return { id: id, unitId: unit.id, models: models, split: 0, loadout: defaultLoadout(unit, models, 0),
      enhancementId: null, attachedTo: null, keywords: [] };
  }

  function fresh(factionId) {
    return { version: STATE_VERSION, factionId: typeof factionId === 'string' ? factionId : null, name: '',
      battleSize: 'strike-force', budget: 2000, detachments: [], warlordId: null, entries: [] };
  }

  function storedFaction(value) {
    if (!record(value)) return null;
    if (value.version === 1 || value.version === 2) return 'adepta-sororitas';
    return value.version === STATE_VERSION && typeof value.factionId === 'string' ? value.factionId : null;
  }

  function validKeywords(unit, list) {
    var groups = {};
    var found;
    var i;
    var j;
    if (!isArray(list)) return false;
    for (i = 0; i < list.length; i += 1) {
      found = null;
      for (j = 0; j < unit.choiceKeywords.length; j += 1) {
        if (unit.choiceKeywords[j][0] === list[i]) found = unit.choiceKeywords[j][1];
      }
      if (found === null || has(groups, found)) return false;
      groups[found] = true;
    }
    return true;
  }

  function normalizeStored(value) {
    var legacy;
    var result;
    var notices = [];
    var ids = [];
    var dropped = [];
    var entry;
    var unit;
    var models;
    var split;
    var loadout;
    var enhancementId;
    var keywordsList;
    var id;
    var i;
    if (!record(value) || storedFaction(value) === null || !active || active.id !== storedFaction(value)) return null;
    if (typeof value.name !== 'string' || value.name.length > 100 || !integer(value.budget, 1) || value.budget > 100000 ||
        !isArray(value.entries) || value.entries.length > MAX_ENTRIES || !isArray(value.detachments)) return null;
    legacy = value.version !== STATE_VERSION;
    if (!legacy && value.battleSize !== null && !has(battleSizes, value.battleSize)) return null;
    if (!legacy && value.warlordId !== null && !entryId(value.warlordId)) return null;
    result = fresh(active.id);
    result.name = value.name;
    result.budget = value.budget;
    result.battleSize = legacy ? (value.budget === 1000 ? 'incursion' : value.budget === 2000 ? 'strike-force' : null) : value.battleSize;
    result.warlordId = legacy ? (value.version === 2 && entryId(value.warlordId) ? value.warlordId : null) : value.warlordId;
    if (legacy) notices.push({ code: 'legacy' });
    for (i = 0; i < value.entries.length; i += 1) {
      entry = value.entries[i];
      if (!record(entry) || typeof entry.unitId !== 'string') return null;
      id = legacy && value.version === 1 ? 'entry-' + (i + 1) : entry.id;
      if (!entryId(id) || contains(ids, id)) return null;
      ids.push(id);
      unit = findUnit(entry.unitId);
      if (!unit || !unit.sizes.length) {
        dropped.push(id);
        notices.push({ code: 'unit-removed', entryId: id, unitId: entry.unitId });
        continue;
      }
      if (legacy) {
        models = isArray(entry.choices) ? entry.choices.length : null;
        split = 0;
        loadout = null;
      } else {
        models = entry.models;
        split = entry.split;
        loadout = entry.loadout;
      }
      if (!sizeOf(unit, models)) {
        if (!legacy || models !== null) notices.push({ code: 'size-reset', entryId: id, unitId: unit.id, models: models });
        models = defaultSize(unit);
        split = 0;
        loadout = null;
      }
      if (!splitOf(unit, models, split)) {
        notices.push({ code: 'split-reset', entryId: id, unitId: unit.id });
        split = 0;
        loadout = null;
      }
      if (!checkLoadout(unit, models, split, loadout).structural) {
        if (!legacy) notices.push({ code: 'loadout-reset', entryId: id, unitId: unit.id });
        loadout = defaultLoadout(unit, models, split);
      } else {
        loadout = copy(loadout);
      }
      enhancementId = null;
      if (!legacy && entry.enhancementId !== null) {
        if (typeof entry.enhancementId === 'string' && enhancement(entry.enhancementId)) enhancementId = entry.enhancementId;
        else notices.push({ code: 'enhancement-removed', entryId: id, unitId: unit.id });
      } else if (legacy && value.version === 2 && entry.enhancementId !== null && typeof entry.enhancementId !== 'undefined') {
        if (typeof entry.enhancementId === 'string' && active.legacy && has(active.legacy.enhancements, entry.enhancementId) &&
            enhancement(active.legacy.enhancements[entry.enhancementId])) {
          enhancementId = active.legacy.enhancements[entry.enhancementId];
        } else {
          notices.push({ code: 'enhancement-removed', entryId: id, unitId: unit.id });
        }
      }
      keywordsList = !legacy && isArray(entry.keywords) ? entry.keywords : [];
      if (!validKeywords(unit, keywordsList)) {
        notices.push({ code: 'keywords-reset', entryId: id, unitId: unit.id });
        keywordsList = [];
      }
      if (!legacy || value.version === 2) {
        if (entry.attachedTo !== null && typeof entry.attachedTo !== 'undefined' && !entryId(entry.attachedTo)) return null;
      }
      result.entries.push({ id: id, unitId: unit.id, models: models, split: split, loadout: loadout, enhancementId: enhancementId,
        attachedTo: legacy && value.version === 1 ? null : (entry.attachedTo || null), keywords: keywordsList.slice(0) });
    }
    for (i = 0; i < result.entries.length; i += 1) {
      if (result.entries[i].attachedTo !== null && contains(dropped, result.entries[i].attachedTo)) {
        result.entries[i].attachedTo = null;
        notices.push({ code: 'attachment-removed', entryId: result.entries[i].id, unitId: result.entries[i].unitId });
      }
    }
    if (result.warlordId !== null && contains(dropped, result.warlordId)) {
      result.warlordId = null;
      notices.push({ code: 'warlord-removed' });
    }
    for (i = 0; i < value.detachments.length; i += 1) {
      if (typeof value.detachments[i] !== 'string' || contains(result.detachments, value.detachments[i])) return null;
      if (!findDetachment(value.detachments[i])) {
        notices.push({ code: 'detachment-removed', detachmentId: value.detachments[i] });
        continue;
      }
      result.detachments.push(value.detachments[i]);
    }
    return { state: result, notices: notices };
  }

  return {
    MAX_ENTRIES: MAX_ENTRIES,
    STATE_VERSION: STATE_VERSION,
    battleSizes: battleSizes,
    keywordKey: keywordKey,
    factionIndex: factionIndex,
    factionInfo: factionInfo,
    factionData: factionData,
    useFaction: useFaction,
    faction: faction,
    findUnit: findUnit,
    findDetachment: findDetachment,
    enhancement: enhancement,
    enhancements: enhancements,
    itemName: itemName,
    sizeOf: sizeOf,
    splitOf: splitOf,
    defaultSize: defaultSize,
    defaultLoadout: defaultLoadout,
    modelBundle: modelBundle,
    validPicks: validPicks,
    limitHolds: limitHolds,
    checkLoadout: checkLoadout,
    loadoutCounts: loadoutCounts,
    resizeLoadout: resizeLoadout,
    tierCost: tierCost,
    pointsTable: pointsTable,
    unitCost: unitCost,
    priceEntries: priceEntries,
    keywordSet: keywordSet,
    keywordChoices: keywordChoices,
    attachmentRole: attachmentRole,
    attachmentTargets: attachmentTargets,
    enhancementEligible: enhancementEligible,
    availableEnhancements: availableEnhancements,
    warlordCandidates: warlordCandidates,
    detachmentSummary: detachmentSummary,
    dpLimit: dpLimit,
    rosterSummary: rosterSummary,
    newEntry: newEntry,
    fresh: fresh,
    storedFaction: storedFaction,
    normalizeStored: normalizeStored
  };
}());
