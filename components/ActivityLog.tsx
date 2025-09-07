
import React, { useEffect, useRef } from 'react';

interface ActivityLogProps {
    logs: string[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div ref={containerRef} className="bg-black/70 border-2 border-gray-600 rounded-lg h-32 p-3 overflow-y-auto">
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

export default ActivityLog;
