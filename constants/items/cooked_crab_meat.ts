
import { Item } from '../../types';

export const cookedCrabMeat: Item = {
    id: 'cooked_crab_meat',
    name: 'Cooked Crab Meat',
    description: 'Tender crab meat. Heals a decent amount of health.',
    stackable: false,
    value: 15,
    iconUrl: 'https://api.iconify.design/game-icons:crab-claw.svg',
    consumable: { healAmount: 7 },
    material: 'cooked-fish',
};
