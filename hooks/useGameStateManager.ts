import { useState, useEffect, useCallback } from 'react';
import { saveGameState, loadGameState, deleteGameState } from '../db';
import { ALL_SKILLS, REPEATABLE_QUEST_POOL, ITEMS, MONSTERS, SPELLS } from '../constants';
import { POIS } from '../data/pois';
import { CombatStance, PlayerSlayerTask, GeneratedRepeatableQuest, InventorySlot, WorldState, Spell } from '../types';
import { useUIState } from './useUIState';

// Define the shape of the game state
type GameState = typeof defaultState;

const defaultState = {
    username: '',
    skills: ALL_SKILLS,
    inventory: [],
    bank: [],
    coins: 0,
    equipment: { weapon: null, shield: null, head: null, body: null, legs: null, ammo: null, gloves: null, boots: null, cape: null, necklace: null, ring: null },
    combatStance: CombatStance.Accurate,
    currentHp: 10,
    currentPoiId: 'enclave_start',
    playerQuests: [],
    lockedPois: Object.keys(POIS).filter(id => !!POIS[id].unlockRequirement),
    clearedSkillObstacles: [],
    resourceNodeStates: {},
    monsterRespawnTimers: {},
    repeatableQuestsState: {
        boards: {},
        activePlayerQuest: null,
        nextResetTimestamp: Date.now() + 30 * 60 * 1000,
        completedQuestIds: [],
        boardCompletions: {},
    },
    slayerTask: null as PlayerSlayerTask | null,
    tutorialStage: 0,
    worldState: { windmillFlour: 0, deathMarker: null } as WorldState,
    autocastSpell: null as Spell | null,
};

