import { useState, useCallback, useEffect } from 'react';
import { PlayerModel } from '../playerModel';
import { HumanoidModel } from '../humanoidModel';
import { WorldEntity } from '../worldData';
import { findPath } from '../pathfinding';
import { isoToScreen, screenToIso } from '../isoUtils';
import { ContextMenuOption } from '../../components/common/ContextMenu';
import { ContextMenuState } from '../../hooks/useUIState';
import { ITEMS } from '../../constants';
import { getDisplayName } from '../../components/panels/InventorySlot';
import { CanvasCombatState } from '../GameCanvas';
import { PendingAction } from './usePrototypeActions';
import { GroundItem } from '../../types';

interface InputDependencies {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    playerRef: React.RefObject<PlayerModel>;
    zoom: number;
    checkWalkable: (x: number, y: number) => boolean;
    worldGridSize: { width: number; height: number };
    humanoidsRef: React.RefObject<HumanoidModel[]>;
    entities: WorldEntity[];
    groundItems: Record<string, GroundItem[]>;
    combatState: CanvasCombatState | null;
    monsterRespawnTimers: Record<string, number>;
    onWalk: (path: { x: number; y: number }[]) => void;
    onStartInteraction: (action: PendingAction) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    onDisengage: () => void;
}

export const usePrototypeInput = (deps: InputDependencies) => {
    const { canvasRef, playerRef, zoom, checkWalkable, worldGridSize, humanoidsRef, entities, groundItems, combatState, monsterRespawnTimers, onWalk, onStartInteraction, setContextMenu, onDisengage } = deps;
    const [hoverPos, setHoverPos] = useState<{ x: number, y: number } | null>(null);

    const getGridPosFromEvent = useCallback((e: MouseEvent | TouchEvent): { x: number, y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas || !playerRef.current) return null;
        
        if (zoom <= 0 || isNaN(zoom)) return null;

        const rect = canvas.getBoundingClientRect();
        const point = 'touches' in e ? e.touches[0] : e;
        
        const mouseX = point.clientX - rect.left;
        const mouseY = point.clientY - rect.top;

        const player = playerRef.current;
        const worldOriginX = (worldGridSize.width + worldGridSize.height) * 64 / 4;
        const worldOriginY = 48 * 2;
        const playerWorldPos = isoToScreen(player.visualX, player.visualY, worldOriginX, worldOriginY);

        const cameraX = playerWorldPos.x - canvas.width / (2 * zoom);
        const cameraY = playerWorldPos.y - canvas.height / (2 * zoom);

        const worldMouseX = mouseX / zoom + cameraX;
        const worldMouseY = mouseY / zoom + cameraY;

        return screenToIso(worldMouseX, worldMouseY, worldOriginX, worldOriginY);
    }, [zoom, playerRef, canvasRef, worldGridSize]);
    
    const handleContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
        const gridPos = getGridPosFromEvent(e);
        if (!gridPos || !humanoidsRef.current) return;

        const humanoidOnTile = humanoidsRef.current.find(h => h.gridX === gridPos.x && h.gridY === gridPos.y);
        const entityOnTile = humanoidOnTile ? entities.find(ent => ent.id === humanoidOnTile.id) : undefined;
        const key = `${gridPos.x},${gridPos.y}`;
        const itemsOnTile = groundItems[key] || [];
        const options: ContextMenuOption[] = [];
        let title: string | undefined = undefined;

        if (entityOnTile) {
            const isRespawning = monsterRespawnTimers[entityOnTile.id] > Date.now();
            if (!isRespawning) {
                title = entityOnTile.name;
                if (entityOnTile.activityId && entityOnTile.type === 'npc') options.push({ label: 'Talk', onClick: () => onStartInteraction({ type: 'interact', entity: entityOnTile }) });
                if (entityOnTile.monsterId) options.push({ label: 'Attack', onClick: () => onStartInteraction({ type: 'combat', entity: entityOnTile }) });
                if (entityOnTile.pickpocket) options.push({ label: 'Pickpocket', onClick: () => onStartInteraction({ type: 'pickpocket', entity: entityOnTile }) });
            }
        }
    
        if (itemsOnTile.length > 0) {
            if (!title) title = 'Ground';
            itemsOnTile.slice(0, 5).forEach(groundItem => {
                options.push({ label: `Take ${getDisplayName(groundItem.item)}`, onClick: () => onStartInteraction({type: 'pickup', uniqueId: groundItem.uniqueId, x: gridPos.x, y: gridPos.y})});
            });
            if (itemsOnTile.length > 1) options.push({ label: 'Take All', onClick: () => onStartInteraction({type: 'pickup_all', items: itemsOnTile, x: gridPos.x, y: gridPos.y})});
        }
        
        if (checkWalkable(gridPos.x, gridPos.y)) {
            options.push({ label: 'Walk here', onClick: () => {
                if (combatState) onDisengage();
                const path = findPath(playerRef.current!.gridX, playerRef.current!.gridY, gridPos.x, gridPos.y, worldGridSize.width, worldGridSize.height, checkWalkable);
                if (path.length > 0) onWalk(path);
            } });
        }
    
        if (options.length > 0) setContextMenu({ options, triggerEvent: e as any, isTouchInteraction: false, title });
    }, [getGridPosFromEvent, humanoidsRef, entities, groundItems, monsterRespawnTimers, onStartInteraction, checkWalkable, combatState, onDisengage, playerRef, worldGridSize, onWalk, setContextMenu]);

    const handleClick = useCallback((e: MouseEvent) => {
        const gridPos = getGridPosFromEvent(e);
        if (!gridPos || !playerRef.current || !humanoidsRef.current) return;
        
        if (combatState) onDisengage();

        const key = `${gridPos.x},${gridPos.y}`;
        const itemsOnTile = groundItems[key] || [];
        const clickedHumanoid = humanoidsRef.current.find(h => h.gridX === gridPos.x && h.gridY === gridPos.y);
        const clickedEntity = clickedHumanoid ? entities.find(e => e.id === clickedHumanoid.id) : undefined;

        if (clickedEntity) {
            const actionType = clickedEntity.monsterId ? 'combat' : 'interact';
            onStartInteraction({ type: actionType, entity: clickedEntity });
        } else if (itemsOnTile.length > 0) {
            const mostValuableItem = itemsOnTile.sort((a,b) => (ITEMS[b.item.itemId]?.value ?? 0) - (ITEMS[a.item.itemId]?.value ?? 0))[0];
            onStartInteraction({type: 'pickup', uniqueId: mostValuableItem.uniqueId, x: gridPos.x, y: gridPos.y});
        } else if (checkWalkable(gridPos.x, gridPos.y)) {
            const path = findPath(playerRef.current.gridX, playerRef.current.gridY, gridPos.x, gridPos.y, worldGridSize.width, worldGridSize.height, checkWalkable);
            if (path.length > 0) onWalk(path);
        }
    }, [getGridPosFromEvent, playerRef, humanoidsRef, combatState, onDisengage, groundItems, entities, onStartInteraction, checkWalkable, onWalk, worldGridSize]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const gridPos = getGridPosFromEvent(e);
        if (gridPos && (hoverPos?.x !== gridPos.x || hoverPos?.y !== gridPos.y)) setHoverPos(gridPos);
        else if (!gridPos && hoverPos !== null) setHoverPos(null);
    }, [getGridPosFromEvent, hoverPos]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('contextmenu', handleContextMenu);
        canvas.addEventListener('mousemove', handleMouseMove);
        const handleMouseLeave = () => setHoverPos(null);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            canvas.removeEventListener('click', handleClick);
            canvas.removeEventListener('contextmenu', handleContextMenu);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [canvasRef, handleClick, handleContextMenu, handleMouseMove]);

    return { hoverPos };
};
