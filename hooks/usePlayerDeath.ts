
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
    setActivePrayers: React.Dispatch<React.SetStateAction<string[]>>;
}

export const usePlayerDeath = (deps: PlayerDeathDependencies) => {
    const { skilling, interactQuest, ui, session, char, inv, addLog, playerQuests, onItemDropped, setWorldState, playerType, slotId, onReturnToMenu, repeatableQuests, setDynamicActivities, worldState, onResetGame, setActivePrayers } = deps;

    const handlePlayerDeath = useCallback(async (currentState: any) => {
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
            char.setCurrentPrayer(char.maxPrayer);
            setActivePrayers([]);
            addLog("You have been defeated! Don't worry, you've been safely returned. In the main world, death is more costly.");
            return;
        }

        if (playerType === PlayerType.Hardcore) {
            addLog("You have fallen in combat! As a Hardcore adventurer, your journey ends here. Your character will be permanently lost.");
            const finalState = { ...currentState, isDead: true, currentHp: 0 };
            onReturnToMenu(finalState);
            return;
        }

        // Clear all boosts on death
        char.clearStatModifiers();
        char.clearBuffs();
        setActivePrayers([]);
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

        const expandedItems: { item: InventorySlot; from: 'inventory' | keyof Equipment }[] = [];

        // Expand inventory items
        inv.inventory.forEach(slot => {
            if (slot) {
                for (let i = 0; i < slot.quantity; i++) {
                    expandedItems.push({ item: { ...slot, quantity: 1 }, from: 'inventory' });
                }
            }
        });

        // Expand equipment items
        (Object.keys(inv.equipment) as Array<keyof Equipment>).forEach(slotKey => {
            const slot = inv.equipment[slotKey];
            if (slot) {
                for (let i = 0; i < slot.quantity; i++) {
                    expandedItems.push({ item: { ...slot, quantity: 1 }, from: slotKey });
                }
            }
        });

        // Sort by single item value, descending
        expandedItems.sort((a, b) => (ITEMS[b.item.itemId]?.value ?? 0) - (ITEMS[a.item.itemId]?.value ?? 0));

        const keptSingleItems = expandedItems.slice(0, 3);
        const droppedSingleItems = expandedItems.slice(3);

        // --- Process Kept Items ---
        const newInventory: (InventorySlot | null)[] = new Array(INVENTORY_CAPACITY).fill(null);
        const newEquipment: Equipment = { weapon: null, shield: null, head: null, body: null, legs: null, ammo: null, gloves: null, boots: null, cape: null, necklace: null, ring: null };

        let invIndex = 0;
        const equipmentSlotsFilled: Set<keyof Equipment> = new Set();
        
        keptSingleItems.forEach(singleItem => {
            const { item, from } = singleItem;
            const itemData = ITEMS[item.itemId];
        
            if (from !== 'inventory' && !equipmentSlotsFilled.has(from as keyof Equipment)) {
                const slotKey = from as keyof Equipment;
                if (newEquipment[slotKey] === null) {
                    newEquipment[slotKey] = JSON.parse(JSON.stringify(item));
                    equipmentSlotsFilled.add(slotKey);
                    return;
                }
            }
            
            if (itemData.stackable || item.noted) {
                const existingStack = newInventory.find(i => 
                    i?.itemId === item.itemId &&
                    !!i.noted === !!item.noted &&
                    i.nameOverride === item.nameOverride &&
                    JSON.stringify(i.statsOverride) === JSON.stringify(item.statsOverride)
                );
                if (existingStack) {
                    existingStack.quantity += 1;
                } else if (invIndex < INVENTORY_CAPACITY) {
                    newInventory[invIndex++] = JSON.parse(JSON.stringify(item));
                }
            } else {
                if (invIndex < INVENTORY_CAPACITY) {
                    newInventory[invIndex++] = JSON.parse(JSON.stringify(item));
                }
            }
        });

        // --- Process Dropped Items ---
        const droppedConsolidated: Record<string, InventorySlot> = {};
        droppedSingleItems.forEach(singleItem => {
            const { item } = singleItem;
            const itemData = ITEMS[item.itemId];
            const key = `${item.itemId}:${!!item.noted}:${item.nameOverride || ''}:${JSON.stringify(item.statsOverride) || ''}`;

            if (itemData.stackable || item.noted) {
                if (droppedConsolidated[key]) {
                    droppedConsolidated[key].quantity += 1;
                } else {
                    droppedConsolidated[key] = JSON.parse(JSON.stringify(item));
                }
            } else {
                const uniqueKey = key + Math.random();
                droppedConsolidated[uniqueKey] = JSON.parse(JSON.stringify(item));
            }
        });

        const lostCoins = inv.coins;
        if (lostCoins > 0) {
            onItemDropped({ itemId: 'coins', quantity: lostCoins }, dropPoiId, true);
        }
        Object.values(droppedConsolidated).forEach(itemStack => {
            onItemDropped(itemStack, dropPoiId, true);
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
        char.setCurrentPrayer(char.maxPrayer);
        addLog(`You have died! Your 3 most valuable items have been kept. The rest, including ${lostCoins.toLocaleString()} coins, have been dropped at ${POIS[dropPoiId].name}. You have 10 minutes of in-game time to retrieve them.`);

    }, [skilling, interactQuest, ui, session, char, inv, addLog, playerQuests, onItemDropped, setWorldState, playerType, slotId, onReturnToMenu, repeatableQuests, setDynamicActivities, worldState, onResetGame, setActivePrayers]);

    return { handlePlayerDeath };
};
