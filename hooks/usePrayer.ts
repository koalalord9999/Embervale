import { useState, useCallback } from 'react';
import { PlayerSkill, SkillName, Prayer, PlayerQuestState } from '../types';
import { PRAYERS, QUESTS } from '../constants';

export const usePrayer = (
    initialActivePrayers: string[], 
    addLog: (message: string) => void,
) => {
    const [activePrayers, setActivePrayers] = useState<string[]>(initialActivePrayers);

    const togglePrayer = useCallback((prayerId: string, currentSkills: (PlayerSkill & { currentLevel: number; })[], playerQuests: PlayerQuestState[], currentPrayerPoints: number) => {
        const prayerData = PRAYERS.find(p => p.id === prayerId);
        if (!prayerData) return;

        const isCurrentlyActive = activePrayers.includes(prayerId);

        // Deactivating a prayer is always allowed.
        if (isCurrentlyActive) {
            setActivePrayers(current => current.filter(id => id !== prayerId));
            return;
        }

        // --- Activating a new prayer ---
        // Check for prayer points first.
        if (currentPrayerPoints <= 0) {
            addLog("You have no prayer points left to activate this prayer.");
            return;
        }

        // Check for level requirement.
        const prayerSkill = currentSkills.find(s => s.name === SkillName.Prayer);
        if (!prayerSkill || prayerSkill.currentLevel < prayerData.level) {
            addLog(`You need a Prayer level of ${prayerData.level} to use ${prayerData.name}.`);
            return;
        }

        // Check for quest requirement.
        if (prayerData.questId) {
            const quest = playerQuests.find(q => q.questId === prayerData.questId);
            if (!quest || !quest.isComplete) {
                const questName = QUESTS[prayerData.questId]?.name || 'a specific quest';
                addLog(`You must complete '${questName}' to use this prayer.`);
                return;
            }
        }

        // All checks passed, update active prayers with exclusivity rules.
        setActivePrayers(currentPrayers => {
            let newPrayers = [...currentPrayers];
            
            const offensiveGroups = {
                melee: ['attack_boost', 'strength_boost'],
                ranged: ['ranged_boost'],
                magic: ['magic_boost']
            };

            const getOffensiveGroup = (p: Prayer): 'melee' | 'ranged' | 'magic' | null => {
                if (!p.group) return null;
                if (offensiveGroups.melee.includes(p.group)) return 'melee';
                if (offensiveGroups.ranged.includes(p.group)) return 'ranged';
                if (offensiveGroups.magic.includes(p.group)) return 'magic';
                return null;
            };

            const newPrayerOffensiveGroup = getOffensiveGroup(prayerData);
            
            // Filter out prayers based on exclusivity rules
            newPrayers = newPrayers.filter(id => {
                const activePrayerData = PRAYERS.find(p => p.id === id);
                if (!activePrayerData) return false;

                // Rule 1: Deactivate prayers in the same specific group (e.g., tier-based boosts, protection prayers).
                if (activePrayerData.group === prayerData.group) {
                    return false;
                }

                // Rule 2: Deactivate conflicting offensive prayers.
                const activePrayerOffensiveGroup = getOffensiveGroup(activePrayerData);
                if (newPrayerOffensiveGroup && activePrayerOffensiveGroup && newPrayerOffensiveGroup !== activePrayerOffensiveGroup) {
                    return false;
                }
                
                return true; // Keep prayer if no conflicts found.
            });
            
            // Add the new prayer.
            newPrayers.push(prayerId);

            return newPrayers;
        });
    }, [addLog, activePrayers]);

    return { activePrayers, togglePrayer, setActivePrayers };
};