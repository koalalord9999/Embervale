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

export const useGroundItems = (initialGroundItems: Record<string, GroundItem[]>, deps: GroundItemDependencies) => {
    const { session, invRef, addLog, ui, worldState, setWorldState } = deps;
    const [groundItems, setGroundItems] = useState<Record<string, GroundItem[]>>(initialGroundItems);

    const onItemDropped = useCallback((item: InventorySlot, overridePoiId?: string, isDeathPile: boolean = false) => {
        const poiId = overridePoiId || session.currentPoiId;
        const itemData = ITEMS[item.itemId];
        if (!itemData) return;
    
        setGroundItems(prev => {
            const newItemsForPoi = [...(prev[poiId] || [])];
            
            const newGroundItem: GroundItem = {
                item: item,
                uniqueId: Date.now() + Math.random(),
                isDeathPile: isDeathPile ? true : undefined,
            };
            if (!isDeathPile) {
                newGroundItem.expiresAt = Date.now() + (5 * 60 * 1000);
            }

            if (itemData.stackable || item.noted) {
                const existingStackIndex = newItemsForPoi.findIndex(gi => 
                    gi.item.itemId === item.itemId && 
                    !!gi.item.noted === !!item.noted &&
                    !!gi.isDeathPile === isDeathPile // Stack like with like
                );
                if (existingStackIndex > -1) {
                    newItemsForPoi[existingStackIndex].item.quantity += item.quantity;
                    // Update expiry for normal items
                    if (!isDeathPile) {
                        newItemsForPoi[existingStackIndex].expiresAt = newGroundItem.expiresAt;
                    }
                } else {
                    newItemsForPoi.push(newGroundItem);
                }
            } else {
                for (let i = 0; i < item.quantity; i++) {
                    newItemsForPoi.push({ 
                        item: { ...item, quantity: 1 }, 
                        uniqueId: Date.now() + Math.random() + i,
                        isDeathPile: isDeathPile ? true : undefined,
                        expiresAt: isDeathPile ? undefined : Date.now() + (5 * 60 * 1000)
                    });
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

            if (worldState.deathMarker && worldState.deathMarker.poiId === poiId && newItems[poiId].filter(i => i.isDeathPile).length === 0) {
                setWorldState(ws => ({ ...ws, deathMarker: null }));
                addLog("You have recovered all your lost items.");
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
        const groundItemsForPoi = groundItems[poiId];
        if (!groundItemsForPoi || groundItemsForPoi.length === 0) return;

        const itemsToPickUp: InventorySlot[] = [];
        const idsToRemove: number[] = [];
        let tempInventory = [...inv.inventory];
        let spaceRanOut = false;

        const sortedGroundItems = [...groundItemsForPoi].sort((a, b) => {
            const itemA = ITEMS[a.item.itemId];
            const itemB = ITEMS[b.item.itemId];
            const isStackableA = itemA.stackable || a.item.noted;
            const isStackableB = itemB.stackable || b.item.noted;
            const hasStackA = isStackableA && tempInventory.some(i => i?.itemId === a.item.itemId && !!i.noted === !!a.item.noted);
            const hasStackB = isStackableB && tempInventory.some(i => i?.itemId === b.item.itemId && !!i.noted === !!b.item.noted);

            if (hasStackA && !hasStackB) return -1;
            if (!hasStackA && hasStackB) return 1;
            return 0;
        });

        for (const groundItem of sortedGroundItems) {
            const itemData = ITEMS[groundItem.item.itemId];
            let freeSlots = tempInventory.filter(s => s === null).length;
            
            const stackExists = (itemData.stackable || groundItem.item.noted) && tempInventory.some(i => i?.itemId === groundItem.item.itemId && !!i.noted === !!groundItem.item.noted);
            const slotsNeeded = (itemData.stackable || groundItem.item.noted) ? (stackExists ? 0 : 1) : groundItem.item.quantity;

            if (freeSlots >= slotsNeeded) {
                itemsToPickUp.push(groundItem.item);
                idsToRemove.push(groundItem.uniqueId);

                if (!stackExists && slotsNeeded > 0) {
                     for (let i = 0; i < slotsNeeded; i++) {
                        const emptySlotIndex = tempInventory.findIndex(s => s === null);
                        if (emptySlotIndex !== -1) {
                            tempInventory[emptySlotIndex] = { itemId: 'placeholder', quantity: 1 };
                        }
                    }
                }
            } else {
                spaceRanOut = true;
            }
        }

        if (spaceRanOut) {
            addLog("You don't have enough space to pick up everything.");
        }

        if (itemsToPickUp.length > 0) {
            const consolidatedPickups: Record<string, InventorySlot> = {};
            itemsToPickUp.forEach(item => {
                const key = `${item.itemId}:${!!item.noted}:${item.doses ?? 'na'}`;
                if (consolidatedPickups[key]) {
                    consolidatedPickups[key].quantity += item.quantity;
                } else {
                    consolidatedPickups[key] = { ...item };
                }
            });

            Object.values(consolidatedPickups).forEach(item => {
                inv.modifyItem(item.itemId, item.quantity, false, item.doses, { bypassAutoBank: true, noted: item.noted });
            });
            
            setGroundItems(prev => {
                const newItems = { ...prev };
                const poiItems = newItems[poiId] || [];
                newItems[poiId] = poiItems.filter(gi => !idsToRemove.includes(gi.uniqueId));
                
                if (worldState.deathMarker && worldState.deathMarker.poiId === poiId && newItems[poiId].filter(i => i.isDeathPile).length === 0) {
                    setWorldState(ws => ({ ...ws, deathMarker: null }));
                    addLog("You have recovered all your lost items.");
                }

                if (newItems[poiId].length === 0) {
                    delete newItems[poiId];
                    ui.setIsLootViewOpen(false);
                }
                return newItems;
            });
        }
    }, [groundItems, session.currentPoiId, addLog, ui, invRef, worldState, setWorldState]);

    const clearAllItemsAtPoi = useCallback((poiId: string) => {
        setGroundItems(prev => {
            const newItems = { ...prev };
            if (newItems[poiId]) {
                delete newItems[poiId];
            }
            return newItems;
        });
    }, []);

    const clearDeathPileItemsAtPoi = useCallback((poiId: string) => {
        setGroundItems(prev => {
            const newItems = { ...prev };
            if (newItems[poiId]) {
                newItems[poiId] = newItems[poiId].filter(item => !item.isDeathPile);
                if (newItems[poiId].length === 0) {
                    delete newItems[poiId];
                }
            }
            return newItems;
        });
    }, []);
    
    // Cleanup on load for items that expired while offline
    useEffect(() => {
        setGroundItems(prev => {
            const now = Date.now();
            const newGroundItems: Record<string, GroundItem[]> = {};
            let changed = false;
            for (const poiId in prev) {
                const items = prev[poiId].filter(item => item.isDeathPile || (item.expiresAt && now < item.expiresAt));
                if (items.length < prev[poiId].length) {
                    changed = true;
                }
                if (items.length > 0) {
                    newGroundItems[poiId] = items;
                }
            }
            return changed ? newGroundItems : prev;
        });
    }, []); // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
        const interval = setInterval(() => {
            setGroundItems(prev => {
                const now = Date.now();
                const newGroundItems: Record<string, GroundItem[]> = {};
                let changed = false;
                for (const poiId in prev) {
                    // Filter out expired normal items, but keep all death pile items
                    const items = prev[poiId].filter(item => item.isDeathPile || (item.expiresAt && now < item.expiresAt));
                    if (items.length < prev[poiId].length) {
                        changed = true;
                    }
                    if (items.length > 0) {
                        newGroundItems[poiId] = items;
                    }
                }
                return changed ? newGroundItems : prev;
            });
        }, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return {
        groundItems,
        groundItemsForCurrentPoi: groundItems[session.currentPoiId] || [],
        onItemDropped,
        handlePickUpItem,
        handleTakeAllLoot,
        clearAllItemsAtPoi,
        clearDeathPileItemsAtPoi,
    };
};