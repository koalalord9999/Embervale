
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const runicScimitar: Item = {
    id: 'runic_scimitar',
    name: 'Runic Scimitar',
    description: 'A sharp, curved runic blade.',
    stackable: false,
    value: 3400,
    iconUrl: 'https://api.iconify.design/game-icons:curvy-knife.svg',
    material: 'runic',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Scimitar,
        speed: 3,
        stabAttack: 10,
        slashAttack: 38,
        crushAttack: -2,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 1,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 42,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 40 }],
    },
};
