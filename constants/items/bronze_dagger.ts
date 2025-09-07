
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const bronzeDagger: Item = {
    id: 'bronze_dagger',
    name: 'Bronze Dagger',
    description: 'A short, sharp dagger. Very fast.',
    stackable: false,
    value: 12,
    iconUrl: 'https://api.iconify.design/game-icons:stiletto.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 4,
        slashAttack: 2,
        crushAttack: -4,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 2,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Dagger,
        speed: 2,
        requiredLevels: [{ skill: SkillName.Attack, level: 1 }],
    },
    material: 'bronze',
};