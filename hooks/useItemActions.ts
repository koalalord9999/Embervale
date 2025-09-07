import { useCallback } from 'react';
import { InventorySlot, PlayerSkill, SkillName, ActiveCraftingAction, Item, CraftingContext } from '../types';
// FIX: Import the HERBS constant.
import { ITEMS, FLETCHING_RECIPES, HERBLORE_RECIPES, HERBS, INVENTORY_CAPACITY } from '../constants';
import { MakeXPrompt } from './useUIState';

interface UseItemActionsProps {
    addLog: (message: string) => void;
    currentHp: number;
    maxHp: number;
    setCurrentHp: React.Dispatch<React.SetStateAction<number>>;
    applyStatModifier: (skill: SkillName, value: number, duration: number) => void;
    setInventory: React.Dispatch<React.SetStateAction<(InventorySlot | null)[]>>;
    skills: PlayerSkill[];
    inventory: (InventorySlot | null)[];
    activeCraftingAction: ActiveCraftingAction | null;
    setActiveCraftingAction: (action: ActiveCraftingAction | null) => void;
    hasItems: (items: { itemId: string, quantity: number }[]) => boolean;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean) => void;
    addXp: (skill: SkillName, amount: number) => void;
    openCraftingView: (context: CraftingContext) => void;
    setItemToUse: (item: { item: InventorySlot, index: number } | null) => void;
    addBuff: (buff: Omit<any, 'id' | 'expiresAt'>) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
}

