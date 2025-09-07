

import { useState, useCallback } from 'react';
import { InventorySlot, Equipment, CombatStance, WeaponType, PlayerSkill } from '../types';
import { ITEMS, INVENTORY_CAPACITY } from '../constants';

// Helper to ensure inventory is always a fixed-size sparse array
const padInventory = (inv: (InventorySlot | null)[]): (InventorySlot | null)[] => {
    const padded = new Array(INVENTORY_CAPACITY).fill(null);
    inv.forEach((item, index) => {
        if (item && index < INVENTORY_CAPACITY) {
            padded[index] = item;
        }
    });
    return padded;
};

export const useInventory = (initialData: { inventory: InventorySlot[], coins: number, equipment: Equipment }, addLog: (message: string) => void) => {
    const [inventory, setInventory] = useState<(InventorySlot | null)[]>(padInventory(initialData.inventory));
    const [coins, setCoins] = useState<number>(initialData.coins);
    const [equipment, setEquipment] = useState<Equipment>(initialData.equipment);

    const modifyItem = useCallback((itemId: string, quantity: number, quiet: boolean = false) => {
        if (itemId === 'coins') {
            setCoins(c => c + quantity);
            if (quantity !== 0 && !quiet) addLog(`${quantity > 0 ? 'Gained' : 'Lost'} ${Math.abs(quantity)} coins.`);
            return;
        }

        const itemData = ITEMS[itemId];
        if (!itemData) return;

        if (quantity > 0) { // ADDING
            setInventory(prevInv => {
                const newInv = [...prevInv];
                
                if (itemData.stackable) {
                    const existingStack = newInv.find(i => i?.itemId === itemId);
                    if (existingStack) {
                        existingStack.quantity += quantity;
                        if (!quiet) addLog(`Gained ${quantity}x ${itemData.name}.`);
                        return newInv;
                    } else {
                        const emptySlotIndex = newInv.findIndex(slot => slot === null);
                        if (emptySlotIndex === -1) {
                            if (!quiet) addLog(`Your inventory is full. Could not pick up ${itemData.name}.`);
                            return prevInv;
                        }
                        newInv[emptySlotIndex] = { itemId, quantity };
                        if (!quiet) addLog(`Gained ${quantity}x ${itemData.name}.`);
                        return newInv;
                    }
                } else { // NOT STACKABLE
                    let added = 0;
                    for (let i = 0; i < quantity; i++) {
                        const emptySlotIndex = newInv.findIndex(slot => slot === null);
                        if (emptySlotIndex === -1) {
                            if (!quiet) {
                                if (added > 0) addLog(`Gained ${added}x ${itemData.name}.`);
                                const remaining = quantity - added;
                                addLog(`Inventory is full. You left ${remaining}x ${itemData.name} behind.`);
                            }
                            break; // Stop adding
                        }
                        newInv[emptySlotIndex] = { itemId, quantity: 1 };
                        added++;
                    }
                    if (added > 0 && !quiet) {
                        addLog(`Gained ${added}x ${itemData.name}.`);
                    }
                    return newInv;
                }
            });
        } else { // REMOVING
            setInventory(prevInv => {
                const newInv = [...prevInv];
                let removedCount = 0;
                const amountToRemove = Math.abs(quantity);

                if (itemData.stackable) {
                    const stackIndex = newInv.findIndex(i => i?.itemId === itemId);
                    if (stackIndex > -1) {
                        const stack = newInv[stackIndex];
                        if (stack) {
                            const amountCanRemove = Math.min(amountToRemove, stack.quantity);
                            stack.quantity -= amountCanRemove;
                            removedCount = amountCanRemove;
                            if (stack.quantity <= 0) {
                                newInv[stackIndex] = null;
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < amountToRemove; i++) {
                        const itemIndex = newInv.findIndex(i => i?.itemId === itemId);
                        if (itemIndex > -1) {
                            newInv[itemIndex] = null;
                            removedCount++;
                        } else {
                            break; // No more items of this type to remove
                        }
                    }
                }

                if (removedCount > 0 && !quiet) {
                     addLog(`Lost ${removedCount}x ${itemData.name}.`);
                }
                return newInv;
            });
        }
    }, [addLog]);

    const hasItems = useCallback((requirements: { itemId: string, quantity: number }[]): boolean => {
      return requirements.every(req => {
        const totalQuantity = inventory.reduce((acc, slot) => (slot && slot.itemId === req.itemId) ? acc + slot.quantity : acc, 0);
        return totalQuantity >= req.quantity;
      });
    }, [inventory]);

    const handleEquip = useCallback((itemToEquip: InventorySlot, inventoryIndex: number, skills: PlayerSkill[], combatStance: CombatStance, setCombatStance: (stance: CombatStance) => void) => {
        const itemData = ITEMS[itemToEquip.itemId];
        if (!itemData?.equipment) return;

        if (itemData.equipment.requiredLevels) {
            for (const requirement of itemData.equipment.requiredLevels) {
                const playerSkill = skills.find(s => s.name === requirement.skill);
                if (!playerSkill || playerSkill.level < requirement.level) {
                    addLog(`You need a ${requirement.skill} level of ${requirement.level} to wield this.`);
                    return;
                }
            }
        }

        const slotKey = itemData.equipment.slot.toLowerCase() as keyof Equipment;
        const currentlyEquipped = equipment[slotKey];
        if (slotKey === 'weapon') {
            const newWeaponType = itemData.equipment.weaponType;
            const isRanged = newWeaponType === WeaponType.Bow;
            const currentIsRanged = [CombatStance.RangedAccurate, CombatStance.RangedRapid, CombatStance.RangedDefence].includes(combatStance);
            if (isRanged && !currentIsRanged) setCombatStance(CombatStance.RangedAccurate);
            else if (!isRanged && currentIsRanged) setCombatStance(CombatStance.Accurate);
        }

        setEquipment(prev => ({ ...prev, [slotKey]: { itemId: itemToEquip.itemId, quantity: 1 } }));

        setInventory(prevInv => {
            const newInventory = [...prevInv];
            const sourceSlot = newInventory[inventoryIndex];
            if (sourceSlot) {
                if (itemData.stackable && sourceSlot.quantity > 1) {
                    sourceSlot.quantity -= 1;
                } else {
                    newInventory[inventoryIndex] = null;
                }
            }

            if (currentlyEquipped) {
                 const equippedItemData = ITEMS[currentlyEquipped.itemId];
                 const existingStackIndex = newInventory.findIndex(i => i?.itemId === currentlyEquipped.itemId && equippedItemData.stackable);
                if (existingStackIndex > -1) {
                    newInventory[existingStackIndex]!.quantity += currentlyEquipped.quantity;
                } else {
                    const emptySlotIndex = newInventory.findIndex(slot => slot === null);
                    if (emptySlotIndex > -1) {
                        newInventory[emptySlotIndex] = currentlyEquipped;
                    }
                }
            }
            return newInventory;
        });
        addLog(`Equipped ${itemData.name}.`);
    }, [equipment, addLog]);

    const handleUnequip = useCallback((slotKey: keyof Equipment, setCombatStance: (stance: CombatStance) => void) => {
        const itemToUnequip = equipment[slotKey];
        if (!itemToUnequip) return;

        const itemData = ITEMS[itemToUnequip.itemId];
        const needsNewSlot = !itemData.stackable || !inventory.some(i => i?.itemId === itemToUnequip.itemId);

        if (needsNewSlot && inventory.every(slot => slot !== null)) {
            addLog("Your inventory is full. Cannot unequip.");
            return;
        }

        if (slotKey === 'weapon') {
            if (itemData?.equipment?.weaponType === WeaponType.Bow) setCombatStance(CombatStance.Accurate);
        }
        modifyItem(itemToUnequip.itemId, itemToUnequip.quantity, true); // Use quiet add
        setEquipment(prev => ({ ...prev, [slotKey]: null }));
        addLog(`Unequipped ${ITEMS[itemToUnequip.itemId].name}.`);
    }, [equipment, modifyItem, addLog, inventory]);
    
    const handleDropItem = useCallback((inventoryIndex: number) => {
        setInventory(prevInv => {
            const newInv = [...prevInv];
            const itemSlot = newInv[inventoryIndex];
            if (!itemSlot) return newInv;
            const itemData = ITEMS[itemSlot.itemId];
            addLog(`You drop the ${itemData.name}.`);
            if (itemData.stackable && itemSlot.quantity > 1) {
                newInv[inventoryIndex] = { ...itemSlot, quantity: itemSlot.quantity - 1 };
            } else {
                newInv[inventoryIndex] = null;
            }
            return newInv;
        });
    }, [addLog]);
    
    const handleSell = useCallback((itemId: string, quantity: number | 'all') => {
        const itemData = ITEMS[itemId];
        if (!itemData) return;

        const sellPrice = Math.floor(itemData.value * 0.2);
        let quantityToSell = 0;
        let currentQuantity = 0;

        if (itemData.stackable) {
            const itemSlot = inventory.find(s => s?.itemId === itemId);
            currentQuantity = itemSlot ? itemSlot.quantity : 0;
            quantityToSell = quantity === 'all' ? currentQuantity : Math.min(quantity, currentQuantity);
        } else {
            currentQuantity = inventory.filter(s => s?.itemId === itemId).length;
            quantityToSell = quantity === 'all' ? currentQuantity : Math.min(quantity, currentQuantity);
        }

        if (quantityToSell > 0) {
            const totalGain = sellPrice * quantityToSell;
            modifyItem('coins', totalGain, true);
            modifyItem(itemId, -quantityToSell, true);
            addLog(`You sold ${quantityToSell}x ${itemData.name} for ${totalGain} coins.`);
        } else {
            addLog("You don't have any of those to sell.");
        }
    }, [inventory, modifyItem, addLog]);


    const handleConsumeAmmo = useCallback(() => {
        setEquipment(prev => {
            if (!prev.ammo) return prev;
            const newAmmo = { ...prev.ammo, quantity: prev.ammo.quantity - 1 };
            if (newAmmo.quantity <= 0) {
                addLog(`You have run out of ${ITEMS[newAmmo.itemId].name}!`);
                return { ...prev, ammo: null };
            }
            return { ...prev, ammo: newAmmo };
        });
    }, [addLog]);

    const moveItem = useCallback((fromIndex: number, toIndex: number) => {
        setInventory(prevInv => {
            const newInv = [...prevInv];
            const itemFrom = newInv[fromIndex];
            const itemTo = newInv[toIndex];
            newInv[fromIndex] = itemTo;
            newInv[toIndex] = itemFrom;
            return newInv;
        });
    }, []);

    return {
        inventory, setInventory, coins, setCoins, equipment, setEquipment,
        modifyItem, hasItems, handleEquip, handleUnequip, handleDropItem, handleSell, handleConsumeAmmo, moveItem
    };
};
