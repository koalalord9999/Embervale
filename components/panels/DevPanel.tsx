
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Button from '../common/Button';
import { useInventory } from '../../hooks/useInventory';
import { Item, SkillName, ToolType } from '../../types';
import { ITEMS, INVENTORY_CAPACITY, getIconClassName, REGIONS, ALL_SKILLS, QUESTS, LOG_HARDNESS } from '../../constants';
import { POIS } from '../../data/pois';
import { TooltipState, useUIState } from '../../hooks/useUIState';

interface GameManagerProps {
    onResetQuest: (questId: string) => void;
    showAllPois: boolean;
    onToggleShowAllPois: () => void;
    isMapManagerEnabled: boolean;
    onToggleMapManager: (enable: boolean) => void;
    onCommitMapChanges: () => void;
    hasMapChanges: boolean;
    isTouchSimulationEnabled: boolean;
    onToggleTouchSimulation: () => void;
    onResetQuestBoards: () => void;
    onResetPilferingHouses: () => void;
}

const GameManagerComponent: React.FC<GameManagerProps> = ({
    onResetQuest, showAllPois, onToggleShowAllPois, isMapManagerEnabled,
    onToggleMapManager, onCommitMapChanges, hasMapChanges, isTouchSimulationEnabled, onToggleTouchSimulation,
    onResetQuestBoards, onResetPilferingHouses
}) => {
    const [questToReset, setQuestToReset] = useState<string>('');

    return (
        <div className="p-2 space-y-4">
            {/* Reset Quest */}
            <div>
                <label className="block text-sm font-semibold mb-1">Reset Quest</label>
                <div className="flex gap-2">
                    <select value={questToReset} onChange={e => setQuestToReset(e.target.value)} className="w-full p-1 text-base bg-gray-800 border border-gray-600 rounded">
                        <option value="">-- Select Quest --</option>
                        {Object.values(QUESTS).sort((a,b) => a.name.localeCompare(b.name)).map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
                    </select>
                    <Button size="sm" onClick={() => { if (questToReset) onResetQuest(questToReset); }} disabled={!questToReset}>Reset</Button>
                </div>
            </div>

            {/* Reset Timers */}
            <div>
                <label className="block text-sm font-semibold mb-1">Reset Timers</label>
                <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" onClick={onResetQuestBoards}>Quest Boards</Button>
                    <Button size="sm" onClick={onResetPilferingHouses}>Pilfering Houses</Button>
                </div>
            </div>

            {/* Show All POIs */}
            <div>
                <label className="block text-sm font-semibold mb-1">Show All POIs on Map</label>
                <button onClick={onToggleShowAllPois} className={`w-full py-1 text-xs rounded font-bold transition-colors ${showAllPois ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}>{showAllPois ? 'ON' : 'OFF'}</button>
            </div>

            {/* Map Manager */}
            <div>
                <label className="block text-sm font-semibold mb-1">Map Manager</label>
                <div className="flex gap-2">
                    <button onClick={() => onToggleMapManager(!isMapManagerEnabled)} className={`flex-1 py-1 text-xs rounded font-bold transition-colors ${isMapManagerEnabled ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}>{isMapManagerEnabled ? 'ON' : 'OFF'}</button>
                    <Button size="sm" onClick={onCommitMapChanges} disabled={!isMapManagerEnabled || !hasMapChanges}>Commit</Button>
                </div>
            </div>

            {/* Simulate Touch */}
            <div>
                <label className="block text-sm font-semibold mb-1">Simulate Touch</label>
                <button onClick={onToggleTouchSimulation} className={`w-full py-1 text-xs rounded font-bold transition-colors ${isTouchSimulationEnabled ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}>{isTouchSimulationEnabled ? 'ON' : 'OFF'}</button>
            </div>
        </div>
    );
};


interface CheatsComponentProps {
    combatSpeedMultiplier: number;
    setCombatSpeedMultiplier: (speed: number) => void;
    isInstantRespawnOn: boolean;
    setIsInstantRespawnOn: (isOn: boolean) => void;
    instantRespawnCounter: number | null;
    setInstantRespawnCounter: (count: number | null) => void;
    isInCombat: boolean;
    isPermAggroOn: boolean;
    onTogglePermAggro: () => void;
    isPlayerInvisible: boolean;
    setIsPlayerInvisible: (isInvisible: boolean) => void;
    isAutoBankOn: boolean;
    setIsAutoBankOn: (isOn: boolean) => void;
    xpMultiplier: number;
    setXpMultiplier: (multiplier: number) => void;
    onHealPlayer: () => void;
    onKillMonster: () => void;
    onAddCoins: (amount: number) => void;
    onSetSkillLevel: (skill: SkillName, level: number) => void;
    isGodModeOn: boolean;
    setIsGodModeOn: (isOn: boolean) => void;
}

const CheatsComponent: React.FC<CheatsComponentProps> = ({
    combatSpeedMultiplier, setCombatSpeedMultiplier, isInstantRespawnOn, setIsInstantRespawnOn,
    instantRespawnCounter, setInstantRespawnCounter, isInCombat,
    isPermAggroOn, onTogglePermAggro, isPlayerInvisible, setIsPlayerInvisible, isAutoBankOn, setIsAutoBankOn,
    xpMultiplier, setXpMultiplier,
    onHealPlayer, onKillMonster, onAddCoins, onSetSkillLevel, isGodModeOn, setIsGodModeOn
}) => {
    const [skillToSet, setSkillToSet] = useState<SkillName | ''>('');
    const [levelToSet, setLevelToSet] = useState(1);
    const [coinAmount, setCoinAmount] = useState(1000000);

    return (
        <div className="p-2 space-y-4">
            {/* Player Cheats */}
            <div>
                <label className="block text-sm font-semibold mb-1">Player Cheats</label>
                <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" onClick={onHealPlayer}>Heal Player</Button>
                    <Button size="sm" onClick={onKillMonster} disabled={!isInCombat}>Kill Monster</Button>
                </div>
            </div>
            
            {/* Add Coins */}
            <div>
                <label className="block text-sm font-semibold mb-1">Add Coins</label>
                <div className="flex gap-2">
                    <input type="number" value={coinAmount} onChange={e => setCoinAmount(parseInt(e.target.value, 10) || 0)} className="w-full p-1 text-base bg-gray-800 border border-gray-600 rounded text-center"/>
                    <Button size="sm" onClick={() => onAddCoins(coinAmount)}>Add</Button>
                </div>
            </div>

            {/* Set Skill Level */}
            <div>
                <label className="block text-sm font-semibold mb-1">Set Skill Level</label>
                <div className="flex gap-2">
                    <select value={skillToSet} onChange={e => setSkillToSet(e.target.value as SkillName | '')} className="w-full p-1 text-base bg-gray-800 border border-gray-600 rounded">
                        <option value="">Select Skill</option>
                        {ALL_SKILLS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                    <input type="number" min="1" max="99" value={levelToSet} onChange={e => setLevelToSet(parseInt(e.target.value, 10) || 1)} className="w-20 p-1 text-base bg-gray-800 border border-gray-600 rounded text-center"/>
                    <Button size="sm" onClick={() => { if (skillToSet) { onSetSkillLevel(skillToSet, levelToSet); } }} disabled={!skillToSet}>Set</Button>
                </div>
            </div>

             {/* XP Multiplier */}
            <div>
                <label className="block text-sm font-semibold mb-1">XP Multiplier</label>
                <div className="flex flex-wrap gap-1">
                    {[1, 2, 5, 10, 25, 50, 100].map(val => (
                        <Button
                            key={val}
                            size="sm"
                            variant={xpMultiplier === val ? 'primary' : 'secondary'}
                            onClick={() => setXpMultiplier(val)}
                            className="px-1.5" // Tighter padding
                        >
                            {val}x
                        </Button>
                    ))}
                </div>
            </div>
            {/* Combat Speed */}
            <div>
                <label className="block text-sm font-semibold mb-1">Combat Speed</label>
                <div className="flex gap-1">
                    {[1, 2, 3].map(speed => (
                        <Button key={speed} size="sm" onClick={() => setCombatSpeedMultiplier(speed)} variant={combatSpeedMultiplier === speed ? 'primary' : 'secondary'} className="flex-1">{speed}x</Button>
                    ))}
                </div>
            </div>
            {/* Instant Respawn */}
            <div>
                <label className="block text-sm font-semibold mb-1">Instant Respawn</label>
                <div className="flex gap-2 items-center">
                    <button onClick={() => setIsInstantRespawnOn(!isInstantRespawnOn)} className={`flex-1 py-1 text-xs rounded font-bold transition-colors ${isInstantRespawnOn ? 'bg-green-600 hover:bg-green-500' : 'bg-red-700 hover:bg-red-600'}`}>
                        {isInstantRespawnOn ? 'ON' : 'OFF'}
                    </button>
                    <input type="number" placeholder="Count" disabled={!isInstantRespawnOn} value={instantRespawnCounter ?? ''} onChange={e => setInstantRespawnCounter(e.target.value ? parseInt(e.target.value, 10) : null)} className="w-20 p-1 text-base bg-gray-800 border border-gray-600 rounded disabled:opacity-50 text-center" />
                </div>
            </div>
            {/* God Mode */}
            <div>
                <label className="block text-sm font-semibold mb-1">God Mode</label>
                <button onClick={() => setIsGodModeOn(!isGodModeOn)} className={`w-full py-1 text-xs rounded font-bold transition-colors ${isGodModeOn ? 'bg-green-600 hover:bg-green-500' : 'bg-red-700 hover:bg-red-600'}`}>{isGodModeOn ? 'ON' : 'OFF'}</button>
            </div>
            {/* Invisibility */}
            <div>
                <label className="block text-sm font-semibold mb-1">Invisibility</label>
                <button onClick={() => setIsPlayerInvisible(!isPlayerInvisible)} className={`w-full py-1 text-xs rounded font-bold transition-colors ${isPlayerInvisible ? 'bg-green-600 hover:bg-green-500' : 'bg-red-700 hover:bg-red-600'}`}>{isPlayerInvisible ? 'ON' : 'OFF'}</button>
            </div>
            {/* Auto-Bank */}
            <div>
                <label className="block text-sm font-semibold mb-1">Auto-Bank</label>
                <button onClick={() => setIsAutoBankOn(!isAutoBankOn)} className={`w-full py-1 text-xs rounded font-bold transition-colors ${isAutoBankOn ? 'bg-green-600 hover:bg-green-500' : 'bg-red-700 hover:bg-red-600'}`}>{isAutoBankOn ? 'ON' : 'OFF'}</button>
            </div>
            {/* Perm-Aggro */}
            <div>
                <label className="block text-sm font-semibold mb-1">Permanent Aggro</label>
                <button onClick={onTogglePermAggro} className={`w-full py-1 text-xs rounded font-bold transition-colors ${isPermAggroOn ? 'bg-green-600 hover:bg-green-500' : 'bg-red-700 hover:bg-red-600'}`}>
                    {isPermAggroOn ? 'ON (Global)' : 'OFF (Global)'}
                </button>
            </div>
        </div>
    );
};

interface ItemSpawnerProps {
    inv: ReturnType<typeof useInventory>;
    setTooltip: (tooltip: TooltipState | null) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedItem: Item | null;
    setSelectedItem: (item: Item | null) => void;
    quantity: number;
    setQuantity: (qty: number) => void;
}

const ItemSpawnerComponent: React.FC<ItemSpawnerProps> = ({ inv, setTooltip, searchTerm, setSearchTerm, selectedItem, setSelectedItem, quantity, setQuantity }) => {
    const { inventory, modifyItem } = inv;

    const allItems = useMemo(() => Object.values(ITEMS).sort((a, b) => a.name.localeCompare(b.name)), []);
    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return allItems;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return allItems.filter(item => item.name.toLowerCase().includes(lowerCaseSearch) || item.id.toLowerCase().includes(lowerCaseSearch));
    }, [searchTerm, allItems]);

    const freeSlots = INVENTORY_CAPACITY - inventory.filter(Boolean).length;

    const maxQty = useMemo(() => {
        if (!selectedItem) return 1;
        if (selectedItem.stackable) return 100000;
        return freeSlots;
    }, [selectedItem, freeSlots]);

    useEffect(() => {
        setQuantity(selectedItem?.stackable ? 1000 : 1);
    }, [selectedItem, setQuantity]);

    const handleSpawn = () => {
        if (!selectedItem || quantity <= 0) return;
        const actualQuantity = Math.min(quantity, maxQty);
        modifyItem(selectedItem.id, actualQuantity, false, {
            doses: selectedItem.initialDoses,
            charges: selectedItem.charges,
            bypassAutoBank: true
        });
    };
    
    const handleQuantityChange = (value: string) => {
        const num = parseInt(value, 10);
        if (isNaN(num)) {
            setQuantity(1);
        } else {
            setQuantity(Math.max(1, Math.min(maxQty, num)));
        }
    };
    
    const handleMouseEnter = (e: React.MouseEvent, item: Item) => {
        const tooltipContent = (
            <div>
                <p className="font-bold text-yellow-300">{item.name}</p>
                <p className="text-sm text-gray-300">{item.description}</p>
            </div>
        );
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <div className="p-2 flex flex-col h-full">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for items..." className="w-full p-1 mb-2 bg-gray-800 border border-gray-600 rounded text-center text-base" />
            <div className="flex-grow overflow-y-auto border-2 border-gray-700 rounded-md bg-black/20 p-1">
                <div className="grid grid-cols-7 gap-1">
                    {filteredItems.map(item => (
                        <button 
                            key={item.id} 
                            onClick={() => setSelectedItem(item)} 
                            className={`aspect-square p-1 rounded-md transition-colors ${selectedItem?.id === item.id ? 'bg-yellow-700 ring-2 ring-yellow-400' : 'bg-gray-800 hover:bg-gray-700'}`}
                            onMouseEnter={(e) => handleMouseEnter(e, item)}
                            onMouseLeave={() => setTooltip(null)}
                        >
                            <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
                        </button>
                    ))}
                </div>
            </div>
            {selectedItem && (
                <div className="mt-2 pt-2 border-t-2 border-gray-700 bg-gray-800 p-2 rounded-b-md">
                    <h4 className="font-bold text-center text-yellow-300 mb-2">Spawn: {selectedItem.name}</h4>
                    <div className="flex flex-col items-center gap-2">
                        <input type="range" min="1" max={maxQty} value={quantity} step={selectedItem.stackable ? 1000 : 1} onChange={e => setQuantity(parseInt(e.target.value))} className="w-full" />
                        <div className="flex items-center gap-2">
                            <input type="number" value={quantity} onChange={e => handleQuantityChange(e.target.value)} className="w-24 p-1 text-center bg-gray-900 border border-gray-600 rounded text-base" />
                            <span className="text-gray-400">/ {maxQty.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2 w-full">
                            <Button onClick={handleSpawn} disabled={quantity <= 0 || maxQty < 1} className="flex-1">Spawn</Button>
                            <Button onClick={() => setSelectedItem(null)} variant="secondary" className="flex-1">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TeleportComponent: React.FC<{
    onForcedNavigate: (poiId: string) => void;
    selectedRegionId: string;
    setSelectedRegionId: (id: string) => void;
    selectedPoiId: string;
    setSelectedPoiId: (id: string) => void;
}> = ({ onForcedNavigate, selectedRegionId, setSelectedRegionId, selectedPoiId, setSelectedPoiId }) => {
    const regions = useMemo(() => Object.values(REGIONS).sort((a, b) => a.name.localeCompare(b.name)), []);
    const poisInRegion = useMemo(() => {
        if (!selectedRegionId) return [];
        return Object.values(POIS)
            .filter(p => p.regionId === selectedRegionId)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [selectedRegionId]);

    useEffect(() => {
        if (selectedRegionId && !poisInRegion.some(p => p.id === selectedPoiId)) {
            setSelectedPoiId(poisInRegion.length > 0 ? poisInRegion[0].id : '');
        }
    }, [selectedRegionId, poisInRegion, selectedPoiId, setSelectedPoiId]);

    const handleTeleport = () => {
        if (selectedPoiId) {
            onForcedNavigate(selectedPoiId);
        }
    };

    return (
        <div className="p-2 space-y-4">
            <div>
                <label htmlFor="region-select" className="block text-sm font-semibold mb-1">Region</label>
                <select id="region-select" value={selectedRegionId} onChange={e => setSelectedRegionId(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-base">
                    <option value="">-- Select Region --</option>
                    {regions.map(region => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="poi-select" className="block text-sm font-semibold mb-1">Point of Interest</label>
                <select id="poi-select" value={selectedPoiId} onChange={e => setSelectedPoiId(e.target.value)} disabled={!selectedRegionId} className="w-full p-2 bg-gray-800 border border-gray-600 rounded disabled:opacity-50 text-base">
                    <option value="">-- Select POI --</option>
                    {poisInRegion.map(poi => (
                        <option key={poi.id} value={poi.id}>{poi.name}</option>
                    ))}
                </select>
            </div>
            <Button onClick={handleTeleport} disabled={!selectedPoiId} className="w-full">Teleport</Button>
        </div>
    );
};

interface DevPanelProps {
    inv: ReturnType<typeof useInventory>;
    devPanelState: {
        activeTab: 'cheats' | 'items' | 'teleport' | 'game-manager' | 'monsters';
        itemSearchTerm: string;
        selectedItemId: string | null;
        spawnQuantity: number;
        teleportRegionId: string;
        teleportPoiId: string;
    };
    updateDevPanelState: (updates: Partial<DevPanelProps['devPanelState']>) => void;
    onClose: () => void;
    ui: ReturnType<typeof useUIState>;
    
    // Cheats Props
    combatSpeedMultiplier: number;
    setCombatSpeedMultiplier: (speed: number) => void;
    isInstantRespawnOn: boolean;
    setIsInstantRespawnOn: (isOn: boolean) => void;
    instantRespawnCounter: number | null;
    setInstantRespawnCounter: (count: number | null) => void;
    isInCombat: boolean;
    isPermAggroOn: boolean;
    onTogglePermAggro: () => void;
    isCurrentMonsterAggro: boolean;
    onToggleAggro: () => void;
    isPlayerInvisible: boolean;
    setIsPlayerInvisible: (isInvisible: boolean) => void;
    isAutoBankOn: boolean;
    setIsAutoBankOn: (isOn: boolean) => void;
    xpMultiplier: number;
    setXpMultiplier: (multiplier: number) => void;
    onHealPlayer: () => void;
    onKillMonster: () => void;
    onAddCoins: (amount: number) => void;
    onSetSkillLevel: (skill: SkillName, level: number) => void;
    isGodModeOn: boolean;
    setIsGodModeOn: (isOn: boolean) => void;

    // Game Manager Props
    onResetQuest: (questId: string) => void;
    showAllPois: boolean;
    onToggleShowAllPois: () => void;
    isMapManagerEnabled: boolean;
    onToggleMapManager: (enable: boolean) => void;
    onCommitMapChanges: () => void;
    hasMapChanges: boolean;
    isTouchSimulationEnabled: boolean;
    onToggleTouchSimulation: () => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    onForcedNavigate: (poiId: string) => void;
    onResetQuestBoards: () => void;
    onResetPilferingHouses: () => void;
}

const DevPanel: React.FC<DevPanelProps> = (props) => {
    const { inv, setTooltip, devPanelState, updateDevPanelState, onClose, ui, ...otherProps } = props;
    const { activeTab, itemSearchTerm, selectedItemId, spawnQuantity, teleportRegionId, teleportPoiId } = devPanelState;

    const setActiveTab = (tab: 'cheats' | 'items' | 'teleport' | 'game-manager' | 'monsters') => updateDevPanelState({ activeTab: tab });

    const selectedItem = useMemo(() => selectedItemId ? ITEMS[selectedItemId] : null, [selectedItemId]);

    // Memoize the callbacks
    const setSearchTerm = useCallback((term: string) => updateDevPanelState({ itemSearchTerm: term }), [updateDevPanelState]);
    const setSelectedItem = useCallback((item: Item | null) => updateDevPanelState({ selectedItemId: item ? item.id : null }), [updateDevPanelState]);
    const setQuantity = useCallback((qty: number) => updateDevPanelState({ spawnQuantity: qty }), [updateDevPanelState]);

    return (
        <div className="flex flex-col h-full text-gray-300 font-sans">
             <div className="flex justify-between items-center p-2 border-b-2 border-gray-700 flex-shrink-0">
                <h3 className="text-lg font-bold text-yellow-400">Developer Panel</h3>
                <Button onClick={onClose} size="sm">X</Button>
            </div>
            <div className="flex border-b-2 border-gray-700 mb-2 flex-shrink-0">
                <button onClick={() => setActiveTab('cheats')} className={`flex-1 py-1 text-sm font-semibold rounded-t-md transition-colors ${activeTab === 'cheats' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Cheats</button>
                <button onClick={() => setActiveTab('items')} className={`flex-1 py-1 text-sm font-semibold rounded-t-md transition-colors ${activeTab === 'items' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Items</button>
                <button onClick={() => setActiveTab('game-manager')} className={`flex-1 py-1 text-sm font-semibold rounded-t-md transition-colors ${activeTab === 'game-manager' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Game Manager</button>
                <button onClick={() => setActiveTab('teleport')} className={`flex-1 py-1 text-sm font-semibold rounded-t-md transition-colors ${activeTab === 'teleport' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Teleport</button>
            </div>
            <div className="flex-grow min-h-0 overflow-y-auto">
                {activeTab === 'cheats' && <CheatsComponent {...otherProps} />}
                {activeTab === 'items' && <ItemSpawnerComponent
                    inv={inv}
                    setTooltip={setTooltip}
                    searchTerm={itemSearchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    quantity={spawnQuantity}
                    setQuantity={setQuantity}
                />}
                {activeTab === 'game-manager' && <GameManagerComponent {...otherProps} />}
                {activeTab === 'teleport' && <TeleportComponent
                    onForcedNavigate={props.onForcedNavigate}
                    selectedRegionId={teleportRegionId}
                    setSelectedRegionId={(id) => updateDevPanelState({ teleportRegionId: id, teleportPoiId: '' })}
                    selectedPoiId={teleportPoiId}
                    setSelectedPoiId={(id) => updateDevPanelState({ teleportPoiId: id })}
                />}
            </div>
        </div>
    );
};

export default DevPanel;