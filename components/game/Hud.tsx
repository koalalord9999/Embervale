import React from 'react';
import { PlayerSkill, ActivePanel, SkillName } from '../../types';
import ProgressBar from '../common/ProgressBar';
import { ContextMenuState } from '../../hooks/useUIState';

interface HudProps {
    skills: PlayerSkill[];
    currentHp: number;
    maxHp: number;
    combatLevel: number;
    activePanel: ActivePanel;
    setActivePanel: (panel: ActivePanel) => void;
    onResetGame: () => void;
    onExportGame: () => void;
    onImportGame: () => void;
    onOpenAtlas: () => void;
    isBusy?: boolean;
    setContextMenu: (menu: ContextMenuState | null) => void;
    onOpenExpandedMap: () => void;
    onToggleDevPanel: () => void;
    tutorialStage: number;
    unlockedHudButtons: string[];
    isDevMode: boolean;
}

const HudButton: React.FC<{ label: string, onClick: () => void, isActive: boolean, disabled?: boolean, className?: string, onContextMenu?: (e: React.MouseEvent) => void, tutorialId?: string }> = ({ label, onClick, isActive, disabled = false, className = '', onContextMenu, tutorialId }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-3 py-1 text-sm border-2 rounded transition-colors w-full ${isActive ? 'bg-yellow-600 border-yellow-400 text-white' : 'bg-gray-700 border-gray-500 hover:bg-gray-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        onContextMenu={onContextMenu}
        data-tutorial-id={tutorialId}
    >
        {label}
    </button>
);

const Hud: React.FC<HudProps> = ({ skills, currentHp, maxHp, combatLevel, activePanel, setActivePanel, onResetGame, onExportGame, onImportGame, onOpenAtlas, isBusy, setContextMenu, onOpenExpandedMap, onToggleDevPanel, tutorialStage, unlockedHudButtons, isDevMode }) => {
    const isTutorialActive = tutorialStage >= 0;

    return (
        <div className="bg-black/70 border-2 border-gray-600 rounded-lg p-3 flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-yellow-400">Player Info</h2>
                <div className="flex gap-2 items-center">
                    <button onClick={onExportGame} className="text-xs text-blue-400 hover:text-blue-300 hover:underline">Export</button>
                    <button onClick={onImportGame} className="text-xs text-green-400 hover:text-green-300 hover:underline">Import</button>
                    <button onClick={onResetGame} className="text-xs text-red-400 hover:text-red-300 hover:underline">New Game</button>
                    {isDevMode && (
                        <button onClick={onToggleDevPanel} className="px-2 py-0.5 text-xs bg-purple-800 hover:bg-purple-700 border border-purple-600 rounded">Dev</button>
                    )}
                </div>
            </div>
            
            <div className="text-center">
                <p className="font-semibold">Combat Level: {combatLevel}</p>
            </div>
            
            <div>
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-red-400 font-bold">HP</span>
                    <span>{currentHp} / {maxHp}</span>
                </div>
                <ProgressBar value={currentHp} maxValue={maxHp} color="bg-red-600" />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
                <HudButton label="Inv" onClick={() => setActivePanel(activePanel === 'inventory' ? null : 'inventory')} isActive={activePanel === 'inventory'} disabled={isTutorialActive && !unlockedHudButtons.includes('inventory')} tutorialId="inventory-button" />
                <HudButton label="Equip" onClick={() => setActivePanel(activePanel === 'equipment' ? null : 'equipment')} isActive={activePanel === 'equipment'} disabled={isTutorialActive && !unlockedHudButtons.includes('equipment')} tutorialId="equipment-button" />
                <HudButton label="Skills" onClick={() => setActivePanel(activePanel === 'skills' ? null : 'skills')} isActive={activePanel === 'skills'} disabled={isTutorialActive && !unlockedHudButtons.includes('skills')} tutorialId="skills-button" />
                <HudButton label="Quests" onClick={() => setActivePanel(activePanel === 'quests' ? null : 'quests')} isActive={activePanel === 'quests'} disabled={isTutorialActive && !unlockedHudButtons.includes('quests')} />
                <HudButton
                    label="Map"
                    onClick={() => setActivePanel(activePanel === 'map' ? null : 'map')}
                    isActive={activePanel === 'map'}
                    disabled={isBusy || (isTutorialActive && !unlockedHudButtons.includes('map'))}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({
                            options: [{ label: 'Expand', onClick: onOpenExpandedMap }],
                            position: { x: e.clientX, y: e.clientY }
                        });
                    }}
                    tutorialId="map-button"
                />
                <HudButton label="Atlas" onClick={onOpenAtlas} isActive={false} disabled={isBusy || (isTutorialActive && !unlockedHudButtons.includes('atlas'))} />
            </div>
        </div>
    );
};

export default Hud;