
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
            { itemId: 'bronze_arrow', quantity: 100, priceModifier: 1.1 },
            { itemId: 'bronze_sword', quantity: 10, priceModifier: 1.1},
            { itemId: 'wooden_shield', quantity: 10, priceModifier: 1.1},
            { itemId: 'leather_body', quantity: 5, priceModifier: 1.1},
            { itemId: 'vial', quantity: 100, priceModifier: 1.0 },
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
            { itemId: 'vial', quantity: 100, priceModifier: 1.0 },
        ]
    },
    silverhaven_general: {
        id: 'silverhaven_general',
        name: 'Silverhaven General',
        inventory: []
    },
    silverhaven_crafting: {
        id: 'silverhaven_crafting',
        name: "Artisan's Wares",
        inventory: []
    },
    silverhaven_fishing: {
        id: 'silverhaven_fishing',
        name: 'The Salty Catch',
        inventory: []
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
