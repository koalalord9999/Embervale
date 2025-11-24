
import { POI, SkillName } from '../../types';

export const chasmOfWoePois: Record<string, POI> = {
    chasm_of_woe_entrance: {
        id: 'chasm_of_woe_entrance',
        name: 'Chasm of Woe Entrance',
        description: 'A newly-opened passage in the outpost mine leads to a dark, foreboding chasm. The air is cold and heavy.',
        connections: ['outpost_mine'],
        activities: [
            {
                type: 'npc',
                name: 'Enter the Chasm',
                icon: 'https://api.iconify.design/game-icons:cave-entrance.svg',
                questCondition: { questId: 'depths_of_despair', stages: [0] },
                startNode: 'dod_enter_chasm',
            },
            {
                type: 'ladder',
                name: 'Descend into the Chasm',
                direction: 'down',
                toPoiId: 'chasm_ledge_1',
                questCondition: {
                    questId: 'depths_of_despair',
                    stages: [1, 2, 3],
                    visibleAfterCompletion: true
                }
            }
        ],
        regionId: 'dwarven_outpost',
        x: 1118,
        y: 1257,
        type: 'internal',
    },
    chasm_ledge_1: {
        id: 'chasm_ledge_1',
        name: 'Chasm Ledge',
        description: 'A narrow ledge clings to the chasm wall. Strange, chitinous creatures scuttle in the shadows. A ladder leads back up to the outpost mine.',
        connections: ['chasm_rope_bridge'],
        activities: [
            { type: 'ladder', name: 'Climb back to Outpost', direction: 'up', toPoiId: 'chasm_of_woe_entrance' },
            { type: 'combat', monsterId: 'chasm_crawler' },
            { type: 'skilling', id: 'chasm_ledge_gold_1', name: 'Mine Gold Rock', skill: SkillName.Mining, requiredLevel: 40, loot: [{ itemId: 'gold_ore', chance: 1, xp: 65 }], resourceCount: { min: 1, max: 2 }, respawnTime: 60000, gatherTime: 4500 },
            { type: 'thieving_lockpick', id: 'cwoe_chest_1', targetName: 'Miner\'s Satchel', lootTableId: 'thieving_dungeon_chest_mid' },
            { type: 'ground_item', id: 'chasm_ledge_rope', itemId: 'rope', resourceCount: 1, respawnTimer: 600000 },
        ],
        regionId: 'chasm_of_woe',
        x: 826,
        y: 1335,
        type: 'internal',
    },
    chasm_rope_bridge: {
        id: 'chasm_rope_bridge',
        name: 'Rope Bridge',
        description: 'A rickety rope bridge spans a seemingly bottomless pit.',
        connections: ['chasm_ledge_1', 'chasm_central_cavern'],
        activities: [
            { type: 'combat', monsterId: 'rock_golem' }
        ],
        regionId: 'chasm_of_woe',
        x: 817,
        y: 1498,
        type: 'internal',
    },
    chasm_central_cavern: {
        id: 'chasm_central_cavern',
        name: 'Central Cavern',
        description: 'A large cavern, the source of the tremors. A path leads to a crystalline alcove, while a larger passage continues deeper.',
        connections: ['chasm_rope_bridge', 'crystal_alcove', 'earth_render_lair'],
        activities: [
            { type: 'combat', monsterId: 'rock_golem' },
            { type: 'combat', monsterId: 'chasm_crawler' }
        ],
        regionId: 'chasm_of_woe',
        x: 821,
        y: 1760,
        type: 'internal',
    },
    crystal_alcove: {
        id: 'crystal_alcove',
        name: 'Crystal Alcove',
        description: 'A dead-end alcove filled with rare mineral deposits, fiercely guarded.',
        connections: ['chasm_central_cavern'],
        activities: [
            { type: 'combat', monsterId: 'rock_golem' },
            { type: 'skilling', id: 'chasm_adamantite_1', name: 'Mine Adamantite Rock', skill: SkillName.Mining, requiredLevel: 65, loot: [{ itemId: 'adamantite_ore', chance: 1, xp: 120 }], resourceCount: { min: 1, max: 2 }, respawnTime: 60000, gatherTime: 5000 },
            { type: 'skilling', id: 'chasm_titanium_1', name: 'Mine Titanium', skill: SkillName.Mining, requiredLevel: 75, loot: [{ itemId: 'titanium_ore', chance: 1, xp: 200 }], resourceCount: { min: 1, max: 2 }, respawnTime: 300000, gatherTime: 6000 },
            { type: 'thieving_lockpick', id: 'cwoe_chest_2', targetName: 'Geode Chest', lootTableId: 'thieving_dungeon_chest_high' }
        ],
        unlockRequirement: { type: 'quest', questId: 'depths_of_despair', stage: 4 },
        regionId: 'chasm_of_woe',
        x: 781,
        y: 1698,
        type: 'internal',
    },
    earth_render_lair: {
        id: 'earth_render_lair',
        name: 'The Earth-Render\'s Lair',
        description: 'The heart of the chasm. A colossal golem made of earth and rare minerals stands dormant, radiating immense power.',
        connections: ['chasm_central_cavern'],
        activities: [
            {
                type: 'npc',
                name: 'Approach the Golem',
                icon: 'https://api.iconify.design/game-icons:rock-golem.svg',
                questCondition: { questId: 'depths_of_despair', stages: [1] },
                startNode: 'dod_approach_golem',
            },
            { type: 'thieving_lockpick', id: 'cwoe_chest_3', targetName: 'Ancient Dwarven Chest', lootTableId: 'thieving_dungeon_chest_elite' }
        ],
        regionId: 'chasm_of_woe',
        x: 873,
        y: 1692,
        type: 'internal',
    }
};
