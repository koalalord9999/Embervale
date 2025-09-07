
import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { POI, Region } from '../../types';
import { REGIONS } from '../../constants';
import { POIS } from '../../data/pois';
import { MAP_DIMENSIONS, CITY_MAP_DIMENSIONS } from '../../constants';
import { TooltipState } from '../../hooks/useUIState';

interface WorldMapViewProps {
    currentPoiId: string;
    unlockedPois: string[];
    onNavigate: (poiId: string) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    activeMapRegionId: string;
}

const WorldMapView: React.FC<WorldMapViewProps> = ({ currentPoiId, unlockedPois, onNavigate, setTooltip, activeMapRegionId }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const isInitialMount = useRef(true);
    const prevMapRegionId = useRef(activeMapRegionId);

    const isWorldView = activeMapRegionId === 'world';
    const mapDimensions = isWorldView ? MAP_DIMENSIONS : CITY_MAP_DIMENSIONS;

    const centerOnCurrentLocation = useCallback(() => {
        const poi = POIS[currentPoiId];
        const container = mapContainerRef.current;
        if (!poi || !container) return;

        let targetX, targetY, zoomLevel;
        
        if (isWorldView) {
            const region = REGIONS[poi.regionId];
            const isCity = region?.type === 'city';
            targetX = isCity ? region.x : poi.x;
            targetY = isCity ? region.y : poi.y;
            zoomLevel = 1;
        } else { // City View
            targetX = poi.x;
            targetY = poi.y;
            zoomLevel = 1.5;
        }

        setView({
            zoom: zoomLevel,
            x: -targetX * zoomLevel + container.offsetWidth / 2,
            y: -targetY * zoomLevel + container.offsetHeight / 2,
        });
    }, [currentPoiId, isWorldView]);

    const panToCurrentLocation = useCallback(() => {
        const poi = POIS[currentPoiId];
        const container = mapContainerRef.current;
        if (!poi || !container) return;

        let targetX, targetY;
        
        if (isWorldView) {
            const region = REGIONS[poi.regionId];
            const isCity = region?.type === 'city';
            targetX = isCity ? region.x : poi.x;
            targetY = isCity ? region.y : poi.y;
        } else {
            targetX = poi.x;
            targetY = poi.y;
        }

        setView(v => ({
            ...v,
            x: -targetX * v.zoom + container.offsetWidth / 2,
            y: -targetY * v.zoom + container.offsetHeight / 2,
        }));
    }, [currentPoiId, isWorldView]);
    
    useEffect(() => {
        const hasMapChanged = prevMapRegionId.current !== activeMapRegionId;
        
        if (isInitialMount.current || hasMapChanged) {
            centerOnCurrentLocation();
            isInitialMount.current = false;
            prevMapRegionId.current = activeMapRegionId;
        } else {
            panToCurrentLocation();
        }
    }, [activeMapRegionId, currentPoiId, centerOnCurrentLocation, panToCurrentLocation]);


    const onWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const container = mapContainerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const zoomFactor = 1.1;
        const newZoom = e.deltaY < 0 ? view.zoom * zoomFactor : view.zoom / zoomFactor;
        const clampedZoom = Math.max(0.25, Math.min(8, newZoom));

        const mapX = (mouseX - view.x) / view.zoom;
        const mapY = (mouseY - view.y) / view.zoom;

        const newX = mouseX - mapX * clampedZoom;
        const newY = mouseY - mapY * clampedZoom;

        setView({ x: newX, y: newY, zoom: clampedZoom });
    };

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStart.current = { x: e.clientX - view.x, y: e.clientY - view.y };
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.cursor = 'grabbing';
        }
    };

    const onMouseUpOrLeave = (e: React.MouseEvent | React.TouchEvent) => {
        if(isDragging) {
            setIsDragging(false);
            if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.cursor = 'grab';
            }
        }
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setView(v => ({
            ...v,
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        }));
    };

    const zoomIn = () => setView(v => ({ ...v, zoom: Math.min(8, v.zoom * 1.5) }));
    const zoomOut = () => setView(v => ({ ...v, zoom: Math.max(0.25, v.zoom / 1.5) }));
    

    const { poisToDisplay, regionsToDisplay, phantomExits, mapTitle } = useMemo(() => {
        if (isWorldView) {
            return {
                poisToDisplay: Object.values(POIS).filter(p => {
                    const region = REGIONS[p.regionId];
                    return region?.type !== 'city' && region?.type !== 'dungeon';
                }),
                regionsToDisplay: Object.values(REGIONS).filter(r => r.type === 'city'),
                phantomExits: [],
                mapTitle: 'World Map'
            };
        }
    
        const cityPois = Object.values(POIS).filter(p => p.regionId === activeMapRegionId);
        const exits: { navigationId: string; gateName: string; displayName: string; x: number; y: number }[] = [];
        const addedGateIds = new Set<string>();
    
        cityPois.forEach(internalPoi => {
            internalPoi.connections.forEach(connId => {
                const externalPoi = POIS[connId];
                
                if (externalPoi && externalPoi.regionId !== activeMapRegionId && !addedGateIds.has(externalPoi.id)) {
                    
                    const worldMapDestinationId = externalPoi.connections.find(
                        destId => destId !== internalPoi.id && POIS[destId] && !POIS[destId].id.includes('_gate')
                    );
                    
                    if (worldMapDestinationId) {
                        addedGateIds.add(externalPoi.id);
                        
                        const destinationPoi = POIS[worldMapDestinationId];

                        if (externalPoi.cityMapX !== undefined && externalPoi.cityMapY !== undefined) {
                            exits.push({
                                navigationId: externalPoi.id,
                                gateName: externalPoi.name,
                                displayName: destinationPoi.name,
                                x: externalPoi.cityMapX,
                                y: externalPoi.cityMapY,
                            });
                        } else {
                            console.warn(`Gate POI ${externalPoi.id} is missing cityMapX/Y and will not be displayed on the city map.`);
                        }
                    }
                }
            });
        });
    
        return {
            poisToDisplay: cityPois,
            regionsToDisplay: [],
            phantomExits: exits,
            mapTitle: `${REGIONS[activeMapRegionId]?.name || 'Region'} Map`
        };
    }, [isWorldView, activeMapRegionId]);

    const handleMouseEnter = (e: React.MouseEvent, item: POI | Region | { name: string, description?: string }) => {
        const tooltipContent = (
            <div>
                <p className="font-bold text-yellow-300">{item.name}</p>
                {'description' in item && item.description && <p className="text-sm text-gray-300">{item.description}</p>}
            </div>
        );
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };
    
    return (
        <div className="flex flex-col h-full text-gray-300 relative">
            <h3 className="text-lg font-bold text-center mb-2 text-yellow-400">
                {mapTitle}
            </h3>
            <div 
                ref={mapContainerRef}
                className="flex-grow bg-cover bg-center border-2 border-gray-600 rounded-lg relative overflow-hidden cursor-grab"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505236755279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop')` }}
                onWheel={onWheel}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUpOrLeave}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseUpOrLeave}
            >
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative" style={{
                    width: `${mapDimensions.width}px`,
                    height: `${mapDimensions.height}px`,
                    transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
                    transformOrigin: '0 0',
                    willChange: 'transform',
                }}>
                    <svg className="absolute top-0 left-0 pointer-events-none" width={mapDimensions.width} height={mapDimensions.height} style={{ overflow: 'visible' }}>
                        {poisToDisplay.map(startPoi => {
                            if (!startPoi) return null;
                            const startPoiData = POIS[startPoi.id] ?? startPoi;

                            return startPoiData.connections?.map(connId => {
                                const endPoi = POIS[connId];
                                if (!endPoi || startPoi.id > endPoi.id) return null;
                                
                                const endRegion = REGIONS[endPoi.regionId];
                                const isEndPoiInCurrentView = poisToDisplay.some(p => p.id === endPoi.id);
                                const isEndPoiACityIcon = isWorldView && endRegion?.type === 'city';
                                
                                if (!isEndPoiInCurrentView && !isEndPoiACityIcon) return null;

                                const isUnlocked = unlockedPois.includes(startPoi.id) && unlockedPois.includes(endPoi.id);

                                return (
                                    <line 
                                        key={`${startPoi.id}-${endPoi.id}`}
                                        x1={startPoi.x} y1={startPoi.y}
                                        x2={isEndPoiACityIcon ? endRegion.x : endPoi.x} 
                                        y2={isEndPoiACityIcon ? endRegion.y : endPoi.y}
                                        stroke={isUnlocked ? 'rgba(200, 200, 200, 0.4)' : 'rgba(100, 100, 100, 0.4)'} 
                                        strokeWidth={2 / view.zoom}
                                        strokeDasharray={isUnlocked ? 'none' : `${6 / view.zoom} ${4 / view.zoom}`}
                                    />
                                );
                            });
                        })}
                        {!isWorldView && poisToDisplay.map(startPoi => (
                            startPoi.connections?.map(connId => {
                                const phantomExit = phantomExits.find(exit => exit.navigationId === connId);
                                if (phantomExit) {
                                    const isUnlocked = unlockedPois.includes(startPoi.id) && unlockedPois.includes(connId);
                                    return (
                                        <line
                                            key={`${startPoi.id}-${connId}-exit`}
                                            x1={startPoi.x} y1={startPoi.y}
                                            x2={phantomExit.x} y2={phantomExit.y}
                                            stroke={isUnlocked ? 'rgba(200, 200, 200, 0.4)' : 'rgba(100, 100, 100, 0.4)'}
                                            strokeWidth={2 / view.zoom}
                                            strokeDasharray={isUnlocked ? 'none' : `${6 / view.zoom} ${4 / view.zoom}`}
                                        />
                                    );
                                }
                                return null;
                            })
                        ))}
                    </svg>

                    {regionsToDisplay.map(region => {
                        const isCurrent = POIS[currentPoiId]?.regionId === region.id;
                        return (
                             <div
                                key={region.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                                style={{ top: `${region.y}px`, left: `${region.x}px` }}
                                onClick={() => onNavigate(region.entryPoiId)}
                                onMouseEnter={(e) => handleMouseEnter(e, region)}
                                onMouseLeave={() => setTooltip(null)}
                            >
                                <img src="https://api.iconify.design/game-icons:capitol.svg" alt={region.name} className="filter invert opacity-80 group-hover:opacity-100 transition-opacity" style={{width: `${40 / view.zoom}px`, height: `${40 / view.zoom}px`}} />
                                {isCurrent && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-yellow-400 animate-pulse" style={{width: `${50/view.zoom}px`, height: `${50/view.zoom}px`}}></div>}

                            </div>
                        )
                    })}

                    {poisToDisplay.map(poi => {
                        const isCurrent = poi.id === currentPoiId;
                        const isUnlocked = unlockedPois.includes(poi.id);
                        const dotColorClass = isCurrent ? "bg-yellow-400" : (isUnlocked ? "bg-green-400" : "bg-gray-600");
                        
                        return (
                            <div
                                key={poi.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                style={{ top: `${poi.y}px`, left: `${poi.x}px` }}
                            >
                                <div 
                                    className={`relative rounded-full ${isUnlocked ? 'cursor-pointer hover:scale-150' : 'cursor-default'} transition-transform duration-200`}
                                    style={{ width: `${12 / view.zoom}px`, height: `${12 / view.zoom}px` }}
                                    onClick={() => isUnlocked && onNavigate(poi.id)}
                                    onMouseEnter={(e) => isUnlocked && handleMouseEnter(e, poi)}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    <div className={`w-full h-full rounded-full ${dotColorClass}`}></div>
                                    {isCurrent && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-yellow-400 animate-pulse" style={{width: `${20/view.zoom}px`, height: `${20/view.zoom}px`}}></div>}
                                </div>
                            </div>
                        );
                    })}

                    {phantomExits.map(exit => (
                        <div
                            key={`exit-${exit.navigationId}`}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                            style={{ top: `${exit.y}px`, left: `${exit.x}px` }}
                            onClick={() => onNavigate(exit.navigationId)}
                            onMouseEnter={(e) => handleMouseEnter(e, { name: exit.gateName, description: `Exit to world map. Leads towards ${exit.displayName}.` })}
                            onMouseLeave={() => setTooltip(null)}
                        >
                            <img 
                                src="https://api.iconify.design/game-icons:exit-door.svg" 
                                alt={`To ${exit.displayName}`} 
                                className="filter invert opacity-80 group-hover:opacity-100 transition-opacity" 
                                style={{width: `${32 / view.zoom}px`, height: `${32 / view.zoom}px`}} 
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
                <button onClick={zoomIn} className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-md text-lg font-bold border border-gray-500">+</button>
                <button onClick={zoomOut} className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-md text-lg font-bold border border-gray-500">-</button>
                <button onClick={centerOnCurrentLocation} className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-md text-xs font-bold border border-gray-500 flex items-center justify-center">Center</button>
            </div>
        </div>
    );
};

export default WorldMapView;
