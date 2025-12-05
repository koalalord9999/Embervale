
import { useRef, useEffect, useMemo } from 'react';
import { isoToScreen, TILE_WIDTH, TILE_HEIGHT } from '../isoUtils';
import { TILE_TYPES } from '../tileData';
import { PlayerModel } from '../playerModel';
import { HumanoidModel } from '../humanoidModel';
import { WorldEntity } from '../worldData';
import { Equipment, GroundItem, Item } from '../../types';
import { ITEMS } from '../../constants';
import { mulberry32, getTileSeed } from '../prng';
import { CanvasCombatState } from '../GameCanvas';
import HitSplat from '../../components/common/HitSplat';
import ReactDOM from 'react-dom';

interface HitSplatInfo {
    id: number; damage: number | 'miss'; target: 'player' | 'monster'; isPoison?: boolean; createdAt: number;
}

interface RendererDependencies {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    worldGrid: number[][];
    zoom: number;
    playerRef: React.RefObject<PlayerModel>;
    humanoidsRef: React.RefObject<HumanoidModel[]>;
    entities: WorldEntity[];
    equipment: Equipment;
    groundItems: Record<string, GroundItem[]>;
    hoverPos: { x: number, y: number } | null;
    hitsplats: HitSplatInfo[];
    onRemoveHitsplat: (id: number) => void;
    monsterRespawnTimers: Record<string, number>;
    combatState: CanvasCombatState | null;
    playerHp: number;
    playerMaxHp: number;
}

