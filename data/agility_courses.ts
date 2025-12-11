
import { AgilityCourse } from '../types';

const MEADOWDALE_ROOFTOP_COURSE: AgilityCourse = {
    id: 'meadowdale_rooftops',
    name: 'Meadowdale Rooftop Course',
    level: 1,
    lapBonusXp: 50,
    energyRestore: 20,
    obstacles: [
        { id: 'mrc_1', name: 'Rough Wall Climb', level: 1, xp: 10, duration: 3, failMessage: "You lose your grip and slide back down the wall." },
        { id: 'mrc_2', name: 'Clothesline Walk', level: 1, xp: 12, failDamage: { min: 1, max: 2 }, duration: 4, failPoiId: 'north_meadow_street', failMessage: "You lose your balance on the clothesline and fall to the street below." },
        { id: 'mrc_3', name: 'Rooftop Gap Jump', level: 1, xp: 15, failDamage: { min: 1, max: 3 }, duration: 6, failPoiId: 'west_meadow_street', failMessage: "You misjudge the distance and fall short of the next roof." },
        { id: 'mrc_4', name: 'Chimney Squeeze', level: 1, xp: 15, duration: 4, canFail: false },
        { id: 'mrc_5', name: 'Slide Down Roof', level: 1, xp: 0, duration: 3, successPoiId: 'south_meadow_street', canFail: false },
    ]
};

const VERDANT_FIELDS_TRAVERSE: AgilityCourse = {
    id: 'verdant_fields_traverse',
    name: 'Verdant Fields Traverse',
    level: 25,
    lapBonusXp: 250,
    energyRestore: 100,
    obstacles: [
        { id: 'vft_1', name: 'Barn Hayloft Climb', level: 25, xp: 20, duration: 4, failPoiId: 'mcgregors_ranch', failMessage: "You lose your grip on the hay and fall back to the ground." },
        { id: 'vft_2', name: 'Barn Roof Leap', level: 25, xp: 25, failDamage: { min: 1, max: 3 }, duration: 3, failPoiId: 'mcgregors_ranch', failMessage: "You misjudge the distance and land hard in the ranch yard." },
        { id: 'vft_3', name: 'Trough Balance', level: 25, xp: 30, duration: 5, failPoiId: 'cow_pasture', failMessage: "You slip on the slick wood and fall into the muddy cattle trough." },
        { id: 'vft_4', name: 'Slippery Log Cross', level: 25, xp: 40, failDamage: { min: 2, max: 5 }, duration: 6, failPoiId: 'winding_brook_north', failMessage: "The log is too slick! You fall into the chilly brook and are washed downstream." },
        { id: 'vft_5', name: 'Grassy Knoll Scramble', level: 25, xp: 35, duration: 4, failPoiId: 'verdant_crossroads', failMessage: "You lose your footing on the steep grass and tumble back down to the crossroads." },
        { id: 'vft_6', name: 'Rock Gap Jump', level: 25, xp: 50, failDamage: { min: 3, max: 6 }, duration: 3, failPoiId: 'rocky_highlands', failMessage: "The gap is wider than it looks! You fall between the rocks, taking some damage." },
        { id: 'vft_7', name: "Shepherd's Peak Climb", level: 25, xp: 60, failDamage: { min: 4, max: 8 }, duration: 7, failPoiId: 'rocky_highlands', failMessage: "Your handhold crumbles! You take a long fall back down to the highlands below." },
        { id: 'vft_8', name: 'Stone Pillar Squeeze', level: 25, xp: 45, duration: 4, canFail: false },
        { id: 'vft_9', name: 'Standing Stones Leap', level: 25, xp: 0, duration: 3, successPoiId: 'verdant_crossroads', canFail: false },
    ]
};

const OAKHAVEN_ARTISANS_RUN: AgilityCourse = {
    id: 'oakhaven_artisans_run',
    name: "Oakhaven Artisan's Run",
    level: 12,
    lapBonusXp: 120,
    energyRestore: 25,
    obstacles: [
        { id: 'oar_1', name: 'Tannery Beam Walk', level: 12, xp: 15, duration: 4, failPoiId: 'oakhaven_crafting_district', failMessage: "You slip off the slick tanning beam." },
        { id: 'oar_2', name: 'Lumber Pile Climb', level: 12, xp: 18, duration: 3, canFail: false },
        { id: 'oar_3', name: 'Rooftop Clothesline', level: 12, xp: 20, failDamage: { min: 1, max: 2 }, duration: 5, failPoiId: 'oakhaven_market', failMessage: "You lose your balance and tumble into the market stalls below." },
        { id: 'oar_4', name: 'Market Awning Jump', level: 12, xp: 22, failDamage: { min: 1, max: 3 }, duration: 3, failPoiId: 'oakhaven_square', failMessage: "The awning rips and you fall into the square." },
        { id: 'oar_5', name: 'Tavern Sign Swing', level: 12, xp: 25, failDamage: { min: 2, max: 4 }, duration: 4, failPoiId: 'oakhaven_tavern_street', failMessage: "The sign's hinge breaks and you land in a heap." },
        { id: 'oar_6', name: 'Chimney Squeeze', level: 12, xp: 20, duration: 4, canFail: false },
        { id: 'oar_7', name: 'Slide Down Awning', level: 12, xp: 0, duration: 2, canFail: false, successPoiId: 'oakhaven_crafting_district' },
    ]
};

