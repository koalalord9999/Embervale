
import React from 'react';
import { InventorySlot, PlayerSkill, Item } from '../../types';
import { ITEMS, INVENTORY_CAPACITY, getIconClassName } from '../../constants';
import { ContextMenuOption } from '../common/ContextMenu';
import { ConfirmationPrompt, ContextMenuState, MakeXPrompt } from '../../hooks/useUIState';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { useDoubleTap } from '../../hooks/useDoubleTap';

const TUTORIAL_ITEM_IDS = ['bronze_axe', 'tinderbox', 'logs', 'bronze_sword', 'unusual_sandwich'];

export const getDisplayName = (slot: InventorySlot | null): string => {
    if (!slot) return '';
    const item = ITEMS[slot.itemId];
    if (!item) return "Unknown Item";

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
    
    draggingIndex: number | null;
    setDraggingIndex: (index: number | null) => void;
    dragOverIndex: number | null;
    setDragOverIndex: (index: number | null) => void;
    onDrop: (e: React.DragEvent, toIndex: number) => void;
    isTouchSimulationEnabled: boolean;
    isShopOpen?: boolean;
    onSell?: (itemId: string, quantity: number | 'all', inventoryIndex?: number) => void;
}

const InventorySlotDisplay: React.FC<InventorySlotProps> = (props) => {
    const { index, slot, inventory, skills, onEquip, onConsume, onDropItem, onBury, onEmpty, setTooltip, setContextMenu, addLog, isBankOpen = false, onDeposit = () => {}, itemToUse, setItemToUse, onUseItemOn, isBusy = false, setConfirmationPrompt, tutorialStage, advanceTutorial, onTutorialAction, onExamine, draggingIndex, setDraggingIndex, dragOverIndex, setDragOverIndex, onDrop, isTouchSimulationEnabled, onDivine, isShopOpen = false, onSell = () => {} } = props;

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

        if (valueToDrop > 1000) {
            setConfirmationPrompt({
                message: `Are you sure you want to drop your ${getDisplayName(slot)}?`,
                onConfirm: () => performAction(() => onDropItem(index, quantityToDrop))
            });
        } else {
            performAction(() => onDropItem(index, quantityToDrop));
        }
    };

    const handleSingleTap = (e: React.MouseEvent | React.TouchEvent) => {
        if (!slot) return;
        const item = ITEMS[slot.itemId];
        if (!item) return;

        if (tutorialStage === 5 && slot.itemId === 'bronze_axe' && onTutorialAction) {
            onTutorialAction('left_click_axe');
            return;
        }

        if (itemToUse) {
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

        if (isShopOpen) {
            const sellPrice = Math.floor(item.value * 0.2);
            addLog(`[${getDisplayName(slot)}] Sell price: ${sellPrice} coins.`);
            return;
        }

        if (slot.noted) {
            setItemToUse({ item: slot, index: index });
            return;
        }
        
        const isEquippable = !!item.equipment;
        const isBuryable = !!item.buryable;
        const isConsumable = !!item.consumable;
        const isDivining = !!item.divining;

        if (isDivining) performAction(() => onDivine(item.id, index));
        else if (isEquippable) performAction(() => onEquip(slot, index));
        else if (isBuryable) performAction(() => onBury(item.id, index));
        else if (item.cleanable) performAction(() => onConsume(item.id, index));
        else if (isConsumable) performAction(() => onConsume(item.id, index));
        else setItemToUse({ item: slot, index: index });
    };

    const handleDoubleTap = () => {
        if (!slot) return;
        const item = ITEMS[slot.itemId];
        if (!item) return;
        onExamine(item);
    };

    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        const event = 'touches' in e ? e.touches[0] : e;
        if (!slot) return;
        const item = ITEMS[slot.itemId];
        if (!item) return;

        if (tutorialStage === 5 && slot.itemId === 'bronze_axe' && advanceTutorial) {
            advanceTutorial('context-menu-axe');
        }

        const options: ContextMenuOption[] = [];
        
        if (isBankOpen) {
            let totalQuantity = 0;
            if (item.stackable || slot.noted) {
                totalQuantity = slot.quantity;
            } else {
                totalQuantity = inventory.reduce((acc, invSlot) => {
                    return (invSlot && invSlot.itemId === item.id) ? acc + invSlot.quantity : acc;
                }, 0);
            }
    
            options.push({ label: 'Deposit 1', onClick: () => performAction(() => onDeposit(index, 1)), disabled: totalQuantity < 1 });
            if (totalQuantity > 1) {
                options.push({ label: 'Deposit 5', onClick: () => performAction(() => onDeposit(index, 5)), disabled: totalQuantity < 5 });
                options.push({ label: 'Deposit 10', onClick: () => performAction(() => onDeposit(index, 10)), disabled: totalQuantity < 10 });
            }
            
            options.push({
                label: 'Deposit X...',
                onClick: () => {
                    setConfirmationPrompt(null); // Close confirmation if open
                    props.setMakeXPrompt({
                        title: `Deposit ${item.name}`,
                        max: totalQuantity,
                        onConfirm: (quantity) => onDeposit(index, quantity)
                    });
                },
                disabled: totalQuantity < 1
            });
    
            options.push({ label: 'Deposit All', onClick: () => performAction(() => onDeposit(index, 'all')) });
        } else if (isShopOpen) {
            if (item.value === 0) {
                options.push({ label: 'Examine', onClick: () => onExamine(item) });
                setContextMenu({ options, event, isTouchInteraction: isTouchDevice });
                return;
            }
            
            let totalQuantity;
            if (item.stackable || slot.noted) {
                totalQuantity = slot.quantity;
            } else {
                totalQuantity = inventory.filter(s => s?.itemId === item.id && !s.noted).length;
            }
            
            const sellAction = (quantity: number | 'all') => {
                performAction(() => onSell(slot.itemId, quantity, index));
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
            if (item.equipment) options.push({ label: 'Equip', onClick: () => performAction(() => onEquip(slot, index)), disabled: isBusy });
            if (item.buryable) options.push({ label: 'Bury', onClick: () => performAction(() => onBury(item.id, index)), disabled: isBusy });
            if (item.cleanable) options.push({ label: 'Clean', onClick: () => performAction(() => onConsume(item.id, index)), disabled: isBusy });
            if (item.consumable) {
                let actionText = 'Consume';
                if (item.consumable.givesCoins) actionText = 'Open';
                else if (item.doseable) actionText = 'Drink';
                else if (item.consumable.healAmount) actionText = 'Eat';
                options.push({ label: actionText, onClick: () => performAction(() => onConsume(item.id, index)), disabled: isBusy });
            }
            if (item.divining) {
                options.push({ label: 'Divine', onClick: () => performAction(() => onDivine(item.id, index)), disabled: isBusy });
            }

            options.push({ label: 'Use', onClick: () => { setItemToUse({ item: slot, index }); }, disabled: isBusy });
            
            const isTutorialItem = tutorialStage >= 0 && TUTORIAL_ITEM_IDS.includes(item.id);

            if (item.emptyable) options.push({ label: 'Empty', onClick: () => performAction(() => onEmpty(item.id, index)), disabled: isBusy });
            
            options.push({ label: 'Drop', onClick: handleDropClick, disabled: isBusy || isTutorialItem });
        }

        options.push({ label: 'Examine', onClick: () => onExamine(item) });
        setContextMenu({ options, event, isTouchInteraction: isTouchDevice });
    };

    const doubleTapHandlers = useDoubleTap({
        onSingleTap: handleSingleTap,
        onDoubleTap: handleDoubleTap
    });

    const longPressHandlers = useLongPress({
        onLongPress: handleLongPress,
        onClick: doubleTapHandlers.onClick, // Pass the double-tap handler as the single click
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
    else if (itemToUse) {
        slotClasses = 'hover:border-green-400';
        if (itemToUse.index === index) slotClasses += ' border-blue-400 animate-pulse';
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
            {...longPressHandlers}
            onTouchEnd={doubleTapHandlers.onTouchEnd}
            onMouseEnter={(e) => {
                if (!item || !slot) return;
                const { equipment } = item;
                 const tooltipContent = (
                    <div>
                        <p className="font-bold text-yellow-300">{getDisplayName(slot)}</p>
                        <p className="text-sm text-gray-300">{item.description}</p>
                        {item.stackable && slot.quantity > 999 && (
                            <p className="text-sm mt-1 text-gray-400">Quantity: {slot.quantity.toLocaleString()}</p>
                        )}
                        {equipment && (
                            <div className="mt-2 pt-2 border-t border-gray-600 text-xs grid grid-cols-2 gap-x-4">
                                <span>Stab Atk:</span><span className="font-semibold text-right">{equipment.stabAttack}</span>
                                <span>Slash Atk:</span><span className="font-semibold text-right">{equipment.slashAttack}</span>
                                <span>Crush Atk:</span><span className="font-semibold text-right">{equipment.crushAttack}</span>
                                <span>Ranged Atk:</span><span className="font-semibold text-right">{equipment.rangedAttack}</span>
                                <span>Magic Atk:</span><span className="font-semibold text-right">{equipment.magicAttack}</span>
                                
                                <span>Stab Def:</span><span className="font-semibold text-right">{equipment.stabDefence}</span>
                                <span>Slash Def:</span><span className="font-semibold text-right">{equipment.slashDefence}</span>
                                <span>Crush Def:</span><span className="font-semibold text-right">{equipment.crushDefence}</span>
                                <span>Ranged Def:</span><span className="font-semibold text-right">{equipment.rangedDefence}</span>
                                <span>Magic Def:</span><span className="font-semibold text-right">{equipment.magicDefence}</span>

                                <span>Strength:</span><span className="font-semibold text-right">{equipment.strengthBonus}</span>
                                <span>Ranged Str:</span><span className="font-semibold text-right">{equipment.rangedStrength}</span>
                            </div>
                        )}
                         {item.equipment?.requiredLevels && (
                            <div className="mt-2 pt-2 border-t border-gray-600 text-xs space-y-0.5">
                                <p className="font-semibold">Requirements:</p>
                                {item.equipment.requiredLevels.map(req => (
                                    <p key={req.skill} className="text-gray-400">
                                        {req.level} {req.skill}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                );
                setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
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
                </>
            )}
        </div>
    );
};

export default InventorySlotDisplay;
