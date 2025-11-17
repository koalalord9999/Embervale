/**
 * Quest: Depths of Despair (Main Quest)
 * =====================================
 *
 * Synopsis:
 * -----------
 * The dwarves at the Dwarven Outpost have been mining a new passage, but their excavations have caused
 * increasingly violent tremors. Durin, the outpost leader, fears a major collapse is imminent and hires
 * the player to investigate the source. The player ventures into the newly discovered "Chasm of Woe,"
 * a cavern system filled with dangerous new creatures like Chasm Crawlers and Rock Golems. Navigating
 * the treacherous paths, the player reaches the heart of the chasm and discovers the source of the
 * tremors: a colossal, ancient elemental golem known as "The Earth-Render," which has been awakened
 * by the mining. The player must defeat this powerful guardian. Upon its defeat, the tremors cease, and
 * the player can recover its crystalline core, the "Heart of the Mountain." Returning this to Durin, the
 * grateful dwarf uses his smithing expertise to fuse it with the player's Runic Pickaxe, creating a powerful,
 * Crystal-Tipped Runic Pickaxe and granted me access to a new, rich mining area.
 *
 * Why it happened:
 * ----------------
 * Driven by their innate desire to delve deep, the dwarves accidentally broke into a geologically and
 * magically unstable region. Their mining activities disturbed a major nexus of terrestrial energy,
 * awakening its ancient and powerful guardian, The Earth-Render, whose movements were causing the tremors.
 *
 * Lore Explained:
 * ---------------
 * - This quest serves as a main quest line that is independent of the overarching Serpent Bandit plot,
 *   focusing on world-building and elemental lore.
 * - It expands the world downwards, introducing a new, self-contained mid-level dungeon with its own
 *   unique ecosystem of monsters.
 * - It builds upon Dwarven lore, highlighting their ambition, their connection to the earth, and the
 *   potential dangers of "digging too greedily and too deep."
 * - Introduces the concept of powerful, primordial elemental guardians tied to specific locations,
 *   acting as protectors of the natural world.
 *
 * Approximate Duration:
 * ---------------------
 * Medium-Long (45-60 minutes). This quest is designed as a dungeon crawl, requiring the player to
 * fight through several rooms of new mid-level monsters before facing a challenging boss.
 *
 */
import { Quest, SkillName } from '../../types';

