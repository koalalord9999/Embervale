
import { Item, EquipmentSlot, SkillName } from '../../types';

export const runicPlatelegs: Item = {
    id: 'runic_platelegs',
    name: 'Runic Platelegs',
    description: 'Sturdy platelegs made from runic metal.',
    stackable: false,
    value: 5400,
    iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg',
    material: 'runic',
    equipment: {
        slot: EquipmentSlot.Legs,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -12,
        magicAttack: -18,
        stabDefence: 60,
        slashDefence: 58,
        crushDefence: 55,
        rangedDefence: 22,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 40 }],
    },
};
