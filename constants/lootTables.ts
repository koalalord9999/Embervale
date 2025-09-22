interface LootTableItem {
    itemId: string;
    chance: number; // A weight, not a percentage
}

type LootTable = LootTableItem[];

// Loot tables define weighted drops. The `rollOnLootTable` function will pick one.
const LOOT_TABLES: Record<string, LootTable> = {
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
        { itemId: 'uncut_sapphire', chance: 500 },
        { itemId: 'uncut_emerald', chance: 300 },
        { itemId: 'uncut_ruby', chance: 150 },
        { itemId: 'uncut_diamond', chance: 40 },
        { itemId: 'strange_key_loop', chance: 5 },
        { itemId: 'strange_key_tooth', chance: 5 },
        { itemId: 'talisman_drop', chance: 10 },
    ],
    robes_of_power_table: [
        { itemId: 'robe_of_power_hat', chance: 32 },
        { itemId: 'robe_of_power_top', chance: 32 },
        { itemId: 'robe_of_power_bottoms', chance: 32 },
    ]
};

/**
 * Rolls on a loot table and returns an item ID or null.
 * @param tableId The ID of the loot table to roll on.
 * @returns The item ID of the dropped item, or null if no item was dropped.
 */
export const rollOnLootTable = (tableId: string): string | null => {
    const table = LOOT_TABLES[tableId];
    if (!table) {
        console.warn(`Loot table with id "${tableId}" not found.`);
        return null;
    }

    const totalWeight = table.reduce((sum, item) => sum + item.chance, 0);
    const roll = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (const item of table) {
        cumulativeWeight += item.chance;
        if (roll < cumulativeWeight) {
            return item.itemId;
        }
    }

    return null; // Should not happen if totalWeight > 0
};