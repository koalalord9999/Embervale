import { useRef } from 'react';
import { PlayerModel } from '../playerModel';
import { HumanoidModel } from '../humanoidModel';
import { findPath } from '../pathfinding';
import { WorldEntity } from '../worldData';
import { GroundItem } from '../../types';

export type PendingAction =
  | { type: 'interact'; entity: WorldEntity }
  | { type: 'combat'; entity: WorldEntity }
  | { type: 'pickpocket'; entity: WorldEntity }
  | { type: 'pickup'; uniqueId: number; x: number; y: number }
  | { type: 'pickup_all'; items: GroundItem[]; x: number, y: number };

interface ActionDependencies {
    playerRef: React.RefObject<PlayerModel>;
    humanoidsRef: React.RefObject<HumanoidModel[]>;
    checkWalkable: (x: number, y: number) => boolean;
    worldGridSize: { width: number; height: number };
    addLog: (msg: string) => void;
    onInteract: (entity: WorldEntity) => void;
    onCombat: (entity: WorldEntity) => void;
    onPickpocket: (entity: WorldEntity) => void;
    onPickUpItem: (id: number) => void;
    onPickUpAll: (items: GroundItem[]) => void;
}

export const usePrototypeActions = (deps: ActionDependencies) => {
    const { playerRef, humanoidsRef, checkWalkable, worldGridSize, addLog, onInteract, onCombat, onPickpocket, onPickUpItem, onPickUpAll } = deps;
    const pendingActionRef = useRef<PendingAction | null>(null);

    const startInteraction = (action: PendingAction) => {
        if (!playerRef.current || !humanoidsRef.current) return;
        const player = playerRef.current;

        const now = Date.now();
        if (now - player.lastPathTimestamp < 200) {
            return;
        }
        player.lastPathTimestamp = now;

        pendingActionRef.current = action;
    
        let targetX: number | undefined;
        let targetY: number | undefined;
        let adjacent = false;
        
        if (action.type === 'interact' || action.type === 'combat' || action.type === 'pickpocket') {
            const currentEntityModel = humanoidsRef.current.find(h => h.id === action.entity.id);
            if (currentEntityModel) {
                targetX = currentEntityModel.gridX;
                targetY = currentEntityModel.gridY;
                adjacent = true;
            } else {
                addLog("Cannot find that person.");
                pendingActionRef.current = null;
                return;
            }
        } else if (action.type === 'pickup' || action.type === 'pickup_all') {
            targetX = action.x;
            targetY = action.y;
        }
    
        if (targetX === undefined || targetY === undefined) {
            pendingActionRef.current = null;
            return;
        }
    
        let pathTargetX = targetX;
        let pathTargetY = targetY;
    
        if (adjacent) {
            const neighbors = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
            const validTiles = neighbors.map(off => ({x: targetX! + off.x, y: targetY! + off.y})).filter(t => checkWalkable(t.x, t.y));
            
            if (validTiles.length === 0) { 
                addLog("Cannot reach that!"); 
                pendingActionRef.current = null;
                return;
            }
            
            validTiles.sort((a, b) => Math.hypot(player.gridX - a.x, player.gridY - a.y) - Math.hypot(player.gridX - b.x, player.gridY - b.y));
            pathTargetX = validTiles[0].x;
            pathTargetY = validTiles[0].y;
        }
    
        const dx = Math.abs(player.gridX - pathTargetX);
        const dy = Math.abs(player.gridY - pathTargetY);
    
        if (dx === 0 && dy === 0) {
            player.setPath([]); 
            return;
        }
        
        const path = findPath(player.gridX, player.gridY, pathTargetX, pathTargetY, worldGridSize.width, worldGridSize.height, checkWalkable);
    
        if (path.length > 0) {
            player.setPath(path);
        } else {
            addLog("Cannot find a path.");
            pendingActionRef.current = null;
        }
    };

    const checkAndExecuteAction = () => {
        if (!pendingActionRef.current || !playerRef.current || !humanoidsRef.current) return;
        
        const player = playerRef.current;
        if (player.path.length > 0) return;

        const action = pendingActionRef.current;
        let targetX = 0, targetY = 0;
        let adjacent = false;

        if (action.type === 'interact' || action.type === 'combat' || action.type === 'pickpocket') {
            const currentEntity = humanoidsRef.current.find(h => h.id === action.entity.id);
            if (currentEntity) {
                targetX = currentEntity.gridX;
                targetY = currentEntity.gridY;
                adjacent = true;
            }
        } else if (action.type === 'pickup' || action.type === 'pickup_all') {
            targetX = action.x;
            targetY = action.y;
        }

        const dx = Math.abs(player.gridX - targetX);
        const dy = Math.abs(player.gridY - targetY);
        const isAtTarget = adjacent ? (dx <= 1 && dy <= 1 && (dx+dy > 0)) : (dx === 0 && dy === 0);

        if (isAtTarget) {
            switch (action.type) {
                case 'interact': onInteract(action.entity); break;
                case 'combat': onCombat(action.entity); break;
                case 'pickpocket': onPickpocket(action.entity); break;
                case 'pickup': onPickUpItem(action.uniqueId); break;
                case 'pickup_all': onPickUpAll(action.items); break;
            }
            pendingActionRef.current = null;
        } else {
            // Target moved, re-path
            startInteraction(action);
        }
    };

    return { startInteraction, checkAndExecuteAction, pendingActionRef };
};
