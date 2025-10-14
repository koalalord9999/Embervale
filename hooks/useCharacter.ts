
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PlayerSkill, SkillName, CombatStance, Spell, WorldState } from '../types';
import { XP_TABLE } from '../constants';

const getLevelForXp = (xp: number): number => {
    const level = XP_TABLE.findIndex(xpVal => xpVal > xp);
    return level === -1 ? 99 : level;
};

interface CharacterCallbacks {
    addLog: (message: string) => void;
    onXpGain: (skillName: SkillName, amount: number) => void;
    onLevelUp: (skillName: SkillName, newLevel: number) => void;
}

export interface ActiveStatModifier {
    id: number;
    skill: SkillName;
    initialValue: number;
    currentValue: number;
    durationPerLevel: number; // ms per level decay
    decayTimer: number; // ms until next decay
    baseLevelOnConsumption: number;
}

export interface ActiveBuff {
    id: number;
    type: 'recoil' | 'flat_damage' | 'poison_on_hit' | 'accuracy_boost' | 'evasion_boost' | 'damage_on_hit' | 'attack_speed_boost' | 'poison_immunity' | 'damage_reduction' | 'antifire' | 'stun';
    value: number;
    duration: number; // initial duration in ms
    durationRemaining: number; // ms remaining
    chance?: number;
    style?: 'melee' | 'ranged' | 'all';
}

