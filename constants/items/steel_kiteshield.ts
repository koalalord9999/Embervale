

import { Item, EquipmentSlot, SkillName } from '../../types';

export const steelKiteshield: Item = {
    id: 'steel_kiteshield',
    name: 'Steel Kiteshield',
    description: 'A large, sturdy steel shield.',
    stackable: false,
    value: 500,
    iconUrl: 'https://api.iconify.design/game-icons:shield.svg',
    equipment: {
        slot: EquipmentSlot.Shield,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: -10,
        stabDefence: 30,
        slashDefence: 28,
        crushDefence: 25,
        rangedDefence: 15,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 10 }],
    },
    material: 'steel',
};