
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Monster, PlayerSkill, SkillName, Equipment, CombatStance, WeaponType, MonsterType, InventorySlot, WeightedDrop, Spell, MonsterSpecialAttack, SpellElement, Item } from '../../types';
import { MONSTERS, ITEMS, rollOnLootTable, REGIONS, LootRollResult, getIconClassName, AMMO_TIER_LEVELS, QUESTS, POIS } from '../../constants';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
// FIX: Changed the import source for `ActiveBuff` from `../../hooks/useCharacter` to `../../types` as it is not exported from the hook.
import { ActiveBuff } from '../../types';
import AttackAnimationEngine from '../game/AttackAnimationEngine';
import { useInventory } from '../../hooks/useInventory';
import { useUIState } from '../../hooks/useUIState';

interface CombatViewProps {
    monsterQueue: string[];
    isMandatory: boolean;
    playerSkills: (PlayerSkill & { currentLevel: number })[];
    playerHp: number;
    equipment: Equipment;
    combatStance: CombatStance;
    setCombatStance: (stance: CombatStance) => void;
    setPlayerHp: React.Dispatch<React.SetStateAction<number>>;
    onCombatEnd: () => void;
    onFlee: (defeatedIds: string[]) => void;
    addXp: (skill: SkillName, amount: number) => void;
    // FIX: Standardize addLoot signature to use slotOverrides object.
    addLoot: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean }) => void;
    onDropLoot: (item: InventorySlot, overridePoiId?: string) => void; // For ground drops
    isAutoBankOn: boolean;
    addLog: (message: string) => void;
    onPlayerDeath: () => void;
    onKill: (uniqueInstanceId: string, attackStyle: 'melee' | 'ranged' | 'magic') => void;
    onEncounterWin: (defeatedMonsterIds: string[]) => void;
    onConsumeAmmo: () => void;
    activeBuffs: ActiveBuff[];
    combatSpeedMultiplier: number;
    advanceTutorial: (condition: string) => void;
    autocastSpell: Spell | null;
    inv: ReturnType<typeof useInventory>;
    ui: ReturnType<typeof useUIState>;
    killTrigger: number;
    applyStatModifier: (skill: SkillName, value: number, duration: number, baseLevelOnConsumption: number) => void;
    isStunned: boolean;
    addBuff: (buff: Omit<ActiveBuff, 'id' | 'durationRemaining'>) => void;
    showPlayerHealthNumbers: boolean;
    showEnemyHealthNumbers: boolean;
    showHitsplats: boolean;
    activePrayers: string[];
}

interface MonsterStatusEffect {
    type: 'poison';
    damagePerTick: number;
    ticksApplied: number;
}

