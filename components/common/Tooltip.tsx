
import React from 'react';

interface TooltipProps {
    content: React.ReactNode;
    position: { x: number; y: number };
}

const Tooltip: React.FC<TooltipProps> = ({ content, position }) => {
    return (
        <div
            className="fixed top-0 left-0 bg-black/80 border border-gray-500 text-white text-sm rounded-md shadow-lg p-2 max-w-xs pointer-events-none z-50"
            style={{
                transform: `translate(${position.x + 15}px, ${position.y + 15}px)`,
            }}
        >
            {content}
        </div>
    );
};

export default Tooltip;
