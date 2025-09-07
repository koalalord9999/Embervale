
import { Item, EquipmentSlot, WeaponType, ToolType, SkillName } from '../../types';

export const runicAxe: Item = {
    id: 'runic_axe',
    name: 'Runic Axe',
    description: 'A well-balanced runic axe.',
    stackable: false,
    value: 2200,
    iconUrl: 'https://api.iconify.design/game-icons:battle-axe.svg',
    material: 'runic',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Axe,
        speed: 4,
        stabAttack: -2,
        slashAttack: 33,
        crushAttack: 24,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 1,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 35,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 40 }],
    },
    tool: {
        type: ToolType.Axe,
        power: 60
    },
};
