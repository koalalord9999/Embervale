export interface BaseDrop {
    itemId?: string;
    tableId?: string;
    minQuantity?: number;
    maxQuantity?: number;
    noted?: boolean;
    multiRoll?: {
        tableId: string;
        maxRolls: number;
        rollAgainChance: number;
    };
}
export interface GuaranteedDrop extends BaseDrop {}
export interface WeightedDrop extends BaseDrop {
    chance: number | string; // Probability (decimal or fraction string)
}
export interface TertiaryDrop extends BaseDrop {
    chance: number; // Probability
}