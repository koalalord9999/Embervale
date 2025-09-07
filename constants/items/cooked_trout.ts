
import { Item } from '../../types';

export const cookedTrout: Item = {
    id: 'cooked_trout',
    name: 'Cooked Trout',
    description: 'A nicely cooked trout. Heals a moderate amount of health.',
    stackable: false,
    value: 28,
    iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg',
    consumable: { healAmount: 9 },
    material: 'cooked-fish',
};
