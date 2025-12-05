import { useState, useEffect, useCallback } from 'react';
import { GroundItem, InventorySlot } from '../../types';
import { HumanoidModel } from '../humanoidModel';

interface WorldDependencies {
    initialGroundItems: Record<string, GroundItem[]>;
    initialMonsterRespawnTimers: Record<string, number>;
    humanoidsRef: React.RefObject<HumanoidModel[]>;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>>) => void;
}

export const usePrototypeWorld = (deps: WorldDependencies) => {
    const { initialGroundItems, initialMonsterRespawnTimers, humanoidsRef, modifyItem } = deps;

    const [groundItems, setGroundItems] = useState<Record<string, GroundItem[]>>(initialGroundItems);
    const [monsterRespawnTimers, setMonsterRespawnTimers] = useState<Record<string, number>>(initialMonsterRespawnTimers);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setGroundItems(prev => {
                const newGroundItems: Record<string, GroundItem[]> = {};
                let changed = false;
                for (const key in prev) {
                    const items = prev[key].filter(item => item.expiresAt && now < item.expiresAt);
                    if (items.length > 0) newGroundItems[key] = items;
                    if (items.length !== prev[key].length) changed = true;
                }
                return changed ? newGroundItems : prev;
            });
             setMonsterRespawnTimers(prev => {
                const newTimers = { ...prev };
                let changed = false;
                for (const key in newTimers) {
                    if (now > newTimers[key]) {
                        const humanoid = humanoidsRef.current?.find(h => h.id === key);
                        if (humanoid) humanoid.state = 'idle';
                        delete newTimers[key];
                        changed = true;
                    }
                }
                return changed ? newTimers : prev;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [humanoidsRef]);

    const handlePickUpItem = useCallback((uniqueId: number) => {
        let itemToTake: InventorySlot | null = null;
        let itemKey: string | null = null;

        for (const key in groundItems) {
            const itemIndex = groundItems[key].findIndex(gi => gi.uniqueId === uniqueId);
            if (itemIndex > -1) {
                itemToTake = groundItems[key][itemIndex].item;
                itemKey = key;
                break;
            }
        }
    
        if (itemToTake && itemKey) {
            modifyItem(itemToTake.itemId, itemToTake.quantity, false, { ...itemToTake });
            setGroundItems(prev => {
                const newItems = { ...prev };
                const updatedItemsOnTile = (newItems[itemKey!] || []).filter(gi => gi.uniqueId !== uniqueId);
                if (updatedItemsOnTile.length === 0) delete newItems[itemKey!];
                else newItems[itemKey!] = updatedItemsOnTile;
                return newItems;
            });
        }
    }, [modifyItem, groundItems]);

    const onItemDropped = useCallback((item: InventorySlot, x: number, y: number) => {
        const key = `${x},${y}`;
        const newGroundItem: GroundItem = {
            item,
            uniqueId: Date.now() + Math.random(),
            expiresAt: Date.now() + 120000 // 2 minutes
        };
        setGroundItems(prev => {
            const itemsOnTile = prev[key] ? [...prev[key]] : [];
            return { ...prev, [key]: [...itemsOnTile, newGroundItem] };
        });
    }, []);

    return {
        groundItems,
        setGroundItems,
        monsterRespawnTimers,
        setMonsterRespawnTimers,
        handlePickUpItem,
        onItemDropped,
    };
};
