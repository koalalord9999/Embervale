
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const adamantiteMace: Item = {
    id: 'adamantite_mace',
    name: 'Adamantite Mace',
    description: 'A heavy adamantite mace.',
    stackable: false,
    value: 1150,
    iconUrl: 'https://api.iconify.design/game-icons:flanged-mace.svg',
    material: 'adamantite',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Mace,
        speed: 4,
        stabAttack: 12,
        slashAttack: -2,
        crushAttack: 32,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 26,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 30 }],
    },
};
