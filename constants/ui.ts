

import { SkillName, Item } from '../types';

export const SKILL_ICONS: Record<SkillName, string> = {
    [SkillName.Attack]: 'https://api.iconify.design/game-icons:gladius.svg',
    [SkillName.Strength]: 'https://api.iconify.design/game-icons:biceps.svg',
    [SkillName.Defence]: 'https://api.iconify.design/game-icons:checked-shield.svg',
    [SkillName.Ranged]: 'https://api.iconify.design/game-icons:high-shot.svg',
    [SkillName.Magic]: 'https://api.iconify.design/game-icons:pointy-hat.svg',
    [SkillName.Hitpoints]: 'https://api.iconify.design/game-icons:hearts.svg',
    [SkillName.Prayer]: 'https://api.iconify.design/game-icons:polar-star.svg',
    [SkillName.Woodcutting]: 'https://api.iconify.design/game-icons:beech.svg',
    [SkillName.Fletching]: 'https://api.iconify.design/game-icons:whiplash.svg',
    [SkillName.Firemaking]: 'https://api.iconify.design/game-icons:campfire.svg',
    [SkillName.Fishing]: 'https://api.iconify.design/game-icons:fishing.svg',
    [SkillName.Cooking]: 'https://api.iconify.design/game-icons:cauldron.svg',
    [SkillName.Crafting]: 'https://api.iconify.design/game-icons:sewing-needle.svg',
    [SkillName.Mining]: 'https://api.iconify.design/game-icons:mining.svg',
    [SkillName.Smithing]: 'https://api.iconify.design/game-icons:anvil.svg',
    [SkillName.Herblore]: 'https://api.iconify.design/game-icons:three-leaves.svg',
    [SkillName.Runecrafting]: 'https://api.iconify.design/game-icons:rune-stone.svg',
    [SkillName.Slayer]: 'https://api.iconify.design/game-icons:william-tell-skull.svg',
    [SkillName.Thieving]: 'https://api.iconify.design/game-icons:domino-mask.svg',
    [SkillName.Agility]: 'https://api.iconify.design/game-icons:sprint.svg',
};

// FIX: Added SKILL_DISPLAY_ORDER constant for consistent skill display order across components.
export const SKILL_DISPLAY_ORDER: SkillName[] = [
    SkillName.Attack, SkillName.Hitpoints, SkillName.Mining,
    SkillName.Strength, SkillName.Prayer, SkillName.Smithing,
    SkillName.Defence, SkillName.Crafting, SkillName.Woodcutting,
    SkillName.Ranged, SkillName.Fletching, SkillName.Firemaking,
    SkillName.Magic, SkillName.Cooking, SkillName.Fishing,
    SkillName.Runecrafting, SkillName.Herblore, SkillName.Slayer,
    SkillName.Thieving, SkillName.Agility,
];

