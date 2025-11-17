import { POI, SkillName, ToolType } from '../../types';

export const volcanicSteamVentsPois: Record<string, POI> = {
    vsv_entrance: {
        id: 'vsv_entrance',
        name: 'Scorched Peaks Gateway',
        description: 'A treacherous path leads north into a range of volcanic mountains. The air is hot and smells of sulfur.',
        connections: ['fouthia_north_gate', 'vsv_ashfall_plains'],
        activities: [],
        regionId: 'wilderness',
        x: -42, y: 1205
    },
    vsv_ashfall_plains: {
        id: 'vsv_ashfall_plains',
        name: 'Ashfall Plains',
        description: 'A wide plain covered in a thick blanket of grey ash. The ground is unnaturally warm beneath your feet.',
        connections: ['vsv_entrance', 'vsv_fissure_crossing', 'vsv_sulfur_springs_entrance'],
        activities: [ { type: 'combat', monsterId: 'fire_fiend' } ],
        regionId: 'volcanic_steam_vents', x: -42, y: 1150
    },
    vsv_fissure_crossing: {
        id: 'vsv_fissure_crossing',
        name: 'Fissure Crossing',
        description: 'A deep fissure cuts through the plains, bridged by a natural formation of obsidian. Hot steam rises from the depths.',
        connections: ['vsv_ashfall_plains', 'vsv_obsidian_fields'],
        activities: [],
        regionId: 'volcanic_steam_vents', x: -42, y: 1100
    },
    vsv_obsidian_fields: {
        id: 'vsv_obsidian_fields',
        name: 'Obsidian Fields',
        description: 'Fields of sharp, volcanic glass stretch out before you. The path is difficult to navigate.',
        connections: ['vsv_fissure_crossing', 'vsv_petrified_forest_edge', 'vsv_igneous_path'],
        activities: [
            { type: 'skilling', id: 'vsv_brimstone_1', name: 'Mine Brimstone', skill: SkillName.Mining, requiredLevel: 45, loot: [{ itemId: 'brimstone', chance: 1, xp: 100 }], resourceCount: { min: 1, max: 2 }, respawnTime: 90000, gatherTime: 4000 },
        ],
        regionId: 'volcanic_steam_vents', x: -42, y: 1050
    },
    vsv_igneous_path: {
        id: 'vsv_igneous_path',
        name: 'Igneous Path',
        description: 'The main path continues north, paved with smooth, cooled magma. A darker, more ominous path branches to the west.',
        connections: ['vsv_obsidian_fields', 'vsv_volcanic_caldera', 'vsv_demonic_hotbed_approach'],
        activities: [],
        regionId: 'volcanic_steam_vents', x: -42, y: 1000
    },
    vsv_volcanic_caldera: {
        id: 'vsv_volcanic_caldera',
        name: 'Volcanic Caldera',
        description: 'The path winds around the edge of a massive, dormant caldera. The air is still and heavy.',
        connections: ['vsv_igneous_path', 'vsv_dragons_ascent'],
        activities: [
            { type: 'skilling', id: 'vsv_caldera_fishing', name: 'Harpoon Molten Eels', skill: SkillName.Fishing, requiredLevel: 53, loot: [{ itemId: 'molten_eel', chance: 1, xp: 110 }], resourceCount: { min: 3, max: 8 }, respawnTime: 45000, gatherTime: 5000, requiredTool: ToolType.Harpoon },
        ],
        regionId: 'volcanic_steam_vents', x: -42, y: 950
    },
    vsv_dragons_ascent: {
        id: 'vsv_dragons_ascent',
        name: "Dragon's Ascent",
        description: 'A steep, winding path leading up the side of the main volcano. The rocks are scorched black.',
        connections: ['vsv_volcanic_caldera', 'vsv_emberscale_roost', 'vsv_cinder_cone_peak'],
        activities: [],
        regionId: 'volcanic_steam_vents', x: -42, y: 900
    },
    vsv_emberscale_roost: {
        id: 'vsv_emberscale_roost',
        name: 'Emberscale Roost',
        description: 'A high plateau where the heat is intense. Emberscale Dragons can be seen circling overhead.',
        connections: ['vsv_dragons_ascent', 'vsv_deathscythe_lair'],
        activities: [ { type: 'combat', monsterId: 'emberscale_dragon' } ],
        regionId: 'volcanic_steam_vents', x: -42, y: 850
    },
    vsv_deathscythe_lair: {
        id: 'vsv_deathscythe_lair',
        name: 'Deathscythe Lair',
        description: 'The very peak of the volcano, a jagged landscape of obsidian and cooled lava. This is the lair of the fearsome Deathscythe.',
        connections: ['vsv_emberscale_roost'],
        activities: [
            { type: 'combat', monsterId: 'deathscythe' },
            { type: 'skilling', id: 'vsv_deathscythe_gold_1', name: 'Mine Large Gold Vein', skill: SkillName.Mining, requiredLevel: 40, loot: [{ itemId: 'gold_ore', chance: 1, xp: 65 }], resourceCount: { min: 4, max: 10 }, respawnTime: 120000, gatherTime: 4500 },
            { type: 'skilling', id: 'vsv_deathscythe_silver_1', name: 'Mine Large Silver Vein', skill: SkillName.Mining, requiredLevel: 20, loot: [{ itemId: 'silver_ore', chance: 1, xp: 40 }], resourceCount: { min: 5, max: 12 }, respawnTime: 36000, gatherTime: 4000 },
            { type: 'skilling', id: 'vsv_deathscythe_titanium_1', name: 'Mine Large Titanium Vein', skill: SkillName.Mining, requiredLevel: 75, loot: [{ itemId: 'titanium_ore', chance: 1, xp: 200 }], resourceCount: { min: 2, max: 5 }, respawnTime: 600000, gatherTime: 6000 },
        ],
        regionId: 'volcanic_steam_vents', x: -42, y: 800
    },
    vsv_cinder_cone_peak: {
        id: 'vsv_cinder_cone_peak',
        name: 'Cinder Cone Peak',
        description: 'The peak of a smaller, secondary volcano cone. The view is spectacular, but the air is choked with ash.',
        connections: ['vsv_dragons_ascent'],
        activities: [
            { type: 'skilling', id: 'vsv_titanium_1', name: 'Mine Titanium', skill: SkillName.Mining, requiredLevel: 75, loot: [{ itemId: 'titanium_ore', chance: 1, xp: 200 }], resourceCount: { min: 1, max: 1 }, respawnTime: 300000, gatherTime: 6000 },
        ],
        regionId: 'volcanic_steam_vents', x: 20, y: 900
    },

    // East Branch
    vsv_petrified_forest_edge: {
        id: 'vsv_petrified_forest_edge',
        name: 'Petrified Forest Edge',
        description: 'The edge of an ancient forest, petrified by a past eruption. The trees are solid stone.',
        connections: ['vsv_obsidian_fields', 'vsv_petrified_heartwood'],
        activities: [],
        regionId: 'volcanic_steam_vents', x: 10, y: 1050
    },
    vsv_petrified_heartwood: {
        id: 'vsv_petrified_heartwood',
        name: 'Petrified Heartwood',
        description: 'The heart of the petrified forest. Some of the stone trees are infused with rare minerals.',
        connections: ['vsv_petrified_forest_edge', 'vsv_magma_imp_cavern'],
        activities: [
            { type: 'skilling', id: 'vsv_yew_1', name: 'Chop Petrified Yew', skill: SkillName.Woodcutting, requiredLevel: 65, loot: [{ itemId: 'yew_logs', chance: 1, xp: 175 }], resourceCount: { min: 1, max: 2 }, respawnTime: 60000, gatherTime: 5000 },
            { type: 'skilling', id: 'vsv_adamantite_1', name: 'Mine Adamantite Vein', skill: SkillName.Mining, requiredLevel: 65, loot: [{ itemId: 'adamantite_ore', chance: 1, xp: 120 }], resourceCount: { min: 1, max: 2 }, respawnTime: 45000, gatherTime: 5000 },
        ],
        regionId: 'volcanic_steam_vents', x: 50, y: 1050
    },
    vsv_magma_imp_cavern: {
        id: 'vsv_magma_imp_cavern',
        name: 'Magma Imp Cavern',
        description: 'A wide cavern swarming with small, fiery demons.',
        connections: ['vsv_petrified_heartwood', 'vsv_lava_river_crossing'],
        activities: [
            { type: 'combat', monsterId: 'magma_imp' },
            { type: 'combat', monsterId: 'magma_imp' },
        ],
        regionId: 'volcanic_steam_vents', x: 100, y: 1050
    },
    vsv_lava_river_crossing: {
        id: 'vsv_lava_river_crossing',
        name: 'Lava River Crossing',
        description: 'A river of molten lava flows here, spanned by a precarious-looking bridge of cooled magma.',
        connections: ['vsv_magma_imp_cavern', 'vsv_geothermal_vents'],
        activities: [
            { type: 'skilling', id: 'vsv_lava_river_fishing', name: 'Harpoon Molten Eels', skill: SkillName.Fishing, requiredLevel: 53, loot: [{ itemId: 'molten_eel', chance: 1, xp: 110 }], resourceCount: { min: 2, max: 5 }, respawnTime: 50000, gatherTime: 5000, requiredTool: ToolType.Harpoon },
        ],
        regionId: 'volcanic_steam_vents', x: 150, y: 1050
    },
    vsv_geothermal_vents: {
        id: 'vsv_geothermal_vents',
        name: 'Geothermal Vents',
        description: 'A dead-end area where superheated steam erupts from the ground. The area is exceptionally rich in brimstone.',
        connections: ['vsv_lava_river_crossing'],
        activities: [
            { type: 'skilling', id: 'vsv_brimstone_2', name: 'Mine Brimstone', skill: SkillName.Mining, requiredLevel: 45, loot: [{ itemId: 'brimstone', chance: 1, xp: 100 }], resourceCount: { min: 3, max: 6 }, respawnTime: 60000, gatherTime: 4000 },
        ],
        regionId: 'volcanic_steam_vents', x: 200, y: 1050
    },

    // West Branch (Demons)
    vsv_sulfur_springs_entrance: {
        id: 'vsv_sulfur_springs_entrance',
        name: 'Sulfur Springs Entrance',
        description: 'A path branches west into an area choked with yellow, sulfurous gas.',
        connections: ['vsv_ashfall_plains', 'vsv_fire_fiend_fields'],
        activities: [],
        regionId: 'volcanic_steam_vents', x: -80, y: 1150
    },
    vsv_fire_fiend_fields: {
        id: 'vsv_fire_fiend_fields',
        name: 'Fire Fiend Fields',
        description: 'The ground is scorched and small fires burn endlessly. Fire Fiends wander this area.',
        connections: ['vsv_sulfur_springs_entrance', 'vsv_brimstone_pass'],
        activities: [
            { type: 'combat', monsterId: 'fire_fiend' },
            { type: 'combat', monsterId: 'fire_fiend' },
        ],
        regionId: 'volcanic_steam_vents', x: -120, y: 1150
    },
    vsv_brimstone_pass: {
        id: 'vsv_brimstone_pass',
        name: 'Brimstone Pass',
        description: 'A narrow pass between volcanic rock, reeking of sulfur. More Fire Fiends guard this choke point.',
        connections: ['vsv_fire_fiend_fields', 'vsv_demonic_hotbed_approach'],
        activities: [
            { type: 'combat', monsterId: 'fire_fiend' },
        ],
        regionId: 'volcanic_steam_vents', x: -160, y: 1150
    },
    vsv_demonic_hotbed_approach: {
        id: 'vsv_demonic_hotbed_approach',
        name: 'Demonic Hotbed Approach',
        description: 'The ground here is dark and cracked, with an unnatural heat radiating from below. The air feels heavy and malevolent.',
        connections: ['vsv_brimstone_pass', 'vsv_igneous_path', 'vsv_demonic_hotbed'],
        activities: [],
        regionId: 'volcanic_steam_vents', x: -100, y: 1000
    },
    vsv_demonic_hotbed: {
        id: 'vsv_demonic_hotbed',
        name: 'Demonic Hotbed',
        description: 'A large, open area swarming with lesser demons, drawn to a nexus of infernal energy.',
        connections: ['vsv_demonic_hotbed_approach', 'vsv_greater_incubus_den'],
        activities: [
            { type: 'combat', monsterId: 'lesser_incubus' },
            { type: 'combat', monsterId: 'lesser_incubus' },
        ],
        regionId: 'volcanic_steam_vents', x: -150, y: 1000
    },
    vsv_greater_incubus_den: {
        id: 'vsv_greater_incubus_den',
        name: 'Greater Incubus Den',
        description: 'A cavernous den where larger, more powerful demons hold court.',
        connections: ['vsv_demonic_hotbed', 'vsv_succubus_chamber'],
        activities: [
            { type: 'combat', monsterId: 'greater_incubus' },
            { type: 'combat', monsterId: 'greater_incubus' },
        ],
        regionId: 'volcanic_steam_vents', x: -200, y: 1000
    },
    vsv_succubus_chamber: {
        id: 'vsv_succubus_chamber',
        name: 'Succubus Chamber',
        description: 'The air is thick with a cloying perfume and a sense of dread. A powerful Succubus resides here.',
        connections: ['vsv_greater_incubus_den'],
        activities: [
            { type: 'combat', monsterId: 'succubus' },
        ],
        regionId: 'volcanic_steam_vents', x: -250, y: 1000
    },

    // More POIs to reach 30+
    vsv_ash_dunes: {
        id: 'vsv_ash_dunes',
        name: 'Ash Dunes',
        description: 'Rolling dunes of fine volcanic ash. It\'s easy to get lost here.',
        connections: ['vsv_ashfall_plains'],
        activities: [{ type: 'combat', monsterId: 'fire_fiend' }],
        regionId: 'volcanic_steam_vents', x: 0, y: 1180
    },
    vsv_obsidian_pass: {
        id: 'vsv_obsidian_pass',
        name: 'Obsidian Pass',
        description: 'A narrow pass cut through a field of razor-sharp obsidian.',
        connections: ['vsv_fissure_crossing'],
        activities: [],
        regionId: 'volcanic_steam_vents', x: -80, y: 1100
    },
    vsv_lava_fall: {
        id: 'vsv_lava_fall',
        name: 'Lava Fall',
        description: 'A cascade of molten rock pours down a cliff face into a pool of lava below.',
        connections: ['vsv_geothermal_vents'],
        activities: [{ type: 'combat', monsterId: 'magma_imp' }],
        regionId: 'volcanic_steam_vents', x: 250, y: 1050
    },
    vsv_charred_path: {
        id: 'vsv_charred_path',
        name: 'Charred Path',
        description: 'A path that has been scorched black by intense heat.',
        connections: ['vsv_demonic_hotbed_approach'],
        activities: [],
        regionId: 'volcanic_steam_vents', x: -100, y: 950
    },
    vsv_infernal_breach: {
        id: 'vsv_infernal_breach',
        name: 'Infernal Breach',
        description: 'A gaping maw in the ground from which hellish energy emanates. A powerful demon guards it.',
        connections: ['vsv_succubus_chamber'],
        activities: [{ type: 'combat', monsterId: 'greater_incubus' }],
        regionId: 'volcanic_steam_vents', x: -300, y: 1000
    },
    vsv_dragons_maw: {
        id: 'vsv_dragons_maw',
        name: "Dragon's Maw",
        description: 'A cave entrance shaped like the gaping maw of a dragon. It leads to the lair of a Deathscythe.',
        connections: ['vsv_emberscale_roost'],
        activities: [],
        regionId: 'volcanic_steam_vents', x: -42, y: 820
    },
    vsv_molten_sea: {
        id: 'vsv_molten_sea',
        name: 'Molten Sea',
        description: 'A vast, shimmering sea of lava. The heat is unbearable. The path ends here.',
        connections: ['vsv_petrified_heartwood'],
        activities: [],
        regionId: 'volcanic_steam_vents', x: 50, y: 1000
    },
    vsv_ashfall_canyon: {
        id: 'vsv_ashfall_canyon',
        name: 'Ashfall Canyon',
        description: 'A deep canyon where ash falls like snow.',
        connections: ['vsv_ashfall_plains'],
        activities: [{ type: 'combat', monsterId: 'fire_fiend' }],
        regionId: 'volcanic_steam_vents', x: 0, y: 1100
    },
    vsv_obsidian_spire: {
        id: 'vsv_obsidian_spire',
        name: 'Obsidian Spire',
        description: 'A towering spire of natural volcanic glass pierces the sky.',
        connections: ['vsv_obsidian_fields'],
        activities: [],
        regionId: 'volcanic_steam_vents', x: -80, y: 1050
    },
};