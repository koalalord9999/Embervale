import { Monster, MonsterType } from '../../types';

export const cave_slime: Monster = {
  id: 'cave_slime',
  name: 'Cave Slime',
  level: 3,
  maxHp: 10,
  attack: 2,
  stabDefence: 3,
  slashDefence: 3,
  crushDefence: 1,
  rangedDefence: 5,
  magicDefence: 0,
  iconUrl: '/assets/npcChatHeads/cave_slime.png',
  drops: [
      { itemId: 'cave_slime_globule', chance: 0.8, minQuantity: 1, maxQuantity: 1 }
  ],
  monsterType: MonsterType.Standard,
  attackSpeed: 5,
  respawnTime: 25000,
  aggressive: false,
  attackStyle: 'crush',
};