

import { useState, useEffect, useCallback } from 'react';
import { saveSlotState, loadAllSlots, deleteSlot, loadSlotState } from '../db';
import { ALL_SKILLS } from '../constants';
import { POIS } from '../data/pois';
import { CombatStance, PlayerSlayerTask, WorldState, Spell, BankTab, ActiveStatModifier, ActiveBuff, PlayerType, Slot } from '../types';
import { useUIState } from './useUIState';

const defaultSettings = {
    showTooltips: true,
    showXpDrops: true,
    confirmValuableDrops: true,
    valuableDropThreshold: 1000,
    showMinimapHealth: false,
    showCombatPlayerHealth: false,
    showCombatEnemyHealth: false,
    showHitsplats: true,
    isOneClickMode: false,
};

const defaultState = {
    username: '',
    playerType: PlayerType.Normal,
    skills: ALL_SKILLS,
    inventory: [],
    bank: [{ id: 0, name: 'Main', icon: null, items: [] }] as BankTab[],
    coins: 0,
    equipment: { weapon: null, shield: null, head: null, body: null, legs: null, ammo: null, gloves: null, boots: null, cape: null, necklace: null, ring: null },
    combatStance: CombatStance.Accurate,
    currentHp: 10,
    currentPoiId: 'tutorial_entrance',
    playerQuests: [{ questId: 'embrune_101', currentStage: 0, progress: 0, isComplete: false }],
    lockedPois: Object.keys(POIS).filter(id => !!POIS[id].unlockRequirement),
    clearedSkillObstacles: [],
    resourceNodeStates: {},
    monsterRespawnTimers: {},
    groundItems: {},
    activityLog: [] as string[],
    repeatableQuestsState: {
        boards: {},
        activePlayerQuest: null,
        nextResetTimestamp: Date.now() + 30 * 60 * 1000,
        completedQuestIds: [],
        boardCompletions: {},
    },
    slayerTask: null as PlayerSlayerTask | null,
    worldState: { windmillFlour: 0, deathMarker: null, bankPlaceholders: false, hpBoost: null } as WorldState,
    autocastSpell: null as Spell | null,
    settings: defaultSettings,
    statModifiers: [] as ActiveStatModifier[],
    activeBuffs: [] as ActiveBuff[],
    isDead: false,
};

// Type for the full game state
type GameState = typeof defaultState;

/**
 * Merges a loaded save state with the default state to ensure compatibility.
 * This adds any new properties from `defaultState` that might be missing in `loadedState`.
 * @param loadedState The game state loaded from the database or an import.
 * @returns A fully hydrated and safe-to-use game state object.
 */
const hydrateGameState = (loadedState: any): GameState => {
    if (!loadedState || typeof loadedState !== 'object') {
        return { ...defaultState };
    }

    const hydrated = { ...defaultState, ...loadedState };

    // Deep merge for nested objects
    hydrated.settings = { ...defaultState.settings, ...(loadedState.settings || {}) };
    hydrated.worldState = { ...defaultState.worldState, ...(loadedState.worldState || {}) };
    hydrated.repeatableQuestsState = { ...defaultState.repeatableQuestsState, ...(loadedState.repeatableQuestsState || {}) };
    hydrated.equipment = typeof loadedState.equipment === 'object' && loadedState.equipment !== null ? { ...defaultState.equipment, ...loadedState.equipment } : defaultState.equipment;

    // FIX: Detect and reset corrupted repeatable quest board data from old saves.
    if (hydrated.repeatableQuestsState.boards) {
        const boards = hydrated.repeatableQuestsState.boards;
        const firstBoardKey = Object.keys(boards)[0];
        if (firstBoardKey) {
            const firstBoard = boards[firstBoardKey];
            if (firstBoard && firstBoard.length > 0) {
                const firstQuest: any = firstBoard[0];
                // Check for the malformed structure by looking for a property that shouldn't be there
                // and the absence of a property that should (`xpReward` object).
                if (firstQuest && firstQuest.hasOwnProperty('finalXpAmount') && !firstQuest.hasOwnProperty('xpReward')) {
                    console.warn("Detected corrupted repeatable quest board data. Resetting boards to prevent crash.");
                    hydrated.repeatableQuestsState.boards = {};
                }
            }
        }
    }

    // Ensure array properties are arrays, falling back to default if they're missing or not arrays.
    const arrayKeys: (keyof GameState)[] = [
        'skills', 'inventory', 'bank', 'playerQuests', 'lockedPois', 
        'clearedSkillObstacles', 'statModifiers', 'activeBuffs', 'activityLog'
    ];
    arrayKeys.forEach(key => {
        const loadedValue = loadedState[key];
        (hydrated as any)[key] = Array.isArray(loadedValue) ? loadedValue : (defaultState as any)[key];
    });
    
    // Ensure object properties are objects
    const objectKeys: (keyof GameState)[] = [
        'resourceNodeStates', 'monsterRespawnTimers', 'groundItems'
    ];
    objectKeys.forEach(key => {
        const loadedValue = loadedState[key];
        (hydrated as any)[key] = typeof loadedValue === 'object' && loadedValue !== null ? loadedValue : (defaultState as any)[key];
    });
    
    // Ensure nullable properties are handled (if they exist in loaded but are undefined, fall back to default)
    hydrated.slayerTask = loadedState.slayerTask === undefined ? defaultState.slayerTask : loadedState.slayerTask;
    hydrated.autocastSpell = loadedState.autocastSpell === undefined ? defaultState.autocastSpell : loadedState.autocastSpell;

    return hydrated;
};


