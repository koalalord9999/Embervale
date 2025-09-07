
import { Item, EquipmentSlot, WeaponType, ToolType, SkillName } from '../../types';

export const bronzePickaxe: Item = {
    id: 'bronze_pickaxe',
    name: 'Bronze Pickaxe',
    description: 'A simple pickaxe for mining rocks. Can be wielded as a weapon.',
    stackable: false,
    value: 10,
    iconUrl: 'https://api.iconify.design/game-icons:war-pick.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 2,
        slashAttack: -2,
        crushAttack: 1,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 3,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Unarmed, // Acts as a generic melee weapon type
        speed: 5,
        requiredLevels: [{ skill: SkillName.Attack, level: 1 }],
    },
    tool: {
        type: ToolType.Pickaxe,
        power: 10
    },
    material: 'bronze',
};