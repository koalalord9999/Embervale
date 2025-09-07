
import { Item, EquipmentSlot, SkillName } from '../../types';

export const leatherBody: Item = {
    id: 'leather_body',
    name: 'Leather Body',
    description: 'Provides minor protection.',
    stackable: false,
    value: 30,
    iconUrl: 'https://api.iconify.design/game-icons:leather-vest.svg',
    equipment: {
        slot: EquipmentSlot.Body,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 5,
        slashDefence: 8,
        crushDefence: 7,
        rangedDefence: 2,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
    }
};