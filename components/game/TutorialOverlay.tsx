import React, { useEffect, useState, useRef } from 'react';
import { TUTORIAL_SCRIPT, ITEMS } from '../../constants';
import Button from '../common/Button';
import { InventorySlot } from '../../types';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

interface TutorialOverlayProps {
    stage: number;
    advanceTutorial: (condition: string) => void;
    overrideGuideText?: string | null;
    inventory: (InventorySlot | null)[];
    logMessage: string | null;
    clearLogMessage: () => void;
    isTouchSimulationEnabled: boolean;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ stage, advanceTutorial, overrideGuideText, inventory, logMessage, clearLogMessage, isTouchSimulationEnabled }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const prevStage = useRef(stage);
    const highlightedElementsRef = useRef<Element[]>([]);
    const isTouchDevice = useIsTouchDevice(isTouchSimulationEnabled);

    const step = TUTORIAL_SCRIPT[stage];

    useEffect(() => {
        if (!step) return;

        let targetIds: string[] = [];
        if (stage === 15) { // Special conditional logic for the mining stage
            const hasCopper = inventory.some(i => i?.itemId === 'copper_ore');
            const hasTin = inventory.some(i => i?.itemId === 'tin_ore');
            if (!hasCopper) targetIds.push('activity-button-0'); // Copper ore
            if (!hasTin) targetIds.push('activity-button-1');   // Tin ore
        } else if (step.highlight) {
            targetIds = Array.isArray(step.highlight) ? step.highlight : [step.highlight];
        }

        const intervalId = setInterval(() => {
            const newHighlightedElements = new Set<Element>();
            targetIds.forEach(id => {
                const el = document.querySelector(`[data-tutorial-id="${id}"]`);
                if (el) newHighlightedElements.add(el);
            });

            // Remove highlight from old elements that are no longer targeted
            highlightedElementsRef.current.forEach(oldEl => {
                if (!newHighlightedElements.has(oldEl)) {
                    oldEl.classList.remove('tutorial-highlight-target');
                }
            });

            // Add highlight to new elements
            newHighlightedElements.forEach(newEl => {
                if (!newEl.classList.contains('tutorial-highlight-target')) {
                    newEl.classList.add('tutorial-highlight-target');
                }
            });
            
            highlightedElementsRef.current = Array.from(newHighlightedElements);
        }, 100); // Poll to catch elements that might re-render

        // Cleanup function for when the effect re-runs or component unmounts
        return () => {
            clearInterval(intervalId);
            highlightedElementsRef.current.forEach(el => {
                el.classList.remove('tutorial-highlight-target');
            });
            highlightedElementsRef.current = [];
        };
    }, [stage, step, inventory]); // Re-run whenever stage or inventory changes

    useEffect(() => {
        if (stage !== prevStage.current) {
            setIsFadingOut(true);
            const timer = setTimeout(() => {
                setIsFadingOut(false);
                prevStage.current = stage;
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [stage]);

    if (!step) return null;

    const handleButtonClick = () => {
        if (step.completionCondition) {
            advanceTutorial(step.completionCondition);
        }
    };
    
    const instructionText = isTouchDevice ? "Long-press" : "Right-click";
    
    const renderObjective = () => {
        if (!step.objective) return null;

        if (stage === 15) { // Mine ores
            const hasCopper = inventory.some(i => i && i.itemId === 'copper_ore');
            const hasTin = inventory.some(i => i && i.itemId === 'tin_ore');
            return (
                <p className="font-semibold text-center text-lg">
                    Mine <span className={hasCopper ? 'text-green-400 line-through' : ''}>1 Copper Ore</span> and <span className={hasTin ? 'text-green-400 line-through' : ''}>1 Tin Ore</span>.
                </p>
            );
        }
        return <p className="font-semibold text-center text-lg">{step.objective.replace('{ACTION}', instructionText)}</p>;
    }

    const renderContent = () => {
        if (logMessage) {
            return (
                <div className="flex flex-col justify-between items-center w-full md:w-1/2 bg-black/50 p-2 rounded-md border border-gray-700">
                    <div className="flex-grow flex items-center">
                        <p className="font-semibold text-center text-lg">{logMessage}</p>
                    </div>
                    <div className="mt-auto pt-1">
                        <button
                            onClick={clearLogMessage}
                            className="text-yellow-400 hover:text-yellow-300 underline text-sm"
                        >
                            (Click to continue)
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col justify-between items-center w-full md:w-1/2 bg-black/50 p-2 rounded-md border border-gray-700">
                <div className="flex-grow flex items-center">
                    {renderObjective()}
                </div>
                {(step.completionCondition === 'continue' || step.completionCondition === 'depart') && (
                    <div className="mt-auto pt-1">
                        <Button onClick={handleButtonClick} size="sm">
                            {step.completionCondition === 'depart' ? 'Depart' : 'Continue'}
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    const guideText = overrideGuideText || step.guideText.replace('{ACTION}', instructionText);
    
    const handleToggleMinimize = () => setIsMinimized(prev => !prev);

    return (
        <div className="absolute inset-0 z-50 pointer-events-none">
            {/* Dialogue/Instruction Box */}
            <div className={`absolute bottom-2 left-2 right-2 md:left-4 md:right-auto md:w-[calc(75%-2.25rem)] ${isMinimized ? 'h-auto' : 'h-auto md:h-52'} bg-gray-900/90 border-2 border-yellow-700 rounded-lg shadow-2xl p-3 pointer-events-auto transition-all duration-300 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
                {isMinimized ? (
                    <div onClick={handleToggleMinimize} className="flex items-center gap-3 cursor-pointer">
                        <img src="/assets/npcChatHeads/tavern_regular.png" alt="Leo the Guide" className="w-10 h-10 bg-gray-800 border-2 border-gray-600 rounded-full flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-bold text-yellow-400">Leo the Guide</h3>
                            <p className="text-xs text-gray-400">Click to expand</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row h-full gap-3">
                        {/* Left part: Guide info */}
                        <div className="flex items-center gap-3 w-full md:w-1/2 cursor-pointer" onClick={handleToggleMinimize}>
                            <img src="/assets/npcChatHeads/tavern_regular.png" alt="Leo the Guide" className="w-16 h-16 bg-gray-800 border-2 border-gray-600 rounded-full flex-shrink-0" />
                            <div className="h-full overflow-y-auto pr-1">
                                <h3 className="text-lg font-bold text-yellow-400">Leo the Guide</h3>
                                <p className="text-base text-gray-300 italic">"{guideText}"</p>
                            </div>
                        </div>
                        {/* Right part: Objective and action */}
                        {renderContent()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorialOverlay;
