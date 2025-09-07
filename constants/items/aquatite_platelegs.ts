

import { Item, EquipmentSlot, SkillName } from '../../types';

export const aquatitePlatelegs: Item = {
    id: 'aquatite_platelegs',
    name: 'Aquatite Platelegs',
    description: 'Sturdy platelegs made from Aquatite. Excellent against arrows.',
    stackable: false,
    value: 95000,
    iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg',
    equipment: {
        slot: EquipmentSlot.Legs,
        // Attack bonuses
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        magicAttack: -21,
        rangedAttack: -7,
        // Defence bonuses
        stabDefence: 65,
        slashDefence: 62,
        crushDefence: 60,
        magicDefence: -6,
        rangedDefence: 68,
        // Other bonuses
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 60 }],
    },
    material: 'aquatite',
};