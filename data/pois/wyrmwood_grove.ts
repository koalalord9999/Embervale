
import { POI } from '../../types';

export const wyrmwoodGrovePois: Record<string, POI> = {
    wyrmwood_grove_entrance: {
        id: 'wyrmwood_grove_entrance',
        name: 'Wyrmwood Grove Entrance',
        description: 'The edge of an ancient forest. The trees here are unnaturally large, their branches twisting together to form a dense canopy. The path splits to the north and south.',
        connections: ['sanctity_east_gate', 'wg_southern_path_1', 'wg_northern_path_1'],
        activities: [
            {
                type: 'npc',
                name: 'Fenris',
                icon: 'https://api.iconify.design/game-icons:hood.svg',
                startNode: 'fenris_default',
                questTopics: ['the_great_hunt'],
            }
        ],
        regionId: 'wyrmwood_grove',
        x: 1700, y: 1500,
    },
    // --- Southern Branch (The Road) ---
    wg_southern_path_1: { id: 'wg_southern_path_1', name: 'Southern Path', description: 'This path seems more traveled, likely a trade or patrol route.', connections: ['wyrmwood_grove_entrance', 'wg_travelers_shrine'], activities: [{ type: 'combat', monsterId: 'shadow_cat' }], regionId: 'wyrmwood_grove', x: 1710, y: 1540 },
    wg_travelers_shrine: { id: 'wg_travelers_shrine', name: 'Traveler\'s Shrine', description: 'A small, weathered shrine to the god of journeys stands by the path.', connections: ['wg_southern_path_1', 'wg_southern_fork'], activities: [{ type: 'combat', monsterId: 'wispwood_spirit' }], regionId: 'wyrmwood_grove', x: 1760, y: 1510 },
    wg_southern_fork: { id: 'wg_southern_fork', name: 'Southern Fork', description: 'The path splits. The main road continues east, while a smaller hunter\'s path leads southeast.', connections: ['wg_travelers_shrine', 'wg_old_road_1', 'wg_hunters_path'], activities: [{ type: 'combat', monsterId: 'timid_dryad' }], regionId: 'wyrmwood_grove', x: 1790, y: 1515 },
    wg_old_road_1: { id: 'wg_old_road_1', name: 'Old Road', description: 'An old, cobbled road, now mostly overgrown.', connections: ['wg_southern_fork', 'wg_old_road_2'], activities: [], regionId: 'wyrmwood_grove', x: 1820, y: 1515 },
    wg_old_road_2: { id: 'wg_old_road_2', name: 'Old Road Crossing', description: 'The road crosses a small stream here. Another path joins from the south.', connections: ['wg_old_road_1', 'wg_old_road_3', 'wg_hunters_camp'], activities: [{ type: 'combat', monsterId: 'shadow_cat' }], regionId: 'wyrmwood_grove', x: 1850, y: 1510 },
    wg_old_road_3: { id: 'wg_old_road_3', name: 'Roadside Ruins', description: 'The crumbling remains of an old watchtower stand by the road.', connections: ['wg_old_road_2', 'wg_road_to_east'], activities: [{ type: 'combat', monsterId: 'bramble_lurker' }], regionId: 'wyrmwood_grove', x: 1880, y: 1505 },
    wg_road_to_east: { id: 'wg_road_to_east', name: 'Road to the East', description: 'The road continues east, leading towards distant, unknown lands.', connections: ['wg_old_road_3'], activities: [], regionId: 'wyrmwood_grove', x: 1910, y: 1505 },
    wg_hunters_path: { id: 'wg_hunters_path', name: 'Hunter\'s Path', description: 'A smaller path, marked by animal tracks.', connections: ['wg_southern_fork', 'wg_boar_clearing'], activities: [{ type: 'combat', monsterId: 'feywood_stalker' }], regionId: 'wyrmwood_grove', x: 1800, y: 1545 },
    wg_boar_clearing: { id: 'wg_boar_clearing', name: 'Boar Clearing', description: 'A small clearing where the ground is torn up by wild boars.', connections: ['wg_hunters_path', 'wg_hunters_camp', 'wg_river_crossing'], activities: [{ type: 'combat', monsterId: 'enchanted_boar' }], regionId: 'wyrmwood_grove', x: 1830, y: 1550 },
    wg_hunters_camp: { id: 'wg_hunters_camp', name: 'Hunter\'s Camp', description: 'A small, well-used campsite with a fire pit and tanning rack.', connections: ['wg_boar_clearing', 'wg_old_road_2', 'wg_abandoned_cabin'], activities: [], regionId: 'wyrmwood_grove', x: 1850, y: 1540 },
    wg_abandoned_cabin: { id: 'wg_abandoned_cabin', name: 'Abandoned Cabin', description: 'A dilapidated wooden cabin, slowly being reclaimed by the forest.', connections: ['wg_hunters_camp'], activities: [{ type: 'combat', monsterId: 'bramble_lurker' }], regionId: 'wyrmwood_grove', x: 1880, y: 1545 },
    wg_river_crossing: { id: 'wg_river_crossing', name: 'River Crossing', description: 'A shallow ford allows crossing of a small river.', connections: ['wg_boar_clearing', 'wg_riverbank_east'], activities: [], regionId: 'wyrmwood_grove', x: 1835, y: 1580 },
    wg_riverbank_east: { id: 'wg_riverbank_east', name: 'East Riverbank', description: 'The eastern bank of the river. The path ends here.', connections: ['wg_river_crossing'], activities: [{ type: 'combat', monsterId: 'timid_dryad' }], regionId: 'wyrmwood_grove', x: 1865, y: 1580 },
    
    // --- NORTHERN BRANCH (The Grove) ---
    wg_northern_path_1: { id: 'wg_northern_path_1', name: 'Northern Path', description: 'This path leads deeper into the heart of the ancient grove.', connections: ['wyrmwood_grove_entrance', 'wg_ancient_grove'], activities: [{ type: 'combat', monsterId: 'corrupted_treant' }], regionId: 'wyrmwood_grove', x: 1710, y: 1470 },
    wg_ancient_grove: { id: 'wg_ancient_grove', name: 'Ancient Grove', description: 'The trees here are massive and ancient. A profound silence fills the air.', connections: ['wg_northern_path_1', 'wg_deepwood_crossroads'], activities: [{ type: 'combat', monsterId: 'raging_bear' }, { type: 'start_agility_course', name: 'Start Treetop Run (Lvl 75)', courseId: 'wyrmwood_treetop_run' }], regionId: 'wyrmwood_grove', x: 1760, y: 1485 },
    wg_deepwood_crossroads: { id: 'wg_deepwood_crossroads', name: 'Deepwood Crossroads', description: 'A central clearing in the grove. Paths branch off in multiple directions.', connections: ['wg_ancient_grove', 'wg_mossy_clearing', 'wg_tangled_thicket', 'wg_whispering_stream_1'], activities: [{ type: 'combat', monsterId: 'blighted_wolf' }], regionId: 'wyrmwood_grove', x: 1790, y: 1480 },
    wg_mossy_clearing: { id: 'wg_mossy_clearing', name: 'Mossy Clearing', description: 'A clearing carpeted in thick, soft moss.', connections: ['wg_deepwood_crossroads', 'wg_glowing_cave_entrance', 'wg_elderwood_grove'], activities: [{ type: 'combat', monsterId: 'elder_grove_spirit' }], regionId: 'wyrmwood_grove', x: 1820, y: 1475 },
    wg_glowing_cave_entrance: { id: 'wg_glowing_cave_entrance', name: 'Glowing Cave Entrance', description: 'A cave from which a faint, pulsing light emanates.', connections: ['wg_mossy_clearing', 'wg_glowing_cave_inner'], activities: [], regionId: 'wyrmwood_grove', x: 1850, y: 1470 },
    wg_glowing_cave_inner: { id: 'wg_glowing_cave_inner', name: 'Inner Glowing Cave', description: 'The cave walls are covered in glowing fungi and crystals.', connections: ['wg_glowing_cave_entrance'], activities: [{ type: 'combat', monsterId: 'wyrmwood_guardian' }], regionId: 'wyrmwood_grove', x: 1880, y: 1465 },
    wg_tangled_thicket: { id: 'wg_tangled_thicket', name: 'Tangled Thicket', description: 'A dense thicket of thorny vines and twisted roots.', connections: ['wg_deepwood_crossroads', 'wg_dragon_lair_approach', 'wg_ancient_yew_grove', 'wg_thorn_maze'], activities: [{ type: 'combat', monsterId: 'thorned_beast' }], regionId: 'wyrmwood_grove', x: 1795, y: 1450 },
    wg_dragon_lair_approach: { id: 'wg_dragon_lair_approach', name: 'Dragon Lair Approach', description: 'The path is littered with scorched bones and massive scales.', connections: ['wg_tangled_thicket', 'wg_young_dragon_lair'], activities: [{ type: 'combat', monsterId: 'feral_dragonling' }], regionId: 'wyrmwood_grove', x: 1825, y: 1445 },
    wg_young_dragon_lair: { id: 'wg_young_dragon_lair', name: 'Young Dragon Lair', description: 'A large clearing dominated by a young, but still formidable, Grove Dragon.', connections: ['wg_dragon_lair_approach', 'wg_dragon_peak'], activities: [{ type: 'combat', monsterId: 'grove_dragon' }], regionId: 'wyrmwood_grove', x: 1855, y: 1440 },
    wg_dragon_peak: { id: 'wg_dragon_peak', name: 'Dragon Peak', description: 'A high point in the grove offering a view over the canopy.', connections: ['wg_young_dragon_lair', 'wg_ancient_yew_grove'], activities: [{ type: 'combat', monsterId: 'corrupted_grove_dragon' }], regionId: 'wyrmwood_grove', x: 1885, y: 1435 },
    wg_ancient_yew_grove: { id: 'wg_ancient_yew_grove', name: 'Ancient Yew Grove', description: 'A secluded grove of ancient, gnarled Yew trees.', connections: ['wg_dragon_peak', 'wg_tangled_thicket'], activities: [{ type: 'combat', monsterId: 'corrupted_treant' }], regionId: 'wyrmwood_grove', x: 1825, y: 1420 },
    wg_whispering_stream_1: { id: 'wg_whispering_stream_1', name: 'Whispering Stream', description: 'A clear stream flows north. The sound of the water sounds like faint whispers.', connections: ['wg_deepwood_crossroads', 'wg_whispering_stream_2'], activities: [], regionId: 'wyrmwood_grove', x: 1770, y: 1440 },
    wg_whispering_stream_2: { id: 'wg_whispering_stream_2', name: 'Stream Fork', description: 'The stream forks here, with one path leading to a waterfall.', connections: ['wg_whispering_stream_1', 'wg_waterfall_cave', 'wg_stream_bend'], activities: [{ type: 'combat', monsterId: 'deepwood_horror' }], regionId: 'wyrmwood_grove', x: 1780, y: 1390 },
    wg_waterfall_cave: { id: 'wg_waterfall_cave', name: 'Waterfall Cave', description: 'A small cave hidden behind a curtain of falling water.', connections: ['wg_whispering_stream_2', 'wg_elemental_shrine'], activities: [], regionId: 'wyrmwood_grove', x: 1750, y: 1385 },
    wg_elemental_shrine: { id: 'wg_elemental_shrine', name: 'Elemental Shrine', description: 'A hidden shrine dedicated to the spirits of the forest.', connections: ['wg_waterfall_cave'], activities: [{ type: 'combat', monsterId: 'elder_grove_spirit' }], regionId: 'wyrmwood_grove', x: 1720, y: 1380 },
    wg_stream_bend: { id: 'wg_stream_bend', name: 'Stream Bend', description: 'The stream bends sharply eastwards.', connections: ['wg_whispering_stream_2', 'wg_ancient_ruins_1'], activities: [], regionId: 'wyrmwood_grove', x: 1810, y: 1385 },
    wg_ancient_ruins_1: { id: 'wg_ancient_ruins_1', name: 'Ancient Ruins', description: 'The crumbling stone foundations of an ancient structure.', connections: ['wg_stream_bend', 'wg_ancient_ruins_2'], activities: [{ type: 'combat', monsterId: 'wyrmwood_guardian' }], regionId: 'wyrmwood_grove', x: 1840, y: 1380 },
    wg_ancient_ruins_2: { id: 'wg_ancient_ruins_2', name: 'Ruined Courtyard', description: 'A forgotten courtyard, now overgrown with moss and vines.', connections: ['wg_ancient_ruins_1'], activities: [{ type: 'combat', monsterId: 'corrupted_unicorn' }], regionId: 'wyrmwood_grove', x: 1870, y: 1375 },
    wg_elderwood_grove: { id: 'wg_elderwood_grove', name: 'Elderwood Grove', description: 'The trees here are even larger and more ancient. The air is heavy with magic.', connections: ['wg_mossy_clearing', 'wg_heart_of_the_grove'], activities: [{ type: 'combat', monsterId: 'elder_grove_spirit' }], regionId: 'wyrmwood_grove', x: 1850, y: 1500 },
    wg_heart_of_the_grove: { id: 'wg_heart_of_the_grove', name: 'Heart of the Grove', description: 'The very center of the Wyrmwood. A colossal, glowing tree pulses with life.', connections: ['wg_elderwood_grove', 'wg_grove_altar'], activities: [{ type: 'combat', monsterId: 'wyrmwood_guardian' }], regionId: 'wyrmwood_grove', x: 1880, y: 1500 },
    wg_grove_altar: { id: 'wg_grove_altar', name: 'Grove Altar', description: 'A living altar of intertwined roots at the base of the heart-tree.', connections: ['wg_heart_of_the_grove'], activities: [], regionId: 'wyrmwood_grove', x: 1910, y: 1500 },
    
    // Additional Northern POIs to reach ~30
    wg_thorn_maze: { id: 'wg_thorn_maze', name: 'Thorn Maze', description: 'A confusing maze of thorny vines.', connections: ['wg_tangled_thicket', 'wg_secluded_clearing'], activities: [{ type: 'combat', monsterId: 'thorned_beast' }], regionId: 'wyrmwood_grove', x: 1765, y: 1445 },
    wg_secluded_clearing: { 
        id: 'wg_secluded_clearing', 
        name: 'Secluded Clearing', 
        description: 'A small, hidden clearing. It feels strangely peaceful. A reclusive woman tends a small herb garden here.', 
        connections: ['wg_thorn_maze'], 
        activities: [
            {
                type: 'npc',
                name: 'Sister Seraphina',
                icon: 'https://api.iconify.design/game-icons:woman-elf-face.svg',
                startNode: 'seraphina_default',
                questTopics: ['the_saints_first_step'],
                conditionalGreetings: [
                    { text: "The chapel sent you about the oil, I presume?", check: { requirements: [{ type: 'quest', questId: 'the_saints_first_step', status: 'in_progress', stage: 3 }] } },
                    { text: "Have you gathered the herbs?", check: { requirements: [{ type: 'quest', questId: 'the_saints_first_step', status: 'in_progress', stage: 4 }] } },
                ]
            }
        ], 
        regionId: 'wyrmwood_grove', 
        x: 1735, 
        y: 1440 
    },
    wg_dragonling_nest: { id: 'wg_dragonling_nest', name: 'Dragonling Nest', description: 'A nest of young, playful but dangerous, Grove Dragonlings.', connections: ['wg_dragon_lair_approach'], activities: [{ type: 'combat', monsterId: 'feral_dragonling' }, { type: 'combat', monsterId: 'feral_dragonling' }], regionId: 'wyrmwood_grove', x: 1830, y: 1475 },
    wg_overlook_point: { id: 'wg_overlook_point', name: 'Overlook Point', description: 'A cliff offering a wide view of the southern plains.', connections: ['wg_ancient_yew_grove'], activities: [], regionId: 'wyrmwood_grove', x: 1855, y: 1415 },
    wg_forgotten_statue: { id: 'wg_forgotten_statue', name: 'Forgotten Statue', description: 'A moss-covered statue of an unknown deity.', connections: ['wg_stream_bend'], activities: [], regionId: 'wyrmwood_grove', x: 1815, y: 1415 },
    wg_deepwood_spring: { id: 'wg_deepwood_spring', name: 'Deepwood Spring', description: 'A spring of pure, clean water bubbles up from the ground.', connections: ['wg_whispering_stream_1'], activities: [{ type: 'combat', monsterId: 'blighted_wolf' }], regionId: 'wyrmwood_grove', x: 1755, y: 1425 },
    wg_sunken_path: { id: 'wg_sunken_path', name: 'Sunken Path', description: 'An old path that has sunk into the soft earth.', connections: ['wg_ancient_grove'], activities: [{ type: 'combat', monsterId: 'deepwood_horror' }], regionId: 'wyrmwood_grove', x: 1765, y: 1515 },
    wg_elder_circle: { id: 'wg_elder_circle', name: 'Elder Circle', description: 'A circle of ancient, mossy stones.', connections: ['wg_elderwood_grove'], activities: [{ type: 'combat', monsterId: 'corrupted_unicorn' }], regionId: 'wyrmwood_grove', x: 1855, y: 1530 },
    wg_root_cavern: { id: 'wg_root_cavern', name: 'Root Cavern', description: 'A cavern formed by the massive roots of the elder trees.', connections: ['wg_elder_circle'], activities: [{ type: 'combat', monsterId: 'raging_bear' }], regionId: 'wyrmwood_grove', x: 1885, y: 1535 },
    wg_hunters_blind: {
        id: 'wg_hunters_blind',
        name: "Hunter's Blind",
        description: 'A well-concealed hunter\'s blind, offering a perfect vantage point over the ancient grove. A good place to lay a trap.',
        connections: ['wg_deepwood_crossroads'],
        activities: [],
        regionId: 'wyrmwood_grove',
        x: 1790, y: 1460,
    },
};
