
import React, { useState, useEffect } from 'react';
import Button from './Button';

interface MakeXModalProps {
    title: string;
    maxQuantity: number;
    onConfirm: (quantity: number) => void;
    onCancel: () => void;
}

const MakeXModal: React.FC<MakeXModalProps> = ({ title, maxQuantity, onConfirm, onCancel }) => {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // Clamp initial quantity if max is less than 1
        if (maxQuantity < 1) {
            setQuantity(0);
        } else {
            setQuantity(1);
        }
    }, [maxQuantity]);

    const handleConfirm = () => {
        if (quantity > 0) {
            onConfirm(quantity);
        }
        onCancel(); // Close modal after confirm
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
            setQuantity(1);
        } else {
            setQuantity(Math.max(1, Math.min(maxQuantity, value)));
        }
    };
    
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(parseInt(e.target.value, 10));
    };

    if (maxQuantity <= 0) {
        // This case should ideally be handled by disabling the button that opens the modal,
        // but as a fallback, we can show a message.
        return (
             <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl p-6 w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4">{title}</h2>
                    <p className="text-gray-300 mb-6">You don't have the resources to make any.</p>
                    <Button onClick={onCancel}>Close</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">{title}</h2>
                <div className="flex items-center justify-center my-6 gap-4">
                    <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={maxQuantity}
                        className="w-24 text-center text-xl p-2 bg-gray-900 border border-gray-500 rounded-md"
                        autoFocus
                    />
                    <span className="text-lg text-gray-400">/ {maxQuantity}</span>
                </div>
                
                <div className="mb-6">
                    <input
                        type="range"
                        min="1"
                        max={maxQuantity}
                        value={quantity}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="flex justify-center gap-4">
                    <Button onClick={handleConfirm} disabled={quantity <= 0}>Confirm</Button>
                    <Button onClick={onCancel} variant="secondary">Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default MakeXModal;