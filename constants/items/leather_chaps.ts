
import { Item, EquipmentSlot, SkillName } from '../../types';

export const leatherChaps: Item = {
    id: 'leather_chaps',
    name: 'Leather Chaps',
    description: 'Protective leather leg coverings.',
    stackable: false,
    value: 25,
    iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg',
    equipment: {
        slot: EquipmentSlot.Legs,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 2,
        slashDefence: 4,
        crushDefence: 3,
        rangedDefence: 1,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
    }
};