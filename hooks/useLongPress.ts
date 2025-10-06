
import React, { useCallback, useRef } from 'react';

interface LongPressOptions {
    onLongPress: (event: React.MouseEvent | React.TouchEvent) => void;
    onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
    delay?: number;
}

export const useLongPress = ({ onLongPress, onClick, delay = 400 }: LongPressOptions) => {
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pressStartPos = useRef<{ x: number, y: number } | null>(null);
    const isLongPressFired = useRef(false);

    const handlePressStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        // Prevent right-click from triggering this on desktop
        if ('button' in event && event.button !== 0) return;

        isLongPressFired.current = false;
        const point = 'touches' in event ? event.touches[0] : event;
        pressStartPos.current = { x: point.clientX, y: point.clientY };

        const originalEvent = event;
        
        // Only start long-press timer for touch events
        if ('touches' in event) {
            timeout.current = setTimeout(() => {
                isLongPressFired.current = true;
                onLongPress(originalEvent);
            }, delay);
        }

        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!pressStartPos.current) return;
            const movePoint = 'touches' in e ? e.touches[0] : e;
            const dx = Math.abs(movePoint.clientX - pressStartPos.current.x);
            const dy = Math.abs(movePoint.clientY - pressStartPos.current.y);

            if (dx > 15 || dy > 15) {
                if (timeout.current) clearTimeout(timeout.current);
                pressStartPos.current = null; // Invalidate press to prevent click on release
            }
        };

        const handlePressEnd = (e: MouseEvent | TouchEvent) => {
            if (timeout.current) clearTimeout(timeout.current);

            // Check if it's a touch event
            const isTouchEvent = 'touches' in e;

            if (onClick && !isLongPressFired.current && pressStartPos.current) {
                // For PC, the 'click' is triggered here on mouseup.
                // For touch, the 'click' is handled by the onTouchEnd on the component itself
                // to use the double-tap logic. So we only call onClick for non-touch events.
                if (!isTouchEvent) {
                    // FIX: The native MouseEvent `e` is not directly compatible with React.MouseEvent.
                    // The error message suggests casting to `unknown` first to resolve this type conflict.
                    // This is safe because the downstream `onClick` handler only uses properties common to both types.
                    onClick(e as unknown as React.MouseEvent);
                }
            }
            pressStartPos.current = null;
            
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handlePressEnd);
            window.removeEventListener('touchend', handlePressEnd);
        };
        
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('mouseup', handlePressEnd);
        window.addEventListener('touchend', handlePressEnd);

    }, [onLongPress, onClick, delay]);

    // This handles right-click on desktop to open the context menu
    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        onLongPress(event);
    };

    return {
        onMouseDown: handlePressStart,
        onTouchStart: handlePressStart,
        onContextMenu: handleContextMenu,
    };
};