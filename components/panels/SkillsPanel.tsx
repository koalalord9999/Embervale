import React from 'react';
import { PlayerSkill, SkillName } from '../../types';
import { XP_TABLE, SKILL_ICONS } from '../../constants';
import { TooltipState } from '../../hooks/useUIState';

interface SkillsPanelProps {
    skills: (PlayerSkill & { currentLevel: number })[];
    setTooltip: (tooltip: TooltipState | null) => void;
    onOpenGuide: (skill: SkillName) => void;
}

const SKILL_DISPLAY_ORDER: SkillName[] = [
    SkillName.Attack, SkillName.Hitpoints, SkillName.Mining,
    SkillName.Strength, SkillName.Prayer, SkillName.Smithing,
    SkillName.Defence, SkillName.Crafting, SkillName.Woodcutting,
    SkillName.Ranged, SkillName.Fletching, SkillName.Firemaking,
    SkillName.Magic, SkillName.Cooking, SkillName.Fishing,
    SkillName.Runecrafting, SkillName.Herblore, SkillName.Slayer,
];

const SkillsPanel: React.FC<SkillsPanelProps> = ({ skills, setTooltip, onOpenGuide }) => {
    const sortedSkills = [...skills].sort((a, b) => {
        return SKILL_DISPLAY_ORDER.indexOf(a.name) - SKILL_DISPLAY_ORDER.indexOf(b.name);
    });

    return (
        <div className="flex flex-col h-full text-gray-300">
            <div className="flex-grow overflow-y-auto pr-1">
                <div className="grid grid-cols-3 gap-2">
                    {sortedSkills.map(skill => {
                        const isMaxLevel = skill.level >= 99;
                        const xpForCurrentLevel = XP_TABLE[skill.level - 1] ?? 0;
                        const xpForNextLevel = isMaxLevel ? skill.xp : (XP_TABLE[skill.level] ?? skill.xp);
                        
                        const xpInLevel = skill.xp - xpForCurrentLevel;
                        const xpToNextLevel = xpForNextLevel - xpForCurrentLevel;
                        const progress = (isMaxLevel || xpToNextLevel <= 0) ? 100 : Math.max(0, (xpInLevel / xpToNextLevel) * 100);
                        const remainingXp = isMaxLevel ? 0 : xpForNextLevel - skill.xp;
                        const levelColor = skill.currentLevel < skill.level ? 'text-red-400' : (skill.currentLevel > skill.level ? 'text-green-400' : 'text-white');

                        return (
                            <div
                                key={skill.name}
                                className="bg-gray-900/50 p-2 h-10 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-700/50 transition-colors"
                                onClick={() => { onOpenGuide(skill.name); setTooltip(null); }}
                                onMouseEnter={(e) => setTooltip({
                                    content: (
                                        <div className="text-left w-48">
                                            <p className="font-bold text-yellow-300">{skill.name}</p>
                                            <div className="text-xs mt-1 space-y-0.5 text-gray-300">
                                                <p>Total XP: <span className="font-semibold text-white">{skill.xp.toLocaleString()}</span></p>
                                                {!isMaxLevel && <p>Remaining: <span className="font-semibold text-white">{remainingXp.toLocaleString()}</span></p>}
                                            </div>
                                            {!isMaxLevel && (
                                                <div className="w-full h-4 bg-red-600/80 rounded-sm relative mt-2 overflow-hidden border border-black/50">
                                                    <div className="absolute left-0 top-0 h-full bg-green-600/80" style={{ width: `${progress}%` }}></div>
                                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white" style={{textShadow: '1px 1px 1px black'}}>
                                                        {Math.floor(progress)}%
                                                    </div>
                                                </div>
                                            )}
                                            <p className="italic text-gray-400 text-xs mt-2">Click to open guide</p>
                                        </div>
                                    ),
                                    position: { x: e.clientX, y: e.clientY }
                                })}
                                onMouseLeave={() => setTooltip(null)}
                            >
                                <img src={SKILL_ICONS[skill.name]} alt={skill.name} className="w-6 h-6 filter invert flex-shrink-0" />
                                <div className="flex-1 text-right leading-none">
                                    <span className={`text-base font-bold align-super ${levelColor}`}>{skill.currentLevel}</span>
                                    <span className="text-sm text-gray-500 mx-px">/</span>
                                    <span className="text-sm align-sub text-gray-200">{skill.level}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SkillsPanel;
