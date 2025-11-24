
import { Item, SkillName } from '../../types';
import { HERBS, HERBLORE_RECIPES } from '../herblore';

const getPotionMaterial = (potionId: string): Item['material'] => {
    // Weak potions
    if (potionId.startsWith('weak_')) {
        return `potion-${potionId.replace('_potion', '')}` as Item['material'];
    }
    // Super potions
    if (potionId.startsWith('super_')) {
        const base = potionId.replace('super_', '');
        return `potion-super-${base.replace('_potion', '')}` as Item['material'];
    }
    // Handle specific complex names first
    if (potionId.startsWith('weapon_poison')) return 'potion-poison';
    if (potionId.includes('antifire')) return 'potion-antifire';
    if (potionId.includes('stamina')) return 'potion-stamina';
    if (potionId.includes('combo')) return 'potion-combo';
    
    // Generic pattern for simple potions
    const match = potionId.match(/(\w+)_potion/);
    if (match && match[1]) {
        return `potion-${match[1]}` as Item['material'];
    }
    
    return 'potion'; // Default red
};

// This helper function creates consumable properties for potions
const getPotionEffect = (potionId: string): Item['consumable'] | undefined => {
    switch (potionId) {
        case 'weapon_poison_weak':
        case 'weapon_poison_strong':
        case 'weapon_poison_super':
            return undefined; // Weapon poisons are not directly consumable; they are used on items.
        case 'weak_attack_potion':
            return { statModifiers: [{ skill: SkillName.Attack, percent: 0.10, base: 2, duration: 180000 }] };
        case 'attack_potion':
            return { statModifiers: [{ skill: SkillName.Attack, percent: 0.15, base: 4, duration: 180000 }] };
        case 'super_attack_potion':
            return { statModifiers: [{ skill: SkillName.Attack, percent: 0.20, base: 6, duration: 300000 }] };
        case 'weak_strength_potion':
            return { statModifiers: [{ skill: SkillName.Strength, percent: 0.10, base: 2, duration: 180000 }] };
        case 'strength_potion':
            return { statModifiers: [{ skill: SkillName.Strength, percent: 0.15, base: 4, duration: 180000 }] };
        case 'super_strength_potion':
            return { statModifiers: [{ skill: SkillName.Strength, percent: 0.20, base: 6, duration: 300000 }] };
        case 'weak_defence_potion':
            return { statModifiers: [{ skill: SkillName.Defence, percent: 0.10, base: 2, duration: 180000 }] };
        case 'defence_potion':
            return { statModifiers: [{ skill: SkillName.Defence, percent: 0.15, base: 4, duration: 180000 }] };
        case 'super_defence_potion':
            return { statModifiers: [{ skill: SkillName.Defence, percent: 0.20, base: 6, duration: 300000 }] };
        case 'weak_ranged_potion':
            return { statModifiers: [{ skill: SkillName.Ranged, percent: 0.10, base: 2, duration: 180000 }] };
        case 'ranged_potion':
             return { statModifiers: [{ skill: SkillName.Ranged, percent: 0.15, base: 4, duration: 180000 }] };
        case 'super_ranged_potion':
             return { statModifiers: [{ skill: SkillName.Ranged, percent: 0.20, base: 6, duration: 300000 }] };
        case 'weak_magic_potion':
            return { statModifiers: [{ skill: SkillName.Magic, percent: 0.10, base: 2, duration: 180000 }] };
        case 'magic_potion':
             return { statModifiers: [{ skill: SkillName.Magic, percent: 0.15, base: 4, duration: 180000 }] };
        case 'super_magic_potion':
             return { statModifiers: [{ skill: SkillName.Magic, percent: 0.20, base: 6, duration: 300000 }] };
        
        // Skilling potions
        case 'weak_mining_potion':
            return { statModifiers: [{ skill: SkillName.Mining, percent: 0.10, base: 2, duration: 180000 }] };
        case 'mining_potion':
             return { statModifiers: [{ skill: SkillName.Mining, percent: 0.15, base: 4, duration: 180000 }] };
        case 'weak_woodcutting_potion':
            return { statModifiers: [{ skill: SkillName.Woodcutting, percent: 0.10, base: 2, duration: 180000 }] };
        case 'woodcutting_potion':
             return { statModifiers: [{ skill: SkillName.Woodcutting, percent: 0.15, base: 4, duration: 180000 }] };
        case 'weak_fishing_potion':
            return { statModifiers: [{ skill: SkillName.Fishing, percent: 0.10, base: 2, duration: 180000 }] };
        case 'fishing_potion':
             return { statModifiers: [{ skill: SkillName.Fishing, percent: 0.15, base: 4, duration: 180000 }] };
        case 'weak_crafting_potion':
            return { statModifiers: [{ skill: SkillName.Crafting, percent: 0.10, base: 2, duration: 180000 }] };
        case 'crafting_potion':
             return { statModifiers: [{ skill: SkillName.Crafting, percent: 0.15, base: 4, duration: 180000 }] };
        case 'weak_smithing_potion':
            return { statModifiers: [{ skill: SkillName.Smithing, percent: 0.10, base: 2, duration: 180000 }] };
        case 'smithing_potion':
             return { statModifiers: [{ skill: SkillName.Smithing, percent: 0.15, base: 4, duration: 180000 }] };
        case 'weak_fletching_potion':
            return { statModifiers: [{ skill: SkillName.Fletching, percent: 0.10, base: 2, duration: 180000 }] };
        case 'fletching_potion':
             return { statModifiers: [{ skill: SkillName.Fletching, percent: 0.15, base: 4, duration: 180000 }] };
        case 'weak_herblore_potion':
            return { statModifiers: [{ skill: SkillName.Herblore, percent: 0.10, base: 2, duration: 180000 }] };
        case 'herblore_potion':
             return { statModifiers: [{ skill: SkillName.Herblore, percent: 0.15, base: 4, duration: 180000 }] };

        // Other potions
        case 'prayer_potion':
            return { potionEffect: { description: 'Restores some Prayer points.'} };
        case 'stat_restore_potion':
            return { potionEffect: { description: 'Restores lowered combat stats.'} };
        case 'antipoison_potion':
             return { buffs: [{ type: 'poison_immunity', value: 1, duration: 180000 }], curesPoison: true };
        case 'super_antipoison':
             return { buffs: [{ type: 'poison_immunity', value: 1, duration: 360000 }], curesPoison: true };
        case 'accuracy_potion':
            return { buffs: [{ type: 'accuracy_boost', style: 'all', value: 10, duration: 180000 }] };
        case 'evasion_potion':
            return { buffs: [{ type: 'evasion_boost', value: 10, duration: 180000 }] };
        case 'sunfire_elixir':
            return { buffs: [{ type: 'damage_on_hit', style: 'melee', value: 2, duration: 180000 }] };
        case 'combo_brew':
             return { healAmount: 5, statModifiers: [ { skill: SkillName.Attack, percent: 0.05, base: 1, duration: 60000 }, { skill: SkillName.Strength, percent: 0.05, base: 1, duration: 60000 }, { skill: SkillName.Defence, percent: -0.05, base: -1, duration: 60000 } ] };
        case 'stamina_potion':
            return { potionEffect: { description: 'Restores run energy and reduces drain.'} };
        case 'hunters_brew':
             return { statModifiers: [{ skill: SkillName.Ranged, percent: 0.05, base: 1, duration: 180000 }, { skill: SkillName.Slayer, percent: 0.05, base: 1, duration: 180000 }] };
        case 'antifire_potion_weak':
            return { buffs: [{ type: 'antifire', value: 30, duration: 180000 }] };
        case 'antifire_potion':
             return { buffs: [{ type: 'antifire', value: 45, duration: 180000 }] };
        case 'extended_antifire':
             return { buffs: [{ type: 'antifire', value: 45, duration: 420000 }] };
        case 'overload_potion_weak':
             return { potionEffect: { description: 'A weak but dangerous combat potion.'} };
        case 'spiketoad_potion':
            return { buffs: [{ type: 'recoil', value: 10, duration: 300000 }] }; // 10% recoil
        case 'stone_skin_potion':
             return { buffs: [{ type: 'damage_reduction', value: 15, duration: 300000 }] };
        case 'battlemasters_draught':
            return { potionEffect: { description: 'A powerful and complex combat potion.'} };
        default:
            return {};
    }
};

