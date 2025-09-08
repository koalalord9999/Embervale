

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
    isInstantRespawnOn: boolean;
}

export const useKillHandler = (deps: KillHandlerDependencies) => {
    const { questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn } = deps;

    const handleKill = useCallback((uniqueInstanceId: string) => {
        const parts = uniqueInstanceId.split(':');
        const monsterId = parts.length > 1 ? parts[1] : parts[0];
        
        questLogic.checkQuestProgressOnKill(monsterId);
        repeatableQuests.checkProgressOnKill(monsterId);
        slayer.checkKill(monsterId);

        const monsterData = MONSTERS[monsterId];
        if (monsterData && monsterData.respawnTime) {
            const respawnTimestamp = isInstantRespawnOn ? Date.now() : Date.now() + monsterData.respawnTime;
            setMonsterRespawnTimers(prev => ({
                ...prev,
                [uniqueInstanceId]: respawnTimestamp,
            }));
        }
    }, [questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn]);

    return { handleKill };
};