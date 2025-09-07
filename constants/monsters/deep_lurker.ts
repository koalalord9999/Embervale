

import { Monster, MonsterType } from '../../types';

export const deep_lurker: Monster = {
    id: 'deep_lurker', name: 'Deep Lurker', level: 51, maxHp: 70, attack: 45, 
    stabDefence: 30, slashDefence: 35, crushDefence: 32, rangedDefence: 25, magicDefence: 20,
    iconUrl: '/assets/npcChatHeads/deep_lurker.png',
    drops: [
        { itemId: 'raw_eel', chance: 0.5, minQuantity: 1, maxQuantity: 2 },
        { itemId: 'aquatite_sword', chance: 0.001, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_full_helm', chance: 0.001, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_platebody', chance: 0.001, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_platelegs', chance: 0.001, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_kiteshield', chance: 0.001, minQuantity: 1, maxQuantity: 1 },
    ],
    monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 90000, aggressive: true, alwaysAggressive: true,
    attackStyle: 'slash',
};