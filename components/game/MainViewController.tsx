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
import { SkillName, InventorySlot, CombatStance, POIActivity, GroundItem, Spell, BonfireActivity, DialogueCheckRequirement, DialogueAction, BankTab } from '../../types';
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
    handleDialogueAction: (actions: DialogueAction[]) => void;
    handleDialogueCheck: (requirements: DialogueCheckRequirement[]) => boolean;
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
    onExportGame: () => void;
    onImportGame: () => void;
    onResetGame: () => void;
    showAllPois: boolean;
    // New props for dropped items
    groundItemsForCurrentPoi: GroundItem[];
    onPickUpItem: (uniqueId: number) => void;
    onTakeAllLoot: () => void;
    onItemDropped: (item: InventorySlot) => void;
    isAutoBankOn: boolean;
    handleCombatXpGain: (skill: SkillName, amount: number) => void;
    immunityTimeLeft: number;
    poiImmunityTimeLeft: number;
    killTrigger: number;
    bankPlaceholders: boolean;
    handleToggleBankPlaceholders: () => void;
    bonfires: BonfireActivity[];
    onStokeBonfire: (logId: string, bonfireId: string) => void;
    isStunned: boolean;
    addBuff: (buff: any) => void;
    itemActions: ReturnType<typeof useItemActions>;
    isDevMode: boolean;
    onToggleDevPanel: () => void;
    onToggleTouchSimulation: () => void;
    onDepositEquipment: () => void;
}

const MainViewController: React.FC<MainViewControllerProps> = (props) => {
    const {
        ui, addLog, char, inv, quests, bank, bankLogic, shops, crafting, repeatableQuests, navigation, worldActions, slayer, questLogic, skilling, interactQuest, session, clearedSkillObstacles, monsterRespawnTimers, handlePlayerDeath, handleKill, handleDialogueAction, handleDialogueCheck, combatSpeedMultiplier, activeCombatStyleHighlight, isTouchSimulationEnabled, showAllPois,
        groundItemsForCurrentPoi, onPickUpItem, onTakeAllLoot, onItemDropped, isAutoBankOn, handleCombatXpGain, immunityTimeLeft, poiImmunityTimeLeft, killTrigger,
        bankPlaceholders, handleToggleBankPlaceholders, bonfires, onStokeBonfire, isStunned, addBuff, onExportGame, onImportGame, onResetGame,
        itemActions,
        isDevMode,
        onToggleDevPanel,
        onToggleTouchSimulation,
        onDepositEquipment,
    } = props;

    const handleTeleport = useCallback((toBoardId: string) => {
        if (isStunned) { addLog("You are stunned and cannot teleport."); return; }
        addLog(`You focus on the quest board and feel yourself pulled through space...`);
        navigation.handleForcedNavigate(toBoardId);
        ui.closeAllModals(); // This will close the teleport modal
    }, [addLog, navigation, ui, isStunned]);

    const onActivity = (activity: POIActivity) => {
        if (isStunned) { addLog("You are stunned and cannot perform actions."); return; }
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
        else if (activity.type === 'water_source') worldActions.handleCollectWater();
        else if (activity.type === 'milking') worldActions.handleMilking();
        else if (activity.type === 'quest_board') ui.setActiveQuestBoardId(session.currentPoiId);
        else if (activity.type === 'ancient_chest') worldActions.handleOpenAncientChest();
        else if (activity.type === 'runecrafting_altar') crafting.handleInstantRunecrafting(activity.runeId);
        else if (activity.type === 'shearing') worldActions.handleSimpleSkilling(activity);
        else if (activity.type === 'ladder') navigation.handleForcedNavigate(activity.toPoiId);
    };

    const mainContent = (() => {
        if (ui.isSettingsViewOpen) {
            return <SettingsView 
                onClose={() => ui.setIsSettingsViewOpen(false)} 
                onExportGame={onExportGame}
                onImportGame={onImportGame}
                onResetGame={onResetGame}
                isDevMode={isDevMode}
                onToggleDevPanel={onToggleDevPanel}
                isTouchSimulationEnabled={isTouchSimulationEnabled}
                onToggleTouchSimulation={onToggleTouchSimulation}
                ui={ui}
                bankPlaceholders={bankPlaceholders}
                handleToggleBankPlaceholders={handleToggleBankPlaceholders}
            />
        }
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
                onCombatEnd={() => {
                    ui.setCombatQueue([]);
                    ui.setIsMandatoryCombat(false);
                }} 
                addXp={handleCombatXpGain} 
                addLoot={inv.modifyItem}
                onDropLoot={onItemDropped}
                isAutoBankOn={isAutoBankOn}
                addLog={addLog} 
                onConsumeAmmo={inv.handleConsumeAmmo} 
                onPlayerDeath={handlePlayerDeath} 
                onKill={handleKill} 
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
        if (ui.equipmentStats) {
            return <EquipmentStatsView 
                equipment={inv.equipment} 
                onClose={() => ui.setEquipmentStats(null)}
                onUnequip={inv.handleUnequip}
                setTooltip={ui.setTooltip}
                ui={ui}
                addLog={addLog}
                onExamine={itemActions.handleExamine}
                isTouchSimulationEnabled={isTouchSimulationEnabled}
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
                activeRepeatableQuest={repeatableQuests.activePlayerQuest} 
                activeCleanup={interactQuest.activeCleanup}
                onStartInteractQuest={interactQuest.handleStartInteractQuest}
                onCancelInteractQuest={interactQuest.handleCancelInteractQuest}
                clearedSkillObstacles={clearedSkillObstacles}
                onClearObstacle={worldActions.handleClearObstacle}
                skills={char.skills as any[]}
                monsterRespawnTimers={monsterRespawnTimers}
                setTooltip={ui.setTooltip}
                setActiveDialogue={ui.setActiveDialogue}
                handleDialogueAction={handleDialogueAction}
                handleDialogueCheck={handleDialogueCheck}
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
            {immunityTimeLeft > 0 && (
                <div className="absolute top-2 left-2 bg-blue-900/80 text-blue-200 border border-blue-500 rounded-lg px-3 py-1 text-sm font-semibold animate-pulse z-20">
                    Death Immunity: {immunityTimeLeft}s
                </div>
            )}
             {poiImmunityTimeLeft > 0 && (
                <div className="absolute top-2 left-2 bg-green-900/80 text-green-200 border border-green-500 rounded-lg px-3 py-1 text-sm font-semibold animate-pulse z-20">
                    Room Cleared! Immunity: {poiImmunityTimeLeft}s
                </div>
            )}
            {mainContent}
            {ui.isLootViewOpen && (
                <LootView
                    items={groundItemsForCurrentPoi}
                    onPickUp={onPickUpItem}
                    onTakeAll={onTakeAllLoot}
                    onClose={() => ui.setIsLootViewOpen(false)}
                    setTooltip={ui.setTooltip}
                />
            )}
        </>
    );
};

export default MainViewController;