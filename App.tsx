
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useUIState } from './hooks/useUIState';
import { useGameStateManager } from './hooks/useGameStateManager';
import Tooltip from './components/common/Tooltip';
import ContextMenu from './components/common/ContextMenu';
import MakeXModal from './components/common/MakeXModal';
import ConfirmationModal from './components/common/ConfirmationModal';
import ExportModal from './components/common/ExportModal';
import ImportModal from './components/common/ImportModal';
import SkillGuideView from './components/views/overlays/SkillGuideView';
import QuestDetailView from './components/views/overlays/QuestDetailView';
import EquipmentStatsView from './components/views/overlays/EquipmentStatsView';
import ItemsOnDeathView from './components/views/overlays/ItemsOnDeathView';
import PriceCheckerView from './components/views/overlays/PriceCheckerView';
import Game from './components/game/Game';
import PreloadScreen from './components/screens/PreloadScreen';
import UsernamePrompt from './components/common/UsernamePrompt';

type AppState = 'LOADING_DB' | 'PRELOAD' | 'USERNAME_PROMPT' | 'GAME';
type PromptReason = 'new_game' | 'set_username' | 'set_username_import' | null;

const App: React.FC = () => {
    const ui = useUIState();
    const { 
        initialState, 
        gameKey, 
        handleExportSave, 
        handleImportSave, 
        parseSaveData, 
        startNewGame,
        updateUsernameAndSave,
        loadImportedState
    } = useGameStateManager(ui);
    
    const [appState, setAppState] = useState<AppState>('LOADING_DB');
    const [promptReason, setPromptReason] = useState<PromptReason>(null);
    const [pendingImportState, setPendingImportState] = useState<any | null>(null);

    useEffect(() => {
        // Only transition from LOADING_DB to PRELOAD once.
        if (initialState && appState === 'LOADING_DB') {
            setAppState('PRELOAD');
        }
    }, [initialState, appState]);
    
    const loadingTips = useMemo(() => [
        "The Whispering Woods are older than Meadowdale itself.",
        "Bronze is a simple alloy of copper and tin. Use a furnace to smelt them.",
        "Different combat stances provide bonuses to Attack, Strength, or Defence.",
        "Check the quest board in the local tavern for repeatable tasks and good coin.",
        "A sharp axe is for trees; a sturdy pickaxe is for rocks. Bring the right tool.",
        "Cooking on a range can turn a simple fish into a life-saving meal."
    ], []);

    const handleContinue = useCallback(() => {
        if (initialState && (!initialState.username || initialState.username.trim() === '')) {
            setPromptReason('set_username');
            setAppState('USERNAME_PROMPT');
        } else {
            setAppState('GAME');
        }
    }, [initialState]);

    const onConfirmImport = useCallback(async (state: any) => {
        if (!state.username || state.username.trim() === '') {
            setPendingImportState(state);
            setPromptReason('set_username_import');
            setAppState('USERNAME_PROMPT');
        } else {
            await loadImportedState(state);
            setAppState('GAME');
        }
    }, [loadImportedState]);
    
    const loadFromImportedData = useCallback((data: string): boolean => {
        const state = parseSaveData(data);
        if (state) {
            ui.closeImportModal();
            ui.setConfirmationPrompt({
                message: "Are you sure you want to import this save? This will overwrite your current progress.",
                onConfirm: () => onConfirmImport(state)
            });
            return true;
        }
        return false;
    }, [parseSaveData, ui, onConfirmImport]);
    
    const requestNewGame = useCallback(() => {
        ui.setConfirmationPrompt({
            message: "Are you sure you want to start a new game? All progress will be lost.",
            onConfirm: () => {
                setPromptReason('new_game');
                setAppState('USERNAME_PROMPT');
            }
        });
    }, [ui]);
    
    const handleUsernameConfirm = useCallback(async (username: string) => {
        if (promptReason === 'new_game') {
            await startNewGame(username);
        } else if (promptReason === 'set_username') {
            await updateUsernameAndSave(username);
        } else if (promptReason === 'set_username_import' && pendingImportState) {
            const newState = { ...pendingImportState, username };
            await loadImportedState(newState);
        }
        setPendingImportState(null);
        setPromptReason(null);
        setAppState('GAME');
    }, [promptReason, startNewGame, updateUsernameAndSave, pendingImportState, loadImportedState]);

    const handleUsernameCancel = useCallback(() => {
        setPendingImportState(null);
        setPromptReason(null);
        setAppState('PRELOAD');
    }, []);

    const renderAppContent = () => {
        if (!initialState) {
            return (
                <div className="w-[1024px] h-[768px] bg-cover bg-center border-8 border-gray-900 shadow-2xl p-4 flex flex-col items-center justify-center relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505236755279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop')` }}>
                    <div className="absolute inset-0 bg-black/50"></div>
                     <div className="relative z-10 text-center animate-fade-in bg-black/60 p-8 rounded-lg border-2 border-gray-700 shadow-2xl">
                        <h1 className="text-6xl font-bold text-yellow-400 mb-6" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>Embervale</h1>
                        <div className="w-16 h-16 mx-auto mb-6 animate-spin-slow">
                            <img src="https://api.iconify.design/game-icons:yin-yang.svg" alt="Loading symbol" className="w-full h-full filter invert text-yellow-500"/>
                        </div>
                        <p className="text-lg text-gray-300 italic">Loading your adventure...</p>
                    </div>
                </div>
            );
        }

        switch (appState) {
            case 'PRELOAD':
                return (
                    <PreloadScreen 
                        loadingTips={loadingTips} 
                        onContinue={handleContinue} 
                        onNewGame={requestNewGame} 
                        onImport={handleImportSave}
                        setContextMenu={ui.setContextMenu}
                    />
                );
            case 'USERNAME_PROMPT':
                return (
                     <div className="w-[1024px] h-[768px] bg-cover bg-center border-8 border-gray-900 shadow-2xl p-4 flex items-center justify-center relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-15052367semberv5279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop')`}}>
                        <div className="absolute inset-0 bg-black/60"></div>
                        <UsernamePrompt onConfirm={handleUsernameConfirm} onCancel={handleUsernameCancel} />
                     </div>
                );
            case 'GAME':
            default:
                return (
                    <div className="w-[1024px] h-[768px] bg-cover bg-center border-8 border-gray-900 shadow-2xl p-4 flex gap-4 relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-15052367semberv5279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop')`}}>
                        <Game 
                            key={gameKey} 
                            initialState={initialState} 
                            onExportGame={handleExportSave} 
                            onImportGame={handleImportSave} 
                            onResetGame={requestNewGame} 
                            ui={ui} 
                        />
                    </div>
                );
        }
    };
    
    return (
        <div className="bg-gray-800 text-white min-h-screen flex items-center justify-center font-serif">
            {renderAppContent()}
            
            {initialState && (
                <>
                    {ui.tooltip && <Tooltip content={ui.tooltip.content} position={ui.tooltip.position} />}
                    {ui.contextMenu && <ContextMenu options={ui.contextMenu.options} position={ui.contextMenu.position} onClose={ui.closeContextMenu} />}
                    {ui.makeXPrompt && <MakeXModal title={ui.makeXPrompt.title} maxQuantity={ui.makeXPrompt.max} onConfirm={ui.makeXPrompt.onConfirm} onCancel={ui.closeMakeXPrompt} />}
                    {ui.confirmationPrompt && <ConfirmationModal message={ui.confirmationPrompt.message} onConfirm={ui.confirmationPrompt.onConfirm} onCancel={ui.closeConfirmationPrompt} />}
                    {ui.exportData && <ExportModal data={ui.exportData} onClose={ui.closeExportModal} />}
                    {ui.isImportModalOpen && <ImportModal onImport={loadFromImportedData} onClose={ui.closeImportModal} />}
                    {ui.activeSkillGuide && <SkillGuideView activeSkill={ui.activeSkillGuide} setActiveSkill={ui.setActiveSkillGuide} onClose={ui.closeSkillGuide} playerSkills={initialState.skills as any[]} />}
                    {ui.activeQuestDetailId && <QuestDetailView questId={ui.activeQuestDetailId} playerQuests={initialState.playerQuests} onClose={() => ui.setActiveQuestDetailId(null)} />}
                    {ui.equipmentStats && <EquipmentStatsView equipment={ui.equipmentStats} onClose={() => ui.setEquipmentStats(null)} />}
                    {ui.isItemsOnDeathOpen && <ItemsOnDeathView coins={initialState.coins} onClose={() => ui.setIsItemsOnDeathOpen(false)} />}
                    {ui.isPriceCheckerOpen && <PriceCheckerView inventory={initialState.inventory} onClose={() => ui.setIsPriceCheckerOpen(false)} setTooltip={ui.setTooltip} />}
                </>
            )}
        </div>
    );
};

export default App;
