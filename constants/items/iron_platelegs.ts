

import { Item, EquipmentSlot, SkillName } from '../../types';

export const ironPlatelegs: Item = {
    id: 'iron_platelegs',
    name: 'Iron Platelegs',
    description: 'Sturdy platelegs made from iron.',
    stackable: false,
    value: 220,
    iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg',
    equipment: {
        slot: EquipmentSlot.Legs,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -5,
        magicAttack: -7,
        stabDefence: 25,
        slashDefence: 23,
        crushDefence: 20,
        rangedDefence: 7,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 5 }],
    },
    material: 'iron',
};