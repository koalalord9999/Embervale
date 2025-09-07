

import { Item, EquipmentSlot, SkillName } from '../../types';

export const ironKiteshield: Item = {
    id: 'iron_kiteshield',
    name: 'Iron Kiteshield',
    description: 'A large, sturdy iron shield.',
    stackable: false,
    value: 210,
    iconUrl: 'https://api.iconify.design/game-icons:shield.svg',
    equipment: {
        slot: EquipmentSlot.Shield,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: -8,
        stabDefence: 20,
        slashDefence: 18,
        crushDefence: 16,
        rangedDefence: 10,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 5 }],
    },
    material: 'iron',
};