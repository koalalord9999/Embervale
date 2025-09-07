

import { Monster, MonsterType } from '../../types';

export const goblin_thrower: Monster = {
    id: 'goblin_thrower', name: 'Goblin Thrower', level: 14, maxHp: 25, attack: 12,
    stabDefence: 6,
    slashDefence: 8,
    crushDefence: 4,
    rangedDefence: 2,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/goblin_thrower.png',
    drops: [ { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'grimy_coin_pouch', chance: 0.8, minQuantity: 1, maxQuantity: 1 }, { itemId: 'goblin_hide', chance: 0.4, minQuantity: 1, maxQuantity: 1 } ],
    monsterType: MonsterType.Armored, attackSpeed: 3, respawnTime: 30000, attackStyle: 'ranged', aggressive: true, alwaysAggressive: true,
};