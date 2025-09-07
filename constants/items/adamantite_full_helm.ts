
import { Item, EquipmentSlot, SkillName } from '../../types';

export const adamantiteFullHelm: Item = {
    id: 'adamantite_full_helm',
    name: 'Adamantite Full Helm',
    description: 'A sturdy adamantite helmet.',
    stackable: false,
    value: 1800,
    iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg',
    material: 'adamantite',
    equipment: {
        slot: EquipmentSlot.Head,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: -4,
        magicAttack: -5,
        stabDefence: 32,
        slashDefence: 30,
        crushDefence: 28,
        rangedDefence: 12,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 30 }],
    },
};
