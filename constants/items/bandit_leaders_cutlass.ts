
import { Item, EquipmentSlot, WeaponType, SkillName } from '../../types';

export const banditLeadersCutlass: Item = {
    id: 'bandit_leaders_cutlass',
    name: 'Bandit Leader\'s Cutlass',
    description: 'A well-used but high-quality steel scimitar. Faster than a standard scimitar.',
    stackable: false,
    value: 500,
    iconUrl: 'https://api.iconify.design/game-icons:curvy-knife.svg',
    equipment: {
        slot: EquipmentSlot.Weapon,
        stabAttack: 4,
        slashAttack: 15,
        crushAttack: -2,
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
        weaponType: WeaponType.Scimitar,
        speed: 2,
        requiredLevels: [{ skill: SkillName.Attack, level: 25 }],
    },
    material: 'steel',
};