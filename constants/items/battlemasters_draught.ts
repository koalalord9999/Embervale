
import { Item, SkillName } from '../../types';

export const battlemastersDraught: Item = {
    id: 'battlemasters_draught',
    name: "Battlemaster's Draught",
    description: 'A potent, shimmering elixir that grants immense power, temporarily increasing all damage dealt.',
    stackable: false,
    value: 2000,
    iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg',
    material: 'potion',
    consumable: {
        buffs: [{ type: 'flat_damage', value: 3, duration: 60000 }]
    },
    potionEffect: { description: 'Increases all damage dealt by 3 for 1 minute.' }
};
