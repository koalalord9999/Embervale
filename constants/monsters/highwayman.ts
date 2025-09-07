

import { Monster, MonsterType } from '../../types';

export const highwayman: Monster = {
    id: 'highwayman',
    name: 'Highwayman',
    level: 12,
    maxHp: 35,
    attack: 10,
    stabDefence: 8,
    slashDefence: 10,
    crushDefence: 6,
    rangedDefence: 5,
    magicDefence: 2,
    iconUrl: '/assets/npcChatHeads/highwayman.png',
    drops: [
        { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'grimy_coin_pouch', chance: 0.3, minQuantity: 1, maxQuantity: 2 },
        { itemId: 'lost_heirloom', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
        { tableId: 'herb_table', chance: 0.6 }
    ],
    monsterType: MonsterType.Standard,
    attackSpeed: 3,
    respawnTime: 60000,
    aggressive: true,
    attackStyle: 'slash',
};
