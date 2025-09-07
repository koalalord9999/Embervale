

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const steelMace: Item = {
    id: 'steel_mace',
    name: 'Steel Mace',
    description: 'A heavy steel mace.',
    stackable: false,
    value: 230,
    iconUrl: 'https://api.iconify.design/game-icons:flanged-mace.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 6,
        slashAttack: -2,
        crushAttack: 15,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 12,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Mace,
        speed: 4,
        requiredLevels: [{ skill: SkillName.Attack, level: 10 }],
    },
    material: 'steel',
};