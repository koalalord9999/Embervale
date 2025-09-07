
import { Item, EquipmentSlot } from '../../types';

export const adamantiteArrow: Item = {
    id: 'adamantite_arrow',
    name: 'Adamantite Arrow',
    description: 'A sharp adamantite-tipped arrow.',
    stackable: true,
    value: 40,
    iconUrl: 'https://api.iconify.design/game-icons:broadhead-arrow.svg',
    equipment: {
        slot: EquipmentSlot.Ammo,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 31,
        magicDamageBonus: 0,
    },
    material: 'adamantite',
};
