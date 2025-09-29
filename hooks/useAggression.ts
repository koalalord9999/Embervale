import { useEffect } from 'react';
import { MONSTERS } from '../constants';
import { POIS } from '../data/pois';
import { POIActivity, Equipment, WorldState } from '../types';

export const useAggression = (
    currentPoiId: string,
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
    worldState: WorldState
) => {
    useEffect(() => {
        const isPoiImmune = (worldState.poiImmunity?.[currentPoiId] ?? 0) > Date.now();
        if (!isGameLoaded || isBusy || isInCombat || isPlayerInvisible || isPlayerImmune || isPoiImmune) return;

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
            });
        
        if (aggressiveMonsterInstances.length > 0) {
            const necklace = equipment.necklace;
            if (necklace?.itemId === 'necklace_of_shadows' && (necklace.charges ?? 0) > 0) {
                // Player is invisible, consume a charge and do not start combat.
                const newCharges = (necklace.charges ?? 1) - 1;
                if (newCharges > 0) {
                    setEquipment(prev => ({ ...prev, necklace: { ...necklace, charges: newCharges } }));
                } else {
                    addLog("Your Necklace of Shadows has run out of charges and fades away.");
                    setEquipment(prev => ({ ...prev, necklace: null }));
                }
                // Do NOT call startCombat
            } else {
                // Player is not invisible, start combat as normal
                startCombat(aggressiveMonsterInstances.map(m => m.uniqueInstanceId));
            }
        }
    }, [currentPoiId, isGameLoaded, isBusy, isInCombat, playerCombatLevel, startCombat, addLog, monsterRespawnTimers, devAggroIds, isPlayerInvisible, isPlayerImmune, equipment, setEquipment, worldState]);
};