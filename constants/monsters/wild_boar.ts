

import { Monster, MonsterType } from '../../types';

export const wild_boar: Monster = {
    id: 'wild_boar', name: 'Wild Boar', level: 6, maxHp: 22, attack: 7,
    stabDefence: 4,
    slashDefence: 4,
    crushDefence: 6,
    rangedDefence: 2,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/wild_boar.png',
    drops: [ { itemId: 'raw_boar_meat', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'boar_hide', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'boar_tusk', chance: 0.3, minQuantity: 1, maxQuantity: 1 } ],
    monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 30000, aggressive: true, alwaysAggressive: true,
    attackStyle: 'crush',
};
