

import { Item, EquipmentSlot, WeaponType, ToolType, SkillName } from '../../types';

export const ironAxe: Item = {
    id: 'iron_axe',
    name: 'Iron Axe',
    description: 'A sturdy iron axe.',
    stackable: false,
    value: 90,
    iconUrl: 'https://api.iconify.design/game-icons:battle-axe.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: -2,
        slashAttack: 8,
        crushAttack: 6,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 1,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 9,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Axe,
        speed: 4,
        requiredLevels: [{ skill: SkillName.Attack, level: 5 }],
    },
    tool: {
        type: ToolType.Axe,
        power: 20
    },
    material: 'iron',
};