import React from 'react';
import { Slot } from '../../types';
import Button from '../common/Button';

interface DeadCharacterViewProps {
    slot: Slot;
    onDelete: () => void;
}

const DeadCharacterView: React.FC<DeadCharacterViewProps> = ({ slot, onDelete }) => {
    const { metadata } = slot;
    if (!metadata) return null;

    return (
        <div className="animate-fade-in flex flex-col items-center text-center p-8 bg-black/50 border-2 border-red-700 rounded-lg">
            <img src="https://api.iconify.design/game-icons:tombstone.svg" alt="Tombstone" className="w-24 h-24 filter invert opacity-50 mb-4" />
            <h2 className="text-4xl font-bold text-red-400">Here Lies</h2>
            <h3 className="text-5xl font-bold text-gray-200 mt-2">{metadata.username}</h3>
            <p className="text-lg text-gray-400 mt-4">A Hardcore adventurer who has fallen.</p>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-lg mt-6 bg-gray-900/50 p-4 rounded-md">
                <p>Final Combat Level:</p><p className="font-semibold">{metadata.combatLevel}</p>
                <p>Final Total Level:</p><p className="font-semibold">{metadata.totalLevel}</p>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">"The journey has ended, but the story will be remembered."</p>

            <Button onClick={onDelete} size="md" variant="secondary" className="mt-8">
                Delete Character
            </Button>
        </div>
    );
};

export default DeadCharacterView;
