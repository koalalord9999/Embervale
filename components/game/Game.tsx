

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CombatStance, PlayerSlayerTask, ShopStates, SkillName, POIActivity, InventorySlot, ActivePanel, Item, Region, POI, WorldState, GroundItem, Spell, GeneratedRepeatableQuest, BonfireActivity, BankTab, DialogueResponse, DialogueCheckRequirement, Monster, MonsterType, SpellElement, PlayerType } from '../../types';
import { useActivityLog } from '../../hooks/useActivityLog';
import { useCharacter } from '../../hooks/useCharacter';
import { useInventory } from '../../hooks/useInventory';
import { useQuests } from '../../hooks/useQuests';
import { useSaveGame } from '../../hooks/useSaveGame';
import { useGameSession } from '../../hooks/useGameSession';
import { useRepeatableQuests } from '../../hooks/useRepeatableQuests';
import { useAggression } from '../../hooks/useAggression';
import { useShops } from '../../hooks/useShops';
import { useSkilling } from '../../hooks/useSkilling';
import { useBank } from '../../hooks/useBank';
import { useInteractQuest } from '../../hooks/useInteractQuest';
import { useSlayer } from '../../hooks/useSlayer';
import { useQuestLogic } from '../../hooks/useQuestLogic';
import { useCrafting } from '../../hooks/useCrafting';
import { useItemActions } from '../../hooks/useItemActions';
import { useSpellActions } from '../../hooks/useSpellActions';
import { useWorldActions } from '../../hooks/useWorldActions';
import { useNavigation } from '../../hooks/useNavigation';
import { usePlayerDeath } from '../../hooks/usePlayerDeath';
import { useKillHandler } from '../../hooks/useKillHandler';
import { useGroundItems } from '../../hooks/useGroundItems';
import { useSpellcasting } from '../../hooks/useSpellcasting';
import { useDialogueActions } from '../../hooks/useDialogueActions';
import { useSceneInteractions } from '../../hooks/useSceneInteractions';

import SidePanel from './SidePanel';
import ActivityLog from '../game/ActivityLog';
import XpTracker, { XpDrop } from '../ui/XpTracker';
import MainViewController from '../game/MainViewController';
import QuestDetailView from '../views/overlays/QuestDetailView';
import AtlasView from '../views/AtlasView';
import ExpandedMapView from '../views/ExpandedMapView';
import LevelUpAnimation from './LevelUpAnimation';
import DialogueOverlay from './dialogue/DialogueOverlay';
import { useUIState } from '../../hooks/useUIState';
import { POIS } from '../../data/pois';
import DevPanel from '../panels/DevPanel';
import { FIREMAKING_RECIPES, QUESTS, MONSTERS } from '../../constants';
import SettingsView from '../panels/SettingsPanel';
import SkillGuideView from '../views/overlays/SkillGuideView';
import MonsterDBView from '../views/dev/MonsterDBView';

import { beasts } from '../../constants/monsters/beasts';
import { humanoids } from '../../constants/monsters/humanoids';
import { magicalAndUndead } from '../../constants/monsters/magicalAndUndead';
import { dragons } from '../../constants/monsters/dragons';


interface GameProps {
    initialState: any;
    slotId: number;
    onReturnToMenu: () => void;
    ui: ReturnType<typeof useUIState>;
    assets: Record<string, string>;
    // FIX: Add missing props for game actions
    onExportGame: () => void;
    onImportGame: () => void;
    onResetGame: () => void;
}

