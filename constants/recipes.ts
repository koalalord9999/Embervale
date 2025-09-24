import { CookingRecipe, CraftingRecipe, JewelryRecipe, SkillName } from '../types';

export const SMITHING_RECIPES = [
  // Bronze
  { itemId: 'bronze_dagger', level: 1, barsRequired: 1, xp: 12.5, barType: 'bronze_bar' },
  { itemId: 'bronze_axe', level: 1, barsRequired: 1, xp: 12.5, barType: 'bronze_bar' },
  { itemId: 'bronze_pickaxe', level: 1, barsRequired: 1, xp: 12.5, barType: 'bronze_bar' },
  { itemId: 'bronze_arrowtips', level: 1, barsRequired: 1, xp: 12.5, barType: 'bronze_bar' },
  { itemId: 'bronze_mace', level: 2, barsRequired: 1, xp: 12.5, barType: 'bronze_bar' },
  { itemId: 'bronze_warhammer', level: 3, barsRequired: 2, xp: 25, barType: 'bronze_bar' },
  { itemId: 'bronze_sword', level: 4, barsRequired: 2, xp: 25, barType: 'bronze_bar' },
  { itemId: 'bronze_scimitar', level: 6, barsRequired: 2, xp: 25, barType: 'bronze_bar' },
  { itemId: 'bronze_full_helm', level: 7, barsRequired: 2, xp: 25, barType: 'bronze_bar' },
  { itemId: 'bronze_platelegs', level: 8, barsRequired: 3, xp: 37.5, barType: 'bronze_bar' },
  { itemId: 'bronze_battleaxe', level: 10, barsRequired: 3, xp: 37.5, barType: 'bronze_bar' },
  { itemId: 'bronze_kiteshield', level: 12, barsRequired: 3, xp: 37.5, barType: 'bronze_bar' },
  { itemId: 'bronze_platebody', level: 14, barsRequired: 5, xp: 62.5, barType: 'bronze_bar' },
  // Iron
  { itemId: 'iron_dagger', level: 15, barsRequired: 1, xp: 25, barType: 'iron_bar' },
  { itemId: 'iron_arrowtips', level: 15, barsRequired: 1, xp: 25, barType: 'iron_bar' },
  { itemId: 'iron_axe', level: 16, barsRequired: 1, xp: 25, barType: 'iron_bar' },
  { itemId: 'iron_pickaxe', level: 16, barsRequired: 1, xp: 25, barType: 'iron_bar' },
  { itemId: 'iron_mace', level: 17, barsRequired: 1, xp: 25, barType: 'iron_bar' },
  { itemId: 'iron_warhammer', level: 18, barsRequired: 2, xp: 50, barType: 'iron_bar' },
  { itemId: 'iron_sword', level: 19, barsRequired: 2, xp: 50, barType: 'iron_bar' },
  { itemId: 'iron_scimitar', level: 21, barsRequired: 2, xp: 50, barType: 'iron_bar' },
  { itemId: 'iron_full_helm', level: 22, barsRequired: 2, xp: 50, barType: 'iron_bar' },
  { itemId: 'iron_platelegs', level: 23, barsRequired: 3, xp: 75, barType: 'iron_bar' },
  { itemId: 'iron_battleaxe', level: 25, barsRequired: 3, xp: 75, barType: 'iron_bar' },
  { itemId: 'iron_kiteshield', level: 27, barsRequired: 3, xp: 75, barType: 'iron_bar' },
  { itemId: 'iron_platebody', level: 29, barsRequired: 5, xp: 125, barType: 'iron_bar' },
  // Steel
  { itemId: 'steel_dagger', level: 30, barsRequired: 1, xp: 37.5, barType: 'steel_bar' },
  { itemId: 'steel_arrowtips', level: 30, barsRequired: 1, xp: 37.5, barType: 'steel_bar' },
  { itemId: 'steel_axe', level: 31, barsRequired: 1, xp: 37.5, barType: 'steel_bar' },
  { itemId: 'steel_pickaxe', level: 31, barsRequired: 1, xp: 37.5, barType: 'steel_bar' },
  { itemId: 'steel_mace', level: 32, barsRequired: 1, xp: 37.5, barType: 'steel_bar' },
  { itemId: 'steel_warhammer', level: 33, barsRequired: 2, xp: 75, barType: 'steel_bar' },
  { itemId: 'steel_sword', level: 34, barsRequired: 2, xp: 75, barType: 'steel_bar' },
  { itemId: 'steel_scimitar', level: 36, barsRequired: 2, xp: 75, barType: 'steel_bar' },
  { itemId: 'steel_full_helm', level: 37, barsRequired: 2, xp: 75, barType: 'steel_bar' },
  { itemId: 'steel_platelegs', level: 38, barsRequired: 3, xp: 112.5, barType: 'steel_bar' },
  { itemId: 'steel_battleaxe', level: 40, barsRequired: 3, xp: 112.5, barType: 'steel_bar' },
  { itemId: 'steel_kiteshield', level: 42, barsRequired: 3, xp: 112.5, barType: 'steel_bar' },
  { itemId: 'steel_platebody', level: 44, barsRequired: 5, xp: 187.5, barType: 'steel_bar' },
  // Mithril
  { itemId: 'mithril_dagger', level: 50, barsRequired: 1, xp: 50, barType: 'mithril_bar' },
  { itemId: 'mithril_arrowtips', level: 50, barsRequired: 1, xp: 50, barType: 'mithril_bar' },
  { itemId: 'mithril_axe', level: 51, barsRequired: 1, xp: 50, barType: 'mithril_bar' },
  { itemId: 'mithril_pickaxe', level: 51, barsRequired: 1, xp: 50, barType: 'mithril_bar' },
  { itemId: 'mithril_mace', level: 52, barsRequired: 1, xp: 50, barType: 'mithril_bar' },
  { itemId: 'mithril_warhammer', level: 53, barsRequired: 2, xp: 100, barType: 'mithril_bar' },
  { itemId: 'mithril_sword', level: 54, barsRequired: 2, xp: 100, barType: 'mithril_bar' },
  { itemId: 'mithril_scimitar', level: 56, barsRequired: 2, xp: 100, barType: 'mithril_bar' },
  { itemId: 'mithril_full_helm', level: 57, barsRequired: 2, xp: 100, barType: 'mithril_bar' },
  { itemId: 'mithril_platelegs', level: 58, barsRequired: 3, xp: 150, barType: 'mithril_bar' },
  { itemId: 'mithril_battleaxe', level: 60, barsRequired: 3, xp: 150, barType: 'mithril_bar' },
  { itemId: 'mithril_kiteshield', level: 62, barsRequired: 3, xp: 150, barType: 'mithril_bar' },
  { itemId: 'mithril_platebody', level: 64, barsRequired: 5, xp: 250, barType: 'mithril_bar' },
  // Adamantite
  { itemId: 'adamantite_dagger', level: 65, barsRequired: 1, xp: 62.5, barType: 'adamantite_bar' },
  { itemId: 'adamantite_arrowtips', level: 65, barsRequired: 1, xp: 62.5, barType: 'adamantite_bar' },
  { itemId: 'adamantite_axe', level: 66, barsRequired: 1, xp: 62.5, barType: 'adamantite_bar' },
  { itemId: 'adamantite_pickaxe', level: 66, barsRequired: 1, xp: 62.5, barType: 'adamantite_bar' },
  { itemId: 'adamantite_mace', level: 67, barsRequired: 1, xp: 62.5, barType: 'adamantite_bar' },
  { itemId: 'adamantite_warhammer', level: 68, barsRequired: 2, xp: 125, barType: 'adamantite_bar' },
  { itemId: 'adamantite_sword', level: 69, barsRequired: 2, xp: 125, barType: 'adamantite_bar' },
  { itemId: 'adamantite_scimitar', level: 71, barsRequired: 2, xp: 125, barType: 'adamantite_bar' },
  { itemId: 'adamantite_full_helm', level: 72, barsRequired: 2, xp: 125, barType: 'adamantite_bar' },
  { itemId: 'adamantite_platelegs', level: 73, barsRequired: 3, xp: 187.5, barType: 'adamantite_bar' },
  { itemId: 'adamantite_battleaxe', level: 75, barsRequired: 3, xp: 187.5, barType: 'adamantite_bar' },
  { itemId: 'adamantite_kiteshield', level: 77, barsRequired: 3, xp: 187.5, barType: 'adamantite_bar' },
  { itemId: 'adamantite_platebody', level: 79, barsRequired: 5, xp: 312.5, barType: 'adamantite_bar' },
  // Runic
  { itemId: 'runic_dagger', level: 80, barsRequired: 1, xp: 75, barType: 'runic_bar' },
  { itemId: 'runic_arrowtips', level: 80, barsRequired: 1, xp: 75, barType: 'runic_bar' },
  { itemId: 'runic_axe', level: 81, barsRequired: 1, xp: 75, barType: 'runic_bar' },
  { itemId: 'runic_pickaxe', level: 81, barsRequired: 1, xp: 75, barType: 'runic_bar' },
  { itemId: 'runic_mace', level: 82, barsRequired: 1, xp: 75, barType: 'runic_bar' },
  { itemId: 'runic_warhammer', level: 83, barsRequired: 2, xp: 150, barType: 'runic_bar' },
  { itemId: 'runic_sword', level: 84, barsRequired: 2, xp: 150, barType: 'runic_bar' },
  { itemId: 'runic_scimitar', level: 86, barsRequired: 2, xp: 150, barType: 'runic_bar' },
  { itemId: 'runic_full_helm', level: 87, barsRequired: 2, xp: 150, barType: 'runic_bar' },
  { itemId: 'runic_platelegs', level: 88, barsRequired: 3, xp: 225, barType: 'runic_bar' },
  { itemId: 'runic_battleaxe', level: 90, barsRequired: 3, xp: 225, barType: 'runic_bar' },
  { itemId: 'runic_kiteshield', level: 92, barsRequired: 3, xp: 225, barType: 'runic_bar' },
  { itemId: 'runic_platebody', level: 94, barsRequired: 5, xp: 375, barType: 'runic_bar' },
  // Other
  { itemId: 'silver_tiara', level: 25, barsRequired: 1, xp: 52.5, barType: 'silver_bar' },
];

