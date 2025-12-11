import { Item } from '../../types';

export const misc_two: Item[] = [
    // Junk Items
    { id: 'old_boot', name: 'Old Boot', description: 'A soggy, worn-out boot. Not very useful.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:leather-boot.svg', material: 'burnt' },
    { id: 'seaweed', name: 'Seaweed', description: 'A slimy piece of seaweed.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:seaweed.svg', material: 'clean-herb' },
    { id: 'broken_arrow', name: 'Broken Arrow', description: 'A snapped arrow shaft. Useless for archery.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:broken-arrow.svg', material: 'wood-normal' },
    { id: 'dull_rock', name: 'Dull Rock', description: 'Just a plain, boring rock.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:rock.svg' },
    { id: 'tattered_cloth', name: 'Tattered Cloth', description: 'A scrap of old, torn cloth.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:ragged-wound.svg' },
    { id: 'rusty_nail', name: 'Rusty Nail', description: 'A bent and rusty nail.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:nail.svg', material: 'bronze' },
    { id: 'empty_jug', name: 'Empty Jug', description: 'An empty clay jug. Could be filled with something.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:jug.svg' },
    { id: 'gnawed_bone', name: 'Gnawed Bone', description: 'A bone that has been chewed on by... something.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:bone-gnawer.svg' },
    { id: 'consecrated_bones', name: 'Consecrated Bones', description: 'Bones that have been blessed at a holy altar. They feel warm to the touch.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:crossed-bones.svg', material: 'diamond' },
    { id: 'consecrated_big_bones', name: 'Consecrated Big Bones', description: 'Large bones that have been blessed at a holy altar. They feel warm to the touch.', stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:crossed-bones.svg', material: 'diamond' },
    { id: 'consecrated_dragon_bones', name: 'Consecrated Dragon Bones', description: 'Dragon bones that have been blessed at a holy altar. They radiate a faint light.', stackable: false, value: 200, iconUrl: 'https://api.iconify.design/game-icons:dinosaur-bones.svg', material: 'diamond' },
    { id: 'sacred_dust', name: 'Sacred Dust', description: 'A fine powder made from consecrated bones. Used in holy rituals.', stackable: true, value: 5, iconUrl: 'https://api.iconify.design/game-icons:powder.svg' },
    { id: 'anointing_oil', name: 'Anointing Oil', description: 'A fragrant oil used to sanctify ritual components.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:potion-ball.svg', material: 'potion-prayer' },
    { id: 'holy_paste', name: 'Holy Paste', description: 'A thick paste made from sacred dust and anointing oil. It can be offered at an altar.', stackable: true, value: 200, iconUrl: 'https://api.iconify.design/game-icons:gooey-molecule.svg' },
    { id: 'holy_water', name: 'Holy Water', description: 'Water blessed at a holy site. Used in sacred rituals.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', emptyable: { emptyItemId: 'vial' }, material: 'potion-prayer' },
    

    // Herblore Secondaries
    { id: 'wyvern_claw', name: 'Wyvern Claw', description: 'A sharp claw from a Wyvern.', stackable: false, value: 1500, iconUrl: 'https://api.iconify.design/game-icons:animal-claw.svg', material: 'rune-aether' },
    { id: 'imp_ashes', name: 'Imp Ashes', description: 'The volatile, magical ashes left behind by an imp.', stackable: false, value: 120, iconUrl: 'https://api.iconify.design/game-icons:ash.svg', material: 'burnt' },
    { id: 'troll_sweat', name: 'Troll Sweat', description: 'A vial of glistening, pungent sweat from an Ice Troll. Ew.', stackable: false, value: 800, iconUrl: 'https://api.iconify.design/game-icons:potion-ball.svg', material: 'vial-water' },
    { id: 'spectre_essence', name: 'Spectre Essence', description: 'A swirling, ethereal essence captured from a specter.', stackable: false, value: 450, iconUrl: 'https://api.iconify.design/game-icons:ectoplasm.svg', material: 'rune-astral' },
    { id: 'basilisk_eye', name: 'Basilisk Eye', description: 'The petrifying eye of a basilisk. Stares back at you.', stackable: false, value: 600, iconUrl: 'https://api.iconify.design/game-icons:eye-shield.svg', material: 'emerald' },
    { id: 'scorched_scale', name: 'Scorched Scale', description: 'A beasts scale that is permanently hot to the touch.', stackable: false, value: 750, iconUrl: 'https://api.iconify.design/game-icons:energy-shield.svg', material: 'rune-ember' },
    { id: 'frozen_fang', name: 'Frozen Fang', description: 'A fang from a Frostfang creature, perpetually coated in a thin layer of ice.', stackable: false, value: 700, iconUrl: 'https://api.iconify.design/game-icons:animal-skull.svg', material: 'rune-aqua' },
    { id: 'golem_shard', name: 'Golem Shard', description: 'A shard of animated rock from a golem.', stackable: false, value: 300, iconUrl: 'https://api.iconify.design/game-icons:crystal-shard.svg', material: 'rune-stone' },
    { id: 'dryad_branch', name: 'Dryad Branch', description: 'A small, living branch that hums with the life of the forest.', stackable: false, value: 250, iconUrl: 'https://api.iconify.design/game-icons:birch-trees.svg', material: 'wood-willow' },
    { id: 'arachnid_chitin', name: 'Arachnid Chitin', description: 'A hard piece of chitin from a large spider or scorpion.', stackable: false, value: 180, iconUrl: 'https://api.iconify.design/game-icons:insect-jaws.svg', material: 'bronze' },
    { id: 'spider_eye', name: 'Spider Eye', description: 'A glistening, multi-faceted eye from a large spider.', stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:eye-target.svg', material: 'uncut-ruby' },

    // Slayer Misc Drops
    { id: 'severed_zombie_hand', name: 'Severed Zombie Hand', description: 'A gruesome trophy. It still twitches occasionally.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:zombie-hand.svg' },
    { id: 'salt_crusted_hide', name: 'Salt-Crusted Hide', description: 'A tough, slimy hide covered in abrasive salt crystals.', stackable: false, value: 250, iconUrl: 'https://api.iconify.design/game-icons:animal-hide.svg', material: 'leather' },
    { id: 'basilisk_scale', name: 'Basilisk Scale', description: 'A stone-like scale from a basilisk. Surprisingly heavy.', stackable: false, value: 400, iconUrl: 'https://api.iconify.design/game-icons:scaly-skin.svg' },
    { id: 'petrifying_eye', name: 'Petrifying Eye', description: 'The eye of a Gaze Fiend. Even severed, its gaze is unsettling.', stackable: false, value: 1000, iconUrl: 'https://api.iconify.design/game-icons:eye-shield.svg' },
    { id: 'infernal_key_fragment', name: 'Infernal Key Fragment', description: 'A piece of a key that radiates a malevolent heat.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:key.svg', material: 'rune-ember' },
    { id: 'wraith_talons', name: 'Wraith Talons', description: 'Sharp, ethereal talons that feel cold to the touch.', stackable: false, value: 300, iconUrl: 'https://api.iconify.design/game-icons:bird-claw.svg' },
    { id: 'ailment_echo', name: 'Ailment Echo', description: 'A crystallized echo of a creature\'s dying scream.', stackable: false, value: 750, iconUrl: 'https://api.iconify.design/game-icons:sound-waves.svg' },
    { id: 'viscous_orb', name: 'Viscous Orb', description: 'A pulsating orb of thick, gelatinous matter.', stackable: false, value: 600, iconUrl: 'https://api.iconify.design/game-icons:gooey-molecule.svg' },
    { id: 'flaming_gullet', name: 'Flaming Gullet', description: "The petrified, still-smouldering gullet of an ancient dragon. Can be combined with a Fire-Resistant Shield at level 75 Smithing to create a Dragonfire Shield, or taken to Borin for a fee.", stackable: false, value: 800000, iconUrl: 'https://api.iconify.design/game-icons:beastial-fangs.svg', material: 'rune-ember' },
];
