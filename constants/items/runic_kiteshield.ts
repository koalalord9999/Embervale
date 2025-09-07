
import { Item, EquipmentSlot, SkillName } from '../../types';

export const runicKiteshield: Item = {
    id: 'runic_kiteshield',
    name: 'Runic Kiteshield',
    description: 'A large, sturdy runic shield.',
    stackable: false,
    value: 5000,
    iconUrl: 'https://api.iconify.design/game-icons:shield.svg',
    material: 'runic',
    equipment: {
        slot: EquipmentSlot.Shield,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: -15,
        stabDefence: 52,
        slashDefence: 50,
        crushDefence: 48,
        rangedDefence: 25,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 40 }],
    },
};
