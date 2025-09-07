

import { Item } from '../types';
import { allItemsUnsorted } from './items/collections';

// Assemble all items into a single array
const allItems: Item[] = [...allItemsUnsorted];

// Sort the array alphabetically by item name
allItems.sort((a, b) => a.name.localeCompare(b.name));

// Create the final ITEMS record, keyed by item ID
export const ITEMS: Record<string, Item> = allItems.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
}, {} as Record<string, Item>);
