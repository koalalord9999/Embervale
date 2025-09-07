

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const ironBattleaxe: Item = {
    id: 'iron_battleaxe',
    name: 'Iron Battleaxe',
    description: 'A powerful iron battleaxe.',
    stackable: false,
    value: 200,
    iconUrl: 'https://api.iconify.design/game-icons:battle-axe.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: -2,
        slashAttack: 12,
        crushAttack: 10,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 14,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Battleaxe,
        speed: 5,
        requiredLevels: [{ skill: SkillName.Attack, level: 5 }],
    },
    material: 'iron',
};