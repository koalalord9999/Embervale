import { Monster, MonsterType } from '../../types';

export const humanoids: Monster[] = [
    {
        id: 'man', name: 'Man', level: 2, maxHp: 7, attack: 1,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/tavern_regular.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { tableId: 'herb_table', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: 0.3, minQuantity: 1, maxQuantity: 6 },
            { itemId: 'aqua_rune', chance: 0.2, minQuantity: 1, maxQuantity: 3 },
            { itemId: 'stone_rune', chance: 0.2, minQuantity: 1, maxQuantity: 3 },
            { itemId: 'binding_rune', chance: 0.15, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'stone_talisman', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'copper_ore', chance: 0.02, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'tin_ore', chance: 0.02, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bucket', chance: 0.015, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'knife', chance: 0.01, minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 7000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'woman', name: 'Woman', level: 2, maxHp: 7, attack: 1,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/elara.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { tableId: 'herb_table', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: 0.3, minQuantity: 1, maxQuantity: 6 },
            { itemId: 'aqua_rune', chance: 0.2, minQuantity: 1, maxQuantity: 3 },
            { itemId: 'stone_rune', chance: 0.2, minQuantity: 1, maxQuantity: 3 },
            { itemId: 'binding_rune', chance: 0.15, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'stone_talisman', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'copper_ore', chance: 0.02, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'tin_ore', chance: 0.02, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bucket', chance: 0.015, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'knife', chance: 0.01, minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 7000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'goblin', name: 'Goblin', level: 2, maxHp: 8, attack: 1,
        stabDefence: 1, slashDefence: 2, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/goblin.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'goblin_hide', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'grimy_coin_pouch', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_talisman', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: 0.15, minQuantity: 1, maxQuantity: 5 },
            { itemId: 'stone_rune', chance: 0.15, minQuantity: 1, maxQuantity: 5 },
            { itemId: 'ember_rune', chance: 0.12, minQuantity: 1, maxQuantity: 4 },
            { itemId: 'binding_rune', chance: 0.12, minQuantity: 1, maxQuantity: 4 },
            { itemId: 'flux_rune', chance: 0.05, minQuantity: 1, maxQuantity: 2 },
        ],
        tertiaryDrops: [
            { itemId: 'goblin_champion_scroll', chance: 1/5000, minQuantity: 1, maxQuantity: 1 }
        ],
        monsterType: MonsterType.Armored, attackSpeed: 4, respawnTime: 12000, aggressive: false, attackStyle: 'slash',
    },
    {
        id: 'goblin_scout', name: 'Goblin Scout', level: 7, maxHp: 18, attack: 5,
        stabDefence: 4, slashDefence: 5, crushDefence: 3, rangedDefence: 2, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/goblin_scout.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'goblin_mail', chance: 0.02, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'goblin_hide', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'grimy_coin_pouch', chance: 0.07, minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_talisman', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: 0.15, minQuantity: 2, maxQuantity: 8 },
            { itemId: 'stone_rune', chance: 0.15, minQuantity: 2, maxQuantity: 8 },
            { itemId: 'ember_rune', chance: 0.1, minQuantity: 2, maxQuantity: 6 },
            { itemId: 'binding_rune', chance: 0.1, minQuantity: 2, maxQuantity: 6 },
            { itemId: 'flux_rune', chance: 0.05, minQuantity: 1, maxQuantity: 3 },
        ],
        tertiaryDrops: [
            { itemId: 'goblin_champion_scroll', chance: 1/5000, minQuantity: 1, maxQuantity: 1 }
        ],
        monsterType: MonsterType.Armored, attackSpeed: 4, respawnTime: 30000, aggressive: true, alwaysAggressive: true, attackStyle: 'stab',
    },
    {
        id: 'goblin_thrower', name: 'Goblin Thrower', level: 14, maxHp: 25, attack: 1, ranged: 12,
        stabDefence: 6, slashDefence: 8, crushDefence: 4, rangedDefence: 2, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/goblin_thrower.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'grimy_coin_pouch', chance: 0.08, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'goblin_hide', chance: 0.25, minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: 0.12, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_talisman', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: 0.3, minQuantity: 3, maxQuantity: 10 },
            { itemId: 'stone_rune', chance: 0.3, minQuantity: 3, maxQuantity: 10 },
            { itemId: 'ember_rune', chance: 0.25, minQuantity: 3, maxQuantity: 8 },
            { itemId: 'binding_rune', chance: 0.25, minQuantity: 3, maxQuantity: 8 },
            { itemId: 'flux_rune', chance: 0.15, minQuantity: 2, maxQuantity: 5 },
        ],
        tertiaryDrops: [
            { itemId: 'goblin_champion_scroll', chance: 1/5000, minQuantity: 1, maxQuantity: 1 }
        ],
        monsterType: MonsterType.Armored, attackSpeed: 3, respawnTime: 30000, attackStyle: 'ranged', aggressive: true, alwaysAggressive: true,
    },
    {
        id: 'goblin_brute', name: 'Goblin Brute', level: 24, maxHp: 40, attack: 18,
        stabDefence: 15, slashDefence: 18, crushDefence: 12, rangedDefence: 10, magicDefence: 5,
        iconUrl: '/assets/npcChatHeads/goblin_brute.png',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'bronze_battleaxe', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'goblin_hide', chance: 0.1, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'grimy_coin_pouch', chance: 0.1, minQuantity: 1, maxQuantity: 2 },
            { tableId: 'herb_table', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_talisman', chance: 0.0025, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'aqua_rune', chance: 0.15, minQuantity: 5, maxQuantity: 12 },
            { itemId: 'stone_rune', chance: 0.15, minQuantity: 5, maxQuantity: 12 },
            { itemId: 'ember_rune', chance: 0.15, minQuantity: 5, maxQuantity: 12 },
            { itemId: 'binding_rune', chance: 0.15, minQuantity: 5, maxQuantity: 12 },
            { itemId: 'flux_rune', chance: 0.04, minQuantity: 4, maxQuantity: 10 },
            { itemId: 'nexus_rune', chance: 0.0025, minQuantity: 1, maxQuantity: 5 },
        ],
        tertiaryDrops: [
            { itemId: 'goblin_champion_scroll', chance: 1/5000, minQuantity: 1, maxQuantity: 1 }
        ],
        monsterType: MonsterType.Armored, attackSpeed: 5, respawnTime: 120000,
        specialAttacks: [{ name: 'Crushing Blow', chance: 0.5, effect: 'damage_multiplier', value: 1.5 }],
        aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'grumlok_goblin_king', name: 'Grumlok, the Goblin King', level: 82, maxHp: 120, attack: 50,
        stabDefence: 120, slashDefence: 126, crushDefence: 36, rangedDefence: 166, magicDefence: -20,
        iconUrl: '/assets/npcChatHeads/grumlok_goblin_king.png',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'flux_rune', minQuantity: 20, maxQuantity: 40 },
        ],
        mainDrops: [
            { itemId: 'anima_rune', chance: 0.025, minQuantity: 2, maxQuantity: 8 },
            { itemId: 'passage_rune', chance: 0.05, minQuantity: 5, maxQuantity: 12 },
            { itemId: 'nexus_rune', chance: 0.075, minQuantity: 10, maxQuantity: 20 },
            { itemId: 'yew_logs', chance: 0.1, minQuantity: 5, maxQuantity: 10 },
            { itemId: 'hex_rune', chance: 0.1, minQuantity: 8, maxQuantity: 15 },
            { tableId: 'herb_table', chance: 0.15, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: 0.2, minQuantity: 15, maxQuantity: 30 },
            { itemId: 'grimy_coin_pouch', chance: 0.25, minQuantity: 5, maxQuantity: 10 },
        ],
        tertiaryDrops: [
            { itemId: 'goblin_champion_scroll', chance: 1/1000, minQuantity: 1, maxQuantity: 1 }
        ],
        monsterType: MonsterType.Armored, attackSpeed: 4, respawnTime: 600000,
        specialAttacks: [{ name: 'Royal Smash', chance: 0.3, effect: 'damage_multiplier', value: 2 }],
        aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'cloaked_bandit', name: 'Cloaked Bandit', level: 12, maxHp: 20, attack: 9,
        stabDefence: 13, slashDefence: 14, crushDefence: 12, rangedDefence: 11, magicDefence: -10,
        iconUrl: '/assets/npcChatHeads/cloaked_bandit.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'grimy_coin_pouch', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: 0.15, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: 0.2, minQuantity: 2, maxQuantity: 8 },
            { itemId: 'stone_rune', chance: 0.2, minQuantity: 2, maxQuantity: 8 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 45000, aggressive: true, attackStyle: 'slash',
    },
    {
        id: 'highwayman', name: 'Highwayman', level: 21, maxHp: 35, attack: 16,
        stabDefence: 18, slashDefence: 20, crushDefence: 16, rangedDefence: 15, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/highwayman.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'grimy_coin_pouch', chance: 0.12, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'lost_heirloom', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: 0.225, minQuantity: 5, maxQuantity: 12 },
            { itemId: 'stone_rune', chance: 0.25, minQuantity: 5, maxQuantity: 12 },
            { itemId: 'ember_rune', chance: 0.2, minQuantity: 3, maxQuantity: 10 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 60000, aggressive: true, attackStyle: 'slash',
    },
    {
        id: 'bandit_marksman', name: 'Bandit Marksman', level: 27, maxHp: 30, attack: 1, ranged: 32,
        stabDefence: 24, slashDefence: 26, crushDefence: 50, rangedDefence: 35, magicDefence: 22,
        iconUrl: '/assets/npcChatHeads/bandit_marksman.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'iron_arrow', chance: 0.3, minQuantity: 5, maxQuantity: 15 },
            { tableId: 'herb_table', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: 0.2, minQuantity: 8, maxQuantity: 18 },
            { itemId: 'stone_rune', chance: 0.2, minQuantity: 8, maxQuantity: 18 },
            { itemId: 'ember_rune', chance: 0.1, minQuantity: 6, maxQuantity: 15 },
            { itemId: 'binding_rune', chance: 0.1, minQuantity: 4, maxQuantity: 12 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 45000, attackStyle: 'ranged', aggressive: true, alwaysAggressive: true
    },
    {
        id: 'bandit_bruiser', name: 'Bandit Bruiser', level: 36, maxHp: 61, attack: 37,
        stabDefence: 60, slashDefence: 58, crushDefence: 62, rangedDefence: 58, magicDefence: -10,
        iconUrl: '/assets/npcChatHeads/bandit_bruiser.png',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'bandit_brew', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: 0.2, minQuantity: 10, maxQuantity: 25 },
            { itemId: 'stone_rune', chance: 0.2, minQuantity: 10, maxQuantity: 25 },
            { itemId: 'ember_rune', chance: 0.2, minQuantity: 8, maxQuantity: 20 },
            { itemId: 'binding_rune', chance: 0.15, minQuantity: 6, maxQuantity: 18 },
            { itemId: 'flux_rune', chance: 0.1, minQuantity: 3, maxQuantity: 10 },
        ],
        monsterType: MonsterType.Armored, attackSpeed: 4, respawnTime: 45000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'bandit_leader', name: 'Bandit Leader', level: 56, maxHp: 75, attack: 42,
        stabDefence: 80, slashDefence: 92, crushDefence: 72, rangedDefence: 88, magicDefence: -10,
        iconUrl: '/assets/npcChatHeads/bandit_leader.png',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stolen_caravan_goods', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'passage_talisman', chance: 0.002, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'spiked_cape', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bandit_leaders_cutlass', chance: 0.01, minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: 0.3, minQuantity: 10, maxQuantity: 20 },
            { itemId: 'flux_rune', chance: 0.38, minQuantity: 15, maxQuantity: 30 },
        ],
        monsterType: MonsterType.Armored, attackSpeed: 3, respawnTime: 180000, aggressive: true, alwaysAggressive: true,
        specialAttacks: [{ name: 'Crippling Strike', chance: 0.3, effect: 'damage_multiplier', value: 1.5 }], attackStyle: 'slash',
    },
    {
        id: 'scarecrow', name: 'Scarecrow', level: 3, maxHp: 12, attack: 2,
        stabDefence: 8, slashDefence: 5, crushDefence: 2, rangedDefence: 1, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/scarecrow.png',
        guaranteedDrops: [
            { itemId: 'straw', minQuantity: 2, maxQuantity: 5 },
        ],
        mainDrops: [
            { itemId: 'verdant_rune', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
        ],
        monsterType: MonsterType.Standard, attackSpeed: 5, respawnTime: 30000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'training_dummy', name: 'Training Dummy', level: 1, maxHp: 1000, attack: 0, 
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:wooden-sign.svg',
        monsterType: MonsterType.Standard, attackSpeed: 1000, respawnTime: 1000, aggressive: false, attackStyle: 'crush', customMaxHit: 0,},
];