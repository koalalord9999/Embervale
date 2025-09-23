

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
        startNewGame,
        updateUsernameAndSave,
        loadImportedState,
        parseSaveData
    } = useGameStateManager(ui);
    
    const [appState, setAppState] = useState<AppState>('LOADING_DB');
    const [promptReason, setPromptReason] = useState<PromptReason>(null);
    const [pendingImportState, setPendingImportState] = useState<any | null>(null);
    const [version, setVersion] = useState<string>('');
    const [isDevModeEnabled, setIsDevModeEnabled] = useState<boolean>(false);

    useEffect(() => {
        fetch('/metadata.json')
            .then(response => response.json())
            .then(data => {
                if (data.version) {
                    setVersion(data.version);
                }
                if (data.DevModeEnabled) {
                    setIsDevModeEnabled(true);
                }
            })
            .catch(error => console.error("Failed to load metadata:", error));
    }, []);

    useEffect(() => {
        // Only transition from LOADING_DB to PRELOAD once.
        if (initialState && appState === 'LOADING_DB') {
            setAppState('PRELOAD');
        }
    }, [initialState, appState]);
    
    // Globally disable the default browser right-click context menu.
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);
    
    const loadingTips = useMemo(() => [
        "The Whispering Woods are older than Meadowdale itself.",
        "Bronze is a simple alloy of copper and tin. Use a furnace to smelt them.",
        "Different combat stances provide bonuses to Attack, Strength, or Defence.",
        "Check the quest board in the local tavern for repeatable tasks and good coin.",
        "A sharp axe is for trees; a sturdy pickaxe is for rocks. Bring the right tool.",
        "Cooking on a range can turn a simple fish into a life-saving meal.",
        "Iron is stronger than bronze, but requires coal to smelt into steel for the best results.",
        "Oak logs can be fletched into more powerful bows than standard logs.",
        "Monsters in plate armor are often weaker to crush attacks from weapons like maces and warhammers.",
        "Higher-level fish not only give more Fishing XP but also heal more hitpoints when cooked.",
        "The goblins in the Stonebreak Mine are a nuisance, but some say a powerful king rules their warrens deeper in.",
        "Shear sheep for wool, then use a spinning wheel to create balls of wool for crafting.",
        "The Feywood is a magical place, but its inhabitants don't always take kindly to outsiders.",
        "Many herbs you find are grimy. Clean them to unlock their potential in potion-making.",
        "Your inventory is limited. Use a bank to store items you don't need right now.",
        "Burying the bones of your enemies can grant you Prayer experience, a valuable skill in tough fights.",
        "Unfinished potions need a secondary ingredient to become useful. Experiment to discover new recipes!",
        "Upgrading your pickaxe and axe will allow you to gather higher-tier resources.",
        "The 'Defensive' stance is slower, but grants both Defence and Hitpoints experience with every successful hit.",
        "The road south of Meadowdale is known to be plagued by bandits. Travel with caution.",
        "Talk to everyone you meet. Some may have quests or valuable information.",
        "Long-press or right-click on items in your inventory to see all available actions, like 'Use' or 'Drop'.",
        "Failing an action, like burning a fish, will still grant a small amount of experience.",
        "You'll need a knife to fletch logs into arrow shafts or unstrung bows.",
        "A shield can significantly boost your defensive stats, but prevents you from using powerful two-handed weapons.",
        "The Gale-Swept Peaks are treacherous but hold rare minerals for high-level smiths.",
        "Some monsters have special attacks. Be prepared for anything when facing a new foe.",
        "Flax can be picked from fields and spun into bowstrings, a key component for any aspiring ranger."
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
                <div className="w-full h-full game-container bg-cover bg-center border-8 border-gray-900 shadow-2xl p-4 flex flex-col items-center justify-center relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505236755279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop')` }}>
                    <div className="absolute inset-0 bg-black/50"></div>
                     <div className="relative z-10 text-center animate-fade-in bg-black/60 p-8 rounded-lg border-2 border-gray-700 shadow-2xl">
                        <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-6" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>Embrune</h1>
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
                    <div className="w-full h-full game-container">
                        <PreloadScreen 
                            loadingTips={loadingTips} 
                            onContinue={handleContinue} 
                            onNewGame={requestNewGame} 
                            onImport={handleImportSave}
                            setContextMenu={ui.setContextMenu}
                        />
                    </div>
                );
            case 'USERNAME_PROMPT':
                return (
                     <div className="w-full h-full game-container bg-cover bg-center border-8 border-gray-900 shadow-2xl p-2 md:p-4 flex items-center justify-center relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-15052367semberv5279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop')`}}>
                        <div className="absolute inset-0 bg-black/60"></div>
                        <UsernamePrompt onConfirm={handleUsernameConfirm} onCancel={handleUsernameCancel} />
                     </div>
                );
            case 'GAME':
            default:
                return (
                    <div className="w-full h-full game-container bg-cover bg-center border-8 border-gray-900 shadow-2xl p-2 flex flex-col md:flex-row gap-2 relative overflow-y-auto md:overflow-hidden" style={{ backgroundImage: `url('https://images.unsplash.com/photo-15052367semberv5279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop')`}}>
                        <Game 
                            key={gameKey} 
                            initialState={initialState} 
                            onExportGame={handleExportSave} 
                            onImportGame={handleImportSave} 
                            onResetGame={requestNewGame} 
                            ui={ui} 
                            devModeOverride={isDevModeEnabled}
                        />
                    </div>
                );
        }
    };
    
    return (
        <div className="bg-gray-800 text-white h-screen w-screen flex items-center justify-center font-serif overflow-hidden">
            <div className="w-full h-full md:max-w-[177.77vh] md:max-h-[100vh] md:aspect-[16/9] relative">
                {renderAppContent()}
                {version && (
                    <span className="absolute bottom-2 right-2 text-xs text-gray-500 z-10 pointer-events-none">
                        v{version}
                    </span>
                )}
            </div>
            
            {initialState && (
                <>
                    {ui.tooltip && <Tooltip content={ui.tooltip.content} position={ui.tooltip.position} />}
                    {ui.contextMenu && <ContextMenu options={ui.contextMenu.options} triggerEvent={ui.contextMenu.event} isTouchInteraction={ui.contextMenu.isTouchInteraction} onClose={ui.closeContextMenu} />}
                    {ui.makeXPrompt && <MakeXModal title={ui.makeXPrompt.title} maxQuantity={ui.makeXPrompt.max} onConfirm={ui.makeXPrompt.onConfirm} onCancel={ui.closeMakeXPrompt} />}
                    {ui.confirmationPrompt && <ConfirmationModal message={ui.confirmationPrompt.message} onConfirm={ui.confirmationPrompt.onConfirm} onCancel={ui.closeConfirmationPrompt} />}
                    {ui.exportData && <ExportModal exportState={ui.exportData} onClose={ui.closeExportModal} />}
                    {ui.isImportModalOpen && <ImportModal onImport={loadFromImportedData} onClose={ui.closeImportModal} />}
                    {ui.activeSkillGuide && <SkillGuideView activeSkill={ui.activeSkillGuide} setActiveSkill={ui.setActiveSkillGuide} onClose={ui.closeSkillGuide} playerSkills={initialState.skills as any[]} />}
                    {ui.activeQuestDetail && <QuestDetailView questId={ui.activeQuestDetail.questId} playerQuests={ui.activeQuestDetail.playerQuests} onClose={() => ui.setActiveQuestDetail(null)} />}
                    {ui.equipmentStats && <EquipmentStatsView equipment={ui.equipmentStats} onClose={() => ui.setEquipmentStats(null)} />}
                    {ui.isItemsOnDeathOpen && <ItemsOnDeathView coins={initialState.coins} onClose={() => ui.setIsItemsOnDeathOpen(false)} />}
                    {ui.priceCheckerInventory && <PriceCheckerView inventory={ui.priceCheckerInventory} onClose={() => ui.setPriceCheckerInventory(null)} setTooltip={ui.setTooltip} />}
                </>
            )}
        </div>
    );
};

export default App;