const Game: React.FC<GameProps> = ({ initialState, slotId, onReturnToMenu, ui, assets, onExportGame, onImportGame, onResetGame }) => {
    // Core State Hooks
    const session = useGameSession(initialState.currentPoiId);
    // FIX: Initialize activityLog from initialState to persist it.
    const { activityLog, addLog, setActivityLog } = useActivityLog(initialState.activityLog || []);
    const [xpDrops, setXpDrops] = useState<XpDrop[]>([]);
    const [levelUpInfo, setLevelUpInfo] = useState<{ skill: SkillName; level: number } | null>(null);
    const [immunityUntil, setImmunityUntil] = useState<number | null>(null);
    const [immunityTimeLeft, setImmunityTimeLeft] = useState(0);
    const [poiImmunityTimeLeft, setPoiImmunityTimeLeft] = useState(0);
    const [killTrigger, setKillTrigger] = useState(0);
    const [bonfires, setBonfires] = useState<BonfireActivity[]>([]);

    const isBusy = ui.isBusy;
    
    // --- START DEV MODE LOGIC ---
    const isDevMode = initialState.playerType === PlayerType.Cheats;
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
    const [devPanelState, setDevPanelState] = useState({ activeTab: 'cheats' as 'cheats' | 'items' | 'teleport' | 'woodcutting' | 'monsters', itemSearchTerm: '', selectedItemId: null as string | null, spawnQuantity: 1, teleportRegionId: '', teleportPoiId: '', skillToSet: '' as any | '', levelToSet: 1, coinAmount: 1000000, wcTestLevel: 1, wcTestTreeId: null as string | null });

    const [monsterData, setMonsterData] = useState<Record<string, Monster>>(() => JSON.parse(JSON.stringify(MONSTERS)));
    const [modifiedMonsters, setModifiedMonsters] = useState<Set<string>>(new Set());
    const latestMonsterDataRef = useRef(monsterData);
    useEffect(() => { latestMonsterDataRef.current = monsterData; }, [monsterData]);

    const handleCommitMapChanges = useCallback(async () => {
        if (modifiedMonsters.size === 0) { addLog("No monster changes to commit."); return; }
    
        const allMonsterFileObjects = {
            'constants/monsters/beasts.ts': beasts,
            'constants/monsters/humanoids.ts': humanoids,
            'constants/monsters/magicalAndUndead.ts': magicalAndUndead,
            'constants/monsters/dragons.ts': dragons,
        };
    
        const monsterFileMap: Record<string, string> = {};
        for (const [filePath, monsterArray] of Object.entries(allMonsterFileObjects)) {
            monsterArray.forEach((monster: Monster) => { monsterFileMap[monster.id] = filePath; });
        }
    
        const changesByFile: Record<string, string[]> = {};
    
        modifiedMonsters.forEach(monsterId => {
            const filePath = monsterFileMap[monsterId];
            if (filePath) {
                if (!changesByFile[filePath]) changesByFile[filePath] = [];
                changesByFile[filePath].push(monsterId);
            }
        });
    
        const generatedCodeBlocks: { filePath: string, content: string }[] = [];

        const formatMonsterObjectToString = (monster: Monster): string => {
            const indent = '    ';
            const innerIndent = '        ';

            const formatValue = (key: string, value: any): string => {
                if (value === undefined) return '';
                if (typeof value === 'string') {
                    if (key === 'chance' && value.includes('/')) return `"${value}"`;
                    if (value.startsWith('MonsterType.') || value.startsWith('SkillName.')) return value;
                    return `'${value}'`;
                }
                if (typeof value === 'number' || typeof value === 'boolean') {
                    return String(value);
                }
                if (Array.isArray(value)) {
                    if (key === 'types') return `[${value.map(v => `MonsterType.${v}`).join(', ')}]`;
                    if (key === 'elementalWeaknessCycle') return `[${value.map((v: string) => `'${v}'`).join(', ')}]`;
                    
                    return `[\n${value.map(v => `${innerIndent}    ${formatValue('', v)}`).join(',\n')}\n${innerIndent}]`;
                }
                if (typeof value === 'object' && value !== null) {
                    const parts = Object.entries(value).map(([k, v]) => {
                        if (k === 'skill' && typeof v === 'string') return `${k}: SkillName.${v}`;
                        if (k === 'skills' && Array.isArray(v)) {
                            const skillsStr = v.map((s: any) => `{ skill: SkillName.${s.skill}, value: ${s.value} }`).join(', ');
                            return `${k}: [${skillsStr}]`;
                        }
                        return `${k}: ${formatValue(k, v)}`;
                    });
                    return `{ ${parts.join(', ')} }`;
                }
                return String(value);
            };

            let output = `${indent}{\n`;

            // Line 1: Core Stats
            const line1_keys: (keyof Monster)[] = ['id', 'name', 'level', 'maxHp', 'attack', 'ranged', 'magic', 'customMaxHit'];
            const line1_parts = line1_keys
                .filter(key => monster[key] !== undefined && ((key !== 'ranged' && key !== 'magic') || monster[key] !== 0))
                .map(key => `${key}: ${formatValue(key, monster[key])}`);
            output += `${innerIndent}${line1_parts.join(', ')},\n`;

            // Line 2: Defences
            const line2_keys: (keyof Monster)[] = ['stabDefence', 'slashDefence', 'crushDefence', 'rangedDefence', 'magicDefence'];
            const line2_parts = line2_keys.map(key => `${key}: ${formatValue(key, monster[key])}`);
            output += `${innerIndent}${line2_parts.join(', ')},\n`;
            
            // Line 3: iconUrl
            output += `${innerIndent}iconUrl: '${monster.iconUrl}',\n`;
            
            // Drop Tables
            const dropTableKeys: (keyof Monster)[] = ['guaranteedDrops', 'mainDrops', 'tertiaryDrops'];
            dropTableKeys.forEach(key => {
                const drops = monster[key] as any[];
                if (drops && drops.length > 0) {
                    output += `${innerIndent}${key}: [\n`;
                    drops.forEach(drop => {
                        output += `${innerIndent}    ${formatValue(key, drop)},\n`;
                    });
                    output += `${innerIndent}],\n`;
                }
            });

            // Special Attacks
            if (monster.specialAttacks && monster.specialAttacks.length > 0) {
                output += `${innerIndent}specialAttacks: [\n`;
                monster.specialAttacks.forEach(attack => {
                    output += `${innerIndent}    ${formatValue('specialAttacks', attack)},\n`;
                });
                output += `${innerIndent}],\n`;
            }

            // Final Line
            const final_line_keys: (keyof Monster)[] = ['types', 'attackSpeed', 'respawnTime', 'aggressive', 'alwaysAggressive', 'attackStyle', 'alwaysDrops', 'elementalWeakness', 'elementalWeaknessCycle'];
            const final_parts = final_line_keys
                .filter(key => monster[key as keyof Monster] !== undefined)
                .map(key => `${key}: ${formatValue(key, monster[key as keyof Monster])}`);
            output += `${innerIndent}${final_parts.join(', ')},\n`;

            output += `${indent}},`;

            return output;
        };
    
        for (const filePath in changesByFile) {
            const originalArray = (allMonsterFileObjects as any)[filePath];
            const variableName = filePath.split('/').pop()?.split('.')[0] || 'monsters';
            const exportName = variableName;
            
            const updatedFileArray = originalArray.map(
                (origMonster: Monster) => modifiedMonsters.has(origMonster.id) ? latestMonsterDataRef.current[origMonster.id] : origMonster
            );
    
            const arrayContent = updatedFileArray.map(formatMonsterObjectToString).join('\n');
            
            const fileContent = `import { Monster, MonsterType, SkillName, SpellElement } from '../../types';\n\nexport const ${exportName}: Monster[] = [\n${arrayContent}\n];`;
            
            generatedCodeBlocks.push({ filePath, content: fileContent });
        }
    
        if (generatedCodeBlocks.length > 0) {
            ui.setExportData({
                data: generatedCodeBlocks,
                title: "Commit Monster Changes",
                copyButtonText: "Copy Code",
                onCopy: () => {},
                onClose: () => {
                    setModifiedMonsters(new Set());
                    addLog("Monster changes have been cleared from dev state.");
                    ui.closeExportModal();
                }
            });
        } else {
            addLog("No code changes were generated.");
        }
    }, [modifiedMonsters, addLog, ui]);
    
    const onToggleAggro = useCallback(() => {
        if (ui.combatQueue.length === 0) return;
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
    }, [ui.combatQueue, addLog]);

    const isCurrentMonsterAggro = ui.combatQueue.length > 0 && configAggroIds.includes(ui.combatQueue[0]);

    const devMode = {
        isDevMode,
        combatSpeedMultiplier, setCombatSpeedMultiplier,
        isInstantRespawnOn, setIsInstantRespawnOn,
        instantRespawnCounter, setInstantRespawnCounter,
        configAggroIds, setConfigAggroIds,
        isPlayerInvisible, setIsPlayerInvisible,
        isAutoBankOn, setIsAutoBankOn,
        isTouchSimulationEnabled, onToggleTouchSimulation: () => setIsTouchSimulationEnabled(p => !p),
        isMapManagerEnabled, onToggleMapManager: (enable: boolean) => {
            setIsMapManagerEnabled(enable);
            ui.setIsExpandedMapViewOpen(enable);
        },
        showAllPois, setShowAllPois,
        xpMultiplier, setXpMultiplier,
        isXpBoostEnabled, setIsXpBoostEnabled,
        devPanelState, updateDevPanelState: (updates: Partial<typeof devPanelState>) => setDevPanelState(p => ({...p, ...updates})),
        handleCommitMapChanges,
        monsterData, setMonsterData,
        modifiedMonsters, setModifiedMonsters,
        onToggleAggro,
        isCurrentMonsterAggro,
    };
    // --- END DEV MODE LOGIC ---

    const effectiveXpMultiplier = devMode.isDevMode && devMode.isXpBoostEnabled ? devMode.xpMultiplier : 1;
    const quests = useQuests({ playerQuests: initialState.playerQuests, lockedPois: initialState.lockedPois });
    
    // Character & Item Hooks
    const handleXpGain = useCallback((skillName: SkillName, amount: number) => {
        if (amount > 0) {
            setXpDrops(prev => [...prev, { id: Date.now() + Math.random(), skillName, amount }]);
        }
    }, []);

    const removeXpDrop = useCallback((id: number) => setXpDrops(prev => prev.filter(drop => drop.id !== id)), []);
    const handleLevelUp = useCallback((skill: SkillName, level: number) => {
        setLevelUpInfo({ skill, level });
        const duration = level === 99 ? 8000 : 4000;
        setTimeout(() => setLevelUpInfo(null), duration);
    }, []);
    
    const [worldState, setWorldState] = useState<WorldState>(initialState.worldState);
    const charInitialData = useMemo(() => ({ skills: initialState.skills, combatStance: initialState.combatStance, currentHp: initialState.currentHp, autocastSpell: initialState.autocastSpell, statModifiers: initialState.statModifiers, activeBuffs: initialState.activeBuffs }), [initialState]);
    const charCallbacks = useMemo(() => ({ addLog, onXpGain: handleXpGain, onLevelUp: handleLevelUp }), [addLog, handleXpGain, handleLevelUp]);
    const char = useCharacter(charInitialData, charCallbacks, worldState, setWorldState, ui.combatQueue.length > 0, devMode.combatSpeedMultiplier, effectiveXpMultiplier);

    const invRef = useRef<ReturnType<typeof useInventory> | null>(null);
    const { 
        groundItems: allGroundItems, 
        groundItemsForCurrentPoi, 
        onItemDropped, 
        handlePickUpItem, 
        handleTakeAllLoot, 
        clearAllItemsAtPoi,
        clearDeathPileItemsAtPoi 
    } = useGroundItems(initialState.groundItems, { session, invRef, addLog, ui, worldState, setWorldState });

    const [bank, setBank] = useState<BankTab[]>(initialState.bank);
    const bankOptions = useMemo(() => ({ isAutoBankOn: devMode.isAutoBankOn, setBank, onItemDropped, setCombatStance: char.setCombatStance }), [devMode.isAutoBankOn, setBank, onItemDropped, char.setCombatStance]);
    const invInitialData = useMemo(() => ({ inventory: initialState.inventory, coins: initialState.coins, equipment: initialState.equipment }), [initialState]);
    const inv = useInventory(invInitialData, addLog, bankOptions);
    useEffect(() => { invRef.current = inv; }, [inv]);
    
    // Logic Hooks
    const [clearedSkillObstacles, setClearedSkillObstacles] = useState(initialState.clearedSkillObstacles);
    const [monsterRespawnTimers, setMonsterRespawnTimers] = useState(initialState.monsterRespawnTimers);

    // FIX: Reorder hooks to fix "used before its declaration" errors.
    const questLogic = useQuestLogic({ playerQuests: quests.playerQuests, setPlayerQuests: quests.setPlayerQuests, addLog, modifyItem: inv.modifyItem, addXp: char.addXp, hasItems: inv.hasItems, setLockedPois: quests.setLockedPois, setClearedSkillObstacles });
    
    const onQuestAcceptedCallback = useCallback((quest: GeneratedRepeatableQuest) => {
        const tutorialQuest = quests.playerQuests.find(q => q.questId === 'embrune_101');
        if (tutorialQuest && !tutorialQuest.isComplete) {
            const questData = QUESTS['embrune_101'];
            const currentStage = questData.stages[tutorialQuest.currentStage];
            if (currentStage?.requirement.type === 'accept_repeatable_quest' && currentStage.requirement.questId === quest.id) {
                questLogic.completeQuestStage('embrune_101');
            }
        }
    }, [quests.playerQuests, questLogic]);
    
    const repeatableQuests = useRepeatableQuests(initialState.repeatableQuestsState, addLog, inv, char, onQuestAcceptedCallback);
    const skilling = useSkilling(initialState.resourceNodeStates, { addLog, skills: char.skills, addXp: char.addXp, inventory: inv.inventory, modifyItem: inv.modifyItem, equipment: inv.equipment, setEquipment: inv.setEquipment, checkQuestProgressOnShear: questLogic.checkQuestProgressOnShear, hasItems: inv.hasItems });
    const shops = useShops(initialState.shopStates, inv.coins, inv.modifyItem, addLog, inv.inventory);
    const slayer = useSlayer(initialState.slayerTask, { addLog, addXp: char.addXp, combatLevel: char.combatLevel, modifyItem: inv.modifyItem });

    // Save Game State Memoization
    const gameState = useMemo(() => ({
        username: initialState.username,
        playerType: initialState.playerType,
        skills: char.skills.map(({ name, level, xp }) => ({ name, level, xp })),
        inventory: inv.inventory, coins: inv.coins, equipment: inv.equipment, combatStance: char.combatStance,
        bank, currentHp: char.currentHp, currentPoiId: session.currentPoiId, playerQuests: quests.playerQuests, lockedPois: quests.lockedPois,
        clearedSkillObstacles, resourceNodeStates: skilling.resourceNodeStates, monsterRespawnTimers, shopStates: shops.shopStates, 
        groundItems: allGroundItems,
        // FIX: Add activityLog to the saved gameState.
        activityLog,
        repeatableQuestsState: {
            boards: repeatableQuests.boards,
            activePlayerQuest: repeatableQuests.activePlayerQuest,
            nextResetTimestamp: repeatableQuests.nextResetTimestamp,
            completedQuestIds: repeatableQuests.completedQuestIds,
            boardCompletions: repeatableQuests.boardCompletions,
        },
        slayerTask: slayer.slayerTask, tutorialStage: -1, // Tutorial is now quest-based, not a separate stage.
        worldState: worldState,
        autocastSpell: char.autocastSpell,
        statModifiers: char.statModifiers,
        activeBuffs: char.activeBuffs,
        settings: {
            showTooltips: ui.showTooltips,
            showXpDrops: ui.showXpDrops,
            confirmValuableDrops: ui.confirmValuableDrops,
            valuableDropThreshold: ui.valuableDropThreshold,
            showMinimapHealth: ui.showMinimapHealth,
            showCombatPlayerHealth: ui.showCombatPlayerHealth,
            showCombatEnemyHealth: ui.showCombatEnemyHealth,
            showHitsplats: ui.showHitsplats,
            isOneClickMode: ui.isOneClickMode,
        },
        // We add isDead here manually when saving on death, but not during normal saves
    }), [
        initialState.username, initialState.playerType, char.skills, char.combatStance, char.currentHp, char.autocastSpell, char.statModifiers, char.activeBuffs, inv.inventory, inv.coins, inv.equipment, bank, session.currentPoiId, quests.playerQuests, quests.lockedPois, clearedSkillObstacles, skilling.resourceNodeStates, monsterRespawnTimers, shops.shopStates, allGroundItems,
        // FIX: Add activityLog to the dependency array.
        activityLog,
        repeatableQuests.boards, repeatableQuests.activePlayerQuest, repeatableQuests.nextResetTimestamp, repeatableQuests.completedQuestIds, repeatableQuests.boardCompletions, slayer.slayerTask, worldState,
        ui.showTooltips,
        ui.showXpDrops,
        ui.confirmValuableDrops,
        ui.valuableDropThreshold,
        ui.showMinimapHealth,
        ui.showCombatPlayerHealth,
        ui.showCombatEnemyHealth,
        ui.showHitsplats,
        ui.isOneClickMode,
    ]);
    
    useSaveGame(gameState, slotId);
    
    const interactQuest = useInteractQuest({ addLog, activePlayerQuest: repeatableQuests.activePlayerQuest, handleTurnInRepeatableQuest: repeatableQuests.handleTurnInRepeatableQuest });
    const navigation = useNavigation({ session, lockedPois: quests.lockedPois, clearedSkillObstacles, addLog, isBusy, isInCombat: ui.combatQueue.length > 0, ui, skilling, interactQuest });
    const bankLogic = useBank({ bank, setBank }, { addLog, ...inv, ...char, setCombatStance: char.setCombatStance, bankPlaceholders: worldState.bankPlaceholders ?? false });
    
    const setWindmillFlour = useCallback((updater: React.SetStateAction<number>) => {
        setWorldState(prev => {
            const newFlour = typeof updater === 'function' ? updater(prev.windmillFlour) : updater;
            return { ...prev, windmillFlour: newFlour };
        });
    }, []);
    
    const onCreateBonfire = useCallback((logId: string) => {
        const recipe = FIREMAKING_RECIPES.find(r => r.logId === logId);
        if (!recipe) return;
        const duration = (30 + recipe.level * 2) * 1000;
        const newBonfire: BonfireActivity = {
            type: 'bonfire',
            uniqueId: `${session.currentPoiId}-${Date.now()}`,
            logId,
            expiresAt: Date.now() + duration,
            poiId: session.currentPoiId,
        };
        setBonfires(prev => [...prev, newBonfire]);
    }, [session.currentPoiId]);

    const onRefreshBonfire = useCallback((bonfireId: string, logId: string) => {
        const recipe = FIREMAKING_RECIPES.find(r => r.logId === logId);
        if (!recipe) return;
        const duration = (30 + recipe.level * 2) * 1000;
        setBonfires(prev => prev.map(b => 
            b.uniqueId === bonfireId 
                ? { ...b, expiresAt: Date.now() + duration } 
                : b
        ));
    }, []);

    const crafting = useCrafting({ skills: char.skills, hasItems: inv.hasItems, addLog, activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction, inventory: inv.inventory, modifyItem: inv.modifyItem, addXp: char.addXp, checkQuestProgressOnSpin: questLogic.checkQuestProgressOnSpin, checkQuestProgressOnSmith: questLogic.checkQuestProgressOnSmith, advanceTutorial: () => {}, closeCraftingView: ui.closeCraftingView, setWindmillFlour, equipment: inv.equipment, setEquipment: inv.setEquipment, worldState, setWorldState, onCreateBonfire, onRefreshBonfire });
    const worldActions = useWorldActions({ hasItems: inv.hasItems, inventory: inv.inventory, modifyItem: inv.modifyItem, addLog, coins: inv.coins, skills: char.skills, addXp: char.addXp, setClearedSkillObstacles, playerQuests: quests.playerQuests, setMakeXPrompt: ui.setMakeXPrompt, windmillFlour: worldState.windmillFlour, setWindmillFlour, setActiveCraftingAction: ui.setActiveCraftingAction });
    const dialogueActions = useDialogueActions({ quests, questLogic, navigation, inv, char, worldActions, addLog, worldState, setBank, setActivityLog, repeatableQuests, ui, setWorldState, session });
    const { handleDialogueCheck, onResponse } = dialogueActions;
    
    const itemActions = useItemActions({ addLog, currentHp: char.currentHp, maxHp: char.maxHp, setCurrentHp: char.setCurrentHp, applyStatModifier: char.applyStatModifier, setInventory: inv.setInventory, skills: char.skills, inventory: inv.inventory, activeCraftingAction: ui.activeCraftingAction, setActiveCraftingAction: ui.setActiveCraftingAction, hasItems: inv.hasItems, modifyItem: inv.modifyItem, addXp: char.addXp, openCraftingView: ui.openCraftingView, setItemToUse: ui.setItemToUse, addBuff: char.addBuff, setMakeXPrompt: ui.setMakeXPrompt, startQuest: (questId) => { quests.startQuest(questId, addLog); }, currentPoiId: session.currentPoiId, playerQuests: quests.playerQuests, isStunned: char.isStunned, setActiveDungeonMap: ui.setActiveDungeonMap, confirmValuableDrops: ui.confirmValuableDrops, valuableDropThreshold: ui.valuableDropThreshold, ui, equipment: inv.equipment, onResponse, handleDialogueCheck });
    const spellActions = useSpellActions({ addLog, addXp: char.addXp, modifyItem: inv.modifyItem, hasItems: inv.hasItems, skills: char.skills, ui, equipment: inv.equipment });
    const playerDeath = usePlayerDeath({ skilling, interactQuest, ui, session, char, inv, addLog, playerQuests: quests.playerQuests, onItemDropped, setWorldState, playerType: initialState.playerType, slotId, gameState, onReturnToMenu });
    
    const killHandler = useKillHandler({ questLogic, repeatableQuests, slayer, setMonsterRespawnTimers, isInstantRespawnOn: devMode.isInstantRespawnOn, setWorldState, addLog, worldState, inv, navigation });
    const handleKill = useCallback((id: string, style?: 'melee' | 'ranged' | 'magic') => { killHandler.handleKill(id, style); }, [killHandler]);
    const handleEncounterWin = useCallback((ids: string[]) => { killHandler.handleEncounterWin(ids); }, [killHandler]);
    
    const spellcasting = useSpellcasting({ char, inv, addLog, navigation, ui, isStunned: char.isStunned });
    
    const sceneInteractions = useSceneInteractions(session.currentPoiId, {
        playerQuests: quests.playerQuests,
        setActiveDialogue: ui.setActiveDialogue,
        handleDialogueCheck,
        onResponse,
        addLog,
    });
    
    const handleCombatFinish = useCallback(() => {
        if (devMode.isInstantRespawnOn && devMode.instantRespawnCounter !== null) {
            const newCount = devMode.instantRespawnCounter - 1;
            if (newCount <= 0) { devMode.setIsInstantRespawnOn(false); devMode.setInstantRespawnCounter(null); addLog('System: Instant respawn finished.'); } 
            else { devMode.setInstantRespawnCounter(newCount); addLog(`System: Instant respawn encounters remaining: ${newCount}.`); }
        }
    }, [devMode, addLog]);

    const onWinCombat = useCallback(() => {
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);
        handleCombatFinish();
    }, [ui, handleCombatFinish]);

    const handlePlayerDeath = useCallback(() => { playerDeath.handlePlayerDeath(); handleCombatFinish(); }, [playerDeath.handlePlayerDeath, handleCombatFinish]);

    const onFleeFromCombat = useCallback(() => {
        ui.setCombatQueue([]);
        ui.setIsMandatoryCombat(false);
        setImmunityUntil(Date.now() + 10000);
        addLog("You flee from combat, gaining 10 seconds of aggression immunity.");
    }, [ui, addLog]);
    
    const startCombat = useCallback((ids: string[]) => {
        if (ui.activeDialogue) {
            ui.setActiveDialogue(null);
        }
        ui.setCombatQueue(ids);
        ui.setIsMandatoryCombat(false);
    }, [ui]);
    const isInCombat = ui.combatQueue.length > 0;

    const needsDeathImmunityThisRender = !!worldState.deathMarker && session.currentPoiId === worldState.deathMarker.poiId && !worldState.deathMarker.immunityGranted;
    const isTimedImmunityActive = immunityUntil !== null && immunityUntil > Date.now();
    const isPlayerCurrentlyImmune = isTimedImmunityActive || needsDeathImmunityThisRender;

    useAggression(session.currentPoiId, true, isBusy, isInCombat, char.combatLevel, startCombat, addLog, monsterRespawnTimers, devMode.configAggroIds, devMode.isPlayerInvisible, isPlayerCurrentlyImmune, inv.equipment, inv.setEquipment, worldState, repeatableQuests.activePlayerQuest);
    
    useEffect(() => { questLogic.checkGatherQuests(); }, [inv.inventory, questLogic]);

    useEffect(() => {
        if (initialState.settings) {
            const s = initialState.settings;
            ui.setShowTooltips(s.showTooltips);
            ui.setShowXpDrops(s.showXpDrops);
            ui.setConfirmValuableDrops(s.confirmValuableDrops);
            ui.setValuableDropThreshold(s.valuableDropThreshold);
            ui.setShowMinimapHealth(s.showMinimapHealth);
            ui.setShowCombatPlayerHealth(s.showCombatPlayerHealth);
            ui.setShowCombatEnemyHealth(s.showCombatEnemyHealth);
            ui.setShowHitsplats(s.showHitsplats);
            ui.setIsOneClickMode(s.isOneClickMode);
        }
    }, [initialState.settings, ui]);
    
    const handleNonNpcActivity = useCallback((activity: POIActivity) => {
        if (ui.activeDialogue) {
            ui.setActiveDialogue(null);
        }
        if (char.isStunned) { addLog("You are stunned and cannot perform actions."); return; }
        if (activity.type === 'shop') ui.setActiveShopId(activity.shopId);
        else if (activity.type === 'bank') ui.setActivePanel('bank');
        else if (activity.type === 'slayer_master') slayer.handleSlayerMasterInteraction();
        else if (activity.type === 'blimp_travel') {
            const slayerLevel = char.skills.find(s => s.name === SkillName.Slayer)?.level ?? 1;
            if (slayerLevel < activity.requiredSlayerLevel) addLog(`You need a Slayer level of ${activity.requiredSlayerLevel} to use this service.`);
            else addLog("The blimp service to other regions is not yet available.");
        }
        else if (activity.type === 'cooking_range') ui.openCraftingView({ type: 'cooking_range' });
        else if (activity.type === 'furnace') ui.openCraftingView({ type: 'furnace' });
        else if (activity.type === 'anvil') ui.openCraftingView({ type: 'anvil' });
        else if (activity.type === 'bookbinding_workbench') ui.openCraftingView({ type: 'bookbinding' });
        else if (activity.type === 'spinning_wheel') ui.openCraftingView({ type: 'spinning_wheel' });
        else if (activity.type === 'wishing_well') worldActions.handleWishingWell();
        else if (activity.type === 'water_source') worldActions.handleCollectWater();
        else if (activity.type === 'milking') worldActions.handleMilking();
        else if (activity.type === 'quest_board') ui.setActiveQuestBoardId(session.currentPoiId);
        else if (activity.type === 'ancient_chest') worldActions.handleOpenAncientChest();
        else if (activity.type === 'runecrafting_altar') crafting.handleInstantRunecrafting(activity.runeId);
        else if (activity.type === 'ladder') navigation.handleForcedNavigate(activity.toPoiId);
    }, [char, addLog, ui, slayer, worldActions, crafting, navigation, session]);

    const handleActivityClickWrapper = (activity: POIActivity) => {
        if (ui.itemToUse) {
            itemActions.handleUseItemOnActivity(ui.itemToUse, activity);
            ui.setItemToUse(null);
        } else if (ui.spellToCast) {
            addLog("You can't cast that on the environment.");
            ui.setSpellToCast(null);
        } else if (activity.type === 'npc') {
            sceneInteractions.handleActivityClick(activity);
        } else {
            handleNonNpcActivity(activity);
        }
    };
    
    useEffect(() => { if (ui.activePanel === null) ui.setActivePanel('inventory'); }, []);

    const isBankOpen = ui.activePanel === 'bank';
    const isShopOpen = !!ui.activeShopId;
    
    const handleBonfireTick = useCallback(() => {
        const now = Date.now();
        setBonfires(prevBonfires => {
            const activeBonfires: BonfireActivity[] = [];
            let changed = false;
            prevBonfires.forEach(bonfire => {
                if (now >= bonfire.expiresAt) {
                    changed = true;
                    onItemDropped({ itemId: 'ashes', quantity: 1 }, bonfire.poiId);
                    addLog("A fire has burnt out, leaving a pile of ashes.");
                } else {
                    activeBonfires.push(bonfire);
                }
            });
            return changed ? activeBonfires : prevBonfires;
        });
    }, [addLog, onItemDropped]);
    
    const bonfireCallbackRef = useRef(handleBonfireTick);
    useEffect(() => { bonfireCallbackRef.current = handleBonfireTick; });

    useEffect(() => {
        const interval = setInterval(() => bonfireCallbackRef.current(), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleToggleBankPlaceholders = useCallback(() => {
        setWorldState(ws => ({ ...ws, bankPlaceholders: !ws.bankPlaceholders }));
    }, []);
    
    const handleDeathMarkerTick = useCallback(() => {
        setWorldState(ws => {
            if (!ws.deathMarker) return ws;
            const newTime = ws.deathMarker.timeRemaining - 1000;
            if (newTime <= 0) {
                addLog("Your dropped items from your previous death have disappeared.");
                clearDeathPileItemsAtPoi(ws.deathMarker.poiId);
                return { ...ws, deathMarker: null };
            }
            return { ...ws, deathMarker: { ...ws.deathMarker, timeRemaining: newTime } };
        });
    }, [addLog, clearDeathPileItemsAtPoi]);

    const deathMarkerCallbackRef = useRef(handleDeathMarkerTick);
    useEffect(() => { deathMarkerCallbackRef.current = handleDeathMarkerTick; });

    useEffect(() => {
        const timer = setInterval(() => deathMarkerCallbackRef.current(), 1000);
        return () => clearInterval(timer);
    }, []);

    // Immunity Timer Logic
    useEffect(() => {
        if (immunityUntil === null || immunityUntil <= Date.now()) {
            setImmunityTimeLeft(0);
            return;
        }
    
        const timer = setInterval(() => {
            const remaining = immunityUntil - Date.now();
            if (remaining > 0) {
                setImmunityTimeLeft(Math.ceil(remaining / 1000));
            } else {
                setImmunityUntil(null);
                addLog("Your aggression immunity has worn off.");
            }
        }, 1000);
    
        // Set initial time immediately
        const initialRemaining = immunityUntil - Date.now();
        if (initialRemaining > 0) {
            setImmunityTimeLeft(Math.ceil(initialRemaining / 1000));
        } else {
            setImmunityUntil(null);
        }
    
        return () => clearInterval(timer);
    }, [immunityUntil, addLog]);

     // POI Immunity Timer UI Logic
    useEffect(() => {
        const poiImmunityExpiry = worldState.poiImmunity?.[session.currentPoiId];
        if (!poiImmunityExpiry) {
            setPoiImmunityTimeLeft(0);
            return;
        }
        const timer = setInterval(() => {
            const now = Date.now();
            if (now < poiImmunityExpiry) {
                setPoiImmunityTimeLeft(Math.ceil((poiImmunityExpiry - now) / 1000));
            } else {
                setPoiImmunityTimeLeft(0);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [worldState.poiImmunity, session.currentPoiId]);
    
    // Grant Immunity on Entering Death POI
    useEffect(() => {
        const needsImmunity = !!worldState.deathMarker && session.currentPoiId === worldState.deathMarker.poiId && !worldState.deathMarker.immunityGranted;
        if (needsImmunity) {
            const immunityDuration = 30 * 1000;
            setImmunityUntil(Date.now() + immunityDuration);
            addLog(`You are immune to monster aggression for 30 seconds.`);
            setWorldState(ws => {
                if (!ws.deathMarker) return ws;
                return { ...ws, deathMarker: { ...ws.deathMarker, immunityGranted: true } };
            });
        }
    }, [session.currentPoiId, worldState.deathMarker, addLog, setWorldState]);
    
    // Dev Handlers
    const handleHealPlayer = () => char.setCurrentHp(char.maxHp);
    const handleKillMonster = () => { if (ui.combatQueue.length > 0) setKillTrigger(k => k + 1); };
    const handleAddCoins = (amount: number) => inv.modifyItem('coins', amount, false);
    const handleSetSkillLevel = (skill: SkillName, level: number) => char.setSkillLevel(skill, level);
    const handleResetQuest = (questId: string) => quests.resetQuest(questId, addLog);

    const devPanelProps = {
        inv,
        setTooltip: ui.setTooltip,
        devPanelState: devMode.devPanelState,
        updateDevPanelState: devMode.updateDevPanelState,
        combatSpeedMultiplier: devMode.combatSpeedMultiplier,
        setCombatSpeedMultiplier: devMode.setCombatSpeedMultiplier,
        isInstantRespawnOn: devMode.isInstantRespawnOn,
        setIsInstantRespawnOn: devMode.setIsInstantRespawnOn,
        instantRespawnCounter: devMode.instantRespawnCounter,
        setInstantRespawnCounter: devMode.setInstantRespawnCounter,
        isInCombat: ui.combatQueue.length > 0,
        isCurrentMonsterAggro: devMode.isCurrentMonsterAggro,
        onToggleAggro: devMode.onToggleAggro,
        isPlayerInvisible: devMode.isPlayerInvisible,
        setIsPlayerInvisible: devMode.setIsPlayerInvisible,
        isAutoBankOn: devMode.isAutoBankOn,
        setIsAutoBankOn: devMode.setIsAutoBankOn,
        isTouchSimulationEnabled: devMode.isTouchSimulationEnabled,
        onToggleTouchSimulation: devMode.onToggleTouchSimulation,
        isMapManagerEnabled: false, // Stub for now
        onToggleMapManager: () => {}, // Stub
        onCommitMapChanges: () => {}, // Stub
        hasMapChanges: false, // Stub
        showAllPois: devMode.showAllPois,
        onToggleShowAllPois: () => devMode.setShowAllPois(p => !p),
        onForcedNavigate: navigation.handleForcedNavigate,
        xpMultiplier: devMode.xpMultiplier,
        setXpMultiplier: devMode.setXpMultiplier,
        isXpBoostEnabled: devMode.isXpBoostEnabled,
        setIsXpBoostEnabled: devMode.setIsXpBoostEnabled,
        onClose: () => ui.setIsDevPanelOpen(false),
        onHealPlayer: handleHealPlayer,
        onKillMonster: handleKillMonster,
        onAddCoins: handleAddCoins,
        onSetSkillLevel: handleSetSkillLevel,
        onResetQuest: handleResetQuest,
        ui,
    };

    return (
        <>
            <div className="w-full md:w-4/5 flex flex-col gap-2 relative">
                <div className="bg-black/70 border-2 border-gray-600 rounded-lg p-4 flex-grow min-h-0 relative overflow-y-auto md:overflow-visible">
                    <MainViewController {...{itemActions, char, inv, quests, bank, bankLogic, shops, crafting, repeatableQuests, navigation, worldActions, slayer, questLogic, skilling, interactQuest, session, clearedSkillObstacles, monsterRespawnTimers, handlePlayerDeath, handleKill, onWinCombat, onFleeFromCombat, onResponse, handleDialogueCheck, combatSpeedMultiplier: devMode.combatSpeedMultiplier, activeCombatStyleHighlight: null, isTouchSimulationEnabled: devMode.isTouchSimulationEnabled, isMapManagerEnabled: false, poiCoordinates: undefined, regionCoordinates: undefined, onUpdatePoiCoordinate: undefined, poiConnections: undefined, onUpdatePoiConnections: undefined, addLog, ui, initialState, showAllPois: devMode.showAllPois, groundItemsForCurrentPoi, onPickUpItem: handlePickUpItem, onTakeAllLoot: handleTakeAllLoot, onItemDropped, isAutoBankOn: devMode.isAutoBankOn, handleCombatXpGain: char.addXp, immunityTimeLeft, poiImmunityTimeLeft, killTrigger, bankPlaceholders: worldState.bankPlaceholders ?? false, handleToggleBankPlaceholders, bonfires: bonfires.filter(b => b.uniqueId.startsWith(session.currentPoiId)), onStokeBonfire: crafting.handleStokeBonfire, isStunned: char.isStunned, addBuff: char.addBuff, isDevMode: devMode.isDevMode, onToggleDevPanel: () => ui.setIsDevPanelOpen(true), onToggleTouchSimulation: devMode.onToggleTouchSimulation, onDepositEquipment: () => bankLogic.handleDepositEquipment(ui.activeBankTabId), deathMarker: worldState.deathMarker, activeRepeatableQuest: repeatableQuests.activePlayerQuest, onActivity: handleActivityClickWrapper, onEncounterWin: handleEncounterWin, isOneClickMode: ui.isOneClickMode, onExportGame, onImportGame, onResetGame }} />
                    {levelUpInfo && <LevelUpAnimation skill={levelUpInfo.skill} level={levelUpInfo.level} />}
                    {groundItemsForCurrentPoi.length > 0 && (
                        <button
                            onClick={() => ui.setIsLootViewOpen(true)}
                            className="absolute bottom-4 left-4 z-20 flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/80 animate-fade-in"
                            aria-label={`Loot ${groundItemsForCurrentPoi.length} items`}
                            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
                        >
                            <img src="https://api.iconify.design/game-icons:swap-bag.svg" alt="" className="w-8 h-8 filter invert drop-shadow-lg" />
                            <span className="font-bold text-white text-lg">Loot ({groundItemsForCurrentPoi.length})</span>
                        </button>
                    )}
                </div>
                <div className={`md:flex-shrink-0 relative`}>
                    <ActivityLog logs={activityLog} isDialogueActive={!!ui.activeDialogue} />
                    {ui.activeDialogue && <DialogueOverlay dialogue={ui.activeDialogue} setActivePanel={ui.setActivePanel} />}
                </div>
            </div>
            <div className="w-full md:w-1/5 flex flex-col">
                <SidePanel {...{ui, initialState, char, inv, quests, repeatableQuests, slayer, onExportGame, onImportGame, onResetGame, isDevMode: devMode.isDevMode, isTouchSimulationEnabled: devMode.isTouchSimulationEnabled, onToggleTouchSimulation: devMode.onToggleTouchSimulation, itemActions, isBusy, handleExamine: itemActions.handleExamine, session, addLog, activeCombatStyleHighlight: null, onNavigate: navigation.handleNavigate, unlockedPois: navigation.reachablePois, isBankOpen, isShopOpen, onDeposit: (inventoryIndex, quantity) => bankLogic.handleDeposit(inventoryIndex, quantity, ui.activeBankTabId), onCastSpell: spellcasting.onCastSpell, onSpellOnItem: spellActions.handleSpellOnItem, isEquipmentStatsOpen: !!ui.equipmentStats, isOneClickMode: ui.isOneClickMode}} />
            </div>
            {ui.showXpDrops && <XpTracker drops={xpDrops} onRemoveDrop={removeXpDrop} />}
            {ui.isDevPanelOpen && (
                <div className="absolute inset-0 bg-black/80 flex justify-end z-40 p-2 pointer-events-none" onClick={() => ui.setIsDevPanelOpen(false)}>
                    <div className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-md h-full flex flex-col pointer-events-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <DevPanel {...devPanelProps} />
                    </div>
                </div>
            )}
             {ui.isMonsterDBOpen && (
                <MonsterDBView
                    monsters={devMode.monsterData}
                    setMonsters={devMode.setMonsterData}
                    modifiedMonsters={devMode.modifiedMonsters}
                    setModifiedMonsters={devMode.setModifiedMonsters}
                    onClose={() => ui.setIsMonsterDBOpen(false)}
                    setTooltip={ui.setTooltip}
                    onCommit={devMode.handleCommitMapChanges}
                    hasChanges={devMode.modifiedMonsters.size > 0}
                />
            )}
            {ui.isAtlasViewOpen && (
                <AtlasView
                    currentPoiId={session.currentPoiId}
                    unlockedPois={navigation.reachablePois}
                    onClose={() => ui.setIsAtlasViewOpen(false)}
                    setTooltip={ui.setTooltip}
                    showAllPois={devMode.showAllPois}
                    deathMarker={worldState.deathMarker}
                />
            )}
            {ui.isExpandedMapViewOpen && (
                <ExpandedMapView
                    currentPoiId={session.currentPoiId}
                    unlockedPois={navigation.reachablePois}
                    onNavigate={navigation.handleNavigate}
                    onClose={() => ui.setIsExpandedMapViewOpen(false)}
                    setTooltip={ui.setTooltip}
                    addLog={addLog}
                    isMapManagerEnabled={false}
                    showAllPois={devMode.showAllPois}
                    onCommitMapChanges={() => {}}
                    activeMapRegionId={ui.activeMapRegionId}
                    setActiveMapRegionId={ui.setActiveMapRegionId}
                    deathMarker={worldState.deathMarker}
                />
            )}
            {ui.activeSkillGuide && <SkillGuideView activeSkill={ui.activeSkillGuide} setActiveSkill={ui.setActiveSkillGuide} onClose={ui.closeSkillGuide} playerSkills={char.skills} />}
        </>
    );
};

export default Game;
