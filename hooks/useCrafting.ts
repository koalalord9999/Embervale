import React, { useCallback, useEffect, useRef } from 'react';
import { PlayerSkill, SkillName, InventorySlot, ActiveCraftingAction, Equipment, WorldState } from '../types';
import { ITEMS, SMITHING_RECIPES, COOKING_RECIPES, INVENTORY_CAPACITY, CRAFTING_RECIPES, FLETCHING_RECIPES, GEM_CUTTING_RECIPES, SPINNING_RECIPES, HERBLORE_RECIPES, JEWELRY_CRAFTING_RECIPES, DOUGH_RECIPES, RUNECRAFTING_RECIPES, FIREMAKING_RECIPES } from '../constants';

interface UseCraftingProps {
    skills: (PlayerSkill & { currentLevel: number; })[];
    hasItems: (items: { itemId: string, quantity: number }[]) => boolean;
    addLog: (message: string) => void;
    activeCraftingAction: ActiveCraftingAction | null;
    setActiveCraftingAction: (action: ActiveCraftingAction | null) => void;
    inventory: (InventorySlot | null)[];
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, doses?: number, options?: { noted?: boolean, bypassAutoBank?: boolean }) => void;
    addXp: (skill: SkillName, amount: number) => void;
    checkQuestProgressOnSpin: (itemId: string, quantity: number) => void;
    checkQuestProgressOnSmith: (itemId: string, quantity: number) => void;
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
}

