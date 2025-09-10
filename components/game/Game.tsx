

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { QUESTS, REGIONS, SHOPS, TUTORIAL_SCRIPT } from '../../constants';
import { POIS } from '../../data/pois';
import { CombatStance, PlayerSlayerTask, ShopStates, SkillName, POIActivity, InventorySlot, ActivePanel, Item } from '../../types';
import { useActivityLog } from '../../hooks/useActivityLog';
import { useCharacter } from '../../hooks/useCharacter';
import { useInventory } from '../../hooks/useInventory';
import { useQuests } from '../../hooks/useQuests';
import { useSaveGame } from '../../hooks/useSaveGame';
import { useUIState } from '../../hooks/useUIState';
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
import Hud from '../game/Hud';
import InventoryPanel from '../panels/InventoryPanel';
import SkillsPanel from '../panels/SkillsPanel';
import QuestsPanel from '../panels/QuestsPanel';
import EquipmentPanel from '../panels/EquipmentPanel';
import ActivityLog from '../game/ActivityLog';
import XpTracker, { XpDrop } from '../ui/XpTracker';
import WorldMapView from '../views/WorldMapView';
import MainViewController from '../game/MainViewController';
import QuestDetailView from '../views/overlays/QuestDetailView';
import AtlasView from '../views/AtlasView';
import ExpandedMapView from '../views/ExpandedMapView';
import DevModePanel from '../common/DevModePanel';
import TutorialOverlay from './TutorialOverlay';

interface GameProps {
    initialState: any; // Type is managed by the game state manager hook
    onExportGame: (gameState: object) => void;
    onImportGame: () => void;
    onResetGame: () => void;
    ui: ReturnType<typeof useUIState>;
}

const isPlayerInTutorialZone = (poiId: string) => poiId.startsWith('enclave_');

