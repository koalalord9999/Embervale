
import { Quest, SkillName } from '../../types';

export const artOfTheWarhammer: Quest = {
    id: 'art_of_the_warhammer',
    name: "Art of the Warhammer",
    description: "Bronn the retired adventurer in Oakhaven's tavern seems to think modern smiths have lost the touch for making proper warhammers. He has challenged you to prove him wrong.",
    isHidden: false,
    startHint: "Speak to Bronn in The Carved Mug after proving your worth by completing 'The Capital's Call'.",
    playerStagePerspectives: [
        "Bronn wants me to learn the 'true' art of smithing warhammers from Valerius in Meadowdale.",
        "Valerius has taught me the technique. Now I need to prove my skill by smithing a Steel Warhammer.",
        "I've smithed the Steel Warhammer. I should show it to Bronn in Oakhaven."
    ],
    completionSummary: "I learned the art of crafting warhammers from Valerius and proved my skill to Bronn. He was impressed and rewarded me with his old hammer. I can now smith all tiers of warhammers.",
    stages: [
        {
            description: "Speak to Valerius the Master Smith in Meadowdale.",
            requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' }
        },
        {
            description: "Smith a Steel Warhammer.",
            requirement: { type: 'smith', itemId: 'steel_warhammer', quantity: 1 }
        },
        {
            description: "Return to Bronn in The Carved Mug with the Steel Warhammer.",
            requirement: { type: 'talk', poiId: 'the_carved_mug', npcName: 'Bronn the Retired Adventurer' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Smithing, amount: 1000 }],
        items: [{ itemId: 'bronns_warhammer', quantity: 1 }],
        coins: 1000,
    },
    dialogueEntryPoints: [
        // Bronn
        {
            npcName: 'Bronn the Retired Adventurer',
            response: {
                text: "You seem to know a lot about weapons.",
                check: {
                    requirements: [
                        { type: 'quest', questId: 'art_of_the_warhammer', status: 'not_started' },
                        { type: 'quest', questId: 'capitals_call', status: 'completed' }
                    ],
                    successNode: 'aotw_intro',
                    failureNode: ''
                }
            }
        },
        {
            npcName: 'Bronn the Retired Adventurer',
            response: {
                text: "About learning to make a warhammer...",
                check: { requirements: [{ type: 'quest', questId: 'art_of_the_warhammer', status: 'in_progress', stage: 0 }], successNode: 'aotw_in_progress_0', failureNode: '' }
            }
        },
        {
            npcName: 'Bronn the Retired Adventurer',
            response: {
                text: "I've smithed the Steel Warhammer.",
                check: { requirements: [{ type: 'quest', questId: 'art_of_the_warhammer', status: 'in_progress', stage: 2 }], successNode: 'aotw_in_progress_2', failureNode: '' }
            }
        },
        // Valerius
        {
            npcName: 'Valerius the Master Smith',
            response: {
                text: "I've been tasked with crafting a weapon, and was told you're the only one who still knows how to craft it?",
                check: { requirements: [{ type: 'quest', questId: 'art_of_the_warhammer', status: 'in_progress', stage: 0 }], successNode: 'aotw_valerius_intro', failureNode: '' }
            }
        },
        {
            npcName: 'Valerius the Master Smith',
            response: {
                text: "I haven't forged the warhammer yet.",
                check: { requirements: [{ type: 'quest', questId: 'art_of_the_warhammer', status: 'in_progress', stage: 1 }], successNode: 'aotw_valerius_in_progress_1', failureNode: '' }
            }
        }
    ],
    dialogue: {
        // Bronn's Dialogue
        aotw_intro: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Bah! Look at this shoddy craftsmanship. These young smiths... they only know how to make pointy sticks. There's no art to it! No soul! Not like in my day.",
            responses: [
                { text: "What's wrong with the weapons today?", next: 'aotw_intro_2' },
                { text: "You sound like an old man yelling at clouds.", next: 'aotw_bronns_dismissal_1' }
            ]
        },
        aotw_bronns_dismissal_1: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "And you sound like a whelp who wouldn't know a good weapon if it bit him! Go on, get out of my sight before I mistake you for a training dummy.",
            responses: []
        },
        aotw_intro_2: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "They've forgotten the art of the warhammer! The weight, the balance, the satisfying crunch when it meets a goblin's skull... a true weapon for a true warrior! I bet you couldn't even make one if you tried.",
            responses: [
                { text: "Is that a challenge?", next: 'aotw_challenge' },
                { text: "A warhammer? Isn't that a bit... brutish?", next: 'aotw_brutish_response' }
            ]
        },
        aotw_brutish_response: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Brutish? Hah! A sword is for dancing. A warhammer is for *ending the dance*. It takes more skill than you'd think. Now, are you up for it or not?",
            responses: [
                { text: "Fine, you've convinced me. It's a challenge.", next: 'aotw_challenge' },
                { text: "No, I prefer dancing.", next: 'aotw_bronns_dismissal_2' }
            ]
        },
        aotw_challenge: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Hah! Maybe it is. If you want to learn, don't bother with these Oakhaven artisans. Go to Meadowdale. See the Master Smith, Valerius. He's an old traditionalist like me. If anyone still knows the true art, it's him. Tell him Bronn sent you.",
            responses: [
                { text: "Alright, I'll go speak with Valerius.", actions: [{ type: 'start_quest', questId: 'art_of_the_warhammer' }], next: 'aotw_quest_start_final' },
                { text: "Go all the way to Meadowdale? No thanks.", next: 'aotw_bronns_dismissal_2' }
            ]
        },
        aotw_quest_start_final: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Good. Don't come back until you've learned something. And tell Valerius I said his last batch of ale was weak as ditchwater!",
            responses: []
        },
        aotw_bronns_dismissal_2: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Bah! Another disappointment. Go on then, run along and play with your pointy toothpicks. Leave the real work to the real warriors.",
            responses: []
        },
        aotw_in_progress_0: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Still here? Valerius isn't getting any younger. You'll find him at the smithy in Meadowdale.",
            responses: []
        },
        aotw_in_progress_2: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Let me see it... By my broken hammer, you've actually done it! The balance is right, the weight is perfect... it has the soul of a warrior's weapon! I'm impressed, truly.",
            responses: [
                { text: "It was a good lesson. Valerius is a true master.", actions: [{ type: 'take_item', itemId: 'steel_warhammer', quantity: 1 }, { type: 'complete_quest', questId: 'art_of_the_warhammer' }], next: 'aotw_completion' },
                { text: "It was a lot of work just to prove a point.", actions: [{ type: 'take_item', itemId: 'steel_warhammer', quantity: 1 }, { type: 'complete_quest', questId: 'art_of_the_warhammer' }], next: 'aotw_completion_grudging' }
            ]
        },
        aotw_completion: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "He is, isn't he? I knew you'd see. You've earned this. My fighting days are over, but this hammer... it has seen more battles than you've had hot meals. It served me well against the undead hordes in the old wars. May it serve you just as faithfully.",
            responses: []
        },
        aotw_completion_grudging: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "And the point is well-made! Craftsmanship matters! Now stop your whining. You've earned this. My fighting days are over, but this hammer... it has seen more battles than you've had hot meals. It served me well against the undead hordes in the old wars. May it serve you just as faithfully.",
            responses: []
        },
        aotw_post_quest: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Good to see a proper smith. How's that hammer treating you? It has a way of... unsettling the dead.",
            responses: []
        },

        // Valerius's Dialogue
        aotw_valerius_intro: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Ah! I see, so Bronn asked you to get me to help create a weapon? I can defintely do that, but first... Have you helped me before?",
            responses: [
                { text: "(Tell him about your apprenticeship)", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'completed' }], successNode: 'aotw_valerius_success', failureNode: 'aotw_valerius_fail' } },
                { text: "Bronn said you were the only one who knows how to smith a real weapon. The warhammer.", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'completed' }], successNode: 'aotw_valerius_flattery', failureNode: 'aotw_valerius_fail' } },
                { text: "He also said your ale tastes like ditchwater.", next: 'aotw_valerius_ale_comment' }
            ]
        },
        aotw_valerius_ale_comment: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Ditchwater?! That ungrateful old goat! I brew that ale myself! After all these years, he still knows how to get under my skin. Figures he'd send a messenger just to insult my brewing. Now, apart from delivering insults, what did that old fool *really* want?",
            responses: [
                { text: "He wants me to learn how to make a proper weapon, like a warhammer.", next: 'aotw_valerius_intro_after_ale' }
            ]
        },
        aotw_valerius_intro_after_ale: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "A warhammer, eh? Of course. Only a real weapon for a real warrior. And he thinks you're up to the task? You didn't tell me earlier, but have you learned the basics from me yet?",
            responses: [
                { text: "(Tell him about your apprenticeship)", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'completed' }], successNode: 'aotw_valerius_success', failureNode: 'aotw_valerius_fail' } },
                { text: "I'm a fast learner.", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'completed' }], successNode: 'aotw_valerius_flattery', failureNode: 'aotw_valerius_fail' } },
            ]
        },
        aotw_valerius_flattery: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Hah! He's not wrong. That old fool knows good steel, I'll give him that. And I remember you. You showed some promise. So, you want to learn the art of the hammer? Fine. Pay attention, this is a lesson you only get once.",
            responses: [
                { text: "(Listen intently)", next: 'aotw_valerius_lesson' },
                { text: "Just show me what to do. I'm a fast learner.", next: 'aotw_valerius_lesson' }
            ]
        },
        aotw_valerius_fail: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Just as I thought. Another greenhorn. Come back when you've at least learned how to make a simple dagger. I don't have time to teach the absolute basics.",
            responses: []
        },
        aotw_valerius_success: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Ah, I remember you. You showed some promise. So Bronn thinks you're ready for warhammers, does he? Very well. The secret is in the weighting and the hafting. It's not just about smashing things; it's about controlled, focused power. Pay attention...",
            responses: [
                { text: "(Listen intently)", next: 'aotw_valerius_lesson' }
            ]
        },
        aotw_valerius_lesson: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "There. I've shown you the technique. The knowledge is yours now, and you can smith any warhammer you have the materials and level for. But knowledge is useless without practice. Go and smith me a Steel Warhammer. Then we'll see if you truly learned anything.",
            responses: [
                { text: "I'll forge one right away.", actions: [{ type: 'advance_quest', questId: 'art_of_the_warhammer' }], next: 'aotw_valerius_lesson_end' },
                { text: "A Steel Warhammer? That's a lot of materials.", next: 'aotw_valerius_dismissal' }
            ]
        },
        aotw_valerius_lesson_end: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Good. Don't waste my time.",
            responses: []
        },
        aotw_valerius_dismissal: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Of course it is! Greatness isn't forged from scraps. If you're not willing to put in the resources and the sweat, then you're not worthy of the knowledge. Get out of my smithy.",
            responses: []
        },
        aotw_valerius_in_progress_1: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Are you just going to stand there? The forge is hot and the anvil is waiting. I need a Steel Warhammer to see if you've been paying attention.",
            responses: []
        },
    }
};
