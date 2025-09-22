
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { QUESTS, REGIONS, SHOPS, TUTORIAL_SCRIPT, ITEMS } from '../../constants';
import { CombatStance, PlayerSlayerTask, ShopStates, SkillName, POIActivity, InventorySlot, ActivePanel, Item, Region, POI, WorldState, GroundItem, Spell } from '../../types';
import { useActivityLog } from '../../hooks/useActivityLog';
import { useCharacter } from '../../hooks/useCharacter';
import { useInventory } from '../../hooks/useInventory';
import { useQuests } from '../../hooks/useQuests';
import { useSaveGame } from '../../hooks/useSaveGame';
import { useUIState } from '../../hooks/useUIState';
import { useGameSession } from '../../hooks/useGameSession';
import { useRepeatableQuests } from '../../hooks/useRepeatableQuests';
import { useAggression } from '../../hooks/useAggression';
import { useShops } from '../../hooks/useShops';
import { useSkilling } from '../../hooks/useSkilling';
import { useBank, padBank } from '../../hooks/useBank';
import { useInteractQuest } from '../../hooks/useInteractQuest';
import { useSlayer } from '../../hooks/useSlayer';
import { useQuestLogic } from '../../hooks/useQuestLogic';
import { useCrafting } from '../../hooks/useCrafting';
import { useItemActions } from '../../hooks/useItemActions';
import { useWorldActions } from '../../hooks/useWorldActions';
import { useNavigation } from '../../hooks/useNavigation';
import { usePlayerDeath } from '../../hooks/usePlayerDeath';
import { useKillHandler } from '../../hooks/useKillHandler';
import SidePanel from './SidePanel';
import ActivityLog from '../game/ActivityLog';
import XpTracker, { XpDrop } from '../ui/XpTracker';
import MainViewController from '../game/MainViewController';
import QuestDetailView from '../views/overlays/QuestDetailView';
import AtlasView from '../views/AtlasView';
import ExpandedMapView from '../views/ExpandedMapView';
import TutorialOverlay from './TutorialOverlay';
import LevelUpAnimation from './LevelUpAnimation';
import Button from '../common/Button';
import DialogueOverlay from './dialogue/DialogueOverlay';
import ShopView from '../views/ShopView';

// Import all POI file objects for the map manager
import { banditHideoutPois } from '../../data/pois/bandit_hideout';
import { crystallineIslesPois } from '../../data/pois/crystalline_isles';
import { goblinDungeonPois } from '../../data/pois/dungeon_goblin';
import { sunkenLabyrinthPois } from '../../data/pois/dungeon_sunken_labyrinth';
import { dwarvenOutpostPois } from '../../data/pois/dwarven_outpost';
import { saltFlatsPois } from '../../data/pois/salt_flats';
import { galeSweptPeaksPois } from '../../data/pois/gale_swept_peaks';
import { isleOfWhispersPois } from '../../data/pois/isle_of_whispers';
import { meadowdalePois } from '../../data/pois/meadowdale';
import { minePois } from '../../data/pois/mines';
import { oakhavenPois } from '../../data/pois/oakhaven';
import { oakhavenRoadPois } from '../../data/pois/oakhaven_road';
import { silverhavenPois } from '../../data/pois/silverhaven';
import { southernRoadPois } from '../../data/pois/southern_road';
import { sunkenLandsPois } from '../../data/pois/sunken_lands';
import { theFeywoodPois } from '../../data/pois/the_feywood';
import { theSerpentsCoilPois } from '../../data/pois/the_serpents_coil';
import { theVerdantFieldsPois } from '../../data/pois/the_verdant_fields';
import { tutorialZonePois } from '../../data/pois/tutorial_zone';
import { wildernessPois } from '../../data/pois/wilderness';
import { POIS } from '../../data/pois';


interface GameProps {
    initialState: any;
    onExportGame: (gameState: object) => void;
    onImportGame: () => void;
    onResetGame: () => void;
    ui: ReturnType<typeof useUIState>;
    devModeOverride?: boolean;
}

const isPlayerInTutorialZone = (poiId: string) => poiId.startsWith('enclave_');

