import React, { useCallback } from 'react';
import { POIActivity, PlayerQuestState, DialogueNode, Quest, DialogueResponse } from '../types';
import { QUESTS } from '../constants';
import { DialogueState, useUIState } from './useUIState';

interface SceneInteractionDependencies {
    playerQuests: PlayerQuestState[];
    startQuest: (questId: string, addLog: (message: string) => void) => void;
    hasItems: (items: { itemId: string; quantity: number }[]) => boolean;
    addLog: (message: string) => void;
    onActivity: (activity: POIActivity) => void;
    setActiveDialogue: React.Dispatch<React.SetStateAction<DialogueState | null>>;
    tutorialStage: number;
    advanceTutorial: (condition: string) => void;
    handleDialogueAction: (action: any) => boolean;
}

export const useSceneInteractions = (poiId: string, deps: SceneInteractionDependencies) => {
    const { playerQuests, startQuest, hasItems, addLog, onActivity, setActiveDialogue, tutorialStage, advanceTutorial, handleDialogueAction } = deps;

    const handleActivityClick = useCallback((activity: POIActivity) => {
        if (tutorialStage === 0 && activity.type === 'npc' && activity.name === 'Leo the Guide' && poiId === 'enclave_start') {
            advanceTutorial('start-tutorial');
        }
        if (tutorialStage === 29 && activity.type === 'npc' && activity.name === 'Leo the Guide' && poiId === 'enclave_departure_point') {
            advanceTutorial('talk-to-guide-final');
            return;
        }

        if (activity.type === 'npc') {
            const { name, icon, dialogue, startNode, dialogueType } = activity;
            let finalStartNode = startNode;
            let finalDialogue = { ...dialogue };

            const associatedQuests = Object.values(QUESTS).filter(q => 
                JSON.stringify(q.dialogue || {}).includes(`"${name}"`) ||
                q.stages.some(stage => stage.requirement.type === 'talk' && stage.requirement.npcName === name) ||
                JSON.stringify(dialogue).includes(q.id)
            );

            interface QuestDialogueEntryPoint {
                nodeKey: string;
                quest: Quest;
                priority: number;
            }
            const activeQuestEntryPoints: QuestDialogueEntryPoint[] = [];
            
            // Pass 1: Collect all active entry points (triggers, completions, in-progress)
            for (const quest of associatedQuests) {
                const playerQuestState = playerQuests.find(q => q.questId === quest.id);

                if (playerQuestState && !playerQuestState.isComplete) {
                    const stage = quest.stages[playerQuestState.currentStage];
                    if (stage?.requirement.type === 'talk' && stage.requirement.npcName === name && stage.requirement.poiId === poiId) {
                        const key = `complete_stage_${quest.id}_${playerQuestState.currentStage}`;
                        if (dialogue[key]) {
                            activeQuestEntryPoints.push({ nodeKey: key, quest, priority: 4 });
                        }
                    }
                    
                    let stageKey = `in_progress_${quest.id}_${playerQuestState.currentStage}`;
                    if (quest.id === 'magical_runestone_discovery' && playerQuestState.currentStage === 2 && name === 'Wizard Elmsworth (Projection)') {
                        if (hasItems([{ itemId: 'rune_essence', quantity: 5 }])) {
                            stageKey = 'in_progress_magical_runestone_discovery_2_complete';
                        }
                    }
                    const questKey = `in_progress_${quest.id}`;
                    if (dialogue[stageKey]) {
                        activeQuestEntryPoints.push({ nodeKey: stageKey, quest, priority: 3 });
                    } else if (dialogue[questKey]) {
                        activeQuestEntryPoints.push({ nodeKey: questKey, quest, priority: 3 });
                    }
                } else if (!playerQuestState && quest.isHidden) {
                    let triggerNode: string | undefined;
                    if (quest.id === 'ancient_blade' && hasItems([{ itemId: 'rusty_iron_sword', quantity: 1 }])) {
                        triggerNode = 'item_trigger_ancient_blade';
                    } else if (quest.id === 'lost_heirloom' && hasItems([{ itemId: 'lost_heirloom', quantity: 1 }])) {
                        triggerNode = 'item_trigger_lost_heirloom';
                    }
                    if (triggerNode && dialogue[triggerNode]) {
                        activeQuestEntryPoints.push({ nodeKey: triggerNode, quest, priority: 5 });
                    }
                }
            }
            
            // Now, decide what to do based on the collected entry points
            if (activeQuestEntryPoints.length > 1) {
                const hubNodeKey = 'dynamic_quest_hub';
                const hubResponses: DialogueResponse[] = activeQuestEntryPoints
                    .sort((a, b) => b.priority - a.priority)
                    .map(entry => ({
                        text: `About '${entry.quest.name}'...`,
                        next: entry.nodeKey
                    }));
                
                hubResponses.push({ text: "Something else...", action: 'close' });

                const hubNode: DialogueNode = {
                    npcName: name,
                    npcIcon: icon,
                    text: dialogue.default_dialogue?.text || "What can I help you with?",
                    responses: hubResponses
                };
                finalDialogue[hubNodeKey] = hubNode;
                finalStartNode = hubNodeKey;
                
            } else if (activeQuestEntryPoints.length === 1) {
                finalStartNode = activeQuestEntryPoints[0].nodeKey;
            } else {
                let highestPriorityNode: string | null = null;
                let priority = 0;
                
                for (const quest of associatedQuests) {
                    const playerQuestState = playerQuests.find(q => q.questId === quest.id);
                    if (playerQuestState && playerQuestState.isComplete && priority < 2) {
                         const key = `post_quest_${quest.id}`;
                         if (dialogue[key]) {
                             highestPriorityNode = key;
                             priority = 2;
                         }
                    } else if (!playerQuestState && !quest.isHidden && priority < 1) {
                        highestPriorityNode = startNode;
                        priority = 1;
                    }
                }
                
                if (highestPriorityNode) {
                    finalStartNode = highestPriorityNode;
                }
            }

            if (dialogueType === 'random') {
                const nodeToDisplay = finalDialogue[finalStartNode];
                if (nodeToDisplay && nodeToDisplay.responses.length === 0 && nodeToDisplay.text.includes('\n\n')) {
                    const dialogueOptions = nodeToDisplay.text.split('\n\n');
                    const randomDialogueText = dialogueOptions[Math.floor(Math.random() * dialogueOptions.length)];
                    finalDialogue[finalStartNode] = { ...nodeToDisplay, text: randomDialogueText };
                }
            }

            setActiveDialogue({
                npcName: name,
                npcIcon: icon,
                nodes: finalDialogue,
                currentNodeKey: finalStartNode,
                onEnd: () => setActiveDialogue(null),
                onAction: (action) => {
                    const success = handleDialogueAction(action);
                    if (success) {
                        setActiveDialogue(null);
                    } else if (action.failureNext) {
                         setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: action.failureNext } : null);
                    } else {
                        setActiveDialogue(null);
                    }
                },
                onNavigate: (nextNodeKey) => {
                    setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: nextNodeKey } : null);
                }
            });
            return;
        }
        
        onActivity(activity);
    }, [playerQuests, startQuest, hasItems, addLog, onActivity, poiId, setActiveDialogue, tutorialStage, advanceTutorial, handleDialogueAction]);

    return { handleActivityClick };
};
