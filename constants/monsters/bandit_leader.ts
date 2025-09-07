

import { Monster, MonsterType } from '../../types';

export const bandit_leader: Monster = {
    id: 'bandit_leader', name: 'Bandit Leader', level: 20, maxHp: 60, attack: 18,
    stabDefence: 15,
    slashDefence: 18,
    crushDefence: 12,
    rangedDefence: 10,
    magicDefence: 5,
    iconUrl: '/assets/npcChatHeads/bandit_leader.png',
    drops: [
        { itemId: 'big_bones', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'bandit_leaders_cutlass', chance: 0.1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'stolen_caravan_goods', chance: 1, minQuantity: 1, maxQuantity: 1 },
        { itemId: 'spiked_cape', chance: 0.05, minQuantity: 1, maxQuantity: 1 },
        { tableId: 'herb_table', chance: 1 }
    ],
    monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 180000, aggressive: true, alwaysAggressive: true,
    specialAttacks: [{ name: 'Crippling Strike', chance: 0.3, effect: 'damage_multiplier', value: 1.5 }],
    attackStyle: 'slash',
};
