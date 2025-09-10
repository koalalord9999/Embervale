
import { useCallback } from 'react';
import { POIActivity, PlayerQuestState } from '../types';
import { QUESTS } from '../constants';
import { QuestDialogueState, InteractiveDialogueState } from './useUIState';

interface SceneInteractionDependencies {
    playerQuests: PlayerQuestState[];
    completeQuestStage: (questId: string) => void;
    startQuest: (questId: string, addLog: (message: string) => void) => void;
    hasItems: (items: { itemId: string; quantity: number }[]) => boolean;
    addLog: (message: string) => void;
    onActivity: (activity: POIActivity) => void;
    setActiveQuestDialogue: (dialogue: QuestDialogueState | null) => void;
    setActiveInteractiveDialogue: (dialogue: InteractiveDialogueState | null) => void;
    tutorialStage: number;
    advanceTutorial: (condition: string) => void;
}

export const useSceneInteractions = (poiId: string, deps: SceneInteractionDependencies) => {
    const { playerQuests, completeQuestStage, startQuest, hasItems, addLog, onActivity, setActiveQuestDialogue, setActiveInteractiveDialogue, tutorialStage, advanceTutorial } = deps;

    const handleActivityClick = useCallback((activity: POIActivity) => {
        // Tutorial start hook
        if (tutorialStage === 0 && activity.type === 'npc' && activity.name === 'Leo the Guide' && poiId === 'enclave_start') {
            advanceTutorial('start-tutorial');
        }
        
        if (activity.type === 'quest_start') {
            // Special case for the tutorial's final step.
            // It's a dialogue-triggered quest that needs to be manually started
            // before the dialogue is shown, otherwise it can't be completed.
            if (activity.questId === 'tutorial_completion' && !playerQuests.some(q => q.questId === 'tutorial_completion')) {
                startQuest(activity.questId, addLog);
            }

            const questData = QUESTS[activity.questId];
            if (questData?.dialogue) {
                setActiveQuestDialogue({ questId: activity.questId });
            } else {
                startQuest(activity.questId, addLog);
            }
            return;
        }

        if (activity.type === 'npc') {
            // 1. Check if talking to this NPC completes the current stage of any quest
            const questToUpdate = playerQuests.find(q => {
                const questData = QUESTS[q.questId];
                if (!q.isComplete && questData && questData.stages[q.currentStage]) {
                    const currentStage = questData.stages[q.currentStage];
                    if (currentStage.requirement.type === 'talk' && currentStage.requirement.npcName === activity.name && currentStage.requirement.poiId === poiId) {
                        return true;
                    }
                    if (currentStage.requirement.type === 'gather') {
                        const nextStage = questData.stages[q.currentStage + 1];
                        if (nextStage?.requirement.type === 'talk' && nextStage.requirement.npcName === activity.name && nextStage.requirement.poiId === poiId) {
                            if (hasItems([{ itemId: currentStage.requirement.itemId, quantity: currentStage.requirement.quantity }])) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            });

            if (questToUpdate) {
                const questData = QUESTS[questToUpdate.questId];
                const stage = questData.stages[questToUpdate.currentStage];
                const completionNodeKey = `complete_stage_${questToUpdate.currentStage}`;

                if (stage.requirement.type === 'talk' && questData.dialogue && questData.dialogue[completionNodeKey]) {
                    setActiveInteractiveDialogue({
                        dialogue: questData.dialogue,
                        startNode: completionNodeKey
                    });
                } else {
                    completeQuestStage(questToUpdate.questId);
                }
                return;
            }

            // 2. Check for hidden quest starts
            if (activity.name === 'Valerius the Master Smith' && hasItems([{ itemId: 'rusty_iron_sword', quantity: 1 }]) && !playerQuests.some(q => q.questId === 'ancient_blade')) {
                startQuest('ancient_blade', addLog);
                setActiveQuestDialogue({ questId: 'ancient_blade' });
                return;
            }
             if (activity.name === 'Elara' && hasItems([{ itemId: 'lost_heirloom', quantity: 1 }]) && !playerQuests.some(q => q.questId === 'lost_heirloom')) {
                addLog("You show Elara the heirloom. Her eyes widen in recognition.");
                startQuest('lost_heirloom', addLog);
                completeQuestStage('lost_heirloom');
                return;
            }
            
            // 3. Check for in-progress quest dialogue
            const inProgressQuest = playerQuests.find(q => {
                const questData = QUESTS[q.questId];
                return !q.isComplete && questData?.dialogue?.start?.npcName === activity.name;
            });

            if (inProgressQuest) {
                const questData = QUESTS[inProgressQuest.questId];
                const stageInProgressKey = `in_progress_stage_${inProgressQuest.currentStage}`;
                if (questData.dialogue && (questData.dialogue[stageInProgressKey] || questData.dialogue['in_progress'])) {
                    const startNode = questData.dialogue[stageInProgressKey] ? stageInProgressKey : 'in_progress';
                    setActiveInteractiveDialogue({ dialogue: questData.dialogue, startNode: startNode! });
                    return;
                }
            }
        }
        
        // 4. If no quest logic was triggered, perform the default activity action
        onActivity(activity);
    }, [playerQuests, completeQuestStage, startQuest, hasItems, addLog, onActivity, poiId, setActiveQuestDialogue, setActiveInteractiveDialogue, tutorialStage, advanceTutorial]);

    return { handleActivityClick };
};
