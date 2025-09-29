import React from 'react';
import Button from '../common/Button';

interface SettingsPanelProps {
    onResetGame: () => void;
    onExportGame: () => void;
    onImportGame: () => void;
    isDevMode: boolean;
    onToggleDevPanel: () => void;
    isTouchSimulationEnabled: boolean;
    onToggleTouchSimulation: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onResetGame, onExportGame, onImportGame, isDevMode, onToggleDevPanel, isTouchSimulationEnabled, onToggleTouchSimulation }) => {
    return (
        <div className="flex flex-col h-full text-gray-300">
            <div className="space-y-3">
                <Button onClick={onExportGame} className="w-full">Export Save</Button>
                <Button onClick={onImportGame} className="w-full">Import Save</Button>
                <Button onClick={onResetGame} variant="secondary" className="w-full">New Game</Button>
                {isDevMode && (
                    <div className="pt-3 border-t-2 border-gray-600 space-y-3">
                        <Button onClick={onToggleDevPanel} variant="secondary" className="w-full bg-purple-800 border-purple-600 hover:bg-purple-700">Open Dev Panel</Button>
                        <div className="flex justify-between items-center text-sm bg-gray-900/50 p-2 rounded">
                            <label htmlFor="touch-sim">Simulate Touch</label>
                            <button onClick={onToggleTouchSimulation} className={`px-4 py-1 text-xs rounded font-bold transition-colors ${isTouchSimulationEnabled ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                {isTouchSimulationEnabled ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPanel;