
import React from 'react';
import { SkillName } from '../../../../types';
import { CRAFTING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import { CraftingViewProps } from '../CraftingView';
import { useLongPress } from '../../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../../hooks/useIsTouchDevice';

const BookbindingSlot: React.FC<{
    recipe: typeof CRAFTING_RECIPES[0];
    craftingLevel: number;
    skills: CraftingViewProps['skills'];
    getIngredientCount: (itemId: string) => number;
    onCraftItem: (itemId: string, quantity: number) => void;
    setContextMenu: CraftingViewProps['setContextMenu'];
    setMakeXPrompt: CraftingViewProps['setMakeXPrompt'];
    setTooltip: CraftingViewProps['setTooltip'];
    isTouchDevice: boolean;
}> = ({ recipe, craftingLevel, skills, getIngredientCount, onCraftItem, setContextMenu, setMakeXPrompt, setTooltip, isTouchDevice }) => {
    const item = ITEMS[recipe.itemId];
    if (!item) return null;

    const hasLevels = (recipe.requiredSkills ?? [{ skill: SkillName.Crafting, level: recipe.level ?? 1 }]).every(req => {
        const playerSkill = skills.find(s => s.name === req.skill);
        return playerSkill && playerSkill.currentLevel >= req.level;
    });

    const maxCraftable = Math.min(
        ...recipe.ingredients.map(ing => Math.floor(getIngredientCount(ing.itemId) / ing.quantity))
    );
    const hasIngredients = maxCraftable > 0;
    const canCraft = hasLevels && hasIngredients;

    const handleSingleTap = () => { if(canCraft) { onCraftItem(recipe.itemId, 1); setTooltip(null); } };

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
                { label: 'Craft 1', onClick: () => onCraftItem(recipe.itemId, 1), disabled: !canCraft },
                { label: 'Craft 5', onClick: () => onCraftItem(recipe.itemId, 5), disabled: !canCraft || maxCraftable < 5 },
                { label: 'Craft All', onClick: () => onCraftItem(recipe.itemId, maxCraftable), disabled: !canCraft },
                {
                    label: 'Craft X...',
                    onClick: () => setMakeXPrompt({
                        title: `Craft ${item.name}`, max: maxCraftable,
                        onConfirm: (quantity) => onCraftItem(recipe.itemId, quantity)
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
        const craftTime = 1.2 * 5; // Simulating multiple items
    
        const tooltipContent = (
            <div className="text-sm text-left w-48">
                <p className="font-bold text-yellow-300 mb-2 pb-1 border-b border-gray-600">{item.name}</p>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Requirements</p>
                <ul className="list-disc list-inside mb-2">
                    <li className={craftingLevel >= (recipe.level ?? 1) ? 'text-green-400' : 'text-red-400'}>Crafting {recipe.level}</li>
                    {recipe.requiredSkills?.map(req => {
                        const playerSkill = skills.find(s => s.name === req.skill);
                        const hasReq = playerSkill && playerSkill.currentLevel >= req.level;
                        return <li key={req.skill} className={hasReq ? 'text-green-400' : 'text-red-400'}>{req.skill} {req.level}</li>;
                    })}
                </ul>

                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Materials</p>
                <ul className="list-disc list-inside mb-2">
                    {ingredients.map(ing => {
                        const hasIngredient = getIngredientCount(ing.item.id) >= ing.quantity;
                        return <li key={ing.item.id} className={hasIngredient ? 'text-green-400' : 'text-red-400'}>{ing.item.name} x{ing.quantity}</li>;
                    })}
                </ul>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Output</p>
                <p className="mb-2 text-gray-300">{item.name} x1</p>
                
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Rewards</p>
                <div className="grid grid-cols-2 gap-x-4 text-xs">
                    <span className="text-gray-400">{SkillName.Crafting} XP:</span>
                    <span className="font-semibold text-right">{recipe.xp?.toLocaleString()}</span>
                    {recipe.xpRewards?.map(reward => (
                        <React.Fragment key={reward.skill}>
                            <span className="text-gray-400">{reward.skill} XP:</span>
                            <span className="font-semibold text-right">{reward.amount.toLocaleString()}</span>
                        </React.Fragment>
                    ))}
                    <span className="text-gray-400">Craft Time:</span>
                    <span className="font-semibold text-right">{craftTime.toFixed(1)}s</span>
                </div>
            </div>
        );
    
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };
    
    const primarySkillReq = { skill: SkillName.Crafting, level: recipe.level ?? 1 };
    const hasPrimaryLevel = craftingLevel >= primarySkillReq.level;

    return (
        <div 
            className={`crafting-slot ${!canCraft ? 'disabled' : ''}`} 
            {...longPressHandlers}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            <div className={`crafting-slot-level ${hasPrimaryLevel ? 'met' : 'unmet'}`}>
                Lvl {primarySkillReq.level}
            </div>
            <img src={item.iconUrl} alt={item.name} className={`crafting-slot-icon ${getIconClassName(item)}`} />
            <div className="crafting-slot-ingredients">
                {recipe.ingredients.map(ing => (
                    <div key={ing.itemId} className="ingredient-icon" title={`${ITEMS[ing.itemId].name} (x${ing.quantity})`}>
                        <img src={ITEMS[ing.itemId].iconUrl} alt={ITEMS[ing.itemId].name} className={getIconClassName(ITEMS[ing.itemId])} />
                        {ing.quantity > 1 && <span className="ingredient-quantity">{ing.quantity}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const BookbindingInterface: React.FC<CraftingViewProps> = ({ inventory, skills, onCraftItem, setContextMenu, setMakeXPrompt, setTooltip }) => {
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
    
    const tomeRecipes = CRAFTING_RECIPES.filter(recipe => recipe.itemId.startsWith('tome_'));

    return (
        <div className="flex-grow overflow-y-auto pr-2">
            <div className="crafting-grid">
                {tomeRecipes.map((recipe) => (
                    <BookbindingSlot
                        key={recipe.itemId}
                        recipe={recipe}
                        craftingLevel={craftingLevel}
                        skills={skills}
                        getIngredientCount={getIngredientCount}
                        onCraftItem={onCraftItem}
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

export default BookbindingInterface;
