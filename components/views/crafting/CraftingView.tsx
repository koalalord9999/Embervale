import React from 'react';
import { InventorySlot, PlayerSkill, PlayerQuestState, CraftingContext } from '../../../types';
import { MakeXPrompt } from '../../../hooks/useUIState';
import { ContextMenuOption } from '../../common/ContextMenu';
import Button from '../../common/Button';

// Import sub-components for each crafting type
import AnvilInterface from './subviews/AnvilInterface';
import FurnaceInterface from './subviews/FurnaceInterface';
import CookingInterface from './subviews/CookingInterface';
import SpinningInterface from './subviews/SpinningInterface';
import LeatherworkingInterface from './subviews/LeatherworkingInterface';
import GemCuttingInterface from './subviews/GemCuttingInterface';
import FletchingInterface from './subviews/FletchingInterface';

type BarType = 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'silver_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar';

export interface CraftingViewProps {
    context: CraftingContext;
    inventory: InventorySlot[];
    skills: PlayerSkill[];
    playerQuests: PlayerQuestState[];
    onCook: (recipeId: string, quantity: number) => void;
    onCraftItem: (itemId: string, quantity: number) => void;
    onFletch: (action: { type: 'carve'; payload: any }, quantity: number) => void;
    onCut: (cutId: string, quantity: number) => void;
    onSmithBar: (barType: BarType, quantity: number) => void;
    onSmithItem: (itemId: string, quantity: number) => void;
    onSpin: (itemId: string, quantity: number) => void;
    onExit: () => void;
    setContextMenu: (menu: { options: ContextMenuOption[]; position: { x: number; y: number; } } | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
}

const CraftingView: React.FC<CraftingViewProps> = (props) => {
    const { context, onExit } = props;

    const getTitle = () => {
        switch (context.type) {
            case 'anvil': return 'Smithing - Anvil';
            case 'furnace': return 'Smelting - Furnace';
            case 'cooking_range': return 'Cooking - Range';
            case 'spinning_wheel': return 'Spinning';
            case 'leatherworking': return 'Leatherworking';
            case 'gem_cutting': return 'Gem Cutting';
            case 'fletching': return 'Fletching';
            default: return 'Crafting';
        }
    };

    const renderContent = () => {
        switch (context.type) {
            case 'anvil': return <AnvilInterface {...props} />;
            case 'furnace': return <FurnaceInterface {...props} />;
            case 'cooking_range': return <CookingInterface {...props} />;
            case 'spinning_wheel': return <SpinningInterface {...props} />;
            case 'leatherworking': return <LeatherworkingInterface {...props} />;
            case 'gem_cutting': return <GemCuttingInterface {...props} />;
            case 'fletching': return <FletchingInterface {...props} context={context} />;
            default: return <p>Unsupported crafting context.</p>;
        }
    };

    return (
        <div className="flex flex-col h-full text-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-yellow-400">{getTitle()}</h1>
                <Button onClick={onExit}>Exit</Button>
            </div>
            {renderContent()}
        </div>
    );
};

export default CraftingView;
