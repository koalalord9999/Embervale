import * as NOTES from '../../constants/musicScore';
import { mulberry32, getTileSeed } from '../../prototyping/prng';
import { MusicTrackMetadata } from '../../hooks/useMusicEngine';

export const getVolcanicScore = (track: MusicTrackMetadata): string => {
    const rng = mulberry32(getTileSeed(track.id.length, track.name.length + (track.style.length * 83))); 
    let score = "";
    const totalDuration = 240000; 
    const style = { bpm: 100, scale: [NOTES.C2, NOTES.Db2, NOTES.E2, NOTES.F2, NOTES.G2, NOTES.Ab2, NOTES.B2, NOTES.C3] };
    const beat = 60000 / style.bpm;
    const stepMs = beat / 4; 

    for (let t = 0; t < totalDuration; t += stepMs) {
        const step = Math.floor(t / stepMs);
        const bar = Math.floor(step / 16);
        const beatInBar = Math.floor((step % 16) / 4);
        const subStep = step % 4; 
        const phase = t / totalDuration;
        const isPeak = phase >= 0.5 && phase < 0.8;
        const isDev = phase >= 0.25 && phase < 0.5;
        const isIntro = phase < 0.25;
        const isOutro = phase >= 0.8;
        const scale = style.scale;

        if (step % 16 === 0) { 
            const noiseVol = isPeak ? 0.015 : isOutro ? 0.005 : 0.01;
            score += `${t}:noise:brown|dur:6|vol:${noiseVol}|filter:400|attack:2|decay:4
`;
        }
        if (subStep === 0 && !isOutro) {
            const rootNote = scale[bar % 4];
            const bassVol = isPeak ? 0.02 : (isIntro ? 0.008 : 0.015);
            if (beatInBar === 0) score += `${t}:osc:sine|freq:${rootNote / 2}|dur:4.0|vol:${bassVol}|attack:2.0|decay:2.0
`;
        }
        if (step % 16 === 0 && (isDev || isPeak)) {
            const chord = [scale[bar % 4], scale[(bar + 2) % 4], scale[(bar + 4) % 4]];
            const padVol = isPeak ? 0.012 : 0.008;
            chord.forEach((f, i) => {
                score += `${t + (i * 10)}:osc:sine|freq:${f}|dur:2.0|vol:${padVol}|filter:120|attack:0.1|decay:1.5
`;
            });
        }
        let melodyChance = isPeak ? 0.9 : isDev ? 0.6 : isIntro ? 0.3 : 0.1;
        if (rng() < melodyChance && (step % 4 === 0 || (isPeak && step % 2 === 0))) {
            const noteRng = rng();
            const noteIndex = Math.floor(noteRng * scale.length);
            let note = scale[noteIndex];
            if (isPeak && noteRng > 0.6) note *= 2;
            const leadVol = isPeak ? 0.03 : 0.018;
            score += `${t}:osc:triangle|freq:${note}|dur:0.6|vol:${leadVol}|filter:3000|attack:0.01|decay:0.8
`;
        }
    }
    return score;
};