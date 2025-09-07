
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const yewShortbow: Item = {
    id: 'yew_shortbow',
    name: 'Yew Shortbow',
    description: 'A shortbow made from yew.',
    stackable: false,
    value: 450,
    iconUrl: 'https://api.iconify.design/game-icons:high-shot.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 42,
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
        requiredLevels: [{ skill: SkillName.Ranged, level: 40 }],
    }
};