const FOUTHIA_ROOFTOP_RUN: AgilityCourse = {
    id: 'fouthia_rooftop_run',
    name: "Fouthia Rooftop Run",
    level: 35,
    lapBonusXp: 380,
    energyRestore: 35,
    obstacles: [
        { id: 'frr_1', name: 'Sandstone Wall Scramble', level: 35, xp: 30, duration: 5, failMessage: "The crumbling sandstone gives way under your grip." },
        { id: 'frr_2', name: 'Market Awning Leap', level: 35, xp: 35, failDamage: { min: 2, max: 4 }, duration: 3, failPoiId: 'fouthia_bazaar', failMessage: "You bounce off the awning and land in a pile of exotic spices." },
        { id: 'frr_3', name: 'Rope Swing Across Alley', level: 35, xp: 40, failDamage: { min: 3, max: 6 }, duration: 5, failPoiId: 'fouthia_back_alleys', failMessage: "The rope snaps mid-swing, sending you plummeting into the alley." },
        { id: 'frr_4', name: 'Tightrope Walk', level: 35, xp: 45, failDamage: { min: 2, max: 5 }, duration: 7, failPoiId: 'fouthia_main_street', failMessage: "A gust of wind knocks you off the rope." },
        { id: 'frr_5', name: 'Palm Tree Hop', level: 35, xp: 40, failDamage: { min: 1, max: 4 }, duration: 4, failPoiId: 'fouthia_square', failMessage: "You miss the palm frond and land unceremoniously in the town square." },
        { id: 'frr_6', name: 'Window Ledge Shimmy', level: 35, xp: 38, duration: 6, canFail: false },
        { id: 'frr_7', name: 'Banner Slide', level: 35, xp: 32, duration: 3, canFail: false },
        { id: 'frr_8', name: 'Balcony Vault', level: 35, xp: 40, duration: 3, failMessage: "You stumble during the vault and have to start over." },
        { id: 'frr_9', name: 'Gap Jump', level: 35, xp: 48, failDamage: { min: 3, max: 7 }, duration: 3, failPoiId: 'fouthia_garrison_road', failMessage: "You don't quite make the jump and fall hard." },
        { id: 'frr_10', name: 'Sand Pile Landing', level: 35, xp: 0, duration: 2, canFail: false, successPoiId: 'fouthia_back_alleys' },
    ]
};

const SANCTITY_CATHEDRAL_CLIMB: AgilityCourse = {
    id: 'sanctity_cathedral_climb',
    name: "Sanctity Cathedral Climb",
    level: 46,
    lapBonusXp: 550,
    energyRestore: 40,
    obstacles: [
        { id: 'scc_1', name: 'Wall Ledge Scramble', level: 46, xp: 40, duration: 4 },
        { id: 'scc_2', name: 'Aqueduct Balance', level: 46, xp: 50, failDamage: { min: 3, max: 6 }, duration: 7, failPoiId: 'sanctity_south_district' },
        { id: 'scc_3', name: 'Buttress Run', level: 46, xp: 55, duration: 5 },
        { id: 'scc_4', name: 'Stained Glass Leap', level: 46, xp: 60, failDamage: { min: 4, max: 8 }, duration: 3, failPoiId: 'sanctity_north_district' },
        { id: 'scc_5', name: 'Gargoyle Hop', level: 46, xp: 58, duration: 4 },
        { id: 'scc_6', name: 'Chapel Spire Climb', level: 46, xp: 70, failDamage: { min: 5, max: 10 }, duration: 8, failPoiId: 'sanctity_square' },
        { id: 'scc_7', name: 'Bell Tower Rope Swing', level: 46, xp: 65, duration: 5 },
        { id: 'scc_8', name: 'Steeple Shimmy', level: 46, xp: 62, duration: 6, canFail: false },
        { id: 'scc_9', name: 'Banner Slide', level: 46, xp: 50, duration: 3, canFail: false },
        { id: 'scc_10', name: 'Leap of Faith', level: 46, xp: 0, duration: 2, canFail: false, successPoiId: 'sanctity_square' },
    ]
};

