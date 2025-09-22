import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { POI, Region } from '../../types';
import { REGIONS, MAP_DIMENSIONS } from '../../constants';
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
}

const ExpandedMapView: React.FC<ExpandedMapViewProps> = ({ currentPoiId, unlockedPois, onNavigate, onClose, setTooltip, addLog, isMapManagerEnabled = false, poiCoordinates, regionCoordinates, onUpdatePoiCoordinate, poiConnections, onUpdatePoiConnections, showAllPois, onCommitMapChanges }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    const [connectionState, setConnectionState] = useState<{ fromPoiId: string | null; type: 'two-way' | 'one-way' | null }>({ fromPoiId: null, type: null });
    const [hoveredInfo, setHoveredInfo] = useState<{ id: string; name: string } | null>(null);

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

        const region = REGIONS[poi.regionId];
        const isCity = region?.type === 'city';
        const targetX = isCity ? (regionCoordinates ? regionCoordinates[region.id].x : region.x) : (poiCoordinates ? poiCoordinates[poi.id].x : poi.x);
        const targetY = isCity ? (regionCoordinates ? regionCoordinates[region.id].y : region.y) : (poiCoordinates ? poiCoordinates[poi.id].y : poi.y);
        
        const startingZoom = 2;
        setView({
            zoom: startingZoom,
            x: -targetX * startingZoom + container.offsetWidth / 2,
            y: -targetY * startingZoom + container.offsetHeight / 2,
        });
    }, [currentPoiId, poiCoordinates, regionCoordinates]);

    useEffect(() => {
        // If map manager is enabled, do not auto-center. Let the dev control the view.
        if (isMapManagerEnabled) {
            if (view.zoom === 1) { // Set a reasonable default zoom on first open
                setView(v => ({...v, zoom: 0.5}));
            }
            return;
        }
        centerOnCurrentLocation();
    }, [centerOnCurrentLocation, isMapManagerEnabled]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) { // Map panning
            setView(v => ({ ...v, x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }));
        } else if (draggedItemId && onUpdatePoiCoordinate) { // POI dragging
            const isRegion = REGIONS[draggedItemId] && REGIONS[draggedItemId].type === 'city';
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
    
        // This is the second click to form a connection
        if (connectionState.fromPoiId && connectionState.fromPoiId !== poiId) {
            e.preventDefault();
            e.stopPropagation();
            
            const fromId = connectionState.fromPoiId;
            const toId = poiId;
    
            const fromConns = [...(poiConnections[fromId] || POIS[fromId].connections)];
            const toConns = [...(poiConnections[toId] || POIS[toId].connections)];
    
            if (!fromConns.includes(toId)) {
                fromConns.push(toId);
                onUpdatePoiConnections(fromId, fromConns);
            }
    
            if (connectionState.type === 'two-way' && !toConns.includes(fromId)) {
                toConns.push(fromId);
                onUpdatePoiConnections(toId, toConns);
            }
            
            addLog(`Created ${connectionState.type} connection: ${POIS[fromId]?.name || fromId} -> ${POIS[toId]?.name || toId}`);
            setConnectionState({ fromPoiId: null, type: null });
            return;
        }
    
        if (e.ctrlKey || e.altKey) {
            e.preventDefault();
            e.stopPropagation();
            
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
    
        e.preventDefault();
        e.stopPropagation();
        setDraggedItemId(id);
    };

    const onMapMouseDown = (e: React.MouseEvent) => {
        if (connectionState.fromPoiId) {
            setConnectionState({ fromPoiId: null, type: null });
            return;
        }

        if (e.target instanceof HTMLElement && e.target.closest('[data-draggable="true"]')) {
            return;
        }
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
    
    const zoomIn = () => setView(v => ({ ...v, zoom: Math.min(16, v.zoom * 1.5) }));
    const zoomOut = () => setView(v => ({ ...v, zoom: Math.max(0.25, v.zoom / 1.5) }));
    
    const { poisToDisplay, regionsToDisplay, dungeonsToDisplay } = useMemo(() => {
        return {
            poisToDisplay: Object.values(POIS).filter(p => {
                const region = REGIONS[p.regionId];
                return region?.type !== 'city' && region?.type !== 'dungeon';
            }),
            regionsToDisplay: Object.values(REGIONS).filter(r => r.type === 'city'),
            dungeonsToDisplay: Object.values(REGIONS).filter(r => r.type === 'dungeon'),
        };
    }, []);

    const handleMouseEnter = (e: React.MouseEvent, item: POI | Region | { name: string, description?: string }) => {
        if (isMapManagerEnabled && draggedItemId) return;

        const isRegion = 'entryPoiId' in item; // Regions have entryPoiId, POIs don't.
        const coords = isMapManagerEnabled && 'id' in item
            ? (isRegion ? regionCoordinates?.[(item as Region).id] : poiCoordinates?.[(item as POI).id])
            : null;

        const tooltipContent = (
            <div>
                <p className="font-bold text-yellow-300">{item.name}</p>
                {'description' in item && item.description && <p className="text-sm text-gray-300">{item.description}</p>}
                {isMapManagerEnabled && coords && (
                    <div className="mt-1 pt-1 border-t border-gray-600">
                        <p className="text-xs font-mono text-cyan-400">
                            X: {coords.x}, Y: {coords.y}
                        </p>
                    </div>
                )}
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
                    <h1 className="text-3xl font-bold text-yellow-400">World Map</h1>
                    <Button onClick={onClose} size="sm">Close</Button>
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
                        width: `${MAP_DIMENSIONS.width}px`,
                        height: `${MAP_DIMENSIONS.height}px`,
                        transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
                        transformOrigin: '0 0',
                        willChange: 'transform',
                    }}>
                        <svg className="absolute top-0 left-0 pointer-events-none" width={MAP_DIMENSIONS.width} height={MAP_DIMENSIONS.height} style={{ overflow: 'visible' }}>
                            {poiCoordinates && Object.keys(poiCoordinates).map(startId => {
                                const startPoi = POIS[startId];
                                const startConns = poiConnections?.[startId] ?? startPoi?.connections;
                                if (!startPoi || !startConns) return null;

                                // Prevent drawing lines FROM internal POIs on the world map.
                                const startRegion = REGIONS[startPoi.regionId];
                                if (startPoi.type === 'internal' || startRegion?.type === 'city' || startRegion?.type === 'dungeon') {
                                    return null;
                                }

                                return startConns.map(connId => {
                                    const endPoi = POIS[connId];
                                    if (!endPoi || startId > connId) return null;
                                    
                                    let endCoords;
                                    const startCoords = poiCoordinates[startId];

                                    const endRegion = REGIONS[endPoi.regionId];
                                    const isEndPoiInternal = endPoi.type === 'internal' || endRegion?.type === 'city' || endRegion?.type === 'dungeon';
                                    
                                    if (isEndPoiInternal) {
                                        if (endRegion?.type === 'city' && regionCoordinates?.[endRegion.id]) {
                                            endCoords = regionCoordinates[endRegion.id];
                                        } else {
                                            // Don't draw lines to internal dungeon POIs or other non-city internal POIs on the world map.
                                            return null;
                                        }
                                    } else {
                                        if (!poiCoordinates[connId]) return null;
                                        endCoords = poiCoordinates[connId];
                                    }

                                    if (!startCoords || !endCoords) return null;

                                    const isUnlocked = showAllPois || (unlockedPois.includes(startId) && unlockedPois.includes(connId));

                                    return (
                                        <line
                                            key={`${startId}-${connId}`}
                                            x1={startCoords.x} y1={startCoords.y}
                                            x2={endCoords.x} y2={endCoords.y}
                                            stroke={isUnlocked ? 'rgba(200, 200, 200, 0.4)' : 'rgba(100, 100, 100, 0.4)'}
                                            strokeWidth={2 / view.zoom}
                                            strokeDasharray={isUnlocked ? 'none' : `${6 / view.zoom} ${4 / view.zoom}`}
                                        />
                                    );
                                });
                            })}
                        </svg>

                        {regionCoordinates && regionsToDisplay.map(region => {
                            const isCurrent = POIS[currentPoiId]?.regionId === region.id;
                            const coords = regionCoordinates[region.id];
                            return (
                                 <div
                                    key={region.id}
                                    data-draggable={isMapManagerEnabled}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${isMapManagerEnabled ? 'cursor-move' : 'cursor-default'}`}
                                    style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
                                    onMouseDown={(e) => handleNodeMouseDown(e, region.id, true)}
                                    onMouseEnter={(e) => handleMouseEnter(e, region)}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    <img src="https://api.iconify.design/game-icons:capitol.svg" alt={region.name} className={`filter invert transition-opacity opacity-80 group-hover:opacity-100`} style={{width: `${40 / view.zoom}px`, height: `${40 / view.zoom}px`}} />
                                    {isCurrent && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-yellow-400 animate-pulse" style={{width: `${50/view.zoom}px`, height: `${50/view.zoom}px`}}></div>}
                                </div>
                            )
                        })}
                        
                        {poiCoordinates && dungeonsToDisplay.map(dungeon => {
                            const entryPoi = POIS[dungeon.entryPoiId];
                            if (!entryPoi || !poiCoordinates[entryPoi.id]) return null;
                            const isUnlocked = showAllPois || unlockedPois.includes(entryPoi.id);
                            const coords = poiCoordinates[entryPoi.id];
                            return (
                                 <div
                                    key={dungeon.id}
                                    data-draggable={isMapManagerEnabled}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${isMapManagerEnabled ? 'cursor-move' : 'cursor-default'}`}
                                    style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
                                    onMouseDown={(e) => handleNodeMouseDown(e, entryPoi.id, false)}
                                    onMouseEnter={(e) => handleMouseEnter(e, { ...entryPoi, name: dungeon.name })}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    <img src="https://api.iconify.design/game-icons:cave-entrance.svg" alt={dungeon.name} className={`filter invert transition-opacity ${isUnlocked ? 'opacity-80 group-hover:opacity-100' : 'opacity-30'}`} style={{width: `${40 / view.zoom}px`, height: `${40 / view.zoom}px`}} />
                                </div>
                            )
                        })}

                        {poiCoordinates && poisToDisplay.map(poi => {
                            const isCurrent = poi.id === currentPoiId;
                            const isUnlocked = showAllPois || unlockedPois.includes(poi.id);
                            const dotColorClass = isCurrent ? "bg-yellow-400" : (isUnlocked ? "bg-green-400" : "bg-gray-600");
                            const coords = poiCoordinates[poi.id];
                            
                            return (
                                <div
                                    key={poi.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                    style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
                                >
                                    <div 
                                        data-draggable={isMapManagerEnabled}
                                        className={`relative rounded-full hover:scale-150 ${isMapManagerEnabled ? 'cursor-move' : 'cursor-default'} transition-transform duration-200`}
                                        style={{ width: `${12 / view.zoom}px`, height: `${12 / view.zoom}px` }}
                                        onMouseDown={(e) => handleNodeMouseDown(e, poi.id, false)}
                                        onMouseEnter={(e) => handleMouseEnter(e, poi)}
                                        onMouseLeave={() => setTooltip(null)}
                                    >
                                        <div className={`w-full h-full rounded-full ${dotColorClass}`}></div>
                                        {isCurrent && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-yellow-400 animate-pulse" style={{width: `${20/view.zoom}px`, height: `${20/view.zoom}px`}}></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {isMapManagerEnabled && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                            <Button onClick={onCommitMapChanges} variant="primary">Commit Changes</Button>
                        </div>
                    )}

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
