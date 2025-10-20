import { POI, SkillName, ToolType } from '../../types';

export const wildernessPois: Record<string, POI> = {
    whispering_woods: {
        id: 'whispering_woods',
        name: 'Whispering Woods',
        description: 'A dense forest filled with tall, ancient trees. A faint whispering sound seems to follow you.',
        connections: ['meadowdale_north_gate', 'murky_riverbank', 'deep_woods'],
        activities: [
            { type: 'skilling', id: 'whispering_woods_trees', name: 'Chop Trees', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 1, max: 4 }, respawnTime: 12000, gatherTime: 2000 },
            { type: 'skilling', id: 'whispering_woods_trees_2', name: 'Chop Trees', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 1, max: 4 }, respawnTime: 12000, gatherTime: 2000 },
            { type: 'combat', monsterId: 'giant_rat'}
        ],
        regionId: 'wilderness',
        x: 1000, y: 800
    },
    murky_riverbank: {
        id: 'murky_riverbank',
        name: 'Murky Riverbank',
        description: 'The bank of a slow-moving river. The water is murky, but you can see small fish darting about.',
        connections: ['whispering_woods', 'treacherous_ascent', 'windswept_clearing'],
        activities: [
            { type: 'skilling', id: 'murky_river_fishing', name: 'Net Fish', skill: SkillName.Fishing, requiredLevel: 1, loot: [{ itemId: 'raw_shrimp', chance: 1, xp: 10 }], resourceCount: { min: 5, max: 10 }, respawnTime: 8000, gatherTime: 1800, requiredTool: ToolType.FishingNet },
            { type: 'water_source', name: 'Collect Water' }
        ],
        unlockRequirement: { type: 'quest', questId: 'goblin_menace', stage: 1 },
        regionId: 'wilderness',
        x: 900, y: 700
    },
    windswept_clearing: {
        id: 'windswept_clearing',
        name: 'Windswept Clearing',
        description: 'A clearing at the base of the mountains where the wind never seems to stop blowing. A faint humming sound can be heard on the breeze.',
        connections: ['murky_riverbank', 'gust_altar'],
        activities: [],
        regionId: 'wilderness',
        x: 850, y: 650
    },
    gust_altar: {
        id: 'gust_altar',
        name: 'Altar of Gusts',
        description: 'An ancient stone altar on a windswept plateau. The air crackles with energy, and faint whispers ride the currents.',
        connections: ['windswept_clearing'],
        activities: [
            { type: 'runecrafting_altar', runeId: 'gust_rune', questCondition: { questId: 'magical_runestone_discovery', stages: [], visibleAfterCompletion: true } },
            {
                type: 'npc',
                name: 'Use Resonator',
                icon: 'https://api.iconify.design/game-icons:orb-wand.svg',
                questCondition: { questId: 'the_arcane_awakening', stages: [0] },
                startNode: 'use_resonator_gust'
            },
            {
                type: 'npc',
                name: 'Approach the altar',
                icon: 'https://api.iconify.design/game-icons:rune-stone.svg',
                questCondition: { questId: 'magical_runestone_discovery', stages: [4, 6] },
                startNode: 'start'
            },
        ],
        regionId: 'wilderness',
        x: 850, y: 600,
    },
    treacherous_ascent: {
        id: 'treacherous_ascent',
        name: 'Treacherous Ascent',
        description: "A steep, poorly-maintained path leads up into the mountains. A weathered sign warns of dangerous beasts and falling rocks. Only skilled adventurers should proceed.",
        connections: ['murky_riverbank', 'ancient_pass'],
        activities: [],
        unlockRequirement: { type: 'quest', questId: 'goblin_menace', stage: 1 },
        regionId: 'wilderness',
        x: 900, y: 600,
    },
    deep_woods: {
        id: 'deep_woods',
        name: 'Deep Woods',
        description: 'The trees grow thicker here, blotting out the sun. Strange noises echo from the shadows.',
        connections: ['whispering_woods', 'overgrown_path', 'ancient_clearing'],
        activities: [
            { type: 'combat', monsterId: 'giant_rat' },
            { type: 'skilling', id: 'deep_woods_trees_1', name: 'Chop Trees', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 2000 },
            { type: 'skilling', id: 'deep_woods_trees_2', name: 'Chop Trees', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 2000 },
            { type: 'skilling', id: 'deep_woods_trees_3', name: 'Chop Trees', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 2000 },
        ],
        regionId: 'wilderness',
        x: 1100, y: 700
    },
    overgrown_path: {
        id: 'overgrown_path',
        name: 'Overgrown Path',
        description: 'A barely-visible path that comes to an abrupt end, blocked by thorny vines. This is a dead end.',
        connections: ['deep_woods'],
        activities: [
            { type: 'skilling', id: 'overgrown_path_oak_tree', name: 'Chop Oak Tree', skill: SkillName.Woodcutting, requiredLevel: 15, loot: [{ itemId: 'oak_logs', chance: 1, xp: 65 }], resourceCount: { min: 6, max: 32 }, respawnTime: 18000, gatherTime: 3000 },
            { type: 'skilling', id: 'overgrown_path_trees_1', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 2000 },
            { type: 'skilling', id: 'overgrown_path_trees_2', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 2000 },
// FIX: Removed redundant level, xp, and respawnTime properties.
            { type: 'thieving_lockpick', id: 'overgrown_path_chest_1', targetName: 'Rotting Chest', lootTableId: 'thieving_dungeon_chest_low' },
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
                icon: 'https://api.iconify.design/game-icons:ghost-ally.svg',
                dialogue: {
                    start: {
                        npcName: 'Whispering Spirit',
                        npcIcon: 'https://api.iconify.design/game-icons:ghost-ally.svg',
                        text: "The paths... they twist and turn...\n\n...do not lose your way...\n\nThe Feywood is not a place of this world. It remembers what mortals forget.\n\nThey say the trees themselves have memories older than the mountains.",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'wilderness',
        x: 1200, y: 640
    },
};