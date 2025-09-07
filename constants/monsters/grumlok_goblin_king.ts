

import { Monster, MonsterType } from '../../types';

export const grumlok_goblin_king: Monster = {
    id: 'grumlok_goblin_king', name: 'Grumlok, the Goblin King', level: 30, maxHp: 80, attack: 25,
    stabDefence: 20,
    slashDefence: 22,
    crushDefence: 15,
    rangedDefence: 18,
    magicDefence: 10,
    iconUrl: '/assets/npcChatHeads/grumlok_goblin_king.png',
    drops: [ { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'grimy_coin_pouch', chance: 0.3, minQuantity: 5, maxQuantity: 10 } ],
    monsterType: MonsterType.Armored, attackSpeed: 4, respawnTime: 600000,
    specialAttacks: [{ name: 'Royal Smash', chance: 0.3, effect: 'damage_multiplier', value: 2 }],
    aggressive: true, alwaysAggressive: true,
    attackStyle: 'crush',
};