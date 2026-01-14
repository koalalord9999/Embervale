import * as NOTES from '../../constants/musicScore';

/**
 * Static baked score for the Tutorial Area.
 * Format: [ms_offset]:[recipe]
 */
const generateTutorialScore = () => {
    const bpm = 120;
    const beat = 60000 / bpm;
    const totalDuration = 240000; // 4 mins
    let score = "";
    
    const chords = [
        [NOTES.C4, NOTES.E4, NOTES.G4], [NOTES.F4, NOTES.A4, NOTES.C5], [NOTES.G4, NOTES.B4, NOTES.D5], [NOTES.C4, NOTES.E4, NOTES.G4],
        [NOTES.C4, NOTES.E4, NOTES.G4], [NOTES.A3, NOTES.C4, NOTES.E4], [NOTES.F4, NOTES.A4, NOTES.C5], [NOTES.G4, NOTES.B4, NOTES.D5]
    ];

    for (let t = 0; t < totalDuration; t += (beat / 2)) {
        const step = Math.floor(t / (beat / 2));
        const bar = Math.floor(step / 8);
        const beatInBar = Math.floor((step % 8) / 2);
        const subStep = step % 2; 
        const progressionIndex = Math.floor(bar / 2) % chords.length;
        const chord = chords[progressionIndex];

        const isIntro = t < 60000;
        const isDevelopment = t >= 60000 && t < 120000;
        const isPeak = t >= 120000 && t < 180000;
        const isOutro = t >= 180000;

        if (subStep === 0) { 
            const bassNote = chord[0] / 2;
            const bassVol = isOutro ? 0.01 : 0.02;
            score += `${t}:noise:white|dur:0.005|vol:0.004|filter:3000|decay:0.005\n`;
            score += `${t}:osc:triangle|freq:${bassNote}|dur:0.8|vol:${bassVol}|attack:0.01|decay:0.7\n`;
            if (isDevelopment || isPeak) {
                score += `${t}:osc:triangle|freq:${chord[2] / 2}|dur:0.8|vol:0.01|attack:0.02|decay:0.6\n`;
            }
        }

        if (step % 8 === 0 && !isIntro && !isOutro) {
            chord.forEach(f => {
                const padVol = isPeak ? 0.015 : 0.008;
                score += `${t}:osc:sine|freq:${f}|dur:4.0|vol:${padVol}|attack:2.0|decay:2.0\n`;
            });
        }

        let shouldPlayMelody = false;
        if (isIntro && subStep === 0 && beatInBar % 2 === 0) shouldPlayMelody = true;
        if (isDevelopment && subStep === 0) shouldPlayMelody = true;
        if (isPeak) shouldPlayMelody = true;
        if (isOutro && step % 16 === 0) shouldPlayMelody = true;

        if (shouldPlayMelody) {
            // Pseudo-random but deterministic for this specific track
            const noteIndex = (step * 7) % chord.length;
            let note = chord[noteIndex] * 2;
            if (isPeak && (step % 3 === 0)) note *= 2;
            const pianoVol = isPeak ? 0.025 : 0.018;
            const decay = isPeak ? 1.0 : 0.6;
            score += `${t}:noise:white|dur:0.01|vol:0.005|filter:500|decay:0.01\n`; 
            score += `${t}:osc:triangle|freq:${note}|dur:1.2|vol:${pianoVol}|attack:0.01|decay:${decay}\n`;
        }
    }
    return score;
};

export const TUTORIAL_SCORE = generateTutorialScore();