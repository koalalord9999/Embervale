import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TooltipState } from '../../hooks/useUIState';
import { getDisplayName } from '../panels/InventorySlot';
import { Item } from '../../types';

interface TooltipProps {
    tooltipState: TooltipState;
    isCtrlPressed: boolean;
}

const StatRow: React.FC<{ label: string; value: number }> = ({ label, value }) => {
    const color = value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400';
    const displayValue = value > 0 ? `+${value}` : value;
    return (
        <div className="flex justify-between">
            <span>{label}:</span>
            <span className={`font-semibold ${color}`}>{displayValue}</span>
        </div>
    );
};

const renderStats = (item: Item) => {
    const { equipment } = item;
    // An item is considered equippable and should show a stat block if it has an equipment property.
    if (!equipment) return null;

    const hasRequirements = equipment.requiredLevels && equipment.requiredLevels.length > 0;

    return (
        <div className="mt-2 pt-2 border-t border-gray-500 text-xs">
            <div className="grid grid-cols-2 gap-x-4">
                <div>
                    <p className="font-bold text-yellow-400 mb-1">Attack</p>
                    <StatRow label="Stab" value={equipment.stabAttack ?? 0} />
                    <StatRow label="Slash" value={equipment.slashAttack ?? 0} />
                    <StatRow label="Crush" value={equipment.crushAttack ?? 0} />
                    <StatRow label="Ranged" value={equipment.rangedAttack ?? 0} />
                    <StatRow label="Magic" value={equipment.magicAttack ?? 0} />
                </div>
                <div>
                    <p className="font-bold text-yellow-400 mb-1">Defence</p>
                    <StatRow label="Stab" value={equipment.stabDefence ?? 0} />
                    <StatRow label="Slash" value={equipment.slashDefence ?? 0} />
                    <StatRow label="Crush" value={equipment.crushDefence ?? 0} />
                    <StatRow label="Ranged" value={equipment.rangedDefence ?? 0} />
                    <StatRow label="Magic" value={equipment.magicDefence ?? 0} />
                </div>
                <div className="col-span-2 mt-1 pt-1 border-t border-gray-700" />
                <div className="col-span-2">
                    <p className="font-bold text-yellow-400 mb-1">Other</p>
                    <StatRow label="Strength" value={equipment.strengthBonus ?? 0} />
                    <StatRow label="Ranged Str" value={equipment.rangedStrength ?? 0} />
                    {(() => {
                        const value = equipment.magicDamageBonus ?? 0;
                        const color = value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400';
                        const displayValue = value > 0 ? `+${value}%` : `${value}%`;
                        return (
                            <div className="flex justify-between">
                                <span>Magic Dmg:</span>
                                <span className={`font-semibold ${color}`}>{displayValue}</span>
                            </div>
                        );
                    })()}
                </div>
                 {hasRequirements && (
                    <div className="col-span-2 mt-1 pt-1 border-t border-gray-700">
                        <p className="font-bold text-yellow-400 mb-1">Requirements</p>
                        {equipment.requiredLevels?.map(req => (
                            <div key={req.skill} className="flex justify-between">
                                <span>{req.skill}:</span>
                                <span className="font-semibold">{req.level}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const Tooltip: React.FC<TooltipProps> = ({ tooltipState, isCtrlPressed }) => {
    const { position, item, slot, content } = tooltipState;
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({
        transform: `translate(${position.x + 15}px, ${position.y + 15}px)`,
        opacity: 0,
    });

    const tooltipContent = useMemo(() => {
        if (item && slot) {
            return (
                <div>
                    <p className="font-bold text-yellow-300">{getDisplayName(slot)}</p>
                    {isCtrlPressed && renderStats(item)}
                    {content} 
                </div>
            );
        }
        return content;
    }, [item, slot, content, isCtrlPressed]);

    useEffect(() => {
        if (tooltipRef.current) {
            const tooltipWidth = tooltipRef.current.offsetWidth;
            const tooltipHeight = tooltipRef.current.offsetHeight;
            const gameContainer = document.querySelector('.game-container');
            let x = position.x + 15;
            let y = position.y + 15;

            if (gameContainer) {
                const gameRect = gameContainer.getBoundingClientRect();
                if (x + tooltipWidth > gameRect.right) x = position.x - 15 - tooltipWidth;
                if (x < gameRect.left) x = gameRect.left;
                if (y + tooltipHeight > gameRect.bottom) y = position.y - 15 - tooltipHeight;
            }
            
            setStyle({
                transform: `translate(${x}px, ${y}px)`,
                opacity: 1,
                transition: 'opacity 0.1s ease-in',
            });
        }
    }, [tooltipContent, position]);

    if (!tooltipContent) return null;

    return (
        <div
            ref={tooltipRef}
            className="fixed top-0 left-0 bg-black/80 border border-gray-500 text-white text-sm rounded-md shadow-lg p-2 max-w-xs pointer-events-none z-50"
            style={style}
        >
            {tooltipContent}
        </div>
    );
};

export default Tooltip;