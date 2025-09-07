
import { Item, EquipmentSlot, WeaponType } from '../../types';

export const rustyIronSword: Item = {
    id: 'rusty_iron_sword',
    name: 'Rusty Iron Sword',
    description: 'An old, corroded sword. It feels strangely balanced despite the rust.',
    stackable: false,
    value: 1,
    iconUrl: 'https://api.iconify.design/game-icons:broken-sword.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 1,
        slashAttack: 1,
        crushAttack: -2,
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
        weaponType: WeaponType.Sword,
        speed: 3
    },
    material: 'iron',
};