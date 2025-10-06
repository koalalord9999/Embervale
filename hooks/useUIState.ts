
import React, { useState, useCallback, useMemo } from 'react';
import { ActivePanel, SkillName, InventorySlot, ActiveCraftingAction, DialogueNode, CraftingContext, Equipment, PlayerQuestState, Spell, Item, DialogueResponse, DialogueCheckRequirement } from '../types';
import { ContextMenuOption } from '../components/common/ContextMenu';

export interface DialogueState {
    npcName: string;
    npcIcon: string;
    nodes: Record<string, DialogueNode>;
    currentNodeKey: string;
    onEnd: () => void;
    onResponse: (response: DialogueResponse) => void;
    onNavigate?: (nextNodeKey: string) => void;
    handleDialogueCheck?: (requirements: DialogueCheckRequirement[]) => boolean;
}

export interface TooltipState {
    content?: React.ReactNode;
    item?: Item;
    slot?: InventorySlot;
    position: { x: number; y: number; };
}

export interface ContextMenuState {
    options: ContextMenuOption[];
    event: React.MouseEvent | React.Touch;
    isTouchInteraction: boolean;
}

export interface MakeXPrompt {
    title: string;
    max: number;
    onConfirm: (quantity: number) => void;
}

export interface ConfirmationPrompt {
    message: string;
    onConfirm: () => void;
}

export interface QuestDetailState {
    questId: string;
    playerQuests: PlayerQuestState[];
}

export interface ExportDataState {
    data: string;
    onCopy?: () => void;
    title?: string;
    copyButtonText?: string;
}

export interface ItemsOnDeathData {
    inventory: (InventorySlot | null)[];
    equipment: Equipment;
    coins: number;
}


