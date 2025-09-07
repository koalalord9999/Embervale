

import { Item, EquipmentSlot, WeaponType } from '../../types';

export const knife: Item = {
    id: 'knife',
    name: 'Knife',
    description: 'A simple knife. Useful for fletching. Can be used as a last-resort weapon.',
    stackable: false,
    value: 5,
    iconUrl: 'https://api.iconify.design/game-icons:bone-knife.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 1,
        slashAttack: 1,
        crushAttack: -4,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 1,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Dagger,
        speed: 2
    }
};