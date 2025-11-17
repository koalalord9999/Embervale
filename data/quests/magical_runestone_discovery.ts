
import { Quest, SkillName } from '../../types';

export const magicalRunestoneDiscovery: Quest = {
    id: 'magical_runestone_discovery',
    name: "Magical Runestone Discovery",
    description: "Wizard Elmsworth in the Meadowdale Library has made a discovery about the nature of magic and needs an adventurer to help him investigate.",
    startHint: "Speak to Wizard Elmsworth in the Meadowdale Library.",
    playerStagePerspectives: [
        "I need to speak to Wizard Elmsworth to be teleported to his new discovery.", // 0
        "I've arrived at a strange mine. I should speak to Elmsworth's magical projection.", // 1
        "I need to mine 5 chunks of Rune Essence for the wizard.", // 2
        "I have the essence. I should return to Wizard Elmsworth in the Meadowdale Library.", // 3
        "Elmsworth gave me a strange trinket that vibrates near the essence. He said it's pulling north, past the Murky Riverbank. I need to investigate where it leads.", // 4
        "The trinket led me to an altar! It reacted strongly. I should report this back to Wizard Elmsworth.", // 5
        "Elmsworth thinks the items need to be used on the altar. I should return and try it.", // 6
        "I've crafted runes! I should report my success to Wizard Elmsworth." // 7
    ],
    completionSummary: "I assisted Wizard Elmsworth in his research. He discovered a mine filled with Rune Essence and a strange Talisman. I followed the Talisman's pull to a hidden altar, and under Elmsworth's guidance, used it to craft the essence into runes, discovering the lost art of Runecrafting.",
    stages: [
        { description: "Speak to Wizard Elmsworth to be teleported to his discovery.", requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' } },
        { description: "Speak to Wizard Elmsworth's projection in the mine.", requirement: { type: 'talk', poiId: 'rune_essence_mine', npcName: "Wizard Elmsworth (Projection)" } },
        { description: "Mine 5 Rune Essence chunks.", requirement: { type: 'gather', items: [{ itemId: 'rune_essence', quantity: 5 }] } },
        { description: "Return to Wizard Elmsworth in Meadowdale.", requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' } },
        { description: "Find the source of the talisman's pull.", requirement: { type: 'talk', poiId: 'gust_altar', npcName: 'Approach the altar' } },
        { description: "Report your findings to Wizard Elmsworth.", requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' } },
        { description: "Use the Talisman and Rune Essence on the Gust Altar.", requirement: { type: 'talk', poiId: 'gust_altar', npcName: 'Approach the altar' } },
        { description: "Return to Wizard Elmsworth with the runes.", requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' } }
    ],
    rewards: {
        xp: [{ skill: SkillName.Runecrafting, amount: 250 }],
        coins: 500,
        items: [ { itemId: 'binding_talisman', quantity: 1 } ]
    },
    dialogueEntryPoints: [
        { npcName: 'Wizard Elmsworth', response: { text: "Maybe? What are you researching?", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'not_started' }], successNode: 'quest_intro_magical_runestone_discovery', failureNode: '' } } },
        { npcName: 'Wizard Elmsworth', response: { text: "I'm ready.", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 0 }], successNode: 'mrd_teleport_dialogue', failureNode: '' } } },
        { npcName: 'Wizard Elmsworth', response: { text: "Yes, and I've returned with the samples.", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 3 }], successNode: 'mrd_library_stage_3', failureNode: '' } } },
        { npcName: 'Wizard Elmsworth', response: { text: "It led to an ancient stone altar.", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 5 }], successNode: 'mrd_library_stage_5', failureNode: '' } } },
        { npcName: 'Wizard Elmsworth', response: { text: "I did as you instructed. Do you know what these are?", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 7 }], successNode: 'mrd_library_stage_7', failureNode: '' } } },
        { npcName: 'Wizard Elmsworth', response: { text: "How goes the Runecrafting research?", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'completed' }], successNode: 'post_quest_magical_runestone_discovery', failureNode: '' } } }
    ],
    dialogue: {
        elmsworth_default: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Ah, hello there. Fascinating research to be done, fascinating!",
            responses: [],
        },
        quest_intro_magical_runestone_discovery: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "I've detected a peculiar magical resonance deep within the mountains, a place I can't reach by normal means. I've developed a teleportation spell keyed to it, but I've yet to test it on a living subject.",
            responses: [
                { text: "You want me to be your test subject?", next: 'details_magical_runestone_discovery' },
            ]
        },
        details_magical_runestone_discovery: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Precisely! It should be perfectly safe. Mostly. If you'd be willing, I could send you there to investigate. Who knows what you might find! For the sake of magical discovery!",
            responses: [
                { text: "Alright, I'll do it. For science!", actions: [{ type: 'start_quest', questId: 'magical_runestone_discovery' }], next: 'mrd_teleport_dialogue' },
                { text: "'Mostly' safe isn't good enough for me." },
            ]
        },
        mrd_teleport_dialogue: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Excellent! I will create a temporary magical projection of myself there to guide you. Now, hold still... *Materia Translocatus!*",
            responses: [
                { text: "(You feel a strange pulling sensation...)", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery' }, { type: 'teleport', poiId: 'rune_essence_mine' }] },
            ]
        },
        mrd_projection_intro: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Wibble-wobble... ah, there we are! Can you hear me? Flimsy things, these projections. I'm Elmsworth, or a magical echo of him, at least. You're in the source of the resonance I detected!",
            responses: [
                { text: "A magical echo? Are you a ghost?", next: 'mrd_projection_ghost' },
                { text: "Where are we?", next: 'mrd_projection_where' },
                { text: "I feel sick...", next: 'mrd_projection_sick' },
            ]
        },
        mrd_projection_intro_alternate: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "You can still hear me right? Good, now remember this is my projection, a 'magical echo' if you will. Now then, you're in the source of the resonance I detected.",
            responses: [
                { text: "A magical echo? Are you a ghost?", next: 'mrd_projection_ghost' },
                { text: "Where are we?", next: 'mrd_projection_where' },
            ]
        },
        mrd_projection_ghost: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "A ghost? Heavens no! Just a bit... translucent. Think of me as a magical message. Now, enough about my existential state, look at this place!",
            responses: [{ text: "Oh, okay. You scared me for a moment.. Now where are we?", next: 'mrd_projection_where' }]
        },
        mrd_projection_sick: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "That's normal for your first experience with teleportation, there's no time for your body to prepare to be moved from one location to another in this fashion.",
            responses: [{ text: "Does it get easier?", next: 'mrd_projection_sick2' }]
        },
        mrd_projection_sick2: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "It does indeed, the more times you experience this form of movement, the less stress it puts on your body. You'll get used to it in no time!",
            responses: [{ text: "I hope so...", next: 'mrd_projection_intro_alternate' }]
        },
        mrd_projection_where: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "This, my adventurous friend, is where the resonance was leading to! Now, pray tell... what do you see?",
            responses: [
                { text: "I see a large rock with floating bits around it.", next: 'mrd_projection_explain' },
                { text: "I don't see anything out of the ordinary.", next: 'mrd_projection_bad' }
            ]
        },
        mrd_projection_bad: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Simply impossible, with the readings I was getting, there's absolutely no way that there's nothing there! Please take a look again.",
            responses: [
                { text: "Okay okay, I do see some big rock with some smaller rocks floating around it.", next: 'mrd_projection_explain'},
                { text: "No seriously, I don't see anything...", next: 'mrd_projection_idiot'},
            ]
        },
        mrd_projection_idiot: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "I simply cannot believe this, I must have found the dumbest person in the world to help me with this... and I even used my precious runes to teleport them here... Speak to me when you're done messing around. *sigh*",
            responses: []
        },
        mrd_projection_explain: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "You said floating rocks?! That has to be the source of this resonance, nothing in this world can float without some residual magic. This must be the source, please collect some samples from this rock please. 5 should be enough. ",
            responses: [
                { text: "Of course. I'll get right on it.", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery' }], next: 'mrd_projection_task_accepted' },
            ]
        },
        mrd_projection_task_accepted: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Splendid! The path back to the main mine is now open. Once you have the five chunks, my work here is done and this projection will fade. Return to my *real* self in the Meadowdale library when you are done.",
            responses: []
        },
        mrd_library_stage_3: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Splendid! Hand them over, and I'll examine them.",
            responses: [
                { text: "(Hand Elmsworth the samples)", check: { requirements: [{ type: 'items', items: [{ itemId: 'rune_essence', quantity: 5 }] }], successNode: 'mrd_complete_stage_3', failureNode: 'mrd_has_no_essence' }, actions: [{ type: 'take_item', itemId: 'rune_essence', quantity: 5 }] }
            ]
        },
        mrd_has_no_essence: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "It seems you don't have all five chunks. The discovery awaits! Return to the mine and gather the rest. I can send you back if you wish.",
            responses: [
                { text: "Yes, please send me back.", actions: [{ type: 'teleport', poiId: 'rune_essence_mine' }] },
                { text: "No thanks, I'll walk." },
            ]
        },
        mrd_complete_stage_3: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Wonderful! Now... what in the blazes? My trinket! It's vibrating like a bee in a jam jar! It's reacting to the essence you're carrying!",
            responses: [
                { text: "(Continue)", next: 'mrd_complete_stage_3_b' }
            ]
        },
        mrd_complete_stage_3_b: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "It's a peculiar thing I found on my travels. It always seemed to pull faintly to the north. Since you're an adventurer, perhaps you can find where it leads! Take the trinket; it seems connected to the stones. Find where it's leading you, and report back!",
            responses: [
                { text: "I'll see what I can find.", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery'}, {type: 'give_item', itemId: 'gust_talisman', quantity: 1 }] }
            ]
        },
        mrd_library_stage_5: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "An altar, you say? Of course! The resonance... the energy... it all makes sense! I believe my trinket and the stones are meant to be used together *at* the altar. I'm giving you back the stones. You must go back and use them on it!",
            responses: [
                { text: "Alright, I'll go back and try it.", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery' }, { type: 'give_item', itemId: 'rune_essence', quantity: 5 }] }
            ]
        },
        mrd_library_stage_7: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "*Elmsworth examines the glowing stones. His mouth opens in shock!* Actual runes! And you made them yourself! By my beard, you've done it! You've rediscovered the lost art of Runecrafting! The trinket must be a Talisman, and these stones... this 'Rune Essence'... they are the key! This changes everything!",
            responses: [
                 { text: "What now?", next: 'mrd_7_c' }
            ]
        },
        mrd_7_c: {
             npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Now, you practice! Thank you, adventurer. Please, take this for your invaluable contribution to science! I have another talisman you might find useful. This one hums with a different energy...",
            responses: [
                { text: "No problem! I had a good time.", actions: [ { type: 'complete_quest', questId: 'magical_runestone_discovery' }] }
            ]
        },
        post_quest_magical_runestone_discovery: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Ah, my star pupil! How goes the runecrafting? Made any new discoveries of your own?",
            responses: []
        },
        gust_altar_router: {
            npcName: 'Approach the altar',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: '...',
            responses: [],
            conditionalResponses: [
                { text: 'Take a closer look', check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 4 }], successNode: 'mrd_altar_stage_4', failureNode: '' } },
                { text: 'What was it again?', check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 6 }], successNode: 'mrd_altar_stage_6', failureNode: '' } }
            ]
        },
        mrd_altar_stage_4: {
            npcName: 'Approach the altar',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "Upon getting closer, the trinket almost bursts out of your backpack as if it had a mind of its own.",
            responses: [
                { text: "(I should report this back to Elmsworth.)", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery' }] }
            ]
        },
        mrd_altar_stage_6: {
            npcName: 'Approach the altar',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "Oh right! Elmsworth believed the trinket and chunks should be used together on the altar.",
            responses: [
                { text: "(Combine the trinket and chunks)", check: { requirements: [{ type: 'items', items: [{ itemId: 'gust_talisman', quantity: 1 }, { itemId: 'rune_essence', quantity: 5 }] }], successNode: 'craft_runes_success', failureNode: 'craft_runes_fail' } },
                { text: "Walk away", next: 'mrd_altar_ignore'}
            ]
        },
        craft_runes_success: {
            npcName: 'Approach the altar',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "You place the trinket and the rocks on the altar. The essence shifts in a flash of windy light! In their place, several small, flat stones inscribed with glowing runes appear.",
            responses: [{ text: "(Take the glowing rocks)", actions: [{ type: 'take_item', itemId: 'rune_essence', quantity: 5 }, { type: 'give_item', itemId: 'gust_rune', quantity: 5 }, { type: 'give_xp', skill: SkillName.Runecrafting, amount: 10 }, { type: 'advance_quest', questId: 'magical_runestone_discovery' }] }]
        },
        craft_runes_fail: {
            npcName: 'Approach the altar',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "You don't have all the necessary components. You need the trinket and at least 5 rock chunks.",
            responses: []
        },
        mrd_altar_ignore: {            
            npcName: 'Approach the altar',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "As you step away from the altar, the trinket seems to calm down.",
            responses: []
        }
    }
};
