import React, { useCallback } from 'react';
import { POIActivity, PlayerQuestState, DialogueNode, Quest, DialogueResponse, DialogueCheckRequirement, DialogueAction } from '../types';
import { QUESTS } from '../constants';
import { DialogueState, useUIState } from './useUIState';

interface SceneInteractionDependencies {
    playerQuests: PlayerQuestState[];
    startQuest: (questId: string, addLog: (message: string) => void) => void;
    hasItems: (items: { itemId: string; quantity: number }[]) => boolean;
    addLog: (message: string) => void;
    onActivity: (activity: POIActivity) => void;
    setActiveDialogue: React.Dispatch<React.SetStateAction<DialogueState | null>>;
    handleDialogueAction: (actions: DialogueAction[]) => void;
    handleDialogueCheck: (requirements: DialogueCheckRequirement[]) => boolean;
}

export const useSceneInteractions = (poiId: string, deps: SceneInteractionDependencies) => {
    const { playerQuests, startQuest, hasItems, addLog, onActivity, setActiveDialogue, handleDialogueAction, handleDialogueCheck } = deps;

    const onResponse = useCallback((response: DialogueResponse) => {
        if (response.check) {
            const checkResult = handleDialogueCheck(response.check.requirements);
            if (checkResult) {
                if (response.actions) {
                    handleDialogueAction(response.actions);
                }
                setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: response.check!.successNode } : null);
            } else {
                setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: response.check!.failureNode } : null);
            }
        } else {
            if (response.actions) {
                handleDialogueAction(response.actions);
            }
            if (response.next) {
                setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: response.next! } : null);
            } else {
                setActiveDialogue(null);
            }
        }
    }, [handleDialogueCheck, handleDialogueAction, setActiveDialogue]);

    const handleActivityClick = useCallback((activity: POIActivity) => {
        if (activity.type === 'npc') {
            const { name, icon, dialogue, startNode, dialogueType } = activity;
            let finalStartNode = startNode;
            let finalDialogue = { ...dialogue };

            const associatedQuests = Object.values(QUESTS).filter(q => 
                JSON.stringify(dialogue).includes(q.id) ||
                q.stages.some(stage => stage.requirement.type === 'talk' && stage.requirement.npcName === name)
            );

            interface QuestDialogueEntryPoint {
                nodeKey: string;
                quest: Quest;
                priority: number; // 5: hidden trigger, 4: complete stage, 3: in progress, 2: post-quest, 1: quest start
            }
            const questEntryPoints: QuestDialogueEntryPoint[] = [];

            // Collect all potential entry points
            for (const quest of associatedQuests) {
                const playerQuestState = playerQuests.find(q => q.questId === quest.id);

                if (playerQuestState) { // Quest is started
                    if (!playerQuestState.isComplete) {
                        const currentStageIndex = playerQuestState.currentStage;
                        const currentStage = quest.stages[currentStageIndex];
                        const nextStage = quest.stages[currentStageIndex + 1];
                        
                        let requirementForNextStageIsMet = false;
                        
                        // Check if the current stage's requirement is met
                        if (currentStage?.requirement.type === 'gather') {
                            const req = currentStage.requirement as any;
                            const itemsToGather = req.items || [{ itemId: req.itemId, quantity: req.quantity }];
                            if (hasItems(itemsToGather)) {
                                requirementForNextStageIsMet = true;
                            }
                        } else if (currentStage?.requirement.type === 'kill') {
                            if (playerQuestState.progress >= currentStage.requirement.quantity) {
                                requirementForNextStageIsMet = true;
                            }
                        }

                        // Priority 4: A "turn-in" happens when the current stage's objective is done AND the next stage is to talk to the current NPC.
                        if (requirementForNextStageIsMet && nextStage?.requirement.type === 'talk' && nextStage.requirement.npcName === name && nextStage.requirement.poiId === poiId) {
                            const key = `complete_stage_${quest.id}_${currentStageIndex + 1}`;
                            if (dialogue[key]) {
                                questEntryPoints.push({ nodeKey: key, quest, priority: 4 });
                            }
                        }
                        
                        // Priority 3: In-progress dialogue
                        let stageKey = `in_progress_${quest.id}_${playerQuestState.currentStage}`;
                        if (quest.id === 'magical_runestone_discovery' && playerQuestState.currentStage === 2 && name === 'Wizard Elmsworth (Projection)') {
                            if (hasItems([{ itemId: 'rune_essence', quantity: 5 }])) {
                                stageKey = 'in_progress_magical_runestone_discovery_2_complete';
                            }
                        }
                        if (dialogue[stageKey]) {
                            questEntryPoints.push({ nodeKey: stageKey, quest, priority: 3 });
                        }
                    } else { // Quest is complete
                        // Priority 2: Post-quest dialogue
                        const key = `post_quest_${quest.id}`;
                        if (dialogue[key]) {
                            questEntryPoints.push({ nodeKey: key, quest, priority: 2 });
                        }
                    }
                } else { // Quest not started yet
                    if (quest.isHidden) {
                        // Priority 5: Hidden quest trigger
                        let triggerNode: string | undefined;
                        if (quest.id === 'ancient_blade' && hasItems([{ itemId: 'rusty_iron_sword', quantity: 1 }]) && !playerQuests.some(q => q.questId === 'a_smiths_apprentice' && !q.isComplete)) {
                            triggerNode = 'item_trigger_ancient_blade';
                        }
                        // Other hidden quests...
                         if (quest.id === 'lost_heirloom' && hasItems([{ itemId: 'lost_heirloom', quantity: 1 }])) {
                            triggerNode = 'item_trigger_lost_heirloom';
                        }
                        if (triggerNode && dialogue[triggerNode]) {
                            questEntryPoints.push({ nodeKey: triggerNode, quest, priority: 5 });
                        }
                    } else {
                        // Priority 1: Regular quest start dialogue
                        const key = `quest_intro_${quest.id}`;
                        if(dialogue[key]) {
                            questEntryPoints.push({ nodeKey: key, quest, priority: 1 });
                        }
                    }
                }
            }
            
            // Add default dialogue with lowest priority if no other entry points match.
            if (questEntryPoints.length === 0) {
                 questEntryPoints.push({ nodeKey: startNode, quest: {} as Quest, priority: 0 });
            }

            // Determine the highest priority entry point to use
            questEntryPoints.sort((a, b) => b.priority - a.priority);
            const highestPriority = questEntryPoints[0].priority;
            const topPriorityEntries = questEntryPoints.filter(e => e.priority === highestPriority);
            
            if (topPriorityEntries.length > 1) {
                // If multiple top-priority entries exist (e.g., two quests can be completed), create a hub.
                const hubNodeKey = 'dynamic_quest_hub';
                const hubResponses: DialogueResponse[] = topPriorityEntries.map(entry => ({
                    text: `About '${entry.quest.name}'...`,
                    next: entry.nodeKey
                }));
                 hubResponses.push({ text: "Something else...", next: 'default_dialogue' });

                const hubNode: DialogueNode = {
                    npcName: name,
                    npcIcon: icon,
                    text: dialogue.default_dialogue?.text || "What can I help you with?",
                    responses: hubResponses
                };
                finalDialogue[hubNodeKey] = hubNode;
                finalStartNode = hubNodeKey;
            } else if (topPriorityEntries.length === 1) {
                finalStartNode = topPriorityEntries[0].nodeKey;
            } else {
                finalStartNode = startNode; // Fallback
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
                onResponse: onResponse,
                handleDialogueCheck: handleDialogueCheck,
            });
            return;
        }
        
        onActivity(activity);
    }, [playerQuests, startQuest, hasItems, addLog, onActivity, poiId, setActiveDialogue, handleDialogueAction, handleDialogueCheck, onResponse]);

    return { handleActivityClick };
};
