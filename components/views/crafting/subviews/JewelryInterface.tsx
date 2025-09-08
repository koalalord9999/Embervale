
import React, { useState, useEffect } from 'react';
import { SkillName } from '../../../../types';
import { JEWELRY_CRAFTING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import Button from '../../../common/Button';
import { CraftingViewProps } from '../CraftingView';

type BarType = 'silver_bar' | 'gold_bar';

const JewelryInterface: React.FC<CraftingViewProps> = ({ inventory, skills, onCraftItem, setContextMenu, setMakeXPrompt }) => {
    const smithingLevel = skills.find(s => s.name === SkillName.Smithing)?.level ?? 1;
    const [selectedBar, setSelectedBar] = useState<BarType | null>(null);

    const getItemCount = (itemId: string): number => {
        const item = ITEMS[itemId];
        if (!item) return 0;
        if (item.stackable) {
            return inventory.find(slot => slot && slot.itemId === itemId)?.quantity ?? 0;
        }
        return inventory.filter(slot => slot && slot.itemId === itemId).length;
    };

    const barCounts = {
        silver_bar: getItemCount('silver_bar'),
        gold_bar: getItemCount('gold_bar'),
    };

    useEffect(() => {
        const availableBars: BarType[] = ['silver_bar', 'gold_bar'];
        const firstAvailable = availableBars.find(bar => barCounts[bar] > 0);
        setSelectedBar(firstAvailable || null);
    }, [inventory]);

    const createJewelryContextMenu = (e: React.MouseEvent, recipe: typeof JEWELRY_CRAFTING_RECIPES[0]) => {
        e.preventDefault();
        const maxCraft = Math.floor(getItemCount(recipe.barType) / recipe.barsRequired);
        const hasLevel = smithingLevel >= recipe.level;
        const hasMould = getItemCount(recipe.mouldId) > 0;
        
        const canCraft = hasLevel && hasMould;

        setContextMenu({
            options: [
                { label: 'Craft 1', onClick: () => onCraftItem(recipe.itemId, 1), disabled: !canCraft || maxCraft < 1 },
                { label: 'Craft 5', onClick: () => onCraftItem(recipe.itemId, 5), disabled: !canCraft || maxCraft < 5 },
                { label: 'Craft All', onClick: () => onCraftItem(recipe.itemId, maxCraft), disabled: !canCraft || maxCraft < 1 },
                {
                    label: 'Craft X...',
                    onClick: () => setMakeXPrompt({
                        title: `Craft ${ITEMS[recipe.itemId].name}`,
                        max: maxCraft,
                        onConfirm: (quantity) => onCraftItem(recipe.itemId, quantity)
                    }),
                    disabled: !canCraft || maxCraft < 1
                },
            ],
            position: { x: e.clientX, y: e.clientY }
        });
    };

    return (
        <div className="flex-grow overflow-y-auto pr-2">
            <div className="flex gap-2 mb-4 flex-wrap">
                {Object.entries(barCounts).map(([barType, count]) => {
                    const barItem = ITEMS[barType as BarType];
                    if (!barItem) return null;
                    return (
                        <Button
                            key={barType}
                            onClick={() => setSelectedBar(barType as BarType)}
                            disabled={count === 0}
                            variant={selectedBar === barType ? 'primary' : 'secondary'}
                            size="sm"
                        >
                            {barItem.name.replace(' Bar', '')} ({count})
                        </Button>
                    );
                })}
            </div>

            {selectedBar ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {JEWELRY_CRAFTING_RECIPES
                        .filter(recipe => recipe.barType === selectedBar)
                        .map((recipe) => {
                            const item = ITEMS[recipe.itemId];
                            const mould = ITEMS[recipe.mouldId];
                            if (!item || !mould) return null;

                            const hasLevel = smithingLevel >= recipe.level;
                            const hasBars = getItemCount(recipe.barType) >= recipe.barsRequired;
                            const hasMould = getItemCount(recipe.mouldId) >= 1;
                            const canCraft = hasLevel && hasBars && hasMould;

                            return (
                                <div
                                    key={recipe.itemId}
                                    className={`bg-gray-900 p-3 rounded-lg border-2 ${canCraft ? 'border-gray-600' : 'border-red-800/50'}`}
                                    onContextMenu={(e) => createJewelryContextMenu(e, recipe)}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <img src={item.iconUrl} alt={item.name} className={`w-10 h-10 bg-black/30 p-1 rounded ${getIconClassName(item)}`} />
                                        <h3 className="text-lg font-semibold text-yellow-300">{item.name}</h3>
                                    </div>
                                    <div className="text-sm space-y-1 mb-3">
                                        <p className={hasLevel ? 'text-gray-400' : 'text-red-400'}>
                                            Lvl: {recipe.level}
                                        </p>
                                        <p className={hasBars ? 'text-gray-400' : 'text-red-400'}>
                                            {ITEMS[recipe.barType].name}: {recipe.barsRequired}
                                        </p>
                                        <p className={hasMould ? 'text-gray-400' : 'text-red-400'}>
                                            Requires: {mould.name}
                                        </p>
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
            ) : (
                <p className="text-center text-gray-400 italic mt-8">You don't have any bars to craft with. Smelt some at the furnace.</p>
            )}
        </div>
    );
};

export default JewelryInterface;
