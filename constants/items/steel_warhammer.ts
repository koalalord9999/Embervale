

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const steelWarhammer: Item = {
    id: 'steel_warhammer',
    name: 'Steel Warhammer',
    description: 'A formidable steel warhammer. Slow, but crushes armor effectively.',
    stackable: false,
    value: 420,
    iconUrl: 'https://api.iconify.design/game-icons:warhammer.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        // Attack bonuses
        stabAttack: -4,
        slashAttack: -4,
        crushAttack: 35,
        magicAttack: 0,
        rangedAttack: 0,
        // Defence bonuses
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        magicDefence: 0,
        rangedDefence: 0,
        // Other bonuses
        strengthBonus: 40,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Warhammer,
        speed: 6,
        requiredLevels: [{ skill: SkillName.Strength, level: 10 }],
    },
    material: 'steel',
};