

import React from 'react';
import { InventorySlot } from '../types';
import { ITEMS, BANK_CAPACITY, getIconClassName } from '../constants';
import Button from './common/Button';
import { ContextMenuOption } from './common/ContextMenu';
import { MakeXPrompt, TooltipState } from '../hooks/useUIState';

interface BankViewProps {
    bank: InventorySlot[];
    onClose: () => void;
    onWithdraw: (itemId: string, quantity: number | 'all' | 'all-but-1') => void;
    onDepositBackpack: () => void;
    onDepositEquipment: () => void;
    setContextMenu: (menu: { options: ContextMenuOption[]; position: { x: number; y: number; } } | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
}

const formatQuantity = (quantity: number): string => {
    if (quantity >= 100000) return `${Math.floor(quantity / 1000)}k`;
    if (quantity >= 10000) return `${(quantity / 1000).toFixed(1)}k`;
    return quantity.toLocaleString();
};

const BankView: React.FC<BankViewProps> = ({ bank, onClose, onWithdraw, onDepositBackpack, onDepositEquipment, setContextMenu, setMakeXPrompt, setTooltip }) => {
    const bankGrid: (InventorySlot | null)[] = new Array(BANK_CAPACITY).fill(null);
    bank.forEach((item, index) => {
        if (index < BANK_CAPACITY) bankGrid[index] = item;
    });

    const performWithdrawAction = (itemId: string, quantity: number | 'all' | 'all-but-1') => {
        onWithdraw(itemId, quantity);
        setTooltip(null);
    };

    const createWithdrawContextMenu = (e: React.MouseEvent, slot: InventorySlot) => {
        e.preventDefault();
        const item = ITEMS[slot.itemId];

        const options: ContextMenuOption[] = [
            { label: `Withdraw 1`, onClick: () => performWithdrawAction(slot.itemId, 1), disabled: slot.quantity < 1 },
        ];

        if (slot.quantity > 1) {
            options.push({ label: `Withdraw 5`, onClick: () => performWithdrawAction(slot.itemId, 5), disabled: slot.quantity < 5 });
            options.push({ label: `Withdraw 10`, onClick: () => performWithdrawAction(slot.itemId, 10), disabled: slot.quantity < 10 });
            options.push({ 
                label: 'Withdraw X...', 
                onClick: () => setMakeXPrompt({
                    title: `Withdraw ${item.name}`,
                    max: slot.quantity,
                    onConfirm: (quantity) => performWithdrawAction(slot.itemId, quantity)
                }), 
                disabled: slot.quantity < 1 
            });
            options.push({ label: `Withdraw All-but-1`, onClick: () => performWithdrawAction(slot.itemId, 'all-but-1'), disabled: slot.quantity < 2 });
            options.push({ label: `Withdraw All`, onClick: () => performWithdrawAction(slot.itemId, 'all') });
        }
        
        setContextMenu({ options, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <div className="flex flex-col h-full animate-fade-in text-gray-200">
            <div className="flex justify-between items-center mb-2 pb-2 border-b-2 border-gray-600">
                <h1 className="text-3xl font-bold text-yellow-400">Bank of Embervale</h1>
                <p className="text-gray-400">{bank.length} / {BANK_CAPACITY} Slots Used</p>
                <Button onClick={onClose}>Exit Bank</Button>
            </div>

            <div className="flex-grow bg-black/40 p-2 rounded-lg border border-gray-600 overflow-y-auto pr-1">
                <div className="grid grid-cols-8 gap-2 content-start">
                    {bankGrid.map((slot, index) => (
                        <div
                            key={index}
                            className={`w-full aspect-square bg-gray-900 border border-gray-700 rounded-md flex items-center justify-center p-1 relative transition-colors ${slot ? 'cursor-pointer hover:border-yellow-400' : ''}`}
                            onClick={() => {
                                if (slot) performWithdrawAction(slot.itemId, 1);
                            }}
                            onContextMenu={(e) => {
                                if (slot) createWithdrawContextMenu(e, slot);
                            }}
                            onMouseEnter={(e) => {
                                if (!slot) return;
                                const item = ITEMS[slot.itemId];
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
                            {slot && (
                                <>
                                    <img src={ITEMS[slot.itemId].iconUrl} alt={ITEMS[slot.itemId].name} className={`w-full h-full ${getIconClassName(ITEMS[slot.itemId])}`} />
                                    <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                                        {formatQuantity(slot.quantity)}
                                    </span>
                                </>
                            )}
                        </div>
                    ))}
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