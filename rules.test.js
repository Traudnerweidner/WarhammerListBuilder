(function () {
  var assertions = 0;
  var fso = new ActiveXObject('Scripting.FileSystemObject');
  var base = fso.GetParentFolderName(WScript.ScriptFullName) + '\\';
  var index = FACTION_LIBRARY.index;
  var i;
  var j;
  var k;

  function assert(condition, message) {
    if (!condition) throw new Error(message);
    assertions += 1;
  }

  function read(path) {
    var stream = fso.OpenTextFile(base + path.replace(/\//g, '\\'), 1);
    var text = stream.ReadAll();
    stream.Close();
    return text;
  }

  function serialize(value) {
    var parts = [];
    var key;
    var n;
    if (value === null || typeof value !== 'object') return String(typeof value) + ':' + String(value);
    if (Object.prototype.toString.call(value) === '[object Array]') {
      for (n = 0; n < value.length; n += 1) parts.push(serialize(value[n]));
      return '[' + parts.join(',') + ']';
    }
    for (key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) parts.push(key + '=' + serialize(value[key]));
    }
    return '{' + parts.join(',') + '}';
  }

  function contains(items, value) {
    var n;
    for (n = 0; n < items.length; n += 1) if (items[n] === value) return true;
    return false;
  }

  function hasCode(summary, code) {
    return contains(summary.codes, code);
  }

  function entry(unitId, id) {
    return ListRules.newEntry(ListRules.findUnit(unitId), id);
  }

  function findChoice(slot, itemId) {
    var c;
    var n;
    for (c = 0; c < slot.choices.length; c += 1) {
      for (n = 0; n < slot.choices[c].length; n += 1) if (slot.choices[c][n][0] === itemId) return c;
    }
    return -1;
  }

  function findSlotWith(row, itemId) {
    var s;
    for (s = 0; s < row.regular.length; s += 1) if (findChoice(row.regular[s], itemId) >= 0) return s;
    return -1;
  }

  // ---------- Fraktionsindex & alle Datenblätter ----------

  assert(index.length === 34, '34 playable factions');
  assert(FACTION_LIBRARY.dataset.name === '@alpaca-software/40kdc-data', 'dataset recorded');
  for (i = 0; i < index.length; i += 1) {
    eval(read(index[i].file));
    assert(ListRules.useFaction(index[i].id), index[i].id + ': loads');
    var faction = ListRules.faction();
    assert(faction.units.length === index[i].units && faction.units.length > 0, index[i].id + ': unit count');
    assert(faction.detachments.length === index[i].detachments && faction.detachments.length > 0, index[i].id + ': detachments');
    for (j = 0; j < faction.units.length; j += 1) {
      var unit = faction.units[j];
      assert(unit.sizes.length > 0, unit.id + ': buildable');
      for (k = 0; k < unit.sizes.length; k += 1) {
        var size = unit.sizes[k];
        var split;
        for (split = 0; split < size.splits.length; split += 1) {
          var checked = ListRules.checkLoadout(unit, size.models, split, size.splits[split].loadout);
          assert(checked.valid, unit.id + '@' + size.models + ': default loadout valid');
        }
        assert(ListRules.tierCost(unit.points, size.models, 1) !== null || (unit.pointsProvisional && !unit.points.length), unit.id + '@' + size.models + ': priced');
      }
      var before = serialize(unit.sizes[0].splits[0].loadout);
      var fresh = ListRules.newEntry(unit, 'entry-1');
      fresh.loadout.rows.length = 0;
      assert(serialize(unit.sizes[0].splits[0].loadout) === before, unit.id + ': newEntry copies defaults');
    }
  }

  // ---------- Adepta Sororitas: Daten ----------

  ListRules.useFaction('adepta-sororitas');
  var sororitas = ListRules.faction();
  assert(sororitas.units.length === 33 && sororitas.detachments.length === 8, 'Sororitas: 33 units, 8 detachments');
  assert(sororitas.armyRules[0].name === 'Acts of Faith' && sororitas.armyRules[0].text.length > 50, 'Acts of Faith with text');
  assert(ListRules.findUnit('aveline') === null, 'Legends are not part of the dataset');
  var exorcist = ListRules.findUnit('exorcist');
  assert(ListRules.tierCost(exorcist.points, 1, 1) === 175 && ListRules.tierCost(exorcist.points, 1, 2) === 175 && ListRules.tierCost(exorcist.points, 1, 3) === 215, 'Exorcist ordinal pricing');
  var seraphim = ListRules.findUnit('seraphim-squad');
  assert(ListRules.tierCost(seraphim.points, 5, 1) === 75 && ListRules.tierCost(seraphim.points, 10, 1) === 150 && ListRules.tierCost(seraphim.points, 10, 3) === 160, 'Seraphim size and ordinal pricing');
  assert(ListRules.findDetachment('army-of-faith').stratagems.length === 6, 'Army of Faith stratagems');

  // ---------- Ausrüstung ----------

  var sisters = ListRules.findUnit('battle-sisters-squad');
  var row = -1;
  for (i = 0; i < sisters.loadout.rows.length; i += 1) if (sisters.loadout.rows[i].name === 'Battle Sister') row = i;
  assert(row >= 0, 'Battle Sister row');
  var slot = findSlotWith(sisters.loadout.rows[row], 'meltagun-battle-sisters-squad');
  var melta = findChoice(sisters.loadout.rows[row].regular[slot], 'meltagun-battle-sisters-squad');
  var heavy = findChoice(sisters.loadout.rows[row].regular[slot], 'multi-melta');
  var loadout = ListRules.defaultLoadout(sisters, 10, 0);
  loadout.rows[row][0].picks[slot] = [melta];
  assert(ListRules.checkLoadout(sisters, 10, 0, loadout).valid, 'one meltagun valid');
  loadout.rows[row][1].picks[slot] = [heavy];
  assert(ListRules.checkLoadout(sisters, 10, 0, loadout).valid, 'meltagun + multi-melta valid');
  loadout.rows[row][2].picks[slot] = [heavy];
  var tooMany = ListRules.checkLoadout(sisters, 10, 0, loadout);
  assert(tooMany.structural && !tooMany.valid, 'two multi-meltas plus meltagun rejected');
  assert(tooMany.counts['multi-melta'] === 2, 'counts tracked');
  loadout.rows[row][0].picks[slot] = [999];
  assert(!ListRules.checkLoadout(sisters, 10, 0, loadout).structural, 'out-of-range choice is structural error');
  assert(!ListRules.checkLoadout(sisters, 9, 0, ListRules.defaultLoadout(sisters, 10, 0)).structural, 'invalid size rejected');
  assert(!ListRules.checkLoadout(sisters, 10, 0, null).structural, 'missing loadout rejected');

  var immolator = ListRules.findUnit('immolator');
  var immolatorLoadout = ListRules.defaultLoadout(immolator, 1, 0);
  var irow = immolator.loadout.rows[0];
  var islot = findSlotWith(irow, 'twin-multi-melta');
  assert(islot >= 0, 'Immolator twin multi-melta option');
  immolatorLoadout.rows[0][0].picks[islot] = [findChoice(irow.regular[islot], 'twin-multi-melta')];
  var counts = ListRules.loadoutCounts(immolator, 1, 0, immolatorLoadout);
  var cost = ListRules.unitCost(immolator, 1, 1, counts, []);
  assert(cost.base === 100 && cost.wargear === 15 && cost.points === 115, 'Immolator wargear surcharge');

  var seraphimLoadout = ListRules.resizeLoadout(seraphim, 10, 0, ListRules.defaultLoadout(seraphim, 5, 0));
  assert(ListRules.checkLoadout(seraphim, 10, 0, seraphimLoadout).valid, 'resize keeps a valid loadout');

  // ---------- Listenprüfung ----------

  var state = ListRules.fresh('adepta-sororitas');
  state.detachments = ['army-of-faith'];
  state.entries = [entry('canoness', 'entry-1'), entry('battle-sisters-squad', 'entry-2'), entry('exorcist', 'entry-3'), entry('sororitas-rhino', 'entry-4')];
  state.entries[0].attachedTo = 'entry-2';
  state.warlordId = 'entry-1';
  var snapshot = serialize(state);
  var summary = ListRules.rosterSummary(state);
  assert(summary.errors.length === 0, 'valid list has no errors: ' + summary.errors.join(' | '));
  assert(summary.total.known === 60 + 100 + 175 + 65, 'points total');
  assert(serialize(state) === snapshot, 'rosterSummary does not mutate state');
  assert(contains(ListRules.attachmentTargets(state, 0), 'entry-2'), 'Canoness can lead Battle Sisters');
  assert(!contains(ListRules.attachmentTargets(state, 0), 'entry-3'), 'Canoness cannot lead an Exorcist');

  var available = ListRules.availableEnhancements(state, 0);
  assert(available.length > 0, 'Canoness has enhancements');
  state.entries[0].enhancementId = available[0].id;
  summary = ListRules.rosterSummary(state);
  assert(summary.errors.length === 0 && summary.enhancementCount === 1, 'enhancement accepted');
  assert(summary.total.known === 400 + available[0].cost, 'enhancement cost added');

  state.entries.push(entry('morvenn-vahl', 'entry-5'));
  state.entries[4].enhancementId = available[1].id;
  summary = ListRules.rosterSummary(state);
  assert(hasCode(summary, 'warlord-not-supreme-commander'), 'Supreme Commander must be warlord');
  assert(hasCode(summary, 'enhancement-on-epic-hero'), 'no enhancement on Epic Hero');
  state.entries.pop();

  state.entries.push(entry('dialogus', 'entry-6'));
  assert(hasCode(ListRules.rosterSummary(state), 'leader-must-attach'), 'Support must attach');
  state.entries[4].attachedTo = 'entry-2';
  summary = ListRules.rosterSummary(state);
  assert(!hasCode(summary, 'leader-must-attach') && !hasCode(summary, 'leader-attachment-illegal'), 'Support attached');
  state.entries[4].attachedTo = 'entry-3';
  assert(hasCode(ListRules.rosterSummary(state), 'leader-attachment-illegal'), 'illegal bodyguard');
  state.entries.pop();

  state.entries.push(entry('exorcist', 'entry-7'), entry('exorcist', 'entry-8'), entry('exorcist', 'entry-9'));
  summary = ListRules.rosterSummary(state);
  assert(hasCode(summary, 'unit-limit-exceeded'), 'four Exorcists exceed the Strike Force limit');
  assert(summary.prices[5].base === 215 && summary.prices[6].base === 215, 'third and fourth Exorcist cost more');
  state.entries.length = 4;

  state.warlordId = 'entry-2';
  assert(hasCode(ListRules.rosterSummary(state), 'warlord-not-character'), 'warlord must be a character');
  state.warlordId = null;
  assert(hasCode(ListRules.rosterSummary(state), 'no-warlord'), 'warlord required');
  state.warlordId = 'entry-1';

  state.battleSize = 'incursion';
  state.budget = 1000;
  state.detachments = ['hallowed-martyrs'];
  summary = ListRules.rosterSummary(state);
  assert(summary.dp === 3 && summary.dpLimit === 3 && !hasCode(summary, 'detachment-points-over'), 'Incursion allows one 3 DP detachment');
  state.detachments = ['hallowed-martyrs', 'chorus-of-condemnation'];
  assert(hasCode(ListRules.rosterSummary(state), 'detachment-points-over'), 'Incursion DP limit');
  state.detachments = ['sacred-champions', 'champions-of-faith'];
  assert(hasCode(ListRules.rosterSummary(state), 'detachment-tag-conflict'), 'shared detachment tag');
  state.battleSize = 'strike-force';
  state.budget = 2000;
  state.detachments = ['army-of-faith'];

  // ---------- Speicherformat ----------

  var stored = ListRules.normalizeStored(state);
  assert(stored && stored.notices.length === 0 && serialize(stored.state) === serialize(state), 'v3 round trip');
  assert(ListRules.normalizeStored({ version: 3, factionId: 'orks' }) === null, 'foreign faction rejected');
  assert(ListRules.normalizeStored('garbage') === null, 'garbage rejected');
  var broken = ListRules.normalizeStored({ version: 3, factionId: 'adepta-sororitas', name: '', battleSize: 'strike-force', budget: 2000, detachments: ['army-of-faith', 'gone'], warlordId: 'entry-1',
    entries: [{ id: 'entry-1', unitId: 'canoness', models: 1, split: 0, loadout: { rows: [], unit: [] }, enhancementId: null, attachedTo: null, keywords: [] },
      { id: 'entry-2', unitId: 'aveline', models: 1, split: 0, loadout: null, enhancementId: null, attachedTo: null, keywords: [] }] });
  assert(broken.state.entries.length === 1 && broken.state.detachments.length === 1, 'removed units and detachments dropped');
  assert(ListRules.checkLoadout(ListRules.findUnit('canoness'), 1, 0, broken.state.entries[0].loadout).valid, 'invalid loadout reset to default');
  assert(broken.notices.length === 3, 'notices for loadout, unit and detachment');

  var legacy = ListRules.normalizeStored({ version: 2, name: 'Alt', battleSize: 'strike-force', budget: 2000, detachments: ['army-of-faith'], warlordId: 'entry-1',
    entries: [{ id: 'entry-1', unitId: 'canoness', points: null, choices: ['default'], enhancementId: 'army-of-faith--litanies-of-faith', attachedTo: 'entry-2' },
      { id: 'entry-2', unitId: 'battle-sisters-squad', points: null, choices: ['default', 'default', 'default', 'default', 'default', 'default', 'default', 'default', 'default', 'default'], enhancementId: null, attachedTo: null }] });
  assert(legacy && legacy.state.version === 3 && legacy.state.factionId === 'adepta-sororitas', 'legacy list migrated');
  assert(legacy.state.entries[0].enhancementId === 'litanies-of-faith-army-of-faith-adepta-sororitas', 'legacy enhancement mapped');
  assert(legacy.state.entries[0].attachedTo === 'entry-2' && legacy.state.entries[1].models === 10, 'legacy attachment and size kept');
  assert(ListRules.rosterSummary(legacy.state).errors.length === 0, 'migrated list valid');

  // ---------- Spielansicht & Export ----------

  var phases = PlaySheet.cheatsheet(state);
  assert(phases.length === PlaySheet.PHASES.length, 'cheatsheet phases');
  var text = PlaySheet.exportText(state);
  assert(text.indexOf('Adepta Sororitas') >= 0 && text.indexOf('Powered by 40kdc-data') >= 0, 'export header and attribution');
  var sheet = PlaySheet.entrySheet(state, 1, ListRules.rosterSummary(state));
  assert(sheet.loadout.length === 2 && sheet.weapons.length > 0, 'unit sheet loadout and weapons');
  assert(PlaySheet.baseTerm('Scouts 6"') === 'Scouts' && PlaySheet.baseTerm('Damaged: 1-4 Wounds Remaining') === 'Damaged' &&
    PlaySheet.baseTerm('Deadly Demise D6+2') === 'Deadly Demise' && PlaySheet.baseTerm('Sustained Hits 1 (vs Monster)') === 'Sustained Hits', 'glossary terms normalized');

  ListRules.useFaction('space-wolves');
  var wolves = ListRules.fresh('space-wolves');
  wolves.detachments = [ListRules.faction().detachments[0].id];
  wolves.entries = [entry('captain', 'entry-1'), entry('intercessor-squad', 'entry-2')];
  wolves.warlordId = 'entry-1';
  summary = ListRules.rosterSummary(wolves);
  assert(summary.errors.length === 0, 'Space Wolves list valid: ' + summary.errors.join(' | '));
  assert(ListRules.findUnit('death-company-marines') === null, 'other chapters excluded');
  assert(PlaySheet.exportText(wolves).indexOf('Space Wolves') >= 0, 'export for other faction');

  if (typeof WScript !== 'undefined') WScript.Echo('Passed ' + assertions + ' assertions.');
}());
