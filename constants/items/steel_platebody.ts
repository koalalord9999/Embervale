

import { Item, EquipmentSlot, SkillName } from '../../types';

export const steelPlatebody: Item = {
    id: 'steel_platebody',
    name: 'Steel Platebody',
    description: 'Provides excellent protection for the torso.',
    stackable: false,
    value: 950,
    iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg',
    equipment: {
        slot: EquipmentSlot.Body,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -15,
        magicAttack: -20,
        stabDefence: 50,
        slashDefence: 48,
        crushDefence: 44,
        rangedDefence: 15,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 10 }],
    },
    material: 'steel',
};