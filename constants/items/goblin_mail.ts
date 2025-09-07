import { Item, EquipmentSlot } from '../../types';

export const goblinMail: Item = {
    id: 'goblin_mail',
    name: 'Goblin Mail',
    description: 'Crude but effective armor made by goblins.',
    stackable: false,
    value: 15,
    iconUrl: 'https://api.iconify.design/game-icons:mail-shirt.svg',
    equipment: {
        slot: EquipmentSlot.Body,
        stabAttack: 0,
        slashAttack: 0,
        crushAttack: 0,
        rangedAttack: 0,
        magicAttack: 0,
        stabDefence: 4,
        slashDefence: 6,
        crushDefence: 8,
        rangedDefence: 0,
        magicDefence: 0,
        strengthBonus: 0,
        rangedStrength: 0,
        magicDamageBonus: 0,
    }
};