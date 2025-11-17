

import { useState, useEffect, useCallback, useRef } from 'react';
import { ShopStates, InventorySlot } from '../types';
import { SHOPS, ITEMS } from '../constants';

export const useShops = (
    initialShopStates: ShopStates, // This is kept for signature compatibility but is no longer used.
    playerCoins: number,
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean }) => void,
    addLog: (message: string) => void,
    inventory: (InventorySlot | null)[]
) => {
    const [shopStates, setShopStates] = useState<ShopStates>(() => {
        // Always initialize shops from the master list, ignoring saved state.
        const initialStates: ShopStates = {};
        for (const shopId in SHOPS) {
            const shopData = SHOPS[shopId];
            initialStates[shopId] = {};
            for (const defaultItem of shopData.inventory) {
                if (!ITEMS[defaultItem.itemId]) {
                    console.warn(`Item '${defaultItem.itemId}' defined in shop '${shopId}' but not in ITEMS. Skipping.`);
                    continue;
                }
                initialStates[shopId][defaultItem.itemId] = {
                    itemId: defaultItem.itemId,
                    currentStock: defaultItem.quantity,
                    restockProgress: 0,
                };
            }
        }
        return initialStates;
    });

    // Shop stock regeneration (for in-session changes)
    useEffect(() => {
        const interval = setInterval(() => {
            setShopStates(prevStates => {
                let changed = false;
                const newStates = JSON.parse(JSON.stringify(prevStates));

                for (const shopId in newStates) {
                    const shopData = SHOPS[shopId];
                    if (!shopData) continue;

                    for (const itemId in newStates[shopId]) {
                        const itemState = newStates[shopId][itemId];
                        const itemData = ITEMS[itemId];
                        const defaultShopItem = shopData.inventory.find(i => i.itemId === itemId);

                        if (!itemData || !defaultShopItem) continue;

                        if (itemState.currentStock < defaultShopItem.quantity) {
                            changed = true;
                            itemState.restockProgress += 1000;
                            const restockInterval = (itemData.value / 2) * 1000;
                            
                            if (restockInterval > 0 && itemState.restockProgress >= restockInterval) {
                                const itemsToAdd = Math.floor(itemState.restockProgress / restockInterval);
                                itemState.currentStock = Math.min(defaultShopItem.quantity, itemState.currentStock + itemsToAdd);
                                itemState.restockProgress %= restockInterval;
                            }
                        } else {
                            itemState.restockProgress = 0; // Reset progress if stock is full
                        }
                    }
                }
                return changed ? newStates : prevStates;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Refs to hold the latest state and props to avoid stale closures in handleBuy
    const shopStatesRef = useRef(shopStates);
    useEffect(() => { shopStatesRef.current = shopStates; }, [shopStates]);

    const playerCoinsRef = useRef(playerCoins);
    useEffect(() => { playerCoinsRef.current = playerCoins; }, [playerCoins]);
    
    const inventoryRef = useRef(inventory);
    useEffect(() => { inventoryRef.current = inventory; }, [inventory]);


    const handleBuy = useCallback((shopId: string, itemId: string, quantity: number) => {
        const currentShopStates = shopStatesRef.current;
        const currentInventory = inventoryRef.current;
        const currentCoins = playerCoinsRef.current;

        const shopState = currentShopStates[shopId];
        const itemState = shopState?.[itemId];
        const itemData = ITEMS[itemId];
        const shopData = SHOPS[shopId];
        const defaultShopItem = shopData?.inventory.find(i => i.itemId === itemId);
        
        if (!itemState || !itemData || !shopData || !defaultShopItem) {
            addLog("Error: Item not found in shop.");
            return;
        }
    
        let actualQuantityToBuy = Math.min(quantity, itemState.currentStock);
        if (actualQuantityToBuy <= 0) {
            addLog("The shop does not have enough stock.");
            return;
        }
    
        const freeSlots = currentInventory.filter(s => s === null).length;
        let maxCanHold = 0;
    
        if (itemData.stackable) {
            const hasStack = currentInventory.some(slot => slot?.itemId === itemId);
            maxCanHold = (hasStack || freeSlots > 0) ? actualQuantityToBuy : 0;
        } else {
            maxCanHold = Math.min(actualQuantityToBuy, freeSlots);
        }
        
        if (maxCanHold <= 0) {
            addLog("Your inventory is full.");
            return;
        }
    
        if (maxCanHold < actualQuantityToBuy) {
            addLog(`You only have room for ${maxCanHold}.`);
            actualQuantityToBuy = maxCanHold;
        }
    
        const buyPrice = Math.ceil(itemData.value * defaultShopItem.priceModifier);
        let totalCost = buyPrice * actualQuantityToBuy;
    
        if (currentCoins < totalCost) {
            const affordAmount = Math.floor(currentCoins / buyPrice);
            if (affordAmount > 0) {
                actualQuantityToBuy = affordAmount;
                totalCost = buyPrice * actualQuantityToBuy;
                addLog(`You can only afford ${actualQuantityToBuy}.`);
            } else {
                addLog("You don't have enough coins.");
                return;
            }
        }
    
        modifyItem('coins', -totalCost, true);
        modifyItem(itemId, actualQuantityToBuy, true, { doses: itemData.initialDoses, charges: itemData.charges, bypassAutoBank: true });
        
        setShopStates(prev => {
            const newStates = JSON.parse(JSON.stringify(prev));
            newStates[shopId][itemId].currentStock -= actualQuantityToBuy;
            return newStates;
        });
    
        addLog(`You bought ${actualQuantityToBuy}x ${itemData.name} for ${totalCost} coins.`);
    }, [modifyItem, addLog, setShopStates]);

    return { shopStates, handleBuy };
};