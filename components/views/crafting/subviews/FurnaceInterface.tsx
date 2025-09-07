import React from 'react';
import { SkillName } from '../../../../types';
import { ITEMS, getIconClassName } from '../../../../constants';
import Button from '../../../common/Button';
import { CraftingViewProps } from '../CraftingView';

type BarType = 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'silver_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar';

const FurnaceInterface: React.FC<CraftingViewProps> = ({ inventory, skills, onSmithBar, setContextMenu, setMakeXPrompt }) => {
    const smithingLevel = skills.find(s => s.name === SkillName.Smithing)?.level ?? 1;

    const getItemCount = (itemId: string): number => {
        const item = ITEMS[itemId];
        if (!item) return 0;
        if (item.stackable) {
            return inventory.find(slot => slot.itemId === itemId)?.quantity ?? 0;
        }
        return inventory.filter(slot => slot.itemId === itemId).length;
    };

    const smeltingRecipes = [
        { barType: 'bronze_bar', level: 1, xp: 7, ingredients: [{ itemId: 'copper_ore', quantity: 1 }, { itemId: 'tin_ore', quantity: 1 }] },
        { barType: 'iron_bar', level: 15, xp: 12.5, ingredients: [{ itemId: 'iron_ore', quantity: 1 }] },
        { barType: 'silver_bar', level: 20, xp: 13.7, ingredients: [{ itemId: 'silver_ore', quantity: 1 }] },
        { barType: 'steel_bar', level: 30, xp: 17.5, ingredients: [{ itemId: 'iron_ore', quantity: 1 }, { itemId: 'coal', quantity: 2 }] },
        { barType: 'mithril_bar', level: 50, xp: 30, ingredients: [{ itemId: 'mithril_ore', quantity: 1 }, { itemId: 'coal', quantity: 4 }] },
        { barType: 'adamantite_bar', level: 65, xp: 37.5, ingredients: [{ itemId: 'adamantite_ore', quantity: 1 }, { itemId: 'coal', quantity: 6 }] },
        { barType: 'runic_bar', level: 80, xp: 50, ingredients: [{ itemId: 'titanium_ore', quantity: 1 }, { itemId: 'coal', quantity: 8 }] },
    ] as const;

    const createSmeltingContextMenu = (e: React.MouseEvent, recipe: (typeof smeltingRecipes)[number]) => {
        e.preventDefault();
        const hasLevel = smithingLevel >= recipe.level;
        const maxSmelt = Math.min(
            ...recipe.ingredients.map(ing => Math.floor(getItemCount(ing.itemId) / ing.quantity))
        );

        setContextMenu({
            options: [
                { label: 'Smelt 1', onClick: () => onSmithBar(recipe.barType, 1), disabled: !hasLevel || maxSmelt < 1 },
                { label: 'Smelt 5', onClick: () => onSmithBar(recipe.barType, 5), disabled: !hasLevel || maxSmelt < 5 },
                { label: 'Smelt All', onClick: () => onSmithBar(recipe.barType, maxSmelt), disabled: !hasLevel || maxSmelt < 1 },
                {
                    label: 'Smelt X...',
                    onClick: () => setMakeXPrompt({
                        title: `Smelt ${ITEMS[recipe.barType].name}`,
                        max: maxSmelt,
                        onConfirm: (quantity) => onSmithBar(recipe.barType, quantity)
                    }),
                    disabled: !hasLevel || maxSmelt < 1
                },
            ],
            position: { x: e.clientX, y: e.clientY }
        });
    };

    return (
        <div className="flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {smeltingRecipes.map((recipe) => {
                    const item = ITEMS[recipe.barType];
                    const hasLevel = smithingLevel >= recipe.level;
                    const hasIngredients = recipe.ingredients.every(ing => getItemCount(ing.itemId) >= ing.quantity);
                    const canSmelt = hasLevel && hasIngredients;

                    return (
                        <div
                            key={recipe.barType}
                            className={`bg-gray-900 p-3 rounded-lg border-2 ${canSmelt ? 'border-gray-600' : 'border-red-800/50'}`}
                            onContextMenu={(e) => createSmeltingContextMenu(e, recipe)}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <img src={item.iconUrl} alt={item.name} className={`w-10 h-10 bg-black/30 p-1 rounded ${getIconClassName(item)}`} />
                                <h3 className="text-lg font-semibold text-yellow-300">{item.name}</h3>
                            </div>
                            <div className="text-sm space-y-1 mb-3">
                                <p className={hasLevel ? 'text-gray-400' : 'text-red-400'}>Lvl: {recipe.level}</p>
                                {recipe.ingredients.map(ing => (
                                    <p key={ing.itemId} className={getItemCount(ing.itemId) >= ing.quantity ? 'text-gray-400' : 'text-red-400'}>
                                        {ITEMS[ing.itemId].name}: {ing.quantity}
                                    </p>
                                ))}
                            </div>
                            <Button size="sm" onClick={() => onSmithBar(recipe.barType, 1)} disabled={!canSmelt} className="w-full">
                                Smelt 1
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FurnaceInterface;
