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
        post_quest_the_arcane_awakening: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Thank you again for your help, hero. The Arcane Weave has been stable ever since you defeated the wyvern. The world is in your debt.",
            responses: []
        },
        quest_intro_the_arcane_awakening: {
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
        quest_intro_resonance_dampener: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "A Resonance whatsit? Hah! That sky-sailor sent you, didn't he? Aye, I can build such a thing. Dwarven engineering can solve any problem. But it won't be cheap, and it won't be easy. I'll need some... particular components.",
            responses: [{ text: "What do you need?", actions: [{ type: 'advance_quest', questId: 'the_arcane_awakening' }] }]
        },
        taa_durin_stage_4_no_items: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "I need 5 Golem Cores from the Stone Golems in the peaks, 10 Runic Bars—you'll have to smith those yourself—and one Eldritch Pearl. They say the Shipwreck Specters on the Isle of Whispers sometimes carry them. A strange list, I know, but this is strange magic. Get me those, and I'll build your dampener.",
            responses: []
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
        use_resonator_start: {
            npcName: 'Arcane Resonator', npcIcon: 'https://api.iconify.design/game-icons:orb-wand.svg',
            text: "You hold the Arcane Resonator up to the altar. It begins to vibrate violently, and a shimmering creature of pure energy coalesces before you!",
            responses: [
                {
                    text: "(Face the creature)",
                    check: {
                        requirements: [
                            { type: 'items', items: [{ itemId: 'arcane_resonator', quantity: 1 }] }
                        ],
                        successNode: 'trigger_combat',
                        failureNode: 'already_have_reading'
                    }
                }
            ]
        }
    }
};
