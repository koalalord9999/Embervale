import { useState, useCallback } from 'react';
import { AgilityState, SkillName, PlayerSkill, InventorySlot } from '../types';
import { AGILITY_COURSES, SKILL_ICONS } from '../constants';
import { useCharacter } from './useCharacter';
import { useInventory } from './useInventory';
import { ActiveSingleAction } from './useUIState';
import { useNavigation } from './useNavigation';

interface AgilityDependencies {
    skills: (PlayerSkill & { currentLevel: number; })[];
    addXp: (skill: SkillName, amount: number) => void;
    addLog: (message: string) => void;
    setCurrentHp: React.Dispatch<React.SetStateAction<number>>;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean; }) => void;
    setActiveSingleAction: (action: ActiveSingleAction | null) => void;
    navigation: ReturnType<typeof useNavigation>;
    setRunEnergy: React.Dispatch<React.SetStateAction<number>>;
    // FIX: Add setIsResting to dependencies
    setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useAgility = (initialState: AgilityState, deps: AgilityDependencies) => {
    const [agilityState, setAgilityState] = useState<AgilityState>(initialState);
    // FIX: Destructure setIsResting from dependencies
    const { skills, addXp, addLog, setCurrentHp, modifyItem, setActiveSingleAction, navigation, setRunEnergy, setIsResting } = deps;

    const startCourse = useCallback((courseId: string) => {
        setIsResting(false);
        const course = AGILITY_COURSES[courseId];
        if (!course) {
            addLog("Error: Could not find that agility course.");
            return;
        }

        const agilityLevel = skills.find(s => s.name === SkillName.Agility)?.level ?? 1;
        if (agilityLevel < course.level) {
            addLog(`You need an Agility level of ${course.level} to attempt this course.`);
            return;
        }

        setAgilityState(prev => ({ ...prev, activeCourseId: courseId, currentObstacleIndex: 0 }));
        addLog(`You have started the ${course.name}.`);
    }, [skills, addLog, setIsResting]);

    const stopCourse = useCallback(() => {
        if (agilityState.activeCourseId) {
            const course = AGILITY_COURSES[agilityState.activeCourseId];
            addLog(`You leave the ${course.name}.`);
            setAgilityState(prev => ({ ...prev, activeCourseId: null, currentObstacleIndex: 0 }));
        }
    }, [agilityState.activeCourseId, addLog]);

    const attemptObstacle = useCallback(() => {
        setIsResting(false);
        if (!agilityState.activeCourseId) {
            addLog("You are not on an agility course.");
            return;
        }

        const course = AGILITY_COURSES[agilityState.activeCourseId];
        const obstacle = course.obstacles[agilityState.currentObstacleIndex];
        const agilitySkill = skills.find(s => s.name === SkillName.Agility);
        const playerAgility = agilitySkill?.currentLevel ?? 1;

        if (playerAgility < obstacle.level) {
            addLog(`You need an Agility level of ${obstacle.level} to attempt this obstacle.`);
            return;
        }

        const onComplete = () => {
            const isSuccess = obstacle.canFail === false || (() => {
                let successChance = 80 + (playerAgility - obstacle.level) * 2;
                successChance = Math.max(10, Math.min(95, successChance));
                return Math.random() * 100 < successChance;
            })();

            if (isSuccess) {
                // Success
                addXp(SkillName.Agility, obstacle.xp); // Only reward Agility vouchers from completing a course

                setAgilityState(prev => {
                    const newObstacleIndex = prev.currentObstacleIndex + 1;
                    if (newObstacleIndex >= course.obstacles.length) {
                        // Lap completed
                        addXp(SkillName.Agility, course.lapBonusXp);
                            if (Math.random() < 0.10) { // 10% chance for Mark of Grace
                            modifyItem('agility_voucher', 1);
                            addLog("As a testament to your Agility, an Agility Aoucher appears in your inventory!");
                            }
                        
                        if (course.energyRestore) {
                            setRunEnergy(prevEnergy => Math.min(100, prevEnergy + course.energyRestore!));
                            addLog(`Your run energy has been restored by ${course.energyRestore}!`);
                        }

                        const newLaps = (prev.lapsCompleted[course.id] || 0) + 1;
                        addLog(`Lap complete! You have completed ${newLaps} laps on this course.`);
                        
                        const newLapsCompleted = { ...prev.lapsCompleted, [course.id]: newLaps };

                        const lastObstacle = course.obstacles[course.obstacles.length - 1];
                        if (lastObstacle.successPoiId) {
                            navigation.handleForcedNavigate(lastObstacle.successPoiId);
                            // Set active course to null, but preserve lap counts
                            return { 
                                ...prev, 
                                activeCourseId: null, 
                                currentObstacleIndex: 0, 
                                lapsCompleted: newLapsCompleted 
                            };
                        } else {
                             return { 
                                ...prev, 
                                currentObstacleIndex: 0, 
                                lapsCompleted: newLapsCompleted
                            };
                        }
                    } else {
                        return { ...prev, currentObstacleIndex: newObstacleIndex };
                    }
                });

            } else {
                // Failure
                const failXp = obstacle.failXp ?? 2;
                addXp(SkillName.Agility, failXp);
                addLog(obstacle.failMessage ?? `You slip and fall from the ${obstacle.name}!`);

                if (obstacle.failDamage) {
                    const damage = Math.floor(Math.random() * (obstacle.failDamage.max - obstacle.failDamage.min + 1)) + obstacle.failDamage.min;
                    setCurrentHp(hp => Math.max(0, hp - damage));
                    addLog(`You take ${damage} damage.`);
                }
                
                if (obstacle.failPoiId) {
                    stopCourse();
                    navigation.handleForcedNavigate(obstacle.failPoiId);
                } else {
                    setAgilityState(prev => ({ ...prev, currentObstacleIndex: 0 }));
                }
            }
        };

        setActiveSingleAction({
            title: obstacle.name,
            iconUrl: SKILL_ICONS.Agility,
            iconClassName: 'filter invert',
            startTime: Date.now(),
            duration: obstacle.duration * 600, // convert ticks to ms
            onComplete,
        });

    }, [agilityState, skills, addXp, addLog, setCurrentHp, modifyItem, setActiveSingleAction, navigation, stopCourse, setRunEnergy, setIsResting]);
    
    return {
        agilityState,
        setAgilityState,
        startCourse,
        stopCourse,
        attemptObstacle,
    };
};
