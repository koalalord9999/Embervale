
import { Item } from './entities';
import { SkillName } from './enums';

export interface Shop {
    id: string;
    name: string;
    inventory: { itemId: string; quantity: number; priceModifier: number; doses?: number; }[]; // modifier for buying/selling
}

export interface ShopItemState {
    itemId: string;
    currentStock: number;
    restockProgress: number; // in milliseconds
}

export type ShopStates = Record<string, Record<string, ShopItemState>>; // { [shopId]: { [itemId]: ShopItemState } }

export interface CookingRecipe {
    itemId: string; // The item you get from cooking
    level: number;
    xp: number;
    ingredients: { itemId: string; quantity: number }[];
    burntItemId: string;
}

export interface CraftingRecipe {
    itemId: string;
    level?: number;
    xp?: number;
    requiredSkills?: { skill: SkillName; level: number }[];
    xpRewards?: { skill: SkillName; amount: number }[];
    ingredients: { itemId: string; quantity: number }[];
}

export interface JewelryRecipe {
    itemId: string;
    level: number;
    xp: number;
    barType: 'silver_bar' | 'gold_bar';
    barsRequired: number;
    mouldId: string;
    gemId?: string;
}

export interface SkillGuideEntry {
    level: number;
    description: string;
    itemId?: string;
}

export interface ActiveCraftingAction {
    recipeId: string;
    // Distinguishes between different types of recipes that might share item IDs
    recipeType: 'smithing-bar' | 'smithing-item' | 'fletching-carve' | 'fletching-string' | 'fletching-headless' | 'fletching-tip' | 'crafting' | 'gem-cutting' | 'spinning' | 'cooking' | 'herblore-unfinished' | 'herblore-finished' | 'jewelry' | 'firemaking-light' | 'firemaking-stoke' | 'milling' | 'dough-making' | 'fletching-stock' | 'fletching-assembly' | 'fletching-feather' | 'consecration' | 'grinding' | 'paste-making' | 'offering';
    totalQuantity: number;
    completedQuantity: number;
    successfulQuantity?: number;
    startTime: number;
    duration: number; // ms per item
    // Optional payload for specific recipe types
    payload?: {
        logId?: string; // for fletching-carve
        unstrungId?: string; // for fletching-string
        tipId?: string; // for fletching-tip
        barType?: 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'silver_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar' | 'gold_bar'; // for smithing-bar
        uncutId?: string; // for gem-cutting
        cleanHerbId?: string; // for herblore-unfinished
        unfinishedPotionId?: string; // for herblore-finished
        secondaryId?: string; // for herblore-finished
        bonfireId?: string; // for firemaking-stoke
        unfBoltsId?: string; // for fletching-feather
        totalItems?: number;
        prayerCost?: number;
    }
}
