
import React, { useCallback } from 'react';
// FIX: Import Equipment type.
import { InventorySlot, PlayerSkill, SkillName, ActiveCraftingAction, Item, CraftingContext, POIActivity, EquipmentSlot, PlayerQuestState, Spell, Equipment, ActiveBuff, DialogueResponse, DialogueCheckRequirement, WeaponType, EquipmentStats, BonfireActivity } from '../types';
import { ITEMS, FLETCHING_RECIPES, HERBLORE_RECIPES, HERBS, INVENTORY_CAPACITY, rollOnLootTable, LootRollResult, FIREMAKING_RECIPES, QUESTS, COOKING_RECIPES, SMELTING_RECIPES, GEM_CUTTING_RECIPES, REGIONS } from '../../constants';
import { POIS } from '../../data/pois';
// FIX: Import ContextMenuOption from its source file instead of re-exporting from useUIState.
import { MakeXPrompt, useUIState, ConfirmationPrompt } from './useUIState';
import { useNavigation } from './useNavigation';

type BarType = 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'silver_bar' | 'gold_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar';

interface CraftingHandlers {
    handleCooking: (recipeId: string, quantity?: number) => void;
    // FIX: Corrected typo from onSmelt to handleSmelting and added handleStokeBonfire
    handleSmelting: (barType: BarType, quantity: number) => void;
    handleStokeBonfire: (logId: string, bonfireId: string) => void;
}

interface UseItemActionsProps {
    addLog: (message: string) => void;
    currentHp: number;
    maxHp: number;
    setCurrentHp: React.Dispatch<React.SetStateAction<number>>;
    currentPrayer: number;
    maxPrayer: number;
    setCurrentPrayer: (updater: React.SetStateAction<number>) => void;
    applyStatModifier: (skill: SkillName, value: number, baseLevelOnConsumption: number) => void;
    addBuff: (buff: Omit<ActiveBuff, 'id' | 'durationRemaining'>) => void;
    curePoison: () => void;
    setInventory: React.Dispatch<React.SetStateAction<(InventorySlot | null)[]>>;
    skills: (PlayerSkill & { currentLevel: number; })[];
    inventory: (InventorySlot | null)[];
    activeCraftingAction: ActiveCraftingAction | null;
    setActiveCraftingAction: (action: ActiveCraftingAction | null) => void;
    hasItems: (items: { itemId: string, quantity: number }[]) => boolean;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean }) => void;
    addXp: (skill: SkillName, amount: number) => void;
    openCraftingView: (context: CraftingContext) => void;
    itemToUse: { item: InventorySlot, index: number } | null;
    setItemToUse: (item: { item: InventorySlot, index: number } | null) => void;
    isBusy?: boolean;
    setConfirmationPrompt: (prompt: ConfirmationPrompt | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    startQuest: (questId: string) => void;
    currentPoiId: string;
    playerQuests: PlayerQuestState[];
    isStunned: boolean;
    setActiveDungeonMap: (mapInfo: { regionId: string; mapTitle: string; } | null) => void;
    confirmValuableDrops: boolean;
    valuableDropThreshold: number;
    ui: ReturnType<typeof useUIState>;
    equipment: Equipment;
    onResponse: (response: DialogueResponse) => void;
    handleDialogueCheck: (requirements: DialogueCheckRequirement[]) => boolean;
    crafting: CraftingHandlers;
    // FIX: Add missing setEquipment prop to allow modification of equipped items.
    setEquipment: React.Dispatch<React.SetStateAction<Equipment>>;
    navigation: ReturnType<typeof useNavigation>;
}

const MULTI_BITE_FOODS: Record<string, string> = {
    'cake': '2_3_cake',
    '2_3_cake': 'slice_of_cake',
    'berry_pie': 'half_berry_pie',
    'apple_pie': 'half_apple_pie',
    'meat_pie': 'half_meat_pie',
    'fish_pie': 'half_fish_pie',
    'plain_pizza': 'half_plain_pizza',
    'meat_pizza': 'half_meat_pizza',
    'anchovy_pizza': 'half_anchovy_pizza',
    'pineapple_pizza': 'half_pineapple_pizza',
};

