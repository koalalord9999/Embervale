
import { POI, SkillName } from '../../types';

export const saltFlatsPois: Record<string, POI> = {
    bleached_expanse: {
    id: 'bleached_expanse',
    name: 'Bleached Expanse',
    description: 'A vast, flat expanse of sun-bleached salt. The glare is intense.',
    connections: ['salt_flats_entrance', 'skeletal_remains', 'salt_leaper_colony'],
    activities: [
        { type: 'combat', monsterId: 'salt_preserved_vulture' },
        { type: 'combat', monsterId: 'sand_scrabbler' },
        { type: 'cut_cactus', id: 'bleached_expanse_cactus_1', name: 'Cut Cactus' },
    ],
    regionId: 'salt_flats',
    x: 392,
    y: 1846
},
    brine_geyser: {
    id: 'brine_geyser',
    name: 'Brine Geyser',
    description: 'A hissing geyser periodically erupts, spraying hot, salty water into the air. The deposits left behind are rich in minerals.',
    connections: ['saline_pools', 'crystal_flats'],
    activities: [
        { type: 'skilling', id: 'salt_flats_brine_crystal_1', name: 'Mine Brine Crystal', skill: SkillName.Mining, requiredLevel: 45, loot: [{ itemId: 'brine_crystal', chance: 1, xp: 70 }], resourceCount: { min: 1, max: 2 }, respawnTime: 40000, gatherTime: 3500 }
    ],
    regionId: 'salt_flats',
    x: 601,
    y: 1612
},
    brinehollow_outpost: {
    id: 'brinehollow_outpost',
    name: 'Brinehollow Outpost',
    description: 'A tiny, ramshackle settlement huddled around a freshwater spring. It is a pitiful but welcome sight.',
    connections: ['brinehollow_outpost_path', 'the_crystal_veins'],
    activities: [
        { type: 'bank' },
        { type: 'water_source', name: 'Collect Water' },
        { type: 'npc', name: 'Old Salt', icon: '/assets/npcChatHeads/old_man_hemlock.png', pickpocket: { lootTableId: 'pickpocket_craftsman_table' }, dialogue: { start: { npcName: 'Old Salt', npcIcon: '/assets/npcChatHeads/old_man_hemlock.png', text: 'Don\'t stay out in the sun too long, newcomer. The flats\'ll bake you dry.', responses: [] } }, startNode: 'start' }
    ],
    regionId: 'salt_flats',
    x: 492,
    y: 1398
},
    brinehollow_outpost_path: {
    id: 'brinehollow_outpost_path',
    name: 'Outpost Path',
    description: 'A faint path marked by cairns leads through the salt flats towards a small settlement.',
    connections: ['scuttler_hunting_grounds', 'mirage_point', 'brinehollow_outpost'],
    activities: [
        { type: 'combat', monsterId: 'salt_flat_skitterer' }
    ],
    regionId: 'salt_flats',
    x: 529,
    y: 1429
},
    cracked_earth: {
    id: 'cracked_earth',
    name: 'Cracked Earth',
    description: 'The ground here is a mosaic of deep, dry cracks. It feels like the whole area could crumble beneath your feet.',
    connections: ['wind-scoured_mesa', 'scuttler_hunting_grounds'],
    activities: [
        { type: 'combat', monsterId: 'sand_scrabbler' },
        { type: 'combat', monsterId: 'sand_scrabbler' },
        { type: 'cut_cactus', id: 'cracked_earth_cactus_1', name: 'Cut Cactus' },
    ],
    regionId: 'salt_flats',
    x: 290,
    y: 1614
},
    crystal_flats: {
    id: 'crystal_flats',
    name: 'Crystal Flats',
    description: 'The salt gives way to a plain of razor-sharp, naturally formed crystals.',
    connections: ['brine_geyser', 'sunken_shipwreck'],
    activities: [
        { type: 'combat', monsterId: 'brine_elemental' },
        { type: 'combat', monsterId: 'salt_cryst_golem' }
    ],
    regionId: 'salt_flats',
    x: 662,
    y: 1507
},
    crystal_spires: {
    id: 'crystal_spires',
    name: 'The Crystal Spires',
    description: 'Enormous, perfectly-formed crystal spires rise from the ground, creating a forest of light and shadow.',
    connections: ['salt_lake_crossing'],
    activities: [
        { type: 'combat', monsterId: 'brine_elemental' },
        { type: 'combat', monsterId: 'crystal_scuttler' },
        { type: 'combat', monsterId: 'mirage_weaver' }
    ],
    regionId: 'salt_flats',
    x: 162,
    y: 1441
},
    mirage_point: {
    id: 'mirage_point',
    name: 'Mirage Point',
    description: 'The heat haze is intense here, creating shimmering mirages on the horizon. It\'s easy to get disoriented.',
    connections: ['sunken_shipwreck', 'brinehollow_outpost_path'],
    activities: [
        { type: 'combat', monsterId: 'mirage_weaver' }
    ],
    regionId: 'salt_flats',
    x: 592,
    y: 1375
},
    saline_pools: {
    id: 'saline_pools',
    name: 'Saline Pools',
    description: 'Shallow pools of super-salinated water dot the landscape. Strange, crystalline structures grow at their edges.',
    connections: ['salt_flats_entrance', 'brine_geyser'],
    activities: [
        { type: 'combat', monsterId: 'brine_elemental' },
        { type: 'combat', monsterId: 'crystalline_tortoise' },
        { type: 'skilling', id: 'salt_flats_rock_salt_1', name: 'Mine Rock Salt', skill: SkillName.Mining, requiredLevel: 25, loot: [{ itemId: 'rock_salt', chance: 1, xp: 25 }], resourceCount: { min: 2, max: 5 }, respawnTime: 10000, gatherTime: 2800 },
        { type: 'cut_cactus', id: 'saline_pools_cactus_1', name: 'Cut Cactus' },
    ],
    regionId: 'salt_flats',
    x: 529,
    y: 1708
},
    salt_flats_entrance: {
    id: 'salt_flats_entrance',
    name: 'Salt Flats Entrance',
    description: 'The ground here is cracked and white with salt. The vegetation is sparse, consisting of hardy, salt-tolerant shrubs.',
    connections: ['silver_river_crossing', 'bleached_expanse', 'saline_pools'],
    activities: [
        { type: 'combat', monsterId: 'salt_leaper' },
        { type: 'combat', monsterId: 'salt_flat_skitterer' }
    ],
    regionId: 'salt_flats',
    x: 490,
    y: 1840
},
    salt_flats_northwest_passage: {
    id: 'salt_flats_northwest_passage',
    name: 'Northwest Passage',
    description: 'A path worn into the salt leads northwest, towards the faint silhouette of a settlement on the horizon.',
    connections: ['wind-scoured_mesa', 'fouthia_southeast_gate', 'whispering_canyon_path_2'],
    activities: [
        { type: 'combat', monsterId: 'sand_scrabbler' }
    ],
    regionId: 'salt_flats',
    x: 52,
    y: 1364
},
    salt_lake_crossing: {
    id: 'salt_lake_crossing',
    name: 'Salt Lake Crossing',
    description: 'A natural bridge of solid salt crosses the lake here.',
    connections: ['salt_lake_shore', 'crystal_spires'],
    activities: [],
    regionId: 'salt_flats',
    x: 276,
    y: 1422
},
    salt_lake_shore: {
    id: 'salt_lake_shore',
    name: 'Salt Lake Shore',
    description: 'The shore of a vast, underground salt lake. The water is perfectly still and reflects the glowing crystals above like stars.',
    connections: ['the_crystal_veins', 'salt_lake_crossing'],
    activities: [
        { type: 'combat', monsterId: 'brine_elemental' }
    ],
    regionId: 'salt_flats',
    x: 387,
    y: 1444
},
    salt_leaper_colony: {
    id: 'salt_leaper_colony',
    name: 'Salt Leaper Colony',
    description: 'The ground is pockmarked with burrows from which agitated, crustacean-like creatures emerge.',
    connections: ['bleached_expanse'],
    activities: [
        { type: 'combat', monsterId: 'salt_leaper' },
        { type: 'combat', monsterId: 'salt_leaper' },
        { type: 'combat', monsterId: 'salt_leaper' }
    ],
    regionId: 'salt_flats',
    x: 372,
    y: 1706
},
    scuttler_hunting_grounds: {
    id: 'scuttler_hunting_grounds',
    name: 'Scuttler Hunting Grounds',
    description: 'Large, crystalline scorpions prowl this area, their shells glinting in the harsh sunlight.',
    connections: ['cracked_earth', 'brinehollow_outpost_path', 'whispering_canyon_entrance'],
    activities: [
        { type: 'combat', monsterId: 'crystal_scuttler' },
        { type: 'cut_cactus', id: 'scuttler_hunting_cactus_1', name: 'Cut Cactus' },
    ],
    regionId: 'salt_flats',
    x: 390,
    y: 1598
},
    silver_river_crossing: {
    id: 'silver_river_crossing',
    name: 'Silver River Crossing',
    description: 'A sturdy, wooden bridge spans the wide, fast-flowing Silver River. The air on the far side is noticeably drier and carries the tang of salt.',
    connections: ['silverhaven_outskirts', 'salt_flats_entrance'],
    activities: [],
    regionId: 'wilderness',
    x: 567,
    y: 1793
},
    skeletal_remains: {
        id: 'skeletal_remains',
        name: 'Skeletal Remains',
        description: 'The perfectly preserved skeleton of some enormous, unknown beast lies half-buried in the salt.',
        connections: ['bleached_expanse', 'wind-scoured_mesa'],
        activities: [
            { type: 'combat', monsterId: 'salt_leaper' },
            { type: 'combat', monsterId: 'salt_preserved_vulture' },
            { type: 'thieving_lockpick', id: 'sf_chest_1', targetName: 'Weathered Pack', lootTableId: 'thieving_dungeon_chest_mid' },
            { type: 'start_agility_course', name: 'Start Skeleton Run (Lvl 30)', courseId: 'salt_flats_skeleton_run' }
        ],
        regionId: 'salt_flats',
        x: 273,
        y: 1757
    },
    sunken_shipwreck: {
    id: 'sunken_shipwreck',
    name: 'Sunken Shipwreck',
    description: 'The ghostly outline of a ship\'s hull is visible beneath the salt, a relic from when this was an ancient sea.',
    connections: ['crystal_flats', 'mirage_point'],
    activities: [
        { type: 'combat', monsterId: 'brine_elemental' },
        { type: 'combat', monsterId: 'brine_elemental' },
        { type: 'combat', monsterId: 'salt_wraith' },
        { type: 'thieving_lockpick', id: 'sf_chest_2', targetName: 'Salt-Encrusted Chest', lootTableId: 'thieving_dungeon_chest_mid' }
    ],
    regionId: 'salt_flats',
    x: 669,
    y: 1416
},
    the_crystal_veins: {
    id: 'the_crystal_veins',
    name: 'The Crystal Veins',
    description: 'The walls of this cave are crisscrossed with thick veins of brine crystals.',
    connections: ['brinehollow_outpost', 'the_great_salt_pillar', 'salt_lake_shore'],
    activities: [
        { type: 'skilling', id: 'salt_flats_brine_crystal_2', name: 'Mine Brine Crystal Vein', skill: SkillName.Mining, requiredLevel: 45, loot: [{ itemId: 'brine_crystal', chance: 1, xp: 70 }], resourceCount: { min: 3, max: 8 }, respawnTime: 50000, gatherTime: 3500 },
        { type: 'combat', monsterId: 'crystal_scuttler' },
        { type: 'combat', monsterId: 'crystalline_tortoise' }
    ],
    regionId: 'salt_flats',
    x: 454,
    y: 1374
},
    the_great_salt_pillar: {
    id: 'the_great_salt_pillar',
    name: 'The Great Salt Pillar',
    description: 'A colossal pillar of pure salt dominates the center of a large cavern. It hums with a faint energy.',
    connections: ['whispering_canyon_path_2', 'the_crystal_veins'],
    activities: [
        { type: 'combat', monsterId: 'ancient_ammonite' }
    ],
    regionId: 'salt_flats',
    x: 218,
    y: 1317
},
    whispering_canyon_entrance: {
    id: 'whispering_canyon_entrance',
    name: 'Whispering Canyon Entrance',
    description: 'The entrance to a narrow canyon. The wind passing through it creates an eerie, whispering sound.',
    connections: ['scuttler_hunting_grounds', 'whispering_canyon_path_1'],
    activities: [
        { type: 'combat', monsterId: 'salt_leaper' }
    ],
    regionId: 'salt_flats',
    x: 290,
    y: 1504
},
    whispering_canyon_path_1: {
    id: 'whispering_canyon_path_1',
    name: 'Whispering Canyon',
    description: 'The canyon walls are lined with salt deposits. The whispers are louder here.',
    connections: ['whispering_canyon_entrance', 'whispering_canyon_path_2'],
    activities: [
        { type: 'skilling', id: 'salt_flats_rock_salt_2', name: 'Mine Rock Salt', skill: SkillName.Mining, requiredLevel: 25, loot: [{ itemId: 'rock_salt', chance: 1, xp: 25 }], resourceCount: { min: 3, max: 6 }, respawnTime: 10000, gatherTime: 2800 }
    ],
    regionId: 'salt_flats',
    x: 82,
    y: 1525
},
    whispering_canyon_path_2: {
    id: 'whispering_canyon_path_2',
    name: 'Whispering Canyon',
    description: 'The canyon continues, twisting and turning.',
    connections: ['whispering_canyon_path_1', 'the_great_salt_pillar', 'salt_flats_northwest_passage'],
    activities: [
        { type: 'combat', monsterId: 'crystal_scuttler' },
        { type: 'combat', monsterId: 'salt_wraith' }
    ],
    regionId: 'salt_flats',
    x: 100,
    y: 1384
},
    wind_scoured_mesa: {
    id: 'wind-scoured_mesa',
    name: 'Wind-Scoured Mesa',
    description: 'A flat-topped hill rises from the salt flats. The wind is relentless here, carving strange shapes into the rock.',
    connections: ['skeletal_remains', 'cracked_earth', 'salt_flats_northwest_passage'],
    activities: [
        { type: 'combat', monsterId: 'salt_cryst_golem' },
        { type: 'cut_cactus', id: 'wind_scoured_mesa_cactus_1', name: 'Cut Cactus' },
    ],
    regionId: 'salt_flats',
    x: 420,
    y: 1530
}
};
