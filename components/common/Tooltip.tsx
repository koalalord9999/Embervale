
import React, { useState, useEffect, useRef } from 'react';

interface TooltipProps {
    content: React.ReactNode;
    position: { x: number; y: number };
}

const Tooltip: React.FC<TooltipProps> = ({ content, position }) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({
        // Initial position to avoid flicker
        transform: `translate(${position.x + 15}px, ${position.y + 15}px)`,
        opacity: 0, // Start hidden to prevent flicker before positioning
    });

    useEffect(() => {
        if (tooltipRef.current) {
            const tooltipWidth = tooltipRef.current.offsetWidth;
            const tooltipHeight = tooltipRef.current.offsetHeight;
            const gameContainer = document.querySelector('.w-\\[1024px\\]');

            // Default position (bottom-right of cursor)
            let x = position.x + 15;
            let y = position.y + 15;

            if (gameContainer) {
                const gameRect = gameContainer.getBoundingClientRect();

                // If tooltip goes past the right edge, move it to the left of the cursor.
                if (x + tooltipWidth > gameRect.right) {
                    x = position.x - 15 - tooltipWidth;
                }

                // If tooltip now goes past the left edge, clamp it.
                if (x < gameRect.left) {
                    x = gameRect.left;
                }

                // If tooltip goes past the bottom edge, move it above the cursor.
                if (y + tooltipHeight > gameRect.bottom) {
                    y = position.y - 15 - tooltipHeight;
                }
            }
            
            setStyle({
                transform: `translate(${x}px, ${y}px)`,
                opacity: 1,
                transition: 'opacity 0.1s ease-in',
            });
        }
    }, [content, position]);

    return (
        <div
            ref={tooltipRef}
            className="fixed top-0 left-0 bg-black/80 border border-gray-500 text-white text-sm rounded-md shadow-lg p-2 max-w-xs pointer-events-none z-50"
            style={style}
        >
            {content}
        </div>
    );
};

export default Tooltip;
