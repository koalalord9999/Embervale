
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const bronzeWarhammer: Item = {
    id: 'bronze_warhammer',
    name: 'Bronze Warhammer',
    description: 'A heavy bronze warhammer. Slow, but hits hard.',
    stackable: false,
    value: 26,
    iconUrl: 'https://api.iconify.design/game-icons:warhammer.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        // Attack bonuses
        stabAttack: -4,
        slashAttack: -4,
        crushAttack: 12,
        magicAttack: 0,
        rangedAttack: 0,
        // Defence bonuses
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        magicDefence: 0,
        rangedDefence: 0,
        // Other bonuses
        strengthBonus: 14,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Warhammer,
        speed: 6,
        requiredLevels: [{ skill: SkillName.Strength, level: 1 }],
    },
    material: 'bronze',
};