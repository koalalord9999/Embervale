

import { POI, SkillName } from '../../types';

export const theVerdantFieldsPois: Record<string, POI> = {
    verdant_fields_entrance: {
        id: 'verdant_fields_entrance',
        name: 'Verdant Fields Entrance',
        description: "The path from the ranch opens into vast, rolling green fields. The air is fresh and smells of rich soil.",
        connections: ['mcgregors_ranch', 'wheat_field_east', 'winding_brook_north'],
        activities: [],
        regionId: 'wilderness',
        x: 700, y: 1200
    },
    wheat_field_east: {
        id: 'wheat_field_east',
        name: 'East Wheat Field',
        description: "A vast field of golden wheat sways in the gentle breeze. A strange figure stands motionless in the center.",
        connections: ['verdant_fields_entrance', 'wheat_field_central', 'old_mill_path'],
        activities: [
            { type: 'combat', monsterId: 'scarecrow' }
        ],
        regionId: 'wilderness',
        x: 640, y: 1240
    },
    wheat_field_central: {
        id: 'wheat_field_central',
        name: 'Central Wheat Field',
        description: 'The heart of the wheat fields. The sheer amount of grain is staggering.',
        connections: ['wheat_field_east', 'wheat_field_west'],
        activities: [
            { type: 'combat', monsterId: 'scarecrow' },
            { type: 'combat', monsterId: 'scarecrow' },
        ],
        regionId: 'wilderness',
        x: 580, y: 1240
    },
    wheat_field_west: {
        id: 'wheat_field_west',
        name: 'West Wheat Field',
        description: 'The western edge of the wheat fields, bordering a small forest.',
        connections: ['wheat_field_central', 'boar_woods_edge'],
        activities: [
            { type: 'combat', monsterId: 'scarecrow' },
        ],
        regionId: 'wilderness',
        x: 520, y: 1240
    },
    boar_woods_edge: {
        id: 'boar_woods_edge',
        name: "Boar Wood's Edge",
        description: 'A small patch of woods where the earth is churned up by the digging of wild boars.',
        connections: ['wheat_field_west', 'boar_woods_deep'],
        activities: [
            { type: 'combat', monsterId: 'wild_boar' },
            { type: 'skilling', id: 'boar_woods_edge_tree', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 2, max: 4 }, respawnTime: 12000, gatherTime: 2000 },
        ],
        regionId: 'wilderness',
        x: 460, y: 1240
    },
    boar_woods_deep: {
        id: 'boar_woods_deep',
        name: 'Boar Wood Deeps',
        description: 'The heart of the small woods, where the largest and most aggressive boars make their home. This is a dead end.',
        connections: ['boar_woods_edge'],
        activities: [
            { type: 'combat', monsterId: 'wild_boar' },
            { type: 'combat', monsterId: 'wild_boar' },
        ],
        regionId: 'wilderness',
        x: 400, y: 1240
    },
    winding_brook_north: {
        id: 'winding_brook_north',
        name: 'Winding Brook (North)',
        description: 'A shallow brook gurgles peacefully as it winds its way south.',
        connections: ['verdant_fields_entrance', 'winding_brook_south', 'old_mill_path'],
        activities: [
            { type: 'skilling', id: 'winding_brook_north_fishing', name: 'Net Shrimp', skill: SkillName.Fishing, requiredLevel: 1, loot: [{ itemId: 'raw_shrimp', chance: 1, xp: 10 }, { itemId: 'raw_sardine', chance: 0.4, xp: 20, requiredLevel: 5 }], resourceCount: { min: 4, max: 8 }, respawnTime: 8000, gatherTime: 1800 },
        ],
        regionId: 'wilderness',
        x: 700, y: 1140
    },
    winding_brook_south: {
        id: 'winding_brook_south',
        name: 'Winding Brook (South)',
        description: 'The brook continues its journey south, passing by a small, sleepy hamlet. A smaller stream flows in from the west.',
        connections: ['winding_brook_north', 'brookside_hamlet', 'clearwater_stream'],
        activities: [
            { type: 'skilling', id: 'winding_brook_south_fishing', name: 'Net Shrimp', skill: SkillName.Fishing, requiredLevel: 1, loot: [{ itemId: 'raw_shrimp', chance: 1, xp: 10 }, { itemId: 'raw_sardine', chance: 0.4, xp: 20, requiredLevel: 5 }], resourceCount: { min: 4, max: 8 }, respawnTime: 8000, gatherTime: 1800 },
        ],
        regionId: 'wilderness',
        x: 700, y: 1080
    },
    clearwater_stream: {
        id: 'clearwater_stream',
        name: 'Clearwater Stream',
        description: 'A crystal clear stream flowing down from the mountains. Perfect for trout fishing.',
        connections: ['winding_brook_south'],
        activities: [
            { type: 'skilling', id: 'clearwater_stream_fishing', name: 'Fish for Trout', skill: SkillName.Fishing, requiredLevel: 20, loot: [{itemId: 'raw_trout', xp: 50, chance: 1}, {itemId: 'raw_pike', xp: 70, chance: 0.3, requiredLevel: 30}], resourceCount: {min: 8, max: 15}, respawnTime: 15000, gatherTime: 2200 }
        ],
        regionId: 'wilderness',
        x: 640, y: 1080
    },
    old_mill_path: {
        id: 'old_mill_path',
        name: 'Old Mill Path',
        description: 'A dirt path connecting the fields and the brook to an old, weathered mill.',
        connections: ['winding_brook_north', 'wheat_field_east'],
        activities: [],
        regionId: 'wilderness',
        x: 640, y: 1180
    },
    the_old_mill: {
        id: 'the_old_mill',
        name: 'The Old Mill',
        description: 'A dilapidated water mill. Its great wheel is still, and the building groans in the wind.',
        connections: ['old_mill_path'],
        activities: [
            { type: 'combat', monsterId: 'giant_rat' }
        ],
        regionId: 'wilderness',
        x: 600, y: 1140
    },
    brookside_hamlet: {
        id: 'brookside_hamlet',
        name: 'Brookside Hamlet',
        description: 'A tiny collection of houses. The folk here seem peaceful and keep to themselves.',
        connections: ['winding_brook_south', 'hamlet_commons'],
        activities: [
            { type: 'npc', name: 'Farmer Giles', icon: 'https://api.iconify.design/game-icons:farmer.svg', dialogue: ["Just a simple farmer, tryin\' to make a livin\'."] }
        ],
        regionId: 'wilderness',
        x: 700, y: 1020
    },
    hamlet_commons: {
        id: 'hamlet_commons',
        name: 'Hamlet Commons',
        description: 'A small common area for the hamlet, with a well and a few benches.',
        connections: ['brookside_hamlet'],
        activities: [
            { type: 'wishing_well' }
        ],
        regionId: 'wilderness',
        x: 740, y: 980
    },
};