export const getIconClassName = (item?: Item | null): string => {
    if (!item) return 'item-icon-default';

    switch (item.material) {
        case 'bronze': return 'item-icon-bronze';
        case 'iron': return 'item-icon-iron';
        case 'steel': return 'item-icon-steel';
        case 'mithril': return 'item-icon-mithril';
        case 'adamantite': return 'item-icon-adamantite';
        case 'runic': return 'item-icon-runic';
        case 'aquatite': return 'item-icon-aquatite';
        case 'copper': return 'item-icon-copper';
        case 'tin': return 'item-icon-tin';
        case 'iron-ore': return 'item-icon-iron-ore';
        case 'mithril-ore': return 'item-icon-mithril-ore';
        case 'adamantite-ore': return 'item-icon-adamantite-ore';
        case 'titanium-ore': return 'item-icon-titanium-ore';
        case 'silver': return 'item-icon-silver';
        case 'coal': return 'item-icon-coal';
        case 'raw-fish': return 'item-icon-raw-fish';
        case 'raw-meat': return 'item-icon-raw-meat';
        case 'cooked-fish': return 'item-icon-cooked-fish';
        case 'cooked-meat': return 'item-icon-cooked-meat';
        case 'burnt': return 'item-icon-burnt';
        case 'sapphire': return 'item-icon-sapphire';
        case 'uncut-sapphire': return 'item-icon-uncut-sapphire';
        case 'emerald': return 'item-icon-emerald';
        case 'uncut-emerald': return 'item-icon-uncut-emerald';
        case 'ruby': return 'item-icon-ruby';
        case 'uncut-ruby': return 'item-icon-uncut-ruby';
        case 'diamond': return 'item-icon-diamond';
        case 'uncut-diamond': return 'item-icon-uncut-diamond';
        case 'sunstone': return 'item-icon-sunstone';
        case 'uncut-sunstone': return 'item-icon-uncut-sunstone';
        case 'tenebrite': return 'item-icon-tenebrite';
        case 'uncut-tenebrite': return 'item-icon-uncut-tenebrite';
        case 'leather': return 'item-icon-leather';
        case 'wizard-blue': return 'item-icon-wizard-blue';
        case 'gold': return 'item-icon-gold';
        case 'wood-normal': return 'item-icon-wood-normal';
        case 'wood-oak': return 'item-icon-wood-oak';
        case 'wood-willow': return 'item-icon-wood-willow';
        case 'wood-feywood': return 'item-icon-wood-feywood';
        case 'wood-yew': return 'item-icon-wood-yew';
        case 'wood-driftwood': return 'item-icon-wood-driftwood';
        case 'wood-mahogany': return 'item-icon-wood-mahogany';
        case 'grimy-herb': return 'item-icon-grimy-herb';
        case 'clean-herb': return 'item-icon-clean-herb';
        case 'unfinished-potion': return 'item-icon-unfinished-potion';
        case 'potion': return 'item-icon-potion';
        case 'vial': return 'item-icon-vial';
        case 'vial-water': return 'item-icon-vial-water';
        case 'potion-weak-attack': return 'item-icon-potion-weak-attack';
        case 'potion-attack': return 'item-icon-potion-attack';
        case 'potion-super-attack': return 'item-icon-potion-super-attack';
        case 'potion-weak-strength': return 'item-icon-potion-weak-strength';
        case 'potion-strength': return 'item-icon-potion-strength';
        case 'potion-super-strength': return 'item-icon-potion-super-strength';
        case 'potion-weak-defence': return 'item-icon-potion-weak-defence';
        case 'potion-defence': return 'item-icon-potion-defence';
        case 'potion-super-defence': return 'item-icon-potion-super-defence';
        case 'potion-weak-ranged': return 'item-icon-potion-weak-ranged';
        case 'potion-ranged': return 'item-icon-potion-ranged';
        case 'potion-super-ranged': return 'item-icon-potion-super-ranged';
        case 'potion-weak-magic': return 'item-icon-potion-weak-magic';
        case 'potion-magic': return 'item-icon-potion-magic';
        case 'potion-super-magic': return 'item-icon-potion-super-magic';
        case 'potion-antipoison': return 'item-icon-potion-antipoison';
        case 'potion-super-antipoison': return 'item-icon-potion-super-antipoison';
        case 'potion-poison': return 'item-icon-potion-poison';
        case 'potion-restore': return 'item-icon-potion-restore';
        case 'potion-prayer': return 'item-icon-potion-prayer';
        case 'potion-combo': return 'item-icon-potion-combo';
        case 'potion-weak-mining': return 'item-icon-potion-weak-mining';
        case 'potion-mining': return 'item-icon-potion-mining';
        case 'potion-weak-smithing': return 'item-icon-potion-weak-smithing';
        case 'potion-smithing': return 'item-icon-potion-smithing';
        case 'potion-weak-woodcutting': return 'item-icon-potion-weak-woodcutting';
        case 'potion-woodcutting': return 'item-icon-potion-woodcutting';
        case 'potion-weak-fletching': return 'item-icon-potion-weak-fletching';
        case 'potion-fletching': return 'item-icon-potion-fletching';
        case 'potion-weak-crafting': return 'item-icon-potion-weak-crafting';
        case 'potion-crafting': return 'item-icon-potion-crafting';
        case 'potion-weak-fishing': return 'item-icon-potion-weak-fishing';
        case 'potion-fishing': return 'item-icon-potion-fishing';
        case 'potion-weak-herblore': return 'item-icon-potion-weak-herblore';
        case 'potion-herblore': return 'item-icon-potion-herblore';
        case 'rune-gust': return 'item-icon-rune-gust';
        case 'rune-binding': return 'item-icon-rune-binding';
        case 'rune-stone': return 'item-icon-rune-stone';
        case 'rune-aqua': return 'item-icon-rune-aqua';
        case 'rune-ember': return 'item-icon-rune-ember';
        case 'rune-flux': return 'item-icon-rune-flux';
        case 'rune-verdant': return 'item-icon-rune-verdant';
        case 'rune-nexus': return 'item-icon-rune-nexus';
        case 'rune-hex': return 'item-icon-rune-hex';
        case 'rune-passage': return 'item-icon-rune-passage';
        case 'rune-anima': return 'item-icon-rune-anima';
        case 'rune-astral': return 'item-icon-rune-astral';
        case 'rune-aether': return 'item-icon-rune-aether';
        default: return 'item-icon-default';
    }
};

export const getSkillColorClass = (skillName: SkillName): string => {
    switch (skillName) {
        // Combat
        case SkillName.Attack: return 'bg-slate-300';
        case SkillName.Strength: return 'bg-[#c1a476]';
        case SkillName.Defence: return 'bg-blue-300';
        case SkillName.Hitpoints: return 'bg-red-500';
        case SkillName.Ranged: return 'bg-amber-700';
        case SkillName.Magic: return 'bg-sky-400';
        case SkillName.Prayer: return 'bg-sky-300';
        case SkillName.Slayer: return 'bg-slate-300';

        // Gathering
        case SkillName.Mining: return 'bg-slate-600';
        case SkillName.Fishing: return 'bg-blue-400';
        case SkillName.Woodcutting: return 'bg-lime-800';

        // Artisan
        case SkillName.Smithing: return 'bg-slate-700';
        case SkillName.Herblore: return 'bg-lime-500';
        case SkillName.Fletching: return 'bg-amber-200';
        case SkillName.Crafting: return 'bg-gray-400';
        case SkillName.Firemaking: return 'bg-orange-500';
        case SkillName.Cooking: return 'bg-gray-400';
        case SkillName.Runecrafting: return 'bg-indigo-500';

        // Support
        case SkillName.Agility: return 'bg-slate-500';
        case SkillName.Thieving: return 'bg-gray-600';

        default: return 'bg-gray-500';
    }
};