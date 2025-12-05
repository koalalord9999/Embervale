import { useState, useMemo, useCallback } from 'react';
import { PlayerSkill, SkillName } from '../../types';
import { ALL_SKILLS, XP_TABLE } from '../../constants';

const getLevelForXp = (xp: number): number => {
    const level = XP_TABLE.findIndex(xpVal => xpVal > xp);
    return level === -1 ? 99 : level;
};

export const usePrototypeCharacter = (initialSkills: PlayerSkill[], initialHp: number, addLog: (msg: string) => void) => {
    const [skills, setSkills] = useState<(PlayerSkill & { currentLevel: number })[]>(
        (initialSkills || ALL_SKILLS).map((s: PlayerSkill) => {
            const level = getLevelForXp(s.xp);
            return { ...s, level, currentLevel: level };
        })
    );

    const playerMaxHp = useMemo(() => skills.find(s => s.name === SkillName.Hitpoints)?.level ?? 10, [skills]);
    const [playerHp, setPlayerHp] = useState(initialHp ?? playerMaxHp);

    const addXp = useCallback((skillName: SkillName, amount: number) => {
        if (amount <= 0) return;
        
        addLog(`Gained ${amount.toLocaleString()} ${skillName} XP.`);

        setSkills(prevSkills => {
            const newSkills = [...prevSkills];
            const skillIndex = newSkills.findIndex(s => s.name === skillName);
            if (skillIndex !== -1) {
                const oldSkill = newSkills[skillIndex];
                const newXp = oldSkill.xp + amount;
                const oldLevel = oldSkill.level;
                const newLevel = getLevelForXp(newXp);
                
                const finalLevel = Math.min(99, newLevel);
                newSkills[skillIndex] = { ...oldSkill, xp: newXp, level: finalLevel, currentLevel: finalLevel };

                if (finalLevel > oldLevel) {
                    addLog(`Congratulations, you just advanced a ${skillName} level! Your ${skillName} level is now ${finalLevel}.`);
                    if (skillName === SkillName.Hitpoints) {
                        setPlayerHp(hp => hp + (finalLevel - oldLevel));
                    }
                }
            }
            return newSkills;
        });
    }, [addLog]);

    return {
        skills,
        playerHp,
        setPlayerHp,
        playerMaxHp,
        addXp,
    };
};
