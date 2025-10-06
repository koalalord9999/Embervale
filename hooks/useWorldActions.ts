import React, { useCallback } from 'react';
import { POIActivity, SkillName, InventorySlot, PlayerSkill, SkillRequirement, PlayerQuestState, ActiveCraftingAction, WorldState } from '../types';
import { ITEMS, INVENTORY_CAPACITY, rollOnLootTable, LootRollResult, FIREMAKING_RECIPES } from '../constants';
import { POIS } from '../data/pois';
import { MakeXPrompt } from './useUIState';

interface UseWorldActionsProps {
    hasItems: (items: { itemId: string; quantity: number }[]) => boolean;
    inventory: (InventorySlot | null)[];
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, doses?: number, options?: { noted?: boolean; bypassAutoBank?: boolean }) => void;
    addLog: (message: string) => void;
    coins: number;
    skills: (PlayerSkill & { currentLevel: number; })[];
    addXp: (skill: SkillName, amount: number) => void;
    setClearedSkillObstacles: React.Dispatch<React.SetStateAction<string[]>>;
    playerQuests: PlayerQuestState[];
    checkQuestProgressOnShear: () => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    windmillFlour: number;
    setWindmillFlour: React.Dispatch<React.SetStateAction<number>>;
    setActiveCraftingAction: (action: ActiveCraftingAction | null) => void;
}

