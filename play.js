var PlaySheet = (function () {
  var PHASES = [
    { id: 'prebattle', label: 'Vor der Schlacht' },
    { id: 'round-start', label: 'Zug- und Rundenbeginn' },
    { id: 'command', label: 'Kommandophase' },
    { id: 'movement', label: 'Bewegungsphase' },
    { id: 'shooting', label: 'Fernkampfphase' },
    { id: 'charge', label: 'Angriffsphase' },
    { id: 'fight', label: 'Nahkampfphase' },
    { id: 'any', label: 'Jede Phase' },
    { id: 'passive', label: 'Dauerhaft / situativ' }
  ];
  var TURN_LABELS = { own: 'Mein Zug', opponent: 'Gegnerischer Zug', both: 'Beide Z\u00fcge' };
  var KIND_LABELS = {
    army: 'Fraktionsregel',
    detachment: 'Detachment-Regel',
    stratagem: 'Stratagem',
    enhancement: 'Verbesserung',
    ability: 'F\u00e4higkeit',
    core: 'Kernregel'
  };
  var CORE_RULES = [
    { pattern: /^Scouts\b/i, phases: ['prebattle'] },
    { pattern: /^Infiltrators$/i, phases: ['prebattle'] },
    { pattern: /^Deep Strike$/i, phases: ['prebattle'] },
    { pattern: /^Fights First$/i, phases: ['fight'] },
    { pattern: /^Firing Deck\b/i, phases: ['shooting'] }
  ];
  var BATTLE_SIZE_LABELS = { incursion: 'Aufkl\u00e4rungsmission', 'strike-force': 'Einsatzverband' };
  var STATS = ['M', 'T', 'SV', 'W', 'LD', 'OC', 'INV'];

  function lower(value) {
    return String(value).toLowerCase();
  }

  function has(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }

  function contains(items, value) {
    var i;
    for (i = 0; i < items.length; i += 1) {
      if (items[i] === value) return true;
    }
    return false;
  }

  function isPhase(id) {
    var i;
    for (i = 0; i < PHASES.length; i += 1) {
      if (PHASES[i].id === id) return true;
    }
    return false;
  }

  function phaseLabel(id) {
    var i;
    for (i = 0; i < PHASES.length; i += 1) {
      if (PHASES[i].id === id) return PHASES[i].label;
    }
    return id;
  }

  function addTiming(result, phase, turn) {
    var i;
    for (i = 0; i < result.length; i += 1) {
      if (result[i].phase === phase) {
        if (result[i].turn !== turn) result[i].turn = 'both';
        return;
      }
    }
    result.push({ phase: phase, turn: turn });
  }

  function timingSegment(text) {
    var when = text.indexOf('WHEN:');
    var target;
    var end;
    if (when >= 0) {
      target = text.indexOf('TARGET:', when);
      return text.substring(when + 5, target > when ? target : text.length);
    }
    end = text.indexOf('. ');
    return end >= 0 ? text.substring(0, end + 1) : text;
  }

  function timing(text, override) {
    var result = [];
    var segment;
    var pattern;
    var match;
    var qualifier;
    var parts;
    var i;
    if (override && override.length) {
      for (i = 0; i < override.length; i += 1) {
        parts = String(override[i]).split(':');
        if (isPhase(parts[0])) addTiming(result, parts[0], parts[1] === 'own' || parts[1] === 'opponent' ? parts[1] : 'both');
      }
      return result;
    }
    text = String(text || '');
    segment = timingSegment(text);
    pattern = /(your opponent's (?:next )?|your (?:next )?|the |any |each )?(command|movement|shooting|charge|fight) phase/gi;
    while ((match = pattern.exec(segment)) !== null) {
      qualifier = lower(match[1] || '');
      addTiming(result, lower(match[2]), qualifier.indexOf('your opponent\'s') === 0 ? 'opponent' : qualifier.indexOf('your') === 0 ? 'own' : 'both');
    }
    if (/\bany phase\b/i.test(segment)) addTiming(result, 'any', 'both');
    if (/start of (each|the|every|your) (battle round|turn)/i.test(segment)) {
      addTiming(result, 'round-start', /start of your turn/i.test(segment) ? 'own' : 'both');
    }
    if (/declare battle formations|start of the battle(?! round)/i.test(segment)) addTiming(result, 'prebattle', 'both');
    if (!result.length) {
      if (/selected to (shoot or )?fight/i.test(segment)) addTiming(result, 'fight', 'both');
      if (/selected to shoot|after (this|that) (model|unit) has shot/i.test(segment)) addTiming(result, 'shooting', 'both');
    }
    if (!result.length) {
      if (/melee (attack|weapon)/i.test(text)) addTiming(result, 'fight', 'both');
      if (/ranged (attack|weapon)/i.test(text)) addTiming(result, 'shooting', 'both');
      if (!result.length && /makes an attack|each time an attack|each time .{0,60}attack/i.test(text)) {
        addTiming(result, 'shooting', 'both');
        addTiming(result, 'fight', 'both');
      }
    }
    if (!result.length) addTiming(result, 'passive', 'both');
    return result;
  }

  function dataTiming(phases, turn, text, fallback) {
    var result = [];
    var i;
    for (i = 0; i < (phases || []).length; i += 1) {
      if (isPhase(phases[i])) addTiming(result, phases[i], turn || 'both');
    }
    if (result.length) return result;
    if (text) return timing(text);
    addTiming(result, fallback || 'passive', turn || 'both');
    return result;
  }

  function turnOf(playerTurn) {
    if (playerTurn === 'your-turn') return 'own';
    if (playerTurn === 'opponent-turn') return 'opponent';
    return 'both';
  }

  function entryNumber(entry) {
    return String(entry.id || '').replace(/^entry-/, '');
  }

  function unitName(unitId) {
    var unit = ListRules.findUnit(unitId);
    return unit ? unit.name : String(unitId);
  }

  function entryLabel(entry) {
    return 'Eintrag #' + entryNumber(entry) + ' \u00b7 ' + unitName(entry.unitId);
  }

  function listName(state) {
    var name = String(state.name || '').replace(/^\s+|\s+$/g, '');
    return name || 'Unbenannte Liste';
  }

  function battleLabel(state) {
    return has(BATTLE_SIZE_LABELS, state.battleSize) ? BATTLE_SIZE_LABELS[state.battleSize] : 'Benutzerdefiniert';
  }

  function findEntryIndex(entries, id) {
    var i;
    if (typeof id !== 'string' || !id) return -1;
    for (i = 0; i < entries.length; i += 1) {
      if (entries[i].id === id) return i;
    }
    return -1;
  }

  function gearText(gear) {
    var names = [];
    var counts = {};
    var parts = [];
    var i;
    for (i = 0; i < gear.length; i += 1) {
      if (!has(counts, gear[i])) {
        counts[gear[i]] = 0;
        names.push(gear[i]);
      }
      counts[gear[i]] += 1;
    }
    for (i = 0; i < names.length; i += 1) {
      parts.push((counts[names[i]] > 1 ? counts[names[i]] + '\u00d7 ' : '') + names[i]);
    }
    return parts.length ? parts.join(', ') : 'Keine Ausr\u00fcstung';
  }

  function bundleGear(unit, bundle) {
    var gear = [];
    var id;
    var n;
    for (id in bundle) {
      if (!has(bundle, id)) continue;
      for (n = 0; n < bundle[id]; n += 1) gear.push(ListRules.itemName(unit, id));
    }
    return gear;
  }

  function loadoutGroups(unit, checked) {
    var groups = [];
    var keys = [];
    var gear;
    var key;
    var found;
    var r;
    var m;
    var i;
    if (!checked || !checked.structural) return groups;
    for (r = 0; r < checked.rows.length; r += 1) {
      for (m = 0; m < checked.rows[r].bundles.length; m += 1) {
        gear = bundleGear(unit, checked.rows[r].bundles[m]);
        key = unit.loadout.rows[r].label + '|' + gear.join('|');
        found = -1;
        for (i = 0; i < keys.length; i += 1) {
          if (keys[i] === key) found = i;
        }
        if (found >= 0) {
          groups[found].count += 1;
        } else {
          keys.push(key);
          groups.push({ count: 1, role: unit.loadout.rows[r].label, gear: gear });
        }
      }
    }
    gear = bundleGear(unit, checked.unitItems);
    if (gear.length) groups.push({ count: 1, role: 'Einheit', gear: gear });
    return groups;
  }

  function equippedAbilities(unit, counts) {
    var result = [];
    var i;
    for (i = 0; i < unit.abilities.length; i += 1) {
      if (unit.abilities[i].kind !== 'unit') continue;
      if (unit.abilities[i].wargear && (!counts || !has(counts, unit.abilities[i].wargear) || counts[unit.abilities[i].wargear] <= 0)) continue;
      result.push(unit.abilities[i]);
    }
    return result;
  }

  function specialRules(unit, counts) {
    var result = [];
    var i;
    for (i = 0; i < unit.abilities.length; i += 1) {
      if (unit.abilities[i].kind === 'unit') continue;
      if (unit.abilities[i].wargear && (!counts || !has(counts, unit.abilities[i].wargear) || counts[unit.abilities[i].wargear] <= 0)) continue;
      result.push(unit.abilities[i].label);
    }
    return result;
  }

  function enhancementText(enhancement) {
    var parts = [];
    if (enhancement.restriction) parts.push(enhancement.restriction);
    if (enhancement.text) parts.push(enhancement.text);
    if (enhancement.note) parts.push('NOTE: ' + enhancement.note);
    return parts.join(' ');
  }

  function baseTerm(term) {
    return String(term)
      .replace(/\s*\([^)]*\)\s*$/, '')
      .replace(/:.*$/, '')
      .replace(/\s+(\d+\+?|\d+"|\d+ inches|\d*D\d+(\+\d+)?)$/i, '')
      .replace(/^\s+|\s+$/g, '');
  }

  function coreRule(id) {
    var sections = CORE_DATA.coreRules ? CORE_DATA.coreRules.sections : [];
    var i;
    var j;
    for (i = 0; i < sections.length; i += 1) {
      for (j = 0; j < sections[i].items.length; j += 1) {
        if (sections[i].items[j].id === id) {
          return { title: sections[i].items[j].title, text: sections[i].items[j].text, change: sections[i].items[j].change === true, section: 'Kurzreferenz / ' + sections[i].title, anchor: 'core-' + id, list: [], correction: sections[i].items[j].correction || '' };
        }
      }
    }
    return null;
  }

  function officialRule(id) {
    var sections = CORE_DATA.officialRules ? CORE_DATA.officialRules.sections : [];
    var i;
    var j;
    for (i = 0; i < sections.length; i += 1) {
      for (j = 0; j < sections[i].items.length; j += 1) {
        if (sections[i].items[j].id === id) {
          return { title: sections[i].items[j].title, text: sections[i].items[j].text, change: false, section: 'Core Rules ' + sections[i].items[j].ref, anchor: 'rule-' + id, list: [], correction: '' };
        }
      }
    }
    return null;
  }

  function armyRules() {
    var faction = ListRules.faction();
    return faction ? faction.armyRules : [];
  }

  function armyRuleEntry(base) {
    var rules = armyRules();
    var faction = ListRules.faction();
    var rule;
    var items;
    var i;
    var j;
    for (i = 0; i < rules.length; i += 1) {
      rule = rules[i];
      if (lower(rule.name) !== base) continue;
      items = [{ title: rule.name, text: rule.text || 'Kein Regeltext hinterlegt.', change: false, section: 'Fraktionsregel', anchor: 'faction-rule', list: [], correction: '' }];
      for (j = 0; j < rule.sections.length; j += 1) {
        items.push({ title: rule.sections[j].title, text: rule.sections[j].intro, change: false, section: rule.name, anchor: 'faction-rule', list: rule.sections[j].items.slice(0), after: rule.sections[j].after || '', correction: '' });
      }
      return { term: rule.name, note: '', source: faction ? faction.name : '', items: items };
    }
    return null;
  }

  function glossaryEntry(term) {
    var base = lower(baseTerm(term));
    var glossary = CORE_DATA.glossary || [];
    var entry;
    var items;
    var item;
    var sourceText;
    var found;
    var i;
    var j;
    var k;
    if (!base) return null;
    if (/^anti-./.test(base)) base = 'anti';
    found = armyRuleEntry(base);
    if (found) return found;
    for (i = 0; i < glossary.length; i += 1) {
      entry = glossary[i];
      for (j = 0; j < entry.terms.length; j += 1) {
        if (lower(entry.terms[j]) !== base) continue;
        items = [];
        sourceText = [];
        for (k = 0; k < (entry.official || []).length; k += 1) {
          item = officialRule(entry.official[k]);
          if (item) items.push(item);
        }
        if (items.length && CORE_DATA.officialRules) sourceText.push(CORE_DATA.officialRules.source);
        for (k = 0; k < (entry.rules || []).length; k += 1) {
          item = coreRule(entry.rules[k]);
          if (item) items.push(item);
        }
        if ((entry.rules || []).length && CORE_DATA.coreRules) sourceText.push('Quick reference: ' + CORE_DATA.coreRules.source);
        if (!items.length) return null;
        return { term: entry.terms[j], note: entry.note || '', source: sourceText.join(' '), items: items };
      }
    }
    return null;
  }

  var KEYWORD_MENTION_LIMIT = 15;

  function keywordMentions(term) {
    var pattern = new RegExp('(^|[^A-Za-z])' + String(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^A-Za-z])', 'i');
    var faction = ListRules.faction();
    var result = [];
    var detachment;
    var unit;
    var i;
    var j;
    function check(text, label) {
      if (text && pattern.test(text)) result.push(label);
    }
    if (!faction) return result;
    for (i = 0; i < faction.detachments.length; i += 1) {
      detachment = faction.detachments[i];
      for (j = 0; j < detachment.rules.length; j += 1) check(detachment.rules[j].text, detachment.name + ' (Detachment-Regel)');
      for (j = 0; j < detachment.stratagems.length; j += 1) check(detachment.stratagems[j].text, detachment.stratagems[j].name + ' (Stratagem, ' + detachment.name + ')');
      for (j = 0; j < detachment.enhancements.length; j += 1) {
        check(enhancementText(detachment.enhancements[j]), detachment.enhancements[j].name + ' (Verbesserung, ' + detachment.name + ')');
      }
    }
    for (i = 0; i < faction.units.length; i += 1) {
      unit = faction.units[i];
      for (j = 0; j < unit.abilities.length; j += 1) check(unit.abilities[j].text, unit.abilities[j].name + ' (' + unit.name + ')');
    }
    for (i = 0; i < (CORE_DATA.coreStratagems || []).length; i += 1) check(CORE_DATA.coreStratagems[i].effect, CORE_DATA.coreStratagems[i].name + ' (Core-Stratagem)');
    return result;
  }

  function keywordItem(term) {
    var mentions = keywordMentions(term);
    var shown = mentions.slice(0, KEYWORD_MENTION_LIMIT);
    if (mentions.length > shown.length) shown.push('und ' + (mentions.length - shown.length) + ' weitere');
    return {
      title: 'Keyword',
      text: 'Keywords sind Merkmale der Einheit. Regeln, die dieses Keyword nennen, gelten f\u00fcr Einheiten mit diesem Merkmal.' +
        (mentions.length ? ' Erw\u00e4hnt in den hinterlegten Regeltexten:' : ' In den hinterlegten Regeltexten dieser Fraktion wird es nicht erw\u00e4hnt.'),
      change: false,
      section: '',
      anchor: '',
      list: shown,
      keyword: true
    };
  }

  function termEntry(term, isKeyword) {
    var entry = glossaryEntry(term);
    if (!isKeyword) return entry;
    if (!String(term).replace(/^\s+|\s+$/g, '')) return null;
    if (!entry) return { term: String(term), note: '', source: '', items: [keywordItem(term)] };
    entry.items.push(keywordItem(term));
    return entry;
  }

  function entrySheet(state, index, summary) {
    var entries = state.entries || [];
    var entry = entries[index];
    var unit = ListRules.findUnit(entry.unitId);
    var checked;
    var counts;
    var weapons = [];
    var weaponIds = {};
    var equipment = [];
    var attached = [];
    var targetIndex = findEntryIndex(entries, entry.attachedTo);
    var keywords = [];
    var id;
    var i;
    summary = summary || ListRules.rosterSummary(state);
    checked = summary.loadouts[index] || (unit ? ListRules.checkLoadout(unit, entry.models, entry.split, entry.loadout) : null);
    counts = checked && checked.structural ? checked.counts : null;
    if (unit) {
      for (i = 0; i < unit.weapons.length; i += 1) {
        weaponIds[unit.weapons[i].id] = true;
        if (counts && has(counts, unit.weapons[i].id) && counts[unit.weapons[i].id] > 0) {
          weapons.push({ id: unit.weapons[i].id, name: unit.weapons[i].name, type: unit.weapons[i].type, count: counts[unit.weapons[i].id], profiles: unit.weapons[i].profiles });
        }
      }
      for (id in counts) {
        if (has(counts, id) && counts[id] > 0 && !has(weaponIds, id)) equipment.push({ name: ListRules.itemName(unit, id), count: counts[id] });
      }
      keywords = unit.keywords.concat(unit.factionKeywords);
      for (i = 0; i < (entry.keywords || []).length; i += 1) {
        if (!contains(keywords, entry.keywords[i])) keywords.push(entry.keywords[i]);
      }
    }
    for (i = 0; i < entries.length; i += 1) {
      if (i !== index && entries[i].attachedTo === entry.id) attached.push(entries[i]);
    }
    return {
      index: index,
      entry: entry,
      unit: unit,
      label: entryLabel(entry),
      modelCount: entry.models,
      price: summary.prices[index],
      legends: !!(unit && unit.legends),
      warlord: state.warlordId === entry.id,
      loadout: unit ? loadoutGroups(unit, checked) : [],
      profiles: unit ? unit.profiles : [],
      weapons: weapons,
      equipment: equipment,
      abilities: unit ? equippedAbilities(unit, counts) : [],
      specialRules: unit ? specialRules(unit, counts) : [],
      keywords: keywords,
      summary: unit ? unit.summary || '' : '',
      enhancement: entry.enhancementId ? ListRules.enhancement(entry.enhancementId) : null,
      role: summary.roles ? summary.roles[index] : null,
      attachedTo: targetIndex >= 0 ? entries[targetIndex] : null,
      attached: attached
    };
  }

  function usedTerms(state) {
    var entries = state.entries || [];
    var summary = ListRules.rosterSummary(state);
    var seen = {};
    var result = [];
    var sheet;
    var abilities;
    var i;
    var j;
    var k;
    var m;
    function consider(term) {
      var entry = glossaryEntry(term);
      if (!entry || has(seen, lower(entry.term))) return;
      seen[lower(entry.term)] = true;
      result.push(entry);
    }
    for (i = 0; i < entries.length; i += 1) {
      sheet = entrySheet(state, i, summary);
      for (j = 0; j < sheet.weapons.length; j += 1) {
        for (k = 0; k < sheet.weapons[j].profiles.length; k += 1) {
          abilities = sheet.weapons[j].profiles[k].abilities || [];
          for (m = 0; m < abilities.length; m += 1) consider(abilities[m]);
        }
      }
      for (j = 0; j < sheet.specialRules.length; j += 1) consider(sheet.specialRules[j]);
      for (j = 0; j < sheet.keywords.length; j += 1) consider(sheet.keywords[j]);
    }
    return result;
  }

  function profileValue(value, inches) {
    var text;
    if (value === null || typeof value === 'undefined' || value === '') return '-';
    text = String(value);
    return inches && /^\d+(\.\d+)?$/.test(text) ? text + '"' : text;
  }

  function profileRows(sheet) {
    var rows = [];
    var row;
    var i;
    var j;
    for (i = 0; i < sheet.profiles.length; i += 1) {
      row = [profileValue(sheet.profiles[i].name)];
      for (j = 0; j < STATS.length; j += 1) row.push(profileValue((sheet.profiles[i].stats || {})[STATS[j]]));
      rows.push(row);
    }
    return rows;
  }

  function weaponRows(sheet, type) {
    var rows = [];
    var weapon;
    var profile;
    var i;
    var j;
    for (i = 0; i < sheet.weapons.length; i += 1) {
      weapon = sheet.weapons[i];
      if (weapon.type !== type) continue;
      for (j = 0; j < weapon.profiles.length; j += 1) {
        profile = weapon.profiles[j];
        rows.push([
          weapon.profiles.length > 1 ? weapon.name + ' - ' + profile.name : weapon.name,
          String(weapon.count),
          profileValue(profile.range),
          profileValue(profile.a),
          profileValue(profile.skill),
          profileValue(profile.s),
          profileValue(profile.ap),
          profileValue(profile.d),
          (profile.abilities || []).length ? profile.abilities.join(', ') : '-'
        ]);
      }
    }
    return rows;
  }

  function roleLabel(role) {
    if (role === 'leader') return 'Leader';
    if (role === 'support') return 'Support';
    return 'Zuordnung';
  }

  function sheetFlags(sheet) {
    var flags = [];
    var labels = [];
    var i;
    if (sheet.warlord) flags.push('KRIEGSHERR');
    if (sheet.enhancement) flags.push('Verbesserung: ' + sheet.enhancement.name + ' (' + sheet.enhancement.cost + ' Pkt.)');
    if (sheet.attachedTo) flags.push(roleLabel(sheet.role) + ' von ' + entryLabel(sheet.attachedTo));
    for (i = 0; i < sheet.attached.length; i += 1) labels.push(entryLabel(sheet.attached[i]));
    if (labels.length) flags.push('Angeschlossen: ' + labels.join(', '));
    if (sheet.entry.keywords && sheet.entry.keywords.length) flags.push('Gew\u00e4hlte Keywords: ' + sheet.entry.keywords.join(', '));
    return flags;
  }

  function selectedDetachments(state) {
    var faction = ListRules.faction();
    var result = [];
    var ids = state.detachments || [];
    var i;
    if (!faction) return result;
    for (i = 0; i < faction.detachments.length; i += 1) {
      if (contains(ids, faction.detachments[i].id)) result.push(faction.detachments[i]);
    }
    return result;
  }

  function sourceLabel(name, numbers) {
    return numbers.length ? name + ' (#' + numbers.join(', #') + ')' : name;
  }

  function addCandidate(list, keys, key, item, number) {
    var i;
    if (key !== null) {
      for (i = 0; i < keys.length; i += 1) {
        if (keys[i] === key) {
          if (number !== null) list[i].numbers.push(number);
          return;
        }
      }
    }
    keys.push(key);
    item.numbers = number !== null ? [number] : [];
    list.push(item);
  }

  function hasKeyword(unit, name) {
    var all = unit.keywords.concat(unit.factionKeywords);
    var i;
    for (i = 0; i < all.length; i += 1) {
      if (lower(all[i]) === lower(name)) return true;
    }
    return false;
  }

  function coreStratagemUnits(entries, stratagem) {
    var result = [];
    var unit;
    var i;
    var j;
    if (!stratagem.requires) return [];
    for (i = 0; i < entries.length; i += 1) {
      unit = ListRules.findUnit(entries[i].unitId);
      if (!unit) continue;
      for (j = 0; j < stratagem.requires.length; j += 1) {
        if (hasKeyword(unit, stratagem.requires[j])) {
          result.push('#' + entryNumber(entries[i]));
          break;
        }
      }
    }
    return result.length ? result : null;
  }

  function armyText(rule) {
    var parts = rule.text ? [rule.text] : [];
    var i;
    for (i = 0; i < rule.sections.length; i += 1) {
      parts.push(rule.sections[i].title + ': ' + rule.sections[i].intro + ' ' + rule.sections[i].items.join('; ') + (rule.sections[i].after ? ' ' + rule.sections[i].after : ''));
    }
    return parts.join(' ');
  }

  function cheatsheet(state) {
    var list = [];
    var keys = [];
    var entries = state.entries || [];
    var detachments = selectedDetachments(state);
    var rules = armyRules();
    var phases = [];
    var summary = ListRules.rosterSummary(state);
    var unit;
    var sheet;
    var ability;
    var item;
    var rule;
    var number;
    var eligible;
    var i;
    var j;
    var k;
    for (i = 0; i < rules.length; i += 1) {
      addCandidate(list, keys, 'army|' + rules[i].id, { kind: 'army', name: rules[i].name, source: '', text: armyText(rules[i]), timing: dataTiming(rules[i].phases, 'both', '', 'any') }, null);
    }
    for (i = 0; i < detachments.length; i += 1) {
      for (j = 0; j < detachments[i].rules.length; j += 1) {
        rule = detachments[i].rules[j];
        addCandidate(list, keys, null, { kind: 'detachment', name: rule.name, source: detachments[i].name, text: rule.text, timing: dataTiming(rule.phases, 'both', rule.text, 'passive') }, null);
      }
    }
    for (i = 0; i < detachments.length; i += 1) {
      for (j = 0; j < detachments[i].stratagems.length; j += 1) {
        item = detachments[i].stratagems[j];
        addCandidate(list, keys, null, { kind: 'stratagem', name: item.name, cp: item.cp, source: detachments[i].name, text: item.text, timing: dataTiming(item.phases, turnOf(item.turn), item.text, 'any') }, null);
      }
    }
    for (i = 0; i < (CORE_DATA.coreStratagems || []).length; i += 1) {
      item = CORE_DATA.coreStratagems[i];
      eligible = coreStratagemUnits(entries, item);
      if (eligible === null) continue;
      addCandidate(list, keys, null, { kind: 'stratagem', name: item.name, cp: item.cp, source: 'Core-Stratagem' + (eligible.length ? ' (' + eligible.join(', ') + ')' : ''), text: item.effect, timing: timing(item.effect, item.timing) }, null);
    }
    for (i = 0; i < entries.length; i += 1) {
      item = entries[i].enhancementId ? ListRules.enhancement(entries[i].enhancementId) : null;
      if (!item) continue;
      addCandidate(list, keys, 'enhancement|' + item.id, { kind: 'enhancement', name: item.name, source: unitName(entries[i].unitId), text: enhancementText(item), timing: dataTiming(item.phases, 'both', item.text, 'passive') }, entryNumber(entries[i]));
    }
    for (i = 0; i < entries.length; i += 1) {
      unit = ListRules.findUnit(entries[i].unitId);
      if (!unit) continue;
      number = entryNumber(entries[i]);
      sheet = entrySheet(state, i, summary);
      for (j = 0; j < sheet.abilities.length; j += 1) {
        ability = sheet.abilities[j];
        addCandidate(list, keys, 'ability|' + unit.id + '|' + ability.id, { kind: 'ability', name: ability.name, source: unit.name, text: ability.text, timing: dataTiming(ability.phases, 'both', ability.text, 'passive') }, number);
      }
      for (j = 0; j < sheet.specialRules.length; j += 1) {
        rule = sheet.specialRules[j];
        for (k = 0; k < CORE_RULES.length; k += 1) {
          if (CORE_RULES[k].pattern.test(rule)) {
            addCandidate(list, keys, 'core|' + rule, { kind: 'core', name: rule, source: '', text: coreText(rule), timing: coreTiming(CORE_RULES[k].phases) }, number + ' ' + unit.name);
          }
        }
      }
    }
    for (i = 0; i < PHASES.length; i += 1) phases.push({ id: PHASES[i].id, label: PHASES[i].label, items: [] });
    for (i = 0; i < list.length; i += 1) {
      for (j = 0; j < list[i].timing.length; j += 1) {
        for (k = 0; k < phases.length; k += 1) {
          if (phases[k].id !== list[i].timing[j].phase) continue;
          phases[k].items.push({
            kind: list[i].kind,
            name: list[i].name,
            cp: typeof list[i].cp === 'number' ? list[i].cp : null,
            source: list[i].kind === 'core' ? coreSource(list[i].numbers) : sourceLabel(list[i].source, list[i].numbers),
            text: list[i].text,
            turn: list[i].timing[j].turn
          });
        }
      }
    }
    return phases;
  }

  function coreText(term) {
    var entry = glossaryEntry(term);
    return entry && entry.items.length ? entry.items[0].text : '';
  }

  function coreTiming(phases) {
    var result = [];
    var i;
    for (i = 0; i < phases.length; i += 1) result.push({ phase: phases[i], turn: 'both' });
    return result;
  }

  function coreSource(numbers) {
    var parts = [];
    var i;
    for (i = 0; i < numbers.length; i += 1) parts.push('#' + numbers[i]);
    return parts.join(', ');
  }

  function pad(text, width) {
    var result = String(text);
    while (result.length < width) result += ' ';
    return result;
  }

  function table(lines, headers, rows) {
    var widths = [];
    var line;
    var i;
    var j;
    for (j = 0; j < headers.length; j += 1) widths.push(headers[j].length);
    for (i = 0; i < rows.length; i += 1) {
      for (j = 0; j < rows[i].length; j += 1) {
        if (j < rows[i].length - 1 && rows[i][j].length > widths[j]) widths[j] = rows[i][j].length;
      }
    }
    line = '    ';
    for (j = 0; j < headers.length; j += 1) line += j < headers.length - 1 ? pad(headers[j], widths[j]) + '  ' : headers[j];
    lines.push(line);
    for (i = 0; i < rows.length; i += 1) {
      line = '    ';
      for (j = 0; j < rows[i].length; j += 1) line += j < rows[i].length - 1 ? pad(rows[i][j], widths[j]) + '  ' : rows[i][j];
      lines.push(line);
    }
  }

  function heading(lines, title) {
    lines.push('', '==================================================', title, '==================================================');
  }

  function pointsText(price) {
    return price && typeof price.points === 'number' ? price.points + ' Pkt.' : 'Punkte unvollst\u00e4ndig';
  }

  function warlordText(state) {
    var index = findEntryIndex(state.entries || [], state.warlordId);
    if (index < 0) return state.warlordId ? 'ung\u00fcltig (' + state.warlordId + ')' : 'nicht ausgew\u00e4hlt';
    return entryLabel(state.entries[index]);
  }

  function exportUnit(lines, sheet, position) {
    var flags = sheetFlags(sheet);
    var rows;
    var list;
    var i;
    lines.push('', '[' + position + '] ' + sheet.label + ' \u00b7 ' + sheet.modelCount + (sheet.modelCount === 1 ? ' Modell' : ' Modelle') + ' \u00b7 ' + pointsText(sheet.price));
    if (flags.length) lines.push('  ' + flags.join(' \u00b7 '));
    lines.push('  Ausr\u00fcstung:');
    for (i = 0; i < sheet.loadout.length; i += 1) lines.push('    ' + sheet.loadout[i].count + '\u00d7 ' + sheet.loadout[i].role + ': ' + gearText(sheet.loadout[i].gear));
    rows = profileRows(sheet);
    if (rows.length) {
      lines.push('  Profil:');
      table(lines, ['Modell'].concat(STATS), rows);
    }
    rows = weaponRows(sheet, 'ranged');
    if (rows.length) {
      lines.push('  Fernkampfwaffen:');
      table(lines, ['Waffe', 'Anz.', 'Range', 'A', 'BS', 'S', 'AP', 'D', 'Abilities'], rows);
    }
    rows = weaponRows(sheet, 'melee');
    if (rows.length) {
      lines.push('  Nahkampfwaffen:');
      table(lines, ['Waffe', 'Anz.', 'Range', 'A', 'WS', 'S', 'AP', 'D', 'Abilities'], rows);
    }
    if (sheet.equipment.length) {
      list = [];
      for (i = 0; i < sheet.equipment.length; i += 1) list.push((sheet.equipment[i].count > 1 ? sheet.equipment[i].count + '\u00d7 ' : '') + sheet.equipment[i].name);
      lines.push('  Ausr\u00fcstung ohne Waffenprofil: ' + list.join(', '));
    }
    if (sheet.abilities.length || sheet.enhancement) {
      lines.push('  F\u00e4higkeiten:');
      for (i = 0; i < sheet.abilities.length; i += 1) lines.push('    - ' + sheet.abilities[i].name + (sheet.abilities[i].text ? ': ' + sheet.abilities[i].text : ''));
      if (sheet.enhancement) lines.push('    - Verbesserung ' + sheet.enhancement.name + (enhancementText(sheet.enhancement) ? ': ' + enhancementText(sheet.enhancement) : ''));
    }
    if (sheet.specialRules.length) lines.push('  Sonderregeln: ' + sheet.specialRules.join(', '));
    if (sheet.keywords.length) lines.push('  Keywords: ' + sheet.keywords.join(', '));
  }

  function itemLine(item) {
    return '  - [' + KIND_LABELS[item.kind] + (item.cp !== null ? ' ' + item.cp + ' CP' : '') + '] ' + item.name +
      (item.source ? ' \u2013 ' + item.source : '') + (item.turn !== 'both' ? ' (' + TURN_LABELS[item.turn] + ')' : '');
  }

  function sourceLine() {
    var lib = typeof FACTION_LIBRARY !== 'undefined' ? FACTION_LIBRARY.dataset : null;
    return 'Quellen: ' + (lib ? lib.name + ' v' + lib.version + ' (Stand ' + lib.effectiveDate + ')' : 'unbekannt') +
      '. Powered by 40kdc-data (https://40kdc.alpacasoft.dev). Regeltexte auf Englisch, nur soweit hinterlegt.';
  }

  function exportText(state) {
    var summary = ListRules.rosterSummary(state);
    var faction = ListRules.faction();
    var detachments = selectedDetachments(state);
    var entries = state.entries || [];
    var rules = armyRules();
    var phases;
    var terms;
    var names = [];
    var lines = [];
    var i;
    var j;
    var k;
    for (i = 0; i < detachments.length; i += 1) names.push(detachments[i].name + ' (' + detachments[i].dp + ' DP)');
    lines.push(listName(state));
    lines.push((faction ? faction.name : String(state.factionId)) + ' \u00b7 ' + battleLabel(state) + ' \u00b7 ' + summary.total.known + ' / ' + state.budget + ' Pkt.' +
      (summary.total.unknown ? ' (Teilsumme: ' + summary.total.unknown + ' Eintr\u00e4ge mit unbekannten Kosten)' : ''));
    lines.push('Detachments: ' + (names.length ? names.join(', ') : 'keine'));
    lines.push('Detachment-Punkte: ' + summary.dp + (summary.dpLimit !== null ? ' / ' + summary.dpLimit : '') + ' \u00b7 Verbesserungen: ' + summary.enhancementCount +
      (ListRules.battleSizes[state.battleSize] ? ' / ' + ListRules.battleSizes[state.battleSize].enhancements : ''));
    lines.push('Kriegsherr: ' + warlordText(state));
    lines.push('Listenpr\u00fcfung: ' + summary.errors.length + ' Fehler, ' + summary.warnings.length + ' Hinweise');
    for (i = 0; i < summary.errors.length; i += 1) lines.push('  FEHLER: ' + summary.errors[i]);
    for (i = 0; i < summary.warnings.length; i += 1) lines.push('  Hinweis: ' + summary.warnings[i]);
    lines.push(sourceLine());

    heading(lines, 'EINHEITEN');
    if (!entries.length) lines.push('', 'Keine Einheiten ausgew\u00e4hlt.');
    for (i = 0; i < entries.length; i += 1) exportUnit(lines, entrySheet(state, i, summary), i + 1);

    heading(lines, 'DETACHMENTS');
    if (!detachments.length) lines.push('', 'Kein Detachment ausgew\u00e4hlt.');
    for (i = 0; i < detachments.length; i += 1) {
      lines.push('', detachments[i].name + ' \u00b7 ' + detachments[i].dp + ' DP' + (detachments[i].forceDispositions.length ? ' \u00b7 ' + detachments[i].forceDispositions.join(' / ') : ''));
      for (j = 0; j < detachments[i].rules.length; j += 1) lines.push('  Regel: ' + detachments[i].rules[j].name + (detachments[i].rules[j].text ? ': ' + detachments[i].rules[j].text : ''));
      if (detachments[i].stratagems.length) lines.push('  Stratagems:');
      for (j = 0; j < detachments[i].stratagems.length; j += 1) {
        lines.push('    - ' + detachments[i].stratagems[j].name + ' (' + detachments[i].stratagems[j].cp + ' CP)' + (detachments[i].stratagems[j].text ? ': ' + detachments[i].stratagems[j].text : ''));
      }
    }

    for (i = 0; i < rules.length; i += 1) {
      heading(lines, 'FRAKTIONSREGEL: ' + rules[i].name);
      lines.push('', rules[i].text || 'Kein Regeltext hinterlegt.');
      for (j = 0; j < rules[i].sections.length; j += 1) {
        lines.push('', rules[i].sections[j].title, rules[i].sections[j].intro);
        for (k = 0; k < rules[i].sections[j].items.length; k += 1) lines.push('  - ' + rules[i].sections[j].items[k]);
        if (rules[i].sections[j].after) lines.push(rules[i].sections[j].after);
      }
    }

    heading(lines, 'SPICKZETTEL NACH PHASE');
    phases = cheatsheet(state);
    for (i = 0; i < phases.length; i += 1) {
      if (!phases[i].items.length) continue;
      lines.push('', '--- ' + phases[i].label + ' ---');
      for (j = 0; j < phases[i].items.length; j += 1) {
        lines.push(itemLine(phases[i].items[j]));
        if (phases[i].items[j].text) lines.push('      ' + phases[i].items[j].text);
      }
    }

    terms = usedTerms(state);
    if (terms.length) {
      heading(lines, 'BEGRIFFE (Core Rules 11. Edition)');
      for (i = 0; i < terms.length; i += 1) {
        if (armyRuleEntry(lower(terms[i].term))) continue;
        lines.push('', terms[i].term);
        if (terms[i].note) lines.push('  Hinweis: ' + terms[i].note);
        for (j = 0; j < terms[i].items.length; j += 1) {
          lines.push('  - ' + (terms[i].items[j].section ? terms[i].items[j].section + ' / ' : '') + terms[i].items[j].title +
            (terms[i].items[j].change ? ' [11th-ed change]' : '') + ': ' + terms[i].items[j].text);
          if (terms[i].items[j].correction) lines.push('    ' + terms[i].items[j].correction);
        }
      }
    }
    return lines.join('\r\n');
  }

  return {
    PHASES: PHASES,
    TURN_LABELS: TURN_LABELS,
    KIND_LABELS: KIND_LABELS,
    phaseLabel: phaseLabel,
    timing: timing,
    baseTerm: baseTerm,
    entryLabel: entryLabel,
    roleLabel: roleLabel,
    gearText: gearText,
    bundleGear: bundleGear,
    enhancementText: enhancementText,
    entrySheet: entrySheet,
    profileRows: profileRows,
    weaponRows: weaponRows,
    sheetFlags: sheetFlags,
    cheatsheet: cheatsheet,
    glossaryEntry: glossaryEntry,
    termEntry: termEntry,
    usedTerms: usedTerms,
    exportText: exportText
  };
}());
