
import React, { useCallback, useEffect, useRef } from 'react';
import { PlayerSkill, SkillName, InventorySlot, ActiveCraftingAction, Equipment, WorldState } from '../types';
import { ITEMS, SMITHING_RECIPES, COOKING_RECIPES, INVENTORY_CAPACITY, CRAFTING_RECIPES, FLETCHING_RECIPES, GEM_CUTTING_RECIPES, SPINNING_RECIPES, HERBLORE_RECIPES, JEWELRY_CRAFTING_RECIPES, DOUGH_RECIPES, RUNECRAFTING_RECIPES, FIREMAKING_RECIPES, SPECIAL_SMITHING_RECIPES } from '../constants';
import { POIS } from '../data/pois';

interface UseCraftingProps {
    skills: (PlayerSkill & { currentLevel: number; })[];
    hasItems: (items: { itemId: string, quantity: number }[]) => boolean;
    addLog: (message: string) => void;
    activeCraftingAction: ActiveCraftingAction | null;
    setActiveCraftingAction: (action: ActiveCraftingAction | null) => void;
    inventory: (InventorySlot | null)[];
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean }) => void;
    addXp: (skill: SkillName, amount: number) => void;
    checkQuestProgressOnSpin: (itemId: string, quantity: number) => void;
    checkQuestProgressOnSmith: (itemId: string, quantity: number) => void;
    checkQuestProgressOnOffer: (itemId: string, quantity: number) => void;
    advanceTutorial: (condition: string) => void;
    closeCraftingView: () => void;
    setWindmillFlour: React.Dispatch<React.SetStateAction<number>>;
    equipment: Equipment;
    setEquipment: React.Dispatch<React.SetStateAction<Equipment>>;
    worldState: WorldState;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
    onCreateBonfire: (logId: string) => void;
    onRefreshBonfire: (bonfireId: string, logId: string) => void;
    isInCombat: boolean;
    currentPrayer: number;
    setCurrentPrayer: (updater: React.SetStateAction<number>) => void;
    setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
}

type BarType = 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'silver_bar' | 'gold_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar';

