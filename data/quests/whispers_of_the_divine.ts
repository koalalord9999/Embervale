
/**
 * Quest: Whispers of the Divine (Main Quest)
 * ==========================================
 *
 * Synopsis:
 * -----------
 * The stabilization of the Arcane Weave in "The Arcane Awakening," Archmage Theron detects
 * a new, subtle layer of energy emanating from high-level runic altars. Believing they hold a deeper
 * purpose than just rune crafting, he creates an "Attuned Locus" and tasks the player with using it at
 * three powerful, remote altars: the Verdant Altar (Nature/Life), the Nexus Altar (Death/Balance),
 * and the Hex Altar (Curses/Control). At each altar, the Locus allows the player to hear a divine
 * "echo"—a cryptic verse from a forgotten god associated with that domain. The player collects these
 * three "Verse Fragments" and returns them to Theron. The archmage deciphers the combined text,
 * revealing a fragment of the world's creation myth concerning these three divine aspects. As a reward,
 * Theron is able to channel the residual divine energy into a cape, allowing the player to choose one
 * of three powerful capes aligned with the aspects they communed with.
 *
 * Why it happened:
 * ----------------
 * The stabilization of the world's magic has made it possible to perceive more ancient and subtle
 * energies. The divine echoes, which have always been present but were previously drowned out by the
 * magical "noise" of the Resonance Cascade, can now be heard by a properly attuned individual using
 * Theron's device.
 *
 * Lore Explained:
 * ---------------
 * - This is a high-level main quest that directly addresses the lore of the gods and the purpose of the altars.
 * - It establishes that the gods of Embrune are not entirely absent but have left behind "echoes" of their
 *   power and consciousness, which are tied to the runecrafting altars.
 * - It reveals that the altars are more than just crafting stations; they are conduits to ancient divine
 *   energies and repositories of forgotten knowledge.
 * - The three aspects explored (Verdant/Nature, Hex/Control, Nexus/Balance) provide a framework for the
 *   world's cosmology and the different types of magic.
 * - The reward (a choice of powerful capes) allows the player to align themselves with one of these divine
 *   aspects, adding a role-playing element and tying game mechanics to lore.
 *
 * Divine Verses Content:
 * ----------------------
 * The following are the three cryptic verses the player receives. These can be used to generate
 * the dialogue when the player receives the fragments and when Theron deciphers them.
 *
 *   1. Verdant Verse (from the Verdant Altar):
 *      "From silent stone, the First Root drank the sun,
 *       Life's green fire, in every leaf and thorn.
 *       The Great Song began, a chorus newly born,
 *       My breath is the wind, my blood the river's run."
 *
 *   2. Nexus Verse (from the Nexus Altar):
 *      "When the Song fades, and the final leaf descends,
 *       To silent dust, all vibrant color blends.
 *       I am the pause, where every story ends,
 *       The patient soil, where new life then depends."
 *
 *   3. Hex Verse (from the Hex Altar):
 *      "Before the Song, there was the single thought,
 *       A pattern drawn, a boundary newly wrought.
 *       I gave the law by which all things are caught,
 *       The binding word, the fate that can't be fought."
 *
 * Approximate Duration:
 * ---------------------
 * Long (60-90 minutes). This is a high-level "messenger" quest. The challenge comes not from new combat
 * encounters introduced by the quest itself, but from the requirement to travel to three separate,
 * dangerous, high-level zones (The Feywood, The Serpent's Coil/Sunken Labyrinth, Whispering Isle Dungeon),
 * implying the player must already be strong enough to survive these locations.
 *
 */
import { Quest, SkillName } from '../../types';

