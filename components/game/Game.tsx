

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CombatStance, PlayerSlayerTask, ShopStates, SkillName, POIActivity, InventorySlot, ActivePanel, Item, Region, POI, WorldState, GroundItem, Spell, GeneratedRepeatableQuest } from '../../types';
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
import { useTutorial } from '../../hooks/useTutorial';
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
import TutorialOverlay from './TutorialOverlay';
import LevelUpAnimation from './LevelUpAnimation';
import DialogueOverlay from './dialogue/DialogueOverlay';
import { useUIState } from '../../hooks/useUIState';
import { POIS } from '../../data/pois';

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
    const { activityLog, addLog: originalAddLog, setActivityLog } = useActivityLog([]);
    const [tutorialLogMessage, setTutorialLogMessage] = useState<string | null>(null);
    const [xpDrops, setXpDrops] = useState<XpDrop[]>([]);
    const [levelUpInfo, setLevelUpInfo] = useState<{ skill: SkillName; level: number } | null>(null);
    
    // Dev Mode Hook
    const devMode = useDevMode({ initialState, devModeOverride, isInCombat: ui.combatQueue.length > 0, ui, addLog: originalAddLog });
    
    const isBusy = !!ui.activeCraftingAction;
    const effectiveXpMultiplier = devMode.isDevMode && devMode.isXpBoostEnabled ? devMode.xpMultiplier : 1;

    // World & Quest State Hooks
    const quests = useQuests({ playerQuests: initialState.playerQuests, lockedPois: initialState.lockedPois });
    
    // Tutorial Hook
    const tutorial = useTutorial({
        initialState,
        session,
        addLog: (message: string) => setTutorialLogMessage(message),
        originalAddLog,
        setTutorialLogMessage,
        questLogic: null as any, // Placeholder, will be replaced
        ui,
        setPlayerQuests: quests.setPlayerQuests,
    });
    
    // AddLog logic depends on tutorial stage
    const addLog = useCallback((message: string) => {
        if (tutorial.tutorialStage >= 0) {
            // During the tutorial, filter out generic "Gained" messages to reduce spam.
            if (message.startsWith('Gained ')) {
                // However, we need to check for ore gathering to advance the tutorial
                if (tutorial.tutorialStage === 15 && (message.includes('Copper Ore') || message.includes('Tin Ore'))) {
                    // This check will be performed by the useEffect hook below
                }
                return;
            }
            setTutorialLogMessage(message);
        } else {
            originalAddLog(message);
        }
    }, [tutorial.tutorialStage, originalAddLog, setTutorialLogMessage]);

    // Character & Item Hooks
    const handleXpGain = useCallback((skillName: SkillName, amount: number) => {
        if (amount > 0) {
            setXpDrops(prev => [...prev, { id: Date.now() + Math.random(), skillName, amount }]);
            tutorial.advanceOnCombatXpGain(skillName);
            if (tutorial.tutorialStage === 24 && skillName === SkillName.Hitpoints) {
                tutorial.advanceTutorial('kill-rat');
            }
        }
    }, [tutorial.tutorialStage, tutorial.advanceOnCombatXpGain, tutorial.advanceTutorial]);

    const removeXpDrop = useCallback((id: number) => setXpDrops(prev => prev.filter(drop => drop.id !== id)), []);
    const handleLevelUp = useCallback((skill: SkillName, level: number) => {
        setLevelUpInfo({ skill, level });
        const duration = level === 99 ? 8000 : 4000;
        setTimeout(() => setLevelUpInfo(null), duration);
    }, []);
    
    const charInitialData = useMemo(() => ({ skills: initialState.skills, combatStance: initialState.combatStance, currentHp: initialState.currentHp, autocastSpell: initialState.autocastSpell }), [initialState]);
    const charCallbacks = useMemo(() => ({ addLog, onXpGain: handleXpGain, onLevelUp: handleLevelUp }), [addLog, handleXpGain, handleLevelUp]);
    const char = useCharacter(charInitialData, charCallbacks, ui.combatQueue.length > 0, devMode.combatSpeedMultiplier, effectiveXpMultiplier);

    const invRef = useRef<ReturnType<typeof useInventory> | null>(null);
    const groundItems = useGroundItems({ session, invRef, addLog, ui });
    const [bank, setBank] = useState<(InventorySlot | null)[]>(padBank(initialState.bank));
    const bankOptions = useMemo(() => ({ isAutoBankOn: devMode.isAutoBankOn, bank, setBank, onItemDropped: groundItems.onItemDropped, setCombatStance: char.setCombatStance }), [devMode.isAutoBankOn, bank, setBank, groundItems.onItemDropped, char.setCombatStance]);
    const invInitialData = useMemo(() => ({ inventory: initialState.inventory, coins: initialState.coins, equipment: initialState.equipment }), [initialState]);
    const inv = useInventory(invInitialData, addLog, tutorial.advanceTutorial, bankOptions);
    
    const [clearedSkillObstacles, setClearedSkillObstacles] = useState(initialState.clearedSkillObstacles);
    const [monsterRespawnTimers, setMonsterRespawnTimers] = useState(initialState.monsterRespawnTimers);
    const [windmillFlour, setWindmillFlour] = useState(initialState.worldState?.windmillFlour ?? 0);

    // Logic Hooks
    const questLogic = useQuestLogic({ playerQuests: quests.playerQuests, setPlayerQuests: quests.setPlayerQuests, addLog, modifyItem: inv.modifyItem, addXp: char.addXp, hasItems: inv.hasItems, setLockedPois: quests.setLockedPois, setClearedSkillObstacles });
    
    // Refill placeholder in tutorial hook now that questLogic exists
    (tutorial as any).deps.questLogic = questLogic;

    const slayer = useSlayer(initialState.slayerTask, { addLog, addXp: char.addXp, combatLevel: char.combatLevel, modifyItem: inv.modifyItem });
    const repeatableQuests = useRepeatableQuests(initialState.repeatableQuestsState, addLog, inv, char);
    const bankLogic = useBank({ bank, setBank }, { addLog, ...inv, ...char, setCombatStance: char.setCombatStance });
    const shops = useShops(initialState.shopStates, inv.coins, inv.modifyItem, addLog);
    const skilling = useSkilling(initialState.resourceNodeStates, { addLog, skills: char.skills, addXp: (skill, amount) => { char.addXp(skill, amount); if(skill === SkillName.Woodcutting) tutorial.advanceTutorial('chop-log'); }, inventory: inv.inventory, modifyItem: inv.modifyItem, equipment: inv.equipment });
    const interactQuest = useInteractQuest({ addLog, activePlayerQuest: repeatableQuests.activePlayerQuest, handleTurnInRepeatableQuest: repeatableQuests.handleTurnInRepeatableQuest });
    const crafting = useCrafting({ skills: char.skills, hasItems: inv.hasItems, addLog, activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction, inventory: inv.inventory, modifyItem: inv.modifyItem, addXp: char.addXp, checkQuestProgressOnSpin: questLogic.checkQuestProgressOnSpin, checkQuestProgressOnSmith: questLogic.checkQuestProgressOnSmith, advanceTutorial: tutorial.advanceTutorial, closeCraftingView: ui.closeCraftingView, setWindmillFlour, equipment: inv.equipment });
    const navigation = useNavigation({ session, lockedPois: quests.lockedPois, clearedSkillObstacles, addLog, isBusy, isInCombat: ui.combatQueue.length > 0, ui, skilling, interactQuest });
    const spellcasting = useSpellcasting({ char, inv, addLog, navigation });
    const worldActions = useWorldActions({ hasItems: inv.hasItems, inventory: inv.inventory, modifyItem: inv.modifyItem, addLog, coins: inv.coins, skills: char.skills, addXp: char.addXp, setClearedSkillObstacles, playerQuests: quests.playerQuests, checkQuestProgressOnShear: questLogic.checkQuestProgressOnShear, setMakeXPrompt: ui.setMakeXPrompt, windmillFlour, setWindmillFlour, setActiveCraftingAction: ui.setActiveCraftingAction });
    const dialogueActions = useDialogueActions({ quests, questLogic, navigation, inv, char, worldActions, addLog });
    
    const handleExamine = useCallback((item: Item) => {
        ui.setActiveDialogue({ npcName: `Examine: ${item.name}`, npcIcon: item.iconUrl, nodes: { start: { npcName: `Examine: ${item.name}`, npcIcon: item.iconUrl, text: item.description, responses: [] }}, currentNodeKey: 'start', onEnd: () => ui.setActiveDialogue(null), onAction: () => {}, onNavigate: () => {} });
    }, [ui]);
    const itemActions = useItemActions({ addLog, currentHp: char.currentHp, maxHp: char.maxHp, setCurrentHp: char.setCurrentHp, applyStatModifier: char.applyStatModifier, setInventory: inv.setInventory, skills: char.skills, inventory: inv.inventory, activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction, hasItems: inv.hasItems, modifyItem: inv.modifyItem, addXp: char.addXp, openCraftingView: ui.openCraftingView, setItemToUse: ui.setItemToUse, addBuff: char.addBuff, setMakeXPrompt: ui.setMakeXPrompt, startQuest: (questId) => { quests.startQuest(questId, addLog); }, advanceTutorial: tutorial.advanceTutorial, currentPoiId: session.currentPoiId });

    const { handlePlayerDeath: baseHandlePlayerDeath } = usePlayerDeath({ skilling, interactQuest, ui, session, char, inv, addLog, tutorialStage: tutorial.tutorialStage });
    const handleCombatFinish = useCallback(() => {
        if (devMode.isInstantRespawnOn && devMode.instantRespawnCounter !== null) {
            const newCount = devMode.instantRespawnCounter - 1;
            if (newCount <= 0) { devMode.setIsInstantRespawnOn(false); devMode.setInstantRespawnCounter(null); addLog('System: Instant respawn finished.'); } 
            else { devMode.setInstantRespawnCounter(newCount); addLog(`System: Instant respawn encounters remaining: ${newCount}.`); }
        }
    }, [devMode, addLog]);
    const handlePlayerDeath = useCallback(() => { baseHandlePlayerDeath(); handleCombatFinish(); }, [baseHandlePlayerDeath, handleCombatFinish]);
    const killHandler = useKillHandler({ questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn: devMode.isInstantRespawnOn });
    const handleKill = useCallback((id) => { killHandler.handleKill(id); }, [killHandler]);
    
    const startCombat = useCallback((ids: string[]) => { ui.setCombatQueue(ids); ui.setIsMandatoryCombat(true); }, [ui]);
    useAggression(session.currentPoiId, true, isBusy || ui.combatQueue.length > 0, char.combatLevel, startCombat, addLog, monsterRespawnTimers, devMode.configAggroIds, devMode.isPlayerInvisible);
    
    // Tutorial Rewards Logic
    const tutorialRewardsGiven = useRef<Set<number>>(new Set());
    const charRef = useRef(char);
    const invRef_Rewards = useRef(inv); // Use a different name to avoid conflict with `invRef` used by ground items
    const addLogRef = useRef(addLog);
    useEffect(() => { charRef.current = char; }, [char]);
    useEffect(() => { invRef_Rewards.current = inv; }, [inv]);
    useEffect(() => { addLogRef.current = addLog; }, [addLog]);

    useEffect(() => {
        const { tutorialStage, currentStep } = tutorial;

        if (tutorialStage < 0) return;

        // Handle HP damage for stage 9
        if (tutorialStage === 9 && charRef.current.currentHp === charRef.current.maxHp) {
            charRef.current.setCurrentHp(hp => Math.max(1, hp - 5));
            addLogRef.current("Leo gives you a playful shove to demonstrate. You lose 5 HP.");
        }

        if (!currentStep || tutorialRewardsGiven.current.has(tutorialStage)) {
            return;
        }

        const { rewards } = currentStep;
        if (rewards) {
            rewards.items?.forEach(reward => invRef_Rewards.current.modifyItem(reward.itemId, reward.quantity, false));
            (rewards as any).xp?.forEach((xpReward: { skill: SkillName, amount: number }) => charRef.current.addXp(xpReward.skill, xpReward.amount));
            tutorialRewardsGiven.current.add(tutorialStage);
        }
    }, [tutorial.tutorialStage, tutorial.currentStep]);

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
        slayerTask: slayer.slayerTask, tutorialStage: tutorial.tutorialStage,
        worldState: { windmillFlour },
        autocastSpell: char.autocastSpell,
    }), [char, inv, session.currentPoiId, quests, skilling.resourceNodeStates, shops.shopStates, repeatableQuests, bank, clearedSkillObstacles, monsterRespawnTimers, slayer.slayerTask, tutorial.tutorialStage, initialState.username, windmillFlour]);

    useSaveGame(gameState);

    // Tutorial Progression Check for Mining
    useEffect(() => {
        if (tutorial.tutorialStage === 15) {
            const hasCopper = inv.inventory.some(slot => slot?.itemId === 'copper_ore');
            const hasTin = inv.inventory.some(slot => slot?.itemId === 'tin_ore');
            if (hasCopper && hasTin) {
                tutorial.advanceTutorial('mine-ores');
            }
        }
    }, [inv.inventory, tutorial.tutorialStage, tutorial.advanceTutorial]);

    // Quest Progression Check for Gathering
    useEffect(() => {
        questLogic.checkGatherQuests();
    }, [inv.inventory, questLogic]);


    useEffect(() => { if (ui.activePanel === null) ui.setActivePanel('inventory'); }, []);

    const isBankOpen = ui.activePanel === 'bank';
    const isShopOpen = !!ui.activeShopId;

    return (
        <>
            <div className="w-full md:w-4/5 flex flex-col gap-2">
                <div className="bg-black/70 border-2 border-gray-600 rounded-lg p-4 flex-grow min-h-0 relative">
                    <MainViewController {...{char, inv, quests, bank, bankLogic, shops, crafting, repeatableQuests, navigation, worldActions, slayer, questLogic, skilling, interactQuest, session, clearedSkillObstacles, monsterRespawnTimers, handlePlayerDeath, handleKill, handleDialogueAction: dialogueActions.handleDialogueAction, combatSpeedMultiplier: devMode.combatSpeedMultiplier, advanceTutorial: tutorial.advanceTutorial, tutorialStage: tutorial.tutorialStage, activeCombatStyleHighlight: tutorial.activeCombatStyleHighlight, isTouchSimulationEnabled: devMode.isTouchSimulationEnabled, isMapManagerEnabled: devMode.isMapManagerEnabled, poiCoordinates: devMode.poiCoordinates, regionCoordinates: devMode.regionCoordinates, onUpdatePoiCoordinate: devMode.handleUpdatePoiCoordinate, poiConnections: devMode.poiConnections, onUpdatePoiConnections: devMode.handleUpdatePoiConnections, addLog, ui, onExportGame, onImportGame, onResetGame, initialState, showAllPois: devMode.showAllPois, groundItemsForCurrentPoi: groundItems.groundItemsForCurrentPoi, onPickUpItem: groundItems.handlePickUpItem, onTakeAllLoot: groundItems.handleTakeAllLoot, onItemDropped: groundItems.onItemDropped, isAutoBankOn: devMode.isAutoBankOn, handleCombatXpGain: char.addXp }} />
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
                <div className={`md:flex-shrink-0 relative ${tutorial.tutorialStage >= 0 ? 'hidden md:block md:invisible' : ''}`}>
                    <ActivityLog logs={activityLog} isDialogueActive={!!ui.activeDialogue} />
                    {ui.activeDialogue && <DialogueOverlay dialogue={ui.activeDialogue} />}
                </div>
            </div>
            <div className="w-full md:w-1/5 flex flex-col">
                <SidePanel {...{ui, initialState, char, inv, quests, repeatableQuests, slayer, onExportGame: () => onExportGame(gameState), onImportGame, onResetGame, isDevMode: devMode.isDevMode, isTouchSimulationEnabled: devMode.isTouchSimulationEnabled, onToggleTouchSimulation: devMode.onToggleTouchSimulation, itemActions, isBusy, handleExamine, session, addLog, activeCombatStyleHighlight: tutorial.activeCombatStyleHighlight, combatSpeedMultiplier: devMode.combatSpeedMultiplier, setCombatSpeedMultiplier: devMode.setCombatSpeedMultiplier, isInstantRespawnOn: devMode.isInstantRespawnOn, setIsInstantRespawnOn: devMode.setIsInstantRespawnOn, instantRespawnCounter: devMode.instantRespawnCounter, setInstantRespawnCounter: devMode.setInstantRespawnCounter, isInCombat: ui.combatQueue.length > 0, isCurrentMonsterAggro: devMode.isCurrentMonsterAggro, onToggleAggro: devMode.onToggleAggro, isPlayerInvisible: devMode.isPlayerInvisible, setIsPlayerInvisible: devMode.setIsPlayerInvisible, isAutoBankOn: devMode.isAutoBankOn, setIsAutoBankOn: devMode.setIsAutoBankOn, isMapManagerEnabled: devMode.isMapManagerEnabled, onToggleMapManager: devMode.onToggleMapManager, onCommitMapChanges: devMode.handleCommitMapChanges, hasMapChanges: devMode.modifiedPois.size > 0 || devMode.modifiedRegions.size > 0, showAllPois: devMode.showAllPois, onToggleShowAllPois: () => devMode.setShowAllPois(p => !p), onForcedNavigate: navigation.handleForcedNavigate, onNavigate: navigation.handleNavigate, unlockedPois: navigation.reachablePois, isBankOpen, isShopOpen, onDeposit: bankLogic.handleDeposit, xpMultiplier: devMode.xpMultiplier, setXpMultiplier: devMode.setXpMultiplier, isXpBoostEnabled: devMode.isXpBoostEnabled, setIsXpBoostEnabled: devMode.setIsXpBoostEnabled, devPanelState: devMode.devPanelState, updateDevPanelState: devMode.updateDevPanelState, onCastSpell: spellcasting.onCastSpell }} />
            </div>
            <XpTracker drops={xpDrops} onRemoveDrop={removeXpDrop} />
            {tutorial.tutorialStage >= 0 && <TutorialOverlay {...{stage: tutorial.tutorialStage, advanceTutorial: tutorial.advanceTutorial, overrideGuideText: tutorial.tutorialOverrideText, inventory: inv.inventory, logMessage: tutorialLogMessage, clearLogMessage: () => setTutorialLogMessage(null), isTouchSimulationEnabled: devMode.isTouchSimulationEnabled}} />}
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
            />}
        </>
    );
};

export default Game;
