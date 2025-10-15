import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useUIState } from './hooks/useUIState';
import { useSaveSlotManager } from './hooks/useSaveSlotManager';
import Tooltip from './components/common/Tooltip';
import ContextMenu from './components/common/ContextMenu';
import MakeXModal from './components/common/MakeXModal';
import ConfirmationModal from './components/common/ConfirmationModal';
import ExportModal from './components/common/ExportModal';
import ImportModal from './components/common/ImportModal';
import SkillGuideView from './components/views/overlays/SkillGuideView';
import QuestDetailView from './components/views/overlays/QuestDetailView';
import ItemsOnDeathView from './components/views/overlays/ItemsOnDeathView';
import PriceCheckerView from './components/views/overlays/PriceCheckerView';
import DungeonMapView from './components/views/DungeonMapView';
import Game from './components/game/Game';
import SaveSlotScreen from './components/screens/SaveSlotScreen';
import GameModeSelection from './components/screens/GameModeSelection';
import UsernamePrompt from './components/common/UsernamePrompt';
import { imagePaths, loadImagesAsBase64 } from './imageLoader';
import { GAME_VERSION } from './config';
import { PlayerType, Slot } from './types';
import { saveSlotState } from './db';

type AppState = 'LOADING_DB' | 'LOADING_ASSETS' | 'SLOT_SELECTION' | 'GAME_MODE_SELECTION' | 'USERNAME_PROMPT' | 'GAME';

