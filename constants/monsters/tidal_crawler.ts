

import { Monster, MonsterType } from '../../types';

export const tidal_crawler: Monster = {
    id: 'tidal_crawler', name: 'Tidal Crawler', level: 38, maxHp: 80, attack: 30,
    stabDefence: 45,
    slashDefence: 45,
    crushDefence: 40,
    rangedDefence: 30,
    magicDefence: 10,
    iconUrl: '/assets/npcChatHeads/tidal_crawler.png',
    drops: [ { itemId: 'raw_eel', chance: 0.1, minQuantity: 1, maxQuantity: 1 } ],
    monsterType: MonsterType.Armored, attackSpeed: 5, respawnTime: 70000, aggressive: true,
    attackStyle: 'crush',
};