import React, { useCallback } from 'react';
import { useUIState } from '../../hooks/useUIState';
import { useCharacter } from '../../hooks/useCharacter';
import { useInventory } from '../../hooks/useInventory';
import { useQuests } from '../../hooks/useQuests';
import { useBank } from '../../hooks/useBank';
import { useShops } from '../../hooks/useShops';
import { useCrafting } from '../../hooks/useCrafting';
import { useRepeatableQuests } from '../../hooks/useRepeatableQuests';
import { useNavigation } from '../../hooks/useNavigation';
import { useWorldActions } from '../../hooks/useWorldActions';
import { useSlayer } from '../../hooks/useSlayer';
import { useQuestLogic } from '../../hooks/useQuestLogic';
import { useSkilling } from '../../hooks/useSkilling';
import { useInteractQuest } from '../../hooks/useInteractQuest';
import { useGameSession } from '../../hooks/useGameSession';
import { useItemActions } from '../../hooks/useItemActions';
// FIX: Import ActiveBuff to use its specific type instead of 'any'.
import { SkillName, InventorySlot, CombatStance, POIActivity, GroundItem, Spell, BonfireActivity, DialogueCheckRequirement, DialogueAction, BankTab, WorldState, PlayerRepeatableQuest, ActiveBuff, DialogueResponse } from '../../types';
import { POIS } from '../../data/pois';
import CraftingProgressView from '../views/crafting/CraftingProgressView';
import CombatView from '../views/CombatView';
import BankView from '../views/BankView';
import ShopView from '../views/ShopView';
import CraftingView from '../views/crafting/CraftingView';
import QuestBoardView from '../views/QuestBoardView';
import SceneView from './SceneView';
import TeleportView from '../views/TeleportView';
import LootView from '../views/LootView';
import EquipmentStatsView from '../views/overlays/EquipmentStatsView';
import SettingsView from '../panels/SettingsPanel';

interface MainViewControllerProps {
    ui: ReturnType<typeof useUIState>;
    addLog: (message: string) => void;
    char: ReturnType<typeof useCharacter>;
    inv: ReturnType<typeof useInventory>;
    quests: ReturnType<typeof useQuests>;
    bank: BankTab[];
    bankLogic: ReturnType<typeof useBank>;
    shops: ReturnType<typeof useShops>;
    crafting: ReturnType<typeof useCrafting>;
    repeatableQuests: ReturnType<typeof useRepeatableQuests>;
    navigation: ReturnType<typeof useNavigation>;
    worldActions: ReturnType<typeof useWorldActions>;
    slayer: ReturnType<typeof useSlayer>;
    questLogic: ReturnType<typeof useQuestLogic>;
    skilling: ReturnType<typeof useSkilling>;
    interactQuest: ReturnType<typeof useInteractQuest>;
    session: ReturnType<typeof useGameSession>;
    clearedSkillObstacles: string[];
    monsterRespawnTimers: Record<string, number>;
    handlePlayerDeath: () => void;
    handleKill: (uniqueInstanceId: string, attackStyle?: 'melee' | 'ranged' | 'magic') => void;
    onWinCombat: () => void;
    onFleeFromCombat: () => void;
    handleDialogueCheck: (requirements: DialogueCheckRequirement[]) => boolean;
    onResponse: (response: DialogueResponse) => void;
    combatSpeedMultiplier: number;
    activeCombatStyleHighlight?: CombatStance | null;
    isTouchSimulationEnabled: boolean;
    // Map Manager props
    isMapManagerEnabled?: boolean;
    poiCoordinates?: Record<string, { x: number; y: number }>;
    regionCoordinates?: Record<string, { x: number; y: number }>;
    onUpdatePoiCoordinate?: (id: string, x: number, y: number, isRegion: boolean) => void;
    poiConnections?: Record<string, string[]>;
    onUpdatePoiConnections?: (poiId: string, newConnections: string[]) => void;
    // Props from Game that were passed down
    initialState: any;
    onActivity: (activity: POIActivity) => void;
    onExportGame: () => void;
    onImportGame: () => void;
    onResetGame: () => void;
    showAllPois: boolean;
    // New props for dropped items
    groundItemsForCurrentPoi: GroundItem[];
    onPickUpItem: (uniqueId: number) => void;
    onTakeAllLoot: () => void;
    onItemDropped: (item: InventorySlot, overridePoiId?: string) => void;
    isAutoBankOn: boolean;
    handleCombatXpGain: (skill: SkillName, amount: number) => void;
    poiImmunityTimeLeft: number;
    killTrigger: number;
    bankPlaceholders: boolean;
    handleToggleBankPlaceholders: () => void;
    bonfires: BonfireActivity[];
    onStokeBonfire: (logId: string, bonfireId: string) => void;
    isStunned: boolean;
    // FIX: Corrected the type for addBuff to use the specific ActiveBuff type for type safety.
    addBuff: (buff: Omit<ActiveBuff, 'id' | 'durationRemaining'>) => void;
    itemActions: ReturnType<typeof useItemActions>;
    isDevMode: boolean;
    onToggleDevPanel: () => void;
    onToggleTouchSimulation: () => void;
    onDepositEquipment: () => void;
    deathMarker?: WorldState['deathMarker'];
    activeRepeatableQuest: PlayerRepeatableQuest | null;
    onEncounterWin: (defeatedMonsterIds: string[]) => void;
}

