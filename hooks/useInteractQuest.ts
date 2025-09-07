

import { useState, useEffect, useCallback, useRef } from 'react';
import { PlayerRepeatableQuest } from '../types';

interface InteractQuestDependencies {
    addLog: (message: string) => void;
    activePlayerQuest: PlayerRepeatableQuest | null;
    handleTurnInRepeatableQuest: () => void;
}

export const useInteractQuest = (deps: InteractQuestDependencies) => {
    const [activeCleanup, setActiveCleanup] = useState<{ quest: PlayerRepeatableQuest; startTime: number; duration: number } | null>(null);

    // Create a ref to hold the latest dependencies
    const depsRef = useRef(deps);
    useEffect(() => {
        depsRef.current = deps;
    });

    const handleStartInteractQuest = useCallback((quest: PlayerRepeatableQuest) => {
        if (!quest || activeCleanup) return;
        const duration = 15000; // Static 15 second timer for all interaction tasks.
        depsRef.current.addLog(`You begin to ${quest.generatedQuest.title.toLowerCase()}...`);
        setActiveCleanup({ quest, startTime: Date.now(), duration });
    }, [activeCleanup]); // Dependency on activeCleanup prevents starting a new task while one is running

    const handleCancelInteractQuest = useCallback(() => {
        if(activeCleanup) {
            depsRef.current.addLog("You stop the task.");
            setActiveCleanup(null);
        }
    }, [activeCleanup]); // Dependency on activeCleanup ensures we only cancel if there's an active task

    useEffect(() => {
        if (!activeCleanup) return;

        const timer = setTimeout(() => {
            const { activePlayerQuest, handleTurnInRepeatableQuest } = depsRef.current;
            
            // Check if the quest is still active when the timer finishes
            if (activePlayerQuest?.questId === activeCleanup.quest.questId) {
                handleTurnInRepeatableQuest();
            }
            setActiveCleanup(null);
        }, activeCleanup.duration);

        return () => clearTimeout(timer);
    }, [activeCleanup]); // This effect now only depends on the timer's lifecycle

    return {
        activeCleanup,
        handleStartInteractQuest,
        handleCancelInteractQuest,
    };
};