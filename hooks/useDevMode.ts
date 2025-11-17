
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useUIState } from './useUIState';
import { REGIONS, MONSTERS } from '../constants';
import { POIS } from '../data/pois';
import { POI, Region, Monster, MonsterType, SkillName, SpellElement, PlayerType } from '../types';

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
import { magusSpirePois } from '../data/pois/dungeon_magus_spire';
import { chasmOfWoePois } from '../data/pois/dungeon_chasm_of_woe';
import { pilferingPois } from '../data/pois/pilfering';
import { fouthiaPois } from '../data/pois/fouthia';
import { futureZonePois } from '../data/pois/future_zones';


// Import all monster file objects for the monster editor
import { beasts } from '../constants/monsters/beasts';
import { humanoids } from '../constants/monsters/humanoids';
import { dragons } from '../constants/monsters/dragons';
import { undead } from '../constants/monsters/undead';
import { elemental } from '../constants/monsters/elemental';
import { demon } from '../constants/monsters/demon';
import { armored } from '../constants/monsters/armored';
import { vampire } from '../constants/monsters/vampire';


interface DevModeDependencies {
    initialState: any;
    devModeOverride?: boolean;
    isInCombat: boolean;
    ui: ReturnType<typeof useUIState>;
    addLog: (message: string) => void;
    // Persisted dev settings state
    xpMultiplier: number;
    setXpMultiplier: (multiplier: number) => void;
    combatSpeedMultiplier: number;
    setCombatSpeedMultiplier: (speed: number) => void;
    isPlayerInvisible: boolean;
    setIsPlayerInvisible: (isInvisible: boolean) => void;
    isAutoBankOn: boolean;
    setIsAutoBankOn: (isOn: boolean) => void;
    isGodModeOn: boolean;
    setIsGodModeOn: (isOn: boolean) => void;
}

// Helper to format an object into a single line string.
const formatObjectToOneLine = (obj: any): string => {
    if (obj === null) return 'null';
    if (typeof obj !== 'object') {
        if (typeof obj === 'string') return `'${obj.replace(/'/g, "\\'")}'`;
        return String(obj);
    }

    if (Array.isArray(obj)) {
        return `[${obj.map(formatObjectToOneLine).join(', ')}]`;
    }

    const entries = Object.entries(obj).map(([key, value]) => {
        let formattedValue;
        if (key === 'skill' && typeof value === 'string') {
            formattedValue = `SkillName.${value}`;
        } else {
            formattedValue = formatObjectToOneLine(value);
        }
        return `${key}: ${formattedValue}`;
    });
    return `{ ${entries.join(', ')} }`;
};


