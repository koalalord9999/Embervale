

import { Monster, MonsterType } from '../../types';

export const mountain_goat: Monster = {
    id: 'mountain_goat', name: 'Mountain Goat', level: 18, maxHp: 30, attack: 15,
    stabDefence: 10,
    slashDefence: 10,
    crushDefence: 12,
    rangedDefence: 8,
    magicDefence: 5,
    iconUrl: '/assets/npcChatHeads/mountain_goat.png',
    drops: [
        { itemId: 'raw_beef', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'unicorn_horn_dust', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
    ],
    monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 30000, aggressive: true,
    attackStyle: 'crush',
};