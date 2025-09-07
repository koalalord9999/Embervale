
import React from 'react';
import Button from './common/Button';

interface ItemsOnDeathViewProps {
    coins: number;
    onClose: () => void;
}

const ItemsOnDeathView: React.FC<ItemsOnDeathViewProps> = ({ coins, onClose }) => {
    const coinsLost = Math.floor(coins / 2);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b-2 border-gray-600">
                    <h1 className="text-2xl font-bold text-yellow-400">Items Kept on Death</h1>
                    <Button onClick={onClose} size="sm">Close</Button>
                </div>
                <div className="p-4 text-center">
                    <p className="text-gray-300 mb-4">
                        Upon death, you will respawn in Meadowdale. You will keep all of your items, but you will lose a portion of your coins.
                    </p>
                    <div className="bg-black/40 p-3 rounded-lg border border-gray-600">
                        <h3 className="font-semibold text-red-400 mb-2">Items Lost Upon Death</h3>
                        {coinsLost > 0 ? (
                             <p>{coinsLost.toLocaleString()} Coins</p>
                        ) : (
                             <p>None</p>
                        )}
                       
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemsOnDeathView;
