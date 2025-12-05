
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useUIState } from './../hooks/useUIState';
import { useSaveGame } from './../hooks/useSaveGame';
import { useActivityLog } from './../hooks/useActivityLog';
import GameCanvas from './GameCanvas';
import { WorldEntity } from './worldData';
import { meadowdaleGrid, meadowdaleEntities } from './world/meadowdale';
import { PlayerSkill, SkillName, Equipment, InventorySlot, ActivePanel, BankTab, POIActivity, Item } from './../types';
import PrototypeMinimap from './PrototypeMinimap';
import { ITEMS } from './../constants';
import InventoryPanel from './../components/panels/InventoryPanel';
import EquipmentPanel from './../components/panels/EquipmentPanel';
import SkillsPanel from './../components/panels/SkillsPanel';
import QuestsPanel from './../components/panels/QuestsPanel';
import CombatStylePanel from './../components/panels/CombatStylePanel';
import PrayerPanel from './../components/panels/PrayerPanel';
import SpellbookPanel from './../components/panels/SpellbookPanel';
import PrototypeUILayout from './PrototypeUILayout';
import PrototypeActivityLog from './PrototypeActivityLog';

// Import New Hooks
import { usePrototypeCharacter } from './hooks/usePrototypeCharacter';
import { usePrototypeInventory } from './hooks/usePrototypeInventory';
import { usePrototypeModels } from './hooks/usePrototypeModels';
import { usePrototypeCombat } from './hooks/usePrototypeCombat';
import { usePrototypeWorld } from './hooks/usePrototypeWorld';

interface GameCanvasHandles {
    startInteraction: (action: any) => void;
    startMonsterPath: (monsterId: string, targetPos: { x: number, y: number }) => void;
}

const PanelIcon: React.FC<{ icon: string; panel: ActivePanel; activePanel: ActivePanel | null; onClick: (panel: ActivePanel) => void; tutorialId: string }> = ({ icon, panel, activePanel, onClick, tutorialId }) => (
    <button data-tutorial-id={tutorialId} onClick={() => onClick(panel)} className={`p-2 rounded-md transition-colors ${activePanel === panel ? 'bg-yellow-700' : 'bg-gray-800 hover:bg-gray-700'}`}>
        <img src={`https://api.iconify.design/game-icons:${icon}.svg`} alt={`${panel} panel`} className="w-6 h-6 filter invert" />
    </button>
);

interface TechDemoGameProps {
    initialState: any;
    slotId: number;
    onReturnToMenu: (currentState: any) => void;
    ui: ReturnType<typeof useUIState>;
}

