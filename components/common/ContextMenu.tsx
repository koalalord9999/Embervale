

import React, { useState, useEffect, useRef } from 'react';

export interface ContextMenuOption {
    label: React.ReactNode;
    onClick: () => boolean | void;
    disabled?: boolean;
}

interface ContextMenuProps {
    options: ContextMenuOption[];
    triggerEvent: React.MouseEvent | React.Touch;
    onClose: () => void;
    isTouchInteraction: boolean;
    title?: string;
    content?: React.ReactNode;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ options, triggerEvent, onClose, isTouchInteraction, title, content }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const keyNum = parseInt(e.key, 10);
            if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 9) {
                const optionIndex = keyNum - 1;
                if (options[optionIndex] && !options[optionIndex].disabled) {
                    e.preventDefault();
                    const keepOpen = options[optionIndex].onClick();
                    if (keepOpen !== true) {
                        onClose();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [options, onClose]);


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
    }, [triggerEvent, title, options, content]);

    return (
        <>
            <div className="fixed inset-0 z-[75]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
            <div
                ref={menuRef}
                className="fixed bg-gray-900 border border-gray-600 rounded-md shadow-lg py-1 z-[80] max-h-[80vh] overflow-y-auto"
                style={style}
            >
                <ul>
                    {title ? (
                        <li className="px-4 pt-1 pb-2 border-b border-gray-700 mb-1">
                            <span className="font-bold text-yellow-400 text-sm whitespace-nowrap">{title}</span>
                        </li>
                    ) : (
                        <li aria-hidden="true" className="h-2"></li>
                    )}
                    {options.map((option, index) => (
                        <li key={index}>
                            <button
                                onClick={() => {
                                    if (!option.disabled) {
                                        const keepOpen = option.onClick();
                                        if (keepOpen !== true) {
                                            onClose();
                                        }
                                    }
                                }}
                                disabled={option.disabled}
                                className={`w-full text-left px-4 py-2 text-sm text-gray-200 transition-colors hover:bg-yellow-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center`}
                            >
                                <span>{option.label}</span>
                            </button>
                        </li>
                    ))}
                    {content && (
                        <>
                            <li className="border-t border-gray-700 my-1" />
                            <li className="px-4 py-2 text-sm text-gray-200">
                                {content}
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
};

export default ContextMenu;