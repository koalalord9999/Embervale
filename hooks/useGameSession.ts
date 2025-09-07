
import { useState } from 'react';

export const useGameSession = (initialPoiId: string) => {
    const [currentPoiId, setCurrentPoiId] = useState<string>(initialPoiId);

    return {
        currentPoiId,
        setCurrentPoiId,
    };
};
