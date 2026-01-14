import { useMemo, useCallback } from 'react';
import { REGIONS, ITEMS } from '../constants';
import { POIS } from '../data/pois';
import { useUIState } from './useUIState';
import { useSkilling } from './useSkilling';
import { useInteractQuest } from './useInteractQuest';
import { useGameSession } from './useGameSession';
import { ActiveBuff, Equipment, Item } from '../types';
import { SKILL_ICONS } from '../constants';

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
    isStunned: boolean;
    isRunToggled: boolean;
    runEnergy: number;
    setRunEnergy: React.Dispatch<React.SetStateAction<number>>;
    setIsTraveling: React.Dispatch<React.SetStateAction<boolean>>;
    setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
    activeBuffs: ActiveBuff[];
    equipment: Equipment;
}

export const useNavigation = (deps: NavigationDependencies) => {
    const { session, lockedPois, clearedSkillObstacles, addLog, isBusy, isInCombat, ui, skilling, interactQuest, isStunned, isRunToggled, runEnergy, setRunEnergy, setIsTraveling, setIsResting, activeBuffs, equipment } = deps;

    const isAgilitySetEffectActive = useMemo(() => {
        const requiredItems = ['weightless_hood', 'weightless_tunic', 'weightless_trousers', 'weightless_gloves', 'weightless_boots'];
        const isSetEquipped = requiredItems.every(itemId => {
            const itemData = ITEMS[itemId] as Item | undefined;
            if (!itemData?.equipment) return false;
            const slotKey = itemData.equipment.slot.toLowerCase() as keyof Equipment;
            return equipment[slotKey]?.itemId === itemId;
        });
        const isStaminaActive = activeBuffs.some(b => b.type === 'stamina');
        return isSetEquipped || isStaminaActive;
    }, [equipment, activeBuffs]);

    const reachablePois = useMemo(() => {
        const queue: string[] = [];
        const visited: Set<string> = new Set();
    
        if (!lockedPois.includes(session.currentPoiId)) {
            queue.push(session.currentPoiId);
            visited.add(session.currentPoiId);
        } else {
            return [];
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
    
                const obstacleId = `${currentId}-${connId}`;
                const requirement = currentPoi.connectionRequirements?.[connId];
                if (requirement && !clearedSkillObstacles.includes(obstacleId)) {
                    return;
                }
    
                visited.add(connId);
                queue.push(connId);
            });
        }
        return Array.from(visited);
    }, [session.currentPoiId, lockedPois, clearedSkillObstacles]);

    const navigateToPoi = useCallback((poiId: string) => {
        ui.closeAllModals();
        if (ui.activePanel === 'bank') {
            ui.setActivePanel(null); // This will default to inventory panel
        }
        skilling.stopSkilling();
        interactQuest.handleCancelInteractQuest();
        session.setCurrentPoiId(poiId);
    }, [ui, skilling, interactQuest, session]);

    const handleNavigate = useCallback((poiId: string) => {
        setIsResting(false);
        if (isStunned) {
            addLog("You are stunned and cannot move.");
            return;
        }
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
            const cost = isAgilitySetEffectActive ? 1 : 5;
            if (isRunToggled && runEnergy >= cost) {
                setRunEnergy(re => re - cost);
                navigateToPoi(poiId);
            } else {
                if (isRunToggled && runEnergy < cost) {
                    addLog("You don't have enough run energy.");
                }
                setIsTraveling(true);
                addLog("You begin walking to the next area...");
                setTimeout(() => {
                    navigateToPoi(poiId);
                    setIsTraveling(false);
                }, 1800);
            }
        } else if (poiId !== session.currentPoiId) {
            if (reachablePois.includes(poiId)) {
                addLog("You can't get there from here. You must travel to an adjacent location first.");
            } else {
                addLog("You can't get there from here.");
            }
        }
    }, [addLog, isInCombat, isBusy, reachablePois, navigateToPoi, session.currentPoiId, isStunned, isRunToggled, runEnergy, setRunEnergy, setIsTraveling, setIsResting, isAgilitySetEffectActive]);

    const handleForcedNavigate = useCallback((poiId: string) => {
        if (isStunned) {
            addLog("You are stunned and cannot teleport.");
            return;
        }
        if (isInCombat) {
            addLog("Forcibly ending combat to teleport.");
            ui.setCombatQueue([]);
            ui.setIsMandatoryCombat(false);
        }
        if (isBusy) {
            addLog("Closing modals to teleport.");
            ui.closeAllModals();
        }
        navigateToPoi(poiId);
    }, [isInCombat, isBusy, addLog, navigateToPoi, ui, isStunned]);

    const findShortestPath = useCallback((startId: string, endId: string): string[] | null => {
        if (startId === endId) return [startId];
    
        const queue: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];
        const visited = new Set<string>([startId]);
    
        while (queue.length > 0) {
            const { id: currentId, path: currentPath } = queue.shift()!;
            const currentPoi = POIS[currentId];
    
            if (!currentPoi) continue;
    
            for (const neighborId of currentPoi.connections) {
                if (neighborId === endId) {
                    return [...currentPath, neighborId];
                }
    
                if (!visited.has(neighborId)) {
                    visited.add(neighborId);
                    queue.push({ id: neighborId, path: [...currentPath, neighborId] });
                }
            }
        }
    
        return null; // No path found
    }, []);

    const handleFastTravel = useCallback((destinationPoiId: string) => {
        if (isBusy || isInCombat || isStunned) {
            addLog("You can't travel right now.");
            return;
        }

        const path = findShortestPath(session.currentPoiId, destinationPoiId);

        if (!path || path.length <= 1) {
            return; // No travel needed or no path found
        }

        const hops = path.length - 1;
        const costPerHop = isAgilitySetEffectActive ? 5 : 20;
        const energyCost = hops * costPerHop;
        const travelTime = hops * 200; // in ms

        if (runEnergy < energyCost) {
            addLog(`You don't have enough run energy to travel that far (Cost: ${energyCost}).`);
            return;
        }

        ui.closeAllModals();

        ui.setActiveSingleAction({
            title: "Fast Traveling...",
            iconUrl: SKILL_ICONS.Agility,
            iconClassName: 'filter invert',
            startTime: Date.now(),
            duration: travelTime,
            onComplete: () => {
                setRunEnergy(re => re - energyCost);
                handleForcedNavigate(destinationPoiId);
            }
        });

    }, [isBusy, isInCombat, isStunned, runEnergy, findShortestPath, session.currentPoiId, addLog, ui, isAgilitySetEffectActive, setRunEnergy, handleForcedNavigate]);

    return {
        reachablePois,
        handleNavigate,
        handleForcedNavigate,
        findShortestPath,
        handleFastTravel,
    };
};
