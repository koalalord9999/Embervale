import React from 'react';
import { PlayerQuestState, PlayerRepeatableQuest, InventorySlot, PlayerSlayerTask } from '../../types';
import { QUESTS, ITEMS, MONSTERS } from '../../constants';

interface QuestsPanelProps {
    playerQuests: PlayerQuestState[];
    activeRepeatableQuest: PlayerRepeatableQuest | null;
    inventory: (InventorySlot | null)[];
    slayerTask: PlayerSlayerTask | null;
    onSelectQuest: (questId: string) => void;
}

const QuestsPanel: React.FC<QuestsPanelProps> = ({ playerQuests, activeRepeatableQuest, inventory, slayerTask, onSelectQuest }) => {

    const getRepeatableQuestProgressText = () => {
        if (!activeRepeatableQuest) return '';
        
        const { generatedQuest, progress } = activeRepeatableQuest;

        if (generatedQuest.type === 'gather') {
            const itemId = generatedQuest.target.itemId!;
            const currentAmount = inventory.reduce((total, slot) => {
                return slot && slot.itemId === itemId ? total + slot.quantity : total;
            }, 0);
            return `(${currentAmount} / ${generatedQuest.requiredQuantity})`;
        }
        
        if (generatedQuest.type === 'kill') {
            const monsterName = MONSTERS[generatedQuest.target.monsterId!]?.name ?? 'monsters';
            return `(${progress}/${generatedQuest.requiredQuantity} ${monsterName}s)`;
        }

        return '';
    };

    const allQuests = Object.values(QUESTS);
    const inProgressQuests = allQuests.filter(q => playerQuests.some(pq => pq.questId === q.id && !pq.isComplete));
    const notStartedQuests = allQuests.filter(q => !q.isHidden && !playerQuests.some(pq => pq.questId === q.id));
    const completedQuests = allQuests.filter(q => playerQuests.some(pq => pq.questId === q.id && pq.isComplete));
    const completedHiddenQuests = completedQuests.filter(q => q.isHidden);

    return (
        <div className="flex flex-col h-full text-gray-300">
            <div className="overflow-y-auto pr-1 space-y-4">
                {/* Tasks Section */}
                {(slayerTask || activeRepeatableQuest) && (
                    <div>
                        <h4 className="font-bold text-purple-300 border-b border-purple-300/50 mb-2 pb-1">Tasks</h4>
                        {slayerTask && (
                             <div className="mb-2">
                                <h5 className="font-semibold text-red-400">Slayer Task</h5>
                                {slayerTask.isComplete ? (
                                    <p className="text-sm text-green-400 italic mt-1">
                                        Task Complete! Return to a Slayer Master for a new assignment and a reward.
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic mt-1">
                                        - Slay {slayerTask.requiredCount} {MONSTERS[slayerTask.monsterId].name}s.
                                        {` (${slayerTask.progress}/${slayerTask.requiredCount})`}
                                    </p>
                                )}
                            </div>
                        )}
                        {activeRepeatableQuest && (
                            <div>
                                <h5 className="font-semibold text-blue-300">
                                   Active Task: {activeRepeatableQuest.generatedQuest.title}
                                </h5>
                                <p className="text-sm text-gray-400 italic mt-1">
                                    - {activeRepeatableQuest.generatedQuest.description}
                                    {` ${getRepeatableQuestProgressText()}`}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Main Quests Section */}
                <div>
                     <h4 className="font-bold text-purple-300 border-b border-purple-300/50 mb-2 pb-1">Quests</h4>
                     {inProgressQuests.length === 0 && notStartedQuests.length === 0 && completedQuests.filter(q => !q.isHidden).length === 0 && (
                        <p className="text-center text-gray-400 italic">You have no active quests.</p>
                     )}
                     {inProgressQuests.map(quest => (
                        <button key={quest.id} onClick={() => onSelectQuest(quest.id)} className="w-full text-left text-yellow-300 hover:text-yellow-200 py-1">{quest.name}</button>
                     ))}
                     {notStartedQuests.map(quest => (
                        <button key={quest.id} onClick={() => onSelectQuest(quest.id)} className="w-full text-left text-red-400 hover:text-red-300 py-1">{quest.name}</button>
                     ))}
                     {completedQuests.filter(q => !q.isHidden).map(quest => (
                        <button key={quest.id} onClick={() => onSelectQuest(quest.id)} className="w-full text-left text-green-400 hover:text-green-300 py-1 line-through">{quest.name}</button>
                     ))}
                </div>

                {/* Mysteries/Hidden Quests Section */}
                {completedHiddenQuests.length > 0 && (
                    <div>
                        <h4 className="font-bold text-purple-300 border-b border-purple-300/50 mb-2 pb-1">Mysteries Solved</h4>
                         {completedHiddenQuests.map(quest => (
                            <button key={quest.id} onClick={() => onSelectQuest(quest.id)} className="w-full text-left text-green-400 hover:text-green-300 py-1 line-through">{quest.name}</button>
                         ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestsPanel;