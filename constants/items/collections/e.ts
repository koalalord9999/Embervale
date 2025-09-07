
import { Item, SkillName } from '../../../types';
import { eggs } from '../eggs';
import { emerald } from '../emerald';
import { enchantedBark } from '../enchanted_bark';

export const items: Item[] = [
    eggs,
    emerald,
    enchantedBark,
    { id: 'evasion_potion', name: 'Evasion Potion', description: 'Temporarily boosts your Evasion against all attack styles.', stackable: false, value: 120, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { buffs: [{ type: 'evasion_boost', value: 10, duration: 60000, style: 'all' }] }, potionEffect: { description: 'Boosts Evasion by 10% for 1 minute.' } },
    { id: 'extended_antifire', name: 'Extended Antifire', description: 'Provides a long-lasting resistance to dragon fire.', stackable: false, value: 800, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', potionEffect: { description: 'Provides long-lasting resistance to dragon fire.' } },
];