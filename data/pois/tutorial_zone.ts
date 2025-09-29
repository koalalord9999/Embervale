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
                dialogue: {
                    in_progress_embrune_101_0: {
                        npcName: 'Leo the Guide',
                        npcIcon: '/assets/npcChatHeads/leo_the_guide.png',
                        text: "Welcome to Embrune! I'm Leo, your first guide. I'm here to teach you the basics of this world. Let's start with a simple task. Follow the path and speak to the Survival Guide. He'll teach you how to live off the land.",
                        responses: [
                            { text: "Got it, I'll go see him now.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }]},
                            { text: "I've played games like this before, can I skip the tutorial?", next: 'skip_tutorial_confirm' }
                        ]
                    },
                    skip_tutorial_confirm: {
                        npcName: 'Leo the Guide',
                        npcIcon: '/assets/npcChatHeads/leo_the_guide.png',
                        text: "Are you sure? This tutorial teaches you some core mechanics. If you skip, you'll be teleported directly to the town of Meadowdale.",
                        responses: [
                            { text: "Yes, I'm sure. To Meadowdale!", actions: [{type: 'complete_tutorial'}, {type: 'teleport', poiId: 'meadowdale_square'}]},
                            { text: "On second thought, I'll do the tutorial." }
                        ]
                    },
                    post_quest_embrune_101: {
                        npcName: 'Leo the Guide',
                        npcIcon: '/assets/npcChatHeads/leo_the_guide.png',
                        text: "You're all set! Good luck on your adventures!",
                        responses: []
                    },
                    default_dialogue: {
                        npcName: 'Leo the Guide',
                        npcIcon: '/assets/npcChatHeads/leo_the_guide.png',
                        text: "Welcome to Embrune! Speak to me to begin your adventure.",
                        responses: []
                    }
                },
                startNode: 'default_dialogue',
            },
        ],
        regionId: 'path_of_beginnings', x: 89, y: -50,
    },
    tutorial_survival_grounds: {
        id: 'tutorial_survival_grounds',
        name: 'Survival Training Grounds',
        description: 'A small clearing with basic resources for survival training. A survival expert is here to help.',
        connections: ['tutorial_entrance', 'tutorial_baking_area'],
        activities: [
            {
                type: 'npc',
                name: 'Survival Guide',
                icon: '/assets/npcChatHeads/survival_guide.png',
                dialogue: {
                    in_progress_embrune_101_1: {
                        npcName: 'Survival Guide',
                        npcIcon: '/assets/npcChatHeads/survival_guide.png',
                        text: "Ah, a newcomer! Ready to learn about survival? Your first task is to chop a tree, catch a fish, and cook it on a fire. What have you accomplished so far?",
                        responses: [],
                        conditionalResponses: [
                            { text: "I have the logs and the shrimp. What now?", check: { requirements: [{ type: 'items', items: [{ itemId: 'logs', quantity: 1 }, { itemId: 'raw_shrimp', quantity: 1 }] }], successNode: 'survival_guide_cook', failureNode: 'survival_guide_fail_both' } },
                            { text: "I have the logs. What's next?", check: { requirements: [{ type: 'items', items: [{ itemId: 'logs', quantity: 1 }] }], successNode: 'survival_guide_fish', failureNode: 'survival_guide_fail_logs' } },
                            { text: "I don't have the tools for that.", check: { requirements: [{ type: 'items', items: [{ itemId: 'bronze_axe', quantity: -1 }] }], successNode: 'survival_guide_give_tools', failureNode: 'survival_guide_has_tools' } }
                        ]
                    },
                    survival_guide_give_tools: {
                        npcName: 'Survival Guide',
                        npcIcon: '/assets/npcChatHeads/survival_guide.png',
                        text: "Right, you'll need these. Here's an axe for chopping and a tinderbox for making a fire. Your first step is to chop down a tree to get some logs.",
                        highlight: 'activity-button-1',
                        responses: [{ text: "So I have to cut down a tree and burn the logs? That's rough, but I must carry on.", actions: [{ type: 'give_item', itemId: 'bronze_axe', quantity: 1 }, { type: 'give_item', itemId: 'tinderbox', quantity: 1 }] }]
                    },
                    survival_guide_has_tools: {
                        npcName: 'Survival Guide',
                        npcIcon: '/assets/npcChatHeads/survival_guide.png',
                        text: "You have your tools. First, chop down a tree to get some logs.",
                        highlight: 'activity-button-1',
                        responses: []
                    },
                    survival_guide_fish: {
                        npcName: 'Survival Guide',
                        npcIcon: '/assets/npcChatHeads/survival_guide.png',
                        text: "Good, you have logs. Now you need food. Go catch a shrimp from the fishing spot. I'll give you a net if you don't have one.",
                        highlight: 'activity-button-2',
                        responses: [],
                        conditionalResponses: [
                            { text: "(Take the Small Fishing Net)", check: { requirements: [{ type: 'items', items: [{ itemId: 'small_fishing_net', quantity: -1 }] }], successNode: 'survival_guide_give_net_action', failureNode: 'survival_guide_has_net' } }
                        ]
                    },
                    survival_guide_give_net_action: {
                        npcName: 'Survival Guide',
                        npcIcon: '/assets/npcChatHeads/survival_guide.png',
                        text: "Here you go. Now go catch some shrimp!",
                        highlight: 'activity-button-2',
                        responses: [{ text: "Time to catch some shrimps!", actions: [{ type: 'give_item', itemId: 'small_fishing_net', quantity: 1 }] }]
                    },
                    survival_guide_has_net: {
                        npcName: 'Survival Guide',
                        npcIcon: '/assets/npcChatHeads/survival_guide.png',
                        text: "You already have a net. Go catch some shrimp!",
                        highlight: 'activity-button-2',
                        responses: []
                    },
                    survival_guide_cook: {
                        npcName: 'Survival Guide',
                        npcIcon: '/assets/npcChatHeads/survival_guide.png',
                        text: "You have everything you need! Now, to make a fire, 'Use' your Tinderbox on your Logs in your inventory. Once the fire is lit, 'Use' the Raw Shrimp on it to cook. Good luck!",
                        highlight: ['inventory-slot-tinderbox', 'inventory-slot-logs'],
                        responses: []
                    },
                    in_progress_embrune_101_2: {
                        npcName: 'Survival Guide',
                        npcIcon: '/assets/npcChatHeads/survival_guide.png',
                        text: "Well done! You've cooked your first meal. Survival is key. Now, head north to the next clearing and speak to the Baker. He'll teach you about more advanced cooking.",
                        responses: [{ text: "Thank you, I'll head there now.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
                    },
                    survival_guide_fail_logs: { npcName: 'Survival Guide', npcIcon: '/assets/npcChatHeads/survival_guide.png', text: "You don't have any logs yet. Click the 'Chop Tree' button to get some.", highlight: 'activity-button-1', responses: [] },
                    survival_guide_fail_fish: { npcName: 'Survival Guide', npcIcon: '/assets/npcChatHeads/survival_guide.png', text: "You still need a raw shrimp. Click the 'Net Fish' button over there.", highlight: 'activity-button-2', responses: [] },
                    survival_guide_fail_both: { npcName: 'Survival Guide', npcIcon: '/assets/npcChatHeads/survival_guide.png', text: "You still need logs or a shrimp. Chop a tree and then use the fishing spot.", highlight: ['activity-button-1', 'activity-button-2'], responses: [] },
                    default_dialogue: {
                        npcName: 'Survival Guide',
                        npcIcon: '/assets/npcChatHeads/survival_guide.png',
                        text: "Learning to survive is the first step to becoming a great adventurer.",
                        responses: []
                    }
                },
                startNode: 'default_dialogue'
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
        activities: [
            {
                type: 'npc',
                name: 'Baker',
                icon: '/assets/npcChatHeads/baker.png',
                dialogue: {
                    in_progress_embrune_101_3: {
                        npcName: 'Baker',
                        npcIcon: '/assets/npcChatHeads/baker.png',
                        text: "Hello there! The Survival Guide sent you? Wonderful! Cooking on a fire is fine, but a real range is much better. I'll teach you to make bread from scratch. First, take this bucket and gather some wheat from the field.",
                        highlight: 'activity-button-1',
                        responses: [{ text: "Got it! Fill bucket, mix flour to make dough then cook it.", actions: [{ type: 'give_item', itemId: 'bucket', quantity: 1 }, { type: 'advance_quest', questId: 'embrune_101' }] }]
                    },
                    in_progress_embrune_101_4: {
                        npcName: 'Baker',
                        npcIcon: '/assets/npcChatHeads/baker.png',
                        text: "Making bread is a process. Let me know what step you're on if you need help.",
                        responses: [
                            { text: "I'm a bit lost. Can you explain again?", next: 'baker_guide_full_explanation' }
                        ],
                        conditionalResponses: [
                            { text: "I have the wheat. What's next?", check: { requirements: [{ type: 'items', items: [{ itemId: 'wheat', quantity: 1 }] }], successNode: 'baker_guide_mill', failureNode: 'baker_guide_fail_wheat' } },
                            { text: "I've milled the flour. Now what?", check: { requirements: [{ type: 'world_state', property: 'windmillFlour', value: 1, operator: 'gte' }], successNode: 'baker_guide_collect', failureNode: 'baker_guide_fail_mill' } },
                            { text: "I have the flour. What do I do with it?", check: { requirements: [{ type: 'items', items: [{ itemId: 'flour', quantity: 1 }] }], successNode: 'baker_guide_dough', failureNode: 'baker_guide_fail_flour' } },
                            { text: "I've made the dough. What's the last step?", check: { requirements: [{ type: 'items', items: [{ itemId: 'bread_dough', quantity: 1 }] }], successNode: 'baker_guide_bake', failureNode: 'baker_guide_fail_dough' } },
                        ]
                    },
                    in_progress_embrune_101_5: {
                        npcName: 'Baker',
                        npcIcon: '/assets/npcChatHeads/baker.png',
                        text: "Smells delicious! You're a natural. There's more to learn than just skills. Head south and speak to the Information Guide. She'll teach you about your interface.",
                        responses: [{ text: "Thanks for the lesson!", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
                    },
                    // Guidance Nodes
                    baker_guide_mill: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "Excellent! Now mill it into flour at the windmill. Long-press or right-click the windmill to see all actions.", highlight: 'activity-button-2', responses: [] },
                    baker_guide_collect: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "Great job! The flour is in the hopper. Click 'Collect Flour' on the windmill to get it.", highlight: 'activity-button-2', responses: [] },
                    baker_guide_dough: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "Perfect! Now fill your bucket at the well. Then, 'Use' the bucket of water on your flour in your inventory to make dough.", highlight: ['inventory-slot-bucket_of_water', 'inventory-slot-flour'], responses: [] },
                    baker_guide_bake: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "You're so close! Just 'Use' that dough on the cooking range right here to bake your bread.", highlight: ['inventory-slot-bread_dough', 'activity-button-3'], responses: [] },
                    baker_guide_full_explanation: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "Of course! Gather wheat. Mill it. Collect the flour. Add water to make dough. Finally, bake the dough on the range.", responses: [] },
                    // Failure Nodes
                    baker_guide_fail_wheat: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "You need wheat first. Gather it from the field.", highlight: 'activity-button-1', responses: [] },
                    baker_guide_fail_mill: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "You need to mill your wheat into flour at the windmill first.", highlight: 'activity-button-2', responses: [] },
                    baker_guide_fail_flour: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "You need to collect the flour from the windmill's hopper.", highlight: 'activity-button-2', responses: [] },
                    baker_guide_fail_dough: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "You need to make dough by combining flour with a bucket of water.", highlight: ['inventory-slot-bucket_of_water', 'inventory-slot-flour'], responses: [] },
                    
                    default_dialogue: {
                        npcName: 'Baker',
                        npcIcon: '/assets/npcChatHeads/baker.png',
                        text: "Nothing beats the smell of freshly baked bread.",
                        responses: []
                    }
                },
                startNode: 'default_dialogue'
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
        connections: ['tutorial_baking_area', 'tutorial_mine'],
        activities: [
            {
                type: 'npc',
                name: 'Information Guide',
                icon: '/assets/npcChatHeads/information_guide.png',
                dialogue: {
                    in_progress_embrune_101_6: {
                        npcName: 'Information Guide',
                        npcIcon: '/assets/npcChatHeads/information_guide.png',
                        text: "Greetings. The Baker sent you? Good. Knowing skills is one thing, but knowing your purpose is another. This is your Quest Journal. It will help you track your progress.",
                        highlight: 'side-panel-button-quests',
                        responses: [{ text: "Okay, that seems useful.", next: 'info_guide_skills' }]
                    },
                    info_guide_skills: {
                        npcName: 'Information Guide',
                        npcIcon: '/assets/npcChatHeads/information_guide.png',
                        text: "This is your Skills panel. Here you can see your progress in all of Embrune's skills. Click on any skill to open a detailed guide about it.",
                        highlight: 'side-panel-button-skills',
                        responses: [{ text: "I see. What's next?", next: 'info_guide_equipment' }]
                    },
                    info_guide_equipment: {
                        npcName: 'Information Guide',
                        npcIcon: '/assets/npcChatHeads/information_guide.png',
                        text: "This is your Equipment panel. Here you can see what items you have equipped and view your combat stats. Now, take the ladder down into the mine and find the Mining Guide.",
                        highlight: 'side-panel-button-equipment',
                        responses: [{ text: "Down I go!", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
                    },
                    default_dialogue: {
                        npcName: 'Information Guide',
                        npcIcon: '/assets/npcChatHeads/information_guide.png',
                        text: "Knowledge is power, adventurer.",
                        responses: []
                    }
                },
                startNode: 'default_dialogue'
            },
        ],
        regionId: 'path_of_beginnings', x: -42, y: -109,
    },
    tutorial_mine: {
        id: 'tutorial_mine',
        name: 'Tutorial Mine',
        description: 'A small cavern with deposits of copper and tin. A furnace and anvil stand ready for use.',
        connections: ['tutorial_learning_hut', 'tutorial_combat_area'],
        activities: [
            {
                type: 'npc',
                name: 'Mining Guide',
                icon: '/assets/npcChatHeads/mining_guide.png',
                dialogue: {
                    in_progress_embrune_101_7: {
                        npcName: 'Mining Guide',
                        npcIcon: '/assets/npcChatHeads/mining_guide.png',
                        text: "Welcome to the forge! To make anything useful, you need metal. To make bronze, you need one Copper Ore and one Tin Ore. Mine one of each from the rocks here. I've given you a pickaxe.",
                        highlight: ['activity-button-1', 'activity-button-2'],
                        responses: [{ text: "Manual labor again? *sigh* I guess I can do that.", actions: [{ type: 'give_item', itemId: 'bronze_pickaxe', quantity: 1 }, { type: 'advance_quest', questId: 'embrune_101' }] }]
                    },
                    in_progress_embrune_101_8: {
                        npcName: 'Mining Guide',
                        npcIcon: '/assets/npcChatHeads/mining_guide.png',
                        text: "Now that you have your ores, you need to smelt them into a bar. You can do that right here at the furnace.",
                        responses: [
                            { text: "I need a reminder on what to do.", next: 'mining_guide_full_explanation'}
                        ],
                        conditionalResponses: [
                            { text: "I have the ores. What's next?", check: { requirements: [{ type: 'items', items: [{ itemId: 'copper_ore', quantity: 1 }, { itemId: 'tin_ore', quantity: 1 }] }], successNode: 'mining_guide_smelt', failureNode: 'mining_guide_fail_ore' } },
                            { text: "I have the bronze bar. Now what?", check: { requirements: [{ type: 'items', items: [{ itemId: 'bronze_bar', quantity: 1 }] }], successNode: 'mining_guide_smith', failureNode: 'mining_guide_fail_bar' } },
                        ]
                    },
                    in_progress_embrune_101_9: {
                        npcName: 'Mining Guide',
                        npcIcon: '/assets/npcChatHeads/mining_guide.png',
                        text: "Not bad for a first try! Now you have a weapon. Head east to the combat area and speak to the Weapon Guide to learn how to use it.",
                        responses: [{ text: "Time to learn to fight!", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
                    },
                    // Guidance Nodes
                    mining_guide_smelt: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "Excellent! Now, take your ores to the furnace and smelt them into a Bronze Bar. A helpful hint: you can right-click (or long-press on mobile) on objects like furnaces to see more options!", highlight: 'activity-button-3', responses: [] },
                    mining_guide_smith: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "A fine bar! Now for the fun part. Take that bar to the anvil and smith yourself a Bronze Dagger. You'll need a hammer for that.", highlight: 'activity-button-4', responses: [{ text: "(He gives you a Hammer.)", actions: [{ type: 'give_item', itemId: 'hammer', quantity: 1 }] }] },
                    mining_guide_full_explanation: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "Of course! Mine one Copper Ore and one Tin Ore. Then use the furnace to smelt them into a Bronze Bar. Finally, use the anvil to smith the bar into a Bronze Dagger.", responses: [] },
                    // Failure Nodes
                    mining_guide_fail_ore: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "You don't have both ores yet. You need one Copper and one Tin.", highlight: ['activity-button-1', 'activity-button-2'], responses: [] },
                    mining_guide_fail_bar: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "You still need to smelt a Bronze Bar at the furnace.", highlight: 'activity-button-3', responses: [] },

                    default_dialogue: {
                        npcName: 'Mining Guide',
                        npcIcon: '/assets/npcChatHeads/mining_guide.png',
                        text: "From the earth comes the steel that wins battles.",
                        responses: []
                    }
                },
                startNode: 'default_dialogue'
            },
            { type: 'skilling', id: 'tut_mine_copper1', name: 'Mine Copper', skill: SkillName.Mining, requiredLevel: 1, loot: [{ itemId: 'copper_ore', chance: 1, xp: 18 }], resourceCount: { min: 999, max: 999 }, respawnTime: 3000, gatherTime: 1500 },
            { type: 'skilling', id: 'tut_mine_tin1', name: 'Mine Tin', skill: SkillName.Mining, requiredLevel: 1, loot: [{ itemId: 'tin_ore', chance: 1, xp: 18 }], resourceCount: { min: 999, max: 999 }, respawnTime: 3000, gatherTime: 1500 },
            { type: 'furnace' },
            { type: 'anvil' },
        ],
        regionId: 'path_of_beginnings', x: 48, y: -180,
    },
    tutorial_combat_area: {
        id: 'tutorial_combat_area',
        name: 'Combat Area',
        description: 'An area set up for combat practice. Some rats skitter in a cage.',
        connections: ['tutorial_mine', 'tutorial_bank_area'],
        activities: [
            { type: 'npc', name: 'Weapon Guide', icon: '/assets/npcChatHeads/weapon_guide.png', dialogue: {
                in_progress_embrune_101_10: {
                    npcName: 'Weapon Guide',
                    npcIcon: '/assets/npcChatHeads/weapon_guide.png',
                    text: "So, you've made a weapon. Good. But a weapon is useless if you don't know how to wield it. First, you need to equip it. Open your Equipment panel to see what you're wearing.",
                    highlight: 'side-panel-button-equipment',
                    responses: [{ text: "Okay, I see it.", next: 'weapon_guide_explain_stances_10' }]
                },
                weapon_guide_explain_stances_10: {
                    npcName: 'Weapon Guide',
                    npcIcon: '/assets/npcChatHeads/weapon_guide.png',
                    text: "Now, let's talk about how you fight. Open the Combat Styles panel. Here you can choose your attack style. For now, equip your dagger, pick a style, and defeat one of those rats.",
                    highlight: 'side-panel-button-combat',
                    responses: [{ text: "Okay, I'll give it a try.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
                },
                in_progress_embrune_101_11: {
                    npcName: 'Weapon Guide',
                    npcIcon: '/assets/npcChatHeads/weapon_guide.png',
                    text: "You haven't defeated a rat yet. Equip your dagger and fight one with any melee style!",
                    responses: []
                },
                in_progress_embrune_101_12: {
                    npcName: 'Weapon Guide',
                    npcIcon: '/assets/npcChatHeads/weapon_guide.png',
                    text: "Well done. Melee is straightforward. But what about enemies at a distance? For that, you'll need a bow. I'll give you one, along with some arrows. Your next task is to equip them and defeat another rat using a ranged attack.",
                    highlight: ['inventory-slot-shortbow', 'inventory-slot-bronze_arrow', 'equipment-slot-ammo'],
                    responses: [{ text: "Got it, equip bow and arrows, kill rat. Understood!", actions: [{ type: 'give_item', itemId: 'shortbow', quantity: 1 }, { type: 'give_item', itemId: 'bronze_arrow', quantity: 50 }, { type: 'advance_quest', questId: 'embrune_101' }] }]
                },
                in_progress_embrune_101_13: {
                    npcName: 'Weapon Guide',
                    npcIcon: '/assets/npcChatHeads/weapon_guide.png',
                    text: "Equip your bow and arrows, then take down that last rat.",
                    responses: []
                },
                in_progress_embrune_101_14: {
                    npcName: 'Weapon Guide',
                    npcIcon: '/assets/npcChatHeads/weapon_guide.png',
                    text: "You're a natural! You've learned the basics of melee and ranged combat. Now, head north to the next building to learn about banking your items.",
                    responses: [{ text: "On my way.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
                },
                default_dialogue: {
                    npcName: 'Weapon Guide',
                    npcIcon: '/assets/npcChatHeads/weapon_guide.png',
                    text: "The best defense is a good offense. Or is it the other way around?",
                    responses: []
                }
            }, startNode: 'default_dialogue' },
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
        activities: [
            { type: 'npc', name: 'Banker', icon: '/assets/npcChatHeads/banker.png', dialogue: {
                in_progress_embrune_101_15: {
                    npcName: 'Banker',
                    npcIcon: '/assets/npcChatHeads/banker.png',
                    text: "Welcome to the Bank of Embrune. Your inventory is limited, but your bank is not. Here you can store all your items safely. Open the bank and deposit something.",
                    highlight: 'activity-button-2',
                    responses: [{ text: "Okay, I'll try it.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
                },
                in_progress_embrune_101_16: {
                    npcName: 'Banker',
                    npcIcon: '/assets/npcChatHeads/banker.png',
                    text: "You should speak with the Money Guide next to me now. He'll teach you about currency.",
                    responses: []
                },
                default_dialogue: {
                    npcName: 'Banker',
                    npcIcon: '/assets/npcChatHeads/banker.png',
                    text: "Your items are safe with us.",
                    responses: []
                }
            }, startNode: 'default_dialogue' },
            { type: 'npc', name: 'Money Guide', icon: '/assets/npcChatHeads/money_guide.png', dialogue: {
                in_progress_embrune_101_16: {
                    npcName: 'Money Guide',
                    npcIcon: '/assets/npcChatHeads/money_guide.png',
                    text: "Ah, money. It makes the world go 'round. In Embrune, coins can be hard to come by. You get them from quests, selling items to shops, or transmuting them with magic. There are other powers besides wealth. Head east to the chapel and speak to the Prayer Guide.",
                    responses: [{ text: "Will do.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
                },
                default_dialogue: {
                    npcName: 'Money Guide',
                    npcIcon: '/assets/npcChatHeads/money_guide.png',
                    text: "A heavy purse is a great comfort.",
                    responses: []
                }
            }, startNode: 'default_dialogue' },
            { type: 'bank' },
        ],
        regionId: 'path_of_beginnings', x: 267, y: -96,
    },
    tutorial_chapel_area: {
        id: 'tutorial_chapel_area',
        name: 'Chapel Area',
        description: 'A small, peaceful chapel stands in this clearing.',
        connections: ['tutorial_bank_area', 'tutorial_tavern'],
        activities: [
            { type: 'npc', name: 'Prayer Guide', icon: '/assets/npcChatHeads/prayer_guide.png', dialogue: {
                in_progress_embrune_101_17: {
                    npcName: 'Prayer Guide',
                    npcIcon: '/assets/npcChatHeads/prayer_guide.png',
                    text: "Blessings upon you. Prayer is a skill that can protect you. After defeating an enemy, you can bury their bones to gain Prayer experience. Why don't you try burying the rat bones you collected? Once you've done that, head north to the tavern for your next lesson.",
                    highlight: 'inventory-slot-bones',
                    responses: [{ text: "Okay, I understand.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
                },
                in_progress_embrune_101_18: {
                    npcName: 'Prayer Guide',
                    npcIcon: '/assets/npcChatHeads/prayer_guide.png',
                    text: "You should head to the tavern to continue your training.",
                    responses: []
                },
                default_dialogue: {
                    npcName: 'Prayer Guide',
                    npcIcon: '/assets/npcChatHeads/prayer_guide.png',
                    text: "May your path be guided by light.",
                    responses: []
                }
            }, startNode: 'default_dialogue' },
        ],
        regionId: 'path_of_beginnings', x: 257, y: 54,
    },
    tutorial_tavern: {
        id: 'tutorial_tavern',
        name: 'Tutorial Tavern',
        description: 'A cozy tavern. A manager, a magic guide, and a quest board offer opportunities.',
        connections: ['tutorial_chapel_area'],
        activities: [
            { type: 'npc', name: 'Tavern Manager', icon: '/assets/npcChatHeads/barkeep_grimley.png', dialogue: {
                in_progress_embrune_101_18: {
                    npcName: 'Tavern Manager',
                    npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                    text: "Welcome to the inn! A fine place to rest or find work. See that board? That's a Quest Board. It has tasks for adventurers like you. There's a special one just for you. Go on, check the board and accept the 'Magical Pest Control' task.",
                    highlight: 'activity-button-2',
                    responses: [{ text: "I'll check it out.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
                },
                in_progress_embrune_101_19: {
                    npcName: 'Tavern Manager',
                    npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                    text: "The board is right over there. Just accept the 'Magical Pest Control' task.",
                    highlight: 'activity-button-2',
                    responses: []
                },
                in_progress_embrune_101_20: {
                    npcName: 'Tavern Manager',
                    npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                    text: "You've accepted the task! Now, to complete it, you'll need to learn about magic. Speak with the Magic Guide over there. He'll get you started.",
                    responses: [{ text: "I'll go talk to him." }]
                },
                in_progress_embrune_101_22: {
                    npcName: 'Tavern Manager',
                    npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                    text: "You've proven yourself a capable adventurer. You have learned all there is to know. Head back to the Magic Guide. He has one last thing to teach you.",
                    responses: [{ text: "Right away.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
                },
                default_dialogue: {
                    npcName: 'Tavern Manager',
                    npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                    text: "Looking for a room or some work?",
                    responses: []
                }
            }, startNode: 'default_dialogue' },
            { type: 'npc', name: 'Magic Guide', icon: '/assets/npcChatHeads/wizard_elmsworth.png', dialogue: {
                in_progress_embrune_101_20: {
                    npcName: 'Magic Guide',
                    npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                    text: "So, you want to learn magic? It is a powerful art, fueled by runes. I will give you what you need. Take these runes and use our most basic combat spell, Gust Dart, to defeat the rat in the corner.",
                    highlight: ['side-panel-button-spellbook', 'activity-button-3'],
                    responses: [{ text: "Thanks, I'll try to kill that rat with magic now.", actions: [{ type: 'give_item', itemId: 'gust_rune', quantity: 40 }, { type: 'give_item', itemId: 'binding_rune', quantity: 40 }, { type: 'advance_quest', questId: 'embrune_101' }] }]
                },
                in_progress_embrune_101_22: {
                    npcName: 'Magic Guide',
                    npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                    text: "You did it! Now, return to the Tavern Manager to turn in your task.",
                    responses: []
                },
                in_progress_embrune_101_23: {
                    npcName: 'Magic Guide',
                    npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                    text: "You have learned all the core skills. You are now ready to venture into the world of Embrune. I can teleport you to the town of Meadowdale when you are ready. Your real adventure starts there.",
                    responses: [
                        { text: "I'm ready. Send me to Meadowdale!", actions: [{ type: 'teleport', poiId: 'meadowdale_square' }, { type: 'complete_tutorial' }] },
                        { text: "Not just yet." }
                    ]
                },
                default_dialogue: {
                    npcName: 'Magic Guide',
                    npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                    text: "The arcane arts are a path to great power.",
                    responses: []
                }
            }, startNode: 'default_dialogue' },
            { type: 'quest_board' },
            { type: 'combat', monsterId: 'tutorial_rat' },
        ],
        regionId: 'path_of_beginnings', x: 98, y: 106,
    },
};