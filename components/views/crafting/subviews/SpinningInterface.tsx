

import React from 'react';
import { SkillName } from '../../../../types';
import { SPINNING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import { CraftingViewProps } from '../CraftingView';
import { useLongPress } from '../../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../../hooks/useIsTouchDevice';

const SpinningSlot: React.FC<{
    recipe: typeof SPINNING_RECIPES[0];
    craftingLevel: number;
    getIngredientCount: (itemId: string) => number;
    onSpin: (itemId: string, quantity: number) => void;
    setContextMenu: CraftingViewProps['setContextMenu'];
    setMakeXPrompt: CraftingViewProps['setMakeXPrompt'];
    setTooltip: CraftingViewProps['setTooltip'];
    isTouchDevice: boolean;
}> = ({ recipe, craftingLevel, getIngredientCount, onSpin, setContextMenu, setMakeXPrompt, setTooltip, isTouchDevice }) => {
    const item = ITEMS[recipe.itemId];
    if (!item) return null;

    const hasLevel = craftingLevel >= recipe.level;
    const maxCraftable = Math.min(
        ...recipe.ingredients.map(ing => Math.floor(getIngredientCount(ing.itemId) / ing.quantity))
    );
    const hasIngredients = maxCraftable > 0;
    const canCraft = hasLevel && hasIngredients;

    const handleSingleTap = () => { if (canCraft) { onSpin(recipe.itemId, 1); setTooltip(null); } };

    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const event = 'touches' in e ? e.touches[0] : e;
        setContextMenu({
            options: [
                { label: 'Spin 1', onClick: () => onSpin(recipe.itemId, 1), disabled: !canCraft },
                { label: 'Spin 5', onClick: () => onSpin(recipe.itemId, 5), disabled: !canCraft || maxCraftable < 5 },
                { label: 'Spin All', onClick: () => onSpin(recipe.itemId, maxCraftable), disabled: !canCraft },
                { 
                    label: 'Spin X...', 
                    onClick: () => setMakeXPrompt({
                        title: `Spin ${item.name}`, max: maxCraftable,
                        onConfirm: (quantity) => onSpin(recipe.itemId, quantity)
                    }), 
                    disabled: !canCraft
                },
            ], event, isTouchInteraction: isTouchDevice
        });
    };

    const longPressHandlers = useLongPress({ onLongPress: handleLongPress, onClick: handleSingleTap });

    const handleMouseEnter = (e: React.MouseEvent) => {
        const ingredients = recipe.ingredients.map(ing => ({ item: ITEMS[ing.itemId], quantity: ing.quantity }));
        const craftTime = 1.2;
    
        const tooltipContent = (
            <div className="text-sm text-left w-48">
                <p className="font-bold text-yellow-300 mb-2 pb-1 border-b border-gray-600">{item.name}</p>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Materials</p>
                <ul className="list-disc list-inside mb-2">
                    {ingredients.map(ing => {
                        const hasIngredient = getIngredientCount(ing.item.id) >= ing.quantity;
                        return <li key={ing.item.id} className={hasIngredient ? 'text-green-400' : 'text-red-400'}>{ing.item.name} x{ing.quantity}</li>;
                    })}
                </ul>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Output</p>
                <p className="mb-2 text-gray-300">{item.name} x1</p>
                
                <div className="grid grid-cols-2 gap-x-4 text-xs">
                    <span className="text-gray-400">{SkillName.Crafting} XP:</span>
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
            className={`crafting-slot ${!canCraft ? 'disabled' : ''}`} 
            {...longPressHandlers}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            <div className={`crafting-slot-level ${hasLevel ? 'met' : 'unmet'}`}>
                Lvl {recipe.level}
            </div>
            <img src={item.iconUrl} alt={item.name} className={`crafting-slot-icon ${getIconClassName(item)}`} />
            <div className="crafting-slot-ingredients">
                {recipe.ingredients.map(ing => (
                    <div key={ing.itemId} className="ingredient-icon" title={`${ITEMS[ing.itemId].name} (${getIngredientCount(ing.itemId)})`}>
                        <img src={ITEMS[ing.itemId].iconUrl} alt={ITEMS[ing.itemId].name} className={getIconClassName(ITEMS[ing.itemId])} />
                        {ing.quantity > 1 && <span className="ingredient-quantity">{ing.quantity}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const SpinningInterface: React.FC<CraftingViewProps> = ({ inventory, skills, onSpin, setContextMenu, setMakeXPrompt, setTooltip }) => {
    const craftingLevel = skills.find(s => s.name === SkillName.Crafting)?.currentLevel ?? 1;
    const isTouchDevice = useIsTouchDevice(false);
    
    const getIngredientCount = (itemId: string): number => {
        return inventory.reduce((total, slot) => {
            if (slot && slot.itemId === itemId && !slot.noted) {
                return total + slot.quantity;
            }
            return total;
        }, 0);
    };

    return (
        <div className="flex-grow overflow-y-auto pr-2">
            <div className="crafting-grid">
                {SPINNING_RECIPES.map((recipe) => (
                    <SpinningSlot
                        key={recipe.itemId}
                        recipe={recipe}
                        craftingLevel={craftingLevel}
                        getIngredientCount={getIngredientCount}
                        onSpin={onSpin}
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

export default SpinningInterface;
