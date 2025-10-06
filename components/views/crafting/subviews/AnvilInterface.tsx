import React, { useState, useEffect } from 'react';
import { InventorySlot, PlayerSkill, PlayerQuestState, SkillName, WeaponType } from '../../../../types';
import { SMITHING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import Button from '../../../common/Button';
import { CraftingViewProps } from '../CraftingView';
import { useLongPress } from '../../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../../hooks/useIsTouchDevice';

type BarType = 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar';

const AnvilSlot: React.FC<{
    recipe: typeof SMITHING_RECIPES[0];
    smithingLevel: number;
    inventory: (InventorySlot | null)[];
    getItemCount: (itemId: string) => number;
    onSmithItem: (itemId: string, quantity: number) => void;
    setContextMenu: CraftingViewProps['setContextMenu'];
    setMakeXPrompt: CraftingViewProps['setMakeXPrompt'];
    setTooltip: CraftingViewProps['setTooltip'];
    isTouchDevice: boolean;
}> = ({ recipe, smithingLevel, inventory, getItemCount, onSmithItem, setContextMenu, setMakeXPrompt, setTooltip, isTouchDevice }) => {
    const item = ITEMS[recipe.itemId];
    if (!item) return null;

    const hasLevel = smithingLevel >= recipe.level;
    const maxSmith = Math.floor(getItemCount(recipe.barType) / recipe.barsRequired);
    const hasBars = maxSmith > 0;
    const canSmith = hasLevel && hasBars;

    const handleSingleTap = () => { if(canSmith) { onSmithItem(recipe.itemId, 1); setTooltip(null); } };

    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const event = 'touches' in e ? e.touches[0] : e;
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
            ], event, isTouchInteraction: isTouchDevice
        });
    };
    
    const longPressHandlers = useLongPress({ onLongPress: handleLongPress, onClick: handleSingleTap });

    const handleMouseEnter = (e: React.MouseEvent) => {
        const outputQuantity = item.stackable && recipe.itemId.includes('arrowtips') ? 15 : 1;
        const craftTime = 1.8;
        const hasRequiredBars = getItemCount(recipe.barType) >= recipe.barsRequired;
        const hasHammer = inventory.some(i => i?.itemId === 'hammer');

        const tooltipContent = (
            <div className="text-sm text-left w-48">
                <p className="font-bold text-yellow-300 mb-2 pb-1 border-b border-gray-600">{item.name}</p>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Materials</p>
                <ul className="list-disc list-inside mb-2">
                    <li className={hasRequiredBars ? 'text-green-400' : 'text-red-400'}>{ITEMS[recipe.barType].name} x{recipe.barsRequired}</li>
                    <li className={hasHammer ? 'text-green-400' : 'text-red-400'}>Hammer</li>
                </ul>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Output</p>
                <p className="mb-2 text-gray-300">{item.name} x{outputQuantity}</p>
                
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
            className={`crafting-slot ${!canSmith ? 'disabled' : ''}`} 
            {...longPressHandlers}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            <div className={`crafting-slot-level ${hasLevel ? 'met' : 'unmet'}`}>
                Lvl {recipe.level}
            </div>
            <img src={item.iconUrl} alt={item.name} className={`crafting-slot-icon ${getIconClassName(item)}`} />
            <div className="crafting-slot-ingredients">
                <div className="ingredient-icon">
                    <img src={ITEMS[recipe.barType].iconUrl} alt={ITEMS[recipe.barType].name} className={getIconClassName(ITEMS[recipe.barType])} />
                    {recipe.barsRequired > 1 && <span className="ingredient-quantity">{recipe.barsRequired}</span>}
                </div>
            </div>
        </div>
    );
};

const AnvilInterface: React.FC<CraftingViewProps> = ({ inventory, skills, playerQuests, onSmithItem, setContextMenu, setMakeXPrompt, setTooltip }) => {
    const smithingLevel = skills.find(s => s.name === SkillName.Smithing)?.currentLevel ?? 1;
    const [selectedBar, setSelectedBar] = useState<BarType | null>(null);
    const isTouchDevice = useIsTouchDevice(false);

    const getItemCount = (itemId: string): number => {
        return inventory.reduce((total, slot) => {
            if (slot && slot.itemId === itemId && !slot.noted) {
                return total + slot.quantity;
            }
            return total;
        }, 0);
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
        const firstAvailable = availableBars.find(bar => barCounts[bar as BarType] > 0);
        setSelectedBar(firstAvailable || null);
    }, [inventory]);
    
    const visibleRecipes = SMITHING_RECIPES;

    return (
        <div className="flex flex-col flex-grow min-h-0">
            <div className="flex gap-2 mb-4 flex-wrap flex-shrink-0">
                {Object.entries(barCounts).map(([barType, count]) => (
                    <Button 
                        key={barType}
                        onClick={() => setSelectedBar(barType as BarType)} 
                        disabled={count === 0} 
                        variant={selectedBar === barType ? 'primary' : 'secondary'} 
                        size="sm"
                    >
                        {ITEMS[barType as BarType].name.replace(' Bar', '')} ({count})
                    </Button>
                ))}
            </div>

            {selectedBar ? (
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="crafting-grid">
                        {visibleRecipes
                            .filter(recipe => recipe.barType === selectedBar)
                            .map((recipe) => (
                                <AnvilSlot
                                    key={recipe.itemId}
                                    recipe={recipe}
                                    smithingLevel={smithingLevel}
                                    inventory={inventory}
                                    getItemCount={getItemCount}
                                    onSmithItem={onSmithItem}
                                    setContextMenu={setContextMenu}
                                    setMakeXPrompt={setMakeXPrompt}
                                    setTooltip={setTooltip}
                                    isTouchDevice={isTouchDevice}
                                />
                            ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-400 italic mt-8">You don't have any bars to smith with. Use a furnace to smelt ore into bars.</p>
            )}
        </div>
    );
};

export default AnvilInterface;
