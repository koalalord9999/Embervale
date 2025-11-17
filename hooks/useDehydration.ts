
import { useEffect, useRef } from 'react';
import { WorldState, InventorySlot } from '../types';
import { useGameSession } from './useGameSession';
import { useCharacter } from './useCharacter';
import { useInventory } from './useInventory';
import { POIS, REGIONS } from '../constants';

interface DehydrationDependencies {
    session: ReturnType<typeof useGameSession>;
    inv: ReturnType<typeof useInventory>;
    char: ReturnType<typeof useCharacter>;
    addLog: (message: string) => void;
    worldState: WorldState;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
    isInCombat: boolean;
}

export const useDehydration = (deps: DehydrationDependencies) => {
    const timeoutRef = useRef<number | null>(null);
    const depsRef = useRef(deps);

    // Keep the ref updated with the latest deps on every render.
    useEffect(() => {
        depsRef.current = deps;
    });

    useEffect(() => {
        const clearTimer = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };

        const scheduleNextTick = () => {
            clearTimer();
            // Using a slightly shorter delay for better testing and feedback
            const delay = Math.random() * (75000 - 30000) + 30000; // 30-75 seconds
            timeoutRef.current = window.setTimeout(tick, delay);
        };

        const tick = () => {
            // Use deps from the ref to avoid stale closures.
            const { session, inv, char, addLog, worldState, setWorldState, isInCombat } = depsRef.current;

            const currentPoi = POIS[session.currentPoiId];
            if (!currentPoi) {
                scheduleNextTick();
                return;
            }

            const currentRegion = REGIONS[currentPoi.regionId];
            if (currentRegion?.isDesert && !isInCombat) {
                // Find a waterskin with water, prioritizing the one with the fewest doses.
                let lowestDose = 5;
                let lowestDoseIndex = -1;

                inv.inventory.forEach((slot, index) => {
                    if (slot?.itemId === 'waterskin' && (slot.doses ?? 0) > 0) {
                        if ((slot.doses ?? 5) < lowestDose) {
                            lowestDose = slot.doses!;
                            lowestDoseIndex = index;
                        }
                    }
                });
                
                if (lowestDoseIndex > -1) {
                    addLog("You take a sip from your waterskin.");
                    const newInv = [...inv.inventory];
                    const skin = newInv[lowestDoseIndex]!;
                    newInv[lowestDoseIndex] = { ...skin, doses: (skin.doses ?? 1) - 1 };
                    inv.setInventory(newInv);
                    
                    if (worldState.dehydrationLevel > 0) {
                        setWorldState(ws => ({ ...ws, dehydrationLevel: 0 }));
                        addLog("The water revitalizes you.");
                    }

                } else {
                    const newDehydrationLevel = worldState.dehydrationLevel + 1;
                    setWorldState(ws => ({ ...ws, dehydrationLevel: newDehydrationLevel }));

                    if (newDehydrationLevel <= 2) {
                        addLog("The blistering heat is causing you to dehydrate.");
                    } else {
                        // Damage starts at tick 3 and scales up.
                        const damage = Math.min(20, 4 + (newDehydrationLevel - 3) * 4);
                        char.setCurrentHp(hp => {
                            const newHp = Math.max(0, hp - damage);
                            if (newHp > 0) {
                                addLog(`The heat deals ${damage} damage to you.`);
                            }
                            return newHp;
                        });
                    }
                }
            } else {
                if (worldState.dehydrationLevel > 0) {
                    setWorldState(ws => ({ ...ws, dehydrationLevel: 0 }));
                }
            }

            scheduleNextTick();
        };

        scheduleNextTick();

        return () => clearTimer();

    // This effect should only run once on mount. The ref handles stale state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
