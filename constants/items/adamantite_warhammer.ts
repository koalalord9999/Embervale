
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const adamantiteWarhammer: Item = {
    id: 'adamantite_warhammer',
    name: 'Adamantite Warhammer',
    description: 'A formidable adamantite warhammer.',
    stackable: false,
    value: 2100,
    iconUrl: 'https://api.iconify.design/game-icons:warhammer.svg',
    material: 'adamantite',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Warhammer,
        speed: 6,
        stabAttack: -4,
        slashAttack: -4,
        crushAttack: 52,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 58,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Strength, level: 30 }],
    },
};
