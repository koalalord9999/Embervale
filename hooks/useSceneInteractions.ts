

import React, { useCallback } from 'react';
import { POIActivity, PlayerQuestState, DialogueNode, Quest, DialogueResponse, DialogueCheckRequirement, DialogueAction, InventorySlot } from '../types';
import { QUESTS } from '../constants';
import { DialogueState, useUIState } from './useUIState';

interface SceneInteractionDependencies {
    playerQuests: PlayerQuestState[];
    setActiveDialogue: React.Dispatch<React.SetStateAction<DialogueState | null>>;
    handleDialogueCheck: (requirements: DialogueCheckRequirement[]) => boolean;
    onResponse: (response: DialogueResponse) => void;
    addLog: (message: string) => void;
    inventory: (InventorySlot | null)[];
}

export const useSceneInteractions = (poiId: string, deps: SceneInteractionDependencies) => {
    const { playerQuests, setActiveDialogue, handleDialogueCheck, onResponse, addLog, inventory } = deps;

    const handleActivityClick = useCallback((activity: POIActivity) => {
        if (activity.type !== 'npc' || !activity.startNode) {
            return; // Not a dialogue NPC or no entry point defined
        }

        const { name, icon, dialogue, startNode, questTopics, dialogueType, conditionalGreetings } = activity;

        const allNodes: Record<string, DialogueNode> = {};
        Object.values(QUESTS).forEach(quest => {
            if (quest.dialogue) {
                Object.assign(allNodes, quest.dialogue);
            }
        });
        if (dialogue) {
            Object.assign(allNodes, dialogue);
        }

        const hubNode = allNodes[startNode];
        if (!hubNode) {
            return;
        }

        // Determine the correct greeting text
        let greetingText = hubNode.text;
        if (conditionalGreetings) {
            const overrideGreeting = conditionalGreetings.find(greeting => 
                handleDialogueCheck(greeting.check.requirements)
            );
            if (overrideGreeting) {
                greetingText = overrideGreeting.text;
            }
        }

        const dynamicResponses: DialogueResponse[] = [];
        // This logic will scan for all possible quest entry points for a given NPC.
        for (const questData of Object.values(QUESTS)) {
            if (questData?.dialogueEntryPoints) {
                for (const entryPoint of questData.dialogueEntryPoints) {
                    if (entryPoint.npcName === name) {
                        if (handleDialogueCheck(entryPoint.response.check?.requirements ?? [])) {
                            dynamicResponses.push(entryPoint.response);
                        }
                    }
                }
            }
        }
        
        const finalHubNode: DialogueNode = {
            ...hubNode,
            text: greetingText,
            responses: [...(hubNode.responses || []), ...dynamicResponses]
        };
        
        if (dialogueType === 'random' && finalHubNode.responses.length === 0 && finalHubNode.text.includes('\n\n')) {
            const dialogueOptions = finalHubNode.text.split('\n\n');
            const randomDialogueText = dialogueOptions[Math.floor(Math.random() * dialogueOptions.length)];
            finalHubNode.text = randomDialogueText;
        }

        const finalNodes = { ...allNodes, [startNode]: finalHubNode };

        const onNavigate = (nextNodeKey: string) => {
            setActiveDialogue(prev => prev ? { ...prev, currentNodeKey: nextNodeKey } : null);
        };

        setActiveDialogue({
            npcName: name,
            npcIcon: icon,
            nodes: finalNodes,
            currentNodeKey: startNode,
            onEnd: () => setActiveDialogue(null),
            onResponse: onResponse,
            onNavigate: onNavigate,
            handleDialogueCheck: handleDialogueCheck,
        });

    }, [playerQuests, setActiveDialogue, handleDialogueCheck, onResponse]);

    return { handleActivityClick };
};
