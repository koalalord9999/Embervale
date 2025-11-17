import { POI, SkillName, ToolType } from '../../types';

export const sunkenLandsPois: Record<string, POI> = {
    tangled_entry: {
        id: 'tangled_entry',
        name: 'Tangled Entry',
        description: 'The air is humid and thick with the buzzing of insects. Gnarled willow trees weep into stagnant pools of water.',
        connections: ['boggy_trail', 'mire_of_sorrow', 'murky_shallows', 'submerged_pathway'],
        activities: [
            { type: 'skilling', id: 'tangled_entry_willow_1', name: 'Chop Willow Tree', skill: SkillName.Woodcutting, requiredLevel: 30, loot: [{ itemId: 'willow_logs', chance: 1, xp: 90 }], resourceCount: { min: 14, max: 30 }, respawnTime: 25000, gatherTime: 3500 },
            { type: 'combat', monsterId: 'giant_toad' },
        ],
        regionId: 'sunken_lands',
        x: 1200, y: 1400
    },
    murky_shallows: {
        id: 'murky_shallows',
        name: 'Murky Shallows',
        description: 'A quiet, monster-free offshoot of the main swamp path. It is an excellent spot for fishing and chopping willows.',
        connections: ['tangled_entry'],
        activities: [
             { type: 'skilling', id: 'murky_shallows_willow_1', name: 'Chop Willow Tree', skill: SkillName.Woodcutting, requiredLevel: 30, loot: [{ itemId: 'willow_logs', chance: 1, xp: 90 }], resourceCount: { min: 14, max: 30 }, respawnTime: 25000, gatherTime: 3500 },
             { type: 'skilling', id: 'murky_shallows_fishing_1', name: 'Set Basket Trap', skill: SkillName.Fishing, requiredLevel: 38, loot: [{ itemId: 'raw_eel', chance: 1, xp: 70 }], resourceCount: { min: 1, max: 70 }, respawnTime: 20000, gatherTime: 2800, requiredTool: ToolType.BasketTrap },
        ],
        regionId: 'sunken_lands',
        x: 1220, y: 1440
    },
    mire_of_sorrow: {
        id: 'mire_of_sorrow',
        name: 'Mire of Sorrow',
        description: 'A vast, open bog where grasping roots snake through the mud. A constant, unpleasant squelching sound follows your every step.',
        connections: ['tangled_entry', 'toadstool_bog', 'fetid_thicket', 'great_willow'],
        activities: [
            { type: 'combat', monsterId: 'bog_mite' },
            { type: 'combat', monsterId: 'bog_mite' },
        ],
        regionId: 'sunken_lands',
        x: 1260, y: 1340
    },
    great_willow: {
        id: 'great_willow',
        name: 'The Great Willow',
        description: 'A colossal, ancient willow tree dominates this small island in the mire. Its branches are thick as a man\'s waist.',
        connections: ['mire_of_sorrow'],
        activities: [
            { type: 'skilling', id: 'great_willow_tree', name: 'Chop Great Willow', skill: SkillName.Woodcutting, requiredLevel: 30, loot: [{ itemId: 'willow_logs', chance: 1, xp: 90 }], resourceCount: { min: 100, max: 200 }, respawnTime: 120000, gatherTime: 3500 },
        ],
        regionId: 'sunken_lands',
        x: 1300, y: 1300
    },
    fetid_thicket: {
        id: 'fetid_thicket',
        name: 'Fetid Thicket',
        description: 'A dead-end thicket of twisted, thorny plants. It is swarming with Bog Mites, drawn to the decay.',
        connections: ['mire_of_sorrow'],
        activities: [
            { type: 'combat', monsterId: 'bog_mite' },
            { type: 'combat', monsterId: 'bog_mite' },
            { type: 'combat', monsterId: 'bog_mite' },
        ],
        regionId: 'sunken_lands',
        x: 1220, y: 1300
    },
    toadstool_bog: {
        id: 'toadstool_bog',
        name: 'Toadstool Bog',
        description: 'Giant, sickly-looking mushrooms grow in clusters here, releasing puffs of spores. A sluggish waterway is filled with black, slithering shapes.',
        connections: ['mire_of_sorrow', 'leech_infested_waters'],
        activities: [
            { type: 'combat', monsterId: 'giant_toad' },
            { type: 'skilling', id: 'toadstool_bog_fishing_1', name: 'Set Basket Trap', skill: SkillName.Fishing, requiredLevel: 38, loot: [{ itemId: 'raw_eel', chance: 1, xp: 70 }], resourceCount: { min: 3, max: 8 }, respawnTime: 20000, gatherTime: 2800, requiredTool: ToolType.BasketTrap },
        ],
        regionId: 'sunken_lands',
        x: 1320, y: 1340
    },
    leech_infested_waters: {
        id: 'leech_infested_waters',
        name: 'Leech-Infested Waters',
        description: 'The water here is particularly foul and writhing with leeches. However, this seems to be where the largest eels congregate.',
        connections: ['toadstool_bog'],
        activities: [
            { type: 'skilling', id: 'leech_bog_fishing_1', name: 'Set Basket Trap', skill: SkillName.Fishing, requiredLevel: 38, loot: [{ itemId: 'raw_eel', chance: 1, xp: 70 }], resourceCount: { min: 5, max: 10 }, respawnTime: 20000, gatherTime: 2800, requiredTool: ToolType.BasketTrap },
        ],
        regionId: 'sunken_lands',
        x: 1360, y: 1260
    },
    sunken_ruins: {
        id: 'sunken_ruins',
        name: 'Sunken Ruins',
        description: 'The crumbling stone ruins of an ancient structure jut out from the muck. A palpable aura of dread hangs over the area.',
        connections: ['submerged_pathway'],
        activities: [
            { type: 'combat', monsterId: 'swamp_horror' },
            { type: 'skilling', id: 'sunken_ruins_adamantite_1', name: 'Mine Adamantite Rock', skill: SkillName.Mining, requiredLevel: 65, loot: [{ itemId: 'adamantite_ore', chance: 1, xp: 120 }], resourceCount: { min: 1, max: 1 }, respawnTime: 50000, gatherTime: 5000 },
            { type: 'thieving_lockpick', id: 'sl_ruins_chest_1', targetName: 'Submerged Chest', lootTableId: 'thieving_dungeon_chest_mid' },
        ],
        regionId: 'sunken_lands',
        x: 1380, y: 1340
    },
    submerged_pathway: {
        id: 'submerged_pathway',
        name: 'Submerged Pathway',
        description: 'An ancient stone pathway, now mostly underwater. It offers a shortcut back to the swamp entrance, but also leads towards a dark, flooded crypt.',
        connections: ['sunken_ruins', 'tangled_entry', 'flooded_crypt_hallway'],
        activities: [],
        regionId: 'sunken_lands',
        x: 1280, y: 1400
    },
    flooded_crypt_hallway: {
        id: 'flooded_crypt_hallway',
        name: 'Flooded Hallway',
        description: 'The water is waist-deep here. Sarcophagi line the walls, their lids slightly ajar.',
        connections: ['submerged_pathway', 'flooded_crypt_chamber'],
        activities: [
            { type: 'combat', monsterId: 'swamp_horror' },
        ],
        regionId: 'sunken_lands',
        x: 1340, y: 1400
    },
    flooded_crypt_chamber: {
        id: 'flooded_crypt_chamber',
        name: 'Flooded Chamber',
        description: 'A central chamber containing a large, ornate sarcophagus. The water is deeper here. Something moves beneath the surface.',
        connections: ['flooded_crypt_hallway', 'serpents_coil_gate'],
        activities: [
            { type: 'combat', monsterId: 'swamp_horror' },
            { type: 'combat', monsterId: 'swamp_horror' },
            { type: 'thieving_lockpick', id: 'sl_crypt_chest_1', targetName: 'Sarcophagus Lockbox', lootTableId: 'thieving_dungeon_chest_mid' },
        ],
        regionId: 'sunken_lands',
        x: 1450, y: 1370
    },
    serpents_coil_gate: {
        id: 'serpents_coil_gate',
        name: "Serpent's Coil Gate",
        description: "A heavy, stone gate covered in serpent carvings. It is rusted shut and hums with a faint energy.",
        connections: ['flooded_crypt_chamber', 'serpents_coil_entrance'],
        activities: [],
        connectionRequirements: {
            serpents_coil_entrance: {
                skill: SkillName.Strength,
                level: 50,
                xp: 100,
                description: "The gate is heavy and rusted shut. You might be able to force it open with enough strength.",
                actionText: "Pushing open the rusted gates",
            }
        },
        regionId: 'sunken_lands',
        x: 1500, y: 1300,
    }
};