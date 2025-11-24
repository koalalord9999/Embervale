
import React, { useEffect, useState } from 'react';
import { POIS, REGIONS } from '../../constants';
// FIX: Import 'ContextMenuOption' from its source file to resolve export issue.
import { ContextMenuState, useUIState } from '../../hooks/useUIState';
import { ContextMenuOption } from '../common/ContextMenu';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import HitSplat from '../common/HitSplat'; // Import external component

interface MinimapProps {
    currentPoiId: string;
    currentHp: number;
    maxHp: number;
    currentPrayer: number;
    maxPrayer: number;
    ui: ReturnType<typeof useUIState>;
    isTouchSimulationEnabled: boolean;
    onNavigate: (poiId: string) => void;
    unlockedPois: string[];
    addLog: (message: string) => void;
    isDevMode: boolean;
    onToggleDevPanel: () => void;
    showMinimapHealth: boolean;
    isPoisoned: boolean;
    onCurePoison: () => void;
    isInCombat: boolean;
    poisonEvent: { damage: number, timestamp: number } | null;
    // New Dev Props
    isPermAggroOn?: boolean;
    onTogglePermAggro?: () => void;
    isGodModeOn?: boolean;
    onToggleGodMode?: () => void;
}

const HpOrb: React.FC<{
    currentHp: number;
    maxHp: number;
    showHealthNumbers: boolean;
    isPoisoned: boolean;
    onCurePoison: () => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    isTouchDevice: boolean;
}> = ({ currentHp, maxHp, showHealthNumbers, isPoisoned, onCurePoison, setContextMenu, isTouchDevice }) => {
    const percentage = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
    
    const liquidClass = isPoisoned ? 'bg-green-700' : 'bg-red-600';
    const heartIconClass = isPoisoned ? 'poisoned-heart-icon' : 'filter invert opacity-25';

    const handleSingleTap = () => {
        if (isPoisoned) {
            onCurePoison();
        }
    };

    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isPoisoned) return;
        e.preventDefault();
        
        let eventForMenu: React.MouseEvent | React.Touch;
        if ('touches' in e && e.touches.length > 0) {
            eventForMenu = e.touches[0];
        } else if ('changedTouches' in e && e.changedTouches.length > 0) {
            eventForMenu = e.changedTouches[0];
        } else {
            eventForMenu = e as React.MouseEvent;
        }

        const options: ContextMenuOption[] = [
            { label: 'Cure Poison', onClick: () => { onCurePoison(); setContextMenu(null); } }
        ];
        setContextMenu({ options, triggerEvent: eventForMenu, isTouchInteraction: isTouchDevice, title: "Health" });
    };
    
    const longPressHandlers = useLongPress({
        onLongPress: handleLongPress,
        onClick: handleSingleTap,
    });
  
    return (
      <div 
        {...longPressHandlers}
        data-tutorial-id="hp-orb"
        className="relative w-11 h-11 rounded-full border-2 border-gray-500 bg-gray-800 overflow-hidden shadow-lg"
      >
        {/* Liquid fill */}
        <div 
          className={`absolute bottom-0 left-0 w-full ${liquidClass} transition-all duration-300 ease-in-out`} 
          style={{ height: `${percentage}%` }}
        />
        {/* Heart Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
            <img 
                src="https://api.iconify.design/game-icons:hearts.svg" 
                alt="" 
                className={`w-8 h-8 transition-all ${heartIconClass}`} 
            />
        </div>
        {/* Shine effect */}
        <div className="absolute top-1 left-1 w-8 h-8 rounded-full bg-white/20 blur-sm" />
        {/* HP Text */}
        {showHealthNumbers && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="font-bold text-lg text-white" style={{ textShadow: '1px 1px 2px black' }}>
                    {currentHp}
                </span>
            </div>
        )}
      </div>
    );
};

const PrayerOrb: React.FC<{ currentPrayer: number, maxPrayer: number }> = ({ currentPrayer, maxPrayer }) => {
    const percentage = maxPrayer > 0 ? (currentPrayer / maxPrayer) * 100 : 0;
  
    return (
      <div className="relative w-11 h-11 rounded-full border-2 border-gray-500 bg-gray-800 overflow-hidden shadow-lg">
        <div className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-300 ease-in-out" style={{ height: `${percentage}%` }} />
        <div className="absolute inset-0 flex items-center justify-center">
            <img src="https://api.iconify.design/game-icons:polar-star.svg" alt="" className="w-8 h-8 filter invert opacity-25" />
        </div>
        <div className="absolute top-1 left-1 w-8 h-8 rounded-full bg-white/20 blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="font-bold text-lg text-white" style={{ textShadow: '1px 1px 2px black' }}>
                {Math.floor(currentPrayer)}
            </span>
        </div>
      </div>
    );
};


