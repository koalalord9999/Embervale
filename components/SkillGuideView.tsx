import React, { useState, useMemo } from 'react';
import { PlayerSkill, SkillName } from '../types';
import { SKILL_GUIDES, SKILL_ICONS, ITEMS, ALL_SKILLS, getIconClassName, HERBS, HERBLORE_RECIPES } from '../constants';
import Button from './common/Button';

interface SkillGuideViewProps {
    activeSkill: SkillName;
    setActiveSkill: (skill: SkillName) => void;
    onClose: () => void;
    playerSkills: PlayerSkill[];
}

const HerbloreGuide: React.FC<{ playerLevel: number }> = ({ playerLevel }) => {
    const [selectedHerbId, setSelectedHerbId] = useState<string | null>(null);

    const herbPotions = useMemo(() => {
        if (!selectedHerbId) return [];

        const herbInfo = HERBS.find(h => h.grimy === selectedHerbId);
        if (!herbInfo) return [];

        const unfPotionRecipe = HERBLORE_RECIPES.unfinished.find(r => r.cleanHerbId === herbInfo.clean);
        if (!unfPotionRecipe) return [];

        return HERBLORE_RECIPES.finished
            .filter(r => r.unfinishedPotionId === unfPotionRecipe.unfinishedPotionId)
            .sort((a, b) => a.level - b.level);
    }, [selectedHerbId]);

    const selectedHerb = selectedHerbId ? ITEMS[selectedHerbId] : null;

    return (
        <div className="flex h-full">
            <div className="w-1/2 border-r-2 border-gray-700 overflow-y-auto p-2 space-y-1">
                <h3 className="text-lg font-bold text-center mb-2 text-yellow-300">Herbs</h3>
                {HERBS.map(herb => {
                    const item = ITEMS[herb.grimy];
                    const hasLevel = playerLevel >= herb.level;
                    return (
                        <button
                            key={herb.grimy}
                            onClick={() => setSelectedHerbId(herb.grimy)}
                            className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${selectedHerbId === herb.grimy ? 'bg-yellow-800/80 ring-2 ring-yellow-500' : 'hover:bg-gray-700/50'} ${!hasLevel ? 'opacity-60' : ''}`}
                        >
                            <div className="w-8 h-8 bg-black/40 rounded-md p-1 flex-shrink-0 flex items-center justify-center">
                                <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
                            </div>
                            <div className="flex-grow">
                                <p className={hasLevel ? 'text-white' : 'text-gray-400'}>{item.name}</p>
                                <p className={`text-xs ${hasLevel ? 'text-green-400' : 'text-red-400'}`}>Lvl {herb.level} to clean</p>
                            </div>
                        </button>
                    );
                })}
            </div>
            <div className="w-1/2 overflow-y-auto p-4">
                {selectedHerb ? (
                    <>
                        <h3 className="text-lg font-bold text-center mb-4 text-yellow-300">Potions from {selectedHerb.name}</h3>
                        {herbPotions.length > 0 ? (
                             <div className="space-y-3">
                                {herbPotions.map(recipe => {
                                    const potionItem = ITEMS[recipe.finishedPotionId];
                                    const secondaryItem = ITEMS[recipe.secondaryId];
                                    const hasLevel = playerLevel >= recipe.level;
                                    return (
                                        <div key={recipe.finishedPotionId} className={`flex items-center gap-4 p-2 rounded-md ${hasLevel ? 'bg-green-900/30' : 'bg-gray-900/50'}`}>
                                            <div className="w-10 h-10 bg-black/40 rounded-md p-1 flex-shrink-0 flex items-center justify-center">
                                                <img src={potionItem.iconUrl} alt={potionItem.name} className={`w-full h-full ${getIconClassName(potionItem)}`} />
                                            </div>
                                            <div className="flex-grow">
                                                <p className={hasLevel ? 'text-white' : 'text-gray-400'}>{potionItem.name}</p>
                                                <p className={`text-xs ${hasLevel ? 'text-green-400' : 'text-red-400'}`}>Requires Level {recipe.level}</p>
                                                <p className="text-xs text-gray-400 mt-1">Secondary: <span className="font-semibold">{secondaryItem.name}</span></p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400 italic mt-8">This herb is not yet used to make any finished potions.</p>
                        )}
                       
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-center text-gray-400 italic">Select an herb to see what potions it can create.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


const SkillGuideView: React.FC<SkillGuideViewProps> = ({ activeSkill, setActiveSkill, onClose, playerSkills }) => {
    const playerLevel = playerSkills.find(s => s.name === activeSkill)?.level ?? 1;

    const renderDefaultGuide = () => {
        const guideData = SKILL_GUIDES[activeSkill] ?? [];
        return (
             <div className="space-y-3">
                {guideData.length > 0 ? guideData.map((entry, index) => {
                    const hasLevel = playerLevel >= entry.level;
                    const item = entry.itemId ? ITEMS[entry.itemId] : null;
                    return (
                        <div key={index} className={`flex items-center gap-4 p-2 rounded-md ${hasLevel ? 'bg-green-900/30' : 'bg-gray-900/50'}`}>
                            <div className={`w-12 text-center font-bold text-xl flex-shrink-0 ${hasLevel ? 'text-green-400' : 'text-gray-400'}`}>
                                {entry.level}
                            </div>
                            {item && (
                                <div className="w-10 h-10 bg-black/40 rounded-md p-1 flex-shrink-0 flex items-center justify-center">
                                    <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
                                </div>
                            )}
                            <p className={`flex-grow ${hasLevel ? 'text-white' : 'text-gray-400'}`}>
                                {entry.description}
                            </p>
                        </div>
                    );
                }) : (
                    <p className="text-center text-gray-400 italic mt-8">This skill guide has not been written yet.</p>
                )}
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[700px] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b-2 border-gray-600">
                    <h1 className="text-3xl font-bold text-yellow-400">Skill Guide: {activeSkill}</h1>
                    <Button onClick={onClose} size="sm">Close</Button>
                </div>
                
                <div className="flex flex-grow min-h-0">
                    <div className="w-1/4 bg-black/30 p-2 border-r-2 border-gray-600 overflow-y-auto">
                        <div className="space-y-1">
                            {ALL_SKILLS.map(skill => (
                                <button
                                    key={skill.name}
                                    onClick={() => setActiveSkill(skill.name)}
                                    className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${activeSkill === skill.name ? 'bg-yellow-700/80' : 'hover:bg-gray-700/50'}`}
                                >
                                    <img src={SKILL_ICONS[skill.name]} alt={skill.name} className="w-6 h-6 filter invert" />
                                    <span className="font-semibold">{skill.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="w-3/4 flex-grow overflow-y-auto p-4">
                        {activeSkill === SkillName.Herblore 
                            ? <HerbloreGuide playerLevel={playerLevel} /> 
                            : renderDefaultGuide()
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillGuideView;