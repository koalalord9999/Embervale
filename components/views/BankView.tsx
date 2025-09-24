import React, { useState } from 'react';
import { InventorySlot, Item } from '../../types';
import { ITEMS, BANK_CAPACITY, getIconClassName } from '../../constants';
import Button from '../common/Button';
import { ContextMenuOption } from '../common/ContextMenu';
import { MakeXPrompt, TooltipState, ContextMenuState } from '../../hooks/useUIState';
import { useDoubleTap } from '../../hooks/useDoubleTap';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { getDisplayName } from '../panels/InventorySlot';


interface BankViewProps {
    bank: (InventorySlot | null)[];
    onClose: () => void;
    onWithdraw: (bankIndex: number, quantity: number | 'all' | 'all-but-1', asNote: boolean) => void;
    onDepositBackpack: () => void;
    onDepositEquipment: () => void;
    onMoveItem: (from: number, to: number) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
}

const formatQuantity = (quantity: number): string => {
    if (quantity >= 1000000000) {
        return `${Math.floor(quantity / 1000000000)}B`;
    }
    if (quantity >= 1000000) {
        return `${Math.floor(quantity / 1000000)}M`;
    }
    if (quantity >= 10000) {
        return `${Math.floor(quantity / 1000)}k`;
    }
    return quantity.toLocaleString();
};


const getQuantityColor = (quantity: number): string => {
    if (quantity >= 10000000) return 'text-green-400'; // Green for 10M+
    if (quantity >= 100000) return 'text-white'; // White for 100k+
    return 'text-yellow-300'; // Default yellow
};

const BankSlot: React.FC<{
    slot: InventorySlot | null;
    index: number;
    asNote: boolean;
    onWithdraw: (bankIndex: number, quantity: number | 'all' | 'all-but-1', asNote: boolean) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    dragHandlers: any;
}> = ({ slot, index, asNote, onWithdraw, setContextMenu, setMakeXPrompt, setTooltip, dragHandlers }) => {
    const isTouchDevice = useIsTouchDevice(false); // Used only for context menu type

    const performWithdrawAction = (quantity: number | 'all' | 'all-but-1') => {
        onWithdraw(index, quantity, asNote);
        setTooltip(null);
    };

    const handleSingleTap = (e: React.MouseEvent | React.TouchEvent) => {
        if (slot) {
            if ('shiftKey' in e && e.shiftKey) {
                performWithdrawAction('all');
            } else {
                performWithdrawAction(1);
            }
        }
    };

    const handleDoubleTap = () => {
        if (slot) {
            const item = ITEMS[slot.itemId];
            if (item) setTooltip({ content: item.description, position: { x: window.innerWidth / 2, y: window.innerHeight / 2 } });
        }
    };
    
    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const event = 'touches' in e ? e.touches[0] : e;
        const item = slot ? ITEMS[slot.itemId] : null;
        if (!slot || !item) return;

        const options: ContextMenuOption[] = [
            { label: `Withdraw 1`, onClick: () => performWithdrawAction(1), disabled: slot.quantity < 1 },
        ];
        if (slot.quantity > 1) {
            options.push({ label: `Withdraw 5`, onClick: () => performWithdrawAction(5), disabled: slot.quantity < 5 });
            options.push({ label: `Withdraw 10`, onClick: () => performWithdrawAction(10), disabled: slot.quantity < 10 });
            options.push({ 
                label: 'Withdraw X...', 
                onClick: () => setMakeXPrompt({
                    title: `Withdraw ${item.name}`,
                    max: slot.quantity,
                    onConfirm: (quantity) => performWithdrawAction(quantity)
                }), 
                disabled: slot.quantity < 1 
            });
            options.push({ label: `Withdraw All-but-1`, onClick: () => performWithdrawAction('all-but-1'), disabled: slot.quantity < 2 });
            options.push({ label: `Withdraw All`, onClick: () => performWithdrawAction('all') });
        }
        setContextMenu({ options, event, isTouchInteraction: isTouchDevice });
    };

    const doubleTapHandlers = useDoubleTap({ onSingleTap: handleSingleTap, onDoubleTap: handleDoubleTap });
    const longPressHandlers = useLongPress({ onLongPress: handleLongPress, onClick: doubleTapHandlers.onClick });

    const combinedHandlers = {
        ...longPressHandlers,
        ...dragHandlers,
        onTouchEnd: doubleTapHandlers.onTouchEnd,
    };

    const item = slot ? ITEMS[slot.itemId] : null;

    return (
        <div
            {...combinedHandlers}
            onMouseEnter={(e) => {
                if (item && slot) {
                    setTooltip({ item, slot, content: <p className="text-sm mt-1 text-gray-400">Quantity: {slot.quantity.toLocaleString()}</p>, position: { x: e.clientX, y: e.clientY } });
                }
            }}
            onMouseLeave={() => setTooltip(null)}
        >
            {slot && item && (
                <>
                    <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
                    <span className={`absolute bottom-0 right-1 text-xs font-bold ${getQuantityColor(slot.quantity)}`} style={{ textShadow: '1px 1px 1px black' }}>
                        {formatQuantity(slot.quantity)}
                    </span>
                    {(item.id.startsWith('grimy_') || item.id.startsWith('clean_') || item.id.endsWith('_potion_unf')) && (
                        <span className="absolute bottom-0.5 left-0 right-0 text-center text-xs font-bold text-yellow-400 pointer-events-none" style={{ textShadow: '1px 1px 2px black', lineHeight: '1' }}>
                            {item.id.startsWith('grimy_')
                                ? `G${item.name.split(' ')[1]?.substring(0, 3) ?? ''}`
                                : item.name.split(' ')[0].substring(0, 4)}
                        </span>
                    )}
                </>
            )}
        </div>
    );
};


