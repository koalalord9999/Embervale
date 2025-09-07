
import { Item, SkillName } from '../../types';

export const beer: Item = {
    id: 'beer',
    name: 'Beer',
    description: 'A frothy mug of ale. Heals a little, but temporarily lowers your Attack level.',
    stackable: false,
    value: 2,
    iconUrl: 'https://api.iconify.design/game-icons:beer-stein.svg',
    consumable: {
        healAmount: 1,
        // FIX: Renamed 'debuffs' to 'statModifiers' to match the Item type definition.
        statModifiers: [
            { skill: SkillName.Attack, value: -1, duration: 15000 }
        ]
    },
    material: 'copper',
};
