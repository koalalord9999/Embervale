

import React from 'react';
import { Equipment, InventorySlot } from '../types';
import { ITEMS, getIconClassName } from '../constants';
import { TooltipState } from '../hooks/useUIState';
import { useUIState } from '../hooks/useUIState';

interface EquipmentPanelProps {
    equipment: Equipment;
    onUnequip: (slot: keyof Equipment) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    ui: ReturnType<typeof useUIState>;
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

const EquipmentSlotDisplay: React.FC<{
    slotKey: keyof Equipment;
    itemSlot: InventorySlot | null;
    onUnequip: (slot: keyof Equipment) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
}> = ({ slotKey, itemSlot, onUnequip, setTooltip }) => {
    const item = itemSlot ? ITEMS[itemSlot.itemId] : null;

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (!item?.equipment) {
            const slotName = slotKey.charAt(0).toUpperCase() + slotKey.slice(1);
            setTooltip({
                content: <p className="font-bold text-yellow-300">{slotName} Slot</p>,
                position: { x: e.clientX, y: e.clientY }
            });
            return;
        }

        const { equipment } = item;

        const tooltipContent = (
            <div>
                <p className="font-bold text-yellow-300">{item.name}</p>
                <p className="text-sm text-gray-300">{item.description}</p>
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
                 {item.equipment?.requiredLevels && (
                    <div className="mt-2 pt-2 border-t border-gray-600 text-xs space-y-0.5">
                        <p className="font-semibold">Requirements:</p>
                        {item.equipment.requiredLevels.map(req => (
                            <p key={req.skill} className="text-gray-400">
                                {req.level} {req.skill}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        );
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };

    const handleUnequip = () => {
        if (item) {
            onUnequip(slotKey);
            setTooltip(null);
        }
    };

    return (
        <div
            className="w-full aspect-square bg-gray-900 border-2 border-gray-600 rounded-md flex items-center justify-center p-1 relative transition-colors cursor-pointer hover:border-yellow-400"
            onClick={handleUnequip}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            {item ? (
                <>
                    <img src={item.iconUrl} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
                    {item.stackable && itemSlot && itemSlot.quantity > 0 && (
                        <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                            {itemSlot.quantity.toLocaleString()}
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

const EquipmentPanel: React.FC<EquipmentPanelProps> = ({ equipment, onUnequip, setTooltip, ui }) => {
    return (
        <div className="flex flex-col h-full text-gray-300">
            <h3 className="text-lg font-bold text-center mb-3 text-yellow-400">Equipment</h3>
            
            <div className="flex-grow flex flex-col justify-center items-center">
                <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
                    <EmptySlot />
                    <EquipmentSlotDisplay slotKey="head" itemSlot={equipment.head} onUnequip={onUnequip} setTooltip={setTooltip} />
                    <EmptySlot />

                    <EquipmentSlotDisplay slotKey="cape" itemSlot={equipment.cape} onUnequip={onUnequip} setTooltip={setTooltip} />
                    <EquipmentSlotDisplay slotKey="necklace" itemSlot={equipment.necklace} onUnequip={onUnequip} setTooltip={setTooltip} />
                    <EquipmentSlotDisplay slotKey="ammo" itemSlot={equipment.ammo} onUnequip={onUnequip} setTooltip={setTooltip} />

                    <EquipmentSlotDisplay slotKey="weapon" itemSlot={equipment.weapon} onUnequip={onUnequip} setTooltip={setTooltip} />
                    <EquipmentSlotDisplay slotKey="body" itemSlot={equipment.body} onUnequip={onUnequip} setTooltip={setTooltip} />
                    <EquipmentSlotDisplay slotKey="shield" itemSlot={equipment.shield} onUnequip={onUnequip} setTooltip={setTooltip} />

                    <EmptySlot />
                    <EquipmentSlotDisplay slotKey="legs" itemSlot={equipment.legs} onUnequip={onUnequip} setTooltip={setTooltip} />
                    <EmptySlot />

                    <EquipmentSlotDisplay slotKey="gloves" itemSlot={equipment.gloves} onUnequip={onUnequip} setTooltip={setTooltip} />
                    <EquipmentSlotDisplay slotKey="boots" itemSlot={equipment.boots} onUnequip={onUnequip} setTooltip={setTooltip} />
                    <EquipmentSlotDisplay slotKey="ring" itemSlot={equipment.ring} onUnequip={onUnequip} setTooltip={setTooltip} />
                </div>
            </div>
            
            <div className="mt-4 p-2 bg-gray-900 rounded-md border border-gray-600 flex justify-around gap-2">
                <button onClick={() => ui.setIsEquipmentStatsOpen(true)} className="flex-1 text-center py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded border border-gray-500 transition-colors">
                    Equipment Stats
                </button>
                 <button onClick={() => ui.setIsItemsOnDeathOpen(true)} className="flex-1 text-center py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded border border-gray-500 transition-colors">
                    Items Kept on Death
                </button>
                <button onClick={() => ui.setIsPriceCheckerOpen(true)} className="flex-1 text-center py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded border border-gray-500 transition-colors">
                    Price Checker
                </button>
            </div>
        </div>
    );
};

export default EquipmentPanel;