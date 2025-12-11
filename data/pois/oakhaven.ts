
import { POI, SkillName } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';

export const oakhavenPois: Record<string, POI> = {
    // GATES (World Map POIs)
    oakhaven_north_gate: {
        id: 'oakhaven_north_gate',
        name: 'Oakhaven North Gate',
        description: 'Sturdy wooden gates mark the entrance to the town of Oakhaven. The scent of sawdust and tanning leather hangs in the air.',
        connections: ['oakhaven_road_2', 'oakhaven_square'],
        activities: [],
        regionId: 'oakhaven',
        type: 'internal',
        x: 250, y: 0,
        eX: 1000, eY: 1800,
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
                pickpocket: { lootTableId: 'pickpocket_guard_table' },
                attackableMonsterId: 'guard',
                startNode: 'elara_default',
            },
        ],
        regionId: 'oakhaven',
        type: 'internal',
        x: 0, y: 160,
        eX: 1000, eY: 1800,
    },

    // CITY CENTER (Internal POI)
    oakhaven_square: {
        id: 'oakhaven_square',
        name: 'Oakhaven Square',
        description: 'The center of the crafting town. A serene-looking wishing well sits in the middle of the square. Roads lead to the gates and various districts.',
        connections: ['oakhaven_north_gate', 'oakhaven_market', 'oakhaven_crafting_district', 'oakhaven_tavern_street', 'oakhaven_bank', 'oakhaven_chapel'],
        activities: [
            { type: 'wishing_well' },
            { type: 'water_source', name: 'Collect Water' },
            { type: 'npc', name: 'Man', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Man', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man', pickpocket: { lootTableId: 'pickpocket_oakhaven_citizen' } },
            { type: 'npc', name: 'Woman', icon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', dialogue: { start: { npcName: 'Woman', npcIcon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'woman', pickpocket: { lootTableId: 'pickpocket_oakhaven_citizen' } },
            {
                type: 'npc',
                name: 'Craftsman',
                icon: '/assets/npcChatHeads/artisan.png',
                pickpocket: { lootTableId: 'pickpocket_craftsman_table' },
                dialogue: {
                    start: {
                        npcName: 'Craftsman',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: CIVILLIAN_DIALOGUE.oakhaven.join('\n\n'),
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random'
            },
        ],
        regionId: 'oakhaven',
        x: 250, y: 160,
        type: 'internal',
    },

    oakhaven_chapel: {
        id: 'oakhaven_chapel',
        name: 'Oakhaven Chapel',
        description: 'A modest wooden chapel. The scent of incense hangs in the air.',
        connections: ['oakhaven_square'],
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
        regionId: 'oakhaven',
        x: 280, y: 100,
        type: 'internal',
    },

    // DISTRICTS & STREETS (Internal POIs)
    oakhaven_market: {
        id: 'oakhaven_market',
        name: 'Oakhaven Market',
        description: 'A bustling market street lined with various stalls. The general store is just off the main thoroughfare.',
        connections: ['oakhaven_square', 'oakhaven_general_store'],
        activities: [
            { type: 'thieving_stall', id: 'oakhaven_market_bakery_stall', name: 'Steal from Bakery Stall', lootTableId: 'thieving_stall_bakery' },
            { type: 'thieving_stall', id: 'oakhaven_market_fur_stall', name: 'Steal from Fur Stall', lootTableId: 'thieving_stall_fur' },
        ],
        regionId: 'oakhaven',
        x: 310, y: 160,
        type: 'internal',
    },
    oakhaven_crafting_district: {
        id: 'oakhaven_crafting_district',
        name: 'Crafting District',
        description: 'The sound of work fills the air here. Tanning racks and workbenches line the street, leading to various artisan shops.',
        connections: ['oakhaven_square', 'oakhaven_crafting_supplies', 'tanner_svens_shop', 'oakhaven_west_gate', 'oakhaven_herblore_shop', 'oakhaven_artisans_quarter', 'oakhaven_rooftop_access'],
        activities: [],
        regionId: 'oakhaven',
        x: 190, y: 160,
        type: 'internal',
    },
    oakhaven_artisans_quarter: {
        id: 'oakhaven_artisans_quarter',
        name: 'Oakhaven Artisan\'s Quarter',
        description: 'A quieter section of the district where master craftsmen have their workshops. The smell of oiled wood and hemp rope is strong here.',
        connections: ['oakhaven_crafting_district', 'oakhaven_woodworkers_shop'],
        activities: [
            {
                type: 'npc',
                name: 'Finn the Rope-maker',
                icon: '/assets/npcChatHeads/finn_the_rope_maker.png',
                startNode: 'finn_default',
            }
        ],
        regionId: 'oakhaven',
        x: 190, y: 200,
        type: 'internal',
    },
    oakhaven_tavern_street: {
        id: 'oakhaven_tavern_street',
        name: 'Tavern Street',
        description: 'A quieter residential side street leading to the local tavern.',
        connections: ['oakhaven_square', 'the_carved_mug'],
        activities: [
            { type: 'thieving_pilfer', id: 'oakhaven_house_1', name: 'Locked House' },
            { type: 'thieving_pilfer', id: 'oakhaven_house_2', name: 'Locked House' },
        ],
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
        name: "The Verdant Vial",
        description: "A shop filled with the scent of strange and wonderful herbs. Vials of colorful liquids line the shelves.",
        connections: ['oakhaven_crafting_district'],
        activities: [
            { type: 'shop', shopId: 'oakhaven_herblore' },
            {
                type: 'npc',
                name: 'Herbalist Anise',
                icon: '/assets/npcChatHeads/herbalist_anise.png',
                dialogue: {
                    start: {
                        npcName: 'Herbalist Anise',
                        npcIcon: '/assets/npcChatHeads/herbalist_anise.png',
                        text: "Welcome to my little shop. If you need anything for potion-making, you've come to the right place.\n\nThe key to a good potion is properly prepared ingredients. A pestle and mortar is a must-have for any aspiring herbalist.",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
                questTopics: ['petunia_problems'],
            }
        ],
        regionId: 'oakhaven',
        x: 190, y: 120,
        type: 'internal',
    },
    tanner_svens_shop: {
        id: 'tanner_svens_shop',
        name: "Tanner Sven's",
        description: 'The smell of cured hides is strong here. Sven works diligently at his tanning rack.',
        connections: ['oakhaven_crafting_district'],
        activities: [
            {
                type: 'npc',
                name: 'Tanner Sven',
                icon: '/assets/npcChatHeads/tanner_sven.png',
                startNode: 'start',
                dialogue: {
                    start: {
                        npcName: 'Tanner Sven',
                        npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                        text: "You bring the hide, I'll make it leather. For a price, of course. Got anything for me?",
                        responses: [
                            { text: "Tan all hides in inventory.", actions: [{ type: 'tan_all_hides' }] },
                            { text: "I'll come back later." }
                        ]
                    }
                }
            }
        ],
        regionId: 'oakhaven',
        x: 150, y: 180,
        type: 'internal',
    },
    oakhaven_woodworkers_shop: {
        id: 'oakhaven_woodworkers_shop',
        name: "Alaric's Fine Woods",
        description: "The workshop of the master woodworker, Alaric. The air is rich with the scent of sawdust and wood varnish.",
        connections: ['oakhaven_artisans_quarter'],
        activities: [
            {
                type: 'npc',
                name: 'Alaric the Woodworker',
                icon: '/assets/npcChatHeads/artisan.png',
                startNode: 'alaric_default',
            }
        ],
        regionId: 'oakhaven',
        x: 190, y: 240,
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
                dialogue: {
                    start: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Welcome to The Carved Mug. We've got the best ale and the softest beds in Oakhaven. What can I get for you?",
                        responses: [
                            { text: "A pint of your finest.", next: 'buy_drink_intro' },
                            { text: "I'd like to rent a room.", next: 'rent_room_intro' },
                        ]
                    },
                    buy_drink_intro: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "An excellent choice! Warms the soul after a long day of crafting, eh? That'll be 3 coins.",
                        responses: [
                            { text: "Here you go.", check: { requirements: [{ type: 'coins', amount: 3 }], successNode: 'buy_drink_success', failureNode: 'buy_drink_fail' }, actions: [{ type: 'take_coins', amount: 3 }, { type: 'give_item', itemId: 'beer', quantity: 1 }] },
                            { text: "A bit steep for me." },
                        ]
                    },
                    buy_drink_success: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Cheers!",
                        responses: []
                    },
                    buy_drink_fail: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Sorry, you don't have enough coin for that.",
                        responses: []
                    },
                    rent_room_intro: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Wise adventurer. A good night's sleep in a proper bed does wonders for your health. A room for the night is 15 coins.",
                        responses: [
                            { text: "I'll take it.", check: { requirements: [{ type: 'coins', amount: 15 }], successNode: 'rent_room_success', failureNode: 'buy_drink_fail' }, actions: [{ type: 'take_coins', amount: 15 }, { type: 'heal', amount: 'full' }] },
                            { text: "I think I'll rough it." },
                        ]
                    },
                    rent_room_success: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Wonderful. Sleep well!",
                        responses: []
                    }
                },
                startNode: 'start',
            },
            {
                type: 'npc',
                name: 'Bronn the Retired Adventurer',
                icon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                startNode: 'default_dialogue',
                questTopics: ['an_echo_of_battle', 'art_of_the_warhammer'],
                conditionalGreetings: [
                    // AN ECHO OF BATTLE (HIGHEST PRIORITY)
                    { text: "Thank you again, my friend. It's... quieter now. In my head.", check: { requirements: [{ type: 'quest', questId: 'an_echo_of_battle', status: 'completed' }] } },
                    { text: "Have you uncovered any information about the barrow?", check: { requirements: [{ type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 1 }] }},
                    { text: "Have you uncovered any information about the barrow?", check: { requirements: [{ type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 0 }] }},
                    { text: "The barrow seal is weakening. I knew it. What are you waiting for? Take the key to Valerius!", check: { requirements: [{ type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 2 }] } },
                    { text: "Have you reforged the key yet?", check: { requirements: [{ type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 3 }] } },
                    { text: "You have the reforged key? Then what are you doing here? Get to the barrow!", check: { requirements: [{ type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 5 }] } },
                    { text: "The seal is broken? Don't keep it waiting. End this.", check: { requirements: [{ type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 6 }] } },
                    { text: "You've returned, what news do you have?", check: { requirements: [{ type: 'quest', questId: 'an_echo_of_battle', status: 'in_progress', stage: 7 }] } },
                    
                    // ART OF THE WARHAMMER (LOWER PRIORITY)
                    { text: "Still here? Valerius isn't getting any younger. You'll find him at the smithy in Meadowdale.", check: { requirements: [{ type: 'quest', questId: 'art_of_the_warhammer', status: 'in_progress', stage: 0 }] } },
                    { text: "Have you forged that warhammer yet? The anvil awaits!", check: { requirements: [{ type: 'quest', questId: 'art_of_the_warhammer', status: 'in_progress', stage: 1 }] } },
                    { text: "Let's see that hammer you've made, then. Show it to me.", check: { requirements: [{ type: 'quest', questId: 'art_of_the_warhammer', status: 'in_progress', stage: 2 }] } },
                    // ART OF THE WARHAMMER POSTQUEST
                    { text: "(Bronn finishes his mug of ale with a troubled look on his face) Ahhh, hello again adventurer... Nice to see a proper smith around here. How's the hammer holding up?", check: { requirements: [{ type: 'quest', questId: 'art_of_the_warhammer', status: 'completed' }, { type: 'quest', questId: 'an_echo_of_battle', status: 'not_started'}] } },
                ],

                dialogue: {
                    default_dialogue: {
                        npcName: 'Bronn the Retired Adventurer',
                        npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                        text: "Another pint, barkeep! What's an old soldier to do but drink and remember?",
                        responses: [],
                    }
                },
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
            {
                type: 'npc',
                name: 'Banker Astrid',
                icon: '/assets/npcChatHeads/banker_astrid.png',
                actions: [
                    { label: 'Bank', action: 'open_bank' },
                    { label: 'Deposit Backpack', action: 'deposit_backpack' },
                    { label: 'Deposit Equipment', action: 'deposit_equipment' },
                ],
                dialogue: {
                    start: {
                        npcName: 'Banker Astrid',
                        npcIcon: '/assets/npcChatHeads/banker_astrid.png',
                        text: "Bank of Embrune, Oakhaven branch. How may I assist you?",
                        responses: [
                            { text: "I'd like to access my bank.", next: 'access_bank' },
                            { text: "Just looking around, thank you." }
                        ]
                    },
                    access_bank: {
                        npcName: 'Banker Astrid',
                        npcIcon: '/assets/npcChatHeads/banker_astrid.png',
                        text: "Certainly. We offer secure storage for all your valuable items. Would you like to view your vault?",
                        responses: [
                            { text: "Yes.", actions: [{ type: 'open_bank' }] },
                            { text: "No, thank you." }
                        ]
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'oakhaven',
        x: 190, y: 220,
        type: 'internal',
    },
    oakhaven_rooftop_access: {
        id: 'oakhaven_rooftop_access',
        name: 'Rooftop Access',
        description: 'A stack of lumber and discarded barrels provides a convenient way up to the rooftops of the crafting district.',
        connections: ['oakhaven_crafting_district'],
        activities: [
            { type: 'start_agility_course', name: "Start Artisan's Run (Lvl 12)", courseId: 'oakhaven_artisans_run' },
        ],
        regionId: 'oakhaven',
        x: 180, y: 180,
        type: 'internal',
    },
};
