

import { SkillName, Item } from '../types';

export const SKILL_ICONS: Record<SkillName, string> = {
    [SkillName.Attack]: 'https://api.iconify.design/game-icons:sword-clash.svg',
    [SkillName.Strength]: 'https://api.iconify.design/game-icons:biceps.svg',
    [SkillName.Defence]: 'https://api.iconify.design/game-icons:shield.svg',
    [SkillName.Ranged]: 'https://api.iconify.design/game-icons:high-shot.svg',
    [SkillName.Magic]: 'https://api.iconify.design/game-icons:magic-swirl.svg',
    [SkillName.Hitpoints]: 'https://api.iconify.design/game-icons:health-normal.svg',
    [SkillName.Prayer]: 'https://api.iconify.design/game-icons:holy-symbol.svg',
    [SkillName.Woodcutting]: 'https://api.iconify.design/game-icons:wood-axe.svg',
    [SkillName.Fletching]: 'https://api.iconify.design/game-icons:whiplash.svg',
    [SkillName.Firemaking]: 'https://api.iconify.design/game-icons:campfire.svg',
    [SkillName.Fishing]: 'https://api.iconify.design/game-icons:fishing-pole.svg',
    [SkillName.Cooking]: 'https://api.iconify.design/game-icons:chef-toque.svg',
    [SkillName.Crafting]: 'https://api.iconify.design/game-icons:sewing-needle.svg',
    [SkillName.Mining]: 'https://api.iconify.design/game-icons:miner.svg',
    [SkillName.Smithing]: 'https://api.iconify.design/game-icons:anvil.svg',
    [SkillName.Herblore]: 'https://api.iconify.design/game-icons:apothecary.svg',
    [SkillName.Runecrafting]: 'https://api.iconify.design/game-icons:rune-stone.svg',
    [SkillName.Slayer]: 'https://api.iconify.design/game-icons:skull-crack.svg',
};

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
        case 'leather': return 'item-icon-leather';
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
        case 'potion-attack': return 'item-icon-potion-attack';
        case 'potion-strength': return 'item-icon-potion-strength';
        case 'potion-defence': return 'item-icon-potion-defence';
        case 'potion-ranged': return 'item-icon-potion-ranged';
        case 'potion-magic': return 'item-icon-potion-magic';
        case 'potion-super-attack': return 'item-icon-potion-super-attack';
        case 'potion-super-strength': return 'item-icon-potion-super-strength';
        case 'potion-super-defence': return 'item-icon-potion-super-defence';
        case 'potion-super-ranged': return 'item-icon-potion-super-ranged';
        case 'potion-super-magic': return 'item-icon-potion-super-magic';
        case 'potion-antipoison': return 'item-icon-potion-antipoison';
        case 'potion-super-antipoison': return 'item-icon-potion-super-antipoison';
        case 'potion-poison': return 'item-icon-potion-poison';
        case 'potion-restore': return 'item-icon-potion-restore';
        case 'potion-prayer': return 'item-icon-potion-prayer';
        case 'potion-combo': return 'item-icon-potion-combo';
        case 'potion-mining': return 'item-icon-potion-mining';
        case 'potion-smithing': return 'item-icon-potion-smithing';
        case 'potion-woodcutting': return 'item-icon-potion-woodcutting';
        case 'potion-fletching': return 'item-icon-potion-fletching';
        case 'potion-crafting': return 'item-icon-potion-crafting';
        case 'potion-fishing': return 'item-icon-potion-fishing';
        case 'potion-herblore': return 'item-icon-potion-herblore';
        default: return 'item-icon-default';
    }
};
