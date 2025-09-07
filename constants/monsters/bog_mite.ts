

import { Monster, MonsterType } from '../../types';

export const bog_mite: Monster = {
    id: 'bog_mite', name: 'Bog Mite', level: 17, maxHp: 20, attack: 18,
    stabDefence: 5,
    slashDefence: 5,
    crushDefence: 8,
    rangedDefence: 10,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/bog_mite.png',
    drops: [],
    monsterType: MonsterType.Standard, attackSpeed: 2, respawnTime: 20000, aggressive: true, alwaysAggressive: true,
    attackStyle: 'stab',
};