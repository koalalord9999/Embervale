
import { Item, EquipmentSlot, WeaponType, ToolType, SkillName } from '../../types';

export const adamantitePickaxe: Item = {
    id: 'adamantite_pickaxe',
    name: 'Adamantite Pickaxe',
    description: 'A very strong adamantite pickaxe for mining rocks.',
    stackable: false,
    value: 1100,
    iconUrl: 'https://api.iconify.design/game-icons:war-pick.svg',
    material: 'adamantite',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 9,
        slashAttack: -2,
        crushAttack: 4,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 12,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Unarmed,
        speed: 5,
        requiredLevels: [{ skill: SkillName.Attack, level: 30 }],
    },
    tool: {
        type: ToolType.Pickaxe,
        power: 50
    },
};
