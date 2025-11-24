
import React, { useState, useEffect, useMemo } from 'react';
import { ActiveStatModifier, ActiveBuff, SkillName } from '../../types';
import { SKILL_ICONS, getSkillColorClass } from '../../constants';

interface BuffBarProps {
    statModifiers: ActiveStatModifier[];
    activeBuffs: ActiveBuff[];
}

interface DisplayBuff {
    id: number;
    iconUrl: string;
    value: string;
    valueColor?: string;
    expiresAt: number; // Can be Infinity for non-expiring buffs
    iconClassName?: string;
    colorClass?: string;
}

const BuffIcon: React.FC<{ buff: DisplayBuff }> = ({ buff }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (buff.expiresAt === Infinity) {
            setTimeLeft(Infinity);
            return;
        }

        const calculateTime = () => {
            const remaining = Math.max(0, Math.ceil((buff.expiresAt - Date.now()) / 1000));
            setTimeLeft(remaining);
        };
        
        calculateTime(); // Initial calculation
        const timer = setInterval(calculateTime, 1000);
        
        return () => clearInterval(timer);
    }, [buff.expiresAt]);

    const defaultValueColor = useMemo(() => {
        const numValue = parseFloat(buff.value);
        if (!isNaN(numValue)) {
            return numValue > 0 ? 'text-green-400' : 'text-red-400';
        }
        return 'text-white';
    }, [buff.value]);

    const valueColor = buff.valueColor || defaultValueColor;

    return (
        <div className="relative w-12 h-12 bg-gray-800 border-2 border-gray-600 rounded-md flex items-center justify-center p-1 shadow-lg">
            {buff.colorClass ? (
                <div
                    className={`w-full h-full ${buff.colorClass}`}
                    style={{
                        maskImage: `url(${buff.iconUrl})`,
                        maskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskImage: `url(${buff.iconUrl})`,
                        WebkitMaskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                    }}
                />
            ) : (
                <img 
                    src={buff.iconUrl} 
                    alt="buff icon" 
                    className={`w-full h-full filter invert ${buff.iconClassName || 'opacity-60'}`}
                />
            )}
            <span className={`absolute text-lg font-bold ${valueColor}`} style={{ textShadow: '1px 1px 2px black' }}>
                {buff.value}
            </span>
            {timeLeft !== Infinity && (
                <span className="absolute top-0 right-0 text-xs font-mono font-bold text-white bg-black/60 px-1 rounded-bl-sm">
                    {timeLeft}
                </span>
            )}
        </div>
    );
};


