import { Monster, MonsterType } from '../../types';

export const humanoids: Monster[] = [
    {
        id: 'man', name: 'Man', level: 2, maxHp: 7, attack: 1,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/tavern_regular.png',
        alwaysDrops: true,
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: "3/10", minQuantity: 1, maxQuantity: 6 },
            { itemId: 'aqua_rune', chance: "1/5", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'binding_rune', chance: "3/20", minQuantity: 1, maxQuantity: 2 },
            { tableId: 'herb_table', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'copper_ore', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'tin_ore', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bucket', chance: "3/200", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'knife', chance: "1/100", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_talisman', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Humanoid], attackSpeed: 4, respawnTime: 60000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'woman', name: 'Woman', level: 2, maxHp: 7, attack: 1,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/elara.png',
        alwaysDrops: true,
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: "3/10", minQuantity: 7, maxQuantity: 7 },
            { itemId: 'aqua_rune', chance: "1/5", minQuantity: 3, maxQuantity: 3 },
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 3, maxQuantity: 3 },
            { itemId: 'binding_rune', chance: "3/20", minQuantity: 2, maxQuantity: 2 },
            { tableId: 'herb_table', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'copper_ore', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'tin_ore', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bucket', chance: "3/200", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'knife', chance: "1/100", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_talisman', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Humanoid], attackSpeed: 4, respawnTime: 60000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'goblin', name: 'Goblin', level: 2, maxHp: 8, attack: 1,
        stabDefence: 1, slashDefence: 2, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/goblin.png',
        alwaysDrops: true,
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'goblin_hide', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: "3/20", minQuantity: 1, maxQuantity: 5 },
            { itemId: 'stone_rune', chance: "3/20", minQuantity: 1, maxQuantity: 5 },
            { itemId: 'ember_rune', chance: "3/25", minQuantity: 1, maxQuantity: 4 },
            { itemId: 'binding_rune', chance: "3/25", minQuantity: 1, maxQuantity: 4 },
            { tableId: 'herb_table', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'grimy_coin_pouch', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'flux_rune', chance: "1/20", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'ember_talisman', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'goblin_champion_scroll', chance: 1/5000, minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Humanoid, MonsterType.Armored], attackSpeed: 4, respawnTime: 12000, aggressive: false, attackStyle: 'slash',
    },
    {
        id: 'goblin_scout', name: 'Goblin Scout', level: 7, maxHp: 18, attack: 5,
        stabDefence: 4, slashDefence: 5, crushDefence: 3, rangedDefence: 2, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/goblin_scout.png',
        alwaysDrops: true,
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'goblin_hide', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gust_rune', chance: "3/20", minQuantity: 2, maxQuantity: 8 },
            { itemId: 'stone_rune', chance: "3/20", minQuantity: 2, maxQuantity: 8 },
            { tableId: 'herb_table', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_rune', chance: "1/10", minQuantity: 2, maxQuantity: 6 },
            { itemId: 'binding_rune', chance: "1/10", minQuantity: 2, maxQuantity: 6 },
            { itemId: 'grimy_coin_pouch', chance: "7/100", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'flux_rune', chance: "1/20", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'goblin_mail', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_talisman', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'goblin_champion_scroll', chance: 1/5000, minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Humanoid, MonsterType.Armored], attackSpeed: 4, respawnTime: 30000, aggressive: true, alwaysAggressive: true, attackStyle: 'stab',
    },
    {
        id: 'goblin_thrower', name: 'Goblin Thrower', level: 14, maxHp: 25, attack: 1, ranged: 12,
        stabDefence: 6, slashDefence: 8, crushDefence: 4, rangedDefence: 2, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/goblin_thrower.png',
        alwaysDrops: true,
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: "3/10", minQuantity: 3, maxQuantity: 10 },
            { itemId: 'stone_rune', chance: "3/10", minQuantity: 3, maxQuantity: 10 },
            { itemId: 'goblin_hide', chance: "1/4", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_rune', chance: "1/4", minQuantity: 3, maxQuantity: 8 },
            { itemId: 'binding_rune', chance: "1/4", minQuantity: 3, maxQuantity: 8 },
            { itemId: 'flux_rune', chance: "3/20", minQuantity: 2, maxQuantity: 5 },
            { tableId: 'herb_table', chance: "3/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'grimy_coin_pouch', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_talisman', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'goblin_champion_scroll', chance: 1/5000, minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Humanoid, MonsterType.Armored], attackSpeed: 3, respawnTime: 30000, attackStyle: 'ranged', aggressive: true, alwaysAggressive: true,
    },
    {
        id: 'goblin_brute', name: 'Goblin Brute', level: 24, maxHp: 40, attack: 18,
        stabDefence: 15, slashDefence: 18, crushDefence: 12, rangedDefence: 10, magicDefence: 5,
        iconUrl: '/assets/npcChatHeads/goblin_brute.png',
        alwaysDrops: true,
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'aqua_rune', chance: "3/20", minQuantity: 5, maxQuantity: 12 },
            { itemId: 'stone_rune', chance: "3/20", minQuantity: 5, maxQuantity: 12 },
            { itemId: 'ember_rune', chance: "3/20", minQuantity: 5, maxQuantity: 12 },
            { itemId: 'binding_rune', chance: "3/20", minQuantity: 5, maxQuantity: 12 },
            { itemId: 'goblin_hide', chance: "1/10", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'grimy_coin_pouch', chance: "1/10", minQuantity: 1, maxQuantity: 2 },
            { tableId: 'herb_table', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'flux_rune', chance: "1/25", minQuantity: 4, maxQuantity: 10 },
            { itemId: 'steel_battleaxe', chance: "1/200", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_talisman', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'nexus_rune', chance: "1/400", minQuantity: 1, maxQuantity: 5 },
        ],
        tertiaryDrops: [
            { itemId: 'goblin_champion_scroll', chance: 1/5000, minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Humanoid, MonsterType.Armored], attackSpeed: 5, respawnTime: 120000,
        specialAttacks: [{ name: 'Crushing Blow', chance: 0.5, effect: 'damage_multiplier', value: 1.5 }],
        aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'grumlok_goblin_king', name: 'Grumlok, the Goblin King', level: 82, maxHp: 120, attack: 30,
        stabDefence: 120, slashDefence: 126, crushDefence: -36, rangedDefence: 166, magicDefence: -20,
        iconUrl: '/assets/npcChatHeads/grumlok_goblin_king.png',
        alwaysDrops: true,
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'flux_rune', minQuantity: 20, maxQuantity: 40 },
        ],
        mainDrops: [
            { itemId: 'grimy_coin_pouch', chance: "1/4", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'verdant_rune', chance: "1/5", minQuantity: 15, maxQuantity: 30 },
            { tableId: 'herb_table', chance: "3/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'goblin_dungeon_map', chance: "1/16", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'yew_logs', chance: "1/10", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'hex_rune', chance: "1/10", minQuantity: 8, maxQuantity: 15 },
            { itemId: 'nexus_rune', chance: "3/40", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'passage_rune', chance: "1/20", minQuantity: 5, maxQuantity: 12 },
            { itemId: 'anima_rune', chance: "1/40", minQuantity: 2, maxQuantity: 8 },
        ],
        tertiaryDrops: [
            { itemId: 'goblin_champion_scroll', chance: 1/1000, minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Humanoid, MonsterType.Armored], attackSpeed: 4, respawnTime: 600000,
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
            { itemId: 'gust_rune', chance: "1/5", minQuantity: 2, maxQuantity: 8 },
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 2, maxQuantity: 8 },
            { tableId: 'herb_table', chance: "3/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'grimy_coin_pouch', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Humanoid], attackSpeed: 4, respawnTime: 45000, aggressive: true, attackStyle: 'slash',
    },
    {
        id: 'highwayman', name: 'Highwayman', level: 21, maxHp: 35, attack: 16,
        stabDefence: 18, slashDefence: 20, crushDefence: 16, rangedDefence: 15, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/highwayman.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'stone_rune', chance: "1/4", minQuantity: 5, maxQuantity: 12 },
            { itemId: 'gust_rune', chance: "9/40", minQuantity: 5, maxQuantity: 12 },
            { tableId: 'herb_table', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_rune', chance: "1/5", minQuantity: 3, maxQuantity: 10 },
            { itemId: 'grimy_coin_pouch', chance: "3/25", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'lost_heirloom', chance: "1/200", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Humanoid], attackSpeed: 3, respawnTime: 60000, aggressive: true, attackStyle: 'slash',
    },
    {
        id: 'bandit_marksman', name: 'Bandit Marksman', level: 27, maxHp: 30, attack: 1, ranged: 32,
        stabDefence: 24, slashDefence: 26, crushDefence: 50, rangedDefence: 35, magicDefence: 22,
        iconUrl: '/assets/npcChatHeads/bandit_marksman.png',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'iron_arrow', chance: "3/10", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'gust_rune', chance: "1/5", minQuantity: 8, maxQuantity: 18 },
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 8, maxQuantity: 18 },
            { tableId: 'herb_table', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_rune', chance: "1/10", minQuantity: 6, maxQuantity: 15 },
            { itemId: 'binding_rune', chance: "1/10", minQuantity: 4, maxQuantity: 12 },
        ],
        types: [MonsterType.Humanoid], attackSpeed: 3, respawnTime: 45000, attackStyle: 'ranged', aggressive: true, alwaysAggressive: true
    },
    {
        id: 'bandit_bruiser', name: 'Bandit Bruiser', level: 36, maxHp: 61, attack: 37,
        stabDefence: 60, slashDefence: 58, crushDefence: 62, rangedDefence: 58, magicDefence: -10,
        iconUrl: '/assets/npcChatHeads/bandit_bruiser.png',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: "1/5", minQuantity: 10, maxQuantity: 25 },
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 10, maxQuantity: 25 },
            { itemId: 'ember_rune', chance: "1/5", minQuantity: 8, maxQuantity: 20 },
            { itemId: 'binding_rune', chance: "3/20", minQuantity: 6, maxQuantity: 18 },
            { tableId: 'herb_table', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'flux_rune', chance: "1/10", minQuantity: 3, maxQuantity: 10 },
            { itemId: 'bandit_brew', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Humanoid, MonsterType.Armored], attackSpeed: 4, respawnTime: 45000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
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
            { itemId: 'flux_rune', chance: "19/50", minQuantity: 15, maxQuantity: 30 },
            { itemId: 'verdant_rune', chance: "3/10", minQuantity: 10, maxQuantity: 20 },
            { tableId: 'herb_table', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bandit_leaders_cutlass', chance: "1/100", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'spiked_cape', chance: "1/200", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'passage_talisman', chance: "1/500", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Humanoid, MonsterType.Armored], attackSpeed: 3, respawnTime: 180000, aggressive: true, alwaysAggressive: true,
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
            { itemId: 'verdant_rune', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Undead], attackSpeed: 5, respawnTime: 30000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'training_dummy', name: 'Training Dummy', level: 1, maxHp: 1000, attack: 0, 
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:wooden-sign.svg',
        types: [MonsterType.Humanoid], attackSpeed: 1000, respawnTime: 1000, aggressive: false, attackStyle: 'crush', customMaxHit: 0,},
    {
        id: 'young_hill_giant', name: 'Young Hill Giant', level: 22, maxHp: 45, attack: 20,
        stabDefence: 18, slashDefence: 18, crushDefence: 22, rangedDefence: 15, magicDefence: -5,
        iconUrl: '/assets/npcChatHeads/young_hill_giant.png',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'stone_rune', chance: "1/4", minQuantity: 5, maxQuantity: 15 },
            { tableId: 'herb_table', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'iron_warhammer', chance: "1/100", minQuantity: 1, maxQuantity: 1 }
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 1/32, minQuantity: 1, maxQuantity: 1 }
        ],
        types: [MonsterType.Humanoid], attackSpeed: 6, respawnTime: 60000, aggressive: true, attackStyle: 'crush',
    },
    // --- New Sunken Labyrinth Humanoids ---
    { id: 'abyssal_knight', name: 'Abyssal Knight', level: 65, maxHp: 100, attack: 55, stabDefence: 80, slashDefence: 80, crushDefence: 70, rangedDefence: 85, magicDefence: 10, iconUrl: 'https://api.iconify.design/game-icons:knight-helmet.svg', guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }], mainDrops: [{ itemId: 'adamantite_platebody', chance: "1/128", minQuantity: 1, maxQuantity: 1 }, { itemId: 'adamantite_platelegs', chance: "1/128", minQuantity: 1, maxQuantity: 1 }, { itemId: 'runic_kiteshield', chance: "1/256", minQuantity: 1, maxQuantity: 1 }, { itemId: 'cooked_swordfish', chance: "1/4", minQuantity: 1, maxQuantity: 2, noted: true }, { itemId: 'adamantite_bar', chance: "1/10", minQuantity: 1, maxQuantity: 3, noted: true }], tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1/128, minQuantity: 1, maxQuantity: 1 }], types: [MonsterType.Humanoid, MonsterType.Armored], attackSpeed: 5, respawnTime: 90000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash' },
];