const SILVERHAVEN_CASTLE_RUN: AgilityCourse = {
    id: 'silverhaven_castle_run',
    name: "Silverhaven Castle Run",
    level: 70,
    lapBonusXp: 900,
    energyRestore: 50,
    obstacles: [
        { id: 'scr_1', name: 'Castle Wall Run', level: 70, xp: 70, duration: 6 },
        { id: 'scr_2', name: 'Parapet Leap', level: 70, xp: 75, failDamage: { min: 5, max: 10 }, duration: 3, failPoiId: 'silverhaven_castle_approach' },
        { id: 'scr_3', name: 'Watchtower Climb', level: 70, xp: 80, duration: 5 },
        { id: 'scr_4', name: 'Spire Leap', level: 70, xp: 90, failDamage: { min: 6, max: 12 }, duration: 4, failPoiId: 'silverhaven_slayers_spire' },
        { id: 'scr_5', name: 'Trade District Rooftop Dash', level: 70, xp: 85, duration: 7 },
        { id: 'scr_6', name: 'Market Awning Slide', level: 70, xp: 78, duration: 4, failPoiId: 'silverhaven_trade_district' },
        { id: 'scr_7', name: 'Library Bookshelf Climb', level: 70, xp: 82, duration: 6, canFail: false },
        { id: 'scr_8', name: 'Dockside Crane Swing', level: 70, xp: 100, failDamage: { min: 8, max: 15 }, duration: 5, failPoiId: 'silverhaven_docks' },
        { id: 'scr_9', name: 'Ship Rigging Net Climb', level: 70, xp: 95, duration: 7 },
        { id: 'scr_10', name: 'Mast Balance', level: 70, xp: 110, failDamage: { min: 5, max: 10 }, duration: 8, failPoiId: 'silverhaven_fish_market' },
        { id: 'scr_11', name: 'Rope Slide to Square', level: 70, xp: 80, duration: 4, canFail: false },
        { id: 'scr_12', name: 'Fountain Landing', level: 70, xp: 0, duration: 2, successPoiId: 'silverhaven_square', canFail: false },
    ]
};

const SALT_FLATS_SKELETON_RUN: AgilityCourse = {
    id: 'salt_flats_skeleton_run',
    name: "Salt Flats Skeleton Run",
    level: 30,
    lapBonusXp: 300,
    energyRestore: 30,
    obstacles: [
        { id: 'sfsr_1', name: 'Femur Hop', level: 30, xp: 25, duration: 3 },
        { id: 'sfsr_2', name: 'Rib Cage Scramble', level: 30, xp: 30, duration: 5 },
        { id: 'sfsr_3', name: 'Spine Balance Beam', level: 30, xp: 35, failDamage: { min: 2, max: 4 }, duration: 6, failPoiId: 'skeletal_remains' },
        { id: 'sfsr_4', name: 'Skull Leap', level: 30, xp: 40, failDamage: { min: 1, max: 3 }, duration: 3, failPoiId: 'bleached_expanse' },
        { id: 'sfsr_5', name: 'Salt Geyser Jump', level: 30, xp: 45, failDamage: { min: 3, max: 5 }, duration: 2 },
        { id: 'sfsr_6', name: 'Crystal Formation Climb', level: 30, xp: 38, duration: 5, failMessage: "The sharp crystals cut your hands and you fall." },
        { id: 'sfsr_7', name: 'Carcass Slide', level: 30, xp: 30, duration: 3, canFail: false },
        { id: 'sfsr_8', name: 'Salt Pile Landing', level: 30, xp: 0, duration: 2, canFail: false, successPoiId: 'skeletal_remains' },
    ]
};

