
import { useState, useEffect, useCallback, useRef } from 'react';
import { PlayerRepeatableQuest, GeneratedRepeatableQuest, RepeatableQuestsState, SkillName, PlayerSkill } from '../types';
import { REPEATABLE_QUEST_POOL, MONSTERS, ITEMS, XP_TABLE, TELEPORT_UNLOCK_THRESHOLD } from '../constants';
import { POIS } from '../data/pois';

const BOARD_IDS = ['the_rusty_flagon', 'the_carved_mug', 'tutorial_tavern', 'the_barnacles_bite', 'the_gilded_goblet'];
const BOARD_RESET_INTERVAL = 30 * 60 * 1000; // 30 minutes

const getTownForBoard = (boardId: string): 'meadowdale' | 'oakhaven' | 'isle_of_whispers' | 'silverhaven' => {
    if (boardId === 'the_rusty_flagon') return 'meadowdale';
    if (boardId === 'the_carved_mug') return 'oakhaven';
    if (boardId === 'the_barnacles_bite') return 'isle_of_whispers';
    if (boardId === 'the_gilded_goblet') return 'silverhaven';
    return 'meadowdale'; // Default for tutorial or others
};

const generateNewQuestsForBoard = (boardId: string, playerSkills: (PlayerSkill & { currentLevel: number; })[]): GeneratedRepeatableQuest[] => {
    if (boardId === 'tutorial_tavern') {
        const tutorialQuest = REPEATABLE_QUEST_POOL.find(q => q.id === 'tutorial_magic_rat');
        if (tutorialQuest) {
            const monster = MONSTERS[tutorialQuest.target.monsterId!];
            const requiredQuantity = 1;
            const finalCoinReward = tutorialQuest.baseCoinReward * requiredQuantity;
            const finalXpAmount = monster ? monster.maxHp * requiredQuantity : tutorialQuest.xpReward.amount * requiredQuantity;
            
            const generatedQuest: GeneratedRepeatableQuest = {
                ...tutorialQuest,
                requiredQuantity,
                finalCoinReward,
                xpReward: { ...tutorialQuest.xpReward, amount: finalXpAmount }
            };
            return [generatedQuest];
        }
        return [];
    }
    
    const town = getTownForBoard(boardId);
    const availableQuests = REPEATABLE_QUEST_POOL.filter(
        q => (q.location === town || q.location === 'general') && q.id !== 'tutorial_magic_rat'
    );
    const shuffled = [...availableQuests].sort(() => 0.5 - Math.random());
    let selectedQuests = shuffled.slice(0, 4);

    // For testing: ensure cellar infestation is always available in Meadowdale
    if (boardId === 'the_rusty_flagon') {
        const infestationQuest = REPEATABLE_QUEST_POOL.find(q => q.id === 'kill_rats_meadowdale');
        if (infestationQuest && !selectedQuests.some(q => q.id === infestationQuest.id)) {
            if (selectedQuests.length >= 4) {
                selectedQuests.pop();
            }
            selectedQuests.unshift(infestationQuest);
        }
    }

    return selectedQuests.map(quest => {
        if (quest.type === 'gather') {
            if (!quest.target.itemId) {
                console.error(`Repeatable quest with id '${quest.id}' is of type 'gather' but has no itemId.`);
                return null;
            }
            const min = quest.minQuantity ?? 5;
            const max = quest.maxQuantity ?? 15;
            const requiredQuantity = Math.floor(Math.random() * (max - min + 1)) + min;
            const finalCoinReward = quest.baseCoinReward * requiredQuantity;
            const finalXpAmount = requiredQuantity * quest.xpReward.amount;
            return { ...quest, requiredQuantity, finalCoinReward, xpReward: { ...quest.xpReward, amount: finalXpAmount } };
        } else if (quest.type === 'kill') {
            const min = quest.minQuantity ?? 3;
            const max = quest.maxQuantity ?? 8;
            const requiredQuantity = Math.floor(Math.random() * (max - min + 1)) + min;
            const finalCoinReward = quest.baseCoinReward * requiredQuantity;
            
            const monster = MONSTERS[quest.target.monsterId!];
            const finalXpAmount = monster
                ? monster.maxHp * requiredQuantity
                : quest.xpReward.amount * requiredQuantity;

            return { ...quest, requiredQuantity, finalCoinReward, xpReward: { ...quest.xpReward, amount: finalXpAmount } };
        } else { // interact
            const skillName = quest.xpReward.skill;
            const playerSkill = playerSkills.find(s => s.name === skillName);
            let finalXpAmount = quest.xpReward.amount;

            if (playerSkill) {
                const currentLevel = playerSkill.level;
                const xpForNextLevelBracket = (XP_TABLE[currentLevel] || XP_TABLE[99]) - (XP_TABLE[currentLevel - 1] || 0);
                const option1 = Math.floor(xpForNextLevelBracket * 0.1);
                const option2 = Math.floor((quest.xpReward.amount / 4) * currentLevel);
                finalXpAmount = Math.max(1, Math.min(option1, option2));
            }

            return { ...quest, requiredQuantity: 1, finalCoinReward: quest.baseCoinReward, xpReward: { ...quest.xpReward, amount: finalXpAmount } };
        }
    }).filter((q): q is GeneratedRepeatableQuest => q !== null);
};

