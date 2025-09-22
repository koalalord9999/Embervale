

declare const Dexie: any;

const NEW_DB_NAME = 'EmbruneDB';
const OLD_DB_NAME = 'EmbervaleDB';
const NEW_SAVE_KEY = 'embrune_save';
const OLD_SAVE_KEY = 'embervale_save';

const db = new Dexie(NEW_DB_NAME);

db.version(1).stores({
    saveData: '&key', // Primary key is 'key'
});

/**
 * Saves the entire game state to IndexedDB using the new key.
 * @param state The game state object to save.
 */
export const saveGameState = async (state: object): Promise<void> => {
    try {
        await (db as any).saveData.put({ key: NEW_SAVE_KEY, value: state });
    } catch (error) {
        console.error("Failed to save game to IndexedDB:", error);
    }
};

/**
 * Loads the game state from IndexedDB. It first checks for the new save,
 * and if not found, attempts to migrate data from the old save.
 * @returns The saved game state object, or null if not found.
 */
export const loadGameState = async (): Promise<any | null> => {
    try {
        // 1. Try loading from the new database
        const savedData = await (db as any).saveData.get(NEW_SAVE_KEY);
        if (savedData) {
            return savedData.value;
        }

        // 2. If not found, try to migrate from the old database
        console.log("No current save found, checking for old 'Embervale' save to migrate...");
        const oldDb = new Dexie(OLD_DB_NAME);
        // We must define the schema for Dexie to be able to open and read from the old DB.
        oldDb.version(1).stores({ saveData: '&key' });

        const oldSavedData = await (oldDb as any).saveData.get(OLD_SAVE_KEY);
        
        if (oldSavedData && oldSavedData.value) {
            console.log("Old save data found. Migrating...");
            // Save the migrated data to the new database with the new key
            await saveGameState(oldSavedData.value);
            console.log("Migration successful.");
            
            // Clean up the old database
            oldDb.close();
            await Dexie.delete(OLD_DB_NAME);
            console.log("Old database deleted.");

            return oldSavedData.value;
        }

        oldDb.close();
        console.log("No old save data found to migrate.");
        return null;

    } catch (error) {
        // This catch block handles errors, such as the old DB not existing.
        // This is expected for new players and won't cause any issues.
        console.log("Could not access old database for migration (this is normal for new players):", error);
        return null;
    }
};

/**
 * Deletes the saved game state from IndexedDB.
 */
export const deleteGameState = async (): Promise<void> => {
    try {
        await (db as any).saveData.delete(NEW_SAVE_KEY);
    } catch (error) {
        console.error("Failed to delete game from IndexedDB:", error);
    }
};