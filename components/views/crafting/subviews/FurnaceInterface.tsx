
import React from 'react';
import { SkillName } from '../../../../types';
import { ITEMS, getIconClassName } from '../../../../constants';
import { CraftingViewProps } from '../CraftingView';
import { useLongPress } from '../../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../../hooks/useIsTouchDevice';

type BarType = 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'silver_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar';

const smeltingRecipes = [
    { barType: 'bronze_bar', level: 1, xp: 7, ingredients: [{ itemId: 'copper_ore', quantity: 1 }, { itemId: 'tin_ore', quantity: 1 }] },
    { barType: 'iron_bar', level: 15, xp: 12.5, ingredients: [{ itemId: 'iron_ore', quantity: 1 }] },
    { barType: 'silver_bar', level: 20, xp: 13.7, ingredients: [{ itemId: 'silver_ore', quantity: 1 }] },
    { barType: 'steel_bar', level: 30, xp: 17.5, ingredients: [{ itemId: 'iron_ore', quantity: 1 }, { itemId: 'coal', quantity: 2 }] },
    { barType: 'mithril_bar', level: 50, xp: 30, ingredients: [{ itemId: 'mithril_ore', quantity: 1 }, { itemId: 'coal', quantity: 4 }] },
    { barType: 'adamantite_bar', level: 65, xp: 37.5, ingredients: [{ itemId: 'adamantite_ore', quantity: 1 }, { itemId: 'coal', quantity: 6 }] },
    { barType: 'runic_bar', level: 80, xp: 50, ingredients: [{ itemId: 'titanium_ore', quantity: 1 }, { itemId: 'coal', quantity: 8 }] },
] as const;

const FurnaceSlot: React.FC<{
    recipe: (typeof smeltingRecipes)[number];
    smithingLevel: number;
    getItemCount: (itemId: string) => number;
    onSmithBar: (barType: BarType, quantity: number) => void;
    setContextMenu: CraftingViewProps['setContextMenu'];
    setMakeXPrompt: CraftingViewProps['setMakeXPrompt'];
    setTooltip: CraftingViewProps['setTooltip'];
    isTouchDevice: boolean;
}> = ({ recipe, smithingLevel, getItemCount, onSmithBar, setContextMenu, setMakeXPrompt, setTooltip, isTouchDevice }) => {
    const item = ITEMS[recipe.barType];
    const hasLevel = smithingLevel >= recipe.level;
    const maxSmelt = Math.min(
        ...recipe.ingredients.map(ing => Math.floor(getItemCount(ing.itemId) / ing.quantity))
    );
    const hasIngredients = maxSmelt > 0;
    const canSmelt = hasLevel && hasIngredients;

    const handleSingleTap = () => { if(canSmelt) { onSmithBar(recipe.barType, 1); setTooltip(null); } };

    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const event = 'touches' in e ? e.touches[0] : e;
        setContextMenu({
            options: [
                { label: 'Smelt 1', onClick: () => onSmithBar(recipe.barType, 1), disabled: !canSmelt },
                { label: 'Smelt 5', onClick: () => onSmithBar(recipe.barType, 5), disabled: !canSmelt || maxSmelt < 5 },
                { label: 'Smelt All', onClick: () => onSmithBar(recipe.barType, maxSmelt), disabled: !canSmelt },
                {
                    label: 'Smelt X...',
                    onClick: () => setMakeXPrompt({
                        title: `Smelt ${item.name}`, max: maxSmelt,
                        onConfirm: (quantity) => onSmithBar(recipe.barType, quantity)
                    }),
                    disabled: !canSmelt
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
                        const hasIngredient = getItemCount(ing.item.id) >= ing.quantity;
                        return <li key={ing.item.id} className={hasIngredient ? 'text-green-400' : 'text-red-400'}>{ing.item.name} x{ing.quantity}</li>;
                    })}
                </ul>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Output</p>
                <p className="mb-2 text-gray-300">{item.name} x1</p>
                
                <div className="grid grid-cols-2 gap-x-4 text-xs">
                    <span className="text-gray-400">{SkillName.Smithing} XP:</span>
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
            className={`crafting-slot ${!canSmelt ? 'disabled' : ''}`} 
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

const FurnaceInterface: React.FC<CraftingViewProps> = ({ inventory, skills, onSmithBar, setContextMenu, setMakeXPrompt, setTooltip }) => {
    const smithingLevel = skills.find(s => s.name === SkillName.Smithing)?.currentLevel ?? 1;
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
                {smeltingRecipes.map((recipe) => (
                    <FurnaceSlot
                        key={recipe.barType}
                        recipe={recipe}
                        smithingLevel={smithingLevel}
                        getItemCount={getItemCount}
                        onSmithBar={onSmithBar}
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

export default FurnaceInterface;
