

import React, { useState, useEffect } from 'react';
import { InventorySlot, PlayerSkill, PlayerQuestState, SkillName, WeaponType } from '../types';
import { SMITHING_RECIPES, ITEMS, getIconClassName } from '../constants';
import Button from './common/Button';
import { ContextMenuOption } from './common/ContextMenu';
import { MakeXPrompt } from '../../hooks/useUIState';

type BarType = 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'silver_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar';

interface SmithingViewProps {
    smithingType: 'anvil' | 'furnace';
    inventory: InventorySlot[];
    skills: PlayerSkill[];
    playerQuests: PlayerQuestState[];
    onSmithBar: (barType: BarType, quantity: number) => void;
    onSmithItem: (itemId: string, quantity: number) => void;
    onExit: () => void;
    setContextMenu: (menu: { options: ContextMenuOption[]; position: { x: number; y: number; } } | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
}

const SmithingView: React.FC<SmithingViewProps> = ({ smithingType, inventory, skills, playerQuests, onSmithBar, onSmithItem, onExit, setContextMenu, setMakeXPrompt }) => {
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

    const bronzeBarCount = getItemCount('bronze_bar');
    const ironBarCount = getItemCount('iron_bar');
    const steelBarCount = getItemCount('steel_bar');
    const mithrilBarCount = getItemCount('mithril_bar');
    const adamantiteBarCount = getItemCount('adamantite_bar');
    const runicBarCount = getItemCount('runic_bar');

    useEffect(() => {
        if (smithingType === 'anvil') {
            if (runicBarCount > 0) setSelectedBar('runic_bar');
            else if (adamantiteBarCount > 0) setSelectedBar('adamantite_bar');
            else if (mithrilBarCount > 0) setSelectedBar('mithril_bar');
            else if (steelBarCount > 0) setSelectedBar('steel_bar');
            else if (ironBarCount > 0) setSelectedBar('iron_bar');
            else if (bronzeBarCount > 0) setSelectedBar('bronze_bar');
            else setSelectedBar(null);
        }
    }, [smithingType, bronzeBarCount, ironBarCount, steelBarCount, mithrilBarCount, adamantiteBarCount, runicBarCount]);

    const createSmithingContextMenu = (e: React.MouseEvent, recipe: typeof SMITHING_RECIPES[0]) => {
        e.preventDefault();
        const maxSmith = Math.floor(getItemCount(recipe.barType) / recipe.barsRequired);
        const hasLevel = smithingLevel >= recipe.level;

        const options: ContextMenuOption[] = [
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
        ];
        setContextMenu({ options, position: { x: e.clientX, y: e.clientY } });
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

        const options: ContextMenuOption[] = [
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
        ];
        setContextMenu({ options, position: { x: e.clientX, y: e.clientY } });
    };

    const renderFurnace = () => (
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

    const warhammerQuestComplete = playerQuests.some(q => q.questId === 'art_of_the_warhammer' && q.isComplete);
    const visibleRecipes = SMITHING_RECIPES.filter(recipe => {
        const item = ITEMS[recipe.itemId];
        if (item?.equipment?.weaponType === WeaponType.Warhammer) {
            return warhammerQuestComplete;
        }
        return true;
    });

    const renderAnvil = () => (
        <div className="flex-grow overflow-y-auto pr-2">
            <div className="flex gap-2 mb-4 flex-wrap">
                <Button onClick={() => setSelectedBar('bronze_bar')} disabled={bronzeBarCount === 0} variant={selectedBar === 'bronze_bar' ? 'primary' : 'secondary'} size="sm">Bronze ({bronzeBarCount})</Button>
                <Button onClick={() => setSelectedBar('iron_bar')} disabled={ironBarCount === 0} variant={selectedBar === 'iron_bar' ? 'primary' : 'secondary'} size="sm">Iron ({ironBarCount})</Button>
                <Button onClick={() => setSelectedBar('steel_bar')} disabled={steelBarCount === 0} variant={selectedBar === 'steel_bar' ? 'primary' : 'secondary'} size="sm">Steel ({steelBarCount})</Button>
                <Button onClick={() => setSelectedBar('mithril_bar')} disabled={mithrilBarCount === 0} variant={selectedBar === 'mithril_bar' ? 'primary' : 'secondary'} size="sm">Mithril ({mithrilBarCount})</Button>
                <Button onClick={() => setSelectedBar('adamantite_bar')} disabled={adamantiteBarCount === 0} variant={selectedBar === 'adamantite_bar' ? 'primary' : 'secondary'} size="sm">Adamantite ({adamantiteBarCount})</Button>
                <Button onClick={() => setSelectedBar('runic_bar')} disabled={runicBarCount === 0} variant={selectedBar === 'runic_bar' ? 'primary' : 'secondary'} size="sm">Runic ({runicBarCount})</Button>
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

    return (
        <div className="flex flex-col h-full text-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-yellow-400">
                    {smithingType === 'furnace' ? 'Smelting - Furnace' : 'Smithing - Anvil'}
                </h1>
                <Button onClick={onExit}>Exit</Button>
            </div>
            
            {smithingType === 'furnace' ? renderFurnace() : renderAnvil()}
        </div>
    );
};

export default SmithingView;