
import React, { useState } from 'react';
import Button from './Button';

interface ImportModalProps {
    onImport: (data: string) => boolean;
    onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ onImport, onClose }) => {
    const [data, setData] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleImport = () => {
        setError(null);
        if (data.trim()) {
            const success = onImport(data.trim());
            if (!success) {
                setError("Import failed: Unknown or outdated save format. If you are seeing this, please reach out to the Developer and have your save file fixed.");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">Import Save Data</h2>
                <p className="text-gray-300 mb-4 text-sm">Paste your previously exported save data into the text box below.</p>
                <textarea
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="w-full h-48 bg-gray-900 border border-gray-500 rounded-md p-2 text-xs font-mono text-gray-300"
                    placeholder="Paste your save data here..."
                />
                {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
                <div className="flex justify-center gap-4 mt-4">
                    <Button onClick={handleImport} variant="primary" disabled={!data.trim()}>Load Game</Button>
                    <Button onClick={onClose} variant="secondary">Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
