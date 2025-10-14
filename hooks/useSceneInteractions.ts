
import React, { useCallback } from 'react';
import { POIActivity, PlayerQuestState, DialogueNode, Quest, DialogueResponse, DialogueCheckRequirement, DialogueAction, InventorySlot } from '../types';
import { QUESTS } from '../constants';
import { DialogueState, useUIState } from './useUIState';

const TANNABLE_HIDES: Record<string, { cost: number }> = {
    'cowhide': { cost: 5 },
    'boar_hide': { cost: 8 },
    'wolf_pelt': { cost: 15 },
    'bear_pelt': { cost: 25 },
};

const calculateTanningCost = (inventory: (InventorySlot | null)[]) => {
    let totalCost = 0;
    for (const hideId in TANNABLE_HIDES) {
        const count = inventory.reduce((acc, slot) => 
            (slot && slot.itemId === hideId && !slot.noted) ? acc + slot.quantity : acc, 
        0);
        if (count > 0) {
            totalCost += count * TANNABLE_HIDES[hideId].cost;
        }
    }
    return totalCost;
};


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
        if (activity.type !== 'npc') {
            return;
        }
        
        if (activity.name === 'Tanner Sven') {
            const totalCost = calculateTanningCost(inventory);
            let svenDialogue: DialogueState;

            if (totalCost > 0) {
                svenDialogue = {
                    npcName: 'Tanner Sven',
                    npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                    nodes: {
                        start: {
                            npcName: 'Tanner Sven',
                            npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                            text: "Need some hides tanned? You've come to the right place. What have you got for me?",
                            responses: [
                                {
                                    text: `Tan all hides (${totalCost} coins)`,
                                    check: {
                                        requirements: [{ type: 'coins', amount: totalCost }],
                                        successNode: 'tan_success',
                                        failureNode: 'tan_fail_coins'
                                    },
                                    actions: [{ type: 'tan_all_hides' }]
                                },
                                { text: "Just looking, thanks." }
                            ]
                        },
                        tan_success: {
                            npcName: 'Tanner Sven',
                            npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                            text: "Here is your finished leather.",
                            responses: []
                        },
                        tan_fail_coins: {
                             npcName: 'Tanner Sven',
                             npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                             text: "You don't have enough coins for that.",
                             responses: []
                        }
                    },
                    currentNodeKey: 'start',
                    onEnd: () => setActiveDialogue(null),
                    onResponse: onResponse,
                    handleDialogueCheck: handleDialogueCheck,
                };
            } else {
                svenDialogue = {
                    npcName: 'Tanner Sven',
                    npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                    nodes: {
                       start: {
                           npcName: 'Tanner Sven',
                           npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                           text: "You don't seem to have any hides for me to tan. Come back when you do.",
                           responses: []
                       }
                   },
                   currentNodeKey: 'start',
                   onEnd: () => setActiveDialogue(null),
                   onResponse: onResponse,
                };
            }
            setActiveDialogue(svenDialogue);
            return; // Exit early to bypass the normal dialogue flow
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

        // Priority 4: Explicitly defined startNode on the POI activity.
        if (!effectiveStartNode && defaultStartNode) {
            // Check if the node exists in any quest dialogue first
            for (const quest of Object.values(QUESTS)) {
                if (quest.dialogue && quest.dialogue[defaultStartNode]) {
                    effectiveStartNode = defaultStartNode;
                    dialogueSource = quest.dialogue;
                    break;
                }
            }

            // If not found in quests, check the inline dialogue object on the activity itself
            if (!effectiveStartNode && npcDialogue && npcDialogue[defaultStartNode]) {
                effectiveStartNode = defaultStartNode;
                dialogueSource = npcDialogue;
            }
        }

        if (effectiveStartNode && dialogueSource) {
            startDialogue(effectiveStartNode, dialogueSource);
        }
    }, [playerQuests, setActiveDialogue, handleDialogueCheck, onResponse, addLog, inventory]);

    return { handleActivityClick };
};
