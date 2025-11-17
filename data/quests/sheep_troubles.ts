
import { Quest, SkillName } from '../../types';

export const sheepTroubles: Quest = {
    id: 'sheep_troubles',
    name: 'Sheep Troubles',
    description: "Rancher McGregor's sheep are getting overgrown. He needs a hand shearing them and preparing the wool.",
    startHint: "Speak to Rancher McGregor at his ranch, west of Meadowdale.",
    playerStagePerspectives: [
        "I need to shear 10 sheep in the pen at the ranch.",
        "I need to use the spinning wheel in the barn to turn the 10 pieces of wool into balls of wool.",
        "I should return the 10 balls of wool to Rancher McGregor."
    ],
    completionSummary: "I helped out Rancher McGregor with his overgrown sheep. I sheared ten of them, spun the wool in his barn, and he paid me for the finished balls of wool.",
    stages: [
        {
            description: 'Shear 10 wool from the sheep in the pen.',
            requirement: { type: 'gather', itemId: 'wool', quantity: 10 },
        },
        {
            description: 'Use the spinning wheel in the barn to create 10 balls of wool.',
            requirement: { type: 'gather', itemId: 'ball_of_wool', quantity: 10 },
        },
        {
            description: 'Return to Rancher McGregor with the 10 balls of wool.',
            requirement: { type: 'talk', poiId: 'mcgregors_ranch', npcName: 'Rancher McGregor' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Crafting, amount: 150 }],
        coins: 300
    },
    dialogue: {
        mcgregor_default: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "Another fine day on the ranch. These sheep are getting a bit too fluffy, though.",
            responses: [],
            conditionalResponses: [
                { text: "You seem to be having some trouble with your sheep.", check: { requirements: [{ type: 'quest', questId: 'sheep_troubles', status: 'not_started' }], successNode: 'quest_intro_sheep_troubles', failureNode: '' } },
                { text: "How am I doing on the shearing task?", check: { requirements: [{ type: 'quest', questId: 'sheep_troubles', status: 'in_progress', stage: 0 }], successNode: 'in_progress_sheep_troubles_0', failureNode: '' } },
                { text: "What do I need to with the wool again?", check: { requirements: [{ type: 'quest', questId: 'sheep_troubles', status: 'in_progress', stage: 1 }], successNode: 'in_progress_sheep_troubles_1', failureNode: '' } },
                { text: "I have the 10 balls of wool for you.", check: { requirements: [{ type: 'quest', questId: 'sheep_troubles', status: 'in_progress', stage: 2 }], successNode: 'in_progress_sheep_troubles_2', failureNode: '' } },
                { text: "How are the sheep faring?", check: { requirements: [{ type: 'quest', questId: 'sheep_troubles', status: 'completed' }], successNode: 'post_quest_sheep_troubles', failureNode: '' } }
            ]
        },
        quest_intro_sheep_troubles: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "Trouble? That's putting it mildly! Look at 'em! They're more wool than sheep at this point. My usual shearer's down with a cold, and I can't keep up! Plus, the weavers in Oakhaven won't take raw wool. It all needs to be spun first.",
            responses: [
                { text: "So you need someone to both shear and spin them?", next: 'st_offer' }
            ]
        },
        st_offer: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "Exactly! If you could shear ten of them, use the spinning wheel in my barn to turn the wool into ten balls, and bring them to me, I'd pay you handsomely. Here, you'll need these shears to get started.",
            responses: [
                { text: "You've got a deal. I'll get right on it.", actions: [{ type: 'start_quest', questId: 'sheep_troubles' }, { type: 'give_item', itemId: 'shears', quantity: 1 }] },
                { text: "That sounds like too much work for me." }
            ]
        },
        in_progress_sheep_troubles_0: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "You've still got more to shear. Keep at it!",
            responses: []
        },
        in_progress_sheep_troubles_1: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "All you need to do is take the wool, and use the spinning wheel there in the barn. It'll make spinning them into balls much easier than knitting them.",
            responses: []
        },
        in_progress_sheep_troubles_2: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "Let's see here...",
            responses: [
                { 
                    text: "(Show McGregor the balls of wool))", 
                    check: {
                        requirements: [{ type: 'items', items: [{ itemId: 'ball_of_wool', quantity: 10 }] }],
                        successNode: 'st_final_success',
                        failureNode: 'st_final_fail'
                    }
                },
            ]
        },
        st_final_success: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "Well I'll be! You've got the knack for it. These are perfect. Thank you kindly, adventurer. Here's your payment, as promised.",
            responses: [
                { text: "Happy to help.", actions: [ { type: 'take_item', itemId: 'ball_of_wool', quantity: 10 }, { type: 'advance_quest', questId: 'sheep_troubles' } ] }
            ]
        },
        st_final_fail: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "Wait a minute... you don't have all ten balls of wool! Are you trying to pull a fast one on old McGregor?",
            responses: []
        },
        post_quest_sheep_troubles: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "The sheep look much happier now, and so do the weavers in Oakhaven! Thanks again for your help.",
            responses: []
        }
    }
};
