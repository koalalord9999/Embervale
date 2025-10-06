import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { POI, Region, WorldState } from '../../types';
import { REGIONS, MAP_DIMENSIONS, CITY_MAP_DIMENSIONS } from '../../constants';
import { POIS } from '../../data/pois';
import { TooltipState } from '../../hooks/useUIState';
import Button from '../common/Button';

interface ExpandedMapViewProps {
    currentPoiId: string;
    unlockedPois: string[];
    onNavigate: (poiId: string) => void;
    onClose: () => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    addLog: (message: string) => void;
    isMapManagerEnabled?: boolean;
    poiCoordinates?: Record<string, { x: number; y: number }>;
    regionCoordinates?: Record<string, { x: number; y: number }>;
    onUpdatePoiCoordinate?: (id: string, x: number, y: number, isRegion: boolean) => void;
    poiConnections?: Record<string, string[]>;
    onUpdatePoiConnections?: (poiId: string, newConnections: string[]) => void;
    showAllPois: boolean;
    onCommitMapChanges: () => void;
    activeMapRegionId: string;
    setActiveMapRegionId: (regionId: string) => void;
    deathMarker: WorldState['deathMarker'];
}

const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const ExpandedMapView: React.FC<ExpandedMapViewProps> = ({ currentPoiId, unlockedPois, onNavigate, onClose, setTooltip, addLog, isMapManagerEnabled = false, poiCoordinates, regionCoordinates, onUpdatePoiCoordinate, poiConnections, onUpdatePoiConnections, showAllPois, onCommitMapChanges, activeMapRegionId, setActiveMapRegionId, deathMarker }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const nodeDragStart = useRef({ x: 0, y: 0 });
    const isInitialMount = useRef(true);
    const prevMapRegionId = useRef(activeMapRegionId);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    const [connectionState, setConnectionState] = useState<{ fromPoiId: string | null; type: 'two-way' | 'one-way' | null }>({ fromPoiId: null, type: null });
    const [hoveredInfo, setHoveredInfo] = useState<{ id: string; name: string } | null>(null);

    const isWorldView = activeMapRegionId === 'world';
    const mapDimensions = isWorldView ? MAP_DIMENSIONS : CITY_MAP_DIMENSIONS;

    useEffect(() => {
        if (!connectionState.fromPoiId || !isMapManagerEnabled) {
            setTooltip(null);
            return;
        }
    
        const handleMouseMove = (e: MouseEvent) => {
            const fromPoi = POIS[connectionState.fromPoiId!] || Object.values(POIS).find(p => p.id === REGIONS[connectionState.fromPoiId!]?.entryPoiId);
            const fromPoiName = fromPoi?.name || connectionState.fromPoiId;

            const toPoiName = hoveredInfo?.name ?? '...';
            const typeText = connectionState.type === 'two-way' ? 'Creating connection:' : 'Creating one-way connection from:';
            
            setTooltip({
                content: <p className="font-mono">{`${typeText} ${fromPoiName} -> ${toPoiName}`}</p>,
                position: { x: e.clientX, y: e.clientY },
            });
        };
    
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            setTooltip(null);
        };
    }, [connectionState, hoveredInfo, setTooltip, isMapManagerEnabled]);
    
    const centerOnCurrentLocation = useCallback(() => {
        const poi = POIS[currentPoiId];
        const container = mapContainerRef.current;
        if (!poi || !container) return;
    
        let targetX, targetY, zoomLevel;
        
        if (isWorldView) {
            const region = REGIONS[poi.regionId];
            const isCity = region?.type === 'city' || region?.type === 'dungeon';
            const effectivePoi = isMapManagerEnabled ? (isCity ? regionCoordinates?.[region.id] : poiCoordinates?.[poi.id]) : { x: isCity ? region.x : poi.x, y: isCity ? region.y : poi.y };
            if (!effectivePoi) return;
            targetX = effectivePoi.x;
            targetY = effectivePoi.y;
            zoomLevel = 2;
        } else {
            if (poi.regionId === activeMapRegionId) {
                const effectivePoi = isMapManagerEnabled ? poiCoordinates?.[poi.id] : poi;
                if (!effectivePoi) return;
                targetX = effectivePoi.x;
                targetY = effectivePoi.y;
            } else {
                const cityEntryPoi = POIS[REGIONS[activeMapRegionId]?.entryPoiId];
                targetX = cityEntryPoi?.cityMapX ?? CITY_MAP_DIMENSIONS.width / 2;
                targetY = cityEntryPoi?.cityMapY ?? CITY_MAP_DIMENSIONS.height / 2;
            }
            zoomLevel = 1.5;
        }
    
        setView({
            zoom: zoomLevel,
            x: -targetX * zoomLevel + container.offsetWidth / 2,
            y: -targetY * zoomLevel + container.offsetHeight / 2,
        });
    }, [currentPoiId, isWorldView, activeMapRegionId, poiCoordinates, regionCoordinates, isMapManagerEnabled]);

    const panToCurrentLocation = useCallback(() => {
        const poi = POIS[currentPoiId];
        const container = mapContainerRef.current;
        if (!poi || !container) return;
    
        let targetX, targetY;
        
        if (isWorldView) {
            const region = REGIONS[poi.regionId];
            const isCity = region?.type === 'city' || region?.type === 'dungeon';
            const effectivePoi = isMapManagerEnabled ? (isCity ? regionCoordinates?.[region.id] : poiCoordinates?.[poi.id]) : { x: isCity ? region.x : poi.x, y: isCity ? region.y : poi.y };
            if (!effectivePoi) return;
            targetX = effectivePoi.x;
            targetY = effectivePoi.y;
        } else {
            if (poi.regionId === activeMapRegionId) {
                const effectivePoi = isMapManagerEnabled ? poiCoordinates?.[poi.id] : poi;
                if (!effectivePoi) return;
                targetX = effectivePoi.x;
                targetY = effectivePoi.y;
            } else {
                const cityEntryPoi = POIS[REGIONS[activeMapRegionId]?.entryPoiId];
                targetX = cityEntryPoi?.cityMapX ?? CITY_MAP_DIMENSIONS.width / 2;
                targetY = cityEntryPoi?.cityMapY ?? CITY_MAP_DIMENSIONS.height / 2;
            }
        }
    
        setView(v => ({
            ...v,
            x: -targetX * v.zoom + container.offsetWidth / 2,
            y: -targetY * v.zoom + container.offsetHeight / 2,
        }));
    }, [currentPoiId, isWorldView, activeMapRegionId, poiCoordinates, regionCoordinates, isMapManagerEnabled]);
    
    useEffect(() => {
        const hasMapChanged = prevMapRegionId.current !== activeMapRegionId;

        if (isMapManagerEnabled) {
            if (isInitialMount.current) {
                setView({ x: -mapDimensions.width * 0.25, y: -mapDimensions.height * 0.25, zoom: 0.5 });
                isInitialMount.current = false;
            }
            return;
        }
        
        if (isInitialMount.current || hasMapChanged) {
            centerOnCurrentLocation();
            isInitialMount.current = false;
            prevMapRegionId.current = activeMapRegionId;
        } else {
            panToCurrentLocation();
        }
    }, [activeMapRegionId, currentPoiId, centerOnCurrentLocation, panToCurrentLocation, isMapManagerEnabled, mapDimensions]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            setView(v => ({ ...v, x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }));
        } else if (draggedItemId && onUpdatePoiCoordinate) {
            const isRegion = REGIONS[draggedItemId] && (REGIONS[draggedItemId].type === 'city' || REGIONS[draggedItemId].type === 'dungeon');
            const currentCoords = isRegion ? regionCoordinates![draggedItemId] : poiCoordinates![draggedItemId];
            const newX = currentCoords.x + (e.movementX / view.zoom);
            const newY = currentCoords.y + (e.movementY / view.zoom);
            onUpdatePoiCoordinate(draggedItemId, Math.round(newX), Math.round(newY), isRegion);
        }
    }, [isDragging, view.zoom, draggedItemId, poiCoordinates, regionCoordinates, onUpdatePoiCoordinate]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDraggedItemId(null);
        const container = mapContainerRef.current;
        if (container) container.style.cursor = 'grab';
    }, []);

    useEffect(() => {
        if (isDragging || draggedItemId) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, draggedItemId, handleMouseMove, handleMouseUp]);

    const onWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const container = mapContainerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const zoomFactor = 1.1;
        const newZoom = e.deltaY < 0 ? view.zoom * zoomFactor : view.zoom / zoomFactor;
        const clampedZoom = Math.max(0.25, Math.min(16, newZoom));
        const mapX = (mouseX - view.x) / view.zoom;
        const mapY = (mouseY - view.y) / view.zoom;
        const newX = mouseX - mapX * clampedZoom;
        const newY = mouseY - mapY * clampedZoom;
        setView({ x: newX, y: newY, zoom: clampedZoom });
    };
    
    const handleNodeMouseDown = (e: React.MouseEvent, id: string, isRegion: boolean) => {
        if (!isMapManagerEnabled || !onUpdatePoiConnections || !poiConnections) return;
        const poiId = isRegion ? REGIONS[id]?.entryPoiId : id;
        if (!poiId) return;
        if (connectionState.fromPoiId && connectionState.fromPoiId !== poiId) {
            e.preventDefault(); e.stopPropagation();
            const fromId = connectionState.fromPoiId;
            const toId = poiId;
            const fromConns = [...(poiConnections[fromId] || POIS[fromId].connections)];
            const toConns = [...(poiConnections[toId] || POIS[toId].connections)];
            if (!fromConns.includes(toId)) { fromConns.push(toId); onUpdatePoiConnections(fromId, fromConns); }
            if (connectionState.type === 'two-way' && !toConns.includes(fromId)) { toConns.push(fromId); onUpdatePoiConnections(toId, toConns); }
            addLog(`Created ${connectionState.type} connection: ${POIS[fromId]?.name || fromId} -> ${POIS[toId]?.name || toId}`);
            setConnectionState({ fromPoiId: null, type: null });
            return;
        }
        if (e.ctrlKey || e.altKey) {
            e.preventDefault(); e.stopPropagation();
            if (connectionState.fromPoiId) {
                if ((e.ctrlKey && connectionState.type === 'one-way') || (e.altKey && connectionState.type === 'two-way')) {
                    addLog('Cannot mix connection types. Cancel the current connection first.');
                    return;
                }
            }
            const type = e.ctrlKey ? 'two-way' : 'one-way';
            setConnectionState({ fromPoiId: poiId, type });
            return;
        }
        e.preventDefault(); e.stopPropagation();
        setDraggedItemId(id);
    };

    const onMapMouseDown = (e: React.MouseEvent) => {
        if (connectionState.fromPoiId) {
            setConnectionState({ fromPoiId: null, type: null });
            return;
        }
        if (e.target instanceof HTMLElement && e.target.closest('[data-draggable="true"]')) return;
        setIsDragging(true);
        dragStart.current = { x: e.clientX - view.x, y: e.clientY - view.y };
        if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.cursor = 'grabbing';
    };

    const onMouseUpOrLeave = (e: React.MouseEvent | React.TouchEvent) => {
        if(isDragging) {
            setIsDragging(false);
            if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.cursor = 'grab';
            }
        }
    };
    
    const zoomIn = () => setView(v => ({ ...v, zoom: Math.min(16, v.zoom * 1.5) }));
    const zoomOut = () => setView(v => ({ ...v, zoom: Math.max(0.25, v.zoom / 1.5) }));
    
    const { poisToDisplay, regionsToDisplay, dungeonsToDisplay, phantomExits, mapTitle } = useMemo(() => {
        const allPois = Object.values(POIS);

        if (isWorldView) {
            return {
                poisToDisplay: showAllPois ? allPois : allPois.filter(p => {
                    const region = REGIONS[p.regionId];
                    return region?.type !== 'city' && region?.type !== 'dungeon';
                }),
                regionsToDisplay: Object.values(REGIONS).filter(r => r.type === 'city'),
                dungeonsToDisplay: Object.values(REGIONS).filter(r => r.type === 'dungeon'),
                phantomExits: [],
                mapTitle: 'World Map'
            };
        }
        const cityPois = allPois.filter(p => p.regionId === activeMapRegionId);
        const exits: { navigationId: string; gateName: string; displayName: string; x: number; y: number }[] = [];
        const addedGateIds = new Set<string>();
        cityPois.forEach(internalPoi => {
            (internalPoi.connections ?? []).forEach(connId => {
                const externalPoi = POIS[connId];
                if (externalPoi && externalPoi.regionId !== activeMapRegionId && !addedGateIds.has(externalPoi.id)) {
                    const worldMapDestinationId = (externalPoi.connections ?? []).find(destId => destId !== internalPoi.id && POIS[destId] && !POIS[destId].id.includes('_gate'));
                    if (worldMapDestinationId) {
                        addedGateIds.add(externalPoi.id);
                        const destinationPoi = POIS[worldMapDestinationId];
                        if (externalPoi.cityMapX !== undefined && externalPoi.cityMapY !== undefined) {
                            exits.push({ navigationId: externalPoi.id, gateName: externalPoi.name, displayName: destinationPoi.name, x: externalPoi.cityMapX, y: externalPoi.cityMapY });
                        }
                    }
                }
            });
        });
        return { poisToDisplay: cityPois, regionsToDisplay: [], dungeonsToDisplay: [], phantomExits: exits, mapTitle: `${REGIONS[activeMapRegionId]?.name || 'Region'} Map` };
    }, [isWorldView, activeMapRegionId, showAllPois]);

    const handleMouseEnter = (e: React.MouseEvent, item: POI | Region | { name: string, description?: string }) => {
        if (isMapManagerEnabled && draggedItemId) return;
        const isRegion = 'entryPoiId' in item;
        const coords = isMapManagerEnabled && 'id' in item ? (isRegion ? regionCoordinates?.[(item as Region).id] : poiCoordinates?.[(item as POI).id]) : null;
        const tooltipContent = (
            <div>
                <p className="font-bold text-yellow-300">{item.name}</p>
                {'description' in item && item.description && <p className="text-sm text-gray-300">{item.description}</p>}
                {isMapManagerEnabled && coords && <div className="mt-1 pt-1 border-t border-gray-600"><p className="text-xs font-mono text-cyan-400">X: {coords.x}, Y: {coords.y}</p></div>}
            </div>
        );
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };
    
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b-2 border-gray-600">
                    <h1 className="text-3xl font-bold text-yellow-400">{mapTitle}</h1>
                    <div>
                        {!isWorldView && <Button onClick={() => setActiveMapRegionId('world')} size="sm" className="mr-4">Back to World</Button>}
                        <Button onClick={onClose} size="sm">Close</Button>
                    </div>
                </div>
                
                <div 
                    ref={mapContainerRef}
                    className="flex-grow bg-cover bg-center relative overflow-hidden cursor-grab"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505236755279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop')` }}
                    onWheel={onWheel}
                    onMouseDown={onMapMouseDown}
                    onMouseUp={onMouseUpOrLeave}
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
                                const startPoiData = isMapManagerEnabled ? { ...startPoi, ...poiCoordinates?.[startPoi.id] } : startPoi;
                                const startConns = isMapManagerEnabled ? poiConnections?.[startPoi.id] ?? startPoiData.connections : startPoiData.connections;
                                if (!startConns) return null;

                                return startConns.map(connId => {
                                    const endPoi = POIS[connId];
                                    if (!endPoi || startPoi.id > endPoi.id) return null;
                                    const endPoiData = isMapManagerEnabled ? { ...endPoi, ...poiCoordinates?.[endPoi.id] } : endPoi;
                                    const endRegion = REGIONS[endPoiData.regionId];
                                    const isEndPoiInCurrentView = poisToDisplay.some(p => p.id === endPoiData.id);
                                    const isEndPoiACityIcon = isWorldView && (endRegion?.type === 'city' || endRegion?.type === 'dungeon');
                                    if (!isEndPoiInCurrentView && !isEndPoiACityIcon) return null;
                                    const isUnlocked = showAllPois || (unlockedPois.includes(startPoi.id) && unlockedPois.includes(endPoi.id));
                                    const endCoords = isEndPoiACityIcon ? (isMapManagerEnabled ? regionCoordinates?.[endRegion.id] : endRegion) : endPoiData;
                                    if (!endCoords) return null;
                                    return <line key={`${startPoi.id}-${endPoi.id}`} x1={startPoiData.x} y1={startPoiData.y} x2={endCoords.x} y2={endCoords.y} stroke={isUnlocked ? 'rgba(200, 200, 200, 0.4)' : 'rgba(100, 100, 100, 0.4)'} strokeWidth={2 / view.zoom} strokeDasharray={isUnlocked ? 'none' : `${6 / view.zoom} ${4 / view.zoom}`} />;
                                });
                            })}
                             {!isWorldView && poisToDisplay.map(startPoi => (
                                (isMapManagerEnabled ? poiConnections?.[startPoi.id] ?? startPoi.connections : startPoi.connections)?.map(connId => {
                                    const phantomExit = phantomExits.find(exit => exit.navigationId === connId);
                                    if (phantomExit) {
                                        const isUnlocked = unlockedPois.includes(startPoi.id) && unlockedPois.includes(connId);
                                        const startCoords = isMapManagerEnabled ? poiCoordinates?.[startPoi.id] : startPoi;
                                        if (!startCoords) return null;
                                        return <line key={`${startPoi.id}-${connId}-exit`} x1={startCoords.x} y1={startCoords.y} x2={phantomExit.x} y2={phantomExit.y} stroke={isUnlocked ? 'rgba(200, 200, 200, 0.4)' : 'rgba(100, 100, 100, 0.4)'} strokeWidth={2 / view.zoom} strokeDasharray={isUnlocked ? 'none' : `${6 / view.zoom} ${4 / view.zoom}`} />;
                                    } return null;
                                })
                            ))}
                        </svg>

                        {regionsToDisplay.map(region => {
                            const isCurrent = POIS[currentPoiId]?.regionId === region.id;
                            const isUnlocked = showAllPois || unlockedPois.includes(region.entryPoiId);
                            const coords = isMapManagerEnabled ? regionCoordinates?.[region.id] : region;
                            if (!coords) return null;
                            const canClick = isWorldView && isUnlocked;
                            const cursorClass = isMapManagerEnabled ? 'cursor-move' : (canClick ? 'cursor-pointer' : 'cursor-default');

                            return (
                                 <div
                                    key={region.id}
                                    data-draggable={isMapManagerEnabled}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${cursorClass}`}
                                    style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
                                    onMouseDown={(e) => {
                                        nodeDragStart.current = { x: e.clientX, y: e.clientY };
                                        if (isMapManagerEnabled) handleNodeMouseDown(e, region.id, true);
                                    }}
                                    onClick={(e) => {
                                        setTooltip(null);
                                        if (isMapManagerEnabled) {
                                            const dx = Math.abs(e.clientX - nodeDragStart.current.x);
                                            const dy = Math.abs(e.clientY - nodeDragStart.current.y);
                                            if (dx > 5 || dy > 5) return;
                                        }
                                        if (canClick) setActiveMapRegionId(region.id);
                                    }} 
                                    onMouseEnter={(e) => handleMouseEnter(e, region)}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    <img src="https://api.iconify.design/game-icons:capitol.svg" alt={region.name} className={`filter invert transition-opacity ${isUnlocked ? 'opacity-80 group-hover:opacity-100' : 'opacity-30'}`} style={{width: `${40 / view.zoom}px`, height: `${40 / view.zoom}px`}} />
                                    {isCurrent && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-yellow-400 animate-pulse" style={{width: `${50/view.zoom}px`, height: `${50/view.zoom}px`}}></div>}
                                </div>
                            )
                        })}
                        
                        {dungeonsToDisplay.map(dungeon => {
                            const entryPoi = POIS[dungeon.entryPoiId];
                            if (!entryPoi) return null;
                            const isUnlocked = showAllPois || unlockedPois.includes(entryPoi.id);
                            const coords = isMapManagerEnabled ? poiCoordinates?.[entryPoi.id] : entryPoi;
                            if (!coords) return null;
                            const canClick = isMapManagerEnabled;
                            const cursorClass = canClick ? 'cursor-pointer' : 'cursor-default';
                            
                            return (
                                 <div
                                    key={dungeon.id}
                                    data-draggable={isMapManagerEnabled}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${isMapManagerEnabled ? 'cursor-move' : cursorClass}`}
                                    style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
                                    onMouseDown={(e) => {
                                        nodeDragStart.current = { x: e.clientX, y: e.clientY };
                                        if (isMapManagerEnabled) handleNodeMouseDown(e, entryPoi.id, false);
                                    }}
                                    onClick={(e) => {
                                        setTooltip(null);
                                        if (isMapManagerEnabled) {
                                            const dx = Math.abs(e.clientX - nodeDragStart.current.x);
                                            const dy = Math.abs(e.clientY - nodeDragStart.current.y);
                                            if (dx > 5 || dy > 5) return;
                                        }
                                        if (canClick) setActiveMapRegionId(dungeon.id);
                                    }}
                                    onMouseEnter={(e) => handleMouseEnter(e, { ...entryPoi, name: dungeon.name })}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    <img src="https://api.iconify.design/game-icons:cave-entrance.svg" alt={dungeon.name} className={`filter invert transition-opacity ${isUnlocked ? 'opacity-80 group-hover:opacity-100' : 'opacity-30'}`} style={{width: `${40 / view.zoom}px`, height: `${40 / view.zoom}px`}} />
                                </div>
                            )
                        })}

                        {poisToDisplay.map(poi => {
                            const isCurrent = poi.id === currentPoiId;
                            const isUnlocked = showAllPois || unlockedPois.includes(poi.id);
                            const dotColorClass = isCurrent ? "bg-yellow-400" : (isUnlocked ? "bg-green-400" : "bg-gray-600");
                            const coords = isMapManagerEnabled ? poiCoordinates?.[poi.id] : poi;
                            if (!coords) return null;
                            return (
                                <div key={poi.id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ top: `${coords.y}px`, left: `${coords.x}px` }} >
                                    <div data-draggable={isMapManagerEnabled} className={`relative rounded-full hover:scale-150 ${isMapManagerEnabled ? 'cursor-move' : ''} ${isUnlocked && !isMapManagerEnabled ? 'cursor-pointer' : ''} transition-transform duration-200`} style={{ width: `${12 / view.zoom}px`, height: `${12 / view.zoom}px` }} onMouseDown={(e) => handleNodeMouseDown(e, poi.id, false)} onClick={() => {if (!isMapManagerEnabled && isUnlocked) { onNavigate(poi.id); setTooltip(null); }}} onMouseEnter={(e) => handleMouseEnter(e, poi)} onMouseLeave={() => setTooltip(null)} >
                                        <div className={`w-full h-full rounded-full ${dotColorClass}`}></div>
                                        {isCurrent && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-yellow-400 animate-pulse" style={{width: `${20/view.zoom}px`, height: `${20/view.zoom}px`}}></div>}
                                    </div>
                                </div>
                            );
                        })}
                        
                         {phantomExits.map(exit => (
                            <div key={`exit-${exit.navigationId}`} className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group" style={{ top: `${exit.y}px`, left: `${exit.x}px` }} onClick={() => { onNavigate(exit.navigationId); setTooltip(null); }} onMouseEnter={(e) => handleMouseEnter(e, { name: exit.gateName, description: `Exit to world map. Leads towards ${exit.displayName}.` })} onMouseLeave={() => setTooltip(null)} >
                                <img src="https://api.iconify.design/game-icons:exit-door.svg" alt={`To ${exit.displayName}`} className="filter invert opacity-80 group-hover:opacity-100 transition-opacity" style={{width: `${32 / view.zoom}px`, height: `${32 / view.zoom}px`}} />
                            </div>
                        ))}
                        {deathMarker && POIS[deathMarker.poiId] && (
                            <div
                                key="death-marker"
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                                style={{
                                    top: `${(isWorldView ? (isMapManagerEnabled && poiCoordinates ? poiCoordinates[deathMarker.poiId]?.y : POIS[deathMarker.poiId].y) : POIS[deathMarker.poiId].cityMapY) ?? 0}px`,
                                    left: `${(isWorldView ? (isMapManagerEnabled && poiCoordinates ? poiCoordinates[deathMarker.poiId]?.x : POIS[deathMarker.poiId].x) : POIS[deathMarker.poiId].cityMapX) ?? 0}px`
                                }}
                            >
                                <img src="https://api.iconify.design/game-icons:tombstone.svg" alt="Death Location"
                                    className="filter invert opacity-90"
                                    style={{ width: `${32 / view.zoom}px`, height: `${32 / view.zoom}px` }} />
                                <span 
                                    className="text-xs font-bold text-white bg-black/50 px-1 rounded whitespace-nowrap"
                                    style={{ transform: `scale(${1 / view.zoom}) translateY(-${4 / view.zoom}px)` }}
                                >
                                    {formatTime(deathMarker.timeRemaining)}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {isMapManagerEnabled && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"><Button onClick={onCommitMapChanges} variant="primary">Commit Changes</Button></div>}

                    <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
                        <Button onClick={zoomIn} size="sm" className="w-8 h-8 text-lg">+</Button>
                        <Button onClick={zoomOut} size="sm" className="w-8 h-8 text-lg">-</Button>
                        <Button onClick={centerOnCurrentLocation} size="sm" className="w-8 h-8 text-xs">Center</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpandedMapView;