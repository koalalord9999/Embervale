
import React, { useState } from 'react';
import { InventorySlot, PlayerSkill } from '../../types';
import { ITEMS, INVENTORY_CAPACITY, getIconClassName } from '../../constants';
import { ContextMenuOption } from '../common/ContextMenu';
import { ConfirmationPrompt } from '../../hooks/useUIState';

interface InventoryPanelProps {
    inventory: (InventorySlot | null)[];
    coins: number;
    skills: PlayerSkill[];
    onEquip: (itemSlot: InventorySlot, index: number) => void;
    onConsume: (itemId: string, index: number) => void;
    onDrop: (index: number) => void;
    onBury: (itemId: string, index: number) => void;
    onEmpty: (itemId: string, index: number) => void;
    setTooltip: (tooltip: { content: React.ReactNode; position: { x: number; y: number; } } | null) => void;
    setContextMenu: (menu: { options: ContextMenuOption[]; position: { x: number; y: number; } } | null) => void;
    addLog: (message: string) => void;
    isBankOpen?: boolean;
    onDeposit?: (inventoryIndex: number, quantity: number | 'all') => void;
    itemToUse: { item: InventorySlot, index: number } | null;
    setItemToUse: (item: { item: InventorySlot, index: number } | null) => void;
    onUseItemOn: (used: { item: InventorySlot, index: number }, target: { item: InventorySlot, index: number }) => void;
    onMoveItem: (from: number, to: number) => void;
    isBusy?: boolean;
    setConfirmationPrompt: (prompt: ConfirmationPrompt | null) => void;
}

