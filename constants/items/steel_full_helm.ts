

import { Item, EquipmentSlot, SkillName } from '../../types';

export const steelFullHelm: Item = {
    id: 'steel_full_helm',
    name: 'Steel Full Helm',
    description: 'A sturdy steel helmet.',
    stackable: false,
    value: 360,
    iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg',
    equipment: {
        slot: EquipmentSlot.Head,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -3,
        magicAttack: -4,
        stabDefence: 22,
        slashDefence: 21,
        crushDefence: 19,
        rangedDefence: 8,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 10 }],
    },
    material: 'steel',
};