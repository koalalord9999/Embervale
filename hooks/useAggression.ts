import { useEffect } from 'react';
import { MONSTERS } from '../constants';
import { POIS } from '../data/pois';
import { POIActivity } from '../types';

export const useAggression = (
    currentPoiId: string,
    isGameLoaded: boolean,
    isBusy: boolean,
    playerCombatLevel: number,
    startCombat: (monsterIds: string[]) => void,
    addLog: (message: string) => void,
    monsterRespawnTimers: Record<string, number>,
    devAggroIds: string[]
) => {
    useEffect(() => {
        if (!isGameLoaded || isBusy) return;

        const poi = POIS[currentPoiId];
        if (!poi) return;

        const combatActivities = poi.activities
            .map((act, index) => ({ act, index }))
            .filter(({ act }) => act.type === 'combat');

        const aggressiveMonsterInstances = combatActivities
            .map(({ act, index }) => {
                const monsterId = (act as Extract<POIActivity, { type: 'combat' }>).monsterId;
                const monster = MONSTERS[monsterId];
                const uniqueInstanceId = `${currentPoiId}:${monster.id}:${index}`;
                return { monster, uniqueInstanceId };
            })
            .filter(({ monster, uniqueInstanceId }) => {
                const respawnTime = monsterRespawnTimers[uniqueInstanceId];
                if (respawnTime && respawnTime > Date.now()) {
                    return false; // Monster is respawning
                }

                // Dev aggro overrides normal behavior
                if (devAggroIds.includes(uniqueInstanceId)) {
                    return true;
                }

                if (!monster?.aggressive) return false;

                if (monster.alwaysAggressive) return true;
                return playerCombatLevel < monster.level * 2;
            })
            .map(({ uniqueInstanceId }) => uniqueInstanceId);
        
        if (aggressiveMonsterInstances.length > 0) {
            addLog("You've been spotted by aggressive creatures! Prepare for battle!");
            startCombat(aggressiveMonsterInstances);
        }
    }, [currentPoiId, isGameLoaded, isBusy, playerCombatLevel, startCombat, addLog, monsterRespawnTimers, devAggroIds]);
};
