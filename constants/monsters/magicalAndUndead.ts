


import { Monster, MonsterType } from '../../types';

export const magicalAndUndead: Monster[] = [
    {
        id: 'cave_slime', name: 'Cave Slime', level: 3, maxHp: 10, attack: 2,
        stabDefence: 3, slashDefence: 3, crushDefence: 1, rangedDefence: 5, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/cave_slime.png',
        drops: [ { itemId: 'cave_slime_globule', chance: 0.8, minQuantity: 1, maxQuantity: 1 } ],
        monsterType: MonsterType.Standard, attackSpeed: 5, respawnTime: 25000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'stone_golem', name: 'Stone Golem', level: 35, maxHp: 100, attack: 28,
        stabDefence: 30, slashDefence: 30, crushDefence: 10, rangedDefence: 40, magicDefence: 0,
        iconUrl: '/assets/npcChatHeads/stone_golem.png',
        drops: [ { itemId: 'golem_core', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'iron_ore', chance: 1, minQuantity: 5, maxQuantity: 10 }, { itemId: 'coal', chance: 1, minQuantity: 10, maxQuantity: 20 }, { itemId: 'iron_bar', chance: 0.2, minQuantity: 1, maxQuantity: 3 }, { itemId: 'golem_core_shard', chance: 0.5, minQuantity: 1, maxQuantity: 1 } ],
        monsterType: MonsterType.Armored, attackSpeed: 6, respawnTime: 120000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'harpy', name: 'Harpy', level: 22, maxHp: 35, attack: 20,
        stabDefence: 12, slashDefence: 12, crushDefence: 10, rangedDefence: 15, magicDefence: 5,
        iconUrl: '/assets/npcChatHeads/harpy.png',
        drops: [ { itemId: 'feathers', chance: 1, minQuantity: 10, maxQuantity: 30 }, { itemId: 'harpy_feather', chance: 0.2, minQuantity: 1, maxQuantity: 1 } ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 40000, attackStyle: 'ranged', aggressive: true, alwaysAggressive: true
    },
    {
        id: 'fey_sprite', name: 'Fey Sprite', level: 20, maxHp: 30, attack: 15,
        stabDefence: 18, slashDefence: 18, crushDefence: 18, rangedDefence: 25, magicDefence: 25,
        iconUrl: '/assets/npcChatHeads/fey_sprite.png',
        drops: [ { itemId: 'fey_dust', chance: 0.8, minQuantity: 1, maxQuantity: 3 }, { itemId: 'enchanted_bark', chance: 0.3, minQuantity: 1, maxQuantity: 1 }, ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 45000, attackStyle: 'ranged', aggressive: false
    },
    {
        id: 'swamp_horror', name: 'Swamp Horror', level: 28, maxHp: 60, attack: 22,
        stabDefence: 20, slashDefence: 20, crushDefence: 25, rangedDefence: 15, magicDefence: 10,
        iconUrl: '/assets/npcChatHeads/swamp_horror.png',
        drops: [ { itemId: 'uncut_emerald', chance: 0.1, minQuantity: 1, maxQuantity: 1 } ],
        monsterType: MonsterType.Standard, attackSpeed: 5, respawnTime: 60000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'shipwreck_specter', name: 'Shipwreck Specter', level: 39, maxHp: 75, attack: 38,
        stabDefence: 32, slashDefence: 32, crushDefence: 32, rangedDefence: 40, magicDefence: 40,
        iconUrl: '/assets/npcChatHeads/shipwreck_specter.png',
        drops: [ { itemId: 'driftwood_logs', chance: 0.2, minQuantity: 1, maxQuantity: 3 } ],
        monsterType: MonsterType.Undead, attackSpeed: 4, respawnTime: 80000, aggressive: true, alwaysAggressive: true, attackStyle: 'magic',
    },
    {
        id: 'siren', name: 'Siren', level: 44, maxHp: 90, attack: 55,
        stabDefence: 30, slashDefence: 30, crushDefence: 30, rangedDefence: 35, magicDefence: 35,
        iconUrl: '/assets/npcChatHeads/siren.png',
        drops: [ { itemId: 'sirens_hair', chance: 1, minQuantity: 1, maxQuantity: 1 } ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 240000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged',
        specialAttacks: [{ name: 'Deafening Shriek', chance: 0.2, effect: 'damage_multiplier', value: 1.5 }],
    },
    {
        id: 'coral_golem', name: 'Coral Golem', level: 51, maxHp: 120, attack: 35,
        stabDefence: 55, slashDefence: 55, crushDefence: 25, rangedDefence: 70, magicDefence: 15,
        iconUrl: '/assets/npcChatHeads/coral_golem.png',
        drops: [ { itemId: 'uncut_ruby', chance: 0.1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_sword', chance: 0.002, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_full_helm', chance: 0.002, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_platebody', chance: 0.002, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_platelegs', chance: 0.002, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_kiteshield', chance: 0.002, minQuantity: 1, maxQuantity: 1 }, ],
        monsterType: MonsterType.Armored, attackSpeed: 5, respawnTime: 150000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'deep_lurker', name: 'Deep Lurker', level: 51, maxHp: 70, attack: 45, 
        stabDefence: 30, slashDefence: 35, crushDefence: 32, rangedDefence: 25, magicDefence: 20,
        iconUrl: '/assets/npcChatHeads/deep_lurker.png',
        drops: [ { itemId: 'raw_eel', chance: 0.5, minQuantity: 1, maxQuantity: 2 }, { itemId: 'aquatite_sword', chance: 0.001, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_full_helm', chance: 0.001, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_platebody', chance: 0.001, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_platelegs', chance: 0.001, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_kiteshield', chance: 0.001, minQuantity: 1, maxQuantity: 1 }, ],
        monsterType: MonsterType.Standard, attackSpeed: 3, respawnTime: 90000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash',
    },
    {
        id: 'ancient_sentinel', name: 'Ancient Sentinel', level: 51, maxHp: 150, attack: 40, 
        stabDefence: 60, slashDefence: 60, crushDefence: 30, rangedDefence: 80, magicDefence: 20,
        iconUrl: '/assets/npcChatHeads/ancient_sentinel.png',
        drops: [ { itemId: 'ancient_gear', chance: 1, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_sword', chance: 0.005, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_full_helm', chance: 0.005, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_platebody', chance: 0.005, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_platelegs', chance: 0.005, minQuantity: 1, maxQuantity: 1 }, { itemId: 'aquatite_kiteshield', chance: 0.005, minQuantity: 1, maxQuantity: 1 }, ],
        monsterType: MonsterType.Armored, attackSpeed: 6, respawnTime: 180000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'magma_imp', name: 'Magma Imp', level: 43, maxHp: 60, attack: 50,
        stabDefence: 25, slashDefence: 25, crushDefence: 25, rangedDefence: 30, magicDefence: 30,
        iconUrl: '/assets/npcChatHeads/magma_imp.png',
        drops: [ { itemId: 'brimstone', chance: 0.3, minQuantity: 1, maxQuantity: 1 } ],
        monsterType: MonsterType.Standard, attackSpeed: 2, respawnTime: 90000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged'
    },
    {
        id: 'training_dummy', name: 'Training Dummy', level: 1, maxHp: 10000, attack: 0,
        stabDefence: 0, slashDefence: 0, crushDefence:0, rangedDefence: 0, magicDefence:0,
        iconUrl: '/assets/npcChatHeads/training_dummy_png',
        drops: [],
        monsterType: MonsterType.Standard, attackSpeed: 5, respawnTime: 0, aggressive: false, attackStyle: 'crush',
        customMaxHit: 0,
    }
];