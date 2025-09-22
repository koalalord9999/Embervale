import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';
import { ContextMenuState } from '../../hooks/useUIState';
import ProgressBar from '../common/ProgressBar';

interface PreloadScreenProps {
    loadingTips: string[];
    onContinue: () => void;
    onNewGame: () => void;
    onImport: () => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
}

const PreloadScreen: React.FC<PreloadScreenProps> = ({ loadingTips, onContinue, onNewGame, onImport, setContextMenu }) => {
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [currentTip, setCurrentTip] = useState('');
    const [isTipVisible, setIsTipVisible] = useState(false);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const messageTimeouts: ReturnType<typeof setTimeout>[] = [];
        
        const messages = [
            { msg: 'Checking for updates...', delay: 0 },
            { msg: 'No updates found', delay: 400 },
            { msg: 'Loading database...', delay: 800 },
            { msg: 'Database loaded.', delay: 1200 },
            { msg: 'Connecting to the server...', delay: 1600 },
            { msg: 'Connected.', delay: 2000 },
            { msg: 'Finalizing game...', delay: 2001 },
        ];

        messages.forEach(item => {
            messageTimeouts.push(setTimeout(() => {
                setLoadingMessage(item.msg);
            }, item.delay));
        });

        const startTime = Date.now();
        const totalDuration = 4000;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            
            if (elapsed < 2000) {
                // Stage 1: 0 -> 80%
                setProgress((elapsed / 2000) * 80);
            } else if (elapsed < 3000) {
                // Stage 2: 80 -> 99%
                const stageElapsed = elapsed - 2000;
                setProgress(80 + (stageElapsed / 1000) * 19);
            } else if (elapsed < totalDuration) {
                // Stage 3: Hold at 99%
                setProgress(99);
            } else {
                // Stage 4: Finish
                setProgress(100);
                setTimeout(() => {
                    setIsFadingOut(true);
                    setTimeout(() => {
                        setIsLoading(false);
                        setShowButtons(true);
                    }, 500); // fade out duration
                }, 100);
                return; // Stop animation loop
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            messageTimeouts.forEach(clearTimeout);
        };
    }, []);

    // Effect for cycling tips after loading
    useEffect(() => {
        let tipInterval: ReturnType<typeof setInterval> | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        if (showButtons && loadingTips.length > 0) {
            // Set the first tip and fade it in
            setCurrentTip(loadingTips[Math.floor(Math.random() * loadingTips.length)]);
            timeoutId = setTimeout(() => setIsTipVisible(true), 100);

            // Set up the interval for subsequent tips
            tipInterval = setInterval(() => {
                setIsTipVisible(false); // Start fading out

                timeoutId = setTimeout(() => {
                    setCurrentTip(prevTip => {
                        let newTip = prevTip;
                        // Ensure we don't show the same tip twice in a row
                        while (newTip === prevTip && loadingTips.length > 1) {
                            newTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
                        }
                        return newTip;
                    });
                    setIsTipVisible(true); // Start fading in the new tip
                }, 500); // Match fade-out duration
            }, 5000); // Cycle every 5 seconds

            return () => {
                if (tipInterval) clearInterval(tipInterval);
                if (timeoutId) clearTimeout(timeoutId);
            };
        }
    }, [showButtons, loadingTips]);

    const handleContinueContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({
            options: [{ label: 'Import Save', onClick: onImport }],
            event: e,
            isTouchInteraction: false,
        });
    };

    return (
        <div className="w-full h-full bg-cover bg-center border-8 border-gray-900 shadow-2xl p-4 flex flex-col items-center justify-center relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505236755279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop')` }}>
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="relative z-10 text-center bg-black/60 p-8 rounded-lg border-2 border-gray-700 shadow-2xl w-full max-w-2xl flex flex-col items-center">
                <h1 className="text-4xl sm:text-6xl font-bold text-yellow-400 mb-6" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>Embrune</h1>
                
                <div className="w-full max-w-md h-24 flex flex-col justify-center items-center">
                    {isLoading ? (
                        <div className={`w-full transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
                            <ProgressBar value={progress} maxValue={100} color="bg-yellow-400" />
                            <p className="text-lg text-gray-300 italic min-h-[28px] mt-2">
                                {loadingMessage}
                            </p>
                        </div>
                    ) : (
                        <p className={`text-lg text-gray-300 italic transition-opacity duration-500 ease-in-out h-full flex items-center justify-center ${isTipVisible ? 'opacity-100' : 'opacity-0'}`}>
                            {currentTip ? `"${currentTip}"` : ''}
                        </p>
                    )}
                </div>

                <div className={`flex justify-center gap-6 ${showButtons ? 'animate-fade-in' : 'opacity-0'}`}>
                    <Button onClick={onNewGame} disabled={!showButtons} variant="secondary" size="md">New Game</Button>
                    <Button 
                        onClick={onContinue} 
                        disabled={!showButtons} 
                        variant="primary" 
                        size="md"
                        onContextMenu={handleContinueContextMenu}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PreloadScreen;
