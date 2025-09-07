
import React from 'react';
import { PlayerSkill, SkillName } from '../../types';
import { XP_TABLE } from '../../constants';
import ProgressBar from '../common/ProgressBar';
import { TooltipState } from '../../hooks/useUIState';

interface SkillsPanelProps {
    skills: (PlayerSkill & { currentLevel: number })[];
    setTooltip: (tooltip: TooltipState | null) => void;
    onOpenGuide: (skill: SkillName) => void;
}

const SkillsPanel: React.FC<SkillsPanelProps> = ({ skills, setTooltip, onOpenGuide }) => {
    const getTotalLevel = () => {
        return skills.reduce((total, skill) => total + skill.level, 0);
    };

    return (
        <div className="flex flex-col h-full text-gray-300">
            <h3 className="text-lg font-bold text-center mb-2 text-yellow-400">Skills</h3>
            <p className="text-center text-sm mb-2">Total Level: {getTotalLevel()}</p>
            <div className="overflow-y-auto pr-1 space-y-2">
                {skills.map(skill => {
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
                            className="text-sm p-1 rounded hover:bg-white/10 cursor-pointer"
                            onClick={() => onOpenGuide(skill.name)}
                            onMouseEnter={(e) => setTooltip({
                                content: (
                                    <div className="text-left">
                                        <p className="font-bold text-yellow-300">{skill.name}</p>
                                        <p>Experience: <span className="font-semibold">{skill.xp.toLocaleString()}</span></p>
                                        {!isMaxLevel && <p>Remaining XP: <span className="font-semibold">{remainingXp.toLocaleString()}</span></p>}
                                        <p className="italic text-gray-400 mt-1">Click to open guide</p>
                                    </div>
                                ),
                                position: { x: e.clientX, y: e.clientY }
                            })}
                            onMouseLeave={() => setTooltip(null)}
                        >
                            <div className="flex justify-between items-baseline mb-0.5">
                                <span className="font-semibold">{skill.name}</span>
                                <span className={`font-bold text-lg ${levelColor}`}>{skill.currentLevel} / {skill.level}</span>
                            </div>
                            <div className="relative">
                                <ProgressBar value={progress} maxValue={100} color="bg-yellow-600" />
                                <div 
                                    className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white pointer-events-none"
                                    style={{ textShadow: '1px 1px 2px black' }}
                                >
                                    <span>{isMaxLevel ? "Max Level" : `${Math.floor(progress)}%`}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillsPanel;
