

import { Monster, MonsterType } from '../../types';

export const coral_golem: Monster = {
    id: 'coral_golem', name: 'Coral Golem', level: 51, maxHp: 120, attack: 35,
    stabDefence: 55, slashDefence: 55, crushDefence: 25, rangedDefence: 70, magicDefence: 15,
    iconUrl: '/assets/npcChatHeads/coral_golem.png',
    drops: [
        { itemId: 'uncut_ruby', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_sword', chance: 0.002, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_full_helm', chance: 0.002, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_platebody', chance: 0.002, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_platelegs', chance: 0.002, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'aquatite_kiteshield', chance: 0.002, minQuantity: 1, maxQuantity: 1 },
    ],
    monsterType: MonsterType.Armored, attackSpeed: 5, respawnTime: 150000, aggressive: true, alwaysAggressive: true,
    attackStyle: 'crush',
};