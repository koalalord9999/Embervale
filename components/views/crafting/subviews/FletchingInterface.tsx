

import React from 'react';
import { InventorySlot, PlayerSkill, SkillName } from '../../../../types';
import { FLETCHING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import Button from '../../../common/Button';
import { MakeXPrompt } from '../../../../hooks/useUIState';
import { CraftingViewProps } from '../CraftingView';
import { useLongPress } from '../../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../../hooks/useIsTouchDevice';

const FletchingSlot: React.FC<{
    recipe: typeof FLETCHING_RECIPES.carving['logs'][0];
    fletchingLevel: number;
    logId: string;
    logCount: number;
    inventory: (InventorySlot | null)[];
    onFletch: CraftingViewProps['onFletch'];
    setContextMenu: CraftingViewProps['setContextMenu'];
    setMakeXPrompt: CraftingViewProps['setMakeXPrompt'];
    setTooltip: CraftingViewProps['setTooltip'];
    isTouchDevice: boolean;
}> = ({ recipe, fletchingLevel, logId, logCount, inventory, onFletch, setContextMenu, setMakeXPrompt, setTooltip, isTouchDevice }) => {
    const item = ITEMS[recipe.itemId];
    if (!item) return null;

    const hasLevel = fletchingLevel >= recipe.level;
    const hasLogs = logCount >= 1;
    const canFletch = hasLevel && hasLogs;
    const action = { type: 'carve', payload: { logId, outputItemId: recipe.itemId } } as const;

    const handleSingleTap = () => { if(canFletch) { onFletch(action, 1); setTooltip(null); } };

    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const event = 'touches' in e ? e.touches[0] : e;
        setContextMenu({
            options: [
                { label: 'Fletch 1', onClick: () => onFletch(action, 1), disabled: !canFletch },
                { label: 'Fletch 5', onClick: () => onFletch(action, 5), disabled: !canFletch || logCount < 5 },
                { label: 'Fletch All', onClick: () => onFletch(action, logCount), disabled: !canFletch },
                {
                    label: 'Fletch X...',
                    onClick: () => setMakeXPrompt({
                        title: `Fletch ${item.name}`, max: logCount,
                        onConfirm: (quantity) => onFletch(action, quantity)
                    }),
                    disabled: !canFletch
                },
            ], event, isTouchInteraction: isTouchDevice
        });
    };

    const longPressHandlers = useLongPress({ onLongPress: handleLongPress, onClick: handleSingleTap });

    const handleMouseEnter = (e: React.MouseEvent) => {
        const outputQuantity = recipe.quantity ?? 1;
        const craftTime = recipe.itemId === 'arrow_shaft' ? 0.6 : 1.8;
        const hasRequiredLogs = logCount >= 1;
        const hasKnife = inventory.some(i => i?.itemId === 'knife');
    
        const tooltipContent = (
            <div className="text-sm text-left w-48">
                <p className="font-bold text-yellow-300 mb-2 pb-1 border-b border-gray-600">{item.name}</p>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Materials</p>
                <ul className="list-disc list-inside mb-2">
                    <li className={hasRequiredLogs ? 'text-green-400' : 'text-red-400'}>{ITEMS[logId].name} x1</li>
                    <li className={hasKnife ? 'text-green-400' : 'text-red-400'}>Knife</li>
                </ul>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Output</p>
                <p className="mb-2 text-gray-300">{item.name} x{outputQuantity}</p>
                
                <div className="grid grid-cols-2 gap-x-4 text-xs">
                    <span className="text-gray-400">{SkillName.Fletching} XP:</span>
                    <span className="font-semibold text-right">{recipe.xp.toLocaleString()}</span>
                    <span className="text-gray-400">Craft Time:</span>
                    <span className="font-semibold text-right">{craftTime.toFixed(1)}s</span>
                </div>
            </div>
        );
    
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <div 
            className={`crafting-slot ${!canFletch ? 'disabled' : ''}`} 
            {...longPressHandlers}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            <div className={`crafting-slot-level ${hasLevel ? 'met' : 'unmet'}`}>
                Lvl {recipe.level}
            </div>
            <img src={item.iconUrl} alt={item.name} className={`crafting-slot-icon ${getIconClassName(item)}`} />
            {recipe.quantity && recipe.quantity > 1 && (
                <span className="absolute top-1 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                    x{recipe.quantity}
                </span>
            )}
            <div className="crafting-slot-ingredients">
                <div className="ingredient-icon" title={ITEMS[logId].name}>
                    <img src={ITEMS[logId].iconUrl} alt={ITEMS[logId].name} className={getIconClassName(ITEMS[logId])} />
                </div>
            </div>
        </div>
    );
};

const FletchingInterface: React.FC<CraftingViewProps> = ({ inventory, skills, onFletch, setContextMenu, setMakeXPrompt, context, setTooltip }) => {
    if (context.type !== 'fletching') return null;
    const { logId } = context;

    const fletchingLevel = skills.find(s => s.name === SkillName.Fletching)?.currentLevel ?? 1;
    const isTouchDevice = useIsTouchDevice(false);
    const logName = ITEMS[logId].name;
    const recipes = FLETCHING_RECIPES.carving[logId] ?? [];
    
    const logCount = inventory.reduce((total, slot) => {
        if (slot && slot.itemId === logId && !slot.noted) {
            return total + slot.quantity;
        }
        return total;
    }, 0);

    return (
        <div className="flex-grow overflow-y-auto pr-2">
            <p className="mb-4 text-lg">Your {logName}: <span className="text-yellow-400">{logCount}</span></p>
            <div className="crafting-grid">
                {recipes.map((recipe) => (
                    <FletchingSlot
                        key={recipe.itemId}
                        recipe={recipe}
                        fletchingLevel={fletchingLevel}
                        logId={logId}
                        logCount={logCount}
                        inventory={inventory}
                        onFletch={onFletch}
                        setContextMenu={setContextMenu}
                        setMakeXPrompt={setMakeXPrompt}
                        setTooltip={setTooltip}
                        isTouchDevice={isTouchDevice}
                    />
                ))}
            </div>
        </div>
    );
};

export default FletchingInterface;
