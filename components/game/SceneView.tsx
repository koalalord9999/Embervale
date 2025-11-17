
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { POI, POIActivity, PlayerQuestState, SkillName, InventorySlot, ResourceNodeState, PlayerRepeatableQuest, SkillRequirement, PlayerSkill, DialogueNode, GroundItem, DialogueResponse, Quest, BonfireActivity, DialogueAction, DialogueCheckRequirement, ThievingContainerState, Monster, WorldState, WeaponType, Equipment } from '../../types';
import { MONSTERS, QUESTS, SHOPS, ITEMS, REGIONS, FIREMAKING_RECIPES, SKILL_ICONS, THIEVING_CONTAINER_TARGETS, THIEVING_STALL_TARGETS } from '../../constants';
import { POIS } from '../../data/pois';
import Button from '../common/Button';
import { ContextMenuOption } from '../common/ContextMenu';
import { MakeXPrompt, TooltipState, useUIState, ContextMenuState, DialogueState } from '../../hooks/useUIState';
import ProgressBar from '../common/ProgressBar';
import { useSkillingAnimations } from '../../hooks/useSkillingAnimations';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { useLongPress } from '../../hooks/useLongPress';
import { useWorldActions } from '../../hooks/useWorldActions';

type SkillingActivity = Extract<POIActivity, { type: 'skilling' }>;
type LockpickActivity = Extract<POIActivity, { type: 'thieving_lockpick' }>;
type StallActivity = Extract<POIActivity, { type: 'thieving_stall' }>;
type PickpocketData = NonNullable<Extract<POIActivity, { type: 'npc' }>['pickpocket']>;
type GridItem = POI | { type: 'obstacle'; fromPoiId: string; toPoiId: string; requirement: SkillRequirement };


interface SceneViewProps {
    poi: POI;
    unlockedPois: string[];
    onNavigate: (poiId: string) => void;
    onActivity: (activity: POIActivity) => void;
    onStartCombat: (uniqueInstanceId: string) => void;
    playerQuests: PlayerQuestState[];
    inventory: (InventorySlot | null)[];
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    addLog: (message: string) => void;
    startQuest: (questId: string, addLog: (message: string) => void) => void;
    hasItems: (items: { itemId: string; quantity: number }[]) => boolean;
    resourceNodeStates: Record<string, ResourceNodeState>;
    activeSkillingNodeId: string | null;
    onToggleSkilling: (activity: SkillingActivity) => void;
    initializeNodeState: (nodeId: string, activity: SkillingActivity) => void;
    skillingTick: number;
    getSuccessChance: (activity: SkillingActivity) => number;
    activeRepeatableQuest: PlayerRepeatableQuest | null;
    activeCleanup: { quest: PlayerRepeatableQuest; startTime: number; duration: number } | null;
    onStartInteractQuest: (quest: PlayerRepeatableQuest) => void;
    onCancelInteractQuest: () => void;
    clearedSkillObstacles: string[];
    onClearObstacle: (fromPoiId: string, toPoiId: string, requirement: SkillRequirement) => void;
    skills: (PlayerSkill & { currentLevel: number; })[];
    monsterRespawnTimers: Record<string, number>;
    setActiveDialogue: (dialogue: DialogueState | null) => void;
    handleDialogueCheck: (requirements: DialogueCheckRequirement[]) => boolean;
    onResponse: (response: DialogueResponse) => void;
    onDepositBackpack: () => void;
    onDepositEquipment: () => void;
    ui: ReturnType<typeof useUIState>;
    isTouchSimulationEnabled: boolean;
    worldActions: ReturnType<typeof useWorldActions>;
    bonfires: BonfireActivity[];
    onStokeBonfire: (logId: string, bonfireId: string) => void;
    isOneClickMode: boolean;
    onPickpocket: (target: { name: string; pickpocket: PickpocketData }, targetInstanceId: string) => void;
    onLockpick: (activity: LockpickActivity) => void;
    onPilfer: (activity: Extract<POIActivity, { type: 'thieving_pilfer' }>) => void;
    thievingContainerStates: Record<string, ThievingContainerState>;
    onStealFromStall: (activity: StallActivity) => void;
    worldState: WorldState;
    groundItemsForCurrentPoi: GroundItem[];
    handleCutCactus: () => void;
    equipment: Equipment;
}

