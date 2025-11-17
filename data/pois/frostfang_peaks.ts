
import { POI, SkillName } from '../../types';

export const frostfangPeaksPois: Record<string, POI> = {
    frostfang_peaks_base: {
        id: 'frostfang_peaks_base',
        name: 'Frostfang Peaks Base',
        description: 'The air grows cold as the path begins to ascend into a formidable mountain range. Peaks jut into the sky like jagged teeth.',
        connections: ['sanctity_south_gate', 'fp_foothills'],
        activities: [],
        regionId: 'frostfang_peaks',
        x: 1650, y: 1570,
    },
    fp_foothills: {
        id: 'fp_foothills',
        name: 'Frozen Foothills',
        description: 'The lower slopes are covered in snow and ice-dusted rocks. The wind has a sharp bite to it.',
        connections: ['frostfang_peaks_base', 'fp_wolf_pass', 'fp_frozen_stream'],
        activities: [
            { type: 'combat', monsterId: 'frostfang_wolf' },
            { type: 'skilling', id: 'fp_foothills_maple', name: 'Chop Maple', skill: SkillName.Woodcutting, requiredLevel: 45, loot: [{ itemId: 'maple_logs', chance: 1, xp: 100 }], resourceCount: { min: 1, max: 15 }, respawnTime: 30000, gatherTime: 4000 },
            { type: 'skilling', id: 'fp_foothills_iron', name: 'Mine Large Iron Rock', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 4, max: 10 }, respawnTime: 20000, gatherTime: 3000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1650, y: 1590,
    },
    fp_wolf_pass: {
        id: 'fp_wolf_pass',
        name: 'Wolf Pass',
        description: 'A narrow pass known for its resident wolf pack. Their howls echo off the icy walls.',
        connections: ['fp_foothills', 'fp_bear_cave', 'fp_nomad_camp'],
        activities: [
            { type: 'combat', monsterId: 'frostfang_wolf' },
            { type: 'combat', monsterId: 'frostfang_wolf' },
        ],
        regionId: 'frostfang_peaks',
        x: 1630, y: 1610,
    },
    fp_bear_cave: {
        id: 'fp_bear_cave',
        name: 'Glacial Bear Cave',
        description: 'A large, ice-rimmed cave entrance. A low growl from within suggests it is occupied.',
        connections: ['fp_wolf_pass'],
        activities: [
            { type: 'combat', monsterId: 'glacial_bear' },
            { type: 'skilling', id: 'fp_bear_cave_silver', name: 'Mine Large Silver Vein', skill: SkillName.Mining, requiredLevel: 35, loot: [{ itemId: 'silver_ore', chance: 1, xp: 40 }], resourceCount: { min: 8, max: 18 }, respawnTime: 18000, gatherTime: 4000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1610, y: 1590,
    },
    fp_nomad_camp: {
        id: 'fp_nomad_camp',
        name: 'Nomad Camp',
        description: 'A small, hardy group of nomads have made a camp here, huddled around a perpetually burning fire.',
        connections: ['fp_wolf_pass', 'fp_hoarfrost_trail'],
        activities: [
            { type: 'combat', monsterId: 'hoarfrost_nomad' }
        ],
        regionId: 'frostfang_peaks',
        x: 1610, y: 1630,
    },
    fp_hoarfrost_trail: {
        id: 'fp_hoarfrost_trail',
        name: 'Hoarfrost Trail',
        description: 'The trail is covered in a thick layer of frost that crunches underfoot.',
        connections: ['fp_nomad_camp'],
        activities: [
            { type: 'combat', monsterId: 'hoarfrost_nomad' },
            { type: 'combat', monsterId: 'hoarfrost_nomad' },
        ],
        regionId: 'frostfang_peaks',
        x: 1590, y: 1650,
    },
    fp_frozen_stream: {
        id: 'fp_frozen_stream',
        name: 'Frozen Stream',
        description: 'A stream, frozen solid. The ice is too thick to fish through. Ice Imps are drawn to the latent magic.',
        connections: ['fp_foothills', 'fp_ice_imp_clearing'],
        activities: [
            { type: 'combat', monsterId: 'ice_imp' },
            { type: 'skilling', id: 'fp_frozen_stream_iron', name: 'Mine Large Iron Vein', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 5, max: 12 }, respawnTime: 20000, gatherTime: 3000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1670, y: 1610,
    },
    fp_ice_imp_clearing: {
        id: 'fp_ice_imp_clearing',
        name: 'Ice Imp Clearing',
        description: 'A clearing where the air crackles with cold energy. Mischievous Ice Imps flit about.',
        connections: ['fp_frozen_stream', 'fp_serpent_trail'],
        activities: [
            { type: 'combat', monsterId: 'ice_imp' },
            { type: 'combat', monsterId: 'ice_imp' },
            { type: 'skilling', id: 'fp_ice_imp_maple', name: 'Chop Maple', skill: SkillName.Woodcutting, requiredLevel: 45, loot: [{ itemId: 'maple_logs', chance: 1, xp: 100 }], resourceCount: { min: 5, max: 20 }, respawnTime: 30000, gatherTime: 4000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1690, y: 1630,
    },
    fp_serpent_trail: {
        id: 'fp_serpent_trail',
        name: 'Serpent Trail',
        description: 'This icy trail is slick and treacherous. Rime-coated serpents bask on the frozen rocks.',
        connections: ['fp_ice_imp_clearing', 'fp_golem_fields'],
        activities: [
            { type: 'combat', monsterId: 'rime_coated_serpent' },
        ],
        regionId: 'frostfang_peaks',
        x: 1670, y: 1650,
    },
    fp_golem_fields: {
        id: 'fp_golem_fields',
        name: 'Golem Fields',
        description: 'A wide, open field where hulking Frost Golems wander aimlessly. The ground is rich with minerals.',
        connections: ['fp_serpent_trail', 'fp_yeti_ascent', 'fp_troll_outpost', 'fp_wyrms_approach', 'fp_ice_elemental_rift'],
        activities: [
            { type: 'combat', monsterId: 'frost_golem' },
            { type: 'skilling', id: 'fp_golem_gold', name: 'Mine Gold', skill: SkillName.Mining, requiredLevel: 40, loot: [{ itemId: 'gold_ore', chance: 1, xp: 65 }], resourceCount: { min: 1, max: 3 }, respawnTime: 60000, gatherTime: 4500 },
            { type: 'skilling', id: 'fp_golem_mithril', name: 'Mine Mithril', skill: SkillName.Mining, requiredLevel: 50, loot: [{ itemId: 'mithril_ore', chance: 1, xp: 80 }], resourceCount: { min: 1, max: 2 }, respawnTime: 20000, gatherTime: 4000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1650, y: 1670,
    },
    fp_ice_elemental_rift: {
        id: 'fp_ice_elemental_rift',
        name: 'Ice Elemental Rift',
        description: 'A deep crack in the earth from which raw magical cold emanates. Ice Elementals are drawn to this place.',
        connections: ['fp_golem_fields', 'fp_frozen_waterfall'],
        activities: [
            { type: 'combat', monsterId: 'ice_elemental' },
        ],
        regionId: 'frostfang_peaks',
        x: 1650, y: 1690,
    },
    fp_frozen_waterfall: {
        id: 'fp_frozen_waterfall',
        name: 'Frozen Waterfall',
        description: 'A massive waterfall, frozen solid in a cascade of ice. The sight is breathtaking.',
        connections: ['fp_ice_elemental_rift'],
        activities: [
            { type: 'combat', monsterId: 'ice_elemental' },
            { type: 'skilling', id: 'fp_waterfall_mithril', name: 'Mine Large Mithril Vein', skill: SkillName.Mining, requiredLevel: 60, loot: [{ itemId: 'mithril_ore', chance: 1, xp: 80 }], resourceCount: { min: 10, max: 25 }, respawnTime: 120000, gatherTime: 4000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1650, y: 1710,
    },
    fp_yeti_ascent: {
        id: 'fp_yeti_ascent',
        name: 'Yeti Ascent',
        description: 'The path grows steeper, leading into the territory of the fearsome Yetis.',
        connections: ['fp_golem_fields', 'fp_yeti_cave', 'fp_treacherous_ledge'],
        activities: [
            { type: 'combat', monsterId: 'yeti' },
            { type: 'skilling', id: 'fp_yeti_ascent_yew', name: 'Chop Yew', skill: SkillName.Woodcutting, requiredLevel: 65, loot: [{ itemId: 'yew_logs', chance: 1, xp: 175 }], resourceCount: { min: 1, max: 10 }, respawnTime: 60000, gatherTime: 5000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1630, y: 1690,
    },
    fp_treacherous_ledge: {
        id: 'fp_treacherous_ledge',
        name: 'Treacherous Ledge',
        description: 'A narrow, crumbling ledge overlooking a sheer drop. The wind howls threateningly.',
        connections: ['fp_yeti_ascent'],
        activities: [
            { type: 'combat', monsterId: 'tundra_stalker' }
        ],
        regionId: 'frostfang_peaks',
        x: 1610, y: 1670,
    },
    fp_yeti_cave: {
        id: 'fp_yeti_cave',
        name: 'Yeti Cave',
        description: 'A large cave filled with the bones of unfortunate creatures. Several Yetis call this place home.',
        connections: ['fp_yeti_ascent'],
        activities: [
            { type: 'combat', monsterId: 'yeti' },
            { type: 'combat', monsterId: 'yeti' },
            { type: 'skilling', id: 'fp_yeti_cave_gold', name: 'Mine Large Gold Vein', skill: SkillName.Mining, requiredLevel: 55, loot: [{ itemId: 'gold_ore', chance: 1, xp: 65 }], resourceCount: { min: 8, max: 15 }, respawnTime: 180000, gatherTime: 4500 },
        ],
        regionId: 'frostfang_peaks',
        x: 1630, y: 1710,
    },
    fp_troll_outpost: {
        id: 'fp_troll_outpost',
        name: 'Ice Troll Outpost',
        description: 'A crude outpost carved into the ice, inhabited by hulking Ice Trolls.',
        connections: ['fp_golem_fields', 'fp_shade_crypt', 'fp_abandoned_mine'],
        activities: [
            { type: 'combat', monsterId: 'ice_troll' },
            { type: 'skilling', id: 'fp_troll_adamantite', name: 'Mine Adamantite', skill: SkillName.Mining, requiredLevel: 65, loot: [{ itemId: 'adamantite_ore', chance: 1, xp: 120 }], resourceCount: { min: 1, max: 2 }, respawnTime: 45000, gatherTime: 5000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1670, y: 1690,
    },
    fp_abandoned_mine: {
        id: 'fp_abandoned_mine',
        name: 'Abandoned Mine Shaft',
        description: 'An old, frozen-over mine shaft. It seems to lead deeper into the mountain.',
        connections: ['fp_troll_outpost', 'fp_deep_mine'],
        activities: [
            { type: 'combat', monsterId: 'cryo_spider' }
        ],
        regionId: 'frostfang_peaks',
        x: 1690, y: 1710,
    },
    fp_deep_mine: {
        id: 'fp_deep_mine',
        name: 'Deep Mine',
        description: 'The mine shaft opens into a large cavern containing a rich vein of adamantite.',
        connections: ['fp_abandoned_mine'],
        activities: [
            { type: 'combat', monsterId: 'cryo_spider' },
            { type: 'skilling', id: 'fp_deep_mine_adamantite', name: 'Mine Large Adamantite Vein', skill: SkillName.Mining, requiredLevel: 70, loot: [{ itemId: 'adamantite_ore', chance: 1, xp: 120 }], resourceCount: { min: 12, max: 28 }, respawnTime: 240000, gatherTime: 5000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1710, y: 1730,
    },
    fp_shade_crypt: {
        id: 'fp_shade_crypt',
        name: 'Shade Crypt',
        description: 'An ancient, frozen crypt where the air is unnaturally still and cold. Frozen Shades glide silently through the chambers.',
        connections: ['fp_troll_outpost'],
        activities: [
            { type: 'combat', monsterId: 'frozen_shade' },
            { type: 'combat', monsterId: 'frozen_shade' },
        ],
        regionId: 'frostfang_peaks',
        x: 1690, y: 1670,
    },
    fp_wyrms_approach: {
        id: 'fp_wyrms_approach',
        name: 'Wyrm\'s Approach',
        description: 'The path becomes a sheet of slick ice, leading towards a massive cavern. The air is dangerously cold.',
        connections: ['fp_golem_fields', 'fp_wyrms_lair', 'fp_frozen_gate_path'],
        activities: [
            { type: 'combat', monsterId: 'tundra_stalker' },
            { type: 'combat', monsterId: 'tundra_stalker' },
            { type: 'skilling', id: 'fp_wyrm_yew', name: 'Chop Yew', skill: SkillName.Woodcutting, requiredLevel: 65, loot: [{ itemId: 'yew_logs', chance: 1, xp: 175 }], resourceCount: { min: 2, max: 22 }, respawnTime: 60000, gatherTime: 5000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1650, y: 1650,
    },
    fp_wyrms_lair: {
        id: 'fp_wyrms_lair',
        name: 'Glacial Wyrm\'s Lair',
        description: 'A colossal ice cavern, the lair of a mighty Glacial Wyrm. It guards a vast hoard of minerals.',
        connections: ['fp_wyrms_approach'],
        activities: [
            { type: 'combat', monsterId: 'glacial_wyrm' },
            { type: 'skilling', id: 'fp_wyrm_mithril', name: 'Mine Large Mithril Vein', skill: SkillName.Mining, requiredLevel: 60, loot: [{ itemId: 'mithril_ore', chance: 1, xp: 80 }], resourceCount: { min: 15, max: 30 }, respawnTime: 120000, gatherTime: 4000 },
            { type: 'skilling', id: 'fp_wyrm_gold', name: 'Mine Large Gold Vein', skill: SkillName.Mining, requiredLevel: 55, loot: [{ itemId: 'gold_ore', chance: 1, xp: 65 }], resourceCount: { min: 10, max: 20 }, respawnTime: 180000, gatherTime: 4500 },
        ],
        regionId: 'frostfang_peaks',
        x: 1630, y: 1630,
    },
    fp_frozen_gate_path: {
        id: 'fp_frozen_gate_path',
        name: 'Frozen Gate Path',
        description: 'A path of solid ice leads to a massive, magically sealed gate. The area is infested with Cryo-Spiders.',
        connections: ['fp_wyrms_approach', 'fp_frozen_gate'],
        activities: [
            { type: 'combat', monsterId: 'cryo_spider' },
            { type: 'combat', monsterId: 'cryo_spider' },
        ],
        regionId: 'frostfang_peaks',
        x: 1670, y: 1630,
    },
    fp_frozen_gate: {
        id: 'fp_frozen_gate',
        name: 'The Frozen Gate',
        description: 'A colossal gate of enchanted ice bars the way forward. It hums with immense power and is intensely cold to the touch.',
        connections: ['fp_frozen_gate_path'],
        activities: [
            {
                type: 'npc',
                name: 'Frozen Gate',
                icon: 'https://api.iconify.design/game-icons:locked-fortress.svg',
                dialogue: {
                    start: {
                        npcName: 'Frozen Gate',
                        npcIcon: 'https://api.iconify.design/game-icons:locked-fortress.svg',
                        text: "The gate hums with a powerful, chilling magic. A single, ornate keyhole glows with a cold, blue light.",
                        responses: [],
                        conditionalResponses: [
                            {
                                text: "(Pass through the unlocked gate)",
                                check: {
                                    requirements: [{ type: 'quest', questId: 'the_frozen_gate', status: 'completed' }],
                                    successNode: 'gate_unlocked',
                                    failureNode: 'fail_key' // Fallback, shouldn't be hit if visibility logic is correct.
                                }
                            },
                            {
                                text: "Use the Frostfang Key",
                                check: {
                                    requirements: [
                                        { type: 'quest', questId: 'the_frozen_gate', status: 'not_started' },
                                        { type: 'items', items: [{ itemId: 'frostfang_key', quantity: 1 }] }
                                    ],
                                    successNode: 'unlock_gate',
                                    failureNode: 'fail_key'
                                }
                            }
                        ]
                    },
                    unlock_gate: {
                        npcName: 'Frozen Gate',
                        npcIcon: 'https://api.iconify.design/game-icons:locked-fortress.svg',
                        text: "You insert the icy key. It melts into the lock as the gate groans open, revealing a path into the dragon's domain. The key is consumed and the gate is now permanently unlocked.",
                        responses: [
                            { text: "(Enter)", actions: [{ type: 'take_item', itemId: 'frostfang_key', quantity: 1 }, { type: 'complete_quest', questId: 'the_frozen_gate' }, { type: 'teleport', poiId: 'fp_roost_entrance' }] }
                        ]
                    },
                    fail_key: {
                        npcName: 'Frozen Gate',
                        npcIcon: 'https://api.iconify.design/game-icons:locked-fortress.svg',
                        text: "A key forged of enchanted ice seems to be required. The gate remains sealed.",
                        responses: []
                    },
                    gate_unlocked: {
                        npcName: 'Frozen Gate',
                        npcIcon: 'https://api.iconify.design/game-icons:locked-fortress.svg',
                        text: "The gate stands unlocked. Beyond this point lies the domain of the Frosthide Dragons. Be wary.",
                        responses: [
                            { text: "(Enter)", actions: [{ type: 'teleport', poiId: 'fp_roost_entrance' }] }
                        ]
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'frostfang_peaks',
        x: 1690, y: 1610,
    },
    // --- LOCKED AREA ---
    fp_roost_entrance: {
        id: 'fp_roost_entrance',
        name: 'Dragon\'s Roost Entrance',
        description: 'Beyond the gate, the temperature plummets. This is the domain of the adult Frosthide Dragons.',
        connections: ['fp_frozen_gate', 'fp_roost_lower'],
        activities: [
            { type: 'combat', monsterId: 'frosthide_dragon' },
        ],
        regionId: 'frostfang_peaks',
        x: 1710, y: 1590,
    },
    fp_roost_lower: {
        id: 'fp_roost_lower',
        name: 'Lower Roost',
        description: 'The lower nesting grounds of the Frosthide Dragons. The ground is littered with gnawed bones.',
        connections: ['fp_roost_entrance', 'fp_roost_mid', 'fp_roost_cave'],
        activities: [
            { type: 'combat', monsterId: 'frosthide_dragon' },
            { type: 'skilling', id: 'fp_roost_adamantite', name: 'Mine Adamantite', skill: SkillName.Mining, requiredLevel: 65, loot: [{ itemId: 'adamantite_ore', chance: 1, xp: 120 }], resourceCount: { min: 2, max: 6 }, respawnTime: 45000, gatherTime: 5000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1730, y: 1610,
    },
    fp_roost_cave: {
        id: 'fp_roost_cave',
        name: 'Roost Cave',
        description: 'A smaller cave where a dragon rests, guarding a rich mineral deposit.',
        connections: ['fp_roost_lower'],
        activities: [
            { type: 'combat', monsterId: 'frosthide_dragon' },
            { type: 'skilling', id: 'fp_roost_gold', name: 'Mine Large Gold Vein', skill: SkillName.Mining, requiredLevel: 55, loot: [{ itemId: 'gold_ore', chance: 1, xp: 65 }], resourceCount: { min: 10, max: 20 }, respawnTime: 180000, gatherTime: 4500 },
        ],
        regionId: 'frostfang_peaks',
        x: 1750, y: 1590,
    },
    fp_roost_mid: {
        id: 'fp_roost_mid',
        name: 'Middle Roost',
        description: 'The path continues its ascent up the frigid mountain.',
        connections: ['fp_roost_lower', 'fp_roost_upper'],
        activities: [
            { type: 'combat', monsterId: 'frosthide_dragon' },
        ],
        regionId: 'frostfang_peaks',
        x: 1750, y: 1630,
    },
    fp_roost_upper: {
        id: 'fp_roost_upper',
        name: 'Upper Roost',
        description: 'You are high above the clouds now. The air is thin and freezing.',
        connections: ['fp_roost_mid', 'fp_roost_summit', 'fp_dragon_hoard'],
        activities: [
            { type: 'combat', monsterId: 'frosthide_dragon' },
            { type: 'skilling', id: 'fp_roost_yew', name: 'Chop Ancient Yew', skill: SkillName.Woodcutting, requiredLevel: 65, loot: [{ itemId: 'yew_logs', chance: 1, xp: 175 }], resourceCount: { min: 10, max: 30 }, respawnTime: 90000, gatherTime: 5000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1730, y: 1650,
    },
    fp_dragon_hoard: {
        id: 'fp_dragon_hoard',
        name: "Dragon's Hoard",
        description: 'A secluded cave filled with a glittering hoard of coins and gems, guarded by a slumbering dragon.',
        connections: ['fp_roost_upper'],
        activities: [
            { type: 'combat', monsterId: 'frosthide_dragon' },
            { type: 'thieving_lockpick', id: 'fp_hoard_chest_1', targetName: "Dragon's Chest", lootTableId: 'thieving_dungeon_chest_elite' },
        ],
        regionId: 'frostfang_peaks',
        x: 1710, y: 1630,
    },
    fp_roost_summit: {
        id: 'fp_roost_summit',
        name: 'Roost Summit',
        description: 'The very peak of the mountain, home to the most powerful of the Frosthide Dragons and a vein of incredibly rare ore.',
        connections: ['fp_roost_upper'],
        activities: [
            { type: 'combat', monsterId: 'frosthide_dragon' },
            { type: 'combat', monsterId: 'frosthide_dragon' },
            { type: 'skilling', id: 'fp_summit_titanium', name: 'Mine Titanium Vein', skill: SkillName.Mining, requiredLevel: 75, loot: [{ itemId: 'titanium_ore', chance: 1, xp: 200 }], resourceCount: { min: 1, max: 1 }, respawnTime: 300000, gatherTime: 6000 },
        ],
        regionId: 'frostfang_peaks',
        x: 1750, y: 1670,
    },
};