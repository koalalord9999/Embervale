
import { Quest, SkillName } from '../../types';

export const banditToll: Quest = {
    id: 'bandit_toll',
    name: 'Bandit Toll',
    description: "The road to the southern town of Oakhaven is plagued by bandits, disrupting trade. The clerk in Meadowdale's town hall is offering a reward for clearing them out.",
    startHint: "Speak to Clerk Augustus in the Meadowdale Town Hall about the trouble on the southern road.",
    playerStagePerspectives: [
        "I need to defeat 5 of the Cloaked Bandits on the road to Oakhaven.",
        "I should return to Clerk Augustus in Meadowdale to claim my reward."
    ],
    completionSummary: "I cleared out the bandits who were blocking the road to Oakhaven. With the trade route reopened, Clerk Augustus paid me a handsome bounty.",
    stages: [
        {
            description: 'Defeat 5 Cloaked Bandits on the road to Oakhaven.',
            requirement: { type: 'kill', monsterId: 'cloaked_bandit', quantity: 5 },
        },
        {
            description: 'Return to Clerk Augustus at the Town Hall in Meadowdale to claim your reward.',
            requirement: { type: 'talk', poiId: 'town_hall', npcName: 'Clerk Augustus' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Strength, amount: 200 }],
        coins: 500,
    },
    dialogueEntryPoints: [
        { npcName: 'Clerk Augustus', response: { text: "Is there any work available?", check: { requirements: [{ type: 'quest', questId: 'bandit_toll', status: 'not_started' }], successNode: 'quest_intro_bandit_toll', failureNode: '' } } },
        { npcName: 'Clerk Augustus', response: { text: "About the bandit problem...", check: { requirements: [{ type: 'quest', questId: 'bandit_toll', status: 'in_progress', stage: 0 }], successNode: 'in_progress_bandit_toll_0', failureNode: '' } } },
        { npcName: 'Clerk Augustus', response: { text: "I've dealt with the bandits on the southern road.", check: { requirements: [{ type: 'quest', questId: 'bandit_toll', status: 'in_progress', stage: 1 }], successNode: 'in_progress_bandit_toll_1', failureNode: '' } } },
        { npcName: 'Clerk Augustus', response: { text: "How is trade with Oakhaven?", check: { requirements: [{ type: 'quest', questId: 'bandit_toll', status: 'completed' }], successNode: 'post_quest_bandit_toll', failureNode: '' } } }
    ],
    dialogue: {
        quest_intro_bandit_toll: {
            npcName: 'Clerk Augustus',
            npcIcon: '/assets/npcChatHeads/clerk_augustus.png',
            text: "Work? As a matter of fact, yes! Thank the founders. I'm at my wit's end. The lifeblood of this town, our trade with Oakhaven to the south, has been severed by a pack of audacious thugs. They've set up a blockade and are calling it a 'toll'. Extortion, is what it is!",
            responses: [
                { text: "Tell me about the trade situation.", next: 'situation_bandit_toll' },
                { text: "Sounds like a job for the guards.", next: 'guards_response_augustus' },
            ],
        },
        guards_response_augustus: {
            npcName: 'Clerk Augustus',
            npcIcon: '/assets/npcChatHeads/clerk_augustus.png',
            text: "The town guard is stretched thin as it is, what with the goblins in the mine and strange beasts in the woods. Their mandate is to protect the town itself, not patrol the highways. It's a frustrating piece of bureaucracy, but it means we must rely on... freelance peacekeepers such as yourself.",
            responses: [
                { text: "I see. So what's the problem with the trade route?", next: 'situation_bandit_toll' }
            ]
        },
        situation_bandit_toll: {
            npcName: 'Clerk Augustus',
            npcIcon: '/assets/npcChatHeads/clerk_augustus.png',
            text: "Oakhaven is a town of artisans. We rely on their crafted goods, their fine leathers, their expert fletching supplies. In return, they need our food from the ranches and ore from the mines. These bandits aren't just robbing travelers, they're starving our economy. I need someone to send a message... a firm, sharp message.",
            responses: [
                { text: "And you're willing to pay for this message?", next: 'job_bandit_toll' },
            ],
        },
        job_bandit_toll: {
            npcName: 'Clerk Augustus',
            npcIcon: '/assets/npcChatHeads/clerk_augustus.png',
            text: "Handsomely. The Meadowdale council has authorized a significant bounty. Remove five of these roadblocks—permanently—and you will be rewarded not just with coin, but with the gratitude of two towns. The road to Oakhaven simply must be reopened. Can you do this?",
            responses: [
                { text: "Consider it done. I'll clear the road.", actions: [{ type: 'start_quest', questId: 'bandit_toll' }] },
                { text: "I'd rather not get my hands dirty." },
            ],
        },
        in_progress_bandit_toll_0: {
            npcName: 'Clerk Augustus',
            npcIcon: '/assets/npcChatHeads/clerk_augustus.png',
            text: "Every moment you delay, another merchant considers taking their business elsewhere. Are the roads clear yet? My ledgers are starting to look grim.",
            responses: []
        },
        in_progress_bandit_toll_1: {
            npcName: 'Clerk Augustus',
            npcIcon: '/assets/npcChatHeads/clerk_augustus.png',
            text: "You have? Truly? I can hear the sound of commerce returning already! You've done a great service not just to Meadowdale, but to Oakhaven as well. On behalf of the council, please accept this bounty. You've more than earned it.",
            responses: [
                { text: "A pleasure doing business.", actions: [{ type: 'advance_quest', questId: 'bandit_toll' }] }
            ]
        },
        post_quest_bandit_toll: {
            npcName: 'Clerk Augustus',
            npcIcon: '/assets/npcChatHeads/clerk_augustus.png',
            text: "Thanks to you, adventurer, commerce with Oakhaven is flowing once more! The whole town is grateful. The markets are bustling again.",
            responses: []
        }
    }
};
