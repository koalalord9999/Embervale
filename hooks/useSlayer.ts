
import { useState, useCallback } from 'react';
import { PlayerSlayerTask, SkillName, PlayerQuestState, QuestId } from '../types';
import { MONSTERS } from '../constants';

interface SlayerDependencies {
    addLog: (message: string) => void;
    addXp: (skill: SkillName, amount: number) => void;
    modifyItem: (itemId: string, quantity: number) => void;
    combatLevel: number;
}

interface SlayerAssignment {
    monsterId: string;
    questReq?: {
        questId: QuestId;
        status?: 'completed' | 'in_progress';
        stage?: number;
    };
}

const SLAYER_MONSTERS_BY_LEVEL: Record<number, SlayerAssignment[]> = {
    1: [
        { monsterId: 'giant_rat' }, { monsterId: 'cow' }, { monsterId: 'chicken' },
        { monsterId: 'goblin' }, { monsterId: 'spider' },
    ],
    10: [
        { monsterId: 'cloaked_bandit' }, { monsterId: 'highwayman' }, { monsterId: 'wild_boar' }, { monsterId: 'wolf' },
        { monsterId: 'deranged_botanist' },
    ],
    20: [
        { monsterId: 'harpy' }, { monsterId: 'mountain_goat' }, { monsterId: 'bear' },
        { monsterId: 'young_hill_giant' }, { monsterId: 'fey_sprite' }, { monsterId: 'treant_sapling' },
        { monsterId: 'glimmerhorn_stag' }, { monsterId: 'forest_spirit' },
    ],
    30: [
        { monsterId: 'swamp_horror' }, { monsterId: 'salt_flat_skitterer' }, { monsterId: 'salt_leaper' },
        { monsterId: 'sand_scrabbler' }, { monsterId: 'salt_preserved_vulture' }, { monsterId: 'fouthian_guard' },
        { monsterId: 'sunscale_serpent' },
    ],
    40: [
        { monsterId: 'sunstone_golem' }, { monsterId: 'bog_serpent' }, { monsterId: 'jungle_stalker' }, { monsterId: 'abyssal_leech' },
        { monsterId: 'brine_elemental' }, { monsterId: 'crystalline_tortoise' }, { monsterId: 'tidal_crawler' }, { monsterId: 'siren' },
        { monsterId: 'plains_lion' },
        { monsterId: 'chasm_crawler', questReq: { questId: 'depths_of_despair', status: 'in_progress', stage: 1 } },
    ],
    50: [
        { monsterId: 'fire_fiend' }, { monsterId: 'sunken_zombie' },
        { monsterId: 'spire_sentry', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'mana_wisp', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'lesser_crystal_construct', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'arcane_familiar', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
    ],
    60: [
        { monsterId: 'abyssal_knight' }, { monsterId: 'dune_stalker' }, { monsterId: 'oasis_croc' },
        { monsterId: 'ice_imp' },
        { monsterId: 'runic_guardian', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
    ],
    70: [
        { monsterId: 'greater_incubus' }, { monsterId: 'skeletal' }, { monsterId: 'grave_revenant' }, { monsterId: 'ancient_sentinel' },
        { monsterId: 'water_weird' }, { monsterId: 'temple_spirit' }, { monsterId: 'rime_coated_serpent' },
        { monsterId: 'tundra_stalker' }, { monsterId: 'the_abyssal_warden' }, { monsterId: 'yeti' },
        { monsterId: 'ice_troll' }, { monsterId: 'ice_elemental' }, { monsterId: 'glacial_wyrm' },
        { monsterId: 'temple_guardian' }, { monsterId: 'blazing_efreeti' },
        { monsterId: 'spire_spellweaver', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'greater_mana_wisp', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'enchanted_tome', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'grove_dragon'}, { monsterId: 'frosthide_dragon', questReq: { questId: 'the_frozen_gate', status: 'completed' } },
    ],
    85: [ 
        { monsterId: 'succubus' }, { monsterId: 'arcane_wyvern', questReq: { questId: 'the_arcane_awakening', stage: 8} },
        { monsterId: 'greater_crystal_construct', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'arcane_elemental', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
        { monsterId: 'spire_justicar', questReq: { questId: 'the_arcane_awakening', stage: 8 } },
    ],
    100: [
        { monsterId: 'emberscale_dragon' }, { monsterId: 'deathscythe' }, { monsterId: 'corrupted_grove_dragon' },
    ],
};


const getAssignableMonsters = (combatLevel: number, playerQuests: PlayerQuestState[]): string[] => {
    let available: string[] = [];
    for (const level in SLAYER_MONSTERS_BY_LEVEL) {
        if (combatLevel >= parseInt(level)) {
            const assignments = SLAYER_MONSTERS_BY_LEVEL[level as any];
            for (const assignment of assignments) {
                if (assignment.questReq) {
                    const playerQuest = playerQuests.find(q => q.questId === assignment.questReq!.questId);
                    if (!playerQuest) continue;

                    if (assignment.questReq.status === 'completed') {
                        if (!playerQuest.isComplete) continue;
                    } else if (assignment.questReq.status === 'in_progress') {
                        if (playerQuest.isComplete) continue; 
                        if (assignment.questReq.stage !== undefined && playerQuest.currentStage < assignment.questReq.stage) {
                            continue;
                        }
                    } else if (assignment.questReq.stage !== undefined) { // New logic for just checking stage
                        if (playerQuest.currentStage < assignment.questReq.stage && !playerQuest.isComplete) {
                            continue;
                        }
                    }
                }
                available.push(assignment.monsterId);
            }
        }
    }
    return available.length > 0 ? available : SLAYER_MONSTERS_BY_LEVEL[1].map(a => a.monsterId);
};


export const useSlayer = (initialTask: PlayerSlayerTask | null, playerQuests: PlayerQuestState[], deps: SlayerDependencies) => {
    const [slayerTask, setSlayerTask] = useState<PlayerSlayerTask | null>(initialTask);
    const { addLog, addXp, modifyItem, combatLevel } = deps;

    const getTask = useCallback(() => {
        const assignable = getAssignableMonsters(combatLevel, playerQuests);
        const monsterId = assignable[Math.floor(Math.random() * assignable.length)];
        const monster = MONSTERS[monsterId];
        
        let requiredCount: number;
        if (monster.maxTaskCount) {
            const [min, max] = monster.maxTaskCount;
            requiredCount = Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
            const baseCount = 10;
            requiredCount = Math.floor(baseCount + Math.random() * 10) + Math.floor(combatLevel / 5);
        }

        const newTask: PlayerSlayerTask = {
            monsterId,
            requiredCount,
            progress: 0,
            isComplete: false,
        };
        setSlayerTask(newTask);
        addLog(`Your new slayer task is to kill ${requiredCount} ${monster.name}s.`);
    }, [addLog, combatLevel, playerQuests]);

    const handleSlayerMasterInteraction = useCallback(() => {
        if (!slayerTask) {
            getTask();
        } else if (slayerTask.isComplete) {
            const monster = MONSTERS[slayerTask.monsterId];
            const coinReward = Math.floor(monster.level * slayerTask.requiredCount * 1.5);
            
            if (coinReward > 0) {
                addLog(`You report your success to Kaelen. Well done! You've earned ${coinReward} coins for your efforts.`);
                modifyItem('coins', coinReward);
            } else {
                addLog(`You report your success to Kaelen. Well done!`);
            }
            
            setSlayerTask(null);
            // Chain into getting a new task
            getTask();
        } else {
            const monster = MONSTERS[slayerTask.monsterId];
            const remaining = slayerTask.requiredCount - slayerTask.progress;
            addLog(`Kaelen tells you: "You still need to slay ${remaining} more ${monster.name}s."`);
        }
    }, [slayerTask, getTask, addLog, modifyItem]);
    
    const checkKill = useCallback((monsterId: string) => {
        setSlayerTask(prev => {
            if (prev && !prev.isComplete) {
                let taskMatches = false;
                const taskMonsterId = prev.monsterId;

                // Direct match check
                if (taskMonsterId === monsterId) {
                    taskMatches = true;
                } else {
                    // Generic type match check
                    const genericTypes = ['goblin', 'wyvern', 'golem', 'skeletal', 'wyrm', 'zombie', 'bear', 'wolf', 'spider'];
                    for (const type of genericTypes) {
                        if (taskMonsterId.includes(type) && monsterId.includes(type)) {
                            taskMatches = true;
                            break;
                        }
                    }
                }
                
                if (taskMatches) {
                    const monster = MONSTERS[monsterId];
                    if (monster) {
                        const xpReward = monster.maxHp;
                        addXp(SkillName.Slayer, xpReward);
                    }

                    const newProgress = prev.progress + 1;
                    if (newProgress >= prev.requiredCount) {
                        addLog(`You have completed your slayer task! Return to a Slayer Master for a new one.`);
                        return { ...prev, progress: newProgress, isComplete: true };
                    } else {
                        const taskMonsterName = MONSTERS[prev.monsterId]?.name || 'monsters';
                        addLog(`Task progress: ${newProgress}/${prev.requiredCount} ${taskMonsterName}s defeated.`);
                    }
                    return { ...prev, progress: newProgress };
                }
            }
            return prev;
        });
    }, [addLog, addXp]);

    return {
        slayerTask,
        setSlayerTask,
        handleSlayerMasterInteraction,
        checkKill,
    };
};
