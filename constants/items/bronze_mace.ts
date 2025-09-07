
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const bronzeMace: Item = {
    id: 'bronze_mace',
    name: 'Bronze Mace',
    description: 'A blunt-force weapon. Slow but accurate.',
    stackable: false,
    value: 14,
    iconUrl: 'https://api.iconify.design/game-icons:flanged-mace.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 2,
        slashAttack: -2,
        crushAttack: 6,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 0,
        slashDefence: 0,
        crushDefence: 0,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 4,
        rangedStrength: 0,
        magicDamageBonus: 0,
        weaponType: WeaponType.Mace,
        speed: 4,
        requiredLevels: [{ skill: SkillName.Attack, level: 1 }],
    },
    material: 'bronze',
};