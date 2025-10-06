import React, { useCallback } from 'react';
import { useQuestLogic } from './useQuestLogic';
import { useRepeatableQuests } from './useRepeatableQuests';
import { useSlayer } from './useSlayer';
import { MONSTERS } from '../constants';
import { POIS } from '../data/pois';
import { WorldState } from '../types';
import { useInventory } from './useInventory';

interface KillHandlerDependencies {
    questLogic: ReturnType<typeof useQuestLogic>;
    repeatableQuests: ReturnType<typeof useRepeatableQuests>;
    slayer: ReturnType<typeof useSlayer>;
    setMonsterRespawnTimers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    isInstantRespawnOn: boolean;
    currentPoiId: string;
    monsterRespawnTimers: Record<string, number>;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
    addLog: (message: string) => void;
    worldState: WorldState;
    inv: ReturnType<typeof useInventory>;
}

export const useKillHandler = (deps: KillHandlerDependencies) => {
    const { questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn, currentPoiId, monsterRespawnTimers, setWorldState, addLog, worldState, inv } = deps;

    const handleKill = useCallback((uniqueInstanceId: string, attackStyle?: 'melee' | 'ranged' | 'magic') => {
        const parts = uniqueInstanceId.split(':');
        const poiIdForKill = parts[0];
        const monsterId = parts.length > 1 ? parts[1] : parts[0];
        const instanceType = parts.length > 2 ? parts[2] : null;
        
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

        const monsterData = MONSTERS[monsterId];
        let newRespawnTimers = { ...monsterRespawnTimers };
        
        // Do not set a respawn timer for one-off quest monsters.
        if (instanceType !== 'quest' && monsterData && monsterData.respawnTime) {
            const respawnTimestamp = isInstantRespawnOn ? Date.now() : Date.now() + monsterData.respawnTime;
            newRespawnTimers[uniqueInstanceId] = respawnTimestamp;
            setMonsterRespawnTimers(prev => ({
                ...prev,
                [uniqueInstanceId]: respawnTimestamp,
            }));
        }

        const poi = POIS[poiIdForKill];
        if (!poi) return;
        
        const combatActivities = poi.activities.filter(a => a.type === 'combat');
        if (combatActivities.length > 0) {
            const isRoomCleared = combatActivities.every((activity, index) => {
                const monsterIdInActivity = (activity as any).monsterId;
                const instanceId = `${poiIdForKill}:${monsterIdInActivity}:${index}`;
                return (newRespawnTimers[instanceId] ?? 0) > Date.now();
            });
    
            if (isRoomCleared) {
                const immunityDuration = 60 * 1000; // 60 seconds
                const expiryTime = Date.now() + immunityDuration;
                setWorldState(ws => ({
                    ...ws,
                    poiImmunity: {
                        ...(ws.poiImmunity ?? {}),
                        [poiIdForKill]: expiryTime
                    }
                }));
                addLog(`Room cleared! You are immune to aggression here for 60 seconds.`);
            }
        }

    }, [questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn, monsterRespawnTimers, currentPoiId, addLog, setWorldState, worldState, inv]);

    return { handleKill };
}