const SHIPWRECK_GRAVEYARD_LEAP: AgilityCourse = {
    id: 'shipwreck_graveyard_leap',
    name: "Shipwreck Graveyard Leap",
    level: 55,
    lapBonusXp: 650,
    energyRestore: 45,
    obstacles: [
        { id: 'sgyl_1', name: 'Hull Scramble', level: 55, xp: 50, duration: 4 },
        { id: 'sgyl_2', name: 'Mast Swing', level: 55, xp: 60, failDamage: { min: 4, max: 8 }, duration: 5, failPoiId: 'shipwreck_graveyard' },
        { id: 'sgyl_3', 'name': 'Rotten Deck Run', level: 55, xp: 65, failDamage: { min: 3, max: 6 }, duration: 6, failMessage: "The deck gives way and you fall into the hold." },
        { id: 'sgyl_4', 'name': 'Rigging Net Climb', level: 55, xp: 70, duration: 7 },
        { id: 'sgyl_5', 'name': 'Ghostly Galleon Jump', level: 55, xp: 80, failDamage: { min: 5, max: 10 }, duration: 3, failPoiId: 'tidal_flats' },
        { id: 'sgyl_6', 'name': 'Cannon Hop', level: 55, xp: 75, duration: 4, canFail: false },
        { id: 'sgyl_7', 'name': 'Keel Balance', level: 55, xp: 85, failDamage: { min: 4, max: 7 }, duration: 8, failPoiId: 'sirens_cove' },
        { id: 'sgyl_8', 'name': 'Dive into Water', level: 55, xp: 0, duration: 2, canFail: false, successPoiId: 'shipwreck_graveyard' },
    ]
};

const CRYSTALLINE_ISLES_TRAVERSE: AgilityCourse = {
    id: 'crystalline_isles_traverse',
    name: "Crystalline Isles Traverse",
    level: 65,
    lapBonusXp: 750,
    energyRestore: 50,
    obstacles: [
        { id: 'cit_1', 'name': 'Floating Crystal Hop', level: 65, xp: 70, duration: 4, failPoiId: 'crystalline_path_1' },
        { id: 'cit_2', 'name': 'Arcane Energy Bridge', level: 65, xp: 80, failDamage: { min: 5, max: 10 }, duration: 6, failMessage: "You misstep on the energy bridge and are jolted by raw magic." },
        { id: 'cit_3', 'name': 'Spire Ledge Shimmy', level: 65, xp: 85, duration: 7, failPoiId: 'crystalline_path_4' },
        { id: 'cit_4', 'name': 'Gravity Geyser Launch', level: 65, xp: 90, failDamage: { min: 3, max: 6 }, duration: 2 },
        { id: 'cit_5', 'name': 'Wind Current Glide', level: 65, xp: 100, duration: 8, canFail: false },
        { id: 'cit_6', 'name': 'Jagged Shard Scramble', level: 65, xp: 88, failDamage: { min: 6, max: 12 }, duration: 5, failPoiId: 'inner_path_A1' },
        { id: 'cit_7', 'name': 'Resonant Crystal Balance', level: 65, xp: 95, duration: 6 },
        { id: 'cit_8', 'name': 'Heartcrystal Light Jump', level: 65, xp: 110, failDamage: { min: 7, max: 14 }, duration: 3, failPoiId: 'the_heartcrystal' },
        { id: 'cit_9', 'name': 'Slide to Landing', level: 65, xp: 0, duration: 4, canFail: false, successPoiId: 'crystalline_isles_landing' },
    ]
};

const WYRMWOOD_TREETOP_RUN: AgilityCourse = {
    id: 'wyrmwood_treetop_run',
    name: "Wyrmwood Treetop Run",
    level: 75,
    lapBonusXp: 850,
    energyRestore: 55,
    obstacles: [
        { id: 'wtr_1', 'name': 'Ancient Branch Climb', level: 75, xp: 80, duration: 6 },
        { id: 'wtr_2', 'name': 'Canopy Dash', level: 75, xp: 90, duration: 8 },
        { id: 'wtr_3', 'name': 'Vine Swing', level: 75, xp: 100, failDamage: { min: 6, max: 12 }, duration: 4, failPoiId: 'wg_ancient_grove' },
        { id: 'wtr_4', 'name': 'Hollow Log Squeeze', level: 75, xp: 95, duration: 5, canFail: false },
        { id: 'wtr_5', 'name': 'Mossy Branch Balance', level: 75, xp: 110, failDamage: { min: 5, max: 10 }, duration: 7, failPoiId: 'wg_mossy_clearing' },
        { id: 'wtr_6', 'name': 'Thicket Gap Leap', level: 75, xp: 120, failDamage: { min: 7, max: 14 }, duration: 3, failPoiId: 'wg_tangled_thicket' },
        { id: 'wtr_7', 'name': 'Dragon\'s Perch Jump', level: 75, xp: 130, duration: 4 },
        { id: 'wtr_8', 'name': 'Elderwood Slide', level: 75, xp: 100, duration: 5, canFail: false },
        { id: 'wtr_9', 'name': 'Grove Floor Landing', level: 75, xp: 0, duration: 2, canFail: false, successPoiId: 'wg_ancient_grove' },
    ]
};

