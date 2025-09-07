

import { Monster, MonsterType } from '../../types';

export const stone_golem: Monster = {
    id: 'stone_golem', name: 'Stone Golem', level: 35, maxHp: 100, attack: 28,
    stabDefence: 30,
    slashDefence: 30,
    crushDefence: 10,
    rangedDefence: 40,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/stone_golem.png',
    drops: [ { itemId: 'golem_core', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'iron_ore', chance: 1, minQuantity: 5, maxQuantity: 10 }, { itemId: 'coal', chance: 1, minQuantity: 10, maxQuantity: 20 }, { itemId: 'iron_bar', chance: 0.2, minQuantity: 1, maxQuantity: 3 }, { itemId: 'golem_core_shard', chance: 0.5, minQuantity: 1, maxQuantity: 1 } ],
    monsterType: MonsterType.Armored, attackSpeed: 6, respawnTime: 120000, aggressive: true, alwaysAggressive: true,
    attackStyle: 'crush',
};
