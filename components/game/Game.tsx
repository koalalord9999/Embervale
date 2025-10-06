
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CombatStance, PlayerSlayerTask, ShopStates, SkillName, POIActivity, InventorySlot, ActivePanel, Item, Region, POI, WorldState, GroundItem, Spell, GeneratedRepeatableQuest, BonfireActivity, BankTab } from '../../types';
import { useActivityLog } from '../../hooks/useActivityLog';
import { useCharacter } from '../../hooks/useCharacter';
import { useInventory } from '../../hooks/useInventory';
import { useQuests } from '../../hooks/useQuests';
import { useSaveGame } from '../../hooks/useSaveGame';
import { useGameSession } from '../../hooks/useGameSession';
import { useRepeatableQuests } from '../../hooks/useRepeatableQuests';
import { useAggression } from '../../hooks/useAggression';
import { useShops } from '../../hooks/useShops';
import { useSkilling } from '../../hooks/useSkilling';
import { useBank } from '../../hooks/useBank';
import { useInteractQuest } from '../../hooks/useInteractQuest';
import { useSlayer } from '../../hooks/useSlayer';
import { useQuestLogic } from '../../hooks/useQuestLogic';
import { useCrafting } from '../../hooks/useCrafting';
import { useItemActions } from '../../hooks/useItemActions';
import { useSpellActions } from '../../hooks/useSpellActions';
import { useWorldActions } from '../../hooks/useWorldActions';
import { useNavigation } from '../../hooks/useNavigation';
import { usePlayerDeath } from '../../hooks/usePlayerDeath';
import { useKillHandler } from '../../hooks/useKillHandler';
import { useGroundItems } from '../../hooks/useGroundItems';
import { useSpellcasting } from '../../hooks/useSpellcasting';
import { useDialogueActions } from '../../hooks/useDialogueActions';
import { useDevMode } from '../../hooks/useDevMode';

import SidePanel from './SidePanel';
import ActivityLog from '../game/ActivityLog';
import XpTracker, { XpDrop } from '../ui/XpTracker';
import MainViewController from '../game/MainViewController';
import QuestDetailView from '../views/overlays/QuestDetailView';
import AtlasView from '../views/AtlasView';
import ExpandedMapView from '../views/ExpandedMapView';
import LevelUpAnimation from './LevelUpAnimation';
import DialogueOverlay from './dialogue/DialogueOverlay';
import { useUIState } from '../../hooks/useUIState';
import { POIS } from '../../data/pois';
import DevPanel from '../panels/DevPanel';
import { FIREMAKING_RECIPES, QUESTS } from '../../constants';
import SettingsView from '../panels/SettingsPanel';

interface GameProps {
    initialState: any;
    onExportGame: (gameState: object) => void;
    onImportGame: () => void;
    onResetGame: () => void;
    ui: ReturnType<typeof useUIState>;
    devModeOverride?: boolean;
    assets: Record<string, string>;
}

