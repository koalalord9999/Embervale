
import React, { useMemo } from 'react';
import { Equipment, WeaponType } from '../../../types';
import { ITEMS } from '../../../constants';
import Button from '../../common/Button';

interface EquipmentStatsViewProps {
    equipment: Equipment;
    onClose: () => void;
}

const StatRow: React.FC<{ label: string; value: number | string; }> = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold">{value}</span>
    </div>
);

const EquipmentStatsView: React.FC<EquipmentStatsViewProps> = ({ equipment, onClose }) => {
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
                    totals.stabAttack += eq.stabAttack;
                    totals.slashAttack += eq.slashAttack;
                    totals.crushAttack += eq.crushAttack;
                    totals.magicAttack += eq.magicAttack;
                    totals.rangedAttack += eq.rangedAttack;
                    totals.stabDefence += eq.stabDefence;
                    totals.slashDefence += eq.slashDefence;
                    totals.crushDefence += eq.crushDefence;
                    totals.magicDefence += eq.magicDefence;
                    totals.rangedDefence += eq.rangedDefence;
                    totals.strengthBonus += eq.strengthBonus;
                    totals.rangedStrength += eq.rangedStrength;
                    totals.magicDamageBonus += eq.magicDamageBonus;
                    if (slot === 'weapon' && eq.speed) {
                        totals.speed = eq.speed;
                    }
                }
            }
        }
        return totals;
    }, [equipment]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b-2 border-gray-600">
                    <h1 className="text-2xl font-bold text-yellow-400">Equipment Stats</h1>
                    <Button onClick={onClose} size="sm">Close</Button>
                </div>
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-x-8 text-sm">
                        {/* Attack Bonuses */}
                        <div className="space-y-1">
                            <h3 className="font-bold text-yellow-300 border-b border-gray-600 mb-2 pb-1">Attack Bonuses</h3>
                            <StatRow label="Stab" value={totalStats.stabAttack} />
                            <StatRow label="Slash" value={totalStats.slashAttack} />
                            <StatRow label="Crush" value={totalStats.crushAttack} />
                            <StatRow label="Ranged" value={totalStats.rangedAttack} />
                            <StatRow label="Magic" value={totalStats.magicAttack} />
                        </div>
                        {/* Defence Bonuses */}
                        <div className="space-y-1">
                            <h3 className="font-bold text-yellow-300 border-b border-gray-600 mb-2 pb-1">Defence Bonuses</h3>
                            <StatRow label="Stab" value={totalStats.stabDefence} />
                            <StatRow label="Slash" value={totalStats.slashDefence} />
                            <StatRow label="Crush" value={totalStats.crushDefence} />
                            <StatRow label="Ranged" value={totalStats.rangedDefence} />
                            <StatRow label="Magic" value={totalStats.magicDefence} />
                        </div>
                    </div>
                     {/* Other Bonuses */}
                    <div className="space-y-1 text-sm pt-2 border-t border-gray-600">
                         <h3 className="font-bold text-yellow-300 border-b border-gray-600 mb-2 pb-1">Other Bonuses</h3>
                         <StatRow label="Strength Bonus" value={totalStats.strengthBonus} />
                         <StatRow label="Ranged Strength" value={totalStats.rangedStrength} />
                         <StatRow label="Magic Damage" value={`${totalStats.magicDamageBonus}%`} />
                         <StatRow label="Attack Speed" value={`${(totalStats.speed * 0.6).toFixed(1)}s`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentStatsView;
