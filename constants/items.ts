// Obsolete individual files have been removed.

import { Item } from '../types';
import { armor } from './armor';
import { foodAndPotions } from './foodAndPotions';
import { misc } from './misc';
import { resources } from './resources';
import { weaponsAndTools } from './weaponsAndTools';
import { herbloreItems } from './herbloreItems';

const allItemsUnsorted: Item[] = [
    ...armor,
    ...foodAndPotions,
    ...misc,
    ...resources,
    ...weaponsAndTools,
    ...herbloreItems,
];

// Sort the array alphabetically by item name for deterministic order if needed elsewhere
allItemsUnsorted.sort((a, b) => a.name.localeCompare(b.name));

// Create the final ITEMS record, keyed by item ID
export const ITEMS: Record<string, Item> = allItemsUnsorted.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
}, {} as Record<string, Item>);
