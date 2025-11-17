import { Quest, SkillName } from '../../types';

export const lostHeirloom: Quest = {
    id: 'lost_heirloom',
    name: "Lost Heirloom",
    description: "You found a beautiful old necklace. Perhaps someone in the capital city of Silverhaven is missing it.",
    isHidden: true,
    startHint: "Find a Lost Heirloom dropped by a Highwayman on the King's Road and find its owner in Silverhaven.",
    playerStagePerspectives: [
        "I found an old necklace. I should try to find its owner in the capital city of Silverhaven."
    ],
    completionSummary: "I found an old heirloom necklace on my travels. I managed to track down its owner, a woman named Elara, in Silverhaven's residential district. She was overjoyed to have it back.",
    stages: [
        {
            description: "Find the owner of the lost heirloom.",
            requirement: { type: 'talk', poiId: 'silverhaven_residential_district', npcName: 'Elara' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Slayer, amount: 350 }],
        items: [{ itemId: 'emerald_necklace', quantity: 1}],
        coins: 1500,
    },
    dialogueEntryPoints: [
        {
            npcName: 'Elara',
            response: {
                text: "I found this necklace. Does it belong to you?",
                check: {
                    requirements: [
                        { type: 'quest', questId: 'lost_heirloom', status: 'not_started' },
                        { type: 'items', items: [{ itemId: 'lost_heirloom', quantity: 1 }] }
                    ],
                    successNode: 'item_trigger_lost_heirloom',
                    failureNode: ''
                }
            }
        }
    ],
    dialogue: {
        elara_default_heirloom: {
            npcName: 'Elara',
            npcIcon: '/assets/npcChatHeads/elara.png',
            text: "It's a lovely day in the capital, isn't it?",
            responses: [],
            conditionalResponses: [
                 { text: '', check: { requirements: [{ type: 'quest', questId: 'lost_heirloom', status: 'completed' }], successNode: 'post_quest_lost_heirloom', failureNode: '' } }
            ]
        },
        item_trigger_lost_heirloom: {
            npcName: 'Elara',
            npcIcon: '/assets/npcChatHeads/elara.png',
            text: "Is that... could it be? My heirloom necklace! I thought it was lost forever! Oh, thank you, thank you, kind stranger! I don't have much, but please, take this as a reward for your honesty.",
            responses: [
                { text: "You're welcome. I'm glad I could return it.", actions: [{ type: 'start_quest', questId: 'lost_heirloom' }, { type: 'advance_quest', questId: 'lost_heirloom' }, { type: 'take_item', itemId: 'lost_heirloom', quantity: 1 }] },
            ]
        },
        post_quest_lost_heirloom: {
            npcName: 'Elara',
            npcIcon: '/assets/npcChatHeads/elara.png',
            text: "It's so good to see you again! I haven't taken off my necklace since you returned it to me. Thank you forever.",
            responses: []
        }
    }
};