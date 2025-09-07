

import { Item, EquipmentSlot, SkillName } from '../../types';

export const steelPlatelegs: Item = {
    id: 'steel_platelegs',
    name: 'Steel Platelegs',
    description: 'Sturdy platelegs made from steel.',
    stackable: false,
    value: 540,
    iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg',
    equipment: {
        slot: EquipmentSlot.Legs,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -7,
        magicAttack: -10,
        stabDefence: 38,
        slashDefence: 36,
        crushDefence: 32,
        rangedDefence: 12,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 10 }],
    },
    material: 'steel',
};