export const useCrafting = (props: UseCraftingProps) => {
    const { skills, hasItems, addLog, setActiveCraftingAction, inventory, modifyItem, addXp, checkQuestProgressOnSpin, checkQuestProgressOnSmith, activeCraftingAction, advanceTutorial, closeCraftingView, setWindmillFlour, equipment, setEquipment, worldState, setWorldState, onCreateBonfire, onRefreshBonfire, isInCombat } = props;

    const handleSpinning = useCallback((recipeId: string, quantity: number = 1) => {
        if (isInCombat) { addLog("You cannot do that while in combat."); return; }
        const recipe = SPINNING_RECIPES.find(r => r.itemId === recipeId);
        if (!recipe) { addLog("You don't know how to spin that."); return; }
        const craftingLevel = skills.find(s => s.name === SkillName.Crafting)?.currentLevel ?? 1;
        if (recipe.level && craftingLevel < recipe.level) { addLog(`You need a Crafting level of ${recipe.level} to make this.`); return; }
        if (!hasItems(recipe.ingredients)) { addLog(`You don't have the required ingredients.`); return; }

        setActiveCraftingAction({
            recipeId,
            recipeType: 'spinning',
            totalQuantity: quantity,
            completedQuantity: 0,
            successfulQuantity: 0,
            startTime: Date.now(),
            duration: 1200,
        });
    }, [skills, hasItems, addLog, setActiveCraftingAction, isInCombat]);

    const handleStokeBonfire = useCallback((logId: string, bonfireId: string) => {
        if (isInCombat) { addLog("You cannot do that while in combat."); return; }
        const recipe = FIREMAKING_RECIPES.find(r => r.logId === logId);
        if (!recipe) { addLog("You can't burn that."); return; }
        const firemakingLevel = skills.find(s => s.name === SkillName.Firemaking)?.currentLevel ?? 1;
        if (firemakingLevel < recipe.level) { addLog(`You need a Firemaking level of ${recipe.level} to stoke with these logs.`); return; }
        
        const logCount = inventory.reduce((acc, slot) => slot?.itemId === logId ? acc + slot.quantity : acc, 0);
        if (logCount === 0) { addLog("You don't have any of those logs."); return; }
        
        setActiveCraftingAction({
            recipeId: logId,
            recipeType: 'firemaking-stoke',
            totalQuantity: logCount,
            completedQuantity: 0,
            successfulQuantity: 0,
            startTime: Date.now(),
            duration: 4200, // 7 ticks
            payload: { bonfireId }
        });

    }, [skills, inventory, addLog, setActiveCraftingAction, isInCombat]);

    const handleCrafting = useCallback((recipeId: string, quantity: number = 1) => {
        if (isInCombat) { addLog("You cannot do that while in combat."); return; }
        const leatherRecipe = CRAFTING_RECIPES.find(r => r.itemId === recipeId);
        const jewelryRecipe = JEWELRY_CRAFTING_RECIPES.find(r => r.itemId === recipeId);
        const doughRecipe = DOUGH_RECIPES.find(r => r.itemId === recipeId);

        if (doughRecipe) {
            const recipe = doughRecipe;
            const cookingLevel = skills.find(s => s.name === SkillName.Cooking)?.currentLevel ?? 1;
            if (recipe.level && cookingLevel < recipe.level) { addLog(`You need a Cooking level of ${recipe.level} to make this.`); return; }
            if (!hasItems(recipe.ingredients)) { addLog(`You don't have the required ingredients.`); return; }
    
            setActiveCraftingAction({
                recipeId,
                recipeType: 'dough-making',
                totalQuantity: quantity,
                completedQuantity: 0,
                successfulQuantity: 0,
                startTime: Date.now(),
                duration: 200, // Very short duration
            });
        } else if (leatherRecipe) {
            const recipe = leatherRecipe;
            const craftingLevel = skills.find(s => s.name === SkillName.Crafting)?.currentLevel ?? 1;
            if (recipe.level && craftingLevel < recipe.level) { addLog(`You need a Crafting level of ${recipe.level} to make this.`); return; }

            if (recipe.requiredSkills) {
                for (const req of recipe.requiredSkills) {
                    const playerSkill = skills.find(s => s.name === req.skill);
                    if (!playerSkill || playerSkill.currentLevel < req.level) {
                        addLog(`You need a ${req.skill} level of ${req.level} to make this.`);
                        return;
                    }
                }
            }
            if (!hasItems(recipe.ingredients)) { addLog(`You don't have the required ingredients.`); return; }

            setActiveCraftingAction({
                recipeId,
                recipeType: 'crafting',
                totalQuantity: quantity,
                completedQuantity: 0,
                successfulQuantity: 0,
                startTime: Date.now(),
                duration: 1800,
            });
        } else if (jewelryRecipe) {
            const recipe = jewelryRecipe;
            const craftingLevel = skills.find(s => s.name === SkillName.Crafting)?.currentLevel ?? 1;
            if (craftingLevel < recipe.level) { addLog(`You need a Crafting level of ${recipe.level} to make this.`); return; }
            
            const requiredItems = [{ itemId: recipe.barType, quantity: recipe.barsRequired }, { itemId: recipe.mouldId, quantity: 1 }];
            if (!hasItems(requiredItems)) { addLog(`You don't have the required ingredients.`); return; }

            setActiveCraftingAction({
                recipeId,
                recipeType: 'jewelry',
                totalQuantity: quantity,
                completedQuantity: 0,
                successfulQuantity: 0,
                startTime: Date.now(),
                duration: 1800,
            });
        } else {
            addLog("You don't know how to craft that.");
        }
    }, [skills, hasItems, addLog, setActiveCraftingAction, isInCombat]);

    const handleGemCutting = useCallback((cutId: string, quantity: number = 1) => {
        if (isInCombat) { addLog("You cannot do that while in combat."); return; }
        const recipe = GEM_CUTTING_RECIPES.find(r => r.cutId === cutId);
        if (!recipe) { addLog("You don't know how to cut that gem."); return; }
        const craftingLevel = skills.find(s => s.name === SkillName.Crafting)?.currentLevel ?? 1;
        if (craftingLevel < recipe.level) { addLog(`You need a Crafting level of ${recipe.level} to do this.`); return; }
        if (!inventory.some(i => i && i.itemId === 'chisel')) { addLog("You need a chisel to cut gems."); return; }
        if (!hasItems([{ itemId: recipe.uncutId, quantity: 1}])) { addLog("You don't have any uncut gems of that type."); return; }
        
        setActiveCraftingAction({
            recipeId: cutId,
            recipeType: 'gem-cutting',
            totalQuantity: quantity,
            completedQuantity: 0,
            successfulQuantity: 0,
            startTime: Date.now(),
            duration: 1200,
            payload: { uncutId: recipe.uncutId }
        });
    }, [skills, inventory, hasItems, addLog, setActiveCraftingAction, isInCombat]);

    const handleCooking = useCallback((recipeId: string, quantity: number = 1) => {
        if (isInCombat) { addLog("You cannot do that while in combat."); return; }
        const recipe = COOKING_RECIPES.find(r => r.itemId === recipeId);
        if (!recipe) { addLog("You don't know how to cook that."); return; }
        const cookingLevel = skills.find(s => s.name === SkillName.Cooking)?.currentLevel ?? 1;
        if (cookingLevel < recipe.level) { addLog(`You need a Cooking level of ${recipe.level} to cook this.`); return; }
        if (!hasItems(recipe.ingredients)) { addLog(`You don't have the ingredients.`); return; }
        
        setActiveCraftingAction({
            recipeId,
            recipeType: 'cooking',
            totalQuantity: quantity,
            completedQuantity: 0,
            successfulQuantity: 0,
            startTime: Date.now(),
            duration: 1200,
        });

    }, [skills, hasItems, addLog, setActiveCraftingAction, isInCombat]);

    // FIX: Add 'gold_bar' to the union type for barType to allow smelting gold bars.
    const handleSmelting = useCallback((barType: 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'silver_bar' | 'gold_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar', quantity: number = 1) => {
        if (isInCombat) { addLog("You cannot do that while in combat."); return; }
        const smithingLevel = skills.find(s => s.name === SkillName.Smithing)?.currentLevel ?? 1;
        let requirements: { itemId: string; quantity: number; }[] = [];
        let levelReq = 1;

        switch(barType) {
            case 'bronze_bar': requirements = [{itemId: 'copper_ore', quantity: 1}, {itemId: 'tin_ore', quantity: 1}]; levelReq = 1; break;
            case 'iron_bar': requirements = [{itemId: 'iron_ore', quantity: 1}]; levelReq = 15; break;
            case 'silver_bar': requirements = [{itemId: 'silver_ore', quantity: 1}]; levelReq = 20; break;
            case 'steel_bar': requirements = [{itemId: 'iron_ore', quantity: 1}, {itemId: 'coal', quantity: 2}]; levelReq = 30; break;
            case 'gold_bar': requirements = [{itemId: 'gold_ore', quantity: 1}]; levelReq = 40; break;
            case 'mithril_bar': requirements = [{itemId: 'mithril_ore', quantity: 1}, {itemId: 'coal', quantity: 4}]; levelReq = 50; break;
            case 'adamantite_bar': requirements = [{itemId: 'adamantite_ore', quantity: 1}, {itemId: 'coal', quantity: 6}]; levelReq = 65; break;
            case 'runic_bar': requirements = [{itemId: 'titanium_ore', quantity: 1}, {itemId: 'coal', quantity: 8}]; levelReq = 80; break;
            default: addLog("You don't know how to smelt that."); return;
        }
        
        if (smithingLevel < levelReq) { addLog(`You need a Smithing level of ${levelReq} to smelt this.`); return; }
        if (!hasItems(requirements)) { addLog("You don't have the required ores."); return; }

        setActiveCraftingAction({
            recipeId: barType,
            recipeType: 'smithing-bar',
            totalQuantity: quantity,
            completedQuantity: 0,
            successfulQuantity: 0,
            startTime: Date.now(),
            duration: 1200,
            payload: { barType }
        });
    }, [skills, hasItems, addLog, setActiveCraftingAction, isInCombat]);
    
    const handleSmithItem = useCallback((itemId: string, quantity: number = 1) => {
        if (isInCombat) { addLog("You cannot do that while in combat."); return; }
        const recipe = SMITHING_RECIPES.find(r => r.itemId === itemId);
        if (!recipe) { addLog("You don't know how to smith that item."); return; }
        if (!inventory.some(i => i && i.itemId === 'hammer')) {
            addLog("You need a hammer to smith items at an anvil.");
            return;
        }
        const smithingLevel = skills.find(s => s.name === SkillName.Smithing)?.currentLevel ?? 1;
        if (recipe.level && smithingLevel < recipe.level) { addLog(`You need a Smithing level of ${recipe.level} to make this.`); return; }
        const requirements = [{itemId: recipe.barType, quantity: recipe.barsRequired}];
        if (!hasItems(requirements)) { addLog(`You don't have enough bars.`); return; }

        setActiveCraftingAction({
            recipeId: itemId,
            recipeType: 'smithing-item',
            totalQuantity: quantity,
            completedQuantity: 0,
            successfulQuantity: 0,
            startTime: Date.now(),
            duration: 1800,
        });
    }, [skills, hasItems, addLog, setActiveCraftingAction, inventory, isInCombat]);

    const handleFletching = useCallback((action: { type: 'carve'; payload: any }, quantity: number) => {
        if (isInCombat) { addLog("You cannot do that while in combat."); return; }
        const fletchingLevel = skills.find(s => s.name === SkillName.Fletching)?.currentLevel ?? 1;
        
        if (action.type === 'carve') {
            const { logId, outputItemId } = action.payload;
            const recipe = FLETCHING_RECIPES.carving[logId]?.find(r => r.itemId === outputItemId);
            if (!recipe) { addLog("You can't make that."); return; }
            if (recipe.level && fletchingLevel < recipe.level) { addLog(`You need a Fletching level of ${recipe.level}.`); return; }
            if (!hasItems([{ itemId: logId, quantity: 1 }])) { addLog("You don't have the required logs."); return; }
            
            let duration = 1800;
            if (recipe.itemId === 'arrow_shaft') duration = 600;

            setActiveCraftingAction({
                recipeId: outputItemId,
                recipeType: 'fletching-carve',
                totalQuantity: quantity,
                completedQuantity: 0,
                successfulQuantity: 0,
                startTime: Date.now(),
                duration,
                payload: { logId }
            });
        }
    }, [skills, hasItems, addLog, setActiveCraftingAction, isInCombat]);
    
    const handleInstantRunecrafting = useCallback((runeId: string) => {
        if (isInCombat) { addLog("You cannot do that while in combat."); return; }
        const recipe = RUNECRAFTING_RECIPES.find(r => r.runeId === runeId);
        if (!recipe) {
            addLog("You don't know how to craft that rune.");
            return;
        }
    
        const runecraftingSkill = skills.find(s => s.name === SkillName.Runecrafting);
        const runecraftingLevel = runecraftingSkill?.currentLevel ?? 1;
        if (runecraftingLevel < recipe.level) {
            addLog(`You need a Runecrafting level of ${recipe.level} to craft this.`);
            return;
        }
    
        const tiara = equipment.head ? ITEMS[equipment.head.itemId] : null;
        const hasTalismanOrTiara = inventory.some(i => i?.itemId === recipe.talismanId) || (tiara?.equipment?.runeType === recipe.runeId);
        if (!hasTalismanOrTiara) {
            addLog(`You need a ${ITEMS[recipe.talismanId].name} or a corresponding tiara to craft these runes.`);
            return;
        }
    
        const essenceCount = inventory.reduce((acc, slot) => (slot?.itemId === 'rune_essence' ? acc + slot.quantity : acc), 0);
        if (essenceCount < 1) {
            addLog("You have no rune essence to bind.");
            return;
        }
    
        // Calculation logic
        const levelDifference = runecraftingLevel - recipe.level;
        const bonusTiers = Math.floor(levelDifference / 8);
        const cappedBonusTiers = Math.min(6, bonusTiers);
        const runesPerEssence = 1 + cappedBonusTiers;
        const xpBonusPercentage = cappedBonusTiers * 0.20;
        
        const boostedXpPerEssence = recipe.xp * (1 + xpBonusPercentage);
        let totalRunesMade = essenceCount * runesPerEssence;
        const totalXpGained = Math.floor(essenceCount * boostedXpPerEssence);

        // New Binding necklace logic
        const necklace = equipment.necklace;
        if (necklace?.itemId === 'necklace_of_binding' && (necklace.charges ?? 0) > 0) {
            totalRunesMade += essenceCount; // Add one extra rune per essence
            const newCharges = (necklace.charges ?? 1) - 1;

            if (newCharges > 0) {
                setEquipment(prev => ({ ...prev, necklace: { ...necklace, charges: newCharges } }));
            } else {
                addLog("Your Necklace of Binding has run out of charges and crumbles into dust.");
                setEquipment(prev => ({ ...prev, necklace: null }));
            }
        }
        
        // Modify inventory and XP
        modifyItem('rune_essence', -essenceCount, true);
        modifyItem(recipe.runeId, totalRunesMade, true, undefined, { bypassAutoBank: true });
        addXp(SkillName.Runecrafting, totalXpGained);
    
        addLog(`You bind the essence into ${totalRunesMade} ${ITEMS[recipe.runeId].name}s.`);
    
    }, [skills, equipment, inventory, addLog, modifyItem, addXp, setEquipment, isInCombat]);

    const completeCraftingItem = useCallback((action: ActiveCraftingAction): { success: boolean; wasItemMade: boolean; logMessage?: string } => {
        let recipe: any;
        let ingredients: { itemId: string, quantity: number }[] = [];
        let product: { itemId: string, quantity: number } = { itemId: action.recipeId, quantity: 1 };
        let xp = { skill: SkillName.Crafting, amount: 0 };
        let levelReq = { skill: SkillName.Crafting, level: 1 };
        const ring = equipment.ring;

        // Special handling for Iron Bar smelting with 50% success rate
        if (action.recipeType === 'smithing-bar' && action.payload?.barType === 'iron_bar') {
            const smithingLevelCheck = skills.find(s => s.name === SkillName.Smithing)?.currentLevel ?? 1;
            if (smithingLevelCheck < 15) return { success: false, wasItemMade: false, logMessage: "Your level is too low." };
            if (!hasItems([{ itemId: 'iron_ore', quantity: 1 }])) return { success: false, wasItemMade: false, logMessage: "You ran out of ingredients." };
            
            // Consume ore regardless of success
            modifyItem('iron_ore', -1, true);
    
            if (Math.random() < 0.5) { // 50% success chance
                modifyItem('iron_bar', 1, true, undefined, { bypassAutoBank: true });
                addXp(SkillName.Smithing, 12.5); // Full XP on success
                checkQuestProgressOnSmith('iron_bar', 1);
                return { success: true, wasItemMade: true };
            } else {
                addXp(SkillName.Smithing, 2); // Consolation XP on failure
                return { success: true, wasItemMade: false, logMessage: "You failed to refine the ore and lost it in the heat." };
            }
        }

        switch(action.recipeType) {
            case 'milling': {
                if (!hasItems([{ itemId: 'wheat', quantity: 1 }])) {
                    return { success: false, wasItemMade: false, logMessage: "You ran out of wheat." };
                }
                modifyItem('wheat', -1, true);
                setWindmillFlour(f => f + 1);
                return { success: true, wasItemMade: true };
            }
            case 'dough-making':
                recipe = DOUGH_RECIPES.find(r => r.itemId === action.recipeId);
                if (recipe) {
                    ingredients = recipe.ingredients;
                    xp = { skill: SkillName.Cooking, amount: recipe.xp };
                    levelReq = { skill: SkillName.Cooking, level: recipe.level };
                }
                break;
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
                    modifyItem('ashes', 1, false, undefined, { bypassAutoBank: true });
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
                    if (ITEMS[action.recipeId].stackable) {
                        product.quantity = 15;
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
             case 'fletching-string':
                recipe = FLETCHING_RECIPES.stringing.find(r => r.strungId === action.recipeId);
                if (recipe) {
                    ingredients = [{itemId: 'bow_string', quantity: 1}, {itemId: recipe.unstrungId, quantity: 1}];
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
                    modifyItem(recipe.itemId, 1, true, undefined, { bypassAutoBank: true });
                    addXp(SkillName.Cooking, recipe.xp);
                } else {
                    modifyItem(recipe.burntItemId, 1, true, undefined, { bypassAutoBank: true });
                    addXp(SkillName.Cooking, 5); // Small XP for trying
                }
                return { success: true, wasItemMade: true };
            }
        }

        const skillLevel = skills.find(s => s.name === levelReq.skill)?.currentLevel ?? 1;
        if (skillLevel < levelReq.level) return { success: false, wasItemMade: false, logMessage: "Your level is too low." };

        const completedRecipe = CRAFTING_RECIPES.find(r => r.itemId === action.recipeId) || SPINNING_RECIPES.find(r => r.itemId === action.recipeId);
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

        // Account for empty containers being returned
        for (const ing of ingredients) {
            const itemData = ITEMS[ing.itemId];
            if (itemData?.emptyable) {
                const isMakingFinishedPotion = action.recipeType === 'herblore-finished';
                const isUnfinishedPotionIngredient = itemData.id.endsWith('_unf');

                if (!(isMakingFinishedPotion && isUnfinishedPotionIngredient)) {
                    const emptyItemData = ITEMS[itemData.emptyable.emptyItemId];
                    if (emptyItemData.stackable) {
                        // It only takes a new slot if there isn't a stack already
                        if (!inventory.some(s => s && s.itemId === emptyItemData.id)) {
                            slotsGained++;
                        }
                    } else {
                        // Not stackable, so each one takes a slot
                        slotsGained += ing.quantity;
                    }
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

                    // Special check for Herblore: don't return an empty vial from an unfinished potion
                    const isMakingFinishedPotion = action.recipeType === 'herblore-finished';
                    const isUnfinishedPotionIngredient = itemData.id.endsWith('_unf');

                    if (itemData?.emptyable && !(isMakingFinishedPotion && isUnfinishedPotionIngredient)) {
                        modifyItem(itemData.emptyable.emptyItemId, ing.quantity, true, undefined, { bypassAutoBank: true });
                    }
                }
            });
        }
        
        modifyItem(product.itemId, product.quantity, true, productData.initialDoses, { bypassAutoBank: true });

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
    }, [hasItems, modifyItem, addXp, inventory, checkQuestProgressOnSpin, checkQuestProgressOnSmith, advanceTutorial, closeCraftingView, setWindmillFlour, equipment, skills, setEquipment, setWorldState, onCreateBonfire, onRefreshBonfire]);

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
                    // This was a failure to light, so we just try again
                    nextAction.startTime = Date.now();
                    setActiveCraftingAction(nextAction);
                    return; // Return to re-trigger the effect with the new startTime
                } else {
                    // Other actions that "fail" but still consume items (like burning food or failing to smelt iron) still count as a completed attempt.
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
                    return; // Early return for special case
                }

                const finalItem = ITEMS[nextAction.recipeId];
                const successfulCount = nextAction.successfulQuantity ?? 0;
                
                if (activeCraftingAction.recipeType !== 'firemaking-light') {
                    if (successfulCount > 0) {
                        let totalItemsMade = successfulCount;
                        const action = activeCraftingAction;

                        // Check for recipes that produce items in batches of 15
                        if (
                            (action.recipeType === 'fletching-carve' && action.recipeId === 'arrow_shaft') ||
                            action.recipeType === 'fletching-headless' ||
                            action.recipeType === 'fletching-tip' ||
                            (action.recipeType === 'smithing-item' && action.recipeId.endsWith('_arrowtips'))
                        ) {
                            totalItemsMade *= 15;
                        }

                        const quantityText = (finalItem.doseable && finalItem.initialDoses && finalItem.initialDoses > 1) ? "" : `${totalItemsMade.toLocaleString()}x `;
                        const logMessageText = (finalItem.doseable && finalItem.initialDoses && finalItem.initialDoses > 1 && successfulCount === 1) ? `You finished making a ${finalItem.name}.` : `You finished making ${quantityText}${finalItem.name}.`;
                        addLog(logMessageText);
                    } else if (activeCraftingAction.recipeType !== 'dough-making' && activeCraftingAction.recipeType !== 'firemaking-stoke') { // Don't log failure for instant/continuous actions
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

    return {
        handleCrafting,
        handleSpinning,
        handleCooking,
        handleSmelting,
        handleSmithItem,
        handleFletching,
        handleGemCutting,
        handleInstantRunecrafting,
        handleStokeBonfire,
    };
};