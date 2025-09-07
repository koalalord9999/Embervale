import React, { useState } from 'react';
import { InventorySlot } from '../../types';
import { ITEMS, BANK_CAPACITY, getIconClassName } from '../../constants';
import Button from '../common/Button';
import { ContextMenuOption } from '../common/ContextMenu';
import { MakeXPrompt, TooltipState } from '../../hooks/useUIState';

interface BankViewProps {
    bank: (InventorySlot | null)[];
    onClose: () => void;
    onWithdraw: (bankIndex: number, quantity: number | 'all' | 'all-but-1') => void;
    onDepositBackpack: () => void;
    onDepositEquipment: () => void;
    onMoveItem: (from: number, to: number) => void;
    setContextMenu: (menu: { options: ContextMenuOption[]; position: { x: number; y: number; } } | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
}

const formatQuantity = (quantity: number): string => {
    if (quantity >= 100000) return `${Math.floor(quantity / 1000)}k`;
    if (quantity >= 10000) return `${(quantity / 1000).toFixed(1)}k`;
    return quantity.toLocaleString();
};

const BankView: React.FC<BankViewProps> = ({ bank, onClose, onWithdraw, onDepositBackpack, onDepositEquipment, onMoveItem, setContextMenu, setMakeXPrompt, setTooltip }) => {
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    
    const performWithdrawAction = (bankIndex: number, quantity: number | 'all' | 'all-but-1') => {
        onWithdraw(bankIndex, quantity);
        setTooltip(null);
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setTooltip(null);
        e.dataTransfer.setData('application/x-bank-slot-index', index.toString());
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => setDraggingIndex(index), 0);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggingIndex !== null) setDragOverIndex(index);
    };

    const handleDragLeave = () => setDragOverIndex(null);

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

    const handleDragEnd = () => {
        setDraggingIndex(null);
        setDragOverIndex(null);
        setTooltip(null);
    };

    const createWithdrawContextMenu = (e: React.MouseEvent, slot: InventorySlot, index: number) => {
        e.preventDefault();
        const item = ITEMS[slot.itemId];
        if (!item) return;

        const options: ContextMenuOption[] = [
            { label: `Withdraw 1`, onClick: () => performWithdrawAction(index, 1), disabled: slot.quantity < 1 },
        ];

        if (slot.quantity > 1) {
            options.push({ label: `Withdraw 5`, onClick: () => performWithdrawAction(index, 5), disabled: slot.quantity < 5 });
            options.push({ label: `Withdraw 10`, onClick: () => performWithdrawAction(index, 10), disabled: slot.quantity < 10 });
            options.push({ 
                label: 'Withdraw X...', 
                onClick: () => setMakeXPrompt({
                    title: `Withdraw ${item.name}`,
                    max: slot.quantity,
                    onConfirm: (quantity) => performWithdrawAction(index, quantity)
                }), 
                disabled: slot.quantity < 1 
            });
            options.push({ label: `Withdraw All-but-1`, onClick: () => performWithdrawAction(index, 'all-but-1'), disabled: slot.quantity < 2 });
            options.push({ label: `Withdraw All`, onClick: () => performWithdrawAction(index, 'all') });
        }
        
        setContextMenu({ options, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <div className="flex flex-col h-full animate-fade-in text-gray-200">
            <div className="flex justify-between items-center mb-2 pb-2 border-b-2 border-gray-600">
                <h1 className="text-3xl font-bold text-yellow-400">Bank of Embervale</h1>
                <p className="text-gray-400">{bank.filter(Boolean).length} / {BANK_CAPACITY} Slots Used</p>
                <Button onClick={onClose}>Exit Bank</Button>
            </div>

            <div className="flex-grow bg-black/40 p-2 rounded-lg border border-gray-600 overflow-y-auto pr-1">
                <div className="grid grid-cols-8 gap-2 content-start">
                    {bank.map((slot, index) => {
                        const item = slot ? ITEMS[slot.itemId] : null;
                        
                        let slotClasses = '';
                        if (draggingIndex === index) slotClasses = 'opacity-25';
                        else if (dragOverIndex === index) slotClasses = 'border-green-400 scale-105 bg-green-900/50';
                        else if (slot) slotClasses = 'cursor-pointer hover:border-yellow-400';

                        return (
                            <div
                                key={index}
                                className={`w-full aspect-square bg-gray-900 border-2 border-gray-700 rounded-md flex items-center justify-center p-1 relative transition-all duration-150 ${slot ? 'cursor-grab' : ''} ${slotClasses}`}
                                draggable={!!slot}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                onClick={() => {
                                    if (slot && item) performWithdrawAction(index, 1);
                                }}
                                onContextMenu={(e) => {
                                    if (slot && item) createWithdrawContextMenu(e, slot, index);
                                }}
                                onMouseEnter={(e) => {
                                    if (!slot || !item) return;
                                    const tooltipContent = (
                                        <div>
                                            <p className="font-bold text-yellow-300">{item.name}</p>
                                            <p className="text-sm text-gray-300">{item.description}</p>
                                        </div>
                                    );
                                    setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
                                }}
                                onMouseLeave={() => setTooltip(null)}
                            >
                                {slot && item && (
                                    <>
                                        <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
                                        <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                                            {formatQuantity(slot.quantity)}
                                        </span>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-2 pt-2 border-t-2 border-gray-600 flex justify-center gap-4">
                <Button onClick={onDepositBackpack} variant="secondary">Deposit Inventory</Button>
                <Button onClick={onDepositEquipment} variant="secondary">Deposit Equipment</Button>
            </div>
        </div>
    );
};

export default BankView;