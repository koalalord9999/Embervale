import { Item } from '../../../types';
import { sapphire } from '../sapphire';
import { serpentScales } from '../serpent_scales';
import { shears } from '../shears';
import { shortbow } from '../shortbow';
import { shortbowU } from '../shortbow_u';
import { silverBar } from '../silver_bar';
import { silverOre } from '../silver_ore';
import { sirensHair } from '../sirens_hair';
import { spiderSilk } from '../spider_silk';
import { spikedCape } from '../spiked_cape';
import { steelArrow } from '../steel_arrow';
import { steelArrowtips } from '../steel_arrowtips';
import { steelAxe } from '../steel_axe';
import { steelBar } from '../steel_bar';
import { steelBattleaxe } from '../steel_battleaxe';
import { steelDagger } from '../steel_dagger';
import { steelFullHelm } from '../steel_full_helm';
import { steelKiteshield } from '../steel_kiteshield';
import { steelMace } from '../steel_mace';
import { steelPlatebody } from '../steel_platebody';
import { steelPlatelegs } from '../steel_platelegs';
import { steelScimitar } from '../steel_scimitar';
import { steelSword } from '../steel_sword';
import { stolenCaravanGoods } from '../stolen_caravan_goods';
import { straw } from '../straw';
import { steelPickaxe } from '../steel_pickaxe';
import { slimyEggShells } from '../slimy_egg_shells';
import { serpentsEgg } from '../serpents_egg';
import { serpentOmeletCooked } from '../serpent_omelet_cooked';
import { serpentOmeletBurnt } from '../serpent_omelet_burnt';

export const items: Item[] = [
    sapphire,
    serpentOmeletBurnt,
    serpentOmeletCooked,
    serpentScales,
    serpentsEgg,
    shears,
    shortbow,
    shortbowU,
    silverBar,
    silverOre,
    sirensHair,
    slimyEggShells,
    spiderSilk,
    spikedCape,
    steelArrow,
    steelArrowtips,
    steelAxe,
    steelBar,
    steelBattleaxe,
    steelDagger,
    steelFullHelm,
    steelKiteshield,
    steelMace,
    steelPickaxe,
    steelPlatebody,
    steelPlatelegs,
    steelScimitar,
    steelSword,
    stolenCaravanGoods,
    straw,
    // Herblore Secondaries
    { id: 'spider_eggs', name: 'Spider Eggs', description: 'A clutch of spider eggs.', stackable: true, value: 5, iconUrl: 'https://api.iconify.design/game-icons:spider-alt.svg' },
    { id: 'boar_tusk', name: 'Boar Tusk', description: 'A sharp tusk from a wild boar.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:boar-tusk.svg' },
    { id: 'golem_core_shard', name: 'Golem Core Shard', description: 'A glowing shard from a golem.', stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:crystal-shard.svg' },
    { id: 'redwater_kelp', name: 'Redwater Kelp', description: 'A strange, magical kelp that grows in reddish water.', stackable: true, value: 20, iconUrl: 'https://api.iconify.design/game-icons:seaweed.svg' },
    { id: 'consecrated_dust', name: 'Consecrated Dust', description: 'A pinch of shimmering, holy dust.', stackable: true, value: 80, iconUrl: 'https://api.iconify.design/game-icons:glitter.svg' },
    { id: 'glimmerhorn_dust', name: 'Glimmerhorn Dust', description: 'The ground-up horn of a mystical beast.', stackable: true, value: 30, iconUrl: 'https://api.iconify.design/game-icons:powder.svg' },
    { id: 'cave_slime_globule', name: 'Cave Slime Globule', description: 'A viscous globule from a cave slime.', stackable: true, value: 10, iconUrl: 'https://api.iconify.design/game-icons:gooey-molecule.svg' },
    { id: 'bloodroot_tendril', name: 'Bloodroot Tendril', description: 'A strange, gnarled root that bleeds red.', stackable: false, value: 40, iconUrl: 'https://api.iconify.design/game-icons:root-tip.svg' },
    { id: 'frost_berries', name: 'Frost Berries', description: 'Pale berries, cold to the touch.', stackable: true, value: 25, iconUrl: 'https://api.iconify.design/game-icons:berries-bowl.svg' },
    { id: 'wyrmscale_dust', name: 'Wyrmscale Dust', description: 'Dust from a wyrm\'s scale. It feels warm.', stackable: true, value: 150, iconUrl: 'https://api.iconify.design/game-icons:scales.svg' },
];