const validateAndMergeState = (parsedData: any): GameState => {
    const validatedState: GameState & { skills: any[]; playerQuests: any[], worldState: WorldState } = { ...defaultState };
    if (typeof parsedData.username === 'string') validatedState.username = parsedData.username;
    if (Array.isArray(parsedData.skills) && parsedData.skills.length > 0) validatedState.skills = parsedData.skills;
    
    // Potion Migration Logic
    const migratePotions = (slots: (InventorySlot | null)[]): (InventorySlot | null)[] => {
        if (!slots) return [];
        return slots.map(slot => {
            if (!slot) return null;
            const itemData = ITEMS[slot.itemId];
            // If it's a potion that is now doseable, but this save entry doesn't have the 'doses' property, it's an old item.
            if (itemData?.doseable && typeof slot.doses === 'undefined') {
                // Convert it to a 3-dose version.
                return { ...slot, doses: 3 };
            }
            return slot;
        });
    };

    if (Array.isArray(parsedData.inventory)) {
        validatedState.inventory = migratePotions(parsedData.inventory);
    }
    if (Array.isArray(parsedData.bank)) {
        validatedState.bank = migratePotions(parsedData.bank);
    }
    
    if (typeof parsedData.coins === 'number') validatedState.coins = parsedData.coins;
    if (parsedData.equipment && typeof parsedData.equipment === 'object') validatedState.equipment = { ...defaultState.equipment, ...parsedData.equipment };
    if (parsedData.combatStance && Object.values(CombatStance).includes(parsedData.combatStance)) validatedState.combatStance = parsedData.combatStance;
    if (typeof parsedData.currentHp === 'number') validatedState.currentHp = parsedData.currentHp;
    if (parsedData.currentPoiId && POIS[parsedData.currentPoiId]) validatedState.currentPoiId = parsedData.currentPoiId;
    if (Array.isArray(parsedData.playerQuests)) validatedState.playerQuests = parsedData.playerQuests;
    if (typeof parsedData.tutorialStage === 'number') validatedState.tutorialStage = parsedData.tutorialStage;
    if (parsedData.autocastSpell && SPELLS.find(s => s.id === (parsedData.autocastSpell as Spell).id)) {
        validatedState.autocastSpell = parsedData.autocastSpell;
    }

    if (Array.isArray(parsedData.lockedPois)) {
        validatedState.lockedPois = parsedData.lockedPois;
    } else if (Array.isArray(parsedData.unlockedPois)) { // Migration logic for old saves
        const allPoisWithRequirements = Object.keys(POIS).filter(id => POIS[id].unlockRequirement);
        validatedState.lockedPois = allPoisWithRequirements.filter(id => !parsedData.unlockedPois.includes(id));
    }
    
    if(Array.isArray(parsedData.clearedSkillObstacles)) validatedState.clearedSkillObstacles = parsedData.clearedSkillObstacles;
    if (parsedData.resourceNodeStates) validatedState.resourceNodeStates = parsedData.resourceNodeStates;
    if (parsedData.monsterRespawnTimers) validatedState.monsterRespawnTimers = parsedData.monsterRespawnTimers;

    if (parsedData.repeatableQuestsState) {
        const boards = parsedData.repeatableQuestsState.boards ?? {};
        const inflatedBoards: Record<string, GeneratedRepeatableQuest[]> = {};

        for (const boardId in boards) {
            inflatedBoards[boardId] = boards[boardId].map((quest: any) => {
                if (quest.title && quest.description) return quest; // Already inflated (very old save format)

                const baseQuest = REPEATABLE_QUEST_POOL.find(q => q.id === quest.id);
                if (!baseQuest) return null;

                let finalCoinReward = quest.finalCoinReward;
                let finalXpAmount = quest.finalXpAmount;

                // Migration: If finalCoinReward is missing, it's an old save state. Recalculate.
                if (finalCoinReward === undefined || finalXpAmount === undefined) {
                    if (baseQuest.type === 'gather') {
                        const itemValue = ITEMS[baseQuest.target.itemId!]?.value ?? 1;
                        finalCoinReward = Math.ceil(quest.requiredQuantity * itemValue * 0.4);
                        finalXpAmount = quest.requiredQuantity * baseQuest.xpReward.amount;
                    } else if (baseQuest.type === 'kill') {
                        finalCoinReward = baseQuest.baseCoinReward * quest.requiredQuantity;
                        const monster = MONSTERS[baseQuest.target.monsterId!];
                        finalXpAmount = monster
                            ? monster.maxHp * quest.requiredQuantity
                            : baseQuest.xpReward.amount * quest.requiredQuantity;
                    } else { // 'interact'
                        finalCoinReward = baseQuest.baseCoinReward;
                        // Interact XP is complex and was likely saved correctly. Use base value as a fallback.
                        finalXpAmount = quest.finalXpAmount ?? baseQuest.xpReward.amount;
                    }
                }

                const inflatedQuest: GeneratedRepeatableQuest = {
                    ...baseQuest,
                    requiredQuantity: quest.requiredQuantity,
                    finalCoinReward: finalCoinReward,
                };
                
                // Use the calculated or existing value for XP.
                inflatedQuest.xpReward = { ...baseQuest.xpReward, amount: finalXpAmount };

                return inflatedQuest;
            }).filter(Boolean);
        }
        
        const boardCompletions = parsedData.repeatableQuestsState.boardCompletions ?? {};
        validatedState.repeatableQuestsState = { 
            ...defaultState.repeatableQuestsState, 
            ...parsedData.repeatableQuestsState,
            boards: inflatedBoards,
            boardCompletions,
        };
    }

    if (parsedData.slayerTask) validatedState.slayerTask = parsedData.slayerTask;
    if (parsedData.worldState) {
        if (typeof parsedData.worldState.windmillFlour === 'number') {
            validatedState.worldState.windmillFlour = parsedData.worldState.windmillFlour;
        }
        if (parsedData.worldState.deathMarker) {
             validatedState.worldState.deathMarker = parsedData.worldState.deathMarker;
        }
    }

    return validatedState;
};

