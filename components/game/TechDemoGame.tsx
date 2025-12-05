import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useUIState } from '../../hooks/useUIState';
import { useCharacter } from '../../hooks/useCharacter';
import { useInventory } from '../../hooks/useInventory';
import { useGameSession } from '../../hooks/useGameSession';
import { useActivityLog } from '../../hooks/useActivityLog';
import { PlayerType, Spell, CombatStance } from '../../types';
import { useSaveGame } from '../../hooks/useSaveGame';
import GameCanvas, { CanvasCombatState } from '../canvas/GameCanvas';
import ActivityLog from './ActivityLog';
import InventoryPanel from '../panels/InventoryPanel';
import SkillsPanel from '../panels/SkillsPanel';
import EquipmentPanel from '../panels/EquipmentPanel';
import CombatStylePanel from '../panels/CombatStylePanel';
import QuestsPanel from '../panels/QuestsPanel';
import PrayerPanel from '../panels/PrayerPanel';
import SpellbookPanel from '../panels/SpellbookPanel';
import QuestDetailView from '../views/overlays/QuestDetailView';
import Button from '../common/Button';
import { useShops } from '../../hooks/useShops';
import { usePrayer } from '../../hooks/usePrayer';
import { useQuests } from '../../hooks/useQuests';
import { useRepeatableQuests } from '../../hooks/useRepeatableQuests';
import { useSlayer } from '../../hooks/useSlayer';
import { useSkilling } from '../../hooks/useSkilling';
import ShopView from '../views/ShopView';
import PrototypeCombatView from '../views/PrototypeCombatView';
import { SHOPS, SKILL_ICONS } from '../../constants';
import { WorldEntity } from '../../prototyping/worldData';
import { meadowdaleGrid, meadowdaleEntities } from '../../prototyping/world/meadowdale';
import MapEditor from '../../prototyping/MapEditor';

interface TechDemoGameProps {
    initialState: any;
    slotId: number;
    onReturnToMenu: (currentState: any) => void;
    ui: ReturnType<typeof useUIState>;
}

type DemoPanel = 'inventory' | 'skills' | 'equipment' | 'combat' | 'quests' | 'prayer' | 'spellbook' | null;

