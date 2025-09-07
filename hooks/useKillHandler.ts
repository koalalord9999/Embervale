import React, { useCallback } from 'react';
import { useQuestLogic } from './useQuestLogic';
import { useRepeatableQuests } from './useRepeatableQuests';
import { useSlayer } from './useSlayer';
import { MONSTERS } from '../constants';

interface KillHandlerDependencies {
    questLogic: ReturnType<typeof useQuestLogic>;
    repeatableQuests: ReturnType<typeof useRepeatableQuests>;
    slayer: ReturnType<typeof useSlayer>;
    setMonsterRespawnTimers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const useKillHandler = (deps: KillHandlerDependencies) => {
    const { questLogic, repeatableQuests, slayer, setMonsterRespawnTimers } = deps;

    const handleKill = useCallback((uniqueInstanceId: string) => {
        const parts = uniqueInstanceId.split(':');
        const monsterId = parts.length > 1 ? parts[1] : parts[0];
        
        questLogic.checkQuestProgressOnKill(monsterId);
        repeatableQuests.checkProgressOnKill(monsterId);
        slayer.checkKill(monsterId);

        const monsterData = MONSTERS[monsterId];
        if (monsterData && monsterData.respawnTime) {
            setMonsterRespawnTimers(prev => ({
                ...prev,
                [uniqueInstanceId]: Date.now() + monsterData.respawnTime,
            }));
        }
    }, [questLogic, repeatableQuests, slayer, setMonsterRespawnTimers]);

    return { handleKill };
};
