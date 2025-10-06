

import { useState, useEffect, useCallback } from 'react';
import { saveGameState, loadGameState, deleteGameState } from '../db';
import { ALL_SKILLS, REPEATABLE_QUEST_POOL, ITEMS, MONSTERS, SPELLS, QUESTS, BANK_CAPACITY } from '../constants';
import { POIS } from '../data/pois';
import { CombatStance, PlayerSlayerTask, GeneratedRepeatableQuest, InventorySlot, WorldState, Spell, BankTab } from '../types';
import { useUIState } from './useUIState';

// Define the shape of the game state
type GameState = typeof defaultState;

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
    repeatableQuestsState: {
        boards: {},
        activePlayerQuest: null,
        nextResetTimestamp: Date.now() + 30 * 60 * 1000,
        completedQuestIds: [],
        boardCompletions: {},
    },
    slayerTask: null as PlayerSlayerTask | null,
    tutorialStage: -1, // No longer used, progress is through embrune_101 quest
    worldState: { windmillFlour: 0, deathMarker: null, bankPlaceholders: false, hpBoost: null } as WorldState,
    autocastSpell: null as Spell | null,
    settings: defaultSettings,
};

const validateAndMergeState = (parsedData: any): GameState => {
    const validatedState: GameState & { skills: any[]; playerQuests: any[], worldState: WorldState, bank: BankTab[] } = { ...defaultState };
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
        // Migration check: if bank is a flat array, convert it to the new tab structure
        if (parsedData.bank.length === 0 || (parsedData.bank.length > 0 && !parsedData.bank[0]?.hasOwnProperty('items'))) {
            console.log("Migrating old bank format to new tabbed format.");
            validatedState.bank = [{ id: 0, name: 'Main', icon: null, items: migratePotions(parsedData.bank) }];
        } else {
            // It's already in the new format, just migrate potions within each tab
            validatedState.bank = parsedData.bank.map((tab: any) => ({
                ...tab,
                items: migratePotions(tab.items || []) // ensure items array exists
            }));
        }
    }
    
    if (typeof parsedData.coins === 'number') validatedState.coins = parsedData.coins;
    if (parsedData.equipment && typeof parsedData.equipment === 'object') validatedState.equipment = { ...defaultState.equipment, ...parsedData.equipment };
    if (parsedData.combatStance && Object.values(CombatStance).includes(parsedData.combatStance)) validatedState.combatStance = parsedData.combatStance;
    if (typeof parsedData.currentHp === 'number') validatedState.currentHp = parsedData.currentHp;
    if (parsedData.currentPoiId && POIS[parsedData.currentPoiId]) {
        validatedState.currentPoiId = parsedData.currentPoiId;
    }
    if (validatedState.currentPoiId && validatedState.currentPoiId.includes('enclave')) {
        validatedState.currentPoiId = 'tutorial_entrance';
    }
    
    // Validate quests before calculating locked POIs
    if (Array.isArray(parsedData.playerQuests)) {
        validatedState.playerQuests = parsedData.playerQuests;
    }
    // Ensure new players get the tutorial quest
    if (!validatedState.playerQuests.some((q: any) => q.questId === 'embrune_101') && parsedData.username) {
        validatedState.playerQuests.push({ questId: 'embrune_101', currentStage: 0, progress: 0, isComplete: false });
    }

    // Handle auto-completing tutorial for old saves outside the tutorial area
    const tutorialQuest = validatedState.playerQuests.find(q => q.questId === 'embrune_101');
    const currentPoiRegion = POIS[validatedState.currentPoiId]?.regionId;
    if (tutorialQuest && !tutorialQuest.isComplete && currentPoiRegion && currentPoiRegion !== 'path_of_beginnings') {
        // Mark quest as complete
        tutorialQuest.isComplete = true;
        tutorialQuest.currentStage = QUESTS['embrune_101'].stages.length;

        // Define and deposit starter pack into bank
        const starterItems = [
            { id: 'bronze_axe', qty: 1 }, { id: 'bronze_pickaxe', qty: 1 },
            { id: 'tinderbox', qty: 1 }, { id: 'hammer', qty: 1 },
            { id: 'small_fishing_net', qty: 1 }, { id: 'cooked_shrimp', qty: 1 },
            { id: 'bread', qty: 1 }, { id: 'bronze_dagger', qty: 1 },
            { id: 'bronze_sword', qty: 1 }, { id: 'wooden_shield', qty: 1 },
            { id: 'shortbow', qty: 1 }, { id: 'bronze_arrow', qty: 50 },
            { id: 'gust_rune', qty: 50 }, { id: 'binding_rune', qty: 50 },
        ];
        
        const bank = validatedState.bank; // This is a reference, so we can mutate it
        starterItems.forEach(itemToGive => {
            const itemData = ITEMS[itemToGive.id];
            if (!itemData) return;

            const mainTab = bank.find(t => t.id === 0);
            if (!mainTab) return;

            const existingStackIndex = mainTab.items.findIndex(i => i?.itemId === itemToGive.id);
            if (existingStackIndex > -1) {
                mainTab.items[existingStackIndex]!.quantity += itemToGive.qty;
            } else {
                mainTab.items.push({ itemId: itemToGive.id, quantity: itemToGive.qty });
            }
        });
    }


    // Recalculate locked POIs based on the player's quest state to ensure save compatibility.
    const allLockablePois = Object.values(POIS).filter(p => p.unlockRequirement);
    const newLockedPois: string[] = [];

    for (const poi of allLockablePois) {
        const req = poi.unlockRequirement;
        if (req?.type === 'quest') {
            const playerQuest = validatedState.playerQuests.find(q => q.questId === req.questId);
            
            let isUnlocked = false;
            if (playerQuest) {
                // POI is unlocked if player's current stage is >= required stage, or if quest is complete
                if (playerQuest.isComplete || playerQuest.currentStage >= req.stage) {
                    isUnlocked = true;
                }
            }

            if (!isUnlocked) {
                newLockedPois.push(poi.id);
            }
        }
    }
    validatedState.lockedPois = newLockedPois;
    
    if (typeof parsedData.tutorialStage === 'number') validatedState.tutorialStage = parsedData.tutorialStage;
    if (parsedData.autocastSpell && SPELLS.find(s => s.id === (parsedData.autocastSpell as Spell).id)) {
        validatedState.autocastSpell = parsedData.autocastSpell;
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
        if (typeof parsedData.worldState.bankPlaceholders === 'boolean') {
            validatedState.worldState.bankPlaceholders = parsedData.worldState.bankPlaceholders;
        }
        if (parsedData.worldState.hpBoost) {
             validatedState.worldState.hpBoost = parsedData.worldState.hpBoost;
        }
    }

    validatedState.settings = { ...defaultState.settings, ...(parsedData.settings || {}) };

    return validatedState;
};

