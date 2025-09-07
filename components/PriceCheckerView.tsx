
import React, { useState } from 'react';
import { InventorySlot } from '../types';
import { ITEMS, getIconClassName } from '../constants';
import Button from './common/Button';
import { TooltipState } from '../hooks/useUIState';

interface PriceCheckerViewProps {
    inventory: InventorySlot[];
    onClose: () => void;
    setTooltip: (tooltip: TooltipState | null) => void;
}

const PriceCheckerView: React.FC<PriceCheckerViewProps> = ({ inventory, onClose, setTooltip }) => {
    const [checkedItems, setCheckedItems] = useState<InventorySlot[]>([]);

    const addToChecker = (invSlot: InventorySlot, index: number) => {
        const item = ITEMS[invSlot.itemId];
        if (!item) return;

        const existingItem = checkedItems.find(i => i.itemId === invSlot.itemId);

        if (existingItem) {
            // If item is stackable, we just add to the quantity
            if (item.stackable) {
                existingItem.quantity += invSlot.quantity;
            } else {
                 // If not stackable, we add a new entry
                 setCheckedItems(prev => [...prev, { ...invSlot }]);
            }
        } else {
             setCheckedItems(prev => [...prev, { ...invSlot }]);
        }
        setCheckedItems(prev => [...prev]); // Force re-render
    };

    const removeFromChecker = (itemIndex: number) => {
        setCheckedItems(prev => prev.filter((_, i) => i !== itemIndex));
    };

    const totalValue = checkedItems.reduce((acc, slot) => {
        const item = ITEMS[slot.itemId];
        return acc + (item.value * slot.quantity);
    }, 0);

    const inventoryGrid: (InventorySlot | null)[] = new Array(35).fill(null);
    inventory.forEach((item, index) => {
        if (index < 35) inventoryGrid[index] = item;
    });

    const checkerGrid: (InventorySlot | null)[] = new Array(20).fill(null);
    checkedItems.forEach((item, index) => {
        if (index < 20) checkerGrid[index] = item;
    });

    const handleMouseEnter = (e: React.MouseEvent, item: InventorySlot) => {
        const itemData = ITEMS[item.itemId];
        const tooltipContent = (
            <div>
                <p className="font-bold text-yellow-300">{itemData.name}</p>
                <p className="text-sm text-gray-300">Value (each): {itemData.value.toLocaleString()}</p>
                <p className="text-sm text-gray-300">Total Value: {(itemData.value * item.quantity).toLocaleString()}</p>
            </div>
        );
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-3xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b-2 border-gray-600">
                    <h1 className="text-2xl font-bold text-yellow-400">Price Checker</h1>
                    <Button onClick={onClose} size="sm">Close</Button>
                </div>
                <div className="flex p-4 gap-4">
                    {/* Price Checker Area */}
                    <div className="w-1/2 flex flex-col">
                         <div className="flex-grow grid grid-cols-4 gap-2 bg-black/40 p-2 rounded-lg border border-gray-600">
                           {checkerGrid.map((slot, index) => (
                                <div key={index} className="w-full aspect-square bg-gray-900 border border-gray-700 rounded-md p-1 relative cursor-pointer" onClick={() => slot && removeFromChecker(index)} onMouseEnter={(e) => slot && handleMouseEnter(e, slot)} onMouseLeave={() => setTooltip(null)}>
                                     {slot && (
                                        <>
                                            <img src={ITEMS[slot.itemId].iconUrl} alt={ITEMS[slot.itemId].name} className={`w-full h-full ${getIconClassName(ITEMS[slot.itemId])}`} />
                                            {slot.quantity > 1 && (
                                                <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                                                    {slot.quantity > 1000 ? `${Math.floor(slot.quantity / 1000)}k` : slot.quantity}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                           ))}
                        </div>
                        <div className="mt-2 p-2 text-center bg-gray-900 rounded-md border border-gray-600">
                             Total Value: <span className="font-bold text-yellow-400">{totalValue.toLocaleString()} Coins</span>
                        </div>
                    </div>
                    {/* Inventory Area */}
                     <div className="w-1/2 flex flex-col">
                        <div className="flex-grow grid grid-cols-5 gap-2 bg-black/40 p-2 rounded-lg border border-gray-600">
                            {inventoryGrid.map((slot, index) => (
                                <div key={index} className="w-full aspect-square bg-gray-900 border border-gray-700 rounded-md p-1 relative cursor-pointer" onClick={() => slot && addToChecker(slot, index)} onMouseEnter={(e) => slot && handleMouseEnter(e, slot)} onMouseLeave={() => setTooltip(null)}>
                                     {slot && (
                                        <>
                                            <img src={ITEMS[slot.itemId].iconUrl} alt={ITEMS[slot.itemId].name} className={`w-full h-full ${getIconClassName(ITEMS[slot.itemId])}`} />
                                            {slot.quantity > 1 && (
                                                <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                                                    {slot.quantity > 1000 ? `${Math.floor(slot.quantity / 1000)}k` : slot.quantity}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceCheckerView;
