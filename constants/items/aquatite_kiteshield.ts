

import { Item, EquipmentSlot, SkillName } from '../../types';

export const aquatiteKiteshield: Item = {
    id: 'aquatite_kiteshield',
    name: 'Aquatite Kiteshield',
    description: 'A large, sturdy shield made from Aquatite.',
    stackable: false,
    value: 90000,
    iconUrl: 'https://api.iconify.design/game-icons:shield.svg',
    equipment: {
        slot: EquipmentSlot.Shield,
        // Attack bonuses
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        magicAttack: -12,
        rangedAttack: -8,
        // Defence bonuses
        stabDefence: 60,
        slashDefence: 62,
        crushDefence: 58,
        magicDefence: -4,
        rangedDefence: 65,
        // Other bonuses
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 60 }],
    },
    material: 'aquatite',
};