
import { WeightedDrop } from '../../types';

export interface LockpickContainer {
    name: string;
    level: number;
    xp: number;
    respawnTime: number; // in ms
    loot: WeightedDrop[];
    unlocked?: boolean; // If true, requires no lockpick and cannot fail
    trap?: {
        type: 'damage' | 'teleport' | 'fire';
        damage?: number;
        teleportPoiId?: string;
        mimicChance?: number; // float from 0 to 1
    };
}

export const THIEVING_CONTAINER_TARGETS: Record<string, LockpickContainer> = {
    // --- TIER 1: DUSTY (Level 12) ---
    thieving_house_coin_purse_dusty: {
        name: 'Dusty Coin Purse',
        level: 12, xp: 10, respawnTime: 30000, unlocked: true,
        loot: [{ itemId: 'coins', chance: 1, minQuantity: 20, maxQuantity: 50 }]
    },
    thieving_house_drawer_dusty: {
        name: 'Dusty Drawer',
        level: 12, xp: 15, respawnTime: 50000,
        loot: [
            { itemId: 'coins', chance: "1/1", minQuantity: 1, maxQuantity: 15 },
            { itemId: 'thread', chance: "1/5", minQuantity: 1, maxQuantity: 5 },
            { itemId: 'needle', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'fishing_bait', chance: "1/10", minQuantity: 1, maxQuantity: 10 },
            { itemId: 'bobby_pin', chance: "1/7", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'spider_eggs', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 1 }
    },
    thieving_house_nightstand_dusty: {
        name: 'Dusty Nightstand',
        level: 12, xp: 22, respawnTime: 70000,
        loot: [
            { itemId: 'tinderbox', chance: "4/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bucket', chance: "3/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'shears', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bobby_pin', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cave_slime_globule', chance: "1/15", minQuantity: 1, maxQuantity: 2 },
        ],
        trap: { type: 'damage', damage: 1 }
    },
    thieving_house_medicine_cabinet_dusty: {
        name: 'Dusty Medicine Cabinet',
        level: 12, xp: 25, respawnTime: 75000,
        loot: [
            { itemId: 'cooked_shrimp', chance: "1/2", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'grimy_guromoot', chance: "1/3", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'spider_eggs', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'antipoison_potion', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sunfire_elixir', chance: "1/1024", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 1 }
    },
    thieving_house_vanity_dusty: {
        name: 'Dusty Vanity',
        level: 12, xp: 25, respawnTime: 60000,
        loot: [
            { itemId: 'uncut_sapphire', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'silver_ring', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bobby_pin', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 1 }
    },
    thieving_house_chest_dusty: {
        name: 'Dusty Chest',
        level: 12, xp: 50, respawnTime: 100000,
        loot: [
            { itemId: 'bronze_dagger', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_sapphire', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bronze_bar', chance: "4/25", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'iron_ore', chance: "1/5", minQuantity: 1, maxQuantity: 5, noted: true },
            { itemId: 'bobby_pin', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'global_gem_and_key_table', chance: "1/32" },
        ],
        trap: { type: 'damage', damage: 2 }
    },
    thieving_house_strongbox_dusty: {
        name: 'Dusty Strongbox',
        level: 12, xp: 60, respawnTime: 120000,
        loot: [
            { itemId: 'coins', chance: "1/12", minQuantity: 50, maxQuantity: 150 },
            { itemId: 'bronze_bar', chance: "1/5", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'uncut_sapphire', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bronze_dagger', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_sapphire', chance: "1/23", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'iron_helm', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bronze_battleaxe', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'iron_platebody', chance: "1/256", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bronze_bar', chance: "4/25", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'iron_ore', chance: "1/5", minQuantity: 1, maxQuantity: 5, noted: true },
            { itemId: 'bobby_pin', chance: "1/6", minQuantity: 1, maxQuantity: 2 },
            { tableId: 'global_gem_and_key_table', chance: "1/32" },
        ],
        trap: { type: 'damage', damage: 4 }
    },

    // --- TIER 2: LOCKED (Level 26) ---
    thieving_house_coin_purse_locked: {
        name: 'Locked Coin Purse',
        level: 26, xp: 20, respawnTime: 40000, unlocked: true,
        loot: [{ itemId: 'coins', chance: 1, minQuantity: 100, maxQuantity: 250 }]
    },
    thieving_house_drawer_locked: {
        name: 'Locked Drawer',
        level: 26, xp: 35, respawnTime: 80000,
        loot: [
            { itemId: 'coins', chance: "1/2", minQuantity: 25, maxQuantity: 70 },
            { itemId: 'knife', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'leather_gloves', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_sapphire', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bobby_pin', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 3 }
    },
    thieving_house_nightstand_locked: {
        name: 'Locked Nightstand',
        level: 26, xp: 55, respawnTime: 90000,
        loot: [
            { itemId: 'bread', chance: "6/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bronze_bar', chance: "2/25", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'iron_bar', chance: "1/25", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'lockpick', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'spider_eggs', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 3 }
    },
    thieving_house_medicine_cabinet_locked: {
        name: 'Locked Medicine Cabinet',
        level: 26, xp: 60, respawnTime: 95000,
        loot: [
            { itemId: 'cooked_trout', chance: "1/2", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'grimy_marleaf', chance: "1/3", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'redwater_kelp', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'antipoison_potion', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sunfire_elixir', chance: "1/768", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 3 }
    },
    thieving_house_vanity_locked: {
        name: 'Locked Vanity',
        level: 26, xp: 60, respawnTime: 100000,
        loot: [
            { itemId: 'uncut_sapphire', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_emerald', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'silver_necklace', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'silver_amulet', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'silver_ring', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gold_necklace', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gold_amulet', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gold_ring', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sapphire_amulet', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 3 }
    },
    thieving_house_chest_locked: {
        name: 'Locked Chest',
        level: 26, xp: 110, respawnTime: 150000,
        loot: [
            { itemId: 'iron_sword', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'steel_dagger', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'coal', chance: "4/25", minQuantity: 8, maxQuantity: 18, noted: true },
            { itemId: 'uncut_emerald', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'lockpick', chance: "3/16", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'global_gem_and_key_table', chance: "1/32" },
        ],
        trap: { type: 'damage', damage: 4 }
    },
    thieving_house_strongbox_locked: {
        name: 'Locked Strongbox',
        level: 26, xp: 130, respawnTime: 180000,
        loot: [
            { itemId: 'coins', chance: "1/1", minQuantity: 10, maxQuantity: 40 },
            { itemId: 'iron_bar', chance: "1/5", minQuantity: 2, maxQuantity: 4, noted: true },
            { itemId: 'steel_bar', chance: "1/10", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'uncut_emerald', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'iron_sword', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'steel_dagger', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_dagger', chance: "1/125", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'coal', chance: "4/25", minQuantity: 5, maxQuantity: 15, noted: true },
            { itemId: 'uncut_emerald', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'lockpick', chance: "3/16", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'global_gem_and_key_table', chance: "1/32" },
        ],
        trap: { type: 'damage', damage: 8 }
    },

    // --- TIER 3: PRISTINE (Level 40) ---
    thieving_house_coin_purse_pristine: {
        name: 'Pristine Coin Purse',
        level: 40, xp: 35, respawnTime: 50000, unlocked: true,
        loot: [{ itemId: 'coins', chance: 1, minQuantity: 300, maxQuantity: 600 }]
    },
    thieving_house_drawer_pristine: {
        name: 'Pristine Drawer',
        level: 40, xp: 60, respawnTime: 110000,
        loot: [
            { itemId: 'coins', chance: "2/5", minQuantity: 80, maxQuantity: 150 },
            { itemId: 'gold_ring', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'silver_necklace', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_emerald', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'lockpick', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'glimmerhorn_dust', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 4 }
    },
    thieving_house_nightstand_pristine: {
        name: 'Pristine Nightstand',
        level: 40, xp: 80, respawnTime: 140000,
        loot: [
            { itemId: 'steel_bar', chance: "4/25", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'gold_bar', chance: "2/25", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'uncut_ruby', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cooked_tuna', chance: "4/25", minQuantity: 1, maxQuantity: 4, noted: true },
            { itemId: 'lockpick', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bloodroot_tendril', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 5 }
    },
    thieving_house_medicine_cabinet_pristine: {
        name: 'Pristine Medicine Cabinet',
        level: 40, xp: 85, respawnTime: 145000,
        loot: [
            { itemId: 'cooked_tuna', chance: "1/2", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'grimy_redfang_leaf', chance: "1/3", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'glimmerhorn_dust', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'antipoison_potion', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sunfire_elixir', chance: "1/512", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 5 }
    },
    thieving_house_vanity_pristine: {
        name: 'Pristine Vanity',
        level: 40, xp: 90, respawnTime: 150000,
        loot: [
            { itemId: 'uncut_emerald', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_ruby', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gold_necklace', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gold_amulet', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'gold_ring', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sapphire_ring', chance: "1/30", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sapphire_amulet', chance: "1/30", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sapphire_necklace', chance: "1/30", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 5 }
    },
    thieving_house_chest_pristine: {
        name: 'Pristine Chest',
        level: 40, xp: 180, respawnTime: 180000,
        loot: [
            { itemId: 'steel_sword', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'steel_full_helm', chance: "3/125", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'coal', chance: "4/25", minQuantity: 15, maxQuantity: 30, noted: true },
            { itemId: 'uncut_ruby', chance: "4/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'lockpick', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'global_gem_and_key_table', chance: "1/32" },
        ],
        trap: { type: 'damage', damage: 5 }
    },
    thieving_house_strongbox_pristine: {
        name: 'Pristine Strongbox',
        level: 40, xp: 210, respawnTime: 220000,
        loot: [
            { itemId: 'coins', chance: "1/1", minQuantity: 40, maxQuantity: 100 },
            { itemId: 'steel_bar', chance: "1/5", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'mithril_bar', chance: "1/20", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'uncut_ruby', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: "1/10", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'steel_sword', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'steel_full_helm', chance: "3/125", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'coal', chance: "4/25", minQuantity: 15, maxQuantity: 30, noted: true },
            { itemId: 'uncut_ruby', chance: "4/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'lockpick', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'global_gem_and_key_table', chance: "1/32" },
        ],
        trap: { type: 'damage', damage: 10 }
    },

    // --- TIER 4: ORNATE (Level 54) ---
    thieving_house_coin_purse_ornate: {
        name: 'Ornate Coin Purse',
        level: 54, xp: 55, respawnTime: 60000, unlocked: true,
        loot: [{ itemId: 'coins', chance: 1, minQuantity: 800, maxQuantity: 1200 }]
    },
    thieving_house_drawer_ornate: {
        name: 'Ornate Drawer',
        level: 54, xp: 100, respawnTime: 130000,
        loot: [
            { itemId: 'coins', chance: "2/5", minQuantity: 150, maxQuantity: 300 },
            { itemId: 'gold_necklace', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_ruby', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_bar', chance: "1/5", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'lockpick', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_arrowtips', chance: "1/15", minQuantity: 10, maxQuantity: 20 },
        ],
        trap: { type: 'damage', damage: 6 }
    },
    thieving_house_nightstand_ornate: {
        name: 'Ornate Nightstand',
        level: 54, xp: 150, respawnTime: 160000,
        loot: [
            { itemId: 'mithril_bar', chance: "4/25", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'uncut_diamond', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cooked_lobster', chance: "4/25", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'diamond_lockpick', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_ore', chance: "1/10", minQuantity: 3, maxQuantity: 5, noted: true },
            { itemId: 'grimy_cinderbloom', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 6 }
    },
    thieving_house_medicine_cabinet_ornate: {
        name: 'Ornate Medicine Cabinet',
        level: 54, xp: 160, respawnTime: 165000,
        loot: [
            { itemId: 'cooked_lobster', chance: "1/2", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'grimy_cinderbloom', chance: "1/3", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'grimy_wyrmfire_petal', chance: "1/8", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bloodroot_tendril', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'antipoison_potion', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sunfire_elixir', chance: "1/384", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 6 }
    },
    thieving_house_vanity_ornate: {
        name: 'Ornate Vanity',
        level: 54, xp: 170, respawnTime: 170000,
        loot: [
            { itemId: 'uncut_sapphire', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_emerald', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_ruby', chance: "1/7", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_diamond', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sapphire_ring', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sapphire_amulet', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sapphire_necklace', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ring_of_prospecting', chance: "1/33", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'amulet_of_magic', chance: "1/33", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'necklace_of_binding', chance: "1/33", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 6 }
    },
    thieving_house_chest_ornate: {
        name: 'Ornate Chest',
        level: 54, xp: 320, respawnTime: 200000,
        loot: [
            { itemId: 'mithril_sword', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_full_helm', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_bar', chance: "4/25", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'uncut_diamond', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'diamond_lockpick', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_platelegs', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: "1/10", minQuantity: 10, maxQuantity: 20 },
            { tableId: 'global_gem_and_key_table', chance: "1/32" },
        ],
        trap: { type: 'damage', damage: 6, mimicChance: 0.005 }
    },
    thieving_house_strongbox_ornate: {
        name: 'Ornate Strongbox',
        level: 54, xp: 380, respawnTime: 250000,
        loot: [
            { itemId: 'coins', chance: "1/5", minQuantity: 100, maxQuantity: 250 },
            { itemId: 'mithril_bar', chance: "1/5", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'adamantite_bar', chance: "1/20", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'uncut_diamond', chance: "1/40", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: "1/10", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'mithril_sword', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_full_helm', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_bar', chance: "4/25", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'uncut_diamond', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'diamond_lockpick', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_platelegs', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cooked_lobster', chance: "4/25", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'mithril_ore', chance: "1/10", minQuantity: 3, maxQuantity: 5, noted: true },
            { itemId: 'grimy_cinderbloom', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'global_gem_and_key_table', chance: "1/32" },
        ],
        trap: { type: 'damage', damage: 12 }
    },

    // --- TIER 5: GILDED (Level 66) ---
    thieving_house_coin_purse_gilded: {
        name: 'Gilded Coin Purse',
        level: 66, xp: 80, respawnTime: 75000, unlocked: true,
        loot: [{ itemId: 'coins', chance: 1, minQuantity: 1500, maxQuantity: 2500 }]
    },
    thieving_house_drawer_gilded: {
        name: 'Gilded Drawer',
        level: 66, xp: 170, respawnTime: 150000,
        loot: [
            { itemId: 'coins', chance: "2/5", minQuantity: 300, maxQuantity: 600 },
            { itemId: 'ruby_necklace', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_diamond', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: "1/25", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'diamond_lockpick', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_arrowtips', chance: "1/15", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'grimy_duskshade', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 7 }
    },
    thieving_house_nightstand_gilded: {
        name: 'Gilded Nightstand',
        level: 66, xp: 250, respawnTime: 180000,
        loot: [
            { itemId: 'adamantite_bar', chance: "4/25", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'runic_bar', chance: "1/25", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'cooked_swordfish', chance: "4/25", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'diamond_lockpick', chance: "1/128", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'magic_potion', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_ore', chance: "1/10", minQuantity: 2, maxQuantity: 5, noted: true },
        ],
        trap: { type: 'damage', damage: 7 }
    },
    thieving_house_medicine_cabinet_gilded: {
        name: 'Gilded Medicine Cabinet',
        level: 66, xp: 260, respawnTime: 185000,
        loot: [
            { itemId: 'cooked_swordfish', chance: "1/2", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'grimy_duskshade', chance: "1/3", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'grimy_wyrmfire_petal', chance: "1/6", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'frost_berries', chance: "1/5", minQuantity: 1, maxQuantity: 5, noted: true },
            { itemId: 'super_antipoison', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sunfire_elixir', chance: "1/320", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 7 }
    },
    thieving_house_vanity_gilded: {
        name: 'Gilded Vanity',
        level: 66, xp: 280, respawnTime: 190000,
        loot: [
            { itemId: 'gold_bar', chance: "200/645", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'uncut_emerald', chance: "150/645" },
            { itemId: 'emerald', chance: "75/645" },
            { itemId: 'uncut_ruby', chance: "100/645" },
            { itemId: 'ruby', chance: "50/645" },
            { itemId: 'emerald_ring', chance: "20/645" },
            { itemId: 'emerald_necklace', chance: "15/645" },
            { itemId: 'ruby_ring', chance: "15/645" },
            { itemId: 'ruby_amulet', chance: "10/645" },
            { itemId: 'amulet_of_ranging', chance: "3/645" }, // Enchanted Emerald Amulet
            { itemId: 'amulet_of_strength', chance: "2/645" }, // Enchanted Ruby Amulet
            { itemId: 'uncut_diamond', chance: "5/645" },
        ],
        trap: { type: 'damage', damage: 7 }
    },
    thieving_house_chest_gilded: {
        name: 'Gilded Chest',
        level: 66, xp: 550, respawnTime: 240000,
        loot: [
            { itemId: 'adamantite_sword', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_platelegs', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: "4/25", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'uncut_diamond', chance: "2/25", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'skeleton_key', chance: "1/62500" },
            { itemId: 'grimy_duskshade', chance: "1/20", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'diamond_lockpick', chance: "1/96", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'adamantite_full_helm', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'astral_rune', chance: "1/10", minQuantity: 10, maxQuantity: 25 },
            { itemId: 'nexus_rune', chance: "1/10", minQuantity: 10, maxQuantity: 25 },
            { tableId: 'global_gem_and_key_table', chance: "1/32" },
        ],
        trap: { type: 'damage', damage: 7, mimicChance: 0.005 }
    },
    thieving_house_strongbox_gilded: {
        name: 'Gilded Strongbox',
        level: 66, xp: 650, respawnTime: 300000,
        loot: [
            { itemId: 'coins', chance: "1/5", minQuantity: 250, maxQuantity: 500 },
            { itemId: 'adamantite_bar', chance: "1/5", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'runic_bar', chance: "1/25", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'uncut_diamond', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'nexus_rune', chance: "1/10", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'adamantite_sword', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_platelegs', chance: "1/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: "4/25", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'uncut_diamond', chance: "2/25", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'skeleton_key', chance: "1/62500" },
            { itemId: 'grimy_duskshade', chance: "1/20", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'diamond_lockpick', chance: "1/96", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'adamantite_full_helm', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'astral_rune', chance: "1/10", minQuantity: 10, maxQuantity: 25 },
            { tableId: 'global_gem_and_key_table', chance: "1/32" },
        ],
        trap: { type: 'damage', damage: 14 }
    },

    // --- TIER 6: ROYAL (Level 78) ---
    thieving_house_coin_purse_royal: {
        name: 'Royal Coin Purse',
        level: 78, xp: 120, respawnTime: 90000, unlocked: true,
        loot: [{ itemId: 'coins', chance: 1, minQuantity: 3000, maxQuantity: 5000 }]
    },
    thieving_house_drawer_royal: {
        name: 'Royal Drawer',
        level: 78, xp: 280, respawnTime: 180000,
        loot: [
            { itemId: 'coins', chance: "2/5", minQuantity: 600, maxQuantity: 1200 },
            { itemId: 'diamond_ring', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_diamond', chance: "1/5", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'runic_bar', chance: "1/10", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'diamond_lockpick', chance: "1/96", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'grimy_stonebloom', chance: "1/15", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'runic_arrowtips', chance: "1/8", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'super_antipoison', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 8 }
    },
    thieving_house_nightstand_royal: {
        name: 'Royal Nightstand',
        level: 78, xp: 420, respawnTime: 220000,
        loot: [
            { itemId: 'runic_bar', chance: "4/25", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'cooked_shark', chance: "4/25", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'diamond_lockpick', chance: "1/96", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'skeleton_key', chance: "1/62500" },
            { itemId: 'mystic_page', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'super_magic_potion', chance: "1/30", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'yew_logs', chance: "1/5", minQuantity: 3, maxQuantity: 8, noted: true },
        ],
        trap: { type: 'damage', damage: 8 }
    },
    thieving_house_medicine_cabinet_royal: {
        name: 'Royal Medicine Cabinet',
        level: 78, xp: 440, respawnTime: 230000,
        loot: [
            { itemId: 'cooked_shark', chance: "1/2", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'grimy_stonebloom', chance: "1/3", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'grimy_wyrmfire_petal', chance: "1/6", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'spider_silk', chance: "1/5", minQuantity: 1, maxQuantity: 6 },
            { itemId: 'golem_core_shard', chance: "1/5", minQuantity: 1, maxQuantity: 5 },
            { itemId: 'super_antipoison', chance: "1/10", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'sunfire_elixir', chance: "1/256", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 8 }
    },
    thieving_house_vanity_royal: {
        name: 'Royal Vanity',
        level: 78, xp: 450, respawnTime: 240000,
        loot: [
            { itemId: 'gold_bar', chance: "150/607", minQuantity: 3, maxQuantity: 7, noted: true },
            { itemId: 'uncut_ruby', chance: "150/607" },
            { itemId: 'ruby', chance: "100/607" },
            { itemId: 'uncut_diamond', chance: "75/607" },
            { itemId: 'diamond', chance: "25/607" },
            { itemId: 'ruby_ring', chance: "30/607" },
            { itemId: 'ruby_necklace', chance: "25/607" },
            { itemId: 'ruby_amulet', chance: "20/607" },
            { itemId: 'diamond_ring', chance: "15/607" },
            { itemId: 'diamond_necklace', chance: "10/607" },
            { itemId: 'diamond_amulet', chance: "5/607" },
            { itemId: 'amulet_of_strength', chance: "10/607" }, // Enchanted Ruby Amulet
            { itemId: 'amulet_of_power', chance: "2/607" }, // Enchanted Diamond Amulet
        ],
        trap: { type: 'damage', damage: 8 }
    },
    thieving_house_chest_royal: {
        name: 'Royal Chest',
        level: 78, xp: 900, respawnTime: 300000,
        loot: [
            { itemId: 'runic_scimitar', chance: "2/125", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_kiteshield', chance: "1/125", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: "4/25", minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'uncut_diamond', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'skeleton_key', chance: "1/62500" },
            { itemId: 'diamond_lockpick', chance: "1/96", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_platelegs', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'aether_rune', chance: "1/10", minQuantity: 10, maxQuantity: 30 },
            { itemId: 'anima_rune', chance: "1/10", minQuantity: 10, maxQuantity: 30 },
            { itemId: 'dragon_bones', chance: "1/15", minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'tome_of_the_arcane', chance: "1/256", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'global_gem_and_key_table', chance: "1/32" },
        ],
        trap: { type: 'damage', damage: 8, mimicChance: 0.01 }
    },
    thieving_house_strongbox_royal: {
        name: 'Royal Strongbox',
        level: 78, xp: 1100, respawnTime: 400000,
        loot: [
            { itemId: 'coins', chance: "1/5", minQuantity: 500, maxQuantity: 1000 },
            { itemId: 'runic_bar', chance: "1/5", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'uncut_diamond', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'anima_rune', chance: "1/10", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'aether_rune', chance: "1/10", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'runic_scimitar', chance: "2/55", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_kiteshield', chance: "1/55", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: "4/25", minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'uncut_diamond', chance: "2/25", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'skeleton_key', chance: "1/62500" },
            { itemId: 'diamond_lockpick', chance: "1/96", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_platelegs', chance: "1/55", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'dragon_bones', chance: "1/15", minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'tome_of_the_master', chance: "1/256", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'global_gem_and_key_table', chance: "1/16" },
        ],
        trap: { type: 'damage', damage: 16 }
    },

    // TIER 1 - Dungeon Chest (Low) (Level 25+)
    thieving_dungeon_chest_low: {
        name: 'Dungeon Chest (Low)',
        level: 25, xp: 35, respawnTime: 90000,
        loot: [
            { itemId: 'coins', chance: "1/2", minQuantity: 50, maxQuantity: 150 },
            { itemId: 'iron_bar', chance: "3/20", minQuantity: 1, maxQuantity: 10, noted: true },
            { itemId: 'steel_bar', chance: "1/10", minQuantity: 1, maxQuantity: 6, noted: true },
            { itemId: 'coal', chance: "3/20", minQuantity: 10, maxQuantity: 25, noted: true },
            { itemId: 'gust_rune', chance: "1/20", minQuantity: 10, maxQuantity: 30 },
            { itemId: 'stone_rune', chance: "1/20", minQuantity: 10, maxQuantity: 30 },
        ],
        trap: { type: 'damage', damage: 3, mimicChance: 0.01  }
    },
    // TIER 2 - Dungeon Chest (Medium) (Level 45+)
    thieving_dungeon_chest_mid: {
        name: 'Dungeon Chest (Mid)',
        level: 45, xp: 65, respawnTime: 180000,
        loot: [
            { itemId: 'coins', chance: "1/1", minQuantity: 200, maxQuantity: 800 },
            { itemId: 'steel_bar', chance: "3/20", minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'mithril_bar', chance: "1/10", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'ember_rune', chance: "1/10", minQuantity: 150, maxQuantity: 400 },
            { itemId: 'aqua_rune', chance: "1/10", minQuantity: 150, maxQuantity: 400 },
            { itemId: 'uncut_sapphire', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_emerald', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'lockpick', chance: "3/25", minQuantity: 1, maxQuantity: 2 },
        ],
        trap: { type: 'fire', damage: 5, mimicChance: 0.01 }
    },
    // TIER 3 - Dungeon Chest (High) (Level 65+)
    thieving_dungeon_chest_high: {
        name: 'Dungeon Chest (High)',
        level: 65, xp: 100, respawnTime: 300000,
        loot: [
            { itemId: 'coins', chance: "1/1", minQuantity: 500, maxQuantity: 2000 },
            { itemId: 'mithril_bar', chance: "1/5", minQuantity: 3, maxQuantity: 7, noted: true },
            { itemId: 'adamantite_bar', chance: "1/10", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'runic_bar', chance: "1/20", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'uncut_ruby', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cooked_shark', chance: "1/10", minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'diamond_lockpick', chance: "1/96", minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 7, mimicChance: 0.05 }
    },
    // TIER 4 - Dungeon Chest (Elite) (Level 85+)
    thieving_dungeon_chest_elite: {
        name: 'Dungeon Chest (Elite)',
        level: 85, xp: 200, respawnTime: 900000,
        loot: [
            { itemId: 'coins', chance: "1/1", minQuantity: 2500, maxQuantity: 10000 },
            { itemId: 'adamantite_bar', chance: "1/16", minQuantity: 20, maxQuantity: 35, noted: true },
            { itemId: 'runic_bar', chance: "1/32", minQuantity: 10, maxQuantity: 25, noted: true },
            { itemId: 'uncut_diamond', chance: "1/20", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'yew_logs', chance: "1/16", minQuantity: 50, maxQuantity: 100, noted: true },
            { itemId: 'anima_rune', chance: "1/16", minQuantity: 100, maxQuantity: 200 },
            { itemId: 'nexus_rune', chance: "1/8", minQuantity: 100, maxQuantity: 200 },
            { itemId: 'diamond_lockpick', chance: "1/64", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'skeleton_key', chance: "1/12000", minQuantity: 1, maxQuantity: 1 }, 
        ],
        trap: { type: 'damage', damage: 9, mimicChance: 0.1 }
    },
};