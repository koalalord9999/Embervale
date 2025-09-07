

import { useState, useCallback } from 'react';
import { InventorySlot, Equipment, CombatStance } from '../types';
import { ITEMS, BANK_CAPACITY, INVENTORY_CAPACITY } from '../constants';

interface BankDependencies {
    addLog: (message: string) => void;
    inventory: InventorySlot[];
    setInventory: React.Dispatch<React.SetStateAction<InventorySlot[]>>;
    equipment: Equipment;
    setEquipment: React.Dispatch<React.SetStateAction<Equipment>>;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean) => void;
    setCombatStance: (stance: CombatStance) => void;
}

export const useBank = (initialBank: InventorySlot[], deps: BankDependencies) => {
    const { addLog, inventory, setInventory, equipment, setEquipment, modifyItem, setCombatStance } = deps;
    const [bank, setBank] = useState<InventorySlot[]>(initialBank);

    const handleDeposit = useCallback((inventoryIndex: number, quantity: number | 'all') => {
        const itemSlot = inventory[inventoryIndex];
        if (!itemSlot) return;
        const itemData = ITEMS[itemSlot.itemId];

        const isAllUnstackable = quantity === 'all' && !itemData.stackable;
    
        const qtyToDeposit = isAllUnstackable
            ? inventory.filter(s => s.itemId === itemSlot.itemId).length
            : (quantity === 'all' ? itemSlot.quantity : Math.min(quantity, itemSlot.quantity));
        
        if (qtyToDeposit <= 0) return;
    
        const existingBankSlot = bank.find(s => s.itemId === itemSlot.itemId);
        if (!existingBankSlot && bank.length >= BANK_CAPACITY) {
            addLog("Your bank is full. Cannot deposit new item types.");
            return;
        }
    
        setInventory(prevInv => {
            if (isAllUnstackable) {
                return prevInv.filter(s => s.itemId !== itemSlot.itemId);
            } else {
                const newInv = [...prevInv];
                const invSlot = newInv[inventoryIndex];
                if (!invSlot) return prevInv;
                invSlot.quantity -= qtyToDeposit;
                if (invSlot.quantity <= 0) {
                    return newInv.filter((_, i) => i !== inventoryIndex);
                }
                return newInv;
            }
        });
    
        setBank(prevBank => {
            const newBank = JSON.parse(JSON.stringify(prevBank));
            const existingSlot = newBank.find((s: InventorySlot) => s.itemId === itemSlot.itemId);
            if (existingSlot) {
                existingSlot.quantity += qtyToDeposit;
            } else {
                newBank.push({ itemId: itemSlot.itemId, quantity: qtyToDeposit });
            }
            return newBank.sort((a, b) => (ITEMS[a.itemId]?.name || '').localeCompare(ITEMS[b.itemId]?.name || ''));
        });
    }, [inventory, setInventory, bank, addLog]);
    
    const handleWithdraw = useCallback((itemId: string, quantity: number | 'all' | 'all-but-1') => {
        const bankSlot = bank.find(s => s.itemId === itemId);
        if (!bankSlot) return;
    
        let qtyToWithdraw: number;
        if (quantity === 'all') {
            qtyToWithdraw = bankSlot.quantity;
        } else if (quantity === 'all-but-1') {
            qtyToWithdraw = Math.max(0, bankSlot.quantity - 1);
        } else {
            qtyToWithdraw = Math.min(quantity, bankSlot.quantity);
        }
    
        if (qtyToWithdraw <= 0) return;
    
        const itemData = ITEMS[itemId];
        const slotsNeeded = itemData.stackable ? (inventory.some(s => s.itemId === itemId) ? 0 : 1) : qtyToWithdraw;
        
        if (inventory.length + slotsNeeded > INVENTORY_CAPACITY) {
            addLog("You don't have enough inventory space.");
            return;
        }
    
        modifyItem(itemId, qtyToWithdraw, true);
    
        setBank(prevBank => {
            const newBank = JSON.parse(JSON.stringify(prevBank));
            const existingSlot = newBank.find((s: InventorySlot) => s.itemId === itemId);
            if (existingSlot) {
                existingSlot.quantity -= qtyToWithdraw;
                if (existingSlot.quantity <= 0) {
                    return newBank.filter((s: InventorySlot) => s.itemId !== itemId);
                }
            }
            return newBank;
        });
    }, [bank, inventory, modifyItem, addLog]);

    const handleDepositBackpack = useCallback(() => {
        let currentBank = JSON.parse(JSON.stringify(bank));
        let itemsToKeep: InventorySlot[] = [];
    
        for (const itemSlot of inventory) {
            const existingSlot = currentBank.find((s: InventorySlot) => s.itemId === itemSlot.itemId);
            if (existingSlot) {
                existingSlot.quantity += itemSlot.quantity;
            } else if (currentBank.length < BANK_CAPACITY) {
                currentBank.push({ ...itemSlot });
            } else {
                itemsToKeep.push(itemSlot);
            }
        }
    
        if (itemsToKeep.length === inventory.length) {
            addLog("Your bank is full. No items were deposited.");
        } else {
            addLog("Deposited items into your bank.");
            if (itemsToKeep.length > 0) {
                addLog("Some items could not be deposited as your bank is full.");
            }
            setBank(currentBank.sort((a,b) => (ITEMS[a.itemId]?.name || '').localeCompare(ITEMS[b.itemId]?.name || '')));
            setInventory(itemsToKeep);
        }
    }, [inventory, setInventory, bank, addLog]);

    const handleDepositEquipment = useCallback(() => {
        let currentBank = JSON.parse(JSON.stringify(bank));
        const newEquipment: Equipment = { weapon: null, shield: null, head: null, body: null, legs: null, ammo: null, gloves: null, boots: null, cape: null, necklace: null, ring: null };
        let didDeposit = false;
        let weaponUnequipped = false;
    
        Object.entries(equipment).forEach(([slot, itemSlot]) => {
            if (itemSlot) {
                const existingSlot = currentBank.find((s: InventorySlot) => s.itemId === itemSlot.itemId);
                if (existingSlot) {
                    existingSlot.quantity += itemSlot.quantity;
                    didDeposit = true;
                } else if (currentBank.length < BANK_CAPACITY) {
                    currentBank.push({ ...itemSlot });
                    didDeposit = true;
                } else {
                    addLog(`Could not deposit ${ITEMS[itemSlot.itemId].name}, bank is full.`);
                    (newEquipment as any)[slot] = itemSlot;
                }
                if (didDeposit && slot === 'weapon') {
                    weaponUnequipped = true;
                }
            }
        });
    
        if (didDeposit) {
            addLog("Deposited your equipment into the bank.");
            setEquipment(newEquipment);
            setBank(currentBank.sort((a,b) => (ITEMS[a.itemId]?.name || '').localeCompare(ITEMS[b.itemId]?.name || '')));
            if (weaponUnequipped) {
                 setCombatStance(CombatStance.Accurate);
            }
        } else if (Object.values(equipment).every(val => val === null)) {
            addLog("You have no equipment to deposit.");
        }
    }, [equipment, setEquipment, bank, addLog, setCombatStance]);

    return {
        bank,
        setBank,
        handleDeposit,
        handleWithdraw,
        handleDepositBackpack,
        handleDepositEquipment,
    };
};