import React, { useEffect, useRef, useState } from 'react';

interface ActivityLogProps {
    logs: string[];
    isDialogueActive?: boolean;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs, isDialogueActive = false }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        if (containerRef.current && !isMinimized) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs, isMinimized]);

    return (
        <div className={`activity-log-wrapper bg-black/70 border-2 border-gray-600 rounded-lg p-3 transition-all duration-300 ease-in-out ${isMinimized ? 'h-12 flex-shrink-0' : 'h-44'} flex flex-col`}>
            <div className="flex justify-between items-center mb-1 flex-shrink-0">
                <h4 className="text-yellow-300 font-semibold">Activity Log</h4>
                <button onClick={() => setIsMinimized(v => !v)} className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-lg font-bold border border-gray-500 flex items-center justify-center">
                    {isMinimized ? '+' : '-'}
                </button>
            </div>
            {!isMinimized && !isDialogueActive && (
                <div ref={containerRef} className="flex-grow overflow-y-auto pr-1 animate-fade-in min-h-0">
                    <div className="space-y-1">
                        {logs.map((log, index) => (
                            <p key={index} className="text-sm text-gray-300 leading-tight">
                                {log}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityLog;