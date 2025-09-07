

import { Monster, MonsterType } from '../../types';

export const giant_toad: Monster = {
    id: 'giant_toad', name: 'Giant Toad', level: 15, maxHp: 28, attack: 12,
    stabDefence: 8,
    slashDefence: 8,
    crushDefence: 10,
    rangedDefence: 5,
    magicDefence: 5,
    iconUrl: '/assets/npcChatHeads/giant_toad.png',
    drops: [
        { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'spiked_toad_skin', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
    ],
    monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 30000, aggressive: true,
    attackStyle: 'crush',
};