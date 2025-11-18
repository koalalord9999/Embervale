
import { POI, SkillName } from '../../types';

export const sunkenLabyrinthPois: Record<string, POI> = {
    laby_antechamber: {
    id: 'laby_antechamber',
    name: 'Antechamber',
    description: 'The final chamber before the temple\'s heart. The water here is crystal clear. A hulking guardian, dripping with seaweed and malice, blocks the way forward.',
    connections: ['laby_colonnade_of_the_ancients', 'laby_central_altar'],
    activities: [
        { type: 'combat', monsterId: 'the_abyssal_warden' }
    ],
    regionId: 'sunken_labyrinth',
    x: -48,
    y: 2602
},
    laby_archive_hall: {
    id: 'laby_archive_hall',
    name: 'Archive Hall',
    description: 'Shelves carved into the walls once held countless scrolls, now just piles of rotten pulp. A few stone tablets remain.',
    connections: ['laby_crossroads_1', 'laby_scriptorium', 'laby_sentinel_chamber_1', 'laby_hidden_passage'],
    activities: [
        { type: 'combat', monsterId: 'ancient_sentinel' },
        { type: 'combat', monsterId: 'temple_spirit' }
    ],
    regionId: 'sunken_labyrinth',
    x: 425,
    y: 2231
},
    laby_armory_ruins: {
    id: 'laby_armory_ruins',
    name: 'Ruined Armory',
    description: 'Rusted weapon racks and shattered armor stands line this chamber. It seems this was once an armory.',
    connections: ['laby_flooded_hall_1', 'laby_collapsed_passage_1'],
    activities: [
        { type: 'combat', monsterId: 'ancient_sentinel' },
        { type: 'combat', monsterId: 'skeletal_archer' },
        { type: 'thieving_lockpick', id: 'sl_armory_chest_1', targetName: 'Ancient Armory Chest', lootTableId: 'thieving_dungeon_chest_high' }
    ],
    regionId: 'sunken_labyrinth',
    x: -60,
    y: 2267
},
    laby_bone_pit: {
    id: 'laby_bone_pit',
    name: 'Bone Pit',
    description: 'A deep pit in the center of this room is filled with bones of all shapes and sizes.',
    connections: ['laby_golem_hall'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 36,
    y: 2260
},
    laby_central_altar: {
    id: 'laby_central_altar',
    name: 'Altar of the Nexus',
    description: 'The heart of the labyrinth. A massive, intricately carved altar stands on a raised dais, free of the water. It pulses with a dark, corrupting energy.',
    connections: ['laby_antechamber'],
    activities: [
        { type: 'runecrafting_altar', runeId: 'nexus_rune' },
        {
            type: 'npc',
            name: 'Commune with the Altar',
            icon: 'https://api.iconify.design/game-icons:rune-stone.svg',
            questCondition: { questId: 'whispers_of_the_divine', stages: [4] },
            startNode: 'wod_nexus_echo'
        },
    ],
    regionId: 'sunken_labyrinth',
    x: -48,
    y: 2496
},
    laby_central_bridge_north: {
    id: 'laby_central_bridge_north',
    name: 'Central Bridge (North)',
    description: 'A huge chasm bisects the labyrinth. A narrow, crumbling stone bridge is the only way across.',
    connections: ['laby_offering_chamber', 'laby_central_bridge_south'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 414,
    y: 2592
},
    laby_central_bridge_south: {
    id: 'laby_central_bridge_south',
    name: 'Central Bridge (South)',
    description: 'You are on the southern side of the great chasm.',
    connections: ['laby_central_bridge_north', 'laby_hub_3'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 323,
    y: 2660
},
    laby_collapsed_passage_1: {
    id: 'laby_collapsed_passage_1',
    name: 'Collapsed Passage',
    description: 'A rockfall blocks this passage, but a smaller maintenance tunnel seems to bypass it.',
    connections: ['laby_armory_ruins', 'laby_maintenance_tunnel_1'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 136,
    y: 2472
},
    laby_colonnade_of_the_ancients: {
    id: 'laby_colonnade_of_the_ancients',
    name: 'Colonnade of the Ancients',
    description: 'A long hallway supported by massive pillars carved into the likenesses of ancient kings.',
    connections: ['laby_hub_3', 'laby_antechamber', 'laby_treasure_vault_1', 'laby_great_hall_west'],
    activities: [
        { type: 'combat', monsterId: 'labyrinth_guardian' },
        { type: 'combat', monsterId: 'labyrinth_guardian' }
    ],
    regionId: 'sunken_labyrinth',
    x: -51,
    y: 2688
},
    laby_cracked_chamber: {
    id: 'laby_cracked_chamber',
    name: 'Cracked Chamber',
    description: 'A huge crack in the floor leaks a steady stream of water. The entire room feels unstable.',
    connections: ['laby_hub_3'],
    activities: [
        { type: 'combat', monsterId: 'giant_clam' }
    ],
    regionId: 'sunken_labyrinth',
    x: 70,
    y: 2819
},
    laby_crossroads_1: {
    id: 'laby_crossroads_1',
    name: 'Algae-Covered Crossroads',
    description: 'A four-way intersection. The path is slick with a strange, glowing algae.',
    connections: ['laby_flooded_hall_1', 'laby_golem_hall', 'laby_whispering_stream', 'laby_archive_hall', 'laby_flooded_passage_east'],
    activities: [
        { type: 'combat', monsterId: 'labyrinth_guardian' }
    ],
    regionId: 'sunken_labyrinth',
    x: 231,
    y: 2022
},
    laby_crystal_cave_2: {
    id: 'laby_crystal_cave_2',
    name: 'Glimmering Cave',
    description: 'A dead-end cave where a large vein of shimmering crystal is exposed. It seems to have been mined out.',
    connections: ['laby_waterfall_chamber'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 240,
    y: 2358
},
    laby_crystal_vein_1: {
    id: 'laby_crystal_vein_1',
    name: 'Empty Cavern',
    description: 'A dead-end cave where a large vein of shimmering crystal is exposed. It seems to have been mined out long ago.',
    connections: ['laby_golem_hall'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 113,
    y: 2285
},
    laby_entrance: {
    id: 'laby_entrance',
    name: 'Sunken Labyrinth Entrance',
    description: 'A grand, moss-covered archway leads into the mountain. The air that flows out is cold and smells of wet stone and something ancient.',
    connections: ['forgotten_temple_courtyard', 'laby_flooded_hall_1'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 332,
    y: 2169
},
    laby_flooded_hall_1: {
    id: 'laby_flooded_hall_1',
    name: 'Flooded Hall',
    description: 'The entrance hall is ankle-deep in murky water. Faded murals on the walls depict serpentine creatures.',
    connections: ['laby_entrance', 'laby_crossroads_1', 'laby_armory_ruins'],
    activities: [
        { type: 'combat', monsterId: 'sunken_zombie' },
        { type: 'combat', monsterId: 'deep_lurker' }
    ],
    regionId: 'sunken_labyrinth',
    x: 0,
    y: 2000
},
    laby_flooded_intersection: {
    id: 'laby_flooded_intersection',
    name: 'Flooded Intersection',
    description: 'The passage splits here. A strong current flows from one direction.',
    connections: ['laby_flooded_passage_east', 'laby_grotto_1', 'laby_water_control_room'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 731,
    y: 2312
},
    laby_flooded_library: {
    id: 'laby_flooded_library',
    name: 'Flooded Library',
    description: 'This entire library is submerged in chest-deep water. Preserved books float like ghostly vessels.',
    connections: ['laby_sentinel_chamber_1'],
    activities: [
        { type: 'combat', monsterId: 'temple_spirit' },
        { type: 'combat', monsterId: 'temple_spirit' }
    ],
    regionId: 'sunken_labyrinth',
    x: 645,
    y: 2332
},
    laby_flooded_passage_east: {
    id: 'laby_flooded_passage_east',
    name: 'Flooded Passage',
    description: 'A long, straight corridor filled with knee-deep water.',
    connections: ['laby_crossroads_1', 'laby_flooded_intersection'],
    activities: [
        { type: 'combat', monsterId: 'deep_lurker' }
    ],
    regionId: 'sunken_labyrinth',
    x: 555,
    y: 2133
},
    laby_forgotten_tomb: {
    id: 'laby_forgotten_tomb',
    name: 'Forgotten Tomb',
    description: 'A side-chamber containing a single, unadorned sarcophagus.',
    connections: ['laby_sleeping_quarters'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 144,
    y: 2608
},
    laby_fungal_cavern: {
    id: 'laby_fungal_cavern',
    name: 'Fungal Cavern',
    description: 'This entire cave is filled with giant, glowing mushrooms.',
    connections: ['laby_whispering_stream'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 228,
    y: 2238
},
    laby_gears_room: {
    id: 'laby_gears_room',
    name: 'Room of Gears',
    description: 'Massive, silent gears of a strange metal are half-submerged in the water. They look like part of a giant, ancient machine.',
    connections: ['laby_sentinel_chamber_1', 'laby_maintenance_tunnel_1', 'laby_hub_2'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 467,
    y: 2407
},
    laby_golem_hall: {
    id: 'laby_golem_hall',
    name: 'Golem Hall',
    description: 'This long hall is lined with alcoves containing dormant, coral-encrusted golems. Some of them seem to be active.',
    connections: ['laby_crossroads_1', 'laby_crystal_vein_1', 'laby_bone_pit'],
    activities: [
        { type: 'combat', monsterId: 'abyssal_knight' },
        { type: 'combat', monsterId: 'labyrinth_guardian' }
    ],
    regionId: 'sunken_labyrinth',
    x: 92,
    y: 2188
},
    laby_great_hall_west: {
    id: 'laby_great_hall_west',
    name: 'Great Hall (West)',
    description: 'The western end of a once-magnificent hall, now collapsed and impassable to the east.',
    connections: ['laby_colonnade_of_the_ancients'],
    activities: [
        { type: 'combat', monsterId: 'coral_golem' }
    ],
    regionId: 'sunken_labyrinth',
    x: 34,
    y: 2624
},
    laby_grotto_1: {
    id: 'laby_grotto_1',
    name: 'Sunken Grotto',
    description: 'A small, beautiful grotto where glowing moss illuminates a small, clear pool.',
    connections: ['laby_flooded_intersection'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 823,
    y: 2290
},
    laby_hall_of_echoes: {
    id: 'laby_hall_of_echoes',
    name: 'Hall of Echoes',
    description: 'Every drop of water in this vast hall echoes endlessly, creating a disorienting cacophony.',
    connections: ['laby_hub_3', 'laby_lurker_spawning_pool', 'laby_murky_pool'],
    activities: [
        { type: 'combat', monsterId: 'temple_spirit' },
        { type: 'combat', monsterId: 'temple_spirit' }
    ],
    regionId: 'sunken_labyrinth',
    x: 358,
    y: 2830
},
    laby_hidden_passage: {
    id: 'laby_hidden_passage',
    name: 'Hidden Passage',
    description: 'A narrow crack in the wall leads to this tight, secret passage.',
    connections: ['laby_archive_hall', 'laby_treasure_vault_2'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 483,
    y: 2175
},
    laby_hub_2: {
    id: 'laby_hub_2',
    name: 'Second Hub',
    description: 'Another large, central chamber. The water is deeper here, and the architecture more ornate.',
    connections: ['laby_gears_room', 'laby_waterfall_chamber', 'laby_offering_chamber', 'laby_sleeping_quarters', 'laby_water_control_room'],
    activities: [
        { type: 'combat', monsterId: 'abyssal_knight' },
        { type: 'combat', monsterId: 'abyssal_knight' }
    ],
    regionId: 'sunken_labyrinth',
    x: 389,
    y: 2362
},
    laby_hub_3: {
    id: 'laby_hub_3',
    name: 'Third Hub',
    description: 'The air is noticeably colder here. The architecture is grander, suggesting you are approaching an important area.',
    connections: ['laby_central_bridge_south', 'laby_hall_of_echoes', 'laby_colonnade_of_the_ancients', 'laby_cracked_chamber', 'laby_spiral_staircase'],
    activities: [
        { type: 'combat', monsterId: 'abyssal_knight' },
        { type: 'combat', monsterId: 'grave_revenant' }
    ],
    regionId: 'sunken_labyrinth',
    x: 207,
    y: 2697
},
    laby_kitchen_ruins: {
    id: 'laby_kitchen_ruins',
    name: 'Kitchen Ruins',
    description: 'This chamber contains the remains of ancient cooking hearths and stone tables.',
    connections: ['laby_sleeping_quarters'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 230,
    y: 2612
},
    laby_lurker_nest: {
    id: 'laby_lurker_nest',
    name: 'Lurker Nest',
    description: 'A foul-smelling cavern littered with fish bones and other remains. This is clearly a nest.',
    connections: ['laby_whispering_stream'],
    activities: [
        { type: 'combat', monsterId: 'abyssal_leech' },
        { type: 'combat', monsterId: 'abyssal_leech' },
        { type: 'combat', monsterId: 'abyssal_leech' }
    ],
    regionId: 'sunken_labyrinth',
    x: 343,
    y: 2244
},
    laby_lurker_spawning_pool: {
    id: 'laby_lurker_spawning_pool',
    name: 'Spawning Pool',
    description: 'A large, dark pool in this dead-end chamber is writhing with nascent Deep Lurkers.',
    connections: ['laby_hall_of_echoes'],
    activities: [
        { type: 'combat', monsterId: 'deep_lurker' },
        { type: 'combat', monsterId: 'deep_lurker' },
        { type: 'combat', monsterId: 'deep_lurker' }
    ],
    regionId: 'sunken_labyrinth',
    x: 359,
    y: 2889
},
    laby_maintenance_tunnel_1: {
    id: 'laby_maintenance_tunnel_1',
    name: 'Maintenance Tunnel',
    description: 'A narrow, cramped tunnel that seems to run alongside the larger chambers.',
    connections: ['laby_gears_room', 'laby_collapsed_passage_1'],
    activities: [
        { type: 'combat', monsterId: 'deep_lurker' }
    ],
    regionId: 'sunken_labyrinth',
    x: 366,
    y: 2463
},
    laby_meditation_chamber: {
    id: 'laby_meditation_chamber',
    name: 'Meditation Chamber',
    description: 'A small, quiet room that seems to absorb all sound. It feels peaceful.',
    connections: ['laby_sleeping_quarters'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 301,
    y: 2525
},
    laby_murky_pool: {
    id: 'laby_murky_pool',
    name: 'Murky Pool',
    description: 'A deep, dark pool fills this dead-end chamber. Something might be hiding in its depths.',
    connections: ['laby_hall_of_echoes'],
    activities: [
        { type: 'combat', monsterId: 'deep_lurker' }
    ],
    regionId: 'sunken_labyrinth',
    x: 423,
    y: 2829
},
    laby_offering_chamber: {
    id: 'laby_offering_chamber',
    name: 'Offering Chamber',
    description: 'A circular room with a deep, dark pool in the center. Gold and other treasures lie at the bottom, just out of reach.',
    connections: ['laby_hub_2', 'laby_central_bridge_north'],
    activities: [
        { type: 'combat', monsterId: 'hydra_hatchling' },
        { type: 'combat', monsterId: 'hydra_hatchling' }
    ],
    regionId: 'sunken_labyrinth',
    x: 433,
    y: 2510
},
    laby_scriptorium: {
    id: 'laby_scriptorium',
    name: 'The Scriptorium',
    description: 'A chamber with stone podiums, likely for scribes. A large, intact tablet in the center tells a fragment of a story about a forgotten sea god.',
    connections: ['laby_archive_hall'],
    activities: [
        { type: 'thieving_lockpick', id: 'sl_scriptorium_chest_1', targetName: 'Scribe\'s Footlocker', lootTableId: 'thieving_dungeon_chest_high' }
    ],
    regionId: 'sunken_labyrinth',
    x: 591,
    y: 2287
},
    laby_sentinel_chamber_1: {
    id: 'laby_sentinel_chamber_1',
    name: 'Sentinel Chamber',
    description: 'A powerful sentinel guards this intersection, its glowing eyes fixed on you.',
    connections: ['laby_archive_hall', 'laby_flooded_library', 'laby_gears_room'],
    activities: [
        { type: 'combat', monsterId: 'ancient_sentinel' },
        { type: 'combat', monsterId: 'gloom_weaver' }
    ],
    regionId: 'sunken_labyrinth',
    x: 461,
    y: 2322
},
    laby_sleeping_quarters: {
    id: 'laby_sleeping_quarters',
    name: 'Sleeping Quarters',
    description: 'Rows of stone beds line this long chamber. It is eerily silent.',
    connections: ['laby_hub_2', 'laby_storage_room', 'laby_forgotten_tomb', 'laby_meditation_chamber', 'laby_kitchen_ruins'],
    activities: [
        { type: 'combat', monsterId: 'grave_revenant' }
    ],
    regionId: 'sunken_labyrinth',
    x: 223,
    y: 2526
},
    laby_spiral_staircase: {
    id: 'laby_spiral_staircase',
    name: 'Spiral Staircase',
    description: 'A stone staircase spirals down into darkness. It ends in a flooded dead-end.',
    connections: ['laby_hub_3'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 202,
    y: 2844
},
    laby_storage_room: {
    id: 'laby_storage_room',
    name: 'Storage Room',
    description: 'Shattered urns and rotted crates are all that remain in this old storage room.',
    connections: ['laby_sleeping_quarters'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 125,
    y: 2528
},
    laby_treasure_vault_1: {
    id: 'laby_treasure_vault_1',
    name: 'Treasure Vault',
    description: 'This side chamber appears to have been a vault, though it has been mostly picked clean. An old chest remains.',
    connections: ['laby_colonnade_of_the_ancients'],
    activities: [
        { type: 'thieving_lockpick', id: 'sl_vault_chest_1', targetName: 'Looted Treasure Chest', lootTableId: 'thieving_dungeon_chest_high' }
    ],
    regionId: 'sunken_labyrinth',
    x: -147,
    y: 2625
},
    laby_treasure_vault_2: {
    id: 'laby_treasure_vault_2',
    name: 'Secret Vault',
    description: 'A hidden vault! It seems undisturbed. A single, ornate chest sits in the middle of the room.',
    connections: ['laby_hidden_passage'],
    activities: [
        { type: 'thieving_lockpick', id: 'sl_secret_vault_chest_1', targetName: 'Pristine Treasure Chest', lootTableId: 'thieving_dungeon_chest_elite' }
    ],
    regionId: 'sunken_labyrinth',
    x: 541,
    y: 2232
},
    laby_water_control_room: {
    id: 'laby_water_control_room',
    name: 'Water Control',
    description: 'A room filled with immense, rusted levers and valves, all frozen in place.',
    connections: ['laby_flooded_intersection', 'laby_hub_2'],
    activities: [
        { type: 'combat', monsterId: 'ancient_sentinel' }
    ],
    regionId: 'sunken_labyrinth',
    x: 598,
    y: 2369
},
    laby_waterfall_chamber: {
    id: 'laby_waterfall_chamber',
    name: 'Waterfall Chamber',
    description: 'Water cascades from a hole in the ceiling, creating a deafening roar and a thick mist.',
    connections: ['laby_whispering_stream', 'laby_hub_2', 'laby_crystal_cave_2'],
    activities: [],
    regionId: 'sunken_labyrinth',
    x: 277,
    y: 2271
},
    laby_whispering_stream: {
    id: 'laby_whispering_stream',
    name: 'Whispering Stream',
    description: 'An underground stream flows through this passage. Faint, incoherent whispers seem to echo from the water.',
    connections: ['laby_crossroads_1', 'laby_lurker_nest', 'laby_waterfall_chamber', 'laby_fungal_cavern'],
    activities: [
        { type: 'combat', monsterId: 'water_weird' }
    ],
    regionId: 'sunken_labyrinth',
    x: 280,
    y: 2234
}
};
