import { useState, useCallback } from 'react';
import { InventorySlot, Equipment, CombatStance } from '../types';
import { ITEMS, BANK_CAPACITY, INVENTORY_CAPACITY } from '../constants';

interface BankDependencies {
    addLog: (message: string) => void;
    inventory: (InventorySlot | null)[];
    setInventory: React.Dispatch<React.SetStateAction<(InventorySlot | null)[]>>;
    equipment: Equipment;
    setEquipment: React.Dispatch<React.SetStateAction<Equipment>>;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, doses?: number, options?: { noted?: boolean, bypassAutoBank?: boolean }) => void;
    setCombatStance: (stance: CombatStance) => void;
}

export const padBank = (bank: (InventorySlot | null)[]): (InventorySlot | null)[] => {
    const padded = new Array(BANK_CAPACITY).fill(null);
    (bank || []).forEach((item, index) => {
        if (item && index < BANK_CAPACITY) {
            padded[index] = item;
        }
    });
    return padded;
};

interface BankState {
    bank: (InventorySlot | null)[];
    setBank: React.Dispatch<React.SetStateAction<(InventorySlot | null)[]>>;
}

export const useBank = (bankState: BankState, deps: BankDependencies) => {
    const { addLog, inventory, setInventory, equipment, setEquipment, modifyItem, setCombatStance } = deps;
    const { bank, setBank } = bankState;

    const handleDeposit = useCallback((inventoryIndex: number, quantity: number | 'all') => {
        const itemSlot = inventory[inventoryIndex];
        if (!itemSlot) return;
        const itemData = ITEMS[itemSlot.itemId];
        if (!itemData) return;
    
        let qtyToDeposit: number;
        let totalAvailable: number;

        if (itemSlot.noted) {
            totalAvailable = itemSlot.quantity;
            qtyToDeposit = quantity === 'all' ? totalAvailable : Math.min(quantity, totalAvailable);
        } else if (itemData.stackable) {
            totalAvailable = itemSlot.quantity;
            qtyToDeposit = quantity === 'all' ? totalAvailable : Math.min(quantity, totalAvailable);
        } else {
            // Unstackable items: count all instances
            totalAvailable = inventory.reduce((count, s) => {
                if (s && s.itemId === itemSlot.itemId && (!itemData.doseable || s.doses === itemSlot.doses) && !s.noted) {
                    return count + s.quantity;
                }
                return count;
            }, 0);
            qtyToDeposit = quantity === 'all' ? totalAvailable : Math.min(quantity, totalAvailable);
        }
    
        if (qtyToDeposit <= 0) return;

        // For depositing, we always un-note the item.
        const effectiveItemId = itemSlot.itemId;
        const effectiveDoses = itemSlot.doses;
    
        const existingSlotIndex = bank.findIndex(s => 
            s?.itemId === effectiveItemId && 
            (!itemData.doseable || s?.doses === effectiveDoses)
        );
    
        const needsNewSlot = existingSlotIndex === -1;
        const hasEmptySlot = bank.some(s => s === null);
    
        if (needsNewSlot && !hasEmptySlot) {
            addLog("Your bank does not have enough space.");
            return;
        }
    
        // Update inventory
        setInventory(prevInv => {
            const newInv = [...prevInv];
            if (itemSlot.noted || itemData.stackable) {
                const slot = newInv[inventoryIndex];
                if (slot) {
                    slot.quantity -= qtyToDeposit;
                    if (slot.quantity <= 0) {
                        newInv[inventoryIndex] = null;
                    }
                }
            } else {
                // Unstackable items: remove qtyToDeposit items one by one
                let removedCount = 0;
                for (let i = 0; i < newInv.length; i++) {
                    if (removedCount >= qtyToDeposit) break;
                    const s = newInv[i];
                    if (s && s.itemId === itemSlot.itemId && (!itemData.doseable || s.doses === itemSlot.doses) && !s.noted) {
                        newInv[i] = null;
                        removedCount++;
                    }
                }
            }
            return newInv;
        });
    
        // Update bank
        setBank(prevBank => {
            const newBank = [...prevBank];
            if (existingSlotIndex > -1) {
                newBank[existingSlotIndex]!.quantity += qtyToDeposit;
            } else {
                const emptySlotIndex = newBank.findIndex(s => s === null);
                if (emptySlotIndex > -1) {
                    newBank[emptySlotIndex] = { itemId: effectiveItemId, quantity: qtyToDeposit, doses: effectiveDoses }; // 'noted' is implicitly false
                }
            }
            return newBank;
        });
    }, [inventory, setInventory, bank, addLog, setBank]);
    
    const handleWithdraw = useCallback((bankIndex: number, quantity: number | 'all' | 'all-but-1', asNote: boolean) => {
        const bankSlot = bank[bankIndex];
        if (!bankSlot) return;
        const itemId = bankSlot.itemId;
        const itemData = ITEMS[itemId];
    
        let requestedQty: number;
        if (quantity === 'all') requestedQty = bankSlot.quantity;
        else if (quantity === 'all-but-1') requestedQty = Math.max(0, bankSlot.quantity - 1);
        else requestedQty = Math.min(quantity, bankSlot.quantity);
        if (requestedQty <= 0) return;
    
        const emptyInvSlots = inventory.filter(s => s === null).length;
        let actualQtyToWithdraw = requestedQty;

        const withdrawNoted = asNote && !itemData.stackable;
    
        if (withdrawNoted) {
            const hasNotedStack = inventory.some(s => s?.itemId === itemId && s.noted);
            if (!hasNotedStack && emptyInvSlots < 1) {
                 addLog("You don't have enough inventory space for the note.");
                return;
            }
        } else if (itemData.stackable) {
            const hasStack = inventory.some(s => s?.itemId === itemId && (!itemData.doseable || s.doses === bankSlot.doses));
            if (!hasStack && emptyInvSlots < 1) {
                addLog("You don't have enough inventory space.");
                return;
            }
        } else { // Not stackable, not noted
            actualQtyToWithdraw = Math.min(requestedQty, emptyInvSlots);
        }
    
        if (actualQtyToWithdraw <= 0) {
            addLog("You don't have enough inventory space.");
            return;
        }
    
        if (actualQtyToWithdraw < requestedQty) {
            addLog("You don't have enough inventory space to withdraw the full amount.");
        }
    
        modifyItem(itemId, actualQtyToWithdraw, true, bankSlot.doses, { noted: withdrawNoted, bypassAutoBank: true });
    
        setBank(prevBank => {
            const newBank = [...prevBank];
            const slot = newBank[bankIndex];
            if (slot) {
                slot.quantity -= actualQtyToWithdraw;
                if (slot.quantity <= 0) {
                    newBank[bankIndex] = null;
                }
            }
            return newBank;
        });
    }, [bank, inventory, modifyItem, addLog, setBank]);

    const handleDepositBackpack = useCallback(() => {
        const itemsToProcess = inventory.map((slot, index) => ({ slot, index })).filter((item): item is { slot: InventorySlot; index: number; } => item.slot !== null);
        if (itemsToProcess.length === 0) {
            addLog("Your inventory is empty.");
            return;
        }
    
        let finalBank = [...bank];
        const depositedInventoryIndexes = new Set<number>();
    
        const consolidated = itemsToProcess.reduce<Record<string, { total: number; indexes: number[]; slotData: InventorySlot }>>((acc, { slot, index }) => {
            const itemData = ITEMS[slot.itemId];
            // Un-note items for consolidation key
            const key = `${slot.itemId}:${itemData.doseable ? slot.doses : 'default'}`;
            if (!acc[key]) {
                acc[key] = { total: 0, indexes: [], slotData: { ...slot, noted: false } }; // Store un-noted version
            }
            acc[key].total += slot.quantity;
            acc[key].indexes.push(index);
            return acc;
        }, {});
    
        for (const key in consolidated) {
            const { total, indexes, slotData } = consolidated[key];
            const itemData = ITEMS[slotData.itemId];
            const existingBankIndex = finalBank.findIndex(s => 
                s?.itemId === slotData.itemId &&
                (!itemData.doseable || s?.doses === slotData.doses)
            );
            if (existingBankIndex > -1) {
                finalBank[existingBankIndex]!.quantity += total;
                indexes.forEach(i => depositedInventoryIndexes.add(i));
            } else {
                const emptySlotIndex = finalBank.findIndex(s => s === null);
                if (emptySlotIndex > -1) {
                    finalBank[emptySlotIndex] = { itemId: slotData.itemId, quantity: total, doses: slotData.doses };
                    indexes.forEach(i => depositedInventoryIndexes.add(i));
                }
            }
        }
    
        if (depositedInventoryIndexes.size === 0) {
            addLog("Your bank did not have space for any of your items.");
            return;
        }
    
        const newInventory = inventory.map((slot, index) => depositedInventoryIndexes.has(index) ? null : slot);
    
        setBank(finalBank);
        setInventory(newInventory);
        addLog("Deposited items into your bank.");
    }, [inventory, setInventory, bank, addLog, setBank]);

    const handleDepositEquipment = useCallback(() => {
        const itemsToProcess = (Object.keys(equipment) as Array<keyof Equipment>)
            .map(slotKey => ({ slot: equipment[slotKey], slotKey }))
            .filter((item): item is { slot: InventorySlot; slotKey: keyof Equipment; } => item.slot !== null);
            
        if (itemsToProcess.length === 0) {
            addLog("You have no equipment to deposit.");
            return;
        }

        let finalBank = [...bank];
        const depositedEquipmentKeys = new Set<keyof Equipment>();
        let weaponUnequipped = false;

        // Pass 1: Merge with existing stacks
        itemsToProcess.forEach(({ slot, slotKey }) => {
            const itemData = ITEMS[slot.itemId];
            const existingStackIndex = finalBank.findIndex(s => 
                s?.itemId === slot.itemId &&
                (!itemData.doseable || s.doses === slot.doses)
            );
            if (existingStackIndex > -1) {
                finalBank[existingStackIndex]!.quantity += slot.quantity;
                depositedEquipmentKeys.add(slotKey);
            }
        });

        // Pass 2: Handle remaining items
        itemsToProcess.forEach(({ slot, slotKey }) => {
            if (!depositedEquipmentKeys.has(slotKey)) {
                const emptySlotIndex = finalBank.findIndex(s => s === null);
                if (emptySlotIndex > -1) {
                    finalBank[emptySlotIndex] = { ...slot };
                    depositedEquipmentKeys.add(slotKey);
                } else {
                    addLog(`Could not deposit ${ITEMS[slot.itemId].name}, bank is full.`);
                }
            }
        });

        if (depositedEquipmentKeys.size === 0) {
            addLog("Your bank is full. No equipment was deposited.");
            return;
        }

        const newEquipment = { ...equipment };
        depositedEquipmentKeys.forEach(slotKey => {
            if (slotKey === 'weapon') weaponUnequipped = true;
            (newEquipment as any)[slotKey] = null;
        });

        setBank(finalBank);
        setEquipment(newEquipment);
        if (weaponUnequipped) {
            setCombatStance(CombatStance.Accurate);
        }
        addLog("Deposited your equipment into the bank.");
    }, [equipment, setEquipment, bank, addLog, setCombatStance, setBank]);

    const moveBankItem = useCallback((fromIndex: number, toIndex: number) => {
        setBank(prevBank => {
            const newBank = [...prevBank];
            const itemFrom = newBank[fromIndex];
            const itemTo = newBank[toIndex];
            newBank[fromIndex] = itemTo;
            newBank[toIndex] = itemFrom;
            return newBank;
        });
    }, [setBank]);

    return {
        handleDeposit,
        handleWithdraw,
        handleDepositBackpack,
        handleDepositEquipment,
        moveBankItem,
    };
};