
import { Item, EquipmentSlot, SkillName } from '../../types';

export const spikedCape: Item = {
    id: 'spiked_cape',
    name: 'Spiked Cape',
    description: 'A tough leather cape reinforced with sharp iron spikes. Has a chance to damage melee attackers.',
    stackable: false,
    value: 800,
    iconUrl: 'https://api.iconify.design/game-icons:spiked-armor.svg',
    equipment: {
        slot: EquipmentSlot.Cape,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 1,
        slashDefence: 2,
        crushDefence: 2,
        rangedDefence: 1,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
        requiredLevels: [{ skill: SkillName.Defence, level: 20 }],
    }
};