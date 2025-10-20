import { WeightedDrop } from '../../types';
import { HERBLORE_RECIPES } from '../herblore';

export interface ThievingStall {
    name: string;
    level: number;
    xp: number;
    respawnTime: number; // in ms
    loot: WeightedDrop[];
}

export const THIEVING_STALL_TARGETS: Record<string, ThievingStall> = {
    thieving_stall_bakery: {
        name: 'Bakery Stall',
        level: 5, xp: 25, respawnTime: 5000,
        loot: [
            { itemId: 'bread', chance: 6, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'sandwich', chance: 3, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cake', chance: 1, minQuantity: 1, maxQuantity: 1 },
        ]
    },
    thieving_stall_fur: {
        name: 'Fur Stall',
        level: 25, xp: 80, respawnTime: 18000,
        loot: [
            { itemId: 'leather', chance: 50, noted: true },
            { itemId: 'boar_leather', chance: 25, noted: true },
            { itemId: 'wolf_leather', chance: 15, noted: true },
            { itemId: 'bear_leather', chance: 10, noted: true },
        ]
    },
    thieving_stall_herb: {
        name: 'Herb Stall',
        level: 65, xp: 180, respawnTime: 30000,
        loot: [
            { tableId: 'herb_table', chance: 1 },
        ]
    },
    thieving_stall_potion: {
        name: 'Potion Stall',
        level: 60, xp: 160, respawnTime: 35000,
        loot: [
            { tableId: 'thieving_stall_potion_secondaries', chance: 99, noted: true },
            { tableId: 'thieving_stall_random_potion', chance: 1 }, // Potions will not be noted and have 1 dose. This needs special handling.
        ]
    },
    thieving_stall_fish: {
        name: 'Fish Stall',
        level: 15, xp: 65, respawnTime: 12000,
        loot: [
            { itemId: 'raw_shrimp', chance: 40 },
            { itemId: 'raw_sardine', chance: 30 },
            { itemId: 'raw_herring', chance: 20 },
            { itemId: 'raw_trout', chance: 10 },
        ]
    },
    thieving_stall_gem: {
        name: 'Gem Stall',
        level: 80, xp: 300, respawnTime: 120000,
        loot: [
            { itemId: 'uncut_sapphire', chance: 60 },
            { itemId: 'uncut_emerald', chance: 25 },
            { itemId: 'uncut_ruby', chance: 12 },
            { itemId: 'uncut_diamond', chance: 3 },
        ]
    },
    thieving_stall_dwarven: {
        name: 'Dwarven Stall',
        level: 70, xp: 190, respawnTime: 240000,
        loot: [
            { itemId: 'iron_ore', chance: 20, noted: true },
            { itemId: 'coal', chance: 20, noted: true },
            { itemId: 'bronze_pickaxe', chance: 35 },
            { itemId: 'iron_pickaxe', chance: 23 },
            { itemId: 'steel_pickaxe', chance: 21 },
            { itemId: 'iron_bar', chance: 10, noted: true },
            { itemId: 'steel_bar', chance: 5, noted: true },
            { itemId: 'mithril_pickaxe', chance: 6 },
            { itemId: 'adamantite_pickaxe', chance: 3 },
            { itemId: 'runic_pickaxe', chance: 1 },
        ]
    },
    thieving_stall_weapon: {
        name: 'Weapon Stall',
        level: 75, xp: 240, respawnTime: 60000,
        loot: [
            { itemId: 'mithril_dagger', chance: 20 },
            { itemId: 'mithril_sword', chance: 18 },
            { itemId: 'mithril_scimitar', chance: 16 },
            { itemId: 'adamantite_dagger', chance: 6 },
            { itemId: 'adamantite_sword', chance: 5 },
            { itemId: 'adamantite_mace', chance: 5 },
            { itemId: 'runic_dagger', chance: 2 },
            { itemId: 'runic_sword', chance: 1 },
        ]
    },
};

export const THIEVING_STALL_LOOT_TABLES: Record<string, WeightedDrop[]> = {
    thieving_stall_potion_secondaries: [
        { itemId: 'spider_eggs', chance: 1 },
        { itemId: 'boar_tusk', chance: 1 },
        { itemId: 'cave_slime_globule', chance: 1 },
        { itemId: 'redwater_kelp', chance: 1 },
        { itemId: 'glimmerhorn_dust', chance: 1 },
        { itemId: 'harpy_feather', chance: 1 },
        { itemId: 'bloodroot_tendril', chance: 1 },
        { itemId: 'frost_berries', chance: 1 },
        { itemId: 'spider_silk', chance: 1 },
        { itemId: 'golem_core_shard', chance: 1 },
    ],
    thieving_stall_random_potion: [
        ...HERBLORE_RECIPES.finished.map(p => ({ itemId: p.finishedPotionId, chance: 1, minQuantity: 1, maxQuantity: 1 }))
    ],
};