const PilferButton: React.FC<{
    activity: Extract<POIActivity, { type: 'thieving_pilfer' }>;
    sceneProps: SceneViewProps;
}> = ({ activity, sceneProps }) => {
    const { onPilfer, setTooltip, skills, worldState, setContextMenu, isOneClickMode, isTouchSimulationEnabled } = sceneProps;
    const isTouchDevice = useIsTouchDevice(isTouchSimulationEnabled);
    const isDepleted = worldState.depletedHouses?.includes(activity.id);

    // Call hook unconditionally at the top of the component
    const customHandlers = useLongPress({
        onLongPress: (e: React.MouseEvent | React.TouchEvent) => {
            let eventForMenu: React.MouseEvent | React.Touch;
            if ('touches' in e && e.touches.length > 0) {
                eventForMenu = e.touches[0];
            } else if ('changedTouches' in e && e.changedTouches.length > 0) {
                eventForMenu = e.changedTouches[0];
            } else {
                eventForMenu = e as React.MouseEvent;
            }
            const options: ContextMenuOption[] = [
                { label: 'Pick Lock', onClick: () => {
                    onPilfer(activity);
                    setTooltip(null);
                }, disabled: isDepleted }
            ];
            setContextMenu({ options, triggerEvent: eventForMenu, isTouchInteraction: isTouchDevice, title: activity.name });
        },
        onClick: () => {
            if (isDepleted) return;
            onPilfer(activity);
            setTooltip(null);
        },
        isOneClickMode: isOneClickMode,
    });

    // Perform conditional checks *after* all hooks have been called
    const houseInfo = worldState.generatedHouses?.[activity.id];
    if (!houseInfo) return null;

    const containerData = THIEVING_CONTAINER_TARGETS[houseInfo.tierId];
    if (!containerData) return null;

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (isDepleted) {
            setTooltip({ content: <p>This house has been recently pilfered. Check back later.</p>, position: { x: e.clientX, y: e.clientY } });
            return;
        }
        const thievingSkill = skills.find(s => s.name === SkillName.Thieving)?.currentLevel ?? 1;
        const requiredLevel = containerData.level;
        const hasLevel = thievingSkill >= requiredLevel;
        const levelColor = hasLevel ? 'text-green-400' : 'text-red-400';
        const tooltipContent = (
            <div>
                <p className="font-bold text-yellow-300">{activity.name}</p>
                <p className={`text-sm ${levelColor}`}>Requires Thieving: {requiredLevel}</p>
            </div>
        );
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <Button
            {...customHandlers}
            disabled={isDepleted}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            {isDepleted ? 'Recently Pilfered' : activity.name}
        </Button>
    );
};

const CleanupProgress: React.FC<{
    startTime: number;
    duration: number;
    title: string;
    onCancel: () => void;
}> = ({ startTime, duration, title, onCancel }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let frameId: number;
        const update = () => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min(100, (elapsed / duration) * 100);
            setProgress(newProgress);
            if (newProgress < 100) {
                frameId = requestAnimationFrame(update);
            }
        };
        frameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId);
    }, [startTime, duration]);

    return (
        <div className="flex flex-col gap-2 items-center">
            <p className="font-semibold">{title}...</p>
            <div className="w-full">
                <ProgressBar value={progress} maxValue={100} color="bg-green-600" />
            </div>
            <Button onClick={onCancel} variant="secondary" size="sm">Cancel</Button>
        </div>
    );
};