const TechDemoGame: React.FC<TechDemoGameProps> = ({ initialState, slotId, onReturnToMenu, ui }) => {
    
    const session = useGameSession(initialState.currentPoiId);
    const { activityLog, addLog } = useActivityLog(initialState.activityLog || []);
    const [worldState, setWorldState] = useState(initialState.worldState);
    const [activeTab, setActiveTab] = useState<DemoPanel>('inventory');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    
    // Combat State
    const [combatTargetId, setCombatTargetId] = useState<string | null>(null);
    const [combatVisuals, setCombatVisuals] = useState<CanvasCombatState | null>(null);

    // Initialize Helper Hooks
    const prayer = usePrayer(initialState.activePrayers || [], addLog);
    const quests = useQuests({ playerQuests: initialState.playerQuests, lockedPois: initialState.lockedPois });
    const charCallbacks = useMemo(() => ({ 
        addLog, 
        onXpGain: () => {}, 
        onLevelUp: () => {}, 
    }), [addLog]);

    const charInitialData = useMemo(() => ({ 
        skills: initialState.skills, 
        combatStance: initialState.combatStance, 
        currentHp: initialState.currentHp, 
        currentPrayer: initialState.currentPrayer, 
        autocastSpell: initialState.autocastSpell, 
        statModifiers: initialState.statModifiers, 
        activeBuffs: initialState.activeBuffs 
    }), [initialState]);

    const char = useCharacter(
        charInitialData,
        charCallbacks,
        worldState,
        setWorldState,
        !!combatTargetId,
        1,
        1,
        false,
        prayer.activePrayers, 
        () => prayer.setActivePrayers([]) 
    );

    const invInitialData = useMemo(() => ({ inventory: initialState.inventory, coins: initialState.coins, equipment: initialState.equipment }), [initialState]);
    const inv = useInventory(invInitialData, addLog);

    const repeatableQuests = useRepeatableQuests(initialState.repeatableQuestsState, addLog, inv, char);
    const slayer = useSlayer(initialState.slayerTask, quests.playerQuests, { addLog, addXp: char.addXp, modifyItem: inv.modifyItem, combatLevel: char.combatLevel });

    const skilling = useSkilling(initialState.resourceNodeStates || {}, { 
        addLog, 
        skills: char.skills, 
        addXp: char.addXp, 
        inventory: inv.inventory, 
        modifyItem: inv.modifyItem, 
        equipment: inv.equipment, 
        setEquipment: inv.setEquipment, 
        checkQuestProgressOnShear: () => {}, 
        hasItems: inv.hasItems 
    });

    const shops = useShops(initialState.shopStates, inv.coins, inv.modifyItem, addLog, inv.inventory);
    const [activeShopId, setActiveShopId] = useState<string | null>(null);

    const handleInteract = (entity: WorldEntity) => {
        if (entity.activityId && SHOPS[entity.activityId]) {
            setActiveShopId(entity.activityId);
        } else if (entity.activityId && entity.type === 'object') {
             addLog(`Interacted with ${entity.name}`);
        } else {
            addLog(`Interacted with ${entity.name}`);
        }
    };

    const handleCombatStart = (entity: WorldEntity) => {
        if (entity.monsterId) {
             setCombatTargetId(entity.monsterId);
             setCombatVisuals({
                 monsterId: entity.monsterId,
                 playerHp: char.currentHp,
                 playerMaxHp: char.maxHp,
                 monsterHp: 0,
                 monsterMaxHp: 0,
                 hitsplats: []
             });
        }
    };

    const handleCombatUpdate = (hp: number, maxHp: number) => {
        setCombatVisuals(prev => prev ? { ...prev, monsterHp: hp, monsterMaxHp: maxHp } : null);
    };

    const handleHitsplat = (damage: number | 'miss', target: 'player' | 'monster', isPoison?: boolean) => {
        const newSplat = {
            id: Date.now() + Math.random(),
            damage,
            target,
            timestamp: Date.now(),
            isPoison
        };
        setCombatVisuals(prev => prev ? { ...prev, hitsplats: [...prev.hitsplats, newSplat] } : null);
    };

    React.useEffect(() => {
        if (combatVisuals) {
            setCombatVisuals(prev => prev ? { ...prev, playerHp: char.currentHp, playerMaxHp: char.maxHp } : null);
        }
    }, [char.currentHp, char.maxHp]);

    const gameState = useMemo(() => ({
        username: initialState.username,
        playerType: PlayerType.TechDemo,
        skills: char.skills.map(({ currentLevel, ...rest }) => rest),
        inventory: inv.inventory,
        bank: initialState.bank, 
        coins: inv.coins,
        equipment: inv.equipment,
        combatStance: char.combatStance,
        currentHp: char.currentHp,
        currentPrayer: char.rawCurrentPrayer,
        activePrayers: prayer.activePrayers,
        currentPoiId: 'meadowdale_square',
        playerQuests: quests.playerQuests,
        lockedPois: quests.lockedPois,
        clearedSkillObstacles: initialState.clearedSkillObstacles,
        resourceNodeStates: skilling.resourceNodeStates,
        monsterRespawnTimers: {},
        groundItems: {},
        activityLog: activityLog,
        repeatableQuestsState: {
            boards: repeatableQuests.boards,
            activePlayerQuest: repeatableQuests.activePlayerQuest,
            nextResetTimestamp: repeatableQuests.nextResetTimestamp,
            completedQuestIds: repeatableQuests.completedQuestIds,
            boardCompletions: repeatableQuests.boardCompletions,
        },
        slayerTask: slayer.slayerTask,
        worldState: worldState,
        autocastSpell: char.autocastSpell,
        settings: initialState.settings,
        statModifiers: [],
        activeBuffs: [],
        isDead: false,
    }), [initialState, char, inv, activityLog, worldState, prayer.activePrayers, quests, repeatableQuests, slayer, skilling.resourceNodeStates]);

    useSaveGame(gameState, slotId);

    const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
    };

    const handleCastSpell = (spell: Spell) => {
        if (spell.type === 'combat' && spell.autocastable) {
            char.setAutocastSpell(spell);
            addLog(`Autocast spell set to: ${spell.name}`);
        } else {
            addLog(`Casting ${spell.name}... (Not fully implemented in prototype)`);
        }
    };

    return (
        <div className="relative w-full h-full bg-gray-900 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <GameCanvas 
                    addLog={addLog} 
                    onInteract={handleInteract} 
                    onCombat={handleCombatStart} 
                    combatState={combatVisuals}
                    worldGrid={meadowdaleGrid}
                    entities={meadowdaleEntities}
                    activeSkillingNodeId={skilling.activeSkillingNodeId}
                />
            </div>

            {isEditorOpen && <MapEditor onClose={() => setIsEditorOpen(false)} ui={ui} />}

            {combatTargetId && (
                 <PrototypeCombatView 
                    monsterId={combatTargetId}
                    playerHp={char.currentHp}
                    setPlayerHp={char.setCurrentHp}
                    skills={char.skills as any}
                    equipment={inv.equipment}
                    addXp={char.addXp}
                    addLoot={inv.modifyItem}
                    onCombatEnd={() => {
                        setCombatTargetId(null);
                        setCombatVisuals(null);
                    }}
                    addLog={addLog}
                    onMonsterStateUpdate={handleCombatUpdate}
                    onHitsplat={handleHitsplat}
                 />
            )}

            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-2">
                <div className="pointer-events-auto self-start bg-black/60 border border-yellow-600/50 p-2 rounded text-xs text-gray-300 backdrop-blur-sm">
                     <h1 className="text-sm font-bold text-yellow-400">Isometric Prototype</h1>
                     <div className="flex gap-2 mt-1">
                        <Button size="sm" onClick={() => onReturnToMenu(gameState)}>Save & Exit</Button>
                        <Button size="sm" onClick={() => setIsEditorOpen(true)} variant="secondary">Map Editor</Button>
                     </div>
                </div>

                <div className="flex items-end justify-between mt-auto w-full gap-4">
                    <div 
                        className="pointer-events-auto w-full max-w-md h-48 bg-black/60 border-2 border-gray-600 rounded-lg overflow-hidden backdrop-blur-sm shadow-xl flex flex-col"
                        onMouseDown={stopPropagation}
                        onTouchStart={stopPropagation}
                    >
                        <ActivityLog logs={activityLog} />
                    </div>

                    <div 
                        className="pointer-events-auto flex flex-col items-end"
                        onMouseDown={stopPropagation}
                        onTouchStart={stopPropagation}
                    >
                        <div className="flex gap-1 mb-0 z-20 flex-wrap justify-end">
                             <button 
                                onClick={() => setActiveTab(activeTab === 'combat' ? null : 'combat')}
                                className={`w-10 h-10 flex items-center justify-center rounded-t-md border-t-2 border-x-2 ${activeTab === 'combat' ? 'bg-red-900/90 border-red-700' : 'bg-gray-900/80 border-gray-600 hover:bg-gray-800'}`}
                                title="Combat Styles"
                            >
                                <img src="https://api.iconify.design/game-icons:swords-emblem.svg" className="w-6 h-6 filter invert" />
                            </button>
                            <button 
                                onClick={() => setActiveTab(activeTab === 'inventory' ? null : 'inventory')}
                                className={`w-10 h-10 flex items-center justify-center rounded-t-md border-t-2 border-x-2 ${activeTab === 'inventory' ? 'bg-red-900/90 border-red-700' : 'bg-gray-900/80 border-gray-600 hover:bg-gray-800'}`}
                                title="Inventory"
                            >
                                <img src="https://api.iconify.design/game-icons:knapsack.svg" className="w-6 h-6 filter invert" />
                            </button>
                            <button 
                                onClick={() => setActiveTab(activeTab === 'equipment' ? null : 'equipment')}
                                className={`w-10 h-10 flex items-center justify-center rounded-t-md border-t-2 border-x-2 ${activeTab === 'equipment' ? 'bg-red-900/90 border-red-700' : 'bg-gray-900/80 border-gray-600 hover:bg-gray-800'}`}
                                title="Equipment"
                            >
                                <img src="https://api.iconify.design/game-icons:battle-gear.svg" className="w-6 h-6 filter invert" />
                            </button>
                            <button 
                                onClick={() => setActiveTab(activeTab === 'prayer' ? null : 'prayer')}
                                className={`w-10 h-10 flex items-center justify-center rounded-t-md border-t-2 border-x-2 ${activeTab === 'prayer' ? 'bg-red-900/90 border-red-700' : 'bg-gray-900/80 border-gray-600 hover:bg-gray-800'}`}
                                title="Prayer"
                            >
                                <img src="https://api.iconify.design/game-icons:polar-star.svg" className="w-6 h-6 filter invert" />
                            </button>
                            <button 
                                onClick={() => setActiveTab(activeTab === 'spellbook' ? null : 'spellbook')}
                                className={`w-10 h-10 flex items-center justify-center rounded-t-md border-t-2 border-x-2 ${activeTab === 'spellbook' ? 'bg-red-900/90 border-red-700' : 'bg-gray-900/80 border-gray-600 hover:bg-gray-800'}`}
                                title="Spellbook"
                            >
                                <img src="https://api.iconify.design/game-icons:book-cover.svg" className="w-6 h-6 filter invert" />
                            </button>
                            <button 
                                onClick={() => setActiveTab(activeTab === 'skills' ? null : 'skills')}
                                className={`w-10 h-10 flex items-center justify-center rounded-t-md border-t-2 border-x-2 ${activeTab === 'skills' ? 'bg-red-900/90 border-red-700' : 'bg-gray-900/80 border-gray-600 hover:bg-gray-800'}`}
                                title="Skills"
                            >
                                <img src="https://api.iconify.design/game-icons:podium.svg" className="w-6 h-6 filter invert" />
                            </button>
                            <button 
                                onClick={() => setActiveTab(activeTab === 'quests' ? null : 'quests')}
                                className={`w-10 h-10 flex items-center justify-center rounded-t-md border-t-2 border-x-2 ${activeTab === 'quests' ? 'bg-red-900/90 border-red-700' : 'bg-gray-900/80 border-gray-600 hover:bg-gray-800'}`}
                                title="Quests"
                            >
                                <img src="https://api.iconify.design/game-icons:eclipse-flare.svg" className="w-6 h-6 filter invert" />
                            </button>
                        </div>

                        {activeTab && (
                            <div className="w-[280px] sm:w-[320px] h-[400px] bg-red-900/90 border-2 border-red-700 rounded-tl-lg rounded-bl-lg p-2 backdrop-blur-md shadow-2xl overflow-y-auto relative z-10">
                                {activeTab === 'inventory' && (
                                    <InventoryPanel 
                                        inventory={inv.inventory} 
                                        coins={inv.coins} 
                                        skills={char.skills}
                                        onEquip={() => {}} onConsume={() => {}} onDropItem={() => {}} 
                                        onBury={() => {}} onEmpty={() => {}} onDivine={() => {}}
                                        setTooltip={ui.setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog}
                                        itemToUse={null} setItemToUse={() => {}} onUseItemOn={() => {}} onMoveItem={() => {}}
                                        setConfirmationPrompt={() => {}} setMakeXPrompt={() => {}} onExamine={() => {}}
                                        isTouchSimulationEnabled={false} spellToCast={null} onSpellOnItem={() => {}} onReadMap={() => {}}
                                        confirmValuableDrops={false} valuableDropThreshold={1000} isOneClickMode={false} onTeleport={() => {}}
                                        ui={ui}
                                    />
                                )}
                                {activeTab === 'skills' && (
                                    <SkillsPanel 
                                        skills={char.skills} 
                                        setTooltip={ui.setTooltip} 
                                        onOpenGuide={() => {}} 
                                        isTouchSimulationEnabled={false} 
                                    />
                                )}
                                {activeTab === 'equipment' && (
                                    <EquipmentPanel
                                        equipment={inv.equipment}
                                        inventory={inv.inventory}
                                        coins={inv.coins}
                                        onUnequip={() => {}} 
                                        setTooltip={ui.setTooltip}
                                        ui={ui}
                                        addLog={addLog}
                                        onExamine={() => {}}
                                        isTouchSimulationEnabled={false}
                                        isOneClickMode={false}
                                        onTeleport={() => {}}
                                    />
                                )}
                                {activeTab === 'combat' && (
                                    <CombatStylePanel
                                        combatStance={char.combatStance}
                                        setCombatStance={char.setCombatStance}
                                        equipment={inv.equipment}
                                        combatLevel={char.combatLevel}
                                        ui={ui}
                                    />
                                )}
                                {activeTab === 'quests' && (
                                    <QuestsPanel
                                        playerQuests={quests.playerQuests}
                                        activeRepeatableQuest={repeatableQuests.activePlayerQuest}
                                        inventory={inv.inventory}
                                        slayerTask={slayer.slayerTask}
                                        onSelectQuest={(questId) => ui.setActiveQuestDetail({ questId, playerQuests: quests.playerQuests })}
                                    />
                                )}
                                {activeTab === 'prayer' && (
                                    <PrayerPanel
                                        skills={char.skills}
                                        activePrayers={prayer.activePrayers}
                                        onTogglePrayer={(id) => prayer.togglePrayer(id, char.skills, quests.playerQuests, char.rawCurrentPrayer)}
                                        setTooltip={ui.setTooltip}
                                        playerQuests={quests.playerQuests}
                                    />
                                )}
                                {activeTab === 'spellbook' && (
                                    <SpellbookPanel
                                        skills={char.skills}
                                        inventory={inv.inventory}
                                        equipment={inv.equipment}
                                        onCastSpell={handleCastSpell}
                                        setTooltip={ui.setTooltip}
                                        autocastSpell={char.autocastSpell}
                                        ui={ui}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {ui.activeQuestDetail && (
                <div className="pointer-events-auto relative z-50">
                    <QuestDetailView 
                        questId={ui.activeQuestDetail.questId} 
                        playerQuests={ui.activeQuestDetail.playerQuests} 
                        onClose={() => ui.setActiveQuestDetail(null)} 
                    />
                </div>
            )}

            {activeShopId && (
                <div className="absolute inset-0 z-50 bg-black/60 p-4 flex items-center justify-center animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    <div className="w-full max-w-4xl h-full max-h-[80vh] bg-gray-800 border-4 border-gray-600 rounded-lg overflow-hidden shadow-2xl">
                        <ShopView
                            shopId={activeShopId}
                            playerCoins={inv.coins}
                            shopStates={shops.shopStates}
                            onBuy={shops.handleBuy}
                            addLog={addLog}
                            onExit={() => setActiveShopId(null)}
                            setContextMenu={ui.setContextMenu}
                            setMakeXPrompt={ui.setMakeXPrompt}
                            setTooltip={ui.setTooltip}
                            isOneClickMode={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechDemoGame;
