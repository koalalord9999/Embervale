
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const bronzeBattleaxe: Item = {
    id: 'bronze_battleaxe',
    name: 'Bronze Battleaxe',
    description: 'A heavy, two-handed axe. Slow but powerful.',
    stackable: false,
    value: 28,
    iconUrl: 'https://api.iconify.design/game-icons:battle-axe.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: -2,
        slashAttack: 7,
        crushAttack: 5,
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
        weaponType: WeaponType.Battleaxe,
        speed: 5,
        requiredLevels: [{ skill: SkillName.Attack, level: 1 }],
    },
    material: 'bronze',
};