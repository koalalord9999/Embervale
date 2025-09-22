import { useState, useEffect, useCallback } from 'react';
import { ShopStates } from '../types';
import { SHOPS, ITEMS } from '../constants';

export const useShops = (
    initialShopStates: ShopStates, // This is kept for signature compatibility but is no longer used.
    playerCoins: number,
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, doses?: number, options?: { bypassAutoBank?: boolean }) => void,
    addLog: (message: string) => void
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

    const handleBuy = useCallback((shopId: string, itemId: string, quantity: number) => {
        const shopState = shopStates[shopId];
        const itemState = shopState?.[itemId];
        const itemData = ITEMS[itemId];
        const shopData = SHOPS[shopId];
        const defaultShopItem = shopData?.inventory.find(i => i.itemId === itemId);
        
        if (!itemState || !itemData || !shopData || !defaultShopItem) {
            addLog("Error: Item not found in shop.");
            return;
        }

        if (itemState.currentStock < quantity) {
            addLog("The shop does not have enough stock.");
            return;
        }
        
        const buyPrice = Math.ceil(itemData.value * defaultShopItem.priceModifier);
        const totalCost = buyPrice * quantity;

        if (playerCoins < totalCost) {
            addLog("You don't have enough coins.");
            return;
        }

        modifyItem('coins', -totalCost, true);
        modifyItem(itemId, quantity, true, itemData.initialDoses, { bypassAutoBank: true });
        
        setShopStates(prev => {
            const newStates = JSON.parse(JSON.stringify(prev));
            newStates[shopId][itemId].currentStock -= quantity;
            return newStates;
        });

        addLog(`You bought ${quantity}x ${itemData.name} for ${totalCost} coins.`);
    }, [shopStates, playerCoins, modifyItem, addLog]);

    return { shopStates, handleBuy };
};