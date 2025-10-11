import { Quest, SkillName } from '../../types';

export const missingShipment: Quest = {
    id: 'missing_shipment',
    name: "Missing Shipment",
    description: "You recovered a crate of stolen goods from the Bandit Leader. The shipping label indicates it was bound for Silverhaven.",
    isHidden: true,
    startHint: "Examine the Stolen Caravan Goods in your inventory.",
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
    dialogue: {
        in_progress_missing_shipment_0: {
            npcName: 'Merchant Theron',
            npcIcon: '/assets/npcChatHeads/merchant_theron.png',
            text: "My caravan goods! You found them! I thought they were lost forever. The bandits on the King's Road have been a plague on my business. Thank you, adventurer. Please, take this for your trouble.",
            responses: [
                { text: "Glad I could help.", actions: [{ type: 'give_xp', skill: SkillName.Slayer, amount: 1000 }, { type: 'give_coins', amount: 2000 }, { type: 'give_item', itemId: 'uncut_emerald', quantity: 1 }, { type: 'advance_quest', questId: 'missing_shipment' }] }
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
