

import { POI, SkillName } from '../../types';

export const wildernessPois: Record<string, POI> = {
    whispering_woods: {
        id: 'whispering_woods',
        name: 'Whispering Woods',
        description: 'A dense forest filled with tall, ancient trees. A faint whispering sound seems to follow you.',
        connections: ['meadowdale_north_gate', 'murky_riverbank', 'deep_woods'],
        activities: [
            { type: 'skilling', id: 'whispering_woods_trees', name: 'Chop Trees', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 0.8, xp: 25 }], resourceCount: { min: 1, max: 4 }, respawnTime: 12000, gatherTime: 2000 },
            { type: 'skilling', id: 'whispering_woods_trees_2', name: 'Chop Trees', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 0.8, xp: 25 }], resourceCount: { min: 1, max: 4 }, respawnTime: 12000, gatherTime: 2000 },
            { type: 'combat', monsterId: 'giant_rat'}
        ],
        regionId: 'wilderness',
        x: 1000, y: 800
    },
    murky_riverbank: {
        id: 'murky_riverbank',
        name: 'Murky Riverbank',
        description: 'The bank of a slow-moving river. The water is murky, but you can see small fish darting about.',
        connections: ['whispering_woods'],
        activities: [
            { type: 'skilling', id: 'murky_river_fishing', name: 'Net Shrimp', skill: SkillName.Fishing, requiredLevel: 1, loot: [{ itemId: 'raw_shrimp', chance: 1, xp: 10 }, { itemId: 'raw_sardine', chance: 0.4, xp: 20, requiredLevel: 5 }], resourceCount: { min: 5, max: 10 }, respawnTime: 8000, gatherTime: 1800 }
        ],
        unlockRequirement: { type: 'quest', questId: 'goblin_menace', stage: 1 },
        regionId: 'wilderness',
        x: 900, y: 700
    },
    deep_woods: {
        id: 'deep_woods',
        name: 'Deep Woods',
        description: 'The trees grow thicker here, blotting out the sun. Strange noises echo from the shadows.',
        connections: ['whispering_woods', 'overgrown_path', 'ancient_clearing', 'ancient_pass'],
        activities: [
            { type: 'combat', monsterId: 'giant_rat' },
            { type: 'skilling', id: 'deep_woods_trees_1', name: 'Chop Trees', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 0.8, xp: 25 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 2000 },
            { type: 'skilling', id: 'deep_woods_trees_2', name: 'Chop Trees', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 0.8, xp: 25 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 2000 },
            { type: 'skilling', id: 'deep_woods_trees_3', name: 'Chop Trees', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 0.8, xp: 25 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 2000 },
        ],
        connectionRequirements: {
            ancient_pass: {
                skill: SkillName.Mining,
                level: 30,
                xp: 500,
                description: "A massive rockfall completely blocks a path leading north into the mountains.",
                actionText: "Clear Rockfall"
            }
        },
        regionId: 'wilderness',
        x: 1100, y: 700
    },
    overgrown_path: {
        id: 'overgrown_path',
        name: 'Overgrown Path',
        description: 'A barely-visible path that comes to an abrupt end, blocked by thorny vines. This is a dead end.',
        connections: ['deep_woods'],
        activities: [
            { type: 'skilling', id: 'overgrown_path_oak_tree', name: 'Chop Oak Tree', skill: SkillName.Woodcutting, requiredLevel: 15, loot: [{ itemId: 'oak_logs', chance: 0.9, xp: 65 }], resourceCount: { min: 6, max: 32 }, respawnTime: 18000, gatherTime: 3000 },
            { type: 'skilling', id: 'overgrown_path_trees_1', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 0.8, xp: 25 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 2000 },
            { type: 'skilling', id: 'overgrown_path_trees_2', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 0.8, xp: 25 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 2000 },
        ],
        regionId: 'wilderness',
        x: 1000, y: 600
    },
    ancient_clearing: {
        id: 'ancient_clearing',
        name: 'Ancient Clearing',
        description: 'A circle of mossy stones sits in the center of this quiet clearing. The air feels heavy with age. A path leads north into an ethereal, glowing forest.',
        connections: ['deep_woods', 'feywood_entrance'],
        activities: [
            {
                type: 'npc',
                name: 'Whispering Spirit',
                icon: '/assets/npcChatHeads/whispering_spirit.png',
                dialogue: [
                    "The paths... they twist and turn...",
                    "...do not lose your way...",
                    "The Feywood is not a place of this world. It remembers what mortals forget.",
                    "They say the trees themselves have memories older than the mountains."
                ]
            }
        ],
        regionId: 'wilderness',
        x: 1200, y: 640
    },
};