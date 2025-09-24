import { POI } from '../../types';
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
                dialogueType: 'random',
                actions: [{ label: 'Pickpocket', disabled: true }]
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
            {
                type: 'npc',
                name: 'Merchant Theron',
                icon: '/assets/npcChatHeads/merchant_theron.png',
                dialogue: {
                    start: {
                        npcName: 'Merchant Theron',
                        npcIcon: '/assets/npcChatHeads/merchant_theron.png',
                        text: "Welcome to the grandest market in the land! What can I get for you?\n\nMy latest caravan from the south is overdue... I'm starting to worry.",
                        responses: []
                    }
                },
                startNode: 'start',
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
                dialogueType: 'random',
                actions: [{ label: 'Pickpocket', disabled: true }]
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
            { type: 'bank' }
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
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random'
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
                        text: "Where can I take you today? I've got the regular ferry, and a special commission for the more... adventurous types.",
                        responses: [
                            { text: "Take the ferry to the Isle of Whispers. (10 coins)", action: 'custom', customActionId: 'travel_to_isle_of_whispers' },
                            { text: "Charter a skyship to the Crystalline Isles. (1600 coins)", action: 'custom', customActionId: 'travel_to_crystalline_isles' },
                            { text: "Nowhere for now, thanks.", action: 'close' },
                        ],
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
                            { text: "You're welcome. I'm glad I could return it.", action: 'accept_quest', questId: 'lost_heirloom' },
                        ]
                    },
                    complete_stage_lost_heirloom_0: {
                        npcName: 'Elara',
                        npcIcon: '/assets/npcChatHeads/elara.png',
                        text: "You've made an old woman very happy today. Thank you again.",
                        responses: [
                            { text: "It was my pleasure.", action: 'complete_stage', questId: 'lost_heirloom' },
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