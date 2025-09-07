import { Item } from '../../types';

export const cookedEel: Item = {
    id: 'cooked_eel',
    name: 'Cooked Eel',
    description: 'A delicacy that heals a good amount of health.',
    stackable: false,
    value: 80,
    iconUrl: 'https://api.iconify.design/game-icons:eel.svg',
    consumable: { healAmount: 14 },
    material: 'cooked-fish',
};