import { useState, useCallback } from 'react';

export const useActivityLog = (initialLog: string[]) => {
    const [activityLog, setActivityLog] = useState<string[]>(initialLog);

    const addLog = useCallback((message: string) => {
        setActivityLog(prev => {
            const regex = /^(.*?)(\s\((\d+)\))?$/;
            
            // Look for a matching message in the last 10 log entries.
            const searchStartIndex = Math.max(0, prev.length - 10);

            for (let i = prev.length - 1; i >= searchStartIndex; i--) {
                const existingLog = prev[i];
                const match = existingLog.match(regex);

                if (match) {
                    const baseMessage = match[1];
                    const count = match[3] ? parseInt(match[3], 10) : 1;

                    if (baseMessage === message) {
                        // Match found. Update count, remove old entry, add new one to the end.
                        const newCount = count + 1;
                        const newLog = `${message} (${newCount})`;
                        
                        const newLogs = [...prev];
                        newLogs.splice(i, 1); // Remove the old entry at its original position
                        newLogs.push(newLog); // Add the updated entry to the end
                        
                        return newLogs.slice(-125); // Maintain max log size
                    }
                }
            }

            // No match found in the last 10 entries, just append the new message.
            return [...prev.slice(-124), message];
        });
    }, []);

    return { activityLog, setActivityLog, addLog };
};
