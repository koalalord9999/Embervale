
import React, { useState, useCallback, useMemo, useEffect } from 'react';
// FIX: The POIS constant is located in data/pois, not the main constants barrel file.
import { QUESTS, REGIONS, SHOPS } from './constants';
import { POIS } from './data/pois';
import { CombatStance, PlayerSlayerTask, ShopStates, SkillName } from './types';
import { useActivityLog } from './hooks/useActivityLog';
import { useCharacter } from './hooks/useCharacter';
import { useInventory } from './hooks/useInventory';
import { useQuests } from './hooks/useQuests';
import { useSaveGame } from './hooks/useSaveGame';
import { useUIState } from './hooks/useUIState';
import { useGameSession } from './hooks/useGameSession';
import { useRepeatableQuests } from './hooks/useRepeatableQuests';
import { useAggression } from './hooks/useAggression';
import { useShops } from './hooks/useShops';
import { useSkilling } from './hooks/useSkilling';
import { useBank } from './hooks/useBank';
import { useInteractQuest } from './hooks/useInteractQuest';
import { useSlayer } from './hooks/useSlayer';
import { useQuestLogic } from './hooks/useQuestLogic';
import { useCrafting } from './hooks/useCrafting';
import { useItemActions } from './hooks/useItemActions';
import { useWorldActions } from './hooks/useWorldActions';
import { useNavigation } from './hooks/useNavigation';
import { usePlayerDeath } from './hooks/usePlayerDeath';
import { useKillHandler } from './hooks/useKillHandler';
import { useGameStateManager } from './hooks/useGameStateManager';
import Hud from './components/Hud';
import InventoryPanel from './components/InventoryPanel';
import SkillsPanel from './components/SkillsPanel';
import QuestsPanel from './components/QuestsPanel';
import EquipmentPanel from './components/EquipmentPanel';
import ActivityLog from './components/ActivityLog';
import Tooltip from './components/common/Tooltip';
import ContextMenu from './components/common/ContextMenu';
import MakeXModal from './components/common/MakeXModal';
import XpTracker, { XpDrop } from './components/XpTracker';
import ConfirmationModal from './components/common/ConfirmationModal';
import ExportModal from './components/common/ExportModal';
import ImportModal from './components/common/ImportModal';
import WorldMapView from './components/WorldMapView';
import SkillGuideView from './components/SkillGuideView';
import CraftingView from './components/CraftingView';
import MainViewController from './components/MainViewController';
import QuestDetailView from './components/QuestDetailView';
import EquipmentStatsView from './components/EquipmentStatsView';
import ItemsOnDeathView from './components/ItemsOnDeathView';
import PriceCheckerView from './components/PriceCheckerView';
import AtlasView from './components/AtlasView';
import ExpandedMapView from './components/ExpandedMapView';

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

    const [xpDrops, setXpDrops] = useState<XpDrop[]>([]);
    const handleXpGain = useCallback((skillName: SkillName, amount: number) => {
      if (amount > 0) {
        setXpDrops(prev => [...prev, { id: Date.now() + Math.random(), skillName, amount }]);
      }
    }, []);
    const removeXpDrop = useCallback((id: number) => {
        setXpDrops(prev => prev.filter(drop => drop.id !== id));
    }, []);

    const char = useCharacter({ skills: initialState.skills, combatStance: initialState.combatStance, currentHp: initialState.currentHp }, { addLog, onXpGain: handleXpGain }, isInCombat);
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
        // FIX: Renamed `applySkillDebuff` to `applyStatModifier` to match the prop expected by `useItemActions` and provided by `useCharacter`.
        applyStatModifier: char.applyStatModifier, setInventory: inv.setInventory,
        skills: char.skills, inventory: inv.inventory,
        setActiveCraftingAction: ui.setActiveCraftingAction,
        hasItems: inv.hasItems, modifyItem: inv.modifyItem,
        addXp: char.addXp,
        openGemCuttingModal: ui.openGemCuttingModal,
        setIsCrafting: ui.setIsCrafting,
        openFletchingModal: ui.openFletchingModal,
        setItemToUse: ui.setItemToUse,
        // FIX: The `addBuff` function, which allows items to apply temporary buffs, is now correctly passed to the `useItemActions` hook.
        addBuff: char.addBuff,
    });

    const worldActions = useWorldActions({
        hasItems: inv.hasItems, inventory: inv.inventory, modifyItem: inv.modifyItem, addLog,
        coins: inv.coins, skills: char.skills, addXp: char.addXp,
        setClearedSkillObstacles, playerQuests: quests.playerQuests,
        checkQuestProgressOnShear: questLogic.checkQuestProgressOnShear
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
    
    const { handlePlayerDeath } = usePlayerDeath({
        skilling, interactQuest, ui, session, char, inv, addLog
    });
    
    const { handleKill } = useKillHandler({
        questLogic, repeatableQuests, slayer, setMonsterRespawnTimers
    });

    const gameState = useMemo(() => {
        // Optimize monster respawn timers: only save active timers.
        const activeMonsterRespawnTimers: Record<string, number> = {};
        const now = Date.now();
        for (const key in monsterRespawnTimers) {
            if (monsterRespawnTimers[key] > now) {
                activeMonsterRespawnTimers[key] = monsterRespawnTimers[key];
            }
        }
    
        // Optimize shop states: only save items with non-default stock.
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
    
        // Optimize repeatable quests: save a slim version.
        const optimizedBoards: Record<string, any[]> = {};
        for (const boardId in repeatableQuests.boards) {
            optimizedBoards[boardId] = repeatableQuests.boards[boardId].map(q => {
                const slimQuest: any = {
                    id: q.id,
                    requiredQuantity: q.requiredQuantity,
                    finalCoinReward: q.finalCoinReward,
                    finalXpAmount: q.xpReward.amount, // Save final XP for all quest types
                };
                return slimQuest;
            });
        }
    
        return {
            skills: char.skills.map(({ name, level, xp }) => ({ name, level, xp })), // Save only base stats
            inventory: inv.inventory, coins: inv.coins, equipment: inv.equipment, combatStance: char.combatStance,
            bank: bankLogic.bank,
            currentHp: char.currentHp, currentPoiId: session.currentPoiId, playerQuests: quests.playerQuests, lockedPois: quests.lockedPois,
            clearedSkillObstacles,
            resourceNodeStates: skilling.resourceNodeStates,
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
        monsterRespawnTimers
    );

    // DERIVED STATE: The active map is always determined by the player's current location.
    const activeMapRegionId = useMemo(() => {
        const currentPoi = POIS[session.currentPoiId];
        const currentRegion = currentPoi ? REGIONS[currentPoi.regionId] : null;
        // If the player is in a location that's part of a 'city' region, show that city map.
        if (currentRegion?.type === 'city') {
            return currentRegion.id;
        }
        // Otherwise, show the world map.
        return 'world';
    }, [session.currentPoiId]);

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
                />
                <div className="bg-black/70 border-2 border-gray-600 rounded-lg flex-grow p-2 min-h-0">
                    {/* FIX: The inventory panel should be visible when the bank is open to allow for deposits. This also resolves a TypeScript error where a comparison was always false. */}
                    {(ui.activePanel === 'inventory' || ui.activePanel === 'bank') && <InventoryPanel inventory={inv.inventory} coins={inv.coins} skills={char.skills} onEquip={(item, idx) => inv.handleEquip(item, idx, char.skills, char.combatStance, char.setCombatStance)} onConsume={itemActions.handleConsume} onDrop={inv.handleDropItem} onBury={itemActions.handleBuryBones} setTooltip={ui.setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} isBankOpen={ui.activePanel === 'bank'} onDeposit={bankLogic.handleDeposit} itemToUse={ui.itemToUse} setItemToUse={ui.setItemToUse} onUseItemOn={itemActions.handleUseItemOn} isBusy={isBusy} />}
                    {ui.activePanel === 'skills' && <SkillsPanel skills={char.skills} setTooltip={ui.setTooltip} onOpenGuide={ui.setActiveSkillGuide} />}
                    {ui.activePanel === 'quests' && <QuestsPanel playerQuests={quests.playerQuests} activeRepeatableQuest={repeatableQuests.activePlayerQuest} inventory={inv.inventory} slayerTask={slayer.slayerTask} onSelectQuest={ui.setActiveQuestDetailId} />}
                    {ui.activePanel === 'equipment' && <EquipmentPanel equipment={inv.equipment} onUnequip={(slot) => inv.handleUnequip(slot, char.setCombatStance)} setTooltip={ui.setTooltip} ui={ui} />}
                    {ui.activePanel === 'crafting' && <CraftingView inventory={inv.inventory} skills={char.skills} onCraftItem={crafting.handleCrafting} onExit={() => ui.setActivePanel('inventory')} setContextMenu={ui.setContextMenu} setMakeXPrompt={ui.setMakeXPrompt}/>}
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
        </>
    );
};

const App: React.FC = () => {
    const ui = useUIState();
    const { 
        initialState, 
        gameKey, 
        handleExportSave, 
        handleImportSave, 
        loadFromImportedData, 
        handleResetGame 
    } = useGameStateManager(ui);
    
    const loadingTips = useMemo(() => [
        "The Whispering Woods are older than Meadowdale itself.",
        "Bronze is a simple alloy of copper and tin. Use a furnace to smelt them.",
        "Different combat stances provide bonuses to Attack, Strength, or Defence.",
        "Check the quest board in the local tavern for repeatable tasks and good coin.",
        "A sharp axe is for trees; a sturdy pickaxe is for rocks. Bring the right tool.",
        "Cooking on a range can turn a simple fish into a life-saving meal."
    ], []);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    useEffect(() => {
        if (!initialState) {
            const tipInterval = setInterval(() => {
                setCurrentTipIndex(prevIndex => (prevIndex + 1) % loadingTips.length);
            }, 4000);
            return () => clearInterval(tipInterval);
        }
    }, [initialState, loadingTips]);

    if (!initialState) {
        return (
            <div className="bg-gray-800 text-white min-h-screen flex items-center justify-center font-serif">
                <div className="w-[1024px] h-[768px] bg-cover bg-center border-8 border-gray-900 shadow-2xl p-4 flex flex-col items-center justify-center relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505236755279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop')` }}>
                    <div className="absolute inset-0 bg-black/50"></div>
                     <div className="relative z-10 text-center animate-fade-in bg-black/60 p-8 rounded-lg border-2 border-gray-700 shadow-2xl">
                        <h1 className="text-6xl font-bold text-yellow-400 mb-6" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>Embervale</h1>
                        
                        <div className="w-16 h-16 mx-auto mb-6 animate-spin-slow">
                            <img src="https://api.iconify.design/game-icons:yin-yang.svg" alt="Loading symbol" className="w-full h-full filter invert text-yellow-500"/>
                        </div>

                        <p className="text-lg text-gray-300 italic animate-fade-in min-h-[48px]" key={currentTipIndex}>
                            {loadingTips[currentTipIndex]}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 text-white min-h-screen flex items-center justify-center font-serif">
            <div className="w-[1024px] h-[768px] bg-cover bg-center border-8 border-gray-900 shadow-2xl p-4 flex gap-4 relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-15052367semberv5279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop')`}}>
                <Game 
                    key={gameKey} 
                    initialState={initialState} 
                    onExportGame={handleExportSave} 
                    onImportGame={handleImportSave} 
                    onResetGame={handleResetGame} 
                    ui={ui} 
                />
            </div>
            {ui.tooltip && <Tooltip content={ui.tooltip.content} position={ui.tooltip.position} />}
            {ui.contextMenu && <ContextMenu options={ui.contextMenu.options} position={ui.contextMenu.position} onClose={ui.closeContextMenu} />}
            {ui.makeXPrompt && <MakeXModal title={ui.makeXPrompt.title} maxQuantity={ui.makeXPrompt.max} onConfirm={ui.makeXPrompt.onConfirm} onCancel={ui.closeMakeXPrompt} />}
            {ui.confirmationPrompt && <ConfirmationModal message={ui.confirmationPrompt.message} onConfirm={ui.confirmationPrompt.onConfirm} onCancel={ui.closeConfirmationPrompt} />}
            {ui.exportData && <ExportModal data={ui.exportData} onClose={ui.closeExportModal} />}
            {ui.isImportModalOpen && <ImportModal onImport={loadFromImportedData} onClose={ui.closeImportModal} />}
            {ui.activeSkillGuide && <SkillGuideView activeSkill={ui.activeSkillGuide} setActiveSkill={ui.setActiveSkillGuide} onClose={ui.closeSkillGuide} playerSkills={initialState.skills as any[]} />}
            {ui.isEquipmentStatsOpen && <EquipmentStatsView equipment={initialState.equipment} onClose={() => ui.setIsEquipmentStatsOpen(false)} />}
            {ui.isItemsOnDeathOpen && <ItemsOnDeathView coins={initialState.coins} onClose={() => ui.setIsItemsOnDeathOpen(false)} />}
            {ui.isPriceCheckerOpen && <PriceCheckerView inventory={initialState.inventory} onClose={() => ui.setIsPriceCheckerOpen(false)} setTooltip={ui.setTooltip} />}
        </div>
    );
};

export default App;
