
import { Item, EquipmentSlot, SkillName } from '../../types';

export const bronzeFullHelm: Item = {
    id: 'bronze_full_helm',
    name: 'Bronze Full Helm',
    description: 'A helmet that covers the entire head.',
    stackable: false,
    value: 25,
    iconUrl: 'https://api.iconify.design/game-icons:crested-helmet.svg',
    equipment: {
        slot: EquipmentSlot.Head,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: -3,
        stabDefence: 9,
        slashDefence: 8,
        crushDefence: 7,
        rangedDefence: 2,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
    },
    material: 'bronze',
};