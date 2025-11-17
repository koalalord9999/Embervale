import React from 'react';
import { CombatStance, Equipment, WeaponType } from '../../types';
import { ITEMS } from '../../constants';
import Button from '../common/Button';
import { useUIState } from '../../hooks/useUIState';

interface CombatStylePanelProps {
    combatStance: CombatStance;
    setCombatStance: (stance: CombatStance) => void;
    equipment: Equipment;
    combatLevel: number;
    activeCombatStyleHighlight?: CombatStance | null;
    ui: ReturnType<typeof useUIState>;
}

const CombatStylePanel: React.FC<CombatStylePanelProps> = ({ combatStance, setCombatStance, equipment, combatLevel, activeCombatStyleHighlight, ui }) => {
    const { stanceOptions, stanceLabels } = React.useMemo(() => {
        const weaponSlot = equipment.weapon;
        const itemData = weaponSlot ? ITEMS[weaponSlot.itemId] : null;
        const weaponType = itemData?.equipment?.weaponType ?? WeaponType.Unarmed;

        if (weaponType === WeaponType.Bow || weaponType === WeaponType.Crossbow) {
            return {
                stanceOptions: [CombatStance.RangedAccurate, CombatStance.RangedRapid, CombatStance.RangedDefence],
                stanceLabels: {
                    [CombatStance.RangedAccurate]: 'Accurate',
                    [CombatStance.RangedRapid]: 'Rapid',
                    [CombatStance.RangedDefence]: 'Defence'
                }
            };
        }
        if (weaponType === WeaponType.Staff) {
            return {
                stanceOptions: [CombatStance.Accurate, CombatStance.Aggressive, CombatStance.Defensive, CombatStance.Autocast, CombatStance.DefensiveAutocast],
                stanceLabels: {
                    [CombatStance.Accurate]: 'Accurate',
                    [CombatStance.Aggressive]: 'Aggressive',
                    [CombatStance.Defensive]: 'Defensive',
                    [CombatStance.Autocast]: 'Autocast',
                    [CombatStance.DefensiveAutocast]: 'Defensive Cast'
                }
            };
        }
        // Default to melee/unarmed
        return {
            stanceOptions: [CombatStance.Accurate, CombatStance.Aggressive, CombatStance.Defensive],
            stanceLabels: {
                [CombatStance.Accurate]: 'Accurate',
                [CombatStance.Aggressive]: 'Aggressive',
                [CombatStance.Defensive]: 'Defensive'
            }
        };
    }, [equipment.weapon]);

    const handleStanceChange = (stance: CombatStance) => {
        setCombatStance(stance);
        if (stance === CombatStance.Autocast || stance === CombatStance.DefensiveAutocast) {
            ui.setIsSelectingAutocastSpell(true);
            ui.setActivePanel('spellbook');
        }
    };

    return (
        <div className="flex flex-col h-full text-gray-300">
            <div className="text-center mb-4">
                <p className="text-sm">Combat Level: <span className="font-bold text-yellow-300">{combatLevel}</span></p>
            </div>
            <div className="space-y-2">
                {stanceOptions.map(stance => (
                    <Button
                        key={stance}
                        onClick={() => handleStanceChange(stance)}
                        className={`w-full ${combatStance === stance ? 'ring-2 ring-yellow-400' : ''} ${activeCombatStyleHighlight === stance ? 'tutorial-highlight-target' : ''}`}
                        variant={combatStance === stance ? 'primary' : 'secondary'}
                    >
                        {stanceLabels[stance as keyof typeof stanceLabels]}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default CombatStylePanel;