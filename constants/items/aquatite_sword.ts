

import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const aquatiteSword: Item = {
    id: 'aquatite_sword',
    name: 'Aquatite Sword',
    description: 'A beautifully crafted sword that seems to ripple like water.',
    stackable: false,
    value: 85000,
    iconUrl: 'https://api.iconify.design/game-icons:broadsword.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        // Attack bonuses
        stabAttack: 58,
        slashAttack: 62,
        crushAttack: -2,
        magicAttack: 0,
        rangedAttack: 0,
        // Defence bonuses
        stabDefence: 0,
        slashDefence: 3,
        crushDefence: 2,
        magicDefence: 0,
        rangedDefence: 0,
        // Other bonuses
        strengthBonus: 60,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Sword,
        speed: 3,
        requiredLevels: [{ skill: SkillName.Attack, level: 60 }],
    },
    material: 'aquatite',
};