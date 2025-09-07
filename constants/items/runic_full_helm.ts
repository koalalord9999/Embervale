
import { Item, EquipmentSlot, SkillName } from '../../types';

export const runicFullHelm: Item = {
    id: 'runic_full_helm',
    name: 'Runic Full Helm',
    description: 'A sturdy runic helmet.',
    stackable: false,
    value: 3600,
    iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg',
    material: 'runic',
    equipment: {
        slot: EquipmentSlot.Head,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -5,
        magicAttack: -6,
        stabDefence: 42,
        slashDefence: 40,
        crushDefence: 38,
        rangedDefence: 15,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 40 }],
    },
};