export const useItemActions = (props: UseItemActionsProps) => {
    // FIX: Added setEquipment to destructuring.
    const { addLog, currentHp, maxHp, setCurrentHp, currentPrayer, maxPrayer, setCurrentPrayer, applyStatModifier, setInventory, setEquipment, skills, inventory, activeCraftingAction, setActiveCraftingAction, hasItems, modifyItem, addXp, openCraftingView, itemToUse, setItemToUse, addBuff, curePoison, setMakeXPrompt, startQuest, currentPoiId, playerQuests, isStunned, setActiveDungeonMap, confirmValuableDrops, valuableDropThreshold, ui, equipment, onResponse, handleDialogueCheck, crafting, isBusy, navigation } = props;
    const { setActiveDialogue, setContextMenu } = ui;
    const handleTeleport = useCallback((
        itemSlot: InventorySlot,
        slotIdentifier: number | keyof Equipment,
        from: 'inventory' | keyof Equipment,
        poiId: string
    ) => {
        const itemData = ITEMS[itemSlot.itemId];
        const charges = itemSlot.charges ?? itemData.charges ?? 0;

        if (charges <= 0) {
            addLog("It has no charges left.");
            return;
        }

        const newCharges = charges - 1;

        // Default to destroying the item unless destroyOnEmpty is explicitly false.
        const destroy = itemData.destroyOnEmpty !== false;

        if (newCharges === 0 && destroy) {
            addLog(`Your ${itemData.name} crumbles to dust, its magic expended.`);
            if (from === 'inventory') {
                const index = slotIdentifier as number;
                setInventory(prev => {
                    const newInv = [...prev];
                    newInv[index] = null;
                    return newInv;
                });
            } else {
                const slotKey = slotIdentifier as keyof Equipment;
                setEquipment(prev => ({ ...prev, [slotKey]: null }));
            }
        } else {
            if (from === 'inventory') {
                const index = slotIdentifier as number;
                setInventory(prev => {
                    const newInv = [...prev];
                    const slot = newInv[index];
                    if (slot) {
                        newInv[index] = { ...slot, charges: newCharges };
                    }
                    return newInv;
                });
            } else {
                const slotKey = slotIdentifier as keyof Equipment;
                setEquipment(prev => {
                    const newEq = { ...prev };
                    const slot = newEq[slotKey];
                    if (slot) {
                        newEq[slotKey] = { ...slot, charges: newCharges };
                    }
                    return newEq;
                });
            }
            addLog(`You rub the ${itemData.name} and feel a magical pull...`);
            if (newCharges === 0) {
                addLog(`The ${itemData.name} has run out of charges.`);
            }
        }

        if (navigation) {
            navigation.handleForcedNavigate(poiId);
        } else {
            console.error("Navigation handler not found in itemActions hook props!");
        }

    }, [setInventory, setEquipment, addLog, navigation]);


    const handleConsume = useCallback((itemId: string, inventoryIndex: number) => {
        if (isStunned) {
            addLog("You are stunned and cannot eat or drink.");
            return;
        }
        const itemData = ITEMS[itemId];
        if (!itemData) return;

        if (itemData.cleanable) {
            const herbloreLevel = skills.find(s => s.name === SkillName.Herblore)?.currentLevel ?? 1;
            const herbData = HERBS.find(h => h.grimy === itemId);
            if (herbData && herbloreLevel < herbData.level) {
                addLog(`You need a Herblore level of ${herbData.level} to clean this herb.`);
                return;
            }
            
            setInventory(prevInv => {
                const newInv = [...prevInv];
                newInv[inventoryIndex] = null;
                return newInv;
            });

            modifyItem(itemData.cleanable.cleanItemId, 1, true, { bypassAutoBank: true });
            addXp(SkillName.Herblore, itemData.cleanable.xp);
            return;
        }

        if (!itemData.consumable) return;
        
        if (itemData.consumable.curesPoison) {
            curePoison();
        }

        if (itemData.consumable.special === 'treasure_chest') {
            const freeSlots = inventory.filter(s => s === null).length;
            if (freeSlots < 9) {
                addLog("You need at least 9 free inventory slots to open this chest.");
                return;
            }
        
            modifyItem(itemId, -1, true);
            addLog("You open the treasure chest and find...");
        
            for (let i = 0; i < 5; i++) {
                const gem = rollOnLootTable('gem_table');
                if (gem) {
                    const gemId = typeof gem === 'string' ? gem : gem.itemId;
                    modifyItem(gemId, 1, true, { bypassAutoBank: true, noted: true });
                }
            }
        
            for (let i = 0; i < 3; i++) {
                const herb = rollOnLootTable('herb_table');
                if (herb) {
                    const herbId = typeof herb === 'string' ? herb : herb.itemId;
                    modifyItem(herbId, 1, true, { bypassAutoBank: true, noted: true });
                }
            }
        
            const mithrilEquipment = Object.values(ITEMS).filter(
                item => item.material === 'mithril' && item.equipment
            );
            if (mithrilEquipment.length > 0) {
                const randomMithrilItem = mithrilEquipment[Math.floor(Math.random() * mithrilEquipment.length)];
                if (randomMithrilItem.id === 'mithril_arrow') {
                    modifyItem(randomMithrilItem.id, 100, true, { bypassAutoBank: true });
                } else {
                    modifyItem(randomMithrilItem.id, 1, true, { bypassAutoBank: true });
                }
            }
        
            if (Math.random() < 0.01) {
                modifyItem('runic_scimitar', 1, true, { bypassAutoBank: true });
                addLog("Incredibly lucky! You found a Runic Scimitar inside!");
            }
        
            return;
        }

        const hasNonHealingEffect = !!(itemData.consumable.statModifiers || itemData.consumable.buffs || itemData.consumable.givesCoins || itemData.consumable.curesPoison || itemData.consumable.potionEffect);

        if (itemData.consumable.healAmount && currentHp >= maxHp && !hasNonHealingEffect) {
            addLog("You are already at full health.");
            return;
        }

        if (itemData.consumable.givesCoins) {
            const { min, max } = itemData.consumable.givesCoins;
            const amount = Math.floor(Math.random() * (max - min + 1)) + min;
            modifyItem('coins', amount, true);
            addLog(`You open the pouch and find ${amount} coins.`);
        }
        if (itemData.consumable.healAmount && currentHp < maxHp) {
            const healAmount = itemData.consumable.healAmount;
            setCurrentHp(prev => Math.min(maxHp, prev + healAmount));
            addLog(`You eat the ${itemData.name}.`);
        }
        if (itemData.consumable.potionEffect) {
            if (itemId === 'prayer_potion') {
                const prayerSkill = skills.find(s => s.name === SkillName.Prayer);
                if (prayerSkill) {
                    const prayerLevel = prayerSkill.level;
                    const restoreAmount = Math.floor(prayerLevel * 0.20) + 10;
                    setCurrentPrayer(prev => {
                        const newPrayer = Math.min(maxPrayer, prev + restoreAmount);
                        const restored = newPrayer - prev;
                        if (restored > 0) {
                            addLog(`You drink some of the potion and restore ${Math.floor(restored)} prayer points.`);
                        } else {
                            addLog(`You drink some of the potion, but your prayer is already full.`);
                        }
                        return newPrayer;
                    });
                }
            }
        }
        if (itemData.consumable.statModifiers) {
            itemData.consumable.statModifiers.forEach(modifier => {
                let boostValue = 0;
                const skillData = skills.find(s => s.name === modifier.skill);
                const baseLevel = skillData ? skillData.level : 1;
                
                if (typeof modifier.value === 'number') {
                    boostValue = modifier.value;
                } else if (typeof modifier.percent === 'number' && typeof modifier.base === 'number') {
                    boostValue = Math.floor(baseLevel * modifier.percent) + modifier.base;
                }
                
                if (boostValue !== 0) {
                    applyStatModifier(modifier.skill, boostValue, baseLevel);
                }
            });
        }
        if (itemData.consumable.buffs) {
            itemData.consumable.buffs.forEach(buff => {
                addBuff(buff);
            });
        }
        
        if (itemData.doseable) {
            setInventory(prev => {
                const newInv = [...prev];
                const slot = newInv[inventoryIndex];
                if (!slot) return prev;

                const currentDoses = slot.doses ?? itemData.maxDoses ?? 4;

                if (currentDoses > 1) {
                    newInv[inventoryIndex] = { ...slot, doses: currentDoses - 1 };
                    addLog(`You have ${currentDoses - 1} doses of ${itemData.name} left.`);
                } else {
                    if (itemData.emptyable) {
                        newInv[inventoryIndex] = { itemId: itemData.emptyable.emptyItemId, quantity: 1 };
                        addLog(`You have finished the ${itemData.name}.`);
                    } else {
                        newInv[inventoryIndex] = { ...slot, doses: 0 };
                    }
                }
                return newInv;
            });
            return;
        }
        
        // Logic for standard items and Multi-bite food
        setInventory(prev => {
            const newInv = [...prev];
            const itemSlot = newInv[inventoryIndex];
    
            if (!itemSlot) return prev;

            const nextBiteItem = MULTI_BITE_FOODS[itemId];
            
            if (nextBiteItem) {
                 // If it's a multi-bite item, replace it regardless of stack size (these are typically unstackable)
                 newInv[inventoryIndex] = { itemId: nextBiteItem, quantity: 1 };
                 if (itemSlot.quantity > 1) {
                     // Edge case handling: if they somehow have a stack of eatable pies, eject the rest?
                     // For now, assume non-stackable or consume 1 from stack and replace current slot with bitten version
                     // This might overwrite the stack if not careful.
                     // Since pies/cakes are unstackable, this is safe.
                 }
            } else if (itemData.stackable && itemSlot.quantity > 1) {
                newInv[inventoryIndex] = { ...itemSlot, quantity: itemSlot.quantity - 1 };
            } else {
                newInv[inventoryIndex] = null;
            }
    
            if (itemData.emptyable && !nextBiteItem) {
                const emptyItemId = itemData.emptyable.emptyItemId;
                const emptyItemData = ITEMS[emptyItemId];
    
                if (emptyItemData.stackable) {
                    const existingStackIndex = newInv.findIndex(i => i && i.itemId === emptyItemId);
                    if (existingStackIndex > -1) {
                        newInv[existingStackIndex]!.quantity += 1;
                    } else {
                        const emptySlotIndex = newInv[inventoryIndex] === null ? inventoryIndex : newInv.findIndex(slot => slot === null);
                        if (emptySlotIndex > -1) {
                            newInv[emptySlotIndex] = { itemId: emptyItemId, quantity: 1 };
                        } else {
                            addLog("You drop the empty container as your inventory is full.");
                        }
                    }
                } else {
                    const emptySlotIndex = newInv[inventoryIndex] === null ? inventoryIndex : newInv.findIndex(slot => slot === null);
                    if (emptySlotIndex > -1) {
                         // If we just ate the last bite, replace it with the container
                        newInv[emptySlotIndex] = { itemId: emptyItemId, quantity: 1 };
                    } else {
                        addLog("You drop the empty container as your inventory is full.");
                    }
                }
            }
            return newInv;
        });

    }, [skills, currentHp, maxHp, setCurrentHp, setInventory, addLog, applyStatModifier, modifyItem, addXp, addBuff, inventory, isStunned, curePoison, currentPrayer, maxPrayer, setCurrentPrayer]);

    const handleCurePoisonFromOrb = useCallback(() => {
        const antiPoisonPotions = ['antipoison_potion', 'super_antipoison'];
        let potionToUse: { itemId: string, index: number } | null = null;

        for (const potionId of antiPoisonPotions) {
            const inventoryIndex = inventory.findIndex(slot => slot?.itemId === potionId);
            if (inventoryIndex !== -1) {
                potionToUse = { itemId: potionId, index: inventoryIndex };
                break;
            }
        }

        if (potionToUse) {
            handleConsume(potionToUse.itemId, potionToUse.index);
        } else {
            addLog("You do not have an anti-poison potion to cure yourself.");
        }
    }, [inventory, handleConsume, addLog]);
    
    const handleBuryBones = useCallback((itemId: string, inventoryIndex: number) => {
        const itemData = ITEMS[itemId];
        if (!itemData?.buryable) return;
        addXp(SkillName.Prayer, itemData.buryable.prayerXp);
        addLog("You bury the bones and say a prayer.");
        setInventory(prev => { 
            const newInv = [...prev];
            newInv[inventoryIndex] = null;
            return newInv;
        });
    }, [addXp, setInventory, addLog]);

    const handleEmptyItem = useCallback((itemId: string, inventoryIndex: number) => {
        const itemData = ITEMS[itemId];
        if (!itemData?.emptyable) return;

        const emptyItemId = itemData.emptyable.emptyItemId;
        const emptyItemData = ITEMS[emptyItemId];
        if (!emptyItemData) return;

        setInventory(prev => {
            const newInv = [...prev];
            if (!newInv[inventoryIndex] || newInv[inventoryIndex]?.itemId !== itemId) return prev;
            
            newInv[inventoryIndex] = null;
            
            if (emptyItemData.stackable) {
                const existingStack = newInv.find(i => i && i.itemId === emptyItemId);
                if (existingStack) {
                    existingStack.quantity += 1;
                } else {
                    newInv[inventoryIndex] = { itemId: emptyItemId, quantity: 1 };
                }
            } else {
                newInv[inventoryIndex] = { itemId: emptyItemId, quantity: 1 };
            }
            return newInv;
        });

    }, [setInventory]);

    const handleDivine = useCallback((itemId: string, inventoryIndex: number) => {
        const itemData = ITEMS[itemId];
        if (!itemData?.divining) return;

        const targetPoiId = itemData.divining.poiId;
        if (currentPoiId === targetPoiId) {
            addLog("The talisman is inert. You are standing at the altar's location.");
            return;
        }

        const currentPoi = POIS[currentPoiId];
        const targetPoi = POIS[targetPoiId];

        if (!currentPoi || !targetPoi) {
            addLog("The talisman seems confused by your location.");
            return;
        }

        if (currentPoi.connections.includes(targetPoiId)) {
            addLog("The talisman buzzes violently. The altar must be in an adjacent area!");
            return;
        }

        const currentRegion = REGIONS[currentPoi.regionId];
        let startX = currentPoi.x;
        let startY = currentPoi.y;

        if (currentRegion && currentRegion.type === 'city' && currentPoi.type === 'internal') {
            startX = currentRegion.x;
            startY = currentRegion.y;
        }

        const dx = targetPoi.x - startX;
        const dy = targetPoi.y - startY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        let direction = '';
        if (angle > -22.5 && angle <= 22.5) direction = 'East';
        else if (angle > 22.5 && angle <= 67.5) direction = 'South-East';
        else if (angle > 67.5 && angle <= 112.5) direction = 'South';
        else if (angle > 112.5 && angle <= 157.5) direction = 'South-West';
        else if (angle > 157.5 || angle <= -157.5) direction = 'West';
        else if (angle > -157.5 && angle <= -112.5) direction = 'North-West';
        else if (angle > -112.5 && angle <= -67.5) direction = 'North';
        else if (angle > -67.5 && angle <= -22.5) direction = 'North-East';
        
        addLog(`The talisman hums and pulls you towards the ${direction}.`);
    }, [currentPoiId, addLog]);

    const handleReadMap = useCallback((item: Item) => {
        if (!item.mappable) return;

        const currentRegionId = POIS[currentPoiId]?.regionId;
        if (currentRegionId === item.mappable.regionId) {
            setActiveDungeonMap({
                regionId: item.mappable.regionId,
                mapTitle: item.mappable.mapTitle,
            });
        } else {
            addLog("You can only read this map while inside the dungeon it depicts.");
        }
    }, [currentPoiId, setActiveDungeonMap, addLog]);

    // FIX: Add function definition for handleUseItemOnActivity
    const handleUseItemOnActivity = useCallback((used: { item: InventorySlot; index: number }, activity: POIActivity) => {
        const { item: usedItem } = used;
        const usedItemData = ITEMS[usedItem.itemId];

        const getItemCount = (itemId: string): number => {
            if (ITEMS[itemId]?.stackable || (inventory.find(slot => slot?.itemId === itemId)?.noted)) {
                return inventory.find(slot => slot?.itemId === itemId)?.quantity ?? 0;
            }
            return inventory.filter(slot => slot?.itemId === itemId).length;
        };

        if (activity.type === 'npc' && activity.name === 'Altar') {
            if (usedItem.itemId === 'holy_paste') {
                if (!hasItems([{ itemId: 'tinderbox', quantity: 1 }])) {
                    addLog("You need a tinderbox to light the offering.");
                    return;
                }
                const pasteCount = getItemCount('holy_paste');
                if (pasteCount === 0) {
                    addLog("You don't have any holy paste.");
                    return;
                }

                const onConfirm = (quantity: number) => {
                    const actualQuantity = Math.min(quantity, pasteCount);
                    if (actualQuantity > 0) {
                        ui.setActiveCraftingAction({
                            recipeId: 'holy_paste',
                            recipeType: 'offering',
                            totalQuantity: Math.ceil(actualQuantity / 5), // Batches of 5
                            completedQuantity: 0,
                            successfulQuantity: 0,
                            startTime: Date.now(),
                            duration: 2400, // 2.4s per batch
                            payload: { totalItems: actualQuantity }
                        });
                    }
                };

                if (pasteCount === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: 'Offer Holy Paste',
                        max: pasteCount,
                        onConfirm
                    });
                }
                return;
            }
            
            const boneMap: Record<string, { consecratedId: string, prayerCost: number, xp: number }> = {
                'bones': { consecratedId: 'consecrated_bones', prayerCost: 1, xp: 3 },
                'big_bones': { consecratedId: 'consecrated_big_bones', prayerCost: 2, xp: 8 },
                'dragon_bones': { consecratedId: 'consecrated_dragon_bones', prayerCost: 5, xp: 50 },
            };
        
            const boneInfo = boneMap[usedItem.itemId];
        
            if (boneInfo) {
                if (currentPrayer < boneInfo.prayerCost) {
                    addLog("You don't have enough prayer points to do that.");
                    return;
                }
                
                const boneCount = getItemCount(usedItem.itemId);
                const maxConsecrate = Math.min(
                    boneCount,
                    Math.floor(currentPrayer / boneInfo.prayerCost)
                );
                
                if (maxConsecrate === 0) {
                    addLog("You don't have enough bones or prayer points.");
                    return;
                }
        
                const onConfirm = (quantity: number) => {
                    if (quantity <= 0) return;
                    const actualQuantity = Math.min(quantity, maxConsecrate);
        
                    if (actualQuantity > 0) {
                         ui.setActiveCraftingAction({
                            recipeId: usedItem.itemId,
                            recipeType: 'consecration',
                            totalQuantity: actualQuantity,
                            completedQuantity: 0,
                            successfulQuantity: 0,
                            startTime: Date.now(),
                            duration: 1800,
                            payload: { prayerCost: boneInfo.prayerCost }
                        });
                    }
                };
                
                if (maxConsecrate === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: `Consecrate ${ITEMS[usedItem.itemId].name}`,
                        max: maxConsecrate,
                        onConfirm
                    });
                }
                return;
            }
        }

        if (activity.type === 'npc' && activity.name === 'Reliquary Grinder') {
            const grindableMap: Record<string, { dustAmount: number, xp: number }> = {
                'consecrated_bones': { dustAmount: 5, xp: 5 },
                'consecrated_big_bones': { dustAmount: 20, xp: 20 },
                'consecrated_dragon_bones': { dustAmount: 100, xp: 100 },
            };
            
            const boneInfo = grindableMap[usedItem.itemId];
            if (boneInfo) {
                const boneCount = getItemCount(usedItem.itemId);
                if (boneCount === 0) {
                    addLog("You don't have any of those to grind.");
                    return;
                }

                const onConfirm = (quantity: number) => {
                    if (quantity <= 0) return;
                    const actualQuantity = Math.min(quantity, boneCount);
                    
                    if (actualQuantity > 0) {
                        ui.setActiveCraftingAction({
                            recipeId: usedItem.itemId,
                            recipeType: 'grinding',
                            totalQuantity: actualQuantity,
                            completedQuantity: 0,
                            successfulQuantity: 0,
                            startTime: Date.now(),
                            duration: 1800,
                        });
                    }
                };

                if (boneCount === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: `Grind ${ITEMS[usedItem.itemId].name}`,
                        max: boneCount,
                        onConfirm
                    });
                }
                return;
            }
        }

        if (activity.type === 'cooking_range' || activity.type === 'bonfire') {
            const recipe = COOKING_RECIPES.find(r => r.ingredients.length === 1 && r.ingredients[0].itemId === usedItem.itemId);
            if (recipe) {
                const maxCookable = inventory.filter(s => s?.itemId === usedItem.itemId).length;
                if (maxCookable > 0) {
                     setMakeXPrompt({
                        title: `Cook ${ITEMS[recipe.itemId].name}`,
                        max: maxCookable,
                        onConfirm: (quantity) => crafting.handleCooking(recipe.itemId, quantity)
                    });
                } else {
                    addLog("You don't have any more to cook.");
                }
                return;
            }
        }
        
        if (activity.type === 'furnace') {
            const smeltRecipe = SMELTING_RECIPES.find(r => r.ingredients.some(i => i.itemId === usedItem.itemId));
            if(smeltRecipe) {
                const maxSmelt = Math.min(
                    ...smeltRecipe.ingredients.map(ing => {
                        const count = inventory.reduce((total, slot) => slot?.itemId === ing.itemId ? total + slot.quantity : total, 0);
                        return Math.floor(count / ing.quantity);
                    })
                );
                 if (maxSmelt > 0) {
                    setMakeXPrompt({
                        title: `Smelt ${ITEMS[smeltRecipe.barType].name}`,
                        max: maxSmelt,
                        onConfirm: (quantity) => crafting.handleSmelting(smeltRecipe.barType as BarType, quantity)
                    });
                 } else {
                    addLog("You don't have the required ingredients.");
                 }
                return;
            }
        }
        
        if (activity.type === 'bonfire' && usedItemData && FIREMAKING_RECIPES.some(r => r.logId === usedItem.itemId)) {
             crafting.handleStokeBonfire(usedItem.itemId, (activity as BonfireActivity).uniqueId);
             return;
        }

        addLog("Nothing interesting happens.");
    }, [inventory, addLog, setMakeXPrompt, crafting, modifyItem, currentPrayer, setCurrentPrayer, addXp, ui, hasItems]);

    const handleUseItemOn = useCallback((used: { item: InventorySlot, index: number }, target: { item: InventorySlot, index: number }) => {
        try {
            const fletchingLevel = skills.find(s => s.name === SkillName.Fletching)?.currentLevel ?? 1;
            const herbloreLevel = skills.find(s => s.name === SkillName.Herblore)?.currentLevel ?? 1;
            const cookingLevel = skills.find(s => s.name === SkillName.Cooking)?.currentLevel ?? 1;
            const usedId = used.item.itemId;
            const targetId = target.item.itemId;
            const usedItemData = ITEMS[usedId];
            const targetItem = ITEMS[targetId];

            const validMeats: Record<string, number> = {
                'cooked_crab_meat': 5,
                'cooked_herring': 5,
                'cooked_boar_meat': 5,
                'scrambled_eggs': 4,
                'cooked_shrimp': 3,
                'cooked_sardine': 3,
                'cooked_chicken': 3,
                'cooked_beef': 3,
                'rat_kebab_cooked': 3,
                'cooked_anchovy': 3,
            };
    
            const isSandwichMaking = (usedId === 'bread' && validMeats[targetId]) || (targetId === 'bread' && validMeats[usedId]);
            if (isSandwichMaking) {
                const meatSlot = usedId === 'bread' ? target : used;
                const meatHeal = validMeats[meatSlot.item.itemId];
    
                modifyItem('bread', -1, true);
                modifyItem(meatSlot.item.itemId, -1, true);
    
                modifyItem('sandwich', 1, false, { bypassAutoBank: true });
    
                const xpGained = meatHeal * 5;
                addXp(SkillName.Cooking, xpGained);
    
                addLog(`You make a sandwich and gain ${xpGained} Cooking XP.`);
                return;
            }
            

            const poisons: Record<string, { id: string; suffix: string; level: number; damage: number }> = {
                'weapon_poison_weak': { id: 'weapon_poison_weak', suffix: '(p)', level: 1, damage: 2 },
                'weapon_poison_strong': { id: 'weapon_poison_strong', suffix: '(p+)', level: 2, damage: 4 },
                'weapon_poison_super': { id: 'weapon_poison_super', suffix: '(p++)', level: 3, damage: 6 }
            };
            const compatibleWeaponTypes = [WeaponType.Dagger, WeaponType.Spear, WeaponType.Arrow, WeaponType.Bolt];

            const poisonInfo = poisons[usedId] || poisons[targetId];
            const weaponSlot = poisons[usedId] ? target : (poisons[targetId] ? used : null);

            const getItemCount = (itemId: string): number => {
                return inventory.reduce((total, slot) => {
                    return slot && slot.itemId === itemId ? total + slot.quantity : total;
                }, 0);
            };

            const isPasteMaking = (usedId === 'anointing_oil' && targetId === 'sacred_dust') || (targetId === 'anointing_oil' && usedId === 'sacred_dust');
            if (isPasteMaking) {
                const oilCount = getItemCount('anointing_oil');
                const dustCount = getItemCount('sacred_dust');
                const maxBatches = Math.min(oilCount, Math.floor(dustCount / 5));
                if (maxBatches < 1) {
                    addLog("You need at least 1 Anointing Oil and 5 Sacred Dust.");
                    return;
                }
            
                const onConfirm = (quantity: number) => {
                    if (isBusy) { addLog("You are busy."); return; }
                    setActiveCraftingAction({
                        recipeId: 'holy_paste',
                        recipeType: 'paste-making',
                        totalQuantity: quantity,
                        completedQuantity: 0,
                        successfulQuantity: 0,
                        startTime: Date.now(),
                        duration: 200
                    });
                };
                
                if (maxBatches === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: 'Create Holy Paste',
                        max: maxBatches,
                        onConfirm
                    });
                }
                return;
            }

            // --- COOKING PREP LOGIC ---

            // 1. Cake Making (Flour + Cake Tin)
            const isCakePrep = (usedId === 'flour' && targetId === 'cake_tin') || (targetId === 'flour' && usedId === 'cake_tin');
            if (isCakePrep) {
                if (!hasItems([{ itemId: 'eggs', quantity: 1 }, { itemId: 'bucket_of_milk', quantity: 1 }])) {
                    addLog("You need an egg and a bucket of milk to make a cake.");
                    return;
                }
                
                // Remove ingredients
                modifyItem('flour', -1, true);
                modifyItem('cake_tin', -1, true);
                modifyItem('eggs', -1, true);
                modifyItem('bucket_of_milk', -1, true); // Removes milk
                modifyItem('bucket', 1, false, { bypassAutoBank: true }); // Gives empty bucket back
                
                modifyItem('uncooked_cake', 1, false, { bypassAutoBank: true });
                addLog("You mix the ingredients into the cake tin.");
                return;
            }

            // 2. Pie Shell (Pie Dough + Pie Dish)
            const isPieShell = (usedId === 'pie_dough' && targetId === 'pie_dish') || (targetId === 'pie_dough' && usedId === 'pie_dish');
            if (isPieShell) {
                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    newInv[used.index] = null;
                    newInv[target.index] = null;
                    return newInv;
                });
                modifyItem('pie_shell', 1, false, { bypassAutoBank: true });
                addLog("You press the dough into the dish to make a pie shell.");
                return;
            }

            // 3. Uncooked Pie Filling (Fruit/Meat/Fish + Pie Shell)
            const pieFillings: Record<string, string> = {
                'red_berries': 'uncooked_berry_pie',
                'apple': 'uncooked_apple_pie',
                'cooked_meat': 'uncooked_meat_pie', // Generic cooked meat if available
                'cooked_beef': 'uncooked_meat_pie',
                'cooked_chicken': 'uncooked_meat_pie',
                'cooked_trout': 'uncooked_fish_pie', // Example fish
                'cooked_salmon': 'uncooked_fish_pie',
                'cooked_tuna': 'uncooked_fish_pie'
            };
            
            // FIX: Check if one of the items is actually a pie shell before proceeding
            const isPieShellPresent = usedId === 'pie_shell' || targetId === 'pie_shell';

            if (isPieShellPresent) {
                const fillingId = usedId === 'pie_shell' ? targetId : usedId;
                const shellSlot = usedId === 'pie_shell' ? used : target;
                const fillingSlot = usedId === 'pie_shell' ? target : used;
    
                if (pieFillings[fillingId]) {
                     const resultPieId = pieFillings[fillingId];
                     
                     setInventory(prevInv => {
                        const newInv = [...prevInv];
                        newInv[shellSlot.index] = null;
                        // Decrease filling stack
                        if (fillingSlot.item.quantity > 1) {
                             newInv[fillingSlot.index] = { ...fillingSlot.item, quantity: fillingSlot.item.quantity - 1 };
                        } else {
                             newInv[fillingSlot.index] = null;
                        }
                        return newInv;
                     });
                     modifyItem(resultPieId, 1, false, { bypassAutoBank: true });
                     addLog(`You fill the pie shell with ${ITEMS[fillingId].name}.`);
                     return;
                }
            }

            // 4. Incomplete Pizza (Pizza Base + Tomato)
            const isPizzaBase = (usedId === 'pizza_base' && targetId === 'tomato') || (targetId === 'pizza_base' && usedId === 'tomato');
            if (isPizzaBase) {
                 setInventory(prevInv => {
                    const newInv = [...prevInv];
                    newInv[used.index] = null;
                    newInv[target.index] = null;
                    return newInv;
                });
                modifyItem('incomplete_pizza', 1, false, { bypassAutoBank: true }); // Assuming this ID exists or falls back
                addLog("You add tomato to the pizza base.");
                return;
            }

            // 5. Uncooked Pizza (Incomplete Pizza + Cheese)
            const isIncompletePizza = (usedId === 'incomplete_pizza' && targetId === 'cheese') || (targetId === 'incomplete_pizza' && usedId === 'cheese');
             if (isIncompletePizza) {
                 setInventory(prevInv => {
                    const newInv = [...prevInv];
                    newInv[used.index] = null;
                    newInv[target.index] = null;
                    return newInv;
                });
                modifyItem('uncooked_pizza', 1, false, { bypassAutoBank: true });
                addLog("You add cheese to the pizza.");
                return;
            }
            
            // 6. Pizza Toppings (Cooked Pizza + Topping)
            const pizzaToppings: Record<string, { result: string, level: number, xp: number }> = {
                'cooked_meat': { result: 'meat_pizza', level: 45, xp: 26 },
                'cooked_beef': { result: 'meat_pizza', level: 45, xp: 26 },
                'cooked_boar': { result: 'meat_pizza', level: 45, xp: 26 },
                'cooked_chicken': { result: 'meat_pizza', level: 45, xp: 26 },
                'cooked_anchovy': { result: 'anchovy_pizza', level: 55, xp: 39 },
                'pineapple_chunks': { result: 'pineapple_pizza', level: 65, xp: 52 }
            };

            const toppingId = usedId === 'plain_pizza' ? targetId : usedId;
            const baseSlot = usedId === 'plain_pizza' ? used : target;
            const toppingSlot = usedId === 'plain_pizza' ? target : used;
            
            if ((usedId === 'plain_pizza' || targetId === 'plain_pizza') && pizzaToppings[toppingId]) {
                const recipe = pizzaToppings[toppingId];
                if (cookingLevel < recipe.level) {
                    addLog(`You need a Cooking level of ${recipe.level} to add this topping.`);
                    return;
                }
                
                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    newInv[baseSlot.index] = null;
                    if (toppingSlot.item.quantity > 1) {
                         newInv[toppingSlot.index] = { ...toppingSlot.item, quantity: toppingSlot.item.quantity - 1 };
                    } else {
                         newInv[toppingSlot.index] = null;
                    }
                    return newInv;
                 });
                 
                 modifyItem(recipe.result, 1, false, { bypassAutoBank: true });
                 addXp(SkillName.Cooking, recipe.xp);
                 addLog(`You add ${ITEMS[toppingId].name} to the pizza.`);
                 return;
            }

            // --- END COOKING PREP ---


            if (poisonInfo && weaponSlot) {
                const weaponData = ITEMS[weaponSlot.item.itemId];
                if (weaponData?.equipment?.weaponType && compatibleWeaponTypes.includes(weaponData.equipment.weaponType)) {
                    
                    const baseItemName = weaponData.name;
                    const currentStats = { ...weaponData.equipment, ...weaponSlot.item.statsOverride };
                    const currentPoisonLevel = currentStats.poisoned ? (currentStats.poisoned.damage === 6 ? 3 : currentStats.poisoned.damage === 4 ? 2 : 1) : 0;
            
                    if (poisonInfo.level <= currentPoisonLevel) {
                        addLog("This is already coated with an equal or stronger poison.");
                        return;
                    }
            
                    const newNameOverride = `${baseItemName} ${poisonInfo.suffix}`;
                    const newStatsOverride = {
                        ...weaponSlot.item.statsOverride,
                        poisoned: {
                            chance: 0.25,
                            damage: poisonInfo.damage
                        }
                    };
            
                    const poisonSlot = poisons[usedId] ? used : target;
                    const isAmmo = weaponData.equipment.weaponType === WeaponType.Arrow || weaponData.equipment.weaponType === WeaponType.Bolt;
            
                    if (isAmmo) {
                        if (weaponSlot.item.quantity < 15) {
                            addLog("You need at least 15 of that ammo to poison them.");
                            return;
                        }
                        modifyItem(weaponSlot.item.itemId, -15, true, { noted: weaponSlot.item.noted, nameOverride: weaponSlot.item.nameOverride, statsOverride: weaponSlot.item.statsOverride });
            
                        setInventory(prev => {
                            const newInv = [...prev];
                            const existingPoisonedStackIndex = newInv.findIndex(slot => 
                                slot &&
                                slot.itemId === weaponSlot.item.itemId &&
                                slot.nameOverride === newNameOverride &&
                                !!slot.noted === !!weaponSlot.item.noted
                            );

                            if (existingPoisonedStackIndex > -1) {
                                newInv[existingPoisonedStackIndex]!.quantity += 15;
                                addLog(`You add 15 more poisoned ${weaponData.name}s to the stack.`);
                                return newInv;
                            }
                            
                            const emptySlotIndex = newInv.findIndex(slot => slot === null);
                            if (emptySlotIndex === -1) {
                                addLog("You don't have enough inventory space to create a new stack of poisoned ammo.");
                                modifyItem(weaponSlot.item.itemId, 15, true, { noted: weaponSlot.item.noted });
                                return prev;
                            }
                            newInv[emptySlotIndex] = {
                                itemId: weaponSlot.item.itemId,
                                quantity: 15,
                                noted: weaponSlot.item.noted,
                                nameOverride: newNameOverride,
                                statsOverride: newStatsOverride
                            };
                            addLog(`You poison 15 ${weaponData.name}s.`);
                            return newInv;
                        });
                    } else {
                        setInventory(prev => {
                            const newInv = [...prev];
                            const weaponToUpdate = newInv[weaponSlot.index];
                            if (weaponToUpdate) {
                                newInv[weaponSlot.index] = {
                                    ...weaponToUpdate,
                                    nameOverride: newNameOverride,
                                    statsOverride: newStatsOverride
                                };
                                addLog(`You apply a coat of poison to your ${baseItemName}.`);
                            }
                            return newInv;
                        });
                    }
                    
                    modifyItem('vial', 1, false, { bypassAutoBank: true });
                    
                    return;
                }
            }

            const isLeatherworking = (usedId === 'needle' && (targetId === 'leather' || targetId === 'boar_leather' || targetId === 'wolf_leather' || targetId === 'bear_leather' || targetId.endsWith('_hide_leather'))) || 
                                     (targetId === 'needle' && (usedId === 'leather' || usedId === 'boar_leather' || usedId === 'wolf_leather' || usedId === 'bear_leather' || usedId.endsWith('_hide_leather')));

            if (isLeatherworking) {
                openCraftingView({ type: 'leatherworking' });
                return;
            }

            if ((usedId === 'knife' && FLETCHING_RECIPES.carving[targetId]) || (targetId === 'knife' && FLETCHING_RECIPES.carving[usedId]) || (usedId === 'knife' && FLETCHING_RECIPES.stocks.some(r => r.logId === targetId)) || (targetId === 'knife' && FLETCHING_RECIPES.stocks.some(r => r.logId === usedId))) {
                const logId = usedId === 'knife' ? targetId : usedId;
                openCraftingView({ type: 'fletching', logId: logId });
                return;
            }

            const isGemCutting = (usedId === 'chisel' && GEM_CUTTING_RECIPES.some(r => r.uncutId === targetId)) || (targetId === 'chisel' && GEM_CUTTING_RECIPES.some(r => r.uncutId === usedId));
            if (isGemCutting) {
                openCraftingView({ type: 'gem_cutting' });
                return;
            }
            
            const isDoughMaking = (usedId === 'bucket_of_water' && targetId === 'flour') || (targetId === 'bucket_of_water' && usedId === 'flour');
            if (isDoughMaking) {
                props.openCraftingView({ type: 'dough_making' });
                return;
            }

            const isFiremaking = (usedId === 'tinderbox' && FIREMAKING_RECIPES.some(r => r.logId === targetId)) ||
                                 (targetId === 'tinderbox' && FIREMAKING_RECIPES.some(r => r.logId === usedId));
            if (isFiremaking) {
                const logId = usedId === 'tinderbox' ? targetId : usedId;
                const recipe = FIREMAKING_RECIPES.find(r => r.logId === logId);
                if (!recipe) return;

                const firemakingLevel = skills.find(s => s.name === SkillName.Firemaking)?.currentLevel ?? 1;
                if (firemakingLevel < recipe.level) {
                    addLog(`You need a Firemaking level of ${recipe.level} to light these logs.`);
                    return;
                }
                if (!hasItems([{ itemId: logId, quantity: 1 }])) {
                    addLog(`You need some ${ITEMS[logId].name} to light a fire.`);
                    return;
                }

                addLog(`You attempt to light the ${ITEMS[logId].name}...`);
                setActiveCraftingAction({
                    recipeId: logId,
                    recipeType: 'firemaking-light',
                    totalQuantity: 1,
                    completedQuantity: 0,
                    successfulQuantity: 0,
                    startTime: Date.now(),
                    duration: 2400,
                });
                return;
            }
            
            const isTiaraCrafting = (usedId === 'silver_tiara' && targetItem.divining) || (targetId === 'silver_tiara' && usedItemData.divining);
            if (isTiaraCrafting) {
                const talisman = usedItemData.divining ? usedItemData : targetItem;
                const altarPoiId = talisman.divining!.poiId;
                const altarPoi = POIS[altarPoiId];
                const altarActivity = altarPoi?.activities.find(a => a.type === 'runecrafting_altar') as Extract<POIActivity, { type: 'runecrafting_altar' }> | undefined;

                if (currentPoiId !== altarPoiId || !altarActivity) {
                    addLog("You can only infuse a tiara at its corresponding runecrafting altar.");
                    return;
                }
                
                const runeId = altarActivity.runeId;
                const tiaraItem = Object.values(ITEMS).find(i => i.equipment?.slot === EquipmentSlot.Head && i.equipment.runeType === runeId);

                if (!tiaraItem) {
                    addLog("Something went wrong, could not find the right tiara to create.");
                    return;
                }
                
                if (hasItems([{ itemId: 'silver_tiara', quantity: 1 }, { itemId: talisman.id, quantity: 1 }])) {
                    modifyItem('silver_tiara', -1, true);
                    modifyItem(talisman.id, -1, true);
                    modifyItem(tiaraItem.id, 1, false, { bypassAutoBank: true });
                    addXp(SkillName.Runecrafting, 50);
                    addLog(`You infuse the silver tiara with the power of the altar, creating a ${tiaraItem.name}.`);
                }
                return;
            }
            
            if (used.item.itemId === target.item.itemId && usedItemData.doseable) {
                const maxDoses = usedItemData.maxDoses ?? 4;
                const usedDoses = used.item.doses ?? usedItemData.initialDoses ?? 1;
                const targetDoses = target.item.doses ?? usedItemData.initialDoses ?? 1;

                if (targetDoses >= maxDoses) {
                    addLog("This potion is already full.");
                    return;
                }
                
                const totalDoses = usedDoses + targetDoses;
                const newTargetDoses = Math.min(maxDoses, totalDoses);
                const newUsedDoses = totalDoses - newTargetDoses;

                setInventory(prev => {
                    const newInv = [...prev];
                    newInv[target.index] = { ...target.item, doses: newTargetDoses };
                    if (newUsedDoses > 0) {
                        newInv[used.index] = { ...used.item, doses: newUsedDoses };
                    } else {
                        newInv[used.index] = { itemId: 'vial', quantity: 1 };
                    }
                    return newInv;
                });
                addLog(`You decant the potions.`);
                return;
            }

            const isKeyCombination = (usedId === 'strange_key_loop' && targetId === 'strange_key_tooth') || (targetId === 'strange_key_loop' && usedId === 'strange_key_tooth');
            if (isKeyCombination) {
                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    newInv[used.index] = null;
                    newInv[target.index] = null;
                    return newInv;
                });
                modifyItem('strange_key', 1, false, { bypassAutoBank: true });
                addLog("You combine the two key halves to create a strange key.");
                return;
            }

            const isHammeringCore = (usedId === 'hammer' && targetId === 'golem_core') || (targetId === 'hammer' && usedId === 'golem_core');
            if (isHammeringCore) {
                const coreIndex = usedId === 'golem_core' ? used.index : target.index;
                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    newInv[coreIndex] = null;
                    return newInv;
                });
                modifyItem('golem_core_shard', 10, true, { bypassAutoBank: true });
                addXp(SkillName.Crafting, 25);
                addLog("You carefully smash the golem core, breaking it into 10 smaller shards.");
                return;
            }

            const crushableMap: Record<string, { dust: string }> = {
                'glimmerhorn_antler': { dust: 'glimmerhorn_dust' },
                'serpent_scale': { dust: 'serpent_scale_dust' },
                'unicorn_horn': { dust: 'unicorn_horn_dust'},
                'wyrmscale': { dust: 'wyrmscale_dust' }
            };

            const crushTargetId = (usedId === 'pestle_and_mortar') ? targetId : ((targetId === 'pestle_and_mortar') ? usedId : null);
            if (crushTargetId && crushableMap[crushTargetId]) {
                const recipe = crushableMap[crushTargetId];
                const maxCrushable = getItemCount(crushTargetId);
                if (maxCrushable < 1) {
                    addLog(`You don't have any ${ITEMS[crushTargetId].name} to grind.`);
                    return;
                }
                const onConfirm = (quantity: number) => {
                    if (quantity > 0) {
                        modifyItem(crushTargetId, -quantity, true);
                        modifyItem(recipe.dust, quantity, true, { bypassAutoBank: true });
                        addLog(`You grind ${quantity}x ${ITEMS[crushTargetId].name} into dust.`);
                    }
                };
                if (maxCrushable === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: `Grind ${ITEMS[crushTargetId].name}`,
                        max: maxCrushable,
                        onConfirm
                    });
                }
                return;
            }

            const unfRecipe = HERBLORE_RECIPES.unfinished.find(r => (r.cleanHerbId === usedId && targetId === 'vial_of_water') || (r.cleanHerbId === targetId && usedId === 'vial_of_water'));
            if (unfRecipe) {
                if (herbloreLevel < unfRecipe.level) {
                    addLog(`You need a Herblore level of ${unfRecipe.level} to make this.`);
                    return;
                }
                const cleanHerbCount = getItemCount(unfRecipe.cleanHerbId);
                const vialOfWaterCount = getItemCount('vial_of_water');
                const maxCreatable = Math.min(cleanHerbCount, vialOfWaterCount);
                if (maxCreatable < 1) {
                    addLog("You don't have enough ingredients.");
                    return;
                }
                const onConfirm = (quantity: number) => {
                    if (activeCraftingAction) {
                        addLog("You are already busy crafting something else.");
                        return;
                    }
                    if (quantity > 0) {
                        setActiveCraftingAction({
                            recipeId: unfRecipe.unfinishedPotionId,
                            recipeType: 'herblore-unfinished',
                            totalQuantity: quantity, completedQuantity: 0, successfulQuantity: 0,
                            startTime: Date.now(), duration: 800,
                            payload: { cleanHerbId: unfRecipe.cleanHerbId }
                        });
                    }
                };
                if (maxCreatable === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: `Create ${ITEMS[unfRecipe.unfinishedPotionId].name}`,
                        max: maxCreatable,
                        onConfirm
                    });
                }
                return;
            }

            const finRecipe = HERBLORE_RECIPES.finished.find(r => (r.unfinishedPotionId === usedId && r.secondaryId === targetId) || (r.unfinishedPotionId === targetId && r.secondaryId === usedId));
            if (finRecipe) {
                if (finRecipe.finishedPotionId === 'anointing_oil') {
                    const saintsFirstStepQuest = playerQuests.find(q => q.questId === 'the_saints_first_step');
                    if (!saintsFirstStepQuest || (saintsFirstStepQuest.currentStage < 6 && !saintsFirstStepQuest.isComplete)) {
                        addLog("You haven't learned how to make this yet.");
                        return;
                    }
                }
                if (herbloreLevel < finRecipe.level) {
                    addLog(`You need a Herblore level of ${finRecipe.level} to make this.`);
                    return;
                }
                const unfPotionCount = inventory.reduce((count, slot) => slot?.itemId === finRecipe.unfinishedPotionId ? count + (slot.doses ?? 1) : count, 0);
                const secondaryCount = getItemCount(finRecipe.secondaryId);
                const maxCreatable = Math.min(unfPotionCount, secondaryCount);
                if (maxCreatable < 1) {
                    addLog("You don't have enough ingredients.");
                    return;
                }
                const onConfirm = (quantity: number) => {
                    if (activeCraftingAction) {
                        addLog("You are already busy crafting something else.");
                        return;
                    }
                    if (quantity > 0) {
                        setActiveCraftingAction({
                            recipeId: finRecipe.finishedPotionId,
                            recipeType: 'herblore-finished',
                            totalQuantity: quantity, completedQuantity: 0, successfulQuantity: 0,
                            startTime: Date.now(), duration: 800,
                            payload: { unfinishedPotionId: finRecipe.unfinishedPotionId, secondaryId: finRecipe.secondaryId }
                        });
                    }
                };
                if (maxCreatable === 1) {
                    onConfirm(1);
                } else {
                    setMakeXPrompt({
                        title: `Create ${ITEMS[finRecipe.finishedPotionId].name}`,
                        max: maxCreatable,
                        onConfirm
                    });
                }
                return;
            }

            const isCleaningPouch = (usedId === 'pouch_cleanser' && targetId === 'grimy_coin_pouch') || (targetId === 'pouch_cleanser' && usedId === 'grimy_coin_pouch');
            if (isCleaningPouch) {
                if (herbloreLevel < 10) {
                    addLog("You need a Herblore level of 10 to use this cleanser properly.");
                    return;
                }
                if (hasItems([{ itemId: 'pouch_cleanser', quantity: 1 }, { itemId: 'grimy_coin_pouch', quantity: 1 }])) {
                    modifyItem('pouch_cleanser', -1, true);
                    modifyItem('grimy_coin_pouch', -1, true);
                    modifyItem('clean_coin_pouch', 1, false, { bypassAutoBank: true });
                    addXp(SkillName.Herblore, 15);
                    addLog("You use the cleanser to scrub the grime off the pouch.");
                }
                return;
            }

            const isStringing = (usedId.endsWith('_amulet_u') && targetId === 'ball_of_wool') || (targetId.endsWith('_amulet_u') && usedId === 'ball_of_wool');
            if (isStringing) {
                const unstrungId = usedId.endsWith('_amulet_u') ? usedId : targetId;
                const strungId = unstrungId.replace('_u', '');
                if (ITEMS[strungId]) {
                    setInventory(prevInv => {
                        const newInv = [...prevInv];
                        newInv[used.index] = null;
                        newInv[target.index] = null;
                        return newInv;
                    });
                    modifyItem(strungId, 1, false, { bypassAutoBank: true });
                    addXp(SkillName.Crafting, 5);
                    addLog(`You string the ${ITEMS[unstrungId].name}.`);
                }
                return;
            }

            const isRatKebab = (usedId === 'arrow_shaft' && targetId === 'rat_tail') || (targetId === 'arrow_shaft' && usedId === 'rat_tail');
            if (isRatKebab) {
                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    const ratTailIndex = usedId === 'rat_tail' ? used.index : target.index;
                    const shaftIndex = usedId === 'arrow_shaft' ? used.index : target.index;

                    newInv[ratTailIndex] = null;

                    const shaftSlot = newInv[shaftIndex];
                    if (shaftSlot && shaftSlot.itemId === 'arrow_shaft') {
                        shaftSlot.quantity -= 1;
                        if (shaftSlot.quantity <= 0) {
                            newInv[shaftIndex] = null;
                        }
                    }
                    return newInv;
                });

                modifyItem('rat_kebab_uncooked', 1, false, { bypassAutoBank: true });
                addLog("You skewer the rat tail with the arrow shaft, creating an uncooked kebab.");
                return;
            }

            const startTimedAction = (recipeId: string, recipeType: ActiveCraftingAction['recipeType'], totalQuantity: number, duration: number, payload?: ActiveCraftingAction['payload']) => {
                setActiveCraftingAction({ recipeId, recipeType, totalQuantity, completedQuantity: 0, successfulQuantity: 0, startTime: Date.now(), duration, payload });
            };
            
            const stringRecipe = FLETCHING_RECIPES.stringing.find(r => 
                (r.unstrungId === usedId && (ITEMS[targetId]?.id === 'bow_string' || ITEMS[targetId]?.id === 'crossbow_string')) ||
                (r.unstrungId === targetId && (ITEMS[usedId]?.id === 'bow_string' || ITEMS[usedId]?.id === 'crossbow_string'))
            );
            if (stringRecipe) {
                const stringType = stringRecipe.unstrungId.includes('crossbow') ? 'crossbow_string' : 'bow_string';
                if ((usedId !== stringType && targetId !== stringType)) {
                    addLog("Nothing interesting happens."); return;
                }
                if (fletchingLevel < stringRecipe.level) { addLog(`You need a Fletching level of ${stringRecipe.level} to string this.`); return; }
                
                const unstrungBows = inventory.reduce((acc, slot) => (slot && slot.itemId === stringRecipe.unstrungId) ? acc + 1 : acc, 0);
                const bowStrings = inventory.reduce((acc, slot) => (slot && slot.itemId === stringType) ? acc + 1 : acc, 0);
                const quantity = Math.min(unstrungBows, bowStrings);
                if (quantity < 1) { addLog(`You need an unstrung bow and a ${ITEMS[stringType].name}.`); return; }

                startTimedAction(stringRecipe.strungId, 'fletching-string', quantity, 1200, { unstrungId: stringRecipe.unstrungId });
                return;
            }

            if ((usedId === 'arrow_shaft' && targetId === 'feathers') || (targetId === 'arrow_shaft' && usedId === 'feathers')) {
                const recipe = FLETCHING_RECIPES.headless;
                if (fletchingLevel < recipe.level) { addLog(`You need a Fletching level of ${recipe.level} to make these.`); return; }
                const shaftQty = inventory.find(i => i && i.itemId === 'arrow_shaft')?.quantity ?? 0;
                const featherQty = inventory.find(i => i && i.itemId === 'feathers')?.quantity ?? 0;
                const quantity = Math.floor(Math.min(shaftQty, featherQty) / 15);
                if (quantity < 1) { addLog("You need at least 15 shafts and 15 feathers."); return; }
                startTimedAction('headless_arrow', 'fletching-headless', quantity, 600);
                return;
            }

            const tipRecipe = FLETCHING_RECIPES.tipping.find(r => (r.tipId === usedId && targetId === 'headless_arrow') || (r.tipId === targetId && usedId === 'headless_arrow'));
            if (tipRecipe) {
                 if (fletchingLevel < tipRecipe.level) { addLog(`You need a Fletching level of ${tipRecipe.level} to attach these.`); return; }
                 const tipQty = inventory.find(i => i && i.itemId === tipRecipe.tipId)?.quantity ?? 0;
                 const headlessQty = inventory.find(i => i && i.itemId === 'headless_arrow')?.quantity ?? 0;
                 const quantity = Math.floor(Math.min(tipQty, headlessQty) / 15);
                 if (quantity < 1) { addLog("You need at least 15 tips and 15 headless arrows."); return; }
                 startTimedAction(tipRecipe.arrowId, 'fletching-tip', quantity, 600, { tipId: tipRecipe.tipId });
                 return;
            }

            const assemblyRecipe = FLETCHING_RECIPES.assembly.find(r => (r.limbsId === usedId && r.stockId === targetId) || (r.limbsId === targetId && r.stockId === usedId));
            if (assemblyRecipe) {
                if (fletchingLevel < assemblyRecipe.level) { addLog(`You need a Fletching level of ${assemblyRecipe.level} to do this.`); return; }
                startTimedAction(assemblyRecipe.unstrungId, 'fletching-assembly', 1, 1800);
                return;
            }

            const featheringRecipe = FLETCHING_RECIPES.feathering.find(r => (r.unfBoltsId === usedId && targetId === 'feathers') || (r.unfBoltsId === targetId && usedId === 'feathers'));
            if (featheringRecipe) {
                if (fletchingLevel < featheringRecipe.level) { addLog(`You need a Fletching level of ${featheringRecipe.level} to do this.`); return; }
                const unfBoltsQty = inventory.find(i => i && i.itemId === featheringRecipe.unfBoltsId)?.quantity ?? 0;
                const feathersQty = inventory.find(i => i && i.itemId === 'feathers')?.quantity ?? 0;
                const maxSets = Math.min(Math.floor(unfBoltsQty / 10), Math.floor(feathersQty / 10));
                if (maxSets < 1) { addLog("You need at least 10 unfinished bolts and 10 feathers."); return; }
                setMakeXPrompt({
                    title: `Fletch ${ITEMS[featheringRecipe.boltsId].name}`,
                    max: maxSets,
                    onConfirm: (quantity) => startTimedAction(featheringRecipe.boltsId, 'fletching-feather', quantity, 600, { unfBoltsId: featheringRecipe.unfBoltsId })
                });
                return;
            }

            addLog("Nothing interesting happens.");
        } finally {
            setItemToUse(null);
        }
    }, [skills, inventory, addLog, setActiveCraftingAction, hasItems, modifyItem, addXp, setMakeXPrompt, activeCraftingAction, currentPoiId, openCraftingView, setInventory, setItemToUse, itemToUse, playerQuests, startQuest, equipment, onResponse, handleDialogueCheck, ui, crafting, isBusy, isStunned]);
    
    const handleExamine = useCallback((item: Item) => {
        addLog(`${item.description}`);
    }, [addLog]);

    return {
        handleConsume,
        handleBuryBones,
        handleEmptyItem,
        handleUseItemOn,
        // FIX: Add handleUseItemOnActivity to the returned object
        handleUseItemOnActivity,
        handleDivine,
        handleExamine,
        handleReadMap,
        handleCurePoisonFromOrb,
        handleTeleport,
    };
}
