
import { POI, SkillName } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants';

export const silverhavenPois: Record<string, POI> = {
    silverhaven_gates: {
        id: 'silverhaven_gates',
        name: 'Silverhaven Gates',
        description: 'The magnificent main gates of the capital city, Silverhaven. The walls are high and well-guarded.',
        connections: ['silverhaven_outskirts', 'silverhaven_square'],
        activities: [],
        regionId: 'wilderness',
        x: 676, y: 1827,
    },
    silverhaven_square: {
        id: 'silverhaven_square',
        name: 'Silverhaven Square',
        description: 'The bustling heart of the capital. A grand fountain depicting a silver dragon dominates the square. Paths lead to the city\'s various districts.',
        connections: ['silverhaven_gates', 'silverhaven_trade_district', 'silverhaven_artisans_quarter', 'silverhaven_docks', 'silverhaven_residential_district', 'silverhaven_castle_approach'],
        activities: [
            {
                type: 'npc',
                name: 'Town Crier',
                icon: '/assets/npcChatHeads/town_crier.png',
                dialogue: {
                    start: {
                        npcName: 'Town Crier',
                        npcIcon: '/assets/npcChatHeads/town_crier.png',
                        text: "Hear ye, hear ye! All bounties must be registered with Slayer Master Kaelen at the Spire!\n\nHear ye, hear ye! Iron prices are up, due to the troubles in the south!\n\nHear ye, hear ye! The ferry to the Isle of Whispers departs daily from the docks! Passage is at your own risk!",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            },
            { type: 'water_source', name: 'Collect Water' },
            { type: 'npc', name: 'Man', icon: '/assets/npcChatHeads/tavern_regular.png', dialogue: { start: { npcName: 'Man', npcIcon: '/assets/npcChatHeads/tavern_regular.png', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man' },
            { type: 'npc', name: 'Woman', icon: '/assets/npcChatHeads/elara.png', dialogue: { start: { npcName: 'Woman', npcIcon: '/assets/npcChatHeads/elara.png', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'woman' },
            {
                type: 'npc',
                name: 'Citizen',
                icon: '/assets/npcChatHeads/tavern_regular.png',
                dialogue: {
                     start: {
                        npcName: 'Citizen',
                        npcIcon: '/assets/npcChatHeads/tavern_regular.png',
                        text: CIVILLIAN_DIALOGUE.silverhaven.join('\n\n'),
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random'
            },
        ],
        regionId: 'silverhaven',
        x: 250, y: 340,
        type: 'internal',
    },
    silverhaven_trade_district: {
        id: 'silverhaven_trade_district',
        name: 'Trade District',
        description: 'A wide avenue lined with opulent shops and the imposing structure of the Grand Bank of Embrune.',
        connections: ['silverhaven_square', 'silverhaven_bank'],
        activities: [
            { type: 'shop', shopId: 'silverhaven_general' },
            { type: 'npc', name: 'Man', icon: '/assets/npcChatHeads/tavern_regular.png', dialogue: { start: { npcName: 'Man', npcIcon: '/assets/npcChatHeads/tavern_regular.png', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man' },
            { type: 'npc', name: 'Woman', icon: '/assets/npcChatHeads/elara.png', dialogue: { start: { npcName: 'Woman', npcIcon: '/assets/npcChatHeads/elara.png', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'woman' },
            {
                type: 'npc',
                name: 'Merchant Theron',
                icon: '/assets/npcChatHeads/merchant_theron.png',
                dialogue: {
                    default_dialogue: {
                        npcName: 'Merchant Theron',
                        npcIcon: '/assets/npcChatHeads/merchant_theron.png',
                        text: "Welcome to the grandest market in the land! What can I get for you?\n\nMy latest caravan from the south is overdue... I'm starting to worry.",
                        responses: []
                    },
                    in_progress_missing_shipment_0: {
                        npcName: 'Merchant Theron',
                        npcIcon: '/assets/npcChatHeads/merchant_theron.png',
                        text: "My caravan goods! You found them! I thought they were lost forever. The bandits on the King's Road have been a plague on my business. Thank you, adventurer. Please, take this for your trouble.",
                        responses: [
                            { text: "Glad I could help.", actions: [{ type: 'give_xp', skill: SkillName.Slayer, amount: 1000 }, { type: 'give_coins', amount: 2000 }, { type: 'give_item', itemId: 'uncut_emerald', quantity: 1 }, { type: 'advance_quest', questId: 'missing_shipment' }] }
                        ]
                    },
                    post_quest_missing_shipment: {
                        npcName: 'Merchant Theron',
                        npcIcon: '/assets/npcChatHeads/merchant_theron.png',
                        text: "Thanks to you, my shipments are getting through again. I'm in your debt.",
                        responses: []
                    }
                },
                startNode: 'default_dialogue',
                dialogueType: 'random',
            },
            {
                type: 'npc',
                name: 'Historian Pallas',
                icon: '/assets/npcChatHeads/historian_pallas.png',
                dialogue: {
                    start: {
                        npcName: 'Historian Pallas',
                        npcIcon: '/assets/npcChatHeads/historian_pallas.png',
                        text: "Ah, the King's Road. A marvel of engineering from the old kingdom. Paved with stones from the Gale-Swept Peaks, they say.\n\nThe Sunken Labyrinth on the Isle of Whispers? It predates the kingdom, perhaps even humanity. It was a temple to a forgotten god of the deep. Some say its builders never left.",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            },
            {
                type: 'npc',
                name: 'Guard',
                icon: '/assets/npcChatHeads/guard_captain_elara.png',
                dialogue: {
                    start: {
                        npcName: 'Guard',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: CIVILLIAN_DIALOGUE.silverhaven.join('\n\n'),
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random'
            },
        ],
        regionId: 'silverhaven',
        x: 310, y: 320,
        type: 'internal',
    },
    silverhaven_bank: {
        id: 'silverhaven_bank',
        name: 'Grand Bank of Embrune',
        description: 'The central bank of the region. Your gold is safest here.',
        connections: ['silverhaven_trade_district'],
        activities: [
            {
                type: 'npc',
                name: 'Banker Cassian',
                icon: '/assets/npcChatHeads/banker_theron.png',
                actions: [
                    { label: 'Bank', action: 'open_bank' },
                    { label: 'Deposit Backpack', action: 'deposit_backpack' },
                    { label: 'Deposit Equipment', action: 'deposit_equipment' },
                ],
                dialogue: {
                    start: {
                        npcName: 'Banker Cassian',
                        npcIcon: '/assets/npcChatHeads/banker_theron.png',
                        text: "Welcome to the Grand Bank of Embrune. How can we serve your financial needs today?",
                        responses: [
                            { text: "I'd like to use my bank vault.", next: 'access_bank' },
                            { text: "Just admiring the architecture." }
                        ]
                    },
                    access_bank: {
                        npcName: 'Banker Cassian',
                        npcIcon: '/assets/npcChatHeads/banker_theron.png',
                        text: "Of course, your vault is ready for you. Shall I open it?",
                        responses: [
                            { text: "Yes, please.", actions: [{ type: 'open_bank' }] },
                            { text: "No, that's all for now." }
                        ]
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'silverhaven',
        x: 310, y: 280,
        type: 'internal',
    },
    silverhaven_artisans_quarter: {
        id: 'silverhaven_artisans_quarter',
        name: 'Artisan\'s Quarter',
        description: 'The sounds of hammers and saws fill the air here. Master craftsmen offer their services and wares here.',
        connections: ['silverhaven_square', 'silverhaven_smithy', 'silverhaven_arcane_wares'],
        activities: [
             { type: 'shop', shopId: 'silverhaven_crafting' },
             { type: 'anvil' },
             { type: 'spinning_wheel'},
             {
                type: 'npc',
                name: 'Artisan',
                icon: '/assets/npcChatHeads/artisan.png',
                dialogue: {
                    start: {
                        npcName: 'Artisan',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Strange noises echo down from the peaks on a clear night... like a hammer on an anvil, but with a clearer ring than any metal I know.\n\nSome old prospectors talk of a recluse up in the mountains, a smith who shuns cities. Probably just a story to scare off claim-jumpers.",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'silverhaven',
        x: 190, y: 280,
        type: 'internal',
    },
    silverhaven_arcane_wares: {
        id: 'silverhaven_arcane_wares',
        name: 'Silverhaven Arcane Wares',
        description: 'A shop filled with the scent of old parchment and strange herbs. The air crackles with magical energy.',
        connections: ['silverhaven_artisans_quarter'],
        activities: [
            { type: 'shop', shopId: 'silverhaven_magic_shop' },
            { type: 'bookbinding_workbench' },
            {
                type: 'npc',
                name: 'Archmage Theron',
                icon: 'https://api.iconify.design/game-icons:wizard-face.svg',
                dialogue: {
                    start: {
                        npcName: 'Archmage Theron',
                        npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
                        text: "Welcome, traveler. In need of arcane supplies? You've come to the right place.\n\nAn elemental staff is a mage's best friend. It can act as an endless source of a particular elemental rune.",
                        responses: [],
                        conditionalResponses: [
                            { text: "I sense a magical disturbance...", check: { requirements: [{ type: 'quest', questId: 'capitals_call', status: 'completed' }, { type: 'skill', skill: SkillName.Magic, level: 40 }, { type: 'quest', questId: 'the_arcane_awakening', status: 'not_started' }], successNode: 'quest_intro_the_arcane_awakening', failureNode: '' }},
                            { text: "Archmage, I have the altar readings.", check: { requirements: [
                                { type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 1 },
                                { type: 'items', items: [{itemId: 'gust_reading', quantity: 1}, {itemId: 'stone_reading', quantity: 1}, {itemId: 'aqua_reading', quantity: 1}] }
                            ], successNode: 'in_progress_the_arcane_awakening_1', failureNode: '' }},
                            { text: "I have defeated the Arcane Wyvern and stabilized the Weave.", check: { requirements: [
                                { type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 9 }
                            ], successNode: 'in_progress_the_arcane_awakening_9', failureNode: '' }}
                        ]
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
                    in_progress_the_arcane_awakening_1: {
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
                    in_progress_the_arcane_awakening_9: {
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
                },
                startNode: 'start',
                dialogueType: 'random',
            }
        ],
        regionId: 'silverhaven',
        x: 190, y: 320,
        type: 'internal',
    },
    silverhaven_smithy: {
        id: 'silverhaven_smithy',
        name: 'The Gilded Hammer',
        description: 'The finest smithy in the land. The heat from the grand furnace is immense.',
        connections: ['silverhaven_artisans_quarter'],
        activities: [
            { type: 'furnace' },
            { type: 'shop', shopId: 'gilded_hammer_armory' },
            {
                type: 'npc',
                name: 'Master Smith Gideon',
                icon: '/assets/npcChatHeads/master_smith_gideon.png',
                dialogue: {
                    start: {
                        npcName: 'Master Smith Gideon',
                        npcIcon: '/assets/npcChatHeads/master_smith_gideon.png',
                        text: "This city has the finest forges, but some say the greatest smith of our age isn't in a city at all.\n\nI once heard a tale of an old master named Borin Stonehand who retired to the Gale-Swept Peaks. They say he perfected the art of the warhammer, forging weapons that could shatter stone like glass.",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'silverhaven',
        x: 130, y: 280,
        type: 'internal',
    },
    silverhaven_docks: {
        id: 'silverhaven_docks',
        name: 'Silverhaven Docks',
        description: 'The smell of salt and fish hangs in the air. Ships from distant lands are moored at the long wooden piers.',
        connections: ['silverhaven_square', 'silverhaven_fish_market'],
        activities: [
            {
                type: 'npc',
                name: 'Ferryman Silas',
                icon: '/assets/npcChatHeads/ferryman_silas.png',
                dialogue: {
                    start: {
                        npcName: 'Ferryman Silas',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "Where can I take you today? The Isle of Whispers awaits the brave... or the foolish.",
                        responses: [
                            { text: "Take the ferry to the Isle of Whispers. (10 coins)", check: { requirements: [{ type: 'coins', amount: 10 }], successNode: 'travel_whispers_success', failureNode: 'travel_fail' }, actions: [{ type: 'take_coins', amount: 10 }, { type: 'teleport', poiId: 'port_wreckage_docks' }] },
                            { text: "Nowhere for now, thanks." },
                        ],
                    },
                    travel_whispers_success: {
                        npcName: 'Ferryman Silas',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "All aboard for the Isle of Whispers! Don't say I didn't warn ya...",
                        responses: []
                    },
                    travel_fail: {
                        npcName: 'Ferryman Silas',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "Sorry, friend. Passage ain't free. Come back when you have the coin.",
                        responses: []
                    }
                },
                startNode: 'start',
            },
            {
                type: 'npc',
                name: 'Skyship Captain',
                icon: '/assets/npcChatHeads/ferryman_silas.png', // Reusing icon for now
                dialogue: {
                    start: {
                        npcName: 'Skyship Captain',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "The skies call to you, adventurer? For a fee, I can take you to the Crystalline Isles. It's a breathtaking sight, but not for the faint of heart.",
                        responses: [
                            { text: "I'll keep my feet on the ground for now." },
                        ],
                        conditionalResponses: [
                            {
                                text: "Archmage Theron sent me. I need passage to the Crystalline Isles.",
                                check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 2 }], successNode: 'in_progress_the_arcane_awakening_2', failureNode: '' }
                            },
                            {
                                text: "I have the Resonance Dampener.",
                                check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 6 }, { type: 'items', items: [{ itemId: 'resonance_dampener', quantity: 1 }] }], successNode: 'in_progress_the_arcane_awakening_6', failureNode: '' }
                            }
                        ]
                    },
                    in_progress_the_arcane_awakening_2: {
                        npcName: 'Skyship Captain',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "To the Crystalline Isles? Are you mad? The magical turbulence up there would tear my ship apart! The arcane energies are too severe.",
                        responses: [
                            { text: "Is there anything that can be done?", next: 'taa_captain_2' }
                        ]
                    },
                    taa_captain_2: {
                        npcName: 'Skyship Captain',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "I'd need a special component, a 'Resonance Dampener', to navigate that storm. I'm a captain, not an engineer. But I've heard tales of a master craftsman known for working with exotic materials—Durin, at the Dwarven Outpost. If anyone can build such a thing, it's him.",
                        responses: [
                            { text: "Thank you, Captain. I'll find this Durin.", actions: [{ type: 'advance_quest', questId: 'the_arcane_awakening' }] }
                        ]
                    },
                    in_progress_the_arcane_awakening_6: {
                        npcName: 'Skyship Captain',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "By my beard... is that a Resonance Dampener? I never thought I'd see one! The dwarf actually built it! With this... yes, with this, we can make the voyage. Prepare yourself, adventurer. The skies await!",
                        responses: [
                            { text: "(Board the Skyship)", actions: [{ type: 'take_item', itemId: 'resonance_dampener', quantity: 1 }, { type: 'advance_quest', questId: 'the_arcane_awakening' }, { type: 'teleport', poiId: 'crystalline_isles_landing' }] }
                        ]
                    },
                },
                startNode: 'start',
            }
        ],
        regionId: 'silverhaven',
        x: 307, y: 394,
        type: 'internal',
    },
    silverhaven_fish_market: {
        id: 'silverhaven_fish_market',
        name: 'Fish Market',
        description: 'Fishermen hawk their latest catches. The ground is slick with seawater.',
        connections: ['silverhaven_docks'],
        activities: [
            { type: 'shop', shopId: 'silverhaven_fishing' }
        ],
        regionId: 'silverhaven',
        x: 307, y: 370,
        type: 'internal',
    },
     silverhaven_residential_district: {
        id: 'silverhaven_residential_district',
        name: 'Residential District',
        description: 'A quieter area with well-kept houses. Citizens go about their daily lives.',
        connections: ['silverhaven_square'],
        activities: [
             { type: 'npc', name: 'Man', icon: '/assets/npcChatHeads/tavern_regular.png', dialogue: { start: { npcName: 'Man', npcIcon: '/assets/npcChatHeads/tavern_regular.png', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man' },
             {
                type: 'npc',
                name: 'Elara',
                icon: '/assets/npcChatHeads/elara.png',
                dialogue: {
                    default_dialogue: {
                        npcName: 'Elara',
                        npcIcon: '/assets/npcChatHeads/elara.png',
                        text: "Oh, excuse me. I'm just a bit distracted today. I seem to have misplaced a family heirloom, a beautiful silver necklace. I fear I may have dropped it during my last trip along the King's Road...",
                        responses: []
                    },
                    item_trigger_lost_heirloom: {
                        npcName: 'Elara',
                        npcIcon: '/assets/npcChatHeads/elara.png',
                        text: "Is that... could it be? My heirloom necklace! I thought it was lost forever! Oh, thank you, thank you, kind stranger! I don't have much, but please, take this as a reward for your honesty.",
                        responses: [
                            { text: "You're welcome. I'm glad I could return it.", actions: [{ type: 'start_quest', questId: 'lost_heirloom' }] },
                        ]
                    },
                    in_progress_lost_heirloom_0: {
                        npcName: 'Elara',
                        npcIcon: '/assets/npcChatHeads/elara.png',
                        text: "You've made an old woman very happy today. Thank you again.",
                        responses: [
                            { text: "It was my pleasure.", actions: [{ type: 'give_xp', skill: SkillName.Slayer, amount: 350 }, { type: 'give_coins', amount: 1500 }, { type: 'advance_quest', questId: 'lost_heirloom' }] },
                        ]
                    },
                    post_quest_lost_heirloom: {
                        npcName: 'Elara',
                        npcIcon: '/assets/npcChatHeads/elara.png',
                        text: "It's so good to see you again! I haven't taken off my necklace since you returned it to me. Thank you forever.",
                        responses: []
                    }
                },
                startNode: 'default_dialogue'
            }
        ],
        regionId: 'silverhaven',
        x: 250, y: 280,
        type: 'internal',
    },
    silverhaven_castle_approach: {
        id: 'silverhaven_castle_approach',
        name: 'Castle Approach',
        description: 'A grand, tree-lined avenue leading north towards the Royal Castle. A tall, slender tower stands to the east.',
        connections: ['silverhaven_square', 'silverhaven_slayers_spire'],
        activities: [],
        regionId: 'silverhaven',
        x: 150, y: 340,
        type: 'internal',
    },
     silverhaven_slayers_spire: {
        id: 'silverhaven_slayers_spire',
        name: 'Slayer\'s Spire',
        description: 'A tall tower dedicated to the elite monster hunters of the realm. At its peak, a strange, lighter-than-air vessel is moored.',
        connections: ['silverhaven_castle_approach'],
        activities: [
            { type: 'slayer_master', name: 'Kaelen', icon: '/assets/npcChatHeads/kaelen.png' },
            { type: 'blimp_travel', requiredSlayerLevel: 50 }
        ],
        regionId: 'silverhaven',
        x: 150, y: 280,
        type: 'internal',
    },
};