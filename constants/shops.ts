
import { Shop } from '../types';

export const SHOPS: Record<string, Shop> = {
    general_store: {
        id: 'general_store',
        name: "Meadowdale General Store",
        inventory: [
            { itemId: 'knife', quantity: 10, priceModifier: 1.0 },
            { itemId: 'shears', quantity: 5, priceModifier: 1.0 },
            { itemId: 'bronze_axe', quantity: 10, priceModifier: 1.1 },
            { itemId: 'shortbow', quantity: 5, priceModifier: 1.1 },
            { itemId: 'bronze_arrow', quantity: 1000, priceModifier: 1.1 },
            { itemId: 'bronze_sword', quantity: 10, priceModifier: 1.1},
            { itemId: 'wooden_shield', quantity: 10, priceModifier: 1.1},
            { itemId: 'leather_body', quantity: 5, priceModifier: 1.1},
            { itemId: 'vial', quantity: 1000, priceModifier: 1.0 },
        ]
    },
    oakhaven_general: {
        id: 'oakhaven_general',
        name: "Oakhaven General Store",
        inventory: [
            { itemId: 'knife', quantity: 10, priceModifier: 1.0 },
            { itemId: 'shears', quantity: 5, priceModifier: 1.0 },
            { itemId: 'bronze_axe', quantity: 10, priceModifier: 1.1 },
            { itemId: 'bronze_sword', quantity: 10, priceModifier: 1.1},
            { itemId: 'wooden_shield', quantity: 10, priceModifier: 1.1},
            { itemId: 'vial', quantity: 100, priceModifier: 1.0 },
        ]
    },
    oakhaven_crafting: {
        id: 'oakhaven_crafting',
        name: "Oakhaven Crafting Supplies",
        inventory: [
            { itemId: 'chisel', quantity: 10, priceModifier: 1.0 },
            { itemId: 'needle', quantity: 100, priceModifier: 1.0 },
            { itemId: 'thread', quantity: 1000, priceModifier: 1.0 },
            { itemId: 'ring_mould', quantity: 10, priceModifier: 1.0 },
            { itemId: 'necklace_mould', quantity: 10, priceModifier: 1.0 },
            { itemId: 'amulet_mould', quantity: 10, priceModifier: 1.0 },
            { itemId: 'vial', quantity: 1000, priceModifier: 1.0 },
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
    silverhaven_fishing: {
        id: 'silverhaven_fishing',
        name: 'The Salty Catch',
        inventory: [
            { itemId: 'raw_shrimp', quantity: 1000, priceModifier: 1.0 },
            { itemId: 'raw_sardine', quantity: 500, priceModifier: 1.0 },
            { itemId: 'raw_herring', quantity: 250, priceModifier: 1.0 },
            { itemId: 'raw_trout', quantity: 100, priceModifier: 1.0 },
            { itemId: 'feathers', quantity: 1000, priceModifier: 1.0 },
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
        inventory: []
    }
}