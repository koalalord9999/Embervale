

import { useMemo, useCallback } from 'react';
// Fix: Corrected POIS import path.
import { REGIONS } from '../constants';
import { POIS } from '../data/pois';
import { useUIState } from './useUIState';
import { useSkilling } from './useSkilling';
import { useInteractQuest } from './useInteractQuest';
import { useGameSession } from './useGameSession';

interface NavigationDependencies {
    session: ReturnType<typeof useGameSession>;
    lockedPois: string[];
    clearedSkillObstacles: string[];
    addLog: (message: string) => void;
    isBusy: boolean;
    isInCombat: boolean;
    ui: ReturnType<typeof useUIState>;
    skilling: ReturnType<typeof useSkilling>;
    interactQuest: ReturnType<typeof useInteractQuest>;
}

export const useNavigation = (deps: NavigationDependencies) => {
    const { session, lockedPois, clearedSkillObstacles, addLog, isBusy, isInCombat, ui, skilling, interactQuest } = deps;

    const reachablePois = useMemo(() => {
        const queue: string[] = [];
        const visited: Set<string> = new Set();
    
        if (!lockedPois.includes(session.currentPoiId)) {
            queue.push(session.currentPoiId);
            visited.add(session.currentPoiId);
        } else {
            return []; // Should not happen if player is at a valid POI
        }
    
        let head = 0;
        while(head < queue.length) {
            const currentId = queue[head++];
            const currentPoi = POIS[currentId];
    
            if (!currentPoi) continue;
    
            currentPoi.connections.forEach(connId => {
                if (visited.has(connId)) return;
    
                const destinationPoi = POIS[connId];
                if (!destinationPoi || lockedPois.includes(connId)) return;
    
                // Check obstacle from current -> destination
                const obstacleId = `${currentId}-${connId}`;
                const requirement = currentPoi.connectionRequirements?.[connId];
                if (requirement && !clearedSkillObstacles.includes(obstacleId)) {
                    return; // Path is blocked
                }
    
                // If path is clear, add to queue and visited
                visited.add(connId);
                queue.push(connId);
            });
        }
        return Array.from(visited);
    }, [session.currentPoiId, lockedPois, clearedSkillObstacles]);

    const navigateToPoi = useCallback((poiId: string) => {
        // Stop any ongoing player actions before moving.
        ui.closeAllModals();
        skilling.stopSkilling();
        interactQuest.handleCancelInteractQuest();
        
        // The single source of truth for location is updated.
        // The UI will derive the correct map view from this change.
        session.setCurrentPoiId(poiId);
    }, [ui, skilling, interactQuest, session]);

    const handleNavigate = useCallback((poiId: string) => {
        if (isInCombat) {
            addLog("You cannot travel while in combat.");
            return;
        }
        if (isBusy) {
            addLog("You are busy and cannot travel now.");
            return;
        }

        const isAdjacent = POIS[session.currentPoiId]?.connections.includes(poiId);

        if (isAdjacent) {
            navigateToPoi(poiId);
        } else if (poiId !== session.currentPoiId) {
            // Provide more specific feedback if the location is known but not adjacent
            if (reachablePois.includes(poiId)) {
                addLog("You can't get there from here. You must travel to an adjacent location first.");
            } else {
                addLog("You can't get there from here.");
            }
        }
    }, [addLog, isInCombat, isBusy, reachablePois, navigateToPoi, session.currentPoiId]);

    const handleForcedNavigate = useCallback((poiId: string) => {
        if (isInCombat) { addLog("You cannot travel while in combat."); return; }
        if (isBusy) { addLog("You are busy and cannot travel now."); return; }
        navigateToPoi(poiId);
    }, [isInCombat, isBusy, addLog, navigateToPoi]);

    return {
        reachablePois,
        handleNavigate,
        handleForcedNavigate,
    };
};