const HitSplat: React.FC<{ damage: number | 'miss', isMaxHit?: boolean, isPoison?: boolean, isMagic?: boolean, isDragonfire?: boolean }> = ({ damage, isMaxHit = false, isPoison = false, isMagic = false, isDragonfire = false }) => {
    const isMiss = damage === 'miss' || damage === 0;
    const text = isMiss ? '0' : String(damage);

    // Prioritize max hit color, then miss, then others.
    const splatColorClass = useMemo(() => {
        if (isMaxHit) return 'hitsplat-orange';
        if (isMiss) return 'hitsplat-blue';
        if (isPoison) return 'hitsplat-green';
        if (isDragonfire) return 'hitsplat-dragonfire';
        // Normal hits are just red. Magic damage will be a red splat.
        return 'hitsplat-red';
    }, [isMiss, isMaxHit, isPoison, isDragonfire]);

    const [style, setStyle] = useState({ top: '50%', left: '50%', opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' });

    useEffect(() => {
        const top = `${Math.random() * 60 + 20}%`;
        const left = `${Math.random() * 60 + 20}%`;
        setStyle({ top, left, opacity: 1, transform: 'translate(-50%, -50%) scale(1)' });
        const timer = setTimeout(() => {
            setStyle(s => ({ ...s, opacity: 0, transform: 'translate(-50%, -70%) scale(0.8)' }));
        }, 800); // slightly shorter lifespan
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="hitsplat-container" style={style}>
            <div className={`hitsplat-splat ${splatColorClass}`}></div>
            <span className="hitsplat-text">{text}</span>
        </div>
    );
};

const SmoothCombatCooldownBar: React.FC<{ label: string, nextAttackTime: number, attackSpeedTicks: number, combatSpeedMultiplier: number, color: string }> = ({ label, nextAttackTime, attackSpeedTicks, combatSpeedMultiplier, color }) => {
    const [progress, setProgress] = useState(0);
    const attackSpeedMs = (attackSpeedTicks * 600) / combatSpeedMultiplier;

    useEffect(() => {
        let animationFrameId: number;
        const updateProgress = () => {
            const now = Date.now();
            const timeUntilNext = nextAttackTime - now;
            const elapsed = attackSpeedMs - timeUntilNext;
            const currentProgress = Math.max(0, Math.min(attackSpeedMs, elapsed));
            setProgress(currentProgress);
            if (timeUntilNext > 0) {
                animationFrameId = requestAnimationFrame(updateProgress);
            }
        };
        animationFrameId = requestAnimationFrame(updateProgress);
        return () => cancelAnimationFrame(animationFrameId);
    }, [nextAttackTime, attackSpeedMs]);

    return (
        <div className="w-full">
            <div className="flex justify-between text-xs mb-0.5">
                <span>{label}</span>
                <span>{Math.max(0, (nextAttackTime - Date.now()) / 1000).toFixed(1)}s</span>
            </div>
            <ProgressBar value={progress} maxValue={attackSpeedMs} color={color} />
        </div>
    );
};

const parseChance = (chance: number | string): number => {
    if (typeof chance === 'number') {
        return chance;
    }
    if (typeof chance === 'string') {
        const parts = chance.split('/');
        if (parts.length === 2) {
            const numerator = parseFloat(parts[0]);
            const denominator = parseFloat(parts[1]);
            if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                return numerator / denominator;
            }
        }
    }
    console.warn('Invalid chance format:', chance);
    return 0; // fallback
};

const calculateAccuracy = (attackStat: number, defenceStat: number, accuracyBoost: number = 0) => {
    const attackRoll = attackStat + 8;
    const defenceRoll = defenceStat + 8;
    let hitChance = attackRoll > defenceRoll ? 1 - (defenceRoll / (2 * attackRoll)) : attackRoll / (2 * defenceRoll);
    hitChance = Math.max(0.01, Math.min(0.99, hitChance));
    hitChance *= (1 + accuracyBoost / 100); // Apply percentage boost
    return Math.min(1, hitChance);
};

const playerAttack = (
    playerSkills: (PlayerSkill & { currentLevel: number })[],
    playerStats: any,
    combatStance: CombatStance,
    playerMaxHit: number,
    monster: Monster,
    monsterHp: number,
    activeBuffs: ActiveBuff[],
    addHitSplat: (damage: number | 'miss', options?: { isMaxHit?: boolean, isPoison?: boolean, isMagic?: boolean, isDragonfire?: boolean }) => void,
    setMonsterHp: React.Dispatch<React.SetStateAction<number>>,
    handleMonsterDefeated: (attackStyle: 'melee' | 'ranged' | 'magic') => void,
    addXp: (skill: SkillName, amount: number) => void,
    setAnimationTriggers: React.Dispatch<React.SetStateAction<any[]>>,
    weaponSlot: InventorySlot | null,
    ammoSlot: InventorySlot | null,
    autocastSpell: Spell | null,
    lastSpellCast: Spell | null,
    playerWeapon: { speed: number, type: WeaponType },
    setMonsterStatus: React.Dispatch<React.SetStateAction<MonsterStatusEffect[]>>,
    monsterStatus: MonsterStatusEffect[],
    addLog: (message: string) => void,
    combatSpeedMultiplier: number,
    showHitsplats: boolean,
    onConsumeAmmo: () => void
) => {
    let playerDamage = 0;
    let successfulHit = false;
    let attackStyle: 'melee' | 'ranged' | 'magic' = 'melee';

    const isRangedWeapon = playerWeapon.type === WeaponType.Bow || playerWeapon.type === WeaponType.Crossbow;

    if (isRangedWeapon) {
        if (!ammoSlot || ammoSlot.quantity <= 0) {
            addLog("You have no ammo equipped!");
            return;
        }

        const weaponData = ITEMS[weaponSlot!.itemId];
        const ammoData = ITEMS[ammoSlot.itemId];

        if (weaponData?.equipment?.weaponType === WeaponType.Bow && ammoData?.equipment?.weaponType !== WeaponType.Arrow) {
            addLog("You can only fire arrows with a bow.");
            return;
        }
        if (weaponData?.equipment?.weaponType === WeaponType.Crossbow && ammoData?.equipment?.weaponType !== WeaponType.Bolt) {
            addLog("You can only fire bolts with a crossbow.");
            return;
        }

        if (weaponData?.equipment?.ammoTier) {
            const weaponMaxTier = AMMO_TIER_LEVELS[weaponData.equipment.ammoTier];
            const ammoTier = AMMO_TIER_LEVELS[ammoData.material as string];
            if (ammoTier > weaponMaxTier) {
                addLog(`Your ${weaponData.name} cannot fire ${ammoData.name}.`);
                return;
            }
        }
        
        onConsumeAmmo();
        attackStyle = 'ranged';
        let effectiveRanged = playerSkills.find(s => s.name === SkillName.Ranged)?.currentLevel ?? 1;
        if (combatStance === CombatStance.RangedAccurate) effectiveRanged += 3;
        const accuracyBuff = activeBuffs.find(b => b.type === 'accuracy_boost' && (b.style === 'ranged' || b.style === 'all'));
        const totalRangedAttack = effectiveRanged + playerStats.rangedAttack;
        
        // Symmetrical defence calculation for ranged
        const totalMonsterRangedDefence = monster.defence + monster.rangedDefence;
        const accuracy = calculateAccuracy(totalRangedAttack, totalMonsterRangedDefence, accuracyBuff?.value);
        
        let potentialDamage = 0;
        if (Math.random() < accuracy) { 
            potentialDamage = Math.floor(Math.random() * (playerMaxHit + 1));
            successfulHit = true;
        }
        playerDamage = Math.min(potentialDamage, monsterHp);
    } else { // Melee
        attackStyle = 'melee';
        let effectiveAttack = playerSkills.find(s => s.name === SkillName.Attack)?.currentLevel ?? 1;
        if (combatStance === CombatStance.Accurate) effectiveAttack += 3;

        let playerAttackStyle: 'stab' | 'slash' | 'crush' = 'crush';
        switch (playerWeapon.type) {
            case WeaponType.Dagger: playerAttackStyle = 'stab'; break; case WeaponType.Sword: playerAttackStyle = 'slash'; break; case WeaponType.Scimitar: playerAttackStyle = 'slash'; break; case WeaponType.Axe: playerAttackStyle = 'slash'; break; case WeaponType.Battleaxe: playerAttackStyle = 'slash'; break; case WeaponType.Mace: playerAttackStyle = 'crush'; break; case WeaponType.Warhammer: playerAttackStyle = 'crush'; break; case WeaponType.Unarmed: playerAttackStyle = 'crush'; break; case WeaponType.Staff: playerAttackStyle = 'crush'; break;
        }

        let attackBonus = 0;
        let monsterDefenceBonus = 0;
        switch (playerAttackStyle) {
            case 'stab':
                attackBonus = playerStats.stabAttack;
                monsterDefenceBonus = monster.stabDefence;
                break;
            case 'slash':
                attackBonus = playerStats.slashAttack;
                monsterDefenceBonus = monster.slashDefence;
                break;
            case 'crush':
                attackBonus = playerStats.crushAttack;
                monsterDefenceBonus = monster.crushDefence;
                break;
        }
        const totalAttack = effectiveAttack + attackBonus;
        // Symmetrical defence calculation: monster defence level + monster defence bonus
        const totalMonsterDefence = monster.defence + monsterDefenceBonus;

        const accuracyBuff = activeBuffs.find(b => b.type === 'accuracy_boost' && (b.style === 'melee' || b.style === 'all'));
        const accuracy = calculateAccuracy(totalAttack, totalMonsterDefence, accuracyBuff?.value);
        
        let potentialDamage = 0;
        if (Math.random() < accuracy) {
            potentialDamage = Math.floor(Math.random() * (playerMaxHit + 1));
            successfulHit = true;
        }
        playerDamage = Math.min(potentialDamage, monsterHp);
    }
    
    // Apply flat damage bonus if buff is active
    const flatDamageBuff = activeBuffs.find(b => b.type === 'flat_damage' && (b.style === 'all' || (b.style === 'melee' && !isRangedWeapon) || (b.style === 'ranged' && isRangedWeapon)));
    if (flatDamageBuff && successfulHit) {
        playerDamage += flatDamageBuff.value;
    }
    
    // Apply damage on hit if buff is active
    const damageOnHitBuff = activeBuffs.find(b => b.type === 'damage_on_hit' && (b.style === 'all' || (b.style === 'melee' && !isRangedWeapon) || (b.style === 'ranged' && isRangedWeapon)));
    if (damageOnHitBuff && successfulHit) {
        playerDamage += damageOnHitBuff.value;
    }

    const isMax = successfulHit && playerDamage > 0 && playerDamage === playerMaxHit;

    if (playerDamage > 0) {
        addXp(SkillName.Hitpoints, Math.round(playerDamage * 1.33));
        if (isRangedWeapon) {
            if (combatStance === CombatStance.RangedDefence) { addXp(SkillName.Ranged, playerDamage * 2); addXp(SkillName.Defence, playerDamage * 2); }
            else addXp(SkillName.Ranged, playerDamage * 4);
        } else {
            if (combatStance === CombatStance.Accurate) addXp(SkillName.Attack, playerDamage * 4);
            else if (combatStance === CombatStance.Aggressive) addXp(SkillName.Strength, playerDamage * 4);
            else if (combatStance === CombatStance.Defensive) { addXp(SkillName.Defence, playerDamage * 4); }
        }
    }
    addHitSplat(playerDamage > 0 ? playerDamage : 'miss', { isMaxHit: isMax });
    
    if (successfulHit) {
        let playerAttackStyle: 'stab' | 'slash' | 'crush' = 'crush';
        switch (playerWeapon.type) {
            case WeaponType.Dagger: playerAttackStyle = 'stab'; break;
            case WeaponType.Sword: playerAttackStyle = 'slash'; break;
            case WeaponType.Scimitar: playerAttackStyle = 'slash'; break;
            case WeaponType.Axe: playerAttackStyle = 'slash'; break;
            case WeaponType.Battleaxe: playerAttackStyle = 'slash'; break;
            case WeaponType.Mace: playerAttackStyle = 'crush'; break;
            case WeaponType.Warhammer: playerAttackStyle = 'crush'; break;
            case WeaponType.Unarmed: playerAttackStyle = 'crush'; break;
            case WeaponType.Staff: playerAttackStyle = 'crush'; break;
        }
        setAnimationTriggers(prev => [...prev, {
            id: Date.now() + Math.random(),
            type: isRangedWeapon ? 'ranged' : playerAttackStyle,
            source: 'player',
            target: 'monster',
            options: { arrowType: isRangedWeapon && ammoSlot ? ITEMS[ammoSlot.itemId].material : null }
        }]);
    }

    // New combined poison logic
    const weaponPoison = weaponSlot?.statsOverride?.poisoned;
    const ammoPoison = isRangedWeapon && ammoSlot?.statsOverride?.poisoned;

    // Ammo poison takes priority over weapon poison if both exist (e.g. poisoned bow with poisoned arrows)
    const equipmentPoison = ammoPoison || weaponPoison;
    const potionPoisonBuff = activeBuffs.find(b => b.type === 'poison_on_hit' && (b.style === 'all' || (b.style === 'melee' && !isRangedWeapon) || (b.style === 'ranged' && isRangedWeapon)));

    let poisonToApply: { chance: number, damage: number } | null = null;

    if (equipmentPoison) {
        poisonToApply = { chance: equipmentPoison.chance, damage: equipmentPoison.damage };
    }

    if (potionPoisonBuff) {
        const potionPoison = { chance: potionPoisonBuff.chance ?? 0.25, damage: potionPoisonBuff.value };
        if (!poisonToApply || potionPoison.damage > poisonToApply.damage) {
            poisonToApply = potionPoison;
        }
    }

    if (poisonToApply && successfulHit) {
        if (Math.random() < poisonToApply.chance) {
            const existingStatus = monsterStatus.find(s => s.type === 'poison');
            if (!existingStatus || existingStatus.damagePerTick < poisonToApply.damage) {
                const initialDamage = poisonToApply.damage;
                const poisonTickIntervalSeconds = (15000 / combatSpeedMultiplier) / 1000;
                addLog(`You envenom the ${monster.name}. Next tick in ${poisonTickIntervalSeconds.toFixed(1)} seconds.`);
                
                const otherStatuses = monsterStatus.filter(s => s.type !== 'poison');
                setMonsterStatus([...otherStatuses, { type: 'poison', damagePerTick: initialDamage, ticksApplied: 0 }]);
            }
        }
    }

    const newMonsterHp = Math.max(0, monsterHp - playerDamage);
    setMonsterHp(newMonsterHp);

    if (newMonsterHp <= 0) {
        handleMonsterDefeated(attackStyle);
    }
};

const CombatView: React.FC<CombatViewProps> = ({ monsterQueue, isMandatory, playerSkills, playerHp, equipment, combatStance, setCombatStance, setPlayerHp, onCombatEnd, onFlee, addXp, addLoot, onDropLoot, isAutoBankOn, addLog, onPlayerDeath, onKill, onEncounterWin, onConsumeAmmo, activeBuffs, combatSpeedMultiplier, advanceTutorial, autocastSpell, inv, ui, killTrigger, applyStatModifier, isStunned, addBuff, showPlayerHealthNumbers, showEnemyHealthNumbers, showHitsplats, activePrayers }) => {
    const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
    const currentInstanceId = monsterQueue[currentMonsterIndex];
    const monsterId = currentInstanceId.split(':')[1];
    const [monster, setMonster] = useState<Monster | null>(null);
    const [monsterHp, setMonsterHp] = useState(0);
    const [hitSplats, setHitSplats] = useState<{ id: number; damage: number | 'miss'; target: 'player' | 'monster', isPoison?: boolean, isMagic?: boolean, isDragonfire?: boolean, isMaxHit?: boolean }[]>([]);
    const [playerAttacking, setPlayerAttacking] = useState(false);
    const [monsterAttacking, setMonsterAttacking] = useState(false);
    const [monsterStatus, setMonsterStatus] = useState<MonsterStatusEffect[]>([]);
    const [queuedSpell, setQueuedSpell] = useState<Spell | null>(null);
    const [lastSpellCast, setLastSpellCast] = useState<Spell | null>(null);
    const [currentElementalWeakness, setCurrentElementalWeakness] = useState<SpellElement | null>(null);
    const [nextAttackName, setNextAttackName] = useState<string>('');
    const [nextAttackColor, setNextAttackColor] = useState<string>('bg-yellow-600');
    const [defeatedInThisEncounter, setDefeatedInThisEncounter] = useState<string[]>([]);

    const [nextPlayerAttackTime, setNextPlayerAttackTime] = useState(0);
    const [nextMonsterAttackTime, setNextMonsterAttackTime] = useState(0);
    const [isPreparing, setIsPreparing] = useState(true);
    const [isCombatEnding, setIsCombatEnding] = useState(false);
    
    const playerAttackInProgress = useRef(false);
    const monsterAttackInProgress = useRef(false);

    const playerRef = useRef<HTMLDivElement>(null);
    const monsterRef = useRef<HTMLDivElement>(null);
    const [animationTriggers, setAnimationTriggers] = useState<any[]>([]);
    const prevKillTrigger = useRef(killTrigger);

    const gameTickMs = 600 / combatSpeedMultiplier;
    
    const poisonTickCallback = useRef<(() => void) | undefined>(undefined);

        useEffect(() => {
        setDefeatedInThisEncounter([]);
    }, [monsterQueue]);

    useEffect(() => {
        playerAttackInProgress.current = false;
    }, [nextPlayerAttackTime]);

    useEffect(() => {
        monsterAttackInProgress.current = false;
    }, [nextMonsterAttackTime]);

    const playerWeapon = useMemo(() => {
        const weaponSlot = equipment.weapon;
        if (weaponSlot) {
            const itemData = ITEMS[weaponSlot.itemId];
            if (itemData?.equipment) return { speed: itemData.equipment.speed ?? 4, type: itemData.equipment.weaponType ?? WeaponType.Unarmed };
        }
        return { speed: 4, type: WeaponType.Unarmed };
    }, [equipment.weapon]);

    useEffect(() => {
        const weaponType = playerWeapon.type;
        const isRanged = weaponType === WeaponType.Bow || weaponType === WeaponType.Crossbow;
        const isStaff = weaponType === WeaponType.Staff;
        const isAutocasting = isStaff && autocastSpell && (combatStance === CombatStance.Autocast || combatStance === CombatStance.DefensiveAutocast);
        let attackName = '';
        let attackColor = 'bg-yellow-600';

        const setSpellInfo = (spell: Spell) => {
            attackName = spell.name;
            switch (spell.element) {
                case 'wind': attackColor = 'bg-gray-200'; break;
                case 'water': attackColor = 'bg-blue-300'; break;
                case 'earth': attackColor = 'bg-yellow-900'; break;
                case 'fire': attackColor = 'bg-orange-500'; break;
                default: attackColor = 'bg-purple-500';
            }
        };

        if (queuedSpell) {
            setSpellInfo(queuedSpell);
        } else if (isAutocasting) {
            setSpellInfo(autocastSpell);
        } else if (isRanged) {
            attackName = 'Ranged';
            attackColor = 'bg-green-800';
        } else {
            attackName = 'Melee';
            attackColor = 'bg-red-600';
        }

        setNextAttackName(attackName);
        setNextAttackColor(attackColor);
    }, [combatStance, equipment.weapon, autocastSpell, queuedSpell, playerWeapon.type]);

    const invRef = useRef(inv);
    useEffect(() => { invRef.current = inv; }, [inv]);

    const handleLootDistribution = useCallback(() => {
        if (!monster) return;

        const processLootResult = (lootResult: LootRollResult | string | null) => {
            if (lootResult) {
                const drop: LootRollResult = typeof lootResult === 'string'
                    ? { itemId: lootResult, quantity: 1, noted: false }
                    : lootResult;
                
                if (drop.itemId === 'coins' && equipment.ring?.itemId === 'ring_of_greed') {
                    addLoot(drop.itemId, drop.quantity, false, {});
                    return; // Stop further processing for this item
                }
                
                if (isAutoBankOn) {
                    addLoot(drop.itemId, drop.quantity, false, { noted: drop.noted });
                } else {
                    onDropLoot({ itemId: drop.itemId, quantity: drop.quantity, noted: drop.noted });
                }
            }
        };
    
        // 1. Guaranteed Drops
        monster.guaranteedDrops?.forEach(drop => {
            const quantity = Math.floor(Math.random() * (drop.maxQuantity - drop.minQuantity + 1)) + drop.minQuantity;
            if (drop.itemId) {
                const dropData: LootRollResult = { itemId: drop.itemId, quantity, noted: drop.noted ?? false };
                processLootResult(dropData);
            }
        });
    
        // 2. Main Drops
        if (monster.mainDrops && monster.mainDrops.length > 0) {
            let finalDrop: WeightedDrop | null = null;
    
            if (monster.useWeightedMainDrops) {
                const totalWeight = monster.mainDrops.reduce((sum, item) => sum + parseChance(item.chance), 0);
                if (totalWeight > 0) {
                    let roll = Math.random() * totalWeight;
                    for (const drop of monster.mainDrops) {
                        roll -= parseChance(drop.chance);
                        if (roll <= 0) {
                            finalDrop = drop;
                            break;
                        }
                    }
                }
            } else {
                const successfulDrops: WeightedDrop[] = [];
                for (const drop of monster.mainDrops) {
                    if (Math.random() < parseChance(drop.chance)) {
                        successfulDrops.push(drop);
                    }
                }
        
                if (successfulDrops.length > 0) {
                    let rarestChance = Infinity;
                    successfulDrops.forEach(drop => {
                        const parsed = parseChance(drop.chance);
                        if (parsed < rarestChance) {
                            rarestChance = parsed;
                        }
                    });
                    const potentialRarestDrops = successfulDrops.filter(d => parseChance(d.chance) === rarestChance);
                    finalDrop = potentialRarestDrops[Math.floor(Math.random() * potentialRarestDrops.length)];
                } else if (monster.alwaysDrops) {
                    const totalWeight = monster.mainDrops.reduce((sum, item) => sum + parseChance(item.chance), 0);
                    if (totalWeight > 0) {
                        let roll = Math.random() * totalWeight;
                        for (const drop of monster.mainDrops) {
                            roll -= parseChance(drop.chance);
                            if (roll <= 0) {
                                finalDrop = drop;
                                break;
                            }
                        }
                    } else if (monster.mainDrops.length > 0) {
                        finalDrop = monster.mainDrops[Math.floor(Math.random() * monster.mainDrops.length)];
                    }
                }
            }

            if (finalDrop) {
                if (finalDrop.multiRoll) {
                    const { tableId, maxRolls, rollAgainChance } = finalDrop.multiRoll;
                    let rolls = 1;
                    while (rolls < maxRolls && Math.random() < rollAgainChance) {
                        rolls++;
                    }
                    for (let i = 0; i < rolls; i++) {
                        processLootResult(rollOnLootTable(tableId));
                    }
                } else if (finalDrop.tableId) {
                    processLootResult(rollOnLootTable(finalDrop.tableId));
                } else if (finalDrop.itemId) {
                    const quantity = Math.floor(Math.random() * ((finalDrop.maxQuantity ?? 1) - (finalDrop.minQuantity ?? 1) + 1)) + (finalDrop.minQuantity ?? 1);
                    processLootResult({ itemId: finalDrop.itemId, quantity, noted: finalDrop.noted ?? false });
                }
            }
        }
    
        // 3. Tertiary Drops
        monster.tertiaryDrops?.forEach(drop => {
            if (Math.random() < drop.chance) {
                if (drop.itemId) {
                    const quantity = Math.floor(Math.random() * (drop.maxQuantity - drop.minQuantity + 1)) + drop.minQuantity;
                    processLootResult({ itemId: drop.itemId, quantity, noted: drop.noted ?? false });
                }
            }
        });

        // 4. Global Rare Drop Table
        let rareDropChance = 0;
        if (monster.level >= 80) rareDropChance = 1 / 64;
        else if (monster.level >= 40) rareDropChance = 1 / 96;
        else if (monster.level >= 10) rareDropChance = 1 / 128;
    
        let isFortuneActive = false;
        if (equipment.necklace?.itemId === 'necklace_of_fortune') {
            rareDropChance *= 1.5; // 50% increase
            isFortuneActive = true;
        }

        if (rareDropChance > 0 && Math.random() < rareDropChance) {
            const rareDropResult = rollOnLootTable('global_gem_and_key_table');
            if (rareDropResult) {
                if (isFortuneActive) {
                    addLog("Your Necklace of Fortune glows, guiding your hand to a rare treasure!");
                }

                let itemToDrop: LootRollResult = typeof rareDropResult === 'string' 
                    ? { itemId: rareDropResult, quantity: 1, noted: false } 
                    : rareDropResult;
        
                if (itemToDrop.itemId === 'talisman_drop') {
                    const poiId = currentInstanceId.split(':')[0];
                    const poi = POIS[poiId];
                    const region = poi ? REGIONS[poi.regionId] : null;
                    const isUnderground = region?.type === 'dungeon' || region?.type === 'underground';
                    itemToDrop.itemId = isUnderground ? 'flux_talisman' : 'verdant_talisman';
                }
                
                const itemData = ITEMS[itemToDrop.itemId];
                if (itemData) {
                    processLootResult(itemToDrop);
                }
            }
        }

    }, [monster, isAutoBankOn, addLoot, onDropLoot, addLog, currentInstanceId, ui.activeQuestDetail, equipment.ring, equipment.necklace]);

    useEffect(() => {
        const monsterData = MONSTERS[monsterId];
        if (monsterData) {
            setMonster(monsterData);
            setMonsterHp(monsterData.maxHp);
            setMonsterStatus([]);
            if (monsterData.elementalWeaknessCycle) {
                const initialWeakness = monsterData.elementalWeaknessCycle[0];
                setCurrentElementalWeakness(initialWeakness);
                addLog(`The ${monsterData.name} is vulnerable to ${initialWeakness}!`);
            } else {
                setCurrentElementalWeakness(null);
            }
            if (monsterQueue.length > 1) addLog(`(${currentMonsterIndex + 1}/${monsterQueue.length}) A ${monsterData.name} steps forward!`);
    
            setIsCombatEnding(false);
            setIsPreparing(true);
        }
    }, [currentInstanceId, monsterId, addLog, monsterQueue.length, currentMonsterIndex]);
    
    useEffect(() => {
        if (isPreparing && monster) {
            const preparationTimer = setTimeout(() => {
                const now = Date.now();
                const currentTickMs = 600 / combatSpeedMultiplier;
                setNextPlayerAttackTime(now + playerWeapon.speed * currentTickMs);
                setNextMonsterAttackTime(now + monster.attackSpeed * currentTickMs);
                setIsPreparing(false);
            }, 500);
            return () => clearTimeout(preparationTimer);
        }
    }, [isPreparing, monster, playerWeapon.speed, combatSpeedMultiplier]);

    const playerStats = useMemo(() => {
        const totals = {
            stabAttack: 0, slashAttack: 0, crushAttack: 0, magicAttack: 0, rangedAttack: 0,
            stabDefence: 0, slashDefence: 0, crushDefence: 0, magicDefence: 0, rangedDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0,
        };
        (Object.keys(equipment) as Array<keyof Equipment>).forEach(slotKey => {
            const itemSlot = equipment[slotKey];
            if (itemSlot) {
                const itemData = ITEMS[itemSlot.itemId];
                if (itemData?.equipment) {
                    const eq = itemData.equipment;
                    totals.stabAttack += eq.stabAttack ?? 0;
                    totals.slashAttack += eq.slashAttack ?? 0;
                    totals.crushAttack += eq.crushAttack ?? 0;
                    totals.magicAttack += eq.magicAttack ?? 0;
                    totals.rangedAttack += eq.rangedAttack ?? 0;
                    totals.stabDefence += eq.stabDefence ?? 0;
                    totals.slashDefence += eq.slashDefence ?? 0;
                    totals.crushDefence += eq.crushDefence ?? 0;
                    totals.magicDefence += eq.magicDefence ?? 0;
                    totals.rangedDefence += eq.rangedDefence ?? 0;
                    totals.strengthBonus += eq.strengthBonus ?? 0;
                    totals.rangedStrength += eq.rangedStrength ?? 0;
                    totals.magicDamageBonus += eq.magicDamageBonus ?? 0;
                }
            }
        });
        return totals;
    }, [equipment]);
    
    const addHitSplat = useCallback((damage: number | 'miss', target: 'player' | 'monster', options: { isPoison?: boolean, isMagic?: boolean, isDragonfire?: boolean, isMaxHit?: boolean } = {}) => {
        const id = Date.now() + Math.random();
        setHitSplats(splats => [...splats, { id, damage, target, ...options }]);
        setTimeout(() => setHitSplats(splats => splats.filter(splat => splat.id !== id)), 1500);
    }, []);

    const handleMonsterDefeated = useCallback((attackStyle: 'melee' | 'ranged' | 'magic') => {
        setIsCombatEnding(true);
        setTimeout(() => {
            onKill(currentInstanceId, attackStyle);
            handleLootDistribution();
    
            const newDefeated = [...defeatedInThisEncounter, currentInstanceId];
            setDefeatedInThisEncounter(newDefeated);
    
            if (currentMonsterIndex + 1 < monsterQueue.length) {
                setCurrentMonsterIndex(prev => prev + 1);
            } else {
                setQueuedSpell(null);
                setLastSpellCast(null);
                onEncounterWin(newDefeated);
                onCombatEnd();
            }
        }, 1500);
    }, [currentInstanceId, onKill, handleLootDistribution, defeatedInThisEncounter, currentMonsterIndex, monsterQueue, onEncounterWin, onCombatEnd]);

    const playerMaxHit = useMemo(() => {
        // Ranged
        const weaponType = playerWeapon.type;
        if (weaponType === WeaponType.Bow || weaponType === WeaponType.Crossbow) {
            let effectiveRanged = playerSkills.find(s => s.name === SkillName.Ranged)?.currentLevel ?? 1;
            if (combatStance === CombatStance.RangedAccurate) effectiveRanged += 3;
            const rangedStrengthBonus = playerStats.rangedStrength;
            return Math.ceil(0.5 + effectiveRanged * ((rangedStrengthBonus + 64) / 640));
        }

        // Magic
        const spell = queuedSpell || (autocastSpell && (combatStance === CombatStance.Autocast || combatStance === CombatStance.DefensiveAutocast) ? autocastSpell : null);
        if (spell) {
             const baseMaxHit = spell.maxHit ?? 0;
             const bonus = 1 + (playerStats.magicDamageBonus / 100);
             return Math.floor(baseMaxHit * bonus);
        }

        // Melee
        let effectiveStrength = playerSkills.find(s => s.name === SkillName.Strength)?.currentLevel ?? 1;
        if (combatStance === CombatStance.Aggressive) effectiveStrength += 3;
        const equipmentStrengthBonus = playerStats.strengthBonus;
        return Math.ceil(0.5 + effectiveStrength * ((equipmentStrengthBonus + 64) / 640));
    }, [playerSkills, combatStance, playerStats, autocastSpell, queuedSpell, playerWeapon.type]);

    const monsterMaxHit = useMemo(() => {
        if (!monster) return 0;
    
        if (monster.attackStyle === 'ranged') {
            const monsterRangedStat = monster.ranged ?? monster.attack;
            return monster.customMaxHit ?? Math.floor(monsterRangedStat / 6) + 1;
        }
        if (monster.attackStyle === 'magic') {
            const monsterMagicStat = monster.magic ?? monster.attack;
            return monster.customMaxHit ?? Math.floor(monsterMagicStat / 6) + 1;
        }
    
        // New Symmetrical Melee formula
        // monster.strength is equivalent to player Strength level
        // monster.attack is equivalent to player equipment Strength bonus
        const effectiveStrength = monster.strength;
        const strengthBonus = monster.attack;
        const maxHit = Math.ceil(0.5 + effectiveStrength * ((strengthBonus + 64) / 640));
    
        return monster.customMaxHit ?? maxHit;
    }, [monster]);

    const executeManualCast = useCallback((spell: Spell) => {
        if (isStunned) return;
        if (!monster) return;

        setPlayerAttacking(true);
        setTimeout(() => setPlayerAttacking(false), 300);
        setLastSpellCast(spell);

        const equippedStaff = equipment.weapon ? ITEMS[equipment.weapon.itemId] : null;
        const providedRune = equippedStaff?.equipment?.providesRune;
        const runesNeeded = spell.runes.filter(r => r.itemId !== providedRune);
        
        if (!invRef.current.hasItems(runesNeeded)) {
            addLog(`You don't have enough runes to cast ${spell.name}.`);
            return;
        }

        runesNeeded.forEach(r => invRef.current.modifyItem(r.itemId, -r.quantity, true));

        const xpGains: Partial<Record<SkillName, number>> = {};
        xpGains[SkillName.Magic] = (xpGains[SkillName.Magic] || 0) + spell.xp;

        let effectiveMagic = playerSkills.find(s => s.name === SkillName.Magic)?.currentLevel ?? 1;
        let totalMagicAttack = (effectiveMagic * 2) + playerStats.magicAttack;
        let damageMultiplier = 1.0;
        
        if (currentElementalWeakness && spell.element === currentElementalWeakness) {
            addLog("Your spell hits a weak point!");
            totalMagicAttack *= 3; // Massive accuracy boost
            damageMultiplier = 2.0; // Double damage
        }
        
        const totalMonsterMagicDefence = monster.defence + monster.magicDefence;
        const accuracy = calculateAccuracy(totalMagicAttack, totalMonsterMagicDefence);
        
        let potentialPlayerDamage = 0;
        if (Math.random() < accuracy) { 
            const baseMaxHit = spell.maxHit ?? 0;
            const bonus = 1 + (playerStats.magicDamageBonus / 100);
            const maxHit = Math.floor(baseMaxHit * bonus * damageMultiplier);
            potentialPlayerDamage = Math.floor(Math.random() * (maxHit + 1));
        }
        
        const playerDamage = Math.min(potentialPlayerDamage, monsterHp);
        const maxHitWithoutCrit = Math.floor((spell.maxHit ?? 0) * (1 + (playerStats.magicDamageBonus / 100)));
        const isMax = playerDamage > 0 && playerDamage === maxHitWithoutCrit;

        const spellTier = spell.level > 80 ? 5 : spell.level > 60 ? 4 : spell.level > 40 ? 3 : spell.level > 20 ? 2 : 1;
        setAnimationTriggers(prev => [...prev, { id: Date.now() + Math.random(), type: 'magic', source: 'player', target: 'monster', options: { spellTier, element: spell.element } }]);

        if (playerDamage > 0) {
            xpGains[SkillName.Hitpoints] = (xpGains[SkillName.Hitpoints] || 0) + playerDamage * 1.33;
            xpGains[SkillName.Magic] = (xpGains[SkillName.Magic] || 0) + playerDamage * 2;
        }

        for (const skillName in xpGains) {
            const totalXp = xpGains[skillName as SkillName];
            if (totalXp && totalXp > 0) {
                addXp(skillName as SkillName, Math.round(totalXp));
            }
        }
        
        const newMonsterHp = Math.max(0, monsterHp - playerDamage);
        setMonsterHp(newMonsterHp);
        addHitSplat(playerDamage > 0 ? playerDamage : 'miss', 'monster', { isMaxHit: isMax, isMagic: true });
        
        if (newMonsterHp <= 0) {
            handleMonsterDefeated('magic');
        } else {
            const castTimeTicks = spell.castTime ?? 4;
            setNextPlayerAttackTime(Date.now() + castTimeTicks * gameTickMs);
        }

    }, [monster, equipment.weapon, invRef, addLog, playerSkills, playerStats, monsterHp, addXp, isStunned, currentElementalWeakness, gameTickMs, handleMonsterDefeated]);

    const handleManualCast = useCallback((spell: Spell) => {
        if (isStunned) {
            addLog("You are stunned and cannot cast spells.");
            return;
        }
        if (queuedSpell) {
            return;
        }

        if (Date.now() < nextPlayerAttackTime) {
            setQueuedSpell(spell);
        } else {
            if (!playerAttackInProgress.current) {
                playerAttackInProgress.current = true;
                executeManualCast(spell);
            } else {
                setQueuedSpell(spell);
            }
        }
    }, [isStunned, queuedSpell, nextPlayerAttackTime, executeManualCast, addLog]);

    useEffect(() => {
        if (ui.manualCastTrigger && !isPreparing && monster && playerHp > 0 && monsterHp > 0) {
            handleManualCast(ui.manualCastTrigger);
            ui.setManualCastTrigger(null);
        }
    }, [ui.manualCastTrigger, isPreparing, monster, playerHp, monsterHp, handleManualCast, ui]);
    
    useEffect(() => {
        if (isPreparing || isCombatEnding) return;

        let combatFrameId: number;

        const combatLoop = () => {
            if (isCombatEnding || !monster || playerHp <= 0 || monsterHp <= 0) return;
            const now = Date.now();

            if (now >= nextPlayerAttackTime) {
                if (playerAttackInProgress.current) {
                    combatFrameId = requestAnimationFrame(combatLoop);
                    return;
                }
                playerAttackInProgress.current = true;

                if (isStunned) {
                    addLog("You are stunned and cannot attack.");
                    setNextPlayerAttackTime(now + gameTickMs);
                    combatFrameId = requestAnimationFrame(combatLoop);
                    return;
                }

                if (queuedSpell) {
                    executeManualCast(queuedSpell);
                    setQueuedSpell(null);
                    combatFrameId = requestAnimationFrame(combatLoop);
                    return;
                }
                
                setPlayerAttacking(true);
                setTimeout(() => setPlayerAttacking(false), 300);
                
                const isAutocasting = playerWeapon.type === WeaponType.Staff && autocastSpell && (combatStance === CombatStance.Autocast || combatStance === CombatStance.DefensiveAutocast);
                let attackPerformedThisTick = false;
                
                if (isAutocasting) {
                    let attackStyle: 'melee' | 'ranged' | 'magic' = 'magic';
                    const spell = autocastSpell!;
                    const magicLevel = playerSkills.find(s => s.name === SkillName.Magic)?.currentLevel ?? 1;

                    if (magicLevel < spell.level) {
                        addLog(`Your Magic level is too low to continue casting ${spell.name}. You switch to melee combat.`);
                        setCombatStance(CombatStance.Accurate);
                    } else {
                        const equippedStaff = equipment.weapon ? ITEMS[equipment.weapon.itemId] : null;
                        const providedRune = equippedStaff?.equipment?.weaponType === WeaponType.Staff ? equippedStaff.equipment.providesRune : null;
                        const runesNeeded = spell.runes.filter((r: { itemId: string; quantity: number }) => r.itemId !== providedRune);

                        if (!inv.hasItems(runesNeeded)) {
                            addLog(`You run out of runes for ${spell.name}. Reverting to melee combat.`);
                            setCombatStance(CombatStance.Accurate);
                        } else {
                            attackPerformedThisTick = true;
                            setLastSpellCast(spell);
                            runesNeeded.forEach((r: {itemId: string, quantity: number}) => inv.modifyItem(r.itemId, -r.quantity, true));

                            const xpGains: Partial<Record<SkillName, number>> = {};
                            xpGains[SkillName.Magic] = (xpGains[SkillName.Magic] || 0) + spell.xp;

                            let effectiveMagic = playerSkills.find(s => s.name === SkillName.Magic)?.currentLevel ?? 1;
                            let totalMagicAttack = (effectiveMagic * 2) + playerStats.magicAttack;
                            let damageMultiplier = 1.0;

                            if (currentElementalWeakness && spell.element === currentElementalWeakness) {
                                addLog("Your spell hits a weak point!");
                                totalMagicAttack *= 3;
                                damageMultiplier = 2.0;
                            }
                            
                            const totalMonsterMagicDefence = monster.defence + monster.magicDefence;
                            const accuracy = calculateAccuracy(totalMagicAttack, totalMonsterMagicDefence);
                            
                            let potentialDamage = 0;
                            let successfulHit = false; // Reset just in case
                            if (Math.random() < accuracy) { 
                                const baseMaxHit = spell.maxHit ?? 0;
                                const bonus = 1 + (playerStats.magicDamageBonus / 100);
                                const maxHit = Math.floor(baseMaxHit * bonus * damageMultiplier);
                                potentialDamage = Math.floor(Math.random() * (maxHit + 1));
                                successfulHit = true;
                            }

                            const playerDamage = Math.min(potentialDamage, monsterHp);
                            const isMax = successfulHit && playerDamage > 0 && playerDamage === playerMaxHit;

                            const spellTier = spell.level > 80 ? 5 : spell.level > 60 ? 4 : spell.level > 40 ? 3 : spell.level > 20 ? 2 : 1;
                            setAnimationTriggers(prev => [...prev, { id: Date.now() + Math.random(), type: 'magic', source: 'player', target: 'monster', options: { spellTier, element: spell.element } }]);
                            
                            if (playerDamage > 0) {
                                xpGains[SkillName.Hitpoints] = (xpGains[SkillName.Hitpoints] || 0) + playerDamage * 1.33;
                                if (combatStance === CombatStance.DefensiveAutocast) {
                                    xpGains[SkillName.Magic] = (xpGains[SkillName.Magic] || 0) + playerDamage * 1;
                                    xpGains[SkillName.Defence] = (xpGains[SkillName.Defence] || 0) + playerDamage * 1;
                                } else {
                                    xpGains[SkillName.Magic] = (xpGains[SkillName.Magic] || 0) + playerDamage * 2;
                                }
                            }
                            
                            for (const skillName in xpGains) {
                                const totalXp = xpGains[skillName as SkillName];
                                if (totalXp && totalXp > 0) {
                                    addXp(skillName as SkillName, Math.round(totalXp));
                                }
                            }

                            // Apply poison from spell/buffs
                            if (successfulHit) {
                                 const equipmentPoison = equipment.weapon?.statsOverride?.poisoned;
                                 const potionPoisonBuff = activeBuffs.find(b => b.type === 'poison_on_hit');
                                 let poisonToApply: { chance: number, damage: number } | null = null;
                                 if (equipmentPoison) {
                                    poisonToApply = { chance: equipmentPoison.chance, damage: equipmentPoison.damage };
                                 }
                                 if (potionPoisonBuff) {
                                    const potionPoison = { chance: potionPoisonBuff.chance ?? 0.25, damage: potionPoisonBuff.value };
                                     if (!poisonToApply || potionPoison.damage > poisonToApply.damage) {
                                         poisonToApply = potionPoison;
                                     }
                                 }
                                 if (poisonToApply && Math.random() < poisonToApply.chance) {
                                     const existingStatus = monsterStatus.find(s => s.type === 'poison');
                                     if (!existingStatus || existingStatus.damagePerTick < poisonToApply.damage) {
                                         const initialDamage = poisonToApply.damage;
                                         const poisonTickIntervalSeconds = (15000 / combatSpeedMultiplier) / 1000;
                                         addLog(`You envenom the ${monster.name}. Next tick in ${poisonTickIntervalSeconds.toFixed(1)} seconds.`);
                                         const otherStatuses = monsterStatus.filter(s => s.type !== 'poison');
                                         setMonsterStatus([...otherStatuses, { type: 'poison', damagePerTick: initialDamage, ticksApplied: 0 }]);
                                     }
                                 }
                            }

                            const newMonsterHp = Math.max(0, monsterHp - playerDamage);
                            setMonsterHp(newMonsterHp);
                            if (showHitsplats) addHitSplat(playerDamage > 0 ? playerDamage : 'miss', 'monster', { isMaxHit: isMax, isMagic: true });

                            if (newMonsterHp <= 0) {
                                handleMonsterDefeated(attackStyle);
                            }
                        }
                    }
                }
                
                if (!attackPerformedThisTick) {
                    setLastSpellCast(null);
                    playerAttack(
                        playerSkills, playerStats, combatStance, playerMaxHit, monster, monsterHp, activeBuffs,
                        (damage, options) => showHitsplats && addHitSplat(damage, 'monster', options),
                        setMonsterHp, handleMonsterDefeated, addXp, setAnimationTriggers,
                        equipment.weapon, equipment.ammo, autocastSpell, lastSpellCast, playerWeapon,
                        setMonsterStatus, monsterStatus, addLog, combatSpeedMultiplier, showHitsplats,
                        onConsumeAmmo
                    );
                }
                
                const speedBuff = activeBuffs.find(b => b.type === 'attack_speed_boost');
                let effectiveSpeed = playerWeapon.speed;
                if (speedBuff) effectiveSpeed = Math.max(1, effectiveSpeed + speedBuff.value);
                if ((playerWeapon.type === WeaponType.Bow || playerWeapon.type === WeaponType.Crossbow) && combatStance === CombatStance.RangedRapid) {
                    effectiveSpeed = Math.max(1, effectiveSpeed - 1);
                }
                setNextPlayerAttackTime(now + effectiveSpeed * gameTickMs);
            }

            if (now >= nextMonsterAttackTime && monsterHp > 0) {
                if (monsterAttackInProgress.current) {
                    combatFrameId = requestAnimationFrame(combatLoop);
                    return;
                }
                monsterAttackInProgress.current = true;

                setMonsterAttacking(true);
                setTimeout(() => setMonsterAttacking(false), 300);
            
                let monsterDamage = 0;
                let monsterHit = false;
                let isDragonfireAttack = false;
                let isMagicAttack = monster.attackStyle === 'magic';
                let triggeredSpecial: MonsterSpecialAttack | null = null;
                let performNormalAttack = true;

                let prayerProtected = false;
                if (monster.attackStyle === 'magic' && activePrayers.includes('protect_from_magic')) {
                    prayerProtected = true;
                } else if (monster.attackStyle === 'ranged' && activePrayers.includes('protect_from_ranged')) {
                    prayerProtected = true;
                } else if (['stab', 'slash', 'crush'].includes(monster.attackStyle) && activePrayers.includes('protect_from_melee')) {
                    prayerProtected = true;
                }
                
                if (prayerProtected) {
                    monsterDamage = 0;
                    monsterHit = false;
                    addLog("Your prayer absorbs the damage!");
                    performNormalAttack = false;
                } else {
                    if (monster.specialAttacks) {
                        for (const special of monster.specialAttacks) {
                            if (Math.random() < special.chance) {
                                triggeredSpecial = special;
                                break;
                            }
                        }
                    }

                    if (triggeredSpecial) {
                        addLog(`The ${monster.name} uses ${triggeredSpecial.name}!`);
                        switch (triggeredSpecial.effect) {
                            case 'stun':
                                addBuff({ type: 'stun', value: 0, duration: triggeredSpecial.duration });
                                performNormalAttack = false;
                                break;
                            case 'magic_bypass_defence':
                                isMagicAttack = true;
                                const effectiveDefence = playerSkills.find(s => s.name === SkillName.Magic)?.level ?? 1;
                                const monsterAttackStat = monster.magic ?? monster.attack;
                                const monsterAccuracy = calculateAccuracy(monsterAttackStat, effectiveDefence);
                                if (Math.random() < monsterAccuracy) {
                                    monsterHit = true;
                                    monsterDamage = Math.floor(Math.random() * (triggeredSpecial.maxHit + 1));
                                }
                                performNormalAttack = false;
                                break;
                            case 'stat_drain': {
                                const skillToDrain = triggeredSpecial.skill;
                                const skillData = playerSkills.find(s => s.name === skillToDrain);
                                applyStatModifier(skillToDrain, triggeredSpecial.value, 60000, skillData?.level ?? 1);
                                break;
                            }
                            case 'stat_drain_multi':
                                triggeredSpecial.skills.forEach(drain => {
                                    const skillData = playerSkills.find(s => s.name === drain.skill);
                                    applyStatModifier(drain.skill, drain.value, 60000, skillData?.level ?? 1);
                                });
                                break;
                            case 'elemental_shift':
                                if (monster.elementalWeaknessCycle && currentElementalWeakness) {
                                    const cycle = monster.elementalWeaknessCycle;
                                    const currentIndex = cycle.indexOf(currentElementalWeakness);
                                    const nextIndex = (currentIndex + 1) % cycle.length;
                                    const newWeakness = cycle[nextIndex];
                                    setCurrentElementalWeakness(newWeakness);
                                    addLog(`The ${monster.name} shifts its attunement to ${newWeakness}!`);
                                }
                                performNormalAttack = false;
                                break;
                            case 'damage_multiplier':
                                // This will be handled after the normal damage calculation.
                                break;
                            case 'poison': {
                                const applyPoisonChance = triggeredSpecial.poisonChance ?? 1;
                                if (Math.random() < applyPoisonChance) {
                                    addBuff({ type: 'poison', value: triggeredSpecial.damage, duration: Number.MAX_SAFE_INTEGER });
                                } else {
                                    addLog(`The ${monster.name}'s venomous attack misses its mark!`);
                                }
                                performNormalAttack = false;
                                break;
                            }
                        }
                    }
                
                    if (performNormalAttack) {
                        if (monster.types.includes(MonsterType.Dragon) && Math.random() < 0.3) {
                            isDragonfireAttack = true;
                            monsterHit = true;
                            const dragonfireMaxHit = 60;
                            monsterDamage = Math.floor(Math.random() * (dragonfireMaxHit + 1));
                            addLog(`The ${monster.name} unleashes a blast of dragonfire!`);
                            
                            const antiFirePotionActive = activeBuffs.some(b => b.type === 'antifire');
                            const dragonfireResistance = equipment.shield ? ITEMS[equipment.shield.itemId]?.equipment?.resistsDragonfire : undefined;

                            if (dragonfireResistance !== undefined && antiFirePotionActive) {
                                monsterDamage = 0;
                                const shieldName = ITEMS[equipment.shield!.itemId].name;
                                addLog(`Your ${shieldName} and antifire potion completely negate the dragonfire!`);
                            } else if (dragonfireResistance !== undefined) {
                                monsterDamage = Math.floor(monsterDamage * dragonfireResistance);
                                const shieldName = ITEMS[equipment.shield!.itemId].name;
                                addLog(`Your ${shieldName} absorbs a large portion of the fiery breath!`);
                            } else if (antiFirePotionActive) {
                                monsterDamage = Math.floor(monsterDamage * 0.5);
                                addLog("Your antifire potion protects you from the worst of the heat.");
                            }

                        } else {
                            let effectiveDefence: number;
                            if (monster.attackStyle === 'magic') {
                                effectiveDefence = playerSkills.find(s => s.name === SkillName.Magic)?.currentLevel ?? 1;
                                if (combatStance === CombatStance.DefensiveAutocast) {
                                    effectiveDefence += 3;
                                }
                            } else {
                                effectiveDefence = playerSkills.find(s => s.name === SkillName.Defence)?.currentLevel ?? 1;
                                if ([CombatStance.Defensive, CombatStance.RangedDefence].includes(combatStance)) {
                                    effectiveDefence += 3;
                                }
                            }

                            let playerDefenceBonus = 0;
                            let monsterAttackStat = monster.attack;
                            switch(monster.attackStyle) {
                                case 'stab': playerDefenceBonus = playerStats.stabDefence; monsterAttackStat = monster.attack; break;
                                case 'slash': playerDefenceBonus = playerStats.slashDefence; monsterAttackStat = monster.attack; break;
                                case 'crush': playerDefenceBonus = playerStats.crushDefence; monsterAttackStat = monster.attack; break;
                                case 'ranged': playerDefenceBonus = playerStats.rangedDefence; monsterAttackStat = monster.ranged ?? monster.attack; break;
                                case 'magic': playerDefenceBonus = playerStats.magicDefence; monsterAttackStat = monster.magic ?? monster.attack; break;
                            }
                            const evasionBuff = activeBuffs.find(b => b.type === 'evasion_boost');
                            let totalDefence = effectiveDefence + Math.floor(playerDefenceBonus * 0.5);
                            if (evasionBuff) totalDefence = Math.floor(totalDefence * (1 + evasionBuff.value / 100));
                            const monsterAccuracy = calculateAccuracy(monsterAttackStat, totalDefence);
                            
                            if (Math.random() < monsterAccuracy) {
                                monsterHit = true;
                                monsterDamage = Math.floor(Math.random() * (monsterMaxHit + 1));
                            }
                        }

                        if (triggeredSpecial?.effect === 'damage_multiplier') {
                            monsterDamage = Math.floor(monsterDamage * triggeredSpecial.value);
                        }
                    }
                }
            
                if (monsterHit && !prayerProtected) {
                    setAnimationTriggers(prev => [...prev, { id: Date.now() + Math.random(), type: isDragonfireAttack ? 'magic' : monster.attackStyle, source: 'monster', target: 'player', options: { spellTier: isDragonfireAttack ? 5 : (monster.level > 30 ? 3 : (monster.level > 10 ? 2 : 1)), element: isDragonfireAttack ? 'fire' : null } }]);
                }
            
                const reductionBuff = activeBuffs.find(b => b.type === 'damage_reduction');
                if (reductionBuff) {
                    monsterDamage = Math.floor(monsterDamage * (1 - reductionBuff.value / 100));
                }

                if (showHitsplats) {
                    if (prayerProtected) {
                        addHitSplat('miss', 'player', {});
                    } else if (performNormalAttack || triggeredSpecial?.effect === 'magic_bypass_defence') {
                        const isMax = monsterHit && monsterDamage > 0 && monsterDamage === monsterMaxHit;
                        if (monsterHit) {
                            addHitSplat(monsterDamage, 'player', { isMaxHit: isMax, isMagic: !isDragonfireAttack && isMagicAttack, isDragonfire: isDragonfireAttack });
                        } else {
                            addHitSplat('miss', 'player', {});
                        }
                    }
                }
            
                const newPlayerHp = Math.max(0, playerHp - monsterDamage);
                setPlayerHp(newPlayerHp);
            
                if (newPlayerHp <= 0) {
                    setIsCombatEnding(true);
                    setTimeout(() =>  1500);
                    combatFrameId = requestAnimationFrame(combatLoop);
                    return;
                }
                
                if (monsterDamage > 0) {
                    addXp(SkillName.Defence, Math.round(monsterDamage * 4));
            
                    const isMeleeAttack = !isDragonfireAttack && (monster.attackStyle === 'stab' || monster.attackStyle === 'slash' || monster.attackStyle === 'crush');
                    const hasSpikedCape = equipment.cape?.itemId === 'spiked_cape';
                    const recoilBuff = activeBuffs.find(b => b.type === 'recoil');
            
                    let recoilDamage = 0;
                    let recoilSource = '';
            
                    if (recoilBuff && isMeleeAttack) {
                        recoilDamage = Math.ceil(monsterDamage * (recoilBuff.value / 100));
                        recoilSource = 'Your potion';
                    } else if (hasSpikedCape && isMeleeAttack && Math.random() < 0.1) {
                        recoilDamage = Math.ceil(monsterDamage * 0.1);
                        recoilSource = 'Your cape';
                    }
            
                    if (recoilDamage > 0 && monsterHp > 0) {
                        const recoilDamageToDeal = Math.min(recoilDamage, monsterHp);
                        const monsterHpAfterRecoil = Math.max(0, monsterHp - recoilDamageToDeal);
                        setMonsterHp(monsterHpAfterRecoil);
                        if (showHitsplats) addHitSplat(recoilDamageToDeal, 'monster', {});
                        addLog(`${recoilSource} recoils, dealing ${recoilDamageToDeal} damage to the ${monster.name}!`);
            
                        if (monsterHpAfterRecoil <= 0) {
                            handleMonsterDefeated('melee');
                            combatFrameId = requestAnimationFrame(combatLoop);
                            return;
                        }
                    }
                }

                if (monsterHit && monster.poisonsOnHit && Math.random() < monster.poisonsOnHit.chance) {
                    addBuff({
                        type: 'poison',
                        value: monster.poisonsOnHit.damage,
                        duration: Number.MAX_SAFE_INTEGER
                    });
                }
                
                setNextMonsterAttackTime(now + monster.attackSpeed * gameTickMs);
            }
            

            combatFrameId = requestAnimationFrame(combatLoop);
        };

        combatFrameId = requestAnimationFrame(combatLoop);
        return () => cancelAnimationFrame(combatFrameId);
    }, [
        isPreparing, isCombatEnding, monster, playerHp, monsterHp, equipment, combatStance, 
        playerSkills, addXp, addLog, onCombatEnd, onKill, onEncounterWin, onConsumeAmmo, playerWeapon, playerStats, monsterQueue,
        currentMonsterIndex, nextPlayerAttackTime, nextMonsterAttackTime, activeBuffs, monsterStatus,
        handleLootDistribution, autocastSpell, inv, ui, onPlayerDeath, applyStatModifier, isStunned, addBuff,
        currentElementalWeakness, handleMonsterDefeated, playerMaxHit, lastSpellCast,
        combatSpeedMultiplier, showHitsplats, activePrayers
    ]);
    
    useEffect(() => {
        poisonTickCallback.current = () => {
            const currentMonster = monster;
            if (!currentMonster || isCombatEnding || monsterHp <= 0) return;
    
            const poison = monsterStatus.find(s => s.type === 'poison');
            if (!poison) return;
            
            const damageToDeal = poison.damagePerTick;
            if (damageToDeal <= 0) return;
    
            // Apply damage
            setMonsterHp(currentHp => {
                if (currentHp <= 0) return 0;
                const newHp = Math.max(0, currentHp - damageToDeal);
                if (showHitsplats) {
                    addHitSplat(damageToDeal, 'monster', { isPoison: true });
                }
                if (newHp <= 0 && currentHp > 0) {
                    const isMagic = lastSpellCast !== null || (autocastSpell && (combatStance === 'Autocast' || combatStance === 'Defensive Cast'));
                    const isRanged = playerWeapon.type === WeaponType.Bow;
                    handleMonsterDefeated(isMagic ? 'magic' : isRanged ? 'ranged' : 'melee');
                }
                return newHp;
            });
    
            // Update status for next tick
            setMonsterStatus(prevStatus => {
                const currentPoison = prevStatus.find(s => s.type === 'poison');
                if (!currentPoison) return prevStatus;
    
                const newTicksApplied = currentPoison.ticksApplied + 1;
                
                if (newTicksApplied >= 2) {
                    const newDamage = currentPoison.damagePerTick - 1;
                    if (newDamage <= 0) {
                        addLog(`The poison on the ${currentMonster.name} has worn off.`);
                        return prevStatus.filter(s => s.type !== 'poison');
                    }
                    return prevStatus.map(s => s.type === 'poison' ? { ...s, damagePerTick: newDamage, ticksApplied: 0 } : s);
                } else {
                    return prevStatus.map(s => s.type === 'poison' ? { ...s, ticksApplied: newTicksApplied } : s);
                }
            });
        };
    });

    useEffect(() => {
        const poisonTickInterval = 15000 / combatSpeedMultiplier;
        const timer = setInterval(() => {
            poisonTickCallback.current?.();
        }, poisonTickInterval);

        return () => clearInterval(timer);
    }, [combatSpeedMultiplier]);


    useEffect(() => {
        if (killTrigger > prevKillTrigger.current && monsterHp > 0 && monster) {
            addLog("DEV: Monster killed by dev command.");
            setMonsterHp(0); 
            handleMonsterDefeated('melee');
        }
        prevKillTrigger.current = killTrigger;
    }, [killTrigger, monsterHp, monster, addLog, handleMonsterDefeated]);

    const handleFlee = useCallback(() => {
        if (isStunned) { addLog("You are stunned and cannot flee."); return; }
        setQueuedSpell(null);
        setLastSpellCast(null);
        onFlee(defeatedInThisEncounter);
    }, [onFlee, isStunned, defeatedInThisEncounter]);

    const monsterIconClass = useMemo(() => {
        if (monster?.id === 'arcane_wyvern' && currentElementalWeakness) {
            switch (currentElementalWeakness) {
                case 'wind': return getIconClassName({ material: 'rune-gust' } as Item);
                case 'water': return getIconClassName({ material: 'rune-aqua' } as Item);
                case 'earth': return getIconClassName({ material: 'rune-verdant' } as Item);
                case 'fire': return getIconClassName({ material: 'rune-ember' } as Item);
                default: return '';
            }
        }
        return '';
    }, [monster, currentElementalWeakness]);

    if (!monster) return <div>Loading combat...</div>;

    const maxHp = playerSkills.find(s => s.name === SkillName.Hitpoints)?.level ?? 10;

    return (
        <div className={`flex flex-col items-center justify-between h-full text-center animate-fade-in relative`}>
            {isPreparing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <h2 className="text-3xl font-bold text-red-500 animate-pulse">PREPARE FOR BATTLE!</h2>
                </div>
            )}
            <AttackAnimationEngine 
                triggers={animationTriggers} 
                playerRef={playerRef} 
                monsterRef={monsterRef}
                onAnimationComplete={(id) => setAnimationTriggers(prev => prev.filter(t => t.id !== id))}
            />
            <h2 className="text-xl md:text-2xl font-bold text-red-500">
                Fighting: {monster.name} (Lvl {monster.level})
                {monsterQueue.length > 1 && ` (${currentMonsterIndex + 1}/${monsterQueue.length})`}
            </h2>
            
            <div className="flex justify-around items-center w-full">
                <div className="flex flex-col items-center w-32 md:w-48">
                    <div ref={playerRef} className="relative">
                        <img src="https://api.iconify.design/game-icons:person.svg" alt="Player" className={`w-24 h-24 md:w-32 md:h-32 p-2 bg-gray-900 border-4 border-gray-600 rounded-lg filter invert transition-transform duration-150 pixelated-image ${playerAttacking ? 'scale-110' : ''}`} />
                         {showHitsplats && hitSplats.filter(s => s.target === 'player').map(splat => <HitSplat key={splat.id} {...splat} />)}
                    </div>
                    <span className="font-bold mt-2">You</span>
                    <div className="relative w-full mt-1">
                        <ProgressBar value={playerHp} maxValue={maxHp} isHealthBar />
                        {showPlayerHealthNumbers && <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white pointer-events-none" style={{ textShadow: '1px 1px 2px black' }}>{playerHp} / {maxHp}</div>}
                    </div>
                </div>

                <span className="text-2xl md:text-4xl font-extrabold text-gray-500 animate-pulse">VS</span>

                <div className="flex flex-col items-center w-32 md:w-48">
                    <div ref={monsterRef} className="relative">
                        <div className={`w-24 h-24 md:w-32 md:h-32 p-2 bg-gray-900 border-4 border-gray-600 rounded-lg transition-transform duration-150 ${monsterAttacking ? 'scale-110' : 'scale-100'}`}>
                            <img src={monster.iconUrl} alt={monster.name} className={`w-full h-full pixelated-image ${monsterIconClass}`} />
                        </div>
                        {showHitsplats && hitSplats.filter(s => s.target === 'monster').map(splat => <HitSplat key={splat.id} {...splat} />)}
                    </div>
                    <span className="font-bold mt-2">{monster.name}</span>
                    <div className="relative w-full mt-1">
                        <ProgressBar value={monsterHp} maxValue={monster.maxHp} isHealthBar />
                        {showEnemyHealthNumbers && <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white pointer-events-none" style={{ textShadow: '1px 1px 2px black' }}>{monsterHp} / {monster.maxHp}</div>}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-md bg-black/50 p-3 rounded-lg space-y-3">
                <SmoothCombatCooldownBar label={`Your next attack: ${nextAttackName}`} nextAttackTime={nextPlayerAttackTime} attackSpeedTicks={playerWeapon.speed} combatSpeedMultiplier={combatSpeedMultiplier} color={nextAttackColor} />
                <SmoothCombatCooldownBar label="Monster Next Attack" nextAttackTime={nextMonsterAttackTime} attackSpeedTicks={monster.attackSpeed} combatSpeedMultiplier={combatSpeedMultiplier} color="bg-gray-600" />
            </div>
            
            <div className="flex flex-col items-center gap-4 mt-2">
                <Button onClick={handleFlee} variant="secondary" disabled={isMandatory || isPreparing || isCombatEnding || isStunned}>
                    {isStunned ? 'Stunned' : (isMandatory ? 'Cannot Flee' : 'Flee')}
                </Button>
            </div>
        </div>
    );
};

export default CombatView;