export const whispersOfTheDivine: Quest = {
    id: 'whispers_of_the_divine',
    name: "Whispers of the Divine",
    description: "Archmage Theron has detected strange energies coalescing at the runic altars, suggesting they hold a deeper purpose.",
    isHidden: false,
    startHint: "Speak to Archmage Theron after completing 'The Arcane Awakening'.",
    playerStagePerspectives: [
        "Theron has given me an Attuned Locus to investigate the Verdant Altar in the Feywood.", // 0
        "I have communed with the Verdant Altar. I should return to Archmage Theron.", // 1
        "Theron has deciphered the first verse. Now I must seek out the Hex Altar in the Serpent's Coil.", // 2
        "I have communed with the Hex Altar. I should return to Archmage Theron.", // 3
        "Two verses are deciphered. The final echo awaits at the Nexus Altar within the Sunken Labyrinth.", // 4
        "I have the final verse. I must bring it to Theron so he can complete the creation myth.", // 5
        "Theron has deciphered the full verse! I should speak to him to receive my reward." // 6
    ],
    completionSummary: "Using an Attuned Locus from Theron, I communed with the echoes of forgotten gods at three great altars. I returned their cryptic verses to the Archmage, who deciphered them, revealing a fragment of the world's creation myth. For my service, I was rewarded with a powerful cape embodying one of the divine aspects.",
    stages: [
        {
            description: "Commune with the Verdant Altar.",
            requirement: { type: 'talk', poiId: 'verdant_altar', npcName: 'Commune with the Altar' }
        },
        {
            description: "Return to Archmage Theron.",
            requirement: { type: 'talk', poiId: 'silverhaven_arcane_wares', npcName: 'Archmage Theron' }
        },
        {
            description: "Commune with the Hex Altar.",
            requirement: { type: 'talk', poiId: 'hex_altar', npcName: 'Commune with the Altar' }
        },
        {
            description: "Return to Archmage Theron.",
            requirement: { type: 'talk', poiId: 'silverhaven_arcane_wares', npcName: 'Archmage Theron' }
        },
        {
            description: "Commune with the Nexus Altar.",
            requirement: { type: 'talk', poiId: 'laby_central_altar', npcName: 'Commune with the Altar' }
        },
        {
            description: "Return to Archmage Theron.",
            requirement: { type: 'talk', poiId: 'silverhaven_arcane_wares', npcName: 'Archmage Theron' }
        },
        {
            description: "Speak to Archmage Theron to receive your reward.",
            requirement: { type: 'talk', poiId: 'silverhaven_arcane_wares', npcName: 'Archmage Theron' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Runecrafting, amount: 25000 }, { skill: SkillName.Magic, amount: 15000 }],
        items: [{ itemId: 'celestial_verse', quantity: 1 }]
    },
    dialogueEntryPoints: [
        {
            npcName: 'Archmage Theron',
            response: {
                text: "You seem deep in thought, Archmage.",
                check: {
                    requirements: [
                        { type: 'quest', questId: 'whispers_of_the_divine', status: 'not_started' },
                        { type: 'quest', questId: 'the_arcane_awakening', status: 'completed' }
                    ],
                    successNode: 'wod_quest_intro',
                    failureNode: ''
                }
            }
        },
        {
            npcName: 'Archmage Theron',
            response: {
                text: "I've returned from the altar.",
                check: {
                    requirements: [ { type: 'quest', questId: 'whispers_of_the_divine', status: 'in_progress', stage: 1 } ],
                    successNode: 'wod_return_verdant_check',
                    failureNode: ''
                }
            }
        },
        {
            npcName: 'Archmage Theron',
            response: {
                text: "I've returned from the second altar.",
                check: {
                    requirements: [ { type: 'quest', questId: 'whispers_of_the_divine', status: 'in_progress', stage: 3 } ],
                    successNode: 'wod_return_hex_check',
                    failureNode: ''
                }
            }
        },
        {
            npcName: 'Archmage Theron',
            response: {
                text: "I have the final verse fragment.",
                check: {
                    requirements: [ { type: 'quest', questId: 'whispers_of_the_divine', status: 'in_progress', stage: 5 } ],
                    successNode: 'wod_return_nexus_check',
                    failureNode: ''
                }
            }
        }
    ],
    dialogue: {
        wod_quest_intro: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Ah, adventurer. I'm glad you're here. Since you stabilized the Arcane Weave, I've noticed something... new. Or rather, something ancient that was previously obscured. Do you have a moment?",
            responses: [
                { text: "Of course. What have you discovered?", next: 'wod_intro_hub' }
            ]
        },
        wod_intro_hub: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The 'quiet' of the Weave has allowed me to hear whispers—echoes from the divine. I believe the runecrafting altars hold a deeper purpose than merely crafting runes. I need your help to investigate this phenomenon.",
            responses: [
                { text: "What do you mean the Weave is 'quiet'?", next: 'wod_lore_weave' },
                { text: "Tell me more about these 'divine echoes'.", next: 'wod_lore_echoes' },
                { text: "What is the task you need help with?", next: 'wod_task_hub' },
                { text: "I'm not interested right now." }
            ]
        },
        wod_lore_weave: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Before you stopped the Resonance Cascade, the world's magic was like a constant roar of static. It was powerful, yes, but chaotic. Now that it's gone, I can perceive much subtler, more ancient energies that were drowned out by the noise.",
            responses: [
                { text: "(Ask about something else)", next: 'wod_intro_hub' }
            ]
        },
        wod_lore_echoes: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "I believe the gods who shaped this world left behind imprints of their consciousness at their places of power—the great altars. They are more than just tools for crafting runes; they are repositories of forgotten history, fragments of the divine will.",
            responses: [
                { text: "(Ask about something else)", next: 'wod_intro_hub' }
            ]
        },
        wod_task_hub: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "I need you to investigate three of the most powerful altars. I have created this Attuned Locus to capture their echoes. Which would you like to know more about before you begin?",
            responses: [
                { text: "Tell me about the Verdant Altar.", next: 'wod_altar_verdant_lore' },
                { text: "Tell me about the Hex Altar.", next: 'wod_altar_hex_lore' },
                { text: "Tell me about the Nexus Altar.", next: 'wod_altar_nexus_lore' },
                { text: "I'm ready. Where do I go first?", next: 'wod_task_accept' }
            ]
        },
        wod_altar_verdant_lore: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The Verdant Altar lies deep within the Feywood, a place of untamed, rampant life. It is the echo of the god of growth, nature, and the 'Great Song' of existence. The forest itself is a living, breathing entity that does not welcome outsiders.",
            responses: [
                { text: "(Ask about another altar)", next: 'wod_task_hub' }
            ]
        },
        wod_altar_hex_lore: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The Hex Altar is a place of dark power, hidden within the Serpent's Coil. It resonates with energies of control, binding, and fate. It represents the laws and patterns that were set before life itself began. Tread carefully there.",
            responses: [
                { text: "(Ask about another altar)", next: 'wod_task_hub' }
            ]
        },
        wod_altar_nexus_lore: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The Nexus Altar is the most enigmatic. It is found at the heart of the Sunken Labyrinth and represents balance, endings, and the silence from which new beginnings emerge. It is the echo of death, not as an evil, but as a necessary part of the cycle.",
            responses: [
                { text: "(Ask about another altar)", next: 'wod_task_hub' }
            ]
        },
        wod_task_accept: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Excellent. We must proceed in a specific order to properly calibrate the Locus. Your first destination is the Verdant Altar. Take this, and be careful. The Feywood is not to be trifled with.",
            responses: [
                { text: "I will retrieve the first echo.", actions: [{ type: 'start_quest', questId: 'whispers_of_the_divine' }, { type: 'give_item', itemId: 'attuned_locus', quantity: 1 }] }
            ]
        },
        wod_return_verdant_check: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "You've returned! Did you succeed? Did you hear the echo from the Verdant Altar?",
            responses: [
                { text: "I did. The Locus recorded its impression.", check: { requirements: [{ type: 'items', items: [{ itemId: 'fragment_of_verdant_verse', quantity: 1 }] }], successNode: 'wod_riddle_verdant_intro', failureNode: 'wod_in_progress_0' } }
            ]
        },
        wod_in_progress_0: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The Verdant Altar in the Feywood awaits. The secrets of our world's dawn are waiting to be heard.",
            responses: []
        },
        wod_riddle_verdant_intro: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Excellent! The Locus captured the raw energy, but the meaning is... jumbled. My translation is incomplete. It says: 'The ___ began, a chorus newly born.' Your impression is the key. What did you feel at the altar?",
            responses: [
                { text: "Impressions of Growth and Song.", next: 'wod_riddle_verdant_success' },
                { text: "A feeling of Order and Law.", next: 'wod_riddle_fail' },
                { text: "A sense of Endings and Silence.", next: 'wod_riddle_fail' },
            ]
        },
        wod_riddle_fail: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "No... that doesn't align with the energy signature. Think back to the feeling of the place. The clues are in your memory, and your activity log.",
            responses: [],
            conditionalResponses: [
                { text: "Let me try again.", check: { requirements: [{ type: 'quest', questId: 'whispers_of_the_divine', status: 'in_progress', stage: 1 }], successNode: 'wod_riddle_verdant_intro', failureNode: '' } },
                { text: "Let me try again.", check: { requirements: [{ type: 'quest', questId: 'whispers_of_the_divine', status: 'in_progress', stage: 3 }], successNode: 'wod_riddle_hex_intro', failureNode: '' } },
                { text: "Let me try again.", check: { requirements: [{ type: 'quest', questId: 'whispers_of_the_divine', status: 'in_progress', stage: 5 }], successNode: 'wod_riddle_nexus_intro', failureNode: '' } }
            ]
        },
        wod_riddle_verdant_success: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Yes, 'Great Song'! The Locus glows as the verse settles into clarity. One piece of the puzzle is in place. Now, for the second. You must travel to the Hex Altar, hidden in the Serpent's Coil. It resonates with a much different energy—one of control and binding.",
            responses: [
                { text: "I'm on my way.", actions: [{ type: 'advance_quest', questId: 'whispers_of_the_divine' }, { type: 'take_item', itemId: 'fragment_of_verdant_verse', quantity: 1 }] }
            ]
        },
        wod_return_hex_check: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The air around you feels... heavy. You have been to the Hex Altar. Did the Locus capture its echo?",
            responses: [
                { text: "Yes, I have the second impression.", check: { requirements: [{ type: 'items', items: [{ itemId: 'fragment_of_hex_verse', quantity: 1 }] }], successNode: 'wod_riddle_hex_intro', failureNode: 'wod_in_progress_2' } }
            ]
        },
        wod_in_progress_2: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The Hex Altar is a place of dark power, deep within the Serpent's Coil. Be careful, adventurer.",
            responses: []
        },
        wod_riddle_hex_intro: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Excellent. This one feels... older. Colder. My partial translation reads: 'The ___ ___, the fate that can't be fought.' What was the core concept you felt?",
            responses: [
                { text: "Growth and Song.", next: 'wod_riddle_fail' },
                { text: "Law and Fate.", next: 'wod_riddle_hex_success' },
                { text: "Endings and Silence.", next: 'wod_riddle_fail' },
            ]
        },
        wod_riddle_hex_success: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "'Binding Word'! Of course! The echo clarifies. Two verses are now known. The final piece awaits. You must journey to the Nexus Altar at the heart of the Sunken Labyrinth. It speaks of balance, of endings and beginnings.",
            responses: [
                { text: "I will face the Labyrinth.", actions: [{ type: 'advance_quest', questId: 'whispers_of_the_divine' }, { type: 'take_item', itemId: 'fragment_of_hex_verse', quantity: 1 }] }
            ]
        },
        wod_return_nexus_check: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "You have an aura of... stillness about you. You have been to the place where life and death meet. Did you capture the final echo?",
            responses: [
                { text: "I have the final impression.", check: { requirements: [{ type: 'items', items: [{ itemId: 'fragment_of_nexus_verse', quantity: 1 }] }], successNode: 'wod_riddle_nexus_intro', failureNode: 'wod_in_progress_4' } }
            ]
        },
        wod_in_progress_4: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The Sunken Labyrinth is a dangerous, forgotten place. The Nexus Altar at its heart holds the final key. Be safe.",
            responses: []
        },
        wod_riddle_nexus_intro: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The final piece. This one feels... patient. The translation is faint: 'I am the ___, where every story ends...'. What was the feeling that dominated that place?",
            responses: [
                { text: "Growth and Song.", next: 'wod_riddle_fail' },
                { text: "Law and Fate.", next: 'wod_riddle_fail' },
                { text: "Endings and Beginnings.", next: 'wod_riddle_nexus_success' },
            ]
        },
        wod_riddle_nexus_success: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The 'Pause'... yes, it fits perfectly. The final echo is clear! You have all three parts of the verse. Now, let me combine them. This is a historic moment!",
            responses: [
                { text: "(Listen)", actions: [{ type: 'advance_quest', questId: 'whispers_of_the_divine' }, { type: 'take_item', itemId: 'fragment_of_nexus_verse', quantity: 1 }], next: 'wod_final_recitation' }
            ]
        },
        wod_final_recitation: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "'Before the Song, there was the single thought, a pattern drawn, a boundary newly wrought... From silent stone, the First Root drank the sun, Life's green fire... the Great Song began... When the Song fades, and the final leaf descends... I am the pause, where new life then depends.'",
            responses: [
                { text: "What does it mean?", next: 'wod_interpretation' }
            ]
        },
        wod_interpretation: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "It's a creation myth! 'Before the Song'—before life—there was the thought, the pattern. The Hex. The laws of reality. Then came the 'Great Song'—life itself. The Verdant. And finally, the 'pause', the silence, the end of the song... The Nexus. It's the cycle! Order, Life, and Death. You haven't just found some old poetry, you've found the divine blueprint of our world!",
            responses: [
                { text: "Incredible. What now?", next: 'wod_reward_intro' }
            ]
        },
        wod_reward_intro: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "Now? Now we celebrate this monumental discovery! Your Attuned Locus still resonates with the echoes of these three aspects. I believe I can channel that energy, weave it into a physical form. A reward, for your service to all magical and historical understanding. Choose which aspect you feel most attuned to, and I shall craft you a cape worthy of its power.",
            responses: [
                { text: "Show me the options.", next: 'wod_reward_choice' }
            ]
        },
        wod_reward_choice: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "The Cape of Verdant Growth, imbued with the life-giving energy of the Great Song. The Cape of the Hex-binder, resonating with the power of control and arcane law. Or the Cape of the Abyssal Nexus, a mantle of balance and the quiet strength of endings and beginnings. Which will you choose?",
            responses: [
                { text: "I choose the Cape of Verdant Growth.", actions: [{ type: 'give_item', itemId: 'cape_of_verdant_growth', quantity: 1 }, { type: 'advance_quest', questId: 'whispers_of_the_divine' }], next: 'wod_completion' },
                { text: "I choose the Cape of the Hex-binder.", actions: [{ type: 'give_item', itemId: 'cape_of_the_hex-binder', quantity: 1 }, { type: 'advance_quest', questId: 'whispers_of_the_divine' }], next: 'wod_completion' },
                { text: "I choose the Cape of the Abyssal Nexus.", actions: [{ type: 'give_item', itemId: 'cape_of_the_abyssal_nexus', quantity: 1 }, { type: 'advance_quest', questId: 'whispers_of_the_divine' }], next: 'wod_completion' }
            ]
        },
        wod_completion: {
            npcName: 'Archmage Theron',
            npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
            text: "An excellent choice. Wear it as a symbol of your connection to the very foundations of this world. You have done a great service today, adventurer. Thank you.",
            responses: []
        },

        // --- Altar Echoes ---
        wod_verdant_echo: {
            npcName: 'Echo of the Verdant',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "As you hold the Locus to the altar, your mind is flooded not with words, but with impressions: the feeling of a seed sprouting, the first note of a world-spanning song, the inexorable flow of a river, and the warmth of the sun on new leaves.",
            responses: [
                { text: "(The Locus vibrates, recording the impression)", actions: [{ type: 'give_item', itemId: 'fragment_of_verdant_verse', quantity: 1 }, { type: 'advance_quest', questId: 'whispers_of_the_divine' }, { type: 'add_log', message: 'Verdant Altar Impression: Growth and Song.' }] }
            ]
        },
        wod_hex_echo: {
            npcName: 'Echo of the Hex',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "The Locus grows cold as you approach the altar. You feel a sense of immense, ancient order. Impressions of mathematical precision, unbreakable laws, and the chilling certainty of fate fill your mind. It is the feeling of a pattern being drawn, a boundary set in stone before anything else existed.",
            responses: [
                { text: "(The Locus hums, absorbing the echo)", actions: [{ type: 'give_item', itemId: 'fragment_of_hex_verse', quantity: 1 }, { type: 'advance_quest', questId: 'whispers_of_the_divine' }, { type: 'add_log', message: 'Hex Altar Impression: Law and Fate.' }] }
            ]
        },
        wod_nexus_echo: {
            npcName: 'Echo of the Nexus',
            npcIcon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            text: "A profound silence emanates from the altar. You feel a sense of finality, of a song ending and a story closing. But beneath it, there is a patient, quiet waiting—the feeling of fertile soil after a harvest, ready for a new seed. It is an impression of endings that enable new beginnings.",
            responses: [
                { text: "(The Locus grows still as it records the impression)", actions: [{ type: 'give_item', itemId: 'fragment_of_nexus_verse', quantity: 1 }, { type: 'advance_quest', questId: 'whispers_of_the_divine' }, { type: 'add_log', message: 'Nexus Altar Impression: Endings and Beginnings.' }] }
            ]
        },
    }
};
