

import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { POI, Region, WorldState } from '../../types';
import { REGIONS, MAP_FEATURES } from '../../constants';
import { POIS } from '../../data/pois';
import { MAP_DIMENSIONS, CITY_MAP_DIMENSIONS } from '../../constants';
import { TooltipState } from '../../hooks/useUIState';
import Button from '../common/Button';

interface AtlasViewProps {
    currentPoiId: string;
    unlockedPois: string[];
    onClose: () => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    showAllPois: boolean;
    // FIX: Add deathMarker prop to fix type error in Game.tsx
    deathMarker: WorldState['deathMarker'];
}

const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const getRegionColor = (regionId: string, alpha: number = 0.4) => {
    let hash = 0;
    for (let i = 0; i < regionId.length; i++) {
        hash = regionId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsla(${h}, 70%, 50%, ${alpha})`;
};

// Helper function to compute the convex hull of a set of points (Monotone Chain algorithm)
const getConvexHull = (points: { x: number; y: number }[]): { x: number; y: number }[] => {
    if (points.length <= 2) return points;

    points.sort((a, b) => a.x - b.x || a.y - b.y);

    const crossProduct = (o: { x: number, y: number }, a: { x: number, y: number }, b: { x: number, y: number }) => {
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    };

    const lower: { x: number, y: number }[] = [];
    for (const p of points) {
        while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
            lower.pop();
        }
        lower.push(p);
    }

    const upper: { x: number, y: number }[] = [];
    for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
            upper.pop();
        }
        upper.push(p);
    }

    return lower.slice(0, -1).concat(upper.slice(0, -1));
};

// Helper function to find the centroid of a polygon
const getPolygonCentroid = (points: { x: number; y: number }[]): { x: number; y: number } => {
    let area = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const cross = p1.x * p2.y - p2.x * p1.y;
        area += cross;
        cx += (p1.x + p2.x) * cross;
        cy += (p1.y + p2.y) * cross;
    }
    const finalArea = area / 2;
    if (Math.abs(finalArea) < 1e-6) { // Avoid division by zero for degenerate polygons
        return points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    }
    return { x: cx / (6 * finalArea), y: cy / (6 * finalArea) };
};


const AtlasView: React.FC<AtlasViewProps> = ({ currentPoiId, unlockedPois, onClose, setTooltip, showAllPois, deathMarker }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState({ x: 0, y: 0, zoom: 0.5 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const centerOnAtlas = useCallback(() => {
        const container = mapContainerRef.current;
        if (!container) return;
        setView({
            zoom: 0.5,
            x: -MAP_DIMENSIONS.width * 0.5 + container.offsetWidth / 2,
            y: -MAP_DIMENSIONS.height * 0.5 + container.offsetHeight / 2,
        });
    }, []);

    useEffect(() => {
        centerOnAtlas();
    }, [centerOnAtlas]);
    
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
    
    const { regionPolygons, regionsToDisplay, dungeonsToDisplay } = useMemo(() => {
        const poisForHull = showAllPois 
            ? Object.values(POIS)
            : Object.values(POIS).filter(p => unlockedPois.includes(p.id));

        const poisByRegion: Record<string, POI[]> = {};

        // 1. Initial grouping of POIs by region
        poisForHull.forEach(poi => {
            const region = REGIONS[poi.regionId];
            if (region?.type !== 'city' && region?.type !== 'dungeon' && region?.type !== 'underground') {
                if (!poisByRegion[poi.regionId]) {
                    poisByRegion[poi.regionId] = [];
                }
                poisByRegion[poi.regionId].push(poi);
            }
        });

        // 2. Create a temporary structure to hold points for hull calculation
        const regionPoints: Record<string, { x: number; y: number }[]> = {};
        for (const regionId in poisByRegion) {
            regionPoints[regionId] = poisByRegion[regionId].map(p => ({ x: p.x, y: p.y }));
        }

        // 3. Find connections between regions and add "bridge" points
        poisForHull.forEach(startPoi => {
            const startRegion = REGIONS[startPoi.regionId];
            if (!startRegion || ['city', 'dungeon', 'underground'].includes(startRegion.type)) return;

            startPoi.connections.forEach(connId => {
                const endPoi = POIS[connId];
                if (!endPoi || (!showAllPois && !unlockedPois.includes(endPoi.id))) return;

                const endRegion = REGIONS[endPoi.regionId];
                if (!endRegion || ['city', 'dungeon', 'underground'].includes(endRegion.type) || endRegion.id === startRegion.id) return;
                
                // Add a midpoint to push the hulls together
                const bridgePoint = {
                    x: (startPoi.x + endPoi.x) / 2,
                    y: (startPoi.y + endPoi.y) / 2
                };

                if (regionPoints[startRegion.id]) {
                    regionPoints[startRegion.id].push(bridgePoint);
                }
                if (regionPoints[endRegion.id]) {
                    regionPoints[endRegion.id].push(bridgePoint);
                }
            });
        });

        // 4. Calculate hulls and centroids from the augmented point lists
        const polygons = Object.entries(regionPoints)
            .map(([regionId, points]) => {
                if (points.length < 3) return null;
                const hullPoints = getConvexHull(points);
                if (hullPoints.length < 3) return null;
                const centroid = getPolygonCentroid(hullPoints);
                const pointsString = hullPoints.map(p => `${p.x},${p.y}`).join(' ');
                return {
                    regionId,
                    name: REGIONS[regionId]?.name || 'Unknown Region',
                    points: pointsString,
                    centroid,
                };
            })
            .filter((p): p is { regionId: string; name: string; points: string; centroid: { x: number; y: number } } => p !== null);

        return {
            regionPolygons: polygons,
            regionsToDisplay: Object.values(REGIONS).filter(r => r.type === 'city'),
            dungeonsToDisplay: Object.values(REGIONS).filter(r => r.type === 'dungeon' || r.type === 'underground'),
        };
    }, [unlockedPois, showAllPois]);

    const handleMouseEnter = (e: React.MouseEvent, item: { name: string, description?: string }) => {
        const tooltipContent = (
            <div>
                <p className="font-bold text-yellow-300">{item.name}</p>
                {item.description && <p className="text-sm text-gray-300">{item.description}</p>}
            </div>
        );
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };
    
    const currentPlayerPoi = POIS[currentPoiId];

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 bg-gray-900/50 border-b-2 border-gray-700">
                    <h1 className="text-3xl font-bold text-yellow-400">World Atlas</h1>
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
                        <svg className="absolute top-0 left-0" width={MAP_DIMENSIONS.width} height={MAP_DIMENSIONS.height} style={{ overflow: 'visible' }}>
                            {regionPolygons.map(poly => (
                                <g key={poly.regionId} className="cursor-pointer" onMouseEnter={(e) => handleMouseEnter(e, { name: poly.name })} onMouseLeave={() => setTooltip(null)}>
                                     <polygon
                                        points={poly.points}
                                        fill={getRegionColor(poly.regionId, 0.4)}
                                        stroke={getRegionColor(poly.regionId, 0.8)}
                                        strokeWidth={4 / view.zoom}
                                    />
                                    <text
                                        x={poly.centroid.x}
                                        y={poly.centroid.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="white"
                                        fontSize={`${32 / view.zoom}px`}
                                        stroke="black"
                                        strokeWidth={1 / view.zoom}
                                        className="font-bold pointer-events-none"
                                    >
                                        {poly.name}
                                    </text>
                                </g>
                            ))}
                        </svg>

                        {regionsToDisplay.map(region => {
                            const isCurrent = POIS[currentPoiId]?.regionId === region.id;
                            const isUnlocked = showAllPois || unlockedPois.includes(region.entryPoiId);
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
                        
                        {dungeonsToDisplay.map(dungeon => {
                            const entryPoi = POIS[dungeon.entryPoiId];
                            if (!entryPoi) return null;
                            const isUnlocked = showAllPois || unlockedPois.includes(entryPoi.id);
                            const coords = { x: entryPoi.x, y: entryPoi.y };

                            return (
                                 <div
                                    key={dungeon.id}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${isUnlocked ? 'cursor-pointer' : 'cursor-default'}`}
                                    style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
                                    onMouseEnter={(e) => handleMouseEnter(e, {name: dungeon.name, description: entryPoi.description})}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    <img src="https://api.iconify.design/game-icons:cave-entrance.svg" alt={dungeon.name} className={`filter invert transition-opacity ${isUnlocked ? 'opacity-80 group-hover:opacity-100' : 'opacity-30'}`} style={{width: `${40 / view.zoom}px`, height: `${40 / view.zoom}px`}} />
                                </div>
                            )
                        })}

                        {currentPlayerPoi && (
                             <div
                                key="current-player-location"
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ top: `${currentPlayerPoi.y}px`, left: `${currentPlayerPoi.x}px` }}
                            >
                                <div 
                                    className="relative rounded-full transition-transform duration-200"
                                    style={{ width: `${12 / view.zoom}px`, height: `${12 / view.zoom}px` }}
                                >
                                    <div className="w-full h-full rounded-full bg-yellow-400"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-2 border-yellow-400 animate-pulse" style={{width: `${20/view.zoom}px`, height: `${20/view.zoom}px`}}></div>
                                </div>
                            </div>
                        )}
                        
                        {deathMarker && POIS[deathMarker.poiId] && (
                            <div
                                key="death-marker"
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                                style={{ top: `${POIS[deathMarker.poiId].y}px`, left: `${POIS[deathMarker.poiId].x}px` }}
                            >
                                <img src="https://api.iconify.design/game-icons:tombstone.svg" alt="Death Location" className="filter invert opacity-90" style={{ width: `${32 / view.zoom}px`, height: `${32 / view.zoom}px` }} />
                                <span 
                                    className="text-xs font-bold text-white bg-black/50 px-1 rounded whitespace-nowrap"
                                    style={{ transform: `scale(${1 / view.zoom}) translateY(-${4 / view.zoom}px)` }}
                                >
                                    {formatTime(deathMarker.timeRemaining)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
                        <Button onClick={zoomIn} size="sm" className="w-8 h-8 text-lg">+</Button>
                        <Button onClick={zoomOut} size="sm" className="w-8 h-8 text-lg">-</Button>
                        <Button onClick={centerOnAtlas} size="sm" className="w-8 h-8 text-xs">Reset</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AtlasView;