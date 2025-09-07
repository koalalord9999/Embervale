

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const ironWarhammer: Item = {
    id: 'iron_warhammer',
    name: 'Iron Warhammer',
    description: 'A heavy iron warhammer. Slow, but hits very hard.',
    stackable: false,
    value: 180,
    iconUrl: 'https://api.iconify.design/game-icons:warhammer.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        // Attack bonuses
        stabAttack: -4,
        slashAttack: -4,
        crushAttack: 22,
        magicAttack: 0,
        rangedAttack: 0,
        // Defence bonuses
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        magicDefence: 0,
        rangedDefence: 0,
        // Other bonuses
        strengthBonus: 28,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Warhammer,
        speed: 6,
        requiredLevels: [{ skill: SkillName.Strength, level: 5 }],
    },
    material: 'iron',
};