import { useState, useCallback, useEffect, useRef } from 'react';
import { Monster, SkillName, PlayerSkill, InventorySlot, Equipment, Item, POIActivity, ActiveBuff, ThievingContainerState, WorldState } from '../types';
import { ITEMS, rollOnLootTable, LootRollResult, THIEVING_POCKET_TARGETS, THIEVING_CONTAINER_TARGETS, THIEVING_STALL_TARGETS } from '../constants';
import { useNavigation } from './useNavigation';

type LockpickActivity = Extract<POIActivity, { type: 'thieving_lockpick' }>;
type StallActivity = Extract<POIActivity, { type: 'thieving_stall' }>;
type PickpocketData = NonNullable<Extract<POIActivity, { type: 'npc' }>['pickpocket']>;

interface ThievingDependencies {
    addLog: (message: string) => void;
    skills: (PlayerSkill & { currentLevel: number })[];
    addXp: (skill: SkillName, amount: number) => void;
    inventory: (InventorySlot | null)[];
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean; }) => void;
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
    onItemDropped: (item: InventorySlot, overridePoiId?: string) => void;
    setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
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
    

    const handlePickpocket = useCallback((target: { name: string; pickpocket: PickpocketData }, targetInstanceId: string) => {
        const { isStunned, addLog, skills, inventory, modifyItem, addXp, addBuff, setPlayerHp, currentHp, onPlayerDeath, isInCombat, setIsResting } = depsRef.current;
        setIsResting(false);
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
            const { skills: currentSkills, addXp, addLog: log, addBuff: buff, setPlayerHp, currentHp, onPlayerDeath, modifyItem, equipment } = depsRef.current;

            const baseSuccessChance = 50;
            const levelDifference = currentSkills.find(s => s.name === SkillName.Thieving)!.currentLevel - targetData.level;
            const successChance = Math.max(10, Math.min(98, baseSuccessChance + levelDifference * 1.5));

            if (Math.random() * 100 < successChance) {
                log(`You successfully pickpocket the ${target.name}.`);
                addXp(SkillName.Thieving, targetData.xp);
                const lootResult = rollOnLootTable(target.pickpocket.lootTableId);
                if (lootResult) {
                    let loot = typeof lootResult === 'string' ? { itemId: lootResult, quantity: 1, noted: false } : lootResult;
                    modifyItem(loot.itemId, loot.quantity, false, { bypassAutoBank: true, noted: loot.noted });
                }
            } else {
                log(`You have been caught!`);
                buff({ type: 'stun', value: 0, duration: targetData.stunDuration });
                const newHp = currentHp - targetData.damageOnFailure;
                setPlayerHp(newHp);
            }
            activeTimeoutRef.current = null;
        }, 600);
    }, []);

    const handleLockpick = useCallback((activity: LockpickActivity) => {
        const { isStunned, addLog, skills, inventory, modifyItem, addXp, isInCombat, setIsResting } = depsRef.current;
        setIsResting(false);
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
    
        let bestLockpick: Item | undefined = undefined;
        const isLockpickRequired = !containerData.unlocked;

        if (isLockpickRequired) {
            bestLockpick = inventory
                .filter((slot): slot is InventorySlot => !!(slot && ITEMS[slot.itemId]?.lockpick && !slot.noted))
                .map(slot => ITEMS[slot.itemId])
                .sort((a, b) => (b.lockpick!.power) - (a.lockpick!.power))[0];
            
            if (!bestLockpick) {
                addLog("You need a lockpick to attempt this.");
                return;
            }
        }
    
        if (containerData.unlocked) {
            addLog(`You open the ${activity.targetName}...`);
        } else {
            addLog(`You attempt to pick the lock...`);
        }
    
        activeTimeoutRef.current = window.setTimeout(() => {
            const { skills: currentSkills, addXp, addLog: log, modifyItem, setPlayerHp, currentHp, onPlayerDeath, startCombat, worldState, setWorldState, equipment, inventory: currentInv, onItemDropped, currentPoiId } = depsRef.current;
            
            let successChance = 0;

            if (containerData.unlocked) {
                successChance = 100;
            } else {
                const lockpickPower = bestLockpick?.lockpick?.power ?? 0;
                successChance = Math.max(5, Math.min(95, 30 + (currentSkills.find(s => s.name === SkillName.Thieving)!.currentLevel - containerData.level) * 1.5 + (lockpickPower)));
            }
    
            if (Math.random() * 100 < successChance) {
                if (!containerData.unlocked) {
                    log("The lock clicks open.");
                }
                
                addXp(SkillName.Thieving, containerData.xp);
    
                if (containerData.trap?.mimicChance && Math.random() < containerData.trap.mimicChance) {
                    log("It's a mimic! It attacks!");
                    startCombat([`${depsRef.current.currentPoiId}:mimic:0`]);
                } else {
                    const isPilfering = worldState.activePilferingSession && activity.id.startsWith('pilfer_');
                    
                    const isStrongbox = activity.lootTableId.includes('_strongbox_');
                    const isCabinet = activity.lootTableId.includes('_cabinet_');
                    const isMedicine = activity.lootTableId.includes('_medicine_');
                    
                    let numRolls = 1;
                    if (isPilfering) {
                        if (isStrongbox) numRolls = 5;
                        else if (isCabinet || isMedicine) numRolls = 2;
                        else if (activity.lootTableId.includes('_chest_')) numRolls = 3;
                    }

                    const loots: LootRollResult[] = [];
                    for (let i = 0; i < numRolls; i++) {
                        const lootResult = rollOnLootTable(activity.lootTableId);
                        if (lootResult) {
                            let loot = typeof lootResult === 'string' ? { itemId: lootResult, quantity: 1, noted: false } : lootResult;
                            loots.push(loot);
                        }
                    }

                    if (loots.length > 0) {
                        let itemsAdded = 0;
                        loots.forEach(loot => {
                            const itemData = ITEMS[loot.itemId];
                            const isStackable = itemData.stackable || loot.noted;
                            let canAdd = false;

                            if (isStackable) {
                                canAdd = currentInv.some(slot => slot?.itemId === loot.itemId && !!slot.noted === !!loot.noted) || currentInv.some(slot => slot === null);
                            } else {
                                const freeSlots = currentInv.filter(slot => slot === null).length;
                                canAdd = freeSlots > 0;
                            }

                            if (canAdd) {
                                modifyItem(loot.itemId, loot.quantity, false, { bypassAutoBank: true, noted: loot.noted });
                            } else {
                                onItemDropped({ itemId: loot.itemId, quantity: loot.quantity, noted: loot.noted }, currentPoiId);
                                log(`Your inventory is full. The ${itemData.name} falls to the floor.`);
                            }
                        });
                    } else if (isPilfering) {
                         const fallbackCoins: Record<string, number> = {
                            'thieving_house_cabinet_dusty': 5, 'thieving_house_chest_dusty': 20,
                            'thieving_house_cabinet_locked': 30, 'thieving_house_chest_locked': 100,
                            'thieving_house_cabinet_pristine': 120, 'thieving_house_chest_pristine': 150,
                            'thieving_house_cabinet_ornate': 200, 'thieving_house_chest_ornate': 500,
                            'thieving_house_cabinet_gilded': 400, 'thieving_house_chest_gilded': 1000,
                            'thieving_house_cabinet_royal': 800, 'thieving_house_chest_royal': 2000,
                        };
                        
                        const coinAmount = fallbackCoins[activity.lootTableId];
                        if (coinAmount) {
                            let finalAmount = coinAmount;
                            modifyItem('coins', finalAmount, false, { bypassAutoBank: true });
                            log(`You find only ${finalAmount} coins.`);
                        } else {
                            if (!isStrongbox) log("You find nothing of interest.");
                        }
                    } else {
                         log("You find nothing of interest.");
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
                }
    
                if (bestLockpick && !bestLockpick.lockpick!.unbreakable && Math.random() < bestLockpick.lockpick!.breakChance) {
                    modifyItem(bestLockpick.id, -1, false);
                    log(`Your ${bestLockpick.name} breaks.`);
                }
            }
    
            activeTimeoutRef.current = null;
        }, 1200);
    
    }, []);

    const handleStealFromStall = useCallback((activity: StallActivity) => {
        const { isStunned, addLog, skills, inventory, modifyItem, addXp, addBuff, setPlayerHp, currentHp, onPlayerDeath, isInCombat, setIsResting } = depsRef.current;
        setIsResting(false);
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
            const { skills: currentSkills, addXp, addLog: log, addBuff: buff, setPlayerHp, currentHp, onPlayerDeath, modifyItem, equipment } = depsRef.current;
            
            const successChance = Math.max(20, Math.min(98, 50 + (currentSkills.find(s => s.name === SkillName.Thieving)!.currentLevel - stallData.level) * 2));
            
            if (Math.random() * 100 < successChance) {
                log(`You snatch something from the stall!`);
                addXp(SkillName.Thieving, stallData.xp);
                const lootResult = rollOnLootTable(activity.lootTableId);
                if (lootResult) {
                    let loot = typeof lootResult === 'string' ? { itemId: lootResult, quantity: 1, noted: false } : lootResult;
                    modifyItem(loot.itemId, loot.quantity, false, { bypassAutoBank: true, noted: loot.noted });
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
        handlePickpocket,
        handleLockpick,
        handleStealFromStall,
        containerStates,
    };
};
