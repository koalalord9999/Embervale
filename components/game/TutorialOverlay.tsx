
import React, { useEffect, useState, useRef } from 'react';
import { TUTORIAL_SCRIPT, ITEMS } from '../../constants';
import Button from '../common/Button';
import { InventorySlot } from '../../types';

interface TutorialOverlayProps {
    stage: number;
    advanceTutorial: (condition: string) => void;
    overrideGuideText?: string | null;
    inventory: (InventorySlot | null)[];
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ stage, advanceTutorial, overrideGuideText, inventory }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const prevStage = useRef(stage);
    const highlightedElementsRef = useRef<Element[]>([]);

    const step = TUTORIAL_SCRIPT[stage];

    useEffect(() => {
        if (!step) return;

        let targetIds: string[] = [];
        if (stage === 14) { // Special conditional logic for the mining stage
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

    if (stage === 0) {
        return <div className="absolute inset-0 bg-black/50 z-40 pointer-events-none"></div>;
    }

    const handleContinue = () => {
        advanceTutorial('continue');
    };
    
    const renderObjective = () => {
        if (!step.objective) return null;

        if (stage === 14) { // Mine ores
            const hasCopper = inventory.some(i => i && i.itemId === 'copper_ore');
            const hasTin = inventory.some(i => i && i.itemId === 'tin_ore');
            return (
                <p className="font-semibold text-center text-lg">
                    Mine <span className={hasCopper ? 'text-green-400 line-through' : ''}>1 Copper Ore</span> and <span className={hasTin ? 'text-green-400 line-through' : ''}>1 Tin Ore</span>.
                </p>
            );
        }
        return <p className="font-semibold text-center text-lg">{step.objective}</p>;
    }

    return (
        <div className="absolute inset-0 z-50 pointer-events-none">
            {/* Dialogue/Instruction Box */}
            <div className={`absolute bottom-4 left-4 w-full max-w-xl bg-gray-900/90 border-2 border-yellow-700 rounded-lg shadow-2xl p-4 pointer-events-auto transition-opacity duration-300 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex items-center gap-4 mb-3">
                    <img src="/assets/npcChatHeads/tavern_regular.png" alt="Leo the Guide" className="w-16 h-16 bg-gray-800 border-2 border-gray-600 rounded-full flex-shrink-0" />
                    <div>
                        <h3 className="text-xl font-bold text-yellow-400">Leo the Guide</h3>
                        <p className="text-gray-300 italic">"{overrideGuideText || step.guideText}"</p>
                    </div>
                </div>
                
                <div className="bg-black/50 p-3 rounded-md border border-gray-700">
                    {renderObjective()}
                </div>

                {step.completionCondition === 'continue' && (
                    <div className="flex justify-end mt-3">
                        <Button onClick={handleContinue}>Continue</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorialOverlay;
