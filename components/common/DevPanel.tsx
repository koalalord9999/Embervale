import React, { useState, useMemo, useEffect } from 'react';
import Button from '../common/Button';
import { useInventory } from '../../hooks/useInventory';
import { Item } from '../../types';
import { ITEMS, INVENTORY_CAPACITY, getIconClassName, REGIONS } from '../../constants';
import { POIS } from '../../data/pois';
import { TooltipState } from '../../hooks/useUIState';

interface DevPanelProps {
    inv: ReturnType<typeof useInventory>;
    combatSpeedMultiplier: number;
    setCombatSpeedMultiplier: (speed: number) => void;
    isInstantRespawnOn: boolean;
    setIsInstantRespawnOn: (isOn: boolean) => void;
    instantRespawnCounter: number | null;
    setInstantRespawnCounter: (count: number | null) => void;
    isInCombat: boolean;
    isCurrentMonsterAggro: boolean;
    onToggleAggro: () => void;
    isPlayerInvisible: boolean;
    setIsPlayerInvisible: (isInvisible: boolean) => void;
    isAutoBankOn: boolean;
    setIsAutoBankOn: (isOn: boolean) => void;
    isTouchSimulationEnabled: boolean;
    onToggleTouchSimulation: () => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    isMapManagerEnabled: boolean;
    onToggleMapManager: (enable: boolean) => void;
    onCommitMapChanges: () => void;
    hasMapChanges: boolean;
    // New Props
    showAllPois: boolean;
    onToggleShowAllPois: () => void;
    onForcedNavigate: (poiId: string) => void;
}

const CheatsComponent: React.FC<Omit<DevPanelProps, 'inv' | 'setTooltip' | 'onForcedNavigate'>> = ({
    combatSpeedMultiplier, setCombatSpeedMultiplier, isInstantRespawnOn, setIsInstantRespawnOn,
    instantRespawnCounter, setInstantRespawnCounter, isInCombat, isCurrentMonsterAggro,
    onToggleAggro, isPlayerInvisible, setIsPlayerInvisible, isAutoBankOn, setIsAutoBankOn,
    isTouchSimulationEnabled, onToggleTouchSimulation, isMapManagerEnabled, onToggleMapManager,
    onCommitMapChanges, hasMapChanges, showAllPois, onToggleShowAllPois
}) => (
    <div className="p-2 space-y-4">
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
                <input type="number" placeholder="Count" disabled={!isInstantRespawnOn} value={instantRespawnCounter ?? ''} onChange={e => setInstantRespawnCounter(e.target.value ? parseInt(e.target.value, 10) : null)} className="w-20 p-1 text-xs bg-gray-800 border border-gray-600 rounded disabled:opacity-50 text-center" />
            </div>
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
        {/* Simulate Touch */}
        <div>
            <label className="block text-sm font-semibold mb-1">Simulate Touch</label>
            <button onClick={onToggleTouchSimulation} className={`w-full py-1 text-xs rounded font-bold transition-colors ${isTouchSimulationEnabled ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}>{isTouchSimulationEnabled ? 'ON' : 'OFF'}</button>
        </div>
        {/* Perm-Aggro */}
        <div>
            <label className="block text-sm font-semibold mb-1">Permanent Aggro</label>
            <button onClick={onToggleAggro} disabled={!isInCombat} className={`w-full py-1 text-xs rounded font-bold transition-colors ${isCurrentMonsterAggro ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'} disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed`}>
                {isCurrentMonsterAggro ? 'ON (Current)' : 'OFF (Current)'}
            </button>
        </div>
    </div>
);

const ItemSpawnerComponent: React.FC<{ inv: ReturnType<typeof useInventory>; setTooltip: (tooltip: TooltipState | null) => void; }> = ({ inv, setTooltip }) => {
    const { inventory, modifyItem } = inv;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [quantity, setQuantity] = useState(1);

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
    }, [selectedItem]);

    const handleSpawn = () => {
        if (!selectedItem || quantity <= 0) return;
        const actualQuantity = Math.min(quantity, maxQty);
        modifyItem(selectedItem.id, actualQuantity);
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
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for items..." className="w-full p-1 mb-2 bg-gray-800 border border-gray-600 rounded text-center" />
            <div className="flex-grow overflow-y-auto border-2 border-gray-700 rounded-md bg-black/20 p-1">
                <div className="grid grid-cols-4 gap-1">
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
                            <input type="number" value={quantity} onChange={e => handleQuantityChange(e.target.value)} className="w-24 p-1 text-center bg-gray-900 border border-gray-600 rounded" />
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

const TeleportComponent: React.FC<{ onForcedNavigate: (poiId: string) => void }> = ({ onForcedNavigate }) => {
    const [selectedRegionId, setSelectedRegionId] = useState<string>('');
    const [selectedPoiId, setSelectedPoiId] = useState<string>('');

    const regions = useMemo(() => Object.values(REGIONS).sort((a, b) => a.name.localeCompare(b.name)), []);
    const poisInRegion = useMemo(() => {
        if (!selectedRegionId) return [];
        return Object.values(POIS)
            .filter(p => p.regionId === selectedRegionId)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [selectedRegionId]);

    useEffect(() => {
        if (poisInRegion.length > 0) {
            setSelectedPoiId(poisInRegion[0].id);
        } else {
            setSelectedPoiId('');
        }
    }, [poisInRegion]);

    const handleTeleport = () => {
        if (selectedPoiId) {
            onForcedNavigate(selectedPoiId);
        }
    };

    return (
        <div className="p-2 space-y-4">
            <div>
                <label htmlFor="region-select" className="block text-sm font-semibold mb-1">Region</label>
                <select id="region-select" value={selectedRegionId} onChange={e => setSelectedRegionId(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded">
                    <option value="">-- Select Region --</option>
                    {regions.map(region => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="poi-select" className="block text-sm font-semibold mb-1">Point of Interest</label>
                <select id="poi-select" value={selectedPoiId} onChange={e => setSelectedPoiId(e.target.value)} disabled={!selectedRegionId} className="w-full p-2 bg-gray-800 border border-gray-600 rounded disabled:opacity-50">
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

const DevPanel: React.FC<DevPanelProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'cheats' | 'items' | 'teleport'>('cheats');
    const { inv, setTooltip, ...otherProps } = props;

    return (
        <div className="flex flex-col h-full text-gray-300 font-sans">
            <h3 className="text-lg font-bold text-center mb-2 text-yellow-400">Developer Panel</h3>
            <div className="flex border-b-2 border-gray-700 mb-2">
                <button onClick={() => setActiveTab('cheats')} className={`flex-1 py-1 text-sm font-semibold rounded-t-md transition-colors ${activeTab === 'cheats' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Cheats</button>
                <button onClick={() => setActiveTab('items')} className={`flex-1 py-1 text-sm font-semibold rounded-t-md transition-colors ${activeTab === 'items' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Items</button>
                <button onClick={() => setActiveTab('teleport')} className={`flex-1 py-1 text-sm font-semibold rounded-t-md transition-colors ${activeTab === 'teleport' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Teleport</button>
            </div>
            <div className="flex-grow min-h-0 overflow-y-auto">
                {activeTab === 'cheats' && <CheatsComponent {...otherProps} />}
                {activeTab === 'items' && <ItemSpawnerComponent inv={inv} setTooltip={setTooltip} />}
                {activeTab === 'teleport' && <TeleportComponent onForcedNavigate={props.onForcedNavigate} />}
            </div>
        </div>
    );
};

export default DevPanel;
