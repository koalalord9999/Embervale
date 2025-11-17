
import { Quest, SkillName } from '../../types';

export const aSmithsApprentice: Quest = {
    id: 'a_smiths_apprentice',
    name: "A Smith's Apprentice",
    description: "Valerius the Master Smith is looking for an extra pair of hands to help around the smithy. This could be a good opportunity to learn the craft.",
    startHint: "Speak to Valerius the Master Smith in Meadowdale.",
    playerStagePerspectives: [
        "Valerius needs me to bring him 1 Copper Ore and 1 Tin Ore.",
        "I should bring the ore back to Valerius.",
        "Valerius gave me a Bronze Bar and told me to smith a Bronze Dagger at the anvil.",
        "I've smithed the dagger. I should show it to Valerius."
    ],
    completionSummary: "I helped Valerius the smith by gathering ore for him. He taught me how to smelt it into a bar and then smith that bar into a dagger. I've learned the basics of smithing.",
    stages: [
        {
            description: "Gather 1 Copper Ore and 1 Tin Ore.",
            requirement: { type: 'gather', items: [{ itemId: 'copper_ore', quantity: 1 }, { itemId: 'tin_ore', quantity: 1 }] },
        },
        {
            description: "Return to Valerius the Master Smith.",
            requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' },
            stageRewards: {
                items: [{ itemId: 'bronze_bar', quantity: 1 }],
                xp: [{ skill: SkillName.Smithing, amount: 25 }]
            }
        },
        {
            description: "Use the anvil to smith a Bronze Dagger.",
            requirement: { type: 'smith', itemId: 'bronze_dagger', quantity: 1 }
        },
        {
            description: "Show the Bronze Dagger to Valerius.",
            requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Smithing, amount: 100 }],
        coins: 100
    },
    dialogueEntryPoints: [
        { npcName: 'Valerius the Master Smith', response: { text: "I've smithed the dagger.", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 3 }], successNode: 'in_progress_a_smiths_apprentice_3', failureNode: '' } } },
        { npcName: 'Valerius the Master Smith', response: { text: "About the dagger...", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 2 }], successNode: 'in_progress_a_smiths_apprentice_2', failureNode: '' } } },
        { npcName: 'Valerius the Master Smith', response: { text: "I have the ores you asked for.", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 1 }], successNode: 'in_progress_a_smiths_apprentice_1', failureNode: '' } } },
        { npcName: 'Valerius the Master Smith', response: { text: "About the apprenticeship...", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 0 }], successNode: 'in_progress_a_smiths_apprentice_0', failureNode: '' } } },
        { npcName: 'Valerius the Master Smith', response: { text: "I'm looking for work.", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'not_started' }], successNode: 'quest_intro_a_smiths_apprentice', failureNode: '' } } }
    ],
    dialogue: {
        quest_intro_a_smiths_apprentice: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Help? Hah! You've got the look of someone not afraid of a bit of hard work. This town was built on the sweat of good smiths, but the young folk these days... they'd rather read books in the library. I could use a hand, and you could learn a skill that'll save your life. Interested?",
            responses: [
                { text: "I'm always ready to learn. What do you need?", next: 'details_a_smiths_apprentice' },
                { text: "Sorry, I've got books to read.", next: 'decline_smithing_quest' },
            ],
        },
        decline_smithing_quest: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Hmph. Another one. Go on then, bury your nose in dusty pages. See if a book will stop a goblin's blade. The forge is here if you change your mind.",
            responses: []
        },
        details_a_smiths_apprentice: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Every great blade starts as ugly rock. I need ore. The Stonebreak Mine is full of Copper and Tin. Bring me one of each. Do that, and I'll teach you the first, most important lesson of the forge: turning worthless stone into something strong.",
            responses: [
                { text: "I'll be back with your ore.", actions: [{ type: 'start_quest', questId: 'a_smiths_apprentice' }] },
            ],
        },
        a_smiths_apprentice_progress_router: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: '',
            responses: [],
            conditionalResponses: [
                { text: '', check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 0 }], successNode: 'in_progress_a_smiths_apprentice_0', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 1 }], successNode: 'in_progress_a_smiths_apprentice_1', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 2 }], successNode: 'in_progress_a_smiths_apprentice_2', failureNode: '' } },
                { text: '', check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 3 }], successNode: 'in_progress_a_smiths_apprentice_3', failureNode: '' } },
            ]
        },
        in_progress_a_smiths_apprentice_0: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "The forge doesn't wait forever, you know. That copper and tin isn't going to mine itself. Get to it.",
            responses: []
        },
        in_progress_a_smiths_apprentice_1: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Ah, good! Let's see... yes, this will do. Good quality. Now for your first lesson. You see, when you heat copper and tin together... you create bronze. Stronger than both.",
            responses: [
                { text: "Continue", next: 'in_progress_a_smiths_apprentice_1_continued'}
            ]
        },
        in_progress_a_smiths_apprentice_1_continued: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "That's the heart of smithing: making things better than they were before. Here, take this bar I've smelted for you. Now, to the anvil! Turn that metal into a Bronze Dagger.",
            responses: [
                { text: "Thank you, I'll get to it.", actions: [{ type: 'advance_quest', questId: 'a_smiths_apprentice' }, { type: 'take_item', itemId: 'copper_ore', quantity: 1 }, { type: 'take_item', itemId: 'tin_ore', quantity: 1 }, { type: 'give_item', itemId: 'hammer', quantity: 1 }] }
            ]
        },
        in_progress_a_smiths_apprentice_2: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "The anvil is for hammering, not for admiring! Get that hammer swinging and shape the metal. It's all about heat, pressure, and knowing when to strike.",
            responses: []
        },
        in_progress_a_smiths_apprentice_3: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Let me see... a bit rough around the edges, but the blade is true. Not bad at all for a first try! You've got the spark. With practice, you could be a great smith. Here's something for your trouble. Keep at it.",
            responses: [
                { text: "Thank you for the lesson!", actions: [{ type: 'advance_quest', questId: 'a_smiths_apprentice' }] }
            ]
        },
        post_quest_a_smiths_apprentice: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Good to see you again, apprentice. Remember what I taught you: heat, pressure, and a strong arm. That's all there is to it... mostly. How's the forge treating you?",
            conditionalResponses: [ 
                { text: 'About the Ancient blade', check: { requirements: [{ type: 'quest', questId: 'ancient_blade', status: 'in_progress' }, { type: 'items', items: [{ itemId: 'iron_ore', quantity: 5 }] }, { type: 'items', items: [{ itemId: 'rusty_iron_sword', quantity: 1 }] }], successNode: 'in_progress_ancient_blade_2', failureNode: '' }},
                { text: 'About the Ancient blade', check: { requirements: [{ type: 'quest', questId: 'ancient_blade', status: 'in_progress' }, { type: 'items', items: [{ itemId: 'iron_ore', quantity: 5, operator: 'lt'}]}], successNode: 'in_progress_ancient_blade_1', failureNode: ''}},
                { text: 'About the Ancient blade', check: { requirements: [{ type: 'quest', questId: 'ancient_blade', status: 'in_progress' }, { type: 'items', items: [{ itemId: 'iron_ore', quantity: 5}, { itemId: 'rusty_iron_sword', quantity: -1}]}], successNode: 'only_ore_ancient_blade', failureNode: ''}}
            ],
            responses: []
        }
    }
};
