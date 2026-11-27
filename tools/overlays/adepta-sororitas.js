var FACTION_DATA = {
  source: {
    title: 'Adepta Sororitas Faction Pack',
    version: '1.4',
    effectiveDate: '2026-10-14',
    editionVerified: false
  },
  pointsSource: {
    version: '1.6',
    url: 'https://mfm.warhammer-community.com/en/adepta-sororitas',
    effectiveDate: null,
    verification: 'user-supplied transcription'
  },
  armyRule: {
    name: 'Acts of Faith',
    text: 'If your Army Faction is Adepta Sororitas, each unit from your army with this ability can perform one Act of Faith per phase. This is done using Miracle dice.',
    sections: [
      {
        title: 'Gaining Miracle Dice',
        intro: 'If your Army Faction is Adepta Sororitas, you gain 1 Miracle die:',
        items: [
          'At the start of each turn.',
          'Each time an Adepta Sororitas unit from your army is destroyed.'
        ],
        after: 'Each time you gain a Miracle die, roll one D6. The number you roll is the value of that Miracle die. This value cannot be changed or re-rolled, unless a rule specifically states otherwise. Keep your Miracle dice to one side - this is your Miracle dice pool.'
      },
      {
        title: 'Performing an Act of Faith',
        intro: 'Before making a dice roll for a model or unit from your army with the Acts of Faith ability, if you have one or more dice in your Miracle dice pool, that unit can perform an Act of Faith. If it does, select one of the dice from your Miracle dice pool to substitute that dice roll (if a roll involves more than one dice, e.g. a Charge roll or Battle-shock test, only a single dice can be substituted). The dice that is being substituted is not rolled; instead, the value of the selected Miracle die is used as if it had been rolled (this counts as an unmodified dice roll of that value for all rules purposes). Each Miracle die can only be selected for substitution once. Once all Miracle dice substitutions have been made, remove the chosen Miracle dice from your Miracle dice pool, and roll all remaining, unsubstituted dice that are part of the dice roll. You can use Miracle dice when a unit performs an Act of Faith for any of the following types of dice roll:',
        items: ['Advance roll', 'Battle-shock test', 'Charge roll', 'Damage roll', 'Hit roll', 'Saving throw', 'Wound roll'],
        after: 'Example: Instead of rolling 2D6 to take a Battle-shock test for a unit, you could use one dice from your Miracle dice pool. If the value of that dice was 4, the unit\'s Battle-shock test would be determined by rolling one D6 and adding 4 to it (i.e. it would be D6+4).'
      }
    ]
  },
  pricing: [
    {
      id: 'aestred-thurga-and-agathae-dolan',
      name: 'Aestred Thurga and Agathae Dolan',
      tiers: [{ from: 1, costs: { '2': 80 } }],
      wargear: [],
      attachment: { role: 'Leader', targets: ['battle-sisters-squad', 'celestian-insidiants', 'celestian-sacresants', 'dominion-squad', 'retributor-squad', 'sisters-novitiate-squad', 'crusaders'] }
    },
    {
      id: 'arco-flagellants',
      name: 'Arco-flagellants',
      tiers: [{ from: 1, costs: { '3': 50, '10': 140 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'battle-sisters-squad',
      name: 'Battle Sisters Squad',
      tiers: [{ from: 1, costs: { '10': 100 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'canoness',
      name: 'Canoness',
      tiers: [{ from: 1, costs: { '1': 60 } }],
      wargear: [],
      attachment: { role: 'Leader', targets: ['battle-sisters-squad', 'celestian-insidiants', 'celestian-sacresants', 'dominion-squad', 'retributor-squad', 'sisters-novitiate-squad', 'crusaders'] }
    },
    {
      id: 'canoness-with-jump-pack',
      name: 'Canoness with Jump Pack',
      tiers: [{ from: 1, costs: { '1': 75 } }],
      wargear: [],
      attachment: { role: 'Leader', targets: ['seraphim-squad', 'zephyrim-squad'] }
    },
    {
      id: 'castigator',
      name: 'Castigator',
      tiers: [{ from: 1, costs: { '1': 165 } }, { from: 3, costs: { '1': 185 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'celestian-insidiants',
      name: 'Celestian Insidiants',
      tiers: [{ from: 1, costs: { '10': 115 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'celestian-sacresants',
      name: 'Celestian Sacresants',
      tiers: [{ from: 1, costs: { '5': 75, '10': 150 } }, { from: 3, costs: { '5': 85, '10': 160 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'daemonifuge',
      name: 'Daemonifuge',
      tiers: [{ from: 1, costs: { '2': 85 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'dialogus',
      name: 'Dialogus',
      tiers: [{ from: 1, costs: { '1': 40 } }],
      wargear: [],
      attachment: { role: 'Support', targets: ['battle-sisters-squad', 'celestian-insidiants', 'celestian-sacresants', 'dominion-squad', 'retributor-squad', 'sisters-novitiate-squad', 'crusaders'] }
    },
    {
      id: 'dogmata',
      name: 'Dogmata',
      tiers: [{ from: 1, costs: { '1': 45 } }],
      wargear: [],
      attachment: { role: 'Support', targets: ['battle-sisters-squad', 'celestian-insidiants', 'celestian-sacresants', 'dominion-squad', 'retributor-squad', 'crusaders'] }
    },
    {
      id: 'dominion-squad',
      name: 'Dominion Squad',
      tiers: [{ from: 1, costs: { '10': 90 } }, { from: 3, costs: { '10': 100 } }],
      wargear: [{ name: 'Meltagun', points: 5 }],
      attachment: null
    },
    {
      id: 'exorcist',
      name: 'Exorcist',
      tiers: [{ from: 1, costs: { '1': 175 } }, { from: 3, costs: { '1': 215 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'hospitaller',
      name: 'Hospitaller',
      tiers: [{ from: 1, costs: { '1': 65 } }, { from: 2, costs: { '1': 75 } }],
      wargear: [],
      attachment: { role: 'Support', targets: ['battle-sisters-squad', 'celestian-insidiants', 'celestian-sacresants', 'dominion-squad', 'retributor-squad', 'sisters-novitiate-squad', 'crusaders'] }
    },
    {
      id: 'imagifier',
      name: 'Imagifier',
      tiers: [{ from: 1, costs: { '1': 55 } }],
      wargear: [],
      attachment: { role: 'Support', targets: ['battle-sisters-squad', 'celestian-insidiants', 'celestian-sacresants', 'dominion-squad', 'retributor-squad', 'crusaders'] }
    },
    {
      id: 'immolator',
      name: 'Immolator',
      tiers: [{ from: 1, costs: { '1': 100 } }, { from: 4, costs: { '1': 115 } }],
      wargear: [{ name: 'Twin Multi-melta', points: 15 }],
      attachment: null
    },
    {
      id: 'intranzia-fraye',
      name: 'Intranzia Fraye',
      tiers: [{ from: 1, costs: { '1': 135 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'junith-eruita',
      name: 'Junith Eruita',
      tiers: [{ from: 1, costs: { '1': 105 } }],
      wargear: [],
      attachment: { role: 'Leader', targets: ['battle-sisters-squad', 'celestian-insidiants', 'celestian-sacresants', 'dominion-squad', 'retributor-squad', 'sisters-novitiate-squad', 'crusaders'] }
    },
    {
      id: 'ministorum-priest',
      name: 'Ministorum Priest',
      tiers: [{ from: 1, costs: { '1': 50 } }],
      wargear: [],
      attachment: { role: 'Leader', targets: ['arco-flagellants', 'battle-sisters-squad', 'celestian-insidiants', 'dominion-squad', 'sanctifiers', 'sisters-novitiate-squad', 'crusaders'] }
    },
    {
      id: 'mortifiers',
      name: 'Mortifiers',
      tiers: [{ from: 1, costs: { '1': 70, '2': 130 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'morvenn-vahl',
      name: 'Morvenn Vahl',
      tiers: [{ from: 1, costs: { '1': 215 } }],
      wargear: [],
      attachment: { role: 'Leader', targets: ['paragon-warsuits'] }
    },
    {
      id: 'palatine',
      name: 'Palatine',
      tiers: [{ from: 1, costs: { '1': 50 } }],
      wargear: [],
      attachment: { role: 'Leader', targets: ['battle-sisters-squad', 'celestian-insidiants', 'celestian-sacresants', 'dominion-squad', 'retributor-squad', 'sisters-novitiate-squad', 'crusaders'] }
    },
    {
      id: 'paragon-warsuits',
      name: 'Paragon Warsuits',
      tiers: [{ from: 1, costs: { '3': 165 } }, { from: 3, costs: { '3': 175 } }],
      wargear: [{ name: 'Multi-melta', points: 10 }],
      attachment: null
    },
    {
      id: 'penitent-engines',
      name: 'Penitent Engines',
      tiers: [{ from: 1, costs: { '1': 70, '2': 140 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'repentia-squad',
      name: 'Repentia Squad',
      tiers: [{ from: 1, costs: { '5': 70, '10': 140 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'retributor-squad',
      name: 'Retributor Squad',
      tiers: [{ from: 1, costs: { '5': 105 } }, { from: 3, costs: { '5': 115 } }],
      wargear: [{ name: 'Multi-melta', points: 5 }],
      attachment: null
    },
    {
      id: 'saint-celestine',
      name: 'Saint Celestine',
      tiers: [{ from: 1, costs: { '3': 135 } }],
      wargear: [],
      attachment: { role: 'Leader', targets: ['seraphim-squad', 'zephyrim-squad'] }
    },
    {
      id: 'sanctifiers',
      name: 'Sanctifiers',
      tiers: [{ from: 1, costs: { '9': 110 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'seraphim-squad',
      name: 'Seraphim Squad',
      tiers: [{ from: 1, costs: { '5': 75, '10': 150 } }, { from: 3, costs: { '5': 85, '10': 160 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'sisters-novitiate-squad',
      name: 'Sisters Novitiate Squad',
      tiers: [{ from: 1, costs: { '10': 90 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'sororitas-rhino',
      name: 'Sororitas Rhino',
      tiers: [{ from: 1, costs: { '1': 65 } }, { from: 4, costs: { '1': 75 } }],
      wargear: [],
      attachment: null
    },
    {
      id: 'triumph-of-saint-katherine',
      name: 'Triumph of Saint Katherine',
      tiers: [{ from: 1, costs: { '1': 245 } }],
      wargear: [],
      attachment: { role: 'Leader', targets: ['battle-sisters-squad', 'crusaders'] }
    },
    {
      id: 'zephyrim-squad',
      name: 'Zephyrim Squad',
      tiers: [{ from: 1, costs: { '5': 75, '10': 150 } }, { from: 3, costs: { '5': 85, '10': 160 } }],
      wargear: [],
      attachment: null
    }
  ],
  units: [
    {
      id: 'aestred-thurga-and-agathae-dolan',
      name: 'Aestred Thurga and Agathae Dolan',
      models: 2,
      minModels: 2,
      maxModels: 2,
      legends: false,
      epicHero: true,
      keywords: ['Adepta Sororitas', 'Aestred Thurga', 'Agathae Dolan', 'Character', 'Epic Hero', 'Grenades', 'Imperium', 'Infantry'],
      summary: 'Leader; Devastating Wounds while leading with Aestred Thurga, and Miracle dice while leading with Agathae Dolan.',
      loadouts: [
        { role: 'Aestred Thurga', gear: ['Blade of Vigil', 'Bolt pistol'] },
        { role: 'Agathae Dolan', gear: ['Bolt pistol', 'Scribe\'s staff'] }
      ],
      profiles: [
        { model: 'Aestred Thurga', stats: { M: '6', T: '3', SV: '2+', W: '4', LD: '6+', OC: '1', INV: '4+' }, base: '32mm', notes: '' },
        { model: 'Agathae Dolan', stats: { M: '6', T: '3', SV: '6+', W: '3', LD: '7+', OC: '1', INV: '4+' }, base: '25mm', notes: '' }
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Blade of Vigil', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '2+', s: '5', ap: '-2', d: '2', abilities: [] }] },
        { name: 'Scribe\'s staff', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '4', ap: '0', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Leader', text: 'This unit can lead a Battle Sisters Squad, Celestian Insidiants, Celestian Sacresants, Dominion Squad, Retributor Squad, Sisters Novitiate Squad or Crusaders.' },
        { name: 'Auto-Tapestry of the Emperor\'s Judgement', timing: ['shooting', 'fight'], text: 'While this unit is leading a unit and contains Aestred Thurga, weapons equipped by models in that unit have Devastating Wounds.' },
        { name: 'Recount the Deeds of the Saints', text: 'While this unit is leading a unit and contains Agathae Dolan, each time that unit destroys an enemy unit, you gain 1 Miracle die. When Agathae Dolan is destroyed, you gain D3 Miracle dice.' }
      ],
      specialRules: ['Acts of Faith', 'Leader'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Both models are Epic Heroes and carry a bolt pistol. Agathae Dolan\'s complete profile and equipment follow the latest supplied transcription, which states a 2026-06-17 source date. Army points remain sourced separately from MFM v1.6.'
    },
    {
      id: 'arco-flagellants',
      name: 'Arco-flagellants',
      models: 3,
      minModels: 3,
      maxModels: 10,
      repeatLoadoutIndex: 0,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Infantry', 'Imperium', 'Penitent', 'Arco-flagellants'],
      summary: 'Feel No Pain 5+. Extremis Trigger Word can give Arco-flails 6 attacks and Hazardous for the Fight phase.',
      loadouts: [
        { role: 'Arco-Flagellant', gear: ['Arco-flails'] },
        { role: 'Arco-Flagellant', gear: ['Arco-flails'] },
        { role: 'Arco-Flagellant', gear: ['Arco-flails'] }
      ],
      profiles: [
        { model: 'Arco-Flagellant', stats: { M: '7', T: '3', SV: '7+', W: '2', LD: '8+', OC: '1', INV: '6+' }, base: '25mm', notes: '' }
      ],
      weapons: [
        { name: 'Arco-flails', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '4+', s: '5', ap: '0', d: '1', abilities: ['Sustained Hits 1'] }] }
      ],
      abilities: [
        { name: 'Extremis Trigger Word', text: 'When this unit is selected to fight, you can invoke its extremis trigger word. Until the end of the phase, Arco-flails equipped by models in this unit have an Attacks characteristic of 6 and Hazardous.' }
      ],
      specialRules: ['Acts of Faith', 'Feel No Pain 5+'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: null },
      profileNotes: ''
    },
    {
      id: 'intranzia-fraye',
      name: 'Intranzia Fraye',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: true,
      keywords: ['Imperium', 'Adepta Sororitas', 'Epic Hero', 'Vehicle', 'Walker', 'Character', 'Penitent'],
      summary: 'Judged for Execution: at the end of your Movement phase, select one visible enemy unit within 18 inches; attacks made by friendly Adepta Sororitas models against it have Lethal Hits until the start of your next Command phase.',
      loadouts: [
        {
          role: 'Intranzia Fraye',
          gear: ['Heavy bolter', 'Heavy bolter', 'Ministorum heavy flamer', 'Ministorum heavy flamer', 'Melta missile array', 'Mace of Saint Praxedes', 'Throne of Blame']
        }
      ],
      profiles: [
        { model: 'Intranzia Fraye', stats: { M: '8', T: '7', SV: '3+', W: '8', LD: '6+', OC: '3', INV: '4+' }, base: '50mm', notes: '' }
      ],
      weapons: [
        { name: 'Heavy bolter', type: 'ranged', profiles: [{ name: 'standard', range: '36', a: '3', skill: '2+', s: '5', ap: '-1', d: '2', abilities: ['Sustained Hits 1'] }] },
        { name: 'Melta missile array', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '2', skill: '2+', s: '9', ap: '-2', d: 'D3', abilities: ['Melta 2'] }] },
        { name: 'Ministorum heavy flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '6', ap: '-1', d: '1', abilities: ['Ignores Cover', 'Torrent'] }] },
        { name: 'Mace of Saint Praxedes', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '2+', s: '6', ap: '-2', d: '2', abilities: ['Sustained Hits 1'] }] },
        { name: 'Throne of Blame', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '4+', s: '6', ap: '0', d: '1', abilities: ['Extra Attacks'] }] }
      ],
      abilities: [
        { name: 'Righteous Denunciation', text: 'At the start of the Fight phase, each enemy unit within 6 inches of this model must take a Battle-shock test, subtracting 1 from the result.' },
        { name: 'Judged for Execution', text: 'At the end of your Movement phase, you can select one enemy unit within 18 inches of and visible to this model. Until the start of your next Command phase, each time a friendly Adepta Sororitas model makes an attack that targets that enemy unit, that attack has Lethal Hits.' }
      ],
      specialRules: ['Deadly Demise 1', 'Feel No Pain 5+', 'Acts of Faith'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and abilities follow the supplied transcription. Existing default equipment is preserved. Judged for Execution grants Lethal Hits only to attacks made by friendly Adepta Sororitas models, per the supplied 2026-06-17 datasheet. Points conflict: supplied source 150 versus MFM v1.6 at 135. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'sanctifiers',
      name: 'Sanctifiers',
      models: 9,
      minModels: 9,
      maxModels: 9,
      legends: false,
      epicHero: false,
      keywords: ['Imperium', 'Adepta Sororitas', 'Infantry', 'Grenades'],
      summary: 'Scouts 6 inches. Once per battle, the cherub grants a Miracle die after this unit performs an Act of Faith.',
      loadouts: [
        { role: 'Miraculist', gear: ['Holy fire', 'Burning hands'] },
        { role: 'Salvationist', gear: ['Close combat weapon', 'Salvationist medikit'] },
        { role: 'Death Cult Assassin', gear: ['Death Cult blades'] },
        { role: 'Missionary', gear: ['Plasma gun', 'Sanctifier melee weapon'] },
        { role: 'Missionary', gear: ['Ministorum flamer', 'Sanctifier melee weapon'] },
        { role: 'Sanctifier', gear: ['Ministorum hand flamer', 'Sanctifier melee weapon'] },
        { role: 'Sanctifier', gear: ['Ministorum hand flamer', 'Sanctifier melee weapon'] },
        { role: 'Sanctifier', gear: ['Ministorum hand flamer', 'Sanctifier melee weapon'] },
        { role: 'Sanctifier', gear: ['Ministorum hand flamer', 'Sanctifier melee weapon'] }
      ],
      profiles: [
        { model: 'Sanctifier', stats: { M: '6', T: '3', SV: '6+', W: '1', LD: '7+', OC: '1', INV: '5+' }, base: '25mm', notes: 'Common unit profile.' }
      ],
      weapons: [
        { name: 'Holy fire', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '6', ap: '-1', d: '2', abilities: ['Ignores Cover', 'One Shot', 'Torrent'] }] },
        { name: 'Meltagun', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '4+', s: '9', ap: '-4', d: 'D6', abilities: ['Melta 2'] }] },
        { name: 'Ministorum flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '5', ap: '0', d: '1', abilities: ['Ignores Cover', 'Torrent'] }] },
        { name: 'Ministorum hand flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '4', ap: '0', d: '1', abilities: ['Ignores Cover', 'Pistol', 'Torrent'] }] },
        { name: 'Plasma gun', type: 'ranged', profiles: [
          { name: 'standard', range: '24', a: '1', skill: '4+', s: '7', ap: '-2', d: '1', abilities: ['Rapid Fire 1'] },
          { name: 'supercharge', range: '24', a: '1', skill: '4+', s: '8', ap: '-3', d: '2', abilities: ['Hazardous', 'Rapid Fire 1'] }
        ] },
        { name: 'Burning hands', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '1', skill: '2+', s: '6', ap: '-2', d: '3', abilities: ['Devastating Wounds'] }] },
        { name: 'Close combat weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '2', skill: '3+', s: '3', ap: '0', d: '1', abilities: [] }] },
        { name: 'Death Cult blades', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '2+', s: '4', ap: '-2', d: '1', abilities: ['Precision'] }] },
        { name: 'Sanctifier melee weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '3+', s: '3', ap: '0', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Ministorum Sermon', text: 'While this unit contains a Ministorum Priest, melee weapons equipped by models in this unit have Sustained Hits 1.' },
        { name: 'Cherub', text: 'Once per battle, after this unit performs an Act of Faith, you gain 1 Miracle die.' },
        { name: 'Attached Unit', text: 'A Ministorum Priest that can be attached to a Battle Sisters Squad can be attached to this unit instead. When attached during the Declare Battle Formations step, that Priest gains Scouts 6 inches.' },
        { name: 'Salvationist medikit', text: 'In your Command phase, if the bearer is on the battlefield, return up to D3 destroyed non-Character models to its unit.' },
        { name: 'Simulacrum Imperialis', text: 'At the end of your Command phase, for each objective marker you control that has a unit with this ability within range, roll one D6. On a 4+, you gain a Miracle die with a value equal to that result.' }
      ],
      specialRules: ['Scouts 6 inches', 'Acts of Faith'],
      wargearRules: [
        '1 Missionary can replace its Plasma gun with 1 Meltagun.',
        '1 Missionary equipped with a Plasma gun can also be equipped with 1 Holy fire; that model\'s Plasma gun cannot be replaced.',
        '1 Sanctifier can replace its Sanctifier melee weapon with 1 Ministorum hand flamer and 1 Close combat weapon.',
        '1 Sanctifier can replace its Sanctifier melee weapon with 1 Close combat weapon and 1 Simulacrum Imperialis.'
      ],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles, abilities and wargear options follow the supplied 2026-06-17 transcription. The nine-model composition, defaults and option limits match the supplied wargear options. The medikit and Simulacrum Imperialis abilities require their corresponding equipment. Army points remain sourced separately from MFM v1.6 and are unchanged.'
    },
    {
      id: 'celestian-insidiants',
      name: 'Celestian Insidiants',
      models: 10,
      minModels: 10,
      maxModels: 10,
      legends: false,
      epicHero: false,
      keywords: ['Imperium', 'Adepta Sororitas', 'Infantry', 'Grenades', 'Celestian', 'Celestian Insidiants'],
      summary: 'Attacks against their quarry re-roll Hit rolls and have Precision. Feel No Pain 4+ against Psychic attacks and mortal wounds.',
      loadouts: [
        { role: 'Celestian Insidiant Superior', gear: ['Condemnor bolt pistol', 'Null mace'] },
        { role: 'Celestian Insidiant', gear: ['Condemnor bolt pistol', 'Null mace'] },
        { role: 'Celestian Insidiant', gear: ['Condemnor bolt pistol', 'Null mace'] },
        { role: 'Celestian Insidiant', gear: ['Condemnor bolt pistol', 'Null mace'] },
        { role: 'Celestian Insidiant', gear: ['Condemnor bolt pistol', 'Null mace'] },
        { role: 'Celestian Insidiant', gear: ['Condemnor bolt pistol', 'Null mace'] },
        { role: 'Celestian Insidiant', gear: ['Condemnor bolt pistol', 'Null mace'] },
        { role: 'Celestian Insidiant', gear: ['Condemnor bolt pistol', 'Null mace'] },
        { role: 'Celestian Insidiant', gear: ['Condemnor bolt pistol', 'Null mace'] },
        { role: 'Celestian Insidiant', gear: ['Condemnor bolt pistol', 'Null mace'] }
      ],
      profiles: [
        { model: 'Celestian Insidiant', stats: { M: '6', T: '3', SV: '3+', W: '1', LD: '7+', OC: '1', INV: '5+' }, base: '32mm', notes: 'Common unit profile.' }
      ],
      weapons: [
        { name: 'Condemnor bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Anti-Psyker 4+', 'Devastating Wounds', 'Pistol'] }] },
        { name: 'Inferno pistol', type: 'ranged', profiles: [{ name: 'standard', range: '6', a: '1', skill: '3+', s: '8', ap: '-4', d: 'D3', abilities: ['Melta 2', 'Pistol'] }] },
        { name: 'Ministorum hand flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '4', ap: '0', d: '1', abilities: ['Ignores Cover', 'Pistol', 'Torrent'] }] },
        { name: 'Blessed sword', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '3+', s: '4', ap: '-2', d: '2', abilities: ['Lethal Hits'] }] },
        { name: 'Null mace', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '3+', s: '4', ap: '-1', d: '1', abilities: ['Anti-Psyker 4+', 'Devastating Wounds'] }] },
        { name: 'Virge of admonition', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '6', ap: '-2', d: '3', abilities: ['Anti-Psyker 4+', 'Devastating Wounds'] }] }
      ],
      abilities: [
        { name: 'Rituale Nullificatus', text: 'Models in this unit have Feel No Pain 4+ against Psychic attacks and mortal wounds.' },
        { name: 'Virtue of Intolerance', timing: ['prebattle', 'shooting', 'fight'], text: 'At the start of the battle, select one enemy unit to be this unit\'s quarry. Each time a model in this unit makes an attack against its quarry, you can re-roll the Hit roll and that attack has Precision. This ability can be used even while this unit is embarked within a Transport.' },
        { name: 'Attached Unit', text: 'If a Character unit can be attached to a Dominion Squad, it can be attached to this unit instead.' },
        { name: 'Simulacrum Imperialis', text: 'At the end of your Command phase, for each objective marker you control that has a unit with this ability within range, roll one D6. On a 4+, you gain a Miracle die with a value equal to that result.' },
        { name: 'Denuncia Oratory', text: 'When the bearer\'s unit\'s quarry is destroyed, you can select a new unit from your opponent\'s army to be its quarry.' }
      ],
      specialRules: ['Acts of Faith'],
      wargearRules: [
        'The Celestian Insidiant Superior can replace her Condemnor bolt pistol with 1 Inferno pistol.',
        'Up to 2 Celestian Insidiants can each replace their Condemnor bolt pistol with 1 Ministorum hand flamer.',
        'Up to 2 Celestian Insidiants can each replace their Condemnor bolt pistol and Null mace with 1 Blessed sword.',
        '1 Celestian Insidiant can replace her Condemnor bolt pistol and Null mace with 1 Virge of admonition.',
        '1 Celestian Insidiant can replace her Condemnor bolt pistol with 1 Denuncia oratory.',
        '1 Celestian Insidiant equipped with a Condemnor bolt pistol can also be equipped with 1 Simulacrum Imperialis; that model\'s Condemnor bolt pistol cannot be replaced.'
      ],
      datasheetSource: { label: 'User-supplied Dakkapedia transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles, abilities and wargear options follow the current user-supplied 2026-06-17 transcription; the selectable options and shared limits match it. Retain Celestian under the explicit faction v1.4 override. Simulacrum Imperialis and Denuncia Oratory require their corresponding equipment. Points conflict: supplied source 120 versus MFM v1.6 at 115; v1.6 pricing takes priority and remains unchanged.'
    },
    {
      id: 'aveline',
      name: 'Celestian Sacresant Aveline',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: true,
      epicHero: true,
      keywords: ['Adepta Sororitas', 'Celestian Sacresant Aveline', 'Character', 'Epic Hero', 'Grenades', 'Imperium', 'Infantry'],
      summary: 'Legends Epic Hero with Feel No Pain 6+ and Lone Operative; once per battle boosts her melee attacks, and re-rolls Hit and Wound rolls against Daemons.',
      loadouts: [
        { role: 'Celestian Sacresant Aveline', gear: ['Ministorum hand flamer', 'The Thorn of the White Rose'] }
      ],
      profiles: [
        { model: 'Celestian Sacresant Aveline', stats: { M: '6', T: '3', SV: '3+', W: '4', LD: '7+', OC: '1', INV: '4+' }, base: '50mm', notes: '' }
      ],
      weapons: [
        { name: 'Ministorum hand flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '4', ap: '0', d: '1', abilities: ['Ignores Cover', 'Pistol', 'Torrent'] }] },
        { name: 'The Thorn of the White Rose', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '3+', s: '5', ap: '-2', d: '2', abilities: [] }] }
      ],
      abilities: [
        { name: 'Instrument of the Emperor\'s Wrath', text: 'Once per battle, at the start of the Fight phase, this model can use this ability. Until the end of the phase, add 3 to the Attacks characteristic of melee weapons equipped by this model, and those weapons have Devastating Wounds.' },
        { name: 'Daemonbreaker', text: 'Each time this model makes an attack that targets a Daemon unit, you can re-roll the Hit roll and you can re-roll the Wound roll.' }
      ],
      specialRules: ['Feel No Pain 6+', 'Lone Operative', 'Acts of Faith'],
      wargearRules: [],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Legends datasheet. Profiles and abilities follow the supplied 2026-06-17 transcription; the unit has no wargear options. The supplied source lists 45 points, but Legends units are not part of the MFM v1.6 transcription, so points remain manual and unverified.'
    },
    {
      id: 'repressor',
      name: 'Repressor',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: true,
      epicHero: false,
      keywords: ['Imperium', 'Adepta Sororitas', 'Vehicle', 'Transport', 'Dedicated Transport', 'Frame', 'Smoke'],
      summary: 'Legends transport with capacity for 12 Adepta Sororitas Infantry models; excludes Jump Pack models and the Triumph of Saint Katherine.',
      transportCapacity: { models: 12, keywords: ['Adepta Sororitas', 'Infantry'], excludedKeywords: ['Jump Pack'], excludedUnitIds: ['triumph-of-saint-katherine'] },
      loadouts: [
        { role: 'Repressor', gear: ['Repressor twin heavy flamer', 'Storm bolter', 'Dozer ram'] }
      ]
    },
    {
      id: 'battle-sanctum',
      name: 'Battle Sanctum',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: true,
      epicHero: false,
      keywords: ['Imperium', 'Adepta Sororitas', 'Fortification', 'Towering', 'Frame'],
      summary: 'Legends fortification with no weapons.',
      loadouts: [
        { role: 'Battle Sanctum', gear: [] }
      ]
    },
    {
      id: 'crusaders',
      name: 'Crusaders',
      models: 2,
      minModels: 2,
      maxModels: 4,
      repeatLoadoutIndex: 0,
      legends: true,
      epicHero: false,
      keywords: ['Imperium', 'Adepta Sororitas', 'Infantry'],
      summary: 'Legends unit of 2 to 4 models. Feel No Pain 4+ against Psychic attacks and mortal wounds.',
      loadouts: [
        { role: 'Crusader', gear: ['Power weapon'] },
        { role: 'Crusader', gear: ['Power weapon'] }
      ]
    },
    {
      id: 'death-cult-assassins',
      name: 'Death Cult Assassins',
      models: 2,
      minModels: 2,
      maxModels: 4,
      repeatLoadoutIndex: 0,
      legends: true,
      epicHero: false,
      keywords: ['Imperium', 'Adepta Sororitas', 'Infantry'],
      summary: 'Legends unit of 2 to 4 models with Fights First, Infiltrators and Lone Operative.',
      loadouts: [
        { role: 'Death Cult Assassin', gear: ['Death Cult power blades'] },
        { role: 'Death Cult Assassin', gear: ['Death Cult power blades'] }
      ]
    },
    {
      id: 'battle-sisters-squad',
      name: 'Battle Sisters Squad',
      models: 10,
      minModels: 10,
      maxModels: 10,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Infantry', 'Battleline', 'Grenades', 'Battle Sisters Squad', 'Imperium'],
      summary: 'Controlled objectives remain under your control until the opponent claims them; once per battle, the cherub grants a Miracle die after this unit performs an Act of Faith.',
      loadouts: [
        { role: 'Sister Superior', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Battle Sister', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Battle Sister', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Battle Sister', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Battle Sister', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Battle Sister', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Battle Sister', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Battle Sister', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Battle Sister', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Battle Sister', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] }
      ],
      profiles: [
        { model: 'Battle Sister', stats: { M: '6', T: '3', SV: '3+', W: '1', LD: '7+', OC: '2', INV: '6+' }, base: '32mm', notes: 'Common unit profile.' }
      ],
      wargearRules: [
        'The Sister Superior can replace her Boltgun with one of the following: Bolt pistol; Combi-weapon; Condemnor boltgun; Inferno pistol; Ministorum hand flamer; Plasma pistol.',
        'The Sister Superior can be equipped with one Chainsword or one Power weapon in addition to her other equipment, retaining her Close combat weapon.',
        'One Battle Sister can replace her Boltgun with one of the following: Artificer-crafted storm bolter; Meltagun; Ministorum flamer.',
        'One other Battle Sister can replace her Boltgun with one of the following: Artificer-crafted storm bolter; Heavy bolter; Meltagun; Ministorum flamer; Ministorum heavy flamer; Multi-melta.',
        'One Battle Sister equipped with a Boltgun can also be equipped with one Simulacrum Imperialis. That model\'s Boltgun cannot be replaced.'
      ],
      weapons: [
        { name: 'Plasma pistol', type: 'ranged', profiles: [
          { name: 'standard', range: '12', a: '1', skill: '3+', s: '7', ap: '-2', d: '1', abilities: ['Pistol'] },
          { name: 'supercharge', range: '12', a: '1', skill: '3+', s: '8', ap: '-3', d: '2', abilities: ['Hazardous', 'Pistol'] }
        ] },
        { name: 'Condemnor boltgun', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Anti-Psyker 2+', 'Devastating Wounds', 'Precision', 'Rapid Fire 1'] }] },
        { name: 'Combi-weapon', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '4+', s: '4', ap: '0', d: '1', abilities: ['Anti-Infantry 4+', 'Devastating Wounds', 'Rapid Fire 1'] }] },
        { name: 'Boltgun', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Rapid Fire 1'] }] },
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Inferno pistol', type: 'ranged', profiles: [{ name: 'standard', range: '6', a: '1', skill: '3+', s: '8', ap: '-4', d: 'D3', abilities: ['Melta 2', 'Pistol'] }] },
        { name: 'Ministorum hand flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '4', ap: '0', d: '1', abilities: ['Ignores Cover', 'Pistol', 'Torrent'] }] },
        { name: 'Meltagun', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '9', ap: '-4', d: 'D6', abilities: ['Melta 2'] }] },
        { name: 'Artificer-crafted storm bolter', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '2', skill: '3+', s: '4', ap: '0', d: '2', abilities: ['Rapid Fire 2'] }] },
        { name: 'Ministorum flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '5', ap: '0', d: '1', abilities: ['Ignores Cover', 'Torrent'] }] },
        { name: 'Heavy bolter', type: 'ranged', profiles: [{ name: 'standard', range: '36', a: '3', skill: '4+', s: '5', ap: '-1', d: '2', abilities: ['Heavy', 'Sustained Hits 1'] }] },
        { name: 'Ministorum heavy flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '6', ap: '-1', d: '1', abilities: ['Ignores Cover', 'Torrent'] }] },
        { name: 'Multi-melta', type: 'ranged', profiles: [{ name: 'standard', range: '18', a: '2', skill: '4+', s: '9', ap: '-4', d: 'D6', abilities: ['Heavy', 'Melta 2'] }] },
        { name: 'Chainsword', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '3', ap: '0', d: '1', abilities: [] }] },
        { name: 'Power weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '2', skill: '4+', s: '4', ap: '-2', d: '1', abilities: [] }] },
        { name: 'Close combat weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '1', skill: '4+', s: '3', ap: '0', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Defenders of the Faith', text: 'At the end of your Command phase, an objective marker within range of this unit that you control remains under your control until your opponent controls it at the start or end of any turn.' },
        { name: 'Cherub', text: 'Once per battle, after this unit performs an Act of Faith, you gain 1 Miracle die.' },
        { name: 'Simulacrum Imperialis', text: 'At the end of your Command phase, for each objective marker you control that has a unit with this ability within range, roll one D6. On a 4+, you gain a Miracle die with a value equal to that result.' }
      ],
      specialRules: ['Acts of Faith'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Complete composition, default equipment and wargear rules follow the current user-supplied transcription, which claims a 2026-06-17 source date. This claim is not official proof and has not been independently verified. Existing model and weapon profiles are preserved, with Hand flamer normalized to Ministorum hand flamer. Army points remain sourced separately from MFM v1.6.'
    },
    {
      id: 'canoness',
      name: 'Canoness',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Canoness', 'Character', 'Grenades', 'Imperium', 'Infantry'],
      summary: 'Leader; Sacred Command reduces a Stratagem\'s CP cost, and The Emperor\'s Grace grants a once-per-battle 2+ invulnerable save for a phase.',
      loadouts: [
        { role: 'Canoness', gear: ['Bolt pistol', 'Hallowed chainsword'] }
      ],
      profiles: [
        { model: 'Canoness', stats: { M: '6', T: '3', SV: '3+', W: '4', LD: '7+', OC: '1', INV: '4+' }, base: '32mm', notes: '' }
      ],
      wargearRules: [
        'This model can replace its Bolt pistol with one of the following: Condemnor boltgun; Inferno pistol; Plasma pistol.',
        'This model can replace its Hallowed chainsword with one Blessed blade or one Power weapon.',
        'If this model is equipped with a Hallowed chainsword, it can also be equipped with one Brazier of Holy Fire or one Null Rod, but not both.',
        'If this model is equipped with a Plasma pistol and a Power weapon, it can also be equipped with one Rod of Office.'
      ],
      weapons: [
        { name: 'Plasma pistol', type: 'ranged', profiles: [
          { name: 'standard', range: '12', a: '1', skill: '2+', s: '7', ap: '-2', d: '1', abilities: ['Pistol'] },
          { name: 'supercharge', range: '12', a: '1', skill: '2+', s: '8', ap: '-3', d: '2', abilities: ['Hazardous', 'Pistol'] }
        ] },
        { name: 'Brazier of Holy Fire', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '6', ap: '-1', d: '2', abilities: ['Ignores Cover', 'One Shot', 'Torrent'] }] },
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '2+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Condemnor boltgun', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '2+', s: '4', ap: '0', d: '1', abilities: ['Anti-Psyker 2+', 'Devastating Wounds', 'Precision', 'Rapid Fire 1'] }] },
        { name: 'Inferno pistol', type: 'ranged', profiles: [{ name: 'standard', range: '6', a: '1', skill: '2+', s: '8', ap: '-4', d: 'D3', abilities: ['Melta 2', 'Pistol'] }] },
        { name: 'Blessed blade', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '2+', s: '6', ap: '-2', d: '2', abilities: ['Lethal Hits'] }] },
        { name: 'Power weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '2+', s: '4', ap: '-2', d: '2', abilities: [] }] },
        { name: 'Hallowed chainsword', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '5', skill: '2+', s: '3', ap: '-1', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'The Emperor\'s Grace', text: 'Once per battle, at the start of any phase, this model can use this ability to gain a 2+ invulnerable save until the end of that phase.' },
        { name: 'Leader', text: 'This model can lead a Battle Sisters Squad, Celestian Insidiants, Celestian Sacresants, Dominion Squad, Retributor Squad, Sisters Novitiate Squad or Crusaders.' },
        { name: 'Sacred Command', text: 'Once per battle round, when one unit from your army with this ability is targeted with a Stratagem, reduce the CP cost of that use of the Stratagem by 1CP.' },
        { name: 'Null Rod', text: 'The bearer\'s unit has Feel No Pain 4+ against mortal wounds and Psychic attacks.' },
        { name: 'Rod of Office', text: 'Each time a model in the bearer\'s unit makes an attack, re-roll a Hit roll of 1.' }
      ],
      specialRules: ['Acts of Faith', 'Leader'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Complete composition, default equipment and wargear rules follow the current user-supplied transcription, which claims a 2026-06-17 source date. This claim is not official proof and has not been independently verified. Existing model and weapon profiles are preserved. Null Rod and Rod of Office abilities apply only when the corresponding equipment is taken; One Shot applies only to the Brazier of Holy Fire weapon. Army points remain sourced separately from MFM v1.6.'
    },
    {
      id: 'canoness-with-jump-pack',
      name: 'Canoness with Jump Pack',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: false,
      keywords: ['Canoness', 'Character', 'Fly', 'Grenades', 'Imperium', 'Infantry', 'Jump Pack', 'Adepta Sororitas'],
      summary: 'Deep Strike; Leader for Seraphim or Zephyrim. Sacred Command reduces Stratagem costs, and Divine Deliverance grants a once-per-battle melee boost.',
      loadouts: [
        { role: 'Canoness with Jump Pack', gear: ['Blessed halberd'] }
      ],
      profiles: [
        { model: 'Canoness with Jump Pack', stats: { M: '12', T: '3', SV: '3+', W: '3', LD: '7+', OC: '1', INV: '4+' }, base: '32mm', notes: '' }
      ],
      wargearRules: [
        'This model can replace its Blessed halberd with one Holy eviscerator or with one Ministorum hand flamer and one Power weapon.'
      ],
      weapons: [
        { name: 'Ministorum hand flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '4', ap: '0', d: '1', abilities: ['Ignores Cover', 'Pistol', 'Torrent'] }] },
        { name: 'Blessed halberd', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '5', skill: '2+', s: '5', ap: '-2', d: '2', abilities: [] }] },
        { name: 'Power weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '2+', s: '4', ap: '-2', d: '2', abilities: [] }] },
        { name: 'Holy eviscerator', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '2+', s: '6', ap: '-2', d: '2', abilities: ['Sustained Hits 1'] }] }
      ],
      abilities: [
        { name: 'Divine Deliverance', text: 'Once per battle, at the start of the Fight phase, this model can use this ability. Until the end of the phase, add 3 to the Attacks characteristic of its melee weapons and those weapons have Devastating Wounds.' },
        { name: 'Leader', text: 'This model can lead a Seraphim Squad or Zephyrim Squad.' },
        { name: 'Sacred Command', text: 'Once per battle round, when one unit from your army with this ability is targeted with a Stratagem, reduce the CP cost of that use of the Stratagem by 1CP.' }
      ],
      specialRules: ['Acts of Faith', 'Deep Strike', 'Leader'],
      datasheetSource: { label: 'User-supplied Dakkapedia transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'The current user-supplied transcription establishes the Blessed halberd default and mutually exclusive replacement options, superseding the incomplete pending equipment notes. Hand flamer is normalized to Ministorum hand flamer. Existing model and weapon statistics are retained; points and Leader targets remain sourced from MFM v1.6.'
    },
    {
      id: 'castigator',
      name: 'Castigator',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: false,
      summary: 'Vehicle; Rites of Castigation improves the Armour Penetration of subsequent friendly ranged attacks against an enemy it hit.',
      loadouts: [
        { role: 'Castigator', gear: ['Castigator autocannons', 'Heavy bolter', 'Heavy bolter', 'Heavy bolter', 'Armoured tracks'] }
      ],
      keywords: ['Adepta Sororitas', 'Vehicle', 'Smoke', 'Imperium', 'Castigator', 'Frame'],
      profiles: [
        { model: 'Castigator', stats: { M: '10', T: '10', SV: '3+', W: '11', LD: '7+', OC: '3', INV: '6+' }, base: 'No base (hull)', notes: '' }
      ],
      wargearRules: [
        'This model can replace its Castigator autocannons with one Castigator battle cannon.',
        'This model can also be equipped with one Hunter-killer missile, independently of the Storm bolter option.',
        'This model can also be equipped with one Storm bolter, independently of the Hunter-killer missile option.'
      ],
      weapons: [
        { name: 'Heavy bolter', type: 'ranged', profiles: [{ name: 'standard', range: '36', a: '3', skill: '3+', s: '5', ap: '-1', d: '2', abilities: ['Sustained Hits 1'] }] },
        { name: 'Castigator autocannons', type: 'ranged', profiles: [{ name: 'standard', range: '48', a: '4', skill: '3+', s: '9', ap: '-1', d: '3', abilities: ['Twin-linked', 'Rapid Fire 4'] }] },
        { name: 'Castigator battle cannon', type: 'ranged', profiles: [{ name: 'standard', range: '48', a: 'D6+3', skill: '3+', s: '10', ap: '-1', d: '3', abilities: ['Blast', 'Ignores Cover'] }] },
        { name: 'Storm bolter', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '2', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Rapid Fire 2'] }] },
        { name: 'Hunter-killer missile', type: 'ranged', profiles: [{ name: 'standard', range: '48', a: '1', skill: '2+', s: '14', ap: '-3', d: 'D6', abilities: ['One Shot'] }] },
        { name: 'Armoured tracks', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '6', ap: '0', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Rites of Castigation', text: 'In your Shooting phase, after this model has shot, select one enemy unit hit by one or more of those attacks. Until the end of the turn, each time a friendly Adepta Sororitas model makes a ranged attack that targets that enemy unit, improve the Armour Penetration characteristic of that attack by 1. The same enemy unit can only be affected by this ability once per turn.' },
        { name: 'Damaged: 1-4 wounds remaining', text: 'While this model has 1-4 wounds remaining, each time it makes an attack, subtract 1 from the Hit roll.' }
      ],
      specialRules: ['Acts of Faith', 'Deadly Demise D3'],
      datasheetSource: { label: 'User-supplied Dakkapedia transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Current user-supplied equipment supersedes incomplete pending notes; existing statistics and no-base hull measurement are retained. Explicit faction v1.4 overrides take priority for the Frame keyword and Rites of Castigation: improve AP by 1, not a numerical positive AP modifier. Points conflict: supplied source lists 175 for the third unit versus MFM v1.6 at 185; retain v1.6 pricing of 165 for the first two and 185 from the third.'
    },
    {
      id: 'celestian-sacresants',
      name: 'Celestian Sacresants',
      models: 5,
      minModels: 5,
      maxModels: 10,
      repeatLoadoutIndex: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Celestian', 'Celestian Sacresants', 'Grenades', 'Imperium', 'Infantry'],
      summary: 'Sworn Protectors subtracts 1 from incoming Wound rolls while an Adepta Sororitas Character leads this unit.',
      loadouts: [
        { role: 'Sacresant Superior', gear: ['Bolt pistol', 'Hallowed mace'] },
        { role: 'Celestian Sacresant', gear: ['Bolt pistol', 'Hallowed mace'] },
        { role: 'Celestian Sacresant', gear: ['Bolt pistol', 'Hallowed mace'] },
        { role: 'Celestian Sacresant', gear: ['Bolt pistol', 'Hallowed mace'] },
        { role: 'Celestian Sacresant', gear: ['Bolt pistol', 'Hallowed mace'] }
      ],
      profiles: [
        { model: 'Celestian Sacresant', stats: { M: '6', T: '3', SV: '3+', W: '1', LD: '7+', OC: '1', INV: '4+' }, base: '32mm', notes: 'Common unit profile.' }
      ],
      wargearRules: [
        'Any number of models can each replace their Hallowed mace with one Anointed halberd.',
        'The Sacresant Superior can replace her Bolt pistol with one Inferno pistol, one Ministorum hand flamer or one Plasma pistol.',
        'The Sacresant Superior can replace her Hallowed mace with one Spear of the faithful.'
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Inferno pistol', type: 'ranged', profiles: [{ name: 'standard', range: '6', a: '1', skill: '3+', s: '8', ap: '-4', d: 'D3', abilities: ['Melta 2', 'Pistol'] }] },
        { name: 'Ministorum hand flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '4', ap: '0', d: '1', abilities: ['Ignores Cover', 'Pistol', 'Torrent'] }] },
        { name: 'Plasma pistol', type: 'ranged', profiles: [
          { name: 'standard', range: '12', a: '1', skill: '3+', s: '7', ap: '-2', d: '1', abilities: ['Pistol'] },
          { name: 'supercharge', range: '12', a: '1', skill: '3+', s: '8', ap: '-3', d: '2', abilities: ['Hazardous', 'Pistol'] }
        ] },
        { name: 'Anointed halberd', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '3+', s: '5', ap: '-2', d: '1', abilities: ['Sustained Hits 1'] }] },
        { name: 'Hallowed mace', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '3+', s: '4', ap: '-1', d: '2', abilities: ['Lethal Hits'] }] },
        { name: 'Spear of the faithful', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '3+', s: '5', ap: '-2', d: '2', abilities: [] }] }
      ],
      abilities: [
        { name: 'Sworn Protectors', text: 'While an Adepta Sororitas Character is leading this unit, each time an attack targets this unit, subtract 1 from the Wound roll.' }
      ],
      specialRules: ['Acts of Faith'],
      datasheetSource: { label: 'User-supplied Dakkapedia transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles, default equipment and wargear rules follow the current supplied transcription; add Celestian under the explicit faction v1.4 override. Points conflict for 5/10 models: supplied source 75/150 for the first unit and 90/165 from the second versus MFM v1.6 at 75/150 for the first two and 85/160 from the third. MFM v1.6 takes priority; all points remain unchanged.'
    },
    {
      id: 'daemonifuge',
      name: 'Daemonifuge',
      models: 2,
      minModels: 2,
      maxModels: 2,
      legends: false,
      epicHero: true,
      keywords: ['Adepta Sororitas', 'Character', 'Daemonifuge', 'Epic Hero', 'Grenades', 'Imperium', 'Infantry'],
      summary: 'Epic Hero pair with Deep Strike, Fights First and Lone Operative; Holy Judgement causes Battle-shock and mortal wounds, and Mysterious Saviours reduces Heroic Intervention costs.',
      loadouts: [
        { role: 'Ephrael Stern', gear: ['Bolt pistol', 'Sanctity'] },
        { role: 'Kyganil', gear: ['The Outcast\'s Weapons'] }
      ],
      profiles: [
        { model: 'Ephrael Stern', stats: { M: '8', T: '3', SV: '3+', W: '5', LD: '7+', OC: '1', INV: '4+' }, base: '32mm', notes: '' },
        { model: 'Kyganil', stats: { M: '8', T: '3', SV: '6+', W: '3', LD: '7+', OC: '1', INV: '4+' }, base: '32mm', notes: '' }
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Sanctity', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '2+', s: '6', ap: '-2', d: '2', abilities: ['Anti-Chaos 2+', 'Precision'] }] },
        { name: 'The Outcast\'s Weapons', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '6', skill: '2+', s: '4', ap: '-2', d: '1', abilities: ['Precision'] }] }
      ],
      abilities: [
        { name: 'Holy Judgement', text: 'At the start of your Shooting phase, select one enemy unit within 12 inches of and visible to Ephrael Stern. That unit must take a Battle-shock test, subtracting 2 from the result if it is a Chaos unit. If that test is failed, that unit suffers 3 mortal wounds.' },
        { name: 'Mysterious Saviours', text: 'You can target this unit with the Heroic Intervention Stratagem regardless of whether you have already used that Stratagem on another unit this phase. When you do, reduce its CP cost by 1CP. Using that Stratagem on this unit does not prevent you from using it on another unit in the same phase.' }
      ],
      specialRules: ['Deep Strike', 'Fights First', 'Lone Operative', 'Acts of Faith'],
      datasheetSource: { label: 'User-supplied Dakkapedia transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and default equipment follow the current supplied transcription. Explicit faction v1.4 override takes priority for Mysterious Saviours: reduce Heroic Intervention by 1CP, not a flat 0CP; other uses in the phase neither block this unit nor are blocked by it. MFM v1.6 pricing remains unchanged.'
    },
    {
      id: 'dialogus',
      name: 'Dialogus',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Character', 'Dialogus', 'Imperium', 'Infantry'],
      summary: 'Support Character; Stirring Rhetoric changes a Miracle die to 6 while leading, and Laud Hailer removes Battle-shock once per battle.',
      loadouts: [
        { role: 'Dialogus', gear: ['Bolt pistol', 'Dialogus staff'] }
      ],
      profiles: [
        { model: 'Dialogus', stats: { M: '6', T: '3', SV: '3+', W: '3', LD: '6+', OC: '1', INV: '4+' }, base: '40mm', notes: '' }
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Dialogus staff', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '4', ap: '0', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Laud Hailer', text: 'Once per battle, at the start of any phase, this model can use this ability. Each friendly Adepta Sororitas unit within 12 inches of this model that is Battle-shocked is no longer Battle-shocked.' },
        { name: 'Stirring Rhetoric', text: 'While this model is leading a unit, each time that unit performs an Act of Faith, first change the value of one Miracle die used for that Act of Faith to 6.' },
        { name: 'Support', text: 'This model can support a Battle Sisters Squad, Celestian Insidiants, Celestian Sacresants, Dominion Squad, Retributor Squad, Sisters Novitiate Squad or Crusaders.' }
      ],
      specialRules: ['Support', 'Acts of Faith'],
      datasheetSource: { label: 'User-supplied Dakkapedia transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and default equipment follow the current supplied transcription. Core ability conflict: the explicit faction v1.4 override takes priority and uses Support, not Leader; while-leading ability conditions are retained. Preserve the pricing attachment role Support and existing targets, adding Crusaders from the datasheet. MFM v1.6 points remain unchanged.'
    },
    {
      id: 'dogmata',
      name: 'Dogmata',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Character', 'Dogmata', 'Grenades', 'Imperium', 'Infantry'],
      summary: 'Support Character; worsens nearby enemy Leadership and adds 1 to the Objective Control of models in the unit she leads.',
      loadouts: [
        { role: 'Dogmata', gear: ['Bolt pistol', 'Mace of the righteous'] }
      ],
      profiles: [
        { model: 'Dogmata', stats: { M: '6', T: '3', SV: '3+', W: '3', LD: '6+', OC: '1', INV: '6+' }, base: '32mm', notes: '' }
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Mace of the righteous', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '3+', s: '5', ap: '-2', d: '2', abilities: [] }] }
      ],
      abilities: [
        { name: 'Executioner of Heretics (Aura)', text: 'While an enemy unit is within 6 inches of this model, worsen the Leadership characteristic of models in that unit by 1.' },
        { name: 'Unflinching Determination', text: 'While this model is leading a unit, add 1 to the Objective Control characteristic of models in that unit.' },
        { name: 'Support', text: 'This model can support a Battle Sisters Squad, Celestian Insidiants, Celestian Sacresants, Dominion Squad, Retributor Squad or Crusaders.' }
      ],
      specialRules: ['Support', 'Acts of Faith'],
      datasheetSource: { label: 'User-supplied Dakkapedia transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and default equipment follow the current supplied transcription. Core ability conflict: the explicit faction v1.4 override takes priority and uses Support, not Leader; while-leading ability conditions are retained. Preserve the pricing attachment role Support and existing targets, adding Crusaders from the datasheet but not Sisters Novitiate Squad. MFM v1.6 points remain unchanged.'
    },
    {
      id: 'dominion-squad',
      name: 'Dominion Squad',
      models: 10,
      minModels: 10,
      maxModels: 10,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Dominion Squad', 'Grenades', 'Imperium', 'Infantry'],
      summary: 'Scouts 6 inches; Righteous Awareness allows a reactive D6-inch Normal move, and Holy Vanguard grants Scouts to an attached Leader when starting embarked.',
      loadouts: [
        { role: 'Dominion Superior', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Dominion', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Dominion', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Dominion', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Dominion', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Dominion', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Dominion', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Dominion', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Dominion', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Dominion', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] }
      ],
      profiles: [
        { model: 'Dominion', stats: { M: '6', T: '3', SV: '3+', W: '1', LD: '7+', OC: '1', INV: '6+' }, base: '32mm', notes: 'Common unit profile.' }
      ],
      wargearRules: [
        'The Dominion Superior can replace her Boltgun with one of the following: Bolt pistol; Combi-weapon; Condemnor boltgun; Inferno pistol; Ministorum hand flamer; Plasma pistol.',
        'The Dominion Superior can be equipped with one Chainsword or one Power weapon in addition to her other equipment, retaining her Close combat weapon.',
        'Up to four Dominions can each replace their Boltgun with one Artificer-crafted storm bolter, one Meltagun or one Ministorum flamer.',
        'One Dominion equipped with a Boltgun can also be equipped with one Simulacrum Imperialis. That model\'s Boltgun cannot be replaced.'
      ],
      weapons: [
        { name: 'Plasma pistol', type: 'ranged', profiles: [
          { name: 'standard', range: '12', a: '1', skill: '3+', s: '7', ap: '-2', d: '1', abilities: ['Pistol'] },
          { name: 'supercharge', range: '12', a: '1', skill: '3+', s: '8', ap: '-3', d: '2', abilities: ['Hazardous', 'Pistol'] }
        ] },
        { name: 'Condemnor boltgun', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Anti-Psyker 2+', 'Devastating Wounds', 'Precision', 'Rapid Fire 1'] }] },
        { name: 'Combi-weapon', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '4+', s: '4', ap: '0', d: '1', abilities: ['Anti-Infantry 4+', 'Devastating Wounds', 'Rapid Fire 1'] }] },
        { name: 'Boltgun', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Rapid Fire 1', 'Assault'] }] },
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Inferno pistol', type: 'ranged', profiles: [{ name: 'standard', range: '6', a: '1', skill: '3+', s: '8', ap: '-4', d: 'D3', abilities: ['Melta 2', 'Pistol'] }] },
        { name: 'Ministorum hand flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '4', ap: '0', d: '1', abilities: ['Ignores Cover', 'Pistol', 'Torrent'] }] },
        { name: 'Meltagun', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '9', ap: '-4', d: 'D6', abilities: ['Melta 2', 'Assault'] }] },
        { name: 'Artificer-crafted storm bolter', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '2', skill: '3+', s: '4', ap: '0', d: '2', abilities: ['Rapid Fire 2', 'Assault'] }] },
        { name: 'Ministorum flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '5', ap: '0', d: '1', abilities: ['Ignores Cover', 'Torrent', 'Assault'] }] },
        { name: 'Chainsword', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '3', ap: '0', d: '1', abilities: [] }] },
        { name: 'Power weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '2', skill: '4+', s: '4', ap: '-2', d: '1', abilities: [] }] },
        { name: 'Close combat weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '1', skill: '4+', s: '3', ap: '0', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Cherub', text: 'Once per battle, after this unit performs an Act of Faith, you gain 1 Miracle die.' },
        { name: 'Righteous Awareness', text: 'In your opponent\'s Movement phase, each time an enemy unit ends a move within 8 inches of this unit, if this unit is not within Engagement Range of any enemy units, this unit can make a Normal move of up to D6 inches.' },
        { name: 'Holy Vanguard', text: 'If a Leader unit is attached to this unit during the Declare Battle Formations step and this unit starts the battle embarked within a Transport, models in that Leader unit have Scouts 6 inches.' },
        { name: 'Simulacrum Imperialis', text: 'At the end of your Command phase, for each objective marker you control that has a unit with this ability within range, roll one D6. On a 4+, you gain a Miracle die with a value equal to that result.' }
      ],
      specialRules: ['Scouts 6 inches', 'Acts of Faith'],
      datasheetSource: { label: 'User-supplied Dakkapedia transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Composition and equipment follow the supplied transcription. Weapon profiles are independent copies of Battle Sisters profiles excluding Heavy bolter, Ministorum heavy flamer and Multi-melta; only Boltgun, Artificer-crafted storm bolter, Meltagun and Ministorum flamer gain Assault. Simulacrum Imperialis requires its corresponding equipment. Explicit faction v1.4 override takes priority for Righteous Awareness: an enemy ends a move within 8 inches in the opponent\'s Movement phase while this unit is not engaged, permitting a D6-inch Normal move; not a once-per-turn 9-inch trigger. Points conflict: supplied source 100/110 versus MFM v1.6 at 90 for the first two and 100 from the third, plus 5 per Meltagun. MFM v1.6 points and wargear pricing remain unchanged.'
    },
    {
      id: 'exorcist',
      name: 'Exorcist',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Vehicle', 'Smoke', 'Frame', 'Exorcist', 'Imperium'],
      summary: 'Devastating Refrain forces Battle-shock after indirect hits and triggers enemy Deadly Demise on a 5+.',
      loadouts: [
        { role: 'Exorcist', gear: ['Exorcist missile launcher', 'Heavy bolter', 'Armoured tracks'] }
      ],
      profiles: [
        { model: 'Exorcist', stats: { M: '10', T: '10', SV: '3+', W: '11', LD: '7+', OC: '3', INV: '6+' }, base: 'No base (hull)', notes: '' }
      ],
      weapons: [
        { name: 'Exorcist conflagration rockets', type: 'ranged', profiles: [{ name: 'standard', range: '36', a: '3D6', skill: '3+', s: '6', ap: '-1', d: '1', abilities: ['Blast', 'Ignores Cover', 'Indirect Fire'] }] },
        { name: 'Exorcist missile launcher', type: 'ranged', profiles: [{ name: 'standard', range: '36', a: 'D6+2', skill: '3+', s: '10', ap: '-3', d: 'D6', abilities: ['Indirect Fire'] }] },
        { name: 'Heavy bolter', type: 'ranged', profiles: [{ name: 'standard', range: '36', a: '3', skill: '3+', s: '5', ap: '-1', d: '2', abilities: ['Sustained Hits 1'] }] },
        { name: 'Hunter-killer missile', type: 'ranged', profiles: [{ name: 'standard', range: '48', a: '1', skill: '2+', s: '14', ap: '-3', d: 'D6', abilities: ['One Shot'] }] },
        { name: 'Armoured tracks', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '6', ap: '0', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Devastating Refrain', text: 'In your Shooting phase, after this model has shot, each enemy unit hit by one or more of its attacks with an Indirect Fire weapon must take a Battle-shock test. Each time an attack made by this model destroys an enemy model with Deadly Demise, that ability triggers on a roll of 5+ instead of 6.' },
        { name: 'Damaged: 1-4 wounds remaining', text: 'While this model has 1-4 wounds remaining, each time it makes an attack, subtract 1 from the Hit roll.' }
      ],
      specialRules: ['Deadly Demise D3', 'Acts of Faith'],
      wargearRules: [
        'This model can replace its Exorcist missile launcher with Exorcist conflagration rockets.',
        'This model can also be equipped with one Hunter-killer missile.'
      ],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. The explicit faction v1.4 patch adds Frame. Army points remain sourced separately from MFM v1.6: 175 for the first two units and 215 from the third; no pricing changes.'
    },
    {
      id: 'hospitaller',
      name: 'Hospitaller',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Hospitaller', 'Character', 'Imperium', 'Infantry'],
      summary: 'Support Character; grants Feel No Pain 5+ while leading and returns destroyed non-Character models in your Command phase.',
      loadouts: [
        { role: 'Hospitaller', gear: ['Bolt pistol', 'Chirurgeon\'s tools'] }
      ],
      profiles: [
        { model: 'Hospitaller', stats: { M: '6', T: '3', SV: '3+', W: '3', LD: '7+', OC: '1', INV: '6+' }, base: '50mm', notes: '' }
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Chirurgeon\'s tools', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '3', ap: '0', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Medicus Ministorum', text: 'While this model is leading a unit, models in that unit have Feel No Pain 5+.' },
        { name: 'Sacred Healing', text: 'In your Command phase, while this model is leading a unit, return one destroyed non-Character model to that unit. You can discard one Miracle die to return up to D3+1 destroyed non-Character models instead.' },
        { name: 'Support', text: 'This model can support a Battle Sisters Squad, Celestian Insidiants, Celestian Sacresants, Dominion Squad, Retributor Squad, Sisters Novitiate Squad or Crusaders.' }
      ],
      specialRules: ['Support', 'Acts of Faith'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'The authoritative faction v1.4 override uses Support, not Leader; while-leading conditions are retained. The pricing attachment role remains Support, with Crusaders added as a target. Points conflict: supplied source 75/85 versus MFM v1.6 at 65 for the first unit and 75 from the second. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'imagifier',
      name: 'Imagifier',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Imagifier', 'Character', 'Grenades', 'Imperium', 'Infantry'],
      summary: 'Support Character; improves saves while leading and can re-roll Miracle dice gained from nearby destroyed Sororitas units or models.',
      loadouts: [
        { role: 'Imagifier', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] }
      ],
      profiles: [
        { model: 'Imagifier', stats: { M: '6', T: '3', SV: '3+', W: '3', LD: '6+', OC: '1', INV: '4+' }, base: '32mm', notes: '' }
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Boltgun', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Rapid Fire 1'] }] },
        { name: 'Close combat weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '3', ap: '0', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Litany of Deeds', text: 'Each time you gain a Miracle die because an Adepta Sororitas unit or model from your army is destroyed within 12 inches of this model, you can re-roll that die before adding it to your Miracle dice pool.' },
        { name: 'Stanchion of Holy Martyrs', text: 'While this model is leading a unit, models in that unit have a Save characteristic of 2+ and a 4+ invulnerable save.' },
        { name: 'Support', text: 'This model can support a Battle Sisters Squad, Celestian Insidiants, Celestian Sacresants, Dominion Squad, Retributor Squad or Crusaders.' }
      ],
      specialRules: ['Support', 'Acts of Faith'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'The authoritative faction v1.4 override uses Support, not Leader; while-leading conditions are retained. The pricing attachment role remains Support, with Crusaders added as a target. Points conflict: supplied source 65 versus MFM v1.6 at 55. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'immolator',
      name: 'Immolator',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Immolator', 'Vehicle', 'Dedicated Transport', 'Transport', 'Smoke', 'Frame', 'Imperium'],
      transportCapacity: { models: 6, keywords: ['Adepta Sororitas', 'Infantry'], excludedKeywords: ['Jump Pack'], excludedUnitIds: ['triumph-of-saint-katherine'], splitUnitIds: ['battle-sisters-squad', 'dominion-squad', 'sisters-novitiate-squad'] },
      summary: 'Transport for six Infantry; can split eligible squads and remove the Benefit of Cover from an enemy it hits.',
      loadouts: [
        { role: 'Immolator', gear: ['Heavy bolter', 'Immolation flamers', 'Armoured tracks'] }
      ],
      profiles: [
        { model: 'Immolator', stats: { M: '12', T: '10', SV: '3+', W: '11', LD: '7+', OC: '2', INV: '6+' }, base: 'No base (hull)', notes: '' }
      ],
      weapons: [
        { name: 'Heavy bolter', type: 'ranged', profiles: [{ name: 'standard', range: '36', a: '3', skill: '3+', s: '5', ap: '-1', d: '2', abilities: ['Sustained Hits 1'] }] },
        { name: 'Hunter-killer missile', type: 'ranged', profiles: [{ name: 'standard', range: '48', a: '1', skill: '2+', s: '14', ap: '-3', d: 'D6', abilities: ['One Shot'] }] },
        { name: 'Immolation flamers', type: 'ranged', profiles: [{ name: 'standard', range: '18', a: '2D6', skill: 'N/A', s: '6', ap: '-1', d: '1', abilities: ['Ignores Cover', 'Torrent'] }] },
        { name: 'Twin heavy bolter', type: 'ranged', profiles: [{ name: 'standard', range: '36', a: '3', skill: '3+', s: '5', ap: '-1', d: '2', abilities: ['Sustained Hits 2', 'Twin-linked'] }] },
        { name: 'Twin Multi-melta', type: 'ranged', profiles: [{ name: 'standard', range: '18', a: '2', skill: '3+', s: '9', ap: '-4', d: 'D6', abilities: ['Melta 2', 'Twin-linked'] }] },
        { name: 'Armoured tracks', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '6', ap: '0', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Fire Support', text: 'In your Shooting phase, after this model has shot, select one enemy unit hit by one or more of those attacks. Until the end of the phase, that unit cannot have the Benefit of Cover.' },
        { name: 'Transport', text: 'This model has a transport capacity of 6 Adepta Sororitas Infantry models. It cannot transport Jump Pack models or the Triumph of Saint Katherine.' },
        { name: 'Split Squads', text: 'At the start of the Declare Battle Formations step, you can select one Battle Sisters Squad, Dominion Squad or Sisters Novitiate Squad from your army and split it into two units as equal in size as possible. Record which models are in each unit. Only one of the resulting units can use the original unit\'s Cherub ability. One unit must start the battle embarked within this Immolator; the other can start embarked within another Transport or deploy as a separate unit.' }
      ],
      specialRules: ['Deadly Demise D3', 'Acts of Faith'],
      wargearRules: [
        'This model can replace its Immolation flamers with one Twin heavy bolter or one Twin Multi-melta.',
        'This model can also be equipped with one Hunter-killer missile.'
      ],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. The explicit faction v1.4 patch adds Frame. Army points remain sourced separately from MFM v1.6: 100 for the first three units and 115 from the fourth, with the existing 15-point Twin Multi-melta surcharge unchanged.'
    },
    {
      id: 'junith-eruita',
      name: 'Junith Eruita',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: true,
      keywords: ['Adepta Sororitas', 'Junith Eruita', 'Character', 'Epic Hero', 'Fly', 'Imperium', 'Mounted'],
      summary: 'Epic Hero Leader; her unit has Stealth and subtracts 1 from incoming melee Hit rolls.',
      loadouts: [
        { role: 'Junith Eruita', gear: ['Twin Ministorum heavy flamer', 'Mace of Castigation'] }
      ],
      profiles: [
        { model: 'Junith Eruita', stats: { M: '8', T: '5', SV: '2+', W: '8', LD: '6+', OC: '2', INV: '4+' }, base: '50mm', notes: '' }
      ],
      weapons: [
        { name: 'Twin Ministorum heavy flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '6', ap: '-1', d: '1', abilities: ['Ignores Cover', 'Torrent', 'Twin-linked'] }] },
        { name: 'Mace of Castigation', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '2+', s: '6', ap: '-2', d: '2', abilities: [] }] }
      ],
      abilities: [
        { name: 'Pulpit of Saint Holline\'s Basilica', timing: ['shooting', 'fight'], text: 'This unit has Stealth. Each time a melee attack targets this unit, subtract 1 from the Hit roll.' },
        { name: 'Fiery Conviction', text: 'At the start of your Command phase, if this model is on the battlefield, choose one: discard one Miracle die to gain 1CP; or take a Leadership test for this model, gaining 1CP if it is passed.' },
        { name: 'Leader', text: 'This model can lead a Battle Sisters Squad, Celestian Insidiants, Celestian Sacresants, Dominion Squad, Retributor Squad, Sisters Novitiate Squad or Crusaders.' }
      ],
      specialRules: ['Leader', 'Deadly Demise 1', 'Acts of Faith'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'The authoritative faction v1.4 Pulpit override grants this unit Stealth and subtracts 1 from melee Hit rolls against it, not all Hit rolls while leading. Crusaders are added to attachment targets. Points conflict: supplied source 115 versus MFM v1.6 at 105. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'ministorum-priest',
      name: 'Ministorum Priest',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Ministorum Priest', 'Character', 'Imperium', 'Infantry', 'Penitent'],
      summary: 'Leader; adds 1 to melee Wound rolls while leading and can boost his melee weapons once per battle.',
      loadouts: [
        { role: 'Ministorum Priest', gear: ['Zealot\'s vindictor'] }
      ],
      profiles: [
        { model: 'Ministorum Priest', stats: { M: '6', T: '3', SV: '6+', W: '3', LD: '7+', OC: '1', INV: '4+' }, base: '32mm', notes: '' }
      ],
      weapons: [
        { name: 'Holy pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '3', skill: '4+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Zealot\'s vindictor', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '5', ap: '0', d: '1', abilities: ['Ignores Cover', 'Torrent'] }] },
        { name: 'Power weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '3+', s: '4', ap: '-2', d: '1', abilities: [] }] },
        { name: 'Zealot\'s vindictor', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '5', ap: '-1', d: '2', abilities: [] }] }
      ],
      abilities: [
        { name: 'War Hymns', text: 'While this model is leading a unit, each time a model in that unit makes a melee attack, add 1 to the Wound roll.' },
        { name: 'Zealot', text: 'Once per battle, in the Fight phase, this model can use this ability. Until the end of the phase, add 3 to the Strength and Attacks characteristics of its melee weapons.' },
        { name: 'Holy Mission', text: 'If this model is attached to a Dominion Squad during the Declare Battle Formations step, it gains Scouts 6 inches. If it is attached to a Sisters Novitiate Squad during that step, it gains Infiltrators instead.' },
        { name: 'Leader', text: 'This model can lead Arco-flagellants, a Battle Sisters Squad, Celestian Insidiants, a Dominion Squad, Sanctifiers, a Sisters Novitiate Squad or Crusaders.' }
      ],
      specialRules: ['Leader', 'Acts of Faith'],
      wargearRules: [
        'This model can replace its Zealot\'s vindictor with one Holy pistol and one Power weapon.'
      ],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. The single Zealot\'s vindictor has separate ranged and melee profile records, not two equipment items. Crusaders are added to attachment targets. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'mortifiers',
      name: 'Mortifiers',
      models: 1,
      minModels: 1,
      maxModels: 2,
      repeatLoadoutIndex: 0,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Mortifiers', 'Vehicle', 'Walker', 'Penitent', 'Imperium'],
      summary: 'Penitent walkers with Feel No Pain 5+ and a chance to fight after being destroyed in melee.',
      loadouts: [
        { role: 'Mortifier', gear: ['Heavy bolter', 'Heavy bolter', 'Twin penitent buzz-blades'] }
      ],
      profiles: [
        { model: 'Mortifier', stats: { M: '8', T: '6', SV: '4+', W: '5', LD: '7+', OC: '2', INV: '6+' }, base: '50mm', notes: 'An Anchorite sarcophagus changes only its bearer to Move 7 and Save 3+.' }
      ],
      weapons: [
        { name: 'Heavy bolter', type: 'ranged', profiles: [{ name: 'standard', range: '36', a: '3', skill: '3+', s: '5', ap: '-1', d: '2', abilities: ['Sustained Hits 1'] }] },
        { name: 'Mortifier flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '5', ap: '0', d: '1', abilities: ['Ignores Cover', 'Torrent', 'Twin-linked'] }] },
        { name: 'Penitent buzz-blade', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '3+', s: '10', ap: '-3', d: '2', abilities: ['Sustained Hits 1'] }] },
        { name: 'Penitent flail', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '8', skill: '3+', s: '5', ap: '-1', d: '1', abilities: ['Sustained Hits 1'] }] },
        { name: 'Twin penitent buzz-blades', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '3+', s: '10', ap: '-3', d: '2', abilities: ['Sustained Hits 1', 'Twin-linked'] }] },
        { name: 'Twin penitent flails', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '8', skill: '3+', s: '5', ap: '-1', d: '1', abilities: ['Sustained Hits 1', 'Twin-linked'] }] }
      ],
      abilities: [
        { name: 'Anguish of the Unredeemed', text: 'Each time a model in this unit is destroyed by a melee attack, if it has not fought this phase, roll one D6. On a 2+, do not remove it yet. After the attacking unit has finished making its attacks, the destroyed model can fight, then is removed from play.' },
        { name: 'Anchorite sarcophagus', text: 'If equipped, the bearer has a Move characteristic of 7 inches and a Save characteristic of 3+. Other models retain their normal profile.' }
      ],
      specialRules: ['Deadly Demise 1', 'Feel No Pain 5+', 'Acts of Faith'],
      wargearRules: [
        'One model in this unit can be equipped with one Anchorite sarcophagus.',
        'Any model can replace its two Heavy bolters with one Heavy bolter and one Mortifier flamer, or with two Mortifier flamers.',
        'Any model can replace its Twin penitent buzz-blades with Twin penitent flails, or with one Penitent buzz-blade and one Penitent flail. This choice is independent of its ranged equipment.'
      ],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. The Anchorite sarcophagus is limited to one per unit and does not change the base profile. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'morvenn-vahl',
      name: 'Morvenn Vahl',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: true,
      mustWarlord: true,
      keywords: ['Adepta Sororitas', 'Morvenn Vahl', 'Character', 'Epic Hero', 'Imperium', 'Vehicle', 'Walker'],
      summary: 'Supreme Commander; must be your Warlord and grants Hit and Wound re-rolls while leading Paragon Warsuits.',
      loadouts: [
        { role: 'Morvenn Vahl', gear: ['Fidelis', 'Paragon missile launcher', 'Lance of Illumination'] }
      ],
      profiles: [
        { model: 'Morvenn Vahl', stats: { M: '8', T: '7', SV: '2+', W: '8', LD: '6+', OC: '3', INV: '4+' }, base: '60mm', notes: '' }
      ],
      weapons: [
        { name: 'Fidelis', type: 'ranged', profiles: [{ name: 'standard', range: '36', a: '3', skill: '2+', s: '6', ap: '-1', d: '2', abilities: ['Sustained Hits 1'] }] },
        { name: 'Paragon missile launcher', type: 'ranged', profiles: [
          { name: 'prioris', range: '36', a: '2', skill: '2+', s: '9', ap: '-2', d: 'D6', abilities: [] },
          { name: 'sanctorum', range: '36', a: '2D6', skill: '2+', s: '4', ap: '0', d: '1', abilities: ['Blast'] }
        ] },
        { name: 'Lance of Illumination', type: 'melee', profiles: [
          { name: 'strike', range: 'Melee', a: '5', skill: '2+', s: '8', ap: '-2', d: '3', abilities: ['Devastating Wounds'] },
          { name: 'sweep', range: 'Melee', a: '10', skill: '2+', s: '5', ap: '-1', d: '1', abilities: ['Devastating Wounds'] }
        ] }
      ],
      abilities: [
        { name: 'Abbess Sanctorum', text: 'While this model is leading a unit, each time a model in that unit makes an attack, you can re-roll the Hit roll and the Wound roll.' },
        { name: 'Righteous Repugnance', text: 'When this model is selected to shoot or fight, you can discard one Miracle die. If you do, until the end of the phase, add 3 to the Attacks characteristics of Fidelis and the Lance of Illumination. Each time this model destroys an enemy unit, you gain 1 Miracle die.' },
        { name: 'Supreme Commander', text: 'If your army includes this model, it must be your Warlord.' },
        { name: 'Leader', text: 'This model can lead Paragon Warsuits.' }
      ],
      specialRules: ['Leader', 'Deadly Demise 1', 'Acts of Faith'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. Supreme Commander is also recorded as mustWarlord. Points conflict: supplied source 185 versus MFM v1.6 at 215. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'palatine',
      name: 'Palatine',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Palatine', 'Character', 'Grenades', 'Imperium', 'Infantry'],
      summary: 'Leader; grants Lethal Hits while leading and can discard a Miracle die for additional melee mortal wounds.',
      loadouts: [
        { role: 'Palatine', gear: ['Bolt pistol', 'Palatine blade'] }
      ],
      profiles: [
        { model: 'Palatine', stats: { M: '6', T: '3', SV: '3+', W: '4', LD: '7+', OC: '1', INV: '4+' }, base: '32mm', notes: '' }
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '2+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Plasma pistol', type: 'ranged', profiles: [
          { name: 'standard', range: '12', a: '1', skill: '2+', s: '7', ap: '-2', d: '1', abilities: ['Pistol'] },
          { name: 'supercharge', range: '12', a: '1', skill: '2+', s: '8', ap: '-3', d: '2', abilities: ['Hazardous', 'Pistol'] }
        ] },
        { name: 'Palatine blade', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '2+', s: '4', ap: '-2', d: '2', abilities: [] }] }
      ],
      abilities: [
        { name: 'Fury of the Righteous', timing: ['shooting', 'fight'], text: 'While this model is leading a unit, weapons equipped by models in that unit have Lethal Hits.' },
        { name: 'Rapturous Blows', text: 'When this model is selected to fight, you can discard one Miracle die. If you do, until the end of the phase, each time this model makes a melee attack that successfully wounds, the target suffers 1 mortal wound in addition to any normal damage.' },
        { name: 'Leader', text: 'This model can lead a Battle Sisters Squad, Celestian Insidiants, Celestian Sacresants, Dominion Squad, Retributor Squad, Sisters Novitiate Squad or Crusaders.' }
      ],
      specialRules: ['Leader', 'Acts of Faith'],
      wargearRules: [
        'This model can replace its Bolt pistol with one Plasma pistol.'
      ],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. Crusaders are added to attachment targets. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'paragon-warsuits',
      name: 'Paragon Warsuits',
      models: 3,
      minModels: 3,
      maxModels: 3,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Paragon Warsuits', 'Vehicle', 'Walker', 'Grenades', 'Imperium'],
      summary: 'Three warsuits; add 1 to Hit and Wound rolls against Monsters and Vehicles.',
      loadouts: [
        { role: 'Paragon Superior', gear: ['Bolt pistol', 'Heavy bolter', 'Paragon storm bolters', 'Paragon war blade'] },
        { role: 'Paragon', gear: ['Bolt pistol', 'Heavy bolter', 'Paragon storm bolters', 'Paragon war blade'] },
        { role: 'Paragon', gear: ['Bolt pistol', 'Heavy bolter', 'Paragon storm bolters', 'Paragon war blade'] }
      ],
      profiles: [
        { model: 'Paragon', stats: { M: '8', T: '7', SV: '2+', W: '4', LD: '7+', OC: '2', INV: '4+' }, base: '50mm', notes: 'Common unit profile, including the Paragon Superior.' }
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Heavy bolter', type: 'ranged', profiles: [{ name: 'standard', range: '36', a: '3', skill: '3+', s: '5', ap: '-1', d: '2', abilities: ['Sustained Hits 1'] }] },
        { name: 'Ministorum heavy flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '6', ap: '-1', d: '1', abilities: ['Ignores Cover', 'Torrent'] }] },
        { name: 'Multi-melta', type: 'ranged', profiles: [{ name: 'standard', range: '18', a: '2', skill: '3+', s: '9', ap: '-4', d: 'D6', abilities: ['Melta 2'] }] },
        { name: 'Paragon grenade launchers', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '3+', s: '9', ap: '-2', d: 'D3', abilities: ['Twin-linked'] }] },
        { name: 'Paragon storm bolters', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '2', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Rapid Fire 2', 'Twin-linked'] }] },
        { name: 'Paragon war blade', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '3+', s: '8', ap: '-2', d: '2', abilities: [] }] },
        { name: 'Paragon war mace', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '3+', s: '12', ap: '-1', d: '3', abilities: [] }] }
      ],
      abilities: [
        { name: 'Righteous Paragons', text: 'Each time a model in this unit makes an attack that targets a Monster or Vehicle unit, add 1 to the Hit roll and the Wound roll.' }
      ],
      specialRules: ['Acts of Faith'],
      wargearRules: [
        'Any model can replace its Paragon storm bolters with Paragon grenade launchers.',
        'Any model can replace its Paragon war blade with one Paragon war mace.',
        'Any model can replace its Heavy bolter with one Ministorum heavy flamer or one Multi-melta. All three replacement choices are independent.'
      ],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. Composition is fixed at one Superior and two Paragons. Army points remain sourced separately from MFM v1.6: 165 for the first two units and 175 from the third, with the existing 10-point surcharge per Multi-melta unchanged.'
    },
    {
      id: 'penitent-engines',
      name: 'Penitent Engines',
      models: 1,
      minModels: 1,
      maxModels: 2,
      repeatLoadoutIndex: 0,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Penitent Engines', 'Vehicle', 'Walker', 'Penitent', 'Imperium'],
      summary: 'Penitent walkers with Feel No Pain 5+ that can charge after Advancing.',
      loadouts: [
        { role: 'Penitent Engine', gear: ['Penitent flamers', 'Twin penitent buzz-blades'] }
      ],
      profiles: [
        { model: 'Penitent Engine', stats: { M: '8', T: '6', SV: '4+', W: '5', LD: '7+', OC: '2', INV: '6+' }, base: '50mm', notes: '' }
      ],
      weapons: [
        { name: 'Penitent flamers', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '2D6', skill: 'N/A', s: '5', ap: '0', d: '1', abilities: ['Assault', 'Ignores Cover', 'Torrent', 'Twin-linked'] }] },
        { name: 'Penitent buzz-blade', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '4+', s: '10', ap: '-3', d: '2', abilities: ['Sustained Hits 1'] }] },
        { name: 'Penitent flail', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '8', skill: '4+', s: '5', ap: '-1', d: '1', abilities: ['Sustained Hits 1'] }] },
        { name: 'Twin penitent buzz-blades', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '4+', s: '10', ap: '-3', d: '2', abilities: ['Sustained Hits 1', 'Twin-linked'] }] },
        { name: 'Twin penitent flails', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '8', skill: '4+', s: '5', ap: '-1', d: '1', abilities: ['Sustained Hits 1', 'Twin-linked'] }] }
      ],
      abilities: [
        { name: 'Endless Suffering', timing: ['movement:own', 'charge:own'], text: 'This unit is eligible to declare a charge in a turn in which it Advanced.' }
      ],
      specialRules: ['Deadly Demise 1', 'Feel No Pain 5+', 'Acts of Faith'],
      wargearRules: [
        'Any model can replace its Twin penitent buzz-blades with Twin penitent flails, or with one Penitent buzz-blade and one Penitent flail. Each model chooses independently and retains its Penitent flamers.'
      ],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'repentia-squad',
      name: 'Repentia Squad',
      models: 5,
      minModels: 5,
      maxModels: 10,
      repeatLoadoutIndex: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Repentia Squad', 'Grenades', 'Imperium', 'Infantry', 'Penitent'],
      summary: 'Feel No Pain 5+; Sisters Repentia re-roll melee Hit and Wound rolls while their Superior is present.',
      loadouts: [
        { role: 'Repentia Superior', gear: ['Bolt pistol', 'Neural whips'] },
        { role: 'Sister Repentia', gear: ['Penitent eviscerator'] },
        { role: 'Sister Repentia', gear: ['Penitent eviscerator'] },
        { role: 'Sister Repentia', gear: ['Penitent eviscerator'] },
        { role: 'Sister Repentia', gear: ['Penitent eviscerator'] }
      ],
      profiles: [
        { model: 'Repentia Superior', stats: { M: '7', T: '3', SV: '3+', W: '1', LD: '7+', OC: '1', INV: '6+' }, base: '32mm', notes: '' },
        { model: 'Sister Repentia', stats: { M: '7', T: '3', SV: '7+', W: '1', LD: '8+', OC: '1', INV: '6+' }, base: '28.5mm', notes: '' }
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Neural whips', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '3+', s: '3', ap: '-1', d: '1', abilities: ['Anti-Infantry 4+'] }] },
        { name: 'Penitent eviscerator', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '2', skill: '4+', s: '6', ap: '-2', d: '2', abilities: ['Sustained Hits 1'] }] }
      ],
      abilities: [
        { name: 'Overseer of Redemption', text: 'While this unit contains a Repentia Superior, each time a Sister Repentia in this unit makes a melee attack, you can re-roll the Hit roll and the Wound roll.' }
      ],
      specialRules: ['Feel No Pain 5+', 'Acts of Faith'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. Additional models repeat the Sister Repentia loadout, never the Superior. Points conflict for 5/10 models: supplied source 75/160 versus MFM v1.6 at 70/140. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'saint-celestine',
      name: 'Saint Celestine',
      models: 3,
      minModels: 3,
      maxModels: 3,
      legends: false,
      epicHero: true,
      keywords: ['Adepta Sororitas', 'Saint Celestine', 'Character', 'Epic Hero', 'Fly', 'Grenades', 'Imperium', 'Infantry', 'Jump Pack'],
      summary: 'Epic Hero with two Geminae Superia; restores one Geminae in your Command phase and can return after her first destruction.',
      loadouts: [
        { role: 'Celestine', gear: ['The Ardent Blade'] },
        { role: 'Geminae Superia', gear: ['Bolt pistol', 'Power weapon'] },
        { role: 'Geminae Superia', gear: ['Bolt pistol', 'Power weapon'] }
      ],
      profiles: [
        { model: 'Celestine', stats: { M: '12', T: '3', SV: '2+', W: '5', LD: '6+', OC: '1', INV: '4+' }, base: '40mm', notes: '' },
        { model: 'Geminae Superia', stats: { M: '12', T: '3', SV: '2+', W: '2', LD: '7+', OC: '1', INV: '4+' }, base: '32mm', notes: '' }
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'The Ardent Blade', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '6', ap: '-2', d: '1', abilities: ['Ignores Cover', 'Torrent'] }] },
        { name: 'The Ardent Blade', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '5', skill: '2+', s: '6', ap: '-3', d: '2', abilities: ['Devastating Wounds'] }] },
        { name: 'Power weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '3+', s: '4', ap: '-2', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Healing Tears', text: 'In your Command phase, while this unit contains Celestine, return one destroyed Geminae Superia model to this unit.' },
        { name: 'Lifewards', text: 'While this unit contains one or more Geminae Superia models, Celestine has Feel No Pain 4+.' },
        { name: 'Miraculous Intervention', text: 'The first time Celestine is destroyed, at the end of that phase roll one D6. On a 2+, return her to the battlefield with all her wounds remaining, as close as possible to where she was destroyed and not within Engagement Range of any enemy models.' },
        { name: 'Leader', text: 'This unit can lead a Seraphim Squad or Zephyrim Squad.' }
      ],
      specialRules: ['Leader', 'Deep Strike', 'Acts of Faith'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'The authoritative faction v1.4 Healing Tears override returns only one Geminae Superia in your Command phase while Celestine is present; it does not return D3 Bodyguard models. The Ardent Blade is one equipment item with separate ranged and melee records. Points conflict: supplied source 150 versus MFM v1.6 at 135. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'seraphim-squad',
      name: 'Seraphim Squad',
      models: 5,
      minModels: 5,
      maxModels: 10,
      repeatLoadoutIndex: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Seraphim Squad', 'Fly', 'Grenades', 'Imperium', 'Infantry', 'Jump Pack'],
      summary: 'Deep Strike; can make a 6-inch Normal move after shooting if not engaged, but cannot then charge that turn.',
      loadouts: [
        { role: 'Seraphim Superior', gear: ['Bolt pistol', 'Bolt pistol', 'Close combat weapon'] },
        { role: 'Seraphim', gear: ['Bolt pistol', 'Bolt pistol', 'Close combat weapon'] },
        { role: 'Seraphim', gear: ['Bolt pistol', 'Bolt pistol', 'Close combat weapon'] },
        { role: 'Seraphim', gear: ['Bolt pistol', 'Bolt pistol', 'Close combat weapon'] },
        { role: 'Seraphim', gear: ['Bolt pistol', 'Bolt pistol', 'Close combat weapon'] }
      ],
      profiles: [
        { model: 'Seraphim', stats: { M: '12', T: '3', SV: '3+', W: '1', LD: '7+', OC: '1', INV: '5+' }, base: '32mm', notes: 'Common unit profile, including the Seraphim Superior.' }
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Inferno pistol', type: 'ranged', profiles: [{ name: 'standard', range: '6', a: '1', skill: '3+', s: '8', ap: '-4', d: 'D3', abilities: ['Melta 2', 'Pistol'] }] },
        { name: 'Ministorum hand flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '4', ap: '0', d: '1', abilities: ['Ignores Cover', 'Pistol', 'Torrent'] }] },
        { name: 'Plasma pistol', type: 'ranged', profiles: [
          { name: 'standard', range: '12', a: '1', skill: '3+', s: '7', ap: '-2', d: '1', abilities: ['Pistol'] },
          { name: 'supercharge', range: '12', a: '1', skill: '3+', s: '8', ap: '-3', d: '2', abilities: ['Hazardous', 'Pistol'] }
        ] },
        { name: 'Chainsword', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '4', skill: '3+', s: '3', ap: '0', d: '1', abilities: [] }] },
        { name: 'Close combat weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '2', skill: '3+', s: '3', ap: '0', d: '1', abilities: [] }] },
        { name: 'Power weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '3+', s: '4', ap: '-2', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Angelic Ascent', text: 'In your Shooting phase, after this unit has shot, if it is not within Engagement Range of any enemy units, it can make a Normal move of up to 6 inches. If it does, it is not eligible to declare a charge for the rest of the turn.' }
      ],
      specialRules: ['Deep Strike', 'Acts of Faith'],
      wargearRules: [
        'For every five models in this unit, up to two Seraphim, excluding the Superior, can each replace both Bolt pistols with two Inferno pistols or two Ministorum hand flamers. These choices share one combined limit: two models for five to nine models in the unit, or four models for ten. Each selected model takes a matching pair.',
        'The Seraphim Superior can replace both Bolt pistols with one of the following pairs: Bolt pistol and Chainsword; Bolt pistol and Plasma pistol; Bolt pistol and Power weapon; Plasma pistol and Chainsword; Plasma pistol and Power weapon. She retains her Close combat weapon.'
      ],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. Additional models repeat the Seraphim loadout, never the Superior. The shared special-pistol model limit is twice the number of complete groups of five models. Any source points conflicts defer to separate MFM v1.6 pricing: 75/150 for 5/10 models in the first two units and 85/160 from the third, unchanged.'
    },
    {
      id: 'sisters-novitiate-squad',
      name: 'Sisters Novitiate Squad',
      models: 10,
      minModels: 10,
      maxModels: 10,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Sisters Novitiate Squad', 'Grenades', 'Imperium', 'Infantry'],
      summary: 'Infiltrators; re-roll Hit rolls of 1, or all Hit rolls against enemies within range of an objective marker.',
      loadouts: [
        { role: 'Novitiate Superior', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Sister Novitiate', gear: ['Autopistol', 'Autogun', 'Close combat weapon'] },
        { role: 'Sister Novitiate', gear: ['Autopistol', 'Autogun', 'Close combat weapon'] },
        { role: 'Sister Novitiate', gear: ['Autopistol', 'Autogun', 'Close combat weapon'] },
        { role: 'Sister Novitiate', gear: ['Autopistol', 'Autogun', 'Close combat weapon'] },
        { role: 'Sister Novitiate', gear: ['Autopistol', 'Autogun', 'Close combat weapon'] },
        { role: 'Sister Novitiate', gear: ['Autopistol', 'Autogun', 'Close combat weapon'] },
        { role: 'Sister Novitiate', gear: ['Autopistol', 'Autogun', 'Close combat weapon'] },
        { role: 'Sister Novitiate', gear: ['Autopistol', 'Autogun', 'Close combat weapon'] },
        { role: 'Sister Novitiate', gear: ['Autopistol', 'Autogun', 'Close combat weapon'] }
      ],
      profiles: [
        { model: 'Novitiate Superior', stats: { M: '6', T: '3', SV: '3+', W: '1', LD: '7+', OC: '2', INV: '6+' }, base: '32mm', notes: '' },
        { model: 'Sister Novitiate', stats: { M: '6', T: '3', SV: '4+', W: '1', LD: '8+', OC: '2', INV: '6+' }, base: '28.5mm', notes: '' }
      ],
      weapons: [
        { name: 'Autopistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '3', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Autogun', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '3+', s: '3', ap: '0', d: '1', abilities: ['Rapid Fire 1'] }] },
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Boltgun', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Rapid Fire 1'] }] },
        { name: 'Ministorum flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '5', ap: '0', d: '1', abilities: ['Ignores Cover', 'Torrent'] }] },
        { name: 'Plasma pistol', type: 'ranged', profiles: [
          { name: 'standard', range: '12', a: '1', skill: '3+', s: '7', ap: '-2', d: '1', abilities: ['Pistol'] },
          { name: 'supercharge', range: '12', a: '1', skill: '3+', s: '8', ap: '-3', d: '2', abilities: ['Hazardous', 'Pistol'] }
        ] },
        { name: 'Close combat weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '1', skill: '4+', s: '3', ap: '0', d: '1', abilities: [] }] },
        { name: 'Novitiate melee weapons', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '2', skill: '4+', s: '4', ap: '0', d: '1', abilities: [] }] },
        { name: 'Power weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '2', skill: '4+', s: '4', ap: '-2', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Novitiate Militants', text: 'Each time a model in this unit makes an attack, re-roll a Hit roll of 1. If the target is within range of an objective marker, you can re-roll the Hit roll instead.' },
        { name: 'Sacred Banner', timing: ['movement', 'charge'], text: 'If this unit contains a model equipped with a Sacred Banner, you can re-roll Advance and Charge rolls made for this unit.' },
        { name: 'Simulacrum Imperialis', text: 'At the end of your Command phase, for each objective marker you control that has a unit with this ability within range, roll one D6. On a 4+, you gain a Miracle die with a value equal to that result.' }
      ],
      specialRules: ['Infiltrators', 'Acts of Faith'],
      wargearRules: [
        'The Novitiate Superior can replace both her Bolt pistol and Boltgun with one Bolt pistol and one Power weapon, or with one Plasma pistol and one Power weapon. She retains her Close combat weapon.',
        'One Sister Novitiate can replace her Autogun with one Sacred Banner.',
        'One Sister Novitiate can replace her Autogun with one Simulacrum Imperialis.',
        'Up to two Sisters Novitiate can each replace their Autogun with one Ministorum flamer.',
        'Any number of Sisters Novitiate can each replace both their Autogun and Close combat weapon with Novitiate melee weapons, retaining their Autopistol. A model cannot combine this replacement with a banner, simulacrum or flamer replacement, because each requires the same Autogun. Each model can take only one Autogun replacement.'
      ],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. Composition is fixed at one Superior and nine Sisters Novitiate. Sacred Banner and Simulacrum Imperialis abilities require their corresponding equipment. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'sororitas-rhino',
      name: 'Sororitas Rhino',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Sororitas Rhino', 'Dedicated Transport', 'Transport', 'Vehicle', 'Smoke', 'Frame', 'Imperium'],
      transportCapacity: { models: 12, keywords: ['Adepta Sororitas', 'Infantry'], excludedKeywords: ['Jump Pack'], excludedUnitIds: ['triumph-of-saint-katherine'] },
      summary: 'Transport for twelve Infantry with Firing Deck 2; repairs one wound at the start of your Command phase.',
      loadouts: [
        { role: 'Sororitas Rhino', gear: ['Storm bolter', 'Armoured tracks'] }
      ],
      profiles: [
        { model: 'Sororitas Rhino', stats: { M: '12', T: '9', SV: '3+', W: '10', LD: '7+', OC: '2', INV: '6+' }, base: 'No base (hull)', notes: '' }
      ],
      weapons: [
        { name: 'Storm bolter', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '2', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Rapid Fire 2'] }] },
        { name: 'Hunter-killer missile', type: 'ranged', profiles: [{ name: 'standard', range: '48', a: '1', skill: '2+', s: '14', ap: '-3', d: 'D6', abilities: ['One Shot'] }] },
        { name: 'Armoured tracks', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '6', ap: '0', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Self Repair', text: 'At the start of your Command phase, this model regains 1 lost wound.' },
        { name: 'Transport', text: 'This model has a transport capacity of 12 Adepta Sororitas Infantry models. It cannot transport Jump Pack models or the Triumph of Saint Katherine.' }
      ],
      specialRules: ['Deadly Demise D3', 'Firing Deck 2', 'Acts of Faith'],
      wargearRules: [
        'This model can also be equipped with one Hunter-killer missile.'
      ],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. The explicit faction v1.4 patch adds Frame. Army points remain sourced separately from MFM v1.6: 65 for the first three units and 75 from the fourth, unchanged.'
    },
    {
      id: 'triumph-of-saint-katherine',
      name: 'Triumph of Saint Katherine',
      models: 1,
      minModels: 1,
      maxModels: 1,
      legends: false,
      epicHero: true,
      keywords: ['Adepta Sororitas', 'Triumph of Saint Katherine', 'Character', 'Epic Hero', 'Grenades', 'Imperium', 'Infantry'],
      summary: 'Epic Hero Leader; selects two relic auras each battle round and sets start-of-your-turn Miracle dice to 6 while on the battlefield.',
      loadouts: [
        { role: 'Triumph of Saint Katherine', gear: ['Bolt pistols', 'Relic weapons'] }
      ],
      profiles: [
        { model: 'Triumph of Saint Katherine', stats: { M: '6', T: '3', SV: '3+', W: '18', LD: '6+', OC: '6', INV: '4+' }, base: '120x92mm', notes: '' }
      ],
      weapons: [
        { name: 'Bolt pistols', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '6', skill: '2+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Relic weapons', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '18', skill: '2+', s: '5', ap: '-2', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Relics of the Matriarchs', text: 'At the start of each battle round, select two of this model\'s six relic aura abilities. The selected abilities are active until the start of the next battle round; unselected relic auras are not active.' },
        { name: 'Solemn Procession', text: 'While this model is on the battlefield, each Miracle die you gain at the start of your turn has a value of 6 instead of being rolled.' },
        { name: 'Fiery Heart (Aura)', timing: ['movement', 'charge'], text: 'While this relic is active, friendly Adepta Sororitas units within 6 inches of this model add 2 inches to the Move characteristic of their models and add 1 to their Advance and Charge rolls.' },
        { name: 'Censer of the Sacred Rose (Aura)', timing: ['any'], text: 'While this relic is active, friendly Adepta Sororitas units within 6 inches of this model can re-roll Battle-shock tests.' },
        { name: 'Ebon Chalice (Aura)', timing: ['any'], text: 'While this relic is active, friendly Adepta Sororitas units within 6 inches of this model can perform up to two Acts of Faith per phase.' },
        { name: 'Argent Shroud (Aura)', text: 'While this relic is active, each time a model in a friendly Adepta Sororitas unit within 6 inches of this model makes a ranged attack, re-roll a Wound roll of 1.' },
        { name: 'Valorous Heart (Aura)', text: 'While this relic is active, models in friendly Adepta Sororitas units within 6 inches of this model have Feel No Pain 6+.' },
        { name: 'Bloody Rose (Aura)', text: 'While this relic is active, improve the Armour Penetration characteristic of melee weapons equipped by models in friendly Adepta Sororitas units within 6 inches of this model by 1.' },
        { name: 'Damaged: 1-6 wounds remaining', timing: ['round-start', 'shooting', 'fight'], text: 'While this model has 1-6 wounds remaining, halve the Attacks characteristics of all its weapons and it can have only one relic aura active instead of two.' },
        { name: 'Leader', text: 'This model can lead a Battle Sisters Squad or Crusaders.' }
      ],
      specialRules: ['Leader', 'Acts of Faith'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'The authoritative faction v1.4 Solemn Procession override applies to each Miracle die gained at the start of your turn while this model is on the battlefield, not at the start of the battle round. Relic selection still occurs at the start of the battle round. Crusaders are added to attachment targets. Army points remain sourced separately from MFM v1.6 and unchanged.'
    },
    {
      id: 'zephyrim-squad',
      name: 'Zephyrim Squad',
      models: 5,
      minModels: 5,
      maxModels: 10,
      repeatLoadoutIndex: 1,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Zephyrim Squad', 'Fly', 'Grenades', 'Imperium', 'Infantry', 'Jump Pack'],
      summary: 'Deep Strike; choose Sustained Hits 1 or Lethal Hits when selected to fight, gaining both after charging.',
      loadouts: [
        { role: 'Zephyrim Superior', gear: ['Bolt pistol', 'Power weapon'] },
        { role: 'Zephyrim', gear: ['Bolt pistol', 'Power weapon'] },
        { role: 'Zephyrim', gear: ['Bolt pistol', 'Power weapon'] },
        { role: 'Zephyrim', gear: ['Bolt pistol', 'Power weapon'] },
        { role: 'Zephyrim', gear: ['Bolt pistol', 'Power weapon'] }
      ],
      profiles: [
        { model: 'Zephyrim', stats: { M: '12', T: '3', SV: '3+', W: '1', LD: '7+', OC: '1', INV: '5+' }, base: '32mm', notes: 'Common unit profile, including the Zephyrim Superior.' }
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Plasma pistol', type: 'ranged', profiles: [
          { name: 'standard', range: '12', a: '1', skill: '3+', s: '7', ap: '-2', d: '1', abilities: ['Pistol'] },
          { name: 'supercharge', range: '12', a: '1', skill: '3+', s: '8', ap: '-3', d: '2', abilities: ['Hazardous', 'Pistol'] }
        ] },
        { name: 'Power weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '3+', s: '4', ap: '-2', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Embodied Prophecy', text: 'When this unit is selected to fight, choose Sustained Hits 1 or Lethal Hits. Until the end of the phase, melee weapons equipped by models in this unit have the selected ability. If this unit made a Charge move this turn, those weapons have both abilities until the end of the phase instead.' },
        { name: 'Sacred Banner', timing: ['movement', 'charge'], text: 'If this unit contains a model equipped with a Sacred Banner, you can re-roll Advance and Charge rolls made for this unit.' }
      ],
      specialRules: ['Deep Strike', 'Acts of Faith'],
      wargearRules: [
        'The Zephyrim Superior can also be equipped with one Sacred Banner.',
        'The Zephyrim Superior can replace her Bolt pistol with one Plasma pistol, independently of the Sacred Banner option.'
      ],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. Embodied Prophecy agrees with the authoritative faction v1.4 rule: choose one ability, or gain both after charging. Sacred Banner requires its corresponding equipment. Additional models repeat the Zephyrim loadout, never the Superior. Any source points conflicts defer to separate MFM v1.6 pricing: 75/150 for 5/10 models in the first two units and 85/160 from the third, unchanged.'
    },
    {
      id: 'retributor-squad',
      name: 'Retributor Squad',
      models: 5,
      minModels: 5,
      maxModels: 5,
      legends: false,
      epicHero: false,
      keywords: ['Adepta Sororitas', 'Grenades', 'Imperium', 'Infantry', 'Retributor Squad'],
      summary: 'Two cherubs grant Miracle dice after Acts of Faith; ranged attacks re-roll Hit and Wound rolls of 1, with +1 to Hit and Wound against units that destroyed an Adepta Sororitas unit this battle.',
      loadouts: [
        { role: 'Retributor Superior', gear: ['Bolt pistol', 'Boltgun', 'Close combat weapon'] },
        { role: 'Retributor', gear: ['Bolt pistol', 'Heavy bolter', 'Close combat weapon'] },
        { role: 'Retributor', gear: ['Bolt pistol', 'Heavy bolter', 'Close combat weapon'] },
        { role: 'Retributor', gear: ['Bolt pistol', 'Heavy bolter', 'Close combat weapon'] },
        { role: 'Retributor', gear: ['Bolt pistol', 'Heavy bolter', 'Close combat weapon'] }
      ],
      profiles: [
        { model: 'Retributor', stats: { M: '6', T: '3', SV: '3+', W: '1', LD: '7+', OC: '1', INV: '6+' }, base: '32mm', notes: 'Common unit profile, including the Retributor Superior.' }
      ],
      wargearRules: [
        'The Retributor Superior can replace her Boltgun with one of the following: Bolt pistol; Combi-weapon; Condemnor boltgun; Inferno pistol; Ministorum hand flamer; Plasma pistol. She retains her original Bolt pistol and Close combat weapon.',
        'The Retributor Superior can be equipped with one Chainsword or one Power weapon in addition to her other equipment, retaining her Close combat weapon.',
        'Any number of Retributors can each replace their Heavy bolter with one Ministorum heavy flamer or one Multi-melta.'
      ],
      weapons: [
        { name: 'Bolt pistol', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Pistol'] }] },
        { name: 'Boltgun', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Rapid Fire 1'] }] },
        { name: 'Combi-weapon', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '4+', s: '4', ap: '0', d: '1', abilities: ['Anti-Infantry 4+', 'Devastating Wounds', 'Rapid Fire 1'] }] },
        { name: 'Condemnor boltgun', type: 'ranged', profiles: [{ name: 'standard', range: '24', a: '1', skill: '3+', s: '4', ap: '0', d: '1', abilities: ['Anti-Psyker 2+', 'Devastating Wounds', 'Precision', 'Rapid Fire 1'] }] },
        { name: 'Heavy bolter', type: 'ranged', profiles: [{ name: 'standard', range: '36', a: '3', skill: '4+', s: '5', ap: '-1', d: '2', abilities: ['Heavy', 'Sustained Hits 1'] }] },
        { name: 'Inferno pistol', type: 'ranged', profiles: [{ name: 'standard', range: '6', a: '1', skill: '3+', s: '8', ap: '-4', d: 'D3', abilities: ['Melta 2', 'Pistol'] }] },
        { name: 'Ministorum hand flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '4', ap: '0', d: '1', abilities: ['Ignores Cover', 'Pistol', 'Torrent'] }] },
        { name: 'Ministorum heavy flamer', type: 'ranged', profiles: [{ name: 'standard', range: '12', a: 'D6', skill: 'N/A', s: '6', ap: '-1', d: '1', abilities: ['Ignores Cover', 'Torrent'] }] },
        { name: 'Multi-melta', type: 'ranged', profiles: [{ name: 'standard', range: '18', a: '2', skill: '4+', s: '9', ap: '-4', d: 'D6', abilities: ['Heavy', 'Melta 2'] }] },
        { name: 'Plasma pistol', type: 'ranged', profiles: [
          { name: 'standard', range: '12', a: '1', skill: '3+', s: '7', ap: '-2', d: '1', abilities: ['Pistol'] },
          { name: 'supercharge', range: '12', a: '1', skill: '3+', s: '8', ap: '-3', d: '2', abilities: ['Hazardous', 'Pistol'] }
        ] },
        { name: 'Chainsword', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '3', skill: '4+', s: '3', ap: '0', d: '1', abilities: [] }] },
        { name: 'Close combat weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '1', skill: '4+', s: '3', ap: '0', d: '1', abilities: [] }] },
        { name: 'Power weapon', type: 'melee', profiles: [{ name: 'standard', range: 'Melee', a: '2', skill: '4+', s: '4', ap: '-2', d: '1', abilities: [] }] }
      ],
      abilities: [
        { name: 'Cherubs', text: 'Twice per battle, after this unit performs an Act of Faith, you gain 1 Miracle die. This unit has two cherub tokens; remove one each time this ability is used.' },
        { name: 'Storm of Retribution', text: 'Each time a model in this unit makes a ranged attack, re-roll a Hit roll of 1 and re-roll a Wound roll of 1. If the target of that attack has destroyed one or more Adepta Sororitas units from your army this battle, add 1 to the Hit roll and add 1 to the Wound roll as well.' }
      ],
      specialRules: ['Acts of Faith'],
      datasheetSource: { label: 'User-supplied datasheet transcription', date: '2026-06-17', verification: 'Date and edition claimed by the supplied source; not independently verified.' },
      profileNotes: 'Profiles and rules follow the supplied transcription. Composition is fixed at one Retributor Superior at index 0 and four Retributors. Weapon definitions are independent copies of the Battle Sisters Squad profiles; Heavy bolter and Multi-melta retain BS 4+ and Heavy, with no Assault added. The two cherub tokens track the two uses of Cherubs and are not additional models. Army points remain sourced separately from MFM v1.6: 105 for the first two units and 115 from the third, with the existing 5-point surcharge per Multi-melta unchanged.'
    }
  ],
  detachments: [
    {
      id: 'chorus-of-condemnation',
      name: 'Chorus of Condemnation',
      dp: 1,
      categories: ['Reconnaissance'],
      tags: [],
      rule: 'In your Shooting phase, an Adepta Sororitas Infantry unit with Fly can condemn one visible enemy unit within 12 inches. Condemned enemies have +3 inches to their detection range.',
      enhancements: [
        {
          eligibilityKnown: true,
          eligibleUnitIds: ['canoness-with-jump-pack'],
          name: 'Clarion of Urgency',
          points: 15,
          restriction: 'Canoness with Jump Pack only.',
          effect: 'At the end of your opponent\'s Fight phase, if the bearer\'s unit is not within Engagement Range of enemy units, it can enter Strategic Reserves.'
        },
        {
          upgrade: true,
          eligibilityKnown: true,
          eligibleUnitIds: ['exorcist'],
          name: 'Symphonic Payload Upgrade',
          timing: ['shooting'],
          points: 10,
          restriction: 'Exorcist only.',
          effect: 'Re-roll the roll determining a weapon\'s Attacks characteristic.'
        }
      ],
      stratagems: [
        {
          name: 'Inspirational Battle Canticles',
          cp: 1,
          effect: 'At the start of the Command phase, select a friendly Adepta Sororitas Infantry unit with Fly or an Exorcist, then a friendly Battle-shocked Adepta Sororitas unit within 6 inches of it; that unit is no longer Battle-shocked.'
        },
        {
          name: 'Harmonised Exorcism',
          cp: 1,
          effect: 'In your Shooting phase, an Exorcist gains +1 to Hit rolls against a selected enemy unit that is visible to and within 9 inches of a friendly Adepta Sororitas Infantry unit with Fly.'
        },
        {
          name: 'Devastating Reprise',
          cp: 1,
          effect: 'In your Shooting phase, after an Exorcist shoots, select a friendly Adepta Sororitas Infantry unit with Fly. Its ranged attacks against an enemy unit hit by that Exorcist have Devastating Wounds; the enemy cannot be a Monster or Vehicle.'
        }
      ]
    },
    {
      id: 'sacred-champions',
      ruleTiming: ['shooting', 'fight'],
      name: 'Sacred Champions',
      dp: 1,
      categories: ['Take and Hold'],
      tags: ['REVEREND'],
      rule: 'Incompatible with other REVEREND detachments. Improve Celestian models\' Ballistic Skill and Weapon Skill characteristics by 1.',
      enhancements: [
        {
          upgrade: true,
          eligibilityKnown: true,
          eligibleUnitIds: ['celestian-sacresants'],
          name: 'Writ of Compunction Upgrade',
          points: 20,
          restriction: 'Celestian Sacresants only.',
          effect: 'Add 1 to the Objective Control characteristic of models in the upgraded unit.'
        },
        {
          name: 'Perfervid Haste',
          timing: ['movement'],
          points: 10,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'This unit has +1 inch to its Move characteristic.'
        }
      ],
      stratagems: [
        {
          name: 'Sanctified Blows',
          cp: 1,
          effect: 'In the Fight phase, when a Celestian Sacresants unit is selected to fight, add 1 to the Attacks and Strength characteristics of its melee weapons for that phase.'
        },
        {
          name: 'Faithful Fortitude',
          cp: 1,
          effect: 'In any phase, when a Celestian Sacresants unit suffers a mortal wound, it gains Feel No Pain 5+ against mortal wounds for that phase.'
        },
        {
          name: 'Unflinching Determination',
          cp: 1,
          effect: 'In your Movement phase, when a Celestian Sacresants unit is selected to Advance or Fall Back, its ranged weapons gain Assault until the end of the turn, and that move does not prevent it from shooting or charging that turn.'
        }
      ]
    },
    {
      id: 'sanctified-orators',
      name: 'Sanctified Orators',
      dp: 1,
      categories: ['Disruption'],
      tags: [],
      rule: 'Improve Adepta Sororitas Character models\' Leadership characteristic by 1. This detachment\'s enhancements do not count towards the army\'s enhancement total.',
      enhancementsExempt: true,
      enhancements: [
        {
          upgrade: true,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          excludedKeywords: ['Penitent'],
          name: 'Hagiomnifex Upgrade',
          timing: ['any'],
          points: 25,
          restriction: 'Adepta Sororitas Character only; excludes Penitent models.',
          effect: 'At the start of a phase, choose one rite for the bearer\'s unit, once per turn per unit: Rite of Revelation increases enemy detection range by 6 inches while the unit shoots; Sermon of Intolerance automatically passes Battle-shock tests; Catechism of Raging Fervour adds 1 inch to Move; Psalm of Righteous Smiting adds 1 to attacks\' Strength; Chorus of Repudiation subtracts 1 from incoming Wound rolls when the attack\'s Strength exceeds the target\'s Toughness.'
        }
      ],
      stratagems: []
    },
    {
      id: 'champions-of-faith',
      ruleTiming: ['command:own', 'movement', 'shooting', 'fight'],
      name: 'Champions of Faith',
      dp: 2,
      categories: ['Disruption'],
      tags: ['REVEREND'],
      rule: 'In your Command phase, select up to 3 Adepta Sororitas units, including embarked units, to be Righteous until your next Command phase. Righteous units add 1 inch to Move and improve Leadership by 1; Battle Sisters, Celestian Insidiants, Celestian Sacresants and Paragon units also improve Ballistic Skill and Weapon Skill by 1. Celestian Sacresants models gain +1 Objective Control while their unit is not Battle-shocked.',
      enhancements: [
        {
          name: 'Triptych of Judgement',
          timing: ['shooting', 'fight'],
          points: 15,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'The bearer\'s unit can ignore any or all modifiers to Ballistic Skill, Weapon Skill and Hit rolls.'
        },
        {
          name: 'Mark of Devotion',
          points: 30,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'Add 1 to the Attacks characteristic of the bearer\'s melee weapons; while Righteous, instead add 2 to Attacks and 1 to Damage.'
        },
        {
          name: 'Eyes of the Oracle',
          timing: ['shooting', 'fight'],
          points: 10,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'The bearer\'s weapons have Precision. Gain 1CP when the bearer\'s unit destroys an enemy Character.'
        },
        {
          name: 'Sanctified Amulet',
          points: 25,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'Enemy units arriving from Reserves cannot be set up within 12 inches of the bearer.'
        }
      ],
      stratagems: [
        {
          name: 'Shield of Denial',
          cp: 1,
          effect: 'In any phase, when a mortal wound is allocated to an Adepta Sororitas model, its unit gains Feel No Pain 6+ against mortal wounds for that phase, or 5+ if Righteous.'
        },
        {
          name: 'Suffer Not the Unfaithful',
          cp: 1,
          effect: 'In your Shooting phase or the Fight phase, select a Righteous Adepta Sororitas unit that has not yet shot or fought in that phase; choose Lethal Hits or Sustained Hits 1 for its attacks for that phase.'
        },
        {
          name: 'To the Heart of Heresy',
          cp: 1,
          effect: 'In the Fight phase, select an Adepta Sororitas unit that has not yet fought; add 1 to its melee weapons\' Strength for the turn. If Righteous, also improve their Armour Penetration by 1 for the phase.'
        },
        {
          name: 'Path of the Righteous',
          cp: 1,
          effect: 'In the Fight phase, select an Adepta Sororitas unit that has not yet fought; its Pile-in and Consolidation moves can be up to 6 inches for the turn. If Righteous, models need not finish closer to the closest enemy model but must finish as close as possible to the closest enemy unit.'
        },
        {
          name: 'Bastion of Faith',
          cp: 1,
          effect: 'In the Fight phase, when a Celestian Sacresants unit is targeted, subtract 1 from incoming Hit rolls against it for the phase. If Righteous, also apply this to another non-Battle-shocked Celestian Sacresants unit within 6 inches.'
        },
        {
          name: 'Indefatigable Dedication',
          cp: 1,
          effect: 'In your Movement phase, after an Adepta Sororitas unit Falls Back, it can shoot that turn; if Righteous, it can both shoot and charge that turn.'
        }
      ]
    },
    {
      id: 'army-of-faith',
      ruleTiming: ['any'],
      name: 'Army of Faith',
      dp: 2,
      categories: ['Take and Hold'],
      tags: [],
      rule: 'Sacred Rites: Each Adepta Sororitas unit in your army can perform up to two Acts of Faith per phase, instead of only one.',
      enhancements: [
        {
          name: 'Blade of Saint Ellynor',
          points: 15,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'Add 1 to the Strength and Armour Penetration characteristics of the bearer\'s melee weapons, and those weapons have Precision. Each time the bearer fights, if those attacks destroy one or more enemy models, you gain 1 Miracle die.'
        },
        {
          name: 'Divine Aspect',
          points: 5,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'In your Movement phase, you can select one enemy unit within 12 inches of the bearer; that unit must take a Battle-shock test. If that test is failed, you gain 1 Miracle die.'
        },
        {
          name: 'Litanies of Faith',
          points: 10,
          eligibilityKnown: true,
          eligibleKeywordsAny: ['CANONESS', 'PALATINE'],
          restriction: 'Canoness or Palatine model only.',
          effect: 'At the start of your Command phase, if the bearer is on the battlefield, take a Leadership test for it. If that test is passed, you gain 1 Miracle die.'
        },
        {
          name: 'Triptych of the Macharian Crusade',
          timing: ['shooting', 'fight'],
          points: 20,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'Each time the bearer uses an Act of Faith to substitute a saving throw, that saving throw is successful, irrespective of the value of the Miracle die used.'
        }
      ],
      stratagems: [
        {
          name: 'Shield of Faith',
          cp: 1,
          effect: 'Battle Tactic, any phase. WHEN: Any phase, just after an Adepta Sororitas unit from your army suffers a mortal wound. TARGET: That unit, or one friendly Adepta Sororitas Jump Pack unit within 3 inches of it. EFFECT: Until the end of the phase, models in your unit have Feel No Pain 5+ against mortal wounds. If you targeted an Adepta Sororitas Jump Pack unit, until the end of the phase, while a friendly Adepta Sororitas unit is within 3 inches of your unit, models in that unit also have Feel No Pain 5+ against mortal wounds.'
        },
        {
          name: 'Faith and Fury',
          cp: 1,
          effect: 'Battle Tactic, Fight phase. WHEN: Fight phase. TARGET: One Adepta Sororitas unit from your army that has not been selected to fight this phase. EFFECT: Until the end of the phase, melee weapons equipped by models in your unit have Lance. If your unit\'s attacks destroy one or more enemy models this phase, you gain 1 Miracle die.'
        },
        {
          name: 'Divine Guidance',
          cp: 1,
          effect: 'Battle Tactic, Shooting or Fight phase. WHEN: Your Shooting phase or the Fight phase. TARGET: One Adepta Sororitas unit from your army that has not been selected to shoot or fight this phase. EFFECT: Until the end of the phase, each time a model in your unit makes an attack, improve the Armour Penetration characteristic of that attack by 1. If those attacks destroy one or more enemy models, you gain 1 Miracle die.'
        },
        {
          name: 'Light of the Emperor',
          cp: 1,
          effect: 'Battle Tactic, Command phase. WHEN: Command phase. TARGET: One Adepta Sororitas unit from your army. EFFECT: Until the end of the turn, your unit is blessed. While a unit is blessed, it can ignore any or all modifiers to the characteristics of its models, to the Weapon Skill or Ballistic Skill of weapons equipped by its models, and to any roll or test made for it (excluding modifiers to saving throws). If your unit has the Jump Pack keyword, until the end of the turn, while a friendly Adepta Sororitas unit is within 3 inches of your unit, that friendly unit is also blessed.'
        },
        {
          name: 'Angelic Descent',
          cp: 1,
          effect: 'Strategic Ploy, Fight phase. WHEN: End of your opponent\'s Fight phase. TARGET: One Adepta Sororitas Jump Pack unit from your army. EFFECT: Remove your unit from the battlefield and place it into Strategic Reserves. RESTRICTIONS: You cannot select a unit that is within Engagement Range of one or more enemy units.'
        },
        {
          name: 'Blinding Radiance',
          cp: 1,
          effect: 'Strategic Ploy, Shooting or Fight phase. WHEN: Your opponent\'s Shooting phase or the Fight phase, just after an enemy unit has selected its targets. TARGET: One Adepta Sororitas unit from your army that was selected as the target of one or more of that unit\'s attacks, or one friendly Adepta Sororitas Jump Pack unit within 3 inches of such a unit. EFFECT: Until the end of the phase, each time an attack targets your unit, subtract 1 from the Hit roll. If you targeted an Adepta Sororitas Jump Pack unit, until the end of the phase, while a friendly Adepta Sororitas unit is within 3 inches of your unit, each time an attack targets that unit, subtract 1 from the Hit roll as well.'
        }
      ]
    },
    {
      id: 'bringers-of-flame',
      name: 'Bringers of Flame',
      dp: 2,
      categories: ['Priority Assets'],
      tags: [],
      rule: 'Fervent Purgation: Ranged weapons equipped by Adepta Sororitas models from your army have Assault, and each time such a weapon makes an attack that targets a unit within 6 inches, add 1 to the Strength characteristic of that attack.',
      enhancements: [
        {
          name: 'Fire and Fury',
          points: 30,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'While the bearer is leading a unit, add 1 to the Attacks characteristic of Torrent weapons equipped by models in that unit, and all other ranged weapons equipped by models in that unit have Sustained Hits 1.'
        },
        {
          name: 'Iron Surplice of Saint Istalela',
          points: 10,
          eligibilityKnown: true,
          eligibleKeywordsAny: ['CANONESS', 'PALATINE'],
          restriction: 'Canoness or Palatine model only.',
          effect: 'The bearer has a Save characteristic of 2+ and the Feel No Pain 5+ ability.'
        },
        {
          name: 'Manual of Saint Griselda',
          points: 20,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'At the start of your Command phase, you can discard up to 2 Miracle dice. Then add 1 Miracle die to your pool with a value equal to the sum of the discarded dice (maximum 6).'
        },
        {
          name: 'Righteous Rage',
          points: 15,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'Each time the bearer is selected to fight, you can first discard up to 3 Miracle dice. For each die discarded, until the end of the phase, add 1 to the Attacks and Strength characteristics of the bearer\'s melee weapons.'
        }
      ],
      stratagems: [
        {
          name: 'Blazing Ire',
          cp: 2,
          effect: 'Battle Tactic, Shooting phase. WHEN: Your opponent\'s Shooting phase, just after an enemy unit has shot. TARGET: One Adepta Sororitas Transport unit from your army that was selected as the target of one or more of that unit\'s attacks. EFFECT: One unit embarked within your Transport can disembark as if it were your Movement phase, then shoot as if it were your Shooting phase, but it can only target that enemy unit, and only if that unit is an eligible target.'
        },
        {
          name: 'Rites of Fire',
          cp: 1,
          effect: 'Battle Tactic, Shooting phase. WHEN: Your Shooting phase. TARGET: One Adepta Sororitas unit from your army that disembarked from a Transport this turn and has not been selected to shoot this phase. EFFECT: Until the end of the phase, each time a model in your unit makes a ranged attack that targets an enemy unit within 6 inches that is also within range of an objective marker, add 1 to the Wound roll. If those attacks destroy one or more enemy models, select one of those destroyed models; its unit must take a Battle-shock test.'
        },
        {
          name: 'Cleansing Flames',
          cp: 2,
          effect: 'Battle Tactic, Shooting phase. WHEN: Your Shooting phase. TARGET: One Adepta Sororitas unit from your army that has not been selected to shoot this phase. EFFECT: Until the end of the phase, Torrent weapons equipped by models in your unit have Devastating Wounds.'
        },
        {
          name: 'Righteous Blows',
          cp: 1,
          effect: 'Battle Tactic, Fight phase. WHEN: Fight phase. TARGET: One Adepta Sororitas unit from your army that has not been selected to fight this phase. EFFECT: Until the end of the phase, melee weapons equipped by models in your unit have Lethal Hits. If attacks made with those weapons destroy one or more enemy models this phase, select one of those destroyed models; its unit must take a Battle-shock test.'
        },
        {
          name: 'Shield of Aversion',
          cp: 1,
          effect: 'Battle Tactic, Shooting or Fight phase. WHEN: Your opponent\'s Shooting phase or the Fight phase, just after an enemy unit has selected its targets. TARGET: One Adepta Sororitas unit from your army that was selected as the target of one or more of that unit\'s attacks. EFFECT: Until the attacking unit has finished making its attacks, each time an attack targets your unit, worsen the Armour Penetration characteristic of that attack by 1.'
        },
        {
          name: 'Carry Forth the Faithful',
          cp: 1,
          effect: 'Strategic Ploy, Movement phase. WHEN: Your Movement phase, just before an Adepta Sororitas Transport model from your army Advances. TARGET: That Transport model. EFFECT: Until the end of the turn, you can re-roll Advance rolls made for it, and units can disembark from it even though it Advanced. Units that do so count as having made a Normal move and cannot declare a charge this turn.'
        }
      ]
    },
    {
      id: 'hallowed-martyrs',
      name: 'Hallowed Martyrs',
      dp: 3,
      categories: ['Take and Hold', 'Priority Assets'],
      tags: [],
      rule: 'The Blood of Martyrs: Each time an Adepta Sororitas model from your army makes an attack, if that model\'s unit is below its Starting Strength, add 1 to the Hit roll; if that unit is also Below Half-strength, add 1 to the Wound roll as well.',
      enhancements: [
        {
          name: 'Chaplet of Sacrifice',
          points: 25,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'At the end of your Command phase, if the bearer is on the battlefield, you can re-roll 1 Miracle die in your pool, keeping the new result. If the bearer\'s unit is below its Starting Strength, you can re-roll up to 3 Miracle dice this way instead.'
        },
        {
          name: 'Mantle of Ophelia',
          points: 20,
          eligibilityKnown: true,
          eligibleKeywordsAny: ['CANONESS', 'PALATINE'],
          restriction: 'Canoness or Palatine model only.',
          effect: 'Each time an attack is allocated to the bearer, change the Damage characteristic of that attack to 1.'
        },
        {
          name: 'Saintly Example',
          points: 10,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'When the bearer is destroyed, you gain D3 additional Miracle dice.'
        },
        {
          name: 'Through Suffering, Strength',
          points: 25,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'Add 1 to the Attacks, Strength and Damage characteristics of the bearer\'s melee weapons. If the bearer has lost one or more wounds, add 2 to those characteristics instead.'
        }
      ],
      stratagems: [
        {
          name: 'Righteous Vengeance',
          cp: 1,
          effect: 'Battle Tactic, Fight phase. WHEN: Fight phase. TARGET: One Adepta Sororitas unit from your army that has not been selected to fight this phase. EFFECT: Until the end of the phase, each time a model in your unit makes a melee attack, you can re-roll the Hit roll; if your unit is Below Half-strength, you can re-roll the Wound roll as well.'
        },
        {
          name: 'Divine Intervention',
          cp: 1,
          effect: 'Epic Deed, any phase. WHEN: Any phase. TARGET: One Adepta Sororitas Character unit from your army that was just destroyed. You can use this Stratagem on that unit even though it was just destroyed. EFFECT: You can discard 1-3 Miracle dice. At the end of the phase, set the last destroyed model from your unit back up as close as possible to where it was destroyed and not within Engagement Range of any enemy models. Roll one D3, adding 1 for each Miracle die discarded; that model is set up with that many wounds remaining (up to its starting wounds). RESTRICTIONS: You cannot target Saint Celestine, and you cannot target the same Character with this Stratagem more than once per battle.'
        },
        {
          name: 'Suffering and Sacrifice',
          cp: 1,
          effect: 'Strategic Ploy, Fight phase. WHEN: Start of the Fight phase. TARGET: One Adepta Sororitas Infantry or Adepta Sororitas Walker unit from your army. EFFECT: Until the end of the phase, each time an enemy model within Engagement Range of your unit selects targets, it must select your unit.'
        },
        {
          name: 'Sanctified Immolation',
          cp: 1,
          effect: 'Strategic Ploy, any phase. WHEN: Any phase. TARGET: One Adepta Sororitas Vehicle model from your army with the Deadly Demise ability that was just destroyed. You can use this Stratagem on that model even though it was just destroyed. EFFECT: Do not roll one D6 for that model\'s Deadly Demise ability; instead the mortal wounds are inflicted automatically.'
        },
        {
          name: 'Spirit of the Martyr',
          cp: 2,
          effect: 'Strategic Ploy, Fight phase. WHEN: Fight phase, just after an enemy unit has selected its targets. TARGET: One Adepta Sororitas unit from your army that was selected as the target of one or more of that unit\'s attacks. EFFECT: Until the end of the phase, each time a model in your unit is destroyed, if it has not fought this phase, do not remove it from play. The destroyed model can fight after the attacking unit has finished making its attacks, and is then removed from play.'
        },
        {
          name: 'Praise the Fallen',
          cp: 1,
          effect: 'Strategic Ploy, Shooting phase. WHEN: Your opponent\'s Shooting phase, just after an enemy unit has shot. TARGET: One Adepta Sororitas unit from your army that had one or more of its models destroyed as a result of that unit\'s attacks. EFFECT: Your unit can shoot as if it were your Shooting phase, but it can only target that enemy unit, and only if that unit is an eligible target.'
        }
      ]
    },
    {
      id: 'penitent-host',
      ruleTiming: ['command:own', 'movement', 'fight'],
      name: 'Penitent Host',
      dp: 2,
      categories: ['Purge the Foe'],
      tags: [],
      rule: 'Desperate for Redemption: At the start of your Command phase, you can select one of the following Vows of Atonement to be active for your army until the start of your next Command phase. You can only select each Vow of Atonement once per battle. The Path of the Penitent: Add 3 inches to the Move characteristic of Penitent models from your army. Absolution in Battle: Each time a unit from your army is selected to fight, if that unit made a Charge move this turn, until the end of the phase, add 1 to the Attacks and Strength characteristics of melee weapons equipped by Penitent models in that unit. Death Before Disgrace: Each time a Penitent model from your army is destroyed by a melee attack, if that model has not fought this phase, roll one D6. On a 2+, do not remove it from play; the destroyed model can fight after the attacking unit has finished making its attacks, and is then removed from play.',
      enhancements: [
        {
          eligibilityKnown: true,
          eligibleKeywordsAny: ['CANONESS', 'PALATINE', 'MINISTORUM PRIEST'],
          name: 'Catechism of Divine Penitence',
          points: 15,
          restriction: 'Canoness, Palatine or Ministorum Priest model only.',
          effect: 'The bearer gains the Penitent keyword and, during the Declare Battle Formations step, can be attached to a Repentia Squad unit.',
          note: 'Points conflict: supplied faction pack 20 versus MFM v1.6 at 15; v1.6 applies.',
          attachment: { role: 'Leader', targets: ['repentia-squad'] }
        },
        {
          name: 'Psalm of Righteous Judgement',
          points: 20,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character'],
          restriction: 'Adepta Sororitas model only.',
          effect: 'While the bearer is on the battlefield, each time an enemy unit is destroyed by a Penitent unit from your army, you can discard 1 Miracle die and then gain 1 Miracle die with a value of 6.',
          note: 'Points conflict: supplied faction pack 30 versus MFM v1.6 at 20; v1.6 applies.'
        },
        {
          name: 'Refrain of Enduring Faith',
          points: 15,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character', 'Penitent'],
          restriction: 'Penitent model only.',
          effect: 'While the bearer is leading a unit, models in that unit have a 5+ invulnerable save.',
          note: 'Points conflict: supplied faction pack 25 versus MFM v1.6 at 15; v1.6 applies.'
        },
        {
          name: 'Verse of Holy Piety',
          points: 15,
          eligibilityKnown: true,
          requiredKeywords: ['Adepta Sororitas', 'Character', 'Penitent'],
          restriction: 'Penitent model only.',
          effect: 'Once per battle, at the start of the battle round, select one Vow of Atonement. Until the start of the next battle round, that Vow is active for the bearer\'s unit in addition to any Vow active for your army, even if you have already selected that Vow this battle.',
          ruleNote: 'Timing conflict in the supplied rules: this enhancement refers to the start of the battle round, while Desperate for Redemption selects Vows at the start of your Command phase. Agree on the timing with your opponent before the game.'
        }
      ],
      stratagems: [
        {
          name: 'Purity of Suffering',
          cp: 1,
          effect: 'Battle Tactic, Shooting or Fight phase. WHEN: Your opponent\'s Shooting phase or the Fight phase, just after an enemy unit has selected its targets. TARGET: One Penitent unit from your army that was selected as the target of one or more of that unit\'s attacks. EFFECT: Until the end of the phase, Penitent models in your unit have the Feel No Pain 4+ ability.'
        },
        {
          name: 'Lash of Guilt',
          cp: 1,
          effect: 'Battle Tactic, Movement phase. WHEN: Your Movement phase, just before a Penitent unit from your army Advances. TARGET: That Penitent unit. EFFECT: Until the end of the turn, your unit is eligible to declare a charge in a turn in which it Advanced. If your unit has the Penitent Engines keyword, do not make an Advance roll for it; instead, until the end of the phase, add 6 inches to the Move characteristic of its models.'
        },
        {
          name: 'Passion of the Penitent',
          cp: 1,
          effect: 'Battle Tactic, Fight phase. WHEN: Fight phase. TARGET: One Penitent unit from your army that has not been selected to fight this phase. EFFECT: Until the end of the phase, each time a Penitent model in your unit makes a melee attack, an unmodified Hit roll of 5+ scores a Critical Hit.'
        },
        {
          name: 'Final Redemption',
          cp: 1,
          effect: 'Epic Deed, any phase. WHEN: Any phase. TARGET: One Penitent unit from your army that was just destroyed while it was within range of an objective marker you controlled. You can use this Stratagem on that unit even though it was just destroyed. EFFECT: That objective marker remains under your control, even if you have no models within range of it, until your opponent controls it at the start or end of any turn.'
        },
        {
          name: 'Devout Fanaticism',
          cp: 1,
          effect: 'Strategic Ploy, Shooting phase. WHEN: Your opponent\'s Shooting phase, just after an enemy unit has shot. TARGET: One Penitent unit from your army that was selected as the target of one or more of that unit\'s attacks. EFFECT: Roll one D6: your unit can be moved a distance in inches up to the result, but it must end that move as close as possible to the closest enemy unit (excluding Aircraft). When doing so, those models can be moved within Engagement Range of enemy units.'
        },
        {
          name: 'Boundless Zeal',
          cp: 1,
          effect: 'Strategic Ploy, Movement phase. WHEN: Your Movement phase, just after an Adepta Sororitas unit from your army Falls Back. TARGET: That unit. EFFECT: Until the end of the turn, your unit is eligible to shoot or declare a charge in a turn in which it Fell Back. If your unit has the Penitent keyword, it is instead eligible to shoot and declare a charge in a turn in which it Fell Back.'
        }
      ]
    }
  ]
};

(function () {
  var i;
  var j;
  var detachment;
  var enhancement;
  for (i = 0; i < FACTION_DATA.detachments.length; i += 1) {
    detachment = FACTION_DATA.detachments[i];
    for (j = 0; j < detachment.enhancements.length; j += 1) {
      enhancement = detachment.enhancements[j];
      enhancement.id = detachment.id + '--' + enhancement.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      enhancement.detachmentId = detachment.id;
      enhancement.upgrade = enhancement.upgrade === true;
      enhancement.exempt = detachment.enhancementsExempt === true;
      enhancement.eligibilityKnown = enhancement.eligibilityKnown === true;
    }
  }
}());
