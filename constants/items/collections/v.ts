
import { Item } from '../../../types';

export const items: Item[] = [
    { id: 'vial', name: 'Vial', description: 'An empty glass vial.', stackable: true, value: 2, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg' },
    { id: 'vial_of_water', name: 'Vial of Water', description: 'A vial filled with water.', stackable: true, value: 2, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion' },
];
