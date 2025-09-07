
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const adamantiteSword: Item = {
    id: 'adamantite_sword',
    name: 'Adamantite Sword',
    description: 'A well-balanced adamantite sword.',
    stackable: false,
    value: 1500,
    iconUrl: 'https://api.iconify.design/game-icons:broadsword.svg',
    material: 'adamantite',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Sword,
        speed: 3,
        stabAttack: 24,
        slashAttack: 30,
        crushAttack: -2,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 3,
        crushDefence: 2,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 28,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 30 }],
    },
};
