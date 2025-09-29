

import { POI, SkillName } from '../../types';

export const theSerpentsCoilPois: Record<string, POI> = {
    serpents_coil_entrance: {
        id: 'serpents_coil_entrance',
        name: "Serpent's Coil Entrance",
        description: 'Beyond the gate, the swamp transforms into a confusing delta of murky waterways and dense mangrove thickets. The air is heavy and smells of salt and decay.',
        connections: ['serpents_coil_gate', 'mangrove_thicket_west', 'murky_channel_east', 'flooded_crypt_chamber'],
        activities: [
            { type: 'combat', monsterId: 'giant_toad' },
        ],
        regionId: 'serpents_coil',
        x: 1551, y: 1263
    },
    mangrove_thicket_west: {
        id: 'mangrove_thicket_west',
        name: 'West Mangrove Thicket',
        description: 'A dense thicket of mangroves with tangled, arching roots that create a maze-like path. Something large slithers through the water nearby.',
        connections: ['serpents_coil_entrance', 'serpent_nesting_ground'],
        activities: [
            { type: 'combat', monsterId: 'bog_serpent' },
        ],
        regionId: 'serpents_coil',
        x: 1524, y: 1255
    },
    serpent_nesting_ground: {
        id: 'serpent_nesting_ground',
        name: 'Serpent Nesting Ground',
        description: 'A muddy island littered with large, leathery egg fragments. This area is swarming with serpents.',
        connections: ['mangrove_thicket_west', 'flooded_forest'],
        activities: [
            { type: 'combat', monsterId: 'bog_serpent' },
            { type: 'combat', monsterId: 'bog_serpent' },
        ],
        regionId: 'serpents_coil',
        x: 1499, y: 1225
    },
    flooded_forest: {
        id: 'flooded_forest',
        name: 'Flooded Forest',
        description: 'An ancient part of the forest, now completely submerged. Only the tops of the tallest trees break the surface.',
        connections: ['serpent_nesting_ground', 'sunken_temple_approach'],
        activities: [],
        regionId: 'serpents_coil',
        x: 1517, y: 1195
    },
    murky_channel_east: {
        id: 'murky_channel_east',
        name: 'East Murky Channel',
        description: 'A wide, slow-moving channel of black water. The path is a narrow, muddy bank.',
        connections: ['serpents_coil_entrance', 'isolated_islet'],
        activities: [
            { type: 'combat', monsterId: 'bog_serpent' },
        ],
        regionId: 'serpents_coil',
        x: 1595, y: 1259
    },
    isolated_islet: {
        id: 'isolated_islet',
        name: 'Isolated Islet',
        description: 'A small patch of solid ground, barely large enough for a single, gnarled tree.',
        connections: ['murky_channel_east', 'shipwreck_shallows'],
        activities: [
            { type: 'skilling', id: 'isolated_islet_willow', name: 'Chop Willow Tree', skill: SkillName.Woodcutting, requiredLevel: 30, loot: [{ itemId: 'willow_logs', chance: 1, xp: 90 }], resourceCount: { min: 14, max: 1619 }, respawnTime: 30000, gatherTime: 3500 },
        ],
        regionId: 'serpents_coil',
        x: 1680, y: 1234
    },
    shipwreck_shallows: {
        id: 'shipwreck_shallows',
        name: 'Shipwreck Shallows',
        description: 'The rotting hull of an ancient ship lists in the shallows, its mast broken and pointing accusingly at the sky.',
        connections: ['isolated_islet', 'sunken_temple_approach'],
        activities: [
            { type: 'combat', monsterId: 'bog_serpent' },
            {
                type: 'skilling',
                id: 'serpent_coil_shipwreck_lumber',
                name: 'Harvest Debris',
                skill: SkillName.Woodcutting,
                requiredLevel: 30,
                loot: [
                    { itemId: 'logs', chance: 1.0, xp: 90 },
                    { itemId: 'oak_logs', chance: 0.641, xp: 90 },
                    { itemId: 'willow_logs', chance: 0.606, xp: 90 },
                    { itemId: 'treasure_chest', chance: 0.01, xp: 250 }
                ],
                resourceCount: { min: 60, max: 1601 },
                respawnTime: 120000,
                gatherTime: 3500,
                treeHardness: 250,
            }
        ],
        regionId: 'serpents_coil',
        x: 1600, y: 1209
    },
    sunken_temple_approach: {
        id: 'sunken_temple_approach',
        name: 'Sunken Temple Approach',
        description: 'A grand stone causeway, now mostly submerged, leads towards a looming, ominous structure.',
        connections: ['flooded_forest', 'shipwreck_shallows', 'sunken_temple_altar'],
        activities: [
            { type: 'combat', monsterId: 'bog_serpent' },
            { type: 'combat', monsterId: 'bog_serpent' },
        ],
        regionId: 'serpents_coil',
        x: 1558, y: 1192
    },
    sunken_temple_altar: {
        id: 'sunken_temple_altar',
        name: 'Sunken Temple Altar',
        description: 'The heart of a sunken temple. A massive stone altar, carved with images of serpents, is all that remains above the water.',
        connections: ['sunken_temple_approach'],
        activities: [
            { type: 'combat', monsterId: 'bog_serpent' },
            { type: 'combat', monsterId: 'bog_serpent' },
            { type: 'combat', monsterId: 'bog_serpent' },
        ],
        regionId: 'serpents_coil',
        x: 1569, y: 1171
    },
};