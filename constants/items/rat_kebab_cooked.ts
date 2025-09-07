
import { Item } from '../../types';

export const ratKebabCooked: Item = {
    id: 'rat_kebab_cooked',
    name: 'Rat Kebab',
    description: 'Surprisingly edible. Heals a small amount of health.',
    stackable: false,
    value: 4,
    iconUrl: 'https://api.iconify.design/game-icons:kebab-spit.svg',
    consumable: { healAmount: 3 },
    material: 'cooked-meat',
};