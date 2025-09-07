
import { Item, EquipmentSlot, SkillName } from '../../types';

export const adamantitePlatebody: Item = {
    id: 'adamantite_platebody',
    name: 'Adamantite Platebody',
    description: 'Provides excellent protection for the torso.',
    stackable: false,
    value: 4750,
    iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg',
    material: 'adamantite',
    equipment: {
        slot: EquipmentSlot.Body,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -20,
        magicAttack: -25,
        stabDefence: 65,
        slashDefence: 62,
        crushDefence: 58,
        rangedDefence: 22,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 30 }],
    },
};
