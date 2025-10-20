import { POI, SkillName, ToolType } from '../../types';

export const southernRoadPois: Record<string, POI> = {
    south_meadow_road: {
        id: 'south_meadow_road',
        name: 'South Meadow Road',
        description: 'A dusty road leading south from Meadowdale. A smaller path branches off towards a ranch.',
        connections: ['meadowdale_south_gate', 'dusty_crossroads'],
        activities: [
            { type: 'skilling', id: 'south_meadow_road_tree', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 1, max: 2 }, respawnTime: 12000, gatherTime: 2000 },
            { type: 'skilling', id: 'south_meadow_road_tree_2', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 1, max: 2 }, respawnTime: 12000, gatherTime: 2000 },
        ],
        regionId: 'wilderness',
        x: 1000, y: 1200
    },
    dusty_crossroads: {
        id: 'dusty_crossroads',
        name: 'Dusty Crossroads',
        description: 'The road splits here. A weathered signpost points west to a farm, east towards a swamp, and north to Oakhaven.',
        connections: ['south_meadow_road', 'abandoned_farmstead', 'boggy_trail', 'oakhaven_road_1'],
        activities: [
            { type: 'skilling', id: 'dusty_crossroads_tree', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 1, max: 2 }, respawnTime: 12000, gatherTime: 2000 },
        ],
        regionId: 'wilderness',
        x: 1000, y: 1400
    },
    abandoned_farmstead: {
        id: 'abandoned_farmstead',
        name: 'Abandoned Farmstead',
        description: 'A derelict farmhouse stands silently, its windows like hollow eyes. The fields are overgrown and webs cover everything.',
        connections: ['dusty_crossroads'],
        activities: [
            { type: 'combat', monsterId: 'giant_spider' },
            { type: 'combat', monsterId: 'giant_spider' },
            { type: 'combat', monsterId: 'giant_spider' },
            { type: 'combat', monsterId: 'giant_spider' },
// FIX: Removed redundant level, xp, and respawnTime properties.
            { type: 'thieving_lockpick', id: 'af_drawer_1', targetName: 'Dusty Drawer', lootTableId: 'thieving_house_drawer_dusty' },
        ],
        regionId: 'wilderness',
        x: 900, y: 1400
    },
    boggy_trail: {
        id: 'boggy_trail',
        name: 'Boggy Trail',
        description: 'The ground becomes soft and muddy. The air is thick with the smell of damp earth and decay. A wall of thick, thorny vines blocks a path deeper into the wetlands.',
        connections: ['dusty_crossroads', 'murkwallow_swamp', 'tangled_entry'],
        activities: [],
        connectionRequirements: {
            tangled_entry: {
                skill: SkillName.Woodcutting,
                level: 20,
                xp: 250,
                description: "A wall of thick, thorny vines blocks the path east. You'll need a sharp axe and a strong arm to get through.",
                actionText: "Chop Through Vines"
            }
        },
        regionId: 'wilderness',
        x: 1100, y: 1400
    },
    murkwallow_swamp: {
        id: 'murkwallow_swamp',
        name: 'Murkwallow Swamp',
        description: 'A foul-smelling swamp stretches out before you. Croaking sounds echo across the stagnant water. There is no path forward.',
        connections: ['boggy_trail', 'lonely_cabin'],
        activities: [
            { type: 'skilling', id: 'murkwallow_fishing', name: 'Bait Fish', skill: SkillName.Fishing, requiredLevel: 5, loot: [{ itemId: 'raw_sardine', chance: 1, xp: 20 }, { itemId: 'raw_herring', chance: 0.5, xp: 30, requiredLevel: 10 }], resourceCount: { min: 5, max: 10 }, respawnTime: 8000, gatherTime: 1800, requiredTool: ToolType.FishingRod }
        ],
        regionId: 'wilderness',
        x: 1200, y: 1460
    },
    lonely_cabin: {
        id: 'lonely_cabin',
        name: 'Lonely Cabin',
        description: 'A small, isolated cabin stands on stilts at the edge of the swamp. It appears to be a dead end.',
        connections: ['murkwallow_swamp'],
        activities: [
             {
                type: 'npc',
                name: 'Old Man Hemlock',
                icon: '/assets/npcChatHeads/old_man_hemlock.png',
// FIX: Removed redundant level, xp, stunChance, and stunDuration properties.
                pickpocket: { lootTableId: 'pickpocket_farmer_table' },
                dialogue: {
                    start: {
                        npcName: 'Old Man Hemlock',
                        npcIcon: '/assets/npcChatHeads/old_man_hemlock.png',
                        text: "Get off my property! Unless you've got something to trade...\n\nThe swamp... it remembers. Best not to disturb what sleeps in the deep muck.\n\nHeard tell of ruins deeper in. Sunken, they are. Full of things that haven't seen the sun in a thousand years.",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'wilderness',
        x: 1260, y: 1500
    },
    ruined_watchtower: {
        id: 'ruined_watchtower',
        name: 'Ruined Watchtower',
        description: 'The crumbling remains of an old watchtower overlook the road. A strange, oppressive heat radiates from a glowing brazier at its peak. It is guarded by a lone bandit.',
        connections: ['oakhaven_road_1'],
        activities: [
            { type: 'combat', monsterId: 'cloaked_bandit' },
            { type: 'runecrafting_altar', runeId: 'ember_rune' }
        ],
        regionId: 'wilderness',
        x: 1060, y: 1640
    },
    bandit_thicket: {
        id: 'bandit_thicket',
        name: "Bandit's Thicket",
        description: 'A dense thicket of trees and bushes beside the road. An ideal spot for an ambush.',
        connections: ['oakhaven_road_1'],
        activities: [
            { type: 'combat', monsterId: 'cloaked_bandit' },
            { type: 'combat', monsterId: 'cloaked_bandit' }
        ],
        regionId: 'wilderness',
        x: 940, y: 1640
    },
};