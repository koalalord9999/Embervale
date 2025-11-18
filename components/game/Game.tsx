
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CombatStance, PlayerSlayerTask, ShopStates, SkillName, POIActivity, InventorySlot, ActivePanel, Item, Region, POI, WorldState, GroundItem, Spell, GeneratedRepeatableQuest, BonfireActivity, BankTab, DialogueResponse, DialogueCheckRequirement, Monster, MonsterType, SpellElement, PlayerType, ActiveBuff, Equipment } from '../../types';
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
import { useThieving } from '../../hooks/useThieving';
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
import { useSceneInteractions } from '../../hooks/useSceneInteractions';
import { useDevMode } from '../../hooks/useDevMode';
import { useThievingPilfering } from '../../hooks/useThievingPilfering';
import { usePrayer } from '../../hooks/usePrayer';
import { useDehydration } from '../../hooks/useDehydration';
import { PRAYERS, ITEMS } from '../../constants';


import SidePanel from '../panels/SidePanel';
import ActivityLog from '../game/ActivityLog';
import XpTracker, { XpDrop } from '../ui/XpTracker';
import MainViewController from '../game/MainViewController';
import QuestDetailView from '../views/overlays/QuestDetailView';
import AtlasView from '../views/AtlasView';
import ExpandedMapView from '../views/ExpandedMapView';
import LevelUpAnimation from './LevelUpAnimation';
import DialogueOverlay from './dialogue/DialogueOverlay';
import LootButtonOverlay from './LootButtonOverlay';
import { useUIState } from '../../hooks/useUIState';
import { POIS } from '../../data/pois';
import DevPanel from '../panels/DevPanel';
import { FIREMAKING_RECIPES, QUESTS, MONSTERS } from '../../constants';
import SettingsView from '../panels/SettingsPanel';
import SkillGuideView from '../views/overlays/SkillGuideView';
import MonsterDBView from '../views/dev/MonsterDBView';

import { beasts } from '../../constants/monsters/beasts';
import { humanoids } from '../../constants/monsters/humanoids';
import { magicalAndUndead } from '../../constants/monsters/magicalAndUndead';
import { dragons } from '../../constants/monsters/dragons';
import BuffBar from './BuffBar';


interface GameProps {
    initialState: any;
    slotId: number;
    onReturnToMenu: (currentState: any) => void;
    ui: ReturnType<typeof useUIState>;
    assets: Record<string, string>;
    onExportGame: () => void;
    onImportGame: () => void;
    onResetGame: () => void;
}

