
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const mithrilDagger: Item = {
    id: 'mithril_dagger',
    name: 'Mithril Dagger',
    description: 'A sharp mithril dagger.',
    stackable: false,
    value: 500,
    iconUrl: 'https://api.iconify.design/game-icons:stiletto.svg',
    material: 'mithril',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Dagger,
        speed: 2,
        stabAttack: 15,
        slashAttack: 9,
        crushAttack: -4,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 14,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 20 }],
    },
};
