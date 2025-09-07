import { useState, useCallback } from 'react';

export const useActivityLog = (initialLog: string[]) => {
    const [activityLog, setActivityLog] = useState<string[]>(initialLog);

    const addLog = useCallback((message: string) => {
        // Add new logs to the end and keep the list at a max of 100 entries.
        setActivityLog(prev => [...prev.slice(-99), message]);
    }, []);

    return { activityLog, setActivityLog, addLog };
};
