import React from 'react';
import { Slot, PlayerSkill, SkillName } from '../../types';
import { SKILL_ICONS, SKILL_DISPLAY_ORDER, XP_TABLE } from '../../constants';
import Button from '../common/Button';
import { TooltipState } from '../../hooks/useUIState';

// SkillDisplay component copied from SaveSlotScreen.tsx
const SkillDisplay: React.FC<{
    skillName: SkillName;
    skills: PlayerSkill[];
    setTooltip: (tooltip: TooltipState | null) => void;
}> = ({ skillName, skills, setTooltip }) => {
    const skill = skills.find(s => s.name === skillName);
    if (!skill) {
        return <div className="bg-gray-900/50 p-2 h-10 rounded-md" />;
    }

    const handleMouseEnter = (e: React.MouseEvent) => {
        const isMaxLevel = skill.level >= 99;
        const xpForCurrentLevel = XP_TABLE[skill.level - 1] ?? 0;
        const xpForNextLevel = isMaxLevel ? skill.xp : (XP_TABLE[skill.level] ?? skill.xp);
        
        const xpInLevel = skill.xp - xpForCurrentLevel;
        const xpToNextLevel = xpForNextLevel - xpForCurrentLevel;
        const progress = (isMaxLevel || xpToNextLevel <= 0) ? 100 : Math.max(0, (xpInLevel / xpToNextLevel) * 100);
        const remainingXp = isMaxLevel ? 0 : xpForNextLevel - skill.xp;

        const tooltipContent = (
            <div className="text-left w-56">
                <p className="font-bold text-yellow-300">{skill.name}</p>
                <div className="text-xs mt-1 space-y-0.5 text-gray-300">
                    <p>Total XP: <span className="font-semibold text-white">{skill.xp.toLocaleString()}</span></p>
                </div>
                {!isMaxLevel && (
                    <>
                        <div className="w-full h-4 bg-red-600/80 rounded-sm relative mt-2 overflow-hidden border border-black/50">
                            <div className="absolute left-0 top-0 h-full bg-green-600/80" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs font-semibold mt-1">
                            <span className="text-gray-400">{xpForCurrentLevel.toLocaleString()}</span>
                            <span className="text-yellow-300">({remainingXp.toLocaleString()} remaining)</span>
                            <span className="text-gray-400">{xpForNextLevel.toLocaleString()}</span>
                        </div>
                    </>
                )}
            </div>
        );

        setTooltip({
            content: tooltipContent,
            position: { x: e.clientX, y: e.clientY }
        });
    };

    return (
        <div
            className="bg-gray-900/50 p-2 h-10 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-700/50 transition-colors"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            <img src={SKILL_ICONS[skill.name]} alt={skill.name} className="w-6 h-6 filter invert flex-shrink-0" />
            <div className="flex-1 text-right leading-none">
                <span className="text-base font-bold align-super text-white">{skill.level}</span>
            </div>
        </div>
    );
};


interface DeadCharacterViewProps {
    slot: Slot;
    onDelete: () => void;
    setTooltip: (tooltip: TooltipState | null) => void;
}

const DeadCharacterView: React.FC<DeadCharacterViewProps> = ({ slot, onDelete, setTooltip }) => {
    const { metadata, data } = slot;
    if (!metadata) return null;

    return (
        <div className="animate-fade-in w-full max-w-2xl flex flex-col items-center text-center p-4 bg-black/50 border-2 border-red-700 rounded-lg overflow-y-auto max-h-[75vh]">
            <img src="https://api.iconify.design/game-icons:tombstone.svg" alt="Tombstone" className="w-16 h-16 filter invert opacity-50 mb-2" />
            <h2 className="text-3xl font-bold text-red-400">Here Lies</h2>
            <h3 className="text-4xl font-bold text-gray-200 mt-1">{metadata.username}</h3>
            <p className="text-base text-gray-400 mt-2">A Hardcore adventurer who has fallen.</p>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-base mt-4 bg-gray-900/50 p-3 rounded-md w-full max-w-md">
                <p>Final Combat Level:</p><p className="font-semibold text-right">{metadata.combatLevel}</p>
                <p>Final Total Level:</p><p className="font-semibold text-right">{metadata.totalLevel}</p>
            </div>

            {data?.skills && (
                <div className="p-3 bg-black/20 rounded-lg border border-gray-700 mt-2 w-full max-w-md">
                    <h3 className="font-bold text-yellow-300 mb-2 text-sm">Final Skills</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {SKILL_DISPLAY_ORDER.map(skillName => (
                            <SkillDisplay key={skillName} skillName={skillName} skills={data.skills} setTooltip={setTooltip} />
                        ))}
                    </div>
                </div>
            )}
            
            <p className="text-xs text-gray-500 mt-4">"The journey has ended, but the story will be remembered."</p>

            <Button onClick={onDelete} size="md" variant="secondary" className="mt-4">
                Delete Character
            </Button>
        </div>
    );
};

export default DeadCharacterView;
