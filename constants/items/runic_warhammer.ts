
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const runicWarhammer: Item = {
    id: 'runic_warhammer',
    name: 'Runic Warhammer',
    description: 'A formidable runic warhammer.',
    stackable: false,
    value: 4200,
    iconUrl: 'https://api.iconify.design/game-icons:warhammer.svg',
    material: 'runic',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Warhammer,
        speed: 6,
        stabAttack: -4,
        slashAttack: -4,
        crushAttack: 68,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 72,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Strength, level: 40 }],
    },
};
