
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const mithrilWarhammer: Item = {
    id: 'mithril_warhammer',
    name: 'Mithril Warhammer',
    description: 'A formidable mithril warhammer.',
    stackable: false,
    value: 1050,
    iconUrl: 'https://api.iconify.design/game-icons:warhammer.svg',
    material: 'mithril',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Warhammer,
        speed: 6,
        stabAttack: -4,
        slashAttack: -4,
        crushAttack: 42,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 48,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Strength, level: 20 }],
    },
};
