import React, { useState } from 'react';
import Button from '../common/Button';
import { PlayerType } from '../../types';

interface GameModeSelectionProps {
    onSelect: (playerType: PlayerType) => void;
    onCancel: () => void;
}

const GameModeSelection: React.FC<GameModeSelectionProps> = ({ onSelect, onCancel }) => {
    const [selectedMode, setSelectedMode] = useState<PlayerType | null>(null);

    const modes = [
        { type: PlayerType.Normal, title: "Normal", description: "The standard gameplay experience. Balanced for single-player with future multiplayer compatibility in mind." },
        { type: PlayerType.Hardcore, title: "Hardcore", description: "A challenging mode with permanent death. If your character dies, they cannot be played again." },
        { type: PlayerType.Cheats, title: "Cheats", description: "Developer mode. Grants access to the developer panel for testing, spawning items, and other cheats." },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 z-[90] animate-fade-in overflow-y-auto md:flex md:items-center md:justify-center">
            <div className="bg-gray-800 p-6 w-full max-w-4xl min-h-full md:min-h-0 md:h-auto md:border-2 md:border-gray-600 md:rounded-lg md:shadow-xl">
                <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Choose Your Game Mode</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {modes.map(mode => (
                        <button
                            key={mode.type}
                            onClick={() => setSelectedMode(mode.type)}
                            className={`p-6 rounded-lg border-2 text-left transition-all duration-200 ${
                                selectedMode === mode.type ? 'bg-yellow-800/50 border-yellow-500 scale-105' : 'bg-gray-900/50 border-gray-700 hover:border-yellow-600 hover:bg-gray-800/50'
                            }`}
                        >
                            <h3 className="text-2xl font-bold text-yellow-300">{mode.title}</h3>
                            <p className="text-sm mt-2 text-gray-300">{mode.description}</p>
                        </button>
                    ))}
                </div>
                <div className="flex justify-center gap-4 mt-8">
                    <Button onClick={() => onSelect(selectedMode!)} disabled={!selectedMode}>
                        Continue
                    </Button>
                    <Button onClick={onCancel} variant="secondary">Back</Button>
                </div>
            </div>
        </div>
    );
};

export default GameModeSelection;
