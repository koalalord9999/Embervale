
import { Item } from '../../types';

export const cookedHerring: Item = {
    id: 'cooked_herring',
    name: 'Cooked Herring',
    description: 'A cooked herring. Heals some health.',
    stackable: false,
    value: 12,
    iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg',
    consumable: { healAmount: 6 },
    material: 'cooked-fish',
};
