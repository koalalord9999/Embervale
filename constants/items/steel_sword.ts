

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const steelSword: Item = {
    id: 'steel_sword',
    name: 'Steel Sword',
    description: 'A sword made of high quality steel.',
    stackable: false,
    value: 300,
    iconUrl: 'https://api.iconify.design/game-icons:broadsword.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 10,
        slashAttack: 14,
        crushAttack: -2,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 3,
        crushDefence: 2,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 13,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Sword,
        speed: 3,
        requiredLevels: [{ skill: SkillName.Attack, level: 10 }],
    },
    material: 'steel',
};