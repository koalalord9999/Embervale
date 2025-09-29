
import React, { useMemo } from 'react';
import { Equipment, InventorySlot, Item } from '../../../types';
import { ITEMS, getIconClassName } from '../../../constants';
import Button from '../../common/Button';
import { useUIState, TooltipState, ContextMenuState } from '../../../hooks/useUIState';
import { ContextMenuOption } from '../../common/ContextMenu';
import { useLongPress } from '../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../hooks/useIsTouchDevice';

interface EquipmentStatsViewProps {
    equipment: Equipment;
    onClose: () => void;
    onUnequip: (slot: keyof Equipment) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    ui: ReturnType<typeof useUIState>;
    addLog: (message: string) => void;
    onExamine: (item: Item) => void;
    isTouchSimulationEnabled: boolean;
}

const StatRow: React.FC<{ label: string; value: number | string; }> = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold">{value}</span>
    </div>
);

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

const EmptySlot = () => <div className="w-full aspect-square" />;

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

    const handleUnequip = () => { if (item) { onUnequip(slotKey); setTooltip(null); } };
    
    const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
        if (!item || !itemSlot) return;
        e.preventDefault();
        const event = 'touches' in e ? e.touches[0] : e;
        
        const options: ContextMenuOption[] = [];
        const performAction = (action: () => void) => { action(); setTooltip(null); setContextMenu(null); };
        
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

    const longPressHandlers = useLongPress({ onLongPress: handleContextMenu, onClick: handleUnequip });

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

const EquipmentStatsView: React.FC<EquipmentStatsViewProps> = (props) => {
    const { equipment, onClose, onUnequip, setTooltip, ui, addLog, onExamine, isTouchSimulationEnabled } = props;

    const totalStats = useMemo(() => {
        const totals = {
            stabAttack: 0, slashAttack: 0, crushAttack: 0, magicAttack: 0, rangedAttack: 0,
            stabDefence: 0, slashDefence: 0, crushDefence: 0, magicDefence: 0, rangedDefence: 0,
            strengthBonus: 0, rangedStrength: 0, magicDamageBonus: 0, speed: 4
        };
        for (const slot in equipment) {
            const itemSlot = equipment[slot as keyof Equipment];
            if (itemSlot) {
                const itemData = ITEMS[itemSlot.itemId];
                if (itemData?.equipment) {
                    const eq = itemData.equipment;
                    totals.stabAttack += eq.stabAttack ?? 0;
                    totals.slashAttack += eq.slashAttack ?? 0;
                    totals.crushAttack += eq.crushAttack ?? 0;
                    totals.magicAttack += eq.magicAttack ?? 0;
                    totals.rangedAttack += eq.rangedAttack ?? 0;
                    totals.stabDefence += eq.stabDefence ?? 0;
                    totals.slashDefence += eq.slashDefence ?? 0;
                    totals.crushDefence += eq.crushDefence ?? 0;
                    totals.magicDefence += eq.magicDefence ?? 0;
                    totals.rangedDefence += eq.rangedDefence ?? 0;
                    totals.strengthBonus += eq.strengthBonus ?? 0;
                    totals.rangedStrength += eq.rangedStrength ?? 0;
                    totals.magicDamageBonus += eq.magicDamageBonus ?? 0;
                    if (slot === 'weapon' && eq.speed) {
                        totals.speed = eq.speed;
                    }
                }
            }
        }
        return totals;
    }, [equipment]);

    const equipmentSlotDisplayProps = {
        onUnequip,
        setTooltip,
        setContextMenu: ui.setContextMenu,
        addLog,
        onExamine,
        isTouchSimulationEnabled,
    };

    return (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-4xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b-2 border-gray-600">
                    <h1 className="text-2xl font-bold text-yellow-400">Worn Equipment</h1>
                    <Button onClick={onClose} size="sm">Close</Button>
                </div>
                <div className="flex flex-col md:flex-row p-4 gap-4">
                    {/* Left: Stats Panel */}
                    <div className="w-full md:w-1/2 bg-black/40 p-3 rounded-lg border border-gray-600">
                        <h2 className="text-xl font-bold text-yellow-400 text-center mb-2">Equipment Stats</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-x-8 text-sm">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-yellow-300 border-b border-gray-600 mb-2 pb-1">Attack Bonuses</h3>
                                    <StatRow label="Stab" value={totalStats.stabAttack} />
                                    <StatRow label="Slash" value={totalStats.slashAttack} />
                                    <StatRow label="Crush" value={totalStats.crushAttack} />
                                    <StatRow label="Ranged" value={totalStats.rangedAttack} />
                                    <StatRow label="Magic" value={totalStats.magicAttack} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-yellow-300 border-b border-gray-600 mb-2 pb-1">Defence Bonuses</h3>
                                    <StatRow label="Stab" value={totalStats.stabDefence} />
                                    <StatRow label="Slash" value={totalStats.slashDefence} />
                                    <StatRow label="Crush" value={totalStats.crushDefence} />
                                    <StatRow label="Ranged" value={totalStats.rangedDefence} />
                                    <StatRow label="Magic" value={totalStats.magicDefence} />
                                </div>
                            </div>
                            <div className="space-y-1 text-sm pt-2 border-t border-gray-600">
                                <h3 className="font-bold text-yellow-300 border-b border-gray-600 mb-2 pb-1">Other Bonuses</h3>
                                <StatRow label="Strength Bonus" value={totalStats.strengthBonus} />
                                <StatRow label="Ranged Strength" value={totalStats.rangedStrength} />
                                <StatRow label="Magic Damage" value={`${totalStats.magicDamageBonus}%`} />
                                <StatRow label="Attack Speed" value={`${(totalStats.speed * 0.6).toFixed(1)}s`} />
                            </div>
                        </div>
                    </div>
                    {/* Right: Equipment Grid */}
                    <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-black/40 p-3 rounded-lg border border-gray-600">
                         <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
                            <EmptySlot />
                            <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="head" itemSlot={equipment.head} />
                            <EmptySlot />

                            <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="cape" itemSlot={equipment.cape} />
                            <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="necklace" itemSlot={equipment.necklace} />
                            <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="ammo" itemSlot={equipment.ammo} />

                            <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="weapon" itemSlot={equipment.weapon} />
                            <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="body" itemSlot={equipment.body} />
                            <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="shield" itemSlot={equipment.shield} />

                            <EmptySlot />
                            <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="legs" itemSlot={equipment.legs} />
                            <EmptySlot />

                            <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="gloves" itemSlot={equipment.gloves} />
                            <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="boots" itemSlot={equipment.boots} />
                            <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="ring" itemSlot={equipment.ring} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentStatsView;
