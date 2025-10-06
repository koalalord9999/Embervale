
import { useCallback } from 'react';
import { Spell, SkillName, InventorySlot, WeaponType } from '../types';
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
    isStunned: boolean;
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
    const { char, inv, addLog, navigation, ui, isStunned } = deps;

    const getRunesNeeded = useCallback((spell: Spell): {itemId: string, quantity: number}[] => {
        const equippedStaff = inv.equipment.weapon ? ITEMS[inv.equipment.weapon.itemId] : null;
        const providedRune = equippedStaff?.equipment?.weaponType === WeaponType.Staff ? equippedStaff.equipment.providesRune : null;
        return spell.runes.filter(r => r.itemId !== providedRune);
    }, [inv.equipment.weapon]);

    const onSpellOnItem = useCallback((spell: Spell, target: { item: InventorySlot, index: number }) => {
        ui.setSpellToCast(null);

        const isTargetValid = spell.targetItems?.includes(target.item.itemId) || spell.targetItems?.includes('all');
        if (!isTargetValid) {
            return;
        }

        const runesNeeded = getRunesNeeded(spell);
        if (!inv.hasItems(runesNeeded)) {
            addLog("You do not have enough runes to cast this spell.");
            return;
        }

        if (spell.type === 'utility-enchant') {
            const enchantedItemId = ENCHANTMENT_MAP[target.item.itemId];
            if (enchantedItemId) {
                runesNeeded.forEach(rune => inv.modifyItem(rune.itemId, -rune.quantity, true));
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
            
            runesNeeded.forEach(rune => inv.modifyItem(rune.itemId, -rune.quantity, true));
            char.addXp(SkillName.Magic, spell.xp);

            const coinValue = Math.floor(itemData.value * (spell.id === 'greater_transmutation' ? 0.85 : 0.4));
            inv.modifyItem(target.item.itemId, -1, true);
            inv.modifyItem('coins', coinValue, true);
            addLog(`You transmute the ${itemData.name} into ${coinValue} coins.`);
        }

    }, [char, inv, addLog, ui, getRunesNeeded]);

    const onCastSpell = useCallback((spell: Spell) => {
        if (isStunned) {
            addLog("You are stunned and cannot cast spells.");
            return;
        }
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
                ui.setIsSelectingAutocastSpell(false);
                return;
            } else {
                char.setAutocastSpell(spell);
                addLog(`Autocast spell set to: ${spell.name}.`);
                ui.setIsSelectingAutocastSpell(false);
                return;
            }
        }

        if (['combat', 'curse', 'enhancement'].includes(spell.type)) {
            if (ui.combatQueue.length > 0) {
                ui.setManualCastTrigger(spell);
                return;
            }
            if (spell.type === 'combat' || spell.type === 'curse') {
                addLog("You can only cast this spell in combat.");
                return;
            }
        }
        
        if (['utility-enchant', 'utility-alchemy', 'utility-processing'].includes(spell.type)) {
            if (!inv.hasItems(getRunesNeeded(spell))) {
                addLog("You do not have enough runes to cast this spell.");
                return;
            }
            addLog(`You begin to cast ${spell.name}... Select an item from your inventory.`);
            ui.setSpellToCast(spell);
            ui.setActivePanel('inventory');
            return;
        }

        const runesNeeded = getRunesNeeded(spell);
        if (!inv.hasItems(runesNeeded)) {
            addLog("You do not have enough runes to cast this spell.");
            return;
        }
    
        runesNeeded.forEach(rune => inv.modifyItem(rune.itemId, -rune.quantity, true));
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
        } else if (spell.type === 'enhancement') {
            let skillToBoost: SkillName;
            let baseStat = 0;
            if (spell.id === 'clarity_of_thought') {
                skillToBoost = SkillName.Attack;
                baseStat = char.skills.find(s => s.name === SkillName.Attack)?.level ?? 1;
            } else if (spell.id === 'arcane_strength') {
                skillToBoost = SkillName.Strength;
                baseStat = char.skills.find(s => s.name === SkillName.Strength)?.level ?? 1;
            } else {
                return;
            }
            // Logic matches super potions: 20% + 6
            const boostValue = Math.floor(baseStat * 0.20) + 6;
            if (boostValue > 0) {
                // Duration of 6 minutes
                char.applyStatModifier(skillToBoost, boostValue, 360000, baseStat);
            } else {
                addLog("The spell has no effect at your current level.");
            }
        } else {
            addLog(`You cast ${spell.name}.`);
        }
    
    }, [char, addLog, inv, navigation, ui, isStunned, getRunesNeeded]);

    return { onCastSpell, onSpellOnItem };
};
