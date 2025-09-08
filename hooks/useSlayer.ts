

import { useState, useCallback } from 'react';
import { PlayerSlayerTask, SkillName } from '../types';
import { MONSTERS } from '../constants';

interface SlayerDependencies {
    addLog: (message: string) => void;
    addXp: (skill: SkillName, amount: number) => void;
    combatLevel: number;
}

const SLAYER_MONSTERS_BY_LEVEL: Record<number, string[]> = {
    1: ['giant_rat', 'cow', 'chicken', 'goblin'],
    10: ['giant_spider', 'cloaked_bandit', 'highwayman'],
    20: ['goblin_brute', 'harpy', 'mountain_goat'],
    40: ['stone_golem', 'bog_serpent'],
};

const getAssignableMonsters = (combatLevel: number): string[] => {
    let available: string[] = [];
    for (const level in SLAYER_MONSTERS_BY_LEVEL) {
        if (combatLevel >= parseInt(level)) {
            available = [...available, ...SLAYER_MONSTERS_BY_LEVEL[level]];
        }
    }
    return available.length > 0 ? available : SLAYER_MONSTERS_BY_LEVEL[1];
};


export const useSlayer = (initialTask: PlayerSlayerTask | null, deps: SlayerDependencies) => {
    const [slayerTask, setSlayerTask] = useState<PlayerSlayerTask | null>(initialTask);
    const { addLog, addXp, combatLevel } = deps;

    const getTask = useCallback(() => {
        const assignable = getAssignableMonsters(combatLevel);
        const monsterId = assignable[Math.floor(Math.random() * assignable.length)];
        const monster = MONSTERS[monsterId];
        
        const baseCount = 10;
        const requiredCount = Math.floor(baseCount + Math.random() * 10) + Math.floor(combatLevel / 5);

        const newTask: PlayerSlayerTask = {
            monsterId,
            requiredCount,
            progress: 0,
            isComplete: false,
        };
        setSlayerTask(newTask);
        addLog(`Your new slayer task is to kill ${requiredCount} ${monster.name}s.`);
    }, [addLog, combatLevel]);

    const handleSlayerMasterInteraction = useCallback(() => {
        if (!slayerTask) {
            getTask();
        } else if (slayerTask.isComplete) {
            const monster = MONSTERS[slayerTask.monsterId];
            const xpReward = monster.maxHp * slayerTask.requiredCount;
            addLog(`You report your success to Kaelen. Well done! You've earned ${xpReward} Slayer XP.`);
            addXp(SkillName.Slayer, xpReward);
            setSlayerTask(null);
            // Optionally chain into getting a new task
            getTask();
        } else {
            const monster = MONSTERS[slayerTask.monsterId];
            const remaining = slayerTask.requiredCount - slayerTask.progress;
            addLog(`Kaelen tells you: "You still need to slay ${remaining} more ${monster.name}s."`);
        }
    }, [slayerTask, getTask, addLog, addXp]);
    
    const checkKill = useCallback((monsterId: string) => {
        setSlayerTask(prev => {
            if (prev && prev.monsterId === monsterId && !prev.isComplete) {
                const newProgress = prev.progress + 1;
                if (newProgress >= prev.requiredCount) {
                    addLog(`You have completed your slayer task! Return to Kaelen in Silverhaven for your reward.`);
                    return { ...prev, progress: newProgress, isComplete: true };
                }
                return { ...prev, progress: newProgress };
            }
            return prev;
        });
    }, [addLog]);

    return {
        slayerTask,
        setSlayerTask,
        handleSlayerMasterInteraction,
        checkKill,
    };
};