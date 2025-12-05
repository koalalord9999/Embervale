import React, { useRef, useEffect, useState, useMemo } from 'react';
import { isoToScreen, screenToIso, TILE_WIDTH, TILE_HEIGHT } from '../../prototyping/isoUtils';
import { findPath } from '../../prototyping/pathfinding';
import { WorldEntity } from '../../prototyping/worldData';
import { PlayerModel } from '../../prototyping/playerModel';
import { HumanoidModel } from '../../prototyping/humanoidModel';

export interface CanvasCombatState {
    monsterId: string | null;
    playerHp: number;
    playerMaxHp: number;
    monsterHp: number;
    monsterMaxHp: number;
    hitsplats: Array<{
        id: number;
        damage: number | 'miss';
        target: 'player' | 'monster';
        timestamp: number;
        isPoison?: boolean;
    }>;
}

interface GameCanvasProps {
    addLog: (msg: string) => void;
    onInteract: (entity: WorldEntity) => void;
    onCombat: (entity: WorldEntity) => void;
    combatState: CanvasCombatState | null;
    worldGrid: number[][];
    entities: WorldEntity[];
    activeSkillingNodeId: string | null;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ addLog, onInteract, onCombat, combatState, worldGrid, entities, activeSkillingNodeId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const [hoverPos, setHoverPos] = useState<{ x: number, y: number } | null>(null);

    // Use HumanoidModel for player as well for consistency
    const playerRef = useRef(new HumanoidModel(20, 20, "Player", { shirtColor: '#3b82f6', hairStyle: 'short' }));
    const pendingInteractionRef = useRef<WorldEntity | null>(null);
    
    // Cache for entity models to avoid re-creating them every frame
    const modelCache = useRef<Record<string, HumanoidModel>>({});

    const lastFrameTime = useRef(0);
    const cameraOffsetRef = useRef({ x: 0, y: 0 });
    const WALL_HEIGHT = 32;
    const GRID_WIDTH = worldGrid.length;
    const GRID_HEIGHT = worldGrid[0].length;

    // Refs to hold latest props for render loop
    const combatStateRef = useRef(combatState);
    useEffect(() => { combatStateRef.current = combatState; }, [combatState]);
    
