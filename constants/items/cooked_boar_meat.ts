
import { Item } from '../../types';

export const cookedBoarMeat: Item = {
    id: 'cooked_boar_meat',
    name: 'Cooked Boar Meat',
    description: 'A hearty slab of cooked meat that heals a moderate amount of health.',
    stackable: false,
    value: 15,
    iconUrl: 'https://api.iconify.design/game-icons:steak.svg',
    consumable: { healAmount: 8 },
    material: 'cooked-meat',
};