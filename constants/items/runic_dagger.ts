
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const runicDagger: Item = {
    id: 'runic_dagger',
    name: 'Runic Dagger',
    description: 'A sharp runic dagger.',
    stackable: false,
    value: 2000,
    iconUrl: 'https://api.iconify.design/game-icons:stiletto.svg',
    material: 'runic',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Dagger,
        speed: 2,
        stabAttack: 30,
        slashAttack: 20,
        crushAttack: -4,
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
        requiredLevels: [{ skill: SkillName.Attack, level: 40 }],
    },
};