const ActionableButton: React.FC<{
    activity: POIActivity;
    index: number;
    handleActivityClick: (activity: POIActivity) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    ui: ReturnType<typeof useUIState>;
    onDepositBackpack: () => void;
    onDepositEquipment: () => void;
    isTouchDevice: boolean;
    worldActions: ReturnType<typeof useWorldActions>;
    isOneClickMode: boolean;
    poi: POI;
    onStartCombat: (uniqueInstanceId: string) => void;
    onPickpocket: (target: { name: string; pickpocket: PickpocketData }, targetInstanceId: string) => void;
}> = ({ activity, index, handleActivityClick, setContextMenu, ui, onDepositBackpack, onDepositEquipment, isTouchDevice, worldActions, isOneClickMode, poi, onStartCombat, onPickpocket }) => {
    
    let text = 'Interact';
    switch (activity.type) {
        case 'shop': text = `Visit ${SHOPS[activity.shopId].name}`; break;
        case 'quest_start': text = `Talk about '${QUESTS[activity.questId].name}'`; break;
        case 'npc': text = activity.name; break;
        case 'slayer_master': text = `Talk to ${activity.name}`; break;
        case 'cooking_range': text = 'Use Cooking Range'; break;
        case 'furnace': text = 'Use Furnace'; break;
        case 'anvil': text = 'Use Anvil'; break;
        case 'bank': text = 'Use Bank'; break;
        case 'wishing_well': text = 'Toss a coin in the well'; break;
        case 'bookbinding_workbench': text = 'Bind Books'; break;
        case 'quest_board': text = 'Check the Quest Board'; break;
        case 'spinning_wheel': text = 'Use Spinning Wheel'; break;
        case 'water_source': text = activity.name; break;
        case 'milking': text = 'Milk a Cow'; break;
        case 'windmill': text = 'Collect Flour'; break;
        case 'ancient_chest': text = activity.name; break;
        case 'ladder': text = activity.name; break;
        case 'cut_cactus': text = activity.name; break;
    }

    const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
        if (isOneClickMode) {
            onLongPress(e);
            return;
        }
        ui.setTooltip(null);
        handleActivityClick(activity);
    };

    const onLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        let eventForMenu: React.MouseEvent | React.Touch;
        if ('touches' in e && e.touches.length > 0) {
            eventForMenu = e.touches[0];
        } else if ('changedTouches' in e && e.changedTouches.length > 0) {
            eventForMenu = e.changedTouches[0];
        } else {
            eventForMenu = e as React.MouseEvent;
        }

        let options: ContextMenuOption[] = [];

        if (activity.type === 'npc') {
            const isBanker = activity.actions && activity.actions.some(a => a.action === 'open_bank');
            if (!isBanker) {
                options.push({ label: 'Talk to', onClick: () => { handleActivityClick(activity); setContextMenu(null); } });
            }

            if (activity.pickpocket) {
                options.push({
                    label: 'Pickpocket',
                    onClick: () => {
                        const uniqueInstanceId = `${poi.id}:${activity.name}:${index}`;
                        onPickpocket({ name: activity.name, pickpocket: activity.pickpocket }, uniqueInstanceId);
                        setContextMenu(null);
                    }
                });
            }

            if (activity.attackableMonsterId) {
                options.push({
                    label: 'Attack',
                    onClick: () => {
                        const uniqueInstanceId = `${poi.id}:${activity.attackableMonsterId}:${index}`;
                        onStartCombat(uniqueInstanceId);
                        setContextMenu(null);
                    }
                });
            }

            if (activity.actions) {
                activity.actions.forEach(action => {
                    let onClick = () => {};
                    if (action.action === 'open_bank') onClick = () => ui.setActivePanel('bank');
                    else if (action.action === 'deposit_backpack') onClick = onDepositBackpack;
                    else if (action.action === 'deposit_equipment') onClick = onDepositEquipment;
                    options.push({ label: action.label, onClick: () => { onClick(); setContextMenu(null); } });
                });
            }
        } else if (activity.type === 'furnace') {
            options = [
                { label: 'Smelt', onClick: () => { ui.openCraftingView({ type: 'furnace' }); setContextMenu(null); } },
                { label: 'Craft Jewelry', onClick: () => { ui.openCraftingView({ type: 'jewelry' }); setContextMenu(null); } }
            ];
        } else if (activity.type === 'anvil') {
            options = [{ label: 'Smith', onClick: () => { ui.openCraftingView({ type: 'anvil' }); setContextMenu(null); } }];
        } else if (activity.type === 'windmill') {
            options = [
                { label: 'Collect Flour', onClick: () => { worldActions.handleCollectFlour(); setContextMenu(null); } },
                { label: 'Mill Wheat', onClick: () => { worldActions.handleMillWheat(); setContextMenu(null); } },
            ];
        }
        
        if (options.length > 0) {
            setContextMenu({ options, triggerEvent: eventForMenu, isTouchInteraction: isTouchDevice, title: text });
        }
    }
    
    const hasContextMenu = (activity.type === 'npc' || activity.type === 'furnace' || activity.type === 'anvil' || activity.type === 'windmill');

    const customHandlers = hasContextMenu ? useLongPress({
        onLongPress,
        onClick: handleClick
    }) : { onClick: handleClick };
    
    const tutorialId = `activity-button-${index}`;

    return (
        <button
            data-tutorial-id={tutorialId}
            className="font-bold rounded-md shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 bg-yellow-700 hover:bg-yellow-600 border-2 border-yellow-800 hover:border-yellow-700 text-white focus:ring-yellow-500 px-2 py-1 text-sm w-full"
            {...customHandlers}
        >
            {text}
        </button>
    );
};

const BonfireButton: React.FC<{
    activity: BonfireActivity;
    inventory: (InventorySlot | null)[];
    skills: (PlayerSkill & { currentLevel: number; })[];
    onStokeBonfire: (logId: string, bonfireId: string) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    isTouchDevice: boolean;
    onActivity: (activity: POIActivity) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    isOneClickMode: boolean;
}> = ({ activity, inventory, skills, onStokeBonfire, setContextMenu, isTouchDevice, onActivity, setTooltip, isOneClickMode }) => {
    const [timeLeft, setTimeLeft] = useState(Math.max(0, activity.expiresAt - Date.now()));
    const firemakingLevel = skills.find(s => s.name === SkillName.Firemaking)?.currentLevel ?? 1;

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = activity.expiresAt - Date.now();
            if (remaining > 0) {
                setTimeLeft(remaining);
            } else {
                setTimeLeft(0);
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [activity.expiresAt]);
    
    const onLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        let eventForMenu: React.MouseEvent | React.Touch;
        if ('touches' in e && e.touches.length > 0) {
            eventForMenu = e.touches[0];
        } else if ('changedTouches' in e && e.changedTouches.length > 0) {
            eventForMenu = e.changedTouches[0];
        } else {
            eventForMenu = e as React.MouseEvent;
        }
        
        const usableLogs = FIREMAKING_RECIPES
            .filter(recipe => inventory.some(slot => slot?.itemId === recipe.logId) && firemakingLevel >= recipe.level)
            .sort((a, b) => b.level - a.level);

        const bestLogToUse = usableLogs.length > 0 ? usableLogs[0] : null;

        const stokeOption: ContextMenuOption = bestLogToUse
            ? {
                label: 'Stoke Fire',
                onClick: () => onStokeBonfire(bestLogToUse.logId, activity.uniqueId),
              }
            : {
                label: 'No usable logs',
                onClick: () => {},
                disabled: true,
              };

        const options: ContextMenuOption[] = [
            { label: 'Cook', onClick: () => { setTooltip(null); onActivity({ type: 'cooking_range' }); } },
            stokeOption,
        ];
        
        setContextMenu({ options, triggerEvent: eventForMenu, isTouchInteraction: isTouchDevice, title: "Bonfire" });
    };

    const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
        if (isOneClickMode) {
            onLongPress(e);
            return;
        }
        setTooltip(null);
        onActivity({ type: 'cooking_range' });
    };
    
    const longPressHandlers = useLongPress({
        onLongPress,
        onClick: handleClick,
    });

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const originalRecipe = FIREMAKING_RECIPES.find(r => r.logId === activity.logId);
    const heatColor = originalRecipe ? `hsl(${originalRecipe.level * 2.5 + 10}, 80%, 40%)` : '#d97706';

    return (
        <Button
            variant="primary"
            className="w-full h-11 flex flex-col items-center justify-center border-orange-600 hover:border-orange-500"
            style={{ backgroundColor: heatColor }}
            {...longPressHandlers}
            title="A bonfire. Click to cook, or right-click/long-press to stoke."
        >
            <img src={SKILL_ICONS.Firemaking} alt="Bonfire" className="w-6 h-6 filter invert" />
            <span className="text-xs font-bold">{formatTime(timeLeft)}</span>
        </Button>
    );
};


