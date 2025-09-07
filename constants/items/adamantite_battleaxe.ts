
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const adamantiteBattleaxe: Item = {
    id: 'adamantite_battleaxe',
    name: 'Adamantite Battleaxe',
    description: 'A powerful adamantite battleaxe.',
    stackable: false,
    value: 2400,
    iconUrl: 'https://api.iconify.design/game-icons:battle-axe.svg',
    material: 'adamantite',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Battleaxe,
        speed: 5,
        stabAttack: -2,
        slashAttack: 36,
        crushAttack: 32,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 38,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 30 }],
    },
};
