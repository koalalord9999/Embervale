import { useState, useCallback, useEffect, useRef } from 'react';
import { Monster, SkillName, PlayerSkill, InventorySlot, Equipment, Item, POIActivity, ActiveBuff, ThievingContainerState, WorldState, ActivePilferingSession } from '../types';
import { ITEMS, rollOnLootTable, LootRollResult, THIEVING_POCKET_TARGETS, THIEVING_CONTAINER_TARGETS, THIEVING_STALL_TARGETS, HOUSE_TIERS, PILFERING_DURATION } from '../constants';
import { useNavigation } from './useNavigation';

type LockpickActivity = Extract<POIActivity, { type: 'thieving_lockpick' }>;
type StallActivity = Extract<POIActivity, { type: 'thieving_stall' }>;
type PickpocketData = NonNullable<Extract<POIActivity, { type: 'npc' }>['pickpocket']>;

interface ThievingDependencies {
    addLog: (message: string) => void;
    skills: (PlayerSkill & { currentLevel: number })[];
    addXp: (skill: SkillName, amount: number) => void;
    inventory: (InventorySlot | null)[];
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, doses?: number, options?: { noted?: boolean, bypassAutoBank?: boolean }) => void;
    equipment: Equipment;
    addBuff: (buff: Omit<ActiveBuff, 'id' | 'durationRemaining'>) => void;
    setPlayerHp: React.Dispatch<React.SetStateAction<number>>;
    isStunned: boolean;
    isInCombat: boolean;
    startCombat: (uniqueInstanceIds: string[]) => void;
    currentPoiId: string;
    activeBuffs: ActiveBuff[];
    currentHp: number;
    onPlayerDeath: () => void;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
    navigation: ReturnType<typeof useNavigation>;
    worldState: WorldState;
}

