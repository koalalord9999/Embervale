
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const feywoodLongbow: Item = {
    id: 'feywood_longbow',
    name: 'Feywood Longbow',
    description: 'A magical longbow made from feywood.',
    stackable: false,
    value: 360,
    iconUrl: 'https://api.iconify.design/game-icons:pocket-bow.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 36,
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
        requiredLevels: [{ skill: SkillName.Ranged, level: 35 }],
    }
};