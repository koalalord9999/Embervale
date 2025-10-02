


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
import ItemsOnDeathView from './components/views/overlays/ItemsOnDeathView';
import PriceCheckerView from './components/views/overlays/PriceCheckerView';
import Game from './components/game/Game';
import PreloadScreen from './components/screens/PreloadScreen';
import UsernamePrompt from './components/common/UsernamePrompt';
import { imagePaths, loadImagesAsBase64 } from './imageLoader';
import { GAME_VERSION, DEV_MODE_ENABLED } from './config';

type AppState = 'LOADING_DB' | 'LOADING_ASSETS' | 'PRELOAD' | 'USERNAME_PROMPT' | 'GAME';
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
    const [loadedAssets, setLoadedAssets] = useState<Record<string, string> | null>(null);
    const [promptReason, setPromptReason] = useState<PromptReason>(null);
    const [pendingImportState, setPendingImportState] = useState<any | null>(null);
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);

    const gameContainerStyle = useMemo(() => (
        loadedAssets?.embrune_splash
            ? { backgroundImage: `url('${loadedAssets.embrune_splash}')` }
            : {}
    ), [loadedAssets]);

    useEffect(() => {
        if (initialState && appState === 'LOADING_DB') {
            setAppState('LOADING_ASSETS');
            loadImagesAsBase64(imagePaths).then(assets => {
                setLoadedAssets(assets);
                setAppState('PRELOAD');
            }).catch(error => {
                console.error("Failed to load image assets:", error);
                // Handle error case, maybe proceed without images or show an error
                setLoadedAssets({});
                setAppState('PRELOAD');
            });
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
        if (!initialState || appState === 'LOADING_DB' || appState === 'LOADING_ASSETS') {
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
            case 'PRELOAD':
                return (
                    <div className="w-full h-full game-container bg-cover bg-top bg-no-repeat md:bg-[length:100%_100%]" style={gameContainerStyle}>
                        <PreloadScreen 
                            loadingTips={loadingTips} 
                            onContinue={handleContinue} 
                            onNewGame={requestNewGame} 
                            onImport={handleImportSave}
                            setContextMenu={ui.setContextMenu}
                            assets={loadedAssets}
                        />
                    </div>
                );
            case 'USERNAME_PROMPT':
                return (
                     <div className="w-full h-full game-container bg-cover bg-top bg-no-repeat md:bg-[length:100%_100%] border-8 border-gray-900 shadow-2xl p-2 md:p-4 flex items-center justify-center relative filter brightness-110 saturate-125" style={gameContainerStyle}>
                        <div className="absolute inset-0 bg-black/30"></div>
                        <UsernamePrompt onConfirm={handleUsernameConfirm} onCancel={handleUsernameCancel} />
                     </div>
                );
            case 'GAME':
            default:
                if (!loadedAssets) return null; // Should not happen if logic is correct
                return (
                    <div className="w-full h-full game-container border-8 border-gray-900 shadow-2xl p-2 flex flex-col md:flex-row gap-2 relative overflow-y-auto md:overflow-hidden">
                        <Game 
                            key={gameKey} 
                            initialState={initialState} 
                            onExportGame={handleExportSave} 
                            onImportGame={handleImportSave} 
                            onResetGame={requestNewGame} 
                            ui={ui} 
                            devModeOverride={DEV_MODE_ENABLED}
                            assets={loadedAssets}
                        />
                    </div>
                );
        }
    };
    
    return (
        <div className="bg-gray-800 text-white h-screen w-screen flex items-center justify-center font-serif overflow-hidden">
            <div className="w-full h-full md:max-w-[177.77vh] md:max-h-[100vh] md:aspect-[16/9] relative">
                {renderAppContent()}
                {GAME_VERSION && (
                    <span className="absolute bottom-2 right-2 text-xs text-gray-500 z-10 pointer-events-none">
                        v{GAME_VERSION}
                    </span>
                )}
            </div>
            
            {initialState && (
                <>
                    {ui.tooltip && <Tooltip tooltipState={ui.tooltip} isCtrlPressed={isCtrlPressed} />}
                    {ui.contextMenu && <ContextMenu options={ui.contextMenu.options} triggerEvent={ui.contextMenu.event} isTouchInteraction={ui.contextMenu.isTouchInteraction} onClose={ui.closeContextMenu} />}
                    {ui.makeXPrompt && <MakeXModal title={ui.makeXPrompt.title} maxQuantity={ui.makeXPrompt.max} onConfirm={ui.makeXPrompt.onConfirm} onCancel={ui.closeMakeXPrompt} />}
                    {ui.confirmationPrompt && <ConfirmationModal message={ui.confirmationPrompt.message} onConfirm={ui.confirmationPrompt.onConfirm} onCancel={ui.closeConfirmationPrompt} />}
                    {ui.exportData && <ExportModal exportState={ui.exportData} onClose={ui.closeExportModal} />}
                    {ui.isImportModalOpen && <ImportModal onImport={loadFromImportedData} onClose={ui.closeImportModal} />}
                    {ui.activeSkillGuide && <SkillGuideView activeSkill={ui.activeSkillGuide} setActiveSkill={ui.setActiveSkillGuide} onClose={ui.closeSkillGuide} playerSkills={initialState.skills as any[]} />}
                    {ui.activeQuestDetail && <QuestDetailView questId={ui.activeQuestDetail.questId} playerQuests={ui.activeQuestDetail.playerQuests} onClose={() => ui.setActiveQuestDetail(null)} />}
                    {ui.isItemsOnDeathOpen && <ItemsOnDeathView inventory={initialState.inventory} equipment={initialState.equipment} coins={initialState.coins} onClose={() => ui.setIsItemsOnDeathOpen(false)} />}
                    {ui.priceCheckerInventory && <PriceCheckerView inventory={ui.priceCheckerInventory} onClose={() => ui.setPriceCheckerInventory(null)} setTooltip={ui.setTooltip} />}
                </>
            )}
        </div>
    );
};

export default App;