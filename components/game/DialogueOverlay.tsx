import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DialogueNode, DialogueResponse } from '../../types';
import Button from '../common/Button';

export interface DialogueState {
    npcName: string;
    npcIcon: string;
    nodes: Record<string, DialogueNode>;
    currentNodeKey: string;
    onEnd: () => void;
    onAction: (action: { type: 'accept_quest', questId: string } | { type: 'complete_stage', questId: string } | { type: 'custom', actionId: string }) => void;
}

interface DialogueOverlayProps {
    dialogue: DialogueState;
}

const DialogueOverlay: React.FC<DialogueOverlayProps> = ({ dialogue }) => {
    const { npcName, npcIcon, nodes, currentNodeKey, onEnd, onAction } = dialogue;
    
    const [textPage, setTextPage] = useState(0);
    const [optionPage, setOptionPage] = useState(0);

    const currentNode = nodes[currentNodeKey];

    const paginatedText = useMemo(() => {
        if (!currentNode) return [];
        const lines = currentNode.text.split('\n');
        const pages: string[] = [];
        let currentPage: string[] = [];
        for (const line of lines) {
            if (currentPage.length >= 4) {
                pages.push(currentPage.join('\n'));
                currentPage = [];
            }
            currentPage.push(line);
        }
        if (currentPage.length > 0) {
            pages.push(currentPage.join('\n'));
        }
        return pages;
    }, [currentNode]);

    useEffect(() => {
        setTextPage(0);
        setOptionPage(0);
    }, [currentNodeKey]);

    const handleNextPage = useCallback(() => {
        if (textPage < paginatedText.length - 1) {
            setTextPage(p => p + 1);
        } else {
            onEnd();
        }
    }, [textPage, paginatedText, onEnd]);

    const handleResponseClick = useCallback((response: DialogueResponse) => {
        if (response.action === 'accept_quest' && response.questId) {
            onAction({ type: 'accept_quest', questId: response.questId });
        } else if (response.action === 'complete_stage' && response.questId) {
            onAction({ type: 'complete_stage', questId: response.questId });
        } else if (response.action === 'custom' && response.customActionId) {
            onAction({ type: 'custom', actionId: response.customActionId });
        } else if (!response.action || response.action === 'close') {
            onEnd();
        }
    }, [onAction, onEnd]);
    
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (paginatedText.length > 1 || !currentNode.responses || currentNode.responses.length === 0) {
                    handleNextPage();
                }
            }
            
            if (textPage >= paginatedText.length - 1 && currentNode.responses.length > 0) {
                const keyNum = parseInt(e.key, 10);
                if (keyNum >= 1 && keyNum <= 4) {
                    e.preventDefault();
                    const optionsPerPage = 4;
                    const displayedOptions = currentNode.responses.slice(optionPage * (optionsPerPage -1), (optionPage + 1) * (optionsPerPage -1));
                    const hasMore = currentNode.responses.length > (optionPage + 1) * (optionsPerPage -1);
                    
                    if(keyNum === 4 && hasMore) {
                         setOptionPage(p => (p + 1) % Math.ceil(currentNode.responses.length / (optionsPerPage -1)));
                    } else if (keyNum <= displayedOptions.length) {
                        handleResponseClick(displayedOptions[keyNum - 1]);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleNextPage, handleResponseClick, currentNode, textPage, paginatedText, optionPage]);


    if (!currentNode) return null;

    const isTextPaginated = paginatedText.length > 1;
    const isLastTextPage = textPage >= paginatedText.length - 1;
    const hasResponses = currentNode.responses && currentNode.responses.length > 0;
    
    const optionsPerPage = 4;
    const hasMoreOptions = hasResponses && currentNode.responses.length > (optionsPerPage - 1);
    const numOptionPages = hasMoreOptions ? Math.ceil(currentNode.responses.length / (optionsPerPage-1)) : 1;
    const optionSliceStart = hasMoreOptions ? optionPage * (optionsPerPage - 1) : 0;
    const optionSliceEnd = hasMoreOptions ? (optionPage + 1) * (optionsPerPage - 1) : optionsPerPage;
    const displayedResponses = hasResponses ? currentNode.responses.slice(optionSliceStart, optionSliceEnd) : [];

    return (
        <div className="absolute bottom-2 left-2 right-2 md:left-4 md:right-auto md:w-[calc(75%-2.25rem)] h-auto md:h-52 bg-gray-900/90 border-2 border-yellow-700 rounded-lg shadow-2xl p-3 pointer-events-auto transition-opacity duration-300 ease-in-out opacity-100 flex flex-col md:flex-row h-full gap-3">
            {/* Left part: Guide info */}
            <div className="flex items-center gap-3 w-full md:w-1/2">
                <img src={npcIcon} alt={npcName} className="w-16 h-16 bg-gray-800 border-2 border-gray-600 rounded-full flex-shrink-0 pixelated-image" />
                <div className="h-full overflow-y-auto pr-1">
                    <h3 className="text-lg font-bold text-yellow-400">{npcName}</h3>
                    <p className="text-base text-gray-300 italic">"{paginatedText[textPage]}"</p>
                </div>
            </div>
            {/* Right part: Objective and action */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-black/50 p-2 rounded-md border border-gray-700">
                {isLastTextPage && hasResponses ? (
                    <div className="w-full space-y-2">
                        {displayedResponses.map((res, i) => (
                            <Button key={i} size="sm" className="w-full text-left justify-start" onClick={() => handleResponseClick(res)}>
                                <span className="text-yellow-400 mr-2">{i+1}.</span>{res.text}
                            </Button>
                        ))}
                        {hasMoreOptions && (
                             <Button size="sm" className="w-full text-left justify-start" onClick={() => setOptionPage(p => (p + 1) % numOptionPages)}>
                                <span className="text-yellow-400 mr-2">4.</span>View more...
                            </Button>
                        )}
                    </div>
                ) : (
                    <button onClick={handleNextPage} className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold">
                        (Continue...)
                    </button>
                )}
            </div>
        </div>
    );
};

export default DialogueOverlay;
