import { useCallback } from 'react';
import { PlayerQuestState, SkillName, InventorySlot } from '../types';
import { QUESTS, ITEMS, MONSTERS } from '../constants';
import { POIS } from '../data/pois';
import { useQuests } from './useQuests';
import { useQuestLogic } from './useQuestLogic';
import { useNavigation } from './useNavigation';
import { useInventory } from './useInventory';
import { useCharacter } from './useCharacter';
import { useWorldActions } from './useWorldActions';

interface DialogueActionDependencies {
    quests: ReturnType<typeof useQuests>;
    questLogic: ReturnType<typeof useQuestLogic>;
    navigation: ReturnType<typeof useNavigation>;
    inv: ReturnType<typeof useInventory>;
    char: ReturnType<typeof useCharacter>;
    worldActions: ReturnType<typeof useWorldActions>;
    addLog: (message: string) => void;
}

interface DialogueAction {
    type: string;
    questId?: string;
    actionId?: string;
    items?: InventorySlot[];
    itemsToConsume?: { itemId: string; quantity: number }[];
    failureNext?: string;
}

export const useDialogueActions = (deps: DialogueActionDependencies) => {
    const { quests, questLogic, navigation, inv, char, worldActions, addLog } = deps;

    const handleDialogueAction = useCallback((action: DialogueAction): boolean => {
        if (action.itemsToConsume) {
            if (!inv.hasItems(action.itemsToConsume)) {
                return false; // Action failed
            }
            action.itemsToConsume.forEach(item => inv.modifyItem(item.itemId, -item.quantity, true));
        }
        if (action.items) {
            action.items.forEach(item => {
                inv.modifyItem(item.itemId, item.quantity, false, item.doses, { bypassAutoBank: true });
                addLog(`You receive ${item.quantity}x ${ITEMS[item.itemId].name}.`);
            });
        }

        if (action.type === 'accept_quest' && action.questId) {
            quests.startQuest(action.questId, addLog);
        } else if (action.type === 'complete_stage' && action.questId) {
            questLogic.completeQuestStage(action.questId);
        } else if (action.type === 'custom') {
            if (action.actionId) {
                 switch (action.actionId) {
                    case 'teleport_to_rune_mine':
                        navigation.handleForcedNavigate('rune_essence_mine');
                        break;
                    case 'craft_gust_runes_quest':
                        if (inv.hasItems([{ itemId: 'rune_essence', quantity: 5 }])) {
                            inv.modifyItem('rune_essence', -5, true);
                            inv.modifyItem('gust_rune', 5, false, undefined, { bypassAutoBank: true });
                            char.addXp(SkillName.Runecrafting, 10);
                            addLog("You place the items on the altar and feel a rush of energy. You have created Gust Runes!");
                            questLogic.completeQuestStage('magical_runestone_discovery');
                        } else {
                            addLog("You need 5 Rune Essence to do this.");
                        }
                        break;
                    case 'buy_beer':
                        if (inv.coins >= 2) {
                            inv.modifyItem('coins', -2, true);
                            inv.modifyItem('beer', 1);
                            addLog("You buy a pint of fine ale.");
                        } else {
                            addLog("You can't afford that.");
                        }
                        break;
                    case 'rent_room':
                        if (inv.coins >= 10) {
                            inv.modifyItem('coins', -10, true);
                            char.setCurrentHp(char.maxHp);
                            char.clearStatModifiers();
                            addLog("You rent a room for the night. You feel fully rested.");
                        } else {
                            addLog("You can't afford a room.");
                        }
                        break;
                    // Travel actions
                    case 'travel_to_isle_of_whispers':
                        if (inv.coins >= 10) {
                            inv.modifyItem('coins', -10);
                            addLog("You pay the ferryman 10 coins.");
                            navigation.handleForcedNavigate('port_wreckage_docks');
                        } else {
                            addLog("You don't have enough coins for the ferry.");
                        }
                        break;
                    case 'travel_to_crystalline_isles':
                        if (inv.coins >= 1600) {
                            inv.modifyItem('coins', -1600);
                            addLog("You pay the skyship captain 1600 coins.");
                            navigation.handleForcedNavigate('crystalline_isles_landing');
                        } else {
                            addLog("You can't afford the skyship charter.");
                        }
                        break;
                    case 'travel_to_silverhaven':
                        if (inv.coins >= 10) {
                            inv.modifyItem('coins', -10);
                            addLog("You pay the ferryman 10 coins for the return trip.");
                            navigation.handleForcedNavigate('silverhaven_docks');
                        } else {
                            addLog("You don't have enough coins for the ferry.");
                        }
                        break;
                    case 'travel_from_crystalline_isles_to_silverhaven':
                        if (inv.coins >= 1600) {
                            inv.modifyItem('coins', -1600);
                            addLog("You pay the skyship captain 1600 coins for the return trip.");
                            navigation.handleForcedNavigate('silverhaven_docks');
                        } else {
                            addLog("You can't afford the skyship charter.");
                        }
                        break;
                    
                    // Tanning actions
                    case 'tan_cowhide':
                        worldActions.handleTanning('cowhide', 'leather', 5, 1);
                        break;
                    case 'tan_boar_hide':
                        worldActions.handleTanning('boar_hide', 'boar_leather', 8, 1);
                        break;
                    case 'tan_wolf_pelt':
                        worldActions.handleTanning('wolf_pelt', 'wolf_leather', 15, 1);
                        break;
                    case 'tan_bear_pelt':
                        worldActions.handleTanning('bear_pelt', 'bear_leather', 25, 1);
                        break;
                 }
            }
        }
        return true; // Action succeeded
    }, [quests, questLogic, navigation, inv, char, worldActions, addLog]);

    return { handleDialogueAction };
};