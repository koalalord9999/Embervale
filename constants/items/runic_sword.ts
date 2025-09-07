
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const runicSword: Item = {
    id: 'runic_sword',
    name: 'Runic Sword',
    description: 'A powerful and well-balanced runic sword.',
    stackable: false,
    value: 3000,
    iconUrl: 'https://api.iconify.design/game-icons:broadsword.svg',
    material: 'runic',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Sword,
        speed: 3,
        stabAttack: 32,
        slashAttack: 40,
        crushAttack: -2,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 4,
        crushDefence: 3,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 38,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 40 }],
    },
};
