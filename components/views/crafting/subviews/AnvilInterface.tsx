import React, { useState, useEffect } from 'react';
import { SkillName, WeaponType } from '../../../../types';
import { SMITHING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import Button from '../../../common/Button';
import { CraftingViewProps } from '../CraftingView';

type BarType = 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar';

const AnvilInterface: React.FC<CraftingViewProps> = ({ inventory, skills, playerQuests, onSmithItem, setContextMenu, setMakeXPrompt }) => {
    const smithingLevel = skills.find(s => s.name === SkillName.Smithing)?.level ?? 1;
    const [selectedBar, setSelectedBar] = useState<BarType | null>(null);

    const getItemCount = (itemId: string): number => {
        const item = ITEMS[itemId];
        if (!item) return 0;
        if (item.stackable) {
            return inventory.find(slot => slot.itemId === itemId)?.quantity ?? 0;
        }
        return inventory.filter(slot => slot.itemId === itemId).length;
    };

    const barCounts = {
        bronze_bar: getItemCount('bronze_bar'),
        iron_bar: getItemCount('iron_bar'),
        steel_bar: getItemCount('steel_bar'),
        mithril_bar: getItemCount('mithril_bar'),
        adamantite_bar: getItemCount('adamantite_bar'),
        runic_bar: getItemCount('runic_bar'),
    };

    useEffect(() => {
        const availableBars: BarType[] = ['runic_bar', 'adamantite_bar', 'mithril_bar', 'steel_bar', 'iron_bar', 'bronze_bar'];
        const firstAvailable = availableBars.find(bar => barCounts[bar] > 0);
        setSelectedBar(firstAvailable || null);
    }, [inventory]);

    const createSmithingContextMenu = (e: React.MouseEvent, recipe: typeof SMITHING_RECIPES[0]) => {
        e.preventDefault();
        const maxSmith = Math.floor(getItemCount(recipe.barType) / recipe.barsRequired);
        const hasLevel = smithingLevel >= recipe.level;

        setContextMenu({
            options: [
                { label: 'Smith 1', onClick: () => onSmithItem(recipe.itemId, 1), disabled: !hasLevel || maxSmith < 1 },
                { label: 'Smith 5', onClick: () => onSmithItem(recipe.itemId, 5), disabled: !hasLevel || maxSmith < 5 },
                { label: 'Smith All', onClick: () => onSmithItem(recipe.itemId, maxSmith), disabled: !hasLevel || maxSmith < 1 },
                {
                    label: 'Smith X...',
                    onClick: () => setMakeXPrompt({
                        title: `Smith ${ITEMS[recipe.itemId].name}`,
                        max: maxSmith,
                        onConfirm: (quantity) => onSmithItem(recipe.itemId, quantity)
                    }),
                    disabled: !hasLevel || maxSmith < 1
                },
            ],
            position: { x: e.clientX, y: e.clientY }
        });
    };
    
    const warhammerQuestComplete = playerQuests.some(q => q.questId === 'art_of_the_warhammer' && q.isComplete);
    const visibleRecipes = SMITHING_RECIPES.filter(recipe => {
        const item = ITEMS[recipe.itemId];
        if (item?.equipment?.weaponType === WeaponType.Warhammer) {
            return warhammerQuestComplete;
        }
        return true;
    });

    return (
        <div className="flex-grow overflow-y-auto pr-2">
            <div className="flex gap-2 mb-4 flex-wrap">
                {Object.entries(barCounts).map(([barType, count]) => (
                    <Button 
                        key={barType}
                        onClick={() => setSelectedBar(barType as BarType)} 
                        disabled={count === 0} 
                        variant={selectedBar === barType ? 'primary' : 'secondary'} 
                        size="sm"
                    >
                        {ITEMS[barType].name.replace(' Bar', '')} ({count})
                    </Button>
                ))}
            </div>

            {selectedBar ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleRecipes
                        .filter(recipe => recipe.barType === selectedBar)
                        .map((recipe) => {
                            const item = ITEMS[recipe.itemId];
                            if (!item) return null;

                            const hasLevel = smithingLevel >= recipe.level;
                            const hasBars = getItemCount(recipe.barType) >= recipe.barsRequired;
                            const canSmith = hasLevel && hasBars;

                            return (
                                <div 
                                    key={recipe.itemId} 
                                    className={`bg-gray-900 p-3 rounded-lg border-2 ${canSmith ? 'border-gray-600' : 'border-red-800/50'}`}
                                    onContextMenu={(e) => createSmithingContextMenu(e, recipe)}
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
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => onSmithItem(recipe.itemId, 1)}
                                        disabled={!canSmith}
                                        className="w-full"
                                    >
                                        Smith 1
                                    </Button>
                                </div>
                            );
                        })}
                </div>
            ) : (
                <p className="text-center text-gray-400 italic mt-8">You don't have any bars to smith with. Use a furnace to smelt ore into bars.</p>
            )}
        </div>
    );
};

export default AnvilInterface;
