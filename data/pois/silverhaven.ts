

import { POI } from '../../types';

export const silverhavenPois: Record<string, POI> = {
    silverhaven_gates: {
        id: 'silverhaven_gates',
        name: 'Silverhaven Gates',
        description: 'The magnificent main gates of the capital city, Silverhaven. The walls are high and well-guarded.',
        connections: ['silverhaven_outskirts', 'silverhaven_square'],
        activities: [],
        regionId: 'wilderness',
        x: 640, y: 1750,
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
                dialogue: [
                    "Hear ye, hear ye! All bounties must be registered with Slayer Master Kaelen at the Spire!",
                    "Hear ye, hear ye! Iron prices are up, due to the troubles in the south!",
                    "Hear ye, hear ye! The ferry to the Isle of Whispers departs daily from the docks! Passage is at your own risk!"
                ]
            },
            { type: 'water_source', name: 'Fill Vials at Fountain' }
        ],
        regionId: 'silverhaven',
        x: 250, y: 340,
        type: 'internal',
    },
    silverhaven_trade_district: {
        id: 'silverhaven_trade_district',
        name: 'Trade District',
        description: 'A wide avenue lined with opulent shops and the imposing structure of the Grand Bank of Embervale.',
        connections: ['silverhaven_square', 'silverhaven_bank'],
        activities: [
            { type: 'shop', shopId: 'silverhaven_general' },
            {
                type: 'npc',
                name: 'Merchant Theron',
                icon: '/assets/npcChatHeads/merchant_theron.png',
                dialogue: ["Welcome to the grandest market in the land! What can I get for you?", "My latest caravan from the south is overdue... I'm starting to worry."]
            },
            {
                type: 'npc',
                name: 'Historian Pallas',
                icon: '/assets/npcChatHeads/historian_pallas.png',
                dialogue: [
                    "Ah, the King's Road. A marvel of engineering from the old kingdom. Paved with stones from the Gale-Swept Peaks, they say.",
                    "The Sunken Labyrinth on the Isle of Whispers? It predates the kingdom, perhaps even humanity. It was a temple to a forgotten god of the deep. Some say its builders never left."
                ]
            },
            { type: 'quest_start', questId: 'missing_shipment' },
        ],
        regionId: 'silverhaven',
        x: 310, y: 320,
        type: 'internal',
    },
    silverhaven_bank: {
        id: 'silverhaven_bank',
        name: 'Grand Bank of Embervale',
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
        connections: ['silverhaven_square', 'silverhaven_smithy'],
        activities: [
             { type: 'shop', shopId: 'silverhaven_crafting' },
             { type: 'anvil' },
             { type: 'spinning_wheel'},
             {
                type: 'npc',
                name: 'Artisan',
                icon: '/assets/npcChatHeads/artisan.png',
                dialogue: [
                    "Strange noises echo down from the peaks on a clear night... like a hammer on an anvil, but with a clearer ring than any metal I know.",
                    "Some old prospectors talk of a recluse up in the mountains, a smith who shuns cities. Probably just a story to scare off claim-jumpers."
                ]
            }
        ],
        regionId: 'silverhaven',
        x: 190, y: 280,
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
                dialogue: [
                    "This city has the finest forges, but some say the greatest smith of our age isn't in a city at all.",
                    "I once heard a tale of an old master named Borin Stonehand who retired to the Gale-Swept Peaks. They say he perfected the art of the warhammer, forging weapons that could shatter stone like glass."
                ]
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
                type: 'interactive_dialogue',
                dialogue: {
                    start: {
                        npcName: 'Ferryman Silas',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "Ahoy there! Lookin' for a trip to the Isle of Whispers? It's a long journey south. Just 10 coins for the passage. Be warned, it's a dangerous place, not for the faint of heart.",
                        responses: [
                            { text: "Yes, take me to the isle. (10 coins)", action: 'custom', customActionId: 'travel_to_isle_of_whispers' },
                            { text: "Maybe later.", action: 'close' },
                        ],
                    },
                },
                startNode: 'start',
            }
        ],
        regionId: 'silverhaven',
        x: 250, y: 400,
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
        x: 310, y: 400,
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
                dialogue: ["Oh, my necklace... it's been in my family for generations. I fear I lost it on a trip down the King's Road..."]
            }
        ],
        regionId: 'silverhaven',
        x: 190, y: 400,
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
