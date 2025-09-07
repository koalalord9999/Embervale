
import { Item, EquipmentSlot, SkillName } from '../../types';

export const bronzePlatelegs: Item = {
    id: 'bronze_platelegs',
    name: 'Bronze Platelegs',
    description: 'Sturdy platelegs made from bronze.',
    stackable: false,
    value: 40,
    iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg',
    equipment: {
        slot: EquipmentSlot.Legs,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: -5,
        stabDefence: 10,
        slashDefence: 9,
        crushDefence: 8,
        rangedDefence: 3,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
    },
    material: 'bronze',
};