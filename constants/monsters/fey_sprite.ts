

import { Monster, MonsterType } from '../../types';

export const fey_sprite: Monster = {
    id: 'fey_sprite', name: 'Fey Sprite', level: 20, maxHp: 30, attack: 15,
    stabDefence: 18,
    slashDefence: 18,
    crushDefence: 18,
    rangedDefence: 25,
    magicDefence: 25,
    iconUrl: '/assets/npcChatHeads/fey_sprite.png',
    drops: [
        { itemId: 'fey_dust', chance: 0.8, minQuantity: 1, maxQuantity: 3 },
        { itemId: 'enchanted_bark', chance: 0.3, minQuantity: 1, maxQuantity: 1 },
    ],
    monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 45000, attackStyle: 'ranged', aggressive: false
};