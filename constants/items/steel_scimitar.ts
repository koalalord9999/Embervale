

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const steelScimitar: Item = {
    id: 'steel_scimitar',
    name: 'Steel Scimitar',
    description: 'A sharp, curved steel blade.',
    stackable: false,
    value: 340,
    iconUrl: 'https://api.iconify.design/game-icons:curvy-knife.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 3,
        slashAttack: 13,
        crushAttack: -2,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 1,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 16,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Scimitar,
        speed: 3,
        requiredLevels: [{ skill: SkillName.Attack, level: 10 }],
    },
    material: 'steel',
};