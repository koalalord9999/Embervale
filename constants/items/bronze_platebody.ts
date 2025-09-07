
import { Item, EquipmentSlot, SkillName } from '../../types';

export const bronzePlatebody: Item = {
    id: 'bronze_platebody',
    name: 'Bronze Platebody',
    description: 'Provides excellent protection for the torso.',
    stackable: false,
    value: 60,
    iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg',
    equipment: {
        slot: EquipmentSlot.Body,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: -10,
        stabDefence: 20,
        slashDefence: 18,
        crushDefence: 15,
        rangedDefence: 5,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
    },
    material: 'bronze',
};