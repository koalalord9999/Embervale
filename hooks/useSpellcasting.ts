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
    combatSpeedMultiplier: number;
    // FIX: Add setIsResting to dependencies
    setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
}

const ENCHANTMENT_MAP: Record<string, string> = {
    'sapphire_ring': 'ring_of_prospecting',
    'emerald_ring': 'ring_of_the_woodsman',
    'ruby_ring': 'ring_of_the_forge',
    'diamond_ring': 'ring_of_mastery',
    'sunstone_ring': 'ring_of_greed',
    'sapphire_necklace': 'necklace_of_binding',
    'emerald_necklace': 'necklace_of_the_angler',
    'ruby_necklace': 'necklace_of_pyromancy',
    'diamond_necklace': 'necklace_of_shadows',
    'sunstone_necklace': 'necklace_of_fortune',
    'sapphire_amulet': 'amulet_of_magic',
    'emerald_amulet': 'amulet_of_ranging',
    'ruby_amulet': 'amulet_of_strength',
    'diamond_amulet': 'amulet_of_power',
    'sunstone_amulet': 'amulet_of_fate'
};

export const useSpellcasting = (deps: SpellcastingDependencies) => {
    // FIX: Destructure setIsResting from dependencies
    const { char, inv, addLog, navigation, ui, isStunned, combatSpeedMultiplier, setIsResting } = deps;

    const getRunesNeeded = useCallback((spell: Spell): {itemId: string, quantity: number}[] => {
        const equippedStaff = inv.equipment.weapon ? ITEMS[inv.equipment.weapon.itemId] : null;
        const providedRune = equippedStaff?.equipment?.weaponType === WeaponType.Staff ? equippedStaff.equipment.providesRune : null;
        return spell.runes.filter(r => r.itemId !== providedRune);
    }, [inv.equipment.weapon]);

    // Note: This function is primarily handled by useSpellActions for inventory interactions.
    // We keep it here for completeness if called directly, but ensure it respects cooldowns if used.
    const onSpellOnItem = useCallback((spell: Spell, target: { item: InventorySlot, index: number }) => {
        setIsResting(false);
        if (Date.now() < char.globalActionCooldown) {
             return;
        }

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
                inv.modifyItem(enchantedItemId, 1, false, { bypassAutoBank: true });
                addLog(`You enchant the ${ITEMS[target.item.itemId].name}.`);
                
                const tickMs = 600;
                const cooldownMs = (spell.castTime ?? 5) * tickMs;
                char.setGlobalActionCooldown(Date.now() + cooldownMs);
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

            const coinValue = Math.floor(itemData.value * (spell.id === 'greater_transmutation' ? 0.7 : 0.3));
            
            inv.modifyItem(target.item.itemId, -1, true, { noted: target.item.noted });
            inv.modifyItem('coins', coinValue, true);
            addLog(`You transmute the ${itemData.name} into ${coinValue} coins.`);
            
            const tickMs = 600;
            const cooldownMs = (spell.castTime ?? 5) * tickMs;
            char.setGlobalActionCooldown(Date.now() + cooldownMs);
        }

    }, [char, inv, addLog, ui, getRunesNeeded, setIsResting]);

    const onCastSpell = useCallback((spell: Spell) => {
        if (isStunned) {
            addLog("You are stunned and cannot cast spells.");
            return;
        }
        
        // Check global cooldown
        if (Date.now() < char.globalActionCooldown) {
             return;
        }

        if (!ui.isSelectingAutocastSpell) {
            setIsResting(false);
        }

        // Check if enhancement buff is already active
        if (spell.type === 'enhancement') {
            if (char.activeBuffs.some(b => b.source === spell.id)) {
                addLog("That spell is already active.");
                return;
            }
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
    
        // Set Cooldown using fixed tick time (600ms)
        const tickMs = 600;
        const cooldownMs = (spell.castTime ?? 5) * tickMs;
        char.setGlobalActionCooldown(Date.now() + cooldownMs);

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
            const duration = 300000; // 5 minutes
            
            // Use applySpellStatBuff instead of applyStatModifier for invisible buffs, passing spell.id as source
            if (spell.id === 'warriors_grace') {
                const attLevel = char.skills.find(s => s.name === SkillName.Attack)?.level ?? 1;
                const strLevel = char.skills.find(s => s.name === SkillName.Strength)?.level ?? 1;
                const defLevel = char.skills.find(s => s.name === SkillName.Defence)?.level ?? 1;
                
                char.applySpellStatBuff(SkillName.Attack, Math.floor(attLevel * 0.10) + 2, duration, spell.id);
                char.applySpellStatBuff(SkillName.Strength, Math.floor(strLevel * 0.10) + 2, duration, spell.id);
                char.applySpellStatBuff(SkillName.Defence, Math.floor(defLevel * 0.10) + 2, duration, spell.id);
                addLog("You feel a surge of martial prowess.");
            } else if (spell.id === 'archers_focus') {
                const rngLevel = char.skills.find(s => s.name === SkillName.Ranged)?.level ?? 1;
                const defLevel = char.skills.find(s => s.name === SkillName.Defence)?.level ?? 1;

                char.applySpellStatBuff(SkillName.Ranged, Math.floor(rngLevel * 0.10) + 2, duration, spell.id);
                char.applySpellStatBuff(SkillName.Defence, Math.floor(defLevel * 0.10) + 2, duration, spell.id);
                addLog("Your senses sharpen.");
            } else if (spell.id === 'mystic_insight') {
                const magLevel = char.skills.find(s => s.name === SkillName.Magic)?.level ?? 1;
                char.applySpellStatBuff(SkillName.Magic, Math.floor(magLevel * 0.10) + 2, duration, spell.id);
                char.addBuff({ type: 'magic_damage_boost', value: 3, duration: duration, source: spell.id });
                addLog("Your mind expands, boosting your magical abilities.");
            } else if (spell.id === 'warriors_vigour') {
                const attLevel = char.skills.find(s => s.name === SkillName.Attack)?.level ?? 1;
                const strLevel = char.skills.find(s => s.name === SkillName.Strength)?.level ?? 1;
                const defLevel = char.skills.find(s => s.name === SkillName.Defence)?.level ?? 1;
                
                char.applySpellStatBuff(SkillName.Attack, Math.floor(attLevel * 0.20) + 4, duration, spell.id);
                char.applySpellStatBuff(SkillName.Strength, Math.floor(strLevel * 0.20) + 4, duration, spell.id);
                char.applySpellStatBuff(SkillName.Defence, Math.floor(defLevel * 0.20) + 4, duration, spell.id);
                addLog("You are filled with immense strength and resilience.");
            } else if (spell.id === 'archers_precision') {
                const rngLevel = char.skills.find(s => s.name === SkillName.Ranged)?.level ?? 1;
                const defLevel = char.skills.find(s => s.name === SkillName.Defence)?.level ?? 1;

                char.applySpellStatBuff(SkillName.Ranged, Math.floor(rngLevel * 0.20) + 4, duration, spell.id);
                char.applySpellStatBuff(SkillName.Defence, Math.floor(defLevel * 0.20) + 4, duration, spell.id);
                addLog("Your aim becomes unerring.");
            } else if (spell.id === 'mystic_power') {
                const magLevel = char.skills.find(s => s.name === SkillName.Magic)?.level ?? 1;
                char.applySpellStatBuff(SkillName.Magic, Math.floor(magLevel * 0.20) + 4, duration, spell.id);
                char.addBuff({ type: 'magic_damage_boost', value: 5, duration: duration, source: spell.id });
                addLog("You channel overwhelming arcane power.");
            } else {
                addLog("The spell has no effect.");
            }
        } else {
            addLog(`You cast ${spell.name}.`);
        }
    
    }, [char, addLog, inv, navigation, ui, isStunned, getRunesNeeded, setIsResting]);

    return { onCastSpell, onSpellOnItem };
};