import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useUIState } from './useUIState';
import { REGIONS } from '../constants';
import { POIS } from '../data/pois';
import { POI, Region } from '../types';

// Import all POI file objects for the map manager
import { banditHideoutPois } from '../data/pois/bandit_hideout';
import { crystallineIslesPois } from '../data/pois/crystalline_isles';
import { goblinDungeonPois } from '../data/pois/dungeon_goblin';
import { sunkenLabyrinthPois } from '../data/pois/dungeon_sunken_labyrinth';
import { dwarvenOutpostPois } from '../data/pois/dwarven_outpost';
import { saltFlatsPois } from '../data/pois/salt_flats';
import { galeSweptPeaksPois } from '../data/pois/gale_swept_peaks';
import { isleOfWhispersPois } from '../data/pois/isle_of_whispers';
import { meadowdalePois } from '../data/pois/meadowdale';
import { minePois } from '../data/pois/mines';
import { oakhavenPois } from '../data/pois/oakhaven';
import { oakhavenRoadPois } from '../data/pois/oakhaven_road';
import { silverhavenPois } from '../data/pois/silverhaven';
import { southernRoadPois } from '../data/pois/southern_road';
import { sunkenLandsPois } from '../data/pois/sunken_lands';
import { theFeywoodPois } from '../data/pois/the_feywood';
import { theSerpentsCoilPois } from '../data/pois/the_serpents_coil';
import { theVerdantFieldsPois } from '../data/pois/the_verdant_fields';
import { tutorialZonePois } from '../data/pois/tutorial_zone';
import { wildernessPois } from '../data/pois/wilderness';

interface DevModeDependencies {
    initialState: any;
    devModeOverride?: boolean;
    isInCombat: boolean;
    ui: ReturnType<typeof useUIState>;
    addLog: (message: string) => void;
}

