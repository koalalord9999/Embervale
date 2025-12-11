import { POI, SkillName, ToolType } from '../../types';

export const oakhavenRoadPois: Record<string, POI> = {
    oakhaven_road_1: {
        id: 'oakhaven_road_1',
        name: 'Oakhaven Road',
        description: 'A dusty path winding through sparse woodland. The area is eerily quiet.',
        connections: ['dusty_crossroads', 'oakhaven_road_2', 'bandit_thicket', 'ruined_watchtower'],
        activities: [
            { type: 'combat', monsterId: 'cloaked_bandit' }
        ],
        regionId: 'wilderness',
        x: 1000, y: 1600
    },
    oakhaven_road_2: {
        id: 'oakhaven_road_2',
        name: 'Bandit\'s Toll',
        description: 'The road is wider here, but makeshift barricades suggest this is a common ambush point.',
        connections: ['oakhaven_road_1', 'oakhaven_north_gate'],
        activities: [
            { type: 'combat', monsterId: 'cloaked_bandit' }
        ],
        regionId: 'wilderness',
        x: 1000, y: 1700
    },
    kings_road_west_1: {
        id: 'kings_road_west_1',
        name: 'King\'s Road',
        description: 'The old King\'s Road is paved with cracked cobblestones, a testament to a more prosperous era. The road is eerily quiet, save for the wind.',
        connections: ['oakhaven_west_gate', 'broken_bridge', 'binding_altar'],
        activities: [
            { type: 'combat', monsterId: 'highwayman' }
        ],
        regionId: 'wilderness',
        x: 880, y: 1800
    },
    binding_altar: {
        id: 'binding_altar',
        name: 'Binding Altar',
        description: 'A mysterious stone altar humming with a low, arcane energy. It feels... foundational.',
        connections: ['kings_road_west_1'],
        activities: [
            { type: 'runecrafting_altar', runeId: 'binding_rune' }
        ],
        regionId: 'wilderness',
        x: 880, y: 1750,
    },
    broken_bridge: {
        id: 'broken_bridge',
        name: 'Broken Bridge',
        description: 'A wide chasm cuts across the road. A once-sturdy stone bridge has collapsed, leaving only shattered pillars. It is impossible to cross.',
        connections: ['kings_road_west_1', 'kings_road_west_2'],
        activities: [
            {
                type: 'npc',
                name: 'Investigate Debris',
                icon: 'https://api.iconify.design/game-icons:magnifying-glass.svg',
                questCondition: { questId: 'capitals_call', stages: [0] },
                startNode: 'investigate_debris_start'
            },
            {
                type: 'agility_shortcut',
                id: 'broken_bridge_leap',
                name: 'Leap Across Gap (Lvl 35)',
                toPoiId: 'kings_road_west_2',
                level: 35,
                xp: 40,
                baseFailChance: 80,
                failDamage: { min: 1, max: 5 },
                failMessage: 'You misjudge the jump and tumble down the edge, taking some damage.',
                successMessage: 'You leap across the chasm with surprising grace.'
            }
        ],
        connectionRequirements: {
            kings_road_west_2: {
                skill: SkillName.Strength,
                level: 99, // Effectively makes it impassable without quest completion
                xp: 0,
                description: "The bridge is out. The connection to the capital has been severed. It can only be repaired by completing 'The Capital's Call' quest.",
                actionText: "Cross"
            }
        },
        regionId: 'wilderness',
        x: 819, y: 1799,
    },
    kings_road_west_2: {
        id: 'kings_road_west_2',
        name: 'King\'s Road',
        description: 'Past the chasm, the road continues west. A rough, unmarked trail leads into a rocky outcrop to the north. The sense of being watched is stronger here.',
        connections: ['broken_bridge', 'silverhaven_outskirts', 'bandit_hideout_entrance'],
        activities: [
            { type: 'combat', monsterId: 'highwayman' },
            { type: 'combat', monsterId: 'highwayman' },
        ],
        regionId: 'wilderness',
        x: 760, y: 1800
    },
    silverhaven_outskirts: {
        id: 'silverhaven_outskirts',
        name: 'Silverhaven Outskirts',
        description: 'The road widens and becomes better maintained. In the distance, the tall walls and gleaming spires of a massive city are visible. A path branches north, crossing a wide, shimmering river.',
        connections: ['kings_road_west_2', 'silverhaven_gates', 'silver_river_crossing'],
        activities: [],
        regionId: 'wilderness',
        x: 700, y: 1800
    },
    silver_river_crossing: {
        id: 'silver_river_crossing',
        name: 'Silver River Crossing',
        description: 'A sturdy, wooden bridge spans the wide, fast-flowing Silver River. The air on the far side is noticeably drier and carries the tang of salt.',
        connections: ['silverhaven_outskirts', 'salt_flats_entrance'],
        activities: [
            { type: 'skilling', id: 'silver_river_bait_fishing', name: 'Bait Fish', skill: SkillName.Fishing, requiredLevel: 5, loot: [{ itemId: 'raw_sardine', chance: 1, xp: 20 }, { itemId: 'raw_herring', chance: 0.5, xp: 30, requiredLevel: 10 }, { itemId: 'raw_pike', chance: 0.1, xp: 80, requiredLevel: 25 }], resourceCount: { min: 5, max: 10 }, respawnTime: 8000, gatherTime: 1800, requiredTool: ToolType.FishingRod },
            { type: 'water_source', name: 'Collect Water' }
        ],
        regionId: 'wilderness',
        x: 567,
        y: 1700
    },
};