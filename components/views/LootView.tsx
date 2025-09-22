import React, { useState, useEffect } from 'react';
import { GroundItem, InventorySlot } from '../../types';
import { ITEMS, getIconClassName } from '../../constants';
import Button from '../common/Button';
import { TooltipState } from '../../hooks/useUIState';
import { getDisplayName } from '../panels/InventorySlot';

const getQuantityColor = (quantity: number): string => {
    if (quantity >= 10000000) return 'text-green-400';
    if (quantity >= 100000) return 'text-white';
    return 'text-yellow-300';
};

const formatItemQuantity = (quantity: number): string => {
    if (quantity >= 1000000000) {
        return `${Math.floor(quantity / 1000000000)}B`;
    }
    if (quantity >= 1000000) {
        return `${Math.floor(quantity / 1000000)}M`;
    }
    if (quantity >= 10000) {
        return `${Math.floor(quantity / 1000)}k`;
    }
    return quantity.toLocaleString();
};


interface LootViewProps {
    items: GroundItem[];
    onPickUp: (uniqueId: number) => void;
    onTakeAll: () => void;
    onClose: () => void;
    setTooltip: (tooltip: TooltipState | null) => void;
}

const LootSlot: React.FC<{
    groundItem: GroundItem;
    onPickUp: (id: number) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
}> = ({ groundItem, onPickUp, setTooltip }) => {
    const { item, uniqueId, dropTime } = groundItem;
    const itemData = ITEMS[item.itemId];
    const [timeLeft, setTimeLeft] = useState(300 * 1000); // 5 minutes in ms

    useEffect(() => {
        const totalDuration = 5 * 60 * 1000;
        let frameId: number;
        const update = () => {
            const elapsed = Date.now() - dropTime;
            const remaining = totalDuration - elapsed;
            setTimeLeft(Math.max(0, remaining));
            if (remaining > 0) {
                frameId = requestAnimationFrame(update);
            }
        };
        frameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId);
    }, [dropTime]);
    
    if (!itemData) return null;

    const handleMouseEnter = (e: React.MouseEvent) => {
        const tooltipContent = (
            <div>
                <p className="font-bold text-yellow-300">{getDisplayName(item)}</p>
                <p className="text-sm text-gray-300">{itemData.description}</p>
                {itemData.stackable && item.quantity > 999 && (
                    <p className="text-sm mt-1 text-gray-400">Quantity: {item.quantity.toLocaleString()}</p>
                )}
            </div>
        );
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };
    
    const totalDuration = 5 * 60 * 1000;
    const progressDegrees = ((totalDuration - timeLeft) / totalDuration) * 360;

    const timerStyle = {
        background: `conic-gradient(rgba(0,0,0,0.5) ${progressDegrees}deg, #22c55e 0deg)`,
    };

    return (
        <div 
            className="w-full aspect-square bg-gray-900 border-2 border-gray-700 rounded-md flex items-center justify-center p-1 relative transition-colors cursor-pointer hover:border-yellow-400"
            onClick={() => onPickUp(uniqueId)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
             <div
                className="absolute top-1 left-1 w-4 h-4 rounded-full z-10 border border-black/50"
                style={timerStyle}
                role="timer"
                aria-label={`Time remaining for ${itemData.name}`}
            />
            {item.noted ? (
                <div className="item-note-wrapper">
                    <img src="https://api.iconify.design/game-icons:folded-paper.svg" alt="Note" className="item-note-paper" />
                    <img src={itemData.iconUrl} alt={itemData.name} className={`item-note-icon ${getIconClassName(itemData)}`} />
                </div>
            ) : (
                <img src={itemData.iconUrl} alt={itemData.name} className={`w-full h-full ${getIconClassName(itemData)}`} />
            )}
            {item.quantity > 1 && !itemData.doseable && (
                <span className={`absolute bottom-0 right-1 text-xs font-bold ${getQuantityColor(item.quantity)}`} style={{ textShadow: '1px 1px 1px black', zIndex: 2 }}>
                    {formatItemQuantity(item.quantity)}
                </span>
            )}
            {itemData.doseable && item.doses && (
                <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                    {item.doses}
                </span>
            )}
        </div>
    );
};


const LootView: React.FC<LootViewProps> = ({ items, onPickUp, onTakeAll, onClose, setTooltip }) => {
    if (items.length === 0) {
        onClose();
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b-2 border-gray-600">
                    <h1 className="text-2xl font-bold text-yellow-400">Items on Ground</h1>
                    <Button onClick={onClose} size="sm">Close</Button>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-5 gap-2 bg-black/40 p-2 rounded-lg border border-gray-600 min-h-[184px] content-start">
                        {items.map(gi => (
                            <LootSlot key={gi.uniqueId} groundItem={gi} onPickUp={onPickUp} setTooltip={setTooltip} />
                        ))}
                    </div>
                    <div className="mt-4 flex justify-center">
                        <Button onClick={onTakeAll} variant="primary">Take All</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LootView;