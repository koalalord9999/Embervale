import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { InventorySlot, Item, BankTab } from '../../types';
import { ITEMS, BANK_CAPACITY, getIconClassName, MAX_BANK_TABS } from '../../constants';
import Button from '../common/Button';
import { ContextMenuOption } from '../common/ContextMenu';
import { MakeXPrompt, TooltipState, ContextMenuState, useUIState, WithdrawMode } from '../../hooks/useUIState';
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
    onWithdraw: (bankIndex: number, quantity: number | 'all' | 'all-but-1', asNote: boolean) => void;
    onPrimaryAction: () => void; // New prop for handling the click logic from parent
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    dragHandlers: any;
    isOneClickMode: boolean;
    onClearPlaceholder: (tabId: number, itemIndex: number) => void;
}

const BankSlot: React.FC<BankSlotProps> = (props) => {
    const { slot, index, asNote, activeTabId, onWithdraw, onPrimaryAction, setContextMenu, setMakeXPrompt, setTooltip, dragHandlers, isOneClickMode, onClearPlaceholder } = props;
    const isTouchDevice = useIsTouchDevice(false);
    const isPlaceholder = slot?.quantity === 0;

    const performWithdrawAction = (quantity: number | 'all' | 'all-but-1') => {
        if (isPlaceholder) return;
        onWithdraw(index, quantity, asNote);
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
        
        const performActionAndClose = (action: () => void) => { action(); setTooltip(null); setContextMenu(null); };

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
                onPrimaryAction();
            }
        }
    };

    const combinedHandlers = { ...useLongPress({ onLongPress: handleLongPress, onClick: handleSingleTap, isOneClickMode }), ...dragHandlers };
    const item = slot ? ITEMS[slot.itemId] : null;

    return (
        <div {...combinedHandlers}
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
    
    const { activeBankTabId, setActiveBankTabId, activeWithdrawMode, setActiveWithdrawMode, customWithdrawAmount, setCustomWithdrawAmount } = ui;
    const [draggingIndex, setDraggingIndex] = useState<{ tabId: number; index: number } | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [dragOverTabId, setDragOverTabId] = useState<number | null>(null);
    const [withdrawAsNote, setWithdrawAsNote] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const isTouchDevice = useIsTouchDevice(false);
    const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    
    const activeTab = bank.find(t => t.id === activeBankTabId) ?? bank[0];

    const itemsToDisplay = useMemo(() => {
        if (!searchTerm) {
            return (activeTab?.items ?? []).map((slot, index) => ({
                slot,
                tabId: activeTab.id,
                index
            }));
        }
        const results: { slot: InventorySlot | null; tabId: number; index: number }[] = [];
        
        bank.forEach(tab => {
            tab.items.forEach((slot, index) => {
                if (!slot) return;
                const itemData = ITEMS[slot.itemId];
                if (!itemData) return;
                
                if (itemData.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    results.push({ slot, tabId: tab.id, index });
                }
            });
        });

        return results;
    }, [activeTab, bank, searchTerm]);


    const totalBankedItems = bank.reduce((total, tab) => total + tab.items.filter(item => item !== null && item.quantity > 0).length, 0);

    const handleToggleClick = (mode: WithdrawMode) => {
        setActiveWithdrawMode(mode);
        if (mode !== 'x') {
            setCustomWithdrawAmount(null);
        }
    };

    const handleSlotPrimaryAction = (itemInfo: { slot: InventorySlot | null, tabId: number, index: number }) => {
        const { slot, tabId, index: realIndex } = itemInfo;
        
        if (!slot || slot.quantity === 0) return;

        let quantityToWithdraw: number | 'all' = 1;

        if (activeWithdrawMode === 'all') {
            quantityToWithdraw = 'all';
        } else if (activeWithdrawMode === 'x') {
            if (customWithdrawAmount !== null) {
                quantityToWithdraw = customWithdrawAmount;
            } else {
                const item = ITEMS[slot.itemId];
                setMakeXPrompt({
                    title: `Withdraw ${item.name}`,
                    max: slot.quantity,
                    onConfirm: (val) => {
                        setCustomWithdrawAmount(val);
                        onWithdraw(realIndex, val, withdrawAsNote, tabId);
                    }
                });
                return;
            }
        } else {
            quantityToWithdraw = activeWithdrawMode;
        }

        onWithdraw(realIndex, quantityToWithdraw, withdrawAsNote, tabId);
        setTooltip(null);
    };

    const handleDragStart = (e: React.DragEvent, displayIndex: number, tabId: number) => {
        setTooltip(null);
        if (searchTerm) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData('application/json', JSON.stringify({ index: displayIndex, tabId }));
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => setDraggingIndex({ index: displayIndex, tabId }), 0);
    };

    const handleDrop = (e: React.DragEvent, toDisplayIndex: number) => {
        e.preventDefault();
        setTooltip(null);
        if (searchTerm) return;

        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            const fromIndex = data.index;
            const fromTabId = data.tabId;
            if (fromTabId === activeBankTabId && fromIndex !== toDisplayIndex) {
                onMoveItem(fromIndex, toDisplayIndex, activeBankTabId);
            }
        } catch (error) { console.error("Drop failed:", error); }
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    const handleTabDrop = (e: React.DragEvent, toTabId: number) => {
        e.preventDefault();
        setDragOverTabId(null);
        if (searchTerm) return;

        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (!data) return;
            const fromIndex = data.index;
            const fromTabId = data.tabId;
            if (fromTabId !== toTabId) {
                onMoveItemToTab(fromIndex, fromTabId, toTabId);
            }
        } catch (error) { console.error("Tab drop failed:", error); }
    };
    
    const handleTouchStart = (e: React.TouchEvent) => {
        if (draggingIndex !== null || searchTerm) return;
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        let currentElement = target;
        let index = -1;
        while (currentElement) {
            const indexStr = currentElement.getAttribute('data-bank-index');
            if (indexStr) {
                index = parseInt(indexStr, 10);
                break;
            }
            currentElement = currentElement.parentElement;
        }
        if (index > -1 && itemsToDisplay[index]?.slot) {
            holdTimer.current = setTimeout(() => {
                const itemInfo = itemsToDisplay[index];
                setDraggingIndex({ index: itemInfo.index, tabId: itemInfo.tabId });
            }, 100);
        }
    };

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (draggingIndex === null) {
            if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
            return;
        }
        if (e.cancelable) e.preventDefault();
        const touch = e.touches[0];
        const overElement = document.elementFromPoint(touch.clientX, touch.clientY);
        let targetDisplayIndex: number | null = null;
        let currentElement = overElement;
        while (currentElement) {
            const indexStr = currentElement.getAttribute('data-bank-index');
            if (indexStr) {
                targetDisplayIndex = parseInt(indexStr, 10);
                break;
            }
            currentElement = currentElement.parentElement;
        }

        if (targetDisplayIndex !== null && itemsToDisplay[targetDisplayIndex]) {
            setDragOverIndex(itemsToDisplay[targetDisplayIndex].index);
        } else {
            setDragOverIndex(null);
        }
    }, [draggingIndex, itemsToDisplay]);

    const handleTouchEnd = () => {
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }
        if (draggingIndex && dragOverIndex !== null) {
            const fromIndex = draggingIndex.index;
            const fromTabId = draggingIndex.tabId;
            const toIndex = dragOverIndex;

            if (fromTabId === activeBankTabId && fromIndex !== toIndex) {
                 onMoveItem(fromIndex, toIndex, fromTabId);
            }
        }
        setDraggingIndex(null);
        setDragOverIndex(null);
    };
    
    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;
        panel.addEventListener('touchmove', handleTouchMove, { passive: false });
        return () => {
            panel.removeEventListener('touchmove', handleTouchMove);
        };
    }, [handleTouchMove]);

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
                        iconContent = <img src="https://api.iconify.design/game-icons:infinity.svg" alt="Main Tab" className="bank-tab-icon filter invert w-8 h-8" />;
                    } else {
                        const firstItem = tab.items.find(item => item !== null && item.quantity > 0);
                        if (firstItem) {
                            const itemData = ITEMS[firstItem.itemId];
                            if (itemData) {
                                iconContent = <img src={itemData.iconUrl} alt={tab.name} className={`bank-tab-icon ${getIconClassName(itemData)} w-8 h-8`} />;
                            }
                        } else {
                            iconContent = <img src="https://api.iconify.design/game-icons:bank.svg" alt="Empty Tab" className="bank-tab-icon filter invert opacity-50 w-8 h-8 " />;
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
                        <img src="https://api.iconify.design/game-icons:health-normal.svg" alt="Add Tab" className="bank-tab-icon filter invert opacity-50 w-8 h-8" />
                    </button>
                )}
            </div>

            <div 
                className="flex-grow min-h-[300px] max-h-[400px] bg-black/40 p-2 rounded-lg border-2 border-gray-600 border-t-0 rounded-t-none pr-1"
                ref={panelRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="bank-grid h-full pb-8">
                    {itemsToDisplay.map((displayItem, displayIndex) => {
                        const { slot, tabId, index: realIndex } = displayItem;
                        let slotClasses = '';
                        const isDraggingThis = draggingIndex?.tabId === tabId && draggingIndex?.index === realIndex;
                        
                        if (isDraggingThis) slotClasses = 'opacity-25';
                        else if (dragOverIndex === realIndex && tabId === activeBankTabId) slotClasses = 'border-green-400 scale-105 bg-green-900/50';
                        else if (slot) slotClasses = 'cursor-pointer hover:border-yellow-400';

                        const dragHandlers = {
                            draggable: !!slot && !searchTerm,
                            'data-bank-index': displayIndex,
                            onDragStart: (e: React.DragEvent) => handleDragStart(e, realIndex, tabId),
                            onDragOver: (e: React.DragEvent) => { e.preventDefault(); if (draggingIndex !== null) setDragOverIndex(realIndex); },
                            onDragLeave: () => setDragOverIndex(null),
                            onDrop: (e: React.DragEvent) => handleDrop(e, realIndex),
                            onDragEnd: () => { setDraggingIndex(null); setDragOverIndex(null); setTooltip(null); },
                            className: `w-full aspect-square bg-gray-900 border-2 border-gray-700 rounded-md flex items-center justify-center p-1 relative transition-all duration-150 ${slot ? 'cursor-grab' : ''} ${slotClasses}`
                        };

                        return <BankSlot 
                            key={`${tabId}-${realIndex}`}
                            slot={slot} 
                            index={realIndex}
                            asNote={withdrawAsNote} 
                            activeTabId={tabId}
                            onWithdraw={(idx, qty, asNote) => onWithdraw(idx, qty, asNote, tabId)}
                            onPrimaryAction={() => handleSlotPrimaryAction(displayItem)}
                            setContextMenu={setContextMenu} 
                            setMakeXPrompt={setMakeXPrompt} 
                            setTooltip={setTooltip} 
                            dragHandlers={dragHandlers} 
                            isOneClickMode={isOneClickMode} 
                            onClearPlaceholder={onClearPlaceholder} 
                        />;
                    })}
                    {itemsToDisplay.length === 0 && searchTerm && (
                         <div className="col-span-full text-center text-gray-400 italic py-4">
                             No items found matching "{searchTerm}".
                         </div>
                    )}
                </div>
            </div>

            <div className="mt-2 pt-2 border-t-2 border-gray-600 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                    <button onClick={() => setWithdrawAsNote(prev => !prev)} className={`w-10 h-10 relative overflow-hidden rounded transition-colors ${withdrawAsNote ? 'bg-yellow-600 border-2 border-yellow-500' : 'bg-gray-700 border-2 border-gray-600 hover:bg-gray-600'}`} title="Toggle Withdraw as Note">
                        <img src="https://api.iconify.design/game-icons:folded-paper.svg" alt="Note" className="item-note-paper" />
                    </button>
                    <button onClick={handleToggleBankPlaceholders} className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${bankPlaceholders ? 'bg-yellow-600 border-2 border-yellow-500' : 'bg-gray-700 border-2 border-gray-600 hover:bg-gray-600'}`} title="Toggle Bank Placeholders">
                        <img src={bankPlaceholders ? "https://api.iconify.design/game-icons:padlock.svg" : "https://api.iconify.design/game-icons:padlock-open.svg"} alt="Placeholders" className="w-6 h-6 filter invert" />
                    </button>
                </div>

                <div className="flex items-center gap-1">
                     {[1, 5, 10].map(qty => (
                        <button
                            key={qty}
                            onClick={() => handleToggleClick(qty as WithdrawMode)}
                            className={`h-10 px-3 rounded font-bold text-sm transition-colors ${activeWithdrawMode === qty ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            {qty}
                        </button>
                    ))}
                    <button
                        onClick={() => handleToggleClick('x')}
                        className={`h-10 px-3 rounded font-bold text-sm transition-colors ${activeWithdrawMode === 'x' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        {customWithdrawAmount ? `X: ${customWithdrawAmount}` : 'X'}
                    </button>
                    <button
                        onClick={() => handleToggleClick('all')}
                        className={`h-10 px-3 rounded font-bold text-sm transition-colors ${activeWithdrawMode === 'all' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        All
                    </button>
                </div>
                
                <div className="flex-grow max-w-xs mx-2">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 px-3 rounded bg-gray-800 border border-gray-600 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
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