import React, { useState, useEffect, useMemo } from 'react';
import { useUIState } from '../../hooks/useUIState';
import Button from './Button';

interface GuidedTutorialOverlayProps {
    ui: ReturnType<typeof useUIState>;
}

const GuidedTutorialOverlay: React.FC<GuidedTutorialOverlayProps> = ({ ui }) => {
    const { activeTutorial, setActiveTutorial } = ui;
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const currentStep = activeTutorial?.steps[activeTutorial.currentStepIndex];

    useEffect(() => {
        if (!currentStep) return;

        const updateRect = () => {
            const element = document.querySelector(`[data-tut="${currentStep.targetId}"]`);
            if (element) {
                setTargetRect(element.getBoundingClientRect());
            } else {
                setTargetRect(null);
            }
        };

        updateRect();
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect);
        
        const interval = setInterval(updateRect, 200);

        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect);
            clearInterval(interval);
        };
    }, [currentStep]);

    if (!activeTutorial || !currentStep) return null;

    const handleNext = () => {
        if (activeTutorial.currentStepIndex < activeTutorial.steps.length - 1) {
            setActiveTutorial({
                ...activeTutorial,
                currentStepIndex: activeTutorial.currentStepIndex + 1
            });
        } else {
            setActiveTutorial(null);
        }
    };

    const handlePrev = () => {
        if (activeTutorial.currentStepIndex > 0) {
            setActiveTutorial({
                ...activeTutorial,
                currentStepIndex: activeTutorial.currentStepIndex - 1
            });
        }
    };

    const handleSkip = () => setActiveTutorial(null);

    // Calculate text box position
    const boxStyle: React.CSSProperties = useMemo(() => {
        if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 110 };

        const { top, left, width, height } = targetRect;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let boxX = left + width / 2;
        let boxY = top + height + 20; // Default to below

        // If too close to bottom, show above
        if (boxY + 220 > screenHeight) {
            boxY = Math.max(20, top - 240); // At least 20px from top
        }

        // Horizontal clamping
        boxX = Math.max(170, Math.min(screenWidth - 170, boxX));

        return {
            top: boxY,
            left: boxX,
            transform: 'translateX(-50%)',
            zIndex: 110
        };
    }, [targetRect]);

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            {/* Dark Overlay with Hole */}
            <svg className="absolute inset-0 w-full h-full pointer-events-auto z-[101]">
                <defs>
                    <mask id="tutorial-mask">
                        <rect width="100%" height="100%" fill="white" />
                        {targetRect && (
                            <rect
                                x={targetRect.left - 4}
                                y={targetRect.top - 4}
                                width={targetRect.width + 8}
                                height={targetRect.height + 8}
                                rx="4"
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.7)" mask="url(#tutorial-mask)" />
                {/* Yellow Highlight Border */}
                {targetRect && (
                    <rect
                        x={targetRect.left - 6}
                        y={targetRect.top - 6}
                        width={targetRect.width + 12}
                        height={targetRect.height + 12}
                        rx="6"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="3"
                        className="animate-pulse"
                    />
                )}
            </svg>

            {/* Instruction Box Container - Ensures it is visually on top of the SVG */}
            <div className="relative w-full h-full pointer-events-none z-[110]">
                <div 
                    className="absolute w-80 bg-gray-900 border-2 border-yellow-600 rounded-lg shadow-2xl p-4 pointer-events-auto flex flex-col animate-fade-in"
                    style={boxStyle}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-yellow-500 font-bold text-sm">
                            {activeTutorial.currentStepIndex + 1} / {activeTutorial.steps.length}
                        </span>
                        <button onClick={handleSkip} className="text-gray-500 hover:text-white text-2xl font-bold leading-none">&times;</button>
                    </div>
                    
                    <div className="text-gray-200 text-sm italic mb-6 leading-relaxed">
                        {currentStep.description}
                    </div>

                    <div className="flex justify-between gap-2 mt-auto">
                        <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={handlePrev} 
                            disabled={activeTutorial.currentStepIndex === 0}
                            className="flex-1"
                        >
                            Previous
                        </Button>
                        <Button 
                            size="sm" 
                            variant="primary" 
                            onClick={handleNext}
                            className="flex-1"
                        >
                            {activeTutorial.currentStepIndex === activeTutorial.steps.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidedTutorialOverlay;