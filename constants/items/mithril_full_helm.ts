
import { Item, EquipmentSlot, SkillName } from '../../types';

export const mithrilFullHelm: Item = {
    id: 'mithril_full_helm',
    name: 'Mithril Full Helm',
    description: 'A sturdy mithril helmet.',
    stackable: false,
    value: 900,
    iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg',
    material: 'mithril',
    equipment: {
        slot: EquipmentSlot.Head,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -3,
        magicAttack: -4,
        stabDefence: 26,
        slashDefence: 25,
        crushDefence: 23,
        rangedDefence: 10,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 20 }],
    },
};
