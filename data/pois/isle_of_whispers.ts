

import { POI, SkillName, ToolType } from '../../types';

export const isleOfWhispersPois: Record<string, POI> = {
    // --- Port Wreckage (Settlement) ---
    port_wreckage_docks: {
        id: 'port_wreckage_docks',
        name: 'Port Wreckage Docks',
        description: 'A series of rickety docks built from salvaged ship parts. The air is thick with the smell of salt and brine.',
        connections: ['port_wreckage_square', 'crabclaw_isle', 'deep_sea_fishing_spot'],
        activities: [
             {
                type: 'npc',
                name: 'Ferryman Silas',
                icon: '/assets/npcChatHeads/ferryman_silas.png',
                dialogue: {
                    start: {
                        npcName: 'Ferryman Silas',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "Ready to leave the isle? Or perhaps venture somewhere new?",
                        responses: [
                            { text: "Take the ferry to Silverhaven. (10 coins)", check: { requirements: [{ type: 'coins', amount: 10 }], successNode: 'travel_silverhaven_success', failureNode: 'travel_fail' }, actions: [{ type: 'take_coins', amount: 10 }, { type: 'teleport', poiId: 'silverhaven_docks' }] },
                            { text: "Not just yet." },
                        ],
                    },
                    travel_silverhaven_success: {
                        npcName: 'Ferryman Silas',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "All aboard for Silverhaven!",
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
                name: 'Fisherman Brody',
                icon: '/assets/npcChatHeads/fisherman_brody.png',
                // FIX: Corrected lootTableId to match level and removed redundant properties.
                pickpocket: { lootTableId: 'pickpocket_craftsman_table' },
                dialogue: {
                    start: {
                        npcName: 'Fisherman Brody',
                        npcIcon: '/assets/npcChatHeads/fisherman_brody.png',
                        text: "Welcome to the Isle of Whispers. Not much here but rocks, salt, and... crabs. Way too many crabs.",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'isle_of_whispers',
        x: 400, y: 2400,
    },
    port_wreckage_square: {
        id: 'port_wreckage_square',
        name: 'Port Wreckage Square',
        description: 'The center of the small, weathered settlement. A fountain made from a ship\'s figurehead sputters weakly.',
        connections: ['port_wreckage_docks', 'the_barnacles_bite', 'salty_supplies', 'port_wreckage_bank', 'island_crossroads'],
        activities: [
            {
                type: 'npc',
                name: 'Elder Maeve',
                icon: '/assets/npcChatHeads/elder_maeve.png',
                // FIX: Corrected lootTableId to match level and removed redundant properties.
                pickpocket: { lootTableId: 'pickpocket_merchant_table' },
                dialogue: {
                    start: {
                        npcName: 'Elder Maeve',
                        npcIcon: '/assets/npcChatHeads/elder_maeve.png',
                        text: "The island is restless, stranger. An ancient darkness stirs in the depths of the temple. Be wary.",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'isle_of_whispers',
        x: 450, y: 2400,
    },
    the_barnacles_bite: {
        id: 'the_barnacles_bite',
        name: "The Barnacle's Bite",
        description: 'A rowdy tavern built into the hull of a beached galleon. It serves as the social hub for the island\'s few inhabitants.',
        connections: ['port_wreckage_square'],
        activities: [
            { type: 'quest_board' },
            {
                type: 'npc',
                name: 'Salty Sam',
                icon: 'https://api.iconify.design/game-icons:pirate-captain.svg',
                // FIX: Corrected lootTableId to match level and removed redundant properties.
                pickpocket: { lootTableId: 'pickpocket_silverhaven_citizen' },
                dialogue: {
                    start: {
                        npcName: 'Salty Sam',
                        npcIcon: 'https://api.iconify.design/game-icons:pirate-captain.svg',
                        text: "Welcome to The Barnacle's Bite. Don't mind the creaking, she's an old ship. What'll it be?",
                        responses: [
                            { text: "What's on tap?", next: 'buy_drink_intro' },
                            { text: "Got a hammock free?", next: 'rent_room_intro' },
                        ]
                    },
                    buy_drink_intro: {
                        npcName: 'Salty Sam',
                        npcIcon: 'https://api.iconify.design/game-icons:pirate-captain.svg',
                        text: "Got some grog. Strong enough to strip barnacles, which is how the place got its name. 5 coins.",
                        responses: [
                            { text: "Pour me one.", check: { requirements: [{ type: 'coins', amount: 5 }], successNode: 'buy_drink_success', failureNode: 'buy_drink_fail' }, actions: [{ type: 'take_coins', amount: 5 }, { type: 'give_item', itemId: 'beer', quantity: 1 }] },
                            { text: "I'll stick to water, thanks." },
                        ]
                    },
                    buy_drink_success: {
                        npcName: 'Salty Sam',
                        npcIcon: 'https://api.iconify.design/game-icons:pirate-captain.svg',
                        text: "There ya go. Put some hair on your chest!",
                        responses: []
                    },
                    buy_drink_fail: {
                        npcName: 'Salty Sam',
                        npcIcon: 'https://api.iconify.design/game-icons:pirate-captain.svg',
                        text: "No coin, no grog. That's the rule.",
                        responses: []
                    },
                    rent_room_intro: {
                        npcName: 'Salty Sam',
                        npcIcon: 'https://api.iconify.design/game-icons:pirate-captain.svg',
                        text: "A hammock, eh? It's not the Silverhaven suite, but it's dry and keeps the crabs from nibblin' your toes. 25 coins for the night, and you'll wake up feeling brand new.",
                        responses: [
                            { text: "Sounds good to me.", check: { requirements: [{ type: 'coins', amount: 25 }], successNode: 'rent_room_success', failureNode: 'buy_drink_fail' }, actions: [{ type: 'take_coins', amount: 25 }, { type: 'heal', amount: 'full' }] },
                            { text: "I'll take my chances with the crabs." },
                        ]
                    },
                    rent_room_success: {
                        npcName: 'Salty Sam',
                        npcIcon: 'https://api.iconify.design/game-icons:pirate-captain.svg',
                        text: "Attaboy. Sleep tight.",
                        responses: []
                    }
                },
                startNode: 'start',
            }
        ],
        regionId: 'isle_of_whispers',
        x: 450, y: 2350,
    },
    salty_supplies: {
        id: 'salty_supplies',
        name: 'Salty Supplies',
        description: 'A small shop selling basic adventuring gear and items scavenged from the island.',
        connections: ['port_wreckage_square'],
        activities: [
            { type: 'shop', shopId: 'isle_of_whispers_general' },
            // FIX: Removed redundant level, xp, and respawnTime properties.
            { type: 'thieving_lockpick', id: 'iow_supplies_chest_1', targetName: 'Supply Crate', lootTableId: 'thieving_house_cabinet_locked' },
        ],
        regionId: 'isle_of_whispers',
        x: 483, y: 2371,
    },
    port_wreckage_bank: {
        id: 'port_wreckage_bank',
        name: 'Bank of Embrune - Wreckage Branch',
        description: 'A surprisingly sturdy vault, likely salvaged from a treasure galleon. Your items are safe here.',
        connections: ['port_wreckage_square'],
        activities: [
            { type: 'bank' }
        ],
        regionId: 'isle_of_whispers',
        x: 450, y: 2450,
    },
    // --- Island General ---
    island_crossroads: {
        id: 'island_crossroads',
        name: 'Island Crossroads',
        description: 'A path splits here, leading west towards the coast, north into the jungle, and east towards the smouldering peaks.',
        connections: ['port_wreckage_square', 'shipwreck_graveyard', 'whispering_jungle_edge', 'ashfall_path'],
        activities: [],
        regionId: 'isle_of_whispers',
        x: 550, y: 2400,
    },
    // --- West Coast ---
    crabclaw_isle: {
        id: 'crabclaw_isle',
        name: 'Crabclaw Isle',
        description: 'This larger island is crawling with oversized crabs that snap their claws aggressively. Piles of weathered driftwood are scattered along the shoreline.',
        connections: ['port_wreckage_docks'],
        activities: [
            { type: 'combat', monsterId: 'giant_crab' },
            { type: 'combat', monsterId: 'giant_crab' },
            { type: 'combat', monsterId: 'giant_crab' },
            { type: 'skilling', id: 'saltstone_driftwood_1', name: 'Chop Driftwood', skill: SkillName.Woodcutting, requiredLevel: 5, loot: [{ itemId: 'driftwood_logs', chance: 1, xp: 30 }], resourceCount: { min: 2, max: 5 }, respawnTime: 10000, gatherTime: 2200 },
        ],
        regionId: 'isle_of_whispers',
        x: 340, y: 2400,
    },
    shipwreck_graveyard: {
        id: 'shipwreck_graveyard',
        name: 'Shipwreck Graveyard',
        description: 'The skeletons of countless ships litter this misty, haunted coastline. The air is unnaturally cold.',
        connections: ['island_crossroads', 'tidal_flats', 'sirens_cove'],
        activities: [
            { type: 'combat', monsterId: 'shipwreck_specter' },
            // FIX: Removed redundant level, xp, and respawnTime properties.
            { type: 'thieving_lockpick', id: 'iow_shipwreck_chest_1', targetName: 'Waterlogged Chest', lootTableId: 'thieving_dungeon_chest_mid' },
        ],
        regionId: 'isle_of_whispers',
        x: 550, y: 2450,
    },
    tidal_flats: {
        id: 'tidal_flats',
        name: 'Tidal Flats',
        description: 'At low tide, these vast mudflats are exposed, revealing strange crustaceans and half-buried treasures.',
        connections: ['shipwreck_graveyard'],
        activities: [
            { type: 'combat', monsterId: 'tidal_crawler' },
            { type: 'combat', monsterId: 'tidal_crawler' },
        ],
        regionId: 'isle_of_whispers',
        x: 500, y: 2500,
    },
    sirens_cove: {
        id: 'sirens_cove',
        name: 'Siren\'s Cove',
        description: 'A deceptively beautiful cove with sharp, jagged rocks. A haunting melody drifts on the wind.',
        connections: ['shipwreck_graveyard'],
        activities: [
            { type: 'combat', monsterId: 'siren' },
        ],
        regionId: 'isle_of_whispers',
        x: 600, y: 2500,
    },
    // --- North Jungle ---
    whispering_jungle_edge: {
        id: 'whispering_jungle_edge',
        name: 'Whispering Jungle Edge',
        description: 'The edge of a dense, tropical jungle. The humidity is oppressive, and the sounds of unseen creatures fill the air.',
        connections: ['island_crossroads', 'jungle_heart', 'ancient_monoliths'],
        activities: [
            { type: 'skilling', id: 'jungle_mahogany_1', name: 'Chop Mahogany', skill: SkillName.Woodcutting, requiredLevel: 50, loot: [{ itemId: 'mahogany_logs', chance: 1, xp: 125 }], resourceCount: { min: 2, max: 4 }, respawnTime: 60000, gatherTime: 4500 },
        ],
        regionId: 'isle_of_whispers',
        x: 550, y: 2350,
    },
    jungle_heart: {
        id: 'jungle_heart',
        name: 'Heart of the Jungle',
        description: 'Deep within the jungle, the canopy blots out the sun. The undergrowth is thick and difficult to traverse.',
        connections: ['whispering_jungle_edge', 'smugglers_den_entrance'],
        activities: [
            { type: 'combat', monsterId: 'jungle_stalker' },
            { type: 'combat', monsterId: 'jungle_stalker' }
        ],
        regionId: 'isle_of_whispers',
        x: 512,
        y: 2323
    },
    smugglers_den_entrance: {
        id: 'smugglers_den_entrance',
        name: "Smuggler's Den",
        description: 'A cleverly hidden cave entrance, concealed behind a curtain of vines.',
        connections: ['jungle_heart'],
        activities: [],
        regionId: 'isle_of_whispers',
        x: 474,
        y: 2294
    },
    ancient_monoliths: {
        id: 'ancient_monoliths',
        name: 'Ancient Monoliths',
        description: 'A clearing in the jungle where several large, weathered stone monoliths stand in a circle.',
        connections: ['whispering_jungle_edge', 'forgotten_temple_path'],
        activities: [],
        regionId: 'isle_of_whispers',
        x: 551,
        y: 2285
    },
    forgotten_temple_path: {
        id: 'forgotten_temple_path',
        name: 'Forgotten Temple Path',
        description: 'An overgrown stone path, clearly of ancient construction, leads deeper into the jungle highlands.',
        connections: ['ancient_monoliths', 'forgotten_temple_courtyard'],
        activities: [
            { type: 'combat', monsterId: 'jungle_stalker' }
        ],
        regionId: 'isle_of_whispers',
        x: 456,
        y: 2248
    },
    forgotten_temple_courtyard: {
        id: 'forgotten_temple_courtyard',
        name: 'Temple Courtyard',
        description: "The ruins of a grand temple courtyard. A huge, sealed archway is carved into the mountainside ahead. An ornate, ancient chest sits on a pedestal in the center.",
        connections: ['forgotten_temple_path', 'laby_entrance'],
        activities: [
            { type: 'ancient_chest', name: 'Open Ancient Chest' }
        ],
        regionId: 'isle_of_whispers',
        x: 341,
        y: 2238
    },
    // --- East Volcanic ---
    ashfall_path: {
        id: 'ashfall_path',
        name: 'Ashfall Path',
        description: 'The ground here is covered in a fine layer of grey ash. The air is warm and smells of sulfur.',
        connections: ['island_crossroads', 'volcanic_vents', 'haunted_mangrove_edge'],
        activities: [],
        regionId: 'isle_of_whispers',
        x: 600, y: 2400,
    },
    volcanic_vents: {
        id: 'volcanic_vents',
        name: 'Volcanic Vents',
        description: 'Jets of hot steam erupt from cracks in the ground. The area is rich with strange, heat-formed minerals.',
        connections: ['ashfall_path'],
        activities: [
            { type: 'combat', monsterId: 'magma_imp' },
            { type: 'skilling', id: 'brimstone_node_1', name: 'Mine Brimstone', skill: SkillName.Mining, requiredLevel: 45, loot: [{ itemId: 'brimstone', chance: 1, xp: 100 }], resourceCount: { min: 2, max: 4 }, respawnTime: 90000, gatherTime: 4000 },
        ],
        regionId: 'isle_of_whispers',
        x: 650, y: 2350,
    },
    haunted_mangrove_edge: {
        id: 'haunted_mangrove_edge',
        name: 'Haunted Mangrove Edge',
        description: 'The ashen path gives way to a dark, twisted mangrove swamp. Ghostly lights flicker in the distance.',
        connections: ['ashfall_path', 'mangrove_heart'],
        activities: [
            { type: 'combat', monsterId: 'shipwreck_specter' },
        ],
        regionId: 'isle_of_whispers',
        x: 650, y: 2450,
    },
    mangrove_heart: {
        id: 'mangrove_heart',
        name: 'Heart of the Mangrove',
        description: 'The heart of the foul swamp. It is difficult to find solid ground here.',
        connections: ['haunted_mangrove_edge', 'abandoned_lighthouse_path'],
        activities: [
            { type: 'combat', monsterId: 'shipwreck_specter' },
            { type: 'combat', monsterId: 'shipwreck_specter' },
        ],
        regionId: 'isle_of_whispers',
        x: 700, y: 2500,
    },
    abandoned_lighthouse_path: {
        id: 'abandoned_lighthouse_path',
        name: 'Lighthouse Path',
        description: 'A crumbling stone causeway leads out to a lonely lighthouse perched on a rocky outcrop in the sea.',
        connections: ['mangrove_heart', 'abandoned_lighthouse'],
        activities: [],
        regionId: 'isle_of_whispers',
        x: 750, y: 2550,
    },
    abandoned_lighthouse: {
        id: 'abandoned_lighthouse',
        name: 'Abandoned Lighthouse',
        description: 'A tall, crumbling lighthouse. Its light has been extinguished for centuries. It is now home to sirens.',
        connections: ['abandoned_lighthouse_path'],
        activities: [
            { type: 'combat', monsterId: 'siren' },
            { type: 'combat', monsterId: 'siren' },
        ],
        regionId: 'isle_of_whispers',
        x: 800, y: 2600,
    },
    deep_sea_fishing_spot: {
        id: 'deep_sea_fishing_spot',
        name: 'Deep-Sea Fishing',
        description: 'The deep, treacherous waters off the coast of the island. Large shapes move beneath the waves.',
        connections: ['port_wreckage_docks'],
        activities: [
            { 
                type: 'skilling', 
                id: 'isle_harpoon_fish', 
                name: 'Harpoon Fish', 
                skill: SkillName.Fishing, 
                requiredLevel: 40, 
                loot: [
                    { itemId: 'raw_tuna', chance: 1, xp: 80 },
                    { itemId: 'raw_swordfish', chance: 0.4, xp: 100, requiredLevel: 62 }
                ], 
                resourceCount: { min: 50, max: 100 }, 
                respawnTime: 35000, 
                gatherTime: 4500, 
                requiredTool: ToolType.Harpoon 
            },
            { type: 'skilling', id: 'isle_harpoon_shark', name: 'Harpoon Shark', skill: SkillName.Fishing, requiredLevel: 76, loot: [{ itemId: 'raw_shark', chance: 1, xp: 110 }], resourceCount: { min: 1, max: 5 }, respawnTime: 90000, gatherTime: 6000, requiredTool: ToolType.Harpoon },
            { type: 'skilling', id: 'isle_ocean_trap_lobster', name: 'Set Ocean Trap', skill: SkillName.Fishing, requiredLevel: 50, loot: [{ itemId: 'raw_lobster', chance: 1, xp: 90 }], resourceCount: { min: 4, max: 9 }, respawnTime: 35000, gatherTime: 4500, requiredTool: ToolType.OceanBoxTrap },
        ],
        regionId: 'isle_of_whispers',
        x: 400, y: 2460,
    },
};
