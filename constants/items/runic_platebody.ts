
import { Item, EquipmentSlot, SkillName } from '../../types';

export const runicPlatebody: Item = {
    id: 'runic_platebody',
    name: 'Runic Platebody',
    description: 'Provides excellent protection for the torso.',
    stackable: false,
    value: 9500,
    iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg',
    material: 'runic',
    equipment: {
        slot: EquipmentSlot.Body,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -25,
        magicAttack: -30,
        stabDefence: 80,
        slashDefence: 78,
        crushDefence: 72,
        rangedDefence: 28,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 40 }],
    },
};
