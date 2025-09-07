
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const willowShortbow: Item = {
    id: 'willow_shortbow',
    name: 'Willow Shortbow',
    description: 'A shortbow made from willow.',
    stackable: false,
    value: 180,
    iconUrl: 'https://api.iconify.design/game-icons:high-shot.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 20,
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
        speed: 4,
        requiredLevels: [{ skill: SkillName.Ranged, level: 20 }],
    }
};