import { Monster, MonsterType } from '../../types';

export const bog_serpent: Monster = {
    id: 'bog_serpent', name: 'Bog Serpent', level: 40, maxHp: 120, attack: 35,
    stabDefence: 25,
    slashDefence: 30,
    crushDefence: 28,
    rangedDefence: 20,
    magicDefence: 15,
    iconUrl: '/assets/npcChatHeads/bog_serpent.png',
    drops: [
        { itemId: 'serpent_scale_dust', chance: 1, minQuantity: 1, maxQuantity: 3 },
        { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 2 },
        { itemId: 'steel_bar', chance: 0.1, minQuantity: 1, maxQuantity: 2 },
        { itemId: 'slimy_egg_shells', chance: 0.9, minQuantity: 1, maxQuantity: 2 },
        { itemId: 'serpents_egg', chance: 0.1, minQuantity: 1, maxQuantity: 1 }
    ],
    monsterType: MonsterType.Standard, attackSpeed: 4, respawnTime: 90000, aggressive: true, alwaysAggressive: true,
    specialAttacks: [{ name: 'Venom Spit', chance: 0.25, effect: 'damage_multiplier', value: 1.2 }],
    attackStyle: 'slash',
};