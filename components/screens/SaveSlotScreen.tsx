import React, { useState, useMemo, useEffect } from 'react';
import { Slot, PlayerType, PlayerSkill, SkillName } from '../../types';
import { SKILL_ICONS, SKILL_DISPLAY_ORDER, XP_TABLE, getSkillColorClass } from '../../constants';
import Button from '../common/Button';
import DeadCharacterView from './DeadCharacterView';
import { TooltipState } from '../../hooks/useUIState';

interface SaveSlotScreenProps {
    slots: Slot[];
    onSelectSlot: (slotId: number) => void;
    onCreateNew: (slotId: number) => void;
    onDelete: (slotId: number) => void;
    onExport: (slotId: number) => void;
    onImport: (slotId: number) => void;
    assets: Record<string, string> | null;
    setTooltip: (tooltip: TooltipState | null) => void;
}

const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString();
};

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
                <span className="text-base font-bold align-super text-white">{skill.level}</span>
            </div>
        </div>
    );
};


const SaveSlotScreen: React.FC<SaveSlotScreenProps> = ({ slots, onSelectSlot, onCreateNew, onDelete, onExport, onImport, assets, setTooltip }) => {
    // Initialize selectedSlotId with the most recently played slot
    const [selectedSlotId, setSelectedSlotId] = useState<number>(() => {
        let mostRecentSlotId = 0;
        let maxTimestamp = 0;

        slots.forEach(slot => {
            if (slot.data && slot.updatedAt) {
                const timestamp = new Date(slot.updatedAt).getTime();
                if (timestamp > maxTimestamp) {
                    maxTimestamp = timestamp;
                    mostRecentSlotId = slot.slotId;
                }
            }
        });
        return mostRecentSlotId;
    });

    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [confirmDeleteText, setConfirmDeleteText] = useState('');

    const selectedSlot = useMemo(() => slots.find(s => s.slotId === selectedSlotId), [slots, selectedSlotId]);
    const isSelectedEmpty = !selectedSlot?.data;
    const isSelectedDeadHardcore = selectedSlot?.data?.isDead && selectedSlot?.metadata?.playerType === PlayerType.Hardcore;
    const isTechDemoSlot = selectedSlotId === 5; // Slot 6 is index 5

    const handleDelete = () => {
        if (confirmDelete === null || confirmDeleteText !== selectedSlot?.metadata?.username) {
            alert('Username does not match. Deletion cancelled.');
            setConfirmDelete(null);
            setConfirmDeleteText('');
            return;
        }
        onDelete(confirmDelete);
        setConfirmDelete(null);
        setConfirmDeleteText('');
    };

    return (
        <div className="w-full h-full p-4 flex items-start justify-center relative pt-24 md:pt-48">
            <div className="relative z-10 w-11/12 max-w-screen-xl rounded-lg flex flex-col md:flex-row gap-6">
                
                {/* Left Panel - Slot Details */}
                <div className="w-full md:w-2/3 flex flex-col justify-center items-center text-center p-6">
                    {isSelectedDeadHardcore ? (
                        <DeadCharacterView slot={selectedSlot!} onDelete={() => setConfirmDelete(selectedSlotId)} setTooltip={setTooltip} />
                    ) : isSelectedEmpty ? (
                        <div className="flex flex-col items-center gap-4">
                            <h2 className="text-4xl font-bold text-gray-400">{isTechDemoSlot ? "Proof of Concept" : "Empty Slot"}</h2>
                            {isTechDemoSlot && <p className="text-yellow-400 mb-4">Warning: This is an experimental Isometric Engine prototype.</p>}
                            <Button onClick={() => onCreateNew(selectedSlotId)} size="md" variant="primary">
                                {isTechDemoSlot ? "Enter Simulation" : "Create New Character"}
                            </Button>
                            {!isTechDemoSlot && <Button onClick={() => onImport(selectedSlotId)} size="md" variant="secondary">Import Save</Button>}
                            <a
                                href="https://discord.gg/vFUhYWWafx"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold rounded-md shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 bg-gray-600 hover:bg-gray-500 border-2 border-gray-700 hover:border-gray-600 text-gray-200 focus:ring-gray-400 px-4 py-2 text-base inline-flex items-center justify-center gap-2"
                                aria-label="Join our Discord community"
                            >
                                <span>Discord</span>
                                <img
                                    src="https://www.svgrepo.com/show/353655/discord-icon.svg"
                                    alt="Discord Icon"
                                    className="w-5 h-5 filter invert opacity-75"
                                />
                            </a>
                        </div>
                    ) : selectedSlot && selectedSlot.metadata ? (
                        <div className="animate-fade-in space-y-2 w-full max-w-lg">
                            
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm my-2 text-left">
                                <p>Combat Level:</p><p className="font-semibold text-right">{selectedSlot.metadata.combatLevel}</p>
                                <p>Location:</p><p className="font-semibold text-right">{selectedSlot.metadata.currentPoiName}</p>
                                <p>Game Mode:</p><p className="font-semibold text-right">{selectedSlot.metadata.playerType}</p>
                            </div>
                            
                            <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
                                <h3 className="font-bold text-yellow-300 mb-2">Total Level: {selectedSlot.metadata.totalLevel}</h3>
                                {selectedSlot.data.skills ? (
                                    <div className="grid grid-cols-4 gap-1">
                                        {SKILL_DISPLAY_ORDER.map(skillName => (
                                            <SkillDisplay key={skillName} skillName={skillName} skills={selectedSlot.data.skills} setTooltip={setTooltip} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Skill data not available.</p>
                                )}
                            </div>
                            
                            <div className="pt-2 flex flex-col items-center gap-2 w-full">
                                <Button onClick={() => onSelectSlot(selectedSlotId)} size="md" variant="primary">Play</Button>
                                <div className="flex justify-between items-center w-full max-w-xs">
                                    <div className="flex gap-2">
                                        {(selectedSlot.metadata.playerType === PlayerType.Cheats || selectedSlot.metadata.playerType === PlayerType.TechDemo) && (
                                            <Button onClick={() => onExport(selectedSlotId)} size="sm" variant="secondary">Export</Button>
                                        )}
                                        {(selectedSlot.metadata.playerType === PlayerType.Cheats) && (
                                            <Button onClick={() => onImport(selectedSlotId)} size="sm" variant="secondary">Import</Button>
                                        )}
                                        <Button onClick={() => setConfirmDelete(selectedSlotId)} size="sm" variant="secondary">Delete</Button>
                                    </div>
                                    <a
                                        href="https://discord.gg/vFUhYWWafx"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="z-20"
                                        aria-label="Join our Discord community"
                                        title="Join our Discord community"
                                    >
                                        <img
                                            src="https://www.svgrepo.com/show/353655/discord-icon.svg"
                                            alt="Discord Icon"
                                            className="w-8 h-8 filter grayscale hover:grayscale-0 transition-all duration-200"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : <div className="text-gray-400">Loading slot...</div>}
                </div>

                {/* Right Panel - Slot List */}
                <div className="w-full md:w-1/3 flex flex-col gap-3 px-4 max-h-[60vh] overflow-y-auto">
                    <h3 className="text-2xl font-bold text-yellow-400 text-center mb-2">Save Slots</h3>
                    {slots.map(slot => {
                        const isSelected = slot.slotId === selectedSlotId;
                        const isEmpty = !slot.data;
                        const isDeadHardcore = slot.data?.isDead && slot.metadata?.playerType === PlayerType.Hardcore;
                        const isTechDemo = slot.slotId === 5;
                        const metadata = slot.metadata;

                        return (
                            <button
                                key={slot.slotId}
                                onClick={() => { setSelectedSlotId(slot.slotId); setConfirmDelete(null); setConfirmDeleteText(''); }}
                                className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                                    isSelected ? 'bg-yellow-800/50 border-yellow-500 scale-105' : 
                                    isEmpty ? 'bg-black/30 border-dashed border-gray-600 hover:bg-gray-700/50' : 
                                    isDeadHardcore ? 'bg-red-900/50 border-red-700 hover:bg-red-800/50' :
                                    'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                                }`}
                            >
                                <p className={`font-bold ${isTechDemo ? 'text-cyan-400' : isEmpty ? 'text-gray-500' : isDeadHardcore ? 'text-red-300' : 'text-yellow-300'}`}>
                                    {isTechDemo ? "Proof of Concept" : `Slot ${slot.slotId + 1}: ${metadata?.username || 'Empty Slot'}`}
                                </p>
                                {!isEmpty && metadata && (
                                    <div className="text-xs mt-1 text-gray-400 space-y-0.5">
                                        <p>Lvl: {metadata.combatLevel} (Total: {metadata.totalLevel})</p>
                                        <p>Location: {metadata.currentPoiName}</p>
                                        <p>Last Played: {formatDate(slot.updatedAt)}</p>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {confirmDelete !== null && selectedSlot && selectedSlot.metadata && (
                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[90]">
                    <div className="bg-gray-800 border-2 border-red-500 rounded-lg p-6 w-full max-w-md text-center">
                        <h2 className="text-xl font-bold text-red-400 mb-4">Confirm Deletion</h2>
                        <p className="text-gray-300 mb-4">
                            This action is permanent and cannot be undone. Please type the character's name to confirm: <strong className="text-white">{selectedSlot.metadata.username}</strong>
                        </p>
                        <input
                            type="text"
                            value={confirmDeleteText}
                            onChange={(e) => setConfirmDeleteText(e.target.value)}
                            className="w-full text-center p-2 bg-gray-900 border border-gray-500 rounded-md mb-4"
                        />
                        <div className="flex justify-center gap-4">
                            <Button onClick={handleDelete} variant="secondary" disabled={confirmDeleteText !== selectedSlot.metadata.username}>Delete Forever</Button>
                            <Button onClick={() => { setConfirmDelete(null); setConfirmDeleteText(''); }} variant="primary">Cancel</Button>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default SaveSlotScreen;