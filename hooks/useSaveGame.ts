import { useEffect, useRef } from 'react';
import { saveSlotState } from '../db';

export const useSaveGame = (gameState: any, slotId: number) => {
    const isInitialMount = useRef(true);
    const saveTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = window.setTimeout(() => {
            if (gameState) {
                saveSlotState(slotId, gameState);
            }
        }, 1000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [gameState, slotId]);
};