const formatObjectToCodeString = (obj: any): string => {
  const formatValue = (value: any, level: number, key?: string): string => {
    const indent = ' '.repeat(level * 4);
    const closingIndent = ' '.repeat((level - 1) * 4);

    if (key === 'skill' && typeof value === 'string') {
      return `SkillName.${value}`;
    }

    switch (typeof value) {
      case 'string':
        return `'${value.replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
      case 'number':
      case 'boolean':
        return String(value);
      case 'object':
        if (value === null) return 'null';
        
        if (Array.isArray(value)) {
          if (value.length === 0) return '[]';
          
          if (key === 'activities') {
              return `[\n${value.map(v => `${indent}${formatObjectToOneLine(v)}`).join(',\n')}\n${closingIndent}]`;
          }

          if (value.every(item => typeof item === 'string')) {
            return `[${value.map(v => `'${v}'`).join(', ')}]`;
          }

          return `[\n${value.map(v => `${indent}${formatValue(v, level + 1)}`).join(',\n')}\n${closingIndent}]`;
        }

        const keys = Object.keys(value);
        if (keys.length === 0) return '{}';
        
        const entries = keys.map(k => {
          return `${indent}${k}: ${formatValue(value[k], level + 1, k)}`;
        }).join(',\n');
        return `{\n${entries}\n${closingIndent}}`;
      default:
        return String(value);
    }
  };

  return formatValue(obj, 1);
};

const getVariableNameFromFilePath = (filePath: string): string => {
    // e.g. data/pois/dungeon_chasm_of_woe.ts
    let baseName = filePath.split('/').pop()!.replace('.ts', ''); // dungeon_chasm_of_woe

    // Remove known prefixes
    const prefixes = ['dungeon_', 'region_'];
    for (const prefix of prefixes) {
        if (baseName.startsWith(prefix)) {
            baseName = baseName.substring(prefix.length); // chasm_of_woe
            break; 
        }
    }
    
    // Convert snake_case to camelCase
    const camelCaseName = baseName.replace(/_([a-z0-9])/g, g => g[1].toUpperCase()); // chasmOfWoe

    return `${camelCaseName}Pois`; // chasmOfWoePois
};


export const useDevMode = (deps: DevModeDependencies) => {
    const { 
        initialState, devModeOverride = false, isInCombat, ui, addLog,
        xpMultiplier, setXpMultiplier,
        combatSpeedMultiplier, setCombatSpeedMultiplier, isPlayerInvisible, setIsPlayerInvisible,
        isAutoBankOn, setIsAutoBankOn, isGodModeOn, setIsGodModeOn
    } = deps;

    const isDevMode = (initialState.username === 'DevKoala') || devModeOverride;

    // Session-based dev settings
    const [isInstantRespawnOn, setIsInstantRespawnOn] = useState(false);
    const [instantRespawnCounter, setInstantRespawnCounter] = useState<number | null>(null);
    const [configAggroIds, setConfigAggroIds] = useState<string[]>([]);
    const [isTouchSimulationEnabled, setIsTouchSimulationEnabled] = useState(false);
    const [isMapManagerEnabled, setIsMapManagerEnabled] = useState(false);
    const [showAllPois, setShowAllPois] = useState(false);
    
    const [devPanelState, setDevPanelState] = useState({
        activeTab: 'cheats' as 'cheats' | 'items' | 'teleport' | 'game-manager' | 'monsters',
        itemSearchTerm: '',
        selectedItemId: null as string | null,
        spawnQuantity: 1,
        teleportRegionId: 'silverhaven',
        teleportPoiId: 'silverhaven_square',
        skillToSet: '' as any | '',
        levelToSet: 1,
        coinAmount: 1000000,
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

    const [monsterData, setMonsterData] = useState<Record<string, Monster>>(() => JSON.parse(JSON.stringify(MONSTERS)));
    const [modifiedMonsters, setModifiedMonsters] = useState<Set<string>>(new Set());
    const latestMonsterDataRef = useRef(monsterData);

    const latestPoiCoordsRef = useRef(poiCoordinates);
    const latestRegionCoordsRef = useRef(regionCoordinates);
    const latestPoiConnectionsRef = useRef(poiConnections);

    useEffect(() => { latestPoiCoordsRef.current = poiCoordinates; }, [poiCoordinates]);
    useEffect(() => { latestRegionCoordsRef.current = regionCoordinates; }, [regionCoordinates]);
    useEffect(() => { latestPoiConnectionsRef.current = poiConnections; }, [poiConnections]);
    useEffect(() => { latestMonsterDataRef.current = monsterData; }, [monsterData]);

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
        if (modifiedPois.size === 0 && modifiedRegions.size === 0 && modifiedMonsters.size === 0) {
            addLog("No changes to commit.");
            return;
        }

        const allPoiFileObjects = {
            'data/pois/bandit_hideout.ts': banditHideoutPois, 'data/pois/crystalline_isles.ts': crystallineIslesPois,
            'data/pois/dungeon_goblin.ts': goblinDungeonPois, 'data/pois/dungeon_sunken_labyrinth.ts': sunkenLabyrinthPois,
            'data/pois/dwarven_outpost.ts': dwarvenOutpostPois, 'data/pois/gale_swept_peaks.ts': galeSweptPeaksPois,
            'data/pois/isle_of_whispers.ts': isleOfWhispersPois, 'data/pois/meadowdale.ts': meadowdalePois,
            'data/pois/mines.ts': minePois, 'data/pois/oakhaven.ts': oakhavenPois,
            'data/pois/oakhaven_road.ts': oakhavenRoadPois, 'data/pois/salt_flats.ts': saltFlatsPois,
            'data/pois/silverhaven.ts': silverhavenPois, 'data/pois/southern_road.ts': southernRoadPois,
            'data/pois/sunken_lands.ts': sunkenLandsPois, 'data/pois/the_feywood.ts': theFeywoodPois,
            'data/pois/the_serpents_coil.ts': theSerpentsCoilPois, 'data/pois/the_verdant_fields.ts': theVerdantFieldsPois,
            'data/pois/tutorial_zone.ts': tutorialZonePois, 'data/pois/wilderness.ts': wildernessPois,
            'data/pois/dungeon_magus_spire.ts': magusSpirePois, 'data/pois/dungeon_chasm_of_woe.ts': chasmOfWoePois,
            'data/pois/pilfering.ts': pilferingPois, 'data/pois/fouthia.ts': fouthiaPois, 'data/pois/future_zones.ts': futureZonePois,
        };

        const allMonsterFileObjects = {
            'constants/monsters/beasts.ts': beasts, 'constants/monsters/humanoids.ts': humanoids,
            'constants/monsters/dragons.ts': dragons, 'constants/monsters/undead.ts': undead,
            'constants/monsters/elemental.ts': elemental, 'constants/monsters/demon.ts': demon,
            'constants/monsters/armored.ts': armored, 'constants/monsters/vampire.ts': vampire
        };
    
        const poiFileMap: Record<string, string> = {};
        for (const [filePath, poiRecord] of Object.entries(allPoiFileObjects)) {
            Object.keys(poiRecord).forEach(poiId => { poiFileMap[poiId] = filePath; });
        }
    
        const monsterFileMap: Record<string, string> = {};
        for (const [filePath, monsterArray] of Object.entries(allMonsterFileObjects)) {
            monsterArray.forEach(monster => { monsterFileMap[monster.id] = filePath; });
        }
    
        const newCodeBlocks: { filePath: string; content: string }[] = [];
        
        // --- POI CHANGES ---
        const modifiedPoiFiles = new Map<string, string[]>();
        modifiedPois.forEach(poiId => {
            const filePath = poiFileMap[poiId];
            if (!filePath) return;
            if (!modifiedPoiFiles.has(filePath)) {
                modifiedPoiFiles.set(filePath, []);
            }
            modifiedPoiFiles.get(filePath)!.push(poiId);
        });

        modifiedPoiFiles.forEach((poiIds, filePath) => {
            const originalFileObject = allPoiFileObjects[filePath as keyof typeof allPoiFileObjects];
            if (!originalFileObject) return;

            const updatedFileObject = JSON.parse(JSON.stringify(originalFileObject));

            poiIds.forEach(poiId => {
                const originalPoi = POIS[poiId];
                if (!originalPoi) return;

                const newCoords = latestPoiCoordsRef.current[poiId];
                const newConns = latestPoiConnectionsRef.current[poiId];
                
                const finalPoi: POI = {
                    ...originalPoi,
                    x: newCoords.x,
                    y: newCoords.y,
                    connections: newConns,
                };

                const cleanPoi = JSON.parse(JSON.stringify(finalPoi, (key, value) => {
                    if (
                        (value === null || value === undefined) ||
                        (key !== 'activities' && Array.isArray(value) && value.length === 0) ||
                        (key !== 'activities' && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
                    ) {
                       return undefined;
                   }
                   return value;
                }));

                if (!cleanPoi.hasOwnProperty('activities')) {
                    cleanPoi.activities = [];
                }

                updatedFileObject[poiId] = cleanPoi;
            });

            const variableName = getVariableNameFromFilePath(filePath);
            
            const needsToolType = Object.values(updatedFileObject).some((poi: any) => poi.activities.some((act: any) => act.requiredTool));
            
            let finalImports = `import { POI, SkillName${needsToolType ? ', ToolType' : ''} } from '../../types';\n`;

            if (filePath === 'data/pois/meadowdale.ts' || filePath === 'data/pois/oakhaven.ts') {
                finalImports += `import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';\n`;
            }
            if (filePath === 'data/pois/fouthia.ts') {
                finalImports += `import { CIVILLIAN_DIALOGUE, BANKER_ZAHRA_DIALOGUE, BARKEEP_ZALE_DIALOGUE, KHALID_DIALOGUE, ZAFIRA_DIALOGUE, CAPTAIN_OMAR_DIALOGUE } from '../../constants/dialogue';\n`;
            }

            let fileContent = finalImports + `\nexport const ${variableName}: Record<string, POI> = {\n`;

            const sortedIds = Object.keys(updatedFileObject).sort();
            
            sortedIds.forEach((poiId, index) => {
                const poiData = updatedFileObject[poiId];
                const formattedPoi = formatObjectToCodeString(poiData);
                fileContent += `    ${poiId}: ${formattedPoi}${index < sortedIds.length - 1 ? ',' : ''}\n`;
            });

            fileContent += '};';
            
            newCodeBlocks.push({ filePath, content: fileContent });
        });

        // --- REGION CHANGES ---
        if (modifiedRegions.size > 0) {
            const updatedRegions = { ...REGIONS };
            modifiedRegions.forEach(regionId => {
                const newCoords = latestRegionCoordsRef.current[regionId];
                if (updatedRegions[regionId]) {
                    updatedRegions[regionId] = { ...updatedRegions[regionId], x: newCoords.x, y: newCoords.y };
                }
            });
            let fileContent = `import { Region } from '../types';\n\nexport const REGIONS: Record<string, Region> = {\n`;
            const sortedRegionIds = Object.keys(updatedRegions).sort();
            sortedRegionIds.forEach((regionId, index) => {
                const regionData = updatedRegions[regionId];
                fileContent += `    ${regionId}: ${JSON.stringify(regionData, null, 4).replace(/"([^"]+)":/g, '$1:')}${index < sortedRegionIds.length - 1 ? ',' : ''}\n`;
            });
            fileContent += '};';
            newCodeBlocks.push({ filePath: `data/regions.ts`, content: fileContent });
        }

        // --- MONSTER CHANGES ---
        if (modifiedMonsters.size > 0) {
            const filesToUpdate = new Map<string, { updatedArray: Monster[], isModified: boolean }>();
            Object.entries(allMonsterFileObjects).forEach(([path, arr]) => {
                filesToUpdate.set(path, { updatedArray: JSON.parse(JSON.stringify(arr)), isModified: false });
            });

            modifiedMonsters.forEach(monsterId => {
                const updatedMonsterData = latestMonsterDataRef.current[monsterId];
                const filePath = monsterFileMap[monsterId];

                if (filePath) { // Existing monster
                    const fileData = filesToUpdate.get(filePath);
                    if (fileData) {
                        const index = fileData.updatedArray.findIndex(m => m.id === monsterId);
                        if (index > -1) {
                            fileData.updatedArray[index] = updatedMonsterData;
                            fileData.isModified = true;
                        }
                    }
                } else { // New monster
                    let suggestedPath = 'constants/monsters/beasts.ts';
                    const type = updatedMonsterData.types[0];
                    if (type === MonsterType.Humanoid) suggestedPath = 'constants/monsters/humanoids.ts';
                    else if (type === MonsterType.Dragon) suggestedPath = 'constants/monsters/dragons.ts';
                    else if (type === MonsterType.Undead || type === MonsterType.Elemental) suggestedPath = 'constants/monsters/magicalAndUndead.ts';
                    else if (type === MonsterType.Armored) suggestedPath = 'constants/monsters/armored.ts';
                    else if (type === MonsterType.Vampire) suggestedPath = 'constants/monsters/vampire.ts';
                    else if (type === MonsterType.Demon) suggestedPath = 'constants/monsters/demon.ts';
                    
                    const fileData = filesToUpdate.get(suggestedPath);
                    if (fileData) {
                        fileData.updatedArray.push(updatedMonsterData);
                        fileData.isModified = true;
                    }
                }
            });

            filesToUpdate.forEach((fileData, filePath) => {
                if (fileData.isModified) {
                    fileData.updatedArray.sort((a, b) => a.name.localeCompare(b.name));
                    const variableName = filePath.split('/').pop()!.replace('.ts', '');
                    const imports = `import { Monster, MonsterType, SkillName, SpellElement } from '@/types';\n\n`;
                    let fileContent = imports + `export const ${variableName}: Monster[] = [\n`;
                    const formattedMonsters = fileData.updatedArray.map(monster => {
                        const cleanMonster = JSON.parse(JSON.stringify(monster, (key, value) => (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) ? undefined : value));
                        return '    ' + formatObjectToCodeString(cleanMonster);
                    }).join(',\n');
                    fileContent += formattedMonsters + '\n];';
                    newCodeBlocks.push({ filePath, content: fileContent });
                }
            });
        }
    
        if (newCodeBlocks.length > 0) {
            ui.setExportData({
                data: newCodeBlocks,
                title: "Commit Map & Monster Changes",
                copyButtonText: 'Copy All',
                onCopy: () => {
                    const allContent = newCodeBlocks.map(block => `--- START OF FILE ${block.filePath} ---\n\n${block.content}\n\n--- END OF FILE ${block.filePath} ---`).join('\n\n');
                    navigator.clipboard.writeText(allContent);
                },
                onClose: () => {
                    setModifiedPois(new Set());
                    setModifiedRegions(new Set());
                    setModifiedMonsters(new Set());
                    addLog("Changes have been cleared from this session.");
                    ui.closeExportModal();
                }
            });
        } else {
            addLog("No changes to commit.");
        }
    }, [modifiedPois, modifiedRegions, modifiedMonsters, addLog, ui, latestPoiCoordsRef, latestRegionCoordsRef, latestPoiConnectionsRef, latestMonsterDataRef]);

    return {
        isDevMode,
        // Persisted state
        xpMultiplier, setXpMultiplier,
        combatSpeedMultiplier, setCombatSpeedMultiplier,
        isPlayerInvisible, setIsPlayerInvisible,
        isAutoBankOn, setIsAutoBankOn,
        isGodModeOn, setIsGodModeOn,
        // Session state
        isInstantRespawnOn, setIsInstantRespawnOn,
        instantRespawnCounter, setInstantRespawnCounter,
        configAggroIds,
        isTouchSimulationEnabled, onToggleTouchSimulation,
        isMapManagerEnabled, onToggleMapManager,
        showAllPois, setShowAllPois,
        // Dev Panel UI state
        devPanelState, updateDevPanelState,
        // Map Manager state
        poiCoordinates, regionCoordinates, poiConnections,
        modifiedPois, modifiedRegions,
        handleUpdatePoiCoordinate,
        handleUpdatePoiConnections,
        handleCommitMapChanges,
        // Other logic
        onToggleAggro,
        isCurrentMonsterAggro: isInCombat && ui.combatQueue.length > 0 && configAggroIds.includes(ui.combatQueue[0]),
        // Monster DB state
        monsterData, setMonsterData, modifiedMonsters, setModifiedMonsters,
    };
};
