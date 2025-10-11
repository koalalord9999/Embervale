declare const Dexie: any;

const NEW_DB_NAME = 'EmbruneDB';
const NEW_SAVE_KEY = 'embrune_save';

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
 * Loads the game state from IndexedDB.
 * @returns The saved game state object, or null if not found.
 */
export const loadGameState = async (): Promise<any | null> => {
    try {
        const savedData = await (db as any).saveData.get(NEW_SAVE_KEY);
        if (savedData) {
            return savedData.value;
        }
        return null;
    } catch (error) {
        console.error("Failed to load game from IndexedDB:", error);
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