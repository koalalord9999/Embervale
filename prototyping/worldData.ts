import { InventorySlot } from '../types';

export interface WorldEntity {
    id: string;
    name: string;
    x: number;
    y: number;
    spawnX?: number;
    spawnY?: number;
    type: 'npc' | 'object' | 'portal';
    color: string;
    activityId?: string;
    monsterId?: string;
    pickpocket?: { lootTableId: string; };
    wanderRange?: number;
    aiType?: 'smart' | 'basic';
    leashRange?: number;
}