import React, { useCallback } from 'react';
// FIX: Import ActiveBuff to use its specific type instead of 'any'.
import { InventorySlot, PlayerSkill, SkillName, ActiveCraftingAction, Item, CraftingContext, POIActivity, EquipmentSlot, PlayerQuestState, Spell, Equipment, ActiveBuff, DialogueResponse, DialogueCheckRequirement } from '../types';
import { ITEMS, FLETCHING_RECIPES, HERBLORE_RECIPES, HERBS, INVENTORY_CAPACITY, rollOnLootTable, LootRollResult, FIREMAKING_RECIPES, QUESTS } from '../constants';
import { POIS } from '../data/pois';
import { MakeXPrompt, useUIState } from './useUIState';

interface UseItemActionsProps {
    addLog: (message: string) => void;
    currentHp: number;
    maxHp: number;
    setCurrentHp: React.Dispatch<React.SetStateAction<number>>;
    applyStatModifier: (skill: SkillName, value: number, duration: number, baseLevelOnConsumption: number) => void;
    setInventory: React.Dispatch<React.SetStateAction<(InventorySlot | null)[]>>;
    skills: (PlayerSkill & { currentLevel: number; })[];
    inventory: (InventorySlot | null)[];
    activeCraftingAction: ActiveCraftingAction | null;
    setActiveCraftingAction: (action: ActiveCraftingAction | null) => void;
    hasItems: (items: { itemId: string, quantity: number }[]) => boolean;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, doses?: number, options?: { noted?: boolean, bypassAutoBank?: boolean }) => void;
    addXp: (skill: SkillName, amount: number) => void;
    openCraftingView: (context: CraftingContext) => void;
    setItemToUse: (item: { item: InventorySlot, index: number } | null) => void;
    // FIX: Corrected the type for addBuff to use the specific ActiveBuff type and 'durationRemaining' for consistency.
    addBuff: (buff: Omit<ActiveBuff, 'id' | 'durationRemaining'>) => void;
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
}

