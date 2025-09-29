

import { InventorySlot, WeightedDrop } from '../types';

interface LootTableItem {
    itemId?: string;
    tableId?: string;
    chance: number; // A weight, not a percentage
    minQuantity?: number;
    maxQuantity?: number;
    noted?: boolean;
}

export interface LootRollResult {
    itemId: string;
    quantity: number;
    noted: boolean;
}

type LootTable = LootTableItem[];

// Loot tables define weighted drops. The `rollOnLootTable` function will pick one.
const LOOT_TABLES: Record<string, LootTable> = {
    gem_table: [
        { itemId: 'uncut_sapphire', chance: 60 },
        { itemId: 'uncut_emerald', chance: 25 },
        { itemId: 'uncut_ruby', chance: 12.5 },
        { itemId: 'uncut_diamond', chance: 2.5 },
    ],
    herb_table: [
        { itemId: 'grimy_guromoot', chance: 25 },
        { itemId: 'grimy_marleaf', chance: 20 },
        { itemId: 'grimy_swiftthistle', chance: 16 },
        { itemId: 'grimy_redfang_leaf', chance: 12 },
        { itemId: 'grimy_suns_kiss', chance: 8 },
        { itemId: 'grimy_bog_nettle', chance: 6 },
        { itemId: 'grimy_gloom_moss', chance: 4 },
        { itemId: 'grimy_windwhisper_bud', chance: 2 },
        { itemId: 'grimy_cinderbloom', chance: 1.5 },
        { itemId: 'grimy_wyrmfire_petal', chance: 1 },
        { itemId: 'grimy_duskshade', chance: 0.75 },
        { itemId: 'grimy_stonebloom', chance: 0.5 },
    ],
    global_gem_and_key_table: [
        { itemId: 'uncut_sapphire', chance: 4822 },
        { itemId: 'uncut_emerald', chance: 2893 },
        { itemId: 'uncut_ruby', chance: 1447 },
        { itemId: 'uncut_diamond', chance: 386 },
        { itemId: 'strange_key_loop', chance: 50 }, // Approx 1/200
        { itemId: 'strange_key_tooth', chance: 50 }, // Approx 1/200
        { itemId: 'talisman_drop', chance: 313 }, // Approx 1/32
        { tableId: 'super_rare_table', chance: 39 }, // Approx 1/256
    ],
    super_rare_table: [
        // Total item weight is 8000. On a roll out of 10000, this gives a 20% chance of getting nothing.
        // Resources (4000 total weight)
        { itemId: 'coal', chance: 500, minQuantity: 500, maxQuantity: 2000, noted: true },
        { itemId: 'silver_ore', chance: 1000, minQuantity: 100, maxQuantity: 100, noted: true },
        { itemId: 'yew_logs', chance: 300, minQuantity: 100, maxQuantity: 250, noted: true },
        { itemId: 'adamantite_bar', chance: 200, minQuantity: 5, maxQuantity: 10, noted: true },
        { itemId: 'gold_bar', chance: 400, minQuantity: 50, maxQuantity: 100, noted: true },
        { itemId: 'verdant_rune', chance: 1500, minQuantity: 300, maxQuantity: 300 },
        { itemId: 'astral_rune', chance: 100, minQuantity: 100, maxQuantity: 100 },

        // Adamantite Gear (2500 total weight)
        { itemId: 'adamantite_platebody', chance: 500 },
        { itemId: 'adamantite_platelegs', chance: 500 },
        { itemId: 'adamantite_full_helm', chance: 500 },
        { itemId: 'adamantite_kiteshield', chance: 500 },
        { itemId: 'adamantite_sword', chance: 500 },

        // Runic Gear (1000 total weight)
        { itemId: 'runic_platebody', chance: 250 },
        { itemId: 'runic_platelegs', chance: 250 },
        { itemId: 'runic_sword', chance: 250 },
        { itemId: 'runic_scimitar', chance: 250 },

        // Aquatite Gear (500 total weight)
        { itemId: 'aquatite_platebody', chance: 100 },
        { itemId: 'aquatite_platelegs', chance: 100 },
        { itemId: 'aquatite_full_helm', chance: 100 },
        { itemId: 'aquatite_kiteshield', chance: 100 },
        { itemId: 'aquatite_sword', chance: 100 },
    ],
    robes_of_power_table: [
        { itemId: 'robe_of_power_hat', chance: 32 },
        { itemId: 'robe_of_power_top', chance: 32 },
        { itemId: 'robe_of_power_bottoms', chance: 32 },
    ]
};

/**
 * Rolls on a loot table and returns an item ID or null.
 * Can return a simple string for basic drops or a detailed object for complex drops.
 * @param tableId The ID of the loot table to roll on.
 * @returns The item details of the dropped item, or null if no item was dropped.
 */
export const rollOnLootTable = (tableId: string): LootRollResult | string | null => {
    const table = LOOT_TABLES[tableId];
    if (!table) {
        console.warn(`Loot table with id "${tableId}" not found.`);
        return null;
    }

    const totalWeight = table.reduce((sum, item) => sum + item.chance, 0);
    const roll = Math.random() * (tableId === 'super_rare_table' ? 10000 : totalWeight);
    let cumulativeWeight = 0;

    for (const item of table) {
        cumulativeWeight += item.chance;
        if (roll < cumulativeWeight) {
            if (item.tableId) {
                return rollOnLootTable(item.tableId);
            }
            if (!item.itemId) {
                return null;
            }
            // If it has quantity or noted, return an object. Otherwise, return string for backward compatibility.
            if (item.minQuantity || item.maxQuantity || item.noted) {
                const min = item.minQuantity ?? 1;
                const max = item.maxQuantity ?? min;
                const quantity = Math.floor(Math.random() * (max - min + 1)) + min;
                return {
                    itemId: item.itemId,
                    quantity: quantity,
                    noted: item.noted ?? false,
                };
            } else {
                return item.itemId;
            }
        }
    }

    return null;
};