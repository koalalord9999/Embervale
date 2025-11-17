
import { POI, SkillName, ToolType } from '../../types';

export const sunbrightPlainsPois: Record<string, POI> = {
    sunbright_plains_start: {
        id: 'sunbright_plains_start',
        name: 'Sunbright Plains',
        description: 'Rolling green hills stretch out under a bright, clear sky. The air is fresh and clean. A path leads south to Sanctity and north into the plains.',
        connections: ['sanctity_north_gate', 'sp_rolling_hills', 'sp_shepherds_path'],
        activities: [
            { type: 'combat', monsterId: 'cow' },
            { type: 'combat', monsterId: 'wild_boar' },
            { type: 'skilling', id: 'sp_start_oak_1', name: 'Chop Oak', skill: SkillName.Woodcutting, requiredLevel: 15, loot: [{ itemId: 'oak_logs', chance: 1, xp: 65 }], resourceCount: { min: 1, max: 34 }, respawnTime: 18000, gatherTime: 3000 },
        ],
        regionId: 'sunbright_plains',
        x: 1650, y: 1450,
    },
    // --- Southern Plains (Lvl 15-25) ---
    sp_rolling_hills: {
        id: 'sp_rolling_hills',
        name: 'Rolling Hills',
        description: 'Gentle, grassy hills dominate the landscape. It\'s peaceful here, though you can hear the howls of wolves in the distance.',
        connections: ['sunbright_plains_start', 'sp_wolf_den', 'sp_shepherds_path'],
        activities: [
            { type: 'combat', monsterId: 'wolf' },
            { type: 'skilling', id: 'sp_hills_iron_1', name: 'Mine Iron', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 1, max: 1 }, respawnTime: 8000, gatherTime: 3000 },
        ],
        regionId: 'sunbright_plains', x: 1630, y: 1430,
    },
    sp_wolf_den: {
        id: 'sp_wolf_den',
        name: 'Wolf Den',
        description: 'A shallow cave littered with bones. A small pack of wolves claims this area as their territory.',
        connections: ['sp_rolling_hills', 'sunbright_cave_entrance'],
        activities: [
            { type: 'combat', monsterId: 'wolf' },
            { type: 'combat', monsterId: 'wolf' },
        ],
        regionId: 'sunbright_plains', x: 1610, y: 1438,
    },
    sunbright_cave_entrance: {
        id: 'sunbright_cave_entrance',
        name: 'Cave Entrance',
        description: 'A dark, gaping hole in the side of a hill. A crude ladder descends into the darkness.',
        connections: ['sp_wolf_den'],
        activities: [
            { type: 'ladder', name: 'Descend into Cave', direction: 'down', toPoiId: 'suc_entrance' }
        ],
        regionId: 'sunbright_plains',
        x: 1580, y: 1438,
    },
    sp_shepherds_path: {
        id: 'sp_shepherds_path',
        name: 'Shepherd\'s Path',
        description: 'A well-worn dirt path winding through the hills. An abandoned farmstead lies to the east.',
        connections: ['sunbright_plains_start', 'sp_rolling_hills', 'sp_old_farmstead', 'sp_river_bend'],
        activities: [
            { type: 'combat', monsterId: 'wild_boar' },
        ],
        regionId: 'sunbright_plains', x: 1670, y: 1430,
    },
    sp_old_farmstead: {
        id: 'sp_old_farmstead',
        name: 'Old Farmstead',
        description: 'The crumbling remains of a small farm. A few aggressive boars root through the overgrown fields.',
        connections: ['sp_shepherds_path'],
        activities: [
            { type: 'combat', monsterId: 'wild_boar' },
            { type: 'combat', monsterId: 'wild_boar' },
            { type: 'thieving_lockpick', id: 'sp_farm_chest_1', targetName: 'Rotting Chest', lootTableId: 'thieving_dungeon_chest_low' },
        ],
        regionId: 'sunbright_plains', x: 1690, y: 1438,
    },
    // --- Central Plains (Lvl 25-35) ---
    sp_river_bend: {
        id: 'sp_river_bend',
        name: 'River Bend',
        description: 'A wide, slow-moving river bend. An excellent spot for fishing.',
        connections: ['sp_shepherds_path', 'sp_plains_crossroads', 'sp_bear_woods', 'sp_eel_pond'],
        activities: [
            { type: 'skilling', id: 'sp_river_fishing_1', name: 'Fly Fish', skill: SkillName.Fishing, requiredLevel: 20, loot: [{ itemId: 'raw_trout', xp: 50, chance: 1 }, { itemId: 'raw_pike', xp: 70, chance: 0.3, requiredLevel: 30 }], resourceCount: { min: 8, max: 15 }, respawnTime: 15000, gatherTime: 2200, requiredTool: ToolType.FlyFishingRod },
            { type: 'water_source', name: 'Collect Water' }
        ],
        regionId: 'sunbright_plains', x: 1670, y: 1410,
    },
    sp_bear_woods: {
        id: 'sp_bear_woods',
        name: 'Bear Woods',
        description: 'A small, dense patch of woods known to be inhabited by bears.',
        connections: ['sp_river_bend'],
        activities: [
            { type: 'combat', monsterId: 'bear' },
            { type: 'skilling', id: 'sp_bear_woods_willow_1', name: 'Chop Willow', skill: SkillName.Woodcutting, requiredLevel: 30, loot: [{ itemId: 'willow_logs', chance: 1, xp: 90 }], resourceCount: { min: 1, max: 30 }, respawnTime: 25000, gatherTime: 3500 },
        ],
        regionId: 'sunbright_plains', x: 1690, y: 1390,
    },
    sp_plains_crossroads: {
        id: 'sp_plains_crossroads',
        name: 'Plains Crossroads',
        description: 'A crossroads in the heart of the plains. Paths lead in all directions.',
        connections: ['sp_river_bend', 'sp_lions_savanna', 'sp_rocky_outcrop', 'sp_zealots_plateau'],
        activities: [
            { type: 'combat', monsterId: 'highwayman' },
        ],
        regionId: 'sunbright_plains', x: 1650, y: 1390,
    },
    sp_lions_savanna: {
        id: 'sp_lions_savanna',
        name: 'Lion\'s Savanna',
        description: 'The terrain opens into a wide, grassy savanna. Lions stalk through the tall grass.',
        connections: ['sp_plains_crossroads', 'sp_sunstone_quarry', 'sp_serpents_gulch'],
        activities: [
            { type: 'combat', monsterId: 'plains_lion' },
            { type: 'combat', monsterId: 'plains_lion' },
        ],
        regionId: 'sunbright_plains', x: 1670, y: 1370,
    },
    sp_rocky_outcrop: {
        id: 'sp_rocky_outcrop',
        name: 'Rocky Outcrop',
        description: 'A cluster of large rocks provides a break from the open plains. It is rich in coal and silver.',
        connections: ['sp_plains_crossroads', 'sp_abandoned_watchtower', 'sp_maple_grove'],
        activities: [
            { type: 'skilling', id: 'sp_rocky_coal_1', name: 'Mine Coal', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'coal', chance: 1, xp: 50 }], resourceCount: { min: 2, max: 5 }, respawnTime: 12000, gatherTime: 3500 },
            { type: 'skilling', id: 'sp_rocky_silver_1', name: 'Mine Large Silver', skill: SkillName.Mining, requiredLevel: 35, loot: [{ itemId: 'silver_ore', chance: 1, xp: 40 }], resourceCount: { min: 10, max: 20 }, respawnTime: 18000, gatherTime: 4000 },
        ],
        regionId: 'sunbright_plains', x: 1630, y: 1370,
    },
    sp_abandoned_watchtower: {
        id: 'sp_abandoned_watchtower',
        name: 'Abandoned Watchtower',
        description: 'The crumbling remains of an old watchtower. It\'s now a haven for bandits.',
        connections: ['sp_rocky_outcrop'],
        activities: [
            { type: 'combat', monsterId: 'highwayman' },
            { type: 'combat', monsterId: 'highwayman' },
            { type: 'thieving_lockpick', id: 'sp_watchtower_chest_1', targetName: 'Bandit Chest', lootTableId: 'thieving_dungeon_chest_low' },
        ],
        regionId: 'sunbright_plains', x: 1610, y: 1350,
    },
    // --- Northern Plains (Lvl 35-50) ---
    sp_sunstone_quarry: {
        id: 'sp_sunstone_quarry',
        name: 'Sunstone Quarry',
        description: 'An old quarry where the rocks glitter with sunstones. Golems formed from the quarry\'s stone patrol the area.',
        connections: ['sp_lions_savanna'],
        activities: [
            { type: 'combat', monsterId: 'sunstone_golem' },
            { type: 'skilling', id: 'sp_quarry_gold_1', name: 'Mine Gold', skill: SkillName.Mining, requiredLevel: 40, loot: [{ itemId: 'gold_ore', chance: 1, xp: 65 }], resourceCount: { min: 1, max: 1 }, respawnTime: 60000, gatherTime: 4500 },
        ],
        regionId: 'sunbright_plains', x: 1690, y: 1350,
    },
    sp_serpents_gulch: {
        id: 'sp_serpents_gulch',
        name: 'Serpent\'s Gulch',
        description: 'A winding, rocky gulch that is noticeably warmer than the surrounding plains. Sun-warmed serpents bask on the rocks.',
        connections: ['sp_lions_savanna', 'sp_rocs_nest'],
        activities: [
            { type: 'combat', monsterId: 'sunscale_serpent' },
            { type: 'combat', monsterId: 'sunscale_serpent' },
        ],
        regionId: 'sunbright_plains', x: 1650, y: 1350,
    },
    sp_rocs_nest: {
        id: 'sp_rocs_nest',
        name: 'Roc\'s Nest',
        description: 'A high, windy plateau where giant birds of prey have made their nests.',
        connections: ['sp_serpents_gulch'],
        activities: [
            { type: 'combat', monsterId: 'roc_hatchling' },
        ],
        regionId: 'sunbright_plains', x: 1630, y: 1330,
    },
    sp_zealots_plateau: {
        id: 'sp_zealots_plateau',
        name: 'Zealot\'s Plateau',
        description: 'A secluded plateau, accessible only by a hidden path. Fanatical nomads wander here, guarding something sacred.',
        connections: ['sp_plains_crossroads', 'sp_passage_altar'],
        activities: [
            { type: 'combat', monsterId: 'zealous_nomad' },
        ],
        regionId: 'sunbright_plains', x: 1650, y: 1310,
    },
    sp_passage_altar: {
        id: 'sp_passage_altar',
        name: 'Passage Altar',
        description: 'An ancient altar that pulses with a chaotic, restless energy.',
        connections: ['sp_zealots_plateau'],
        activities: [
            { type: 'runecrafting_altar', runeId: 'passage_rune' },
        ],
        regionId: 'sunbright_plains', x: 1670, y: 1290,
    },
    sp_maple_grove: {
        id: 'sp_maple_grove',
        name: 'Maple Grove',
        description: 'A quiet grove of maple trees. Excellent for woodcutting.',
        connections: ['sp_rocky_outcrop'],
        activities: [
            { type: 'skilling', id: 'sp_maple_1', name: 'Chop Maple', skill: SkillName.Woodcutting, requiredLevel: 45, loot: [{ itemId: 'maple_logs', chance: 1, xp: 100 }], resourceCount: { min: 2, max: 35 }, respawnTime: 30000, gatherTime: 4000 },
            { type: 'skilling', id: 'sp_maple_2', name: 'Chop Maple', skill: SkillName.Woodcutting, requiredLevel: 45, loot: [{ itemId: 'maple_logs', chance: 1, xp: 100 }], resourceCount: { min: 2, max: 35 }, respawnTime: 30000, gatherTime: 4000 },
        ],
        regionId: 'sunbright_plains', x: 1610, y: 1390,
    },
    sp_eel_pond: {
        id: 'sp_eel_pond',
        name: 'Eel Pond',
        description: 'A murky, secluded pond where eels are known to congregate.',
        connections: ['sp_river_bend'],
        activities: [
            { type: 'skilling', id: 'sp_eel_fishing_1', name: 'Set Basket Trap', skill: SkillName.Fishing, requiredLevel: 38, loot: [{ itemId: 'raw_eel', chance: 1, xp: 70 }], resourceCount: { min: 13, max: 24 }, respawnTime: 20000, gatherTime: 2800, requiredTool: ToolType.BasketTrap },
        ],
        regionId: 'sunbright_plains', x: 1710, y: 1410,
    },
    sp_ancient_dueling_ground: {
        id: 'sp_ancient_dueling_ground',
        name: 'Ancient Dueling Ground',
        description: 'A circular, flat-topped hill, strangely devoid of vegetation. The ground is scarred with ancient weapon marks. Three small pedestals stand in a triangle at its center.',
        connections: ['sp_zealots_plateau'],
        activities: [],
        regionId: 'sunbright_plains',
        x: 1650, y: 1280,
    },
};
