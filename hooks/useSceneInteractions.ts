
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
            let finalDialogue = { ...dialogue };

            // Determine effective start node based on quest state
            let effectiveStartNode = startNode;
            let foundInProgress = false;
            let firstPostQuestNode: string | null = null;

            // Sort quests to ensure a consistent priority if multiple match (unlikely but good practice)
            const sortedPlayerQuests = [...playerQuests].sort((a, b) => a.questId.localeCompare(b.questId));

            for (const pq of sortedPlayerQuests) {
                // Check for in-progress stage first
                if (!pq.isComplete) {
                    const nodeKeyInProgress = `in_progress_${pq.questId}_${pq.currentStage}`;
                    if (dialogue[nodeKeyInProgress]) {
                        effectiveStartNode = nodeKeyInProgress;
                        foundInProgress = true;
                        break; // In-progress takes highest priority
                    }
                }
                
                // If no in-progress found yet, check for post-quest dialogue
                if (!foundInProgress && pq.isComplete) {
                    const nodeKeyPostQuest = `post_quest_${pq.questId}`;
                    if (dialogue[nodeKeyPostQuest] && !firstPostQuestNode) {
                        firstPostQuestNode = nodeKeyPostQuest;
                    }
                }
            }

            if (!foundInProgress && firstPostQuestNode) {
                effectiveStartNode = firstPostQuestNode;
            }

            if (dialogueType === 'random') {
                const nodeToDisplay = finalDialogue[startNode];
                if (nodeToDisplay && nodeToDisplay.responses.length === 0 && nodeToDisplay.text.includes('\n\n')) {
                    const dialogueOptions = nodeToDisplay.text.split('\n\n');
                    const randomDialogueText = dialogueOptions[Math.floor(Math.random() * dialogueOptions.length)];
                    finalDialogue[startNode] = { ...nodeToDisplay, text: randomDialogueText };
                }
            }

            setActiveDialogue({
                npcName: name,
                npcIcon: icon,
                nodes: finalDialogue,
                currentNodeKey: effectiveStartNode,
                onEnd: () => setActiveDialogue(null),
                onResponse: onResponse,
                handleDialogueCheck: handleDialogueCheck,
            });
            return;
        }
        
        onActivity(activity);
    }, [onActivity, setActiveDialogue, onResponse, handleDialogueCheck, playerQuests]);

    return { handleActivityClick };
};
