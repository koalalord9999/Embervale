

import React from 'react';
import { SkillName } from '../../../../types';
import { DOUGH_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import { CraftingViewProps } from '../CraftingView';
import { useLongPress } from '../../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../../hooks/useIsTouchDevice';

const DoughMakingSlot: React.FC<{
    recipe: typeof DOUGH_RECIPES[0];
    cookingLevel: number;
    getItemCount: (itemId: string) => number;
    onMakeDough: (recipeId: string, quantity: number) => void;
    setContextMenu: CraftingViewProps['setContextMenu'];
    setMakeXPrompt: CraftingViewProps['setMakeXPrompt'];
    setTooltip: CraftingViewProps['setTooltip'];
    isTouchDevice: boolean;
}> = ({ recipe, cookingLevel, getItemCount, onMakeDough, setContextMenu, setMakeXPrompt, setTooltip, isTouchDevice }) => {
    const item = ITEMS[recipe.itemId];
    if (!item) return null;

    const hasLevel = cookingLevel >= recipe.level;
    const maxCraftable = Math.min(
        ...recipe.ingredients.map(ing => Math.floor(getItemCount(ing.itemId) / ing.quantity))
    );
    const hasIngredients = maxCraftable > 0;
    const canCraft = hasLevel && hasIngredients;

    const handleSingleTap = () => { if(canCraft) { onMakeDough(recipe.itemId, 1); setTooltip(null); } };
    
    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        let eventForMenu: React.MouseEvent | React.Touch;
        if ('touches' in e && e.touches.length > 0) {
            eventForMenu = e.touches[0];
        } else if ('changedTouches' in e && e.changedTouches.length > 0) {
            eventForMenu = e.changedTouches[0];
        } else {
            eventForMenu = e as React.MouseEvent;
        }
        setContextMenu({
            options: [
                { label: 'Make 1', onClick: () => onMakeDough(recipe.itemId, 1), disabled: !canCraft },
                { label: 'Make 5', onClick: () => onMakeDough(recipe.itemId, 5), disabled: !canCraft || maxCraftable < 5 },
                { label: 'Make All', onClick: () => onMakeDough(recipe.itemId, maxCraftable), disabled: !canCraft },
                {
                    label: 'Make X...',
                    onClick: () => setMakeXPrompt({
                        title: `Make ${item.name}`, max: maxCraftable,
                        onConfirm: (quantity) => onMakeDough(recipe.itemId, quantity)
                    }),
                    disabled: !canCraft
                },
            ],
            triggerEvent: eventForMenu,
            isTouchInteraction: isTouchDevice,
            title: item.name
        });
    };

    const longPressHandlers = useLongPress({ onLongPress: handleLongPress, onClick: handleSingleTap });

    const handleMouseEnter = (e: React.MouseEvent) => {
        const ingredients = recipe.ingredients.map(ing => ({ item: ITEMS[ing.itemId], quantity: ing.quantity }));
        const craftTime = 0.2; // Instant
    
        const tooltipContent = (
            <div className="text-sm text-left w-48">
                <p className="font-bold text-yellow-300 mb-2 pb-1 border-b border-gray-600">{item.name}</p>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Materials</p>
                <ul className="list-disc list-inside mb-2">
                    {ingredients.map(ing => {
                        const hasIngredient = getItemCount(ing.item.id) >= ing.quantity;
                        return <li key={ing.item.id} className={hasIngredient ? 'text-green-400' : 'text-red-400'}>{ing.item.name} x{ing.quantity}</li>;
                    })}
                </ul>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Output</p>
                <p className="mb-2 text-gray-300">{item.name} x1</p>
                <div className="grid grid-cols-2 gap-x-4 text-xs">
                    <span className="text-gray-400">{SkillName.Cooking} XP:</span>
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
                    <div key={ing.itemId} className="ingredient-icon" title={`${ITEMS[ing.itemId].name}`}>
                        <img src={ITEMS[ing.itemId].iconUrl} alt={ITEMS[ing.itemId].name} className={getIconClassName(ITEMS[ing.itemId])} />
                        {ing.quantity > 1 && <span className="ingredient-quantity">{ing.quantity}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const DoughMakingInterface: React.FC<CraftingViewProps> = ({ inventory, skills, onMakeDough, setContextMenu, setMakeXPrompt, setTooltip }) => {
    const cookingLevel = skills.find(s => s.name === SkillName.Cooking)?.currentLevel ?? 1;
    const isTouchDevice = useIsTouchDevice(false);

    const getItemCount = (itemId: string): number => {
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
                {DOUGH_RECIPES.map((recipe) => (
                    <DoughMakingSlot 
                        key={recipe.itemId}
                        recipe={recipe}
                        cookingLevel={cookingLevel}
                        getItemCount={getItemCount}
                        onMakeDough={onMakeDough}
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

export default DoughMakingInterface;
