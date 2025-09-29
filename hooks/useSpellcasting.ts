import { useCallback } from 'react';
import { Spell, SkillName, InventorySlot } from '../types';
import { useCharacter } from './useCharacter';
import { useInventory } from './useInventory';
import { useNavigation } from './useNavigation';
import { useUIState } from './useUIState';
import { ITEMS } from '../constants';

interface SpellcastingDependencies {
    char: ReturnType<typeof useCharacter>;
    inv: ReturnType<typeof useInventory>;
    addLog: (message: string) => void;
    navigation: ReturnType<typeof useNavigation>;
    ui: ReturnType<typeof useUIState>;
}

const ENCHANTMENT_MAP: Record<string, string> = {
    'sapphire_ring': 'ring_of_prospecting',
    'emerald_ring': 'ring_of_the_woodsman',
    'ruby_ring': 'ring_of_the_forge',
    'diamond_ring': 'ring_of_mastery',
    'sapphire_necklace': 'necklace_of_binding',
    'emerald_necklace': 'necklace_of_the_angler',
    'ruby_necklace': 'necklace_of_passage_ruby',
    'diamond_necklace': 'necklace_of_passage_diamond',
    'sapphire_amulet': 'amulet_of_magic',
    'emerald_amulet': 'amulet_of_ranging',
    'ruby_amulet': 'amulet_of_strength',
    'diamond_amulet': 'amulet_of_power'
};

export const useSpellcasting = (deps: SpellcastingDependencies) => {
    const { char, inv, addLog, navigation, ui } = deps;

    const onSpellOnItem = useCallback((spell: Spell, target: { item: InventorySlot, index: number }) => {
        ui.setSpellToCast(null);

        const isTargetValid = spell.targetItems?.includes(target.item.itemId) || spell.targetItems?.includes('all');
        if (!isTargetValid) {
            return;
        }

        if (!inv.hasItems(spell.runes)) {
            addLog("You do not have enough runes to cast this spell.");
            return;
        }

        if (spell.type === 'utility-enchant') {
            const enchantedItemId = ENCHANTMENT_MAP[target.item.itemId];
            if (enchantedItemId) {
                spell.runes.forEach(rune => inv.modifyItem(rune.itemId, -rune.quantity, true));
                char.addXp(SkillName.Magic, spell.xp);
                inv.modifyItem(target.item.itemId, -1, true);
                inv.modifyItem(enchantedItemId, 1, false, undefined, { bypassAutoBank: true });
                addLog(`You enchant the ${ITEMS[target.item.itemId].name}.`);
            } else {
                addLog(`You cannot enchant this item with ${spell.name}.`);
            }
        } else if (spell.type === 'utility-alchemy') {
            const itemData = ITEMS[target.item.itemId];
            if (!itemData || itemData.value === 0 || target.item.noted) {
                addLog("This item cannot be transmuted.");
                return;
            }
            
            spell.runes.forEach(rune => inv.modifyItem(rune.itemId, -rune.quantity, true));
            char.addXp(SkillName.Magic, spell.xp);

            const coinValue = Math.floor(itemData.value * (spell.id === 'greater_transmutation' ? 0.6 : 0.3));
            inv.modifyItem(target.item.itemId, -1, true);
            inv.modifyItem('coins', coinValue, true);
            addLog(`You transmute the ${itemData.name} into ${coinValue} coins.`);
        }

    }, [char, inv, addLog, ui]);

    const onCastSpell = useCallback((spell: Spell) => {
        if (ui.isBusy && spell.type !== 'utility-teleport') {
            addLog("You are busy.");
            return;
        }
        
        const magicLevel = char.skills.find(s => s.name === SkillName.Magic)?.currentLevel ?? 1;

        if (magicLevel < spell.level) {
            addLog(`You need a Magic level of ${spell.level} to cast this spell.`);
            return;
        }

        if (ui.isSelectingAutocastSpell) {
            if (!spell.autocastable || spell.type !== 'combat') {
                addLog("You can only autocast combat spells.");
                return;
            }
            const isCurrentlyAutocasting = char.autocastSpell?.id === spell.id;
            
            if (isCurrentlyAutocasting) {
                // User clicked the spell that is already selected. Just close the panel.
                ui.setIsSelectingAutocastSpell(false);
                return;
            } else {
                // User clicked a new spell (or had no spell selected). Set it.
                char.setAutocastSpell(spell);
                addLog(`Autocast spell set to: ${spell.name}.`);
                ui.setIsSelectingAutocastSpell(false);
                return;
            }
        }

        if (spell.type === 'combat') {
            if (ui.combatQueue.length === 0) {
                addLog("You can only cast this spell in combat.");
                return;
            }
            ui.setManualCastTrigger(spell);
            return;
        }
        
        if (['utility-enchant', 'utility-alchemy', 'utility-processing'].includes(spell.type)) {
            if (!inv.hasItems(spell.runes)) {
                addLog("You do not have enough runes to cast this spell.");
                return;
            }
            addLog(`You begin to cast ${spell.name}... Select an item from your inventory.`);
            ui.setSpellToCast(spell);
            ui.setActivePanel('inventory');
            return;
        }

        if (!inv.hasItems(spell.runes)) {
            addLog("You do not have enough runes to cast this spell.");
            return;
        }
    
        spell.runes.forEach(rune => inv.modifyItem(rune.itemId, -rune.quantity, true));
        char.addXp(SkillName.Magic, spell.xp);
    
        if (spell.type === 'utility-teleport') {
            let destinationPoiId = '';
            if (spell.id === 'meadowdale_teleport') destinationPoiId = 'meadowdale_square';
            if (spell.id === 'oakhaven_teleport') destinationPoiId = 'oakhaven_square';
            if (spell.id === 'silverhaven_teleport') destinationPoiId = 'silverhaven_square';
            
            if (destinationPoiId) {
                addLog(`You cast ${spell.name} and feel a pull...`);
                setTimeout(() => {
                    navigation.handleForcedNavigate(destinationPoiId);
                }, 500);
            }
        } else {
            addLog(`You cast ${spell.name}.`);
        }
    
    }, [char, addLog, inv, navigation, ui]);

    return { onCastSpell, onSpellOnItem };
};