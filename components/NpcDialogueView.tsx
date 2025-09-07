import React, { useState } from 'react';
import { NpcDialogueState } from '../hooks/useUIState';
import Button from './common/Button';

interface NpcDialogueViewProps {
    npc: NpcDialogueState;
    onClose: () => void;
}

const NpcDialogueView: React.FC<NpcDialogueViewProps> = ({ npc, onClose }) => {
    const [dialogueIndex, setDialogueIndex] = useState(0);

    if (!npc.dialogue || npc.dialogue.length === 0) {
        // Fallback for empty dialogue
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-xl">{npc.name} has nothing to say.</p>
                <Button onClick={onClose} className="mt-4">Close</Button>
            </div>
        );
    }

    const isLastLine = dialogueIndex >= npc.dialogue.length - 1;

    const handleNext = () => {
        if (isLastLine) {
            onClose();
        } else {
            setDialogueIndex(prev => prev + 1);
        }
    };

    return (
        <div className="flex flex-col h-full animate-fade-in p-4">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-gray-600">
                <img 
                    src={npc.icon} 
                    alt={npc.name} 
                    className="w-24 h-24 bg-gray-900 border-4 border-gray-600 rounded-full pixelated-image" 
                />
                <h2 className="text-3xl font-bold text-yellow-400">{npc.name}</h2>
            </div>
            
            <div className="flex-grow bg-black/50 p-4 rounded-lg text-lg leading-relaxed italic text-gray-300 mb-4 flex items-center">
                <p>"{npc.dialogue[dialogueIndex]}"</p>
            </div>
            
            <div className="flex justify-end">
                <Button 
                    onClick={handleNext} 
                    variant="primary"
                >
                    {isLastLine ? 'Close' : 'Next'}
                </Button>
            </div>
        </div>
    );
};

export default NpcDialogueView;