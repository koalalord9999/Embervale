
import React, { useState } from 'react';
import { useUIState, TooltipState } from '../../hooks/useUIState';
import { useCharacter } from '../../hooks/useCharacter';
import { useInventory } from '../../hooks/useInventory';
import { useQuests } from '../../hooks/useQuests';
import { useRepeatableQuests } from '../../hooks/useRepeatableQuests';
import { useSlayer } from '../../hooks/useSlayer';
import { useItemActions } from '../../hooks/useItemActions';
import { useGameSession } from '../../hooks/useGameSession';

import Minimap from '../game/Minimap';
import CombatStylePanel from '../panels/CombatStylePanel';
import InventoryPanel from '../panels/InventoryPanel';
import EquipmentPanel from '../panels/EquipmentPanel';
import SkillsPanel from '../panels/SkillsPanel';
import QuestsPanel from '../panels/QuestsPanel';
import PrayerPanel from '../panels/PrayerPanel';
import SpellbookPanel from '../panels/SpellbookPanel';
import SettingsPanel from '../panels/SettingsPanel';
import DevPanel from '../panels/DevPanel';
import { ActivePanel, CombatStance, Spell, InventorySlot, SkillName, Item, Equipment } from '../../types';

interface SidePanelProps {
    ui: ReturnType<typeof useUIState>;
    initialState: any;
    char: ReturnType<typeof useCharacter>;
    inv: ReturnType<typeof useInventory>;
    quests: ReturnType<typeof useQuests>;
    repeatableQuests: ReturnType<typeof useRepeatableQuests>;
    slayer: ReturnType<typeof useSlayer>;
    onReturnToMenu: () => void;
    isDevMode: boolean;
    isTouchSimulationEnabled: boolean;
    onToggleTouchSimulation: () => void;
    itemActions: ReturnType<typeof useItemActions>;
    isBusy: boolean;
    handleExamine: (item: Item) => void;
    session: ReturnType<typeof useGameSession>;
    addLog: (message: string) => void;
    activeCombatStyleHighlight?: CombatStance | null;
    onNavigate: (poiId: string) => void;
    unlockedPois: string[];
    isBankOpen: boolean;
    isShopOpen: boolean;
    onDeposit: (inventoryIndex: number, quantity: number | 'all') => void;
    onCastSpell: (spell: Spell) => void;
    onSpellOnItem: (spell: Spell, target: { item: InventorySlot, index: number }) => void;
    isEquipmentStatsOpen?: boolean;
    activePrayers: string[];
    onTogglePrayer: (prayerId: string) => void;
    isPoisoned: boolean;
    onCurePoison: () => void;
    poisonEvent: { damage: number, timestamp: number } | null;
    onToggleDevPanel: () => void;
    // New Props
    isPermAggroOn?: boolean;
    onTogglePermAggro?: () => void;
    isGodModeOn?: boolean;
    onToggleGodMode?: () => void;
    isOneClickMode?: boolean;
}

const PanelIcon: React.FC<{
    icon: string;
    label: React.ReactNode;
    ariaLabel: string;
    isActive: boolean;
    onClick: (e: React.MouseEvent) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    tutorialId?: string;
    onContextMenu?: (e: React.MouseEvent) => void;
}> = ({ icon, label, ariaLabel, isActive, onClick, setTooltip, tutorialId, onContextMenu }) => {

    const handleMouseEnter = (e: React.MouseEvent) => {
        setTooltip({
            content: label,
            position: { x: e.clientX, y: e.clientY }
        });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };
    
    const handleClick = (e: React.MouseEvent) => {
        setTooltip(null);
        onClick(e);
    };

    return (
        <button 
            data-tutorial-id={tutorialId}
            onClick={handleClick} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onContextMenu={onContextMenu}
            className={`p-2 rounded-md transition-colors ${isActive ? 'bg-yellow-700' : 'bg-gray-800 hover:bg-gray-700'}`}
            aria-label={ariaLabel}
        >
            <img src={`https://api.iconify.design/game-icons:${icon}.svg`} alt={ariaLabel} className="w-6 h-6 filter invert" />
        </button>
    );
};

const PlaceholderIcon: React.FC = () => (
    <button
        disabled
        className="p-2 rounded-md bg-gray-800 opacity-50 cursor-not-allowed"
        aria-label="Coming Soon"
    >
        <img src={`https://api.iconify.design/game-icons:help.svg`} alt="Coming Soon" className="w-6 h-6 filter invert" />
    </button>
);


