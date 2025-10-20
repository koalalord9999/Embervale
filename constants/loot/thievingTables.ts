import { WeightedDrop } from '../../types';

export interface LockpickContainer {
    name: string;
    level: number;
    xp: number;
    respawnTime: number; // in ms
    loot: WeightedDrop[];
    trap?: {
        type: 'damage' | 'teleport' | 'fire';
        damage?: number;
        teleportPoiId?: string;
        mimicChance?: number; // float from 0 to 1
    };
}

export const THIEVING_CONTAINER_TARGETS: Record<string, LockpickContainer> = {
    // TIER 1 - Dusty (Level 12)
    thieving_house_drawer_dusty: {
        name: 'Dusty Drawer',
        level: 12, xp: 15, respawnTime: 50000,
        loot: [
            { itemId: 'coins', chance: 0.6, minQuantity: 1, maxQuantity: 15 },
            { itemId: 'thread', chance: 0.2, minQuantity: 1, maxQuantity: 5 },
            { itemId: 'needle', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'fishing_bait', chance: 0.1, minQuantity: 1, maxQuantity: 10 },
        ],
        trap: { type: 'damage', damage: 1 }
    },
    thieving_house_cabinet_dusty: {
        name: 'Dusty Cabinet',
        level: 12, xp: 22, respawnTime: 70000,
        loot: [
            { itemId: 'coins', chance: 0.5, minQuantity: 5, maxQuantity: 25 },
            { itemId: 'tinderbox', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bucket', chance: 0.15, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'shears', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bobby_pin', chance: 0.05, minQuantity: 1, maxQuantity: 2 },
        ],
        trap: { type: 'damage', damage: 1 }
    },
    thieving_house_chest_dusty: {
        name: 'Dusty Chest',
        level: 12, xp: 50, respawnTime: 100000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 20, maxQuantity: 75 },
            { itemId: 'bronze_dagger', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_sapphire', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bronze_bar', chance: 0.2, minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'iron_ore', chance: 0.25, minQuantity: 1, maxQuantity: 5, noted: true },
        ],
        trap: { type: 'damage', damage: 2 }
    },

    // TIER 2 - Locked (Level 26)
    thieving_house_drawer_locked: {
        name: 'Locked Drawer',
        level: 26, xp: 35, respawnTime: 80000,
        loot: [
            { itemId: 'coins', chance: 0.5, minQuantity: 25, maxQuantity: 70 },
            { itemId: 'knife', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'leather_gloves', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_sapphire', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bobby_pin', chance: 0.1, minQuantity: 1, maxQuantity: 3 },
        ],
        trap: { type: 'damage', damage: 3 }
    },
    thieving_house_cabinet_locked: {
        name: 'Locked Cabinet',
        level: 26, xp: 55, respawnTime: 90000,
        loot: [
            { itemId: 'coins', chance: 0.5, minQuantity: 30, maxQuantity: 90 },
            { itemId: 'bread', chance: 0.3, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'bronze_bar', chance: 0.1, minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'iron_bar', chance: 0.05, minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'lockpick', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 3 }
    },
    thieving_house_chest_locked: {
        name: 'Locked Chest',
        level: 26, xp: 110, respawnTime: 150000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 100, maxQuantity: 300 },
            { itemId: 'iron_sword', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'steel_dagger', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'coal', chance: 0.2, minQuantity: 8, maxQuantity: 18, noted: true },
            { itemId: 'uncut_emerald', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'lockpick', chance: 0.15, minQuantity: 1, maxQuantity: 2 },
        ],
        trap: { type: 'damage', damage: 4 }
    },

    // TIER 3 - Pristine (Level 40)
    thieving_house_drawer_pristine: {
        name: 'Pristine Drawer',
        level: 40, xp: 60, respawnTime: 110000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 80, maxQuantity: 150 },
            { itemId: 'gold_ring', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'silver_necklace', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_emerald', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'lockpick', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 4 }
    },
    thieving_house_cabinet_pristine: {
        name: 'Pristine Cabinet',
        level: 40, xp: 80, respawnTime: 140000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 120, maxQuantity: 250 },
            { itemId: 'steel_bar', chance: 0.2, minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'gold_bar', chance: 0.1, minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'uncut_ruby', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cooked_tuna', chance: 0.2, minQuantity: 1, maxQuantity: 2, noted: true },
        ],
        trap: { type: 'damage', damage: 5 }
    },
    thieving_house_chest_pristine: {
        name: 'Pristine Chest',
        level: 40, xp: 180, respawnTime: 180000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 150, maxQuantity: 400 },
            { itemId: 'steel_sword', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'steel_full_helm', chance: 0.03, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'coal', chance: 0.2, minQuantity: 15, maxQuantity: 30, noted: true },
            { itemId: 'uncut_ruby', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'lockpick', chance: 0.12, minQuantity: 1, maxQuantity: 3 },
        ],
        trap: { type: 'damage', damage: 5 }
    },

    // TIER 4 - Ornate (Level 54)
    thieving_house_drawer_ornate: {
        name: 'Ornate Drawer',
        level: 54, xp: 100, respawnTime: 130000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 150, maxQuantity: 300 },
            { itemId: 'gold_necklace', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_ruby', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_bar', chance: 0.2, minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'lockpick', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 6 }
    },
    thieving_house_cabinet_ornate: {
        name: 'Ornate Cabinet',
        level: 54, xp: 150, respawnTime: 160000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 200, maxQuantity: 400 },
            { itemId: 'mithril_bar', chance: 0.2, minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'uncut_diamond', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cooked_lobster', chance: 0.2, minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'diamond_lockpick', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 6 }
    },
    thieving_house_chest_ornate: {
        name: 'Ornate Chest',
        level: 54, xp: 320, respawnTime: 200000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 500, maxQuantity: 1200 },
            { itemId: 'mithril_sword', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mithril_full_helm', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_bar', chance: 0.2, minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'uncut_diamond', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'diamond_lockpick', chance: 0.15, minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 6 }
    },

    // TIER 5 - Gilded (Level 66)
    thieving_house_drawer_gilded: {
        name: 'Gilded Drawer',
        level: 66, xp: 170, respawnTime: 150000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 300, maxQuantity: 600 },
            { itemId: 'ruby_necklace', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_diamond', chance: 0.2, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_bar', chance: 0.2, minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'diamond_lockpick', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 7 }
    },
    thieving_house_cabinet_gilded: {
        name: 'Gilded Cabinet',
        level: 66, xp: 250, respawnTime: 180000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 400, maxQuantity: 800 },
            { itemId: 'adamantite_bar', chance: 0.2, minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'runic_bar', chance: 0.05, minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'cooked_swordfish', chance: 0.2, minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'diamond_lockpick', chance: 0.15, minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 7 }
    },
    thieving_house_chest_gilded: {
        name: 'Gilded Chest',
        level: 66, xp: 550, respawnTime: 240000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 1000, maxQuantity: 2500 },
            { itemId: 'adamantite_sword', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'adamantite_platelegs', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: 0.2, minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'uncut_diamond', chance: 0.1, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'skeleton_key', chance: 0.00002 },
            { itemId: 'diamond_lockpick', chance: 0.149, minQuantity: 1, maxQuantity: 2 },
        ],
        trap: { type: 'damage', damage: 7, mimicChance: 0.005 }
    },
    
    // TIER 6 - Royal (Level 78)
    thieving_house_drawer_royal: {
        name: 'Royal Drawer',
        level: 78, xp: 280, respawnTime: 180000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 600, maxQuantity: 1200 },
            { itemId: 'diamond_ring', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_diamond', chance: 0.2, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'runic_bar', chance: 0.2, minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'diamond_lockpick', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 8 }
    },
    thieving_house_cabinet_royal: {
        name: 'Royal Cabinet',
        level: 78, xp: 420, respawnTime: 220000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 800, maxQuantity: 1600 },
            { itemId: 'runic_bar', chance: 0.2, minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'cooked_shark', chance: 0.2, minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'diamond_lockpick', chance: 0.15, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'skeleton_key', chance: 0.00002 },
        ],
        trap: { type: 'damage', damage: 8 }
    },
    thieving_house_chest_royal: {
        name: 'Royal Chest',
        level: 78, xp: 900, respawnTime: 300000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 2000, maxQuantity: 5000 },
            { itemId: 'runic_scimitar', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_kiteshield', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_bar', chance: 0.2, minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'uncut_diamond', chance: 0.1, minQuantity: 2, maxQuantity: 3 },
            { itemId: 'skeleton_key', chance: 0.00002 },
            { itemId: 'diamond_lockpick', chance: 0.145, minQuantity: 1, maxQuantity: 3 },
        ],
        trap: { type: 'damage', damage: 8, mimicChance: 0.01 }
    },

    // TIER 1 - Dungeon Chest (Low) (Level 25+)
    thieving_dungeon_chest_low: {
        name: 'Dungeon Chest (Low)',
        level: 25, xp: 35, respawnTime: 90000,
        loot: [
            { itemId: 'coins', chance: 0.5, minQuantity: 50, maxQuantity: 150 },
            { itemId: 'iron_bar', chance: 0.15, minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'steel_bar', chance: 0.1, minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'coal', chance: 0.15, minQuantity: 10, maxQuantity: 25, noted: true },
            { itemId: 'gust_rune', chance: 0.05, minQuantity: 10, maxQuantity: 30 },
            { itemId: 'stone_rune', chance: 0.05, minQuantity: 10, maxQuantity: 30 },
        ],
        trap: { type: 'damage', damage: 3 }
    },
    // TIER 2 - Dungeon Chest (Medium) (Level 45+)
    thieving_dungeon_chest_mid: {
        name: 'Dungeon Chest (Mid)',
        level: 45, xp: 65, respawnTime: 180000,
        loot: [
            { itemId: 'coins', chance: 0.4, minQuantity: 200, maxQuantity: 800 },
            { itemId: 'steel_bar', chance: 0.15, minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'mithril_bar', chance: 0.1, minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'ember_rune', chance: 0.1, minQuantity: 15, maxQuantity: 40 },
            { itemId: 'aqua_rune', chance: 0.1, minQuantity: 15, maxQuantity: 40 },
            { itemId: 'uncut_sapphire', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'uncut_emerald', chance: 0.02, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'lockpick', chance: 0.08, minQuantity: 1, maxQuantity: 2 },
        ],
        trap: { type: 'fire', damage: 30 }
    },
    // TIER 3 - Dungeon Chest (High) (Level 65+)
    thieving_dungeon_chest_high: {
        name: 'Dungeon Chest (High)',
        level: 65, xp: 100, respawnTime: 300000,
        loot: [
            { itemId: 'coins', chance: 0.3, minQuantity: 500, maxQuantity: 2000 },
            { itemId: 'mithril_bar', chance: 0.2, minQuantity: 3, maxQuantity: 7, noted: true },
            { itemId: 'adamantite_bar', chance: 0.1, minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'runic_bar', chance: 0.05, minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'uncut_ruby', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cooked_shark', chance: 0.1, minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'diamond_lockpick', chance: 0.02, minQuantity: 1, maxQuantity: 1 },
        ],
        trap: { type: 'damage', damage: 7, mimicChance: 0.01 }
    },
    // TIER 4 - Dungeon Chest (Elite) (Level 85+)
    thieving_dungeon_chest_elite: {
        name: 'Dungeon Chest (Elite)',
        level: 85, xp: 200, respawnTime: 900000,
        loot: [
            { itemId: 'coins', chance: 0.25, minQuantity: 2500, maxQuantity: 10000 },
            { itemId: 'adamantite_bar', chance: 0.2, minQuantity: 5, maxQuantity: 10, noted: true },
            { itemId: 'runic_bar', chance: 0.1, minQuantity: 2, maxQuantity: 5, noted: true },
            { itemId: 'uncut_diamond', chance: 0.05, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'yew_logs', chance: 0.1, minQuantity: 50, maxQuantity: 100, noted: true },
            { itemId: 'anima_rune', chance: 0.1, minQuantity: 10, maxQuantity: 20 },
            { itemId: 'nexus_rune', chance: 0.1, minQuantity: 10, maxQuantity: 20 },
            { itemId: 'diamond_lockpick', chance: 0.0998, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'skeleton_key', chance: 0.0002, minQuantity: 1, maxQuantity: 1 }, // 1 in 5,000
        ],
        trap: { type: 'damage', damage: 9, mimicChance: 0.01 }
    },
};