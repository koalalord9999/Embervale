
export interface AgilityObstacle {
    id: string;
    name: string;
    level: number;
    xp: number;
    failXp?: number;
    failDamage?: { min: number; max: number };
    duration: number; // Duration in game ticks (1 tick = 600ms)
    failPoiId?: string;
    successPoiId?: string;
    canFail?: boolean;
    failMessage?: string;
}

export interface AgilityCourse {
    id: string;
    name: string;
    level: number;
    obstacles: AgilityObstacle[];
    lapBonusXp: number;
    energyRestore?: number;
}

export interface AgilityState {
    activeCourseId: string | null;
    currentObstacleIndex: number;
    lapsCompleted: Record<string, number>; // e.g., { meadowdale_rooftops: 10 }
}