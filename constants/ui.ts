

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
        case 'grimy-herb': return 'item-icon-grimy-herb';
        case 'clean-herb': return 'item-icon-clean-herb';
        case 'unfinished-potion': return 'item-icon-unfinished-potion';
        case 'potion': return 'item-icon-potion';
        default: return 'item-icon-default';
    }
};
