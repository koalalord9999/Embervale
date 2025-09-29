import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CombatStance, PlayerSlayerTask, ShopStates, SkillName, POIActivity, InventorySlot, ActivePanel, Item, Region, POI, WorldState, GroundItem, Spell, GeneratedRepeatableQuest, BonfireActivity } from '../../types';
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
import { useBank, padBank } from '../../hooks/useBank';
import { useInteractQuest } from '../../hooks/useInteractQuest';
import { useSlayer } from '../../hooks/useSlayer';
import { useQuestLogic } from '../../hooks/useQuestLogic';
import { useCrafting } from '../../hooks/useCrafting';
import { useItemActions } from '../../hooks/useItemActions';
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
import EquipmentStatsView from '../views/overlays/EquipmentStatsView';

interface GameProps {
    initialState: any;
    onExportGame: (gameState: object) => void;
    onImportGame: () => void;
    onResetGame: () => void;
    ui: ReturnType<typeof useUIState>;
    devModeOverride?: boolean;
}

const Game: React.FC<GameProps> = ({ initialState, onExportGame, onImportGame, onResetGame, ui, devModeOverride = false }) => {
    // Core State Hooks
    const session = useGameSession(initialState.currentPoiId);
    const { activityLog, addLog, setActivityLog } = useActivityLog([]);
    const [xpDrops, setXpDrops] = useState<XpDrop[]>([]);
    const [levelUpInfo, setLevelUpInfo] = useState<{ skill: SkillName; level: number } | null>(null);
    const [immunityUntil, setImmunityUntil] = useState<number | null>(null);
    const [isImmune, setIsImmune] = useState(false);
    const [immunityTimeLeft, setImmunityTimeLeft] = useState(0);
    const [poiImmunityTimeLeft, setPoiImmunityTimeLeft] = useState(0);
    const [killTrigger, setKillTrigger] = useState(0);
    const [bonfires, setBonfires] = useState<BonfireActivity[]>([]);
    
    // Dev Mode Hook
    const devMode = useDevMode({ initialState, devModeOverride, isInCombat: ui.combatQueue.length > 0, ui, addLog });
    
    const isBusy = ui.isBusy;
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
    const groundItems = useGroundItems({ session, invRef, addLog, ui, worldState, setWorldState });
    const [bank, setBank] = useState<(InventorySlot | null)[]>(padBank(initialState.bank));
    
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

    const bankOptions = useMemo(() => ({ isAutoBankOn: devMode.isAutoBankOn, bank, setBank, onItemDropped: groundItems.onItemDropped, setCombatStance: char.setCombatStance }), [devMode.isAutoBankOn, bank, setBank, groundItems.onItemDropped, char.setCombatStance]);
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

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const activeBonfires: BonfireActivity[] = [];
            let changed = false;
            bonfires.forEach(bonfire => {
                if (now >= bonfire.expiresAt) {
                    changed = true;
                    groundItems.onItemDropped({ itemId: 'ashes', quantity: 1 });
                    addLog("A fire has burnt out, leaving a pile of ashes.");
                } else {
                    activeBonfires.push(bonfire);
                }
            });
            if (changed) {
                setBonfires(activeBonfires);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [bonfires, groundItems, addLog]);

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
    const spellcasting = useSpellcasting({ char, inv, addLog, navigation, ui });
    const worldActions = useWorldActions({ hasItems: inv.hasItems, inventory: inv.inventory, modifyItem: inv.modifyItem, addLog, coins: inv.coins, skills: char.skills, addXp: char.addXp, setClearedSkillObstacles, playerQuests: quests.playerQuests, checkQuestProgressOnShear: questLogic.checkQuestProgressOnShear, setMakeXPrompt: ui.setMakeXPrompt, windmillFlour: worldState.windmillFlour, setWindmillFlour, setActiveCraftingAction: ui.setActiveCraftingAction });
    const dialogueActions = useDialogueActions({ quests, questLogic, navigation, inv, char, worldActions, addLog, worldState, setBank, setActivityLog });
    const itemActions = useItemActions({ addLog, currentHp: char.currentHp, maxHp: char.maxHp, setCurrentHp: char.setCurrentHp, applyStatModifier: char.applyStatModifier, setInventory: inv.setInventory, skills: char.skills, inventory: inv.inventory, activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction, hasItems: inv.hasItems, modifyItem: inv.modifyItem, addXp: char.addXp, openCraftingView: ui.openCraftingView, setItemToUse: ui.setItemToUse, addBuff: char.addBuff, setMakeXPrompt: ui.setMakeXPrompt, startQuest: (questId) => { quests.startQuest(questId, addLog); }, currentPoiId: session.currentPoiId, playerQuests: quests.playerQuests });
    const { handlePlayerDeath: baseHandlePlayerDeath } = usePlayerDeath({ skilling, interactQuest, ui, session, char, inv, addLog, tutorialStage: -1, onItemDropped: groundItems.onItemDropped, setWorldState });
    const handleCombatFinish = useCallback(() => {
        if (devMode.isInstantRespawnOn && devMode.instantRespawnCounter !== null) {
            const newCount = devMode.instantRespawnCounter - 1;
            if (newCount <= 0) { devMode.setIsInstantRespawnOn(false); devMode.setInstantRespawnCounter(null); addLog('System: Instant respawn finished.'); } 
            else { devMode.setInstantRespawnCounter(newCount); addLog(`System: Instant respawn encounters remaining: ${newCount}.`); }
        }
    }, [devMode, addLog]);
    const handlePlayerDeath = useCallback(() => { baseHandlePlayerDeath(); handleCombatFinish(); }, [baseHandlePlayerDeath, handleCombatFinish]);
    const slayer = useSlayer(initialState.slayerTask, { addLog, addXp: char.addXp, combatLevel: char.combatLevel, modifyItem: inv.modifyItem });
    const killHandler = useKillHandler({ questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn: devMode.isInstantRespawnOn, currentPoiId: session.currentPoiId, monsterRespawnTimers, setWorldState, addLog });
    const handleKill = useCallback((id: string, style?: 'melee' | 'ranged' | 'magic') => { killHandler.handleKill(id, style); }, [killHandler]);
    
    const startCombat = useCallback((ids: string[]) => { ui.setCombatQueue(ids); ui.setIsMandatoryCombat(true); }, [ui]);
    const isInCombat = ui.combatQueue.length > 0;
    useAggression(session.currentPoiId, true, isBusy, isInCombat, char.combatLevel, startCombat, addLog, monsterRespawnTimers, devMode.configAggroIds, devMode.isPlayerInvisible, isImmune, inv.equipment, inv.setEquipment, worldState);
    
    useEffect(() => { questLogic.checkGatherQuests(); }, [inv.inventory, questLogic]);
    
    // Save Game State Memoization
    const gameState = useMemo(() => ({
        username: initialState.username,
        skills: char.skills.map(({ name, level, xp }) => ({ name, level, xp })),
        inventory: inv.inventory, coins: inv.coins, equipment: inv.equipment, combatStance: char.combatStance,
        bank, currentHp: char.currentHp, currentPoiId: session.currentPoiId, playerQuests: quests.playerQuests, lockedPois: quests.lockedPois,
        clearedSkillObstacles, resourceNodeStates: skilling.resourceNodeStates, monsterRespawnTimers, shopStates: shops.shopStates, 
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
    }), [char, inv, session.currentPoiId, quests, skilling.resourceNodeStates, shops.shopStates, repeatableQuests, bank, clearedSkillObstacles, monsterRespawnTimers, slayer.slayerTask, initialState.username, worldState]);

    useSaveGame(gameState);
    
    useEffect(() => { if (ui.activePanel === null) ui.setActivePanel('inventory'); }, []);

    const isBankOpen = ui.activePanel === 'bank';
    const isShopOpen = !!ui.activeShopId;
    
    // Death Marker Countdown
    useEffect(() => {
        if (!worldState.deathMarker || worldState.deathMarker.timeRemaining <= 0) return;
        const timer = setInterval(() => {
            setWorldState(ws => {
                if (!ws.deathMarker) return ws;
                const newTime = ws.deathMarker.timeRemaining - 1000;
                if (newTime <= 0) {
                    addLog("Your dropped items have disappeared.");
                    groundItems.clearItemsAtPoi(ws.deathMarker.poiId);
                    return { ...ws, deathMarker: null };
                }
                return { ...ws, deathMarker: { ...ws.deathMarker, timeRemaining: newTime } };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [worldState.deathMarker, addLog, groundItems]);

    // Immunity Timer Logic
    useEffect(() => {
        if (!immunityUntil) {
            setIsImmune(false);
            setImmunityTimeLeft(0);
            return;
        }
        const timer = setInterval(() => {
            const now = Date.now();
            if (now < immunityUntil) {
                setIsImmune(true);
                setImmunityTimeLeft(Math.ceil((immunityUntil - now) / 1000));
            } else {
                setIsImmune(false);
                setImmunityUntil(null);
                addLog("Your aggression immunity has worn off.");
            }
        }, 1000);
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
        if (worldState.deathMarker && session.currentPoiId === worldState.deathMarker.poiId && !worldState.deathMarker.immunityGranted) {
            const immunityDuration = 30 * 1000; // 30 seconds
            setImmunityUntil(Date.now() + immunityDuration);
            addLog(`You are immune to monster aggression for 30 seconds.`);
            setWorldState(ws => {
                if (!ws.deathMarker) return ws;
                return { ...ws, deathMarker: { ...ws.deathMarker, immunityGranted: true } };
            });
        }
    }, [session.currentPoiId, worldState.deathMarker, addLog]);

    // Dev Handlers
    const handleHealPlayer = () => char.setCurrentHp(char.maxHp);
    const handleKillMonster = () => { if (ui.combatQueue.length > 0) setKillTrigger(k => k + 1); };
    const handleAddCoins = (amount: number) => inv.setCoins(c => c + amount);
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
                    <MainViewController {...{char, inv, quests, bank, bankLogic, shops, crafting, repeatableQuests, navigation, worldActions, slayer, questLogic, skilling, interactQuest, session, clearedSkillObstacles, monsterRespawnTimers, handlePlayerDeath, handleKill, handleDialogueAction: dialogueActions.handleDialogueAction, handleDialogueCheck: dialogueActions.handleDialogueCheck, combatSpeedMultiplier: devMode.combatSpeedMultiplier, activeCombatStyleHighlight: null, isTouchSimulationEnabled: devMode.isTouchSimulationEnabled, isMapManagerEnabled: devMode.isMapManagerEnabled, poiCoordinates: devMode.poiCoordinates, regionCoordinates: devMode.regionCoordinates, onUpdatePoiCoordinate: devMode.handleUpdatePoiCoordinate, poiConnections: devMode.poiConnections, onUpdatePoiConnections: devMode.handleUpdatePoiConnections, addLog, ui, onExportGame, onImportGame, onResetGame, initialState, showAllPois: devMode.showAllPois, groundItemsForCurrentPoi: groundItems.groundItemsForCurrentPoi, onPickUpItem: groundItems.handlePickUpItem, onTakeAllLoot: groundItems.handleTakeAllLoot, onItemDropped: groundItems.onItemDropped, isAutoBankOn: devMode.isAutoBankOn, handleCombatXpGain: char.addXp, immunityTimeLeft, poiImmunityTimeLeft, killTrigger, bankPlaceholders: worldState.bankPlaceholders ?? false, handleToggleBankPlaceholders, bonfires: bonfires.filter(b => b.uniqueId.startsWith(session.currentPoiId)), onStokeBonfire: crafting.handleStokeBonfire }} />
                    {levelUpInfo && <LevelUpAnimation skill={levelUpInfo.skill} level={levelUpInfo.level} />}
                    {groundItems.groundItemsForCurrentPoi.length > 0 && (
                        <button
                            onClick={() => ui.setIsLootViewOpen(true)}
                            className="absolute bottom-4 left-4 z-20 flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/80 animate-fade-in"
                            aria-label={`Loot ${groundItems.groundItemsForCurrentPoi.length} items`}
                            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
                        >
                            <img src="https://api.iconify.design/game-icons:swap-bag.svg" alt="" className="w-8 h-8 filter invert drop-shadow-lg" />
                            <span className="font-bold text-white text-lg">Loot ({groundItems.groundItemsForCurrentPoi.length})</span>
                        </button>
                    )}
                </div>
                <div className={`md:flex-shrink-0 relative`}>
                    <ActivityLog logs={activityLog} isDialogueActive={!!ui.activeDialogue} />
                    {ui.activeDialogue && <DialogueOverlay dialogue={ui.activeDialogue} setActivePanel={ui.setActivePanel} />}
                </div>
                 {ui.equipmentStats && <EquipmentStatsView 
                    equipment={inv.equipment} 
                    onClose={() => ui.setEquipmentStats(null)}
                    onUnequip={inv.handleUnequip}
                    setTooltip={ui.setTooltip}
                    ui={ui}
                    addLog={addLog}
                    onExamine={itemActions.handleExamine}
                    isTouchSimulationEnabled={devMode.isTouchSimulationEnabled}
                />}
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
                    // @fix: The 'onToggleTouchSimulation' function is returned by the 'useDevMode' hook and should be accessed through the 'devMode' object.
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
                    onDeposit={bankLogic.handleDeposit}
                    onCastSpell={spellcasting.onCastSpell}
                    onSpellOnItem={spellcasting.onSpellOnItem}
                    isEquipmentStatsOpen={!!ui.equipmentStats}
                />
            </div>
            <XpTracker drops={xpDrops} onRemoveDrop={removeXpDrop} />
            {ui.activeQuestDetail && <QuestDetailView questId={ui.activeQuestDetail.questId} playerQuests={ui.activeQuestDetail.playerQuests} onClose={() => ui.setActiveQuestDetail(null)} />}
            {ui.isAtlasViewOpen && <AtlasView currentPoiId={session.currentPoiId} unlockedPois={navigation.reachablePois} onClose={() => ui.setIsAtlasViewOpen(false)} setTooltip={ui.setTooltip} showAllPois={devMode.showAllPois} />}
            {ui.isExpandedMapViewOpen && <ExpandedMapView 
                currentPoiId={session.currentPoiId} 
                unlockedPois={navigation.reachablePois} 
                onNavigate={navigation.handleNavigate} 
                onClose={() => {
                    ui.setIsExpandedMapViewOpen(false);
                    ui.setActiveMapRegionId('world');
                }} 
                setTooltip={ui.setTooltip} 
                isMapManagerEnabled={devMode.isMapManagerEnabled} 
                poiCoordinates={devMode.poiCoordinates} 
                regionCoordinates={devMode.regionCoordinates} 
                onUpdatePoiCoordinate={devMode.handleUpdatePoiCoordinate} 
                poiConnections={devMode.poiConnections} 
                onUpdatePoiConnections={devMode.handleUpdatePoiConnections} 
                showAllPois={devMode.showAllPois} 
                addLog={addLog} 
                onCommitMapChanges={devMode.handleCommitMapChanges} 
                activeMapRegionId={ui.activeMapRegionId}
                setActiveMapRegionId={ui.setActiveMapRegionId}
                deathMarker={worldState.deathMarker}
            />}
            {ui.isDevPanelOpen && (
                <div className="absolute inset-0 bg-black/80 flex justify-end z-40 p-2 pointer-events-none" onClick={() => ui.setIsDevPanelOpen(false)}>
                    <div className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-md h-full flex flex-col pointer-events-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <DevPanel {...devPanelProps} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Game;