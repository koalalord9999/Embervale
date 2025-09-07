
import React from 'react';

export interface ContextMenuOption {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

interface ContextMenuProps {
    options: ContextMenuOption[];
    position: { x: number; y: number };
    onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ options, position, onClose }) => {
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
            <div
                className="fixed bg-gray-900 border border-gray-600 rounded-md shadow-lg py-1 z-50"
                style={{ top: position.y, left: position.x }}
            >
                <ul>
                    {options.map((option, index) => (
                        <li key={index}>
                            <button
                                onClick={() => {
                                    option.onClick();
                                    onClose();
                                }}
                                disabled={option.disabled}
                                className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-yellow-700 disabled:text-gray-500 disabled:cursor-not-allowed"
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