export const depthsOfDespair: Quest = {
    id: 'depths_of_despair',
    name: "Depths of Despair",
    description: "The dwarves of the outpost have broken through into a new cavern, but the tremors have worsened and strange creatures are emerging.",
    isHidden: false,
    startHint: "Speak to Durin in the Dwarven Outpost. (Requires Smithing 40).",
    playerStagePerspectives: [
        "Durin is worried about tremors from a new passage in the Outpost Mine. I need to investigate the entrance to the Chasm of Woe.",
        "I've entered the chasm. I must find the source of the tremors deep within.",
        "I've found the source: a massive golem called The Earth-Render. I must defeat it.",
        "I defeated the golem and recovered its core, a 'Heart of the Mountain'. I should bring this back to Durin."
    ],
    completionSummary: "I investigated strange tremors for Durin and discovered a new chasm in the mines. At its heart, I defeated a colossal golem, The Earth-Render. Durin used its core to forge my Runic Pickaxe into a powerful Crystal-Tipped Runic Pickaxe and granted me access to a new, rich mining area.",
    stages: [
        {
            description: "Investigate the Chasm of Woe entrance.",
            requirement: { type: 'talk', poiId: 'chasm_of_woe_entrance', npcName: 'Enter the Chasm' }
        },
        {
            description: "Navigate to the heart of the chasm and confront the source.",
            requirement: { type: 'talk', poiId: 'earth_render_lair', npcName: 'Approach the Golem' }
        },
        {
            description: "Defeat The Earth-Render.",
            requirement: { type: 'kill', monsterId: 'the_earth_render', quantity: 1 }
        },
        {
            description: "Return the Heart of the Mountain to Durin.",
            requirement: { type: 'talk', poiId: 'dwarven_forge', npcName: 'Durin' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Mining, amount: 15000 }, { skill: SkillName.Smithing, amount: 15000 }],
    },
    dialogueEntryPoints: [
        {
            npcName: 'Durin',
            response: {
                text: "You seem worried. Anything an adventurer can help with?",
                check: {
                    requirements: [
                        { type: 'quest', questId: 'depths_of_despair', status: 'not_started' },
                        { type: 'skill', skill: SkillName.Smithing, level: 40 }
                    ],
                    successNode: 'dod_intro',
                    failureNode: ''
                }
            }
        },
        {
            npcName: 'Durin',
            response: {
                text: "I have the Heart of the Mountain.",
                check: {
                    requirements: [{ type: 'quest', questId: 'depths_of_despair', status: 'in_progress', stage: 3 }],
                    successNode: 'dod_durin_return',
                    failureNode: ''
                }
            }
        }
    ],
    dialogue: {
        dod_intro: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "Worried? I'm about to lose my beard to stress! We broke into a new chasm, thought we'd struck the motherlode. But now... tremors. Getting worse every day. The whole outpost shakes like a jelly in a giant's hand!",
            responses: [
                { text: "Tremors? What's causing them?", next: 'dod_durin_explain' },
                { text: "Maybe you just have wobbly knees from all the ale?", next: 'dod_durin_silly' },
                { text: "I'm not an engineer, but I can fight." , next: 'dod_durin_explain_2'},
            ]
        },
        dod_durin_silly: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "Wobbly knees?! I've stood firm against rockfalls that would turn you to paste, you long-legged twig! This is serious!",
            responses: [
                { text: "My apologies. What seems to be the problem?", next: 'dod_durin_explain' }
            ]
        },
        dod_durin_explain: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "That's what I need to find out! My miners are too spooked to go back down. They say the very rock groans, and strange, chitinous creatures are crawling out of the dark. We've dubbed it the 'Chasm of Woe'.",
            responses: [
                 { text: "So you need someone to go in and take a look?", next: 'dod_durin_task' }
            ]
        },
         dod_durin_explain_2: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "And fighting might be just what's needed! My miners are too spooked to go back down. They say the very rock groans, and strange, chitinous creatures are crawling out of the dark. We've dubbed it the 'Chasm of Woe'.",
            responses: [
                 { text: "So you need someone to go in and take a look?", next: 'dod_durin_task' }
            ]
        },
        dod_durin_task: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "Exactly. I need a brave soul to venture into that chasm, find the source of these tremors, and put a stop to it. There's a hefty reward in it for you, of course. My outpost's stability is worth more than a few coins.",
            responses: [
                { text: "I'll do it. Point me to the chasm.", actions: [{ type: 'start_quest', questId: 'depths_of_despair' }], next: 'dod_durin_accept' },
                { text: "Fighting wobbles isn't in my contract." }
            ]
        },
        dod_durin_accept: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "Good on ya! The entrance is through our outpost mine. Be careful down there. The lads weren't exaggerating about the creatures.",
            responses: []
        },
        dod_durin_return: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "You're back! And in one piece! Did you find the source?",
            responses: [
                {
                    text: "I did. I defeated a massive golem and brought back its core.",
                    check: {
                        requirements: [{ type: 'items', items: [{ itemId: 'heart_of_the_mountain', quantity: 1 }] }],
                        successNode: 'dod_durin_core_reveal',
                        failureNode: 'dod_durin_no_core'
                    }
                }
            ]
        },
        dod_durin_no_core: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "Did you now? Seems you forgot the most important part! A trophy! Proof! Without its core, I can't be sure the tremors won't return. Go back and get it!",
            responses: []
        },
        dod_durin_core_reveal: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "By my ancestors' anvil... The Heart of the Mountain! You defeated the Earth-Render? Incredible! This thing... it's pure terrestrial energy. I can feel it thrumming. With this, I could forge a masterpiece.",
            responses: [
                { text: "A masterpiece?", next: 'dod_durin_masterpiece' }
            ]
        },
        dod_durin_masterpiece: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "Aye! But to work with a core this powerful, I need a worthy vessel. A simple iron pickaxe would shatter. I need something strong, something... resonant. A Runic Pickaxe. Do you have one?",
            responses: [
                { text: "(Show him your Runic Pickaxe)", check: { requirements: [{ type: 'items', items: [{ itemId: 'runic_pickaxe', quantity: 1 }] }], successNode: 'dod_durin_upgrade', failureNode: 'dod_durin_no_pickaxe' } }
            ]
        },
        dod_durin_no_pickaxe: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "Hmph. As I thought. Can't forge a masterpiece on a rusty nail, lad. You'll need to smith a Runic Pickaxe yourself. It requires the finest materials. Come back when you have one.",
            responses: []
        },
        dod_durin_upgrade: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "Aye, that's the stuff! A fine pickaxe. Give me the Heart and your pick. I will fuse them. This will be my greatest work! ... It is done! Behold... the Crystal-Tipped Runic Pickaxe! It will bite through rock like a shark through a sardine!",
            responses: [
                { text: "It's magnificent!", next: 'dod_durin_complete' }
            ]
        },
        dod_durin_complete: {
            npcName: 'Durin',
            npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
            text: "It's a fitting reward for saving my outpost. Take it, hero. By the way, with the big one gone, the chasm should be more stable. I'd wager that crystal-filled alcove my scouts saw is accessible now. Should be some prime mining in there for a pickaxe like that.",
            responses: [
                { text: "Thank you, Durin.", actions: [{ type: 'take_item', itemId: 'heart_of_the_mountain', quantity: 1 }, { type: 'take_item', itemId: 'runic_pickaxe', quantity: 1 }, { type: 'give_item', itemId: 'crystal_tipped_runic_pickaxe', quantity: 1 }, { type: 'advance_quest', questId: 'depths_of_despair' }] }
            ]
        },
        dod_enter_chasm: {
            npcName: 'Enter the Chasm',
            npcIcon: 'https://api.iconify.design/game-icons:cave-entrance.svg',
            text: "A gust of cold, ancient air blows from the chasm. The tremors are stronger here. You can hear the skittering of unseen things in the darkness below.",
            responses: [
                { text: "(Descend)", actions: [{ type: 'advance_quest', questId: 'depths_of_despair' }, {type: 'teleport', poiId: 'chasm_ledge_1'}] }
            ]
        },
        dod_approach_golem: {
            npcName: 'Approach the Golem',
            npcIcon: 'https://api.iconify.design/game-icons:rock-golem.svg',
            text: "As you step into the cavern's heart, the tremors intensify. Dust rains from the ceiling. Before you, a colossal figure of stone and crystal begins to move. It was not a statue. It was sleeping. Its single, glowing eye fixes on you. The Earth-Render has awoken.",
            responses: [
                { text: "(Prepare for battle!)", actions: [{ type: 'advance_quest', questId: 'depths_of_despair' }, { type: 'start_mandatory_combat', monsterId: 'the_earth_render' }] }
            ]
        },
    }
};

