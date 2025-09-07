

import { Monster, MonsterType } from '../../types';

export const goblin: Monster = {
    id: 'goblin',
    name: 'Goblin',
    level: 2,
    maxHp: 8,
    attack: 1,
    stabDefence: 1,
    slashDefence: 2,
    crushDefence: 0,
    rangedDefence: 0,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/goblin.png',
    drops: [
        { itemId: 'goblin_hide', chance: 0.8, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'grimy_coin_pouch', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
    ],
    monsterType: MonsterType.Armored,
    attackSpeed: 4,
    respawnTime: 30000,
    aggressive: false,
    attackStyle: 'slash',
};