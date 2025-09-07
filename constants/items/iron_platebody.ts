

import { Item, EquipmentSlot, SkillName } from '../../types';

export const ironPlatebody: Item = {
    id: 'iron_platebody',
    name: 'Iron Platebody',
    description: 'Provides good protection for the torso.',
    stackable: false,
    value: 400,
    iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg',
    equipment: {
        slot: EquipmentSlot.Body,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -10,
        magicAttack: -15,
        stabDefence: 35,
        slashDefence: 33,
        crushDefence: 30,
        rangedDefence: 10,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 5 }],
    },
    material: 'iron',
};