    // Initialize/Update Model Cache when entities change
    useEffect(() => {
        entities.forEach(entity => {
            if (entity.type === 'npc' && !modelCache.current[entity.id]) {
                // Generate consistent random traits based on ID hash or similar
                const hash = entity.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const colors = ['#ef4444', '#3b82f6', '#10b981', '#eab308', '#8b5cf6', '#6b7280'];
                const hairColors = ['#fef3c7', '#4b5563', '#78350f', '#000000'];
                
                modelCache.current[entity.id] = new HumanoidModel(entity.x, entity.y, entity.name, {
                    shirtColor: colors[hash % colors.length],
                    pantsColor: '#1f2937',
                    hairColor: hairColors[hash % hairColors.length],
                    hairStyle: hash % 2 === 0 ? 'short' : (hash % 3 === 0 ? 'long' : 'bald'),
                    facialHair: entity.name.includes('Man') ? (hash % 4 === 0 ? 'beard' : 'none') : 'none',
                    skinColor: '#fca5a5'
                });
            }
            // Update position if entity moved (though currently static)
            if (modelCache.current[entity.id]) {
                modelCache.current[entity.id].gridX = entity.x;
                modelCache.current[entity.id].gridY = entity.y;
                modelCache.current[entity.id].visualX = entity.x;
                modelCache.current[entity.id].visualY = entity.y;
            }
        });
    }, [entities]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        const render = (time: number) => {
            if (lastFrameTime.current === 0) lastFrameTime.current = time;
            const deltaTime = time - lastFrameTime.current;
            lastFrameTime.current = time;
            const now = Date.now();

            const player = playerRef.current;
            player.update(deltaTime);

            // Interaction Logic
            if (pendingInteractionRef.current && player.path.length === 0 && player.progress === 0) {
                const target = pendingInteractionRef.current;
                const dx = Math.abs(player.gridX - target.x);
                const dy = Math.abs(player.gridY - target.y);
                
                if (dx <= 1 && dy <= 1) {
                    if (target.monsterId) {
                         onCombat(target);
                    } else {
                         onInteract(target);
                    }
                    pendingInteractionRef.current = null;
                }
            }

            // Camera Logic
            const centerScreenX = canvas.width / 2;
            const centerScreenY = canvas.height / 2;
            const playerIso = isoToScreen(player.visualX, player.visualY, 0, 0);
            
            cameraOffsetRef.current = {
                x: centerScreenX - playerIso.x,
                y: centerScreenY - playerIso.y
            };

            const originX = cameraOffsetRef.current.x;
            const originY = cameraOffsetRef.current.y;

            // --- DRAW ---
            ctx.fillStyle = '#111827';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let y = 0; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    const screenPos = isoToScreen(x, y, originX, originY);
                    
                    if (screenPos.x < -TILE_WIDTH || screenPos.x > canvas.width + TILE_WIDTH ||
                        screenPos.y < -TILE_HEIGHT * 2 || screenPos.y > canvas.height + TILE_HEIGHT) {
                        continue;
                    }

                    ctx.beginPath();
                    ctx.moveTo(screenPos.x, screenPos.y);
                    ctx.lineTo(screenPos.x + TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
                    ctx.lineTo(screenPos.x, screenPos.y + TILE_HEIGHT);
                    ctx.lineTo(screenPos.x - TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
                    ctx.closePath();

                    const tileType = worldGrid[x][y];
                    
                    // Draw Base Tiles
                    if (tileType === 0) { ctx.fillStyle = '#10b981'; } 
                    else if (tileType === 3) { ctx.fillStyle = '#d6d3d1'; } 
                    else if (tileType === 4) { ctx.fillStyle = '#3b82f6'; } 
                    else if (tileType === 5) { ctx.fillStyle = '#78350f'; } 
                    else if (tileType === 1) { ctx.fillStyle = '#374151'; } 
                    else if (tileType === 2) { ctx.fillStyle = '#451a03'; } 
                    else { ctx.fillStyle = 'magenta'; }

                    ctx.fill();
                    
                    if (tileType === 0 || tileType === 3 || tileType === 5) {
                        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }

                    if (player.path.some(p => p.x === x && p.y === y)) {
                        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
                        ctx.fill();
                    }

                    if (hoverPos && hoverPos.x === x && hoverPos.y === y) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                        ctx.fill();
                        ctx.strokeStyle = 'white';
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        ctx.lineWidth = 1;
                    }

                    // Draw Walls
                    if (tileType === 1 || tileType === 2) {
                        const wallColorDark = tileType === 1 ? '#1f2937' : '#451a03';
                        const wallColorMid = tileType === 1 ? '#374151' : '#78350f';
                        const wallColorTop = tileType === 1 ? '#4b5563' : '#92400e';
                        const height = WALL_HEIGHT;

                        ctx.beginPath();
                        ctx.moveTo(screenPos.x - TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
                        ctx.lineTo(screenPos.x, screenPos.y + TILE_HEIGHT);
                        ctx.lineTo(screenPos.x, screenPos.y + TILE_HEIGHT - height);
                        ctx.lineTo(screenPos.x - TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2 - height);
                        ctx.closePath();
                        ctx.fillStyle = wallColorDark;
                        ctx.fill();

                        ctx.beginPath();
                        ctx.moveTo(screenPos.x, screenPos.y + TILE_HEIGHT);
                        ctx.lineTo(screenPos.x + TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
                        ctx.lineTo(screenPos.x + TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2 - height);
                        ctx.lineTo(screenPos.x, screenPos.y + TILE_HEIGHT - height);
                        ctx.closePath();
                        ctx.fillStyle = wallColorMid;
                        ctx.fill();

                        ctx.beginPath();
                        ctx.moveTo(screenPos.x, screenPos.y - height);
                        ctx.lineTo(screenPos.x + TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2 - height);
                        ctx.lineTo(screenPos.x, screenPos.y + TILE_HEIGHT - height);
                        ctx.lineTo(screenPos.x - TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2 - height);
                        ctx.closePath();
                        ctx.fillStyle = wallColorTop;
                        ctx.fill();
                    }

                    const entity = entities.find(ent => ent.x === x && ent.y === y);
                    if (entity) {
                         const entScreenPos = isoToScreen(entity.x, entity.y, originX, originY);
                         const centerX = entScreenPos.x;
                         const centerY = entScreenPos.y + TILE_HEIGHT / 2;
                         
                         let animOffsetY = 0;
                         if (entity.activityId && entity.activityId === activeSkillingNodeId) {
                             animOffsetY = Math.sin(now / 150) * 5; 
                         }

                         // Use Model if available, else fallback
                         if (entity.type === 'npc' && modelCache.current[entity.id]) {
                             modelCache.current[entity.id].draw(ctx, originX, originY);
                         } else {
                             // Basic Object Drawing
                             ctx.fillStyle = entity.color;
                             if (entity.name === 'Crate' || entity.name === 'Rock') {
                                 ctx.fillRect(centerX - 8, centerY - 20, 16, 16);
                             } else {
                                 ctx.beginPath();
                                 ctx.arc(centerX, centerY - 10 + animOffsetY, 10, 0, Math.PI * 2);
                                 ctx.fill();
                             }
                             
                             ctx.fillStyle = 'white';
                             ctx.font = '10px Arial';
                             ctx.textAlign = 'center';
                             ctx.fillText(entity.name, centerX, centerY - 25 + animOffsetY);
                         }

                         // Draw Monster Health Bar
                         if (combatStateRef.current && combatStateRef.current.monsterId === entity.monsterId) {
                             const { monsterHp, monsterMaxHp } = combatStateRef.current;
                             const pct = monsterMaxHp > 0 ? monsterHp / monsterMaxHp : 0;
                             const barWidth = 40;
                             const barHeight = 5;
                             const barX = centerX - barWidth / 2;
                             const barY = centerY - 55; // Higher to clear model heads

                             ctx.fillStyle = '#374151';
                             ctx.fillRect(barX, barY, barWidth, barHeight);
                             
                             ctx.fillStyle = pct > 0.5 ? '#10b981' : pct > 0.2 ? '#f59e0b' : '#ef4444';
                             ctx.fillRect(barX, barY, barWidth * pct, barHeight);
                         }
                    }
                }
            }

            player.draw(ctx, originX, originY);

            // Draw Player Health Bar
            if (combatStateRef.current) {
                const { playerHp, playerMaxHp } = combatStateRef.current;
                const pPos = isoToScreen(player.visualX, player.visualY, originX, originY);
                const centerX = pPos.x;
                const centerY = pPos.y + TILE_HEIGHT / 2;
                
                const pct = playerMaxHp > 0 ? playerHp / playerMaxHp : 0;
                const barWidth = 40;
                const barHeight = 5;
                const barX = centerX - barWidth / 2;
                const barY = centerY - 65; 

                ctx.fillStyle = '#374151';
                ctx.fillRect(barX, barY, barWidth, barHeight);
                ctx.fillStyle = '#10b981';
                ctx.fillRect(barX, barY, barWidth * pct, barHeight);
            }

            // Draw Hitsplats
            if (combatStateRef.current) {
                const { hitsplats, monsterId } = combatStateRef.current;
                
                hitsplats.forEach(splat => {
                    const age = now - splat.timestamp;
                    if (age > 1000) return;

                    let targetX = 0;
                    let targetY = 0;

                    if (splat.target === 'player') {
                        const pPos = isoToScreen(player.visualX, player.visualY, originX, originY);
                        targetX = pPos.x;
                        targetY = pPos.y + TILE_HEIGHT / 2;
                    } else {
                        const entity = entities.find(e => e.monsterId === monsterId);
                        if (entity) {
                             const ePos = isoToScreen(entity.x, entity.y, originX, originY);
                             targetX = ePos.x;
                             targetY = ePos.y + TILE_HEIGHT / 2;
                        }
                    }

                    if (targetX !== 0) {
                        const floatOffset = (age / 1000) * 30;
                        const alpha = 1 - (age / 1000);
                        const y = targetY - 50 - floatOffset;

                        ctx.save();
                        ctx.globalAlpha = alpha;
                        ctx.beginPath();
                        ctx.arc(targetX, y, 10, 0, Math.PI * 2);
                        if (splat.damage === 'miss') ctx.fillStyle = '#3b82f6'; 
                        else if (splat.isPoison) ctx.fillStyle = '#166534'; 
                        else ctx.fillStyle = '#ef4444'; 
                        ctx.fill();

                        ctx.fillStyle = 'white';
                        ctx.font = 'bold 12px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        const text = splat.damage === 'miss' ? '0' : splat.damage.toString();
                        ctx.fillText(text, targetX, y);
                        ctx.restore();
                    }
                });
            }

            animationId = requestAnimationFrame(render);
        };

        animationId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationId);
    }, [hoverPos, worldGrid, entities, activeSkillingNodeId]);

    const handleClick = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clickX = (e.clientX - rect.left) * scaleX;
        const clickY = (e.clientY - rect.top) * scaleY;
        const originX = cameraOffsetRef.current.x;
        const originY = cameraOffsetRef.current.y;
        const gridPos = screenToIso(clickX, clickY, originX, originY);
        const player = playerRef.current;

        const GRID_WIDTH = worldGrid.length;
        const GRID_HEIGHT = worldGrid[0].length;

        const isTileWalkable = (x: number, y: number) => {
            if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;
            const type = worldGrid[x][y];
            return type === 0 || type === 3 || type === 5; 
        };

        if (gridPos.x >= 0 && gridPos.x < GRID_WIDTH && gridPos.y >= 0 && gridPos.y < GRID_HEIGHT) {
            const clickedEntity = entities.find(ent => ent.x === gridPos.x && ent.y === gridPos.y);
            
            if (clickedEntity) {
                addLog(`Approaching ${clickedEntity.name}...`);
                const neighbors = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}, {x:-1, y:-1}, {x:1, y:-1}, {x:-1, y:1}, {x:1, y:1}];
                const validTiles = neighbors
                    .map(off => ({x: clickedEntity.x + off.x, y: clickedEntity.y + off.y}))
                    .filter(t => isTileWalkable(t.x, t.y));

                if (validTiles.length === 0) {
                    addLog("Cannot reach that!");
                    return;
                }
                validTiles.sort((a, b) => Math.hypot(player.gridX - a.x, player.gridY - a.y) - Math.hypot(player.gridX - b.x, player.gridY - b.y));

                const currentDist = Math.max(Math.abs(player.gridX - clickedEntity.x), Math.abs(player.gridY - clickedEntity.y));
                if (currentDist <= 1) {
                    if (clickedEntity.monsterId) onCombat(clickedEntity);
                    else onInteract(clickedEntity);
                    pendingInteractionRef.current = null;
                    return;
                }

                const targetTile = validTiles[0];
                const path = findPath(player.gridX, player.gridY, targetTile.x, targetTile.y, GRID_WIDTH, GRID_HEIGHT, isTileWalkable);
                if (path.length > 0) {
                    player.setPath(path);
                    pendingInteractionRef.current = clickedEntity;
                } else {
                    addLog("Cannot find a path to that entity.");
                }
                
            } else {
                pendingInteractionRef.current = null;
                if (isTileWalkable(gridPos.x, gridPos.y)) {
                    const path = findPath(player.gridX, player.gridY, gridPos.x, gridPos.y, GRID_WIDTH, GRID_HEIGHT, isTileWalkable);
                    if (path.length > 0) player.setPath(path);
                }
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        const originX = cameraOffsetRef.current.x;
        const originY = cameraOffsetRef.current.y;
        const gridPos = screenToIso(mouseX, mouseY, originX, originY);
        
        if (gridPos.x >= 0 && gridPos.x < GRID_WIDTH && gridPos.y >= 0 && gridPos.y < GRID_HEIGHT) {
            if (!hoverPos || hoverPos.x !== gridPos.x || hoverPos.y !== gridPos.y) setHoverPos(gridPos);
        } else {
            if (hoverPos !== null) setHoverPos(null);
        }
    };

    return (
        <canvas 
            ref={canvasRef} 
            width={800} 
            height={600} 
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverPos(null)}
            className="border border-gray-600 cursor-pointer"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default GameCanvas;