

import React, { useState, useMemo, useEffect } from 'react';
import Button from './Button';
import { ExportDataState } from '../../hooks/useUIState';

interface ExportModalProps {
    exportState: ExportDataState;
    onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ exportState, onClose }) => {
    const { data, onCopy, title, copyButtonText: customCopyText } = exportState;
    const [copyButtonText, setCopyButtonText] = useState(customCopyText || 'Copy to Clipboard');

    const isPaginated = Array.isArray(data);
    const paginatedData = useMemo(() => 
        isPaginated ? data : (typeof data === 'string' ? [{ filePath: 'Exported Data', content: data }] : []), 
    [data, isPaginated]);

    const [currentPage, setCurrentPage] = useState(0);

    const currentContent = paginatedData[currentPage];

    // Reset page when data changes to avoid out-of-bounds errors
    useEffect(() => {
        setCurrentPage(0);
    }, [data]);

    const handleCopy = () => {
        if (!currentContent) return;
        navigator.clipboard.writeText(currentContent.content).then(() => {
            setCopyButtonText('Copied!');
            onCopy?.();
            setTimeout(() => setCopyButtonText(customCopyText || 'Copy to Clipboard'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyButtonText('Copy Failed!');
            setTimeout(() => setCopyButtonText(customCopyText || 'Copy to Clipboard'), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl p-6 w-full max-w-2xl flex flex-col">
                <h2 className="text-xl font-bold text-yellow-400 mb-2 text-center">{title || 'Export Save Data'}</h2>
                
                {paginatedData.length > 1 && (
                    <div className="text-center text-sm text-gray-400 mb-2">
                        File {currentPage + 1} of {paginatedData.length}: <span className="font-semibold text-gray-200">{currentContent?.filePath}</span>
                    </div>
                )}

                {paginatedData.length === 1 && typeof data !== 'string' && (
                    <div className="text-center text-sm text-gray-400 mb-2">
                        File: <span className="font-semibold text-gray-200">{currentContent?.filePath}</span>
                    </div>
                )}
                
                <p className="text-gray-300 mb-4 text-sm">Copy the text below and save it. This data represents changes you've made in developer mode.</p>
                <textarea
                    readOnly
                    value={currentContent?.content || ''}
                    className="w-full h-96 bg-gray-900 border border-gray-500 rounded-md p-2 text-xs font-mono text-gray-300"
                />
                <div className="flex justify-between items-center gap-4 mt-4">
                    {paginatedData.length > 1 ? (
                        <div className="flex gap-2">
                            <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0}>Previous</Button>
                            <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= paginatedData.length - 1}>Next</Button>
                        </div>
                    ) : <div /> /* Placeholder for alignment */ }
                    
                    <div className="flex justify-end gap-4">
                        <Button onClick={handleCopy} variant="primary" disabled={!currentContent}>{copyButtonText}</Button>
                        <Button onClick={onClose} variant="secondary">Close</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
