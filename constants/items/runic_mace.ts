
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const runicMace: Item = {
    id: 'runic_mace',
    name: 'Runic Mace',
    description: 'A heavy runic mace.',
    stackable: false,
    value: 2300,
    iconUrl: 'https://api.iconify.design/game-icons:flanged-mace.svg',
    material: 'runic',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Mace,
        speed: 4,
        stabAttack: 18,
        slashAttack: -2,
        crushAttack: 42,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 35,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 40 }],
    },
};
