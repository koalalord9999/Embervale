

import React, { useCallback } from 'react';
import { POIActivity, SkillName, InventorySlot, PlayerSkill, SkillRequirement, PlayerQuestState } from '../types';
import { ITEMS, INVENTORY_CAPACITY } from '../constants';
import { MakeXPrompt } from './useUIState';

interface UseWorldActionsProps {
    hasItems: (items: { itemId: string; quantity: number }[]) => boolean;
    inventory: (InventorySlot | null)[];
    modifyItem: (itemId: string, quantity: number, quiet?: boolean) => void;
    addLog: (message: string) => void;
    coins: number;
    skills: PlayerSkill[];
    addXp: (skill: SkillName, amount: number) => void;
    setClearedSkillObstacles: React.Dispatch<React.SetStateAction<string[]>>;
    playerQuests: PlayerQuestState[];
    checkQuestProgressOnShear: () => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
}

export const useWorldActions = (props: UseWorldActionsProps) => {
    const { hasItems, inventory, modifyItem, addLog, coins, skills, addXp, setClearedSkillObstacles, playerQuests, checkQuestProgressOnShear, setMakeXPrompt } = props;

    const handleSimpleSkilling = useCallback((activity: Extract<POIActivity, { type: 'shearing' | 'egg_collecting' }>) => {
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
            modifyItem(activity.loot.itemId, 1);
            if (activity.type === 'shearing') {
                checkQuestProgressOnShear();
            }
        }
    }, [inventory, modifyItem, addLog, checkQuestProgressOnShear, hasItems]);

    const handleInstantTanning = useCallback((quantity: number) => {
        if (quantity <= 0) return;
        const cost = quantity * 5;
        if (coins < cost) {
            addLog("You don't have enough coins to tan that many hides.");
            return;
        }
        if (!hasItems([{ itemId: 'cowhide', quantity }])) {
            addLog("You don't have enough cowhides to tan.");
            return;
        }

        modifyItem('coins', -cost);
        modifyItem('cowhide', -quantity);
        modifyItem('leather', quantity);
        addLog(`You pay Sven ${cost} coins to tan ${quantity} cowhides into leather.`);
    }, [coins, hasItems, modifyItem, addLog]);

    const handleWishingWell = useCallback(() => {
        if (coins < 1) { addLog("You need a coin to toss into the well."); return; }
        modifyItem('coins', -1);
        addLog("You toss a coin into the well and make a wish.");

        const hasPrize = playerQuests.some(q => q.questId === 'ancient_blade' && q.isComplete) || hasItems([{itemId: 'rusty_iron_sword', quantity: 1}]) || hasItems([{itemId: 'iron_sword', quantity: 1}]);
        if (hasPrize) { addLog("The well remains silent. It seems it has already given you all it can."); return; }

        if (Math.random() <= 1 / 1000) {
            addLog("You hear a faint clink from the bottom of the well... something is different.");
            modifyItem('rusty_iron_sword', 1);
        } else {
            addLog("The coin disappears into the depths with a faint splash.");
        }
    }, [hasItems, modifyItem, addLog, playerQuests, coins]);

    const handleClearObstacle = useCallback((fromPoiId: string, toPoiId: string, requirement: SkillRequirement) => {
        const skill = skills.find(s => s.name === requirement.skill);
        if (!skill || skill.level < requirement.level) {
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

    const handleFillVials = useCallback(() => {
        const emptyVialCount = inventory.reduce((total, slot) => {
            return slot && slot.itemId === 'vial' ? total + slot.quantity : total;
        }, 0);

        if (emptyVialCount === 0) {
            addLog("You don't have any empty vials to fill.");
            return;
        }

        setMakeXPrompt({
            title: 'Fill Vials',
            max: emptyVialCount,
            onConfirm: (quantity) => {
                if (quantity > 0) {
                    modifyItem('vial', -quantity, true);
                    modifyItem('vial_of_water', quantity);
                    addLog(`You fill ${quantity} vial${quantity > 1 ? 's' : ''} with water.`);
                }
            }
        });
    }, [inventory, addLog, modifyItem, setMakeXPrompt]);
    
    return {
        handleSimpleSkilling,
        handleInstantTanning,
        handleWishingWell,
        handleClearObstacle,
        handleFillVials,
    };
};