export const COOKING_RECIPES: CookingRecipe[] = [
    { itemId: 'bread', level: 1, xp: 30, ingredients: [{ itemId: 'bread_dough', quantity: 1 }], burntItemId: 'burnt_bread',},
    { itemId: 'scrambled_eggs', level: 1, xp: 30, ingredients: [{ itemId: 'eggs', quantity: 1 }], burntItemId: 'burnt_eggs',},
    { itemId: 'cooked_shrimp', level: 1, xp: 30, ingredients: [{ itemId: 'raw_shrimp', quantity: 1 }], burntItemId: 'burnt_shrimp',},
    { itemId: 'rat_kebab_cooked', level: 1, xp: 30, ingredients: [{ itemId: 'rat_kebab_uncooked', quantity: 1 }], burntItemId: 'rat_kebab_burnt',},
    { itemId: 'cooked_sardine', level: 5, xp: 40, ingredients: [{ itemId: 'raw_sardine', quantity: 1 }], burntItemId: 'burnt_sardine',},
    { itemId: 'cooked_crab_meat', level: 8, xp: 55, ingredients: [{ itemId: 'giant_crab_meat', quantity: 1 }], burntItemId: 'burnt_crab_meat',},
    { itemId: 'cooked_herring', level: 10, xp: 50, ingredients: [{ itemId: 'raw_herring', quantity: 1 }], burntItemId: 'burnt_herring',},
    { itemId: 'cooked_chicken', level: 3, xp: 40, ingredients: [{ itemId: 'raw_chicken', quantity: 1 }], burntItemId: 'burnt_chicken',},
    { itemId: 'cooked_beef', level: 5, xp: 45, ingredients: [{ itemId: 'raw_beef', quantity: 1 }], burntItemId: 'burnt_beef',},
    { itemId: 'cooked_boar_meat', level: 10, xp: 60, ingredients: [{ itemId: 'raw_boar_meat', quantity: 1 }], burntItemId: 'burnt_boar_meat',},
    { itemId: 'cooked_trout', level: 20, xp: 70, ingredients: [{ itemId: 'raw_trout', quantity: 1 }], burntItemId: 'burnt_trout',},
    { itemId: 'cooked_pike', level: 30, xp: 80, ingredients: [{ itemId: 'raw_pike', quantity: 1 }], burntItemId: 'burnt_pike',},
    { itemId: 'cake', level: 35, xp: 120, ingredients: [{ itemId: 'cake_batter', quantity: 1 }], burntItemId: 'burnt_cake',},
    { itemId: 'cooked_eel', level: 38, xp: 95, ingredients: [{ itemId: 'raw_eel', quantity: 1 }], burntItemId: 'burnt_eel',},
    { itemId: 'serpent_omelet_cooked', level: 50, xp: 200, ingredients: [{ itemId: 'serpents_egg', quantity: 1 }, { itemId: 'eggs', quantity: 1 }], burntItemId: 'serpent_omelet_burnt',}
];

