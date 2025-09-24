import { Spell } from '../types';

export const SPELLS: Spell[] = [
    // --- COMBAT SPELLS ---
    // Tier 1: Dart (Lvl 1+)
    { id: 'gust_dart', name: 'Gust Dart', description: 'A basic blast of wind.', level: 1, runes: [{ itemId: 'gust_rune', quantity: 1 }, { itemId: 'binding_rune', quantity: 1 }], xp: 5.5, type: 'combat', maxHit: 2, element: 'wind', autocastable: true, castTime: 4 },
    { id: 'aqua_dart', name: 'Aqua Dart', description: 'A jet of water.', level: 5, runes: [{ itemId: 'gust_rune', quantity: 1 }, { itemId: 'aqua_rune', quantity: 1 }, { itemId: 'binding_rune', quantity: 1 }], xp: 7.5, type: 'combat', maxHit: 4, element: 'water', autocastable: true, castTime: 4 },
    { id: 'stone_dart', name: 'Stone Dart', description: 'A sharp piece of rock.', level: 9, runes: [{ itemId: 'gust_rune', quantity: 2 }, { itemId: 'stone_rune', quantity: 2 }, { itemId: 'binding_rune', quantity: 1 }], xp: 9.5, type: 'combat', maxHit: 6, element: 'earth', autocastable: true, castTime: 4 },
    { id: 'ember_dart', name: 'Ember Dart', description: 'A small ball of fire.', level: 13, runes: [{ itemId: 'gust_rune', quantity: 2 }, { itemId: 'ember_rune', quantity: 2 }, { itemId: 'binding_rune', quantity: 1 }], xp: 11.5, type: 'combat', maxHit: 8, element: 'fire', autocastable: true, castTime: 4 },
    
    // Tier 2: Bolt (Lvl 20+)
    { id: 'gust_bolt', name: 'Gust Bolt', description: 'A powerful blast of wind.', level: 17, runes: [{ itemId: 'gust_rune', quantity: 4 }, { itemId: 'flux_rune', quantity: 1 }], xp: 15.5, type: 'combat', maxHit: 9, element: 'wind', autocastable: true, castTime: 4 },
    { id: 'aqua_bolt', name: 'Aqua Bolt', description: 'A concentrated jet of water.', level: 24, runes: [{ itemId: 'gust_rune', quantity: 2 }, { itemId: 'aqua_rune', quantity: 3 }, { itemId: 'flux_rune', quantity: 1 }], xp: 19.5, type: 'combat', maxHit: 10, element: 'water', autocastable: true, castTime: 4 },
    { id: 'stone_bolt', name: 'Stone Bolt', description: 'A large, sharp piece of rock.', level: 31, runes: [{ itemId: 'gust_rune', quantity: 3 }, { itemId: 'stone_rune', quantity: 4 }, { itemId: 'flux_rune', quantity: 1 }], xp: 23.5, type: 'combat', maxHit: 11, element: 'earth', autocastable: true, castTime: 4 },
    { id: 'ember_bolt', name: 'Ember Bolt', description: 'A searing ball of fire.', level: 38, runes: [{ itemId: 'gust_rune', quantity: 3 }, { itemId: 'ember_rune', quantity: 5 }, { itemId: 'flux_rune', quantity: 1 }], xp: 27.5, type: 'combat', maxHit: 12, element: 'fire', autocastable: true, castTime: 4 },

    // Tier 3: Blast (Lvl 40+)
    { id: 'gust_blast', name: 'Gust Blast', description: 'A ferocious gale.', level: 42, runes: [{ itemId: 'gust_rune', quantity: 6 }, { itemId: 'nexus_rune', quantity: 1 }], xp: 32.5, type: 'combat', maxHit: 13, element: 'wind', autocastable: true, castTime: 4 },
    { id: 'aqua_blast', name: 'Aqua Blast', description: 'A high-pressure torrent of water.', level: 49, runes: [{ itemId: 'gust_rune', quantity: 3 }, { itemId: 'aqua_rune', quantity: 6 }, { itemId: 'nexus_rune', quantity: 1 }], xp: 38.5, type: 'combat', maxHit: 14, element: 'water', autocastable: true, castTime: 4 },
    { id: 'stone_blast', name: 'Stone Blast', description: 'A massive boulder.', level: 54, runes: [{ itemId: 'gust_rune', quantity: 3 }, { itemId: 'stone_rune', quantity: 7 }, { itemId: 'nexus_rune', quantity: 1 }], xp: 44.5, type: 'combat', maxHit: 15, element: 'earth', autocastable: true, castTime: 4 },
    { id: 'ember_blast', name: 'Ember Blast', description: 'An explosive fireball.', level: 59, runes: [{ itemId: 'gust_rune', quantity: 4 }, { itemId: 'ember_rune', quantity: 8 }, { itemId: 'nexus_rune', quantity: 1 }], xp: 50.5, type: 'combat', maxHit: 16, element: 'fire', autocastable: true, castTime: 4 },

    // Tier 4: Wave (Lvl 60+)
    { id: 'gust_wave', name: 'Gust Wave', description: 'A crushing wave of wind.', level: 66, runes: [{ itemId: 'gust_rune', quantity: 8 }, { itemId: 'anima_rune', quantity: 1 }], xp: 58.5, type: 'combat', maxHit: 17, element: 'wind', autocastable: true, castTime: 4 },
    { id: 'aqua_wave', name: 'Aqua Wave', description: 'A tidal wave of magical water.', level: 73, runes: [{ itemId: 'gust_rune', quantity: 5 }, { itemId: 'aqua_rune', quantity: 8 }, { itemId: 'anima_rune', quantity: 1 }], xp: 66.5, type: 'combat', maxHit: 18, element: 'water', autocastable: true, castTime: 4 },
    { id: 'stone_wave', name: 'Stone Wave', description: 'A wave of shifting earth.', level: 77, runes: [{ itemId: 'gust_rune', quantity: 5 }, { itemId: 'stone_rune', quantity: 8 }, { itemId: 'anima_rune', quantity: 1 }], xp: 74.5, type: 'combat', maxHit: 19, element: 'earth', autocastable: true, castTime: 4 },
    { id: 'ember_wave', name: 'Ember Wave', description: 'A wave of pure fire.', level: 81, runes: [{ itemId: 'gust_rune', quantity: 6 }, { itemId: 'ember_rune', quantity: 10 }, { itemId: 'anima_rune', quantity: 1 }], xp: 82.5, type: 'combat', maxHit: 20, element: 'fire', autocastable: true, castTime: 4 },

    // Tier 5: Storm (Lvl 80+)
    { id: 'gust_storm', name: 'Gust Storm', description: 'A miniature tornado.', level: 85, runes: [{ itemId: 'gust_rune', quantity: 10 }, { itemId: 'aether_rune', quantity: 1 }], xp: 90.5, type: 'combat', maxHit: 21, element: 'wind', autocastable: true, castTime: 4 },
    { id: 'aqua_storm', name: 'Aqua Storm', description: 'A swirling vortex of water.', level: 89, runes: [{ itemId: 'gust_rune', quantity: 6 }, { itemId: 'aqua_rune', quantity: 10 }, { itemId: 'aether_rune', quantity: 1 }], xp: 98.5, type: 'combat', maxHit: 22, element: 'water', autocastable: true, castTime: 4 },
    { id: 'stone_storm', name: 'Stone Storm', description: 'A storm of razor-sharp rocks.', level: 92, runes: [{ itemId: 'gust_rune', quantity: 7 }, { itemId: 'stone_rune', quantity: 13 }, { itemId: 'aether_rune', quantity: 1 }], xp: 106.5, type: 'combat', maxHit: 23, element: 'earth', autocastable: true, castTime: 4 },
    { id: 'ember_storm', name: 'Ember Storm', description: 'A maelstrom of fire.', level: 95, runes: [{ itemId: 'gust_rune', quantity: 8 }, { itemId: 'ember_rune', quantity: 15 }, { itemId: 'aether_rune', quantity: 1 }], xp: 114.5, type: 'combat', maxHit: 24, element: 'fire', autocastable: true, castTime: 4 },

    // --- UTILITY SPELLS ---
    // Teleportation
    { id: 'meadowdale_teleport', name: 'Meadowdale Teleport', description: 'Teleports you to Meadowdale square.', level: 25, runes: [{ itemId: 'passage_rune', quantity: 1 }, { itemId: 'gust_rune', quantity: 3 }, { itemId: 'stone_rune', quantity: 1 }], xp: 35, type: 'utility-teleport', autocastable: false, castTime: 3 },
    { id: 'oakhaven_teleport', name: 'Oakhaven Teleport', description: 'Teleports you to Oakhaven square.', level: 31, runes: [{ itemId: 'passage_rune', quantity: 1 }, { itemId: 'gust_rune', quantity: 3 }, { itemId: 'ember_rune', quantity: 1 }], xp: 41, type: 'utility-teleport', autocastable: false, castTime: 3 },
    { id: 'silverhaven_teleport', name: 'Silverhaven Teleport', description: 'Teleports you to Silverhaven square.', level: 37, runes: [{ itemId: 'passage_rune', quantity: 1 }, { itemId: 'gust_rune', quantity: 3 }, { itemId: 'aqua_rune', quantity: 1 }], xp: 47, type: 'utility-teleport', autocastable: false, castTime: 3 },

    // Item Processing
    { id: 'superheat_ore', name: 'Superheat Ore', description: 'Smelt an ore in your inventory into a bar without a furnace.', level: 43, runes: [{ itemId: 'ember_rune', quantity: 4 }, { itemId: 'verdant_rune', quantity: 1 }], xp: 53, type: 'utility-processing', targetItems: ['copper_ore', 'iron_ore', 'silver_ore', 'gold_ore', 'mithril_ore', 'adamantite_ore', 'titanium_ore'], autocastable: false, castTime: 2 },
    { id: 'lesser_transmutation', name: 'Lesser Transmutation', description: 'Convert an item into a sum of coins.', level: 33, runes: [{ itemId: 'ember_rune', quantity: 3 }, { itemId: 'verdant_rune', quantity: 1 }], xp: 40, type: 'utility-alchemy', targetItems: ['all'], autocastable: false, castTime: 3 },
    { id: 'greater_transmutation', name: 'Greater Transmutation', description: 'Convert an item into a greater sum of coins.', level: 62, runes: [{ itemId: 'ember_rune', quantity: 6 }, { itemId: 'verdant_rune', quantity: 1 }], xp: 65, type: 'utility-alchemy', targetItems: ['all'], autocastable: false, castTime: 5 },
    
    // Enchantment
    { id: 'enchant_sapphire', name: 'Enchant Sapphire Jewelry', description: 'Enchants sapphire jewelry with magical power.', level: 7, runes: [{ itemId: 'aqua_rune', quantity: 1 }, { itemId: 'astral_rune', quantity: 1 }], xp: 17.5, type: 'utility-enchant', targetItems: ['sapphire_ring', 'sapphire_necklace', 'sapphire_amulet'], autocastable: false, castTime: 2 },
    { id: 'enchant_emerald', name: 'Enchant Emerald Jewelry', description: 'Enchants emerald jewelry with magical power.', level: 27, runes: [{ itemId: 'stone_rune', quantity: 3 }, { itemId: 'astral_rune', quantity: 1 }], xp: 37.5, type: 'utility-enchant', targetItems: ['emerald_ring', 'emerald_necklace', 'emerald_amulet'], autocastable: false, castTime: 2 },
    { id: 'enchant_ruby', name: 'Enchant Ruby Jewelry', description: 'Enchants ruby jewelry with magical power.', level: 49, runes: [{ itemId: 'ember_rune', quantity: 5 }, { itemId: 'astral_rune', quantity: 1 }], xp: 59.5, type: 'utility-enchant', targetItems: ['ruby_ring', 'ruby_necklace', 'ruby_amulet'], autocastable: false, castTime: 2 },
    { id: 'enchant_diamond', name: 'Enchant Diamond Jewelry', description: 'Enchants diamond jewelry with magical power.', level: 57, runes: [{ itemId: 'stone_rune', quantity: 10 }, { itemId: 'ember_rune', quantity: 10 }, { itemId: 'astral_rune', quantity: 1 }], xp: 67.5, type: 'utility-enchant', targetItems: ['diamond_ring', 'diamond_necklace', 'diamond_amulet'], autocastable: false, castTime: 2 },

    // --- CURSE & ENHANCEMENT SPELLS ---
    { id: 'weaken', name: 'Weaken', description: 'Reduces an opponent\'s Attack level.', level: 3, runes: [{ itemId: 'hex_rune', quantity: 2 }, { itemId: 'stone_rune', quantity: 1 }], xp: 8, type: 'curse', autocastable: false, castTime: 4 },
    { id: 'clarity_of_thought', name: 'Clarity of Thought', description: 'Slightly boosts your own Attack level.', level: 23, runes: [{ itemId: 'flux_rune', quantity: 1 }, { itemId: 'gust_rune', quantity: 2 }], xp: 18, type: 'enhancement', autocastable: false, castTime: 4 },
    { id: 'vulnerability', name: 'Vulnerability', description: 'Reduces an opponent\'s Defence level.', level: 41, runes: [{ itemId: 'hex_rune', quantity: 3 }, { itemId: 'stone_rune', quantity: 3 }], xp: 30, type: 'curse', autocastable: false, castTime: 4 },
    { id: 'arcane_strength', name: 'Arcane Strength', description: 'Slightly boosts your own Strength level.', level: 66, runes: [{ itemId: 'anima_rune', quantity: 1 }, { itemId: 'ember_rune', quantity: 3 }], xp: 45, type: 'enhancement', autocastable: false, castTime: 4 },
    { id: 'enfeeble', name: 'Enfeeble', description: 'Reduces an opponent\'s Strength level.', level: 82, runes: [{ itemId: 'hex_rune', quantity: 4 }, { itemId: 'stone_rune', quantity: 5 }], xp: 60, type: 'curse', autocastable: false, castTime: 4 },
];