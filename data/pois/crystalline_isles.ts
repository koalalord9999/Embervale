import { POI, SkillName } from '../../types';

export const crystallineIslesPois: Record<string, POI> = {
    crystalline_isles_landing: {
        id: 'crystalline_isles_landing',
        name: 'Skyship Landing',
        description: 'You step off the skyship onto a platform of pure, shimmering crystal. The air is thin and cold, and the world stretches out far below you. A single path leads away from the landing.',
        connections: ['crystalline_path_1'],
        activities: [
            {
                type: 'npc',
                name: 'Skyship Captain',
                icon: '/assets/npcChatHeads/ferryman_silas.png',
                startNode: 'captain_isles_default',
            }
        ],
        regionId: 'crystalline_isles',
        x: 1869, y: 1030
    },
    // Outer Loop
    crystalline_path_1: {
        id: 'crystalline_path_1',
        name: 'Crystalline Path (South)',
        description: 'The path is made of smooth, translucent crystal. Strange, docile creatures graze on mineral growths.',
        connections: ['crystalline_isles_landing', 'crystalline_path_2'],
        activities: [
            { type: 'combat', monsterId: 'crystal_grazer' },
        ],
        regionId: 'crystalline_isles',
        x: 1870, y: 985
    },
    crystalline_path_2: {
        id: 'crystalline_path_2',
        name: 'Crystalline Path (South-West)',
        description: 'The path continues along the edge of the floating island. A narrower, more treacherous-looking path branches off toward the island\'s interior.',
        connections: ['crystalline_path_1', 'crystalline_path_3', 'inner_path_A1'],
        activities: [
             { type: 'skilling', id: 'ci_maple_1', name: 'Chop Maple Tree', skill: SkillName.Woodcutting, requiredLevel: 45, loot: [{ itemId: 'maple_logs', chance: 1, xp: 100 }], resourceCount: { min: 1, max: 2 }, respawnTime: 30000, gatherTime: 4000 },
        ],
        regionId: 'crystalline_isles',
        x: 1678, y: 947
    },
    crystalline_path_3: {
        id: 'crystalline_path_3',
        name: 'Crystalline Path (West)',
        description: 'The view of the endless sky is dizzying from this vantage point.',
        connections: ['crystalline_path_2', 'crystalline_path_4'],
        activities: [
             { type: 'combat', monsterId: 'shard_golem' },
// FIX: Removed redundant level, xp, and respawnTime properties.
             { type: 'thieving_lockpick', id: 'ci_chest_1', targetName: 'Glimmering Chest', lootTableId: 'thieving_dungeon_chest_high' },
        ],
        regionId: 'crystalline_isles',
        x: 1569, y: 802
    },
    crystalline_path_4: {
        id: 'crystalline_path_4',
        name: 'Crystalline Path (West)',
        description: 'A large formation of coal is embedded in the crystal wall of the path. Another path leads inwards.',
        connections: ['crystalline_path_3', 'crystalline_path_5', 'inner_path_B1'],
        activities: [
            { type: 'skilling', id: 'ci_coal_1', name: 'Mine Coal', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'coal', chance: 1, xp: 50 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 3500 },
        ],
        regionId: 'crystalline_isles',
        x: 1560, y: 696
    },
    crystalline_path_5: {
        id: 'crystalline_path_5',
        name: 'Crystalline Path (North-West)',
        description: 'The path curves northwards. A grove of hardy oak and maple trees grow here, their roots fused with the crystal.',
        connections: ['crystalline_path_4', 'crystalline_path_6'],
        activities: [
             { type: 'skilling', id: 'ci_oak_1', name: 'Chop Oak Tree', skill: SkillName.Woodcutting, requiredLevel: 15, loot: [{ itemId: 'oak_logs', chance: 1, xp: 65 }], resourceCount: { min: 2, max: 4 }, respawnTime: 18000, gatherTime: 3000 },
             { type: 'skilling', id: 'ci_maple_2', name: 'Chop Maple Tree', skill: SkillName.Woodcutting, requiredLevel: 45, loot: [{ itemId: 'maple_logs', chance: 1, xp: 100 }], resourceCount: { min: 1, max: 2 }, respawnTime: 30000, gatherTime: 4000 },
        ],
        regionId: 'crystalline_isles',
        x: 1648, y: 544
    },
    crystalline_path_6: {
        id: 'crystalline_path_6',
        name: 'Crystalline Path (North)',
        description: 'You are at the northernmost point of the island\'s main path.',
        connections: ['crystalline_path_5', 'crystalline_path_7'],
        activities: [
            { type: 'combat', monsterId: 'crystal_grazer' },
        ],
        regionId: 'crystalline_isles',
        x: 1842, y: 499
    },
    crystalline_path_7: {
        id: 'crystalline_path_7',
        name: 'Crystalline Path (North-East)',
        description: 'The path begins to slope downwards. A sharply angled path of jagged crystals leads toward the center.',
        connections: ['crystalline_path_6', 'crystalline_path_8', 'inner_path_C1'],
        activities: [
            { type: 'combat', monsterId: 'shard_golem' },
        ],
        regionId: 'crystalline_isles',
        x: 2054, y: 582
    },
    crystalline_path_8: {
        id: 'crystalline_path_8',
        name: 'Crystalline Path (East)',
        description: 'The air hums with a faint, musical energy here.',
        connections: ['crystalline_path_7', 'crystalline_path_9'],
        activities: [
             { type: 'skilling', id: 'ci_coal_2', name: 'Mine Coal', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'coal', chance: 1, xp: 50 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 3500 },
// FIX: Removed redundant level, xp, and respawnTime properties.
             { type: 'thieving_lockpick', id: 'ci_chest_2', targetName: 'Floating Chest', lootTableId: 'thieving_dungeon_chest_high' },
        ],
        regionId: 'crystalline_isles',
        x: 2139, y: 753
    },
    crystalline_path_9: {
        id: 'crystalline_path_9',
        name: 'Crystalline Path (South-East)',
        description: 'The path levels out, leading back toward the skyship landing.',
        connections: ['crystalline_path_8', 'crystalline_isles_landing'],
        activities: [
             { type: 'combat', monsterId: 'crystal_grazer' },
        ],
        regionId: 'crystalline_isles',
        x: 2053, y: 882
    },
    // Inner Paths
    inner_path_A1: {
        id: 'inner_path_A1',
        name: 'Jagged Shard Pass',
        description: 'The path is narrow and flanked by sharp crystal shards. It feels much more dangerous here.',
        connections: ['crystalline_path_2', 'inner_path_A2'],
        activities: [
            { type: 'combat', monsterId: 'crystal_scuttler' },
        ],
        regionId: 'crystalline_isles',
        x: 1682, y: 812
    },
    inner_path_A2: {
        id: 'inner_path_A2',
        name: 'Fractured Plain',
        description: 'A wide, flat area of cracked crystal. The path splits here.',
        connections: ['inner_path_A1', 'inner_path_A3', 'inner_path_B2'],
        activities: [
            { type: 'combat', monsterId: 'crystalline_tortoise' },
            { type: 'combat', monsterId: 'crystal_scuttler' },
        ],
        regionId: 'crystalline_isles',
        x: 1789, y: 880
    },
    inner_path_A3: {
        id: 'inner_path_A3',
        name: 'Glimmering Chasm',
        description: 'A deep chasm cuts through the island. A narrow crystal bridge is the only way across.',
        connections: ['inner_path_A2', 'the_heartcrystal'],
        activities: [],
        regionId: 'crystalline_isles',
        x: 1892, y: 859
    },
    inner_path_B1: {
        id: 'inner_path_B1',
        name: 'Resonant Rise',
        description: 'The path climbs steeply. The air vibrates with a low hum.',
        connections: ['crystalline_path_4', 'inner_path_B2'],
        activities: [
            { type: 'combat', monsterId: 'crystal_scuttler' },
        ],
        regionId: 'crystalline_isles',
        x: 1671, y: 747
    },
    inner_path_B2: {
        id: 'inner_path_B2',
        name: 'Central Plateau',
        description: 'A large, open plateau in the island\'s interior.',
        connections: ['inner_path_B1', 'inner_path_A2'],
        activities: [
            { type: 'combat', monsterId: 'shard_golem' },
            { type: 'combat', monsterId: 'crystalline_tortoise' },
        ],
        regionId: 'crystalline_isles',
        x: 1790, y: 728
    },
    inner_path_C1: {
        id: 'inner_path_C1',
        name: 'Whispering Spire',
        description: 'A colossal crystal spire towers above you, emitting a faint, whispering sound.',
        connections: ['crystalline_path_7', 'inner_path_C2'],
        activities: [],
        regionId: 'crystalline_isles',
        x: 1888, y: 615
    },
    inner_path_C2: {
        id: 'inner_path_C2',
        name: 'Heartcrystal Approach',
        description: 'The path leads directly towards the island\'s core.',
        connections: ['inner_path_C1', 'the_heartcrystal'],
        activities: [],
        regionId: 'crystalline_isles',
        x: 1865, y: 727
    },
    the_heartcrystal: {
        id: 'the_heartcrystal',
        name: 'The Heartcrystal',
        description: 'The center of the Crystalline Isles. A single, gigantic crystal pulses with a brilliant, internal light, the source of the island\'s power.',
        connections: ['inner_path_A3', 'inner_path_C2', 'magus_spire_entrance'],
        activities: [
            { type: 'combat', monsterId: 'ancient_ammonite' },
        ],
        regionId: 'crystalline_isles',
        x: 1954, y: 767
    },
    magus_spire_entrance: {
        id: 'magus_spire_entrance',
        name: "Magus Spire Entrance",
        description: 'A shimmering, ethereal doorway hangs in the air before the Heartcrystal, leading into a towering spire of pure magic.',
        connections: ['the_heartcrystal', 'ms_f1_antechamber'],
        activities: [
            {
                type: 'npc',
                name: 'Enter the Spire',
                icon: 'https://api.iconify.design/game-icons:rune-gate.svg',
                questCondition: { questId: 'the_arcane_awakening', stages: [7] },
                startNode: 'enter_spire_start',
            }
        ],
        regionId: 'magus_spire',
        x: 1954, y: 720,
    },
};