const Minimap: React.FC<MinimapProps> = ({ currentPoiId, currentHp, maxHp, currentPrayer, maxPrayer, ui, isTouchSimulationEnabled, onNavigate, unlockedPois, addLog, isDevMode, onToggleDevPanel, showMinimapHealth, isPoisoned, onCurePoison, isInCombat, poisonEvent, isPermAggroOn, onTogglePermAggro, isGodModeOn, onToggleGodMode }) => {
    const currentPoi = POIS[currentPoiId];
    const isTouchDevice = useIsTouchDevice(isTouchSimulationEnabled);
    const [hitSplats, setHitSplats] = useState<{ id: number; damage: number }[]>([]);

    const currentRegion = currentPoi ? REGIONS[currentPoi.regionId] : null;

    // Handle poison damage hitsplats when out of combat
    useEffect(() => {
        if (poisonEvent && !isInCombat) {
            const id = Date.now() + Math.random();
            setHitSplats(prev => [...prev, { id, damage: poisonEvent.damage }]);
            setTimeout(() => setHitSplats(prev => prev.filter(splat => splat.id !== id)), 1500);
        }
    }, [poisonEvent, isInCombat]);

    const handleMapOpen = () => {
        if (currentRegion && (currentRegion.type === 'city' || currentRegion.type === 'underground')) {
            ui.setActiveMapRegionId(currentRegion.id);
        } else {
            ui.setActiveMapRegionId('world');
        }
        ui.setIsExpandedMapViewOpen(true);
    };

    const mapOrbLongPress = useLongPress({
        onLongPress: (e: React.MouseEvent | React.TouchEvent) => {
            let eventForMenu: React.MouseEvent | React.Touch;
            if ('touches' in e && e.touches.length > 0) {
                eventForMenu = e.touches[0];
            } else if ('changedTouches' in e && e.changedTouches.length > 0) {
                eventForMenu = e.changedTouches[0];
            } else {
                eventForMenu = e as React.MouseEvent;
            }
            ui.setContextMenu({
                options: [
                    { label: 'Open World Map', onClick: () => {
                        ui.setActiveMapRegionId('world');
                        ui.setIsExpandedMapViewOpen(true);
                    } },
                    { label: 'Open Atlas', onClick: () => ui.setIsAtlasViewOpen(true) },
                ],
                triggerEvent: eventForMenu,
                isTouchInteraction: 'touches' in e || 'changedTouches' in e,
                title: "Map"
            });
        },
        onClick: handleMapOpen,
    });
    
    const devButtonLongPress = useLongPress({
        onLongPress: (e: React.MouseEvent | React.TouchEvent) => {
            let eventForMenu: React.MouseEvent | React.Touch;
            if ('touches' in e && e.touches.length > 0) {
                eventForMenu = e.touches[0];
            } else if ('changedTouches' in e && e.changedTouches.length > 0) {
                eventForMenu = e.changedTouches[0];
            } else {
                eventForMenu = e as React.MouseEvent;
            }

            const performAction = (action: () => void) => {
                action();
                ui.setContextMenu(null);
            };

            const options: ContextMenuOption[] = [
                { label: 'Open Panel', onClick: () => performAction(onToggleDevPanel) },
                { 
                    label: <span className={isPermAggroOn ? "text-green-500" : "text-red-500"}>Toggle Aggression</span>, 
                    onClick: () => performAction(() => onTogglePermAggro?.())
                },
                { label: 'Open Bank', onClick: () => performAction(() => ui.setActivePanel('bank')) },
                { 
                    label: <span className={isGodModeOn ? "text-green-500" : "text-red-500"}>Toggle God Mode</span>, 
                    onClick: () => performAction(() => onToggleGodMode?.())
                },
            ];

            ui.setContextMenu({
                options,
                triggerEvent: eventForMenu,
                isTouchInteraction: 'touches' in e || 'changedTouches' in e,
                title: "Developer Options"
            });
        },
        onClick: onToggleDevPanel
    });

    if (!currentPoi) return null;

    return (
        <div className="bg-black/70 border-b-2 border-gray-600 flex flex-col gap-2 flex-shrink-0">
            {/* Main positioning container for the minimap and its overlays. Now full-width. */}
            <div className="w-full aspect-square relative my-1">
                
                {/* Radar background, POI dots, and player icon. Now explicitly sized and centered. */}
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-cover bg-center border-2 border-yellow-600 rounded-full overflow-hidden"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505236755279-228d5d36c34b?q=80&w=256&auto=format=fit=crop')` }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    
                    {/* Center dot for player */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full border-2 border-black" />
                    
                    {/* Connection POI dots */}
                    {currentPoi.connections.map(connId => {
                        const connPoi = POIS[connId];
                        if (!connPoi) return null;
                        
                        const isUnlocked = unlockedPois.includes(connId);
                        const dotColorClass = isUnlocked ? "bg-gray-300 hover:bg-yellow-300" : "bg-gray-700";
                        const cursorClass = isUnlocked ? "cursor-pointer" : "cursor-not-allowed";

                        const dx = connPoi.x - currentPoi.x;
                        const dy = connPoi.y - currentPoi.y;
                        const angle = Math.atan2(dy, dx);
                        const distance = 40; 

                        const left = `calc(50% + ${Math.cos(angle) * distance}px - 8px)`;
                        const top = `calc(50% + ${Math.sin(angle) * distance}px - 8px)`;

                        return (
                            <div 
                                key={connId} 
                                className={`absolute w-4 h-4 rounded-full border-2 border-black transition-colors ${dotColorClass} ${cursorClass}`}
                                style={{ left, top }} 
                                onClick={() => {
                                    if (isUnlocked) {
                                        onNavigate(connId);
                                    } else {
                                        addLog("You can't get there from here.");
                                    }
                                }}
                                onMouseEnter={(e) => ui.setTooltip({
                                    content: (
                                        <div>
                                            <p className="font-bold">{POIS[connId].name}</p>
                                            {!isUnlocked && <p className="text-sm text-red-400">Locked</p>}
                                        </div>
                                    ),
                                    position: { x: e.clientX, y: e.clientY }
                                })}
                                onMouseLeave={() => ui.setTooltip(null)}
                            />
                        );
                    })}
                </div>

                {/* HP Orb Overlay - Placed in the top-left corner of the panel */}
                <div className="absolute z-10 top-px left-px pointer-events-none">
                    <div className="pointer-events-auto">
                        <HpOrb
                            currentHp={currentHp}
                            maxHp={maxHp}
                            showHealthNumbers={showMinimapHealth}
                            isPoisoned={isPoisoned}
                            onCurePoison={onCurePoison}
                            setContextMenu={ui.setContextMenu}
                            isTouchDevice={isTouchDevice}
                        />
                    </div>
                    {/* Hitsplats over HP Orb */}
                    {hitSplats.map(splat => (
                        <HitSplat key={splat.id} damage={splat.damage} isPoison={true} />
                    ))}
                </div>

                 {/* Prayer Orb Overlay */}
                <div className="absolute z-10 top-px right-px">
                    <PrayerOrb currentPrayer={currentPrayer} maxPrayer={maxPrayer} />
                </div>
                
                {isDevMode && (
                    <button 
                        {...devButtonLongPress}
                        className="absolute z-10 w-8 h-8 bg-gray-800 hover:bg-gray-700 border-2 border-gray-500 rounded-full flex items-center justify-center bottom-px left-px"
                        aria-label="Open Dev Panel"
                    >
                        <img src="https://api.iconify.design/game-icons:wrench.svg" alt="Dev Panel" className="w-5 h-5 filter invert" />
                    </button>
                )}
                
                {/* Map Orb Overlay - Placed in the bottom-right corner of the panel */}
                <button 
                    data-tutorial-id="map-orb"
                    {...mapOrbLongPress}
                    className="absolute z-10 w-11 h-11 rounded-full bg-blue-800 hover:bg-blue-700 border-2 border-blue-500 flex items-center justify-center bottom-px right-px"
                    aria-label="Open Map"
                >
                    <img src="https://api.iconify.design/game-icons:world.svg" alt="Map" className="w-7 h-7 filter invert" />
                </button>
            </div>
        </div>
    );
};

export default Minimap;