const Game: React.FC<GameProps> = ({ initialState, onExportGame, onImportGame, onResetGame, ui, devModeOverride = false, assets }) => {
    // Core State Hooks
    const session = useGameSession(initialState.currentPoiId);
    const { activityLog, addLog, setActivityLog } = useActivityLog([]);
    const [xpDrops, setXpDrops] = useState<XpDrop[]>([]);
    const [levelUpInfo, setLevelUpInfo] = useState<{ skill: SkillName; level: number } | null>(null);
    const [immunityUntil, setImmunityUntil] = useState<number | null>(null);
    const [immunityTimeLeft, setImmunityTimeLeft] = useState(0);
    const [poiImmunityTimeLeft, setPoiImmunityTimeLeft] = useState(0);
    const [killTrigger, setKillTrigger] = useState(0);
    const [bonfires, setBonfires] = useState<BonfireActivity[]>([]);
    
    // Dev Mode Hook
    const devMode = useDevMode({ initialState, devModeOverride, isInCombat: ui.combatQueue.length > 0, ui, addLog });
    
    const isBusy = ui.isBusy;
    const isEquipmentStatsOpen = !!ui.equipmentStats;
    const effectiveXpMultiplier = devMode.isDevMode && devMode.isXpBoostEnabled ? devMode.xpMultiplier : 1;

    // World & Quest State Hooks
    const quests = useQuests({ playerQuests: initialState.playerQuests, lockedPois: initialState.lockedPois });
    
    // Character & Item Hooks
    const handleXpGain = useCallback((skillName: SkillName, amount: number) => {
        if (amount > 0) {
            setXpDrops(prev => [...prev, { id: Date.now() + Math.random(), skillName, amount }]);
        }
    }, []);

    const removeXpDrop = useCallback((id: number) => setXpDrops(prev => prev.filter(drop => drop.id !== id)), []);
    const handleLevelUp = useCallback((skill: SkillName, level: number) => {
        setLevelUpInfo({ skill, level });
        const duration = level === 99 ? 8000 : 4000;
        setTimeout(() => setLevelUpInfo(null), duration);
    }, []);
    
    const [worldState, setWorldState] = useState<WorldState>(initialState.worldState);
    const charInitialData = useMemo(() => ({ skills: initialState.skills, combatStance: initialState.combatStance, currentHp: initialState.currentHp, autocastSpell: initialState.autocastSpell }), [initialState]);
    const charCallbacks = useMemo(() => ({ addLog, onXpGain: handleXpGain, onLevelUp: handleLevelUp }), [addLog, handleXpGain, handleLevelUp]);
    const char = useCharacter(charInitialData, charCallbacks, worldState, setWorldState, ui.combatQueue.length > 0, devMode.combatSpeedMultiplier, effectiveXpMultiplier);

    const invRef = useRef<ReturnType<typeof useInventory> | null>(null);
    const { 
        groundItems: allGroundItems, 
        groundItemsForCurrentPoi, 
        onItemDropped, 
        handlePickUpItem, 
        handleTakeAllLoot, 
        clearAllItemsAtPoi,
        clearDeathPileItemsAtPoi 
    } = useGroundItems(initialState.groundItems, { session, invRef, addLog, ui, worldState, setWorldState });

    const [bank, setBank] = useState<BankTab[]>(initialState.bank);
    
    // Logic Hooks
    const [clearedSkillObstacles, setClearedSkillObstacles] = useState(initialState.clearedSkillObstacles);
    const questLogic = useQuestLogic({ playerQuests: quests.playerQuests, setPlayerQuests: quests.setPlayerQuests, addLog, modifyItem: (id, qty, quiet, doses, options) => inv.modifyItem(id, qty, quiet, doses, options), addXp: char.addXp, hasItems: (items) => inv.hasItems(items), setLockedPois: quests.setLockedPois, setClearedSkillObstacles });

    const onQuestAcceptedCallback = useCallback((quest: GeneratedRepeatableQuest) => {
        const tutorialQuest = quests.playerQuests.find(q => q.questId === 'embrune_101');
        if (tutorialQuest && !tutorialQuest.isComplete) {
            const questData = QUESTS['embrune_101'];
            const currentStage = questData.stages[tutorialQuest.currentStage];
            if (currentStage?.requirement.type === 'accept_repeatable_quest' && currentStage.requirement.questId === quest.id) {
                questLogic.completeQuestStage('embrune_101');
            }
        }
    }, [quests.playerQuests, questLogic]);

    const bankOptions = useMemo(() => ({ isAutoBankOn: devMode.isAutoBankOn, setBank, onItemDropped, setCombatStance: char.setCombatStance }), [devMode.isAutoBankOn, setBank, onItemDropped, char.setCombatStance]);
    const invInitialData = useMemo(() => ({ inventory: initialState.inventory, coins: initialState.coins, equipment: initialState.equipment }), [initialState]);
    const inv = useInventory(invInitialData, addLog, bankOptions);
    
    useEffect(() => {
        invRef.current = inv;
    }, [inv]);
    
    const [monsterRespawnTimers, setMonsterRespawnTimers] = useState(initialState.monsterRespawnTimers);
    const setWindmillFlour = useCallback((updater: React.SetStateAction<number>) => {
        setWorldState(prev => {
            const newFlour = typeof updater === 'function' ? updater(prev.windmillFlour) : updater;
            return { ...prev, windmillFlour: newFlour };
        });
    }, []);
    
    // Bonfire Logic
    const onCreateBonfire = useCallback((logId: string) => {
        const recipe = FIREMAKING_RECIPES.find(r => r.logId === logId);
        if (!recipe) return;
        const duration = (30 + recipe.level * 2) * 1000;
        const newBonfire: BonfireActivity = {
            type: 'bonfire',
            uniqueId: `${session.currentPoiId}-${Date.now()}`,
            logId,
            expiresAt: Date.now() + duration
        };
        setBonfires(prev => [...prev, newBonfire]);
    }, [session.currentPoiId]);

    const onRefreshBonfire = useCallback((bonfireId: string, logId: string) => {
        const recipe = FIREMAKING_RECIPES.find(r => r.logId === logId);
        if (!recipe) return;
        const duration = (30 + recipe.level * 2) * 1000;
        setBonfires(prev => prev.map(b => 
            b.uniqueId === bonfireId 
                ? { ...b, expiresAt: Date.now() + duration } 
                : b
        ));
    }, []);

    const handleBonfireTick = useCallback(() => {
        const now = Date.now();
        setBonfires(prevBonfires => {
            const activeBonfires: BonfireActivity[] = [];
            let changed = false;
            prevBonfires.forEach(bonfire => {
                if (now >= bonfire.expiresAt) {
                    changed = true;
                    onItemDropped({ itemId: 'ashes', quantity: 1 });
                    addLog("A fire has burnt out, leaving a pile of ashes.");
                } else {
                    activeBonfires.push(bonfire);
                }
            });
            return changed ? activeBonfires : prevBonfires;
        });
    }, [addLog, onItemDropped]);
    
    const bonfireCallbackRef = useRef(handleBonfireTick);
    useEffect(() => { bonfireCallbackRef.current = handleBonfireTick; });

    useEffect(() => {
        const interval = setInterval(() => bonfireCallbackRef.current(), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleToggleBankPlaceholders = useCallback(() => {
        setWorldState(ws => ({ ...ws, bankPlaceholders: !ws.bankPlaceholders }));
    }, []);
    const bankLogic = useBank({ bank, setBank }, { addLog, ...inv, ...char, setCombatStance: char.setCombatStance, bankPlaceholders: worldState.bankPlaceholders ?? false });
    const shops = useShops(initialState.shopStates, inv.coins, inv.modifyItem, addLog);
    const skilling = useSkilling(initialState.resourceNodeStates, { addLog, skills: char.skills, addXp: char.addXp, inventory: inv.inventory, modifyItem: inv.modifyItem, equipment: inv.equipment, setEquipment: inv.setEquipment });
    const repeatableQuests = useRepeatableQuests(initialState.repeatableQuestsState, addLog, inv, char, onQuestAcceptedCallback);
    const interactQuest = useInteractQuest({ addLog, activePlayerQuest: repeatableQuests.activePlayerQuest, handleTurnInRepeatableQuest: repeatableQuests.handleTurnInRepeatableQuest });
    const crafting = useCrafting({ skills: char.skills, hasItems: inv.hasItems, addLog, activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction, inventory: inv.inventory, modifyItem: inv.modifyItem, addXp: char.addXp, checkQuestProgressOnSpin: questLogic.checkQuestProgressOnSpin, checkQuestProgressOnSmith: questLogic.checkQuestProgressOnSmith, advanceTutorial: () => {}, closeCraftingView: ui.closeCraftingView, setWindmillFlour, equipment: inv.equipment, setEquipment: inv.setEquipment, worldState, setWorldState, onCreateBonfire, onRefreshBonfire });
    const navigation = useNavigation({ session, lockedPois: quests.lockedPois, clearedSkillObstacles, addLog, isBusy, isInCombat: ui.combatQueue.length > 0, ui, skilling, interactQuest });
    const spellcasting = useSpellcasting({ char, inv, addLog, navigation, ui, isStunned: char.isStunned });
    const worldActions = useWorldActions({ hasItems: inv.hasItems, inventory: inv.inventory, modifyItem: inv.modifyItem, addLog, coins: inv.coins, skills: char.skills, addXp: char.addXp, setClearedSkillObstacles, playerQuests: quests.playerQuests, checkQuestProgressOnShear: questLogic.checkQuestProgressOnShear, setMakeXPrompt: ui.setMakeXPrompt, windmillFlour: worldState.windmillFlour, setWindmillFlour, setActiveCraftingAction: ui.setActiveCraftingAction });
    const dialogueActions = useDialogueActions({ quests, questLogic, navigation, inv, char, worldActions, addLog, worldState, setBank, setActivityLog, repeatableQuests, ui, setWorldState, session });
    const itemActions = useItemActions({ addLog, currentHp: char.currentHp, maxHp: char.maxHp, setCurrentHp: char.setCurrentHp, applyStatModifier: char.applyStatModifier, setInventory: inv.setInventory, skills: char.skills, inventory: inv.inventory, activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction, hasItems: inv.hasItems, modifyItem: inv.modifyItem, addXp: char.addXp, openCraftingView: ui.openCraftingView, setItemToUse: ui.setItemToUse, addBuff: char.addBuff, setMakeXPrompt: ui.setMakeXPrompt, startQuest: (questId) => { quests.startQuest(questId, addLog); }, currentPoiId: session.currentPoiId, playerQuests: quests.playerQuests, isStunned: char.isStunned, setActiveDungeonMap: ui.setActiveDungeonMap, confirmValuableDrops: ui.confirmValuableDrops, valuableDropThreshold: ui.valuableDropThreshold, ui, equipment: inv.equipment });
    const spellActions = useSpellActions({ addLog, addXp: char.addXp, modifyItem: inv.modifyItem, hasItems: inv.hasItems, skills: char.skills, ui, equipment: inv.equipment });
    const { handlePlayerDeath: baseHandlePlayerDeath } = usePlayerDeath({ skilling, interactQuest, ui, session, char, inv, addLog, playerQuests: quests.playerQuests, onItemDropped, setWorldState });
    const handleCombatFinish = useCallback(() => {
        if (devMode.isInstantRespawnOn && devMode.instantRespawnCounter !== null) {
            const newCount = devMode.instantRespawnCounter - 1;
            if (newCount <= 0) { devMode.setIsInstantRespawnOn(false); devMode.setInstantRespawnCounter(null); addLog('System: Instant respawn finished.'); } 
            else { devMode.setInstantRespawnCounter(newCount); addLog(`System: Instant respawn encounters remaining: ${newCount}.`); }
        }
    }, [devMode, addLog]);
    const handlePlayerDeath = useCallback(() => { baseHandlePlayerDeath(); handleCombatFinish(); }, [baseHandlePlayerDeath, handleCombatFinish]);
    const slayer = useSlayer(initialState.slayerTask, { addLog, addXp: char.addXp, combatLevel: char.combatLevel, modifyItem: inv.modifyItem });
    const killHandler = useKillHandler({ questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn: devMode.isInstantRespawnOn, currentPoiId: session.currentPoiId, monsterRespawnTimers, setWorldState, addLog, worldState, inv });
    const handleKill = useCallback((id: string, style?: 'melee' | 'ranged' | 'magic') => { killHandler.handleKill(id, style); }, [killHandler]);
    
    const onWinCombat = useCallback(() => {
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);
    }, [ui]);

    const onFleeFromCombat = useCallback(() => {
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);
        setImmunityUntil(Date.now() + 10000);
        addLog("You flee from combat, gaining 10 seconds of aggression immunity.");
    }, [ui, addLog]);
    
    const startCombat = useCallback((ids: string[]) => {
        if (ui.activeDialogue) {
            ui.setActiveDialogue(null);
        }
        ui.setCombatQueue(ids);
        ui.setIsMandatoryCombat(false);
    }, [ui]);
    const isInCombat = ui.combatQueue.length > 0;

    const needsDeathImmunityThisRender = !!worldState.deathMarker && session.currentPoiId === worldState.deathMarker.poiId && !worldState.deathMarker.immunityGranted;
    const isTimedImmunityActive = immunityUntil !== null && immunityUntil > Date.now();
    const isPlayerCurrentlyImmune = isTimedImmunityActive || needsDeathImmunityThisRender;

    useAggression(session.currentPoiId, true, isBusy, isInCombat, char.combatLevel, startCombat, addLog, monsterRespawnTimers, devMode.configAggroIds, devMode.isPlayerInvisible, isPlayerCurrentlyImmune, inv.equipment, inv.setEquipment, worldState);
    
    useEffect(() => { questLogic.checkGatherQuests(); }, [inv.inventory, questLogic]);

    useEffect(() => {
        if (initialState.settings) {
            const s = initialState.settings;
            ui.setShowTooltips(s.showTooltips);
            ui.setShowXpDrops(s.showXpDrops);
            ui.setConfirmValuableDrops(s.confirmValuableDrops);
            ui.setValuableDropThreshold(s.valuableDropThreshold);
            ui.setShowMinimapHealth(s.showMinimapHealth);
            ui.setShowCombatPlayerHealth(s.showCombatPlayerHealth);
            ui.setShowCombatEnemyHealth(s.showCombatEnemyHealth);
            ui.setShowHitsplats(s.showHitsplats);
            ui.setIsOneClickMode(s.isOneClickMode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialState.settings]);
    
    // Save Game State Memoization
    const gameState = useMemo(() => ({
        username: initialState.username,
        skills: char.skills.map(({ name, level, xp }) => ({ name, level, xp })),
        inventory: inv.inventory, coins: inv.coins, equipment: inv.equipment, combatStance: char.combatStance,
        bank, currentHp: char.currentHp, currentPoiId: session.currentPoiId, playerQuests: quests.playerQuests, lockedPois: quests.lockedPois,
        clearedSkillObstacles, resourceNodeStates: skilling.resourceNodeStates, monsterRespawnTimers, shopStates: shops.shopStates, 
        groundItems: allGroundItems,
        repeatableQuestsState: {
            boards: Object.fromEntries(Object.entries(repeatableQuests.boards).map(([id, qs]: [string, GeneratedRepeatableQuest[]]) => [id, qs.map((q: GeneratedRepeatableQuest) => ({id: q.id, requiredQuantity: q.requiredQuantity, finalCoinReward: q.finalCoinReward, finalXpAmount: q.xpReward.amount}))])),
            activePlayerQuest: repeatableQuests.activePlayerQuest,
            nextResetTimestamp: repeatableQuests.nextResetTimestamp,
            completedQuestIds: repeatableQuests.completedQuestIds,
            boardCompletions: repeatableQuests.boardCompletions,
        },
        slayerTask: slayer.slayerTask, tutorialStage: -1, // Tutorial is now quest-based, not a separate stage.
        worldState: worldState,
        autocastSpell: char.autocastSpell,
        settings: {
            showTooltips: ui.showTooltips,
            showXpDrops: ui.showXpDrops,
            confirmValuableDrops: ui.confirmValuableDrops,
            valuableDropThreshold: ui.valuableDropThreshold,
            showMinimapHealth: ui.showMinimapHealth,
            showCombatPlayerHealth: ui.showCombatPlayerHealth,
            showCombatEnemyHealth: ui.showCombatEnemyHealth,
            showHitsplats: ui.showHitsplats,
            isOneClickMode: ui.isOneClickMode,
        }
    }), [
        char, inv, session.currentPoiId, quests, skilling.resourceNodeStates, shops.shopStates, repeatableQuests, bank, clearedSkillObstacles, monsterRespawnTimers, slayer.slayerTask, initialState.username, worldState, allGroundItems,
        ui.showTooltips,
        ui.showXpDrops,
        ui.confirmValuableDrops,
        ui.valuableDropThreshold,
        ui.showMinimapHealth,
        ui.showCombatPlayerHealth,
        ui.showCombatEnemyHealth,
        ui.showHitsplats,
        ui.isOneClickMode,
    ]);

    useSaveGame(gameState);
    
    useEffect(() => { if (ui.activePanel === null) ui.setActivePanel('inventory'); }, []);

    const isBankOpen = ui.activePanel === 'bank';
    const isShopOpen = !!ui.activeShopId;
    
    const handleDeathMarkerTick = useCallback(() => {
        setWorldState(ws => {
            if (!ws.deathMarker) return ws;
            const newTime = ws.deathMarker.timeRemaining - 1000;
            if (newTime <= 0) {
                addLog("Your dropped items from your previous death have disappeared.");
                clearDeathPileItemsAtPoi(ws.deathMarker.poiId);
                return { ...ws, deathMarker: null };
            }
            return { ...ws, deathMarker: { ...ws.deathMarker, timeRemaining: newTime } };
        });
    }, [addLog, clearDeathPileItemsAtPoi]);

    const deathMarkerCallbackRef = useRef(handleDeathMarkerTick);
    useEffect(() => { deathMarkerCallbackRef.current = handleDeathMarkerTick; });

    useEffect(() => {
        const timer = setInterval(() => deathMarkerCallbackRef.current(), 1000);
        return () => clearInterval(timer);
    }, []);

    // Immunity Timer Logic
    useEffect(() => {
        if (immunityUntil === null || immunityUntil <= Date.now()) {
            setImmunityTimeLeft(0);
            return;
        }
    
        const timer = setInterval(() => {
            const remaining = immunityUntil - Date.now();
            if (remaining > 0) {
                setImmunityTimeLeft(Math.ceil(remaining / 1000));
            } else {
                setImmunityUntil(null);
                addLog("Your aggression immunity has worn off.");
            }
        }, 1000);
    
        // Set initial time immediately
        const initialRemaining = immunityUntil - Date.now();
        if (initialRemaining > 0) {
            setImmunityTimeLeft(Math.ceil(initialRemaining / 1000));
        } else {
            setImmunityUntil(null);
        }
    
        return () => clearInterval(timer);
    }, [immunityUntil, addLog]);

     // POI Immunity Timer UI Logic
    useEffect(() => {
        const poiImmunityExpiry = worldState.poiImmunity?.[session.currentPoiId];
        if (!poiImmunityExpiry) {
            setPoiImmunityTimeLeft(0);
            return;
        }
        const timer = setInterval(() => {
            const now = Date.now();
            if (now < poiImmunityExpiry) {
                setPoiImmunityTimeLeft(Math.ceil((poiImmunityExpiry - now) / 1000));
            } else {
                setPoiImmunityTimeLeft(0);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [worldState.poiImmunity, session.currentPoiId]);
    
    // Grant Immunity on Entering Death POI
    useEffect(() => {
        const needsImmunity = !!worldState.deathMarker && session.currentPoiId === worldState.deathMarker.poiId && !worldState.deathMarker.immunityGranted;
        if (needsImmunity) {
            const immunityDuration = 30 * 1000;
            setImmunityUntil(Date.now() + immunityDuration);
            addLog(`You are immune to monster aggression for 30 seconds.`);
            setWorldState(ws => {
                if (!ws.deathMarker) return ws;
                return { ...ws, deathMarker: { ...ws.deathMarker, immunityGranted: true } };
            });
        }
    }, [session.currentPoiId, worldState.deathMarker, addLog, setWorldState]);

    // Dev Handlers
    const handleHealPlayer = () => char.setCurrentHp(char.maxHp);
    const handleKillMonster = () => { if (ui.combatQueue.length > 0) setKillTrigger(k => k + 1); };
    const handleAddCoins = (amount: number) => inv.modifyItem('coins', amount, false);
    const handleSetSkillLevel = (skill: SkillName, level: number) => char.setSkillLevel(skill, level);
    const handleResetQuest = (questId: string) => quests.resetQuest(questId, addLog);

    const devPanelProps = {
        inv,
        setTooltip: ui.setTooltip,
        devPanelState: devMode.devPanelState,
        updateDevPanelState: devMode.updateDevPanelState,
        combatSpeedMultiplier: devMode.combatSpeedMultiplier,
        setCombatSpeedMultiplier: devMode.setCombatSpeedMultiplier,
        isInstantRespawnOn: devMode.isInstantRespawnOn,
        setIsInstantRespawnOn: devMode.setIsInstantRespawnOn,
        instantRespawnCounter: devMode.instantRespawnCounter,
        setInstantRespawnCounter: devMode.setInstantRespawnCounter,
        isInCombat: ui.combatQueue.length > 0,
        isCurrentMonsterAggro: devMode.isCurrentMonsterAggro,
        onToggleAggro: devMode.onToggleAggro,
        isPlayerInvisible: devMode.isPlayerInvisible,
        setIsPlayerInvisible: devMode.setIsPlayerInvisible,
        isAutoBankOn: devMode.isAutoBankOn,
        setIsAutoBankOn: devMode.setIsAutoBankOn,
        isTouchSimulationEnabled: devMode.isTouchSimulationEnabled,
        onToggleTouchSimulation: devMode.onToggleTouchSimulation,
        isMapManagerEnabled: devMode.isMapManagerEnabled,
        onToggleMapManager: devMode.onToggleMapManager,
        onCommitMapChanges: devMode.handleCommitMapChanges,
        hasMapChanges: devMode.modifiedPois.size > 0 || devMode.modifiedRegions.size > 0,
        showAllPois: devMode.showAllPois,
        onToggleShowAllPois: () => devMode.setShowAllPois(p => !p),
        onForcedNavigate: navigation.handleForcedNavigate,
        xpMultiplier: devMode.xpMultiplier,
        setXpMultiplier: devMode.setXpMultiplier,
        isXpBoostEnabled: devMode.isXpBoostEnabled,
        setIsXpBoostEnabled: devMode.setIsXpBoostEnabled,
        onClose: () => ui.setIsDevPanelOpen(false),
        onHealPlayer: handleHealPlayer,
        onKillMonster: handleKillMonster,
        onAddCoins: handleAddCoins,
        onSetSkillLevel: handleSetSkillLevel,
        onResetQuest: handleResetQuest,
    };

    return (
        <>
            <div className="w-full md:w-4/5 flex flex-col gap-2 relative">
                <div className="bg-black/70 border-2 border-gray-600 rounded-lg p-4 flex-grow min-h-0 relative">
                    <MainViewController {...{itemActions, char, inv, quests, bank, bankLogic, shops, crafting, repeatableQuests, navigation, worldActions, slayer, questLogic, skilling, interactQuest, session, clearedSkillObstacles, monsterRespawnTimers, handlePlayerDeath, handleKill, onWinCombat, onFleeFromCombat, handleDialogueAction: dialogueActions.handleDialogueAction, handleDialogueCheck: dialogueActions.handleDialogueCheck, combatSpeedMultiplier: devMode.combatSpeedMultiplier, activeCombatStyleHighlight: null, isTouchSimulationEnabled: devMode.isTouchSimulationEnabled, isMapManagerEnabled: devMode.isMapManagerEnabled, poiCoordinates: devMode.poiCoordinates, regionCoordinates: devMode.regionCoordinates, onUpdatePoiCoordinate: devMode.handleUpdatePoiCoordinate, poiConnections: devMode.poiConnections, onUpdatePoiConnections: devMode.handleUpdatePoiConnections, addLog, ui, initialState, showAllPois: devMode.showAllPois, groundItemsForCurrentPoi, onPickUpItem: handlePickUpItem, onTakeAllLoot: handleTakeAllLoot, onItemDropped, isAutoBankOn: devMode.isAutoBankOn, handleCombatXpGain: char.addXp, immunityTimeLeft, poiImmunityTimeLeft, killTrigger, bankPlaceholders: worldState.bankPlaceholders ?? false, handleToggleBankPlaceholders, bonfires: bonfires.filter(b => b.uniqueId.startsWith(session.currentPoiId)), onStokeBonfire: crafting.handleStokeBonfire, isStunned: char.isStunned, addBuff: char.addBuff, onExportGame: () => onExportGame(gameState), onImportGame, onResetGame, isDevMode: devMode.isDevMode, onToggleDevPanel: () => ui.setIsDevPanelOpen(true), onToggleTouchSimulation: devMode.onToggleTouchSimulation, onDepositEquipment: () => bankLogic.handleDepositEquipment(ui.activeBankTabId), deathMarker: worldState.deathMarker }} />
                    {levelUpInfo && <LevelUpAnimation skill={levelUpInfo.skill} level={levelUpInfo.level} />}
                    {groundItemsForCurrentPoi.length > 0 && (
                        <button
                            onClick={() => ui.setIsLootViewOpen(true)}
                            className="absolute bottom-4 left-4 z-20 flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/80 animate-fade-in"
                            aria-label={`Loot ${groundItemsForCurrentPoi.length} items`}
                            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
                        >
                            <img src="https://api.iconify.design/game-icons:swap-bag.svg" alt="" className="w-8 h-8 filter invert drop-shadow-lg" />
                            <span className="font-bold text-white text-lg">Loot ({groundItemsForCurrentPoi.length})</span>
                        </button>
                    )}
                </div>
                <div className={`md:flex-shrink-0 relative`}>
                    <ActivityLog logs={activityLog} isDialogueActive={!!ui.activeDialogue} />
                    {ui.activeDialogue && <DialogueOverlay dialogue={ui.activeDialogue} setActivePanel={ui.setActivePanel} />}
                </div>
            </div>
            <div className="w-full md:w-1/5 flex flex-col">
                <SidePanel 
                    ui={ui}
                    initialState={initialState}
                    char={char}
                    inv={inv}
                    quests={quests}
                    repeatableQuests={repeatableQuests}
                    slayer={slayer}
                    onExportGame={() => onExportGame(gameState)}
                    onImportGame={onImportGame}
                    onResetGame={onResetGame}
                    isDevMode={devMode.isDevMode}
                    isTouchSimulationEnabled={devMode.isTouchSimulationEnabled}
                    onToggleTouchSimulation={devMode.onToggleTouchSimulation}
                    itemActions={itemActions}
                    isBusy={isBusy}
                    handleExamine={itemActions.handleExamine}
                    session={session}
                    addLog={addLog}
                    activeCombatStyleHighlight={null}
                    onNavigate={navigation.handleNavigate}
                    unlockedPois={navigation.reachablePois}
                    isBankOpen={isBankOpen}
                    isShopOpen={isShopOpen}
                    onDeposit={(inventoryIndex, quantity) => bankLogic.handleDeposit(inventoryIndex, quantity, ui.activeBankTabId)}
                    onCastSpell={spellcasting.onCastSpell}
                    onSpellOnItem={spellActions.handleSpellOnItem}
                    isEquipmentStatsOpen={isEquipmentStatsOpen}
                />
            </div>
            {ui.showXpDrops && <XpTracker drops={xpDrops} onRemoveDrop={removeXpDrop} />}
            {ui.isDevPanelOpen && (
                <div className="absolute inset-0 bg-black/80 flex justify-end z-40 p-2 pointer-events-none" onClick={() => ui.setIsDevPanelOpen(false)}>
                    <div className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-md h-full flex flex-col pointer-events-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <DevPanel {...devPanelProps} />
                    </div>
                </div>
            )}
            {ui.isAtlasViewOpen && (
                <AtlasView
                    currentPoiId={session.currentPoiId}
                    unlockedPois={navigation.reachablePois}
                    onClose={() => ui.setIsAtlasViewOpen(false)}
                    setTooltip={ui.setTooltip}
                    showAllPois={devMode.showAllPois}
                    deathMarker={worldState.deathMarker}
                />
            )}
            {ui.isExpandedMapViewOpen && (
                <ExpandedMapView
                    currentPoiId={session.currentPoiId}
                    unlockedPois={navigation.reachablePois}
                    onNavigate={navigation.handleNavigate}
                    onClose={() => ui.setIsExpandedMapViewOpen(false)}
                    setTooltip={ui.setTooltip}
                    addLog={addLog}
                    isMapManagerEnabled={devMode.isMapManagerEnabled}
                    poiCoordinates={devMode.poiCoordinates}
                    regionCoordinates={devMode.regionCoordinates}
                    onUpdatePoiCoordinate={devMode.handleUpdatePoiCoordinate}
                    poiConnections={devMode.poiConnections}
                    onUpdatePoiConnections={devMode.handleUpdatePoiConnections}
                    showAllPois={devMode.showAllPois}
                    onCommitMapChanges={devMode.handleCommitMapChanges}
                    activeMapRegionId={ui.activeMapRegionId}
                    setActiveMapRegionId={ui.setActiveMapRegionId}
                    deathMarker={worldState.deathMarker}
                />
            )}
        </>
    );
};

export default Game;
