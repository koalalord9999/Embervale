
import React, { useMemo, useEffect, useState } from 'react';
import { POI, POIActivity, PlayerQuestState, SkillName, InventorySlot, ResourceNodeState, PlayerRepeatableQuest, SkillRequirement, PlayerSkill, DialogueNode } from '../../types';
import { MONSTERS, QUESTS, SHOPS, ITEMS } from '../../constants';
import { POIS } from '../../data/pois';
import Button from '../common/Button';
import { ContextMenuOption } from '../common/ContextMenu';
import { MakeXPrompt, QuestDialogueState, InteractiveDialogueState, TooltipState } from '../../hooks/useUIState';
import ProgressBar from '../common/ProgressBar';
import { useSkillingAnimations } from '../../hooks/useSkillingAnimations';
import { useSceneInteractions } from '../../hooks/useSceneInteractions';

type SkillingActivity = Extract<POIActivity, { type: 'skilling' }>;

interface SceneViewProps {
    poi: POI;
    unlockedPois: string[];
    onNavigate: (poiId: string) => void;
    onActivity: (activity: POIActivity) => void;
    onStartCombat: (uniqueInstanceId: string) => void;
    playerQuests: PlayerQuestState[];
    inventory: InventorySlot[];
    completeQuestStage: (questId: string) => void;
    setContextMenu: (menu: { options: ContextMenuOption[]; position: { x: number; y: number; } } | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    addLog: (message: string) => void;
    onSmelt: (quantity: number) => void;
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
    skills: PlayerSkill[];
    monsterRespawnTimers: Record<string, number>;
    setActiveQuestDialogue: (dialogue: QuestDialogueState | null) => void;
    setActiveInteractiveDialogue: (dialogue: InteractiveDialogueState | null) => void;
}

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
            {/* FIX: Wrapped onCancel in an arrow function to ensure it's called with no arguments, matching its type signature. */}
            <Button onClick={() => onCancel()} variant="secondary" size="sm">Cancel</Button>
        </div>
    );
};


