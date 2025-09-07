
import { Item, EquipmentSlot, WeaponType, ToolType, SkillName } from '../../types';

export const steelPickaxe: Item = {
    id: 'steel_pickaxe',
    name: 'Steel Pickaxe',
    description: 'A strong steel pickaxe for mining rocks.',
    stackable: false,
    value: 220,
    iconUrl: 'https://api.iconify.design/game-icons:war-pick.svg',
    material: 'steel',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 6,
        slashAttack: -2,
        crushAttack: 3,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 7,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Unarmed,
        speed: 5,
        requiredLevels: [{ skill: SkillName.Attack, level: 10 }],
    },
    tool: {
        type: ToolType.Pickaxe,
        power: 30
    },
};
