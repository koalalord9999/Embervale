import { useEffect, useCallback, useRef } from 'react';
import { WorldState, PlayerSkill, SkillName, POIActivity, ActivePilferingSession } from '../types';
import { THIEVING_CONTAINER_TARGETS, HOUSE_TIERS, PILFERING_DURATION } from '../constants';
import { useNavigation } from './useNavigation';
import { useCharacter } from './useCharacter';
import { POIS } from '../data/pois';
import { useGameSession } from './useGameSession';

interface PilferingDependencies {
    worldState: WorldState;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
    char: ReturnType<typeof useCharacter>;
    navigation: ReturnType<typeof useNavigation>;
    addLog: (message: string) => void;
    setDynamicActivities: (activities: POIActivity[] | null) => void;
    session: ReturnType<typeof useGameSession>;
}

const HOUSE_RESET_INTERVAL = 30 * 60 * 1000; // 30 minutes

export const useThievingPilfering = (deps: PilferingDependencies) => {
    const { worldState, setWorldState, char, navigation, addLog, setDynamicActivities, session } = deps;
    const prevPoiIdRef = useRef(session.currentPoiId);

    const depsRef = useRef(deps);
    useEffect(() => {
        depsRef.current = deps;
    });

    const leaveHouse = useCallback(() => {
        const { worldState, setWorldState, navigation, addLog, setDynamicActivities } = depsRef.current;
        const session = worldState.activePilferingSession;

        if (session) {
            // Perform cleanup first, then navigate. This makes the action atomic.
            setWorldState(ws => ({
                ...ws,
                activePilferingSession: null,
                depletedHouses: [...(ws.depletedHouses || []), session.housePoiId]
            }));
            setDynamicActivities(null);
            navigation.handleForcedNavigate(session.entryPoiId);
        } else {
            // Fallback, should not happen if user is in the house instance.
            addLog("You feel disoriented and find yourself back in Meadowdale.");
            navigation.handleForcedNavigate('meadowdale_square');
        }
    }, []);

    const generateHousesForPoi = useCallback((poiId: string, thievingLevel: number) => {
        const poi = POIS[poiId];
        if (!poi) return;
        
        const pilferDoors = poi.activities.filter(a => a.type === 'thieving_pilfer');
        if (pilferDoors.length === 0) return;
        
        const targetTier = HOUSE_TIERS.slice().reverse().find(tier => thievingLevel >= tier.level);
        
        const weightedTiers: { tierId: string, level: number, weight: number }[] = HOUSE_TIERS.map(tier => ({
            ...tier,
            weight: tier.id === targetTier?.id ? 50 : 10,
        }));
        const totalWeight = weightedTiers.reduce((sum, tier) => sum + tier.weight, 0);
        
        const newGeneratedHouses: Record<string, { tierId: string, level: number, activities: POIActivity[] }> = {};
        
        pilferDoors.forEach(door => {
            const pilferActivity = door as Extract<POIActivity, { type: 'thieving_pilfer' }>;
            let roll = Math.random() * totalWeight;
            for (const tier of weightedTiers) {
                roll -= tier.weight;
                if (roll <= 0) {
                    const numContainers = Math.floor(Math.random() * 3) + 3; // 3 to 5
                    const newActivities: POIActivity[] = [];
                    const baseTierId = tier.tierId.replace('thieving_house_drawer_', '');

                    for (let i = 0; i < numContainers; i++) {
                        const containerRoll = Math.random() * 32;
                        let containerType: 'chest' | 'cabinet' | 'drawer';

                        if (containerRoll < 1) { containerType = 'chest'; }
                        else if (containerRoll < 4) { containerType = 'cabinet'; }
                        else { containerType = 'drawer'; }
                        
                        const lootTableId = `thieving_house_${containerType}_${baseTierId}`;
                        const containerData = THIEVING_CONTAINER_TARGETS[lootTableId];
                        if(containerData) {
                            newActivities.push({
                                type: 'thieving_lockpick',
                                id: `pilfer_${pilferActivity.id}_${i}`,
                                targetName: containerData.name,
                                lootTableId: lootTableId,
                            });
                        }
                    }

                    newGeneratedHouses[pilferActivity.id] = { tierId: tier.tierId, level: tier.level, activities: newActivities };
                    break;
                }
            }
        });

        setWorldState(ws => ({ ...ws, generatedHouses: { ...(ws.generatedHouses ?? {}), ...newGeneratedHouses }}));

    }, [setWorldState]);

    // EFFECT 1: Navigation Manager - If a session exists but we aren't in the house, go there.
    useEffect(() => {
        const isInHouse = session.currentPoiId === 'pilfering_house_instance';
        if (worldState.activePilferingSession && !isInHouse) {
            navigation.handleForcedNavigate('pilfering_house_instance');
        }
    }, [worldState.activePilferingSession, session.currentPoiId, navigation]);

    // EFFECT 2: House Interior Manager - If we are in the house, set up the activities.
    useEffect(() => {
        const isInHouse = session.currentPoiId === 'pilfering_house_instance';
        if (isInHouse) {
            if (worldState.activePilferingSession) {
                const houseData = worldState.generatedHouses?.[worldState.activePilferingSession.housePoiId];
                if (houseData?.activities) {
                    setDynamicActivities(houseData.activities);
                } else {
                    setDynamicActivities(null);
                }
            } else {
                addLog("You feel disoriented and find yourself back in Meadowdale.");
                navigation.handleForcedNavigate('meadowdale_square');
            }
        }
    }, [session.currentPoiId, worldState.activePilferingSession, worldState.generatedHouses, setDynamicActivities, navigation, addLog]);

    // EFFECT 3: Automatic Cleanup Manager - If we leave the house via non-standard means (teleport, etc.), clear the session.
    useEffect(() => {
        const wasInHouse = prevPoiIdRef.current === 'pilfering_house_instance';
        const isNowInHouse = session.currentPoiId === 'pilfering_house_instance';
    
        if (wasInHouse && !isNowInHouse) {
            if (depsRef.current.worldState.activePilferingSession) {
                depsRef.current.setWorldState(ws => {
                    const houseId = ws.activePilferingSession?.housePoiId;
                    if (houseId && !(ws.depletedHouses || []).includes(houseId)) {
                        return {
                            ...ws,
                            activePilferingSession: null,
                            depletedHouses: [...(ws.depletedHouses || []), houseId]
                        };
                    }
                    return { ...ws, activePilferingSession: null };
                });
                depsRef.current.setDynamicActivities(null);
            }
        }
        
        prevPoiIdRef.current = session.currentPoiId;
    }, [session.currentPoiId]);


    // EFFECT 4: Timer Manager - Handles the countdown AND cleanup for an active session.
    useEffect(() => {
        const pilferingSession = depsRef.current.worldState.activePilferingSession;
        if (!pilferingSession) return;

        const elapsed = Date.now() - pilferingSession.startTime;
        const timeLeft = PILFERING_DURATION - elapsed;

        const timer = setTimeout(() => {
            const { worldState: currentWorldState, addLog, char, navigation, setWorldState, setDynamicActivities } = depsRef.current;
            const session = currentWorldState.activePilferingSession;
            if (session && session.startTime === pilferingSession.startTime) {
                addLog("The owners have returned! You're thrown out!");
                const damage = session.tierLevel * 4;
                const newHp = char.currentHp - damage;
                char.setCurrentHp(newHp);
                addLog(`You take ${damage} damage in the commotion.`);

                if (newHp > 0) {
                    // Perform cleanup AND navigation together to make it an atomic operation.
                    setWorldState(ws => {
                        if (!ws.activePilferingSession) return ws;
                        const houseId = ws.activePilferingSession.housePoiId;
                        return {
                            ...ws,
                            activePilferingSession: null,
                            depletedHouses: [...(ws.depletedHouses || []), houseId]
                        };
                    });
                    setDynamicActivities(null);
                    navigation.handleForcedNavigate(session.entryPoiId);
                }
                // If HP drops to 0 or below, the global death handler in Game.tsx will take over.
            }
        }, timeLeft);

        return () => clearTimeout(timer);
    }, [deps.worldState.activePilferingSession]);


    // EFFECT 5: House Generation Manager - Pre-generates houses for streets.
    useEffect(() => {
        const poi = POIS[session.currentPoiId];
        if (poi && poi.activities.some(a => a.type === 'thieving_pilfer')) {
            const thievingSkill = char.skills.find(s => s.name === SkillName.Thieving);
            if (thievingSkill) {
                const firstDoorId = (poi.activities.find(a => a.type === 'thieving_pilfer') as Extract<POIActivity, {type: 'thieving_pilfer'}>)?.id;
                if (firstDoorId && !worldState.generatedHouses?.[firstDoorId]) {
                    generateHousesForPoi(session.currentPoiId, thievingSkill.level);
                }
            }
        }
    }, [session.currentPoiId, char.skills, worldState.generatedHouses, generateHousesForPoi]);
    
    // EFFECT 6: House Respawn Timer Manager
    useEffect(() => {
        const checkAndReset = () => {
            const nextReset = worldState.nextHouseResetTimestamp ?? 0;
            if (Date.now() >= nextReset) {
                setWorldState(ws => ({
                    ...ws,
                    depletedHouses: [],
                    nextHouseResetTimestamp: Date.now() + HOUSE_RESET_INTERVAL,
                }));
            }
        };
    
        const interval = setInterval(checkAndReset, 10000); // check every 10s
        checkAndReset(); // check on mount
    
        return () => clearInterval(interval);
    }, [worldState.nextHouseResetTimestamp, setWorldState]);

    return { leaveHouse };
};
