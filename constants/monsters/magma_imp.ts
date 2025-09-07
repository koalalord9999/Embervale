

import { Monster, MonsterType } from '../../types';

export const magma_imp: Monster = {
    id: 'magma_imp', name: 'Magma Imp', level: 43, maxHp: 60, attack: 50,
    stabDefence: 25,
    slashDefence: 25,
    crushDefence: 25,
    rangedDefence: 30,
    magicDefence: 30,
    iconUrl: '/assets/npcChatHeads/magma_imp.png',
    drops: [ { itemId: 'brimstone', chance: 0.3, minQuantity: 1, maxQuantity: 1 } ],
    monsterType: MonsterType.Standard, attackSpeed: 2, respawnTime: 90000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged'
};