const SceneView: React.FC<SceneViewProps> = (props) => {
    const { poi, unlockedPois, onNavigate, onActivity, onStartCombat, playerQuests, inventory, setContextMenu, setMakeXPrompt, setTooltip, addLog, startQuest, hasItems, resourceNodeStates, activeSkillingNodeId, onToggleSkilling, initializeNodeState, skillingTick, getSuccessChance, activeRepeatableQuest, activeCleanup, onStartInteractQuest, onCancelInteractQuest, clearedSkillObstacles, onClearObstacle, skills, monsterRespawnTimers, setActiveDialogue, handleDialogueCheck, onResponse, onDepositBackpack, onDepositEquipment, ui, isTouchSimulationEnabled, worldActions, bonfires, onStokeBonfire, isOneClickMode, onPickpocket, onLockpick, onPilfer, thievingContainerStates, onStealFromStall, worldState, groundItemsForCurrentPoi, handleCutCactus, equipment } = props;
    const { depletedNodesAnimating } = useSkillingAnimations(resourceNodeStates, poi.activities);
    const [countdown, setCountdown] = useState<Record<string, number>>({});
    const [shakingNodeId, setShakingNodeId] = useState<string | null>(null);
    const isTouchDevice = useIsTouchDevice(isTouchSimulationEnabled);

    const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);
    const [areActionsVisible, setAreActionsVisible] = useState(true);

    useEffect(() => {
        // When POI changes, always show the actions list.
        setAreActionsVisible(true);
    }, [poi.id]);
    
    useEffect(() => {
        if (activeSkillingNodeId) {
            setShakingNodeId(activeSkillingNodeId);
            const timer = setTimeout(() => setShakingNodeId(null), 200); // Must be same duration as animation
            return () => clearTimeout(timer);
        }
    }, [skillingTick, activeSkillingNodeId]);
    
    useEffect(() => {
        poi.activities.forEach(activity => {
            if (activity.type === 'skilling') {
                initializeNodeState(activity.id, activity);
            }
        });
    }, [poi, initializeNodeState]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const newCountdown: Record<string, number> = {};
            poi.activities.forEach((activity, index) => {
                if (activity.type === 'combat') {
                    const uniqueInstanceId = `${poi.id}:${activity.monsterId}:${index}`;
                    const respawnTime = monsterRespawnTimers[uniqueInstanceId];
                    if (respawnTime && respawnTime > now) {
                        newCountdown[uniqueInstanceId] = Math.ceil((respawnTime - now) / 1000);
                    }
                }
            });
            setCountdown(newCountdown);
        }, 1000);
        return () => clearInterval(interval);
    }, [monsterRespawnTimers, poi.id, poi.activities]);

    const gridItems = useMemo(() => {
        const grid: GridItem[][] = Array(9).fill(null).map(() => []);
    
        const getDirectionalGridIndex = (angle: number): number => {
            if (angle > -22.5 && angle <= 22.5) return 5; // E
            if (angle > 22.5 && angle <= 67.5) return 8; // SE
            if (angle > 67.5 && angle <= 112.5) return 7; // S
            if (angle > 112.5 && angle <= 157.5) return 6; // SW
            if (angle > 157.5 || angle <= -157.5) return 3; // W
            if (angle > -157.5 && angle <= -112.5) return 0; // NW
            if (angle > -112.5 && angle <= -67.5) return 1; // N
            if (angle > -67.5 && angle <= -22.5) return 2; // NE
            return 1; // Fallback
        };
    
        if (!poi.connections) return grid;
    
        poi.connections.forEach(connId => {
            const destinationPoi = POIS[connId];
            if (!destinationPoi) return;

            let startX = poi.internalX ?? poi.x;
            let startY = poi.internalY ?? poi.y;
            let endX, endY;

            // Handle city exits
            if (poi.type === 'internal' && destinationPoi.type !== 'internal') {
                // If the current internal POI has external coords, use them for calculating direction to the outside world.
                startX = poi.eX ?? startX;
                startY = poi.eY ?? startY;
                // The destination is an external POI, so its x/y are world coords.
                endX = destinationPoi.x;
                endY = destinationPoi.y;
            } 
            // Handle city entries
            else if (poi.type !== 'internal' && destinationPoi.type === 'internal') {
                // The current POI is external, its x/y are world coords.
                startX = poi.x;
                startY = poi.y;
                // The destination is an internal POI, use its external coords if available for direction calculation.
                endX = destinationPoi.eX ?? destinationPoi.x;
                endY = destinationPoi.eY ?? destinationPoi.y;
            } else {
                // Internal to Internal OR External to External
                endX = destinationPoi.internalX ?? destinationPoi.x;
                endY = destinationPoi.internalY ?? destinationPoi.y;
            }
    
            const dx = endX - startX;
            const dy = endY - startY;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const gridIndex = getDirectionalGridIndex(angle);
    
            const obstacleId = `${poi.id}-${connId}`;
            const requirement = poi.connectionRequirements?.[connId];
            if (requirement && !clearedSkillObstacles.includes(obstacleId)) {
                grid[gridIndex].push({
                    type: 'obstacle',
                    fromPoiId: poi.id,
                    toPoiId: connId,
                    requirement,
                });
            } else {
                grid[gridIndex].push(destinationPoi);
            }
        });
    
        return grid;
    }, [poi, clearedSkillObstacles]);

    const getActivityButton = (activity: POIActivity, index: number) => {
        if ((activity.type === 'npc' || activity.type === 'skilling' || activity.type === 'runecrafting_altar' || activity.type === 'ladder' || activity.type === 'quest_board') && activity.questCondition) {
            const questCond = activity.questCondition;
            const isRepeatableQuestActive = activeRepeatableQuest?.questId === questCond.questId;
    
            const mainQuest = playerQuests.find(q => q.questId === questCond.questId);
            let isMainQuestVisible = false;
            if (mainQuest) {
                if (mainQuest.isComplete) {
                    isMainQuestVisible = !!questCond.visibleAfterCompletion;
                } else {
                    isMainQuestVisible = questCond.stages.includes(mainQuest.currentStage);
                }
            }
    
            if (!isRepeatableQuestActive && !isMainQuestVisible) {
                return null;
            }
        }
        
        if (activity.type === 'cut_cactus') {
            const slashWeapons = [WeaponType.Sword, WeaponType.Scimitar, WeaponType.Dagger, WeaponType.Axe, WeaponType.Battleaxe];
            const equippedWeapon = equipment.weapon ? ITEMS[equipment.weapon.itemId] : null;
            const hasTool = (equippedWeapon && equippedWeapon.equipment?.weaponType && slashWeapons.includes(equippedWeapon.equipment.weaponType)) || hasItems([{ itemId: 'knife', quantity: 1 }]);
        
            const handleMouseEnter = (e: React.MouseEvent) => {
                if (!hasTool) {
                    setTooltip({
                        content: <p>You need a knife or a slash weapon to cut this.</p>,
                        position: { x: e.clientX, y: e.clientY }
                    });
                } else {
                    setTooltip({
                        content: <p>Cut open the cactus to fill a waterskin.</p>,
                         position: { x: e.clientX, y: e.clientY }
                    })
                }
            };
        
            return (
                <Button
                    key={activity.id}
                    onClick={() => { handleCutCactus(); setTooltip(null); }}
                    disabled={!hasTool}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={() => setTooltip(null)}
                >
                    {activity.name}
                </Button>
            );
        }
        
        if (activity.type === 'thieving_pilfer') {
            return <PilferButton key={activity.id} activity={activity} sceneProps={props} />;
        }

        if (activity.type === 'thieving_lockpick') {
            const containerData = THIEVING_CONTAINER_TARGETS[activity.lootTableId];
            if (!containerData) return null;

            let isDepleted = false;
            let respawnTimeSec = 0;

            if (activity.id.startsWith('pilfer_')) {
                isDepleted = worldState.activePilferingSession?.lootedContainerIds?.includes(activity.id) ?? false;
            } else {
                const containerState = thievingContainerStates[activity.id];
                isDepleted = containerState?.depleted ?? false;
                respawnTimeSec = containerState ? Math.ceil(containerState.respawnTimer / 1000) : 0;
            }

            const isDisabled = isDepleted;
            
            let buttonText = `Lockpick ${activity.targetName}`;
            if (isDisabled) {
                buttonText = activity.id.startsWith('pilfer_') ? 'Looted' : `Looted (${respawnTimeSec}s)`;
            }
    
            const handleMouseEnter = (e: React.MouseEvent) => {
                if (isDepleted) {
                     setTooltip({ content: <p>This has already been looted.</p>, position: { x: e.clientX, y: e.clientY } });
                     return;
                }
                const thievingSkill = skills.find(s => s.name === SkillName.Thieving)?.currentLevel ?? 1;
                const requiredLevel = containerData.level;
                const hasLevel = thievingSkill >= requiredLevel;
                const levelColor = hasLevel ? 'text-green-400' : 'text-red-400';
                const tooltipContent = (
                    <div>
                        <p className="font-bold text-yellow-300">{`Lockpick ${activity.targetName}`}</p>
                        <p className={`text-sm ${levelColor}`}>Requires Thieving: {requiredLevel}</p>
                    </div>
                );
                setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
            };
    
            return (
                <Button
                    key={activity.id}
                    onClick={() => { onLockpick(activity); setTooltip(null); }}
                    disabled={isDisabled}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={() => setTooltip(null)}
                >
                    {buttonText}
                </Button>
            );
        }

        if (activity.type === 'thieving_stall') {
            const stallData = THIEVING_STALL_TARGETS[activity.lootTableId];
            if (!stallData) return null;

            const containerState = thievingContainerStates[activity.id];
            const isDepleted = containerState?.depleted ?? false;
            const respawnTimeSec = containerState ? Math.ceil(containerState.respawnTimer / 1000) : 0;
            const isDisabled = isDepleted;
            
            let buttonText = activity.name;
            if (isDisabled) {
                buttonText = `Empty (${respawnTimeSec}s)`;
            }

            const handleMouseEnter = (e: React.MouseEvent) => {
                if (isDepleted) {
                     setTooltip({ content: <p>This stall is empty.</p>, position: { x: e.clientX, y: e.clientY } });
                     return;
                }
                const thievingSkill = skills.find(s => s.name === SkillName.Thieving)?.currentLevel ?? 1;
                const requiredLevel = stallData.level;
                const hasLevel = thievingSkill >= requiredLevel;
                const levelColor = hasLevel ? 'text-green-400' : 'text-red-400';
                const tooltipContent = (
                    <div>
                        <p className="font-bold text-yellow-300">{activity.name}</p>
                        <p className={`text-sm ${levelColor}`}>Requires Thieving: {requiredLevel}</p>
                    </div>
                );
                setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
            };

            return (
                <Button
                    key={activity.id}
                    onClick={() => { onStealFromStall(activity as StallActivity); setTooltip(null); }}
                    disabled={isDisabled}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={() => setTooltip(null)}
                >
                    {buttonText}
                </Button>
            );
        }

        if (activity.type === 'skilling') {
            const animationSkill = depletedNodesAnimating[activity.id];
            if (animationSkill) {
                let buttonText = activity.name ?? `Gather ${ITEMS[activity.loot[0].itemId]?.name}`;
                if (activity.skill === SkillName.Woodcutting) buttonText = activity.name ?? 'Chop Trees';
                if (activity.skill === SkillName.Fishing) buttonText = activity.name ?? `Net ${ITEMS[activity.loot[0].itemId]?.name}`;
                if (activity.skill === SkillName.Mining) buttonText = activity.name ?? `Mine ${ITEMS[activity.loot[0].itemId]?.name}`;
                
                switch (animationSkill) {
                    case SkillName.Mining:
                        return (
                            <div key={`${activity.id}-anim`} className="w-full h-11">
                                <Button variant="primary" className="w-full animate-shatter-fall" disabled>{buttonText}</Button>
                            </div>
                        );
                    case SkillName.Woodcutting:
                        return (
                             <div key={`${activity.id}-anim`} className="w-full h-11 flex overflow-hidden animate-fade-out-slowly">
                                <div className="w-1/2 h-full animate-cut-apart-left">
                                    <Button variant="primary" className="w-[200%] h-full" disabled>{buttonText}</Button>
                                </div>
                                <div className="w-1/2 h-full animate-cut-apart-right">
                                    <Button variant="primary" className="w-[200%] h-full -ml-[100%]" disabled>{buttonText}</Button>
                                </div>
                            </div>
                        );
                    case SkillName.Fishing:
                         return (
                            <div key={`${activity.id}-anim`} className="w-full h-11">
                                <Button variant="primary" className="w-full animate-yank-up" disabled>{buttonText}</Button>
                            </div>
                        );
                    default:
                        return <div key={`${activity.id}-anim`} className="w-full h-11" />;
                }
            }

            const nodeState = resourceNodeStates[activity.id];
            const isActive = activeSkillingNodeId === activity.id;
            const isShaking = shakingNodeId === activity.id;

            const handleMouseEnter = (e: React.MouseEvent) => {
                const isDepleted = nodeState?.resources <= 0;
                if (isDepleted) {
                     setTooltip({ content: <p>This resource is depleted.</p>, position: { x: e.clientX, y: e.clientY } });
                     return;
                }
                
                let tooltipContent: React.ReactNode;
                const primaryLootItem = activity.loot[0] ? ITEMS[activity.loot[0].itemId] : null;
                let buttonText = activity.name ?? `Gather ${primaryLootItem?.name ?? 'Resources'}`;
                
                if (activity.skill === SkillName.Woodcutting || activity.skill === SkillName.Mining) {
                    const chance = getSuccessChance(activity as SkillingActivity);
                    
                    const successRate = chance / 100;
                    const attemptsPerHour = 3600000 / activity.gatherTime;
                    // For WC/Mining, we can assume the first loot entry is the primary one for XP.
                    const primaryLoot = activity.loot[0];
                    const xpPerSuccessfulLoot = primaryLoot.xp * primaryLoot.chance;
                    const avgXpPerAttempt = xpPerSuccessfulLoot * successRate;
                    const estimatedXpPerHour = Math.round(avgXpPerAttempt * attemptsPerHour);

                    tooltipContent = (
                        <div>
                            <p className="font-bold text-yellow-300">{buttonText}</p>
                            <p className="text-sm">Success Chance: <span className="font-semibold">{chance.toFixed(1)}%</span></p>
                            <p className="text-sm text-gray-400">Est. XP/hr: <span className="font-semibold text-gray-200">{estimatedXpPerHour.toLocaleString()}</span></p>
                        </div>
                    );
                } else {
                     tooltipContent = (
                        <div>
                            <p className="font-bold text-yellow-300">{buttonText}</p>
                        </div>
                    );
                }
                setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
            };

            if (isActive) {
                return (
                    <div 
                        key={activity.id} 
                        className={`relative w-full h-11 border-2 border-yellow-800 rounded-md overflow-hidden ${isShaking ? 'animate-shake' : ''}`}
                        onMouseEnter={(e) => {
                            setTooltip({ content: <p>Currently gathering...</p>, position: { x: e.clientX, y: e.clientY } });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        data-tutorial-id={`activity-button-${index}`}
                    >
                        <div className="absolute inset-0 animate-pulse-bg"></div>
                        <button onClick={() => { onToggleSkilling(activity); setTooltip(null); }} className="relative w-full h-full flex items-center justify-center font-bold text-white">
                            Stop
                        </button>
                    </div>
                );
            }

            const isDepleted = nodeState?.resources <= 0;
            const respawnTimeSec = nodeState ? Math.ceil(nodeState.respawnTimer / 1000) : 0;
            const isDisabled = isDepleted;
            
            const primaryLootItem = activity.loot[0] ? ITEMS[activity.loot[0].itemId] : null;
            let buttonText = activity.name ?? `Gather ${primaryLootItem?.name ?? 'Resources'}`;

            if (activity.skill === SkillName.Woodcutting) buttonText = activity.name ?? 'Chop Trees';
            if (activity.skill === SkillName.Fishing) buttonText = activity.name ?? `Net ${primaryLootItem?.name ?? 'Fish'}`;
            if (activity.skill === SkillName.Mining) buttonText = activity.name ?? `Mine ${primaryLootItem?.name ?? 'Ore'}`;

            if (isDisabled) buttonText = `Depleted (${respawnTimeSec}s)`;

            return (
                <Button 
                    key={activity.id} 
                    onClick={() => { onToggleSkilling(activity); setTooltip(null); }} 
                    disabled={isDisabled}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={() => setTooltip(null)}
                    data-tutorial-id={`activity-button-${index}`}
                >
                    {buttonText}
                </Button>
            );
        }

        if (activity.type === 'combat') {
            const monster = MONSTERS[activity.monsterId];
            if (!monster) {
                console.error(`Error: Monster with ID "${activity.monsterId}" not found in MONSTERS constant. This may be due to a data loading issue or circular dependency.`);
                return (
                    <Button key={`${activity.type}-${index}`} disabled variant="combat">
                        Error: Unknown Monster
                    </Button>
                );
            }

            const uniqueInstanceId = `${poi.id}:${activity.monsterId}:${index}`;
            const remainingTime = countdown[uniqueInstanceId];
            const isRecentlyKilled = worldState.recentlyKilled?.includes(uniqueInstanceId);
            let buttonText = `Fight ${monster.name}`;

            if (isRecentlyKilled) {
                buttonText = 'Defeated...';
            } else if (remainingTime > 0) {
                buttonText = `${monster.name} (${remainingTime}s)`;
            }
            
            const textColorClass = monster.aggressive ? 'text-red-400' : 'text-yellow-400';
            
            return (
                <Button 
                    key={uniqueInstanceId} 
                    onClick={() => onStartCombat(uniqueInstanceId)}
                    variant="combat"
                    className={textColorClass}
                    disabled={remainingTime > 0 || !!isRecentlyKilled}
                    data-tutorial-id={`activity-button-${index}`}
                >
                    {buttonText}
                </Button>
            );
        }
        
        if (activity.type === 'quest_start' && playerQuests.some(q => q.questId === activity.questId)) return null;
        
        if (activity.type === 'runecrafting_altar') {
            return (
                <Button onClick={() => onActivity(activity)}>
                    Craft Runes
                </Button>
            );
        }

        return (
            <ActionableButton
                key={`${activity.type}-${index}`}
                activity={activity}
                index={index}
                handleActivityClick={onActivity}
                setContextMenu={setContextMenu}
                ui={ui}
                onDepositBackpack={onDepositBackpack}
                onDepositEquipment={onDepositEquipment}
                isTouchDevice={isTouchDevice}
                worldActions={worldActions}
                isOneClickMode={isOneClickMode}
                poi={poi}
                onStartCombat={onStartCombat}
                onPickpocket={props.onPickpocket}
            />
        );
    }

    const renderInteractQuestActivity = () => {
        if (!activeRepeatableQuest || activeRepeatableQuest.generatedQuest.type !== 'interact') return null;
        
        const quest = activeRepeatableQuest.generatedQuest;
        if (quest.locationPoiId !== poi.id) return null;
        
        if (activeCleanup && activeCleanup.quest.questId === activeRepeatableQuest.questId) {
            return (
                <CleanupProgress
                    startTime={activeCleanup.startTime}
                    duration={activeCleanup.duration}
                    title={quest.title}
                    onCancel={onCancelInteractQuest}
                />
            );
        }

        return (
            <Button onClick={() => onStartInteractQuest(activeRepeatableQuest)} variant="primary" disabled={!!activeCleanup}>
                Start Task: {quest.title}
            </Button>
        )
    }

    const renderTravelOption = (item: GridItem) => {
        if ('type' in item && item.type === 'obstacle') {
            const { fromPoiId, toPoiId, requirement } = item;
            const destinationPoi = POIS[toPoiId];
            const playerSkill = skills.find(s => s.name === requirement.skill);
            const hasLevel = playerSkill && playerSkill.currentLevel >= requirement.level;
            const hasRequiredItems = requirement.items ? hasItems(requirement.items) : true;

            return (
                <div key={toPoiId} className="w-full h-full flex flex-col justify-center text-center p-1 border border-dashed border-gray-600 rounded">
                    <p className="text-xs text-gray-400 mb-1">
                        To {destinationPoi?.name ?? 'an unknown area'}:
                    </p>
                    <Button 
                        onClick={() => { onClearObstacle(fromPoiId, toPoiId, requirement); setTooltip(null); }}
                        disabled={!hasLevel || !hasRequiredItems}
                        className="w-full"
                        size="sm"
                    >
                        {requirement.actionText} ({requirement.level})
                    </Button>
                </div>
            );
        }

        const connectedPoi = item as POI;
        const isLocked = !unlockedPois.includes(connectedPoi.id);

        const destinationRegion = REGIONS[connectedPoi.regionId];
        const buttonVariant = destinationRegion?.type === 'city' ? 'internal' : 'primary';

        const isEnteringDungeon = REGIONS[poi.regionId]?.type !== 'dungeon' && REGIONS[connectedPoi.regionId]?.type === 'dungeon';
        const buttonExtraClass = isEnteringDungeon ? 'dungeon-entrance-highlight' : '';

        const buttonProps: any = {};
        if (isEnteringDungeon) {
            const region = REGIONS[connectedPoi.regionId];
            if (region) {
                buttonProps.onMouseEnter = (e: React.MouseEvent) => {
                    const tooltipContent = (
                        <div>
                            <p className="font-bold text-red-400">{region.name}</p>
                            {region.description && <p className="text-sm text-gray-300 italic my-1">{region.description}</p>}
                            {region.recommendedCombatLevel && <p className="text-sm mt-2">Recommended Level: <span className="font-semibold text-white">{region.recommendedCombatLevel}+</span></p>}
                        </div>
                    );
                    setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
                };
                buttonProps.onMouseLeave = () => setTooltip(null);
            }
        }

        return (
            <Button 
                key={connectedPoi.id} 
                onClick={() => { onNavigate(connectedPoi.id); setTooltip(null); }} 
                disabled={isLocked} 
                variant={buttonVariant} 
                data-tutorial-id={`navigation-button-${connectedPoi.id}`} 
                className={`w-full h-full ${buttonExtraClass}`}
                {...buttonProps}
            >
                {connectedPoi.name} {isLocked ? '(Locked)' : ''}
            </Button>
        );
    };
 // STOP ADDING THE LOOT BUTTON BELOW THIS POINT
    return (
        <div className="flex flex-col h-full text-gray-200 min-h-0">
            <h1 onClick={() => setIsDescriptionVisible(v => !v)} className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2 cursor-pointer select-none">{poi.name}</h1>
            {isDescriptionVisible && <p className="text-base md:text-lg italic mb-6 border-b-2 border-gray-600 pb-4 animate-fade-in">{poi.description}</p>}
            
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                <div className="flex flex-col min-h-0">
                    <h3 className="text-xl font-semibold mb-2 text-yellow-300 cursor-pointer select-none flex-shrink-0" onClick={() => setAreActionsVisible(v => !v)}>
                        Actions <span className={`inline-block transition-transform duration-200 ${areActionsVisible ? 'rotate-180' : ''}`}>▼</span>
                    </h3>
                    {areActionsVisible && (
                         <div className="overflow-y-auto pr-1 animate-fade-in">
                            <div className="grid grid-cols-3 gap-2">
                                {poi.activities.map(getActivityButton)}
                                {bonfires.length > 0 && bonfires.map(bonfire => (
                                    <BonfireButton
                                        key={bonfire.uniqueId}
                                        activity={bonfire}
                                        inventory={inventory}
                                        skills={skills}
                                        onStokeBonfire={onStokeBonfire}
                                        setContextMenu={setContextMenu}
                                        isTouchDevice={isTouchSimulationEnabled}
                                        onActivity={onActivity}
                                        setTooltip={setTooltip}
                                        isOneClickMode={isOneClickMode}
                                    />
                                ))}
                                {renderInteractQuestActivity()}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col min-h-0">
                    <h3 className="text-xl font-bold mb-2 text-yellow-300 flex-shrink-0">Travel</h3>
                    <div className="flex-grow flex items-center justify-center">
                        <div className="w-full max-w-[280px] lg:w-2/3 lg:max-w-none">
                            <div className="grid grid-cols-3 gap-2">
                                {gridItems.map((cellItems, index) => (
                                    <div key={index} className="aspect-square bg-black/20 rounded-md p-1 flex flex-col items-center justify-center gap-1">
                                    {index === 4 && cellItems.length > 0 ? (
                                            cellItems.map(renderTravelOption)
                                        ) : index === 4 ? (
                                            <div className="flex flex-col items-center text-gray-500">
                                                <img src="https://api.iconify.design/game-icons:world.svg" alt="Current Location" className="w-8 h-8 opacity-50 filter invert" />
                                                <span className="text-xs font-semibold">Here</span>
                                            </div>
                                        ) : (
                                            cellItems.map(renderTravelOption)
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SceneView;
