
import React from 'react';
import { InventorySlot, PlayerSkill, PlayerQuestState, SkillName } from '../../../../types';
import { COOKING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import Button from '../../../common/Button';
import { ContextMenuOption } from '../../../common/ContextMenu';
import { MakeXPrompt, ContextMenuState } from '../../../../hooks/useUIState';
// FIX: Import `CraftingViewProps` to resolve type errors.
import { CraftingViewProps } from '../CraftingView';
import { useLongPress } from '../../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../../hooks/useIsTouchDevice';

interface CookingSlotProps {
    recipe: typeof COOKING_RECIPES[0];
    cookingLevel: number;
    getItemCount: (itemId: string) => number;
    onCook: (recipeId: string, quantity: number) => void;
    setContextMenu: CraftingViewProps['setContextMenu'];
    setMakeXPrompt: CraftingViewProps['setMakeXPrompt'];
    setTooltip: CraftingViewProps['setTooltip'];
    isTouchDevice: boolean;
}

const CookingSlot: React.FC<CookingSlotProps> = ({ recipe, cookingLevel, getItemCount, onCook, setContextMenu, setMakeXPrompt, setTooltip, isTouchDevice }) => {
    const item = ITEMS[recipe.itemId];
    if (!item) return null;
    
    const hasLevel = cookingLevel >= recipe.level;
    const maxCook = Math.min(
        ...recipe.ingredients.map(ing => Math.floor(getItemCount(ing.itemId) / ing.quantity))
    );
    const hasIngredients = maxCook > 0;
    const canCook = hasLevel && hasIngredients;

    const handleSingleTap = () => { if(canCook) { onCook(recipe.itemId, 1); setTooltip(null); } };
    
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
                { label: 'Cook 1', onClick: () => onCook(recipe.itemId, 1), disabled: !canCook },
                { label: 'Cook 5', onClick: () => onCook(recipe.itemId, 5), disabled: !canCook || maxCook < 5 },
                { label: 'Cook All', onClick: () => onCook(recipe.itemId, maxCook), disabled: !canCook },
                { 
                    label: 'Cook X...', 
                    onClick: () => setMakeXPrompt({
                        title: `Cook ${ITEMS[recipe.itemId].name}`, max: maxCook,
                        onConfirm: (quantity) => onCook(recipe.itemId, quantity)
                    }), 
                    disabled: !canCook 
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
        const craftTime = 1.2;
    
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
            className={`crafting-slot ${!canCook ? 'disabled' : ''}`} 
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
                    <div key={ing.itemId} className="ingredient-icon" title={`${ITEMS[ing.itemId].name} (${getItemCount(ing.itemId)})`}>
                        <img src={ITEMS[ing.itemId].iconUrl} alt={ITEMS[ing.itemId].name} className={getIconClassName(ITEMS[ing.itemId])} />
                        {ing.quantity > 1 && <span className="ingredient-quantity">{ing.quantity}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const CookingInterface: React.FC<CraftingViewProps> = ({ inventory, skills, playerQuests, onCook, onExit, setContextMenu, setMakeXPrompt, setTooltip }) => {
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

    const visibleRecipes = COOKING_RECIPES;

    return (
        <div className="flex-grow overflow-y-auto pr-2">
            <div className="crafting-grid">
                {visibleRecipes.map((recipe) => (
                    <CookingSlot
                        key={recipe.itemId}
                        recipe={recipe}
                        cookingLevel={cookingLevel}
                        getItemCount={getItemCount}
                        onCook={onCook}
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

export default CookingInterface;