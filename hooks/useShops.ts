
import { useState, useEffect, useCallback } from 'react';
import { ShopStates } from '../types';
import { SHOPS, ITEMS } from '../constants';

export const useShops = (
    initialShopStates: ShopStates,
    playerCoins: number,
    modifyItem: (itemId: string, quantity: number, quiet?: boolean) => void,
    addLog: (message: string) => void
) => {
    const [shopStates, setShopStates] = useState<ShopStates>(initialShopStates);

    // Sync shop states with constants on game load, handles new shops/items in updates
    useEffect(() => {
        setShopStates(prevStates => {
            const newStates: ShopStates = JSON.parse(JSON.stringify(prevStates));
            let needsUpdate = false;
    
            for (const shopId in SHOPS) {
                if (!newStates[shopId]) {
                    newStates[shopId] = {};
                    needsUpdate = true;
                }
                const shopData = SHOPS[shopId];
                for (const item of shopData.inventory) {
                    if (!newStates[shopId][item.itemId]) {
                        newStates[shopId][item.itemId] = {
                            itemId: item.itemId,
                            currentStock: item.quantity,
                            restockProgress: 0,
                        };
                        needsUpdate = true;
                    }
                }
            }
    
            return needsUpdate ? newStates : prevStates;
        });
    }, []); // Run only once on initial load

    // Shop stock regeneration
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
        modifyItem(itemId, quantity, true);
        
        setShopStates(prev => {
            const newStates = JSON.parse(JSON.stringify(prev));
            newStates[shopId][itemId].currentStock -= quantity;
            return newStates;
        });

        addLog(`You bought ${quantity}x ${itemData.name} for ${totalCost} coins.`);
    }, [shopStates, playerCoins, modifyItem, addLog]);

    return { shopStates, handleBuy };
};
