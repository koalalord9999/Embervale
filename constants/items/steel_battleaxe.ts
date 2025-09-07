

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const steelBattleaxe: Item = {
    id: 'steel_battleaxe',
    name: 'Steel Battleaxe',
    description: 'A powerful steel battleaxe.',
    stackable: false,
    value: 480,
    iconUrl: 'https://api.iconify.design/game-icons:battle-axe.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: -2,
        slashAttack: 17,
        crushAttack: 15,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 19,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Battleaxe,
        speed: 5,
        requiredLevels: [{ skill: SkillName.Attack, level: 10 }],
    },
    material: 'steel',
};