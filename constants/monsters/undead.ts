
import { Monster, MonsterType, SkillName } from '@/types';

export const undead: Monster[] = [
    {
        id: 'grave_revenant_lord', name: 'Grave Revenant Lord', level: 73, maxHp: 115, attack: 40, strength: 45, defence: 50,
        stabDefence: 80, slashDefence: 90, crushDefence: 140, rangedDefence: 170, magicDefence: 160, customMaxHit: 12,
        iconUrl: 'https://api.iconify.design/game-icons:reaper-scythe.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 2, maxQuantity: 2 },
            { itemId: 'pregais_shield', minQuantity: 1, maxQuantity: 1, questReq: {questId: 'an_echo_of_battle', status: 'in_progress', stage: 6 }, }
        ],
        mainDrops: [
            { itemId: 'adamantite_battleaxe', chance: "1/32", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'runic_sword', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: "1/4", minQuantity: 2, maxQuantity: 3, noted: true },
            { itemId: 'coins', chance: "1/1", minQuantity: 800, maxQuantity: 1500},
            { itemId: 'nexus_rune', chance: "1/5", minQuantity: 10, maxQuantity: 20 },
        ],
        types: [MonsterType.Undead, MonsterType.Armored],
        attackSpeed: 6, respawnTime: 60000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash',
        specialAttacks: [
            { name: 'Soul Drain', chance: 0.2, effect: 'damage_multiplier', value: 1.2 }
        ],
    },
    {
        id: 'grave_revenant', name: 'Grave Revenant', level: 38, maxHp: 85, attack: 35, strength: 38, defence: 40,
        stabDefence: 40, slashDefence: 40, crushDefence: 40, rangedDefence: 35, magicDefence: 35,
        iconUrl: 'https://api.iconify.design/game-icons:grim-reaper.svg',
        guaranteedDrops: [{ itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { itemId: 'nexus_rune', chance: "1/2", minQuantity: 2, maxQuantity: 12 },
            { itemId: 'mithril_mace', chance: "1/256" },
            { itemId: 'consecrated_dust', chance: "1/15", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Undead], attackSpeed: 4, respawnTime: 45000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush'
    },
    {
        id: 'ancient_sentinel', name: 'Ancient Sentinel', level: 58, maxHp: 80, attack: 52, strength: 55, defence: 65,
        stabDefence: 60, slashDefence: 60, crushDefence: 30, rangedDefence: 80, magicDefence: 20,
        iconUrl: 'https://api.iconify.design/game-icons:ancient-sword.svg',
        guaranteedDrops: [{ itemId: 'ancient_gear', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { itemId: 'wyrmscale', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'passage_rune', chance: "1/3", minQuantity: 3, maxQuantity: 3 },
            { itemId: 'astral_rune', chance: "1/5", minQuantity: 2, maxQuantity: 2 },
            { itemId: 'runic_bar', chance: "1/32", minQuantity: 1, maxQuantity: 2 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Undead, MonsterType.Armored], attackSpeed: 6, respawnTime: 180000, aggressive: true, alwaysAggressive: true, attackStyle: 'crush'
    },
    {
        id: 'salt_wraith', name: 'Salt Wraith', level: 45, maxHp: 100, attack: 1, magic: 48, strength: 20, defence: 45,
        stabDefence: 25, slashDefence: 25, crushDefence: 25, rangedDefence: 40, magicDefence: 45,
        iconUrl: 'https://api.iconify.design/game-icons:ghost-ally.svg',
        guaranteedDrops: [
            { itemId: 'nexus_rune', minQuantity: 15, maxQuantity: 30 },
        ],
        mainDrops: [
            { itemId: 'consecrated_dust', chance: "3/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'astral_rune', chance: "1/8", minQuantity: 3, maxQuantity: 7 },
            { itemId: 'aether_rune', chance: "1/40", minQuantity: 1, maxQuantity: 3 },
        ],
        types: [MonsterType.Undead], attackSpeed: 4, respawnTime: 120000, aggressive: true, attackStyle: 'magic'
    },
    {
        id: 'scarecrow', name: 'Scarecrow', level: 3, maxHp: 12, attack: 2, strength: 2, defence: 5,
        stabDefence: 8, slashDefence: 5, crushDefence: 2, rangedDefence: 1, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:scarecrow.svg',
        guaranteedDrops: [
            { itemId: 'straw', minQuantity: 2, maxQuantity: 5 },
        ],
        mainDrops: [
            { itemId: 'verdant_rune', chance: "1/20", minQuantity: 1, maxQuantity: 1 },
            { tableId: 'herb_table', chance: "1/5" },
            { itemId: 'seeds', chance: "1/8", minQuantity: 1, maxQuantity: 4 },
        ],
        types: [MonsterType.Undead], attackSpeed: 5, respawnTime: 30000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'shipwreck_specter', name: 'Shipwreck Specter', level: 39, maxHp: 75, attack: 1, magic: 38, strength: 15, defence: 40,
        stabDefence: 32, slashDefence: 32, crushDefence: 32, rangedDefence: 40, magicDefence: 40,
        iconUrl: 'https://api.iconify.design/game-icons:ghost.svg',
        mainDrops: [
            { itemId: 'eldritch_pearl', chance: "1/40", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'driftwood_logs', chance: "3/20", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'nexus_rune', chance: "1/2", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'anima_rune', chance: "3/20", minQuantity: 2, maxQuantity: 5 },
            { itemId: 'aether_rune', chance: "1/50", minQuantity: 1, maxQuantity: 2 },
        ],
        types: [MonsterType.Undead], attackSpeed: 4, respawnTime: 80000, aggressive: true, alwaysAggressive: true, attackStyle: 'magic',
    },
    {
        id: 'skeletal_archer', name: 'Skeletal Archer', level: 55, maxHp: 50, attack: 1, ranged: 50, strength: 25, defence: 50,
        stabDefence: 20, slashDefence: 25, crushDefence: 20, rangedDefence: 15, magicDefence: 30,
        iconUrl: 'https://api.iconify.design/game-icons:skeletal-hand.svg',
        guaranteedDrops: [{ itemId: 'bones', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { itemId: 'mithril_arrow', chance: "1/2", minQuantity: 30, maxQuantity: 65 },
            { itemId: 'adamantite_arrow', chance: "1/4", minQuantity: 15, maxQuantity: 20 },
            { itemId: 'runic_arrow', chance: "1/16", minQuantity: 10, maxQuantity: 10 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Undead], attackSpeed: 4, respawnTime: 45000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged'
    },
    {
        id: 'spire_spellweaver', name: 'Spire Spellweaver', level: 80, maxHp: 100, attack: 1, magic: 70, customMaxHit: 16, strength: 40, defence: 75,
        stabDefence: 65, slashDefence: 65, crushDefence: 65, rangedDefence: 28, magicDefence: 32,
        iconUrl: 'https://api.iconify.design/game-icons:wizard-face.svg',
        guaranteedDrops: [{ itemId: 'bones', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { tableId: 'herb_table', chance: '1/5', minQuantity: 2, maxQuantity: 3, noted: true },
            { tableId: 'affinity_robes_table', chance: '1/64', minQuantity: 1, maxQuantity: 1 },
            { tableId: 'robes_of_power_table', chance: '1/512', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'emerald_amulet', chance: '1/64', minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cooked_swordfish', chance: '1/3', minQuantity: 1, maxQuantity: 2 }
        ],
        types: [MonsterType.Undead, MonsterType.Elemental], attackSpeed: 4, respawnTime: 42000, aggressive: true, attackStyle: 'magic',
        specialAttacks: [{ name: 'Weakening Curse', chance: 0.25, effect: 'stat_drain', skill: SkillName.Defence, value: -3 }],
    },
    {
        id: 'sunken_zombie', name: 'Sunken Zombie', level: 50, maxHp: 65, attack: 45, strength: 50, defence: 40,
        stabDefence: 10, slashDefence: 10, crushDefence: 5, rangedDefence: 15, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:shambling-zombie.svg',
        guaranteedDrops: [{ itemId: 'bones', minQuantity: 1, maxQuantity: 1 }],
        mainDrops: [
            { itemId: 'grimy_coin_pouch', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'fishing_bait', chance: "1/4", minQuantity: 5, maxQuantity: 15 },
            { itemId: 'runic_bar', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Undead], attackSpeed: 4, respawnTime: 30000, aggressive: true, attackStyle: 'crush'
    },
    {
        id: 'temple_spirit', name: 'Temple Spirit', level: 54, maxHp: 40, attack: 1, magic: 55, strength: 25, defence: 50,
        stabDefence: 60, slashDefence: 60, crushDefence: 60, rangedDefence: 40, magicDefence: 20,
        iconUrl: 'https://api.iconify.design/game-icons:ghost.svg',
        mainDrops: [
            { itemId: 'astral_rune', chance: "1/3", minQuantity: 2, maxQuantity: 2 },
            { itemId: 'nexus_rune', chance: "1/8", minQuantity: 2, maxQuantity: 16 },
            { itemId: 'aether_rune', chance: "1/25", minQuantity: 1, maxQuantity: 2 },
        ],
        tertiaryDrops: [{ itemId: 'nexus_talisman', chance: 1 / 128, minQuantity: 1, maxQuantity: 1 }],
        types: [MonsterType.Undead], attackSpeed: 4, respawnTime: 40000, aggressive: true, attackStyle: 'magic'
    },
];
