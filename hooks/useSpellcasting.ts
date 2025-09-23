
import { useCallback } from 'react';
import { Spell, SkillName } from '../types';
import { useCharacter } from './useCharacter';
import { useInventory } from './useInventory';
import { useNavigation } from './useNavigation';

interface SpellcastingDependencies {
    char: ReturnType<typeof useCharacter>;
    inv: ReturnType<typeof useInventory>;
    addLog: (message: string) => void;
    navigation: ReturnType<typeof useNavigation>;
}

export const useSpellcasting = (deps: SpellcastingDependencies) => {
    const { char, inv, addLog, navigation } = deps;

    const onCastSpell = useCallback((spell: Spell) => {
        const magicLevel = char.skills.find(s => s.name === SkillName.Magic)?.currentLevel ?? 1;

        if (spell.type === 'combat' && spell.autocastable) {
            if (magicLevel < spell.level) {
                addLog(`You need a Magic level of ${spell.level} to set this as your autocast spell.`);
                return;
            }
            
            const isCurrentlyAutocasting = char.autocastSpell?.id === spell.id;
            
            if (!isCurrentlyAutocasting) {
                char.setAutocastSpell(spell);
                addLog(`Autocast spell set to: ${spell.name}.`);
            } else {
                char.setAutocastSpell(null);
                addLog('Autocast spell cleared.');
            }
            return;
        }
    
        if (magicLevel < spell.level) {
            addLog(`You need a Magic level of ${spell.level} to cast this spell.`);
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
    
    }, [char.skills, char.autocastSpell, char.setAutocastSpell, addLog, inv.modifyItem, char.addXp, navigation.handleForcedNavigate, inv.hasItems]);

    return { onCastSpell };
};