export const useThieving = (
    initialContainerStates: Record<string, ThievingContainerState>,
    deps: ThievingDependencies
) => {
    const [containerStates, setContainerStates] = useState<Record<string, ThievingContainerState>>(initialContainerStates);
    const activeTimeoutRef = useRef<number | null>(null);

    const depsRef = useRef(deps);
    useEffect(() => {
        depsRef.current = deps;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setContainerStates(prev => {
                let changed = false;
                const newStates = { ...prev };
                for (const id in newStates) {
                    if (newStates[id].respawnTimer > 0) {
                        changed = true;
                        const newTimer = newStates[id].respawnTimer - 1000;
                        newStates[id].respawnTimer = Math.max(0, newTimer);
                        if (newTimer <= 0) {
                            newStates[id].depleted = false;
                        }
                    }
                }
                return changed ? newStates : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    
    const handlePilfer = useCallback((activity: Extract<POIActivity, { type: 'thieving_pilfer' }>) => {
        const { isStunned, addLog, skills, inventory, isInCombat, setWorldState, currentPoiId } = depsRef.current;
        if (isStunned || activeTimeoutRef.current || isInCombat) return;

        const houseInfo = depsRef.current.worldState.generatedHouses?.[activity.id];
        if (!houseInfo) { addLog("Error determining house tier."); return; }
        
        const containerData = THIEVING_CONTAINER_TARGETS[houseInfo.tierId];
        if (!containerData) { addLog("Error loading house data."); return; }

        const thievingSkill = skills.find(s => s.name === SkillName.Thieving);
        if (!thievingSkill || thievingSkill.currentLevel < containerData.level) {
            addLog(`You need a Thieving level of ${containerData.level}.`);
            return;
        }
        const bestLockpick = inventory.map(s => s ? ITEMS[s.itemId] : null).filter((item): item is Item => !!(item && item.lockpick)).sort((a, b) => (b.lockpick!.power) - (a.lockpick!.power))[0];
        if (!bestLockpick) { addLog("You need a lockpick."); return; }

        addLog(`You attempt to pick the lock on the ${activity.name}...`);
        activeTimeoutRef.current = window.setTimeout(() => {
            const { skills: currentSkills, inventory: currentInventory, modifyItem, addXp, addLog: log, setWorldState, currentPoiId } = depsRef.current;
            const successChance = Math.max(5, Math.min(95, 30 + (currentSkills.find(s => s.name === SkillName.Thieving)!.currentLevel - containerData.level) * 1.5 + (bestLockpick.lockpick!.power)));
            if (Math.random() * 100 < successChance) {
                log("The lock clicks open. You slip inside.");
                addXp(SkillName.Thieving, containerData.xp);
                const tierIndex = HOUSE_TIERS.findIndex(t => t.level === houseInfo.level);
                
                const newSession: ActivePilferingSession = {
                    housePoiId: activity.id,
                    entryPoiId: currentPoiId,
                    startTime: Date.now(),
                    tierId: houseInfo.tierId,
                    tierLevel: tierIndex !== -1 ? tierIndex + 1 : 1,
                    lootedContainerIds: [],
                };
                
                setWorldState(ws => ({ ...ws, activePilferingSession: newSession }));
            } else {
                log("You fail to pick the lock.");
                if (!bestLockpick.lockpick!.unbreakable && Math.random() < bestLockpick.lockpick!.breakChance) {
                    modifyItem(bestLockpick.id, -1, false);
                    log(`Your ${bestLockpick.name} breaks.`);
                }
            }
            activeTimeoutRef.current = null;
        }, 1200);
    }, []);

    const handlePickpocket = useCallback((target: { name: string; pickpocket: PickpocketData }, targetInstanceId: string) => {
        const { isStunned, addLog, skills, inventory, modifyItem, addXp, addBuff, setPlayerHp, currentHp, onPlayerDeath, isInCombat } = depsRef.current;
        if (isStunned || activeTimeoutRef.current || isInCombat) return;

        const targetData = THIEVING_POCKET_TARGETS[target.pickpocket.lootTableId];
        if (!targetData) {
            addLog(`Cannot pickpocket ${target.name}.`);
            return;
        }

        const thievingSkill = skills.find(s => s.name === SkillName.Thieving);
        if (!thievingSkill || thievingSkill.currentLevel < targetData.level) {
            addLog(`You need a Thieving level of ${targetData.level} to pickpocket ${target.name}.`);
            return;
        }

        addLog(`You attempt to pickpocket the ${target.name}...`);

        activeTimeoutRef.current = window.setTimeout(() => {
            const { skills: currentSkills, addXp, addLog: log, addBuff: buff, setPlayerHp, currentHp, onPlayerDeath, modifyItem } = depsRef.current;

            const baseSuccessChance = 50;
            const levelDifference = currentSkills.find(s => s.name === SkillName.Thieving)!.currentLevel - targetData.level;
            const successChance = Math.max(10, Math.min(98, baseSuccessChance + levelDifference * 1.5));

            if (Math.random() * 100 < successChance) {
                log(`You successfully pickpocket the ${target.name}.`);
                addXp(SkillName.Thieving, targetData.xp);
                const lootResult = rollOnLootTable(target.pickpocket.lootTableId);
                if (lootResult) {
                    const loot = typeof lootResult === 'string' ? { itemId: lootResult, quantity: 1, noted: false } : lootResult;
                    modifyItem(loot.itemId, loot.quantity, false, undefined, { bypassAutoBank: true, noted: loot.noted });
                }
            } else {
                log(`You have been caught!`);
                buff({ type: 'stun', value: 0, duration: targetData.stunDuration });
                const newHp = currentHp - targetData.damageOnFailure;
                setPlayerHp(newHp);
                if (newHp <= 0) {
                    onPlayerDeath();
                }
            }
            activeTimeoutRef.current = null;
        }, 600);
    }, []);

    const handleLockpick = useCallback((activity: LockpickActivity) => {
        const { isStunned, addLog, skills, inventory, modifyItem, addXp, isInCombat, setWorldState } = depsRef.current;
        if (isStunned || activeTimeoutRef.current || isInCombat) return;

        const containerData = THIEVING_CONTAINER_TARGETS[activity.lootTableId];
        if (!containerData) {
            addLog(`You can't figure out how to open this.`);
            return;
        }

        const thievingSkill = skills.find(s => s.name === SkillName.Thieving);
        if (!thievingSkill || thievingSkill.currentLevel < containerData.level) {
            addLog(`You need a Thieving level of ${containerData.level} to attempt this lock.`);
            return;
        }

        const bestLockpick = inventory.map(s => s ? ITEMS[s.itemId] : null).filter((item): item is Item => !!(item && item.lockpick)).sort((a, b) => (b.lockpick!.power) - (a.lockpick!.power))[0];
        if (!bestLockpick) {
            addLog("You need a lockpick to attempt this.");
            return;
        }

        addLog(`You attempt to pick the lock...`);

        activeTimeoutRef.current = window.setTimeout(() => {
            const { skills: currentSkills, addXp, addLog: log, modifyItem, setPlayerHp, currentHp, onPlayerDeath, startCombat, setWorldState } = depsRef.current;
            const successChance = Math.max(5, Math.min(95, 30 + (currentSkills.find(s => s.name === SkillName.Thieving)!.currentLevel - containerData.level) * 1.5 + (bestLockpick.lockpick!.power)));

            if (Math.random() * 100 < successChance) {
                log("The lock clicks open.");
                addXp(SkillName.Thieving, containerData.xp);

                if (containerData.trap?.mimicChance && Math.random() < containerData.trap.mimicChance) {
                    log("It's a mimic! It attacks!");
                    startCombat([`${depsRef.current.currentPoiId}:mimic:0`]);
                } else {
                    const lootResult = rollOnLootTable(activity.lootTableId);
                    if (lootResult) {
                        const loot = typeof lootResult === 'string' ? { itemId: lootResult, quantity: 1, noted: false } : lootResult;
                        modifyItem(loot.itemId, loot.quantity, false, undefined, { bypassAutoBank: true, noted: loot.noted });
                    }

                    if (activity.id.startsWith('pilfer_')) {
                        setWorldState(ws => {
                            if (!ws.activePilferingSession) return ws;
                            return {
                                ...ws,
                                activePilferingSession: {
                                    ...ws.activePilferingSession,
                                    lootedContainerIds: [...(ws.activePilferingSession.lootedContainerIds || []), activity.id],
                                }
                            };
                        });
                    } else {
                        setContainerStates(prev => ({ ...prev, [activity.id]: { depleted: true, respawnTimer: containerData.respawnTime } }));
                    }
                }

            } else {
                log("You fail to pick the lock.");
                
                if (activity.id.startsWith('pilfer_')) {
                    setWorldState(ws => {
                        if (ws.activePilferingSession) {
                            log("The noise you made has attracted attention! You have less time.");
                            return {
                                ...ws,
                                activePilferingSession: {
                                    ...ws.activePilferingSession,
                                    startTime: ws.activePilferingSession.startTime - 40000 // Reduce time by 40s
                                }
                            };
                        }
                        return ws;
                    });
                }

                if (containerData.trap) {
                    log("You've triggered a trap!");
                    const newHp = currentHp - (containerData.trap.damage || 0);
                    setPlayerHp(newHp);
                    if (newHp <= 0) {
                        onPlayerDeath();
                    }
                }

                if (!bestLockpick.lockpick!.unbreakable && Math.random() < bestLockpick.lockpick!.breakChance) {
                    modifyItem(bestLockpick.id, -1, false);
                    log(`Your ${bestLockpick.name} breaks.`);
                }
            }

            activeTimeoutRef.current = null;
        }, 1200);

    }, []);

    const handleStealFromStall = useCallback((activity: StallActivity) => {
        const { isStunned, addLog, skills, inventory, modifyItem, addXp, addBuff, setPlayerHp, currentHp, onPlayerDeath, isInCombat } = depsRef.current;
        if (isStunned || activeTimeoutRef.current || isInCombat) return;

        const stallData = THIEVING_STALL_TARGETS[activity.lootTableId];
        if (!stallData) {
            addLog(`You can't steal from this stall.`);
            return;
        }

        const thievingSkill = skills.find(s => s.name === SkillName.Thieving);
        if (!thievingSkill || thievingSkill.currentLevel < stallData.level) {
            addLog(`You need a Thieving level of ${stallData.level} to steal from this stall.`);
            return;
        }

        addLog(`You attempt to steal from the ${stallData.name}...`);
        
        activeTimeoutRef.current = window.setTimeout(() => {
            const { skills: currentSkills, addXp, addLog: log, addBuff: buff, setPlayerHp, currentHp, onPlayerDeath, modifyItem } = depsRef.current;
            
            const successChance = Math.max(20, Math.min(98, 50 + (currentSkills.find(s => s.name === SkillName.Thieving)!.currentLevel - stallData.level) * 2));
            
            if (Math.random() * 100 < successChance) {
                log(`You snatch something from the stall!`);
                addXp(SkillName.Thieving, stallData.xp);
                const lootResult = rollOnLootTable(activity.lootTableId);
                if (lootResult) {
                    const loot = typeof lootResult === 'string' ? { itemId: lootResult, quantity: 1, noted: false } : lootResult;
                    modifyItem(loot.itemId, loot.quantity, false, undefined, { bypassAutoBank: true, noted: loot.noted });
                }
                setContainerStates(prev => ({ ...prev, [activity.id]: { depleted: true, respawnTimer: stallData.respawnTime } }));

            } else {
                log(`"Hey! Get your hands off that!" You've been caught!`);
                buff({ type: 'stun', value: 0, duration: 3000 });
            }
            activeTimeoutRef.current = null;
        }, 600);
    }, []);

    return {
        handlePilfer,
        handlePickpocket,
        handleLockpick,
        handleStealFromStall,
        containerStates,
    };
};
