
import React from 'react';
import { InventorySlot, PlayerSkill, SkillName } from '../../../types';
import { FLETCHING_RECIPES, ITEMS, getIconClassName } from '../../../constants';
import Button from '../../common/Button';
import { MakeXPrompt } from '../../../hooks/useUIState';

interface FletchingViewProps {
    logId: string;
    inventory: InventorySlot[];
    skills: PlayerSkill[];
    onFletch: (action: { type: 'carve'; payload: any }, quantity: number) => void;
    onExit: () => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
}

const FletchingView: React.FC<FletchingViewProps> = ({ logId, inventory, skills, onFletch, onExit, setMakeXPrompt }) => {
    const fletchingLevel = skills.find(s => s.name === SkillName.Fletching)?.level ?? 1;
    const logName = ITEMS[logId].name;
    const recipes = FLETCHING_RECIPES.carving[logId] ?? [];
    const logCount = inventory.filter(s => s.itemId === logId).length;

    return (
        <div className="flex flex-col h-full text-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-yellow-400">Fletching - {logName}</h1>
                <Button onClick={onExit}>Exit</Button>
            </div>
            <p className="mb-4 text-lg">Your {logName}: <span className="text-yellow-400">{logCount}</span></p>

            <div className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipes.map((recipe) => {
                        const item = ITEMS[recipe.itemId];
                        if (!item) return null;

                        const hasLevel = fletchingLevel >= recipe.level;
                        const hasLogs = logCount >= 1;
                        const canFletch = hasLevel && hasLogs;

                        return (
                            <div 
                                key={recipe.itemId} 
                                className={`bg-gray-900 p-3 rounded-lg border-2 ${canFletch ? 'border-gray-600' : 'border-red-800/50'}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={item.iconUrl} alt={item.name} className={`w-10 h-10 bg-black/30 p-1 rounded ${getIconClassName(item)}`} />
                                    <h3 className="text-lg font-semibold text-yellow-300">{item.name} {recipe.quantity ? `x${recipe.quantity}`: ''}</h3>
                                </div>
                                <div className="text-sm space-y-1 mb-3">
                                    <p className={hasLevel ? 'text-gray-400' : 'text-red-400'}>
                                        Lvl: {recipe.level}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => onFletch({ type: 'carve', payload: { logId, outputItemId: recipe.itemId } }, 1)}
                                        disabled={!canFletch}
                                        className="w-full"
                                    >
                                        Fletch 1
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => setMakeXPrompt({
                                            title: `Fletch ${item.name}`,
                                            max: logCount,
                                            onConfirm: (quantity) => onFletch({ type: 'carve', payload: { logId, outputItemId: recipe.itemId } }, quantity)
                                        })}
                                        disabled={!canFletch}
                                        className="w-full"
                                    >
                                        Fletch X...
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FletchingView;
