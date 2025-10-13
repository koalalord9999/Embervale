
import React from 'react';
import Button from './Button';

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
    const handleConfirm = () => {
        onConfirm();
        onCancel(); // Close modal after confirm
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110]">
            <div className="bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl p-6 w-full max-w-md text-center">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">Confirmation</h2>
                <p className="text-gray-300 mb-6">{message}</p>
                <div className="flex justify-center gap-4">
                    <Button onClick={handleConfirm} variant="primary">Confirm</Button>
                    <Button onClick={onCancel} variant="secondary">Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
