import { Prayer, PrayerType, SkillName } from '../types';

export const PRAYERS: Prayer[] = [
    // --- STAT BOOSTS ---
    // Tier 1 (5%)
    { id: 'iron_will', name: 'Iron Will', description: 'Increases your Defence by 5%.', level: 1, drainRate: 3, iconUrl: 'https://api.iconify.design/game-icons:armor-vest.svg', type: PrayerType.STAT_BOOST, group: 'defence_boost', boost: { skill: 'Defence', percent: 5 } },
    { id: 'rising_power', name: 'Rising Power', description: 'Increases your Strength by 5%.', level: 4, drainRate: 3, iconUrl: 'https://api.iconify.design/game-icons:biceps.svg', type: PrayerType.STAT_BOOST, group: 'strength_boost', boost: { skill: 'Strength', percent: 5 } },
    { id: 'focused_strike', name: 'Focused Strike', description: 'Increases your Attack by 5%.', level: 7, drainRate: 3, iconUrl: 'https://api.iconify.design/game-icons:swords-emblem.svg', type: PrayerType.STAT_BOOST, group: 'attack_boost', boost: { skill: 'Attack', percent: 5 } },
    { id: 'steady_aim', name: 'Steady Aim', description: 'Increases your Ranged accuracy by 5%.', level: 10, drainRate: 3, iconUrl: 'https://api.iconify.design/game-icons:target-arrows.svg', type: PrayerType.STAT_BOOST, group: 'ranged_boost', boost: { skill: 'Ranged', percent: 5 } },
    { id: 'arcane_intent', name: 'Arcane Intent', description: 'Increases your Magic accuracy by 5%.', level: 13, drainRate: 3, iconUrl: 'https://api.iconify.design/game-icons:spell-book.svg', type: PrayerType.STAT_BOOST, group: 'magic_boost', boost: { skill: 'Magic', percent: 5 } },
    
    // Tier 2 (10%)
    { id: 'stone_guard', name: 'Stone Guard', description: 'Increases your Defence by 10%.', level: 22, drainRate: 6, iconUrl: 'https://api.iconify.design/game-icons:armor-vest.svg', type: PrayerType.STAT_BOOST, group: 'defence_boost', boost: { skill: 'Defence', percent: 10 } },
    { id: 'surging_might', name: 'Surging Might', description: 'Increases your Strength by 10%.', level: 25, drainRate: 6, iconUrl: 'https://api.iconify.design/game-icons:biceps.svg', type: PrayerType.STAT_BOOST, group: 'strength_boost', boost: { skill: 'Strength', percent: 10 } },
    { id: 'keen_edge', name: 'Keen Edge', description: 'Increases your Attack by 10%.', level: 28, drainRate: 6, iconUrl: 'https://api.iconify.design/game-icons:swords-emblem.svg', type: PrayerType.STAT_BOOST, group: 'attack_boost', boost: { skill: 'Attack', percent: 10 } },
    { id: 'sure_shot', name: 'Sure Shot', description: 'Increases your Ranged accuracy by 10%.', level: 31, drainRate: 6, iconUrl: 'https://api.iconify.design/game-icons:target-arrows.svg', type: PrayerType.STAT_BOOST, group: 'ranged_boost', boost: { skill: 'Ranged', percent: 10 } },
    { id: 'weavers_mind', name: 'Weaver\'s Mind', description: 'Increases your Magic accuracy by 10%.', level: 34, drainRate: 6, iconUrl: 'https://api.iconify.design/game-icons:spell-book.svg', type: PrayerType.STAT_BOOST, group: 'magic_boost', boost: { skill: 'Magic', percent: 10 } },
    
    // Tier 3 (15%)
    { id: 'aegis_form', name: 'Aegis Form', description: 'Increases your Defence by 15%.', level: 43, drainRate: 12, iconUrl: 'https://api.iconify.design/game-icons:armor-vest.svg', type: PrayerType.STAT_BOOST, group: 'defence_boost', boost: { skill: 'Defence', percent: 15 } },
    { id: 'titans_vigor', name: 'Titan\'s Vigor', description: 'Increases your Strength by 15%.', level: 46, drainRate: 12, iconUrl: 'https://api.iconify.design/game-icons:biceps.svg', type: PrayerType.STAT_BOOST, group: 'strength_boost', boost: { skill: 'Strength', percent: 15 } },
    { id: 'blade_master', name: 'Blade Master', description: 'Increases your Attack by 15%.', level: 49, drainRate: 12, iconUrl: 'https://api.iconify.design/game-icons:swords-emblem.svg', type: PrayerType.STAT_BOOST, group: 'attack_boost', boost: { skill: 'Attack', percent: 15 } },
    { id: 'deadeye', name: 'Deadeye', description: 'Increases your Ranged accuracy by 15%.', level: 52, drainRate: 12, iconUrl: 'https://api.iconify.design/game-icons:target-arrows.svg', type: PrayerType.STAT_BOOST, group: 'ranged_boost', boost: { skill: 'Ranged', percent: 15 } },
    { id: 'archons_insight', name: 'Archon\'s Insight', description: 'Increases your Magic accuracy by 15%.', level: 55, drainRate: 12, iconUrl: 'https://api.iconify.design/game-icons:spell-book.svg', type: PrayerType.STAT_BOOST, group: 'magic_boost', boost: { skill: 'Magic', percent: 15 } },

    // Tier 4 (20%) - High Level
    { id: 'adamant_skin', name: 'Adamant Skin', description: 'Increases your Defence by 20%.', level: 70, drainRate: 24, iconUrl: 'https://api.iconify.design/game-icons:armor-vest.svg', type: PrayerType.STAT_BOOST, group: 'defence_boost', boost: { skill: 'Defence', percent: 20 } },
    { id: 'divine_strength', name: 'Divine Strength', description: 'Increases your Strength by 20%.', level: 73, drainRate: 24, iconUrl: 'https://api.iconify.design/game-icons:biceps.svg', type: PrayerType.STAT_BOOST, group: 'strength_boost', boost: { skill: 'Strength', percent: 20 } },
    { id: 'unrelenting_focus', name: 'Unrelenting Focus', description: 'Increases your Attack by 20%.', level: 76, drainRate: 24, iconUrl: 'https://api.iconify.design/game-icons:swords-emblem.svg', type: PrayerType.STAT_BOOST, group: 'attack_boost', boost: { skill: 'Attack', percent: 20 } },
    { id: 'celestial_sight', name: 'Celestial Sight', description: 'Increases your Ranged accuracy by 20%.', level: 79, drainRate: 24, iconUrl: 'https://api.iconify.design/game-icons:target-arrows.svg', type: PrayerType.STAT_BOOST, group: 'ranged_boost', boost: { skill: 'Ranged', percent: 20 } },
    { id: 'arcane_mastery', name: 'Arcane Mastery', description: 'Increases your Magic accuracy by 20%.', level: 82, drainRate: 24, iconUrl: 'https://api.iconify.design/game-icons:spell-book.svg', type: PrayerType.STAT_BOOST, group: 'magic_boost', boost: { skill: 'Magic', percent: 20 } },

    // --- HEALTH ---
    { id: 'rapid_heal', name: 'Rapid Heal', description: 'Doubles your natural health regeneration rate.', level: 16, drainRate: 2, iconUrl: 'https://api.iconify.design/game-icons:health-increase.svg', type: PrayerType.HEALTH, group: 'health_regen' },

    // --- PROTECTION ---
    { id: 'protect_item', name: 'Protect Item', description: 'Keep one extra item if you die.', level: 25, drainRate: 1, iconUrl: 'https://api.iconify.design/game-icons:shield-reflect.svg', type: PrayerType.PROTECTION, protection: 'item', group: 'item_protection' },
    { id: 'protect_from_magic', name: 'Protect from Magic', description: 'Grants 100% protection from magical attacks. Unlocked by a quest.', level: 58, drainRate: 15, iconUrl: 'https://api.iconify.design/game-icons:staff-pot.svg', type: PrayerType.PROTECTION, protection: 'magic', group: 'protection', questId: 'the_sorcerers_trial' },
    { id: 'protect_from_ranged', name: 'Protect from Ranged', description: 'Grants 100% protection from ranged attacks. Unlocked by a quest.', level: 61, drainRate: 15, iconUrl: 'https://api.iconify.design/game-icons:bow-arrow.svg', type: PrayerType.PROTECTION, protection: 'ranged', group: 'protection', questId: 'the_great_hunt' },
    { id: 'protect_from_melee', name: 'Protect from Melee', description: 'Grants 100% protection from melee attacks. Unlocked by a quest.', level: 65, drainRate: 15, iconUrl: 'https://api.iconify.design/game-icons:sword-clash.svg', type: PrayerType.PROTECTION, protection: 'melee', group: 'protection', questId: 'the_trial_of_war' },
];