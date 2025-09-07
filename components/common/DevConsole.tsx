import React, { useState, useEffect, useRef } from 'react';

interface DevConsoleProps {
    onCommand: (command: string) => void;
    onClose: () => void;
}

const DevConsole: React.FC<DevConsoleProps> = ({ onCommand, onClose }) => {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onCommand(input.trim());
        }
        onClose();
    };

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-black/70 p-2 animate-fade-in">
            <form onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-gray-900 text-gray-200 border border-gray-600 rounded-md px-2 py-1 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter command..."
                    autoComplete="off"
                    spellCheck="false"
                />
            </form>
        </div>
    );
};

export default DevConsole;
