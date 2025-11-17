
import { Monster, MonsterType, SkillName } from '@/types';

export const demon: Monster[] = [
    {
        id: 'blight_imp', name: 'Blight Imp', level: 7, maxHp: 18, attack: 1, magic: 8, strength: 3, defence: 5,
        stabDefence: 5, slashDefence: 5, crushDefence: 5, rangedDefence: 10, magicDefence: 0,
        iconUrl: 'https://api.iconify.design/game-icons:imp-laugh.svg',
        guaranteedDrops: [
            { itemId: 'ashes', minQuantity: 1, maxQuantity: 1 }
        ],
        mainDrops: [
            { itemId: 'coins', chance: "1/2", minQuantity: 5, maxQuantity: 20 },
            { tableId: 'herb_table', chance: "1/4", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'binding_rune', chance: "1/5", minQuantity: 5, maxQuantity: 10 },
            { itemId: 'flux_rune', chance: "1/20", minQuantity: 1, maxQuantity: 3 },
            { itemId: 'ashes', chance: "1/4", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'ember_rune', chance: "1/8", minQuantity: 1, maxQuantity: 5 },
            { itemId: 'grimy_guromoot', chance: "1/12", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bones', chance: "1/8", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Demon], attackSpeed: 4, respawnTime: 600000, aggressive: true, alwaysAggressive: true, attackStyle: 'magic',
        specialAttacks: [{ name: 'Wilt', chance: 0.2, effect: 'stat_drain', skill: SkillName.Strength, value: -2 }],
        elementalWeakness: 'fire', // Quest-specific summon
    },
    {
        id: 'magma_imp', name: 'Magma Imp', level: 43, maxHp: 60, attack: 1, ranged: 50, strength: 20, defence: 40,
        stabDefence: 25, slashDefence: 25, crushDefence: 25, rangedDefence: 30, magicDefence: 30,
        iconUrl: 'https://api.iconify.design/game-icons:imp.svg',
        guaranteedDrops: [
            { itemId: 'ember_rune', minQuantity: 40, maxQuantity: 80 },
        ],
        mainDrops: [
            { itemId: 'brimstone', chance: "1/10", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'flux_rune', chance: "2/5", minQuantity: 15, maxQuantity: 30 },
            { itemId: 'ember_rune', chance: "1/3", minQuantity: 10, maxQuantity: 25 },
            { itemId: 'ashes', chance: "1/3", minQuantity: 1, maxQuantity: 5 },
            { itemId: 'coal', chance: "1/5", minQuantity: 3, maxQuantity: 8, noted: true },
            { itemId: 'iron_ore', chance: "1/8", minQuantity: 2, maxQuantity: 6, noted: true },
            { itemId: 'gold_ore', chance: "1/12", minQuantity: 1, maxQuantity: 4, noted: true },
            { itemId: 'uncut_ruby', chance: "1/100", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Demon, MonsterType.Elemental], attackSpeed: 2, respawnTime: 90000, aggressive: true, alwaysAggressive: true, attackStyle: 'ranged'
    },
    {
        id: 'fire_fiend', name: 'Fire Fiend', level: 58, maxHp: 70, attack: 50, strength: 55, defence: 50,
        stabDefence: 40, slashDefence: 40, crushDefence: 40, rangedDefence: 40, magicDefence: 40,
        iconUrl: 'https://api.iconify.design/game-icons:portal.svg',
        guaranteedDrops: [
            { itemId: 'ashes', minQuantity: 1, maxQuantity: 3 },
        ],
        mainDrops: [
            { itemId: 'ember_rune', chance: "1/2", minQuantity: 20, maxQuantity: 40 },
            { itemId: 'brimstone', chance: "1/8", minQuantity: 1, maxQuantity: 2 },
            { tableId: 'herb_table', chance: "1/10" },
            { itemId: 'coal', chance: "1/4", minQuantity: 10, maxQuantity: 20, noted: true },
            { itemId: 'gold_bar', chance: "1/15", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'mithril_ore', chance: "1/20", minQuantity: 1, maxQuantity: 5, noted: true },
            { itemId: 'uncut_ruby', chance: "1/80", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ember_talisman', chance: "1/256", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Demon, MonsterType.Elemental], attackSpeed: 4, respawnTime: 45000, aggressive: true, attackStyle: 'crush',
    },
    {
        id: 'lesser_incubus', name: 'Lesser Incubus', level: 82, maxHp: 95, attack: 75, strength: 80, defence: 75,
        stabDefence: 60, slashDefence: 60, crushDefence: 60, rangedDefence: 50, magicDefence: 50,
        iconUrl: 'https://api.iconify.design/game-icons:horned-skull.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'coins', chance: "1/1", minQuantity: 500, maxQuantity: 1500 },
            { itemId: 'mithril_bar', chance: "1/10", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'adamantite_bar', chance: "1/20", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'flux_rune', chance: "1/4", minQuantity: 20, maxQuantity: 40 },
            { itemId: 'adamantite_ore', chance: "1/8", minQuantity: 2, maxQuantity: 4, noted: true },
            { itemId: 'yew_logs', chance: "1/12", minQuantity: 5, maxQuantity: 10, noted: true },
            { itemId: 'cooked_swordfish', chance: "1/15", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'uncut_diamond', chance: "1/200", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Demon], attackSpeed: 4, respawnTime: 90000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash',
    },
    {
        id: 'greater_incubus', name: 'Greater Incubus', level: 101, maxHp: 120, attack: 90, strength: 95, defence: 90, customMaxHit: 18,
        stabDefence: 80, slashDefence: 80, crushDefence: 80, rangedDefence: 70, magicDefence: 70,
        iconUrl: 'https://api.iconify.design/game-icons:brute.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'coins', chance: "1/1", minQuantity: 1000, maxQuantity: 3000 },
            { itemId: 'adamantite_bar', chance: "1/10", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'runic_bar', chance: "1/25", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'runic_sword', chance: "1/256" },
            { itemId: 'adamantite_ore', chance: "1/15", minQuantity: 1, maxQuantity: 3, noted: true },
            { itemId: 'cooked_shark', chance: "1/8", minQuantity: 1, maxQuantity: 2 },
            { itemId: 'nexus_rune', chance: "1/5", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'uncut_ruby', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Demon], attackSpeed: 4, respawnTime: 120000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash',
        maxTaskCount: [15, 30],
    },
    {
        id: 'succubus', name: 'Succubus', level: 124, maxHp: 150, attack: 110, strength: 115, defence: 105, customMaxHit: 20,
        stabDefence: 100, slashDefence: 100, crushDefence: 90, rangedDefence: 110, magicDefence: 110,
        iconUrl: 'https://api.iconify.design/game-icons:succubus.svg',
        guaranteedDrops: [
            { itemId: 'big_bones', minQuantity: 1, maxQuantity: 1 },
        ],
        mainDrops: [
            { itemId: 'coins', chance: "1/1", minQuantity: 2000, maxQuantity: 5000 },
            { itemId: 'runic_bar', chance: "1/10", minQuantity: 1, maxQuantity: 2, noted: true },
            { itemId: 'uncut_diamond', chance: "1/50", minQuantity: 1, maxQuantity: 1 },
            { itemId: 'barbed_whip', chance: "1/512" },
            { itemId: 'nexus_rune', chance: "1/4", minQuantity: 20, maxQuantity: 40 },
            { itemId: 'anima_rune', chance: "1/8", minQuantity: 10, maxQuantity: 20 },
            { itemId: 'stat_restore_potion', chance: "1/15", minQuantity: 1, maxQuantity: 1, noted: true },
            { itemId: 'uncut_diamond', chance: "1/64", minQuantity: 1, maxQuantity: 1 },
        ],
        types: [MonsterType.Demon], attackSpeed: 3, respawnTime: 180000, aggressive: true, alwaysAggressive: true, attackStyle: 'slash',
        maxTaskCount: [10, 25],
    },
];
