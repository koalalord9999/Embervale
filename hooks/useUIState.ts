import React, { useState, useCallback } from 'react';
import { ActivePanel, SkillName, InventorySlot, ActiveCraftingAction, DialogueNode, CraftingContext, Equipment, PlayerQuestState, Spell } from '../types';
import { ContextMenuOption } from '../components/common/ContextMenu';

export interface DialogueState {
    npcName: string;
    npcIcon: string;
    nodes: Record<string, DialogueNode>;
    currentNodeKey: string;
    onEnd: () => void;
    onAction: (action: any) => void;
    onNavigate?: (nextNodeKey: string) => void;
}

export interface TooltipState {
    content: React.ReactNode;
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
    const [exportData, setExportData] = useState<string | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [activeSkillGuide, setActiveSkillGuide] = useState<SkillName | null>(null);
    const [activeCraftingAction, setActiveCraftingAction] = useState<ActiveCraftingAction | null>(null);
    const [activeQuestDetail, setActiveQuestDetail] = useState<QuestDetailState | null>(null);

    // New state for equipment overlays
    const [equipmentStats, setEquipmentStats] = useState<Equipment | null>(null);
    const [isItemsOnDeathOpen, setIsItemsOnDeathOpen] = useState<boolean>(false);
    const [priceCheckerInventory, setPriceCheckerInventory] = useState<(InventorySlot | null)[] | null>(null);
    const [isAtlasViewOpen, setIsAtlasViewOpen] = useState<boolean>(false);
    const [isExpandedMapViewOpen, setIsExpandedMapViewOpen] = useState<boolean>(false);
    const [isLootViewOpen, setIsLootViewOpen] = useState<boolean>(false);


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
        setIsItemsOnDeathOpen(false);
        setPriceCheckerInventory(null);
        setIsAtlasViewOpen(false);
        setIsExpandedMapViewOpen(false);
        setIsLootViewOpen(false);
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
        isItemsOnDeathOpen, setIsItemsOnDeathOpen,
        priceCheckerInventory, setPriceCheckerInventory,
        isAtlasViewOpen, setIsAtlasViewOpen,
        isExpandedMapViewOpen, setIsExpandedMapViewOpen,
        isLootViewOpen, setIsLootViewOpen,
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