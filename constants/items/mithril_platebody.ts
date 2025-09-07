
import { Item, EquipmentSlot, SkillName } from '../../types';

export const mithrilPlatebody: Item = {
    id: 'mithril_platebody',
    name: 'Mithril Platebody',
    description: 'Provides excellent protection for the torso.',
    stackable: false,
    value: 2375,
    iconUrl: 'https://api.iconify.design/game-icons:breastplate.svg',
    material: 'mithril',
    equipment: {
        slot: EquipmentSlot.Body,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -15,
        magicAttack: -20,
        stabDefence: 58,
        slashDefence: 55,
        crushDefence: 50,
        rangedDefence: 18,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 20 }],
    },
};
