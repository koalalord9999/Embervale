import { useCallback } from 'react';
import { useSkilling } from './useSkilling';
import { useInteractQuest } from './useInteractQuest';
import { useUIState } from './useUIState';
import { useGameSession } from './useGameSession';
import { useCharacter } from './useCharacter';
import { useInventory } from './useInventory';
import { WorldState, InventorySlot, Equipment } from '../types';
import { ITEMS, INVENTORY_CAPACITY } from '../constants';
import { POIS } from '../data/pois';

interface PlayerDeathDependencies {
    skilling: ReturnType<typeof useSkilling>;
    interactQuest: ReturnType<typeof useInteractQuest>;
    ui: ReturnType<typeof useUIState>;
    session: ReturnType<typeof useGameSession>;
    char: ReturnType<typeof useCharacter>;
    inv: ReturnType<typeof useInventory>;
    addLog: (message: string) => void;
    tutorialStage: number;
    onItemDropped: (item: InventorySlot) => void;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
}

export const usePlayerDeath = (deps: PlayerDeathDependencies) => {
    const { skilling, interactQuest, ui, session, char, inv, addLog, tutorialStage, onItemDropped, setWorldState } = deps;

    const handlePlayerDeath = useCallback(() => {
        skilling.stopSkilling();
        interactQuest.handleCancelInteractQuest();
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);
    
        const isTutorialActive = tutorialStage >= 0;
        
        if (isTutorialActive) {
            const respawnPoi = 'tutorial_entrance';
            session.setCurrentPoiId(respawnPoi);
            char.setCurrentHp(char.maxHp);
            addLog("You have been defeated! Don't worry, you've been safely returned. In the main world, death is more costly.");
            return;
        }

        // --- Full Death Mechanics ---

        // 1. Get all player items from inventory and equipment
        const allItems: { slot: InventorySlot; from: 'inventory' | keyof Equipment }[] = [];
        inv.inventory.forEach((slot) => {
            if (slot) allItems.push({ slot, from: 'inventory' });
        });
        (Object.keys(inv.equipment) as Array<keyof Equipment>).forEach(slotKey => {
            const slot = inv.equipment[slotKey];
            if (slot) allItems.push({ slot, from: slotKey });
        });

        // 2. Sort by single-item value, descending
        allItems.sort((a, b) => (ITEMS[b.slot.itemId]?.value ?? 0) - (ITEMS[a.slot.itemId]?.value ?? 0));
        
        // 3. Determine kept and dropped items
        const keptItems = allItems.slice(0, 3);
        const droppedItems = allItems.slice(3);

        // 4. Handle dropped items and coins
        const deathPoiId = session.currentPoiId;
        const lostCoins = inv.coins;
        
        if (lostCoins > 0) {
            onItemDropped({ itemId: 'coins', quantity: lostCoins });
        }
        droppedItems.forEach(item => {
            onItemDropped(item.slot);
        });

        // 5. Update inventory and equipment with only the kept items
        const newInventory: (InventorySlot | null)[] = new Array(INVENTORY_CAPACITY).fill(null);
        const newEquipment: Equipment = { weapon: null, shield: null, head: null, body: null, legs: null, ammo: null, gloves: null, boots: null, cape: null, necklace: null, ring: null };
        
        let invIndex = 0;
        keptItems.forEach(item => {
            if (item.from !== 'inventory') {
                newEquipment[item.from as keyof Equipment] = item.slot;
            } else {
                if (invIndex < INVENTORY_CAPACITY) {
                    newInventory[invIndex++] = item.slot;
                }
            }
        });

        inv.setInventory(newInventory);
        inv.setEquipment(newEquipment);
        inv.setCoins(0);

        // 6. Set the death marker and timer
        setWorldState(ws => ({
            ...ws,
            deathMarker: {
                poiId: deathPoiId,
                timeRemaining: 600000, // 10 minutes in ms
                immunityGranted: false
            }
        }));

        // 7. Respawn player
        session.setCurrentPoiId('meadowdale_square');
        char.setCurrentHp(char.maxHp);
        addLog(`You have died! Your 3 most valuable items have been kept. The rest, including ${lostCoins.toLocaleString()} coins, have been dropped at ${POIS[deathPoiId].name}.`);

    }, [session, char, inv, addLog, ui, skilling, interactQuest, tutorialStage, onItemDropped, setWorldState]);

    return { handlePlayerDeath };
};
