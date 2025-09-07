
import { Item, SkillName } from '../../types';

export const spiketoadPotion: Item = {
    id: 'spiketoad_potion',
    name: 'Spiketoad Potion',
    description: 'A bubbling, green potion that makes your skin feel tough and prickly. Melee attackers will be damaged when they hit you.',
    stackable: false,
    value: 1200,
    iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg',
    material: 'potion',
    consumable: {
        buffs: [{ type: 'recoil', value: 10, duration: 60000 }]
    },
    potionEffect: { description: 'Reflects 10% of melee damage taken back to the attacker for 1 minute.' }
};
