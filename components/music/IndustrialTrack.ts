import * as NOTES from '../../constants/musicScore';
import { mulberry32, getTileSeed } from '../../prototyping/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getIndustrialScore = (track: MusicTrackMetadata): string => {
    const rng = mulberry32(getTileSeed(track.id.length, track.name.length + (track.style.length * 83))); 
    let score = "";
    const totalDuration = 240000; 

    // Fine-tuning based on region ID
    let bpm = 120;
    let leadType: 'sine' | 'triangle' | 'square' = 'triangle';
    let rhythmDensity = 0.5;

    if (track.id === 'oakhaven') {
        bpm = 110;
        leadType = 'triangle';
    } else if (track.id === 'dwarven_outpost') {
        bpm = 128; // Industrious
        leadType = 'square'; // Gritty/Mechanical
        rhythmDensity = 0.8; // Busy
    } else if (track.id === 'sanctity') {
        bpm = 100; // Pious/Calm
        leadType = 'sine'; // Pure
        rhythmDensity = 0.3; // Minimalist
    }

    const beat = 60000 / bpm;
    const stepMs = beat / 4; 
    const scale = [NOTES.A2, NOTES.C3, NOTES.D3, NOTES.Eb3, NOTES.E3, NOTES.G3, NOTES.A3, NOTES.C4];

    for (let t = 0; t < totalDuration; t += stepMs) {
        const step = Math.floor(t / stepMs);
        const bar = Math.floor(step / 16);
        const beatInBar = Math.floor((step % 16) / 4);
        const subStep = step % 4; 
        const phase = t / totalDuration;
        const isPeak = phase >= 0.5 && phase < 0.8;
        const isOutro = phase >= 0.8;

        // "Clanking" noise for Dwarven Outpost
        if (track.id === 'dwarven_outpost' && step % 8 === 0 && rng() < 0.3) {
            score += `${t}:noise:white|dur:0.05|vol:0.01|filter:800|decay:0.05
`;
        }

        if (subStep === 0 && !isOutro) {
            const rootNote = scale[bar % 4];
            const bassVol = isPeak ? 0.02 : 0.015;
            if (beatInBar === 0) score += `${t}:osc:sine|freq:${rootNote / 2}|dur:4.0|vol:${bassVol}|attack:1.0|decay:2.0
`;
        }

        if (step % 4 === 0 && rng() < rhythmDensity) {
            const noteIndex = Math.floor(rng() * scale.length);
            const note = scale[noteIndex];
            const leadVol = isPeak ? 0.03 : 0.018;
            score += `${t}:osc:${leadType}|freq:${note}|dur:0.2|vol:${leadVol}|filter:1500|attack:0.005|decay:0.2
`;
        }
    }
    return score;
};