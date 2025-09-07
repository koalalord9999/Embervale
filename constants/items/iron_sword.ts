

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const ironSword: Item = {
    id: 'iron_sword',
    name: 'Iron Sword',
    description: 'A well-balanced sword, restored from a rusty relic.',
    stackable: false,
    value: 150,
    iconUrl: 'https://api.iconify.design/game-icons:broadsword.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 6,
        slashAttack: 8,
        crushAttack: -2,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 2,
        crushDefence: 1,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 7,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Sword,
        speed: 3,
        requiredLevels: [{ skill: SkillName.Attack, level: 5 }],
    },
    material: 'iron',
};