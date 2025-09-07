

import { Monster, MonsterType } from '../../types';

export const swamp_horror: Monster = {
    id: 'swamp_horror', name: 'Swamp Horror', level: 28, maxHp: 60, attack: 22,
    stabDefence: 20,
    slashDefence: 20,
    crushDefence: 25,
    rangedDefence: 15,
    magicDefence: 10,
    iconUrl: '/assets/npcChatHeads/swamp_horror.png',
    drops: [ { itemId: 'uncut_emerald', chance: 0.1, minQuantity: 1, maxQuantity: 1 } ],
    monsterType: MonsterType.Standard, attackSpeed: 5, respawnTime: 60000, aggressive: true, alwaysAggressive: true,
    attackStyle: 'crush',
};