const SidePanel: React.FC<SidePanelProps> = (props) => {
    const { ui, char, inv, quests, repeatableQuests, slayer, onReturnToMenu, isDevMode, isTouchSimulationEnabled, onToggleTouchSimulation, itemActions, isBusy, handleExamine, session, addLog, activeCombatStyleHighlight, isBankOpen, isShopOpen, onDeposit, onNavigate, unlockedPois, onCastSpell, onSpellOnItem, isEquipmentStatsOpen = false, initialState, activePrayers, onTogglePrayer, isPoisoned, onCurePoison, poisonEvent, onToggleDevPanel, isPermAggroOn, onTogglePermAggro, isGodModeOn, onToggleGodMode } = props;
    const { activePanel, setActivePanel } = ui;

    const inventoryPanelProps = {
        inventory: inv.inventory, coins: inv.coins, skills: char.skills, onEquip:(item, idx) => inv.handleEquip(item, idx, char.skills, char.combatStance), onConsume: itemActions.handleConsume, onDropItem: inv.handleDropItem, onBury: itemActions.handleBuryBones, onEmpty: itemActions.handleEmptyItem, setTooltip: ui.setTooltip, setContextMenu: ui.setContextMenu, addLog, itemToUse: ui.itemToUse, setItemToUse: ui.setItemToUse, 
        onUseItemOn: itemActions.handleUseItemOn, isBusy, onMoveItem: inv.moveItem, setConfirmationPrompt: ui.setConfirmationPrompt,
        onExamine: handleExamine, isTouchSimulationEnabled,
        onDivine: itemActions.handleDivine,
        onReadMap: itemActions.handleReadMap,
        setMakeXPrompt: ui.setMakeXPrompt,
        isBankOpen,
        onDeposit,
        isShopOpen,
        onSell: inv.handleSell,
        spellToCast: ui.spellToCast,
        onSpellOnItem: onSpellOnItem,
        isEquipmentStatsOpen,
        confirmValuableDrops: ui.confirmValuableDrops,
        valuableDropThreshold: ui.valuableDropThreshold,
        isOneClickMode: ui.isOneClickMode,
        onTeleport: itemActions.handleTeleport,
        ui: ui,
    };

    const renderActivePanel = () => {
        switch(activePanel) {
            case 'combat':
                return <CombatStylePanel combatStance={char.combatStance} setCombatStance={char.setCombatStance} equipment={inv.equipment} combatLevel={char.combatLevel} activeCombatStyleHighlight={activeCombatStyleHighlight} ui={ui} />;
            case 'inventory':
                 return <InventoryPanel {...inventoryPanelProps} />;
            case 'equipment':
                return <EquipmentPanel 
                    equipment={inv.equipment} 
                    onUnequip={(slot) => inv.handleUnequip(slot)} 
                    setTooltip={ui.setTooltip} 
                    ui={ui} 
                    inventory={inv.inventory} 
                    coins={inv.coins}
                    addLog={addLog}
                    onExamine={handleExamine}
                    isTouchSimulationEnabled={isTouchSimulationEnabled}
                    isOneClickMode={ui.isOneClickMode}
                    onTeleport={itemActions.handleTeleport}
                />;
            case 'skills':
                return <SkillsPanel skills={char.skills} setTooltip={ui.setTooltip} setContextMenu={ui.setContextMenu} onOpenGuide={ui.setActiveSkillGuide} isTouchSimulationEnabled={isTouchSimulationEnabled} isOneClickMode={ui.isOneClickMode} />;
            case 'quests':
                 return <QuestsPanel playerQuests={quests.playerQuests} activeRepeatableQuest={repeatableQuests.activePlayerQuest} inventory={inv.inventory} slayerTask={slayer.slayerTask} onSelectQuest={(questId) => ui.setActiveQuestDetail({ questId: questId, playerQuests: quests.playerQuests })} />;
            case 'prayer':
                return <PrayerPanel skills={char.skills} activePrayers={activePrayers} onTogglePrayer={onTogglePrayer} setTooltip={ui.setTooltip} playerQuests={quests.playerQuests} />;
            case 'spellbook':
                return <SpellbookPanel
                    skills={char.skills}
                    inventory={inv.inventory}
                    equipment={inv.equipment}
                    onCastSpell={onCastSpell}
                    setTooltip={ui.setTooltip}
                    autocastSpell={char.autocastSpell}
                    ui={ui}
                />;
            case 'settings':
                return null;
            default:
                return <InventoryPanel {...inventoryPanelProps} />; // Default to inventory
        }
    };
    
    return (
        <div className="bg-black/70 border-2 border-gray-600 rounded-lg flex flex-col h-full">
            <div className="flex-shrink-0">
                <Minimap 
                    currentPoiId={session.currentPoiId} 
                    currentHp={char.currentHp}
                    maxHp={char.maxHp}
                    currentPrayer={char.currentPrayer}
                    maxPrayer={char.maxPrayer}
                    ui={ui}
                    isTouchSimulationEnabled={isTouchSimulationEnabled}
                    onNavigate={onNavigate}
                    unlockedPois={unlockedPois}
                    addLog={addLog}
                    isDevMode={isDevMode}
                    onToggleDevPanel={onToggleDevPanel}
                    showMinimapHealth={ui.showMinimapHealth}
                    isPoisoned={isPoisoned}
                    onCurePoison={onCurePoison}
                    isInCombat={ui.combatQueue.length > 0}
                    poisonEvent={poisonEvent}
                    isPermAggroOn={isPermAggroOn}
                    onTogglePermAggro={onTogglePermAggro}
                    isGodModeOn={isGodModeOn}
                    onToggleGodMode={onToggleGodMode}
                />
                {/* Top row */}
                <div className="grid grid-cols-7 gap-1 p-1 bg-black/30 border-b-2 border-gray-600">
                    <PanelIcon setTooltip={ui.setTooltip} tutorialId="side-panel-button-combat" icon="swords-emblem" label="Combat Styles" ariaLabel="Combat Styles" isActive={activePanel==='combat'} onClick={() => setActivePanel('combat')} />
                    <PanelIcon setTooltip={ui.setTooltip} tutorialId="side-panel-button-skills" icon="podium" label="Skills" ariaLabel="Skills" isActive={activePanel==='skills'} onClick={() => setActivePanel('skills')} />
                    <PanelIcon setTooltip={ui.setTooltip} tutorialId="side-panel-button-quests" icon="eclipse-flare" label="Quest Journal" ariaLabel="Quest Journal" isActive={activePanel==='quests'} onClick={() => setActivePanel('quests')} />
                    <PanelIcon setTooltip={ui.setTooltip} tutorialId="side-panel-button-inventory" icon="knapsack" label="Inventory" ariaLabel="Inventory" isActive={activePanel==='inventory'} onClick={() => setActivePanel('inventory')} />
                    <PanelIcon setTooltip={ui.setTooltip} tutorialId="side-panel-button-equipment" icon="battle-gear" label="Equipment" ariaLabel="Equipment" isActive={activePanel==='equipment'} onClick={() => setActivePanel('equipment')} />
                    <PanelIcon setTooltip={ui.setTooltip} tutorialId="side-panel-button-prayer" icon="polar-star" label="Prayer" ariaLabel="Prayer" isActive={activePanel==='prayer'} onClick={() => setActivePanel('prayer')} />
                    <PanelIcon setTooltip={ui.setTooltip} tutorialId="side-panel-button-spellbook" icon="book-cover" label="Spellbook" ariaLabel="Spellbook" isActive={activePanel==='spellbook'} onClick={() => setActivePanel('spellbook')} />
                </div>
            </div>
            <div className="flex-grow min-h-0 p-2 overflow-y-auto">
                {renderActivePanel()}
            </div>
            <div className="flex-shrink-0">
                {/* Bottom row */}
                <div className="grid grid-cols-7 gap-1 p-1 bg-black/30 border-t-2 border-gray-600">
                    <PlaceholderIcon />
                    <PlaceholderIcon />
                    <PlaceholderIcon />
                    <PanelIcon setTooltip={ui.setTooltip} icon="exit-door" label="Logout" ariaLabel="Logout" isActive={false} onClick={onReturnToMenu} />
                    <PlaceholderIcon />
                    <PlaceholderIcon />
                    <PanelIcon setTooltip={ui.setTooltip} tutorialId="side-panel-button-settings" icon="gears" label="Settings" ariaLabel="Settings" isActive={ui.isSettingsViewOpen} onClick={() => ui.setIsSettingsViewOpen(true)} />
                </div>
            </div>
        </div>
    );
};

export default SidePanel;