export const useGameStateManager = (ui: ReturnType<typeof useUIState>) => {
    const [initialState, setInitialState] = useState<GameState | null>(null);
    const [gameKey, setGameKey] = useState(0); // Used to force-remount the Game component

    const parseSaveData = useCallback((data: string): GameState | null => {
        try {
            const trimmedData = data.trim();
            // New "SAVE" prefixed format
            if (trimmedData.startsWith('SAVE')) {
                const base64Data = trimmedData.substring(4);
                try {
                    const jsonString = atob(base64Data); // Decode from Base64
                    const parsedData = JSON.parse(jsonString);
                    if (!parsedData.skills || !parsedData.inventory || typeof parsedData.coins === 'undefined') {
                        throw new Error("Invalid save file format.");
                    }
                    return validateAndMergeState(parsedData);
                } catch (error) {
                    console.error("Failed to parse obfuscated save data:", error);
                    return null;
                }
            } 
            // Legacy plain JSON format for backward compatibility
            else if (trimmedData.startsWith('{')) {
                try {
                    const parsedData = JSON.parse(trimmedData);
                    if (!parsedData.skills || !parsedData.inventory || typeof parsedData.coins === 'undefined') {
                        throw new Error("Invalid save file format.");
                    }
                    return validateAndMergeState(parsedData);
                } catch (error) {
                    console.error("Failed to parse legacy JSON save data:", error);
                    return null;
                }
            }
            // Handle the bugged `s4Ve` prefix from a previous version, just in case.
            else if (trimmedData.startsWith('s4Ve')) {
                 const base64Data = trimmedData.substring(4);
                try {
                    const jsonString = atob(base64Data); // Decode from Base64
                    const parsedData = JSON.parse(jsonString);
                    if (!parsedData.skills || !parsedData.inventory || typeof parsedData.coins === 'undefined') {
                        throw new Error("Invalid save file format.");
                    }
                    return validateAndMergeState(parsedData);
                } catch (error) {
                    console.error("Failed to parse old obfuscated save data:", error);
                    return null;
                }
            }
            else {
                 console.error("Unknown save format.");
                 return null;
            }
        } catch (error) {
            console.error("Failed to parse save data:", error);
            return null;
        }
    }, []);
    

    const handleExportSave = useCallback((gameState: object) => {
        try {
            const dataStr = JSON.stringify(gameState, null, 2);
            const base64Str = btoa(dataStr); // Encode to Base64
            const finalExportStr = 'SAVE' + base64Str; // Prepend "SAVE"
            ui.setExportData({ data: finalExportStr });
        } catch (error) {
            console.error("Failed to serialize save data:", error);
        }
    }, [ui]);

    const handleImportSave = useCallback(() => {
        ui.setIsImportModalOpen(true);
    }, [ui]);
    
    const startNewGame = useCallback(async (username: string) => {
        ui.closeAllModals();
        await deleteGameState();
        const newGame = { ...defaultState, username };
        await saveGameState(newGame);
        setInitialState(newGame);
        setGameKey(k => k + 1);
    }, [ui]);
    
    const loadImportedState = useCallback(async (newState: GameState) => {
        ui.closeAllModals();
        await saveGameState(newState);
        setInitialState(newState);
        setGameKey(k => k + 1);
    }, [ui]);

    const updateUsernameAndSave = useCallback(async (username: string) => {
        if (initialState) {
            const newState = { ...initialState, username };
            await saveGameState(newState);
            setInitialState(newState);
        }
    }, [initialState]);

    useEffect(() => {
        const performLoad = async () => {
            let stateToLoad: GameState = { ...defaultState };
            try {
                const savedData = await loadGameState();
                if (savedData) {
                    // Handle migration of old save formats
                    if (savedData.activityLog || savedData.unlockedPois) {
                        const migratedState = { ...savedData };
                        delete migratedState.activityLog;
                        if (savedData.unlockedPois) {
                            const allPoisWithRequirements = Object.keys(POIS).filter(id => POIS[id].unlockRequirement);
                            migratedState.lockedPois = allPoisWithRequirements.filter(id => !savedData.unlockedPois.includes(id));
                            delete migratedState.unlockedPois;
                        }
                        await saveGameState(migratedState);
                    }
                    stateToLoad = validateAndMergeState(savedData);
                }
            } catch (error) {
                console.error("Failed to load saved game:", error);
            }
            setInitialState(stateToLoad);
        };
        performLoad();
    }, []); // Empty dependency array means this runs once on mount

    return {
        initialState,
        gameKey,
        handleExportSave,
        handleImportSave,
        parseSaveData,
        startNewGame,
        updateUsernameAndSave,
        loadImportedState,
    };
};