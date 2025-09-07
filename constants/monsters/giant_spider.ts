

import { Monster, MonsterType } from '../../types';

export const giant_spider: Monster = {
    id: 'giant_spider',
    name: 'Giant Spider',
    level: 4,
    maxHp: 15,
    attack: 3,
    stabDefence: 2,
    slashDefence: 2,
    crushDefence: 2,
    rangedDefence: 4,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/giant_spider.png',
    drops: [
        { itemId: 'spider_silk', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'spider_eggs', chance: 0.5, minQuantity: 1, maxQuantity: 3 },
    ],
    monsterType: MonsterType.Standard,
    attackSpeed: 4,
    respawnTime: 30000,
    aggressive: false,
    attackStyle: 'stab',
};
