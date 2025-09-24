import React from 'react';
import { Equipment, InventorySlot, Item } from '../../types';
import { ITEMS, getIconClassName } from '../../constants';
// Fix: Import ContextMenuOption from its source file instead of re-exporting.
import { ContextMenuState, TooltipState, useUIState } from '../../hooks/useUIState';
import { ContextMenuOption } from '../common/ContextMenu';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

interface EquipmentPanelProps {
    equipment: Equipment;
    inventory: (InventorySlot | null)[];
    onUnequip: (slot: keyof Equipment) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    ui: ReturnType<typeof useUIState>;
    addLog: (message: string) => void;
    onExamine: (item: Item) => void;
    isTouchSimulationEnabled: boolean;
}

const SLOT_PLACEHOLDERS: Record<keyof Equipment, string> = {
    head: 'https://api.iconify.design/game-icons:light-helm.svg',
    cape: 'https://api.iconify.design/game-icons:cloak.svg',
    necklace: 'https://api.iconify.design/game-icons:gem-pendant.svg',
    ammo: 'https://api.iconify.design/game-icons:broadhead-arrow.svg',
    weapon: 'https://api.iconify.design/game-icons:broadsword.svg',
    body: 'https://api.iconify.design/game-icons:leather-vest.svg',
    shield: 'https://api.iconify.design/game-icons:shield.svg',
    legs: 'https://api.iconify.design/game-icons:armored-pants.svg',
    gloves: 'https://api.iconify.design/game-icons:gloves.svg',
    boots: 'https://api.iconify.design/game-icons:leather-boot.svg',
    ring: 'https://api.iconify.design/game-icons:ring.svg',
};

interface EquipmentSlotDisplayProps {
    slotKey: keyof Equipment;
    itemSlot: InventorySlot | null;
    onUnequip: (slot: keyof Equipment) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    addLog: (message: string) => void;
    onExamine: (item: Item) => void;
    isTouchSimulationEnabled: boolean;
}

const EquipmentSlotDisplay: React.FC<EquipmentSlotDisplayProps> = ({ slotKey, itemSlot, onUnequip, setTooltip, setContextMenu, addLog, onExamine, isTouchSimulationEnabled }) => {
    const item = itemSlot ? ITEMS[itemSlot.itemId] : null;
    const isTouchDevice = useIsTouchDevice(isTouchSimulationEnabled);

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (!item || !itemSlot) {
            const slotName = slotKey.charAt(0).toUpperCase() + slotKey.slice(1);
            setTooltip({
                content: <p className="font-bold text-yellow-300">{slotName} Slot</p>,
                position: { x: e.clientX, y: e.clientY }
            });
            return;
        }
        setTooltip({ item, slot: itemSlot, position: { x: e.clientX, y: e.clientY } });
    };

    const handleUnequip = () => {
        if (item) {
            onUnequip(slotKey);
            setTooltip(null);
        }
    };
    
    const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
        if (!item || !itemSlot) return;
        e.preventDefault();
        const event = 'touches' in e ? e.touches[0] : e;
        
        const options: ContextMenuOption[] = [];
        
        const performAction = (action: () => void) => {
            action();
            setTooltip(null);
            setContextMenu(null);
        };
        
        options.push({ label: 'Unequip', onClick: () => performAction(handleUnequip) });
        
        const charges = itemSlot.charges ?? item.charges;
        if (charges !== undefined) {
            options.push({
                label: 'Inspect',
                onClick: () => performAction(() => addLog(`Your ${item.name} has ${charges} charges left.`))
            });
        }
        
        options.push({ label: 'Examine', onClick: () => performAction(() => onExamine(item)) });
        
        setContextMenu({ options, event, isTouchInteraction: isTouchDevice });
    };

    const longPressHandlers = useLongPress({
        onLongPress: handleContextMenu,
        onClick: handleUnequip,
    });

    return (
        <div
            data-tutorial-id={`equipment-slot-${slotKey}`}
            className="w-full aspect-square bg-gray-900 border-2 border-gray-600 rounded-md flex items-center justify-center p-1 relative transition-colors cursor-pointer hover:border-yellow-400"
            {...longPressHandlers}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            {item ? (
                <>
                    <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
                    {item.stackable && itemSlot && itemSlot.quantity > 0 && (
                        <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                            {itemSlot.quantity > 999 ? `${Math.floor(itemSlot.quantity/1000)}k` : itemSlot.quantity.toLocaleString()}
                        </span>
                    )}
                </>
            ) : (
                <img src={SLOT_PLACEHOLDERS[slotKey]} alt={slotKey} className="w-8 h-8 opacity-20 filter invert" />
            )}
        </div>
    );
};