export const useDevMode = (deps: DevModeDependencies) => {
    const { initialState, devModeOverride = false, isInCombat, ui, addLog } = deps;

    const isDevMode = (initialState.username === 'DevKoala') || devModeOverride;

    const [combatSpeedMultiplier, setCombatSpeedMultiplier] = useState(1);
    const [isInstantRespawnOn, setIsInstantRespawnOn] = useState(false);
    const [instantRespawnCounter, setInstantRespawnCounter] = useState<number | null>(null);
    const [configAggroIds, setConfigAggroIds] = useState<string[]>([]);
    const [isPlayerInvisible, setIsPlayerInvisible] = useState(false);
    const [isAutoBankOn, setIsAutoBankOn] = useState(false);
    const [isTouchSimulationEnabled, setIsTouchSimulationEnabled] = useState(false);
    const [isMapManagerEnabled, setIsMapManagerEnabled] = useState(false);
    const [showAllPois, setShowAllPois] = useState(false);
    const [xpMultiplier, setXpMultiplier] = useState(10);
    const [isXpBoostEnabled, setIsXpBoostEnabled] = useState(false);
    
    const [devPanelState, setDevPanelState] = useState({
        activeTab: 'cheats' as 'cheats' | 'items' | 'teleport' | 'woodcutting',
        itemSearchTerm: '',
        selectedItemId: null as string | null,
        spawnQuantity: 1,
        teleportRegionId: '',
        teleportPoiId: '',
        skillToSet: '' as any | '',
        levelToSet: 1,
        coinAmount: 1000000,
        wcTestLevel: 1,
        wcTestTreeId: null as string | null,
    });

    const [poiCoordinates, setPoiCoordinates] = useState(() => 
        Object.fromEntries(Object.values(POIS).map((p: POI) => [p.id, { x: p.x, y: p.y }]))
    );
    const [regionCoordinates, setRegionCoordinates] = useState(() =>
        Object.fromEntries(Object.values(REGIONS).map((r: Region) => [r.id, { x: r.x, y: r.y }]))
    );
    const [poiConnections, setPoiConnections] = useState(() => Object.fromEntries(Object.values(POIS).map((p: POI) => [p.id, [...p.connections]])));
    const [modifiedPois, setModifiedPois] = useState<Set<string>>(new Set());
    const [modifiedRegions, setModifiedRegions] = useState<Set<string>>(new Set());

    const latestPoiCoordsRef = useRef(poiCoordinates);
    const latestRegionCoordsRef = useRef(regionCoordinates);
    const latestPoiConnectionsRef = useRef(poiConnections);

    useEffect(() => { latestPoiCoordsRef.current = poiCoordinates; }, [poiCoordinates]);
    useEffect(() => { latestRegionCoordsRef.current = regionCoordinates; }, [regionCoordinates]);
    useEffect(() => { latestPoiConnectionsRef.current = poiConnections; }, [poiConnections]);

    const updateDevPanelState = useCallback((updates: Partial<typeof devPanelState>) => {
        setDevPanelState(prev => ({ ...prev, ...updates }));
    }, []);

    const onToggleAggro = useCallback(() => {
        if (!isInCombat) return;
        const currentInstanceId = ui.combatQueue[0];
        setConfigAggroIds(prev => {
            if (prev.includes(currentInstanceId)) {
                addLog(`System: Permanent aggro disabled for current monster.`);
                return prev.filter(id => id !== currentInstanceId);
            } else {
                addLog(`System: Permanent aggro enabled for current monster.`);
                return [...prev, currentInstanceId];
            }
        });
    }, [isInCombat, ui.combatQueue, addLog]);

    const onToggleTouchSimulation = useCallback(() => setIsTouchSimulationEnabled(prev => !prev), []);

    const onToggleMapManager = useCallback((enable: boolean) => {
        setIsMapManagerEnabled(enable);
        ui.setIsExpandedMapViewOpen(enable);
        if(!enable) {
             setModifiedPois(new Set());
             setModifiedRegions(new Set());
        }
    }, [ui]);

    const handleUpdatePoiCoordinate = (id: string, x: number, y: number, isRegion: boolean) => {
        if (isRegion) {
            setRegionCoordinates(coords => ({ ...coords, [id]: { x, y } }));
            setModifiedRegions(prev => { const newSet = new Set(prev); newSet.add(id); return newSet; });
        } else {
            setPoiCoordinates(coords => ({ ...coords, [id]: { x, y } }));
            setModifiedPois(prev => { const newSet = new Set(prev); newSet.add(id); return newSet; });
        }
    };

    const handleUpdatePoiConnections = (poiId: string, newConnections: string[]) => {
        setPoiConnections(prev => ({ ...prev, [poiId]: newConnections }));
        setModifiedPois(prev => { const newSet = new Set(prev); newSet.add(poiId); return newSet; });
    };
    
    const handleCommitMapChanges = useCallback(async () => {
        if (modifiedPois.size === 0 && modifiedRegions.size === 0) {
            addLog("No map changes to commit.");
            return;
        }
    
        const allPoiFileObjects = {
            'data/pois/bandit_hideout.ts': banditHideoutPois,
            'data/pois/crystalline_isles.ts': crystallineIslesPois,
            'data/pois/dungeon_goblin.ts': goblinDungeonPois,
            'data/pois/dungeon_sunken_labyrinth.ts': sunkenLabyrinthPois,
            'data/pois/dwarven_outpost.ts': dwarvenOutpostPois,
            'data/pois/gale_swept_peaks.ts': galeSweptPeaksPois,
            'data/pois/isle_of_whispers.ts': isleOfWhispersPois,
            'data/pois/meadowdale.ts': meadowdalePois,
            'data/pois/mines.ts': minePois,
            'data/pois/oakhaven.ts': oakhavenPois,
            'data/pois/oakhaven_road.ts': oakhavenRoadPois,
            'data/pois/salt_flats.ts': saltFlatsPois,
            'data/pois/silverhaven.ts': silverhavenPois, 
            'data/pois/southern_road.ts': southernRoadPois, 
            'data/pois/sunken_lands.ts': sunkenLandsPois, 
            'data/pois/the_feywood.ts': theFeywoodPois, 
            'data/pois/the_serpents_coil.ts': theSerpentsCoilPois, 
            'data/pois/the_verdant_fields.ts': theVerdantFieldsPois, 
            'data/pois/tutorial_zone.ts': tutorialZonePois, 
            'data/pois/wilderness.ts': wildernessPois,
        };
    
        const poiFileMap: Record<string, string> = {};
        for (const [filePath, poiRecord] of Object.entries(allPoiFileObjects)) {
            Object.keys(poiRecord).forEach(poiId => { poiFileMap[poiId] = filePath; });
        }
    
        const changesByFile: Record<string, { id: string, x?: number, y?: number, connections?: string[] }[]> = {};
        const currentPoiCoords = latestPoiCoordsRef.current;
        const currentRegionCoords = latestRegionCoordsRef.current;
        const currentConnections = latestPoiConnectionsRef.current;
    
        modifiedPois.forEach(poiId => {
            const filePath = poiFileMap[poiId];
            if (!filePath) { console.warn(`Could not find file path for POI ID: ${poiId}`); return; }
            if (!changesByFile[filePath]) changesByFile[filePath] = [];
            
            const existingChange = changesByFile[filePath].find(c => c.id === poiId);
            const coords = currentPoiCoords[poiId];
            const conns = currentConnections[poiId];

            if (existingChange) {
                existingChange.x = coords.x;
                existingChange.y = coords.y;
                existingChange.connections = conns;
            } else {
                changesByFile[filePath].push({ id: poiId, ...coords, connections: conns });
            }
        });
    
        modifiedRegions.forEach(regionId => {
            const filePath = 'data/regions.ts';
            if (!changesByFile[filePath]) changesByFile[filePath] = [];
            changesByFile[filePath].push({ id: regionId, ...currentRegionCoords[regionId] });
        });
    
        let generatedCodeBlocks: string[] = [];
    
        for (const filePath of Object.keys(changesByFile).sort()) {
            try {
                const response = await fetch(`/${filePath}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                let fileContent = await response.text();
    
                changesByFile[filePath].forEach(change => {
                    const keyRegex = new RegExp(`(\\b${change.id}\\b\\s*:\\s*\\{)`);
                    const match = fileContent.match(keyRegex);
                    
                    if (!match || typeof match.index === 'undefined') {
                        console.warn(`Could not find key '${change.id}' in ${filePath}`);
                        return;
                    }
                    
                    const blockStartIndex = match.index;
                    let braceDepth = 0;
                    let objectStartIndex = -1;
                    for (let i = blockStartIndex; i < fileContent.length; i++) {
                        if (fileContent[i] === '{') {
                            if (braceDepth === 0) objectStartIndex = i;
                            braceDepth++;
                        }
                        if (fileContent[i] === '}') {
                            braceDepth--;
                            if (braceDepth === 0) {
                                const objectEndIndex = i + 1;
                                const originalBlock = fileContent.substring(blockStartIndex, objectEndIndex);
                                
                                let updatedBlock = originalBlock;
                                if (change.x !== undefined && change.y !== undefined) {
                                    updatedBlock = updatedBlock
                                        .replace(/(\bx\s*:\s*)\d+/, `$1${change.x}`)
                                        .replace(/(\by\s*:\s*)\d+/, `$1${change.y}`);
                                }

                                if (change.connections) {
                                    const newConnectionsString = change.connections.map(c => `'${c}'`).join(', ');
                                    const connectionsRegex = /(connections\s*:\s*\[)([^\]]*)(\])/;
                                    if (connectionsRegex.test(updatedBlock)) {
                                        updatedBlock = updatedBlock.replace(connectionsRegex, `$1${newConnectionsString}$3`);
                                    }
                                }
                                
                                fileContent = fileContent.substring(0, blockStartIndex) + updatedBlock + fileContent.substring(objectEndIndex);
                                return;
                            }
                        }
                    }
                });
                
                generatedCodeBlocks.push(`\n${fileContent}`);
    
            } catch (error) {
                console.error(`Failed to process file ${filePath}:`, error);
                addLog(`Error: Could not process changes for ${filePath}.`);
            }
        }
        
        const finalCode = generatedCodeBlocks.join('\n\n');
    
        if (finalCode) {
            ui.setExportData({
                data: finalCode,
                title: "Commit Map Changes",
                copyButtonText: "Copy & Commit",
                onCopy: () => {
                    setModifiedPois(new Set());
                    setModifiedRegions(new Set());
                    addLog("Map changes committed & copied. Changes have been cleared.");
                }
            });
            addLog("Generated code for map changes. Copying to clipboard will commit changes.");
        } else {
            addLog("Could not generate code for map changes. Check console for errors.");
            setModifiedPois(new Set());
            setModifiedRegions(new Set());
        }
    }, [modifiedPois, modifiedRegions, addLog, ui]);

    return {
        isDevMode,
        combatSpeedMultiplier, setCombatSpeedMultiplier,
        isInstantRespawnOn, setIsInstantRespawnOn,
        instantRespawnCounter, setInstantRespawnCounter,
        configAggroIds,
        isPlayerInvisible, setIsPlayerInvisible,
        isAutoBankOn, setIsAutoBankOn,
        isTouchSimulationEnabled, onToggleTouchSimulation,
        isMapManagerEnabled, onToggleMapManager,
        showAllPois, setShowAllPois,
        xpMultiplier, setXpMultiplier,
        isXpBoostEnabled, setIsXpBoostEnabled,
        devPanelState, updateDevPanelState,
        poiCoordinates, regionCoordinates, poiConnections,
        modifiedPois, modifiedRegions,
        handleUpdatePoiCoordinate,
        handleUpdatePoiConnections,
        handleCommitMapChanges,
        onToggleAggro,
        isCurrentMonsterAggro: isInCombat && ui.combatQueue.length > 0 && configAggroIds.includes(ui.combatQueue[0]),
    };
};