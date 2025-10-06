import React, { useMemo } from 'react';
import { POIS } from '../../data/pois';
import Button from '../common/Button';
import { MONSTERS } from '../../constants';
import { TooltipState } from '../../hooks/useUIState';
import { POIActivity } from '../../types';

interface DungeonMapViewProps {
    regionId: string;
    mapTitle: string;
    currentPoiId: string;
    onClose: () => void;
    onNavigate: (poiId: string) => void;
    showAllPois: boolean;
    setTooltip: (tooltip: TooltipState | null) => void;
}

const DungeonMapView: React.FC<DungeonMapViewProps> = ({ regionId, mapTitle, currentPoiId, onClose, onNavigate, showAllPois, setTooltip }) => {
    const { poisInRegion, connections, viewBox } = useMemo(() => {
        const pois = Object.values(POIS).filter(p => p.regionId === regionId);
        
        if (pois.length === 0) {
            return { poisInRegion: [], connections: [], viewBox: '0 0 100 100' };
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        pois.forEach(p => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        });

        const width = maxX - minX;
        const height = maxY - minY;
        const padding = 80; // Increased padding for tooltips

        const conns: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
        pois.forEach(startPoi => {
            startPoi.connections.forEach(connId => {
                const endPoi = POIS[connId];
                if (endPoi && endPoi.regionId === regionId && startPoi.id < endPoi.id) {
                    conns.push({
                        x1: startPoi.x,
                        y1: startPoi.y,
                        x2: endPoi.x,
                        y2: endPoi.y,
                        key: `${startPoi.id}-${endPoi.id}`
                    });
                }
            });
        });

        return {
            poisInRegion: pois,
            connections: conns,
            viewBox: `${minX - padding} ${minY - padding} ${width + padding * 2} ${height + padding * 2}`,
        };
    }, [regionId]);

    const handleMouseEnter = (e: React.MouseEvent, poi: typeof poisInRegion[0]) => {
        const combatActivities = poi.activities.filter(a => a.type === 'combat') as Extract<POIActivity, { type: 'combat' }>[];
        
        const tooltipContent = (
            <div className="text-sm">
                <p className="font-bold text-yellow-300">{poi.name}</p>
                {combatActivities.length > 0 && (
                    <ul className="mt-2 pt-2 border-t border-gray-600">
                        {combatActivities.map((act, index) => {
                            const monster = MONSTERS[act.monsterId];
                            if (!monster) return null;

                            let aggressionColor = 'text-yellow-400'; // Passive
                            if (monster.aggressive && monster.alwaysAggressive) {
                                aggressionColor = 'text-red-500'; // Always Aggressive
                            } else if (monster.aggressive) {
                                aggressionColor = 'text-orange-400'; // Aggressive
                            }

                            return (
                                <li key={index} className={`flex justify-between items-center ${aggressionColor}`}>
                                    <span>{monster.name}</span>
                                    <span className="font-semibold ml-2">Lvl {monster.level}</span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );

        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <div className="flex flex-col h-full bg-gray-900/90 border-4 border-gray-600 rounded-lg shadow-xl text-gray-200 animate-fade-in">
            <div className="flex justify-between items-center p-4 border-b-2 border-gray-700">
                <h1 className="text-2xl font-bold text-yellow-400">{mapTitle}</h1>
                <Button onClick={onClose}>Close Map</Button>
            </div>
            <div className="flex-grow p-4 overflow-hidden relative">
                 <svg width="100%" height="100%" viewBox={viewBox} className="bg-black/20 rounded">
                    {/* Connections */}
                    {connections.map(conn => (
                        <line
                            key={conn.key}
                            x1={conn.x1}
                            y1={conn.y1}
                            x2={conn.x2}
                            y2={conn.y2}
                            stroke="rgba(156, 163, 175, 0.3)"
                            strokeWidth="2"
                        />
                    ))}
                    {/* POIs */}
                    {poisInRegion.map(poi => {
                        const isCurrent = poi.id === currentPoiId;
                        return (
                            <g 
                                key={poi.id} 
                                className={showAllPois ? 'cursor-pointer' : 'cursor-default'} 
                                onClick={() => { if (showAllPois) { onNavigate(poi.id); setTooltip(null); } }}
                                onMouseEnter={(e) => handleMouseEnter(e, poi)}
                                onMouseLeave={() => setTooltip(null)}
                            >
                                <circle
                                    cx={poi.x}
                                    cy={poi.y}
                                    r="8"
                                    fill={isCurrent ? '#FBBF24' : '#9CA3AF'}
                                    stroke="#111827"
                                    strokeWidth="2"
                                />
                                {isCurrent && (
                                     <circle
                                        cx={poi.x}
                                        cy={poi.y}
                                        r="12"
                                        fill="none"
                                        stroke="#FBBF24"
                                        strokeWidth="2"
                                     >
                                        <animate attributeName="r" from="12" to="16" dur="1.5s" begin="0s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                                     </circle>
                                )}
                            </g>
                        );
                    })}
                 </svg>
            </div>
        </div>
    );
};

export default DungeonMapView;
