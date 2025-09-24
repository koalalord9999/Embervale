import React, { useState, useCallback, useEffect } from 'react';
import { InventorySlot, GroundItem, WorldState } from '../types';
import { ITEMS } from '../constants';
import { useGameSession } from './useGameSession';
import { useInventory } from './useInventory';
import { useUIState } from './useUIState';

interface GroundItemDependencies {
    session: ReturnType<typeof useGameSession>;
    invRef: React.RefObject<ReturnType<typeof useInventory>>;
    addLog: (message: string) => void;
    ui: ReturnType<typeof useUIState>;
    worldState: WorldState;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
}

export const useGroundItems = (deps: GroundItemDependencies) => {
    const { session, invRef, addLog, ui, worldState, setWorldState } = deps;
    const [groundItems, setGroundItems] = useState<Record<string, GroundItem[]>>({});

    const onItemDropped = useCallback((item: InventorySlot) => {
        const poiId = session.currentPoiId;
        const itemData = ITEMS[item.itemId];
        if (!itemData) return;
    
        setGroundItems(prev => {
            const newItemsForPoi = [...(prev[poiId] || [])];
            
            if (itemData.stackable || item.noted) {
                const existingStackIndex = newItemsForPoi.findIndex(gi => 
                    gi.item.itemId === item.itemId && 
                    !!gi.item.noted === !!item.noted
                );
                if (existingStackIndex > -1) {
                    newItemsForPoi[existingStackIndex].item.quantity += item.quantity;
                    newItemsForPoi[existingStackIndex].dropTime = Date.now();
                } else {
                    newItemsForPoi.push({ item, dropTime: Date.now(), uniqueId: Date.now() + Math.random() });
                }
            } else {
                for (let i = 0; i < item.quantity; i++) {
                    newItemsForPoi.push({ item: { ...item, quantity: 1 }, dropTime: Date.now(), uniqueId: Date.now() + Math.random() + i });
                }
            }
    
            return { ...prev, [poiId]: newItemsForPoi };
        });
    }, [session.currentPoiId]);

    const handlePickUpItem = useCallback((uniqueId: number) => {
        const inv = invRef.current;
        if (!inv) {
            console.error("invRef not set in useGroundItems");
            return;
        }
        const poiId = session.currentPoiId;
        const groundItemsForPoi = groundItems[poiId];
        if (!groundItemsForPoi) return;

        const itemToPick = groundItemsForPoi.find(gi => gi.uniqueId === uniqueId);
        if (!itemToPick) return;

        const freeSlots = inv.inventory.filter(s => s === null).length;
        const itemData = ITEMS[itemToPick.item.itemId];
        let needsNewSlot = true;
        
        if (itemData.stackable || itemToPick.item.noted) {
            if (inv.inventory.some(s => s?.itemId === itemData.id && !!s.noted === !!itemToPick.item.noted && (!itemData.doseable || s.doses === itemToPick.item.doses))) {
                needsNewSlot = false;
            }
        }
        
        if (needsNewSlot && freeSlots < 1) {
            addLog("Your inventory is full.");
            return;
        }

        inv.modifyItem(itemToPick.item.itemId, itemToPick.item.quantity, false, itemToPick.item.doses, { bypassAutoBank: true, noted: itemToPick.item.noted });
        
        setGroundItems(prev => {
            const newItems = { ...prev };
            const poiItems = newItems[poiId] || [];
            newItems[poiId] = poiItems.filter(gi => gi.uniqueId !== uniqueId);

            // Check if this was the last item of a death pile
            if (worldState.deathMarker && worldState.deathMarker.poiId === poiId && newItems[poiId].length === 0) {
                setWorldState(ws => ({ ...ws, deathMarker: null }));
                addLog("You have recovered your lost items.");
            }
            
            if (newItems[poiId].length === 0) {
                delete newItems[poiId];
                ui.setIsLootViewOpen(false);
            }
            return newItems;
        });
        ui.setTooltip(null);
    }, [groundItems, session.currentPoiId, addLog, ui, invRef, worldState, setWorldState]);

    const handleTakeAllLoot = useCallback(() => {
        const inv = invRef.current;
        if (!inv) {
            console.error("invRef not set in useGroundItems");
            return;
        }

        const poiId = session.currentPoiId;
        let groundItemsForPoi = groundItems[poiId];
        if (!groundItemsForPoi || groundItemsForPoi.length === 0) return;

        let itemsToPickUp: InventorySlot[] = [];
        let idsToRemove: number[] = [];
        let tempInventory = [...inv.inventory];

        for (const groundItem of groundItemsForPoi) {
            const itemData = ITEMS[groundItem.item.itemId];
            let slotsNeeded = 0;
            if (!itemData.stackable && !groundItem.item.noted) {
                slotsNeeded = groundItem.item.quantity;
            } else {
                const stackExists = tempInventory.some(i => i?.itemId === groundItem.item.itemId && !!i.noted === !!groundItem.item.noted);
                if (!stackExists) {
                    slotsNeeded = 1;
                }
            }
            
            const freeSlots = tempInventory.filter(s => s === null).length;

            if (freeSlots >= slotsNeeded) {
                itemsToPickUp.push(groundItem.item);
                idsToRemove.push(groundItem.uniqueId);

                // Update temp inventory for next iteration's free slot check
                let added = false;
                if (itemData.stackable || groundItem.item.noted) {
                    const existingStack = tempInventory.find(i => i?.itemId === groundItem.item.itemId && !!i.noted === !!groundItem.item.noted);
                    if (existingStack) {
                        existingStack.quantity += groundItem.item.quantity;
                        added = true;
                    }
                }
                if (!added) {
                    // This handles both new stacks and unstackable items
                    for (let i = 0; i < groundItem.item.quantity; i++) {
                        const emptySlotIndex = tempInventory.findIndex(s => s === null);
                        if (emptySlotIndex !== -1) {
                            tempInventory[emptySlotIndex] = { ...groundItem.item, quantity: 1 };
                        }
                    }
                }
            } else {
                addLog("You don't have enough space to pick up everything.");
                break;
            }
        }

        if (itemsToPickUp.length > 0) {
            itemsToPickUp.forEach(item => {
                inv.modifyItem(item.itemId, item.quantity, false, item.doses, { bypassAutoBank: true, noted: item.noted });
            });
            
            setGroundItems(prev => {
                const newItems = { ...prev };
                newItems[poiId] = newItems[poiId].filter(gi => !idsToRemove.includes(gi.uniqueId));
                
                if (worldState.deathMarker && worldState.deathMarker.poiId === poiId && newItems[poiId].length === 0) {
                    setWorldState(ws => ({ ...ws, deathMarker: null }));
                    addLog("You have recovered your lost items.");
                }

                if (newItems[poiId].length === 0) {
                    delete newItems[poiId];
                    ui.setIsLootViewOpen(false);
                }
                return newItems;
            });
        }
    }, [groundItems, session.currentPoiId, addLog, ui, invRef, worldState, setWorldState]);

    const clearItemsAtPoi = useCallback((poiId: string) => {
        setGroundItems(prev => {
            const newItems = { ...prev };
            if (newItems[poiId]) {
                delete newItems[poiId];
            }
            return newItems;
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setGroundItems(prev => {
                const now = Date.now();
                const { deathMarker } = worldState;
                const newGroundItems: Record<string, GroundItem[]> = {};
                let changed = false;
                for (const poiId in prev) {
                    const items = prev[poiId].filter(item => {
                        // If there's an active death marker at this POI, don't despawn items via the normal 5-minute timer.
                        if (deathMarker && deathMarker.poiId === poiId) {
                            return true;
                        }
                        // Otherwise, use the standard 5 minute timer.
                        return now - item.dropTime < 5 * 60 * 1000;
                    });
                    if (items.length < prev[poiId].length) changed = true;
                    if (items.length > 0) {
                        newGroundItems[poiId] = items;
                    }
                }
                return changed ? newGroundItems : prev;
            });
        }, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, [worldState]);

    return {
        groundItems,
        groundItemsForCurrentPoi: groundItems[session.currentPoiId] || [],
        onItemDropped,
        handlePickUpItem,
        handleTakeAllLoot,
        clearItemsAtPoi,
    };
};