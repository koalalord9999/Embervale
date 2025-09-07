

import { Monster, MonsterType } from '../types';

export const humanoids: Monster[] = [
    {
        id: 'goblin', name: 'Goblin', level: 2, maxHp: 8, attack: 1,
        stabDefence: 1, slashDefence: 2, crushDefence: 0, rangedDefence: 0, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/goblin.png',
        drops: [ { itemId: 'goblin_hide', chance: 0.8, minQuantity: 1, maxQuantity: 1 }, { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'grimy_coin_pouch', chance: 0.05, minQuantity: 1, maxQuantity: 1 }, ],
        monsterType: MonsterType.Armored, attackSpeed: 4, respawnTime: 30000, aggressive: false, attackStyle: 'slash',
    },
    {
        id: 'goblin_scout', name: 'Goblin Scout', level: 7, maxHp: 18, attack: 5,
        stabDefence: 4, slashDefence: 5, crushDefence: 3, rangedDefence: 2, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/goblin_scout.png',
        drops: [ { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'goblin_mail', chance: 0.1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'goblin_hide', chance: 0.5, minQuantity: 1, maxQuantity: 1 }, { itemId: 'grimy_coin_pouch', chance: 0.05, minQuantity: 1, maxQuantity: 1 }, ],
        monsterType: MonsterType.Armored, attackSpeed: 4, respawnTime: 30000, aggressive: true, alwaysAggressive: true, attackStyle: 'stab',
    },
    {
        id: 'goblin_thrower', name: 'Goblin Thrower', level: 14, maxHp: 25, attack: 12,
        stabDefence: 6, slashDefence: 8, crushDefence: 4, rangedDefence: 2, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/goblin_thrower.png',
        drops: [ { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'grimy_coin_pouch', chance: 0.8, minQuantity: 1, maxQuantity: 1 }, { itemId: 'goblin_hide', chance: 0.4, minQuantity: 1, maxQuantity: 1 } ],
        monsterType: MonsterType.Armored, attackSpeed: 3, respawnTime: 30000, attackStyle: 'ranged', aggressive: true, alwaysAggressive: true,
    },
    {
        id: 'goblin_brute', name: 'Goblin Brute', level: 24, maxHp: 40, attack: 18,
        stabDefence: 15, slashDefence: 18, crushDefence: 12, rangedDefence: 10, magicDefence: 5,
        iconUrl: '/assets/npcChatHeads/goblin_brute.png',
        drops: [ { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'bronze_battleaxe', chance: 0.05, minQuantity: 1, maxQuantity: 1 }, { itemId: 'goblin_hide', chance: 0.3, minQuantity: 1, maxQuantity: 2 }, { itemId: 'grimy_coin_pouch', chance: 0.1, minQuantity: 1, maxQuantity: 2 } ],
        monsterType: MonsterType.Armored, attackSpeed: 5, respawnTime: 120000,
        specialAttacks: [{ name: 'Crushing Blow', chance: 0.5, effect: 'damage_multiplier', value: 1.5 }],
        aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'grumlok_goblin_king', name: 'Grumlok, the Goblin King', level: 30, maxHp: 80, attack: 25,
        stabDefence: 20, slashDefence: 22, crushDefence: 15, rangedDefence: 18, magicDefence: 10,
        iconUrl: '/assets/npcChatHeads/grumlok_goblin_king.png',
        drops: [ { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'grimy_coin_pouch', chance: 0.3, minQuantity: 5, maxQuantity: 10 } ],
        monsterType: MonsterType.Armored, attackSpeed: 4, respawnTime: 600000,
        specialAttacks: [{ name: 'Royal Smash', chance: 0.3, effect: 'damage_multiplier', value: 2 }],
        aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'cloaked_bandit', name: 'Cloaked Bandit', level: 5, maxHp: 20, attack: 4,
        stabDefence: 3, slashDefence: 4, crushDefence: 2, rangedDefence: 1, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/cloaked_bandit.png',
        drops: [ { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'grimy_coin_pouch', chance: 0.1, minQuantity: 1, maxQuantity: 1 }, { tableId: 'herb_table', chance: 0.4 } ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 45000, aggressive: true, attackStyle: 'slash',
    },
    {
        id: 'highwayman', name: 'Highwayman', level: 12, maxHp: 35, attack: 10,
        stabDefence: 8, slashDefence: 10, crushDefence: 6, rangedDefence: 5, magicDefence: 2,
        iconUrl: '/assets/npcChatHeads/highwayman.png',
        drops: [ { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'grimy_coin_pouch', chance: 0.3, minQuantity: 1, maxQuantity: 2 }, { itemId: 'lost_heirloom', chance: 0.05, minQuantity: 1, maxQuantity: 1 }, { tableId: 'herb_table', chance: 0.6 } ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 60000, aggressive: true, attackStyle: 'slash',
    },
    {
        id: 'bandit_marksman', name: 'Bandit Marksman', level: 14, maxHp: 30, attack: 15,
        stabDefence: 8, slashDefence: 10, crushDefence: 6, rangedDefence: 5, magicDefence: 2,
        iconUrl: '/assets/npcChatHeads/bandit_marksman.png',
        drops: [ { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'iron_arrow', chance: 0.5, minQuantity: 5, maxQuantity: 15 }, { tableId: 'herb_table', chance: 0.5 } ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 45000, attackStyle: 'ranged', aggressive: true, alwaysAggressive: true
    },
    {
        id: 'bandit_bruiser', name: 'Bandit Bruiser', level: 15, maxHp: 40, attack: 12,
        stabDefence: 10, slashDefence: 12, crushDefence: 8, rangedDefence: 5, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/bandit_bruiser.png',
        drops: [ { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'bandit_brew', chance: 0.2, minQuantity: 1, maxQuantity: 1 }, { tableId: 'herb_table', chance: 0.5 } ],
        monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 45000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'bandit_leader', name: 'Bandit Leader', level: 20, maxHp: 60, attack: 18,
        stabDefence: 15, slashDefence: 18, crushDefence: 12, rangedDefence: 10, magicDefence: 5,
        iconUrl: '/assets/npcChatHeads/bandit_leader.png',
        drops: [ { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'bandit_leaders_cutlass', chance: 0.1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'stolen_caravan_goods', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'spiked_cape', chance: 0.05, minQuantity: 1, maxQuantity: 1 }, { tableId: 'herb_table', chance: 1 } ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 180000, aggressive: true, alwaysAggressive: true,
        specialAttacks: [{ name: 'Crippling Strike', chance: 0.3, effect: 'damage_multiplier', value: 1.5 }], attackStyle: 'slash',
    },
    {
        id: 'scarecrow', name: 'Scarecrow', level: 3, maxHp: 12, attack: 2,
        stabDefence: 8, slashDefence: 5, crushDefence: 2, rangedDefence: 1, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/scarecrow.png',
        drops: [ { itemId: 'straw', chance: 1, minQuantity: 2, maxQuantity: 5 } ],
        monsterType: MonsterType.Standard, attackSpeed: 5, respawnTime: 30000, aggressive: true, attackStyle: 'crush',
    },
];