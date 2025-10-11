import React, { useCallback } from 'react';
import { POIActivity, PlayerQuestState, DialogueNode, Quest, DialogueResponse, DialogueCheckRequirement, DialogueAction } from '../types';
import { QUESTS } from '../constants';
import { DialogueState, useUIState } from './useUIState';

interface SceneInteractionDependencies {
    playerQuests: PlayerQuestState[];
    setActiveDialogue: React.Dispatch<React.SetStateAction<DialogueState | null>>;
    handleDialogueCheck: (requirements: DialogueCheckRequirement[]) => boolean;
    onResponse: (response: DialogueResponse) => void;
    addLog: (message: string) => void;
}

export const useSceneInteractions = (poiId: string, deps: SceneInteractionDependencies) => {
    const { playerQuests, setActiveDialogue, handleDialogueCheck, onResponse, addLog } = deps;

    const handleActivityClick = useCallback((activity: POIActivity) => {
        if (activity.type !== 'npc') {
            return;
        }
    
        const { name, icon, dialogue: npcDialogue, startNode: defaultStartNode, dialogueType } = activity;

        const startDialogue = (startNodeKey: string, primarySource: Record<string, DialogueNode>) => {
            const allNodes: Record<string, DialogueNode> = {};

            // Aggregate all quest dialogues first
            for (const quest of Object.values(QUESTS)) {
                if (quest.dialogue) {
                    Object.assign(allNodes, quest.dialogue);
                }
            }
            // Then, merge the NPC's own dialogue from the POI file.
            if (npcDialogue) {
                Object.assign(allNodes, npcDialogue);
            }
            // Finally, ensure the primary source (the one that triggered the dialogue) overwrites any remaining conflicts.
            // This is important to ensure the correct 'start' node is used if multiple exist.
            Object.assign(allNodes, primarySource);

            if (dialogueType === 'random' && allNodes[startNodeKey]) {
                const nodeToDisplay = allNodes[startNodeKey];
                if (nodeToDisplay.responses.length === 0 && nodeToDisplay.text.includes('\n\n')) {
                    const dialogueOptions = nodeToDisplay.text.split('\n\n');
                    const randomDialogueText = dialogueOptions[Math.floor(Math.random() * dialogueOptions.length)];
                    allNodes[startNodeKey] = { ...nodeToDisplay, text: randomDialogueText };
                }
            }
            
            setActiveDialogue({
                npcName: name,
                npcIcon: icon,
                nodes: allNodes,
                currentNodeKey: startNodeKey,
                onEnd: () => setActiveDialogue(null),
                onResponse: onResponse,
                handleDialogueCheck: handleDialogueCheck,
            });
        };
        
        let effectiveStartNode: string | null = null;
        let dialogueSource: Record<string, DialogueNode> | null = null;

        // Priority 1: In-progress quest dialogue for this specific NPC.
        for (const pq of playerQuests) {
            if (effectiveStartNode) break;
            if (!pq.isComplete) {
                const questData = QUESTS[pq.questId];
                if (!questData) {
                    continue;
                }
                if (!questData.dialogue) {
                    continue; 
                }
                
                const nodeKey = `in_progress_${pq.questId}_${pq.currentStage}`;
                const node = questData.dialogue[nodeKey];
                if (node) {
                    if (node.npcName.trim() === name.trim()) {
                        effectiveStartNode = nodeKey;
                        dialogueSource = questData.dialogue;
                    }
                }
            }
        }

        // Priority 2: Quest start dialogue initiated by this NPC.
        if (!effectiveStartNode) {
            for (const quest of Object.values(QUESTS)) {
                if (effectiveStartNode) break;
                const isStarted = playerQuests.some(pq => pq.questId === quest.id);
                if (!isStarted && quest.dialogue) {
                    
                    const explicitStartNode = quest.startDialogueNode;
                    if (explicitStartNode) {
                        const node = quest.dialogue[explicitStartNode];
                        if (node?.npcName.trim() === name.trim()) {
                            effectiveStartNode = explicitStartNode;
                            dialogueSource = quest.dialogue;
                        }
                    }
        
                    const conventionalStartNode = `quest_intro_${quest.id}`;
                    if (!effectiveStartNode && quest.dialogue[conventionalStartNode]) {
                        const node = quest.dialogue[conventionalStartNode];
                        if (node?.npcName.trim() === name.trim()) {
                            effectiveStartNode = conventionalStartNode;
                            dialogueSource = quest.dialogue;
                        }
                    }
                }
            }
        }

        // Priority 3: Post-quest dialogue for this NPC.
        if (!effectiveStartNode) {
            for (const pq of playerQuests) {
                if (effectiveStartNode) break;
                if (pq.isComplete) {
                    const questData = QUESTS[pq.questId];
                    if (questData?.dialogue) {
                        const nodeKey = `post_quest_${pq.questId}`;
                        const node = questData.dialogue[nodeKey];
                        if (node?.npcName.trim() === name.trim()) {
                            effectiveStartNode = nodeKey;
                            dialogueSource = questData.dialogue;
                        }
                    }
                }
            }
        }

        // Priority 4 (Lowest): Fallback to the default dialogue from the POI definition.
        if (!effectiveStartNode && npcDialogue && defaultStartNode) {
            if (npcDialogue[defaultStartNode]) {
                effectiveStartNode = defaultStartNode;
                dialogueSource = npcDialogue;
            }
        }

        if (effectiveStartNode && dialogueSource) {
            startDialogue(effectiveStartNode, dialogueSource);
        }
    }, [playerQuests, setActiveDialogue, handleDialogueCheck, onResponse, addLog]);

    return { handleActivityClick };
};