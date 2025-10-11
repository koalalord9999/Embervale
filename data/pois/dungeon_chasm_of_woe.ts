
import { POI, SkillName } from '../../types';

export const chasmOfWoePois: Record<string, POI> = {
    chasm_of_woe_entrance: {
        id: 'chasm_of_woe_entrance',
        name: "Chasm of Woe Entrance",
        description: "The air is cold and heavy with the smell of damp earth and ozone. The passage opens into a vast, dark chasm.",
        connections: ['outpost_mine', 'chasm_ledge_1'],
        activities: [
            { type: 'npc', name: 'Enter the Chasm', icon: 'https://api.iconify.design/game-icons:cave-entrance.svg' }
        ],
        regionId: 'chasm_of_woe',
        x: 1450, y: 1250
    },
    chasm_ledge_1: {
        id: 'chasm_ledge_1',
        name: "Chasm Ledge",
        description: "A narrow ledge clings to the chasm wall. Strange, chitinous creatures scuttle in the shadows.",
        connections: ['chasm_of_woe_entrance', 'chasm_rope_bridge'],
        activities: [
            { type: 'combat', monsterId: 'chasm_crawler' },
        ],
        regionId: 'chasm_of_woe',
        x: 1480, y: 1280
    },
    chasm_rope_bridge: {
        id: 'chasm_rope_bridge',
        name: "Rope Bridge",
        description: "A rickety rope bridge spans a seemingly bottomless pit.",
        connections: ['chasm_ledge_1', 'chasm_central_cavern'],
        activities: [
            { type: 'combat', monsterId: 'rock_golem' },
        ],
        regionId: 'chasm_of_woe',
        x: 1520, y: 1320
    },
    chasm_central_cavern: {
        id: 'chasm_central_cavern',
        name: "Central Cavern",
        description: "A large cavern, the source of the tremors. A path leads to a crystalline alcove, while a larger passage continues deeper.",
        connections: ['chasm_rope_bridge', 'crystal_alcove', 'earth_render_lair'],
        activities: [
            { type: 'combat', monsterId: 'rock_golem' },
            { type: 'combat', monsterId: 'chasm_crawler' },
        ],
        regionId: 'chasm_of_woe',
        x: 1560, y: 1360
    },
    crystal_alcove: {
        id: 'crystal_alcove',
        name: "Crystal Alcove",
        description: "A dead-end alcove filled with rare mineral deposits, fiercely guarded.",
        connections: ['chasm_central_cavern'],
        activities: [
            { type: 'combat', monsterId: 'rock_golem' },
            { type: 'skilling', id: 'chasm_adamantite_1', name: 'Mine Adamantite', skill: SkillName.Mining, requiredLevel: 65, loot: [{ itemId: 'adamantite_ore', chance: 1, xp: 120 }], resourceCount: { min: 2, max: 4 }, respawnTime: 60000, gatherTime: 5000 },
            { type: 'skilling', id: 'chasm_titanium_1', name: 'Mine Titanium', skill: SkillName.Mining, requiredLevel: 75, loot: [{ itemId: 'titanium_ore', chance: 1, xp: 200 }], resourceCount: { min: 1, max: 2 }, respawnTime: 300000, gatherTime: 6000 },
        ],
        regionId: 'chasm_of_woe',
        x: 1600, y: 1330
    },
    earth_render_lair: {
        id: 'earth_render_lair',
        name: "The Earth-Render's Lair",
        description: "The heart of the chasm. A colossal golem made of earth and rare minerals stands dormant, radiating immense power.",
        connections: ['chasm_central_cavern'],
        activities: [
            { type: 'npc', name: 'Approach the Golem', icon: 'https://api.iconify.design/game-icons:rock-golem.svg' },
        ],
        regionId: 'chasm_of_woe',
        x: 1600, y: 1400
    },
};