const EmptySlot = () => <div className="w-full aspect-square" />;

const EquipmentPanel: React.FC<EquipmentPanelProps> = ({ equipment, inventory, onUnequip, setTooltip, ui, addLog, onExamine, isTouchSimulationEnabled }) => {
    return (
        <div className="flex flex-col h-full text-gray-300">
            <h3 className="text-lg font-bold text-center mb-3 text-yellow-400">Equipment</h3>
            
            <div className="flex-grow flex flex-col justify-center items-center">
                <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
                    <EmptySlot />
                    <EquipmentSlotDisplay slotKey="head" itemSlot={equipment.head} onUnequip={onUnequip} setTooltip={setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} onExamine={onExamine} isTouchSimulationEnabled={isTouchSimulationEnabled} />
                    <EmptySlot />

                    <EquipmentSlotDisplay slotKey="cape" itemSlot={equipment.cape} onUnequip={onUnequip} setTooltip={setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} onExamine={onExamine} isTouchSimulationEnabled={isTouchSimulationEnabled} />
                    <EquipmentSlotDisplay slotKey="necklace" itemSlot={equipment.necklace} onUnequip={onUnequip} setTooltip={setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} onExamine={onExamine} isTouchSimulationEnabled={isTouchSimulationEnabled} />
                    <EquipmentSlotDisplay slotKey="ammo" itemSlot={equipment.ammo} onUnequip={onUnequip} setTooltip={setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} onExamine={onExamine} isTouchSimulationEnabled={isTouchSimulationEnabled} />

                    <EquipmentSlotDisplay slotKey="weapon" itemSlot={equipment.weapon} onUnequip={onUnequip} setTooltip={setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} onExamine={onExamine} isTouchSimulationEnabled={isTouchSimulationEnabled} />
                    <EquipmentSlotDisplay slotKey="body" itemSlot={equipment.body} onUnequip={onUnequip} setTooltip={setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} onExamine={onExamine} isTouchSimulationEnabled={isTouchSimulationEnabled} />
                    <EquipmentSlotDisplay slotKey="shield" itemSlot={equipment.shield} onUnequip={onUnequip} setTooltip={setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} onExamine={onExamine} isTouchSimulationEnabled={isTouchSimulationEnabled} />

                    <EmptySlot />
                    <EquipmentSlotDisplay slotKey="legs" itemSlot={equipment.legs} onUnequip={onUnequip} setTooltip={setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} onExamine={onExamine} isTouchSimulationEnabled={isTouchSimulationEnabled} />
                    <EmptySlot />

                    <EquipmentSlotDisplay slotKey="gloves" itemSlot={equipment.gloves} onUnequip={onUnequip} setTooltip={setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} onExamine={onExamine} isTouchSimulationEnabled={isTouchSimulationEnabled} />
                    <EquipmentSlotDisplay slotKey="boots" itemSlot={equipment.boots} onUnequip={onUnequip} setTooltip={setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} onExamine={onExamine} isTouchSimulationEnabled={isTouchSimulationEnabled} />
                    <EquipmentSlotDisplay slotKey="ring" itemSlot={equipment.ring} onUnequip={onUnequip} setTooltip={setTooltip} setContextMenu={ui.setContextMenu} addLog={addLog} onExamine={onExamine} isTouchSimulationEnabled={isTouchSimulationEnabled} />
                </div>
            </div>
            
            <div className="mt-4 p-2 bg-gray-900 rounded-md border border-gray-600 flex justify-around gap-2">
                <button onClick={() => ui.setEquipmentStats(equipment)} className="flex-1 text-center py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded border border-gray-500 transition-colors">
                    Equipment Stats
                </button>
                 <button onClick={() => ui.setIsItemsOnDeathOpen(true)} className="flex-1 text-center py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded border border-gray-500 transition-colors">
                    Items Kept on Death
                </button>
                <button onClick={() => ui.setPriceCheckerInventory(inventory)} className="flex-1 text-center py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded border border-gray-500 transition-colors">
                    Price Checker
                </button>
            </div>
        </div>
    );
};

export default EquipmentPanel;