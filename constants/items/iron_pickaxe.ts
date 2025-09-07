

import { Item, EquipmentSlot, WeaponType, ToolType, SkillName } from '../../types';

export const ironPickaxe: Item = {
    id: 'iron_pickaxe',
    name: 'Iron Pickaxe',
    description: 'A sturdy pickaxe for mining rocks. Can be wielded as a weapon.',
    stackable: false,
    value: 90,
    iconUrl: 'https://api.iconify.design/game-icons:war-pick.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 4,
        slashAttack: -2,
        crushAttack: 2,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 5,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Unarmed, // Acts as a generic melee weapon type
        speed: 5,
        requiredLevels: [{ skill: SkillName.Attack, level: 5 }],
    },
    tool: {
        type: ToolType.Pickaxe,
        power: 20
    },
    material: 'iron',
};