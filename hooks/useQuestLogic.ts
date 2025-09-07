

import React, { useCallback } from 'react';
import { PlayerQuestState, SkillName } from '../types';
import { QUESTS, ITEMS, MONSTERS } from '../constants';
import { POIS } from '../data/pois';

interface UseQuestLogicProps {
    playerQuests: PlayerQuestState[];
    setPlayerQuests: React.Dispatch<React.SetStateAction<PlayerQuestState[]>>;
    addLog: (message: string) => void;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean) => void;
    addXp: (skill: SkillName, amount: number) => void;
    hasItems: (items: { itemId: string, quantity: number }[]) => boolean;
    setLockedPois: React.Dispatch<React.SetStateAction<string[]>>;
    setClearedSkillObstacles: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useQuestLogic = (props: UseQuestLogicProps) => {
    const { playerQuests, setPlayerQuests, addLog, modifyItem, addXp, hasItems, setLockedPois, setClearedSkillObstacles } = props;

    const checkQuestProgressOnShear = useCallback(() => {
        setPlayerQuests(qs => qs.map(q => {
            const questData = QUESTS[q.questId];
            if (!q.isComplete && questData && questData.stages[q.currentStage]) {
                const stage = questData.stages[q.currentStage];
                if (stage?.requirement.type === 'shear') {
                    const newProgress = q.progress + 1;
                    if (newProgress >= stage.requirement.quantity) {
                        addLog(`Quest updated: ${questData.name} - stage completed!`);
                        return { ...q, currentStage: q.currentStage + 1, progress: 0 };
                    }
                    return { ...q, progress: newProgress };
                }
            }
            return q;
        }));
    }, [setPlayerQuests, addLog]);

    const checkQuestProgressOnSpin = useCallback((itemId: string, quantity: number) => {
        if (itemId !== 'ball_of_wool') return;
        setPlayerQuests(qs => qs.map(q => {
            const questData = QUESTS[q.questId];
            if (!q.isComplete && questData && questData.stages[q.currentStage]) {
                const stage = questData.stages[q.currentStage];
                if (stage?.requirement.type === 'spin') {
                    const newProgress = q.progress + quantity;
                    if (newProgress >= stage.requirement.quantity) {
                        addLog(`Quest updated: ${questData.name} - stage completed!`);
                        return { ...q, currentStage: q.currentStage + 1, progress: 0 };
                    }
                    addLog(`Quest progress: Spun ${newProgress}/${stage.requirement.quantity} balls of wool.`);
                    return { ...q, progress: newProgress };
                }
            }
            return q;
        }));
    }, [setPlayerQuests, addLog]);

    const checkQuestProgressOnKill = useCallback((monsterId: string) => {
        const monster = MONSTERS[monsterId];
        if (!monster) return;

        setPlayerQuests(qs => qs.map(q => {
            if (q.isComplete) return q;
            const questData = QUESTS[q.questId];
            if (!questData || !questData.stages[q.currentStage]) return q;
    
            const stage = questData.stages[q.currentStage];
            let updatedQuest = { ...q };
            let stageCompleted = false;
    
            // Handle 'kill' requirements
            if (stage?.requirement.type === 'kill' && stage.requirement.monsterId === monsterId) {
                const newProgress = q.progress + 1;
                if (newProgress >= stage.requirement.quantity) {
                    stageCompleted = true;
                } else {
                    updatedQuest.progress = newProgress;
                }
            }
            // Handle 'gather' requirements that can be fulfilled by monster drops
            else if (stage?.requirement.type === 'gather') {
                const requiredItemId = stage.requirement.itemId;
                if (monster.drops.some(drop => drop.itemId === requiredItemId)) {
                    // hasItems check is performed after loot is added, so it reflects the new state
                    if (hasItems([{ itemId: requiredItemId, quantity: stage.requirement.quantity }])) {
                        stageCompleted = true;
                    }
                }
            }
    
            if (stageCompleted) {
                addLog(`Quest updated: ${questData.name} - stage completed!`);
                const isFinalStage = q.currentStage >= questData.stages.length - 1;
    
                if (isFinalStage) {
                    addLog(`Congratulations! You have completed the quest: ${questData.name}!`);
                    const rewards = questData.rewards;
                    if (rewards.coins) modifyItem('coins', rewards.coins);
                    rewards.items?.forEach(item => modifyItem(item.itemId, item.quantity));
                    rewards.xp?.forEach(xpReward => addXp(xpReward.skill, xpReward.amount));
                    return { ...updatedQuest, isComplete: true };
                } else {
                    return { ...updatedQuest, currentStage: q.currentStage + 1, progress: 0 };
                }
            }
    
            return updatedQuest;
        }));
    }, [setPlayerQuests, addLog, modifyItem, addXp, hasItems]);
    
    const completeQuestStage = useCallback((questId: string) => {
        setPlayerQuests(qs => qs.map(q => {
            if(q.questId === questId && !q.isComplete) {
                const questData = QUESTS[q.questId];
                const currentStageIndex = q.currentStage;
                const currentStage = questData.stages[currentStageIndex];
                
                if (currentStage.requirement.type === 'gather') {
                     if (!hasItems([{ itemId: currentStage.requirement.itemId, quantity: currentStage.requirement.quantity }])) {
                        addLog(`You still need to gather ${currentStage.requirement.quantity} ${ITEMS[currentStage.requirement.itemId].name}.`);
                        return q;
                    }
                    modifyItem(currentStage.requirement.itemId, -currentStage.requirement.quantity);
                }
                
                const isCompletingFinalStage = q.currentStage >= questData.stages.length - 1;

                if(isCompletingFinalStage) {
                    addLog(`Congratulations! You have completed the quest: ${questData.name}!`);
                    const rewards = questData.rewards;
                    if(rewards.coins) modifyItem('coins', rewards.coins);
                    rewards.items?.forEach(item => modifyItem(item.itemId, item.quantity));
                    rewards.xp?.forEach(xpReward => addXp(xpReward.skill, xpReward.amount));
                    Object.values(POIS).forEach(poi => {
                        if (poi.unlockRequirement?.type === 'quest' && poi.unlockRequirement.questId === questId && poi.unlockRequirement.stage <= q.currentStage +1) {
                            setLockedPois(prev => prev.filter(id => id !== poi.id));
                            addLog(`You have unlocked ${poi.name}!`);
                        }
                    });
                     // Special quest logic
                    if (questData.id === 'capitals_call') {
                        setClearedSkillObstacles(prev => [...prev, 'broken_bridge-kings_road_west_2']);
                        addLog("With the supplies delivered, the Oakhaven guard repairs the bridge. The path to Silverhaven is open!");
                    }
                    if (questData.id === 'lost_heirloom') {
                        modifyItem('lost_heirloom', -1);
                    }
                    if (questData.id === 'missing_shipment') {
                        modifyItem('stolen_caravan_goods', -1);
                    }
                    if (questData.id === 'a_pinch_of_trouble') {
                        modifyItem('giant_crab_claw', -1);
                    }
                    return {...q, isComplete: true};
                }
                addLog(`Quest updated: ${questData.name} - stage completed!`);
                return { ...q, currentStage: q.currentStage + 1, progress: 0 };
            }
            return q;
        }))
    }, [setPlayerQuests, modifyItem, addXp, setLockedPois, addLog, hasItems, setClearedSkillObstacles]);

    return {
        checkQuestProgressOnShear,
        checkQuestProgressOnSpin,
        checkQuestProgressOnKill,
        completeQuestStage,
    };
};