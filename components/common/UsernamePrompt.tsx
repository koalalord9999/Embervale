import React, { useState } from 'react';
import Button from './Button';

interface UsernamePromptProps {
    onConfirm: (username: string) => void;
    onCancel: () => void;
}

const UsernamePrompt: React.FC<UsernamePromptProps> = ({ onConfirm, onCancel }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = () => {
        const trimmedUsername = username.trim();
        if (trimmedUsername.length < 3 || trimmedUsername.length > 12) {
            setError('Username must be between 3 and 12 characters.');
            return;
        }
        setError('');
        onConfirm(trimmedUsername);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-4 text-center">Create Your Character</h2>
                <p className="text-gray-300 text-center mb-6">Please enter a name for your adventurer.</p>
                <div className="flex flex-col items-center justify-center my-6 gap-2">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={12}
                        className="w-64 text-center text-xl p-2 bg-gray-900 border border-gray-500 rounded-md"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                    />
                     {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
                <div className="flex justify-center gap-4">
                    <Button onClick={handleConfirm} disabled={username.trim().length < 3 || username.trim().length > 12}>
                        Begin Adventure
                    </Button>
                    <Button onClick={onCancel} variant="secondary">Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default UsernamePrompt;