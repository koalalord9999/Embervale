import { useCallback } from 'react';
import { useSkilling } from './useSkilling';
import { useInteractQuest } from './useInteractQuest';
import { useUIState } from './useUIState';
import { useGameSession } from './useGameSession';
import { useCharacter } from './useCharacter';
import { useInventory } from './useInventory';

interface PlayerDeathDependencies {
    skilling: ReturnType<typeof useSkilling>;
    interactQuest: ReturnType<typeof useInteractQuest>;
    ui: ReturnType<typeof useUIState>;
    session: ReturnType<typeof useGameSession>;
    char: ReturnType<typeof useCharacter>;
    inv: ReturnType<typeof useInventory>;
    addLog: (message: string) => void;
}

export const usePlayerDeath = (deps: PlayerDeathDependencies) => {
    const { skilling, interactQuest, ui, session, char, inv, addLog } = deps;

    const handlePlayerDeath = useCallback(() => {
        skilling.stopSkilling();
        interactQuest.handleCancelInteractQuest();
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);
        // This is a special case navigation that bypasses adjacency check
        session.setCurrentPoiId('meadowdale_square');
        char.setCurrentHp(char.maxHp);
        inv.setCoins(c => Math.floor(c / 2));
        addLog("You have died and respawned in Meadowdale, losing half your coins.");
    }, [session, char, inv, addLog, ui, skilling, interactQuest]);

    return { handlePlayerDeath };
};
