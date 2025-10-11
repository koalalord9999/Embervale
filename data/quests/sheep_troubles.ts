import { Quest, SkillName } from '../../types';

export const sheepTroubles: Quest = {
    id: 'sheep_troubles',
    name: 'Sheep Troubles',
    description: "Rancher McGregor's sheep are getting overgrown. He needs a hand shearing them and preparing the wool.",
    startHint: "Speak to Rancher McGregor at his ranch, west of Meadowdale.",
    startDialogueNode: 'start',
    playerStagePerspectives: [
        "I need to shear 10 sheep in the pen at the ranch.",
        "I need to use the spinning wheel in the barn to turn the 10 pieces of wool into balls of wool.",
        "I should return the 10 balls of wool to Rancher McGregor."
    ],
    completionSummary: "I helped out Rancher McGregor with his overgrown sheep. I sheared ten of them, spun the wool in his barn, and he paid me for the finished balls of wool.",
    stages: [
        {
            description: 'Shear 10 wool from the sheep in the pen.',
            requirement: { type: 'shear', quantity: 10 },
        },
        {
            description: 'Use the spinning wheel in the barn to create 10 balls of wool.',
            requirement: { type: 'spin', quantity: 10 },
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
        quest_intro_sheep_troubles: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "Frazzled? That's putting it mildly! Look at 'em! My prize sheep have gotten so woolly they're starting to roll instead of walk. They're like fluffy, bleating boulders! It's a woolly catastrophe!",
            responses: [
                { text: "They do look rather spherical. What happened?", next: 'problem_sheep_troubles' },
                { text: "Sounds like a you problem.", next: 'you_problem_response' },
            ],
        },
        you_problem_response: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "Well, it'll be your problem too when the price of wool blankets skyrockets before winter! A little help here benefits everyone, you know.",
            responses: [
                { text: "Alright, you've got a point. What's the issue?", next: 'problem_sheep_troubles' }
            ]
        },
        problem_sheep_troubles: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "Spherical! Exactly! It's a woolly catastrophe. My usual shearer is out with a case of the sniffles, and I can't keep up myself. The wool is so thick the poor things can barely see! I need someone to shear ten of 'em for me. The raw wool isn't much use to the weavers in Oakhaven on its own, though.",
            responses: [
                { text: "What needs to be done with it?", next: 'solution_sheep_troubles' },
            ],
        },
        solution_sheep_troubles: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "It needs to be spun into proper balls of wool. I've got a spinning wheel in the barn you can use. If you can shear ten sheep, spin the wool, and bring me back ten finished balls, I'd be mighty grateful. Here, take these shears to get you started. I'll pay you well for your trouble, of course.",
            responses: [
                { text: "You've got a deal. I'll get right on it.", actions: [{ type: 'start_quest', questId: 'sheep_troubles' }, { type: 'give_item', itemId: 'shears', quantity: 1 }] },
                { text: "That sounds like a lot of work." },
            ],
        },
        in_progress_sheep_troubles_0: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "Those sheep aren't going to shear themselves! Grab some shears and get to it. You'll find plenty in the pen.",
            responses: []
        },
        in_progress_sheep_troubles_1: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "That's a fine pile of wool! Now head into the barn and use the spinning wheel to turn it into balls of wool.",
            responses: []
        },
        in_progress_sheep_troubles_2: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "Well I'll be! You've got the knack for it. These are perfect. Thank you kindly, adventurer. Here's your payment, as promised.",
            responses: [
                { text: "Happy to help.", actions: [{ type: 'give_xp', skill: SkillName.Crafting, amount: 150 }, { type: 'give_coins', amount: 300 }, {type: 'take_item', itemId: 'ball_of_wool', quantity: 10}, { type: 'advance_quest', questId: 'sheep_troubles' }] },
            ]
        },
        post_quest_sheep_troubles: {
            npcName: 'Rancher McGregor',
            npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
            text: "Thanks again for helping me with those sheep. It's a relief to have that sorted!",
            responses: []
        }
    }
};
