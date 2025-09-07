import { Item } from '../../types';

export const cookedShrimp: Item = {
    id: 'cooked_shrimp',
    name: 'Cooked Shrimp',
    description: 'A nicely cooked shrimp. Heals a small amount of health.',
    stackable: false,
    value: 5,
    iconUrl: 'https://api.iconify.design/game-icons:shrimp.svg',
    consumable: { healAmount: 3 },
    material: 'cooked-fish',
};