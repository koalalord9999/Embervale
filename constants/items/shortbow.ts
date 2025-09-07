
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const shortbow: Item = {
    id: 'shortbow',
    name: 'Shortbow',
    description: 'A basic wooden shortbow.',
    stackable: false,
    value: 50,
    iconUrl: 'https://api.iconify.design/game-icons:high-shot.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 8,
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
        requiredLevels: [{ skill: SkillName.Ranged, level: 1 }],
    }
};