export const useCharacter = (
    initialData: { skills: PlayerSkill[], combatStance: CombatStance, currentHp: number, autocastSpell: Spell | null, statModifiers: ActiveStatModifier[], activeBuffs: ActiveBuff[] }, 
    callbacks: CharacterCallbacks, 
    worldState: WorldState,
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>,
    isInCombat: boolean, 
    combatSpeedMultiplier: number, 
    xpMultiplier: number = 1
) => {
    const { addLog, onXpGain, onLevelUp } = callbacks;
    const [skills, setSkills] = useState<PlayerSkill[]>(initialData.skills);
    const [combatStance, setCombatStance] = useState<CombatStance>(initialData.combatStance);
    const [currentHp, setCurrentHp] = useState<number>(initialData.currentHp);
    const [statModifiers, setStatModifiers] = useState<ActiveStatModifier[]>(initialData.statModifiers ?? []);
    const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>(initialData.activeBuffs ?? []);
    const [autocastSpell, setAutocastSpell] = useState<Spell | null>(initialData.autocastSpell ?? null);

    const baseMaxHp = useMemo(() => skills.find(s => s.name === SkillName.Hitpoints)?.level ?? 10, [skills]);
    const hpBoost = useMemo(() => worldState.hpBoost?.amount ?? 0, [worldState.hpBoost]);
    const maxHp = useMemo(() => baseMaxHp + hpBoost, [baseMaxHp, hpBoost]);
    
    const isStunned = useMemo(() => activeBuffs.some(b => b.type === 'stun'), [activeBuffs]);
    
    const combatLevel = useMemo(() => {
        const get = (name: SkillName) => skills.find(s => s.name === name)?.level ?? 1;

        const attack = get(SkillName.Attack);
        const strength = get(SkillName.Strength);
        const defence = get(SkillName.Defence);
        const ranged = get(SkillName.Ranged);
        const magic = get(SkillName.Magic);
        const prayer = get(SkillName.Prayer);
        const hitpoints = baseMaxHp; // Use base HP for combat level calculation

        // This is the classic RuneScape combat level formula for a balanced progression.
        const base = 0.25 * (defence + hitpoints + Math.floor(prayer / 2));

        const meleeBonus = 0.325 * (attack + strength);
        const rangeBonus = 0.325 * Math.floor(ranged * 1.5);
        const mageBonus = 0.325 * Math.floor(magic * 1.5);

        const styleBonus = Math.max(meleeBonus, rangeBonus, mageBonus);

        return Math.floor(base + styleBonus);
    }, [skills, baseMaxHp]);
    
    useEffect(() => {
        if (currentHp >= maxHp) {
            return;
        }
        const regenerationInterval = isInCombat ? (30000 / combatSpeedMultiplier) : 10000;
        const timer = setInterval(() => {
            setCurrentHp(prev => Math.min(maxHp, prev + 1));
        }, regenerationInterval);
        return () => clearInterval(timer);
    }, [currentHp, maxHp, isInCombat, combatSpeedMultiplier]);

    // HP Boost expiration check
    useEffect(() => {
        if (!worldState.hpBoost) return;

        const checkExpiration = () => {
            if (worldState.hpBoost && Date.now() >= worldState.hpBoost.expiresAt) {
                setWorldState(ws => ({ ...ws, hpBoost: null }));
                addLog("The warmth from the bonfire fades, and your health returns to normal.");
            }
        };

        const interval = setInterval(checkExpiration, 1000);
        return () => clearInterval(interval);
    }, [worldState.hpBoost, setWorldState, addLog]);

    useEffect(() => {
        const interval = setInterval(() => {
            setStatModifiers(prev => {
                const updatedModifiers = prev.map(mod => {
                    const newTimer = mod.decayTimer - 1000;
                    if (newTimer <= 0) {
                        const isBoost = mod.initialValue > 0;
                        const decayAmount = isBoost ? -1 : 1;
                        const newValue = mod.currentValue + decayAmount;

                        if ((isBoost && newValue <= 0) || (!isBoost && newValue >= 0)) {
                            return null;
                        }
                        
                        return {
                            ...mod,
                            currentValue: newValue,
                            decayTimer: mod.durationPerLevel, // reset timer
                        };
                    }
                    return { ...mod, decayTimer: newTimer };
                });

                const newModifiersFiltered = updatedModifiers.filter((m): m is ActiveStatModifier => m !== null);

                if (newModifiersFiltered.length < prev.length) {
                    const expiredSkills = prev
                        .filter(p => !newModifiersFiltered.some(n => n.id === p.id))
                        .map(m => m.skill);
                }
                
                return newModifiersFiltered;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [addLog]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBuffs(prev => {
                const updatedBuffs = prev.map(b => ({
                    ...b,
                    durationRemaining: b.durationRemaining - 1000
                }));
                
                const active = updatedBuffs.filter(b => b.durationRemaining > 0);
                
                if (active.length < prev.length) {
                    const expiredBuffTypes = prev.filter(p => !active.some(a => a.id === p.id)).map(b => b.type);
                    if (!expiredBuffTypes.includes('stun')) {
                        addLog("A magical effect has worn off.");
                    }
                }
                return active;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [addLog]);

    const addXp = useCallback((skillName: SkillName, amount: number) => {
        if (amount <= 0) return;
        const multipliedAmount = amount * xpMultiplier;
        const roundedAmount = Math.floor(multipliedAmount);
        if (roundedAmount <= 0) return;

        onXpGain(skillName, roundedAmount);
        setSkills(prevSkills => {
            const newSkills = [...prevSkills];
            const skillIndex = newSkills.findIndex(s => s.name === skillName);
            if (skillIndex !== -1) {
                const oldSkill = newSkills[skillIndex];
                const newXp = oldSkill.xp + roundedAmount;
                const oldLevel = oldSkill.level;
                const newLevel = getLevelForXp(newXp);
                
                const finalLevel = Math.min(99, newLevel);
                newSkills[skillIndex] = { ...oldSkill, xp: newXp, level: finalLevel };

                if (finalLevel > oldLevel) {
                    addLog(`Congratulations, you just advanced a ${skillName} level! Your ${skillName} level is now ${finalLevel}.`);
                    onLevelUp(skillName, finalLevel);
                    if (skillName === SkillName.Hitpoints) {
                        setCurrentHp(hp => hp + (finalLevel - oldLevel));
                    }
                    if (skillName === SkillName.Magic && finalLevel >= 40 && oldLevel < 40) {
                        addLog("As your magical power grows, a deep sense of dread washes over you. You feel a subtle, yet profound, disturbance in the world's magical weave.");
                    }
                }
            }
            return newSkills;
        });
    }, [addLog, onXpGain, onLevelUp, xpMultiplier, setCurrentHp]);
    
    const applyStatModifier = useCallback((skill: SkillName, value: number, totalDuration: number, baseLevelOnConsumption: number) => {
        if (totalDuration <= 0 || value === 0) return;

        const durationPerLevel = totalDuration / Math.abs(value);

        setStatModifiers(prev => {
            const existingModifier = prev.find(m => m.skill === skill);

            if (existingModifier) {
                if (value > 0 && value < existingModifier.initialValue) {
                    addLog(`You already have a stronger ${skill} boost active.`);
                    return prev;
                }
                if (value < 0 && value > existingModifier.initialValue) {
                    addLog(`You already have a stronger ${skill} drain active.`);
                    return prev;
                }
            }
            
            const newModifier: ActiveStatModifier = {
                id: existingModifier?.id ?? (Date.now() + Math.random()),
                skill,
                initialValue: value,
                currentValue: value,
                durationPerLevel,
                decayTimer: durationPerLevel,
                baseLevelOnConsumption,
            };
            addLog(value > 0 ? `You feel your ${skill} level increase.` : `You feel your ${skill} level decrease.`);
            return [...prev.filter(m => m.skill !== skill), newModifier];
        });
    }, [addLog]);

    const addBuff = useCallback((buff: Omit<ActiveBuff, 'id' | 'durationRemaining'>) => {
        const newBuff: ActiveBuff = {
            ...buff,
            id: Date.now() + Math.random(),
            durationRemaining: buff.duration,
        };
        setActiveBuffs(prev => [...prev.filter(b => b.type !== buff.type), newBuff]);
        
        let buffMessage = "You feel a surge of power!";
        if (buff.type === 'recoil') buffMessage = "Your skin hardens and feels prickly.";
        if (buff.type === 'flat_damage') buffMessage = "Your strikes feel unnaturally powerful.";
        if (buff.type === 'poison_on_hit') buffMessage = "You feel a venomous power course through you.";
        if (buff.type === 'accuracy_boost') buffMessage = "Your focus sharpens.";
        if (buff.type === 'evasion_boost') buffMessage = "You feel light on your feet.";
        if (buff.type === 'damage_on_hit') buffMessage = "Your weapon glows with a fiery energy.";
        if (buff.type === 'attack_speed_boost') buffMessage = "You feel unnaturally quick.";
        if (buff.type === 'poison_immunity') buffMessage = "You feel resistant to poison.";
        if (buff.type === 'damage_reduction') buffMessage = "Your skin feels as hard as stone.";
        if (buff.type === 'antifire') buffMessage = "You feel a sudden coolness, resisting extreme heat.";
        if (buff.type === 'stun') buffMessage = "You have been stunned!";
        addLog(buffMessage);

    }, [addLog]);

    const clearStatModifiers = useCallback(() => {
        setStatModifiers([]);
    }, []);

    const skillsWithCurrentLevels = useMemo(() => {
        return skills.map(skill => {
            const modifier = statModifiers.find(m => m.skill === skill.name);
            if (modifier) {
                const modifiedLevel = skill.level + modifier.currentValue;
                // Ensure level doesn't go below 1 for drains. Boosts can go above 99.
                const currentLevel = modifier.currentValue < 0 ? Math.max(1, Math.round(modifiedLevel)) : Math.round(modifiedLevel);
                return { ...skill, currentLevel };
            }
            return { ...skill, currentLevel: skill.level };
        });
    }, [skills, statModifiers]);

    const setSkillLevel = useCallback((skillName: SkillName, level: number) => {
        const clampedLevel = Math.max(1, Math.min(99, level));
        const newXp = XP_TABLE[clampedLevel - 1] ?? 0;

        setSkills(prevSkills => prevSkills.map(skill => 
            skill.name === skillName ? { ...skill, level: clampedLevel, xp: newXp } : skill
        ));

        if (skillName === SkillName.Hitpoints) {
            setCurrentHp(clampedLevel);
        }

        addLog(`DEV: Set ${skillName} to level ${clampedLevel}.`);
    }, [addLog]);

    return {
        skills: skillsWithCurrentLevels, 
        setSkills, 
        combatStance, 
        setCombatStance, 
        currentHp, 
        setCurrentHp, 
        maxHp, 
        combatLevel, 
        addXp, 
        applyStatModifier,
        activeBuffs,
        statModifiers,
        addBuff,
        clearStatModifiers,
        autocastSpell,
        setAutocastSpell,
        setSkillLevel,
        isStunned,
    };
};
