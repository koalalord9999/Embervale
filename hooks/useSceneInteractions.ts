
import { useCallback } from 'react';
import { POIActivity, PlayerQuestState, DialogueNode } from '../types';
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
    handleDialogueAction: (action: { type: string; questId?: string; actionId?: string }) => void;
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

            let highestPriorityNode: string | null = null;
            let priority = 0; // 5: Trigger Hidden, 4: Turn-in, 3: In Progress, 2: Post-Quest, 1: Start Quest

            for (const quest of associatedQuests) {
                const playerQuestState = playerQuests.find(q => q.questId === quest.id);

                // Priority 5: Hidden Quest Item Trigger
                if (!playerQuestState && quest.isHidden && priority < 5) {
                    let triggerNode: string | undefined;
                    if (quest.id === 'ancient_blade' && hasItems([{ itemId: 'rusty_iron_sword', quantity: 1 }])) {
                        triggerNode = 'item_trigger_ancient_blade';
                    } else if (quest.id === 'lost_heirloom' && hasItems([{ itemId: 'lost_heirloom', quantity: 1 }])) {
                        triggerNode = 'item_trigger_lost_heirloom';
                    }
                    if (triggerNode && dialogue[triggerNode]) {
                        highestPriorityNode = triggerNode;
                        priority = 5;
                    }
                }

                // Special logic for the Gust Altar NPC during MRD quest
                if (quest.id === 'magical_runestone_discovery' && name === 'Gust Altar' && playerQuestState && !playerQuestState.isComplete) {
                    if (playerQuestState.currentStage === 4 && priority < 4) {
                        highestPriorityNode = 'in_progress_magical_runestone_discovery_4';
                        priority = 4;
                    } else if (playerQuestState.currentStage === 6 && priority < 4) {
                        highestPriorityNode = 'in_progress_magical_runestone_discovery_6';
                        priority = 4;
                    }
                }

                // Priority 4: Stage Turn-in
                if (playerQuestState && !playerQuestState.isComplete && priority < 4) {
                    const stage = quest.stages[playerQuestState.currentStage];
                    if (stage?.requirement.type === 'talk' && stage.requirement.npcName === name && stage.requirement.poiId === poiId) {
                        const key = `complete_stage_${quest.id}_${playerQuestState.currentStage}`;
                        if (dialogue[key]) {
                            highestPriorityNode = key;
                            priority = 4;
                        }
                    }
                }
                
                // Priority 3: In Progress
                if (playerQuestState && !playerQuestState.isComplete && priority < 3) {
                    let stageKey = `in_progress_${quest.id}_${playerQuestState.currentStage}`;
                    
                    // Special check for MRD-2 (rune essence)
                    if (quest.id === 'magical_runestone_discovery' && playerQuestState.currentStage === 2 && name === 'Wizard Elmsworth (Projection)') {
                        if (hasItems([{ itemId: 'rune_essence', quantity: 5 }])) {
                            stageKey = 'in_progress_magical_runestone_discovery_2_complete';
                        }
                    }
                    
                    const questKey = `in_progress_${quest.id}`;
                    if (dialogue[stageKey]) {
                        highestPriorityNode = stageKey;
                        priority = 3;
                    } else if (dialogue[questKey]) {
                        highestPriorityNode = questKey;
                        priority = 3;
                    }
                }

                // Priority 2: Post-Quest
                if (playerQuestState && playerQuestState.isComplete && priority < 2) {
                     const key = `post_quest_${quest.id}`;
                     if (dialogue[key]) {
                         highestPriorityNode = key;
                         priority = 2;
                     }
                }
            }

            if (highestPriorityNode) {
                finalStartNode = highestPriorityNode;
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
                    handleDialogueAction(action);
                    setActiveDialogue(null);
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