const MainViewController: React.FC<MainViewControllerProps> = (props) => {
    const {
        ui, addLog, char, inv, quests, bank, bankLogic, shops, crafting, repeatableQuests, navigation, worldActions, slayer, questLogic, skilling, interactQuest, session, clearedSkillObstacles, monsterRespawnTimers, handlePlayerDeath, handleKill, onWinCombat, onFleeFromCombat, onResponse, handleDialogueCheck, combatSpeedMultiplier, activeCombatStyleHighlight, isTouchSimulationEnabled, showAllPois,
        groundItemsForCurrentPoi, onPickUpItem, onTakeAllLoot, onItemDropped, isAutoBankOn, handleCombatXpGain, poiImmunityTimeLeft, killTrigger,
        bankPlaceholders, handleToggleBankPlaceholders, bonfires, onStokeBonfire, isStunned, addBuff, onExportGame, onImportGame, onResetGame,
        itemActions,
        isDevMode,
        onToggleDevPanel,
        onToggleTouchSimulation,
        onDepositEquipment,
        deathMarker,
        activeRepeatableQuest,
        onActivity,
        onEncounterWin
    } = props;

    const handleTeleport = useCallback((toBoardId: string) => {
        if (isStunned) { addLog("You are stunned and cannot teleport."); return; }
        addLog(`You focus on the quest board and feel yourself pulled through space...`);
        navigation.handleForcedNavigate(toBoardId);
        ui.closeAllModals(); // This will close the teleport modal
    }, [addLog, navigation, ui, isStunned]);

    const mainContent = (() => {
        if (ui.activeCraftingAction && ui.activeCraftingAction.recipeType !== 'firemaking-stoke') {
            return <CraftingProgressView
                action={ui.activeCraftingAction}
                onCancel={() => {
                    addLog("You cancel the action.");
                    ui.setActiveCraftingAction(null);
                }}
            />;
        }
        if (ui.combatQueue.length > 0) {
            return <CombatView 
                monsterQueue={ui.combatQueue} 
                isMandatory={ui.isMandatoryCombat}
                playerSkills={char.skills} 
                playerHp={char.currentHp} 
                equipment={inv.equipment} 
                combatStance={char.combatStance}
                setCombatStance={char.setCombatStance} 
                setPlayerHp={char.setCurrentHp} 
                onCombatEnd={onWinCombat}
                onFlee={onFleeFromCombat}
                addXp={handleCombatXpGain} 
                addLoot={inv.modifyItem}
                onDropLoot={onItemDropped}
                isAutoBankOn={isAutoBankOn}
                addLog={addLog} 
                onConsumeAmmo={inv.handleConsumeAmmo} 
                onPlayerDeath={handlePlayerDeath} 
                onKill={handleKill} 
                onEncounterWin={onEncounterWin}
                activeBuffs={char.activeBuffs}
                combatSpeedMultiplier={combatSpeedMultiplier}
                advanceTutorial={() => {}}
                autocastSpell={char.autocastSpell}
                inv={inv}
                ui={ui}
                killTrigger={killTrigger}
                applyStatModifier={char.applyStatModifier}
                isStunned={isStunned}
                addBuff={addBuff}
                showPlayerHealthNumbers={ui.showCombatPlayerHealth}
                showEnemyHealthNumbers={ui.showCombatEnemyHealth}
                showHitsplats={ui.showHitsplats}
            />;
        }
        if (ui.activeTeleportBoardId) {
            return <TeleportView
                fromBoardId={ui.activeTeleportBoardId}
                boardCompletions={repeatableQuests.boardCompletions}
                onTeleport={handleTeleport}
                onClose={() => ui.setActiveTeleportBoardId(null)}
            />
        }
        if (ui.activePanel === 'bank') return <BankView 
            bank={bank}
            onClose={() => ui.setActivePanel(null)}
            onWithdraw={bankLogic.handleWithdraw}
            onDepositBackpack={() => bankLogic.handleDepositBackpack(ui.activeBankTabId)}
            onDepositEquipment={() => bankLogic.handleDepositEquipment(ui.activeBankTabId)}
            onMoveItem={bankLogic.moveBankItem}
            onAddTab={bankLogic.addTab}
            // FIX: Corrected property name from onRemoveTab to removeTab to match the hook's return value.
            onRemoveTab={bankLogic.removeTab}
            onMoveItemToTab={bankLogic.moveItemToTab}
            onRenameTab={bankLogic.handleRenameTab}
            setContextMenu={ui.setContextMenu}
            setMakeXPrompt={ui.setMakeXPrompt}
            setTooltip={ui.setTooltip}
            bankPlaceholders={bankPlaceholders}
            handleToggleBankPlaceholders={handleToggleBankPlaceholders}
            ui={ui}
            isOneClickMode={ui.isOneClickMode}
        />;
        if (ui.activeShopId) return <ShopView 
            shopId={ui.activeShopId}
            playerCoins={inv.coins}
            shopStates={shops.shopStates} 
            onBuy={shops.handleBuy}
            addLog={addLog} 
            onExit={() => ui.setActiveShopId(null)} 
            setContextMenu={ui.setContextMenu} 
            setMakeXPrompt={ui.setMakeXPrompt} 
            setTooltip={ui.setTooltip} 
        />;
        
        if (ui.activeCraftingContext) return <CraftingView
            context={ui.activeCraftingContext}
            inventory={inv.inventory}
            skills={char.skills}
            playerQuests={quests.playerQuests}
            onCook={crafting.handleCooking}
            onCraftItem={crafting.handleCrafting}
            onFletch={crafting.handleFletching}
            onCut={crafting.handleGemCutting}
            onSmithBar={crafting.handleSmelting}
            onSmithItem={crafting.handleSmithItem}
            onSpin={crafting.handleSpinning}
            onExit={ui.closeCraftingView}
            setContextMenu={ui.setContextMenu}
            setMakeXPrompt={ui.setMakeXPrompt}
            setTooltip={ui.setTooltip}
        />;
        
        if (ui.activeQuestBoardId) return <QuestBoardView 
            boardId={ui.activeQuestBoardId}
            boardQuests={(repeatableQuests.boards[ui.activeQuestBoardId] ?? []).filter(q => !repeatableQuests.completedQuestIds.includes(q.id))}
            activePlayerQuest={repeatableQuests.activePlayerQuest}
            inventory={inv.inventory}
            onAccept={repeatableQuests.acceptQuest}
            onTurnIn={repeatableQuests.handleTurnInRepeatableQuest}
            onExit={() => ui.setActiveQuestBoardId(null)}
            nextResetTimestamp={repeatableQuests.nextResetTimestamp}
            boardCompletions={repeatableQuests.boardCompletions}
            onOpenTeleportModal={() => ui.setActiveTeleportBoardId(ui.activeQuestBoardId!)}
         />
        
        const poi = POIS[session.currentPoiId];
        if (!poi) {
            console.error(`Error: Could not find POI with id "${session.currentPoiId}". Defaulting to start location.`);
            addLog(`Error: Location "${session.currentPoiId}" not found. Returning to Meadowdale.`);
            session.setCurrentPoiId('meadowdale_south_gate');
            return <div>Error: Location not found. Resetting...</div>;
        }

        return (
            <SceneView poi={poi} unlockedPois={navigation.reachablePois} onNavigate={navigation.handleNavigate} inventory={inv.inventory}
                onActivity={onActivity}
                worldActions={worldActions}
                onStartCombat={(uniqueInstanceId) => { ui.setCombatQueue([uniqueInstanceId]); ui.setIsMandatoryCombat(false); }}
                playerQuests={quests.playerQuests} setContextMenu={ui.setContextMenu} setMakeXPrompt={ui.setMakeXPrompt} addLog={addLog}
                startQuest={quests.startQuest} hasItems={inv.hasItems} 
                resourceNodeStates={skilling.resourceNodeStates} activeSkillingNodeId={skilling.activeSkillingNodeId} onToggleSkilling={skilling.handleToggleSkilling} initializeNodeState={skilling.initializeNodeState}
                skillingTick={skilling.skillingTick}
                getSuccessChance={skilling.getSuccessChance}
                activeRepeatableQuest={activeRepeatableQuest} 
                activeCleanup={interactQuest.activeCleanup}
                onStartInteractQuest={interactQuest.handleStartInteractQuest}
                onCancelInteractQuest={interactQuest.handleCancelInteractQuest}
                clearedSkillObstacles={clearedSkillObstacles}
                onClearObstacle={worldActions.handleClearObstacle}
                skills={char.skills as any[]}
                monsterRespawnTimers={monsterRespawnTimers}
                setTooltip={ui.setTooltip}
                setActiveDialogue={ui.setActiveDialogue}
                handleDialogueCheck={handleDialogueCheck}
                onResponse={onResponse}
                onDepositBackpack={() => bankLogic.handleDepositBackpack(ui.activeBankTabId)}
                onDepositEquipment={onDepositEquipment}
                ui={ui}
                isTouchSimulationEnabled={isTouchSimulationEnabled}
                bonfires={bonfires.filter(b => b.uniqueId.startsWith(session.currentPoiId))}
                onStokeBonfire={crafting.handleStokeBonfire}
                isOneClickMode={ui.isOneClickMode}
            />
        );
    })();
    
    return (
        <>
            {poiImmunityTimeLeft > 0 && (
                <div className="absolute top-2 left-2 bg-blue-900/80 text-blue-200 border border-blue-500 rounded-lg px-3 py-1 text-sm font-semibold animate-pulse z-20">
                    Aggression Immunity: {poiImmunityTimeLeft}s
                </div>
            )}
            {mainContent}
            {ui.isLootViewOpen && (
                <LootView
                    items={groundItemsForCurrentPoi}
                    deathMarker={deathMarker}
                    onPickUp={onPickUpItem}
                    onTakeAll={onTakeAllLoot}
                    onClose={() => ui.setIsLootViewOpen(false)}
                    setTooltip={ui.setTooltip}
                />
            )}
            {ui.isEquipmentStatsViewOpen && (
                <div className="absolute inset-0 bg-black/80 z-30 p-4">
                    <EquipmentStatsView 
                        equipment={inv.equipment} 
                        onClose={() => ui.setIsEquipmentStatsViewOpen(false)}
                        onUnequip={inv.handleUnequip}
                        setTooltip={ui.setTooltip}
                        ui={ui}
                        addLog={addLog}
                        onExamine={itemActions.handleExamine}
                        isTouchSimulationEnabled={isTouchSimulationEnabled}
                    />
                </div>
            )}
        </>
    );
};

export default MainViewController;