export const useItemActions = (props: UseItemActionsProps) => {
    const { addLog, currentHp, maxHp, setCurrentHp, applyStatModifier, setInventory, skills, inventory, activeCraftingAction, setActiveCraftingAction, hasItems, modifyItem, addXp, openCraftingView, setItemToUse, addBuff, setMakeXPrompt, startQuest, currentPoiId, playerQuests, isStunned, setActiveDungeonMap, confirmValuableDrops, valuableDropThreshold, ui, equipment, onResponse, handleDialogueCheck } = props;
    const { setActiveDialogue } = ui;

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
            
            // Remove the specific grimy herb from its slot
            setInventory(prevInv => {
                const newInv = [...prevInv];
                newInv[inventoryIndex] = null;
                return newInv;
            });

            // Add the clean one, letting modifyItem handle stacking/placement
            modifyItem(itemData.cleanable.cleanItemId, 1, true, undefined, { bypassAutoBank: true });
            addXp(SkillName.Herblore, itemData.cleanable.xp);
            return;
        }

        if (!itemData.consumable) return;

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
                    // All gems from the chest are noted.
                    modifyItem(gemId, 1, true, undefined, { bypassAutoBank: true, noted: true });
                }
            }
        
            for (let i = 0; i < 3; i++) {
                const herb = rollOnLootTable('herb_table');
                if (herb) {
                    const herbId = typeof herb === 'string' ? herb : herb.itemId;
                    // All herbs from the chest are noted.
                    modifyItem(herbId, 1, true, undefined, { bypassAutoBank: true, noted: true });
                }
            }
        
            const mithrilEquipment = Object.values(ITEMS).filter(
                item => item.material === 'mithril' && item.equipment
            );
            if (mithrilEquipment.length > 0) {
                const randomMithrilItem = mithrilEquipment[Math.floor(Math.random() * mithrilEquipment.length)];
                if (randomMithrilItem.id === 'mithril_arrow') {
                    modifyItem(randomMithrilItem.id, 100, true, undefined, { bypassAutoBank: true });
                } else {
                    modifyItem(randomMithrilItem.id, 1, true, undefined, { bypassAutoBank: true });
                }
            }
        
            if (Math.random() < 0.01) {
                modifyItem('runic_scimitar', 1, true, undefined, { bypassAutoBank: true });
                addLog("Incredibly lucky! You found a Runic Scimitar inside!");
            }
        
            return;
        }

        const hasNonHealingEffect = !!(itemData.consumable.statModifiers || itemData.consumable.buffs || itemData.consumable.givesCoins);

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
                    applyStatModifier(modifier.skill, boostValue, modifier.duration, baseLevel);
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
                } else {
                    newInv[inventoryIndex] = { itemId: 'vial', quantity: 1 };
                }
                return newInv;
            });
            return;
        }
        
        setInventory(prev => {
            const newInv = [...prev];
            const itemSlot = newInv[inventoryIndex];
    
            if (!itemSlot) return prev;
    
            if (itemData.stackable && itemSlot.quantity > 1) {
                newInv[inventoryIndex] = { ...itemSlot, quantity: itemSlot.quantity - 1 };
            } else {
                newInv[inventoryIndex] = null;
            }
    
            if (itemData.emptyable) {
                const emptyItemId = itemData.emptyable.emptyItemId;
                const emptyItemData = ITEMS[emptyItemId];
    
                if (emptyItemData.stackable) {
                    const existingStackIndex = newInv.findIndex(i => i && i.itemId === emptyItemId);
                    if (existingStackIndex > -1) {
                        newInv[existingStackIndex]!.quantity += 1;
                    } else {
                        const emptySlotIndex = newInv[inventoryIndex] === null ? inventoryIndex : newInv.findIndex(slot => slot === null);
                        if (emptySlotIndex > -1) {
                            newInv[inventoryIndex] = { itemId: emptyItemId, quantity: 1 };
                        } else {
                            addLog("You drop the empty container as your inventory is full.");
                        }
                    }
                } else {
                    const emptySlotIndex = newInv[inventoryIndex] === null ? inventoryIndex : newInv.findIndex(slot => slot === null);
                    if (emptySlotIndex > -1) {
                        newInv[inventoryIndex] = { itemId: emptyItemId, quantity: 1 };
                    } else {
                        addLog("You drop the empty container as your inventory is full.");
                    }
                }
            }
            return newInv;
        });

    }, [skills, currentHp, maxHp, setCurrentHp, setInventory, addLog, applyStatModifier, modifyItem, addXp, addBuff, inventory, isStunned]);
    
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

        const dx = targetPoi.x - currentPoi.x;
        const dy = targetPoi.y - currentPoi.y;
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

    const handleItemCombination = useCallback((used: { item: InventorySlot, index: number }, target: { item: InventorySlot, index: number }) => {
        const fletchingLevel = skills.find(s => s.name === SkillName.Fletching)?.currentLevel ?? 1;
        const herbloreLevel = skills.find(s => s.name === SkillName.Herblore)?.currentLevel ?? 1;
        const usedId = used.item.itemId;
        const targetId = target.item.itemId;
        const usedItemData = ITEMS[usedId];
        const targetItem = ITEMS[targetId];

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
            if (activeCraftingAction) {
                addLog("You are already busy.");
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
                duration: 1800,
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
                modifyItem(tiaraItem.id, 1, true, undefined, { bypassAutoBank: true });
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

        const getItemCount = (itemId: string): number => {
            return inventory.reduce((total, slot) => {
                return slot && slot.itemId === itemId ? total + slot.quantity : total;
            }, 0);
        };

        const isKeyCombination = (usedId === 'strange_key_loop' && targetId === 'strange_key_tooth') || (targetId === 'strange_key_loop' && usedId === 'strange_key_tooth');
        if (isKeyCombination) {
            setInventory(prevInv => {
                const newInv = [...prevInv];
                newInv[used.index] = null;
                newInv[target.index] = null;
                return newInv;
            });
            modifyItem('strange_key', 1, false, undefined, { bypassAutoBank: true });
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
            modifyItem('golem_core_shard', 10, true, undefined, { bypassAutoBank: true });
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
                    modifyItem(recipe.dust, quantity, true, undefined, { bypassAutoBank: true });
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
                modifyItem('clean_coin_pouch', 1, false, undefined, { bypassAutoBank: true });
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
                modifyItem(strungId, 1, false, undefined, { bypassAutoBank: true });
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

            modifyItem('rat_kebab_uncooked', 1, false, undefined, { bypassAutoBank: true });
            addLog("You skewer the rat tail with the arrow shaft, creating an uncooked kebab.");
            return;
        }

        const startTimedAction = (recipeId: string, recipeType: ActiveCraftingAction['recipeType'], totalQuantity: number, duration: number, payload?: ActiveCraftingAction['payload']) => {
            setActiveCraftingAction({ recipeId, recipeType, totalQuantity, completedQuantity: 0, successfulQuantity: 0, startTime: Date.now(), duration, payload });
        };
        
        const stringRecipe = FLETCHING_RECIPES.stringing.find(r => (usedId === 'bow_string' && r.unstrungId === targetId) || (targetId === 'bow_string' && r.unstrungId === usedId));
        if (stringRecipe) {
            if (fletchingLevel < stringRecipe.level) { addLog(`You need a Fletching level of ${stringRecipe.level} to string this bow.`); return; }
            const unstrungBows = inventory.filter(i => i && i.itemId === stringRecipe.unstrungId).length;
            const bowStrings = inventory.filter(i => i && i.itemId === 'bow_string').length;
            const quantity = Math.min(unstrungBows, bowStrings);
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

        addLog("Nothing interesting happens.");
    }, [skills, inventory, addLog, setActiveCraftingAction, hasItems, modifyItem, addXp, setMakeXPrompt, activeCraftingAction, currentPoiId]);

    const handleUseItemOn = useCallback((used: { item: InventorySlot, index: number }, target: { item: InventorySlot, index: number }) => {
        const usedItem = ITEMS[used.item.itemId];
        const targetItem = ITEMS[target.item.itemId];
    
        const isLog = (item: Item) => item.id.endsWith('_logs') || item.id === 'logs';
        const isChisel = (item: Item) => item.id === 'chisel';
        const isUncutGem = (item: Item) => item.id.startsWith('uncut_');
        const isNeedle = (item: Item) => item.id === 'needle';
        const isLeather = (item: Item) => ['leather', 'boar_leather', 'wolf_leather', 'bear_leather'].includes(item.id);
        const isFlour = (item: Item) => item.id === 'flour';
        const isWater = (item: Item) => item.id === 'bucket_of_water';

        if ((isChisel(usedItem) && isUncutGem(targetItem)) || (isUncutGem(usedItem) && isChisel(targetItem))) {
            openCraftingView({ type: 'gem_cutting' });
        } else if ((isNeedle(usedItem) && isLeather(targetItem)) || (isLeather(usedItem) && isNeedle(targetItem))) {
            openCraftingView({ type: 'leatherworking' });
        } else if (usedItem.id === 'knife' && isLog(targetItem)) {
            openCraftingView({ type: 'fletching', logId: targetItem.id });
        } else if (targetItem.id === 'knife' && isLog(usedItem)) {
            openCraftingView({ type: 'fletching', logId: usedItem.id });
        } else if ((isWater(usedItem) && isFlour(targetItem)) || (isFlour(usedItem) && isWater(targetItem))) {
            openCraftingView({ type: 'dough_making' });
        } else {
            handleItemCombination(used, target);
        }
    
        setItemToUse(null);
    }, [openCraftingView, handleItemCombination, setItemToUse]);

    const handleUseItemOnActivity = useCallback((used: { item: InventorySlot, index: number }, activity: POIActivity) => {
        if (activity.type !== 'npc') {
            addLog("Nothing interesting happens.");
            return;
        }

        const usedItemId = used.item.itemId;
        const targetNpcName = activity.name;

        // Check for quest triggers
        for (const quest of Object.values(QUESTS)) {
            const playerQuest = playerQuests.find(q => q.questId === quest.id);
            
            // Check if the quest can be started with an item
            if (!playerQuest && quest.triggerItem && quest.triggerItem.itemId === usedItemId && quest.triggerItem.npcName === targetNpcName) {
                
                const startNodeKey = quest.triggerItem.startNode;
                const dialogueNode = quest.dialogue?.[startNodeKey];

                if (dialogueNode) {
                    setActiveDialogue({
                        npcName: activity.name,
                        npcIcon: activity.icon,
                        nodes: quest.dialogue!,
                        currentNodeKey: startNodeKey,
                        onEnd: () => setActiveDialogue(null),
                        onResponse: onResponse,
                        handleDialogueCheck: handleDialogueCheck,
                    });
                    return; // Interaction handled
                }
            }
        }

        addLog("Nothing interesting happens.");
    }, [playerQuests, addLog, setActiveDialogue, onResponse, handleDialogueCheck]);

    const handleExamine = useCallback((item: Item) => {
        if (item.id === 'stolen_caravan_goods' && !playerQuests.some(q => q.questId === 'missing_shipment')) {
            startQuest('missing_shipment');
        }
        addLog(`${item.description}`);
    }, [addLog, playerQuests, startQuest]);

    return {
        handleConsume,
        handleBuryBones,
        handleEmptyItem,
        handleUseItemOn,
        handleUseItemOnActivity,
        handleDivine,
        handleExamine,
        handleReadMap,
    };
};
