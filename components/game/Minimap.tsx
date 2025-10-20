import React from 'react';
import { POIS } from '../../data/pois';
import { useUIState } from '../../hooks/useUIState';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

interface MinimapProps {
    currentPoiId: string;
    currentHp: number;
    maxHp: number;
    ui: ReturnType<typeof useUIState>;
    isTouchSimulationEnabled: boolean;
    onNavigate: (poiId: string) => void;
    unlockedPois: string[];
    addLog: (message: string) => void;
    isDevMode: boolean;
    onToggleDevPanel: () => void;
    showMinimapHealth: boolean;
}

const HpOrb: React.FC<{ currentHp: number, maxHp: number, showHealthNumbers: boolean }> = ({ currentHp, maxHp, showHealthNumbers }) => {
    const percentage = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
  
    return (
      <div 
        data-tutorial-id="hp-orb"
        className="relative w-11 h-11 rounded-full border-2 border-gray-500 bg-gray-800 overflow-hidden shadow-lg"
      >
        {/* Liquid fill */}
        <div 
          className="absolute bottom-0 left-0 w-full bg-red-600 transition-all duration-300 ease-in-out" 
          style={{ height: `${percentage}%` }}
        />
        {/* Heart Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
            <img 
                src="https://api.iconify.design/game-icons:hearts.svg" 
                alt="" 
                className="w-8 h-8 filter invert opacity-25" 
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

const Minimap: React.FC<MinimapProps> = ({ currentPoiId, currentHp, maxHp, ui, isTouchSimulationEnabled, onNavigate, unlockedPois, addLog, isDevMode, onToggleDevPanel, showMinimapHealth }) => {
    const currentPoi = POIS[currentPoiId];
    const isTouchDevice = useIsTouchDevice(isTouchSimulationEnabled);

    const mapOrbLongPress = useLongPress({
        onLongPress: (e) => {
            const event = 'touches' in e ? e.touches[0] : e;
            ui.setContextMenu({
                options: [
                    { label: 'Open World Map', onClick: () => ui.setIsExpandedMapViewOpen(true) },
                    { label: 'Open Atlas', onClick: () => ui.setIsAtlasViewOpen(true) },
                ],
                event,
                isTouchInteraction: 'touches' in e,
            });
        },
        onClick: () => ui.setIsExpandedMapViewOpen(true), // Default action
    });

    const handleDevToggle = () => {
        onToggleDevPanel();
        // Use a small timeout to ensure the panel is rendered before we try to scroll on mobile.
        setTimeout(() => {
            if (window.innerWidth < 768) { // md breakpoint from Tailwind
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    gameContainer.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        }, 50); 
    };

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
                <div className="absolute z-10 top-px left-px">
                    <HpOrb currentHp={currentHp} maxHp={maxHp} showHealthNumbers={showMinimapHealth} />
                </div>
                
                {isDevMode && (
                    <button 
                        onClick={handleDevToggle}
                        className="absolute z-10 w-8 h-8 bg-gray-800 hover:bg-gray-700 border-2 border-gray-500 rounded-full flex items-center justify-center top-px right-px"
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
