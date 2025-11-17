import { Quest, SkillName } from '../../types';

export const missingShipment: Quest = {
    id: 'missing_shipment',
    name: "Missing Shipment",
    description: "You recovered a crate of stolen goods from the Bandit Leader. The shipping label indicates it was bound for Silverhaven.",
    isHidden: true,
    startHint: "Obtain the Stolen Caravan Goods from the Bandit Leader and find the owner in Silverhaven.",
    playerStagePerspectives: [
        "I've found a crate of stolen goods. The shipping label mentions Silverhaven. I should find a merchant there who might be missing a shipment."
    ],
    completionSummary: "I returned the stolen caravan goods to Merchant Theron in Silverhaven's trade district. He was very grateful and rewarded me well.",
    stages: [
        {
            description: "Return the stolen goods to their rightful owner in Silverhaven.",
            requirement: { type: 'talk', poiId: 'silverhaven_trade_district', npcName: 'Merchant Theron' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Slayer, amount: 1000 }],
        coins: 2000,
        items: [{ itemId: 'uncut_emerald', quantity: 1 }]
    },
    dialogueEntryPoints: [
        {
            npcName: 'Merchant Theron',
            response: {
                text: "I found a crate of stolen goods. Might they be yours?",
                check: {
                    requirements: [
                        { type: 'quest', questId: 'missing_shipment', status: 'not_started' },
                        { type: 'items', items: [{ itemId: 'stolen_caravan_goods', quantity: 1 }] }
                    ],
                    successNode: 'quest_intro_missing_shipment',
                    failureNode: ''
                }
            }
        }
    ],
    dialogue: {
        theron_default: {
            npcName: 'Merchant Theron',
            npcIcon: '/assets/npcChatHeads/merchant_theron.png',
            text: "Welcome to the Silverhaven market! A fine day for trade, wouldn't you say? It would be even better if my latest shipment hadn't been stolen...",
            responses: [],
            conditionalResponses: [
                 { text: '', check: { requirements: [{ type: 'quest', questId: 'missing_shipment', status: 'completed' }], successNode: 'post_quest_missing_shipment', failureNode: '' } }
            ]
        },
        quest_intro_missing_shipment: {
            npcName: 'Merchant Theron',
            npcIcon: '/assets/npcChatHeads/merchant_theron.png',
            text: "My caravan goods! You found them! I thought they were lost forever. The bandits on the King's Road have been a plague on my business. Thank you, adventurer. Please, take this for your trouble.",
            responses: [
                { text: "Glad I could help.", actions: [{ type: 'start_quest', questId: 'missing_shipment' }, { type: 'advance_quest', questId: 'missing_shipment' }, { type: 'take_item', itemId: 'stolen_caravan_goods', quantity: 1 }] }
            ]
        },
        post_quest_missing_shipment: {
            npcName: 'Merchant Theron',
            npcIcon: '/assets/npcChatHeads/merchant_theron.png',
            text: "Thanks to you, my shipments are getting through again. I'm in your debt.",
            responses: []
        }
    }
};