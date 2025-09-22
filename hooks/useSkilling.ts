
import { useState, useCallback, useEffect, useRef } from 'react';
import { POIActivity, ResourceNodeState, SkillName, PlayerSkill, InventorySlot, ToolType, Equipment, Item } from '../types';
import { INVENTORY_CAPACITY, ITEMS, rollOnLootTable } from '../constants';
import { POIS } from '../data/pois';

type SkillingActivity = Extract<POIActivity, { type: 'skilling' }>;

interface SkillingDependencies {
    addLog: (message: string) => void;
    skills: (PlayerSkill & { currentLevel: number })[];
    addXp: (skill: SkillName, amount: number) => void;
    inventory: (InventorySlot | null)[];
    modifyItem: (itemId: string, quantity: number, quiet?: boolean) => void;
    equipment: Equipment;
}

export const useSkilling = (initialNodeStates: Record<string, ResourceNodeState>, deps: SkillingDependencies) => {
    const { addLog, skills, addXp, inventory, modifyItem, equipment } = deps;
    
    const [resourceNodeStates, setResourceNodeStates] = useState<Record<string, ResourceNodeState>>(initialNodeStates);
    const [activeSkilling, setActiveSkilling] = useState<{ nodeId: string; activity: SkillingActivity } | null>(null);
    const [skillingTick, setSkillingTick] = useState(0);

    const getSuccessChance = useCallback((activity: SkillingActivity): number => {
        const boost = activity.harvestBoost ?? 0;

        if (activity.skill === SkillName.Woodcutting || activity.skill === SkillName.Mining) {
            const skillingSkill = skills.find(s => s.name === activity.skill);
            if (!skillingSkill) return 0;

            const toolType = activity.skill === SkillName.Woodcutting ? ToolType.Axe : ToolType.Pickaxe;
            
            const inventoryTools = inventory
                .map(slot => slot ? ITEMS[slot.itemId] : null)
                .filter((item): item is Item => !!item && item.tool?.type === toolType);
                
            const equippedToolItem = equipment.weapon ? ITEMS[equipment.weapon.itemId] : null;
            const equippedTools = (equippedToolItem && equippedToolItem.tool?.type === toolType) ? [equippedToolItem] : [];
            
            const allAvailableTools = [...inventoryTools, ...equippedTools];
            
            if (allAvailableTools.length === 0) {
                return 0;
            }

            const bestTool = allAvailableTools.reduce((best, current) => 
                (current.tool!.power > best.tool!.power ? current : best)
            );

            const toolPower = bestTool.tool!.power;
            const skillLevel = skillingSkill.currentLevel;
            const resourceLevel = activity.requiredLevel;

            // Base chance formula: min 5%, max 99%. Scales with level difference and tool power.
            const baseChance = Math.min(99, Math.max(5, -10 + ((skillLevel - resourceLevel) * 0.8) + (toolPower * 1.5)));
            // Apply the flat boost, still capped at 99%
            const finalChance = Math.min(99, baseChance + boost);
            return finalChance;
        } else { // Fallback for other skills like fishing
            const skill = skills.find(s => s.name === activity.skill);
            if (!skill) return 0;
            // Base chance is 60%, +2% for each level above requirement, capped at 98%.
            const baseChance = Math.min(98, 60 + ((skill.currentLevel - activity.requiredLevel) * 2));
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
        } else {
            const skill = skills.find(s => s.name === activity.skill);
            if (!skill || skill.currentLevel < activity.requiredLevel) {
                addLog(`You need a ${activity.skill} level of ${activity.requiredLevel} to do that.`);
                return;
            }

            let requiredToolType: ToolType | null = null;
            if (activity.skill === SkillName.Woodcutting) requiredToolType = ToolType.Axe;
            if (activity.skill === SkillName.Mining) requiredToolType = ToolType.Pickaxe;
            
            if (requiredToolType) {
                const hasTool = inventory.some(slot => slot && ITEMS[slot.itemId]?.tool?.type === requiredToolType) ||
                               (equipment.weapon && ITEMS[equipment.weapon.itemId]?.tool?.type === requiredToolType);
                if (!hasTool) {
                    addLog(`You need a ${requiredToolType.toLowerCase()} to do this.`);
                    return;
                }
            }

            if (inventory.filter(Boolean).length >= INVENTORY_CAPACITY) {
                addLog("Your inventory is full. You cannot gather resources.");
                return;
            }
            setActiveSkilling({ nodeId: activity.id, activity });
        }
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
                    const gemId = rollOnLootTable('gem_table');
                    if (gemId) {
                        // Re-check inventory space as this is a bonus item.
                        if (inventory.filter(Boolean).length < INVENTORY_CAPACITY) {
                           modifyItem(gemId, 1);
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
