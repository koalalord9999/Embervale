import { Item } from '../../types';

export const cookedBeef: Item = {
    id: 'cooked_beef',
    name: 'Cooked Beef',
    description: 'A hearty meal. Heals some health.',
    stackable: false,
    value: 12,
    iconUrl: 'https://api.iconify.design/game-icons:steak.svg',
    consumable: { healAmount: 5 },
    material: 'cooked-meat',
};