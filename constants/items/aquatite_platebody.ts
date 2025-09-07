

import { Item, EquipmentSlot, SkillName } from '../../types';

export const aquatitePlatebody: Item = {
    id: 'aquatite_platebody',
    name: 'Aquatite Platebody',
    description: 'Provides powerful protection for the torso, especially against ranged attacks.',
    stackable: false,
    value: 150000,
    iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg',
    equipment: {
        slot: EquipmentSlot.Body,
        // Attack bonuses
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        magicAttack: -30,
        rangedAttack: -15,
        // Defence bonuses
        stabDefence: 95,
        slashDefence: 92,
        crushDefence: 88,
        magicDefence: -10,
        rangedDefence: 100,
        // Other bonuses
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 60 }],
    },
    material: 'aquatite',
};