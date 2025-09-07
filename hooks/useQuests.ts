import { useState, useCallback } from 'react';
import { PlayerQuestState } from '../types';
import { QUESTS } from '../constants';

export const useQuests = (initialData: { playerQuests: PlayerQuestState[], lockedPois: string[] }) => {
    const [playerQuests, setPlayerQuests] = useState<PlayerQuestState[]>(initialData.playerQuests);
    const [lockedPois, setLockedPois] = useState<string[]>(initialData.lockedPois);

    const startQuest = useCallback((questId: string, addLog: (message: string) => void) => {
        if (playerQuests.some(q => q.questId === questId)) {
            addLog("You have already started this quest.");
            return;
        }
        const questData = QUESTS[questId];
        if (questData) {
            setPlayerQuests(quests => [...quests, { questId, currentStage: 0, progress: 0, isComplete: false }]);
            addLog(`New quest started: ${questData.name}`);
        }
    }, [playerQuests]);
    
    return { playerQuests, setPlayerQuests, lockedPois, setLockedPois, startQuest };
};