const BankView: React.FC<BankViewProps> = ({ bank, onClose, onWithdraw, onDepositBackpack, onDepositEquipment, onMoveItem, setContextMenu, setMakeXPrompt, setTooltip }) => {
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [withdrawAsNote, setWithdrawAsNote] = useState(false);
    
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setTooltip(null);
        e.dataTransfer.setData('application/x-bank-slot-index', index.toString());
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => setDraggingIndex(index), 0);
    };

    const handleDrop = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault();
        setTooltip(null);
        const fromIndexStr = e.dataTransfer.getData('application/x-bank-slot-index');
        if (fromIndexStr === null) return;
        
        const fromIndex = parseInt(fromIndexStr, 10);
        if (!isNaN(fromIndex) && fromIndex !== toIndex) {
            onMoveItem(fromIndex, toIndex);
        }
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className="flex flex-col h-full animate-fade-in text-gray-200">
            <div className="flex justify-between items-center mb-2 pb-2 border-b-2 border-gray-600">
                <h1 className="text-3xl font-bold text-yellow-400">Bank of Embrune</h1>
                <p className="text-gray-400">{bank.filter(Boolean).length} / {BANK_CAPACITY} Slots Used</p>
                <Button onClick={onClose}>Exit Bank</Button>
            </div>

            <div className="flex-grow bg-black/40 p-2 rounded-lg border border-gray-600 overflow-y-auto pr-1 min-h-0">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2 content-start">
                    {bank.map((slot, index) => {
                        let slotClasses = '';
                        if (draggingIndex === index) slotClasses = 'opacity-25';
                        else if (dragOverIndex === index) slotClasses = 'border-green-400 scale-105 bg-green-900/50';
                        else if (slot) slotClasses = 'cursor-pointer hover:border-yellow-400';

                        const dragHandlers = {
                            draggable: !!slot,
                            onDragStart: (e: React.DragEvent) => handleDragStart(e, index),
                            onDragOver: (e: React.DragEvent) => { e.preventDefault(); if (draggingIndex !== null) setDragOverIndex(index); },
                            onDragLeave: () => setDragOverIndex(null),
                            onDrop: (e: React.DragEvent) => handleDrop(e, index),
                            onDragEnd: () => { setDraggingIndex(null); setDragOverIndex(null); setTooltip(null); },
                            className: `w-full aspect-square bg-gray-900 border-2 border-gray-700 rounded-md flex items-center justify-center p-1 relative transition-all duration-150 ${slot ? 'cursor-grab' : ''} ${slotClasses}`
                        };

                        return (
                            <BankSlot 
                                key={index} 
                                slot={slot} 
                                index={index}
                                asNote={withdrawAsNote}
                                onWithdraw={onWithdraw} 
                                setContextMenu={setContextMenu} 
                                setMakeXPrompt={setMakeXPrompt} 
                                setTooltip={setTooltip} 
                                dragHandlers={dragHandlers} 
                            />
                        );
                    })}
                </div>
            </div>

            <div className="mt-2 pt-2 border-t-2 border-gray-600 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setWithdrawAsNote(prev => !prev)}
                        className={`px-3 py-1 text-sm font-semibold rounded ${withdrawAsNote ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        Withdraw as Note
                    </button>
                </div>
                <div className="flex justify-center gap-4">
                    <Button onClick={onDepositBackpack} variant="secondary">Deposit Inventory</Button>
                    <Button onClick={onDepositEquipment} variant="secondary">Deposit Equipment</Button>
                </div>
            </div>
        </div>
    );
};

export default BankView;