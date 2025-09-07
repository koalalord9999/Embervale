

import { Monster, MonsterType } from '../../types';

export const goblin_scout: Monster = {
    id: 'goblin_scout', name: 'Goblin Scout', level: 7, maxHp: 18, attack: 5,
    stabDefence: 4,
    slashDefence: 5,
    crushDefence: 3,
    rangedDefence: 2,
    magicDefence: 0,
    iconUrl: '/assets/npcChatHeads/goblin_scout.png',
    drops: [ { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'goblin_mail', chance: 0.1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'goblin_hide', chance: 0.5, minQuantity: 1, maxQuantity: 1 }, { itemId: 'grimy_coin_pouch', chance: 0.05, minQuantity: 1, maxQuantity: 1 }, ],
    monsterType: MonsterType.Armored, attackSpeed: 4, respawnTime: 30000, aggressive: true, alwaysAggressive: true,
    attackStyle: 'stab',
};