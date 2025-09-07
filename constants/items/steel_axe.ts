

import { Item, EquipmentSlot, WeaponType, ToolType, SkillName } from '../../types';

export const steelAxe: Item = {
    id: 'steel_axe',
    name: 'Steel Axe',
    description: 'A well-balanced steel axe.',
    stackable: false,
    value: 220,
    iconUrl: 'https://api.iconify.design/game-icons:battle-axe.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: -2,
        slashAttack: 12,
        crushAttack: 8,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 1,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 13,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Axe,
        speed: 4,
        requiredLevels: [{ skill: SkillName.Attack, level: 10 }],
    },
    tool: {
        type: ToolType.Axe,
        power: 30
    },
    material: 'steel',
};