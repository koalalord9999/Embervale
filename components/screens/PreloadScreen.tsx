
import React, { useState, useEffect, useMemo } from 'react';
import Button from '../common/Button';
import { ContextMenuState } from '../../hooks/useUIState';

interface PreloadScreenProps {
    loadingTips: string[];
    onContinue: () => void;
    onNewGame: () => void;
    onImport: () => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
}

const PreloadScreen: React.FC<PreloadScreenProps> = ({ loadingTips, onContinue, onNewGame, onImport, setContextMenu }) => {
    const [buttonsEnabled, setButtonsEnabled] = useState(false);
    
    const randomTips = useMemo(() => {
        const shuffled = [...loadingTips].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2);
    }, [loadingTips]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setButtonsEnabled(true);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    const handleContinueContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({
            options: [
                {
                    label: 'Import Save',
                    onClick: onImport,
                },
            ],
            position: { x: e.clientX, y: e.clientY },
        });
    };

    return (
        <div className="w-[1024px] h-[768px] bg-cover bg-center border-8 border-gray-900 shadow-2xl p-4 flex flex-col items-center justify-center relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505236755279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop')` }}>
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="relative z-10 text-center animate-fade-in bg-black/60 p-8 rounded-lg border-2 border-gray-700 shadow-2xl w-full max-w-2xl">
                <h1 className="text-6xl font-bold text-yellow-400 mb-6" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>Embervale</h1>
                
                <div className="w-16 h-16 mx-auto mb-6 animate-spin-slow">
                    <img src="https://api.iconify.design/game-icons:yin-yang.svg" alt="Loading symbol" className="w-full h-full filter invert text-yellow-500"/>
                </div>

                <div className="text-lg text-gray-300 italic min-h-[72px] space-y-2">
                    {randomTips.map((tip, index) => <p key={index}>{tip}</p>)}
                </div>

                <div className="mt-8 flex justify-center gap-6">
                    <Button onClick={onNewGame} disabled={!buttonsEnabled} variant="secondary" size="md">New Game</Button>
                    <Button 
                        onClick={onContinue} 
                        disabled={!buttonsEnabled} 
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
