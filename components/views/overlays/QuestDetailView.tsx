
import React from 'react';
import { PlayerQuestState } from '../../../types';
import { QUESTS } from '../../../constants';
import Button from '../../common/Button';

interface QuestDetailViewProps {
    questId: string;
    playerQuests: PlayerQuestState[];
    onClose: () => void;
}

const QuestDetailView: React.FC<QuestDetailViewProps> = ({ questId, playerQuests, onClose }) => {
    const questData = QUESTS[questId];
    const playerQuest = playerQuests.find(q => q.questId === questId);

    if (!questData) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div 
                    className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-lg p-6 text-center"
                    onClick={e => e.stopPropagation()}
                >
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Quest Not Found</h2>
                    <p>The details for this quest could not be loaded.</p>
                    <Button onClick={onClose} className="mt-6">Close</Button>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        if (!playerQuest) { // Not Started
            return (
                <>
                    <p className="mb-4 text-gray-400 italic">{questData.description}</p>
                    <div className="bg-black/40 p-3 rounded-lg border border-gray-600">
                        <h3 className="font-semibold text-yellow-300 mb-2">How to Start</h3>
                        <p>{questData.startHint}</p>
                    </div>
                </>
            );
        }

        if (playerQuest.isComplete) { // Completed
            return (
                <>
                    <p className="mb-4 text-gray-400 italic">{questData.description}</p>
                    <div className="space-y-2 mb-4">
                        {questData.playerStagePerspectives.map((perspective, index) => (
                            <p key={index} className="text-gray-500 line-through">
                                {perspective}
                            </p>
                        ))}
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-gray-600">
                         <p className="italic">"{questData.completionSummary}"</p>
                    </div>
                </>
            );
        }

        // In Progress
        return (
            <>
                <p className="mb-4 text-gray-400 italic">{questData.description}</p>
                <div className="space-y-2">
                    {questData.playerStagePerspectives
                        .filter((_, index) => index <= playerQuest.currentStage)
                        .map((perspective, index) => {
                            if (index < playerQuest.currentStage) {
                                return <p key={index} className="text-gray-500 line-through">{perspective}</p>;
                            }
                            // This will now only ever be the current stage
                            return <p key={index} className="font-semibold text-yellow-300 animate-pulse">{perspective}</p>;
                        })}
                </div>
            </>
        );
    };
    
    const statusColor = !playerQuest ? 'text-red-400' : playerQuest.isComplete ? 'text-green-400' : 'text-yellow-400';

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b-2 border-gray-600 flex-shrink-0">
                    <h2 className={`text-3xl font-bold ${statusColor}`}>{questData.name}</h2>
                    <Button onClick={onClose}>Close</Button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 text-gray-200">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default QuestDetailView;
