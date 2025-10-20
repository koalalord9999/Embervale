import React, { useState, useMemo } from 'react';
import { PlayerSkill, SkillName } from '../../../types';
import { SKILL_GUIDES, SKILL_ICONS, ITEMS, ALL_SKILLS, getIconClassName, HERBS, HERBLORE_RECIPES, THIEVING_POCKET_TARGETS, THIEVING_CONTAINER_TARGETS, HOUSE_TIERS, THIEVING_STALL_TARGETS } from '../../../constants';
import Button from '../../common/Button';

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

        const herbInfo = HERBS.find(h => h.grimy === selectedHerbId || h.clean === selectedHerbId);
        if (!herbInfo) return [];

        const unfPotionRecipe = HERBLORE_RECIPES.unfinished.find(r => r.cleanHerbId === herbInfo.clean);
        if (!unfPotionRecipe) return [];

        return HERBLORE_RECIPES.finished
            .filter(r => r.unfinishedPotionId === unfPotionRecipe.unfinishedPotionId)
            .sort((a, b) => a.level - b.level);
    }, [selectedHerbId]);

    const selectedHerbItem = selectedHerbId ? ITEMS[selectedHerbId] : null;

    return (
        <div className="flex flex-col sm:flex-row h-full">
            <div className="w-full sm:w-1/2 border-r-2 border-gray-700 overflow-y-auto p-2 space-y-1">
                <h3 className="text-lg font-bold text-center mb-2 text-yellow-300">Herbs</h3>
                {HERBS.map(herb => {
                    const item = ITEMS[herb.clean];
                    const hasLevel = playerLevel >= herb.level;
                    return (
                        <button
                            key={herb.clean}
                            onClick={() => setSelectedHerbId(herb.clean)}
                            className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${selectedHerbId === herb.clean ? 'bg-yellow-800/80 ring-2 ring-yellow-500' : 'hover:bg-gray-700/50'} ${!hasLevel ? 'opacity-60' : ''}`}
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
            <div className="w-full sm:w-1/2 overflow-y-auto p-4">
                {selectedHerbItem ? (
                    <>
                        <h3 className="text-lg font-bold text-center mb-4 text-yellow-300">Potions from {selectedHerbItem.name}</h3>
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

const ThievingGuide: React.FC<{ playerLevel: number }> = ({ playerLevel }) => {
    const [activeTab, setActiveTab] = useState<'pickpocket' | 'lockpicking' | 'stalls'>('pickpocket');

    const pickpocketTargets = useMemo(() => Object.values(THIEVING_POCKET_TARGETS).sort((a, b) => a.level - b.level), []);
    const stallTargets = useMemo(() => Object.values(THIEVING_STALL_TARGETS).sort((a, b) => a.level - b.level), []);

    const lockpickingTargets = useMemo(() => {
        const houseTiers = HOUSE_TIERS.map(tier => ({
            name: `${tier.tierId.replace('thieving_house_drawer_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Homes`,
            level: tier.level,
            type: 'House'
        }));

        const dungeonChests = [
            { name: 'Low-Tier Dungeon Chests', level: THIEVING_CONTAINER_TARGETS.thieving_dungeon_chest_low.level, type: 'Dungeon' },
            { name: 'Mid-Tier Dungeon Chests', level: THIEVING_CONTAINER_TARGETS.thieving_dungeon_chest_mid.level, type: 'Dungeon' },
            { name: 'High-Tier Dungeon Chests', level: THIEVING_CONTAINER_TARGETS.thieving_dungeon_chest_high.level, type: 'Dungeon' },
            { name: 'Elite Dungeon Chests', level: THIEVING_CONTAINER_TARGETS.thieving_dungeon_chest_elite.level, type: 'Dungeon' },
        ];
        
        return [...houseTiers, ...dungeonChests].sort((a, b) => a.level - b.level);
    }, []);

    const GuideEntry: React.FC<{ name: string; level: number }> = ({ name, level }) => {
        const hasLevel = playerLevel >= level;
        return (
            <div className={`flex items-center justify-between p-3 rounded-md ${hasLevel ? 'bg-green-900/30' : 'bg-gray-900/50'}`}>
                <p className={`font-bold ${hasLevel ? 'text-white' : 'text-gray-400'}`}>{name}</p>
                <p className={`text-sm font-semibold ${hasLevel ? 'text-green-400' : 'text-red-400'}`}>Lvl {level}</p>
            </div>
        );
    };

    return (
        <div className="flex flex-col sm:flex-row h-full">
            <div className="w-full sm:w-1/3 border-r-2 border-gray-700 p-2 space-y-2">
                <h3 className="text-lg font-bold text-center mb-2 text-yellow-300">Categories</h3>
                <button
                    onClick={() => setActiveTab('pickpocket')}
                    className={`w-full p-3 rounded-md text-left transition-colors font-semibold ${activeTab === 'pickpocket' ? 'bg-yellow-800/80' : 'hover:bg-gray-700/50'}`}
                >
                    Pickpocketing
                </button>
                <button
                    onClick={() => setActiveTab('lockpicking')}
                    className={`w-full p-3 rounded-md text-left transition-colors font-semibold ${activeTab === 'lockpicking' ? 'bg-yellow-800/80' : 'hover:bg-gray-700/50'}`}
                >
                    Lockpicking
                </button>
                <button
                    onClick={() => setActiveTab('stalls')}
                    className={`w-full p-3 rounded-md text-left transition-colors font-semibold ${activeTab === 'stalls' ? 'bg-yellow-800/80' : 'hover:bg-gray-700/50'}`}
                >
                    Stalls
                </button>
            </div>
            <div className="w-full sm:w-2/3 overflow-y-auto p-4">
                <div className="space-y-2">
                    {activeTab === 'pickpocket' && pickpocketTargets.map(target => (
                        <GuideEntry key={target.name} name={target.name} level={target.level} />
                    ))}
                    {activeTab === 'lockpicking' && lockpickingTargets.map(target => (
                        <GuideEntry key={target.name} name={target.name} level={target.level} />
                    ))}
                    {activeTab === 'stalls' && stallTargets.map(target => (
                        <GuideEntry key={target.name} name={target.name} level={target.level} />
                    ))}
                </div>
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

    const renderContent = () => {
        switch (activeSkill) {
            case SkillName.Herblore:
                return <HerbloreGuide playerLevel={playerLevel} />;
            case SkillName.Thieving:
                return <ThievingGuide playerLevel={playerLevel} />;
            default:
                return renderDefaultGuide();
        }
    };

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
                
                <div className="flex flex-col md:flex-row flex-grow min-h-0">
                    <div className="w-full md:w-1/4 bg-black/30 p-2 border-b-2 md:border-b-0 md:border-r-2 border-gray-600 overflow-y-auto h-48 md:h-auto">
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
                    
                    <div className="w-full md:w-3/4 flex-grow overflow-y-auto">
                       {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillGuideView;