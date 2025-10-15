import React, { useEffect } from 'react';
import { MONSTERS } from '../constants';
import { POI, POIActivity, Equipment, WorldState, PlayerRepeatableQuest } from '../types';

export const useAggression = (
    currentPoi: POI | null,
    isGameLoaded: boolean,
    isBusy: boolean,
    isInCombat: boolean,
    playerCombatLevel: number,
    startCombat: (monsterIds: string[]) => void,
    addLog: (message: string) => void,
    monsterRespawnTimers: Record<string, number>,
    devAggroIds: string[],
    isPlayerInvisible: boolean,
    isPlayerImmune: boolean,
    equipment: Equipment,
    setEquipment: React.Dispatch<React.SetStateAction<Equipment>>,
    worldState: WorldState,
    activeRepeatableQuest: PlayerRepeatableQuest | null
) => {
    useEffect(() => {
        if (!currentPoi) return;
        const currentPoiId = currentPoi.id;

        const isPoiImmune = (worldState.poiImmunity?.[currentPoiId] ?? 0) > Date.now();
        
        if (!isGameLoaded || isBusy || isInCombat || isPlayerInvisible || isPlayerImmune || isPoiImmune) return;

        const combatActivities = currentPoi.activities
            .map((act, index) => ({ act, index }))
            .filter(({ act }) => act.type === 'combat');

        const aggressiveMonsterInstances = combatActivities
            .map(({ act, index }) => {
                const monsterId = (act as Extract<POIActivity, { type: 'combat' }>).monsterId;
                const monster = MONSTERS[monsterId];
                const uniqueInstanceId = `${currentPoiId}:${monster?.id}:${index}`;
                return { monster, uniqueInstanceId };
            })
            .filter(({ monster, uniqueInstanceId }) => {
                if (!monster) return false;
                const respawnTime = monsterRespawnTimers[uniqueInstanceId];
                if (respawnTime && respawnTime > Date.now()) {
                    return false; // Monster is respawning
                }
                
                const isQuestAggressive = activeRepeatableQuest && (
                    (activeRepeatableQuest.generatedQuest.aggressionToggle && activeRepeatableQuest.generatedQuest.aggressionToggle.poiId === currentPoiId && activeRepeatableQuest.generatedQuest.aggressionToggle.monsterId === monster.id) ||
                    (activeRepeatableQuest.generatedQuest.isInstance && activeRepeatableQuest.generatedQuest.instancePoiId === currentPoiId && activeRepeatableQuest.generatedQuest.target.monsterId === monster.id)
                );

                // This combined boolean expression correctly prioritizes overrides.
                // If any of the first three conditions are true, the monster is aggressive.
                // The final level-based check is only evaluated if the others are false.
                return devAggroIds.includes(uniqueInstanceId) ||
                       monster.alwaysAggressive ||
                       isQuestAggressive ||
                       (monster.aggressive && playerCombatLevel < monster.level * 2);
            });
        
        if (aggressiveMonsterInstances.length > 0) {
            const necklace = equipment.necklace;
            if (necklace?.itemId === 'necklace_of_shadows' && (necklace.charges ?? 0) > 0) {
                const newCharges = (necklace.charges ?? 1) - 1;
                if (newCharges > 0) {
                    setEquipment(prev => ({ ...prev, necklace: { ...necklace, charges: newCharges } }));
                } else {
                    addLog("Your Necklace of Shadows has run out of charges and fades away.");
                    setEquipment(prev => ({ ...prev, necklace: null }));
                }
            } else {
                startCombat(aggressiveMonsterInstances.map(m => m.uniqueInstanceId));
            }
        }
    }, [currentPoi, isGameLoaded, isBusy, isInCombat, playerCombatLevel, startCombat, addLog, monsterRespawnTimers, devAggroIds, isPlayerInvisible, isPlayerImmune, equipment, setEquipment, worldState, activeRepeatableQuest]);
};
