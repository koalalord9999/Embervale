
import { Item } from '../../types';

export const cookedSardine: Item = {
    id: 'cooked_sardine',
    name: 'Cooked Sardine',
    description: 'A cooked sardine. Heals a small amount of health.',
    stackable: false,
    value: 7,
    iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg',
    consumable: { healAmount: 4 },
    material: 'cooked-fish',
};
