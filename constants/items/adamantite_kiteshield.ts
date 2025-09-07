
import { Item, EquipmentSlot, SkillName } from '../../types';

export const adamantiteKiteshield: Item = {
    id: 'adamantite_kiteshield',
    name: 'Adamantite Kiteshield',
    description: 'A large, sturdy adamantite shield.',
    stackable: false,
    value: 2500,
    iconUrl: 'https://api.iconify.design/game-icons:shield.svg',
    material: 'adamantite',
    equipment: {
        slot: EquipmentSlot.Shield,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: -12,
        stabDefence: 42,
        slashDefence: 40,
        crushDefence: 38,
        rangedDefence: 20,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 30 }],
    },
};
