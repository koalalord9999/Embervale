
import { POI, SkillName } from '../../types';

export const goblinDungeonPois: Record<string, POI> = {
    warrens_entrance: {
        id: 'warrens_entrance',
        name: "Goblin Warrens Entrance",
        description: "A crudely carved tunnel entrance smelling of filth and damp rock. Guttural shouts echo from within.",
        connections: ['mine_depths', 'warrens_hall_1'],
        activities: [
            { type: 'combat', monsterId: 'goblin' },
        ],
        regionId: 'goblin_dungeon',
        x: 1500, y: 940
    },
    warrens_hall_1: {
        id: 'warrens_hall_1',
        name: "Hub of Grime",
        description: "A wide cavern serving as a central hub. Several tunnels branch off into the darkness. The floor is slick with filth.",
        connections: ['warrens_entrance', 'warrens_barracks_1', 'warrens_tunnel_A', 'warrens_tunnel_B', 'warrens_chasm_crossing'],
        activities: [
            { type: 'combat', monsterId: 'goblin_scout' },
        ],
        regionId: 'goblin_dungeon',
        x: 1600, y: 940
    },
    warrens_barracks_1: {
        id: 'warrens_barracks_1',
        name: "Stinking Barracks",
        description: "Piles of molding straw and gnawed bones serve as beds. The stench is overpowering.",
        connections: ['warrens_hall_1', 'warrens_loop_passage'],
        activities: [
            { type: 'combat', monsterId: 'goblin_scout' },
            { type: 'combat', monsterId: 'goblin' },
// FIX: Removed redundant level, xp, and respawnTime properties.
            { type: 'thieving_lockpick', id: 'gb_barracks_chest_1', targetName: 'Grimy Chest', lootTableId: 'thieving_dungeon_chest_low' },
            { type: 'ground_item', id: 'gb_barracks_mail', itemId: 'goblin_mail', resourceCount: 1, respawnTimer: 600000 },
        ],
        regionId: 'goblin_dungeon',
        x: 1640, y: 880
    },
    warrens_tunnel_A: {
        id: 'warrens_tunnel_A',
        name: "Tight Squeeze",
        description: "A tight squeeze of a tunnel. The walls are slick with an unknown grime. You hear a growl from the shadows.",
        connections: ['warrens_hall_1', 'warrens_pitfall_chamber'],
        activities: [
            { type: 'combat', monsterId: 'goblin_scout' }
        ],
        regionId: 'goblin_dungeon',
        x: 1680, y: 940
    },
    warrens_tunnel_B: {
        id: 'warrens_tunnel_B',
        name: "Meandering Path",
        description: "This tunnel twists and turns, making it difficult to keep your bearings.",
        connections: ['warrens_hall_1', 'warrens_crossroads'],
        activities: [
            { type: 'combat', monsterId: 'goblin_thrower' }
        ],
        regionId: 'goblin_dungeon',
        x: 1640, y: 1000
    },
    warrens_pitfall_chamber: {
        id: 'warrens_pitfall_chamber',
        name: "The Rickety Bridge",
        description: "A crude wooden plank bridges a dark, seemingly bottomless pit. Cold air rises from the depths.",
        connections: ['warrens_tunnel_A', 'warrens_tunnel_C', 'warrens_loop_passage'],
        activities: [],
        regionId: 'goblin_dungeon',
        x: 1740, y: 940
    },
    warrens_tunnel_C: {
        id: 'warrens_tunnel_C',
        name: "Whispering Passage",
        description: "Every sound you make seems to amplify, returning as faint whispers from multiple directions.",
        connections: ['warrens_pitfall_chamber', 'warrens_crossroads'],
        activities: [ { type: 'combat', monsterId: 'goblin_thrower' } ],
        regionId: 'goblin_dungeon',
        x: 1740, y: 1000
    },
    warrens_crossroads: {
        id: 'warrens_crossroads',
        name: "Fungus-Lit Crossroads",
        description: "A major intersection in the warrens, dimly lit by patches of glowing fungus. It seems well-trafficked.",
        connections: ['warrens_tunnel_B', 'warrens_tunnel_C', 'warrens_brute_den', 'warrens_storage_cave'],
        activities: [
            { type: 'combat', monsterId: 'goblin_brute' }
        ],
        regionId: 'goblin_dungeon',
        x: 1700, y: 1060
    },
    warrens_brute_den: {
        id: 'warrens_brute_den',
        name: "Den of Shattered Bones",
        description: "A large, cleared area with a massive pile of shattered, splintered bones in the corner. Something big lives here.",
        connections: ['warrens_crossroads'],
        activities: [
            { type: 'combat', monsterId: 'goblin_brute' },
            { type: 'combat', monsterId: 'goblin_brute' },
// FIX: Removed redundant level, xp, and respawnTime properties.
            { type: 'thieving_lockpick', id: 'gb_brute_chest_1', targetName: 'Bone Chest', lootTableId: 'thieving_dungeon_chest_low' },
        ],
        regionId: 'goblin_dungeon',
        x: 1678, y: 1084
    },
    warrens_storage_cave: {
        id: 'warrens_storage_cave',
        name: "Plunder Storage",
        description: "Sacks and barrels of stolen goods are piled high here, guarded by vigilant goblins.",
        connections: ['warrens_crossroads', 'warrens_back_tunnel'],
        activities: [
            { type: 'combat', monsterId: 'goblin_scout' },
            { type: 'combat', monsterId: 'goblin_thrower' },
            { type: 'skilling', id: 'warrens_mithril_1', name: 'Mine Mithril Rock', skill: SkillName.Mining, requiredLevel: 50, loot: [{ itemId: 'mithril_ore', chance: 1, xp: 80 }], resourceCount: { min: 1, max: 2 }, respawnTime: 20000, gatherTime: 4000 },
            { type: 'skilling', id: 'warrens_mithril_2', name: 'Mine Mithril Rock', skill: SkillName.Mining, requiredLevel: 50, loot: [{ itemId: 'mithril_ore', chance: 1, xp: 80 }], resourceCount: { min: 1, max: 2 }, respawnTime: 20000, gatherTime: 4000 },
// FIX: Removed redundant level, xp, and respawnTime properties.
            { type: 'thieving_lockpick', id: 'gb_storage_chest_1', targetName: 'Plunder Chest', lootTableId: 'thieving_dungeon_chest_mid' },
        ],
        regionId: 'goblin_dungeon',
        x: 1760, y: 1120
    },
     warrens_back_tunnel: {
        id: 'warrens_back_tunnel',
        name: "Fungus-Lined Passage",
        description: "Patches of eerie, glowing fungi cast a dim light on the damp walls.",
        connections: ['warrens_storage_cave', 'warrens_dead_end'],
        activities: [ { type: 'combat', monsterId: 'goblin' } ],
        regionId: 'goblin_dungeon',
        x: 1820, y: 1120
    },
    warrens_dead_end: {
        id: 'warrens_dead_end',
        name: "Collapsed Tunnel",
        description: "The tunnel is blocked by a massive rockfall here. It seems to be a dead end.",
        connections: ['warrens_back_tunnel', 'warrens_throne_approach'],
        activities: [],
        connectionRequirements: {
            warrens_throne_approach: {
                skill: SkillName.Mining,
                level: 40,
                xp: 1000,
                description: "The rockfall is unstable, but with enough skill you might be able to clear a path, creating a shortcut.",
                actionText: "Mine Shortcut"
            }
        },
        regionId: 'goblin_dungeon',
        x: 1880, y: 1120
    },
     warrens_throne_approach: {
        id: 'warrens_throne_approach',
        name: "Guarded Hallway",
        description: "This hallway is wider and surprisingly cleaner than the others. The faint sound of clanging metal can be heard from the far end. Two imposing guards stand watch.",
        connections: ['warrens_dead_end', 'warrens_throne_room', 'warrens_brute_gauntlet'],
        activities: [
            { type: 'combat', monsterId: 'goblin_brute' },
            { type: 'combat', monsterId: 'goblin_brute' },
        ],
        regionId: 'goblin_dungeon',
        x: 1880, y: 1060
    },
    warrens_throne_room: {
        id: 'warrens_throne_room',
        name: "The Junk-Heap Throne",
        description: "A large cavern dominated by a throne made of junk and bones. Upon it sits a goblin larger and more menacing than any you've seen.",
        connections: ['warrens_throne_approach', 'flux_altar'],
        activities: [
            { type: 'combat', monsterId: 'grumlok_goblin_king' },
// FIX: Removed redundant level, xp, and respawnTime properties.
            { type: 'thieving_lockpick', id: 'gb_throne_chest_1', targetName: 'King\'s Chest', lootTableId: 'thieving_dungeon_chest_mid' },
        ],
        regionId: 'goblin_dungeon',
        x: 1880, y: 1000
    },
    warrens_loop_passage: {
        id: 'warrens_loop_passage',
        name: "The Looping Passage",
        description: "This passage looks identical to one you've already been through... or does it?",
        connections: ['warrens_barracks_1', 'warrens_pitfall_chamber'],
        activities: [
            { type: 'combat', monsterId: 'goblin_scout' },
        ],
        regionId: 'goblin_dungeon',
        x: 1700, y: 880
    },
    // New Long Path to Boss Room
    warrens_chasm_crossing: {
        id: 'warrens_chasm_crossing',
        name: "Chasm Crossing",
        description: "A deep chasm splits this cavern. A narrow, crumbling ledge hugs one wall, offering a treacherous path to the other side.",
        connections: ['warrens_hall_1', 'warrens_ambush_point'],
        activities: [
            { type: 'combat', monsterId: 'goblin_thrower' }
        ],
        regionId: 'goblin_dungeon',
        x: 1599, y: 1073
    },
    warrens_ambush_point: {
        id: 'warrens_ambush_point',
        name: "Ambush Point",
        description: "The tunnel opens into a small chamber with many pillars and rock formations, perfect for an ambush. A narrow passage seems to loop back the way you came.",
        connections: ['warrens_chasm_crossing', 'warrens_false_hope', 'warrens_barracks_1'], // One-way connection to barracks_1
        activities: [
            { type: 'combat', monsterId: 'goblin_brute' },
            { type: 'combat', monsterId: 'goblin_scout' }
        ],
        regionId: 'goblin_dungeon',
        x: 1638, y: 1113
    },
    warrens_false_hope: {
        id: 'warrens_false_hope',
        name: "False Hope",
        description: "This cavern seems better constructed. The path splits here. One path looks well-trodden, but the other, smaller tunnel looks suspiciously familiar...",
        connections: ['warrens_ambush_point', 'warrens_brute_gauntlet', 'warrens_tunnel_A'], // One-way connection to tunnel_A
        activities: [],
        regionId: 'goblin_dungeon',
        x: 1700, y: 1192
    },
    warrens_brute_gauntlet: {
        id: 'warrens_brute_gauntlet',
        name: "Brute's Gauntlet",
        description: "A long, wide hallway. Several large alcoves line the walls, perfect hiding spots for something big.",
        connections: ['warrens_false_hope', 'warrens_throne_approach'],
        activities: [
            { type: 'combat', monsterId: 'goblin_brute' },
            { type: 'combat', monsterId: 'goblin_brute' }
        ],
        regionId: 'goblin_dungeon',
        x: 1800, y: 1140
    },
    flux_altar: {
        id: 'flux_altar',
        name: 'Altar of Chaos',
        description: 'A cracked, unstable-looking altar that seems to warp the air around it. It radiates a volatile, chaotic energy.',
        connections: ['warrens_throne_room'],
        activities: [
            { type: 'runecrafting_altar', runeId: 'flux_rune' }
        ],
        regionId: 'goblin_dungeon',
        x: 1920, y: 960,
    },
};
