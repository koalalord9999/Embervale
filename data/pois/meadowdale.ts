
import { POI, SkillName } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';

export const meadowdalePois: Record<string, POI> = {
    meadowdale_south_gate: {
        id: 'meadowdale_south_gate',
        name: 'Meadowdale South Gate',
        description: 'The southern gates of Meadowdale, opening up to the road south. A single guard keeps a lazy watch.',
        connections: ['south_meadow_road', 'south_meadow_street'],
        activities: [
            { type: 'npc', name: 'Guard', icon: 'https://api.iconify.design/game-icons:guard.svg', pickpocket: { lootTableId: 'pickpocket_guard_table' }, attackableMonsterId: 'guard', dialogue: { start: { npcName: 'Guard', npcIcon: 'https://api.iconify.design/game-icons:guard.svg', text: "Just keeping an eye on things. Move along.", responses: [] } }, startNode: 'start' }
        ],
        regionId: 'meadowdale',
        type: 'internal',
        x: 250, y: 500,
        eX: 1000, eY: 1000,
    },
    meadowdale_north_gate: {
        id: 'meadowdale_north_gate',
        name: 'Meadowdale North Gate',
        description: 'The northern gates of Meadowdale, leading towards the Whispering Woods.',
        connections: ['whispering_woods', 'north_meadow_street'],
        activities: [],
        regionId: 'meadowdale',
        type: 'internal',
        x: 250, y: 0,
        eX: 1000, eY: 1000,
    },
    meadowdale_east_gate: {
        id: 'meadowdale_east_gate',
        name: 'Meadowdale East Gate',
        description: 'The eastern gates of Meadowdale, facing the direction of the mines.',
        connections: ['stonebreak_mine', 'east_meadow_street'],
        activities: [],
        regionId: 'meadowdale',
        type: 'internal',
        x: 500, y: 250,
        eX: 1000, eY: 1000,
    },
    meadowdale_west_gate: {
        id: 'meadowdale_west_gate',
        name: 'Meadowdale West Gate',
        description: 'The western gates of Meadowdale, opening up to the farmlands.',
        connections: ['west_meadow_street', 'mcgregors_ranch'],
        activities: [],
        regionId: 'meadowdale',
        type: 'internal',
        x: 0, y: 250,
        eX: 1000, eY: 1000,
    },
    // STREETS
    south_meadow_street: {
        id: 'south_meadow_street',
        name: 'South Meadow Street',
        description: "The main southern road inside Meadowdale. The cook's kitchen is just off the road here.",
        connections: ['meadowdale_south_gate', 'meadowdale_square', 'meadowdale_kitchen'],
        activities: [
            { type: 'npc', name: 'Man', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Man', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man', pickpocket: { lootTableId: 'pickpocket_man_woman_table' } },
        ],
        regionId: 'meadowdale',
        x: 250, y: 350,
        type: 'internal',
    },
    north_meadow_street: {
        id: 'north_meadow_street',
        name: 'North Meadow Street',
        description: 'The main northern road inside Meadowdale, leading past the library, a small magic shop, and the town hall.',
        connections: ['meadowdale_north_gate', 'meadowdale_square', 'meadowdale_library', 'town_hall', 'meadowdale_magic_shop'],
        activities: [
            { type: 'npc', name: 'Woman', icon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', dialogue: { start: { npcName: 'Woman', npcIcon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'woman', pickpocket: { lootTableId: 'pickpocket_man_woman_table' } },
        ],
        regionId: 'meadowdale',
        x: 250, y: 150,
        type: 'internal',
    },
    east_meadow_street: {
        id: 'east_meadow_street',
        name: 'East Meadow Street',
        description: 'The eastern road of Meadowdale, leading past the smithy and the local inn. A small alley leads to a rooftop access point.',
        connections: ['meadowdale_east_gate', 'meadowdale_square', 'meadowdale_smithy', 'the_rusty_flagon', 'meadowdale_rooftop_access'],
        activities: [
            { type: 'npc', name: 'Man', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Man', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man', pickpocket: { lootTableId: 'pickpocket_man_woman_table' } },
        ],
        regionId: 'meadowdale',
        x: 350, y: 250,
        type: 'internal',
    },
    west_meadow_street: {
        id: 'west_meadow_street',
        name: 'West Meadow Street',
        description: 'The western road of Meadowdale. A quiet residential street with a small fishing shop.',
        connections: ['meadowdale_west_gate', 'meadowdale_square', 'meadowdale_fishing_shop'],
        activities: [
            { type: 'thieving_pilfer', id: 'meadowdale_house_1', name: 'Locked House' },
            { type: 'thieving_pilfer', id: 'meadowdale_house_2', name: 'Locked House' },
            { type: 'thieving_pilfer', id: 'meadowdale_house_3', name: 'Locked House' },
            { type: 'ground_item', id: 'west_meadow_bobby_pin', itemId: 'bobby_pin', resourceCount: 1, respawnTimer: 300000 },
            { type: 'ground_item', id: 'west_meadow_empty_jug', itemId: 'empty_jug', resourceCount: 1, respawnTimer: 120000 },
        ],
        regionId: 'meadowdale',
        x: 150, y: 250,
        type: 'internal',
    },
    meadowdale_square: {
        id: 'meadowdale_square',
        name: 'Meadowdale Square',
        description: 'The bustling heart of town. The central fountain gurgles pleasantly. Roads lead out towards the gates, and a grand building to the west houses the bank.',
        connections: ['north_meadow_street', 'east_meadow_street', 'south_meadow_street', 'west_meadow_street', 'meadowdale_bank', 'meadowdale_chapel'],
        activities: [
            { type: 'thieving_stall', id: 'meadowdale_square_bakery_stall', name: 'Steal from Bakery Stall', lootTableId: 'thieving_stall_bakery' },
            { type: 'shop', shopId: 'general_store' },
            { type: 'water_source', name: 'Collect Water' },
            {
                type: 'npc',
                name: 'Old Man Fitzwilliam',
                icon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                startNode: 'fitzwilliam_default',
                questTopics: ['goblin_menace', 'petunia_problems'],
                conditionalGreetings: [
                   { text: "*You see Old Man Fitzwilliam mumbling to himself about curses* What do you want now? Can't you see I'm having a rough time?", check: { requirements: [{ type: 'quest', questId: 'petunia_problems', status: 'not_started' }, { type: 'quest', questId: 'goblin_menace', status: 'completed'}] } }
                ],
                dialogue: {
                    fitzwilliam_default: {
                        npcName: 'Old Man Fitzwilliam',
                        npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                        text: "Hmph. What do you want? Can't you see I'm busy being miserable?",
                        responses: [],
                    }
                }
            },
            { type: 'npc', name: 'Man', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Man', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man', pickpocket: { lootTableId: 'pickpocket_man_woman_table' } },
            { type: 'npc', name: 'Woman', icon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', dialogue: { start: { npcName: 'Woman', npcIcon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'woman', pickpocket: { lootTableId: 'pickpocket_man_woman_table' } },
            { type: 'npc', name: 'Use Blight Ward Potion', icon: 'https://api.iconify.design/game-icons:sprout.svg', questCondition: { questId: 'petunia_problems', stages: [3] }, startNode: 'petunia_use_potion' },
            { type: 'ground_item', id: 'meadowdale_square_coins', itemId: 'coins', resourceCount: 1, respawnTimer: 60000 },
        ],
        regionId: 'meadowdale',
        x: 250, y: 250,
        type: 'internal',
    },
    meadowdale_chapel: {
        id: 'meadowdale_chapel',
        name: 'Meadowdale Chapel',
        description: 'A small but well-maintained place of worship. It is quiet and peaceful here.',
        connections: ['meadowdale_square'],
        activities: [
            {
                type: 'npc',
                name: 'Altar',
                icon: 'https://api.iconify.design/game-icons:altar.svg',
                dialogue: {
                    start: {
                        npcName: 'Altar',
                        npcIcon: 'https://api.iconify.design/game-icons:altar.svg',
                        text: 'You feel a divine presence. Your prayer may be answered here.',
                        responses: [
                            { text: 'Pray', actions: [{ type: 'restore_prayer' }] },
                            { text: 'Leave' }
                        ]
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'meadowdale',
        x: 300, y: 300,
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
                startNode: 'valerius_default',
                questTopics: ['a_smiths_apprentice', 'ancient_blade', 'an_echo_of_battle', 'art_of_the_warhammer'],
                conditionalGreetings: [
                    // AN ECHO OF BATTLE (Highest Priority)
                    { text: "Have you brought the Glimmerhorn Dust for the key?", check: { requirements: [{ type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 4 }] } },
                    { text: "Hello there apprentice, how's your training been?", check: { requirements: [{ type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 2 }, { type: 'items', items: [{ itemId: 'broken_barrow_key', quantity: 1 }] }] } },
                    { text: "Thank you for your help with reforging the key for Bronn. It was a masterwork of old.", check: { requirements: [{ type: 'quest', questId: 'an_echo_of_battle', status: 'completed' }] } },
                    
                    // ART OF THE WARHAMMER
                    { text: "You should probably return to Bronn, now that you've crafted the hammer.", check: { requirements: [{ type: 'quest', questId: 'art_of_the_warhammer', status: 'in_progress', stage: 2 }] } },
                    { text: "Hello adventurer... you look familiar? Bah! it matters not, how can the forge be of assistance?", check: { requirements: [{ type: 'quest', questId: 'art_of_the_warhammer', status: 'in_progress', stage: 0 }] } },
                    { text: "How's that hammer holding up? A fine piece of work, if I do say so myself.", check: { requirements: [{ type: 'quest', questId: 'art_of_the_warhammer', status: 'completed' }] } },

                    // A SMITH'S APPRENTICE
                    { text: "Finished with the dagger? Let's have a look at your work.", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 3 }, { type: 'items', items: [{ itemId: 'bronze_dagger', quantity: 1 }] }] } },
                    { text: "Ah, you have the ore? Good. Let's begin your first lesson.", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'in_progress', stage: 1 }] } },
                    { text: "Good to see you again, apprentice. Keep practicing at the anvil.", check: { requirements: [{ type: 'quest', questId: 'a_smiths_apprentice', status: 'completed' }] } },
                    
                    // ANCIENT BLADE (Lowest Priority)
                    { text: "Ah, you're back. What do you need?", check: { requirements: [{ type: 'quest', questId: 'ancient_blade', status: 'in_progress', stage: 0 }] } },
                    { text: "*Valerius is hammering away as you approach* Welcome to the forge adventurer, I'm a little busy right now... Is it something urgent?", check: { requirements: [{ type: 'quest', questId: 'ancient_blade', status: 'not_started' }, { type: 'items', items: [{ itemId: 'rusty_iron_sword', quantity: 1 }] }] } },
                    { text: "That old blade I restored for you... it was a fine piece of history.", check: { requirements: [{ type: 'quest', questId: 'ancient_blade', status: 'completed' }] } },
                ],
                dialogue: {
                    valerius_default: {
                        npcName: 'Valerius the Master Smith',
                        npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                        text: "Welcome to the forge. If you need something smithed, you've come to the right place. Just don't waste my time.",
                        responses: [],
                    }
                }
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
                type: 'ladder', 
                name: 'Go to Cellar', 
                direction: 'down', 
                toPoiId: 'tavern_cellar',
                questCondition: { questId: 'kill_rats_meadowdale', stages: [] }
            },
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
                icon: 'https://api.iconify.design/game-icons:person.svg',
                pickpocket: { lootTableId: 'pickpocket_tavern_regular' },
                dialogue: {
                    start: {
                        npcName: 'Tavern Regular',
                        npcIcon: 'https://api.iconify.design/game-icons:person.svg',
                        text: "Hear the goblins in the mines are getting bolder. They say their king is building a throne of junk and stolen goods.\n\nSome say the Whispering Woods got their name 'cause the trees themselves are alive... others say it's just the wind. I know what I believe.",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            },
            {
                type: 'npc',
                name: 'Warrior',
                icon: 'https://api.iconify.design/game-icons:swordman.svg',
                pickpocket: { lootTableId: 'pickpocket_warrior_table' },
                attackableMonsterId: 'warrior',
                dialogue: {
                    start: {
                        npcName: 'Warrior',
                        npcIcon: 'https://api.iconify.design/game-icons:swordman.svg',
                        text: "Looking for a fight? You've come to the right place. Or the wrong one, depending on how you look at it.",
                        responses: []
                    }
                },
                startNode: 'start',
            },
            { type: 'ground_item', id: 'rusty_flagon_burnt_food', itemId: 'burnt_food', resourceCount: 1, respawnTimer: 300000 },
        ],
        regionId: 'meadowdale',
        x: 350, y: 300,
        type: 'internal',
    },
    tavern_cellar: {
        id: 'tavern_cellar',
        name: 'Tavern Cellar',
        description: 'A damp, musty cellar filled with barrels and crates. It smells of spilt ale and rat droppings.',
        connections: ['the_rusty_flagon'],
        activities: [
            { type: 'ladder', name: 'Climb Up', direction: 'up', toPoiId: 'the_rusty_flagon' }
        ],
        regionId: 'meadowdale',
        x: 350, y: 320,
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
            /*
                dialogueEntryPoints: [
not_started "You seem excited. What are you researching?", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'not_started' }], successNode: 'quest_intro_magical_runestone_discovery', failureNode: '' } } },
0 "I'm ready for that teleport.", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 0 }], successNode: 'mrd_teleport_dialogue', failureNode: '' } } },
3 "I've returned from the essence mine.", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 3 }], successNode: 'mrd_library_stage_3', failureNode: '' } } },
5 "I found where the talisman was leading.", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 5 }], successNode: 'mrd_library_stage_5', failureNode: '' } } },
7 "I've crafted the runes!", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 7 }], successNode: 'mrd_library_stage_7', failureNode: '' } } },
completed "How goes the Runecrafting research?", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'completed' }], successNode: 'post_quest_magical_runestone_discovery', failureNode: '' } } }
    ],
            */
            {
                type: 'npc',
                name: 'Wizard Elmsworth',
                icon: 'https://api.iconify.design/game-icons:wizard-face.svg',
                startNode: 'elmsworth_default',
                questTopics: ['magical_runestone_discovery'],
                conditionalGreetings: [
                    { text: "*whisper* Oh! Simply magnificent, the power being called by this spell is simply serendipitous... If only someone was here to help...*whisper* Oh hello there adventurer, might you be interested in helping me with something? It's got me all giddy and excited, but I cannot do it by myself.", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'not_started' }] } },
                    { text: "Still here? Did my teleport fail? Well, anyway, are you ready to try again?", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 0 }] } },
                    { text: "You need to speak with my projection at the teleport location, please return there at once!", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 1 }] } },
                    { text: "Come now, you still have to gather those samples, I know its busy work, but its a very important step of finding out what is causing these readings!", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 2 }] } },
                    { text: "You've returned! Have you brought the samples with you?", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 3 }] } },
                    { text: "Have you found the source of the pull? You can hold it up in front of you with the \"Divine\" feature.", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 4 }] } },
                    { text: "You've returned! I assume you found the source of the pull? Tell me, what was it?", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 5 }] } },
                    { text: "Have you combined my trinket with those rock chunks yet? Time spent dillydallying could be spent being productive, get a move on!", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 6 }] } },
                    { text: "I felt a hum of magic come from the north, did you combine them?", check: { requirements: [{ type: 'quest', questId: 'magical_runestone_discovery', status: 'in_progress', stage: 7 }] } },

                ]
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
                startNode: 'augustus_default',
                questTopics: ['bandit_toll'],
                dialogue: {
                    augustus_default: {
                        npcName: 'Clerk Augustus',
                        npcIcon: '/assets/npcChatHeads/clerk_augustus.png',
                        text: "Welcome to the Meadowdale Town Hall. State your business.",
                        responses: []
                    }
                }
            },
            { type: 'ground_item', id: 'town_hall_cloth', itemId: 'tattered_cloth', resourceCount: 1, respawnTimer: 300000 },
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
            {
                type: 'npc',
                name: 'Banker Theron',
                icon: '/assets/npcChatHeads/banker_theron.png',
                actions: [
                    { label: 'Bank', action: 'open_bank' },
                    { label: 'Deposit Backpack', action: 'deposit_backpack' },
                    { label: 'Deposit Equipment', action: 'deposit_equipment' },
                ],
                dialogue: {
                    start: {
                        npcName: 'Banker Theron',
                        npcIcon: '/assets/npcChatHeads/banker_theron.png',
                        text: "Welcome to the Bank of Embrune. Your items are safe with us.",
                        responses: [
                            { text: "I'd like to access my bank.", next: 'access_bank' },
                            { text: "Just looking around, thank you." }
                        ]
                    },
                    access_bank: {
                        npcName: 'Banker Theron',
                        npcIcon: '/assets/npcChatHeads/banker_theron.png',
                        text: "Of course. Here you can deposit or withdraw items from your personal vault. Would you like to access it now?",
                        responses: [
                            { text: "Yes, please.", actions: [{ type: 'open_bank' }] },
                            { text: "Not right now." }
                        ]
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'meadowdale',
        x: 200, y: 200,
        type: 'internal',
    },
    meadowdale_magic_shop: {
        id: 'meadowdale_magic_shop',
        name: "Elmsworth's Embryo Magicks",
        description: "A small shop tucked away near the library, smelling faintly of old parchment and ozone. It offers basic supplies for aspiring mages.",
        connections: ['north_meadow_street'],
        activities: [
            { type: 'shop', shopId: 'meadowdale_magic' },
            { type: 'ground_item', id: 'magic_shop_gust', itemId: 'gust_rune', resourceCount: 5, respawnTimer: 60000 },
            { type: 'ground_item', id: 'magic_shop_binding', itemId: 'binding_rune', resourceCount: 5, respawnTimer: 60000 },
        ],
        regionId: 'meadowdale',
        x: 203, y: 106,
        type: 'internal',
    },
    meadowdale_fishing_shop: {
        id: 'meadowdale_fishing_shop',
        name: "Angler's Repose",
        description: "A quaint fishing shop with a fishing sign. It smells of worms, and other fishing supplies.",
        connections: ['west_meadow_street'],
        activities: [
            { type: 'shop', shopId: 'meadowdale_fishing'},
        ],
        regionId: 'meadowdale',
        x: 150, y: 275,
        type: 'internal',
    }
};