const grimyHerbs: Item[] = HERBS.map(herb => {
    const herbName = herb.clean.replace('clean_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
        id: herb.grimy,
        name: `Grimy ${herbName}`,
        description: 'An unidentified herb covered in grime. Needs cleaning.',
        stackable: false,
        value: Math.max(1, Math.floor(herb.level * 0.5)),
        iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg',
        material: 'grimy-herb',
        cleanable: {
            cleanItemId: herb.clean,
            xp: herb.xp
        }
    };
});

const cleanHerbs: Item[] = HERBS.map(herb => {
    const name = herb.clean.replace('clean_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
        id: herb.clean,
        name: name,
        description: `A clean ${name.toLowerCase()}. Used in Herblore.`,
        stackable: false,
        value: herb.level * 2,
        iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg',
        material: 'clean-herb',
    };
});

const unfinishedPotions: Item[] = HERBLORE_RECIPES.unfinished.map(recipe => {
    const cleanHerb = cleanHerbs.find(h => h.id === recipe.cleanHerbId);
    const herbName = cleanHerb ? cleanHerb.name : 'Herb';
    return {
        id: recipe.unfinishedPotionId,
        name: `${herbName} potion (unf)`,
        description: `A vial of water with a ${herbName.toLowerCase()} added.`,
        stackable: false,
        value: (cleanHerb?.value ?? 5) + 2,
        iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg',
        material: 'unfinished-potion',
        emptyable: { emptyItemId: 'vial' },
    }
});

