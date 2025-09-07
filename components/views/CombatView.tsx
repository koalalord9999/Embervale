

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Monster, PlayerSkill, SkillName, Equipment, CombatStance, WeaponType, MonsterType } from '../../types';
import { MONSTERS, ITEMS, rollOnLootTable } from '../../constants';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { ActiveBuff } from '../../hooks/useCharacter';

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
    addXp: (skill: SkillName, amount: number) => void;
    addLoot: (itemId: string, quantity: number) => void;
    addLog: (message: string) => void;
    onPlayerDeath: () => void;
    onKill: (uniqueInstanceId: string) => void;
    onConsumeAmmo: () => void;
    activeBuffs: ActiveBuff[];
    combatSpeedMultiplier: number;
}

interface MonsterStatusEffect {
    type: 'poison';
    damagePerTick: number;
    ticksLeft: number;
}

const HitSplat: React.FC<{ damage: number | 'miss', isPoison?: boolean }> = ({ damage, isPoison = false }) => {
    const isMiss = damage === 'miss';
    const color = isMiss ? 'text-white' : (isPoison ? 'text-green-400' : 'text-yellow-400');
    const text = isMiss ? 'Miss' : damage;
    const [style, setStyle] = useState({ top: '50%', left: '50%', opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' });

    useEffect(() => {
        const top = `${Math.random() * 60 + 20}%`;
        const left = `${Math.random() * 60 + 20}%`;
        setStyle({ top, left, opacity: 1, transform: 'translate(-50%, -50%) scale(1)' });
        const timer = setTimeout(() => {
            setStyle(s => ({ ...s, opacity: 0, top: `${parseInt(s.top) - 20}%` }));
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`absolute font-bold text-3xl pointer-events-none transition-all duration-500 ease-out drop-shadow-lg`}
            style={{ ...style, WebkitTextStroke: '1.5px black' }}
        >
            <span className={color}>{text}</span>
        </div>
    );
};

const SmoothCombatCooldownBar: React.FC<{ label: string, nextAttackTime: number, attackSpeedTicks: number, combatSpeedMultiplier: number }> = ({ label, nextAttackTime, attackSpeedTicks, combatSpeedMultiplier }) => {
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
            <ProgressBar value={progress} maxValue={attackSpeedMs} color="bg-yellow-600" />
        </div>
    );
};


const CombatView: React.FC<CombatViewProps> = ({ monsterQueue, isMandatory, playerSkills, playerHp, equipment, combatStance, setCombatStance, setPlayerHp, onCombatEnd, addXp, addLoot, addLog, onPlayerDeath, onKill, onConsumeAmmo, activeBuffs, combatSpeedMultiplier }) => {
    const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
    const currentInstanceId = monsterQueue[currentMonsterIndex];
    const monsterId = currentInstanceId.split(':')[1];
    const [monster, setMonster] = useState<Monster | null>(null);
    const [monsterHp, setMonsterHp] = useState(0);
    const [hitSplats, setHitSplats] = useState<{ id: number; damage: number | 'miss'; target: 'player' | 'monster', isPoison?: boolean }[]>([]);
    const [playerAttacking, setPlayerAttacking] = useState(false);
    const [monsterAttacking, setMonsterAttacking] = useState(false);
    const [monsterStatus, setMonsterStatus] = useState<MonsterStatusEffect[]>([]);

    const [nextPlayerAttackTime, setNextPlayerAttackTime] = useState(0);
    const [nextMonsterAttackTime, setNextMonsterAttackTime] = useState(0);
    const [isPreparing, setIsPreparing] = useState(true);

    const gameTickMs = 600 / combatSpeedMultiplier;

    const playerWeapon = useMemo(() => {
        const weaponSlot = equipment.weapon;
        if (weaponSlot) {
            const itemData = ITEMS[weaponSlot.itemId];
            if (itemData?.equipment) return { speed: itemData.equipment.speed ?? 4, type: itemData.equipment.weaponType ?? WeaponType.Unarmed };
        }
        return { speed: 4, type: WeaponType.Unarmed };
    }, [equipment.weapon]);
    const isRangedWeapon = playerWeapon.type === WeaponType.Bow;

    useEffect(() => {
        const monsterData = MONSTERS[monsterId];
        if (monsterData) {
            setMonster(monsterData);
            setMonsterHp(monsterData.maxHp);
            setMonsterStatus([]);
            if (monsterQueue.length > 1) addLog(`(${currentMonsterIndex + 1}/${monsterQueue.length}) A ${monsterData.name} steps forward!`);
            else if (!isMandatory) addLog(`You are now fighting a ${monsterData.name}!`);

            const preparationTimer = setTimeout(() => {
                const now = Date.now();
                setNextPlayerAttackTime(now + playerWeapon.speed * gameTickMs);
                setNextMonsterAttackTime(now + monsterData.attackSpeed * gameTickMs);
                setIsPreparing(false);
            }, 500);

            return () => clearTimeout(preparationTimer);
        }
    }, [currentInstanceId, playerWeapon.speed, addLog, isMandatory, monsterQueue.length, currentMonsterIndex, gameTickMs]);

    const playerStats = useMemo(() => {
        const totals = {
            stabAttack: 0, slashAttack: 0, crushAttack: 0, magicAttack: 0, rangedAttack: 0,
            stabDefence: 0, slashDefence: 0, crushDefence: 0, magicDefence: 0, rangedDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0,
        };
        Object.values(equipment).forEach(itemSlot => {
            if (itemSlot) {
                const itemData = ITEMS[itemSlot.itemId];
                if (itemData?.equipment) {
                    const eq = itemData.equipment;
                    totals.stabAttack += eq.stabAttack;
                    totals.slashAttack += eq.slashAttack;
                    totals.crushAttack += eq.crushAttack;
                    totals.magicAttack += eq.magicAttack;
                    totals.rangedAttack += eq.rangedAttack;
                    totals.stabDefence += eq.stabDefence;
                    totals.slashDefence += eq.slashDefence;
                    totals.crushDefence += eq.crushDefence;
                    totals.magicDefence += eq.magicDefence;
                    totals.rangedDefence += eq.rangedDefence;
                    totals.strengthBonus += eq.strengthBonus;
                    totals.rangedStrength += eq.rangedStrength;
                    totals.magicDamageBonus += eq.magicDamageBonus;
                }
            }
        });
        return totals;
    }, [equipment]);
    
    const addHitSplat = (damage: number | 'miss', target: 'player' | 'monster', isPoison: boolean = false) => {
        const id = Date.now() + Math.random();
        setHitSplats(splats => [...splats, { id, damage, target, isPoison }]);
        setTimeout(() => setHitSplats(splats => splats.filter(splat => splat.id !== id)), 1500);
    };

    const calculateAccuracy = (attackStat: number, defenceStat: number, accuracyBoost: number = 0) => {
        const attackRoll = attackStat + 8;
        const defenceRoll = defenceStat + 8;
        let hitChance = attackRoll > defenceRoll ? 1 - (defenceRoll / (2 * attackRoll)) : attackRoll / (2 * defenceRoll);
        hitChance = Math.max(0.01, Math.min(0.99, hitChance));
        hitChance *= (1 + accuracyBoost / 100); // Apply percentage boost
        return Math.min(1, hitChance);
    };

    useEffect(() => {
        if (isPreparing) return;

        let combatFrameId: number;

        const combatLoop = () => {
            if (!monster || playerHp <= 0 || monsterHp <= 0) return;
            const now = Date.now();

            if (now >= nextPlayerAttackTime) {
                setPlayerAttacking(true);
                setTimeout(() => setPlayerAttacking(false), 300);
                let playerDamage = 0;
                
                const speedBuff = activeBuffs.find(b => b.type === 'attack_speed_boost');
                let effectiveSpeed = playerWeapon.speed;
                if (speedBuff) effectiveSpeed = Math.max(1, effectiveSpeed + speedBuff.value);
        
                if (isRangedWeapon) {
                    if (!equipment.ammo) { addLog("You have no arrows equipped."); setNextPlayerAttackTime(now + effectiveSpeed * gameTickMs); } 
                    else {
                        let effectiveRanged = playerSkills.find(s => s.name === SkillName.Ranged)?.currentLevel ?? 1;
                        if (combatStance === CombatStance.RangedAccurate) effectiveRanged += 3;
                        if (combatStance === CombatStance.RangedRapid) effectiveSpeed = Math.max(1, effectiveSpeed - 1);
                        const totalRangedAttack = effectiveRanged + playerStats.rangedAttack;
                        const accuracy = calculateAccuracy(totalRangedAttack, monster.rangedDefence);
                        const maxHit = Math.floor(effectiveRanged / 10 + playerStats.rangedStrength / 8);
                        if (Math.random() < accuracy) playerDamage = Math.floor(Math.random() * (maxHit + 1));
                        onConsumeAmmo();
                    }
                } else {
                    let effectiveAttack = playerSkills.find(s => s.name === SkillName.Attack)?.currentLevel ?? 1;
                    let effectiveStrength = playerSkills.find(s => s.name === SkillName.Strength)?.currentLevel ?? 1;
                    if (combatStance === CombatStance.Accurate) effectiveAttack += 3;
                    if (combatStance === CombatStance.Aggressive) effectiveStrength += 3;

                    let playerAttackStyle: 'stab' | 'slash' | 'crush' = 'crush'; // default
                    switch (playerWeapon.type) {
                        case WeaponType.Dagger: playerAttackStyle = 'stab'; break;
                        case WeaponType.Sword: playerAttackStyle = 'slash'; break;
                        case WeaponType.Scimitar: playerAttackStyle = 'slash'; break;
                        case WeaponType.Axe: playerAttackStyle = 'slash'; break;
                        case WeaponType.Battleaxe: playerAttackStyle = 'slash'; break;
                        case WeaponType.Mace: playerAttackStyle = 'crush'; break;
                        case WeaponType.Warhammer: playerAttackStyle = 'crush'; break;
                        case WeaponType.Unarmed: playerAttackStyle = 'crush'; break;
                    }

                    let attackBonus = 0;
                    let monsterDefence = 0;
                    switch (playerAttackStyle) {
                        case 'stab':
                            attackBonus = playerStats.stabAttack;
                            monsterDefence = monster.stabDefence;
                            break;
                        case 'slash':
                            attackBonus = playerStats.slashAttack;
                            monsterDefence = monster.slashDefence;
                            break;
                        case 'crush':
                            attackBonus = playerStats.crushAttack;
                            monsterDefence = monster.crushDefence;
                            break;
                    }
                    const accuracyBuff = activeBuffs.find(b => b.type === 'accuracy_boost' && (b.style === 'melee' || b.style === 'all'));
                    const totalAttack = effectiveAttack + attackBonus;
                    const accuracy = calculateAccuracy(totalAttack, monsterDefence, accuracyBuff?.value);
                    const equipmentStrengthBonus = playerStats.strengthBonus;
                    const maxHit = Math.ceil(0.5 + effectiveStrength * ((equipmentStrengthBonus + 64) / 640));
                    if (Math.random() < accuracy) playerDamage = Math.floor(Math.random() * (maxHit + 1));
                }

                let isCrushingBlow = false;
                if (playerDamage > 0 && playerWeapon.type === WeaponType.Mace && monster.monsterType === MonsterType.Armored) {
                    if (Math.random() < 0.25) { // 25% chance
                        isCrushingBlow = true;
                        playerDamage = Math.floor(playerDamage * 1.5);
                    }
                }

                const flatDamageBuff = activeBuffs.find(b => b.type === 'flat_damage');
                if (flatDamageBuff && playerDamage > 0) {
                    playerDamage += flatDamageBuff.value;
                }
                const damageOnHitBuff = activeBuffs.find(b => b.type === 'damage_on_hit');
                if (damageOnHitBuff && playerDamage > 0) {
                    playerDamage += damageOnHitBuff.value;
                }
                
                const poisonBuff = activeBuffs.find(b => b.type === 'poison_on_hit');
                if (poisonBuff && playerDamage > 0 && Math.random() < (poisonBuff.chance ?? 1)) {
                    setMonsterStatus(prev => {
                        if (prev.some(e => e.type === 'poison')) return prev; // Don't stack poison
                        addLog(`You envenom the ${monster.name}!`);
                        return [...prev, { type: 'poison', damagePerTick: poisonBuff.value, ticksLeft: poisonBuff.duration / gameTickMs }];
                    });
                }

                const newMonsterHp = Math.max(0, monsterHp - playerDamage);
                setMonsterHp(newMonsterHp);
                addHitSplat(playerDamage > 0 ? playerDamage : 'miss', 'monster');
                if (playerDamage > 0) {
                    if (isCrushingBlow) {
                        addLog(`Your mace lands a crushing blow on the ${monster.name} for ${playerDamage} damage!`);
                    } else {
                        addLog(`You hit the ${monster.name} for ${playerDamage} damage.`);
                    }
                    if (isRangedWeapon) addXp(SkillName.Ranged, playerDamage * 4);
                    else {
                        if (combatStance === CombatStance.Accurate) addXp(SkillName.Attack, playerDamage * 4);
                        if (combatStance === CombatStance.Aggressive) addXp(SkillName.Strength, playerDamage * 4);
                        if (combatStance === CombatStance.Defensive) addXp(SkillName.Defence, playerDamage * 4);
                    }
                    addXp(SkillName.Hitpoints, playerDamage * 1.33);
                } else { addLog(`You miss the ${monster.name}.`); }
        
                if (newMonsterHp <= 0) {
                    addLog(`You have defeated the ${monster.name}!`);
                    onKill(currentInstanceId);
                    monster.drops.forEach(drop => {
                        if (Math.random() < drop.chance) {
                            if (drop.tableId) {
                                const itemFromTable = rollOnLootTable(drop.tableId);
                                if (itemFromTable) {
                                    addLoot(itemFromTable, 1);
                                }
                            } else if (drop.itemId) {
                                const quantity = Math.floor(Math.random() * (drop.maxQuantity! - drop.minQuantity! + 1)) + drop.minQuantity!;
                                addLoot(drop.itemId, quantity);
                            }
                        }
                    });
                    if (currentMonsterIndex + 1 < monsterQueue.length) setCurrentMonsterIndex(prev => prev + 1);
                    else { if(monsterQueue.length > 1) addLog("You have cleared the area!"); onCombatEnd(); }
                }
                setNextPlayerAttackTime(now + effectiveSpeed * gameTickMs);
            }

            if (now >= nextMonsterAttackTime && monsterHp > 0) {
                setMonsterAttacking(true);
                setTimeout(() => setMonsterAttacking(false), 300);
                let effectiveDefence = playerSkills.find(s => s.name === SkillName.Defence)?.currentLevel ?? 1;
                if (combatStance === CombatStance.Defensive || combatStance === CombatStance.RangedDefence) effectiveDefence += 3;
                
                let playerDefenceBonus = 0;
                switch(monster.attackStyle) {
                    case 'stab': playerDefenceBonus = playerStats.stabDefence; break;
                    case 'slash': playerDefenceBonus = playerStats.slashDefence; break;
                    case 'crush': playerDefenceBonus = playerStats.crushDefence; break;
                    case 'ranged': playerDefenceBonus = playerStats.rangedDefence; break;
                    case 'magic': playerDefenceBonus = playerStats.magicDefence; break;
                }
                
                const evasionBuff = activeBuffs.find(b => b.type === 'evasion_boost');
                let totalDefence = effectiveDefence + Math.floor(playerDefenceBonus * 0.5);
                if (evasionBuff) totalDefence = Math.floor(totalDefence * (1 + evasionBuff.value / 100));

                const monsterAccuracy = calculateAccuracy(monster.attack, totalDefence);
                const monsterMaxHit = Math.floor(monster.attack / 4) + 1;
                let monsterDamage = 0;
                if (Math.random() < monsterAccuracy) {
                    monsterDamage = Math.floor(Math.random() * (monsterMaxHit + 1));
                    const specialAttack = monster.specialAttacks?.[0];
                    if (specialAttack && Math.random() < specialAttack.chance) {
                        addLog(`The ${monster.name} uses ${specialAttack.name}!`);
                        if (specialAttack.effect === 'damage_multiplier') monsterDamage = Math.floor(monsterDamage * specialAttack.value);
                    }
                }

                const reductionBuff = activeBuffs.find(b => b.type === 'damage_reduction');
                if (reductionBuff) {
                    monsterDamage = Math.floor(monsterDamage * (1 - reductionBuff.value / 100));
                }

                const newPlayerHp = Math.max(0, playerHp - monsterDamage);
                setPlayerHp(newPlayerHp);
                addHitSplat(monsterDamage > 0 ? monsterDamage : 'miss', 'player');
                if (monsterDamage > 0) {
                    addLog(`The ${monster.name} hits you for ${monsterDamage} damage.`);
                    if (combatStance !== CombatStance.RangedDefence) addXp(SkillName.Defence, monsterDamage * 2);

                    const isMeleeAttack = monster.attackStyle === 'stab' || monster.attackStyle === 'slash' || monster.attackStyle === 'crush';
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
                        const monsterHpAfterRecoil = Math.max(0, monsterHp - recoilDamage);
                        setMonsterHp(monsterHpAfterRecoil);
                        addHitSplat(recoilDamage, 'monster');
                        addLog(`${recoilSource} recoils, dealing ${recoilDamage} damage to the ${monster.name}!`);
                        addXp(SkillName.Defence, recoilDamage * 4);

                        if (monsterHpAfterRecoil <= 0) {
                            addLog(`You have defeated the ${monster.name}!`);
                            onKill(currentInstanceId);
                            monster.drops.forEach(drop => {
                                if (Math.random() < drop.chance) {
                                    const quantity = Math.floor(Math.random() * (drop.maxQuantity! - drop.minQuantity! + 1)) + drop.minQuantity!;
                                    addLoot(drop.itemId!, quantity);
                                }
                            });
                            if (currentMonsterIndex + 1 < monsterQueue.length) {
                                setCurrentMonsterIndex(prev => prev + 1);
                            } else {
                                if (monsterQueue.length > 1) addLog("You have cleared the area!");
                                onCombatEnd();
                            }
                        }
                    }
                } else { addLog(`The ${monster.name} misses you.`); }
                if (newPlayerHp <= 0) onPlayerDeath();
                setNextMonsterAttackTime(now + monster.attackSpeed * gameTickMs);
            }

            // Apply monster status effects
            if (monsterStatus.length > 0 && monsterHp > 0) {
                const newEffects: MonsterStatusEffect[] = [];
                let totalPoisonDamage = 0;

                for (const effect of monsterStatus) {
                    if (effect.type === 'poison') {
                        totalPoisonDamage += effect.damagePerTick;
                        effect.ticksLeft--;
                        if (effect.ticksLeft > 0) {
                            newEffects.push(effect);
                        }
                    }
                }

                if (totalPoisonDamage > 0) {
                    const monsterHpAfterPoison = Math.max(0, monsterHp - totalPoisonDamage);
                    setMonsterHp(monsterHpAfterPoison);
                    addHitSplat(totalPoisonDamage, 'monster', true);
                    addLog(`The ${monster.name} takes ${totalPoisonDamage} poison damage.`);
                    if (monsterHpAfterPoison <= 0) {
                        addLog(`The poison was fatal. You have defeated the ${monster.name}!`);
                        onKill(currentInstanceId);
                        monster.drops.forEach(drop => { if (Math.random() < drop.chance) { addLoot(drop.itemId!, 1); } });
                        if (currentMonsterIndex + 1 < monsterQueue.length) setCurrentMonsterIndex(prev => prev + 1);
                        else onCombatEnd();
                    }
                }
                setMonsterStatus(newEffects);
            }

            combatFrameId = requestAnimationFrame(combatLoop);
        };

        combatFrameId = requestAnimationFrame(combatLoop);
        return () => cancelAnimationFrame(combatFrameId);
    }, [isPreparing, monster, playerHp, monsterHp, equipment, combatStance, playerSkills, addXp, addLog, onCombatEnd, onKill, onConsumeAmmo, isRangedWeapon, playerWeapon.speed, playerStats, monsterQueue, currentMonsterIndex, nextPlayerAttackTime, nextMonsterAttackTime, activeBuffs, monsterStatus, gameTickMs]);

    if (!monster) return <div>Loading combat...</div>;

    const maxHp = playerSkills.find(s => s.name === SkillName.Hitpoints)?.level ?? 10;
    const availableStances = isRangedWeapon ? [CombatStance.RangedAccurate, CombatStance.RangedRapid, CombatStance.RangedDefence] : [CombatStance.Accurate, CombatStance.Aggressive, CombatStance.Defensive];

    return (
        <div className={`flex flex-col items-center justify-between h-full text-center animate-fade-in relative`}>
            {isPreparing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <h2 className="text-3xl font-bold text-red-500 animate-pulse">PREPARE FOR BATTLE!</h2>
                </div>
            )}
            <h2 className="text-2xl font-bold text-red-500">
                Fighting: {monster.name} (Lvl {monster.level})
                {monsterQueue.length > 1 && ` (${currentMonsterIndex + 1}/${monsterQueue.length})`}
            </h2>
            
            <div className="flex justify-around items-center w-full">
                <div className="flex flex-col items-center w-48">
                    <div className="relative">
                        <img src="https://api.iconify.design/game-icons:person.svg" alt="Player" className={`w-32 h-32 p-2 bg-gray-900 border-4 border-gray-600 rounded-lg filter invert transition-transform duration-150 pixelated-image ${playerAttacking ? 'scale-110' : 'scale-100'}`} />
                         {hitSplats.filter(s => s.target === 'player').map(splat => <HitSplat key={splat.id} damage={splat.damage} />)}
                    </div>
                    <span className="font-bold mt-2">You</span>
                    <div className="relative w-full mt-1">
                        <ProgressBar value={playerHp} maxValue={maxHp} isHealthBar />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white pointer-events-none" style={{ textShadow: '1px 1px 2px black' }}>{playerHp} / {maxHp}</div>
                    </div>
                </div>

                <span className="text-4xl font-extrabold text-gray-500 animate-pulse">VS</span>

                <div className="flex flex-col items-center w-48">
                    <div className="relative">
                        <img src={monster.iconUrl} alt={monster.name} className={`w-32 h-32 p-2 bg-gray-900 border-4 border-gray-600 rounded-lg transition-transform duration-150 pixelated-image ${monsterAttacking ? 'scale-110' : 'scale-100'}`} />
                        {hitSplats.filter(s => s.target === 'monster').map(splat => <HitSplat key={splat.id} damage={splat.damage} isPoison={splat.isPoison} />)}
                    </div>
                    <span className="font-bold mt-2">{monster.name}</span>
                    <div className="relative w-full mt-1">
                        <ProgressBar value={monsterHp} maxValue={monster.maxHp} isHealthBar />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white pointer-events-none" style={{ textShadow: '1px 1px 2px black' }}>{monsterHp} / {monster.maxHp}</div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-md bg-black/50 p-3 rounded-lg space-y-3">
                <SmoothCombatCooldownBar label="Your Next Attack" nextAttackTime={nextPlayerAttackTime} attackSpeedTicks={playerWeapon.speed} combatSpeedMultiplier={combatSpeedMultiplier} />
                <SmoothCombatCooldownBar label="Monster Next Attack" nextAttackTime={nextMonsterAttackTime} attackSpeedTicks={monster.attackSpeed} combatSpeedMultiplier={combatSpeedMultiplier} />
            </div>
            
            <div className="flex flex-col items-center gap-4">
                 <div className="flex gap-2">
                    {availableStances.map(stance => (
                        <Button key={stance} size="sm" variant={combatStance === stance ? 'primary' : 'secondary'} onClick={() => setCombatStance(stance)}>
                            {stance.replace('Ranged ', '')}
                        </Button>
                    ))}
                </div>
                <Button onClick={() => onCombatEnd()} variant="secondary" disabled={isMandatory || isPreparing}>
                    {isMandatory ? 'Cannot Flee' : 'Flee'}
                </Button>
            </div>
        </div>
    );
};

export default CombatView;