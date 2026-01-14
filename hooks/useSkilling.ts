import React, { useState, useCallback, useEffect, useRef } from 'react';
import { POIActivity, ResourceNodeState, SkillName, PlayerSkill, InventorySlot, ToolType, Equipment, Item } from '../types';
import { INVENTORY_CAPACITY, ITEMS, rollOnLootTable, LootRollResult, LOG_HARDNESS, ORE_HARDNESS } from '../constants';
import { POIS } from '../data/pois';
import { useSoundEngine } from './useSoundEngine';
import { useUIState } from './useUIState';
import { SoundID } from '../constants/audioManifest';

type SkillingActivity = Extract<POIActivity, { type: 'skilling' }>;
type GroundItemActivity = Extract<POIActivity, { type: 'ground_item' }>;

interface SkillingDependencies {
    addLog: (message: string) => void;
    skills: (PlayerSkill & { currentLevel: number })[];
    addXp: (skill: SkillName, amount: number) => void;
    inventory: (InventorySlot | null)[];
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean }) => void;
    equipment: Equipment;
    setEquipment: React.Dispatch<React.SetStateAction<Equipment>>;
    checkQuestProgressOnShear: () => void;
    hasItems: (items: { itemId: string, quantity: number }[]) => boolean;
}

export const useSkilling = (initialNodeStates: Record<string, ResourceNodeState>, deps: SkillingDependencies) => {
    const { addLog, skills, addXp, inventory, modifyItem, equipment, setEquipment, checkQuestProgressOnShear, hasItems } = deps;
    const ui = useUIState();
    const { play } = useSoundEngine(ui.masterVolume, ui.isMuted);
    
    const [resourceNodeStates, setResourceNodeStates] = useState<Record<string, ResourceNodeState>>(initialNodeStates);
    const [activeSkilling, setActiveSkilling] = useState<{ nodeId: string; activity: SkillingActivity } | null>(null);
    const [skillingTick, setSkillingTick] = useState(0);
    const timerRef = useRef<number | null>(null);

    // Create refs to hold the latest state and dependencies to prevent stale closures in the timer.
    const depsRef = useRef(deps);
    useEffect(() => {
        depsRef.current = deps;
    });

    const activeSkillingRef = useRef(activeSkilling);
    useEffect(() => {
        activeSkillingRef.current = activeSkilling;
    }, [activeSkilling]);

    const skillingCallbackRef = useRef<(() => void) | null>(null);
    
    const playRandomSound = useCallback((baseId: string, count: number) => {
        const randomIndex = Math.floor(Math.random() * count) + 1;
        play(`${baseId}_${randomIndex}` as SoundID);
    }, [play]);

    useEffect(() => {
        skillingCallbackRef.current = () => {
            if (!activeSkilling) {
                if (timerRef.current) clearTimeout(timerRef.current);
                return;
            }

            const { inventory, addLog, skills, addXp, modifyItem, checkQuestProgressOnShear, equipment, hasItems } = depsRef.current;
            const { nodeId, activity } = activeSkilling;

            // Check if skill level is still high enough to perform the action.
            const skillNeeded = skills.find(s => s.name === activity.skill);
            if (skillNeeded && skillNeeded.currentLevel < activity.requiredLevel) {
                let actionVerb = 'gathering';
                switch (activity.skill) {
                    case SkillName.Fishing: actionVerb = 'catching'; break;
                    case SkillName.Woodcutting: actionVerb = 'chopping'; break;
                    case SkillName.Mining: actionVerb = 'mining'; break;
                    case SkillName.Crafting: actionVerb = 'crafting'; break;
                }
                
                const primaryLootItemName = activity.loot[0] ? ITEMS[activity.loot[0].itemId]?.name.replace('Raw ', '').toLowerCase() : 'resources';
                
                addLog(`Your ${activity.skill} level is too low to continue ${actionVerb} ${primaryLootItemName}.`);
                setActiveSkilling(null);
                return;
            }
            
            // Check for Bait Requirements for Fishing
            if (activity.skill === SkillName.Fishing) {
                if (activity.requiredTool === ToolType.FishingRod) {
                    if (!hasItems([{ itemId: 'fishing_bait', quantity: 1 }])) {
                        addLog("You have run out of fishing bait.");
                        setActiveSkilling(null);
                        return;
                    }
                } else if (activity.requiredTool === ToolType.FlyFishingRod) {
                    if (!hasItems([{ itemId: 'feathers', quantity: 1 }])) {
                        addLog("You have run out of feathers.");
                        setActiveSkilling(null);
                        return;
                    }
                }
            }

            if (inventory.filter(Boolean).length >= INVENTORY_CAPACITY) {
                addLog("Your inventory is full. You stop gathering.");
                setActiveSkilling(null);
                return;
            }
            
            setSkillingTick(t => t + 1);

            // Play background skilling sound (swinging/attempt)
            if (activity.skill === SkillName.Woodcutting) playRandomSound('WOODCUTTING_CHOP', 3);
            if (activity.skill === SkillName.Mining) playRandomSound('MINING_TINK', 3);
            if (activity.skill === SkillName.Fishing) playRandomSound('FISHING_SPLASH', 3);
            
            const successChance = getSuccessChance(activity);
            const roll = Math.random() * 100;

            if (roll < successChance) {
                const skill = skills.find(s => s.name === activity.skill);
                if (!skill) return;

                // Play success sound
                play('ITEM_PICKUP');

                // Consume Bait
                if (activity.skill === SkillName.Fishing) {
                    if (activity.requiredTool === ToolType.FishingRod) {
                        modifyItem('fishing_bait', -1, true);
                    } else if (activity.requiredTool === ToolType.FlyFishingRod) {
                        modifyItem('feathers', -1, true);
                    }
                }

                 for (let i = activity.loot.length - 1; i >= 0; i--) {
                    const potentialLoot = activity.loot[i];
                    const lootLevelReq = potentialLoot.requiredLevel ?? activity.requiredLevel;

                    if (skill.currentLevel >= lootLevelReq && Math.random() < potentialLoot.chance) {
                        if (potentialLoot.xp > 0) {
                            addXp(activity.skill, potentialLoot.xp);
                        }
                        
                        // --- APPLE LOGIC ---
                        // If chopping 'logs', 10% chance to get 'apple' instead.
                        let itemToGive = potentialLoot.itemId;
                        if (activity.skill === SkillName.Woodcutting && itemToGive === 'logs') {
                            if (Math.random() < 0.10) {
                                itemToGive = 'apple';
                                addLog("You found an apple in the tree!");
                            }
                        }
                        // -------------------

                        modifyItem(itemToGive, 1);
                        
                        if (itemToGive === 'wool') checkQuestProgressOnShear();

                        if (potentialLoot.itemId !== 'rune_essence') {
                            setResourceNodeStates(prev => {
                                const node = prev[nodeId];
                                if (!node) return prev;
                                const newResources = node.resources - 1;
                                if (newResources <= 0) {
                                    setActiveSkilling(null);
                                    return { ...prev, [nodeId]: { resources: 0, respawnTimer: activity.respawnTime } };
                                }
                                return { ...prev, [nodeId]: { ...node, resources: newResources } };
                            });
                        }
                        break; 
                    }
                }
                
                // Gem finding logic for mining
                if (activity.skill === SkillName.Mining) {
                    const { equipment, addLog, modifyItem } = depsRef.current;
                    const gemChance = equipment.necklace?.itemId === 'amulet_of_fate' ? 1 / 625 : 1 / 1000;

                    if (Math.random() < gemChance) {
                        if (equipment.ring?.itemId === 'ring_of_greed') {
                            addLog("Your ring tugs at your finger");
                        }

                        const gemRank: Record<string, number> = { 
                            'uncut_sapphire': 1, 
                            'uncut_emerald': 2, 
                            'uncut_ruby': 3, 
                            'uncut_diamond': 4,
                            'uncut_sunstone': 5,
                            'uncut_tenebrite': 6
                        };
                        let gemToAward: string | null = null;
                        
                        if (equipment.necklace?.itemId === 'amulet_of_fate') {
                            addLog("Your Amulet of Fate glows, improving your luck.");
                            const roll1 = rollOnLootTable('gem_table');
                            const roll2 = rollOnLootTable('gem_table');
                            
                            if (typeof roll1 === 'string' && typeof roll2 === 'string') {
                                // FIX: Compare rank values instead of comparing string vs number directly.
                                gemToAward = gemRank[roll2 as keyof typeof gemRank] > gemRank[roll1 as keyof typeof gemRank] ? roll2 : roll1;
                            } else {
                                gemToAward = (typeof roll1 === 'string' ? roll1 : null) || (typeof roll2 === 'string' ? roll2 : null);
                            }
                        } else {
                            const result = rollOnLootTable('gem_table');
                            if (typeof result === 'string') {
                                gemToAward = result;
                            }
                        }
                        
                        if (gemToAward) {
                            modifyItem(gemToAward, 1);
                            addLog(`You find a gem in the rock!`);
                        }
                    }
                }
            }
        };
    });

    const getSuccessChance = useCallback((activity: SkillingActivity): number => {
        if (activity.loot?.[0]?.itemId === 'rune_essence') {
            return 100;
        }
        const skill = skills.find(s => s.name === activity.skill);
        if (!skill) return 0;
    
        let toolPower = 0;
        
        let requiredToolType: ToolType | undefined = activity.requiredTool;
        if (!requiredToolType) {
            if (activity.skill === SkillName.Woodcutting) requiredToolType = ToolType.Axe;
            else if (activity.skill === SkillName.Mining) requiredToolType = ToolType.Pickaxe;
        }

        if (requiredToolType) {
            const allAvailableTools = [
                ...inventory.map(slot => slot ? ITEMS[slot.itemId] : null),
                equipment.weapon ? ITEMS[equipment.weapon.itemId] : null
            ].filter((item): item is Item => !!item && item.tool?.type === requiredToolType);
    
            const usableTools = allAvailableTools.filter(tool => 
                !tool.tool?.requiredLevels || tool.tool.requiredLevels.every(req => {
                    const playerSkill = skills.find(s => s.name === req.skill);
                    return playerSkill && playerSkill.level >= req.level;
                })
            );

            if (usableTools.length > 0) {
                const bestTool = usableTools.reduce((best, current) => 
                    (current.tool!.power > best.tool!.power ? current : best)
                );
                toolPower = bestTool.tool!.power;
            }
        }
    
        if (activity.skill === SkillName.Woodcutting) {
            let hardness = activity.treeHardness;
            if (hardness === undefined) {
                const primaryLoot = activity.loot?.[0];
                if (primaryLoot) {
                    hardness = LOG_HARDNESS[primaryLoot.itemId];
                }
            }
            if (hardness === undefined || hardness <= 0) {
                return 5;
            }
            const totalAxePower = skill.currentLevel + toolPower;
            const chance = (totalAxePower / hardness) * 100;
            return Math.min(100, chance);
        }

        if (activity.skill === SkillName.Mining) {
            let hardness: number | undefined;
            const primaryLoot = activity.loot?.[0];
            if (primaryLoot) {
                hardness = ORE_HARDNESS[primaryLoot.itemId];
            }
            if (hardness === undefined || hardness <= 0) {
                return 5;
            }
            const totalPickaxePower = skill.currentLevel + toolPower;
            const chance = (totalPickaxePower / hardness) * 100;
            return Math.min(100, chance);
        } else {
            const boost = activity.harvestBoost ?? 0;
            let bonus = toolPower;
            if (activity.skill === SkillName.Fishing) {
                const necklace = equipment.necklace;
                if (necklace?.itemId === 'necklace_of_the_angler' && (necklace.charges ?? 0) > 0) {
                    bonus += 30;
                }
            }
            const baseChance = Math.min(98, 60 + ((skill.currentLevel - activity.requiredLevel) * 2) + bonus);
            const finalChance = Math.min(99, baseChance + boost);
            return finalChance;
        }
    }, [skills, inventory, equipment]);

    const initializeNodeState = useCallback((nodeId: string, activity: SkillingActivity | GroundItemActivity) => {
        setResourceNodeStates(prev => {
            if (prev[nodeId]) return prev;
            
            if (activity.type === 'ground_item') {
                return {
                    ...prev,
                    [nodeId]: { resources: 1, respawnTimer: 0 } // Start available
                };
            }

            const { min, max } = activity.resourceCount;
            const initialResources = Math.floor(Math.random() * (max - min + 1)) + min;
            return {
                ...prev,
                [nodeId]: { resources: initialResources, respawnTimer: 0 }
            };
        });
    }, []);

    const stopSkilling = useCallback(() => {
        if (activeSkilling) {
            setActiveSkilling(null);
        }
    }, [activeSkilling]);

    const handleToggleSkilling = useCallback((activity: SkillingActivity) => {
        if (activeSkilling?.nodeId === activity.id) {
            stopSkilling();
            return;
        }
    
        const skill = skills.find(s => s.name === SkillName.Agility); // Intentional mismatch? No, should be current skill
        const playerSkill = skills.find(s => s.name === activity.skill);
        if (!playerSkill || playerSkill.currentLevel < activity.requiredLevel) {
            addLog(`You need a ${activity.skill} level of ${activity.requiredLevel} to do that.`);
            return;
        }
    
        let requiredToolType: ToolType | undefined = activity.requiredTool;
        if (!requiredToolType) {
            if (activity.skill === SkillName.Woodcutting) requiredToolType = ToolType.Axe;
            else if (activity.skill === SkillName.Mining) requiredToolType = ToolType.Pickaxe;
        }
    
        if (requiredToolType) {
            const allAvailableTools = [
                ...inventory.map(slot => slot ? ITEMS[slot.itemId] : null),
                equipment.weapon ? ITEMS[equipment.weapon.itemId] : null
            ].filter((item): item is Item => !!item && item.tool?.type === requiredToolType);
    
            if (allAvailableTools.length === 0) {
                const toolName = requiredToolType.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
                addLog(`You need a ${toolName} to do this.`);
                return;
            }
    
            const usableTools = allAvailableTools.filter(tool => 
                !tool.tool?.requiredLevels || tool.tool.requiredLevels.every(req => {
                    const playerSkill = skills.find(s => s.name === req.skill);
                    return playerSkill && playerSkill.level >= req.level;
                })
            );
    
            if (usableTools.length === 0) {
                const bestUnusableTool = allAvailableTools.reduce((best, current) => 
                    (current.tool!.power > best.tool!.power ? current : best)
                );
                const requirement = bestUnusableTool.tool!.requiredLevels![0];
                addLog(`You need a ${requirement.skill} level of ${requirement.level} to use your ${bestUnusableTool.name}.`);
                return;
            }
        } else if (activity.skill === SkillName.Crafting && activity.name === "Shear Sheep") {
            if (!inventory.some(slot => slot?.itemId === 'shears')) {
                addLog("You need a pair of shears to do this.");
                return;
            }
        }

        if (activity.skill === SkillName.Fishing) {
            if (activity.requiredTool === ToolType.FishingRod) {
                if (!inventory.some(slot => slot?.itemId === 'fishing_bait')) {
                    addLog("You need some fishing bait to do this.");
                    return;
                }
            } else if (activity.requiredTool === ToolType.FlyFishingRod) {
                if (!inventory.some(slot => slot?.itemId === 'feathers')) {
                    addLog("You need some feathers to do this.");
                    return;
                }
            }
        }
    
        if (inventory.filter(Boolean).length >= INVENTORY_CAPACITY) {
            addLog("Your inventory is full. You cannot gather resources.");
            return;
        }
        
        setActiveSkilling({ nodeId: activity.id, activity });
    }, [activeSkilling, skills, addLog, inventory, equipment, stopSkilling]);

    const handlePickupGroundItem = useCallback((activity: GroundItemActivity) => {
        // Check inventory
        const itemData = ITEMS[activity.itemId];
        if (!itemData) return;

        const freeSlots = inventory.filter(s => s === null).length;
        const stackExists = itemData.stackable && inventory.some(i => i?.itemId === activity.itemId);
        
        if (!stackExists && freeSlots < 1) {
            addLog("Your inventory is full.");
            return;
        }

        // Check if depleted (state is 0)
        const nodeState = resourceNodeStates[activity.id];
        if (nodeState && nodeState.resources <= 0) {
            addLog("This item has already been taken.");
            return;
        }

        // Play pickup sound
        play('ITEM_PICKUP');

        // Add item
        modifyItem(activity.itemId, activity.resourceCount);
        addLog(`You pick up ${activity.resourceCount > 1 ? `${activity.resourceCount}x ` : ''}${itemData.name}.`);

        // Set to depleted
        setResourceNodeStates(prev => ({
            ...prev,
            [activity.id]: { resources: 0, respawnTimer: activity.respawnTimer }
        }));
    }, [inventory, resourceNodeStates, addLog, modifyItem, play]);

    const handleTakeAllLoot = useCallback(() => {
        // Obsolete, placeholder for satisfying props elsewhere if needed.
    }, []);

    const getTickRate = useCallback((activity: SkillingActivity, currentDeps: SkillingDependencies): number => {
        const { inventory, equipment, skills } = currentDeps;
        const GAME_TICK_MS = 600;
        const isRuneEssence = activity.loot?.[0]?.itemId === 'rune_essence';

        if (isRuneEssence) {
            const allAvailableTools = [...inventory.map(slot => slot ? ITEMS[slot.itemId] : null), equipment.weapon ? ITEMS[equipment.weapon.itemId] : null].filter((item): item is Item => !!item && item.tool?.type === ToolType.Pickaxe);
            const usableTools = allAvailableTools.filter(tool => !tool.tool?.requiredLevels || tool.tool.requiredLevels.every(req => { const playerSkill = skills.find(s => s.name === req.skill); return playerSkill && playerSkill.level >= req.level; }));
            let bestToolMaterial = 'bronze';
            if (usableTools.length > 0) {
                const bestTool = usableTools.reduce((best, current) => (current.tool!.power > best.tool!.power ? current : best));
                bestToolMaterial = bestTool.material as string;
            }
            
            switch (bestToolMaterial) {
                case 'runic': return 3 * GAME_TICK_MS;
                case 'adamantite': return 4 * GAME_TICK_MS;
                case 'mithril': return 5 * GAME_TICK_MS;
                case 'steel': return 6 * GAME_TICK_MS;
                case 'iron':
                case 'bronze':
                default:
                    return 7 * GAME_TICK_MS;
            }
        } else {
            const { skill, gatherTime } = activity;
            if (skill === SkillName.Woodcutting || skill === SkillName.Mining || skill === SkillName.Crafting) {
                return 1800;
            } else {
                return gatherTime;
            }
        }
    }, []);

    useEffect(() => {
        if (!activeSkilling) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        const { activity } = activeSkilling;

        const tick = () => {
            if (!activeSkillingRef.current) {
                return;
            }
            
            skillingCallbackRef.current?.();
            
            const nextTickRate = getTickRate(activity, depsRef.current);
            timerRef.current = window.setTimeout(tick, nextTickRate);
        };

        const initialDelay = getTickRate(activity, depsRef.current);
        timerRef.current = window.setTimeout(tick, initialDelay);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [activeSkilling, getTickRate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setResourceNodeStates(prev => {
                let changed = false;
                const newStates = { ...prev };
                for (const nodeId in newStates) {
                    if (newStates[nodeId].respawnTimer > 0) {
                        changed = true;
                        const newTimer = newStates[nodeId].respawnTimer - 1000;
                        newStates[nodeId].respawnTimer = Math.max(0, newTimer);

                        if (newTimer <= 0) {
                            const poi = Object.values(POIS).find(p => p.activities.some(a => (a.type === 'skilling' || a.type === 'ground_item') && a.id === nodeId));
                            const activity = poi?.activities.find(a => (a.type === 'skilling' || a.type === 'ground_item') && a.id === nodeId);
                            
                            if (activity) {
                                if (activity.type === 'ground_item') {
                                    newStates[nodeId].resources = 1;
                                } else if (activity.type === 'skilling') {
                                    const { min, max } = activity.resourceCount;
                                    newStates[nodeId].resources = Math.floor(Math.random() * (max - min + 1)) + min;
                                }
                            }
                        }
                    }
                }
                return changed ? newStates : prev;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return {
        resourceNodeStates,
        activeSkillingNodeId: activeSkilling?.nodeId ?? null,
        skillingTick,
        handleToggleSkilling,
        handlePickupGroundItem, 
        initializeNodeState,
        stopSkilling,
        getSuccessChance,
    };
};