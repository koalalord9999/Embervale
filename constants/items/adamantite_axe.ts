
import { Item, EquipmentSlot, WeaponType, ToolType, SkillName } from '../../types';

export const adamantiteAxe: Item = {
    id: 'adamantite_axe',
    name: 'Adamantite Axe',
    description: 'A well-balanced adamantite axe.',
    stackable: false,
    value: 1100,
    iconUrl: 'https://api.iconify.design/game-icons:battle-axe.svg',
    material: 'adamantite',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Axe,
        speed: 4,
        stabAttack: -2,
        slashAttack: 25,
        crushAttack: 18,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 1,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 26,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 30 }],
    },
    tool: {
        type: ToolType.Axe,
        power: 50
    },
};
