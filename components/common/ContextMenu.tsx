
import React, { useState, useEffect, useRef } from 'react';

export interface ContextMenuOption {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

interface ContextMenuProps {
    options: ContextMenuOption[];
    triggerEvent: React.MouseEvent | React.Touch;
    onClose: () => void;
    isTouchInteraction: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ options, triggerEvent, onClose, isTouchInteraction }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        optionsRef.current = optionsRef.current.slice(0, options.length);
    }, [options]);

    useEffect(() => {
        if (menuRef.current) {
            const menuWidth = menuRef.current.offsetWidth;
            const menuHeight = menuRef.current.offsetHeight;
            const gameContainer = document.querySelector('.game-container');
            if (!gameContainer) return;
            const gameRect = gameContainer.getBoundingClientRect();

            const touchOffset = 20;
            let x = triggerEvent.clientX + touchOffset;
            let y = triggerEvent.clientY + touchOffset;

            if (x + menuWidth > gameRect.right) {
                x = triggerEvent.clientX - menuWidth - touchOffset;
            }
            if (y + menuHeight > gameRect.bottom) {
                y = triggerEvent.clientY - menuHeight - touchOffset;
            }
            if (x < gameRect.left) x = gameRect.left + 5;
            if (y < gameRect.top) y = gameRect.top + 5;
            
            setStyle({
                top: y,
                left: x,
                opacity: 1,
                transition: 'opacity 0.1s ease-in',
            });
        }
    }, [triggerEvent]);
    
     useEffect(() => {
        if (!isTouchInteraction) return;

        const handleMouseMove = (e: MouseEvent) => {
            let foundIndex = -1;
            optionsRef.current.forEach((button, index) => {
                if (button) {
                    const rect = button.getBoundingClientRect();
                    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
                        foundIndex = index;
                    }
                }
            });
            setHoveredIndex(foundIndex !== -1 ? foundIndex : null);
        };
        
        const handleMouseUp = () => {
            if (hoveredIndex !== null) {
                const option = options[hoveredIndex];
                if (option && !option.disabled) {
                    option.onClick();
                }
            }
            onClose();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isTouchInteraction, onClose, options, hoveredIndex]);

    return (
        <>
            <div className="fixed inset-0 z-[75]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
            <div
                ref={menuRef}
                className="fixed bg-gray-900 border border-gray-600 rounded-md shadow-lg py-1 z-[80]"
                style={style}
            >
                <ul>
                    {options.map((option, index) => (
                        <li key={index}>
                            <button
                                ref={el => { optionsRef.current[index] = el; }}
                                onClick={() => {
                                    if (!isTouchInteraction) {
                                        option.onClick();
                                        onClose();
                                    }
                                }}
                                disabled={option.disabled}
                                className={`w-full text-left px-4 py-2 text-sm text-gray-200 transition-colors ${hoveredIndex === index ? 'bg-yellow-600' : 'hover:bg-yellow-700'} disabled:text-gray-500 disabled:cursor-not-allowed`}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default ContextMenu;