const BuffBar: React.FC<BuffBarProps> = ({ statModifiers, activeBuffs }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const allBuffs = useMemo(() => {
        const buffs: DisplayBuff[] = [];

        // 1. Process statModifiers (potions)
        statModifiers.forEach(mod => {
            buffs.push({
                id: mod.id,
                iconUrl: SKILL_ICONS[mod.skill],
                value: `${mod.currentValue > 0 ? '+' : ''}${mod.currentValue}`,
                valueColor: mod.currentValue > 0 ? 'text-green-400' : 'text-red-400',
                expiresAt: mod.nextDecayTimestamp,
                colorClass: getSkillColorClass(mod.skill),
            });
        });

        // 2. Process activeBuffs (spells, debuffs, etc.)
        activeBuffs.forEach(buff => {
            let expiresAt = Date.now() + buff.durationRemaining;
            
            // Specific logic for Poison
            // Instead of using durationRemaining (which is infinite), we use the next tick time for the countdown
            if (buff.type === 'poison') {
                expiresAt = buff.nextTickTimestamp ?? (Date.now() + 15000);
            }

            switch (buff.type) {
                case 'stat_boost':
                    if (buff.statBoost) {
                        buffs.push({
                            id: buff.id,
                            iconUrl: SKILL_ICONS[buff.statBoost.skill],
                            value: `${buff.statBoost.value > 0 ? '+' : ''}${buff.statBoost.value}`,
                            valueColor: buff.statBoost.value > 0 ? 'text-green-400' : 'text-red-400',
                            expiresAt,
                            colorClass: getSkillColorClass(buff.statBoost.skill),
                        });
                    }
                    break;
                case 'accuracy_boost':
                    buffs.push({
                        id: buff.id,
                        iconUrl: 'https://api.iconify.design/game-icons:crosshair-arrow.svg',
                        value: `+${buff.value}%`,
                        valueColor: 'text-green-400',
                        expiresAt
                    });
                    break;
                case 'evasion_boost':
                    buffs.push({
                        id: buff.id,
                        iconUrl: 'https://api.iconify.design/game-icons:run.svg',
                        value: `+${buff.value}%`,
                        valueColor: 'text-green-400',
                        expiresAt
                    });
                    break;
                case 'recoil':
                    buffs.push({
                        id: buff.id,
                        iconUrl: 'https://api.iconify.design/game-icons:porcupine.svg',
                        value: `${buff.value}%`,
                        valueColor: 'text-orange-400',
                        expiresAt
                    });
                    break;
                case 'flat_damage':
                    buffs.push({
                        id: buff.id,
                        iconUrl: 'https://api.iconify.design/game-icons:sword-brandish.svg',
                        value: `+${buff.value}`,
                        valueColor: 'text-yellow-400',
                        expiresAt
                    });
                    break;
                case 'damage_on_hit': // Sunfire Elixir
                    buffs.push({
                        id: buff.id,
                        iconUrl: 'https://api.iconify.design/game-icons:fire-sword.svg',
                        value: `+${buff.value}`,
                        valueColor: 'text-orange-500',
                        expiresAt
                    });
                    break;
                case 'poison_immunity':
                    buffs.push({
                        id: buff.id,
                        iconUrl: 'https://api.iconify.design/game-icons:health-potion.svg',
                        value: `Immune`,
                        valueColor: 'text-green-300',
                        expiresAt,
                        iconClassName: 'opacity-80'
                    });
                    break;
                case 'damage_reduction':
                    buffs.push({
                        id: buff.id,
                        iconUrl: 'https://api.iconify.design/game-icons:stone-shield.svg',
                        value: `-${buff.value}%`,
                        valueColor: 'text-blue-300',
                        expiresAt
                    });
                    break;
                case 'antifire':
                    buffs.push({
                        id: buff.id,
                        iconUrl: 'https://api.iconify.design/game-icons:dragon-shield.svg',
                        value: 'Fire',
                        valueColor: 'text-orange-400',
                        expiresAt,
                        iconClassName: 'opacity-80'
                    });
                    break;
                case 'stun':
                    buffs.push({
                        id: buff.id,
                        iconUrl: 'https://api.iconify.design/game-icons:star-swirl.svg',
                        value: 'Stun',
                        valueColor: 'text-yellow-300',
                        expiresAt
                    });
                    break;
                case 'poison':
                     buffs.push({
                        id: buff.id,
                        iconUrl: 'https://api.iconify.design/game-icons:boiling-bubbles.svg',
                        value: `${buff.value}`,
                        valueColor: 'text-green-500',
                        expiresAt,
                        iconClassName: 'opacity-80',
                        colorClass: 'bg-green-700'
                    });
                    break;
                case 'dehydration' as any: // Cast as any to handle custom type from Game.tsx
                    buffs.push({
                        id: buff.id,
                        iconUrl: 'https://api.iconify.design/game-icons:sunrise.svg',
                        value: `+${buff.value}`,
                        valueColor: 'text-orange-400',
                        expiresAt: Infinity,
                        iconClassName: 'opacity-80'
                    });
                    break;
                case 'magic_damage_boost' as any:
                    buffs.push({
                        id: buff.id,
                        iconUrl: 'https://api.iconify.design/game-icons:magic-swirl.svg',
                        value: `+${buff.value}%`,
                        valueColor: 'text-purple-400',
                        expiresAt,
                        colorClass: 'bg-purple-900/50'
                    });
                    break;
            }
        });

        return buffs.sort((a, b) => b.expiresAt - a.expiresAt);
    }, [statModifiers, activeBuffs]);

    const showExpandButton = allBuffs.length > 4 && !isExpanded;
    const containerHeight = isExpanded ? 'max-h-80' : 'max-h-[224px]'; // 4 * (h-12 + gap-1) = 224px

    if (allBuffs.length === 0) {
        return null;
    }

    return (
        <div 
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1"
            onMouseEnter={() => { if(allBuffs.length > 4) setIsExpanded(true) }}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div 
                className={`flex flex-col gap-1 transition-all duration-300 overflow-y-auto overflow-x-hidden ${containerHeight}`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {allBuffs.map(buff => <BuffIcon key={buff.id} buff={buff} />)}
            </div>
            {showExpandButton && (
                <div className="w-12 h-4 bg-gray-700 rounded-b-md flex items-center justify-center text-xs font-bold text-gray-300 cursor-pointer">
                    ...
                </div>
            )}
        </div>
    );
};

export default BuffBar;