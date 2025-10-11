import React, { useState, useCallback, useEffect, useRef } from 'react';
import { POIActivity, ResourceNodeState, SkillName, PlayerSkill, InventorySlot, ToolType, Equipment, Item } from '../types';
import { INVENTORY_CAPACITY, ITEMS, rollOnLootTable, LootRollResult, LOG_HARDNESS, ORE_HARDNESS } from '../constants';
import { POIS } from '../data/pois';

type SkillingActivity = Extract<POIActivity, { type: 'skilling' }>;

interface SkillingDependencies {
    addLog: (message: string) => void;
    skills: (PlayerSkill & { currentLevel: number })[];
    addXp: (skill: SkillName, amount: number) => void;
    inventory: (InventorySlot | null)[];
    modifyItem: (itemId: string, quantity: number, quiet?: boolean) => void;
    equipment: Equipment;
    setEquipment: React.Dispatch<React.SetStateAction<Equipment>>;
    checkQuestProgressOnShear: () => void;
    hasItems: (items: { itemId: string, quantity: number }[]) => boolean;
}

export const useSkilling = (initialNodeStates: Record<string, ResourceNodeState>, deps: SkillingDependencies) => {
    const { addLog, skills, addXp, inventory, modifyItem, equipment, setEquipment, checkQuestProgressOnShear, hasItems } = deps;
    
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

    useEffect(() => {
        skillingCallbackRef.current = () => {
            if (!activeSkilling) {
                if (timerRef.current) clearTimeout(timerRef.current);
                return;
            }

            if (inventory.filter(Boolean).length >= INVENTORY_CAPACITY) {
                addLog("Your inventory is full. You stop gathering.");
                setActiveSkilling(null);
                return;
            }

            const { nodeId, activity } = activeSkilling;
            
            setSkillingTick(t => t + 1);
            
            const successChance = getSuccessChance(activity);
            const roll = Math.random() * 100;

            if (roll < successChance) {
                const skill = skills.find(s => s.name === activity.skill);
                if (!skill) return;

                 for (let i = activity.loot.length - 1; i >= 0; i--) {
                    const potentialLoot = activity.loot[i];
                    const lootLevelReq = potentialLoot.requiredLevel ?? activity.requiredLevel;

                    if (skill.currentLevel >= lootLevelReq && Math.random() < potentialLoot.chance) {
                        if (potentialLoot.xp > 0) {
                            addXp(activity.skill, potentialLoot.xp);
                        }
                        modifyItem(potentialLoot.itemId, 1);
                        
                        if (potentialLoot.itemId === 'wool') checkQuestProgressOnShear();

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

    const initializeNodeState = useCallback((nodeId: string, activity: SkillingActivity) => {
        setResourceNodeStates(prev => {
            if (prev[nodeId]) return prev;
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
    
        const skill = skills.find(s => s.name === activity.skill);
        if (!skill || skill.currentLevel < activity.requiredLevel) {
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
                            const poi = Object.values(POIS).find(p => p.activities.some(a => a.type === 'skilling' && a.id === nodeId));
                            const activity = poi?.activities.find(a => a.type === 'skilling' && a.id === nodeId) as SkillingActivity | undefined;
                            if (activity) {
                                const { min, max } = activity.resourceCount;
                                newStates[nodeId].resources = Math.floor(Math.random() * (max - min + 1)) + min;
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
        initializeNodeState,
        stopSkilling,
        getSuccessChance,
    };
};