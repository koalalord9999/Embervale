import { POI } from '../../types';
// FIX: Imported CIVILLIAN_DIALOGUE to be used in data transformation.
import { CIVILLIAN_DIALOGUE } from '../../constants';

export const oakhavenPois: Record<string, POI> = {
    // GATES (World Map POIs)
    oakhaven_north_gate: {
        id: 'oakhaven_north_gate',
        name: 'Oakhaven North Gate',
        description: 'Sturdy wooden gates mark the entrance to the town of Oakhaven. The scent of sawdust and tanning leather hangs in the air.',
        connections: ['oakhaven_road_2', 'oakhaven_square'],
        activities: [],
        regionId: 'wilderness',
        x: 1000, y: 1750,
        cityMapX: 250, cityMapY: 100,
        unlockRequirement: { type: 'quest', questId: 'bandit_toll', stage: 1 }
    },
    oakhaven_west_gate: {
        id: 'oakhaven_west_gate',
        name: 'Oakhaven West Gate',
        description: 'This gate leads out to the old King\'s Road, a once-major trade artery that has fallen into disuse. A guard eyes the road warily.',
        connections: ['oakhaven_crafting_district', 'kings_road_west_1'],
        activities: [
            {
                type: 'npc',
                name: 'Guard Captain Elara',
                icon: '/assets/npcChatHeads/guard_captain_elara.png',
                dialogue: {
                    default_dialogue: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Keep your wits about you. The roads aren't as safe as they once were.",
                        responses: [
                            { text: "What's the trouble on the King's Road?", next: 'quest_intro_capitals_call'},
                            { text: "I'll be careful.", action: 'close' },
                        ]
                    },
                    quest_intro_capitals_call: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Trouble? The main bridge to the west has collapsed. It's completely cut off our main route to the capital, Silverhaven. We're trying to repair it, but we're short on supplies.",
                        responses: [
                            { text: "How can I help?", next: 'details_capitals_call'},
                        ]
                    },
                    details_capitals_call: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "We need sturdy lumber and strong rope for the repairs. If you can bring me 20 logs and 5 pieces of rope, my engineers can get to work. It would be a great service to Oakhaven.",
                        responses: [
                            { text: "I'll gather the supplies for you.", action: 'accept_quest', questId: 'capitals_call'},
                            { text: "I don't have time for construction work.", action: 'close' },
                        ]
                    },
                    in_progress_capitals_call_0: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Any luck with those logs and ropes? The sooner that bridge is fixed, the better.",
                        responses: []
                    },
                    complete_stage_capitals_call_1: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "You've got them! Excellent work. This is exactly what we need. I'll get my engineers on the repairs right away. Thank you, adventurer. You have the gratitude of Oakhaven.",
                        responses: [
                            { text: "Glad to be of service.", action: 'complete_stage', questId: 'capitals_call'},
                        ]
                    },
                    post_quest_capitals_call: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Thanks to your help, the bridge is secure and the road to Silverhaven is open once more. Safe travels.",
                        responses: []
                    },
                },
                startNode: 'default_dialogue'
            },
        ],
        regionId: 'wilderness',
        x: 950, y: 1800,
        cityMapX: 100, cityMapY: 160,
    },

    // CITY CENTER (Internal POI)
    oakhaven_square: {
        id: 'oakhaven_square',
        name: 'Oakhaven Square',
        description: 'The center of the crafting town. A serene-looking wishing well sits in the middle of the square. Roads lead to the gates and various districts.',
        connections: ['oakhaven_north_gate', 'oakhaven_market', 'oakhaven_crafting_district', 'oakhaven_tavern_street', 'oakhaven_bank'],
        activities: [
            { type: 'wishing_well' },
            { type: 'water_source', name: 'Collect Water' },
            {
                type: 'npc',
                name: 'Craftsman',
                icon: '/assets/npcChatHeads/artisan.png',
                // FIX: Replaced dialogueKey with DialogueNode structure using CIVILLIAN_DIALOGUE.
                dialogue: {
                    start: {
                        npcName: 'Craftsman',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: CIVILLIAN_DIALOGUE.oakhaven.join('\n\n'),
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
                actions: [{ label: 'Pickpocket', disabled: true }]
            },
        ],
        regionId: 'oakhaven',
        x: 250, y: 160,
        type: 'internal',
    },

    // DISTRICTS & STREETS (Internal POIs)
    oakhaven_market: {
        id: 'oakhaven_market',
        name: 'Oakhaven Market',
        description: 'A bustling market street lined with various stalls. The general store is just off the main thoroughfare.',
        connections: ['oakhaven_square', 'oakhaven_general_store'],
        activities: [],
        regionId: 'oakhaven',
        x: 310, y: 160,
        type: 'internal',
    },
    oakhaven_crafting_district: {
        id: 'oakhaven_crafting_district',
        name: 'Crafting District',
        description: 'The sound of work fills the air here. Tanning racks and workbenches line the street, leading to various artisan shops.',
        connections: ['oakhaven_square', 'oakhaven_crafting_supplies', 'tanner_svens_shop', 'oakhaven_west_gate', 'oakhaven_herblore_shop'],
        activities: [],
        regionId: 'oakhaven',
        x: 190, y: 160,
        type: 'internal',
    },
    oakhaven_tavern_street: {
        id: 'oakhaven_tavern_street',
        name: 'Tavern Street',
        description: 'A quieter side street leading to the local tavern.',
        connections: ['oakhaven_square', 'the_carved_mug'],
        activities: [],
        regionId: 'oakhaven',
        x: 250, y: 220,
        type: 'internal',
    },

    // BUILDINGS (Internal POIs)
    oakhaven_general_store: {
        id: 'oakhaven_general_store',
        name: 'Oakhaven General Store',
        description: 'A well-stocked store with a variety of goods for the aspiring adventurer.',
        connections: ['oakhaven_market'],
        activities: [
            { type: 'shop', shopId: 'oakhaven_general' },
        ],
        regionId: 'oakhaven',
        x: 350, y: 140,
        type: 'internal',
    },
    oakhaven_crafting_supplies: {
        id: 'oakhaven_crafting_supplies',
        name: 'Artisan Supplies',
        description: 'A shop selling all manner of tools and materials for crafting.',
        connections: ['oakhaven_crafting_district'],
        activities: [
            { type: 'shop', shopId: 'oakhaven_crafting' },
        ],
        regionId: 'oakhaven',
        x: 150, y: 140,
        type: 'internal',
    },
    oakhaven_herblore_shop: {
        id: 'oakhaven_herblore_shop',
        name: "Elara's Apothecary",
        description: "A shop filled with the scent of strange and wonderful herbs. Vials of colorful liquids line the shelves.",
        connections: ['oakhaven_crafting_district'],
        activities: [
            { type: 'shop', shopId: 'oakhaven_herblore' },
            {
                type: 'npc',
                name: 'Elara the Herbalist',
                icon: '/assets/npcChatHeads/elara_the_herbalist.png',
                // FIX: Converted string array to DialogueNode structure.
                dialogue: {
                    start: {
                        npcName: 'Elara the Herbalist',
                        npcIcon: '/assets/npcChatHeads/elara_the_herbalist.png',
                        text: "Welcome to my little shop. If you need anything for potion-making, you've come to the right place.\n\nThe key to a good potion is properly prepared ingredients. A pestle and mortar is a must-have for any aspiring herbalist.",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            }
        ],
        regionId: 'oakhaven',
        x: 170, y: 120,
        type: 'internal',
    },
    tanner_svens_shop: {
        id: 'tanner_svens_shop',
        name: "Tanner Sven's",
        description: 'The smell of cured hides is strong here. Sven works diligently at his tanning rack.',
        connections: ['oakhaven_crafting_district'],
        activities: [
            {
                type: 'interactive_dialogue',
                dialogue: {
                    start: {
                        npcName: 'Tanner Sven',
                        npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                        text: "Need some hides tanned? You've come to the right place. What have you got for me?",
                        responses: [
                            { text: "Tan Cowhide (5 coins)", action: 'custom', customActionId: 'tan_cowhide' },
                            { text: "Tan Boar Hide (8 coins)", action: 'custom', customActionId: 'tan_boar_hide' },
                            { text: "Tan Wolf Pelt (15 coins)", action: 'custom', customActionId: 'tan_wolf_pelt' },
                            { text: "Tan Bear Pelt (25 coins)", action: 'custom', customActionId: 'tan_bear_pelt' },
                            { text: "Just looking, thanks.", action: 'close' },
                        ],
                    },
                },
                startNode: 'start',
            }
        ],
        regionId: 'oakhaven',
        x: 150, y: 180,
        type: 'internal',
    },
    the_carved_mug: {
        id: 'the_carved_mug',
        name: 'The Carved Mug',
        description: 'A cozy tavern filled with the warmth of a large cooking range and the smell of roasting meats.',
        connections: ['oakhaven_tavern_street'],
        activities: [
            { type: 'quest_board' },
            { type: 'cooking_range' },
            {
                type: 'npc',
                name: 'Barkeep Freya',
                icon: '/assets/npcChatHeads/barkeep_freya.png',
                // FIX: Converted string array to DialogueNode structure.
                dialogue: {
                    start: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Welcome to The Carved Mug! Come in, warm yourself by the fire.\n\nFancy a pint of our finest ale?",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            },
            {
                type: 'npc',
                name: 'Bronn the Retired Adventurer',
                icon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                // FIX: Converted string array to DialogueNode structure.
                dialogue: {
                    start: {
                        npcName: 'Bronn the Retired Adventurer',
                        npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                        text: "Hah! Seen a few things in my day, I have. Fought goblins that were bigger than a cow and twice as mean.\n\nIf you're heading up into the peaks, be wary of the harpies. Nasty creatures. Their feathers are sharp as steel, though.\n\nThey say the king of the goblins, Grumlok, has a soft spot for shiny things. Not that you'll get close enough to find out.",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            }
        ],
        regionId: 'oakhaven',
        x: 310, y: 220,
        type: 'internal',
    },
    oakhaven_bank: {
        id: 'oakhaven_bank',
        name: 'Bank of Embrune',
        description: 'A sturdy, well-guarded building. Your items will be safe here.',
        connections: ['oakhaven_square'],
        activities: [
            { type: 'bank' },
            {
                type: 'npc',
                name: 'Banker Astrid',
                icon: '/assets/npcChatHeads/banker_astrid.png',
                // FIX: Converted string array to DialogueNode structure.
                dialogue: {
                    start: {
                        npcName: 'Banker Astrid',
                        npcIcon: '/assets/npcChatHeads/banker_astrid.png',
                        text: "Bank of Embrune, Oakhaven branch. How may I assist you?",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'oakhaven',
        x: 190, y: 220,
        type: 'internal',
    },
};
