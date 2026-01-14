import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useSoundEngine } from './useSoundEngine';
import { WorldState } from '../types';
import { REGIONS } from '../constants';
import * as TRACKS from '../components/music/index';

export type MusicStyle = 'grand' | 'pastoral' | 'mystic' | 'industrial' | 'desolate' | 'eerie' | 'volcanic' | 'tutorial' | 'heroic';

export interface MusicTrackMetadata {
    id: string;
    name: string;
    style: MusicStyle;
}

interface MusicEvent {
    time: number; // ms offset
    recipe: string;
}

// --- MODULE SCOPE GLOBALS (Singleton Management) ---
let globalSessionId = 0;
let globalSchedulerTimer: number | null = null;
let globalPreStartTimeout: number | null = null;
let globalActiveTrackId: string | null = null;
let globalManualStop = false; 
let globalLastValidRegionId: string | undefined = undefined;
// ---------------------------------------------------

export const MUSIC_TRACKS: MusicTrackMetadata[] = [
    { id: 'login', name: 'Embrune Theme', style: 'heroic' as MusicStyle },
    // FIX: Add 'as MusicStyle' to ensure correct type inference within the array.
    { id: 'generated_track_1', name: 'Whispers from the Void', style: 'eerie' as MusicStyle },
    ...(Object.values(REGIONS).map((r): MusicTrackMetadata => {
        let style: MusicStyle = 'desolate';
        if (['meadowdale', 'the_verdant_fields', 'sunbright_plains'].includes(r.id)) style = 'pastoral';
        else if (['oakhaven', 'dwarven_outpost', 'sanctity'].includes(r.id)) style = 'industrial';
        else if (['silverhaven'].includes(r.id)) style = 'grand';
        else if (['feywood', 'crystalline_isles', 'magus_spire'].includes(r.id)) style = 'mystic';
        else if (['volcanic_steam_vents', 'the_serpents_coil'].includes(r.id)) style = 'volcanic';
        else if (r.id.includes('dungeon') || r.id.includes('chasm') || r.id.includes('warrens') || r.id.includes('barrow')) style = 'eerie';
        else if (r.id === 'path_of_beginnings') style = 'tutorial';

        return { id: r.id, name: r.name, style };
    }))
].sort((a, b) => a.name.localeCompare(b.name));

const generateScore = (track: MusicTrackMetadata): string => {
    // FIX: Property 'GENERATED_SCORE' does not exist on type 'typeof import("file:///components/music/index")'.
    if (track.id === 'generated_track_1') {
        return (TRACKS as any).GENERATED_SCORE;
    }
    switch (track.style) {
        // FIX: Property 'TUTORIAL_SCORE' does not exist on type 'typeof import("file:///components/music/index")'.
        case 'tutorial': return (TRACKS as any).TUTORIAL_SCORE;
        case 'heroic': return TRACKS.HEROIC_SCORE;
        case 'grand': return TRACKS.getGrandScore(track);
        case 'pastoral': return TRACKS.getPastoralScore(track);
        case 'mystic': return TRACKS.getMysticScore(track);
        case 'industrial': return TRACKS.getIndustrialScore(track);
        case 'desolate': return TRACKS.getDesolateScore(track);
        case 'eerie': return TRACKS.getEerieScore(track);
        case 'volcanic': return TRACKS.getVolcanicScore(track);
        default: return TRACKS.getDesolateScore(track);
    }
};

const STATIC_MUSIC_LIBRARY: Record<string, string> = {};
MUSIC_TRACKS.forEach(track => {
    STATIC_MUSIC_LIBRARY[track.id] = generateScore(track);
});

