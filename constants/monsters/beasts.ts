import { Monster, MonsterType } from '../../types';

export const beasts: Monster[] = [
    {
        id: 'tutorial_rat',
        name: 'Tutorial Rat',
        level: 1,
        maxHp: 3,
        attack: 1,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/giant_rat.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 }
        ],
        monsterType: MonsterType.Standard,
        attackSpeed: 4,
        respawnTime: 10000,
        aggressive: false,
        attackStyle: 'stab',
        customMaxHit: 1,
    },
    {
        id: 'giant_rat', name: 'Giant Rat', level: 1, maxHp: 5, attack: 1,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/giant_rat.png',
        guaranteedDrops: [
            { itemId: 'rat_tail', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'binding_rune', chance: 500, minQuantity: 1, maxQuantity: 1 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 20000, aggressive: false, attackStyle: 'stab',
    },
    {
        id: 'giant_spider', name: 'Giant Spider', level: 4, maxHp: 15, attack: 3,
        stabDefence: 2, slashDefence: 2, crushDefence: 2, rangedDefence: 4, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/giant_spider.png',
        guaranteedDrops: [
            { itemId: 'spider_silk', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'spider_eggs', chance: 1000, minQuantity: 1, maxQuantity: 3 },
            { itemId: 'binding_rune', chance: 200, minQuantity: 1, maxQuantity: 2 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 30000, aggressive: false, attackStyle: 'stab',
    },
    {
        id: 'cow', name: 'Cow', level: 2, maxHp: 10, attack: 1,
        stabDefence: 1, slashDefence: 1, crushDefence: 1, rangedDefence: 1, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/cow.png',
        guaranteedDrops: [
            { itemId: 'raw_beef', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cowhide', minQuantity: 1, maxQuantity: 1 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 5, respawnTime: 15000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'chicken', name: 'Chicken', level: 1, maxHp: 4, attack: 1,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/chicken.png',
        guaranteedDrops: [
            { itemId: 'raw_chicken', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'feathers', minQuantity: 1, maxQuantity: 20 }
        ],
        mainDrops: [
            { itemId: 'eggs', chance: 2500, minQuantity: 1, maxQuantity: 1 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 10000, aggressive: false, attackStyle: 'stab',
        customMaxHit: 0,
    },
    {
        id: 'wild_boar', name: 'Wild Boar', level: 6, maxHp: 22, attack: 7,
        stabDefence: 4, slashDefence: 4, crushDefence: 6, rangedDefence: 2, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/wild_boar.png',
        guaranteedDrops: [
            { itemId: 'raw_boar_meat', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'boar_hide', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'boar_tusk', chance: 1500, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: 3000, minQuantity: 1, maxQuantity: 4 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 30000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'mountain_goat', name: 'Mountain Goat', level: 18, maxHp: 30, attack: 15,
        stabDefence: 10, slashDefence: 10, crushDefence: 12, rangedDefence: 8, magicDefence: 5,
        iconUrl: '/assets/npcChatHeads/mountain_goat.png',
        guaranteedDrops: [
            { itemId: 'raw_beef', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: 4000, minQuantity: 5, maxQuantity: 10 },
            { itemId: 'stone_rune', chance: 4000, minQuantity: 5, maxQuantity: 10 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'bog_serpent', name: 'Bog Serpent', level: 40, maxHp: 120, attack: 35,
        stabDefence: 25, slashDefence: 30, crushDefence: 28, rangedDefence: 20, magicDefence: 15,
        iconUrl: '/assets/npcChatHeads/bog_serpent.png',
        guaranteedDrops: [
            { itemId: 'serpent_scale', minQuantity: 1, maxQuantity: 3 },
            { itemId: 'big_bones', minQuantity: 2, maxQuantity: 2 }
        ],
        mainDrops: [
            { itemId: 'slimy_egg_shells', chance: 3500, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'serpents_egg', chance: 500, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'flux_rune', chance: 2000, minQuantity: 3, maxQuantity: 8 },
            { itemId: 'verdant_rune', chance: 1500, minQuantity: 2, maxQuantity: 6 },
            { itemId: 'nexus_rune', chance: 1000, minQuantity: 1, maxQuantity: 4 },
            { itemId: 'anima_rune', chance: 500, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'passage_rune', chance: 800, minQuantity: 2, maxQuantity: 5 },
            { itemId: 'affinity_gloves', chance: 100, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'affinity_boots', chance: 100, minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 90000, aggressive: true, alwaysAggressive: true,
        specialAttacks: [{ name: 'Venom Spit', chance: 0.25, effect: 'damage_multiplier', value: 1.2 }], attackStyle: 'slash',
    },
    {
        id: 'giant_toad', name: 'Giant Toad', level: 15, maxHp: 28, attack: 12,
        stabDefence: 8, slashDefence: 8, crushDefence: 10, rangedDefence: 5, magicDefence: 5,
        iconUrl: '/assets/npcChatHeads/giant_toad.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'spiked_toad_skin', chance: 1000, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: 3000, minQuantity: 5, maxQuantity: 15 },
            { itemId: 'hex_rune', chance: 1500, minQuantity: 3, maxQuantity: 10 },
            { itemId: 'astral_rune', chance: 500, minQuantity: 1, maxQuantity: 3 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'giant_crab', name: 'Giant Crab', level: 9, maxHp: 25, attack: 8,
        stabDefence: 15, slashDefence: 15, crushDefence: 12, rangedDefence: 10, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/giant_crab.png',
        guaranteedDrops: [
            { itemId: 'giant_crab_meat', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'giant_crab_claw', chance: 1200, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'aqua_rune', chance: 4700, minQuantity: 10, maxQuantity: 25 },
            { itemId: 'astral_rune', chance: 2000, minQuantity: 2, maxQuantity: 6 },
            { itemId: 'nexus_rune', chance: 1500, minQuantity: 4, maxQuantity: 12 },
            { itemId: 'anima_rune', chance: 500, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'aether_rune', chance: 100, minQuantity: 1, maxQuantity: 1 }
        ],
        monsterType: MonsterType.Armored, attackSpeed: 4, respawnTime: 30000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'tidal_crawler', name: 'Tidal Crawler', level: 38, maxHp: 80, attack: 30,
        stabDefence: 45, slashDefence: 45, crushDefence: 40, rangedDefence: 30, magicDefence: 10,
        iconUrl: '/assets/npcChatHeads/tidal_crawler.png',
        mainDrops: [
            { itemId: 'raw_eel', chance: 2000, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'aqua_rune', chance: 3400, minQuantity: 20, maxQuantity: 40 },
            { itemId: 'hex_rune', chance: 2000, minQuantity: 5, maxQuantity: 10 },
            { itemId: 'nexus_rune', chance: 2500, minQuantity: 8, maxQuantity: 18 },
            { itemId: 'affinity_top', chance: 100, minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Armored, attackSpeed: 5, respawnTime: 70000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'jungle_stalker', name: 'Jungle Stalker', level: 41, maxHp: 80, attack: 42,
        stabDefence: 35, slashDefence: 40, crushDefence: 30, rangedDefence: 25, magicDefence: 15,
        iconUrl: '/assets/npcChatHeads/jungle_stalker.png',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'verdant_rune', chance: 4000, minQuantity: 15, maxQuantity: 30 },
            { itemId: 'nexus_rune', chance: 1500, minQuantity: 5, maxQuantity: 15 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 100000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash',
    },
    {
        id: 'bog_mite',
        name: 'Bog Mite',
        level: 26,
        maxHp: 45,
        attack: 20,
        stabDefence: 15,
        slashDefence: 18,
        crushDefence: 12,
        rangedDefence: 20,
        magicDefence: 10,
        iconUrl: '/assets/npcChatHeads/bog_mite.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { tableId: 'herb_table', chance: 1500, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: 4000, minQuantity: 8, maxQuantity: 20 },
            { itemId: 'hex_rune', chance: 2500, minQuantity: 5, maxQuantity: 12 },
            { itemId: 'astral_rune', chance: 800, minQuantity: 2, maxQuantity: 4 }
        ],
        monsterType: MonsterType.Standard,
        attackSpeed: 4,
        respawnTime: 25000,
        aggressive: true,
        alwaysAggressive: true,
        attackStyle: 'stab',
    },
    // New Verdant Fields Monsters
    {
        id: 'bear', name: 'Bear', level: 18, maxHp: 35, attack: 16,
        stabDefence: 12, slashDefence: 10, crushDefence: 15, rangedDefence: 8, magicDefence: 5,
        iconUrl: '/assets/npcChatHeads/bear.png',
        guaranteedDrops: [
            { itemId: 'raw_beef', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'bear_pelt', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'stone_rune', chance: 2000, minQuantity: 2, maxQuantity: 8 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 5, respawnTime: 40000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'wolf', name: 'Wolf', level: 15, maxHp: 25, attack: 14,
        stabDefence: 8, slashDefence: 12, crushDefence: 6, rangedDefence: 10, magicDefence: 4,
        iconUrl: '/assets/npcChatHeads/wolf.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'wolf_pelt', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'frost_berries', chance: 300, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: 1500, minQuantity: 2, maxQuantity: 6 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 30000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash',
    },
    {
        id: 'glimmerhorn_stag', name: 'Glimmerhorn Stag', level: 12, maxHp: 20, attack: 8,
        stabDefence: 15, slashDefence: 15, crushDefence: 15, rangedDefence: 10, magicDefence: 10,
        iconUrl: '/assets/npcChatHeads/glimmerhorn_stag.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'glimmerhorn_antler', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'glimmer_thread_fiber', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'verdant_rune', chance: 1000, minQuantity: 1, maxQuantity: 3 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 35000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'young_hill_giant', name: 'Young Hill Giant', level: 22, maxHp: 45, attack: 20,
        stabDefence: 18, slashDefence: 18, crushDefence: 22, rangedDefence: 15, magicDefence: -5,
        iconUrl: '/assets/npcChatHeads/young_hill_giant.png',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'iron_warhammer', chance: 100, minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: 1000, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: 3000, minQuantity: 5, maxQuantity: 15 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 6, respawnTime: 60000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'giant_hornet', name: 'Giant Hornet', level: 14, maxHp: 22, attack: 1, ranged: 15,
        stabDefence: 5, slashDefence: 5, crushDefence: 5, rangedDefence: 15, magicDefence: 10,
        iconUrl: '/assets/npcChatHeads/giant_hornet.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: 5000, minQuantity: 10, maxQuantity: 20 }
        ],
        monsterType: MonsterType.Standard, attackSpeed: 2, respawnTime: 25000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged',
    },
];