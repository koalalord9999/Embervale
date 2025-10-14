import { Quest, SkillName } from '../../types';

export const theArcaneAwakening: Quest = {
    id: 'the_arcane_awakening',
    name: "The Arcane Awakening",
    description: "Archmage Theron has detected a dangerous instability in the world's magical weave. He needs help to locate and stop the source of the Resonance Cascade.",
    startHint: "Speak to Archmage Theron in Silverhaven's Arcane Wares shop. (Requires Magic 40, 'The Capital's Call' completed).",
    playerStagePerspectives: [
        "Theron gave me an Arcane Resonator. I need to take readings from the altars of Gust, Stone, and Aqua.",
        "I have the readings. I must return to Archmage Theron in Silverhaven.",
        "Theron has sent me to the Skyship Captain at the Silverhaven Docks to arrange travel to the Crystalline Isles.",
        "The Captain can't fly through the turbulence. He sent me to find a dwarf named Durin at the Dwarven Outpost to build a Resonance Dampener.",
        "Durin needs rare materials: 5 Golem Cores, 10 Runic Bars, and 1 Eldritch Pearl.",
        "I have the materials. I need to return to Durin at the Dwarven Outpost.",
        "I have the Resonance Dampener. I must bring it to the Skyship Captain in Silverhaven.",
        "I've reached the Crystalline Isles. Theron said the source of the disturbance is here. I should investigate the Magus Spire.",
        "I have entered the Magus Spire. I must find and defeat the source of the Resonance Cascade at its apex.",
        "I defeated the Arcane Wyvern. The magical weave feels stable again. I should report my success to Archmage Theron."
    ],
    completionSummary: "I helped Archmage Theron stabilize the Arcane Weave. After gathering readings from three altars, I traveled to the Dwarven Outpost to have a Resonance Dampener built. This allowed me to travel to the Crystalline Isles, where I ascended the Magus Spire and defeated the Arcane Wyvern, the source of the instability. Theron has rewarded me with knowledge of the highest tier of magic.",
    stages: [
        { requirement: { type: 'gather', items: [{ itemId: 'gust_reading', quantity: 1 }, { itemId: 'stone_reading', quantity: 1 }, { itemId: 'aqua_reading', quantity: 1 }] }, description: "Use the Arcane Resonator at the Gust, Stone, and Aqua altars." },
        { requirement: { type: 'talk', poiId: 'silverhaven_arcane_wares', npcName: 'Archmage Theron' }, description: "Return the readings to Archmage Theron." },
        { requirement: { type: 'talk', poiId: 'silverhaven_docks', npcName: 'Skyship Captain' }, description: "Speak to the Skyship Captain." },
        { requirement: { type: 'talk', poiId: 'dwarven_forge', npcName: 'Durin' }, description: "Find Durin at the Dwarven Outpost." },
        { requirement: { type: 'gather', items: [{ itemId: 'golem_core', quantity: 5 }, { itemId: 'runic_bar', quantity: 10 }, { itemId: 'eldritch_pearl', quantity: 1 }] }, description: "Gather materials for the Resonance Dampener." },
        { requirement: { type: 'talk', poiId: 'dwarven_forge', npcName: 'Durin' }, description: "Return to Durin with the materials." },
        { requirement: { type: 'talk', poiId: 'silverhaven_docks', npcName: 'Skyship Captain' }, description: "Bring the Resonance Dampener to the Skyship Captain." },
        { requirement: { type: 'talk', poiId: 'magus_spire_entrance', npcName: 'Enter the Spire' }, description: "Enter the Magus Spire on the Crystalline Isles." },
        { requirement: { type: 'kill', monsterId: 'arcane_wyvern', quantity: 1 }, description: "Defeat the source of the disturbance at the spire's apex." },
        { requirement: { type: 'talk', poiId: 'silverhaven_arcane_wares', npcName: 'Archmage Theron' }, description: "Report your success to Archmage Theron." }
    ],
    rewards: {
        xp: [{ skill: SkillName.Magic, amount: 10000 }],
        coins: 5000,
        items: [{ itemId: 'tome_of_the_master', quantity: 1 }]
    },
    dialogue: {
        theron_default: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Hmm... no, that can't be right. The ley lines are... fluctuating. Oh! Apologies, adventurer. I was lost in thought. The weave of magic is a delicate thing. One must always be vigilant.",
            responses: [],
            conditionalResponses: [
                {
                    text: "Archmage, I've felt a strange disturbance in the magical weave recently. Is everything alright?",
                    check: {
                        requirements: [
                            { type: 'quest', questId: 'the_arcane_awakening', status: 'not_started' },
                            { type: 'skill', skill: SkillName.Magic, level: 40 },
                            { type: 'quest', questId: 'capitals_call', status: 'completed' }
                        ],
                        successNode: 'taa_quest_intro',
                        failureNode: ''
                    }
                },
                { text: "I have a question about the Resonance Cascade.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 0 }], successNode: 'in_progress_the_arcane_awakening_0', failureNode: '' } },
                { text: "I have the readings you requested.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 1 }], successNode: 'taa_stage_1_complete', failureNode: '' } },
                { text: "I have defeated the Arcane Wyvern.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 9 }], successNode: 'taa_stage_9_complete', failureNode: '' } },
                { text: "It's good to see the Arcane Weave is stable.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'completed' }], successNode: 'post_quest_the_arcane_awakening', failureNode: '' } }
            ]
        },
        taa_quest_intro: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "You sense it too? Grave concern is an understatement. I've detected a growing instability in the world's 'Arcane Weave'—a magical feedback loop I call the Resonance Cascade. Higher-level spells tap directly into this Weave, and if uncontrolled, it could tear reality apart.",
            responses: [
                { text: "What needs to be done?", next: 'taa_intro_2' }
            ]
        },
        taa_intro_2: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "I must find the source of this disturbance. I've constructed this Arcane Resonator. I need you to take it to the three major runic altars—Gust, Stone, and Aqua—and take a reading from each. This will allow me to triangulate the source.",
            responses: [
                { text: "I will handle this. The fate of the world may depend on it.", actions: [{ type: 'start_quest', questId: 'the_arcane_awakening' }, { type: 'give_item', itemId: 'arcane_resonator', quantity: 1 }] }
            ]
        },
        in_progress_the_arcane_awakening_0: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Have you taken the readings from the three altars yet? Time is of the essence.",
            responses: []
        },
        taa_stage_1_complete: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "You have them! Let me see... By the arcane! This is worse than I feared. The readings... they don't point to anywhere on the ground. They point... up. High into the sky. To a place of legend: The Crystalline Isles.",
            responses: [
                { text: "What are the Crystalline Isles?", next: 'taa_stage_1_2' }
            ]
        },
        taa_stage_1_2: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Floating islands of pure magic, normally shielded from our world. The Resonance Cascade must have weakened their defenses, making them accessible but dangerously unstable. The source is there. You must go. Find the Skyship Captain at the docks. He is your only way up.",
            responses: [
                { text: "I'll speak with him at once.", actions: [{ type: 'advance_quest', questId: 'the_arcane_awakening' }, { type: 'take_item', itemId: 'gust_reading', quantity: 1 }, { type: 'take_item', itemId: 'stone_reading', quantity: 1 }, { type: 'take_item', itemId: 'aqua_reading', quantity: 1 }] }
            ]
        },
        taa_stage_9_complete: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "You've returned! And the Weave... it's stable! Calm! You defeated the Arcane Wyvern? Astounding! You have not just stopped the cascade but stabilized the entire world's magic. You are truly a master of the arcane.",
            responses: [
                { text: "It was a difficult battle, but I prevailed.", next: 'taa_reward' }
            ]
        },
        taa_reward: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "For this grand service, I will teach you the highest tier of magic. You have proven yourself worthy. Take this as well, a small token of my immense gratitude. You have saved us all.",
            responses: [
                { text: "Thank you, Archmage.", actions: [{ type: 'advance_quest', questId: 'the_arcane_awakening' }] }
            ]
        },
        post_quest_the_arcane_awakening: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Thank you again for your help, hero. The Arcane Weave has been stable ever since you defeated the wyvern. The world is in your debt.",
            responses: []
        },

        captain_default: {
            npcName: 'Skyship Captain',
            npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
            text: "The skies call, but they're a fickle mistress. Where are you looking to go?",
            responses: [],
            conditionalResponses: [
                { text: "Archmage Theron sent me. I need passage to the Crystalline Isles.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 2 }], successNode: 'taa_captain_stage_2', failureNode: '' } },
                { text: "I have the Resonance Dampener.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 6 }], successNode: 'taa_captain_stage_6', failureNode: '' } },
                { text: "I need to return to the Crystalline Isles.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 7 }], successNode: 'taa_captain_free_travel_to_isles', failureNode: '' } },
                { text: "I need to return to the Crystalline Isles.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 8 }], successNode: 'taa_captain_free_travel_to_isles', failureNode: '' } },
                { text: "I need to return to the Crystalline Isles.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 9 }], successNode: 'taa_captain_free_travel_to_isles', failureNode: '' } }
            ]
        },
        captain_isles_default: {
            npcName: 'Skyship Captain',
            npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
            text: "Breathtaking, isn't it? When you're ready to return to solid ground, just say the word.",
            responses: [
                {
                    text: "Take me back to Silverhaven.",
                    actions: [{ type: 'teleport', poiId: 'silverhaven_docks' }]
                },
                {
                    text: "I'm not ready to leave yet."
                }
            ]
        },
        taa_captain_stage_2: {
            npcName: 'Skyship Captain',
            npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
            text: "To the Crystalline Isles? Are you mad? The magical turbulence up there would tear my ship apart! The arcane energies are too severe.",
            responses: [
                { text: "Is there anything that can be done?", next: 'taa_captain_2_b' }
            ]
        },
        taa_captain_2_b: {
            npcName: 'Skyship Captain',
            npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
            text: "I'd need a special component, a 'Resonance Dampener', to navigate that storm. I'm a captain, not an engineer. But I've heard tales of a master craftsman known for working with exotic materials—Durin, at the Dwarven Outpost. If anyone can build such a thing, it's him.",
            responses: [
                { text: "Thank you, Captain. I'll find this Durin.", actions: [{ type: 'advance_quest', questId: 'the_arcane_awakening' }] }
            ]
        },
        taa_captain_stage_6: {
            npcName: 'Skyship Captain',
            npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
            text: "By my beard... is that a Resonance Dampener? I never thought I'd see one! The dwarf actually built it! With this... yes, with this, we can make the voyage. Prepare yourself, adventurer. The skies await!",
            responses: [
                { text: "(Board the Skyship)", actions: [{ type: 'take_item', itemId: 'resonance_dampener', quantity: 1 }, { type: 'advance_quest', questId: 'the_arcane_awakening' }, { type: 'teleport', poiId: 'crystalline_isles_landing' }] }
            ]
        },
        taa_captain_free_travel_to_isles: {
            npcName: 'Skyship Captain',
            npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
            text: "Aye, the Archmage's business is important. Hop aboard, I'll take you up.",
            responses: [
                { text: "(Board the Skyship)", actions: [{ type: 'teleport', poiId: 'crystalline_isles_landing' }] }
            ]
        },

        durin_default: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "Busy at the forge, what do you need?",
            responses: [],
            conditionalResponses: [
                { text: "I was told you could build a 'Resonance Dampener'.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 3 }], successNode: 'quest_intro_resonance_dampener', failureNode: '' } },
                { text: "About the Resonance Dampener materials...", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 4 }], successNode: 'taa_durin_stage_4_no_items', failureNode: '' } },
                { text: "About the Resonance Dampener materials...", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 5 }], successNode: 'taa_durin_stage_5_check', failureNode: '' } },
            ]
        },
        quest_intro_resonance_dampener: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "A Resonance whatsit? Hah! That sky-sailor sent you, didn't he? Aye, I can build such a thing. Dwarven engineering can solve any problem. But it won't be cheap, and it won't be easy. I'll need some... particular components.",
            responses: [{ text: "What do you need?", actions: [{ type: 'advance_quest', questId: 'the_arcane_awakening' }] }]
        },
        taa_durin_stage_4_no_items: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "Right. To build this 'Resonance Dampener', I'll need three things: 5 Golem Cores, 10 Runic Bars, and one Eldritch Pearl. A strange shopping list, I know, but this is strange magic. Do you need me to explain where to find any of these?",
            responses: [
                { text: "Where do I find Golem Cores?", next: 'taa_durin_explain_cores' },
                { text: "Where can I get Runic Bars?", next: 'taa_durin_explain_bars' },
                { text: "Tell me about the Eldritch Pearl.", next: 'taa_durin_explain_pearl' },
                { text: "I understand. I will gather the materials." }
            ]
        },
        taa_durin_explain_cores: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "The Stone Golems that guard the highest reaches of the Gale-Swept Peaks. They're tough buggers, made of the mountain itself. Smash 'em up and bring me their cores. You'll need five of them.",
            responses: [
                { text: "Anything else?", next: 'taa_durin_stage_4_no_items' }
            ]
        },
        taa_durin_explain_bars: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "Ten Runic Bars. That's the strongest metal we can work, and you'll have to smith them yourself. You'll need Titanium ore and a whole lot of coal. I've heard rumors, though... whispers from the deep places... that many of the denizens of the Sunken Labyrinth, are sometimes found carrying runic bars. Might be quicker than mining, if you're brave enough.",
            responses: [
                { text: "Anything else?", next: 'taa_durin_stage_4_no_items' }
            ]
        },
        taa_durin_explain_pearl: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "The Eldritch Pearl is not a gem of the earth. They say the Shipwreck Specters that haunt the Isle of Whispers sometimes carry them... remnants of the souls they've dragged to the depths. You'll have to face the dead to get the one I need.",
            responses: [
                { text: "Anything else?", next: 'taa_durin_stage_4_no_items' }
            ]
        },
        taa_durin_stage_5_check: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "Aye, the dampener. A tricky piece of work. Have you managed to gather all the components I asked for?",
            responses: [
                { text: "Not yet, can you remind me what you need?", next: 'taa_durin_stage_4_no_items' }
            ],
            conditionalResponses: [
                {
                    text: "Yes, I have everything right here.",
                    check: {
                        requirements: [
                            { type: 'items', items: [{ itemId: 'golem_core', quantity: 5 }, { itemId: 'runic_bar', quantity: 10 }, { itemId: 'eldritch_pearl', quantity: 1 }] }
                        ],
                        successNode: 'taa_durin_stage_5_has_items',
                        failureNode: '' // This shouldn't be reachable if the option is visible
                    }
                }
            ]
        },
        taa_durin_stage_5_has_items: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "You have them! By my father's beard, you actually have them! Alright, a deal's a deal. Stand back... this requires a delicate touch. *clang* *whirr* *clank* ...There! One Resonance Dampener, as ordered. Now get that thing to your captain before it attracts any more attention.",
            responses: [{ text: "Thank you, master dwarf.", actions: [{ type: 'take_item', itemId: 'golem_core', quantity: 5 }, { type: 'take_item', itemId: 'runic_bar', quantity: 10 }, { type: 'take_item', itemId: 'eldritch_pearl', quantity: 1 }, { type: 'give_item', itemId: 'resonance_dampener', quantity: 1 }, { type: 'advance_quest', questId: 'the_arcane_awakening' }] }]
        },

        enter_spire_start: {
            npcName: 'Magus Spire',
            npcIcon: 'https://api.iconify.design/game-icons:rune-gate.svg',
            text: "The shimmering doorway hums with immense power. Stepping through it will take you into the heart of the arcane disturbance.",
            responses: [
                { text: "(Enter the Spire)", actions: [{ type: 'advance_quest', questId: 'the_arcane_awakening' }, { type: 'teleport', poiId: 'ms_f1_antechamber' }] }
            ]
        },
        
        // Altar Dialogues
        use_resonator_gust: {
            npcName: 'Arcane Resonator', npcIcon: 'https://api.iconify.design/game-icons:orb-wand.svg',
            text: "You hold the Arcane Resonator up to the Gust Altar. It begins to vibrate violently, and a shimmering creature of pure energy coalesces before you!",
            responses: [
                { text: "(Face the creature)", check: { requirements: [ { type: 'items', items: [{ itemId: 'arcane_resonator', quantity: 1 }] }, { type: 'items', items: [{ itemId: 'gust_reading', quantity: 0, operator: 'eq' }] } ], successNode: 'trigger_combat', failureNode: 'already_have_reading' }, actions: [{ type: 'set_quest_combat_reward', itemId: 'gust_reading', quantity: 1 }, { type: 'start_mandatory_combat', monsterId: 'mana_wisp' }] }
            ]
        },
        use_resonator_stone: {
            npcName: 'Arcane Resonator', npcIcon: 'https://api.iconify.design/game-icons:orb-wand.svg',
            text: "You hold the Arcane Resonator up to the Stone Altar. It begins to vibrate violently, and a shimmering creature of pure energy coalesces before you!",
            responses: [
                { text: "(Face the creature)", check: { requirements: [ { type: 'items', items: [{ itemId: 'arcane_resonator', quantity: 1 }] }, { type: 'items', items: [{ itemId: 'stone_reading', quantity: 0, operator: 'eq' }] } ], successNode: 'trigger_combat', failureNode: 'already_have_reading' }, actions: [{ type: 'set_quest_combat_reward', itemId: 'stone_reading', quantity: 1 }, { type: 'start_mandatory_combat', monsterId: 'mana_wisp' }] }
            ]
        },
        use_resonator_aqua: {
            npcName: 'Arcane Resonator', npcIcon: 'https://api.iconify.design/game-icons:orb-wand.svg',
            text: "You hold the Arcane Resonator up to the Aqua Altar. It begins to vibrate violently, and a shimmering creature of pure energy coalesces before you!",
            responses: [
                { text: "(Face the creature)", check: { requirements: [ { type: 'items', items: [{ itemId: 'arcane_resonator', quantity: 1 }] }, { type: 'items', items: [{ itemId: 'aqua_reading', quantity: 0, operator: 'eq' }] } ], successNode: 'trigger_combat', failureNode: 'already_have_reading' }, actions: [{ type: 'set_quest_combat_reward', itemId: 'aqua_reading', quantity: 1 }, { type: 'start_mandatory_combat', monsterId: 'mana_wisp' }] }
            ]
        },
        trigger_combat: {
            npcName: 'Arcane Resonator', npcIcon: 'https://api.iconify.design/game-icons:orb-wand.svg',
            text: "The Mana Wisp shrieks and attacks!",
            responses: [],
        },
        already_have_reading: {
            npcName: 'Arcane Resonator', npcIcon: 'https://api.iconify.design/game-icons:orb-wand.svg',
            text: "You've already taken a reading from this altar.",
            responses: []
        }
    }
};