const InventoryPanel: React.FC<InventoryPanelProps> = (props) => {
    const { inventory, coins, skills, onEquip, onConsume, onDrop, onBury, onEmpty, setTooltip, setContextMenu, addLog, isBankOpen = false, onDeposit = () => {}, itemToUse, setItemToUse, onUseItemOn, onMoveItem, isBusy = false, setConfirmationPrompt } = props;
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const performAction = (action: () => void) => {
        action();
        setTooltip(null);
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        if (isBusy || itemToUse) {
            e.preventDefault();
            return;
        }
        setTooltip(null); // Explicitly hide tooltip on drag start
        e.dataTransfer.setData('application/x-inventory-slot-index', index.toString());
        e.dataTransfer.effectAllowed = 'move';
        // Timeout helps the browser capture the ghost image before we change the source item's opacity
        setTimeout(() => {
          setDraggingIndex(index);
        }, 0);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggingIndex !== null) {
          setDragOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault();
        setTooltip(null); // Ensure tooltip is hidden on drop
        const fromIndexStr = e.dataTransfer.getData('application/x-inventory-slot-index');
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
        setTooltip(null); // Final cleanup for tooltip
    };
    
    const handleSlotClick = (e: React.MouseEvent, index: number) => {
        const slot = inventory[index];
        if (!slot) return;
        const item = ITEMS[slot.itemId];
        if (!item) return;
        
        if (e.shiftKey) {
            if (isBusy) {
                addLog("You are busy and cannot do that right now.");
                return;
            }
            if (isBankOpen) {
                addLog("You cannot drop items while the bank is open.");
                return;
            }
            
            if (item.value > 1000) {
                setConfirmationPrompt({
                    message: `Are you sure you want to drop your ${item.name}?`,
                    onConfirm: () => onDrop(index)
                });
            } else {
                onDrop(index);
            }
            return;
        }

        // Default click action
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

        if (isBankOpen) {
            performAction(() => onDeposit(index, 'all'));
            return;
        }

        const isEquippable = !!item.equipment;
        const isBuryable = !!item.buryable;
        const isConsumable = !!item.consumable;

        if (isEquippable) performAction(() => onEquip(slot, index));
        else if (isBuryable) performAction(() => onBury(item.id, index));
        else if (item.cleanable) performAction(() => onConsume(item.id, index));
        else if (isConsumable) performAction(() => onConsume(item.id, index));
        else setItemToUse({ item: slot, index: index });
    };

    const handleContextMenu = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        const slot = inventory[index];
        if (!slot) return;
        const item = ITEMS[slot.itemId];
        if (!item) return;

        const options: ContextMenuOption[] = [];
        
        if (isBankOpen) {
            options.push({ label: 'Deposit 1', onClick: () => performAction(() => onDeposit(index, 1)), disabled: slot.quantity < 1 });
            if (slot.quantity > 1) {
                options.push({ label: 'Deposit 5', onClick: () => performAction(() => onDeposit(index, 5)), disabled: slot.quantity < 5 });
                options.push({ label: 'Deposit 10', onClick: () => performAction(() => onDeposit(index, 10)), disabled: slot.quantity < 10 });
            }
            options.push({ label: 'Deposit All', onClick: () => performAction(() => onDeposit(index, 'all')) });
        } else {
            if (item.equipment) options.push({ label: 'Equip', onClick: () => performAction(() => onEquip(slot, index)), disabled: isBusy });
            if (item.buryable) options.push({ label: 'Bury', onClick: () => performAction(() => onBury(item.id, index)), disabled: isBusy });
            if (item.cleanable) options.push({ label: 'Clean', onClick: () => performAction(() => onConsume(item.id, index)), disabled: isBusy });
            if (item.consumable) {
                let actionText = 'Consume';
                if (item.consumable.givesCoins) actionText = 'Open';
                else if (item.emptyable) actionText = 'Drink';
                else if (item.consumable.healAmount) actionText = 'Eat';
                options.push({ label: actionText, onClick: () => performAction(() => onConsume(item.id, index)), disabled: isBusy });
            }

            options.push({ label: 'Use', onClick: () => { setItemToUse({ item: slot, index }); }, disabled: isBusy });
            
            if (item.emptyable) options.push({ label: 'Empty', onClick: () => performAction(() => onEmpty(item.id, index)), disabled: isBusy });
            options.push({ label: 'Drop', onClick: () => performAction(() => onDrop(index)), disabled: isBusy });
        }

        options.push({ label: 'Examine', onClick: () => addLog(`[Examine: ${item.name}] ${item.description}`) });
        setContextMenu({ options, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <div className={`flex flex-col h-full text-gray-300 ${itemToUse ? 'cursor-crosshair' : ''}`}>
            <h3 className="text-lg font-bold text-center mb-2 text-yellow-400">Inventory</h3>
            <div className="grid grid-cols-5 gap-2 flex-grow">
                {inventory.map((slot, index) => {
                    const item = slot ? ITEMS[slot.itemId] : null;
                    
                    let slotClasses = 'hover:border-yellow-400';
                    if (draggingIndex === index) {
                        slotClasses = 'opacity-25'; // Item being dragged
                    } else if (dragOverIndex === index) {
                        slotClasses = 'border-green-400 scale-105 bg-green-900/50'; // Drop target
                    } else if (itemToUse) {
                        slotClasses = 'hover:border-green-400';
                        if (itemToUse.index === index) {
                            slotClasses += ' border-blue-400 animate-pulse';
                        }
                    }

                    return (
                        <div
                            key={index}
                            draggable={!!slot && !isBusy && !itemToUse}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`w-full aspect-square bg-gray-900 border-2 border-gray-600 rounded-md flex items-center justify-center p-1 relative transition-all duration-150 ${slot ? 'cursor-grab' : ''} ${slotClasses}`}
                            onClick={(e) => handleSlotClick(e, index)}
                            onContextMenu={(e) => handleContextMenu(e, index)}
                            onMouseEnter={(e) => {
                                if (!item || !slot) return;
                                const tooltipContent = (
                                    <div>
                                        <p className="font-bold text-yellow-300">{item.name}</p>
                                        <p className="text-sm text-gray-300">{item.description}</p>
                                        {item.stackable && slot.quantity > 999 && (
                                            <p className="text-sm mt-1 text-gray-400">Quantity: {slot.quantity.toLocaleString()}</p>
                                        )}
                                        {itemToUse && <p className="text-sm mt-1 text-green-300">Use {ITEMS[itemToUse.item.itemId].name} on {item.name}</p>}
                                        {item.equipment && (
                                            <div className="mt-2 pt-2 border-t border-gray-600 text-xs grid grid-cols-2 gap-x-4">
                                                <span>Stab Atk:</span><span className="font-semibold text-right">{item.equipment.stabAttack}</span>
                                                <span>Slash Atk:</span><span className="font-semibold text-right">{item.equipment.slashAttack}</span>
                                                <span>Crush Atk:</span><span className="font-semibold text-right">{item.equipment.crushAttack}</span>
                                                <span>Ranged Atk:</span><span className="font-semibold text-right">{item.equipment.rangedAttack}</span>
                                                <span>Magic Atk:</span><span className="font-semibold text-right">{item.equipment.magicAttack}</span>
                                                
                                                <span>Stab Def:</span><span className="font-semibold text-right">{item.equipment.stabDefence}</span>
                                                <span>Slash Def:</span><span className="font-semibold text-right">{item.equipment.slashDefence}</span>
                                                <span>Crush Def:</span><span className="font-semibold text-right">{item.equipment.crushDefence}</span>
                                                <span>Ranged Def:</span><span className="font-semibold text-right">{item.equipment.rangedDefence}</span>
                                                <span>Magic Def:</span><span className="font-semibold text-right">{item.equipment.magicDefence}</span>
            
                                                <span>Strength:</span><span className="font-semibold text-right">{item.equipment.strengthBonus}</span>
                                                <span>Ranged Str:</span><span className="font-semibold text-right">{item.equipment.rangedStrength}</span>
                                            </div>
                                        )}
                                         {item.consumable?.healAmount && (
                                            <div className="mt-2 pt-2 border-t border-gray-600 text-xs">
                                                <p>Heals: <span className="font-semibold">{item.consumable.healAmount} HP</span></p>
                                            </div>
                                        )}
                                        {item.buryable && (
                                            <div className="mt-2 pt-2 border-t border-gray-600 text-xs">
                                                <p>Prayer XP: <span className="font-semibold">{item.buryable.prayerXp}</span></p>
                                            </div>
                                        )}
                                        {item.equipment?.requiredLevels && (
                                            <div className="mt-2 pt-2 border-t border-gray-600 text-xs space-y-0.5">
                                                <p className="font-semibold">Requirements:</p>
                                                {item.equipment.requiredLevels.map(req => {
                                                    const playerSkill = skills.find(s => s.name === req.skill);
                                                    const hasLevel = playerSkill && playerSkill.level >= req.level;
                                                    return (
                                                        <p key={req.skill} className={hasLevel ? 'text-green-400' : 'text-red-400'}>
                                                            {req.level} {req.skill}
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                                setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
                            }}
                            onMouseLeave={() => {
                                setTooltip(null);
                            }}
                        >
                            {item && slot && (
                                <>
                                    <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
                                    {slot.quantity > 1 && (
                                        <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                                            {slot.quantity > 1000 ? `${Math.floor(slot.quantity / 1000)}k` : slot.quantity}
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
                })}
            </div>
            <div className="text-center mt-2 p-2 bg-gray-900 rounded-md border border-gray-600">
                <p>Coins: <span className="font-bold text-yellow-400">{coins.toLocaleString()}</span></p>
            </div>
        </div>
    );
};

export default InventoryPanel;
