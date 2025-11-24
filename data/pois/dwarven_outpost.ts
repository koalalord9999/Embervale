


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
            { type: 'thieving_stall', id: 'dwarven_forge_dwarven_stall', name: 'Steal from Dwarven Stall', lootTableId: 'thieving_stall_dwarven' },
            { type: 'shop', shopId: 'dwarven_pickaxes' },
            {
                type: 'npc',
                name: 'Durin',
                icon: '/assets/npcChatHeads/prospector_gudrun.png',
                pickpocket: { lootTableId: 'pickpocket_dwarf_table' },
                attackableMonsterId: 'dwarf',
                startNode: 'durin_default',
                questTopics: ['the_arcane_awakening', 'depths_of_despair'],
                conditionalGreetings: [
                    // Depths of Despair (HIGHEST PRIORITY)
                    { text: "The tremors... they've stopped! By my ancestors, you're back! Did you find the source? Tell me everything!", check: { requirements: [{ type: 'quest', questId: 'depths_of_despair', status: 'in_progress', stage: 3 }] } },
                    { text: "The shaking has gotten worse! What are you doing back here? You must be close to the source. Get back down there and put a stop to it!", check: { requirements: [{ type: 'quest', questId: 'depths_of_despair', status: 'in_progress', stage: 2 }] } },
                    { text: "What are you doing back here? The source of the tremors is deep within that chasm, not up here! Be careful down there.", check: { requirements: [{ type: 'quest', questId: 'depths_of_despair', status: 'in_progress', stage: 1 }] } },
                    { text: "Still here? The tremors are getting worse! The entrance to the chasm is through our outpost mine. Get a move on!", check: { requirements: [{ type: 'quest', questId: 'depths_of_despair', status: 'in_progress', stage: 0 }] } },
                    { text: "Ah, the hero of the outpost! That pickaxe I forged for you... my finest work. The chasm is stable, and the mines are rich. We owe you a great debt.", check: { requirements: [{ type: 'quest', questId: 'depths_of_despair', status: 'completed' }] } },
                    { text: "*Durin looks worried, constantly checking the vibrations in the floor.* The whole outpost shakes like a jelly in a giant's hand!", check: { requirements: [{ type: 'quest', questId: 'depths_of_despair', status: 'not_started' }, { type: 'skill', skill: SkillName.Smithing, level: 40 }] } },

                    // The Arcane Awakening
                    { text: "Another gawker? If you're not here to buy a pickaxe, state your business and be on your way.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 3 }] } },
                    { text: "Still gathering the parts for that dampener? The Golem Cores are tough, but the Pearl is the real prize. Don't dawdle, the sky isn't getting any calmer.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 4 }] } },
                    { text: "Back so soon? Let me guess, you couldn't find the pearl?", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 5 }] } },
                ],
                dialogue: {
                    durin_default: {
                        npcName: 'Durin',
                        npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
                        text: "If it's a pickaxe you need, you've come to the right place. Finest in the land.",
                        responses: []
                    }
                }
             },
             { type: 'ground_item', id: 'dwarven_forge_nail', itemId: 'rusty_nail', resourceCount: 1, respawnTimer: 180000 },
        ],
        regionId: 'dwarven_outpost',
        x: 250, y: 600,
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
            { type: 'skilling', id: 'outpost_silver_1', name: 'Mine Silver Rock', skill: SkillName.Mining, requiredLevel: 20, loot: [{ itemId: 'silver_ore', chance: 1, xp: 40 }], resourceCount: { min: 2, max: 4 }, respawnTime: 18000, gatherTime: 4000 },
            { type: 'thieving_lockpick', id: 'do_mine_chest_1', targetName: 'Dwarven Footlocker', lootTableId: 'thieving_dungeon_chest_mid' },
        ],
        regionId: 'dwarven_outpost',
        x: 250, y: 650,
        type: 'internal',
    },
};
