
import React, { useState, useEffect } from 'react';
import { SkillName } from '../../../../types';
import { JEWELRY_CRAFTING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import Button from '../../../common/Button';
import { CraftingViewProps } from '../CraftingView';
import { useLongPress } from '../../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../../hooks/useIsTouchDevice';

type BarType = 'silver_bar' | 'gold_bar';

const JewelrySlot: React.FC<{
    recipe: typeof JEWELRY_CRAFTING_RECIPES[0];
    craftingLevel: number;
    getItemCount: (itemId: string) => number;
    onCraftItem: (itemId: string, quantity: number) => void;
    setContextMenu: CraftingViewProps['setContextMenu'];
    setMakeXPrompt: CraftingViewProps['setMakeXPrompt'];
    setTooltip: CraftingViewProps['setTooltip'];
    isTouchDevice: boolean;
}> = ({ recipe, craftingLevel, getItemCount, onCraftItem, setContextMenu, setMakeXPrompt, setTooltip, isTouchDevice }) => {
    const item = ITEMS[recipe.itemId];
    const mould = ITEMS[recipe.mouldId];
    if (!item || !mould) return null;

    const hasLevel = craftingLevel >= recipe.level;
    const maxCraft = Math.floor(getItemCount(recipe.barType) / recipe.barsRequired);
    const hasBars = maxCraft > 0;
    const hasMould = getItemCount(recipe.mouldId) >= 1;
    const hasGem = recipe.gemId ? getItemCount(recipe.gemId) >= 1 : true;
    const canCraft = hasLevel && hasBars && hasMould && hasGem;
    
    const handleSingleTap = () => { if (canCraft) { onCraftItem(recipe.itemId, 1); setTooltip(null); } };

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
                { label: 'Craft 5', onClick: () => onCraftItem(recipe.itemId, 5), disabled: !canCraft || maxCraft < 5 },
                { label: 'Craft All', onClick: () => onCraftItem(recipe.itemId, maxCraft), disabled: !canCraft },
                {
                    label: 'Craft X...',
                    onClick: () => setMakeXPrompt({
                        title: `Craft ${item.name}`, max: maxCraft,
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
        const craftTime = 1.8;
    
        const tooltipContent = (
            <div className="text-sm text-left w-48">
                <p className="font-bold text-yellow-300 mb-2 pb-1 border-b border-gray-600">{item.name}</p>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Materials</p>
                <ul className="list-disc list-inside mb-2">
                    <li className={hasBars ? 'text-green-400' : 'text-red-400'}>{ITEMS[recipe.barType].name} x{recipe.barsRequired}</li>
                    <li className={hasMould ? 'text-green-400' : 'text-red-400'}>{mould.name}</li>
                    {recipe.gemId && <li className={hasGem ? 'text-green-400' : 'text-red-400'}>{ITEMS[recipe.gemId].name}</li>}
                </ul>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Output</p>
                <p className="mb-2 text-gray-300">{item.name} x1</p>
                
                <div className="grid grid-cols-2 gap-x-4 text-xs">
                    <span className="text-gray-400">{SkillName.Crafting} XP:</span>
                    <span className="font-semibold text-right">{recipe.xp.toLocaleString()}</span>
                    <span className="text-gray-400">Craft Time:</span>
                    <span className="font-semibold text-right">{craftTime.toFixed(1)}s</span>
                </div>
            </div>
        );
    
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };

    const gemItem = recipe.gemId ? ITEMS[recipe.gemId] : null;

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
                <div className="ingredient-icon" title={`${ITEMS[recipe.barType].name} (x${recipe.barsRequired})`}>
                    <img src={ITEMS[recipe.barType].iconUrl} alt={ITEMS[recipe.barType].name} className={getIconClassName(ITEMS[recipe.barType])} />
                    {recipe.barsRequired > 1 && <span className="ingredient-quantity">{recipe.barsRequired}</span>}
                </div>
                {gemItem && (
                    <div className="ingredient-icon" title={gemItem.name}>
                        <img src={gemItem.iconUrl} alt={gemItem.name} className={getIconClassName(gemItem)} />
                    </div>
                )}
                <div className="ingredient-icon" title={mould.name}>
                    <img src={mould.iconUrl} alt={mould.name} className={getIconClassName(mould)} />
                </div>
            </div>
        </div>
    );
};

const JewelryInterface: React.FC<CraftingViewProps> = ({ inventory, skills, onCraftItem, setContextMenu, setMakeXPrompt, setTooltip }) => {
    const craftingLevel = skills.find(s => s.name === SkillName.Crafting)?.currentLevel ?? 1;
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
        silver_bar: getItemCount('silver_bar'),
        gold_bar: getItemCount('gold_bar'),
    };

    useEffect(() => {
        const availableBars: BarType[] = ['gold_bar', 'silver_bar'];
        const firstAvailable = availableBars.find(bar => barCounts[bar as BarType] > 0);
        setSelectedBar(firstAvailable || null);
    }, [inventory]);

    return (
        <div className="flex flex-col flex-grow min-h-0">
            <div className="flex gap-2 mb-4 flex-wrap flex-shrink-0">
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
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="crafting-grid">
                        {JEWELRY_CRAFTING_RECIPES
                            .filter(recipe => recipe.barType === selectedBar)
                            .map((recipe) => (
                                <JewelrySlot
                                    key={recipe.itemId}
                                    recipe={recipe}
                                    craftingLevel={craftingLevel}
                                    getItemCount={getItemCount}
                                    onCraftItem={onCraftItem}
                                    setContextMenu={setContextMenu}
                                    setMakeXPrompt={setMakeXPrompt}
                                    setTooltip={setTooltip}
                                    isTouchDevice={isTouchDevice}
                                />
                            ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-400 italic mt-8">You don't have any bars to craft with. Smelt some at the furnace.</p>
            )}
        </div>
    );
};

export default JewelryInterface;