export const useItemActions = (props: UseItemActionsProps) => {
    const { addLog, currentHp, maxHp, setCurrentHp, applyStatModifier, setInventory, skills, inventory, activeCraftingAction, setActiveCraftingAction, hasItems, modifyItem, addXp, openCraftingView, setItemToUse, addBuff, setMakeXPrompt } = props;

    const handleConsume = useCallback((itemId: string, inventoryIndex: number) => {
        const itemData = ITEMS[itemId];
        if (!itemData) return;

        if (itemData.cleanable) {
            const herbloreLevel = skills.find(s => s.name === SkillName.Herblore)?.level ?? 1;
            const herbData = HERBS.find(h => h.grimy === itemId);
            if (herbData && herbloreLevel < herbData.level) {
                addLog(`You need a Herblore level of ${herbData.level} to clean this herb.`);
                return;
            }
            modifyItem(itemId, -1, true);
            modifyItem(itemData.cleanable.cleanItemId, 1, true);
            addXp(SkillName.Herblore, itemData.cleanable.xp);
            addLog(`You clean the grimy herb.`);
            return;
        }

        if (!itemData.consumable) return;
        
        if (itemId === 'grimy_coin_pouch') {
            addLog("YUCK! I'm not opening that, maybe I should clean it first?");
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
            addLog(`You consume the ${itemData.name} and heal ${healAmount} HP.`);
        }
        if (itemData.consumable.statModifiers) {
            itemData.consumable.statModifiers.forEach(modifier => {
                applyStatModifier(modifier.skill, modifier.value, modifier.duration);
            });
        }
        if (itemData.consumable.buffs) {
            itemData.consumable.buffs.forEach(buff => {
                addBuff(buff);
            });
        }
        
        const wasDrinkable = itemData.emptyable;
        
        setInventory(prev => {
            const newInv = [...prev];
            const itemSlot = newInv[inventoryIndex];
    
            if (!itemSlot) return prev;
    
            // 1. Remove the consumed item by either decrementing or nullifying the slot.
            if (itemData.stackable && itemSlot.quantity > 1) {
                newInv[inventoryIndex] = { ...itemSlot, quantity: itemSlot.quantity - 1 };
            } else {
                newInv[inventoryIndex] = null;
            }
    
            // 2. Add back the empty container if needed, without changing inventory size.
            if (wasDrinkable) {
                const emptyItemId = wasDrinkable.emptyItemId;
                const emptyItemData = ITEMS[emptyItemId];
    
                if (emptyItemData.stackable) {
                    const existingStackIndex = newInv.findIndex(i => i?.itemId === emptyItemId);
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
                } else { // Not stackable
                    const emptySlotIndex = newInv[inventoryIndex] === null ? inventoryIndex : newInv.findIndex(slot => slot === null);
                    if (emptySlotIndex > -1) {
                        newInv[emptySlotIndex] = { itemId: emptyItemId, quantity: 1 };
                    } else {
                        addLog("You drop the empty container as your inventory is full.");
                    }
                }
            }
            return newInv;
        });

    }, [skills, currentHp, maxHp, setCurrentHp, setInventory, addLog, applyStatModifier, modifyItem, addXp, addBuff]);
    
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
            if (newInv[inventoryIndex]?.itemId !== itemId) return prev;
            
            // Empty the slot first
            newInv[inventoryIndex] = null;
            
            // Then add the empty container back, possibly into the same slot
            if (emptyItemData.stackable) {
                const existingStack = newInv.find(i => i?.itemId === emptyItemId);
                if (existingStack) {
                    existingStack.quantity += 1;
                } else {
                    // It's a new stackable item, so it needs an empty slot.
                    // The one we just cleared is guaranteed to be empty.
                    newInv[inventoryIndex] = { itemId: emptyItemId, quantity: 1 };
                }
            } else {
                 // The item is not stackable, so it needs a new slot.
                 // The one we just cleared is guaranteed to be empty.
                newInv[inventoryIndex] = { itemId: emptyItemId, quantity: 1 };
            }
            return newInv;
        });

        addLog(`You empty the ${itemData.name}.`);
    }, [inventory, setInventory, addLog]);


    const handleItemCombination = useCallback((used: { item: InventorySlot, index: number }, target: { item: InventorySlot, index: number }) => {
        const fletchingLevel = skills.find(s => s.name === SkillName.Fletching)?.level ?? 1;
        const herbloreLevel = skills.find(s => s.name === SkillName.Herblore)?.level ?? 1;
        const usedId = used.item.itemId;
        const targetId = target.item.itemId;

        const getItemCount = (itemId: string): number => {
            return inventory.reduce((total, slot) => {
                return slot && slot.itemId === itemId ? total + slot.quantity : total;
            }, 0);
        };

        // Herblore: Making unfinished potions
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

            setMakeXPrompt({
                title: `Create ${ITEMS[unfRecipe.unfinishedPotionId].name}`,
                max: maxCreatable,
                onConfirm: (quantity) => {
                    if (activeCraftingAction) {
                        addLog("You are already busy crafting something else.");
                        return;
                    }
                    if (quantity > 0) {
                        addLog(`You begin mixing the potions...`);
                        setActiveCraftingAction({
                            recipeId: unfRecipe.unfinishedPotionId,
                            recipeType: 'herblore-unfinished',
                            totalQuantity: quantity,
                            completedQuantity: 0,
                            startTime: Date.now(),
                            duration: 800, // Cooldown per potion
                            payload: { cleanHerbId: unfRecipe.cleanHerbId }
                        });
                    }
                }
            });
            return;
        }

        // Herblore: Making finished potions
        const finRecipe = HERBLORE_RECIPES.finished.find(r => (r.unfinishedPotionId === usedId && r.secondaryId === targetId) || (r.unfinishedPotionId === targetId && r.secondaryId === usedId));
        if (finRecipe) {
            if (herbloreLevel < finRecipe.level) { addLog(`You need a Herblore level of ${finRecipe.level} to make this.`); return; }
            modifyItem(finRecipe.unfinishedPotionId, -1, true);
            modifyItem(finRecipe.secondaryId, -1, true);
            modifyItem(finRecipe.finishedPotionId, 1);
            addXp(SkillName.Herblore, finRecipe.xp);
            addLog(`You mix in the ${ITEMS[finRecipe.secondaryId].name} and create a ${ITEMS[finRecipe.finishedPotionId].name}.`);
            return;
        }

        // Cleaning Grimy Coin Pouch
        const isCleaningPouch = (usedId === 'pouch_cleanser' && targetId === 'grimy_coin_pouch') || (targetId === 'pouch_cleanser' && usedId === 'grimy_coin_pouch');
        if (isCleaningPouch) {
            if (herbloreLevel < 10) {
                addLog("You need a Herblore level of 10 to use this cleanser properly.");
                return;
            }
            if (hasItems([{ itemId: 'pouch_cleanser', quantity: 1 }, { itemId: 'grimy_coin_pouch', quantity: 1 }])) {
                modifyItem('pouch_cleanser', -1, true);
                modifyItem('grimy_coin_pouch', -1, true);
                modifyItem('clean_coin_pouch', 1);
                addXp(SkillName.Herblore, 15);
                addLog("You use the cleanser to scrub the grime off the pouch.");
            }
            return;
        }

        // Instant combinations first
        const isRatKebab = (usedId === 'arrow_shaft' && targetId === 'rat_tail') || (targetId === 'arrow_shaft' && usedId === 'rat_tail');
        if (isRatKebab) {
            if (hasItems([{ itemId: 'arrow_shaft', quantity: 1 }, { itemId: 'rat_tail', quantity: 1 }])) {
                modifyItem('arrow_shaft', -1);
                modifyItem('rat_tail', -1);
                modifyItem('rat_kebab_uncooked', 1);
                addLog("You skewer the rat tail with the arrow shaft, creating an uncooked kebab.");
            }
            return;
        }

        const startTimedAction = (recipeId: string, recipeType: ActiveCraftingAction['recipeType'], totalQuantity: number, duration: number, payload?: ActiveCraftingAction['payload']) => {
            addLog("You begin to combine the items...");
            setActiveCraftingAction({ recipeId, recipeType, totalQuantity, completedQuantity: 0, startTime: Date.now(), duration, payload });
        };
        
        // Stringing a bow
        const stringRecipe = FLETCHING_RECIPES.stringing.find(r => (usedId === 'bow_string' && r.unstrungId === targetId) || (targetId === 'bow_string' && r.unstrungId === usedId));
        if (stringRecipe) {
            if (fletchingLevel < stringRecipe.level) { addLog(`You need a Fletching level of ${stringRecipe.level} to string this bow.`); return; }
            const unstrungBows = inventory.filter(i => i?.itemId === stringRecipe.unstrungId).length;
            const bowStrings = inventory.filter(i => i?.itemId === 'bow_string').length;
            const quantity = Math.min(unstrungBows, bowStrings);
            startTimedAction(stringRecipe.strungId, 'fletching-string', quantity, 1200, { unstrungId: stringRecipe.unstrungId });
            return;
        }

        // Making headless arrows
        if ((usedId === 'arrow_shaft' && targetId === 'feathers') || (targetId === 'arrow_shaft' && usedId === 'feathers')) {
            const recipe = FLETCHING_RECIPES.headless;
            if (fletchingLevel < recipe.level) { addLog(`You need a Fletching level of ${recipe.level} to make these.`); return; }
            const shaftQty = inventory.find(i => i?.itemId === 'arrow_shaft')?.quantity ?? 0;
            const featherQty = inventory.find(i => i?.itemId === 'feathers')?.quantity ?? 0;
            const quantity = Math.floor(Math.min(shaftQty, featherQty) / 15);
            if (quantity < 1) { addLog("You need at least 15 shafts and 15 feathers."); return; }
            startTimedAction('headless_arrow', 'fletching-headless', quantity, 600);
            return;
        }

        // Tipping headless arrows
        const tipRecipe = FLETCHING_RECIPES.tipping.find(r => (r.tipId === usedId && targetId === 'headless_arrow') || (r.tipId === targetId && usedId === 'headless_arrow'));
        if (tipRecipe) {
             if (fletchingLevel < tipRecipe.level) { addLog(`You need a Fletching level of ${tipRecipe.level} to attach these.`); return; }
             const tipQty = inventory.find(i => i?.itemId === tipRecipe.tipId)?.quantity ?? 0;
             const headlessQty = inventory.find(i => i?.itemId === 'headless_arrow')?.quantity ?? 0;
             const quantity = Math.floor(Math.min(tipQty, headlessQty) / 15);
             if (quantity < 1) { addLog("You need at least 15 tips and 15 headless arrows."); return; }
             startTimedAction(tipRecipe.arrowId, 'fletching-tip', quantity, 600, { tipId: tipRecipe.tipId });
             return;
        }

        addLog("Nothing interesting happens.");
    }, [skills, inventory, addLog, setActiveCraftingAction, hasItems, modifyItem, addXp, setMakeXPrompt, activeCraftingAction]);

    const handleUseItemOn = useCallback((used: { item: InventorySlot, index: number }, target: { item: InventorySlot, index: number }) => {
        const usedItem = ITEMS[used.item.itemId];
        const targetItem = ITEMS[target.item.itemId];
    
        const isLog = (item: Item) => item.id === 'logs' || item.id.endsWith('_logs');
        const isChisel = (item: Item) => item.id === 'chisel';
        const isUncutGem = (item: Item) => item.id.startsWith('uncut_');
        const isNeedle = (item: Item) => item.id === 'needle';
        const isLeather = (item: Item) => item.id === 'leather';

        if ((isChisel(usedItem) && isUncutGem(targetItem)) || (isUncutGem(usedItem) && isChisel(targetItem))) {
            openCraftingView({ type: 'gem_cutting' });
        }
        else if ((isNeedle(usedItem) && isLeather(targetItem)) || (isLeather(usedItem) && isNeedle(usedItem))) {
            openCraftingView({ type: 'leatherworking' });
        }
        else if (usedItem.id === 'knife' && isLog(targetItem)) {
            openCraftingView({ type: 'fletching', logId: targetItem.id });
        }
        else if (targetItem.id === 'knife' && isLog(usedItem)) {
            openCraftingView({ type: 'fletching', logId: usedItem.id });
        }
        else {
            handleItemCombination(used, target);
        }
    
        setItemToUse(null);
    }, [openCraftingView, handleItemCombination, setItemToUse]);


    return {
        handleConsume,
        handleBuryBones,
        handleEmptyItem,
        handleUseItemOn,
    };
};
