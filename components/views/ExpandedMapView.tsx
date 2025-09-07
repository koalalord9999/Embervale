
import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { POI, Region } from '../../types';
import { REGIONS, MAP_DIMENSIONS } from '../../constants';
import { POIS } from '../../data/pois';
import { TooltipState } from '../../hooks/useUIState';
import Button from '../common/Button';

interface ExpandedMapViewProps {
    currentPoiId: string;
    unlockedPois: string[];
    onClose: () => void;
    setTooltip: (tooltip: TooltipState | null) => void;
}

const ExpandedMapView: React.FC<ExpandedMapViewProps> = ({ currentPoiId, unlockedPois, onClose, setTooltip }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const centerOnCurrentLocation = useCallback(() => {
        const poi = POIS[currentPoiId];
        const container = mapContainerRef.current;
        if (!poi || !container) return;

        const region = REGIONS[poi.regionId];
        const isCity = region?.type === 'city';
        const targetX = isCity ? region.x : poi.x;
        const targetY = isCity ? region.y : poi.y;
        
        const startingZoom = 2;
        setView({
            zoom: startingZoom,
            x: -targetX * startingZoom + container.offsetWidth / 2,
            y: -targetY * startingZoom + container.offsetHeight / 2,
        });
    }, [currentPoiId]);

    useEffect(() => {
        centerOnCurrentLocation();
    }, [centerOnCurrentLocation]);

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

    const zoomIn = () => setView(v => ({ ...v, zoom: Math.min(16, v.zoom * 1.5) }));
    const zoomOut = () => setView(v => ({ ...v, zoom: Math.max(0.25, v.zoom / 1.5) }));
    
    const { poisToDisplay, regionsToDisplay } = useMemo(() => {
        return {
            poisToDisplay: Object.values(POIS).filter(p => {
                const region = REGIONS[p.regionId];
                return region?.type !== 'city' && region?.type !== 'dungeon';
            }),
            regionsToDisplay: Object.values(REGIONS).filter(r => r.type === 'city'),
        };
    }, []);

    const handleMouseEnter = (e: React.MouseEvent, item: POI | Region) => {
        const tooltipContent = (
            <div>
                <p className="font-bold text-yellow-300">{item.name}</p>
                {'description' in item && item.description && <p className="text-sm text-gray-300">{item.description}</p>}
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
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUpOrLeave}
                    onMouseMove={onMouseMove}
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
                            {poisToDisplay.map(startPoi => {
                                if (!startPoi) return null;
                                const startPoiData = POIS[startPoi.id] ?? startPoi;

                                return startPoiData.connections?.map(connId => {
                                    const endPoi = POIS[connId];
                                    if (!endPoi || startPoi.id > endPoi.id) return null;
                                    
                                    const endRegion = REGIONS[endPoi.regionId];
                                    const isEndPoiInCurrentView = poisToDisplay.some(p => p.id === endPoi.id);
                                    const isEndPoiACityIcon = endRegion?.type === 'city';
                                    
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
                        </svg>

                        {regionsToDisplay.map(region => {
                            const isCurrent = POIS[currentPoiId]?.regionId === region.id;
                            const isUnlocked = unlockedPois.includes(region.entryPoiId);
                            return (
                                <div
                                    key={region.id}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${isUnlocked ? 'cursor-pointer' : 'cursor-default'}`}
                                    style={{ top: `${region.y}px`, left: `${region.x}px` }}
                                    onMouseEnter={(e) => handleMouseEnter(e, region)}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    <img src="https://api.iconify.design/game-icons:capitol.svg" alt={region.name} className={`filter invert transition-opacity ${isUnlocked ? 'opacity-80 group-hover:opacity-100' : 'opacity-30'}`} style={{width: `${40 / view.zoom}px`, height: `${40 / view.zoom}px`}} />
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
                                        className="relative rounded-full"
                                        style={{ width: `${12 / view.zoom}px`, height: `${12 / view.zoom}px` }}
                                        onMouseEnter={(e) => isUnlocked && handleMouseEnter(e, poi)}
                                        onMouseLeave={() => setTooltip(null)}
                                    >
                                        <div className={`w-full h-full rounded-full ${dotColorClass}`}></div>
                                        {isCurrent && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-yellow-400 animate-pulse" style={{width: `${20/view.zoom}px`, height: `${20/view.zoom}px`}}></div>}
                                    </div>
                                </div>
                            );
                        })}
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
