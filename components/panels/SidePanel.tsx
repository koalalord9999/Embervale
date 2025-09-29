
import React, { useState } from 'react';
import { useUIState } from '../../hooks/useUIState';
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
import SpellbookPanel from '../panels/SpellbookPanel';
import SettingsPanel from '../panels/SettingsPanel';
import DevPanel from '../panels/DevPanel';
import { ActivePanel, CombatStance, Spell, InventorySlot, SkillName } from '../../types';

interface SidePanelProps {
    ui: ReturnType<typeof useUIState>;
    initialState: any;
    char: ReturnType<typeof useCharacter>;
    inv: ReturnType<typeof useInventory>;
    quests: ReturnType<typeof useQuests>;
    repeatableQuests: ReturnType<typeof useRepeatableQuests>;
    slayer: ReturnType<typeof useSlayer>;
    onExportGame: () => void;
    onImportGame: () => void;
    onResetGame: () => void;
    isDevMode: boolean;
    isTouchSimulationEnabled: boolean;
    onToggleTouchSimulation: () => void;
    itemActions: ReturnType<typeof useItemActions>;
    isBusy: boolean;
    handleExamine: (item: any) => void;
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
}

const PanelIcon: React.FC<{ icon: string, label: string, isActive: boolean, onClick: () => void, tutorialId?: string }> = ({ icon, label, isActive, onClick, tutorialId }) => (
    <button 
        data-tutorial-id={tutorialId}
        onClick={onClick} 
        className={`p-2 rounded-md transition-colors ${isActive ? 'bg-yellow-700' : 'bg-gray-800 hover:bg-gray-700'}`}
        aria-label={label}
        data-tooltip-content={label}
    >
        <img src={`https://api.iconify.design/game-icons:${icon}.svg`} alt={label} className="w-6 h-6 filter invert" />
    </button>
);

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
    const { ui, char, inv, quests, repeatableQuests, slayer, onExportGame, onImportGame, onResetGame, isDevMode, isTouchSimulationEnabled, onToggleTouchSimulation, itemActions, isBusy, handleExamine, session, addLog, activeCombatStyleHighlight, isBankOpen, isShopOpen, onDeposit, onNavigate, unlockedPois, onCastSpell, onSpellOnItem, isEquipmentStatsOpen = false } = props;
    const { activePanel, setActivePanel } = ui;
    
    const inventoryPanelProps = {
        inventory: inv.inventory, coins: inv.coins, skills: char.skills, onEquip:(item, idx) => inv.handleEquip(item, idx, char.skills, char.combatStance), onConsume: itemActions.handleConsume, onDropItem: inv.handleDropItem, onBury: itemActions.handleBuryBones, onEmpty: itemActions.handleEmptyItem, setTooltip: ui.setTooltip, setContextMenu: ui.setContextMenu, addLog, itemToUse: ui.itemToUse, setItemToUse: ui.setItemToUse, 
        onUseItemOn: itemActions.handleUseItemOn, isBusy, onMoveItem: inv.moveItem, setConfirmationPrompt: ui.setConfirmationPrompt,
        onExamine: handleExamine, isTouchSimulationEnabled,
        onDivine: itemActions.handleDivine,
        setMakeXPrompt: ui.setMakeXPrompt,
        isBankOpen,
        onDeposit,
        isShopOpen,
        onSell: inv.handleSell,
        spellToCast: ui.spellToCast,
        onSpellOnItem: onSpellOnItem,
        isEquipmentStatsOpen,
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
                    addLog={addLog}
                    onExamine={handleExamine}
                    isTouchSimulationEnabled={isTouchSimulationEnabled}
                />;
            case 'skills':
                return <SkillsPanel skills={char.skills} setTooltip={ui.setTooltip} onOpenGuide={ui.setActiveSkillGuide} />;
            case 'quests':
                 return <QuestsPanel playerQuests={quests.playerQuests} activeRepeatableQuest={repeatableQuests.activePlayerQuest} inventory={inv.inventory} slayerTask={slayer.slayerTask} onSelectQuest={(questId) => ui.setActiveQuestDetail({ questId: questId, playerQuests: quests.playerQuests })} />;
            case 'prayer':
                return <div className="text-center text-gray-400">Prayer skill coming soon!</div>;
            case 'spellbook':
                return <SpellbookPanel skills={char.skills} inventory={inv.inventory} onCastSpell={onCastSpell} setTooltip={ui.setTooltip} autocastSpell={char.autocastSpell} ui={ui} />;
            case 'settings':
                return <SettingsPanel onResetGame={onResetGame} onExportGame={onExportGame} onImportGame={onImportGame} isDevMode={isDevMode} onToggleDevPanel={() => ui.setIsDevPanelOpen(true)} isTouchSimulationEnabled={isTouchSimulationEnabled} onToggleTouchSimulation={onToggleTouchSimulation} />;
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
                    ui={ui}
                    isTouchSimulationEnabled={isTouchSimulationEnabled}
                    onNavigate={onNavigate}
                    unlockedPois={unlockedPois}
                    addLog={addLog}
                />
                {/* Top row */}
                <div className="grid grid-cols-7 gap-1 p-1 bg-black/30 border-b-2 border-gray-600">
                    <PanelIcon tutorialId="side-panel-button-combat" icon="swords-emblem" label="Combat Styles" isActive={activePanel==='combat'} onClick={() => setActivePanel('combat')} />
                    <PanelIcon tutorialId="side-panel-button-skills" icon="podium" label="Skills" isActive={activePanel==='skills'} onClick={() => setActivePanel('skills')} />
                    <PanelIcon tutorialId="side-panel-button-quests" icon="eclipse-flare" label="Quests" isActive={activePanel==='quests'} onClick={() => setActivePanel('quests')} />
                    <PanelIcon tutorialId="side-panel-button-inventory" icon="knapsack" label="Inventory" isActive={activePanel==='inventory'} onClick={() => setActivePanel('inventory')} />
                    <PanelIcon tutorialId="side-panel-button-equipment" icon="battle-gear" label="Equipment" isActive={activePanel==='equipment'} onClick={() => setActivePanel('equipment')} />
                    <PanelIcon tutorialId="side-panel-button-prayer" icon="polar-star" label="Prayer" isActive={activePanel==='prayer'} onClick={() => { setActivePanel('prayer'); addLog("Prayer skill is not yet implemented."); }} />
                    <PanelIcon tutorialId="side-panel-button-spellbook" icon="book-cover" label="Spellbook" isActive={activePanel==='spellbook'} onClick={() => setActivePanel('spellbook')} />
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
                    <PlaceholderIcon />
                    <PlaceholderIcon />
                    <PlaceholderIcon />
                    <PanelIcon tutorialId="side-panel-button-settings" icon="gears" label="Settings" isActive={activePanel==='settings'} onClick={() => setActivePanel('settings')} />
                </div>
            </div>
        </div>
    );
};

export default SidePanel;
