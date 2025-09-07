
import { Item, EquipmentSlot, SkillName } from '../../types';

export const leatherVambraces: Item = {
    id: 'leather_vambraces',
    name: 'Leather Vambraces',
    description: 'Sturdy leather arm guards.',
    stackable: false,
    value: 25,
    iconUrl: 'https://api.iconify.design/game-icons:bracers.svg',
    equipment: {
        slot: EquipmentSlot.Gloves,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 2,
        magicAttack: 0,
        stabDefence: 1,
        slashDefence: 2,
        crushDefence: 1,
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