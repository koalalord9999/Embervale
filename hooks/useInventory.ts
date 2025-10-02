
import React from 'react';
import { useState, useCallback } from 'react';
import { InventorySlot, Equipment, CombatStance, WeaponType, PlayerSkill, Item } from '../types';
import { ITEMS, INVENTORY_CAPACITY, BANK_CAPACITY } from '../constants';

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

const addToBank = (
    itemId: string,
    quantity: number,
    bank: (InventorySlot | null)[],
    setBank: React.Dispatch<React.SetStateAction<(InventorySlot | null)[]>>,
    addLog: (message: string) => void,
    quiet: boolean = false
) => {
    const itemData = ITEMS[itemId];
    if (!itemData) return;

    let itemsAdded = 0;
    const newBank = [...bank]; // Create a mutable copy

    // In the bank, all items are treated as stackable.
    // Find if there's already a stack of this item.
    const existingStackIndex = newBank.findIndex(i => i?.itemId === itemId);

    if (existingStackIndex > -1) {
        // If a stack exists, add to it.
        newBank[existingStackIndex]!.quantity += quantity;
        itemsAdded = quantity;
    } else {
        // If no stack exists, find an empty slot.
        const emptySlotIndex = newBank.findIndex(slot => slot === null);
        if (emptySlotIndex > -1 && emptySlotIndex < BANK_CAPACITY) {
            newBank[emptySlotIndex] = { itemId, quantity };
            itemsAdded = quantity;
        }
    }

    setBank(newBank); // Update state with the new bank array

    if (!quiet) {
        if (itemsAdded > 0) {
            addLog(`Auto-banked: ${itemsAdded}x ${itemData.name}.`);
        }
        const itemsLost = quantity - itemsAdded;
        if (itemsLost > 0) {
            addLog(`Bank is full. Lost ${itemsLost}x ${itemData.name}.`);
        }
    }
};

const AMMO_TIER_LEVELS: Record<string, number> = { bronze: 1, iron: 2, steel: 3, mithril: 4, adamantite: 5, runic: 6 };

