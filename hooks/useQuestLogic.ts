


import React, { useCallback } from 'react';
import { PlayerQuestState, SkillName } from '../types';
import { ITEMS, MONSTERS } from '../constants';
import { QUESTS } from '../constants';
import { POIS } from '../data/pois';

interface UseQuestLogicProps {
    playerQuests: PlayerQuestState[];
    setPlayerQuests: React.Dispatch<React.SetStateAction<PlayerQuestState[]>>;
    addLog: (message: string) => void;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, doses?: number, options?: { noted?: boolean; bypassAutoBank?: boolean }) => void;
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
    
    const checkQuestProgressOnSmith = useCallback((itemId: string, quantity: number) => {
        setPlayerQuests(qs => qs.map(q => {
            const questData = QUESTS[q.questId];
            if (!q.isComplete && questData && questData.stages[q.currentStage]) {
                const stage = questData.stages[q.currentStage];
                if (stage?.requirement.type === 'smith' && stage.requirement.itemId === itemId) {
                    const newProgress = q.progress + quantity;
                    if (newProgress >= stage.requirement.quantity) {
                        addLog(`Quest updated: ${questData.name} - stage completed!`);
                        return { ...q, currentStage: q.currentStage + 1, progress: 0 };
                    }
                    addLog(`Quest progress: Smithed ${newProgress}/${stage.requirement.quantity} ${ITEMS[itemId].name}.`);
                    return { ...q, progress: newProgress };
                }
            }
            return q;
        }));
    }, [setPlayerQuests, addLog]);

    const checkQuestProgressOnKill = useCallback((monsterId: string, attackStyle?: 'melee' | 'ranged' | 'magic') => {
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
                if (stage.requirement.style && stage.requirement.style !== attackStyle) {
                    addLog(`You must defeat this enemy using a ${stage.requirement.style} attack for your quest.`);
                    return q; // Return original quest state without progressing
                }
                const newProgress = q.progress + 1;
                if (newProgress >= stage.requirement.quantity) {
                    stageCompleted = true;
                } else {
                    updatedQuest.progress = newProgress;
                }
            }
            // Handle 'gather' requirements that can be fulfilled by monster drops
            else if (stage?.requirement.type === 'gather') {
                const req = stage.requirement as any;
                const itemsToGather = req.items || [{ itemId: req.itemId, quantity: req.quantity }];

                const requiredItemId = itemsToGather.find((item: any) => {
                     const allDrops = [...(monster.guaranteedDrops || []), ...(monster.mainDrops || []), ...(monster.tertiaryDrops || [])];
                     return allDrops.some(drop => drop.itemId === item.itemId);
                });
               
                if (requiredItemId && hasItems(itemsToGather)) {
                    stageCompleted = true;
                }
            }
    
            if (stageCompleted) {
                addLog(`Quest updated: ${questData.name} - stage completed!`);
                const isFinalStage = q.currentStage >= questData.stages.length - 1;
    
                if (isFinalStage) {
                    addLog(`Congratulations! You have completed the quest: ${questData.name}!`);
                    const rewards = questData.rewards;
                    if (rewards.coins) modifyItem('coins', rewards.coins);
                    rewards.items?.forEach(item => modifyItem(item.itemId, item.quantity, false, item.doses, { bypassAutoBank: true }));
                    rewards.xp?.forEach(xpReward => addXp(xpReward.skill, xpReward.amount));
                    return { ...updatedQuest, isComplete: true };
                } else {
                    return { ...updatedQuest, currentStage: q.currentStage + 1, progress: 0 };
                }
            }
    
            return updatedQuest;
        }));
    }, [setPlayerQuests, addLog, modifyItem, addXp, hasItems]);

    const checkGatherQuests = useCallback(() => {
        setPlayerQuests(qs => {
            const newQuests = qs.map(q => {
                if (q.isComplete) return q;
                const questData = QUESTS[q.questId];
                if (!questData || !questData.stages[q.currentStage]) return q;

                const stage = questData.stages[q.currentStage];
                if (stage?.requirement.type === 'gather') {
                    
                    const req = stage.requirement as any;
                    const itemsToGather = req.items || [{ itemId: req.itemId, quantity: req.quantity }];
                    
                    if (hasItems(itemsToGather)) {
                        addLog(`Quest updated: ${questData.name} - stage completed!`);
                        return { ...q, currentStage: q.currentStage + 1, progress: 0 };
                    }
                }
                return q;
            });
            if (JSON.stringify(qs) === JSON.stringify(newQuests)) {
                return qs;
            }
            return newQuests;
        });
    }, [hasItems, addLog, setPlayerQuests]);
    
    const completeQuestStage = useCallback((questId: string) => {
        setPlayerQuests(qs => qs.map(q => {
            if(q.questId === questId && !q.isComplete) {
                const questData = QUESTS[q.questId];
                const currentStageIndex = q.currentStage;
                const currentStage = questData.stages[currentStageIndex];
                
                if (currentStage?.requirement.type === 'gather') {
                    const req = currentStage.requirement as any; // Cast to handle new multi-item format
                    const itemsToGather = req.items || [{ itemId: req.itemId, quantity: req.quantity }];

                     if (!hasItems(itemsToGather)) {
                        addLog(`You still need to gather all the required items.`);
                        return q;
                    }
                    itemsToGather.forEach((item: { itemId: string, quantity: number }) => {
                        modifyItem(item.itemId, -item.quantity);
                    });
                }
                
                if (currentStage?.stageRewards) {
                    const rewards = currentStage.stageRewards;
                    if (rewards.coins) {
                        modifyItem('coins', rewards.coins);
                        addLog(`You received ${rewards.coins} coins.`);
                    }
                    rewards.items?.forEach(item => {
                        modifyItem(item.itemId, item.quantity, false, item.doses, { bypassAutoBank: true });
                        addLog(`You received ${item.quantity}x ${ITEMS[item.itemId].name}.`);
                    });
                    rewards.xp?.forEach(xpReward => {
                        addXp(xpReward.skill, xpReward.amount);
                        addLog(`You gained ${xpReward.amount} ${xpReward.skill} XP.`);
                    });
                }

                const nextStageIndex = q.currentStage + 1;
                Object.values(POIS).forEach(poi => {
                    if (poi.unlockRequirement?.type === 'quest' && poi.unlockRequirement.questId === questId && poi.unlockRequirement.stage <= nextStageIndex) {
                        setLockedPois(prev => {
                            if (prev.includes(poi.id)) {
                                addLog(`You have unlocked ${poi.name}!`);
                                return prev.filter(id => id !== poi.id);
                            }
                            return prev;
                        });
                    }
                });

                const isCompletingFinalStage = q.currentStage >= questData.stages.length - 1;

                if(isCompletingFinalStage) {
                    addLog(`Congratulations! You have completed the quest: ${questData.name}!`);
                    const rewards = questData.rewards;
                    if(rewards.coins) modifyItem('coins', rewards.coins);
                    rewards.items?.forEach(item => modifyItem(item.itemId, item.quantity, false, item.doses, { bypassAutoBank: true }));
                    rewards.xp?.forEach(xpReward => addXp(xpReward.skill, xpReward.amount));
                    
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
                    return {...q, isComplete: true};
                }
                addLog(`Quest updated: ${questData.name} - stage completed!`);
                return { ...q, currentStage: q.currentStage + 1, progress: 0 };
            }
            return q;
        }))
    }, [setPlayerQuests, modifyItem, addXp, setLockedPois, addLog, hasItems, setClearedSkillObstacles]);

    const forceCompleteQuest = useCallback((questId: string) => {
        const questData = QUESTS[questId];
        if (!questData) {
            addLog(`Error: Could not find quest data for ${questId}`);
            return;
        }
    
        setPlayerQuests(qs => {
            const questIndex = qs.findIndex(q => q.questId === questId);
            const newQuests = [...qs];
            
            if (questIndex > -1) {
                newQuests[questIndex] = { ...newQuests[questIndex], currentStage: questData.stages.length, isComplete: true };
            } else {
                newQuests.push({ questId, currentStage: questData.stages.length, progress: 0, isComplete: true });
            }
            return newQuests;
        });
    
        addLog(`Quest completed: ${questData.name}!`);
        if (questId === 'embrune_101') {
            return;
        }

        const rewards = questData.rewards;
        if (rewards.coins) modifyItem('coins', rewards.coins);
        rewards.items?.forEach(item => modifyItem(item.itemId, item.quantity, false, item.doses, { bypassAutoBank: true }));
        rewards.xp?.forEach(xpReward => addXp(xpReward.skill, xpReward.amount));
    
        Object.values(POIS).forEach(poi => {
            if (poi.unlockRequirement?.type === 'quest' && poi.unlockRequirement.questId === questId) {
                setLockedPois(prev => {
                    if (prev.includes(poi.id)) {
                        addLog(`You have unlocked ${poi.name}!`);
                        return prev.filter(id => id !== poi.id);
                    }
                    return prev;
                });
            }
        });
    
        if (questData.id === 'capitals_call') {
            setClearedSkillObstacles(prev => [...new Set([...prev, 'broken_bridge-kings_road_west_2'])]);
            addLog("With the supplies delivered, the Oakhaven guard repairs the bridge. The path to Silverhaven is open!");
        }
    }, [setPlayerQuests, addLog, modifyItem, addXp, setLockedPois, setClearedSkillObstacles]);

    return {
        checkQuestProgressOnShear,
        checkQuestProgressOnSpin,
        checkQuestProgressOnKill,
        checkQuestProgressOnSmith,
        completeQuestStage,
        checkGatherQuests,
        forceCompleteQuest,
    };
};