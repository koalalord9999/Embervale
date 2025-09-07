

import { Monster, MonsterType } from '../../types';

export const bandit_marksman: Monster = {
    id: 'bandit_marksman', name: 'Bandit Marksman', level: 14, maxHp: 30, attack: 15,
    stabDefence: 8,
    slashDefence: 10,
    crushDefence: 6,
    rangedDefence: 5,
    magicDefence: 2,
    iconUrl: '/assets/npcChatHeads/bandit_marksman.png',
    drops: [
        { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'iron_arrow', chance: 0.5, minQuantity: 5, maxQuantity: 15 },
        { tableId: 'herb_table', chance: 0.5 }
    ],
    monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 45000, attackStyle: 'ranged', aggressive: true, alwaysAggressive: true
};
