import { Quest, SkillName } from '../../types';

export const ancientBlade: Quest = {
    id: 'ancient_blade',
    name: 'An Ancient Blade',
    description: "A rusty sword found by chance might be restorable by a master smith.",
    isHidden: true,
    startHint: "This is a hidden quest. It is started by showing a Rusty Iron Sword to Valerius the smith.",
    triggerItem: {
        itemId: 'rusty_iron_sword',
        npcName: 'Valerius the Master Smith',
        startNode: 'item_trigger_ancient_blade'
    },
    playerStagePerspectives: [
        "I should show this rusty sword to Valerius the smith.",
        "Valerius needs 5 Iron Ore to restore the sword.",
        "I should talk to Valerius now that I've given him the ore."
    ],
    completionSummary: "I found a rusty old sword and took it to Valerius. With some iron ore I provided, he was able to restore it to a fine Iron Sword for me.",
    stages: [
        {
            description: 'Show the Rusty Iron Sword to Valerius the Master Smith in Meadowdale.',
            requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' }
        },
        {
            description: 'Bring 5 Iron Ore to Valerius to restore the sword.',
            requirement: { type: 'gather', items: [{ itemId: 'iron_ore', quantity: 5 }] }
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
    dialogue: {
        item_trigger_ancient_blade: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "By the forge... where did you get that rusty sword? It's ancient, but the balance... the craftsmanship is remarkable. I could restore this blade, but I'll need some materials.",
            responses: [
                { text: "What do you need?", next: 'details_ancient_blade' }
            ]
        },
        details_ancient_blade: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "The core is iron. I'll need 5 Iron Ores to reforge the blade and draw out its true strength. Bring them to me, and I'll see what I can do. It would be a crime to let a blade like this turn to dust.",
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
        in_progress_ancient_blade_1: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Have you gathered those 5 Iron Ores yet? That old sword is practically humming, waiting to be reborn.",
            responses: []
        },
        silly_ancient_blade: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Well thats quite a peculiar thing to just be carrying around with you, but no matter, give me a moment and I'll fix it right up for you! In fact, I'll even throw in some of my coal to make it better!",
            responses: [
                { text: "Sounds good, here's the iron ore.", actions: [{ type: 'take_item', itemId: 'iron_ore', quantity: 5}, { type: 'take_item', itemId: 'rusty_iron_sword', quantity: 1}, { type: 'complete_quest', questId: 'ancient_blade'}]}, 
            ]
        },
        in_progress_ancient_blade_2: {
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