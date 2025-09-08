
import { CookingRecipe, CraftingRecipe, JewelryRecipe } from '../types';

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
];

export const COOKING_RECIPES: CookingRecipe[] = [
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
    { itemId: 'cooked_eel', level: 38, xp: 95, ingredients: [{ itemId: 'raw_eel', quantity: 1 }], burntItemId: 'burnt_eel',},
    { itemId: 'serpent_omelet_cooked', level: 50, xp: 200, ingredients: [{ itemId: 'serpents_egg', quantity: 1 }, { itemId: 'eggs', quantity: 1 }], burntItemId: 'serpent_omelet_burnt',}
];

export const SPINNING_RECIPES: CraftingRecipe[] = [
    { itemId: 'ball_of_wool', level: 1, xp: 2.5, ingredients: [{ itemId: 'wool', quantity: 1 }] },
    { itemId: 'bow_string', level: 10, xp: 10, ingredients: [{ itemId: 'flax', quantity: 1 }] },
    { itemId: 'rope', level: 15, xp: 15, ingredients: [{ itemId: 'flax', quantity: 1 }] },
];

export const CRAFTING_RECIPES: CraftingRecipe[] = [
    { itemId: 'leather_gloves', level: 1, xp: 14, ingredients: [{ itemId: 'leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'leather_boots', level: 3, xp: 16, ingredients: [{ itemId: 'leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'leather_cowl', level: 5, xp: 18, ingredients: [{ itemId: 'leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'leather_vambraces', level: 6, xp: 22, ingredients: [{ itemId: 'leather', quantity: 1 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'leather_chaps', level: 7, xp: 50, ingredients: [{ itemId: 'leather', quantity: 2 }, { itemId: 'thread', quantity: 1 }] },
    { itemId: 'leather_body', level: 9, xp: 81, ingredients: [{ itemId: 'leather', quantity: 3 }, { itemId: 'thread', quantity: 1 }] },
];

export const JEWELRY_CRAFTING_RECIPES: JewelryRecipe[] = [
    // Silver Jewelry
    { itemId: 'silver_ring', level: 5, xp: 35, barType: 'silver_bar', barsRequired: 1, mouldId: 'ring_mould' },
    { itemId: 'silver_necklace', level: 8, xp: 42, barType: 'silver_bar', barsRequired: 1, mouldId: 'necklace_mould' },
    { itemId: 'silver_amulet_u', level: 12, xp: 60, barType: 'silver_bar', barsRequired: 1, mouldId: 'amulet_mould' },
    // Gold Jewelry placeholder
    // Gem-bound Jewelry (Sapphire, Emerald, Ruby, Golem Core) placeholder
];

export const GEM_CUTTING_RECIPES = [
    { uncutId: 'uncut_sapphire', cutId: 'sapphire', level: 20, xp: 80 },
    { uncutId: 'uncut_emerald', cutId: 'emerald', level: 27, xp: 125 },
    { uncutId: 'uncut_ruby', cutId: 'ruby', level: 34, xp: 200 },
];
