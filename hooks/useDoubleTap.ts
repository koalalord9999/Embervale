

import React, { useRef, useCallback } from 'react';

interface DoubleTapOptions {
  onDoubleTap: (event: React.MouseEvent | React.TouchEvent) => void;
  onSingleTap?: (event: React.MouseEvent | React.TouchEvent) => void;
  latency?: number;
}

export const useDoubleTap = ({ onDoubleTap, onSingleTap, latency = 250 }: DoubleTapOptions) => {
  const tapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const touchHandler = useCallback((event: React.TouchEvent) => {
    if (!tapTimeout.current) {
      tapTimeout.current = setTimeout(() => {
        onSingleTap?.(event);
        tapTimeout.current = null;
      }, latency);
    } else {
      clearTimeout(tapTimeout.current);
      tapTimeout.current = null;
      onDoubleTap(event);
    }
  }, [onDoubleTap, onSingleTap, latency]);

  const mouseClickHandler = (event: React.MouseEvent) => {
    // For mouse, we don't want a delay.
    // Double-clicking will fire two separate click events, which is acceptable.
    onSingleTap?.(event);
  };
  
  const touchEndHandler = (event: React.TouchEvent) => {
    event.preventDefault(); // Prevent emulated mouse events
    touchHandler(event); // Use the delayed handler for touch
  };

  return {
    onClick: mouseClickHandler,
    onTouchEnd: touchEndHandler,
  };
};