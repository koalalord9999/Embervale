

import { SkillName, PlayerSkill } from '../types';

export const ALL_SKILLS: PlayerSkill[] = Object.values(SkillName).map(name => ({
  name,
  level: name === SkillName.Hitpoints ? 10 : 1,
  xp: name === SkillName.Hitpoints ? 1640 : 0, // XP for level 10
}));

export const XP_TABLE: number[] = [0];
for (let i = 1; i <= 100; i++) {
    // A slower, more classic XP curve. Total XP for level 99 is now substantially higher.
    XP_TABLE[i] = (XP_TABLE[i-1] || 0) + Math.floor(i - 1 + 120 * Math.pow(2, (i - 1) / 7.5));
}