import { useRef, useEffect } from 'react';
import { PlayerModel } from '../playerModel';
import { HumanoidModel } from '../humanoidModel';
import { WorldEntity } from '../worldData';
import { findPath } from '../pathfinding';
import { CanvasCombatState } from '../GameCanvas';

interface GameLoopDependencies {
    playerRef: React.RefObject<PlayerModel>;
    humanoidsRef: React.RefObject<HumanoidModel[]>;
    checkAndExecuteAction: () => void;
    draw: () => void;
    entities: WorldEntity[];
    combatState: CanvasCombatState | null;
    monsterRespawnTimers: Record<string, number>;
    checkWalkable: (x: number, y: number) => boolean;
    worldGridSize: { width: number; height: number };
    onCombat: (entity: WorldEntity) => void;
    onPlayerMove: (pos: { x: number, y: number }) => void;
    runCombatTick: () => void;
}

export const usePrototypeGameLoop = (deps: GameLoopDependencies) => {
    const {
        playerRef, humanoidsRef, checkAndExecuteAction, draw,
        entities, combatState, monsterRespawnTimers, checkWalkable, worldGridSize, onCombat, onPlayerMove,
        runCombatTick
    } = deps;
    
    const lastFrameTime = useRef(0);
    const lastPlayerGridPos = useRef({ x: -1, y: -1 });

    useEffect(() => {
        let animationId: number;
        
        const loop = (time: number) => {
            if (!playerRef.current || !humanoidsRef.current) {
                animationId = requestAnimationFrame(loop);
                return;
            }
            if (lastFrameTime.current === 0) lastFrameTime.current = time;
            const deltaTime = time - lastFrameTime.current;
            lastFrameTime.current = time;
            const now = Date.now();

            if (combatState) {
                runCombatTick();
            }

            const player = playerRef.current;
            player.update(deltaTime);
            if (player.gridX !== lastPlayerGridPos.current.x || player.gridY !== lastPlayerGridPos.current.y) {
                onPlayerMove({ x: player.gridX, y: player.gridY });
                lastPlayerGridPos.current = { x: player.gridX, y: player.gridY };
            }

            humanoidsRef.current.forEach(npc => {
                const entityData = entities.find(e => e.id === npc.id);
                if (!entityData) return;

                if (npc.state === 'dead') {
                    const respawnTime = monsterRespawnTimers[npc.id];
                    if (respawnTime && now > respawnTime) {
                        npc.gridX = npc.spawnX;
                        npc.gridY = npc.spawnY;
                        npc.visualX = npc.spawnX;
                        npc.visualY = npc.spawnY;
                        npc.state = 'idle';
                    }
                    return;
                }

                npc.update(deltaTime);

                const isAggressive = npc.aggroTargetId === 'player';

                if (isAggressive && npc.aggroTimeout > 0 && now > npc.aggroTimeout) {
                    npc.aggroTargetId = null;
                    npc.aggroTimeout = 0;
                    npc.state = 'wandering';
                    return;
                }
                
                const leashDistance = Math.hypot(npc.gridX - npc.spawnX, npc.gridY - npc.spawnY);
                if(isAggressive && leashDistance > npc.leashRange) {
                    npc.aggroTargetId = null;
                    npc.state = 'wandering';
                    const pathHome = findPath(npc.gridX, npc.gridY, npc.spawnX, npc.spawnY, worldGridSize.width, worldGridSize.height, checkWalkable);
                    if (pathHome.length > 0) npc.setPath(pathHome);
                    return;
                }

                if (isAggressive) {
                    const dx = Math.abs(player.gridX - npc.gridX);
                    const dy = Math.abs(player.gridY - npc.gridY);
                    const distance = dx + dy;

                    if (distance <= 1 && !combatState) {
                        onCombat(entityData);
                    } else if (now - npc.lastPathTimestamp > 2000) {
                        npc.lastPathTimestamp = now;
                        const path = findPath(npc.gridX, npc.gridY, player.gridX, player.gridY, worldGridSize.width, worldGridSize.height, checkWalkable);
                        if (path.length > 1) {
                            npc.setPath(path.slice(0, path.length - 1));
                        }
                    }
                } else if ((npc.state === 'idle' || (npc.state === 'wandering' && npc.path.length === 0)) && entityData.wanderRange) {
                    npc.wanderCooldown -= deltaTime;
                    if (npc.wanderCooldown <= 0) {
                        npc.state = 'wandering';
                        const targetX = npc.spawnX + Math.floor(Math.random() * (entityData.wanderRange * 2 + 1)) - entityData.wanderRange;
                        const targetY = npc.spawnY + Math.floor(Math.random() * (entityData.wanderRange * 2 + 1)) - entityData.wanderRange;
                        
                        if(checkWalkable(targetX, targetY)) {
                            const path = findPath(npc.gridX, npc.gridY, targetX, targetY, worldGridSize.width, worldGridSize.height, checkWalkable);
                            if (path.length > 0) npc.setPath(path);
                        }
                        npc.wanderCooldown = Math.random() * 8000 + 4000;
                    }
                }
            });
            
            checkAndExecuteAction();
            draw();
            
            animationId = requestAnimationFrame(loop);
        };
        
        animationId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationId);
    }, [
        playerRef, humanoidsRef, checkAndExecuteAction, draw,
        entities, combatState, monsterRespawnTimers, checkWalkable, worldGridSize, onCombat, onPlayerMove,
        runCombatTick
    ]);
};
