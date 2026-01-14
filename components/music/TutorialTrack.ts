import * as NOTES from '../../constants/musicScore';

/**
 * Permanent baked score for the Heroic Style (Embrune Theme).
 * 180 BPM, High Tier Classical/Epic Orchestral.
 * Features a 20-second deceleration (slowdown) at the end.
 */
const generateTutorialScore = () => {
    const baseBpm = 180;
    const beat = 60000 / baseBpm;
    const stepMs = beat / 4; // 16th note grid
    const totalDuration = 240000; // 4 mins
    const codaStart = 220000; // Slowdown starts at 3:40
    let score = "";

    const progression = [
        [NOTES.D2, NOTES.D3, NOTES.F3, NOTES.A3], // D Minor
        [NOTES.Bb1, NOTES.Bb2, NOTES.D3, NOTES.F3], // Bb Major
        [NOTES.C2, NOTES.C3, NOTES.E3, NOTES.G3],  // C Major
        [NOTES.A1, NOTES.A2, NOTES.Cs3, NOTES.E3]  // A Major (Dominant)
    ];

    // Seeded random for deterministic permanent track
    let seed = 12345;
    const rng = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    let currentTime = 0;
    let stepCount = 0;

    while (currentTime < totalDuration) {
        const progress = currentTime / totalDuration;
        const isIntro = progress < 0.1;
        const isRising = progress >= 0.1 && progress < 0.25;
        const isDev = progress >= 0.25 && progress < 0.5;
        const isPeak = progress >= 0.5 && progress < 0.92;
        const isCoda = currentTime >= codaStart;

        // Deceleration logic for Coda
        let currentStepMs = stepMs;
        if (isCoda) {
            // Linear deceleration: from 1x to 2.5x duration per step
            const codaProgress = (currentTime - codaStart) / (totalDuration - codaStart);
            currentStepMs = stepMs * (1 + codaProgress * 2.5);
        }

        const bar = Math.floor(stepCount / 16);
        const beatInBar = Math.floor((stepCount % 16) / 4);
        const subStep = stepCount % 4;
        const currentChord = progression[bar % progression.length];
        const root = currentChord[0];

        // --- LAYER 1: PERCUSSION ---
        if (subStep === 0) {
            const isDownbeat = beatInBar === 0;
            const isBackbeat = beatInBar === 2;
            let percVol = isPeak ? 0.15 : isIntro ? 0.05 : 0.1;
            if (isCoda) percVol *= (1 - (currentTime - codaStart) / (totalDuration - codaStart));

            if ((isDownbeat || isBackbeat) && percVol > 0.01) {
                score += `${Math.floor(currentTime)}:noise:brown|dur:0.4|vol:${percVol}|filter:120|decay:0.3}\n`;
                score += `${Math.floor(currentTime)}:osc:sine|freq:${NOTES.D1}|dur:0.2|vol:${percVol}|decay:0.2}\n`;
            }
            // Snare on 2 and 4
            if ((beatInBar === 1 || beatInBar === 3) && !isCoda && percVol > 0.02) {
                score += `${Math.floor(currentTime)}:noise:white|dur:0.08|vol:${percVol * 0.6}|filter:2000|decay:0.06}\n`;
            }
        }
        // Driving hats
        if (isPeak && !isCoda && stepCount % 1 === 0) {
            score += `${Math.floor(currentTime)}:noise:white|dur:0.01|vol:0.006|filter:9000|decay:0.01}\n`;
        }

        // --- LAYER 2: STACCATO DRIVE ---
        if (subStep % 2 === 0 && (isRising || isDev || isPeak) && !isCoda) {
            const stacVol = isPeak ? 0.045 : 0.025;
            if (stepCount % 4 !== 1) {
                score += `${Math.floor(currentTime)}:osc:sawtooth|freq:${currentChord[2]}|dur:0.12|vol:${stacVol}|filter:1200|attack:0.01|decay:0.1}\n`;
            }
        }

        // --- LAYER 3: BRASS SWELLS ---
        if (beatInBar === 0 && subStep === 0 && (isDev || isPeak || isCoda)) {
            let swellVol = isPeak ? 0.03 : 0.015;
            if (isCoda) swellVol *= (1.2 - (currentTime - codaStart) / (totalDuration - codaStart));

            currentChord.slice(1).forEach((f, i) => {
                const duration = isCoda ? 5.0 : 3.0;
                const attack = isCoda ? 1.2 : 0.25;
                const decay = isCoda ? 4.0 : 2.5;
                const startTimeOffset = i * (isCoda ? 40 : 20);
                score += `${Math.floor(currentTime + startTimeOffset)}:osc:sawtooth|freq:${f}|dur:${duration}|vol:${swellVol}|filter:700|attack:${attack}|decay:${decay}\n`;
                score += `${Math.floor(currentTime + startTimeOffset)}:osc:triangle|freq:${f / 2}|dur:${duration}|vol:${swellVol}|filter:450|attack:${attack}|decay:${decay}\n`;
            });
        }

        // --- LAYER 4: MAJESTIC LEAD ---
        let melodyChance = isPeak ? 0.98 : isDev ? 0.8 : isRising ? 0.4 : 0;
        if (isCoda) melodyChance = 0.6 * (currentTime - codaStart) / (totalDuration - codaStart);
        
        const isMelodyTick = stepCount % 4 === 0 || (isPeak && stepCount % 2 === 0);
        if (rng() < melodyChance && isMelodyTick) {
            const nRng = rng();
            const nIdx = Math.floor(nRng * currentChord.length);
            let note = currentChord[nIdx] * (nRng > 0.5 ? 4 : 2);
            
            let leadVol = isPeak ? 0.05 : 0.035;
            if (isCoda) leadVol *= (1 - (currentTime - codaStart) / (totalDuration - codaStart));

            const leadAttack = isCoda ? 0.4 : 0.1;
            const leadDecay = isCoda ? 3.0 : 1.5;
            const leadFilter = isPeak ? 3500 : 2000;

            if (leadVol > 0.005) {
                score += `${Math.floor(currentTime)}:osc:sawtooth|freq:${note}|dur:2.0|vol:${leadVol}|filter:${leadFilter}|attack:${leadAttack}|decay:${leadDecay}\n`;
            }
        }

        currentTime += currentStepMs;
        stepCount++;
    }

    return score;
};

export const TUTORIAL_SCORE = generateTutorialScore();