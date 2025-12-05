
import { Quest, SkillName } from '../../types';

export const ancientBlade: Quest = {
    id: 'ancient_blade',
    name: 'An Ancient Blade',
    description: "A rusty sword found by chance might be restorable by a master smith.",
    isHidden: true,
    startHint: "This is a hidden quest. It is started by showing a Rusty Iron Sword to Valerius the smith.",
    playerStagePerspectives: [
        "Valerius needs 5 Iron Ore to restore the sword.",
        "I should talk to Valerius now that I've given him the ore."
    ],
    completionSummary: "I found a rusty old sword and took it to Valerius. With some iron ore I provided, he was able to restore it to a fine Steel Scimitar for me.",
    stages: [
        {
            description: 'Bring 5 Iron Ore to Valerius to restore the sword.',
            requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' }
        },
        {
            description: 'Talk to Valerius to receive your restored sword.',
            requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Smithing, amount: 250 }],
        items: [{ itemId: 'steel_scimitar', quantity: 1 }],
    },
    dialogueEntryPoints: [
        { npcName: 'Valerius the Master Smith', response: { text: "What do you know about old swords?", check: { requirements: [{ type: 'quest', questId: 'ancient_blade', status: 'not_started' }], successNode: 'start_ancient_blade', failureNode: '' } } },
        { npcName: 'Valerius the Master Smith', response: { text: "I am coming back for some information.", check: { requirements: [{ type: 'quest', questId: 'ancient_blade', status: 'in_progress', stage: 0 }], successNode: 'in_progress_ancient_blade_0', failureNode: '' } } }
    ],
    dialogue: {
        start_ancient_blade: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "I am quite knowledgable when it comes to historical blades, I've been around long enough, I may have even made some of them myself.",
            responses: [
                { text: "What kind of swords have you worked on?", next: 'lore_ancient_blade' }
            ],
            conditionalResponses: [
                { text: "What can you tell me about this old sword I found in a well?", check: {requirements: [{ type: 'items', items: [{ itemId: 'rusty_iron_sword', quantity: 1}] }], successNode: 'intro_ancient_blade', failureNode: '' }}
            ]
        },
        lore_ancient_blade: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: 'I\'ve made a sword for the King of Silverhaven, named Silvthrill the Undead Slayer. It is mostly a decoration piece, but I enhanced the durability by imbuing Runic bars and Silver Bars together so that if needed, it could be used as a powerful weapon against the undead.',
            responses: []
        },
        intro_ancient_blade: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: 'Let me see here... *Valerius pulls up his goggles* Hmm. Yes. This seems familiar... OH! That old coot... How dare he throw my sword in a well!',
            responses: [
                { text: "Who threw it away?", next: 'owner_ancient_blade'},
                { text: "I'm not really worried about its history, how can I get it repaired? I'm in need of a new weapon.", next: 'details_ancient_blade'}
            ]
        },
        owner_ancient_blade: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: 'I gave this sword to Sir Fitswilliam decades ago... Back when he wasn\'t a senile old man. He was quite the adventurer back in the day. It was more of a sparring sword for him at the time, to hone his techniques.',
            responses: [
                { text: 'Interesting... Would you be able to repair it for me?', next: 'pre_details_ancient_blade' },
            ]
        },
        pre_details_ancient_blade: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: 'Not a problem, just let me give a thorough inspection first... *He holds out the blade, feeling the weight, balancing it in his hands, swinging it gently* Ah, yes a fine blade I made back then, quite weak compared to what I can do now, but I\'ll give you the details.',
            responses: [
                { text: "Alright, lets hear it.", next: 'details_ancient_blade'}
            ]

        },
        details_ancient_blade: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "The core is iron. I'll need 5 Iron Ores to reforge the blade and draw out its former strength. Bring them to me, and I'll see what I can do. It would be a crime to let a blade like this turn to dust.",
            responses: [
                { text: "I'll get the ore for you.", actions: [{ type: 'start_quest', questId: 'ancient_blade' }] }
            ],
            conditionalResponses: [
                { text: "Just so happens that I have 5 iron ore on me right now. How about that?",
                    check: {
                        requirements: [{ type: 'items', items: [{ itemId: 'iron_ore', quantity: 5 }] }],
                        successNode: 'silly_ancient_blade',
                        failureNode: ''
                    }
                }
            ]
        },
        in_progress_ancient_blade_0: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Have you gathered those 5 Iron Ores yet? That old sword is practically humming, waiting to be reborn.",
            responses: [],
            conditionalResponses: [
                { text: "I have the ore right here.", check: { requirements: [{ type: 'items', items: [{ itemId: 'iron_ore', quantity: 5 }] }], successNode: 'in_progress_ancient_blade_1', failureNode: '' }},
                { text: "No, not yet... I'm struggling to find the ore.", check: { requirements: [{ type: 'items', items: [{ itemId: 'iron_ore', quantity: 5, operator: 'lt'}] }], successNode: 'iron_ore_hint', failureNode: '' }},
            ]
        },
        iron_ore_hint: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "You'll find iron ore veins in the mines, and down there with the dwarves, at the Dwarven Outpost. Some monsters also drop the ore, if you don't want to mine it yourself.",
            responses: [{ text: "Thank you for the hint."}]
        },
        silly_ancient_blade: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Well thats quite a peculiar thing to just be carrying around with you, but no matter, give me a moment and I'll fix it right up for you! In fact, I'll even throw in some of my coal to make it better!",
            responses: [
                { text: "Sounds good, here's the iron ore.", actions: [{ type: 'take_item', itemId: 'iron_ore', quantity: 5}, { type: 'take_item', itemId: 'rusty_iron_sword', quantity: 1}, { type: 'complete_quest', questId: 'ancient_blade'}]}, 
            ]
        },
        in_progress_ancient_blade_1: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Excellent! With this ore, I can restore the blade. Give me a moment... There! Good as new. I even added some of my coal to make it a bit better! A fine Steel Scimitar for your troubles. Take good care of it.",
            responses: [
                { text: "Thank you, Valerius!", actions: [{ type: 'take_item', itemId: 'rusty_iron_sword', quantity: 1}, { type: 'take_item', itemId: 'iron_ore', quantity: 5}, { type: 'complete_quest', questId: 'ancient_blade' }] }
            ]
        },
        only_ore_ancient_blade: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: 'You have the Iron ore, but you don\'t have the sword with you',
            responses: []
        },
        post_quest_ancient_blade: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "How's that old blade holding up? A fine piece of work, if I do say so myself.",
            responses: []
        }
    }
};
