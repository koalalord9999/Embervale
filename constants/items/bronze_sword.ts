
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const bronzeSword: Item = {
    id: 'bronze_sword',
    name: 'Bronze Sword',
    description: 'A basic sword made of bronze.',
    stackable: false,
    value: 20,
    iconUrl: 'https://api.iconify.design/game-icons:broadsword.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 3,
        slashAttack: 5,
        crushAttack: -2,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 1,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 4,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Sword,
        speed: 3,
        requiredLevels: [{ skill: SkillName.Attack, level: 1 }],
    },
    material: 'bronze',
};