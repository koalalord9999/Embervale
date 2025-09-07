
import React from 'react';
import { InventorySlot, PlayerSkill, SkillName } from '../types';
import { GEM_CUTTING_RECIPES, ITEMS, getIconClassName } from '../constants';
import Button from './common/Button';
import { ContextMenuOption } from './common/ContextMenu';
import { MakeXPrompt } from '../hooks/useUIState';

interface GemCuttingViewProps {
    inventory: InventorySlot[];
    skills: PlayerSkill[];
    onCut: (cutId: string, quantity: number) => void;
    onExit: () => void;
    setContextMenu: (menu: { options: ContextMenuOption[]; position: { x: number; y: number; } } | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
}

const GemCuttingView: React.FC<GemCuttingViewProps> = ({ inventory, skills, onCut, onExit, setContextMenu, setMakeXPrompt }) => {
    const craftingLevel = skills.find(s => s.name === SkillName.Crafting)?.level ?? 1;

    const getItemCount = (itemId: string) => inventory.filter(slot => slot.itemId === itemId).length;
    const hasChisel = inventory.some(slot => slot.itemId === 'chisel');

    const createContextMenu = (e: React.MouseEvent, recipe: typeof GEM_CUTTING_RECIPES[0]) => {
        e.preventDefault();
        const maxCut = getItemCount(recipe.uncutId);
        const hasLevel = craftingLevel >= recipe.level;

        const options: ContextMenuOption[] = [
            { label: 'Cut 1', onClick: () => onCut(recipe.cutId, 1), disabled: !hasLevel || maxCut < 1 || !hasChisel },
            { label: 'Cut 5', onClick: () => onCut(recipe.cutId, 5), disabled: !hasLevel || maxCut < 5 || !hasChisel },
            { label: 'Cut All', onClick: () => onCut(recipe.cutId, maxCut), disabled: !hasLevel || maxCut < 1 || !hasChisel },
            { 
                label: 'Cut X...', 
                onClick: () => setMakeXPrompt({
                    title: `Cut ${ITEMS[recipe.cutId].name}`,
                    max: maxCut,
                    onConfirm: (quantity) => onCut(recipe.cutId, quantity)
                }), 
                disabled: !hasLevel || maxCut < 1 || !hasChisel
            },
        ];
        setContextMenu({ options, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <div className="flex flex-col h-full text-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-yellow-400">Gem Cutting</h1>
                <Button onClick={onExit}>Exit</Button>
            </div>
             {!hasChisel && <p className="text-center text-red-400 mb-4">You need a chisel in your inventory to cut gems.</p>}
            
            <div className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {GEM_CUTTING_RECIPES.map((recipe) => {
                        const cutItem = ITEMS[recipe.cutId];
                        const uncutItem = ITEMS[recipe.uncutId];
                        if (!cutItem || !uncutItem) return null;
                        
                        const uncutCount = getItemCount(recipe.uncutId);
                        const hasLevel = craftingLevel >= recipe.level;
                        const hasIngredients = uncutCount > 0 && hasChisel;
                        const canCut = hasLevel && hasIngredients;

                        return (
                            <div 
                                key={recipe.cutId} 
                                className={`bg-gray-900 p-3 rounded-lg border-2 ${canCut ? 'border-gray-600' : 'border-red-800/50'}`}
                                onContextMenu={(e) => createContextMenu(e, recipe)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={cutItem.iconUrl} alt={cutItem.name} className={`w-10 h-10 bg-black/30 p-1 rounded ${getIconClassName(cutItem)}`} />
                                    <h3 className="text-lg font-semibold text-yellow-300">{cutItem.name}</h3>
                                </div>
                                <div className="text-sm space-y-1 mb-3">
                                    <p className={hasLevel ? 'text-gray-400' : 'text-red-400'}>
                                        Lvl: {recipe.level}
                                    </p>
                                    <p className={hasIngredients ? 'text-gray-400' : 'text-red-400'}>
                                        {uncutItem.name}: 1 ({uncutCount} owned)
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => onCut(recipe.cutId, 1)}
                                    disabled={!canCut}
                                    className="w-full"
                                >
                                    Cut 1
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GemCuttingView;