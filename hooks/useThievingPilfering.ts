
import { useEffect, useCallback, useRef } from 'react';
import { WorldState, PlayerSkill, SkillName, POIActivity, ActivePilferingSession, InventorySlot, Item } from '../types';
import { THIEVING_CONTAINER_TARGETS, HOUSE_TIERS, PILFERING_DURATION, ITEMS } from '../constants';
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
    inventory: (InventorySlot | null)[];
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean; }) => void;
    isInCombat: boolean;
}

const HOUSE_RESET_INTERVAL = 30 * 60 * 1000; // 30 minutes

export const useThievingPilfering = (deps: PilferingDependencies) => {
    const { worldState, setWorldState, char, navigation, addLog, setDynamicActivities, session } = deps;
    const activeTimeoutRef = useRef<number | null>(null);
    const prevPoiIdRef = useRef(session.currentPoiId);

    const depsRef = useRef(deps);
    useEffect(() => {
        depsRef.current = deps;
    });

    const handlePilfer = useCallback((activity: Extract<POIActivity, { type: 'thieving_pilfer' }>) => {
        const { char, inventory, modifyItem, isInCombat, worldState, setWorldState, session, addLog } = depsRef.current;
        if (char.isStunned || activeTimeoutRef.current || isInCombat) return;

        const houseInfo = worldState.generatedHouses?.[activity.id];
        if (!houseInfo) { addLog("Error determining house tier."); return; }
        
        const containerData = THIEVING_CONTAINER_TARGETS[houseInfo.tierId];
        if (!containerData) { addLog("Error loading house data."); return; }

        const thievingSkill = char.skills.find(s => s.name === SkillName.Thieving);
        if (!thievingSkill || thievingSkill.currentLevel < containerData.level) {
            addLog(`You need a Thieving level of ${containerData.level}.`);
            return;
        }
        const bestLockpick = inventory.map(s => s ? ITEMS[s.itemId] : null).filter((item): item is Item => !!(item && item.lockpick)).sort((a, b) => (b.lockpick!.power) - (a.lockpick!.power))[0];
        
        // Only require a lockpick for houses above the 'Dusty' tier (level 12).
        if (!bestLockpick && containerData.level > 12) {
            addLog("You need a lockpick for a lock this difficult.");
            return;
        }

        addLog(`You attempt to pick the lock on the ${activity.name}...`);
        activeTimeoutRef.current = window.setTimeout(() => {
            const { char: currentChar, inventory: currentInventory, modifyItem, addLog: log, setWorldState, session: currentSession, worldState: currentWorldState } = depsRef.current;

            const lockpickPower = bestLockpick?.lockpick?.power ?? 0; // Power is 0 if no lockpick.
            const successChance = Math.max(5, Math.min(95, 30 + (currentChar.skills.find(s => s.name === SkillName.Thieving)!.currentLevel - containerData.level) * 1.5 + lockpickPower));

            if (Math.random() * 100 < successChance) {
                log("The lock clicks open. You slip inside.");
                currentChar.addXp(SkillName.Thieving, containerData.xp);
                const tierIndex = HOUSE_TIERS.findIndex(t => t.level === containerData.level);
                
                const newSession: ActivePilferingSession = {
                    housePoiId: activity.id,
                    entryPoiId: currentSession.currentPoiId,
                    startTime: Date.now(),
                    tierId: houseInfo.tierId,
                    tierLevel: tierIndex !== -1 ? tierIndex + 1 : 1,
                    lootedContainerIds: [],
                };
                
                setWorldState(ws => ({ ...ws, activePilferingSession: newSession }));
            } else {
                log("You fail to pick the lock.");
                if (bestLockpick && !bestLockpick.lockpick!.unbreakable && Math.random() < bestLockpick.lockpick!.breakChance) {
                    modifyItem(bestLockpick.id, -1, false);
                    log(`Your ${bestLockpick.name} breaks.`);
                }
            }
            activeTimeoutRef.current = null;
        }, 1200);
    }, []);

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
        
        let targetTier = HOUSE_TIERS.slice().reverse().find(tier => thievingLevel >= tier.level);
        
        // If the player's level is too low to meet any requirement,
        // default to weighting the lowest tier ('Dusty') to give new players a chance.
        if (!targetTier && thievingLevel < 12) {
            targetTier = HOUSE_TIERS[0]; // This is the 'Dusty' tier.
        }
        
        const weightedTiers: { tierId: string, level: number, weight: number }[] = HOUSE_TIERS.map(tier => ({
            ...tier,
            weight: tier.id === targetTier?.id ? 70 : 10,
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
    
    const resetPilferingTimers = useCallback(() => {
        const { setWorldState, addLog, char } = depsRef.current;
        
        // Clear all generated houses so they will be re-rolled on next visit to any street.
        setWorldState(ws => ({
            ...ws,
            depletedHouses: [],
            generatedHouses: {},
            nextHouseResetTimestamp: Date.now() + HOUSE_RESET_INTERVAL
        }));

        addLog("System: All pilfering timers and house tiers have been reset. They will regenerate upon visiting a street.");
    }, []);

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
        const pilferingSession = deps.worldState.activePilferingSession;
        if (!pilferingSession) return;
    
        const elapsed = Date.now() - pilferingSession.startTime;
        const timeLeft = PILFERING_DURATION - elapsed;
    
        const timer = setTimeout(() => {
            const { worldState: currentWorldState, addLog, char, navigation, setWorldState, setDynamicActivities } = depsRef.current;
            const session = currentWorldState.activePilferingSession;
            
            // Check if the session is still the same one this timer was set for.
            if (session && session.startTime === pilferingSession.startTime) {
                addLog("The owners have returned! You're thrown out!");
                const damage = session.tierLevel * 4;
                const newHp = char.currentHp - damage;
                char.setCurrentHp(newHp);
                addLog(`You take ${damage} damage in the commotion.`);
    
                if (newHp > 0) {
                    // Perform the same atomic cleanup-then-navigate logic as the manual "Leave House" button.
                    const entryPoiId = session.entryPoiId;
                    setWorldState(ws => ({
                        ...ws,
                        activePilferingSession: null,
                        depletedHouses: [...(ws.depletedHouses || []), session.housePoiId]
                    }));
                    setDynamicActivities(null);
                    navigation.handleForcedNavigate(entryPoiId);
                }
                // If newHp <= 0, the global death handler will take over. The activePilferingSession is still
                // set at this point, so the death handler can correctly identify the drop location.
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
                    generatedHouses: {},
                    nextHouseResetTimestamp: Date.now() + HOUSE_RESET_INTERVAL,
                }));
            }
        };
    
        const interval = setInterval(checkAndReset, 10000); // check every 10s
        checkAndReset(); // check on mount
    
        return () => clearInterval(interval);
    }, [worldState.nextHouseResetTimestamp, setWorldState]);

    return { handlePilfer, leaveHouse, resetPilferingTimers };
};
