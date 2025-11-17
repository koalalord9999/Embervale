
import React from 'react';
import { InventorySlot, PlayerSkill, Item, Spell, Equipment } from '../../types';
import { ITEMS, INVENTORY_CAPACITY, getIconClassName } from '../../constants';
import { ContextMenuOption } from '../common/ContextMenu';
import { ConfirmationPrompt, ContextMenuState, MakeXPrompt } from '../../hooks/useUIState';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

const TUTORIAL_ITEM_IDS = ['bronze_axe', 'tinderbox', 'logs', 'bronze_sword', 'unusual_sandwich'];

export const getDisplayName = (slot: InventorySlot | null): string => {
    if (!slot) return '';
    if (slot.nameOverride) return slot.nameOverride;
    const item = ITEMS[slot.itemId];
    if (!item) return "Unknown Item";

    if (item.consumable?.teleportOptions && typeof slot.charges === 'number') {
        if (item.destroyOnEmpty === false && slot.charges === 0) {
            return item.name;
        }
        return `${item.name} (${slot.charges})`;
    }

    if (item.doseable && typeof slot.doses === 'number') {
        return `${item.name} (${slot.doses})`;
    }
    return item.name;
};

const getQuantityColor = (quantity: number): string => {
    if (quantity >= 10000000) return 'text-green-400'; // Green for 10M+
    if (quantity >= 100000) return 'text-white'; // White for 100k+
    return 'text-yellow-300'; // Default yellow
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


interface InventorySlotProps {
    index: number;
    slot: InventorySlot | null;
    inventory: (InventorySlot | null)[];
    coins: number;
    skills: PlayerSkill[];
    onEquip: (itemSlot: InventorySlot, index: number) => void;
    onConsume: (itemId: string, index: number) => void;
    onDropItem: (index: number, quantity: number | 'all') => void;
    onBury: (itemId: string, index: number) => void;
    onEmpty: (itemId: string, index: number) => void;
    onDivine: (itemId: string, index: number) => void;
    setTooltip: (tooltip: { content?: React.ReactNode; item?: Item; slot?: InventorySlot; position: { x: number; y: number; } } | null) => void;
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
    
    draggingIndex: number | null;
    setDraggingIndex: (index: number | null) => void;
    dragOverIndex: number | null;
    setDragOverIndex: (index: number | null) => void;
    onDrop: (e: React.DragEvent, toIndex: number) => void;
    isTouchSimulationEnabled: boolean;
    isShopOpen?: boolean;
    onSell?: (itemId: string, quantity: number | 'all', inventoryIndex?: number) => void;
    spellToCast: Spell | null;
    onSpellOnItem: (spell: Spell, target: { item: InventorySlot, index: number }) => void;
    confirmValuableDrops: boolean;
    valuableDropThreshold: number;
    isOneClickMode: boolean;
    onReadMap: (item: Item) => void;
    onTeleport: (itemSlot: InventorySlot, slotIdentifier: number | keyof Equipment, from: 'inventory' | keyof Equipment, poiId: string) => void;
}

const InventorySlotDisplay: React.FC<InventorySlotProps> = (props) => {
    const { index, slot, inventory, skills, onEquip, onConsume, onDropItem, onBury, onEmpty, setTooltip, setContextMenu, addLog, isBankOpen = false, onDeposit = () => {}, itemToUse, setItemToUse, onUseItemOn, isBusy = false, setConfirmationPrompt, onExamine, draggingIndex, setDraggingIndex, dragOverIndex, setDragOverIndex, onDrop, isTouchSimulationEnabled, onDivine, onReadMap, isShopOpen = false, onSell = () => {}, spellToCast, onSpellOnItem, confirmValuableDrops, valuableDropThreshold, isOneClickMode, onTeleport } = props;

    const isTouchDevice = useIsTouchDevice(isTouchSimulationEnabled);

    const performAction = (action: () => void) => {
        action();
        setTooltip(null);
    };
    
    const handleDropClick = () => {
        if (!slot) return;
        const item = ITEMS[slot.itemId];
        if (!item) return;

        const quantityToDrop = item.stackable || slot.noted ? 'all' : 1;
        const valueToDrop = item.stackable || slot.noted ? item.value * slot.quantity : item.value;

        if (confirmValuableDrops && valueToDrop > valuableDropThreshold) {
            setConfirmationPrompt({
                message: `Are you sure you want to drop your ${getDisplayName(slot)}? (Value: ${valueToDrop.toLocaleString()})`,
                onConfirm: () => performAction(() => onDropItem(index, quantityToDrop))
            });
        } else {
            performAction(() => onDropItem(index, quantityToDrop));
        }
    };

    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        let eventForMenu: React.MouseEvent | React.Touch;
        if ('touches' in e && e.touches.length > 0) {
            eventForMenu = e.touches[0];
        } else if ('changedTouches' in e && e.changedTouches.length > 0) {
            eventForMenu = e.changedTouches[0];
        } else {
            eventForMenu = e as React.MouseEvent;
        }

        if (!eventForMenu || !slot) return;
        const item = ITEMS[slot.itemId];
        if (!item) return;

        const options: ContextMenuOption[] = [];
        
        const performActionAndClose = (action: () => void) => { action(); setTooltip(null); setContextMenu(null); };
        
        if (isBankOpen) {
            let totalQuantity = 0;
            if (item.stackable || slot.noted) {
                totalQuantity = slot.quantity;
            } else {
                totalQuantity = inventory.reduce((acc, invSlot) => {
                    return (invSlot && invSlot.itemId === item.id) ? acc + invSlot.quantity : acc;
                }, 0);
            }
    
            options.push({ label: 'Deposit 1', onClick: () => performActionAndClose(() => onDeposit(index, 1)), disabled: totalQuantity < 1 });
            if (totalQuantity > 1) {
                options.push({ label: 'Deposit 5', onClick: () => performActionAndClose(() => onDeposit(index, 5)), disabled: totalQuantity < 5 });
                options.push({ label: 'Deposit 10', onClick: () => performActionAndClose(() => onDeposit(index, 10)), disabled: totalQuantity < 10 });
            }
            
            options.push({
                label: 'Deposit X...',
                onClick: () => {
                    setContextMenu(null);
                    props.setMakeXPrompt({
                        title: `Deposit ${item.name}`,
                        max: totalQuantity,
                        onConfirm: (quantity) => onDeposit(index, quantity)
                    });
                },
                disabled: totalQuantity < 1
            });
    
            options.push({ label: 'Deposit All', onClick: () => performActionAndClose(() => onDeposit(index, 'all')) });
        } else if (isShopOpen) {
            if (item.value === 0) {
                options.push({ label: 'Examine', onClick: () => onExamine(item) });
                setContextMenu({ options, triggerEvent: eventForMenu, isTouchInteraction: isTouchDevice, title: getDisplayName(slot) });
                return;
            }
            
            let totalQuantity;
            if (item.stackable || slot.noted) {
                totalQuantity = slot.quantity;
            } else {
                totalQuantity = inventory.filter(s => s?.itemId === item.id && !s.noted).length;
            }
            
            const sellAction = (quantity: number | 'all') => {
                performActionAndClose(() => onSell(slot.itemId, quantity, index));
            };

            options.push({ label: 'Sell 1', onClick: () => sellAction(1), disabled: totalQuantity < 1 });
            options.push({ label: 'Sell 5', onClick: () => sellAction(5), disabled: totalQuantity < 1 });
            options.push({ label: 'Sell 10', onClick: () => sellAction(10), disabled: totalQuantity < 1 });
            options.push({ label: 'Sell 50', onClick: () => sellAction(50), disabled: totalQuantity < 1 });
            options.push({ label: 'Sell All', onClick: () => sellAction('all'), disabled: totalQuantity < 1 });
            
        } else if (slot.noted) {
            options.push({ label: 'Use', onClick: () => { setItemToUse({ item: slot, index }); }, disabled: isBusy });
            options.push({ label: 'Drop', onClick: handleDropClick, disabled: isBusy });
        } else {
            if (item.mappable) options.push({ label: 'Read', onClick: () => performActionAndClose(() => onReadMap(item)), disabled: isBusy });
            if (item.equipment) options.push({ label: 'Equip', onClick: () => performActionAndClose(() => onEquip(slot, index)), disabled: isBusy });
            if (item.buryable) options.push({ label: 'Bury', onClick: () => performActionAndClose(() => onBury(item.id, index)), disabled: isBusy });
            if (item.cleanable) options.push({ label: 'Clean', onClick: () => performActionAndClose(() => onConsume(item.id, index)), disabled: isBusy });

            if (item.consumable?.teleportOptions) {
                const charges = slot.charges ?? item.charges ?? 0;
                const isDisabled = (item.destroyOnEmpty === false && charges <= 0) || isBusy;
                options.push({
                    label: 'Rub',
                    disabled: isDisabled,
                    onClick: () => {
                        const teleportOptions: ContextMenuOption[] = item.consumable!.teleportOptions!.map(opt => ({
                            label: opt.label,
                            disabled: opt.disabled,
                            onClick: () => {
                                onTeleport(slot, index, 'inventory', opt.poiId);
                                return false;
                            }
                        }));
                        setContextMenu({
                            options: teleportOptions,
                            title: getDisplayName(slot),
                            triggerEvent: eventForMenu,
                            isTouchInteraction: isTouchDevice,
                        });
                        return true; // Keep menu open
                    },
                });
            } else if (item.consumable) {
                let actionText = 'Consume';
                if (item.consumable.givesCoins) actionText = 'Open';
                else if (item.doseable) actionText = 'Drink';
                else if (item.consumable.healAmount) actionText = 'Eat';
                options.push({ label: actionText, onClick: () => performActionAndClose(() => onConsume(item.id, index)), disabled: isBusy });
            }

            if (item.divining) {
                options.push({ label: 'Divine', onClick: () => performActionAndClose(() => onDivine(item.id, index)), disabled: isBusy });
            }

            options.push({ label: 'Use', onClick: () => { setItemToUse({ item: slot, index }); }, disabled: isBusy });
            
            const isTutorialItem = false; // Tutorial stage logic is removed

            if (item.emptyable) options.push({ label: 'Empty', onClick: () => performActionAndClose(() => onEmpty(item.id, index)), disabled: isBusy });
            
            options.push({ label: 'Drop', onClick: handleDropClick, disabled: isBusy || isTutorialItem });
        }

        options.push({ label: 'Examine', onClick: () => onExamine(item) });
        setContextMenu({ options, triggerEvent: eventForMenu, isTouchInteraction: isTouchDevice, title: getDisplayName(slot) });
    };

    const handleSingleTap = (e: React.MouseEvent | React.TouchEvent) => {
        if (isOneClickMode) {
            handleLongPress(e);
            return;
        }

        if (!slot) return;
        const item = ITEMS[slot.itemId];
        if (!item) return;

        if (isShopOpen) {
            setTooltip(null);
            const sellPrice = Math.floor(item.value * 0.2);
            addLog(`[${getDisplayName(slot)}] Sell price: ${sellPrice} coins.`);
            return;
        }

        if (spellToCast && slot) {
            setTooltip(null);
            onSpellOnItem(spellToCast, { item: slot, index: index });
            return;
        }

        if (itemToUse) {
            setTooltip(null);
            if (itemToUse.index !== index) {
                onUseItemOn(itemToUse, { item: slot, index: index });
            } else {
                setItemToUse(null);
            }
            return;
        }
        
        if (isBusy) {
            addLog("You are busy and cannot do that right now.");
            return;
        }

        if ('shiftKey' in e && e.shiftKey) {
            if (isBankOpen) {
                performAction(() => onDeposit(index, 'all'));
            } else if (isShopOpen) {
                performAction(() => onSell(slot.itemId, 'all', index));
            } else {
                handleDropClick();
            }
            return;
        }

        if (isBankOpen) {
            performAction(() => onDeposit(index, 1));
            return;
        }
        
        if (slot.noted) {
            setTooltip(null);
            setItemToUse({ item: slot, index: index });
            return;
        }
        
        const isEquippable = !!item.equipment;
        const isBuryable = !!item.buryable;
        const isConsumable = !!item.consumable;
        const isDivining = !!item.divining;
        const isMappable = !!item.mappable;

        if (isMappable) performAction(() => onReadMap(item));
        else if (isDivining) performAction(() => onDivine(item.id, index));
        else if (isEquippable) performAction(() => onEquip(slot, index));
        else if (isBuryable) performAction(() => onBury(item.id, index));
        else if (item.cleanable) performAction(() => onConsume(item.id, index));
        else if (isConsumable) performAction(() => onConsume(item.id, index));
        else {
            setTooltip(null);
            setItemToUse({ item: slot, index: index });
        }
    };
    
    const combinedHandlers = useLongPress({
        onLongPress: handleLongPress,
        onClick: handleSingleTap,
    });

    const handleDragStart = (e: React.DragEvent, index: number) => {
        if (isBusy || itemToUse) { e.preventDefault(); return; }
        setTooltip(null);
        e.dataTransfer.setData('application/x-inventory-slot-index', index.toString());
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => setDraggingIndex(index), 0);
    };

    const item = slot ? ITEMS[slot.itemId] : null;
    let slotClasses = 'hover:border-yellow-400';
    if (draggingIndex === index) slotClasses = 'opacity-25';
    else if (dragOverIndex === index) slotClasses = 'border-green-400 scale-105 bg-green-900/50';
    else if (itemToUse || spellToCast) {
        slotClasses = 'hover:border-green-400';
        if (itemToUse?.index === index || spellToCast) slotClasses += ' border-blue-400 animate-pulse';
    }

    return (
        <div
            data-inventory-index={index}
            data-tutorial-id={slot ? `inventory-slot-${slot.itemId}` : `inventory-slot-empty-${index}`}
            draggable={!!slot && !isBusy && !itemToUse}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => { e.preventDefault(); if (draggingIndex !== null) setDragOverIndex(index); }}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={(e) => onDrop(e, index)}
            onDragEnd={() => { setDraggingIndex(null); setDragOverIndex(null); setTooltip(null); }}
            className={`w-full aspect-square bg-gray-900 border-2 border-gray-600 rounded-md flex items-center justify-center p-1 relative transition-all duration-150 ${slot ? 'cursor-pointer' : ''} ${slotClasses}`}
            {...combinedHandlers}
            onMouseEnter={(e) => {
                if (item && slot) {
                    setTooltip({ item, slot, position: { x: e.clientX, y: e.clientY } });
                }
            }}
            onMouseLeave={() => setTooltip(null)}
        >
            {item && slot && (
                <>
                    {slot.noted ? (
                        <div className="item-note-wrapper">
                            <img src="https://api.iconify.design/game-icons:folded-paper.svg" alt="Note" className="item-note-paper" />
                            <img src={item.iconUrl} alt={item.name} className={`item-note-icon ${getIconClassName(item)}`} />
                        </div>
                    ) : (
                        <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
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
                    {(item.id.startsWith('grimy_') || item.id.startsWith('clean_') || item.id.endsWith('_potion_unf')) && (
                        <span className="absolute bottom-0.5 left-0 right-0 text-center text-xs font-bold text-yellow-400 pointer-events-none" style={{ textShadow: '1px 1px 2px black', lineHeight: '1' }}>
                            {item.id.startsWith('grimy_')
                                ? `G${item.name.split(' ')[1]?.substring(0, 3) ?? ''}`
                                : item.name.split(' ')[0].substring(0, 4)}
                        </span>
                    )}
                    {slot?.statsOverride?.poisoned && (
                        <img 
                            src="https://api.iconify.design/game-icons:boiling-bubbles.svg" 
                            alt="Poisoned"
                            className="poison-overlay-icon item-icon-uncut-emerald"
                            title="Poisoned"
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default InventorySlotDisplay;