const finishedPotions: Item[] = HERBLORE_RECIPES.finished
    .filter(r => r.finishedPotionId !== 'anointing_oil')
    .map(recipe => {
    const name = recipe.finishedPotionId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const effect = getPotionEffect(recipe.finishedPotionId);
    let description = `A magical potion.`;
    if (effect?.potionEffect?.description) description = effect.potionEffect.description;
    else if (effect?.statModifiers) description = `Temporarily boosts ${effect.statModifiers[0].skill}.`;
    else if (effect?.buffs) description = `Grants a temporary buff.`;
    else if (recipe.finishedPotionId.includes('poison')) description = `A vial of deadly poison.`
    else if (recipe.finishedPotionId.includes('antipoison')) description = `Cures and prevents poison.`

    const isWeaponPoison = recipe.finishedPotionId.startsWith('weapon_poison');
    
    // Special handling for Pouch Cleanser
    if (recipe.finishedPotionId === 'pouch_cleanser') {
        return {
            id: recipe.finishedPotionId,
            name: name,
            stackable: false,
            description: 'A special herbal concoction that can clean grime off items. Has 25 charges.',
            value: 300,
            iconUrl: 'https://api.iconify.design/game-icons:potion-ball.svg',
            material: getPotionMaterial(recipe.finishedPotionId),
            charges: 25,
        };
    }

    return {
        id: recipe.finishedPotionId,
        name: name,
        description: description,
        stackable: false,
        value: recipe.level * 8,
        iconUrl: 'https://api.iconify.design/game-icons:potion-ball.svg',
        material: getPotionMaterial(recipe.finishedPotionId),
        consumable: effect,
        doseable: !isWeaponPoison,
        maxDoses: isWeaponPoison ? 1 : 4,
        initialDoses: isWeaponPoison ? 1 : 3,
        emptyable: { emptyItemId: 'vial' },
    }
});

export const herbloreItems: Item[] = [
    ...grimyHerbs,
    ...cleanHerbs,
    ...unfinishedPotions,
    ...finishedPotions
];
