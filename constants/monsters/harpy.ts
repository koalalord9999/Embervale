

import { Monster, MonsterType } from '../../types';

export const harpy: Monster = {
    id: 'harpy', name: 'Harpy', level: 22, maxHp: 35, attack: 20,
    stabDefence: 12,
    slashDefence: 12,
    crushDefence: 10,
    rangedDefence: 15,
    magicDefence: 5,
    iconUrl: '/assets/npcChatHeads/harpy.png',
    drops: [ { itemId: 'feathers', chance: 1, minQuantity: 10, maxQuantity: 30 }, { itemId: 'harpy_feather', chance: 0.2, minQuantity: 1, maxQuantity: 1 } ],
    monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 40000, attackStyle: 'ranged', aggressive: true, alwaysAggressive: true
};