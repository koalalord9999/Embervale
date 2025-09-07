

import { Item, EquipmentSlot, SkillName } from '../../types';

export const ironFullHelm: Item = {
    id: 'iron_full_helm',
    name: 'Iron Full Helm',
    description: 'A sturdy iron helmet.',
    stackable: false,
    value: 150,
    iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg',
    equipment: {
        slot: EquipmentSlot.Head,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -2,
        magicAttack: -3,
        stabDefence: 15,
        slashDefence: 14,
        crushDefence: 13,
        rangedDefence: 5,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 5 }],
    },
    material: 'iron',
};