import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { WorldEntity } from './worldData';
import { PlayerModel } from './playerModel';
import { HumanoidModel } from './humanoidModel';
import { Equipment, GroundItem, Item } from '../types';

import { usePrototypeActions, PendingAction } from './hooks/usePrototypeActions';
import { usePrototypeInput } from './hooks/usePrototypeInput';
import { usePrototypeRenderer } from './hooks/usePrototypeRenderer';
import { usePrototypeGameLoop } from './hooks/usePrototypeGameLoop';
import { TILE_WIDTH } from './isoUtils';

export interface CanvasCombatState {
    monsterId: string | null;
    entity: WorldEntity;
}

interface HitSplatInfo {
    id: number; damage: number | 'miss'; target: 'player' | 'monster'; isPoison?: boolean; createdAt: number;
}

interface GameCanvasProps {
    addLog: (msg: string) => void;
    onInteract: (entity: WorldEntity) => void;
    onCombat: (entity: WorldEntity) => void;
    onPickpocket: (entity: WorldEntity) => void;
    combatState: CanvasCombatState | null;
    worldGrid: number[][];
    entities: WorldEntity[];
    hitsplats: HitSplatInfo[];
    onRemoveHitsplat: (id: number) => void;
    groundItems: Record<string, GroundItem[]>;
    setContextMenu: (menu: any) => void;
    monsterRespawnTimers: Record<string, number>;
    onPickUpItem: (uniqueId: number) => void;
    onPlayerMove: (pos: { x: number, y: number }) => void;
    equipment: Equipment;
    humanoidsRef: React.RefObject<HumanoidModel[]>;
    playerRef: React.RefObject<PlayerModel>;
    onDisengage: () => void;
    runCombatTick: () => void;
    playerHp: number;
    playerMaxHp: number;
}

export interface GameCanvasHandles {
    startInteraction: (action: PendingAction) => void;
    startMonsterPath: (monsterId: string, targetPos: { x: number, y: number }) => void;
}

const GameCanvas = forwardRef<GameCanvasHandles, GameCanvasProps>((props, ref) => {
    const { addLog, onInteract, onCombat, onPickpocket, combatState, worldGrid, entities, hitsplats, onRemoveHitsplat, groundItems, setContextMenu, monsterRespawnTimers, onPickUpItem, onPlayerMove, equipment, humanoidsRef, playerRef, onDisengage, runCombatTick, playerHp, playerMaxHp } = props;
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [zoom, setZoom] = useState(1);

    const WORLD_GRID_WIDTH = worldGrid.length;
    const WORLD_GRID_HEIGHT = worldGrid[0]?.length || 0;

    const checkWalkable = useCallback((x: number, y: number): boolean => {
        if (x < 0 || x >= WORLD_GRID_WIDTH || y < 0 || y >= WORLD_GRID_HEIGHT) return false;
        const tileId = worldGrid[x][y];
        return tileId === 0 || tileId === 3 || tileId === 5;
    }, [worldGrid, WORLD_GRID_WIDTH, WORLD_GRID_HEIGHT]);

    const { startInteraction, checkAndExecuteAction, pendingActionRef } = usePrototypeActions({
        playerRef,
        humanoidsRef,
        checkWalkable,
        worldGridSize: { width: WORLD_GRID_WIDTH, height: WORLD_GRID_HEIGHT },
        addLog,
        onInteract,
        onCombat,
        onPickpocket,
        onPickUpItem,
        onPickUpAll: (items) => items.forEach(gi => onPickUpItem(gi.uniqueId)),
    });

    const onWalk = useCallback((path: {x:number, y:number}[]) => {
        if (playerRef.current) {
            pendingActionRef.current = null;
            playerRef.current.setPath(path);
        }
    }, [playerRef, pendingActionRef]);

    const { hoverPos } = usePrototypeInput({
        canvasRef,
        playerRef,
        zoom,
        checkWalkable,
        worldGridSize: { width: WORLD_GRID_WIDTH, height: WORLD_GRID_HEIGHT },
        humanoidsRef,
        entities,
        groundItems,
        combatState,
        monsterRespawnTimers,
        onWalk,
        onStartInteraction: startInteraction,
        setContextMenu,
        onDisengage,
    });
    
    // Renderer hook: Contains all drawing logic
    const { draw } = usePrototypeRenderer({
        canvasRef,
        worldGrid,
        zoom,
        playerRef,
        humanoidsRef,
        entities,
        equipment,
        groundItems,
        hoverPos,
        hitsplats,
        onRemoveHitsplat,
        monsterRespawnTimers,
        combatState,
        playerHp,
        playerMaxHp,
    });
    
    // Game Loop hook: Contains main loop, updates, and AI
    usePrototypeGameLoop({
        playerRef,
        humanoidsRef,
        checkAndExecuteAction,
        draw,
        entities,
        combatState,
        monsterRespawnTimers,
        checkWalkable,
        worldGridSize: { width: WORLD_GRID_WIDTH, height: WORLD_GRID_HEIGHT },
        onCombat,
        onPlayerMove,
        runCombatTick,
    });
    
    useImperativeHandle(ref, () => ({
        startInteraction,
        startMonsterPath: (monsterId, targetPos) => { /* Logic to be moved to its own hook if it becomes more complex */ }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                canvas.width = width;
                canvas.height = height;
                 const desiredVisibleTiles = 25; // This can be a prop
                setZoom(width / (desiredVisibleTiles * TILE_WIDTH));
            }
        });
        
        resizeObserver.observe(canvas);
        return () => resizeObserver.disconnect();
    }, []);

    return (
        <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
    );
});

export default GameCanvas;
