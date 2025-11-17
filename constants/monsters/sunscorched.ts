
import { Monster, MonsterType, SkillName } from '@/types';

export const sunscorchedMonsters: Monster[] = [
    // --- 55-90 Tier (Max Hit ~12) ---
    {
        id: 'sand_scrabbler', name: 'Sand Scrabbler', level: 55, maxHp: 50, attack: 45, strength: 50, defence: 50,
        stabDefence: 55, slashDefence: 50, crushDefence: 45, rangedDefence: 40, magicDefence: 30,
        iconUrl: 'https://api.iconify.design/game-icons:scarab-beetle.svg',
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 20000, aggressive: true, attackStyle: 'stab', customMaxHit: 11,
        mainDrops: [{ itemId: 'rock_salt', chance: '1/4' }, { itemId: 'coins', chance: '1/1', minQuantity: 20, maxQuantity: 80 }],
        guaranteedDrops: [{ itemId: 'bones', minQuantity: 1, maxQuantity: 1 }],
    },
    {
        id: 'dune_stalker', name: 'Dune Stalker', level: 62, maxHp: 65, attack: 55, strength: 58, defence: 55,
        stabDefence: 50, slashDefence: 60, crushDefence: 45, rangedDefence: 55, magicDefence: 40,
        iconUrl: 'https://api.iconify.design/game-icons:sand-snake.svg',
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 25000, aggressive: true, attackStyle: 'slash', customMaxHit: 12,
        mainDrops: [{ itemId: 'raw_beef', chance: '1/3' }, { tableId: 'herb_table', chance: '1/10' }],
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }],
    },
    {
        id: 'oasis_croc', name: 'Oasis Croc', level: 68, maxHp: 80, attack: 60, strength: 65, defence: 60,
        stabDefence: 65, slashDefence: 60, crushDefence: 70, rangedDefence: 55, magicDefence: 45,
        iconUrl: 'https://api.iconify.design/game-icons:croc-sword.svg',
        types: [MonsterType.Beast], attackSpeed: 5, respawnTime: 30000, aggressive: true, attackStyle: 'crush', customMaxHit: 12,
        mainDrops: [{ itemId: 'raw_tuna', chance: '1/5' }, { itemId: 'waterskin_full', chance: '1/8' }],
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }],
    },
    {
        id: 'canyon_basilisk', name: 'Canyon Basilisk', level: 75, maxHp: 90, attack: 68, strength: 70, defence: 70,
        stabDefence: 75, slashDefence: 70, crushDefence: 65, rangedDefence: 70, magicDefence: 60,
        iconUrl: 'https://api.iconify.design/game-icons:basilisk.svg',
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 4, respawnTime: 40000, aggressive: true, attackStyle: 'stab', customMaxHit: 12,
        mainDrops: [{ itemId: 'mithril_ore', chance: '1/16', noted: true }, { itemId: 'uncut_emerald', chance: '1/128' }],
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }],
    },
    {
        id: 'sunstone_scorpion', name: 'Sunstone Scorpion', level: 82, maxHp: 100, attack: 75, strength: 78, defence: 80,
        stabDefence: 85, slashDefence: 75, crushDefence: 70, rangedDefence: 70, magicDefence: 65,
        iconUrl: 'https://api.iconify.design/game-icons:scorpion.svg',
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 4, respawnTime: 45000, aggressive: true, attackStyle: 'stab', customMaxHit: 12,
        poisonsOnHit: { chance: 0.25, damage: 4 },
        mainDrops: [{ itemId: 'uncut_sunstone', chance: '1/256' }, { tableId: 'gem_table', chance: '1/32' }],
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }],
    },
    {
        id: 'desert_nomad', name: 'Desert Nomad', level: 88, maxHp: 85, attack: 80, strength: 82, defence: 75,
        stabDefence: 70, slashDefence: 80, crushDefence: 65, rangedDefence: 75, magicDefence: 60,
        iconUrl: 'https://api.iconify.design/game-icons:arabian-helmet.svg',
        types: [MonsterType.Humanoid], attackSpeed: 4, respawnTime: 50000, aggressive: false, attackStyle: 'slash', customMaxHit: 12,
        mainDrops: [{ itemId: 'waterskin_full', chance: '1/4' }, { itemId: 'steel_scimitar', chance: '1/32' }],
        guaranteedDrops: [{ itemId: 'bones', minQuantity: 1, maxQuantity: 1 }],
    },

    // --- 90-120 Tier (Max Hit ~24) ---
    {
        id: 'blazing_efreeti', name: 'Blazing Efreeti', level: 95, maxHp: 110, attack: 1, magic: 90, strength: 1, defence: 85,
        stabDefence: 70, slashDefence: 70, crushDefence: 70, rangedDefence: 85, magicDefence: 95,
        iconUrl: 'https://api.iconify.design/game-icons:ifrit.svg',
        types: [MonsterType.Elemental, MonsterType.Demon], attackSpeed: 4, respawnTime: 90000, aggressive: true, attackStyle: 'magic', customMaxHit: 22,
        mainDrops: [{ itemId: 'ember_rune', chance: '1/1', minQuantity: 50, maxQuantity: 100 }, { itemId: 'uncut_ruby', chance: '1/64' }],
        guaranteedDrops: [{ itemId: 'ashes', minQuantity: 1, maxQuantity: 1 }],
    },
    {
        id: 'sand_wyrm', name: 'Sand Wyrm', level: 105, maxHp: 180, attack: 95, strength: 100, defence: 100,
        stabDefence: 110, slashDefence: 90, crushDefence: 120, rangedDefence: 80, magicDefence: 70,
        iconUrl: 'https://api.iconify.design/game-icons:sand-worm.svg',
        types: [MonsterType.Dragon], attackSpeed: 6, respawnTime: 180000, aggressive: true, attackStyle: 'crush', customMaxHit: 24,
        mainDrops: [{ itemId: 'dragon_bones', chance: '1/1' }, { itemId: 'adamantite_bar', chance: '1/10', noted: true }],
        guaranteedDrops: [],
    },
    {
        id: 'temple_guardian', name: 'Temple Guardian', level: 115, maxHp: 150, attack: 100, strength: 105, defence: 120,
        stabDefence: 130, slashDefence: 130, crushDefence: 110, rangedDefence: 100, magicDefence: 80,
        iconUrl: 'https://api.iconify.design/game-icons:mummy-head.svg',
        types: [MonsterType.Undead, MonsterType.Armored], attackSpeed: 5, respawnTime: 240000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash', customMaxHit: 24,
        mainDrops: [{ itemId: 'runic_bar', chance: '1/20', noted: true }, { itemId: 'uncut_diamond', chance: '1/128' }],
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 2, maxQuantity: 2 }],
    },
];
