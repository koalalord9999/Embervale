

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TUTORIAL_SCRIPT } from '../constants';
import { CombatStance, SkillName, PlayerQuestState } from '../types';
import { useGameSession } from './useGameSession';
import { useQuestLogic } from './useQuestLogic';
import { useUIState } from './useUIState';

const isPlayerInTutorialZone = (poiId: string) => poiId.startsWith('enclave_');

interface TutorialDependencies {
    initialState: any;
    session: ReturnType<typeof useGameSession>;
    addLog: (message: string) => void;
    originalAddLog: (message: string) => void; 
    setTutorialLogMessage: (message: string | null) => void;
    questLogic: ReturnType<typeof useQuestLogic> | null;
    ui: ReturnType<typeof useUIState>;
    setPlayerQuests: React.Dispatch<React.SetStateAction<PlayerQuestState[]>>;
}

export const useTutorial = (deps: TutorialDependencies) => {
    const { initialState, session, addLog, originalAddLog, setTutorialLogMessage, questLogic, ui, setPlayerQuests } = deps;

    const [tutorialStage, setTutorialStage] = useState(() => {
        if (initialState.tutorialStage >= 0 && !isPlayerInTutorialZone(initialState.currentPoiId)) {
            return -1;
        }
        return initialState.tutorialStage;
    });
    
    const [tutorialOverrideText, setTutorialOverrideText] = useState<string | null>(null);
    const [activeCombatStyleHighlight, setActiveCombatStyleHighlight] = useState<CombatStance | null>(null);

    const depsRef = useRef(deps);
    useEffect(() => {
        depsRef.current = deps;
    });

    const completeTutorial = useCallback(() => {
        const { questLogic, session, originalAddLog, setPlayerQuests } = depsRef.current;
        if (questLogic) {
            questLogic.completeQuestStage('tutorial_completion');
        } else {
            // Fallback if questLogic is not yet available, directly updates state
            setPlayerQuests(qs => {
                if (qs.some(q => q.questId === 'tutorial_completion')) {
                    return qs.map(q => q.questId === 'tutorial_completion' ? { ...q, isComplete: true } : q);
                }
                return [...qs, { questId: 'tutorial_completion', currentStage: 1, progress: 0, isComplete: true }];
            });
        }
        setTutorialStage(-1);
        session.setCurrentPoiId('meadowdale_square');
        originalAddLog("You have arrived in the main world. Your adventure begins now!");
    }, []);

    const advanceTutorial = useCallback((condition: string) => {
        if (tutorialStage < 0) return;
        const currentStep = TUTORIAL_SCRIPT[tutorialStage];
        if (currentStep && currentStep.completionCondition === condition) {

            if (condition === 'hit-dummy-defensive') {
                // Use a short timeout to let the final XP drop appear
                setTimeout(() => {
                    ui.setCombatQueue([]);
                    ui.setIsMandatoryCombat(false);
                }, 500);
            }

            const newStage = tutorialStage + 1;
            if (newStage >= TUTORIAL_SCRIPT.length) {
                completeTutorial();
            } else {
                setTutorialStage(newStage);
            }
        }
    }, [tutorialStage, completeTutorial, ui]);

    useEffect(() => { if (tutorialStage >= 0 && ui.activePanel) advanceTutorial(`open-panel:${ui.activePanel}`); }, [ui.activePanel, tutorialStage, advanceTutorial]);
    useEffect(() => { if (tutorialStage >= 0 && session.currentPoiId) advanceTutorial(`move:${session.currentPoiId}`); }, [session.currentPoiId, tutorialStage, advanceTutorial]);

    useEffect(() => {
        if (tutorialStage >= 0 && !isPlayerInTutorialZone(session.currentPoiId)) {
            setTutorialStage(-1);
        }
    }, [session.currentPoiId, tutorialStage]);

    useEffect(() => {
        if (tutorialStage !== 7) { setActiveCombatStyleHighlight(null); return; }
        const stances = [CombatStance.Accurate, CombatStance.Aggressive, CombatStance.Defensive];
        let currentIndex = 0;
        const interval = setInterval(() => {
            setActiveCombatStyleHighlight(stances[currentIndex]);
            currentIndex = (currentIndex + 1) % stances.length;
        }, 1000);
        return () => { clearInterval(interval); setActiveCombatStyleHighlight(null); };
    }, [tutorialStage]);

    const advanceOnCombatXpGain = useCallback((skill: SkillName) => {
        if (tutorialStage === 7 && skill === SkillName.Strength) {
            advanceTutorial('hit-dummy-aggressive');
        }
        if (tutorialStage === 8 && skill === SkillName.Defence) {
            advanceTutorial('hit-dummy-defensive');
        }
    }, [tutorialStage, advanceTutorial]);


    return {
        tutorialStage,
        unlockedHudButtons: [],
        tutorialOverrideText,
        activeCombatStyleHighlight,
        advanceTutorial,
        advanceOnCombatXpGain,
        currentStep: TUTORIAL_SCRIPT[tutorialStage],
        deps: deps, // For hot-swapping questLogic
    };
};