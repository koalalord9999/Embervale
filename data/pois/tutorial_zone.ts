
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
                startNode: 'leo_default',
                questTopics: ['embrune_101'],
                conditionalGreetings: [
                    { text: "Still here? The Survival Guide is just down the path. He's waiting for you.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 1 }] } },
                    { text: "Back already? You should be showing your cooked shrimp to the Survival Guide, not me!", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 2 }] } },
                    { text: "Excellent work! The Baker is next. He's in the area just past the Survival Guide.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 3 }] } },
                    { text: "Harvesting wheat, are we? Good, good. Follow the Baker's instructions.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 4 }] } },
                    { text: "Smells like fresh bread! You're getting the hang of this. The Information Guide is in the hut to the north.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 5 }] } },
                    { text: "Learning about the interface, I see. Very important. Don't want to get lost in your own pockets.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 6 }] } },
                    { text: "Ah, headed to the mines! A bit of proper work for you. Don't get lost.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 7 }] } },
                    { text: "Smelting is a fine art. Hot work, though. Are you supposed to be talking to me or smithing a dagger?", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 8 }] } },
                    { text: "Finished the dagger already? Impressive. The Mining Guide will want to see that, not me.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 9 }] } },
                    { text: "Off to learn the pointy end of things, eh? The Weapon Guide is a bit gruff, but he knows his stuff.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 10 }] } },
                    { text: "Still here? That rat isn't going to defeat itself! Show it what you've learned.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 11 }] } },
                    { text: "One rat down! Good. The Weapon Guide will be pleased. Why are you telling me?", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 12 }] } },
                    { text: "Ah, the bow! A noble weapon. A bit more finesse than just swinging a sword. Go on, give it a try.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 13 }] } },
                    { text: "You're getting good at this! You should report your success to the Weapon Guide.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 14 }] } },
                    { text: "Off to see the Banker? A wise move. An adventurer with no bank space is a sad sight.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 15 }] } },
                    { text: "Learning about money now? Good. It makes the world go 'round, or so they say.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 16 }] } },
                    { text: "The chapel is a peaceful place. The Prayer Guide will teach you about powers beyond the physical.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 17 }] } },
                    { text: "Ah, the tavern! A fine place for any adventurer. The manager there has work for you.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 18 }] } },
                    { text: "Checking the quest board is a good habit. You've accepted a task, I see. Now, find the Magic Guide.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 19 }] } },
                    { text: "Magic! The most powerful and dangerous of the arts. Listen well to the Magic Guide.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 20 }] } },
                    { text: "That poor rat doesn't stand a chance. Are you sure you should be here and not... zapping rodents?", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 21 }] } },
                    { text: "Task complete! Well done. You should report your success to the Tavern Manager.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 22 }] } },
                    { text: "Your final lesson. You've come a long way. Are you just visiting, or did you forget where to go?", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 23 }] } },
                    { text: "You're still here? I'm... impressed by your dedication to checking in with me. Most adventurers just rush ahead. It's oddly endearing. But your journey awaits! Speak to the Magic Guide to finally leave.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 24 }] } },
                    { text: "It's good to see you again, though I'm surprised you came all the way back here! The world awaits, go explore!", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'completed' }] } },
                ],
                dialogue: {
                    leo_default: {
                        npcName: 'Leo the Guide',
                        npcIcon: '/assets/npcChatHeads/leo_the_guide.png',
                        text: "Welcome to Embrune! Ready to start your adventure?",
                        responses: []
                    }
                }
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
                startNode: 'survival_default',
                questTopics: ['embrune_101'],
                conditionalGreetings: [
                    { text: "Remember, chop a tree for logs, and catch a shrimp from the fishing spot. Simple as that.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 1 }] } },
                    { text: "You've got the raw materials, good. Now light a fire and cook that shrimp! Don't burn it.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 2 }] } },
                ],
                dialogue: {
                    survival_default: {
                        npcName: 'Survival Guide',
                        npcIcon: '/assets/npcChatHeads/survival_guide.png',
                        text: "Learning to live off the land is the first step to becoming a true adventurer.",
                        responses: []
                    }
                }
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
                startNode: 'baker_default',
                questTopics: ['embrune_101'],
                conditionalGreetings: [
                    { text: "Ready to learn the art of baking? First, you'll need a bucket for water and some wheat from the field.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 3 }] } },
                    { text: "Gather the wheat, mill it, collect the flour, add water to make dough, then bake it. Simple, yes?", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 4 }] } },
                    { text: "Wonderful! A perfect loaf. You're a natural. Head to the hut and speak with the Information Guide next.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 5 }] } },
                ],
                dialogue: {
                    baker_default: {
                        npcName: 'Baker',
                        npcIcon: '/assets/npcChatHeads/baker.png',
                        text: "Nothing warms the soul like a fresh loaf of bread!",
                        responses: []
                    }
                }
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
                startNode: 'info_default',
                questTopics: ['embrune_101'],
                conditionalGreetings: [
                    { text: "Pay attention to your interface. Knowing where your skills and quests are is half the battle. Once you're ready, head down the ladder to the mine.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 6 }] } },
                ],
                dialogue: {
                    info_default: {
                        npcName: 'Information Guide',
                        npcIcon: '/assets/npcChatHeads/information_guide.png',
                        text: "Knowledge is the sharpest weapon in any adventurer's arsenal.",
                        responses: []
                    }
                }
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
                startNode: 'mining_default',
                questTopics: ['embrune_101'],
                conditionalGreetings: [
                    { text: "Ready to work? Grab a pickaxe and get me one copper ore and one tin ore.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 7 }] } },
                    { text: "You have the ore? Good. Now use the furnace to smelt a bronze bar. Then, use the anvil to smith a dagger.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 8 }] } },
                    { text: "Excellent work! A fine dagger. Now, take it to the Weapon Guide and learn how to use it.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 9 }] } },
                ],
                dialogue: {
                    mining_default: {
                        npcName: 'Mining Guide',
                        npcIcon: '/assets/npcChatHeads/mining_guide.png',
                        text: "The ring of a hammer, the heat of the forge... that's the life for me.",
                        responses: []
                    }
                }
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
            {
                type: 'npc',
                name: 'Weapon Guide',
                icon: '/assets/npcChatHeads/weapon_guide.png',
                startNode: 'weapon_default',
                questTopics: ['embrune_101'],
                conditionalGreetings: [
                    { text: "Ready to fight? First, open your equipment panel and equip that dagger. Then, check your combat styles.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 10 }] } },
                    { text: "You know the stances. Now put them to the test. Defeat one of those rats with your dagger.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 11 }] } },
                    { text: "Good. Now for ranged combat. Equip this bow and arrows and take down the other rat.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 12 }] } },
                    { text: "Don't just stand there, let the arrows fly!", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 13 }] } },
                    { text: "You've mastered the basics. Your training is complete. Head north to learn about banking.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 14 }] } },
                ],
                dialogue: {
                    weapon_default: {
                        npcName: 'Weapon Guide',
                        npcIcon: '/assets/npcChatHeads/weapon_guide.png',
                        text: "A sharp blade and a steady hand are an adventurer's best friends.",
                        responses: []
                    }
                }
            },
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
                startNode: 'default_dialogue',
                questTopics: ['embrune_101'],
                conditionalGreetings: [
                    { text: "Welcome. Let me show you how to use your bank to store items safely.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 15 }] } },
                ],
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
                }
            },
            {
                type: 'npc',
                name: 'Money Guide',
                icon: '/assets/npcChatHeads/money_guide.png',
                startNode: 'money_default',
                questTopics: ['embrune_101'],
                conditionalGreetings: [
                    { text: "The banker showed you how to store items. I'm here to tell you about coins, the most important item of all!", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 16 }] } },
                ],
                dialogue: {
                    money_default: {
                        npcName: 'Money Guide',
                        npcIcon: '/assets/npcChatHeads/money_guide.png',
                        text: "A full coin purse is a happy coin purse.",
                        responses: []
                    }
                }
            },
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
            {
                type: 'npc',
                name: 'Prayer Guide',
                icon: '/assets/npcChatHeads/prayer_guide.png',
                startNode: 'prayer_default',
                questTopics: ['embrune_101'],
                conditionalGreetings: [
                    { text: "To train Prayer, you must bury the bones of the fallen. Give it a try, then head north to the tavern.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 17 }] } },
                ],
                dialogue: {
                    prayer_default: {
                        npcName: 'Prayer Guide',
                        npcIcon: '/assets/npcChatHeads/prayer_guide.png',
                        text: "May you walk in the light.",
                        responses: []
                    }
                }
            },
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
            {
                type: 'npc',
                name: 'Tavern Manager',
                icon: '/assets/npcChatHeads/barkeep_grimley.png',
                startNode: 'tavern_default',
                questTopics: ['embrune_101'],
                conditionalGreetings: [
                    { text: "Welcome! Check the quest board for your first real task.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 18 }] } },
                    { text: "You've accepted the task? Excellent. Now go speak to the Magic Guide in the corner.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 19 }] } },
                    { text: "You've dealt with the rat? Fantastic! Report back to the Magic Guide for your final lesson.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 22 }] } },
                ],
                dialogue: {
                    tavern_default: {
                        npcName: 'Tavern Manager',
                        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                        text: "Welcome! Looking for work or a drink?",
                        responses: []
                    }
                }
            },
            {
                type: 'npc',
                name: 'Magic Guide',
                icon: '/assets/npcChatHeads/wizard_elmsworth.png',
                startNode: 'magic_default',
                questTopics: ['embrune_101'],
                conditionalGreetings: [
                    { text: "Ready to learn magic? I'll give you the runes. Your task is to defeat the rat in the tavern using a Gust Dart spell.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 20 }] } },
                    { text: "Focus your mind, channel the energy, and release! That rat won't know what hit it.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 21 }] } },
                    { text: "You've learned much. You are ready to venture into the world. When you wish to leave, speak to me again.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 23 }] } },
                    { text: "Your adventure awaits in Meadowdale. Are you ready to go?", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 24 }] } },
                ],
                dialogue: {
                    magic_default: {
                        npcName: 'Magic Guide',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "Magic is a powerful tool, if you have the will to master it.",
                        responses: []
                    }
                }
            },
            { 
                type: 'quest_board',
                questCondition: { questId: 'embrune_101', stages: [19] },
            },
            { type: 'combat', monsterId: 'tutorial_rat' },
        ],
        regionId: 'path_of_beginnings', x: 98, y: 106,
    },
};
