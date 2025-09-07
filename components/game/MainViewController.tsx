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
import { SkillName } from '../../types';
import { QUESTS } from '../../constants';
import { POIS } from '../../data/pois';
import CraftingProgressView from '../views/crafting/CraftingProgressView';
import CombatView from '../views/CombatView';
import QuestDialogueView from '../views/dialogue/QuestDialogueView';
import InteractiveDialogueView from '../views/dialogue/InteractiveDialogueView';
import NpcDialogueView from '../views/dialogue/NpcDialogueView';
import BankView from '../views/BankView';
import ShopView from '../views/ShopView';
import CraftingView from '../views/crafting/CraftingView';
import QuestBoardView from '../views/QuestBoardView';
import SceneView from './SceneView';
import TeleportView from '../views/TeleportView';

interface MainViewControllerProps {
    ui: ReturnType<typeof useUIState>;
    addLog: (message: string) => void;
    char: ReturnType<typeof useCharacter>;
    inv: ReturnType<typeof useInventory>;
    quests: ReturnType<typeof useQuests>;
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
    handleKill: (uniqueInstanceId: string) => void;
    combatSpeedMultiplier: number;
}

const MainViewController: React.FC<MainViewControllerProps> = (props) => {
    const {
        ui, addLog, char, inv, quests, bankLogic, shops, crafting, repeatableQuests, navigation, worldActions, slayer, questLogic, skilling, interactQuest, session, clearedSkillObstacles, monsterRespawnTimers, handlePlayerDeath, handleKill, combatSpeedMultiplier
    } = props;

    const handleCustomDialogueAction = useCallback((actionId: string | undefined) => {
        if (!actionId) return;

        switch(actionId) {
            case 'travel_to_isle_of_whispers':
                if (inv.coins >= 10) {
                    inv.modifyItem('coins', -10);
                    addLog("You pay the ferryman 10 coins and set sail across the vast ocean.");
                    navigation.handleForcedNavigate('port_wreckage_docks');
                } else {
                    addLog("You don't have enough coins for the ferry.");
                    ui.closeAllModals();
                }
                break;
            case 'travel_to_silverhaven':
                addLog("You sail back to the mainland.");
                navigation.handleForcedNavigate('silverhaven_docks');
                break;
            default:
                console.warn(`Unknown custom dialogue action: ${actionId}`);
                ui.closeAllModals();
        }
    }, [inv, addLog, navigation, ui]);

    const handleTeleport = useCallback((toBoardId: string) => {
        addLog(`You focus on the quest board and feel yourself pulled through space...`);
        navigation.handleForcedNavigate(toBoardId);
        ui.closeAllModals(); // This will close the teleport modal
    }, [addLog, navigation, ui]);

    if (ui.activeCraftingAction) {
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
            addXp={char.addXp} 
            addLoot={inv.modifyItem}
            addLog={addLog} 
            onConsumeAmmo={inv.handleConsumeAmmo} 
            onPlayerDeath={handlePlayerDeath} 
            onKill={handleKill} 
            activeBuffs={char.activeBuffs}
            combatSpeedMultiplier={combatSpeedMultiplier}
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
    if (ui.activeQuestDialogue) {
        return <QuestDialogueView
            dialogueInfo={ui.activeQuestDialogue}
            onAcceptQuest={(questId) => quests.startQuest(questId, addLog)}
            onEndDialogue={() => ui.setActiveQuestDialogue(null)}
        />;
    }
    if (ui.activeInteractiveDialogue) {
        return <InteractiveDialogueView
            dialogueInfo={ui.activeInteractiveDialogue}
            onClose={() => ui.setActiveInteractiveDialogue(null)}
            onCustomAction={handleCustomDialogueAction}
        />;
    }
    if (ui.activeNpcDialogue) {
        return <NpcDialogueView
            npc={ui.activeNpcDialogue}
            onClose={() => ui.setActiveNpcDialogue(null)}
        />;
    }
    if (ui.activePanel === 'bank') return <BankView 
        bank={bankLogic.bank}
        onClose={() => ui.setActivePanel(null)}
        onWithdraw={bankLogic.handleWithdraw}
        onDepositBackpack={bankLogic.handleDepositBackpack}
        onDepositEquipment={bankLogic.handleDepositEquipment}
        setContextMenu={ui.setContextMenu}
        setMakeXPrompt={ui.setMakeXPrompt}
        setTooltip={ui.setTooltip}
    />;
    if (ui.activeShopId) return <ShopView shopId={ui.activeShopId} playerInventory={inv.inventory} playerCoins={inv.coins} shopStates={shops.shopStates} onBuy={shops.handleBuy} onSell={inv.handleSell} addLog={addLog} onExit={() => ui.setActiveShopId(null)} setContextMenu={ui.setContextMenu} setMakeXPrompt={ui.setMakeXPrompt} setTooltip={ui.setTooltip} />;
    
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
    
    return (
        <SceneView poi={POIS[session.currentPoiId]} unlockedPois={navigation.reachablePois} onNavigate={navigation.handleNavigate} inventory={inv.inventory}
            onActivity={activity => {
                if (activity.type === 'shearing' || activity.type === 'egg_collecting') worldActions.handleSimpleSkilling(activity);
                if (activity.type === 'shop') ui.setActiveShopId(activity.shopId);
                if (activity.type === 'bank') ui.setActivePanel('bank');
                if (activity.type === 'slayer_master') slayer.handleSlayerMasterInteraction();
                if (activity.type === 'blimp_travel') {
                    const slayerLevel = char.skills.find(s => s.name === SkillName.Slayer)?.level ?? 1;
                    if (slayerLevel < activity.requiredSlayerLevel) {
                        addLog(`You need a Slayer level of ${activity.requiredSlayerLevel} to use this service.`);
                    } else {
                        addLog("The blimp service to other regions is not yet available.");
                    }
                }
                if (activity.type === 'quest_start') {
                    const questData = QUESTS[activity.questId];
                    if (questData?.dialogue) {
                        ui.setActiveQuestDialogue({ questId: activity.questId });
                    } else {
                        quests.startQuest(activity.questId, addLog);
                    }
                }
                if (activity.type === 'npc') {
                    if (activity.name === 'Tanner Sven') {
                        const cowhideCount = inv.inventory.filter(i => i.itemId === 'cowhide').length;
                        const tanningCost = 5;
                        const maxAffordable = Math.floor(inv.coins / tanningCost);
                        const maxTannable = Math.min(cowhideCount, maxAffordable);
            
                        if (maxTannable < 1) {
                            addLog("Sven tells you: \"You'll need at least one cowhide and 5 coins for me to get to work.\"");
                            ui.setActiveNpcDialogue({ name: activity.name, icon: activity.icon, dialogue: activity.dialogue });
                            return;
                        }
            
                        ui.setMakeXPrompt({
                            title: 'Tan Cowhide (5 coins each)',
                            max: maxTannable,
                            onConfirm: (quantity) => {
                                worldActions.handleInstantTanning(quantity);
                            }
                        });
                    } else {
                         ui.setActiveNpcDialogue({ name: activity.name, icon: activity.icon, dialogue: activity.dialogue });
                    }
                }
                if (activity.type === 'cooking_range') ui.openCraftingView({ type: 'cooking_range' });
                if (activity.type === 'furnace') ui.openCraftingView({ type: 'furnace' });
                if (activity.type === 'anvil') ui.openCraftingView({ type: 'anvil' });
                if (activity.type === 'spinning_wheel') ui.openCraftingView({ type: 'spinning_wheel' });
                if (activity.type === 'wishing_well') worldActions.handleWishingWell();
                if (activity.type === 'water_source') worldActions.handleFillVials();
                if (activity.type === 'quest_board') ui.setActiveQuestBoardId(session.currentPoiId);
                if (activity.type === 'interactive_dialogue') ui.setActiveInteractiveDialogue({ dialogue: activity.dialogue, startNode: activity.startNode });
            }}
            onStartCombat={(uniqueInstanceId) => { ui.setCombatQueue([uniqueInstanceId]); ui.setIsMandatoryCombat(false); }}
            playerQuests={quests.playerQuests} completeQuestStage={questLogic.completeQuestStage} setContextMenu={ui.setContextMenu} setMakeXPrompt={ui.setMakeXPrompt} addLog={addLog} 
            onSmelt={(quantity) => crafting.handleSmelting('bronze_bar', quantity)}
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
            skills={char.skills}
            monsterRespawnTimers={monsterRespawnTimers}
            setTooltip={ui.setTooltip}
            setActiveQuestDialogue={ui.setActiveQuestDialogue}
            setActiveInteractiveDialogue={ui.setActiveInteractiveDialogue}
        />
    );
};

export default MainViewController;