const TechDemoGame: React.FC<TechDemoGameProps> = ({ initialState, slotId, onReturnToMenu, ui }) => {
    const { activityLog, addLog } = useActivityLog(initialState.activityLog || []);
    
    const { playerRef, humanoidsRef } = usePrototypeModels();
    const { skills, playerHp, setPlayerHp, playerMaxHp, addXp } = usePrototypeCharacter(initialState.skills, initialState.currentHp, addLog);
    
    const { groundItems, monsterRespawnTimers, handlePickUpItem, onItemDropped, setGroundItems, setMonsterRespawnTimers } = usePrototypeWorld({
        initialGroundItems: initialState.groundItems || {},
        initialMonsterRespawnTimers: initialState.monsterRespawnTimers || {},
        humanoidsRef,
        modifyItem: (itemId, qty, quiet, overrides) => inv.modifyItem(itemId, qty, quiet, overrides),
    });

    const combat = usePrototypeCombat({
        playerHp, playerMaxHp, setPlayerHp, skills,
        equipment: initialState.equipment,
        combatStance: initialState.combatStance,
        addLog, addXp, playerRef, humanoidsRef, setGroundItems, setMonsterRespawnTimers,
        onCombatEnd: () => {}
    });
    
    const inv = usePrototypeInventory({
        initialInventory: initialState.inventory || [],
        initialCoins: initialState.coins || 1000,
        initialEquipment: initialState.equipment || { weapon: { itemId: 'steel_sword', quantity: 1 }, shield: { itemId: 'steel_kiteshield', quantity: 1 }, head: { itemId: 'steel_full_helm', quantity: 1 }, body: { itemId: 'steel_platebody', quantity: 1 }, legs: { itemId: 'steel_platelegs', quantity: 1 }, ammo: null, gloves: null, boots: null, cape: null, necklace: null, ring: null },
        addLog,
        onItemDropped: (item) => onItemDropped(item, playerRef.current.gridX, playerRef.current.gridY),
    });

    const [quests, setQuests] = useState([]);
    const [slayerTask, setSlayerTask] = useState(null);
    const [prayer, setPrayer] = useState(50);
    const [maxPrayer, setMaxPrayer] = useState(50);
    const [combatStance, setCombatStance] = useState<any>('Accurate');
    const [playerPosition, setPlayerPosition] = useState({ x: 19, y: 38 });
    const gameCanvasRef = useRef<GameCanvasHandles>(null);
    
    const gameState = useMemo(() => ({
        ...initialState, activityLog, groundItems, monsterRespawnTimers,
        inventory: inv.inventory, coins: inv.coins, equipment: inv.equipment,
        skills: skills.map(({ currentLevel, ...rest }) => rest), currentHp: playerHp,
    }), [initialState, activityLog, groundItems, monsterRespawnTimers, inv, skills, playerHp]);

    useSaveGame(gameState, slotId);

    const handlePlayerDisengage = useCallback(() => {
        if (combat.activeCombat) {
            const monsterModel = humanoidsRef.current.find(h => h.id === combat.activeCombat!.entity.id);
            if (monsterModel) monsterModel.aggroTimeout = Date.now() + 10000;
        }
        combat.setActiveCombat(null);
    }, [combat, humanoidsRef]);

    const inventoryPanelProps = {
        inventory: inv.inventory, coins: inv.coins, skills, 
        onEquip:(item: InventorySlot, idx: number) => inv.handleEquip(item, idx, skills, combatStance),
        onConsume: (itemId: string, index: number) => addLog(`Consumed ${ITEMS[itemId].name}. (Functionality limited)`), 
        onDropItem: inv.handleDropItem,
        onBury: () => {}, onEmpty: () => {}, onDivine: () => {},
        setTooltip: ui.setTooltip, setContextMenu: ui.setContextMenu, addLog, itemToUse: ui.itemToUse, setItemToUse: ui.setItemToUse,
        onUseItemOn: () => {}, isBusy: !!combat.activeCombat, onMoveItem: () => {}, setConfirmationPrompt: ui.setConfirmationPrompt,
        setMakeXPrompt: ui.setMakeXPrompt,
        onExamine: (item: Item) => addLog(item.description), isTouchSimulationEnabled: false,
        onReadMap: () => {}, spellToCast: ui.spellToCast, onSpellOnItem: () => {},
        confirmValuableDrops: true, valuableDropThreshold: 1000, isOneClickMode: false,
        onTeleport: () => {}, ui: ui,
    };

    const handlePanelClick = (panel: ActivePanel) => {
        ui.setActivePanel(p => p === panel ? null : panel);
    };
    
    const renderActivePanel = () => {
        switch (ui.activePanel) {
            case 'inventory': return <InventoryPanel {...inventoryPanelProps} />;
            case 'equipment': return <EquipmentPanel equipment={inv.equipment} onUnequip={(slot: keyof Equipment) => inv.handleUnequip(slot)} setTooltip={ui.setTooltip} ui={ui} inventory={inv.inventory} coins={inv.coins} addLog={addLog} onExamine={(item: Item) => addLog(item.description)} isTouchSimulationEnabled={false} isOneClickMode={ui.isOneClickMode} onTeleport={() => {}} />;
            case 'skills': return <SkillsPanel skills={skills} setTooltip={ui.setTooltip} onOpenGuide={(skill) => addLog(`Open guide for ${skill}. (Disabled)`)} isTouchSimulationEnabled={false} isOneClickMode={ui.isOneClickMode} setContextMenu={ui.setContextMenu} />;
            case 'quests': return <QuestsPanel playerQuests={quests} activeRepeatableQuest={null} inventory={inv.inventory} slayerTask={slayerTask} onSelectQuest={(id) => addLog(`Select quest ${id}. (Disabled)`)} />;
            case 'combat': return <CombatStylePanel combatStance={combatStance} setCombatStance={setCombatStance} equipment={inv.equipment} combatLevel={50} ui={ui} />;
            case 'prayer': return <PrayerPanel skills={skills} activePrayers={[]} onTogglePrayer={() => {}} setTooltip={ui.setTooltip} playerQuests={[]} />;
            case 'spellbook': return <SpellbookPanel skills={skills} inventory={inv.inventory} equipment={inv.equipment} onCastSpell={() => {}} setTooltip={ui.setTooltip} autocastSpell={null} ui={ui} />;
            default: return null;
        }
    };
    
    const gameCanvasComponent = (
        <GameCanvas 
            ref={gameCanvasRef}
            playerRef={playerRef}
            addLog={addLog} 
            onInteract={(entity) => entity.monsterId ? combat.handleCombat(entity) : addLog(`Interacted with ${entity.name}.`)} 
            onCombat={combat.handleCombat} 
            combatState={combat.activeCombat}
            worldGrid={meadowdaleGrid}
            entities={meadowdaleEntities}
            hitsplats={combat.hitsplats}
            onRemoveHitsplat={combat.onRemoveHitsplat}
            groundItems={groundItems}
            setContextMenu={ui.setContextMenu}
            onPickpocket={() => {}}
            monsterRespawnTimers={monsterRespawnTimers}
            onPickUpItem={handlePickUpItem}
            onPlayerMove={setPlayerPosition}
            equipment={inv.equipment}
            humanoidsRef={humanoidsRef}
            onDisengage={handlePlayerDisengage}
            runCombatTick={combat.runCombatTick}
            playerHp={playerHp}
            playerMaxHp={playerMaxHp}
        />
    );

    const minimapComponent = <PrototypeMinimap currentHp={playerHp} maxHp={playerMaxHp} currentPrayer={prayer} maxPrayer={maxPrayer} ui={ui} playerX={playerPosition.x} playerY={playerPosition.y} entities={meadowdaleEntities} worldGrid={meadowdaleGrid} />;
    
    const activityLogComponent = <PrototypeActivityLog logs={activityLog} isDialogueActive={false}/>;
    const panelButtonsComponent = (
        <>
            <PanelIcon icon="swords-emblem" panel="combat" activePanel={ui.activePanel} onClick={handlePanelClick} tutorialId="side-panel-button-combat" />
            <PanelIcon icon="podium" panel="skills" activePanel={ui.activePanel} onClick={handlePanelClick} tutorialId="side-panel-button-skills" />
            <PanelIcon icon="eclipse-flare" panel="quests" activePanel={ui.activePanel} onClick={handlePanelClick} tutorialId="side-panel-button-quests" />
            <PanelIcon icon="knapsack" panel="inventory" activePanel={ui.activePanel} onClick={handlePanelClick} tutorialId="side-panel-button-inventory" />
            <PanelIcon icon="battle-gear" panel="equipment" activePanel={ui.activePanel} onClick={handlePanelClick} tutorialId="side-panel-button-equipment" />
            <PanelIcon icon="polar-star" panel="prayer" activePanel={ui.activePanel} onClick={handlePanelClick} tutorialId="side-panel-button-prayer" />
            <PanelIcon icon="book-cover" panel="spellbook" activePanel={ui.activePanel} onClick={handlePanelClick} tutorialId="side-panel-button-spellbook" />
            <PanelIcon icon="exit-door" panel={null} activePanel={ui.activePanel} onClick={() => onReturnToMenu(gameState)} tutorialId="side-panel-button-logout" />
        </>
    );

    return (
        <PrototypeUILayout minimap={minimapComponent} combatView={null} activityLog={activityLogComponent} panelButtons={panelButtonsComponent} activePanelContent={renderActivePanel()} isPanelOpen={!!ui.activePanel}>
            {gameCanvasComponent}
        </PrototypeUILayout>
    );
};

export default TechDemoGame;
