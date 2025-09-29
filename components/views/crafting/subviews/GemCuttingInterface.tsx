
import React from 'react';
import { InventorySlot, PlayerSkill, SkillName } from '../../../../types';
import { GEM_CUTTING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import { CraftingViewProps } from '../CraftingView';
import { useLongPress } from '../../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../../hooks/useIsTouchDevice';

const GemCuttingSlot: React.FC<{
    recipe: typeof GEM_CUTTING_RECIPES[0];
    craftingLevel: number;
    getItemCount: (itemId: string) => number;
    hasChisel: boolean;
    onCut: (cutId: string, quantity: number) => void;
    setContextMenu: CraftingViewProps['setContextMenu'];
    setMakeXPrompt: CraftingViewProps['setMakeXPrompt'];
    setTooltip: CraftingViewProps['setTooltip'];
    isTouchDevice: boolean;
}> = ({ recipe, craftingLevel, getItemCount, hasChisel, onCut, setContextMenu, setMakeXPrompt, setTooltip, isTouchDevice }) => {
    const cutItem = ITEMS[recipe.cutId];
    const uncutItem = ITEMS[recipe.uncutId];
    if (!cutItem || !uncutItem) return null;
    
    const uncutCount = getItemCount(recipe.uncutId);
    const hasLevel = craftingLevel >= recipe.level;
    const hasIngredients = uncutCount > 0 && hasChisel;
    const canCut = hasLevel && hasIngredients;

    const handleSingleTap = () => { if(canCut) { onCut(recipe.cutId, 1); setTooltip(null); } };

    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const event = 'touches' in e ? e.touches[0] : e;
        const maxCut = getItemCount(recipe.uncutId);
        setContextMenu({
            options: [
                { label: 'Cut 1', onClick: () => onCut(recipe.cutId, 1), disabled: !canCut },
                { label: 'Cut 5', onClick: () => onCut(recipe.cutId, 5), disabled: !canCut || maxCut < 5 },
                { label: 'Cut All', onClick: () => onCut(recipe.cutId, maxCut), disabled: !canCut },
                { 
                    label: 'Cut X...', 
                    onClick: () => setMakeXPrompt({
                        title: `Cut ${cutItem.name}`, max: maxCut,
                        onConfirm: (quantity) => onCut(recipe.cutId, quantity)
                    }), 
                    disabled: !canCut
                },
            ], event, isTouchInteraction: isTouchDevice
        });
    };

    const longPressHandlers = useLongPress({ onLongPress: handleLongPress, onClick: handleSingleTap });

    const handleMouseEnter = (e: React.MouseEvent) => {
        const craftTime = 1.2;
    
        const tooltipContent = (
            <div className="text-sm text-left w-48">
                <p className="font-bold text-yellow-300 mb-2 pb-1 border-b border-gray-600">{cutItem.name}</p>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Materials</p>
                <ul className="list-disc list-inside mb-2">
                    <li className={uncutCount > 0 ? 'text-green-400' : 'text-red-400'}>{uncutItem.name} x1</li>
                    <li className={hasChisel ? 'text-green-400' : 'text-red-400'}>Chisel</li>
                </ul>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Output</p>
                <p className="mb-2 text-gray-300">{cutItem.name} x1</p>
                
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

    return (
        <div 
            className={`crafting-slot ${!canCut ? 'disabled' : ''}`} 
            {...longPressHandlers}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            <div className={`crafting-slot-level ${hasLevel ? 'met' : 'unmet'}`}>
                Lvl {recipe.level}
            </div>
            <img src={cutItem.iconUrl} alt={cutItem.name} className={`crafting-slot-icon ${getIconClassName(cutItem)}`} />
            <div className="crafting-slot-ingredients">
                <div className="ingredient-icon" title={`${uncutItem.name} (${uncutCount})`}>
                    <img src={uncutItem.iconUrl} alt={uncutItem.name} className={getIconClassName(uncutItem)} />
                </div>
            </div>
        </div>
    );
};


const GemCuttingInterface: React.FC<CraftingViewProps> = ({ inventory, skills, onCut, setContextMenu, setMakeXPrompt, setTooltip }) => {
    const craftingLevel = skills.find(s => s.name === SkillName.Crafting)?.currentLevel ?? 1;
    const isTouchDevice = useIsTouchDevice(false);

    const getItemCount = (itemId: string): number => {
        return inventory.reduce((total, slot) => {
            if (slot && slot.itemId === itemId && !slot.noted) {
                return total + slot.quantity;
            }
            return total;
        }, 0);
    };
    const hasChisel = inventory.some(slot => slot && slot.itemId === 'chisel');

    return (
        <div className="flex-grow overflow-y-auto pr-2">
            {!hasChisel && <p className="text-center text-red-400 mb-4">You need a chisel in your inventory to cut gems.</p>}
            <div className="crafting-grid">
                {GEM_CUTTING_RECIPES.map((recipe) => (
                    <GemCuttingSlot
                        key={recipe.cutId}
                        recipe={recipe}
                        craftingLevel={craftingLevel}
                        getItemCount={getItemCount}
                        hasChisel={hasChisel}
                        onCut={onCut}
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

export default GemCuttingInterface;
