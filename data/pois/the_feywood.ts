

import { POI, SkillName, ToolType } from '../../types';

export const theFeywoodPois: Record<string, POI> = {
    feywood_entrance: {
        id: 'feywood_entrance',
        name: 'Feywood Entrance',
        description: 'The air grows still and a soft, ethereal light filters through the canopy. The trees here have a strange, silvery bark.',
        connections: ['ancient_clearing', 'shimmering_path', 'glowing_grove'],
        activities: [
            { type: 'skilling', name: 'Ancient Feywood Tree', id: 'feywood_entrance_tree', skill: SkillName.Woodcutting, requiredLevel: 55, loot: [{ itemId: 'feywood_logs', chance: 1, xp: 120 }], resourceCount: { min: 2, max: 4 }, respawnTime: 30000, gatherTime: 4000 },
        ],
        regionId: 'feywood',
        x: 1260, y: 600
    },
    shimmering_path: {
        id: 'shimmering_path',
        name: 'Shimmering Path',
        description: 'The ground is covered in moss that glows with a soft, pulsating light. Tiny, winged creatures flit between the trees.',
        connections: ['feywood_entrance', 'sprite_circle', 'whispering_pond'],
        activities: [
            { type: 'combat', monsterId: 'fey_sprite' }
        ],
        regionId: 'feywood',
        x: 1320, y: 560
    },
    glowing_grove: {
        id: 'glowing_grove',
        name: 'Glowing Grove',
        description: 'A grove of Feywood trees that pulse with a gentle, calming light. The area feels safe and peaceful.',
        connections: ['feywood_entrance', 'mushroom_circle'],
        activities: [
            { type: 'skilling', name: 'Ancient Feywood Tree', id: 'glowing_grove_tree_1', skill: SkillName.Woodcutting, requiredLevel: 55, loot: [{ itemId: 'feywood_logs', chance: 1, xp: 120 }], resourceCount: { min: 3, max: 6 }, respawnTime: 30000, gatherTime: 4000 },
            { type: 'skilling', name: 'Ancient Feywood Tree', id: 'glowing_grove_tree_2', skill: SkillName.Woodcutting, requiredLevel: 55, loot: [{ itemId: 'feywood_logs', chance: 1, xp: 120 }], resourceCount: { min: 3, max: 6 }, respawnTime: 30000, gatherTime: 4000 },
        ],
        regionId: 'feywood',
        x: 1200, y: 560
    },
    mushroom_circle: {
        id: 'mushroom_circle',
        name: 'Mushroom Circle',
        description: 'A perfect circle of giant, glowing mushrooms. The air hums with a low, magical energy.',
        connections: ['glowing_grove'],
        activities: [
            { type: 'combat', monsterId: 'fey_sprite' },
            { type: 'combat', monsterId: 'fey_sprite' },
        ],
        regionId: 'feywood',
        x: 1160, y: 520
    },
    sprite_circle: {
        id: 'sprite_circle',
        name: 'Sprite Circle',
        description: 'A clearing where dozens of sprites dance in the air, leaving trails of glittering dust.',
        connections: ['shimmering_path', 'fey_altar', 'ancient_feywood'],
        activities: [
            { type: 'combat', monsterId: 'fey_sprite' },
            { type: 'combat', monsterId: 'fey_sprite' },
            { type: 'combat', monsterId: 'fey_sprite' },
        ],
        regionId: 'feywood',
        x: 1380, y: 520
    },
    whispering_pond: {
        id: 'whispering_pond',
        name: 'Whispering Pond',
        description: 'A perfectly still pond that reflects the glowing canopy above. Faint whispers seem to rise from its surface.',
        connections: ['shimmering_path', 'moonlit_clearing'],
        activities: [
            { 
                type: 'skilling', 
                id: 'whispering_pond_fishing', 
                name: 'Fly Fish', 
                skill: SkillName.Fishing, 
                requiredLevel: 20, 
                loot: [
                    { itemId: 'raw_trout', chance: 1, xp: 50, requiredLevel: 20 }
                ], 
                resourceCount: { min: 15, max: 33 }, 
                respawnTime: 15000, 
                gatherTime: 2200,
                requiredTool: ToolType.FlyFishingRod,
            }
        ],
        regionId: 'feywood',
        x: 1320, y: 500
    },
    moonlit_clearing: {
        id: 'moonlit_clearing',
        name: 'Moonlit Clearing',
        description: 'A beautiful, open clearing that seems to be perpetually bathed in moonlight, regardless of the time of day.',
        connections: ['whispering_pond', 'aqua_altar'],
        activities: [],
        regionId: 'feywood',
        x: 1280, y: 460
    },
    fey_altar: {
        id: 'fey_altar',
        name: 'Fey Altar',
        description: 'A simple, moss-covered stone altar stands in the center of this clearing. It radiates a powerful, yet peaceful, magic.',
        connections: ['sprite_circle'],
        activities: [
            { 
                type: 'npc', 
                name: 'Fey Spirit', 
                icon: '/assets/npcChatHeads/fey_spirit.png', 
                dialogue: {
                    start: {
                        npcName: 'Fey Spirit',
                        npcIcon: '/assets/npcChatHeads/fey_spirit.png',
                        text: "Tread lightly, mortal. This is a sacred place.",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'feywood',
        x: 1440, y: 560
    },
    ancient_feywood: {
        id: 'ancient_feywood',
        name: 'Ancient Feywood',
        description: 'The trees here are impossibly large and ancient, their branches weaving a tight canopy high above.',
        connections: ['sprite_circle', 'heart_of_the_fey'],
        activities: [
            { type: 'skilling', name: 'Ancient Feywood Tree', id: 'ancient_feywood_tree', skill: SkillName.Woodcutting, requiredLevel: 55, loot: [{ itemId: 'feywood_logs', chance: 1, xp: 120 }], resourceCount: { min: 5, max: 10 }, respawnTime: 45000, gatherTime: 4000 },
        ],
        regionId: 'feywood',
        x: 1420, y: 480
    },
    heart_of_the_fey: {
        id: 'heart_of_the_fey',
        name: 'Heart of the Fey',
        description: 'The very heart of the forest. The air is so thick with magic it feels tangible. A single, colossal tree pulses with soft light.',
        connections: ['ancient_feywood', 'verdant_altar'],
        activities: [
            { type: 'skilling', name: 'Colossal Feywood Tree', id: 'heart_feywood_tree', skill: SkillName.Woodcutting, requiredLevel: 70, loot: [{ itemId: 'feywood_logs', chance: 1, xp: 120 }], resourceCount: { min: 80, max: 300 }, respawnTime: 125000, gatherTime: 4000 }
        ],
        regionId: 'feywood',
        x: 1480, y: 440
    },
    aqua_altar: {
        id: 'aqua_altar',
        name: 'Altar of the Spring',
        description: 'A serene altar made of smooth, river-worn stones. A spring of impossibly pure water bubbles up from its center, flowing into the Whispering Pond.',
        connections: ['moonlit_clearing'],
        activities: [
            { type: 'runecrafting_altar', runeId: 'aqua_rune' },
            {
                type: 'npc',
                name: 'Use Resonator',
                icon: 'https://api.iconify.design/game-icons:orb-wand.svg',
                questCondition: { questId: 'the_arcane_awakening', stages: [0] },
                dialogue: {
                    start: {
                        npcName: 'Arcane Resonator', npcIcon: 'https://api.iconify.design/game-icons:orb-wand.svg',
                        text: "You hold the Arcane Resonator up to the altar. It begins to vibrate violently, and a shimmering creature of pure energy coalesces before you!",
                        responses: [
                            {
                                text: "(Face the creature)",
                                check: {
                                    requirements: [
                                        { type: 'items', items: [{ itemId: 'arcane_resonator', quantity: 1 }] },
                                        { type: 'items', items: [{ itemId: 'aqua_reading', quantity: 0, operator: 'eq' }] }
                                    ],
                                    successNode: 'trigger_combat',
                                    failureNode: 'already_have_reading'
                                },
                                actions: [
                                    { type: 'set_quest_combat_reward', itemId: 'aqua_reading', quantity: 1 },
                                    { type: 'start_mandatory_combat', monsterId: 'mana_wisp' }
                                ]
                            }
                        ]
                    },
                    trigger_combat: {
                        npcName: 'Arcane Resonator', npcIcon: 'https://api.iconify.design/game-icons:orb-wand.svg',
                        text: "The Mana Wisp shrieks and attacks!",
                        responses: [],
                    },
                    already_have_reading: {
                        npcName: 'Arcane Resonator', npcIcon: 'https://api.iconify.design/game-icons:orb-wand.svg',
                        text: "You've already taken a reading from this altar.",
                        responses: []
                    }
                },
                startNode: 'start'
            },
        ],
        regionId: 'feywood',
        x: 1240, y: 420,
    },
    verdant_altar: {
        id: 'verdant_altar',
        name: 'Altar of Life',
        description: 'A living altar formed from intertwined roots and glowing moss. It pulses with a vibrant, natural energy.',
        connections: ['heart_of_the_fey'],
        activities: [
            { type: 'runecrafting_altar', runeId: 'verdant_rune' }
        ],
        regionId: 'feywood',
        x: 1520, y: 400,
    },
};