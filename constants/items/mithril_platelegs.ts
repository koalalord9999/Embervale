
import { Item, EquipmentSlot, SkillName } from '../../types';

export const mithrilPlatelegs: Item = {
    id: 'mithril_platelegs',
    name: 'Mithril Platelegs',
    description: 'Sturdy platelegs made from mithril.',
    stackable: false,
    value: 1350,
    iconUrl: 'https://api.iconify.design/game-icons:armored-pants.svg',
    material: 'mithril',
    equipment: {
        slot: EquipmentSlot.Legs,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -8,
        magicAttack: -12,
        stabDefence: 42,
        slashDefence: 40,
        crushDefence: 36,
        rangedDefence: 15,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 20 }],
    },
};
