
import React, { useState, useCallback } from 'react';
import { InventorySlot, Item, BankTab } from '../../types';
import { ITEMS, BANK_CAPACITY, getIconClassName, MAX_BANK_TABS } from '../../constants';
import Button from '../common/Button';
import { ContextMenuOption } from '../common/ContextMenu';
import { MakeXPrompt, TooltipState, ContextMenuState, useUIState } from '../../hooks/useUIState';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { getDisplayName } from '../panels/InventorySlot';

const formatQuantity = (quantity: number): string => {
    if (quantity >= 1000000000) return `${Math.floor(quantity / 1000000000)}B`;
    if (quantity >= 1000000) return `${Math.floor(quantity / 1000000)}M`;
    if (quantity >= 10000) return `${Math.floor(quantity / 1000)}k`;
    return quantity.toLocaleString();
};

const getQuantityColor = (quantity: number): string => {
    if (quantity >= 10000000) return 'text-green-400';
    if (quantity >= 100000) return 'text-white';
    return 'text-yellow-300';
};

interface BankSlotProps {
    slot: InventorySlot | null;
    index: number;
    asNote: boolean;
    activeTabId: number;
    onWithdraw: (bankIndex: number, quantity: number | 'all' | 'all-but-1', asNote: boolean, activeTabId: number) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    dragHandlers: any;
    isOneClickMode: boolean;
    onClearPlaceholder: (tabId: number, itemIndex: number) => void;
}

