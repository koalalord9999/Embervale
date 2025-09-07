

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const ironScimitar: Item = {
    id: 'iron_scimitar',
    name: 'Iron Scimitar',
    description: 'A sharp, curved iron blade.',
    stackable: false,
    value: 140,
    iconUrl: 'https://api.iconify.design/game-icons:curvy-knife.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 2,
        slashAttack: 9,
        crushAttack: -2,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 1,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 11,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Scimitar,
        speed: 3,
        requiredLevels: [{ skill: SkillName.Attack, level: 5 }],
    },
    material: 'iron',
};