
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const adamantiteScimitar: Item = {
    id: 'adamantite_scimitar',
    name: 'Adamantite Scimitar',
    description: 'A sharp, curved adamantite blade.',
    stackable: false,
    value: 1700,
    iconUrl: 'https://api.iconify.design/game-icons:curvy-knife.svg',
    material: 'adamantite',
    equipment: {
        slot: EquipmentSlot.Weapon,
        weaponType: WeaponType.Scimitar,
        speed: 3,
        stabAttack: 7,
        slashAttack: 28,
        crushAttack: -2,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 1,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 32,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Attack, level: 30 }],
    },
};
