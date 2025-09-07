
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const bronzeScimitar: Item = {
    id: 'bronze_scimitar',
    name: 'Bronze Scimitar',
    description: 'A curved blade that sacrifices defence for power.',
    stackable: false,
    value: 22,
    iconUrl: 'https://api.iconify.design/game-icons:curvy-knife.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 1,
        slashAttack: 5,
        crushAttack: -2,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 6,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Scimitar,
        speed: 3,
        requiredLevels: [{ skill: SkillName.Attack, level: 1 }],
    },
    material: 'bronze',
};