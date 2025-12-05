
interface Node {
    x: number;
    y: number;
    g: number;
    h: number;
    f: number;
    parent: Node | null;
}

export const findPath = (
    startX: number, startY: number, 
    endX: number, endY: number, 
    gridWidth: number, gridHeight: number, 
    isWalkable: (x: number, y: number) => boolean
): { x: number, y: number }[] => {
    
    const openList: Node[] = [];
    const closedList: boolean[][] = Array(gridWidth).fill(false).map(() => Array(gridHeight).fill(false));
    
    if (!isWalkable(endX, endY)) return [];

    openList.push({ x: startX, y: startY, g: 0, h: 0, f: 0, parent: null });
    
    while (openList.length > 0) {
        let currentNode = openList[0];
        let currentIndex = 0;
        
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f < currentNode.f) {
                currentNode = openList[i];
                currentIndex = i;
            }
        }
        
        openList.splice(currentIndex, 1);
        closedList[currentNode.x][currentNode.y] = true;
        
        if (currentNode.x === endX && currentNode.y === endY) {
            const path: { x: number, y: number }[] = [];
            let curr: Node | null = currentNode;
            while (curr) {
                path.push({ x: curr.x, y: curr.y });
                curr = curr.parent;
            }
            return path.reverse().slice(1);
        }
        
        const neighbors = [
            { x: 0, y: -1, cost: 1 }, { x: 0, y: 1, cost: 1 }, { x: -1, y: 0, cost: 1 }, { x: 1, y: 0, cost: 1 },
        ];
        
        for (const offset of neighbors) {
            const neighborX = currentNode.x + offset.x;
            const neighborY = currentNode.y + offset.y;
            
            if (neighborX >= 0 && neighborX < gridWidth && neighborY >= 0 && neighborY < gridHeight) {
                if (!closedList[neighborX][neighborY] && isWalkable(neighborX, neighborY)) {
                    const gScore = currentNode.g + offset.cost;
                    const hScore = Math.abs(neighborX - endX) + Math.abs(neighborY - endY);
                    const fScore = gScore + hScore;
                    
                    const existingNode = openList.find(n => n.x === neighborX && n.y === neighborY);
                    
                    if (!existingNode) {
                        openList.push({ x: neighborX, y: neighborY, g: gScore, h: hScore, f: fScore, parent: currentNode });
                    } else if (gScore < existingNode.g) {
                        existingNode.g = gScore;
                        existingNode.f = fScore;
                        existingNode.parent = currentNode;
                    }
                }
            }
        }
    }
    
    return []; // No path found
};
