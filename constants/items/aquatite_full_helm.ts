

import { Item, EquipmentSlot, SkillName } from '../../types';

export const aquatiteFullHelm: Item = {
    id: 'aquatite_full_helm',
    name: 'Aquatite Full Helm',
    description: 'A helmet forged from Aquatite. Provides excellent protection, especially against projectiles.',
    stackable: false,
    value: 60000,
    iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg',
    equipment: {
        slot: EquipmentSlot.Head,
        // Attack bonuses
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        magicAttack: -10,
        rangedAttack: -5,
        // Defence bonuses
        stabDefence: 40,
        slashDefence: 42,
        crushDefence: 38,
        magicDefence: -5,
        rangedDefence: 45,
        // Other bonuses
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 60 }],
    },
    material: 'aquatite',
};