export const useMusicEngine = (
    regionId: string | undefined, 
    volume: number, 
    isMuted: boolean,
    worldState?: WorldState,
    setWorldState?: React.Dispatch<React.SetStateAction<WorldState>>
) => {
    const { playRecipe, stopAllMusic, setMusicVolume, getContextTime, initContext, isAudioActive } = useSoundEngine(volume, isMuted);
    
    const [manualOverrideId, setManualOverrideId] = useState<string | null>(null);
    const [intendedTrackId, setIntendedTrackId] = useState<string | null>(null);
    
    // Instance-local tracking
    const playbackEventsRef = useRef<MusicEvent[]>([]);
    const nextEventIndexRef = useRef<number>(0);
    const playbackStartTimeRef = useRef<number>(0);

    const parseScore = (score: string): MusicEvent[] => {
        // FIX: Type 'string[]' is not assignable to type 'MusicEvent[]'.
        // FIX: Property 'map' does not exist on type '")"'.
        return score.split('\n')
            .map(line => {
                const [offset, recipe] = line.split(/:(.+)/);
                return { time: parseInt(offset), recipe };
            })
            .filter(e => !isNaN(e.time) && e.recipe);
    };

    const stopScheduler = useCallback(() => {
        globalSessionId++; // Invalidate ALL pending intervals globally
        
        if (globalSchedulerTimer) {
            clearInterval(globalSchedulerTimer);
            globalSchedulerTimer = null;
        }
        if (globalPreStartTimeout) {
            clearTimeout(globalPreStartTimeout);
            globalPreStartTimeout = null;
        }
    }, []);

    const playMusicSegment = useCallback((score: string, trackId: string, isManual: boolean = false) => {
        if (!isAudioActive) {
            if (isManual) {
                setManualOverrideId(trackId);
                globalManualStop = false;
            }
            return;
        }

        initContext();
        stopScheduler();

        const currentSessionId = globalSessionId;
        
        if (isManual) {
            setManualOverrideId(trackId);
            setIntendedTrackId(trackId);
            globalManualStop = false;
        }

        const events = parseScore(score);
        playbackEventsRef.current = events;
        nextEventIndexRef.current = 0;
        globalActiveTrackId = trackId;

        const fadeOutTime = 1.0;
        stopAllMusic(fadeOutTime);

        globalPreStartTimeout = window.setTimeout(() => {
            if (currentSessionId !== globalSessionId) return;

            playbackStartTimeRef.current = getContextTime() + 0.2;
            setMusicVolume(0, 0);
            setMusicVolume(1, 2.0);

            globalSchedulerTimer = window.setInterval(() => {
                if (currentSessionId !== globalSessionId) {
                    if (globalSchedulerTimer) {
                        clearInterval(globalSchedulerTimer);
                        globalSchedulerTimer = null;
                    }
                    return;
                }

                const nowMs = (getContextTime() - playbackStartTimeRef.current) * 1000;
                const lookAheadMs = 4000; 
                const targetTimeMs = nowMs + lookAheadMs;

                let idx = nextEventIndexRef.current;
                const activeEvents = playbackEventsRef.current;

                while (idx < activeEvents.length && activeEvents[idx].time < targetTimeMs) {
                    const event = activeEvents[idx];
                    const scheduleTime = playbackStartTimeRef.current + (event.time / 1000);
                    
                    if (scheduleTime > getContextTime()) {
                        playRecipe(event.recipe, scheduleTime, 'music');
                    }
                    idx++;
                }
                nextEventIndexRef.current = idx;

                if (idx >= activeEvents.length) {
                    nextEventIndexRef.current = 0;
                    playbackStartTimeRef.current = getContextTime() + 0.1;
                    
                    if (isManual) {
                        setManualOverrideId(null);
                    }
                }
            }, 800); 

        }, (fadeOutTime * 1000) + 50);
    }, [getContextTime, initContext, playRecipe, stopAllMusic, setMusicVolume, isAudioActive, stopScheduler]);

    const stopMusic = useCallback((fade: number = 0.5) => {
        globalManualStop = true;
        setManualOverrideId(null);
        setIntendedTrackId(null);
        globalActiveTrackId = null;
        stopAllMusic(fade);
        stopScheduler();
    }, [stopAllMusic, stopScheduler]);

    // Handle region unlocking
    useEffect(() => {
        if (regionId && worldState && setWorldState && worldState.unlockedMusicTracks) {
            const trackId = STATIC_MUSIC_LIBRARY[regionId] ? regionId : 'wilderness';
            if (!worldState.unlockedMusicTracks.includes(trackId)) {
                setWorldState(ws => ({
                    ...ws,
                    unlockedMusicTracks: [...ws.unlockedMusicTracks, trackId]
                }));
            }
        }
    }, [regionId, worldState, setWorldState]);

    // Unified Track Decision Logic
    useEffect(() => {
        if (isMuted) {
            stopMusic();
            return;
        }

        // Detect valid region transitions
        if (regionId !== undefined && regionId !== globalLastValidRegionId) {
            globalManualStop = false;
            globalLastValidRegionId = regionId;
        }

        if (globalManualStop) {
            if (intendedTrackId !== null) {
                setIntendedTrackId(null);
                globalActiveTrackId = null;
            }
            return;
        }

        if (manualOverrideId) {
            if (intendedTrackId !== manualOverrideId) {
                setIntendedTrackId(manualOverrideId);
            }
            return;
        }

        if (!regionId) {
            if (intendedTrackId !== null) {
                setIntendedTrackId(null);
            }
            return;
        }

        const locationTrackId = STATIC_MUSIC_LIBRARY[regionId] ? regionId : 'wilderness';
        if (intendedTrackId !== locationTrackId) {
            setIntendedTrackId(locationTrackId);
        }
    }, [regionId, isMuted, manualOverrideId, stopMusic, intendedTrackId]);

    // Playback Execution
    useEffect(() => {
        if (globalManualStop) return;

        if (isAudioActive && intendedTrackId && globalActiveTrackId !== intendedTrackId) {
            const score = STATIC_MUSIC_LIBRARY[intendedTrackId];
            if (score) {
                const isManual = (intendedTrackId === manualOverrideId);
                playMusicSegment(score, intendedTrackId, isManual);
            }
        }
    }, [isAudioActive, intendedTrackId, manualOverrideId, playMusicSegment]);

    return { 
        musicLibrary: STATIC_MUSIC_LIBRARY, 
        playMusicSegment: (score: string, id: string) => playMusicSegment(score, id, true), 
        stopMusic, 
        isReady: !!STATIC_MUSIC_LIBRARY 
    };
};