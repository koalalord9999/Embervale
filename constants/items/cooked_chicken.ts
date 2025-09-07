import { Item } from '../../types';

export const cookedChicken: Item = {
    id: 'cooked_chicken',
    name: 'Cooked Chicken',
    description: 'A tasty meal. Heals health.',
    stackable: false,
    value: 8,
    iconUrl: 'https://api.iconify.design/game-icons:chicken-leg.svg',
    consumable: { healAmount: 4 },
    material: 'cooked-meat',
};