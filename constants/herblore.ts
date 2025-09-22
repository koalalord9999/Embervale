export const HERBS = [
    { grimy: 'grimy_guromoot', clean: 'clean_guromoot', level: 1, xp: 2.5 },
    { grimy: 'grimy_marleaf', clean: 'clean_marleaf', level: 5, xp: 3.8 },
    { grimy: 'grimy_swiftthistle', clean: 'clean_swiftthistle', level: 11, xp: 5 },
    { grimy: 'grimy_redfang_leaf', clean: 'clean_redfang_leaf', level: 20, xp: 6.3 },
    { grimy: 'grimy_suns_kiss', clean: 'clean_suns_kiss', level: 25, xp: 7.5 },
    { grimy: 'grimy_bog_nettle', clean: 'clean_bog_nettle', level: 30, xp: 8 },
    { grimy: 'grimy_gloom_moss', clean: 'clean_gloom_moss', level: 40, xp: 8.8 },
    { grimy: 'grimy_windwhisper_bud', clean: 'clean_windwhisper_bud', level: 48, xp: 10 },
    { grimy: 'grimy_cinderbloom', clean: 'clean_cinderbloom', level: 54, xp: 11.3 },
    { grimy: 'grimy_wyrmfire_petal', clean: 'clean_wyrmfire_petal', level: 63, xp: 11.8 },
    { grimy: 'grimy_duskshade', clean: 'clean_duskshade', level: 66, xp: 12.5 },
    { grimy: 'grimy_stonebloom', clean: 'clean_stonebloom', level: 70, xp: 13.8 },
];

