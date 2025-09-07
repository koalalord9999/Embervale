import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { QUESTS, REGIONS, SHOPS } from '../../constants';
import { POIS } from '../../data/pois';
import { CombatStance, PlayerSlayerTask, ShopStates, SkillName, POIActivity } from '../../types';
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
import { useBank } from '../../hooks/useBank';
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
import DevConsole from '../common/DevConsole';
import DevModePanel from '../common/DevModePanel';

interface GameProps {
    initialState: any; // Type is managed by the game state manager hook
    onExportGame: (gameState: object) => void;
    onImportGame: () => void;
    onResetGame: () => void;
    ui: ReturnType<typeof useUIState>;
}

const Game: React.FC<GameProps> = ({ initialState, onExportGame, onImportGame, onResetGame, ui }) => {
    const session = useGameSession(initialState.currentPoiId);
    const { activityLog, addLog } = useActivityLog([]); // Activity log is no longer saved
    const isInCombat = ui.combatQueue.length > 0;
    const isBusy = !!ui.activeCraftingAction;

    const [clearedSkillObstacles, setClearedSkillObstacles] = useState(initialState.clearedSkillObstacles);
    const [monsterRespawnTimers, setMonsterRespawnTimers] = useState(initialState.monsterRespawnTimers);
    
    // Config Panel State
    const [isSystemInputOpen, setIsSystemInputOpen] = useState(false);
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [combatSpeedMultiplier, setCombatSpeedMultiplier] = useState(1);
    const [isInstantRespawnOn, setIsInstantRespawnOn] = useState(false);
    const [instantRespawnCounter, setInstantRespawnCounter] = useState<number | null>(null);
    const [configAggroIds, setConfigAggroIds] = useState<string[]>([]);

    const [xpDrops, setXpDrops] = useState<XpDrop[]>([]);
    const handleXpGain = useCallback((skillName: SkillName, amount: number) => {
      if (amount > 0) {
        setXpDrops(prev => [...prev, { id: Date.now() + Math.random(), skillName, amount }]);
      }
    }, []);
    const removeXpDrop = useCallback((id: number) => {
        setXpDrops(prev => prev.filter(drop => drop.id !== id));
    }, []);

    const char = useCharacter({ skills: initialState.skills, combatStance: initialState.combatStance, currentHp: initialState.currentHp }, { addLog, onXpGain: handleXpGain }, isInCombat, combatSpeedMultiplier);
    const inv = useInventory({ inventory: initialState.inventory, coins: initialState.coins, equipment: initialState.equipment }, addLog);
    const quests = useQuests({ playerQuests: initialState.playerQuests, lockedPois: initialState.lockedPois });
    
    const slayer = useSlayer(initialState.slayerTask, { addLog, addXp: char.addXp, combatLevel: char.combatLevel });
    const repeatableQuests = useRepeatableQuests(initialState.repeatableQuestsState, addLog, inv, char);
    const bankLogic = useBank(initialState.bank, { addLog, ...inv, ...char, setCombatStance: char.setCombatStance });
    const shops = useShops(initialState.shopStates, inv.coins, inv.modifyItem, addLog);
    const skilling = useSkilling(initialState.resourceNodeStates, { addLog, skills: char.skills, addXp: char.addXp, inventory: inv.inventory, modifyItem: inv.modifyItem, equipment: inv.equipment });
    const interactQuest = useInteractQuest({ addLog, activePlayerQuest: repeatableQuests.activePlayerQuest, handleTurnInRepeatableQuest: repeatableQuests.handleTurnInRepeatableQuest });

    const questLogic = useQuestLogic({
        playerQuests: quests.playerQuests, setPlayerQuests: quests.setPlayerQuests,
        addLog, modifyItem: inv.modifyItem, addXp: char.addXp, hasItems: inv.hasItems,
        setLockedPois: quests.setLockedPois, setClearedSkillObstacles
    });

    const crafting = useCrafting({
        skills: char.skills, hasItems: inv.hasItems, addLog,
        activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction,
        inventory: inv.inventory, modifyItem: inv.modifyItem, addXp: char.addXp,
        checkQuestProgressOnSpin: questLogic.checkQuestProgressOnSpin
    });

    const itemActions = useItemActions({
        addLog, currentHp: char.currentHp, maxHp: char.maxHp, setCurrentHp: char.setCurrentHp,
        applyStatModifier: char.applyStatModifier, setInventory: inv.setInventory,
        skills: char.skills, inventory: inv.inventory,
        activeCraftingAction: ui.activeCraftingAction,
        setActiveCraftingAction: ui.setActiveCraftingAction,
        hasItems: inv.hasItems, modifyItem: inv.modifyItem,
        addXp: char.addXp,
        openCraftingView: ui.openCraftingView,
        setItemToUse: ui.setItemToUse,
        addBuff: char.addBuff,
        setMakeXPrompt: ui.setMakeXPrompt,
    });

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
        skilling, interactQuest, ui, session, char, inv, addLog
    });
    
    const handlePlayerDeath = useCallback(() => {
        baseHandlePlayerDeath();
        handleCombatFinish();
    }, [baseHandlePlayerDeath, handleCombatFinish]);
    
    const { handleKill } = useKillHandler({
        questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn
    });
    
    const toggleDevConsole = useCallback(() => {
        setIsSystemInputOpen(prev => !prev);
    }, []);

    const handleSystemCommand = useCallback((command: string) => {
        const parts = command.toLowerCase().split(' ');
        const cmd = parts[0];
        const arg1 = parts[1];

        if (cmd === 'devmode') {
            if (arg1 === 'on') {
                setIsConfigPanelOpen(true);
                addLog(`System: Dev mode panel opened.`);
            } else if (arg1 === 'off') {
                setIsConfigPanelOpen(false);
                addLog(`System: Dev mode panel closed.`);
            } else {
                addLog(`System: Usage: devmode <on|off>`);
            }
            return;
        }

        addLog(`System: Unknown command.`);
    }, [addLog]);
    
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
            skills: char.skills.map(({ name, level, xp }) => ({ name, level, xp })),
            inventory: inv.inventory, coins: inv.coins, equipment: inv.equipment, combatStance: char.combatStance,
            bank: bankLogic.bank,
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
            slayerTask: slayer.slayerTask
        };
    }, [char, inv, session.currentPoiId, quests, skilling.resourceNodeStates, shops.shopStates, repeatableQuests, bankLogic.bank, clearedSkillObstacles, monsterRespawnTimers, slayer.slayerTask]);

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
        configAggroIds
    );

    const activeMapRegionId = useMemo(() => {
        const currentPoi = POIS[session.currentPoiId];
        const currentRegion = currentPoi ? REGIONS[currentPoi.regionId] : null;
        if (currentRegion?.type === 'city') {
            return currentRegion.id;
        }
        return 'world';
    }, [session.currentPoiId]);

    const onCombatEnd = useCallback(() => {
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);
        handleCombatFinish();
    }, [ui, handleCombatFinish]);

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
                        bankLogic={bankLogic}
                        shops={shops}
                        crafting={crafting}
                        repeatableQuests={repeatableQuests}
                        navigation={navigation}
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
                    setActivePanel={ui.setActivePanel} 
                    onResetGame={onResetGame} 
                    onExportGame={() => onExportGame(gameState)}
                    onImportGame={onImportGame}
                    onOpenAtlas={() => ui.setIsAtlasViewOpen(true)}
                    isBusy={isBusy}
                    setContextMenu={ui.setContextMenu}
                    onOpenExpandedMap={() => ui.setIsExpandedMapViewOpen(true)}
                    onToggleDevConsole={toggleDevConsole}
                />
                <div className="bg-black/70 border-2 border-gray-600 rounded-lg flex-grow p-2 min-h-0">
                    {(ui.activePanel === 'inventory' || ui.activePanel === 'bank') && <InventoryPanel inventory={inv.inventory} coins={inv.coins} skills={char.skills} onEquip={(item, idx) => inv.handleEquip(item, idx, char.skills, char.combatStance, char.setCombatStance)} onConsume={itemActions.handleConsume} onDrop={inv.handleDropItem} onBury={itemActions.handleBuryBones} onEmpty={itemActions.handleEmptyItem} setTooltip={ui.setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} isBankOpen={ui.activePanel === 'bank'} onDeposit={bankLogic.handleDeposit} itemToUse={ui.itemToUse} setItemToUse={ui.setItemToUse} onUseItemOn={itemActions.handleUseItemOn} isBusy={isBusy} />}
                    {ui.activePanel === 'skills' && <SkillsPanel skills={char.skills} setTooltip={ui.setTooltip} onOpenGuide={ui.setActiveSkillGuide} />}
                    {ui.activePanel === 'quests' && <QuestsPanel playerQuests={quests.playerQuests} activeRepeatableQuest={repeatableQuests.activePlayerQuest} inventory={inv.inventory} slayerTask={slayer.slayerTask} onSelectQuest={ui.setActiveQuestDetailId} />}
                    {ui.activePanel === 'equipment' && <EquipmentPanel equipment={inv.equipment} onUnequip={(slot) => inv.handleUnequip(slot, char.setCombatStance)} setTooltip={ui.setTooltip} ui={ui} />}
                    {ui.activePanel === 'map' && <WorldMapView currentPoiId={session.currentPoiId} unlockedPois={navigation.reachablePois} onNavigate={navigation.handleNavigate} setTooltip={ui.setTooltip} activeMapRegionId={activeMapRegionId} />}
                </div>
            </div>
            <XpTracker drops={xpDrops} onRemoveDrop={removeXpDrop} />
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
            {isSystemInputOpen && <DevConsole onCommand={handleSystemCommand} onClose={() => setIsSystemInputOpen(false)} />}
            {isConfigPanelOpen && <DevModePanel
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
            />}
        </>
    );
};

export default Game;