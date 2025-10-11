import { Quest, SkillName } from '../../types';

export const goblinMenace: Quest = {
    id: 'goblin_menace',
    name: 'Goblin Menace',
    description: "Old Man Fitzwilliam is being driven mad by a racket coming from the Stonebreak Mine. He suspects goblins are to blame.",
    startHint: "Speak to Old Man Fitzwilliam in the Meadowdale Square.",
    startDialogueNode: 'quest_intro_goblin_menace',
    playerStagePerspectives: [
        "I need to take care of 5 goblins in the Stonebreak Mine to stop the racket.",
        "I should let Old Man Fitzwilliam know the goblins have been dealt with."
    ],
    completionSummary: "I dealt with the goblin problem in the mines. The racket has stopped, and Old Man Fitzwilliam paid me for my work.",
    stages: [
        {
            description: "Convince 5 goblins in the Stonebreak Mine to cease their 'musical' activities.",
            requirement: { type: 'kill', monsterId: 'goblin', quantity: 5 },
        },
        {
            description: 'Return to Old Man Fitzwilliam in Meadowdale to report your success.',
            requirement: { type: 'talk', poiId: 'meadowdale_square', npcName: 'Old Man Fitzwilliam' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Attack, amount: 100 }],
        coins: 200
    },
    dialogue: {
        quest_intro_goblin_menace: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "Troubled? I'm beyond troubled! I'm incensed! It's this dreadful racket coming from the Stonebreak Mine. Day and night, clang, clang, bash! It's an affront to civilized ears! A man can't get a moment's peace!",
            responses: [
                { text: "What kind of racket?", next: 'situation_goblin_menace' },
                { text: "Have you tried earplugs?", next: 'earplugs_response' },
            ]
        },
        earplugs_response: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "Earplugs?! Don't be absurd! It's the principle of the thing! I shouldn't have to plug my own ears in my own town square because of some subterranean hooligans! Now are you going to help or are you going to offer daft suggestions?",
            responses: [
                { text: "Alright, alright. Tell me about the racket.", next: 'situation_goblin_menace' }
            ]
        },
        situation_goblin_menace: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "It can only be one thing: goblins. They've infested the old mine again. They're probably banging rocks together and calling it music. It's scaring the birds, it's wilting my prize-winning petunias, and I haven't had a decent afternoon nap in a week!",
            responses: [
                { text: "Why don't the guards do something?", next: 'guards_response' },
                { text: "What do you want me to do about it?", next: 'job_goblin_menace' },
            ]
        },
        guards_response: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "The guards! Hah! They're too busy... guarding! Polishing their helmets and watching the gates for threats that are already under our feet. 'Official jurisdiction,' they say. Bureaucratic nonsense! It falls to citizens of action, like you, to solve real problems.",
            responses: [
                { text: "I see. So what's the job?", next: 'job_goblin_menace' },
            ]
        },
        job_goblin_menace: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "The job is simple: pest control. Go in there and give them a taste of their own medicine! A little 'persuasion', if you will. Silence five of those noisy little brutes, and I'll make it worth your while. My sanity is a valuable thing, you know.",
            responses: [
                { text: "Alright, I'll restore the peace. For a price.", actions: [{ type: 'start_quest', questId: 'goblin_menace' }] },
                { text: "Sounds dangerous. Not my problem." },
            ]
        },
        in_progress_goblin_menace_0: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "What are you waiting for? My ears are still ringing! Get over to that mine and sort out those noisy goblins!",
            responses: []
        },
        in_progress_goblin_menace_1: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "Ah, the sweet sound of... blessed silence! You've done it! My head feels clearer already. The birds are singing again! Here's your reward, well-earned.",
            responses: [
                { text: "Glad I could help.", actions: [{ type: 'advance_quest', questId: 'goblin_menace' }] }
            ]
        },
        post_quest_goblin_menace: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "Ah, adventurer! It's so peaceful now, I can finally hear myself think. Thank you again for taking care of that goblin nuisance.",
            responses: []
        }
    }
};