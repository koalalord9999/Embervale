
import { Item } from '../../types';

export const bigBones: Item = {
    id: 'big_bones',
    name: 'Big Bones',
    description: 'Larger bones from a tougher creature. Can be buried for Prayer experience.',
    stackable: false,
    value: 10,
    iconUrl: 'https://api.iconify.design/game-icons:crossed-bones.svg',
    buryable: { prayerXp: 15 }
};
