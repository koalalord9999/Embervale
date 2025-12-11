// This barrel file combines all item data from the /items directory.

import { Item } from '../types';
import { armor } from './items/armor';
import { armor_two } from './items/armor_two';
import { foodAndPotions } from './items/foodAndPotions';
import { misc } from './items/misc';
import { misc_two } from './items/misc_two';
import { resources } from './items/resources';
import { weaponsAndTools } from './items/weaponsAndTools';
import { weaponsAndTools_two } from './items/weaponsAndTools_two';
import { herbloreItems } from './items/herbloreItems';
import { runes } from './items/runes';
import { talismans } from './items/talismans';
import { slayerGear } from './items/slayerGear';

const allItemsUnsorted: Item[] = [
    ...armor,
    ...armor_two,
    ...foodAndPotions,
    ...misc,
    ...misc_two,
    ...resources,
    ...weaponsAndTools,
    ...weaponsAndTools_two,
    ...herbloreItems,
    ...runes,
    ...talismans,
    ...slayerGear,
];

// Sort the array alphabetically by item name for deterministic order if needed elsewhere
allItemsUnsorted.sort((a, b) => a.name.localeCompare(b.name));

// Create the final ITEMS record, keyed by item ID
export const ITEMS: Record<string, Item> = allItemsUnsorted.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
}, {} as Record<string, Item>);
