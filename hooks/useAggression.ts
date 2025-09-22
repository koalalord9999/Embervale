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
    devAggroIds: string[],
    isPlayerInvisible: boolean
) => {
    useEffect(() => {
        if (!isGameLoaded || isBusy || isPlayerInvisible) return;

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
                // Dev aggro overrides ALL normal behavior, including respawn timers.
                if (devAggroIds.includes(uniqueInstanceId)) {
                    return true;
                }

                const respawnTime = monsterRespawnTimers[uniqueInstanceId];
                if (respawnTime && respawnTime > Date.now()) {
                    return false; // Monster is respawning
                }

                if (!monster?.aggressive) return false;

                if (monster.alwaysAggressive) return true;
                return playerCombatLevel < monster.level * 2;
            })
            .map(({ uniqueInstanceId }) => uniqueInstanceId);
        
        if (aggressiveMonsterInstances.length > 0) {
            startCombat(aggressiveMonsterInstances);
        }
    }, [currentPoiId, isGameLoaded, isBusy, playerCombatLevel, startCombat, addLog, monsterRespawnTimers, devAggroIds, isPlayerInvisible]);
};