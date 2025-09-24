import React, { useMemo } from 'react';
import { Spell, PlayerSkill, SkillName, InventorySlot } from '../../types';
import { SPELLS, ITEMS, getIconClassName } from '../../constants';
import { TooltipState, useUIState } from '../../hooks/useUIState';
import { useCharacter } from '../../hooks/useCharacter';

interface SpellbookPanelProps {
    skills: (PlayerSkill & { currentLevel: number; })[];
    inventory: (InventorySlot | null)[];
    onCastSpell: (spell: Spell) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    autocastSpell: Spell | null;
    ui: ReturnType<typeof useUIState>;
}

const getSpellIconUrl = (spell: Spell): string => {
    if (spell.type === 'combat') {
        if (spell.id.includes('_dart')) return 'https://api.iconify.design/game-icons:wind-slap.svg';
        if (spell.id.includes('_bolt')) return 'https://api.iconify.design/game-icons:swirl-ring.svg';
        if (spell.id.includes('_blast')) return 'https://api.iconify.design/game-icons:cloudy-fork.svg';
        if (spell.id.includes('_wave')) return 'https://api.iconify.design/game-icons:entangled-typhoon.svg';
        if (spell.id.includes('_storm')) return 'https://api.iconify.design/game-icons:tornado.svg';
    }
    switch (spell.type) {
        case 'utility-teleport': return 'https://api.iconify.design/game-icons:portal.svg';
        case 'utility-enchant': return 'https://api.iconify.design/game-icons:glowing-hands.svg';
        case 'utility-alchemy': return 'https://api.iconify.design/game-icons:shiny-purse.svg';
        case 'utility-processing': return 'https://api.iconify.design/game-icons:fission.svg';
        case 'curse': return 'https://api.iconify.design/game-icons:slalom.svg';
        case 'enhancement': return 'https://api.iconify.design/game-icons:aura.svg';
        default: return 'https://api.iconify.design/game-icons:book.svg';
    }
};

const getSpellIconClassName = (spell: Spell): string => {
    // Combat spells are colored by their element
    if (spell.type === 'combat' && spell.element) {
        const elementToMaterialSuffix: Record<string, string> = {
            'wind': 'rune-gust',
            'water': 'rune-aqua',
            'earth': 'rune-stone',
            'fire': 'rune-ember',
        };
        const material = elementToMaterialSuffix[spell.element];
        if (material) {
            return `item-icon-${material}`;
        }
    }

    // Teleport spells are purple
    if (spell.type === 'utility-teleport') {
        return 'item-icon-rune-binding';
    }
    
    // Enchant spells are colored by their gem
    if (spell.type === 'utility-enchant') {
        if (spell.id.includes('sapphire')) return 'item-icon-uncut-sapphire';
        if (spell.id.includes('emerald')) return 'item-icon-uncut-emerald';
        if (spell.id.includes('ruby')) return 'item-icon-uncut-ruby';
        if (spell.id.includes('diamond')) return 'item-icon-uncut-diamond';
    }

    // Transmutation spells are colored like emeralds
    if (spell.type === 'utility-alchemy') {
        if (spell.id === 'lesser_transmutation') return 'item-icon-uncut-emerald';
        if (spell.id === 'greater_transmutation') return 'item-icon-emerald';
    }
    
    // Superheat Ore
    if (spell.id === 'superheat_ore') {
        return 'item-icon-rune-ember';
    }
    
    // Curse spells are colored by their effect
    if (spell.type === 'curse') {
        if (spell.id === 'weaken') return 'item-icon-uncut-ruby'; // Attack
        if (spell.id === 'enfeeble') return 'item-icon-uncut-emerald'; // Strength
        if (spell.id === 'vulnerability') return 'item-icon-uncut-sapphire'; // Defence
    }

    // Enhancement spells - Use cut gem colors
    if (spell.type === 'enhancement') {
        if (spell.id === 'clarity_of_thought') return 'item-icon-sapphire'; // Intellect/Magic
        if (spell.id === 'arcane_strength') return 'item-icon-ruby'; // Power/Strength
    }
    
    // Fallback for all other spells
    return 'filter invert';
};

const SpellbookPanel: React.FC<SpellbookPanelProps> = ({ skills, inventory, onCastSpell, setTooltip, autocastSpell, ui }) => {
    const magicLevel = skills.find(s => s.name === SkillName.Magic)?.currentLevel ?? 1;

    const spellsToDisplay = useMemo(() => {
        const sorted = [...SPELLS].sort((a, b) => a.level - b.level);
        if (ui.isSelectingAutocastSpell) {
            return sorted.filter(spell => spell.autocastable && spell.type === 'combat');
        }
        return sorted;
    }, [ui.isSelectingAutocastSpell]);

    const renderSpell = (spell: Spell) => {
        const isAutocasting = autocastSpell?.id === spell.id;

        const handleMouseEnter = (e: React.MouseEvent) => {
            const hasRequiredLevel = magicLevel >= spell.level;
            const levelColor = hasRequiredLevel ? 'text-green-400' : 'text-red-400';

            const runeList = spell.runes.map(r => {
                const runeItem = ITEMS[r.itemId];
                const playerHas = inventory.reduce((acc, slot) => slot?.itemId === r.itemId ? acc + slot.quantity : acc, 0);
                const color = playerHas >= r.quantity ? 'text-green-400' : 'text-red-400';
                return `<li class="${color}">${r.quantity} x ${runeItem.name}</li>`;
            }).join('');

            setTooltip({
                content: (
                    <div className="text-left w-48">
                        <p className="font-bold text-yellow-300">{spell.name}</p>
                        <p className={`text-sm italic mb-2 ${levelColor}`}>Lvl {spell.level} Magic</p>
                        <p className="text-sm text-gray-300 mb-2">{spell.description}</p>
                        <ul className="text-xs list-disc list-inside" dangerouslySetInnerHTML={{ __html: runeList }} />
                    </div>
                ),
                position: { x: e.clientX, y: e.clientY }
            });
        };

        return (
            <button
                key={spell.id}
                onClick={() => onCastSpell(spell)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setTooltip(null)}
                className={`w-full aspect-square rounded-md transition-colors flex items-center justify-center text-center ${isAutocasting ? 'ring-2 ring-blue-400' : 'hover:bg-gray-700/20'}`}
            >
                <img src={getSpellIconUrl(spell)} alt={spell.name} className={`w-full h-full p-1 ${getSpellIconClassName(spell)}`} />
            </button>
        );
    };
    
    return (
        <div className="flex flex-col h-full text-gray-300">
            <h3 className="text-lg font-bold text-center mb-2 text-yellow-400">{ui.isSelectingAutocastSpell ? 'Select Autocast Spell' : 'Spellbook'}</h3>
            <div className="flex-grow overflow-y-auto pr-1">
                <div className="grid grid-cols-5 gap-2">
                    {spellsToDisplay.map(renderSpell)}
                </div>
            </div>
        </div>
    );
};

export default SpellbookPanel;