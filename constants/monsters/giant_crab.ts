

import { Monster, MonsterType } from '../../types';

export const giant_crab: Monster = {
    id: 'giant_crab', name: 'Giant Crab', level: 9, maxHp: 25, attack: 8,
    stabDefence: 15,
    slashDefence: 15,
    crushDefence: 12,
    rangedDefence: 10,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/giant_crab.png',
    drops: [ { itemId: 'giant_crab_meat', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'giant_crab_claw', chance: 0.2, minQuantity: 1, maxQuantity: 1 } ],
    monsterType: MonsterType.Armored, attackSpeed: 4, respawnTime: 30000, aggressive: true, alwaysAggressive: true,
    attackStyle: 'crush',
};