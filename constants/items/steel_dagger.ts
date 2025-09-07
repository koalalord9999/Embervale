

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const steelDagger: Item = {
    id: 'steel_dagger',
    name: 'Steel Dagger',
    description: 'A sharp steel dagger.',
    stackable: false,
    value: 200,
    iconUrl: 'https://api.iconify.design/game-icons:stiletto.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 10,
        slashAttack: 6,
        crushAttack: -4,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 9,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Dagger,
        speed: 2,
        requiredLevels: [{ skill: SkillName.Attack, level: 10 }],
    },
    material: 'steel',
};