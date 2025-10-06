
import { useCallback } from 'react';
import { InventorySlot, PlayerSkill, SkillName, Spell, Equipment, WeaponType } from '../types';
import { ITEMS } from '../constants';
import { useUIState } from './useUIState';

interface SpellActionDependencies {
    addLog: (message: string) => void;
    addXp: (skill: SkillName, amount: number) => void;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, doses?: number, options?: { noted?: boolean, bypassAutoBank?: boolean }) => void;
    hasItems: (items: { itemId: string, quantity: number }[]) => boolean;
    skills: (PlayerSkill & { currentLevel: number; })[];
    ui: ReturnType<typeof useUIState>;
    equipment: Equipment;
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

export const useSpellActions = (deps: SpellActionDependencies) => {
    const { addLog, addXp, modifyItem, hasItems, skills, ui, equipment } = deps;

    const handleSpellOnItem = useCallback((spell: Spell, target: { item: InventorySlot, index: number }) => {
        ui.setSpellToCast(null);

        const runesNeeded = spell.runes.filter(r => {
            const staff = equipment.weapon ? ITEMS[equipment.weapon.itemId] : null;
            return !(staff?.equipment?.providesRune === r.itemId);
        });

        if (!hasItems(runesNeeded)) {
            addLog("You do not have enough runes to cast this spell.");
            return;
        }

        if (spell.id === 'superheat_ore') {
            const smithingLevel = skills.find(s => s.name === SkillName.Smithing)?.level ?? 1;

            const smelt = (
                levelReq: number,
                ingredients: { itemId: string; quantity: number }[],
                bar: { itemId: string; quantity: number },
                smithingXp: number
            ) => {
                if (smithingLevel < levelReq) {
                    addLog(`You need a Smithing level of ${levelReq} to do that.`);
                    return;
                }
                if (!hasItems(ingredients)) {
                    addLog("You don't have the required ores.");
                    return;
                }

                runesNeeded.forEach(rune => modifyItem(rune.itemId, -rune.quantity, true));
                ingredients.forEach(ing => modifyItem(ing.itemId, -ing.quantity, true));
                modifyItem(bar.itemId, bar.quantity, false, undefined, { bypassAutoBank: true });
                addXp(SkillName.Magic, spell.xp);
                addXp(SkillName.Smithing, smithingXp);
                addLog(`You superheat the ore into a ${ITEMS[bar.itemId].name}.`);
            };

            const targetItem = target.item;
            switch (targetItem.itemId) {
                case 'copper_ore':
                    smelt(1, [{ itemId: 'copper_ore', quantity: 1 }, { itemId: 'tin_ore', quantity: 1 }], { itemId: 'bronze_bar', quantity: 1 }, 7);
                    break;
                case 'tin_ore':
                    smelt(1, [{ itemId: 'copper_ore', quantity: 1 }, { itemId: 'tin_ore', quantity: 1 }], { itemId: 'bronze_bar', quantity: 1 }, 7);
                    break;
                case 'iron_ore':
                    if (smithingLevel >= 30 && hasItems([{ itemId: 'coal', quantity: 2 }])) {
                        smelt(30, [{ itemId: 'iron_ore', quantity: 1 }, { itemId: 'coal', quantity: 2 }], { itemId: 'steel_bar', quantity: 1 }, 17.5);
                    } else {
                        smelt(15, [{ itemId: 'iron_ore', quantity: 1 }], { itemId: 'iron_bar', quantity: 1 }, 12.5);
                    }
                    break;
                case 'silver_ore':
                    smelt(20, [{ itemId: 'silver_ore', quantity: 1 }], { itemId: 'silver_bar', quantity: 1 }, 13.7);
                    break;
                case 'gold_ore':
                    smelt(40, [{ itemId: 'gold_ore', quantity: 1 }], { itemId: 'gold_bar', quantity: 1 }, 22.5);
                    break;
                case 'mithril_ore':
                    smelt(50, [{ itemId: 'mithril_ore', quantity: 1 }, { itemId: 'coal', quantity: 4 }], { itemId: 'mithril_bar', quantity: 1 }, 30);
                    break;
                case 'adamantite_ore':
                    smelt(65, [{ itemId: 'adamantite_ore', quantity: 1 }, { itemId: 'coal', quantity: 6 }], { itemId: 'adamantite_bar', quantity: 1 }, 37.5);
                    break;
                case 'titanium_ore':
                    smelt(80, [{ itemId: 'titanium_ore', quantity: 1 }, { itemId: 'coal', quantity: 8 }], { itemId: 'runic_bar', quantity: 1 }, 50);
                    break;
                default:
                    addLog("This spell can only be cast on ore.");
                    return;
            }
        } else if (spell.type === 'utility-enchant') {
            const isTargetValid = spell.targetItems?.includes(target.item.itemId);
            if (!isTargetValid) {
                addLog(`You cannot cast ${spell.name} on this item.`);
                return;
            }
            const enchantedItemId = ENCHANTMENT_MAP[target.item.itemId];
            if (enchantedItemId) {
                runesNeeded.forEach(rune => modifyItem(rune.itemId, -rune.quantity, true));
                addXp(SkillName.Magic, spell.xp);
                modifyItem(target.item.itemId, -1, true);
                modifyItem(enchantedItemId, 1, false, undefined, { bypassAutoBank: true });
                addLog(`You enchant the ${ITEMS[target.item.itemId].name}.`);
            } else {
                addLog(`You cannot enchant this item with ${spell.name}.`);
            }
        } else if (spell.type === 'utility-alchemy') {
            const itemData = ITEMS[target.item.itemId];
            if (!itemData || itemData.value === 0) {
                addLog("This item cannot be transmuted.");
                return;
            }
            
            runesNeeded.forEach(rune => modifyItem(rune.itemId, -rune.quantity, true));
            addXp(SkillName.Magic, spell.xp);

            const coinValue = Math.floor(itemData.value * (spell.id === 'greater_transmutation' ? 0.6 : 0.3));
            
            modifyItem(target.item.itemId, -1, true, undefined, { noted: target.item.noted });
            modifyItem('coins', coinValue, true);
            addLog(`You transmute the ${itemData.name} into ${coinValue} coins.`);
        }
    }, [addLog, addXp, modifyItem, hasItems, skills, ui, equipment]);

    return { handleSpellOnItem };
};
