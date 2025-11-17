import React, { useState } from 'react';
import { InventorySlot } from '../../../types';
import { ITEMS, getIconClassName } from '../../../constants';
import Button from '../../common/Button';
import { TooltipState, ContextMenuState, MakeXPrompt } from '../../../hooks/useUIState';
import { getDisplayName } from '../../panels/InventorySlot';
import { useLongPress } from '../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../hooks/useIsTouchDevice';
import { ContextMenuOption } from '../../common/ContextMenu';

const getQuantityColor = (quantity: number): string => {
    if (quantity >= 10000000) return 'text-green-400';
    if (quantity >= 100000) return 'text-white';
    return 'text-yellow-300';
};

const formatItemQuantity = (quantity: number): string => {
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


interface PriceCheckerViewProps {
    inventory: (InventorySlot | null)[];
    onClose: () => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
}

const PriceCheckerView: React.FC<PriceCheckerViewProps> = ({ inventory, onClose, setTooltip, setContextMenu, setMakeXPrompt }) => {
    const [localInventory, setLocalInventory] = useState<(InventorySlot | null)[]>(inventory.map(slot => slot ? { ...slot } : null));
    const [checkedItems, setCheckedItems] = useState<InventorySlot[]>([]);
    const isTouchDevice = useIsTouchDevice(false);

    const addToChecker = (index: number, quantity: 'all' | number) => {
        const fromSlot = localInventory[index];
        if (!fromSlot) return;
        const itemData = ITEMS[fromSlot.itemId];

        let qtyToMove: number;
        let newLocalInv = [...localInventory];

        if (itemData.stackable || fromSlot.noted) {
            qtyToMove = quantity === 'all' ? fromSlot.quantity : Math.min(quantity, fromSlot.quantity);
            if (qtyToMove <= 0) return;

            const currentSlot = newLocalInv[index];
            if (currentSlot) {
                currentSlot.quantity -= qtyToMove;
                if (currentSlot.quantity <= 0) newLocalInv[index] = null;
            }
        } else { // Unstackable
            const allIndices = newLocalInv.map((s, i) => s?.itemId === fromSlot.itemId ? i : -1).filter(i => i !== -1);
            qtyToMove = quantity === 'all' ? allIndices.length : Math.min(quantity, allIndices.length);
            if (qtyToMove <= 0) return;

            for (let i = 0; i < qtyToMove; i++) {
                newLocalInv[allIndices[i]] = null;
            }
        }

        setLocalInventory(newLocalInv);

        setCheckedItems(prev => {
            const newChecked = [...prev];
            const existingIndex = newChecked.findIndex(i => i.itemId === fromSlot.itemId && !!i.noted === !!fromSlot.noted);
            if (existingIndex > -1) {
                newChecked[existingIndex].quantity += qtyToMove;
            } else {
                newChecked.push({ ...fromSlot, quantity: qtyToMove });
            }
            return newChecked;
        });
        setTooltip(null);
    };

    const removeFromChecker = (index: number) => {
        const fromSlot = checkedItems[index];
        if (!fromSlot) return;

        setCheckedItems(prev => prev.filter((_, i) => i !== index));

        setLocalInventory(prev => {
            const newInv = [...prev];
            const itemData = ITEMS[fromSlot.itemId];
            let remainingQty = fromSlot.quantity;

            if (itemData.stackable || fromSlot.noted) {
                const existingIndex = newInv.findIndex(i => i?.itemId === fromSlot.itemId && !!i.noted === !!fromSlot.noted);
                if (existingIndex > -1) {
                    newInv[existingIndex]!.quantity += remainingQty;
                } else {
                    const emptyIndex = newInv.findIndex(i => i === null);
                    if (emptyIndex > -1) newInv[emptyIndex] = fromSlot;
                }
            } else {
                for (let i = 0; i < newInv.length && remainingQty > 0; i++) {
                    if (newInv[i] === null) {
                        newInv[i] = { ...fromSlot, quantity: 1 };
                        remainingQty--;
                    }
                }
            }
            return newInv;
        });
        setTooltip(null);
    };
    
    const createContextMenu = (e: React.MouseEvent | React.TouchEvent, invSlot: InventorySlot, index: number) => {
        let eventForMenu: React.MouseEvent | React.Touch;
        if ('touches' in e && e.touches.length > 0) {
            eventForMenu = e.touches[0];
        } else if ('changedTouches' in e && e.changedTouches.length > 0) {
            eventForMenu = e.changedTouches[0];
        } else {
            eventForMenu = e as React.MouseEvent;
        }

        const item = ITEMS[invSlot.itemId];
        let maxQty: number;
        if(item.stackable || invSlot.noted) {
            maxQty = invSlot.quantity;
        } else {
            maxQty = localInventory.filter(s => s?.itemId === item.id && !s.noted).length;
        }

        const options: ContextMenuOption[] = [
            { label: 'Price-check 1', onClick: () => addToChecker(index, 1), disabled: maxQty < 1 },
            { label: 'Price-check 5', onClick: () => addToChecker(index, 5), disabled: maxQty < 5 },
            { label: 'Price-check 10', onClick: () => addToChecker(index, 10), disabled: maxQty < 10 },
            { label: 'Price-check X...', onClick: () => setMakeXPrompt({
                title: `Price-check ${item.name}`,
                max: maxQty,
                onConfirm: (quantity) => addToChecker(index, quantity)
            }), disabled: maxQty < 1 },
            { label: 'Price-check All', onClick: () => addToChecker(index, 'all'), disabled: maxQty < 1 },
        ];
        setContextMenu({ options, triggerEvent: eventForMenu, isTouchInteraction: 'touches' in e || 'changedTouches' in e, title: getDisplayName(invSlot) });
    };

    const totalValue = checkedItems.reduce((acc, slot) => {
        const item = ITEMS[slot.itemId];
        return acc + ((item?.value ?? 0) * slot.quantity);
    }, 0);

    const inventoryGrid: (InventorySlot | null)[] = new Array(35).fill(null);
    localInventory.forEach((item, index) => {
        if (item && index < 35) inventoryGrid[index] = item;
    });

    const checkerGrid: (InventorySlot | null)[] = new Array(20).fill(null);
    checkedItems.forEach((item, index) => {
        if (index < 20) checkerGrid[index] = item;
    });

    const handleMouseEnter = (e: React.MouseEvent, item: InventorySlot) => {
        const itemData = ITEMS[item.itemId];
        if (!itemData) return;
        const tooltipContent = (
            <div>
                <p className="font-bold text-yellow-300">{getDisplayName(item)}</p>
            </div>
        );
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4 animate-fade-in" onClick={onClose}>
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
                           {checkerGrid.map((slot, index) => {
                                const item = slot ? ITEMS[slot.itemId] : null;
                                return (
                                <div key={index} className="w-full aspect-square bg-gray-900 border border-gray-700 rounded-md p-1 relative cursor-pointer" onClick={() => slot && removeFromChecker(index)} onMouseEnter={(e) => slot && handleMouseEnter(e, slot)} onMouseLeave={() => setTooltip(null)}>
                                     {slot && item && (
                                        <>
                                            {slot.noted ? (
                                                <div className="item-note-wrapper">
                                                    <img src="https://api.iconify.design/game-icons:folded-paper.svg" alt="Note" className="item-note-paper" />
                                                    <img src={item.iconUrl} alt={item.name} className={`item-note-icon ${getIconClassName(item)}`} />
                                                </div>
                                            ) : (
                                                <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
                                            )}
                                            {slot.statsOverride?.poisoned && (
                                                <img 
                                                    src="https://api.iconify.design/game-icons:boiling-bubbles.svg" 
                                                    alt="Poisoned"
                                                    className="poison-overlay-icon item-icon-uncut-emerald"
                                                    title="Poisoned"
                                                />
                                            )}
                                            {slot.quantity > 1 && !item.doseable && (
                                                <span className={`absolute bottom-0 right-1 text-xs font-bold ${getQuantityColor(slot.quantity)}`} style={{ textShadow: '1px 1px 1px black', zIndex: 2 }}>
                                                    {formatItemQuantity(slot.quantity)}
                                                </span>
                                            )}
                                            {item.doseable && slot.doses && (
                                                <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                                                    {slot.doses}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                               )
                           })}
                        </div>
                        <div className="mt-2 p-2 text-center bg-gray-900 rounded-md border border-gray-600">
                             Total Value: <span className="font-bold text-yellow-400">{totalValue.toLocaleString()} Coins</span>
                        </div>
                    </div>
                    {/* Inventory Area */}
                     <div className="w-1/2 flex flex-col">
                        <div className="flex-grow grid grid-cols-5 gap-2 bg-black/40 p-2 rounded-lg border border-gray-600">
                            {inventoryGrid.map((slot, index) => {
                                const item = slot ? ITEMS[slot.itemId] : null;
                                const longPressHandlers = useLongPress({
                                    onLongPress: (e) => slot && createContextMenu(e, slot, index),
                                    onClick: () => slot && addToChecker(index, 'all'),
                                });
                                return (
                                <div 
                                    key={index}
                                    className="w-full aspect-square bg-gray-900 border border-gray-700 rounded-md p-1 relative cursor-pointer"
                                    {...longPressHandlers}
                                    onMouseEnter={(e) => slot && handleMouseEnter(e, slot)} 
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                     {slot && item && (
                                        <>
                                            {slot.noted ? (
                                                <div className="item-note-wrapper">
                                                    <img src="https://api.iconify.design/game-icons:folded-paper.svg" alt="Note" className="item-note-paper" />
                                                    <img src={item.iconUrl} alt={item.name} className={`item-note-icon ${getIconClassName(item)}`} />
                                                </div>
                                            ) : (
                                                <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
                                            )}
                                            {slot.statsOverride?.poisoned && (
                                                <img 
                                                    src="https://api.iconify.design/game-icons:boiling-bubbles.svg" 
                                                    alt="Poisoned"
                                                    className="poison-overlay-icon item-icon-uncut-emerald"
                                                    title="Poisoned"
                                                />
                                            )}
                                            {slot.quantity > 1 && !item.doseable && (
                                                <span className={`absolute bottom-0 right-1 text-xs font-bold ${getQuantityColor(slot.quantity)}`} style={{ textShadow: '1px 1px 1px black' }}>
                                                    {formatItemQuantity(slot.quantity)}
                                                </span>
                                            )}
                                            {item.doseable && slot.doses && (
                                                <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                                                    {slot.doses}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceCheckerView;
