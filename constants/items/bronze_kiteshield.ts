
import { Item, EquipmentSlot, SkillName } from '../../types';

export const bronzeKiteshield: Item = {
    id: 'bronze_kiteshield',
    name: 'Bronze Kiteshield',
    description: 'A large, sturdy shield.',
    stackable: false,
    value: 35,
    iconUrl: 'https://api.iconify.design/game-icons:shield.svg',
    equipment: {
        slot: EquipmentSlot.Shield,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: -5,
        stabDefence: 12,
        slashDefence: 11,
        crushDefence: 10,
        rangedDefence: 5,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
    },
    material: 'bronze',
};