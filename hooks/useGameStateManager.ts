

import { useState, useEffect, useCallback } from 'react';
import { saveGameState, loadGameState, deleteGameState } from '../db';
import { ALL_SKILLS, REPEATABLE_QUEST_POOL, ITEMS, MONSTERS } from '../constants';
import { POIS } from '../data/pois';
import { CombatStance, PlayerSlayerTask, GeneratedRepeatableQuest } from '../types';
import { useUIState } from './useUIState';

// Define the shape of the game state
type GameState = typeof defaultState;

const defaultState = {
    skills: ALL_SKILLS,
    inventory: [{ itemId: 'bronze_axe', quantity: 1 }, { itemId: 'bronze_pickaxe', quantity: 1 }, { itemId: 'beer', quantity: 5 }, { itemId: 'knife', quantity: 1 }],
    bank: [],
    coins: 100,
    equipment: { weapon: null, shield: null, head: null, body: null, legs: null, ammo: null, gloves: null, boots: null, cape: null, necklace: null, ring: null },
    combatStance: CombatStance.Accurate,
    currentHp: 10,
    currentPoiId: 'meadowdale_square',
    playerQuests: [],
    lockedPois: Object.keys(POIS).filter(id => !!POIS[id].unlockRequirement),
    clearedSkillObstacles: [],
    resourceNodeStates: {},
    monsterRespawnTimers: {},
    shopStates: {},
    repeatableQuestsState: {
        boards: {},
        activePlayerQuest: null,
        nextResetTimestamp: Date.now() + 30 * 60 * 1000,
        completedQuestIds: [],
        boardCompletions: {},
    },
    slayerTask: null as PlayerSlayerTask | null,
};

const validateAndMergeState = (parsedData: any): GameState => {
    const validatedState: GameState & { skills: any[]; playerQuests: any[] } = { ...defaultState };
    if (Array.isArray(parsedData.skills) && parsedData.skills.length > 0) validatedState.skills = parsedData.skills;
    if (Array.isArray(parsedData.inventory)) validatedState.inventory = parsedData.inventory;
    if (Array.isArray(parsedData.bank)) validatedState.bank = parsedData.bank;
    if (typeof parsedData.coins === 'number') validatedState.coins = parsedData.coins;
    if (parsedData.equipment && typeof parsedData.equipment === 'object') validatedState.equipment = { ...defaultState.equipment, ...parsedData.equipment };
    if (parsedData.combatStance && Object.values(CombatStance).includes(parsedData.combatStance)) validatedState.combatStance = parsedData.combatStance;
    if (typeof parsedData.currentHp === 'number') validatedState.currentHp = parsedData.currentHp;
    if (parsedData.currentPoiId && POIS[parsedData.currentPoiId]) validatedState.currentPoiId = parsedData.currentPoiId;
    if (Array.isArray(parsedData.playerQuests)) validatedState.playerQuests = parsedData.playerQuests;

    if (Array.isArray(parsedData.lockedPois)) {
        validatedState.lockedPois = parsedData.lockedPois;
    } else if (Array.isArray(parsedData.unlockedPois)) { // Migration logic for old saves
        const allPoisWithRequirements = Object.keys(POIS).filter(id => POIS[id].unlockRequirement);
        validatedState.lockedPois = allPoisWithRequirements.filter(id => !parsedData.unlockedPois.includes(id));
    }
    
    if(Array.isArray(parsedData.clearedSkillObstacles)) validatedState.clearedSkillObstacles = parsedData.clearedSkillObstacles;
    if (parsedData.resourceNodeStates) validatedState.resourceNodeStates = parsedData.resourceNodeStates;
    if (parsedData.monsterRespawnTimers) validatedState.monsterRespawnTimers = parsedData.monsterRespawnTimers;
    if (parsedData.shopStates) validatedState.shopStates = parsedData.shopStates;

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

    return validatedState;
};

export const useGameStateManager = (ui: ReturnType<typeof useUIState>) => {
    const [initialState, setInitialState] = useState<GameState | null>(null);
    const [gameKey, setGameKey] = useState(0); // Used to force-remount the Game component

    const handleExportSave = useCallback((gameState: object) => {
        try {
            const dataStr = JSON.stringify(gameState, null, 2);
            ui.setExportData(dataStr);
        } catch (error) {
            console.error("Failed to serialize save data:", error);
        }
    }, [ui]);

    const handleImportSave = useCallback(() => {
        ui.setIsImportModalOpen(true);
    }, [ui]);
    
    const loadFromImportedData = useCallback((data: string): boolean => {
        try {
            const parsedData = JSON.parse(data);
            if (!parsedData.skills || !parsedData.inventory || typeof parsedData.coins === 'undefined') {
                throw new Error("Invalid save file format.");
            }
            ui.closeImportModal();
            ui.setConfirmationPrompt({
                message: "Are you sure you want to import this save? This will overwrite your current progress.",
                onConfirm: async () => {
                    const migratedState = { ...parsedData };
                    delete migratedState.activityLog; // Migration logic for old saves
                    await saveGameState(migratedState);
                    const stateToLoad = validateAndMergeState(parsedData);
                    setInitialState(stateToLoad);
                    setGameKey(k => k + 1);
                }
            });
            return true;
        } catch (error) {
            console.error("Failed to import save:", error);
            return false;
        }
    }, [ui]);

    const handleResetGame = useCallback(() => {
        ui.setConfirmationPrompt({
            message: "Are you sure you want to start a new game? All progress will be lost.",
            onConfirm: async () => {
                ui.closeAllModals();
                await deleteGameState();
                setInitialState({ ...defaultState });
                setGameKey(k => k + 1);
            }
        });
    }, [ui]);

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
        loadFromImportedData,
        handleResetGame,
    };
};