
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const adamantiteDagger: Item = {
    id: 'adamantite_dagger',
    name: 'Adamantite Dagger',
    description: 'A sharp adamantite dagger.',
    stackable: false,
    value: 1000,
    iconUrl: 'https://api.iconify.design/game-icons:stiletto.svg',
    material: 'adamantite',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Dagger,
        speed: 2,
        stabAttack: 22,
        slashAttack: 14,
        crushAttack: -4,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 20,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 30 }],
    },
};
