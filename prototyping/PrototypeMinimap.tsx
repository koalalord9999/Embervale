
import React, { useRef, useEffect } from 'react';
import { WorldEntity } from './worldData';
import { TILE_TYPES } from './tileData';
import { PlayerSkill } from '../types';

interface HpOrbProps {
    currentHp: number;
    maxHp: number;
    showHealthNumbers: boolean;
}

const HpOrb: React.FC<HpOrbProps> = ({ currentHp, maxHp, showHealthNumbers }) => {
    const percentage = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
    const liquidClass = 'bg-red-600';
    const heartIconClass = 'filter invert opacity-25';

    return (
      <div 
        className="relative w-11 h-11 rounded-full border-2 border-gray-500 bg-gray-800 overflow-hidden shadow-lg"
      >
        <div 
          className={`absolute bottom-0 left-0 w-full ${liquidClass} transition-all duration-300 ease-in-out`} 
          style={{ height: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <img 
                src="https://api.iconify.design/game-icons:hearts.svg" 
                alt="" 
                className={`w-8 h-8 transition-all ${heartIconClass}`} 
            />
        </div>
        <div className="absolute top-1 left-1 w-8 h-8 rounded-full bg-white/20 blur-sm" />
        {showHealthNumbers && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="font-bold text-lg text-white" style={{ textShadow: '1px 1px 2px black' }}>
                    {currentHp}
                </span>
            </div>
        )}
      </div>
    );
};

const PrayerOrb: React.FC<{ currentPrayer: number, maxPrayer: number }> = ({ currentPrayer, maxPrayer }) => {
    const percentage = maxPrayer > 0 ? (currentPrayer / maxPrayer) * 100 : 0;
  
    return (
      <div className="relative w-11 h-11 rounded-full border-2 border-gray-500 bg-gray-800 overflow-hidden shadow-lg">
        <div className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-300 ease-in-out" style={{ height: `${percentage}%` }} />
        <div className="absolute inset-0 flex items-center justify-center">
            <img src="https://api.iconify.design/game-icons:polar-star.svg" alt="" className="w-8 h-8 filter invert opacity-25" />
        </div>
        <div className="absolute top-1 left-1 w-8 h-8 rounded-full bg-white/20 blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="font-bold text-lg text-white" style={{ textShadow: '1px 1px 2px black' }}>
                {Math.floor(currentPrayer)}
            </span>
        </div>
      </div>
    );
};


interface PrototypeMinimapProps {
    currentHp: number;
    maxHp: number;
    currentPrayer: number;
    maxPrayer: number;
    ui: any; // Simplified for prototype
    playerX: number;
    playerY: number;
    entities: WorldEntity[];
    worldGrid: number[][];
}

const PrototypeMinimap: React.FC<PrototypeMinimapProps> = ({ currentHp, maxHp, currentPrayer, maxPrayer, ui, playerX = 0, playerY = 0, entities = [], worldGrid = [] }) => {
    const minimapCanvasRef = useRef<HTMLCanvasElement>(null);
    const TILE_SIZE = 8;
    const RADIUS = 11;

    useEffect(() => {
        const canvas = minimapCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas || !worldGrid.length) return;

        ctx.fillStyle = '#1a2e22'; // Dark green background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let y = -RADIUS; y <= RADIUS; y++) {
            for (let x = -RADIUS; x <= RADIUS; x++) {
                const gridX = Math.floor(playerX) + x;
                const gridY = Math.floor(playerY) + y;
                
                if (gridX >= 0 && gridX < worldGrid.length && gridY >= 0 && gridY < worldGrid[0].length) {
                    const tileId = worldGrid[gridX][gridY];
                    const tileType = TILE_TYPES.find(t => t.id === tileId);
                    if (tileType && tileType.id !== 1 && tileType.id !== 2) { // Don't draw walls/obstacles
                        ctx.fillStyle = tileType.color;
                        ctx.fillRect(centerX + x * TILE_SIZE, centerY + y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                }
            }
        }

        entities.forEach(entity => {
            const dx = entity.x - playerX;
            const dy = entity.y - playerY;
            if (Math.abs(dx) <= RADIUS && Math.abs(dy) <= RADIUS) {
                ctx.fillStyle = 'yellow';
                ctx.fillRect(centerX + dx * TILE_SIZE, centerY + dy * TILE_SIZE, 5, 5);
            }
        });

        ctx.fillStyle = 'white';
        ctx.fillRect(centerX, centerY, 3, 3);

    }, [playerX, playerY, entities, worldGrid]);

    return (
        <div className="flex items-start gap-1 pointer-events-auto">
            <div className="flex flex-col gap-2 relative pt-8">
                <HpOrb currentHp={currentHp} maxHp={maxHp} showHealthNumbers={true} />
                <PrayerOrb currentPrayer={currentPrayer} maxPrayer={maxPrayer} />
            </div>

            <div className="relative w-[180px] h-[180px]">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-yellow-600">
                    <canvas ref={minimapCanvasRef} width={180} height={180} />
                </div>
                <div className="absolute -top-2 left-2 -translate-x-1/2 w-10 h-10 pointer-events-none">
                     <img src="https://api.iconify.design/game-icons:compass.svg" alt="Compass" className="w-full h-full filter invert opacity-80" />
                </div>
                <button 
                    className="absolute z-10 w-11 h-11 rounded-full bg-blue-800 hover:bg-blue-700 border-2 border-blue-500 flex items-center justify-center bottom-0 right-0"
                    aria-label="Open Map"
                >
                     <img src="https://api.iconify.design/game-icons:world.svg" alt="Map" className="w-7 h-7 filter invert" />
                </button>
            </div>
        </div>
    );
};

export default PrototypeMinimap;
