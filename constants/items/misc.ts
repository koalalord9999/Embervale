import { Item, EquipmentSlot, WeaponType } from '../../types';

export const misc: Item[] = [
    // Currency
    { id: 'coins', name: 'Coins', description: 'Shiny gold coins.', stackable: true, value: 1, iconUrl: 'https://api.iconify.design/game-icons:coins.svg' },
    { id: 'beer_glass', name: 'Beer Glass', description: 'An empty beer glass.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:beer-stein.svg' },
    
    // Quest & Key Items
    { id: 'rusty_iron_sword', name: 'Rusty Iron Sword', description: 'An old, corroded sword. It feels strangely balanced despite the rust.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:broken-sword.svg', equipment: { slot: EquipmentSlot.Weapon, stabAttack: 1, slashAttack: 1, crushAttack: -2, rangedAttack: 0, magicAttack: 0, stabDefence: 0, slashDefence: 0, crushDefence: 0, rangedDefence: 0, magicDefence: 0, strengthBonus: 1, rangedStrength: 0, magicDamageBonus: 0, weaponType: WeaponType.Sword, speed: 3 }, material: 'iron' },
    { id: 'lost_heirloom', name: 'Lost Heirloom', description: 'An old but beautifully crafted silver necklace. It looks like it would be very important to someone.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:necklace.svg' },
    { id: 'stolen_caravan_goods', name: 'Stolen Caravan Goods', description: 'A crate of valuable goods, stolen from a Silverhaven merchant.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:crate.svg' },
    { id: 'strange_key_loop', name: 'Strange Key Loop', description: 'Half of a strange, ancient key.', stackable: false, value: 1000, iconUrl: 'https://api.iconify.design/game-icons:key-ring.svg' },
    { id: 'strange_key_tooth', name: 'Strange Key Tooth', description: 'The other half of a strange, ancient key.', stackable: false, value: 1000, iconUrl: 'https://api.iconify.design/game-icons:old-key.svg' },
    { id: 'strange_key', name: 'Strange Key', description: 'A key pulsating with a faint energy. It must unlock something important.', stackable: false, value: 2500, iconUrl: 'https://api.iconify.design/game-icons:key-in-lock.svg' },
    { id: 'ancient_gear', name: 'Ancient Gear', description: 'A strange, intricate gear from an ancient sentinel. It hums with a faint power.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:gear-hammer.svg' },
    { id: 'sirens_hair', name: "Siren's Hair", description: 'A lock of long, beautiful hair that seems to shimmer with its own light. It hums a faint, enchanting melody.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:long-hair.svg' },
    { id: 'slimy_egg_shells', name: 'Slimy Egg Shells', description: 'Fragments of a large, leathery egg. They are covered in swamp slime.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:cracked-egg.svg' },
    { id: 'serpents_egg', name: "Serpent's Egg", description: 'A large, leathery egg, surprisingly intact. It feels warm to the touch.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:dinosaur-egg.svg' },
    { id: 'tinderbox', name: 'Tinderbox', description: 'Used to light fires.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:matchbox.svg' },
    {
        id: 'treasure_chest',
        name: 'Treasure Chest',
        description: 'A waterlogged chest, sealed tight. Opening it might reveal valuable treasures.',
        stackable: false,
        value: 500,
        iconUrl: 'https://api.iconify.design/game-icons:treasure-chest.svg',
        consumable: {
            special: 'treasure_chest'
        }
    },
    { id: 'goblin_champion_scroll', name: 'Goblin Champion Scroll', description: 'A rare scroll dropped by a goblin champion. A sign of great prowess.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:scroll-unfurled.svg' },
    
    // Pouches
    { id: 'grimy_coin_pouch', name: 'Grimy Coin Pouch', description: "A small, dirty pouch that jingles slightly. It's too grimy to open by hand.", stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:money-stack.svg' },
    { id: 'clean_coin_pouch', name: 'Clean Coin Pouch', description: 'A clean pouch, ready to be opened.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:money-stack.svg', consumable: { givesCoins: { min: 20, max: 150 } } },
    
    // Fletching Components
    { id: 'arrow_shaft', name: 'Arrow Shaft', description: 'A straight, headless arrow shaft.', stackable: true, value: 1, iconUrl: 'https://api.iconify.design/mdi:arrow-top-left.svg', material: 'wood-normal' },
    { id: 'headless_arrow', name: 'Headless Arrow', description: 'An arrow shaft with feathers attached. It just needs a tip.', stackable: true, value: 1, iconUrl: 'https://api.iconify.design/game-icons:arrow-flights.svg', material: 'wood-normal' },
    { id: 'bronze_arrowtips', name: 'Bronze Arrowtips', description: 'Bronze shaped and pounded into a point, ready to be attached to arrows.', stackable: true, value: 10, iconUrl: 'https://api.iconify.design/game-icons:arrowhead.svg', material: 'bronze' },
    { id: 'iron_arrowtips', name: 'Iron Arrowtips', description: 'Iron shaped and pounded into a point, ready to be attached to arrows.', stackable: true, value: 15, iconUrl: 'https://api.iconify.design/game-icons:arrowhead.svg', material: 'iron' },
    { id: 'steel_arrowtips', name: 'Steel Arrowtips', description: 'Steel shaped and pounded into a point, ready to be attached to arrows.', stackable: true, value: 20, iconUrl: 'https://api.iconify.design/game-icons:arrowhead.svg', material: 'steel' },
    { id: 'mithril_arrowtips', name: 'Mithril Arrowtips', description: 'Mithril shaped and pounded into a point, ready to be attached to arrows.', stackable: true, value: 40, iconUrl: 'https://api.iconify.design/game-icons:arrowhead.svg', material: 'mithril' },
    { id: 'adamantite_arrowtips', name: 'Adamantite Arrowtips', description: 'Adamantite shaped and pounded into a point, ready to be attached to arrows.', stackable: true, value: 160, iconUrl: 'https://api.iconify.design/game-icons:arrowhead.svg', material: 'adamantite' },
    { id: 'runic_arrowtips', name: 'Runic Arrowtips', description: 'Runic metal shaped and pounded into a point, ready to be attached to arrows.', stackable: true, value: 400, iconUrl: 'https://api.iconify.design/game-icons:arrowhead.svg', material: 'runic' },
    { id: 'shortbow_u', name: 'Shortbow (u)', description: 'An unstrung shortbow. It needs a bow string.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:bow-arrow.svg', material: 'wood-normal' },
    { id: 'longbow_u', name: 'Longbow (u)', description: 'An unstrung longbow. It needs a bow string.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:long-bow.svg', material: 'wood-normal' },
    { id: 'oak_shortbow_u', name: 'Oak Shortbow (u)', description: 'An unstrung oak shortbow.', stackable: false, value: 30, iconUrl: 'https://api.iconify.design/game-icons:bow-arrow.svg', material: 'wood-oak' },
    { id: 'oak_longbow_u', name: 'Oak Longbow (u)', description: 'An unstrung oak longbow.', stackable: false, value: 40, iconUrl: 'https://api.iconify.design/game-icons:long-bow.svg', material: 'wood-oak' },
    { id: 'willow_shortbow_u', name: 'Willow Shortbow (u)', description: 'An unstrung willow shortbow.', stackable: false, value: 60, iconUrl: 'https://api.iconify.design/game-icons:bow-arrow.svg', material: 'wood-willow' },
    { id: 'willow_longbow_u', name: 'Willow Longbow (u)', description: 'An unstrung willow longbow.', stackable: false, value: 80, iconUrl: 'https://api.iconify.design/game-icons:long-bow.svg', material: 'wood-willow' },
    { id: 'feywood_shortbow_u', name: 'Feywood Shortbow (u)', description: 'An unstrung shortbow made from magical feywood.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:bow-arrow.svg', material: 'wood-feywood' },
    { id: 'feywood_longbow_u', name: 'Feywood Longbow (u)', description: 'An unstrung longbow made from magical feywood.', stackable: false, value: 120, iconUrl: 'https://api.iconify.design/game-icons:long-bow.svg', material: 'wood-feywood' },
    { id: 'yew_shortbow_u', name: 'Yew Shortbow (u)', description: 'An unstrung yew shortbow.', stackable: false, value: 150, iconUrl: 'https://api.iconify.design/game-icons:bow-arrow.svg', material: 'wood-yew' },
    { id: 'yew_longbow_u', name: 'Yew Longbow (u)', description: 'An unstrung yew longbow.', stackable: false, value: 200, iconUrl: 'https://api.iconify.design/game-icons:long-bow.svg', material: 'wood-yew' },
    { id: 'silver_amulet_u', name: 'Silver Amulet (u)', description: 'An unstrung silver amulet. It needs a string.', stackable: false, value: 780, iconUrl: 'https://api.iconify.design/game-icons:gem-pendant.svg', material: 'silver' },

    // Herblore Items
    { id: 'pestle_and_mortar', name: 'Pestle and Mortar', description: 'Used to grind ingredients for Herblore.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:mortar.svg' },
    { id: 'pouch_cleanser', name: 'Pouch Cleanser', description: 'A special herbal concoction that can clean grime off items. Has 25 charges.', stackable: true, value: 300, iconUrl: 'https://api.iconify.design/game-icons:potion-ball.svg', charges: 25 },
    // Herblore Secondaries
    { id: 'spider_eggs', name: 'Spider Eggs', description: 'A clutch of spider eggs.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:spider-alt.svg' },
    { id: 'boar_tusk', name: 'Boar Tusk', description: 'A sharp tusk from a wild boar.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:boar-tusk.svg' },
    { id: 'golem_core_shard', name: 'Golem Core Shard', description: 'A glowing shard from a golem. Can be created by smashing a Golem Core.', stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:crystal-shard.svg' },
    { id: 'redwater_kelp', name: 'Redwater Kelp', description: 'A strange, magical kelp that grows in reddish water.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:seaweed.svg' },
    { id: 'consecrated_dust', name: 'Consecrated Dust', description: 'A pinch of shimmering, holy dust.', stackable: false, value: 80, iconUrl: 'https://api.iconify.design/game-icons:glitter.svg' },
    { id: 'glimmerhorn_dust', name: 'Glimmerhorn Dust', description: 'The ground-up antler of a mystical beast.', stackable: false, value: 30, iconUrl: 'https://api.iconify.design/game-icons:powder.svg' },
    { id: 'cave_slime_globule', name: 'Cave Slime Globule', description: 'A viscous globule from a cave slime.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:gooey-molecule.svg' },
    { id: 'bloodroot_tendril', name: 'Bloodroot Tendril', description: 'A strange, gnarled root that bleeds red.', stackable: false, value: 40, iconUrl: 'https://api.iconify.design/game-icons:root-tip.svg' },
    { id: 'frost_berries', name: 'Frost Berries', description: 'Pale berries, cold to the touch.', stackable: false, value: 25, iconUrl: 'https://api.iconify.design/game-icons:berries-bowl.svg' },
    { id: 'wyrmscale_dust', name: "Wyrmscale Dust", description: 'Dust from a wyrm\'s scale. It feels warm.', stackable: false, value: 150, iconUrl: 'https://api.iconify.design/game-icons:powder.svg' },
    { id: 'spiked_toad_skin', name: 'Spiked Toad Skin', description: 'The tough, warty skin of a giant toad, covered in sharp barbs.', stackable: false, value: 70, iconUrl: 'https://api.iconify.design/game-icons:animal-hide.svg' },
    { id: 'unicorn_horn_dust', name: 'Unicorn Horn Dust', description: 'The ground-up horn of a unicorn. It has potent anti-poison properties.', stackable: false, value: 250, iconUrl: 'https://api.iconify.design/game-icons:powder.svg' },
    // New Non-Dust Items
    { id: 'glimmerhorn_antler', name: 'Glimmerhorn Antler', description: 'A mystical antler from a Glimmerhorn Stag. Can be ground into dust.', stackable: false, value: 25, iconUrl: 'https://api.iconify.design/game-icons:antler.svg' },
    { id: 'serpent_scale', name: 'Serpent Scale', description: 'A tough, iridescent scale from a Bog Serpent. Can be ground into dust.', stackable: false, value: 120, iconUrl: 'https://api.iconify.design/game-icons:scales.svg' },
    { id: 'unicorn_horn', name: 'Unicorn Horn', description: 'The horn of a unicorn. It has potent anti-poison properties. Can be ground into dust.', stackable: false, value: 200, iconUrl: 'https://api.iconify.design/game-icons:horn-call.svg' },
    { id: 'wyrmscale', name: 'Wyrmscale', description: "A thick scale from a powerful wyrm. It feels warm. Can be ground into dust.", stackable: false, value: 120, iconUrl: 'https://api.iconify.design/game-icons:scales.svg' },
];
