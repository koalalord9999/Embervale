
import React, { useState, useEffect } from 'react';
import { ActiveCraftingAction } from '../../../types';
import { ITEMS, getIconClassName } from '../../../constants';
import Button from '../../common/Button';
import ProgressBar from '../../common/ProgressBar';

interface CraftingProgressViewProps {
    action: ActiveCraftingAction;
    onCancel: () => void;
}

const CraftingProgressView: React.FC<CraftingProgressViewProps> = ({ action, onCancel }) => {
    const [progress, setProgress] = useState(0);
    const item = ITEMS[action.recipeId];

    useEffect(() => {
        let frameId: number;
        const updateProgress = () => {
            const elapsed = Date.now() - action.startTime;
            const newProgress = Math.min(100, (elapsed / action.duration) * 100);
            setProgress(newProgress);
            if (newProgress < 100) {
                frameId = requestAnimationFrame(updateProgress);
            }
        };
        frameId = requestAnimationFrame(updateProgress);
        return () => cancelAnimationFrame(frameId);
    }, [action.startTime, action.duration]);

    if (!item) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-red-500">Error: Could not find item being crafted.</p>
                <Button onClick={onCancel} className="mt-4">Cancel</Button>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Crafting: {item.name}</h2>
            
            <div className="w-24 h-24 bg-gray-900 border-4 border-gray-600 rounded-lg flex items-center justify-center mb-4">
                <img src={item.iconUrl} alt={item.name} className={`w-16 h-16 ${getIconClassName(item)}`} />
            </div>

            <div className="w-full max-w-md bg-black/50 p-4 rounded-lg space-y-3">
                <p className="font-semibold">
                    Completed: {action.completedQuantity} / {action.totalQuantity}
                </p>
                <ProgressBar value={progress} maxValue={100} color="bg-green-600" />
            </div>

            <Button onClick={onCancel} variant="secondary" className="mt-6">
                Cancel
            </Button>
        </div>
    );
};

export default CraftingProgressView;
