import React, { useCallback } from 'react';
import { useSkilling } from './useSkilling';
import { useInteractQuest } from './useInteractQuest';
import { useUIState } from './useUIState';
import { useGameSession } from './useGameSession';
import { useCharacter } from './useCharacter';
import { useInventory } from './useInventory';
import { WorldState, InventorySlot, Equipment, PlayerQuestState, PlayerType } from '../types';
import { ITEMS, INVENTORY_CAPACITY, REGIONS } from '../constants';
import { POIS } from '../data/pois';
import { saveSlotState } from '../db';

interface PlayerDeathDependencies {
    skilling: ReturnType<typeof useSkilling>;
    interactQuest: ReturnType<typeof useInteractQuest>;
    ui: ReturnType<typeof useUIState>;
    session: ReturnType<typeof useGameSession>;
    char: ReturnType<typeof useCharacter>;
    inv: ReturnType<typeof useInventory>;
    addLog: (message: string) => void;
    playerQuests: PlayerQuestState[];
    onItemDropped: (item: InventorySlot, overridePoiId?: string, isDeathPile?: boolean) => void;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
    playerType: PlayerType;
    slotId: number;
    gameState: any;
    onReturnToMenu: () => void;
}

export const usePlayerDeath = (deps: PlayerDeathDependencies) => {
    const { skilling, interactQuest, ui, session, char, inv, addLog, playerQuests, onItemDropped, setWorldState, playerType, slotId, gameState, onReturnToMenu } = deps;

    const handlePlayerDeath = useCallback(async () => {
        skilling.stopSkilling();
        interactQuest.handleCancelInteractQuest();
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);
    
        const tutorialQuest = playerQuests.find(q => q.questId === 'embrune_101');
        const isTutorialActive = tutorialQuest && !tutorialQuest.isComplete;
        
        if (isTutorialActive) {
            const respawnPoi = 'tutorial_entrance';
            session.setCurrentPoiId(respawnPoi);
            char.setCurrentHp(char.maxHp);
            addLog("You have been defeated! Don't worry, you've been safely returned. In the main world, death is more costly.");
            return;
        }

        // --- Hardcore Death ---
        if (playerType === PlayerType.Hardcore) {
            addLog("You have fallen in Hardcore mode. Your journey ends here. Your character will be saved as a memorial.");
            const deadState = { ...gameState, isDead: true };
            await saveSlotState(slotId, deadState);
            setTimeout(() => {
                onReturnToMenu();
            }, 3000);
            return;
        }

        // --- Normal/Cheats Death Mechanics ---
        const allItems: { slot: InventorySlot; from: 'inventory' | keyof Equipment }[] = [];
        inv.inventory.forEach((slot) => {
            if (slot) allItems.push({ slot, from: 'inventory' });
        });
        (Object.keys(inv.equipment) as Array<keyof Equipment>).forEach(slotKey => {
            const slot = inv.equipment[slotKey];
            if (slot) allItems.push({ slot, from: slotKey });
        });

        allItems.sort((a, b) => (ITEMS[b.slot.itemId]?.value ?? 0) - (ITEMS[a.slot.itemId]?.value ?? 0));
        
        const keptItems = allItems.slice(0, 3);
        const droppedItems = allItems.slice(3);

        let finalDeathPoiId = session.currentPoiId;
        const currentPoi = POIS[session.currentPoiId];
        if (currentPoi) {
            const region = REGIONS[currentPoi.regionId];
            if (region && region.type === 'dungeon') {
                finalDeathPoiId = region.entryPoiId;
            }
        }
        
        const lostCoins = inv.coins;
        
        if (lostCoins > 0) {
            onItemDropped({ itemId: 'coins', quantity: lostCoins }, finalDeathPoiId, true);
        }
        droppedItems.forEach(item => {
            onItemDropped(item.slot, finalDeathPoiId, true);
        });

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

        setWorldState(ws => ({
            ...ws,
            deathMarker: {
                poiId: finalDeathPoiId,
                timeRemaining: 600000, // 10 minutes in ms
                immunityGranted: false
            }
        }));

        session.setCurrentPoiId('meadowdale_square');
        char.setCurrentHp(char.maxHp);
        addLog(`You have died! Your 3 most valuable items have been kept. The rest, including ${lostCoins.toLocaleString()} coins, have been dropped at ${POIS[finalDeathPoiId].name}. You have 10 minutes of in-game time to retrieve them.`);

    }, [session, char, inv, addLog, ui, skilling, interactQuest, playerQuests, onItemDropped, setWorldState, playerType, slotId, gameState, onReturnToMenu]);

    return { handlePlayerDeath };
};
