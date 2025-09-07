

import { Item, SkillName } from '../../../types';
import { items as itemsA } from './a';
import { items as itemsB } from './b';
import { items as itemsC } from './c';
import { items as itemsD } from './d';
import { items as itemsE } from './e';
import { items as itemsF } from './f';
import { items as itemsG } from './g';
import { items as itemsH } from './h';
import { items as itemsI } from './i';
import { items as itemsK } from './k';
import { items as itemsL } from './l';
import { items as itemsM } from './m';
import { items as itemsN } from './n';
import { items as itemsO } from './o';
import { items as itemsP } from './p';
import { items as itemsR } from './r';
import { items as itemsS } from './s';
import { items as itemsT } from './t';
import { items as itemsU } from './u';
import { items as itemsV } from './v';
import { items as itemsW } from './w';
import { items as itemsY } from './y';
import { bronzeWarhammer } from '../bronze_warhammer';
import { ironWarhammer } from '../iron_warhammer';
import { steelWarhammer } from '../steel_warhammer';
import { battlemastersDraught } from '../battlemasters_draught';
import { spiketoadPotion } from '../spiketoad_potion';
import { spikedToadSkin } from '../spiked_toad_skin';

export const allItemsUnsorted: Item[] = [
    ...itemsA,
    ...itemsB,
    ...itemsC,
    ...itemsD,
    ...itemsE,
    ...itemsF,
    ...itemsG,
    ...itemsH,
    ...itemsI,
    ...itemsK,
    ...itemsL,
    ...itemsM,
    ...itemsN,
    ...itemsO,
    ...itemsP,
    ...itemsR,
    ...itemsS,
    ...itemsT,
    ...itemsU,
    ...itemsV,
    ...itemsW,
    ...itemsY,
    bronzeWarhammer,
    ironWarhammer,
    steelWarhammer,
    battlemastersDraught,
    spiketoadPotion,
    spikedToadSkin,
    // New Potions
    { id: 'mining_potion', name: 'Mining Potion', description: 'Temporarily boosts your Mining level.', stackable: false, value: 40, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Mining, value: 2, duration: 120000 }] }, potionEffect: { description: 'Boosts Mining by 2 for 2 minutes.' } },
    { id: 'weapon_poison_weak', name: 'Weapon Poison (Weak)', description: 'Applies a weak poison to your attacks for a short time.', stackable: false, value: 80, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { buffs: [{ type: 'poison_on_hit', value: 2, duration: 6000, chance: 0.2 }] }, potionEffect: { description: '20% chance on hit to poison for 2 damage over 6 seconds.' } },
    { id: 'woodcutting_potion', name: 'Woodcutting Potion', description: 'Temporarily boosts your Woodcutting level.', stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Woodcutting, value: 2, duration: 120000 }] }, potionEffect: { description: 'Boosts Woodcutting by 2 for 2 minutes.' } },
    { id: 'accuracy_potion', name: 'Accuracy Potion', description: 'Temporarily boosts your Melee accuracy.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { buffs: [{ type: 'accuracy_boost', value: 10, duration: 60000, style: 'melee' }] }, potionEffect: { description: 'Boosts Melee accuracy by 10% for 1 minute.' } },
    { id: 'fishing_potion', name: 'Fishing Potion', description: 'Temporarily boosts your Fishing level.', stackable: false, value: 60, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Fishing, value: 3, duration: 120000 }] }, potionEffect: { description: 'Boosts Fishing by 3 for 2 minutes.' } },
    { id: 'hunters_brew', name: 'Hunter\'s Brew', description: 'Temporarily boosts your Ranged level.', stackable: false, value: 120, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Ranged, value: 3, duration: 90000 }] }, potionEffect: { description: 'Boosts Ranged by 3 for 1.5 minutes.' } },
    { id: 'weapon_poison_strong', name: 'Weapon Poison (Strong)', description: 'Applies a potent poison to your attacks.', stackable: false, value: 250, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { buffs: [{ type: 'poison_on_hit', value: 4, duration: 8400, chance: 0.25 }] }, potionEffect: { description: '25% chance on hit to poison for 4 damage over 8.4 seconds.' } },
    { id: 'crafting_potion', name: 'Crafting Potion', description: 'Temporarily boosts your Crafting level.', stackable: false, value: 150, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Crafting, value: 3, duration: 120000 }] }, potionEffect: { description: 'Boosts Crafting by 3 for 2 minutes.' } },
    { id: 'sunfire_elixir', name: 'Sunfire Elixir', description: 'Your melee attacks deal a small amount of extra fire damage.', stackable: false, value: 300, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { buffs: [{ type: 'damage_on_hit', value: 2, duration: 60000, style: 'melee' }] }, potionEffect: { description: 'Deals 2 extra fire damage on melee hits for 1 minute.' } },
    { id: 'smithing_potion', name: 'Smithing Potion', description: 'Temporarily boosts your Smithing level.', stackable: false, value: 180, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Smithing, value: 3, duration: 120000 }] }, potionEffect: { description: 'Boosts Smithing by 3 for 2 minutes.' } },
    { id: 'combo_brew', name: 'Combo Brew', description: 'Temporarily boosts your Attack and Strength levels.', stackable: false, value: 350, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Attack, value: 2, duration: 90000 }, { skill: SkillName.Strength, value: 2, duration: 90000 }] }, potionEffect: { description: 'Boosts Attack and Strength by 2 for 1.5 minutes.' } },
    { id: 'fletching_potion', name: 'Fletching Potion', description: 'Temporarily boosts your Fletching level.', stackable: false, value: 320, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Fletching, value: 4, duration: 120000 }] }, potionEffect: { description: 'Boosts Fletching by 4 for 2 minutes.' } },
    { id: 'stamina_potion', name: 'Stamina Potion', description: 'Temporarily increases your attack speed.', stackable: false, value: 400, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { buffs: [{ type: 'attack_speed_boost', value: -1, duration: 30000, style: 'all' }] }, potionEffect: { description: 'Reduces your weapon attack speed by 1 tick for 30 seconds.' } },
    { id: 'super_ranged_potion', name: 'Super Ranged Potion', description: 'A powerful potion that boosts your Ranged level.', stackable: false, value: 450, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Ranged, value: 5, duration: 120000 }] }, potionEffect: { description: 'Boosts Ranged by 5 for 2 minutes.' } },
    { id: 'antifire_potion_weak', name: 'Antifire Potion (Weak)', description: 'Provides minor resistance to dragon fire.', stackable: false, value: 480, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', potionEffect: { description: 'Provides weak resistance to dragon fire.' } },
    { id: 'herblore_potion', name: 'Herblore Potion', description: 'Temporarily boosts your Herblore level.', stackable: false, value: 500, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Herblore, value: 4, duration: 120000 }] }, potionEffect: { description: 'Boosts Herblore by 4 for 2 minutes.' } },
    { id: 'overload_potion_weak', name: 'Overload Potion (Weak)', description: 'Boosts combat stats but damages you.', stackable: false, value: 800, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { healAmount: -10, statModifiers: [{ skill: SkillName.Attack, value: 3, duration: 120000 }, { skill: SkillName.Strength, value: 3, duration: 120000 }, { skill: SkillName.Defence, value: 3, duration: 120000 }] }, potionEffect: { description: 'Boosts combat stats by 3 for 2 minutes, but deals 10 damage.' } },
    { id: 'super_magic_potion', name: 'Super Magic Potion', description: 'A powerful potion that boosts your Magic level.', stackable: false, value: 700, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Magic, value: 5, duration: 120000 }] }, potionEffect: { description: 'Boosts Magic by 5 for 2 minutes.' } },
    { id: 'super_antipoison', name: 'Super Antipoison', description: 'Cures poison and provides temporary immunity.', stackable: false, value: 900, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { curesPoison: true, buffs: [{ type: 'poison_immunity', value: 1, duration: 120000 }] }, potionEffect: { description: 'Cures poison and grants immunity for 2 minutes.' } },
    { id: 'stone_skin_potion', name: 'Stone Skin Potion', description: 'A potion that hardens your skin, boosting Defence.', stackable: false, value: 1500, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'potion', consumable: { statModifiers: [{ skill: SkillName.Defence, value: 6, duration: 120000 }] }, potionEffect: { description: 'Boosts Defence by 6 for 2 minutes.' } },
];