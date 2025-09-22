



import { useState, useMemo, useCallback, useEffect } from 'react';
import { PlayerSkill, SkillName, CombatStance, Spell } from '../types';
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

interface ActiveStatModifier {
    id: number;
    skill: SkillName;
    initialValue: number;
    currentValue: number;
    durationPerLevel: number;
    nextDecayAt: number;
    baseLevelOnConsumption: number;
}

export interface ActiveBuff {
    id: number;
    type: 'recoil' | 'flat_damage' | 'poison_on_hit' | 'accuracy_boost' | 'evasion_boost' | 'damage_on_hit' | 'attack_speed_boost' | 'poison_immunity' | 'damage_reduction';
    value: number;
    duration: number;
    expiresAt: number;
    chance?: number;
    style?: 'melee' | 'ranged' | 'all';
}

export const useCharacter = (initialData: { skills: PlayerSkill[], combatStance: CombatStance, currentHp: number, autocastSpell: Spell | null }, callbacks: CharacterCallbacks, isInCombat: boolean, combatSpeedMultiplier: number, xpMultiplier: number = 1) => {
    const { addLog, onXpGain, onLevelUp } = callbacks;
    const [skills, setSkills] = useState<PlayerSkill[]>(initialData.skills);
    const [combatStance, setCombatStance] = useState<CombatStance>(initialData.combatStance);
    const [currentHp, setCurrentHp] = useState<number>(initialData.currentHp);
    const [statModifiers, setStatModifiers] = useState<ActiveStatModifier[]>([]);
    const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);
    const [autocastSpell, setAutocastSpell] = useState<Spell | null>(initialData.autocastSpell ?? null);

    const maxHp = useMemo(() => skills.find(s => s.name === SkillName.Hitpoints)?.level ?? 10, [skills]);
    
    const combatLevel = useMemo(() => {
        const get = (name: SkillName) => skills.find(s => s.name === name)?.level ?? 1;

        const attack = get(SkillName.Attack);
        const strength = get(SkillName.Strength);
        const defence = get(SkillName.Defence);
        const ranged = get(SkillName.Ranged);
        const magic = get(SkillName.Magic);
        const prayer = get(SkillName.Prayer);
        const hitpoints = maxHp; // maxHp is already the HP level

        // This formula is inspired by classic RPGs and is balanced for a max level of ~150.
        // It's composed of a base level from defensive stats and a bonus from the highest offensive style.
        const base = 0.25 * (defence + hitpoints + Math.floor(prayer / 2));

        const meleeBonus = 0.45 * (attack + strength);
        const rangeBonus = 0.45 * (2 * ranged);
        const mageBonus = 0.45 * (2 * magic);

        const styleBonus = Math.max(meleeBonus, rangeBonus, mageBonus);

        return Math.floor(base + styleBonus);
    }, [skills, maxHp]);
    
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

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setStatModifiers(prev => {
                const updatedModifiers = prev.map(mod => {
                    if (now >= mod.nextDecayAt) {
                        const newValue = mod.currentValue - 1;
                        if (newValue > 0) {
                            addLog(`Your ${mod.skill} boost has weakened.`);
                            return {
                                ...mod,
                                currentValue: newValue,
                                nextDecayAt: now + mod.durationPerLevel,
                            };
                        }
                        return null; // Buff expires
                    }
                    return mod;
                });

                const newModifiersFiltered = updatedModifiers.filter((m): m is ActiveStatModifier => m !== null);

                // Log expiration for any removed modifiers
                if (newModifiersFiltered.length < prev.length) {
                    const expiredSkills = prev
                        .filter(p => !newModifiersFiltered.some(n => n.id === p.id))
                        .map(m => m.skill);
                    
                    expiredSkills.forEach(skillName => {
                        addLog(`You feel your ${skillName} level returning to normal.`);
                    });
                }
                
                return newModifiersFiltered;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [addLog]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setActiveBuffs(prev => {
                const active = prev.filter(b => b.expiresAt > now);
                if (active.length < prev.length) {
                    addLog("A magical effect has worn off.");
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
                
                if (newLevel >= 99) {
                     newSkills[skillIndex] = { ...oldSkill, xp: newXp, level: 99 };
                     if (newLevel > oldLevel) {
                        addLog(`Congratulations, you just advanced a ${skillName} level! Your ${skillName} level is now ${newLevel}.`);
                        onLevelUp(skillName, newLevel);
                        if (skillName === SkillName.Hitpoints) {
                            setCurrentHp(hp => hp + (newLevel - oldLevel));
                        }
                     }
                     return newSkills;
                }

                newSkills[skillIndex] = { ...oldSkill, xp: newXp, level: newLevel };
                if (newLevel > oldLevel) {
                    addLog(`Congratulations, you just advanced a ${skillName} level! Your ${skillName} level is now ${newLevel}.`);
                    onLevelUp(skillName, newLevel);
                    if (skillName === SkillName.Hitpoints) {
                        setCurrentHp(hp => hp + (newLevel - oldLevel));
                    }
                }
            }
            return newSkills;
        });
    }, [addLog, onXpGain, onLevelUp, xpMultiplier]);
    
    const applyStatModifier = useCallback((skill: SkillName, value: number, totalDuration: number, baseLevelOnConsumption: number) => {
        if (value <= 0 || totalDuration <= 0) return;

        const durationPerLevel = totalDuration / value;

        setStatModifiers(prev => {
            const existingModifier = prev.find(m => m.skill === skill);
            const now = Date.now();

            if (existingModifier) {
                if (value < existingModifier.initialValue) {
                    addLog(`You already have a stronger ${skill} boost active.`);
                    return prev;
                }
                
                const newModifiers = prev.filter(m => m.skill !== skill);
                const newModifier: ActiveStatModifier = {
                    id: existingModifier.id,
                    skill,
                    initialValue: value,
                    currentValue: value,
                    durationPerLevel,
                    nextDecayAt: now + durationPerLevel,
                    baseLevelOnConsumption,
                };
                addLog(`You feel a surge of power, refreshing your ${skill} boost.`);
                return [...newModifiers, newModifier];
            } else {
                const newModifier: ActiveStatModifier = {
                    id: Date.now() + Math.random(),
                    skill,
                    initialValue: value,
                    currentValue: value,
                    durationPerLevel,
                    nextDecayAt: now + durationPerLevel,
                    baseLevelOnConsumption,
                };
                addLog(`You feel your ${skill} level increase.`);
                return [...prev, newModifier];
            }
        });
    }, [addLog]);

    const addBuff = useCallback((buff: Omit<ActiveBuff, 'id' | 'expiresAt'>) => {
        const newBuff: ActiveBuff = {
            ...buff,
            id: Date.now() + Math.random(),
            expiresAt: Date.now() + buff.duration,
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
        addLog(buffMessage);

    }, [addLog]);

    const clearStatModifiers = useCallback(() => {
        setStatModifiers([]);
    }, []);

    const skillsWithCurrentLevels = useMemo(() => {
        return skills.map(skill => {
            const modifier = statModifiers.find(m => m.skill === skill.name);
            if (modifier) {
                // The boosted level is anchored to the base level at the time of consumption.
                const boostedLevel = modifier.baseLevelOnConsumption + modifier.currentValue;
                // The current level is the higher of the player's base level or their boosted level.
                const currentLevel = Math.max(skill.level, boostedLevel);
                return { ...skill, currentLevel };
            }
            // If no modifier, current level is the base level.
            return { ...skill, currentLevel: skill.level };
        });
    }, [skills, statModifiers]);

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
        addBuff,
        clearStatModifiers,
        autocastSpell,
        setAutocastSpell,
    };
};
