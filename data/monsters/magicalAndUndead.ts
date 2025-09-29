import { Monster, MonsterType } from '../../types';

export const magicalAndUndead: Monster[] = [
    {
        id: 'wizard', name: 'Wizard', level: 13, maxHp: 30, attack: 1, magic: 15,
        stabDefence: 5, slashDefence: 5, crushDefence: 5, rangedDefence: 8, magicDefence: 12,
        iconUrl: 'https://api.iconify.design/game-icons:wizard-face.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: "1/4", minQuantity: 10, maxQuantity: 25 },
            { itemId: 'aqua_rune', chance: "1/5", minQuantity: 8, maxQuantity: 20 },
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 8, maxQuantity: 20 },
            { itemId: 'binding_rune', chance: "1/8", minQuantity: 5, maxQuantity: 15 },
            { tableId: 'herb_table', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'wizard_hat', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'wizard_robe_top', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'wizard_robe_skirt', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 60000, aggressive: false, attackStyle: 'magic',
    },
    {
        id: 'cave_slime', name: 'Cave Slime', level: 3, maxHp: 10, attack: 2,
        stabDefence: 3, slashDefence: 3, crushDefence: 1, rangedDefence: 5, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/cave_slime.png',
        mainDrops: [
            { itemId: 'cave_slime_globule', chance: "1/2", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'aqua_rune', chance: "1/10", minQuantity: 1, maxQuantity: 3 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 5, respawnTime: 25000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'stone_golem', name: 'Stone Golem', level: 50, maxHp: 100, attack: 28,
        stabDefence: 30, slashDefence: 30, crushDefence: 10, rangedDefence: 40, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/stone_golem.png',
        guaranteedDrops: [
            { itemId: 'iron_ore', minQuantity: 5, maxQuantity: 10 },
            { itemId: 'coal', minQuantity: 10, maxQuantity: 20 },
            { itemId: 'stone_rune', minQuantity: 30, maxQuantity: 50 },
        ],
        mainDrops: [
            { itemId: 'golem_core_shard', chance: "1/8", minQuantity: 1, maxQuantity: 10 },
            { itemId: 'golem_core', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Armored, attackSpeed: 6, respawnTime: 120000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'harpy', name: 'Harpy', level: 22, maxHp: 35, attack: 1, ranged: 20,
        stabDefence: 12, slashDefence: 12, crushDefence: 10, rangedDefence: 15, magicDefence: 5,
        iconUrl: '/assets/npcChatHeads/harpy.png',
        guaranteedDrops: [
            { itemId: 'feathers', minQuantity: 10, maxQuantity: 30 },
            { itemId: 'gust_rune', minQuantity: 10, maxQuantity: 20 },
        ],
        mainDrops: [
            { itemId: 'harpy_feather', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'harpy_talon', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 40000, attackStyle: 'ranged', aggressive: true, alwaysAggressive: true
    },
    {
        id: 'fey_sprite', name: 'Fey Sprite', level: 20, maxHp: 30, attack: 1, ranged: 15,
        stabDefence: 18, slashDefence: 18, crushDefence: 18, rangedDefence: 25, magicDefence: 25,
        iconUrl: '/assets/npcChatHeads/fey_sprite.png',
        mainDrops: [
            { itemId: 'binding_rune', chance: "1/4", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'verdant_rune', chance: "1/6", minQuantity: 2, maxQuantity: 6 },
            { itemId: 'fey_dust', chance: "1/10", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'enchanted_bark', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 45000, attackStyle: 'ranged', aggressive: false
    },
    {
        id: 'swamp_horror', name: 'Swamp Horror', level: 28, maxHp: 60, attack: 22,
        stabDefence: 20, slashDefence: 20, crushDefence: 25, rangedDefence: 15, magicDefence: 10,
        iconUrl: '/assets/npcChatHeads/swamp_horror.png',
        mainDrops: [
            { itemId: 'stone_rune', chance: "1/3", minQuantity: 10, maxQuantity: 25 },
            { itemId: 'hex_rune', chance: "1/4", minQuantity: 8, maxQuantity: 18 },
            { itemId: 'astral_rune', chance: "1/10", minQuantity: 3, maxQuantity: 7 },
            { itemId: 'yew_logs', chance: "1/10", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'uncut_emerald', chance: "1/30", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'affinity_hat', chance: "1/100", minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 5, respawnTime: 60000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'shipwreck_specter', name: 'Shipwreck Specter', level: 39, maxHp: 75, attack: 1, magic: 38,
        stabDefence: 32, slashDefence: 32, crushDefence: 32, rangedDefence: 40, magicDefence: 40,
        iconUrl: '/assets/npcChatHeads/shipwreck_specter.png',
        mainDrops: [
            { itemId: 'nexus_rune', chance: "1/2", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'anima_rune', chance: "1/8", minQuantity: 2, maxQuantity: 5 },
            { itemId: 'driftwood_logs', chance: "1/8", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'eldritch_pearl', chance: "1/40", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'aether_rune', chance: "1/50", minQuantity: 1, maxQuantity: 2 },
        ],
        monsterType: MonsterType.Undead, attackSpeed: 4, respawnTime: 80000, aggressive: true, alwaysAggressive: true, attackStyle: 'magic',
    },
    {
        id: 'siren', name: 'Siren', level: 44, maxHp: 90, attack: 1, ranged: 55,
        stabDefence: 30, slashDefence: 30, crushDefence: 30, rangedDefence: 35, magicDefence: 35,
        iconUrl: '/assets/npcChatHeads/siren.png',
        guaranteedDrops: [
            { itemId: 'sirens_hair', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'aqua_rune', minQuantity: 30, maxQuantity: 50 },
        ],
        mainDrops: [
            { itemId: 'astral_rune', chance: "1/5", minQuantity: 5, maxQuantity: 12 },
            { itemId: 'anima_rune', chance: "1/10", minQuantity: 3, maxQuantity: 8 },
            { itemId: 'eldritch_pearl', chance: "1/30", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'affinity_bottoms', chance: "1/100", minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 240000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged',
        specialAttacks: [{ name: 'Deafening Shriek', chance: 0.2, effect: 'damage_multiplier', value: 1.5 }],
        elementalWeakness: 'earth',
    },
    {
        id: 'coral_golem', name: 'Coral Golem', level: 51, maxHp: 120, attack: 35,
        stabDefence: 55, slashDefence: 55, crushDefence: 25, rangedDefence: 70, magicDefence: 15,
        iconUrl: '/assets/npcChatHeads/coral_golem.png',
        guaranteedDrops: [
            { itemId: 'aqua_rune', minQuantity: 50, maxQuantity: 100 },
        ],
        mainDrops: [
            { itemId: 'uncut_ruby', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Armored, attackSpeed: 5, respawnTime: 150000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'deep_lurker', name: 'Deep Lurker', level: 51, maxHp: 70, attack: 45, 
        stabDefence: 30, slashDefence: 35, crushDefence: 32, rangedDefence: 25, magicDefence: 20,
        iconUrl: '/assets/npcChatHeads/deep_lurker.png',
        mainDrops: [
            { itemId: 'nexus_rune', chance: "1/3", minQuantity: 20, maxQuantity: 35 },
            { itemId: 'raw_eel', chance: "1/5", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'anima_rune', chance: "1/8", minQuantity: 8, maxQuantity: 15 },
            { itemId: 'aether_rune', chance: "1/40", minQuantity: 2, maxQuantity: 5 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 90000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash',
    },
    {
        id: 'ancient_sentinel', name: 'Ancient Sentinel', level: 51, maxHp: 150, attack: 40, 
        stabDefence: 60, slashDefence: 60, crushDefence: 30, rangedDefence: 80, magicDefence: 20,
        iconUrl: '/assets/npcChatHeads/ancient_sentinel.png',
        guaranteedDrops: [
            { itemId: 'ancient_gear', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'passage_rune', chance: "1/3", minQuantity: 15, maxQuantity: 25 },
            { itemId: 'astral_rune', chance: "1/5", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'wyrmscale', chance: "1/10", minQuantity: 1, maxQuantity: 2 },
        ],
        monsterType: MonsterType.Armored, attackSpeed: 6, respawnTime: 180000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'magma_imp', name: 'Magma Imp', level: 43, maxHp: 60, attack: 1, ranged: 50,
        stabDefence: 25, slashDefence: 25, crushDefence: 25, rangedDefence: 30, magicDefence: 30,
        iconUrl: '/assets/npcChatHeads/magma_imp.png',
        guaranteedDrops: [
            { itemId: 'ember_rune', minQuantity: 40, maxQuantity: 80 },
        ],
        mainDrops: [
            { itemId: 'flux_rune', chance: "1/3", minQuantity: 15, maxQuantity: 30 },
            { itemId: 'brimstone', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 2, respawnTime: 90000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged'
    },
    // New Verdant Fields Monsters
    {
        id: 'unicorn', name: 'Unicorn', level: 20, maxHp: 40, attack: 10, magic: 15,
        stabDefence: 15, slashDefence: 15, crushDefence: 15, rangedDefence: 20, magicDefence: 25,
        iconUrl: '/assets/npcChatHeads/unicorn.png',
        guaranteedDrops: [
            { itemId: 'unicorn_horn', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'verdant_rune', chance: "1/8", minQuantity: 3, maxQuantity: 8 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 300000, aggressive: false, attackStyle: 'magic',
    },
    {
        id: 'forest_spirit', name: 'Forest Spirit', level: 16, maxHp: 30, attack: 1, magic: 14,
        stabDefence: 20, slashDefence: 20, crushDefence: 20, rangedDefence: 25, magicDefence: 30,
        iconUrl: '/assets/npcChatHeads/forest_spirit.png',
        mainDrops: [
            { itemId: 'enchanted_bark', chance: "1/4", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'fey_dust', chance: "1/5", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'verdant_rune', chance: "1/6", minQuantity: 5, maxQuantity: 10 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 40000, aggressive: false, attackStyle: 'magic',
    },
    {
        id: 'treant_sapling', name: 'Treant Sapling', level: 17, maxHp: 38, attack: 15,
        stabDefence: 5, slashDefence: 20, crushDefence: 20, rangedDefence: 10, magicDefence: 5,
        iconUrl: '/assets/npcChatHeads/treant_sapling.png',
        guaranteedDrops: [
            { itemId: 'willow_logs', minQuantity: 1, maxQuantity: 3 },
        ],
        mainDrops: [
            { itemId: 'enchanted_bark', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: "1/6", minQuantity: 4, maxQuantity: 8 },
            { itemId: 'bloodroot_tendril', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Armored, attackSpeed: 6, respawnTime: 50000, aggressive: true, attackStyle: 'crush',
    },
    // Salt Flats Monsters
    {
        id: 'brine_elemental', name: 'Brine Elemental', level: 42, maxHp: 90, attack: 1, magic: 40,
        stabDefence: 30, slashDefence: 30, crushDefence: 30, rangedDefence: 45, magicDefence: 40,
        iconUrl: '/assets/npcChatHeads/brine_elemental.png',
        guaranteedDrops: [
            { itemId: 'aqua_rune', minQuantity: 40, maxQuantity: 80 },
        ],
        mainDrops: [
            { itemId: 'brine_crystal', chance: "1/20", minQuantity: 1, maxQuantity: 2 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 75000, aggressive: true, alwaysAggressive: true, attackStyle: 'magic'
    },
    {
        id: 'salt_cryst_golem', name: 'Salt-cryst Golem', level: 37, maxHp: 80, attack: 30,
        stabDefence: 40, slashDefence: 20, crushDefence: 40, rangedDefence: 30, magicDefence: 15,
        iconUrl: '/assets/npcChatHeads/salt_cryst_golem.png',
        guaranteedDrops: [
            { itemId: 'rock_salt', minQuantity: 3, maxQuantity: 8 },
        ],
        mainDrops: [
            { itemId: 'uncut_diamond', chance: "1/500", minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Armored, attackSpeed: 6, respawnTime: 90000, aggressive: false, attackStyle: 'crush'
    },
    {
        id: 'mirage_weaver', name: 'Mirage Weaver', level: 41, maxHp: 60, attack: 1, magic: 45,
        stabDefence: 10, slashDefence: 10, crushDefence: 10, rangedDefence: 30, magicDefence: 50,
        iconUrl: '/assets/npcChatHeads/mirage_weaver.png',
        guaranteedDrops: [
            { itemId: 'gust_rune', minQuantity: 20, maxQuantity: 50 },
        ],
        mainDrops: [
            { itemId: 'astral_rune', chance: "1/3", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'fey_dust', chance: "1/10", minQuantity: 1, maxQuantity: 2 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 60000, aggressive: true, attackStyle: 'magic'
    },
    {
        id: 'salt_wraith', name: 'Salt Wraith', level: 45, maxHp: 100, attack: 1, magic: 48,
        stabDefence: 25, slashDefence: 25, crushDefence: 25, rangedDefence: 40, magicDefence: 45,
        iconUrl: '/assets/npcChatHeads/salt_wraith.png',
        guaranteedDrops: [
            { itemId: 'nexus_rune', minQuantity: 15, maxQuantity: 30 },
        ],
        mainDrops: [
            { itemId: 'consecrated_dust', chance: "1/3", minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Undead, attackSpeed: 4, respawnTime: 120000, aggressive: true, attackStyle: 'magic'
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
        monsterType: MonsterType.Armored, attackSpeed: 6, respawnTime: 100000, aggressive: false, attackStyle: 'crush'
    },
];