import { useCallback, useRef, useEffect, useState } from 'react';
import { AUDIO_MANIFEST, SoundID } from '../constants/audioManifest';
import { createWhiteNoiseBuffer, createBrownNoiseBuffer } from '../utils/audioSynth';

export let globalAudioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;

// Track the current active music gain node
let activeMusicGain: GainNode | null = null;
const activeMusicNodes = new Set<AudioScheduledSourceNode>();

export const useSoundEngine = (volume: number = 0.5, isMuted: boolean = false) => {
    const [isAudioActive, setIsAudioActive] = useState(false);
    const contextRef = useRef<AudioContext | null>(null);

    // Synchronize local state with global context state
    useEffect(() => {
        const update = () => {
            const active = globalAudioContext?.state === 'running';
            setIsAudioActive(active);
        };

        // Poll for context creation and state changes
        const interval = setInterval(update, 500);
        
        if (globalAudioContext) {
            globalAudioContext.addEventListener('statechange', update);
        }
        
        update();
        
        return () => {
            clearInterval(interval);
            globalAudioContext?.removeEventListener('statechange', update);
        };
    }, []);

    const initContext = useCallback(() => {
        if (!globalAudioContext) {
            globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            masterGain = globalAudioContext.createGain();
            masterGain.connect(globalAudioContext.destination);
        }
        
        if (globalAudioContext.state === 'suspended') {
            globalAudioContext.resume();
        }

        contextRef.current = globalAudioContext;
        
        if (masterGain) {
            masterGain.gain.setTargetAtTime(isMuted ? 0 : volume, globalAudioContext.currentTime, 0.05);
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (globalAudioContext && masterGain) {
            masterGain.gain.setTargetAtTime(isMuted ? 0 : volume, globalAudioContext.currentTime, 0.05);
        }
    }, [volume, isMuted]);

    const getMusicGain = useCallback(() => {
        if (!globalAudioContext || !masterGain) return null;
        if (!activeMusicGain) {
            activeMusicGain = globalAudioContext.createGain();
            activeMusicGain.connect(masterGain);
            activeMusicGain.gain.setValueAtTime(0, globalAudioContext.currentTime);
        }
        return activeMusicGain;
    }, []);

    const setMusicVolume = useCallback((targetVolume: number, fadeSeconds: number = 0.1) => {
        const mGain = getMusicGain();
        if (!globalAudioContext || !mGain) return;
        
        const now = globalAudioContext.currentTime;
        mGain.gain.cancelScheduledValues(now);
        mGain.gain.setValueAtTime(mGain.gain.value, now);
        mGain.gain.linearRampToValueAtTime(targetVolume, now + fadeSeconds);
    }, [getMusicGain]);

    const stopAllMusic = useCallback((fadeSeconds: number = 0.5) => {
        if (!globalAudioContext || !activeMusicGain) return;

        const now = globalAudioContext.currentTime;
        const nodeToOrphan = activeMusicGain;
        
        // Unset global ref immediately so new tracks get a fresh node
        activeMusicGain = null;

        // Fade out and disconnect the old node
        nodeToOrphan.gain.cancelScheduledValues(now);
        nodeToOrphan.gain.setValueAtTime(nodeToOrphan.gain.value, now);
        nodeToOrphan.gain.linearRampToValueAtTime(0, now + fadeSeconds);

        setTimeout(() => {
            nodeToOrphan.disconnect();
            // Clear tracking set as nodes are now orphaned and silent
            activeMusicNodes.clear();
        }, (fadeSeconds * 1000) + 100);
    }, []);

    const playRecipe = useCallback((recipe: string, baseStartTime?: number, category: 'sfx' | 'music' = 'sfx') => {
        if (!globalAudioContext || !masterGain || isMuted) return;

        let recipeString = recipe;
        let timeOffsetMs = 0;
        if (recipe.match(/^d+:/)) {
            const parts = recipe.split(/:(.+)/);
            timeOffsetMs = parseInt(parts[0], 10);
            recipeString = parts[1];
        }

        const params = recipeString.split('|').reduce((acc, part) => {
            const [key, val] = part.split(':');
            acc[key] = val;
            return acc;
        }, {} as Record<string, any>);

        const now = (baseStartTime ?? globalAudioContext.currentTime) + (timeOffsetMs / 1000);
        const duration = parseFloat(params.dur || 0.1);
        const freq = parseFloat(params.freq || 440);
        const vol = parseFloat(params.vol || 0.5);
        const attack = parseFloat(params.attack || 0.005);
        const decay = parseFloat(params.decay || duration);
        const filterFreq = parseFloat(params.filter || 2000);
        const pitchMod = parseFloat(params.pitchMod || 0);

        const nodeGain = globalAudioContext.createGain();
        nodeGain.gain.setValueAtTime(0, now);
        nodeGain.gain.linearRampToValueAtTime(vol, now + attack);
        nodeGain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);
        
        if (category === 'music') {
            const mGain = getMusicGain();
            if (mGain) nodeGain.connect(mGain);
        } else {
            nodeGain.connect(masterGain);
        }

        let sourceNode: AudioScheduledSourceNode;

        if (params.osc) {
            const osc = globalAudioContext.createOscillator();
            osc.type = params.osc as OscillatorType;
            osc.frequency.setValueAtTime(freq, now);
            if (pitchMod !== 0) {
                osc.frequency.exponentialRampToValueAtTime(freq + pitchMod, now + duration);
            }
            osc.connect(nodeGain);
            sourceNode = osc;
        } else {
            const buffer = params.noise === 'white' 
                ? createWhiteNoiseBuffer(globalAudioContext, duration)
                : createBrownNoiseBuffer(globalAudioContext, duration);
            
            const source = globalAudioContext.createBufferSource();
            source.buffer = buffer;

            const filter = globalAudioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(filterFreq, now);

            source.connect(filter);
            filter.connect(nodeGain);
            sourceNode = source;
        }

        if (category === 'music') {
            activeMusicNodes.add(sourceNode);
            sourceNode.onended = () => activeMusicNodes.delete(sourceNode);
        }

        sourceNode.start(now);
        sourceNode.stop(now + duration + 0.1);
    }, [isMuted, getMusicGain]);

    // FIX: Define getContextTime before it is used by the play function.
    const getContextTime = useCallback(() => globalAudioContext?.currentTime ?? 0, []);

    const play = useCallback((soundId: SoundID) => {
        const recipeOrRecipes = AUDIO_MANIFEST[soundId];
        if (!recipeOrRecipes) return;
        
        if (!isAudioActive) initContext();
        if (globalAudioContext?.state !== 'running') return;
    
        if (typeof recipeOrRecipes === 'string') {
            playRecipe(recipeOrRecipes, undefined, 'sfx');
        } else if (Array.isArray(recipeOrRecipes)) {
            const baseTime = getContextTime();
            recipeOrRecipes.forEach(recipe => {
                playRecipe(recipe, baseTime, 'sfx');
            });
        }
    }, [playRecipe, isAudioActive, initContext, getContextTime]);

    return { 
        play, 
        playRecipe, 
        stopAllMusic, 
        setMusicVolume, 
        initContext, 
        isAudioActive,
        // FIX: Export the function variable instead of a new inline function.
        getContextTime,
        isContextRunning: () => globalAudioContext?.state === 'running'
    };
};