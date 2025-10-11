
import { Quest, SkillName } from '../../types';

export const magicalRunestoneDiscovery: Quest = {
    id: 'magical_runestone_discovery',
    name: "Magical Runestone Discovery",
    description: "Wizard Elmsworth in the Meadowdale Library has made a discovery about the nature of magic and needs an adventurer to help him investigate.",
    startHint: "Speak to Wizard Elmsworth in the Meadowdale Library.",
    playerStagePerspectives: [
        "I've agreed to help Wizard Elmsworth. I should speak to him again to be teleported to his discovery.",
        "I'm at the location Wizard Elmsworth teleported me to. I should speak to him again.",
        "I need to mine 5 chunks of Rune Essence for the wizard.",
        "I have the essence. I should return to Wizard Elmsworth in the Meadowdale Library.",
        "Elmsworth gave me a strange trinket that vibrates near the essence. He said it's pulling north, past the Murky Riverbank. I need to investigate where it leads.",
        "The trinket led me to an altar! It reacted strongly. I should report this back to Wizard Elmsworth.",
        "Elmsworth thinks the items need to be used on the altar. I should return and try it.",
        "I've crafted runes! I should report my success to Wizard Elmsworth."
    ],
    completionSummary: "I assisted Wizard Elmsworth in his research. He discovered a mine filled with Rune Essence and a strange Talisman. I followed the Talisman's pull to a hidden altar, and under Elmsworth's guidance, used it to craft the essence into runes, discovering the lost art of Runecrafting.",
    stages: [
        {
            description: "Agree to help Wizard Elmsworth.",
            requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' }
        },
        {
            description: "Be teleported by Wizard Elmsworth.",
            requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' }
        },
        {
            description: "Mine 5 Rune Essence chunks.",
            requirement: { type: 'gather', items: [{ itemId: 'rune_essence', quantity: 5 }] }
        },
        {
            description: "Return to Wizard Elmsworth in Meadowdale.",
            requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' },
        },
        {
            description: "Find the source of the talisman's pull.",
            requirement: { type: 'talk', poiId: 'gust_altar', npcName: 'Approach the altar' }
        },
        {
            description: "Report your findings to Wizard Elmsworth.",
            requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' }
        },
        {
            description: "Use the Talisman and Rune Essence on the Gust Altar.",
            requirement: { type: 'talk', poiId: 'gust_altar', npcName: 'Approach the altar' }
        },
        {
            description: "Return to Wizard Elmsworth with the runes.",
            requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Runecrafting, amount: 250 }],
        coins: 500,
        items: [
            { itemId: 'binding_talisman', quantity: 1 },
        ]
    },
    dialogue: {
        // Wizard Elmsworth in Meadowdale Library
        default_dialogue: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Ah, hello there. Fascinating research to be done, fascinating!",
            responses: [],
            conditionalResponses: [
                {
                    text: "You seem excited. What are you researching?",
                    check: {
                        requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'not_started' }],
                        successNode: 'quest_intro_magical_runestone_discovery',
                        failureNode: '' 
                    }
                },
                {
                    text: "I have returned from the essence mine.",
                    // FIX: Moved successNode and failureNode inside the 'check' object to match the DialogueCheck type.
                    check: { 
                        requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 3 }],
                        successNode: 'mrd_library_stage_3',
                        failureNode: ''
                    }
                }
            ]
        },
        quest_intro_magical_runestone_discovery: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Ah, an adventurer! Perfect. You have the look of someone not easily startled. I've made a discovery of some significance, a magical one!",
            responses: [
                { text: "(Continue)", next: 'quest_intro_magical_runestone_discovery_b' }
            ]
        },
        quest_intro_magical_runestone_discovery_b: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "I've been researching ancient teleportation magics and believe I've perfected a spell to transport someone to a location keyed to a specific magical resonance. I've found such a resonance, but I've yet to test it on a living being.",
            responses: [
                { text: "You want to teleport me somewhere?", next: 'details_magical_runestone_discovery' },
                { text: "This sounds a bit complicated...", next: 'mrd_complicated_response' },
                { text: "I'm not interested in being a test subject." },
            ]
        },
        mrd_complicated_response: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Not at all, my dear adventurer! The complex part is my research, which is already done. For you, it's quite simple: stand still, experience a brief moment of magical translocation, and then explore a new, undiscovered location! Shall we proceed?",
            responses: [
                { text: "Alright, tell me more.", next: 'details_magical_runestone_discovery' },
                { text: "No, I'd rather not." },
            ]
        },
        details_magical_runestone_discovery: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Precisely! It should be perfectly safe. Mostly. The resonance points to a location deep within the mountains. If you'd be willing, I could send you there to investigate. Who knows what you might find!",
            responses: [
                { text: "Alright, I'll do it. For the sake of science!", actions: [{ type: 'start_quest', questId: 'magical_runestone_discovery' }], next: 'in_progress_magical_runestone_discovery_0' },
                { text: "I'm still not convinced this is a good idea.", next: 'mrd_decline_final' },
                { text: "'Mostly' safe isn't good enough for me." },
            ]
        },
        mrd_decline_final: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "A pity! The pursuit of knowledge requires a certain... boldness. Perhaps another time, then. Do let me know if you change your mind.",
            responses: []
        },
        in_progress_magical_runestone_discovery_0: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Excellent! Before I can teleport you, I must first perform an attunement spell to unlock the destination. Shall I proceed?",
            responses: [
                { text: "Yes, perform the attunement.", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery' }], next: 'mrd_teleport_dialogue' },
                { text: "Not just yet." },
            ]
        },
        mrd_teleport_dialogue: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The attunement is complete! You will find a temporary projection of myself there. I don't know how long I can keep it active, so you best hurry along. Now for the teleport. Hold still... *Materia Translocatus!*",
            responses: [
                { text: "(You feel a strange pulling sensation...)", actions: [{ type: 'teleport', poiId: 'rune_essence_mine' }] },
            ]
        },
        mrd_library_stage_3: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Ah, you've returned from the essence mine! How fares the sample collection?",
            conditionalResponses: [
                {
                    text: "I have all five chunks right here.",
                    check: {
                        requirements: [{ type: 'items', items: [{ itemId: 'rune_essence', quantity: 5, operator: 'gte' }] }],
                        successNode: 'mrd_complete_stage_2',
                        failureNode: ''
                    }
                },
                {
                    text: "I have some of them, but not all.",
                    check: {
                        requirements: [
                            { type: 'items', items: [{ itemId: 'rune_essence', quantity: 1, operator: 'gte' }] },
                            { type: 'items', items: [{ itemId: 'rune_essence', quantity: 5, operator: 'lt' }] }
                        ],
                        successNode: 'mrd_has_some_essence',
                        failureNode: ''
                    }
                },
                {
                    text: "I haven't gathered any yet.",
                    check: {
                        requirements: [{ type: 'items', items: [{ itemId: 'rune_essence', quantity: 0, operator: 'eq' }] }],
                        successNode: 'mrd_has_no_essence',
                        failureNode: ''
                    }
                }
            ],
            responses: []
        },
        mrd_has_some_essence: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "You've made a good start, but I need a full five samples to calibrate my instruments properly. Bring me the rest when you have them.",
            responses: [
                { text: "(Continue)", next: 'offer_teleport_back' }
            ]
        },
        mrd_has_no_essence: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "You've returned empty-handed? Tsk, tsk. The discovery awaits! You must return to the mine and gather those samples.",
            responses: [
                { text: "(Continue)", next: 'offer_teleport_back' }
            ]
        },
        offer_teleport_back: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "No sense in walking all that way. I can send you straight back to the cavern if you're ready. Shall I?",
            responses: [
                { text: "Yes, please send me back.", actions: [{ type: 'teleport', poiId: 'rune_essence_mine' }] },
                { text: "No thanks, I'll walk." },
            ]
        },
        mrd_complete_stage_2: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "You have them! Wonderful! Now... what in the blazes? My trinket! The one I keep in my pocket for good luck... it's vibrating like a bee in a jam jar now that you're near with those rocks!",
            responses: [
                { text: "(Continue)", next: 'mrd_complete_stage_2_b' }
            ]
        },
        mrd_complete_stage_2_b: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "It's a peculiar thing I found on my travels. It always seemed to pull faintly to the north, but I could never investigate. Since you're a seasoned adventurer, perhaps you can find where it leads!",
            responses: [
                { text: "(Continue)", next: 'mrd_complete_stage_2_c' }
            ]
        },
        mrd_complete_stage_2_c: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Here, take the trinket. And keep the rock chunks, they seem to be the key! Find what this trinket is pulling towards, and report back to me immediately!",
            responses: [
                { text: "I'll see what I can find.", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery'}, {type: 'give_item', itemId: 'gust_talisman', quantity: 1 }] }
            ]
        },
        in_progress_magical_runestone_discovery_5: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "You're back! Did you find where the trinket was leading you?",
            responses: [
                { text: "Yes, it led me to an ancient altar in the lower mountains.", next: 'mrd_5_b' }
            ]
        },
        mrd_5_b: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "An altar! Of course! The resonance... the energy... it all makes sense! I believe the trinket and the stones are meant to be used together *at* the altar. You must go back and place them upon it!",
            responses: [
                { text: "Alright, I'll go back and try it.", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery' }] }
            ]
        },
        in_progress_magical_runestone_discovery_7: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "You have them! Actual runes! And you made them yourself! By my beard, you've done it! You've rediscovered the lost art of Runecrafting!",
            responses: [
                { text: "(Continue)", next: 'mrd_7_b' }
            ]
        },
        mrd_7_b: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The trinket must be a Talisman, and these stones... this 'Rune Essence'... they are the key! This changes everything! The study of magic will be advanced by centuries.",
            responses: [
                 { text: "(Continue)", next: 'mrd_7_c' }
            ]
        },
        mrd_7_c: {
             npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Thank you, adventurer. Please, take this for your invaluable contribution to science! I have another talisman you might find useful.",
            responses: [
                 { text: "It was a pleasure.", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery' }] }
            ]
        },
        post_quest_magical_runestone_discovery: {
            npcName: 'Wizard Elmsworth',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Ah, my star pupil! How goes the runecrafting? Made any new discoveries of your own?",
            responses: []
        },

        // Wizard Elmsworth (Projection) in Rune Essence Mine
        in_progress_magical_runestone_discovery_1: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Can you hear me? It worked! Astounding! This is a two-way communication spell, clever eh? Now, tell me, what do you see around you?",
            responses: [
                { text: "I see a big rock with a pulsating energy coming from it.", next: 'telecommune_good_response' },
                { text: "I don't see anything of interest.", next: 'telecommune_bad_response' },
            ],
            conditionalResponses: [
                { text: "Reporting in.", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 3 }], successNode: 'mrd_projection_on_fritz', failureNode: '' } }
            ]
        },
        telecommune_bad_response: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Nonsense! The readings were off the charts! There must be something there. Look again, adventurer!",
            responses: [
                { text: "Alright, alright. There's a large, pulsating rock here.", next: 'telecommune_good_response' },
            ]
        },
        telecommune_good_response: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Fascinating! A 'pulsating rock'... this must be the source of the resonance. I need a sample! Can you mine me five chunks of that rock? If you don't have a pickaxe, you'll need to go back and get one. I've unlocked the path back to the mine depths for you.",
            responses: [
                { text: "I'll get right on it.", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery' }] },
            ]
        },
        in_progress_magical_runestone_discovery_2: {
             npcName: 'Wizard Elmsworth (Projection)',
             npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
             text: "Have you gathered those five chunks yet? I'm practically vibrating with anticipation!",
             responses: [ { text: "Not yet." } ]
        },
        mrd_projection_on_fritz: {
            npcName: 'Wizard Elmsworth (Projection)',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "My... project... *fzzzt*... is destabilizing... bring the... *crackle*... samples to me in the... library... *pop*...",
            responses: []
        },
        
        // Gust Altar
        start: {
            npcName: 'Approach the altar',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "The altar hums with a faint, windy energy.",
            responses: []
        },
        in_progress_magical_runestone_discovery_4: {
            npcName: 'Approach the altar',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "As you approach the altar, the trinket and the rock chunks in your pack begin to vibrate violently, almost shaking out of your hands. They seem drawn to this place.",
            responses: [
                { text: "(Perhaps I should report this back to Elmsworth.)", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery' }] }
            ]
        },
        in_progress_magical_runestone_discovery_6: {
            npcName: 'Approach the altar',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "Elmsworth's words echo in your mind. He suggested placing both the trinket and the essence on the altar.",
            responses: [
                { text: "(Combine the talisman and essence on the altar)", check: { requirements: [{ type: 'items', items: [{ itemId: 'gust_talisman', quantity: 1 }, { itemId: 'rune_essence', quantity: 5 }] }], successNode: 'craft_runes_success', failureNode: 'craft_runes_fail' }, actions: [{ type: 'take_item', itemId: 'rune_essence', quantity: 5 }, { type: 'give_item', itemId: 'gust_rune', quantity: 5 }, { type: 'give_xp', skill: SkillName.Runecrafting, amount: 25 }, { type: 'advance_quest', questId: 'magical_runestone_discovery' }] }
            ]
        },
        craft_runes_success: {
            npcName: 'Approach the altar',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "As you place the items on the altar, they are consumed in a flash of windy light! In their place, several small, flat stones inscribed with glowing runes appear.",
            responses: []
        },
        craft_runes_fail: {
            npcName: 'Approach the altar',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "You don't have all the necessary components. Elmsworth mentioned a talisman and five rune essence chunks.",
            responses: []
        }
    }
};
