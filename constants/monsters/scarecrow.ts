

import { Monster, MonsterType } from '../../types';

export const scarecrow: Monster = {
    id: 'scarecrow', name: 'Scarecrow', level: 3, maxHp: 12, attack: 2,
    stabDefence: 8,
    slashDefence: 5,
    crushDefence: 2,
    rangedDefence: 1,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/scarecrow.png',
    drops: [ { itemId: 'straw', chance: 1, minQuantity: 2, maxQuantity: 5 } ],
    monsterType: MonsterType.Standard, attackSpeed: 5, respawnTime: 30000, aggressive: true,
    attackStyle: 'crush',
};