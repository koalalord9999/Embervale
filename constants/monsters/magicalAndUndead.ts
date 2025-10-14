import { Monster, MonsterType, SkillName } from '../../types';

export const magicalAndUndead: Monster[] = [
    {
        id: 'wizard', name: 'Wizard', level: 13, maxHp: 30, attack: 1, magic: 15,
        stabDefence: 5, slashDefence: 5, crushDefence: 5, rangedDefence: 8, magicDefence: 12,
        iconUrl: 'https://api.iconify.design/game-icons:wizard-face.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'wizard_hat', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'wizard_robe_top', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'wizard_robe_skirt', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: "7/100", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: "1/4", minQuantity: 10, maxQuantity: 25 },
            { itemId: 'aqua_rune', chance: "1/5", minQuantity: 8, maxQuantity: 20 },
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 8, maxQuantity: 20 },
            { itemId: 'binding_rune', chance: "3/20", minQuantity: 5, maxQuantity: 15 },
        ],
        types: [MonsterType.Humanoid], attackSpeed: 4, respawnTime: 60000, aggressive: false, attackStyle: 'magic',
    },
    {
        id: 'cave_slime', name: 'Cave Slime', level: 3, maxHp: 10, attack: 2,
        stabDefence: 3, slashDefence: 3, crushDefence: 1, rangedDefence: 5, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:gooey-daemon.svg',
        mainDrops: [
            { itemId: 'cave_slime_globule', chance: "1/2", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'aqua_rune', chance: "1/10", minQuantity: 1, maxQuantity: 3 },
        ],
        types: [MonsterType.Elemental], attackSpeed: 5, respawnTime: 25000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'stone_golem', name: 'Stone Golem', level: 50, maxHp: 100, attack: 28,
        stabDefence: 30, slashDefence: 30, crushDefence: 10, rangedDefence: 40, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:rock-golem.svg',
        guaranteedDrops: [
            { itemId: 'iron_ore', minQuantity: 5, maxQuantity: 10 },
            { itemId: 'coal', minQuantity: 10, maxQuantity: 20 },
            { itemId: 'stone_rune', minQuantity: 30, maxQuantity: 50 },
        ],
        mainDrops: [
            { itemId: 'golem_core', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'golem_core_shard', chance: "3/20", minQuantity: 1, maxQuantity: 10 },
        ],
        types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 6, respawnTime: 120000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'harpy', name: 'Harpy', level: 22, maxHp: 35, attack: 1, ranged: 20,
        stabDefence: 12, slashDefence: 12, crushDefence: 10, rangedDefence: 15, magicDefence: 5,
        iconUrl: 'https://api.iconify.design/game-icons:harpy.svg',
        guaranteedDrops: [
            { itemId: 'feathers', minQuantity: 10, maxQuantity: 30 },
            { itemId: 'gust_rune', minQuantity: 10, maxQuantity: 20 },
        ],
        mainDrops: [
            { itemId: 'harpy_talon', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'harpy_feather', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 3, respawnTime: 40000, attackStyle: 'ranged', aggressive: true, alwaysAggressive: true
    },
    {
        id: 'fey_sprite', name: 'Fey Sprite', level: 20, maxHp: 30, attack: 1, ranged: 15,
        stabDefence: 18, slashDefence: 18, crushDefence: 18, rangedDefence: 25, magicDefence: 25,
        iconUrl: 'https://api.iconify.design/game-icons:fairy.svg',
        mainDrops: [
            { itemId: 'fey_dust', chance: "2/5", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'enchanted_bark', chance: "3/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: "1/5", minQuantity: 2, maxQuantity: 6 },
            { itemId: 'binding_rune', chance: "3/10", minQuantity: 5, maxQuantity: 15 },
        ],
        tertiaryDrops: [
            { itemId: 'aqua_talisman', chance: 1/32, minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Elemental], attackSpeed: 3, respawnTime: 45000, attackStyle: 'ranged', aggressive: false
    },
    {
        id: 'swamp_horror', name: 'Swamp Horror', level: 28, maxHp: 60, attack: 22,
        stabDefence: 20, slashDefence: 20, crushDefence: 25, rangedDefence: 15, magicDefence: 10,
        iconUrl: 'https://api.iconify.design/game-icons:lizardman.svg',
        mainDrops: [
            { itemId: 'uncut_emerald', chance: "3/100", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'yew_logs', chance: "1/6", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'stone_rune', chance: "2/5", minQuantity: 10, maxQuantity: 25 },
            { itemId: 'hex_rune', chance: "7/20", minQuantity: 8, maxQuantity: 18 },
            { itemId: 'astral_rune', chance: "1/10", minQuantity: 3, maxQuantity: 7 },
            { itemId: 'affinity_hat', chance: "1/100", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 5, respawnTime: 60000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'shipwreck_specter', name: 'Shipwreck Specter', level: 39, maxHp: 75, attack: 1, magic: 38,
        stabDefence: 32, slashDefence: 32, crushDefence: 32, rangedDefence: 40, magicDefence: 40,
        iconUrl: 'https://api.iconify.design/game-icons:ghost.svg',
        mainDrops: [
            { itemId: 'eldritch_pearl', chance: "1/40", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'driftwood_logs', chance: "3/20", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'nexus_rune', chance: "1/2", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'anima_rune', chance: "3/20", minQuantity: 2, maxQuantity: 5 },
            { itemId: 'aether_rune', chance: "1/50", minQuantity: 1, maxQuantity: 2 },
        ],
        types: [MonsterType.Undead], attackSpeed: 4, respawnTime: 80000, aggressive: true, alwaysAggressive: true, attackStyle: 'magic',
    },
    {
        id: 'siren', name: 'Siren', level: 44, maxHp: 90, attack: 1, ranged: 55,
        stabDefence: 30, slashDefence: 30, crushDefence: 30, rangedDefence: 35, magicDefence: 35,
        iconUrl: 'https://api.iconify.design/game-icons:siren.svg',
        guaranteedDrops: [
            { itemId: 'sirens_hair', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'aqua_rune', minQuantity: 30, maxQuantity: 50 },
        ],
        mainDrops: [
            { itemId: 'eldritch_pearl', chance: "3/100", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'astral_rune', chance: "1/5", minQuantity: 5, maxQuantity: 12 },
            { itemId: 'anima_rune', chance: "3/25", minQuantity: 3, maxQuantity: 8 },
            { itemId: 'affinity_bottoms', chance: "1/100", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'astral_talisman', chance: "16/625", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Humanoid], attackSpeed: 3, respawnTime: 240000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged',
        specialAttacks: [{ name: 'Deafening Shriek', chance: 0.2, effect: 'damage_multiplier', value: 1.5 }],
        elementalWeakness: 'earth',
    },
    {
        id: 'magma_imp', name: 'Magma Imp', level: 43, maxHp: 60, attack: 1, ranged: 50,
        stabDefence: 25, slashDefence: 25, crushDefence: 25, rangedDefence: 30, magicDefence: 30,
        iconUrl: 'https://api.iconify.design/game-icons:imp.svg',
        guaranteedDrops: [
            { itemId: 'ember_rune', minQuantity: 40, maxQuantity: 80 },
        ],
        mainDrops: [
            { itemId: 'brimstone', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'flux_rune', chance: "2/5", minQuantity: 15, maxQuantity: 30 },
        ],
        types: [MonsterType.Demon, MonsterType.Elemental], attackSpeed: 2, respawnTime: 90000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged'
    },
    // New Verdant Fields Monsters
    {
        id: 'unicorn', name: 'Unicorn', level: 20, maxHp: 40, attack: 10, magic: 15,
        stabDefence: 15, slashDefence: 15, crushDefence: 15, rangedDefence: 20, magicDefence: 25,
        iconUrl: 'https://api.iconify.design/game-icons:unicorn.svg',
        guaranteedDrops: [
            { itemId: 'unicorn_horn', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'verdant_rune', chance: "3/20", minQuantity: 3, maxQuantity: 8 },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 1/16, minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 300000, aggressive: false, attackStyle: 'magic',
    },
    {
        id: 'forest_spirit', name: 'Forest Spirit', level: 16, maxHp: 30, attack: 1, magic: 14,
        stabDefence: 20, slashDefence: 20, crushDefence: 20, rangedDefence: 25, magicDefence: 30,
        iconUrl: 'https://api.iconify.design/game-icons:tree-face.svg',
        mainDrops: [
            { itemId: 'fey_dust', chance: "1/4", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'enchanted_bark', chance: "2/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: "1/4", minQuantity: 5, maxQuantity: 10 },
        ],
        tertiaryDrops: [
            { itemId: 'aqua_talisman', chance: 1/32, minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Elemental], attackSpeed: 4, respawnTime: 40000, aggressive: false, attackStyle: 'magic',
    },
    {
        id: 'treant_sapling', name: 'Treant Sapling', level: 17, maxHp: 38, attack: 15,
        stabDefence: 5, slashDefence: 20, crushDefence: 20, rangedDefence: 10, magicDefence: 5,
        iconUrl: 'https://api.iconify.design/game-icons:evil-tree.svg',
        guaranteedDrops: [
            { itemId: 'willow_logs', minQuantity: 1, maxQuantity: 3 },
        ],
        mainDrops: [
            { itemId: 'enchanted_bark', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bloodroot_tendril', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: "9/50", minQuantity: 4, maxQuantity: 8 },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 1/32, minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Beast], attackSpeed: 6, respawnTime: 50000, aggressive: true, attackStyle: 'crush',
    },
    // Salt Flats Monsters
    {
        id: 'brine_elemental', name: 'Brine Elemental', level: 42, maxHp: 90, attack: 1, magic: 40,
        stabDefence: 30, slashDefence: 30, crushDefence: 30, rangedDefence: 45, magicDefence: 40,
        iconUrl: 'https://api.iconify.design/game-icons:water-splash.svg',
        guaranteedDrops: [
            { itemId: 'aqua_rune', minQuantity: 40, maxQuantity: 80 },
        ],
        mainDrops: [
            { itemId: 'brine_crystal', chance: "1/20", minQuantity: 1, maxQuantity: 2 },
        ],
        types: [MonsterType.Elemental], attackSpeed: 4, respawnTime: 75000, aggressive: true, alwaysAggressive: true, attackStyle: 'magic'
    },
    {
        id: 'salt_cryst_golem', name: 'Salt-cryst Golem', level: 37, maxHp: 80, attack: 30,
        stabDefence: 40, slashDefence: 20, crushDefence: 40, rangedDefence: 30, magicDefence: 15,
        iconUrl: 'https://api.iconify.design/game-icons:rock-golem.svg',
        guaranteedDrops: [
            { itemId: 'rock_salt', minQuantity: 3, maxQuantity: 8 },
        ],
        mainDrops: [
            { itemId: 'uncut_diamond', chance: "1/200", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 6, respawnTime: 90000, aggressive: false, attackStyle: 'crush'
    },
    {
        id: 'mirage_weaver', name: 'Mirage Weaver', level: 41, maxHp: 60, attack: 1, magic: 45,
        stabDefence: 10, slashDefence: 10, crushDefence: 10, rangedDefence: 30, magicDefence: 50,
        iconUrl: 'https://api.iconify.design/game-icons:glowing-artifact.svg',
        guaranteedDrops: [
            { itemId: 'gust_rune', minQuantity: 20, maxQuantity: 50 },
        ],
        mainDrops: [
            { itemId: 'fey_dust', chance: "1/10", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'astral_rune', chance: "3/10", minQuantity: 5, maxQuantity: 15 },
        ],
        types: [MonsterType.Elemental], attackSpeed: 3, respawnTime: 60000, aggressive: true, attackStyle: 'magic'
    },
    {
        id: 'salt_wraith', name: 'Salt Wraith', level: 45, maxHp: 100, attack: 1, magic: 48,
        stabDefence: 25, slashDefence: 25, crushDefence: 25, rangedDefence: 40, magicDefence: 45,
        iconUrl: 'https://api.iconify.design/game-icons:ghost-ally.svg',
        guaranteedDrops: [
            { itemId: 'nexus_rune', minQuantity: 15, maxQuantity: 30 },
        ],
        mainDrops: [
            { itemId: 'consecrated_dust', chance: "3/10", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Undead], attackSpeed: 4, respawnTime: 120000, aggressive: true, attackStyle: 'magic'
    },
    // New Crystalline Isles Monsters
    {
        id: 'shard_golem', name: 'Shard Golem', level: 45, maxHp: 110, attack: 35,
        stabDefence: 50, slashDefence: 50, crushDefence: 20, rangedDefence: 60, magicDefence: 10,
        iconUrl: 'https://api.iconify.design/game-icons:ice-golem.svg',
        guaranteedDrops: [
            { itemId: 'crystal_shard', minQuantity: 2, maxQuantity: 5 },
        ],
        mainDrops: [
            { itemId: 'resonating_crystal', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 6, respawnTime: 100000, aggressive: false, attackStyle: 'crush'
    },
    // --- Magus Spire Floor 1 ---
    {
        id: 'mana_wisp', name: 'Mana Wisp', level: 54, maxHp: 60, attack: 1, magic: 45,
        stabDefence: 30, slashDefence: 30, crushDefence: 30, rangedDefence: 5, magicDefence: 10, customMaxHit: 10,
        iconUrl: 'https://api.iconify.design/game-icons:glowing-artifact.svg',
        guaranteedDrops: [{ itemId: 'ashes', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { itemId: 'gust_rune', chance: '1/2', minQuantity: 10, maxQuantity: 25 },
            { itemId: 'aqua_rune', chance: '1/2', minQuantity: 10, maxQuantity: 25 },
            { itemId: 'cooked_trout', chance: '1/4', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'coal', chance: '1/8', minQuantity: 5, maxQuantity: 10, noted: true },
            { itemId: 'mystic_page', chance: '1/20', minQuantity: 1, maxQuantity: 2 }
        ],
        types: [MonsterType.Elemental], attackSpeed: 4, respawnTime: 20000, aggressive: true, attackStyle: 'magic',
    },
    {
        id: 'arcane_familiar', name: 'Arcane Familiar', level: 60, maxHp: 75, attack: 1, magic: 50,
        stabDefence: 40, slashDefence: 40, crushDefence: 40, rangedDefence: 10, magicDefence: 15, customMaxHit: 12,
        iconUrl: 'https://api.iconify.design/game-icons:cat.svg',
        guaranteedDrops: [{ itemId: 'ashes', minQuantity: 1, maxQuantity: 2 }],
        mainDrops: [
            { itemId: 'stone_rune', chance: '1/2', minQuantity: 10, maxQuantity: 20 },
            { itemId: 'ember_rune', chance: '1/2', minQuantity: 10, maxQuantity: 20 },
            { itemId: 'binding_rune', chance: '1/3', minQuantity: 15, maxQuantity: 30 },
            { itemId: 'flux_rune', chance: '1/6', minQuantity: 5, maxQuantity: 10 },
            { itemId: 'cooked_pike', chance: '1/4', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'iron_ore', chance: '1/8', minQuantity: 8, maxQuantity: 15, noted: true },
            { itemId: 'mystic_page', chance: '1/15', minQuantity: 2, maxQuantity: 5 },
            { tableId: 'herb_table', chance: '1/12', minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Elemental], attackSpeed: 4, respawnTime: 25000, aggressive: true, attackStyle: 'magic',
    },
    {
        id: 'lesser_crystal_construct', name: 'Lesser Crystal Construct', level: 65, maxHp: 85, attack: 1, magic: 55,
        stabDefence: 45, slashDefence: 45, crushDefence: 45, rangedDefence: 15, magicDefence: 20, customMaxHit: 13,
        iconUrl: 'https://api.iconify.design/game-icons:ice-golem.svg',
        guaranteedDrops: [{ itemId: 'crystal_shard', minQuantity: 1, maxQuantity: 3 }],
        mainDrops: [
            { itemId: 'uncut_sapphire', chance: '1/16', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_emerald', chance: '1/24', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'coal', chance: '1/5', minQuantity: 10, maxQuantity: 20, noted: true },
            { itemId: 'silver_ore', chance: '1/10', minQuantity: 5, maxQuantity: 10, noted: true },
            { itemId: 'nexus_rune', chance: '1/4', minQuantity: 5, maxQuantity: 15 },
            { itemId: 'passage_rune', chance: '1/4', minQuantity: 5, maxQuantity: 15 },
            { itemId: 'cooked_eel', chance: '1/5', minQuantity: 1, maxQuantity: 2 }
        ],
        types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 5, respawnTime: 30000, aggressive: true, attackStyle: 'magic',
    },
    {
        id: 'spire_sentry', name: 'Spire Sentry', level: 70, maxHp: 90, attack: 1, magic: 60,
        stabDefence: 50, slashDefence: 50, crushDefence: 50, rangedDefence: 20, magicDefence: 25, customMaxHit: 14,
        iconUrl: 'https://api.iconify.design/game-icons:eye-of-horus.svg',
        mainDrops: [
            { itemId: 'astral_rune', chance: '1/3', minQuantity: 5, maxQuantity: 10 },
            { itemId: 'verdant_rune', chance: '1/8', minQuantity: 3, maxQuantity: 7 },
            { itemId: 'anima_rune', chance: '1/12', minQuantity: 2, maxQuantity: 5 },
            { itemId: 'cooked_tuna', chance: '1/5', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mystic_page', chance: '1/5', minQuantity: 5, maxQuantity: 10, noted: true },
            { itemId: 'mithril_ore', chance: '1/20', minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'tome_of_warding', chance: '1/128', minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Elemental], attackSpeed: 3, respawnTime: 35000, aggressive: true, attackStyle: 'magic',
    },
    // --- Magus Spire Floor 2 ---
    {
        id: 'crystalline_spider', name: 'Crystalline Spider', level: 62, maxHp: 70, attack: 1, magic: 52,
        stabDefence: 42, slashDefence: 42, crushDefence: 42, rangedDefence: 12, magicDefence: 18, customMaxHit: 13,
        iconUrl: 'https://api.iconify.design/game-icons:spider-alt.svg',
        guaranteedDrops: [{ itemId: 'spider_silk', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { itemId: 'crystal_shard', chance: '1/2', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'astral_rune', chance: '1/5', minQuantity: 3, maxQuantity: 8 },
            { itemId: 'rune_essence', chance: '1/3', minQuantity: 10, maxQuantity: 25, noted: true },
            { itemId: 'cooked_tuna', chance: '1/4', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'runic-dagger', chance: '1/64', minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Beast, MonsterType.Elemental], attackSpeed: 4, respawnTime: 28000, aggressive: true, attackStyle: 'magic',
    },
    {
        id: 'runic_guardian', name: 'Runic Guardian', level: 72, maxHp: 95, attack: 1, magic: 62,
        stabDefence: 55, slashDefence: 55, crushDefence: 55, rangedDefence: 22, magicDefence: 28, customMaxHit: 15,
        iconUrl: 'https://api.iconify.design/game-icons:robot-golem.svg',
        guaranteedDrops: [{ itemId: 'binding_rune', minQuantity: 15, maxQuantity: 30 }],
        mainDrops: [
            { itemId: 'mithril_bar', chance: '1/10', minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'flux_rune', chance: '1/5', minQuantity: 5, maxQuantity: 12 },
            { itemId: 'rune_essence', chance: '1/2', minQuantity: 20, maxQuantity: 40, noted: true },
            { itemId: 'cooked_lobster', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_mace', chance: '1/128', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_full_helm', chance: '1/64', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'affinity_gloves', chance: '1/128', minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 5, respawnTime: 32000, aggressive: true, attackStyle: 'magic',
    },
    {
        id: 'greater_mana_wisp', name: 'Greater Mana Wisp', level: 76, maxHp: 110, attack: 1, magic: 65,
        stabDefence: 60, slashDefence: 60, crushDefence: 60, rangedDefence: 25, magicDefence: 30, customMaxHit: 16,
        iconUrl: 'https://api.iconify.design/game-icons:glowing-artifact.svg',
        guaranteedDrops: [{ itemId: 'ashes', minQuantity: 1, maxQuantity: 3 }],
        mainDrops: [
            { itemId: 'flux_rune', chance: '1/2', minQuantity: 10, maxQuantity: 25 },
            { itemId: 'rune_essence', chance: '1/1', minQuantity: 30, maxQuantity: 60, noted: true },
            { itemId: 'cooked_lobster', chance: '1/3', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mystic_page', chance: '1/4', minQuantity: 8, maxQuantity: 15, noted: true },
            { itemId: 'affinity_hat', chance: '1/128', minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Elemental], attackSpeed: 4, respawnTime: 40000, aggressive: true, attackStyle: 'magic',
    },
    // --- Magus Spire Floor 3 ---
    {
        id: 'enchanted_tome', name: 'Enchanted Tome', level: 74, maxHp: 80, attack: 1, magic: 64,
        stabDefence: 58, slashDefence: 58, crushDefence: 58, rangedDefence: 24, magicDefence: 29, customMaxHit: 15,
        iconUrl: 'https://api.iconify.design/game-icons:book-cover.svg',
        guaranteedDrops: [{ itemId: 'mystic_page', minQuantity: 10, maxQuantity: 20 }],
        mainDrops: [
            { itemId: 'verdant_rune', chance: '1/4', minQuantity: 10, maxQuantity: 20 },
            { itemId: 'hex_rune', chance: '1/4', minQuantity: 10, maxQuantity: 20 },
            { itemId: 'cooked_swordfish', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'tome_of_focus', chance: '1/128', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sapphire_amulet', chance: '1/64', minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Elemental], attackSpeed: 3, respawnTime: 34000, aggressive: true, attackStyle: 'magic',
        specialAttacks: [{ name: 'Mana Siphon', chance: 0.2, effect: 'stat_drain', skill: SkillName.Magic, value: -2 }],
    },
    {
        id: 'spire_spellweaver', name: 'Spire Spellweaver', level: 80, maxHp: 100, attack: 1, magic: 70,
        stabDefence: 65, slashDefence: 65, crushDefence: 65, rangedDefence: 28, magicDefence: 32, customMaxHit: 16,
        iconUrl: 'https://api.iconify.design/game-icons:wizard-face.svg',
        guaranteedDrops: [{ itemId: 'bones', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { tableId: 'herb_table', chance: '1/5', minQuantity: 2, maxQuantity: 3, noted: true },
            { itemId: 'affinity_top', chance: '1/128', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'affinity_bottoms', chance: '1/128', minQuantity: 1, maxQuantity: 1 },
            { tableId: 'robes_of_power_table', chance: '1/512', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'emerald_amulet', chance: '1/64', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cooked_swordfish', chance: '1/3', minQuantity: 1, maxQuantity: 2 }
        ],
        types: [MonsterType.Undead, MonsterType.Elemental], attackSpeed: 4, respawnTime: 42000, aggressive: true, attackStyle: 'magic',
        specialAttacks: [{ name: 'Weakening Curse', chance: 0.25, effect: 'stat_drain', skill: SkillName.Defence, value: -3 }],
    },
    {
        id: 'greater_crystal_construct', name: 'Greater Crystal Construct', level: 82, maxHp: 120, attack: 1, magic: 72,
        stabDefence: 70, slashDefence: 70, crushDefence: 70, rangedDefence: 30, magicDefence: 35, customMaxHit: 16,
        iconUrl: 'https://api.iconify.design/game-icons:ice-golem.svg',
        guaranteedDrops: [{ itemId: 'crystal_shard', minQuantity: 2, maxQuantity: 5 }],
        mainDrops: [
            { itemId: 'uncut_ruby', chance: '1/20', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_diamond', chance: '1/40', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_ore', chance: '1/8', minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'rune_essence', chance: '1/1', minQuantity: 50, maxQuantity: 100, noted: true },
            { itemId: 'cooked_shark', chance: '1/4', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_dagger', chance: '1/256', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ruby_amulet', chance: '1/64', minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 5, respawnTime: 45000, aggressive: true, attackStyle: 'magic',
        specialAttacks: [{ name: 'Disrupting Pulse', chance: 0.2, effect: 'stat_drain', skill: SkillName.Attack, value: -3 }],
    },
    // --- Magus Spire Floor 4 ---
    {
        id: 'arcane_elemental', name: 'Arcane Elemental', level: 90, maxHp: 120, attack: 1, magic: 80,
        stabDefence: 80, slashDefence: 80, crushDefence: 80, rangedDefence: 38, magicDefence: 42, customMaxHit: 18,
        iconUrl: 'https://api.iconify.design/game-icons:swirl-ring.svg',
        guaranteedDrops: [{ itemId: 'anima_rune', minQuantity: 5, maxQuantity: 10 }, { itemId: 'aether_rune', minQuantity: 5, maxQuantity: 10 }],
        mainDrops: [
            { itemId: 'resonating_crystal', chance: '1/10', minQuantity: 1, maxQuantity: 1 },
            { tableId: 'robes_of_power_table', chance: '1/256', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'diamond_amulet', chance: '1/128', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cooked_shark', chance: '1/2', minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'runic_bar', chance: '1/20', minQuantity: 1, maxQuantity: 2, noted: true }
        ],
        types: [MonsterType.Elemental], attackSpeed: 4, respawnTime: 50000, aggressive: true, attackStyle: 'magic',
        specialAttacks: [{ name: 'Energy Surge', chance: 0.2, effect: 'damage_multiplier', value: 1.5 }],
    },
    {
        id: 'spire_justicar', name: 'Spire Justicar', level: 95, maxHp: 140, attack: 1, magic: 85,
        stabDefence: 90, slashDefence: 90, crushDefence: 90, rangedDefence: 40, magicDefence: 45, customMaxHit: 19,
        iconUrl: 'https://api.iconify.design/game-icons:robot-golem.svg',
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }, { itemId: 'passage_rune', minQuantity: 10, maxQuantity: 20 }],
        mainDrops: [
            { itemId: 'runic_bar', chance: '1/15', minQuantity: 1, maxQuantity: 2, noted: true },
            { tableId: 'robes_of_power_table', chance: '1/200', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'tome_of_power', chance: '1/128', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cooked_shark', chance: '1/1', minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'mystic_page', chance: '1/2', minQuantity: 20, maxQuantity: 40, noted: true }
        ],
        types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 5, respawnTime: 55000, aggressive: true, attackStyle: 'magic',
        specialAttacks: [{ name: 'Judgment', chance: 0.25, effect: 'stat_drain_multi', skills: [{ skill: SkillName.Attack, value: -2 }, { skill: SkillName.Strength, value: -2 }] }],
    },
    {
        id: 'crystal_hydra', name: 'Crystal Hydra', level: 100, maxHp: 150, attack: 1, magic: 90,
        stabDefence: 100, slashDefence: 100, crushDefence: 100, rangedDefence: 45, magicDefence: 50, customMaxHit: 20,
        iconUrl: 'https://api.iconify.design/game-icons:hydra.svg',
        guaranteedDrops: [
            { itemId: 'dragon_bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'crystal_shard', minQuantity: 5, maxQuantity: 10 },
        ],
        mainDrops: [
            { itemId: 'aether_rune', chance: '1/3', minQuantity: 15, maxQuantity: 30 },
            { tableId: 'gem_table', chance: '1/8', minQuantity: 1, maxQuantity: 1, noted: true },
            { tableId: 'robes_of_power_table', chance: '1/128', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'tome_of_the_arcane', chance: '1/256', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: '1/8', minQuantity: 2, maxQuantity: 4, noted: true },
            { itemId: 'cooked_shark', chance: '1/1', minQuantity: 2, maxQuantity: 4, noted: true }
        ],
        types: [MonsterType.Beast, MonsterType.Elemental], attackSpeed: 4, respawnTime: 60000, aggressive: true, attackStyle: 'magic',
        specialAttacks: [{ name: 'Shattering Roar', chance: 0.3, effect: 'stat_drain_multi', skills: [{ skill: SkillName.Defence, value: -3 }, { skill: SkillName.Magic, value: -3 }] }],
    },
        {
        id: 'sunken_zombie', name: 'Sunken Zombie', level: 50, maxHp: 65, attack: 45,
        stabDefence: 10, slashDefence: 10, crushDefence: 5, rangedDefence: 15, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:shambling-zombie.svg',
        guaranteedDrops: [{ itemId: 'bones', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { itemId: 'grimy_coin_pouch', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'fishing_bait', chance: "1/4", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'runic_bar', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Undead], attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'crush'
    },
    {
        id: 'deep_lurker', name: 'Deep Lurker', level: 51, maxHp: 70, attack: 45,
        stabDefence: 30, slashDefence: 35, crushDefence: 32, rangedDefence: 25, magicDefence: 20,
        iconUrl: 'https://api.iconify.design/game-icons:sea-serpent.svg',
        mainDrops: [
            { itemId: 'raw_eel', chance: "1/4", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'nexus_rune', chance: "1/3", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'anima_rune', chance: "1/8", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'aether_rune', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Beast], attackSpeed: 3, respawnTime: 90000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash'
    },
    {
        id: 'ancient_sentinel', name: 'Ancient Sentinel', level: 58, maxHp: 80, attack: 52,
        stabDefence: 60, slashDefence: 60, crushDefence: 30, rangedDefence: 80, magicDefence: 20,
        iconUrl: 'https://api.iconify.design/game-icons:ancient-sword.svg',
        guaranteedDrops: [{ itemId: 'ancient_gear', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { itemId: 'wyrmscale', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'passage_rune', chance: "1/3", minQuantity: 3, maxQuantity: 3 },
            { itemId: 'astral_rune', chance: "1/5", minQuantity: 2, maxQuantity: 2 },
            { itemId: 'runic_bar', chance: "1/32", minQuantity: 1, maxQuantity: 2 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Undead, MonsterType.Armored], attackSpeed: 6, respawnTime: 180000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush'
    },
    {
        id: 'skeletal_archer', name: 'Skeletal Archer', level: 55, maxHp: 50, attack: 1, ranged: 50,
        stabDefence: 20, slashDefence: 25, crushDefence: 20, rangedDefence: 15, magicDefence: 30,
        iconUrl: 'https://api.iconify.design/game-icons:skeletal-hand.svg',
        guaranteedDrops: [{ itemId: 'bones', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { itemId: 'mithril_arrow', chance: "1/2", minQuantity: 30, maxQuantity: 65 },
            { itemId: 'adamantite_arrow', chance: "1/4", minQuantity: 15, maxQuantity: 20 },
            { itemId: 'runic_arrow', chance: "1/16", minQuantity: 10, maxQuantity: 10 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Undead], attackSpeed: 4, respawnTime: 45000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged'
    },
    {
        id: 'labyrinth_guardian', name: 'Labyrinth Guardian', level: 60, maxHp: 90, attack: 55,
        stabDefence: 40, slashDefence: 40, crushDefence: 80, rangedDefence: 50, magicDefence: 5,
        iconUrl: 'https://api.iconify.design/game-icons:minotaur.svg',
        mainDrops: [
            { itemId: 'adamantite_ore', chance: "1/8", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'gem_table', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 5, respawnTime: 90000, aggressive: true, attackStyle: 'crush'
    },
    {
        id: 'water_weird', name: 'Water Weird', level: 52, maxHp: 45, attack: 1, magic: 50,
        stabDefence: 10, slashDefence: 10, crushDefence: 10, rangedDefence: 15, magicDefence: 40,
        iconUrl: 'https://api.iconify.design/game-icons:water-splash.svg',
        guaranteedDrops: [{ itemId: 'aqua_rune', minQuantity: 10, maxQuantity: 20 }],
        mainDrops: [
            { itemId: 'runic_dagger', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Elemental], attackSpeed: 4, respawnTime: 35000, aggressive: true, attackStyle: 'magic'
    },
    {
        id: 'temple_spirit', name: 'Temple Spirit', level: 54, maxHp: 40, attack: 1, magic: 55,
        stabDefence: 60, slashDefence: 60, crushDefence: 60, rangedDefence: 40, magicDefence: 20,
        iconUrl: 'https://api.iconify.design/game-icons:ghost.svg',
        mainDrops: [
            { itemId: 'astral_rune', chance: "1/3", minQuantity: 2, maxQuantity: 2 },
            { itemId: 'nexus_rune', chance: "1/8", minQuantity: 2, maxQuantity: 16 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Undead], attackSpeed: 4, respawnTime: 40000, aggressive: true, attackStyle: 'magic'
    },
    {
        id: 'grave_revenant', name: 'Grave Revenant', level: 62, maxHp: 85, attack: 58,
        stabDefence: 40, slashDefence: 40, crushDefence: 40, rangedDefence: 35, magicDefence: 35,
        iconUrl: 'https://api.iconify.design/game-icons:grim-reaper.svg',
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { itemId: 'nexus_rune', chance: "1/2", minQuantity: 2, maxQuantity: 12 },
            { itemId: 'runic_mace', chance: "1/256", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Undead], attackSpeed: 4, respawnTime: 80000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush'
    },
    {
        id: 'coral_golem', name: 'Coral Golem', level: 64, maxHp: 110, attack: 60,
        stabDefence: 55, slashDefence: 55, crushDefence: 25, rangedDefence: 70, magicDefence: 15,
        iconUrl: 'https://api.iconify.design/game-icons:coral.svg',
        guaranteedDrops: [{ itemId: 'aqua_rune', minQuantity: 50, maxQuantity: 100 }],
        mainDrops: [
            { itemId: 'uncut_ruby', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sunken_labyrinth_map', chance: "1/16", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: "1/32", minQuantity: 1, maxQuantity: 3, noted: true },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 5, respawnTime: 150000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush'
    },
    {
        id: 'the_abyssal_warden', name: 'The Abyssal Warden', level: 80, maxHp: 150, attack: 70,
        stabDefence: 90, slashDefence: 90, crushDefence: 60, rangedDefence: 95, magicDefence: 30,
        iconUrl: 'https://api.iconify.design/game-icons:triton-head.svg',
        guaranteedDrops: [
            { itemId: 'dragon_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'adamantite_bar', chance: "1/12", minQuantity: 3, maxQuantity: 5, noted: true },
            { itemId: 'runic_bar', chance: "1/16", minQuantity: 2, maxQuantity: 4, noted: true },
            { itemId: 'uncut_diamond', chance: "1/8", minQuantity: 1, maxQuantity: 4, noted: true },
            { itemId: 'cooked_shark', chance: "1/2", minQuantity: 3, maxQuantity: 7 },
            { itemId: 'nexus_rune', chance: "1/3", minQuantity: 10, maxQuantity: 50 },
            { itemId: 'anima_rune', chance: "1/16", minQuantity: 5, maxQuantity: 20 },
            { itemId: 'trident_of_the_depths', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 4, respawnTime: 300000, aggressive: true, alwaysAggressive: true, attackStyle: 'stab'
    },
    {
        id: 'blight_imp', name: 'Blight Imp', level: 7, maxHp: 18, attack: 1, magic: 8,
        stabDefence: 5, slashDefence: 5, crushDefence: 5, rangedDefence: 10, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:imp-laugh.svg',
        guaranteedDrops: [
            { itemId: 'ashes', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { tableId: 'herb_table', chance: "1/4", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'binding_rune', chance: "1/5", minQuantity: 5, maxQuantity: 10 },
        ],
        types: [MonsterType.Demon], attackSpeed: 4, respawnTime: 600000, aggressive: true, alwaysAggressive: true,        attackStyle: 'magic',
        specialAttacks: [{ name: 'Wilt', chance: 0.2, effect: 'stat_drain', skill: SkillName.Strength, value: -2 }],
        elementalWeakness: 'fire', // Quest-specific summon
    },
    {
        id: 'grave_revenant_lord', name: 'Grave Revenant Lord', level: 72, maxHp: 110, attack: 65,
        stabDefence: 80, slashDefence: 90, crushDefence: 40, rangedDefence: 70, magicDefence: 60,
        iconUrl: 'https://api.iconify.design/game-icons:grim-reaper.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'adamantite_battleaxe', chance: "1/16", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_sword', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: "1/4", minQuantity: 2, maxQuantity: 3, noted: true },
            { itemId: 'coins', chance: "1/1", minQuantity: 800, maxQuantity: 1500},
            { itemId: 'nexus_rune', chance: "1/5", minQuantity: 10, maxQuantity: 20 },
        ],
        types: [MonsterType.Undead, MonsterType.Armored],
        attackSpeed: 4, respawnTime: 600000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash',
        specialAttacks: [{ name: 'Soul Drain', chance: 0.25, effect: 'damage_multiplier', value: 1.2 }], //quest boss
    },
    {
        id: 'chasm_crawler', name: 'Chasm Crawler', level: 48, maxHp: 55, attack: 40,
        stabDefence: 40, slashDefence: 30, crushDefence: 35, rangedDefence: 25, magicDefence: 20,
        iconUrl: 'https://api.iconify.design/game-icons:insect-jaws.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'coal', chance: "1/5", minQuantity: 3, maxQuantity: 9, noted: true },
            { itemId: 'mithril_ore', chance: "1/20", minQuantity: 1, maxQuantity: 5, noted: true },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'stab',
    },
{
    id: 'rock_golem', name: 'Rock Golem', level: 52, maxHp: 70, attack: 45,
    stabDefence: 60, slashDefence: 60, crushDefence: 20, rangedDefence: 70, magicDefence: 10,
    iconUrl: 'https://api.iconify.design/game-icons:rock-golem.svg',
    guaranteedDrops: [
        { itemId: 'stone_rune', minQuantity: 15, maxQuantity: 30 },
    ],
    mainDrops: [
        { tableId: 'gem_table', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
        { itemId: 'iron_ore', chance: "1/2", minQuantity: 15, maxQuantity: 26, noted: true },
        { itemId: 'coal', chance: "1/4", minQuantity: 35, maxQuantity: 60, noted: true },
    ],
    types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 6, respawnTime: 45000, aggressive: true, attackStyle: 'crush',
},
{
    id: 'the_earth_render', name: 'The Earth-Render', level: 85, maxHp: 160, attack: 75,
    stabDefence: 100, slashDefence: 100, crushDefence: 50, rangedDefence: 120, magicDefence: 30,
    iconUrl: 'https://api.iconify.design/game-icons:elf-helmet.svg',
    guaranteedDrops: [
        { itemId: 'heart_of_the_mountain', minQuantity: 1, maxQuantity: 1 },
    ],
    mainDrops: [
        { itemId: 'adamantite_ore', chance: "1/2", minQuantity: 3, maxQuantity: 6, noted: true },
        { itemId: 'runic_bar', chance: "1/10", minQuantity: 1, maxQuantity: 2, noted: true },
        { itemId: 'uncut_diamond', chance: "1/8", minQuantity: 1, maxQuantity: 2, noted: true },
        { itemId: 'coins', chance: "1/1", minQuantity: 5000, maxQuantity: 7500},
    ],
    types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 7, respawnTime: 600000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    specialAttacks: [{ name: 'Tremor', chance: 0.3, effect: 'stun', duration: 3000 }], //quest boss
},
];