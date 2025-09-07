
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const willowLongbow: Item = {
    id: 'willow_longbow',
    name: 'Willow Longbow',
    description: 'A longbow made from willow.',
    stackable: false,
    value: 240,
    iconUrl: 'https://api.iconify.design/game-icons:pocket-bow.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 26,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Bow,
        speed: 5,
        requiredLevels: [{ skill: SkillName.Ranged, level: 25 }],
    }
};