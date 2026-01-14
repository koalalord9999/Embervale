import { Quest, SkillName } from '../../types';

export const embrune101: Quest = {
    id: 'embrune_101',
    name: "Embrune 101",
    description: "A comprehensive guide to help you find your footing in the world of Embrune. Leo and his fellow guides will teach you everything you need to know.",
    startHint: "Speak to Leo the Guide at the Tutorial Entrance.",
    playerStagePerspectives: [
        "I stepped onto the shores of this tutorial island and met Leo. He welcomed me warmly and explained that the path ahead is designed to forge me into a true adventurer through a series of focused lessons from local masters.", // Result of Stage 0
        "I followed Leo's directions and located the Survival Guide in a quiet clearing. He looks like a man who has spent more nights under the stars than under a roof, and he's ready to teach me how to feed myself.", // Result of Stage 1
        "I've successfully harvested wood from the local trees and tried my hand at the fishing spots. I managed to land a few raw shrimp, though they're currently quite unappetizing in their raw state.", // Result of Stage 2
        "Using a campfire I built myself, I've cooked the shrimp to perfection. The Survival Guide was impressed and told me that mastering hunger is the first step to avoiding an early grave on the mainland.", // Result of Stage 3
        "I ventured further into the village and met the town Baker. He's a boisterous fellow who believes that good bread is the foundation of any great civilization, and he's eager to show me how it's done.", // Result of Stage 4
        "I've worked the wheat fields and used the local windmill to grind the grain into fine flour. After mixing it with water, I've prepared a batch of dough that's ready for the oven.", // Result of Stage 5
        "The Baker's range is a marvel of masonry. I've baked a fresh loaf of bread, and the aroma alone makes all that work worth it. The Baker says I have a natural talent for the culinary arts.", // Result of Stage 6
        "I visited the Information Guide in her quiet hut. She gave me a thorough tour of my journal, explaining how to track my skills, equipment, and current objectives through the magical interface I carry.", // Result of Stage 7
        "I've descended the ladder into the tutorial mines. The air is cool and smells of iron and dust. I've located the Mining Guide, who seems more interested in stones than people.", // Result of Stage 8
        "Mining is hard work, but rewarding. I've extracted samples of Copper and Tin from the ancient rock veins, learning how to identify the subtle glint of metal in the raw earth.", // Result of Stage 9
        "The heat of the furnace was intense, but I successfully combined the Copper and Tin ores to create a solid Bronze Bar. It's my first piece of refined metal, and it feels heavy with potential.", // Result of Stage 10
        "The ring of the hammer on the anvil is a satisfying sound. I've forged a Bronze Dagger, my very first weapon. It's simple, but the edge is sharp and the balance is surprisingly good.", // Result of Stage 11
        "The Mining Guide gave my dagger a quick inspection and a rare nod of approval. He told me that a weapon you make yourself is one you can always trust.", // Result of Stage 12
        "I found the Weapon Guide in the combat training grounds. He has the scarred look of a veteran soldier and a no-nonsense attitude toward the art of war.", // Result of Stage 13
        "I've tested my steel against the local giant rats. Using my dagger in close quarters, I've proven that I have the strength and accuracy needed for melee combat.", // Result of Stage 14
        "The Master taught me that combat is more than just swinging a blade; it's about your stance. I've learned how different styles of fighting will shape my physical growth over time.", // Result of Stage 15
        "I've switched to a shortbow and demonstrated my accuracy from a distance. The rats didn't stand a chance against my arrows, and I've learned the value of striking before an enemy can close the gap.", // Result of Stage 16
        "My physical combat training is complete. The Weapon Master believes I am capable of defending myself, whether with a blade in my hand or an arrow on the string.", // Result of Stage 17
        "I visited the local bank, a secure sanctuary where I can store my valuables. The Banker explained that no matter where I travel in Embrune, my items will be safe and accessible from any branch.", // Result of Stage 18
        "The Money Guide gave me a lesson on the flow of coins. I've learned that every resource has a price, and that trade is just as important as combat for a rising adventurer.", // Result of Stage 19
        "I reached the quiet, ivy-covered chapel and spoke with the Prayer Guide. He spoke of the spiritual energy that flows through all things and how an adventurer can tap into it.", // Result of Stage 20
        "I've learned to pay my respects to the fallen by burying their remains. It's a somber task, but I felt a strange, calming connection to the divine as I did so.", // Result of Stage 21
        "The Prayer Guide showed me how to channel that spiritual connection into powerful auras. He says that faith can be just as strong as any suit of plate armor.", // Result of Stage 22
        "I reached the local tavern, a bustling hub where the scent of ale and the sound of gossip fill the air. The Manager greeted me and mentioned that there's always work for those who seek it.", // Result of Stage 23
        "I've taken a look at the tavern's quest board and accepted a contract. It's my first piece of professional work, and I'm eager to prove my reliability.", // Result of Stage 24
        "I spoke with the Magic Guide, an eccentric wizard who sees the world in patterns of arcane energy. He's provided me with the runes needed to practice my first spells.", // Result of Stage 25
        "Magic is exhilarating! I channeled raw elemental power through my fingertips to defeat a tavern rat. The air crackled with ozone, and I felt the incredible potential of the Weave.", // Result of Stage 26
        "The Tavern Manager was pleased to see his rodent problem resolved. He noted that I'm becoming quite the versatile adventurer, capable of handling any situation.", // Result of Stage 27
        "The Magic Guide gave me one final lesson, speaking of the vast cities and dangerous dungeons that await me on the mainland. He says my training here is only the beginning.", // Result of Stage 28
        "I've learned everything the guides of this island have to offer. I feel strong, capable, and ready. It is time to leave this sanctuary and begin my true journey in the world of Embrune." // Result of Stage 29
    ],
    completionSummary: "I've completed my comprehensive training on the tutorial island. From the basics of survival and cooking to the complexities of smithing, combat, and magic, I have been well-prepared by the local masters. I am now ready to set foot on the mainland and make my mark on the world.",
    stages: [
        { description: "Speak to Leo the Guide at the Entrance.", requirement: { type: 'talk', poiId: 'tutorial_entrance', npcName: 'Leo the Guide' } }, // 0
        { description: "Find the Survival Guide down the path.", requirement: { type: 'talk', poiId: 'tutorial_survival_grounds', npcName: 'Survival Guide' } }, // 1
        { description: "Chop a tree for logs and catch a raw shrimp.", requirement: { type: 'gather', items: [{itemId: 'logs', quantity: 1}, {itemId: 'raw_shrimp', quantity: 1}] } }, // 2
        { description: "Cook the shrimp and show it to the Survival Guide.", requirement: { type: 'talk', poiId: 'tutorial_survival_grounds', npcName: 'Survival Guide' } }, // 3
        { description: "Locate the Baker in the area past the survival grounds.", requirement: { type: 'talk', poiId: 'tutorial_baking_area', npcName: 'Baker' } }, // 4
        { description: "Harvest wheat and prepare some bread dough.", requirement: { type: 'gather', items: [{itemId: 'bread_dough', quantity: 1}] } }, // 5
        { description: "Bake the bread and show it to the Baker.", requirement: { type: 'talk', poiId: 'tutorial_baking_area', npcName: 'Baker' } }, // 6
        { description: "Visit the Information Guide in the learning hut.", requirement: { type: 'talk', poiId: 'tutorial_learning_hut', npcName: 'Information Guide' } }, // 7
        { description: "Go to the mine and find the Mining Guide.", requirement: { type: 'talk', poiId: 'tutorial_mine', npcName: 'Mining Guide' } }, // 8
        { description: "Mine 1 Copper Ore and 1 Tin Ore.", requirement: { type: 'gather', items: [{itemId: 'copper_ore', quantity: 1}, {itemId: 'tin_ore', quantity: 1}] } }, // 9
        { description: "Use the furnace to smelt a Bronze Bar.", requirement: { type: 'gather', itemId: 'bronze_bar', quantity: 1 } }, // 10
        { description: "Use the anvil to smith a Bronze Bar into a Bronze Dagger.", requirement: { type: 'smith', itemId: 'bronze_dagger', quantity: 1 } }, // 11
        { description: "Show the Bronze Dagger to the Mining Guide.", requirement: { type: 'talk', poiId: 'tutorial_mine', npcName: 'Mining Guide' } }, // 12
        { description: "Seek out the Weapon Guide in the combat area.", requirement: { type: 'talk', poiId: 'tutorial_combat_area', npcName: 'Weapon Guide' } }, // 13
        { description: "Equip your dagger and defeat a rat with a melee attack.", requirement: { type: 'kill', monsterId: 'tutorial_rat', quantity: 1, style: 'melee' } }, // 14
        { description: "Report your melee victory to the Weapon Guide.", requirement: { type: 'talk', poiId: 'tutorial_combat_area', npcName: 'Weapon Guide' } }, // 15
        { description: "Equip the bow and defeat a rat with a ranged attack.", requirement: { type: 'kill', monsterId: 'tutorial_rat', quantity: 1, style: 'ranged' } }, // 16
        { description: "Report your ranged victory to the Weapon Guide.", requirement: { type: 'talk', poiId: 'tutorial_combat_area', npcName: 'Weapon Guide' } }, // 17
        { description: "Speak to the Banker to learn about item storage.", requirement: { type: 'talk', poiId: 'tutorial_bank_area', npcName: 'Banker' } }, // 18
        { description: "Speak to the Money Guide about the economy.", requirement: { type: 'talk', poiId: 'tutorial_bank_area', npcName: 'Money Guide' } }, // 19
        { description: "Find the Prayer Guide in the chapel.", requirement: { type: 'talk', poiId: 'tutorial_chapel_area', npcName: 'Prayer Guide' } }, // 20
        { description: "Bury the bones and speak to the Prayer Guide again.", requirement: { type: 'gather', items: [{itemId: 'bones', quantity: 0, operator: 'eq'}] } }, // 21
        { description: "Speak to the Prayer Guide about your progress.", requirement: { type: 'talk', poiId: 'tutorial_chapel_area', npcName: 'Prayer Guide' } }, // 22
        { description: "Go to the Tavern and find the Manager.", requirement: { type: 'talk', poiId: 'tutorial_tavern', npcName: 'Tavern Manager' } }, // 23
        { description: "Check the Quest Board and accept the task.", requirement: { type: 'accept_repeatable_quest', questId: 'tutorial_magic_rat' } }, // 24
        { description: "Speak with the Magic Guide in the tavern corner.", requirement: { type: 'talk', poiId: 'tutorial_tavern', npcName: 'Magic Guide' } }, // 25
        { description: "Use magic to defeat the rat in the tavern.", requirement: { type: 'kill', monsterId: 'tutorial_rat', quantity: 1, style: 'magic' } }, // 26
        { description: "Report your success to the Tavern Manager.", requirement: { type: 'talk', poiId: 'tutorial_tavern', npcName: 'Tavern Manager' } }, // 27
        { description: "Receive your final lesson from the Magic Guide.", requirement: { type: 'talk', poiId: 'tutorial_tavern', npcName: 'Magic Guide' } }, // 28
        { description: "Speak to the Magic Guide to leave the island.", requirement: { type: 'talk', poiId: 'tutorial_tavern', npcName: 'Magic Guide' } } // 29
    ],
    rewards: {
        xp: [{ skill: SkillName.Attack, amount: 100 }],
        coins: 100
    },
    dialogueEntryPoints: [
        { npcName: 'Leo the Guide', response: { text: "I'm ready to begin my training.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 0 }], successNode: 'in_progress_embrune_101_0', failureNode: '' } } },
        { npcName: 'Survival Guide', response: { text: "Leo sent me to find you.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 1 }], successNode: 'in_progress_embrune_101_1', failureNode: '' } } },
        { npcName: 'Survival Guide', response: { text: "How's my progress?", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 2 }], successNode: 'survival_stage_2_router', failureNode: '' } } },
        { npcName: 'Survival Guide', response: { text: "I'm having trouble with the cooking...", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 3 }, { type: 'items', items: [{ itemId: 'cooked_shrimp', quantity: 0, operator: 'eq' }] }], successNode: 'shrimp_missing_router', failureNode: '' } } },
        { npcName: 'Survival Guide', response: { text: "I've cooked the shrimp!", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 3 }, { type: 'items', items: [{ itemId: 'cooked_shrimp', quantity: 1 }] }], successNode: 'in_progress_embrune_101_3', failureNode: '' } } },
        { npcName: 'Baker', response: { text: "The Survival Guide sent me.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 4 }], successNode: 'in_progress_embrune_101_4', failureNode: '' } } },
        { npcName: 'Baker', response: { text: "I'm having trouble making the dough...", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 5 }], successNode: 'baker_stage_5_router', failureNode: '' } } },
        { npcName: 'Baker', response: { text: "I've baked the bread!", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 6 }, { type: 'items', items: [{ itemId: 'bread', quantity: 1 }] }], successNode: 'in_progress_embrune_101_6', failureNode: 'baker_stage_6_router' } } },
        { npcName: 'Information Guide', response: { text: "The Baker sent me to learn about my journal.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 7 }], successNode: 'in_progress_embrune_101_7', failureNode: '' } } },
        { npcName: 'Mining Guide', response: { text: "The Information Guide sent me to the mines.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 8 }], successNode: 'in_progress_embrune_101_8', failureNode: '' } } },
        { npcName: 'Mining Guide', response: { text: "I need some help with my mining progress...", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 9 }], successNode: 'mining_guide_router', failureNode: '' } } },
        { npcName: 'Mining Guide', response: { text: "I've lost some of my equipment...", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 9 }, { type: 'items', items: [{ itemId: 'bronze_pickaxe', quantity: 0, operator: 'eq' }] }], successNode: 'mining_give_pickaxe', failureNode: '' } } },
        { npcName: 'Mining Guide', response: { text: "I need some help with my mining progress...", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 10 }], successNode: 'mining_guide_router', failureNode: '' } } },
        { npcName: 'Mining Guide', response: { text: "I need some help with my mining progress...", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 11 }], successNode: 'mining_guide_router', failureNode: '' } } },
        { npcName: 'Mining Guide', response: { text: "I've lost some of my equipment...", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 11 }, { type: 'items', items: [{ itemId: 'bronze_pickaxe', quantity: 0, operator: 'eq' }, { itemId: 'hammer', quantity: 0, operator: 'eq' }] }], successNode: 'mining_give_both_tools', failureNode: '' } } },
        { npcName: 'Mining Guide', response: { text: "I've lost my hammer...", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 11 }, { type: 'items', items: [{ itemId: 'hammer', quantity: 0, operator: 'eq' }] }], successNode: 'mining_give_hammer', failureNode: '' } } },
        { npcName: 'Mining Guide', response: { text: "I've forged the dagger.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 12 }, { type: 'items', items: [{ itemId: 'bronze_dagger', quantity: 1 }] }], successNode: 'in_progress_embrune_101_12', failureNode: 'dagger_missing_check' } } },
        { npcName: 'Weapon Guide', response: { text: "The Mining Guide sent me for combat training.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 13 }], successNode: 'in_progress_embrune_101_13', failureNode: '' } } },
        { npcName: 'Weapon Guide', response: { text: "I've lost my weapon...", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 14 }], successNode: 'combat_equipment_check', failureNode: '' } } },
        { npcName: 'Weapon Guide', response: { text: "I defeated the rat with melee.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 15 }], successNode: 'in_progress_embrune_101_15', failureNode: '' } } },
        { npcName: 'Weapon Guide', response: { text: "I've lost my bow or arrows...", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 16 }], successNode: 'combat_equipment_check', failureNode: '' } } },
        { npcName: 'Weapon Guide', response: { text: "I defeated the rat with ranged.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 17 }], successNode: 'in_progress_embrune_101_17', failureNode: '' } } },
        { npcName: 'Banker', response: { text: "I'm here to learn about the bank.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 18 }], successNode: 'in_progress_embrune_101_18', failureNode: '' } } },
        { npcName: 'Money Guide', response: { text: "I'm here to learn about money.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 19 }], successNode: 'in_progress_embrune_101_19', failureNode: '' } } },
        { npcName: 'Prayer Guide', response: { text: "I'm here to learn about Prayer.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 20 }], successNode: 'in_progress_embrune_101_20', failureNode: '' } } },
        { npcName: 'Prayer Guide', response: { text: "I've lost the bones...", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 21 }], successNode: 'prayer_reobtain_bones', failureNode: '' } } },
        { npcName: 'Prayer Guide', response: { text: "I've buried the bones.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 22 }], successNode: 'in_progress_embrune_101_22', failureNode: '' } } },
        { npcName: 'Tavern Manager', response: { text: "The Prayer Guide sent me.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 23 }], successNode: 'in_progress_embrune_101_23', failureNode: '' } } },
        { npcName: 'Magic Guide', response: { text: "I've accepted the task. I'm ready to learn magic.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 25 }], successNode: 'in_progress_embrune_101_25', failureNode: '' } } },
        { npcName: 'Magic Guide', response: { text: "I've lost my runes...", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 26 }], successNode: 'magic_reobtain_runes', failureNode: '' } } },
        { npcName: 'Tavern Manager', response: { text: "I've completed the task from the board.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 27 }], successNode: 'in_progress_embrune_101_27', failureNode: '' } } },
        { npcName: 'Magic Guide', response: { text: "The Manager sent me back for my final lesson.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 28 }], successNode: 'in_progress_embrune_101_28', failureNode: '' } } },
        { npcName: 'Magic Guide', response: { text: "I am ready to leave.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 29 }], successNode: 'in_progress_embrune_101_29', failureNode: '' } } }
    ],
    
    dialogue: {
        in_progress_embrune_101_0: {
            npcName: 'Leo the Guide',
            npcIcon: '/assets/npcChatHeads/leo_the_guide.png',
            text: "Welcome to Embrune! This is a tutorial area to teach you the basics. To progress, you'll need to speak with the guides in each area. You should follow the path and speak to the Survival Guide to begin.",
            responses: [
                { text: "Got it. Talk to the guides.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] },
                { text: "Tell me more about this island.", next: 'leo_lore' },
                { text: "I've played games like this before, can I skip the tutorial?", next: 'skip_tutorial_confirm' }
            ]
        },
        leo_lore: {
            npcName: 'Leo the Guide',
            npcIcon: '/assets/npcChatHeads/leo_the_guide.png',
            text: "This island is a sanctuary. Before you venture to the mainland of Embrune, we make sure you have the skills to survive. Many masters have gathered here to share their knowledge. It's a peaceful place, though the tavern rats are a bit of a nuisance.",
            responses: [
                { text: "Okay, I'm ready to start.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        skip_tutorial_confirm: {
            npcName: 'Leo the Guide',
            npcIcon: '/assets/npcChatHeads/leo_the_guide.png',
            text: "Are you sure? This tutorial teaches you some core mechanics. If you skip, you'll be teleported directly to the town of Meadowdale with a full set of starter gear.",
            responses: [
                { text: "Yes, I'm sure. To Meadowdale!", actions: [{ type: 'complete_tutorial' }, { type: 'teleport', poiId: 'meadowdale_square' }] },
                { text: "On second thought, I'll do the tutorial." }
            ]
        },
        in_progress_embrune_101_1: {
            npcName: 'Survival Guide',
            npcIcon: '/assets/npcChatHeads/survival_guide.png',
            text: "An adventurer who can't feed themselves is a dead adventurer. Your first task: chop a tree for logs, and catch a raw shrimp from the fishing spot. Come back to me when you have both.",
            responses: [
                { text: "How do I gather things?", next: 'survival_how_to' }
            ],
            conditionalResponses: [
                { text: "I don't have the tools for that.", check: { requirements: [{ type: 'items', items: [{ itemId: 'bronze_axe', quantity: 0, operator: 'eq' }] }], successNode: 'survival_guide_give_tools', failureNode: '' } },
                { text: "I found this apple in a tree... is it edible?", check: { requirements: [{ type: 'items', items: [{ itemId: 'apple', quantity: 1 }] }], successNode: 'survival_apple_easter_egg', failureNode: '' } }
            ]
        },
        survival_apple_easter_egg: {
            npcName: 'Survival Guide',
            npcIcon: '/assets/npcChatHeads/survival_guide.png',
            text: "Ah, a rare find! Most folks just get splinters and logs from those trees. Yes, it's perfectly edible. Apples are a fine source of natural energy and heal you a small amount. No fire needed—just eat it whenever you're feeling peckish. Consider it a gift from the grove!",
            responses: [{ text: "Good to know, thanks!" }]
        },
        survival_how_to: {
            npcName: 'Survival Guide',
            npcIcon: '/assets/npcChatHeads/survival_guide.png',
            text: "It's simple. Look around the clearing. You'll see buttons for 'Chop Tree' and 'Net Fish'. As long as you have the right tool in your pack, just click the button and your character will do the work. Just make sure you have enough space in your bag!",
            responses: [{ text: "I see. I'll get to it." }],
            conditionalResponses: [
                { text: "I still need the tools.", check: { requirements: [{ type: 'items', items: [{ itemId: 'bronze_axe', quantity: 0, operator: 'eq' }] }], successNode: 'survival_guide_give_tools', failureNode: '' } }
            ]
        },
        survival_guide_give_tools: {
            npcName: 'Survival Guide',
            npcIcon: '/assets/npcChatHeads/survival_guide.png',
            text: "Right, you'll need these. Here's an axe for chopping and a tinderbox for making a fire. I'll also give you a net for the shrimp. Get to work!",
            highlight: ['activity-button-1', 'activity-button-2'],
            responses: [{ text: "Time to get to work.", actions: [{ type: 'give_item', itemId: 'bronze_axe', quantity: 1 }, { type: 'give_item', itemId: 'tinderbox', quantity: 1 }, { type: 'give_item', itemId: 'small_fishing_net', quantity: 1 }, { type: 'advance_quest', questId: 'embrune_101' }] }]
        },
        survival_stage_2_router: {
            npcName: 'Survival Guide',
            npcIcon: '/assets/npcChatHeads/survival_guide.png',
            text: "Let's see where you're at...",
            responses: [{ text: "I'll figure it out." }],
            conditionalResponses: [
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'apple', quantity: 1 }] }], successNode: 'survival_apple_easter_egg', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'bronze_axe', quantity: 0, operator: 'eq' }, { itemId: 'tinderbox', quantity: 0, operator: 'eq' }, { itemId: 'small_fishing_net', quantity: 0, operator: 'eq' }] }], successNode: 'survival_give_all_tools', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'bronze_axe', quantity: 0, operator: 'eq' }] }], successNode: 'survival_give_axe', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'tinderbox', quantity: 0, operator: 'eq' }] }], successNode: 'survival_give_tinderbox', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'small_fishing_net', quantity: 0, operator: 'eq' }] }], successNode: 'survival_give_net', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'logs', quantity: 0, operator: 'eq' }, { itemId: 'raw_shrimp', quantity: 0, operator: 'eq' }] }], successNode: 'survival_need_logs_and_shrimp', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'logs', quantity: 1, operator: 'gte' }, { itemId: 'raw_shrimp', quantity: 0, operator: 'eq' }] }], successNode: 'survival_need_shrimp', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'logs', quantity: 0, operator: 'eq' }, { itemId: 'raw_shrimp', quantity: 1, operator: 'gte' }] }], successNode: 'survival_need_logs', failureNode: '' } },
            ]
        },
        shrimp_missing_router: {
            npcName: 'Survival Guide',
            npcIcon: '/assets/npcChatHeads/survival_guide.png',
            text: "Something isn't right. Let me check your pack.",
            responses: [{ text: "Okay." }],
            conditionalResponses: [
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'bronze_axe', quantity: 0, operator: 'eq' }] }], successNode: 'survival_give_axe', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'tinderbox', quantity: 0, operator: 'eq' }] }], successNode: 'survival_give_tinderbox', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'small_fishing_net', quantity: 0, operator: 'eq' }] }], successNode: 'survival_give_net', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'burnt_food', quantity: 1, operator: 'gte' }] }], successNode: 'survival_explain_burnt', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'logs', quantity: 1, operator: 'gte' }, { itemId: 'raw_shrimp', quantity: 1, operator: 'gte' }] }], successNode: 'survival_instruction_cook', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'logs', quantity: 0, operator: 'eq' }, { itemId: 'raw_shrimp', quantity: 1, operator: 'gte' }] }], successNode: 'survival_instruction_need_logs_with_shrimp', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'raw_shrimp', quantity: 0, operator: 'eq' }] }], successNode: 'survival_need_shrimp', failureNode: '' } },
            ]
        },
        survival_explain_burnt: {
            npcName: 'Survival Guide',
            npcIcon: '/assets/npcChatHeads/survival_guide.png',
            text: "Ouch, you burnt the shrimp! Don't worry, even master chefs burn a dish now and then. As you practice and your Cooking level increases, the chance of burning food goes down significantly. I'll take that charred mess off your hands—you'll need to catch another shrimp and try again.",
            responses: [{ text: "Thanks, I'll try again.", actions: [{ type: 'take_item', itemId: 'burnt_food', quantity: 35 }], next: 'survival_stage_2_router' }]
        },
        survival_need_logs_with_shrimp: {
            npcName: 'Survival Guide',
            npcIcon: '/assets/npcChatHeads/survival_guide.png',
            text: "I see you've got the shrimp, but you're missing the wood for a fire! If there isn't a fire nearby, go chop another tree and use your tinderbox on the logs.",
            responses: [{ text: "On it." }]
        },
        survival_give_all_tools: { npcName: 'Survival Guide', npcIcon: '/assets/npcChatHeads/survival_guide.png', text: "Clumsy! You've lost all your tools. Here, take a new set. Don't lose them again.", responses: [{ text: "Thank you.", actions: [{ type: 'give_item', itemId: 'bronze_axe', quantity: 1 }, { type: 'give_item', itemId: 'tinderbox', quantity: 1 }, { type: 'give_item', itemId: 'small_fishing_net', quantity: 1 }] }] },
        survival_give_axe: { npcName: 'Survival Guide', npcIcon: '/assets/npcChatHeads/survival_guide.png', text: "No axe? You can't chop wood with your bare hands. Here.", responses: [{ text: "Thanks.", actions: [{ type: 'give_item', itemId: 'bronze_axe', quantity: 1 }] }] },
        survival_give_tinderbox: { npcName: 'Survival Guide', npcIcon: '/assets/npcChatHeads/survival_guide.png', text: "A fire needs a spark. Take this tinderbox.", responses: [{ text: "Thanks.", actions: [{ type: 'give_item', itemId: 'tinderbox', quantity: 1 }] }] },
        survival_give_net: { npcName: 'Survival Guide', npcIcon: '/assets/npcChatHeads/survival_guide.png', text: "Can't catch shrimp with a wish. Take this net.", responses: [{ text: "Thanks.", actions: [{ type: 'give_item', itemId: 'small_fishing_net', quantity: 1 }] }] },
        survival_need_logs_and_shrimp: { npcName: 'Survival Guide', npcIcon: '/assets/npcChatHeads/survival_guide.png', text: "You need both a log and a raw shrimp. Chop a tree and net a fish!", responses: [{ text: "On it." }] },
        survival_need_shrimp: { npcName: 'Survival Guide', npcIcon: '/assets/npcChatHeads/survival_guide.png', text: "You have wood, but no fish. Head to the fishing spot and catch a raw shrimp.", responses: [{ text: "On it." }] },
        survival_need_logs: { npcName: 'Survival Guide', npcIcon: '/assets/npcChatHeads/survival_guide.png', text: "You have a shrimp, but no wood for a fire. Go chop down a tree.", responses: [{ text: "On it." }] },
        survival_instruction_cook: { npcName: 'Survival Guide', npcIcon: '/assets/npcChatHeads/survival_guide.png', text: "You have the materials! Now, 'Use' your tinderbox on the logs to start a fire, then 'Use' the raw shrimp on the fire to cook it.", responses: [{ text: "I'll do that now." }] },

        in_progress_embrune_101_3: {
            npcName: 'Survival Guide',
            npcIcon: '/assets/npcChatHeads/survival_guide.png',
            text: "Well done! You've cooked your first meal. Survival is key. I'll take that burnt food off your hands if you have any. Now, head north to the village and speak to the Baker. He'll teach you about more advanced cooking.",
            responses: [{ text: "Thank you, I'll head there now.", actions: [{ type: 'take_item', itemId: 'burnt_food', quantity: 35 }, { type: 'advance_quest', questId: 'embrune_101' }] }],
            conditionalResponses: [
                { text: "I found this apple in a tree... is it edible?", check: { requirements: [{ type: 'items', items: [{ itemId: 'apple', quantity: 1 }] }], successNode: 'survival_apple_easter_egg', failureNode: '' } }
            ]
        },
        in_progress_embrune_101_4: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "Hello there! The Survival Guide sent you? Wonderful! I'll teach you to make bread from scratch. It's a bit more work than roasting a shrimp on a stick, but far more rewarding!",
            responses: [
                { text: "What's the process?", next: 'baker_process' },
                { text: "I'm ready to start.", actions: [{ type: 'give_item', itemId: 'bucket', quantity: 1 }, { type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        baker_process: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "First, take this bucket and gather some wheat from the field. Take the wheat to the Windmill to grind it into flour. Then, fill your bucket with water and mix it with the flour to make dough. Finally, bake that dough on my range!",
            highlight: 'activity-button-1',
            responses: [
                { text: "Got it! Wheat, mill, flour, dough, then bake.", actions: [{ type: 'give_item', itemId: 'bucket', quantity: 1 }, { type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        baker_stage_5_router: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "Let's see what you've got in your pack...",
            responses: [{ text: "Nevermind, I'll figure it out." }],
            conditionalResponses: [
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'pie_dough', quantity: 1 }] }], successNode: 'baker_easter_egg_pie_dough', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'pizza_base', quantity: 1 }] }], successNode: 'baker_easter_egg_pizza_base', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'bucket', quantity: 0, operator: 'eq' }, { itemId: 'bucket_of_water', quantity: 0, operator: 'eq' }] }], successNode: 'baker_guide_no_bucket', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'flour', quantity: 1, operator: 'gte' }, { itemId: 'bucket_of_water', quantity: 1, operator: 'gte' }] }], successNode: 'baker_guide_flour_and_water', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'flour', quantity: 1, operator: 'gte' }, { itemId: 'bucket', quantity: 1, operator: 'gte' }] }], successNode: 'baker_guide_flour_and_empty', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'world_state', property: 'windmillFlour', value: 1, operator: 'gte' }], successNode: 'baker_guide_hopper_check', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'wheat', quantity: 1, operator: 'gte' }] }], successNode: 'baker_guide_wheat_check', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'wheat', quantity: 0, operator: 'eq' }] }], successNode: 'baker_guide_no_wheat_check', failureNode: '' } },
            ]
        },
        baker_easter_egg_pie_dough: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "Oh! I see you've made pie dough instead of bread dough. While pies are delicious—whether they're filled with red berries, apples, or meat—they require a pie dish and a bit more skill. Stick to the basics for now and try making bread dough!",
            responses: [{ text: "My mistake, I'll try again." }],
            conditionalResponses: [
                { text: "What about this other dough I have?", check: { requirements: [{ type: 'items', items: [{ itemId: 'pizza_base', quantity: 1 }] }], successNode: 'baker_easter_egg_pizza_base', failureNode: '' } }
            ]
        },
        baker_easter_egg_pizza_base: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "A pizza base? You're already thinking like a master chef! Pizzas are great, but you'll need tomatoes and cheese to finish one. For your lesson today, I really need to see you make some bread dough first.",
            responses: [{ text: "Got it, bread dough it is." }]
        },
        baker_guide_no_bucket: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "Where's your bucket, lad? Here, take another one, but try to hold onto it!", responses: [{ text: "Thanks.", actions: [{ type: 'give_item', itemId: 'bucket', quantity: 1 }] }] },
        baker_guide_flour_and_water: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "You have flour and water! Open your inventory and 'Use' the water on the flour to mix them into dough.", highlight: 'side-panel-button-inventory', responses: [{ text: "Mixing it now!" }] },
        baker_guide_flour_and_empty: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "You have the flour, but you need water! Fill your bucket at the sink.", highlight: 'activity-button-4', responses: [{ text: "Of course." }] },
        baker_guide_hopper_check: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "The flour is in the hopper! Collect it from the windmill.", highlight: 'activity-button-2', responses: [{ text: "Right away." }] },
        baker_guide_wheat_check: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "You have the wheat. Use it on the Windmill hopper to make flour.", highlight: 'activity-button-2', responses: [{ text: "To the Windmill!" }] },
        baker_guide_no_wheat_check: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "You need some wheat! Go harvest some stalks from the field.", highlight: 'activity-button-1', responses: [{ text: "Right." }] },
        baker_stage_6_router: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "How's the baking going?",
            responses: [{ text: "Still working on it." }],
            conditionalResponses: [
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'burnt_food', quantity: 1, operator: 'gte' }] }], successNode: 'baker_burnt_bread', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'bread_dough', quantity: 1, operator: 'gte' }] }], successNode: 'baker_has_dough_instruction', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'bread_dough', quantity: 0, operator: 'eq' }] }], successNode: 'baker_stage_5_router', failureNode: '' } },
            ]
        },
        baker_burnt_bread: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "Oh no! You left it on the range too long! Don't worry, even master bakers burn a loaf. Remake the dough and try again.", responses: [{ text: "(Listen to instructions)", actions: [{ type: 'take_item', itemId: 'burnt_food', quantity: 35 }], next: 'baker_stage_5_router' }] },
        baker_has_dough_instruction: { npcName: 'Baker', npcIcon: '/assets/npcChatHeads/baker.png', text: "You have the dough! 'Use' it on my cooking range to bake it into a fresh loaf.", highlight: 'activity-button-3', responses: [{ text: "Right." }] },

        in_progress_embrune_101_6: {
            npcName: 'Baker',
            npcIcon: '/assets/npcChatHeads/baker.png',
            text: "Smells delicious! You're a natural. Before you go, here's a secret: take that cooked shrimp from earlier and 'Use' it on the bread to make a sandwich! It's far more filling. Now, head south to the learning hut.",
            responses: [{ text: "Thanks!", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
        },
        in_progress_embrune_101_7: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "Pay attention! This magical journal you carry is your most vital tool. Let's take a look at the different panels on your sidebar. Which one should we start with?",
            responses: [
                { text: "Explain the Quest Journal.", next: 'info_quests_1' },
                { text: "Explain the Equipment Panel.", next: 'info_equipment_1' },
                { text: "Explain the Skills Window.", next: 'info_skills_1' },
                { text: "Explain the Inventory.", next: 'info_inventory_1' },
                { text: "I've heard enough about the sidebar.", next: 'info_orbs' }
            ]
        },
        info_quests_1: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "The Quest Journal keeps track of your adventures. It uses a simple color code: Red means a quest has not been started, Yellow means it's in progress, and Green means it's complete!",
            highlight: 'side-panel-button-quests',
            responses: [
                { text: "Tell me more about quests.", next: 'info_quests_2' },
                { text: "Move on to the Equipment Panel.", next: 'info_equipment_1' },
                { text: "I've heard enough about the sidebar.", next: 'info_orbs' }
            ]
        },
        info_quests_2: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "Clicking on a quest in the list will show you more details, including a hint on how to start it or your current objective. It's the best way to make sure you never get lost in your own story!",
            highlight: 'side-panel-button-quests',
            responses: [
                { text: "Explain the Equipment Panel.", next: 'info_equipment_1' },
                { text: "I've heard enough about the sidebar.", next: 'info_orbs' }
            ]
        },
        info_equipment_1: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "The Equipment Panel shows what you're currently wearing. You'll find or make gear throughout your journey—swords, bows, and armor—that will significantly improve your combat prowess.",
            highlight: 'side-panel-button-equipment',
            responses: [
                { text: "Tell me more about equipment.", next: 'info_equipment_2' },
                { text: "Move on to the Skills Window.", next: 'info_skills_1' },
                { text: "I've heard enough about the sidebar.", next: 'info_orbs' }
            ]
        },
        info_equipment_2: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "Every piece of gear has unique properties. You can view your total bonuses by clicking the 'Equipment Stats' button at the bottom of the panel. This helps you see exactly how well-defended or powerful you truly are.",
            highlight: 'side-panel-button-equipment',
            responses: [
                { text: "Explain the Skills Window.", next: 'info_skills_1' },
                { text: "I've heard enough about the sidebar.", next: 'info_orbs' }
            ]
        },
        info_skills_1: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "The Skills Window displays your progress in 20 different disciplines. As you perform actions like chopping wood or fighting monsters, you'll earn experience and eventually level up, unlocking more content!",
            highlight: 'side-panel-button-skills',
            responses: [
                { text: "Tell me more about skills.", next: 'info_skills_2' },
                { text: "Move on to the Inventory.", next: 'info_inventory_1' },
                { text: "I've heard enough about the sidebar.", next: 'info_orbs' }
            ]
        },
        info_skills_2: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "Hovering over a skill will show you a detailed tooltip with your total experience and how much you need for the next level. If you click on a skill, it will open a guide showing everything you can do at your current level!",
            highlight: 'side-panel-button-skills',
            responses: [
                { text: "Explain the Inventory.", next: 'info_inventory_1' },
                { text: "I've heard enough about the sidebar.", next: 'info_orbs' }
            ]
        },
        info_inventory_1: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "The Inventory is your main storage, with space for 35 different items. It also tracks your current coin purse. Managing your space is a skill in itself for any serious adventurer.",
            highlight: 'side-panel-button-inventory',
            responses: [
                { text: "Tell me more about items.", next: 'info_inventory_2' },
                { text: "I've heard enough about the sidebar.", next: 'info_orbs' }
            ]
        },
        info_inventory_2: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "Almost every item in your pack has multiple functions. Right-clicking an item (or long-pressing on a magical scroll-slab) will reveal a context menu with options like 'Use', 'Equip', or 'Examine'.",
            highlight: 'side-panel-button-inventory',
            responses: [
                { text: "Ready to hear about the orbs.", next: 'info_orbs' },
                { text: "I'm finished with the tour.", next: 'info_tour_end' }
            ]
        },
        info_orbs: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "Finally, keep an eye on the orbs surrounding your map. These are your vitals: Red for Health, Blue for Prayer, and Yellow for Run Energy. Toggle run on to move twice as fast, but use it wisely!",
            highlight: ['hp-orb', 'run-energy-orb'],
            responses: [
                { text: "I understand everything now.", next: 'info_tour_end' }
            ]
        },
        info_tour_end: {
            npcName: 'Information Guide',
            npcIcon: '/assets/npcChatHeads/information_guide.png',
            text: "You've learned much today. Now, the path leads downward. Descend the ladder into the tutorial mines when you are ready to learn the arts of the forge.",
            responses: [
                { text: "Thank you. I'm ready to move on.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        in_progress_embrune_101_8: {
            npcName: 'Mining Guide',
            npcIcon: '/assets/npcChatHeads/mining_guide.png',
            text: "So you're the new blood. To make Bronze, we need Copper and Tin. Take this hammer and pickaxe and mine one of each. You don't need the hammer to mine, but you'll need it later.",
            highlight: ['activity-button-1', 'activity-button-2'],
            responses: [
                { text: "How do I smelt them?", next: 'mining_smelt_info' },
                { text: "On it.", actions: [{ type: 'give_item', itemId: 'bronze_pickaxe', quantity: 1 }, { type: 'give_item', itemId: 'hammer', quantity: 1}, { type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        mining_guide_router: {
            npcName: 'Mining Guide',
            npcIcon: '/assets/npcChatHeads/mining_guide.png',
            text: "Let me check your pack and your tools.",
            responses: [{ text: "Okay." }],
            conditionalResponses: [
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'uncut_sapphire', quantity: 1, operator: 'gte' }] }], successNode: 'mining_conf_gem', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'uncut_emerald', quantity: 1, operator: 'gte' }] }], successNode: 'mining_conf_gem', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'uncut_ruby', quantity: 1, operator: 'gte' }] }], successNode: 'mining_conf_gem', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'uncut_diamond', quantity: 1, operator: 'gte' }] }], successNode: 'mining_conf_gem', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 11 }, { type: 'items', items: [{ itemId: 'bronze_pickaxe', quantity: 0, operator: 'eq' }, { itemId: 'hammer', quantity: 0, operator: 'eq' }] }], successNode: 'mining_give_both_tools', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'bronze_pickaxe', quantity: 0, operator: 'eq' }] }], successNode: 'mining_give_pickaxe', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 11 }, { type: 'items', items: [{ itemId: 'hammer', quantity: 0, operator: 'eq' }] }], successNode: 'mining_give_hammer', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 11 }, { type: 'items', items: [{ itemId: 'bronze_bar', quantity: 0, operator: 'eq' }] }], successNode: 'mining_need_bar', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'copper_ore', quantity: 0, operator: 'eq' }, { itemId: 'tin_ore', quantity: 0, operator: 'eq' }] }], successNode: 'mining_need_both_ores', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'copper_ore', quantity: 0, operator: 'eq' }] }], successNode: 'mining_need_copper', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'items', items: [{ itemId: 'tin_ore', quantity: 0, operator: 'eq' }] }], successNode: 'mining_need_tin', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 10 }, { type: 'items', items: [{ itemId: 'copper_ore', quantity: 1, operator: 'gte' }, { itemId: 'tin_ore', quantity: 1, operator: 'gte' }] }], successNode: 'mining_instruction_smelt', failureNode: '' } },
            ]
        },
        mining_conf_gem: {
            npcName: 'Mining Guide',
            npcIcon: '/assets/npcChatHeads/mining_guide.png',
            text: "Ooh, what's that glittering in your pack? A gem! Yes, mining can sometimes reveal precious stones from the rock. Quite a lucky find for a novice.",
            responses: [
                { text: "Can I keep it?", next: 'mining_conf_gem_2' }
            ]
        },
        mining_conf_gem_2: {
            npcName: 'Mining Guide',
            npcIcon: '/assets/npcChatHeads/mining_guide.png',
            text: "Hah! Not a chance. Rule of the island: everything you find during training stays on the island. For safety and... taxes. Yes, definitely taxes. I'll take that off your hands before it distracts you from your hammer.",
            responses: [
                { text: "Aww, okay.", actions: [{ type: 'take_item', itemId: 'uncut_sapphire', quantity: 1 }, { type: 'take_item', itemId: 'uncut_emerald', quantity: 1 }, { type: 'take_item', itemId: 'uncut_ruby', quantity: 1 }, { type: 'take_item', itemId: 'uncut_diamond', quantity: 1 }], next: 'mining_guide_router' }
            ]
        },
        mining_give_pickaxe: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "No pickaxe? You're not going to get far mining with your fingernails. Here, take another one.", responses: [{ text: "Thanks.", actions: [{ type: 'give_item', itemId: 'bronze_pickaxe', quantity: 1 }] }] },
        mining_give_hammer: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "Lost your hammer? The anvil needs a heavy hand. Here, take this one.", responses: [{ text: "Thanks.", actions: [{ type: 'give_item', itemId: 'hammer', quantity: 1 }] }] },
        mining_give_both_tools: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "You've lost everything! Here, take a new pickaxe and a hammer. Try to keep them in your pack this time.", responses: [{ text: "Thank you.", actions: [{ type: 'give_item', itemId: 'bronze_pickaxe', quantity: 1 }, { type: 'give_item', itemId: 'hammer', quantity: 1 }] }] },
        mining_need_both_ores: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "You don't have any ore! You need one Copper and one Tin to make Bronze.", highlight: ['activity-button-1', 'activity-button-2'], responses: [{ text: "I'll go get them." }] },
        mining_need_copper: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "You've got the Tin, but you're missing the Copper. Head to the orange-tinted rocks.", highlight: 'activity-button-1', responses: [{ text: "Right away." }] },
        mining_need_tin: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "You have Copper, but no Tin. You'll find it in the greyish-white rocks.", highlight: 'activity-button-2', responses: [{ text: "Got it." }] },
        mining_need_bar: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "You've lost your Bronze bar! Since we're training, I'll give you one more, but you'll have to mine for real on the mainland.", responses: [{ text: "Thank you, I'll be careful.", actions: [{ type: 'give_item', itemId: 'bronze_bar', quantity: 1 }] }] },
        mining_instruction_smelt: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "You have both ores! Now 'Use' them on the furnace over there to smelt a Bronze bar.", highlight: 'activity-button-3', responses: [{ text: "I'll do that." }] },
        mining_smelt_info: {
            npcName: 'Mining Guide',
            npcIcon: '/assets/npcChatHeads/mining_guide.png',
            text: "Use the furnace once you have the ores. After that, take the bar to the anvil and use your hammer. Here, take this hammer too.",
            responses: [
                { text: "Got it.", actions: [{ type: 'give_item', itemId: 'bronze_pickaxe', quantity: 1 }, { type: 'give_item', itemId: 'hammer', quantity: 1 }, { type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        dagger_missing_check: { npcName: 'Mining Guide', npcIcon: '/assets/npcChatHeads/mining_guide.png', text: "You don't have the Bronze Dagger. If you lost your materials, you'll need to mine more ore and smelt a new bar.", responses: [{ text: "Okay." }] },
        in_progress_embrune_101_12: {
            npcName: 'Mining Guide',
            npcIcon: '/assets/npcChatHeads/mining_guide.png',
            text: "A fine dagger! Take it to the Weapon Guide east of here for combat training.",
            responses: [{ text: "On my way.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
        },
        in_progress_embrune_101_13: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "Let's see if you can use that blade. Equip it, pick a style, and defeat a rat.",
            highlight: ['side-panel-button-equipment', 'side-panel-button-combat'],
            responses: [
                { text: "What are combat styles?", next: 'combat_styles_info' },
                { text: "Tell me about combat in general.", next: 'combat_lore_hub' },
                { text: "Okay.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        combat_lore_hub: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "Combat is a science, boy. It's about knowing your gear, your limits, and your enemy's weaknesses. What do you want to know about?",
            responses: [
                { text: "Tell me about the 'Combat Triangle'.", next: 'combat_triangle_lore' },
                { text: "What do equipment stats mean?", next: 'combat_stats_lore' },
                { text: "Are there other ways to boost power?", next: 'combat_buffs_lore' },
                { text: "Back to the lesson.", next: 'in_progress_embrune_101_13' }
            ]
        },
        combat_triangle_lore: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "Most monsters have a preferred way of fighting. If they use Melee, they're often slow and vulnerable to Magic. If they use Ranged, they try to stay back, but are weak if you close the gap with Melee. And if they use Magic, their robes offer little protection against a well-aimed Ranged attack.",
            responses: [
                { text: "So Melee beats Ranged, Ranged beats Magic, and Magic beats Melee?", next: 'combat_triangle_confirm' }
            ]
        },
        combat_triangle_confirm: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "Exactly. It's not a law, but it's a darn good rule of thumb. Pay attention to how a monster attacks you, and switch your tactics to match.",
            responses: [
                { text: "I have other questions.", next: 'combat_lore_hub' }
            ]
        },
        combat_stats_lore: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "Every piece of armor or weapon has stats. Generally, higher 'Attack' stats help you land a hit more often, while 'Strength' makes those hits land harder. On the defensive side, 'Defence' stats make you harder to hit. Different materials offer different protections.",
            responses: [
                { text: "How do I see these stats?", next: 'combat_stats_ui' }
            ]
        },
        combat_stats_ui: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "Open your Equipment panel and click 'Equipment Stats'. You'll see exactly how balanced your loadout is. A heavy knight in plate is great against swords, but might be a sitting duck for a wizard.",
            responses: [
                { text: "I see. What else?", next: 'combat_lore_hub' }
            ]
        },
        combat_buffs_lore: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "Beyond steel, there's spirit and alchemy. The gods favor those who fight, and have blessed us with combat prayers that can sharpen your aim or steady your arm. You'll learn more at the chapel later. As for potions... well, some herbs have interesting effects when brewed. You'll have to figure that out on your own.",
            responses: [
                { text: "Interesting. I'll keep that in mind.", next: 'combat_lore_hub' }
            ]
        },
        combat_equipment_check: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "Lost your arms? An adventurer needs their gear.",
            responses: [{ text: "Sorry." }],
            conditionalResponses: [
                { text: "I need a dagger.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 14 }, { type: 'items', items: [{ itemId: 'bronze_dagger', quantity: 0, operator: 'eq' }] }], successNode: '', failureNode: '' }, actions: [{ type: 'give_item', itemId: 'bronze_dagger', quantity: 1 }] },
                { text: "I need a bow and arrows.", check: { requirements: [{ type: 'quest', questId: 'embrune_101', status: 'in_progress', stage: 16 }, { type: 'items', items: [{ itemId: 'shortbow', quantity: 0, operator: 'eq' }] }], successNode: '', failureNode: '' }, actions: [{ type: 'give_item', itemId: 'shortbow', quantity: 1 }, { type: 'give_item', itemId: 'bronze_arrow', quantity: 50 }] }
            ]
        },
        combat_styles_info: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "Accurate trains Attack, Aggressive trains Strength, and Defensive trains Defence. Choose the one that fits your goals!",
            responses: [{ text: "Ready.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
        },
        in_progress_embrune_101_15: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "Good. Now for ranged. Take this bow and arrows. Equip the arrows and take down the other rat. Remember: Ranged beats Magic, but you'll want to stay away from anyone with a sword!",
            highlight: ['inventory-slot-shortbow', 'inventory-slot-bronze_arrow'],
            responses: [{ text: "Got it!", actions: [{ type: 'give_item', itemId: 'shortbow', quantity: 1 }, { type: 'give_item', itemId: 'bronze_arrow', quantity: 50 }, { type: 'advance_quest', questId: 'embrune_101' }] }]
        },
        in_progress_embrune_101_17: {
            npcName: 'Weapon Guide',
            npcIcon: '/assets/npcChatHeads/weapon_guide.png',
            text: "You're a natural! You've learned the basics of the blade and the bow. Now, head north to learn about banking your items. An adventurer with a full pack is a slow target!",
            responses: [{ text: "On my way.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }]
        },
        in_progress_embrune_101_18: {
            npcName: 'Banker',
            npcIcon: '/assets/npcChatHeads/banker.png',
            text: "Welcome to the Bank of Embrune. Here, you can store your hard-earned items and gold in a secure vault that is accessible from any bank branch in the world. Even if you fall in battle, items stored here remain perfectly safe.",
            responses: [
                { text: "How do I use it?", next: 'banker_tutorial_2' },
                { text: "I'm ready to try it now.", actions: [{ type: 'start_bank_tutorial' }, { type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        banker_tutorial_2: {
            npcName: 'Banker',
            npcIcon: '/assets/npcChatHeads/banker.png',
            text: "I can give you a quick tour of the vault's features, if you wish. It's a marvel of dwarven security!",
            responses: [
                { text: "I'll take the tour.", actions: [{ type: 'start_bank_tutorial' }, { type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        in_progress_embrune_101_19: {
            npcName: 'Money Guide',
            npcIcon: '/assets/npcChatHeads/money_guide.png',
            text: "Ah, gold. The glittering blood of Embrune! You'll find that coins are essential for everything from buying supplies to renting a room at an inn. Do you know how to fill your pockets?",
            responses: [
                { text: "Tell me about making gold.", next: 'money_lore_1' }
            ]
        },
        money_lore_1: {
            npcName: 'Money Guide',
            npcIcon: '/assets/npcChatHeads/money_guide.png',
            text: "There are many paths to wealth. Quests are the most reliable—helping folks with their troubles often leads to a direct reward. Then there are Quest Boards in every major town, offering repeatable tasks for steady income.",
            responses: [
                { text: "What else?", next: 'money_lore_2' }
            ]
        },
        money_lore_2: {
            npcName: 'Money Guide',
            npcIcon: '/assets/npcChatHeads/money_guide.png',
            text: "You can sell resources to shops, or use high-level magic to 'transmute' items directly into gold. If you're a skilled hunter, Slayer Master Kaelen in Silverhaven pays bounties for dangerous beasts.",
            responses: [
                { text: "Are there... quicker ways?", next: 'money_lore_3' }
            ]
        },
        money_lore_3: {
            npcName: 'Money Guide',
            npcIcon: '/assets/npcChatHeads/money_guide.png',
            text: "Some prefer 'extra-legal' methods... Thieving. It's risky and, well, illegal, but very profitable if you don't get caught. But enough of that! Head east to the chapel. The Prayer Guide will show you that not everything has a price.",
            responses: [
                { text: "Where is the first Quest Board?", next: 'money_hint_board' },
                { text: "I'm off to the chapel.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        money_hint_board: {
            npcName: 'Money Guide',
            npcIcon: '/assets/npcChatHeads/money_guide.png',
            text: "Once you reach the mainland, visit the 'The Rusty Flagon' inn in Meadowdale. They have the first Quest Board you'll encounter. It's a great place for a new adventurer to start. Now, the chapel is waiting!",
            responses: [
                { text: "Thank you for the tip!", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        in_progress_embrune_101_20: {
            npcName: 'Prayer Guide',
            npcIcon: '/assets/npcChatHeads/prayer_guide.png',
            text: "Peace be with you. I will teach you to harness the spiritual energy that flows through the Weave. See that Blue Orb by your map? That is your Prayer. It is finite, and it drains as you use holy auras to protect yourself.",
            responses: [
                { text: "How do I use it?", next: 'prayer_lore_1' }
            ]
        },
        prayer_lore_1: {
            npcName: 'Prayer Guide',
            npcIcon: '/assets/npcChatHeads/prayer_guide.png',
            text: "First, you must learn to pay respects. Burying the remains of fallen creatures is the simplest way to grow your connection. Take these bones and bury them. Then, if your energy is low, 'Pray' at the Altar here to restore it.",
            highlight: ['activity-button-2', 'hp-orb'],
            responses: [
                { text: "I will do so.", actions: [{ type: 'give_item', itemId: 'bones', quantity: 5 }, { type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        in_progress_embrune_101_22: {
            npcName: 'Prayer Guide',
            npcIcon: '/assets/npcChatHeads/prayer_guide.png',
            text: "You feel it, don't you? The warmth of the light. As you grow stronger, you may travel to the city of Sanctity. There, the faithful undergo trials to obtain total protection from blades, arrows, and spells.",
            responses: [
                { text: "Total protection?", next: 'prayer_lore_2' }
            ]
        },
        prayer_lore_2: {
            npcName: 'Prayer Guide',
            npcIcon: '/assets/npcChatHeads/prayer_guide.png',
            text: "Indeed. But that is for later. For now, head north to the tavern. The Manager there is looking for someone with your... versatile set of skills. Go with the light.",
            responses: [
                { text: "Thank you.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        in_progress_embrune_101_23: {
            npcName: 'Tavern Manager',
            npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
            text: "Welcome to the hearth! A tavern is an adventurer's second home. We offer rest to heal your wounds and restore your energy. We're also a hub for gossip and information—the kind you won't find in any library.",
            responses: [
                { text: "What else can I do here?", next: 'tavern_lore_1' }
            ]
        },
        tavern_lore_1: {
            npcName: 'Tavern Manager',
            npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
            text: "Opportunity! See that board over there? That's the Quest Board. Local folks post their problems there, and we pay the bounties. It's good work if you can get it. Go ahead, check the board and accept the 'Magical Pest Control' task.",
            highlight: 'activity-button-2',
            responses: [
                { text: "I'll take a look.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        in_progress_embrune_101_25: {
            npcName: 'Magic Guide',
            npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
            text: "*The air in the corner suddenly ripples like water, collapsing into a pinpoint of blinding light before expanding into the form of a robed man.* Salutations, most esteemed guest! I trust my sudden manifestation has not overly perturbed your constitution? I am Elmsworth, a seeker of the unseen. I understand you've just accepted a contract to deal with a... vermin problem?",
            responses: [
                { text: "You just... appeared!", next: 'magic_regal_1' }
            ]
        },
        magic_regal_1: {
            npcName: 'Magic Guide',
            npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
            text: "Teleportation, my dear friend. A trifle for one well-versed in the Arcane. Since you seek to eradicate a pest, might I suggest a more... elegant solution than a simple blade? The Weave is waiting for a conductor.",
            responses: [
                { text: "Teach me.", next: 'magic_regal_2' }
            ]
        },
        magic_regal_2: {
            npcName: 'Magic Guide',
            npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
            text: "I shall provide the reagents. Take these runes. Open your spellbook, select 'Gust Dart', and unleash the elements upon that rodent. It is time for you to learn the true potential of your mind.",
            highlight: ['side-panel-button-spellbook', 'activity-button-3'],
            responses: [
                { text: "I'm ready.", actions: [{ type: 'give_item', itemId: 'gust_rune', quantity: 50 }, { type: 'give_item', itemId: 'binding_rune', quantity: 50 }, { type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        in_progress_embrune_101_27: {
            npcName: 'Tavern Manager',
            npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
            text: "Hah! I saw the sparks from here! The rat is gone, and the floor is only slightly scorched. Excellent work. Speak to the Wizard one last time before you head to the mainland.",
            responses: [
                { text: "Will do.", actions: [{ type: 'advance_quest', questId: 'embrune_101' }] }
            ]
        },
        in_progress_embrune_101_28: {
            npcName: 'Magic Guide',
            npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
            text: "You've handled the Weave with remarkable poise. Beyond this sanctuary lies a vast world—from the gleaming spires of Silverhaven to the desolate dunes of Fouthia. There is much to see, and much to master.",
            responses: [
                { text: "I am ready to depart.", next: 'magic_regal_3' }
            ]
        },
        magic_regal_3: {
            npcName: 'Magic Guide',
            npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
            text: "Then let us not delay. Simply say the word, and I shall whisk you away to the square of Meadowdale. May your path be illuminated by wisdom.",
            responses: [
                { text: "Teleport me now.", actions: [{ type: 'teleport', poiId: 'meadowdale_square' }, { type: 'complete_tutorial' }] }
            ]
        },
        in_progress_embrune_101_29: {
            npcName: 'Magic Guide',
            npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
            text: "Safe travels, adventurer. The world of Embrune awaits.",
            responses: [
                { text: "To the mainland!", actions: [{ type: 'teleport', poiId: 'meadowdale_square' }, { type: 'complete_tutorial' }] }
            ]
        }
    }
};