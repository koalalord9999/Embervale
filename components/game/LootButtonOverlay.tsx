import React from 'react';
import { GroundItem } from '../../types';

interface LootButtonOverlayProps {
    groundItems: GroundItem[];
    onOpenLootView: () => void;
}

const LootButtonOverlay: React.FC<LootButtonOverlayProps> = ({ groundItems, onOpenLootView }) => {
    if (groundItems.length === 0) {
        return null;
    }

    return (
        <button
            onClick={onOpenLootView}
            className="absolute bottom-4 left-4 z-20 flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/80 animate-fade-in"
            aria-label={`Loot ${groundItems.length} items`}
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
        >
            <img src="https://api.iconify.design/game-icons:swap-bag.svg" alt="" className="w-8 h-8 filter invert drop-shadow-lg" />
            <span className="font-bold text-white text-lg">Loot ({groundItems.length})</span>
        </button>
    );
};

export default LootButtonOverlay;
