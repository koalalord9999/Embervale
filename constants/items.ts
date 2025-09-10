// Obsolete individual files have been removed.

import { Item } from '../types';
import { armor } from './armor';
import { foodAndPotions } from './items/foodAndPotions';
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

// Add Tinderbox
allItemsUnsorted.push({
    id: 'tinderbox',
    name: 'Tinderbox',
    description: 'Used to light fires.',
    stackable: false,
    value: 1,
    iconUrl: 'https://api.iconify.design/game-icons:flint-and-steel.svg',
});

// Sort the array alphabetically by item name for deterministic order if needed elsewhere
allItemsUnsorted.sort((a, b) => a.name.localeCompare(b.name));

// Create the final ITEMS record, keyed by item ID
export const ITEMS: Record<string, Item> = allItemsUnsorted.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
}, {} as Record<string, Item>);