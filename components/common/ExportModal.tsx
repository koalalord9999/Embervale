
import React, { useState } from 'react';
import Button from './Button';

interface ExportModalProps {
    data: string;
    onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ data, onClose }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

    const handleCopy = () => {
        navigator.clipboard.writeText(data).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyButtonText('Copy Failed!');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">Export Save Data</h2>
                <p className="text-gray-300 mb-4 text-sm">Copy the text below and save it in a file on your computer. You can use this to import your progress later.</p>
                <textarea
                    readOnly
                    value={data}
                    className="w-full h-48 bg-gray-900 border border-gray-500 rounded-md p-2 text-xs font-mono text-gray-300"
                />
                <div className="flex justify-center gap-4 mt-4">
                    <Button onClick={handleCopy} variant="primary">{copyButtonText}</Button>
                    <Button onClick={onClose} variant="secondary">Close</Button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
