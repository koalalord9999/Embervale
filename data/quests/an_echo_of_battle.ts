import { Quest, SkillName } from '../../types';

export const anEchoOfBattle: Quest = {
    id: 'an_echo_of_battle',
    name: "An Echo of Battle",
    description: "Bronn, the retired adventurer in Oakhaven's tavern, is troubled by memories of a past battle and a sealed foe.",
    startHint: "Speak to Bronn in The Carved Mug after proving your worth by completing 'The Capital's Call' and 'Art of the Warhammer'.",
    playerStagePerspectives: [
        "Bronn is worried a sealed enemy has returned. He's asked me to investigate the Forgotten Barrow in the Verdant Fields.", // 0
        "The barrow's seal is weakening. I should report this to Bronn.", // 1
        "Bronn gave me the fragments of an old key. He suggested I take them to Valerius the smith in Meadowdale to have it reforged.", // 2
        "Valerius can reforge the key, but he needs a magical binding agent: Glimmerhorn Dust. I can get this from Glimmerhorn Stags.", // 3
        "I have the Glimmerhorn Dust. I should return to Valerius in Meadowdale.", // 4
        "I have the reforged key. I must return to the Forgotten Barrow and solve the puzzle of the three comrades to enter.", // 5
        "I defeated the Revenant Lord and retrieved the shield of Bronn's fallen comrade. I should return it to Bronn in Oakhaven." // 6
    ],
    completionSummary: "I helped Bronn the retired adventurer confront his past. After reforging a key with Valerius's help and solving a puzzle, I entered a forgotten barrow and defeated a powerful Revenant Lord. I returned the shield from the battle to Bronn, finally giving him peace.",
    stages: [
        {
            description: "Investigate the Forgotten Barrow in the Verdant Fields.",
            requirement: { type: 'talk', poiId: 'forgotten_barrow', npcName: 'Examine Seal' }
        },
        {
            description: "Report your findings to Bronn in Oakhaven.",
            requirement: { type: 'talk', poiId: 'the_carved_mug', npcName: 'Bronn the Retired Adventurer' }
        },
        {
            description: "Take the Broken Barrow Key to Valerius in Meadowdale.",
            requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' }
        },
        {
            description: "Gather 1 Glimmerhorn Dust for Valerius.",
            requirement: { type: 'gather', items: [{ itemId: 'glimmerhorn_dust', quantity: 1 }] }
        },
        {
            description: "Return to Valerius with the Glimmerhorn Dust.",
            requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' }
        },
        {
            description: "Enter the Forgotten Barrow and defeat the Grave Revenant Lord.",
            requirement: { type: 'kill', monsterId: 'grave_revenant_lord', quantity: 1 }
        },
        {
            description: "Return Pregai's Shield to Bronn in Oakhaven.",
            requirement: { type: 'talk', poiId: 'the_carved_mug', npcName: 'Bronn the Retired Adventurer' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Attack, amount: 2000 }, { skill: SkillName.Defence, amount: 2000 }],
        items: [{ itemId: 'pregais_shield', quantity: 1 }]
    },
    dialogueEntryPoints: [
        //QUEST START
        { npcName: 'Bronn the Retired Adventurer', response: { text: "You seem troubled, Bronn.", check: { requirements: [ { type: 'quest', questId: 'art_of_the_warhammer', status: 'completed' }, { type: 'quest', questId: 'capitals_call', status: 'completed' }, { type: 'quest', questId: 'an_echo_of_battle', status: 'not_started' } ], successNode: 'aeb_intro', failureNode: '' } } },
        //FOUND SEAL
        { npcName: 'Bronn the Retired Adventurer', response: { text: "I have found the seal, and it does appear to be weakening.", check: { requirements: [ { type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 1 } ], successNode: 'aeb_bronn_return_from_barrow', failureNode: '' } } },
        //BEFORE SEARCHING SEAL
        { npcName: 'Bronn the Retired Adventurer', response: { text: "I have not found anything yet.", check: { requirements: [ { type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 0 } ], successNode: 'aeb_bronn_nothing_yet', failureNode: '' } } },
        //AFTER TAKING THE BROKEN KEY
        { npcName: 'Bronn the Retired Adventurer', response: { text: "What should I do with this key?", check: { requirements: [ { type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 2 } ], successNode: 'aeb_bronn_remind_valerius', failureNode: '' } } },
        //AFTER ACCEPTING THE PART FROM VALERIUS
        { npcName: 'Bronn the Retired Adventurer', response: { text: "Where can I find Glimmerhorn Dust?", check: { requirements: [ { type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 3 } ], successNode: 'aeb_bronn_remind_dust', failureNode: '' } } },
        //AFTER REFORGING THE KEY, BEFORE KILLING REV LORD
        { npcName: 'Bronn the Retired Adventurer', response: { text: "Sorry, I just forgot what I needed to do..", check: { requirements: [ { type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 5 } ], successNode: 'aeb_bronn_remind_barrow', failureNode: '' } } },
        //AFTER KILLING REV LORD
        { npcName: 'Bronn the Retired Adventurer', response: { text: "I think I found the monster that killed your comrade.", check: { requirements: [ { type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 6 } ], successNode: 'aeb_bronn_complete_check', failureNode: '' } } },

        //VALERIUS ENTRY POINTS
        { npcName: 'Valerius the Master Smith', response: { text: "I have a broken key from Bronn.", check: { requirements: [ { type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 2 } ], successNode: 'aeb_valerius_intro', failureNode: '' } } },
        { npcName: 'Valerius the Master Smith', response: { text: "I'm still looking for the dust you need.", check: { requirements: [ { type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 3 } ], successNode: 'aeb_valerius_no_dust', failureNode: '' } } },
        { npcName: 'Valerius the Master Smith', response: { text: "I have the Glimmerhorn Dust for the key.", check: { requirements: [ { type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 4 } ], successNode: 'aeb_valerius_has_dust_check', failureNode: '' } } },
    ],
    dialogue: {
        // Bronn's Dialogue
        aeb_intro: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Troubled? *He sighs heavily, staring into his mug.* Aye, you could say that. The dreams are back. Old ghosts... an old failure. I see you've made a name for yourself. You handle yourself well in a fight, and you know good steel. Maybe... maybe you can help an old warrior find some peace.",
            responses: [
                { text: "What's on your mind, Bronn?", next: 'aeb_story_1_new' }
            ]
        },
        aeb_story_1_new: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Years ago, my company and I cornered a terrible foe—a Grave Revenant Lord... We sealed it away in a barrow out in the Verdant Fields. But it cost us everything.",
            responses: [
                { text: "Your company? Tell me about them.", next: 'aeb_company_intro' },
                { text: "A Revenant Lord? What is that?", next: 'aeb_lore_revenant' },
                { text: "I'm ready to help. What needs to be done?", next: 'aeb_story_2' }
            ]
        },
        aeb_company_intro: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Heh. Not many ask about the old days. We were the 'Wyvern's Maw'. A bit dramatic, I know. Just four fools who thought we could save the world. There was Pregai, Lyra, Arion... and me. We were family.",
            responses: [
                { text: "Tell me about Pregai.", next: 'aeb_lore_pregai_part1' },
                { text: "What about Lyra?", next: 'aeb_lore_lyra_part1' },
                { text: "And Arion?", next: 'aeb_lore_arion_part1' },
                { text: "I've heard enough. What needs to be done about the barrow?", next: 'aeb_story_2' }
            ]
        },
        aeb_lore_revenant: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "It's a knight that refuses to die. Cursed with undeath, it retains all of its martial skill and cunning, but with none of the honor. It's a relentless, hateful thing. We couldn't destroy it, so we locked it away.",
            responses: [
                { text: "I understand. Tell me about your company.", next: 'aeb_company_intro' },
                { text: "I'm ready to help. What needs to be done?", next: 'aeb_story_2' }
            ]
        },
        aeb_lore_pregai_part1: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Pregai... He was our Captain. Stalwart, they called him. Strong as an ox and twice as stubborn. He carried a shield that could stop a charging minotaur. He... he didn't make it out of the barrow. He bought us the time we needed to complete the seal.",
            responses: [
                { text: "(Continue)", next: 'aeb_lore_pregai_part2' }
            ]
        },
        aeb_lore_pregai_part2: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "We held a funeral... of sorts. Buried an empty suit of armor. It wasn't enough. His shield... it was left behind. Trapped in there with that *thing*. That's the real insult. A warrior's shield should be buried with him, or passed on. Not left to rot in the dark.",
            responses: [
                { text: "Tell me about the others.", next: 'aeb_company_intro' }
            ]
        },
        aeb_lore_lyra_part1: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Lyra, our Scout. Swift and silent as a shadow. Best archer I ever saw. After Pregai fell... something broke in her. The light in her eyes just... went out.",
            responses: [
                { text: "(Continue)", next: 'aeb_lore_lyra_part2' }
            ]
        },
        aeb_lore_lyra_part2: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "She left. Said she was heading for the Sunscorched Wastes, looking for a quiet place to disappear. Haven't heard from her since. War has a way of making sad endings.",
            responses: [
                { text: "Tell me about the others.", next: 'aeb_company_intro' }
            ]
        },
        aeb_lore_arion_part1: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Arion, our Mage. Wise beyond his years. He was the one who found the sealing ritual. A mind as sharp as any blade. After the barrow... he became obsessed. Fearful.",
            responses: [
                { text: "(Continue)", next: 'aeb_lore_arion_part2' }
            ]
        },
        aeb_lore_arion_part2: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Said the seal wasn't perfect, that it was a temporary solution. He spent the rest of his life in a dusty library, searching for a permanent one. Died of old age, consumed by his fear. A different kind of tomb.",
            responses: [
                { text: "Tell me about the others.", next: 'aeb_company_intro' }
            ]
        },
        aeb_story_2: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "We broke the key after we sealed the barrow, so no one could ever open that cursed place again. But now... I feel it stirring. The seal is weakening. The dreams... they feel like a warning.",
            responses: [ { text: "What do you need me to do?", next: 'aeb_story_3' } ]
        },
        aeb_story_3: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "I need you to go there, to the Forgotten Barrow in the Verdant Fields, and see if my fears are true. Check the seal.",
            responses: [ { text: "I'll investigate the barrow for you.", actions: [{ type: 'start_quest', questId: 'an_echo_of_battle' }] } ]
        },
        aeb_bronn_return_from_barrow: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Weakening, you say? I knew it. Pregai's sacrifice... it can't be for nothing. We have to reinforce the seal, or destroy the beast once and for all. Take these. *He pulls two tarnished, broken pieces of metal from a pouch.* It's the key. Or what's left of it. There's only one smith I'd trust to reforge something this old. Valerius, in Meadowdale. Show it to him.",
            responses: [ { text: "I'll take the key to Valerius.", actions: [{ type: 'give_item', itemId: 'broken_barrow_key', quantity: 1 }, { type: 'advance_quest', questId: 'an_echo_of_battle' }] } ]
        },
        aeb_bronn_nothing_yet: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Well get a move on, the longer we wait the weaker the seal will become!",
            responses: [ { text: "Okay, I'll go look for it." } ]
        },
        aeb_bronn_remind_valerius: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Take the key fragments to Valerius the Master Smith in Meadowdale. He's the only one I trust to reforge it properly.",
            responses: []
        },
        aeb_bronn_remind_dust: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "You need Glimmerhorn Dust? I don't know too much about it, but I do know the antlers are valuble to herbalists, especially when ground with a pestle and mortar. You'll find a few stags in the Verdant Fields.",
            responses: []
        },
        aeb_bronn_remind_barrow: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "It's okay lad, just hurry back to the Forgotten Barrow in the Verdant Fields. The door has a puzzle... a memory of my old comrades. Ensure the threat in the barrow is dealt with.",
            responses: []
        },
        aeb_bronn_complete_check: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "You did?! And since you're back here, you must have slain the beast! Wow. I wish we would have had you in our company back in the day, then Pregai might still be alive today... Did you find the shield?",
            responses: [ { text: "Yea, I killed it.. it was holding a shield during our fight.", check: { requirements: [{ type: 'items', items: [{ itemId: 'pregais_shield', quantity: 1 }] }], successNode: 'aeb_bronn_complete_success', failureNode: 'aeb_bronn_no_shield' } } ]
        },
        aeb_bronn_no_shield: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "The Revenant is defeated? That is good news. But... if you said it was holding a shield, where is it? Did you leave it there??",
            responses: []
        },
        aeb_bronn_complete_success: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "*Bronn takes the shield, his hands trembling as he traces the worn crest.* Pregai's shield... After all these years. You've done it. You've laid the ghosts of my past to rest. Thank you, warrior. Truly.",
            responses: [ { text: "I'm glad I could help.", next: 'aeb_bronn_final_reward' } ]
        },
        aeb_bronn_final_reward: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "I have no more use for this. My battles are over. A shield like this belongs on the arm of a hero. Take it. Let it protect you as it once protected my friend. Now, if you'll excuse me... I think I can finally enjoy a quiet drink.",
            responses: [ { text: "(Take the shield)", actions: [{ type: 'take_item', itemId: 'pregais_shield', quantity: 1 }, { type: 'advance_quest', questId: 'an_echo_of_battle' }] } ]
        },
        // Valerius's Dialogue
        aeb_valerius_intro: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Bronn sent you? That old warhorse. What trouble has he gotten you into? Let me see... *He takes the key fragments.* This is Old Kingdom steel, but... it's bound by magic. Simply reforging it won't be enough.",
            responses: [ { text: "What do you mean?", next: 'aeb_valerius_needs_dust' } ]
        },
        aeb_valerius_needs_dust: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "I need a magical binding agent to restore its power. Glimmerhorn Dust. It's made from the antlers of the Glimmerhorn Stags in the Verdant Fields. Bring me a pouch of the dust, and I will mend this key for you.",
            responses: [ { text: "I'll get the Glimmerhorn Dust.", actions: [{ type: 'advance_quest', questId: 'an_echo_of_battle' }] } ]
        },
        aeb_valerius_has_dust_check: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Do you have the Glimmerhorn Dust I need to reforge the key?",
            responses: [ { text: "(Give him the dust and key fragments)", check: { requirements: [{ type: 'items', items: [{ itemId: 'glimmerhorn_dust', quantity: 1 }] }], successNode: 'aeb_valerius_reforge', failureNode: 'aeb_valerius_no_dust' } } ]
        },
        aeb_valerius_no_dust: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "This won't work without the Glimmerhorn Dust. You'll find the stags in the Verdant Fields.",
            responses: []
        },
        aeb_valerius_reforge: {
            npcName: 'Valerius the Master Smith',
            npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
            text: "Excellent. Give them here. *He works the forge, sprinkling the dust into the molten metal. It glows with an ethereal light.* It is done. Stronger than it was before. Be careful, adventurer. Whatever this key opens, it was locked for a reason.",
            responses: [ { text: "Thank you, Valerius. I will.", actions: [{ type: 'take_item', itemId: 'broken_barrow_key', quantity: 1 }, { type: 'take_item', itemId: 'glimmerhorn_dust', quantity: 1 }, { type: 'give_item', itemId: 'reforged_barrow_key', quantity: 1 }, { type: 'advance_quest', questId: 'an_echo_of_battle' }] } ]
        },
        // Barrow POI Dialogue
        aeb_barrow_seal: {
            npcName: 'Ancient Seal',
            npcIcon: 'https://api.iconify.design/game-icons:locked-fortress.svg',
            text: "You place your hand on the stone door. It's cold, but a faint, rhythmic pulse of magic emanates from within. You can feel the ancient locking spell, but it feels frayed, like a rope worn thin. Bronn was right; the seal is weakening.",
            responses: [ { text: "(Return to Bronn)", actions: [{ type: 'advance_quest', questId: 'an_echo_of_battle' }] } ]
        },
        aeb_barrow_door_puzzle_start: {
            npcName: 'Barrow Door',
            npcIcon: 'https://api.iconify.design/game-icons:locked-fortress.svg',
            text: "You insert the reforged key. It turns with a heavy clunk. Three carvings appear on the door: a Shield, a Feather, and a Wave. A riddle echoes from the stone: 'Three stood against the one. Honor them in the order they were named, and the path shall open.'",
            responses: [
                { text: "Press the Wave", next: 'aeb_barrow_door_puzzle_fail' },
                { text: "Press the Shield", next: 'aeb_barrow_door_puzzle_step2' },
                { text: "Press the Feather", next: 'aeb_barrow_door_puzzle_fail' },
            ]
        },
        aeb_barrow_door_puzzle_step2: {
            npcName: 'Barrow Door',
            npcIcon: 'https://api.iconify.design/game-icons:locked-fortress.svg',
            text: "The Shield carving glows with a faint light. It seems you are on the right path.",
            responses: [
                { text: "Press the Wave", next: 'aeb_barrow_door_puzzle_fail' },
                { text: "Press the Shield", next: 'aeb_barrow_door_puzzle_fail' },
                { text: "Press the Feather", next: 'aeb_barrow_door_puzzle_step3' },
            ]
        },
        aeb_barrow_door_puzzle_step3: {
            npcName: 'Barrow Door',
            npcIcon: 'https://api.iconify.design/game-icons:locked-fortress.svg',
            text: "The Feather carving glows, joining the Shield's light. The hum from the door grows stronger.",
            responses: [
                { text: "Press the Wave", next: 'aeb_door_success' },
                { text: "Press the Shield", next: 'aeb_barrow_door_puzzle_fail' },
                { text: "Press the Feather", next: 'aeb_barrow_door_puzzle_fail' },
            ]
        },
        aeb_door_success: {
            npcName: 'Barrow Door',
            npcIcon: 'https://api.iconify.design/game-icons:locked-fortress.svg',
            text: "The three carvings glow in unison. The stone door grinds open, revealing a dark passage into the earth. The key crumbles to dust in your hand.",
            responses: [ { text: "(Enter the Barrow)", actions: [{ type: 'take_item', itemId: 'reforged_barrow_key', quantity: 1 }, { type: 'advance_quest', questId: 'an_echo_of_battle' }, { type: 'teleport', poiId: 'barrow_entrance_hall' }] } ]
        },
        aeb_barrow_door_puzzle_fail: {
            npcName: 'Barrow Door',
            npcIcon: 'https://api.iconify.design/game-icons:locked-fortress.svg',
            text: "A low groan echoes from the stone. The lights on the carvings fade, and they reset.",
            responses: [ { text: "Try again.", next: 'aeb_barrow_door_puzzle_start' } ]
        }
    }
};