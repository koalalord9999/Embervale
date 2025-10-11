/**
 * Defines the hardness of different ore types for the mining skill.
 * Hardness is used in a formula to determine the success chance of mining an ore.
 * Formula: chance = (skillLevel + toolPower) / hardness * 100
 * A higher hardness value makes the ore more difficult to mine.
 */
export const ORE_HARDNESS: Record<string, number> = {
    'copper_ore': 88,
    'tin_ore': 88,
    'iron_ore': 175,
    'rock_salt': 220,
    'coal': 300,
    'silver_ore': 400,
    'brimstone': 600,
    'mithril_ore': 800,
    'adamantite_ore': 835,
    'titanium_ore': 900,
    'rune_essence': 1,
};
