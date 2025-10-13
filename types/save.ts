import { PlayerType } from './player';

export interface SlotMetadata {
    username: string;
    playerType: PlayerType;
    combatLevel: number;
    totalLevel: number;
    currentPoiName: string;
    isDead: boolean;
}

export interface Slot {
    slotId: number;
    data: any; // Full game state
    metadata?: SlotMetadata;
    createdAt?: Date;
    updatedAt?: Date;
}
