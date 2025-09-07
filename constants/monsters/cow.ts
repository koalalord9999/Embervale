

import { Monster, MonsterType } from '../../types';

export const cow: Monster = {
    id: 'cow',
    name: 'Cow',
    level: 2,
    maxHp: 10,
    attack: 1,
    stabDefence: 1,
    slashDefence: 1,
    crushDefence: 1,
    rangedDefence: 1,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/cow.png',
    drops: [
        { itemId: 'raw_beef', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'cowhide', chance: 1, minQuantity: 1, maxQuantity: 1 },
    ],
    monsterType: MonsterType.Standard,
    attackSpeed: 5,
    respawnTime: 15000,
    aggressive: false,
    attackStyle: 'crush',
};