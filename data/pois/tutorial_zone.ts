import { POI, SkillName, ToolType } from '../../types';

export const tutorialZonePois: Record<string, POI> = {
    tutorial_entrance: {
        id: 'tutorial_entrance',
        name: 'Tutorial Entrance',
        description: 'A simple path leading into a secluded training area. A knowledgeable guide awaits to show you the ropes.',
        connections: ['tutorial_survival_grounds'],
        activities: [
            {
                type: 'npc',
                name: 'Leo the Guide',
                icon: '/assets/npcChatHeads/leo_the_guide.png',
            },
        ],
        regionId: 'path_of_beginnings', x: 89, y: -50,
    },
    tutorial_survival_grounds: {
        id: 'tutorial_survival_grounds',
        name: 'Survival Training Grounds',
        description: 'A small clearing with basic resources for survival training. A survival expert is here to help.',
        connections: ['tutorial_entrance', 'tutorial_baking_area'],
        unlockRequirement: { type: 'quest', questId: 'embrune_101', stage: 1 },
        activities: [
            {
                type: 'npc',
                name: 'Survival Guide',
                icon: '/assets/npcChatHeads/survival_guide.png',
            },
            { type: 'skilling', id: 'tut_survival_tree1', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 999, max: 999 }, respawnTime: 3000, gatherTime: 1500 },
            { type: 'skilling', id: 'tut_survival_fish1', name: 'Net Fish', skill: SkillName.Fishing, requiredLevel: 1, loot: [{ itemId: 'raw_shrimp', chance: 1, xp: 10 }], resourceCount: { min: 999, max: 999 }, respawnTime: 4000, gatherTime: 1800, requiredTool: ToolType.FishingNet },
        ],
        regionId: 'path_of_beginnings', x: 91, y: 4,
    },
    tutorial_baking_area: {
        id: 'tutorial_baking_area',
        name: 'Baking Area',
        description: 'The smell of fresh bread hangs in the air. A baker stands near a cooking range, next to a field of wheat.',
        connections: ['tutorial_survival_grounds', 'tutorial_learning_hut'],
        unlockRequirement: { type: 'quest', questId: 'embrune_101', stage: 3 },
        activities: [
            {
                type: 'npc',
                name: 'Baker',
                icon: '/assets/npcChatHeads/baker.png',
            },
            { type: 'skilling', id: 'tut_baking_wheat', name: 'Harvest Wheat', skill: SkillName.Cooking, requiredLevel: 1, loot: [{ itemId: 'wheat', chance: 1, xp: 0 }], resourceCount: { min: 999, max: 999 }, respawnTime: 2000, gatherTime: 600 },
            { type: 'windmill' },
            { type: 'cooking_range' },
            { type: 'water_source', name: 'Fill Container' },
        ],
        regionId: 'path_of_beginnings', x: -19, y: -5,
    },
    tutorial_learning_hut: {
        id: 'tutorial_learning_hut',
        name: 'Learning Hut',
        description: 'A small hut filled with books and scrolls. An information guide offers to share knowledge. A ladder leads down into the darkness.',
        connections: ['tutorial_baking_area'],
        unlockRequirement: { type: 'quest', questId: 'embrune_101', stage: 6 },
        activities: [
            {
                type: 'npc',
                name: 'Information Guide',
                icon: '/assets/npcChatHeads/information_guide.png',
            },
            {
                type: 'ladder',
                name: 'Climb Down Ladder',
                direction: 'down',
                toPoiId: 'tutorial_mine',
                questCondition: { questId: 'embrune_101', stages: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], visibleAfterCompletion: true }
            }
        ],
        regionId: 'path_of_beginnings', x: -42, y: -109,
    },
    tutorial_mine: {
        id: 'tutorial_mine',
        name: 'Tutorial Mine',
        description: 'A small cavern with deposits of copper and tin. A furnace and anvil stand ready for use.',
        connections: ['tutorial_combat_area'],
        unlockRequirement: { type: 'quest', questId: 'embrune_101', stage: 7 },
        activities: [
            {
                type: 'npc',
                name: 'Mining Guide',
                icon: '/assets/npcChatHeads/mining_guide.png',
            },
            { type: 'skilling', id: 'tut_mine_copper1', name: 'Mine Copper', skill: SkillName.Mining, requiredLevel: 1, loot: [{ itemId: 'copper_ore', chance: 1, xp: 18 }], resourceCount: { min: 999, max: 999 }, respawnTime: 3000, gatherTime: 1500 },
            { type: 'skilling', id: 'tut_mine_tin1', name: 'Mine Tin', skill: SkillName.Mining, requiredLevel: 1, loot: [{ itemId: 'tin_ore', chance: 1, xp: 18 }], resourceCount: { min: 999, max: 999 }, respawnTime: 3000, gatherTime: 1500 },
            { type: 'furnace' },
            { type: 'anvil' },
            {
                type: 'ladder',
                name: 'Climb Up Ladder',
                direction: 'up',
                toPoiId: 'tutorial_learning_hut',
                questCondition: { questId: 'embrune_101', stages: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], visibleAfterCompletion: true }
            }
        ],
        regionId: 'path_of_beginnings', x: 48, y: -180,
    },
    tutorial_combat_area: {
        id: 'tutorial_combat_area',
        name: 'Combat Area',
        description: 'An area set up for combat practice. Some rats skitter in a cage.',
        connections: ['tutorial_mine', 'tutorial_bank_area'],
        unlockRequirement: { type: 'quest', questId: 'embrune_101', stage: 10 },
        activities: [
            { type: 'npc', name: 'Weapon Guide', icon: '/assets/npcChatHeads/weapon_guide.png' },
            { type: 'combat', monsterId: 'tutorial_rat' },
            { type: 'combat', monsterId: 'tutorial_rat' },
        ],
        regionId: 'path_of_beginnings', x: 175, y: -193,
    },
    tutorial_bank_area: {
        id: 'tutorial_bank_area',
        name: 'Bank & Finance Area',
        description: 'A small, secure building. Inside, a Banker and a Money Guide offer their services.',
        connections: ['tutorial_combat_area', 'tutorial_chapel_area'],
        unlockRequirement: { type: 'quest', questId: 'embrune_101', stage: 15 },
        activities: [
            {
                type: 'npc',
                name: 'Banker',
                icon: '/assets/npcChatHeads/banker.png',
                dialogue: {
                    default_dialogue: {
                        npcName: 'Banker',
                        npcIcon: '/assets/npcChatHeads/banker.png',
                        text: "Your items are safe with us. Would you like to access your bank?",
                        responses: [
                            { text: "Yes.", actions: [{ type: 'open_bank' }] },
                            { text: "No, thank you." }
                        ]
                    }
                },
                startNode: 'default_dialogue'
            },
            { type: 'npc', name: 'Money Guide', icon: '/assets/npcChatHeads/money_guide.png' },
        ],
        regionId: 'path_of_beginnings', x: 267, y: -96,
    },
    tutorial_chapel_area: {
        id: 'tutorial_chapel_area',
        name: 'Chapel Area',
        description: 'A small, peaceful chapel stands in this clearing.',
        connections: ['tutorial_bank_area', 'tutorial_tavern'],
        unlockRequirement: { type: 'quest', questId: 'embrune_101', stage: 17 },
        activities: [
            { type: 'npc', name: 'Prayer Guide', icon: '/assets/npcChatHeads/prayer_guide.png' },
        ],
        regionId: 'path_of_beginnings', x: 257, y: 54,
    },
    tutorial_tavern: {
        id: 'tutorial_tavern',
        name: 'Tutorial Tavern',
        description: 'A cozy tavern. A manager, a magic guide, and a quest board offer opportunities.',
        connections: ['tutorial_chapel_area'],
        unlockRequirement: { type: 'quest', questId: 'embrune_101', stage: 18 },
        activities: [
            { type: 'npc', name: 'Tavern Manager', icon: '/assets/npcChatHeads/barkeep_grimley.png' },
            { type: 'npc', name: 'Magic Guide', icon: '/assets/npcChatHeads/wizard_elmsworth.png' },
            { 
                type: 'quest_board',
                questCondition: { questId: 'embrune_101', stages: [19] },
            },
            { type: 'combat', monsterId: 'tutorial_rat' },
        ],
        regionId: 'path_of_beginnings', x: 98, y: 106,
    },
};