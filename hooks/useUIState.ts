import React, { useState, useCallback } from 'react';
import { ActivePanel, SkillName, InventorySlot, ActiveCraftingAction, DialogueNode, CraftingContext, Equipment } from '../types';
import { ContextMenuOption } from '../components/common/ContextMenu';

export interface TooltipState {
    content: React.ReactNode;
    position: { x: number; y: number; };
}

export interface ContextMenuState {
    options: ContextMenuOption[];
    position: { x: number; y: number; };
}

export interface MakeXPrompt {
    title: string;
    max: number;
    onConfirm: (quantity: number) => void;
}

export interface NpcDialogueState {
    name: string;
    icon: string;
    dialogue: string[];
}

export interface QuestDialogueState {
    questId: string;
    startNode?: string;
}

export interface InteractiveDialogueState {
    dialogue: Record<string, DialogueNode>;
    startNode: string;
}

export interface ConfirmationPrompt {
    message: string;
    onConfirm: () => void;
}

export const useUIState = () => {
    const [activePanel, setActivePanel] = useState<ActivePanel>('inventory');
    const [combatQueue, setCombatQueue] = useState<string[]>([]);
    const [isMandatoryCombat, setIsMandatoryCombat] = useState<boolean>(false);
    const [activeShopId, setActiveShopId] = useState<string | null>(null);
    const [activeCraftingContext, setActiveCraftingContext] = useState<CraftingContext | null>(null);
    const [itemToUse, setItemToUse] = useState<{ item: InventorySlot, index: number } | null>(null);
    const [activeQuestBoardId, setActiveQuestBoardId] = useState<string | null>(null);
    const [activeTeleportBoardId, setActiveTeleportBoardId] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const [makeXPrompt, setMakeXPrompt] = useState<MakeXPrompt | null>(null);
    const [activeQuestDialogue, setActiveQuestDialogue] = useState<QuestDialogueState | null>(null);
    const [activeInteractiveDialogue, setActiveInteractiveDialogue] = useState<InteractiveDialogueState | null>(null);
    const [activeNpcDialogue, setActiveNpcDialogue] = useState<NpcDialogueState | null>(null);
    const [confirmationPrompt, setConfirmationPrompt] = useState<ConfirmationPrompt | null>(null);
    const [exportData, setExportData] = useState<string | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [activeSkillGuide, setActiveSkillGuide] = useState<SkillName | null>(null);
    const [activeCraftingAction, setActiveCraftingAction] = useState<ActiveCraftingAction | null>(null);
    const [activeQuestDetailId, setActiveQuestDetailId] = useState<string | null>(null);

    // New state for equipment overlays
    const [equipmentStats, setEquipmentStats] = useState<Equipment | null>(null);
    const [isItemsOnDeathOpen, setIsItemsOnDeathOpen] = useState<boolean>(false);
    const [isPriceCheckerOpen, setIsPriceCheckerOpen] = useState<boolean>(false);
    const [isAtlasViewOpen, setIsAtlasViewOpen] = useState<boolean>(false);
    const [isExpandedMapViewOpen, setIsExpandedMapViewOpen] = useState<boolean>(false);


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
        setMakeXPrompt(null);
        setActiveQuestBoardId(null);
        setActiveTeleportBoardId(null);
        setActiveQuestDialogue(null);
        setActiveInteractiveDialogue(null);
        setActiveNpcDialogue(null);
        setConfirmationPrompt(null);
        setExportData(null);
        setIsImportModalOpen(false);
        setActiveSkillGuide(null);
        setActiveCraftingAction(null);
        setActiveQuestDetailId(null);
        setEquipmentStats(null);
        setIsItemsOnDeathOpen(false);
        setIsPriceCheckerOpen(false);
        setIsAtlasViewOpen(false);
        setIsExpandedMapViewOpen(false);
    }, []);

    return {
        activePanel, setActivePanel,
        combatQueue, setCombatQueue,
        isMandatoryCombat, setIsMandatoryCombat,
        activeShopId, setActiveShopId,
        activeCraftingContext,
        itemToUse, setItemToUse,
        activeQuestBoardId, setActiveQuestBoardId,
        activeTeleportBoardId, setActiveTeleportBoardId,
        tooltip, setTooltip,
        contextMenu, setContextMenu,
        makeXPrompt, setMakeXPrompt,
        activeQuestDialogue, setActiveQuestDialogue,
        activeInteractiveDialogue, setActiveInteractiveDialogue,
        activeNpcDialogue, setActiveNpcDialogue,
        confirmationPrompt, setConfirmationPrompt,
        exportData, setExportData,
        isImportModalOpen, setIsImportModalOpen,
        activeSkillGuide, setActiveSkillGuide,
        activeCraftingAction, setActiveCraftingAction,
        activeQuestDetailId, setActiveQuestDetailId,
        equipmentStats, setEquipmentStats,
        isItemsOnDeathOpen, setIsItemsOnDeathOpen,
        isPriceCheckerOpen, setIsPriceCheckerOpen,
        isAtlasViewOpen, setIsAtlasViewOpen,
        isExpandedMapViewOpen, setIsExpandedMapViewOpen,
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
