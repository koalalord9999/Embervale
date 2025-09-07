

declare const Dexie: any;

const db = new Dexie('EmbervaleDB');

db.version(1).stores({
    saveData: '&key', // Primary key is 'key'
});

const SAVE_KEY = 'embervale_save';

/**
 * Saves the entire game state to IndexedDB.
 * @param state The game state object to save.
 */
export const saveGameState = async (state: object): Promise<void> => {
    try {
        await (db as any).saveData.put({ key: SAVE_KEY, value: state });
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
        const savedData = await (db as any).saveData.get(SAVE_KEY);
        return savedData ? savedData.value : null;
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
        await (db as any).saveData.delete(SAVE_KEY);
    } catch (error) {
        console.error("Failed to delete game from IndexedDB:", error);
    }
};
