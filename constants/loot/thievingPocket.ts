
import { WeightedDrop } from '../../types';

export interface PickpocketTarget {
    name: string;
    level: number;
    xp: number;
    stunDuration: number;
    damageOnFailure: number;
    loot: WeightedDrop[];
}

export const THIEVING_POCKET_TARGETS: Record<string, PickpocketTarget> = {
    // Level 1 Thieving
    pickpocket_man_woman_table: {
        name: 'Man / Woman',
        level: 1, xp: 8, stunDuration: 4200, damageOnFailure: 1,
        loot: [{ itemId: 'coins', chance: 1, minQuantity: 3, maxQuantity: 3 }]
    },
    // Level 5 Thieving
    pickpocket_tavern_regular: {
        name: 'Tavern Regular',
        level: 5, xp: 12, stunDuration: 4200, damageOnFailure: 1,
        loot: [{ itemId: 'coins', chance: "9/10", minQuantity: 4, maxQuantity: 4 }, { itemId: 'beer', chance: "1/10", minQuantity: 1, maxQuantity: 1 }]
    },
    // Level 10 Thieving
    pickpocket_farmer_table: {
        name: 'Farmer',
        level: 10, xp: 18, stunDuration: 4200, damageOnFailure: 1,
        loot: [{ itemId: 'seeds', chance: 1, minQuantity: 1, maxQuantity: 3 }]
    },
    // Level 15 Thieving
    pickpocket_oakhaven_citizen: {
        name: 'Oakhaven Citizen',
        level: 15, xp: 24, stunDuration: 4200, damageOnFailure: 1,
        loot: [{ itemId: 'coins', chance: 1, minQuantity: 10, maxQuantity: 10 }]
    },
    // Level 20 Thieving
    pickpocket_craftsman_table: {
        name: 'Craftsman',
        level: 20, xp: 35, stunDuration: 4200, damageOnFailure: 1,
        loot: [{ itemId: 'coins', chance: "4/5", minQuantity: 15, maxQuantity: 15 }, { itemId: 'thread', chance: "1/5", minQuantity: 1, maxQuantity: 3 }]
    },
    // Level 30 Thieving
    pickpocket_crier_table: {
        name: 'Town Crier',
        level: 30, xp: 48, stunDuration: 4200, damageOnFailure: 2,
        loot: [{ itemId: 'coins', chance: 1, minQuantity: 25, maxQuantity: 25 }]
    },
     // Level 35 Thieving
    pickpocket_silverhaven_citizen: {
        name: 'Silverhaven Citizen',
        level: 35, xp: 55, stunDuration: 4200, damageOnFailure: 2,
        loot: [{ itemId: 'coins', chance: 1, minQuantity: 30, maxQuantity: 30 }]
    },
    pickpocket_warrior_table: {
        name: 'Warrior',
        level: 35, xp: 55, stunDuration: 4200, damageOnFailure: 2,
        loot: [{ itemId: 'coins', chance: "9/10", minQuantity: 35, maxQuantity: 35 }, { itemId: 'iron_arrow', chance: "1/10", minQuantity: 1, maxQuantity: 5 }]
    },
    // Level 40 Thieving
    pickpocket_guard_table: {
        name: 'Guard',
        level: 40, xp: 80, stunDuration: 4200, damageOnFailure: 2,
        loot: [{ itemId: 'coins', chance: "9/10", minQuantity: 40, maxQuantity: 40 }, { itemId: 'bread', chance: "1/10", minQuantity: 1, maxQuantity: 1 }]
    },
    pickpocket_dwarf_table: {
        name: 'Dwarf',
        level: 40, xp: 80, stunDuration: 4200, damageOnFailure: 3,
        loot: [{ itemId: 'coins', chance: "19/20", minQuantity: 40, maxQuantity: 40 }, { itemId: 'iron_ore', chance: "1/20", minQuantity: 1, maxQuantity: 1, noted: true }]
    },
    // Level 45 Thieving
    pickpocket_yeoman_table: {
        name: 'Yeoman',
        level: 45, xp: 90, stunDuration: 4200, damageOnFailure: 3,
        loot: [{ itemId: 'seeds', chance: "4/5", minQuantity: 3, maxQuantity: 12 }, { itemId: 'seeds', chance: "1/5", minQuantity: 12, maxQuantity: 36 }]
    },
    pickpocket_merchant_table: {
        name: 'Merchant',
        level: 45, xp: 90, stunDuration: 4200, damageOnFailure: 3,
        loot: [{ itemId: 'coins', chance: "19/20", minQuantity: 50, maxQuantity: 150 }, { tableId: 'gem_table', chance: "1/20", minQuantity: 1, maxQuantity: 1 }]
    },
    // Level 55 Thieving
    pickpocket_knight_table: {
        name: 'Knight',
        level: 55, xp: 110, stunDuration: 4200, damageOnFailure: 3,
        loot: [
            { itemId: 'coins', chance: "17/20", minQuantity: 70, maxQuantity: 70 },
            { itemId: 'steel_bar', chance: "1/10", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'mithril_bar', chance: "1/25", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'uncut_ruby', chance: "9/1000", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'skeleton_key', chance: "1/50000", minQuantity: 1, maxQuantity: 1 },
        ]
    },
    // Level 70 Thieving
    pickpocket_elf_table: {
        name: 'Elf',
        level: 70, xp: 200, stunDuration: 4200, damageOnFailure: 4,
        loot: [
            { itemId: 'coins', chance: "3/4", minQuantity: 65, maxQuantity: 65 },
            { itemId: 'verdant_rune', chance: "1/10", minQuantity: 2, maxQuantity: 5 },
            { itemId: 'passage_rune', chance: "1/10", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'yew_logs', chance: "1/20", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'yew_shortbow', chance: "1/128", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'yew_longbow', chance: "1/128", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'skeleton_key', chance: "1/40000", minQuantity: 1, maxQuantity: 1 },
        ]
    },
    // Level 80 Thieving
    pickpocket_adventurer_table: {
        name: 'Adventurer',
        level: 80, xp: 320, stunDuration: 4200, damageOnFailure: 5,
        loot: [
            { itemId: 'coins', chance: "4/5", minQuantity: 100, maxQuantity: 400 },
            { itemId: 'super_attack_potion', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'super_strength_potion', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cooked_shark', chance: "2/25", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'adamantite_bar', chance: "1/25", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'skeleton_key', chance: "1/25000", minQuantity: 1, maxQuantity: 1 },
        ]
    },
};
