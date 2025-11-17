
import { Quest, SkillName } from '../../types';

export const petuniaProblems: Quest = {
    id: 'petunia_problems',
    name: "Petunia Problems",
    description: "Old Man Fitzwilliam's prize-winning petunias are mysteriously dying, and he's not happy about it. He suspects something unnatural is at play.",
    isHidden: false,
    startHint: "Speak to a distraught Old Man Fitzwilliam in Meadowdale Square.",
    playerStagePerspectives: [
        "Fitzwilliam's petunias are blighted. He gave me a soil sample. I should speak with Herbalist Anise in Oakhaven for her expertise.",
        "Anise needs some Grimy Spore Spud to create a cure. Spore Spud grows on Cave Slimes in the Mine Depths.",
        "I have the Grimy Spore Spud. I should clean it and return to Anise in Oakhaven.",
        "Anise gave me a Blight Ward Potion. I need to use it on the soil patch near Fitzwilliam in Meadowdale Square.",
        "Using the potion summoned a Blight Imp! I need to defeat it.",
        "I defeated the imp. I should tell Fitzwilliam the good news."
    ],
    completionSummary: "I solved the mystery of Fitzwilliam's dying petunias. Anise the Herbalist helped me create a potion which revealed a magical Blight Imp was the culprit. After defeating the creature, the flowers are safe and Fitzwilliam is finally quiet.",
    stages: [
        {
            description: "Speak to Herbalist Anise in Oakhaven.",
            requirement: { type: 'talk', poiId: 'oakhaven_herblore_shop', npcName: 'Herbalist Anise' }
        },
        {
            description: "Gather 1 Grimy Spore Spud.",
            requirement: { type: 'gather', items: [{ itemId: 'grimy_spore_spud', quantity: 1 }] }
        },
        {
            description: "Return to Herbalist Anise.",
            requirement: { type: 'talk', poiId: 'oakhaven_herblore_shop', npcName: 'Herbalist Anise' }
        },
        {
            description: "Use the Blight Ward Potion on the blighted soil in Meadowdale Square.",
            requirement: { type: 'talk', poiId: 'meadowdale_square', npcName: 'Use Blight Ward Potion' }
        },
        {
            description: "Defeat the Blight Imp.",
            requirement: { type: 'kill', monsterId: 'blight_imp', quantity: 1 }
        },
        {
            description: "Report your success to Old Man Fitzwilliam.",
            requirement: { type: 'talk', poiId: 'meadowdale_square', npcName: 'Old Man Fitzwilliam' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Herblore, amount: 500 }],
        coins: 1000,
        items: [{ itemId: 'ring_of_preservation', quantity: 1 }]
    },
    dialogueEntryPoints: [
        { npcName: 'Old Man Fitzwilliam', response: { text: "That's why I stopped by. What's wrong?", check: { requirements: [{ type: 'quest', questId: 'petunia_problems', status: 'not_started' }, { type: 'quest', questId: 'goblin_menace', status: 'completed'}], successNode: 'quest_intro_petunia_problems', failureNode: '' } } },
        { npcName: 'Old Man Fitzwilliam', response: { text: "I've dealt with the blight.", check: { requirements: [{ type: 'quest', questId: 'petunia_problems', status: 'in_progress', stage: 5 }], successNode: 'pp_fitz_complete', failureNode: '' } } },
        { npcName: 'Herbalist Anise', response: { text: "Fitzwilliam sent me to inquire about a blight?", check: { requirements: [{ type: 'quest', questId: 'petunia_problems', status: 'in_progress', stage: 0 }], successNode: 'pp_anise_intro', failureNode: '' } } },
        { npcName: 'Herbalist Anise', response: { text: "I have the ingredient you asked for.", check: { requirements: [{ type: 'quest', questId: 'petunia_problems', status: 'in_progress', stage: 2 }], successNode: 'pp_anise_has_spud', failureNode: '' } } },
    ],
    dialogue: {
        petunia_use_potion: {
            npcName: 'Blighted Soil',
            npcIcon: 'https://api.iconify.design/game-icons:sprout.svg',
            text: "You pour the shimmering potion onto the blighted soil. The ground hisses and a foul-smelling creature tears its way out of the earth!",
            responses: [
                { text: "(Face the creature!)", actions: [{ type: 'take_item', itemId: 'blight_ward_potion', quantity: 1 }, { type: 'advance_quest', questId: 'petunia_problems' }, { type: 'start_mandatory_combat', monsterId: 'blight_imp' }] }
            ]
        },
        quest_intro_petunia_problems: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "My petunias! Look at them! Wilting! Dying! I water them every day, I pull the weeds... it's not natural, I tell you. There's a darkness in the soil. A blight! I can feel it in my old bones.",
            responses: [
                { text: "Why are these flowers so important to you?", next: 'pp_fitz_lore_1' },
                { text: "Maybe you're just a bad gardener.", next: 'pp_fitz_insult' },
            ]
        },
        pp_fitz_insult: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "A bad... gardener?! I was slaying dragons when your grandfather was still learning to walk! I know how to tend a simple flower patch! Now are you going to help or are you going to stand there making foolish accusations?",
            responses: [
                { text: "Sorry. Tell me more about the flowers.", next: 'pp_fitz_lore_1' }
            ]
        },
        pp_fitz_lore_1: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "Important? I... I don't rightly remember. They just... are. They were... her favorite. Suzie's. At least, I think that was her name... Hmph! Doesn't matter. They're dying! And I won't have it!",
            responses: [
                { text: "Suzie?", next: 'pp_fitz_lore_2' },
                { text: "What do you think is causing the blight?", next: 'pp_fitz_task' }
            ]
        },
        pp_fitz_lore_2: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "My wife. Fifteen years gone now. We were... adventurers. Dragon slayers, the first of our kind. We faced down wyrms that could melt castles. But the thing that took her... it wasn't a dragon. It was a creeping shadow, a thing of whispers... After that, the fire went out of me. It's all... fuzzy now. But the flowers... I must tend to the flowers.",
            responses: [
                { text: "I'm sorry. Let me help you with the blight.", next: 'pp_fitz_task' }
            ]
        },
        pp_fitz_task: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "It's a magical problem, I'm sure of it. I'm too old to go chasing mages. But you... you look capable. Go to Oakhaven. There's an herbalist there, Anise. She knows about this sort of thing. Here, take a sample of the soil. Show it to her. But be careful... it feels wrong.",
            responses: [
                { text: "I'll take this to Anise right away.", actions: [{ type: 'start_quest', questId: 'petunia_problems' }, { type: 'give_item', itemId: 'blighted_soil', quantity: 1 }] }
            ]
        },
        pp_anise_intro: {
            npcName: 'Herbalist Anise',
            npcIcon: '/assets/npcChatHeads/herbalist_anise.png',
            text: "Fitzwilliam sent you? And with a soil sample... Let me see. Hmm... yes. Just as I suspected from the rumors. This isn't a natural ailment. It's a magical blight... a faint necrotic signature. Something is hiding in that soil, poisoning it from within.",
            responses: [
                { text: "Can you make a cure?", next: 'pp_anise_task' }
            ]
        },
        pp_anise_task: {
            npcName: 'Herbalist Anise',
            npcIcon: '/assets/npcChatHeads/herbalist_anise.png',
            text: "I can create a revealing poultice, but I'll need a catalyst that reacts to this kind of energy. Bring me some Grimy Spore Spud. It's a dreary little plant that thrives in dark, damp places... I hear the slimes in the mine depths are often covered in it. Bring me a piece.",
            responses: [
                { text: "I'll get you the spud.", actions: [{ type: 'advance_quest', questId: 'petunia_problems' }] }
            ]
        },
        pp_anise_has_spud: {
            npcName: 'Herbalist Anise',
            npcIcon: '/assets/npcChatHeads/herbalist_anise.png',
            text: "You have the Spore Spud! Excellent. Let's see... ",
            responses: [
                {
                    text: "(Give her the spore spud)",
                    check: {
                        requirements: [{ type: 'items', items: [{ itemId: 'clean_spore_spud', quantity: 1 }] }],
                        successNode: 'pp_anise_make_potion',
                        failureNode: 'pp_anise_spud_is_grimy'
                    }
                }
            ]
        },
        pp_anise_spud_is_grimy: {
            npcName: 'Herbalist Anise',
            npcIcon: '/assets/npcChatHeads/herbalist_anise.png',
            text: "Oh, dear. You brought me the grimy spore spud. I can't use it like this. You'll need to clean it first. Don't you know the first thing about Herblore? Clean your herbs before you try to brew with them!",
            responses: []
        },
        pp_anise_make_potion: {
            npcName: 'Herbalist Anise',
            npcIcon: '/assets/npcChatHeads/herbalist_anise.png',
            text: "Perfectly cleaned! Now, with this and the soil sample... a little grinding... a bit of simmering... there! This Blight Ward Potion should do the trick. Pour it directly onto the blighted soil. If there's a magical creature hiding there, this will force it into the open. Be ready for a fight.",
            responses: [
                { text: "Thank you, Anise. I'll be careful.", actions: [{ type: 'take_item', itemId: 'blighted_soil', quantity: 1 }, { type: 'take_item', itemId: 'clean_spore_spud', quantity: 1 }, { type: 'give_item', itemId: 'blight_ward_potion', quantity: 1 }, { type: 'advance_quest', questId: 'petunia_problems' }] }
            ]
        },
        pp_fitz_complete: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "What's all that racket? Hmph. You're back. Did you... do something? The flowers... they do look a bit perkier. Good. Here, take this old thing. Found it while gardening years ago. It feels... important. Maybe it'll preserve something for you.",
            responses: [
                { text: "What is it?", next: 'pp_fitz_complete_ring' }
            ]
        },
        pp_fitz_complete_ring: {
            npcName: 'Old Man Fitzwilliam',
            npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
            text: "It was... hers. Suzie's. She said it kept her potions fresh on long journeys... or something like that. My memory is... foggy. Just take it. Now, shoo! I need to tend to Suzie's... er... my petunias.",
            responses: [
                { text: "Thank you, Fitzwilliam. I will.", actions: [{ type: 'advance_quest', questId: 'petunia_problems' }] }
            ]
        }
    }
};
