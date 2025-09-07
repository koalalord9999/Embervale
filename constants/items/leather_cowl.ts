
import { Item, EquipmentSlot, SkillName } from '../../types';

export const leatherCowl: Item = {
    id: 'leather_cowl',
    name: 'Leather Cowl',
    description: 'A simple leather hood.',
    stackable: false,
    value: 20,
    iconUrl: 'https://api.iconify.design/game-icons:light-helm.svg',
    equipment: {
        slot: EquipmentSlot.Head,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 1,
        slashDefence: 2,
        crushDefence: 2,
        rangedDefence: 1,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [
            { skill: SkillName.Defence, level: 1 },
            { skill: SkillName.Ranged, level: 1 },
        ],
    }
};