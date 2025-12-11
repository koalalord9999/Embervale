
import { Quest, SkillName } from '../../types';

export const embrune101: Quest = {
    id: 'embrune_101',
    name: "Embrune 101",
    description: "A comprehensive guide to help you find your footing in the world of Embrune. Leo and his fellow guides will teach you everything you need to know.",
    startHint: "Speak to Leo the Guide at the Tutorial Entrance.",
    playerStagePerspectives: [
        "Leo has welcomed me. He wants me to speak with the Survival Guide to learn the basics.", // 0
        "The Survival Guide wants me to learn basic survival skills. I need to chop a tree, catch a fish, and cook it.", // 1
        "I've cooked a shrimp. I should show it to the Survival Guide.", // 2
        "I've learned the basics of survival. Now I need to find the Baker to learn about making food from scratch.", // 3
        "The Baker wants me to learn how to bake bread. He gave me a bucket.", // 4
        "I need to gather wheat, mill it into flour, make dough, and bake it into bread on the range. The Baker will guide me.", // 5
        "I've baked bread! The Baker told me to visit the Information Guide.", // 6
        "The Information Guide will teach me about my Quest Journal and other interface elements. Then I should head to the mine.", // 7
        "The Mining Guide wants me to learn smithing. He's given me a pickaxe.", // 8
        "I've forged a dagger! I should show it to the Mining Guide.", // 9
        "The Mining Guide was impressed. Now I need to speak to the Weapon Guide to learn about combat.", // 10
        "I've learned about combat stances. Now I need to defeat a rat using a melee attack.", // 11
        "I've defeated the first rat. I should report back to the Weapon Guide.", // 12
        "The Weapon Guide has given me a bow and arrows. I need to defeat another rat using a Ranged attack.", // 13
        "I've practiced ranged combat. I should speak to the Weapon Guide one last time.", // 14
        "I've finished my combat training. The Weapon Guide sent me to the Banker to learn about item storage.", // 15
        "The Banker explained how the bank works. Now I must speak to the Money Guide.", // 16
        "The chapel is a peaceful place. The Prayer Guide will teach you about powers beyond the physical.", // 17
        "The Prayer Guide told me to bury some bones, and then head to the Tavern.", // 18
        "The Tavern Manager directed me to the Quest Board. I should accept the 'Magical Pest Control' task.", // 19
        "I've accepted the task. Now I must speak with the Magic Guide.", // 20
        "The Magic Guide has given me runes. I need to defeat the rat in the tavern using magic.", // 21
        "I've defeated the rat with magic. Now I need to turn in the task at the Quest Board.", // 22
        "I've completed the task. The Tavern Manager sent me back to the Magic Guide for my final lesson.", // 23
        "I've learned all I can here. I should speak to the Magic Guide to leave the island.", // 24
    ],
    completionSummary: "I've completed my training with all the guides. I've learned about survival, crafting, combat, banking, and even a little magic. I am now ready to explore the world of Embrune.",
    // FIX: Added the missing 'stages' property to the quest definition.
    stages: [
        // Stage 0
        {
            description: "Speak to Leo the Guide at the Tutorial Entrance.",
            requirement: { type: 'talk', poiId: 'tutorial_entrance', npcName: 'Leo the Guide' }
        },
        // Stage 1
        {
            description: "Cook a Raw Shrimp using logs and a tinderbox.",
            requirement: { type: 'gather', itemId: 'cooked_shrimp', quantity: 1 }
        },
        // Stage 2
        {
            description: "Show your cooked shrimp to the Survival Guide.",
            requirement: { type: 'talk', poiId: 'tutorial_survival_grounds', npcName: 'Survival Guide' }
        },
        // Stage 3
        {
            description: "Find the Baker in the baking area.",
            requirement: { type: 'talk', poiId: 'tutorial_baking_area', npcName: 'Baker' }
        },
        // Stage 4
        {
            description: "Bake a loaf of bread.",
            requirement: { type: 'gather', itemId: 'bread', quantity: 1 }
        },
        // Stage 5
        {
            description: "Show the bread to the Baker.",
            requirement: { type: 'talk', poiId: 'tutorial_baking_area', npcName: 'Baker' }
        },
        // Stage 6
        {
            description: "Visit the Information Guide in the learning hut.",
            requirement: { type: 'talk', poiId: 'tutorial_learning_hut', npcName: 'Information Guide' }
        },
        // Stage 7
        {
            description: "Go to the mine and speak to the Mining Guide.",
            requirement: { type: 'talk', poiId: 'tutorial_mine', npcName: 'Mining Guide' }
        },
        // Stage 8
        {
            description: "Smith a Bronze Dagger.",
            requirement: { type: 'smith', itemId: 'bronze_dagger', quantity: 1 }
        },
        // Stage 9
        {
            description: "Show the Bronze Dagger to the Mining Guide.",
            requirement: { type: 'talk', poiId: 'tutorial_mine', npcName: 'Mining Guide' }
        },
        // Stage 10
        {
            description: "Speak with the Weapon Guide in the combat area.",
            requirement: { type: 'talk', poiId: 'tutorial_combat_area', npcName: 'Weapon Guide' }
        },
        // Stage 11
        {
            description: "Defeat a rat using a melee attack.",
            requirement: { type: 'kill', monsterId: 'tutorial_rat', quantity: 1, style: 'melee' }
        },
        // Stage 12
        {
            description: "Report back to the Weapon Guide.",
            requirement: { type: 'talk', poiId: 'tutorial_combat_area', npcName: 'Weapon Guide' }
        },
        // Stage 13
        {
            description: "Defeat a rat using a Ranged attack.",
            requirement: { type: 'kill', monsterId: 'tutorial_rat', quantity: 1, style: 'ranged' }
        },
        // Stage 14
        {
            description: "Report back to the Weapon Guide.",
            requirement: { type: 'talk', poiId: 'tutorial_combat_area', npcName: 'Weapon Guide' }
        },
        // Stage 15
        {
            description: "Speak to the Banker.",
            requirement: { type: 'talk', poiId: 'tutorial_bank_area', npcName: 'Banker' }
        },
        // Stage 16
        {
            description: "Speak to the Money Guide.",
            requirement: { type: 'talk', poiId: 'tutorial_bank_area', npcName: 'Money Guide' }
        },
        // Stage 17
        {
            description: "Speak to the Prayer Guide.",
            requirement: { type: 'talk', poiId: 'tutorial_chapel_area', npcName: 'Prayer Guide' }
        },
        // Stage 18
        {
            description: "Speak to the Tavern Manager.",
            requirement: { type: 'talk', poiId: 'tutorial_tavern', npcName: 'Tavern Manager' }
        },
        // Stage 19
        {
            description: "Accept the task from the Quest Board.",
            requirement: { type: 'accept_repeatable_quest', questId: 'tutorial_magic_rat' }
        },
        // Stage 20
        {
            description: "Speak with the Magic Guide.",
            requirement: { type: 'talk', poiId: 'tutorial_tavern', npcName: 'Magic Guide' }
        },
        // Stage 21
        {
            description: "Defeat the rat using magic.",
            requirement: { type: 'kill', monsterId: 'tutorial_rat', quantity: 1, style: 'magic' }
        },
        // Stage 22
        {
            description: "Report your success to the Tavern Manager.",
            requirement: { type: 'talk', poiId: 'tutorial_tavern', npcName: 'Tavern Manager' }
        },
        // Stage 23
        {
            description: "Receive your final lesson from the Magic Guide.",
            requirement: { type: 'talk', poiId: 'tutorial_tavern', npcName: 'Magic Guide' }
        },
        // Stage 24
        {
            description: "Speak to the Magic Guide to leave the island.",
            requirement: { type: 'talk', poiId: 'tutorial_tavern', npcName: 'Magic Guide' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Attack, amount: 100 }],
        coins: 100
    },
    dialogueEntryPoints: [
        { npcName: 'Leo the Guide', response: { text: "I'm ready to begin my training.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 0 }], successNode: 'in_progress_embrune_101_0', failureNode: '' } } },
        { npcName: 'Survival Guide', response: { text: "What do I do now?", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 1 }], successNode: 'in_progress_embrune_101_1', failureNode: '' } } },
        { npcName: 'Survival Guide', response: { text: "I've cooked the shrimp.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 2 }], successNode: 'in_progress_embrune_101_2', failureNode: '' } } },
        { npcName: 'Baker', response: { text: "The Survival Guide sent me.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 3 }], successNode: 'in_progress_embrune_101_3', failureNode: '' } } },
        { npcName: 'Baker', response: { text: "I need help with making bread.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 4 }], successNode: 'in_progress_embrune_101_4', failureNode: '' } } },
        { npcName: 'Baker', response: { text: "I've baked the bread!", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 5 }], successNode: 'in_progress_embrune_101_5', failureNode: '' } } },
        { npcName: 'Information Guide', response: { text: "The Baker sent me to learn about my journal.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 6 }], successNode: 'in_progress_embrune_101_6', failureNode: '' } } },
        { npcName: 'Mining Guide', response: { text: "I'm here to learn about mining and smithing.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 7 }], successNode: 'in_progress_embrune_101_7', failureNode: '' } } },
        { npcName: 'Mining Guide', response: { text: "How do I make a dagger?", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 8 }], successNode: 'in_progress_embrune_101_8', failureNode: '' } } },
        { npcName: 'Mining Guide', response: { text: "I've forged the dagger.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 9 }], successNode: 'in_progress_embrune_101_9', failureNode: '' } } },
        { npcName: 'Weapon Guide', response: { text: "The Mining Guide sent me for combat training.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 10 }], successNode: 'in_progress_embrune_101_10', failureNode: '' } } },
        { npcName: 'Weapon Guide', response: { text: "I defeated the rat with melee.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 12 }], successNode: 'in_progress_embrune_101_12', failureNode: '' } } },
        { npcName: 'Weapon Guide', response: { text: "I defeated the rat with ranged.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 14 }], successNode: 'in_progress_embrune_101_14', failureNode: '' } } },
        { npcName: 'Banker', response: { text: "I'm here to learn about the bank.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 15 }], successNode: 'in_progress_embrune_101_15', failureNode: '' } } },
        { npcName: 'Money Guide', response: { text: "I'm here to learn about money.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 16 }], successNode: 'in_progress_embrune_101_16', failureNode: '' } } },
        { npcName: 'Prayer Guide', response: { text: "I'm here to learn about Prayer.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 17 }], successNode: 'in_progress_embrune_101_17', failureNode: '' } } },
        { npcName: 'Tavern Manager', response: { text: "The Prayer Guide sent me.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 18 }], successNode: 'in_progress_embrune_101_18', failureNode: '' } } },
        { npcName: 'Tavern Manager', response: { text: "I've completed the task from the board.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 22 }], successNode: 'in_progress_embrune_101_22', failureNode: '' } } },
        { npcName: 'Magic Guide', response: { text: "I've accepted the task. I'm ready to learn magic.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 20 }], successNode: 'in_progress_embrune_101_20', failureNode: '' } } },
        { npcName: 'Magic Guide', response: { text: "I'm ready for my final lesson.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 23 }], successNode: 'in_progress_embrune_101_23', failureNode: '' } } },
        { npcName: 'Magic Guide', response: { text: "I am ready to leave.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 24 }], successNode: 'in_progress_embrune_101_23', failureNode: '' } } }
    ],
    dialogue: {
        in_progress_embrune_101_0: {
            npcName: 'Leo the Guide',
            npcIcon: '/assets/npcChatHeads/leo_the_guide.png',
            text: "Welcome to Embrune! This is a tutorial area to teach you the basics. To progress, you'll need to speak with the guides in each area. Follow the path and speak to the Survival Guide to begin.",
            responses: [
                { text: "Got it. Talk to the guides.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] },
                { text: "I've played games like this before, can I skip the tutorial?", next: 'skip_tutorial_confirm' }
            ]
        },
        skip_tutorial_confirm: {
            npcName: 'Leo the Guide',
            npcIcon: '/assets/npcChatHeads/leo_the_guide.png',
            text: "Are you sure? This tutorial teaches you some core mechanics. If you skip, you'll be teleported directly to the town of Meadowdale.",
            responses: [
                { text: "Yes, I'm sure. To Meadowdale!", actions: [{ type: 'complete_tutorial' }, { type: 'teleport', poiId: 'meadowdale_square' }] },
                { text: "On second thought, I'll do the tutorial." }
            ]
        },
        post_quest_embrune_101: {
            npcName: 'Leo the Guide',
            npcIcon: '/assets/npcChatHeads/leo_the_guide.png',
            text: "You're all set! Good luck on your adventures!",
            responses: []
        },
        in_progress_embrune_101_1: {
            npcName: 'Survival Guide',
            npcIcon: '/assets/npcChatHeads/survival_guide.png',
            text: "An adventurer who can't feed themselves is a dead adventurer. Your first task: chop a tree for logs, and catch a raw shrimp from the fishing spot. Come back to me when you have both.",
            responses: [],
            conditionalResponses: [
                { text: "I have the logs and the shrimp. What now?", check: { requirements: [{ type: 'items', items: [{ itemId: 'logs', quantity: 1 }, { itemId: 'raw_shrimp', quantity: 1 }] }], successNode: 'survival_guide_cook', failureNode: 'survival_guide_fail_both' } },
                { text: "I have the logs. What's next?", check: { requirements: [{ type: 'items', items: [{ itemId: 'logs', quantity: 1 }, {itemId: 'raw_shrimp', quantity: 0, operator: 'eq'}] }], successNode: 'survival_guide_fish', failureNode: 'survival_guide_fail_logs' } },
                { text: "I don't have the tools for that.", check: { requirements: [{ type: 'items', items: [{ itemId: 'bronze_axe', quantity: 0, operator: 'eq' }] }], successNode: 'survival_guide_give_tools', failureNode: 'survival_guide_has_tools' } }
            ]
        },
        survival_guide_give_tools: {
            npcName: 'Survival Guide',
            npcIcon: '/assets/npcChatHeads/survival_guide.png',
            text: "Right, you'll need these. Here's an axe for chopping and a tinderbox for making a fire. Your first step is to chop down a tree to get some logs.",
            highlight: 'activity-button-1',
            responses: [{ text: "Time to get to work.", actions: [{ type: 'give_item', itemId: 'bronze_axe', quantity: 1 }, { type: 'give_item', itemId: 'tinderbox', quantity: 1 }, { type: 'give_item', itemId: 'small_fishing_net', quantity: 1 }] }]
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
                { text: "(Take the Small Fishing Net)", check: { requirements: [{ type: 'items', items: [{ itemId: 'small_fishing_net', quantity: 0, operator: 'eq' }] }], successNode: 'survival_guide_give_net_action', failureNode: 'survival_guide_has_net' } }
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
            text: "Excellent. To make a fire, 'Use' your Tinderbox on your Logs. Then, to cook, 'Use' your Raw Shrimp on the fire. This item-on-item interaction is a key skill to learn. Try it now.",
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
        in_progress_embrune_101_3: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "Hello there! The Survival Guide sent you? Wonderful! Cooking on a fire is fine, but a real range is much better. I'll teach you to make bread from scratch. First, take this bucket and gather some wheat from the field.",
            highlight: 'activity-button-1',
            responses: [{ text: "Got it! Wheat, mill, flour, dough, then bake.", actions: [{ type: 'give_item', itemId: 'bucket', quantity: 1 }, { type: 'advance_quest', questId: 'embrune_101' }] }]
        },
        in_progress_embrune_101_4: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "How's the baking coming along? Let me know if you need a hand.",
            responses: [
                { text: "I'm a bit lost. Can you walk me through it?", next: 'baker_walkthrough_1' }
            ],
            conditionalResponses: [
                { text: "", check: { requirements: [{ type: 'items', items: [{ itemId: 'bread_dough', quantity: 1 }] }], successNode: 'baker_hint_bake', failureNode: '' } },
                { text: "", check: { requirements: [{ type: 'items', items: [{ itemId: 'flour', quantity: 1 }] }], successNode: 'baker_hint_dough', failureNode: '' } },
                { text: "", check: { requirements: [{ type: 'world_state', property: 'windmillFlour', value: 1, operator: 'gte' }], successNode: 'baker_hint_collect', failureNode: '' } },
                { text: "", check: { requirements: [{ type: 'items', items: [{ itemId: 'wheat', quantity: 1 }] }], successNode: 'baker_hint_mill', failureNode: 'baker_hint_wheat' } },
            ]
        },
        baker_hint_bake: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "You've made the dough! This next part is another key skill: using an item on an object in the world. Just 'Use' your dough on the 'Cooking Range' to bake it.", responses: [], highlight: ['inventory-slot-bread_dough', 'activity-button-3'] },
        baker_hint_dough: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "Perfect, you have the flour. Now fill your bucket with water from the 'Fill Container' source, then 'Use' the 'Bucket of Water' on your flour in your inventory.", responses: [], highlight: ['inventory-slot-bucket', 'activity-button-4', 'inventory-slot-flour'] },
        baker_hint_collect: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "Great, you've milled the wheat! The flour is in the hopper. Just press the 'Collect Flour' button on the windmill to get it.", responses: [], highlight: 'activity-button-2' },
        baker_hint_mill: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "Excellent, you have the wheat. Now, 'long-press' or 'right-click' the 'Windmill' and select 'Mill Wheat' to grind it into flour.", responses: [], highlight: ['inventory-slot-wheat', 'activity-button-2'] },
        baker_hint_wheat: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "You need to start with some wheat. Just click the 'Harvest Wheat' button in the field over there.", responses: [], highlight: 'activity-button-1' },
        baker_walkthrough_1: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "Of course! First, you need wheat. Just 'click' on the 'Harvest Wheat' button over in the field to gather some.",
            highlight: 'activity-button-1',
            responses: [
                { text: "Okay, what's next?", next: 'baker_walkthrough_2' },
                { text: "Got it." }
            ]
        },
        baker_walkthrough_2: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "Now, take the wheat to the windmill. 'Long-press' or 'right-click' on the windmill and select 'Mill Wheat'. This will add your wheat to the hopper.",
            highlight: ['inventory-slot-wheat', 'activity-button-2'],
            responses: [
                { text: "And after that?", next: 'baker_walkthrough_3' },
                { text: "Got it." }
            ]
        },
        baker_walkthrough_3: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "The flour is now in the windmill's hopper. 'Click' the 'Collect Flour' button on the windmill to put it in your inventory.",
            highlight: 'activity-button-2',
            responses: [
                { text: "What do I do with the flour?", next: 'baker_walkthrough_4' },
                { text: "Got it." }
            ]
        },
        baker_walkthrough_4: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "Now for the messy part! Fill your bucket with water from the well by clicking 'Fill Container'. Then, in your inventory, select 'Use' on the 'Bucket of Water', and then click on your 'Sack of Flour'. That'll make dough!",
            highlight: ['activity-button-4', 'inventory-slot-bucket_of_water', 'inventory-slot-flour'],
            responses: [
                { text: "I have the dough. What's the last step?", next: 'baker_walkthrough_5' },
                { text: "Got it." }
            ]
        },
        baker_walkthrough_5: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "The final step! Just 'Use' your 'Bread Dough' on the 'Cooking Range' right here, and you'll have a fresh loaf of bread in no time.",
            highlight: ['inventory-slot-bread_dough', 'activity-button-3'],
            responses: [
                { text: "Thanks for the detailed help!" }
            ]
        },
        in_progress_embrune_101_5: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "Smells delicious! You're a natural. There's more to learn than just skills. Head south and speak to the Information Guide. She'll teach you about your interface.",
            responses: [{ text: "Thanks for the lesson!", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
        },
        in_progress_embrune_101_6: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "Oh did he now? Good. Knowing skills is one thing, but knowing your purpose is another. This is your Quest Journal. It will help you track your progress.",
            highlight: 'side-panel-button-quests',
            responses: [{ text: "Okay, that seems useful.", next: 'info_guide_skills' }]
        },
        info_guide_skills: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "This is your Skills panel. Here you can see your progress. Nearly every action grants you Experience Points, or 'XP', which raises your levels. You can click on any skill to open a detailed guide about what you can do at each level.",
            highlight: 'side-panel-button-skills',
            responses: [{ text: "I see. What's next?", next: 'info_guide_equipment' }]
        },
        info_guide_equipment: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "This is your Equipment panel. Here you can see your combat stats and equip items to make yourself stronger.",
            highlight: 'side-panel-button-equipment',
            responses: [{ text: "What's that other orb on the minimap?", next: 'info_guide_run_energy' }]
        },
        info_guide_run_energy: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "An observant one! That's your Run Energy, represented by the boot icon. It's tied to a new skill you've just unlocked: Agility. Run energy allows you to travel faster between locations.",
            highlight: 'run-energy-orb',
            responses: [{ text: "How does it work?", next: 'info_guide_run_energy_2' }]
        },
        info_guide_run_energy_2: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "When run is toggled on, you move instantly, but it consumes energy. When you run out, you'll walk until it recharges. Your Agility level determines how quickly it recharges. You can toggle it by clicking the orb.",
            highlight: 'run-energy-orb',
            responses: [{ text: 'Are there other ways to restore the energy faster?', next: 'info_guide_run_energy_3' }]
        },
        info_guide_run_energy_3: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "Of course! There are a few distinct ways to restore the energy. You can drink an energy potion crafted with Herblore, or you can 'right-click' the run orb and select Rest.",
            highlight: 'run-energy-orb',
            responses: [{ text: "I understand. Now, where to next?", next: 'info_guide_to_mine' }]
        },
        info_guide_to_mine: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "You've learned a lot! Now, take the ladder down into the mine and find the Mining Guide. He'll teach you about smithing.",
            highlight: 'activity-button-1',
            responses: [{ text: "Down I go!", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
        },
        in_progress_embrune_101_7: {
            npcName: 'Mining Guide',
            npcIcon: '/assets/npcChatHeads/mining_guide.png',
            text: "So you're the new adventurer. Good to see some fresh muscle. To make a simple Bronze Bar, you'll need one Copper Ore and one Tin Ore. Mine them from the rocks here. I've given you a pickaxe to get started.",
            highlight: ['activity-button-1', 'activity-button-2'],
            responses: [{ text: "Time to get my hands dirty.", actions: [{ type: 'give_item', itemId: 'bronze_pickaxe', quantity: 1 }, { type: 'advance_quest', questId: 'embrune_101' }] }]
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
        mining_guide_smelt: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "Excellent! Now, take your ores to the furnace and smelt them into a Bronze Bar. A helpful hint: you can right-click (or long-press on mobile) on objects like furnaces to see more options!", highlight: 'activity-button-3', responses: [] },
        mining_guide_smith: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "A fine bar! Now for the fun part. Take that bar to the anvil and smith yourself a Bronze Dagger. You'll need a hammer for that.", highlight: 'activity-button-4', responses: [{ text: "(He gives you a Hammer.)", actions: [{ type: 'give_item', itemId: 'hammer', quantity: 1 }] }] },
        mining_guide_full_explanation: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "Of course! Mine one Copper Ore and one Tin Ore. Then use the furnace to smelt them into a Bronze Bar. Finally, use the anvil to smith the bar into a Bronze Dagger.", responses: [] },
        mining_guide_fail_ore: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "You don't have both ores yet. You need one Copper and one Tin.", highlight: ['activity-button-1', 'activity-button-2'], responses: [] },
        mining_guide_fail_bar: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "You still need to smelt a Bronze Bar at the furnace.", highlight: 'activity-button-3', responses: [] },
        in_progress_embrune_101_10: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "The Mining Guide sent you, eh? He said you forged a decent dagger. Let's see if you can use it. First, open your equipment panel and equip it.",
            highlight: 'side-panel-button-equipment',
            responses: [{ text: "Okay, I see it.", next: 'weapon_guide_explain_stances_10' }]
        },
        weapon_guide_explain_stances_10: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "Now, open the Combat Styles panel. Your stance determines how you train. 'Accurate' trains Attack, 'Aggressive' trains Strength, and 'Defensive' trains Defence. All styles train Hitpoints. Now, pick one and defeat a rat.",
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
            text: "Well done. Melee is straightforward. Now for ranged. Take this bow and arrows. To use them, you MUST equip the arrows in your ammo slot on the Equipment panel. Then, take down the other rat.",
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
        in_progress_embrune_101_15: {
            npcName: 'Banker',
            npcIcon: '/assets/npcChatHeads/banker.png',
            text: "Ah, the new adventurer. The Weapon Guide sent word you were coming. It's wise to learn about finances early. Your inventory is limited, but your bank vault is not. Here you can store all your items safely. Would you like me to open your vault?",
            highlight: 'activity-button-0',
            responses: [
                { text: "Yes, I'd like to try.", actions: [{ type: 'open_bank' }, { type: 'advance_quest', questId: 'embrune_101' }] },
                { text: "Not right now." }
            ]
        },
        in_progress_embrune_101_16: {
            npcName: 'Money Guide',
            npcIcon: '/assets/npcChatHeads/money_guide.png',
            text: "Money you say? You've come to right person! Coins are the lifeblood of trade. You can get them from quests or by selling resources. A good way to earn your first hundred is to sell things like cowhides from the ranch, or even just the fish you catch. Every little bit helps! Now, head east to the chapel to learn of other powers.",
            responses: [{ text: "Will do.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
        },
        in_progress_embrune_101_17: {
            npcName: 'Prayer Guide',
            npcIcon: '/assets/npcChatHeads/prayer_guide.png',
            text: "Welcome, child. The other guides have taught you of the body. I am here to teach you of the spirit. Prayer is your connection to the divine, allowing you to invoke powerful auras to aid you.",
            responses: [
                { text: "How do I train it?", next: 'prayer_guide_train' }
            ]
        },
        prayer_guide_train: {
            npcName: 'Prayer Guide',
            npcIcon: '/assets/npcChatHeads/prayer_guide.png',
            text: "The simplest way to train is to honor the dead by burying their bones. Here, I have some from the rats you defeated. Bury them now by clicking on them in your inventory, then speak to me again.",
            responses: [],
            conditionalResponses: [
                { text: "I've buried the bones.", check: { requirements: [{ type: 'items', items: [{ itemId: 'bones', quantity: 0, operator: 'eq' }] }], successNode: 'prayer_guide_explain_2', failureNode: 'prayer_guide_bury_reminder' } }
            ]
        },
        prayer_guide_bury_reminder: {
            npcName: 'Prayer Guide',
            npcIcon: '/assets/npcChatHeads/prayer_guide.png',
            text: "You still have bones to bury. Open your inventory and click on them to pay your respects.",
            highlight: 'inventory-slot-bones',
            responses: []
        },
        prayer_guide_explain_2: {
            npcName: 'Prayer Guide',
            npcIcon: '/assets/npcChatHeads/prayer_guide.png',
            text: "You feel the connection, yes? Good. Now, open your Prayer Panel. You'll see the auras you've unlocked. Activating one, like 'Iron Will', will grant you a benefit, but be warned: active prayers drain your Prayer Points, shown by the blue orb on your minimap. When it's empty, your prayers will cease.",
            highlight: ['side-panel-button-prayer', 'prayer-prayer-iron_will', 'run-energy-orb'],
            responses: [
                { text: "I understand. What's next?", next: 'prayer_guide_final' }
            ]
        },
        prayer_guide_final: {
            npcName: 'Prayer Guide',
            npcIcon: '/assets/npcChatHeads/prayer_guide.png',
            text: "You learn quickly. Your training here is done. Head north to the tavern; the manager there has work for you.",
            responses: [
                { text: "Thank you for the lesson.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        in_progress_embrune_101_18: {
            npcName: 'Tavern Manager',
            npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
            text: "The Prayer Guide sent you? Bless his heart. Welcome to the tavern, the heart of any adventurer's career! A place for rest, refreshment, and most importantly, work.",
            responses: [
                { text: "Tell me about 'rest'.", next: 'tavern_manager_explain_rest' },
                { text: "Tell me about 'work'.", next: 'tavern_manager_explain_work', actions: [{ type: 'advance_quest', questId: 'embrune_101'}]}
            ]
        },
        tavern_manager_explain_rest: {
            npcName: 'Tavern Manager',
            npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
            text: "Aye. Most inns, including this one, offer a bed for the night for a small fee. A good night's sleep will restore your health completely. A lifesaver after a tough battle, eh?",
            responses: [
                { text: "Good to know. What about work?", next: 'tavern_manager_explain_work', actions: [{ type: 'advance_quest', questId: 'embrune_101'}] }
            ]
        },
        tavern_manager_explain_work: {
            npcName: 'Tavern Manager',
            npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
            text: "That's the spirit! See that board? That's a Quest Board. Adventurers like yourself can take on tasks posted by the locals. The tasks here are simple, fit for a beginner. But remember, each town's board is unique, offering different challenges and rewards. It's always worth checking.",
            highlight: 'activity-button-2',
            responses: [
                { text: "I see. I'll check the board now.", next: 'tavern_manager_final' }
            ]
        },
        tavern_manager_final: {
            npcName: 'Tavern Manager',
            npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
            text: "There's a special task just for you. Go on, take a look.",
            responses: [
                { text: "I'll go take a look." }
            ]
        },
        in_progress_embrune_101_19: {
            npcName: 'Tavern Manager',
            npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
            text: "The board is right over there. Just check the posting. Speak with the Magic guide once you've accepted the quest, he'll supply you with what you need.",
            highlight: 'activity-button-2',
            responses: []
        },
        in_progress_embrune_101_20: {
            npcName: 'Magic Guide',
            npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
            text: "Ah, so you've accepted the task. Good. Magic is a powerful art, fueled by consumable stones called runes. Each spell requires a specific combination.",
            responses: [
                { text: "Where do I get more runes?", next: 'magic_guide_explain_runes_1' },
                { text: "How do I complete this task?", next: 'magic_guide_task' }
            ]
        },
        magic_guide_explain_runes_1: {
            npcName: 'Magic Guide',
            npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
            text: "An excellent question! Most adventurers acquire them from the creatures they defeat. Many beasts and monsters across the world seem to be drawn to their energy and carry them. You can also purchase basic runes from magic shops, like the one in Meadowdale.",
            responses: [
                { text: "Can't I just make them myself?", next: 'magic_guide_explain_runes_2' },
                { text: "I understand. Now, about this task...", next: 'magic_guide_task' }
            ]
        },
        magic_guide_explain_runes_2: {
            npcName: 'Magic Guide',
            npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
            text: "Alas, the art of creating runes from raw essence—Runecrafting, as it was called—was lost to history centuries ago. A great tragedy. Perhaps one day, under the right circumstances, it could be rediscovered... but that is a tale for another time.",
            responses: [
                { text: "I understand. Let's focus on the task at hand.", next: 'magic_guide_task' }
            ]
        },
        magic_guide_task: {
            npcName: 'Magic Guide',
            npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
            text: "For now, I will provide what you need. Your task is to defeat the rat in the tavern using our most basic combat spell, 'Gust Dart'. I will give you the runes for it. Open your spellbook to see the spells you know.",
            highlight: ['side-panel-button-spellbook', 'activity-button-3'],
            responses: [
                { text: "Time to cast some spells.", actions: [{ type: 'give_item', itemId: 'gust_rune', quantity: 40 }, { type: 'give_item', itemId: 'binding_rune', quantity: 40 }, { type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        in_progress_embrune_101_22: {
            npcName: 'Tavern Manager',
            npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
            text: "Excellent work with that rat! Magic is a useful tool, isn't it? Head back to the Magic Guide. He has one last thing to teach you.",
            responses: [{ text: "Right away.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
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
        quest_board_embrune_101_19: {
            npcName: 'Quest Board',
            npcIcon: 'https://api.iconify.design/game-icons:papers.svg',
            text: "A hastily scrawled note is pinned to the board:\n\n'Task: Magical Pest Control\n\nA rat in the tavern has been chewing on spellbooks. The Magic Guide wants it dealt with using magic. We need to test you on this, it's very important. Accept this task to proceed with your training.'",
            responses: [
                { text: "Accept Task", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        }
    }
};
