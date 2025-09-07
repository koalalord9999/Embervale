
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const mithrilMace: Item = {
    id: 'mithril_mace',
    name: 'Mithril Mace',
    description: 'A heavy mithril mace.',
    stackable: false,
    value: 575,
    iconUrl: 'https://api.iconify.design/game-icons:flanged-mace.svg',
    material: 'mithril',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Mace,
        speed: 4,
        stabAttack: 9,
        slashAttack: -2,
        crushAttack: 22,
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
        requiredLevels: [{ skill: SkillName.Attack, level: 20 }],
    },
};
