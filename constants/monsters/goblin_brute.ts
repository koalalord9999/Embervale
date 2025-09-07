

import { Monster, MonsterType } from '../../types';

export const goblin_brute: Monster = {
    id: 'goblin_brute', name: 'Goblin Brute', level: 24, maxHp: 40, attack: 18,
    stabDefence: 15,
    slashDefence: 18,
    crushDefence: 12,
    rangedDefence: 10,
    magicDefence: 5,
    iconUrl: '/assets/npcChatHeads/goblin_brute.png',
    drops: [ { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'bronze_battleaxe', chance: 0.05, minQuantity: 1, maxQuantity: 1 }, { itemId: 'goblin_hide', chance: 0.3, minQuantity: 1, maxQuantity: 2 }, { itemId: 'grimy_coin_pouch', chance: 0.1, minQuantity: 1, maxQuantity: 2 } ],
    monsterType: MonsterType.Armored, attackSpeed: 5, respawnTime: 120000,
    specialAttacks: [{ name: 'Crushing Blow', chance: 0.5, effect: 'damage_multiplier', value: 1.5 }],
    aggressive: true, alwaysAggressive: true,
    attackStyle: 'crush',
};