

import React, { useCallback, useRef, useEffect } from 'react';

interface LongPressOptions {
    onLongPress: (event: React.MouseEvent | React.TouchEvent) => void;
    onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
    delay?: number;
    isOneClickMode?: boolean;
}

export const useLongPress = ({ onLongPress, onClick, delay = 400, isOneClickMode = false }: LongPressOptions) => {
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
        if ('button' in event && event.button !== 0) return;

        const isTouchEvent = 'touches' in event;
        if (!isTouchEvent && !isOneClickMode) {
            return;
        }

        cleanup();
        
        const point = isTouchEvent ? event.touches[0] : (event as React.MouseEvent);
        pressStartPos.current = { x: point.clientX, y: point.clientY };
        
        timeout.current = setTimeout(() => {
            if (!isDrag.current) {
                isLongPressFired.current = true;
                onLongPressRef.current(event);
            }
        }, delay);
    }, [delay, cleanup, isOneClickMode]);

    const handlePressEnd = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        if (event.type === 'touchend' && event.cancelable) {
            event.preventDefault();
        }

        if ('button' in event && event.button !== 0) {
            cleanup();
            return;
        }

        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        
        if (!isLongPressFired.current && !isDrag.current) {
            if (isOneClickMode) {
                onLongPressRef.current(event);
            } else {
                onClickRef.current?.(event);
            }
        }

        cleanup();
    }, [cleanup, isOneClickMode]);
    
    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!pressStartPos.current) return;
            const movePoint = 'touches' in e ? e.touches[0] : e;
            if (!movePoint) return;
            const dx = Math.abs(movePoint.clientX - pressStartPos.current.x);
            const dy = Math.abs(movePoint.clientY - pressStartPos.current.y);

            if (dx > 15 || dy > 15) {
                isDrag.current = true;
                if (timeout.current) clearTimeout(timeout.current);
            }
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);

        const handleBlur = () => cleanup();
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('blur', handleBlur);
            cleanup();
        };
    }, [cleanup]);

    return {
        onMouseDown: handlePressStart,
        onTouchStart: handlePressStart,
        onMouseUp: handlePressEnd,
        onTouchEnd: handlePressEnd,
        onContextMenu: (e: React.MouseEvent) => {
            e.preventDefault();
            cleanup();
            onLongPressRef.current(e);
        },
    };
};