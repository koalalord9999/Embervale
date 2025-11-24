
import { POI, SkillName, ToolType } from '../../types';

export const theVerdantFieldsPois: Record<string, POI> = {
    // From farmlands.ts
    mcgregors_ranch: {
        id: 'mcgregors_ranch',
        name: "McGregor's Ranch",
        description: "A well-kept ranch with a sturdy farmhouse and several outbuildings. The air smells of hay and livestock. A well-trodden path leads west into open fields.",
        connections: ['meadowdale_west_gate', 'sheep_pen', 'cow_pasture', 'chicken_coop', 'mcgregors_barn', 'mcgregor_fields'],
        activities: [
            { 
                type: 'npc', 
                name: 'Rancher McGregor', 
                icon: '/assets/npcChatHeads/rancher_mcgregor.png',
                pickpocket: { lootTableId: 'pickpocket_farmer_table' },
                attackableMonsterId: 'farmer',
                startNode: 'mcgregor_default',
                questTopics: ['sheep_troubles'],
                conditionalGreetings: [
                    { text: "Have you sheared those ten sheep yet? They're starting to look like clouds with legs.", check: { requirements: [{ type: 'quest', questId: 'sheep_troubles', status: 'in_progress', stage: 0 }] } },
                    { text: "That's a fine pile of wool! What else do you need?", check: { requirements: [{ type: 'quest', questId: 'sheep_troubles', status: 'in_progress', stage: 1 }] } },
                    { text: "You've finished spinning all of it? Great! Hand them over when you're ready.", check: { requirements: [{ type: 'quest', questId: 'sheep_troubles', status: 'in_progress', stage: 2 }] } },
                    { text: "Thanks again for helping me with those sheep. It's a relief to have that sorted!", check: { requirements: [{ type: 'quest', questId: 'sheep_troubles', status: 'completed' }] } }
                ]
            },
            { type: 'skilling', id: 'mcgregors_ranch_tree', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 1, max: 3 }, respawnTime: 15000, gatherTime: 2000 },
        ],
        regionId: 'the_verdant_fields',
        x: 800, y: 1200
    },
    flax_field: {
        id: 'flax_field',
        name: 'Flax Field',
        description: 'A field of tall, flowering flax plants.',
        connections: ['mcgregor_fields'],
        activities: [
            { type: 'skilling', id: 'flax_field_gathering', name: 'Pick Flax', skill: SkillName.Crafting, requiredLevel: 1, loot: [{ itemId: 'flax', chance: 1, xp: 1 }], resourceCount: { min: 10, max: 731 }, respawnTime: 20000, gatherTime: 600 }
        ],
        regionId: 'the_verdant_fields',
        x: 728, y: 1173
    },
    mcgregors_barn: {
        id: 'mcgregors_barn',
        name: "McGregor's Barn",
        description: "The barn is tidy and smells of fresh hay. In the corner, a sturdy spinning wheel sits ready for use.",
        connections: ['mcgregors_ranch'],
        activities: [
            { type: 'spinning_wheel' },
            { type: 'thieving_lockpick', id: 'tvf_barn_chest_1', targetName: 'Old Hay-Filled Chest', lootTableId: 'thieving_house_chest_dusty' },
        ],
        regionId: 'the_verdant_fields',
        x: 800, y: 1140
    },
    sheep_pen: {
        id: 'sheep_pen',
        name: "Sheep Pen",
        description: "A large pen filled with incredibly fluffy sheep. They bleat lazily as you approach.",
        connections: ['mcgregors_ranch'],
        activities: [
            { type: 'skilling', id: 'sheep_pen_sheep_1', name: 'Shear Sheep', skill: SkillName.Crafting, requiredLevel: 1, loot: [{ itemId: 'wool', chance: 1, xp: 0 }], resourceCount: { min: 1, max: 1 }, respawnTime: 20000, gatherTime: 1800 },
            { type: 'skilling', id: 'sheep_pen_sheep_2', name: 'Shear Sheep', skill: SkillName.Crafting, requiredLevel: 1, loot: [{ itemId: 'wool', chance: 1, xp: 0 }], resourceCount: { min: 1, max: 1 }, respawnTime: 20000, gatherTime: 1800 },
            { type: 'skilling', id: 'sheep_pen_sheep_3', name: 'Shear Sheep', skill: SkillName.Crafting, requiredLevel: 1, loot: [{ itemId: 'wool', chance: 1, xp: 0 }], resourceCount: { min: 1, max: 1 }, respawnTime: 20000, gatherTime: 1800 },
            { type: 'skilling', id: 'sheep_pen_sheep_4', name: 'Shear Sheep', skill: SkillName.Crafting, requiredLevel: 1, loot: [{ itemId: 'wool', chance: 1, xp: 0 }], resourceCount: { min: 1, max: 1 }, respawnTime: 20000, gatherTime: 1800 },
            { type: 'skilling', id: 'sheep_pen_sheep_5', name: 'Shear Sheep', skill: SkillName.Crafting, requiredLevel: 1, loot: [{ itemId: 'wool', chance: 1, xp: 0 }], resourceCount: { min: 1, max: 1 }, respawnTime: 20000, gatherTime: 1800 },
            { type: 'ground_item', id: 'sheep_pen_shears', itemId: 'shears', resourceCount: 1, respawnTimer: 300000 },
        ],
        regionId: 'the_verdant_fields',
        x: 760, y: 1160
    },
    cow_pasture: {
        id: 'cow_pasture',
        name: "Cow Pasture",
        description: "A field of placid-looking cows, chewing their cud and staring at you with large, vacant eyes.",
        connections: ['mcgregors_ranch'],
        activities: [
            { type: 'milking' },
            { type: 'combat', monsterId: 'cow' },
            { type: 'combat', monsterId: 'cow' },
            { type: 'combat', monsterId: 'cow' },
            { type: 'combat', monsterId: 'cow' },
            { type: 'combat', monsterId: 'cow' }
        ],
        regionId: 'the_verdant_fields',
        x: 760, y: 1240
    },
    chicken_coop: {
        id: 'chicken_coop',
        name: "Chicken Coop",
        description: "A noisy, dusty coop filled with clucking chickens. There are nesting boxes along one wall.",
        connections: ['mcgregors_ranch'],
        activities: [
            { type: 'skilling', id: 'chicken_coop_nests', name: 'Collect Eggs', skill: SkillName.Cooking, requiredLevel: 1, loot: [{ itemId: 'eggs', chance: 1, xp: 5 }], resourceCount: { min: 1, max: 1 }, respawnTime: 5000, gatherTime: 600 },
            { type: 'combat', monsterId: 'chicken' },
            { type: 'combat', monsterId: 'chicken' },
            { type: 'combat', monsterId: 'chicken' },
            { type: 'combat', monsterId: 'chicken' },
            { type: 'combat', monsterId: 'chicken' },
            { type: 'ground_item', id: 'chicken_coop_feathers', itemId: 'feathers', resourceCount: 5, respawnTimer: 60000 },
        ],
        regionId: 'the_verdant_fields',
        x: 840, y: 1240
    },
    // From the_verdant_fields.ts
    mcgregor_fields: {
        id: 'mcgregor_fields',
        name: "McGregor's Fields",
        description: "The path from the ranch opens into vast, rolling green fields. The air is fresh and smells of rich soil.",
        connections: ['mcgregors_ranch', 'wheat_field', 'winding_brook_north', 'windmill', 'flax_field', 'verdant_crossroads'],
        activities: [
            { type: 'ground_item', id: 'farm_tomato_1', itemId: 'tomato', resourceCount: 1, respawnTimer: 45000 },
            { type: 'ground_item', id: 'farm_tomato_2', itemId: 'tomato', resourceCount: 1, respawnTimer: 45000 },
        ],
        regionId: 'the_verdant_fields',
        x: 700, y: 1200
    },
    wheat_field: {
        id: 'wheat_field',
        name: 'Wheat Field',
        description: 'A vast field of golden wheat sways in the gentle breeze.',
        connections: ['mcgregor_fields', 'old_mill_path'],
        activities: [
            { type: 'skilling', id: 'wheat_field_1', name: 'Harvest Wheat', skill: SkillName.Cooking, requiredLevel: 1, loot: [{ itemId: 'wheat', chance: 1, xp: 0 }], resourceCount: { min: 1, max: 1 }, respawnTime: 4000, gatherTime: 600 },
            { type: 'skilling', id: 'wheat_field_2', name: 'Harvest Wheat', skill: SkillName.Cooking, requiredLevel: 1, loot: [{ itemId: 'wheat', chance: 1, xp: 0 }], resourceCount: { min: 1, max: 1 }, respawnTime: 4000, gatherTime: 600 },
            { type: 'skilling', id: 'wheat_field_3', name: 'Harvest Wheat', skill: SkillName.Cooking, requiredLevel: 1, loot: [{ itemId: 'wheat', chance: 1, xp: 0 }], resourceCount: { min: 1, max: 1 }, respawnTime: 4000, gatherTime: 600 },
            { type: 'skilling', id: 'wheat_field_4', name: 'Harvest Wheat', skill: SkillName.Cooking, requiredLevel: 1, loot: [{ itemId: 'wheat', chance: 1, xp: 0 }], resourceCount: { min: 1, max: 1 }, respawnTime: 4000, gatherTime: 600 },
            { type: 'skilling', id: 'wheat_field_5', name: 'Harvest Wheat', skill: SkillName.Cooking, requiredLevel: 1, loot: [{ itemId: 'wheat', chance: 1, xp: 0 }], resourceCount: { min: 1, max: 1 }, respawnTime: 4000, gatherTime: 600 },
            { type: 'skilling', id: 'wheat_field_6', name: 'Harvest Wheat', skill: SkillName.Cooking, requiredLevel: 1, loot: [{ itemId: 'wheat', chance: 1, xp: 0 }], resourceCount: { min: 1, max: 1 }, respawnTime: 4000, gatherTime: 600 },
        ],
        regionId: 'the_verdant_fields',
        x: 640, y: 1240
    },
    windmill: {
        id: 'windmill',
        name: 'The Old Windmill',
        description: 'A rustic windmill stands tall against the sky. The gentle creak of its sails is a constant, soothing sound. Inside, you can mill wheat into flour.',
        connections: ['mcgregor_fields'],
        activities: [
            { type: 'windmill' }
        ],
        regionId: 'the_verdant_fields',
        x: 700, y: 1260,
    },
    boar_woods_edge: {
        id: 'boar_woods_edge',
        name: "Boar Wood's Edge",
        description: 'A small patch of woods where the earth is churned up by the digging of wild boars.',
        connections: ['tanglewood_edge'],
        activities: [
            { type: 'combat', monsterId: 'wild_boar' },
            { type: 'combat', monsterId: 'wild_boar' },
            { type: 'combat', monsterId: 'wild_boar' },
            { type: 'skilling', id: 'boar_woods_edge_tree', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 2, max: 4 }, respawnTime: 12000, gatherTime: 2000 },
        ],
        regionId: 'the_verdant_fields',
        x: 460, y: 1240
    },
    winding_brook_north: {
        id: 'winding_brook_north',
        name: 'Winding Brook (North)',
        description: 'A shallow brook gurgles pleasantly as it winds its way south.',
        connections: ['mcgregor_fields', 'winding_brook_south', 'old_mill_path'],
        activities: [
            { type: 'skilling', id: 'winding_brook_north_fishing', name: 'Net Shrimp', skill: SkillName.Fishing, requiredLevel: 1, loot: [{ itemId: 'raw_shrimp', chance: 1, xp: 10 }, { itemId: 'raw_anchovy', chance: 0.4, xp: 20, requiredLevel: 5 }], resourceCount: { min: 4, max: 8 }, respawnTime: 8000, gatherTime: 1800, requiredTool: ToolType.FishingNet, },
            { type: 'water_source', name: 'Collect Water' }
        ],
        regionId: 'the_verdant_fields',
        x: 700, y: 1140
    },
    winding_brook_south: {
        id: 'winding_brook_south',
        name: 'Winding Brook (South)',
        description: 'The brook continues its journey south, passing by a small, sleepy hamlet. A smaller stream flows in from the west.',
        connections: ['winding_brook_north', 'brookside_hamlet', 'clearwater_stream'],
        activities: [
            { type: 'skilling', id: 'winding_brook_south_fishing', name: 'Net Shrimp', skill: SkillName.Fishing, requiredLevel: 1, loot: [{ itemId: 'raw_shrimp', chance: 1, xp: 10 }, { itemId: 'raw_anchovy', chance: 0.4, xp: 20, requiredLevel: 5 }], resourceCount: { min: 4, max: 8 }, respawnTime: 8000, gatherTime: 1800, requiredTool: ToolType.FishingNet, },
            { type: 'skilling', id: 'winding_brook_south_bait_fishing', name: 'Bait Fish', skill: SkillName.Fishing, requiredLevel: 5, loot: [{ itemId: 'raw_sardine', chance: 1, xp: 20 }, { itemId: 'raw_herring', chance: 0.5, xp: 30, requiredLevel: 10 }], resourceCount: { min: 4, max: 8 }, respawnTime: 8000, gatherTime: 1800, requiredTool: ToolType.FishingRod },
            { type: 'water_source', name: 'Collect Water' }
        ],
        regionId: 'the_verdant_fields',
        x: 700, y: 1080
    },
    clearwater_stream: {
        id: 'clearwater_stream',
        name: 'Clearwater Stream',
        description: 'A crystal clear stream flowing down from the mountains. Perfect for trout fishing.',
        connections: ['winding_brook_south'],
        activities: [
            { type: 'skilling', id: 'clearwater_stream_fishing', name: 'Fly Fish', skill: SkillName.Fishing, requiredLevel: 20, loot: [{itemId: 'raw_trout', xp: 50, chance: 1}, {itemId: 'raw_pike', xp: 70, chance: 0.3, requiredLevel: 30}], resourceCount: {min: 8, max: 15}, respawnTime: 15000, gatherTime: 2200, requiredTool: ToolType.FlyFishingRod },
            { type: 'water_source', name: 'Collect Water' }
        ],
        regionId: 'the_verdant_fields',
        x: 640, y: 1080
    },
    old_mill_path: {
        id: 'old_mill_path',
        name: 'Old Mill Path',
        description: 'A dirt path connecting the fields and the brook to an old, weathered mill.',
        connections: ['winding_brook_north', 'wheat_field'],
        activities: [],
        regionId: 'the_verdant_fields',
        x: 640, y: 1180
    },

    // --- NEW POIs ---
    verdant_crossroads: {
        id: 'verdant_crossroads',
        name: 'Verdant Crossroads',
        description: 'A central point in the fields. A path leads north into the hills, west deeper into the woods, and east back towards the ranch.',
        connections: ['mcgregor_fields', 'grassy_knoll', 'tanglewood_edge'],
        activities: [],
        regionId: 'the_verdant_fields',
        x: 600, y: 1200
    },
    grassy_knoll: {
        id: 'grassy_knoll',
        name: 'Grassy Knoll',
        description: 'A gentle, sloping hill offering a fine view of the surrounding fields. Strange, shimmering stags graze peacefully here.',
        connections: ['verdant_crossroads', 'rocky_highlands', 'clearwater_ford'],
        activities: [
            { type: 'combat', monsterId: 'glimmerhorn_stag' },
            { type: 'skilling', id: 'grassy_knoll_iron', name: 'Mine Iron Rock', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 1, max: 2 }, respawnTime: 8000, gatherTime: 3000 },
        ],
        regionId: 'the_verdant_fields',
        x: 600, y: 1100
    },
    rocky_highlands: {
        id: 'rocky_highlands',
        name: 'Rocky Highlands',
        description: 'The terrain becomes more rugged here, with rocky outcrops and the sound of howling wolves on the wind.',
        connections: ['grassy_knoll', 'shepherds_peak'],
        activities: [
            { type: 'combat', monsterId: 'wolf' },
            { type: 'skilling', id: 'rocky_highlands_iron', name: 'Mine Iron Rock', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 2, max: 4 }, respawnTime: 8000, gatherTime: 3000 },
        ],
        regionId: 'the_verdant_fields',
        x: 550, y: 1050
    },
    shepherds_peak: {
        id: 'shepherds_peak',
        name: "Shepherd's Peak",
        description: 'The highest point in the hills. From here, you can see for miles. A lone wolf stands silhouetted against the sky.',
        connections: ['rocky_highlands', 'ancient_standing_stones'],
        activities: [ { type: 'combat', monsterId: 'wolf' } ],
        regionId: 'the_verdant_fields',
        x: 500, y: 1000
    },
    ancient_standing_stones: {
        id: 'ancient_standing_stones',
        name: 'Ancient Standing Stones',
        description: 'A circle of moss-covered stones hums with a faint energy. The air feels strangely alive.',
        connections: ['shepherds_peak', 'giants_foothold', 'thorny_thicket', 'forgotten_barrow'],
        activities: [ { type: 'combat', monsterId: 'forest_spirit' } ],
        regionId: 'the_verdant_fields',
        x: 450, y: 950
    },
    giants_foothold: {
        id: 'giants_foothold',
        name: "Giant's Foothold",
        description: 'A small plateau where the ground is scarred with enormous footprints. Young, boisterous hill giants roam here.',
        connections: ['ancient_standing_stones'],
        activities: [ { type: 'combat', monsterId: 'young_hill_giant' } ],
        regionId: 'the_verdant_fields',
        x: 400, y: 900
    },
    tanglewood_edge: {
        id: 'tanglewood_edge',
        name: 'Tanglewood Edge',
        description: 'The open fields give way to a dense, dark forest. The sounds of heavy beasts can be heard from within.',
        connections: ['verdant_crossroads', 'boar_woods_edge', 'wolf_pack_den', 'bear_cave', 'clearwater_ford'],
        activities: [
            { type: 'combat', monsterId: 'boar' },
            { type: 'ground_item', id: 'verdant_berry_1', itemId: 'red_berries', resourceCount: 1, respawnTimer: 60000 },
            { type: 'ground_item', id: 'verdant_berry_2', itemId: 'red_berries', resourceCount: 1, respawnTimer: 60000 },
            { type: 'ground_item', id: 'verdant_berry_3', itemId: 'red_berries', resourceCount: 1, respawnTimer: 60000 },
        ],
        regionId: 'the_verdant_fields',
        x: 500, y: 1200
    },
    wolf_pack_den: {
        id: 'wolf_pack_den',
        name: 'Wolf Pack Den',
        description: 'A shallow cave littered with bones. The growls of a large wolf pack echo from the darkness.',
        connections: ['tanglewood_edge'],
        activities: [ 
            { type: 'combat', monsterId: 'wolf' }, 
            { type: 'combat', monsterId: 'wolf' }, 
            { type: 'combat', monsterId: 'wolf' },
            { type: 'ground_item', id: 'wolf_den_bones_1', itemId: 'bones', resourceCount: 1, respawnTimer: 60000 },
            { type: 'ground_item', id: 'wolf_den_bones_2', itemId: 'bones', resourceCount: 1, respawnTimer: 60000 },
            { type: 'ground_item', id: 'wolf_den_beef', itemId: 'raw_beef', resourceCount: 1, respawnTimer: 120000 },
        ],
        regionId: 'the_verdant_fields',
        x: 450, y: 1150
    },
    bear_cave: {
        id: 'bear_cave',
        name: 'Bear Cave',
        description: 'A large, dark cave entrance. A low growl from within suggests it is occupied.',
        connections: ['tanglewood_edge', 'overgrown_ruins'],
        activities: [
             { type: 'combat', monsterId: 'bear' },
             { type: 'combat', monsterId: 'bear' },
             { type: 'combat', monsterId: 'bear' }
            ],
        regionId: 'the_verdant_fields',
        x: 400, y: 1200
    },
    overgrown_ruins: {
        id: 'overgrown_ruins',
        name: 'Overgrown Ruins',
        description: 'The crumbling stone foundations of some ancient structure are being reclaimed by the forest. Strange, tree-like creatures wander here.',
        connections: ['bear_cave', 'hunters_campsite'],
        activities: [ { type: 'combat', monsterId: 'treant_sapling' } ],
        regionId: 'the_verdant_fields',
        x: 350, y: 1150
    },
    hunters_campsite: {
        id: 'hunters_campsite',
        name: "Hunter's Campsite",
        description: 'An abandoned campsite. A cold fire pit and a tattered tent are all that remain.',
        connections: ['overgrown_ruins', 'stag_clearing'],
        activities: [
            { type: 'thieving_lockpick', id: 'tvf_hunter_chest_1', targetName: 'Abandoned Pack', lootTableId: 'thieving_dungeon_chest_low' },
            { type: 'ground_item', id: 'hunters_ashes', itemId: 'ashes', resourceCount: 1, respawnTimer: 300000 },
        ],
        regionId: 'the_verdant_fields',
        x: 300, y: 1200
    },
    stag_clearing: {
        id: 'stag_clearing',
        name: 'Stag Clearing',
        description: 'A peaceful clearing where majestic stags with shimmering antlers graze.',
        connections: ['hunters_campsite', 'hornet_nest_grove'],
        activities: [ { type: 'combat', monsterId: 'glimmerhorn_stag' }, { type: 'combat', monsterId: 'glimmerhorn_stag' } ],
        regionId: 'the_verdant_fields',
        x: 250, y: 1150
    },
    hornet_nest_grove: {
        id: 'hornet_nest_grove',
        name: 'Hornet Nest Grove',
        description: 'The air is filled with the loud buzzing of enormous hornets. Several large, papery nests hang from the trees.',
        connections: ['stag_clearing'],
        activities: [ { type: 'combat', monsterId: 'giant_hornet' }, { type: 'combat', monsterId: 'giant_hornet' } ],
        regionId: 'the_verdant_fields',
        x: 200, y: 1200
    },
    clearwater_ford: {
        id: 'clearwater_ford',
        name: 'Clearwater Ford',
        description: 'A shallow point in the river, allowing passage between the woods and the hills.',
        connections: ['tanglewood_edge', 'grassy_knoll', 'river_rapids'],
        activities: [
             { type: 'skilling', id: 'clearwater_ford_fishing', name: 'Fish for Pike', skill: SkillName.Fishing, requiredLevel: 30, loot: [{itemId: 'raw_pike', xp: 70, chance: 1}], resourceCount: {min: 4, max: 8}, respawnTime: 18000, gatherTime: 2500, requiredTool: ToolType.FishingRod },
        ],
        regionId: 'the_verdant_fields',
        x: 550, y: 1150
    },
    river_rapids: {
        id: 'river_rapids',
        name: 'River Rapids',
        description: 'The river flows faster here, churning over smooth stones.',
        connections: ['clearwater_ford', 'secluded_pond'],
        activities: [ { type: 'skilling', id: 'river_rapids_fishing', name: 'Fly Fish Trout', skill: SkillName.Fishing, requiredLevel: 20, loot: [{itemId: 'raw_trout', xp: 50, chance: 1}], resourceCount: {min: 6, max: 12}, respawnTime: 15000, gatherTime: 2200, requiredTool: ToolType.FlyFishingRod } ],
        regionId: 'the_verdant_fields',
        x: 500, y: 1100
    },
    secluded_pond: {
        id: 'secluded_pond',
        name: 'Secluded Pond',
        description: 'A quiet, peaceful pond fed by the river. An excellent fishing spot.',
        connections: ['river_rapids', 'waterfall_ledge'],
        activities: [ { type: 'skilling', id: 'secluded_pond_fishing', name: 'Fish for Pike', skill: SkillName.Fishing, requiredLevel: 30, loot: [{itemId: 'raw_pike', xp: 70, chance: 1}], resourceCount: {min: 8, max: 16}, respawnTime: 18000, gatherTime: 2500, requiredTool: ToolType.FishingRod } ],
        regionId: 'the_verdant_fields',
        x: 450, y: 1050
    },
    waterfall_ledge: {
        id: 'waterfall_ledge',
        name: 'Waterfall Ledge',
        description: 'A misty ledge behind a small, beautiful waterfall. The path ends here.',
        connections: ['secluded_pond'],
        activities: [ { type: 'combat', monsterId: 'forest_spirit' } ],
        regionId: 'the_verdant_fields',
        x: 400, y: 1000
    },
    thorny_thicket: {
        id: 'thorny_thicket',
        name: 'Thorny Thicket',
        description: 'A dense wall of thorny vines blocks the path north. It seems impassable without a sharp axe.',
        connections: ['ancient_standing_stones', 'serene_meadow'],
        activities: [],
        connectionRequirements: {
            serene_meadow: {
                skill: SkillName.Woodcutting, level: 35, xp: 500,
                description: "A dense wall of thorny vines blocks the path.",
                actionText: "Chop Through"
            }
        },
        regionId: 'the_verdant_fields',
        x: 450, y: 900
    },
    serene_meadow: {
        id: 'serene_meadow',
        name: 'Serene Meadow',
        description: 'Past the thorns lies a beautiful, untouched meadow filled with wildflowers. Glimmerhorn Stags and Forest Spirits live in harmony here.',
        connections: ['thorny_thicket', 'unicorn_grove'],
        activities: [ { type: 'combat', monsterId: 'glimmerhorn_stag' }, { type: 'combat', monsterId: 'forest_spirit' } ],
        regionId: 'the_verdant_fields',
        x: 450, y: 850
    },
    unicorn_grove: {
        id: 'unicorn_grove',
        name: 'Unicorn Grove',
        description: 'The heart of a secluded grove. A pure white unicorn drinks from a glowing stream, its horn radiating a soft light. The creature is peaceful, but powerful.',
        connections: ['serene_meadow'],
        activities: [ { type: 'combat', monsterId: 'unicorn' } ],
        regionId: 'the_verdant_fields',
        x: 450, y: 800
    },
    forgotten_barrow: {
        id: 'forgotten_barrow',
        name: 'Forgotten Barrow',
        description: 'A low, grass-covered mound with a single stone door, sealed shut with an ancient lock.',
        connections: ['ancient_standing_stones'],
        activities: [
            { type: 'npc', name: 'Examine Seal', icon: 'https://api.iconify.design/game-icons:locked-fortress.svg', questCondition: { questId: 'an_echo_of_battle', stages: [0] }, startNode: 'aeb_barrow_seal' },
            { type: 'ladder', name: 'Enter the Barrow', questCondition: { questId: 'an_echo_of_battle', stages: [6, 7, 8], visibleAfterCompletion: true }, direction: 'down', toPoiId: `barrow_entrance_hall` },
            { type: 'npc', name: 'Use Reforged Key', icon: 'https://api.iconify.design/game-icons:key-skeleton.svg', questCondition: { questId: 'an_echo_of_battle', stages: [5] }, startNode: 'aeb_barrow_door_puzzle_start' }
        ],
        regionId: 'the_verdant_fields',
        x: 400, y: 950
    },
};
