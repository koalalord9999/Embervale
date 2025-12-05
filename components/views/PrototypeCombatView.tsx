import React, { useState, useEffect } from 'react';
import { Monster, PlayerSkill, Equipment, CombatStance, SkillName, InventorySlot } from '../../types';
import { MONSTERS, ITEMS } from '../../constants';

interface PrototypeCombatViewProps {
    monsterId: string;
    playerHp: number;
    setPlayerHp: React.Dispatch<React.SetStateAction<number>>;
    skills: (PlayerSkill & { currentLevel: number })[];
    equipment: Equipment;
    addXp: (skill: SkillName, amount: number) => void;
    addLoot: (itemId: string, quantity: number) => void;
    onCombatEnd: () => void;
    addLog: (message: string) => void;
    // New callbacks for canvas visualization
    onMonsterStateUpdate: (hp: number, maxHp: number) => void;
    onHitsplat: (damage: number | 'miss', target: 'player' | 'monster', isPoison?: boolean) => void;
}

const calculateAccuracy = (attackStat: number, defenceStat: number) => {
    const attackRoll = attackStat + 8;
    const defenceRoll = defenceStat + 8;
    let hitChance = attackRoll > defenceRoll ? 1 - (defenceRoll / (2 * attackRoll)) : attackRoll / (2 * defenceRoll);
    hitChance = Math.max(0.01, Math.min(0.99, hitChance));
    return Math.min(1, hitChance);
};

const PrototypeCombatView: React.FC<PrototypeCombatViewProps> = ({
    monsterId, playerHp, setPlayerHp, skills, equipment, addXp, addLoot, onCombatEnd, addLog,
    onMonsterStateUpdate, onHitsplat
}) => {
    const [monster, setMonster] = useState<Monster | null>(null);
    const [monsterHp, setMonsterHp] = useState(0);
    const [nextTick, setNextTick] = useState(0);

    // Initialize Monster
    useEffect(() => {
        const data = MONSTERS[monsterId];
        if (data) {
            setMonster(data);
            setMonsterHp(data.maxHp);
            onMonsterStateUpdate(data.maxHp, data.maxHp);
            addLog(`You attack the ${data.name}!`);
        }
    }, [monsterId, addLog]);

    // Combat Loop
    useEffect(() => {
        if (!monster || playerHp <= 0 || monsterHp <= 0) return;

        const now = Date.now();
        if (now < nextTick) {
            const timeout = setTimeout(() => setNextTick(now), nextTick - now);
            return () => clearTimeout(timeout);
        }

        // 1. Player Attack
        const strLevel = skills.find(s => s.name === SkillName.Strength)?.currentLevel || 1;
        const weapon = equipment.weapon ? ITEMS[equipment.weapon.itemId] : null;
        const strBonus = weapon?.equipment?.strengthBonus || 0;
        const playerMaxHit = Math.ceil(0.5 + strLevel * ((strBonus + 64) / 640));

        const attLevel = skills.find(s => s.name === SkillName.Attack)?.currentLevel || 1;
        const attBonus = weapon?.equipment?.stabAttack || 0; 
        const monsterDef = monster.defence + monster.stabDefence;
        const accuracy = calculateAccuracy(attLevel + attBonus, monsterDef);

        let playerDamage = 0;
        if (Math.random() < accuracy) {
            playerDamage = Math.floor(Math.random() * (playerMaxHit + 1));
        }

        const newMonsterHp = Math.max(0, monsterHp - playerDamage);
        setMonsterHp(newMonsterHp);
        onMonsterStateUpdate(newMonsterHp, monster.maxHp);
        
        if (playerDamage > 0) {
            addLog(`You hit the ${monster.name} for ${playerDamage} damage.`);
            addXp(SkillName.Hitpoints, Math.floor(playerDamage * 1.33));
            addXp(SkillName.Strength, playerDamage * 4);
            onHitsplat(playerDamage, 'monster');
        } else {
            addLog(`You miss the ${monster.name}.`);
            onHitsplat('miss', 'monster');
        }

        if (newMonsterHp <= 0) {
            addLog(`You defeated the ${monster.name}!`);
            if (monster.guaranteedDrops) {
                monster.guaranteedDrops.forEach(drop => {
                    if (drop.itemId) addLoot(drop.itemId, drop.minQuantity || 1);
                });
            }
            if (monster.mainDrops && monster.mainDrops.length > 0) {
                 const drop = monster.mainDrops[Math.floor(Math.random() * monster.mainDrops.length)];
                 if (drop.itemId) addLoot(drop.itemId, drop.minQuantity || 1);
            }
            setTimeout(onCombatEnd, 1000);
            return;
        }

        // 2. Monster Attack
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

        if (monsterDamage > 0) {
             addLog(`The ${monster.name} hits you for ${monsterDamage} damage!`);
             onHitsplat(monsterDamage, 'player');
        } else {
             addLog(`The ${monster.name} misses you.`);
             onHitsplat('miss', 'player');
        }

        if (newPlayerHp <= 0) {
             addLog("You have been defeated!");
             setTimeout(onCombatEnd, 1000);
             return;
        }

        setNextTick(Date.now() + 2400);

    }, [monster, playerHp, monsterHp, nextTick, skills, equipment, addXp, addLoot, addLog, onCombatEnd, onMonsterStateUpdate, onHitsplat]);

    return null; // No UI rendered by this component anymore
};

export default PrototypeCombatView;