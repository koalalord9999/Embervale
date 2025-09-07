
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const mithrilSword: Item = {
    id: 'mithril_sword',
    name: 'Mithril Sword',
    description: 'A beautifully crafted sword made from lightweight mithril.',
    stackable: false,
    value: 750,
    iconUrl: 'https://api.iconify.design/game-icons:broadsword.svg',
    material: 'mithril',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Sword,
        speed: 3,
        stabAttack: 18,
        slashAttack: 24,
        crushAttack: -2,
        stabDefence: 0,
        slashDefence: 4,
        crushDefence: 3,
        strengthBonus: 22,
        rangedAttack: 0,
        magicAttack: 0,
        rangedDefence: 0,
        magicDefence: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 20 }],
    },
};
