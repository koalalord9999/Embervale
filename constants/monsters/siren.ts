

import { Monster, MonsterType } from '../../types';

export const siren: Monster = {
    id: 'siren', name: 'Siren', level: 44, maxHp: 90, attack: 55,
    stabDefence: 30,
    slashDefence: 30,
    crushDefence: 30,
    rangedDefence: 35,
    magicDefence: 35,
    iconUrl: '/assets/npcChatHeads/siren.png',
    drops: [ { itemId: 'sirens_hair', chance: 1, minQuantity: 1, maxQuantity: 1 } ],
    monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 240000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged',
    specialAttacks: [{ name: 'Deafening Shriek', chance: 0.2, effect: 'damage_multiplier', value: 1.5 }],
};