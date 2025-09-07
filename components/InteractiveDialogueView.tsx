import React, { useState } from 'react';
import { DialogueNode, DialogueResponse } from '../types';
import Button from './common/Button';

interface InteractiveDialogueViewProps {
    dialogueInfo: {
        dialogue: Record<string, DialogueNode>;
        startNode: string;
    };
    onClose: () => void;
    onCustomAction: (actionId: string | undefined) => void;
}

const InteractiveDialogueView: React.FC<InteractiveDialogueViewProps> = ({ dialogueInfo, onClose, onCustomAction }) => {
    const { dialogue, startNode } = dialogueInfo;
    const [currentNodeKey, setCurrentNodeKey] = useState<string>(startNode);

    const currentNode = dialogue[currentNodeKey];

    if (!currentNode) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-xl">Could not load dialogue.</p>
                <Button onClick={onClose} className="mt-4">Close</Button>
            </div>
        );
    }

    const handleResponseClick = (response: DialogueResponse) => {
        if (response.action === 'close') {
            onClose();
        } else if (response.action === 'custom') {
            onCustomAction(response.customActionId);
        } else if (response.next && dialogue[response.next]) {
            setCurrentNodeKey(response.next);
        } else {
            onClose();
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

export default InteractiveDialogueView;