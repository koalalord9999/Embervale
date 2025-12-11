
import React, { useMemo, useCallback } from 'react';
import { InventorySlot, Item } from '../../types';
import { SHOPS, ITEMS, getIconClassName } from '../../constants';
import Button from '../common/Button';
// FIX: ContextMenuOption is not exported from useUIState. It should be imported directly from its source file.
import { ContextMenuState, MakeXPrompt, TooltipState } from '../../hooks/useUIState';
import { ContextMenuOption } from '../common/ContextMenu';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
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

interface AgilityShopSlotProps {
    slot: InventorySlot;
    price: number;
    stock: number;
    shopId: string;
    voucherCount: number;
    onBuy: (itemId: string, quantity: number) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    isOneClickMode: boolean;
    addLog: (message: string) => void;
}

const AgilityShopSlot: React.FC<AgilityShopSlotProps> = ({ slot, price, stock, shopId, voucherCount, onBuy, setContextMenu, setMakeXPrompt, setTooltip, isOneClickMode, addLog }) => {
    const item = ITEMS[slot.itemId];
    const isTouchDevice = useIsTouchDevice(false);
    if (!item) return <div className="w-full aspect-square bg-gray-900 border border-gray-700 rounded-md" />;

    const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        
        let eventForMenu: React.MouseEvent | React.Touch;
        if ('touches' in e && e.touches.length > 0) eventForMenu = e.touches[0];
        else if ('changedTouches' in e && e.changedTouches.length > 0) eventForMenu = e.changedTouches[0];
        else eventForMenu = e as React.MouseEvent;

        const maxBuyableByVouchers = price > 0 ? Math.floor(voucherCount / price) : Infinity;
        const maxBuyable = Math.min(maxBuyableByVouchers, stock);

        const performBuyAction = (quantity: number) => { onBuy(slot.itemId, quantity); setContextMenu(null); };

        const options: ContextMenuOption[] = [
            { label: `Buy 1 (${price})`, onClick: () => performBuyAction(1), disabled: maxBuyable < 1 },
            { label: 'Buy X...', onClick: () => { setContextMenu(null); setMakeXPrompt({ title: `Buy ${item.name}`, max: maxBuyable, onConfirm: (quantity) => performBuyAction(quantity) }); }, disabled: maxBuyable < 1 },
        ];
        setContextMenu({ options, triggerEvent: eventForMenu, isTouchInteraction: 'touches' in e || 'changedTouches' in e, title: getDisplayName(slot) });
    };

    const handleSingleTap = () => addLog(`[${getDisplayName(slot)}] Price: ${price} Agility Vouchers.`);
    const combinedHandlers = useLongPress({ onLongPress: handleContextMenu, onClick: handleSingleTap, isOneClickMode });
    const handleMouseEnter = (e: React.MouseEvent) => {
        const priceInfo = (
            <>
                <p className="text-sm mt-2">Price: <span className="font-semibold">{price} Vouchers</span></p>
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
            {stock > 0 && <span className={`absolute bottom-0 right-1 text-xs font-bold ${getQuantityColor(stock)}`} style={{ textShadow: '1px 1px 1px black' }}>{formatItemQuantity(stock)}</span>}
        </div>
    );
};

interface AgilityShopViewProps {
    shopId: string;
    inventory: (InventorySlot | null)[];
    onExit: () => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    addLog: (message: string) => void;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean }) => void;
    isOneClickMode: boolean;
}

const AgilityShopView: React.FC<AgilityShopViewProps> = (props) => {
    const { shopId, inventory, onExit, setContextMenu, setMakeXPrompt, setTooltip, addLog, modifyItem, isOneClickMode } = props;
    const shop = SHOPS[shopId];

    const voucherCount = useMemo(() => inventory.find(slot => slot?.itemId === 'agility_voucher')?.quantity ?? 0, [inventory]);

    const handleBuy = useCallback((itemId: string, quantity: number) => {
        const itemData = ITEMS[itemId];
        const shopItem = shop.inventory.find(i => i.itemId === itemId);
        if (!itemData || !shopItem) return;

        const price = shopItem.priceModifier;
        const totalCost = price * quantity;
        
        if (voucherCount < totalCost) {
            addLog("You don't have enough Agility Vouchers.");
            return;
        }

        let freeSlots = 0;
        let stackExists = false;
        for (const slot of inventory) {
            if (slot === null) freeSlots++;
            else if (slot.itemId === itemId) stackExists = true;
        }
        
        if (freeSlots < 1 && !itemData.stackable && !stackExists) {
            addLog("Your inventory is full.");
            return;
        }

        let quantityToGive = quantity;
        if (itemId === 'agility_paste') {
            quantityToGive = quantity * 15;
        }

        modifyItem('agility_voucher', -totalCost, true);
        modifyItem(itemId, quantityToGive, false, { bypassAutoBank: true });
        addLog(`You bought ${quantity}x ${itemData.name} for ${totalCost} Agility Vouchers.`);
    }, [voucherCount, inventory, modifyItem, addLog, shop.inventory]);
    
    if (!shop) return <div>Loading shop...</div>;

    return (
        <div className="flex flex-col h-full text-gray-200 animate-fade-in">
            <div className="flex justify-between items-center p-4 border-b-2 border-gray-600 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-yellow-400">{shop.name}</h1>
                    <p className="text-yellow-200">Your Vouchers: {voucherCount.toLocaleString()}</p>
                </div>
                <Button onClick={onExit}>Exit</Button>
            </div>
            
            <div className="flex-grow min-h-0 p-4">
                <div className="bg-black/40 p-2 rounded-lg border border-gray-600 flex flex-col h-full">
                    <h2 className="text-xl font-semibold mb-2 text-center text-yellow-300">Shop's Wares</h2>
                    <div className="flex-grow overflow-y-auto pr-1 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 content-start">
                        {shop.inventory.map(({ itemId, priceModifier, quantity }) => {
                            const item = ITEMS[itemId];
                            if (!item) return null;
                            
                            return (
                                <AgilityShopSlot
                                    key={itemId}
                                    slot={{ itemId, quantity: 1 }}
                                    price={priceModifier}
                                    stock={quantity} // Use quantity from shop definition
                                    setTooltip={setTooltip}
                                    isOneClickMode={isOneClickMode}
                                    addLog={addLog}
                                    shopId={shopId}
                                    voucherCount={voucherCount}
                                    onBuy={handleBuy}
                                    setContextMenu={setContextMenu}
                                    setMakeXPrompt={setMakeXPrompt}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgilityShopView;