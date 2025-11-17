import React, { useMemo } from 'react';
import { PlayerSkill, SkillName, Prayer, PlayerQuestState } from '../../types';
import { PRAYERS, QUESTS } from '../../constants';
import { TooltipState } from '../../hooks/useUIState';

interface PrayerPanelProps {
    skills: (PlayerSkill & { currentLevel: number; })[];
    activePrayers: string[];
    onTogglePrayer: (prayerId: string) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    playerQuests: PlayerQuestState[];
}

const PrayerDisplay: React.FC<{
    prayer: Prayer;
    prayerLevel: number;
    onTogglePrayer: (prayerId: string) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    isActive: boolean;
    playerQuests: PlayerQuestState[];
}> = ({ prayer, prayerLevel, onTogglePrayer, setTooltip, isActive, playerQuests }) => {
    
    const isLockedByQuest = useMemo(() => {
        if (!prayer.questId) return false;
        const quest = playerQuests.find(q => q.questId === prayer.questId);
        return !quest || !quest.isComplete;
    }, [prayer.questId, playerQuests]);

    const hasLevel = prayerLevel >= prayer.level;
    const canActivate = hasLevel && !isLockedByQuest;

    const handleMouseEnter = (e: React.MouseEvent) => {
        const levelColor = hasLevel ? 'text-green-400' : 'text-red-400';
        const tooltipContent = (
            <div className="text-left w-48">
                <p className="font-bold text-yellow-300">{prayer.name}</p>
                <p className={`text-sm italic mb-2 ${levelColor}`}>Lvl {prayer.level} Prayer</p>
                <p className="text-sm text-gray-300 mb-2">{prayer.description}</p>
                {prayer.drainRate > 0 && <p className="text-xs text-gray-400">Drain: {prayer.drainRate} pts/min</p>}
                {isLockedByQuest && <p className="text-xs text-red-400 mt-1">Unlocked by '{QUESTS[prayer.questId!].name}'.</p>}
            </div>
        );

        setTooltip({
            content: tooltipContent,
            position: { x: e.clientX, y: e.clientY }
        });
    };

    return (
        <button
            onClick={() => { if (canActivate) onTogglePrayer(prayer.id); setTooltip(null); }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
            className={`w-full aspect-square rounded-md transition-colors flex items-center justify-center text-center hover:bg-gray-700/20 relative isolate border-2 ${isActive ? 'border-yellow-400 bg-yellow-900/50' : 'border-transparent'}`}
        >
            <img 
                src={prayer.iconUrl} 
                alt={prayer.name} 
                className={`w-full h-full p-1 transition-all ${isActive ? 'filter-none' : ''}`}
                style={!canActivate ? { filter: 'grayscale(0.9) brightness(0.2)', opacity: 0.8 } : { filter: 'invert(1)' }}
            />
        </button>
    );
};


const PrayerPanel: React.FC<PrayerPanelProps> = ({ skills, activePrayers, onTogglePrayer, setTooltip, playerQuests }) => {
    const prayerLevel = skills.find(s => s.name === SkillName.Prayer)?.level ?? 1;

    const sortedPrayers = useMemo(() => {
        return [...PRAYERS].sort((a, b) => a.level - b.level);
    }, []);

    return (
        <div className="flex flex-col h-full text-gray-300">
            <div className="flex-grow overflow-y-auto pr-1">
                <div className="grid grid-cols-5 gap-2">
                    {sortedPrayers.map(prayer => (
                        <PrayerDisplay
                            key={prayer.id}
                            prayer={prayer}
                            prayerLevel={prayerLevel}
                            isActive={activePrayers.includes(prayer.id)}
                            onTogglePrayer={onTogglePrayer}
                            setTooltip={setTooltip}
                            playerQuests={playerQuests}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrayerPanel;