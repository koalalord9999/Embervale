
import { Item, EquipmentSlot, WeaponType, ToolType, SkillName } from '../../types';

export const mithrilAxe: Item = {
    id: 'mithril_axe',
    name: 'Mithril Axe',
    description: 'A well-balanced mithril axe.',
    stackable: false,
    value: 550,
    iconUrl: 'https://api.iconify.design/game-icons:battle-axe.svg',
    material: 'mithril',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Axe,
        speed: 4,
        stabAttack: -2,
        slashAttack: 18,
        crushAttack: 14,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 1,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 20,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 20 }],
    },
    tool: {
        type: ToolType.Axe,
        power: 40
    },
};
