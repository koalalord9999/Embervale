import React from 'react';
import { SkillName } from '../../../../types';
import { COOKING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import Button from '../../../common/Button';
import { CraftingViewProps } from '../CraftingView';

const CookingInterface: React.FC<CraftingViewProps> = ({ inventory, skills, playerQuests, onCook, setContextMenu, setMakeXPrompt }) => {
    const cookingLevel = skills.find(s => s.name === SkillName.Cooking)?.level ?? 1;

    const getItemCount = (itemId: string): number => {
        return inventory.reduce((total, slot) => {
            return slot.itemId === itemId ? total + slot.quantity : total;
        }, 0);
    };

    const createContextMenu = (e: React.MouseEvent, recipe: typeof COOKING_RECIPES[0]) => {
        e.preventDefault();
        
        const maxCook = Math.min(
            ...recipe.ingredients.map(ing => Math.floor(getItemCount(ing.itemId) / ing.quantity))
        );
        const hasLevel = cookingLevel >= recipe.level;

        setContextMenu({
            options: [
                { label: 'Cook 1', onClick: () => onCook(recipe.itemId, 1), disabled: !hasLevel || maxCook < 1 },
                { label: 'Cook 5', onClick: () => onCook(recipe.itemId, 5), disabled: !hasLevel || maxCook < 5 },
                { label: 'Cook All', onClick: () => onCook(recipe.itemId, maxCook), disabled: !hasLevel || maxCook < 1 },
                { 
                    label: 'Cook X...', 
                    onClick: () => setMakeXPrompt({
                        title: `Cook ${ITEMS[recipe.itemId].name}`,
                        max: maxCook,
                        onConfirm: (quantity) => onCook(recipe.itemId, quantity)
                    }), 
                    disabled: !hasLevel || maxCook < 1 
                },
            ],
            position: { x: e.clientX, y: e.clientY }
        });
    };
    
    const warhammerQuestComplete = playerQuests.some(q => q.questId === 'art_of_the_warhammer' && q.isComplete);
    const visibleRecipes = COOKING_RECIPES.filter(recipe => {
        if (recipe.itemId === 'serpent_omelet_cooked') {
            return warhammerQuestComplete;
        }
        return true;
    });

    return (
        <div className="flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleRecipes.map((recipe) => {
                    const item = ITEMS[recipe.itemId];
                    if (!item) return null;
                    
                    const hasLevel = cookingLevel >= recipe.level;
                    const hasIngredients = recipe.ingredients.every(ing => getItemCount(ing.itemId) >= ing.quantity);
                    const canCook = hasLevel && hasIngredients;

                    return (
                        <div 
                            key={recipe.itemId} 
                            className={`bg-gray-900 p-3 rounded-lg border-2 ${canCook ? 'border-gray-600' : 'border-red-800/50'}`}
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
                                    <p key={ing.itemId} className={getItemCount(ing.itemId) >= ing.quantity ? 'text-gray-400' : 'text-red-400'}>
                                        {ITEMS[ing.itemId].name}: {ing.quantity} ({getItemCount(ing.itemId)})
                                    </p>
                                ))}
                            </div>
                            <Button
                                size="sm"
                                onClick={() => onCook(recipe.itemId, 1)}
                                disabled={!canCook}
                                className="w-full"
                            >
                                Cook 1
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CookingInterface;
