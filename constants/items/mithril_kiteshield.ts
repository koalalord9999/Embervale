
import { Item, EquipmentSlot, SkillName } from '../../types';

export const mithrilKiteshield: Item = {
    id: 'mithril_kiteshield',
    name: 'Mithril Kiteshield',
    description: 'A large, sturdy mithril shield.',
    stackable: false,
    value: 1250,
    iconUrl: 'https://api.iconify.design/game-icons:shield.svg',
    material: 'mithril',
    equipment: {
        slot: EquipmentSlot.Shield,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: -10,
        stabDefence: 35,
        slashDefence: 33,
        crushDefence: 30,
        rangedDefence: 18,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 20 }],
    },
};
