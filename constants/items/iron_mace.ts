

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const ironMace: Item = {
    id: 'iron_mace',
    name: 'Iron Mace',
    description: 'A heavy iron mace.',
    stackable: false,
    value: 95,
    iconUrl: 'https://api.iconify.design/game-icons:flanged-mace.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 4,
        slashAttack: -2,
        crushAttack: 10,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 8,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Mace,
        speed: 4,
        requiredLevels: [{ skill: SkillName.Attack, level: 5 }],
    },
    material: 'iron',
};