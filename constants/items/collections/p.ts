
import { Item, SkillName } from '../../../types';
import { pouchCleanser } from '../pouch_cleanser';

export const items: Item[] = [
    pouchCleanser,
    // Unfinished Potions
    { id: 'guromoot_potion_unf', name: 'Guromoot Potion (unf)', description: 'An unfinished potion.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'unfinished-potion' },
    { id: 'marleaf_potion_unf', name: 'Marleaf Potion (unf)', description: 'An unfinished potion.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'unfinished-potion' },
    { id: 'swiftthistle_potion_unf', name: 'Swiftthistle Potion (unf)', description: 'An unfinished potion.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'unfinished-potion' },
    { id: 'redfang_leaf_potion_unf', name: 'Redfang Leaf Potion (unf)', description: 'An unfinished potion.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'unfinished-potion' },
    { id: 'suns_kiss_potion_unf', name: 'Sun\'s Kiss Potion (unf)', description: 'An unfinished potion.', stackable: false, value: 25, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'unfinished-potion' },
    { id: 'bog_nettle_potion_unf', name: 'Bog Nettle Potion (unf)', description: 'An unfinished potion.', stackable: false, value: 30, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'unfinished-potion' },
    { id: 'gloom_moss_potion_unf', name: 'Gloom Moss Potion (unf)', description: 'An unfinished potion.', stackable: false, value: 40, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'unfinished-potion' },
    { id: 'windwhisper_bud_potion_unf', name: 'Windwhisper Bud Potion (unf)', description: 'An unfinished potion.', stackable: false, value: 48, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'unfinished-potion' },
    { id: 'cinderbloom_potion_unf', name: 'Cinderbloom Potion (unf)', description: 'An unfinished potion.', stackable: false, value: 54, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'unfinished-potion' },
    { id: 'wyrmfire_petal_potion_unf', name: 'Wyrmfire Petal Potion (unf)', description: 'An unfinished potion.', stackable: false, value: 63, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'unfinished-potion' },
    { id: 'duskshade_potion_unf', name: 'Duskshade Potion (unf)', description: 'An unfinished potion.', stackable: false, value: 66, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'unfinished-potion' },
    { id: 'stonebloom_potion_unf', name: 'Stonebloom Potion (unf)', description: 'An unfinished potion.', stackable: false, value: 70, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'unfinished-potion' },
    
    // Finished Potions
    // FIX: Renamed 'debuffs' to 'statModifiers' to match the Item type definition.
    { id: 'attack_potion', name: 'Attack Potion', description: 'Temporarily boosts your Attack level.', stackable: false, value: 30, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Attack, value: 3, duration: 60000 }] }, potionEffect: { description: 'Boosts Attack by 3 for 1 minute.' } },
    // FIX: Renamed 'debuffs' to 'statModifiers' to match the Item type definition.
    { id: 'strength_potion', name: 'Strength Potion', description: 'Temporarily boosts your Strength level.', stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Strength, value: 3, duration: 60000 }] }, potionEffect: { description: 'Boosts Strength by 3 for 1 minute.' } },
    // FIX: Renamed 'debuffs' to 'statModifiers' to match the Item type definition.
    { id: 'defence_potion', name: 'Defence Potion', description: 'Temporarily boosts your Defence level.', stackable: false, value: 80, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Defence, value: 3, duration: 60000 }] }, potionEffect: { description: 'Boosts Defence by 3 for 1 minute.' } },
    { id: 'antipoison_potion', name: 'Antipoison', description: 'Cures poison.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { curesPoison: true }, potionEffect: { description: 'Cures any poison effect.' } },
    // FIX: Removed invalid 'statRestore' property. This functionality is not implemented.
    { id: 'stat_restore_potion', name: 'Stat Restore Potion', description: 'Restores combat stats that have been temporarily reduced.', stackable: false, value: 150, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: {}, potionEffect: { description: 'Restores drained combat stats.' } },
    // FIX: Removed invalid 'statRestore' property. This functionality is not implemented.
    { id: 'prayer_potion', name: 'Prayer Potion', description: 'Restores some of your Prayer points.', stackable: false, value: 200, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: {}, potionEffect: { description: 'Restores 10 Prayer points.' } },
    // FIX: Renamed 'debuffs' to 'statModifiers' to match the Item type definition.
    { id: 'ranged_potion', name: 'Ranged Potion', description: 'Temporarily boosts your Ranged level.', stackable: false, value: 250, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Ranged, value: 4, duration: 90000 }] }, potionEffect: { description: 'Boosts Ranged by 4 for 1.5 minutes.' } },
    // FIX: Renamed 'debuffs' to 'statModifiers' to match the Item type definition.
    { id: 'magic_potion', name: 'Magic Potion', description: 'Temporarily boosts your Magic level.', stackable: false, value: 350, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Magic, value: 4, duration: 90000 }] }, potionEffect: { description: 'Boosts Magic by 4 for 1.5 minutes.' } },
    // FIX: Renamed 'debuffs' to 'statModifiers' to match the Item type definition.
    { id: 'super_attack_potion', name: 'Super Attack Potion', description: 'A powerful potion that boosts your Attack level.', stackable: false, value: 400, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Attack, value: 5, duration: 120000 }] }, potionEffect: { description: 'Boosts Attack by 5 for 2 minutes.' } },
    // FIX: Renamed 'debuffs' to 'statModifiers' to match the Item type definition.
    { id: 'super_strength_potion', name: 'Super Strength Potion', description: 'A powerful potion that boosts your Strength level.', stackable: false, value: 450, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Strength, value: 5, duration: 120000 }] }, potionEffect: { description: 'Boosts Strength by 5 for 2 minutes.' } },
    // FIX: Renamed 'debuffs' to 'statModifiers' to match the Item type definition.
    { id: 'super_defence_potion', name: 'Super Defence Potion', description: 'A powerful potion that boosts your Defence level.', stackable: false, value: 500, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Defence, value: 5, duration: 120000 }] }, potionEffect: { description: 'Boosts Defence by 5 for 2 minutes.' } },
    { id: 'antifire_potion', name: 'Antifire Potion', description: 'Provides temporary resistance to dragon fire.', stackable: false, value: 600, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', potionEffect: { description: 'Provides resistance to dragon fire.' } },
];
