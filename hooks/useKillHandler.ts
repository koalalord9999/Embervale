import React, { useCallback } from 'react';
import { useQuestLogic } from './useQuestLogic';
import { useRepeatableQuests } from './useRepeatableQuests';
import { useSlayer } from './useSlayer';
import { MONSTERS } from '../constants';
import { POIS } from '../data/pois';
import { WorldState } from '../types';
import { useInventory } from './useInventory';
import { useNavigation } from './useNavigation';

interface KillHandlerDependencies {
    questLogic: ReturnType<typeof useQuestLogic>;
    repeatableQuests: ReturnType<typeof useRepeatableQuests>;
    slayer: ReturnType<typeof useSlayer>;
    setMonsterRespawnTimers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    isInstantRespawnOn: boolean;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
    addLog: (message: string) => void;
    worldState: WorldState;
    inv: ReturnType<typeof useInventory>;
    navigation: ReturnType<typeof useNavigation>;
}

export const useKillHandler = (deps: KillHandlerDependencies) => {
    const { questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn, setWorldState, addLog, worldState, inv, navigation } = deps;

    const handleKill = useCallback((uniqueInstanceId: string, attackStyle?: 'melee' | 'ranged' | 'magic') => {
        const monsterId = uniqueInstanceId.split(':')[1];
        
        questLogic.checkQuestProgressOnKill(monsterId, attackStyle);
        repeatableQuests.checkProgressOnKill(monsterId);
        slayer.checkKill(monsterId);

        // Check for and grant quest combat rewards
        if (worldState.pendingQuestCombatReward) {
            const reward = worldState.pendingQuestCombatReward;
            inv.modifyItem(reward.itemId, reward.quantity, false, undefined, { bypassAutoBank: true });
            setWorldState(ws => ({ ...ws, pendingQuestCombatReward: null }));
            addLog(`You retrieve the ${MONSTERS[monsterId].name}'s essence from the altar.`);
        }
    }, [questLogic, repeatableQuests, slayer, worldState.pendingQuestCombatReward, inv, setWorldState, addLog, navigation]);

    const handleEncounterWin = useCallback((defeatedInstanceIds: string[]) => {
        if (defeatedInstanceIds.length === 0) return;

        const poiId = defeatedInstanceIds[0].split(':')[0];
        const poi = POIS[poiId];
        if (!poi) return;

        addLog(`You have cleared the area!`);

        const isInstanceQuestLocation = repeatableQuests.activePlayerQuest?.generatedQuest.isInstance && repeatableQuests.activePlayerQuest?.generatedQuest.instancePoiId === poiId;

        // Set respawn timers for all defeated monsters simultaneously
        const now = Date.now();
        const newTimers: Record<string, number> = {};
        defeatedInstanceIds.forEach(uniqueInstanceId => {
            const monsterId = uniqueInstanceId.split(':')[1];
            const instanceType = uniqueInstanceId.split(':')[2];
            const monsterData = MONSTERS[monsterId];
            
            // Do not set a respawn timer for instanced repeatable quest monsters.
            if (isInstanceQuestLocation) {
                return;
            }

            // Do not set a respawn timer for one-off quest monsters.
            if (instanceType !== 'quest' && monsterData && monsterData.respawnTime) {
                const respawnTimestamp = isInstantRespawnOn ? now : now + monsterData.respawnTime;
                newTimers[uniqueInstanceId] = respawnTimestamp;
            }
        });
        setMonsterRespawnTimers(prev => ({ ...prev, ...newTimers }));

    }, [isInstantRespawnOn, setMonsterRespawnTimers, addLog, repeatableQuests]);

    return { handleKill, handleEncounterWin };
}