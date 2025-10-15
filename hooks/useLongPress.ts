import React, { useCallback, useRef, useEffect } from 'react';

interface LongPressOptions {
    onLongPress: (event: React.MouseEvent | React.TouchEvent) => void;
    onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
    delay?: number;
}

export const useLongPress = ({ onLongPress, onClick, delay = 400 }: LongPressOptions) => {
    const onLongPressRef = useRef(onLongPress);
    const onClickRef = useRef(onClick);

    useEffect(() => {
        onLongPressRef.current = onLongPress;
    }, [onLongPress]);

    useEffect(() => {
        onClickRef.current = onClick;
    }, [onClick]);

    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLongPressFired = useRef(false);
    const isDrag = useRef(false);
    const pressStartPos = useRef<{ x: number; y: number } | null>(null);

    const cleanup = useCallback(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
        }
        isLongPressFired.current = false;
        isDrag.current = false;
        pressStartPos.current = null;
    }, []);

    const handlePressStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        // Prevent right-click from starting the long-press timer
        if ('button' in event && event.button !== 0) return;

        cleanup();

        const point = 'touches' in event ? event.touches[0] : event;
        pressStartPos.current = { x: point.clientX, y: point.clientY };
        
        const eventForTimeout = {
            ...('touches' in event ? { clientX: point.clientX, clientY: point.clientY } : event),
            target: event.target,
            currentTarget: event.currentTarget,
        };

        timeout.current = setTimeout(() => {
            if (!isDrag.current) {
                isLongPressFired.current = true;
                onLongPressRef.current(eventForTimeout as any);
            }
        }, delay);
    }, [delay, cleanup]);

    const handlePressEnd = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        // Prevent emulated mouse events on touch devices (ghost clicks)
        if (event.type === 'touchend') {
            event.preventDefault();
        }

        // Prevent right-click mouseup from triggering single-tap
        if ('button' in event && event.button !== 0) {
            cleanup();
            return;
        }

        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        
        if (!isLongPressFired.current && !isDrag.current) {
            onClickRef.current?.(event);
        }

        cleanup();
    }, [cleanup]);
    
    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!pressStartPos.current) return;
            const movePoint = 'touches' in e ? e.touches[0] : e;
            const dx = Math.abs(movePoint.clientX - pressStartPos.current.x);
            const dy = Math.abs(movePoint.clientY - pressStartPos.current.y);

            if (dx > 10 || dy > 10) {
                isDrag.current = true;
                if (timeout.current) {
                    clearTimeout(timeout.current);
                }
            }
        };

        window.addEventListener('mousemove', handleMove, { passive: true });
        window.addEventListener('touchmove', handleMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            cleanup(); // Ensure cleanup happens on unmount
        };
    }, [cleanup]);

    return {
        onMouseDown: handlePressStart,
        onTouchStart: handlePressStart,
        onMouseUp: handlePressEnd,
        onTouchEnd: handlePressEnd,
        onContextMenu: (e: React.MouseEvent) => {
            e.preventDefault();
            // Clear any pending long-press timer since context menu is an immediate action
            cleanup();
            // Fire the long press action immediately for right-click
            onLongPressRef.current(e);
        },
    };
};