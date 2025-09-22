import { useState, useEffect } from 'react';

export const useIsTouchDevice = (override?: boolean): boolean => {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        if (override !== undefined) {
            setIsTouch(override);
            return;
        }

        const mediaQuery = window.matchMedia('(pointer: coarse)');
        
        const updateIsTouch = () => {
            setIsTouch(mediaQuery.matches);
        };
        
        updateIsTouch(); // Set initial value

        // Use the modern addEventListener for changes
        mediaQuery.addEventListener('change', updateIsTouch);

        return () => {
            mediaQuery.removeEventListener('change', updateIsTouch);
        };
    }, [override]);

    return isTouch;
};
