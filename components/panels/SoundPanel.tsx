import React, { useState, useMemo, useCallback } from 'react';
import { AUDIO_MANIFEST, SoundID } from '../../constants/audioManifest';
import { useSoundEngine } from '../../hooks/useSoundEngine';
import { useUIState } from '../../hooks/useUIState';
import { useMusicEngine, MUSIC_TRACKS } from '../../hooks/useMusicEngine';
import Button from '../common/Button';
import { WorldState } from '../../types';

interface SoundPanelProps {
    addLog: (message: string) => void;
    worldState: WorldState;
    ui: ReturnType<typeof useUIState>;
}

const SoundPanel: React.FC<SoundPanelProps> = ({ addLog, worldState, ui }) => {
    const { play, playRecipe, getContextTime } = useSoundEngine(ui.masterVolume, ui.isMuted);
    
    // Pass undefined as regionId to prevent automatic track changes when opening this panel.
    const { musicLibrary, playMusicSegment, stopMusic } = useMusicEngine(undefined, ui.masterVolume, ui.isMuted);

    // Creator State
    const [type, setType] = useState<'osc' | 'noise'>('osc');
    const [subType, setSubType] = useState<string>('sine');
    const [freq, setFreq] = useState(440);
    const [dur, setDur] = useState(0.1);
    const [vol, setVol] = useState(0.3);
    const [attack, setAttack] = useState(0.005);
    const [decay, setDecay] = useState(0.1);
    const [filter, setFilter] = useState(2000);
    const [pitchMod, setPitchMod] = useState(0);
    const [baseMultiLayerRecipe, setBaseMultiLayerRecipe] = useState<string[] | null>(null);

    const recipeString = useMemo(() => {
        const parts = [];
        if (type === 'osc') {
            parts.push(`osc:${subType}`);
            parts.push(`freq:${freq}`);
            if (pitchMod !== 0) parts.push(`pitchMod:${pitchMod}`);
        } else {
            parts.push(`noise:${subType}`);
            parts.push(`filter:${filter}`);
        }
        parts.push(`dur:${dur.toFixed(2)}`);
        parts.push(`vol:${vol.toFixed(2)}`);
        parts.push(`attack:${attack.toFixed(3)}`);
        parts.push(`decay:${decay.toFixed(2)}`);
        return parts.join('|');
    }, [type, subType, freq, dur, vol, attack, decay, filter, pitchMod]);

    const playCurrentRecipe = useCallback(() => {
        if (baseMultiLayerRecipe) {
            const newMultiLayerRecipe = [...baseMultiLayerRecipe];
            const firstLayer = newMultiLayerRecipe[0];
            const timeOffsetMatch = firstLayer.match(/^(d+):/);
            const timeOffset = timeOffsetMatch ? timeOffsetMatch[0] : '';
            
            newMultiLayerRecipe[0] = timeOffset + recipeString;

            const baseTime = getContextTime();
            newMultiLayerRecipe.forEach(recipe => playRecipe(recipe, baseTime));
        } else {
            playRecipe(recipeString);
        }
    }, [baseMultiLayerRecipe, recipeString, getContextTime, playRecipe]);
    
    const handleSliderRelease = () => {
        playCurrentRecipe();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(recipeString);
        addLog("Recipe copied to clipboard!");
    };
    
    const handleLoadRecipe = useCallback((e: React.MouseEvent, soundId: SoundID) => {
        e.preventDefault();
        
        let recipeOrArray = AUDIO_MANIFEST[soundId];
        let recipeToParse: string;

        if (Array.isArray(recipeOrArray)) {
            setBaseMultiLayerRecipe(recipeOrArray); // Store the whole array
            recipeToParse = recipeOrArray[0]; // Get the first layer to parse
            addLog(`Loaded multi-layer sound '${soundId}' for editing.`);
        } else {
            setBaseMultiLayerRecipe(null); // It's a single sound
            recipeToParse = recipeOrArray;
            addLog(`Loaded '${soundId}' for editing.`);
        }
    
        // Strip time offset if present for parsing
        if (recipeToParse.match(/^d+:/)) {
            recipeToParse = recipeToParse.split(/:(.+)/)[1];
        }
        
        const params = recipeToParse.split('|').reduce((acc, part) => {
            const [key, val] = part.split(':');
            acc[key] = val;
            return acc;
        }, {} as Record<string, any>);
    
        // Reset to defaults to clear old params from other types
        setType('osc'); setSubType('sine'); setFreq(440);
        setDur(0.1); setVol(0.3); setAttack(0.005);
        setDecay(0.1); setFilter(2000); setPitchMod(0);
        
        // Apply parsed params
        if (params.osc) { setType('osc'); setSubType(params.osc); } 
        else if (params.noise) { setType('noise'); setSubType(params.noise); }
        
        if (params.freq) setFreq(parseFloat(params.freq));
        if (params.dur) setDur(parseFloat(params.dur));
        if (params.vol) setVol(parseFloat(params.vol));
        if (params.attack) setAttack(parseFloat(params.attack));
        if (params.decay) setDecay(parseFloat(params.decay));
        if (params.filter) setFilter(parseFloat(params.filter));
        if (params.pitchMod) setPitchMod(parseFloat(params.pitchMod));
    }, [addLog]);

    if (ui.isSoundCreatorOpen) {
        return (
            <div className="flex flex-col h-full text-gray-300 gap-4 overflow-y-auto pr-1">
                <div className="flex justify-between items-center border-b border-gray-700 pb-1">
                    <h3 className="text-sm font-bold text-yellow-400">Sound Creator</h3>
                    <button 
                        onClick={() => ui.setIsSoundCreatorOpen(false)}
                        className="text-[10px] bg-gray-700 hover:bg-gray-600 px-2 py-0.5 rounded"
                    >
                        Back to Library
                    </button>
                </div>

                {/* Library Preview */}
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-yellow-400 border-b border-gray-700 pb-1">SFX Recipes</h3>
                    <div className="grid grid-cols-2 gap-1">
                        {(Object.keys(AUDIO_MANIFEST) as SoundID[]).map(id => (
                            <button 
                                key={id} 
                                onClick={() => play(id)} 
                                onContextMenu={(e) => handleLoadRecipe(e, id)}
                                className="text-[10px] text-left p-1 bg-gray-800 hover:bg-gray-700 rounded border border-gray-600 truncate"
                            >
                                {id.replace(/_/g, ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Creator Tool */}
                <div className="space-y-3 bg-black/30 p-2 rounded border border-gray-700 pb-4 mt-auto">
                    <div className="space-y-2 text-xs">
                        <div className="flex gap-2">
                            <label className="w-16">Source:</label>
                            <select value={type} onChange={(e) => { setType(e.target.value as any); setSubType(e.target.value === 'osc' ? 'sine' : 'white'); }} className="flex-1 bg-gray-900 border border-gray-600 rounded">
                                <option value="osc">Oscillator</option>
                                <option value="noise">Noise</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <label className="w-16">Type:</label>
                            <select value={subType} onChange={(e) => setSubType(e.target.value)} className="flex-1 bg-gray-900 border border-gray-600 rounded">
                                {type === 'osc' ? (<><option value="sine">Sine</option><option value="square">Square</option><option value="triangle">Triangle</option><option value="sawtooth">Sawtooth</option></>) : (<><option value="white">White</option><option value="brown">Brown</option></>)}
                            </select>
                        </div>

                        {type === 'osc' ? (
                            <>
                                <div className="flex flex-col gap-1"><div className="flex justify-between"><label>Freq (Hz):</label><span className="text-yellow-500">{freq}</span></div><input type="range" min="20" max="2000" step="10" value={freq} onChange={(e) => setFreq(+e.target.value)} onMouseUp={handleSliderRelease} onTouchEnd={handleSliderRelease} className="w-full h-1" /></div>
                                <div className="flex flex-col gap-1"><div className="flex justify-between"><label>Pitch Mod:</label><span className="text-yellow-500">{pitchMod}</span></div><input type="range" min="-1000" max="1000" step="10" value={pitchMod} onChange={(e) => setPitchMod(+e.target.value)} onMouseUp={handleSliderRelease} onTouchEnd={handleSliderRelease} className="w-full h-1" /></div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-1"><div className="flex justify-between"><label>Filter (Hz):</label><span className="text-yellow-500">{filter}</span></div><input type="range" min="100" max="10000" step="100" value={filter} onChange={(e) => setFilter(+e.target.value)} onMouseUp={handleSliderRelease} onTouchEnd={handleSliderRelease} className="w-full h-1" /></div>
                            </>
                        )}

                        <div className="flex flex-col gap-1"><div className="flex justify-between"><label>Duration:</label><span className="text-yellow-500">{dur.toFixed(2)}s</span></div><input type="range" min="0.01" max="1.5" step="0.01" value={dur} onChange={(e) => setDur(+e.target.value)} onMouseUp={handleSliderRelease} onTouchEnd={handleSliderRelease} className="w-full h-1" /></div>
                        <div className="flex flex-col gap-1"><div className="flex justify-between"><label>Volume:</label><span className="text-yellow-500">{vol.toFixed(2)}</span></div><input type="range" min="0.05" max="0.8" step="0.05" value={vol} onChange={(e) => setVol(+e.target.value)} onMouseUp={handleSliderRelease} onTouchEnd={handleSliderRelease} className="w-full h-1" /></div>
                        <div className="flex flex-col gap-1"><div className="flex justify-between"><label>Attack:</label><span className="text-yellow-500">{attack.toFixed(3)}s</span></div><input type="range" min="0" max="0.5" step="0.001" value={attack} onChange={(e) => setAttack(+e.target.value)} onMouseUp={handleSliderRelease} onTouchEnd={handleSliderRelease} className="w-full h-1" /></div>
                        <div className="flex flex-col gap-1"><div className="flex justify-between"><label>Decay:</label><span className="text-yellow-500">{decay.toFixed(2)}s</span></div><input type="range" min="0.01" max="1.5" step="0.01" value={decay} onChange={(e) => setDecay(+e.target.value)} onMouseUp={handleSliderRelease} onTouchEnd={handleSliderRelease} className="w-full h-1" /></div>
                    </div>
                    <div className="pt-2 flex flex-col gap-2">
                        <Button size="sm" onClick={playCurrentRecipe}>Test Sound</Button>
                        <div className="relative">
                            <textarea readOnly value={recipeString} className="w-full h-16 bg-black border border-gray-600 rounded p-1 text-[10px] font-mono break-all resize-none" />
                            <button onClick={handleCopy} className="absolute top-1 right-1 bg-gray-700 hover:bg-gray-600 p-1 rounded text-[8px] uppercase font-bold">Copy</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default Library View
    return (
        <div className="flex flex-col h-full text-gray-300 gap-2 overflow-y-auto pr-1">
            <div className="flex justify-between items-center border-b border-gray-700 pb-1 mb-2">
                <h3 className="font-bold text-yellow-400 text-sm">Music Player</h3>
                <button 
                    onClick={() => {
                        stopMusic(0.5);
                        addLog("Music stopped.");
                    }} 
                    className="text-[10px] bg-red-900/40 hover:bg-red-800/60 px-2 py-0.5 rounded border border-red-700/50 uppercase font-bold text-red-200"
                >
                    Stop
                </button>
            </div>

            <div className="flex flex-col gap-1">
                {MUSIC_TRACKS.map(track => {
                    const isUnlocked = worldState.unlockedMusicTracks.includes(track.id);
                    return (
                        <button 
                            key={track.id} 
                            onClick={() => {
                                if (isUnlocked) {
                                    addLog(`Playing ${track.name}...`);
                                    playMusicSegment((musicLibrary as any)[track.id], track.id);
                                } else {
                                    addLog(`You haven't discovered ${track.name} yet!`);
                                }
                            }} 
                            className={`text-left px-2 py-1.5 rounded transition-colors text-xs ${isUnlocked ? 'text-green-400 hover:bg-green-900/20' : 'text-red-500/60 cursor-not-allowed'}`}
                        >
                            {track.name}
                        </button>
                    );
                })}
            </div>
            
            <p className="mt-auto text-[10px] text-gray-500 italic text-center p-2">
                Discover more regions to unlock their music.
            </p>
        </div>
    );
};

export default SoundPanel;