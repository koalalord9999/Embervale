import React, { useCallback, useRef, useEffect } from 'react';

// FIX: Add optional onClick handler and simplified the hook to return handlers directly.
interface LongPressOptions {
    onLongPress: (event: React.MouseEvent | React.TouchEvent) => void;
    onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
    delay?: number;
}

export const useLongPress = ({ onLongPress, onClick, delay = 400 }: LongPressOptions) => {
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLongPressFired = useRef(false);
    const pressStartPos = useRef<{ x: number; y: number } | null>(null);
    const isDrag = useRef(false);

    const handlePressStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        if ('button' in event && event.button !== 0) return;

        isLongPressFired.current = false;
        isDrag.current = false;
        const point = 'touches' in event ? event.touches[0] : event;
        pressStartPos.current = { x: point.clientX, y: point.clientY };
        
        // Clone event for async access in timeout
        const { type, timeStamp, target, currentTarget } = event;
        const originalEvent = { type, timeStamp, target, currentTarget, clientX: point.clientX, clientY: point.clientY };

        timeout.current = setTimeout(() => {
            if (pressStartPos.current && !isDrag.current) {
                isLongPressFired.current = true;
                onLongPress(originalEvent as any);
            }
        }, delay);
    }, [onLongPress, delay]);

    const handleClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        if (!isLongPressFired.current && !isDrag.current) {
            onClick?.(event);
        }
        // Reset after click completes
        isLongPressFired.current = false;
        isDrag.current = false;
    }, [onClick]);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        onLongPress(event);
    };

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!pressStartPos.current) return;
            const movePoint = 'touches' in e ? e.touches[0] : e;
            const dx = Math.abs(movePoint.clientX - pressStartPos.current.x);
            const dy = Math.abs(movePoint.clientY - pressStartPos.current.y);

            if (dx > 15 || dy > 15) {
                isDrag.current = true;
                if (timeout.current) clearTimeout(timeout.current);
                pressStartPos.current = null; // Cancel tracking to prevent re-triggering
            }
        };

        const handleUp = () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            pressStartPos.current = null;
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchend', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchend', handleUp);
        };
    }, []);
    
    return {
        onMouseDown: handlePressStart,
        onTouchStart: handlePressStart,
        onClick: onClick ? handleClick : undefined,
        onContextMenu: handleContextMenu,
    };
};