export const SPINNING_RECIPES: CraftingRecipe[] = [
    { itemId: 'ball_of_wool', level: 1, xp: 2.5, ingredients: [{ itemId: 'wool', quantity: 1 }] },
    { itemId: 'bow_string', level: 10, xp: 10, ingredients: [{ itemId: 'flax', quantity: 1 }] },
    { itemId: 'rope', level: 15, xp: 15, ingredients: [{ itemId: 'flax', quantity: 1 }] },
];

export const DOUGH_RECIPES: CraftingRecipe[] = [
    { itemId: 'bread_dough', level: 1, xp: 0, ingredients: [{ itemId: 'flour', quantity: 1 }, { itemId: 'bucket_of_water', quantity: 1 }] },
    { itemId: 'pie_dough', level: 1, xp: 0, ingredients: [{ itemId: 'flour', quantity: 1 }, { itemId: 'bucket_of_water', quantity: 1 }, { itemId: 'pie_dish', quantity: 1 }] },
    { itemId: 'pizza_dough', level: 1, xp: 0, ingredients: [{ itemId: 'flour', quantity: 1 }, { itemId: 'bucket_of_water', quantity: 1 }] },
];

export const CRAFTING_RECIPES: CraftingRecipe[] = [
    // Leather (Level 1)
    { itemId: 'leather_gloves', level: 1, xp: 14, ingredients: [{ itemId: 'leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'leather_boots', level: 3, xp: 16, ingredients: [{ itemId: 'leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'leather_cowl', level: 6, xp: 22, ingredients: [{ itemId: 'leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'leather_vambraces', level: 5, xp: 18, ingredients: [{ itemId: 'leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'leather_chaps', level: 7, xp: 50, ingredients: [{ itemId: 'leather', quantity: 2 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'leather_body', level: 9, xp: 81, ingredients: [{ itemId: 'leather', quantity: 3 }, { itemId: 'thread', quantity: 1 }] },
    // Boar Hide (Level 9)
    { itemId: 'boar_hide_cowl', level: 10, xp: 26, ingredients: [{ itemId: 'boar_leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'boar_hide_vambraces', level: 9, xp: 29, ingredients: [{ itemId: 'boar_leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'boar_hide_chaps', level: 11, xp: 68, ingredients: [{ itemId: 'boar_leather', quantity: 2 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'boar_hide_body', level: 13, xp: 117, ingredients: [{ itemId: 'boar_leather', quantity: 3 }, { itemId: 'thread', quantity: 1 }] },
    // Wolf Pelt (Level 18)
    { itemId: 'wolf_pelt_cowl', level: 19, xp: 44, ingredients: [{ itemId: 'wolf_leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'wolf_pelt_vambraces', level: 18, xp: 40, ingredients: [{ itemId: 'wolf_leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'wolf_pelt_chaps', level: 20, xp: 96, ingredients: [{ itemId: 'wolf_leather', quantity: 2 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'wolf_pelt_body', level: 22, xp: 160, ingredients: [{ itemId: 'wolf_leather', quantity: 3 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'wolf_pelt_cloak', level: 26, xp: 295, ingredients: [{ itemId: 'wolf_leather', quantity: 5 }, { itemId: 'thread', quantity: 1 }] },
    // Bear Hide (Level 32)
    { itemId: 'bear_hide_cowl', level: 33, xp: 66, ingredients: [{ itemId: 'bear_leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'bear_hide_vambraces', level: 32, xp: 60, ingredients: [{ itemId: 'bear_leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'bear_hide_chaps', level: 34, xp: 145, ingredients: [{ itemId: 'bear_leather', quantity: 2 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'bear_hide_body', level: 36, xp: 240, ingredients: [{ itemId: 'bear_leather', quantity: 3 }, { itemId: 'thread', quantity: 1 }] },
    // Tomes
    { itemId: 'tome_of_warding', level: 10, xp: 50, requiredSkills: [{skill: SkillName.Runecrafting, level: 7}], xpRewards: [{skill: SkillName.Runecrafting, amount: 25}], ingredients: [{ itemId: 'leather', quantity: 5 }, { itemId: 'thread', quantity: 10 }, { itemId: 'gust_rune', quantity: 20 }, { itemId: 'mystic_page', quantity: 5 }] },
    { itemId: 'tome_of_focus', level: 20, xp: 110, requiredSkills: [{skill: SkillName.Runecrafting, level: 19}], xpRewards: [{skill: SkillName.Runecrafting, amount: 55}], ingredients: [{ itemId: 'boar_leather', quantity: 5 }, { itemId: 'thread', quantity: 20 }, { itemId: 'aqua_rune', quantity: 40 }, { itemId: 'mystic_page', quantity: 12 }] },
    { itemId: 'tome_of_power', level: 30, xp: 175, requiredSkills: [{skill: SkillName.Runecrafting, level: 32}], xpRewards: [{skill: SkillName.Runecrafting, amount: 88}], ingredients: [{ itemId: 'harpy_talon', quantity: 5 }, { itemId: 'thread', quantity: 30 }, { itemId: 'stone_rune', quantity: 60 }, { itemId: 'mystic_page', quantity: 25 }] },
    { itemId: 'tome_of_the_arcane', level: 40, xp: 250, requiredSkills: [{skill: SkillName.Runecrafting, level: 44}], xpRewards: [{skill: SkillName.Runecrafting, amount: 125}], ingredients: [{ itemId: 'crystalline_chitin', quantity: 5 }, { itemId: 'thread', quantity: 40 }, { itemId: 'ember_rune', quantity: 80 }, { itemId: 'mystic_page', quantity: 50 }] },
    { itemId: 'tome_of_the_master', level: 50, xp: 350, requiredSkills: [{skill: SkillName.Runecrafting, level: 58}], xpRewards: [{skill: SkillName.Runecrafting, amount: 175}], ingredients: [{ itemId: 'eldritch_pearl', quantity: 3 }, { itemId: 'thread', quantity: 50 }, { itemId: 'flux_rune', quantity: 100 }, { itemId: 'mystic_page', quantity: 200 }] },
];

export const JEWELRY_CRAFTING_RECIPES: JewelryRecipe[] = [
    // Silver Jewelry
    { itemId: 'silver_ring', level: 5, xp: 35, barType: 'silver_bar', barsRequired: 1, mouldId: 'ring_mould' },
    { itemId: 'silver_necklace', level: 8, xp: 42, barType: 'silver_bar', barsRequired: 1, mouldId: 'necklace_mould' },
    { itemId: 'silver_amulet_u', level: 12, xp: 60, barType: 'silver_bar', barsRequired: 1, mouldId: 'amulet_mould' },
    // Gold Jewelry (Plain)
    { itemId: 'gold_ring', level: 20, xp: 50, barType: 'gold_bar', barsRequired: 1, mouldId: 'ring_mould' },
    { itemId: 'gold_necklace', level: 24, xp: 60, barType: 'gold_bar', barsRequired: 1, mouldId: 'necklace_mould' },
    { itemId: 'gold_amulet_u', level: 30, xp: 75, barType: 'gold_bar', barsRequired: 1, mouldId: 'amulet_mould' },
    // Sapphire Jewelry (Gold)
    { itemId: 'sapphire_ring', level: 22, xp: 65, barType: 'gold_bar', barsRequired: 1, mouldId: 'ring_mould', gemId: 'sapphire' },
    { itemId: 'sapphire_necklace', level: 26, xp: 75, barType: 'gold_bar', barsRequired: 1, mouldId: 'necklace_mould', gemId: 'sapphire' },
    { itemId: 'sapphire_amulet_u', level: 32, xp: 90, barType: 'gold_bar', barsRequired: 1, mouldId: 'amulet_mould', gemId: 'sapphire' },
    // Emerald Jewelry (Gold)
    { itemId: 'emerald_ring', level: 29, xp: 80, barType: 'gold_bar', barsRequired: 1, mouldId: 'ring_mould', gemId: 'emerald' },
    { itemId: 'emerald_necklace', level: 33, xp: 95, barType: 'gold_bar', barsRequired: 1, mouldId: 'necklace_mould', gemId: 'emerald' },
    { itemId: 'emerald_amulet_u', level: 40, xp: 110, barType: 'gold_bar', barsRequired: 1, mouldId: 'amulet_mould', gemId: 'emerald' },
    // Ruby Jewelry (Gold)
    { itemId: 'ruby_ring', level: 36, xp: 100, barType: 'gold_bar', barsRequired: 1, mouldId: 'ring_mould', gemId: 'ruby' },
    { itemId: 'ruby_necklace', level: 41, xp: 120, barType: 'gold_bar', barsRequired: 1, mouldId: 'necklace_mould', gemId: 'ruby' },
    { itemId: 'ruby_amulet_u', level: 48, xp: 140, barType: 'gold_bar', barsRequired: 1, mouldId: 'amulet_mould', gemId: 'ruby' },
    // Diamond Jewelry (Gold)
    { itemId: 'diamond_ring', level: 55, xp: 150, barType: 'gold_bar', barsRequired: 1, mouldId: 'ring_mould', gemId: 'diamond' },
    { itemId: 'diamond_necklace', level: 62, xp: 170, barType: 'gold_bar', barsRequired: 1, mouldId: 'necklace_mould', gemId: 'diamond' },
    { itemId: 'diamond_amulet_u', level: 70, xp: 190, barType: 'gold_bar', barsRequired: 1, mouldId: 'amulet_mould', gemId: 'diamond' },
];

export const GEM_CUTTING_RECIPES = [
    { uncutId: 'uncut_sapphire', cutId: 'sapphire', level: 20, xp: 80 },
    { uncutId: 'uncut_emerald', cutId: 'emerald', level: 27, xp: 125 },
    { uncutId: 'uncut_ruby', cutId: 'ruby', level: 34, xp: 200 },
    { uncutId: 'uncut_diamond', cutId: 'diamond', level: 43, xp: 350 },
];

export const RUNECRAFTING_RECIPES = [
    { runeId: 'gust_rune', level: 1, xp: 2, talismanId: 'gust_talisman' },
    { runeId: 'binding_rune', level: 2, xp: 3, talismanId: 'binding_talisman' },
    { runeId: 'stone_rune', level: 5, xp: 4, talismanId: 'stone_talisman' },
    { runeId: 'aqua_rune', level: 9, xp: 5, talismanId: 'aqua_talisman' },
    { runeId: 'ember_rune', level: 14, xp: 6, talismanId: 'ember_talisman' },
    { runeId: 'flux_rune', level: 20, xp: 7, talismanId: 'flux_talisman' },
    { runeId: 'verdant_rune', level: 27, xp: 8, talismanId: 'verdant_talisman' },
    { runeId: 'astral_rune', level: 35, xp: 9, talismanId: 'astral_talisman' },
    { runeId: 'hex_rune', level: 44, xp: 10, talismanId: 'hex_talisman' },
    { runeId: 'passage_rune', level: 50, xp: 11, talismanId: 'passage_talisman' },
    { runeId: 'nexus_rune', level: 55, xp: 12, talismanId: 'nexus_talisman' },
    { runeId: 'anima_rune', level: 72, xp: 13, talismanId: 'anima_talisman' },
    { runeId: 'aether_rune', level: 85, xp: 15, talismanId: 'aether_talisman' },
];