import React, { useState, useMemo } from 'react';
import { Slot, PlayerType } from '../../types';
import Button from '../common/Button';
import DeadCharacterView from './DeadCharacterView';

interface SaveSlotScreenProps {
    slots: Slot[];
    onSelectSlot: (slotId: number) => void;
    onCreateNew: (slotId: number) => void;
    onDelete: (slotId: number) => void;
    onExport: (slotId: number) => void;
    onImport: (slotId: number) => void;
    assets: Record<string, string> | null;
}

const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString();
};

const SaveSlotScreen: React.FC<SaveSlotScreenProps> = ({ slots, onSelectSlot, onCreateNew, onDelete, onExport, onImport, assets }) => {
    const [selectedSlotId, setSelectedSlotId] = useState<number>(0);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [confirmDeleteText, setConfirmDeleteText] = useState('');

    const selectedSlot = useMemo(() => slots.find(s => s.slotId === selectedSlotId), [slots, selectedSlotId]);
    const isSelectedEmpty = !selectedSlot?.data;
    const isSelectedDead = selectedSlot?.data?.isDead;

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
        <div className="w-full h-full p-4 flex items-center justify-center relative">
            <div className="relative z-10 w-full max-w-6xl h-full max-h-[700px] bg-gray-900/80 border-2 border-gray-700 rounded-lg p-6 flex gap-6">
                
                {/* Left Panel - Slot Details */}
                <div className="w-2/3 flex flex-col justify-center items-center text-center">
                    {isSelectedDead ? (
                        <DeadCharacterView slot={selectedSlot!} onDelete={() => setConfirmDelete(selectedSlotId)} />
                    ) : isSelectedEmpty ? (
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-gray-400">Empty Slot</h2>
                            <Button onClick={() => onCreateNew(selectedSlotId)} size="md" variant="primary">Create New Character</Button>
                            <Button onClick={() => onImport(selectedSlotId)} size="md" variant="secondary">Import Save</Button>
                        </div>
                    ) : selectedSlot && selectedSlot.metadata ? (
                        <div className="animate-fade-in space-y-4">
                            <h2 className="text-5xl font-bold text-yellow-300">{selectedSlot.metadata.username}</h2>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-lg">
                                <p>Combat Level:</p><p className="font-semibold">{selectedSlot.metadata.combatLevel}</p>
                                <p>Total Level:</p><p className="font-semibold">{selectedSlot.metadata.totalLevel}</p>
                                <p>Location:</p><p className="font-semibold">{selectedSlot.metadata.currentPoiName}</p>
                                <p>Game Mode:</p><p className="font-semibold">{selectedSlot.metadata.playerType}</p>
                            </div>
                            <Button onClick={() => onSelectSlot(selectedSlotId)} size="md" variant="primary" className="mt-8">Play</Button>
                             <div className="flex gap-4 justify-center mt-4">
                                {selectedSlot.metadata.playerType === PlayerType.Cheats && (
                                    <Button onClick={() => onExport(selectedSlotId)} size="sm" variant="secondary">Export</Button>
                                )}
                                <Button onClick={() => onImport(selectedSlotId)} size="sm" variant="secondary">Import</Button>
                                <Button onClick={() => setConfirmDelete(selectedSlotId)} size="sm" variant="secondary">Delete</Button>
                            </div>
                        </div>
                    ) : <div className="text-gray-400">Loading slot...</div>}
                </div>

                {/* Right Panel - Slot List */}
                <div className="w-1/3 flex flex-col gap-3 overflow-y-auto pr-2">
                    <h3 className="text-2xl font-bold text-yellow-400 text-center mb-2">Save Slots</h3>
                    {slots.map(slot => {
                        const isSelected = slot.slotId === selectedSlotId;
                        const isEmpty = !slot.data;
                        const isDead = slot.data?.isDead;
                        const metadata = slot.metadata;

                        return (
                            <button
                                key={slot.slotId}
                                onClick={() => { setSelectedSlotId(slot.slotId); setConfirmDelete(null); setConfirmDeleteText(''); }}
                                className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                                    isSelected ? 'bg-yellow-800/50 border-yellow-500 scale-105' : 
                                    isEmpty ? 'bg-black/30 border-dashed border-gray-600 hover:bg-gray-700/50' : 
                                    isDead ? 'bg-red-900/50 border-red-700 hover:bg-red-800/50' :
                                    'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                                }`}
                            >
                                <p className={`font-bold ${isEmpty ? 'text-gray-500' : isDead ? 'text-red-300' : 'text-yellow-300'}`}>
                                    Slot {slot.slotId + 1}: {metadata?.username || 'Empty Slot'}
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