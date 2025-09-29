

import { useState, useCallback, useEffect, useRef } from 'react';
import { POIActivity, ResourceNodeState, SkillName, PlayerSkill, InventorySlot, ToolType, Equipment, Item } from '../types';
import { INVENTORY_CAPACITY, ITEMS, rollOnLootTable, LootRollResult, LOG_HARDNESS } from '../constants';
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
}

export const useSkilling = (initialNodeStates: Record<string, ResourceNodeState>, deps: SkillingDependencies) => {
    const { addLog, skills, addXp, inventory, modifyItem, equipment, setEquipment } = deps;
    
    const [resourceNodeStates, setResourceNodeStates] = useState<Record<string, ResourceNodeState>>(initialNodeStates);
    const [activeSkilling, setActiveSkilling] = useState<{ nodeId: string; activity: SkillingActivity } | null>(null);
    const [skillingTick, setSkillingTick] = useState(0);

    const getSuccessChance = useCallback((activity: SkillingActivity): number => {
        const skill = skills.find(s => s.name === activity.skill);
        if (!skill) return 0;
    
        let toolPower = 0;
        
        // Determine the tool type required by the activity
        let requiredToolType: ToolType | undefined = activity.requiredTool;
        if (!requiredToolType) {
            if (activity.skill === SkillName.Woodcutting) requiredToolType = ToolType.Axe;
            else if (activity.skill === SkillName.Mining) requiredToolType = ToolType.Pickaxe;
        }

        // Find the best usable tool if one is required
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
            // Start with the override if it exists.
            let hardness = activity.treeHardness;

            // If no override, determine hardness from the primary log type.
            if (hardness === undefined) {
                const primaryLoot = activity.loot?.[0];
                if (primaryLoot) {
                    hardness = LOG_HARDNESS[primaryLoot.itemId];
                }
            }
            
            // If hardness is still not determined (malformed data), use a fallback.
            if (hardness === undefined || hardness <= 0) {
                console.warn(`Woodcutting activity ${activity.id} is missing a valid treeHardness or determinable log type.`);
                return 5; // Fallback to a low chance
            }

            const totalAxePower = skill.currentLevel + toolPower;
            const chance = (totalAxePower / hardness) * 100;
            return Math.min(100, chance);
        }

        if (activity.skill === SkillName.Mining) {
            const boost = activity.harvestBoost ?? 0;
            const skillLevel = skill.currentLevel;
            const resourceLevel = activity.requiredLevel;
            const baseChance = Math.min(99, Math.max(5, -10 + ((skillLevel - resourceLevel) * 0.8) + (toolPower * 1.5)));
            const finalChance = Math.min(99, baseChance + boost);
            return finalChance;
        } else { // Handle other skills like Fishing
            const boost = activity.harvestBoost ?? 0;
            let bonus = toolPower; // Add tool's power as a flat bonus
    
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
            addLog("You stop gathering.");
        }
    }, [activeSkilling, addLog]);

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
    
        // Determine the required tool type from the activity or skill type
        let requiredToolType: ToolType | undefined = activity.requiredTool;
        if (!requiredToolType) {
            if (activity.skill === SkillName.Woodcutting) requiredToolType = ToolType.Axe;
            else if (activity.skill === SkillName.Mining) requiredToolType = ToolType.Pickaxe;
        }
    
        // If a tool is required, perform checks
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
                const requirement = bestUnusableTool.tool!.requiredLevels![0]; // Assume first requirement is the one to show
                addLog(`You need a ${requirement.skill} level of ${requirement.level} to use your ${bestUnusableTool.name}.`);
                return;
            }
        }
    
        if (inventory.filter(Boolean).length >= INVENTORY_CAPACITY) {
            addLog("Your inventory is full. You cannot gather resources.");
            return;
        }
        setActiveSkilling({ nodeId: activity.id, activity });
    }, [activeSkilling, skills, addLog, inventory, equipment, stopSkilling]);

    // Main skilling tick logic
    const skillingCallbackRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        skillingCallbackRef.current = () => {
            if (!activeSkilling) return;

            if (inventory.filter(Boolean).length >= INVENTORY_CAPACITY) {
                addLog("Your inventory is full. You stop gathering.");
                setActiveSkilling(null);
                return;
            }

            const { nodeId, activity } = activeSkilling;

            // Gem finding logic for mining happens on every swing, not just on success.
            if (activity.skill === SkillName.Mining) {
                if (Math.random() < 0.001) { // 1 in 1000 chance
                    const gemDropResult = rollOnLootTable('gem_table');
                    if (gemDropResult) {
                        const drop: LootRollResult = typeof gemDropResult === 'string' 
                            ? { itemId: gemDropResult, quantity: 1, noted: false } 
                            : gemDropResult;

                        if (inventory.filter(Boolean).length < INVENTORY_CAPACITY) {
                           modifyItem(drop.itemId, drop.quantity);
                           addLog(`As you swing your pickaxe, a gem flies from the rock!`);
                        } else {
                           addLog("You would have found a gem, but your inventory is full!");
                        }
                    }
                }
            }
            
            setSkillingTick(t => t + 1); // Trigger animation tick regardless of success
            
            const chance = getSuccessChance(activity);
            if (Math.random() * 100 < chance) {
                const skill = skills.find(s => s.name === activity.skill);
                if (!skill) return;

                for (let i = activity.loot.length - 1; i >= 0; i--) {
                    const potentialLoot = activity.loot[i];
                    const lootLevelReq = potentialLoot.requiredLevel ?? activity.requiredLevel;

                    if (skill.currentLevel >= lootLevelReq && Math.random() < potentialLoot.chance) {
                        addXp(activity.skill, potentialLoot.xp);
                        modifyItem(potentialLoot.itemId, 1);
                        
                        if (activity.skill === SkillName.Fishing) {
                            const necklace = equipment.necklace;
                            if (necklace?.itemId === 'necklace_of_the_angler' && (necklace.charges ?? 0) > 0) {
                                const newCharges = (necklace.charges ?? 1) - 1;
                                if (newCharges > 0) {
                                    setEquipment(prev => ({ ...prev, necklace: { ...necklace, charges: newCharges } }));
                                } else {
                                    addLog("Your Necklace of the Angler has run out of charges and dissolves into seafoam.");
                                    setEquipment(prev => ({ ...prev, necklace: null }));
                                }
                            }
                        }

                        let shouldDecrementResource = true;
                        const ring = equipment.ring;
                        const isMiningWithProspectingRing = activity.skill === SkillName.Mining && ring?.itemId === 'ring_of_prospecting' && (ring.charges ?? 0) > 0;
                        const isWoodcuttingWithWoodsmanRing = activity.skill === SkillName.Woodcutting && ring?.itemId === 'ring_of_the_woodsman' && (ring.charges ?? 0) > 0;

                        if (isMiningWithProspectingRing) {
                            if (Math.random() < 0.20) { // 20% proc chance
                                shouldDecrementResource = false;
                                modifyItem(potentialLoot.itemId, 1); // Give extra ore
                                const newCharges = (ring.charges ?? 1) - 1;

                                if (newCharges > 0) {
                                    addLog("Your Ring of Prospecting hums, preserving the rock and finding an extra ore!");
                                    setEquipment(prev => ({
                                        ...prev,
                                        ring: { ...ring, charges: newCharges }
                                    }));
                                } else {
                                    addLog("Your Ring of Prospecting has run out of charges and crumbles to dust.");
                                    setEquipment(prev => ({
                                        ...prev,
                                        ring: null
                                    }));
                                }
                            }
                        } else if (isWoodcuttingWithWoodsmanRing) {
                            if (Math.random() < 0.25) { // 25% proc chance
                                shouldDecrementResource = false; // Gives a "free" log without depleting the node
                                const newCharges = (ring.charges ?? 1) - 1;

                                if (newCharges > 0) {
                                    addLog("Your Ring of the Woodsman glows, and the tree seems to rejuvenate slightly.");
                                    setEquipment(prev => ({
                                        ...prev,
                                        ring: { ...ring, charges: newCharges }
                                    }));
                                } else {
                                    addLog("Your Ring of the Woodsman has run out of charges and crumbles to dust.");
                                    setEquipment(prev => ({
                                        ...prev,
                                        ring: null
                                    }));
                                }
                            }
                        }

                        if (ring?.itemId === 'ring_of_mastery' && (ring.charges ?? 0) > 0) {
                            if (Math.random() < 0.15) { // 15% chance
                                addXp(activity.skill, potentialLoot.xp); // Grant the XP again for double
                                const newCharges = (ring.charges ?? 1) - 1;
                        
                                if (newCharges > 0) {
                                    addLog("Your Ring of Mastery hums, and you feel a surge of insight, doubling your XP gain!");
                                    setEquipment(prev => ({ ...prev, ring: { ...ring, charges: newCharges } }));
                                } else {
                                    addLog("Your Ring of Mastery has run out of charges and crumbles to dust.");
                                    setEquipment(prev => ({ ...prev, ring: null }));
                                }
                            }
                        }
                        
                        if (shouldDecrementResource) {
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

    // Skilling interval
    useEffect(() => {
        if (!activeSkilling) return;

        const tick = () => {
            skillingCallbackRef.current?.();
        };
        
        let tickRate;
        if (activeSkilling.activity.skill === SkillName.Woodcutting || activeSkilling.activity.skill === SkillName.Mining) {
            tickRate = 1800; // Constant attempt tick rate
        } else {
            tickRate = activeSkilling.activity.gatherTime;
        }

        const intervalId = setInterval(tick, tickRate);

        return () => clearInterval(intervalId);
    }, [activeSkilling]);

    // Resource node respawn timer
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