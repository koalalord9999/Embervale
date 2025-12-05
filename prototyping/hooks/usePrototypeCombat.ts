import { useState, useCallback, useRef } from 'react';
import { WorldEntity } from '../worldData';
import { MONSTERS, ITEMS } from '../../constants';
import { InventorySlot, SkillName, GroundItem, Equipment, CombatStance, WeaponType, PlayerSkill } from '../../types';
import { HumanoidModel } from '../humanoidModel';
import { PlayerModel } from '../playerModel';

export interface TechDemoCombatState {
    entity: WorldEntity;
    monsterId: string;
}

export interface HitSplatInfo {
    id: number;
    damage: number | 'miss';
    target: 'player' | 'monster';
    isPoison?: boolean;
    createdAt: number;
}

interface CombatDependencies {
    playerHp: number;
    playerMaxHp: number;
    setPlayerHp: React.Dispatch<React.SetStateAction<number>>;
    skills: (PlayerSkill & { currentLevel: number; })[];
    equipment: Equipment;
    combatStance: CombatStance;
    addLog: (msg: string) => void;
    addXp: (skill: SkillName, amount: number) => void;
    playerRef: React.RefObject<PlayerModel>;
    humanoidsRef: React.RefObject<HumanoidModel[]>;
    setGroundItems: React.Dispatch<React.SetStateAction<Record<string, GroundItem[]>>>;
    setMonsterRespawnTimers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    onCombatEnd: () => void;
}

const calculateAccuracy = (attackStat: number, defenceStat: number): number => {
    const attackRoll = attackStat + 8;
    const defenceRoll = defenceStat + 8;
    let hitChance = attackRoll > defenceRoll ? 1 - (defenceRoll / (2 * attackRoll)) : attackRoll / (2 * defenceRoll);
    hitChance = Math.max(0.01, Math.min(0.99, hitChance));
    return Math.min(1, hitChance);
};