export const useGameStateManager = (ui: ReturnType<typeof useUIState>) => {
    const [initialState, setInitialState] = useState<GameState | null>(null);
    const [gameKey, setGameKey] = useState(0); // Used to force-remount the Game component

    const parseSaveData = useCallback((data: string): GameState | null => {
        try {
            const trimmedData = data.trim();
    
            if (trimmedData.startsWith('s4V')) {
                const base64Data = trimmedData.substring(3);
                try {
                    const jsonString = atob(base64Data); // Decode from Base64
                    const parsedData = JSON.parse(jsonString);
                    // A simple validation check
                    if (!parsedData.skills || !parsedData.inventory || typeof parsedData.coins === 'undefined') {
                        throw new Error("Invalid save file format: missing core properties.");
                    }
                    return validateAndMergeState(parsedData);
                } catch (error) {
                    console.error("Failed to parse base64 save data:", error);
                    return null;
                }
            } else {
                // Log an error for any other format, as per the new requirement
                console.error("Import failed: Unknown or outdated save format. If you are seeing this, please reach out to the Developer and have your save file fixed.");
                return null;
            }
        } catch (error) {
            console.error("An unexpected error occurred while parsing save data:", error);
            return null;
        }
    }, []);
    

    const handleExportSave = useCallback((gameState: object) => {
        try {
            const dataStr = JSON.stringify(gameState, null, 2);
            const base64Str = btoa(dataStr); // Encode to Base64
            const finalExportStr = 's4V' + base64Str; // Prepend "s4V"
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
