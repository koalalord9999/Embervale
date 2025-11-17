

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
    isPermAggroOn: boolean,
    isPlayerInvisible: boolean,
    isPlayerImmune: boolean,
    equipment: Equipment,
    setEquipment: React.Dispatch<React.SetStateAction<Equipment>>,
    worldState: WorldState,
    activeRepeatableQuest: PlayerRepeatableQuest | null
) => {
    useEffect(() => {
        const checkAggression = () => {
            if (!currentPoi) return;
            const currentPoiId = currentPoi.id;
    
            const isPoiImmune = (worldState.poiImmunity?.[currentPoiId] ?? 0) > Date.now();

            // Race condition fix: If we've just entered the death POI, immunity might not be set yet.
            // This check prevents aggression for one render cycle, allowing the immunity effect in Game.tsx to apply.
            const needsDeathImmunity = !!worldState.deathMarker && currentPoiId === worldState.deathMarker.poiId && !worldState.deathMarker.immunityGranted;
            if (needsDeathImmunity) {
                return;
            }
            
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
    
                    // Global dev tool for permanent aggression
                    const isEffectivelyAggressive = monster.aggressive || isPermAggroOn;
                    const effectivePlayerCombatLevel = isPermAggroOn ? 1 : playerCombatLevel;

                    // The final level-based check is only evaluated if the others are false.
                    return monster.alwaysAggressive ||
                           isQuestAggressive ||
                           (isEffectivelyAggressive && effectivePlayerCombatLevel < monster.level * 2);
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
        };

        // Run immediately on dependency change
        checkAggression();
        
        // Also run periodically to catch state changes like immunity expiring or respawns
        const interval = setInterval(checkAggression, 1000); // Check every second

        return () => clearInterval(interval);
        
    }, [currentPoi, isGameLoaded, isBusy, isInCombat, playerCombatLevel, startCombat, addLog, monsterRespawnTimers, isPermAggroOn, isPlayerInvisible, isPlayerImmune, equipment, setEquipment, worldState, activeRepeatableQuest]);
};
