
import { Item, EquipmentSlot, SkillName } from '../../types';

export const adamantitePlatelegs: Item = {
    id: 'adamantite_platelegs',
    name: 'Adamantite Platelegs',
    description: 'Sturdy platelegs made from adamantite.',
    stackable: false,
    value: 2700,
    iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg',
    material: 'adamantite',
    equipment: {
        slot: EquipmentSlot.Legs,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -10,
        magicAttack: -15,
        stabDefence: 50,
        slashDefence: 48,
        crushDefence: 44,
        rangedDefence: 18,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 30 }],
    },
};