export const useInventory = (
    initialData: { inventory: InventorySlot[], coins: number, equipment: Equipment },
    addLog: (message: string) => void,
    options?: {
        isAutoBankOn?: boolean;
        bank?: (InventorySlot | null)[];
        setBank?: React.Dispatch<React.SetStateAction<(InventorySlot | null)[]>>;
        onItemDropped?: (item: InventorySlot, overridePoiId?: string) => void;
        setCombatStance?: (stance: CombatStance) => void;
    }
) => {
    const [inventory, setInventory] = useState<(InventorySlot | null)[]>(padInventory(initialData.inventory));
    const [coins, setCoins] = useState<number>(initialData.coins);
    const [equipment, setEquipment] = useState<Equipment>(initialData.equipment);
    const { isAutoBankOn = false, bank, setBank, onItemDropped = () => {}, setCombatStance = () => {} } = options ?? {};

    const modifyItem = useCallback((itemId: string, quantity: number, quiet: boolean = false, doses?: number, options?: { noted?: boolean, bypassAutoBank?: boolean }) => {
        if (itemId === 'coins') {
            setCoins(c => c + quantity);
            if (quantity !== 0 && !quiet) addLog(`${quantity > 0 ? 'Gained' : 'Lost'} ${Math.abs(quantity)} coins.`);
            return;
        }

        if (quantity > 0 && isAutoBankOn && !options?.bypassAutoBank && bank && setBank) {
            addToBank(itemId, quantity, bank, setBank, addLog, quiet);
            return;
        }

        const itemData = ITEMS[itemId];
        if (!itemData) {
            return;
        }

        const isNoted = options?.noted === true;

        if (quantity > 0) { // ADDING
            setInventory(prevInv => {
                const newInv = [...prevInv];
                
                if (isNoted || itemData.stackable) {
                    const existingStack = newInv.find(i => i?.itemId === itemId && !!i.noted === isNoted);
                    
                    if (existingStack) {
                        existingStack.quantity += quantity;
                    } else {
                        const emptySlotIndex = newInv.findIndex(slot => slot === null);
                        if (emptySlotIndex === -1) {
                            if (!quiet) addLog(`Your inventory is full. Could not pick up ${itemData.name}.`);
                            return prevInv;
                        }
                        newInv[emptySlotIndex] = { itemId, quantity, doses, noted: isNoted || undefined };
                    }
                    if (!quiet) addLog(`Gained ${quantity}x ${itemData.name}.`);
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
                        newInv[emptySlotIndex] = { itemId, quantity: 1, doses, noted: false };
                        added++;
                    }
                    if (added > 0 && !quiet) {
                        addLog(`Gained ${added}x ${itemData.name}.`);
                    }
                }
                return newInv;
            });
        } else { // REMOVING
            setInventory(prevInv => {
                const newInv = [...prevInv];
                let removedCount = 0;
                const amountToRemove = Math.abs(quantity);

                if (isNoted || itemData.stackable) {
                    const stackIndex = newInv.findIndex(i => i?.itemId === itemId && !!i.noted === isNoted);
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
                        const itemIndex = newInv.findIndex(i => i?.itemId === itemId && !i.noted);
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
    }, [addLog, isAutoBankOn, bank, setBank]);

    const hasItems = useCallback((requirements: { itemId: string, quantity: number, operator?: 'gte' | 'lt' | 'eq' }[]): boolean => {
      return requirements.every(req => {
        const totalQuantity = inventory.reduce((acc, slot) => (slot && slot.itemId === req.itemId && !slot.noted) ? acc + slot.quantity : acc, 0);
        
        // Handle old logic for absence check if quantity is negative
        if (req.quantity < 0) {
            return totalQuantity === 0;
        }

        const operator = req.operator ?? 'gte';
        
        switch (operator) {
            case 'gte':
                return totalQuantity >= req.quantity;
            case 'lt':
                return totalQuantity < req.quantity;
            case 'eq':
                return totalQuantity === req.quantity;
            default: // Default to original behavior
                return totalQuantity >= req.quantity;
        }
      });
    }, [inventory]);

    const handleEquip = useCallback((itemToEquip: InventorySlot, inventoryIndex: number, skills: PlayerSkill[], combatStance: CombatStance) => {
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

        // AMMO TIER CHECK when equipping AMMO
        if (slotKey === 'ammo') {
            const weaponSlot = equipment.weapon;
            if (weaponSlot) {
                const weaponData = ITEMS[weaponSlot.itemId];
                if (weaponData?.equipment?.weaponType === WeaponType.Bow && weaponData.equipment.ammoTier) {
                    const bowMaxTier = AMMO_TIER_LEVELS[weaponData.equipment.ammoTier];
                    const ammoTier = AMMO_TIER_LEVELS[itemData.material as string];
                    if (ammoTier > bowMaxTier) {
                        addLog(`Your ${weaponData.name} cannot fire such advanced ammunition.`);
                        return;
                    }
                }
            }
        }
    
        const isTwoHanded = itemData.equipment.isTwoHanded;
        const currentWeapon = equipment.weapon ? ITEMS[equipment.weapon.itemId] : null;
        const isCurrentWeaponTwoHanded = currentWeapon?.equipment?.isTwoHanded;
    
        const itemsToReturnToInventory: (InventorySlot | null)[] = [];
        const newEquipmentChanges: Partial<Equipment> = {};

        // AMMO TIER CHECK when equipping a WEAPON
        if (slotKey === 'weapon' && itemData.equipment.weaponType === WeaponType.Bow && itemData.equipment.ammoTier) {
            const equippedAmmo = equipment.ammo;
            if (equippedAmmo) {
                const ammoData = ITEMS[equippedAmmo.itemId];
                const newBowMaxTier = AMMO_TIER_LEVELS[itemData.equipment.ammoTier];
                const ammoTier = AMMO_TIER_LEVELS[ammoData.material as string];

                if (ammoTier > newBowMaxTier) {
                    itemsToReturnToInventory.push(equippedAmmo);
                    newEquipmentChanges.ammo = null;
                    addLog(`You unequip your ${ammoData.name}; it is too advanced for the ${itemData.name}.`);
                }
            }
        }
    
        // Case 1: Equipping a 2H weapon, need to unequip shield
        if (isTwoHanded && equipment.shield) {
            itemsToReturnToInventory.push(equipment.shield);
            newEquipmentChanges.shield = null;
            addLog(`You unequip your ${ITEMS[equipment.shield.itemId].name} to make room.`);
        }
    
        // Case 2: Equipping a shield, need to unequip 2H weapon
        if (slotKey === 'shield' && isCurrentWeaponTwoHanded) {
            itemsToReturnToInventory.push(equipment.weapon!);
            newEquipmentChanges.weapon = null;
            addLog(`You unequip your ${currentWeapon!.name} to make room.`);
            if (currentWeapon?.equipment?.weaponType === WeaponType.Bow) setCombatStance(CombatStance.Accurate);
        }
    
        const currentlyEquippedInSlot = equipment[slotKey];
        if (currentlyEquippedInSlot) {
            itemsToReturnToInventory.push(currentlyEquippedInSlot);
        }
    
        // Check for inventory space
        const tempInventory = [...inventory];
        tempInventory[inventoryIndex] = null; // Slot of equipping item is freed
        let freeSlots = tempInventory.filter(s => s === null).length;
        let spaceNeeded = 0;
    
        itemsToReturnToInventory.forEach(item => {
            if (!item) return;
            const data = ITEMS[item.itemId];
            if (!data.stackable || !tempInventory.some(i => i?.itemId === item.itemId)) {
                spaceNeeded++;
            }
        });
    
        if (freeSlots < spaceNeeded) {
            addLog("You don't have enough free inventory space to do that.");
            return;
        }
        
        // Handle merging stackable ammo
        if (currentlyEquippedInSlot && currentlyEquippedInSlot.itemId === itemToEquip.itemId && itemData.stackable) {
            const totalQuantity = currentlyEquippedInSlot.quantity + itemToEquip.quantity;
            setEquipment(prev => ({ ...prev, [slotKey]: { ...currentlyEquippedInSlot, quantity: totalQuantity } }));
            setInventory(prevInv => {
                const newInventory = [...prevInv];
                newInventory[inventoryIndex] = null;
                return newInventory;
            });
            addLog(`Added ${itemToEquip.quantity}x ${itemData.name} to your equipped stack.`);
            return;
        }
    
        // Stance change for weapons
        if (slotKey === 'weapon') {
            const newWeaponType = itemData.equipment.weaponType;
            const isRanged = newWeaponType === WeaponType.Bow;
            const currentIsRanged = [CombatStance.RangedAccurate, CombatStance.RangedRapid, CombatStance.RangedDefence].includes(combatStance);
            if (isRanged && !currentIsRanged) setCombatStance(CombatStance.RangedAccurate);
            else if (!isRanged && currentIsRanged) setCombatStance(CombatStance.Accurate);
        }
        
        // Perform state updates
        const quantityToEquip = itemData.stackable ? itemToEquip.quantity : 1;
        
        const newEquippedItem: InventorySlot = {
            itemId: itemToEquip.itemId,
            quantity: quantityToEquip,
            charges: itemToEquip.charges ?? itemData.charges
        };

        setEquipment(prev => ({ ...prev, ...newEquipmentChanges, [slotKey]: newEquippedItem }));
        
        setInventory(prevInv => {
            const newInv = [...prevInv];
            // Remove equipped item from inventory
            if (itemData.stackable) {
                newInv[inventoryIndex] = null;
            } else {
                newInv[inventoryIndex]!.quantity -= 1;
                if (newInv[inventoryIndex]!.quantity <= 0) {
                    newInv[inventoryIndex] = null;
                }
            }
    
            // Add unequipped items back to inventory
            itemsToReturnToInventory.forEach(itemToReturn => {
                if (!itemToReturn) return;
                const returnData = ITEMS[itemToReturn.itemId];
                if (returnData.stackable) {
                    const existingStack = newInv.find(i => i?.itemId === itemToReturn.itemId);
                    if (existingStack) {
                        existingStack.quantity += itemToReturn.quantity;
                    } else {
                        const emptySlot = newInv.findIndex(s => s === null);
                        if (emptySlot > -1) newInv[emptySlot] = itemToReturn;
                    }
                } else {
                    const emptySlot = newInv.findIndex(s => s === null);
                    if (emptySlot > -1) newInv[emptySlot] = itemToReturn;
                }
            });
            return newInv;
        });
    
        addLog(`Equipped ${itemData.name}.`);
    }, [equipment, inventory, addLog, setCombatStance]);

    const handleUnequip = useCallback((slotKey: keyof Equipment) => {
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
        modifyItem(itemToUnequip.itemId, itemToUnequip.quantity, true, itemToUnequip.doses, { bypassAutoBank: true });
        setEquipment(prev => ({ ...prev, [slotKey]: null }));
        addLog(`Unequipped ${ITEMS[itemToUnequip.itemId].name}.`);
    }, [equipment, modifyItem, addLog, inventory, setCombatStance]);
    
    const handleDropItem = useCallback((inventoryIndex: number, quantity: 'all' | number) => {
        const slot = inventory[inventoryIndex];
        if (!slot) return;
        const itemData = ITEMS[slot.itemId];
    
        let qtyToDrop: number;
        let totalInInventory: number;
    
        if (slot.noted || itemData.stackable) {
            totalInInventory = slot.quantity;
            qtyToDrop = quantity === 'all' ? totalInInventory : Math.min(Number(quantity), totalInInventory);
        } else { // Unstackable, not noted
            totalInInventory = inventory.filter(s => s?.itemId === slot.itemId && !s.noted).length;
            qtyToDrop = quantity === 'all' ? totalInInventory : Math.min(Number(quantity), totalInInventory);
        }
    
        if (qtyToDrop <= 0) return;
    
        // Remove the items from inventory, passing noted status
        modifyItem(slot.itemId, -qtyToDrop, true, slot.doses, { noted: slot.noted });
    
        // Add the items to the ground
        if (slot.noted || itemData.stackable) {
            onItemDropped({ ...slot, quantity: qtyToDrop });
        } else {
            // Drop unstackable items one by one
            for (let i = 0; i < qtyToDrop; i++) {
                onItemDropped({ ...slot, quantity: 1, noted: false });
            }
        }
        addLog(`You drop ${qtyToDrop > 1 ? `${qtyToDrop}x ` : ''}${itemData.name}.`);
    }, [inventory, modifyItem, onItemDropped, addLog]);
    
    const handleSell = useCallback((itemId: string, quantity: number | 'all', inventoryIndex?: number) => {
        const itemData = ITEMS[itemId];
        if (!itemData) return;
    
        const sourceSlot = inventoryIndex !== undefined ? inventory[inventoryIndex] : inventory.find(s => s?.itemId === itemId);
        if (!sourceSlot) {
            addLog("You don't have any of those to sell.");
            return;
        }
    
        const isNoted = sourceSlot.noted === true;
        const sellPrice = Math.floor(itemData.value * 0.2);
        let quantityToSell: number;
        let currentQuantity: number;
    
        if (isNoted || itemData.stackable) {
            currentQuantity = inventory.reduce((acc, s) => (s && s.itemId === itemId && !!s.noted === isNoted) ? acc + s.quantity : acc, 0);
            quantityToSell = quantity === 'all' ? currentQuantity : Math.min(quantity as number, currentQuantity);
        } else { // Unstackable, non-noted
            currentQuantity = inventory.filter(s => s?.itemId === itemId && !s.noted).length;
            quantityToSell = quantity === 'all' ? currentQuantity : Math.min(quantity as number, currentQuantity);
        }
    
        if (quantityToSell > 0) {
            const totalGain = sellPrice * quantityToSell;
            modifyItem('coins', totalGain, true);
            modifyItem(itemId, -quantityToSell, true, sourceSlot.doses, { noted: isNoted });
            addLog(`You sold ${quantityToSell}x ${itemData.name} for ${totalGain} coins.`);
        } else {
            addLog("You don't have any of those to sell.");
        }
    }, [inventory, modifyItem, addLog]);


    const handleConsumeAmmo = useCallback(() => {
        setEquipment(prev => {
            if (!prev.ammo) return prev;

            const consumedAmmoId = prev.ammo.itemId;
            if (Math.random() < 0.8) { // 80% chance to recover arrow
                onItemDropped({ itemId: consumedAmmoId, quantity: 1 });
            }

            const newAmmo = { ...prev.ammo, quantity: prev.ammo.quantity - 1 };
            if (newAmmo.quantity <= 0) {
                addLog(`You have run out of ${ITEMS[newAmmo.itemId].name}!`);
                return { ...prev, ammo: null };
            }
            return { ...prev, ammo: newAmmo };
        });
    }, [addLog, onItemDropped]);

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
