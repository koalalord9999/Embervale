
import { Item } from '../../types';

export const bones: Item = {
    id: 'bones',
    name: 'Bones',
    description: 'A set of ordinary bones. Can be buried for Prayer experience.',
    stackable: false,
    value: 2,
    iconUrl: 'https://api.iconify.design/game-icons:crossed-bones.svg',
    buryable: { prayerXp: 5 }
};
