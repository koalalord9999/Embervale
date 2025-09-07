
import { Item, EquipmentSlot, WeaponType, ToolType, SkillName } from '../../types';

export const mithrilPickaxe: Item = {
    id: 'mithril_pickaxe',
    name: 'Mithril Pickaxe',
    description: 'A strong mithril pickaxe for mining rocks.',
    stackable: false,
    value: 550,
    iconUrl: 'https://api.iconify.design/game-icons:war-pick.svg',
    material: 'mithril',
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
        strengthBonus: 8,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Unarmed,
        speed: 5,
        requiredLevels: [{ skill: SkillName.Attack, level: 20 }],
    },
    tool: {
        type: ToolType.Pickaxe,
        power: 40
    },
};
