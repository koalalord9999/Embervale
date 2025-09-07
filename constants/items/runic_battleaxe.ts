
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const runicBattleaxe: Item = {
    id: 'runic_battleaxe',
    name: 'Runic Battleaxe',
    description: 'A powerful runic battleaxe.',
    stackable: false,
    value: 4800,
    iconUrl: 'https://api.iconify.design/game-icons:battle-axe.svg',
    material: 'runic',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Battleaxe,
        speed: 5,
        stabAttack: -2,
        slashAttack: 48,
        crushAttack: 42,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 50,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 40 }],
    },
};
