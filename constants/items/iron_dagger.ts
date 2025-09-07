

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const ironDagger: Item = {
    id: 'iron_dagger',
    name: 'Iron Dagger',
    description: 'A sharp iron dagger.',
    stackable: false,
    value: 80,
    iconUrl: 'https://api.iconify.design/game-icons:stiletto.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 7,
        slashAttack: 4,
        crushAttack: -4,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 6,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Dagger,
        speed: 2,
        requiredLevels: [{ skill: SkillName.Attack, level: 5 }],
    },
    material: 'iron',
};