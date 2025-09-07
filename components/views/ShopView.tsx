
import React from 'react';
import { InventorySlot, ShopStates } from '../../types';
import { SHOPS, ITEMS, INVENTORY_CAPACITY, getIconClassName } from '../../constants';
import Button from '../common/Button';
import { ContextMenuOption } from '../common/ContextMenu';
import { MakeXPrompt } from '../../hooks/useUIState';
import { TooltipState } from '../../hooks/useUIState';

interface ShopViewProps {
    shopId: string;
    playerInventory: InventorySlot[];
    playerCoins: number;
    shopStates: ShopStates;
    onBuy: (shopId: string, itemId: string, quantity: number) => void;
    onSell: (itemId: string, quantity: number | 'all') => void;
    addLog: (message: string) => void;
    onExit: () => void;
    setContextMenu: (menu: { options: ContextMenuOption[]; position: { x: number; y: number; } } | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
}

const ShopSlot: React.FC<{
    slot: InventorySlot | null;
    price: number;
    type: 'buy' | 'sell';
    stock?: number;
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
}> = ({ slot, price, type, stock, onClick, onContextMenu, setTooltip }) => {
    if (!slot) {
        return <div className="w-full aspect-square bg-gray-900 border border-gray-700 rounded-md" />;
    }

    const item = ITEMS[slot.itemId];

    const handleMouseEnter = (e: React.MouseEvent) => {
        const { equipment } = item;
        const tooltipContent = (
            <div>
                <p className="font-bold text-yellow-300">{item.name}</p>
                <p className="text-sm text-gray-300">{item.description}</p>
                 <p className="text-sm mt-2">{type === 'buy' ? 'Buy Price' : 'Sell Price'}: <span className="font-semibold">{price} coins</span></p>
                {equipment && (
                    <div className="mt-2 pt-2 border-t border-gray-600 text-xs grid grid-cols-2 gap-x-4">
                        <span>Stab Atk:</span><span className="font-semibold text-right">{equipment.stabAttack}</span>
                        <span>Slash Atk:</span><span className="font-semibold text-right">{equipment.slashAttack}</span>
                        <span>Crush Atk:</span><span className="font-semibold text-right">{equipment.crushAttack}</span>
                        <span>Ranged Atk:</span><span className="font-semibold text-right">{equipment.rangedAttack}</span>
                        <span>Magic Atk:</span><span className="font-semibold text-right">{equipment.magicAttack}</span>
                        
                        <span>Stab Def:</span><span className="font-semibold text-right">{equipment.stabDefence}</span>
                        <span>Slash Def:</span><span className="font-semibold text-right">{equipment.slashDefence}</span>
                        <span>Crush Def:</span><span className="font-semibold text-right">{equipment.crushDefence}</span>
                        <span>Ranged Def:</span><span className="font-semibold text-right">{equipment.rangedDefence}</span>
                        <span>Magic Def:</span><span className="font-semibold text-right">{equipment.magicDefence}</span>

                        <span>Strength:</span><span className="font-semibold text-right">{equipment.strengthBonus}</span>
                        <span>Ranged Str:</span><span className="font-semibold text-right">{equipment.rangedStrength}</span>
                    </div>
                )}
            </div>
        );
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <div
            className="w-full aspect-square bg-gray-800 border-2 border-gray-600 rounded-md flex items-center justify-center p-1 relative transition-colors cursor-pointer hover:border-yellow-400"
            onClick={onClick}
            onContextMenu={onContextMenu}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
            {(item.stackable || type === 'buy') && stock !== undefined && (
                <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                    {stock > 9999 ? '∞' : stock}
                </span>
            )}
             {!item.stackable && type === 'sell' && slot.quantity > 1 && (
                <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                    {slot.quantity > 1000 ? `${Math.floor(slot.quantity / 1000)}k` : slot.quantity}
                </span>
             )}
        </div>
    );
};


const ShopView: React.FC<ShopViewProps> = ({ shopId, playerInventory, playerCoins, shopStates, onBuy, onSell, addLog, onExit, setContextMenu, setMakeXPrompt, setTooltip }) => {
    const shop = SHOPS[shopId];
    const currentShopState = shopStates[shopId];

    const inventoryGrid: (InventorySlot | null)[] = new Array(INVENTORY_CAPACITY).fill(null);
    playerInventory.forEach((item, index) => {
        if (index < INVENTORY_CAPACITY) inventoryGrid[index] = item;
    });

    const createBuyContextMenu = (e: React.MouseEvent, itemId: string) => {
        e.preventDefault();
        
        const itemState = currentShopState?.[itemId];
        const itemData = ITEMS[itemId];
        const defaultShopItem = shop?.inventory.find(i => i.itemId === itemId);

        if (!itemState || !itemData || !defaultShopItem) return;

        const price = Math.ceil(itemData.value * defaultShopItem.priceModifier);
        const maxBuyableByCoins = price > 0 ? Math.floor(playerCoins / price) : Infinity;
        const maxBuyable = Math.min(maxBuyableByCoins, itemState.currentStock);

        const options: ContextMenuOption[] = [
            { label: `Buy 1 (${price})`, onClick: () => onBuy(shopId, itemId, 1), disabled: maxBuyable < 1 },
            { label: `Buy 5 (${price * 5})`, onClick: () => onBuy(shopId, itemId, 5), disabled: maxBuyable < 5 },
            { label: `Buy 10 (${price * 10})`, onClick: () => onBuy(shopId, itemId, 10), disabled: maxBuyable < 10 },
            { 
                label: 'Buy X...', 
                onClick: () => setMakeXPrompt({
                    title: `Buy ${ITEMS[itemId].name}`,
                    max: maxBuyable,
                    onConfirm: (quantity) => onBuy(shopId, itemId, quantity)
                }), 
                disabled: maxBuyable < 1 
            },
        ];
        setContextMenu({ options, position: { x: e.clientX, y: e.clientY } });
    };

    const createSellContextMenu = (e: React.MouseEvent, slot: InventorySlot) => {
        e.preventDefault();
        const item = ITEMS[slot.itemId];
        const sellPrice = Math.floor(item.value * 0.2);
        
        let sellableQuantity = 0;
        if (item.stackable) {
            sellableQuantity = slot.quantity;
        } else {
            sellableQuantity = playerInventory.filter(s => s.itemId === slot.itemId).length;
        }

        const performSellAction = (itemId: string, quantity: number | 'all') => {
            onSell(itemId, quantity);
            setTooltip(null);
        };

        const options: ContextMenuOption[] = [
            { label: `Sell 1 (${sellPrice})`, onClick: () => performSellAction(slot.itemId, 1), disabled: sellableQuantity < 1 },
            { label: `Sell 5 (${sellPrice * 5})`, onClick: () => performSellAction(slot.itemId, 5), disabled: sellableQuantity < 5 },
            { label: `Sell 10 (${sellPrice * 10})`, onClick: () => performSellAction(slot.itemId, 10), disabled: sellableQuantity < 10 },
            { 
                label: 'Sell X...', 
                onClick: () => setMakeXPrompt({
                    title: `Sell ${item.name}`,
                    max: sellableQuantity,
                    onConfirm: (quantity) => performSellAction(slot.itemId, quantity)
                }), 
                disabled: sellableQuantity < 1 
            },
            { label: 'Sell All', onClick: () => performSellAction(slot.itemId, 'all'), disabled: sellableQuantity < 1 }
        ];
        setContextMenu({ options, position: { x: e.clientX, y: e.clientY } });
    };

    if (!shop || !currentShopState) return <div>Loading shop...</div>;

    return (
        <div className="flex flex-col h-full animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-yellow-400">{shop.name}</h1>
                <Button onClick={onExit}>Exit Shop</Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 flex-grow min-h-0">
                {/* Shop Inventory */}
                <div className="bg-black/40 p-2 rounded-lg border border-gray-600 flex flex-col">
                    <h2 className="text-xl font-semibold mb-2 text-center text-yellow-300">Shop's Wares</h2>
                    <div className="flex-grow overflow-y-auto pr-1 grid grid-cols-5 gap-2 content-start">
                        {shop.inventory.map(({ itemId, priceModifier }) => {
                            const item = ITEMS[itemId];
                            const itemState = currentShopState[itemId];
                            const buyPrice = Math.ceil(item.value * priceModifier);
                            return (
                                <ShopSlot
                                    key={itemId}
                                    slot={{ itemId, quantity: 1 }}
                                    price={buyPrice}
                                    type="buy"
                                    stock={itemState?.currentStock}
                                    onClick={() => addLog(`[${item.name}] Buy price: ${buyPrice} coins. Stock: ${itemState?.currentStock ?? 0}`)}
                                    onContextMenu={(e) => createBuyContextMenu(e, itemId)}
                                    setTooltip={setTooltip}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Player Inventory */}
                <div className="bg-black/40 p-2 rounded-lg border border-gray-600 flex flex-col">
                     <h2 className="text-xl font-semibold mb-2 text-center text-yellow-300">Your Inventory</h2>
                     <div className="flex-grow overflow-y-auto pr-1 grid grid-cols-5 gap-2 content-start">
                        {inventoryGrid.map((slot, index) => {
                            if (!slot) return <ShopSlot key={index} slot={null} price={0} type="sell" onClick={()=>{}} onContextMenu={()=>{}} setTooltip={setTooltip} />;
                            
                            const item = ITEMS[slot.itemId];
                            const sellPrice = Math.floor(item.value * 0.2);
                            return (
                                 <ShopSlot
                                    key={`${slot.itemId}-${index}`}
                                    slot={slot}
                                    price={sellPrice}
                                    type="sell"
                                    onClick={() => addLog(`[${item.name}] Sell price: ${sellPrice} coins.`)}
                                    onContextMenu={(e) => createSellContextMenu(e, slot)}
                                    setTooltip={setTooltip}
                                />
                            )
                        })}
                    </div>
                     <div className="text-center mt-2 p-2 bg-gray-900 rounded-md border border-gray-600">
                        <p>Your Coins: <span className="font-bold text-yellow-400">{playerCoins.toLocaleString()}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopView;
