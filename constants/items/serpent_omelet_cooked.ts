
import { Item } from '../../types';

export const serpentOmeletCooked: Item = {
    id: 'serpent_omelet_cooked',
    name: 'Serpent Omelet',
    description: 'A surprisingly delicious and hearty omelet. Heals a large amount of health.',
    stackable: false,
    value: 250,
    iconUrl: 'https://api.iconify.design/game-icons:omelette.svg',
    consumable: { healAmount: 22 },
    material: 'cooked-meat',
};