

import { Monster, MonsterType } from '../../types';

export const cloaked_bandit: Monster = {
    id: 'cloaked_bandit',
    name: 'Cloaked Bandit',
    level: 5,
    maxHp: 20,
    attack: 4,
    stabDefence: 3,
    slashDefence: 4,
    crushDefence: 2,
    rangedDefence: 1,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/cloaked_bandit.png',
    drops: [
        { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'grimy_coin_pouch', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
        { tableId: 'herb_table', chance: 0.4 }
    ],
    monsterType: MonsterType.Standard,
    attackSpeed: 4,
    respawnTime: 45000,
    aggressive: true,
    attackStyle: 'slash',
};