export const useSaveSlotManager = (ui: ReturnType<typeof useUIState>) => {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [gameKey, setGameKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const parseAndValidateSave = (data: string): any | null => {
        try {
            if (data.startsWith('s4V')) {
                const base64Data = data.substring(3);
                const jsonString = atob(base64Data);
                const parsed = JSON.parse(jsonString);
                return parsed.username ? parsed : null; // Basic validation
            }
            return null;
        } catch (error) {
            console.error("Failed to parse save data:", error);
            return null;
        }
    };

    const refreshSlots = useCallback(async () => {
        const loadedSlots = await loadAllSlots();
        setSlots(loadedSlots);
    }, []);

    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            // The Dexie upgrade function handles migration automatically.
            // We just need to load the slots.
            await refreshSlots();
            setIsLoading(false);
        };
        initialize();
    }, [refreshSlots]);

    const loadGameForSlot = useCallback(async (slotId: number): Promise<any | null> => {
        const gameState = await loadSlotState(slotId);
        if (gameState) {
            setGameKey(k => k + 1);
            return hydrateGameState(gameState);
        }
        return null;
    }, []);

    const createNewCharacter = useCallback(async (slotId: number, username: string, playerType: PlayerType): Promise<any | null> => {
        const newState = { ...defaultState, username, playerType };
        await saveSlotState(slotId, newState);
        await refreshSlots();
        return newState;
    }, [refreshSlots]);

    const deleteCharacter = useCallback(async (slotId: number) => {
        await deleteSlot(slotId);
        await refreshSlots();
    }, [refreshSlots]);

    const exportSlot = useCallback(async (slotId: number) => {
        const gameState = await loadSlotState(slotId);
        if (gameState) {
            try {
                const dataStr = JSON.stringify(gameState);
                const base64Str = btoa(dataStr);
                const finalExportStr = 's4V' + base64Str;
                ui.setExportData({ data: finalExportStr, title: 'Export Character' });
            } catch (error) {
                console.error("Failed to serialize save data:", error);
            }
        }
    }, [ui]);

    const importToSlot = useCallback((slotId: number, data: string): boolean => {
        const parsedData = parseAndValidateSave(data);
        if (parsedData) {
            const hydratedData = hydrateGameState(parsedData);
            ui.setConfirmationPrompt({
                message: `Are you sure you want to import this save into Slot ${slotId + 1}? This will overwrite any existing data in this slot.`,
                onConfirm: async () => {
                    await saveSlotState(slotId, hydratedData);
                    await refreshSlots();
                    alert(`Save data successfully imported into Slot ${slotId + 1}.`);
                }
            });
            return true;
        }
        return false;
    }, [refreshSlots, ui]);
    
    return {
        slots,
        gameKey,
        loadGameForSlot,
        createNewCharacter,
        deleteCharacter,
        exportSlot,
        importToSlot,
        isLoading,
    };
};