export const usePrototypeRenderer = (deps: RendererDependencies) => {
    const { canvasRef, worldGrid, zoom, playerRef, humanoidsRef, entities, equipment, groundItems, hoverPos, hitsplats, onRemoveHitsplat, monsterRespawnTimers, combatState } = deps;
    
    const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const isBackgroundReady = useRef(false);

    const WORLD_GRID_WIDTH = worldGrid.length;
    const WORLD_GRID_HEIGHT = worldGrid[0]?.length || 0;

    useEffect(() => {
        isBackgroundReady.current = false;
        const totalWidth = (WORLD_GRID_WIDTH + WORLD_GRID_HEIGHT) * TILE_WIDTH / 2;
        const totalHeight = (WORLD_GRID_WIDTH + WORLD_GRID_HEIGHT) * TILE_HEIGHT / 2 + TILE_HEIGHT * 2;

        if (!offscreenCanvasRef.current) {
            offscreenCanvasRef.current = document.createElement('canvas');
        }
        const offscreenCanvas = offscreenCanvasRef.current;
        offscreenCanvas.width = totalWidth;
        offscreenCanvas.height = totalHeight;
        
        const offCtx = offscreenCanvas.getContext('2d');
        if (!offCtx) return;
        
        const originX = totalWidth / 2;
        const originY = TILE_HEIGHT * 2;

        // Pass 1: Floors and Details
        for (let y = 0; y < WORLD_GRID_HEIGHT; y++) {
            for (let x = 0; x < WORLD_GRID_WIDTH; x++) {
                const screenPos = isoToScreen(x, y, originX, originY);
                const tileType = TILE_TYPES.find(t => t.id === worldGrid[x][y]);
                if (!tileType) continue;

                // Draw Floor
                offCtx.beginPath();
                offCtx.moveTo(screenPos.x, screenPos.y);
                offCtx.lineTo(screenPos.x + TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
                offCtx.lineTo(screenPos.x, screenPos.y + TILE_HEIGHT);
                offCtx.lineTo(screenPos.x - TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
                offCtx.closePath();
                offCtx.fillStyle = tileType.color;
                offCtx.fill();

                // Add procedural details
                const rand = mulberry32(getTileSeed(x, y));
                if (tileType.id === 0) { // Grass
                    for (let i = 0; i < 3; i++) {
                        offCtx.strokeStyle = `rgba(16, 185, 129, ${rand() * 0.5 + 0.3})`;
                        offCtx.lineWidth = 2;
                        offCtx.beginPath();
                        const bladeX = screenPos.x + (rand() * TILE_WIDTH) - TILE_WIDTH / 2;
                        const bladeY = screenPos.y + TILE_HEIGHT / 2 + (rand() * TILE_HEIGHT / 2);
                        offCtx.moveTo(bladeX, bladeY);
                        offCtx.lineTo(bladeX + (rand() * 4 - 2), bladeY - (rand() * 8 + 4));
                        offCtx.stroke();
                    }
                } else if (tileType.id === 3) { // Path
                    for (let i = 0; i < 5; i++) {
                        offCtx.fillStyle = `rgba(161, 161, 170, ${rand() * 0.3 + 0.1})`;
                        offCtx.beginPath();
                        const cobbleX = screenPos.x + (rand() * TILE_WIDTH * 0.8) - TILE_WIDTH * 0.4;
                        const cobbleY = screenPos.y + TILE_HEIGHT / 2 + (rand() * TILE_HEIGHT * 0.4);
                        offCtx.arc(cobbleX, cobbleY, rand() * 3 + 1, 0, Math.PI * 2);
                        offCtx.fill();
                    }
                }
            }
        }
        
        // Pass 2: Walls
        for (let y = 0; y < WORLD_GRID_HEIGHT; y++) {
            for (let x = 0; x < WORLD_GRID_WIDTH; x++) {
                const tileId = worldGrid[x][y];
                if (tileId !== 1 && tileId !== 2) continue;

                const screenPos = isoToScreen(x, y, originX, originY);
                const wallHeight = TILE_HEIGHT * (tileId === 1 ? 1.5 : 1.0);
                
                // Draw top face
                offCtx.fillStyle = '#78716c'; // stone-500
                if (tileId === 2) offCtx.fillStyle = '#a16207'; // amber-700 for wood
                offCtx.beginPath();
                offCtx.moveTo(screenPos.x, screenPos.y - wallHeight + TILE_HEIGHT);
                offCtx.lineTo(screenPos.x + TILE_WIDTH / 2, screenPos.y - wallHeight + TILE_HEIGHT / 2);
                offCtx.lineTo(screenPos.x, screenPos.y - wallHeight);
                offCtx.lineTo(screenPos.x - TILE_WIDTH / 2, screenPos.y - wallHeight + TILE_HEIGHT / 2);
                offCtx.closePath();
                offCtx.fill();

                // Check neighbor south
                const neighborS = y + 1 < WORLD_GRID_HEIGHT ? worldGrid[x][y + 1] : 0;
                if (neighborS !== 1 && neighborS !== 2) {
                    offCtx.fillStyle = '#57534e'; // stone-600
                    if (tileId === 2) offCtx.fillStyle = '#CCCCCC'; // off-white
                    offCtx.beginPath();
                    offCtx.moveTo(screenPos.x - TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
                    offCtx.lineTo(screenPos.x, screenPos.y + TILE_HEIGHT);
                    offCtx.lineTo(screenPos.x, screenPos.y - wallHeight + TILE_HEIGHT);
                    offCtx.lineTo(screenPos.x - TILE_WIDTH / 2, screenPos.y - wallHeight + TILE_HEIGHT / 2);
                    offCtx.closePath();
                    offCtx.fill();
                }
                
                // Check neighbor east
                const neighborE = x + 1 < WORLD_GRID_WIDTH ? worldGrid[x + 1][y] : 0;
                if (neighborE !== 1 && neighborE !== 2) {
                    offCtx.fillStyle = '#a8a29e'; // stone-400
                    if (tileId === 2) offCtx.fillStyle = '#EFE8DA'; // slightly darker off-white
                    offCtx.beginPath();
                    offCtx.moveTo(screenPos.x + TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
                    offCtx.lineTo(screenPos.x, screenPos.y + TILE_HEIGHT);
                    offCtx.lineTo(screenPos.x, screenPos.y - wallHeight + TILE_HEIGHT);
                    offCtx.lineTo(screenPos.x + TILE_WIDTH / 2, screenPos.y - wallHeight + TILE_HEIGHT / 2);
                    offCtx.closePath();
                    offCtx.fill();
                }
            }
        }


        isBackgroundReady.current = true;
    }, [worldGrid, WORLD_GRID_WIDTH, WORLD_GRID_HEIGHT]);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas || !playerRef.current || !humanoidsRef.current) return;
        const ctx = canvas.getContext('2d');
        if (!ctx || !isBackgroundReady.current) return;

        ctx.fillStyle = '#374151';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();

        const player = playerRef.current;
        const worldOriginX = (WORLD_GRID_WIDTH + WORLD_GRID_HEIGHT) * TILE_WIDTH / 4;
        const worldOriginY = TILE_HEIGHT * 2;
        const playerWorldPos = isoToScreen(player.visualX, player.visualY, worldOriginX, worldOriginY);
        
        ctx.translate(canvas.width / 2 - playerWorldPos.x * zoom, canvas.height / 2 - playerWorldPos.y * zoom);
        ctx.scale(zoom, zoom);
        
        if (offscreenCanvasRef.current) {
            ctx.drawImage(offscreenCanvasRef.current, 0, 0);
        }

        const allDrawables = [player as any, ...humanoidsRef.current];
        allDrawables.sort((a, b) => (a.visualY + a.visualX) - (b.visualY + b.visualX));
        
        allDrawables.forEach(drawable => {
            if (drawable instanceof PlayerModel) {
                drawable.draw(ctx, worldOriginX, worldOriginY, zoom, equipment);
            } else if (drawable instanceof HumanoidModel) {
                drawable.draw(ctx, worldOriginX, worldOriginY, zoom);
            }
            if (combatState) {
                const screenPos = isoToScreen(drawable.visualX, drawable.visualY, worldOriginX, worldOriginY);
                const x = screenPos.x;
                const y = screenPos.y - 15;
                const barWidth = 40;
                
                let currentHp, maxHp;
                if (drawable instanceof PlayerModel) {
                    currentHp = deps.playerHp;
                    maxHp = deps.playerMaxHp;
                } else if (drawable instanceof HumanoidModel && combatState.entity.id === drawable.id) {
                    currentHp = drawable.hp;
                    maxHp = drawable.maxHp;
                } else {
                    return;
                }
    
                const hpPercent = maxHp > 0 ? currentHp / maxHp : 0;
                
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(x - barWidth / 2, y - 5, barWidth, 5);
                ctx.fillStyle = 'red';
                ctx.fillRect(x - barWidth / 2, y - 5, barWidth * hpPercent, 5);
            }
        });
        
        if (hoverPos) {
            const screenPos = isoToScreen(hoverPos.x, hoverPos.y, worldOriginX, worldOriginY);
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2 / zoom;
            ctx.beginPath();
            ctx.moveTo(screenPos.x, screenPos.y);
            ctx.lineTo(screenPos.x + TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
            ctx.lineTo(screenPos.x, screenPos.y + TILE_HEIGHT);
            ctx.lineTo(screenPos.x - TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
            ctx.closePath();
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        if (player.path.length > 0) {
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
            ctx.lineWidth = 2 / zoom;
            ctx.beginPath();
            const startPos = isoToScreen(player.visualX, player.visualY, worldOriginX, worldOriginY);
            ctx.moveTo(startPos.x, startPos.y + TILE_HEIGHT / 2);
            player.path.forEach(p => {
                const screenP = isoToScreen(p.x, p.y, worldOriginX, worldOriginY);
                ctx.lineTo(screenP.x, screenP.y + TILE_HEIGHT / 2);
            });
            ctx.stroke();
        }
        
        ctx.restore();

        // Draw hitsplats over everything, in screen space
        hitsplats.forEach(splat => {
            const targetModel = splat.target === 'player'
                ? playerRef.current
                : humanoidsRef.current.find(h => combatState && h.id === combatState.entity.id);

            if (!targetModel) return;

            const targetWorldPos = isoToScreen(targetModel.visualX, targetModel.visualY, worldOriginX, worldOriginY);
            const targetScreenX = (targetWorldPos.x - (playerWorldPos.x - canvas.width / (2 * zoom))) * zoom;
            const targetScreenY = (targetWorldPos.y - (playerWorldPos.y - canvas.height / (2 * zoom))) * zoom;
            
            const timeSince = Date.now() - splat.createdAt;
            const yOffset = -(timeSince / 20); // Move up over time
            const opacity = 1 - (timeSince / 1500);

            if (opacity > 0) {
                ctx.save();
                ctx.font = 'bold 20px Arial';
                ctx.fillStyle = splat.damage === 'miss' ? 'cyan' : 'red';
                ctx.textAlign = 'center';
                ctx.globalAlpha = opacity;
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 4;
                ctx.fillText(String(splat.damage), targetScreenX, targetScreenY - 60 + yOffset);
                ctx.restore();
            }
        });

    };

    return { draw };
};
