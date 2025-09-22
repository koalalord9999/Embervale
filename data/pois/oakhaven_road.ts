import { POI, SkillName } from '../../types';

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
        activities: [],
        regionId: 'wilderness',
        x: 819, y: 1799,
        connectionRequirements: {
            kings_road_west_2: {
                skill: SkillName.Woodcutting,
                level: 40,
                xp: 1000,
                description: "The chasm is too wide to jump. With enough logs and rope, and a high enough skill level, you might be able to construct a makeshift crossing.",
                actionText: "Repair Bridge",
                items: [ { itemId: 'logs', quantity: 20 }, { itemId: 'rope', quantity: 5 } ]
            }
        },
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
};