import { POI, SkillName } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants';

export const meadowdalePois: Record<string, POI> = {
    meadowdale_south_gate: {
        id: 'meadowdale_south_gate',
        name: 'Meadowdale South Gate',
        description: 'The southern gates of Meadowdale, opening up to the road south. A single guard keeps a lazy watch.',
        connections: ['meadowdale_north_gate', 'meadowdale_east_gate', 'meadowdale_west_gate', 'south_meadow_road', 'south_meadow_street'],
        activities: [],
        regionId: 'wilderness',
        x: 1000, y: 1050,
        cityMapX: 250, cityMapY: 475,
    },
    meadowdale_north_gate: {
        id: 'meadowdale_north_gate',
        name: 'Meadowdale North Gate',
        description: 'The northern gates of Meadowdale, leading towards the Whispering Woods.',
        connections: ['meadowdale_south_gate', 'meadowdale_east_gate', 'meadowdale_west_gate', 'whispering_woods', 'north_meadow_street'],
        activities: [],
        regionId: 'wilderness',
        x: 1000, y: 950,
        cityMapX: 250, cityMapY: 25,
    },
    meadowdale_east_gate: {
        id: 'meadowdale_east_gate',
        name: 'Meadowdale East Gate',
        description: 'The eastern gates of Meadowdale, facing the direction of the mines.',
        connections: ['meadowdale_south_gate', 'meadowdale_north_gate', 'meadowdale_west_gate', 'stonebreak_mine', 'east_meadow_street'],
        activities: [],
        regionId: 'wilderness',
        x: 1080, y: 1000,
        cityMapX: 475, cityMapY: 250,
    },
    meadowdale_west_gate: {
        id: 'meadowdale_west_gate',
        name: 'Meadowdale West Gate',
        description: 'The western gates of Meadowdale, opening up to the farmlands.',
        connections: ['meadowdale_north_gate', 'meadowdale_south_gate', 'meadowdale_east_gate', 'west_meadow_street', 'mcgregors_ranch'],
        activities: [],
        regionId: 'wilderness',
        x: 900, y: 1000,
        cityMapX: 25, cityMapY: 250,
    },
    // STREETS
    south_meadow_street: {
        id: 'south_meadow_street',
        name: 'South Meadow Street',
        description: "The main southern road inside Meadowdale. The cook's kitchen is just off the road here.",
        connections: ['meadowdale_south_gate', 'meadowdale_square', 'meadowdale_kitchen'],
        activities: [],
        regionId: 'meadowdale',
        x: 250, y: 350,
        type: 'internal',
    },
    north_meadow_street: {
        id: 'north_meadow_street',
        name: 'North Meadow Street',
        description: 'The main northern road inside Meadowdale, leading past the library and town hall.',
        connections: ['meadowdale_north_gate', 'meadowdale_square', 'meadowdale_library', 'town_hall'],
        activities: [],
        regionId: 'meadowdale',
        x: 250, y: 150,
        type: 'internal',
    },
    east_meadow_street: {
        id: 'east_meadow_street',
        name: 'East Meadow Street',
        description: 'The eastern road of Meadowdale, leading past the smithy and the local inn.',
        connections: ['meadowdale_east_gate', 'meadowdale_square', 'meadowdale_smithy', 'the_rusty_flagon'],
        activities: [],
        regionId: 'meadowdale',
        x: 350, y: 250,
        type: 'internal',
    },
    west_meadow_street: {
        id: 'west_meadow_street',
        name: 'West Meadow Street',
        description: 'The western road of Meadowdale, leading towards the town square.',
        connections: ['meadowdale_west_gate', 'meadowdale_square'],
        activities: [],
        regionId: 'meadowdale',
        x: 150, y: 250,
        type: 'internal',
    },
    meadowdale_square: {
        id: 'meadowdale_square',
        name: 'Meadowdale Square',
        description: 'The bustling heart of town. The central fountain gurgles pleasantly. Roads lead out towards the gates, and a grand building to the west houses the bank.',
        connections: ['north_meadow_street', 'east_meadow_street', 'south_meadow_street', 'west_meadow_street', 'meadowdale_bank'],
        activities: [
            { type: 'shop', shopId: 'general_store' },
            { type: 'water_source', name: 'Collect Water' },
            {
                type: 'npc',
                name: 'Old Man Fitzwilliam',
                icon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                dialogue: {
                    default_dialogue: {
                        npcName: 'Old Man Fitzwilliam',
                        npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                        text: "Hmph. Another adventurer, clogging up the square. Don't you have some dragons to slay or something?",
                        responses: [
                            { text: "You seem troubled. What's on your mind?", next: 'quest_intro_goblin_menace' },
                            { text: "Just passing through, old-timer." },
                        ]
                    },
                    quest_intro_goblin_menace: {
                        npcName: 'Old Man Fitzwilliam',
                        npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                        text: "Troubled? I'm beyond troubled! I'm incensed! It's this dreadful racket coming from the Stonebreak Mine. Day and night, clang, clang, bash! It's an affront to civilized ears! A man can't get a moment's peace!",
                        responses: [
                            { text: "What kind of racket?", next: 'situation_goblin_menace' },
                            { text: "Have you tried earplugs?", next: 'earplugs_response' },
                        ]
                    },
                    earplugs_response: {
                        npcName: 'Old Man Fitzwilliam',
                        npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                        text: "Earplugs?! Don't be absurd! It's the principle of the thing! I shouldn't have to plug my own ears in my own town square because of some subterranean hooligans! Now are you going to help or are you going to offer daft suggestions?",
                        responses: [
                            { text: "Alright, alright. Tell me about the racket.", next: 'situation_goblin_menace' }
                        ]
                    },
                    situation_goblin_menace: {
                        npcName: 'Old Man Fitzwilliam',
                        npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                        text: "It can only be one thing: goblins. They've infested the old mine again. They're probably banging rocks together and calling it music. It's scaring the birds, it's wilting my prize-winning petunias, and I haven't had a decent afternoon nap in a week!",
                        responses: [
                            { text: "Why don't the guards do something?", next: 'guards_response' },
                            { text: "What do you want me to do about it?", next: 'job_goblin_menace' },
                        ]
                    },
                    guards_response: {
                        npcName: 'Old Man Fitzwilliam',
                        npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                        text: "The guards! Hah! They're too busy... guarding! Polishing their helmets and watching the gates for threats that are already under our feet. 'Official jurisdiction,' they say. Bureaucratic nonsense! It falls to citizens of action, like you, to solve real problems.",
                        responses: [
                            { text: "I see. So what's the job?", next: 'job_goblin_menace' },
                        ]
                    },
                    job_goblin_menace: {
                        npcName: 'Old Man Fitzwilliam',
                        npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                        text: "The job is simple: pest control. Go in there and give them a taste of their own medicine! A little 'persuasion', if you will. Silence five of those noisy little brutes, and I'll make it worth your while. My sanity is a valuable thing, you know.",
                        responses: [
                            { text: "Alright, I'll restore the peace. For a price.", actions: [{ type: 'start_quest', questId: 'goblin_menace' }] },
                            { text: "Sounds dangerous. Not my problem." },
                        ]
                    },
                    in_progress_goblin_menace_0: {
                        npcName: 'Old Man Fitzwilliam',
                        npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                        text: "What are you waiting for? My ears are still ringing! Get over to that mine and sort out those noisy goblins!",
                        responses: []
                    },
                    in_progress_goblin_menace_1: {
                        npcName: 'Old Man Fitzwilliam',
                        npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                        text: "Ah, the sweet sound of... blessed silence! You've done it! My head feels clearer already. The birds are singing again! Here's your reward, well-earned.",
                        responses: [
                            { text: "Glad I could help.", actions: [{ type: 'advance_quest', questId: 'goblin_menace' }] }
                        ]
                    },
                    post_quest_goblin_menace: {
                        npcName: 'Old Man Fitzwilliam',
                        npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                        text: "Ah, adventurer! It's so peaceful now, I can finally hear myself think. Thank you again for taking care of that goblin nuisance.",
                        responses: []
                    }
                },
                startNode: 'default_dialogue'
            },
            {
                type: 'npc',
                name: 'Townsman',
                icon: '/assets/npcChatHeads/tavern_regular.png',
                dialogue: {
                    start: {
                        npcName: 'Townsman',
                        npcIcon: '/assets/npcChatHeads/tavern_regular.png',
                        text: CIVILLIAN_DIALOGUE.meadowdale.join('\n\n'),
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
                actions: [{ label: 'Pickpocket', disabled: true }]
            },
            {
                type: 'npc',
                name: 'Townswoman',
                icon: '/assets/npcChatHeads/elara.png',
                dialogue: {
                     start: {
                        npcName: 'Townswoman',
                        npcIcon: '/assets/npcChatHeads/elara.png',
                        text: CIVILLIAN_DIALOGUE.meadowdale.join('\n\n'),
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
                actions: [{ label: 'Pickpocket', disabled: true }]
            },
        ],
        regionId: 'meadowdale',
        x: 250, y: 250,
        type: 'internal',
    },
    // BUILDINGS
    meadowdale_smithy: {
        id: 'meadowdale_smithy',
        name: "Meadowdale Smithy",
        description: "The clang of a hammer on an anvil rings out. The air is hot from the roaring furnace.",
        connections: ['east_meadow_street'],
        activities: [
            { type: 'furnace' },
            { type: 'anvil' },
            {
                type: 'npc',
                name: 'Valerius the Master Smith',
                icon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                dialogue: {
                    default_dialogue: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "Welcome to my smithy. The forge is always hot, and the anvil is always ready. Can I help you with something?",
                        responses: [
                            { text: "I'm looking for work. Can I help you?", next: 'quest_intro_a_smiths_apprentice' },
                            { text: "Just looking around." },
                        ]
                    },
                    // --- A Smith's Apprentice ---
                    quest_intro_a_smiths_apprentice: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "Help? Hah! You've got the look of someone not afraid of a bit of hard work. This town was built on the sweat of good smiths, but the young folk these days... they'd rather read books in the library. I could use a hand, and you could learn a skill that'll save your life. Interested?",
                        responses: [
                            { text: "I'm always ready to learn. What do you need?", next: 'details_a_smiths_apprentice' },
                            { text: "Sorry, I've got books to read.", next: 'decline_smithing_quest' },
                        ],
                    },
                    decline_smithing_quest: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "Hmph. Another one. Go on then, bury your nose in dusty pages. See if a book will stop a goblin's blade. The forge is here if you change your mind.",
                        responses: []
                    },
                    details_a_smiths_apprentice: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "Every great sword starts as ugly rock. I need ore. The Stonebreak Mine is full of Copper and Tin. Bring me one of each. Do that, and I'll teach you the first, most important lesson of the forge: turning worthless stone into something strong.",
                        responses: [
                            { text: "I'll be back with your ore.", actions: [{ type: 'start_quest', questId: 'a_smiths_apprentice' }] },
                        ],
                    },
                    in_progress_a_smiths_apprentice_0: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "The forge doesn't wait forever, you know. That copper and tin isn't going to mine itself. Get to it.",
                        responses: []
                    },
                    in_progress_a_smiths_apprentice_1: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "Ah, good! Let's see... yes, this will do. Good quality. Now for your first lesson. You see, when you heat copper and tin together... you create bronze. Stronger than both. That's the heart of smithing: making things better than they were before. Here, take this bar I've smelted for you. Now, to the anvil! Turn that metal into a Bronze Dagger.",
                        responses: [
                            { text: "Thank you, I'll get to it.", actions: [{ type: 'advance_quest', questId: 'a_smiths_apprentice' }] }
                        ]
                    },
                    in_progress_a_smiths_apprentice_2: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "The anvil is for hammering, not for admiring! Get that hammer swinging and shape the metal. It's all about heat, pressure, and knowing when to strike.",
                        responses: []
                    },
                    in_progress_a_smiths_apprentice_3: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "Let me see... a bit rough around the edges, but the blade is true. Not bad at all for a first try! You've got the spark. With practice, you could be a great smith. Here's something for your trouble. Keep at it.",
                        responses: [
                            { text: "Thank you for the lesson!", actions: [{ type: 'advance_quest', questId: 'a_smiths_apprentice' }] }
                        ]
                    },
                    post_quest_a_smiths_apprentice: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "Good to see you again, apprentice. Remember what I taught you: heat, pressure, and a strong arm. That's all there is to it... mostly. How's the forge treating you?",
                        responses: []
                    },
                    // --- An Ancient Blade ---
                    item_trigger_ancient_blade: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "By the forge... where did you get that rusty sword? It's ancient, but the balance... the craftsmanship is remarkable. I could restore this blade, but I'll need some materials.",
                        responses: [
                            { text: "What do you need?", next: 'details_ancient_blade' }
                        ]
                    },
                    details_ancient_blade: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "The core is iron. I'll need 5 Iron Ores to reforge the blade and draw out its true strength. Bring them to me, and I'll see what I can do. It would be a crime to let a blade like this turn to dust.",
                        responses: [
                            { text: "I'll get the ore for you.", actions: [{ type: 'start_quest', questId: 'ancient_blade' }] }
                        ]
                    },
                    in_progress_ancient_blade_1: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "Have you gathered those 5 Iron Ores yet? That old sword is practically humming, waiting to be reborn.",
                        responses: []
                    },
                    in_progress_ancient_blade_2: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "Excellent! With this ore, I can restore the blade. Give me a moment... There! Good as new. A fine Iron Sword for your troubles. Take good care of it.",
                        responses: [
                            { text: "Thank you, Valerius!", actions: [{ type: 'advance_quest', questId: 'ancient_blade' }] }
                        ]
                    },
                    post_quest_ancient_blade: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "How's that old blade holding up? A fine piece of work, if I do say so myself.",
                        responses: []
                    }
                },
                startNode: 'default_dialogue',
            }
        ],
        regionId: 'meadowdale',
        x: 350, y: 200,
        type: 'internal',
    },
    meadowdale_kitchen: {
        id: 'meadowdale_kitchen',
        name: "Cook's Kitchen",
        description: "A cozy kitchen with a large cooking range. The smell of baked bread hangs in the air.",
        connections: ['south_meadow_street'],
        activities: [
            { type: 'cooking_range' },
        ],
        regionId: 'meadowdale',
        x: 200, y: 350,
        type: 'internal',
    },
    the_rusty_flagon: {
        id: 'the_rusty_flagon',
        name: "The Rusty Flagon Inn",
        description: "The air is thick with the smell of stale ale and sawdust. A few patrons murmur quietly in shadowy corners. A cheerful fire crackles in the hearth.",
        connections: ['east_meadow_street'],
        activities: [
            { type: 'quest_board' },
            {
                type: 'npc',
                name: 'Barkeep Grimley',
                icon: '/assets/npcChatHeads/barkeep_grimley.png',
                dialogue: {
                    start: {
                        npcName: 'Barkeep Grimley',
                        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                        text: "Welcome to The Rusty Flagon. What can I get for you?",
                        responses: [
                            { text: "Here for a drink!", next: 'buy_drink_intro' },
                            { text: "Looking for a room.", next: 'rent_room_intro' },
                        ]
                    },
                    buy_drink_intro: {
                        npcName: 'Barkeep Grimley',
                        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                        text: "You've got good taste! I import the best beer in the region, all the way from Silverhaven. None of that watered-down rubbish you get elsewhere. Fancy a pint? It's only 2 coins.",
                        responses: [
                            { text: "Yes please.", check: { requirements: [{ type: 'coins', amount: 2 }], successNode: 'buy_drink_success', failureNode: 'buy_drink_fail' }, actions: [{ type: 'take_coins', amount: 2 }, { type: 'give_item', itemId: 'beer', quantity: 1 }] },
                            { text: "No thanks, I'm not much of a drinker." },
                        ]
                    },
                    buy_drink_success: {
                        npcName: 'Barkeep Grimley',
                        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                        text: "Here you are. Enjoy!",
                        responses: []
                    },
                    buy_drink_fail: {
                        npcName: 'Barkeep Grimley',
                        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                        text: "Sorry, you don't have enough coins for that.",
                        responses: []
                    },
                    rent_room_intro: {
                        npcName: 'Barkeep Grimley',
                        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                        text: "A wise choice. A good night's rest can make all the difference. I keep this place nice and tidy, you know. Sometimes I even post odd jobs on the adventurer's board to keep it that way.",
                        responses: [
                            { text: "(Continue)", next: 'rent_room_confirm' },
                        ]
                    },
                    rent_room_confirm: {
                        npcName: 'Barkeep Grimley',
                        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                        text: "A room for the night will cost you 10 coins. It'll restore your health and make you feel right as rain. What do you say?",
                        responses: [
                            { text: "Yea, sure. I'll take a room.", check: { requirements: [{ type: 'coins', amount: 10 }], successNode: 'rent_room_success', failureNode: 'buy_drink_fail' }, actions: [{ type: 'take_coins', amount: 10 }, { type: 'heal', amount: 'full' }] },
                            { text: "Nah, I like sleeping on the streets." },
                        ]
                    },
                    rent_room_success: {
                        npcName: 'Barkeep Grimley',
                        npcIcon: '/assets/npcChatHeads/barkeep_grimley.png',
                        text: "Excellent choice. Sweet dreams!",
                        responses: []
                    }
                },
                startNode: 'start',
            },
            {
                type: 'npc',
                name: 'Tavern Regular',
                icon: '/assets/npcChatHeads/tavern_regular.png',
                dialogue: {
                    start: {
                        npcName: 'Tavern Regular',
                        npcIcon: '/assets/npcChatHeads/tavern_regular.png',
                        text: "Hear the goblins in the mines are getting bolder. They say their king is building a throne of junk and stolen goods.\n\nSome say the Whispering Woods got their name 'cause the trees themselves are alive... others say it's just the wind. I know what I believe.",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            }
        ],
        regionId: 'meadowdale',
        x: 350, y: 300,
        type: 'internal',
    },
    meadowdale_library: {
        id: 'meadowdale_library',
        name: "Meadowdale Library",
        description: "Rows of dusty tomes line the walls, their spines cracked with age. The only sound is the gentle rustle of turning pages. The air smells of old paper and leather.",
        connections: ['north_meadow_street'],
        activities: [
            {
                type: 'npc',
                name: 'Librarian Elara',
                icon: '/assets/npcChatHeads/librarian_elara.png',
                dialogue: {
                    start: {
                        npcName: 'Librarian Elara',
                        npcIcon: '/assets/npcChatHeads/librarian_elara.png',
                        text: "Shh! This is a place of learning, not a tavern.\n\nFeel free to browse, but do it quietly. The knowledge of ages rests on these shelves.\n\nThe town was founded on the ruins of an older settlement from before the Age of Kings. No one knows who built the original foundations.\n\nThe road south to Oakhaven used to be a major trade route. Now, with the bandits, it's a shadow of its former self.",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            },
            {
                type: 'npc',
                name: 'Wizard Elmsworth',
                icon: '/assets/npcChatHeads/wizard_elmsworth.png',
                dialogue: {
                    default_dialogue: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "Ah, hello there. Fascinating research to be done, fascinating!",
                        responses: []
                    },
                    quest_intro_magical_runestone_discovery: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "Ah, an adventurer! Perfect. You have the look of someone not easily startled. I've made a discovery of some significance, a magical one!",
                        responses: [
                            { text: "(Continue)", next: 'quest_intro_magical_runestone_discovery_b' }
                        ]
                    },
                    quest_intro_magical_runestone_discovery_b: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "I've been researching ancient teleportation magics and believe I've perfected a spell to transport someone to a location keyed to a specific magical resonance. I've found such a resonance, but I've yet to test it on a living being.",
                        responses: [
                            { text: "You want to teleport me somewhere?", next: 'details_magical_runestone_discovery' },
                            { text: "This sounds a bit complicated...", next: 'mrd_complicated_response' },
                            { text: "I'm not interested in being a test subject." },
                        ]
                    },
                    mrd_complicated_response: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "Not at all, my dear adventurer! The complex part is my research, which is already done. For you, it's quite simple: stand still, experience a brief moment of magical translocation, and then explore a new, undiscovered location! Shall we proceed?",
                        responses: [
                            { text: "Alright, tell me more.", next: 'details_magical_runestone_discovery' },
                            { text: "No, I'd rather not." },
                        ]
                    },
                    details_magical_runestone_discovery: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "Precisely! It should be perfectly safe. Mostly. The resonance points to a location deep within the mountains. If you'd be willing, I could send you there to investigate. Who knows what you might find!",
                        responses: [
                            { text: "Alright, I'll do it. For the sake of science!", actions: [{ type: 'start_quest', questId: 'magical_runestone_discovery' }], next: 'in_progress_magical_runestone_discovery_0' },
                            { text: "I'm still not convinced this is a good idea.", next: 'mrd_decline_final' },
                            { text: "'Mostly' safe isn't good enough for me." },
                        ]
                    },
                    mrd_decline_final: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "A pity! The pursuit of knowledge requires a certain... boldness. Perhaps another time, then. Do let me know if you change your mind.",
                        responses: []
                    },
                    in_progress_magical_runestone_discovery_0: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "Excellent! Before I can teleport you, I must first perform an attunement spell to unlock the destination. Shall I proceed?",
                        responses: [
                            { text: "Yes, perform the attunement.", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery' }], next: 'in_progress_magical_runestone_discovery_1' },
                            { text: "Not just yet." },
                        ]
                    },
                    in_progress_magical_runestone_discovery_1: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "The attunement is complete! You will find a temporary projection of myself there. I don't know how long I can keep it active, so you best hurry along. Now for the teleport. Hold still... *Materia Translocatus!*",
                        responses: [
                            { text: "(You feel a strange pulling sensation...)", actions: [{ type: 'teleport', poiId: 'rune_essence_mine' }] },
                        ]
                    },
                    in_progress_magical_runestone_discovery_3: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
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
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "You've made a good start, but I need a full five samples to calibrate my instruments properly. Bring me the rest when you have them.",
                        responses: [
                            { text: "(Continue)", next: 'offer_teleport_back' }
                        ]
                    },
                    mrd_has_no_essence: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "You've returned empty-handed? Tsk, tsk. The discovery awaits! You must return to the mine and gather those samples.",
                        responses: [
                            { text: "(Continue)", next: 'offer_teleport_back' }
                        ]
                    },
                    offer_teleport_back: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "No sense in walking all that way. I can send you straight back to the cavern if you're ready. Shall I?",
                        responses: [
                            { text: "Yes, please send me back.", actions: [{ type: 'teleport', poiId: 'rune_essence_mine' }] },
                            { text: "No thanks, I'll walk." },
                        ]
                    },
                    mrd_complete_stage_2: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "You have them! Wonderful! Now... what in the blazes? My trinket! The one I keep in my pocket for good luck... it's vibrating like a bee in a jam jar now that you're near with those rocks!",
                        responses: [
                            { text: "(Continue)", next: 'mrd_complete_stage_2_b' }
                        ]
                    },
                    mrd_complete_stage_2_b: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "It's a peculiar thing I found on my travels. It always seemed to pull faintly to the north, but I could never investigate. Since you're a seasoned adventurer, perhaps you can find where it leads!",
                        responses: [
                            { text: "(Continue)", next: 'mrd_complete_stage_2_c' }
                        ]
                    },
                    mrd_complete_stage_2_c: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "Here, take the trinket. And keep the rock chunks, they seem to be the key! Find what this trinket is pulling towards, and report back to me immediately!",
                        responses: [
                            { text: "I'll see what I can find.", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery'}, {type: 'give_item', itemId: 'gust_talisman', quantity: 1 }] }
                        ]
                    },
                    in_progress_magical_runestone_discovery_4: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "Any luck finding the source of that trinket's pull? It seemed to be attracted north of the Whispering Woods.",
                        responses: []
                    },
                    in_progress_magical_runestone_discovery_5: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "You're back! Did you find where the trinket was leading you?",
                        responses: [
                            { text: "Yes, it led me to an ancient altar in the lower mountains.", next: 'mrd_5_b' }
                        ]
                    },
                    mrd_5_b: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "An altar! Of course! The resonance... the energy... it all makes sense! I believe the trinket and the stones are meant to be used together *at* the altar. You must go back and place them upon it!",
                        responses: [
                            { text: "Alright, I'll go back and try it.", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery' }] }
                        ]
                    },
                    in_progress_magical_runestone_discovery_6: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "Don't delay! We could be on the verge of a monumental discovery! Take the trinket and the essence back to that altar!",
                        responses: []
                    },
                    in_progress_magical_runestone_discovery_7: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "You have them! Actual runes! And you made them yourself! By my beard, you've done it! You've rediscovered the lost art of Runecrafting!",
                        responses: [
                            { text: "(Continue)", next: 'mrd_7_b' }
                        ]
                    },
                    mrd_7_b: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "The trinket must be a Talisman, and these stones... this 'Rune Essence'... they are the key! This changes everything! The study of magic will be advanced by centuries.",
                        responses: [
                             { text: "(Continue)", next: 'mrd_7_c' }
                        ]
                    },
                    mrd_7_c: {
                         npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "Thank you, adventurer. Please, take this for your invaluable contribution to science! I have another talisman you might find useful.",
                        responses: [
                             { text: "It was a pleasure.", actions: [{ type: 'advance_quest', questId: 'magical_runestone_discovery' }] }
                        ]
                    },
                    post_quest_magical_runestone_discovery: {
                        npcName: 'Wizard Elmsworth',
                        npcIcon: '/assets/npcChatHeads/wizard_elmsworth.png',
                        text: "Ah, my star pupil! How goes the runecrafting? Made any new discoveries of your own?",
                        responses: []
                    },
                },
                startNode: 'default_dialogue',
            }
        ],
        regionId: 'meadowdale',
        x: 200, y: 150,
        type: 'internal',
    },
    town_hall: {
        id: 'town_hall',
        name: "Town Hall",
        description: "A sturdy, official-looking building. Desks are piled high with scrolls and ledgers. A stern-looking clerk eyes you from behind a tall counter.",
        connections: ['north_meadow_street'],
        activities: [
            {
                type: 'npc',
                name: 'Clerk Augustus',
                icon: '/assets/npcChatHeads/clerk_augustus.png',
                dialogue: {
                    default_dialogue: {
                        npcName: 'Clerk Augustus',
                        npcIcon: '/assets/npcChatHeads/clerk_augustus.png',
                        text: "State your business. We have important matters to attend to here in Meadowdale. Please, no loitering.",
                        responses: [
                            { text: "I'm an adventurer. Do you have any work for me?", next: 'quest_intro_bandit_toll' },
                            { text: "I understand. I'll be on my way." },
                        ]
                    },
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
                },
                startNode: 'default_dialogue',
            }
        ],
        regionId: 'meadowdale',
        x: 300, y: 150,
        type: 'internal',
    },
    meadowdale_bank: {
        id: 'meadowdale_bank',
        name: 'Bank of Embrune',
        description: 'A grand building with polished counters and secure vaults, accessed from the town square. A stern-looking banker watches over the main hall.',
        connections: ['meadowdale_square'],
        activities: [
            { type: 'bank' },
            {
                type: 'npc',
                name: 'Banker Theron',
                icon: '/assets/npcChatHeads/banker_theron.png',
                dialogue: {
                    start: {
                        npcName: 'Banker Theron',
                        npcIcon: '/assets/npcChatHeads/banker_theron.png',
                        text: "Welcome to the Bank of Embrune. Your items are safe with us.",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'meadowdale',
        x: 200, y: 200,
        type: 'internal',
    },
};
