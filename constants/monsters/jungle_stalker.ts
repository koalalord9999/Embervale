

import { Monster, MonsterType } from '../../types';

export const jungle_stalker: Monster = {
    id: 'jungle_stalker', name: 'Jungle Stalker', level: 41, maxHp: 80, attack: 42,
    stabDefence: 35,
    slashDefence: 40,
    crushDefence: 30,
    rangedDefence: 25,
    magicDefence: 15,
    iconUrl: '/assets/npcChatHeads/jungle_stalker.png',
    drops: [ { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 } ],
    monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 100000, aggressive: true, alwaysAggressive: true,
    attackStyle: 'slash',
};