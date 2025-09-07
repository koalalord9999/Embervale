import React from 'react';
import { InventorySlot, PlayerSkill } from '../../types';
import { ITEMS, INVENTORY_CAPACITY, getIconClassName } from '../../constants';
import { ContextMenuOption } from '../common/ContextMenu';

interface InventoryPanelProps {
    inventory: InventorySlot[];
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
    isBusy?: boolean;
}

const InventoryPanel: React.FC<InventoryPanelProps> = (props) => {
    const { inventory, coins, skills, onEquip, onConsume, onDrop, onBury, onEmpty, setTooltip, setContextMenu, addLog, isBankOpen = false, onDeposit = () => {}, itemToUse, setItemToUse, onUseItemOn, isBusy = false } = props;

    const totalSlots = INVENTORY_CAPACITY;
    const inventoryGrid: (InventorySlot | null)[] = new Array(totalSlots).fill(null);
    inventory.forEach((item, index) => {
        if (index < totalSlots) inventoryGrid[index] = item;
    });

    const performAction = (action: () => void) => {
        action();
        setTooltip(null);
    };

    return (
        <div className={`flex flex-col h-full text-gray-300 ${itemToUse ? 'cursor-crosshair' : ''}`}>
            <h3 className="text-lg font-bold text-center mb-2 text-yellow-400">Inventory</h3>
            <div className="grid grid-cols-5 gap-2 flex-grow">
                {inventoryGrid.map((slot, index) => {
                    if (!slot) {
                        return <div key={index} className="w-full aspect-square bg-gray-900 border border-gray-600 rounded-md" />;
                    }

                    const item = ITEMS[slot.itemId];
                    const isEquippable = !!item?.equipment;
                    const isConsumable = !!item?.consumable;
                    const isBuryable = !!item?.buryable;
                    
                    const originalIndex = inventory.findIndex(invItem => invItem === slot);

                    let slotClasses = 'cursor-pointer hover:border-yellow-400';
                    if (itemToUse) {
                        slotClasses = 'cursor-crosshair hover:border-green-400';
                        if (itemToUse.index === originalIndex) {
                            slotClasses += ' border-blue-400 animate-pulse';
                        }
                    }

                    return (
                        <div
                            key={index}
                            className={`w-full aspect-square bg-gray-900 border-2 border-gray-600 rounded-md flex items-center justify-center p-1 relative transition-colors ${slotClasses}`}
                            onClick={() => {
                                if (!slot || !item || originalIndex === -1) return;
                                
                                if (isBusy) {
                                    addLog("You are busy and cannot do that right now.");
                                    return;
                                }

                                if (itemToUse) {
                                    if (itemToUse.index !== originalIndex) {
                                        onUseItemOn(itemToUse, { item: slot, index: originalIndex });
                                    } else {
                                        setItemToUse(null); // Cancel use
                                    }
                                    return;
                                }

                                if (isBankOpen) {
                                    performAction(() => onDeposit(originalIndex, 'all'));
                                    return;
                                }
                                
                                // Primary action logic
                                if (isEquippable) {
                                    performAction(() => onEquip(slot, originalIndex));
                                } else if (isBuryable) {
                                    performAction(() => onBury(item.id, originalIndex));
                                } else if (item.cleanable) {
                                    performAction(() => onConsume(item.id, originalIndex));
                                } else if (isConsumable) {
                                    performAction(() => onConsume(item.id, originalIndex));
                                } else {
                                    // Default action is 'Use' for all other items
                                    setItemToUse({ item: slot, index: originalIndex });
                                }
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                if (!slot || !item || originalIndex === -1) return;
                                
                                const options: ContextMenuOption[] = [];
                                
                                if (isBankOpen) {
                                    options.push({ label: 'Deposit 1', onClick: () => performAction(() => onDeposit(originalIndex, 1)), disabled: slot.quantity < 1 });
                                    if (slot.quantity > 1) {
                                        options.push({ label: 'Deposit 5', onClick: () => performAction(() => onDeposit(originalIndex, 5)), disabled: slot.quantity < 5 });
                                        options.push({ label: 'Deposit 10', onClick: () => performAction(() => onDeposit(originalIndex, 10)), disabled: slot.quantity < 10 });
                                    }
                                    options.push({ label: 'Deposit All', onClick: () => performAction(() => onDeposit(originalIndex, 'all')) });
                                } else {
                                    if (isEquippable) {
                                        options.push({ label: 'Equip', onClick: () => performAction(() => onEquip(slot, originalIndex)), disabled: isBusy });
                                    }
                                    if (isBuryable) {
                                        options.push({ label: 'Bury', onClick: () => performAction(() => onBury(item.id, originalIndex)), disabled: isBusy });
                                    }
                                    if (item.cleanable) {
                                        options.push({ label: 'Clean', onClick: () => performAction(() => onConsume(item.id, originalIndex)), disabled: isBusy });
                                    }
                                    if (isConsumable) {
                                        let actionText = 'Consume';
                                        if (item.consumable?.givesCoins) actionText = 'Open';
                                        else if (item.emptyable) actionText = 'Drink';
                                        else if (item.consumable?.healAmount) actionText = 'Eat';
                                        options.push({ label: actionText, onClick: () => performAction(() => onConsume(item.id, originalIndex)), disabled: isBusy });
                                    }

                                    options.push({ label: 'Use', onClick: () => setItemToUse({ item: slot, index: originalIndex }), disabled: isBusy });
                                    
                                    if (item.emptyable) {
                                        options.push({ label: 'Empty', onClick: () => performAction(() => onEmpty(item.id, originalIndex)), disabled: isBusy });
                                    }
                    
                                    options.push({ label: 'Drop', onClick: () => performAction(() => onDrop(originalIndex)), disabled: isBusy });
                                }

                                options.push({ label: 'Examine', onClick: () => addLog(`[Examine: ${item.name}] ${item.description}`) });
                                
                                setContextMenu({ options, position: { x: e.clientX, y: e.clientY } });
                            }}
                            onMouseEnter={(e) => {
                                if (!item) return;
                                const tooltipContent = (
                                    <div>
                                        <p className="font-bold text-yellow-300">{item.name}</p>
                                        <p className="text-sm text-gray-300">{item.description}</p>
                                        {itemToUse && <p className="text-sm mt-1 text-green-300">Use {ITEMS[itemToUse.item.itemId].name} -> {item.name}</p>}
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
                            {item && (
                                <>
                                    <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
                                    {slot.quantity > 1 && (
                                        <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                                            {slot.quantity > 1000 ? `${Math.floor(slot.quantity / 1000)}k` : slot.quantity}
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