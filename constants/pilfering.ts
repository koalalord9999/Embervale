import { THIEVING_CONTAINER_TARGETS } from './loot/thievingTables';

export const HOUSE_TIERS = Object.entries(THIEVING_CONTAINER_TARGETS)
    .filter(([key]) => key.includes('_house_drawer_'))
    .map(([key, value]) => ({
        id: key.replace('_drawer_', '_'),
        tierId: key,
        level: value.level,
    }));

export const PILFERING_DURATION = 4 * 60 * 1000; // 4 minutes
