

import { Monster, MonsterType } from '../../types';

export const shipwreck_specter: Monster = {
    id: 'shipwreck_specter', name: 'Shipwreck Specter', level: 39, maxHp: 75, attack: 38,
    stabDefence: 32,
    slashDefence: 32,
    crushDefence: 32,
    rangedDefence: 40,
    magicDefence: 40,
    iconUrl: '/assets/npcChatHeads/shipwreck_specter.png',
    drops: [ { itemId: 'driftwood_logs', chance: 0.2, minQuantity: 1, maxQuantity: 3 } ],
    monsterType: MonsterType.Undead, attackSpeed: 4, respawnTime: 80000, aggressive: true, alwaysAggressive: true,
    attackStyle: 'magic',
};