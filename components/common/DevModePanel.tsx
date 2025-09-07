
import React from 'react';
import Button from './Button';

interface DevModePanelProps {
    combatSpeedMultiplier: number;
    setCombatSpeedMultiplier: (speed: number) => void;
    isInstantRespawnOn: boolean;
    setIsInstantRespawnOn: (isOn: boolean) => void;
    instantRespawnCounter: number | null;
    setInstantRespawnCounter: (count: number | null) => void;
    isInCombat: boolean;
    isCurrentMonsterAggro: boolean;
    onToggleAggro: () => void;
    onClose: () => void;
}

const DevModePanel: React.FC<DevModePanelProps> = ({
    combatSpeedMultiplier,
    setCombatSpeedMultiplier,
    isInstantRespawnOn,
    setIsInstantRespawnOn,
    instantRespawnCounter,
    setInstantRespawnCounter,
    isInCombat,
    isCurrentMonsterAggro,
    onToggleAggro,
    onClose,
}) => {

    const handleToggleRespawn = () => {
        if (isInstantRespawnOn) {
            // Turning off
            setIsInstantRespawnOn(false);
            setInstantRespawnCounter(null);
        } else {
            // Turning on
            setIsInstantRespawnOn(true);
        }
    };

    return (
        <div className="fixed top-4 right-[26%] w-64 bg-gray-900/90 border-2 border-yellow-700 rounded-lg shadow-2xl z-50 text-white font-mono p-3">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-yellow-400">Dev Mode</h3>
                <button onClick={onClose} className="text-2xl leading-none text-red-400 hover:text-red-300">&times;</button>
            </div>

            {/* Combat Speed */}
            <div className="mb-3">
                <label className="block text-sm font-semibold mb-1">Combat Speed</label>
                <div className="flex gap-1">
                    {[1, 2, 3].map(speed => (
                        <Button
                            key={speed}
                            size="sm"
                            onClick={() => setCombatSpeedMultiplier(speed)}
                            variant={combatSpeedMultiplier === speed ? 'primary' : 'secondary'}
                            className="flex-1"
                        >
                            {speed}x
                        </Button>
                    ))}
                </div>
            </div>
            
            {/* Instant Respawn */}
            <div className="mb-3">
                <label className="block text-sm font-semibold mb-1">Instant Respawn</label>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={handleToggleRespawn}
                        className={`flex-1 py-1 text-xs rounded font-bold transition-colors ${isInstantRespawnOn ? 'bg-green-600 hover:bg-green-500' : 'bg-red-700 hover:bg-red-600'}`}
                    >
                        {isInstantRespawnOn ? 'ON' : 'OFF'}
                    </button>
                    <input
                        type="number"
                        placeholder="Count"
                        disabled={!isInstantRespawnOn}
                        value={instantRespawnCounter ?? ''}
                        onChange={e => setInstantRespawnCounter(e.target.value ? parseInt(e.target.value, 10) : null)}
                        className="w-20 p-1 text-xs bg-gray-800 border border-gray-600 rounded disabled:opacity-50 text-center"
                    />
                </div>
            </div>

            {/* Perm-Aggro */}
            <div>
                <label className="block text-sm font-semibold mb-1">Permanent Aggro</label>
                <button
                    onClick={onToggleAggro}
                    disabled={!isInCombat}
                    className={`w-full py-1 text-xs rounded font-bold transition-colors ${isCurrentMonsterAggro ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'} disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed`}
                >
                    {isCurrentMonsterAggro ? 'ON (For Current Combat)' : 'OFF (For Current Combat)'}
                </button>
            </div>
        </div>
    );
};

export default DevModePanel;