const SceneView: React.FC<SceneViewProps> = (props) => {
    const { poi, unlockedPois, onNavigate, onActivity, onStartCombat, playerQuests, inventory, completeQuestStage, setContextMenu, setMakeXPrompt, setTooltip, addLog, onSmelt, startQuest, hasItems, resourceNodeStates, activeSkillingNodeId, onToggleSkilling, initializeNodeState, skillingTick, getSuccessChance, activeRepeatableQuest, activeCleanup, onStartInteractQuest, onCancelInteractQuest, clearedSkillObstacles, onClearObstacle, skills, monsterRespawnTimers, setActiveQuestDialogue, setActiveInteractiveDialogue } = props;
    const { depletedNodesAnimating } = useSkillingAnimations(resourceNodeStates, poi.activities);
    const [countdown, setCountdown] = useState<Record<string, number>>({});
    const [shakingNodeId, setShakingNodeId] = useState<string | null>(null);
    
    const { handleActivityClick } = useSceneInteractions(poi.id, {
        playerQuests,
        completeQuestStage,
        startQuest,
        hasItems,
        addLog,
        onActivity,
        setActiveQuestDialogue,
        setActiveInteractiveDialogue,
    });

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

    const connections = useMemo(() => {
        if (poi.id.startsWith('warrens_') || poi.id.startsWith('laby_')) return [...poi.connections].sort(() => Math.random() - 0.5);
        return poi.connections;
    }, [poi.id, poi.connections]);

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

    const getActivityButton = (activity: POIActivity, index: number) => {
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
                const buttonText = activity.name ?? `Gather ${ITEMS[activity.loot[0].itemId]?.name}`;
                
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
                    >
                        <div className="absolute inset-0 animate-pulse-bg"></div>
                        <button onClick={() => onToggleSkilling(activity)} className="relative w-full h-full flex items-center justify-center font-bold text-white">
                            Stop
                        </button>
                    </div>
                );
            }

            const isDepleted = nodeState?.resources <= 0;
            const respawnTimeSec = nodeState ? Math.ceil(nodeState.respawnTimer / 1000) : 0;
            const isDisabled = isDepleted;
            
            let buttonText = activity.name ?? `Gather ${ITEMS[activity.loot[0].itemId]?.name}`;
            if (activity.skill === SkillName.Woodcutting) buttonText = activity.name ?? 'Chop Trees';
            if (activity.skill === SkillName.Fishing) buttonText = activity.name ?? `Net ${ITEMS[activity.loot[0].itemId]?.name}`;
            if (activity.skill === SkillName.Mining) buttonText = activity.name ?? `Mine ${ITEMS[activity.loot[0].itemId]?.name}`;

            if (isDisabled) buttonText = `Depleted (${respawnTimeSec}s)`;

            return (
                <Button 
                    key={activity.id} 
                    onClick={() => onToggleSkilling(activity)} 
                    disabled={isDisabled}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={() => setTooltip(null)}
                >
                    {buttonText}
                </Button>
            );
        }

        if (activity.type === 'combat') {
            const monster = MONSTERS[activity.monsterId];
            const uniqueInstanceId = `${poi.id}:${activity.monsterId}:${index}`;
            const remainingTime = countdown[uniqueInstanceId];

            if (remainingTime > 0) {
                return (
                    <Button key={uniqueInstanceId} disabled variant="combat">
                        {monster.name} ({remainingTime}s)
                    </Button>
                );
            }
            
            const text = `Fight ${monster.name}`;
            const textColorClass = monster.aggressive ? 'text-red-400' : 'text-yellow-400';
            return (
                <Button 
                    key={uniqueInstanceId} 
                    onClick={() => onStartCombat(uniqueInstanceId)}
                    variant="combat"
                    className={textColorClass}
                >
                    {text}
                </Button>
            );
        }

        const isFurnace = activity.type === 'furnace';
        const isQuestStart = activity.type === 'quest_start' && playerQuests.some(q => q.questId === activity.questId);
        if (isQuestStart) return null;
        
        let text = 'Interact';
        switch (activity.type) {
            case 'shop': text = `Visit ${SHOPS[activity.shopId].name}`; break;
            case 'quest_start': text = `Talk about '${QUESTS[activity.questId].name}'`; break;
            case 'npc': text = `Talk to ${activity.name}`; break;
            case 'cooking_range': text = 'Use Cooking Range'; break;
            case 'furnace': text = 'Use Furnace'; break;
            case 'anvil': text = 'Use Anvil'; break;
            case 'bank': text = 'Use Bank'; break;
            case 'shearing': text = 'Shear Sheep'; break;
            case 'egg_collecting': text = 'Collect Eggs'; break;
            case 'wishing_well': text = 'Toss a coin in the well'; break;
            case 'quest_board': text = 'Check the Quest Board'; break;
            case 'spinning_wheel': text = 'Use Spinning Wheel'; break;
            case 'water_source': text = activity.name; break;
            case 'interactive_dialogue': text = `Talk to ${activity.dialogue[activity.startNode].npcName}`; break;
        }

        return (
            <Button 
                key={`${activity.type}-${index}`} 
                onClick={() => handleActivityClick(activity)}
                onContextMenu={(e) => {
                    if (isFurnace) createSmeltingContextMenu(e);
                }}
            >
                {text}
            </Button>
        );
    }
    
    const createSmeltingContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        const copperCount = inventory.filter(s => s.itemId === 'copper_ore').length;
        const tinCount = inventory.filter(s => s.itemId === 'tin_ore').length;
        const maxSmelt = Math.min(copperCount, tinCount);

        const options: ContextMenuOption[] = [
            { label: 'Smelt 1', onClick: () => onSmelt(1), disabled: maxSmelt < 1 },
            { label: 'Smelt 5', onClick: () => onSmelt(5), disabled: maxSmelt < 5 },
            { label: 'Smelt All', onClick: () => onSmelt(maxSmelt), disabled: maxSmelt < 1 },
            { 
                label: 'Smelt X...', 
                onClick: () => setMakeXPrompt({ title: 'Smelt Bronze Bars', max: maxSmelt, onConfirm: onSmelt }), 
                disabled: maxSmelt < 1 
            },
        ];
        setContextMenu({ options, position: { x: e.clientX, y: e.clientY } });
    };

    const renderTravelOption = (connId: string) => {
        const obstacleId = `${poi.id}-${connId}`;
        const requirement = poi.connectionRequirements?.[connId];
        const destinationPoi = POIS[connId];

        if (requirement && !clearedSkillObstacles.includes(obstacleId)) {
            const playerSkill = skills.find(s => s.name === requirement.skill);
            const hasLevel = playerSkill && playerSkill.level >= requirement.level;
            const hasRequiredItems = requirement.items ? hasItems(requirement.items) : true;

            return (
                <div key={connId} className="p-2 border-2 border-dashed border-gray-600 rounded-md">
                    <p className="text-center font-semibold text-gray-400 mb-2">
                        The path to <span className="text-yellow-400">{destinationPoi?.name ?? 'an unknown area'}</span> is blocked. {requirement.description}
                    </p>
                    <Button 
                        onClick={() => onClearObstacle(poi.id, connId, requirement)}
                        disabled={!hasLevel || !hasRequiredItems}
                        className="w-full"
                    >
                        {requirement.actionText} ({requirement.skill} {requirement.level})
                    </Button>
                </div>
            );
        }

        const connectedPoi = POIS[connId];
        if (!connectedPoi) return null;
        const isLocked = !unlockedPois.includes(connId);
        return (
            <Button key={connId} onClick={() => onNavigate(connId)} disabled={isLocked} variant={connectedPoi.type === 'internal' ? 'internal' : 'primary'}>
                {connectedPoi.name} {isLocked ? '(Locked)' : ''}
            </Button>
        );
    };

    return (
        <div className="flex flex-col h-full text-gray-200">
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">{poi.name}</h1>
            <p className="text-lg italic mb-6 border-b-2 border-gray-600 pb-4">{poi.description}</p>
            
            <div className="flex-grow grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-xl font-semibold mb-2 text-yellow-300">Actions</h3>
                    <div className="flex flex-col gap-2">
                        {poi.activities.map(getActivityButton)}
                        {renderInteractQuestActivity()}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-yellow-300">Travel</h3>
                    <div className="flex flex-col gap-2">
                        {connections.map(renderTravelOption)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SceneView;