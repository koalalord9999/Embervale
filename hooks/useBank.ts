import React, { useCallback, useMemo } from 'react';
import { InventorySlot, Equipment, CombatStance, BankTab } from '../types';
import { ITEMS, BANK_CAPACITY, INVENTORY_CAPACITY, MAX_BANK_TABS } from '../constants';

interface BankDependencies {
    addLog: (message: string) => void;
    inventory: (InventorySlot | null)[];
    setInventory: React.Dispatch<React.SetStateAction<(InventorySlot | null)[]>>;
    equipment: Equipment;
    setEquipment: React.Dispatch<React.SetStateAction<Equipment>>;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, doses?: number, options?: { noted?: boolean, bypassAutoBank?: boolean }) => void;
    setCombatStance: (stance: CombatStance) => void;
    bankPlaceholders: boolean;
}

interface BankState {
    bank: BankTab[];
    setBank: React.Dispatch<React.SetStateAction<BankTab[]>>;
}

export const useBank = (bankState: BankState, deps: BankDependencies) => {
    const { addLog, inventory, setInventory, equipment, setEquipment, modifyItem, setCombatStance, bankPlaceholders } = deps;
    const { bank, setBank } = bankState;

    const totalBankedItems = useMemo(() => bank.reduce((total, tab) => total + tab.items.filter(item => item !== null && item.quantity > 0).length, 0), [bank]);

    const handleDeposit = useCallback((inventoryIndex: number, quantity: number | 'all', activeTabId: number) => {
        const itemSlot = inventory[inventoryIndex];
        if (!itemSlot) return;
        const itemData = ITEMS[itemSlot.itemId];
        if (!itemData) return;
    
        let qtyToDeposit: number;
        if (itemSlot.noted || itemData.stackable) {
            qtyToDeposit = quantity === 'all' ? itemSlot.quantity : Math.min(quantity, itemSlot.quantity);
        } else {
            const totalAvailable = inventory.reduce((count, s) => (s && s.itemId === itemSlot.itemId && !s.noted) ? count + s.quantity : count, 0);
            qtyToDeposit = quantity === 'all' ? totalAvailable : Math.min(quantity, totalAvailable);
        }
    
        if (qtyToDeposit <= 0) return;
    
        const effectiveItemId = itemSlot.itemId;
        const effectiveDoses = itemSlot.doses;

        setBank(prevBank => {
            const newBank = JSON.parse(JSON.stringify(prevBank));
            let targetTab: BankTab | undefined;
            let existingSlotIndex = -1;

            // Search all tabs for an existing stack first
            for (const tab of newBank) {
                const slotIndex = tab.items.findIndex((s: InventorySlot | null) => s?.itemId === effectiveItemId && (!itemData.doseable || s?.doses === effectiveDoses));
                if (slotIndex > -1) {
                    targetTab = tab;
                    existingSlotIndex = slotIndex;
                    break;
                }
            }

            // If not found, fall back to the active tab for a new slot
            if (!targetTab) {
                targetTab = newBank.find((t: BankTab) => t.id === activeTabId);
                if (!targetTab) targetTab = newBank.find((t: BankTab) => t.id === 0); // Fallback to main tab
                if (!targetTab) {
                    addLog("Error: Could not find any bank tab to deposit into.");
                    return prevBank;
                }
            }
            
            const needsNewSlot = existingSlotIndex === -1;

            if (needsNewSlot && totalBankedItems >= BANK_CAPACITY) {
                addLog("Your bank does not have enough space.");
                return prevBank;
            }
            
            setInventory(prevInv => {
                const newInv = [...prevInv];
                if (itemSlot.noted || itemData.stackable) {
                    const slot = newInv[inventoryIndex];
                    if (slot) {
                        slot.quantity -= qtyToDeposit;
                        if (slot.quantity <= 0) newInv[inventoryIndex] = null;
                    }
                } else {
                    let removedCount = 0;
                    for (let i = 0; i < newInv.length && removedCount < qtyToDeposit; i++) {
                        const s = newInv[i];
                        if (s && s.itemId === itemSlot.itemId && !s.noted) {
                            newInv[i] = null;
                            removedCount++;
                        }
                    }
                }
                return newInv;
            });

            if (needsNewSlot) {
                const emptySlotIndex = targetTab.items.findIndex((s: InventorySlot | null) => s === null);
                const newItem = { itemId: effectiveItemId, quantity: qtyToDeposit, doses: effectiveDoses };
                if (emptySlotIndex > -1) {
                    targetTab.items[emptySlotIndex] = newItem;
                } else {
                    targetTab.items.push(newItem);
                }
            } else {
                const existingSlot = targetTab.items[existingSlotIndex]!;
                existingSlot.quantity = (existingSlot.quantity === 0 ? 0 : existingSlot.quantity) + qtyToDeposit;
            }
            return newBank;
        });
    }, [inventory, setInventory, totalBankedItems, addLog, setBank]);
    
    const handleWithdraw = useCallback((bankIndex: number, quantity: number | 'all' | 'all-but-1', asNote: boolean, activeTabId: number) => {
        const activeTab = bank.find(t => t.id === activeTabId);
        if (!activeTab) return;
        const bankSlot = activeTab.items[bankIndex];
        if (!bankSlot || bankSlot.quantity === 0) return;
        
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
            const tabToUpdate = newBank.find(t => t.id === activeTabId);
            if (!tabToUpdate) return prevBank;
            const slot = tabToUpdate.items[bankIndex];
            if (slot) {
                slot.quantity -= actualQtyToWithdraw;
                if (slot.quantity <= 0) {
                    if (bankPlaceholders) {
                        slot.quantity = 0;
                    } else {
                        tabToUpdate.items.splice(bankIndex, 1);
                    }
                }
            }
            return newBank;
        });
    }, [bank, inventory, modifyItem, addLog, setBank, bankPlaceholders]);

    const handleDepositBackpack = useCallback((activeTabId: number) => {
        const itemsToProcess = inventory.map((slot, index) => ({ slot, index })).filter((item): item is { slot: InventorySlot; index: number; } => item.slot !== null);
        if (itemsToProcess.length === 0) {
            addLog("Your inventory is empty.");
            return;
        }

        setBank(prevBank => {
            const newBank = JSON.parse(JSON.stringify(prevBank));
            const indicesToClear: number[] = [];
            let currentBankedItems = totalBankedItems;

            itemsToProcess.forEach(({ slot, index }) => {
                const itemData = ITEMS[slot.itemId];
                let targetTab: BankTab | undefined;
                let existingSlotIndex = -1;

                for (const tab of newBank) {
                    const slotIndex = tab.items.findIndex((s: InventorySlot | null) => s?.itemId === slot.itemId && (!itemData.doseable || s?.doses === slot.doses));
                    if (slotIndex > -1) {
                        targetTab = tab;
                        existingSlotIndex = slotIndex;
                        break;
                    }
                }

                if (!targetTab) {
                    targetTab = newBank.find((t: BankTab) => t.id === activeTabId);
                    if (!targetTab) targetTab = newBank.find((t: BankTab) => t.id === 0);
                }
                if (!targetTab) return;

                const needsNewSlot = existingSlotIndex === -1;
                let canDeposit = true;
                if (needsNewSlot && currentBankedItems >= BANK_CAPACITY) {
                    canDeposit = false;
                }

                if (canDeposit) {
                    if (needsNewSlot) {
                        const emptySlotIndex = targetTab.items.findIndex((s: InventorySlot | null) => s === null);
                        if (emptySlotIndex > -1) {
                            targetTab.items[emptySlotIndex] = { ...slot, noted: false };
                        } else {
                            targetTab.items.push({ ...slot, noted: false });
                        }
                        currentBankedItems++;
                    } else {
                        targetTab.items[existingSlotIndex].quantity += slot.quantity;
                    }
                    indicesToClear.push(index);
                }
            });
            
            if (indicesToClear.length > 0) {
                setInventory(prevInv => {
                    const newInv = [...prevInv];
                    indicesToClear.forEach(idx => newInv[idx] = null);
                    return newInv;
                });
                if (indicesToClear.length === itemsToProcess.length) {
                    addLog("Deposited all items into your bank.");
                } else {
                    addLog("Deposited available items. Bank may be full.");
                }
            } else {
                addLog("Your bank did not have space for any of your items.");
            }
            return newBank;
        });
    }, [inventory, setInventory, totalBankedItems, addLog, setBank]);

    const handleDepositEquipment = useCallback((activeTabId: number) => {
        const itemsToProcess = (Object.keys(equipment) as Array<keyof Equipment>)
            .map(slotKey => ({ slot: equipment[slotKey], slotKey }))
            .filter((item): item is { slot: InventorySlot; slotKey: keyof Equipment; } => item.slot !== null);
            
        if (itemsToProcess.length === 0) {
            addLog("You have no equipment to deposit.");
            return;
        }

        setBank(prevBank => {
            const newBank = JSON.parse(JSON.stringify(prevBank));
            const equipmentToClear: (keyof Equipment)[] = [];
            let currentBankedItems = totalBankedItems;

            itemsToProcess.forEach(({ slot, slotKey }) => {
                const itemData = ITEMS[slot.itemId];
                let targetTab: BankTab | undefined;
                let existingSlotIndex = -1;

                for (const tab of newBank) {
                    const slotIndex = tab.items.findIndex((s: InventorySlot | null) => s?.itemId === slot.itemId && (!itemData.doseable || s.doses === slot.doses));
                    if (slotIndex > -1) {
                        targetTab = tab;
                        existingSlotIndex = slotIndex;
                        break;
                    }
                }

                if (!targetTab) {
                    targetTab = newBank.find((t: BankTab) => t.id === activeTabId);
                    if (!targetTab) targetTab = newBank.find((t: BankTab) => t.id === 0);
                }
                if (!targetTab) return;

                const needsNewSlot = existingSlotIndex === -1;
                let canDeposit = true;
                if (needsNewSlot && currentBankedItems >= BANK_CAPACITY) {
                    canDeposit = false;
                }

                if (canDeposit) {
                    if (needsNewSlot) {
                        const emptySlotIndex = targetTab.items.findIndex((s: InventorySlot | null) => s === null);
                        if (emptySlotIndex > -1) {
                            targetTab.items[emptySlotIndex] = { ...slot };
                        } else {
                            targetTab.items.push({ ...slot });
                        }
                        currentBankedItems++;
                    } else {
                        targetTab.items[existingSlotIndex].quantity += slot.quantity;
                    }
                    equipmentToClear.push(slotKey);
                }
            });

            if (equipmentToClear.length > 0) {
                setEquipment(prevEq => {
                    const newEq = { ...prevEq };
                    let didUnequipWeapon = false;
                    equipmentToClear.forEach(key => {
                        if (key === 'weapon') didUnequipWeapon = true;
                        newEq[key] = null;
                    });
                    if (didUnequipWeapon) setCombatStance(CombatStance.Accurate);
                    return newEq;
                });
                 if (equipmentToClear.length === itemsToProcess.length) {
                    addLog("Deposited your equipment into the bank.");
                } else {
                    addLog("Deposited available equipment. Bank may be full.");
                }
            } else {
                 addLog("Your bank is full. No equipment was deposited.");
            }
            return newBank;
        });
    }, [equipment, setEquipment, totalBankedItems, addLog, setCombatStance, setBank]);

    const moveBankItem = useCallback((fromIndex: number, toIndex: number, activeTabId: number) => {
        setBank(prevBank => {
            const newBank = [...prevBank];
            const activeTab = newBank.find(t => t.id === activeTabId);
            if (!activeTab) return prevBank;
    
            const items = [...activeTab.items];
            const [movedItem] = items.splice(fromIndex, 1);
            if (movedItem) {
                items.splice(toIndex, 0, movedItem);
            }
    
            activeTab.items = items.filter(Boolean); // Ensure array stays dense
            return newBank;
        });
    }, [setBank]);

    const addTab = useCallback(() => {
        setBank(prevBank => {
            if (prevBank.length >= MAX_BANK_TABS) {
                addLog("You cannot create any more tabs.");
                return prevBank;
            }
            const newTabId = Date.now();
            return [...prevBank, { id: newTabId, name: `Tab ${prevBank.length + 1}`, icon: null, items: [] }];
        });
    }, [setBank, addLog]);

    const removeTab = useCallback((tabId: number) => {
        if (tabId === 0) { addLog("You cannot remove the main tab."); return; }
        setBank(prevBank => {
            const tabToRemove = prevBank.find(t => t.id === tabId);
            if (!tabToRemove) return prevBank;
            
            const newBank = prevBank.filter(t => t.id !== tabId);
            const mainTab = newBank.find(t => t.id === 0);
            if (!mainTab) return newBank;
            
            tabToRemove.items.forEach(item => {
                if (item) {
                    const existingStack = mainTab.items.find(i => i?.itemId === item.itemId && (!ITEMS[item.itemId].doseable || i.doses === item.doses));
                    if (existingStack) {
                        existingStack.quantity += item.quantity;
                    } else if (totalBankedItems < BANK_CAPACITY) {
                        const emptySlot = mainTab.items.findIndex(i => i === null);
                        if (emptySlot > -1) {
                            mainTab.items[emptySlot] = item;
                        } else {
                            mainTab.items.push(item);
                        }
                    } else {
                        addLog(`Could not move ${item.quantity}x ${ITEMS[item.itemId].name} to main tab: Bank is full.`);
                    }
                }
            });

            return newBank;
        });
    }, [setBank, addLog, totalBankedItems]);
    
    const moveItemToTab = useCallback((fromItemIndex: number, fromTabId: number, toTabId: number) => {
        setBank(prevBank => {
            const newBank = JSON.parse(JSON.stringify(prevBank));
            const fromTab = newBank.find((t: BankTab) => t.id === fromTabId);
            const toTab = newBank.find((t: BankTab) => t.id === toTabId);
            if (!fromTab || !toTab) return prevBank;

            const itemToMove = fromTab.items[fromItemIndex];
            if (!itemToMove) return prevBank;
            
            if (bankPlaceholders) {
                fromTab.items[fromItemIndex].quantity = 0;
            } else {
                fromTab.items.splice(fromItemIndex, 1);
            }

            const existingStackIndex = toTab.items.findIndex((s: InventorySlot | null) => s?.itemId === itemToMove.itemId && (!ITEMS[itemToMove.itemId].doseable || s.doses === itemToMove.doses));
            if (existingStackIndex > -1) {
                toTab.items[existingStackIndex].quantity += itemToMove.quantity;
            } else {
                const emptySlotIndex = toTab.items.findIndex((s: InventorySlot | null) => s === null);
                if (emptySlotIndex > -1) {
                    toTab.items[emptySlotIndex] = itemToMove;
                } else {
                    toTab.items.push(itemToMove);
                }
            }
            
            return newBank;
        });
    }, [setBank, bankPlaceholders]);

    const handleRenameTab = useCallback((tabId: number, newName: string) => {
        setBank(prevBank => {
            const newBank = [...prevBank];
            const tabToUpdate = newBank.find(t => t.id === tabId);
            if (tabToUpdate && newName.trim().length > 0 && newName.trim().length <= 12) {
                tabToUpdate.name = newName.trim();
            }
            return newBank;
        });
    }, [setBank]);

    return {
        handleDeposit,
        handleWithdraw,
        handleDepositBackpack,
        handleDepositEquipment,
        moveBankItem,
        addTab,
        removeTab,
        moveItemToTab,
        handleRenameTab,
    };
};