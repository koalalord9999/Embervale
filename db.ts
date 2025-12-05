declare const Dexie: any;

import { POIS } from './constants';
import { PlayerSkill, SkillName } from './types';

const DB_NAME = 'EmbruneDB';

const db = new Dexie(DB_NAME);

// V1 Schema (for migration)
db.version(1).stores({
    saveData: '&key',
});

// V2 Schema (new save slot system)
db.version(2).stores({
    saveData: null, // removing old table
    slots: '&slotId', // New table for save slots
    meta: '&key',     // New table for metadata like migration status
}).upgrade(async (tx: any) => {
    // Migration logic from v1 to v2. If saveData exists, move it.
    const oldSave = await tx.table('saveData').get('embrune_save');
    if (oldSave && oldSave.value) {
        const state = oldSave.value;
        const metadata = state ? {
            username: state.username,
            playerType: state.playerType,
            combatLevel: state.combatLevel,
            totalLevel: state.skills.reduce((sum: number, s: any) => sum + s.level, 0),
            currentPoiName: state.currentPoiId ? (POIS[state.currentPoiId]?.name ?? 'Unknown') : 'Unknown',
            isDead: state.isDead ?? false,
        } : null;

        await tx.table('slots').put({
            slotId: 0,
            data: state,
            metadata: metadata,
            updatedAt: new Date(),
            createdAt: new Date(),
        });
    }

    // Initialize remaining empty slots (Now 6 slots)
    for (let i = (oldSave ? 1 : 0); i < 6; i++) {
        const existing = await tx.table('slots').get(i);
        if (!existing) {
            await tx.table('slots').put({
                slotId: i, data: null, metadata: null,
                createdAt: undefined, updatedAt: new Date()
            });
        }
    }
    await tx.table('meta').put({ key: 'migrationComplete', value: true });
    // The old `saveData` table is automatically removed by Dexie because it's set to `null` in the new schema version.
});


// --- New Slot System Functions ---

/**
 * Saves a game state to a specific slot.
 * @param slotId The ID of the slot to save to.
 * @param state The full game state object.
 */
export const saveSlotState = async (slotId: number, state: any): Promise<void> => {
    try {
        await db.open();
        const existingSlot = await (db as any).slots.get(slotId);
        const isNewCharacter = state && !existingSlot?.data;

        await (db as any).slots.put({
            slotId: slotId,
            data: state,
            metadata: state ? {
                username: state.username,
                playerType: state.playerType,
                combatLevel: state.combatLevel, // This should be calculated and passed in the state object
                totalLevel: state.skills.reduce((sum: number, s: any) => sum + s.level, 0),
                currentPoiName: state.currentPoiId ? (POIS[state.currentPoiId]?.name ?? 'Unknown') : 'Unknown',
                isDead: state.isDead ?? false,
            } : null,
            updatedAt: new Date(),
            createdAt: isNewCharacter ? new Date() : existingSlot?.createdAt,
        });
    } catch (error) {
        console.error(`Failed to save to slot ${slotId}:`, error);
    }
};

/**
 * Loads all slots for the selection screen.
 * @returns An array of all saved slots.
 */
export const loadAllSlots = async (): Promise<any[]> => {
    try {
        await db.open(); // Ensure DB is open
        const slots = await (db as any).slots.toArray();
        // Ensure we return 6 slots even if DB only has 5 from previous version
        const allSlots = Array.from({ length: 6 }, (_, i) => {
            return slots.find(s => s.slotId === i) || { slotId: i, data: null, metadata: null };
        });
        return allSlots;
    } catch (error) {
        console.error("Failed to load all slots:", error);
        return Array.from({ length: 6 }, (_, i) => ({ slotId: i, data: null, metadata: null }));
    }
};

/**
 * Loads the full game state from a specific slot.
 * @param slotId The ID of the slot to load.
 * @returns The full game state object or null.
 */
export const loadSlotState = async (slotId: number): Promise<any | null> => {
    try {
        await db.open();
        const slot = await (db as any).slots.get(slotId);
        return slot?.data ?? null;
    } catch (error) {
        console.error(`Failed to load slot ${slotId}:`, error);
        return null;
    }
};

/**
 * Deletes a specific slot by nullifying its data.
 * @param slotId The ID of the slot to delete.
 */
export const deleteSlot = async (slotId: number): Promise<void> => {
    try {
        await (db as any).slots.put({
            slotId: slotId,
            data: null,
            metadata: null,
            createdAt: undefined, // Reset createdAt
            updatedAt: new Date()
        });
    } catch (error) {
        console.error(`Failed to delete slot ${slotId}:`, error);
    }
};

// --- Meta Table Functions ---
export const getMetaValue = async (key: string): Promise<any | null> => {
    try {
        await db.open();
        const meta = await (db as any).meta.get(key);
        return meta?.value ?? null;
    } catch (error) {
        console.error(`Failed to get meta value for key ${key}:`, error);
        return null;
    }
};

export const setMetaValue = async (key: string, value: any): Promise<void> => {
    try {
        await db.open();
        await (db as any).meta.put({ key, value });
    } catch (error) {
        console.error(`Failed to set meta value for key ${key}:`, error);
    }
};