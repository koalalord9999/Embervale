

import React, { useCallback } from 'react';
import { DialogueAction, DialogueCheckRequirement, WorldState, InventorySlot, BankTab, ActivePanel, POIActivity } from '../types';
import { INVENTORY_CAPACITY } from '../constants';
import { useQuests } from './useQuests';
import { useQuestLogic } from './useQuestLogic';
import { useNavigation } from './useNavigation';
import { useInventory } from './useInventory';
import { useCharacter } from './useCharacter';
import { useWorldActions } from './useWorldActions';
import { useRepeatableQuests } from './useRepeatableQuests';
import { useUIState } from './useUIState';
import { POIS } from '../data/pois';
import { useGameSession } from './useGameSession';

interface DialogueActionDependencies {
    quests: ReturnType<typeof useQuests>;
    questLogic: ReturnType<typeof useQuestLogic>;
    navigation: ReturnType<typeof useNavigation>;
    inv: ReturnType<typeof useInventory>;
    char: ReturnType<typeof useCharacter>;
    worldActions: ReturnType<typeof useWorldActions>;
    addLog: (message: string) => void;
    worldState: WorldState;
    setBank: React.Dispatch<React.SetStateAction<BankTab[]>>;
    setActivityLog: React.Dispatch<React.SetStateAction<string[]>>;
    repeatableQuests: ReturnType<typeof useRepeatableQuests>;
    ui: ReturnType<typeof useUIState>;
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>;
    session: ReturnType<typeof useGameSession>;
}

export const useDialogueActions = (deps: DialogueActionDependencies) => {
    const { quests, questLogic, navigation, inv, char, worldActions, addLog, worldState, setBank, setActivityLog, repeatableQuests, ui, setWorldState, session } = deps;

    const handleDialogueCheck = useCallback((requirements: DialogueCheckRequirement[]): boolean => {
        return requirements.every(req => {
            switch (req.type) {
                case 'items':
                    return inv.hasItems(req.items);
                case 'coins':
                    return inv.coins >= req.amount;
                case 'skill':
                    const skill = char.skills.find(s => s.name === req.skill);
                    if (!skill) return false;
                    const { level } = skill;
                    return level >= req.level;
                case 'world_state':
                    if (req.property === 'windmillFlour') {
                        const operator = req.operator ?? 'gte';
                        if (operator === 'gte') {
                            return worldState.windmillFlour >= req.value;
                        } else { // 'eq'
                            return worldState.windmillFlour === req.value;
                        }
                    }
                    return false;
                case 'quest':
                    const playerQuest = quests.playerQuests.find(q => q.questId === req.questId);
                    switch (req.status) {
                        case 'not_started':
                            return !playerQuest;
                        case 'in_progress':
                            let inProgressCheck = !!playerQuest && !playerQuest.isComplete;
                            if (req.stage !== undefined) {
                                inProgressCheck = inProgressCheck && playerQuest.currentStage === req.stage;
                            }
                            return inProgressCheck;
                        case 'completed':
                            return !!playerQuest && playerQuest.isComplete;
                    }
                    return false; // Should not be reached
            }
        });
    }, [inv, char, worldState, quests.playerQuests]);

    const handleDialogueAction = useCallback((actions: DialogueAction[]) => {
        for (const action of actions) {
            switch (action.type) {
                case 'give_item':
                    inv.modifyItem(action.itemId, action.quantity, false, undefined, { bypassAutoBank: true, noted: action.noted });
                    break;
                case 'take_item':
                    inv.modifyItem(action.itemId, -action.quantity, true);
                    break;
                case 'give_coins':
                    inv.modifyItem('coins', action.amount, false);
                    break;
                case 'take_coins':
                    inv.modifyItem('coins', -action.amount, true);
                    break;
                case 'give_xp':
                    char.addXp(action.skill, action.amount);
                    break;
                case 'start_quest':
                    quests.startQuest(action.questId, addLog);
                    break;
                case 'advance_quest':
                    questLogic.completeQuestStage(action.questId);
                    break;
                case 'complete_quest':
                    questLogic.forceCompleteQuest(action.questId);
                    break;
                case 'teleport':
                    navigation.handleForcedNavigate(action.poiId);
                    break;
                case 'heal':
                    char.setCurrentHp(hp => action.amount === 'full' ? char.maxHp : Math.min(char.maxHp, hp + action.amount));
                    if (action.amount === 'full') {
                        addLog("You feel fully rested.");
                    }
                    break;
                case 'restore_stats':
                    char.clearStatModifiers();
                    addLog("Your boosted stats return to normal.");
                    break;
                case 'open_bank':
                    ui.setActivePanel('bank');
                    break;
                case 'complete_tutorial': {
                    // Automatically turn in the tutorial repeatable quest if it's active.
                    if (repeatableQuests.activePlayerQuest?.questId === 'tutorial_magic_rat') {
                        repeatableQuests.handleTurnInRepeatableQuest();
                        addLog("Your 'Magical Pest Control' task was automatically turned in.");
                    }
                    
                    // Wipe everything
                    inv.setInventory(new Array(INVENTORY_CAPACITY).fill(null));
                    setBank([{ id: 0, name: 'Main', icon: null, items: [] }]);
                    inv.setCoins(0);
                    setActivityLog([]);

                    // Give starter pack
                    const starterItems = [
                        { id: 'bronze_axe', qty: 1 },
                        { id: 'bronze_pickaxe', qty: 1 },
                        { id: 'tinderbox', qty: 1 },
                        { id: 'hammer', qty: 1 },
                        { id: 'small_fishing_net', qty: 1 },
                        { id: 'cooked_shrimp', qty: 1 },
                        { id: 'bread', qty: 1 },
                        { id: 'bronze_dagger', qty: 1 },
                        { id: 'bronze_sword', qty: 1 },
                        { id: 'wooden_shield', qty: 1 },
                        { id: 'shortbow', qty: 1 },
                        { id: 'bronze_arrow', qty: 50 },
                        { id: 'gust_rune', qty: 50 },
                        { id: 'binding_rune', qty: 50 },
                    ];
                    starterItems.forEach(item => inv.modifyItem(item.id, item.qty, true, undefined, { bypassAutoBank: true }));
                    addLog("You have completed your training and received a starter pack!");

                    questLogic.forceCompleteQuest('embrune_101');
                    break;
                }
                case 'set_quest_combat_reward': {
                    setWorldState(ws => ({ ...ws, pendingQuestCombatReward: { itemId: action.itemId, quantity: action.quantity } }));
                    break;
                }
                case 'start_mandatory_combat': {
                    // This creates a unique instance for a quest-spawned monster that does not respawn.
                    const uniqueId = `${session.currentPoiId}:${action.monsterId}:quest`;
                    ui.setCombatQueue([uniqueId]);
                    ui.setIsMandatoryCombat(true);
                    break;
                }
            }
        }
    }, [inv, char, quests, questLogic, navigation, addLog, setBank, setActivityLog, repeatableQuests, worldState, ui, setWorldState, session.currentPoiId]);

    return { handleDialogueAction, handleDialogueCheck };
};
