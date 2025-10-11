import React from 'react';
import { TELEPORT_UNLOCK_THRESHOLD } from '../../constants';
import { POIS } from '../../data/pois';
import Button from '../common/Button';

interface TeleportViewProps {
    fromBoardId: string;
    boardCompletions: Record<string, number>;
    onTeleport: (toBoardId: string) => void;
    onClose: () => void;
}

const TeleportView: React.FC<TeleportViewProps> = ({ fromBoardId, boardCompletions, onTeleport, onClose }) => {
    const unlockedBoards = Object.entries(boardCompletions)
        // FIX: Add explicit types for destructuring to resolve type error on 'count'.
        .filter(([boardId, count]: [string, number]) => count >= TELEPORT_UNLOCK_THRESHOLD && boardId !== fromBoardId)
        .map(([boardId]) => ({ id: boardId, name: POIS[boardId]?.name ?? 'Unknown Board' }));

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b-2 border-gray-600">
                    <h1 className="text-2xl font-bold text-yellow-400">Teleport</h1>
                    <Button onClick={onClose} size="sm">Cancel</Button>
                </div>
                <div className="p-4">
                    {unlockedBoards.length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-center text-gray-400 mb-4">Select a destination:</p>
                            {unlockedBoards.map(board => (
                                <Button key={board.id} onClick={() => onTeleport(board.id)} className="w-full">
                                    {board.name}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 italic">You have not mastered any other quest boards to teleport to.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeleportView;
