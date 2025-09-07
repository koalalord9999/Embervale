

import { Monster, MonsterType } from '../../types';

export const ancient_sentinel: Monster = {
    id: 'ancient_sentinel', name: 'Ancient Sentinel', level: 51, maxHp: 150, attack: 40, 
    stabDefence: 60, slashDefence: 60, crushDefence: 30, rangedDefence: 80, magicDefence: 20,
    iconUrl: '/assets/npcChatHeads/ancient_sentinel.png',
    drops: [
        { itemId: 'ancient_gear', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_sword', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_full_helm', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_platebody', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_platelegs', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_kiteshield', chance: 0.005, minQuantity: 1, maxQuantity: 1 },
    ],
    monsterType: MonsterType.Armored, attackSpeed: 6, respawnTime: 180000, aggressive: true, alwaysAggressive: true,
    attackStyle: 'crush',
};