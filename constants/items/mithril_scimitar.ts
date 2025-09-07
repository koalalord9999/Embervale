
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const mithrilScimitar: Item = {
    id: 'mithril_scimitar',
    name: 'Mithril Scimitar',
    description: 'A sharp, curved mithril blade.',
    stackable: false,
    value: 850,
    iconUrl: 'https://api.iconify.design/game-icons:curvy-knife.svg',
    material: 'mithril',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Scimitar,
        speed: 3,
        stabAttack: 5,
        slashAttack: 20,
        crushAttack: -2,
        stabDefence: 0,
        slashDefence: 1,
        crushDefence: 0,
        strengthBonus: 24,
        rangedAttack: 0,
        magicAttack: 0,
        rangedDefence: 0,
        magicDefence: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 20 }],
    },
};
