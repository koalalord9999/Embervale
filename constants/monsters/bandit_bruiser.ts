

import { Monster, MonsterType } from '../../types';

export const bandit_bruiser: Monster = {
    id: 'bandit_bruiser', name: 'Bandit Bruiser', level: 15, maxHp: 40, attack: 12,
    stabDefence: 10,
    slashDefence: 12,
    crushDefence: 8,
    rangedDefence: 5,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/bandit_bruiser.png',
    drops: [
        { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'bandit_brew', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
        { tableId: 'herb_table', chance: 0.5 }
    ],
    monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 45000, aggressive: true, alwaysAggressive: true,
    attackStyle: 'crush',
};
