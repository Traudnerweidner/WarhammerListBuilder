(function () {
  if (typeof document === 'undefined') return;

  var STORAGE_KEY = 'armeewerkstatt-v3';
  var LEGACY_STORAGE_KEY = 'sororitas-workshop-v1';
  var THEME_KEY = 'armeewerkstatt-theme';
  var LEGACY_THEME_KEY = 'sororitas-theme';
  var DEFAULT_FACTION = 'adepta-sororitas';
  var MAX_ENTRIES = ListRules.MAX_ENTRIES;
  var findUnit = ListRules.findUnit;

  var state = ListRules.fresh(DEFAULT_FACTION);
  var storageAvailable = true;
  var storageIssue = '';
  var notices = [];
  var loading = false;
  var search = '';
  var showLegends = false;
  var roleFilter = 'all';
  var activeEntryId = null;
  var openModels = {};
  var showWargearRules = true;

  var catalogueGroups = [
    { id: 'support', label: 'Unterstützungscharaktere' },
    { id: 'characters', label: 'Charaktere & Kommando' },
    { id: 'battleline', label: 'Linientruppen' },
    { id: 'infantry', label: 'Infanterie & Spezialisten' },
    { id: 'flyers', label: 'Sprungtruppen & Flieger' },
    { id: 'mounted', label: 'Bikes, Kavallerie & Bestien' },
    { id: 'monsters', label: 'Monster' },
    { id: 'vehicles', label: 'Fahrzeuge & Feuerunterstützung' },
    { id: 'transports', label: 'Transport' },
    { id: 'fortifications', label: 'Befestigungen' },
    { id: 'other', label: 'Weitere Einheiten' }
  ];

  // ---------- Helpers ----------

  function get(id) { return document.getElementById(id); }

  function clear(element) { while (element.firstChild) element.removeChild(element.firstChild); }

  function node(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function button(text, className, handler) {
    var result = node('button', className, text);
    result.type = 'button';
    result.addEventListener('click', handler);
    return result;
  }

  function addOption(select, value, text, disabled) {
    var option = node('option', '', text);
    option.value = value;
    if (disabled) option.disabled = true;
    select.appendChild(option);
    return option;
  }

  function englishText(container, text, className) {
    if (!text) return;
    String(text).split('\n').forEach(function (part) {
      if (!part) return;
      var paragraph = node('p', className || '', part);
      paragraph.lang = 'en';
      container.appendChild(paragraph);
    });
  }

  function validInteger(value, min, max) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value && value >= min && value <= max;
  }

  function copy(value) { return JSON.parse(JSON.stringify(value)); }

  function lowerKeywords(unit) {
    return unit.keywords.concat(unit.factionKeywords).map(function (word) { return String(word).toLowerCase(); });
  }

  function battleSize() {
    return state.battleSize ? ListRules.battleSizes[state.battleSize] : null;
  }

  function faction() { return ListRules.faction(); }

  function factionInfo(id) { return ListRules.factionInfo(id || state.factionId); }

  function factionName() {
    var info = factionInfo();
    return info ? info.name : String(state.factionId);
  }

  function displayName() {
    return state.name.trim() || 'Unbenannte Liste';
  }

  function slug(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'liste';
  }

  function roleText(role) {
    return role === 'support' ? 'Support' : role === 'leader' ? 'Leader' : 'Zuordnung';
  }

  // ---------- Zustand ----------

  function findEntry(id) {
    for (var i = 0; i < state.entries.length; i++) if (state.entries[i].id === id) return state.entries[i];
    return null;
  }

  function entryPosition(entry) { return state.entries.indexOf(entry); }

  function nextEntryId() {
    var max = '0';
    function reserve(id) {
      if (!id) return;
      var number = id.slice(6);
      if (number.length > max.length || (number.length === max.length && number > max)) max = number;
    }
    reserve(state.warlordId);
    state.entries.forEach(function (entry) {
      reserve(entry.id);
      reserve(entry.attachedTo);
    });
    var digits = max.split('');
    var i = digits.length - 1;
    while (i >= 0 && digits[i] === '9') { digits[i] = '0'; i--; }
    if (i < 0) digits.unshift('1');
    else digits[i] = String(Number(digits[i]) + 1);
    return 'entry-' + digits.join('');
  }

  function save() {
    if (!storageAvailable) {
      get('save-status').textContent = storageIssue;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      get('save-status').textContent = 'In diesem Browser gespeichert';
    } catch (error) {
      storageAvailable = false;
      storageIssue = 'Speicher nicht verfügbar. Liste zur Sicherung exportieren.';
      get('save-status').textContent = storageIssue;
    }
  }

  function readStored() {
    var raw = localStorage.getItem(STORAGE_KEY);
    var legacy = false;
    if (raw === null) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      legacy = raw !== null;
    }
    return raw === null ? null : { value: JSON.parse(raw), legacy: legacy };
  }

  function noticeText(notice) {
    var label = notice.entryId ? 'Eintrag #' + notice.entryId.slice(6) + (notice.unitId ? ' (' + ((findUnit(notice.unitId) || {}).name || notice.unitId) + ')' : '') : '';
    switch (notice.code) {
      case 'legacy': return 'Liste aus der bisherigen Sororitas-Version übernommen. Datenbasis ist jetzt 40kdc-data; die Ausrüstung aller Einheiten wurde auf die Standardausrüstung zurückgesetzt. Bitte prüfen.';
      case 'unit-removed': return label + ' entfernt: Datenblatt ist im Datensatz nicht (mehr) enthalten, z. B. Legends.';
      case 'size-reset': return label + ': Modellzahl ' + notice.models + ' ist nicht mehr zulässig und wurde zurückgesetzt.';
      case 'split-reset': return label + ': Modellaufteilung zurückgesetzt.';
      case 'loadout-reset': return label + ': Ausrüstung passte nicht mehr zum Datenblatt und wurde auf Standard zurückgesetzt.';
      case 'enhancement-removed': return label + ': Verbesserung nicht mehr verfügbar und entfernt.';
      case 'keywords-reset': return label + ': gewählte Keywords zurückgesetzt.';
      case 'attachment-removed': return label + ': Zuordnung entfernt, weil die Leibwache entfernt wurde.';
      case 'warlord-removed': return 'Kriegsherr entfernt, weil der Eintrag entfernt wurde.';
      case 'detachment-removed': return 'Detachment „' + notice.detachmentId + '“ nicht mehr verfügbar und entfernt.';
      default: return notice.code;
    }
  }

  function renderNotices() {
    var root = get('storage-notices');
    clear(root);
    root.hidden = !notices.length;
    notices.forEach(function (notice) { root.appendChild(node('li', '', noticeText(notice))); });
  }

  // ---------- Fraktionsdaten laden ----------

  function loadFaction(id, done) {
    var info = ListRules.factionInfo(id);
    if (!info) { done(false); return; }
    if (ListRules.factionData(id)) { ListRules.useFaction(id); done(true); return; }
    var script = document.createElement('script');
    script.src = info.file;
    script.onload = function () { done(ListRules.useFaction(id)); };
    script.onerror = function () { done(false); };
    document.head.appendChild(script);
  }

  function setLoading(value, message) {
    loading = value;
    get('faction').disabled = value;
    document.documentElement.classList.toggle('is-loading', value);
    if (message) get('save-status').textContent = message;
  }

  function changeFaction(id) {
    if (id === state.factionId || loading) return;
    if ((state.entries.length || state.detachments.length) &&
        !window.confirm('Fraktion wechseln? Einheiten, Detachments und Kriegsherr dieser Liste werden entfernt. Zur Sicherung vorher exportieren.')) {
      get('faction').value = state.factionId;
      return;
    }
    setLoading(true, 'Lade Fraktionsdaten …');
    loadFaction(id, function (ok) {
      setLoading(false);
      if (!ok) {
        get('faction').value = state.factionId;
        ListRules.useFaction(state.factionId);
        get('save-status').textContent = 'Fraktionsdaten konnten nicht geladen werden.';
        return;
      }
      var previous = state;
      state = ListRules.fresh(id);
      state.name = previous.name;
      state.battleSize = previous.battleSize;
      state.budget = previous.budget;
      activeEntryId = null;
      openModels = {};
      notices = [];
      search = '';
      roleFilter = 'all';
      get('search').value = '';
      get('role-filter').value = 'all';
      renderAll();
      save();
    });
  }

  // ---------- Texte ----------

  function gearText(gear) { return PlaySheet.gearText(gear); }

  function priceText(price) {
    if (!price) return 'Punkte unbekannt';
    if (price.points === null) {
      var known = 0;
      ['base', 'wargear', 'enhancement'].forEach(function (field) { if (typeof price[field] === 'number') known += price[field]; });
      return 'Punkte unvollständig · ' + known + ' bekannt';
    }
    return price.points + ' Pkt.' + (price.wargear ? ' inkl. ' + price.wargear + ' Ausrüstung' : '') + (price.enhancement ? ' inkl. Verbesserung' : '') + (price.provisional ? ' (vorläufig)' : '');
  }

  function unitName(id) {
    var unit = findUnit(id);
    return unit ? unit.name : id;
  }

  function entryLabel(entry) {
    return 'Eintrag #' + entry.id.slice(6) + ' · ' + unitName(entry.unitId);
  }

  function referenceLabel(id) {
    var entry = findEntry(id);
    return entry ? entryLabel(entry) : 'Nicht verfügbarer Eintrag [' + id + ']';
  }

  function warlordText() {
    var entry = findEntry(state.warlordId);
    return 'Kriegsherr: ' + (entry ? entryLabel(entry) : state.warlordId ? referenceLabel(state.warlordId) : 'nicht ausgewählt');
  }

  function battleText() {
    if (state.battleSize === 'incursion') return 'Aufklärungsmission';
    if (state.battleSize === 'strike-force') return 'Einsatzverband';
    return 'Benutzerdefiniert';
  }

  function dpText(summary) {
    if (summary.dpLimit === null) return 'Detachment-Punkte: ' + summary.dp + ' DP · keine Standardgrenze';
    return 'Detachment-Punkte: ' + summary.dp + ' / ' + summary.dpLimit + ' DP' + (state.battleSize === 'incursion' ? ' (alternativ genau ein Detachment mit 3 DP)' : '');
  }

  function enhancementText(summary) {
    var size = battleSize();
    return 'Verbesserungen: ' + summary.enhancementCount + (size ? ' / ' + size.enhancements : ' · keine Standardgrenze');
  }

  function supremeCommander(unit) {
    return unit.rows.some(function (row) { return row.supreme && !row.cannotWarlord; });
  }

  function assignmentText(entry, summary) {
    var unit = findUnit(entry.unitId);
    var enhancement = entry.enhancementId ? ListRules.enhancement(entry.enhancementId) : null;
    var role = summary.roles[entryPosition(entry)];
    var parts = [];
    if (state.warlordId === entry.id) parts.push('KRIEGSHERR');
    else if (supremeCommander(unit)) parts.push('Supreme Commander · muss Kriegsherr sein');
    if (entry.enhancementId) parts.push('Verbesserung: ' + (enhancement ? enhancement.name + ' (' + enhancement.cost + ' Pkt.)' : entry.enhancementId));
    if (entry.attachedTo) parts.push(roleText(role) + ' von ' + referenceLabel(entry.attachedTo));
    if (entry.keywords.length) parts.push('Keywords: ' + entry.keywords.join(', '));
    return parts.join(' · ');
  }

  function forceText(detachment) {
    return detachment.name + ' · ' + detachment.dp + ' DP' + (detachment.forceDispositions.length ? ' · ' + detachment.forceDispositions.join(' / ') : '');
  }

  function unitHint(unit) {
    if (unit.hint) return unit.hint;
    var parts = [];
    if (unit.attachmentRole) parts.push(roleText(unit.attachmentRole));
    if (unit.role === 'epic-hero') parts.push('Epic Hero');
    if (unit.transport) parts.push('Transport (' + unit.transport.capacity + ')');
    return parts.join(' · ');
  }

  function sizeText(unit) {
    var sizes = unit.sizes.map(function (size) { return size.models; });
    if (!sizes.length) return 'nicht aufstellbar';
    if (sizes.length === 1) return sizes[0] + (sizes[0] === 1 ? ' Modell' : ' Modelle');
    var contiguous = sizes[sizes.length - 1] - sizes[0] === sizes.length - 1;
    return (contiguous ? sizes[0] + '–' + sizes[sizes.length - 1] : sizes.join(' / ')) + ' Modelle';
  }

  // ---------- Katalog ----------

  function catalogueGroup(unit) {
    var keywords = lowerKeywords(unit);
    function has(word) { return keywords.indexOf(word) !== -1; }
    if (unit.attachmentRole === 'support') return 'support';
    if (unit.role === 'character' || unit.role === 'epic-hero' || has('character')) return 'characters';
    if (unit.role === 'battleline' || has('battleline')) return 'battleline';
    if (unit.role === 'dedicated-transport' || has('transport') || has('dedicated transport')) return 'transports';
    if (has('fortification')) return 'fortifications';
    if (has('vehicle') || has('walker')) return 'vehicles';
    if (has('monster')) return 'monsters';
    if (has('jump pack') || has('fly') || has('aircraft')) return 'flyers';
    if (has('mounted') || has('beast') || has('swarm') || has('cavalry')) return 'mounted';
    if (has('infantry')) return 'infantry';
    return 'other';
  }

  function repeatCount(unitId) {
    return state.entries.filter(function (entry) { return entry.unitId === unitId; }).length;
  }

  function searchableText(unit) {
    return [unit.name, unit.hint, unit.summary].concat(unit.keywords, unit.factionKeywords,
      unit.abilities.map(function (ability) { return ability.label; }),
      unit.weapons.map(function (weapon) { return weapon.name; })).join(' ').toLowerCase();
  }

  function addEntry(unit) {
    if (state.entries.length >= MAX_ENTRIES) { window.alert('Dieser Prototyp unterstützt bis zu ' + MAX_ENTRIES + ' Einträge.'); return; }
    activeEntryId = nextEntryId();
    state.entries.push(ListRules.newEntry(unit, activeEntryId));
    renderRoster(); save();
    var replacement = get('add-' + unit.id);
    if (replacement) replacement.focus({ preventScroll: true });
  }

  function catalogueCard(unit) {
    var card = node('article', 'unit-card');
    card.appendChild(node('h4', '', unit.name));
    card.appendChild(node('p', 'role-hint', unitHint(unit)));
    var preview = ListRules.newEntry(unit, 'entry-preview');
    var prices = ListRules.priceEntries({ entries: state.entries.concat([preview]), detachments: state.detachments });
    card.appendChild(node('p', '', 'Nächste Kopie: ' + priceText(prices[prices.length - 1])));
    var bottom = node('div', 'card-bottom');
    bottom.appendChild(node('span', '', sizeText(unit)));
    var count = repeatCount(unit.id);
    if (count) bottom.appendChild(node('span', 'badge', count + '× in der Liste'));
    if (unit.legends) bottom.appendChild(node('span', 'badge', 'LEGENDS'));
    var add = button('+ Hinzufügen', 'add', function () { addEntry(unit); });
    add.id = 'add-' + unit.id;
    add.setAttribute('aria-label', unit.name + ' hinzufügen · ' + count + ' bereits in der Liste');
    bottom.appendChild(add);
    card.appendChild(bottom);
    return card;
  }

  function renderRoleFilter() {
    var select = get('role-filter');
    clear(select);
    addOption(select, 'all', 'Alle Gruppen');
    catalogueGroups.forEach(function (group) { addOption(select, group.id, group.label); });
    select.value = roleFilter;
  }

  function renderCatalogue() {
    var root = get('catalogue'); clear(root);
    var count = 0;
    var data = faction();
    if (!data) return;
    catalogueGroups.forEach(function (group) {
      if (roleFilter !== 'all' && roleFilter !== group.id) return;
      var units = data.units.filter(function (unit) {
        var text = searchableText(unit) + ' ' + group.label.toLowerCase();
        return catalogueGroup(unit) === group.id && (showLegends || !unit.legends) && text.indexOf(search) !== -1;
      });
      if (!units.length) return;
      count += units.length;
      var section = node('section', 'catalogue-group');
      var heading = node('div', 'group-heading');
      var title = node('h3', '', group.label); title.id = 'group-' + group.id;
      section.setAttribute('aria-labelledby', title.id);
      heading.appendChild(title);
      heading.appendChild(node('span', '', String(units.length)));
      section.appendChild(heading);
      var grid = node('div', 'unit-grid');
      units.forEach(function (unit) { grid.appendChild(catalogueCard(unit)); });
      section.appendChild(grid);
      root.appendChild(section);
    });
    get('catalogue-count').textContent = count + ' Einheiten';
    if (!count) root.appendChild(node('p', 'muted', 'Keine Einheiten für diese Filter gefunden.'));
  }

  // ---------- Armeeliste ----------

  function revealDetail() {
    if (window.matchMedia('(max-width: 1100px)').matches) {
      get('roster-title').focus({ preventScroll: true });
      get('configuration-step').scrollIntoView({ block: 'start' });
    }
  }

  function selectEntry(id) {
    if (!findEntry(id)) return;
    activeEntryId = id;
    renderDetail(ListRules.rosterSummary(state));
    updateSelection();
    revealDetail();
  }

  function updateSelection() {
    state.entries.forEach(function (entry) {
      var select = get('select-' + entry.id);
      if (!select) return;
      var selected = entry.id === activeEntryId;
      select.setAttribute('aria-pressed', String(selected));
      select.className = 'entry-select' + (selected ? ' selected' : '');
    });
  }

  function removeEntry(id) {
    var index = -1;
    state.entries.forEach(function (entry, i) { if (entry.id === id) index = i; });
    if (index === -1) return;
    var focused = document.activeElement;
    var restoreFocus = focused && (focused.id === 'remove-' + id || focused.id === 'select-' + id);
    state.entries.splice(index, 1);
    if (activeEntryId === id) activeEntryId = state.entries.length ? state.entries[Math.min(index, state.entries.length - 1)].id : null;
    if (state.warlordId === id) state.warlordId = null;
    state.entries.forEach(function (entry) { if (entry.attachedTo === id) entry.attachedTo = null; });
    renderRoster();
    delete openModels[id];
    save();
    if (restoreFocus) {
      var next = get('select-' + activeEntryId) || get('selection-title');
      next.tabIndex = next.tagName === 'BUTTON' ? 0 : -1;
      next.focus({ preventScroll: true });
    }
  }

  function renderWarlord() {
    var select = get('warlord'); clear(select);
    addOption(select, '', 'Kriegsherrn auswählen');
    var selected = state.warlordId === null;
    var candidates = ListRules.warlordCandidates(state);
    state.entries.forEach(function (entry) {
      if (candidates.indexOf(entry.id) === -1) return;
      var unit = findUnit(entry.unitId);
      addOption(select, entry.id, entryLabel(entry) + (supremeCommander(unit) ? ' · Supreme Commander' : ''));
      if (entry.id === state.warlordId) selected = true;
    });
    if (!selected) addOption(select, state.warlordId, 'UNGÜLTIG · ' + referenceLabel(state.warlordId));
    select.value = state.warlordId || '';
  }

  function selectionItem(entry) {
    var item = node('li', 'selection-item');
    item.id = 'selection-' + entry.id;
    item.setAttribute('data-entry-id', entry.id);
    var select = button('', 'entry-select', function () { selectEntry(entry.id); });
    select.id = 'select-' + entry.id;
    select.setAttribute('aria-controls', 'roster');
    select.appendChild(node('strong'));
    select.appendChild(node('small'));
    select.appendChild(node('small', 'entry-status'));
    item.appendChild(select);
    var remove = button('Entfernen', 'remove quiet', function () { removeEntry(entry.id); });
    remove.id = 'remove-' + entry.id;
    remove.setAttribute('aria-label', entryLabel(entry) + ' entfernen');
    item.appendChild(remove);
    return item;
  }

  function renderSelection(summary) {
    var root = get('selection-summary');
    var total = get('selection-total');
    if (!total) {
      total = node('p'); total.id = 'selection-total'; root.appendChild(total);
      var list = node('ul', 'selection-list'); list.id = 'selection-list'; root.appendChild(list);
    }
    total.textContent = state.entries.length ? state.entries.length + ' Einheiten · ' + summary.total.known + ' Pkt.' + (summary.total.unknown ? ' · ' + summary.total.unknown + ' mit unbekannten Kosten' : '') : 'Noch keine Einheiten ausgewählt.';
    var listRoot = get('selection-list');
    Array.prototype.slice.call(listRoot.children).forEach(function (item) {
      if (!findEntry(item.getAttribute('data-entry-id'))) listRoot.removeChild(item);
    });
    state.entries.forEach(function (entry, index) {
      var unit = findUnit(entry.unitId);
      if (!get('selection-' + entry.id)) listRoot.appendChild(selectionItem(entry));
      var content = get('select-' + entry.id).children;
      content[0].textContent = (index + 1) + '. ' + unit.name;
      content[1].textContent = entry.models + (entry.models === 1 ? ' Modell · ' : ' Modelle · ') + priceText(summary.prices[index]);
      var enhancement = ListRules.enhancement(entry.enhancementId);
      var status = [];
      if (state.warlordId === entry.id) status.push('KRIEGSHERR');
      if (enhancement) status.push(enhancement.name);
      if (entry.attachedTo) status.push('→ #' + entry.attachedTo.slice(6));
      if (summary.loadouts[index] && !summary.loadouts[index].valid) status.push('Ausrüstung prüfen');
      content[2].textContent = status.join(' · ');
      content[2].hidden = !content[2].textContent;
    });
    updateSelection();
  }

  // ---------- Eintragsdetails ----------

  function renderEnhancement(entry, fields) {
    var index = entryPosition(entry);
    var eligible = ListRules.availableEnhancements(state, index);
    if (!eligible.length && !entry.enhancementId) return;
    var label = node('label', '', 'Verbesserung');
    var select = node('select'); select.id = 'enhancement-' + entry.id;
    addOption(select, '', 'Keine');
    var valid = entry.enhancementId === null;
    eligible.forEach(function (item) {
      addOption(select, item.id, item.name + ' · ' + item.cost + ' Pkt.' + (item.upgrade ? ' · Aufwertung' : '') + (!item.counts ? ' · ohne Platz' : ''));
      if (item.id === entry.enhancementId) valid = true;
    });
    if (!valid) {
      var current = ListRules.enhancement(entry.enhancementId);
      addOption(select, entry.enhancementId, 'UNGÜLTIG · ' + (current ? current.name + ' · ' + current.cost + ' Pkt.' : entry.enhancementId) + ' (Detachment oder Träger ungeeignet)');
    }
    select.value = entry.enhancementId || '';
    select.addEventListener('change', function () { entry.enhancementId = select.value || null; renderRoster(); save(); });
    label.appendChild(select); fields.appendChild(label);
  }

  function renderAttachment(entry, fields, summary) {
    var index = entryPosition(entry);
    var role = summary.roles[index];
    if (!role && !entry.attachedTo) return;
    var label = node('label', '', role ? roleText(role) + (role === 'support' ? ' · Zuordnung erforderlich' : ' · Zuordnung optional') : 'Zuordnung · ungültige Rolle');
    var select = node('select'); select.id = 'attachment-' + entry.id;
    addOption(select, '', role === 'support' ? 'Leibwache auswählen' : 'Keine');
    var valid = entry.attachedTo === null;
    ListRules.attachmentTargets(state, index).forEach(function (id) {
      addOption(select, id, entryLabel(findEntry(id)));
      if (id === entry.attachedTo) valid = true;
    });
    if (!valid) addOption(select, entry.attachedTo, 'UNGÜLTIG · ' + referenceLabel(entry.attachedTo));
    select.value = entry.attachedTo || '';
    select.addEventListener('change', function () { entry.attachedTo = select.value || null; renderRoster(); save(); });
    label.appendChild(select); fields.appendChild(label);
  }

  function renderKeywordChoices(entry, unit, fields) {
    ListRules.keywordChoices(unit, state.detachments).forEach(function (choice) {
      var label = node('label', '', choice.group.name + (choice.group.mandatory ? ' · Pflichtauswahl' : ' · optional'));
      var select = node('select'); select.id = 'keywords-' + entry.id + '-' + choice.group.id;
      addOption(select, '', 'Keine');
      var current = '';
      choice.keywords.forEach(function (keyword) {
        addOption(select, keyword, keyword);
        if (entry.keywords.indexOf(keyword) !== -1) current = keyword;
      });
      select.value = current;
      select.addEventListener('change', function () {
        entry.keywords = entry.keywords.filter(function (keyword) { return choice.keywords.indexOf(keyword) === -1; });
        if (select.value) entry.keywords.push(select.value);
        renderRoster(); save();
      });
      label.appendChild(select); fields.appendChild(label);
    });
  }

  function renderPoints(entry, fields, summary) {
    var price = summary.prices[entryPosition(entry)];
    var label = node('label', '', 'Grundpunkte (automatisch)');
    var points = node('input'); points.id = 'points-' + entry.id;
    points.type = 'text'; points.readOnly = true;
    points.value = price.base === null ? 'Unbekannt' : String(price.base) + (price.wargear ? ' + ' + price.wargear + ' Ausrüstung' : '');
    points.title = 'Punkte aus dem Datensatz; Verbesserungen kommen hinzu.';
    label.appendChild(points); fields.appendChild(label);
  }

  function splitText(unit, split) {
    return unit.loadout.rows.map(function (row, r) { return split.rows[r] ? split.rows[r] + '× ' + row.label : null; })
      .filter(function (text) { return text; }).join(', ');
  }

  function renderModelCount(entry, unit, fields) {
    var size = ListRules.sizeOf(unit, entry.models);
    if (unit.sizes.length > 1 || !size) {
      var label = node('label', '', 'Modelle');
      var select = node('select'); select.id = 'size-' + entry.id;
      if (!size) addOption(select, String(entry.models), 'UNGÜLTIG · ' + entry.models + ' Modelle');
      unit.sizes.forEach(function (option) { addOption(select, String(option.models), String(option.models)); });
      select.value = String(entry.models);
      select.addEventListener('change', function () {
        var models = Number(select.value);
        entry.loadout = ListRules.resizeLoadout(unit, models, 0, entry.loadout);
        entry.models = models;
        entry.split = 0;
        renderRoster(); save();
      });
      label.appendChild(select); fields.appendChild(label);
    }
    if (size && size.splits.length > 1) {
      var splitLabel = node('label', '', 'Modellaufteilung');
      var splitSelect = node('select'); splitSelect.id = 'split-' + entry.id;
      size.splits.forEach(function (split, index) { addOption(splitSelect, String(index), splitText(unit, split)); });
      splitSelect.value = String(entry.split);
      splitSelect.addEventListener('change', function () {
        var split = Number(splitSelect.value);
        entry.loadout = ListRules.resizeLoadout(unit, entry.models, split, entry.loadout);
        entry.split = split;
        renderRoster(); save();
      });
      splitLabel.appendChild(splitSelect); fields.appendChild(splitLabel);
    }
  }

  // ---------- Ausrüstung ----------

  function rememberEditors() {
    var card = get('roster').firstChild;
    if (!card || !findEntry(card.id)) return;
    var expanded = [];
    Array.prototype.forEach.call(card.querySelectorAll('details[data-models]'), function (details) {
      if (details.open) expanded = expanded.concat(details.getAttribute('data-models').split(','));
    });
    openModels[card.id] = expanded;
  }

  function itemsMap(items) {
    var map = {};
    items.forEach(function (item) { map[item[0]] = (map[item[0]] || 0) + item[1]; });
    return map;
  }

  function choiceLabel(unit, choice) {
    return choice.length ? gearText(PlaySheet.bundleGear(unit, itemsMap(choice))) : 'Keine';
  }

  function weaponType(unit, id) {
    for (var i = 0; i < unit.weapons.length; i++) if (unit.weapons[i].id === id) return unit.weapons[i].type;
    return 'gear';
  }

  function slotLabel(unit, slot) {
    var types = {};
    var optional = false;
    slot.choices.forEach(function (choice) {
      if (!choice.length) optional = true;
      choice.forEach(function (item) { types[weaponType(unit, item[0])] = true; });
    });
    var names = Object.keys(types);
    var label = names.length === 1 && names[0] === 'ranged' ? 'Fernkampfwaffe' : names.length === 1 && names[0] === 'melee' ? 'Nahkampfwaffe' : 'Ausrüstung';
    return label + (optional ? ' (optional)' : '');
  }

  function firstPicks(slot) {
    var picks = [];
    var used = {};
    var empty = -1;
    slot.choices.forEach(function (choice, index) { if (!choice.length && empty === -1) empty = index; });
    for (var p = 0; p < slot.picks; p++) {
      if (slot.repeats) { picks.push(0); continue; }
      var index = -1;
      for (var c = 0; c < slot.choices.length && index === -1; c++) {
        if (!used[c] || !slot.choices[c].length) index = c;
      }
      if (index === -1) index = empty;
      used[index] = true;
      picks.push(index);
    }
    return picks;
  }

  function pickForMode(unit, entry, r, mode) {
    var row = unit.loadout.rows[r];
    var defaults = ListRules.defaultLoadout(unit, entry.models, entry.split);
    if (mode === 'bare') return { mode: 'bare', picks: [] };
    for (var m = 0; defaults && m < defaults.rows[r].length; m++) {
      if (defaults.rows[r][m].mode === mode) return copy(defaults.rows[r][m]);
    }
    if (row.plain) return { mode: 'regular', picks: [] };
    return { mode: mode, picks: (mode === 'alternate' ? row.alternate : row.regular).map(firstPicks) };
  }

  function applyLoadout(entry, loadout) {
    entry.loadout = loadout;
    var summary = ListRules.rosterSummary(state);
    renderDetail(summary); renderSummary(summary); renderWarlord(); save();
  }

  function candidateValid(unit, entry, loadout) {
    return ListRules.checkLoadout(unit, entry.models, entry.split, loadout).valid;
  }

  function slotSelect(unit, entry, slot, id, value, currentValid, build) {
    var select = node('select'); select.id = id;
    slot.choices.forEach(function (choice, index) {
      var candidate = build(index);
      var allowed = index === value || !currentValid || (candidate && candidateValid(unit, entry, candidate));
      addOption(select, String(index), choiceLabel(unit, choice) + (allowed ? '' : ' (Limit)'), !allowed);
    });
    select.value = String(value);
    select.addEventListener('change', function () {
      var candidate = build(Number(select.value));
      if (candidate) applyLoadout(entry, candidate);
    });
    return select;
  }

  function modesFor(row) {
    var modes = [];
    if (!row.plain || row.template.length) modes.push('regular');
    if (row.alternate.length) modes.push('alternate');
    if (row.bare > 0) modes.push('bare');
    return modes;
  }

  var MODE_LABELS = { regular: 'Standardoptionen', alternate: 'Alternative Ausrüstung', bare: 'Ohne Ausrüstung' };

  function modelEditor(unit, entry, r, m, currentValid) {
    var row = unit.loadout.rows[r];
    var pick = entry.loadout.rows[r][m];
    var line = node('div', 'model-row slot-row');
    line.appendChild(node('span', 'model-row-title', 'Modell ' + (m + 1) + ' · ' + row.label));
    var modes = modesFor(row);
    if (modes.length > 1) {
      var modeField = node('label', 'slot-select', 'Ausrüstungsart');
      var modeSelect = node('select'); modeSelect.id = 'gear-' + entry.id + '-' + r + '-' + m + '-mode';
      modes.forEach(function (mode) {
        var candidate = copy(entry.loadout);
        candidate.rows[r][m] = pickForMode(unit, entry, r, mode);
        var allowed = mode === pick.mode || !currentValid || candidateValid(unit, entry, candidate);
        addOption(modeSelect, mode, MODE_LABELS[mode] + (allowed ? '' : ' (Limit)'), !allowed);
      });
      modeSelect.value = pick.mode;
      modeSelect.addEventListener('change', function () {
        var candidate = copy(entry.loadout);
        candidate.rows[r][m] = pickForMode(unit, entry, r, modeSelect.value);
        applyLoadout(entry, candidate);
      });
      modeField.appendChild(modeSelect);
      line.appendChild(modeField);
    }
    if (pick.mode === 'bare' || row.plain) {
      line.appendChild(node('small', 'muted', pick.mode === 'bare' ? 'Dieses Modell trägt keine Ausrüstung.' : 'Feste Ausrüstung: ' + gearText(PlaySheet.bundleGear(unit, itemsMap(row.template)))));
      return line;
    }
    var slots = pick.mode === 'alternate' ? row.alternate : row.regular;
    slots.forEach(function (slot, s) {
      if (slot.choices.length < 2 && slot.picks <= 1) return;
      for (var p = 0; p < slot.picks; p++) {
        (function (p) {
          var field = node('label', 'slot-select', slotLabel(unit, slot) + (slot.picks > 1 ? ' ' + (p + 1) + '/' + slot.picks : ''));
          field.appendChild(slotSelect(unit, entry, slot, 'gear-' + entry.id + '-' + r + '-' + m + '-' + s + '-' + p, pick.picks[s][p], currentValid, function (choice) {
            var candidate = copy(entry.loadout);
            candidate.rows[r][m].picks[s][p] = choice;
            return ListRules.validPicks(slot, candidate.rows[r][m].picks[s]) ? candidate : null;
          }));
          line.appendChild(field);
        }(p));
      }
    });
    return line;
  }

  function unitEditor(unit, entry, currentValid) {
    var block = node('div', 'model-group');
    block.appendChild(node('h5', '', 'Ausrüstung der Einheit'));
    var line = node('div', 'model-row slot-row');
    unit.loadout.unitSlots.forEach(function (slot, s) {
      for (var p = 0; p < slot.picks; p++) {
        (function (p) {
          var field = node('label', 'slot-select', slotLabel(unit, slot) + (slot.picks > 1 ? ' ' + (p + 1) + '/' + slot.picks : ''));
          field.appendChild(slotSelect(unit, entry, slot, 'gear-' + entry.id + '-u-' + s + '-' + p, entry.loadout.unit[s][p], currentValid, function (choice) {
            var candidate = copy(entry.loadout);
            candidate.unit[s][p] = choice;
            return ListRules.validPicks(slot, candidate.unit[s]) ? candidate : null;
          }));
          line.appendChild(field);
        }(p));
      }
    });
    block.appendChild(line);
    return block;
  }

  function configurable(row) {
    if (modesFor(row).length > 1) return true;
    if (row.plain) return false;
    return row.regular.some(function (slot) { return slot.choices.length > 1; });
  }

  function renderLimits(unit, checked, section) {
    if (!checked || !checked.structural) return;
    var items = [];
    checked.limits.forEach(function (limit) {
      if (!limit.ids.length) return;
      var owner = limit.row < 0 ? 'Einheit' : unit.loadout.rows[limit.row].label;
      items.push({ text: owner + ': begrenzt – ' + limit.ids.map(function (id) { return ListRules.itemName(unit, id); }).join(', '), ok: limit.holds });
    });
    checked.uniform.forEach(function (rule) {
      var set = unit.loadout.uniform[rule.index];
      var owner = set.row === null ? 'Einheit' : set.row;
      items.push({ text: owner + ': alle Modelle mit derselben Hauptwaffe', ok: rule.holds });
    });
    if (!items.length && checked.valid) return;
    var box = node('div', 'wargear-limits');
    box.appendChild(node('h5', '', 'Ausrüstungslimits je Einheit'));
    var list = node('ul');
    items.forEach(function (item) { list.appendChild(node('li', item.ok ? '' : 'over', item.text + (item.ok ? ' · eingehalten' : ' · überschritten'))); });
    checked.errors.forEach(function (message) {
      var item = node('li', 'over', message); item.lang = 'en'; list.appendChild(item);
    });
    box.appendChild(list);
    section.appendChild(box);
  }

  function renderLoadouts(entry, unit, card, summary) {
    var checked = summary.loadouts[entryPosition(entry)];
    var section = node('section', 'loadout-section');
    section.appendChild(node('h4', '', 'Modelle & Ausrüstung'));
    if (!checked || !checked.structural) {
      section.appendChild(node('p', 'muted', 'Ausrüstung ungültig. Modellzahl neu wählen, um die Standardausrüstung zu laden.'));
      card.appendChild(section);
      return;
    }
    renderLimits(unit, checked, section);
    if ((unit.wargearRules || []).length) {
      var rules = node('details');
      rules.open = showWargearRules;
      rules.addEventListener('toggle', function () { showWargearRules = rules.open; });
      rules.appendChild(node('summary', '', 'Ausrüstungsregeln (EN)'));
      var ruleList = node('ul');
      ruleList.lang = 'en';
      unit.wargearRules.forEach(function (text) { ruleList.appendChild(node('li', '', text)); });
      rules.appendChild(ruleList);
      section.appendChild(rules);
    }
    unit.loadout.rows.forEach(function (row, r) {
      var picks = entry.loadout.rows[r];
      if (!picks.length) return;
      var groups = [];
      picks.forEach(function (pick, m) {
        var key = JSON.stringify(pick);
        var group = null;
        groups.forEach(function (candidate) { if (candidate.key === key) group = candidate; });
        if (!group) { group = { key: key, indices: [], gear: PlaySheet.bundleGear(unit, checked.rows[r].bundles[m]) }; groups.push(group); }
        group.indices.push(m);
      });
      var block = node('div', 'model-group');
      block.appendChild(node('h5', '', picks.length + ' × ' + row.label));
      groups.forEach(function (group) {
        block.appendChild(node('p', 'gear-summary', group.indices.length + '× ' + gearText(group.gear)));
      });
      if (configurable(row)) {
        var details = node('details');
        var keys = picks.map(function (pick, m) { return r + ':' + m; });
        details.setAttribute('data-models', keys.join(','));
        details.open = keys.some(function (key) { return (openModels[entry.id] || []).indexOf(key) !== -1; });
        var toggle = node('summary', '', 'Ausrüstung ändern');
        toggle.setAttribute('aria-label', 'Ausrüstung ändern · ' + row.label);
        toggle.id = 'models-' + entry.id + '-' + r;
        details.appendChild(toggle);
        picks.forEach(function (pick, m) { details.appendChild(modelEditor(unit, entry, r, m, checked.valid)); });
        block.appendChild(details);
      }
      section.appendChild(block);
    });
    if (unit.loadout.unitSlots.length) section.appendChild(unitEditor(unit, entry, checked.valid));
    card.appendChild(section);
  }

  // ---------- Regeln & Datenblatt ----------

  function openRule(term, isKeyword) {
    var entry = PlaySheet.termEntry(term, isKeyword);
    var dialog = get('rule-dialog');
    if (!entry || !dialog) return;
    get('rule-dialog-title').textContent = entry.term;
    var body = get('rule-dialog-body'); clear(body);
    if (entry.note) englishText(body, entry.note, 'rule-note');
    entry.items.forEach(function (item) {
      var block = node('section', 'rule-block');
      var head = node('div', 'rule-block-head');
      var title = node('h4', '', item.title); title.lang = 'en';
      head.appendChild(title);
      if (item.change) head.appendChild(node('span', 'badge change', 'Änderung 11. Edition'));
      block.appendChild(head);
      if (item.section) { var section = node('p', 'muted rule-section', item.section); section.lang = 'en'; block.appendChild(section); }
      englishText(block, item.text);
      englishText(block, item.correction, 'rule-note');
      if (item.list && item.list.length) {
        var list = node('ul'); list.lang = 'en';
        item.list.forEach(function (text) { list.appendChild(node('li', '', text)); });
        block.appendChild(list);
      }
      englishText(block, item.after, 'muted');
      if (item.anchor) {
        var link = node('a', 'rule-link', 'Im Regeltext anzeigen');
        link.href = '#' + item.anchor;
        link.addEventListener('click', function (event) {
          dialog.close();
          if (location.hash === '#' + item.anchor) { event.preventDefault(); showHashTarget(); }
        });
        block.appendChild(link);
      }
      body.appendChild(block);
    });
    get('rule-dialog-source').textContent = entry.source;
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
  }

  function ruleTerm(term, isKeyword) {
    if (!PlaySheet.termEntry(term, isKeyword)) return document.createTextNode(term);
    var link = node('button', 'rule-term', term);
    link.type = 'button';
    link.lang = 'en';
    link.title = isKeyword ? 'Keyword-Erklärung anzeigen' : 'Regeltext anzeigen';
    link.addEventListener('click', function (event) { event.preventDefault(); event.stopPropagation(); openRule(term, isKeyword); });
    return link;
  }

  function termList(container, terms, separator, isKeyword) {
    terms.forEach(function (term, index) {
      if (index) container.appendChild(document.createTextNode(separator));
      container.appendChild(ruleTerm(term, isKeyword));
    });
    return container;
  }

  function termLine(container, label, terms, separator, className, isKeyword) {
    if (!terms.length) return;
    var line = node('p', className || '');
    line.lang = 'en';
    if (label) line.appendChild(document.createTextNode(label));
    termList(line, terms, separator, isKeyword);
    container.appendChild(line);
  }

  function profileTable(container, label, headers, rows) {
    var region = node('div', 'profile-table-region');
    region.tabIndex = 0;
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', label);
    var table = node('table', 'profile-table');
    table.appendChild(node('caption', '', label));
    var head = node('thead');
    var heading = node('tr');
    headers.forEach(function (text) {
      var cell = node('th'); cell.scope = 'col';
      cell.appendChild(ruleTerm(text));
      heading.appendChild(cell);
    });
    head.appendChild(heading); table.appendChild(head);
    var body = node('tbody');
    rows.forEach(function (values) {
      var row = node('tr');
      values.forEach(function (text, index) {
        var isList = Object.prototype.toString.call(text) === '[object Array]';
        var cell = node(index ? 'td' : 'th', '', isList ? undefined : text);
        if (isList) {
          if (text.length) termList(cell, text, ', ');
          else cell.textContent = '–';
        }
        if (!index) cell.scope = 'row';
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
    table.appendChild(body); region.appendChild(table); container.appendChild(region);
  }

  var STATS = ['M', 'T', 'SV', 'W', 'LD', 'OC', 'INV'];

  function renderProfiles(unit, section) {
    if (!unit.profiles.length) return;
    profileTable(section, 'Modellprofile', ['Modell'].concat(STATS), unit.profiles.map(function (profile) {
      return [profile.name].concat(STATS.map(function (stat) { return profile.stats[stat]; }));
    }));
    if (unit.base) section.appendChild(node('p', 'muted', 'Base: ' + unit.base));
    section.appendChild(node('p', 'muted', 'Basiswerte ohne bedingte Ausrüstungs-, Fähigkeits- oder Detachment-Effekte.'));
    unit.profiles.forEach(function (profile) {
      if (profile.notes) englishText(section, profile.name + ': ' + profile.notes, 'muted');
    });
  }

  function renderWeapons(unit, section) {
    ['ranged', 'melee'].forEach(function (type) {
      var rows = [];
      unit.weapons.forEach(function (weapon) {
        if (weapon.type !== type) return;
        weapon.profiles.forEach(function (profile) {
          var name = weapon.profiles.length > 1 ? weapon.name + ' – ' + profile.name : weapon.name;
          rows.push([name, profile.range, profile.a, profile.skill, profile.s, profile.ap, profile.d, profile.abilities.slice()]);
        });
      });
      if (rows.length) profileTable(section, type === 'ranged' ? 'Fernkampfwaffen' : 'Nahkampfwaffen', ['Waffe', 'Range', 'A', type === 'ranged' ? 'BS' : 'WS', 'S', 'AP', 'D', 'Abilities'], rows);
    });
  }

  function hasTexts() {
    var info = factionInfo();
    return !!(info && info.texts);
  }

  function renderDatasheet(unit, container) {
    var section = node('section', 'unit-rules');
    section.appendChild(node('h4', '', 'Datenblatt'));
    var lib = FACTION_LIBRARY.dataset;
    section.appendChild(node('p', 'role-hint', 'Quelle: ' + lib.name + ' v' + lib.version + ' · Stand ' + lib.effectiveDate));
    renderProfiles(unit, section);
    renderWeapons(unit, section);
    var abilities = unit.abilities.filter(function (ability) { return ability.kind === 'unit'; });
    var special = unit.abilities.filter(function (ability) { return ability.kind !== 'unit'; }).map(function (ability) { return ability.label; });
    if (unit.summary || abilities.length) {
      section.appendChild(node('h5', '', 'Fähigkeiten (EN)'));
      if (!hasTexts()) section.appendChild(node('p', 'muted', 'Für diese Fraktion sind keine Regeltexte hinterlegt; nur die Namen werden angezeigt.'));
      englishText(section, unit.summary);
      abilities.forEach(function (ability) {
        var title = node('h5', '', ability.name + (ability.wargear ? ' (mit ' + ListRules.itemName(unit, ability.wargear) + ')' : '')); title.lang = 'en'; section.appendChild(title);
        englishText(section, ability.text);
      });
    }
    if (special.length) {
      section.appendChild(node('h5', '', 'Sonderregeln (EN)'));
      var rulesList = node('ul'); rulesList.lang = 'en';
      special.forEach(function (rule) { var item = node('li'); item.appendChild(ruleTerm(rule)); rulesList.appendChild(item); });
      section.appendChild(rulesList);
    }
    var keywords = unit.keywords.concat(unit.factionKeywords);
    if (keywords.length) {
      section.appendChild(node('h5', '', 'Keywords (EN)'));
      termLine(section, '', keywords, ' · ', 'keywords', true);
    }
    container.appendChild(section);
  }

  function renderUnitRules(entry, unit, card) {
    var enhancement = ListRules.enhancement(entry.enhancementId);
    if (enhancement) {
      var section = node('section', 'unit-rules');
      section.appendChild(node('h5', '', 'Verbesserung: ' + enhancement.name));
      englishText(section, enhancement.restriction, 'muted');
      englishText(section, enhancement.text);
      englishText(section, enhancement.note, 'rule-note');
      card.appendChild(section);
    }
    renderDatasheet(unit, card);
  }

  function restoreDetailFocus(pane, focusedId) {
    var focused = get(focusedId);
    focused.focus({ preventScroll: true });
    if (focusedId.indexOf('gear-') !== 0) return;
    var bounds = focused.getBoundingClientRect();
    if (window.matchMedia('(min-width: 1101px)').matches) {
      var paneBounds = pane.getBoundingClientRect();
      var top = paneBounds.top + pane.firstElementChild.offsetHeight + 16;
      if (bounds.top < top) pane.scrollTop += bounds.top - top;
      else if (bounds.bottom > paneBounds.bottom - 16) pane.scrollTop += bounds.bottom - paneBounds.bottom + 16;
    } else if (bounds.top < 100 || bounds.bottom > window.innerHeight) focused.scrollIntoView({ block: 'center' });
  }

  function renderDetail(summary) {
    var root = get('roster');
    var focusedId = document.activeElement && document.activeElement.id;
    var restoreFocus = root.contains(document.activeElement);
    var previousId = root.firstChild && root.firstChild.id;
    var pane = get('configuration-step');
    var scroll = pane.scrollTop;
    rememberEditors();
    clear(root);
    var entry = findEntry(activeEntryId);
    if (!entry) {
      var empty = node('div', 'empty');
      empty.appendChild(node('strong', '', 'Deine Liste ist noch leer.'));
      empty.appendChild(node('span', '', 'Füge links eine Einheit hinzu; ihre Details erscheinen hier.'));
      root.appendChild(empty);
      return;
    }
    var unit = findUnit(entry.unitId);
    var card = node('article', 'roster-card'); card.id = entry.id; card.tabIndex = -1;
    var heading = node('div', 'roster-heading');
    var title = node('div');
    title.appendChild(node('h4', '', entryLabel(entry)));
    title.appendChild(node('p', 'role-hint', unitHint(unit)));
    var cost = node('p'); cost.id = 'detail-cost'; title.appendChild(cost);
    heading.appendChild(title); card.appendChild(heading);
    var assignments = assignmentText(entry, summary);
    if (assignments) card.appendChild(node('p', 'entry-assignments', assignments));
    var fields = node('div', 'roster-fields');
    renderPoints(entry, fields, summary);
    renderModelCount(entry, unit, fields);
    renderEnhancement(entry, fields);
    renderAttachment(entry, fields, summary);
    renderKeywordChoices(entry, unit, fields);
    card.appendChild(fields);
    renderLoadouts(entry, unit, card, summary);
    renderUnitRules(entry, unit, card);
    root.appendChild(card);
    updateDetailPrice(summary);
    pane.scrollTop = previousId === entry.id ? scroll : 0;
    if (restoreFocus && previousId === entry.id && focusedId && get(focusedId)) restoreDetailFocus(pane, focusedId);
  }

  function updateDetailPrice(summary) {
    var entry = findEntry(activeEntryId);
    if (!entry || !get('detail-cost')) return;
    var price = summary.prices[entryPosition(entry)];
    get('detail-cost').textContent = entry.models + (entry.models === 1 ? ' Modell · ' : ' Modelle · ') + priceText(price);
  }

  // ---------- Prüfung & Export ----------

  function renderValidation(summary) {
    var checks = get('validation'); clear(checks);
    var errorsLabel = node('li', summary.errors.length ? 'error' : 'ok');
    errorsLabel.appendChild(node('strong', '', summary.errors.length ? 'Fehler: ' + summary.errors.length : 'Keine Fehler gefunden'));
    checks.appendChild(errorsLabel);
    summary.errors.forEach(function (message) { var item = node('li', 'error', message); item.lang = 'en'; checks.appendChild(item); });
    var warningsLabel = node('li');
    warningsLabel.appendChild(node('strong', '', 'Hinweise: ' + summary.warnings.length));
    checks.appendChild(warningsLabel);
    summary.warnings.forEach(function (message) { var item = node('li', '', message); item.lang = 'en'; checks.appendChild(item); });
  }

  function renderSummary(summary) {
    if (!faction()) return;
    summary = summary || ListRules.rosterSummary(state);
    get('battle-summary').textContent = displayName() + ' · ' + factionName() + ' · ' + battleText();
    get('warlord-summary').textContent = warlordText();
    get('dp-total').textContent = dpText(summary);
    get('enhancement-total').textContent = enhancementText(summary);
    get('unit-count').textContent = state.entries.length + ' Einheiten';
    clear(get('points-total'));
    get('points-total').appendChild(document.createTextNode(summary.total.known + ' '));
    get('points-total').appendChild(node('small', '', '/ ' + state.budget + ' Pkt.'));
    get('points-note').textContent = summary.total.unknown ? 'Teilsumme · ' + summary.total.unknown + ' Einträge mit unbekannten Kosten.' : 'Inklusive Ausrüstung und Verbesserungen.';
    renderSelection(summary);
    updateDetailPrice(summary);
    var forces = get('selected-forces'); clear(forces);
    if (!state.detachments.length) forces.appendChild(node('li', '', 'Kein Detachment ausgewählt.'));
    faction().detachments.forEach(function (detachment) {
      if (state.detachments.indexOf(detachment.id) !== -1) forces.appendChild(node('li', '', forceText(detachment)));
    });
    renderValidation(summary);
    updateDetachmentAvailability();
    renderTabStatus(summary);
  }

  function renderRoster() {
    if (!faction()) return;
    var cataloguePane = get('catalogue').parentNode;
    var catalogueScroll = cataloguePane.scrollTop;
    var windowScroll = window.pageYOffset;
    if (!findEntry(activeEntryId)) activeEntryId = state.entries.length ? state.entries[0].id : null;
    var summary = ListRules.rosterSummary(state);
    renderDetail(summary); renderWarlord(); renderSummary(summary); renderCatalogue();
    cataloguePane.scrollTop = catalogueScroll;
    if (window.pageYOffset !== windowScroll) window.scrollTo(window.pageXOffset, windowScroll);
  }

  function exportList() {
    var blob = new Blob([PlaySheet.exportText(state)], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var anchor = node('a'); anchor.href = url; anchor.download = slug(factionName()) + '-' + slug(displayName()) + '.txt';
    document.body.appendChild(anchor); anchor.click(); document.body.removeChild(anchor);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ---------- Detachments ----------

  function restrictionText(item) {
    var parts = [];
    if (item.datasheetGroups.length) parts.push('Nur: ' + item.datasheetGroups.map(function (group) { return unitName(group[0]); }).join(' / '));
    if (item.keywordGroups.length) {
      var groups = item.keywordGroups.filter(function (group) { return group.length; }).map(function (group) { return group.join(' + '); });
      if (groups.length) parts.push('Keywords: ' + groups.join(' oder '));
    }
    if (item.excluded.length) parts.push('nicht: ' + item.excluded.join(', '));
    if (item.nonCharacter) parts.push('auch ohne CHARACTER');
    if (item.epicHero) parts.push('auch für EPIC HERO');
    if (item.requiredWargear.length) parts.push('benötigt Ausrüstung');
    if (item.notWarlord) parts.push('Träger kann nicht Kriegsherr sein');
    return parts.join(' · ');
  }

  function enhancementNote(item) {
    var notes = [item.cost + ' Pkt.'];
    if (item.upgrade) notes.push('Aufwertung');
    if (item.maxTargets > 1) notes.push('bis zu ' + item.maxTargets + ' Kopien');
    if (!item.counts) notes.push('zählt nicht gegen das Verbesserungslimit');
    if (item.provisional) notes.push('Punkte vorläufig');
    var restriction = restrictionText(item);
    if (restriction) notes.push(restriction);
    return notes.join(' · ');
  }

  function stratagemNote(item) {
    var phases = item.phases.map(PlaySheet.phaseLabel).join(', ');
    var turn = item.turn === 'your-turn' ? 'eigener Zug' : item.turn === 'opponent-turn' ? 'gegnerischer Zug' : 'beide Züge';
    return item.cp + ' CP' + (phases ? ' · ' + phases : '') + ' · ' + turn;
  }

  function detachmentBlocker(detachment) {
    if (state.detachments.indexOf(detachment.id) !== -1) return '';
    var ids = state.detachments.concat([detachment.id]);
    var summary = ListRules.detachmentSummary(ids);
    var conflict = null;
    detachment.tags.forEach(function (tag) {
      faction().detachments.forEach(function (other) {
        if (!conflict && state.detachments.indexOf(other.id) !== -1 && other.tags.indexOf(tag) !== -1) conflict = { tag: tag, name: other.name };
      });
    });
    if (conflict) return 'Nicht kombinierbar mit ' + conflict.name + ' (beide ' + conflict.tag + ').';
    if (summary.errors.length) return 'Nicht wählbar: ' + summary.errors[0];
    var limit = ListRules.dpLimit(state.battleSize, ids, summary.dp);
    if (limit === null || summary.dp <= limit) return '';
    return 'Würde die DP-Grenze überschreiten (' + summary.dp + ' / ' + limit + ' DP).';
  }

  function updateDetachmentAvailability() {
    faction().detachments.forEach(function (detachment) {
      var input = get('detachment-' + detachment.id);
      var reason = get('detachment-reason-' + detachment.id);
      if (!input || !reason) return;
      var blocker = detachmentBlocker(detachment);
      input.disabled = !!blocker;
      reason.textContent = blocker;
      reason.hidden = !blocker;
      input.closest('.detachment').classList.toggle('blocked', !!blocker);
    });
  }

  function detachmentCard(detachment) {
    var card = node('article', 'detachment');
    var label = node('label');
    var input = node('input'); input.type = 'checkbox'; input.checked = state.detachments.indexOf(detachment.id) !== -1;
    input.id = 'detachment-' + detachment.id;
    input.addEventListener('change', function () {
      var index = state.detachments.indexOf(detachment.id);
      if (input.checked && index === -1) {
        if (detachmentBlocker(detachment)) { input.checked = false; updateDetachmentAvailability(); return; }
        state.detachments.push(detachment.id);
      }
      if (!input.checked && index !== -1) state.detachments.splice(index, 1);
      renderRoster(); save();
    });
    label.appendChild(input); label.appendChild(document.createTextNode(detachment.name + ' · ' + detachment.dp + ' DP'));
    card.appendChild(label);
    var reason = node('p', 'detachment-reason');
    reason.id = 'detachment-reason-' + detachment.id;
    reason.hidden = true;
    card.appendChild(reason);
    if (detachment.forceDispositions.length) card.appendChild(node('p', 'detachment-categories', detachment.forceDispositions.join(' / ')));
    var badges = node('div', 'badges');
    detachment.tags.forEach(function (tag) { badges.appendChild(node('span', 'badge', tag.toUpperCase())); });
    if (badges.children.length) card.appendChild(badges);
    var details = node('details');
    details.appendChild(node('summary', '', 'Details (EN)'));
    detachment.rules.forEach(function (rule) {
      var name = node('h4', '', rule.name); name.lang = 'en'; details.appendChild(name);
      englishText(details, rule.text);
    });
    var list = node('ul');
    detachment.enhancements.forEach(function (item) {
      var entry = node('li');
      var name = node('strong', '', item.name); name.lang = 'en'; entry.appendChild(name);
      entry.appendChild(node('small', '', ' ' + enhancementNote(item)));
      englishText(entry, [item.restriction, item.text].filter(function (text) { return text; }).join(' '));
      englishText(entry, item.note, 'rule-note');
      list.appendChild(entry);
    });
    detachment.stratagems.forEach(function (item) {
      var entry = node('li');
      var name = node('strong', '', item.name); name.lang = 'en'; entry.appendChild(name);
      entry.appendChild(node('small', '', ' ' + stratagemNote(item)));
      englishText(entry, item.text);
      list.appendChild(entry);
    });
    details.appendChild(list);
    card.appendChild(details);
    return card;
  }

  function renderDetachments() {
    var root = get('detachments'); clear(root);
    faction().detachments.forEach(function (detachment) { root.appendChild(detachmentCard(detachment)); });
    updateDetachmentAvailability();
  }

  // ---------- Referenz ----------

  function renderCoreRules() {
    var root = get('core-rules'); clear(root);
    var rules = CORE_DATA.coreRules;
    if (!rules) return;
    get('core-rules-source').textContent = rules.source;
    rules.sections.forEach(function (section) {
      var details = node('details', 'core-section');
      var summary = node('summary', '', section.title); summary.lang = 'en';
      details.appendChild(summary);
      section.items.forEach(function (item) {
        var block = node('div', 'core-item');
        block.id = 'core-' + item.id;
        var head = node('div', 'rule-block-head');
        var title = node('h4', '', item.title); title.lang = 'en';
        head.appendChild(title);
        if (item.change) head.appendChild(node('span', 'badge change', 'Änderung 11. Edition'));
        block.appendChild(head);
        englishText(block, item.text);
        englishText(block, item.correction, 'rule-note');
        details.appendChild(block);
      });
      root.appendChild(details);
    });
  }

  function renderOfficialRules() {
    var root = get('official-rules'); clear(root);
    var rules = CORE_DATA.officialRules;
    if (!rules) return;
    get('official-rules-source').textContent = rules.source;
    rules.sections.forEach(function (section) {
      var details = node('details', 'core-section');
      var summary = node('summary', '', section.title); summary.lang = 'en';
      details.appendChild(summary);
      section.items.forEach(function (item) {
        var block = node('div', 'core-item');
        block.id = 'rule-' + item.id;
        var head = node('div', 'rule-block-head');
        var title = node('h4', '', item.title); title.lang = 'en';
        head.appendChild(title);
        head.appendChild(node('span', 'badge', item.ref));
        block.appendChild(head);
        englishText(block, item.text);
        details.appendChild(block);
      });
      root.appendChild(details);
    });
    var stratagems = node('details', 'core-section');
    var title = node('summary', '', 'Core Stratagems (' + (CORE_DATA.coreStratagems || []).length + ')'); title.lang = 'en';
    stratagems.appendChild(title);
    (CORE_DATA.coreStratagems || []).forEach(function (stratagem) {
      var block = node('div', 'core-item');
      var head = node('div', 'rule-block-head');
      var name = node('h4', '', stratagem.name); name.lang = 'en';
      head.appendChild(name);
      head.appendChild(node('span', 'badge', stratagem.cp + ' CP'));
      block.appendChild(head);
      englishText(block, stratagem.effect);
      stratagems.appendChild(block);
    });
    root.appendChild(stratagems);
  }

  function bindRuleDialog() {
    var dialog = get('rule-dialog');
    get('rule-dialog-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  }

  function renderArmyRule() {
    var root = get('army-rule'); clear(root);
    var rules = faction().armyRules;
    get('faction-rule-title').textContent = rules.length ? 'Fraktionsregel: ' + rules.map(function (rule) { return rule.name; }).join(', ') : 'Fraktionsregel';
    if (!rules.length) root.appendChild(node('p', 'muted', 'Keine Fraktionsregel im Datensatz.'));
    rules.forEach(function (rule) {
      if (rules.length > 1) root.appendChild(node('h3', '', rule.name));
      if (rule.text) root.appendChild(node('p', '', rule.text));
      else root.appendChild(node('p', 'muted', 'Kein Regeltext hinterlegt.'));
      rule.sections.forEach(function (section) {
        root.appendChild(node('h3', '', section.title));
        if (section.intro) root.appendChild(node('p', '', section.intro));
        var list = node('ul');
        section.items.forEach(function (text) { list.appendChild(node('li', '', text)); });
        root.appendChild(list);
        if (section.after) root.appendChild(node('p', '', section.after));
      });
    });
  }

  function tierText(tier, next) {
    var size = tier[1] !== null ? tier[0] + '–' + tier[1] : String(tier[0]);
    var copies = tier[3] === null ? '' : 'Kopie ' + tier[3] + (tier[4] === null ? '+' : tier[4] === tier[3] ? '' : '–' + tier[4]) + ' · ';
    return copies + size + (tier[0] === 1 && tier[1] === null ? ' Modell: ' : ' Modelle: ') + tier[2] + ' Pkt.';
  }

  function renderPricing() {
    var root = get('pricing-reference'); clear(root);
    var attachmentInfo = get('attachment-reference'); clear(attachmentInfo);
    var data = faction();
    get('pricing-count').textContent = data.units.length;
    data.units.forEach(function (unit) {
      var card = node('article', 'unit-card');
      card.appendChild(node('h3', '', unit.name));
      unit.points.forEach(function (tier) { card.appendChild(node('p', '', tierText(tier))); });
      unit.detachmentPoints.forEach(function (row) {
        var detachment = ListRules.findDetachment(row[0]);
        card.appendChild(node('p', '', (detachment ? detachment.name : row[0]) + ': ' + tierText(row.slice(1))));
      });
      unit.wargearCosts.forEach(function (cost) { card.appendChild(node('p', '', '+' + cost[1] + ' Pkt. je ' + ListRules.itemName(unit, cost[0]))); });
      if (unit.pointsProvisional) card.appendChild(node('p', 'muted', 'Punkte vorläufig.'));
      if (unit.attach) {
        var ids = unit.attach.ids.slice();
        unit.attach.groups.forEach(function (group) { group.ids.forEach(function (id) { if (ids.indexOf(id) === -1 && findUnit(id)) ids.push(id); }); });
        if (ids.length) card.appendChild(node('p', '', roleText(unit.attachmentRole) + ': ' + ids.map(unitName).join(', ') + (unit.attach.groups.length ? ' (teils bedingt)' : '')));
      }
      root.appendChild(card);
    });
    var leaders = data.units.filter(function (unit) { return unit.attachmentRole; }).length;
    attachmentInfo.appendChild(node('li', '', leaders + ' Einheiten mit Leader- oder Support-Rolle. Zuordnungen kommen aus dem Datensatz; bedingte Zuordnungen hängen von Armee und Detachment ab.'));
  }

  // ---------- Spielansicht ----------

  var activePhase = 'prebattle';
  var turnFilter = 'all';

  function badge(text, className) {
    return node('span', 'badge' + (className ? ' ' + className : ''), text);
  }

  function cheatItem(item) {
    var li = node('li', 'cheat-item');
    li.setAttribute('data-turn', item.turn);
    var head = node('div', 'cheat-head');
    var name = node('strong'); name.lang = 'en';
    name.appendChild(item.kind === 'core' ? ruleTerm(item.name) : document.createTextNode(item.name));
    head.appendChild(name);
    head.appendChild(badge(PlaySheet.KIND_LABELS[item.kind] + (item.cp !== null ? ' · ' + item.cp + ' CP' : ''), 'kind-' + item.kind));
    if (item.turn !== 'both') head.appendChild(badge(PlaySheet.TURN_LABELS[item.turn], 'turn-' + item.turn));
    li.appendChild(head);
    if (item.source) li.appendChild(node('p', 'cheat-source', item.source));
    if (item.text) englishText(li, item.text, 'cheat-text');
    else if (item.kind === 'core') li.appendChild(node('p', 'muted cheat-text', PlaySheet.glossaryEntry(item.name) ? 'Kernregel – Begriff anklicken für den Regeltext.' : 'Kernregel – Regeltext noch nicht in den Daten.'));
    return li;
  }

  function applyTurnFilter() {
    Array.prototype.forEach.call(document.querySelectorAll('#cheatsheet .cheat-item'), function (item) {
      var turn = item.getAttribute('data-turn');
      item.hidden = (turnFilter === 'own' && turn === 'opponent') || (turnFilter === 'opponent' && turn === 'own');
    });
    PlaySheet.PHASES.forEach(function (phase) {
      var panel = get('phase-' + phase.id);
      var phaseButton = get('phase-button-' + phase.id);
      if (!panel || !phaseButton) return;
      var visible = panel.querySelectorAll('.cheat-item:not([hidden])').length;
      panel.querySelector('.phase-empty').hidden = visible > 0;
      phaseButton.textContent = phase.label + ' (' + visible + ')';
    });
  }

  function showPhase(id) {
    activePhase = id;
    PlaySheet.PHASES.forEach(function (phase) {
      var panel = get('phase-' + phase.id);
      var phaseButton = get('phase-button-' + phase.id);
      if (panel) panel.hidden = phase.id !== id;
      if (phaseButton) phaseButton.setAttribute('aria-pressed', String(phase.id === id));
    });
  }

  function renderCheatsheet() {
    var phases = PlaySheet.cheatsheet(state);
    var nav = get('phase-nav'); clear(nav);
    var root = get('cheatsheet'); clear(root);
    phases.forEach(function (phase, index) {
      var phaseButton = button(phase.label, 'phase-button', function () { showPhase(phase.id); });
      phaseButton.id = 'phase-button-' + phase.id;
      nav.appendChild(phaseButton);
      var panel = node('section', 'phase-panel');
      panel.id = 'phase-' + phase.id;
      panel.appendChild(node('h3', '', phase.label));
      var list = node('ul', 'cheat-list');
      phase.items.forEach(function (item) { list.appendChild(cheatItem(item)); });
      panel.appendChild(list);
      panel.appendChild(node('p', 'muted phase-empty', 'Für diese Phase gibt es keine Einträge.'));
      var steps = node('div', 'phase-steps');
      if (index > 0) steps.appendChild(button('← ' + phases[index - 1].label, 'quiet', function () { showPhase(phases[index - 1].id); }));
      if (index < phases.length - 1) steps.appendChild(button(phases[index + 1].label + ' →', 'next-tab', function () { showPhase(phases[index + 1].id); }));
      panel.appendChild(steps);
      root.appendChild(panel);
    });
    showPhase(activePhase);
    applyTurnFilter();
  }

  function gameUnitCard(sheet, position) {
    var card = node('details', 'game-unit');
    var head = node('summary');
    head.appendChild(node('strong', '', position + '. ' + (sheet.unit ? sheet.unit.name : sheet.entry.unitId)));
    head.appendChild(node('span', 'game-unit-meta', ' · ' + sheet.modelCount + (sheet.modelCount === 1 ? ' Modell' : ' Modelle') + ' · ' + priceText(sheet.price) + (sheet.warlord ? ' · KRIEGSHERR' : '')));
    card.appendChild(head);
    var body = node('div', 'game-unit-body');
    var flags = PlaySheet.sheetFlags(sheet);
    if (flags.length) body.appendChild(node('p', 'entry-assignments', flags.join(' · ')));
    var loadout = node('ul', 'game-loadout');
    sheet.loadout.forEach(function (group) { loadout.appendChild(node('li', '', group.count + '× ' + group.role + ': ' + gearText(group.gear))); });
    body.appendChild(loadout);
    var profiles = PlaySheet.profileRows(sheet);
    if (profiles.length) profileTable(body, 'Profil', ['Modell'].concat(STATS), profiles);
    [['ranged', 'Fernkampfwaffen', 'BS'], ['melee', 'Nahkampfwaffen', 'WS']].forEach(function (kind) {
      var rows = PlaySheet.weaponRows(sheet, kind[0]).map(function (row) {
        return row.slice(0, 8).concat([row[8] === '-' ? [] : row[8].split(', ')]);
      });
      if (rows.length) profileTable(body, kind[1], ['Waffe', 'Anz.', 'Range', 'A', kind[2], 'S', 'AP', 'D', 'Abilities'], rows);
    });
    if (sheet.equipment.length) {
      body.appendChild(node('p', 'muted', 'Ausrüstung ohne Waffenprofil: ' + sheet.equipment.map(function (item) { return (item.count > 1 ? item.count + '× ' : '') + item.name; }).join(', ')));
    }
    if (sheet.abilities.length || sheet.enhancement) {
      body.appendChild(node('h5', '', 'Fähigkeiten (EN)'));
      var abilities = node('ul', 'game-abilities');
      abilities.lang = 'en';
      sheet.abilities.forEach(function (ability) {
        var item = node('li');
        item.appendChild(node('strong', '', ability.name + (ability.text ? ': ' : '')));
        if (ability.text) item.appendChild(document.createTextNode(ability.text));
        abilities.appendChild(item);
      });
      if (sheet.enhancement) {
        var enhancement = node('li');
        var text = PlaySheet.enhancementText(sheet.enhancement);
        enhancement.appendChild(node('strong', '', 'Verbesserung ' + sheet.enhancement.name + (text ? ': ' : '')));
        if (text) enhancement.appendChild(document.createTextNode(text));
        abilities.appendChild(enhancement);
      }
      body.appendChild(abilities);
    }
    termLine(body, 'Sonderregeln: ', sheet.specialRules, ', ', 'muted');
    termLine(body, 'Keywords: ', sheet.keywords, ', ', 'keywords', true);
    card.appendChild(body);
    return card;
  }

  function renderGameSummary(summary) {
    var root = get('game-summary'); clear(root);
    root.appendChild(node('h3', '', displayName() + ' · ' + factionName() + ' · ' + battleText()));
    root.appendChild(node('p', 'game-points', summary.total.known + ' / ' + state.budget + ' Pkt.' + (summary.total.unknown ? ' · ' + summary.total.unknown + ' Einträge mit unbekannten Kosten' : '')));
    var names = faction().detachments.filter(function (detachment) { return state.detachments.indexOf(detachment.id) !== -1; }).map(function (detachment) { return detachment.name; });
    root.appendChild(node('p', '', 'Detachments: ' + (names.length ? names.join(', ') : 'keine')));
    root.appendChild(node('p', '', warlordText()));
    var check = node('p', summary.errors.length ? 'game-errors' : 'game-ok');
    check.appendChild(document.createTextNode(summary.errors.length ? summary.errors.length + ' Fehler in der Listenprüfung' : 'Listenprüfung ohne Fehler'));
    var more = node('span', 'game-check-link', ' · ');
    var link = node('a', '', 'Details');
    link.href = '#review-step';
    more.appendChild(link);
    check.appendChild(more);
    root.appendChild(check);
  }

  function gameTerms() {
    var terms = PlaySheet.usedTerms(state);
    var card = node('details', 'game-unit game-terms');
    var head = node('summary');
    head.appendChild(node('strong', '', 'Begriffe in dieser Liste'));
    head.appendChild(node('span', 'game-unit-meta', ' · ' + terms.length + ' · Kurzreferenz Grundregeln, nicht offizieller Wortlaut'));
    card.appendChild(head);
    var body = node('div', 'game-unit-body');
    if (!terms.length) body.appendChild(node('p', 'muted', 'Keine erklärten Begriffe in dieser Liste.'));
    terms.forEach(function (entry) {
      var block = node('div', 'term-block');
      var title = node('h5'); title.appendChild(ruleTerm(entry.term)); block.appendChild(title);
      if (entry.note) englishText(block, entry.note, 'rule-note');
      entry.items.forEach(function (item) {
        var text = node('p'); text.lang = 'en';
        text.appendChild(node('strong', '', item.title + (item.change ? ' (11th-ed change)' : '') + ': '));
        text.appendChild(document.createTextNode(item.text + (item.list && item.list.length ? ' ' + item.list.join(', ') + '.' : '')));
        block.appendChild(text);
      });
      body.appendChild(block);
    });
    card.appendChild(body);
    return card;
  }

  function renderGame() {
    var summary = ListRules.rosterSummary(state);
    renderGameSummary(summary);
    renderCheatsheet();
    var units = get('game-units'); clear(units);
    if (!state.entries.length) units.appendChild(node('p', 'muted', 'Noch keine Einheiten in der Liste.'));
    state.entries.forEach(function (entry, index) { units.appendChild(gameUnitCard(PlaySheet.entrySheet(state, index, summary), index + 1)); });
    var terms = get('game-terms'); clear(terms);
    terms.appendChild(gameTerms());
  }

  function gameCards() {
    return document.querySelectorAll('#game-step details.game-unit');
  }

  function setAllUnitCards(open) {
    Array.prototype.forEach.call(gameCards(), function (card) { card.open = open; });
  }

  var printOpenState = null;

  function preparePrint() {
    var previous = Array.prototype.map.call(gameCards(), function (card) { return card.open; });
    renderGame();
    printOpenState = previous;
    setAllUnitCards(true);
  }

  function finishPrint() {
    if (!printOpenState) return;
    var cards = gameCards();
    Array.prototype.forEach.call(cards, function (card, index) { card.open = index < printOpenState.length ? printOpenState[index] : false; });
    printOpenState = null;
  }

  // ---------- Tabs ----------

  var TABS = ['list-settings', 'detachments-step', 'units-step', 'review-step', 'game-step', 'references'];
  var activeTab = TABS[0];

  function showTab(id, focusTab) {
    if (TABS.indexOf(id) === -1) id = TABS[0];
    activeTab = id;
    if (id === 'game-step' && faction()) renderGame();
    TABS.forEach(function (tabId) {
      var active = tabId === id;
      get(tabId).hidden = !active;
      var tab = get('tab-' + tabId);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    if (focusTab) get('tab-' + id).focus();
  }

  function openTab(id, focusTab) {
    showTab(id, focusTab);
    if (window.history && window.history.replaceState) window.history.replaceState(null, '', '#' + activeTab);
    if (get(activeTab).getBoundingClientRect().top < 0) get(activeTab).scrollIntoView({ block: 'start' });
  }

  var REF_PANELS = ['ref-faction', 'ref-core', 'ref-sources'];

  function showRefPanel(id, focusTab) {
    if (REF_PANELS.indexOf(id) === -1) id = REF_PANELS[0];
    REF_PANELS.forEach(function (panelId) {
      var active = panelId === id;
      get(panelId).hidden = !active;
      var tab = get(panelId.replace('ref-', 'ref-tab-'));
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    if (focusTab) get(id.replace('ref-', 'ref-tab-')).focus();
  }

  function bindRefTabs() {
    REF_PANELS.forEach(function (id, index) {
      var tab = get(id.replace('ref-', 'ref-tab-'));
      tab.addEventListener('click', function () { showRefPanel(id); });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = REF_PANELS[(index + 1) % REF_PANELS.length];
        else if (event.key === 'ArrowLeft') next = REF_PANELS[(index - 1 + REF_PANELS.length) % REF_PANELS.length];
        if (!next) return;
        event.preventDefault();
        showRefPanel(next, true);
      });
    });
  }

  function showHashTarget() {
    var target = location.hash.length > 1 ? get(decodeURIComponent(location.hash.slice(1))) : null;
    var panel = target && target.closest('[role="tabpanel"]:not(.ref-panel)');
    showTab(panel ? panel.id : TABS[0]);
    var refPanel = target && target.closest('.ref-panel');
    if (refPanel) showRefPanel(refPanel.id);
    var details = target && target.closest('details');
    if (details) details.open = true;
    if (target && target !== panel) target.scrollIntoView({ block: 'start' });
  }

  function bindTabs() {
    TABS.forEach(function (id, index) {
      var tab = get('tab-' + id);
      tab.addEventListener('click', function () { openTab(id); });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = TABS[(index + 1) % TABS.length];
        else if (event.key === 'ArrowLeft') next = TABS[(index - 1 + TABS.length) % TABS.length];
        else if (event.key === 'Home') next = TABS[0];
        else if (event.key === 'End') next = TABS[TABS.length - 1];
        if (!next) return;
        event.preventDefault();
        openTab(next, true);
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.next-tab'), function (next) {
      next.addEventListener('click', function () { openTab(next.getAttribute('data-tab'), true); });
    });
    window.addEventListener('hashchange', showHashTarget);
  }

  function renderTabStatus(summary) {
    get('tab-status-detachments').textContent = summary.dp + (summary.dpLimit !== null ? '/' + summary.dpLimit : '') + ' DP';
    get('tab-status-units').textContent = String(state.entries.length);
    var status = get('tab-status-review');
    status.textContent = summary.total.known + '/' + state.budget + ' Pkt.' + (summary.errors.length ? ' · ' + summary.errors.length + ' Fehler' : ' · OK');
    status.className = 'tab-status' + (summary.errors.length ? ' has-errors' : ' is-ok');
  }

  // ---------- Farbschema ----------

  var THEMES = [
    { id: 'argent-shroud', name: 'Order of the Argent Shroud' },
    { id: 'martyred-lady', name: 'Order of Our Martyred Lady' },
    { id: 'bloody-rose', name: 'Order of the Bloody Rose' },
    { id: 'sacred-rose', name: 'Order of the Sacred Rose' },
    { id: 'valorous-heart', name: 'Order of the Valorous Heart' },
    { id: 'ebon-chalice', name: 'Order of the Ebon Chalice' }
  ];

  function findTheme(id) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i];
    return THEMES[0];
  }

  function applyTheme(id) {
    var theme = findTheme(id);
    document.documentElement.setAttribute('data-theme', theme.id);
    get('theme').value = theme.id;
    return theme.id;
  }

  function bindTheme() {
    var select = get('theme');
    THEMES.forEach(function (theme) { addOption(select, theme.id, theme.name.replace('Order of ', '')); });
    applyTheme(document.documentElement.getAttribute('data-theme'));
    select.addEventListener('change', function () {
      var id = applyTheme(select.value);
      try { localStorage.setItem(THEME_KEY, id); } catch (error) { return; }
    });
  }

  // ---------- Start ----------

  var ALLIANCES = ['Imperium', 'Chaos', 'Xenos'];

  function renderFactionPicker() {
    var select = get('faction');
    clear(select);
    ALLIANCES.forEach(function (alliance) {
      var group = node('optgroup');
      group.label = alliance;
      ListRules.factionIndex().forEach(function (info) {
        if (info.alliance !== alliance) return;
        var option = node('option', '', info.name + (info.parentId ? ' (' + (ListRules.factionInfo(info.parentId) || {}).name + ')' : ''));
        option.value = info.id;
        group.appendChild(option);
      });
      if (group.children.length) select.appendChild(group);
    });
    select.value = state.factionId;
  }

  function renderFactionHeader() {
    var info = factionInfo();
    var data = faction();
    get('faction-eyebrow').textContent = (info ? info.alliance : '').toUpperCase() + ' / ' + factionName().toUpperCase();
    get('ref-tab-faction').firstChild.textContent = factionName() + ' ';
    get('faction-reference-intro').textContent = 'Regeln, die nur für die Fraktion ' + factionName() + ' gelten. Detachments mit Regeln, Verbesserungen und Stratagems findest du in Schritt 2.';
    var legends = data.units.filter(function (unit) { return unit.legends; }).length;
    get('legends-toggle').hidden = !legends;
    if (!legends) { showLegends = false; get('legends').checked = false; }
    get('faction-coverage').textContent = factionName() + ': ' + data.units.length + ' Datenblätter, ' + data.detachments.length + ' Detachments.';
    get('text-coverage').textContent = hasTexts()
      ? 'Für ' + factionName() + ' sind englische Regeltexte aus der bisherigen Abschrift hinterlegt.'
      : 'Für ' + factionName() + ' sind keine Regeltexte hinterlegt; Fähigkeiten, Detachment-Regeln und Stratagems erscheinen nur mit Namen.';
    document.title = factionName() + ' | Armeewerkstatt';
  }

  function renderSources() {
    var lib = FACTION_LIBRARY.dataset;
    get('dataset-label').textContent = lib.name + ' v' + lib.version + ' · ' + lib.edition + ' Edition · Stand ' + lib.effectiveDate + ' (' + lib.label + ')';
    get('faction-count').textContent = String(ListRules.factionIndex().length);
  }

  function renderSettings() {
    get('faction').value = state.factionId;
    get('list-name').value = state.name;
    get('battle-size').value = state.battleSize || 'custom';
    get('budget').value = state.budget;
    get('budget').readOnly = state.battleSize !== null;
  }

  function renderAll() {
    renderFactionHeader();
    renderSettings();
    renderNotices();
    renderRoster();
    renderDetachments();
    renderPricing();
    renderArmyRule();
    if (activeTab === 'game-step') renderGame();
  }

  function bindControls() {
    get('faction').addEventListener('change', function () { changeFaction(get('faction').value); });
    get('list-name').addEventListener('input', function () { state.name = get('list-name').value; renderSummary(); save(); });
    get('battle-size').addEventListener('change', function () {
      state.battleSize = get('battle-size').value === 'custom' ? null : get('battle-size').value;
      if (state.battleSize) state.budget = ListRules.battleSizes[state.battleSize].points;
      renderSettings(); renderRoster(); save();
    });
    get('budget').addEventListener('change', function () {
      if (state.battleSize !== null) { renderSettings(); return; }
      var value = Number(get('budget').value);
      if (!validInteger(value, 1, 100000)) { get('budget').value = state.budget; return; }
      state.budget = value; renderSummary(); save();
    });
    get('warlord').addEventListener('change', function () { state.warlordId = get('warlord').value || null; renderRoster(); save(); });
    get('search').addEventListener('input', function () { search = get('search').value.toLowerCase().trim(); renderCatalogue(); });
    get('role-filter').addEventListener('change', function () { roleFilter = get('role-filter').value; renderCatalogue(); });
    get('legends').addEventListener('change', function () { showLegends = get('legends').checked; renderCatalogue(); });
    get('export').addEventListener('click', exportList);
    get('game-export').addEventListener('click', exportList);
    window.addEventListener('beforeprint', preparePrint);
    window.addEventListener('afterprint', finishPrint);
    function printList() { document.title = displayName() + ' — ' + factionName(); window.print(); }
    get('print').addEventListener('click', printList);
    get('game-print').addEventListener('click', printList);
    get('turn-filter').addEventListener('change', function () { turnFilter = get('turn-filter').value; applyTurnFilter(); });
    get('game-expand').addEventListener('click', function () { setAllUnitCards(true); });
    get('game-collapse').addEventListener('click', function () { setAllUnitCards(false); });
    get('new-list').addEventListener('click', function () {
      if (!window.confirm('Gespeicherte Liste durch einen leeren Entwurf ersetzen? Zur Sicherung vorher exportieren.')) return;
      clear(get('roster'));
      activeEntryId = null; openModels = {}; notices = [];
      state = ListRules.fresh(state.factionId); storageAvailable = true; storageIssue = '';
      search = ''; roleFilter = 'all'; showLegends = false;
      get('search').value = ''; get('role-filter').value = 'all'; get('legends').checked = false;
      renderAll(); save();
    });
  }

  function boot() {
    var stored = null;
    var target = DEFAULT_FACTION;
    var status = 'Neuer Entwurf · Änderungen werden in diesem Browser gespeichert';
    try {
      stored = readStored();
    } catch (error) {
      storageAvailable = false;
      storageIssue = 'Gespeicherte Liste ungültig oder nicht lesbar; Original bleibt unverändert. „Neue Liste“ ersetzt den Speicher.';
    }
    if (stored) {
      target = ListRules.storedFaction(stored.value);
      if (!target || !ListRules.factionInfo(target)) {
        storageAvailable = false;
        storageIssue = 'Gespeicherte Liste gehört zu einer unbekannten Fraktion; Original bleibt unverändert. „Neue Liste“ ersetzt den Speicher.';
        stored = null;
        target = DEFAULT_FACTION;
      }
    }
    state = ListRules.fresh(target);
    renderFactionPicker();
    setLoading(true, 'Lade Fraktionsdaten …');
    loadFaction(target, function (ok) {
      setLoading(false);
      if (!ok) {
        get('save-status').textContent = 'Fraktionsdaten konnten nicht geladen werden (' + target + ').';
        return;
      }
      if (stored) {
        var normalized = ListRules.normalizeStored(stored.value);
        if (normalized) {
          state = normalized.state;
          notices = normalized.notices;
          status = stored.legacy ? 'Liste aus der Vorversion übernommen; die nächste Änderung speichert im neuen Format.' : 'Gespeicherte Liste wiederhergestellt';
        } else {
          storageAvailable = false;
          storageIssue = 'Gespeicherte Liste ungültig oder nicht lesbar; Original bleibt unverändert. „Neue Liste“ ersetzt den Speicher.';
        }
      }
      renderAll();
      get('save-status').textContent = storageAvailable ? status : storageIssue;
      showHashTarget();
    });
  }

  renderRoleFilter();
  renderSources();
  bindControls();
  bindTheme();
  bindTabs();
  bindRuleDialog();
  bindRefTabs();
  renderCoreRules();
  renderOfficialRules();
  boot();
}());
