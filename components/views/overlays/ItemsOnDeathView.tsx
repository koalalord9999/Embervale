import React from 'react';
import Button from '../../common/Button';
import { InventorySlot, Equipment, Item } from '../../../types';
import { ITEMS, getIconClassName } from '../../../constants';
import InventorySlotDisplay, { getDisplayName } from '../../panels/InventorySlot';

interface ItemsOnDeathViewProps {
    inventory: (InventorySlot | null)[];
    equipment: Equipment;
    coins: number;
    onClose: () => void;
}

const ItemsOnDeathView: React.FC<ItemsOnDeathViewProps> = ({ inventory, equipment, coins, onClose }) => {
    
    // Calculate which items are kept
    const allItems: InventorySlot[] = [];
    inventory.forEach(slot => { if (slot) allItems.push(slot); });
    Object.values(equipment).forEach(slot => { if (slot) allItems.push(slot); });
    
    allItems.sort((a, b) => (ITEMS[b.itemId]?.value ?? 0) - (ITEMS[a.itemId]?.value ?? 0));
    const keptItems = allItems.slice(0, 3);
    const lostCoins = coins;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b-2 border-gray-600">
                    <h1 className="text-2xl font-bold text-yellow-400">Items Kept on Death</h1>
                    <Button onClick={onClose} size="sm">Close</Button>
                </div>
                <div className="p-4">
                    <p className="text-gray-300 mb-4 text-center">
                        Upon death, you keep your 3 most valuable items. All other items and coins are dropped at your location and will disappear after 10 minutes of in-game time.
                    </p>
                    
                    <div className="bg-black/40 p-3 rounded-lg border border-gray-600 mb-4">
                        <h3 className="font-semibold text-green-400 mb-2 text-center">Items You Will Keep</h3>
                        {keptItems.length > 0 ? (
                             <div className="grid grid-cols-3 gap-2">
                                {keptItems.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center text-center text-xs">
                                        <div className="w-16 h-16 bg-gray-900 border border-gray-700 rounded-md p-1 relative">
                                            <img src={ITEMS[item.itemId].iconUrl} alt={ITEMS[item.itemId].name} className={`w-full h-full ${getIconClassName(ITEMS[item.itemId])}`} />
                                        </div>
                                        <span>{getDisplayName(item)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="text-center italic text-gray-400">You have no items to keep.</p>
                        )}
                       
                    </div>

                    <div className="bg-black/40 p-3 rounded-lg border border-gray-600">
                        <h3 className="font-semibold text-red-400 mb-2 text-center">Items Lost Upon Death</h3>
                        <p className="text-center">All other items not shown above will be dropped.</p>
                        {lostCoins > 0 && (
                             <p className="text-center mt-2">{lostCoins.toLocaleString()} Coins will be dropped.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemsOnDeathView;