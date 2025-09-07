
import { Item } from '../../types';

export const cookedPike: Item = {
    id: 'cooked_pike',
    name: 'Cooked Pike',
    description: 'A well-cooked pike. Heals a good amount of health.',
    stackable: false,
    value: 48,
    iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg',
    consumable: { healAmount: 12 },
    material: 'cooked-fish',
};