const App: React.FC = () => {
    const ui = useUIState();
    const { 
        slots,
        gameKey,
        loadGameForSlot,
        createNewCharacter,
        deleteCharacter,
        exportSlot,
        importToSlot,
        isLoading: isDbLoading,
        refreshSlots,
    } = useSaveSlotManager(ui);
    
    const [appState, setAppState] = useState<AppState>('LOADING_DB');
    const [loadedAssets, setLoadedAssets] = useState<Record<string, string> | null>(null);
    const [activeGameState, setActiveGameState] = useState<any | null>(null);
    const [activeSlotId, setActiveSlotId] = useState<number | null>(null);
    const [pendingSlotId, setPendingSlotId] = useState<number | null>(null);
    const [pendingPlayerType, setPendingPlayerType] = useState<PlayerType | null>(null);
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);

    const gameContainerStyle = useMemo(() => (
        loadedAssets?.embrune_splash
            ? { backgroundImage: `url('${loadedAssets.embrune_splash}')` }
            : {}
    ), [loadedAssets]);

    useEffect(() => {
        if (!isDbLoading && appState === 'LOADING_DB') {
            setAppState('LOADING_ASSETS');
            loadImagesAsBase64(imagePaths).then(assets => {
                setLoadedAssets(assets);
                setAppState('SLOT_SELECTION');
            }).catch(error => {
                console.error("Failed to load image assets:", error);
                setLoadedAssets({});
                setAppState('SLOT_SELECTION');
            });
        }
    }, [isDbLoading, appState]);
    
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => e.key === 'Control' && setIsCtrlPressed(true);
        const handleKeyUp = (e: KeyboardEvent) => e.key === 'Control' && setIsCtrlPressed(false);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', () => setIsCtrlPressed(false));
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    
    const handleSelectSlot = async (slotId: number) => {
        const gameState = await loadGameForSlot(slotId);
        if (gameState) {
            setActiveGameState(gameState);
            setActiveSlotId(slotId);
            setAppState('GAME');
        } else {
            console.error("Failed to load game state for slot", slotId);
        }
    };

    const handleCreateNew = (slotId: number) => {
        setPendingSlotId(slotId);
        setAppState('GAME_MODE_SELECTION');
    };

    const handleModeSelected = (playerType: PlayerType) => {
        setPendingPlayerType(playerType);
        setAppState('USERNAME_PROMPT');
    };

    const handleUsernameConfirm = async (username: string) => {
        if (pendingSlotId !== null && pendingPlayerType) {
            const newGameState = await createNewCharacter(pendingSlotId, username, pendingPlayerType);
            if (newGameState) {
                setActiveGameState(newGameState);
                setActiveSlotId(pendingSlotId);
                setAppState('GAME');
            }
        }
        setPendingSlotId(null);
        setPendingPlayerType(null);
    };

    const handleReturnToMenu = async (currentState: any) => {
        if (activeSlotId !== null && currentState) {
            await saveSlotState(activeSlotId, currentState);
            await refreshSlots();
        }
        ui.closeAllModals();
        setActiveGameState(null);
        setActiveSlotId(null);
        setAppState('SLOT_SELECTION');
    };

    const handleImportData = (slotId: number, data: string): boolean => {
        const success = importToSlot(slotId, data);
        if (success) {
            ui.closeImportModal();
        }
        return success;
    };
    
    const handleExport = () => { if (activeSlotId !== null) exportSlot(activeSlotId); };
    const handleImport = () => {
        if (activeSlotId !== null) {
            setPendingSlotId(activeSlotId);
            ui.setIsImportModalOpen(true);
        }
    };
    const handleReset = () => {
        if (activeSlotId !== null) {
            ui.setConfirmationPrompt({
                message: "Are you sure you want to delete this character and start a new game? This is irreversible.",
                onConfirm: async () => {
                    await deleteCharacter(activeSlotId);
                    setActiveGameState(null);
                    setActiveSlotId(null);
                    setAppState('SLOT_SELECTION');
                }
            });
        }
    };

    const renderAppContent = () => {
        if (isDbLoading || appState === 'LOADING_ASSETS') {
            return (
                <div className="w-full h-full game-container bg-cover bg-top bg-no-repeat md:bg-[length:100%_100%] border-8 border-gray-900 shadow-2xl p-4 flex flex-col items-center justify-center relative filter brightness-110 saturate-125" style={gameContainerStyle}>
                    <div className="absolute inset-0 bg-black/30"></div>
                     <div className="relative z-10 text-center animate-fade-in bg-black/60 p-8 rounded-lg border-2 border-gray-700 shadow-2xl">
                        <div className="w-16 h-16 mx-auto mb-6 animate-spin-slow">
                            <img src="https://api.iconify.design/game-icons:yin-yang.svg" alt="Loading symbol" className="w-full h-full filter invert text-yellow-500"/>
                        </div>
                        <p className="text-lg text-gray-300 italic">
                            {appState === 'LOADING_ASSETS' ? 'Loading assets...' : 'Loading your adventure...'}
                        </p>
                    </div>
                </div>
            );
        }

        switch (appState) {
            case 'SLOT_SELECTION':
                return (
                    <div className="w-full h-full game-container bg-cover bg-top bg-no-repeat md:bg-[length:100%_100%] overflow-y-auto md:overflow-hidden" style={gameContainerStyle}>
                        <SaveSlotScreen 
                            slots={slots as Slot[]}
                            onSelectSlot={handleSelectSlot}
                            onCreateNew={handleCreateNew}
                            onDelete={deleteCharacter}
                            onExport={exportSlot}
                            onImport={(slotId) => { setPendingSlotId(slotId); ui.setIsImportModalOpen(true); }}
                            assets={loadedAssets}
                            setTooltip={ui.setTooltip}
                        />
                    </div>
                );
            case 'GAME_MODE_SELECTION':
                 return (
                     <div className="w-full h-full game-container bg-cover bg-top bg-no-repeat md:bg-[length:100%_100%] border-8 border-gray-900 shadow-2xl p-2 md:p-4 flex items-center justify-center relative filter brightness-110 saturate-125" style={gameContainerStyle}>
                        <div className="absolute inset-0 bg-black/30"></div>
                        <GameModeSelection onSelect={handleModeSelected} onCancel={() => setAppState('SLOT_SELECTION')} />
                     </div>
                );
            case 'USERNAME_PROMPT':
                return (
                     <div className="w-full h-full game-container bg-cover bg-top bg-no-repeat md:bg-[length:100%_100%] border-8 border-gray-900 shadow-2xl p-2 md:p-4 flex items-center justify-center relative filter brightness-110 saturate-125" style={gameContainerStyle}>
                        <div className="absolute inset-0 bg-black/30"></div>
                        <UsernamePrompt onConfirm={handleUsernameConfirm} onCancel={() => setAppState('GAME_MODE_SELECTION')} />
                     </div>
                );
            case 'GAME':
            default:
                if (!loadedAssets || !activeGameState || activeSlotId === null) return null;
                return (
                    <div className="w-full h-full game-container border-8 border-gray-900 shadow-2xl p-2 flex flex-col md:flex-row gap-2 relative overflow-y-auto md:overflow-hidden">
                        <Game 
                            key={`${activeSlotId}-${gameKey}`} 
                            initialState={activeGameState} 
                            slotId={activeSlotId}
                            onReturnToMenu={handleReturnToMenu}
                            ui={ui} 
                            assets={loadedAssets}
                            onExportGame={handleExport}
                            onImportGame={handleImport}
                            onResetGame={handleReset}
                        />
                    </div>
                );
        }
    };
    
    return (
        <div className="bg-gray-800 text-white h-[100svh] w-screen flex items-center justify-center font-serif overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
            <div className="w-full h-full md:max-w-[177.77vh] md:max-h-[100vh] md:aspect-[16/9] relative">
                {renderAppContent()}
                {GAME_VERSION && (
                    <span className="absolute bottom-2 right-2 text-xs text-gray-500 z-10 pointer-events-none">
                        v{GAME_VERSION}
                    </span>
                )}
            </div>
            
            {/* Global Modals & Overlays */}
            {ui.showTooltips && ui.tooltip && <Tooltip tooltipState={ui.tooltip} isCtrlPressed={isCtrlPressed} />}
            {ui.contextMenu && <ContextMenu options={ui.contextMenu.options} triggerEvent={ui.contextMenu.event} isTouchInteraction={ui.contextMenu.isTouchInteraction} onClose={ui.closeContextMenu} />}
            {ui.makeXPrompt && <MakeXModal title={ui.makeXPrompt.title} maxQuantity={ui.makeXPrompt.max} onConfirm={ui.makeXPrompt.onConfirm} onCancel={ui.closeMakeXPrompt} />}
            {ui.confirmationPrompt && <ConfirmationModal message={ui.confirmationPrompt.message} onConfirm={ui.confirmationPrompt.onConfirm} onCancel={ui.closeConfirmationPrompt} />}
            {ui.exportData && <ExportModal exportState={ui.exportData} onClose={ui.exportData.onClose ?? ui.closeExportModal} />}
            {ui.isImportModalOpen && <ImportModal onImport={(data) => handleImportData(pendingSlotId!, data)} onClose={() => { ui.closeImportModal(); setPendingSlotId(null); }} />}

            {/* In-Game Only Overlays */}
            {appState === 'GAME' && activeGameState && (
                <>
                    {ui.activeQuestDetail && <QuestDetailView questId={ui.activeQuestDetail.questId} playerQuests={ui.activeQuestDetail.playerQuests} onClose={() => ui.setActiveQuestDetail(null)} />}
                    {ui.itemsOnDeathData && <ItemsOnDeathView inventory={ui.itemsOnDeathData.inventory} equipment={ui.itemsOnDeathData.equipment} coins={ui.itemsOnDeathData.coins} onClose={() => ui.setItemsOnDeathData(null)} />}
                    {ui.priceCheckerInventory && <PriceCheckerView inventory={ui.priceCheckerInventory} onClose={() => ui.setPriceCheckerInventory(null)} setTooltip={ui.setTooltip} setContextMenu={ui.setContextMenu} setMakeXPrompt={ui.setMakeXPrompt} />}
                    {ui.activeDungeonMap && (
                        <div className="absolute inset-0 bg-black/80 z-30 p-4">
                            <DungeonMapView
                                regionId={ui.activeDungeonMap.regionId}
                                mapTitle={ui.activeDungeonMap.mapTitle}
                                currentPoiId={activeGameState.currentPoiId}
                                onClose={() => ui.setActiveDungeonMap(null)}
                                onNavigate={(poiId: string) => { /* Navigation is disabled in this view */ }}
                                showAllPois={activeGameState.playerType === 'Cheats'}
                                setTooltip={ui.setTooltip}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default App;