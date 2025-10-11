import { POI, SkillName } from '../../types';

export const dwarvenOutpostPois: Record<string, POI> = {
    dwarven_outpost_entrance: {
        id: 'dwarven_outpost_entrance',
        name: 'Dwarven Outpost Entrance',
        description: 'A sturdy, stone archway reinforced with thick wooden beams leads into a small dwarven settlement. The air smells of coal smoke and roasted meat.',
        connections: ['mine_depths', 'dwarven_forge'],
        activities: [],
        regionId: 'wilderness',
        x: 1400, y: 1200,
        cityMapX: 250, cityMapY: 450,
    },
    dwarven_forge: {
        id: 'dwarven_forge',
        name: 'Dwarven Forge',
        description: 'A small but well-kept forge. A bearded dwarf with soot on his face tends to the flames, offering a selection of fine pickaxes.',
        connections: ['dwarven_outpost_entrance', 'outpost_mine'],
        activities: [
            { type: 'shop', shopId: 'dwarven_pickaxes' },
            {
                type: 'npc',
                name: 'Durin',
                icon: '/assets/npcChatHeads/prospector_gudrun.png',
             }
        ],
        regionId: 'dwarven_outpost',
        x: 250, y: 300,
        type: 'internal',
    },
    outpost_mine: {
        id: 'outpost_mine',
        name: 'Outpost Mine',
        description: 'A small, rich vein of minerals the dwarves are excavating. A newly opened passage leads into darkness.',
        connections: ['dwarven_forge', 'chasm_of_woe_entrance'],
        activities: [
            { type: 'skilling', id: 'outpost_large_copper_1', name: 'Mine Large Copper Vein', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'copper_ore', chance: 1, xp: 18 }], resourceCount: { min: 4, max: 10 }, respawnTime: 15000, gatherTime: 2500 },
            { type: 'skilling', id: 'outpost_large_tin_1', name: 'Mine Large Tin Vein', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'tin_ore', chance: 1, xp: 18 }], resourceCount: { min: 4, max: 10 }, respawnTime: 15000, gatherTime: 2500 },
            { type: 'skilling', id: 'outpost_large_iron_1', name: 'Mine Large Iron Vein', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 4, max: 10 }, respawnTime: 20000, gatherTime: 3000 },
            { type: 'skilling', id: 'outpost_large_iron_2', name: 'Mine Large Iron Vein', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 4, max: 10 }, respawnTime: 20000, gatherTime: 3000 },
            { type: 'skilling', id: 'outpost_large_coal_1', name: 'Mine Large Coal Vein', skill: SkillName.Mining, requiredLevel: 45, loot: [{ itemId: 'coal', chance: 1, xp: 50 }], resourceCount: { min: 4, max: 10 }, respawnTime: 25000, gatherTime: 3500 },
            { type: 'skilling', id: 'outpost_large_coal_2', name: 'Mine Large Coal Vein', skill: SkillName.Mining, requiredLevel: 45, loot: [{ itemId: 'coal', chance: 1, xp: 50 }], resourceCount: { min: 4, max: 10 }, respawnTime: 25000, gatherTime: 3500 },
            { type: 'skilling', id: 'outpost_large_coal_3', name: 'Mine Large Coal Vein', skill: SkillName.Mining, requiredLevel: 45, loot: [{ itemId: 'coal', chance: 1, xp: 50 }], resourceCount: { min: 4, max: 10 }, respawnTime: 25000, gatherTime: 3500 },
        ],
        regionId: 'dwarven_outpost',
        x: 250, y: 150,
        type: 'internal',
    },
};