const BankSlot: React.FC<BankSlotProps> = (props) => {
    const { slot, index, asNote, activeTabId, onWithdraw, setContextMenu, setMakeXPrompt, setTooltip, dragHandlers, isOneClickMode, onClearPlaceholder } = props;
    const isTouchDevice = useIsTouchDevice(false);
    const isPlaceholder = slot?.quantity === 0;

    const performWithdrawAction = (quantity: number | 'all' | 'all-but-1') => {
        if (isPlaceholder) return;
        onWithdraw(index, quantity, asNote, activeTabId);
        setTooltip(null);
    };

    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        
        let eventForMenu: React.MouseEvent | React.Touch;
        if ('touches' in e && e.touches.length > 0) {
            eventForMenu = e.touches[0];
        } else if ('changedTouches' in e && e.changedTouches.length > 0) {
            eventForMenu = e.changedTouches[0];
        } else {
            eventForMenu = e as React.MouseEvent;
        }

        const item = slot ? ITEMS[slot.itemId] : null;
        if (!slot || !item) return;
        
        const performActionAndClose = (action: () => void) => {
            action();
            setTooltip(null);
            setContextMenu(null);
        };

        if (isPlaceholder) {
            setContextMenu({
                options: [
                    { label: 'Clear placeholder', onClick: () => performActionAndClose(() => onClearPlaceholder(activeTabId, index)) },
                    { label: 'Examine', onClick: () => { setTooltip(null); setContextMenu(null); alert(item.description); } }
                ],
                triggerEvent: eventForMenu,
                isTouchInteraction: 'touches' in e || 'changedTouches' in e,
                title: getDisplayName(slot)
            });
            return;
        }

        const options: ContextMenuOption[] = [
            { label: `Withdraw 1`, onClick: () => performActionAndClose(() => performWithdrawAction(1)), disabled: slot.quantity < 1 || isPlaceholder },
        ];
        if (slot.quantity > 1) {
            options.push({ label: `Withdraw 5`, onClick: () => performActionAndClose(() => performWithdrawAction(5)), disabled: slot.quantity < 5 || isPlaceholder });
            options.push({ label: `Withdraw 10`, onClick: () => performActionAndClose(() => performWithdrawAction(10)), disabled: slot.quantity < 10 || isPlaceholder });
            options.push({
                label: 'Withdraw X...',
                onClick: () => {
                    setContextMenu(null);
                    setMakeXPrompt({
                        title: `Withdraw ${item.name}`,
                        max: slot.quantity,
                        onConfirm: (quantity) => performWithdrawAction(quantity)
                    });
                },
                disabled: slot.quantity < 1 || isPlaceholder
            });
            options.push({ label: `Withdraw All-but-1`, onClick: () => performActionAndClose(() => performWithdrawAction('all-but-1')), disabled: slot.quantity < 2 || isPlaceholder });
            options.push({ label: `Withdraw All`, onClick: () => performActionAndClose(() => performWithdrawAction('all')), disabled: isPlaceholder });
        }
        options.push({ label: 'Examine', onClick: () => { setTooltip(null); setContextMenu(null); alert(item.description); } });
        setContextMenu({ options, triggerEvent: eventForMenu, isTouchInteraction: isTouchDevice, title: getDisplayName(slot) });
    };

    const handleSingleTap = (e: React.MouseEvent | React.TouchEvent) => {
        if (slot && !isPlaceholder) {
            if ('shiftKey' in e && e.shiftKey) {
                performWithdrawAction('all');
            } else {
                performWithdrawAction(1);
            }
        }
    };

    const combinedHandlers = { ...useLongPress({ onLongPress: handleLongPress, onClick: handleSingleTap, isOneClickMode }), ...dragHandlers };
    const item = slot ? ITEMS[slot.itemId] : null;

    return (
        <div {...combinedHandlers}
            data-bank-index={index}
            onMouseEnter={(e) => {
                if (item && slot) {
                    const content = isPlaceholder ? null : <p className="text-sm mt-1 text-gray-400">Quantity: {slot.quantity.toLocaleString()}</p>;
                    setTooltip({ item, slot, content, position: { x: e.clientX, y: e.clientY } });
                }
            }}
            onMouseLeave={() => setTooltip(null)}
        >
            {slot && item && (
                <>
                    <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)} ${isPlaceholder ? 'opacity-10' : ''}`} />
                    {slot.statsOverride?.poisoned && (
                        <img 
                            src="https://api.iconify.design/game-icons:boiling-bubbles.svg" 
                            alt="Poisoned"
                            className="poison-overlay-icon item-icon-uncut-emerald"
                            title="Poisoned"
                        />
                    )}
                    <span className={`absolute bottom-0 right-1 text-xs font-bold ${getQuantityColor(slot.quantity)} ${isPlaceholder ? 'opacity-20' : ''}`} style={{ textShadow: '1px 1px 1px black' }}>
                        {isPlaceholder ? '0' : formatQuantity(slot.quantity)}
                    </span>
                </>
            )}
        </div>
    );
};


interface BankViewProps {
    bank: BankTab[];
    onClose: () => void;
    onWithdraw: (bankIndex: number, quantity: number | 'all' | 'all-but-1', asNote: boolean, activeTabId: number) => void;
    onDepositBackpack: () => void;
    onDepositEquipment: () => void;
    onMoveItem: (from: number, to: number, activeTabId: number) => void;
    onAddTab: () => void;
    onRemoveTab: (tabId: number) => void;
    onMoveItemToTab: (fromItemIndex: number, fromTabId: number, toTabId: number) => void;
    onRenameTab: (tabId: number, newName: string) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    bankPlaceholders: boolean;
    handleToggleBankPlaceholders: () => void;
    ui: ReturnType<typeof useUIState>;
    isOneClickMode: boolean;
    onClearPlaceholder: (tabId: number, itemIndex: number) => void;
}

const BankView: React.FC<BankViewProps> = (props) => {
    const { bank, onClose, onWithdraw, onDepositBackpack, onDepositEquipment, onMoveItem, onAddTab, onRemoveTab, onMoveItemToTab, onRenameTab, setContextMenu, setMakeXPrompt, setTooltip, bankPlaceholders, handleToggleBankPlaceholders, ui, isOneClickMode, onClearPlaceholder } = props;
    
    const { activeBankTabId, setActiveBankTabId } = ui;
    const [draggingIndex, setDraggingIndex] = useState<{ tabId: number; index: number } | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [dragOverTabId, setDragOverTabId] = useState<number | null>(null);
    const [withdrawAsNote, setWithdrawAsNote] = useState(false);
    const isTouchDevice = useIsTouchDevice(false);
    
    const activeTab = bank.find(t => t.id === activeBankTabId) ?? bank[0];
    const itemsToDisplay = activeTab?.items ?? [];

    const totalBankedItems = bank.reduce((total, tab) => total + tab.items.filter(item => item !== null && item.quantity > 0).length, 0);

    // --- Mouse Drag Handlers ---
    const handleDragStart = (e: React.DragEvent, index: number, tabId: number) => {
        setTooltip(null);
        e.dataTransfer.setData('application/json', JSON.stringify({ index, tabId }));
        setTimeout(() => setDraggingIndex({ index, tabId }), 0);
    };

    const handleDrop = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault();
        setTooltip(null);
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            const fromIndex = data.index;
            const fromTabId = data.tabId;
            if (fromTabId === activeBankTabId && fromIndex !== toIndex) {
                onMoveItem(fromIndex, toIndex, activeBankTabId);
            }
        } catch (error) { console.error("Drop failed:", error); }
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    const handleTabDrop = (e: React.DragEvent, toTabId: number) => {
        e.preventDefault();
        setDragOverTabId(null);
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (!data) return; // Prevent error on failed drag
            const fromIndex = data.index;
            const fromTabId = data.tabId;
            if (fromTabId !== toTabId) {
                onMoveItemToTab(fromIndex, fromTabId, toTabId);
            }
        } catch (error) { console.error("Tab drop failed:", error); }
    };
    
    // --- Touch Drag Handlers ---
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // Find the bank slot element
        let currentElement = target;
        while (currentElement) {
            const indexStr = currentElement.getAttribute('data-bank-index');
            if (indexStr) {
                const index = parseInt(indexStr, 10);
                // Check if slot has item
                if (itemsToDisplay[index]) {
                    setDraggingIndex({ index, tabId: activeBankTabId });
                }
                break;
            }
            currentElement = currentElement.parentElement;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!draggingIndex) return;
        
        // Prevent scrolling while dragging an item
        if (e.cancelable) e.preventDefault();
        
        const touch = e.touches[0];
        const overElement = document.elementFromPoint(touch.clientX, touch.clientY);
        
        let targetIndex: number | null = null;
        let currentElement = overElement;
        while (currentElement) {
            const indexStr = currentElement.getAttribute('data-bank-index');
            if (indexStr) {
                targetIndex = parseInt(indexStr, 10);
                break;
            }
            currentElement = currentElement.parentElement;
        }
        
        setDragOverIndex(targetIndex);
    };

    const handleTouchEnd = () => {
        if (draggingIndex && dragOverIndex !== null && draggingIndex.index !== dragOverIndex && draggingIndex.tabId === activeBankTabId) {
             onMoveItem(draggingIndex.index, dragOverIndex, activeBankTabId);
        }
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    const handleTabContextMenu = (e: React.MouseEvent, tab: BankTab) => {
        e.preventDefault();
        setContextMenu({
            triggerEvent: e, isTouchInteraction: isTouchDevice,
            options: [
                { label: 'Rename', onClick: () => {
                    const newName = window.prompt("Enter new tab name (max 12 chars):", tab.name);
                    if (newName) onRenameTab(tab.id, newName);
                }},
                { label: 'Delete Tab', onClick: () => onRemoveTab(tab.id), disabled: tab.id === 0 },
            ],
        });
    };
    
    const handleTabClick = (tabId: number) => {
        setActiveBankTabId(tabId);
        setTooltip(null);
    };

    return (
        <div className={`flex flex-col h-full animate-fade-in text-gray-200`} onClick={() => setTooltip(null)}>
            <div className="flex justify-between items-start mb-2 pb-2 border-b-2 border-gray-600">
                <h1 className="text-3xl font-bold text-yellow-400">Bank of Embrune</h1>
                <div className="text-right">
                    <p className="text-gray-400">{totalBankedItems} / {BANK_CAPACITY} Slots Used</p>
                    <Button onClick={onClose} size="sm">Exit Bank</Button>
                </div>
            </div>
            
            <div className="bank-tabs-container flex items-end -mb-px">
                {bank.map(tab => {
                    let iconContent = null;
                    if (tab.id === 0) {
                        iconContent = <img src="https://api.iconify.design/game-icons:infinity.svg" alt="Main Tab" className="bank-tab-icon filter invert" />;
                    } else {
                        const firstItem = tab.items.find(item => item !== null && item.quantity > 0);
                        if (firstItem) {
                            const itemData = ITEMS[firstItem.itemId];
                            if (itemData) {
                                iconContent = <img src={itemData.iconUrl} alt={tab.name} className={`bank-tab-icon ${getIconClassName(itemData)}`} />;
                            }
                        } else {
                            iconContent = <img src="https://api.iconify.design/game-icons:bank.svg" alt="Empty Tab" className="bank-tab-icon filter invert opacity-50" />;
                        }
                    }

                    const dndHandlers = !isTouchDevice ? {
                        onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDragOverTabId(tab.id); },
                        onDragLeave: () => setDragOverTabId(null),
                        onDrop: (e: React.DragEvent) => handleTabDrop(e, tab.id),
                    } : {};

                    return (
                        <button
                            key={tab.id}
                            className={`bank-tab ${tab.id === activeBankTabId ? 'active' : ''} ${dragOverTabId === tab.id ? 'bank-tab-drag-over' : ''}`}
                            onClick={() => handleTabClick(tab.id)}
                            onContextMenu={(e) => handleTabContextMenu(e, tab)}
                            onMouseEnter={(e) => setTooltip({ content: tab.name, position: { x: e.clientX, y: e.clientY } })}
                            onMouseLeave={() => setTooltip(null)}
                            {...dndHandlers}
                        >
                            {iconContent}
                        </button>
                    );
                })}
                {bank.length < MAX_BANK_TABS && (
                     <button
                        className="bank-tab"
                        onClick={() => { onAddTab(); setTooltip(null); }}
                        onMouseEnter={(e) => setTooltip({ content: 'Add new tab', position: { x: e.clientX, y: e.clientY }})}
                        onMouseLeave={() => setTooltip(null)}
                    >
                        <img src="https://api.iconify.design/game-icons:health-normal.svg" alt="Add Tab" className="bank-tab-icon filter invert opacity-50" />
                    </button>
                )}
            </div>

            <div 
                className="flex-grow min-h-[300px] bg-black/40 p-2 rounded-lg border-2 border-gray-600 border-t-0 rounded-t-none pr-1"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="bank-grid h-full">
                    {itemsToDisplay.map((slot, index) => {
                        let slotClasses = '';
                        const isDraggingThis = draggingIndex?.tabId === activeBankTabId && draggingIndex?.index === index;
                        if (isDraggingThis) slotClasses = 'opacity-25';
                        else if (dragOverIndex === index) slotClasses = 'border-green-400 scale-105 bg-green-900/50';
                        else if (slot) slotClasses = 'cursor-pointer hover:border-yellow-400';

                        const dragHandlers = {
                            draggable: !!slot,
                            onDragStart: (e: React.DragEvent) => handleDragStart(e, index, activeBankTabId),
                            onDragOver: (e: React.DragEvent) => { e.preventDefault(); if (draggingIndex !== null) setDragOverIndex(index); },
                            onDragLeave: () => setDragOverIndex(null),
                            onDrop: (e: React.DragEvent) => handleDrop(e, index),
                            onDragEnd: () => { setDraggingIndex(null); setDragOverIndex(null); setTooltip(null); },
                            className: `w-full aspect-square bg-gray-900 border-2 border-gray-700 rounded-md flex items-center justify-center p-1 relative transition-all duration-150 ${slot ? 'cursor-grab' : ''} ${slotClasses}`
                        };

                        return <BankSlot key={index} slot={slot} index={index} asNote={withdrawAsNote} activeTabId={activeBankTabId} onWithdraw={onWithdraw} setContextMenu={setContextMenu} setMakeXPrompt={setMakeXPrompt} setTooltip={setTooltip} dragHandlers={dragHandlers} isOneClickMode={isOneClickMode} onClearPlaceholder={onClearPlaceholder} />;
                    })}
                </div>
            </div>

            <div className="mt-2 pt-2 border-t-2 border-gray-600 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={() => setWithdrawAsNote(prev => !prev)} className={`w-10 h-10 relative overflow-hidden rounded transition-colors ${withdrawAsNote ? 'bg-yellow-600 border-2 border-yellow-500' : 'bg-gray-700 border-2 border-gray-600 hover:bg-gray-600'}`} title="Toggle Withdraw as Note">
                        <img src="https://api.iconify.design/game-icons:folded-paper.svg" alt="Note" className="item-note-paper" />
                    </button>
                    <button onClick={handleToggleBankPlaceholders} className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${bankPlaceholders ? 'bg-yellow-600 border-2 border-yellow-500' : 'bg-gray-700 border-2 border-gray-600 hover:bg-gray-600'}`} title="Toggle Bank Placeholders">
                        <img src={bankPlaceholders ? "https://api.iconify.design/game-icons:padlock.svg" : "https://api.iconify.design/game-icons:padlock-open.svg"} alt="Placeholders" className="w-6 h-6 filter invert" />
                    </button>
                </div>
                <div className="flex justify-center gap-2">
                    <button onClick={() => onDepositBackpack()} className="w-10 h-10 flex items-center justify-center rounded bg-gray-700 border-2 border-gray-600 hover:bg-gray-600 transition-colors" title="Deposit Inventory">
                        <img src="https://api.iconify.design/game-icons:profit.svg" alt="Deposit Inventory" className="w-6 h-6 filter invert" />
                    </button>
                    <button onClick={() => onDepositEquipment()} className="w-10 h-10 relative flex items-center justify-center rounded bg-gray-700 border-2 border-gray-600 hover:bg-gray-600 transition-colors overflow-hidden" title="Deposit Equipment">
                        <img src="https://api.iconify.design/game-icons:contract.svg" alt="" className="bank-action-bg-icon" />
                        <img src="https://api.iconify.design/game-icons:battle-gear.svg" alt="Deposit Equipment" className="relative w-6 h-6 filter invert" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankView;
