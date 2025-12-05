

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { InventorySlot, PlayerSkill, Item, Spell, Equipment } from '../../types';
import { INVENTORY_CAPACITY } from '../../constants';
import { ConfirmationPrompt, ContextMenuState, MakeXPrompt, useUIState } from '../../hooks/useUIState';
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
    onExamine: (item: Item) => void;
    isTouchSimulationEnabled: boolean;
    isShopOpen?: boolean;
    onSell?: (itemId: string, quantity: number | 'all', inventoryIndex?: number) => void;
    spellToCast: Spell | null;
    onSpellOnItem: (spell: Spell, target: { item: InventorySlot, index: number }) => void;
    onReadMap: (item: Item) => void;
    confirmValuableDrops: boolean;
    valuableDropThreshold: number;
    isOneClickMode: boolean;
    onTeleport: (itemSlot: InventorySlot, slotIdentifier: number | keyof Equipment, from: 'inventory' | keyof Equipment, poiId: string) => void;
    ui: ReturnType<typeof useUIState>;
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
    const { inventory, coins, onMoveItem, itemToUse, setTooltip, spellToCast } = props;
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);

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

    // Mobile Touch Drag Handling
    const handleTouchStart = (e: React.TouchEvent) => {
        // If already dragging, do nothing
        if (draggingIndex !== null) return;

        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // Find the inventory slot element
        let currentElement = target;
        let index = -1;
        
        while (currentElement) {
            const indexStr = currentElement.getAttribute('data-inventory-index');
            if (indexStr) {
                index = parseInt(indexStr, 10);
                break;
            }
            currentElement = currentElement.parentElement;
        }

        if (index > -1 && inventory[index]) {
            // Start a timer. If the user holds for 200ms without moving significantly, start drag.
            holdTimer.current = setTimeout(() => {
                setDraggingIndex(index);
            }, 100);
        }
    };

    const handleTouchMove = useCallback((e: TouchEvent) => {
        // If not dragging yet, this movement might be a scroll. Cancel the timer.
        if (draggingIndex === null) {
            if (holdTimer.current) {
                clearTimeout(holdTimer.current);
                holdTimer.current = null;
            }
            return;
        }

        // If we ARE dragging, prevent default to stop scrolling.
        if (e.cancelable) e.preventDefault();
        
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
    }, [draggingIndex]);

    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;
        
        // We manually add the event listener here with `passive: false`
        // to ensure we can call `preventDefault()` and stop the screen from scrolling on mobile.
        panel.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            panel.removeEventListener('touchmove', handleTouchMove);
        };
    }, [handleTouchMove]);

    const handleTouchEnd = () => {
        // Clear timer if it was running
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }

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
            ref={panelRef}
            className={`flex flex-col h-full text-gray-300 ${itemToUse || spellToCast ? 'cursor-crosshair' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: INVENTORY_CAPACITY }).map((_, index) => (
                    <InventorySlotDisplay
                        key={index}
                        index={index}
                        slot={inventory[index] ?? null}
                        {...props}
                        draggingIndex={draggingIndex}
                        setDraggingIndex={setDraggingIndex}
                        dragOverIndex={dragOverIndex}
                        setDragOverIndex={setDragOverIndex}
                        onDrop={handleDrop}
                        ui={props.ui}
                    />
                ))}
            </div>
            <div className="text-center mt-auto pt-2 p-2 bg-gray-900 rounded-md border border-gray-600">
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