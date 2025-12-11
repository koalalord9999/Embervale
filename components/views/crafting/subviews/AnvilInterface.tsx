import React, { useState, useEffect } from 'react';
import { InventorySlot, PlayerSkill, PlayerQuestState, SkillName, WeaponType } from '../../../../types';
import { SMITHING_RECIPES, SPECIAL_SMITHING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import Button from '../../../common/Button';
import { CraftingViewProps } from '../CraftingView';
import { useLongPress } from '../../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../../hooks/useIsTouchDevice';

type BarType = 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar' | 'gold_bar' | 'silver_bar';
type SmithingTab = BarType | 'special';

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
            triggerEvent: eventForMenu,
            isTouchInteraction: isTouchDevice,
            title: item.name
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

const SpecialAnvilSlot: React.FC<{
    recipe: typeof SPECIAL_SMITHING_RECIPES[0];
    smithingLevel: number;
    getItemCount: (itemId: string) => number;
    onSmithItem: (itemId: string, quantity: number) => void;
    setContextMenu: CraftingViewProps['setContextMenu'];
    setMakeXPrompt: CraftingViewProps['setMakeXPrompt'];
    setTooltip: CraftingViewProps['setTooltip'];
    isTouchDevice: boolean;
}> = ({ recipe, smithingLevel, getItemCount, onSmithItem, setContextMenu, setMakeXPrompt, setTooltip, isTouchDevice }) => {
    const item = ITEMS[recipe.itemId];
    if (!item) return null;

    const hasLevel = smithingLevel >= recipe.level;
    const hasIngredients = recipe.ingredients.every(ing => getItemCount(ing.itemId) >= ing.quantity);
    const canSmith = hasLevel && hasIngredients;

    const handleSingleTap = () => { if(canSmith) { onSmithItem(recipe.itemId, 1); setTooltip(null); } };

    const handleMouseEnter = (e: React.MouseEvent) => {
        const hasHammer = getItemCount('hammer') > 0;
        const tooltipContent = (
            <div className="text-sm text-left w-48">
                <p className="font-bold text-yellow-300 mb-2 pb-1 border-b border-gray-600">{item.name}</p>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Materials</p>
                <ul className="list-disc list-inside mb-2">
                    {recipe.ingredients.map(ing => (
                        <li key={ing.itemId} className={getItemCount(ing.itemId) >= ing.quantity ? 'text-green-400' : 'text-red-400'}>
                            {ITEMS[ing.itemId].name} x{ing.quantity}
                        </li>
                    ))}
                    <li className={hasHammer ? 'text-green-400' : 'text-red-400'}>Hammer</li>
                </ul>
                <div className="grid grid-cols-2 gap-x-4 text-xs">
                    <span className="text-gray-400">{SkillName.Smithing} XP:</span>
                    <span className="font-semibold text-right">{recipe.xp.toLocaleString()}</span>
                </div>
            </div>
        );
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <div 
            className={`crafting-slot ${!canSmith ? 'disabled' : ''}`} 
            onClick={handleSingleTap}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            <div className={`crafting-slot-level ${hasLevel ? 'met' : 'unmet'}`}>
                Lvl {recipe.level}
            </div>
            <img src={item.iconUrl} alt={item.name} className={`crafting-slot-icon ${getIconClassName(item)}`} />
            <div className="crafting-slot-ingredients">
                {recipe.ingredients.map(ing => (
                    <div key={ing.itemId} className="ingredient-icon">
                        <img src={ITEMS[ing.itemId].iconUrl} alt={ITEMS[ing.itemId].name} className={getIconClassName(ITEMS[ing.itemId])} />
                        {ing.quantity > 1 && <span className="ingredient-quantity">{ing.quantity}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

const AnvilInterface: React.FC<CraftingViewProps> = ({ inventory, skills, playerQuests, onSmithItem, setContextMenu, setMakeXPrompt, setTooltip }) => {
    const smithingLevel = skills.find(s => s.name === SkillName.Smithing)?.currentLevel ?? 1;
    // FIX: Corrected the initial state to use a valid SmithingTab type.
    const [selectedTab, setSelectedTab] = useState<SmithingTab>('bronze_bar');
    const isTouchDevice = useIsTouchDevice(false);

    const getItemCount = (itemId: string): number => {
        return inventory.reduce((total, slot) => {
            if (slot && slot.itemId === itemId && !slot.noted) {
                return total + slot.quantity;
            }
            return total;
        }, 0);
    };

    const hasSpecialItems = getItemCount('flaming_gullet') > 0 && getItemCount('fire_resistant_shield') > 0;

    const barTiers: BarType[] = ['runic_bar', 'adamantite_bar', 'mithril_bar', 'steel_bar', 'iron_bar', 'bronze_bar'];
    
    const barCounts: Record<BarType, number> = {
        bronze_bar: getItemCount('bronze_bar'),
        iron_bar: getItemCount('iron_bar'),
        steel_bar: getItemCount('steel_bar'),
        mithril_bar: getItemCount('mithril_bar'),
        adamantite_bar: getItemCount('adamantite_bar'),
        runic_bar: getItemCount('runic_bar'),
        gold_bar: getItemCount('gold_bar'), // Not a primary tier for weapons/armor
        silver_bar: getItemCount('silver_bar'), // Not a primary tier
    };
    
    const hasAnyBars = barTiers.some(bar => barCounts[bar] > 0);

    useEffect(() => {
        if (hasSpecialItems) {
            setSelectedTab('special');
        } else {
            const firstAvailableBar = barTiers.find(bar => barCounts[bar] > 0);
            if (firstAvailableBar) {
                setSelectedTab(firstAvailableBar);
            } else {
                // FIX: Corrected the fallback state to use a valid SmithingTab type.
                setSelectedTab('bronze_bar');
            }
        }
    }, [inventory]); // Rerun when inventory changes

    const visibleRecipes = SMITHING_RECIPES;

    const allTabs: { id: SmithingTab; name: string; disabled: boolean; count?: number }[] = [
        ...barTiers.map(bar => ({ id: bar, name: ITEMS[bar].name.replace(' Bar', ''), disabled: barCounts[bar] === 0, count: barCounts[bar] })),
        { id: 'special', name: 'Special', disabled: !hasSpecialItems }
    ];

    return (
        <div className="flex flex-col flex-grow min-h-0">
            <div className="flex gap-2 mb-4 flex-wrap flex-shrink-0">
                {allTabs.map(tab => (
                    <Button 
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id)} 
                        disabled={tab.disabled}
                        variant={selectedTab === tab.id ? 'primary' : 'secondary'} 
                        size="sm"
                    >
                        {tab.name} {tab.count !== undefined ? `(${tab.count})` : ''}
                    </Button>
                ))}
            </div>

            {selectedTab ? (
                selectedTab === 'special' ? (
                    <div className="flex-grow overflow-y-auto pr-2">
                        <div className="crafting-grid">
                            {SPECIAL_SMITHING_RECIPES.map(recipe => (
                                <SpecialAnvilSlot
                                    key={recipe.itemId}
                                    recipe={recipe}
                                    smithingLevel={smithingLevel}
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
                    <div className="flex-grow overflow-y-auto pr-2">
                        <div className="crafting-grid">
                            {visibleRecipes
                                .filter(recipe => recipe.barType === selectedTab)
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
                )
            ) : (
                <p className="text-center text-gray-400 italic mt-8">You don't have any bars to smith with. Use a furnace to smelt ore into bars.</p>
            )}
        </div>
    );
};

export default AnvilInterface;
