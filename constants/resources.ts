import { Item } from '../types';

export const resources: Item[] = [
    // Ores
    { id: 'copper_ore', name: 'Copper Ore', description: 'A lump of copper ore.', stackable: false, value: 4, iconUrl: 'https://api.iconify.design/game-icons:ore.svg', material: 'copper' },
    { id: 'tin_ore', name: 'Tin Ore', description: 'A lump of tin ore.', stackable: false, value: 4, iconUrl: 'https://api.iconify.design/game-icons:ore.svg', material: 'tin' },
    { id: 'iron_ore', name: 'Iron Ore', description: 'A lump of iron ore, requires level 15 Mining.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:ore.svg', material: 'iron-ore' },
    { id: 'coal', name: 'Coal', description: 'A lump of coal, essential for smelting high-grade metals.', stackable: false, value: 25, iconUrl: 'https://api.iconify.design/game-icons:coal-wagon.svg', material: 'coal' },
    { id: 'silver_ore', name: 'Silver Ore', description: 'A chunk of rock containing veins of silver.', stackable: false, value: 40, iconUrl: 'https://api.iconify.design/game-icons:ore.svg', material: 'silver' },
    { id: 'mithril_ore', name: 'Mithril Ore', description: 'A chunk of raw, silvery-blue mithril ore.', stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:ore.svg', material: 'mithril-ore' },
    { id: 'adamantite_ore', name: 'Adamantite Ore', description: 'A chunk of raw, dark green adamantite ore.', stackable: false, value: 80, iconUrl: 'https://api.iconify.design/game-icons:ore.svg', material: 'adamantite-ore' },
    { id: 'titanium_ore', name: 'Titanium Ore', description: 'A chunk of incredibly rare, purplish titanium ore.', stackable: false, value: 120, iconUrl: 'https://api.iconify.design/game-icons:ore.svg', material: 'titanium-ore' },
    { id: 'aquatite_ore', name: 'Aquatite Ore', description: 'A rare, shimmering blue ore found only in the deepest, wettest places.', stackable: false, value: 250, iconUrl: 'https://api.iconify.design/game-icons:ore.svg', material: 'sapphire' },

    // Bars
    { id: 'bronze_bar', name: 'Bronze Bar', description: 'A bar of bronze, ready for smithing.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:metal-bar.svg', material: 'bronze' },
    { id: 'iron_bar', name: 'Iron Bar', description: 'A bar of iron, ready for smithing.', stackable: false, value: 40, iconUrl: 'https://api.iconify.design/game-icons:metal-bar.svg', material: 'iron' },
    { id: 'steel_bar', name: 'Steel Bar', description: 'A bar of steel, ready for smithing.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:metal-bar.svg', material: 'steel' },
    { id: 'silver_bar', name: 'Silver Bar', description: 'A bar of pure silver.', stackable: false, value: 80, iconUrl: 'https://api.iconify.design/game-icons:gold-bar.svg', material: 'silver' },
    { id: 'mithril_bar', name: 'Mithril Bar', description: 'A bar of refined mithril.', stackable: false, value: 150, iconUrl: 'https://api.iconify.design/game-icons:metal-bar.svg', material: 'mithril' },
    { id: 'adamantite_bar', name: 'Adamantite Bar', description: 'A bar of refined adamantite.', stackable: false, value: 250, iconUrl: 'https://api.iconify.design/game-icons:metal-bar.svg', material: 'adamantite' },
    { id: 'runic_bar', name: 'Runic Bar', description: 'A bar of refined, durable runic metal.', stackable: false, value: 400, iconUrl: 'https://api.iconify.design/game-icons:metal-bar.svg', material: 'runic' },
    { id: 'aquatite_bar', name: 'Aquatite Bar', description: 'A bar of shimmering, water-aspected metal. Ready for high-level smithing.', stackable: false, value: 1000, iconUrl: 'https://api.iconify.design/game-icons:metal-bar.svg', material: 'aquatite' },
    
    // Logs
    { id: 'logs', name: 'Logs', description: 'Standard logs from a tree.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:wood-pile.svg', material: 'wood-normal' },
    { id: 'oak_logs', name: 'Oak Logs', description: 'Sturdy logs from a mighty oak tree.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:wood-pile.svg', material: 'wood-oak' },
    { id: 'willow_logs', name: 'Willow Logs', description: 'Flexible logs from a willow tree.', stackable: false, value: 40, iconUrl: 'https://api.iconify.design/game-icons:wood-pile.svg', material: 'wood-willow' },
    { id: 'feywood_logs', name: 'Feywood Logs', description: 'Logs from a Feywood tree. They shimmer with a faint, magical light.', stackable: false, value: 80, iconUrl: 'https://api.iconify.design/game-icons:wood-pile.svg', material: 'wood-feywood' },
    { id: 'yew_logs', name: 'Yew Logs', description: 'Logs from an ancient yew tree, perfect for powerful bows.', stackable: false, value: 120, iconUrl: 'https://api.iconify.design/game-icons:wood-pile.svg', material: 'wood-yew' },
    { id: 'driftwood_logs', name: 'Driftwood Logs', description: 'Weathered logs, hardened by the sea.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:wood-pile.svg', material: 'wood-driftwood' },
    { id: 'mahogany_logs', name: 'Mahogany Logs', description: 'Rich, dark red logs from a tropical tree.', stackable: false, value: 150, iconUrl: 'https://api.iconify.design/game-icons:wood-pile.svg', material: 'wood-mahogany' },
    
    // Gems
    { id: 'uncut_sapphire', name: 'Uncut Sapphire', description: 'A raw, uncut sapphire. Could be cut with a chisel.', stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:emerald.svg', material: 'uncut-sapphire' },
    { id: 'sapphire', name: 'Sapphire', description: 'A beautiful blue gemstone.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:rupee.svg', material: 'sapphire' },
    { id: 'uncut_emerald', name: 'Uncut Emerald', description: 'A raw, uncut emerald. Could be cut with a chisel.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:emerald.svg', material: 'uncut-emerald' },
    { id: 'emerald', name: 'Emerald', description: 'A brilliant green gemstone.', stackable: false, value: 200, iconUrl: 'https://api.iconify.design/game-icons:rupee.svg', material: 'emerald' },
    { id: 'uncut_ruby', name: 'Uncut Ruby', description: 'A raw, uncut ruby. Could be cut with a chisel.', stackable: false, value: 200, iconUrl: 'https://api.iconify.design/game-icons:emerald.svg', material: 'uncut-ruby' },
    { id: 'ruby', name: 'Ruby', description: 'A deep red gemstone.', stackable: false, value: 400, iconUrl: 'https://api.iconify.design/game-icons:rupee.svg', material: 'ruby' },

    // Monster Drops & Crafting Materials
    { id: 'goblin_hide', name: 'Goblin Hide', description: 'Tough hide from a goblin.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:animal-hide.svg' },
    { id: 'rat_tail', name: 'Rat Tail', description: 'A grim trophy from a slain rodent.', stackable: true, value: 1, iconUrl: 'https://api.iconify.design/game-icons:rat.svg' },
    { id: 'spider_silk', name: 'Spider Silk', description: 'Tough, sticky silk from a giant spider.', stackable: false, value: 8, iconUrl: 'https://api.iconify.design/game-icons:spider-web.svg' },
    { id: 'wool', name: 'Wool', description: 'Raw, unspun wool from a sheep.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:fluffy-cloud.svg' },
    { id: 'ball_of_wool', name: 'Ball of Wool', description: 'A ball of fluffy wool, ready for crafting.', stackable: false, value: 3, iconUrl: 'https://api.iconify.design/game-icons:wool.svg' },
    { id: 'bones', name: 'Bones', description: 'A set of ordinary bones. Can be buried for Prayer experience.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:crossed-bones.svg', buryable: { prayerXp: 5 } },
    { id: 'big_bones', name: 'Big Bones', description: 'Larger bones from a tougher creature. Can be buried for Prayer experience.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:crossed-bones.svg', buryable: { prayerXp: 15 } },
    { id: 'eggs', name: 'Chicken Egg', description: 'A fresh egg. A simple cooking ingredient.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:egg-clutch.svg' },
    { id: 'cowhide', name: 'Cowhide', description: 'The unprocessed hide of a cow.', stackable: false, value: 6, iconUrl: 'https://api.iconify.design/game-icons:animal-hide.svg' },
    { id: 'leather', name: 'Leather', description: 'A piece of tanned leather, ready for crafting.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:animal-hide.svg', material: 'leather' },
    { id: 'thread', name: 'Thread', description: 'A spool of sturdy thread.', stackable: true, value: 1, iconUrl: 'https://api.iconify.design/game-icons:sewing-string.svg' },
    { id: 'flax', name: 'Flax', description: 'A plant that can be spun into a bow string.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:flax.svg' },
    { id: 'bow_string', name: 'Bow String', description: 'A string for a bow.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:whiplash.svg' },
    { id: 'rope', name: 'Rope', description: 'A sturdy length of rope.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:rope-coil.svg' },
    { id: 'harpy_feather', name: 'Harpy Feather', description: 'A large, sharp feather from a harpy. Could be used in fletching.', stackable: true, value: 50, iconUrl: 'https://api.iconify.design/game-icons:feather.svg', material: 'uncut-sapphire' },
    { id: 'golem_core', name: 'Golem Core', description: 'A faintly glowing stone that was the heart of a stone golem.', stackable: false, value: 500, iconUrl: 'https://api.iconify.design/game-icons:glowing-artifact.svg' },
    { id: 'straw', name: 'Straw', description: 'A bundle of dry straw. It smells faintly of hay and old magic.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:hay-bale.svg' },
    { id: 'boar_hide', name: 'Boar Hide', description: 'The tough, bristly hide of a wild boar.', stackable: false, value: 8, iconUrl: 'https://api.iconify.design/game-icons:animal-hide.svg' },
    { id: 'fey_dust', name: 'Fey Dust', description: 'A pinch of glittering, magical dust with a faint lavender scent.', stackable: false, value: 75, iconUrl: 'https://api.iconify.design/game-icons:glitter.svg' },
    { id: 'serpent_scale_dust', name: 'Serpent Scale Dust', description: 'Fine, iridescent dust ground from the scales of a powerful swamp serpent.', stackable: false, value: 150, iconUrl: 'https://api.iconify.design/game-icons:scales.svg' },
    { id: 'giant_crab_claw', name: 'Giant Crab Claw', description: 'A massive claw from a giant crab. It could probably take a finger off.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:crab-claw.svg' },
    { id: 'enchanted_bark', name: 'Enchanted Bark', description: 'Bark from a Feywood tree that hums with a faint magical energy.', stackable: false, value: 60, iconUrl: 'https://api.iconify.design/game-icons:bark-bundle.svg' },
    { id: 'brimstone', name: 'Brimstone', description: 'A chunk of yellow, sulfuric rock that is warm to the touch.', stackable: false, value: 180, iconUrl: 'https://api.iconify.design/game-icons:rock.svg', material: 'gold' },
];