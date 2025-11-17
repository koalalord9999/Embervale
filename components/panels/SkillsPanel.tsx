import React from 'react';
import { PlayerSkill, SkillName } from '../../types';
import { XP_TABLE, SKILL_ICONS, SKILL_DISPLAY_ORDER, getSkillColorClass } from '../../constants';
import { TooltipState } from '../../hooks/useUIState';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

interface SkillsPanelProps {
    skills: (PlayerSkill & { currentLevel: number })[];
    setTooltip: (tooltip: TooltipState | null) => void;
    onOpenGuide: (skill: SkillName) => void;
    isTouchSimulationEnabled: boolean;
}

const SkillDisplay: React.FC<{
    skill: PlayerSkill & { currentLevel: number };
    setTooltip: (tooltip: TooltipState | null) => void;
    onOpenGuide: (skill: SkillName) => void;
    isTouchSimulationEnabled: boolean;
}> = ({ skill, setTooltip, onOpenGuide, isTouchSimulationEnabled }) => {
    const isTouchDevice = useIsTouchDevice(isTouchSimulationEnabled);

    const buildTooltipContent = (skill: PlayerSkill) => {
        const isMaxLevel = skill.level >= 99;
        const xpForCurrentLevel = XP_TABLE[skill.level - 1] ?? 0;
        const xpForNextLevel = isMaxLevel ? skill.xp : (XP_TABLE[skill.level] ?? skill.xp);
        
        const xpInLevel = skill.xp - xpForCurrentLevel;
        const xpToNextLevel = xpForNextLevel - xpForCurrentLevel;
        const progress = (isMaxLevel || xpToNextLevel <= 0) ? 100 : Math.max(0, (xpInLevel / xpToNextLevel) * 100);
        const remainingXp = isMaxLevel ? 0 : xpForNextLevel - skill.xp;

        return (
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
                <p className="italic text-gray-400 text-xs mt-2">
                    {isTouchDevice ? 'Tap to open guide, Long-press for details' : 'Click to open guide'}
                </p>
            </div>
        );
    };

    const handleOpenGuide = () => {
        setTooltip(null);
        onOpenGuide(skill.name);
    };

    const handleShowTooltip = (event: React.MouseEvent | React.TouchEvent) => {
        const point = 'touches' in event ? event.touches[0] : event;
        setTooltip({
            content: buildTooltipContent(skill),
            position: { x: point.clientX, y: point.clientY }
        });
    };

    const handleHideTooltip = () => {
        setTooltip(null);
    };

    const longPressHandlers = useLongPress({
        onLongPress: handleShowTooltip,
        onClick: handleOpenGuide,
    });

    const handlers = isTouchDevice
        ? longPressHandlers
        : {
            onClick: handleOpenGuide,
            onMouseEnter: handleShowTooltip,
            onMouseLeave: handleHideTooltip,
          };

    const levelColor = skill.currentLevel < skill.level ? 'text-red-400' : (skill.currentLevel > skill.level ? 'text-green-400' : 'text-white');

    return (
        <div
            className="bg-gray-900/50 p-2 h-10 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-700/50 transition-colors"
            {...handlers}
        >
            <div
                className={`w-6 h-6 flex-shrink-0 ${getSkillColorClass(skill.name)}`}
                style={{
                    maskImage: `url(${SKILL_ICONS[skill.name]})`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: `url(${SKILL_ICONS[skill.name]})`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                }}
            />
            <div className="flex-1 text-right leading-none">
                <span className={`text-base font-bold align-super ${levelColor}`}>{skill.currentLevel}</span>
                <span className="text-sm text-gray-500 mx-px">/</span>
                <span className="text-sm align-sub text-gray-200">{skill.level}</span>
            </div>
        </div>
    );
};

const SkillsPanel: React.FC<SkillsPanelProps> = ({ skills, setTooltip, onOpenGuide, isTouchSimulationEnabled }) => {
    const sortedSkills = [...skills].sort((a, b) => {
        return SKILL_DISPLAY_ORDER.indexOf(a.name) - SKILL_DISPLAY_ORDER.indexOf(b.name);
    });

    return (
        <div className="flex flex-col h-full text-gray-300">
            <div className="flex-grow overflow-y-auto pr-1">
                <div className="grid grid-cols-3 gap-2">
                    {sortedSkills.map(skill => (
                        <SkillDisplay
                            key={skill.name}
                            skill={skill}
                            setTooltip={setTooltip}
                            onOpenGuide={onOpenGuide}
                            isTouchSimulationEnabled={isTouchSimulationEnabled}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkillsPanel;