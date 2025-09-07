
import { Item, EquipmentSlot, WeaponType, ToolType, SkillName } from '../../types';

export const runicPickaxe: Item = {
    id: 'runic_pickaxe',
    name: 'Runic Pickaxe',
    description: 'A powerful runic pickaxe for mining rocks.',
    stackable: false,
    value: 2200,
    iconUrl: 'https://api.iconify.design/game-icons:war-pick.svg',
    material: 'runic',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 12,
        slashAttack: -2,
        crushAttack: 5,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 16,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Unarmed,
        speed: 5,
        requiredLevels: [{ skill: SkillName.Attack, level: 40 }],
    },
    tool: {
        type: ToolType.Pickaxe,
        power: 60
    },
};