const Game: React.FC<GameProps> = ({ initialState, onExportGame, onImportGame, onResetGame, ui }) => {
    const [tutorialStage, setTutorialStage] = useState(() => {
        // For new games, this passes. For old saves outside the enclave, this will set stage to -1, disabling the tutorial.
        if (initialState.tutorialStage >= 0 && !isPlayerInTutorialZone(initialState.currentPoiId)) {
            return -1;
        }
        return initialState.tutorialStage;
    });
    
    const [unlockedHudButtons, setUnlockedHudButtons] = useState<string[]>([]);
    const [tutorialOverrideText, setTutorialOverrideText] = useState<string | null>(null);
    const [activeCombatStyleHighlight, setActiveCombatStyleHighlight] = useState<CombatStance | null>(null);
    const session = useGameSession(initialState.currentPoiId);
    const { activityLog, addLog } = useActivityLog([]); // Activity log is no longer saved
    const isInCombat = ui.combatQueue.length > 0;
    const isBusy = !!ui.activeCraftingAction;
    const tutorialRewardsGiven = useRef<Set<number>>(new Set());

    const [clearedSkillObstacles, setClearedSkillObstacles] = useState(initialState.clearedSkillObstacles);
    const [monsterRespawnTimers, setMonsterRespawnTimers] = useState(initialState.monsterRespawnTimers);
    
    // Dev Panel State
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [combatSpeedMultiplier, setCombatSpeedMultiplier] = useState(1);
    const [isInstantRespawnOn, setIsInstantRespawnOn] = useState(false);
    const [instantRespawnCounter, setInstantRespawnCounter] = useState<number | null>(null);
    const [configAggroIds, setConfigAggroIds] = useState<string[]>([]);
    const [isPlayerInvisible, setIsPlayerInvisible] = useState(false);
    const [isAutoBankOn, setIsAutoBankOn] = useState(false);
    const isDevMode = initialState.username === 'DevKoala';

    const [xpDrops, setXpDrops] = useState<XpDrop[]>([]);
    const handleXpGain = useCallback((skillName: SkillName, amount: number) => {
      if (amount > 0) {
        setXpDrops(prev => [...prev, { id: Date.now() + Math.random(), skillName, amount }]);
      }
    }, []);
    const removeXpDrop = useCallback((id: number) => {
        setXpDrops(prev => prev.filter(drop => drop.id !== id));
    }, []);

    const charInitialData = useMemo(() => ({
        skills: initialState.skills,
        combatStance: initialState.combatStance,
        currentHp: initialState.currentHp
    }), [initialState.skills, initialState.combatStance, initialState.currentHp]);

    const memoizedCharCallbacks = useMemo(() => ({ addLog, onXpGain: handleXpGain }), [addLog, handleXpGain]);
    
    const char = useCharacter(charInitialData, memoizedCharCallbacks, isInCombat, combatSpeedMultiplier);
    
    // Centralized Bank State
    const [bank, setBank] = useState<(InventorySlot | null)[]>(padBank(initialState.bank));

    const bankOptions = useMemo(() => ({
        isAutoBankOn,
        bank,
        setBank
    }), [isAutoBankOn, bank]);

    const invInitialData = useMemo(() => ({
        inventory: initialState.inventory,
        coins: initialState.coins,
        equipment: initialState.equipment
    }), [initialState.inventory, initialState.coins, initialState.equipment]);

    const completeTutorial = useCallback(() => {
        questLogic.completeQuestStage('tutorial_completion');
        setTutorialStage(-1);
        session.setCurrentPoiId('meadowdale_square');
        addLog("You have arrived in the main world. Your adventure begins now!");
    }, [addLog, session]); // questLogic removed as it's defined later but needs this function

    const advanceTutorial = useCallback((condition: string) => {
        console.log(`[DEBUG] advanceTutorial called with condition: "${condition}"`);
        if (tutorialStage < 0) {
            console.log(`[DEBUG] Tutorial already complete. Aborting advance.`);
            return;
        }
        const currentStep = TUTORIAL_SCRIPT[tutorialStage] as any;

        if (currentStep && currentStep.completionCondition === condition) {
            const newStage = tutorialStage + 1;
            console.log(`[DEBUG] Condition MET. Advancing tutorial stage from ${tutorialStage} to ${newStage}`);
            if (newStage >= TUTORIAL_SCRIPT.length) {
                completeTutorial();
            } else {
                setTutorialStage(newStage);
            }
        } else {
            console.log(`[DEBUG] Condition "${condition}" does not match current step's condition "${currentStep?.completionCondition}". No advancement.`);
        }
    }, [tutorialStage, completeTutorial]);

    const inv = useInventory(
        invInitialData,
        addLog,
        advanceTutorial,
        bankOptions
    );
    const quests = useQuests({ playerQuests: initialState.playerQuests, lockedPois: initialState.lockedPois });
    
    const slayer = useSlayer(initialState.slayerTask, { addLog, addXp: char.addXp, combatLevel: char.combatLevel });
    const repeatableQuests = useRepeatableQuests(initialState.repeatableQuestsState, addLog, inv, char);
    const bankLogic = useBank({ bank, setBank }, { addLog, ...inv, ...char, setCombatStance: char.setCombatStance });
    const shops = useShops(initialState.shopStates, inv.coins, inv.modifyItem, addLog);

    const questLogic = useQuestLogic({
        playerQuests: quests.playerQuests, setPlayerQuests: quests.setPlayerQuests,
        addLog, modifyItem: inv.modifyItem, addXp: char.addXp, hasItems: inv.hasItems,
        setLockedPois: quests.setLockedPois, setClearedSkillObstacles
    });

    // This effect reliably handles giving rewards when the tutorial stage changes.
    useEffect(() => {
        console.log(`[DEBUG_REWARD] Effect for tutorial stage ${tutorialStage} is running.`);
        if (tutorialStage < 0 || tutorialStage >= TUTORIAL_SCRIPT.length) {
            console.log(`[DEBUG_REWARD] Stage ${tutorialStage} is out of bounds or tutorial is complete. No rewards given.`);
            return;
        }
        if (tutorialRewardsGiven.current.has(tutorialStage)) {
            console.log(`[DEBUG_REWARD] Rewards for stage ${tutorialStage} have already been given.`);
            return;
        }
    
        const currentStep = TUTORIAL_SCRIPT[tutorialStage] as any;
        const rewards = currentStep.rewards;
    
        if (rewards) {
            console.log(`[DEBUG_REWARD] Found rewards for stage ${tutorialStage}:`, JSON.parse(JSON.stringify(rewards)));
            rewards.items?.forEach((reward: { itemId: string; quantity: number }) => {
                console.log(`[DEBUG_REWARD] Granting item: ${reward.itemId} x ${reward.quantity}`);
                inv.modifyItem(reward.itemId, reward.quantity, false);
            });
            rewards.xp?.forEach((xpReward: { skill: SkillName; amount: number }) => {
                console.log(`[DEBUG_REWARD] Granting XP: ${xpReward.amount} ${xpReward.skill}`);
                char.addXp(xpReward.skill, xpReward.amount);
            });
            tutorialRewardsGiven.current.add(tutorialStage);
            console.log(`[DEBUG_REWARD] Marked stage ${tutorialStage} as rewarded.`);
        } else {
            console.log(`[DEBUG_REWARD] No rewards found for stage ${tutorialStage}.`);
        }
    }, [tutorialStage, inv.modifyItem, char.addXp]);

    // This effect handles the tutorial progression for the mining step.
    useEffect(() => {
        if (tutorialStage === 14) {
            const hasCopper = inv.inventory.some(i => i?.itemId === 'copper_ore');
            const hasTin = inv.inventory.some(i => i?.itemId === 'tin_ore');
            if (hasCopper && hasTin) {
                advanceTutorial('mine-ores');
            }
        }
    }, [inv.inventory, tutorialStage, advanceTutorial]);

    useEffect(() => {
        if (tutorialStage < 0) { // Tutorial complete
            setUnlockedHudButtons(['inventory', 'equipment', 'skills', 'quests', 'map', 'atlas']);
            return;
        }

        const newlyUnlocked = new Set<string>();
        for (let i = 0; i <= tutorialStage; i++) {
            const step = TUTORIAL_SCRIPT[i] as any; // Cast to any to access dynamic property
            if (step && step.unlocks) {
                step.unlocks.forEach((buttonId: string) => newlyUnlocked.add(buttonId));
            }
        }
        setUnlockedHudButtons(Array.from(newlyUnlocked));
    }, [tutorialStage]);

    // Effect for other tutorial side-effects
    useEffect(() => {
        setTutorialOverrideText(null);
        if (tutorialStage < 0 || tutorialStage >= TUTORIAL_SCRIPT.length) return;

        if (tutorialStage === 9) {
            if (char.currentHp === char.maxHp) {
                 char.setCurrentHp(hp => Math.max(1, hp - 5));
                 addLog("Leo gives you a playful shove to demonstrate. You lose 5 HP.");
            }
        }
    }, [tutorialStage, char.currentHp, char.maxHp, char.setCurrentHp, addLog]);


    useEffect(() => {
        if (tutorialStage !== 12) {
            setActiveCombatStyleHighlight(null);
            return;
        }

        const stances = [CombatStance.Accurate, CombatStance.Aggressive, CombatStance.Defensive];
        let currentIndex = 0;

        const interval = setInterval(() => {
            setActiveCombatStyleHighlight(stances[currentIndex]);
            currentIndex = (currentIndex + 1) % stances.length;
        }, 1000);

        return () => {
            clearInterval(interval);
            setActiveCombatStyleHighlight(null);
        };
    }, [tutorialStage]);

    const handleMoveItem = useCallback((fromIndex: number, toIndex: number) => {
        if (tutorialStage === 5) {
            setTutorialOverrideText("Oh, I see you figured out how to move your items around, this must be a familiar feeling to you i suppose?");
        }
        inv.moveItem(fromIndex, toIndex);
    }, [tutorialStage, inv.moveItem]);

    const handleTutorialAction = useCallback((action: 'left_click_axe') => {
        if (action === 'left_click_axe' && tutorialStage === 5) {
            setTutorialOverrideText("That's a left-click. Remember, you need to RIGHT-click to see more options!");
        }
    }, [tutorialStage]);
    
    const skilling = useSkilling(initialState.resourceNodeStates, { addLog, skills: char.skills, addXp: (skill, amount) => { char.addXp(skill, amount); if(skill === SkillName.Woodcutting) advanceTutorial('chop-log'); }, inventory: inv.inventory, modifyItem: inv.modifyItem, equipment: inv.equipment });
    const interactQuest = useInteractQuest({ addLog, activePlayerQuest: repeatableQuests.activePlayerQuest, handleTurnInRepeatableQuest: repeatableQuests.handleTurnInRepeatableQuest });

    const crafting = useCrafting({
        skills: char.skills, hasItems: inv.hasItems, addLog,
        activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction,
        inventory: inv.inventory, modifyItem: inv.modifyItem, addXp: char.addXp,
        checkQuestProgressOnSpin: questLogic.checkQuestProgressOnSpin,
        checkQuestProgressOnSmith: questLogic.checkQuestProgressOnSmith,
        advanceTutorial,
    });

    const itemActions = useItemActions({
        addLog, currentHp: char.currentHp, maxHp: char.maxHp, setCurrentHp: char.setCurrentHp,
        applyStatModifier: char.applyStatModifier, setInventory: inv.setInventory,
        skills: char.skills, inventory: inv.inventory,
        activeCraftingAction: ui.activeCraftingAction,
        setActiveCraftingAction: ui.setActiveCraftingAction,
        hasItems: inv.hasItems, modifyItem: inv.modifyItem, addXp: char.addXp,
        openCraftingView: ui.openCraftingView,
        setItemToUse: ui.setItemToUse,
        addBuff: char.addBuff,
        setMakeXPrompt: ui.setMakeXPrompt,
        startQuest: (questId) => {
            quests.startQuest(questId, addLog);
            if(questId === 'leos_lunch') advanceTutorial('examine-sandwich');
        },
        advanceTutorial,
    });

    const handleExamine = useCallback((item: Item) => {
        if (tutorialStage === 17 && item.id === 'unusual_sandwich') {
            const playerHasQuest = quests.playerQuests.some(q => q.questId === 'leos_lunch');
            if (!playerHasQuest) {
                quests.startQuest('leos_lunch', addLog);
            }
            advanceTutorial('examine-sandwich');
            ui.setActiveNpcDialogue({
                name: item.name,
                icon: item.iconUrl,
                dialogue: ["You take a closer look and find a rock inside the sandwich! It's completely inedible."]
            });
        } else {
            addLog(`[Examine: ${item.name}] ${item.description}`);
        }
    }, [tutorialStage, quests, addLog, advanceTutorial, ui]);

    const worldActions = useWorldActions({
        hasItems: inv.hasItems, inventory: inv.inventory, modifyItem: inv.modifyItem, addLog,
        coins: inv.coins, skills: char.skills, addXp: char.addXp,
        setClearedSkillObstacles, playerQuests: quests.playerQuests,
        checkQuestProgressOnShear: questLogic.checkQuestProgressOnShear,
        setMakeXPrompt: ui.setMakeXPrompt,
    });
    
    const navigation = useNavigation({
        session,
        lockedPois: quests.lockedPois,
        clearedSkillObstacles,
        addLog,
        isBusy,
        isInCombat,
        ui,
        skilling,
        interactQuest
    });
    
    const handleCombatFinish = useCallback(() => {
        if (isInstantRespawnOn && instantRespawnCounter !== null) {
            const newCount = instantRespawnCounter - 1;
            if (newCount <= 0) {
                setIsInstantRespawnOn(false);
                setInstantRespawnCounter(null);
                addLog('Command System: Instant respawn counter finished. Feature disabled.');
            } else {
                setInstantRespawnCounter(newCount);
                addLog(`Command System: Instant respawn encounters remaining: ${newCount}.`);
            }
        }
    }, [isInstantRespawnOn, instantRespawnCounter, addLog]);

    const { handlePlayerDeath: baseHandlePlayerDeath } = usePlayerDeath({
        skilling, interactQuest, ui, session, char, inv, addLog, tutorialStage
    });
    
    const handlePlayerDeath = useCallback(() => {
        baseHandlePlayerDeath();
        handleCombatFinish();
    }, [baseHandlePlayerDeath, handleCombatFinish]);
    
    const killHandler = useKillHandler({
        questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn
    });
    
    const handleKill = useCallback((uniqueInstanceId: string) => {
        killHandler.handleKill(uniqueInstanceId);
        const monsterId = uniqueInstanceId.split(':')[1];
        if (monsterId === 'tutorial_rat') {
            advanceTutorial('kill-rat');
        }
    }, [killHandler, advanceTutorial]);

    const toggleDevPanel = useCallback(() => {
        setIsConfigPanelOpen(prev => !prev);
    }, []);

    const isCurrentMonsterAggro = useMemo(() => ui.combatQueue.some(id => configAggroIds.includes(id)), [ui.combatQueue, configAggroIds]);

    const handleToggleAggro = useCallback(() => {
        if (ui.combatQueue.length === 0) return;
        
        const monstersInCombat = ui.combatQueue;
        const areAnyAggro = monstersInCombat.some(id => configAggroIds.includes(id));
    
        if (areAnyAggro) {
            setConfigAggroIds(prev => prev.filter(id => !monstersInCombat.includes(id)));
            addLog(`System: Permanent aggro REMOVED for current combat.`);
        } else {
            setConfigAggroIds(prev => [...new Set([...prev, ...monstersInCombat])]);
            addLog(`System: Permanent aggro ADDED for current combat.`);
        }
    }, [ui.combatQueue, configAggroIds, addLog]);

    const gameState = useMemo(() => {
        const activeMonsterRespawnTimers: Record<string, number> = {};
        const now = Date.now();
        for (const key in monsterRespawnTimers) {
            if (monsterRespawnTimers[key] > now) {
                activeMonsterRespawnTimers[key] = monsterRespawnTimers[key];
            }
        }
    
        const optimizedShopStates: ShopStates = {};
        for (const shopId in shops.shopStates) {
            const shopData = SHOPS[shopId];
            if (!shopData) continue;
    
            const optimizedItems: ShopStates[string] = {};
            for (const itemId in shops.shopStates[shopId]) {
                const itemState = shops.shopStates[shopId][itemId];
                const defaultShopItem = shopData.inventory.find(i => i.itemId === itemId);
                
                if (defaultShopItem && (itemState.currentStock !== defaultShopItem.quantity || itemState.restockProgress > 0)) {
                    optimizedItems[itemId] = itemState;
                }
            }
            if (Object.keys(optimizedItems).length > 0) {
                optimizedShopStates[shopId] = optimizedItems;
            }
        }
    
        const optimizedBoards: Record<string, any[]> = {};
        for (const boardId in repeatableQuests.boards) {
            optimizedBoards[boardId] = repeatableQuests.boards[boardId].map(q => {
                const slimQuest: any = {
                    id: q.id,
                    requiredQuantity: q.requiredQuantity,
                    finalCoinReward: q.finalCoinReward,
                    finalXpAmount: q.xpReward.amount,
                };
                return slimQuest;
            });
        }
        
        const optimizedResourceNodeStates = Object.entries(skilling.resourceNodeStates)
            .reduce<Record<string, any>>((acc, [nodeId, state]) => {
                const activity = Object.values(POIS)
                    .flatMap(poi => poi.activities)
                    .find(act => act.type === 'skilling' && act.id === nodeId) as Extract<POIActivity, {type: 'skilling'}> | undefined;

                if (activity) {
                    const maxResources = activity.resourceCount.max;
                    if (state.resources < maxResources || state.respawnTimer > 0) {
                        acc[nodeId] = state;
                    }
                }
                return acc;
            }, {});

        return {
            username: initialState.username,
            skills: char.skills.map(({ name, level, xp }) => ({ name, level, xp })),
            inventory: inv.inventory,
            coins: inv.coins, equipment: inv.equipment, combatStance: char.combatStance,
            bank,
            currentHp: char.currentHp, currentPoiId: session.currentPoiId, playerQuests: quests.playerQuests, lockedPois: quests.lockedPois,
            clearedSkillObstacles,
            resourceNodeStates: optimizedResourceNodeStates,
            monsterRespawnTimers: activeMonsterRespawnTimers,
            shopStates: optimizedShopStates, 
            repeatableQuestsState: {
                boards: optimizedBoards,
                activePlayerQuest: repeatableQuests.activePlayerQuest,
                nextResetTimestamp: repeatableQuests.nextResetTimestamp,
                completedQuestIds: repeatableQuests.completedQuestIds,
                boardCompletions: repeatableQuests.boardCompletions,
            },
            slayerTask: slayer.slayerTask,
            tutorialStage,
        };
    }, [char, inv, session.currentPoiId, quests, skilling.resourceNodeStates, shops.shopStates, repeatableQuests, bank, clearedSkillObstacles, monsterRespawnTimers, slayer.slayerTask, tutorialStage, initialState.username]);

    useSaveGame(gameState);
    
    const startCombat = useCallback((monsterInstanceIds: string[]) => {
        ui.setCombatQueue(monsterInstanceIds);
        ui.setIsMandatoryCombat(true);
    }, [ui]);

    useAggression(
        session.currentPoiId,
        true,
        isInCombat || isBusy,
        char.combatLevel,
        startCombat,
        addLog,
        monsterRespawnTimers,
        configAggroIds,
        isPlayerInvisible
    );

    const activeMapRegionId = useMemo(() => {
        const currentPoi = POIS[session.currentPoiId];
        const currentRegion = currentPoi ? REGIONS[currentPoi.regionId] : null;
        if (currentRegion?.type === 'city') {
            return currentRegion.id;
        }
        return 'world';
    }, [session.currentPoiId]);

    const renderActivePanel = () => {
        const isTutorialActive = tutorialStage >= 0;
        const panelToShow = isTutorialActive ? ui.activePanel : (ui.activePanel ?? 'inventory');
    
        if (!panelToShow) {
            return (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 italic text-center">
                        Select an unlocked panel from the HUD to view its contents.
                    </p>
                </div>
            );
        }
    
        switch (panelToShow) {
            case 'inventory':
            case 'bank':
                 return <InventoryPanel inventory={inv.inventory} coins={inv.coins} skills={char.skills} onEquip={(item, idx) => { inv.handleEquip(item, idx, char.skills, char.combatStance, char.setCombatStance); }} onConsume={itemActions.handleConsume} onDrop={inv.handleDropItem} onBury={itemActions.handleBuryBones} onEmpty={itemActions.handleEmptyItem} setTooltip={ui.setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} isBankOpen={ui.activePanel === 'bank'} onDeposit={bankLogic.handleDeposit} itemToUse={ui.itemToUse} setItemToUse={ui.setItemToUse} onUseItemOn={itemActions.handleUseItemOn} isBusy={isBusy} onMoveItem={handleMoveItem} setConfirmationPrompt={ui.setConfirmationPrompt} tutorialStage={tutorialStage} advanceTutorial={advanceTutorial} onTutorialAction={handleTutorialAction} onExamine={handleExamine} />;
            case 'skills':
                return <SkillsPanel skills={char.skills} setTooltip={ui.setTooltip} onOpenGuide={ui.setActiveSkillGuide} />;
            case 'quests':
                 return <QuestsPanel playerQuests={quests.playerQuests} activeRepeatableQuest={repeatableQuests.activePlayerQuest} inventory={inv.inventory} slayerTask={slayer.slayerTask} onSelectQuest={ui.setActiveQuestDetailId} />;
            case 'equipment':
                return <EquipmentPanel equipment={inv.equipment} onUnequip={(slot) => inv.handleUnequip(slot, char.setCombatStance)} setTooltip={ui.setTooltip} ui={ui} />;
            case 'map':
                return <WorldMapView currentPoiId={session.currentPoiId} unlockedPois={navigation.reachablePois} onNavigate={(id) => { navigation.handleNavigate(id); advanceTutorial(`move:${id}`); }} setTooltip={ui.setTooltip} activeMapRegionId={activeMapRegionId} />;
            default:
                return <div>Error: Unknown panel '{panelToShow}'</div>;
        }
    };

    return (
        <>
            <div className="w-3/4 flex flex-col gap-4">
                <div className="bg-black/70 border-2 border-gray-600 rounded-lg flex-grow p-4 overflow-y-auto">
                    <MainViewController
                        ui={ui}
                        addLog={addLog}
                        char={char}
                        inv={inv}
                        quests={quests}
                        bank={bank}
                        bankLogic={bankLogic}
                        shops={shops}
                        crafting={crafting}
                        repeatableQuests={repeatableQuests}
                        navigation={{
                            ...navigation,
                            handleNavigate: (poiId: string) => {
                                navigation.handleNavigate(poiId);
                                advanceTutorial(`move:${poiId}`);
                            },
                        }}
                        worldActions={worldActions}
                        slayer={slayer}
                        questLogic={questLogic}
                        skilling={skilling}
                        interactQuest={interactQuest}
                        session={session}
                        clearedSkillObstacles={clearedSkillObstacles}
                        monsterRespawnTimers={monsterRespawnTimers}
                        handlePlayerDeath={handlePlayerDeath}
                        handleKill={handleKill}
                        combatSpeedMultiplier={combatSpeedMultiplier}
                        advanceTutorial={advanceTutorial}
                        tutorialStage={tutorialStage}
                        activeCombatStyleHighlight={activeCombatStyleHighlight}
                    />
                </div>
                <ActivityLog logs={activityLog} />
            </div>
            <div className="w-1/4 flex flex-col gap-4">
                <Hud 
                    skills={char.skills} 
                    currentHp={char.currentHp} 
                    maxHp={char.maxHp} 
                    combatLevel={char.combatLevel} 
                    activePanel={ui.activePanel} 
                    setActivePanel={(panel) => {
                        ui.setActivePanel(panel);
                        if (panel === 'inventory') advanceTutorial('open-inventory');
                        if (panel === 'equipment') advanceTutorial('open-equipment');
                        if (panel === 'skills') advanceTutorial('open-skills');
                        if (panel === 'map') advanceTutorial('open-map');
                    }} 
                    onResetGame={onResetGame} 
                    onExportGame={() => onExportGame(gameState)}
                    onImportGame={onImportGame}
                    onOpenAtlas={() => ui.setIsAtlasViewOpen(true)}
                    isBusy={isBusy}
                    setContextMenu={ui.setContextMenu}
                    onOpenExpandedMap={() => ui.setIsExpandedMapViewOpen(true)}
                    onToggleDevPanel={toggleDevPanel}
                    tutorialStage={tutorialStage}
                    unlockedHudButtons={unlockedHudButtons}
                    isDevMode={isDevMode}
                />
                <div className="bg-black/70 border-2 border-gray-600 rounded-lg flex-grow p-2 min-h-0">
                    {renderActivePanel()}
                </div>
            </div>
            <XpTracker drops={xpDrops} onRemoveDrop={removeXpDrop} />
            {tutorialStage >= 0 && <TutorialOverlay stage={tutorialStage} advanceTutorial={advanceTutorial} overrideGuideText={tutorialOverrideText} inventory={inv.inventory} />}
            {ui.activeQuestDetailId && <QuestDetailView questId={ui.activeQuestDetailId} playerQuests={quests.playerQuests} onClose={() => ui.setActiveQuestDetailId(null)} />}
            {ui.isAtlasViewOpen && <AtlasView
                currentPoiId={session.currentPoiId}
                unlockedPois={navigation.reachablePois}
                onClose={() => ui.setIsAtlasViewOpen(false)}
                setTooltip={ui.setTooltip}
            />}
            {ui.isExpandedMapViewOpen && <ExpandedMapView
                currentPoiId={session.currentPoiId}
                unlockedPois={navigation.reachablePois}
                onClose={() => ui.setIsExpandedMapViewOpen(false)}
                setTooltip={ui.setTooltip}
            />}
            {isDevMode && isConfigPanelOpen && <DevModePanel
                combatSpeedMultiplier={combatSpeedMultiplier}
                setCombatSpeedMultiplier={(speed) => {
                    setCombatSpeedMultiplier(speed);
                    addLog(`System: Combat speed set to ${speed}x.`);
                }}
                isInstantRespawnOn={isInstantRespawnOn}
                setIsInstantRespawnOn={(isOn) => {
                    setIsInstantRespawnOn(isOn);
                    addLog(`System: Instant respawn ${isOn ? 'enabled' : 'disabled'}.`);
                }}
                instantRespawnCounter={instantRespawnCounter}
                setInstantRespawnCounter={setInstantRespawnCounter}
                isInCombat={isInCombat}
                isCurrentMonsterAggro={isCurrentMonsterAggro}
                onToggleAggro={handleToggleAggro}
                onClose={() => setIsConfigPanelOpen(false)}
                isPlayerInvisible={isPlayerInvisible}
                setIsPlayerInvisible={(isInvisible) => {
                    setIsPlayerInvisible(isInvisible);
                    addLog(`System: Player invisibility ${isInvisible ? 'enabled' : 'disabled'}.`);
                }}
                isAutoBankOn={isAutoBankOn}
                setIsAutoBankOn={(isOn) => {
                    setIsAutoBankOn(isOn);
                    addLog(`System: Auto-bank ${isOn ? 'enabled' : 'disabled'}.`);
                }}
            />}
        </>
    );
};

export default Game;