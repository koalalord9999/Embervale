import { Monster, MonsterType, SkillName, SpellElement } from '@/types';

export const beasts: Monster[] = [
    {
        id: 'tutorial_rat', name: 'Tutorial Rat', level: 1, maxHp: 8, attack: 1, customMaxHit: 1,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: -10,
        iconUrl: 'https://api.iconify.design/game-icons:rat.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 10000, aggressive: false, attackStyle: 'stab',
    },
    {
        id: 'giant_rat', name: 'Giant Rat', level: 2, maxHp: 5, attack: 1,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: -10,
        iconUrl: 'https://api.iconify.design/game-icons:rat.svg',
        guaranteedDrops: [
            { itemId: 'rat_tail', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'binding_rune', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 20000, aggressive: false, attackStyle: 'stab',
    },
    {
        id: 'giant_spider', name: 'Giant Spider', level: 7, maxHp: 15, attack: 3,
        stabDefence: 2, slashDefence: 2, crushDefence: 2, rangedDefence: 4, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:spider-face.svg',
        guaranteedDrops: [
            { itemId: 'spider_silk', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'spider_eggs', chance: "1/10", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'binding_rune', chance: "1/50", minQuantity: 1, maxQuantity: 2 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: false, attackStyle: 'stab',
    },
    {
        id: 'cow', name: 'Cow', level: 2, maxHp: 8, attack: 1,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: -10,
        iconUrl: 'https://api.iconify.design/game-icons:cow.svg',
        guaranteedDrops: [
            { itemId: 'raw_beef', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cowhide', minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.03125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 5, respawnTime: 15000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'chicken', name: 'Chicken', level: 2, maxHp: 3, attack: 1, customMaxHit: 0,
        stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: -10,
        iconUrl: 'https://api.iconify.design/game-icons:chicken.svg',
        guaranteedDrops: [
            { itemId: 'raw_chicken', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'feathers', minQuantity: 1, maxQuantity: 20 },
        ],
        mainDrops: [
            { itemId: 'eggs', chance: "1/4", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.03125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 10000, aggressive: false, attackStyle: 'stab',
    },
    {
        id: 'wild_boar', name: 'Wild Boar', level: 11, maxHp: 22, attack: 7,
        stabDefence: 4, slashDefence: 4, crushDefence: 6, rangedDefence: 2, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:boar-tusks.svg',
        guaranteedDrops: [
            { itemId: 'raw_boar_meat', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'boar_hide', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 1, maxQuantity: 4 },
            { itemId: 'boar_tusk', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.03125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'mountain_goat', name: 'Mountain Goat', level: 18, maxHp: 30, attack: 15,
        stabDefence: 10, slashDefence: 10, crushDefence: 12, rangedDefence: 8, magicDefence: 5,
        iconUrl: 'https://api.iconify.design/game-icons:ram.svg',
        guaranteedDrops: [
            { itemId: 'raw_beef', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: "1/4", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'stone_rune', chance: "1/4", minQuantity: 5, maxQuantity: 10 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'bog_serpent', name: 'Bog Serpent', level: 40, maxHp: 120, attack: 35,
        stabDefence: 25, slashDefence: 30, crushDefence: 28, rangedDefence: 20, magicDefence: 15,
        iconUrl: 'https://api.iconify.design/game-icons:sea-serpent.svg',
        guaranteedDrops: [
            { itemId: 'serpent_scale', minQuantity: 1, maxQuantity: 3 },
            { itemId: 'big_bones', minQuantity: 2, maxQuantity: 2 },
        ],
        mainDrops: [
            { itemId: 'slimy_egg_shells', chance: "1/4", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'flux_rune', chance: "1/10", minQuantity: 3, maxQuantity: 8 },
            { itemId: 'verdant_rune', chance: "1/12", minQuantity: 2, maxQuantity: 6 },
            { itemId: 'nexus_rune', chance: "1/25", minQuantity: 1, maxQuantity: 4 },
            { itemId: 'passage_rune', chance: "1/30", minQuantity: 2, maxQuantity: 5 },
            { itemId: 'serpents_egg', chance: "1/60", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'anima_rune', chance: "1/60", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'affinity_gloves', chance: "1/256", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'affinity_boots', chance: "1/256", minQuantity: 1, maxQuantity: 1 },
        ],
        specialAttacks: [
            { name: 'Venom Spit', chance: 0.25, effect: 'damage_multiplier', value: 1.2 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 90000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash',
    },
    {
        id: 'giant_toad', name: 'Giant Toad', level: 15, maxHp: 28, attack: 12,
        stabDefence: 8, slashDefence: 8, crushDefence: 10, rangedDefence: 5, magicDefence: 5,
        iconUrl: 'https://api.iconify.design/game-icons:frog.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'hex_rune', chance: "1/10", minQuantity: 3, maxQuantity: 10 },
            { itemId: 'spiked_toad_skin', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'astral_rune', chance: "1/25", minQuantity: 1, maxQuantity: 3 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'giant_crab', name: 'Giant Crab', level: 9, maxHp: 25, attack: 8,
        stabDefence: 15, slashDefence: 15, crushDefence: 12, rangedDefence: 10, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:crab.svg',
        guaranteedDrops: [
            { itemId: 'giant_crab_meat', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'aqua_rune', chance: "1/2", minQuantity: 10, maxQuantity: 25 },
            { itemId: 'astral_rune', chance: "1/5", minQuantity: 2, maxQuantity: 6 },
            { itemId: 'nexus_rune', chance: "1/10", minQuantity: 4, maxQuantity: 12 },
            { itemId: 'giant_crab_claw', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'anima_rune', chance: "1/25", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'aether_rune', chance: "1/250", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 4, respawnTime: 30000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush',
    },
    {
        id: 'tidal_crawler', name: 'Tidal Crawler', level: 38, maxHp: 80, attack: 30,
        stabDefence: 45, slashDefence: 45, crushDefence: 40, rangedDefence: 30, magicDefence: 10,
        iconUrl: 'https://api.iconify.design/game-icons:trilobite.svg',
        mainDrops: [
            { itemId: 'nexus_rune', chance: "1/6", minQuantity: 8, maxQuantity: 18 },
            { itemId: 'hex_rune', chance: "1/8", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'raw_eel', chance: "1/8", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'affinity_top', chance: "1/256", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 5, respawnTime: 70000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'jungle_stalker', name: 'Jungle Stalker', level: 41, maxHp: 80, attack: 42,
        stabDefence: 35, slashDefence: 40, crushDefence: 30, rangedDefence: 25, magicDefence: 15,
        iconUrl: 'https://api.iconify.design/game-icons:saber-toothed-cat-head.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'verdant_rune', chance: "1/3", minQuantity: 15, maxQuantity: 30 },
            { itemId: 'nexus_rune', chance: "1/8", minQuantity: 5, maxQuantity: 15 },
        ],
        types: [MonsterType.Beast], attackSpeed: 3, respawnTime: 100000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash',
    },
    {
        id: 'bog_mite', name: 'Bog Mite', level: 26, maxHp: 45, attack: 20,
        stabDefence: 15, slashDefence: 18, crushDefence: 12, rangedDefence: 20, magicDefence: 10,
        iconUrl: 'https://api.iconify.design/game-icons:mite.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { tableId: 'herb_table', chance: "1/8", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: "1/3", minQuantity: 8, maxQuantity: 20 },
            { itemId: 'hex_rune', chance: "1/5", minQuantity: 5, maxQuantity: 12 },
            { itemId: 'astral_rune', chance: "1/20", minQuantity: 2, maxQuantity: 4 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 25000, aggressive: true, alwaysAggressive: true, attackStyle: 'stab',
    },
    {
        id: 'bear', name: 'Bear', level: 18, maxHp: 35, attack: 16,
        stabDefence: 12, slashDefence: 10, crushDefence: 15, rangedDefence: 8, magicDefence: 5,
        iconUrl: 'https://api.iconify.design/game-icons:bear-head.svg',
        guaranteedDrops: [
            { itemId: 'raw_beef', minQuantity: 1, maxQuantity: 2 },
            { itemId: 'bear_pelt', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'stone_rune', chance: "1/5", minQuantity: 2, maxQuantity: 8 },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.03125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 5, respawnTime: 40000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'wolf', name: 'Wolf', level: 15, maxHp: 25, attack: 14,
        stabDefence: 8, slashDefence: 12, crushDefence: 6, rangedDefence: 10, magicDefence: 4,
        iconUrl: 'https://api.iconify.design/game-icons:wolf-head.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'wolf_pelt', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: "1/8", minQuantity: 2, maxQuantity: 6 },
            { itemId: 'frost_berries', chance: "1/30", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.03125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 3, respawnTime: 30000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash',
    },
    {
        id: 'glimmerhorn_stag', name: 'Glimmerhorn Stag', level: 16, maxHp: 20, attack: 10,
        stabDefence: 15, slashDefence: 15, crushDefence: 15, rangedDefence: 5, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:stag-head.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'glimmer_thread_fiber', minQuantity: 1, maxQuantity: 3 },
        ],
        mainDrops: [
            { itemId: 'glimmerhorn_antler', chance: "1/4", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'verdant_rune', chance: "1/10", minQuantity: 1, maxQuantity: 3 },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.0625, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 35000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'giant_hornet', name: 'Giant Hornet', level: 14, maxHp: 22, attack: 1, ranged: 15,
        stabDefence: 5, slashDefence: 5, crushDefence: 5, rangedDefence: 15, magicDefence: 10,
        iconUrl: 'https://api.iconify.design/game-icons:wasp-sting.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: "1/2", minQuantity: 10, maxQuantity: 20 },
        ],
        tertiaryDrops: [
            { itemId: 'gust_talisman', chance: 0.03125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 2, respawnTime: 25000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged',
    },
    {
        id: 'salt_leaper', name: 'Salt Leaper', level: 35, maxHp: 55, attack: 28,
        stabDefence: 25, slashDefence: 25, crushDefence: 30, rangedDefence: 20, magicDefence: 10,
        iconUrl: 'https://api.iconify.design/game-icons:frog.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'rock_salt', chance: "1/5", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'gust_rune', chance: "1/8", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'crystalline_chitin', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'stab',
    },
    {
        id: 'salt_flat_skitterer', name: 'Salt Flat Skitterer', level: 32, maxHp: 48, attack: 25,
        stabDefence: 20, slashDefence: 20, crushDefence: 25, rangedDefence: 18, magicDefence: 8,
        iconUrl: 'https://api.iconify.design/game-icons:spider-bot.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'rock_salt', chance: "1/5", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: "1/6", minQuantity: 8, maxQuantity: 18 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 28000, aggressive: true, attackStyle: 'slash',
    },
    {
        id: 'salt_preserved_vulture', name: 'Salt-Preserved Vulture', level: 34, maxHp: 50, attack: 26,
        stabDefence: 22, slashDefence: 22, crushDefence: 25, rangedDefence: 20, magicDefence: 10,
        iconUrl: 'https://api.iconify.design/game-icons:vulture.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'feathers', minQuantity: 5, maxQuantity: 15 },
        ],
        mainDrops: [
            { itemId: 'gust_rune', chance: "1/5", minQuantity: 12, maxQuantity: 22 },
            { itemId: 'rock_salt', chance: "1/6", minQuantity: 1, maxQuantity: 2 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 35000, aggressive: true, attackStyle: 'slash',
    },
    {
        id: 'sand_scrabbler', name: 'Sand Scrabbler', level: 33, maxHp: 45, attack: 24,
        stabDefence: 25, slashDefence: 25, crushDefence: 30, rangedDefence: 20, magicDefence: 10,
        iconUrl: 'https://api.iconify.design/game-icons:sand-snake.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'rock_salt', chance: "1/4", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_rune', chance: "1/8", minQuantity: 10, maxQuantity: 20 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 32000, aggressive: true, attackStyle: 'stab',
    },
    {
        id: 'crystalline_tortoise', name: 'Crystalline Tortoise', level: 38, maxHp: 70, attack: 30,
        stabDefence: 40, slashDefence: 40, crushDefence: 45, rangedDefence: 35, magicDefence: 20,
        iconUrl: 'https://api.iconify.design/game-icons:tortoise.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'hex_rune', chance: "1/12", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'uncut_diamond', chance: "1/500", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 6, respawnTime: 60000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'crystal_scuttler', name: 'Crystal Scuttler', level: 40, maxHp: 65, attack: 32,
        stabDefence: 45, slashDefence: 45, crushDefence: 50, rangedDefence: 40, magicDefence: 25,
        iconUrl: 'https://api.iconify.design/game-icons:trilobite.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'scuttler_shell_fragment', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'astral_rune', chance: "1/10", minQuantity: 3, maxQuantity: 8 },
            { itemId: 'crystalline_chitin', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 4, respawnTime: 50000, aggressive: true, attackStyle: 'stab',
    },
    {
        id: 'ancient_ammonite', name: 'Ancient Ammonite', level: 48, maxHp: 110, attack: 40,
        stabDefence: 60, slashDefence: 60, crushDefence: 65, rangedDefence: 55, magicDefence: 30,
        iconUrl: 'https://api.iconify.design/game-icons:ammonite.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ancient_fossil', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'anima_rune', chance: "1/10", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'uncut_diamond', chance: "1/100", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 5, respawnTime: 180000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'crystal_grazer', name: 'Crystal Grazer', level: 43, maxHp: 60, attack: 30,
        stabDefence: 35, slashDefence: 35, crushDefence: 35, rangedDefence: 30, magicDefence: 30,
        iconUrl: 'https://api.iconify.design/game-icons:bison.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'crystal_shard', chance: "1/4", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'resonating_crystal', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 40000, aggressive: false, attackStyle: 'crush',
    },
    {
        id: 'giant_clam', name: 'Giant Clam', level: 45, maxHp: 50, attack: 35,
        stabDefence: 100, slashDefence: 100, crushDefence: 100, rangedDefence: 80, magicDefence: 5,
        iconUrl: 'https://api.iconify.design/game-icons:sewed-shell.svg',
        guaranteedDrops: [
            { itemId: 'raw_tuna', minQuantity: 1, maxQuantity: 2, noted: true },
        ],
        mainDrops: [
            { itemId: 'eldritch_pearl', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'gem_table', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [
            { itemId: 'nexus_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast, MonsterType.Armored], attackSpeed: 8, respawnTime: 75000, aggressive: false, attackStyle: 'crush', alwaysDrops: true,
    },
    {
        id: 'abyssal_leech', name: 'Abyssal Leech', level: 42, maxHp: 55, attack: 38,
        stabDefence: 20, slashDefence: 20, crushDefence: 20, rangedDefence: 25, magicDefence: 25,
        iconUrl: 'https://api.iconify.design/game-icons:leeching-worm.svg',
        guaranteedDrops: [
            { itemId: 'bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'raw_lobster', chance: "1/5", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'hex_rune', chance: "1/4", minQuantity: 10, maxQuantity: 20 },
        ],
        tertiaryDrops: [
            { itemId: 'nexus_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 2, respawnTime: 30000, aggressive: true, alwaysAggressive: true, attackStyle: 'stab',
    },
    {
        id: 'hydra_hatchling', name: 'Hydra Hatchling', level: 59, maxHp: 70, attack: 1, ranged: 55,
        stabDefence: 40, slashDefence: 40, crushDefence: 40, rangedDefence: 45, magicDefence: 45,
        iconUrl: 'https://api.iconify.design/game-icons:hydra-shot.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'adamantite_arrow', chance: "1/2", minQuantity: 10, maxQuantity: 25 },
            { itemId: 'aqua_rune', chance: "1/3", minQuantity: 30, maxQuantity: 50 },
        ],
        tertiaryDrops: [
            { itemId: 'nexus_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast, MonsterType.Dragon], attackSpeed: 3, respawnTime: 60000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged',
    },
    {
        id: 'gloom_weaver', name: 'Gloom Weaver', level: 54, maxHp: 65, attack: 1, magic: 50,
        stabDefence: 35, slashDefence: 35, crushDefence: 35, rangedDefence: 40, magicDefence: 40,
        iconUrl: 'https://api.iconify.design/game-icons:spider-face.svg',
        guaranteedDrops: [
            { itemId: 'spider_silk', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'hex_rune', chance: "1/2", minQuantity: 20, maxQuantity: 40 },
            { tableId: 'herb_table', chance: "1/8", minQuantity: 2, maxQuantity: 3, noted: true },
        ],
        tertiaryDrops: [
            { itemId: 'nexus_talisman', chance: 0.0078125, minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Beast], attackSpeed: 4, respawnTime: 40000, aggressive: true, attackStyle: 'magic',
    },
];