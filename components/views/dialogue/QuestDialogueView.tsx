
import React, { useState } from 'react';
import { QUESTS } from '../../../constants';
import { DialogueResponse } from '../../../types';
import Button from '../../common/Button';

interface QuestDialogueViewProps {
    dialogueInfo: { questId: string, startNode?: string };
    onAcceptQuest: (questId: string) => void;
    onEndDialogue: () => void;
}

const QuestDialogueView: React.FC<QuestDialogueViewProps> = ({ dialogueInfo, onAcceptQuest, onEndDialogue }) => {
    const { questId, startNode } = dialogueInfo;
    const quest = QUESTS[questId];
    const [currentNodeKey, setCurrentNodeKey] = useState<string | undefined>(startNode ?? quest?.startDialogueNode);

    if (!quest || !quest.dialogue || !currentNodeKey || !quest.dialogue[currentNodeKey]) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-xl">Could not load quest dialogue.</p>
                <Button onClick={onEndDialogue} className="mt-4">Close</Button>
            </div>
        );
    }

    const currentNode = quest.dialogue[currentNodeKey];
    
    const handleResponseClick = (response: DialogueResponse) => {
        if (response.action === 'accept_quest') {
            onAcceptQuest(questId);
            onEndDialogue();
        } else if (response.action === 'close') {
            onEndDialogue();
        } else if (response.next) {
            setCurrentNodeKey(response.next);
        }
    };

    return (
        <div className="flex flex-col h-full animate-fade-in p-4">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-gray-600">
                <img 
                    src={currentNode.npcIcon} 
                    alt={currentNode.npcName} 
                    className="w-24 h-24 bg-gray-900 border-4 border-gray-600 rounded-full pixelated-image" 
                />
                <h2 className="text-3xl font-bold text-yellow-400">{currentNode.npcName}</h2>
            </div>
            
            <div className="flex-grow bg-black/50 p-4 rounded-lg text-lg leading-relaxed italic text-gray-300 mb-4 flex items-center">
                <p>"{currentNode.text}"</p>
            </div>
            
            <div className="flex flex-col gap-2 items-end">
                {currentNode.responses.map((response, index) => (
                    <Button 
                        key={index} 
                        onClick={() => handleResponseClick(response)}
                        variant="primary"
                    >
                        {response.text}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default QuestDialogueView;
