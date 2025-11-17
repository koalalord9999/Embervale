import { Monster, MonsterType, SkillName } from '@/types';

export const sunbright: Monster[] = [
    {
        id: 'deranged_botanist', name: 'Deranged Botanist', level: 17, maxHp: 22, customMaxHit: 3,
        attack: 13, magic: 25, strength: 20, defence: 20,
        stabDefence: 10, slashDefence: 15, crushDefence: 13, rangedDefence: 5, magicDefence: 10,
        iconUrl: 'https://api.iconify.design/game-icons:hooded-assassin.svg',
        guaranteedDrops: [{ itemId: 'bones', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { multiRoll: { tableId: 'herb_table', maxRolls: 3, rollAgainChance: 0.25 }, chance: 80 },
            { itemId: 'vial_of_water', chance: 15, minQuantity: 5, maxQuantity: 15 },
            { itemId: 'verdant_rune', chance: 8, minQuantity: 3, maxQuantity: 8 },
            { itemId: 'passage_rune', chance: 8, minQuantity: 2, maxQuantity: 6 },
            { itemId: 'consecrated_dust', chance: 5, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'spider_eggs', chance: 3, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'boar_tusk', chance: 3, minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'passage_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Humanoid], attackSpeed: 5, respawnTime: 18000, aggressive: false, useWeightedMainDrops: true, attackStyle: 'crush',
    },
    {
        id: 'sunscale_serpent', name: 'Sunscale Serpent', level: 38, maxHp: 60, attack: 35, strength: 32, defence: 30,
        stabDefence: 25, slashDefence: 35, crushDefence: 20, rangedDefence: 30, magicDefence: 15,
        iconUrl: 'https://api.iconify.design/game-icons:sea-serpent.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'serpent_scale', chance: '1/4', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'ember_rune', chance: '1/8', minQuantity: 10, maxQuantity: 20 },
            { tableId: 'herb_table', chance: '1/12' },
            { itemId: 'uncut_diamond', chance: '1/32' },
        ],
        tertiaryDrops: [
            { itemId: 'passage_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 3, respawnTime: 40000, aggressive: true, attackStyle: 'slash', customMaxHit: 8,
        specialAttacks: [
            { name: 'Venomous Bite', chance: 0.3, effect: 'poison', damage: 5, poisonChance: 0.75 },
        ],
    },
    {
        id: 'plains_lion', name: 'Plains Lion', level: 42, maxHp: 75, attack: 40, strength: 45, defence: 35,
        stabDefence: 30, slashDefence: 40, crushDefence: 30, rangedDefence: 35, magicDefence: 10,
        iconUrl: 'https://api.iconify.design/game-icons:lion.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'raw_beef', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'raw_beef', chance: '1/2', minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'strength_potion', chance: '1/32', minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'passage_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 50000, aggressive: true, attackStyle: 'slash', customMaxHit: 10,
    },
    {
        id: 'sunstone_golem', name: 'Sunstone Golem', level: 45, maxHp: 90, attack: 42, strength: 48, defence: 50,
        stabDefence: 50, slashDefence: 50, crushDefence: 20, rangedDefence: 60, magicDefence: 5,
        iconUrl: 'https://api.iconify.design/game-icons:rock-golem.svg',
        guaranteedDrops: [
            { itemId: 'stone_rune', minQuantity: 20, maxQuantity: 40 },
        ],
        mainDrops: [
            { itemId: 'gold_ore', chance: '1/4', minQuantity: 1, maxQuantity: 3, noted: true },
            { tableId: 'gem_table', chance: '1/8' },
            { itemId: 'golem_core', chance: '1/32' },
        ],
        tertiaryDrops: [
            { itemId: 'passage_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Elemental, MonsterType.Armored], attackSpeed: 6, respawnTime: 70000, aggressive: true, attackStyle: 'crush', customMaxHit: 12,
    },
    {
        id: 'roc_hatchling', name: 'Roc Hatchling', level: 48, maxHp: 80, attack: 48, strength: 45, defence: 40,
        stabDefence: 45, slashDefence: 35, crushDefence: 35, rangedDefence: 45, magicDefence: 25,
        iconUrl: 'https://api.iconify.design/game-icons:vulture.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'feathers', minQuantity: 20, maxQuantity: 50 },
        ],
        mainDrops: [
            { itemId: 'coins', chance: '1/1', minQuantity: 100, maxQuantity: 250 },
            { itemId: 'raw_swordfish', chance: '1/8', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'anima_rune', chance: '1/16', minQuantity: 1, maxQuantity: 3 },
            { itemId: 'yew_shortbow_u', chance: '1/256' },
        ],
        tertiaryDrops: [
            { itemId: 'passage_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 60000, aggressive: true, attackStyle: 'stab', customMaxHit: 14,
    },
    {
        id: 'zealous_nomad', name: 'Zealous Nomad', level: 50, maxHp: 85, attack: 48, strength: 52, defence: 45,
        stabDefence: 45, slashDefence: 50, crushDefence: 40, rangedDefence: 45, magicDefence: 30,
        iconUrl: 'https://api.iconify.design/game-icons:hood.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'coins', chance: '1/1', minQuantity: 150, maxQuantity: 300 },
            { itemId: 'steel_scimitar', chance: '1/64' },
            { itemId: 'prayer_potion', chance: '1/32' },
            { tableId: 'herb_table', chance: '1/8' },
        ],
        tertiaryDrops: [
            { itemId: 'passage_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Humanoid], attackSpeed: 4, respawnTime: 65000, aggressive: true, attackStyle: 'slash', customMaxHit: 15,
    },
];