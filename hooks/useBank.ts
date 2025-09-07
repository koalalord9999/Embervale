

import { useState, useCallback } from 'react';
import { InventorySlot, Equipment, CombatStance } from '../types';
import { ITEMS, BANK_CAPACITY, INVENTORY_CAPACITY } from '../constants';

interface BankDependencies {
    addLog: (message: string) => void;
    inventory: (InventorySlot | null)[];
    setInventory: React.Dispatch<React.SetStateAction<(InventorySlot | null)[]>>;
    equipment: Equipment;
    setEquipment: React.Dispatch<React.SetStateAction<Equipment>>;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean) => void;
    setCombatStance: (stance: CombatStance) => void;
}

const padBank = (bank: (InventorySlot | null)[]): (InventorySlot | null)[] => {
    const padded = new Array(BANK_CAPACITY).fill(null);
    (bank || []).forEach((item, index) => {
        if (item && index < BANK_CAPACITY) {
            padded[index] = item;
        }
    });
    return padded;
};


export const useBank = (initialBank: (InventorySlot | null)[], deps: BankDependencies) => {
    const { addLog, inventory, setInventory, equipment, setEquipment, modifyItem, setCombatStance } = deps;
    const [bank, setBank] = useState<(InventorySlot | null)[]>(padBank(initialBank));

    const handleDeposit = useCallback((inventoryIndex: number, quantity: number | 'all') => {
        const itemSlot = inventory[inventoryIndex];
        if (!itemSlot) return;
        const itemData = ITEMS[itemSlot.itemId];
        if (!itemData) return;

        const isAllUnstackable = quantity === 'all' && !itemData.stackable;
        
        const toDeposit: { index: number, quantity: number }[] = [];
        let totalQtyToDeposit = 0;

        if (isAllUnstackable) {
            inventory.forEach((slot, index) => {
                if (slot?.itemId === itemSlot.itemId) {
                    toDeposit.push({ index, quantity: 1 });
                }
            });
            totalQtyToDeposit = toDeposit.length;
        } else {
            totalQtyToDeposit = quantity === 'all' ? itemSlot.quantity : Math.min(quantity, itemSlot.quantity);
            if (totalQtyToDeposit > 0) {
                toDeposit.push({ index: inventoryIndex, quantity: totalQtyToDeposit });
            }
        }

        if (totalQtyToDeposit <= 0) return;

        const needsNewSlot = !bank.some(s => s?.itemId === itemSlot.itemId);
        const emptySlots = bank.filter(s => s === null).length;
        
        if (needsNewSlot && emptySlots < 1) {
            addLog("Your bank does not have enough space.");
            return;
        }

        setInventory(prevInv => {
            const newInv = [...prevInv];
            toDeposit.forEach(dep => {
                const slot = newInv[dep.index];
                if (slot) {
                    slot.quantity -= dep.quantity;
                    if (slot.quantity <= 0) {
                        newInv[dep.index] = null;
                    }
                }
            });
            return newInv;
        });
    
        setBank(prevBank => {
            const newBank = [...prevBank];
            const existingSlotIndex = newBank.findIndex(s => s?.itemId === itemSlot.itemId);
            
            if (existingSlotIndex > -1) {
                newBank[existingSlotIndex]!.quantity += totalQtyToDeposit;
            } else {
                const emptySlotIndex = newBank.findIndex(s => s === null);
                if (emptySlotIndex > -1) {
                    newBank[emptySlotIndex] = { itemId: itemSlot.itemId, quantity: totalQtyToDeposit };
                }
            }
            return newBank;
        });
    }, [inventory, setInventory, bank, addLog]);
    
    const handleWithdraw = useCallback((bankIndex: number, quantity: number | 'all' | 'all-but-1') => {
        const bankSlot = bank[bankIndex];
        if (!bankSlot) return;
        const itemId = bankSlot.itemId;
        const itemData = ITEMS[itemId];
    
        let qtyToWithdraw: number;
        if (quantity === 'all') qtyToWithdraw = bankSlot.quantity;
        else if (quantity === 'all-but-1') qtyToWithdraw = Math.max(0, bankSlot.quantity - 1);
        else qtyToWithdraw = Math.min(quantity, bankSlot.quantity);
        if (qtyToWithdraw <= 0) return;
    
        const emptyInvSlots = inventory.filter(s => s === null).length;
        const isStackableInInv = inventory.some(s => s?.itemId === itemId);
        const slotsNeeded = itemData.stackable ? (isStackableInInv ? 0 : 1) : qtyToWithdraw;
        
        if (emptyInvSlots < slotsNeeded) {
            addLog("You don't have enough inventory space.");
            return;
        }
    
        modifyItem(itemId, qtyToWithdraw, true);
    
        setBank(prevBank => {
            const newBank = [...prevBank];
            const slot = newBank[bankIndex];
            if (slot) {
                slot.quantity -= qtyToWithdraw;
                if (slot.quantity <= 0) {
                    newBank[bankIndex] = null;
                }
            }
            return newBank;
        });
    }, [bank, inventory, modifyItem, addLog]);

    const handleDepositBackpack = useCallback(() => {
        const itemsToProcess = inventory.map((slot, index) => ({ slot, index })).filter((item): item is { slot: InventorySlot; index: number; } => item.slot !== null);
        if (itemsToProcess.length === 0) {
            addLog("Your inventory is empty.");
            return;
        }
    
        let finalBank = [...bank];
        const depositedInventoryIndexes = new Set<number>();
    
        const consolidated = itemsToProcess.reduce<Record<string, { total: number; indexes: number[] }>>((acc, { slot, index }) => {
            if (!acc[slot.itemId]) acc[slot.itemId] = { total: 0, indexes: [] };
            acc[slot.itemId].total += slot.quantity;
            acc[slot.itemId].indexes.push(index);
            return acc;
        }, {});
    
        for (const itemId in consolidated) {
            const { total, indexes } = consolidated[itemId];
            const existingBankIndex = finalBank.findIndex(s => s?.itemId === itemId);
            if (existingBankIndex > -1) {
                finalBank[existingBankIndex]!.quantity += total;
                indexes.forEach(i => depositedInventoryIndexes.add(i));
            } else {
                const emptySlotIndex = finalBank.findIndex(s => s === null);
                if (emptySlotIndex > -1) {
                    finalBank[emptySlotIndex] = { itemId, quantity: total };
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
    }, [inventory, setInventory, bank, addLog]);

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
            const existingStackIndex = finalBank.findIndex(s => s?.itemId === slot.itemId);
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
    }, [equipment, setEquipment, bank, addLog, setCombatStance]);

    const moveBankItem = useCallback((fromIndex: number, toIndex: number) => {
        setBank(prevBank => {
            const newBank = [...prevBank];
            const itemFrom = newBank[fromIndex];
            const itemTo = newBank[toIndex];
            newBank[fromIndex] = itemTo;
            newBank[toIndex] = itemFrom;
            return newBank;
        });
    }, []);

    return {
        bank,
        setBank,
        handleDeposit,
        handleWithdraw,
        handleDepositBackpack,
        handleDepositEquipment,
        moveBankItem,
    };
};