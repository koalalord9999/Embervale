
import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { POI, Region, WorldState } from '../../types';
import { REGIONS, MAP_FEATURES } from '../../constants';
import { POIS } from '../../data/pois';
import { MAP_DIMENSIONS, CITY_MAP_DIMENSIONS } from '../../constants';
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
    const allPois = useMemo(() => POIS, []);

    useEffect(() => {
        if (!connectionState.fromPoiId || !isMapManagerEnabled) {
            setTooltip(null);
            return;
        }
    
        const handleMouseMove = (e: MouseEvent) => {
            const fromPoi = allPois[connectionState.fromPoiId!] || Object.values(allPois).find(p => p.id === REGIONS[connectionState.fromPoiId!]?.entryPoiId);
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
    }, [connectionState, hoveredInfo, setTooltip, isMapManagerEnabled, allPois]);
    
    const centerOnCurrentLocation = useCallback(() => {
        const poi = allPois[currentPoiId];
        const container = mapContainerRef.current;
        if (!poi || !container) return;
    
        let targetX, targetY, zoomLevel;
        
        if (isWorldView) {
            const region = REGIONS[poi.regionId];
            const isCity = region?.type === 'city' || region?.type === 'dungeon' || region?.type === 'underground';
            const effectivePoi = isMapManagerEnabled ? (isCity ? regionCoordinates?.[region.id] : poiCoordinates?.[poi.id]) : { x: isCity ? region.x : (poi.eX ?? poi.x), y: isCity ? region.y : (poi.eY ?? poi.y) };
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
                const cityEntryPoi = allPois[REGIONS[activeMapRegionId]?.entryPoiId];
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
    }, [allPois, currentPoiId, isWorldView, activeMapRegionId, poiCoordinates, regionCoordinates, isMapManagerEnabled]);

    const panToCurrentLocation = useCallback(() => {
        const poi = allPois[currentPoiId];
        const container = mapContainerRef.current;
        if (!poi || !container) return;
    
        let targetX, targetY;
        
        if (isWorldView) {
            const region = REGIONS[poi.regionId];
            const isCity = region?.type === 'city' || region?.type === 'dungeon' || region?.type === 'underground';
            const effectivePoi = isMapManagerEnabled ? (isCity ? regionCoordinates?.[region.id] : poiCoordinates?.[poi.id]) : { x: isCity ? region.x : (poi.eX ?? poi.x), y: isCity ? region.y : (poi.eY ?? poi.y) };
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
                const cityEntryPoi = allPois[REGIONS[activeMapRegionId]?.entryPoiId];
                targetX = cityEntryPoi?.cityMapX ?? CITY_MAP_DIMENSIONS.width / 2;
                targetY = cityEntryPoi?.cityMapY ?? CITY_MAP_DIMENSIONS.height / 2;
            }
        }
    
        setView(v => ({
            ...v,
            x: -targetX * v.zoom + container.offsetWidth / 2,
            y: -targetY * v.zoom + container.offsetHeight / 2,
        }));
    }, [allPois, currentPoiId, isWorldView, activeMapRegionId, poiCoordinates, regionCoordinates, isMapManagerEnabled]);
    
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
            const fromConns = [...(poiConnections[fromId] || allPois[fromId].connections)];
            const toConns = [...(poiConnections[toId] || allPois[toId].connections)];
            if (!fromConns.includes(toId)) { fromConns.push(toId); onUpdatePoiConnections(fromId, fromConns); }
            if (connectionState.type === 'two-way' && !toConns.includes(fromId)) { toConns.push(fromId); onUpdatePoiConnections(toId, toConns); }
            addLog(`Created ${connectionState.type} connection: ${allPois[fromId]?.name || fromId} -> ${allPois[toId]?.name || toId}`);
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
    
    // --- TOUCH HANDLING ---
    const onTouchStart = (e: React.TouchEvent) => {
        // Prevent default to stop page scrolling while dragging map
        // e.preventDefault(); // Removed to allow pinch zoom if implemented later, checking target
        if (e.target instanceof HTMLElement && e.target.closest('[data-draggable="true"]')) return;
        
        setIsDragging(true);
        const touch = e.touches[0];
        dragStart.current = { x: touch.clientX - view.x, y: touch.clientY - view.y };
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (isDragging) {
            e.preventDefault(); // Stop scrolling
            const touch = e.touches[0];
            setView(v => ({ ...v, x: touch.clientX - dragStart.current.x, y: touch.clientY - dragStart.current.y }));
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
    
    const { poisToDisplay, regionsToDisplay, dungeonsToDisplay, phantomExits, mapTitle } = useMemo(() => {
        if (isWorldView) {
            return {
                poisToDisplay: Object.values(allPois).filter(p => {
                    if (p.type === 'internal') {
                        return p.eX !== undefined && p.eY !== undefined;
                    }
                    const region = REGIONS[p.regionId];
                    if (region && (region.type === 'dungeon' || region.type === 'underground')) {
                        return p.id === region.entryPoiId;
                    }
                    return true;
                }),
                regionsToDisplay: Object.values(REGIONS).filter(r => r.type === 'city'),
                dungeonsToDisplay: Object.values(REGIONS).filter(r => r.type === 'dungeon' || r.type === 'underground'),
                phantomExits: [],
                mapTitle: 'World Map'
            };
        }
        const cityPois = Object.values(allPois).filter(p => p.regionId === activeMapRegionId);
        const exits: { navigationId: string; gateName: string; displayName: string; x: number; y: number }[] = [];
        const addedGateIds = new Set<string>();
        cityPois.forEach(internalPoi => {
            (internalPoi.connections ?? []).forEach(connId => {
                const externalPoi = allPois[connId];
                if (externalPoi && externalPoi.regionId !== activeMapRegionId && !addedGateIds.has(externalPoi.id)) {
                    const worldMapDestinationId = (externalPoi.connections ?? []).find(destId => destId !== internalPoi.id && allPois[destId] && !allPois[destId].id.includes('_gate'));
                    if (worldMapDestinationId) {
                        addedGateIds.add(externalPoi.id);
                        const destinationPoi = allPois[worldMapDestinationId];
                        if (externalPoi.cityMapX !== undefined && externalPoi.cityMapY !== undefined) {
                            exits.push({ navigationId: externalPoi.id, gateName: externalPoi.name, displayName: destinationPoi.name, x: externalPoi.cityMapX, y: externalPoi.cityMapY });
                        }
                    }
                }
            });
        });
        return { poisToDisplay: cityPois, regionsToDisplay: [], dungeonsToDisplay: [], phantomExits: exits, mapTitle: `${REGIONS[activeMapRegionId]?.name || 'Region'} Map` };
    }, [isWorldView, activeMapRegionId, allPois]);

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
    
    const currentPlayerPoi = allPois[currentPoiId];
    
    const getPoiWorldCoords = useCallback((poi: POI): { x: number; y: number } | null => {
        if (isMapManagerEnabled) {
            return poiCoordinates?.[poi.id] ?? poi;
        }

        if (poi.type === 'internal') {
            if (poi.eX !== undefined && poi.eY !== undefined) {
                return { x: poi.eX, y: poi.eY };
            }
            return null; // Don't show internal POIs on world map unless they have eX/eY
        }
        
        const region = REGIONS[poi.regionId];
        if (region && (region.type === 'dungeon' || region.type === 'underground')) {
            if (poi.id === region.entryPoiId) {
                return { x: poi.x, y: poi.y }; // Show the entrance
            }
            return null; // Hide other dungeon POIs
        }
        
        return { x: poi.x, y: poi.y }; // Show all other non-internal POIs
    }, [isMapManagerEnabled, poiCoordinates, regionCoordinates, allPois]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b-2 border-gray-700">
                    <h1 className="text-3xl font-bold text-yellow-400">{mapTitle}</h1>
                    <div>
                        {!isWorldView && <Button onClick={() => setActiveMapRegionId('world')} size="sm" className="mr-4">World Map</Button>}
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
                    // Mobile drag support
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onMouseUpOrLeave}
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
                            {isWorldView && MAP_FEATURES.map(feature => (
                                <path
                                    key={feature.id}
                                    d={feature.path}
                                    stroke={feature.strokeColor}
                                    strokeWidth={feature.strokeWidth / view.zoom}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ))}
                            {Object.values(allPois).map(startPoi => {
                                const connections = isMapManagerEnabled && poiConnections ? poiConnections[startPoi.id] : startPoi.connections;
                                return connections?.map(connId => {
                                    const endPoi = allPois[connId];
                                    if (!endPoi || startPoi.id > endPoi.id) return null;
                        
                                    let startCoords, endCoords;
                        
                                    if (isWorldView) {
                                        startCoords = getPoiWorldCoords(startPoi);
                                        endCoords = getPoiWorldCoords(endPoi);
                                    } else { // City/Dungeon View
                                        if (startPoi.regionId === activeMapRegionId) {
                                            startCoords = isMapManagerEnabled ? poiCoordinates?.[startPoi.id] : startPoi;
                                        } else {
                                            startCoords = null;
                                        }
                        
                                        if (endPoi.regionId === activeMapRegionId) {
                                            endCoords = isMapManagerEnabled ? poiCoordinates?.[endPoi.id] : endPoi;
                                        } else {
                                            const phantom = phantomExits.find(p => p.navigationId === endPoi.id);
                                            endCoords = phantom ? { x: phantom.x, y: phantom.y } : null;
                                        }
                                    }
                        
                                    if (!startCoords || !endCoords || (startCoords.x === endCoords.x && startCoords.y === endCoords.y)) {
                                        return null;
                                    }
                        
                                    const isUnlocked = showAllPois || (unlockedPois.includes(startPoi.id) && unlockedPois.includes(endPoi.id));
                                    
                                    return (
                                        <line 
                                            key={`${startPoi.id}-${endPoi.id}`}
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

                        {regionsToDisplay.map(region => {
                            const isCurrent = allPois[currentPoiId]?.regionId === region.id;
                            const isUnlocked = showAllPois || unlockedPois.includes(region.entryPoiId);
                            const coords = isMapManagerEnabled ? regionCoordinates?.[region.id] : region;
                            if (!coords) return null;
                            const canClick = isUnlocked && !isMapManagerEnabled;
                            const cursorClass = isMapManagerEnabled ? 'cursor-move' : (canClick ? 'cursor-pointer' : 'cursor-default');

                            return (
                                 <div
                                    key={region.id}
                                    data-draggable={isMapManagerEnabled}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${cursorClass}`}
                                    style={{ top: `${coords.y}px`, left: `${coords.x}px`, zIndex: 10 }}
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
                                    <img src="https://api.iconify.design/game-icons:capitol.svg" alt={region.name} className={`filter invert transition-opacity ${isUnlocked ? 'opacity-100' : 'opacity-30'}`} style={{width: `${40 / view.zoom}px`, height: `${40 / view.zoom}px`}} />
                                    {isCurrent && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-yellow-400 animate-pulse" style={{width: `${50/view.zoom}px`, height: `${50/view.zoom}px`}}></div>}
                                </div>
                            )
                        })}
                        
                        {dungeonsToDisplay.map(dungeon => {
                            const entryPoi = allPois[dungeon.entryPoiId];
                            if (!entryPoi) return null;
                            const isUnlocked = showAllPois || unlockedPois.includes(entryPoi.id);
                            const coords = isMapManagerEnabled ? poiCoordinates?.[entryPoi.id] : entryPoi;
                            if (!coords) return null;
                            const canClick = isUnlocked && !isMapManagerEnabled;
                            const cursorClass = isMapManagerEnabled ? 'cursor-move' : (canClick ? 'cursor-pointer' : 'cursor-default');
                            
                            return (
                                 <div
                                    key={dungeon.id}
                                    data-draggable={isMapManagerEnabled}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${cursorClass}`}
                                    style={{ top: `${coords.y}px`, left: `${coords.x}px`, zIndex: 10 }}
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
                                    <img src="https://api.iconify.design/game-icons:cave-entrance.svg" alt={dungeon.name} className={`filter invert transition-opacity ${isUnlocked ? 'opacity-100' : 'opacity-30'}`} style={{width: `${40 / view.zoom}px`, height: `${40 / view.zoom}px`}} />
                                </div>
                            )
                        })}

                        {poisToDisplay.map(poi => {
                            const isCurrent = poi.id === currentPoiId;
                            const isUnlocked = showAllPois || unlockedPois.includes(poi.id);
                            const dotColorClass = isCurrent ? "bg-yellow-400" : (isUnlocked ? "bg-green-400" : "bg-gray-600");
                            const coords = isMapManagerEnabled ? poiCoordinates?.[poi.id] : {
                                x: (isWorldView && poi.eX !== undefined) ? poi.eX : poi.x,
                                y: (isWorldView && poi.eY !== undefined) ? poi.eY : poi.y
                            };
                            if (!coords) return null;
                            const canClick = isUnlocked && !isMapManagerEnabled;
                            return (
                                <div key={poi.id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ top: `${coords.y}px`, left: `${coords.x}px` }} >
                                    <div data-draggable={isMapManagerEnabled} className={`relative rounded-full hover:scale-150 ${isMapManagerEnabled ? 'cursor-move' : ''} ${canClick ? 'cursor-pointer' : ''} transition-transform duration-200`} style={{ width: `${12 / view.zoom}px`, height: `${12 / view.zoom}px` }} onMouseDown={(e) => handleNodeMouseDown(e, poi.id, false)} onClick={() => {if (canClick) { onNavigate(poi.id); setTooltip(null); }}} onMouseEnter={(e) => handleMouseEnter(e, poi)} onMouseLeave={() => setTooltip(null)} >
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
                        {currentPlayerPoi && (
                             <div
                                key="current-player-location"
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{
                                    top: `${(isWorldView ? (isMapManagerEnabled && poiCoordinates ? poiCoordinates[currentPlayerPoi.id]?.y : currentPlayerPoi.eY ?? currentPlayerPoi.y) : (isMapManagerEnabled && poiCoordinates ? poiCoordinates[currentPlayerPoi.id]?.y : currentPlayerPoi.y)) ?? 0}px`,
                                    left: `${(isWorldView ? (isMapManagerEnabled && poiCoordinates ? poiCoordinates[currentPlayerPoi.id]?.x : currentPlayerPoi.eX ?? currentPlayerPoi.x) : (isMapManagerEnabled && poiCoordinates ? poiCoordinates[currentPlayerPoi.id]?.x : currentPlayerPoi.x)) ?? 0}px`,
                                    zIndex: 20
                                }}
                            >
                                <div className="relative rounded-full" style={{ width: `${12 / view.zoom}px`, height: `${12 / view.zoom}px` }}>
                                    <div className="w-full h-full rounded-full bg-yellow-400"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-yellow-400 animate-pulse" style={{width: `${20/view.zoom}px`, height: `${20/view.zoom}px`}}></div>
                                </div>
                            </div>
                        )}
                        
                        {deathMarker && allPois[deathMarker.poiId] && (
                            <div
                                key="death-marker"
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                                style={{
                                    top: `${(isWorldView ? (isMapManagerEnabled && poiCoordinates ? poiCoordinates[deathMarker.poiId]?.y : allPois[deathMarker.poiId].eY ?? allPois[deathMarker.poiId].y) : (isMapManagerEnabled && poiCoordinates ? poiCoordinates[deathMarker.poiId]?.y : allPois[deathMarker.poiId].y)) ?? 0}px`,
                                    left: `${(isWorldView ? (isMapManagerEnabled && poiCoordinates ? poiCoordinates[deathMarker.poiId]?.x : allPois[deathMarker.poiId].eX ?? allPois[deathMarker.poiId].x) : (isMapManagerEnabled && poiCoordinates ? poiCoordinates[deathMarker.poiId]?.x : allPois[deathMarker.poiId].x)) ?? 0}px`,
                                    zIndex: 20
                                }}
                            >
                                <img src="https://api.iconify.design/game-icons:tombstone.svg" alt="Death Location" className="filter invert opacity-90" style={{ width: `${32 / view.zoom}px`, height: `${32 / view.zoom}px` }} />
                                <span className="text-xs font-bold text-white bg-black/50 px-1 rounded whitespace-nowrap" style={{ transform: `scale(${1 / view.zoom}) translateY(-${4 / view.zoom}px)` }} >
                                    {formatTime(deathMarker.timeRemaining)}
                                </span>
                            </div>
                        )}
                    </div>
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