const GALE_SWEPT_PEAKS_RIDGE_WALK: AgilityCourse = {
    id: 'gale_swept_peaks_ridge_walk',
    name: "Gale-Swept Peaks Ridge Walk",
    level: 80,
    lapBonusXp: 950,
    energyRestore: 60,
    obstacles: [
        { id: 'gsprw_1', 'name': 'Icy Wall Scramble', level: 80, xp: 100, duration: 6, failMessage: "Your grip fails on the icy rock." },
        { id: 'gsprw_2', 'name': 'Narrow Ledge Shimmy', level: 80, xp: 120, failDamage: { min: 8, max: 16 }, duration: 9, failPoiId: 'goat_trail' },
        { id: 'gsprw_3', 'name': 'Windy Chasm Leap', level: 80, xp: 150, failDamage: { min: 10, max: 20 }, duration: 4, failPoiId: 'ancient_pass' },
        { id: 'gsprw_4', 'name': 'Harpy Nest Hop', level: 80, xp: 130, duration: 5, failPoiId: 'harpy_roost' },
        { id: 'gsprw_5', 'name': 'Frayed Rope Bridge Cross', level: 80, xp: 140, failDamage: { min: 7, max: 15 }, duration: 10 },
        { id: 'gsprw_6', 'name': 'Summit Scree Slide', level: 80, xp: 110, duration: 5, canFail: false },
        { id: 'gsprw_7', 'name': 'Snowbank Landing', level: 80, xp: 0, duration: 2, canFail: false, successPoiId: 'summit_approach' },
    ]
};

const VOLCANIC_BRIMSTONE_RUN: AgilityCourse = {
    id: 'volcanic_brimstone_run',
    name: "Volcanic Brimstone Run",
    level: 90,
    lapBonusXp: 1200,
    energyRestore: 70,
    obstacles: [
        { id: 'vbr_1', 'name': 'Obsidian Wall Climb', level: 90, xp: 150, failDamage: { min: 5, max: 10 }, duration: 7 },
        { id: 'vbr_2', 'name': 'Steam Vent Dodge', level: 90, xp: 160, failDamage: { min: 10, max: 20 }, duration: 5 },
        { id: 'vbr_3', 'name': 'Lava River Leap', level: 90, xp: 200, failDamage: { min: 20, max: 40 }, duration: 3, failPoiId: 'vsv_lava_river_crossing' },
        { id: 'vbr_4', 'name': 'Ash Dune Slide', level: 90, xp: 170, duration: 6, canFail: false },
        { id: 'vbr_5', 'name': 'Brimstone Ledge Shimmy', level: 90, xp: 180, failDamage: { min: 8, max: 16 }, duration: 8, failPoiId: 'vsv_brimstone_pass' },
        { id: 'vbr_6', 'name': 'Magma Imp Hop', level: 90, xp: 190, duration: 4 },
        { id: 'vbr_7', 'name': 'Cinder Cone Scramble', level: 90, xp: 175, duration: 6 },
        { id: 'vbr_8', 'name': 'Cooling Vent Landing', level: 90, xp: 0, duration: 2, canFail: false, successPoiId: 'vsv_geothermal_vents' },
    ]
};

export const AGILITY_COURSES: Record<string, AgilityCourse> = {
    [MEADOWDALE_ROOFTOP_COURSE.id]: MEADOWDALE_ROOFTOP_COURSE,
    [VERDANT_FIELDS_TRAVERSE.id]: VERDANT_FIELDS_TRAVERSE,
    [OAKHAVEN_ARTISANS_RUN.id]: OAKHAVEN_ARTISANS_RUN,
    [SALT_FLATS_SKELETON_RUN.id]: SALT_FLATS_SKELETON_RUN,
    [FOUTHIA_ROOFTOP_RUN.id]: FOUTHIA_ROOFTOP_RUN,
    [SANCTITY_CATHEDRAL_CLIMB.id]: SANCTITY_CATHEDRAL_CLIMB,
    [SHIPWRECK_GRAVEYARD_LEAP.id]: SHIPWRECK_GRAVEYARD_LEAP,
    [CRYSTALLINE_ISLES_TRAVERSE.id]: CRYSTALLINE_ISLES_TRAVERSE,
    [SILVERHAVEN_CASTLE_RUN.id]: SILVERHAVEN_CASTLE_RUN,
    [WYRMWOOD_TREETOP_RUN.id]: WYRMWOOD_TREETOP_RUN,
    [GALE_SWEPT_PEAKS_RIDGE_WALK.id]: GALE_SWEPT_PEAKS_RIDGE_WALK,
    [VOLCANIC_BRIMSTONE_RUN.id]: VOLCANIC_BRIMSTONE_RUN,
};
