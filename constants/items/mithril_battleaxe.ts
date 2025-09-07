
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const mithrilBattleaxe: Item = {
    id: 'mithril_battleaxe',
    name: 'Mithril Battleaxe',
    description: 'A powerful mithril battleaxe.',
    stackable: false,
    value: 1200,
    iconUrl: 'https://api.iconify.design/game-icons:battle-axe.svg',
    material: 'mithril',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Battleaxe,
        speed: 5,
        stabAttack: -2,
        slashAttack: 26,
        crushAttack: 23,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 28,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 20 }],
    },
};