const Game: React.FC<GameProps> = ({ initialState, onExportGame, onImportGame, onResetGame, ui, devModeOverride = false }) => {
    const [tutorialStage, setTutorialStage] = useState(() => {
        if (initialState.tutorialStage >= 0 && !isPlayerInTutorialZone(initialState.currentPoiId)) {
            return -1;
        }
        return initialState.tutorialStage;
    });
    
    const [unlockedHudButtons, setUnlockedHudButtons] = useState<string[]>([]);
    const [tutorialOverrideText, setTutorialOverrideText] = useState<string | null>(null);
    const [activeCombatStyleHighlight, setActiveCombatStyleHighlight] = useState<CombatStance | null>(null);
    const session = useGameSession(initialState.currentPoiId);
    const { activityLog, addLog: originalAddLog } = useActivityLog([]);
    const [tutorialLogMessage, setTutorialLogMessage] = useState<string | null>(null);

    const addLog = useCallback((message: string) => tutorialStage >= 0 ? setTutorialLogMessage(message) : originalAddLog(message), [tutorialStage, originalAddLog]);

    const isInCombat = ui.combatQueue.length > 0;
    const tutorialRewardsGiven = useRef<Set<number>>(new Set());

    const [clearedSkillObstacles, setClearedSkillObstacles] = useState(initialState.clearedSkillObstacles);
    const [monsterRespawnTimers, setMonsterRespawnTimers] = useState(initialState.monsterRespawnTimers);
    const [windmillFlour, setWindmillFlour] = useState(initialState.worldState?.windmillFlour ?? 0);
    const [groundItems, setGroundItems] = useState<Record<string, GroundItem[]>>({});
    
    const [combatSpeedMultiplier, setCombatSpeedMultiplier] = useState(1);
    const [isInstantRespawnOn, setIsInstantRespawnOn] = useState(false);
    const [instantRespawnCounter, setInstantRespawnCounter] = useState<number | null>(null);
    const [configAggroIds, setConfigAggroIds] = useState<string[]>([]);
    const [isPlayerInvisible, setIsPlayerInvisible] = useState(false);
    const [isAutoBankOn, setIsAutoBankOn] = useState(false);
    const [isTouchSimulationEnabled, setIsTouchSimulationEnabled] = useState(false);
    const onToggleTouchSimulation = useCallback(() => {
        setIsTouchSimulationEnabled(prev => !prev);
    }, []);
    const [isMapManagerEnabled, setIsMapManagerEnabled] = useState(false);
    const [showAllPois, setShowAllPois] = useState(false);
    const [xpMultiplier, setXpMultiplier] = useState(10);
    const [isXpBoostEnabled, setIsXpBoostEnabled] = useState(false);
    
    // New state for Dev Panel persistence
    const [devPanelState, setDevPanelState] = useState({
        activeTab: 'cheats' as 'cheats' | 'items' | 'teleport',
        itemSearchTerm: '',
        selectedItemId: null as string | null,
        spawnQuantity: 1,
        teleportRegionId: '',
        teleportPoiId: '',
    });

    const updateDevPanelState = useCallback((updates: Partial<typeof devPanelState>) => {
        setDevPanelState(prev => ({ ...prev, ...updates }));
    }, []);

    const isDevMode = (initialState.username === 'DevKoala') || devModeOverride;

    const effectiveXpMultiplier = isDevMode && isXpBoostEnabled ? xpMultiplier : 1;

    const isCurrentMonsterAggro = useMemo(() => {
        if (!isInCombat) return false;
        const currentInstanceId = ui.combatQueue[0];
        return configAggroIds.includes(currentInstanceId);
    }, [isInCombat, configAggroIds, ui.combatQueue]);

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

    const isBusy = !!ui.activeCraftingAction;
    
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

    useEffect(() => {
        latestPoiCoordsRef.current = poiCoordinates;
    }, [poiCoordinates]);

    useEffect(() => {
        latestRegionCoordsRef.current = regionCoordinates;
    }, [regionCoordinates]);

    useEffect(() => {
        latestPoiConnectionsRef.current = poiConnections;
    }, [poiConnections]);


    const handleUpdatePoiCoordinate = (id: string, x: number, y: number, isRegion: boolean) => {
        if (isRegion) {
            setRegionCoordinates(coords => ({ ...coords, [id]: { x, y } }));
            setModifiedRegions(prev => {
                const newSet = new Set(prev);
                newSet.add(id);
                return newSet;
            });
        } else {
            setPoiCoordinates(coords => ({ ...coords, [id]: { x, y } }));
            setModifiedPois(prev => {
                const newSet = new Set(prev);
                newSet.add(id);
                return newSet;
            });
        }
    };

    const handleUpdatePoiConnections = (poiId: string, newConnections: string[]) => {
        setPoiConnections(prev => ({ ...prev, [poiId]: newConnections }));
        setModifiedPois(prev => {
            const newSet = new Set(prev);
            newSet.add(poiId);
            return newSet;
        });
    };
    
    const handleToggleMapManager = (enable: boolean) => {
        setIsMapManagerEnabled(enable);
        ui.setIsExpandedMapViewOpen(enable);
        if(!enable) {
             setModifiedPois(new Set());
             setModifiedRegions(new Set());
        }
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
                
                const header = `**${filePath}**`;
                generatedCodeBlocks.push(`${header}\n\`\`\`typescript\n${fileContent}\n\`\`\``);
    
            } catch (error) {
                console.error(`Failed to process file ${filePath}:`, error);
                addLog(`Error: Could not process changes for ${filePath}.`);
            }
        }
        
        const finalCode = generatedCodeBlocks.join('\n\n');
    
        if (finalCode) {
            ui.setExportData(finalCode);
            addLog("Generated code for map changes. See export window.");
        } else {
            addLog("Could not generate code for map changes. Check console for errors.");
        }
    
        setModifiedPois(new Set());
        setModifiedRegions(new Set());
    }, [modifiedPois, modifiedRegions, addLog, ui]);


    const [xpDrops, setXpDrops] = useState<XpDrop[]>([]);
    const handleXpGain = useCallback((skillName: SkillName, amount: number) => {
      if (amount > 0) setXpDrops(prev => [...prev, { id: Date.now() + Math.random(), skillName, amount }]);
    }, []);
    const removeXpDrop = useCallback((id: number) => setXpDrops(prev => prev.filter(drop => drop.id !== id)), []);

    const [levelUpInfo, setLevelUpInfo] = useState<{ skill: SkillName; level: number } | null>(null);
    const handleLevelUp = useCallback((skill: SkillName, level: number) => {
        setLevelUpInfo({ skill, level });
        const duration = level === 99 ? 8000 : 4000;
        setTimeout(() => setLevelUpInfo(null), duration);
    }, []);
    
    const charInitialData = useMemo(() => ({ skills: initialState.skills, combatStance: initialState.combatStance, currentHp: initialState.currentHp, autocastSpell: initialState.autocastSpell }), [initialState]);
    const memoizedCharCallbacks = useMemo(() => ({ addLog, onXpGain: handleXpGain, onLevelUp: handleLevelUp }), [addLog, handleXpGain, handleLevelUp]);
    const char = useCharacter(charInitialData, memoizedCharCallbacks, isInCombat, combatSpeedMultiplier, effectiveXpMultiplier);
    
    const [bank, setBank] = useState<(InventorySlot | null)[]>(padBank(initialState.bank));
    
    const onItemDropped = useCallback((item: InventorySlot) => {
        const poiId = session.currentPoiId;
        const itemData = ITEMS[item.itemId];
        if (!itemData) return;
    
        setGroundItems(prev => {
            const newItemsForPoi = [...(prev[poiId] || [])];
            
            // Stackable items (naturally stackable or noted)
            if (itemData.stackable || item.noted) {
                const existingStackIndex = newItemsForPoi.findIndex(gi => 
                    gi.item.itemId === item.itemId && 
                    !!gi.item.noted === !!item.noted
                );
                if (existingStackIndex > -1) {
                    newItemsForPoi[existingStackIndex].item.quantity += item.quantity;
                    newItemsForPoi[existingStackIndex].dropTime = Date.now(); // Refresh timer
                } else {
                    newItemsForPoi.push({ item, dropTime: Date.now(), uniqueId: Date.now() + Math.random() });
                }
            } else { // Unstackable, non-noted items
                newItemsForPoi.push({ item, dropTime: Date.now(), uniqueId: Date.now() + Math.random() });
            }
    
            return { ...prev, [poiId]: newItemsForPoi };
        });
    }, [session.currentPoiId]);

    const bankOptions = useMemo(() => ({ isAutoBankOn, bank, setBank, onItemDropped, setCombatStance: char.setCombatStance }), [isAutoBankOn, bank, setBank, onItemDropped, char.setCombatStance]);
    const invInitialData = useMemo(() => ({ inventory: initialState.inventory, coins: initialState.coins, equipment: initialState.equipment }), [initialState]);
    
    const completeTutorialCallbackRef = useRef<(questId: string) => void>(null);

    const completeTutorial = useCallback(() => {
        if (completeTutorialCallbackRef.current) {
            completeTutorialCallbackRef.current('tutorial_completion');
        }
        setTutorialStage(-1);
        session.setCurrentPoiId('meadowdale_square');
        addLog("You have arrived in the main world. Your adventure begins now!");
    }, [addLog, session]);

    const advanceTutorial = useCallback((condition: string) => {
        if (tutorialStage < 0) return;
        const currentStep = TUTORIAL_SCRIPT[tutorialStage];
        if (currentStep && currentStep.completionCondition === condition) {
            const newStage = tutorialStage + 1;
            if (newStage >= TUTORIAL_SCRIPT.length) {
                completeTutorial();
            } else {
                setTutorialStage(newStage);
            }
        }
    }, [tutorialStage, completeTutorial]);

    const inv = useInventory(invInitialData, addLog, advanceTutorial, bankOptions);
    const quests = useQuests({ playerQuests: initialState.playerQuests, lockedPois: initialState.lockedPois });
    
    const questLogic = useQuestLogic({ 
        playerQuests: quests.playerQuests, 
        setPlayerQuests: quests.setPlayerQuests, 
        addLog, 
        modifyItem: inv.modifyItem, 
        addXp: char.addXp, 
        hasItems: inv.hasItems, 
        setLockedPois: quests.setLockedPois, 
        setClearedSkillObstacles 
    });
    
    // Update ref with the latest function so `completeTutorial` can call it.
    useEffect(() => {
        completeTutorialCallbackRef.current = questLogic.completeQuestStage;
    }, [questLogic.completeQuestStage]);


    const slayer = useSlayer(initialState.slayerTask, { addLog, addXp: char.addXp, combatLevel: char.combatLevel, modifyItem: inv.modifyItem });
    const repeatableQuests = useRepeatableQuests(initialState.repeatableQuestsState, addLog, inv, char);
    const bankLogic = useBank({ bank, setBank }, { addLog, ...inv, ...char, setCombatStance: char.setCombatStance });
    const shops = useShops(initialState.shopStates, inv.coins, inv.modifyItem, addLog);

    useEffect(() => {
        if (tutorialStage === 15) {
            const hasCopper = inv.inventory.some(i => i?.itemId === 'copper_ore');
            const hasTin = inv.inventory.some(i => i?.itemId === 'tin_ore');
            if (hasCopper && hasTin) {
                advanceTutorial('mine-ores');
            }
        }
    }, [inv.inventory, tutorialStage, advanceTutorial]);
    
    useEffect(() => { if (tutorialStage >= 0 && ui.activePanel) advanceTutorial(`open-panel:${ui.activePanel}`); }, [ui.activePanel, tutorialStage, advanceTutorial]);
    useEffect(() => { if (tutorialStage >= 0 && session.currentPoiId) advanceTutorial(`move:${session.currentPoiId}`); }, [session.currentPoiId, tutorialStage, advanceTutorial]);
    useEffect(() => {
        if (tutorialStage < 0 || tutorialStage >= TUTORIAL_SCRIPT.length || tutorialRewardsGiven.current.has(tutorialStage)) return;
        const rewards = TUTORIAL_SCRIPT[tutorialStage].rewards;
        if (rewards) {
            rewards.items?.forEach(reward => inv.modifyItem(reward.itemId, reward.quantity, false));
            (rewards as any).xp?.forEach((xpReward: { skill: SkillName, amount: number }) => char.addXp(xpReward.skill, xpReward.amount));
            tutorialRewardsGiven.current.add(tutorialStage);
        }
    }, [tutorialStage, inv.modifyItem, char.addXp, inv]);
    useEffect(() => {
        if (tutorialStage >= 0 && !isPlayerInTutorialZone(session.currentPoiId)) {
            setTutorialStage(-1);
        }
    }, [session.currentPoiId, tutorialStage]);
    useEffect(() => {
        if (tutorialStage < 0 || tutorialStage >= TUTORIAL_SCRIPT.length) { setTutorialOverrideText(null); return; }
        if (tutorialStage === 9 && char.currentHp === char.maxHp) {
            char.setCurrentHp(hp => Math.max(1, hp - 5));
            addLog("Leo gives you a playful shove to demonstrate. You lose 5 HP.");
        }
    }, [tutorialStage, char.currentHp, char.maxHp, char.setCurrentHp, addLog]);
    useEffect(() => {
        if (tutorialStage !== 7) { setActiveCombatStyleHighlight(null); return; }
        const stances = [CombatStance.Accurate, CombatStance.Aggressive, CombatStance.Defensive];
        let currentIndex = 0;
        const interval = setInterval(() => {
            setActiveCombatStyleHighlight(stances[currentIndex]);
            currentIndex = (currentIndex + 1) % stances.length;
        }, 1000);
        return () => { clearInterval(interval); setActiveCombatStyleHighlight(null); };
    }, [tutorialStage]);
    
    const skilling = useSkilling(initialState.resourceNodeStates, { addLog, skills: char.skills, addXp: (skill, amount) => { char.addXp(skill, amount); if(skill === SkillName.Woodcutting) advanceTutorial('chop-log'); }, inventory: inv.inventory, modifyItem: inv.modifyItem, equipment: inv.equipment });
    const interactQuest = useInteractQuest({ addLog, activePlayerQuest: repeatableQuests.activePlayerQuest, handleTurnInRepeatableQuest: repeatableQuests.handleTurnInRepeatableQuest });
    const crafting = useCrafting({ skills: char.skills, hasItems: inv.hasItems, addLog, activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction, inventory: inv.inventory, modifyItem: inv.modifyItem, addXp: char.addXp, checkQuestProgressOnSpin: questLogic.checkQuestProgressOnSpin, checkQuestProgressOnSmith: questLogic.checkQuestProgressOnSmith, advanceTutorial, closeCraftingView: ui.closeCraftingView, setWindmillFlour, equipment: inv.equipment });
    const handleExamine = useCallback((item: Item) => {
        ui.setActiveDialogue({
            npcName: `Examine: ${item.name}`,
            npcIcon: item.iconUrl,
            nodes: {
                start: {
                    npcName: `Examine: ${item.name}`,
                    npcIcon: item.iconUrl,
                    text: item.description,
                    responses: [],
                }
            },
            currentNodeKey: 'start',
            onEnd: () => ui.setActiveDialogue(null),
            onAction: () => {},
            onNavigate: () => {}
        });
    }, [ui]);
    const itemActions = useItemActions({ addLog, currentHp: char.currentHp, maxHp: char.maxHp, setCurrentHp: char.setCurrentHp, applyStatModifier: char.applyStatModifier, setInventory: inv.setInventory, skills: char.skills, inventory: inv.inventory, activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction, hasItems: inv.hasItems, modifyItem: inv.modifyItem, addXp: char.addXp, openCraftingView: ui.openCraftingView, setItemToUse: ui.setItemToUse, addBuff: char.addBuff, setMakeXPrompt: ui.setMakeXPrompt, startQuest: (questId) => { quests.startQuest(questId, addLog); }, advanceTutorial, currentPoiId: session.currentPoiId });
    const worldActions = useWorldActions({ hasItems: inv.hasItems, inventory: inv.inventory, modifyItem: inv.modifyItem, addLog, coins: inv.coins, skills: char.skills, addXp: char.addXp, setClearedSkillObstacles, playerQuests: quests.playerQuests, checkQuestProgressOnShear: questLogic.checkQuestProgressOnShear, setMakeXPrompt: ui.setMakeXPrompt, windmillFlour, setWindmillFlour, setActiveCraftingAction: ui.setActiveCraftingAction });
    const navigation = useNavigation({ session, lockedPois: quests.lockedPois, clearedSkillObstacles, addLog, isBusy, isInCombat, ui, skilling, interactQuest });

    const onForcedNavigate = useCallback((poiId: string) => {
        if (!POIS[poiId]) {
            console.error(`ERROR: Teleport destination POI "${poiId}" does not exist.`);
            return;
        }
        skilling.stopSkilling();
        interactQuest.handleCancelInteractQuest();
        session.setCurrentPoiId(poiId);
    }, [session, skilling, interactQuest]);

    const onCastSpell = useCallback((spell: Spell) => {
        const magicLevel = char.skills.find(s => s.name === SkillName.Magic)?.currentLevel ?? 1;

        // Setting an autocast spell.
        if (spell.type === 'combat' && spell.autocastable) {
            if (magicLevel < spell.level) {
                addLog(`You need a Magic level of ${spell.level} to set this as your autocast spell.`);
                return;
            }
            
            const isCurrentlyAutocasting = char.autocastSpell?.id === spell.id;
            
            if (!isCurrentlyAutocasting) {
                char.setAutocastSpell(spell);
                addLog(`Autocast spell set to: ${spell.name}.`);
            } else {
                char.setAutocastSpell(null);
                addLog('Autocast spell cleared.');
            }
            return;
        }
    
        // For all other manual casts, check level and runes.
        if (magicLevel < spell.level) {
            addLog(`You need a Magic level of ${spell.level} to cast this spell.`);
            return;
        }
        
        if (!inv.hasItems(spell.runes)) {
            addLog("You do not have enough runes to cast this spell.");
            return;
        }
    
        // If checks pass, consume runes and give XP.
        spell.runes.forEach(rune => inv.modifyItem(rune.itemId, -rune.quantity, true));
        char.addXp(SkillName.Magic, spell.xp);
    
        if (spell.type === 'utility-teleport') {
            let destinationPoiId = '';
            if (spell.id === 'meadowdale_teleport') destinationPoiId = 'meadowdale_square';
            if (spell.id === 'oakhaven_teleport') destinationPoiId = 'oakhaven_square';
            if (spell.id === 'silverhaven_teleport') destinationPoiId = 'silverhaven_square';
            
            if (destinationPoiId) {
                addLog(`You cast ${spell.name} and feel a pull...`);
                setTimeout(() => {
                    onForcedNavigate(destinationPoiId);
                }, 500);
            }
        } else {
            // Handle other utility spells here if they have immediate effects.
            // For now, just log the cast.
            addLog(`You cast ${spell.name}.`);
        }
    
    }, [char.skills, char.autocastSpell, char.setAutocastSpell, addLog, inv.modifyItem, char.addXp, onForcedNavigate, inv.hasItems]);

    const handleCombatFinish = useCallback(() => {
        if (isInstantRespawnOn && instantRespawnCounter !== null) {
            const newCount = instantRespawnCounter - 1;
            if (newCount <= 0) { setIsInstantRespawnOn(false); setInstantRespawnCounter(null); addLog('System: Instant respawn finished.'); } 
            else { setInstantRespawnCounter(newCount); addLog(`System: Instant respawn encounters remaining: ${newCount}.`); }
        }
    }, [isInstantRespawnOn, instantRespawnCounter, addLog]);
    const { handlePlayerDeath: baseHandlePlayerDeath } = usePlayerDeath({ skilling, interactQuest, ui, session, char, inv, addLog, tutorialStage });
    const handlePlayerDeath = useCallback(() => { baseHandlePlayerDeath(); handleCombatFinish(); }, [baseHandlePlayerDeath, handleCombatFinish]);
    const killHandler = useKillHandler({ questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn });
    const handleKill = useCallback((id) => { killHandler.handleKill(id); if (id.split(':')[1] === 'tutorial_rat') advanceTutorial('kill-rat'); }, [killHandler, advanceTutorial]);
    
    const handleDialogueAction = useCallback((action: { type: string; questId?: string; actionId?: string }) => {
        if (action.type === 'accept_quest' && action.questId) {
            quests.startQuest(action.questId, addLog);
        } else if (action.type === 'complete_stage' && action.questId) {
            questLogic.completeQuestStage(action.questId);
        } else if (action.type === 'custom' && action.actionId) {
            switch (action.actionId) {
                case 'teleport_to_rune_mine':
                    onForcedNavigate('rune_essence_mine');
                    break;
                case 'craft_gust_runes_quest':
                    if (inv.hasItems([{ itemId: 'rune_essence', quantity: 5 }])) {
                        inv.modifyItem('rune_essence', -5, true);
                        inv.modifyItem('gust_rune', 5, false, undefined, { bypassAutoBank: true });
                        char.addXp(SkillName.Runecrafting, 10);
                        addLog("You place the items on the altar and feel a rush of energy. You have created Gust Runes!");
                        questLogic.completeQuestStage('magical_runestone_discovery');
                    } else {
                        addLog("You need 5 Rune Essence to do this.");
                    }
                    break;
                case 'buy_beer':
                    if (inv.coins >= 2) {
                        inv.modifyItem('coins', -2, true);
                        inv.modifyItem('beer', 1);
                        addLog("You buy a pint of fine ale.");
                    } else {
                        addLog("You can't afford that.");
                    }
                    break;
                case 'rent_room':
                    if (inv.coins >= 10) {
                        inv.modifyItem('coins', -10, true);
                        char.setCurrentHp(char.maxHp);
                        char.clearStatModifiers();
                        addLog("You rent a room for the night. You feel fully rested.");
                    } else {
                        addLog("You can't afford a room.");
                    }
                    break;
                // Travel actions
                case 'travel_to_isle_of_whispers':
                    if (inv.coins >= 10) {
                        inv.modifyItem('coins', -10);
                        addLog("You pay the ferryman 10 coins.");
                        onForcedNavigate('port_wreckage_docks');
                    } else {
                        addLog("You don't have enough coins for the ferry.");
                    }
                    break;
                case 'travel_to_crystalline_isles':
                    if (inv.coins >= 1600) {
                        inv.modifyItem('coins', -1600);
                        addLog("You pay the skyship captain 1600 coins.");
                        onForcedNavigate('crystalline_isles_landing');
                    } else {
                        addLog("You can't afford the skyship charter.");
                    }
                    break;
                case 'travel_to_silverhaven':
                    if (inv.coins >= 10) {
                        inv.modifyItem('coins', -10);
                        addLog("You pay the ferryman 10 coins for the return trip.");
                        onForcedNavigate('silverhaven_docks');
                    } else {
                        addLog("You don't have enough coins for the ferry.");
                    }
                    break;
                case 'travel_from_crystalline_isles_to_silverhaven':
                    if (inv.coins >= 1600) {
                        inv.modifyItem('coins', -1600);
                        addLog("You pay the skyship captain 1600 coins for the return trip.");
                        onForcedNavigate('silverhaven_docks');
                    } else {
                        addLog("You can't afford the skyship charter.");
                    }
                    break;
                
                // Tanning actions
                case 'tan_cowhide':
                    worldActions.handleTanning('cowhide', 'leather', 5, 1);
                    break;
                case 'tan_boar_hide':
                    worldActions.handleTanning('boar_hide', 'boar_leather', 8, 1);
                    break;
                case 'tan_wolf_pelt':
                    worldActions.handleTanning('wolf_pelt', 'wolf_leather', 15, 1);
                    break;
                case 'tan_bear_pelt':
                    worldActions.handleTanning('bear_pelt', 'bear_leather', 25, 1);
                    break;
            }
        }
    }, [quests, questLogic, addLog, inv, worldActions, onForcedNavigate, char]);
    
    const gameState = useMemo(() => ({
        username: initialState.username,
        skills: char.skills.map(({ name, level, xp }) => ({ name, level, xp })),
        inventory: inv.inventory, coins: inv.coins, equipment: inv.equipment, combatStance: char.combatStance,
        bank, currentHp: char.currentHp, currentPoiId: session.currentPoiId, playerQuests: quests.playerQuests, lockedPois: quests.lockedPois,
        clearedSkillObstacles, resourceNodeStates: skilling.resourceNodeStates, monsterRespawnTimers, shopStates: shops.shopStates, 
        repeatableQuestsState: {
            boards: Object.fromEntries(Object.entries(repeatableQuests.boards).map(([id, qs]) => [id, qs.map(q => ({id: q.id, requiredQuantity: q.requiredQuantity, finalCoinReward: q.finalCoinReward, finalXpAmount: q.xpReward.amount}))])),
            activePlayerQuest: repeatableQuests.activePlayerQuest,
            nextResetTimestamp: repeatableQuests.nextResetTimestamp,
            completedQuestIds: repeatableQuests.completedQuestIds,
            boardCompletions: repeatableQuests.boardCompletions,
        },
        slayerTask: slayer.slayerTask, tutorialStage,
        worldState: { windmillFlour },
        autocastSpell: char.autocastSpell,
    }), [char, inv, session.currentPoiId, quests, skilling.resourceNodeStates, shops.shopStates, repeatableQuests, bank, clearedSkillObstacles, monsterRespawnTimers, slayer.slayerTask, tutorialStage, initialState.username, windmillFlour]);

    useSaveGame(gameState);
    
    const startCombat = useCallback((ids: string[]) => { ui.setCombatQueue(ids); ui.setIsMandatoryCombat(true); }, [ui]);
    
    useAggression(session.currentPoiId, true, isInCombat || isBusy, char.combatLevel, startCombat, addLog, monsterRespawnTimers, configAggroIds, isPlayerInvisible);

    useEffect(() => { if (ui.activePanel === null) ui.setActivePanel('inventory'); }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setGroundItems(prev => {
                const now = Date.now();
                const newGroundItems: Record<string, GroundItem[]> = {};
                let changed = false;
                for (const poiId in prev) {
                    const items = prev[poiId].filter(item => now - item.dropTime < 5 * 60 * 1000);
                    if (items.length < prev[poiId].length) changed = true;
                    if (items.length > 0) {
                        newGroundItems[poiId] = items;
                    }
                }
                return changed ? newGroundItems : prev;
            });
        }, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const handlePickUpItem = useCallback((uniqueId: number) => {
        const poiId = session.currentPoiId;
        const groundItemsForPoi = groundItems[poiId];
        if (!groundItemsForPoi) return;

        const itemToPick = groundItemsForPoi.find(gi => gi.uniqueId === uniqueId);
        if (!itemToPick) return;

        const freeSlots = inv.inventory.filter(s => s === null).length;
        const itemData = ITEMS[itemToPick.item.itemId];
        let needsNewSlot = true;
        if (itemData.stackable) {
            if (inv.inventory.some(s => s?.itemId === itemData.id && (!itemData.doseable || s.doses === itemToPick.item.doses))) {
                needsNewSlot = false;
            }
        }
        
        if (needsNewSlot && freeSlots < 1) {
            addLog("Your inventory is full.");
            return;
        }

        inv.modifyItem(itemToPick.item.itemId, itemToPick.item.quantity, false, itemToPick.item.doses, { bypassAutoBank: true });
        
        setGroundItems(prev => {
            const newItems = { ...prev };
            newItems[poiId] = newItems[poiId].filter(gi => gi.uniqueId !== uniqueId);
            if (newItems[poiId].length === 0) {
                delete newItems[poiId];
                ui.setIsLootViewOpen(false); // Close modal if last item is picked up
            }
            return newItems;
        });
        ui.setTooltip(null);
    }, [groundItems, session.currentPoiId, inv, addLog, ui]);

    const handleTakeAllLoot = useCallback(() => {
        const poiId = session.currentPoiId;
        let groundItemsForPoi = groundItems[poiId];
        if (!groundItemsForPoi || groundItemsForPoi.length === 0) return;

        let itemsToKeepOnGround = [...groundItemsForPoi];
        let currentInventory = [...inv.inventory];
        let itemsPickedUp = false;

        for (const itemToPick of groundItemsForPoi) {
            const freeSlots = currentInventory.filter(s => s === null).length;
            const itemData = ITEMS[itemToPick.item.itemId];
            let needsNewSlot = true;
            if (itemData.stackable) {
                if (currentInventory.some(s => s?.itemId === itemData.id && (!itemData.doseable || s.doses === itemToPick.item.doses))) {
                    needsNewSlot = false;
                }
            }
            if (needsNewSlot && freeSlots < 1) {
                addLog("You don't have enough space to pick up everything.");
                break;
            }
            
            if (needsNewSlot) {
                const emptyIdx = currentInventory.findIndex(s => s === null);
                if (emptyIdx !== -1) currentInventory[emptyIdx] = itemToPick.item;
            }
            inv.modifyItem(itemToPick.item.itemId, itemToPick.item.quantity, false, itemToPick.item.doses, { bypassAutoBank: true });
            itemsToKeepOnGround = itemsToKeepOnGround.filter(gi => gi.uniqueId !== itemToPick.uniqueId);
            itemsPickedUp = true;
        }

        if (itemsPickedUp) {
            setGroundItems(prev => {
                const newItems = { ...prev };
                if (itemsToKeepOnGround.length === 0) {
                    delete newItems[poiId];
                    ui.setIsLootViewOpen(false);
                } else {
                    newItems[poiId] = itemsToKeepOnGround;
                }
                return newItems;
            });
        }
    }, [groundItems, session.currentPoiId, inv, addLog, ui]);

    const isBankOpen = ui.activePanel === 'bank';
    const isShopOpen = !!ui.activeShopId;

    return (
        <>
            <div className="w-full md:w-4/5 flex flex-col gap-2">
                <div className="bg-black/70 border-2 border-gray-600 rounded-lg p-4 flex-grow min-h-0 relative">
                    <MainViewController {...{char, inv, quests, bank, bankLogic, shops, crafting, repeatableQuests, navigation, worldActions, slayer, questLogic, skilling, interactQuest, session, clearedSkillObstacles, monsterRespawnTimers, handlePlayerDeath, handleKill, combatSpeedMultiplier, advanceTutorial, tutorialStage, activeCombatStyleHighlight, isTouchSimulationEnabled, isMapManagerEnabled, poiCoordinates, regionCoordinates, onUpdatePoiCoordinate: handleUpdatePoiCoordinate, poiConnections, onUpdatePoiConnections: handleUpdatePoiConnections, addLog, ui, onExportGame, onImportGame, onResetGame, initialState, showAllPois, groundItemsForCurrentPoi: groundItems[session.currentPoiId] || [], onPickUpItem: handlePickUpItem, onTakeAllLoot: handleTakeAllLoot, onItemDropped, isAutoBankOn, handleDialogueAction}} />
                    {levelUpInfo && <LevelUpAnimation skill={levelUpInfo.skill} level={levelUpInfo.level} />}
                    {groundItems[session.currentPoiId]?.length > 0 && (
                        <button
                            onClick={() => ui.setIsLootViewOpen(true)}
                            className="absolute bottom-4 left-4 z-20 flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/80 animate-fade-in"
                            aria-label={`Loot ${groundItems[session.currentPoiId].length} items`}
                            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
                        >
                            <img src="https://api.iconify.design/game-icons:swap-bag.svg" alt="" className="w-8 h-8 filter invert drop-shadow-lg" />
                            <span className="font-bold text-white text-lg">Loot ({groundItems[session.currentPoiId].length})</span>
                        </button>
                    )}
                </div>
                <div className={`md:flex-shrink-0 relative ${tutorialStage >= 0 ? 'hidden md:block md:invisible' : ''}`}>
                    <ActivityLog logs={activityLog} isDialogueActive={!!ui.activeDialogue} />
                    {ui.activeDialogue && <DialogueOverlay dialogue={ui.activeDialogue} />}
                </div>
            </div>
            <div className="w-full md:w-1/5 flex flex-col">
                <SidePanel {...{ui, initialState, char, inv, quests, repeatableQuests, slayer, onExportGame: () => onExportGame(gameState), onImportGame, onResetGame, isDevMode, isTouchSimulationEnabled, onToggleTouchSimulation, itemActions, isBusy, handleExamine, session, addLog, activeCombatStyleHighlight, combatSpeedMultiplier, setCombatSpeedMultiplier: s => {setCombatSpeedMultiplier(s); addLog(`System: Combat speed set to ${s}x.`)}, isInstantRespawnOn, setIsInstantRespawnOn: b => {setIsInstantRespawnOn(b); addLog(`System: Instant respawn ${b ? 'enabled':'disabled'}.`)}, instantRespawnCounter, setInstantRespawnCounter, isInCombat, isCurrentMonsterAggro, onToggleAggro, isPlayerInvisible, setIsPlayerInvisible: b => {setIsPlayerInvisible(b); addLog(`System: Invisibility ${b ? 'enabled':'disabled'}.`)}, isAutoBankOn, setIsAutoBankOn: b => {setIsAutoBankOn(b); addLog(`System: Auto-bank ${b ? 'enabled':'disabled'}.`)}, isMapManagerEnabled, onToggleMapManager: handleToggleMapManager, showAllPois, onToggleShowAllPois: () => setShowAllPois(p => !p), onForcedNavigate, onNavigate: navigation.handleNavigate, isBankOpen, isShopOpen, onDeposit: bankLogic.handleDeposit, xpMultiplier, setXpMultiplier, isXpBoostEnabled, setIsXpBoostEnabled, devPanelState, updateDevPanelState, onCastSpell }} />
            </div>
            <XpTracker drops={xpDrops} onRemoveDrop={removeXpDrop} />
            {tutorialStage >= 0 && <TutorialOverlay {...{stage: tutorialStage, advanceTutorial, overrideGuideText: tutorialOverrideText, inventory: inv.inventory, logMessage: tutorialLogMessage, clearLogMessage: () => setTutorialLogMessage(null), isTouchSimulationEnabled}} />}
            {ui.activeQuestDetail && <QuestDetailView questId={ui.activeQuestDetail.questId} playerQuests={ui.activeQuestDetail.playerQuests} onClose={() => ui.setActiveQuestDetail(null)} />}
            {ui.isAtlasViewOpen && <AtlasView currentPoiId={session.currentPoiId} unlockedPois={navigation.reachablePois} onClose={() => ui.setIsAtlasViewOpen(false)} setTooltip={ui.setTooltip} showAllPois={showAllPois} />}
            {ui.isExpandedMapViewOpen && <ExpandedMapView currentPoiId={session.currentPoiId} unlockedPois={navigation.reachablePois} onNavigate={navigation.handleNavigate} onClose={() => { if (!isMapManagerEnabled) { ui.setIsExpandedMapViewOpen(false); } }} setTooltip={ui.setTooltip} isMapManagerEnabled={isMapManagerEnabled} poiCoordinates={poiCoordinates} regionCoordinates={regionCoordinates} onUpdatePoiCoordinate={handleUpdatePoiCoordinate} poiConnections={poiConnections} onUpdatePoiConnections={handleUpdatePoiConnections} showAllPois={showAllPois} addLog={addLog} onCommitMapChanges={handleCommitMapChanges} />}
        </>
    );
};

export default Game;
