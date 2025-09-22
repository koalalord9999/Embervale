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
    tutorialStage: number;
}

export const usePlayerDeath = (deps: PlayerDeathDependencies) => {
    const { skilling, interactQuest, ui, session, char, inv, addLog, tutorialStage } = deps;

    const handlePlayerDeath = useCallback(() => {
        skilling.stopSkilling();
        interactQuest.handleCancelInteractQuest();
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);

        const isTutorialActive = tutorialStage >= 0;
        let respawnPoi = isTutorialActive ? 'enclave_start' : 'meadowdale_square';
        
        // If the player dies late in the tutorial, respawn them at the end to avoid a long walk back.
        if (isTutorialActive && tutorialStage >= 22) {
            respawnPoi = 'enclave_departure_point';
        }

        session.setCurrentPoiId(respawnPoi);
        char.setCurrentHp(char.maxHp);

        if (isTutorialActive) {
            addLog("You have been defeated! Don't worry, you've been safely returned. In the main world, death is more costly, usually causing you to lose half of your coins.");
        } else {
            const coinsLost = Math.floor(inv.coins / 2);
            inv.setCoins(c => c - coinsLost);
            addLog(`You have died and respawned in Meadowdale, losing ${coinsLost} coins.`);
        }
    }, [session, char, inv, addLog, ui, skilling, interactQuest, tutorialStage]);

    return { handlePlayerDeath };
};
