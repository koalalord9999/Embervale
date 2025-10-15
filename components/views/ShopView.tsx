import React from 'react';
import { InventorySlot, ShopStates, Item } from '../../types';
import { SHOPS, ITEMS, getIconClassName } from '../../constants';
import Button from '../common/Button';
import { ContextMenuOption } from '../common/ContextMenu';
import { MakeXPrompt, ContextMenuState } from '../../hooks/useUIState';
import { TooltipState } from '../../hooks/useUIState';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { getDisplayName } from '../panels/InventorySlot';

const getQuantityColor = (quantity: number): string => {
    if (quantity >= 10000000) return 'text-green-400'; // Green for 10M+
    if (quantity >= 100000) return 'text-white'; // White for 100k+
    return 'text-yellow-300'; // Default yellow
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


interface ShopViewProps {
    shopId: string;
    playerCoins: number;
    shopStates: ShopStates;
    onBuy: (shopId: string, itemId: string, quantity: number) => void;
    addLog: (message: string) => void;
    onExit: () => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    isOneClickMode: boolean;
}

const ShopSlot: React.FC<{
    slot: InventorySlot;
    price: number;
    stock?: number;
    onBuyOne: () => void;
    onContextMenu: (e: React.MouseEvent | React.TouchEvent) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    isOneClickMode: boolean;
}> = ({ slot, price, stock, onBuyOne, onContextMenu, setTooltip, isOneClickMode }) => {
    const item = ITEMS[slot.itemId];
    if (!item) {
        return <div className="w-full aspect-square bg-gray-900 border border-gray-700 rounded-md" />;
    }

    const handleSingleTap = (e: React.MouseEvent | React.TouchEvent) => {
        if (isOneClickMode) {
            onContextMenu(e);
            return;
        }
        onBuyOne();
    };

    const combinedHandlers = useLongPress({
        onLongPress: onContextMenu,
        onClick: handleSingleTap
    });

    const handleMouseEnter = (e: React.MouseEvent) => {
        const priceInfo = (
            <>
                {item.stackable && stock && stock > 999 && (
                    <p className="text-sm mt-1 text-gray-400">Stock: {stock.toLocaleString()}</p>
                )}
                 <p className="text-sm mt-2">Buy Price: <span className="font-semibold">{price} coins</span></p>
            </>
        );
        setTooltip({ item, slot, content: priceInfo, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <div
            className="w-full aspect-square bg-gray-800 border-2 border-gray-600 rounded-md flex items-center justify-center p-1 relative transition-colors cursor-pointer hover:border-yellow-400"
            {...combinedHandlers}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
            {stock !== undefined && stock > 0 && (
                <span className={`absolute bottom-0 right-1 text-xs font-bold ${getQuantityColor(stock)}`} style={{ textShadow: '1px 1px 1px black' }}>
                    {formatItemQuantity(stock)}
                </span>
            )}
             {item.doseable && item.initialDoses && (
                <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                    {item.initialDoses}
                </span>
             )}
        </div>
    );
};

const ShopView: React.FC<ShopViewProps> = ({ shopId, playerCoins, shopStates, onBuy, addLog, onExit, setContextMenu, setMakeXPrompt, setTooltip, isOneClickMode }) => {
    const shop = SHOPS[shopId];
    const currentShopState = shopStates[shopId];
    
    const performActionAndCloseTooltip = (action: () => void) => {
        action();
        setTooltip(null);
    };

    const createBuyContextMenu = (e: React.MouseEvent | React.TouchEvent, itemId: string) => {
        e.preventDefault();
        const event = 'touches' in e ? e.touches[0] : e;
        
        const itemState = currentShopState?.[itemId];
        const itemData = ITEMS[itemId];
        const defaultShopItem = shop?.inventory.find(i => i.itemId === itemId);

        if (!itemState || !itemData || !defaultShopItem) return;

        const price = Math.ceil(itemData.value * defaultShopItem.priceModifier);
        const maxBuyableByCoins = price > 0 ? Math.floor(playerCoins / price) : Infinity;
        const maxBuyable = Math.min(maxBuyableByCoins, itemState.currentStock);

        const performBuyAction = (quantity: number) => {
            performActionAndCloseTooltip(() => onBuy(shopId, itemId, quantity));
        };

        const options: ContextMenuOption[] = [
            { label: `Buy 1 (${price})`, onClick: () => performBuyAction(1), disabled: maxBuyable < 1 },
            { label: `Buy 5 (${price * 5})`, onClick: () => performBuyAction(5), disabled: maxBuyable < 5 },
            { label: `Buy 10 (${price * 10})`, onClick: () => performBuyAction(10), disabled: maxBuyable < 10 },
            { 
                label: 'Buy X...', 
                onClick: () => setMakeXPrompt({
                    title: `Buy ${ITEMS[itemId].name}`,
                    max: maxBuyable,
                    onConfirm: (quantity) => performBuyAction(quantity)
                }), 
                disabled: maxBuyable < 1 
            },
        ];
        setContextMenu({ options, event, isTouchInteraction: 'touches' in e });
    };

    if (!shop || !currentShopState) return <div>Loading shop...</div>;

    return (
        <div className="flex flex-col h-full text-gray-200 animate-fade-in">
            <div className="flex justify-between items-center p-4 border-b-2 border-gray-600 flex-shrink-0">
                <h1 className="text-3xl font-bold text-yellow-400">{shop.name}</h1>
                <Button onClick={onExit}>Exit</Button>
            </div>
            
            <div className="flex-grow min-h-0 p-4">
                <div className="bg-black/40 p-2 rounded-lg border border-gray-600 flex flex-col h-full">
                    <h2 className="text-xl font-semibold mb-2 text-center text-yellow-300">Shop's Wares</h2>
                    <div className="flex-grow overflow-y-auto pr-1 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 content-start">
                        {shop.inventory.map(({ itemId, priceModifier }) => {
                            const item = ITEMS[itemId];
                            if (!item) return null;
                            const itemState = currentShopState[itemId];
                            const buyPrice = Math.ceil(item.value * priceModifier);
                            return (
                                <ShopSlot
                                    key={itemId}
                                    slot={{ itemId, quantity: 1, doses: item.initialDoses }}
                                    price={buyPrice}
                                    stock={itemState?.currentStock}
                                    onBuyOne={() => performActionAndCloseTooltip(() => onBuy(shopId, itemId, 1))}
                                    onContextMenu={(e) => createBuyContextMenu(e, itemId)}
                                    setTooltip={setTooltip}
                                    isOneClickMode={isOneClickMode}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopView;
