

import React, { useState, useEffect } from 'react';
import { GeneratedRepeatableQuest, PlayerRepeatableQuest, InventorySlot } from '../types';
import { ITEMS, MONSTERS, TELEPORT_UNLOCK_THRESHOLD } from '../constants';
import { POIS } from '../data/pois';
import Button from './common/Button';

interface QuestBoardViewProps {
    boardId: string;
    boardQuests: GeneratedRepeatableQuest[];
    activePlayerQuest: PlayerRepeatableQuest | null;
    inventory: InventorySlot[];
    onAccept: (quest: GeneratedRepeatableQuest, boardId: string) => void;
    onTurnIn: () => void;
    onExit: () => void;
    nextResetTimestamp: number;
    boardCompletions: Record<string, number>;
    onOpenTeleportModal: () => void;
}

const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const QuestBoardView: React.FC<QuestBoardViewProps> = ({ boardId, boardQuests, activePlayerQuest, inventory, onAccept, onTurnIn, onExit, nextResetTimestamp, boardCompletions, onOpenTeleportModal }) => {
    const [timeRemaining, setTimeRemaining] = useState(nextResetTimestamp - Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(nextResetTimestamp - Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, [nextResetTimestamp]);

    const getGatherQuestProgress = (quest: GeneratedRepeatableQuest) => {
        if (quest.type !== 'gather') return null;
        const itemId = quest.target.itemId!;
        const currentAmount = inventory.reduce((total, slot) => {
            return slot.itemId === itemId ? total + slot.quantity : total;
        }, 0);
        return { current: currentAmount, required: quest.requiredQuantity };
    };

    const boardName = POIS[boardId]?.name ?? "Quest Board";
    const completionCount = boardCompletions[boardId] || 0;
    const isTeleportUnlocked = completionCount >= TELEPORT_UNLOCK_THRESHOLD;
    const canTeleport = isTeleportUnlocked && Object.values(boardCompletions).filter(c => c >= TELEPORT_UNLOCK_THRESHOLD).length > 1;

    return (
        <div className="flex flex-col h-full text-gray-200">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold text-yellow-400">{boardName}</h1>
                <Button onClick={onExit}>Exit</Button>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                <span>New tasks in: {formatTime(timeRemaining)}</span>
                <span>Tasks Completed: {completionCount} / {TELEPORT_UNLOCK_THRESHOLD}</span>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {boardQuests.map((quest, index) => (
                    <div key={index} className="bg-gray-900/80 p-3 rounded-lg border border-gray-600 flex justify-between items-center">
                        <div className="flex-1">
                            <h3 className="font-bold text-yellow-300">{quest.title}</h3>
                            <p className="text-sm text-gray-400 italic mb-1">{quest.description}</p>
                            <p className="text-xs">
                                Reward: <span className="text-yellow-400">{quest.finalCoinReward} Coins</span> & <span className="text-green-400">{quest.xpReward.amount.toLocaleString()} {quest.xpReward.skill} XP</span>
                            </p>
                        </div>
                        <Button size="sm" onClick={() => onAccept(quest, boardId)} disabled={!!activePlayerQuest}>
                            Accept
                        </Button>
                    </div>
                ))}
            </div>

            {activePlayerQuest && (
                <div className="mt-4 pt-4 border-t-2 border-gray-600">
                    <h2 className="text-xl font-bold text-center text-yellow-400 mb-2">Your Active Task</h2>
                    <div className="bg-blue-900/50 p-3 rounded-lg border border-blue-500">
                        <h3 className="font-bold text-blue-300">{activePlayerQuest.generatedQuest.title}</h3>
                        <p className="text-sm text-gray-300 italic mb-2">{activePlayerQuest.generatedQuest.description}</p>
                        
                        {(() => {
                            const quest = activePlayerQuest.generatedQuest;
                            if (quest.type === 'gather') {
                                const progress = getGatherQuestProgress(quest)!;
                                const isComplete = progress.current >= progress.required;
                                return (
                                    <div>
                                        <p>Progress: {progress.current} / {progress.required} {ITEMS[quest.target.itemId!].name}</p>
                                        <Button 
                                            onClick={onTurnIn} 
                                            disabled={!isComplete || activePlayerQuest.boardId !== boardId}
                                            className="mt-2 w-full"
                                        >
                                            {activePlayerQuest.boardId !== boardId ? `Turn in at ${POIS[activePlayerQuest.boardId].name}` : "Turn In"}
                                        </Button>
                                    </div>
                                );
                            } else if (quest.type === 'kill') {
                                const progress = activePlayerQuest.progress;
                                const required = quest.requiredQuantity;
                                const isComplete = progress >= required;
                                const monsterName = MONSTERS[quest.target.monsterId!].name;
                                return (
                                    <div>
                                        <p>Progress: {progress} / {required} {monsterName}s defeated</p>
                                        <Button 
                                            onClick={onTurnIn} 
                                            disabled={!isComplete || activePlayerQuest.boardId !== boardId}
                                            className="mt-2 w-full"
                                        >
                                            {activePlayerQuest.boardId !== boardId ? `Turn in at ${POIS[activePlayerQuest.boardId].name}` : "Turn In"}
                                        </Button>
                                    </div>
                                );
                            } else { // Interact
                                return (
                                     <p className="text-center text-gray-400 italic mt-2">
                                        Go to {POIS[quest.locationPoiId!].name} to complete this task.
                                     </p>
                                );
                            }
                        })()}
                    </div>
                </div>
            )}
            <div className="mt-4 pt-4 border-t-2 border-gray-600 flex justify-end">
                {canTeleport && <Button onClick={onOpenTeleportModal}>Teleport</Button>}
            </div>
        </div>
    );
};

export default QuestBoardView;