export const usePrototypeCombat = (deps: CombatDependencies) => {
    const { playerHp, playerMaxHp, setPlayerHp, skills, equipment, combatStance, addLog, addXp, playerRef, humanoidsRef, setGroundItems, setMonsterRespawnTimers, onCombatEnd } = deps;

    const [activeCombat, setActiveCombat] = useState<TechDemoCombatState | null>(null);
    const [hitsplats, setHitsplats] = useState<HitSplatInfo[]>([]);
    const nextTick = useRef(Date.now());
    const isPlayerTurnRef = useRef(true);

    const onRemoveHitsplat = useCallback((id: number) => {
        setHitsplats(prev => prev.filter(h => h.id !== id));
    }, []);

    const handleHitsplat = useCallback((damage: number | 'miss', target: 'player' | 'monster', isPoison: boolean = false) => {
        const id = Date.now() + Math.random();
        setHitsplats(prev => [...prev, { id, damage, target, isPoison, createdAt: Date.now() }]);
    }, []);

    const handleMonsterKill = useCallback((entity: WorldEntity) => {
        if (!entity.monsterId) return;
        const monsterData = MONSTERS[entity.monsterId];
        if (!monsterData) return;

        addLog(`You defeated the ${monsterData.name}!`);
        setActiveCombat(null);
        setHitsplats([]);
        addXp(SkillName.Slayer, monsterData.maxHp);

        const humanoid = humanoidsRef.current?.find(h => h.id === entity.id);
        if (!humanoid) return;

        const deathX = humanoid.gridX;
        const deathY = humanoid.gridY;

        if (monsterData.respawnTime) {
            addLog(`${entity.name} will respawn in ${monsterData.respawnTime / 1000} seconds.`);
            setMonsterRespawnTimers(prev => ({
                ...prev,
                [entity.id]: Date.now() + monsterData.respawnTime,
            }));
            humanoid.state = 'dead';
            humanoid.aggroTargetId = null;
            humanoid.aggroTimeout = 0;
            humanoid.setPath([]);
        }

        const loot: InventorySlot[] = [];
        if (monsterData.guaranteedDrops) {
            monsterData.guaranteedDrops.forEach(drop => {
                if (drop.itemId) loot.push({ itemId: drop.itemId, quantity: drop.minQuantity || 1 });
            });
        }
        if (monsterData.mainDrops && monsterData.mainDrops.length > 0) {
            const drop = monsterData.mainDrops[Math.floor(Math.random() * monsterData.mainDrops.length)];
            if (drop.itemId) loot.push({ itemId: drop.itemId, quantity: drop.minQuantity || 1 });
        }
        
        if (loot.length > 0) {
            const key = `${deathX},${deathY}`;
            const newGroundItems: GroundItem[] = loot.map(item => ({
                item,
                uniqueId: Date.now() + Math.random(),
                expiresAt: Date.now() + 120000 
            }));
            setGroundItems(prev => ({ ...prev, [key]: [...(prev[key] || []), ...newGroundItems] }));
            addLog(`The ${entity.name} dropped loot.`);
        }
    }, [addLog, addXp, humanoidsRef, setGroundItems, setMonsterRespawnTimers]);

    const handleCombat = useCallback((entity: WorldEntity) => {
        if (entity.monsterId) {
            const monsterModel = humanoidsRef.current?.find(h => h.id === entity.id);
            if (!monsterModel) return;

            monsterModel.aggroTargetId = 'player';
            monsterModel.aggroTimeout = 0;

            setActiveCombat({ entity, monsterId: entity.monsterId });
            addLog(`You are fighting the ${entity.name}!`);
            isPlayerTurnRef.current = true;
            nextTick.current = Date.now();
        }
    }, [addLog, humanoidsRef]);

    const handleCombatEnd = useCallback(() => {
        setActiveCombat(null);
        setHitsplats([]);
        onCombatEnd();
    }, [onCombatEnd]);
    
    const runCombatTick = useCallback(() => {
        if (!activeCombat || !playerRef.current || !humanoidsRef.current) return;
        const now = Date.now();
        if (now < nextTick.current) return;

        const player = playerRef.current;
        const monsterModel = humanoidsRef.current.find(h => h.id === activeCombat.entity.id);
        if (!monsterModel || monsterModel.hp <= 0 || playerHp <= 0) {
            handleCombatEnd();
            return;
        }

        const weapon = equipment.weapon ? ITEMS[equipment.weapon.itemId] : null;
        
        if (isPlayerTurnRef.current) {
            const dx = Math.abs(player.gridX - monsterModel.gridX);
            const dy = Math.abs(player.gridY - monsterModel.gridY);
            if (dx > 1 || dy > 1 || (dx + dy) > 1) {
                isPlayerTurnRef.current = !isPlayerTurnRef.current;
                nextTick.current = now + 600;
                return;
            }

            const strLevel = skills.find(s => s.name === SkillName.Strength)?.currentLevel || 1;
            const strBonus = weapon?.equipment?.strengthBonus || 0;
            const playerMaxHit = Math.ceil(0.5 + strLevel * ((strBonus + 64) / 640));

            const attLevel = skills.find(s => s.name === SkillName.Attack)?.currentLevel || 1;
            const attBonus = weapon?.equipment?.stabAttack || 0;
            const monsterDef = monsterModel.maxHp > 0 ? MONSTERS[activeCombat.monsterId].defence + MONSTERS[activeCombat.monsterId].stabDefence : 1;
            const accuracy = calculateAccuracy(attLevel + attBonus, monsterDef);

            let playerDamage = 0;
            if (Math.random() < accuracy) {
                playerDamage = Math.floor(Math.random() * (playerMaxHit + 1));
            }
            
            monsterModel.hp = Math.max(0, monsterModel.hp - playerDamage);
            handleHitsplat(playerDamage > 0 ? playerDamage : 'miss', 'monster');
            
            if (playerDamage > 0) {
                addXp(SkillName.Hitpoints, Math.floor(playerDamage * 1.33));
                if (combatStance === 'Accurate') addXp(SkillName.Attack, playerDamage * 4);
                else if (combatStance === 'Aggressive') addXp(SkillName.Strength, playerDamage * 4);
                else if (combatStance === 'Defensive') addXp(SkillName.Defence, playerDamage * 4);
            }
            if (monsterModel.hp <= 0) { handleMonsterKill(activeCombat.entity); return; }
            
            const speed = weapon?.equipment?.speed || 4;
            nextTick.current = now + speed * 600;
        } else {
            const dx = Math.abs(player.gridX - monsterModel.gridX);
            const dy = Math.abs(player.gridY - monsterModel.gridY);
            if (dx > 1 || dy > 1 || (dx + dy) > 1) {
                isPlayerTurnRef.current = !isPlayerTurnRef.current;
                nextTick.current = now + 600;
                return;
            }

            const monster = MONSTERS[activeCombat.monsterId];
            const monsterMaxHit = Math.ceil(0.5 + monster.strength * ((monster.attack + 64) / 640));
            const defLevel = skills.find(s => s.name === SkillName.Defence)?.currentLevel || 1;
            const playerDef = defLevel + (equipment.body ? ITEMS[equipment.body.itemId]?.equipment?.stabDefence || 0 : 0);
            const monsterAcc = calculateAccuracy(monster.attack, playerDef);
            
            let monsterDamage = 0;
            if (Math.random() < monsterAcc) {
                monsterDamage = Math.floor(Math.random() * (monsterMaxHit + 1));
            }

            const newPlayerHp = Math.max(0, playerHp - monsterDamage);
            setPlayerHp(newPlayerHp);
            handleHitsplat(monsterDamage > 0 ? monsterDamage : 'miss', 'player');
            if (monsterDamage > 0) addXp(SkillName.Defence, Math.floor(monsterDamage * 1.33));
            if (newPlayerHp <= 0) { addLog("You have been defeated!"); handleCombatEnd(); return; }

            nextTick.current = now + monster.attackSpeed * 600;
        }

        isPlayerTurnRef.current = !isPlayerTurnRef.current;
    }, [activeCombat, playerRef, humanoidsRef, playerHp, handleCombatEnd, equipment, skills, combatStance, handleHitsplat, addXp, handleMonsterKill, setPlayerHp, addLog]);

    return {
        activeCombat,
        setActiveCombat,
        hitsplats,
        handleCombat,
        handleMonsterKill,
        handleCombatEnd,
        handleHitsplat,
        onRemoveHitsplat,
        runCombatTick,
        handleMonsterStateUpdate: () => {}, // Obsolete, models handle their state
    };
};
