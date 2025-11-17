

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { PlayerSkill, SkillName, CombatStance, Spell, WorldState, Prayer, PrayerType, ActiveStatModifier, ActiveBuff } from '../types';
import { XP_TABLE, PRAYERS } from '../constants';

const getLevelForXp = (xp: number): number => {
    const level = XP_TABLE.findIndex(xpVal => xpVal > xp);
    return level === -1 ? 99 : level;
};

interface CharacterCallbacks {
    addLog: (message: string) => void;
    onXpGain: (skillName: SkillName, amount: number) => void;
    onLevelUp: (skillName: SkillName, newLevel: number) => void;
}

export const useCharacter = (
    initialData: { skills: PlayerSkill[], combatStance: CombatStance, currentHp: number, currentPrayer: number, autocastSpell: Spell | null, statModifiers: ActiveStatModifier[], activeBuffs: ActiveBuff[] }, 
    callbacks: CharacterCallbacks, 
    worldState: WorldState,
    setWorldState: React.Dispatch<React.SetStateAction<WorldState>>,
    isInCombat: boolean, 
    combatSpeedMultiplier: number, 
    xpMultiplier: number = 1,
    isGodModeOn: boolean = false,
    activePrayers: string[],
    onPrayerDepleted: () => void
) => {
    const { addLog, onXpGain, onLevelUp } = callbacks;
    const [skills, setSkills] = useState<PlayerSkill[]>(initialData.skills);
    const [combatStance, setCombatStance] = useState<CombatStance>(initialData.combatStance);
    const [currentHp, _setCurrentHp] = useState<number>(initialData.currentHp);
    const [statModifiers, setStatModifiers] = useState<ActiveStatModifier[]>(initialData.statModifiers ?? []);
    const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>(initialData.activeBuffs ?? []);
    const [autocastSpell, setAutocastSpell] = useState<Spell | null>(initialData.autocastSpell ?? null);
    
    const [rawCurrentPrayer, _setRawCurrentPrayer] = useState<number>(initialData.currentPrayer);

    const [godModeHp, setGodModeHp] = useState(999); // Invisible HP
    const [godModePrayer, setGodModePrayer] = useState(999); // Invisible Prayer

    const baseMaxHp = useMemo(() => skills.find(s => s.name === SkillName.Hitpoints)?.level ?? 10, [skills]);
    const maxPrayer = useMemo(() => skills.find(s => s.name === SkillName.Prayer)?.level ?? 1, [skills]);
    const hpBoost = useMemo(() => worldState.hpBoost?.amount ?? 0, [worldState.hpBoost]);
    const maxHp = useMemo(() => baseMaxHp + hpBoost, [baseMaxHp, hpBoost]);
    
    const isStunned = useMemo(() => activeBuffs.some(b => b.type === 'stun'), [activeBuffs]);
    const isPoisoned = useMemo(() => activeBuffs.some(b => b.type === 'poison'), [activeBuffs]);

    const prevActivePrayersLength = useRef(activePrayers.length);
    const rawPrayerRef = useRef(rawCurrentPrayer);
    useEffect(() => {
        rawPrayerRef.current = rawCurrentPrayer;
    }, [rawCurrentPrayer]);

    const setCurrentPrayer = useCallback((updater: React.SetStateAction<number>) => {
        _setRawCurrentPrayer(prev => {
            const newValue = typeof updater === 'function' ? updater(prev) : updater;

            if (isGodModeOn && newValue < prev) {
                const drain = prev - newValue;
                setGodModePrayer(gP => gP - drain); // Trigger effect
                return prev; // Don't actually change the prayer points
            }

            return Math.min(maxPrayer, newValue);
        });
    }, [isGodModeOn, maxPrayer]);

    // Prayer flicking restoration effect
    useEffect(() => {
        if (activePrayers.length === 0 && prevActivePrayersLength.current > 0) {
            _setRawCurrentPrayer(prev => (prev > 0 ? Math.ceil(prev) : prev));
        }
        prevActivePrayersLength.current = activePrayers.length;
    }, [activePrayers]);

    // Unified game loop for prayer drain and logging
    useEffect(() => {
        let animationFrameId: number;
        let lastTimestamp: number | null = null;
        let lastLogTimestamp: number | null = null;
        const logInterval = 600;

        const loop = (timestamp: number) => {
            if (lastTimestamp === null) {
                lastTimestamp = timestamp;
                lastLogTimestamp = timestamp;
                animationFrameId = requestAnimationFrame(loop);
                return;
            }
            
            const deltaTime = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            // --- 1. Drain Logic ---
            if (activePrayers.length > 0 && !isGodModeOn) {
                const totalDrainRate = activePrayers.reduce((total, prayerId) => {
                    const prayerData = PRAYERS.find(p => p.id === prayerId);
                    return total + (prayerData?.drainRate || 0);
                }, 0);

                if (totalDrainRate > 0 && deltaTime > 0) {
                    const drainPerMinute = totalDrainRate;
                    const drainPerMs = drainPerMinute / 60000;
                    const drainAmount = deltaTime * drainPerMs;

                    _setRawCurrentPrayer(prev => {
                        if (prev <= 0) return 0;
                        const newPrayer = prev - drainAmount;
                        if (newPrayer <= 0) {
                            if (prev > 0) { // Only trigger on the frame it hits zero
                                onPrayerDepleted();
                                addLog("You have run out of prayer points!");
                            }
                            return 0;
                        }
                        return newPrayer;
                    });
                }
            }
            
            // --- 2. Debug Log Logic ---
            if (activePrayers.length > 0 && !isGodModeOn && timestamp - lastLogTimestamp! >= logInterval) {
                // Log only if prayer is actually draining
                if (rawPrayerRef.current > 0) {
                    addLog(`[DEBUG] Prayer: ${rawPrayerRef.current.toFixed(4)}`);
                }
                lastLogTimestamp = timestamp;
            }
            
            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [activePrayers, isGodModeOn, addLog, onPrayerDepleted]);


    const setCurrentHp = useCallback((updater: React.SetStateAction<number>) => {
        _setCurrentHp(prevHp => {
            const newHp = typeof updater === 'function' ? updater(prevHp) : updater;
            
            if (isGodModeOn && newHp < prevHp) {
                // Damage is being applied in God Mode
                const damage = prevHp - newHp;
                setGodModeHp(gHp => gHp - damage);
                // The useEffect on godModeHp will trigger the visual heal.
                // We don't change the visual HP here, so it appears no damage was taken.
                return prevHp;
            }
            
            // Allow healing or normal damage
            return Math.min(maxHp, newHp);
        });
    }, [isGodModeOn, maxHp]);
    
    // This effect triggers the "full heal" and "full prayer" whenever invisible HP/Prayer changes or God Mode is toggled
    useEffect(() => {
        if (isGodModeOn) {
            _setCurrentHp(maxHp);
            _setRawCurrentPrayer(maxPrayer);
        }
    }, [godModeHp, godModePrayer, isGodModeOn, maxHp, maxPrayer]);
    
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

        let regenerationInterval = 60000;
        
        // Rapid Heal prayer doubles regeneration rate.
        if (activePrayers.includes('rapid_heal')) {
            regenerationInterval /= 2;
        }

        const timer = setInterval(() => {
            setCurrentHp(prev => Math.min(maxHp, prev + 1));
        }, regenerationInterval);

        return () => clearInterval(timer);
    }, [currentHp, maxHp, isInCombat, combatSpeedMultiplier, setCurrentHp, activePrayers]);


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
        const timer = setInterval(() => {
            setStatModifiers(prev => {
                const now = Date.now();
                const updatedModifiers = prev.map(mod => {
                    // Only decay if the timer is up
                    if (now < mod.nextDecayTimestamp) {
                        return mod;
                    }

                    const isBoost = mod.currentValue > 0;
                    const decayAmount = isBoost ? -1 : 1;
                    const newValue = mod.currentValue + decayAmount;

                    if ((isBoost && newValue <= 0) || (!isBoost && newValue >= 0)) {
                        addLog(`Your ${mod.skill} level has returned to normal.`);
                        return null; // Mark for removal
                    }
                    
                    // Reset the timer for the next decay
                    return { ...mod, currentValue: newValue, nextDecayTimestamp: now + 60000 };
                });

                return updatedModifiers.filter((m): m is ActiveStatModifier => m !== null);
            });
        }, 1000); // Check every second to keep timers responsive
        return () => clearInterval(timer);
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
                    const expiredBuffs = prev.filter(p => !active.some(a => a.id === p.id));
                    expiredBuffs.forEach(buff => {
                        if (buff.type === 'stat_boost' && buff.statBoost) {
                            addLog(`Your magical ${buff.statBoost.skill} boost has worn off.`);
                        } else if (buff.type !== 'stun') {
                            addLog("A magical effect has worn off.");
                        }
                    });
                }
                return active;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [addLog]);

    useEffect(() => {
        const poisonTickInterval = 15000; // Poison ticks every 6 seconds for the player
    
        const timer = setInterval(() => {
            const poisonBuff = activeBuffs.find(b => b.type === 'poison');
            if (!poisonBuff || poisonBuff.durationRemaining <= 0 || poisonBuff.value <= 0) {
                return;
            }
    
            // Deal damage
            setCurrentHp(prev => {
                const newHp = prev - poisonBuff.value;
                if (newHp > 0) {
                    addLog(`You take ${poisonBuff.value} poison damage.`);
                }
                return newHp;
            });
    
            // Update the buff state for decay
            setActiveBuffs(prevBuffs => {
                return prevBuffs.map(b => {
                    if (b.id === poisonBuff.id) {
                        const newBuff = { ...b };
                        const ticks = (newBuff.ticksApplied ?? 0) + 1;
                        if (ticks >= 2) {
                            newBuff.value -= 1;
                            newBuff.ticksApplied = 0;
                            if (newBuff.value <= 0) {
                                addLog("The poison's effects have worn off.");
                                newBuff.durationRemaining = 0; // End the poison
                            }
                        } else {
                            newBuff.ticksApplied = ticks;
                        }
                        return newBuff;
                    }
                    return b;
                });
            });
        }, poisonTickInterval);
    
        return () => clearInterval(timer);
    }, [activeBuffs, setCurrentHp, addLog]);

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
                    if (skillName === SkillName.Prayer) {
                        setCurrentPrayer(p => p + (finalLevel - oldLevel));
                    }
                    if (skillName === SkillName.Magic && finalLevel >= 40 && oldLevel < 40) {
                        addLog("As your magical power grows, a deep sense of dread washes over you. You feel a subtle, yet profound, disturbance in the world's magical weave.");
                    }
                    // Adjust active stat modifiers on level up.
                    setStatModifiers(prev => {
                        const newModifiers = [...prev];
                        const modIndex = newModifiers.findIndex(m => m.skill === skillName);

                        if (modIndex > -1) {
                            const modifier = newModifiers[modIndex];
                            const levelsGained = finalLevel - oldLevel;

                            if (modifier.currentValue > 0) { // It's a boost
                                const newCurrentValue = modifier.currentValue - levelsGained;
                                if (newCurrentValue <= 0) {
                                    addLog(`Your level up has completely absorbed your ${skillName} boost.`);
                                    newModifiers.splice(modIndex, 1); // Remove the modifier
                                } else {
                                    newModifiers[modIndex] = { ...modifier, currentValue: newCurrentValue };
                                }
                            } else if (modifier.currentValue < 0) { // It's a drain
                                const newCurrentValue = modifier.currentValue + levelsGained;
                                if (newCurrentValue >= 0) {
                                    addLog(`Your level up has completely overcome your ${skillName} drain.`);
                                    newModifiers.splice(modIndex, 1); // Remove the modifier
                                } else {
                                    newModifiers[modIndex] = { ...modifier, currentValue: newCurrentValue };
                                }
                            }
                        }
                        return newModifiers;
                    });
                }
            }
            return newSkills;
        });
    }, [addLog, onXpGain, onLevelUp, xpMultiplier, setCurrentHp, setCurrentPrayer]);
    
    const applyStatModifier = useCallback((skill: SkillName, value: number, baseLevelOnConsumption: number) => {
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
                baseLevelOnConsumption,
                nextDecayTimestamp: Date.now() + 60000,
            };
            addLog(value > 0 ? `You feel your ${skill} level increase.` : `You feel your ${skill} level decrease.`);
            return [...prev.filter(m => m.skill !== skill), newModifier];
        });
    }, [addLog]);

    const applySpellStatBuff = useCallback((skill: SkillName, value: number, duration: number) => {
        const newBuff: ActiveBuff = {
            id: Date.now() + Math.random(),
            type: 'stat_boost',
            value: value,
            duration: duration,
            durationRemaining: duration,
            statBoost: {
                skill,
                value
            }
        };
        setActiveBuffs(prev => [...prev.filter(b => b.statBoost?.skill !== skill), newBuff]);
        addLog(`You feel a surge of magical power, boosting your ${skill}.`);
    }, [addLog]);

    const addBuff = useCallback((buff: Omit<ActiveBuff, 'id' | 'durationRemaining'>) => {
        if (buff.type === 'poison') {
            const hasImmunity = activeBuffs.some(b => b.type === 'poison_immunity');
            if (hasImmunity) {
                addLog("You are immune to poison!");
                return;
            }
        }

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
        if (buff.type === 'poison') buffMessage = "You have been poisoned!";
        addLog(buffMessage);

    }, [addLog, activeBuffs]);

    const curePoison = useCallback(() => {
        setActiveBuffs(prev => {
            const wasPoisoned = prev.some(b => b.type === 'poison');
            if (wasPoisoned) {
                addLog("You feel the poison's effects fade.");
                return prev.filter(b => b.type !== 'poison');
            }
            addLog("You are not poisoned.");
            return prev;
        });
    }, [addLog]);

    const clearStatModifiers = useCallback(() => {
        setStatModifiers([]);
        setActiveBuffs(prev => prev.filter(b => b.type !== 'stat_boost'));
    }, []);
    
    const clearBuffs = useCallback(() => {
        setActiveBuffs(prev => prev.filter(b => b.type === 'stat_boost'));
    }, []);

    const skillsWithCurrentLevels = useMemo(() => {
        return skills.map(skill => {
            let currentLevel = skill.level;
    
            // Apply prayer boosts FIRST
            const prayerBoosts = activePrayers
                .map(id => PRAYERS.find(p => p.id === id))
                .filter((p): p is Prayer => !!p && p.type === PrayerType.STAT_BOOST && p.boost?.skill === skill.name);
            
            if (prayerBoosts.length > 0) {
                const highestBoost = Math.max(...prayerBoosts.map(p => p.boost!.percent));
                currentLevel += Math.floor(skill.level * (highestBoost / 100));
            }
    
            // Then, apply fixed-duration spell buffs
            const spellBuff = activeBuffs.find(b => b.type === 'stat_boost' && b.statBoost?.skill === skill.name);
            if (spellBuff && spellBuff.statBoost) {
                currentLevel += spellBuff.statBoost.value;
            }
            
            // Finally, apply decaying potion/monster modifiers
            const decayModifier = statModifiers.find(m => m.skill === skill.name);
            if (decayModifier) {
                const modifiedLevel = currentLevel + decayModifier.currentValue;
                currentLevel = decayModifier.currentValue < 0 ? Math.max(1, Math.round(modifiedLevel)) : Math.round(modifiedLevel);
            }
    
            return { ...skill, currentLevel: currentLevel };
        });
    }, [skills, statModifiers, activeBuffs, activePrayers]);
    

    const setSkillLevel = useCallback((skillName: SkillName, level: number) => {
        const clampedLevel = Math.max(1, Math.min(99, level));
        const newXp = XP_TABLE[clampedLevel - 1] ?? 0;

        setSkills(prevSkills => prevSkills.map(skill => 
            skill.name === skillName ? { ...skill, level: clampedLevel, xp: newXp } : skill
        ));

        if (skillName === SkillName.Hitpoints) {
            setCurrentHp(clampedLevel);
        }

        if (skillName === SkillName.Prayer) {
            setCurrentPrayer(clampedLevel);
        }

        addLog(`DEV: Set ${skillName} to level ${clampedLevel}.`);
    }, [addLog, setCurrentHp, setCurrentPrayer]);

    return {
        skills: skillsWithCurrentLevels, 
        setSkills, 
        combatStance, 
        setCombatStance, 
        currentHp, 
        setCurrentHp, 
        maxHp,
        currentPrayer: Math.round(rawCurrentPrayer),
        rawCurrentPrayer: rawCurrentPrayer,
        setCurrentPrayer,
        maxPrayer,
        combatLevel, 
        addXp, 
        applyStatModifier,
        applySpellStatBuff,
        activeBuffs,
        statModifiers,
        addBuff,
        curePoison,
        clearStatModifiers,
        clearBuffs,
        autocastSpell,
        setAutocastSpell,
        setSkillLevel,
        isStunned,
        isPoisoned,
    };
};