export const useRepeatableQuests = (
    initialState: RepeatableQuestsState, 
    addLog: (message: string) => void,
    inv: { hasItems: (items: { itemId: string; quantity: number }[]) => boolean; modifyItem: (itemId: string, quantity: number, quiet?: boolean) => void },
    char: { addXp: (skill: SkillName, amount: number) => void; skills: (PlayerSkill & { currentLevel: number; })[] },
    onQuestAccepted?: (quest: GeneratedRepeatableQuest) => void
) => {
    const [boards, setBoards] = useState<Record<string, GeneratedRepeatableQuest[]>>(initialState.boards);
    const [activePlayerQuest, setActivePlayerQuest] = useState<PlayerRepeatableQuest | null>(initialState.activePlayerQuest);
    const [nextResetTimestamp, setNextResetTimestamp] = useState<number>(initialState.nextResetTimestamp);
    const [completedQuestIds, setCompletedQuestIds] = useState<string[]>(initialState.completedQuestIds);
    const [boardCompletions, setBoardCompletions] = useState<Record<string, number>>(initialState.boardCompletions);
    const charRef = useRef(char);
    useEffect(() => {
        charRef.current = char;
    });
    
    const resetBoards = useCallback(() => {
        const newBoards: Record<string, GeneratedRepeatableQuest[]> = {};
        BOARD_IDS.forEach(id => {
            newBoards[id] = generateNewQuestsForBoard(id, charRef.current.skills);
        });
        setBoards(newBoards);
        setCompletedQuestIds([]);
        setNextResetTimestamp(Date.now() + BOARD_RESET_INTERVAL);

        if (activePlayerQuest) {
            setActivePlayerQuest(null);
            addLog("The task you were on is no longer available and has been removed from your journal.");
        }

    }, [activePlayerQuest, addLog]);

    // Effect for timed resets
    useEffect(() => {
        const checkAndReset = () => {
            if (Date.now() >= nextResetTimestamp) {
                resetBoards();
            }
        };

        const interval = setInterval(checkAndReset, 10000);
        checkAndReset(); // Check on mount in case it's already expired

        return () => clearInterval(interval);
    }, [nextResetTimestamp, resetBoards]);

    // Effect for initial generation
    useEffect(() => {
        const needsInitialGeneration = BOARD_IDS.some(id => !boards[id] || boards[id].length === 0);
        if (needsInitialGeneration) {
            resetBoards();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    const acceptQuest = useCallback((quest: GeneratedRepeatableQuest, boardId: string) => {
        if (activePlayerQuest) {
            addLog("You already have an active task. Complete or abandon it first.");
            return;
        }
        setActivePlayerQuest({
            questId: quest.id,
            boardId,
            generatedQuest: quest,
            progress: 0,
        });
        addLog(`New task accepted: ${quest.title}`);
        onQuestAccepted?.(quest);
    }, [addLog, activePlayerQuest, onQuestAccepted]);
    
    const completeQuest = useCallback(() => {
        if (!activePlayerQuest) return;
        setCompletedQuestIds(prev => [...prev, activePlayerQuest.generatedQuest.id]);
        setActivePlayerQuest(null);
    }, [activePlayerQuest]);

    const handleTurnInRepeatableQuest = useCallback(() => {
        const quest = activePlayerQuest;
        if (!quest) return;
        
        const { generatedQuest } = quest;
        if (generatedQuest.type === 'gather') {
            const required = { itemId: generatedQuest.target.itemId!, quantity: generatedQuest.requiredQuantity };
            if (!inv.hasItems([required])) {
                addLog("You don't have all the required items yet.");
                return;
            }
            inv.modifyItem(required.itemId, -required.quantity);
        } else if (generatedQuest.type === 'kill') {
            if (quest.progress < generatedQuest.requiredQuantity) {
                addLog("You haven't defeated enough monsters yet.");
                return;
            }
        }
        
        const finalXpAmount = generatedQuest.xpReward.amount;

        inv.modifyItem('coins', generatedQuest.finalCoinReward);
        char.addXp(generatedQuest.xpReward.skill, finalXpAmount);
        addLog(`Task complete! You earned ${generatedQuest.finalCoinReward} coins and ${finalXpAmount.toLocaleString()} ${generatedQuest.xpReward.skill} XP.`);
        
        const boardId = quest.boardId;
        setBoardCompletions(prev => {
            const newCount = (prev[boardId] || 0) + 1;
            if (newCount === TELEPORT_UNLOCK_THRESHOLD) {
                addLog(`You have mastered the ${POIS[boardId].name} quest board and can now teleport to it!`);
            }
            return { ...prev, [boardId]: newCount };
        });

        completeQuest();
    }, [activePlayerQuest, inv, char, addLog, completeQuest]);

    const checkProgressOnKill = useCallback((monsterId: string) => {
        setActivePlayerQuest(currentQuest => {
            if (!currentQuest) return currentQuest;
    
            const quest = currentQuest.generatedQuest;
    
            if (quest.type === 'kill' && quest.target.monsterId === monsterId) {
                if (currentQuest.progress >= quest.requiredQuantity) return currentQuest;
    
                const newProgress = currentQuest.progress + 1;
                const monsterName = MONSTERS[monsterId]?.name || 'monster';
                
                if (newProgress >= quest.requiredQuantity) {
                    addLog(`You have defeated enough ${monsterName}s for the task '${quest.title}'!`);
                } else {
                    addLog(`Task progress: ${newProgress}/${quest.requiredQuantity} ${monsterName}s defeated.`);
                }
                return { ...currentQuest, progress: newProgress };
            }
            
            if (quest.type === 'gather') {
                const monster = MONSTERS[monsterId];
                if (!monster) return currentQuest;
                const allDrops = [...(monster.guaranteedDrops || []), ...(monster.mainDrops || []), ...(monster.tertiaryDrops || [])];
                const targetDrop = allDrops.find(d => d.itemId === quest.target.itemId);
                if (targetDrop) {
                     const newProgress = currentQuest.progress + 1;
                     if (newProgress >= quest.requiredQuantity) {
                         addLog(`You have collected all the required items for '${quest.title}'!`);
                     }
                     return { ...currentQuest, progress: newProgress };
                }
            }
    
            return currentQuest;
        });
    }, [addLog]);

    return {
        boards,
        activePlayerQuest,
        nextResetTimestamp,
        completedQuestIds,
        boardCompletions,
        acceptQuest,
        checkProgressOnKill,
        handleTurnInRepeatableQuest,
    };
};
