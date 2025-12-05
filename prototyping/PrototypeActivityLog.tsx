import React, { useEffect, useRef } from 'react';

interface ActivityLogProps {
    logs: string[];
    isDialogueActive?: boolean;
}

const PrototypeActivityLog: React.FC<ActivityLogProps> = ({ logs, isDialogueActive = false }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs]);

    if (isDialogueActive) {
        return null;
    }

    return (
        <div ref={containerRef} className="flex-grow overflow-y-auto pr-1 min-h-0">
            <div className="space-y-1">
                {logs.map((log, index) => (
                    <p key={index} className="text-sm text-gray-300 leading-tight">
                        {log}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default PrototypeActivityLog;
