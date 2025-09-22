import { POI, SkillName } from '../../types';

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
                dialogue: {
                    default_dialogue: {
                        npcName: 'Rancher McGregor',
                        npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
                        text: "Well howdy, partner. It's a fine day for work, ain't it? Enjoying the fresh country air?",
                        responses: [
                            { text: "Everything alright? You look a bit frazzled.", next: 'quest_intro_sheep_troubles' },
                            { text: "Just passing through.", action: 'close' },
                        ]
                    },
                    quest_intro_sheep_troubles: {
                        npcName: 'Rancher McGregor',
                        npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
                        text: "Frazzled? That's putting it mildly! My sheep have gotten... well, 'fluffy' is an understatement. They're like woolly clouds with legs!",
                        responses: [
                            { text: "They do look rather spherical.", next: 'problem_sheep_troubles' },
                            { text: "Sounds like a you problem.", action: 'close' },
                        ],
                    },
                    problem_sheep_troubles: {
                        npcName: 'Rancher McGregor',
                        npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
                        text: "Spherical! Exactly! It's a woolly catastrophe. My usual shearer is out with a cold, and I can't keep up myself. I need someone to shear ten of 'em for me. The raw wool isn't much use on its own, though.",
                        responses: [
                            { text: "What needs to be done with it?", next: 'solution_sheep_troubles' },
                        ],
                    },
                    solution_sheep_troubles: {
                        npcName: 'Rancher McGregor',
                        npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
                        text: "It needs to be spun into balls of wool. I've got a spinning wheel in the barn you can use. If you can shear ten sheep, spin the wool, and bring me back ten finished balls, I'd be mighty grateful. I'll pay you well for your trouble, of course.",
                        responses: [
                            { text: "You've got a deal. I'll get right on it.", action: 'accept_quest', questId: 'sheep_troubles' },
                            { text: "That sounds like a lot of work.", action: 'close' },
                        ],
                    },
                    in_progress_sheep_troubles_0: {
                        npcName: 'Rancher McGregor',
                        npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
                        text: "Those sheep aren't going to shear themselves! Grab some shears and get to it. You'll find plenty in the pen.",
                        responses: []
                    },
                    in_progress_sheep_troubles_1: {
                        npcName: 'Rancher McGregor',
                        npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
                        text: "That's a fine pile of wool! Now head into the barn and use the spinning wheel to turn it into balls of wool.",
                        responses: []
                    },
                    complete_stage_sheep_troubles_2: {
                        npcName: 'Rancher McGregor',
                        npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
                        text: "Well I'll be! You've got the knack for it. These are perfect. Thank you kindly, adventurer. Here's your payment, as promised.",
                        responses: [
                            { text: "Happy to help.", action: 'complete_stage', questId: 'sheep_troubles' },
                        ]
                    },
                    post_quest_sheep_troubles: {
                        npcName: 'Rancher McGregor',
                        npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
                        text: "Thanks again for helping me with those sheep. It's a relief to have that sorted!",
                        responses: []
                    }
                },
                startNode: 'default_dialogue'
            },
            { type: 'skilling', id: 'mcgregors_ranch_tree', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 0.8, xp: 25 }], resourceCount: { min: 1, max: 3 }, respawnTime: 15000, gatherTime: 2000 },
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
            { type: 'spinning_wheel' }
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
            { type: 'shearing', loot: { itemId: 'wool', chance: 1 } }
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
        activities: [],
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
            { type: 'skilling', id: 'boar_woods_edge_tree', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 2, max: 4 }, respawnTime: 12000, gatherTime: 2000 },
        ],
        regionId: 'the_verdant_fields',
        x: 460, y: 1240
    },
    winding_brook_north: {
        id: 'winding_brook_north',
        name: 'Winding Brook (North)',
        description: 'A shallow brook gurgles peacefully as it winds its way south.',
        connections: ['mcgregor_fields', 'winding_brook_south', 'old_mill_path'],
        activities: [
            { type: 'skilling', id: 'winding_brook_north_fishing', name: 'Net Shrimp', skill: SkillName.Fishing, requiredLevel: 1, loot: [{ itemId: 'raw_shrimp', chance: 1, xp: 10 }, { itemId: 'raw_sardine', chance: 0.4, xp: 20, requiredLevel: 5 }], resourceCount: { min: 4, max: 8 }, respawnTime: 8000, gatherTime: 1800 },
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
            { type: 'skilling', id: 'winding_brook_south_fishing', name: 'Net Shrimp', skill: SkillName.Fishing, requiredLevel: 1, loot: [{ itemId: 'raw_shrimp', chance: 1, xp: 10 }, { itemId: 'raw_sardine', chance: 0.4, xp: 20, requiredLevel: 5 }], resourceCount: { min: 4, max: 8 }, respawnTime: 8000, gatherTime: 1800 },
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
            { type: 'skilling', id: 'clearwater_stream_fishing', name: 'Fish for Trout', skill: SkillName.Fishing, requiredLevel: 20, loot: [{itemId: 'raw_trout', xp: 50, chance: 1}, {itemId: 'raw_pike', xp: 70, chance: 0.3, requiredLevel: 30}], resourceCount: {min: 8, max: 15}, respawnTime: 15000, gatherTime: 2200 },
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
        description: 'A central point in the fields. A path leads north into some hills, west deeper into the woods, and east back towards the ranch.',
        connections: ['mcgregor_fields', 'grassy_knoll', 'tanglewood_edge'],
        activities: [],
        regionId: 'the_verdant_fields',
        x: 600, y: 1200
    },
    grassy_knoll: {
        id: 'grassy_knoll',
        name: 'Grassy Knoll',
        description: 'A gentle, sloping hill offering a fine view of the surrounding fields. Strange, shimmering stags graze peacefully here.',
        connections: ['verdant_crossroads', 'rocky_highlands'],
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
        connections: ['shepherds_peak', 'giants_foothold', 'thorny_thicket'],
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
        connections: ['verdant_crossroads', 'boar_woods_edge', 'wolf_pack_den', 'bear_cave'],
        activities: [ { type: 'combat', monsterId: 'bear' } ],
        regionId: 'the_verdant_fields',
        x: 500, y: 1200
    },
    wolf_pack_den: {
        id: 'wolf_pack_den',
        name: 'Wolf Pack Den',
        description: 'A shallow cave littered with bones. The growls of a large wolf pack echo from the darkness.',
        connections: ['tanglewood_edge'],
        activities: [ { type: 'combat', monsterId: 'wolf' }, { type: 'combat', monsterId: 'wolf' }, { type: 'combat', monsterId: 'wolf' } ],
        regionId: 'the_verdant_fields',
        x: 450, y: 1150
    },
    bear_cave: {
        id: 'bear_cave',
        name: 'Bear Cave',
        description: 'A large, dark cave entrance. A low growl from within suggests it is occupied.',
        connections: ['tanglewood_edge', 'overgrown_ruins'],
        activities: [ { type: 'combat', monsterId: 'bear' } ],
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
        activities: [],
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
             { type: 'skilling', id: 'clearwater_ford_fishing', name: 'Fish for Pike', skill: SkillName.Fishing, requiredLevel: 30, loot: [{itemId: 'raw_pike', xp: 70, chance: 1}], resourceCount: {min: 4, max: 8}, respawnTime: 18000, gatherTime: 2500 },
        ],
        regionId: 'the_verdant_fields',
        x: 550, y: 1150
    },
    river_rapids: {
        id: 'river_rapids',
        name: 'River Rapids',
        description: 'The river flows faster here, churning over smooth stones.',
        connections: ['clearwater_ford', 'secluded_pond'],
        activities: [ { type: 'skilling', id: 'river_rapids_fishing', name: 'Fish for Trout', skill: SkillName.Fishing, requiredLevel: 20, loot: [{itemId: 'raw_trout', xp: 50, chance: 1}], resourceCount: {min: 6, max: 12}, respawnTime: 15000, gatherTime: 2200 } ],
        regionId: 'the_verdant_fields',
        x: 500, y: 1100
    },
    secluded_pond: {
        id: 'secluded_pond',
        name: 'Secluded Pond',
        description: 'A quiet, peaceful pond fed by the river. An excellent fishing spot.',
        connections: ['river_rapids', 'waterfall_ledge'],
        activities: [ { type: 'skilling', id: 'secluded_pond_fishing', name: 'Fish for Pike', skill: SkillName.Fishing, requiredLevel: 30, loot: [{itemId: 'raw_pike', xp: 70, chance: 1}], resourceCount: {min: 8, max: 16}, respawnTime: 18000, gatherTime: 2500 } ],
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
};
