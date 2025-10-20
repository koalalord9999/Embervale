import React, { useCallback } from 'react';
import { useSkilling } from './useSkilling';
import { useInteractQuest } from './useInteractQuest';
import { useUIState } from './useUIState';
import { useGameSession } from './useGameSession';
import { useCharacter } from './useCharacter';
import { useInventory } from './useInventory';
import { WorldState, InventorySlot, Equipment, PlayerQuestState, PlayerType, POIActivity, PlayerRepeatableQuest } from '../types';
import { ITEMS, INVENTORY_CAPACITY, REGIONS } from '../constants';
import { POIS } from '../data/pois';
import { saveSlotState } from '../db';
import { useRepeatableQuests } from './useRepeatableQuests';

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
    worldState: WorldState;
    playerType: PlayerType;
    slotId: number;
    onReturnToMenu: (currentState?: any) => void;
    repeatableQuests: ReturnType<typeof useRepeatableQuests>;
    setDynamicActivities: (activities: POIActivity[] | null) => void;
    onResetGame: () => void;
}

export const usePlayerDeath = (deps: PlayerDeathDependencies) => {
    const { skilling, interactQuest, ui, session, char, inv, addLog, playerQuests, onItemDropped, setWorldState, playerType, slotId, onReturnToMenu, repeatableQuests, setDynamicActivities, worldState, onResetGame } = deps;

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

        if (playerType === PlayerType.Hardcore) {
            addLog("You have fallen in combat and your hardcore journey has come to an end. Your character is lost forever.");
            onResetGame();
            return;
        }

        // Clear all boosts on death
        char.clearStatModifiers();
        char.clearBuffs();
        setWorldState(ws => ({ ...ws, hpBoost: null }));

        // --- Normal/Cheats Death Mechanics ---
        let dropPoiId = session.currentPoiId;
        let respawnPoiId = 'meadowdale_square'; // Default respawn is now always Meadowdale Square unless overridden by failsafe.

        const currentPoi = POIS[session.currentPoiId];
        const activeRepeatableQuest = repeatableQuests.activePlayerQuest;

        // Check for pilfering instance
        if (worldState.activePilferingSession && session.currentPoiId === 'pilfering_house_instance') {
            const entryPoiId = worldState.activePilferingSession.entryPoiId;
            dropPoiId = entryPoiId;
            // respawnPoiId remains 'meadowdale_square'
            
            setWorldState(ws => {
                if (!ws.activePilferingSession) return ws;
                const houseId = ws.activePilferingSession.housePoiId;
                return {
                    ...ws,
                    activePilferingSession: null,
                    depletedHouses: [...(ws.depletedHouses || []), houseId]
                };
            });
            setDynamicActivities(null);

        } // Check for repeatable quest instance
        else if (activeRepeatableQuest?.generatedQuest.isInstance && session.currentPoiId === activeRepeatableQuest.generatedQuest.instancePoiId) {
            const instancePoi = POIS[session.currentPoiId];
            const exitPoiId = instancePoi.connections.find(connId => {
                const connPoi = POIS[connId];
                return connPoi && connPoi.regionId !== instancePoi.regionId;
            }) || instancePoi.connections[0];

            if (exitPoiId && POIS[exitPoiId]) {
                dropPoiId = exitPoiId;
                // respawnPoiId remains 'meadowdale_square'
            } else {
                addLog(`ERROR: No spawn point set for this location (${session.currentPoiId}), please contact Ember on discord.`);
                dropPoiId = 'meadowdale_square';
                respawnPoiId = 'meadowdale_square';
            }
        } // Check for dungeon
        else if (currentPoi) {
            const region = REGIONS[currentPoi.regionId];
            if (region && region.type === 'dungeon') {
                dropPoiId = region.entryPoiId;
                // respawnPoiId remains 'meadowdale_square'
            }
        }

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
        
        const lostCoins = inv.coins;
        
        if (lostCoins > 0) {
            onItemDropped({ itemId: 'coins', quantity: lostCoins }, dropPoiId, true);
        }
        droppedItems.forEach(item => {
            onItemDropped(item.slot, dropPoiId, true);
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
                poiId: dropPoiId,
                timeRemaining: 600000, // 10 minutes in ms
                immunityGranted: false
            }
        }));

        session.setCurrentPoiId(respawnPoiId);
        char.setCurrentHp(char.maxHp);
        addLog(`You have died! Your 3 most valuable items have been kept. The rest, including ${lostCoins.toLocaleString()} coins, have been dropped at ${POIS[dropPoiId].name}. You have 10 minutes of in-game time to retrieve them.`);

    }, [skilling, interactQuest, ui, session, char, inv, addLog, playerQuests, onItemDropped, setWorldState, playerType, slotId, onReturnToMenu, repeatableQuests, setDynamicActivities, worldState, onResetGame]);

    return { handlePlayerDeath };
};