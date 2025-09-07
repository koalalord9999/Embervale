
import { POI, SkillName } from '../../types';

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
            { type: 'water_source', name: 'Fill Vials at Fountain' },
            {
                type: 'npc',
                name: 'Old Man Fitzwilliam',
                icon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                dialogue: ["Hmph. Another adventurer. Don't go stirring up trouble, now."]
            },
            { type: 'quest_start', questId: 'goblin_menace'}
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
                dialogue: [
                    "Welcome to my smithy. The forge is always hot, and the anvil is always ready.",
                    "Bring me good metal, and I can make you something worthy of a true warrior."
                ]
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
                dialogue: [
                    "What'll it be, adventurer? Or are you just here to track mud on me clean floors?",
                    "We've got rooms to let, if you're weary from your travels."
                ]
            },
            {
                type: 'npc',
                name: 'Tavern Regular',
                icon: '/assets/npcChatHeads/tavern_regular.png',
                dialogue: [
                    "Hear the goblins in the mines are getting bolder. They say their king is building a throne of junk and stolen goods.",
                    "Some say the Whispering Woods got their name 'cause the trees themselves are alive... others say it's just the wind. I know what I believe."
                ]
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
                dialogue: [
                    "Shh! This is a place of learning, not a tavern.",
                    "Feel free to browse, but do it quietly. The knowledge of ages rests on these shelves.",
                    "This town was founded on the ruins of an older settlement from before the Age of Kings. No one knows who built the original foundations.",
                    "The road south to Oakhaven used to be a major trade route. Now, with the bandits, it's a shadow of its former self."
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
                dialogue: [
                    "State your business. We have important matters to attend to here in Meadowdale.",
                    "No loitering, please."
                ]
            },
            { type: 'quest_start', questId: 'bandit_toll' }
        ],
        regionId: 'meadowdale',
        x: 300, y: 150,
        type: 'internal',
    },
    meadowdale_bank: {
        id: 'meadowdale_bank',
        name: 'Bank of Embervale',
        description: 'A grand building with polished counters and secure vaults, accessed from the town square. A stern-looking banker watches over the main hall.',
        connections: ['meadowdale_square'],
        activities: [
            { type: 'bank' },
            {
                type: 'npc',
                name: 'Banker Theron',
                icon: '/assets/npcChatHeads/banker_theron.png',
                dialogue: ["Welcome to the Bank of Embervale. Your items are safe with us."]
            }
        ],
        regionId: 'meadowdale',
        x: 200, y: 200,
        type: 'internal',
    },
};