const Game: React.FC<GameProps> = ({ initialState, slotId, onReturnToMenu, ui, assets, onExportGame, onImportGame, onResetGame }) => {
    // Core State Hooks
    const session = useGameSession(initialState.currentPoiId);
    const { activityLog, addLog, setActivityLog } = useActivityLog(initialState.activityLog || []);
    const [xpDrops, setXpDrops] = useState<XpDrop[]>([]);
    const [levelUpInfo, setLevelUpInfo] = useState<{ skill: SkillName; level: number } | null>(null);
    const [poiImmunityTimeLeft, setPoiImmunityTimeLeft] = useState(0);
    const [killTrigger, setKillTrigger] = useState(0);
    const [bonfires, setBonfires] = useState<BonfireActivity[]>([]);
    const [dynamicActivities, setDynamicActivities] = useState<POIActivity[] | null>(null);
    const [poisonEvent, setPoisonEvent] = useState<{ damage: number, timestamp: number } | null>(null);

    const isBusy = ui.isBusy;
    
    // DEV MODE STATE INITIALIZATION
    const handleTogglePermAggro = useCallback(() => {
        ui.setIsPermAggroOn(prev => {
            const newState = !prev;
            if (newState) {
                addLog(`System: Permanent aggression enabled for all monsters.`);
            } else {
                addLog(`System: Permanent aggression disabled.`);
            }
            return newState;
        });
    }, [ui, addLog]);
    useEffect(() => {
        if (initialState.settings?.devSettings) {
            const ds = initialState.settings.devSettings;
            ui.setXpMultiplier(ds.xpMultiplier ?? 1);
            ui.setCombatSpeedMultiplier(ds.combatSpeedMultiplier ?? 1);
            ui.setIsPlayerInvisible(ds.isPlayerInvisible ?? false);
            ui.setIsAutoBankOn(ds.isAutoBankOn ?? false);
            ui.setIsGodModeOn(ds.isGodModeOn ?? false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on initial mount

    // --- START DEV MODE LOGIC ---
    const devMode = useDevMode({
        initialState,
        devModeOverride: initialState.playerType === PlayerType.Cheats,
        isInCombat: ui.combatQueue.length > 0,
        ui,
        addLog,
        combatSpeedMultiplier: ui.combatSpeedMultiplier,
        setCombatSpeedMultiplier: ui.setCombatSpeedMultiplier,
        xpMultiplier: ui.xpMultiplier,
        setXpMultiplier: ui.setXpMultiplier,
        isPlayerInvisible: ui.isPlayerInvisible,
        setIsPlayerInvisible: ui.setIsPlayerInvisible,
        isAutoBankOn: ui.isAutoBankOn,
        setIsAutoBankOn: ui.setIsAutoBankOn,
        isGodModeOn: ui.isGodModeOn,
        setIsGodModeOn: ui.setIsGodModeOn,
    });
    const { isDevMode } = devMode;

    const effectiveXpMultiplier = isDevMode ? devMode.xpMultiplier : 1;
    const combatSpeedMultiplier = isDevMode ? devMode.combatSpeedMultiplier : 1;
    // --- END DEV MODE LOGIC ---

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

    const handlePoisonDamage = useCallback((damage: number) => {
        setPoisonEvent({ damage, timestamp: Date.now() });
    }, []);
    
    // Clear poison event after a short delay to prevent it from lingering in state
    // and being picked up by CombatView if combat starts later.
    useEffect(() => {
        if (poisonEvent) {
            const timer = setTimeout(() => setPoisonEvent(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [poisonEvent]);

    const [worldState, setWorldState] = useState<WorldState>(initialState.worldState);
    const charInitialData = useMemo(() => ({ skills: initialState.skills, combatStance: initialState.combatStance, currentHp: initialState.currentHp, currentPrayer: initialState.currentPrayer, autocastSpell: initialState.autocastSpell, statModifiers: initialState.statModifiers, activeBuffs: initialState.activeBuffs }), [initialState]);
    const charCallbacks = useMemo(() => ({ addLog, onXpGain: handleXpGain, onLevelUp: handleLevelUp, onPoisonDamage: handlePoisonDamage }), [addLog, handleXpGain, handleLevelUp, handlePoisonDamage]);
    
    const prayer = usePrayer(initialState.activePrayers || [], addLog);

    const char = useCharacter(
        charInitialData,
        charCallbacks,
        worldState,
        setWorldState,
        ui.combatQueue.length > 0,
        combatSpeedMultiplier,
        effectiveXpMultiplier,
        devMode.isGodModeOn,
        prayer.activePrayers,
        () => prayer.setActivePrayers([])
    );

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
    const invOptions = useMemo(() => ({ isAutoBankOn: devMode.isAutoBankOn, setBank, onItemDropped, setCombatStance: char.setCombatStance, playerQuests: quests.playerQuests, startQuest: quests.startQuest, closeDialogue: () => ui.setActiveDialogue(null) }), [devMode.isAutoBankOn, setBank, onItemDropped, char.setCombatStance, quests.playerQuests, quests.startQuest, ui]);
    const invInitialData = useMemo(() => ({ inventory: initialState.inventory, coins: initialState.coins, equipment: initialState.equipment }), [initialState]);
    const inv = useInventory(invInitialData, addLog, invOptions);
    useEffect(() => { invRef.current = inv; }, [inv]);
    
    // Logic Hooks
    const [clearedSkillObstacles, setClearedSkillObstacles] = useState(initialState.clearedSkillObstacles);
    const [monsterRespawnTimers, setMonsterRespawnTimers] = useState(initialState.monsterRespawnTimers);
    const isInCombat = ui.combatQueue.length > 0;
    
    const questLogic = useQuestLogic({ playerQuests: quests.playerQuests, setPlayerQuests: quests.setPlayerQuests, addLog, modifyItem: inv.modifyItem, addXp: char.addXp, hasItems: inv.hasItems, setLockedPois: quests.setLockedPois, setClearedSkillObstacles });
    
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
    
    const repeatableQuests = useRepeatableQuests(initialState.repeatableQuestsState, addLog, inv, char, onQuestAcceptedCallback);
    const skilling = useSkilling(initialState.resourceNodeStates, { addLog, skills: char.skills, addXp: char.addXp, inventory: inv.inventory, modifyItem: inv.modifyItem, equipment: inv.equipment, setEquipment: inv.setEquipment, checkQuestProgressOnShear: questLogic.checkQuestProgressOnShear, hasItems: inv.hasItems });
    const interactQuest = useInteractQuest({ addLog, activePlayerQuest: repeatableQuests.activePlayerQuest, handleTurnInRepeatableQuest: repeatableQuests.handleTurnInRepeatableQuest });
    const navigation = useNavigation({ session, lockedPois: quests.lockedPois, clearedSkillObstacles, addLog, isBusy, isInCombat, ui, skilling, interactQuest, isStunned: char.isStunned });

    useDehydration({
        session,
        inv,
        char,
        addLog,
        worldState,
        setWorldState,
        isInCombat,
    });

    const handlePlayerDeathRef = useRef<() => void>(null!);
    
    const thievingPilfering = useThievingPilfering({
        worldState,
        setWorldState,
        char,
        navigation,
        addLog,
        setDynamicActivities,
        session,
        inventory: inv.inventory,
        modifyItem: inv.modifyItem,
        isInCombat,
    });

    const thieving = useThieving(initialState.thievingContainerStates || {}, {
        addLog,
        skills: char.skills,
        addXp: char.addXp,
        inventory: inv.inventory,
        modifyItem: inv.modifyItem,
        equipment: inv.equipment,
        addBuff: char.addBuff,
        setPlayerHp: char.setCurrentHp,
        isStunned: char.isStunned,
        isInCombat,
        startCombat: (ids) => startCombat(ids),
        currentPoiId: session.currentPoiId,
        activeBuffs: char.activeBuffs,
        currentHp: char.currentHp,
        onPlayerDeath: () => handlePlayerDeathRef.current?.(),
        setWorldState,
        navigation,
        worldState,
    });
    
    const poi = useMemo(() => {
        const basePoi = POIS[session.currentPoiId];
        if (!basePoi) return null;
    
        if (repeatableQuests.activePlayerQuest && repeatableQuests.activePlayerQuest.generatedQuest.isInstance && repeatableQuests.activePlayerQuest.generatedQuest.instancePoiId === session.currentPoiId) {
            const quest = repeatableQuests.activePlayerQuest.generatedQuest;
            const newActivities: POIActivity[] = [...basePoi.activities];
            
            if (quest.type === 'kill' && quest.target.monsterId) {
                const remainingToKill = quest.requiredQuantity - repeatableQuests.activePlayerQuest.progress;
                
                for (let i = 0; i < remainingToKill; i++) {
                    newActivities.push({ type: 'combat', monsterId: quest.target.monsterId });
                }
            }
            return { ...basePoi, activities: newActivities };
        }
        
        if (basePoi.id === 'pilfering_house_instance' && dynamicActivities) {
            return { ...basePoi, activities: [...basePoi.activities, ...dynamicActivities] };
        }
    
        return basePoi;
    }, [session.currentPoiId, repeatableQuests.activePlayerQuest, dynamicActivities]);
    
    const shops = useShops(initialState.shopStates, inv.coins, inv.modifyItem, addLog, inv.inventory);
    const slayer = useSlayer(initialState.slayerTask, quests.playerQuests, { addLog, addXp: char.addXp, combatLevel: char.combatLevel, modifyItem: inv.modifyItem });
    
    const startCombat = useCallback((ids: string[]) => {
        if (ui.activeDialogue) {
            ui.setActiveDialogue(null);
        }
        ui.setCombatQueue(ids);
        ui.setIsMandatoryCombat(false);
        setPoisonEvent(null); // Clear poison event on combat start
    }, [ui]);

    // Add a wrapper for onStartCombat to handle single monster IDs from SceneView
    const onStartSingleCombat = useCallback((id: string) => {
        startCombat([id]);
    }, [startCombat]);

    const handleCombatFinish = useCallback(() => {
        if (devMode.isInstantRespawnOn && devMode.instantRespawnCounter !== null) {
            const newCount = devMode.instantRespawnCounter - 1;
            if (newCount <= 0) { devMode.setIsInstantRespawnOn(false); devMode.setInstantRespawnCounter(null); addLog('System: Instant respawn finished.'); } 
            else { devMode.setInstantRespawnCounter(newCount); addLog(`System: Instant respawn encounters remaining: ${newCount}.`); }
        }
    }, [devMode, addLog]);

    const playerDeath = usePlayerDeath({ skilling, interactQuest, ui, session, char, inv, addLog, playerQuests: quests.playerQuests, onItemDropped, setWorldState, playerType: initialState.playerType, slotId, onReturnToMenu, repeatableQuests, setDynamicActivities, worldState, onResetGame });
    
    const gameState = useMemo(() => ({
        username: initialState.username,
        playerType: initialState.playerType,
        skills: char.skills.map(({ currentLevel, ...rest }) => rest), // Strip out currentLevel
        inventory: inv.inventory,
        bank: bank,
        coins: inv.coins,
        equipment: inv.equipment,
        combatStance: char.combatStance,
        currentHp: char.currentHp,
        currentPrayer: char.rawCurrentPrayer,
        activePrayers: prayer.activePrayers,
        currentPoiId: session.currentPoiId,
        playerQuests: quests.playerQuests,
        lockedPois: quests.lockedPois,
        clearedSkillObstacles: clearedSkillObstacles,
        resourceNodeStates: skilling.resourceNodeStates,
        monsterRespawnTimers: monsterRespawnTimers,
        groundItems: allGroundItems,
        activityLog: activityLog,
        repeatableQuestsState: {
            boards: repeatableQuests.boards,
            activePlayerQuest: repeatableQuests.activePlayerQuest,
            nextResetTimestamp: repeatableQuests.nextResetTimestamp,
            completedQuestIds: repeatableQuests.completedQuestIds,
            boardCompletions: repeatableQuests.boardCompletions,
        },
        slayerTask: slayer.slayerTask,
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
            devSettings: {
                xpMultiplier: devMode.xpMultiplier,
                combatSpeedMultiplier: devMode.combatSpeedMultiplier,
                isPlayerInvisible: devMode.isPlayerInvisible,
                isAutoBankOn: devMode.isAutoBankOn,
                isGodModeOn: devMode.isGodModeOn,
            }
        },
        statModifiers: char.statModifiers,
        activeBuffs: char.activeBuffs,
        isDead: char.currentHp <= 0,
        combatLevel: char.combatLevel,
    }), [
        initialState.username, initialState.playerType,
        char.skills, char.combatStance, char.currentHp, char.rawCurrentPrayer, char.autocastSpell, char.statModifiers, char.activeBuffs, char.combatLevel, prayer.activePrayers,
        inv.inventory, inv.coins, inv.equipment, bank, session.currentPoiId, quests.playerQuests, quests.lockedPois, clearedSkillObstacles,
        skilling.resourceNodeStates, monsterRespawnTimers, allGroundItems, activityLog, repeatableQuests, slayer.slayerTask, worldState,
        ui.showTooltips, ui.showXpDrops, ui.confirmValuableDrops, ui.valuableDropThreshold, ui.showMinimapHealth, ui.showCombatPlayerHealth, ui.showCombatEnemyHealth, ui.showHitsplats, ui.isOneClickMode,
        devMode.xpMultiplier, devMode.combatSpeedMultiplier, devMode.isPlayerInvisible, devMode.isAutoBankOn, devMode.isGodModeOn
    ]);

    const handlePlayerDeath = useCallback((currentState: any) => { playerDeath.handlePlayerDeath(currentState); handleCombatFinish(); }, [playerDeath, handleCombatFinish]);
    
    useEffect(() => {
        handlePlayerDeathRef.current = () => handlePlayerDeath(gameState);
    }, [gameState, handlePlayerDeath]);
    
    const bankLogic = useBank({ bank, setBank }, { addLog, ...inv, ...char, setCombatStance: char.setCombatStance, bankPlaceholders: worldState.bankPlaceholders ?? false });
    
    const setWindmillFlour = useCallback((updater: React.SetStateAction<number>) => {
        setWorldState(prev => {
            const newFlour = typeof updater === 'function' ? updater(prev.windmillFlour) : updater;
            return { ...prev, windmillFlour: newFlour };
        });
    }, []);
    
    const onCreateBonfire = useCallback((logId: string) => {
        const recipe = FIREMAKING_RECIPES.find(r => r.logId === logId);
        if (!recipe) return;
        const duration = (30 + recipe.level * 2) * 1000;
        const newBonfire: BonfireActivity = {
            type: 'bonfire',
            uniqueId: `${session.currentPoiId}-${Date.now()}`,
            logId,
            expiresAt: Date.now() + duration,
            poiId: session.currentPoiId,
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

    const crafting = useCrafting({ skills: char.skills, hasItems: inv.hasItems, addLog, activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction, inventory: inv.inventory, modifyItem: inv.modifyItem, addXp: char.addXp, checkQuestProgressOnSpin: questLogic.checkQuestProgressOnSpin, checkQuestProgressOnSmith: questLogic.checkQuestProgressOnSmith, checkQuestProgressOnOffer: questLogic.checkQuestProgressOnOffer, advanceTutorial: (condition: string) => {}, closeCraftingView: ui.closeCraftingView, setWindmillFlour, equipment: inv.equipment, setEquipment: inv.setEquipment, worldState, setWorldState, onCreateBonfire, onRefreshBonfire, isInCombat, currentPrayer: char.currentPrayer, setCurrentPrayer: char.setCurrentPrayer });
    const worldActions = useWorldActions({ hasItems: inv.hasItems, inventory: inv.inventory, modifyItem: inv.modifyItem, addLog, coins: inv.coins, skills: char.skills, addXp: char.addXp, setClearedSkillObstacles, playerQuests: quests.playerQuests, setMakeXPrompt: ui.setMakeXPrompt, windmillFlour: worldState.windmillFlour, setWindmillFlour, setActiveCraftingAction: ui.setActiveCraftingAction, setInventory: inv.setInventory, equipment: inv.equipment });
    const dialogueActions = useDialogueActions({ quests, questLogic, navigation, inv, char, worldActions, addLog, worldState, setBank, setActivityLog, repeatableQuests, ui, setWorldState, session });
    const { handleDialogueCheck, onResponse } = dialogueActions;
    
    const itemActions = useItemActions({ 
        crafting, addLog, currentHp: char.currentHp, maxHp: char.maxHp, setCurrentHp: char.setCurrentHp, 
        currentPrayer: char.currentPrayer, maxPrayer: char.maxPrayer, setCurrentPrayer: char.setCurrentPrayer,
        applyStatModifier: char.applyStatModifier, addBuff: char.addBuff, curePoison: char.curePoison, setInventory: inv.setInventory, 
        skills: char.skills, inventory: inv.inventory, activeCraftingAction: ui.activeCraftingAction, 
        setActiveCraftingAction: ui.setActiveCraftingAction, hasItems: inv.hasItems, modifyItem: inv.modifyItem, 
        addXp: char.addXp, openCraftingView: ui.openCraftingView, itemToUse: ui.itemToUse, setItemToUse: ui.setItemToUse, 
        setConfirmationPrompt: ui.setConfirmationPrompt,
        setMakeXPrompt: ui.setMakeXPrompt, 
        startQuest: (questId) => { quests.startQuest(questId, addLog); }, 
        currentPoiId: session.currentPoiId, playerQuests: quests.playerQuests, isStunned: char.isStunned, 
        setActiveDungeonMap: ui.setActiveDungeonMap, confirmValuableDrops: ui.confirmValuableDrops, 
        valuableDropThreshold: ui.valuableDropThreshold, ui, equipment: inv.equipment, onResponse, handleDialogueCheck, setEquipment: inv.setEquipment,
        navigation
    });
    
    const spellActions = useSpellActions({ addLog, addXp: char.addXp, modifyItem: inv.modifyItem, hasItems: inv.hasItems, skills: char.skills, ui, equipment: inv.equipment, currentPoiId: session.currentPoiId, setInventory: inv.setInventory });

    const sceneInteractions = useSceneInteractions(session.currentPoiId, {
        playerQuests: quests.playerQuests,
        setActiveDialogue: ui.setActiveDialogue,
        handleDialogueCheck,
        onResponse,
        addLog,
        inventory: inv.inventory,
    });
    
    const killHandler = useKillHandler({ questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn: devMode.isInstantRespawnOn, setWorldState, addLog, worldState, inv, navigation });
    const handleKill = useCallback((id: string, style?: 'melee' | 'ranged' | 'magic') => { killHandler.handleKill(id, style); }, [killHandler]);
    const handleEncounterWin = useCallback((ids: string[]) => { killHandler.handleEncounterWin(ids); }, [killHandler]);
    
    const spellcasting = useSpellcasting({ char, inv, addLog, navigation, ui, isStunned: char.isStunned });
    
    useSaveGame(gameState, slotId);
    
    const onWinCombat = useCallback(() => {
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);
        handleCombatFinish();
        setPoisonEvent(null); // Clear poison event on combat end
    }, [ui, handleCombatFinish]);

    const onFleeFromCombat = useCallback((defeatedIds: string[]) => {
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);
        setPoisonEvent(null); // Clear poison event on flee
    
        if (defeatedIds.length > 0) {
            killHandler.handleEncounterWin(defeatedIds);
        }
        
        const fleePoiId = session.currentPoiId;
        setWorldState(ws => ({
            ...ws,
            poiImmunity: {
                ...(ws.poiImmunity ?? {}),
                [fleePoiId]: Date.now() + 10000 // 10 seconds immunity for this POI
            }
        }));
        addLog("You flee from combat, gaining 10 seconds of aggression immunity in this area.");
    }, [ui, addLog, session, setWorldState, killHandler]);
    
    useAggression(
        poi,
        true, // isGameLoaded
        isBusy,
        isInCombat,
        char.combatLevel,
        startCombat,
        addLog,
        monsterRespawnTimers,
        ui.isPermAggroOn,
        devMode.isPlayerInvisible,
        false, // isPlayerImmune
        inv.equipment,
        inv.setEquipment,
        worldState,
        repeatableQuests.activePlayerQuest
    );
    
    useEffect(() => { questLogic.checkGatherQuests(); }, [inv.inventory, questLogic]);

    useEffect(() => {
        if (initialState.settings) {
            const s = initialState.settings;
            ui.setShowTooltips(s.showTooltips ?? true);
            ui.setShowXpDrops(s.showXpDrops ?? true);
            ui.setConfirmValuableDrops(s.confirmValuableDrops ?? true);
            ui.setValuableDropThreshold(s.valuableDropThreshold ?? 1000);
            ui.setShowMinimapHealth(s.showMinimapHealth ?? false);
            ui.setShowCombatPlayerHealth(s.showCombatPlayerHealth ?? false);
            ui.setShowCombatEnemyHealth(s.showCombatEnemyHealth ?? false);
            ui.setShowHitsplats(s.showHitsplats ?? true);
            ui.setIsOneClickMode(s.isOneClickMode ?? false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const handleBonfireTick = useCallback(() => {
        const now = Date.now();
        setBonfires(prevBonfires => {
            const activeBonfires: BonfireActivity[] = [];
            let changed = false;
            prevBonfires.forEach(bonfire => {
                if (now >= bonfire.expiresAt) {
                    changed = true;
                    onItemDropped({ itemId: 'ashes', quantity: 1 }, bonfire.poiId);
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
            const expiryTime = Date.now() + immunityDuration;
            
            setWorldState(ws => {
                if (!ws.deathMarker) return ws;
                return { 
                    ...ws, 
                    deathMarker: { ...ws.deathMarker, immunityGranted: true },
                    poiImmunity: {
                        ...(ws.poiImmunity ?? {}),
                        [session.currentPoiId]: expiryTime
                    }
                };
            });
            addLog(`You are immune to monster aggression in this area for 30 seconds.`);
        }
    }, [session.currentPoiId, worldState.deathMarker, addLog, setWorldState]);

    useEffect(() => {
        const quest = repeatableQuests.activePlayerQuest;
        if (quest && quest.generatedQuest.id === 'kill_rats_meadowdale' && quest.progress >= quest.generatedQuest.requiredQuantity) {
            if (session.currentPoiId === 'tavern_cellar') {
                // Turn in the quest automatically
                repeatableQuests.handleTurnInRepeatableQuest();

                addLog("You've cleared the cellar! You are automatically moved back upstairs.");
                
                const cellarItems = allGroundItems['tavern_cellar'] || [];
                cellarItems.forEach(item => onItemDropped(item.item, 'the_rusty_flagon'));
                clearAllItemsAtPoi('tavern_cellar');

                navigation.handleForcedNavigate('the_rusty_flagon');
            }
        }
    }, [repeatableQuests.activePlayerQuest, session.currentPoiId, repeatableQuests, addLog, allGroundItems, onItemDropped, clearAllItemsAtPoi, navigation]);
    
    const handleActivityClickWrapper = (activity: POIActivity) => {
        if (ui.itemToUse) {
            itemActions.handleUseItemOnActivity(ui.itemToUse, activity);
            ui.setItemToUse(null);
        } else if (ui.spellToCast) {
            addLog("You can't cast that on the environment.");
            ui.setSpellToCast(null);
        } else if (activity.type === 'npc' && activity.name === 'Leave House') {
            thievingPilfering.leaveHouse();
            return;
        } else if (activity.type === 'npc') {
            sceneInteractions.handleActivityClick(activity);
        } else {
            handleNonNpcActivity(activity);
        }
    };
    
    const handleNonNpcActivity = useCallback((activity: POIActivity) => {
        if (ui.activeDialogue) {
            ui.setActiveDialogue(null);
        }
        if (char.isStunned) { addLog("You are stunned and cannot perform actions."); return; }
        if (activity.type === 'shop') ui.setActiveShopId(activity.shopId);
        else if (activity.type === 'bank') ui.setActivePanel('bank');
        else if (activity.type === 'slayer_master') slayer.handleSlayerMasterInteraction();
        else if (activity.type === 'blimp_travel') {
            const slayerLevel = char.skills.find(s => s.name === SkillName.Slayer)?.level ?? 1;
            if (slayerLevel < activity.requiredSlayerLevel) addLog(`You need a Slayer level of ${activity.requiredSlayerLevel} to use this service.`);
            else addLog("The blimp service to other regions is not yet available.");
        }
        else if (activity.type === 'cooking_range') ui.openCraftingView({ type: 'cooking_range' });
        else if (activity.type === 'furnace') ui.openCraftingView({ type: 'furnace' });
        else if (activity.type === 'anvil') ui.openCraftingView({ type: 'anvil' });
        else if (activity.type === 'bookbinding_workbench') ui.openCraftingView({ type: 'bookbinding' });
        else if (activity.type === 'spinning_wheel') ui.openCraftingView({ type: 'spinning_wheel' });
        else if (activity.type === 'wishing_well') worldActions.handleWishingWell();
        else if (activity.type === 'water_source') worldActions.handleCollectWater(activity);
        else if (activity.type === 'milking') worldActions.handleMilking();
        else if (activity.type === 'quest_board') ui.setActiveQuestBoardId(session.currentPoiId);
        else if (activity.type === 'ancient_chest') worldActions.handleOpenAncientChest();
        else if (activity.type === 'runecrafting_altar') crafting.handleInstantRunecrafting(activity.runeId);
        else if (activity.type === 'ladder') navigation.handleForcedNavigate(activity.toPoiId);
        else if (activity.type === 'thieving_lockpick') thieving.handleLockpick(activity);
        else if (activity.type === 'thieving_stall') thieving.handleStealFromStall(activity);
        else if (activity.type === 'thieving_pilfer') thievingPilfering.handlePilfer(activity);
        else if (activity.type === 'cut_cactus') worldActions.handleCutCactus();
    }, [char, addLog, ui, slayer, worldActions, crafting, navigation, session, thieving, thievingPilfering]);

    useEffect(() => { if (ui.activePanel === null) ui.setActivePanel('inventory'); }, [ui]);

    const isBankOpen = ui.activePanel === 'bank';
    const isShopOpen = !!ui.activeShopId;
    
    // Dev Handlers
    const handleHealPlayer = () => char.setCurrentHp(char.maxHp);
    const handleKillMonster = () => { if (ui.combatQueue.length > 0) setKillTrigger(k => k + 1); };
    const handleAddCoins = (amount: number) => inv.modifyItem('coins', amount, false);
    const handleSetSkillLevel = (skill: SkillName, level: number) => char.setSkillLevel(skill, level);
    const handleResetQuest = (questId: string) => quests.resetQuest(questId, addLog);

    const handleLogout = useCallback(() => {
        onReturnToMenu(gameState);
    }, [onReturnToMenu, gameState]);

    const buffsForDisplay = useMemo(() => {
        const allBuffs: ActiveBuff[] = [...char.activeBuffs];
        if (worldState.dehydrationLevel > 0) {
            allBuffs.push({
                id: -999, // static id for dehydration
                type: 'dehydration', // custom type for BuffBar to recognize
                value: worldState.dehydrationLevel,
                duration: Infinity,
                durationRemaining: Infinity
            } as any); // Cast as any to avoid changing ActiveBuff type everywhere
        }
        return allBuffs;
    }, [char.activeBuffs, worldState.dehydrationLevel]);

    const devPanelProps = useMemo(() => ({
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
        isInCombat,
        isPermAggroOn: ui.isPermAggroOn,
        onTogglePermAggro: handleTogglePermAggro,
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
        onClose: () => ui.setIsDevPanelOpen(false),
        onHealPlayer: handleHealPlayer,
        onKillMonster: handleKillMonster,
        onAddCoins: handleAddCoins,
        onSetSkillLevel: handleSetSkillLevel,
        onResetQuest: handleResetQuest,
        onResetQuestBoards: repeatableQuests.resetBoards,
        onResetPilferingHouses: thievingPilfering.resetPilferingTimers,
        isGodModeOn: devMode.isGodModeOn,
        setIsGodModeOn: devMode.setIsGodModeOn,
        ui,
    }), [
        inv, ui, devMode.devPanelState, devMode.updateDevPanelState, devMode.combatSpeedMultiplier, devMode.setCombatSpeedMultiplier,
        devMode.isInstantRespawnOn, devMode.setIsInstantRespawnOn, devMode.instantRespawnCounter, devMode.setInstantRespawnCounter,
        isInCombat, ui.isPermAggroOn, handleTogglePermAggro, devMode.isPlayerInvisible,
        devMode.setIsPlayerInvisible, devMode.isAutoBankOn, devMode.setIsAutoBankOn, devMode.isTouchSimulationEnabled,
        devMode.onToggleTouchSimulation, devMode.isMapManagerEnabled, devMode.onToggleMapManager, devMode.handleCommitMapChanges, devMode.modifiedPois, devMode.modifiedRegions,
        devMode.showAllPois, devMode.setShowAllPois, navigation.handleForcedNavigate,
        devMode.xpMultiplier, devMode.setXpMultiplier, devMode.isGodModeOn, devMode.setIsGodModeOn,
        handleResetQuest, repeatableQuests.resetBoards, thievingPilfering.resetPilferingTimers
    ]);
    
    // Centralized death check
    useEffect(() => {
        if (char.currentHp <= 0) {
            handlePlayerDeath(gameState);
        }
    }, [char.currentHp, gameState, handlePlayerDeath]);

    return (
        <>
            <div className="w-full md:w-4/5 flex flex-col gap-2 relative">
                <BuffBar statModifiers={char.statModifiers} activeBuffs={buffsForDisplay} />
                <div className="bg-black/70 border-2 border-gray-600 rounded-lg p-4 flex-grow min-h-0 relative overflow-y-auto md:overflow-visible">
                    <MainViewController {...{itemActions, char, inv, quests, bank, bankLogic, shops, crafting, repeatableQuests, navigation, worldActions, slayer, questLogic, skilling, interactQuest, session, clearedSkillObstacles, monsterRespawnTimers, handlePlayerDeath: () => handlePlayerDeath(gameState), handleKill, onWinCombat, onFleeFromCombat, onResponse, handleDialogueCheck, combatSpeedMultiplier: devMode.combatSpeedMultiplier, activeCombatStyleHighlight: null, isTouchSimulationEnabled: devMode.isTouchSimulationEnabled, isMapManagerEnabled: false, poiCoordinates: undefined, regionCoordinates: undefined, onUpdatePoiCoordinate: undefined, poiConnections: undefined, addLog, ui, initialState, showAllPois: devMode.showAllPois, groundItemsForCurrentPoi, onPickUpItem: handlePickUpItem, onTakeAllLoot: handleTakeAllLoot, onItemDropped, isAutoBankOn: devMode.isAutoBankOn, handleCombatXpGain: char.addXp, poiImmunityTimeLeft, killTrigger, bankPlaceholders: worldState.bankPlaceholders ?? false, handleToggleBankPlaceholders, bonfires: bonfires.filter(b => b.uniqueId.startsWith(session.currentPoiId)), onStokeBonfire: crafting.handleStokeBonfire, isStunned: char.isStunned, addBuff: char.addBuff, isDevMode: devMode.isDevMode, onToggleDevPanel: () => ui.setIsDevPanelOpen(true), onToggleTouchSimulation: devMode.onToggleTouchSimulation, onDepositEquipment: () => bankLogic.handleDepositEquipment(ui.activeBankTabId), deathMarker: worldState.deathMarker, activeRepeatableQuest: repeatableQuests.activePlayerQuest, onActivity: handleActivityClickWrapper, onResetGame, onImportGame, onExportGame, isOneClickMode: ui.isOneClickMode, poi, thievingContainerStates: thieving.containerStates, onPickpocket: thieving.handlePickpocket, onLockpick: thieving.handleLockpick, onPilfer: thievingPilfering.handlePilfer, onStealFromStall: thieving.handleStealFromStall, worldState, onStartCombat: onStartSingleCombat, onEncounterWin: handleEncounterWin, activePrayers: prayer.activePrayers, onJewelryCraft: crafting.handleJewelryCrafting, setEquipment: inv.setEquipment, poisonEvent }} />
                        {levelUpInfo && <LevelUpAnimation skill={levelUpInfo.skill} level={levelUpInfo.level} />}
                        <LootButtonOverlay groundItems={groundItemsForCurrentPoi} onOpenLootView={() => ui.setIsLootViewOpen(true)} />
                </div>
                <div className={`md:flex-shrink-0 relative`}>
                    <ActivityLog logs={activityLog} isDialogueActive={!!ui.activeDialogue} />
                    {ui.activeDialogue && <DialogueOverlay dialogue={ui.activeDialogue} setActivePanel={ui.setActivePanel} />}
                </div>
            </div>
            <div className="w-full md:w-1/5 flex flex-col">
                <SidePanel {...{ui, initialState, char, inv, quests, repeatableQuests, slayer, onReturnToMenu: handleLogout, isDevMode: devMode.isDevMode, isTouchSimulationEnabled: devMode.isTouchSimulationEnabled, onToggleTouchSimulation: devMode.onToggleTouchSimulation, itemActions, isBusy, handleExamine: itemActions.handleExamine, session, addLog, activeCombatStyleHighlight: null, onNavigate: navigation.handleNavigate, unlockedPois: navigation.reachablePois, isBankOpen, isShopOpen, onDeposit: (inventoryIndex, quantity) => bankLogic.handleDeposit(inventoryIndex, quantity, ui.activeBankTabId), onCastSpell: spellcasting.onCastSpell, onSpellOnItem: spellActions.handleSpellOnItem, isEquipmentStatsOpen: !!ui.isEquipmentStatsViewOpen, activePrayers: prayer.activePrayers, onTogglePrayer: (prayerId: string) => prayer.togglePrayer(prayerId, char.skills, quests.playerQuests, char.rawCurrentPrayer), isPoisoned: char.isPoisoned, onCurePoison: itemActions.handleCurePoisonFromOrb, poisonEvent }} />
            </div>
            {ui.showXpDrops && <XpTracker drops={xpDrops} onRemoveDrop={removeXpDrop} />}
            {ui.isDevPanelOpen && (
                <div className="absolute inset-0 bg-black/80 flex justify-end z-40 p-2 pointer-events-none" onClick={() => ui.setIsDevPanelOpen(false)}>
                    <div className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-md h-full flex flex-col pointer-events-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <DevPanel {...devPanelProps} isCurrentMonsterAggro={devMode.isCurrentMonsterAggro} onToggleAggro={devMode.onToggleAggro}/>
                    </div>
                </div>
            )}
             {ui.isMonsterDBOpen && (
                <MonsterDBView
                    monsters={devMode.monsterData}
                    setMonsters={devMode.setMonsterData}
                    modifiedMonsters={devMode.modifiedMonsters}
                    setModifiedMonsters={devMode.setModifiedMonsters}
                    onClose={() => ui.setIsMonsterDBOpen(false)}
                    setTooltip={ui.setTooltip}
                    onCommit={devMode.handleCommitMapChanges}
                    hasChanges={devMode.modifiedMonsters.size > 0}
                />
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
            {ui.activeSkillGuide && <SkillGuideView activeSkill={ui.activeSkillGuide} setActiveSkill={ui.setActiveSkillGuide} onClose={ui.closeSkillGuide} playerSkills={char.skills} />}
            {ui.isSettingsViewOpen && (
                <SettingsView
                    onClose={() => ui.setIsSettingsViewOpen(false)}
                    onExportGame={onExportGame}
                    onImportGame={onImportGame}
                    onResetGame={onResetGame}
                    isDevMode={isDevMode}
                    onToggleDevPanel={() => ui.setIsDevPanelOpen(true)}
                    isTouchSimulationEnabled={devMode.isTouchSimulationEnabled}
                    onToggleTouchSimulation={devMode.onToggleTouchSimulation}
                    ui={ui}
                    bankPlaceholders={worldState.bankPlaceholders ?? false}
                    handleToggleBankPlaceholders={handleToggleBankPlaceholders}
                />
            )}
        </>
    );
};

export default Game;
