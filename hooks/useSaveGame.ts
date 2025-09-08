

import { useEffect, useRef } from 'react';
import { saveGameState } from '../db';

export const useSaveGame = (gameState: object) => {
    const isInitialMount = useRef(true);

    useEffect(() => {
        // On the very first render of the hook, don't save.
        // This prevents the initial state (especially the default "new game" state
        // after a DB wipe) from being immediately written back to the database,
        // which would cement the data loss. Saving will commence only after the
        // first player action changes the state.
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Debounce saving to improve performance on subsequent state changes.
        const handler = setTimeout(() => {
            saveGameState(gameState);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [gameState]);
};