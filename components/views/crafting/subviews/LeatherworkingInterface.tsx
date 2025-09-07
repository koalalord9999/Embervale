import React from 'react';
import { SkillName } from '../../../../types';
import { CRAFTING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import Button from '../../../common/Button';
import { CraftingViewProps } from '../CraftingView';

const LeatherworkingInterface: React.FC<CraftingViewProps> = ({ inventory, skills, onCraftItem, setContextMenu, setMakeXPrompt }) => {
    const craftingLevel = skills.find(s => s.name === SkillName.Crafting)?.level ?? 1;

    const getIngredientCount = (itemId: string) => {
        const item = ITEMS[itemId];
        if (item.stackable) {
            return inventory.find(slot => slot.itemId === itemId)?.quantity ?? 0;
        }
        return inventory.filter(slot => slot.itemId === itemId).length;
    };

    const createContextMenu = (e: React.MouseEvent, recipe: typeof CRAFTING_RECIPES[0]) => {
        e.preventDefault();
        const hasLevel = craftingLevel >= recipe.level;
        const maxCraftable = Math.min(
            ...recipe.ingredients.map(ing => Math.floor(getIngredientCount(ing.itemId) / ing.quantity))
        );

        setContextMenu({
            options: [
                { label: 'Craft 1', onClick: () => onCraftItem(recipe.itemId, 1), disabled: !hasLevel || maxCraftable < 1 },
                { label: 'Craft 5', onClick: () => onCraftItem(recipe.itemId, 5), disabled: !hasLevel || maxCraftable < 5 },
                { label: 'Craft All', onClick: () => onCraftItem(recipe.itemId, maxCraftable), disabled: !hasLevel || maxCraftable < 1 },
                {
                    label: 'Craft X...',
                    onClick: () => setMakeXPrompt({
                        title: `Craft ${ITEMS[recipe.itemId].name}`,
                        max: maxCraftable,
                        onConfirm: (quantity) => onCraftItem(recipe.itemId, quantity)
                    }),
                    disabled: !hasLevel || maxCraftable < 1
                },
            ],
            position: { x: e.clientX, y: e.clientY }
        });
    };

    return (
        <>
            <div className="mb-4 text-lg">
                <p>Leather: <span className="text-yellow-400">{getIngredientCount('leather')}</span></p>
                <p>Thread: <span className="text-yellow-400">{getIngredientCount('thread')}</span></p>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CRAFTING_RECIPES.map((recipe) => {
                        const item = ITEMS[recipe.itemId];
                        if (!item) return null;

                        const hasLevel = craftingLevel >= recipe.level;
                        const hasIngredients = recipe.ingredients.every(ing => getIngredientCount(ing.itemId) >= ing.quantity);
                        const canCraft = hasLevel && hasIngredients;

                        return (
                            <div
                                key={recipe.itemId}
                                className={`bg-gray-900 p-3 rounded-lg border-2 ${canCraft ? 'border-gray-600' : 'border-red-800/50'}`}
                                onContextMenu={(e) => createContextMenu(e, recipe)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={item.iconUrl} alt={item.name} className={`w-10 h-10 bg-black/30 p-1 rounded ${getIconClassName(item)}`} />
                                    <h3 className="text-lg font-semibold text-yellow-300">{item.name}</h3>
                                </div>
                                <div className="text-sm space-y-1 mb-3">
                                    <p className={hasLevel ? 'text-gray-400' : 'text-red-400'}>
                                        Lvl: {recipe.level}
                                    </p>
                                    {recipe.ingredients.map(ing => (
                                        <p key={ing.itemId} className={getIngredientCount(ing.itemId) >= ing.quantity ? 'text-gray-400' : 'text-red-400'}>
                                            {ITEMS[ing.itemId].name}: {ing.quantity}
                                        </p>
                                    ))}
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => onCraftItem(recipe.itemId, 1)}
                                    disabled={!canCraft}
                                    className="w-full"
                                >
                                    Craft 1
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default LeatherworkingInterface;
