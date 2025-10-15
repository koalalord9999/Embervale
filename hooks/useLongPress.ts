import React, { useCallback, useRef, useEffect } from 'react';

interface LongPressOptions {
    onLongPress: (event: React.MouseEvent | React.TouchEvent) => void;
    onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
    delay?: number;
}

export const useLongPress = ({ onLongPress, onClick, delay = 400 }: LongPressOptions) => {
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
        if ('button' in event && event.button !== 0) return;

        cleanup(); // Cleanup any previous state on new press

        const point = 'touches' in event ? event.touches[0] : event;
        pressStartPos.current = { x: point.clientX, y: point.clientY };
        
        // React reuses event objects, so we need to capture the properties we need.
        const eventForTimeout = {
            ...('touches' in event ? { clientX: point.clientX, clientY: point.clientY } : event),
            target: event.target,
            currentTarget: event.currentTarget,
        };

        timeout.current = setTimeout(() => {
            if (!isDrag.current) {
                isLongPressFired.current = true;
                onLongPress(eventForTimeout as any);
            }
        }, delay);
    }, [onLongPress, delay, cleanup]);

    const handlePressEnd = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        // Prevent emulated mouse events on touch devices, which is critical for preventing ghost clicks.
        if (event.type === 'touchend') {
            event.preventDefault();
        }

        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        
        // This is a single tap if long press hasn't fired and it wasn't a drag
        if (!isLongPressFired.current && !isDrag.current) {
            onClick?.(event);
        }

        cleanup();
    }, [onClick, cleanup]);
    
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
        };
    }, []);

    return {
        onMouseDown: handlePressStart,
        onTouchStart: handlePressStart,
        onMouseUp: handlePressEnd,
        onTouchEnd: handlePressEnd,
        onContextMenu: (e: React.MouseEvent) => {
            e.preventDefault();
            onLongPress(e);
        },
    };
};
