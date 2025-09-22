import { MapFeature } from '../types';

export const MAP_FEATURES: MapFeature[] = [
    {
        id: 'silver_river',
        type: 'river',
        // This path is an estimation based on the user's image, starting near Silverhaven, moving west, then north.
        path: "M 620 1800 C 500 1750, 400 1600, 350 1450 S 300 1200, 320 1000",
        strokeColor: '#3b82f6', // Tailwind blue-500
        strokeWidth: 8,
    }
];
