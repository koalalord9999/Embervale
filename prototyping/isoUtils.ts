
export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 48;

export const isoToScreen = (x: number, y: number, originX: number, originY: number) => {
    return {
        x: originX + (x - y) * (TILE_WIDTH / 2),
        y: originY + (x + y) * (TILE_HEIGHT / 2)
    };
};

export const screenToIso = (screenX: number, screenY: number, originX: number, originY: number) => {
    const adjX = screenX - originX;
    const adjY = screenY - originY;
    
    const tileY = (adjY / (TILE_HEIGHT / 2) - adjX / (TILE_WIDTH / 2)) / 2;
    const tileX = (adjY / (TILE_HEIGHT / 2) + adjX / (TILE_WIDTH / 2)) / 2;
    
    return { x: Math.floor(tileX), y: Math.floor(tileY) };
};
