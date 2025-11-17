import { Shop } from '../types';

export const SHOPS: Record<string, Shop> = {
    general_store: {
        id: 'general_store',
        name: "Meadowdale General Store",
        inventory: [
            { itemId: 'knife', quantity: 10, priceModifier: 1.0 },
            { itemId: 'tinderbox', quantity: 10, priceModifier: 1.0},
            { itemId: 'hammer', quantity: 10, priceModifier: 1.0 },
            { itemId: 'shears', quantity: 5, priceModifier: 1.0 },
            { itemId: 'bucket', quantity: 100, priceModifier: 1.0 },
            { itemId: 'pie_dish', quantity: 50, priceModifier: 1.0 },
            { itemId: 'cake_tin', quantity: 50, priceModifier: 1.0 },
            { itemId: 'bobby_pin', quantity: 25, priceModifier: 20.0 },
            { itemId: 'bronze_axe', quantity: 10, priceModifier: 1.1 },
            { itemId: 'bronze_pickaxe', quantity: 10, priceModifier: 1.1 },
            { itemId: 'shortbow', quantity: 5, priceModifier: 1.1 },
            { itemId: 'bronze_arrow', quantity: 1000, priceModifier: 1.1 },
            { itemId: 'bronze_sword', quantity: 10, priceModifier: 1.1},
            { itemId: 'wooden_shield', quantity: 10, priceModifier: 1.1},
            { itemId: 'leather_body', quantity: 5, priceModifier: 1.1},
            { itemId: 'vial', quantity: 1000, priceModifier: 1.0 },
            { itemId: 'staff', quantity: 10, priceModifier: 1.2 },
        ]
    },
    meadowdale_fishing: {
        id: 'meadowdale_fishing',
        name: "Angler's Repose",
        inventory: [
            { itemId: 'small_fishing_net', quantity: 10, priceModifier: 1.1 },
            { itemId: 'fishing_rod', quantity: 10, priceModifier: 1.1 },
            { itemId: 'fly_fishing_rod', quantity: 5, priceModifier: 1.2 },
            { itemId: 'fishing_bait', quantity: 1000, priceModifier: 1.0 },
            { itemId: 'feathers', quantity: 1000, priceModifier: 1.0 },
            { itemId: 'basket_trap', quantity: 5, priceModifier: 1.2 },
        ]
    },
    dwarven_pickaxes: {
        id: 'dwarven_pickaxes',
        name: "Durin's Pickaxes",
        inventory: [
            { itemId: 'bronze_pickaxe', quantity: 5, priceModifier: 1.0 },
            { itemId: 'iron_pickaxe', quantity: 5, priceModifier: 1.4 },
            { itemId: 'steel_pickaxe', quantity: 5, priceModifier: 1.8 },
            { itemId: 'mithril_pickaxe', quantity: 5, priceModifier: 2.0 },
        ]
    },
    oakhaven_general: {
        id: 'oakhaven_general',
        name: "Oakhaven General Store",
        inventory: [
            { itemId: 'knife', quantity: 10, priceModifier: 1.0 },
            { itemId: 'shears', quantity: 5, priceModifier: 1.0 },
            { itemId: 'hammer', quantity: 10, priceModifier: 1.0 },
            { itemId: 'bucket', quantity: 100, priceModifier: 1.0 },
            { itemId: 'pie_dish', quantity: 50, priceModifier: 1.0 },
            { itemId: 'cake_tin', quantity: 50, priceModifier: 1.0 },
            { itemId: 'bronze_axe', quantity: 10, priceModifier: 1.1 },
            { itemId: 'bronze_pickaxe', quantity: 10, priceModifier: 1.1 },
            { itemId: 'bronze_sword', quantity: 10, priceModifier: 1.1},
            { itemId: 'wooden_shield', quantity: 10, priceModifier: 1.1},
            { itemId: 'vial', quantity: 100, priceModifier: 1.0 },
        ]
    },
    oakhaven_crafting: {
        id: 'oakhaven_crafting',
        name: "Artisan Supplies",
        inventory: [
            { itemId: 'chisel', quantity: 10, priceModifier: 1.0 },
            { itemId: 'needle', quantity: 100, priceModifier: 1.0 },
            { itemId: 'thread', quantity: 1000, priceModifier: 1.0 },
            { itemId: 'ring_mould', quantity: 10, priceModifier: 1.0 },
            { itemId: 'necklace_mould', quantity: 10, priceModifier: 1.0 },
            { itemId: 'amulet_mould', quantity: 10, priceModifier: 1.0 },
            { itemId: 'tiara_mould', quantity: 10, priceModifier: 1.0 },
            { itemId: 'vial', quantity: 1000, priceModifier: 1.0 },
        ]
    },
    oakhaven_herblore: {
        id: 'oakhaven_herblore',
        name: "Elara's Apothecary",
        inventory: [
            { itemId: 'pestle_and_mortar', quantity: 10, priceModifier: 1.0 },
            { itemId: 'vial_of_water', quantity: 1000, priceModifier: 1.0 },
            { itemId: 'spider_eggs', quantity: 5, priceModifier: 1.2 },
        ]
    },
    meadowdale_magic: {
        id: 'meadowdale_magic',
        name: "Elmsworth's Embryo Magicks",
        inventory: [
            { itemId: 'binding_rune', quantity: 1000, priceModifier: 1.4 },
            { itemId: 'gust_rune', quantity: 1000, priceModifier: 1.4 },
            { itemId: 'wizard_hat', quantity: 10, priceModifier: 1.4 },
            { itemId: 'wizard_robe_top', quantity: 10, priceModifier: 1.4 },
            { itemId: 'wizard_robe_skirt', quantity: 10, priceModifier: 1.4 },
            { itemId: 'wizard_boots', quantity: 10, priceModifier: 1.4 },
            { itemId: 'staff', quantity: 10, priceModifier: 1.4 },
        ]
    },
    silverhaven_general: {
        id: 'silverhaven_general',
        name: 'Silverhaven General',
        inventory: [
            { itemId: 'iron_axe', quantity: 5, priceModifier: 1.1 },
            { itemId: 'iron_pickaxe', quantity: 5, priceModifier: 1.1 },
            { itemId: 'iron_sword', quantity: 5, priceModifier: 1.1 },
            { itemId: 'oak_shortbow', quantity: 5, priceModifier: 1.1 },
            { itemId: 'iron_arrow', quantity: 1000, priceModifier: 1.1 },
            { itemId: 'vial', quantity: 1000, priceModifier: 1.0 },
            { itemId: 'rope', quantity: 100, priceModifier: 1.0 },
        ]
    },
    silverhaven_crafting: {
        id: 'silverhaven_crafting',
        name: "Artisan's Wares",
        inventory: [
            { itemId: 'rope', quantity: 100, priceModifier: 1.0 },
            { itemId: 'flax', quantity: 50, priceModifier: 1.0 },
            { itemId: 'chisel', quantity: 10, priceModifier: 1.0 },
            { itemId: 'needle', quantity: 100, priceModifier: 1.0 },
            { itemId: 'thread', quantity: 1000, priceModifier: 1.0 },
            { itemId: 'ring_mould', quantity: 10, priceModifier: 1.0 },
            { itemId: 'necklace_mould', quantity: 10, priceModifier: 1.0 },
            { itemId: 'amulet_mould', quantity: 10, priceModifier: 1.0 },
        ]
    },
    silverhaven_magic_shop: {
        id: 'silverhaven_magic_shop',
        name: 'Silverhaven Arcane Wares',
        inventory: [
            { itemId: 'mystic_page', quantity: 10000, priceModifier: 10.0 },
            { itemId: 'staff_of_gusts', quantity: 5, priceModifier: 1.2 },
            { itemId: 'staff_of_aqua', quantity: 5, priceModifier: 1.2 },
            { itemId: 'staff_of_stone', quantity: 5, priceModifier: 1.2 },
            { itemId: 'staff_of_ember', quantity: 5, priceModifier: 1.2 },
            { itemId: 'wizard_hat', quantity: 10, priceModifier: 1.1 },
            { itemId: 'wizard_robe_top', quantity: 10, priceModifier: 1.1 },
            { itemId: 'wizard_robe_skirt', quantity: 10, priceModifier: 1.1 },
            { itemId: 'wizard_boots', quantity: 10, priceModifier: 1.1 },
            { itemId: 'gust_rune', quantity: 5000, priceModifier: 1.2 },
            { itemId: 'aqua_rune', quantity: 5000, priceModifier: 1.2 },
            { itemId: 'stone_rune', quantity: 5000, priceModifier: 1.2 },
            { itemId: 'ember_rune', quantity: 5000, priceModifier: 1.2 },
            { itemId: 'binding_rune', quantity: 2500, priceModifier: 1.2 },
            { itemId: 'flux_rune', quantity: 300, priceModifier: 1.2 },
            { itemId: 'hex_rune', quantity: 100, priceModifier: 1.2 },
            { itemId: 'nexus_rune', quantity: 100, priceModifier: 1.2 },
        ]
    },
    silverhaven_fishing: {
        id: 'silverhaven_fishing',
        name: 'The Salty Catch',
        inventory: [
            { itemId: 'small_fishing_net', quantity: 10, priceModifier: 1.1 },
            { itemId: 'fishing_rod', quantity: 10, priceModifier: 1.1 },
            { itemId: 'fly_fishing_rod', quantity: 5, priceModifier: 1.2 },
            { itemId: 'harpoon', quantity: 5, priceModifier: 1.2 },
            { itemId: 'basket_trap', quantity: 5, priceModifier: 1.2 },
            { itemId: 'ocean_box_trap', quantity: 5, priceModifier: 1.2 },
            { itemId: 'fishing_bait', quantity: 5000, priceModifier: 1.0 },
            { itemId: 'feathers', quantity: 5000, priceModifier: 1.0 },
            { itemId: 'raw_shrimp', quantity: 1000, priceModifier: 1.0 },
            { itemId: 'raw_sardine', quantity: 500, priceModifier: 1.0 },
            { itemId: 'raw_herring', quantity: 250, priceModifier: 1.0 },
            { itemId: 'raw_trout', quantity: 100, priceModifier: 1.0 },
        ]
    },
    gilded_hammer_armory: {
        id: 'gilded_hammer_armory',
        name: 'The Gilded Hammer Armory',
        inventory: [
            { itemId: 'bronze_full_helm', quantity: 5, priceModifier: 1.2 },
            { itemId: 'bronze_platebody', quantity: 5, priceModifier: 1.2 },
            { itemId: 'bronze_platelegs', quantity: 5, priceModifier: 1.2 },
            { itemId: 'bronze_kiteshield', quantity: 5, priceModifier: 1.2 },
            { itemId: 'iron_full_helm', quantity: 5, priceModifier: 1.2 },
            { itemId: 'iron_platebody', quantity: 5, priceModifier: 1.2 },
            { itemId: 'iron_platelegs', quantity: 5, priceModifier: 1.2 },
            { itemId: 'iron_kiteshield', quantity: 5, priceModifier: 1.2 },
            { itemId: 'steel_full_helm', quantity: 5, priceModifier: 1.2 },
            { itemId: 'steel_platebody', quantity: 5, priceModifier: 1.2 },
            { itemId: 'steel_platelegs', quantity: 5, priceModifier: 1.2 },
            { itemId: 'steel_kiteshield', quantity: 5, priceModifier: 1.2 },
            { itemId: 'fire_resistant_shield', quantity: 5, priceModifier: 1.2 },
        ]
    },
    slayer_master_shop: {
        id: 'slayer_master_shop',
        name: 'Slayer Rewards',
        inventory: []
    },
    isle_of_whispers_general: {
        id: 'isle_of_whispers_general',
        name: 'Salty Supplies',
        inventory: [
            { itemId: 'small_fishing_net', quantity: 5, priceModifier: 1.2 },
            { itemId: 'fishing_rod', quantity: 5, priceModifier: 1.2 },
            { itemId: 'fishing_bait', quantity: 500, priceModifier: 1.0},
            { itemId: 'harpoon', quantity: 2, priceModifier: 1.5 },
            { itemId: 'fishing_bait', quantity: 100, priceModifier: 1.1 },
            { itemId: 'vial_of_water', quantity: 50, priceModifier: 1.1 },
            { itemId: 'cooked_pike', quantity: 5, priceModifier: 1.2 },
            { itemId: 'rope', quantity: 10, priceModifier: 1.2 },
            { itemId: 'bronze_sword', quantity: 2, priceModifier: 1.3 },
        ]
    },
    fouthia_general: {
        id: 'fouthia_general',
        name: "Wanderer's Wares",
        inventory: [
            { itemId: 'waterskin', quantity: 20, priceModifier: 1.0, doses: 4 },
            { itemId: 'rope', quantity: 10, priceModifier: 1.0 },
            { itemId: 'knife', quantity: 5, priceModifier: 1.0 },
            { itemId: 'tinderbox', quantity: 5, priceModifier: 1.0 },
            { itemId: 'steel_axe', quantity: 2, priceModifier: 1.2 },
            { itemId: 'steel_pickaxe', quantity: 2, priceModifier: 1.2 },
            { itemId: 'oak_shortbow', quantity: 3, priceModifier: 1.2 },
            { itemId: 'steel_arrow', quantity: 500, priceModifier: 1.1 },
            { itemId: 'cooked_beef', quantity: 50, priceModifier: 1.0 },
        ]
    },
    fouthia_armorer: {
        id: 'fouthia_armorer',
        name: 'Desert Armorer',
        inventory: [
            { itemId: 'leather_body', quantity: 5, priceModifier: 1.1 },
            { itemId: 'boar_hide_body', quantity: 3, priceModifier: 1.2 },
            { itemId: 'wolf_pelt_body', quantity: 2, priceModifier: 1.3 },
            { itemId: 'fire_resistant_shield', quantity: 5, priceModifier: 1.2 },
            { itemId: 'iron_full_helm', quantity: 3, priceModifier: 1.1 },
            { itemId: 'steel_full_helm', quantity: 2, priceModifier: 1.2 },
            { itemId: 'steel_scimitar', quantity: 3, priceModifier: 1.2 },
            { itemId: 'mithril_scimitar', quantity: 1, priceModifier: 2 },
        ]
    },
    fouthia_alchemist: {
        id: 'fouthia_alchemist',
        name: "Zafira's Remedies",
        inventory: [
            { itemId: 'pestle_and_mortar', quantity: 5, priceModifier: 1.0 },
            { itemId: 'vial_of_water', quantity: 200, priceModifier: 1.0 },
            { itemId: 'weak_defence_potion', quantity: 10, priceModifier: 10 },
            { itemId: 'antipoison_potion', quantity: 10, priceModifier: 10 },
            { itemId: 'spider_eggs', quantity: 20, priceModifier: 1.1 },
            { itemId: 'glimmerhorn_dust', quantity: 10, priceModifier: 1.2 },
        ]
    },
}