

import { Monster, MonsterType } from '../../types';

export const giant_rat: Monster = {
  id: 'giant_rat',
  name: 'Giant Rat',
  level: 1,
  maxHp: 5,
  attack: 1,
  stabDefence: 0,
  slashDefence: 0,
  crushDefence: 0,
  rangedDefence: 0,
  magicDefence: 0,
  iconUrl: '/assets/npcChatHeads/giant_rat.png',
  drops: [
    { itemId: 'rat_tail', chance: 1, minQuantity: 1, maxQuantity: 1 },
    { itemId: 'bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
  ],
  monsterType: MonsterType.Standard,
  attackSpeed: 4,
  respawnTime: 20000,
  aggressive: false,
  attackStyle: 'stab',
};