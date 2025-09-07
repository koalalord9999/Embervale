
import { Item, EquipmentSlot, SkillName } from '../../types';

export const leatherGloves: Item = {
    id: 'leather_gloves',
    name: 'Leather Gloves',
    description: 'Simple leather gloves.',
    stackable: false,
    value: 15,
    iconUrl: 'https://api.iconify.design/game-icons:gloves.svg',
    equipment: {
        slot: EquipmentSlot.Gloves,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 1,
        slashDefence: 1,
        crushDefence: 1,
        rangedDefence: 1,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 1 }],
    }
};