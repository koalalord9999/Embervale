

// This barrel file combines all item data from the /items directory.

import { Item } from '../types';
import { armor } from './items/armor';
import { foodAndPotions } from './items/foodAndPotions';
import { misc } from './items/misc';
import { resources } from './items/resources';
import { weaponsAndTools } from './items/weaponsAndTools';
import { herbloreItems } from './items/herbloreItems';
import { runes } from './items/runes';
import { talismans } from './items/talismans';

const allItemsUnsorted: Item[] = [
    ...armor,
    ...foodAndPotions,
    ...misc,
    ...resources,
    ...weaponsAndTools,
    ...herbloreItems,
    ...runes,
    ...talismans,
];

// Sort the array alphabetically by item name for deterministic order if needed elsewhere
allItemsUnsorted.sort((a, b) => a.name.localeCompare(b.name));

// Create the final ITEMS record, keyed by item ID
export const ITEMS: Record<string, Item> = allItemsUnsorted.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
}, {} as Record<string, Item>);