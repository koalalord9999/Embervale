
import { POI, SkillName } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';

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
        activities: [
            { type: 'npc', name: 'Man', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Man', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man' },
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
            { type: 'npc', name: 'Woman', icon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', dialogue: { start: { npcName: 'Woman', npcIcon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'woman' },
        ],
        regionId: 'meadowdale',
        x: 250, y: 150,
        type: 'internal',
    },
    east_meadow_street: {
        id: 'east_meadow_street',
        name: 'East Meadow Street',
        description: 'The eastern road of Meadowdale, leading past the smithy and the local inn.',
        connections: ['meadowdale_east_gate', 'meadowdale_square', 'meadowdale_smithy', 'the_rusty_flagon'],
        activities: [
            { type: 'npc', name: 'Man', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Man', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man' },
        ],
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
            },
            { type: 'npc', name: 'Man', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Man', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man' },
            { type: 'npc', name: 'Woman', icon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', dialogue: { start: { npcName: 'Woman', npcIcon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'woman' },
            { type: 'npc', name: 'Use Blight Ward Potion', icon: 'https://api.iconify.design/game-icons:sprout.svg', questCondition: { questId: 'petunia_problems', stages: [3] } },
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
                toPoiId: 'tavern_cellar'
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
            }
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
            {
                type: 'npc',
                name: 'Wizard Elmsworth',
                icon: 'https://api.iconify.design/game-icons:wizard-face.svg',
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
        ],
        regionId: 'meadowdale',
        x: 203, y: 106,
        type: 'internal',
    },
};
