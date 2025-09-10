

import { POI, SkillName } from '../../types';

export const isleOfWhispersPois: Record<string, POI> = {
    // --- Port Wreckage (Settlement) ---
    port_wreckage_docks: {
        id: 'port_wreckage_docks',
        name: 'Port Wreckage Docks',
        description: 'A series of rickety docks built from salvaged ship parts. The air is thick with the smell of salt and brine.',
        connections: ['port_wreckage_square', 'crabclaw_isle'],
        activities: [
             {
                type: 'interactive_dialogue',
                dialogue: {
                    start: {
                        npcName: 'Ferryman Silas',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "Ready to head back to the mainland? Had enough of the sea air?",
                        responses: [
                            { text: "Yes, take me back to Silverhaven.", action: 'custom', customActionId: 'travel_to_silverhaven' },
                            { text: "Not just yet.", action: 'close' },
                        ],
                    },
                },
                startNode: 'start',
            },
            {
                type: 'npc',
                name: 'Fisherman Brody',
                icon: '/assets/npcChatHeads/fisherman_brody.png',
                dialogue: ["Welcome to the Isle of Whispers. Not much here but rocks, salt, and... crabs. Way too many crabs."]
            },
            { type: 'quest_start', questId: 'a_pinch_of_trouble' },
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
                dialogue: ["The island is restless, stranger. An ancient darkness stirs in the depths of the temple. Be wary."]
            },
            { type: 'quest_start', questId: 'the_sunken_curse' }
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
            { type: 'shop', shopId: 'isle_of_whispers_general' }
        ],
        regionId: 'isle_of_whispers',
        x: 500, y: 2380,
    },
    port_wreckage_bank: {
        id: 'port_wreckage_bank',
        name: 'Bank of Embervale - Wreckage Branch',
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
            { type: 'combat', monsterId: 'jungle_stalker' },
        ],
        regionId: 'isle_of_whispers',
        x: 550, y: 2300,
    },
    smugglers_den_entrance: {
        id: 'smugglers_den_entrance',
        name: 'Smuggler\'s Den',
        description: 'A cleverly hidden cave entrance, concealed behind a curtain of vines.',
        connections: ['jungle_heart'],
        activities: [],
        regionId: 'isle_of_whispers',
        x: 500, y: 2250,
    },
    ancient_monoliths: {
        id: 'ancient_monoliths',
        name: 'Ancient Monoliths',
        description: 'A clearing in the jungle where several large, weathered stone monoliths stand in a circle.',
        connections: ['whispering_jungle_edge', 'forgotten_temple_path'],
        activities: [],
        regionId: 'isle_of_whispers',
        x: 600, y: 2300,
    },
    forgotten_temple_path: {
        id: 'forgotten_temple_path',
        name: 'Forgotten Temple Path',
        description: 'An overgrown stone path, clearly of ancient construction, leads deeper into the jungle highlands.',
        connections: ['ancient_monoliths', 'forgotten_temple_courtyard'],
        activities: [
            { type: 'combat', monsterId: 'jungle_stalker' },
        ],
        regionId: 'isle_of_whispers',
        x: 650, y: 2250,
    },
    forgotten_temple_courtyard: {
        id: 'forgotten_temple_courtyard',
        name: 'Temple Courtyard',
        description: 'The ruins of a grand temple courtyard. A huge, sealed archway is carved into the mountainside ahead.',
        connections: ['forgotten_temple_path', 'laby_entrance'],
        activities: [],
        regionId: 'isle_of_whispers',
        x: 700, y: 2200,
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
};