export const useUIState = () => {
    const [activePanel, setActivePanel] = useState<ActivePanel>(null);
    const [combatQueue, setCombatQueue] = useState<string[]>([]);
    const [isMandatoryCombat, setIsMandatoryCombat] = useState<boolean>(false);
    const [activeShopId, setActiveShopId] = useState<string | null>(null);
    const [activeCraftingContext, setActiveCraftingContext] = useState<CraftingContext | null>(null);
    const [itemToUse, setItemToUse] = useState<{ item: InventorySlot, index: number } | null>(null);
    const [spellToCast, setSpellToCast] = useState<Spell | null>(null);
    const [activeQuestBoardId, setActiveQuestBoardId] = useState<string | null>(null);
    const [activeTeleportBoardId, setActiveTeleportBoardId] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const [makeXPrompt, setMakeXPrompt] = useState<MakeXPrompt | null>(null);
    const [activeDialogue, setActiveDialogue] = useState<DialogueState | null>(null);
    const [confirmationPrompt, setConfirmationPrompt] = useState<ConfirmationPrompt | null>(null);
    const [exportData, setExportData] = useState<ExportDataState | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [activeSkillGuide, setActiveSkillGuide] = useState<SkillName | null>(null);
    const [activeCraftingAction, setActiveCraftingAction] = useState<ActiveCraftingAction | null>(null);
    const [activeQuestDetail, setActiveQuestDetail] = useState<QuestDetailState | null>(null);
    const [isSelectingAutocastSpell, setIsSelectingAutocastSpell] = useState<boolean>(false);
    const [manualCastTrigger, setManualCastTrigger] = useState<Spell | null>(null);


    // New state for equipment overlays
    const [equipmentStats, _setEquipmentStats] = useState<Equipment | null>(null);
    const [itemsOnDeathData, setItemsOnDeathData] = useState<ItemsOnDeathData | null>(null);
    const [priceCheckerInventory, setPriceCheckerInventory] = useState<(InventorySlot | null)[] | null>(null);
    const [isAtlasViewOpen, setIsAtlasViewOpen] = useState<boolean>(false);
    const [isExpandedMapViewOpen, setIsExpandedMapViewOpen] = useState<boolean>(false);
    const [isLootViewOpen, setIsLootViewOpen] = useState<boolean>(false);
    const [isDevPanelOpen, setIsDevPanelOpen] = useState<boolean>(false);
    const [isSettingsViewOpen, setIsSettingsViewOpen] = useState<boolean>(false);
    const [activeMapRegionId, setActiveMapRegionId] = useState<string>('world');
    const [activeBankTabId, setActiveBankTabId] = useState<number>(0);
    const [activeDungeonMap, setActiveDungeonMap] = useState<{ regionId: string; mapTitle: string } | null>(null);

    // New states for Settings
    const [showTooltips, setShowTooltips] = useState<boolean>(true);
    const [showXpDrops, setShowXpDrops] = useState<boolean>(true);
    const [confirmValuableDrops, setConfirmValuableDrops] = useState<boolean>(true);
    const [valuableDropThreshold, setValuableDropThreshold] = useState<number>(1000);
    const [showMinimapHealth, setShowMinimapHealth] = useState<boolean>(false);
    const [showCombatPlayerHealth, setShowCombatPlayerHealth] = useState<boolean>(false);
    const [showCombatEnemyHealth, setShowCombatEnemyHealth] = useState<boolean>(false);
    const [showHitsplats, setShowHitsplats] = useState<boolean>(true);
    const [isOneClickMode, setIsOneClickMode] = useState<boolean>(false);

    const setEquipmentStats = useCallback((equipment: Equipment | null) => {
        _setEquipmentStats(equipment);
        if (equipment) {
            setActivePanel('inventory');
        }
    }, [setActivePanel]);

    // FIX: Define isBusy based on whether any modal or blocking UI is active.
    const isBusy = useMemo(() => !!(
        activeShopId ||
        activeCraftingContext ||
        activeQuestBoardId ||
        activeTeleportBoardId ||
        makeXPrompt ||
        confirmationPrompt ||
        exportData ||
        isImportModalOpen ||
        activeSkillGuide ||
        activeCraftingAction ||
        activeQuestDetail ||
        equipmentStats ||
        itemsOnDeathData ||
        priceCheckerInventory ||
        isAtlasViewOpen ||
        isExpandedMapViewOpen ||
        isLootViewOpen ||
        activeDungeonMap ||
        isDevPanelOpen ||
        isSettingsViewOpen
    ), [
        activeShopId,
        activeCraftingContext,
        activeQuestBoardId,
        activeTeleportBoardId,
        makeXPrompt,
        confirmationPrompt,
        exportData,
        isImportModalOpen,
        activeSkillGuide,
        activeCraftingAction,
        activeQuestDetail,
        equipmentStats,
        itemsOnDeathData,
        priceCheckerInventory,
        isAtlasViewOpen,
        isExpandedMapViewOpen,
        isLootViewOpen,
        activeDungeonMap,
        isDevPanelOpen,
        isSettingsViewOpen
    ]);


    const closeContextMenu = useCallback(() => setContextMenu(null), []);
    const closeMakeXPrompt = useCallback(() => setMakeXPrompt(null), []);
    const closeConfirmationPrompt = useCallback(() => setConfirmationPrompt(null), []);
    const closeExportModal = useCallback(() => setExportData(null), []);
    const closeImportModal = useCallback(() => setIsImportModalOpen(false), []);
    const closeSkillGuide = useCallback(() => setActiveSkillGuide(null), []);
    const openCraftingView = useCallback((context: CraftingContext) => setActiveCraftingContext(context), []);
    const closeCraftingView = useCallback(() => setActiveCraftingContext(null), []);
    
    const closeAllModals = useCallback(() => {
        setCombatQueue([]);
        setIsMandatoryCombat(false);
        setActiveShopId(null);
        setActiveCraftingContext(null);
        setItemToUse(null);
        setSpellToCast(null);
        setMakeXPrompt(null);
        setActiveQuestBoardId(null);
        setActiveTeleportBoardId(null);
        setActiveDialogue(null);
        setConfirmationPrompt(null);
        setExportData(null);
        setIsImportModalOpen(false);
        setActiveSkillGuide(null);
        setActiveCraftingAction(null);
        setActiveQuestDetail(null);
        setEquipmentStats(null);
        setItemsOnDeathData(null);
        setPriceCheckerInventory(null);
        setIsAtlasViewOpen(false);
        setIsExpandedMapViewOpen(false);
        setActiveMapRegionId('world');
        setIsLootViewOpen(false);
        setIsSelectingAutocastSpell(false);
        setManualCastTrigger(null);
        setActiveDungeonMap(null);
        setIsDevPanelOpen(false);
        setIsSettingsViewOpen(false);
    }, []);

    return {
        activePanel, setActivePanel,
        combatQueue, setCombatQueue,
        isMandatoryCombat, setIsMandatoryCombat,
        activeShopId, setActiveShopId,
        activeCraftingContext,
        itemToUse, setItemToUse,
        spellToCast, setSpellToCast,
        activeQuestBoardId, setActiveQuestBoardId,
        activeTeleportBoardId, setActiveTeleportBoardId,
        tooltip, setTooltip,
        contextMenu, setContextMenu,
        makeXPrompt, setMakeXPrompt,
        activeDialogue, setActiveDialogue,
        confirmationPrompt, setConfirmationPrompt,
        exportData, setExportData,
        isImportModalOpen, setIsImportModalOpen,
        activeSkillGuide, setActiveSkillGuide,
        activeCraftingAction, setActiveCraftingAction,
        activeQuestDetail, setActiveQuestDetail,
        equipmentStats, setEquipmentStats,
        itemsOnDeathData, setItemsOnDeathData,
        priceCheckerInventory, setPriceCheckerInventory,
        isAtlasViewOpen, setIsAtlasViewOpen,
        isExpandedMapViewOpen, setIsExpandedMapViewOpen,
        isLootViewOpen, setIsLootViewOpen,
        activeMapRegionId, setActiveMapRegionId,
        isSelectingAutocastSpell, setIsSelectingAutocastSpell,
        manualCastTrigger, setManualCastTrigger,
        isDevPanelOpen, setIsDevPanelOpen,
        activeDungeonMap, setActiveDungeonMap,
        isSettingsViewOpen, setIsSettingsViewOpen,
        activeBankTabId, setActiveBankTabId,
        isBusy,
        showTooltips, setShowTooltips,
        showXpDrops, setShowXpDrops,
        confirmValuableDrops, setConfirmValuableDrops,
        valuableDropThreshold, setValuableDropThreshold,
        showMinimapHealth, setShowMinimapHealth,
        showCombatPlayerHealth, setShowCombatPlayerHealth,
        showCombatEnemyHealth, setShowCombatEnemyHealth,
        showHitsplats, setShowHitsplats,
        isOneClickMode, setIsOneClickMode,
        closeContextMenu,
        closeMakeXPrompt,
        closeConfirmationPrompt,
        closeExportModal,
        closeImportModal,
        closeSkillGuide,
        openCraftingView,
        closeCraftingView,
        closeAllModals,
    };
};
