
import { useCallback, useRef } from 'react';
import { PlayerSkill, SkillName, InventorySlot } from '../../types';
import { THIEVING_POCKET_TARGETS, rollOnLootTable, LootRollResult } from '../../constants';

interface PrototypeThievingDependencies {
    addLog: (message: string) => void;
    skills: (PlayerSkill & { currentLevel: number; })[];
    addXp: (skill: SkillName, amount: number) => void;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean }) => void;
    addBuff: (buff: any) => void;
    setPlayerHp: React.Dispatch<React.SetStateAction<number>>;
    currentHp: number;
    isInCombat: boolean;
    isStunned: boolean;
}

export const usePrototypeThieving = (deps: PrototypeThievingDependencies) => {
    const { addLog, skills, addXp, modifyItem, addBuff, setPlayerHp, currentHp, isInCombat, isStunned } = deps;
    const activeTimeoutRef = useRef<number | null>(null);

    const handlePickpocket = useCallback((targetName: string, lootTableId: string) => {
        if (isStunned || activeTimeoutRef.current || isInCombat) return;

        const targetData = THIEVING_POCKET_TARGETS[lootTableId];
        if (!targetData) {
            addLog(`Cannot pickpocket ${targetName}.`);
            return;
        }

        const thievingSkill = skills.find(s => s.name === SkillName.Thieving);
        if (!thievingSkill || thievingSkill.currentLevel < targetData.level) {
            addLog(`You need a Thieving level of ${targetData.level} to pickpocket ${targetName}.`);
            return;
        }

        addLog(`You attempt to pickpocket the ${targetName}...`);

        activeTimeoutRef.current = window.setTimeout(() => {
            const baseSuccessChance = 50;
            const levelDifference = (thievingSkill.currentLevel || 1) - targetData.level;
            const successChance = Math.max(10, Math.min(98, baseSuccessChance + levelDifference * 1.5));

            if (Math.random() * 100 < successChance) {
                addLog(`You successfully pickpocket the ${targetName}.`);
                addXp(SkillName.Thieving, targetData.xp);
                const lootResult = rollOnLootTable(lootTableId);
                if (lootResult) {
                    let loot = typeof lootResult === 'string' ? { itemId: lootResult, quantity: 1, noted: false } : lootResult;
                    modifyItem(loot.itemId, loot.quantity, false, { bypassAutoBank: true, noted: loot.noted });
                }
            } else {
                addLog(`You have been caught!`);
                addBuff({ type: 'stun', value: 0, duration: targetData.stunDuration });
                const newHp = currentHp - targetData.damageOnFailure;
                setPlayerHp(newHp);
            }
            activeTimeoutRef.current = null;
        }, 600);
    }, [isStunned, isInCombat, skills, addLog, addXp, modifyItem, addBuff, setPlayerHp, currentHp]);
    
    return { handlePickpocket };
};