export const HERBLORE_RECIPES = {
    unfinished: [
        { cleanHerbId: 'clean_guromoot', unfinishedPotionId: 'guromoot_potion_unf', level: 1, xp: 1 },
        { cleanHerbId: 'clean_marleaf', unfinishedPotionId: 'marleaf_potion_unf', level: 5, xp: 1 },
        { cleanHerbId: 'clean_swiftthistle', unfinishedPotionId: 'swiftthistle_potion_unf', level: 11, xp: 1 },
        { cleanHerbId: 'clean_redfang_leaf', unfinishedPotionId: 'redfang_leaf_potion_unf', level: 20, xp: 1 },
        { cleanHerbId: 'clean_suns_kiss', unfinishedPotionId: 'suns_kiss_potion_unf', level: 25, xp: 1 },
        { cleanHerbId: 'clean_bog_nettle', unfinishedPotionId: 'bog_nettle_potion_unf', level: 30, xp: 1 },
        { cleanHerbId: 'clean_gloom_moss', unfinishedPotionId: 'gloom_moss_potion_unf', level: 40, xp: 1 },
        { cleanHerbId: 'clean_windwhisper_bud', unfinishedPotionId: 'windwhisper_bud_potion_unf', level: 48, xp: 1 },
        { cleanHerbId: 'clean_cinderbloom', unfinishedPotionId: 'cinderbloom_potion_unf', level: 54, xp: 1 },
        { cleanHerbId: 'clean_wyrmfire_petal', unfinishedPotionId: 'wyrmfire_petal_potion_unf', level: 63, xp: 1 },
        { cleanHerbId: 'clean_duskshade', unfinishedPotionId: 'duskshade_potion_unf', level: 66, xp: 1 },
        { cleanHerbId: 'clean_stonebloom', unfinishedPotionId: 'stonebloom_potion_unf', level: 70, xp: 1 },
    ],
    finished: [
        // --- WEAK POTIONS (NEW) ---
        { unfinishedPotionId: 'guromoot_potion_unf', secondaryId: 'spider_eggs', finishedPotionId: 'weak_attack_potion', level: 1, xp: 25 },
        { unfinishedPotionId: 'guromoot_potion_unf', secondaryId: 'cave_slime_globule', finishedPotionId: 'weak_mining_potion', level: 3, xp: 28 },
        { unfinishedPotionId: 'marleaf_potion_unf', secondaryId: 'enchanted_bark', finishedPotionId: 'weak_woodcutting_potion', level: 7, xp: 35 },
        { unfinishedPotionId: 'swiftthistle_potion_unf', secondaryId: 'boar_tusk', finishedPotionId: 'weak_strength_potion', level: 11, xp: 50 },
        { unfinishedPotionId: 'swiftthistle_potion_unf', secondaryId: 'raw_sardine', finishedPotionId: 'weak_fishing_potion', level: 13, xp: 52 },
        { unfinishedPotionId: 'redfang_leaf_potion_unf', secondaryId: 'redwater_kelp', finishedPotionId: 'weak_defence_potion', level: 20, xp: 65 },

        // --- NORMAL POTIONS (LEVELS REBALANCED) ---
        { unfinishedPotionId: 'swiftthistle_potion_unf', secondaryId: 'spider_eggs', finishedPotionId: 'attack_potion', level: 22, xp: 60 },
        { unfinishedPotionId: 'redfang_leaf_potion_unf', secondaryId: 'boar_tusk', finishedPotionId: 'strength_potion', level: 26, xp: 70 },
        { unfinishedPotionId: 'suns_kiss_potion_unf', secondaryId: 'redwater_kelp', finishedPotionId: 'defence_potion', level: 34, xp: 85 },
        { unfinishedPotionId: 'windwhisper_bud_potion_unf', secondaryId: 'harpy_feather', finishedPotionId: 'ranged_potion', level: 48, xp: 110 },
        { unfinishedPotionId: 'wyrmfire_petal_potion_unf', secondaryId: 'fey_dust', finishedPotionId: 'magic_potion', level: 63, xp: 155 },

        // --- SUPER POTIONS ---
        { unfinishedPotionId: 'gloom_moss_potion_unf', secondaryId: 'bloodroot_tendril', finishedPotionId: 'super_attack_potion', level: 40, xp: 100 },
        { unfinishedPotionId: 'cinderbloom_potion_unf', secondaryId: 'boar_tusk', finishedPotionId: 'super_strength_potion', level: 54, xp: 125 },
        { unfinishedPotionId: 'duskshade_potion_unf', secondaryId: 'frost_berries', finishedPotionId: 'super_defence_potion', level: 66, xp: 165 },
        { unfinishedPotionId: 'windwhisper_bud_potion_unf', secondaryId: 'spider_silk', finishedPotionId: 'super_ranged_potion', level: 52, xp: 118 },
        { unfinishedPotionId: 'wyrmfire_petal_potion_unf', secondaryId: 'golem_core_shard', finishedPotionId: 'super_magic_potion', level: 68, xp: 170 },

        // --- SKILLING POTIONS (WEAK - NEW) ---
        { unfinishedPotionId: 'marleaf_potion_unf', secondaryId: 'fey_dust', finishedPotionId: 'weak_crafting_potion', level: 10, xp: 40 },
        { unfinishedPotionId: 'swiftthistle_potion_unf', secondaryId: 'iron_ore', finishedPotionId: 'weak_smithing_potion', level: 15, xp: 55 },
        { unfinishedPotionId: 'suns_kiss_potion_unf', secondaryId: 'willow_logs', finishedPotionId: 'weak_fletching_potion', level: 28, xp: 72 },
        { unfinishedPotionId: 'cinderbloom_potion_unf', secondaryId: 'fey_dust', finishedPotionId: 'weak_herblore_potion', level: 56, xp: 128 },

        // --- SKILLING POTIONS (NORMAL - REBALANCED) ---
        { unfinishedPotionId: 'redfang_leaf_potion_unf', secondaryId: 'cave_slime_globule', finishedPotionId: 'mining_potion', level: 23, xp: 68 },
        { unfinishedPotionId: 'suns_kiss_potion_unf', secondaryId: 'enchanted_bark', finishedPotionId: 'woodcutting_potion', level: 31, xp: 78 },
        { unfinishedPotionId: 'bog_nettle_potion_unf', secondaryId: 'raw_sardine', finishedPotionId: 'fishing_potion', level: 36, xp: 90 },
        { unfinishedPotionId: 'gloom_moss_potion_unf', secondaryId: 'cowhide', finishedPotionId: 'crafting_potion', level: 43, xp: 102 },
        { unfinishedPotionId: 'gloom_moss_potion_unf', secondaryId: 'iron_ore', finishedPotionId: 'smithing_potion', level: 45, xp: 105 },
        { unfinishedPotionId: 'cinderbloom_potion_unf', secondaryId: 'willow_logs', finishedPotionId: 'fletching_potion', level: 59, xp: 140 },
        { unfinishedPotionId: 'duskshade_potion_unf', secondaryId: 'fey_dust', finishedPotionId: 'herblore_potion', level: 69, xp: 170 },
        
        // --- MISC POTIONS ---
        { unfinishedPotionId: 'guromoot_potion_unf', secondaryId: 'spider_silk', finishedPotionId: 'weapon_poison_weak', level: 10, xp: 45 },
        { unfinishedPotionId: 'marleaf_potion_unf', secondaryId: 'cave_slime_globule', finishedPotionId: 'stat_restore_potion', level: 5, xp: 30 },
        { unfinishedPotionId: 'marleaf_potion_unf', secondaryId: 'fey_dust', finishedPotionId: 'accuracy_potion', level: 15, xp: 55 },
        { unfinishedPotionId: 'swiftthistle_potion_unf', secondaryId: 'harpy_feather', finishedPotionId: 'hunters_brew', level: 22, xp: 68 },
        { unfinishedPotionId: 'redfang_leaf_potion_unf', secondaryId: 'spider_silk', finishedPotionId: 'evasion_potion', level: 24, xp: 68 },
        { unfinishedPotionId: 'redfang_leaf_potion_unf', secondaryId: 'giant_crab_claw', finishedPotionId: 'weapon_poison_strong', level: 33, xp: 80 },
        { unfinishedPotionId: 'suns_kiss_potion_unf', secondaryId: 'glimmerhorn_dust', finishedPotionId: 'antipoison_potion', level: 25, xp: 70 },
        { unfinishedPotionId: 'suns_kiss_potion_unf', secondaryId: 'coal', finishedPotionId: 'sunfire_elixir', level: 38, xp: 95 },
        { unfinishedPotionId: 'bog_nettle_potion_unf', secondaryId: 'consecrated_dust', finishedPotionId: 'prayer_potion', level: 30, xp: 75 },
        { unfinishedPotionId: 'bog_nettle_potion_unf', secondaryId: 'boar_tusk', finishedPotionId: 'combo_brew', level: 42, xp: 105 },
        { unfinishedPotionId: 'bog_nettle_potion_unf', secondaryId: 'glimmerhorn_dust', finishedPotionId: 'pouch_cleanser', level: 38, xp: 95 },
        { unfinishedPotionId: 'gloom_moss_potion_unf', secondaryId: 'harpy_feather', finishedPotionId: 'stamina_potion', level: 51, xp: 115 },
        { unfinishedPotionId: 'windwhisper_bud_potion_unf', secondaryId: 'golem_core_shard', finishedPotionId: 'antifire_potion_weak', level: 58, xp: 135 },
        { unfinishedPotionId: 'cinderbloom_potion_unf', secondaryId: 'golem_core_shard', finishedPotionId: 'overload_potion_weak', level: 64, xp: 160 },
        { unfinishedPotionId: 'wyrmfire_petal_potion_unf', secondaryId: 'wyrmscale_dust', finishedPotionId: 'extended_antifire', level: 75, xp: 178 },
        { unfinishedPotionId: 'duskshade_potion_unf', secondaryId: 'unicorn_horn_dust', finishedPotionId: 'super_antipoison', level: 72, xp: 175 },
        { unfinishedPotionId: 'duskshade_potion_unf', secondaryId: 'spiked_toad_skin', finishedPotionId: 'spiketoad_potion', level: 78, xp: 180 },
        { unfinishedPotionId: 'stonebloom_potion_unf', secondaryId: 'serpent_scale_dust', finishedPotionId: 'antifire_potion', level: 70, xp: 175 },
        { unfinishedPotionId: 'stonebloom_potion_unf', secondaryId: 'golem_core', finishedPotionId: 'stone_skin_potion', level: 80, xp: 200 },
        { unfinishedPotionId: 'stonebloom_potion_unf', secondaryId: 'golem_core_shard', finishedPotionId: 'battlemasters_draught', level: 85, xp: 250 },
    ],
};