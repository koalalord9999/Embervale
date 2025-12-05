
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WorldEntity } from './worldData';
import { meadowdaleGrid, meadowdaleEntities } from './world/meadowdale';
import { isoToScreen, screenToIso, TILE_WIDTH, TILE_HEIGHT } from './isoUtils';
import Button from '../components/common/Button';
import { TILE_TYPES } from './tileData';

const MapEditor: React.FC<{ onClose: () => void; ui: any }> = ({ onClose, ui }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState(() => JSON.parse(JSON.stringify(meadowdaleGrid)));
    const [entities, setEntities] = useState(() => JSON.parse(JSON.stringify(meadowdaleEntities)));
    
    const [view, setView] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStart = useRef({ x: 0, y: 0 });

    const [tool, setTool] = useState<'brush' | 'entity'>('brush');
    const [brushType, setBrushType] = useState(0);
    const [isPainting, setIsPainting] = useState(false);
    const [draggedEntity, setDraggedEntity] = useState<{ entity: WorldEntity, index: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const originX = canvas.width / 2 + view.x;
        const originY = 100 + view.y;

        for (let y = 0; y < grid[0].length; y++) {
            for (let x = 0; x < grid.length; x++) {
                const screenPos = isoToScreen(x, y, originX, originY);
                ctx.beginPath();
                ctx.moveTo(screenPos.x, screenPos.y);
                ctx.lineTo(screenPos.x + TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
                ctx.lineTo(screenPos.x, screenPos.y + TILE_HEIGHT);
                ctx.lineTo(screenPos.x - TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
                ctx.closePath();

                const tileType = TILE_TYPES.find(t => t.id === grid[x][y]);
                ctx.fillStyle = tileType ? tileType.color : 'magenta';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.stroke();
            }
        }

        entities.forEach((entity: WorldEntity) => {
            const screenPos = isoToScreen(entity.x, entity.y, originX, originY);
            ctx.fillStyle = entity.color;
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y + TILE_HEIGHT / 2 - 10, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(entity.name, screenPos.x, screenPos.y + TILE_HEIGHT / 2 - 25);
        });

    }, [grid, entities, view]);

    const getGridPosFromEvent = (e: React.MouseEvent): { x: number, y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        const originX = canvas.width / 2 + view.x;
        const originY = 100 + view.y;
        const gridPos = screenToIso(mouseX, mouseY, originX, originY);
        if (gridPos.x < 0 || gridPos.x >= grid.length || gridPos.y < 0 || gridPos.y >= grid[0].length) return null;
        return gridPos;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (e.button === 1) { // Middle mouse button
            e.preventDefault();
            setIsPanning(true);
            panStart.current = { x: e.clientX - view.x, y: e.clientY - view.y };
            canvas.style.cursor = 'grabbing';
            return;
        }

        if (e.button === 0) { // Left mouse button
            const gridPos = getGridPosFromEvent(e);
            if (!gridPos) return;

            if (tool === 'brush') {
                setIsPainting(true);
                const newGrid = [...grid];
                newGrid[gridPos.x] = [...newGrid[gridPos.x]];
                newGrid[gridPos.x][gridPos.y] = brushType;
                setGrid(newGrid);
            } else if (tool === 'entity') {
                const entityIndex = entities.findIndex((ent: WorldEntity) => ent.x === gridPos.x && ent.y === gridPos.y);
                if (entityIndex !== -1) {
                    setDraggedEntity({ entity: entities[entityIndex], index: entityIndex });
                }
            }
        }
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            setView(v => ({ ...v, x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y }));
            return;
        }

        if (isPainting && tool === 'brush') {
            const gridPos = getGridPosFromEvent(e);
            if (gridPos && grid[gridPos.x][gridPos.y] !== brushType) {
                 const newGrid = [...grid];
                newGrid[gridPos.x] = [...newGrid[gridPos.x]];
                newGrid[gridPos.x][gridPos.y] = brushType;
                setGrid(newGrid);
            }
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (e.button === 1) { // Middle mouse button
            setIsPanning(false);
            canvas.style.cursor = 'crosshair';
        }

        if (e.button === 0) { // Left mouse button
            setIsPainting(false);
            if (tool === 'entity' && draggedEntity) {
                const gridPos = getGridPosFromEvent(e);
                if (gridPos) {
                    const newEntities = [...entities];
                    newEntities[draggedEntity.index] = { ...draggedEntity.entity, x: gridPos.x, y: gridPos.y };
                    setEntities(newEntities);
                }
                setDraggedEntity(null);
            }
        }
    };
    
    const handleMouseLeave = () => {
        const canvas = canvasRef.current;
        if (canvas) canvas.style.cursor = 'crosshair';
        setIsPanning(false);
        setIsPainting(false);
        setDraggedEntity(null);
    };

    const handleExport = () => {
        const gridString = `export const meadowdaleGrid = [\n${grid.map(col => `    [${col.join(', ')}]`).join(',\n')}\n];`;
        const entitiesString = `export const meadowdaleEntities: WorldEntity[] = [\n${entities.map((ent: any) => `    ${JSON.stringify(ent)}`).join(',\n')}\n];`;
        
        const fullContent = `import { WorldEntity } from '../worldData';\n\n// Tile Types...\n\n${gridString}\n\n${entitiesString}`;
        
        ui.setExportData({
            data: [{ filePath: 'prototyping/world/meadowdale.ts', content: fullContent }],
            title: "Export Meadowdale Data",
            copyButtonText: "Copy Code",
            onCopy: () => navigator.clipboard.writeText(fullContent),
        });
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/80 p-4 flex gap-4">
            <div className="w-64 bg-gray-800 p-4 rounded-lg border border-gray-600 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-yellow-400">Map Editor</h2>
                <div className="flex gap-2">
                    <Button onClick={() => setTool('brush')} variant={tool === 'brush' ? 'primary' : 'secondary'} size="sm" className="flex-1">Brush</Button>
                    <Button onClick={() => setTool('entity')} variant={tool === 'entity' ? 'primary' : 'secondary'} size="sm" className="flex-1">Entities</Button>
                </div>
                {tool === 'brush' && (
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-yellow-300">Brushes</h3>
                        {TILE_TYPES.map(tile => (
                            <button key={tile.id} onClick={() => setBrushType(tile.id)} className={`p-2 rounded text-left flex items-center gap-2 ${brushType === tile.id ? 'bg-yellow-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                <div style={{ backgroundColor: tile.color }} className="w-6 h-6 rounded border border-black" />
                                <span>{tile.name}</span>
                            </button>
                        ))}
                    </div>
                )}
                 {tool === 'entity' && (
                    <div className="text-sm text-gray-400 italic">
                        Click and drag an entity on the map to move it.
                    </div>
                )}
                <div className="mt-auto flex flex-col gap-2">
                    <Button onClick={handleExport} variant="primary">Export Data</Button>
                    <Button onClick={onClose} variant="secondary">Close Editor</Button>
                </div>
            </div>
            <div className="flex-grow bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                 <canvas
                    ref={canvasRef}
                    width={1200}
                    height={1200}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onContextMenu={(e) => e.preventDefault()}
                    className="cursor-crosshair"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </div>
        </div>
    );
};

export default MapEditor;
