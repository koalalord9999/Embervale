import * as NOTES from '../../constants/musicScore';
import { mulberry32, getTileSeed } from '../../prototyping/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getPastoralScore = (track: MusicTrackMetadata): string => {
    const rng = mulberry32(getTileSeed(track.id.length, track.name.length + (track.style.length * 83))); 
    let score = "";
    const totalDuration = 240000; 

    // Fine-tuning based on region ID
    let bpm = 100;
    let scale = [NOTES.G3, NOTES.A3, NOTES.B3, NOTES.D4, NOTES.E4, NOTES.G4, NOTES.A4, NOTES.B4]; // Major
    let leadType: 'sine' | 'triangle' | 'sawtooth' = 'triangle';
    let noiseVolBase = 0.003;

    if (track.id === 'meadowdale') {
        bpm = 118; // Bustling tempo
        leadType = 'triangle'; // Clearer, more active lead
        noiseVolBase = 0.01; // Increased ambient "chatter" noise
    } else if (track.id === 'the_verdant_fields') {
        bpm = 114; // Brisk
        scale = [NOTES.G3, NOTES.A3, NOTES.B3, NOTES.Cs4, NOTES.D4, NOTES.E4, NOTES.Fs4, NOTES.G4]; // Lydian/Bright
    } else if (track.id === 'wilderness') {
        bpm = 92; // Cautious
        scale = [NOTES.G3, NOTES.A3, NOTES.Bb3, NOTES.C4, NOTES.D4, NOTES.Eb4, NOTES.F4, NOTES.G4]; // Minor/Darker
        leadType = 'sawtooth'; // Rugged
        noiseVolBase = 0.006; // More wind
    }

    const beat = 60000 / bpm;
    const stepMs = beat / 4; 

    for (let t = 0; t < totalDuration; t += stepMs) {
        const step = Math.floor(t / stepMs);
        const bar = Math.floor(step / 16);
        const beatInBar = Math.floor((step % 16) / 4);
        const subStep = step % 4; 
        const phase = t / totalDuration;
        const isPeak = phase >= 0.5 && phase < 0.8;
        const isIntro = phase < 0.25;
        const isOutro = phase >= 0.8;

        // Base ambience
        if (step % 16 === 0) { 
            if (track.id === 'meadowdale') {
                // For the town, use a low-pass filtered brown noise to simulate a distant murmur/rumble.
                score += `${t}:noise:brown|dur:4|vol:${noiseVolBase * 0.7}|filter:750|attack:2|decay:2
`;
            } else {
                // For other pastoral areas, keep the airy wind/swoosh sound.
                score += `${t}:noise:white|dur:4|vol:${noiseVolBase}|filter:5000|attack:2|decay:2
`;
            }
        }

        // Meadowdale-specific rhythmic "bustle"
        if (track.id === 'meadowdale' && !isOutro) {
            // Random, short murmurs to simulate town activity instead of rhythmic pats
            if (rng() < 0.1) { // 10% chance on each 16th note step
                const bustleVol = (isPeak ? 0.008 : 0.005) * (0.5 + rng() * 0.5); // Randomize volume a bit
                const murmurDur = 0.5 + rng() * 0.5; // Randomize duration
                score += `${t}:noise:brown|dur:${murmurDur}|vol:${bustleVol}|filter:700|attack:0.1|decay:${murmurDur - 0.1}
`;
            }
        }

        if (subStep === 0 && !isOutro) {
            const rootNote = scale[bar % 4];
            const bassVol = isPeak ? 0.02 : (isIntro ? 0.008 : 0.015);
            if (beatInBar === 0) score += `${t}:osc:sine|freq:${rootNote / 2}|dur:4.0|vol:${bassVol}|attack:2.0|decay:2.0
`;
        }
        if (step % 16 === 0 && !isIntro && !isOutro) {
            const chord = [scale[bar % 4], scale[(bar + 2) % 4], scale[(bar + 4) % 4]];
            const padVol = isPeak ? 0.012 : 0.008;
            chord.forEach((f, i) => {
                score += `${t + (i * 10)}:osc:sine|freq:${f}|dur:2.0|vol:${padVol}|filter:120|attack:0.1|decay:1.5
`;
            });
        }
        
        let melodyChance = isPeak ? 0.8 : isIntro ? 0.3 : 0.5;
        if (track.id === 'meadowdale') melodyChance += 0.15; // More active melodic density for the town

        if (rng() < melodyChance && (step % 4 === 0 || (isPeak && step % 2 === 0))) {
            const noteRng = rng();
            const noteIndex = Math.floor(noteRng * scale.length);
            let note = scale[noteIndex];
            if (isPeak && noteRng > 0.6) note *= 2;
            const leadVol = isPeak ? 0.03 : 0.018;
            const filterFreq = leadType === 'sawtooth' ? 800 : 3000;
            score += `${t}:osc:${leadType}|freq:${note}|dur:0.6|vol:${leadVol}|filter:${filterFreq}|attack:0.01|decay:0.8
`;
        }
    }
    return score;
};