

import { Monster, MonsterType } from '../../types';

export const chicken: Monster = {
    id: 'chicken',
    name: 'Chicken',
    level: 1,
    maxHp: 4,
    attack: 1,
    stabDefence: 0,
    slashDefence: 0,
    crushDefence: 0,
    rangedDefence: 0,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/chicken.png',
    drops: [
        { itemId: 'raw_chicken', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'feathers', chance: 1, minQuantity: 1, maxQuantity: 20 },
    ],
    monsterType: MonsterType.Standard,
    attackSpeed: 4,
    respawnTime: 10000,
    aggressive: false,
    attackStyle: 'stab',
};