import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { Monster, Item, WeightedDrop, BaseDrop, MonsterType, SkillName, SpellElement, MonsterSpecialAttack } from '../../../types';
import { MONSTERS, ITEMS, getIconClassName } from '../../../constants';
import { TooltipState } from '../../../hooks/useUIState';
import Button from '../../common/Button';

interface MonsterDBViewProps {
    monsters: Record<string, Monster>;
    setMonsters: React.Dispatch<React.SetStateAction<Record<string, Monster>>>;
    modifiedMonsters: Set<string>;
    setModifiedMonsters: React.Dispatch<React.SetStateAction<Set<string>>>;
    onClose: () => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    onCommit: () => void;
    hasChanges: boolean;
}

const MonsterDBView: React.FC<MonsterDBViewProps> = ({ monsters, setMonsters, modifiedMonsters, setModifiedMonsters, onClose, setTooltip, onCommit, hasChanges }) => {
    const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | MonsterType>('all');
    const [isAnimating, setIsAnimating] = useState(false);
    
    const selectedMonster = selectedMonsterId ? monsters[selectedMonsterId] : null;

    const allMonsters = useMemo(() => Object.values(monsters).sort((a,b) => a.name.localeCompare(b.name)), [monsters]);
    const filteredMonsters = useMemo(() => {
        return allMonsters.filter(m => {
            const searchMatch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.id.toLowerCase().includes(searchTerm.toLowerCase());
            const filterMatch = filter === 'all' || m.types.includes(filter);
            return searchMatch && filterMatch;
        });
    }, [allMonsters, searchTerm, filter]);

    const handleSelectMonster = (id: string) => {
        setIsAnimating(true);
        setSelectedMonsterId(id);
        setTimeout(() => setIsAnimating(false), 500); // Animation duration
    };

    const handleBack = () => {
        setSelectedMonsterId(null);
    };

    const handleAddNewMonster = () => {
        const newId = `new_monster_${Date.now()}`;
        const newMonster: Monster = {
            id: newId,
            name: 'New Monster',
            level: 1,
            maxHp: 10,
            attack: 1,
            stabDefence: 0,
            slashDefence: 0,
            crushDefence: 0,
            rangedDefence: 0,
            magicDefence: 0,
            iconUrl: 'https://api.iconify.design/game-icons:monster-skull.svg',
            types: [MonsterType.Beast],
            attackSpeed: 4,
            respawnTime: 20000,
            attackStyle: 'crush',
            aggressive: false,
            guaranteedDrops: [],
            mainDrops: [],
            tertiaryDrops: [],
        };
    
        setMonsters(prev => ({
            ...prev,
            [newId]: newMonster,
        }));
        setModifiedMonsters(prev => new Set(prev).add(newId));
        handleSelectMonster(newId);
    };

    const updateMonster = (id: string, updates: Partial<Monster>) => {
        setMonsters(prev => ({
            ...prev,
            [id]: { ...prev[id], ...updates }
        }));
        setModifiedMonsters(prev => new Set(prev).add(id));
    };
    
    const updateDrop = (monsterId: string, tableType: 'guaranteedDrops' | 'mainDrops' | 'tertiaryDrops', index: number, updates: Partial<BaseDrop & WeightedDrop>) => {
        const monster = monsters[monsterId];
        if (!monster) return;

        const newTable = [...(monster[tableType] || [])] as any[];
        const oldDrop = newTable[index];
        
        const newUpdates: Partial<BaseDrop & WeightedDrop> = { ...updates };
        if (newUpdates.minQuantity !== undefined) newUpdates.minQuantity = Number(newUpdates.minQuantity);
        if (newUpdates.maxQuantity !== undefined) newUpdates.maxQuantity = Number(newUpdates.maxQuantity);
        if (tableType === 'tertiaryDrops' && newUpdates.chance !== undefined) {
             (newUpdates as any).chance = Number(newUpdates.chance);
        }
        
        newTable[index] = { ...oldDrop, ...newUpdates };
        updateMonster(monsterId, { [tableType]: newTable });
    };

    const handleAddDrop = (monsterId: string, tableType: 'guaranteedDrops' | 'mainDrops' | 'tertiaryDrops') => {
        const monster = monsters[monsterId];
        if (!monster) return;

        const newTable = [...(monster[tableType] as any) || []];
        const newDrop: any = { itemId: '', minQuantity: 1, maxQuantity: 1, noted: false };
        if (tableType !== 'guaranteedDrops') {
            newDrop.chance = tableType === 'mainDrops' ? '1/100' : 0.01;
        }
        newTable.push(newDrop);
        updateMonster(monsterId, { [tableType]: newTable });
    };

    const handleRemoveDrop = (monsterId: string, tableType: 'guaranteedDrops' | 'mainDrops' | 'tertiaryDrops', index: number) => {
        const monster = monsters[monsterId];
        if (!monster) return;
        const newTable = [...(monster[tableType] as any) || []];
        newTable.splice(index, 1);
        updateMonster(monsterId, { [tableType]: newTable });
    };

    const handleAddSpecialAttack = (monsterId: string) => {
        // FIX: Explicitly define the new attack object as a valid MonsterSpecialAttack type.
        const newAttack: MonsterSpecialAttack = { name: 'New Attack', chance: 0.1, effect: 'damage_multiplier', value: 1.5 };
        const currentAttacks = selectedMonster?.specialAttacks || [];
        updateMonster(monsterId, { specialAttacks: [...currentAttacks, newAttack] });
    };

    const handleRemoveSpecialAttack = (monsterId: string, index: number) => {
        const currentAttacks = selectedMonster?.specialAttacks || [];
        const newAttacks = [...currentAttacks];
        newAttacks.splice(index, 1);
        updateMonster(monsterId, { specialAttacks: newAttacks });
    };

    // FIX: This function was creating invalid object shapes, breaking the discriminated union.
    // It now correctly creates a new default object when the `effect` type is changed.
    const handleUpdateSpecialAttack = (monsterId: string, index: number, updates: Partial<MonsterSpecialAttack>) => {
        const currentAttacks = selectedMonster?.specialAttacks || [];
        const newAttacks = [...currentAttacks];
        const oldAttack = newAttacks[index];
    
        if (updates.effect && updates.effect !== oldAttack.effect) {
            let newAttackObject: MonsterSpecialAttack;
            const base = { name: oldAttack.name, chance: oldAttack.chance };
            switch (updates.effect) {
                case 'damage_multiplier': newAttackObject = { ...base, effect: 'damage_multiplier', value: 1.5 }; break;
                case 'stat_drain': newAttackObject = { ...base, effect: 'stat_drain', value: -1, skill: SkillName.Attack }; break;
                case 'stat_drain_multi': newAttackObject = { ...base, effect: 'stat_drain_multi', skills: [] }; break;
                case 'stun': newAttackObject = { ...base, effect: 'stun', duration: 2000 }; break;
                case 'magic_bypass_defence': newAttackObject = { ...base, effect: 'magic_bypass_defence', maxHit: 10 }; break;
                case 'elemental_shift': newAttackObject = { ...base, effect: 'elemental_shift' }; break;
                default: newAttackObject = oldAttack; // Should not happen
            }
            newAttacks[index] = newAttackObject;
        } else {
            // The cast is necessary because spreading a partial breaks the discriminated union type guarantee for the compiler.
            newAttacks[index] = { ...oldAttack, ...updates } as MonsterSpecialAttack;
        }
        updateMonster(monsterId, { specialAttacks: newAttacks });
    };

    // FIX: SpellElement is a type, not an object with values. We must use an array of strings.
    const spellElements: SpellElement[] = ['wind', 'water', 'earth', 'fire'];

    return (
        <div className="fixed inset-0 bg-gray-900/95 z-70 p-4 flex flex-col text-white animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full h-full flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b-2 border-gray-700">
                    <h1 className="text-3xl font-bold text-yellow-400">Monster Database</h1>
                    <div>
                        <Button onClick={onCommit} disabled={!hasChanges} size="sm" className="mr-4">Commit Changes</Button>
                        <Button onClick={selectedMonster ? handleBack : onClose} size="sm">{selectedMonster ? 'Back to Grid' : 'Close'}</Button>
                    </div>
                </div>

                <div className="flex-grow p-4 overflow-y-auto relative">
                    {!selectedMonster && (
                        <div>
                            <div className="flex gap-4 mb-4">
                                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search monsters..." className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md" />
                                <select value={filter} onChange={e => setFilter(e.target.value as any)} className="p-2 bg-gray-900 border border-gray-700 rounded-md">
                                    <option value="all">All Types</option>
                                    {Object.values(MonsterType).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2">
                                {filteredMonsters.map(monster => (
                                    <button key={monster.id} onClick={() => handleSelectMonster(monster.id)} className="aspect-square p-2 bg-gray-900/50 rounded-md hover:bg-yellow-700/50 border-2 border-transparent hover:border-yellow-500 transition-all duration-150 relative" title={monster.name}>
                                        <img src={monster.iconUrl} alt={monster.name} className="w-full h-full object-contain filter invert" />
                                        {modifiedMonsters.has(monster.id) && <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>}
                                    </button>
                                ))}
                                <div onClick={handleAddNewMonster} className="aspect-square p-2 bg-gray-900/50 rounded-md flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer hover:bg-green-800/50 hover:border-green-500" title="Add New Monster">
                                    <span className="text-3xl font-thin text-gray-500">+</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedMonster && (
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <img src={selectedMonster.iconUrl} alt={selectedMonster.name} className={`w-24 h-24 bg-black/40 p-2 rounded-lg border-2 border-gray-700 object-contain filter invert transition-transform duration-500 ${isAnimating ? 'scale-0' : 'scale-100'}`} />
                                <div className="flex-grow">
                                    <input type="text" value={selectedMonster.name} onChange={e => updateMonster(selectedMonster.id, { name: e.target.value })} className="text-3xl font-bold bg-transparent border-b-2 border-gray-700 focus:border-yellow-500 outline-none w-full" />
                                    <p className="text-gray-400 font-mono text-sm mt-1">ID: {selectedMonster.id}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-900/50 p-3 rounded-lg space-y-2">
                                    <h3 className="font-bold text-yellow-300">Core Stats</h3>
                                    <div className="flex justify-between items-center text-sm"><label>Level:</label><input type="number" value={selectedMonster.level} onChange={e => updateMonster(selectedMonster.id, { level: +e.target.value })} className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                    <div className="flex justify-between items-center text-sm"><label>Max HP:</label><input type="number" value={selectedMonster.maxHp} onChange={e => updateMonster(selectedMonster.id, { maxHp: +e.target.value })} className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                    <div className="flex justify-between items-center text-sm"><label>Max Hit:</label><input type="number" value={selectedMonster.customMaxHit ?? ''} onChange={e => updateMonster(selectedMonster.id, { customMaxHit: e.target.value === '' ? undefined : +e.target.value })} placeholder="Auto" className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                </div>
                                <div className="bg-gray-900/50 p-3 rounded-lg space-y-2">
                                    <h3 className="font-bold text-yellow-300">Attack Stats</h3>
                                    <div className="flex justify-between items-center text-sm"><label>Attack:</label><input type="number" value={selectedMonster.attack} onChange={e => updateMonster(selectedMonster.id, { attack: +e.target.value })} className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                    <div className="flex justify-between items-center text-sm"><label>Ranged:</label><input type="number" value={selectedMonster.ranged || 0} onChange={e => updateMonster(selectedMonster.id, { ranged: +e.target.value })} className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                    <div className="flex justify-between items-center text-sm"><label>Magic:</label><input type="number" value={selectedMonster.magic || 0} onChange={e => updateMonster(selectedMonster.id, { magic: +e.target.value })} className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                </div>
                                <div className="bg-gray-900/50 p-3 rounded-lg space-y-2 col-span-2 grid grid-cols-2 gap-x-4">
                                    <h3 className="font-bold text-yellow-300 col-span-2">Defence Stats</h3>
                                    <div className="flex justify-between items-center text-sm"><label>Stab:</label><input type="number" value={selectedMonster.stabDefence} onChange={e => updateMonster(selectedMonster.id, { stabDefence: +e.target.value })} className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                    <div className="flex justify-between items-center text-sm"><label>Slash:</label><input type="number" value={selectedMonster.slashDefence} onChange={e => updateMonster(selectedMonster.id, { slashDefence: +e.target.value })} className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                    <div className="flex justify-between items-center text-sm"><label>Crush:</label><input type="number" value={selectedMonster.crushDefence} onChange={e => updateMonster(selectedMonster.id, { crushDefence: +e.target.value })} className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                    <div className="flex justify-between items-center text-sm"><label>Ranged:</label><input type="number" value={selectedMonster.rangedDefence} onChange={e => updateMonster(selectedMonster.id, { rangedDefence: +e.target.value })} className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                    <div className="flex justify-between items-center text-sm"><label>Magic:</label><input type="number" value={selectedMonster.magicDefence} onChange={e => updateMonster(selectedMonster.id, { magicDefence: +e.target.value })} className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-gray-900/50 p-3 rounded-lg space-y-2">
                                    <h3 className="font-bold text-yellow-300">Behavior</h3>
                                    <div className="flex justify-between items-center text-sm"><label>Attack Style:</label><select value={selectedMonster.attackStyle} onChange={e => updateMonster(selectedMonster.id, { attackStyle: e.target.value as any })} className="p-1 bg-gray-800 border border-gray-700 rounded"><option value="stab">Stab</option><option value="slash">Slash</option><option value="crush">Crush</option><option value="ranged">Ranged</option><option value="magic">Magic</option></select></div>
                                    <div className="flex justify-between items-center text-sm"><label>Attack Speed (ticks):</label><input type="number" value={selectedMonster.attackSpeed} onChange={e => updateMonster(selectedMonster.id, { attackSpeed: +e.target.value })} className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                    <div className="flex justify-between items-center text-sm"><label>Respawn Time (ms):</label><input type="number" value={selectedMonster.respawnTime} onChange={e => updateMonster(selectedMonster.id, { respawnTime: +e.target.value })} className="w-20 p-1 bg-gray-800 border border-gray-700 rounded text-right" /></div>
                                    <div className="flex justify-between items-center text-sm"><label>Aggressive:</label><input type="checkbox" checked={!!selectedMonster.aggressive} onChange={e => updateMonster(selectedMonster.id, { aggressive: e.target.checked })} /></div>
                                    <div className="flex justify-between items-center text-sm"><label>Always Aggressive:</label><input type="checkbox" checked={!!selectedMonster.alwaysAggressive} onChange={e => updateMonster(selectedMonster.id, { alwaysAggressive: e.target.checked })} /></div>
                                    <div className="flex justify-between items-center text-sm"><label>Always Drops Loot:</label><input type="checkbox" checked={!!selectedMonster.alwaysDrops} onChange={e => updateMonster(selectedMonster.id, { alwaysDrops: e.target.checked })} /></div>
                                </div>
                                <div className="bg-gray-900/50 p-3 rounded-lg space-y-2">
                                    <h3 className="font-bold text-yellow-300">Info</h3>
                                    <div className="flex justify-between items-center text-sm"><label>Icon URL:</label><input type="text" value={selectedMonster.iconUrl} onChange={e => updateMonster(selectedMonster.id, { iconUrl: e.target.value })} className="w-64 p-1 bg-gray-800 border border-gray-700 rounded" /></div>
                                    <div className="text-sm"><label>Types:</label><div className="grid grid-cols-3 gap-1 mt-1">{Object.values(MonsterType).map(type => (<label key={type} className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={selectedMonster.types.includes(type)} onChange={e => { const newTypes = e.target.checked ? [...selectedMonster.types, type] : selectedMonster.types.filter(t => t !== type); updateMonster(selectedMonster.id, { types: newTypes }); }} />{type}</label>))}</div></div>
                                    <div className="flex justify-between items-center text-sm"><label>Elemental Weakness:</label><select value={selectedMonster.elementalWeakness || ''} onChange={e => updateMonster(selectedMonster.id, { elementalWeakness: e.target.value as SpellElement || undefined })} className="p-1 bg-gray-800 border border-gray-700 rounded"><option value="">None</option>{spellElements.map(el => <option key={el} value={el}>{el}</option>)}</select></div>
                                    <div className="flex justify-between items-center text-sm"><label>Weakness Cycle:</label><input type="text" value={(selectedMonster.elementalWeaknessCycle || []).join(',')} onChange={e => updateMonster(selectedMonster.id, { elementalWeaknessCycle: e.target.value.split(',').map(s => s.trim()).filter(Boolean) as SpellElement[] })} placeholder="wind,water,earth" className="w-64 p-1 bg-gray-800 border border-gray-700 rounded" /></div>
                                </div>
                            </div>
                            {['guaranteedDrops', 'mainDrops', 'tertiaryDrops'].map(tableType => (<div key={tableType} className="bg-gray-900/50 p-3 rounded-lg"><h3 className="font-bold text-yellow-300 capitalize mb-2">{tableType.replace('Drops', ' Drops')}</h3><div className="space-y-2">{(selectedMonster[tableType as keyof Monster] as any[] || []).map((drop, index) => { const isTableDrop = !!drop.tableId; const item = !isTableDrop && drop.itemId ? ITEMS[drop.itemId] : null; const isValid = isTableDrop || !!item; return (<div key={index} className="grid grid-cols-12 gap-2 items-center text-sm p-1 bg-gray-800/50 rounded"><div className="col-span-3 flex items-center gap-2">{isTableDrop ? (<img src="https://api.iconify.design/game-icons:rolling-dices.svg" className="w-8 h-8 p-1 bg-black/30 rounded-md filter invert" alt="Loot Table" />) : item ? (<img src={item.iconUrl} className={`w-8 h-8 p-1 bg-black/30 rounded-md ${getIconClassName(item)}`} alt={item.name} />) : (<div className="w-8 h-8 bg-black/30 rounded-md flex items-center justify-center text-gray-500">?</div>)}<input type="text" value={drop.itemId || drop.tableId || ''} placeholder="itemId or tableId" onChange={(e) => { const value = e.target.value; const isPotentiallyTable = !ITEMS[value]; if (isPotentiallyTable) { updateDrop(selectedMonster.id, tableType as any, index, { tableId: value, itemId: undefined }); } else { updateDrop(selectedMonster.id, tableType as any, index, { itemId: value, tableId: undefined }); } }} className={`w-full p-1 bg-gray-900 border ${isValid ? 'border-gray-700' : 'border-red-500'} rounded`} /></div><div className="col-span-2 flex items-center gap-1">Min: <input type="number" value={drop.minQuantity} onChange={(e) => updateDrop(selectedMonster.id, tableType as any, index, { minQuantity: +e.target.value })} className="w-16 p-1 bg-gray-900 border border-gray-700 rounded text-right" /></div><div className="col-span-2 flex items-center gap-1">Max: <input type="number" value={drop.maxQuantity} onChange={(e) => updateDrop(selectedMonster.id, tableType as any, index, { maxQuantity: +e.target.value })} className="w-16 p-1 bg-gray-900 border border-gray-700 rounded text-right" /></div><div className="col-span-2 flex items-center gap-1">Chance: <input type={tableType === 'tertiaryDrops' ? 'number' : 'text'} value={tableType !== 'guaranteedDrops' ? (drop as WeightedDrop).chance : 'ALWAYS'} disabled={tableType === 'guaranteedDrops'} onChange={(e) => updateDrop(selectedMonster.id, tableType as any, index, { chance: e.target.value })} className="w-20 p-1 bg-gray-900 border border-gray-700 rounded text-right disabled:opacity-50" /></div><div className="col-span-2 flex items-center justify-start gap-1" title="Drop as note"><label htmlFor={`noted-check-${tableType}-${index}`} className="flex items-center gap-1 cursor-pointer select-none">Noted:<input id={`noted-check-${tableType}-${index}`} type="checkbox" checked={!!drop.noted} disabled={isTableDrop} onChange={(e) => updateDrop(selectedMonster.id, tableType as any, index, { noted: e.target.checked })} className="w-4 h-4 bg-gray-900 border-gray-700 rounded text-yellow-500 focus:ring-yellow-500 disabled:opacity-50 cursor-pointer" /></label></div><button onClick={() => handleRemoveDrop(selectedMonster.id, tableType as any, index)} className="col-span-1 text-red-500 hover:text-red-400 text-xl font-bold">×</button></div>);})}<button onClick={() => handleAddDrop(selectedMonster.id, tableType as any)} className="w-full text-center py-2 bg-green-900/50 hover:bg-green-800/50 rounded-md border-2 border-dashed border-green-700/50">+</button></div></div>))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MonsterDBView;