export const useCrafting = (props: UseCraftingProps) => {
    const { skills, hasItems, addLog, setActiveCraftingAction, inventory, modifyItem, addXp, checkQuestProgressOnSpin, checkQuestProgressOnSmith, checkQuestProgressOnOffer, activeCraftingAction, advanceTutorial, closeCraftingView, setWindmillFlour, equipment, setEquipment, worldState, setWorldState, onCreateBonfire, onRefreshBonfire, isInCombat, currentPrayer, setCurrentPrayer, setIsResting } = props;

    const completeCraftingItem = useCallback((action: ActiveCraftingAction): { success: boolean; wasItemMade: boolean; logMessage?: string } => {
        let recipe: any;
        let ingredients: { itemId: string, quantity: number }[] = [];
        let product: { itemId: string, quantity: number } = { itemId: action.recipeId, quantity: 1 };
        let xp = { skill: SkillName.Crafting, amount: 0 };
        let levelReq = { skill: SkillName.Crafting, level: 1 };
        const ring = equipment.ring;

        const getItemCount = (itemId: string): number => {
            return inventory.reduce((total, slot) => {
                return slot && slot.itemId === itemId ? total + slot.quantity : total;
            }, 0);
        };

        // Special handling for Iron Bar smelting with 50% success rate
        if (action.recipeType === 'smithing-bar' && action.payload?.barType === 'iron_bar') {
            const smithingLevelCheck = skills.find(s => s.name === SkillName.Smithing)?.currentLevel ?? 1;
            if (smithingLevelCheck < 15) return { success: false, wasItemMade: false, logMessage: "Your level is too low." };
            if (!hasItems([{ itemId: 'iron_ore', quantity: 1 }])) return { success: false, wasItemMade: false, logMessage: "You ran out of ingredients." };
            
            // Consume ore regardless of success
            modifyItem('iron_ore', -1, true);
    
            if (Math.random() < 0.5) { // 50% success chance
                modifyItem('iron_bar', 1, true, { bypassAutoBank: true });
                addXp(SkillName.Smithing, 12.5); // Full XP on success
                checkQuestProgressOnSmith('iron_bar', 1);
                return { success: true, wasItemMade: true };
            } else {
                // No xp for failing to refine
                return { success: true, wasItemMade: false, logMessage: "You failed to refine the ore and lost it in the heat." };
            }
        }

        switch(action.recipeType) {
            case 'smithing-special':
                recipe = SPECIAL_SMITHING_RECIPES.find(r => r.itemId === action.recipeId);
                if (recipe) {
                    if (!inventory.some(i => i && i.itemId === 'hammer')) {
                        return { success: false, wasItemMade: false, logMessage: "You need a hammer to continue smithing." };
                    }
                    ingredients = recipe.ingredients;
                    xp = { skill: SkillName.Smithing, amount: recipe.xp };
                    levelReq = { skill: SkillName.Smithing, level: recipe.level };
                }
                break;
            case 'paste-making': {
                if (!hasItems([{ itemId: 'anointing_oil', quantity: 1 }, { itemId: 'sacred_dust', quantity: 1 }])) {
                    return { success: false, wasItemMade: false, logMessage: "You ran out of ingredients." };
                }
                const dustCount = getItemCount('sacred_dust');
                const dustToUse = Math.min(5, dustCount);
            
                modifyItem('anointing_oil', -1, true);
                modifyItem('sacred_dust', -dustToUse, true);
                modifyItem('holy_paste', dustToUse, false, { bypassAutoBank: true });
            
                return { success: true, wasItemMade: true };
            }
            case 'offering': {
                if (!hasItems([{ itemId: 'holy_paste', quantity: 1 }])) {
                    return { success: false, wasItemMade: false, logMessage: "You ran out of holy paste." };
                }
                if (!hasItems([{ itemId: 'tinderbox', quantity: 1 }])) {
                    return { success: false, wasItemMade: false, logMessage: "You need a tinderbox to light the offering." };
                }

                const pasteCount = getItemCount('holy_paste');
                const totalItems = action.payload?.totalItems ?? (action.totalQuantity * 5); // Fallback if totalItems isn't passed
                const itemsAlreadyProcessed = action.completedQuantity * 5; // Assumes each previous batch was a full 5
                const itemsLeftToProcess = totalItems - itemsAlreadyProcessed;

                const pasteToUse = Math.min(5, pasteCount, itemsLeftToProcess);

                if (pasteToUse <= 0) {
                    return { success: false, wasItemMade: false, logMessage: "You ran out of holy paste." };
                }
            
                modifyItem('holy_paste', -pasteToUse, true);
                addXp(SkillName.Prayer, pasteToUse * 3);
                checkQuestProgressOnOffer('holy_paste', pasteToUse);
                
                return { success: true, wasItemMade: true };
            }
            case 'consecration': {
                const prayerCost = action.payload?.prayerCost;
                if (prayerCost === undefined) {
                    return { success: false, wasItemMade: false, logMessage: "Error: Prayer cost not defined for consecration." };
                }
                if (currentPrayer < prayerCost) {
                    return { success: false, wasItemMade: false, logMessage: "You don't have enough prayer points to continue." };
                }
                
                setCurrentPrayer(prev => prev - prayerCost);

                const boneItem = ITEMS[action.recipeId];
                const consecratedId = `consecrated_${action.recipeId}`;
                if (!boneItem?.buryable || !ITEMS[consecratedId]) {
                    return { success: false, wasItemMade: false, logMessage: "Cannot consecrate this item." };
                }
                modifyItem(action.recipeId, -1, true);
                modifyItem(consecratedId, 1, false, { bypassAutoBank: true });
                addXp(SkillName.Prayer, boneItem.buryable.prayerXp / 2);
                return { success: true, wasItemMade: true };
            }
            case 'grinding': {
                const consecratedBoneId = action.recipeId;
                let dustAmount = 0;
                let xpAmount = 0;
                if (consecratedBoneId === 'consecrated_bones') { dustAmount = 5; xpAmount = 5; }
                else if (consecratedBoneId === 'consecrated_big_bones') { dustAmount = 20; xpAmount = 20; }
                else if (consecratedBoneId === 'consecrated_dragon_bones') { dustAmount = 100; xpAmount = 100; }

                if (dustAmount === 0) {
                    return { success: false, wasItemMade: false, logMessage: "Cannot grind this item." };
                }

                modifyItem(consecratedBoneId, -1, true);
                modifyItem('sacred_dust', dustAmount, false, { bypassAutoBank: true });
                addXp(SkillName.Prayer, xpAmount);
                return { success: true, wasItemMade: true };
            }
            case 'milling': {
                if (!hasItems([{ itemId: 'wheat', quantity: 1 }])) {
                    return { success: false, wasItemMade: false, logMessage: "You ran out of wheat." };
                }
                modifyItem('wheat', -1, true);
                setWindmillFlour(f => f + 1);
                return { success: true, wasItemMade: true };
            }
            case 'dough-making': {
                 recipe = DOUGH_RECIPES.find(r => r.itemId === action.recipeId);
                 if (recipe) {
                     ingredients = recipe.ingredients;
                     xp = { skill: SkillName.Cooking, amount: recipe.xp ?? 0 };
                     levelReq = { skill: SkillName.Cooking, level: recipe.level ?? 1 };
                 }
                 break;
            }
            case 'firemaking-light': {
                const logId = action.recipeId;
                const recipe = FIREMAKING_RECIPES.find(r => r.logId === logId);
                if (!recipe) return { success: false, wasItemMade: false, logMessage: "Invalid log type." };
                if (!hasItems([{ itemId: logId, quantity: 1 }])) {
                    return { success: false, wasItemMade: false, logMessage: "You ran out of logs." };
                }

                const firemakingSkill = skills.find(s => s.name === SkillName.Firemaking);
                if (!firemakingSkill) return { success: false, wasItemMade: false, logMessage: "Could not find Firemaking skill." };

                const playerLevel = firemakingSkill.currentLevel;
                const recipeLevel = recipe.level;
                
                let successChance = 50 + (playerLevel - recipeLevel) * 1.5;
                successChance = Math.max(5, Math.min(99, successChance));

                if (Math.random() * 100 < successChance) {
                    modifyItem(logId, -1, true);
                    addXp(SkillName.Firemaking, recipe.xp);
                    onCreateBonfire(logId);
                    return { success: true, wasItemMade: true };
                } else {
                    return { success: true, wasItemMade: false, logMessage: "You fail to light the logs." };
                }
            }
             case 'firemaking-stoke': {
                const logId = action.recipeId;
                const recipe = FIREMAKING_RECIPES.find(r => r.logId === logId);
                if (!recipe) return { success: false, wasItemMade: false, logMessage: "Invalid log type." };
                if (!hasItems([{ itemId: logId, quantity: 1 }])) {
                    return { success: false, wasItemMade: false, logMessage: "You ran out of logs." };
                }
                modifyItem(logId, -1, true);
                addXp(SkillName.Firemaking, recipe.xp);

                if (Math.random() < 0.25) { // 25% chance for ashes
                    modifyItem('ashes', 1, false, { bypassAutoBank: true });
                }
                if (Math.random() < 0.25) { // 25% chance for HP boost
                    const boostAmount = recipe.tier;
                    const currentBoost = worldState.hpBoost?.amount ?? 0;
                    if (boostAmount > currentBoost) {
                        setWorldState(ws => ({ ...ws, hpBoost: { amount: boostAmount, expiresAt: Date.now() + 30 * 60 * 1000 } }));
                        addLog(`The warmth of the fire invigorates you, temporarily boosting your health by ${boostAmount}!`);
                    }
                }
                onRefreshBonfire(action.payload!.bonfireId!, logId);
                return { success: true, wasItemMade: true };
            }
            case 'smithing-bar':
                levelReq.skill = SkillName.Smithing;
                switch(action.payload?.barType) {
                    case 'bronze_bar': ingredients = [{itemId: 'copper_ore', quantity: 1}, {itemId: 'tin_ore', quantity: 1}]; xp = { skill: SkillName.Smithing, amount: 7}; levelReq.level = 1; break;
                    case 'silver_bar': ingredients = [{itemId: 'silver_ore', quantity: 1}]; xp = { skill: SkillName.Smithing, amount: 15}; levelReq.level = 20; break;
                    case 'steel_bar': ingredients = [{itemId: 'iron_ore', quantity: 1}, {itemId: 'coal', quantity: 2}]; xp = { skill: SkillName.Smithing, amount: 20}; levelReq.level = 30; break;
                    case 'gold_bar': ingredients = [{itemId: 'gold_ore', quantity: 1}]; xp = { skill: SkillName.Smithing, amount: 22.5}; levelReq.level = 40; break;
                    case 'mithril_bar': ingredients = [{itemId: 'mithril_ore', quantity: 1}, {itemId: 'coal', quantity: 4}]; xp = { skill: SkillName.Smithing, amount: 40 }; levelReq.level = 50; break;
                    case 'adamantite_bar': ingredients = [{itemId: 'adamantite_ore', quantity: 1}, {itemId: 'coal', quantity: 6}]; xp = { skill: SkillName.Smithing, amount: 55 }; levelReq.level = 65; break;
                    case 'runic_bar': ingredients = [{itemId: 'titanium_ore', quantity: 1}, {itemId: 'coal', quantity: 8}]; xp = { skill: SkillName.Smithing, amount: 70 }; levelReq.level = 80; break;
                }
                break;
            case 'smithing-item':
                recipe = SMITHING_RECIPES.find(r => r.itemId === action.recipeId);
                if (recipe) {
                    if (!inventory.some(i => i && i.itemId === 'hammer')) {
                        return { success: false, wasItemMade: false, logMessage: "You need a hammer to continue smithing." };
                    }
                    ingredients = [{itemId: recipe.barType, quantity: recipe.barsRequired}];
                    xp = { skill: SkillName.Smithing, amount: recipe.xp };
                    levelReq = { skill: SkillName.Smithing, level: recipe.level };
                    if (action.recipeId.includes('arrowtips')) {
                        product.quantity = 15;
                    } else if (action.recipeId.includes('bolts')) {
                        product.quantity = 10;
                    }
                }
                break;
            case 'jewelry':
                recipe = JEWELRY_CRAFTING_RECIPES.find(r => r.itemId === action.recipeId);
                if (recipe) {
                    if (!hasItems([{itemId: recipe.mouldId, quantity: 1}])) {
                        return { success: false, wasItemMade: false, logMessage: "You need the correct mould." };
                    }
                    ingredients = [{itemId: recipe.barType, quantity: recipe.barsRequired}];
                    if (recipe.gemId) {
                        ingredients.push({ itemId: recipe.gemId, quantity: 1 });
                    }
                    xp = { skill: SkillName.Crafting, amount: recipe.xp };
                    levelReq = { skill: SkillName.Crafting, level: recipe.level };
                }
                break;
            case 'fletching-carve':
                recipe = FLETCHING_RECIPES.carving[action.payload!.logId!]?.find(r => r.itemId === action.recipeId);
                 if (recipe) {
                    ingredients = [{itemId: action.payload!.logId!, quantity: 1}];
                    product.quantity = recipe.quantity ?? 1;
                    xp = { skill: SkillName.Fletching, amount: recipe.xp };
                    levelReq = { skill: SkillName.Fletching, level: recipe.level };
                }
                break;
            case 'fletching-stock':
                recipe = FLETCHING_RECIPES.stocks.find(r => r.stockId === action.recipeId);
                if (recipe) {
                    ingredients = [{ itemId: recipe.logId, quantity: 1 }];
                    product.itemId = recipe.stockId;
                    xp = { skill: SkillName.Fletching, amount: recipe.xp };
                    levelReq = { skill: SkillName.Fletching, level: recipe.level };
                }
                break;
            case 'fletching-assembly':
                recipe = FLETCHING_RECIPES.assembly.find(r => r.unstrungId === action.recipeId);
                if (recipe) {
                    ingredients = [{ itemId: recipe.limbsId, quantity: 1 }, { itemId: recipe.stockId, quantity: 1 }];
                    product.itemId = recipe.unstrungId;
                    xp = { skill: SkillName.Fletching, amount: recipe.xp };
                    levelReq = { skill: SkillName.Fletching, level: recipe.level };
                }
                break;
             case 'fletching-string':
                recipe = FLETCHING_RECIPES.stringing.find(r => r.strungId === action.recipeId);
                if (recipe) {
                    const stringType = recipe.unstrungId.includes('crossbow') ? 'crossbow_string' : 'bow_string';
                    ingredients = [{itemId: stringType, quantity: 1}, {itemId: recipe.unstrungId, quantity: 1}];
                    xp = { skill: SkillName.Fletching, amount: recipe.xp };
                    levelReq = { skill: SkillName.Fletching, level: recipe.level };
                }
                break;
             case 'fletching-headless':
                recipe = FLETCHING_RECIPES.headless;
                ingredients = [{itemId: 'arrow_shaft', quantity: 15}, {itemId: 'feathers', quantity: 15}];
                product.quantity = 15;
                xp = { skill: SkillName.Fletching, amount: recipe.xpPer * 15 };
                levelReq = { skill: SkillName.Fletching, level: recipe.level };
                break;
             case 'fletching-tip':
                recipe = FLETCHING_RECIPES.tipping.find(r => r.arrowId === action.recipeId);
                 if(recipe) {
                    ingredients = [{itemId: 'headless_arrow', quantity: 15}, {itemId: recipe.tipId, quantity: 15}];
                    product.quantity = 15;
                    xp = { skill: SkillName.Fletching, amount: recipe.xpPer * 15 };
                    levelReq = { skill: SkillName.Fletching, level: recipe.level };
                 }
                break;
            case 'fletching-feather':
                recipe = FLETCHING_RECIPES.feathering.find(r => r.boltsId === action.recipeId);
                if (recipe) {
                    ingredients = [{ itemId: 'feathers', quantity: 10 }, { itemId: recipe.unfBoltsId, quantity: 10 }];
                    product.itemId = recipe.boltsId;
                    product.quantity = 10;
                    xp = { skill: SkillName.Fletching, amount: recipe.xpPer };
                    levelReq = { skill: SkillName.Fletching, level: recipe.level };
                }
                break;
            case 'gem-cutting':
                recipe = GEM_CUTTING_RECIPES.find(r => r.cutId === action.recipeId);
                if(recipe) {
                    if (!inventory.some(i => i && i.itemId === 'chisel')) {
                        return { success: false, wasItemMade: false, logMessage: "You need a chisel to continue." };
                    }
                    ingredients = [{itemId: recipe.uncutId, quantity: 1}];
                    xp = { skill: SkillName.Crafting, amount: recipe.xp };
                    levelReq = { skill: SkillName.Crafting, level: recipe.level };
                }
                break;
            case 'spinning':
                recipe = SPINNING_RECIPES.find(r => r.itemId === action.recipeId);
                if (recipe) {
                    ingredients = recipe.ingredients;
                    xp = { skill: SkillName.Crafting, amount: recipe.xp ?? 0 };
                    levelReq = { skill: SkillName.Crafting, level: recipe.level ?? 1 };
                }
                break;
            case 'crafting':
                recipe = CRAFTING_RECIPES.find(r => r.itemId === action.recipeId);
                if (recipe) {
                    ingredients = recipe.ingredients;
                    xp = { skill: SkillName.Crafting, amount: recipe.xp ?? 0 };
                    levelReq = { skill: SkillName.Crafting, level: recipe.level ?? 1 };
                }
                break;
            case 'herblore-unfinished':
                recipe = HERBLORE_RECIPES.unfinished.find(r => r.unfinishedPotionId === action.recipeId);
                if (recipe) {
                    ingredients = [{itemId: recipe.cleanHerbId, quantity: 1}, {itemId: 'vial_of_water', quantity: 1}];
                    product = { itemId: recipe.unfinishedPotionId, quantity: 1 };
                    xp = { skill: SkillName.Herblore, amount: recipe.xp };
                    levelReq = { skill: SkillName.Herblore, level: recipe.level };
                }
                break;
            case 'herblore-finished':
                recipe = HERBLORE_RECIPES.finished.find(r => r.finishedPotionId === action.recipeId && r.unfinishedPotionId === action.payload?.unfinishedPotionId && r.secondaryId === action.payload?.secondaryId);
                if (recipe) {
                    ingredients = [{itemId: recipe.unfinishedPotionId, quantity: 1}, {itemId: recipe.secondaryId, quantity: 1}];
                    product = { itemId: recipe.finishedPotionId, quantity: 1 };
                    xp = { skill: SkillName.Herblore, amount: recipe.xp };
                    levelReq = { skill: SkillName.Herblore, level: recipe.level };
                }
                break;
            case 'cooking': {
                recipe = COOKING_RECIPES.find(r => r.itemId === action.recipeId);
                if (!recipe) return { success: false, wasItemMade: false, logMessage: "Could not find cooking recipe." };

                const cookingLevel = skills.find(s => s.name === SkillName.Cooking)?.currentLevel ?? 1;
                if (cookingLevel < recipe.level) return { success: false, wasItemMade: false, logMessage: `You need a Cooking level of ${recipe.level}.` };
                if (!hasItems(recipe.ingredients)) return { success: false, wasItemMade: false, logMessage: "You ran out of ingredients." };
                
                let slotsFreed = 0;
                for (const ing of recipe.ingredients) {
                    const itemData = ITEMS[ing.itemId];
                    if (itemData.stackable) {
                        const invSlot = inventory.find(s => s && s.itemId === ing.itemId);
                        if (invSlot && invSlot.quantity <= ing.quantity) {
                            slotsFreed++;
                        }
                    } else {
                        slotsFreed += ing.quantity;
                    }
                }

                const slotsGained = 1;

                const finalSlotCount = inventory.filter(Boolean).length - slotsFreed + slotsGained;
                
                if (finalSlotCount > INVENTORY_CAPACITY) {
                    return { success: false, wasItemMade: false, logMessage: "You don't have enough inventory space for the finished product." };
                }

                recipe.ingredients.forEach(ing => modifyItem(ing.itemId, -ing.quantity, true));

                const successChance = Math.min(0.95, 0.5 + (cookingLevel - recipe.level) * 0.02);
                if (Math.random() < successChance) {
                    modifyItem(recipe.itemId, 1, true, { bypassAutoBank: true });
                    addXp(SkillName.Cooking, recipe.xp);
                    
                    if (recipe.itemId === 'cake') {
                        modifyItem('cake_tin', 1, false, { bypassAutoBank: true });
                    } else if (['berry_pie', 'apple_pie', 'meat_pie', 'fish_pie'].includes(recipe.itemId)) {
                        modifyItem('pie_dish', 1, false, { bypassAutoBank: true });
                    }

                } else {
                    modifyItem(recipe.burntItemId, 1, true, { bypassAutoBank: true });
                }
                return { success: true, wasItemMade: true };
            }
        }

        const skillLevel = skills.find(s => s.name === levelReq.skill)?.currentLevel ?? 1;
        if (skillLevel < levelReq.level) return { success: false, wasItemMade: false, logMessage: "Your level is too low." };

        const completedRecipe = CRAFTING_RECIPES.find(r => r.itemId === action.recipeId) || SPINNING_RECIPES.find(r => r.itemId === action.recipeId) || DOUGH_RECIPES.find(r => r.itemId === action.recipeId);
        if (completedRecipe?.requiredSkills) {
            for (const req of completedRecipe.requiredSkills) {
                const playerSkill = skills.find(s => s.name === req.skill)?.currentLevel ?? 1;
                if (playerSkill < req.level) {
                    return { success: false, wasItemMade: false, logMessage: `Your ${req.skill} level is too low.` };
                }
            }
        }

        if (!hasItems(ingredients)) return { success: false, wasItemMade: false, logMessage: "You ran out of ingredients." };

        let slotsFreed = 0;
        for (const ing of ingredients) {
            if (ing.quantity === 0) continue; 
            const itemData = ITEMS[ing.itemId];
            if (itemData.stackable) {
                const invSlot = inventory.find(s => s && s.itemId === ing.itemId);
                if (invSlot && invSlot.quantity <= ing.quantity) {
                    slotsFreed++;
                }
            } else {
                slotsFreed += ing.quantity;
            }
        }

        let slotsGained = 0;
        const productData = ITEMS[product.itemId];
        if (productData.stackable) {
            if (!inventory.some(s => s && s.itemId === product.itemId)) {
                slotsGained = 1;
            }
        } else {
            slotsGained = product.quantity;
        }

        for (const ing of ingredients) {
            const itemData = ITEMS[ing.itemId];
            if (itemData?.emptyable && !productData.id.includes('potion')) {
                const emptyItemData = ITEMS[itemData.emptyable.emptyItemId];
                if (emptyItemData.stackable) {
                    if (!inventory.some(s => s && s.itemId === emptyItemData.id)) {
                        slotsGained++;
                    }
                } else {
                    slotsGained += ing.quantity;
                }
            }
        }

        const finalSlotCount = inventory.filter(Boolean).length - slotsFreed + slotsGained;

        if (finalSlotCount > INVENTORY_CAPACITY) {
            return { success: false, wasItemMade: false, logMessage: "You don't have enough inventory space for the finished product." };
        }
        
        let consumeIngredients = true;
        if (action.recipeType === 'smithing-item' && ring?.itemId === 'ring_of_the_forge' && (ring.charges ?? 0) > 0) {
            if (Math.random() < 0.30) { // 30% chance to save bars
                consumeIngredients = false;
                const newCharges = (ring.charges ?? 1) - 1;
                if (newCharges > 0) {
                    addLog("Your Ring of the Forge glows, preserving your bars!");
                    setEquipment(prev => ({ ...prev, ring: { ...ring, charges: newCharges } }));
                } else {
                    addLog("Your Ring of the Forge has run out of charges and crumbles to dust.");
                    setEquipment(prev => ({ ...prev, ring: null }));
                }
            }
        }

        if(consumeIngredients) {
            ingredients.forEach(ing => {
                if (ing.quantity > 0) {
                    const itemData = ITEMS[ing.itemId];
                    modifyItem(ing.itemId, -ing.quantity, true);
        
                    const productData = ITEMS[action.recipeId];
                    if (itemData?.emptyable && !productData.id.includes('potion')) {
                        modifyItem(itemData.emptyable.emptyItemId, ing.quantity, true, { bypassAutoBank: true });
                    }
                }
            });
        }
        
        modifyItem(product.itemId, product.quantity, true, { doses: productData.initialDoses, charges: productData.charges, bypassAutoBank: true });

        if (xp.amount > 0) {
            let totalXp = xp.amount;
            if (ring?.itemId === 'ring_of_mastery' && (ring.charges ?? 0) > 0) {
                if (Math.random() < 0.15) { // 15% chance for double xp
                    totalXp *= 2;
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
            addXp(xp.skill, totalXp);
        }

        if (completedRecipe?.xpRewards) {
            completedRecipe.xpRewards.forEach(reward => {
                let totalXp = reward.amount;
                if (ring?.itemId === 'ring_of_mastery' && (ring.charges ?? 0) > 0) {
                     if (Math.random() < 0.15) {
                        totalXp *= 2;
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
                addXp(reward.skill, totalXp);
            });
        }
        
        if (action.recipeType === 'spinning') {
            checkQuestProgressOnSpin(product.itemId, product.quantity);
        }
        if (action.recipeType === 'smithing-item' || action.recipeType === 'smithing-bar') {
            checkQuestProgressOnSmith(product.itemId, product.quantity);
        }
        
        if (action.recipeType === 'smithing-bar' && product.itemId === 'bronze_bar') {
            advanceTutorial('smelt-bar');
        }
        if (action.recipeType === 'smithing-item' && product.itemId === 'bronze_dagger') {
            advanceTutorial('smith-dagger');
        }

        return { success: true, wasItemMade: true };
    }, [hasItems, modifyItem, addXp, inventory, checkQuestProgressOnSpin, checkQuestProgressOnSmith, advanceTutorial, closeCraftingView, setWindmillFlour, equipment, skills, setEquipment, setWorldState, onCreateBonfire, onRefreshBonfire, checkQuestProgressOnOffer, currentPrayer, setCurrentPrayer]);

    const completeCraftingItemRef = useRef(completeCraftingItem);
    useEffect(() => {
        completeCraftingItemRef.current = completeCraftingItem;
    });

    useEffect(() => {
        if (!activeCraftingAction) return;
    
        const handle = setTimeout(() => {
            const { success, wasItemMade, logMessage } = completeCraftingItemRef.current(activeCraftingAction);
    
            if (logMessage) {
                addLog(logMessage);
            }
    
            if (!success) { 
                setActiveCraftingAction(null);
                return;
            }
    
            const nextAction: ActiveCraftingAction = { ...activeCraftingAction };
            
            if (wasItemMade) {
                nextAction.completedQuantity++;
                nextAction.successfulQuantity = (nextAction.successfulQuantity ?? 0) + 1;
            } else {
                if (activeCraftingAction.recipeType === 'firemaking-light') {
                    nextAction.startTime = Date.now();
                    setActiveCraftingAction(nextAction);
                    return;
                } else {
                    nextAction.completedQuantity++;
                }
            }
    
            if (nextAction.completedQuantity >= nextAction.totalQuantity) {
                if (activeCraftingAction.recipeType === 'milling') {
                    const successfulCount = nextAction.successfulQuantity ?? 0;
                    if (successfulCount > 0) {
                        addLog(`You milled ${successfulCount} wheat and added it to the hopper.`);
                    }
                    setActiveCraftingAction(null);
                    return;
                }

                if (activeCraftingAction.recipeType === 'paste-making') {
                    addLog(`You finish creating the Holy Paste.`);
                    setActiveCraftingAction(null);
                    return;
                }

                if (activeCraftingAction.recipeType === 'offering') {
                    addLog(`You complete your offerings to the altar.`);
                    setActiveCraftingAction(null);
                    return;
                }

                const finalItem = ITEMS[nextAction.recipeId];
                const successfulCount = nextAction.successfulQuantity ?? 0;
                
                if (activeCraftingAction.recipeType !== 'firemaking-light') {
                    if (successfulCount > 0) {
                        let totalItemsMade = successfulCount;
                        const action = activeCraftingAction;

                        const batchRecipes = [
                            'fletching-carve', 'fletching-headless', 'fletching-tip', 'fletching-feather',
                            'smithing-item'
                        ];
                        
                        if (batchRecipes.includes(action.recipeType)) {
                            if (action.recipeId.includes('arrowtips')) totalItemsMade *= 15;
                            else if (action.recipeId === 'arrow_shaft') {
                                const carvingRecipe = FLETCHING_RECIPES.carving[action.payload?.logId!]?.find(r => r.itemId === 'arrow_shaft');
                                totalItemsMade *= carvingRecipe?.quantity ?? 15;
                            } else if (action.recipeId === 'headless_arrow') totalItemsMade *= 15;
                            else if (action.recipeType === 'fletching-tip') totalItemsMade *= 15;
                            else if (action.recipeType === 'fletching-feather') totalItemsMade *= 10;
                            else if (action.recipeType === 'smithing-item' && action.recipeId.endsWith('_bolts_unf')) totalItemsMade *= 10;
                        }

                        const quantityText = (finalItem.doseable && finalItem.initialDoses && finalItem.initialDoses > 1) ? "" : `${totalItemsMade.toLocaleString()}x `;
                        const logMessageText = (finalItem.doseable && finalItem.initialDoses && finalItem.initialDoses > 1 && successfulCount === 1) ? `You finished making a ${finalItem.name}.` : `You finished making ${quantityText}${finalItem.name}.`;
                        addLog(logMessageText);
                    } else if (activeCraftingAction.recipeType !== 'dough-making' && activeCraftingAction.recipeType !== 'firemaking-stoke') {
                        addLog(`You failed to make any ${finalItem.name}.`);
                    }
                }
                setActiveCraftingAction(null);
                closeCraftingView();
            } else {
                nextAction.startTime = Date.now();
                setActiveCraftingAction(nextAction);
            }
    
        }, activeCraftingAction.duration);
    
        return () => clearTimeout(handle);
    }, [activeCraftingAction, addLog, setActiveCraftingAction, closeCraftingView]);

    const createTimedAction = useCallback((
        recipeId: string,
        recipeType: ActiveCraftingAction['recipeType'],
        totalQuantity: number,
        duration: number,
        payload?: ActiveCraftingAction['payload']
    ) => {
        setIsResting(false);
        if (isInCombat) {
            addLog("You cannot do that while in combat.");
            return;
        }
        setActiveCraftingAction({
            recipeId,
            recipeType,
            totalQuantity,
            completedQuantity: 0,
            successfulQuantity: 0,
            startTime: Date.now(),
            duration,
            payload,
        });
    }, [isInCombat, addLog, setActiveCraftingAction, setIsResting]);

    const handleCrafting = useCallback((itemId: string, quantity: number) => {
        createTimedAction(itemId, 'crafting', quantity, 1800);
    }, [createTimedAction]);
    
    const handleJewelryCrafting = useCallback((itemId: string, quantity: number) => {
        createTimedAction(itemId, 'jewelry', quantity, 1800);
    }, [createTimedAction]);

    const handleDoughMaking = useCallback((recipeId: string, quantity: number) => {
        createTimedAction(recipeId, 'dough-making', quantity, 200);
    }, [createTimedAction]);

    const handleSpinning = useCallback((itemId: string, quantity: number) => {
        createTimedAction(itemId, 'spinning', quantity, 1200);
    }, [createTimedAction]);

    const handleCooking = useCallback((recipeId: string, quantity: number = 1) => {
        createTimedAction(recipeId, 'cooking', quantity, 1200);
    }, [createTimedAction]);

    const handleSmelting = useCallback((barType: BarType, quantity: number) => {
        const duration = barType === 'iron_bar' ? 1800 : 1200;
        createTimedAction(barType, 'smithing-bar', quantity, duration, { barType });
    }, [createTimedAction]);

    const handleSmithItem = useCallback((itemId: string, quantity: number) => {
        const isSpecial = SPECIAL_SMITHING_RECIPES.some(r => r.itemId === itemId);
        const recipeType = isSpecial ? 'smithing-special' : 'smithing-item';
        createTimedAction(itemId, recipeType, quantity, 1800);
    }, [createTimedAction]);

    const handleGemCutting = useCallback((cutId: string, quantity: number) => {
        createTimedAction(cutId, 'gem-cutting', quantity, 1200);
    }, [createTimedAction]);

    const handleStokeBonfire = useCallback((logId: string, bonfireId: string) => {
        createTimedAction(logId, 'firemaking-stoke', 1, 1800, { bonfireId });
    }, [createTimedAction]);

    const handleFletching = useCallback((
        action: { type: 'carve' | 'stock'; payload: any },
        quantity: number
    ) => {
        if (isInCombat) {
            addLog("You cannot do that while in combat.");
            return;
        }
        const fletchingLevel = skills.find(s => s.name === SkillName.Fletching)?.currentLevel ?? 1;

        if (action.type === 'carve') {
            const { logId, outputItemId } = action.payload;
            const recipe = FLETCHING_RECIPES.carving[logId]?.find(r => r.itemId === outputItemId);
            if (!recipe) { addLog("You can't make that."); return; }
            if (fletchingLevel < recipe.level) { addLog(`You need a Fletching level of ${recipe.level}.`); return; }
            if (!hasItems([{ itemId: logId, quantity: 1 }])) { addLog("You don't have the required logs."); return; }
            
            let duration = 1800;
            if (recipe.itemId === 'arrow_shaft') duration = 600;

            createTimedAction(outputItemId, 'fletching-carve', quantity, duration, { logId });
        } else if (action.type === 'stock') {
            const { logId, outputItemId } = action.payload;
            const recipe = FLETCHING_RECIPES.stocks.find(r => r.logId === logId && r.stockId === outputItemId);
            if (!recipe) { addLog("You can't make that."); return; }
            if (fletchingLevel < recipe.level) { addLog(`You need a Fletching level of ${recipe.level}.`); return; }
            if (!hasItems([{ itemId: logId, quantity: 1 }])) { addLog("You don't have the required logs."); return; }
            
            createTimedAction(outputItemId, 'fletching-stock', quantity, 1800, { logId });
        }
    }, [skills, hasItems, addLog, createTimedAction, isInCombat]);
    
    const handleInstantRunecrafting = useCallback((runeId: string) => {
        setIsResting(false);
        if (isInCombat) {
            addLog("You cannot do that while in combat.");
            return;
        }

        const recipe = RUNECRAFTING_RECIPES.find(r => r.runeId === runeId);
        if (!recipe) {
            addLog("You can't craft those runes here.");
            return;
        }

        const rcLevel = skills.find(s => s.name === SkillName.Runecrafting)?.currentLevel ?? 1;
        if (rcLevel < recipe.level) {
            addLog(`You need a Runecrafting level of ${recipe.level} to craft these runes.`);
            return;
        }
        
        const tiara = Object.values(ITEMS).find(i => i.equipment?.slot === 'Head' && i.equipment.runeType === runeId);
        const hasTiara = tiara && equipment.head?.itemId === tiara.id;
        const hasTalisman = hasItems([{ itemId: recipe.talismanId, quantity: 1 }]) || equipment.necklace?.itemId === recipe.talismanId;

        if (!hasTalisman && !hasTiara) {
            addLog(`You need a ${ITEMS[recipe.talismanId].name} or a corresponding tiara to craft these runes.`);
            return;
        }

        const essenceCount = inventory.reduce((total, slot) => slot?.itemId === 'rune_essence' ? total + slot.quantity : total, 0);
        if (essenceCount === 0) {
            addLog("You don't have any rune essence.");
            return;
        }

        modifyItem('rune_essence', -essenceCount, true);
        
        const multiplier = 1 + Math.floor(rcLevel / 11);
        
        const runesCrafted = essenceCount * multiplier;
        const totalXp = essenceCount * recipe.xp;

        modifyItem(recipe.runeId, runesCrafted, false, { bypassAutoBank: true });
        addXp(SkillName.Runecrafting, totalXp);
        addLog(`You craft ${runesCrafted} ${ITEMS[recipe.runeId].name}s and gain ${totalXp} XP.`);

    }, [isInCombat, addLog, skills, hasItems, inventory, modifyItem, addXp, equipment, setIsResting]);


    return {
        handleCrafting,
        handleJewelryCrafting,
        handleSpinning,
        handleCooking,
        handleSmelting,
        handleSmithItem,
        handleFletching,
        handleGemCutting,
        handleInstantRunecrafting,
        handleStokeBonfire,
        handleDoughMaking,
    };
};