export const useWorldActions = (props: UseWorldActionsProps) => {
    const { hasItems, inventory, modifyItem, addLog, coins, skills, addXp, setClearedSkillObstacles, playerQuests, checkQuestProgressOnShear, setMakeXPrompt, windmillFlour, setWindmillFlour, setActiveCraftingAction } = props;

    const handleSimpleSkilling = useCallback((activity: Extract<POIActivity, { type: 'shearing' }>) => {
        if (activity.type === 'shearing') {
            if (!hasItems([{ itemId: 'shears', quantity: 1 }])) {
                addLog("You need a pair of shears to shear sheep.");
                return;
            }
        }
        if (inventory.filter(Boolean).length >= INVENTORY_CAPACITY) {
            addLog("Your inventory is full.");
            return;
        }
        if (activity.loot) {
            modifyItem(activity.loot.itemId, 1, false, undefined, { bypassAutoBank: true });
            if (activity.type === 'shearing') {
                checkQuestProgressOnShear();
            }
        }
    }, [inventory, modifyItem, addLog, checkQuestProgressOnShear, hasItems]);

    const handleMilking = useCallback(() => {
        if (!hasItems([{ itemId: 'bucket', quantity: 1 }])) {
            addLog("You need an empty bucket to milk a cow.");
            return;
        }
        modifyItem('bucket', -1, true);
        modifyItem('bucket_of_milk', 1, false, undefined, { bypassAutoBank: true });
        addLog("You milk the cow and fill your bucket.");
    }, [hasItems, modifyItem, addLog]);

    const handleTanning = useCallback((inputId: string, outputId: string, cost: number, quantity: number) => {
        if (quantity <= 0) return;
        const totalCost = quantity * cost;
        const inputItemName = ITEMS[inputId]?.name ?? 'hides';
        const outputItemName = ITEMS[outputId]?.name ?? 'leather';

        if (coins < totalCost) {
            addLog("You don't have enough coins to tan that many.");
            return;
        }
        if (!hasItems([{ itemId: inputId, quantity }])) {
            addLog(`You don't have enough ${inputItemName}.`);
            return;
        }

        modifyItem('coins', -totalCost);
        modifyItem(inputId, -quantity);
        modifyItem(outputId, quantity, false, undefined, { bypassAutoBank: true });
        addLog(`You pay the tanner ${totalCost} coins to turn ${quantity} ${inputItemName} into ${outputItemName}.`);
    }, [coins, hasItems, modifyItem, addLog]);

    const handleWishingWell = useCallback(() => {
        if (coins < 1) { addLog("You need a coin to toss into the well."); return; }
        modifyItem('coins', -1);
        addLog("You toss a coin into the well and make a wish.");

        const hasPrize = playerQuests.some(q => q.questId === 'ancient_blade' && q.isComplete) || hasItems([{itemId: 'rusty_iron_sword', quantity: 1}]) || hasItems([{itemId: 'iron_sword', quantity: 1}]);
        if (hasPrize) { addLog("The well remains silent. It seems it has already given you all it can."); return; }

        if (Math.random() <= 1 / 1000) {
            addLog("You hear a faint clink from the bottom of the well... something is different.");
            modifyItem('rusty_iron_sword', 1, false, undefined, { bypassAutoBank: true });
        } else {
            addLog("The coin disappears into the depths with a faint splash.");
        }
    }, [hasItems, modifyItem, addLog, playerQuests, coins]);

    const handleClearObstacle = useCallback((fromPoiId: string, toPoiId: string, requirement: SkillRequirement) => {
        const skill = skills.find(s => s.name === requirement.skill);
        if (!skill || skill.currentLevel < requirement.level) {
            addLog(`You need a ${requirement.skill} level of ${requirement.level} to clear this.`);
            return;
        }

        if (requirement.items) {
            if (!hasItems(requirement.items)) {
                addLog("You don't have the required items to do this.");
                return;
            }
            requirement.items.forEach(item => modifyItem(item.itemId, -item.quantity));
        }

        addXp(requirement.skill, requirement.xp);
        addLog(`You use your ${requirement.skill} skill to clear the path! (+${requirement.xp} XP)`);
        
        const obstacleId = `${fromPoiId}-${toPoiId}`;
        setClearedSkillObstacles(prev => [...prev, obstacleId]);

    }, [skills, addXp, setClearedSkillObstacles, addLog, hasItems, modifyItem]);

    const handleCollectWater = useCallback(() => {
        const vialCount = inventory.reduce((total, slot) => slot?.itemId === 'vial' ? total + slot.quantity : total, 0);
        const bucketCount = inventory.filter(slot => slot?.itemId === 'bucket').length;
        const totalContainers = vialCount + bucketCount;
    
        if (totalContainers === 0) {
            addLog("You don't have any empty containers to fill with water.");
            return;
        }
    
        const onConfirm = (quantity: number) => {
            if (quantity <= 0) return;
    
            const vialsToFill = Math.min(quantity, vialCount);
            const bucketsToFill = Math.min(quantity - vialsToFill, bucketCount);
            
            if (vialsToFill > 0) {
                modifyItem('vial', -vialsToFill, true);
                modifyItem('vial_of_water', vialsToFill, true, undefined, { bypassAutoBank: true });
            }
            if (bucketsToFill > 0) {
                modifyItem('bucket', -bucketsToFill, true);
                modifyItem('bucket_of_water', bucketsToFill, true, undefined, { bypassAutoBank: true }); 
            }
    
            const logParts = [];
            if (vialsToFill > 0) logParts.push(`${vialsToFill} vial${vialsToFill > 1 ? 's' : ''}`);
            if (bucketsToFill > 0) logParts.push(`${bucketsToFill} bucket${bucketsToFill > 1 ? 's' : ''}`);
    
            if (logParts.length > 0) {
                addLog(`You fill ${logParts.join(' and ')} with water.`);
            }
        };

        if (totalContainers === 1) {
            onConfirm(1);
        } else {
            setMakeXPrompt({
                title: 'Collect Water',
                max: totalContainers,
                onConfirm
            });
        }
    }, [inventory, addLog, modifyItem, setMakeXPrompt]);
    
    const handleCollectFlour = useCallback(() => {
        if (windmillFlour <= 0) {
            addLog("The windmill's hopper is empty. You need to mill some wheat first.");
            return;
        }
        setWindmillFlour(f => f - 1);
        modifyItem('flour', 1, false, undefined, { bypassAutoBank: true });
        addLog("You collect some flour from the hopper.");
    }, [windmillFlour, addLog, hasItems, setWindmillFlour, modifyItem]);

    const handleMillWheat = useCallback(() => {
        const wheatCount = inventory.reduce((total, slot) => slot?.itemId === 'wheat' ? total + slot.quantity : total, 0);
        if (wheatCount === 0) {
            addLog("You have no wheat to mill.");
            return;
        }
        
        const onConfirm = (quantity: number) => {
            if (quantity > 0) {
                addLog("You add the wheat to the hopper and start the windmill.");
                setActiveCraftingAction({
                    recipeId: 'flour',
                    recipeType: 'milling',
                    totalQuantity: quantity,
                    completedQuantity: 0,
                    successfulQuantity: 0,
                    startTime: Date.now(),
                    duration: 600,
                });
            }
        };

        if (wheatCount === 1) {
            onConfirm(1);
        } else {
            setMakeXPrompt({
                title: 'Mill Wheat',
                max: wheatCount,
                onConfirm
            });
        }
    }, [inventory, addLog, setMakeXPrompt, setActiveCraftingAction]);

    const handleOpenAncientChest = useCallback(() => {
        if (!hasItems([{ itemId: 'strange_key', quantity: 1 }])) {
            addLog("The chest is locked. It seems to require a strange, ornate key.");
            return;
        }

        const freeSlots = inventory.filter(s => s === null).length;
        if (freeSlots < 4) {
            addLog("You need at least 5 free inventory slots to open this chest.");
            return;
        }

        modifyItem('strange_key', -1, true);
        addLog("You insert the strange key into the ancient chest... it clicks open!");

        const randomHighGem = Math.random() < 0.75 ? 'uncut_ruby' : 'uncut_diamond';
        modifyItem(randomHighGem, 1, false, undefined, { bypassAutoBank: true });
        
        const highRunes = ['nexus_rune', 'anima_rune', 'aether_rune', 'passage_rune'];
        for (let i = 0; i < 5; i++) {
            const rune = highRunes[Math.floor(Math.random() * highRunes.length)];
            const quantity = Math.floor(Math.random() * 21) + 10;
            modifyItem(rune, quantity, true, undefined, { bypassAutoBank: true });
        }
        
        modifyItem('coins', Math.floor(Math.random() * 10001) + 5000, true);

        if (Math.random() < 0.5) {
            modifyItem('adamantite_bar', Math.floor(Math.random() * 3) + 1, true, undefined, { bypassAutoBank: true });
        }
        if (Math.random() < 0.25) {
            modifyItem('runic_bar', Math.floor(Math.random() * 2) + 1, true, undefined, { bypassAutoBank: true });
        }
        
        if (Math.random() < 0.01) {
            const aquatiteGear = ['aquatite_sword', 'aquatite_kiteshield', 'aquatite_platebody', 'aquatite_platelegs', 'aquatite_full_helm'];
            const randomPiece = aquatiteGear[Math.floor(Math.random() * aquatiteGear.length)];
            modifyItem(randomPiece, 1, false, undefined, { bypassAutoBank: true });
            addLog("Incredibly lucky! You found a piece of Aquatite armor inside!");
        }
        addLog(`You find a pile of loot inside the chest!`);

    }, [hasItems, modifyItem, addLog, inventory]);

    return {
        handleSimpleSkilling,
        handleMilking,
        handleTanning,
        handleWishingWell,
        handleClearObstacle,
        handleCollectWater,
        handleCollectFlour,
        handleMillWheat,
        handleOpenAncientChest,
    };
};
