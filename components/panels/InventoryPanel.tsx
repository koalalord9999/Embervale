
import React, { useState } from 'react';
import { InventorySlot, PlayerSkill, Item } from '../../types';
import { INVENTORY_CAPACITY } from '../../constants';
import { ConfirmationPrompt, ContextMenuState, MakeXPrompt } from '../../hooks/useUIState';
import InventorySlotDisplay from './InventorySlot';

interface InventoryPanelProps {
    inventory: (InventorySlot | null)[];
    coins: number;
    skills: PlayerSkill[];
    onEquip: (itemSlot: InventorySlot, index: number) => void;
    onConsume: (itemId: string, index: number) => void;
    onDropItem: (index: number, quantity: number | 'all') => void;
    onBury: (itemId: string, index: number) => void;
    onEmpty: (itemId: string, index: number) => void;
    onDivine: (itemId: string, index: number) => void;
    setTooltip: (tooltip: { content: React.ReactNode; position: { x: number; y: number; } } | null) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    addLog: (message: string) => void;
    isBankOpen?: boolean;
    onDeposit?: (inventoryIndex: number, quantity: number | 'all') => void;
    itemToUse: { item: InventorySlot, index: number } | null;
    setItemToUse: (item: { item: InventorySlot, index: number } | null) => void;
    onUseItemOn: (used: { item: InventorySlot, index: number }, target: { item: InventorySlot, index: number }) => void;
    onMoveItem: (from: number, to: number) => void;
    isBusy?: boolean;
    setConfirmationPrompt: (prompt: ConfirmationPrompt | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    tutorialStage?: number;
    advanceTutorial?: (condition: string) => void;
    onTutorialAction?: (action: 'left_click_axe') => void;
    onExamine: (item: Item) => void;
    isTouchSimulationEnabled: boolean;
    isShopOpen?: boolean;
    onSell?: (itemId: string, quantity: number | 'all', inventoryIndex?: number) => void;
}

const formatCoins = (quantity: number): string => {
    if (quantity >= 10000000) {
        return `${Math.floor(quantity / 1000000)}M`;
    }
    if (quantity >= 100000) {
        return `${Math.floor(quantity / 1000)}k`;
    }
    return quantity.toLocaleString();
};

const getCoinColor = (quantity: number): string => {
    if (quantity >= 10000000) return 'text-green-400';
    if (quantity >= 100000) return 'text-white';
    return 'text-yellow-400';
};

const InventoryPanel: React.FC<InventoryPanelProps> = (props) => {
    const { inventory, coins, onMoveItem, itemToUse, setTooltip } = props;
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDrop = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault();
        props.setTooltip(null);
        const fromIndexStr = e.dataTransfer.getData('application/x-inventory-slot-index');
        if (fromIndexStr === null) return;
        
        const fromIndex = parseInt(fromIndexStr, 10);
        if (!isNaN(fromIndex) && fromIndex !== toIndex) {
            onMoveItem(fromIndex, toIndex);
        }
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (draggingIndex === null) return;
        
        const touch = e.touches[0];
        const overElement = document.elementFromPoint(touch.clientX, touch.clientY);
        
        let targetIndex: number | null = null;
        let currentElement = overElement;
        while (currentElement) {
            const indexStr = currentElement.getAttribute('data-inventory-index');
            if (indexStr) {
                targetIndex = parseInt(indexStr, 10);
                break;
            }
            currentElement = currentElement.parentElement;
        }
        
        setDragOverIndex(targetIndex);
    };

    const handleTouchEnd = () => {
        if (draggingIndex !== null && dragOverIndex !== null && draggingIndex !== dragOverIndex) {
            onMoveItem(draggingIndex, dragOverIndex);
        }
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    const handleCoinMouseEnter = (e: React.MouseEvent) => {
        if (coins >= 100000) {
            setTooltip({
                content: coins.toLocaleString(),
                position: { x: e.clientX, y: e.clientY }
            });
        }
    };

    const handleCoinMouseLeave = () => {
        if (coins >= 100000) {
            setTooltip(null);
        }
    };

    return (
        <div 
            className={`flex flex-col h-full text-gray-300 ${itemToUse ? 'cursor-crosshair' : ''}`}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <h3 className="text-lg font-bold text-center mb-2 text-yellow-400">Inventory</h3>
            <div className="grid grid-cols-5 gap-2 flex-grow">
                {Array.from({ length: INVENTORY_CAPACITY }).map((_, index) => (
                    <InventorySlotDisplay
                        key={index}
                        index={index}
                        slot={inventory[index] ?? null}
                        {...props}
                        onDropItem={props.onDropItem}
                        draggingIndex={draggingIndex}
                        setDraggingIndex={setDraggingIndex}
                        dragOverIndex={dragOverIndex}
                        setDragOverIndex={setDragOverIndex}
                        onDrop={handleDrop}
                    />
                ))}
            </div>
            <div className="text-center mt-2 p-2 bg-gray-900 rounded-md border border-gray-600">
                <p
                    onMouseEnter={handleCoinMouseEnter}
                    onMouseLeave={handleCoinMouseLeave}
                    className={coins >= 100000 ? 'cursor-pointer' : ''}
                >
                    Coins: <span className={`font-bold ${getCoinColor(coins)}`}>{formatCoins(coins)}</span>
                </p>
            </div>
        </div>
    );
};

export default InventoryPanel;
