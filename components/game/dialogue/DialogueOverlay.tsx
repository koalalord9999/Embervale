import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ActivePanel, DialogueNode, DialogueResponse } from '../../../types';
import Button from '../../common/Button';
import { DialogueState } from '../../../hooks/useUIState';

interface DialogueOverlayProps {
    dialogue: DialogueState;
    setActivePanel: (panel: ActivePanel) => void;
}

const DialogueOverlay: React.FC<DialogueOverlayProps> = ({ dialogue, setActivePanel }) => {
    const { npcName, npcIcon, nodes, currentNodeKey, onEnd, onResponse, handleDialogueCheck, onNavigate } = dialogue;
    
    const [textPage, setTextPage] = useState(0);
    const [optionPage, setOptionPage] = useState(0);

    const currentNode = nodes[currentNodeKey];

    const paginatedText = useMemo(() => {
        // TODO: A future enhancement would be to automatically paginate text based on character count
        // rather than just line breaks, and to handle it more dynamically without needing manual
        // splits in the dialogue data. This would involve measuring text size and splitting it
        // into pages that fit the dialogue box perfectly, then showing a "(Continue)" prompt.
        // For now, manual splitting by line breaks (4 lines per page) is the implemented solution.
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
        const node = nodes[currentNodeKey];
        if (node && node.conditionalResponses && onNavigate && handleDialogueCheck) {
            // Find the first matching conditional response that acts as a router
            const routerResponse = node.conditionalResponses.find(res => 
                res.check && (res.text === "" || res.text === undefined) && handleDialogueCheck(res.check.requirements)
            );
            if (routerResponse) {
                onNavigate(routerResponse.check!.successNode);
                return; // Navigate and prevent rendering this node
            }
        }
    }, [currentNodeKey, nodes, onNavigate, handleDialogueCheck]);

    const visibleResponses = useMemo(() => {
        if (!currentNode) return [];
        
        const alwaysVisibleResponses = [...(currentNode.responses || [])];
        
        let conditionalVisibleResponses: DialogueResponse[] = [];
        if (currentNode.conditionalResponses && handleDialogueCheck) {
            conditionalVisibleResponses = currentNode.conditionalResponses.filter(res => {
                if (!res.check) return true; // Show if no check is defined
                if (res.text === "" || res.text === undefined) return false; // Hide router responses
                return handleDialogueCheck(res.check.requirements);
            });
        }

        return [...alwaysVisibleResponses, ...conditionalVisibleResponses];
    }, [currentNode, handleDialogueCheck]);


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
        onResponse(response);
    }, [onResponse]);
    
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!currentNode) return;
            const isLastTextPage = textPage >= paginatedText.length - 1;
            const hasResponses = visibleResponses && visibleResponses.length > 0;

            if (e.code === 'Space') {
                e.preventDefault();
                if (!hasResponses || !isLastTextPage) {
                    handleNextPage();
                }
            }
            
            if (isLastTextPage && hasResponses) {
                const keyNum = parseInt(e.key, 10);
                if (keyNum >= 1 && keyNum <= 4) {
                    e.preventDefault();
                    const optionsPerPage = 4;
                    const displayedOptions = visibleResponses.slice(optionPage * (optionsPerPage - 1), (optionPage + 1) * (optionsPerPage - 1));
                    const hasMore = visibleResponses.length > (optionPage + 1) * (optionsPerPage - 1);
                    
                    if(keyNum === 4 && hasMore) {
                         setOptionPage(p => (p + 1) % Math.ceil(visibleResponses.length / (optionsPerPage -1)));
                    } else if (keyNum <= displayedOptions.length) {
                        handleResponseClick(displayedOptions[keyNum - 1]);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleNextPage, handleResponseClick, currentNode, textPage, paginatedText, optionPage, visibleResponses]);

    useEffect(() => {
        // Cleanup function to remove highlights when the dialogue closes or node changes
        const cleanupHighlights = () => {
            document.querySelectorAll('.tutorial-highlight-target').forEach(el => {
                el.classList.remove('tutorial-highlight-target');
            });
        };

        cleanupHighlights(); // Clean up previous highlights on each render

        if (currentNode?.highlight) {
            const highlightIds = Array.isArray(currentNode.highlight) ? currentNode.highlight : [currentNode.highlight];
            highlightIds.forEach(id => {
                const element = document.querySelector(`[data-tutorial-id="${id}"]`);
                if (element) {
                    element.classList.add('tutorial-highlight-target');
                    // Scroll the first highlighted element into view if it exists.
                    if (highlightIds.indexOf(id) === 0) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    }
                }
                if (id.startsWith('side-panel-button-')) {
                    const panelName = id.replace('side-panel-button-', '') as ActivePanel;
                    setActivePanel(panelName);
                }
            });
        }

        return cleanupHighlights; // Cleanup on component unmount
    }, [currentNode, setActivePanel]);

    if (!currentNode) return null;

    const isLastTextPage = textPage >= paginatedText.length - 1;
    const hasResponses = visibleResponses && visibleResponses.length > 0;
    
    const optionsPerPage = 4;
    const hasMoreOptions = hasResponses && visibleResponses.length > optionsPerPage;
    const numOptionPages = hasMoreOptions ? Math.ceil(visibleResponses.length / (optionsPerPage - 1)) : 1;
    const optionSliceStart = hasMoreOptions ? optionPage * (optionsPerPage - 1) : 0;
    const optionSliceEnd = hasMoreOptions ? (optionPage + 1) * (optionsPerPage - 1) : optionsPerPage;
    const displayedResponses = hasResponses ? visibleResponses.slice(optionSliceStart, optionSliceEnd) : [];

    return (
        <div className="absolute inset-0 bg-gray-900/90 border-2 border-yellow-700 rounded-lg shadow-2xl p-3 pointer-events-auto transition-opacity duration-300 ease-in-out opacity-100 flex flex-col md:flex-row h-full gap-3 animate-fade-in md:overflow-y-hidden overflow-y-auto">
            {/* Left part: Guide info */}
            <div className="flex items-center gap-3 w-full md:w-1/2">
                <img src={npcIcon} alt={npcName} className="w-16 h-16 bg-gray-800 border-2 border-gray-600 rounded-full flex-shrink-0 pixelated-image" />
                <div className="pr-1">
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
