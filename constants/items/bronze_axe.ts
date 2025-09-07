
import { Item, EquipmentSlot, WeaponType, ToolType, SkillName } from '../../types';

export const bronzeAxe: Item = {
    id: 'bronze_axe',
    name: 'Bronze Axe',
    description: 'A simple axe for chopping trees. Can be wielded as a weapon.',
    stackable: false,
    value: 10,
    iconUrl: 'https://api.iconify.design/game-icons:battle-axe.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 0,
        slashAttack: 2,
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
        weaponType: WeaponType.Axe,
        speed: 4,
        requiredLevels: [{ skill: SkillName.Attack, level: 1 }],
    },
    tool: {
        type: ToolType.Axe,
        power: 10
    },
    material: 'bronze',
};