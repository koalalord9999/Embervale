/**
 * SFX Recipes for the Deterministic Sound Engine
 * Format: type:val|param:val|...
 * Types: osc (sine, square, triangle, saw), noise (white, brown)
 * Params: freq (hz), dur (sec), vol (0-1), attack (sec), decay (sec), filter (hz), pitchMod (hz/sec)
 *
 * This manifest now supports layered sounds using an array of recipe strings.
 * Timed offsets can be prepended (e.g., "50:osc...") to create sequential effects.
 */

export const AUDIO_MANIFEST: Record<string, string | string[]> = {
    // UI Sounds
    UI_CLICK: [
        "osc:sine|freq:1200|dur:0.03|vol:0.07|attack:0.001|decay:0.03",
        "noise:white|dur:0.05|vol:0.015|filter:8000|attack:0.01|decay:0.04"
    ],
    UI_PANEL_OPEN: [
        "osc:sine|freq:900|dur:0.05|vol:0.04|decay:0.05",
        "noise:white|dur:0.12|vol:0.01|filter:6000|attack:0.03|decay:0.1"
    ],
    UI_PANEL_CLOSE: [
        "osc:sine|freq:600|dur:0.05|vol:0.04|decay:0.05",
        "noise:white|dur:0.12|vol:0.01|filter:5000|attack:0.03|decay:0.1"
    ],
    
    // Combat
    COMBAT_HIT: [
        "noise:white|dur:0.06|vol:0.15|filter:4500|decay:0.06",
        "osc:sine|freq:110|dur:0.1|vol:0.22|decay:0.1"
    ],
    COMBAT_MISS: "noise:white|dur:0.18|vol:0.07|filter:4500|attack:0.02|decay:0.16",
    COMBAT_DEATH: [
        "noise:brown|dur:0.4|vol:0.28|filter:250|attack:0.01|decay:0.4",
        "50:osc:sine|freq:80|dur:0.2|vol:0.1|decay:0.2"
    ],
    COMBAT_PRAYER_FLICK: [
        "osc:triangle|freq:2200|dur:0.5|vol:0.06|attack:0.005|decay:0.5",
        "osc:triangle|freq:2205|dur:0.5|vol:0.04|attack:0.01|decay:0.5|pitchMod:-200"
    ],
    
    // Skilling & Items
    ITEM_PICKUP: "noise:white|dur:0.08|vol:0.04|filter:7000|attack:0.01|decay:0.07",
    WOODCUTTING_CHOP_1: [
        "noise:white|dur:0.04|vol:0.25|filter:3500|attack:0.001|decay:0.04",
        "10:noise:brown|dur:0.1|vol:0.2|filter:400|attack:0.01|decay:0.1"
    ],
    WOODCUTTING_CHOP_2: [
        "noise:white|dur:0.04|vol:0.25|filter:4000|attack:0.001|decay:0.04",
        "10:noise:brown|dur:0.1|vol:0.18|filter:420|attack:0.01|decay:0.1"
    ],
    WOODCUTTING_CHOP_3: [
        "noise:white|dur:0.04|vol:0.22|filter:3400|attack:0.001|decay:0.04",
        "10:noise:brown|dur:0.1|vol:0.22|filter:350|attack:0.01|decay:0.1"
    ],
    MINING_TINK_1: [
        "osc:square|freq:1550|pitchMod:40|dur:0.3|vol:0.25|attack:0.005|decay:0.15",
        "osc:square|freq:1555|dur:0.4|vol:0.08|attack:0.01|decay:0.4"
    ],
    MINING_TINK_2: [
        "osc:square|freq:1600|pitchMod:30|dur:0.25|vol:0.25|attack:0.005|decay:0.12",
        "osc:square|freq:1605|dur:0.3|vol:0.08|attack:0.01|decay:0.3"
    ],
    MINING_TINK_3: [
        "osc:square|freq:1500|pitchMod:50|dur:0.35|vol:0.25|attack:0.005|decay:0.18",
        "osc:square|freq:1505|dur:0.45|vol:0.08|attack:0.01|decay:0.45"
    ],
    FISHING_SPLASH_1: [
        "0:noise:white|dur:0.06|vol:0.1|filter:4000|attack:0.01|decay:0.06",
        "40:noise:brown|dur:0.2|vol:0.08|filter:600|attack:0.05|decay:0.15",
        "100:noise:white|dur:0.3|vol:0.04|filter:8000|attack:0.1|decay:0.2"
    ],
    FISHING_SPLASH_2: [
        "0:noise:white|dur:0.05|vol:0.12|filter:3500|attack:0.01|decay:0.05",
        "30:noise:brown|dur:0.25|vol:0.07|filter:700|attack:0.04|decay:0.2",
        "120:noise:white|dur:0.25|vol:0.05|filter:7500|attack:0.08|decay:0.15"
    ],
    FISHING_SPLASH_3: [
        "0:noise:white|dur:0.07|vol:0.09|filter:4200|attack:0.01|decay:0.07",
        "50:noise:brown|dur:0.18|vol:0.09|filter:550|attack:0.06|decay:0.12",
        "90:noise:white|dur:0.35|vol:0.03|filter:8500|attack:0.12|decay:0.25"
    ],
    CRAFTING_SUCCESS: [
        "0:osc:sine|freq:1046|dur:0.1|vol:0.12|decay:0.1",
        "80:osc:sine|freq:1318|dur:0.1|vol:0.12|decay:0.1"
    ],
    SMITHING_HAMMER_1: [
        "osc:square|freq:2000|dur:0.15|vol:0.18|filter:2500|decay:0.15",
        "5:osc:square|freq:2010|dur:0.25|vol:0.1|filter:2500|attack:0.01|decay:0.25"
    ],
    SMITHING_HAMMER_2: [
        "osc:square|freq:2100|dur:0.15|vol:0.2|filter:2800|decay:0.15",
        "5:osc:square|freq:2110|dur:0.25|vol:0.12|filter:2800|attack:0.01|decay:0.25"
    ],
    SMITHING_HAMMER_3: [
        "osc:square|freq:1900|dur:0.15|vol:0.18|filter:2200|decay:0.15",
        "5:osc:square|freq:1910|dur:0.25|vol:0.1|filter:2200|attack:0.01|decay:0.25"
    ],
    FIREMAKING_IGNITE: [
        "0:noise:brown|dur:0.8|vol:0.25|filter:500|attack:0.02|decay:0.8",
        "50:noise:white|dur:0.05|vol:0.08|filter:6000|attack:0.001|decay:0.04",
        "150:noise:white|dur:0.04|vol:0.06|filter:7000|attack:0.001|decay:0.03",
        "280:noise:white|dur:0.06|vol:0.07|filter:6500|attack:0.001|decay:0.05",
        "400:noise:white|dur:0.05|vol:0.05|filter:7500|attack:0.001|decay:0.04"
    ],
    
    // Level Up
    LEVEL_UP: [
        "0:osc:sine|freq:261|dur:2.5|vol:0.08|attack:0.5|decay:2.0",
        "0:osc:triangle|freq:523|dur:1.8|vol:0.2|pitchMod:1567|attack:0.05|decay:1.6",
        "1600:noise:white|dur:0.5|vol:0.04|filter:7000|attack:0.01|decay:0.6",
        "1700:noise:white|dur:0.5|vol:0.03|filter:8000|attack:0.01|decay:0.8",
        "1800:noise:white|dur:0.5|vol:0.04|filter:7500|attack:0.01|decay:0.5",
        "2300:noise:white|dur:0.6|vol:0.05|filter:7000|attack:0.01|decay:0.8",
        "2400:noise:white|dur:0.6|vol:0.04|filter:8000|attack:0.01|decay:0.7",
        "2500:noise:white|dur:0.6|vol:0.05|filter:7500|attack:0.01|decay:0.8"
    ],
};

export type SoundID = keyof typeof AUDIO_MANIFEST;