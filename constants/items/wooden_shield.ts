
import { Item, EquipmentSlot, SkillName } from '../../types';

export const woodenShield: Item = {
    id: 'wooden_shield',
    name: 'Wooden Shield',
    description: 'A simple wooden shield.',
    stackable: false,
    value: 15,
    iconUrl: 'https://api.iconify.design/game-icons:round-shield.svg',
    equipment: {
        slot: EquipmentSlot.Shield,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 4,
        slashDefence: 5,
        crushDefence: 3,
        rangedDefence: 2,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
    },
    material: 'iron-ore',
};